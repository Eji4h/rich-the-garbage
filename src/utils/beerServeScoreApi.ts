export interface BeerServeScoreResponse {
  highScore: number;
  isNewRecord?: boolean;
}

export async function getBeerServeHighScore(): Promise<number> {
  try {
    const response = await fetch('/api/beerserve/score');
    if (!response.ok) {
      throw new Error('Failed to fetch high score');
    }
    const data = (await response.json()) as BeerServeScoreResponse;
    return data.highScore || 0;
  } catch (error) {
    console.error('Error fetching BeerServe high score:', error);
    return 0;
  }
}

export async function saveBeerServeScore(
  score: number,
): Promise<BeerServeScoreResponse> {
  try {
    const response = await fetch('/api/beerserve/score', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ score }),
    });
    if (!response.ok) {
      throw new Error('Failed to save score');
    }
    return (await response.json()) as BeerServeScoreResponse;
  } catch (error) {
    console.error('Error saving BeerServe score:', error);
    throw error;
  }
}
