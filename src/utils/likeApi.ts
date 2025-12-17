// API client for like operations
// In development mode (vite dev), uses localStorage for persistence
// In production (Cloudflare Pages), uses Cloudflare Workers API with KV storage

export interface LikeResponse {
  imageId: string;
  count: number;
}

const API_BASE = '/api/likes';

// Check if running on localhost (vite dev server)
const isLocalDev = typeof window !== 'undefined' && window.location.hostname === 'localhost';

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
  // In local dev mode, use localStorage directly without API call
  if (isLocalDev) {
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
    // Fallback to localStorage if API fails
    return getLocalLikes(imageId);
  }
}

export async function addLike(imageId: string): Promise<number> {
  // In local dev mode, use localStorage directly without API call
  if (isLocalDev) {
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
    // Fallback to localStorage if API fails
    const current = getLocalLikes(imageId);
    const newVal = current + 1;
    setLocalLikes(imageId, newVal);
    return newVal;
  }
}

export async function removeLike(imageId: string): Promise<number> {
  // In local dev mode, use localStorage directly without API call
  if (isLocalDev) {
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
    // Fallback to localStorage if API fails
    const current = getLocalLikes(imageId);
    const newVal = Math.max(0, current - 1);
    setLocalLikes(imageId, newVal);
    return newVal;
  }
}

