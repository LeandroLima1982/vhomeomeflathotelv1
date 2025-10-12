"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchRooms } from "@/actions/fetchRooms";

interface Room {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  amenities: string[];
}

export default function Rooms() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getRooms = async () => {
      setLoading(true);
      const fetchedRooms = await fetchRooms();
      setRooms(fetchedRooms);
      setLoading(false);
    };
    getRooms();
  }, []);

  return (
    <section id="rooms" className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-800">Nossos Quartos</h2>
          <p className="text-lg text-gray-600 mt-2">
            Conforto e elegância em cada detalhe.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading ? (
            Array.from({ length: 3 }).map((_, index) => (
              <Card key={index} className="flex flex-col">
                <CardHeader>
                  <Skeleton className="h-48 w-full" />
                </CardHeader>
                <CardContent className="flex-grow">
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full mt-1" />
                </CardContent>
                <CardFooter className="flex justify-between items-center">
                  <Skeleton className="h-8 w-1/4" />
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
                  <img
                    src={room.image}
                    alt={room.name}
                    className="w-full h-48 object-cover"
                  />
                </CardHeader>
                <CardContent className="p-6 flex-grow">
                  <CardTitle className="text-2xl font-semibold text-gray-800 mb-2">
                    {room.name}
                  </CardTitle>
                  <CardDescription className="text-gray-600 mb-4">
                    {room.description}
                  </CardDescription>
                  <div className="flex flex-wrap gap-2">
                    {room.amenities.map((amenity) => (
                      <Badge key={amenity} variant="secondary">
                        {amenity}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="p-6 bg-gray-50 flex justify-between items-center">
                  <p className="text-xl font-bold text-blue-800">
                    R${room.price}
                    <span className="text-sm font-normal text-gray-600">/noite</span>
                  </p>
                  <Button className="bg-blue-800 hover:bg-blue-900 opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-x-0 translate-x-4">
                    Reservar Agora
                  </Button>
                </CardFooter>
              </Card>
            ))
          )}
        </div>
      </div>
    </section>
  );
}