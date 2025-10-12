"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
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
import { RoomDetailsModal } from "./RoomDetailsModal";
import { RoomBookingForm } from "./RoomBookingForm";
import { BedDouble } from 'lucide-react';

interface Room {
  id: number;
  name: string;
  special_name: string | null;
  booking_url: string | null;
  details: Record<string, string | null>;
  imageUrl: string | null;
}

const BUCKET_NAME = 'gallery';
const FOLDER = 'rooms';

export default function Rooms() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [flippedCardId, setFlippedCardId] = useState<number | null>(null);

  useEffect(() => {
    const fetchRooms = async () => {
      setLoading(true);
      const { data: roomsData, error } = await supabase.from("rooms").select("*");

      if (error) {
        console.error("Erro ao carregar os quartos.", error);
        setRooms([]);
      } else {
        const roomsWithImages = await Promise.all(
          roomsData.map(async (room) => {
            const { data: files, error: listError } = await supabase.storage
              .from(BUCKET_NAME)
              .list(`${FOLDER}/${room.id}`, { limit: 1 });

            let imageUrl = null;
            if (!listError && files && files.length > 0) {
              const { data: urlData } = supabase.storage
                .from(BUCKET_NAME)
                .getPublicUrl(`${FOLDER}/${room.id}/${files[0].name}`);
              imageUrl = urlData.publicUrl;
            }
            return { ...room, imageUrl };
          })
        );
        setRooms(roomsWithImages);
      }
      setLoading(false);
    };

    fetchRooms();
  }, []);

  const handleFlip = (roomId: number) => {
    setFlippedCardId(prevId => (prevId === roomId ? null : roomId));
  };

  const renderDetails = (details: Record<string, string | null>) => {
    return Object.entries(details)
      .filter(([key, value]) => value && key !== 'description')
      .slice(0, 3)
      .map(([key, value]) => (
        <Badge key={key} variant="secondary" className="font-normal">
          {value}
        </Badge>
      ));
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="overflow-hidden">
            <Skeleton className="h-56 w-full" />
            <CardHeader>
              <Skeleton className="h-6 w-3/4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-1/2 mt-2" />
            </CardContent>
            <CardFooter>
              <Skeleton className="h-10 w-24" />
              <Skeleton className="h-10 w-24" />
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {rooms.map((room) => (
          <div key={room.id} className="perspective">
            <div
              className={`relative w-full h-full transition-transform duration-700 transform-style-preserve-3d ${
                flippedCardId === room.id ? "rotate-y-180" : ""
              }`}
              style={{ minHeight: '450px' }}
            >
              {/* Frente do Card */}
              <div className="absolute w-full h-full backface-hidden">
                <Card className={`w-full h-full flex flex-col overflow-hidden shadow-lg hover:shadow-xl transition-shadow ${selectedRoom?.id === room.id ? 'ring-2 ring-blue-800' : ''}`}>
                  <CardHeader className="p-0">
                    <div className="relative h-56">
                      {room.imageUrl ? (
                        <img
                          src={room.imageUrl}
                          alt={room.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                          <BedDouble className="h-16 w-16 text-gray-400" />
                        </div>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="p-6 flex-grow">
                    <CardTitle className="text-xl font-bold text-gray-800 mb-2">{room.name}</CardTitle>
                    <p className="text-gray-600 mb-4 h-12 overflow-hidden">
                      {room.details.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {renderDetails(room.details)}
                    </div>
                  </CardContent>
                  <CardFooter className="p-6 bg-gray-50 flex justify-between items-center">
                    <Button 
                      variant="outline" 
                      onClick={() => setSelectedRoom(room)}
                    >
                      Ver Detalhes
                    </Button>
                    <Button 
                      className="bg-blue-800 hover:bg-blue-900"
                      onClick={() => handleFlip(room.id)}
                    >
                      Reservar Agora
                    </Button>
                  </CardFooter>
                </Card>
              </div>

              {/* Verso do Card */}
              <div className="absolute w-full h-full backface-hidden rotate-y-180">
                <Card className="w-full h-full flex flex-col overflow-hidden shadow-lg">
                  <RoomBookingForm 
                    roomId={room.id} 
                    onCancel={() => handleFlip(room.id)} 
                  />
                </Card>
              </div>
            </div>
          </div>
        ))}
      </div>
      <RoomDetailsModal room={selectedRoom} onClose={() => setSelectedRoom(null)} />
    </>
  );
}