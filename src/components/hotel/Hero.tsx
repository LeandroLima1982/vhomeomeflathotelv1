"use client";

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { cn } from '@/lib/utils';

const BUCKET_NAME = 'gallery';
const FOLDER = 'hero';
const ORDER_FILE_NAME = '_order.json';

export const Hero = () => {
  const [isMounted, setIsMounted] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    setIsMounted(true);
    fetchImages();
  }, []);

  const fetchImages = async () => {
    setLoading(true);
    
    if (!supabase) {
      console.error('Supabase client not available');
      setLoading(false);
      return;
    }

    const { data: files, error: listError } = await supabase.storage
      .from(BUCKET_NAME)
      .list(FOLDER, {
        limit: 100,
        offset: 0,
        sortBy: { column: 'created_at', order: 'desc' },
      });

    if (listError) {
      console.error("Error fetching hero images:", listError);
      setLoading(false);
      return;
    }

    const imageFiles = files.filter(
      file => file.name !== '.emptyFolderPlaceholder' && file.name !== ORDER_FILE_NAME
    );
    
    const imageUrls = imageFiles.map(file => ({
      name: file.name,
      url: supabase.storage.from(BUCKET_NAME).getPublicUrl(`${FOLDER}/${file.name}`).data.publicUrl,
    }));

    const { data: orderFileData } = await supabase.storage
      .from(BUCKET_NAME)
      .download(`${FOLDER}/${ORDER_FILE_NAME}`);

    if (!orderFileData) {
      setImages(imageUrls.map(img => img.url));
    } else {
      const orderJson = await orderFileData.text();
      try {
        const orderedNames = JSON.parse(orderJson) as string[];
        const imageMap = new Map(imageUrls.map(img => [img.name, img.url]));
        const sortedUrls = orderedNames.map(name => imageMap.get(name)).filter((url): url is string => !!url);
        const newImageUrls = imageUrls.filter(img => !orderedNames.includes(img.name)).map(img => img.url);
        setImages([...sortedUrls, ...newImageUrls]);
      } catch (e) {
        console.error("Error parsing order file, using default order", e);
        setImages(imageUrls.map(img => img.url));
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    if (images.length > 1) {
      const timer = setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
      }, 5000); // Change image every 5 seconds
      return () => clearTimeout(timer);
    }
  }, [currentIndex, images.length]);

  const defaultImage = "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto-format&fit=crop&q=80";

  const animationClasses = (delay: string) =>
    cn(
      "transition-all duration-1000 ease-out",
      isMounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10",
      delay
    );

  return (
    <div className="relative h-[80vh] md:h-[65vh] sm:h-[55vh] w-full overflow-hidden">
      {/* Background Images */}
      {loading ? (
        <div className="absolute inset-0 bg-gray-100" />
      ) : images.length > 0 ? (
        images.map((src, index) => (
          <div
            key={index}
            className="absolute inset-0 w-full h-full bg-cover bg-center transition-opacity duration-1000 ease-in-out"
            style={{
              backgroundImage: `url(${src})`,
              opacity: index === currentIndex ? 1 : 0,
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/60" />
          </div>
        ))
      ) : (
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${defaultImage})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/60" />
        </div>
      )}

      {/* Content */}
      <div className="relative z-10 flex h-full items-center justify-center px-4">
        <div className="max-w-5xl">
          {/* Decorative Line */}
          <div className={cn("mb-8 flex items-center justify-center gap-4", animationClasses("delay-300"))}>
            <div className="h-px w-12 bg-white/60" />
            <div className="h-1.5 w-1.5 rotate-45 bg-white/60" />
            <div className="h-px w-12 bg-white/60" />
          </div>

          {/* Main Heading */}
          <h1 className="text-white text-center">
            <span className={cn(
              "block text-5xl font-light tracking-wide md:text-7xl lg:text-8xl",
              animationClasses("delay-500"),
              currentIndex !== 0 && "opacity-0 translate-y-4" // Esconde e desloca se não for o primeiro slide
            )}>
              Seu Flat Hotel
            </span>
            <span className={cn(
              "mt-2 block text-3xl font-extralight tracking-widest text-white/90 md:text-4xl lg:text-5xl text-right",
              animationClasses("delay-700"), // Animação de montagem inicial
              currentIndex !== 0 && "opacity-0 translate-y-4" // Esconde e desloca se não for o primeiro slide
            )}>
              à Beira Mar em Macaé
            </span>
          </h1>

          {/* Subtitle */}
          <p className={cn(
            "mt-8 text-lg font-light tracking-wide text-white/95 md:text-xl lg:text-2xl text-center", 
            animationClasses("delay-[900ms]"),
            currentIndex !== 0 && "opacity-0 translate-y-4" // Esconde e desloca se não for o primeiro slide
          )}>
            Onde Conforto, Sofisticação e Natureza se Entrelaçam
          </p>

          {/* Decorative Bottom Line */}
          <div className={cn("mt-12 flex items-center justify-center gap-4", animationClasses("delay-[1100ms]"))}>
            <div className="h-px w-16 bg-white/40" />
            <div className="h-1 w-1 rounded-full bg-white/40" />
            <div className="h-px w-16 bg-white/40" />
          </div>
        </div>
      </div>
    </div>
  );
};