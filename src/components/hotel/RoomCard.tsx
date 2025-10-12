import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const RoomCard = ({ room, onSelectRoom }) => {
  const imageUrl = room.details?.images?.[0] || `https://placehold.co/600x400?text=${room.name.replace(' ', '+')}`;

  return (
    <Card 
      className="cursor-pointer hover:shadow-lg transition-shadow overflow-hidden"
      onClick={() => onSelectRoom(room)}
    >
      <CardHeader className="p-0">
        <img 
          src={imageUrl} 
          alt={room.name} 
          className="object-cover h-48 w-full"
        />
      </CardHeader>
      <CardContent className="p-4">
        <CardTitle className="text-lg">{room.name}</CardTitle>
        {room.special_name && <Badge variant="secondary" className="mt-2">{room.special_name}</Badge>}
        <p className="text-sm text-gray-600 mt-2 line-clamp-2 h-10">
          {room.details?.description || 'Clique para ver mais detalhes.'}
        </p>
      </CardContent>
    </Card>
  );
};

export default RoomCard;