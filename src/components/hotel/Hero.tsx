"use client";

import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-react";

const heroImages = [
  "/hero-bg.jpg",
  "/hero-bg-2.jpg",
  "/hero-bg-3.jpg",
];

export function Hero() {
  const [isMounted, setIsMounted] = useState(false);
  const plugin = useRef(
    Autoplay({ delay: 5000, stopOnInteraction: false, stopOnMouseEnter: true })
  );

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <section className="relative h-[80vh] min-h-[500px] flex items-center justify-center text-center text-white overflow-hidden">
      <Carousel
        plugins={[plugin.current]}
        className="absolute inset-0 w-full h-full"
        opts={{ loop: true }}
        onMouseEnter={plugin.current.stop}
        onMouseLeave={plugin.current.reset}
      >
        <CarouselContent className="-ml-0">
          {heroImages.map((src, index) => (
            <CarouselItem key={index} className="pl-0">
              <div
                className="h-[80vh] min-h-[500px] w-full bg-cover bg-center transition-transform duration-500 ease-in-out"
                style={{ backgroundImage: `url(${src})` }}
              />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      <div className="absolute inset-0 bg-black bg-opacity-50" />

      <div className="relative z-10 p-4">
        <div className={`transition-all duration-1000 ${isMounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
          <h1 className="text-4xl md:text-6xl font-extrabold mb-4 tracking-tight">
            Seu Flat Hotel à Beira Mar
          </h1>
          <p className="text-lg md:text-xl max-w-3xl mx-auto mb-8">
            Onde Conforto, Sofisticação e Natureza se Entrelaçam
          </p>
          <Button size="lg" className="text-lg px-8 py-6">
            Reserve Agora <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </section>
  );
}