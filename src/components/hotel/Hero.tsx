"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";

interface HeroImage {
  src: string;
  alt: string;
}

export const Hero = () => {
  const [images, setImages] = useState<HeroImage[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMounted, setIsMounted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchImages = async () => {
      setLoading(true);
      const { data, error } = await supabase.storage.from('gallery').list('hero', {
        limit: 5,
        offset: 0,
        sortBy: { column: 'created_at', order: 'desc' },
      });

      if (error) {
        console.error("Error fetching hero images:", error);
        setLoading(false);
        return;
      }

      if (data) {
        const imageUrls = data
          .filter(file => file.name !== '.emptyFolderPlaceholder')
          .map(file => ({
            src: supabase.storage.from('gallery').getPublicUrl(`hero/${file.name}`).data.publicUrl,
            alt: `Imagem do banner principal ${file.name}`
          }));
        setImages(imageUrls);
      }
      setLoading(false);
    };

    fetchImages();
  }, []);

  useEffect(() => {
    setIsMounted(true);
    if (images.length > 0) {
      const timer = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
      }, 5000);
      return () => clearInterval(timer);
    }
  }, [images]);

  return (
    <div className="relative h-screen w-full overflow-hidden bg-gray-800">
      {!loading && images.length > 0 ? (
        images.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 h-full w-full bg-cover bg-center transition-opacity duration-1000 ${
              index === currentIndex ? "opacity-100" : "opacity-0"
            }`}
            style={{ backgroundImage: `url(${image.src})` }}
            role="img"
            aria-label={image.alt}
          />
        ))
      ) : (
        <div className="absolute inset-0 bg-black bg-opacity-50" />
      )}
      <div className="absolute inset-0 bg-black bg-opacity-50" />

      <div className="relative z-10 flex h-full items-center justify-center p-4 text-center text-white">
        <div className={`transition-all duration-1000 ${isMounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
          <h1 className="text-4xl font-bold md:text-6xl">Bem-vindo ao Nosso Hotel</h1>
          <p className="mt-4 text-lg md:text-xl">Experimente o luxo e o conforto.</p>
        </div>
      </div>
    </div>
  );
};