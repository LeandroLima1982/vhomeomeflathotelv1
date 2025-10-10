"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const testimonials = [
  {
    name: "Ana Silva",
    avatar: "AS",
    image: "https://randomuser.me/api/portraits/women/44.jpg",
    quote: "Estadia maravilhosa! O hotel é lindo, confortável e a localização é perfeita. A vista para o mar é de tirar o fôlego. Com certeza voltarei!",
  },
  {
    name: "Carlos Souza",
    avatar: "CS",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
    quote: "Excelente! O apartamento é muito bem equipado, limpo e moderno. A equipe foi muito atenciosa e prestativa. Recomendo a todos.",
  },
  {
    name: "Mariana Costa",
    avatar: "MC",
    image: "https://randomuser.me/api/portraits/women/67.jpg",
    quote: "A combinação de flat com serviços de hotel é genial. Tivemos toda a privacidade e conforto de um apartamento, com as comodidades de um hotel de luxo.",
  },
];

export function Testimonials() {
  return (
    <section id="depoimentos" className="py-20 bg-white">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold text-gray-800">O que nossos hóspedes dizem</h2>
        <p className="text-gray-600 mt-2 mb-12">Sua satisfação é a nossa prioridade</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="text-left">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <Avatar>
                    <AvatarImage src={testimonial.image} alt={testimonial.name} />
                    <AvatarFallback>{testimonial.avatar}</AvatarFallback>
                  </Avatar>
                  <CardTitle>{testimonial.name}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">"{testimonial.quote}"</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}