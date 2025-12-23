import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { redirectToCheckout } from '../../utils/donateApi';

interface DonateModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PRESET_AMOUNTS = [5, 10, 25, 50, 100];

export function DonateModal({ isOpen, onClose }: DonateModalProps) {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getAmount = (): number | null => {
    if (selectedAmount !== null) return selectedAmount;
    const parsed = parseFloat(customAmount);
    return !isNaN(parsed) && parsed >= 1 ? parsed : null;
  };

  const handlePresetClick = (amount: number) => {
    setSelectedAmount(amount);
    setCustomAmount('');
    setError(null);
  };

  const handleCustomChange = (value: string) => {
    setCustomAmount(value);
    setSelectedAmount(null);
    setError(null);
  };

  const handleSubmit = async () => {
    const amount = getAmount();
    if (!amount) {
      setError('Please select or enter an amount (minimum $1)');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await redirectToCheckout(amount);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
      setIsLoading(false);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={handleBackdropClick}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-md bg-linear-to-br from-white via-purple-50 to-pink-50 rounded-2xl shadow-2xl ring-1 ring-black/10 overflow-hidden"
          >
            {/* Header */}
            <div className="relative px-6 pt-6 pb-4 text-center">
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors"
                aria-label="Close"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>

              <div className="inline-flex items-center justify-center w-16 h-16 mb-3 rounded-full bg-linear-to-br from-rose-400 via-pink-500 to-purple-600 shadow-lg">
                <span className="text-3xl">💝</span>
              </div>

              <h2 className="text-2xl font-bold text-slate-800 mb-1">
                Support Rich The Garbage
              </h2>
              <p className="text-slate-600 text-sm">
                Your donation helps keep this project alive!
              </p>
            </div>

            {/* Amount Selection */}
            <div className="px-6 pb-6">
              {/* Preset amounts */}
              <div className="grid grid-cols-5 gap-2 mb-4">
                {PRESET_AMOUNTS.map((amount) => (
                  <button
                    key={amount}
                    onClick={() => handlePresetClick(amount)}
                    className={`py-3 px-2 rounded-xl font-semibold text-sm transition-all ${
                      selectedAmount === amount
                        ? 'bg-linear-to-br from-rose-500 via-pink-500 to-purple-600 text-white shadow-lg scale-105'
                        : 'bg-white text-slate-700 hover:bg-purple-50 ring-1 ring-slate-200 hover:ring-purple-300'
                    }`}
                  >
                    ${amount}
                  </button>
                ))}
              </div>

              {/* Custom amount */}
              <div className="relative mb-4">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-medium">
                  $
                </span>
                <input
                  type="number"
                  min="1"
                  step="0.01"
                  placeholder="Custom amount"
                  value={customAmount}
                  onChange={(e) => handleCustomChange(e.target.value)}
                  className={`w-full pl-8 pr-4 py-3 rounded-xl bg-white ring-1 transition-all focus:outline-none focus:ring-2 ${
                    customAmount && selectedAmount === null
                      ? 'ring-purple-400 focus:ring-purple-500'
                      : 'ring-slate-200 focus:ring-purple-400'
                  }`}
                />
              </div>

              {/* Error message */}
              <AnimatePresence>
                {error && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="text-red-500 text-sm text-center mb-4"
                  >
                    {error}
                  </motion.p>
                )}
              </AnimatePresence>

              {/* Submit button */}
              <motion.button
                onClick={handleSubmit}
                disabled={isLoading || !getAmount()}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${
                  isLoading || !getAmount()
                    ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    : 'bg-linear-to-r from-rose-500 via-pink-500 to-purple-600 text-white shadow-lg hover:shadow-xl'
                }`}
              >
                {isLoading ? (
                  <span className="inline-flex items-center gap-2">
                    <svg
                      className="animate-spin h-5 w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Processing...
                  </span>
                ) : getAmount() ? (
                  `Donate $${getAmount()}`
                ) : (
                  'Select an amount'
                )}
              </motion.button>

              {/* Secure payment note */}
              <p className="text-center text-xs text-slate-500 mt-4 flex items-center justify-center gap-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-4 h-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
                  />
                </svg>
                Secure payment powered by Stripe
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
