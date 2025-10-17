"use client";

import React from 'react';
import Image from 'next/image';

const About = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="md:w-1/2">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-blue-500 to-blue-700 text-transparent bg-clip-text drop-shadow-lg">
                Bem-vindo ao V-Home
              </h2>
              <p className="text-xl text-gray-700 mb-6">
                No V-Home, acreditamos que cada viagem deve ser uma experiência memorável e sem preocupações. Oferecemos uma seleção exclusiva de propriedades de aluguel por temporada, cuidadosamente escolhidas para garantir conforto, estilo e todas as comodidades que você precisa para se sentir em casa, longe de casa.
              </p>
              <p className="text-lg text-gray-600 mb-6">
                Seja para uma escapadela romântica, férias em família ou uma viagem de negócios, nossas casas e apartamentos são projetados para atender às suas expectativas mais elevadas. Com localizações privilegiadas e um serviço de atendimento ao cliente dedicado, estamos aqui para tornar sua estadia perfeita.
              </p>
              <p className="text-lg text-gray-600">
                Descubra o prazer de viajar com o V-Home – onde o conforto encontra a conveniência.
              </p>
            </div>
          </div>
          <div className="md:w-1/2">
            <Image
              src="/images/about-us.jpg" // Substitua pelo caminho da sua imagem
              alt="Sobre V-Home"
              width={600}
              height={400}
              className="rounded-lg shadow-lg"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;