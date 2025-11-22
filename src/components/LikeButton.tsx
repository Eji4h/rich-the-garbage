import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getLikes, addLike, removeLike } from "../utils/likeApi";

interface LikeButtonProps {
  imageId: string;
  className?: string;
}

export default function LikeButton({ imageId, className = "" }: LikeButtonProps) {
  const [count, setCount] = useState<number>(0);
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);

  // Load initial like count and check if user has liked
  useEffect(() => {
    const loadLikes = async () => {
      const likeCount = await getLikes(imageId);
      setCount(likeCount);
      
      // Check localStorage to see if user has liked this image
      const liked = localStorage.getItem(`liked:${imageId}`) === 'true';
      setIsLiked(liked);
    };
    loadLikes();
  }, [imageId]);

  const handleLike = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (isLoading) return;

    setIsLoading(true);
    setIsAnimating(true);
    
    const previousCount = count;
    const previousLiked = isLiked;

    try {
      if (isLiked) {
        // Unlike - optimistic update
        setCount(prev => Math.max(0, prev - 1));
        setIsLiked(false);
        localStorage.setItem(`liked:${imageId}`, 'false');
        
        // Make API call
        const newCount = await removeLike(imageId);
        setCount(newCount);
      } else {
        // Like - optimistic update
        setCount(prev => prev + 1);
        setIsLiked(true);
        localStorage.setItem(`liked:${imageId}`, 'true');
        
        // Make API call
        const newCount = await addLike(imageId);
        setCount(newCount);
      }
    } catch (error) {
      // Rollback on error
      setCount(previousCount);
      setIsLiked(previousLiked);
      localStorage.setItem(`liked:${imageId}`, previousLiked.toString());
      console.error('Failed to update like:', error);
    } finally {
      setIsLoading(false);
      setTimeout(() => setIsAnimating(false), 600);
    }
  };

  return (
    <motion.button
      onClick={handleLike}
      disabled={isLoading}
      className={`group flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur-md shadow-lg hover:shadow-xl transition-all duration-300 hover:bg-white/90 disabled:opacity-50 disabled:cursor-not-allowed ring-1 ring-white/50 hover:ring-white/80 ${className}`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <motion.div
        animate={isAnimating ? {
          scale: [1, 1.3, 1],
          rotate: [0, -10, 10, 0]
        } : {}}
        transition={{ duration: 0.6 }}
      >
        <AnimatePresence mode="wait">
          {isLiked ? (
            <motion.svg
              key="liked"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-5 h-5 text-pink-500"
            >
              <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
            </motion.svg>
          ) : (
            <motion.svg
              key="unliked"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5 text-slate-600 group-hover:text-pink-500 transition-colors"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
            </motion.svg>
          )}
        </AnimatePresence>
      </motion.div>
      
      <motion.span
        key={count}
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-sm font-semibold text-slate-700 min-w-[1.5rem] text-center"
      >
        {count}
      </motion.span>
    </motion.button>
  );
}
