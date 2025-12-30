/// <reference types="@cloudflare/workers-types" />

export interface Env {
  LIKES_KV: KVNamespace;
  SCORE_KV: KVNamespace;
  ASSETS: Fetcher;
  STRIPE_SECRET_KEY: string;
  STRIPE_WEBHOOK_SECRET: string;
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
  amount: number;
}

export interface DonateCheckoutResponse {
  url: string;
}

export interface StripeCheckoutSession {
  id: string;
  url: string;
}

export interface StripeWebhookEvent {
  id: string;
  type: string;
  data: {
    object: {
      id: string;
      amount_total?: number;
      customer_email?: string;
      payment_status?: string;
    };
  };
}
