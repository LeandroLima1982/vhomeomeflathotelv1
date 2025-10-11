"use client";

import { useState, useEffect } from "react";
import { Lightbox } from "./Lightbox";
import { supabase } from "@/lib/supabaseClient";
import { Skeleton } from "@/components/ui/skeleton";

export function Gallery() {
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentImage, setCurrentImage] = useState<number | null>(null);

  useEffect(() => {
    const fetchImages = async () => {
      setLoading(true);
      const { data, error } = await supabase.storage.from('gallery').list('main', {
        limit: 9,
        offset: 0,
        sortBy: { column: 'created_at', order: 'desc' },
      });

      if (error) {
        console.error("Error fetching images:", error);
        setLoading(false);
        return;
      }

      if (data) {
        const imageUrls = data
          .filter(file => file.name !== '.emptyFolderPlaceholder')
          .map(file => {
            return supabase.storage.from('gallery').getPublicUrl(`main/${file.name}`).data.publicUrl;
          });
        setImages(imageUrls);
      }
      setLoading(false);
    };

    fetchImages();
  }, []);

  const openLightbox = (index: number) => {
    setCurrentImage(index);
  };

  const closeLightbox = () => {
    setCurrentImage(null);
  };

  const nextImage = () => {
    if (currentImage !== null) {
      setCurrentImage((currentImage + 1) % images.length);
    }
  };

  const prevImage = () => {
    if (currentImage !== null) {
      setCurrentImage((currentImage - 1 + images.length) % images.length);
    }
  };

  return (
    <>
      <section id="galeria" className="py-20 bg-gray-100">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-800">Conheça Nosso Flat Hotel</h2>
          <p className="text-gray-600 mt-2 mb-12">Conheça nossos ambientes</p>
          <div className="grid grid-cols-3 gap-4">
            {loading ? (
              Array.from({ length: 9 }).map((_, index) => (
                <Skeleton key={index} className="aspect-square w-full rounded-lg" />
              ))
            ) : (
              images.map((src, index) => (
                <div
                  key={index}
                  className="overflow-hidden rounded-lg shadow-lg aspect-square cursor-pointer"
                  onClick={() => openLightbox(index)}
                >
                  <div
                    className="w-full h-full bg-cover bg-center transform hover:scale-110 transition-transform duration-300"
                    style={{ backgroundImage: `url(${src})` }}
                    role="img"
                    aria-label={`Galeria ${index + 1}`}
                  />
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {currentImage !== null && (
        <Lightbox
          images={images}
          currentIndex={currentImage}
          onClose={closeLightbox}
          onNext={nextImage}
          onPrev={prevImage}
        />
      )}
    </>
  );
}