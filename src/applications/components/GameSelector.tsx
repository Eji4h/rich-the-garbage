import { motion } from 'framer-motion';
import { GameCard } from './GameCard';
import { getGameMetadata, type GameId } from '../game/GameRegistry';

interface GameSelectorProps {
  onSelectGame: (gameId: GameId) => void;
}

export function GameSelector({ onSelectGame }: GameSelectorProps) {
  const games = getGameMetadata();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center gap-8"
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="text-center"
      >
        <h2 className="text-3xl font-bold text-slate-800 mb-2">
          🎮 Choose Your Game
        </h2>
        <p className="text-slate-600">Select a game to start playing!</p>
      </motion.div>

      {/* Game Cards Grid */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: {
              staggerChildren: 0.15,
            },
          },
        }}
      >
        {games.map((game) => (
          <motion.div
            key={game.id}
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 },
            }}
          >
            <GameCard game={game} onSelect={onSelectGame} />
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}
