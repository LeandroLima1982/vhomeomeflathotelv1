"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from '@/lib/supabaseClient';
import { Eye, Calendar, Users, Bed } from 'lucide-react';
import RoomDetailsModal from './RoomDetailsModal';

interface Room {
  id: number;
  name: string;
  description: string | null;
  details: Record<string, string | null>;
  additional_features: FeatureCategory[] | null;
  special_name?: string;
}

interface FeatureCategory {
  category: string;
  features: string[];
}

const Rooms: React.FC = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);

  useEffect(() => {
    const fetchRooms = async () => {
      setIsLoading(true);
      const { data, error } = await supabase.from('rooms').select('*');

      if (error) {
        console.error('Error fetching rooms:', error);
      } else {
        setRooms(data || []);
      }
      setIsLoading(false);
    };

    fetchRooms();
  }, []);

  const handleViewDetails = (room: Room) => {
    setSelectedRoom(room);
  };

  const handleCloseModal = () => {
    setSelectedRoom(null);
  };

  return (
    <section className="py-12 sm:py-16 md:py-20 bg-gradient-to-b from-slate-50 to-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 sm:mb-12 md:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-light text-slate-800 mb-4 tracking-wide">
            Nossas Acomodações
          </h2>
          <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Descubra quartos projetados para oferecer conforto, elegância e uma experiência inesquecível.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 md:gap-10">
          {isLoading
            ? Array.from({ length: 6 }).map((_, index) => (
                <Skeleton key={index} className="h-96 w-full rounded-2xl" />
              ))
            : rooms.map((room) => (
                <Card key={room.id} className="group bg-white border-0 shadow-lg hover:shadow-2xl transition-all duration-300 rounded-2xl overflow-hidden hover:-translate-y-1">
                  <CardHeader className="p-6 sm:p-8">
                    <div className="flex items-start justify-between mb-4">
                      <CardTitle className="text-xl sm:text-2xl font-semibold text-slate-800 group-hover:text-blue-600 transition-colors">
                        {room.name}
                      </CardTitle>
                      {room.special_name && (
                        <Badge className="bg-gradient-to-r from-blue-500 to-purple-500 text-white border-0 rounded-full px-3 py-1 text-xs font-semibold shadow-md">
                          {room.special_name}
                        </Badge>
                      )}
                    </div>
                    <CardDescription className="text-slate-600 text-sm sm:text-base leading-relaxed line-clamp-3">
                      {room.description}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="px-6 sm:px-8 pb-4">
                    <div className="space-y-3 sm:space-y-4">
                      {room.details.capacity && (
                        <div className="flex items-center gap-3 text-slate-700">
                          <Users className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500" />
                          <span className="text-sm sm:text-base font-medium">Capacidade: {room.details.capacity} pessoas</span>
                        </div>
                      )}
                      {room.details.beds && (
                        <div className="flex items-center gap-3 text-slate-700">
                          <Bed className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500" />
                          <span className="text-sm sm:text-base font-medium">{room.details.beds}</span>
                        </div>
                      )}
                      {room.details.price && (
                        <div className="flex items-center gap-3 text-slate-700">
                          <span className="text-lg sm:text-xl font-bold text-emerald-600">
                            R$ {parseFloat(room.details.price).toFixed(2)} / noite
                          </span>
                        </div>
                      )}
                    </div>
                  </CardContent>

                  <CardFooter className="px-6 sm:px-8 pb-6 sm:pb-8 pt-0">
                    <Button
                      onClick={() => handleViewDetails(room)}
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 sm:py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2"
                    >
                      <Eye className="h-4 w-4 sm:h-5 sm:w-5" />
                      Ver Detalhes
                    </Button>
                  </CardFooter>
                </Card>
              ))}
        </div>

        <RoomDetailsModal room={selectedRoom} onClose={handleCloseModal} />
      </div>
    </section>
  );
};

export default Rooms;