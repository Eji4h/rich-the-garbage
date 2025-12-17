// API client for like operations
// In development mode, uses localStorage for persistence
// In production, would use a real API (e.g., Cloudflare Workers)

export interface LikeResponse {
  imageId: string;
  count: number;
}

const API_BASE = '/api/likes';

// Helper to check if we're in development (no backend API available)
const isDev = import.meta.env.DEV;

// Helper to simulate API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Get likes from localStorage
function getLocalLikes(imageId: string): number {
  const likes = localStorage.getItem(`likes:${imageId}`);
  return likes ? parseInt(likes, 10) : Math.floor(Math.random() * 50); // Random initial likes for demo
}

// Set likes in localStorage
function setLocalLikes(imageId: string, count: number): void {
  localStorage.setItem(`likes:${imageId}`, count.toString());
}

// Encode ID to be URL-safe (Base64url) to avoid issues with slashes in paths
function encodeId(id: string): string {
  return btoa(id).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

export async function getLikes(imageId: string): Promise<number> {
  // In dev mode, use localStorage directly without API call
  if (isDev) {
    await delay(100); // Small delay for realism
    return getLocalLikes(imageId);
  }

  try {
    const encodedId = encodeId(imageId);
    const response = await fetch(`${API_BASE}/${encodedId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch likes');
    }
    const data: LikeResponse = await response.json();
    return data.count;
  } catch (error) {
    console.error('Error fetching likes:', error);
    return 0;
  }
}

export async function addLike(imageId: string): Promise<number> {
  // In dev mode, use localStorage directly without API call
  if (isDev) {
    await delay(200); // Simulate network delay
    const current = getLocalLikes(imageId);
    const newVal = current + 1;
    setLocalLikes(imageId, newVal);
    return newVal;
  }

  try {
    const encodedId = encodeId(imageId);
    const response = await fetch(`${API_BASE}/${encodedId}`, {
      method: 'POST',
    });
    if (!response.ok) {
      throw new Error('Failed to add like');
    }
    const data: LikeResponse = await response.json();
    return data.count;
  } catch (error) {
    console.error('Error adding like:', error);
    throw error;
  }
}

export async function removeLike(imageId: string): Promise<number> {
  // In dev mode, use localStorage directly without API call
  if (isDev) {
    await delay(200); // Simulate network delay
    const current = getLocalLikes(imageId);
    const newVal = Math.max(0, current - 1);
    setLocalLikes(imageId, newVal);
    return newVal;
  }

  try {
    const encodedId = encodeId(imageId);
    const response = await fetch(`${API_BASE}/${encodedId}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to remove like');
    }
    const data: LikeResponse = await response.json();
    return data.count;
  } catch (error) {
    console.error('Error removing like:', error);
    throw error;
  }
}

