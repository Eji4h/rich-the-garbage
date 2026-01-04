/// <reference types="@cloudflare/workers-types" />

import { Env } from './types';
import { handleScoreApi } from './services/score';
import { handleLikesApi } from './services/likes';
import { handleDonateApi } from './services/donate';
import { handleStripeWebhook } from './services/stripeWebhook';
import { handleBeerServeScoreApi } from './services/beerServeScore';

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === '/api/score') {
      return handleScoreApi(request, env);
    }

    if (url.pathname.startsWith('/api/likes/')) {
      return handleLikesApi(request, env);
    }

    if (url.pathname === '/api/donate') {
      return handleDonateApi(request, env);
    }

    if (url.pathname === '/api/stripe/webhook') {
      return handleStripeWebhook(request, env);
    }

    if (url.pathname === '/api/beerserve/score') {
      return handleBeerServeScoreApi(request, env);
    }

    return env.ASSETS.fetch(request);
  },
};
