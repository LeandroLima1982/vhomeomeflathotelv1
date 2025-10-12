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
import { BedDouble } from 'lucide-react';
import { RoomDetailsModal } from "./RoomDetailsModal";
import { RoomBookingForm } from "./RoomBookingForm";
import { cn } from "@/lib/utils";

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
    const fetchRoomsAndImages = async () => {
      setLoading(true);
      const { data: roomData, error: roomError } = await supabase.from('rooms').select('*').order('id');
      
      if (roomError) {
        console.error("Erro ao carregar dados das acomodações.", roomError);
        setLoading(false);
        return;
      }

      const { data: files, error: fileError } = await supabase.storage.from(BUCKET_NAME).list(FOLDER);

      if (fileError) {
        console.error("Erro ao carregar as imagens das acomodações.", fileError);
      }

      const imageMap = new Map(files?.map(file => {
        const fileNameWithoutExt = file.name.split('.')[0];
        const publicUrl = supabase.storage.from(BUCKET_NAME).getPublicUrl(`${FOLDER}/${file.name}`).data.publicUrl;
        return [fileNameWithoutExt, `${publicUrl}?t=${new Date().getTime()}`];
      }));

      const roomsWithImages = roomData.map(room => ({
        ...room,
        imageUrl: imageMap.get(String(room.id)) || null,
      }));

      setRooms(roomsWithImages);
      setLoading(false);
    };

    fetchRoomsAndImages();
  }, []);

  const renderDetails = (details: Record<string, string | null>) => {
    return Object.values(details)
      .filter(Boolean)
      .map((value, index) => (
        <Badge key={index} variant="secondary" className="font-normal">
          {value}
        </Badge>
      ));
  };

  return (
    <>
      <section id="rooms" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800">Nossas Acomodações</h2>
            <p className="text-lg text-gray-600 mt-2">
              Conforto e elegância em cada detalhe.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 [perspective:1000px]">
            {loading ? (
              Array.from({ length: 3 }).map((_, index) => (
                <Card key={index} className="flex flex-col min-h-[480px]">
                  <CardHeader className="p-0">
                    <Skeleton className="h-56 w-full" />
                  </CardHeader>
                  <CardContent className="p-6 flex-grow">
                    <Skeleton className="h-6 w-3/4 mb-4" />
                    <div className="flex flex-wrap gap-2">
                      <Skeleton className="h-6 w-20 rounded-full" />
                      <Skeleton className="h-6 w-24 rounded-full" />
                      <Skeleton className="h-6 w-16 rounded-full" />
                    </div>
                  </CardContent>
                  <CardFooter className="p-6 bg-gray-50 flex justify-between items-center">
                    <Skeleton className="h-10 w-1/3" />
                    <Skeleton className="h-10 w-1/3" />
                  </CardFooter>
                </Card>
              ))
            ) : (
              rooms.map((room) => (
                <div
                  key={room.id}
                  className={cn(
                    "relative w-full min-h-[480px] transition-transform duration-700 [transform-style:preserve-3d]",
                    flippedCardId === room.id && "[transform:rotateY(180deg)]"
                  )}
                >
                  {/* Card Front */}
                  <Card
                    className="absolute w-full h-full flex flex-col overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 [backface-visibility:hidden]"
                  >
                    <CardHeader className="p-0 relative">
                      {room.imageUrl ? (
                        <img
                          src={room.imageUrl}
                          alt={room.name}
                          className="w-full h-56 object-cover"
                        />
                      ) : (
                        <div className="w-full h-56 bg-gray-200 flex items-center justify-center">
                          <BedDouble className="h-12 w-12 text-gray-400" />
                        </div>
                      )}
                      {room.special_name && (
                        <Badge className="absolute bottom-4 left-4 bg-blue-800 text-white">{room.special_name}</Badge>
                      )}
                    </CardHeader>
                    <CardContent className="p-6 flex-grow">
                      <CardTitle className="text-xl font-semibold text-gray-800 mb-4">
                        {room.name}
                      </CardTitle>
                      <div className="flex flex-wrap gap-2">
                        {renderDetails(room.details)}
                      </div>
                    </CardContent>
                    <CardFooter className="p-6 bg-gray-50 flex justify-between items-center">
                      <Button 
                        variant="outline" 
                        onClick={() => setSelectedRoom(room)}
                      >
                        Detalhes
                      </Button>
                      <Button 
                        className="bg-blue-800 hover:bg-blue-900"
                        onClick={() => setFlippedCardId(room.id)}
                      >
                        Reservar Agora
                      </Button>
                    </CardFooter>
                  </Card>

                  {/* Card Back */}
                  <div className="absolute w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)]">
                    <Card className="w-full h-full">
                      <RoomBookingForm 
                        roomId={room.id} 
                        onCancel={() => setFlippedCardId(null)} 
                      />
                    </Card>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>
      <RoomDetailsModal room={selectedRoom} onClose={() => setSelectedRoom(null)} />
    </>
  );
}