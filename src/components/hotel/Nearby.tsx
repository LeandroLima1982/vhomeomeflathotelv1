import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

const nearbyData = [
  {
    category: "Parques",
    places: [
      { name: "Parque da Cidade", distance: "1,4 km" },
      { name: "Parque Municipal", distance: "15 km" },
      { name: "Restinga de Jurubatiba", distance: "16 km" },
    ]
  },
  {
    category: "Restaurantes",
    places: [
      { name: "Ilhote Sul", distance: "10 m" },
      { name: "Durval", distance: "250 m" },
      { name: "Go Go Wok culinária japonesa", distance: "2,3 km" },
    ]
  },
  {
    category: "Belezas Naturais",
    places: [
      { name: "Cachoeira do Escorrega Bicuda Pequena", distance: "70 km" },
      { name: "Lagoa de Imboássica", distance: "5 km" },
    ]
  },
  {
    category: "Praias",
    places: [
      { name: "Praia Campista", distance: "0 m" },
      { name: "Praia dos Cavaleiros", distance: "1,6 km" },
      { name: "Praia de Imbetiba", distance: "2,4 km" },
      { name: "Praia da Pecado", distance: "3 km" },
      { name: "Mar do Norte", distance: "6,1 km" },
    ]
  },
  {
    category: "Aeroportos",
    places: [
      { name: "Aeroporto de Macaé", distance: "6 km" },
      { name: "Aeroporto de Cabo Frio", distance: "77 km" },
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
              <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-4 pt-4">
                {category.places.map((place) => (
                  <li key={place.name} className="flex justify-between">
                    <span>{place.name}</span>
                    <span className="text-muted-foreground">{place.distance}</span>
                  </li>
                ))}
              </ul>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  )
}