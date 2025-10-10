"use client";

import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

export function Hero() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <section className="relative h-screen flex items-center justify-center text-center text-white">
      <div className="absolute inset-0 bg-black/50 z-10" />
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
        poster="https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
      >
        <source src="/hotel-video.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className="relative z-20 container mx-auto px-4">
        <div className={`transition-all duration-1000 ${isMounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
          <h1 className="text-4xl md:text-6xl font-extrabold mb-4 tracking-tight">
            Conforto e Sofisticação à Beira-Mar
          </h1>
          <p className="text-lg md:text-xl max-w-3xl mx-auto mb-8">
            Sua estadia perfeita começa aqui. Desfrute de momentos inesquecíveis com uma vista espetacular.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-blue-800 hover:bg-blue-900">Reservar Agora</Button>
            <Button size="lg" variant="outline" className="border-white text-white bg-white/10 backdrop-blur-sm hover:bg-white hover:text-blue-800">
              Ver Mais
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}