import { motion } from 'framer-motion';

interface PlayButtonProps {
  readonly onPlay: () => void;
}

export function PlayButton({ onPlay }: PlayButtonProps) {
  return (
    <>
      <motion.button
        onClick={onPlay}
        className="group relative flex items-center justify-center w-40 h-40 rounded-full shadow-2xl transition-all"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        {/* Outer glow ring */}
        <div className="absolute inset-0 rounded-full bg-linear-to-br from-rose-500 via-pink-500 to-purple-600 animate-pulse opacity-50 blur-md" />

        {/* Main button background */}
        <div className="absolute inset-0 rounded-full bg-linear-to-br from-rose-500 via-pink-500 to-purple-600 shadow-lg" />

        {/* Inner circle */}
        <div className="absolute inset-3 rounded-full bg-linear-to-br from-rose-400 via-pink-400 to-purple-500 shadow-inner" />

        {/* Beer icon */}
        <span className="relative text-6xl drop-shadow-lg group-hover:scale-110 transition-transform">
          🍺
        </span>
      </motion.button>

      {/* Play text below button */}
      <motion.p
        className="text-slate-700 font-bold text-lg mt-4"
        animate={{ opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        🎮 PLAY GAME
      </motion.p>
    </>
  );
}
