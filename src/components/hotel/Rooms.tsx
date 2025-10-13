"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { supabase } from '@/lib/supabaseClient';
import RoomDetailsModal from './RoomDetailsModal';
import { RoomBookingForm } from './RoomBookingForm';
import { MapPin, Users, Wifi, Car, Coffee, Dumbbell, Waves, Star } from 'lucide-react';

interface Room {
  id: number;
  name: string;
  special_name: string | null;
  booking_url: string | null;
  details: Record<string, string | null>;
  description: string | null;
  additional_features: any[] | null;
}

export function Rooms() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [flippedCardId, setFlippedCardId] = useState<number | null>(null);

  useEffect(() => {
    const fetchRooms = async () => {
      setLoading(true);
      const { data, error } = await supabase.from('rooms').select('*').order('id');
      if (error) {
        console.error('Error fetching rooms:', error);
      } else {
        setRooms(data as Room[]);
      }
      setLoading(false);
    };

    fetchRooms();
  }, []);

  const handleCloseModal = () => {
    setSelectedRoom(null);
  };

  const handleCancelBooking = () => {
    setFlippedCardId(null);
  };

  if (loading) {
    return (
      <section id="rooms" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800">Nossas Acomodações</h2>
            <p className="text-gray-600 mt-2">Descubra o conforto e a elegância das nossas suítes</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, index) => (
              <Card key={index} className="overflow-hidden">
                <Skeleton className="aspect-[4/3] w-full" />
                <CardContent className="p-6">
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-full mb-4" />
                  <Skeleton className="h-4 w-1/2" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <section id="rooms" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800">Nossas Acomodações</h2>
            <p className="text-gray-600 mt-2">Descubra o conforto e a elegância das nossas suítes</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {rooms.map((room) => (
              <div key={room.id} className="relative group">
                <div className={`transition-transform duration-700 transform-style-preserve-3d ${flippedCardId === room.id ? 'rotate-y-180' : ''}`}>
                  {/* Front of card */}
                  <Card className={`absolute inset-0 backface-hidden overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 ${flippedCardId === room.id ? 'invisible' : ''}`}>
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <img
                        src={room.details?.image || '/placeholder.svg'}
                        alt={room.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      {room.special_name && (
                        <Badge className="absolute top-4 left-4 bg-yellow-500 text-black">
                          {room.special_name}
                        </Badge>
                      )}
                    </div>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-xl font-semibold text-gray-800">{room.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                        {room.description || 'Descrição não disponível.'}
                      </p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {Object.entries(room.details || {}).slice(0, 3).map(([key, value]) => (
                          value && key !== 'image' && (
                            <Badge key={key} variant="secondary" className="text-xs">
                              {value}
                            </Badge>
                          )
                        ))}
                      </div>
                    </CardContent>
                    <CardFooter className="absolute bottom-0 left-0 right-0 p-6 bg-black/[.08] backdrop-blur-xl flex justify-between items-center transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out">
                      <Button
                        className="bg-white/[.08] border border-white/30 text-white hover:bg-white/20 backdrop-blur-sm"
                        onClick={() => setFlippedCardId(room.id)}
                      >
                        Ver Detalhes
                      </Button>
                      <Button 
                        className="bg-blue-800 hover:bg-blue-900"
                        onClick={() => setSelectedRoom(room)}
                      >
                        Reservar Agora
                      </Button>
                    </CardFooter>
                  </Card>

                  {/* Back of card - Booking form */}
                  <Card className={`absolute inset-0 backface-hidden rotate-y-180 overflow-hidden shadow-lg ${flippedCardId === room.id ? '' : 'invisible'}`}>
                    <RoomBookingForm roomId={room.id} onCancel={handleCancelBooking} />
                  </Card>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {selectedRoom && (
        <RoomDetailsModal
          room={selectedRoom}
          isOpen={!!selectedRoom}
          onClose={handleCloseModal}
        />
      )}
    </>
  );
}