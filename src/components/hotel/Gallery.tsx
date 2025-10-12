"use client";

import { useState, useEffect } from "react";
import { Lightbox } from "./Lightbox";
import { supabase } from "@/lib/supabaseClient";
import { Skeleton } from "@/components/ui/skeleton";

const BUCKET_NAME = 'gallery';
const FOLDER = 'main';
const ORDER_FILE_NAME = '_order.json';

export function Gallery() {
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentImage, setCurrentImage] = useState<number | null>(null);

  useEffect(() => {
    const fetchImages = async () => {
      setLoading(true);
      const { data: files, error: listError } = await supabase.storage.from(BUCKET_NAME).list(FOLDER, {
        limit: 100,
        offset: 0,
        sortBy: { column: 'created_at', order: 'desc' },
      });

      if (listError) {
        console.error("Error fetching images:", listError);
        setLoading(false);
        return;
      }

      const imageFiles = files.filter(file => file.name !== '.emptyFolderPlaceholder' && file.name !== ORDER_FILE_NAME);
      const imageUrls = imageFiles.map(file => ({
        name: file.name,
        url: supabase.storage.from(BUCKET_NAME).getPublicUrl(`${FOLDER}/${file.name}`).data.publicUrl,
      }));

      const { data: orderFileData } = await supabase.storage.from(BUCKET_NAME).download(`${FOLDER}/${ORDER_FILE_NAME}`);

      if (!orderFileData) {
        setImages(imageUrls.map(img => img.url).slice(0, 9));
      } else {
        const orderJson = await orderFileData.text();
        try {
          const orderedNames = JSON.parse(orderJson) as string[];
          const imageMap = new Map(imageUrls.map(img => [img.name, img.url]));
          const sortedUrls = orderedNames.map(name => imageMap.get(name)).filter((url): url is string => !!url);
          const newImageUrls = imageUrls.filter(img => !orderedNames.includes(img.name)).map(img => img.url);
          setImages([...sortedUrls, ...newImageUrls].slice(0, 9));
        } catch (e) {
          console.error("Error parsing order file, using default order", e);
          setImages(imageUrls.map(img => img.url).slice(0, 9));
        }
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