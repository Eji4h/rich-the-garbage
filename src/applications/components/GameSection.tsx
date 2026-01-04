import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GameSelector } from './GameSelector';
import { GameModal } from './GameModal';
import type { GameId } from '../game/GameRegistry';

export default function GameSection() {
  const [selectedGame, setSelectedGame] = useState<GameId | null>(null);

  const handleSelectGame = (gameId: GameId) => {
    setSelectedGame(gameId);
  };

  const handleClose = () => {
    setSelectedGame(null);
  };

  return (
    <section className="relative py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Game Selection - when not playing */}
        {!selectedGame && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center gap-8"
          >
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
