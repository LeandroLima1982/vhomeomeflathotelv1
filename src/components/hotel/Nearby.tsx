"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trees, Utensils, Waves, Plane } from "lucide-react";

const nearbyPlaces = [
  {
    category: "Parques",
    icon: <Trees className="h-6 w-6 text-blue-600" />,
    places: [
      { name: "Parque da Cidade", distance: "1.4 km" },
      { name: "Parque Municipal", distance: "15 km" },
      { name: "PARNA da Restinga de Jurubatiba", distance: "16 km" },
    ],
  },
  {
    category: "Restaurantes e Cafés",
    icon: <Utensils className="h-6 w-6 text-blue-600" />,
    places: [
      { name: "Detroit Steakhouse", distance: "10 m" },
      { name: "Finalmente Creperia", distance: "250 m" },
      { name: "Aromas Bar e Restaurante", distance: "2.3 km" },
    ],
  },
  {
    category: "Praias",
    icon: <Waves className="h-6 w-6 text-blue-600" />,
    places: [
      { name: "Praia Campista", distance: "0 m" },
      { name: "Praia dos Cavaleiros", distance: "1.6 km" },
      { name: "Praia de Imbetiba", distance: "2.4 km" },
    ],
  },
  {
    category: "Aeroportos",
    icon: <Plane className="h-6 w-6 text-blue-600" />,
    places: [
      { name: "Aeroporto de Macaé", distance: "6 km" },
      { name: "Aeroporto de Cabo Frio", distance: "77 km" },
    ],
  },
];

export function Nearby() {
  return (
    <section id="perto" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold text-gray-800">O que há por perto?</h2>
        <p className="text-gray-600 mt-2 mb-12">Explore as atrações e comodidades próximas ao hotel</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {nearbyPlaces.map((categoryItem) => (
            <Card key={categoryItem.category}>
              <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-2">
                {categoryItem.icon}
                <CardTitle>{categoryItem.category}</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-left">
                  {categoryItem.places.map((place) => (
                    <li key={place.name} className="flex justify-between text-sm">
                      <span className="text-gray-700">{place.name}</span>
                      <span className="font-medium text-gray-500">{place.distance}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
        <p className="text-xs text-gray-500 mt-8">* As distâncias são estimativas e podem variar.</p>
      </div>
    </section>
  );
}