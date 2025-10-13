import { Dumbbell, Wifi, Utensils, ParkingCircle, Tv, Wind, Sun, ShoppingBag, Briefcase, Archive, Paintbrush2, Waves } from 'lucide-react';

const amenities = [
  {
    icon: <Dumbbell size={48} className="text-blue-500" />,
    title: 'Academia',
    description: 'Mantenha-se em forma com nossos equipamentos modernos.',
  },
  {
    icon: <Wifi size={48} className="text-blue-500" />,
    title: 'Wi-Fi Grátis',
    description: 'Conexão de alta velocidade em todas as áreas do hotel.',
  },
  {
    icon: <Utensils size={48} className="text-blue-500" />,
    title: 'Restaurante no Local',
    description: 'Saboreie pratos deliciosos sem sair do hotel.',
  },
  {
    icon: <ParkingCircle size={48} className="text-blue-500" />,
    title: 'Estacionamento',
    description: 'Estacionamento seguro e conveniente para os hóspedes.',
  },
  {
    icon: <Tv size={48} className="text-blue-500" />,
    title: 'TV de Tela Plana',
    description: 'Desfrute de uma variedade de canais e entretenimento.',
  },
  {
    icon: <Wind size={48} className="text-blue-500" />,
    title: 'Ar Condicionado',
    description: 'Ambiente sempre agradável e climatizado.',
  },
  {
    icon: <Sun size={48} className="text-blue-500" />,
    title: 'Piscina ao Ar Livre',
    description: 'Relaxe e aproveite o sol em nossa piscina.',
  },
  {
    icon: <ShoppingBag size={48} className="text-blue-500" />,
    title: 'Próximo a Comércios',
    description: 'Fácil acesso a lojas, restaurantes e entretenimento.',
  },
  {
    icon: <Briefcase size={48} className="text-blue-500" />,
    title: 'Home Office',
    description: 'Espaço em seu apartamento projetado para o trabalho.',
  },
  {
    icon: <Waves size={48} className="text-blue-500" />,
    title: 'Final de semana?',
    description: 'Shopping próximo, restaurantes e as principais praias.',
  },
  {
    icon: <Archive size={48} className="text-blue-500" />,
    title: 'Móveis Planejados',
    description: 'Espaçosos armários que oferecem bastante espaço de armazenamento.',
  },
  {
    icon: <Paintbrush2 size={48} className="text-blue-500" />,
    title: 'Decoração elegante',
    description: 'Ambientes sofisticado e acolhedor.',
  },
];

const Amenities = () => {
  return (
    <section id="amenities" className="py-20 bg-gray-50">
      <div className="container mx-auto text-center">
        <h2 className="text-4xl font-bold">Comodidades</h2>
        <p className="text-gray-600 mt-2 mb-12">Tudo para o seu conforto</p>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {amenities.map((amenity, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow text-center">
              <div className="flex justify-center mb-4">{amenity.icon}</div>
              <h3 className="text-xl font-semibold">{amenity.title}</h3>
              <p className="text-gray-500 mt-2">{amenity.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Amenities;