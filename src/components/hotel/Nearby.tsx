import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Landmark, ShoppingBag, Trees, Ship, Camera, Waves } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

const iconMap = {
  "Praia Dourada": <Waves className="w-6 h-6 text-primary" />,
  "Centro Histórico": <Landmark className="w-6 h-6 text-primary" />,
  "Parque das Cascatas": <Trees className="w-6 h-6 text-primary" />,
  "Shopping Atlântico": <ShoppingBag className="w-6 h-6 text-primary" />,
  "Mirante do Sol": <Camera className="w-6 h-6 text-primary" />,
  "Marina dos Pescadores": <Ship className="w-6 h-6 text-primary" />,
};

const nearbyData = [
  {
    category: "Praia Dourada",
    items: [
      { name: "Acesso principal à praia", distance: "200m" },
      { name: "Bar da Praia", distance: "300m" },
      { name: "Escola de Surf", distance: "400m" },
    ],
  },
  {
    category: "Centro Histórico",
    items: [
      { name: "Igreja Matriz", distance: "1.5km" },
      { name: "Mercado de Artesanato", distance: "1.7km" },
      { name: "Museu da Cidade", distance: "2km" },
    ],
  },
  {
    category: "Parque das Cascatas",
    items: [
      { name: "Trilha da Cachoeira", distance: "3km" },
      { name: "Área de Piquenique", distance: "3.2km" },
      { name: "Ponte Pênsil", distance: "3.5km" },
    ],
  },
  {
    category: "Shopping Atlântico",
    items: [
        { name: "Lojas de Grife", distance: "5km" },
        { name: "Praça de Alimentação", distance: "5km" },
        { name: "Cinema", distance: "5km" },
    ],
    },
    {
        category: "Mirante do Sol",
        items: [
            { name: "Plataforma de Observação", distance: "4.5km" },
            { name: "Café com Vista", distance: "4.5km" },
        ],
    },
    {
        category: "Marina dos Pescadores",
        items: [
            { name: "Passeios de Barco", distance: "2.5km" },
            { name: "Restaurante de Frutos do Mar", distance: "2.6km" },
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