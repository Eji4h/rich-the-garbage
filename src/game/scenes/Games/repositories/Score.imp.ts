import { getClientId } from '../../../../utils/clientId';
import { Score, ScoreResponse } from '../ports/Score.port';

export class ScoreApi implements Score {
  async getScore(): Promise<ScoreResponse> {
    const response = await fetch('/api/score', {
      headers: {
        'X-Client-ID': getClientId(),
      },
    });
    if (!response.ok) throw new Error('Failed to fetch scores');
    const data = await response.json();
    return {
      globalScore: data.globalScore,
      clientScore: data.clientScore,
    };
  }
  async addScore(score: number): Promise<ScoreResponse> {
    const response = await fetch('/api/score', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Client-ID': getClientId(),
      },
      body: JSON.stringify({ score }),
    });
    if (!response.ok) throw new Error('Failed to add score');
    return await response.json();
  }
}
