import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { StarIcon } from "lucide-react"

const nearbyData = [
  {
    category: "Praias e Lazer",
    places: [
      {
        name: "Praia dos Cavaleiros",
        distance: "1.5 km",
        rating: 4.7,
        image: "https://images.unsplash.com/photo-1562533114-2d5a354f3828?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        description: "Principal polo gastronômico e de lazer noturno da cidade."
      },
      {
        name: "Praia do Pecado",
        distance: "3 km",
        rating: 4.6,
        image: "https://images.unsplash.com/photo-1500930242389-fe02a90aae33?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        description: "Ideal para a prática de surf e kitesurf, com uma bela paisagem."
      },
      {
        name: "Lagoa de Imboassica",
        distance: "4 km",
        rating: 4.5,
        image: "https://images.unsplash.com/photo-1523825336839-3d88cb02771e?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        description: "Ótima para esportes aquáticos, caminhadas e apreciar o pôr do sol."
      },
      {
        name: "Parque da Restinga",
        distance: "20 km",
        rating: 4.8,
        image: "https://images.unsplash.com/photo-1599667939302-47d5d7f7b2a1?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        description: "Belezas naturais, com 18 lagoas e ecossistema preservado."
      }
    ]
  },
  {
    category: "Restaurantes",
    places: [
      {
        name: "Ilhote Sul Restaurante",
        distance: "1.2 km",
        rating: 4.8,
        image: "https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        description: "Especializado em frutos do mar, com vista para o mar."
      },
      {
        name: "Picanha do Zé",
        distance: "2.5 km",
        rating: 4.7,
        image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        description: "Churrascaria tradicional e muito popular na cidade."
      },
      {
        name: "Luigi Ristorante",
        distance: "1.8 km",
        rating: 4.6,
        image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        description: "Culinária italiana autêntica em um ambiente acolhedor."
      }
    ]
  },
  {
    category: "Transporte",
    places: [
      {
        name: "Aeroporto de Macaé (MEA)",
        distance: "10 km",
        image: "https://images.unsplash.com/photo-1530536924389-fad29a3a8359?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        description: "Principal aeroporto da cidade, com voos para destinos nacionais."
      },
      {
        name: "Rodoviária de Macaé",
        distance: "6 km",
        image: "https://images.unsplash.com/photo-1570125909239-74182456292e?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        description: "Terminal de ônibus com linhas para o Rio de Janeiro e outras cidades."
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