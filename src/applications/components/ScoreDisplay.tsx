import { motion } from 'framer-motion';

interface ScoreDisplayProps {
  globalScore: number | null;
  clientScore: number | null;
}

export function ScoreDisplay({ globalScore, clientScore }: ScoreDisplayProps) {
  return (
    <div className="flex gap-12 items-center">
      {/* Global Score */}
      <div className="text-center">
        <p className="text-slate-700 text-sm font-medium mb-1">
          🌍 Global Score
        </p>
        <motion.p
          className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent"
          animate={{ scale: [1, 1.02, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          {globalScore === null ? '...' : globalScore.toLocaleString()}
        </motion.p>
      </div>

      {/* Client Score */}
      <div className="text-center">
        <p className="text-slate-700 text-sm font-medium mb-1">⭐ Your Score</p>
        <motion.p
          className="text-4xl font-bold bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent"
          animate={{ scale: [1, 1.02, 1] }}
          transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
        >
          {clientScore === null ? '...' : clientScore.toLocaleString()}
        </motion.p>
      </div>
    </div>
  );
}
