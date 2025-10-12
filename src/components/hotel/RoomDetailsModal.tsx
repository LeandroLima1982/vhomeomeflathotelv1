"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/lib/supabaseClient";
import { BedDouble, Wifi, Maximize, Tv, Wind, Bath, Eye, Check } from 'lucide-react';

interface Room {
  id: number;
  name: string;
  special_name: string | null;
  booking_url: string | null;
  details: Record<string, string | null>;
  imageUrl: string | null;
}

interface RoomDetailsModalProps {
  room: Room | null;
  onClose: () => void;
}

const iconMap: { [key: string]: React.ReactNode } = {
  size: <Maximize className="h-4 w-4 mr-2 text-blue-800" />,
  view: <Eye className="h-4 w-4 mr-2 text-blue-800" />,
  wifi: <Wifi className="h-4 w-4 mr-2 text-blue-800" />,
  tv: <Tv className="h-4 w-4 mr-2 text-blue-800" />,
  ac: <Wind className="h-4 w-4 mr-2 text-blue-800" />,
  bathroom: <Bath className="h-4 w-4 mr-2 text-blue-800" />,
};

export function RoomDetailsModal({ room, onClose }: RoomDetailsModalProps) {
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [isLoadingImages, setIsLoadingImages] = useState(true);

  useEffect(() => {
    if (!room) return;

    const fetchGallery = async () => {
      setIsLoadingImages(true);
      const { data, error } = await supabase.storage.from('gallery').list(`rooms/${room.id}/gallery`);
      
      if (error || !data || data.length === 0) {
        // Se não houver galeria, usa a imagem de capa como fallback
        setGalleryImages(room.imageUrl ? [room.imageUrl] : []);
      } else {
        const urls = data
          .filter(file => file.name !== '_order.json')
          .map(file => 
            supabase.storage.from('gallery').getPublicUrl(`rooms/${room.id}/gallery/${file.name}`).data.publicUrl
          );
        setGalleryImages(urls);
      }
      setIsLoadingImages(false);
    };

    fetchGallery();
  }, [room]);

  if (!room) return null;

  return (
    <Dialog open={!!room} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="max-w-4xl p-0" style={{ height: '90vh', display: 'flex', flexDirection: 'column' }}>
        <div className="grid md:grid-cols-2 flex-grow overflow-hidden">
          <div className="p-4 flex items-center justify-center bg-gray-100 h-full">
            {isLoadingImages ? (
              <Skeleton className="w-full h-full" />
            ) : (
              <Carousel className="w-full max-w-md">
                <CarouselContent>
                  {galleryImages.length > 0 ? galleryImages.map((url, index) => (
                    <CarouselItem key={index}>
                      <img src={url} alt={`${room.name} - Imagem ${index + 1}`} className="w-full h-auto object-contain max-h-[80vh] rounded-lg" />
                    </CarouselItem>
                  )) : (
                    <CarouselItem>
                       <div className="w-full h-96 bg-gray-200 flex items-center justify-center rounded-lg">
                        <BedDouble className="h-16 w-16 text-gray-400" />
                      </div>
                    </CarouselItem>
                  )}
                </CarouselContent>
                {galleryImages.length > 1 && (
                  <>
                    <CarouselPrevious className="absolute left-2" />
                    <CarouselNext className="absolute right-2" />
                  </>
                )}
              </Carousel>
            )}
          </div>
          <div className="p-6 flex flex-col overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-gray-800 mb-4">{room.name}</DialogTitle>
            </DialogHeader>
            
            <div className="flex-grow space-y-6">
                <div>
                    <h3 className="font-semibold text-lg mb-3 text-gray-700">Comodidades Principais</h3>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-gray-600">
                        {Object.entries(room.details).filter(([, value]) => value !== null).map(([key, value]) => (
                            <div key={key} className="flex items-center">
                                {iconMap[key] || <Check className="h-4 w-4 mr-2 text-blue-800" />}
                                <span>{value}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {room.details.kitchen && (
                  <div>
                      <h3 className="font-semibold text-lg mb-3 text-gray-700">Na sua cozinha privativa:</h3>
                      <ul className="grid grid-cols-2 gap-x-4 gap-y-1 text-gray-600">
                          {['Geladeira', 'Forno', 'Micro-ondas', 'Fogão', 'Utensílios de cozinha', 'Mesa de jantar'].map(item => (
                              <li key={item} className="flex items-center"><Check className="h-4 w-4 mr-2 text-green-600" />{item}</li>
                          ))}
                      </ul>
                  </div>
                )}

                <div>
                    <h3 className="font-semibold text-lg mb-3 text-gray-700">No seu banheiro privativo:</h3>
                    <ul className="grid grid-cols-2 gap-x-4 gap-y-1 text-gray-600">
                        {['Produtos de higiene', 'Toalhas', 'Chuveiro', 'Secador de cabelo', 'Vaso sanitário', 'Papel higiênico'].map(item => (
                            <li key={item} className="flex items-center"><Check className="h-4 w-4 mr-2 text-green-600" />{item}</li>
                        ))}
                    </ul>
                </div>
            </div>

            <DialogFooter className="mt-6 pt-6 border-t sm:justify-between">
              <a href={room.booking_url || '#'} target="_blank" rel="noopener noreferrer">
                <Button className="w-full sm:w-auto bg-blue-800 hover:bg-blue-900">Reservar Agora</Button>
              </a>
              <Button variant="outline" onClick={onClose} className="w-full sm:w-auto mt-2 sm:mt-0">Fechar</Button>
            </DialogFooter>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}