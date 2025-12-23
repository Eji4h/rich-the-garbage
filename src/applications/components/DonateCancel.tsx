import { motion } from 'framer-motion';

interface DonateCancelProps {
  onClose: () => void;
  onRetry: () => void;
}

export function DonateCancel({ onClose, onRetry }: DonateCancelProps) {
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
        className="relative w-full max-w-md bg-linear-to-br from-white via-slate-50 to-purple-50 rounded-2xl shadow-2xl ring-1 ring-black/10 overflow-hidden p-8 text-center"
      >
        {/* Info icon */}
        <div className="inline-flex items-center justify-center w-20 h-20 mb-6 rounded-full bg-linear-to-br from-slate-300 to-slate-400 shadow-lg">
          <span className="text-4xl">😿</span>
        </div>

        <h2 className="text-2xl font-bold text-slate-800 mb-2">
          Payment Cancelled
        </h2>

        <p className="text-slate-600 mb-6">
          No worries! You can try again whenever you&apos;re ready. Every
          donation, big or small, makes a difference.
        </p>

        <div className="flex flex-col gap-3">
          <motion.button
            onClick={onRetry}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-4 rounded-xl font-bold text-lg bg-linear-to-r from-rose-500 via-pink-500 to-purple-600 text-white shadow-lg hover:shadow-xl transition-shadow"
          >
            Try Again
          </motion.button>

          <button
            onClick={onClose}
            className="w-full py-3 rounded-xl font-medium text-slate-600 hover:bg-slate-100 transition-colors"
          >
            Maybe Later
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
