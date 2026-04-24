"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Viewer360({ images, onLoadError }: { images: string[], onLoadError?: () => void }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  
  const dragStartX = useRef(0);
  const lastIndex = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!images || images.length === 0) return;
    
    let loadedCount = 0;
    let hasError = false;

    images.forEach((src) => {
      const img = new Image();
      img.src = src;
      
      img.onload = () => {
        if (hasError) return;
        loadedCount++;
        if (loadedCount === images.length) setLoaded(true);
      };
      img.onerror = () => {
        hasError = true;
        if (onLoadError) onLoadError();
      };
    });
  }, [images, onLoadError]);

  const handleDragStart = useCallback((clientX: number) => {
    setIsDragging(true);
    setHasInteracted(true);
    dragStartX.current = clientX;
    lastIndex.current = currentIndex;
  }, [currentIndex]);

  const handleDragMove = useCallback((clientX: number) => {
    if (!isDragging) return;
    const deltaX = clientX - dragStartX.current;
    const sensitivity = 15; 
    const indexShift = Math.floor(deltaX / sensitivity);

    let newIndex = (lastIndex.current - indexShift) % images.length;
    if (newIndex < 0) newIndex += images.length;
    setCurrentIndex(newIndex);
  }, [isDragging, images.length]);

  const handleDragEnd = useCallback(() => setIsDragging(false), []);

  const onMouseDown = (e: React.MouseEvent) => handleDragStart(e.clientX);
  const onMouseMove = (e: React.MouseEvent) => handleDragMove(e.clientX);
  const onTouchStart = (e: React.TouchEvent) => handleDragStart(e.touches[0].clientX);
  const onTouchMove = (e: React.TouchEvent) => handleDragMove(e.touches[0].clientX);

  if (!images || images.length === 0) return null;

  return (
    <div 
      ref={containerRef}
      className={`relative w-full h-full flex items-center justify-center select-none overflow-hidden touch-none
        ${isDragging ? "cursor-grabbing" : "cursor-grab"}`}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={handleDragEnd}
      onMouseLeave={handleDragEnd}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={handleDragEnd}
    >
      {!loaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-10">
          <p className="text-matrix text-xs font-mono animate-pulse uppercase tracking-widest">&gt; CARREGANDO...</p>
        </div>
      )}

      <AnimatePresence>
        {!hasInteracted && loaded && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.2 }}
            className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-20"
          >
            <div className="w-24 h-24 rounded-full border-2 border-matrix/50 bg-black/40 backdrop-blur-sm flex flex-col items-center justify-center shadow-[0_0_30px_rgba(30,255,142,0.2)] animate-pulse">
              <span className="text-matrix font-bold text-2xl drop-shadow-md">360°</span>
              <span className="text-white text-[10px] uppercase tracking-widest mt-1">Girar</span>
            </div>
            <svg className="w-32 h-8 mt-4 text-matrix/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
            </svg>
          </motion.div>
        )}
      </AnimatePresence>

      <img
        src={images[currentIndex]}
        alt="360 View"
        className={`w-full h-full object-contain pointer-events-none transition-opacity duration-300 ${loaded ? "opacity-100" : "opacity-0"}`}
        draggable={false} 
      />
    </div>
  );
}