import { motion } from 'framer-motion';

interface DonateSuccessProps {
  onClose: () => void;
}

export function DonateSuccess({ onClose }: DonateSuccessProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="relative w-full max-w-md bg-linear-to-br from-white via-green-50 to-emerald-50 rounded-2xl shadow-2xl ring-1 ring-black/10 overflow-hidden p-8 text-center"
      >
        {/* Success icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className="inline-flex items-center justify-center w-20 h-20 mb-6 rounded-full bg-linear-to-br from-green-400 to-emerald-500 shadow-lg"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2.5}
            stroke="currentColor"
            className="w-10 h-10 text-white"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4.5 12.75l6 6 9-13.5"
            />
          </svg>
        </motion.div>

        <h2 className="text-2xl font-bold text-slate-800 mb-2">
          Thank You So Much!
        </h2>

        <p className="text-slate-600 mb-6">
          Your generous donation helps keep Rich The Garbage running. We truly
          appreciate your support!
        </p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-5xl mb-6"
        >
          🎉💖🐱
        </motion.div>

        <motion.button
          onClick={onClose}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full py-4 rounded-xl font-bold text-lg bg-linear-to-r from-green-500 to-emerald-600 text-white shadow-lg hover:shadow-xl transition-shadow"
        >
          Continue Exploring
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
