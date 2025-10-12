"use client";

import { useEffect, useState, useRef } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { Skeleton } from "@/components/ui/skeleton";

export default function Hero() {
  const [isMounted, setIsMounted] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const plugin = useRef(
    Autoplay({ delay: 5000, stopOnInteraction: false })
  );

  useEffect(() => {
    setIsMounted(true);

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
          .map(file => {
            const publicUrlData = supabase.storage.from('gallery').getPublicUrl(`hero/${file.name}`);
            // Adiciona um timestamp para evitar problemas de cache do navegador
            return `${publicUrlData.data.publicUrl}?t=${new Date().getTime()}`;
          });
        setImages(imageUrls);
      }
      setLoading(false);
    };

    fetchImages();
  }, []);

  const renderContent = () => {
    if (loading) {
      return <Skeleton className="h-full w-full" />;
    }

    if (images.length > 0) {
      return (
        <Carousel
          plugins={[plugin.current]}
          className="w-full h-full"
          onMouseEnter={plugin.current.stop}
          onMouseLeave={plugin.current.reset}
        >
          <CarouselContent>
            {images.map((src, index) => (
              <CarouselItem key={index}>
                <div
                  className="h-full w-full bg-cover bg-center"
                  style={{ backgroundImage: `url(${src})` }}
                  role="img"
                  aria-label={`Hero image ${index + 1}`}
                />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      );
    }

    // Fallback se nenhuma imagem for encontrada
    return (
      <img
        alt="Hotel"
        className="h-full w-full object-cover"
        src="/placeholder.svg"
      />
    );
  };

  return (
    <section className="relative h-[60vh] w-full overflow-hidden">
      <div className="absolute inset-0 bg-black/50 z-10" />
      {renderContent()}
      <div className="absolute inset-0 flex items-center justify-center text-center text-white z-20">
        <div className={`transition-all duration-1000 ${isMounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
          <h1 className="text-4xl font-bold md:text-6xl drop-shadow-lg">Seu Flat Hotel à Beira Mar</h1>
          <p className="mt-4 text-lg md:text-xl drop-shadow-md">Experimente o luxo e o conforto.</p>
        </div>
      </div>
    </section>
  );
}