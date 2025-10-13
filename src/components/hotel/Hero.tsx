"use client";

import React, { useEffect, useState } from 'react';

const Hero = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80')",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/60" />
      </div>

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
          <h1 className="text-white">
            <span className="block text-5xl font-light tracking-wide md:text-7xl lg:text-8xl">
              Seu Flat Hotel
            </span>
            <span className="mt-2 block text-3xl font-extralight tracking-widest text-white/90 md:text-4xl lg:text-5xl">
              à Beira Mar
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mt-8 text-lg font-light tracking-wide text-white/95 md:text-xl lg:text-2xl">
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

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 animate-bounce">
        <div className="flex flex-col items-center gap-2 text-white/80">
          <span className="text-xs font-light tracking-widest">SCROLL</span>
          <div className="h-8 w-px bg-white/60" />
        </div>
      </div>
    </div>
  );
};

export default Hero;