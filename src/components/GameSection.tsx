import { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IRefPhaserGame, PhaserGame } from '../PhaserGame';

export default function GameSection() {
  const phaserRef = useRef<IRefPhaserGame | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleSceneChange = (scene: Phaser.Scene) => {
    console.log('Current scene:', scene.scene.key);
  };

  return (
    <section className="relative py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Compact Play Button - when not playing */}
        {!isPlaying && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-center"
          >
            <motion.button
              onClick={() => setIsPlaying(true)}
              className="group flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-full shadow-lg hover:shadow-xl transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="text-2xl">🎮</span>
              <span className="text-white font-semibold">Play Game</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-5 h-5 text-white"
              >
                <path
                  fillRule="evenodd"
                  d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z"
                  clipRule="evenodd"
                />
              </svg>
            </motion.button>
          </motion.div>
        )}

        {/* Game Modal - when playing */}
        <AnimatePresence>
          {isPlaying && (
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
                      onClick={() => setIsPlaying(false)}
                      className="absolute top-3 right-3 z-20 p-2 bg-black/60 hover:bg-black/80 rounded-full transition-colors"
                      title="Close"
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
              <p className="mt-3 text-center text-slate-500 text-sm">
                Use Arrow keys or WASD to move • Press Space to jump
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
