import { Wifi, ParkingCircle, Tv, Wind, Dumbbell, CookingPot } from 'lucide-react';

const amenities = [
  {
    icon: <Wifi size={48} className="text-blue-500" />,
    name: 'Wi-Fi Gratuito',
    description: 'Conexão de alta velocidade em todas as áreas do hotel.',
  },
  {
    icon: <CookingPot size={48} className="text-green-500" />,
    name: 'Restaurante',
    description: 'Sabores locais e internacionais em um ambiente aconchegante.',
  },
  {
    icon: <ParkingCircle size={48} className="text-gray-500" />,
    name: 'Estacionamento',
    description: 'Estacionamento seguro e conveniente para os hóspedes.',
  },
  {
    icon: <Tv size={48} className="text-purple-500" />,
    name: 'TV de Tela Plana',
    description: 'Canais a cabo e streaming para seu entretenimento.',
  },
  {
    icon: <Wind size={48} className="text-teal-500" />,
    name: 'Ar Condicionado',
    description: 'Controle de temperatura individual em todos os quartos.',
  },
  {
    icon: <Dumbbell size={48} className="text-red-500" />,
    name: 'Academia',
    description: 'Equipamentos modernos para manter sua rotina de exercícios.',
  },
];

const Amenities = () => {
  return (
    <section id="amenities" className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center text-gray-800 mb-12">Comodidades</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {amenities.map((amenity, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow text-center">
              <div className="flex justify-center mb-4">{amenity.icon}</div>
              <h3 className="font-semibold text-lg text-gray-800">{amenity.name}</h3>
              <p className="text-sm text-gray-500 mt-1">{amenity.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Amenities;