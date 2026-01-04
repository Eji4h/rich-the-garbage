import { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useDonate } from '../hooks/useDonate';
import { useDonateModal } from '../hooks/useDonateModal';
import {
  detectCurrencyFromLocale,
  formatAmount,
  getCurrencyDecimals,
  getSupportedCurrencies,
  getDonationPresetAmounts,
  getDonationLimits,
} from '../../utils/currency';

function parseAmountMajorToMinor(
  amountMajorInput: string,
  currency: string,
): number | null {
  const decimals = getCurrencyDecimals(currency);
  const limits = getDonationLimits(currency);

  const normalized = amountMajorInput.trim().replace(',', '.');
  if (!normalized) return null;
  if (!/^\d+(\.\d+)?$/.test(normalized)) return null;

  const [intPartRaw, fracRaw = ''] = normalized.split('.');
  const intPart = Number(intPartRaw);
  if (!Number.isFinite(intPart)) return null;

  if (fracRaw.length > decimals) return null;

  const factor = 10 ** decimals;
  const fracPadded = fracRaw.padEnd(decimals, '0');
  const fracPart = decimals === 0 ? 0 : Number(fracPadded);
  if (!Number.isFinite(fracPart)) return null;

  const amountMinor = intPart * factor + fracPart;
  if (!Number.isInteger(amountMinor)) return null;

  if (amountMinor < limits.minMinor || amountMinor > limits.maxMinor) {
    return null;
  }

  return amountMinor;
}

function DonateModal() {
  const { isOpen, closeDonateModal } = useDonateModal();
  const [currency, setCurrency] = useState('usd');
  const [customAmountMajor, setCustomAmountMajor] = useState('');
  const [customAmountError, setCustomAmountError] = useState<string | null>(
    null,
  );
  const { createCheckout, isLoading, error } = useDonate();

  // Auto-detect currency when modal opens
  useEffect(() => {
    if (isOpen) {
      setCurrency(detectCurrencyFromLocale());
      setCustomAmountMajor('');
      setCustomAmountError(null);
    }
  }, [isOpen]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = '';
      };
    }
  }, [isOpen]);

  // Handle Escape key
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeDonateModal();
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, closeDonateModal]);

  const handleDonate = useCallback(
    async (amountMinor: number) => {
      try {
        await createCheckout(amountMinor, currency);
      } catch (err) {
        console.error('Donation error:', err);
      }
    },
    [createCheckout, currency],
  );

  const presetAmounts = getDonationPresetAmounts(currency);
  const supportedCurrencies = getSupportedCurrencies();
  const decimals = getCurrencyDecimals(currency);
  const limits = getDonationLimits(currency);

  // Don't render if not in browser or portal target doesn't exist
  if (typeof window === 'undefined') {
    return null;
  }

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="donate-modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={closeDonateModal}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-9999"
          />

          {/* Modal */}
          <motion.div
            key="donate-modal-content"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{
              duration: 0.2,
              ease: [0.4, 0, 0.2, 1],
            }}
            className="fixed inset-0 z-10000 flex items-center justify-center p-4 pointer-events-none"
            onClick={closeDonateModal}
          >
            <div
              className="bg-white rounded-2xl shadow-2xl p-6 max-w-md w-full pointer-events-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-slate-800">
                  Support Rich The Garbage
                </h3>
                <button
                  onClick={closeDonateModal}
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

              {/* Custom amount */}
              <div className="mb-4">
                <label
                  htmlFor="custom-amount"
                  className="block text-sm font-medium text-slate-700 mb-2"
                >
                  Custom amount
                </label>
                <div className="flex gap-2">
                  <input
                    id="custom-amount"
                    value={customAmountMajor}
                    onChange={(e) => {
                      setCustomAmountMajor(e.target.value);
                      setCustomAmountError(null);
                    }}
                    inputMode="decimal"
                    placeholder={decimals === 0 ? '100' : '10.00'}
                    className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-slate-800"
                    aria-describedby="custom-amount-help"
                  />
                  <button
                    onClick={async () => {
                      const amountMinor = parseAmountMajorToMinor(
                        customAmountMajor,
                        currency,
                      );
                      if (amountMinor === null) {
                        setCustomAmountError(
                          `Enter an amount between ${formatAmount(
                            limits.minMinor,
                            currency,
                          )} and ${formatAmount(limits.maxMinor, currency)}.`,
                        );
                        return;
                      }

                      await handleDonate(amountMinor);
                    }}
                    disabled={isLoading}
                    className="px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Donate
                  </button>
                </div>
                <p
                  id="custom-amount-help"
                  className="mt-2 text-xs text-slate-500"
                >
                  Min {formatAmount(limits.minMinor, currency)} · Max{' '}
                  {formatAmount(limits.maxMinor, currency)}
                  {decimals === 0 ? ' · No decimals for this currency' : null}
                </p>
                {customAmountError && (
                  <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                    {customAmountError}
                  </div>
                )}
              </div>

              <p className="text-xs text-slate-500 text-center">
                Secure payment powered by Stripe
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body,
  );
}

export default DonateModal;
