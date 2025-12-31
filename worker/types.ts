/// <reference types="@cloudflare/workers-types" />

export interface Env {
  LIKES_KV: KVNamespace;
  SCORE_KV: KVNamespace;
  DONATIONS_KV: KVNamespace;
  ASSETS: Fetcher;
  STRIPE_SECRET_KEY: string;
  STRIPE_WEBHOOK_SECRET: string;
  // Optional - no longer required as we use hash routing
  DONATE_SUCCESS_URL?: string;
  DONATE_CANCEL_URL?: string;
  DONATE_CURRENCY?: string;
}

export interface LikeData {
  count: number;
  likedBy: string[];
}

export interface ScoreResponse {
  globalScore: number;
  clientScore: number;
  score?: number;
}

export interface LikeResponse {
  count: number;
  liked: boolean;
}

export interface ErrorResponse {
  error: string;
  details?: string;
}

export interface ScoreRequestBody {
  score?: number;
}

export interface DonateRequestBody {
  amountMinor: number;
  currency: string;
}

export interface DonateResponse {
  url: string;
}

export interface StripeEventData {
  eventId: string;
  type: string;
  created: number;
  livemode: boolean;
  apiVersion?: string;
  request?: {
    id?: string;
    idempotencyKey?: string;
  };
  object: {
    kind: 'checkout.session' | 'payment_intent' | 'other';
    id: string;
    amountTotalMinor?: number;
    currency?: string;
    status?: string;
    paymentStatus?: string;
    mode?: string;
  };
  receivedAt: string;
  raw: unknown;
}
