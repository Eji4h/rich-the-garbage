import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getLikes, addLike, removeLike } from '../utils/likeApi';

interface LikeButtonProps {
  imageId: string;
}

export default function LikeButton({ imageId }: LikeButtonProps) {
  const [liked, setLiked] = useState(false);
  const [count, setCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [showParticles, setShowParticles] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function fetchLikes() {
      const data = await getLikes(imageId);
      if (mounted) {
        setLiked(data.liked);
        setCount(data.count);
        setIsLoading(false);
      }
    }

    fetchLikes();
    return () => {
      mounted = false;
    };
  }, [imageId]);

  const handleClick = useCallback(async () => {
    if (isLoading) return;

    // Optimistic update
    const newLiked = !liked;
    setLiked(newLiked);
    setCount((prev) => (newLiked ? prev + 1 : Math.max(0, prev - 1)));

    if (newLiked) {
      setShowParticles(true);
      setTimeout(() => setShowParticles(false), 700);
    }

    try {
      const data = newLiked
        ? await addLike(imageId)
        : await removeLike(imageId);
      setLiked(data.liked);
      setCount(data.count);
    } catch {
      // Revert on error
      setLiked(!newLiked);
      setCount((prev) => (newLiked ? Math.max(0, prev - 1) : prev + 1));
    }
  }, [imageId, liked, isLoading]);

  return (
    <div className="relative">
      <motion.button
        onClick={handleClick}
        disabled={isLoading}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="group flex items-center gap-2 rounded-full bg-white/90 backdrop-blur-sm px-4 py-2 shadow-lg ring-1 ring-white/50 transition-all hover:bg-white hover:shadow-xl disabled:opacity-50"
      >
        <motion.span
          animate={liked ? { scale: [1, 1.3, 1] } : {}}
          transition={{ duration: 0.3 }}
        >
          {liked ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-5 h-5 text-pink-500"
            >
              <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5 text-slate-500 group-hover:text-pink-500 transition-colors"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
              />
            </svg>
          )}
        </motion.span>
        <span className="text-sm font-medium text-slate-700 tabular-nums">
          {count}
        </span>
      </motion.button>

      {/* Particle effects */}
      <AnimatePresence>
        {showParticles && (
          <>
            {[...Array(6)].map((_, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 1, scale: 0, x: 0, y: 0 }}
                animate={{
                  opacity: 0,
                  scale: 1,
                  x: (Math.random() - 0.5) * 60,
                  y: (Math.random() - 0.5) * 60 - 20,
                }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className="absolute left-1/2 top-1/2 pointer-events-none"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-3 h-3 text-pink-400"
                >
                  <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
                </svg>
              </motion.span>
            ))}
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
