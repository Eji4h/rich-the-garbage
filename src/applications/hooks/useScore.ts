import { useState, useEffect, useRef, useCallback } from 'react';
import { scoreSingleton } from '../game/scenes/DrinkGame/ScoreSingleton';
import { ScoreApi } from '../../adapters/outbounds/repositories/Score.imp';

interface UseScoreReturn {
  globalScore: number | null;
  clientScore: number | null;
  fetchScores: () => Promise<void>;
  isLoading: boolean;
}

export function useScore(): UseScoreReturn {
  const [globalScore, setGlobalScore] = useState<number | null>(null);
  const [clientScore, setClientScore] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const scoreApi = useRef(new ScoreApi());

  const fetchScores = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await scoreApi.current.getScore();
      const global = data.globalScore || 0;
      const client = data.clientScore || 0;

      // Update singleton scores (will notify all subscribers)
      scoreSingleton.globalScore.value = global;
      scoreSingleton.clientScore.value = client;
    } catch (error) {
      console.error('Failed to fetch scores:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchScores();

    // Subscribe to score updates from singleton
    const unsubscribeClient = scoreSingleton.clientScore.subscribe((score) => {
      setClientScore(score);
    });

    const unsubscribeGlobal = scoreSingleton.globalScore.subscribe((score) => {
      setGlobalScore(score);
    });

    return () => {
      unsubscribeClient();
      unsubscribeGlobal();
    };
  }, [fetchScores]);

  return {
    globalScore,
    clientScore,
    fetchScores,
    isLoading,
  };
}
