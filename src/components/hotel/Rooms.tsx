"use client";

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import Autoplay from 'embla-carousel-autoplay';

interface Room {
  id: number;
  name: string;
  special_name: string | null;
  booking_url: string | null;
  details: string[];
  description: string | null;
  custom_description: string | null;
  additional_features: string[];
}

const BUCKET_NAME = 'gallery';
const ORDER_FILE_NAME = '_order.json';

export default function Rooms() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [roomImages, setRoomImages] = useState<Record<number, string[]>>({});
  const [loading, setLoading] = useState(true);

  const plugin = React.useRef(
    Autoplay({ delay: 4000, stopOnInteraction: true })
  );

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    setLoading(true);
    
    if (!supabase) {
      console.error('Supabase client not available');
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from('rooms')
      .select('*')
      .order('id', { ascending: true });

    if (error) {
      console.error('Error fetching rooms:', error);
      setLoading(false);
      return;
    }

    const roomsData = data.map(room => ({
      ...room,
      details: Array.isArray(room.details) ? room.details : [],
      additional_features: Array.isArray(room.additional_features) ? room.additional_features : [],
    }));

    setRooms(roomsData);

    const imagesMap: Record<number, string[]> = {};
    for (const room of roomsData) {
      const images = await fetchRoomImages(room.id);
      imagesMap[room.id] = images;
    }
    setRoomImages(imagesMap);
    setLoading(false);
  };

  const fetchRoomImages = async (roomId: number): Promise<string[]> => {
    if (!supabase) return [];

    const folder = `room-${roomId}`;
    const { data: files, error: listError } = await supabase.storage
      .from(BUCKET_NAME)
      .list(folder, {
        limit: 100,
        offset: 0,
        sortBy: { column: 'created_at', order: 'desc' },
      });

    if (listError) {
      console.error(`Error fetching images for room ${roomId}:`, listError);
      return [];
    }

    const imageFiles = files.filter(
      file => file.name !== '.emptyFolderPlaceholder' && file.name !== ORDER_FILE_NAME
    );

    const imageUrls = imageFiles.map(file => ({
      name: file.name,
      url: supabase.storage.from(BUCKET_NAME).getPublicUrl(`${folder}/${file.name}`).data.publicUrl,
    }));

    const { data: orderFileData } = await supabase.storage
      .from(BUCKET_NAME)
      .download(`${folder}/${ORDER_FILE_NAME}`);

    if (!orderFileData) {
      return imageUrls.map(img => img.url);
    }

    const orderJson = await orderFileData.text();
    try {
      const orderedNames = JSON.parse(orderJson) as string[];
      const imageMap = new Map(imageUrls.map(img => [img.name, img.url]));
      const sortedUrls = orderedNames.map(name => imageMap.get(name)).filter((url): url is string => !!url);
      const newImageUrls = imageUrls.filter(img => !orderedNames.includes(img.name)).map(img => img.url);
      return [...sortedUrls, ...newImageUrls];
    } catch (e) {
      console.error("Error parsing order file, using default order", e);
      return imageUrls.map(img => img.url);
    }
  };

  if (loading) {
    return (
      <section id="rooms" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">Nossos Apartamentos</h2>
          <div className="text-center text-gray-500">Carregando apartamentos...</div>
        </div>
      </section>
    );
  }

  return (
    <section id="rooms" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-12">Nossos Apartamentos</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {rooms.map((room) => {
            const images = roomImages[room.id] || [];
            const details = room.details || [];
            const displayName = room.special_name || room.name;
            const description = room.custom_description || room.description || '';
            const additionalFeatures = room.additional_features || [];

            return (
              <Card key={room.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                {images.length > 0 ? (
                  <Carousel
                    plugins={[plugin.current]}
                    className="w-full"
                    onMouseEnter={plugin.current.stop}
                    onMouseLeave={plugin.current.reset}
                  >
                    <CarouselContent>
                      {images.map((src, index) => (
                        <CarouselItem key={index}>
                          <div className="relative h-64">
                            <img
                              src={src}
                              alt={`${displayName} - Imagem ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    <CarouselPrevious className="left-2" />
                    <CarouselNext className="right-2" />
                  </Carousel>
                ) : (
                  <div className="relative h-64">
                    <img
                      src="https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&q=80"
                      alt={displayName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <CardHeader>
                  <CardTitle>{displayName}</CardTitle>
                  {description && (
                    <CardDescription className="text-base">{description}</CardDescription>
                  )}
                </CardHeader>
                <CardContent>
                  {details.length > 0 && (
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-2 max-h-[4.5rem] overflow-hidden">
                        {details.slice(0, 8).map((detail, index) => (
                          <Badge 
                            key={index}
                            variant="secondary"
                            className="text-sm"
                          >
                            {detail}
                          </Badge>
                        ))}
                      </div>
                      {details.length > 8 && (
                        <p className="text-xs text-gray-500 mt-2">
                          +{details.length - 8} mais diferenciais
                        </p>
                      )}
                    </div>
                  )}
                  {additionalFeatures.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-2 text-sm">Recursos Adicionais:</h4>
                      <ul className="space-y-1">
                        {additionalFeatures.map((feature, index) => (
                          <li key={index} className="text-sm text-gray-600 flex items-start">
                            <span className="text-blue-600 mr-2">•</span>
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>
                {room.booking_url && (
                  <CardFooter>
                    <Button 
                      className="w-full" 
                      onClick={() => window.open(room.booking_url!, '_blank')}
                    >
                      Reservar Agora
                    </Button>
                  </CardFooter>
                )}
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}