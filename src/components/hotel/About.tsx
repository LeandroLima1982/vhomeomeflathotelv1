"use client";

import React from 'react';
import Image from 'next/image';

export const About = () => {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <div>
            <h2 className="text-4xl lg:text-5xl font-semibold tracking-tight text-gray-800 mb-6">
              Bem-vindo ao V-Home
            </h2>
            <p className="text-lg md:text-xl text-gray-700 leading-relaxed mb-6">
              Descubra um refúgio de tranquilidade e luxo à beira-mar. No V-Home, cada detalhe é pensado para proporcionar uma experiência inesquecível, combinando o conforto de um lar com a sofisticação de um hotel boutique.
            </p>
            <p className="text-lg md:text-xl text-gray-700 leading-relaxed mb-6">
              Nossas instalações modernas e serviços personalizados garantem que sua estadia seja perfeita, seja para relaxar em nossas piscinas, desfrutar da culinária local ou explorar as belezas naturais da região.
            </p>
            <p className="text-lg md:text-xl text-gray-700 leading-relaxed">
              Permita-se viver momentos únicos, onde o bem-estar e a exclusividade se encontram.
            </p>
          </div>

          {/* Image Gallery */}
          <div className="grid grid-cols-2 gap-4">
            <div className="relative h-64 w-full overflow-hidden rounded-lg shadow-lg">
              <Image
                src="https://images.unsplash.com/photo-1571896349882-3365919d6647?auto=format&fit=crop&q=80&w=1900&h=1900"
                alt="Hotel Lobby"
                layout="fill"
                objectFit="cover"
                className="transition-transform duration-500 hover:scale-105"
              />
            </div>
            <div className="relative h-64 w-full overflow-hidden rounded-lg shadow-lg">
              <Image
                src="https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=1900&h=1900"
                alt="Hotel Room"
                layout="fill"
                objectFit="cover"
                className="transition-transform duration-500 hover:scale-105"
              />
            </div>
            <div className="relative h-64 w-full overflow-hidden rounded-lg shadow-lg col-span-2">
              <Image
                src="https://images.unsplash.com/photo-1542314831-068cd1dbf26e?auto=format&fit=crop&q=80&w=1900&h=1900"
                alt="Hotel Pool"
                layout="fill"
                objectFit="cover"
                className="transition-transform duration-500 hover:scale-105"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};