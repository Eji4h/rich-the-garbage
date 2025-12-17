/// <reference types="@cloudflare/workers-types" />

interface Env {
  LIKES_KV: KVNamespace;
  ASSETS: Fetcher;
}

interface LikeData {
  count: number;
  likedBy: string[];
}

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

    // Handle API routes
    if (url.pathname.startsWith('/api/likes/')) {
      return handleLikesApi(request, env);
    }

    // Serve static assets
    return env.ASSETS.fetch(request);
  },
};
