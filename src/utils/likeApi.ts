const API_BASE = '/api/likes';

function getClientId(): string {
  const key = 'rich-garbage-client-id';
  let clientId = localStorage.getItem(key);
  if (!clientId) {
    clientId = crypto.randomUUID();
    localStorage.setItem(key, clientId);
  }
  return clientId;
}

function getImageKey(imageId: string): string {
  const parts = imageId.split('/');
  const filename = parts[parts.length - 1];
  return filename.replace(/[^a-zA-Z0-9]/g, '_');
}

export interface LikeResponse {
  count: number;
  liked: boolean;
}

export async function getLikes(imageId: string): Promise<LikeResponse> {
  try {
    const response = await fetch(`${API_BASE}/${getImageKey(imageId)}`, {
      headers: {
        'X-Client-ID': getClientId(),
      },
    });
    if (!response.ok) throw new Error('Failed to fetch');
    return await response.json();
  } catch (error) {
    console.error('Error fetching likes:', error);
    return { count: 0, liked: false };
  }
}

export async function addLike(imageId: string): Promise<LikeResponse> {
  try {
    const response = await fetch(`${API_BASE}/${getImageKey(imageId)}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Client-ID': getClientId(),
      },
    });
    if (!response.ok) throw new Error('Failed to add like');
    return await response.json();
  } catch (error) {
    console.error('Error adding like:', error);
    return { count: 0, liked: false };
  }
}

export async function removeLike(imageId: string): Promise<LikeResponse> {
  try {
    const response = await fetch(`${API_BASE}/${getImageKey(imageId)}`, {
      method: 'DELETE',
      headers: {
        'X-Client-ID': getClientId(),
      },
    });
    if (!response.ok) throw new Error('Failed to remove like');
    return await response.json();
  } catch (error) {
    console.error('Error removing like:', error);
    return { count: 0, liked: false };
  }
}
