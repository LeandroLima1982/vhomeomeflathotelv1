import React from 'react';
import { Card, CardContent, CardTitle } from '@/components/ui/card';

const Rooms = ({ rooms }) => {
  const renderDetails = (details) => {
    if (!details || typeof details !== 'object' || Array.isArray(details)) {
      return null;
    }
    return Object.entries(details)
      .filter(([key, value]) => value !== null && value !== undefined && key !== 'description')
      .map(([key, value]) => (
        <span key={key} className="text-xs bg-gray-100 px-2 py-1 rounded mr-1 mb-1">
          {String(value)}
        </span>
      ));
  };

  if (!rooms || !Array.isArray(rooms)) {
    return <div>Nenhuma acomodação disponível.</div>;
  }

  return (
    <section id="rooms" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800">Nossas Acomodações</h2>
          <p className="text-gray-600 mt-2">Escolha a acomodação perfeita para sua estadia</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {rooms.map((room) => (
            <Card key={room.id} className="shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
              <CardContent className="p-6">
                <CardTitle className="text-xl font-semibold text-gray-800 mb-2">
                  {room.special_name} {room.name}
                </CardTitle>
                {room.description && (
                  <p className="text-gray-600 mb-4 text-sm">{room.description}</p>
                )}
                <div className="flex flex-wrap gap-2 mt-auto">
                  {renderDetails(room.details)}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Rooms;