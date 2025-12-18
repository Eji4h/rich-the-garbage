import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import { galleryVideos } from '../utils/videos';

const videos = galleryVideos;

// Smart pagination: show limited dots with current position
function getPaginationDots(
  currentIndex: number,
  totalVideos: number,
  maxDots: number = 7,
) {
  if (totalVideos <= maxDots) {
    return Array.from({ length: totalVideos }, (_, i) => i);
  }

  const dots: (number | 'ellipsis')[] = [];
  const halfMax = Math.floor(maxDots / 2);

  if (currentIndex <= halfMax) {
    // Near the start
    for (let i = 0; i < maxDots - 1; i++) {
      dots.push(i);
    }
    dots.push('ellipsis');
  } else if (currentIndex >= totalVideos - halfMax - 1) {
    // Near the end
    dots.push('ellipsis');
    for (let i = totalVideos - maxDots + 1; i < totalVideos; i++) {
      dots.push(i);
    }
  } else {
    // In the middle
    dots.push('ellipsis');
    for (
      let i = currentIndex - halfMax + 1;
      i <= currentIndex + halfMax - 1;
      i++
    ) {
      dots.push(i);
    }
    dots.push('ellipsis');
  }

  return dots;
}

export default function HeroCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + videos.length) % videos.length);
  }, []);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % videos.length);
  }, []);

  // Auto-advance when video ends
  const handleVideoEnd = useCallback(() => {
    handleNext();
  }, [handleNext]);

  const paginationDots = getPaginationDots(currentIndex, videos.length);

  return (
    <div className="relative h-[70vh] w-full overflow-hidden">
      <AnimatePresence initial={false}>
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="absolute inset-0"
        >
          <video
            ref={videoRef}
            src={videos[currentIndex]}
            autoPlay
            muted
            playsInline
            onEnded={handleVideoEnd}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/50 to-zinc-950" />
        </motion.div>
      </AnimatePresence>

      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 z-10">
        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="text-6xl md:text-8xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-purple-200 to-purple-400 mb-6 drop-shadow-lg"
        >
          Rich The Garbage
        </motion.h1>
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="text-xl md:text-2xl text-zinc-200 max-w-2xl font-light tracking-wide"
        >
          A collection of moments frozen in time.
        </motion.p>
      </div>

      {/* Navigation Buttons */}
      <button
        onClick={handlePrev}
        className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 p-4 md:p-6 text-white hover:text-white transition-all bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full shadow-xl hover:shadow-2xl hover:scale-110"
        aria-label="Previous video"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={3}
          stroke="currentColor"
          className="w-8 h-8 md:w-10 md:h-10"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.75 19.5L8.25 12l7.5-7.5"
          />
        </svg>
      </button>
      <button
        onClick={handleNext}
        className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 p-4 md:p-6 text-white hover:text-white transition-all bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full shadow-xl hover:shadow-2xl hover:scale-110"
        aria-label="Next video"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={3}
          stroke="currentColor"
          className="w-8 h-8 md:w-10 md:h-10"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8.25 4.5l7.5 7.5-7.5 7.5"
          />
        </svg>
      </button>

      {/* Video indicator */}
      <div className="absolute top-6 right-6 z-20 flex items-center gap-2 bg-black/40 backdrop-blur-sm rounded-full px-4 py-2">
        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
        <span className="text-white text-sm font-medium">
          {currentIndex + 1} / {videos.length}
        </span>
      </div>

      {/* AI Generated Disclaimer */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3 bg-yellow-500/90 backdrop-blur-sm rounded-lg px-5 py-2.5 shadow-lg border border-yellow-400">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-5 h-5 text-yellow-900 flex-shrink-0"
        >
          <path
            fillRule="evenodd"
            d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z"
            clipRule="evenodd"
          />
        </svg>
        <span className="text-yellow-900 text-sm font-bold">
          AI-generated videos for entertainment purposes only
        </span>
      </div>

      {/* Smart Pagination Dots */}
      <div className="absolute bottom-24 left-1/2 -translate-x-1/2 flex items-center space-x-3 z-20">
        {paginationDots.map((item, idx) => {
          if (item === 'ellipsis') {
            return (
              <div
                key={`ellipsis-${idx}`}
                className="text-white/70 text-base font-bold px-2"
              >
                •••
              </div>
            );
          }

          return (
            <button
              key={item}
              onClick={() => setCurrentIndex(item)}
              className={`rounded-full transition-all duration-300 ${
                item === currentIndex
                  ? 'bg-white w-12 h-3'
                  : 'bg-white/40 hover:bg-white/60 w-3 h-3'
              }`}
              aria-label={`Go to video ${item + 1}`}
            />
          );
        })}
      </div>
    </div>
  );
}
