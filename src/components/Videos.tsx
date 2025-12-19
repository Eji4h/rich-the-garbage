import { useState, useEffect, useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { galleryVideos } from '../utils/videos';
import LikeButton from './LikeButton';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const videos = galleryVideos;

function VideoItem({
  src,
  index,
  onClick,
}: {
  src: string;
  index: number;
  onClick: () => void;
}) {
  const [isLoading, setIsLoading] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current?.readyState === 4) {
      setIsLoading(false);
    }
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05 }}
      className="group relative aspect-[4/5] cursor-pointer overflow-hidden rounded-2xl bg-white/40 backdrop-blur-sm shadow-lg ring-1 ring-white/50 transition-all hover:shadow-xl hover:bg-white/60 hover:ring-white/80"
      onClick={onClick}
    >
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/20 backdrop-blur-sm z-10">
          <motion.div
            animate={{
              y: [0, -10, 0],
              rotate: [0, -5, 5, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="text-purple-400/50"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-12 h-12"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.91 11.672l.266.162a.5.5 0 010 .848l-8.854 5.38a.5.5 0 01-.757-.43V5.56a.5.5 0 01.757-.43l8.854 5.38z"
              />
            </svg>
          </motion.div>
        </div>
      )}

      <div className="absolute inset-0 z-10 bg-gradient-to-t from-purple-900/40 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      <video
        ref={videoRef}
        src={src}
        className={cn(
          'h-full w-full object-cover transition-all duration-700 will-change-transform group-hover:scale-110',
          isLoading ? 'opacity-0' : 'opacity-100',
        )}
        muted
        loop
        playsInline
        onLoadedData={() => setIsLoading(false)}
        onError={() => setIsLoading(false)}
      />

      {/* Play button overlay */}
      <div className="absolute inset-0 z-20 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <div className="rounded-full bg-white/90 backdrop-blur-sm p-4 shadow-lg">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-8 h-8 text-purple-600"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.986V5.653z"
            />
          </svg>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 z-30 p-6 translate-y-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-sm font-medium text-white drop-shadow-md">
              Video Collection
            </p>
            <p className="text-xs text-white/80 drop-shadow-md">#{index + 1}</p>
          </div>
          <div onClick={(e) => e.stopPropagation()} className="relative z-40">
            <LikeButton imageId={src} />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function Videos() {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleNext = useCallback(() => {
    setSelectedIndex((prev) =>
      prev === null ? null : (prev + 1) % videos.length,
    );
  }, []);

  const handlePrev = useCallback(() => {
    setSelectedIndex((prev) =>
      prev === null ? null : (prev - 1 + videos.length) % videos.length,
    );
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedIndex === null) return;
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'Escape') setSelectedIndex(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedIndex, handleNext, handlePrev]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (selectedIndex !== null) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [selectedIndex]);

  // Play video when modal opens
  useEffect(() => {
    if (selectedIndex !== null && videoRef.current) {
      videoRef.current.play().catch(() => {
        // Autoplay failed, user interaction required
      });
    }
  }, [selectedIndex]);

  return (
    <div className="p-4 md:p-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mx-auto max-w-7xl">
        {videos.map((src, index) => (
          <VideoItem
            key={src}
            src={src}
            index={index}
            onClick={() => setSelectedIndex(index)}
          />
        ))}
      </div>

      {typeof window !== 'undefined' &&
        createPortal(
          <AnimatePresence>
            {selectedIndex !== null && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[9999] bg-white/60 backdrop-blur-xl"
                onClick={() => setSelectedIndex(null)}
              >
                {/* Close button */}
                <button
                  onClick={() => setSelectedIndex(null)}
                  className="absolute top-6 right-6 z-50 p-2 text-slate-500 hover:text-slate-900 transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-8 h-8"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>

                {/* Navigation buttons */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePrev();
                  }}
                  className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-50 p-2 md:p-4 text-slate-600 hover:text-slate-900 transition-all bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:shadow-xl hover:scale-110"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-6 h-6 md:w-8 md:h-8"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.75 19.5L8.25 12l7.5-7.5"
                    />
                  </svg>
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleNext();
                  }}
                  className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-50 p-2 md:p-4 text-slate-600 hover:text-slate-900 transition-all bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:shadow-xl hover:scale-110"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-6 h-6 md:w-8 md:h-8"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M8.25 4.5l7.5 7.5-7.5 7.5"
                    />
                  </svg>
                </button>

                <motion.div
                  key={selectedIndex}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                  className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 max-h-[90vh] max-w-[90vw] overflow-hidden rounded-2xl shadow-2xl ring-1 ring-white/50"
                  onClick={(e) => e.stopPropagation()}
                >
                  <video
                    ref={videoRef}
                    src={videos[selectedIndex]}
                    controls
                    autoPlay
                    className="max-h-[85vh] w-auto object-contain"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-white/90 to-transparent p-6">
                    <div className="flex items-center justify-between">
                      <p className="text-slate-900 font-medium">
                        Video {selectedIndex + 1} of {videos.length}
                      </p>
                      <LikeButton imageId={videos[selectedIndex]} />
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </div>
  );
}
