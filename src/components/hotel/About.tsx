"use client";

import { useState, useEffect } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Star, MapPin, Waves, Wifi, Car, Coffee } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

const features = [
  { icon: Star, text: "Flat Hotel 4 Estrelas" },
  { icon: MapPin, text: "Localização Privilegiada" },
  { icon: Waves, text: "Beira-Mar" },
  { icon: Wifi, text: "Wi-Fi Gratuito" },
  { icon: Car, text: "Estacionamento Grátis" },
  { icon: Coffee, text: "Café da Manhã Incluso" },
];

export default function About({ className }: { className?: string }) {
  const [images, setImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchImages = async () => {
      if (!supabase) {
        console.error('Supabase client is not available');
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      const { data: files, error } = await supabase.storage
        .from("gallery")
        .list("about", {
          limit: 10,
          offset: 0,
          sortBy: { column: "created_at", order: "desc" },
        });

      if (error) {
        console.error("Error fetching images:", error);
        setIsLoading(false);
        return;
      }

      if (files) {
        const imageFiles = files.filter(file => file.name !== '.emptyFolderPlaceholder' && file.name !== '_order.json');
        const imageUrls = imageFiles.map(file => ({
          name: file.name,
          url: supabase.storage.from("gallery").getPublicUrl(`about/${file.name}`).data.publicUrl,
        }));

        const { data: orderFileData } = await supabase.storage
          .from("gallery")
          .download("about/_order.json");

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
      }
      setIsLoading(false);
    };

    fetchImages();
  }, []);

  return (
    <section id="about" className={`pt-16 md:pt-24 py-16 md:py-24 bg-white ${className || ''}`}>
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl md:text-3xl text-blue-900 mb-2">
                Bem-vindo ao V-Home
              </h2>
              <p className="text-xl text-gray-700 mb-6">
                Seu Flat Hotel à Beira Mar em Macaé
              </p>
              <p className="text-gray-600 leading-relaxed">
                O V-Home Flat Hotel oferece acomodações modernas e sofisticadas
                em Macaé, com localização privilegiada na Av. Atlântica. Nosso
                hotel 4 estrelas combina conforto, estilo e comodidade para
                proporcionar uma experiência inesquecível.
              </p>
              <p className="text-gray-600 leading-relaxed mt-4">
                Cada flat conta com ar-condicionado, tv smart,
                cozinha completa. Desfrute de nossa
                piscina SPA aquecida ao ar livre, terraço com vista pro mar, e serviço de concierge
                disponível 24 horas.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <feature.icon className="w-6 h-6 text-blue-600" />
                  <span className="text-gray-700">{feature.text}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            {isLoading ? (
              <div className="w-full max-w-md mx-auto">
                <Skeleton className="aspect-square w-full rounded-lg" />
              </div>
            ) : (
              <Carousel className="w-full max-w-md mx-auto relative">
                <CarouselContent>
                  {images.map((src, index) => (
                    <CarouselItem key={index}>
                      <div className="p-1">
                        <Card>
                          <CardContent className="relative flex aspect-square items-center justify-center p-0 overflow-hidden rounded-lg">
                            <img
                              src={src}
                              alt={`V-Home Sobre ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute bottom-4 right-4 bg-amber-500 text-gray-900 p-3 rounded-lg shadow-lg flex flex-col items-center">
                              <div className="flex gap-0.5 mb-1">
                                <Star className="w-4 h-4 fill-current" />
                                <Star className="w-4 h-4 fill-current" />
                                <Star className="w-4 h-4 fill-current" />
                                <Star className="w-4 h-4 fill-current" />
                              </div>
                              <p className="text-xs font-semibold">Flat Hotel à Beira Mar</p>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 z-10" />
                <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 z-10" />
              </Carousel>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}