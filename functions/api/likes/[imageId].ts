interface Env {
  LIKES_KV: any;
}

export const onRequestGet: any = async (context: any) => {
  const imageId = context.params.imageId as string;

  if (!imageId) {
    return new Response(JSON.stringify({ error: 'Image ID required' }), { status: 400 });
  }

  try {
    const value = await context.env.LIKES_KV.get(`likes:${imageId}`);
    const count = value ? parseInt(value) : 0;

    return new Response(JSON.stringify({ imageId, count }), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to fetch likes' }), { status: 500 });
  }
};

export const onRequestPost: any = async (context: any) => {
  const imageId = context.params.imageId as string;

  if (!imageId) {
    return new Response(JSON.stringify({ error: 'Image ID required' }), { status: 400 });
  }

  try {
    const current = await context.env.LIKES_KV.get(`likes:${imageId}`);
    const newCount = (current ? parseInt(current) : 0) + 1;
    await context.env.LIKES_KV.put(`likes:${imageId}`, newCount.toString());

    return new Response(JSON.stringify({ imageId, count: newCount }), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to add like' }), { status: 500 });
  }
};

export const onRequestDelete: any = async (context: any) => {
  const imageId = context.params.imageId as string;

  if (!imageId) {
    return new Response(JSON.stringify({ error: 'Image ID required' }), { status: 400 });
  }

  try {
    const current = await context.env.LIKES_KV.get(`likes:${imageId}`);
    const newCount = Math.max(0, (current ? parseInt(current) : 0) - 1);
    await context.env.LIKES_KV.put(`likes:${imageId}`, newCount.toString());

    return new Response(JSON.stringify({ imageId, count: newCount }), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to remove like' }), { status: 500 });
  }
};

export const onRequestOptions: any = async () => {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
};
