"use client";

import hero3 from "../../assets/images/hero-3.jpg";

export const Hero = () => {
  return (
    <div className="relative h-screen w-full overflow-hidden">
      <img
        src={hero3}
        alt="Quarto de hotel com cama de casal e vista"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-black bg-opacity-50" />

      <div className="relative z-10 flex h-full items-center justify-center p-4 text-center text-white">
        <div>
          <h1 className="text-4xl font-bold md:text-6xl">Bem-vindo ao Nosso Hotel</h1>
          <p className="mt-4 text-lg md:text-xl">Experimente o luxo e o conforto.</p>
        </div>
      </div>
    </div>
  );
};