import { MapPin, Phone, Mail, Clock } from 'lucide-react';

const contactInfo = [
  {
    icon: <MapPin className="w-8 h-8 text-blue-600" />,
    title: 'Endereço',
    text: 'Av. Atlântica, 342, Macaé - RJ, CEP 27920-325',
  },
  {
    icon: <Phone className="w-8 h-8 text-blue-600" />,
    title: 'Telefone',
    text: '(22) 2141-2091',
  },
  {
    icon: <Mail className="w-8 h-8 text-blue-600" />,
    title: 'E-mail',
    text: 'contato@vhomeflathotel.com',
  },
  {
    icon: <Clock className="w-8 h-8 text-blue-600" />,
    title: 'Horário de Atendimento',
    text: '24 horas por dia, 7 dias por semana',
  },
];

export default function Contact() {
  return (
    <section id="contato" className="pt-24 py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <div>
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-800">Entre em Contato</h2>
              <p className="text-gray-600 mt-2 text-lg">Estamos aqui para ajudá-lo</p>
            </div>
            <div className="space-y-6">
              {contactInfo.map((item, index) => (
                <div key={index} className="flex items-center p-6 bg-white rounded-lg shadow-sm border border-gray-200">
                  <div className="flex-shrink-0 mr-6">
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">{item.title}</h3>
                    <p className="text-gray-600">{item.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="h-full min-h-[500px]">
            <div className="rounded-lg overflow-hidden shadow-lg h-full">
              <iframe
                src="https://maps.google.com/maps?q=Av.+Atlântica+342,+Praia+Campista,+Macaé+-+RJ,+27920-325,+Brazil&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-full"
                title="Localização do V-Home Flat Hotel"
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}