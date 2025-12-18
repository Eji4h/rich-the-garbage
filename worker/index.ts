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
const CLIENT_SCORE_PREFIX = 'client_score:';

function getCorsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, X-Client-ID',
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
  const clientId = request.headers.get('X-Client-ID');

  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: getCorsHeaders() });
  }

  // GET /api/score - Get global score and client score
  if (request.method === 'GET') {
    try {
      // Get global score
      const globalStr = await env.SCORE_KV.get(GLOBAL_SCORE_KEY);
      let globalScore = 0;
      if (globalStr) {
        const parsed = Number.parseInt(globalStr, 10);
        globalScore = isNaN(parsed) ? 0 : parsed;
      }

      // Get client score if clientId provided
      let clientScore = 0;
      if (clientId) {
        const clientStr = await env.SCORE_KV.get(
          `${CLIENT_SCORE_PREFIX}${clientId}`,
        );
        if (clientStr) {
          const parsed = Number.parseInt(clientStr, 10);
          clientScore = isNaN(parsed) ? 0 : parsed;
        }
      }

      return jsonResponse({ globalScore, clientScore });
    } catch (error) {
      console.error('Error getting scores:', error);
      return jsonResponse(
        {
          error: 'Failed to get scores',
          details: error instanceof Error ? error.message : 'Unknown error',
        },
        500,
      );
    }
  }

  // POST /api/score - Add to both global and client score
  if (request.method === 'POST') {
    if (!clientId) {
      return jsonResponse({ error: 'Client ID required' }, 400);
    }

    try {
      const body = (await request.json()) as { amount?: number };
      const amount = body.amount || 1;

      // Validate amount
      if (typeof amount !== 'number' || isNaN(amount) || amount < 0) {
        return jsonResponse({ error: 'Invalid amount' }, 400);
      }

      // Update global score
      const globalStr = await env.SCORE_KV.get(GLOBAL_SCORE_KEY);
      const currentGlobal = globalStr ? Number(globalStr) : 0;
      const newGlobalScore = isNaN(currentGlobal)
        ? amount
        : currentGlobal + amount;
      await env.SCORE_KV.put(GLOBAL_SCORE_KEY, String(newGlobalScore));

      // Update client score
      const clientKey = `${CLIENT_SCORE_PREFIX}${clientId}`;
      const clientStr = await env.SCORE_KV.get(clientKey);
      const currentClient = clientStr ? Number(clientStr) : 0;
      const newClientScore = isNaN(currentClient)
        ? amount
        : currentClient + amount;
      await env.SCORE_KV.put(clientKey, String(newClientScore));

      return jsonResponse({
        globalScore: newGlobalScore,
        clientScore: newClientScore,
        added: amount,
      });
    } catch (error) {
      console.error('Error updating scores:', error);
      return jsonResponse(
        {
          error: 'Failed to update scores',
          details: error instanceof Error ? error.message : 'Unknown error',
        },
        500,
      );
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
