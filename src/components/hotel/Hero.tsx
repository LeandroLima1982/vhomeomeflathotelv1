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
  const [firstImageLoaded, setFirstImageLoaded] = useState(false);
  const [showTextAfterDelay, setShowTextAfterDelay] = useState(false);

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

  // Effect to load the first image and set firstImageLoaded
  useEffect(() => {
    if (images.length > 0) {
      setFirstImageLoaded(false); // Reset
      setShowTextAfterDelay(false); // Reset

      const img = new Image();
      img.src = images[0];
      img.onload = () => {
        setFirstImageLoaded(true);
      };
      img.onerror = () => {
        console.warn("Failed to load first hero image, proceeding anyway.");
        setFirstImageLoaded(true); // Proceed even if error
      };
    }
  }, [images]); // Only run when images array changes

  // Effect to trigger text display after 2 seconds once the first image is loaded
  useEffect(() => {
    if (firstImageLoaded) {
      const timer = setTimeout(() => {
        setShowTextAfterDelay(true);
      }, 2000); // 2-second delay
      return () => clearTimeout(timer);
    }
  }, [firstImageLoaded]);

  useEffect(() => {
    if (images.length > 1) {
      const duration = currentIndex === 0 ? 10000 : 5000; // 10 segundos para o primeiro slide, 5 para os demais
      const timer = setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [currentIndex, images.length]);

  const defaultImage = "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto-format&fit=crop&q=80";

  // Helper function for conditional animation classes
  const getTextAnimationClasses = (initialDelay: string) =>
    cn(
      "transition-all duration-[2500ms] ease-out", // Aumentado para 2.5 segundos
      showTextAfterDelay && currentIndex === 0 ? `opacity-100 translate-y-0 ${initialDelay}` : "opacity-0 translate-y-20",
      currentIndex !== 0 && "duration-300" // Faster disappearance for subsequent slides
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
          <div className={cn("mb-8 flex items-center justify-center gap-4", getTextAnimationClasses("delay-500"))}>
            <div className="h-px w-12 bg-white/60" />
            <div className="h-1.5 w-1.5 rotate-45 bg-white/60" />
            <div className="h-px w-12 bg-white/60" />
          </div>

          {/* Main Heading */}
          <h1 className="text-white text-center">
            <span className={cn(
              "block text-5xl font-light tracking-wide md:text-7xl lg:text-8xl",
              getTextAnimationClasses("delay-1000")
            )}>
              Seu Flat Hotel
            </span>
            <span className={cn(
              "mt-2 block text-3xl font-extralight tracking-widest text-white/90 md:text-4xl lg:text-5xl text-right",
              getTextAnimationClasses("delay-2000")
            )}>
              à Beira Mar em Macaé
            </span>
          </h1>

          {/* Subtitle */}
          <p className={cn(
            "mt-8 text-lg font-light tracking-wide text-white/95 md:text-xl lg:text-2xl text-center", 
            getTextAnimationClasses("delay-3000")
          )}>
            Onde Conforto, Sofisticação e Natureza se Entrelaçam
          </p>

          {/* Decorative Bottom Line */}
          <div className={cn("mt-12 flex items-center justify-center gap-4", getTextAnimationClasses("delay-2500"))}>
            <div className="h-px w-16 bg-white/40" />
            <div className="h-1 w-1 rounded-full bg-white/40" />
            <div className="h-px w-16 bg-white/40" />
          </div>
        </div>
      </div>
    </div>
  );
};