import {
  Env,
  DonateRequestBody,
  DonateCheckoutResponse,
  ErrorResponse,
  StripeCheckoutSession,
} from '../types';
import { jsonResponse, errorResponse, handleOptions } from '../response';

const STRIPE_API_URL = 'https://api.stripe.com/v1';
const MIN_AMOUNT_CENTS = 100; // $1 minimum
const MAX_AMOUNT_CENTS = 100000; // $1000 maximum

async function createStripeCheckoutSession(
  amount: number,
  env: Env,
  origin: string,
): Promise<StripeCheckoutSession> {
  const params = new URLSearchParams({
    mode: 'payment',
    'line_items[0][price_data][currency]': 'usd',
    'line_items[0][price_data][product_data][name]':
      'Donation to Rich The Garbage',
    'line_items[0][price_data][unit_amount]': amount.toString(),
    'line_items[0][quantity]': '1',
    success_url: `${origin}?donate=success`,
    cancel_url: `${origin}?donate=cancel`,
  });

  const response = await fetch(`${STRIPE_API_URL}/checkout/sessions`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.STRIPE_SECRET_KEY}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: params.toString(),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Stripe API error:', errorText);
    throw new Error(`Stripe API error: ${response.status}`);
  }

  return (await response.json()) as StripeCheckoutSession;
}

async function verifyWebhookSignature(
  payload: string,
  signature: string,
  secret: string,
): Promise<boolean> {
  const encoder = new TextEncoder();

  // Parse the signature header
  const elements = signature.split(',');
  let timestamp = '';
  let v1Signature = '';

  for (const element of elements) {
    const [key, value] = element.split('=');
    if (key === 't') timestamp = value;
    if (key === 'v1') v1Signature = value;
  }

  if (!timestamp || !v1Signature) {
    return false;
  }

  // Check timestamp tolerance (5 minutes)
  const currentTime = Math.floor(Date.now() / 1000);
  const eventTime = parseInt(timestamp, 10);
  if (Math.abs(currentTime - eventTime) > 300) {
    return false;
  }

  // Compute expected signature
  const signedPayload = `${timestamp}.${payload}`;
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );

  const signatureBytes = await crypto.subtle.sign(
    'HMAC',
    key,
    encoder.encode(signedPayload),
  );

  const expectedSignature = Array.from(new Uint8Array(signatureBytes))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');

  return expectedSignature === v1Signature;
}

async function handleCheckout(request: Request, env: Env): Promise<Response> {
  try {
    const body = (await request.json()) as DonateRequestBody;
    const amountCents = Math.round(body.amount * 100);

    // Validate amount
    if (
      typeof body.amount !== 'number' ||
      isNaN(body.amount) ||
      amountCents < MIN_AMOUNT_CENTS
    ) {
      return jsonResponse<ErrorResponse>(
        { error: 'Invalid amount', details: 'Minimum donation is $1' },
        400,
      );
    }

    if (amountCents > MAX_AMOUNT_CENTS) {
      return jsonResponse<ErrorResponse>(
        { error: 'Invalid amount', details: 'Maximum donation is $1000' },
        400,
      );
    }

    const origin = new URL(request.url).origin;
    const session = await createStripeCheckoutSession(amountCents, env, origin);

    return jsonResponse<DonateCheckoutResponse>({ url: session.url });
  } catch (error) {
    console.error('Checkout error:', error);
    return errorResponse(
      'Failed to create checkout session',
      error instanceof Error ? error.message : undefined,
    );
  }
}

async function handleWebhook(request: Request, env: Env): Promise<Response> {
  try {
    const signature = request.headers.get('stripe-signature');
    if (!signature) {
      return jsonResponse<ErrorResponse>({ error: 'Missing signature' }, 400);
    }

    const payload = await request.text();
    const isValid = await verifyWebhookSignature(
      payload,
      signature,
      env.STRIPE_WEBHOOK_SECRET,
    );

    if (!isValid) {
      return jsonResponse<ErrorResponse>({ error: 'Invalid signature' }, 401);
    }

    const event = JSON.parse(payload);

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        console.log(
          'Payment successful:',
          JSON.stringify({
            sessionId: session.id,
            amount: session.amount_total,
            email: session.customer_email,
          }),
        );
        break;
      }
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return jsonResponse({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return errorResponse(
      'Webhook processing failed',
      error instanceof Error ? error.message : undefined,
    );
  }
}

export async function handleDonateApi(
  request: Request,
  env: Env,
): Promise<Response> {
  const url = new URL(request.url);

  if (request.method === 'OPTIONS') {
    return handleOptions();
  }

  if (url.pathname === '/api/donate/checkout' && request.method === 'POST') {
    return handleCheckout(request, env);
  }

  if (url.pathname === '/api/donate/webhook' && request.method === 'POST') {
    return handleWebhook(request, env);
  }

  return jsonResponse<ErrorResponse>({ error: 'Not found' }, 404);
}
