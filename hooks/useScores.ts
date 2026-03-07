import { useEffect, useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SCORES_KEY = 'robot_match_scores';
const HIGH_SCORE_KEY = 'robot_match_high_score';

export type ScoreEntry = {
  score: number;
  moves: number;
  date: string;
};

export function useScores() {
  const [highScore, setHighScore] = useState<number>(0);
  const [recentScores, setRecentScores] = useState<ScoreEntry[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    loadScores();
  }, []);

  const loadScores = useCallback(async () => {
    try {
      const [hsRaw, scoresRaw] = await Promise.all([
        AsyncStorage.getItem(HIGH_SCORE_KEY),
        AsyncStorage.getItem(SCORES_KEY),
      ]);
      if (hsRaw !== null) setHighScore(Number(hsRaw));
      if (scoresRaw !== null) setRecentScores(JSON.parse(scoresRaw));
    } catch {}
    setLoaded(true);
  }, []);

  const saveScore = useCallback(
    async (score: number, moves: number): Promise<boolean> => {
      const entry: ScoreEntry = {
        score,
        moves,
        date: new Date().toISOString(),
      };

      const updated = [entry, ...recentScores].slice(0, 10); // Keep last 10
      setRecentScores(updated);

      const isNewHigh = score > highScore;
      if (isNewHigh) {
        setHighScore(score);
      }

      try {
        await Promise.all([
          AsyncStorage.setItem(SCORES_KEY, JSON.stringify(updated)),
          isNewHigh
            ? AsyncStorage.setItem(HIGH_SCORE_KEY, String(score))
            : Promise.resolve(),
        ]);
      } catch {}

      return isNewHigh;
    },
    [highScore, recentScores],
  );

  return { highScore, recentScores, saveScore, loaded };
}
