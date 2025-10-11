"use client";

import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import React from 'react';

interface LightboxProps {
  images: string[];
  currentIndex: number;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
}

export function Lightbox({ images, currentIndex, onClose, onNext, onPrev }: LightboxProps) {
  if (currentIndex === null) return null;

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

      <div className="relative max-w-4xl max-h-[90vh] w-full" onClick={(e) => e.stopPropagation()}>
        <img
          src={images[currentIndex]}
          alt={`Galeria ${currentIndex + 1}`}
          className="w-full h-full object-contain"
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