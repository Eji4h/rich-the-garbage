import { useState, useEffect, useCallback, useRef } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { galleryImages } from "../utils/images";
import LikeButton from "./LikeButton";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const images = galleryImages;

function GalleryItem({ 
  src, 
  index, 
  onClick 
}: { 
  src: string; 
  index: number; 
  onClick: () => void;
}) {
  const [isLoading, setIsLoading] = useState(true);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (imgRef.current?.complete) {
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
        <div className="absolute inset-0 flex items-center justify-center bg-white/20 backdrop-blur-sm">
          <motion.div
            animate={{ 
              y: [0, -10, 0],
              rotate: [0, -5, 5, 0]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="text-purple-400/50"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12">
              <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
            </svg>
          </motion.div>
        </div>
      )}
      
      <div className="absolute inset-0 z-10 bg-gradient-to-t from-purple-900/40 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      
      <img
        ref={imgRef}
        src={src}
        alt={`Gallery image ${index + 1}`}
        className={cn(
          "h-full w-full object-cover transition-all duration-700 will-change-transform group-hover:scale-110",
          isLoading ? "opacity-0" : "opacity-100"
        )}
        loading="lazy"
        onLoad={() => setIsLoading(false)}
        onError={() => setIsLoading(false)}
      />
      
      <div className="absolute bottom-0 left-0 right-0 z-20 p-6 translate-y-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-sm font-medium text-white drop-shadow-md">Collection Item</p>
            <p className="text-xs text-white/80 drop-shadow-md">#{index + 1}</p>
          </div>
          <LikeButton imageId={src} />
        </div>
      </div>
    </motion.div>
  );
}

export default function Gallery() {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const handleNext = useCallback(() => {
    setSelectedIndex((prev) => (prev === null ? null : (prev + 1) % images.length));
  }, []);

  const handlePrev = useCallback(() => {
    setSelectedIndex((prev) => (prev === null ? null : (prev - 1 + images.length) % images.length));
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedIndex === null) return;
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "Escape") setSelectedIndex(null);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
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

  return (
    <div className="p-4 md:p-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mx-auto max-w-7xl">
        {images.map((src, index) => (
          <GalleryItem 
            key={src} 
            src={src} 
            index={index} 
            onClick={() => setSelectedIndex(index)} 
          />
        ))}
      </div>

      {typeof window !== 'undefined' && createPortal(
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
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* Navigation buttons */}
              <button
                onClick={(e) => { e.stopPropagation(); handlePrev(); }}
                className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-50 p-2 md:p-4 text-slate-600 hover:text-slate-900 transition-all bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:shadow-xl hover:scale-110"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 md:w-8 md:h-8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                </svg>
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); handleNext(); }}
                className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-50 p-2 md:p-4 text-slate-600 hover:text-slate-900 transition-all bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:shadow-xl hover:scale-110"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 md:w-8 md:h-8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              </button>

              <motion.div
                key={selectedIndex}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 max-h-[90vh] max-w-[90vw] overflow-hidden rounded-2xl shadow-2xl ring-1 ring-white/50"
                onClick={(e) => e.stopPropagation()}
              >
                <img
                  src={images[selectedIndex]}
                  alt="Selected gallery image"
                  className="max-h-[85vh] w-auto object-contain"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-white/90 to-transparent p-6">
                  <div className="flex items-center justify-between">
                    <p className="text-slate-900 font-medium">Image {selectedIndex + 1} of {images.length}</p>
                    <LikeButton imageId={images[selectedIndex]} />
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
}
