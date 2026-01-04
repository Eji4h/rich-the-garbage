import { motion } from 'framer-motion';

export function DonateCancel() {
  const handleBackToHome = () => {
    window.location.hash = '';
    window.location.reload();
  };

  const handleTryAgain = () => {
    window.location.hash = '';
    window.location.reload();
    // The donate button will be available on the main page
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-pink-200 via-purple-200 to-blue-200 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring' }}
          className="mb-6"
        >
          <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto">
            <svg
              className="w-12 h-12 text-yellow-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
        </motion.div>

        <h1 className="text-3xl font-bold text-slate-800 mb-4">
          Donation Cancelled
        </h1>

        <p className="text-slate-600 mb-6">
          No worries! Your donation was cancelled. If you'd like to support us
          in the future, we'd be happy to have you back anytime.
        </p>

        <div className="flex gap-3 justify-center">
          <button
            onClick={handleTryAgain}
            className="px-6 py-3 bg-linear-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all font-medium shadow-lg hover:shadow-xl"
          >
            Try Again
          </button>
          <button
            onClick={handleBackToHome}
            className="px-6 py-3 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-all font-medium"
          >
            Back to Home
          </button>
        </div>
      </motion.div>
    </div>
  );
}
