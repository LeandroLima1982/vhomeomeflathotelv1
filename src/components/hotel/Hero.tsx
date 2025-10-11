"use client";

import { useState, useEffect } from "react";

const images = [
  { src: "/images/752555575.jpg", alt: "Quarto de hotel com duas camas e vista para o mar" },
  { src: "/images/752559546.jpg", alt: "Vista do quarto de hotel com cama, sofá e cozinha compacta" },
  { src: "/images/752559642.jpg", alt: "Cozinha compacta moderna no quarto de hotel" },
];

export const Hero = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative h-screen w-full overflow-hidden">
      {images.map((image, index) => (
        <div
          key={index}
          className={`absolute inset-0 h-full w-full bg-cover bg-center transition-opacity duration-1000 ${
            index === currentIndex ? "opacity-100" : "opacity-0"
          }`}
          style={{ backgroundImage: `url(${image.src})` }}
          role="img"
          aria-label={image.alt}
        />
      ))}
      <div className="absolute inset-0 bg-black bg-opacity-50" />

      <div className="relative z-10 flex h-full items-center justify-center p-4 text-center text-white">
        <div className={`transition-all duration-1000 ${isMounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
          <h1 className="text-4xl font-bold md:text-6xl">Bem-vindo ao Nosso Hotel</h1>
          <p className="mt-4 text-lg md:text-xl">Experimente o luxo e o conforto.</p>
        </div>
      </div>
    </div>
  );
};