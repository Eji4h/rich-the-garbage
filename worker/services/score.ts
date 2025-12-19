import { Env, ScoreResponse, ErrorResponse, ScoreRequestBody } from '../types';
import { CLIENT_SCORE_PREFIX, GLOBAL_SCORE_KEY } from '../constants';
import {
  parseScore,
  getClientId,
  requireClientId,
  validateScore,
} from '../utils';
import { jsonResponse, errorResponse, handleOptions } from '../response';

export class ScoreService {
  constructor(private kv: KVNamespace) {}

  async getGlobalScore(): Promise<number> {
    const value = await this.kv.get(GLOBAL_SCORE_KEY);
    return parseScore(value);
  }

  async getClientScore(clientId: string): Promise<number> {
    const key = `${CLIENT_SCORE_PREFIX}${clientId}`;
    const value = await this.kv.get(key);
    return parseScore(value);
  }

  async updateGlobalScore(score: number): Promise<number> {
    const current = await this.getGlobalScore();
    const newScore = current + score;
    await this.kv.put(GLOBAL_SCORE_KEY, String(newScore));
    return newScore;
  }

  async updateClientScore(clientId: string, score: number): Promise<number> {
    const key = `${CLIENT_SCORE_PREFIX}${clientId}`;
    const current = await this.getClientScore(clientId);
    const newScore = current + score;
    await this.kv.put(key, String(newScore));
    return newScore;
  }
}

async function handleGetScore(
  request: Request,
  scoreService: ScoreService,
): Promise<Response> {
  try {
    const globalScore = await scoreService.getGlobalScore();
    const clientId = getClientId(request);
    const clientScore = clientId
      ? await scoreService.getClientScore(clientId)
      : 0;

    return jsonResponse<ScoreResponse>({ globalScore, clientScore });
  } catch (error) {
    console.error('Error getting scores:', error);
    return errorResponse(
      'Failed to get scores',
      error instanceof Error ? error.message : 'Unknown error',
    );
  }
}

async function handlePostScore(
  request: Request,
  scoreService: ScoreService,
): Promise<Response> {
  const clientIdError = requireClientId(request);
  if (clientIdError) return clientIdError;

  const clientId = getClientId(request)!;

  try {
    const body = (await request.json()) as ScoreRequestBody;
    const score = body.score ?? 1;

    if (!validateScore(score)) {
      return jsonResponse<ErrorResponse>({ error: 'Invalid score' }, 400);
    }

    const [globalScore, clientScore] = await Promise.all([
      scoreService.updateGlobalScore(score),
      scoreService.updateClientScore(clientId, score),
    ]);

    return jsonResponse<ScoreResponse>({
      globalScore,
      clientScore,
      score,
    });
  } catch (error) {
    console.error('Error updating scores:', error);
    return errorResponse(
      'Failed to update scores',
      error instanceof Error ? error.message : 'Unknown error',
    );
  }
}

export async function handleScoreApi(
  request: Request,
  env: Env,
): Promise<Response> {
  if (request.method === 'OPTIONS') {
    return handleOptions();
  }

  const scoreService = new ScoreService(env.SCORE_KV);

  switch (request.method) {
    case 'GET':
      return handleGetScore(request, scoreService);
    case 'POST':
      return handlePostScore(request, scoreService);
    default:
      return jsonResponse<ErrorResponse>({ error: 'Method not allowed' }, 405);
  }
}
