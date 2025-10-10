"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Waves, Utensils, Trees, Mountain, Plane, Landmark } from "lucide-react";

const nearbyData = [
  {
    category: "Praias",
    icon: Waves,
    places: [
      { name: "Praia Campista", distance: "0 m", image: "https://images.unsplash.com/photo-1507525428034-b723a9ce6890?auto=format&fit=crop&w=400&q=80" },
      { name: "Praia dos Cavaleiros", distance: "1,6 km", image: "https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=400&q=80" },
      { name: "Praia de Imbetiba", distance: "2,4 km", image: "https://images.unsplash.com/photo-1473187983305-f61531429437?auto=format&fit=crop&w=400&q=80" },
      { name: "Praia da Pecado", distance: "3 km", image: "https://images.unsplash.com/photo-1509281373149-e957c6296406?auto=format&fit=crop&w=400&q=80" },
      { name: "Mar do Norte", distance: "6,1 km", image: "https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&w=400&q=80" },
    ],
  },
  {
    category: "Restaurantes",
    icon: Utensils,
    places: [
      { name: "Ilhote Sul", distance: "10 m", image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=400&q=80" },
      { name: "Durval", distance: "250 m", image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=400&q=80" },
      { name: "Go Go Wok", distance: "2,3 km", image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=400&q=80" },
    ],
  },
  {
    category: "Parques",
    icon: Trees,
    places: [
      { name: "Parque da Cidade", distance: "1,4 km", image: "https://images.unsplash.com/photo-1543007168-5fa9b3c5edc9?auto=format&fit=crop&w=400&q=80" },
      { name: "Parque Municipal", distance: "15 km", image: "https://images.unsplash.com/photo-1500332242573-35f30ayler?auto=format&fit=crop&w=400&q=80" },
      { name: "Restinga de Jurubatiba", distance: "16 km", image: "https://images.unsplash.com/photo-1621848212134-785a7dfcf786?auto=format&fit=crop&w=400&q=80" },
    ],
  },
  {
    category: "Belezas Naturais",
    icon: Mountain,
    places: [
      { name: "Lagoa de Imboássica", distance: "5 km", image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=400&q=80" },
      { name: "Cachoeira das Sete Quedas", distance: "45 km", image: "https://images.unsplash.com/photo-1532347922424-271b53a9b592?auto=format&fit=crop&w=400&q=80" },
      { name: "Cachoeira de Glicério", distance: "45 km", image: "https://images.unsplash.com/photo-1500373994218-398cc6937a85?auto=format&fit=crop&w=400&q=80" },
      { name: "Pico do Frade", distance: "56 km", image: "https://images.unsplash.com/photo-1595342739333-311194f29b44?auto=format&fit=crop&w=400&q=80" },
    ],
  },
  {
    category: "Aeroportos",
    icon: Plane,
    places: [
      { name: "Aeroporto de Macaé", distance: "6 km", image: "https://images.unsplash.com/photo-1530533718754-001d2668365a?auto=format&fit=crop&w=400&q=80" },
      { name: "Aeroporto de Cabo Frio", distance: "77 km", image: "https://images.unsplash.com/photo-1558642073-4a1a36a03a73?auto=format&fit=crop&w=400&q=80" },
      { name: "Aeroporto de Arraial do Cabo", distance: "84 km", image: "https://images.unsplash.com/photo-1628548391373-24206a5a7b3f?auto=format&fit=crop&w=400&q=80" },
    ],
  },
  {
    category: "Pontos de Interesse",
    icon: Landmark,
    places: [
        { name: "Forte Marechal Hermes", distance: "4 km", image: "https://images.unsplash.com/photo-1586792099131-da013243d547?auto=format&fit=crop&w=400&q=80" },
        { name: "Shopping Plaza", distance: "4,5 km", image: "https://images.unsplash.com/photo-1580828343064-fde4fc206bc6?auto=format&fit=crop&w=400&q=80" },
        { name: "Hospital Unimed", distance: "3,5 km", image: "https://images.unsplash.com/photo-1631217872137-2732f08a77a1?auto=format&fit=crop&w=400&q=80" },
        { name: "Parque Fazenda Atalaia", distance: "27 km", image: "https://images.unsplash.com/photo-1582239931097-0a4561591c61?auto=format&fit=crop&w=400&q=80" },
    ]
  }
];

export function Nearby() {
  return (
    <section id="perto" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-800">O que há por perto?</h2>
          <p className="text-gray-600 mt-2 mb-12">Passe o mouse sobre um local para ver uma imagem</p>
        </div>
        
        <Accordion type="multiple" defaultValue={[`item-${nearbyData[0].category}`]} className="w-full max-w-4xl mx-auto">
          {nearbyData.map((category) => (
            <AccordionItem key={category.category} value={`item-${category.category}`}>
              <AccordionTrigger className="text-xl font-semibold hover:no-underline">
                <div className="flex items-center gap-4">
                  <div className="bg-blue-100 p-3 rounded-full">
                    <category.icon className="h-6 w-6 text-blue-800" />
                  </div>
                  {category.category}
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 pt-4">
                  {category.places.map((place) => (
                    <div key={place.name} className="group [perspective:1000px]" style={{ height: '250px' }}>
                      <div className="relative h-full w-full rounded-xl shadow-lg transition-all duration-500 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
                        {/* Front Side */}
                        <div className="absolute inset-0 [backface-visibility:hidden]">
                          <Card className="h-full w-full flex flex-col justify-center items-center text-center p-2">
                            <CardHeader className="p-0">
                              <div className="mx-auto bg-blue-100 p-3 rounded-full mb-3">
                                <category.icon className="h-6 w-6 text-blue-800" />
                              </div>
                              <CardTitle className="text-sm font-bold leading-tight">{place.name}</CardTitle>
                            </CardHeader>
                            <CardContent className="p-0 mt-2">
                              <p className="text-lg font-semibold text-blue-800">{place.distance}</p>
                              <p className="text-xs text-gray-500 mt-1">{category.category}</p>
                            </CardContent>
                          </Card>
                        </div>
                        {/* Back Side */}
                        <div className="absolute inset-0 h-full w-full rounded-xl [transform:rotateY(180deg)] [backface-visibility:hidden]">
                          <img src={place.image} alt={place.name} className="h-full w-full object-cover rounded-xl" />
                          <div className="absolute inset-0 bg-black bg-opacity-40 flex items-end p-3 rounded-xl">
                            <h3 className="text-white text-base font-bold">{place.name}</h3>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}