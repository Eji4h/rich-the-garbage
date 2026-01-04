import Stripe from 'stripe';
import {
  Env,
  DonateResponse,
  ErrorResponse,
  DonateRequestBody,
} from '../types';
import { jsonResponse, errorResponse, handleOptions } from '../response';

const MIN_AMOUNT_MINOR = 100; // $1.00 or equivalent
const MAX_AMOUNT_MINOR = 100000; // $1000.00 or equivalent

// Stripe supported currencies
const STRIPE_SUPPORTED_CURRENCIES = [
  'usd',
  'thb',
  'eur',
  'gbp',
  'jpy',
  'cad',
  'aud',
  'sgd',
  'hkd',
  'nzd',
  'chf',
  'sek',
  'nok',
  'dkk',
  'pln',
  'czk',
  'inr',
  'krw',
  'mxn',
  'brl',
  'zar',
];

function createStripeClient(secretKey: string): Stripe {
  return new Stripe(secretKey, {
    httpClient: Stripe.createFetchHttpClient(),
  });
}

async function createStripeCheckoutSession(
  amountMinor: number,
  currency: string,
  successUrl: string,
  cancelUrl: string,
  secretKey: string,
): Promise<Stripe.Checkout.Session> {
  const stripe = createStripeClient(secretKey);

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency,
          product_data: {
            name: 'Donation to Rich The Garbage',
            description: 'Thank you for supporting this project!',
          },
          unit_amount: amountMinor,
        },
        quantity: 1,
      },
    ],
    success_url: successUrl,
    cancel_url: cancelUrl,
  });

  return session;
}

function validateAmount(amountMinor: number): boolean {
  return (
    typeof amountMinor === 'number' &&
    !Number.isNaN(amountMinor) &&
    amountMinor >= MIN_AMOUNT_MINOR &&
    amountMinor <= MAX_AMOUNT_MINOR &&
    Number.isInteger(amountMinor)
  );
}

function validateCurrency(currency: string): boolean {
  return (
    typeof currency === 'string' &&
    STRIPE_SUPPORTED_CURRENCIES.includes(currency.toLowerCase())
  );
}

async function handlePostDonate(request: Request, env: Env): Promise<Response> {
  try {
    const body = (await request.json()) as DonateRequestBody;
    const { amountMinor, currency } = body;

    if (!validateAmount(amountMinor)) {
      return jsonResponse<ErrorResponse>(
        {
          error: 'Invalid amount',
          details: `Amount must be between ${MIN_AMOUNT_MINOR} and ${MAX_AMOUNT_MINOR} (in minor units)`,
        },
        400,
      );
    }

    if (!currency || !validateCurrency(currency)) {
      return jsonResponse<ErrorResponse>(
        {
          error: 'Invalid currency',
          details: `Currency must be one of: ${STRIPE_SUPPORTED_CURRENCIES.join(', ')}`,
        },
        400,
      );
    }

    // Build URLs using request origin + hash routing
    const url = new URL(request.url);
    const origin = `${url.protocol}//${url.host}`;
    const successUrl = `${origin}/#/donate-success?session_id={CHECKOUT_SESSION_ID}`;
    const cancelUrl = `${origin}/#/donate-cancel`;

    const checkoutSession = await createStripeCheckoutSession(
      amountMinor,
      currency.toLowerCase(),
      successUrl,
      cancelUrl,
      env.STRIPE_SECRET_KEY,
    );

    if (!checkoutSession.url) {
      throw new Error('Checkout session URL not returned from Stripe');
    }

    return jsonResponse<DonateResponse>({ url: checkoutSession.url });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return errorResponse(
      'Failed to create checkout session',
      error instanceof Error ? error.message : 'Unknown error',
    );
  }
}

export async function handleDonateApi(
  request: Request,
  env: Env,
): Promise<Response> {
  if (request.method === 'OPTIONS') {
    return handleOptions();
  }

  if (request.method !== 'POST') {
    return jsonResponse<ErrorResponse>({ error: 'Method not allowed' }, 405);
  }

  return handlePostDonate(request, env);
}
