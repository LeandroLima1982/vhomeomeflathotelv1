"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Waves, Utensils, Trees, Mountain, Plane, Landmark } from "lucide-react";

const nearbyData = [
  {
    category: "Praias",
    icon: Waves,
    places: [
      { name: "Praia Campista", distance: "0 m" },
      { name: "Praia dos Cavaleiros", distance: "1,6 km" },
      { name: "Praia de Imbetiba", distance: "2,4 km" },
      { name: "Praia da Pecado", distance: "3 km" },
      { name: "Mar do Norte", distance: "6,1 km" },
    ],
  },
  {
    category: "Restaurantes",
    icon: Utensils,
    places: [
      { name: "Ilhote Sul", distance: "10 m" },
      { name: "Durval", distance: "250 m" },
      { name: "Go Go Wok culinária japonesa", distance: "2,3 km" },
    ],
  },
  {
    category: "Parques",
    icon: Trees,
    places: [
      { name: "Parque da Cidade", distance: "1,4 km" },
      { name: "Parque Municipal", distance: "15 km" },
      { name: "Restinga de Jurubatiba", distance: "16 km" },
    ],
  },
  {
    category: "Belezas Naturais",
    icon: Mountain,
    places: [
      { name: "Lagoa de Imboássica", distance: "5 km" },
      { name: "Cachoeira das Sete Quedas (Sana)", distance: "45 km" },
      { name: "Cachoeira de Glicério", distance: "45 km" },
      { name: "Pico do Frade", distance: "56 km" },
      { name: "Cachoeira do Escorrega Bicuda Pequena", distance: "70 km" },
    ],
  },
  {
    category: "Aeroportos",
    icon: Plane,
    places: [
      { name: "Aeroporto de Macaé", distance: "6 km" },
      { name: "Aeroporto de Cabo Frio", distance: "77 km" },
      { name: "Aeroporto de Arraial do Cabo", distance: "84 km" },
      { name: "Aeroporto de Campos dos Goytacazes", distance: "106 km" },
      { name: "Heliporto Farol de São Thomé", distance: "133 km" },
    ],
  },
  {
    category: "Pontos de Interesse",
    icon: Landmark,
    places: [
        { name: "Forte Marechal Hermes", distance: "4 km" },
        { name: "Shopping Plaza", distance: "4,5 km" },
        { name: "Localizza", distance: "3,5 km" },
        { name: "Movida", distance: "4,5 km" },
        { name: "Hospital Unimed", distance: "3,5 km" },
        { name: "Hospital Rede D'or", distance: "4,7 km" },
        { name: "Parque Natural Fazenda Atalaia", distance: "27 km" },
    ]
  }
];

export function Nearby() {
  return (
    <section id="perto" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-800">O que há por perto?</h2>
          <p className="text-gray-600 mt-2 mb-12">Explore as atrações e comodidades próximas ao hotel</p>
        </div>
        <div className="flex overflow-x-auto space-x-8 pb-4 -mx-4 px-4">
          {nearbyData.map((categoryItem) => (
            <Card key={categoryItem.category} className="text-left shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col flex-shrink-0 w-96">
              <CardHeader className="flex flex-row items-center gap-4 pb-4">
                <div className="bg-blue-100 p-3 rounded-full">
                  <categoryItem.icon className="h-6 w-6 text-blue-800" />
                </div>
                <CardTitle className="text-xl font-semibold text-gray-800">{categoryItem.category}</CardTitle>
              </CardHeader>
              <CardContent className="flex-grow">
                <ul className="space-y-3">
                  {categoryItem.places.map((place) => (
                    <li key={place.name} className="flex justify-between items-center text-gray-600 border-b border-gray-100 pb-2 last:border-b-0 last:pb-0">
                      <span>{place.name}</span>
                      <span className="font-medium text-gray-800 whitespace-nowrap pl-2">{place.distance}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}