"use client";

import { galleryImages } from "@/data/gallery";
import { useState } from "react";
import { Lightbox } from "./Lightbox";

export function Gallery() {
  const [currentImage, setCurrentImage] = useState<number | null>(null);
  const displayImages = galleryImages.slice(0, 9);

  const openLightbox = (index: number) => {
    setCurrentImage(index);
  };

  const closeLightbox = () => {
    setCurrentImage(null);
  };

  const nextImage = () => {
    if (currentImage !== null) {
      setCurrentImage((currentImage + 1) % displayImages.length);
    }
  };

  const prevImage = () => {
    if (currentImage !== null) {
      setCurrentImage((currentImage - 1 + displayImages.length) % displayImages.length);
    }
  };

  return (
    <>
      <section id="galeria" className="py-20 bg-gray-100">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-800">Conheça Nosso Flat Hotel</h2>
          <p className="text-gray-600 mt-2 mb-12">Conheça nossos ambientes</p>
          <div className="grid grid-cols-3 gap-4">
            {displayImages.map((src, index) => (
              <div
                key={index}
                className="overflow-hidden rounded-lg shadow-lg aspect-square cursor-pointer"
                onClick={() => openLightbox(index)}
              >
                <img
                  src={src}
                  alt={`Galeria ${index + 1}`}
                  className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-300"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {currentImage !== null && (
        <Lightbox
          images={displayImages}
          currentIndex={currentImage}
          onClose={closeLightbox}
          onNext={nextImage}
          onPrev={prevImage}
        />
      )}
    </>
  );
}