"use client";

import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import React, { useState, useEffect } from 'react';

interface LightboxProps {
  images: string[];
  currentIndex: number;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
}

export function Lightbox({ images, currentIndex, onClose, onNext, onPrev }: LightboxProps) {
  if (currentIndex === null) return null;

  const [dragStartX, setDragStartX] = useState<number | null>(null);
  const [draggedX, setDraggedX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const handleDragStart = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    setDragStartX(clientX);
  };

  const handleDragMove = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    if (!isDragging || dragStartX === null) return;
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const diff = clientX - dragStartX;
    setDraggedX(diff);
  };

  const handleDragEnd = () => {
    if (!isDragging || dragStartX === null) return;

    const threshold = 50; // Distância mínima para acionar a navegação
    if (draggedX < -threshold) {
      onNext();
    } else if (draggedX > threshold) {
      onPrev();
    }

    setIsDragging(false);
    setDragStartX(null);
    setDraggedX(0);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') onNext();
      if (e.key === 'ArrowLeft') onPrev();
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onNext, onPrev, onClose]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50" onClick={onClose}>
      <button
        onClick={(e) => { e.stopPropagation(); onClose(); }}
        className="absolute top-4 right-4 text-white hover:text-gray-300 z-50"
      >
        <X size={32} />
      </button>

      <button
        onClick={(e) => { e.stopPropagation(); onPrev(); }}
        className="absolute left-4 md:left-10 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 z-50 p-2 bg-black bg-opacity-20 rounded-full"
      >
        <ChevronLeft size={48} />
      </button>

      <div
        className="relative max-w-4xl h-[90vh] w-full cursor-grab active:cursor-grabbing"
        onClick={(e) => e.stopPropagation()}
        onMouseDown={handleDragStart}
        onTouchStart={handleDragStart}
        onMouseMove={handleDragMove}
        onTouchMove={handleDragMove}
        onMouseUp={handleDragEnd}
        onTouchEnd={handleDragEnd}
        onMouseLeave={handleDragEnd}
      >
        <div
          className="w-full h-full bg-contain bg-no-repeat bg-center select-none"
          style={{
            backgroundImage: `url(${images[currentIndex]})`,
            transform: `translateX(${draggedX}px)`,
            transition: isDragging ? 'none' : 'transform 0.3s ease-out',
          }}
          role="img"
          aria-label={`Galeria ${currentIndex + 1}`}
        />
      </div>

      <button
        onClick={(e) => { e.stopPropagation(); onNext(); }}
        className="absolute right-4 md:right-10 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 z-50 p-2 bg-black bg-opacity-20 rounded-full"
      >
        <ChevronRight size={48} />
      </button>
    </div>
  );
}