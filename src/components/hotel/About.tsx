"use client";

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import Autoplay from 'embla-carousel-autoplay';
import { ChefHat, ChevronUp, ChevronDown } from 'lucide-react';

const BUCKET_NAME = 'gallery';
const FOLDER = 'about';
const ORDER_FILE_NAME = '_order.json';

export function About() {
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const plugin = React.useRef(
    Autoplay({ delay: 4000, stopOnInteraction: true })
  );

  useEffect(() => {
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
      console.error("Error fetching about images:", listError);
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

  return (
    <section id="about" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Sobre o V-Home
              </h2>
            </div>
            
            <div className="space-y-4">
              <p className="text-lg text-gray-700 leading-relaxed">
                Localizado na deslumbrante <span className="font-semibold text-gray-900">Av. Atlântica em Macaé</span>, o V-Home Flat Hotel oferece uma experiência única de hospedagem à beira-mar. 
                Nosso hotel 4 estrelas combina conforto moderno com a beleza natural da costa brasileira.
              </p>
              
              <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded-r-lg">
                <div className="flex items-start gap-3">
                  <ChefHat className="text-blue-600 mt-1 flex-shrink-0" size={24} />
                  <div>
                    <p className="text-lg font-semibold text-gray-900 mb-1">
                      Cozinha Completa em Todos os Apartamentos
                    </p>
                    <p className="text-gray-700">
                      Prepare suas próprias refeições com total comodidade e liberdade, como se estivesse em casa.
                    </p>
                  </div>
                </div>
              </div>
              
              <p className="text-lg text-gray-700 leading-relaxed">
                Com apartamentos totalmente equipados, comodidades de primeira classe e uma equipe dedicada, 
                garantimos que sua estadia seja memorável, seja a negócios ou lazer.
              </p>
              
              <div className="pt-4">
                <p className="text-lg text-gray-700 leading-relaxed">
                  Desfrute de nossas instalações premium:
                </p>
                <ul className="mt-3 space-y-2 text-gray-700">
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2">•</span>
                    <span>Piscina aquecida</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2">•</span>
                    <span>Wi-Fi gratuito de alta velocidade</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2">•</span>
                    <span>Estacionamento seguro</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2">•</span>
                    <span>E muito mais</span>
                  </li>
                </ul>
              </div>
              
              <p className="text-lg text-gray-800 font-medium pt-2">
                Estamos aqui para tornar sua visita a Macaé inesquecível.
              </p>
            </div>
          </div>
          
          <div className="relative">
            {loading ? (
              <div className="w-full h-[600px] bg-gray-200 rounded-lg flex items-center justify-center">
                <p className="text-gray-500">Carregando imagens...</p>
              </div>
            ) : images.length > 0 ? (
              <Carousel
                opts={{
                  align: "start",
                  loop: true,
                }}
                orientation="vertical"
                plugins={[plugin.current]}
                className="w-full"
                onMouseEnter={plugin.current.stop}
                onMouseLeave={plugin.current.reset}
              >
                <CarouselContent className="-mt-4 h-[600px]">
                  {images.map((src, index) => (
                    <CarouselItem key={index} className="pt-4 basis-full">
                      <div className="relative h-full rounded-lg overflow-hidden shadow-xl">
                        <img
                          src={src}
                          alt={`Sobre o hotel ${index + 1}`}
                          className="w-full h-full object-contain"
                        />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="absolute top-4 left-1/2 -translate-x-1/2 -translate-y-1/2">
                  <ChevronUp className="h-4 w-4" />
                  <span className="sr-only">Previous slide</span>
                </CarouselPrevious>
                <CarouselNext className="absolute bottom-4 left-1/2 -translate-x-1/2 translate-y-1/2">
                  <ChevronDown className="h-4 w-4" />
                  <span className="sr-only">Next slide</span>
                </CarouselNext>
              </Carousel>
            ) : (
              <div className="relative h-[600px] rounded-lg overflow-hidden shadow-xl">
                <img
                  src="https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80"
                  alt="Hotel exterior"
                  className="w-full h-full object-contain"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}