"use client";

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from '@/components/ui/skeleton';
import { roomsData } from '@/data/rooms';

const BUCKET_NAME = 'gallery';
const FOLDER = 'rooms';

type Room = (typeof roomsData)[number] & {
  imageUrl: string | null;
};

export function Rooms() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRoomImages = async () => {
      setLoading(true);
      const { data: files } = await supabase.storage.from(BUCKET_NAME).list(FOLDER);
      const imageMap = new Map(files?.map(file => [file.name.split('.')[0], file.name]));

      const roomsWithImages = roomsData.map(room => {
        const imageName = imageMap.get(String(room.id));
        const imageUrl = imageName ? supabase.storage.from(BUCKET_NAME).getPublicUrl(`${FOLDER}/${imageName}`).data.publicUrl : null;
        return { ...room, imageUrl };
      });

      setRooms(roomsWithImages);
      setLoading(false);
    };

    fetchRoomImages();
  }, []);

  return (
    <section id="rooms" className="py-20 bg-gray-100">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800">Nossas Acomodações</h2>
          <p className="text-gray-600 mt-2">Escolha o quarto perfeito para a sua estadia</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading ? (
            Array.from({ length: 9 }).map((_, index) => (
              <Card key={index} className="flex flex-col">
                <Skeleton className="h-56 w-full" />
                <CardHeader>
                  <Skeleton className="h-6 w-3/4" />
                </CardHeader>
                <CardFooter>
                  <Skeleton className="h-10 w-full" />
                </CardFooter>
              </Card>
            ))
          ) : (
            rooms.map((room) => (
              <Card key={room.id} className="flex flex-col overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                <div className="h-56 bg-gray-200 flex items-center justify-center">
                  {room.imageUrl ? (
                    <img src={room.imageUrl} alt={room.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-gray-500">Imagem indisponível</span>
                  )}
                </div>
                <div className="flex flex-col flex-grow p-6">
                  <CardHeader className="p-0">
                    <CardTitle className="text-lg h-14">{room.name}</CardTitle>
                  </CardHeader>
                  <div className="flex-grow" />
                  <CardFooter className="p-0 mt-4">
                    <a href={room.url} target="_blank" rel="noopener noreferrer" className="w-full">
                      <Button className="w-full bg-blue-800 hover:bg-blue-900">Reservar Agora</Button>
                    </a>
                  </CardFooter>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </section>
  );
}