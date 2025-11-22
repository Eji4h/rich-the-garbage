import type { APIRoute } from 'astro';

export const prerender = false;

export const GET: APIRoute = async ({ params, locals }) => {
  const imageId = params.imageId;
  
  if (!imageId) {
    return new Response(JSON.stringify({ error: 'Image ID required' }), { status: 400 });
  }

  try {
    const env = locals.runtime.env;
    const count = await env.LIKES_KV.get(`likes:${imageId}`);
    
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
    console.error('KV Error:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch likes' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export const POST: APIRoute = async ({ params, locals }) => {
  const imageId = params.imageId;

  if (!imageId) {
    return new Response(JSON.stringify({ error: 'Image ID required' }), { status: 400 });
  }
  
  try {
    const env = locals.runtime.env;
    const currentCount = await env.LIKES_KV.get(`likes:${imageId}`);
    const newCount = (currentCount ? parseInt(currentCount) : 0) + 1;
    await env.LIKES_KV.put(`likes:${imageId}`, newCount.toString());
    
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
    console.error('KV Error:', error);
    return new Response(JSON.stringify({ error: 'Failed to add like' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export const DELETE: APIRoute = async ({ params, locals }) => {
  const imageId = params.imageId;

  if (!imageId) {
    return new Response(JSON.stringify({ error: 'Image ID required' }), { status: 400 });
  }
  
  try {
    const env = locals.runtime.env;
    const currentCount = await env.LIKES_KV.get(`likes:${imageId}`);
    const newCount = Math.max(0, (currentCount ? parseInt(currentCount) : 0) - 1);
    await env.LIKES_KV.put(`likes:${imageId}`, newCount.toString());
    
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
    console.error('KV Error:', error);
    return new Response(JSON.stringify({ error: 'Failed to remove like' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
