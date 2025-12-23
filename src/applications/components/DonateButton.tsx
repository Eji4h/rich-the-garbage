import { useState } from 'react';
import { motion } from 'framer-motion';
import { DonateModal } from './DonateModal';

interface DonateButtonProps {
  variant?: 'floating' | 'inline';
}

export function DonateButton({ variant = 'floating' }: DonateButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (variant === 'inline') {
    return (
      <>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-linear-to-r from-rose-500 via-pink-500 to-purple-600 text-white font-medium hover:opacity-90 transition-opacity"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 24 24"
            className="w-5 h-5"
          >
            <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
          </svg>
          Support Us
        </button>
        <DonateModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      </>
    );
  }

  return (
    <>
      <motion.button
        onClick={() => setIsModalOpen(true)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-3 px-5 py-4 rounded-full bg-linear-to-r from-rose-500 via-pink-500 to-purple-600 text-white shadow-2xl hover:shadow-pink-500/30 transition-all"
        aria-label="Donate"
        title="Support this project"
      >
        {/* Pulsing glow effect */}
        <span className="absolute inset-0 rounded-full bg-linear-to-r from-rose-500 via-pink-500 to-purple-600 animate-pulse opacity-50 blur-md -z-10" />

        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 24 24"
          className="w-6 h-6"
        >
          <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
        </svg>
        <span className="font-bold text-lg">Donate</span>
      </motion.button>

      <DonateModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}
