"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
// import Image from 'next/image'; // Removido: next/image não é usado em projetos React puros

const About = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          <div className="lg:w-1/2">
            <img
              src="/placeholder.svg"
              alt="V-Home Hotel"
              width={600}
              height={400}
              className="rounded-lg shadow-lg object-cover w-full h-auto"
            />
          </div>
          <div className="lg:w-1/2 text-center lg:text-left">
            <div>
              <h2 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-blue-700 to-blue-900 bg-clip-text text-transparent tracking-tight drop-shadow-sm mb-2">
                Bem-vindo ao V-Home
              </h2>
              <p className="text-xl text-gray-700 mb-6">
                Descubra o conforto e a elegância no coração da cidade. No V-Home, cada detalhe é pensado para proporcionar uma experiência inesquecível, combinando luxo, conveniência e um serviço impecável.
              </p>
              <p className="text-lg text-gray-600 mb-8">
                Nossas instalações modernas e aconchegantes são o refúgio perfeito para viajantes a negócios ou a lazer. Desfrute de quartos espaçosos, gastronomia requintada e uma equipe dedicada a atender todas as suas necessidades.
              </p>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full text-lg font-semibold transition-all duration-300 ease-in-out group">
                Saiba Mais
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;