// Cloudflare Pages Function for handling likes
// Uses KV storage to persist like counts

interface Env {
  LIKES_KV: any; // KV namespace
}

export const onRequestGet = async (context: any) => {
  const imageId = context.params.imageId as string;
  
  try {
    const count = await context.env.LIKES_KV.get(`likes:${imageId}`);
    return new Response(JSON.stringify({ 
      imageId, 
      count: count ? parseInt(count) : 0 
    }), {
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to fetch likes' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export const onRequestPost = async (context: any) => {
  const imageId = context.params.imageId as string;
  
  try {
    const currentCount = await context.env.LIKES_KV.get(`likes:${imageId}`);
    const newCount = (currentCount ? parseInt(currentCount) : 0) + 1;
    await context.env.LIKES_KV.put(`likes:${imageId}`, newCount.toString());
    
    return new Response(JSON.stringify({ 
      imageId, 
      count: newCount 
    }), {
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to add like' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export const onRequestDelete = async (context: any) => {
  const imageId = context.params.imageId as string;
  
  try {
    const currentCount = await context.env.LIKES_KV.get(`likes:${imageId}`);
    const newCount = Math.max(0, (currentCount ? parseInt(currentCount) : 0) - 1);
    await context.env.LIKES_KV.put(`likes:${imageId}`, newCount.toString());
    
    return new Response(JSON.stringify({ 
      imageId, 
      count: newCount 
    }), {
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to remove like' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

// Handle OPTIONS for CORS
export const onRequestOptions = async () => {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  });
};

