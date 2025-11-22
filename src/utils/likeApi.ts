// API client for like operations

export interface LikeResponse {
  imageId: string;
  count: number;
}

const API_BASE = '/api/likes';

// Helper to check if we're in development
const isDev = import.meta.env.DEV;

// Helper to simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock storage for local dev
const localLikes = new Map<string, number>();

// Encode ID to be URL-safe (Base64url) to avoid issues with slashes in paths
function encodeId(id: string): string {
  return btoa(id).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

export async function getLikes(imageId: string): Promise<number> {
  try {
    const encodedId = encodeId(imageId);
    const response = await fetch(`${API_BASE}/${encodedId}`);
    if (!response.ok) {
      if (isDev) {
        // Return mock data in dev
        return localLikes.get(imageId) || 0;
      }
      throw new Error('Failed to fetch likes');
    }
    const data: LikeResponse = await response.json();
    return data.count;
  } catch (error) {
    console.error('Error fetching likes:', error);
    if (isDev) return localLikes.get(imageId) || 0;
    return 0;
  }
}

export async function addLike(imageId: string): Promise<number> {
  try {
    const encodedId = encodeId(imageId);
    const response = await fetch(`${API_BASE}/${encodedId}`, {
      method: 'POST',
    });
    if (!response.ok) {
      if (isDev) {
        // Mock success in dev
        await delay(500); // Simulate network delay
        const current = localLikes.get(imageId) || 0;
        const newVal = current + 1;
        localLikes.set(imageId, newVal);
        return newVal;
      }
      throw new Error('Failed to add like');
    }
    const data: LikeResponse = await response.json();
    return data.count;
  } catch (error) {
    console.error('Error adding like:', error);
    if (isDev) {
      // Mock success in dev on network error
      const current = localLikes.get(imageId) || 0;
      const newVal = current + 1;
      localLikes.set(imageId, newVal);
      return newVal;
    }
    throw error;
  }
}

export async function removeLike(imageId: string): Promise<number> {
  try {
    const encodedId = encodeId(imageId);
    const response = await fetch(`${API_BASE}/${encodedId}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      if (isDev) {
        // Mock success in dev
        await delay(500);
        const current = localLikes.get(imageId) || 0;
        const newVal = Math.max(0, current - 1);
        localLikes.set(imageId, newVal);
        return newVal;
      }
      throw new Error('Failed to remove like');
    }
    const data: LikeResponse = await response.json();
    return data.count;
  } catch (error) {
    console.error('Error removing like:', error);
    if (isDev) {
      // Mock success in dev on network error
      const current = localLikes.get(imageId) || 0;
      const newVal = Math.max(0, current - 1);
      localLikes.set(imageId, newVal);
      return newVal;
    }
    throw error;
  }
}
