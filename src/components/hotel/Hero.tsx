"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

const images = [
  "https://images.unsplash.com/photo-1618773928121-c32242e63f39?q=80&w=2070&auto=format&fit=crop&ixlib-rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070&auto=format&fit=crop&ixlib-rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1582719508461-905c673771fd?q=80&w=1925&auto=format&fit=crop&ixlib-rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
];

export function Hero() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <section className="relative h-screen w-full overflow-hidden">
      <Carousel
        className="absolute inset-0 h-full w-full"
        plugins={[Autoplay({ delay: 5000, stopOnInteraction: false })]}
        opts={{ loop: true }}
      >
        <CarouselContent>
          {images.map((src, index) => (
            <CarouselItem key={index}>
              <div
                className="h-screen w-full bg-cover bg-center"
                style={{ backgroundImage: `url(${src})` }}
              />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
      <div className="absolute inset-0 bg-black/50" />
      <div className="relative z-10 flex h-full flex-col items-center justify-center text-center text-white px-4 pb-24">
        <div className={`transition-all duration-1000 ${isMounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
          <h1 className="text-4xl font-extrabold tracking-tight md:text-6xl lg:text-7xl">
            Seu Flat Hotel à Beira Mar
          </h1>
          <p className="mt-4 max-w-2xl text-lg md:text-xl">
            Onde Conforto, Sofisticação e Natureza se Entrelaçam
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Button size="lg" className="bg-blue-800 hover:bg-blue-900">Reservar Agora</Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-gray-800">
              Ver Galeria
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}