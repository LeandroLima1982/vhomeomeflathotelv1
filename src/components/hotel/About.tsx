"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { Check } from "lucide-react";
import React from "react";

const images = [
  "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=2070&auto=format&fit=crop&ixlib-rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1568495248636-6432b97bd949?q=80&w=1974&auto=format&fit=crop&ixlib-rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1582719508461-905c673771fd?q=80&w=1925&auto=format&fit=crop&ixlib-rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
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
              Sobre o Nosso Hotel
            </h2>
            <p className="text-gray-600 mb-6">
              Localizado no coração da cidade, nosso hotel oferece uma combinação perfeita de luxo, conforto e conveniência. Com instalações modernas e um serviço impecável, garantimos uma experiência memorável para todos os nossos hóspedes.
            </p>
            <ul className="space-y-3 mb-8">
              <li className="flex items-center gap-3">
                <Check className="h-5 w-5 text-blue-800" />
                <span>Quartos espaçosos e elegantemente decorados</span>
              </li>
              <li className="flex items-center gap-3">
                <Check className="h-5 w-5 text-blue-800" />
                <span>Piscina com vista panorâmica e bar</span>
              </li>
              <li className="flex items-center gap-3">
                <Check className="h-5 w-5 text-blue-800" />
                <span>Restaurante com gastronomia local e internacional</span>
              </li>
              <li className="flex items-center gap-3">
                <Check className="h-5 w-5 text-blue-800" />
                <span>Wi-Fi de alta velocidade gratuito em todas as áreas</span>
              </li>
            </ul>
            <Button size="lg" className="bg-blue-800 hover:bg-blue-900">
              Explore Nossos Quartos
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}