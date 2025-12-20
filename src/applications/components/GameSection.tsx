import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useScore } from '../hooks/useScore';
import { ScoreDisplay } from './ScoreDisplay';
import { PlayButton } from './PlayButton';
import { GameModal } from './GameModal';

export default function GameSection() {
  const [isPlaying, setIsPlaying] = useState(false);
  const { globalScore, clientScore, fetchScores } = useScore();

  const handlePlay = () => {
    setIsPlaying(true);
  };

  const handleClose = async () => {
    setIsPlaying(false);
    await fetchScores();
  };

  return (
    <section className="relative py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Score Preview - when not playing */}
        {!isPlaying && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center gap-6"
          >
            <ScoreDisplay globalScore={globalScore} clientScore={clientScore} />
            <PlayButton onPlay={handlePlay} />
          </motion.div>
        )}

        {/* Game Modal - when playing */}
        <AnimatePresence>
          {isPlaying && <GameModal onClose={handleClose} />}
        </AnimatePresence>
      </div>
    </section>
  );
}
