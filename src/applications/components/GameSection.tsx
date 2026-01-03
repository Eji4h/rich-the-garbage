import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useScore } from '../hooks/useScore';
import { ScoreDisplay } from './ScoreDisplay';
import { GameSelector } from './GameSelector';
import { GameModal } from './GameModal';
import type { GameId } from '../game/GameRegistry';

export default function GameSection() {
  const [selectedGame, setSelectedGame] = useState<GameId | null>(null);
  const { globalScore, clientScore, fetchScores } = useScore();

  const handleSelectGame = (gameId: GameId) => {
    setSelectedGame(gameId);
  };

  const handleClose = async () => {
    setSelectedGame(null);
    await fetchScores();
  };

  return (
    <section className="relative py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Score Preview and Game Selection - when not playing */}
        {!selectedGame && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center gap-8"
          >
            <ScoreDisplay globalScore={globalScore} clientScore={clientScore} />
            <GameSelector onSelectGame={handleSelectGame} />
          </motion.div>
        )}

        {/* Game Modal - when playing */}
        <AnimatePresence>
          {selectedGame && (
            <GameModal gameId={selectedGame} onClose={handleClose} />
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
