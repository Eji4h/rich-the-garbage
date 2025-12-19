import { Env, LikeData, LikeResponse, ErrorResponse } from '../types';
import { LIKES_PREFIX } from '../constants';
import { getClientId, requireClientId, extractImageId } from '../utils';
import { jsonResponse, errorResponse, handleOptions } from '../response';

export class LikesService {
  constructor(private kv: KVNamespace) {}

  private getKey(imageId: string): string {
    return `${LIKES_PREFIX}${imageId}`;
  }

  async getLikeData(imageId: string): Promise<LikeData | null> {
    const data = await this.kv.get(this.getKey(imageId));
    if (!data) return null;
    try {
      return JSON.parse(data) as LikeData;
    } catch {
      return null;
    }
  }

  async getOrCreateLikeData(imageId: string): Promise<LikeData> {
    const existing = await this.getLikeData(imageId);
    return existing ?? { count: 0, likedBy: [] };
  }

  async saveLikeData(imageId: string, data: LikeData): Promise<void> {
    await this.kv.put(this.getKey(imageId), JSON.stringify(data));
  }

  async addLike(imageId: string, clientId: string): Promise<LikeData> {
    const likeData = await this.getOrCreateLikeData(imageId);

    if (!likeData.likedBy.includes(clientId)) {
      likeData.count += 1;
      likeData.likedBy.push(clientId);
      await this.saveLikeData(imageId, likeData);
    }

    return likeData;
  }

  async removeLike(imageId: string, clientId: string): Promise<LikeData> {
    const likeData = await this.getOrCreateLikeData(imageId);
    const index = likeData.likedBy.indexOf(clientId);

    if (index > -1) {
      likeData.count = Math.max(0, likeData.count - 1);
      likeData.likedBy.splice(index, 1);
      await this.saveLikeData(imageId, likeData);
    }

    return likeData;
  }
}

async function handleGetLikes(
  imageId: string,
  clientId: string,
  likesService: LikesService,
): Promise<Response> {
  try {
    const likeData = await likesService.getLikeData(imageId);
    if (!likeData) {
      return jsonResponse<LikeResponse>({ count: 0, liked: false });
    }

    return jsonResponse<LikeResponse>({
      count: likeData.count,
      liked: likeData.likedBy.includes(clientId),
    });
  } catch (error) {
    console.error('Error getting likes:', error);
    return errorResponse('Failed to get likes');
  }
}

async function handlePostLikes(
  imageId: string,
  clientId: string,
  likesService: LikesService,
): Promise<Response> {
  try {
    const likeData = await likesService.addLike(imageId, clientId);
    return jsonResponse<LikeResponse>({
      count: likeData.count,
      liked: true,
    });
  } catch (error) {
    console.error('Error adding like:', error);
    return errorResponse('Failed to add like');
  }
}

async function handleDeleteLikes(
  imageId: string,
  clientId: string,
  likesService: LikesService,
): Promise<Response> {
  try {
    const likeData = await likesService.removeLike(imageId, clientId);
    return jsonResponse<LikeResponse>({
      count: likeData.count,
      liked: false,
    });
  } catch (error) {
    console.error('Error removing like:', error);
    return errorResponse('Failed to remove like');
  }
}

export async function handleLikesApi(
  request: Request,
  env: Env,
): Promise<Response> {
  if (request.method === 'OPTIONS') {
    return handleOptions();
  }

  const url = new URL(request.url);
  const imageId = extractImageId(url);
  const clientId = getClientId(request) || '';
  const likesService = new LikesService(env.LIKES_KV);

  switch (request.method) {
    case 'GET':
      return handleGetLikes(imageId, clientId, likesService);
    case 'POST': {
      const clientIdError = requireClientId(request);
      if (clientIdError) return clientIdError;
      return handlePostLikes(imageId, clientId, likesService);
    }
    case 'DELETE': {
      const clientIdError = requireClientId(request);
      if (clientIdError) return clientIdError;
      return handleDeleteLikes(imageId, clientId, likesService);
    }
    default:
      return jsonResponse<ErrorResponse>({ error: 'Method not allowed' }, 405);
  }
}
