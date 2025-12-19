/// <reference types="@cloudflare/workers-types" />

import { Env } from './types';
import { handleScoreApi } from './services/score';
import { handleLikesApi } from './services/likes';

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === '/api/score') {
      return handleScoreApi(request, env);
    }

    if (url.pathname.startsWith('/api/likes/')) {
      return handleLikesApi(request, env);
    }

    return env.ASSETS.fetch(request);
  },
};
