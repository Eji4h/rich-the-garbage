import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { galleryImages } from "../utils/images";

const images = galleryImages;

// Smart pagination: show limited dots with current position
function getPaginationDots(currentIndex: number, totalImages: number, maxDots: number = 7) {
  if (totalImages <= maxDots) {
    return Array.from({ length: totalImages }, (_, i) => i);
  }

  const dots: (number | 'ellipsis')[] = [];
  const halfMax = Math.floor(maxDots / 2);

  if (currentIndex <= halfMax) {
    // Near the start
    for (let i = 0; i < maxDots - 1; i++) {
      dots.push(i);
    }
    dots.push('ellipsis');
  } else if (currentIndex >= totalImages - halfMax - 1) {
    // Near the end
    dots.push('ellipsis');
    for (let i = totalImages - maxDots + 1; i < totalImages; i++) {
      dots.push(i);
    }
  } else {
    // In the middle
    dots.push('ellipsis');
    for (let i = currentIndex - halfMax + 1; i <= currentIndex + halfMax - 1; i++) {
      dots.push(i);
    }
    dots.push('ellipsis');
  }

  return dots;
}

export default function HeroCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const paginationDots = getPaginationDots(currentIndex, images.length);

  return (
    <div className="relative h-[70vh] w-full overflow-hidden">
      <AnimatePresence initial={false}>
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="absolute inset-0"
        >
          <img
            src={images[currentIndex]}
            alt="Hero background"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/50 to-zinc-950" />
        </motion.div>
      </AnimatePresence>

      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 z-10">
        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="text-6xl md:text-8xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-purple-200 to-purple-400 mb-6 drop-shadow-lg"
        >
          Rich The Garbage
        </motion.h1>
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="text-xl md:text-2xl text-zinc-200 max-w-2xl font-light tracking-wide"
        >
          A collection of moments frozen in time.
        </motion.p>
      </div>

      {/* Navigation Buttons */}
      <button
        onClick={handlePrev}
        className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 p-4 md:p-6 text-white hover:text-white transition-all bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full shadow-xl hover:shadow-2xl hover:scale-110"
        aria-label="Previous slide"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-8 h-8 md:w-10 md:h-10">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        </svg>
      </button>
      <button
        onClick={handleNext}
        className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 p-4 md:p-6 text-white hover:text-white transition-all bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full shadow-xl hover:shadow-2xl hover:scale-110"
        aria-label="Next slide"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-8 h-8 md:w-10 md:h-10">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
        </svg>
      </button>

      {/* Smart Pagination Dots */}
      <div className="absolute bottom-24 left-1/2 -translate-x-1/2 flex items-center space-x-3 z-20">
        {paginationDots.map((item, idx) => {
          if (item === 'ellipsis') {
            return (
              <div key={`ellipsis-${idx}`} className="text-white/70 text-base font-bold px-2">
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
                  ? "bg-white w-12 h-3"
                  : "bg-white/40 hover:bg-white/60 w-3 h-3"
              }`}
              aria-label={`Go to slide ${item + 1}`}
            />
          );
        })}
      </div>
    </div>
  );
}
