"use client";

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, Clock, Phone, Mail } from 'lucide-react';

const About = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-2">
              Bem-vindo ao V-Home
            </h2>
            <p className="text-xl text-gray-700 mb-6">
              Onde o conforto encontra a hospitalidade. Descubra um refúgio acolhedor para suas férias e viagens de negócios.
            </p>
            <p className="text-lg text-gray-600 mb-8">
              Localizado em uma área privilegiada, oferecemos quartos modernos e bem equipados, com serviços personalizados para tornar sua estadia inesquecível. Nossa equipe está sempre pronta para atender às suas necessidades, garantindo uma experiência excepcional.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
            <Card className="text-center p-6 shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <MapPin className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Localização Privilegiada</h3>
                <p className="text-gray-600">
                  Situado no coração da cidade, com fácil acesso a pontos turísticos e comerciais.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-6 shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <Clock className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Atendimento 24h</h3>
                <p className="text-gray-600">
                  Nossa equipe está disponível a qualquer hora para garantir seu conforto.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-6 shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <Phone className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Contato Fácil</h3>
                <p className="text-gray-600">
                  Entre em contato conosco por telefone ou e-mail para qualquer dúvida.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-6 shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <Mail className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Reservas Online</h3>
                <p className="text-gray-600">
                  Faça sua reserva de forma rápida e segura através do nosso site.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;