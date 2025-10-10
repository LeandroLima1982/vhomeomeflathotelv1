import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

const nearbyData = [
  {
    category: "Parques",
    places: [
      {
        name: "Parque da Cidade",
        distance: "1,4 km",
        image: "https://macae.rj.gov.br/lib/images/noticia/1024x768/04072023163358.jpeg",
        description: "Ampla área verde para lazer e esportes."
      },
      {
        name: "Parque Municipal Atalaia",
        distance: "15 km",
        image: "https://media-cdn.tripadvisor.com/media/photo-s/0f/3a/8a/3f/parque-municipal-atalaia.jpg",
        description: "Contato com a natureza e trilhas com vista para o mar."
      },
      {
        name: "Restinga de Jurubatiba",
        distance: "16 km",
        image: "https://www.icmbio.gov.br/parnajurubatiba/images/stories/parna_jurubatiba_2.jpg",
        description: "Parque nacional com ecossistema único de praias e lagoas."
      }
    ]
  },
  {
    category: "Restaurantes",
    places: [
      {
        name: "Ilhote Sul",
        distance: "10 m",
        image: "https://media-cdn.tripadvisor.com/media/photo-s/1d/3a/5a/5d/nosso-cartao-postal.jpg",
        description: "Especialidade em frutos do mar."
      },
      {
        name: "Durval",
        distance: "250 m",
        image: "https://vejario.abril.com.br/wp-content/uploads/2023/08/Durval-credito-Alex-Cunha-Divulgacao-2.jpg?quality=70&strip=info&w=1280&h=720&crop=1",
        description: "Culinária variada e ambiente agradável."
      },
      {
        name: "Go Go Wok",
        distance: "2,3 km",
        image: "https://media-cdn.tripadvisor.com/media/photo-s/1a/8a/9a/9a/nosso-delicioso-combinado.jpg",
        description: "Sabores autênticos da cozinha japonesa."
      }
    ]
  },
  {
    category: "Belezas Naturais",
    places: [
      {
        name: "Cachoeira do Escorrega",
        distance: "70 km",
        image: "https://www.euviagens.com/wp-content/uploads/2021/01/Cachoeira-do-Escorrega-em-Sana-RJ.jpg",
        description: "Queda d'água em meio à natureza na região de Sana."
      },
      {
        name: "Lagoa de Imboassica",
        distance: "5 km",
        image: "https://macae.rj.gov.br/lib/images/noticia/1024x768/29012020111108.jpeg",
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
        image: "https://media-cdn.tripadvisor.com/media/photo-s/0d/9a/8a/8a/praia-campista.jpg",
        description: "A praia em frente ao hotel."
      },
      {
        name: "Praia dos Cavaleiros",
        distance: "1,6 km",
        image: "https://www.qualviagem.com.br/wp-content/uploads/2016/07/Praia_dos_Cavaleiros_Maca%C3%A9_Foto_Divulga%C3%A7%C3%A3o.jpg",
        description: "Polo gastronômico e vida noturna."
      },
      {
        name: "Praia de Imbetiba",
        distance: "2,4 km",
        image: "https://media-cdn.tripadvisor.com/media/photo-s/08/71/41/41/praia-de-imbetiba.jpg",
        description: "Praia urbana com águas calmas."
      },
      {
        name: "Praia do Pecado",
        distance: "3 km",
        image: "https://media-cdn.tripadvisor.com/media/photo-s/08/71/41/4a/praia-do-pecado.jpg",
        description: "Preferida por surfistas."
      },
      {
        name: "Mar do Norte",
        distance: "6,1 km",
        image: "https://media-cdn.tripadvisor.com/media/photo-s/08/71/41/5a/mar-do-norte.jpg",
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
        image: "https://www.zurichairportbrasil.com.br/data/images/pages/6/macae-aeroporto-01.jpg",
        description: "Principal acesso aéreo à cidade."
      },
      {
        name: "Aeroporto de Cabo Frio",
        distance: "77 km",
        image: "https://www.aeroportocabofrio.com.br/wp-content/uploads/2023/05/aeroporto-de-cabo-frio-scaled.jpg",
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