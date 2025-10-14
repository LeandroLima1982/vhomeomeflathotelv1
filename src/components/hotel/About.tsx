import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { Star, MapPin, Waves, Wifi, Car, Coffee } from "lucide-react";

const features = [
  { icon: Star, text: "Flat Hotel 4 Estrelas" },
  { icon: MapPin, text: "Localização Privilegiada" },
  { icon: Waves, text: "Beira-Mar" },
  { icon: Wifi, text: "Wi-Fi Grátis" },
  { icon: Car, text: "Estacionamento Grátis" },
  { icon: Coffee, text: "Café da Manhã Incluso" },
];

const images = [
  "/placeholder.svg",
  "/placeholder.svg",
  "/placeholder.svg",
  "/placeholder.svg",
  "/placeholder.svg",
];

export default function About() {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                Bem-vindo ao V-Home
              </h2>
              <p className="text-xl text-gray-700 mb-6">
                Seu Flat Hotel à Beira Mar
              </p>
              <p className="text-gray-600 leading-relaxed">
                O V-Home Flat Hotel oferece acomodações modernas e sofisticadas
                em Macaé, com localização privilegiada na Av. Atlântica. Nosso
                hotel 4 estrelas combina conforto, estilo e comodidade para
                proporcionar uma experiência inesquecível.
              </p>
              <p className="text-gray-600 leading-relaxed mt-4">
                Cada apartamento conta com ar-condicionado, tv de tela plana,
                cozinha completa, e banheiro privativo. Desfrute de nossa
                piscina ao ar livre, terraço com vista, e serviço de concierge
                disponível 24 horas.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <feature.icon className="w-6 h-6 text-blue-600" />
                  <span className="text-gray-700">{feature.text}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <Carousel className="w-full max-w-md mx-auto">
              <CarouselContent>
                {images.map((src, index) => (
                  <CarouselItem key={index}>
                    <div className="p-1">
                      <Card>
                        <CardContent className="flex aspect-square items-center justify-center p-0">
                          <img
                            src={src}
                            alt={`V-Home Image ${index + 1}`}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        </CardContent>
                      </Card>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </div>
        </div>
      </div>
    </section>
  );
}