import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { Separator } from "@/components/ui/separator"
import { MountainIcon, StarIcon } from "lucide-react"

const nearbyData = [
  {
    category: "Pontos turísticos",
    places: [
      {
        name: "Parque do Ibirapuera",
        distance: "5 km",
        rating: 4.8,
        image: "/placeholder.jpg",
        description: "O parque mais famoso de São Paulo, com museus, jardins e lagos."
      },
      {
        name: "Avenida Paulista",
        distance: "3 km",
        rating: 4.7,
        image: "/placeholder.jpg",
        description: "O coração cultural e financeiro da cidade, com lojas, restaurantes e museus."
      },
      {
        name: "MASP",
        distance: "3.2 km",
        rating: 4.9,
        image: "/placeholder.jpg",
        description: "Um dos mais importantes museus de arte da América Latina."
      },
      {
        name: "Beco do Batman",
        distance: "7 km",
        rating: 4.6,
        image: "/placeholder.jpg",
        description: "Uma galeria de arte a céu aberto com grafites coloridos."
      }
    ]
  },
  {
    category: "Restaurantes",
    places: [
      {
        name: "D.O.M.",
        distance: "4 km",
        rating: 4.9,
        image: "/placeholder.jpg",
        description: "Restaurante de alta gastronomia do chef Alex Atala."
      },
      {
        name: "A Casa do Porco",
        distance: "2.5 km",
        rating: 4.8,
        image: "/placeholder.jpg",
        description: "Famoso por seus pratos criativos com carne de porco."
      },
      {
        name: "Maní",
        distance: "6 km",
        rating: 4.7,
        image: "/placeholder.jpg",
        description: "Cozinha brasileira contemporânea em um ambiente charmoso."
      }
    ]
  },
  {
    category: "Transporte",
    places: [
      {
        name: "Aeroporto de Congonhas",
        distance: "8 km",
        image: "/placeholder.jpg",
        description: "Um dos principais aeroportos da cidade."
      },
      {
        name: "Estação de Metrô Trianon-Masp",
        distance: "3.1 km",
        image: "/placeholder.jpg",
        description: "Acesso fácil à linha verde do metrô."
      }
    ]
  }
]

export function Nearby() {
  return (
    <div className="w-full max-w-6xl mx-auto py-12 px-4 md:px-6">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold">O que há por perto?</h2>
      </div>
      <Accordion type="single" collapsible className="w-full" defaultValue="item-0">
        {nearbyData.map((category, index) => (
          <AccordionItem value={`item-${index}`} key={category.category}>
            <AccordionTrigger className="text-2xl font-semibold">{category.category}</AccordionTrigger>
            <AccordionContent>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 pt-4">
                {category.places.map((place) => (
                  <div key={place.name} className="group [perspective:1000px]" style={{ height: '250px' }}>
                    <div className="relative h-full w-full rounded-xl shadow-lg transition-all duration-500 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
                      <div className="absolute inset-0">
                        <img
                          src={place.image}
                          alt={place.name}
                          className="h-full w-full rounded-xl object-cover shadow-xl shadow-black/40"
                        />
                        <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black/80 to-transparent rounded-b-xl">
                          <h3 className="text-white text-lg font-bold">{place.name}</h3>
                          <p className="text-white text-sm">{place.distance}</p>
                        </div>
                      </div>
                      <div className="absolute inset-0 h-full w-full rounded-xl bg-black/80 px-6 py-4 text-center text-slate-200 [transform:rotateY(180deg)] [backface-visibility:hidden]">
                        <div className="flex min-h-full flex-col items-center justify-center">
                          <h3 className="text-xl font-bold">{place.name}</h3>
                          <p className="text-sm mt-1 text-gray-400">{place.distance}</p>
                          {place.rating && (
                            <div className="flex items-center gap-1 mt-2">
                              <StarIcon className="w-5 h-5 fill-primary text-primary" />
                              <span className="font-semibold">{place.rating}</span>
                            </div>
                          )}
                          <p className="text-base mt-2">{place.description}</p>
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
  )
}