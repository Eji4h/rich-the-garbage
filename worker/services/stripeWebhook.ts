import Stripe from 'stripe';
import { Env, ErrorResponse } from '../types';
import { jsonResponse, errorResponse } from '../response';

const STRIPE_EVENT_PREFIX = 'stripe:event:';
const STRIPE_APPLIED_PREFIX = 'stripe:applied:';
const STRIPE_BY_DAY_PREFIX = 'stripe:byDay:';
const STRIPE_BY_TYPE_PREFIX = 'stripe:byType:';

interface StoredStripeEvent {
  receivedAt: string;
  event: Stripe.Event;
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

async function storeEvent(
  kv: KVNamespace,
  event: Stripe.Event,
  redactedEvent: Stripe.Event,
): Promise<void> {
  const eventId = event.id;
  const eventKey = `${STRIPE_EVENT_PREFIX}${eventId}`;

  // Check if already exists (idempotency)
  const existing = await kv.get(eventKey);
  if (existing) {
    return; // Already processed, skip
  }

  const stored: StoredStripeEvent = {
    receivedAt: new Date().toISOString(),
    event: redactedEvent,
  };

  // Store the event
  await kv.put(eventKey, JSON.stringify(stored));

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
  event: Stripe.Event,
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

  let amountMinor: number | undefined;
  let shouldProcess = false;

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    if (session.payment_status === 'paid' && session.amount_total) {
      amountMinor = session.amount_total;
      shouldProcess = true;
    }
  } else if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object as Stripe.PaymentIntent;
    if (paymentIntent.status === 'succeeded') {
      amountMinor = paymentIntent.amount_received ?? paymentIntent.amount;
      shouldProcess = true;
    }
  }

  if (!shouldProcess || !amountMinor || amountMinor <= 0) {
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
    const signature = request.headers.get('stripe-signature');

    if (!signature) {
      return jsonResponse<ErrorResponse>(
        { error: 'Missing Stripe-Signature header' },
        400,
      );
    }

    // Initialize Stripe with Web Crypto for Workers
    const webCrypto = Stripe.createSubtleCryptoProvider();

    // Verify signature and construct event using Stripe SDK
    const event = await Stripe.webhooks.constructEventAsync(
      rawBody,
      signature,
      env.STRIPE_WEBHOOK_SECRET,
      undefined,
      webCrypto,
    );

    // Redact PII from event (convert to plain object, redact, then back to Stripe.Event shape)
    const eventJson = JSON.parse(JSON.stringify(event)) as unknown;
    const redactedJson = redactPII(eventJson);
    const redactedEvent = redactedJson as Stripe.Event;

    // Store event (idempotent - returns early if exists)
    await storeEvent(env.DONATIONS_KV, event, redactedEvent);

    // Update projections (idempotent - checks applied marker)
    await updateProjections(env.DONATIONS_KV, event);

    // Always return 200 OK (even for duplicates)
    return jsonResponse({ received: true });
  } catch (error) {
    console.error('Error handling webhook:', error);
    if (error instanceof Stripe.errors.StripeSignatureVerificationError) {
      return jsonResponse<ErrorResponse>({ error: 'Invalid signature' }, 401);
    }
    return errorResponse(
      'Failed to process webhook',
      error instanceof Error ? error.message : 'Unknown error',
    );
  }
}
