"use client";

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Users, Wifi, Coffee, Car, Dumbbell } from 'lucide-react';

interface Room {
  id: number;
  name: string;
  special_name?: string;
  booking_url?: string;
  details?: any;
  description?: string;
  custom_description?: string;
  additional_features?: any;
  details_order?: any;
  base_price?: number;
}

interface RoomsProps {
  rooms: Room[];
}

const Rooms: React.FC<RoomsProps> = ({ rooms }) => {
  const renderDetails = (room: Room) => {
    if (!room.details || !room.details_order || !Array.isArray(room.details_order)) return null;

    return room.details_order.map((key: string) => {
      const detail = room.details[key];
      if (!detail) return null;

      let icon = null;
      switch (key) {
        case 'capacity':
          icon = <Users className="w-4 h-4" />;
          break;
        case 'wifi':
          icon = <Wifi className="w-4 h-4" />;
          break;
        case 'breakfast':
          icon = <Coffee className="w-4 h-4" />;
          break;
        case 'parking':
          icon = <Car className="w-4 h-4" />;
          break;
        case 'gym':
          icon = <Dumbbell className="w-4 h-4" />;
          break;
        default:
          break;
      }

      return (
        <div key={key} className="flex items-center space-x-2">
          {icon}
          <span className="text-sm">{detail}</span>
        </div>
      );
    });
  };

  const renderAdditionalFeatures = (room: Room) => {
    if (!room.additional_features || typeof room.additional_features !== 'object') return null;

    // If it's an array (as per schema), render it properly
    if (Array.isArray(room.additional_features)) {
      return room.additional_features.map((category, index) => (
        <div key={index} className="mb-2">
          <span className="font-medium text-sm">{category.title}:</span>
          <div className="flex flex-wrap gap-1 mt-1">
            {category.items.map((item, itemIndex) => (
              <Badge key={itemIndex} variant="secondary" className="text-xs">
                {item.text}
              </Badge>
            ))}
          </div>
        </div>
      ));
    }

    // If it's an object, use the original logic
    return Object.entries(room.additional_features).map(([key, value]) => (
      <Badge key={key} variant="secondary" className="mr-2 mb-2">
        {key}: {String(value)}
      </Badge>
    ));
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {rooms.map((room) => (
        <Card key={room.id} className="group hover:shadow-lg transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>{room.name}</span>
              {room.base_price && (
                <span className="text-lg font-bold text-green-600">
                  R$ {room.base_price.toFixed(2)}
                </span>
              )}
            </CardTitle>
            {room.description && (
              <CardDescription>{room.description}</CardDescription>
            )}
          </CardHeader>
          <CardContent className="p-6 flex flex-row items-start space-x-4">
            {room.special_name && (
              <div className="inline-block mb-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-3 py-1 rounded-full text-sm font-semibold transition-all duration-300 group-hover:bg-yellow-500">
                {room.special_name}
              </div>
            )}
            <div className="flex-1">
              {room.custom_description && (
                <p className="text-sm text-gray-600 mb-4">{room.custom_description}</p>
              )}
              <div className="space-y-2 mb-4">
                {renderDetails(room)}
              </div>
              <div className="mb-4">
                {renderAdditionalFeatures(room)}
              </div>
              {room.booking_url && (
                <Button asChild className="w-full">
                  <a href={room.booking_url} target="_blank" rel="noopener noreferrer">
                    <Calendar className="w-4 h-4 mr-2" />
                    Reservar Agora
                  </a>
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default Rooms;