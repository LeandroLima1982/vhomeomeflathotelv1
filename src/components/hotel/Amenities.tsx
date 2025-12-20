"use client";

import { Wifi, Car, UtensilsCrossed, Tv, Wind, Clock, ConciergeBell, Waves, KeyRound, Coffee, BedDouble, Briefcase, Sun, Sofa, Gem, Sparkles } from "lucide-react";

const amenities = [
  { icon: <Waves className="h-8 w-8 text-blue-700" />, name: "Piscina Spa Aquecida ao Ar Livre", description: "Piscina com vista panorâmica do mar" },
  { icon: <Car className="h-8 w-8 text-blue-700" />, name: "Estacionamento Seguro", description: "Estacionamento privativo e monitorado. Consulte disponibilidade." },
  { icon: <Wifi className="h-8 w-8 text-blue-700" />, name: "Wi-Fi Gratuito", description: "Trabalhe de forma eficiente com Internet de alta velocidade" },
  { icon: <Coffee className="h-8 w-8 text-blue-700" />, name: "Café da Manhã", description: "Buffet Self-service e opções americanas" },
  { icon: <UtensilsCrossed className="h-8 w-8 text-blue-700" />, name: "Cozinha Equipada", description: "Geladeira Duplex, micro-ondas, forno e cooktop para suas necessidades culinárias" },
  { icon: <Wind className="h-8 w-8 text-blue-700" />, name: "Ar-Condicionado", description: "Climatização individual" },
  { icon: <Tv className="h-8 w-8 text-blue-700" />, name: "Tv  com Sky", description: "Canais com Sky em todos quartos" },
  { icon: <KeyRound className="h-8 w-8 text-blue-700" />, name: "Cofre nos Apartamentos", description: "Segurança para seus pertences" },
  { icon: <Clock className="h-8 w-8 text-blue-700" />, name: "Recepção 24h", description: "Atendimento a qualquer hora" },
  { icon: <ConciergeBell className="h-8 w-8 text-blue-700" />, name: "Serviço de Concierge", description: "Assistência personalizada" },
  { icon: <BedDouble className="h-8 w-8 text-blue-700" />, name: "Enxoval Completo", description: "Cama, mesa e banho e edredons em todos os quartos. Conforto em cada detalhe" },
  { icon: <Sparkles className="h-8 w-8 text-blue-700" />, name: "Serviço de Camareira", description: "Você não precisa se preocupar com tarefas domésticas" },
  { icon: <Briefcase className="h-8 w-8 text-blue-700" />, name: "Home Office", description: "Espaço dedicado e conectividade para suas necessidades de trabalho." },
  { icon: <Sun className="h-8 w-8 text-blue-700" />, name: "Final de Semana", description: "Aproveite momentos de lazer e relaxamento em um ambiente perfeito." },
  { icon: <Sofa className="h-8 w-8 text-blue-700" />, name: "Móveis Planejados", description: "Ambientes com design inteligente e funcionalidade otimizada." },
  { icon: <Gem className="h-8 w-8 text-blue-700" />, name: "Decoração Elegante", description: "Detalhes que encantam e criam uma atmosfera sofisticada." },
];

export function Amenities() {
  return (
    <section id="comodidades" className="pt-24 py-20 bg-gray-50">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-2xl font-bold text-gray-800">Comodidades</h2>
        <p className="text-gray-600 mt-2 mb-12">Tudo para o seu conforto</p>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {amenities.map((amenity, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow text-center">
              <div className="flex justify-center mb-4">{amenity.icon}</div>
              <h3 className="font-semibold text-lg text-gray-800">{amenity.name}</h3>
              <p className="text-sm text-gray-500 mt-1">{amenity.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}