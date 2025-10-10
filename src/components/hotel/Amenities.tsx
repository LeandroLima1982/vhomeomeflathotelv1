"use client";

import { Wifi, Car, UtensilsCrossed, Tv, Wind, Clock, ConciergeBell, Waves, KeyRound, Coffee, BedDouble, Sparkles } from "lucide-react";

const amenities = [
  { icon: <Waves className="h-8 w-8 text-blue-700" />, name: "Piscina Spa Aquecida", description: "Vista panorâmica do mar" },
  { icon: <Car className="h-8 w-8 text-blue-700" />, name: "Estacionamento Seguro", description: "Privativo e monitorado" },
  { icon: <Wifi className="h-8 w-8 text-blue-700" />, name: "Wi-Fi Gratuito", description: "Internet de alta velocidade" },
  { icon: <Coffee className="h-8 w-8 text-blue-700" />, name: "Café da Manhã", description: "Buffet e opções americanas" },
  { icon: <UtensilsCrossed className="h-8 w-8 text-blue-700" />, name: "Cozinha Equipada", description: "Completa para suas necessidades" },
  { icon: <Wind className="h-8 w-8 text-blue-700" />, name: "Ar-Condicionado", description: "Climatização individual" },
  { icon: <Tv className="h-8 w-8 text-blue-700" />, name: "TV a Cabo", description: "Canais via satélite" },
  { icon: <KeyRound className="h-8 w-8 text-blue-700" />, name: "Cofre nos Apartamentos", description: "Segurança para seus pertences" },
  { icon: <Clock className="h-8 w-8 text-blue-700" />, name: "Recepção 24h", description: "Atendimento a qualquer hora" },
  { icon: <ConciergeBell className="h-8 w-8 text-blue-700" />, name: "Serviço de Concierge", description: "Assistência personalizada" },
  { icon: <BedDouble className="h-8 w-8 text-blue-700" />, name: "Enxoval Completo", description: "Cama, mesa e banho" },
  { icon: <Sparkles className="h-8 w-8 text-blue-700" />, name: "Serviço de Camareira", description: "Limpeza e organização diária" },
];

export function Amenities() {
  return (
    <section id="comodidades" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold text-gray-800">Comodidades</h2>
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