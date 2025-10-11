"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { Star, MapPin, Waves, Wifi, Car, Coffee } from "lucide-react";
import React from "react";
import about1 from "@/assets/images/about-1.jpg?url";
import about2 from "@/assets/images/about-2.jpg?url";
import about3 from "@/assets/images/about-3.jpg?url";

const images = [about1, about2, about3];

const features = [
    { icon: Star, text: "Hotel 4 Estrelas" },
    { icon: MapPin, text: "Localização Privilegiada" },
    { icon: Waves, text: "Beira-Mar" },
    { icon: Wifi, text: "Wi-Fi Grátis" },
    { icon: Car, text: "Estacionamento Grátis" },
    { icon: Coffee, text: "Café da Manhã Incluso" },
];

export function About() {
  const plugin = React.useRef(
    Autoplay({ delay: 4000, stopOnInteraction: true })
  );

  return (
    <section id="about" className="py-16 md:py-24 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
          <div className="relative">
            <Carousel
              plugins={[plugin.current]}
              className="w-full"
              onMouseEnter={plugin.current.stop}
              onMouseLeave={plugin.current.reset}
            >
              <CarouselContent>
                {images.map((src, index) => (
                  <CarouselItem key={index}>
                    <div className="p-1">
                      <Card className="overflow-hidden rounded-lg shadow-2xl">
                        <CardContent className="flex aspect-[4/3] items-center justify-center p-0">
                          <img
                            src={src}
                            alt={`Imagem do hotel ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </CardContent>
                      </Card>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="absolute left-4" />
              <CarouselNext className="absolute right-4" />
            </Carousel>
          </div>
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Bem-vindo ao V-Home
            </h2>
            <p className="text-gray-600 mb-4">
              O V-Home Flat Hotel oferece acomodações modernas e sofisticadas em Macaé, com localização privilegiada na Av. Atlântica. Nosso hotel 4 estrelas combina conforto, estilo e comodidade para proporcionar uma experiência inesquecível.
            </p>
            <p className="text-gray-600 mb-8">
              Cada apartamento conta com ar-condicionado, TV de tela plana, cozinha completa, e banheiro privativo. Desfrute de nossa piscina ao ar livre, terraço com vista, e serviço de concierge disponível 24 horas.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {features.map((feature, index) => (
                <div key={index} className="bg-white p-4 rounded-lg shadow-sm flex items-center gap-3 border border-gray-100">
                  <feature.icon className="h-6 w-6 text-blue-800" />
                  <span className="text-gray-700 font-medium">{feature.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}