import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDonate } from '../hooks/useDonate';
import {
  detectCurrencyFromLocale,
  formatAmount,
  getSupportedCurrencies,
} from '../../utils/currency';

interface DonateButtonProps {
  variant?: 'default' | 'subtle' | 'inline' | 'sticky' | 'hero';
  className?: string;
}

const BASE_AMOUNTS = [5, 10, 20, 50]; // Base amounts that will be converted to minor units

export function DonateButton({
  variant = 'default',
  className = '',
}: DonateButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currency, setCurrency] = useState('usd');
  const { createCheckout, isLoading, error } = useDonate();

  useEffect(() => {
    setCurrency(detectCurrencyFromLocale());
  }, []);

  const handleDonate = async (amountMinor: number) => {
    try {
      await createCheckout(amountMinor, currency);
    } catch (err) {
      console.error('Donation error:', err);
    }
  };

  const presetAmounts = BASE_AMOUNTS.map((amount) => ({
    label: formatAmount(amount * 100, currency),
    amountMinor: amount * 100,
  }));

  const supportedCurrencies = getSupportedCurrencies();

  // Variant-specific styling
  const getButtonClasses = () => {
    switch (variant) {
      case 'sticky':
        return 'inline-flex items-center gap-2 px-3 py-1.5 text-sm bg-linear-to-r from-purple-600 to-pink-600 text-white rounded-full hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg hover:shadow-xl font-medium animate-pulse';
      case 'hero':
        return 'inline-flex items-center gap-3 px-8 py-4 text-lg bg-linear-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all shadow-2xl hover:shadow-purple-500/50 font-bold hover:scale-105 animate-pulse';
      case 'subtle':
        return 'text-slate-800 hover:text-purple-700 transition-colors inline-flex items-center gap-2';
      case 'inline':
        return 'text-purple-600 hover:text-purple-800 underline text-sm inline-flex items-center gap-1';
      default:
        return 'inline-flex items-center gap-2 px-6 py-3 bg-linear-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all shadow-xl hover:shadow-2xl font-semibold hover:scale-105';
    }
  };

  const getButtonText = () => {
    if (isLoading) return 'Loading...';
    switch (variant) {
      case 'hero':
        return 'Support Us';
      case 'sticky':
        return 'Donate';
      default:
        return 'Donate';
    }
  };

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(true)}
        className={getButtonClasses()}
        disabled={isLoading}
      >
        {variant !== 'inline' && (
          <svg
            className={variant === 'hero' ? 'w-6 h-6' : 'w-5 h-5'}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
        )}
        <span>{getButtonText()}</span>
        {variant === 'hero' && (
          <span className="text-2xl animate-bounce">✨</span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
              onClick={() => setIsOpen(false)}
            >
              <div
                className="bg-white rounded-2xl shadow-2xl p-6 max-w-md w-full"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-slate-800">
                    Support Rich The Garbage
                  </h3>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="text-slate-500 hover:text-slate-700 transition-colors"
                    aria-label="Close"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>

                <p className="text-slate-600 mb-4">
                  Thank you for your support! Your donation helps keep this
                  project running.
                </p>

                {/* Currency Selector */}
                <div className="mb-4">
                  <label
                    htmlFor="currency-select"
                    className="block text-sm font-medium text-slate-700 mb-2"
                  >
                    Currency
                  </label>
                  <select
                    id="currency-select"
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-slate-800"
                  >
                    {supportedCurrencies.map((curr) => (
                      <option key={curr.code} value={curr.code}>
                        {curr.symbol} {curr.name}
                      </option>
                    ))}
                  </select>
                </div>

                {error && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                    {error}
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3 mb-4">
                  {presetAmounts.map((preset) => (
                    <button
                      key={preset.amountMinor}
                      onClick={() => handleDonate(preset.amountMinor)}
                      disabled={isLoading}
                      className="px-4 py-3 bg-linear-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl hover:scale-105"
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>

                <p className="text-xs text-slate-500 text-center">
                  Secure payment powered by Stripe
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
