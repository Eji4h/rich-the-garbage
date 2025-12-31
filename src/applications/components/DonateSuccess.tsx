import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export function DonateSuccess() {
  const [sessionId, setSessionId] = useState<string | null>(null);

  useEffect(() => {
    // Get session_id from query params
    const params = new URLSearchParams(window.location.search);
    const id = params.get('session_id');
    if (id) {
      setSessionId(id);
    }

    // Auto-clear hash after 5 seconds
    const timer = setTimeout(() => {
      window.location.hash = '';
      window.location.reload();
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const handleBackToHome = () => {
    window.location.hash = '';
    window.location.reload();
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
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
            <svg
              className="w-12 h-12 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        </motion.div>

        <h1 className="text-3xl font-bold text-slate-800 mb-4">
          Thank You! 🎉
        </h1>

        <p className="text-slate-600 mb-6">
          Your donation has been received successfully. Your support means the
          world to us and helps keep this project running!
        </p>

        {sessionId && (
          <div className="mb-6 p-3 bg-slate-50 rounded-lg">
            <p className="text-xs text-slate-500 mb-1">Session ID</p>
            <p className="text-sm font-mono text-slate-700 break-all">
              {sessionId}
            </p>
          </div>
        )}

        <button
          onClick={handleBackToHome}
          className="px-6 py-3 bg-linear-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all font-medium shadow-lg hover:shadow-xl"
        >
          Back to Home
        </button>

        <p className="text-xs text-slate-500 mt-4">
          Redirecting in 5 seconds...
        </p>
      </motion.div>
    </div>
  );
}
