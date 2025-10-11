import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Utensils, Plane, ShoppingBag, FerrisWheel, Landmark, Trees } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

const iconMap = {
  Restaurantes: <Utensils className="w-6 h-6 text-primary" />,
  Aeroportos: <Plane className="w-6 h-6 text-primary" />,
  "Pontos Turísticos": <Landmark className="w-6 h-6 text-primary" />,
  Compras: <ShoppingBag className="w-6 h-6 text-primary" />,
  "Parques e Lazer": <Trees className="w-6 h-6 text-primary" />,
  "Atrações Populares": <FerrisWheel className="w-6 h-6 text-primary" />,
};

const nearbyData = [
  {
    category: "Restaurantes",
    items: [
      { name: "Restaurante Sabor Divino", distance: "500m" },
      { name: "Cantina Italiana", distance: "800m" },
      { name: "Sushi House", distance: "1.2km" },
    ],
  },
  {
    category: "Aeroportos",
    items: [
      { name: "Aeroporto Internacional", distance: "15km" },
      { name: "Aeroporto Doméstico", distance: "25km" },
    ],
  },
  {
    category: "Pontos Turísticos",
    items: [
      { name: "Centro Histórico", distance: "2km" },
      { name: "Museu de Arte", distance: "3.5km" },
      { name: "Catedral da Cidade", distance: "2.5km" },
    ],
  },
  {
    category: "Compras",
    items: [
        { name: "Shopping Central", distance: "5km" },
        { name: "Rua do Comércio", distance: "1.5km" },
    ],
    },
    {
        category: "Parques e Lazer",
        items: [
            { name: "Parque da Cidade", distance: "4km" },
            { name: "Jardim Botânico", distance: "6km" },
        ],
    },
    {
        category: "Atrações Populares",
        items: [
            { name: "Roda Gigante Vista Alta", distance: "7km" },
            { name: "Aquário Marinho", distance: "8.5km" },
        ],
    }
];

export function Nearby() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-50">
      <div className="container mx-auto px-4 md:px-6 text-center">
        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">O que há por perto?</h2>
        <p className="text-gray-600 mt-2 mb-12">Explore as atrações e comodidades próximas ao hotel</p>
        <div className="flex justify-center">
          <Carousel className="w-full max-w-xs sm:max-w-xl md:max-w-2xl lg:max-w-4xl xl:max-w-6xl">
            <CarouselContent>
              {nearbyData.map((categoryItem) => (
                <CarouselItem key={categoryItem.category} className="sm:basis-1/2 lg:basis-1/3">
                  <div className="p-1">
                    <Card className="text-left shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col h-full">
                      <CardHeader className="flex flex-row items-center gap-4 pb-4">
                        {iconMap[categoryItem.category]}
                        <CardTitle className="text-xl font-semibold">{categoryItem.category}</CardTitle>
                      </CardHeader>
                      <CardContent className="flex-grow">
                        <ul className="space-y-2">
                          {categoryItem.items.map((item) => (
                            <li key={item.name} className="flex justify-between items-center">
                              <span className="text-gray-700">{item.name}</span>
                              <span className="text-sm font-medium text-gray-500">{item.distance}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden sm:flex" />
            <CarouselNext className="hidden sm:flex" />
          </Carousel>
        </div>
      </div>
    </section>
  );
}