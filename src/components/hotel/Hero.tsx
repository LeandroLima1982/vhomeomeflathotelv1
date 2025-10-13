"use client";

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import Autoplay from 'embla-carousel-autoplay';

const BUCKET_NAME = 'gallery';
const FOLDER = 'hero';
const ORDER_FILE_NAME = '_order.json';

export const Hero = () => {
  const [isMounted, setIsMounted] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const plugin = React.useRef(
    Autoplay({ delay: 5000, stopOnInteraction: false })
  );

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

  const defaultImage = "url('https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto-format&fit=crop&q=80')";

  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* Background Carousel or Default Image */}
      {loading ? (
        <div className="absolute inset-0 bg-gray-900" />
      ) : images.length > 0 ? (
        <Carousel
          plugins={[plugin.current]}
          className="absolute inset-0 w-full h-full"
        >
          <CarouselContent>
            {images.map((src, index) => (
              <CarouselItem key={index} className="p-0">
                <div
                  className="relative w-full h-screen bg-cover bg-center bg-no-repeat"
                  style={{ backgroundImage: `url(${src})` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/60" />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      ) : (
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: defaultImage }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/60" />
        </div>
      )}

      {/* Content */}
      <div className="relative z-10 flex h-full items-center justify-center px-4">
        <div className={`max-w-5xl transition-all duration-1000 ${isMounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
          {/* Decorative Line */}
          <div className="mb-8 flex items-center justify-center gap-4">
            <div className="h-px w-12 bg-white/60" />
            <div className="h-1.5 w-1.5 rotate-45 bg-white/60" />
            <div className="h-px w-12 bg-white/60" />
          </div>

          {/* Main Heading */}
          <h1 className="text-white text-center">
            <span className="block text-5xl font-light tracking-wide md:text-7xl lg:text-8xl">
              Seu Flat Hotel
            </span>
            <span className="mt-2 block text-3xl font-extralight tracking-widest text-white/90 md:text-4xl lg:text-5xl text-right">
              à Beira Mar
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mt-8 text-lg font-light tracking-wide text-white/95 md:text-xl lg:text-2xl text-center">
            Onde Conforto, Sofisticação e Natureza se Entrelaçam
          </p>

          {/* Decorative Bottom Line */}
          <div className="mt-12 flex items-center justify-center gap-4">
            <div className="h-px w-16 bg-white/40" />
            <div className="h-1 w-1 rounded-full bg-white/40" />
            <div className="h-px w-16 bg-white/40" />
          </div>
        </div>
      </div>
    </div>
  );
};