"use client";

import { Card } from "@/components/ui/card";
import { MapPin, Phone, Mail, Clock } from "lucide-react";

const contactDetails = [
  {
    icon: <MapPin className="h-6 w-6 text-blue-700" />,
    title: "Endereço",
    value: "Av. Atlântica, 433, Macaé - RJ, CEP 27920-325",
  },
  {
    icon: <Phone className="h-6 w-6 text-blue-700" />,
    title: "Telefone",
    value: "(22) 1234-5678",
  },
  {
    icon: <Mail className="h-6 w-6 text-blue-700" />,
    title: "E-mail",
    value: "contato@vhomeflathotel.com.br",
  },
  {
    icon: <Clock className="h-6 w-6 text-blue-700" />,
    title: "Horário de Atendimento",
    value: "24 horas por dia, 7 dias por semana",
  },
];

export function Contact() {
  return (
    <section id="contato" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
              Entre em Contato
            </h2>
            <p className="text-gray-600 mb-8">
              Estamos aqui para ajudá-lo
            </p>
            <div className="space-y-4">
              {contactDetails.map((detail) => (
                <Card key={detail.title} className="p-4 flex items-center gap-4 bg-white shadow-sm hover:shadow-md transition-shadow">
                  <div className="bg-blue-100 p-3 rounded-lg">
                    {detail.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">{detail.title}</h3>
                    <p className="text-gray-600">{detail.value}</p>
                  </div>
                </Card>
              ))}
            </div>
          </div>
          <div className="h-[400px] md:h-full w-full rounded-lg overflow-hidden shadow-xl border">
            <iframe
              src="https://maps.google.com/maps?q=Av.%20Atl%C3%A2ntica%2C%20433%20-%20Praia%20Campista%2C%20Maca%C3%A9%20-%20RJ%2C%2027920-325&t=&z=15&ie=UTF8&iwloc=&output=embed"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </div>
    </section>
  );
}