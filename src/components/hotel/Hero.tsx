"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";

interface HeroImage {
  src: string;
  alt: string;
}

const BUCKET_NAME = 'gallery';
const FOLDER = 'hero';
const ORDER_FILE_NAME = '_order.json';

export const Hero = () => {
  const [images, setImages] = useState<HeroImage[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMounted, setIsMounted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchImages = async () => {
      setLoading(true);
      const { data: files, error: listError } = await supabase.storage.from(BUCKET_NAME).list(FOLDER, {
        limit: 100,
        offset: 0,
        sortBy: { column: 'created_at', order: 'desc' },
      });

      if (listError) {
        console.error("Error fetching hero images:", listError);
        setLoading(false);
        return;
      }

      const imageFiles = files.filter(file => file.name !== '.emptyFolderPlaceholder' && file.name !== ORDER_FILE_NAME);
      const imageObjects = imageFiles.map(file => ({
        name: file.name,
        src: supabase.storage.from(BUCKET_NAME).getPublicUrl(`${FOLDER}/${file.name}`).data.publicUrl,
        alt: `Imagem do banner principal ${file.name}`
      }));

      const { data: orderFileData } = await supabase.storage.from(BUCKET_NAME).download(`${FOLDER}/${ORDER_FILE_NAME}`);

      if (!orderFileData) {
        setImages(imageObjects.slice(0, 5));
      } else {
        const orderJson = await orderFileData.text();
        try {
          const orderedNames = JSON.parse(orderJson) as string[];
          const imageMap = new Map(imageObjects.map(img => [img.name, img]));
          const sortedImages = orderedNames.map(name => imageMap.get(name)).filter((img): img is HeroImage => !!img);
          const newImages = imageObjects.filter(img => !orderedNames.includes(img.name));
          setImages([...sortedImages, ...newImages].slice(0, 5));
        } catch (e) {
          console.error("Error parsing order file, using default order", e);
          setImages(imageObjects.slice(0, 5));
        }
      }
      setLoading(false);
    };

    fetchImages();
  }, []);

  useEffect(() => {
    setIsMounted(true);
    if (images.length > 1) {
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
          <h1 className="text-4xl font-bold md:text-6xl">Seu Flat Hotel à Beira Mar</h1>
          <p className="mt-4 text-lg md:text-xl">Onde Conforto, Sofisticação e Natureza se Entrelaçam</p>
        </div>
      </div>
    </div>
  );
};