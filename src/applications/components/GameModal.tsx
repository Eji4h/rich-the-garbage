import { useRef } from 'react';
import { motion } from 'framer-motion';
import { IRefPhaserGame, PhaserGame } from '../../PhaserGame';
import { GameDonateButton } from './GameDonateButton';

interface GameModalProps {
  onClose: () => void;
}

export function GameModal({ onClose }: GameModalProps) {
  const phaserRef = useRef<IRefPhaserGame | null>(null);

  const handleSceneChange = (scene: Phaser.Scene) => {
    console.log('Current scene:', scene.scene.key);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="relative"
    >
      {/* Game wrapper */}
      <div className="relative rounded-2xl overflow-hidden shadow-2xl ring-1 ring-black/20">
        <div className="relative bg-[#1a1a2e] rounded-2xl overflow-hidden">
          {/* Game container */}
          <div className="relative aspect-video max-w-4xl mx-auto">
            <PhaserGame
              ref={phaserRef}
              currentActiveScene={handleSceneChange}
            />

            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-3 right-3 z-20 p-2 bg-black/60 hover:bg-black/80 rounded-full transition-colors"
              title="Close"
              aria-label="Close game"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-5 h-5 text-white"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Instructions */}
      <p className="mt-3 text-center text-slate-700 text-sm">
        Tap the character to drink! Every tap adds to the global total! 🌍
      </p>

      {/* Donate link */}
      <GameDonateButton />
    </motion.div>
  );
}
