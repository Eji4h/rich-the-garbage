import { Env, StripeEventData, ErrorResponse } from '../types';
import { jsonResponse, errorResponse } from '../response';

const STRIPE_EVENT_PREFIX = 'stripe:event:';
const STRIPE_APPLIED_PREFIX = 'stripe:applied:';
const STRIPE_BY_DAY_PREFIX = 'stripe:byDay:';
const STRIPE_BY_TYPE_PREFIX = 'stripe:byType:';

interface StripeEvent {
  id: string;
  type: string;
  created: number;
  livemode: boolean;
  api_version?: string;
  request?: {
    id?: string;
    idempotency_key?: string;
  };
  data: {
    object: unknown;
  };
}

function redactPII(obj: unknown): unknown {
  if (typeof obj !== 'object' || obj === null) {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(redactPII);
  }

  const redacted = { ...(obj as Record<string, unknown>) };

  // Remove PII fields
  const piiFields = [
    'customer_details',
    'customer_email',
    'billing_details',
    'shipping_details',
    'email',
    'name',
    'phone',
    'address',
  ];

  for (const field of piiFields) {
    if (field in redacted) {
      delete redacted[field];
    }
  }

  // Recursively redact nested objects
  for (const [key, value] of Object.entries(redacted)) {
    if (typeof value === 'object' && value !== null) {
      redacted[key] = redactPII(value);
    }
  }

  return redacted;
}

function normalizeEventObject(data: StripeEvent): StripeEventData['object'] {
  const obj = data.data.object as Record<string, unknown>;

  const kind =
    obj.object === 'checkout.session'
      ? 'checkout.session'
      : obj.object === 'payment_intent'
        ? 'payment_intent'
        : 'other';

  return {
    kind,
    id: (obj.id as string) || '',
    amountTotalMinor:
      typeof obj.amount_total === 'number'
        ? obj.amount_total
        : typeof obj.amount === 'number'
          ? obj.amount
          : undefined,
    currency: obj.currency as string | undefined,
    status: obj.status as string | undefined,
    paymentStatus: obj.payment_status as string | undefined,
    mode: obj.mode as string | undefined,
  };
}

async function verifyStripeSignature(
  payload: string,
  signature: string,
  secret: string,
): Promise<boolean> {
  try {
    const elements = signature.split(',');
    const timestamp = elements.find((e) => e.startsWith('t='))?.split('=')[1];
    const signatures = elements
      .filter((e) => e.startsWith('v1='))
      .map((e) => e.split('=')[1]);

    if (!timestamp || signatures.length === 0) {
      return false;
    }

    const signedPayload = `${timestamp}.${payload}`;
    const encoder = new TextEncoder();
    const keyData = encoder.encode(secret);
    const messageData = encoder.encode(signedPayload);

    const cryptoKey = await crypto.subtle.importKey(
      'raw',
      keyData,
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign'],
    );

    const signatureBuffer = await crypto.subtle.sign(
      'HMAC',
      cryptoKey,
      messageData,
    );

    const signatureHex = Array.from(new Uint8Array(signatureBuffer))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');

    return signatures.some((sig) => sig === signatureHex);
  } catch (error) {
    console.error('Error verifying signature:', error);
    return false;
  }
}

async function storeEvent(
  kv: KVNamespace,
  event: StripeEvent,
  rawRedacted: unknown,
): Promise<void> {
  const eventId = event.id;
  const eventKey = `${STRIPE_EVENT_PREFIX}${eventId}`;

  // Check if already exists (idempotency)
  const existing = await kv.get(eventKey);
  if (existing) {
    return; // Already processed, skip
  }

  const normalized: StripeEventData = {
    eventId,
    type: event.type,
    created: event.created,
    livemode: event.livemode,
    apiVersion: event.api_version,
    request: event.request
      ? {
          id: event.request.id,
          idempotencyKey: event.request.idempotency_key,
        }
      : undefined,
    object: normalizeEventObject(event),
    receivedAt: new Date().toISOString(),
    raw: rawRedacted,
  };

  // Store the event
  await kv.put(eventKey, JSON.stringify(normalized));

  // Store pointer keys for querying
  const dateStr = new Date(event.created * 1000)
    .toISOString()
    .split('T')[0]
    .replace(/-/g, '');
  await kv.put(`${STRIPE_BY_DAY_PREFIX}${dateStr}:${eventId}`, '');
  await kv.put(`${STRIPE_BY_TYPE_PREFIX}${event.type}:${eventId}`, '');
}

async function updateProjections(
  kv: KVNamespace,
  event: StripeEvent,
  normalized: StripeEventData['object'],
): Promise<void> {
  const eventId = event.id;
  const appliedKey = `${STRIPE_APPLIED_PREFIX}${eventId}`;

  // Check if already applied (idempotency for projections)
  const alreadyApplied = await kv.get(appliedKey);
  if (alreadyApplied) {
    return; // Already applied, skip
  }

  // Only process donation-related events
  if (
    event.type !== 'checkout.session.completed' &&
    event.type !== 'payment_intent.succeeded'
  ) {
    return;
  }

  // Only process if payment was successful
  if (
    normalized.status !== 'complete' &&
    normalized.paymentStatus !== 'succeeded'
  ) {
    return;
  }

  const amountMinor = normalized.amountTotalMinor;
  if (!amountMinor || amountMinor <= 0) {
    return;
  }

  // Update totals (idempotent)
  const totalsKey = 'donation:totals';
  const existingTotals = await kv.get(totalsKey);
  const totals: { count: number; amountMinor: number } = existingTotals
    ? JSON.parse(existingTotals)
    : { count: 0, amountMinor: 0 };

  totals.count += 1;
  totals.amountMinor += amountMinor;

  await kv.put(totalsKey, JSON.stringify(totals));

  // Update per-day totals
  const dateStr = new Date(event.created * 1000)
    .toISOString()
    .split('T')[0]
    .replace(/-/g, '');
  const dayKey = `donation:byDay:${dateStr}`;
  const existingDay = await kv.get(dayKey);
  const dayTotals: { count: number; amountMinor: number } = existingDay
    ? JSON.parse(existingDay)
    : { count: 0, amountMinor: 0 };

  dayTotals.count += 1;
  dayTotals.amountMinor += amountMinor;

  await kv.put(dayKey, JSON.stringify(dayTotals));

  // Mark as applied
  await kv.put(appliedKey, '1');
}

export async function handleStripeWebhook(
  request: Request,
  env: Env,
): Promise<Response> {
  if (request.method !== 'POST') {
    return jsonResponse<ErrorResponse>({ error: 'Method not allowed' }, 405);
  }

  try {
    // Get raw body for signature verification
    const rawBody = await request.text();
    const signature = request.headers.get('Stripe-Signature');

    if (!signature) {
      return jsonResponse<ErrorResponse>(
        { error: 'Missing Stripe-Signature header' },
        400,
      );
    }

    // Verify signature
    const isValid = await verifyStripeSignature(
      rawBody,
      signature,
      env.STRIPE_WEBHOOK_SECRET,
    );

    if (!isValid) {
      return jsonResponse<ErrorResponse>({ error: 'Invalid signature' }, 401);
    }

    // Parse event
    const event = JSON.parse(rawBody) as StripeEvent;

    // Redact PII from raw payload
    const rawRedacted = redactPII(JSON.parse(rawBody));

    // Store event (idempotent - returns early if exists)
    await storeEvent(env.DONATIONS_KV, event, rawRedacted);

    // Update projections (idempotent - checks applied marker)
    const normalized = normalizeEventObject(event);
    await updateProjections(env.DONATIONS_KV, event, normalized);

    // Always return 200 OK (even for duplicates)
    return jsonResponse({ received: true });
  } catch (error) {
    console.error('Error handling webhook:', error);
    return errorResponse(
      'Failed to process webhook',
      error instanceof Error ? error.message : 'Unknown error',
    );
  }
}
