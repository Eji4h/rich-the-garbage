/// <reference types="@cloudflare/workers-types" />

interface Env {
  LIKES_KV: KVNamespace;
  SCORE_KV: KVNamespace;
  ASSETS: Fetcher;
}

interface LikeData {
  count: number;
  likedBy: string[];
}

const GLOBAL_SCORE_KEY = 'global_score';
const SESSION_SCORE_PREFIX = 'session_score:';

function getCorsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, X-Client-ID, X-Session-ID',
  };
}

function jsonResponse(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      ...getCorsHeaders(),
    },
  });
}

async function handleScoreApi(request: Request, env: Env): Promise<Response> {
  const sessionId = request.headers.get('X-Session-ID');

  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: getCorsHeaders() });
  }

  // GET /api/score - Get global score and session score
  if (request.method === 'GET') {
    try {
      // Get global score
      const globalStr = await env.SCORE_KV.get(GLOBAL_SCORE_KEY);
      const globalScore = globalStr ? Number.parseInt(globalStr, 10) : 0;

      // Get session score if sessionId provided
      let sessionScore = 0;
      if (sessionId) {
        const sessionStr = await env.SCORE_KV.get(
          `${SESSION_SCORE_PREFIX}${sessionId}`,
        );
        sessionScore = sessionStr ? Number.parseInt(sessionStr, 10) : 0;
      }

      return jsonResponse({ globalScore, sessionScore });
    } catch {
      return jsonResponse({ error: 'Failed to get scores' }, 500);
    }
  }

  // POST /api/score - Add to both global and session score
  if (request.method === 'POST') {
    if (!sessionId) {
      return jsonResponse({ error: 'Session ID required' }, 400);
    }

    try {
      const body = (await request.json()) as { amount?: number };
      const amount = body.amount || 1;

      // Update global score
      const globalStr = await env.SCORE_KV.get(GLOBAL_SCORE_KEY);
      const currentGlobal = globalStr ? Number.parseInt(globalStr, 10) : 0;
      const newGlobalScore = currentGlobal + amount;
      await env.SCORE_KV.put(GLOBAL_SCORE_KEY, newGlobalScore.toString());

      // Update session score
      const sessionKey = `${SESSION_SCORE_PREFIX}${sessionId}`;
      const sessionStr = await env.SCORE_KV.get(sessionKey);
      const currentSession = sessionStr ? Number.parseInt(sessionStr, 10) : 0;
      const newSessionScore = currentSession + amount;
      await env.SCORE_KV.put(sessionKey, newSessionScore.toString());

      return jsonResponse({
        globalScore: newGlobalScore,
        sessionScore: newSessionScore,
        added: amount,
      });
    } catch {
      return jsonResponse({ error: 'Failed to update scores' }, 500);
    }
  }

  return jsonResponse({ error: 'Method not allowed' }, 405);
}

async function handleLikesApi(request: Request, env: Env): Promise<Response> {
  const url = new URL(request.url);
  const pathParts = url.pathname.split('/');
  const imageId = pathParts[pathParts.length - 1];

  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: getCorsHeaders() });
  }

  const clientId = request.headers.get('X-Client-ID') || '';

  if (request.method === 'GET') {
    try {
      const data = await env.LIKES_KV.get(`likes:${imageId}`);
      if (!data) {
        return jsonResponse({ count: 0, liked: false });
      }
      const likeData: LikeData = JSON.parse(data);
      return jsonResponse({
        count: likeData.count,
        liked: likeData.likedBy.includes(clientId),
      });
    } catch {
      return jsonResponse({ error: 'Failed to get likes' }, 500);
    }
  }

  if (request.method === 'POST') {
    if (!clientId) {
      return jsonResponse({ error: 'Client ID required' }, 400);
    }
    try {
      const current = await env.LIKES_KV.get(`likes:${imageId}`);
      const likeData: LikeData = current
        ? JSON.parse(current)
        : { count: 0, likedBy: [] };

      if (!likeData.likedBy.includes(clientId)) {
        likeData.count += 1;
        likeData.likedBy.push(clientId);
        await env.LIKES_KV.put(`likes:${imageId}`, JSON.stringify(likeData));
      }

      return jsonResponse({ count: likeData.count, liked: true });
    } catch {
      return jsonResponse({ error: 'Failed to add like' }, 500);
    }
  }

  if (request.method === 'DELETE') {
    if (!clientId) {
      return jsonResponse({ error: 'Client ID required' }, 400);
    }
    try {
      const current = await env.LIKES_KV.get(`likes:${imageId}`);
      if (!current) {
        return jsonResponse({ count: 0, liked: false });
      }

      const likeData: LikeData = JSON.parse(current);
      const index = likeData.likedBy.indexOf(clientId);

      if (index > -1) {
        likeData.count = Math.max(0, likeData.count - 1);
        likeData.likedBy.splice(index, 1);
        await env.LIKES_KV.put(`likes:${imageId}`, JSON.stringify(likeData));
      }

      return jsonResponse({ count: likeData.count, liked: false });
    } catch {
      return jsonResponse({ error: 'Failed to remove like' }, 500);
    }
  }

  return jsonResponse({ error: 'Method not allowed' }, 405);
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    // Handle Score API
    if (url.pathname === '/api/score') {
      return handleScoreApi(request, env);
    }

    // Handle Likes API
    if (url.pathname.startsWith('/api/likes/')) {
      return handleLikesApi(request, env);
    }

    // Serve static assets
    return env.ASSETS.fetch(request);
  },
};
