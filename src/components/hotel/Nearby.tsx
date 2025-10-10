import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

const nearbyData = [
  {
    category: "Parques",
    places: [
      {
        name: "Parque da Cidade",
        distance: "1,4 km",
        image: "https://images.unsplash.com/photo-1586348943529-beaae6c28db9?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        description: "Ampla área verde para lazer e esportes."
      },
      {
        name: "Parque Municipal",
        distance: "15 km",
        image: "https://images.unsplash.com/photo-1550026593-f369e81a0afb?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        description: "Contato com a natureza e trilhas."
      },
      {
        name: "Restinga de Jurubatiba",
        distance: "16 km",
        image: "https://images.unsplash.com/photo-1599667939302-47d5d7f7b2a1?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        description: "Parque nacional com ecossistema único."
      }
    ]
  },
  {
    category: "Restaurantes",
    places: [
      {
        name: "Ilhote Sul",
        distance: "10 m",
        image: "https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        description: "Especialidade em frutos do mar."
      },
      {
        name: "Durval",
        distance: "250 m",
        image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        description: "Culinária variada e ambiente agradável."
      },
      {
        name: "Go Go Wok culinária japonesa",
        distance: "2,3 km",
        image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        description: "Sabores autênticos da cozinha japonesa."
      }
    ]
  },
  {
    category: "Belezas Naturais",
    places: [
      {
        name: "Cachoeira do Escorrega Bicuda Pequena",
        distance: "70 km",
        image: "https://images.unsplash.com/photo-1532274402911-5a369e4c4bb5?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        description: "Queda d'água em meio à natureza."
      },
      {
        name: "Lagoa de Imboássica",
        distance: "5 km",
        image: "https://images.unsplash.com/photo-1523825336839-3d88cb02771e?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        description: "Ideal para esportes aquáticos e lazer."
      }
    ]
  },
  {
    category: "Praias",
    places: [
      {
        name: "Praia Campista",
        distance: "0 m",
        image: "https://images.unsplash.com/photo-1519046904884-53103b34b206?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        description: "A praia em frente ao hotel."
      },
      {
        name: "Praia dos Cavaleiros",
        distance: "1,6 km",
        image: "https://images.unsplash.com/photo-1562533114-2d5a354f3828?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        description: "Polo gastronômico e vida noturna."
      },
      {
        name: "Praia de Imbetiba",
        distance: "2,4 km",
        image: "https://images.unsplash.com/photo-1509281373149-e957c6296406?q=80&w=1928&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        description: "Praia urbana com águas calmas."
      },
      {
        name: "Praia do Pecado",
        distance: "3 km",
        image: "https://images.unsplash.com/photo-1500930242389-fe02a90aae33?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        description: "Preferida por surfistas."
      },
      {
        name: "Mar do Norte",
        distance: "6,1 km",
        image: "https://images.unsplash.com/photo-1507525428034-b723a996f6ea?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        description: "Praia mais selvagem e tranquila."
      }
    ]
  },
  {
    category: "Aeroportos",
    places: [
      {
        name: "Aeroporto de Macaé",
        distance: "6 km",
        image: "https://images.unsplash.com/photo-1530536924389-fad29a3a8359?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        description: "Principal acesso aéreo à cidade."
      },
      {
        name: "Aeroporto de Cabo Frio",
        distance: "77 km",
        image: "https://images.unsplash.com/photo-1570125909239-74182456292e?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        description: "Alternativa para voos regionais."
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
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 pt-4">
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