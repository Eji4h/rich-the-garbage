import { motion } from 'framer-motion';
import type { GameMetadata } from '../game/GameRegistry';

interface GameCardProps {
  game: GameMetadata;
  onSelect: (gameId: GameMetadata['id']) => void;
}

export function GameCard({ game, onSelect }: GameCardProps) {
  return (
    <motion.button
      onClick={() => onSelect(game.id)}
      className="group relative w-full max-w-xs"
      whileHover={{ scale: 1.05, y: -8 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      {/* Card glow effect */}
      <div
        className={`absolute -inset-1 rounded-3xl bg-gradient-to-br ${game.gradient} opacity-40 blur-lg group-hover:opacity-70 transition-opacity duration-300`}
      />

      {/* Card container */}
      <div className="relative flex flex-col items-center gap-4 p-8 bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl ring-1 ring-black/5 overflow-hidden">
        {/* Gradient overlay on hover */}
        <div
          className={`absolute inset-0 bg-gradient-to-br ${game.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
        />

        {/* Icon container */}
        <div
          className={`relative flex items-center justify-center w-24 h-24 rounded-2xl bg-gradient-to-br ${game.gradient} shadow-lg`}
        >
          <span className="text-5xl drop-shadow-md group-hover:scale-110 transition-transform duration-300">
            {game.icon}
          </span>
        </div>

        {/* Game info */}
        <div className="relative text-center">
          <h3 className="text-xl font-bold text-slate-800 mb-1">{game.name}</h3>
          <p className="text-sm text-slate-600 leading-relaxed">
            {game.description}
          </p>
        </div>

        {/* Play indicator */}
        <div
          className={`relative flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r ${game.gradient} text-white font-semibold text-sm shadow-md`}
        >
          <span>▶</span>
          <span>Play</span>
        </div>
      </div>
    </motion.button>
  );
}
