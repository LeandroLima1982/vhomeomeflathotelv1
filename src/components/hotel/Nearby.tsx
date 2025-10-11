import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Landmark, Utensils, Trees } from "lucide-react";

const nearbyData = [
  {
    category: "Pontos Turísticos",
    icon: <Landmark className="w-6 h-6 text-blue-500" />,
    items: [
      { name: "Cristo Redentor", distance: "5 km" },
      { name: "Pão de Açúcar", distance: "7 km" },
      { name: "Escadaria Selarón", distance: "3 km" },
    ],
  },
  {
    category: "Restaurantes",
    icon: <Utensils className="w-6 h-6 text-orange-500" />,
    items: [
      { name: "Marius Degustare", distance: "1 km" },
      { name: "Confeitaria Colombo", distance: "4 km" },
      { name: "Aprazível", distance: "6 km" },
    ],
  },
  {
    category: "Natureza e Parques",
    icon: <Trees className="w-6 h-6 text-green-500" />,
    items: [
      { name: "Jardim Botânico", distance: "2 km" },
      { name: "Parque Lage", distance: "3 km" },
      { name: "Floresta da Tijuca", distance: "8 km" },
    ],
  },
];

export function Nearby() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-50">
      <div className="container mx-auto px-4 md:px-6 text-center">
        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">O que há por perto</h2>
        <p className="text-gray-600 mt-2 mb-12">Explore as atrações e comodidades próximas ao hotel</p>
        <div className="flex overflow-x-auto space-x-8 pb-4">
          {nearbyData.map((categoryItem) => (
            <Card key={categoryItem.category} className="text-left shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col flex-shrink-0 w-80">
              <CardHeader className="flex flex-row items-center gap-4 pb-4">
                {categoryItem.icon}
                <CardTitle className="text-xl font-semibold">{categoryItem.category}</CardTitle>
              </CardHeader>
              <CardContent className="flex-grow">
                <ul className="space-y-2">
                  {categoryItem.items.map((item) => (
                    <li key={item.name} className="flex items-center justify-between">
                      <span className="text-gray-700">{item.name}</span>
                      <span className="text-sm font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-full">{item.distance}</span>
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