import React from 'react';
import { Card, CardContent, CardTitle } from '@/components/ui/card'; // Assumindo import do shadcn/ui

const Rooms = ({ rooms }) => {
  const renderDetails = (details) => {
    // Assumindo implementação existente
    return details.map((detail, index) => (
      <span key={index} className="text-xs bg-gray-100 px-2 py-1 rounded">
        {detail}
      </span>
    ));
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {rooms.map((room) => (
        <Card key={room.id} className="shadow-md">
          <CardContent className="p-4">
            <CardTitle className="text-xl font-semibold text-gray-800 mb-2">
              <span className="inline-block bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full mr-2">
                {room.special_name}
              </span>
              {room.name}
            </CardTitle>
            <div className="flex flex-wrap gap-2 mt-auto">
              {renderDetails(room.details)}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default Rooms;