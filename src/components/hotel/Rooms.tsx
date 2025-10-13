import React from 'react';
import { BedDouble } from 'lucide-react';

const Rooms = ({ rooms }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {rooms.map((room) => (
        <div key={room.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
          <div className="h-64">
            {room.imageUrl ? (
              <img src={room.imageUrl} alt={room.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                <BedDouble className="h-16 w-16 text-gray-400" />
              </div>
            )}
          </div>
          <div className="p-6">
            <h3 className="text-xl font-semibold mb-2">{room.name}</h3>
            <p className="text-gray-600 leading-relaxed">{room.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Rooms;