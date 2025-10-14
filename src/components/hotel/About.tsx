import { Button } from "@/components/ui/button"
import { Wifi, Coffee, UtensilsCrossed, Waves } from "lucide-react"

export default function About() {
  return (
    <section className="py-16 md:py-24 bg-gray-50 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="relative flex flex-col lg:flex-row items-center lg:items-stretch">
          {/* Image container */}
          <div className="w-full lg:w-3/5 flex-shrink-0">
            <img
              src="/placeholder.svg"
              alt="Área de lazer do hotel com piscina"
              className="rounded-xl shadow-2xl w-full h-full object-cover aspect-[4/3] lg:aspect-auto"
            />
          </div>

          {/* Text card container */}
          <div className="w-full lg:w-1/2 mt-[-4rem] lg:mt-0 lg:ml-[-10%] z-10">
            <div className="bg-white p-8 md:p-12 rounded-xl shadow-2xl h-full flex flex-col justify-center">
              <div className="space-y-6">
                <div>
                  <p className="text-primary font-semibold text-sm uppercase tracking-wider mb-2">Nossa Essência</p>
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                    Conforto e Elegância no Coração da Cidade
                  </h2>
                  <p className="text-gray-600 leading-relaxed">
                    Bem-vindo ao nosso oásis de tranquilidade e sofisticação. Localizado estrategicamente, combinamos luxo, conforto e um serviço impecável para criar uma experiência memorável.
                  </p>
                </div>

                <ul className="space-y-4 pt-4 border-t border-gray-200">
                  <li className="flex items-center">
                    <div className="bg-primary/10 p-2 rounded-full mr-4">
                      <Wifi className="h-5 w-5 text-primary" />
                    </div>
                    <span className="text-gray-700">Wi-Fi de alta velocidade</span>
                  </li>
                  <li className="flex items-center">
                    <div className="bg-primary/10 p-2 rounded-full mr-4">
                      <Coffee className="h-5 w-5 text-primary" />
                    </div>
                    <span className="text-gray-700">Café da manhã completo</span>
                  </li>
                  <li className="flex items-center">
                    <div className="bg-primary/10 p-2 rounded-full mr-4">
                      <UtensilsCrossed className="h-5 w-5 text-primary" />
                    </div>
                    <span className="text-gray-700">Gastronomia requintada</span>
                  </li>
                   <li className="flex items-center">
                    <div className="bg-primary/10 p-2 rounded-full mr-4">
                      <Waves className="h-5 w-5 text-primary" />
                    </div>
                    <span className="text-gray-700">Piscina para relaxamento</span>
                  </li>
                </ul>

                <Button size="lg" className="w-full md:w-auto !mt-8">Explore Nossos Quartos</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}