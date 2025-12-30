/// <reference types="@cloudflare/workers-types" />

export interface Env {
  LIKES_KV: KVNamespace;
  SCORE_KV: KVNamespace;
  ASSETS: Fetcher;
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
