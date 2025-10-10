"use client";

import { Star, MapPin, Waves, Wifi, Car, Coffee } from "lucide-react";

const features = [
  { icon: <Star className="h-6 w-6 text-blue-600" />, text: "Hotel 4 Estrelas" },
  { icon: <MapPin className="h-6 w-6 text-blue-600" />, text: "Localização Privilegiada" },
  { icon: <Waves className="h-6 w-6 text-blue-600" />, text: "Beira-Mar" },
  { icon: <Wifi className="h-6 w-6 text-blue-600" />, text: "Wi-Fi Grátis" },
  { icon: <Car className="h-6 w-6 text-blue-600" />, text: "Estacionamento Grátis" },
  { icon: <Coffee className="h-6 w-6 text-blue-600" />, text: "Café da Manhã Incluso" },
];

export function About() {
  return (
    <section id="sobre" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="Interior do VHome Flat Hotel"
              className="rounded-lg shadow-xl w-full h-auto object-cover"
            />
            <div className="absolute -top-4 -right-4 bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-semibold shadow-lg">
              Flat Hotel à beira-mar
            </div>
          </div>
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Bem-vindo ao V-Home</h2>
            <p className="text-gray-600 mb-4">
              O V-Home Flat Hotel oferece acomodações modernas e sofisticadas em Macaé, com localização privilegiada na Av. Atlântica. Nosso hotel 4 estrelas combina conforto, estilo e comodidade para proporcionar uma experiência inesquecível.
            </p>
            <p className="text-gray-600 mb-8">
              Cada apartamento conta com ar-condicionado, TV de tela plana, cozinha completa, e banheiro privativo. Desfrute de nossa piscina ao ar livre, terraço com vista, e serviço de concierge disponível 24 horas.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center gap-3">
                  {feature.icon}
                  <span className="font-medium text-gray-700">{feature.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}