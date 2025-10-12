"use client";

import React, { useEffect, useState } from "react";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { supabase } from "@/lib/supabaseClient";
import { Skeleton } from "@/components/ui/skeleton";
import { showError } from "@/utils/toast";

export default function Hero() {
  const [isMounted, setIsMounted] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const plugin = React. useRef(
    Autoplay({ delay: 5000, stopOnInteraction: false })
  );

  useEffect(() => {
    setIsMounted(true);

    const fetchImages = async () => {
      setLoading(true);
      console.log("Buscando imagens do banner (banner)...");
      const { data, error } = await supabase.storage.from('gallery').list('banner', {
        limit: 5,
        offset: 0,
        sortBy: { column: 'created_at', order: 'desc' },
      });

      if (error) {
        console.error("Erro ao buscar a lista de imagens do Supabase:", error);
        showError("Não foi possível carregar as imagens do banner.");
        setLoading(false);
        return;
      }

      console.log("Arquivos encontrados no Supabase:", data);

      if (data) {
        const imageUrls = data
          .filter(file => file.name !== '.emptyFolderPlaceholder')
          .map(file => {
            const { data: { publicUrl } } = supabase.storage.from('gallery').getPublicUrl(`banner/${file.name}`);
            return `${publicUrl}?t=${new Date().getTime()}`;
          });
        
        console.log("URLs das imagens construídas:", imageUrls);
        setImages(imageUrls);
      }
      setLoading(false);
    };

    fetchImages();
  }, []);

  return (
    <section className="relative h-[600px] w-full overflow-hidden">
      {loading ? (
        <Skeleton className="h-full w-full" />
      ) : (
        <Carousel
          plugins={[plugin.current]}
          className="h-full w-full"
        >
          <CarouselContent className="h-full">
            {images.length > 0 ? (
              images.map((src, index) => (
                <CarouselItem key={index} className="h-full">
                  <div
                    className="h-full w-full bg-cover bg-center"
                    style={{ backgroundImage: `url(${src})` }}
                  />
                </CarouselItem>
              ))
            ) : (
              <CarouselItem className="h-full">
                <div className="h-full w-full bg-gray-300 flex items-center justify-center">
                  <span className="text-gray-500">Nenhuma imagem no banner. Adicione imagens na área de admin.</span>
                </div>
              </CarouselItem>
            )}
          </CarouselContent>
        </Carousel>
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white p-4">
        <div className={`transition-all duration-1000 ${isMounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
          <h1 className="text-4xl font-bold md:text-6xl drop-shadow-lg">Seu Flat Hotel à Beira Mar</h1>
          <p className="mt-4 text-lg md:text-xl drop-shadow-md">Experimente o luxo e o conforto.</p>
        </div>
      </div>
    </section>
  );
}