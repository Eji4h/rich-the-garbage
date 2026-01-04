import {
  Env,
  BeerServeScoreResponse,
  ErrorResponse,
  BeerServeScoreRequestBody,
} from '../types';
import { BEERSERVE_HIGH_SCORE_KEY } from '../constants';
import { parseScore, validateScore } from '../utils';
import { jsonResponse, errorResponse, handleOptions } from '../response';

export class BeerServeScoreService {
  constructor(private kv: KVNamespace) {}

  async getHighScore(): Promise<number> {
    const value = await this.kv.get(BEERSERVE_HIGH_SCORE_KEY);
    return parseScore(value);
  }

  async updateHighScore(
    score: number,
  ): Promise<{ highScore: number; isNewRecord: boolean }> {
    const current = await this.getHighScore();
    const isNewRecord = score > current;

    if (isNewRecord) {
      await this.kv.put(BEERSERVE_HIGH_SCORE_KEY, String(score));
      return { highScore: score, isNewRecord: true };
    }

    return { highScore: current, isNewRecord: false };
  }
}

async function handleGetBeerServeScore(
  request: Request,
  scoreService: BeerServeScoreService,
): Promise<Response> {
  try {
    const highScore = await scoreService.getHighScore();
    return jsonResponse<BeerServeScoreResponse>({ highScore });
  } catch (error) {
    console.error('Error getting BeerServe high score:', error);
    return errorResponse(
      'Failed to get high score',
      error instanceof Error ? error.message : 'Unknown error',
    );
  }
}

async function handlePostBeerServeScore(
  request: Request,
  scoreService: BeerServeScoreService,
): Promise<Response> {
  try {
    const body = (await request.json()) as BeerServeScoreRequestBody;
    const score = body.score;

    if (score === undefined || !validateScore(score)) {
      return jsonResponse<ErrorResponse>({ error: 'Invalid score' }, 400);
    }

    const result = await scoreService.updateHighScore(score);
    return jsonResponse<BeerServeScoreResponse>(result);
  } catch (error) {
    console.error('Error updating BeerServe high score:', error);
    return errorResponse(
      'Failed to update high score',
      error instanceof Error ? error.message : 'Unknown error',
    );
  }
}

export async function handleBeerServeScoreApi(
  request: Request,
  env: Env,
): Promise<Response> {
  if (request.method === 'OPTIONS') {
    return handleOptions();
  }

  const scoreService = new BeerServeScoreService(env.BEERSERVE_KV);

  switch (request.method) {
    case 'GET':
      return handleGetBeerServeScore(request, scoreService);
    case 'POST':
      return handlePostBeerServeScore(request, scoreService);
    default:
      return jsonResponse<ErrorResponse>({ error: 'Method not allowed' }, 405);
  }
}
