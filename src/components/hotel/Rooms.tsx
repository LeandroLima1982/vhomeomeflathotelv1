import { useEffect, useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { roomsData } from "@/data/rooms";
import { supabase } from "@/lib/supabaseClient";
import { Skeleton } from "@/components/ui/skeleton";
import { Ruler, UtensilsCrossed, Bath, Eye, Wind, Tv, Wifi, Image as ImageIcon } from "lucide-react";

const BUCKET_NAME = 'gallery';
const FOLDER = 'rooms';

type Room = (typeof roomsData)[number] & {
  specialName?: string;
  imageUrl: string | null;
};

const detailIcons = {
  size: <Ruler className="h-4 w-4 text-blue-700" />,
  kitchen: <UtensilsCrossed className="h-4 w-4 text-blue-700" />,
  bathroom: <Bath className="h-4 w-4 text-blue-700" />,
  view: <Eye className="h-4 w-4 text-blue-700" />,
  ac: <Wind className="h-4 w-4 text-blue-700" />,
  tv: <Tv className="h-4 w-4 text-blue-700" />,
  wifi: <Wifi className="h-4 w-4 text-blue-700" />,
};

export function Rooms() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRoomImages = async () => {
      setLoading(true);
      const { data: files, error } = await supabase.storage.from(BUCKET_NAME).list(FOLDER);

      if (error) {
        console.error("Erro ao carregar as imagens das acomodações.", error);
        setLoading(false);
        setRooms(roomsData.map(room => ({ ...room, imageUrl: null })));
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

  return (
    <section id="rooms" className="py-12 md:py-20 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Nossas Acomodações</h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Conforto e sofisticação para uma estadia inesquecível.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading ? (
            Array.from({ length: 9 }).map((_, index) => (
              <Card key={index} className="flex flex-col">
                <Skeleton className="h-56 w-full" />
                <CardContent className="p-6 flex-grow">
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-full mb-4" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                </CardContent>
                <CardFooter className="p-6 pt-0">
                  <Skeleton className="h-10 w-full" />
                </CardFooter>
              </Card>
            ))
          ) : (
            rooms.map((room) => (
              <Card key={room.id} className="flex flex-col overflow-hidden group shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader className="p-0 overflow-hidden relative h-56">
                  {room.imageUrl ? (
                    <img 
                      src={room.imageUrl} 
                      alt={room.name} 
                      className="w-full h-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-105" 
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                      <ImageIcon className="h-12 w-12 text-gray-300" />
                    </div>
                  )}
                </CardHeader>
                <CardContent className="p-6 flex-grow flex flex-col">
                  <CardTitle className="mb-2 text-xl font-bold bg-gradient-to-r from-blue-900 to-blue-500 bg-clip-text text-transparent">
                    {room.specialName || room.name}
                  </CardTitle>
                  <p className="text-muted-foreground mb-4 flex-grow">{room.name}</p>
                  <ul className="space-y-2 text-sm text-gray-600">
                    {Object.entries(room.details).map(([key, value]) => {
                      if (!value) return null;
                      const icon = detailIcons[key as keyof typeof detailIcons];
                      return (
                        <li key={key} className="flex items-center gap-3">
                          {icon}
                          <span>{value}</span>
                        </li>
                      );
                    })}
                  </ul>
                </CardContent>
                <CardFooter className="p-6 pt-0">
                  <Button asChild className="w-full bg-gradient-to-r from-blue-900 to-blue-500 text-white hover:from-blue-800 hover:to-blue-600 transition-all duration-300">
                    <a href={room.url} target="_blank" rel="noopener noreferrer">Reservar Agora</a>
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