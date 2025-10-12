"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/lib/supabaseClient";
import RoomDetailsModal from "./RoomDetailsModal";
import { RoomBookingForm } from "./RoomBookingForm";
import { BedDouble, RefreshCw } from 'lucide-react';

interface Room {
  id: number;
  name: string;
  special_name: string | null;
  booking_url: string | null;
  details: Record<string, string | null>;
  imageUrl: string | null;
}

export function Rooms() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [flippedCardId, setFlippedCardId] = useState<number | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchRooms = async () => {
    setRefreshing(true);
    const { data, error } = await supabase.from("rooms").select("*").order('id');

    console.log('Dados brutos do banco:', data);

    if (error) {
      console.error("Erro ao carregar os quartos.", error);
      setRooms([]);
    } else {
      const { data: files, error: fileError } = await supabase.storage.from('gallery').list('rooms');

      if (fileError) {
          console.error("Erro ao carregar imagens das acomodações.", fileError);
      }

      const imageMap = new Map(files?.map(file => {
          const fileNameWithoutExt = file.name.split('.')[0];
          const publicUrl = supabase.storage.from('gallery').getPublicUrl(`rooms/${file.name}`).data.publicUrl;
          return [fileNameWithoutExt, publicUrl];
      }));

      const roomsWithImages = data.map(room => ({
        ...room,
        imageUrl: imageMap.get(String(room.id)) || null,
      }));
      
      setRooms(roomsWithImages);
      console.log('Acomodações carregadas:', roomsWithImages);
    }
    setIsLoading(false);
    setRefreshing(false);
  };

  useEffect(() => {
    fetchRooms();
    
    // Refresh data every 30 seconds to reflect admin changes
    const interval = setInterval(fetchRooms, 30000);
    return () => clearInterval(interval);
  }, []);

  const renderDetails = (details: Record<string, string | null>) => {
    console.log('Renderizando detalhes da acomodação:', details);
    const tagEntries = Object.entries(details)
      .filter(([key, value]) => key.startsWith('tag_') && value && value.trim() !== '')
      .map(([key, value]) => value as string);
    
    console.log('Tags encontradas:', tagEntries);
    
    return tagEntries.map((tag, index) => (
      <Badge key={index} variant="secondary" className="font-normal">
        {tag}
      </Badge>
    ));
  };

  const handleRefresh = () => {
    fetchRooms();
  };

  return (
    <section id="rooms" className="py-12 md:py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
            Nossas Acomodações
          </h2>
          <Button 
            onClick={handleRefresh} 
            disabled={refreshing}
            variant="outline"
            size="sm"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Atualizar
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {isLoading
            ? Array.from({ length: 6 }).map((_, index) => (
                <Skeleton key={index} className="h-96 w-full" />
              ))
            : rooms.map((room) => (
                <Card
                  key={room.id}
                  className="group flex flex-col overflow-hidden rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl"
                >
                  <div className="relative h-96 [transform-style:preserve-3d] transition-transform duration-500" style={{ transform: flippedCardId === room.id ? 'rotateY(180deg)' : 'rotateY(0deg)' }}>
                    {/* Front of the card */}
                    <div className="absolute w-full h-full [backface-visibility:hidden] flex flex-col">
                      <CardHeader className="relative p-0 h-56 overflow-hidden">
                        {room.imageUrl ? (
                          <img src={room.imageUrl} alt={room.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                            <BedDouble className="h-16 w-16 text-gray-400" />
                          </div>
                        )}
                        <CardFooter className="absolute bottom-0 left-0 right-0 p-6 bg-black/[.08] backdrop-blur-xl flex justify-between items-center transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out">
                          <Button
                            className="bg-white/[.08] border border-white/30 text-white hover:bg-white/20 backdrop-blur-sm"
                            onClick={() => setSelectedRoom(room)}
                          >
                            Ver Detalhes
                          </Button>
                          <Button 
                            className="bg-blue-800 hover:bg-blue-900"
                            onClick={() => setFlippedCardId(room.id)}
                          >
                            Reservar Agora
                          </Button>
                        </CardFooter>
                      </CardHeader>
                      <CardContent className="p-6 flex-grow flex flex-col">
                        <CardTitle className="text-xl font-semibold text-gray-800 mb-2">{room.name}</CardTitle>
                        <p className="text-sm text-blue-800 font-medium mb-4">{room.special_name}</p>
                        <div className="flex flex-wrap gap-2 mt-auto">
                          {renderDetails(room.details)}
                        </div>
                      </CardContent>
                    </div>
                    {/* Back of the card */}
                    <div className="absolute w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)]">
                      <RoomBookingForm roomId={room.id} onCancel={() => setFlippedCardId(null)} />
                    </div>
                  </div>
                </Card>
              ))}
        </div>
      </div>
      <RoomDetailsModal room={selectedRoom} onClose={() => setSelectedRoom(null)} />
    </section>
  );
}