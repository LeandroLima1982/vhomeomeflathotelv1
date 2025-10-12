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
import { roomsData } from "@/data/rooms";
import { BedDouble } from 'lucide-react';

type RoomWithImage = (typeof roomsData)[number] & {
  imageUrl: string | null;
};

const BUCKET_NAME = 'gallery';
const FOLDER = 'rooms';

export default function Rooms() {
  const [rooms, setRooms] = useState<RoomWithImage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRoomImages = async () => {
      setLoading(true);
      const { data: files, error } = await supabase.storage.from(BUCKET_NAME).list(FOLDER);

      if (error) {
        console.error("Erro ao carregar as imagens das acomodações.", error);
        const roomsWithNoImages = roomsData.map(room => ({ ...room, imageUrl: null }));
        setRooms(roomsWithNoImages);
        setLoading(false);
        return;
      }

      const imageMap = new Map(files?.map(file => {
        const fileNameWithoutExt = file.name.split('.')[0];
        const publicUrl = supabase.storage.from(BUCKET_NAME).getPublicUrl(`${FOLDER}/${file.name}`).data.publicUrl;
        return [fileNameWithoutExt, `${publicUrl}?t=${new Date().getTime()}`];
      }));

      const roomsWithImages = roomsData.map(room => ({
        ...room,
        imageUrl: imageMap.get(String(room.id)) || null,
      }));

      setRooms(roomsWithImages);
      setLoading(false);
    };

    fetchRoomImages();
  }, []);

  const renderDetails = (details: (typeof roomsData)[number]['details']) => {
    return Object.values(details)
      .filter(Boolean)
      .map((value, index) => (
        <Badge key={index} variant="secondary" className="font-normal">
          {value}
        </Badge>
      ));
  };

  return (
    <section id="rooms" className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-800">Nossas Acomodações</h2>
          <p className="text-lg text-gray-600 mt-2">
            Conforto e elegância em cada detalhe.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading ? (
            Array.from({ length: 3 }).map((_, index) => (
              <Card key={index} className="flex flex-col">
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
                <CardFooter className="p-6 bg-gray-50 flex justify-end items-center">
                  <Skeleton className="h-10 w-1/3" />
                </CardFooter>
              </Card>
            ))
          ) : (
            rooms.map((room) => (
              <Card
                key={room.id}
                className="group flex flex-col overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300"
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
                  {room.specialName && (
                    <Badge className="absolute bottom-4 left-4 bg-blue-800 text-white">{room.specialName}</Badge>
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
                <CardFooter className="p-6 bg-gray-50 flex justify-end items-center">
                  <a href={room.url} target="_blank" rel="noopener noreferrer">
                    <Button className="bg-blue-800 hover:bg-blue-900 opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-x-0 translate-x-4">
                      Reservar Agora
                    </Button>
                  </a>
                </CardFooter>
              </Card>
            ))
          )}
        </div>
      </div>
    </section>
  );
}