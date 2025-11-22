// API client for like operations

export interface LikeResponse {
  imageId: string;
  count: number;
}

const API_BASE = '/api/likes';

export async function getLikes(imageId: string): Promise<number> {
  try {
    const response = await fetch(`${API_BASE}/${encodeURIComponent(imageId)}`);
    if (!response.ok) throw new Error('Failed to fetch likes');
    const data: LikeResponse = await response.json();
    return data.count;
  } catch (error) {
    console.error('Error fetching likes:', error);
    return 0;
  }
}

export async function addLike(imageId: string): Promise<number> {
  try {
    const response = await fetch(`${API_BASE}/${encodeURIComponent(imageId)}`, {
      method: 'POST',
    });
    if (!response.ok) throw new Error('Failed to add like');
    const data: LikeResponse = await response.json();
    return data.count;
  } catch (error) {
    console.error('Error adding like:', error);
    throw error;
  }
}

export async function removeLike(imageId: string): Promise<number> {
  try {
    const response = await fetch(`${API_BASE}/${encodeURIComponent(imageId)}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to remove like');
    const data: LikeResponse = await response.json();
    return data.count;
  } catch (error) {
    console.error('Error removing like:', error);
    throw error;
  }
}
