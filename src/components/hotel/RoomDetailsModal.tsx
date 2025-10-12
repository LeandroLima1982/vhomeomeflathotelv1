"use client";

import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { X, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { RoomBookingForm } from "./RoomBookingForm";

interface RoomDetailsModalProps {
  room: any;
  onClose: () => void;
}

const RoomDetailsModal: React.FC<RoomDetailsModalProps> = ({ room, onClose }) => {
  const [images, setImages] = useState<string[]>([]);
  const [loadingImages, setLoadingImages] = useState(true);

  useEffect(() => {
    if (room) {
      const fetchImages = async () => {
        setLoadingImages(true);
        const folder = `rooms/${room.id}/gallery`;
        const { data: files, error } = await supabase.storage.from('gallery').list(folder, {
          limit: 100,
          offset: 0,
          sortBy: { column: 'created_at', order: 'desc' },
        });

        if (error) {
          console.error("Erro ao carregar imagens:", error);
          setImages([]);
        } else {
          const imageFiles = files.filter(file => file.name !== '.emptyFolderPlaceholder' && file.name !== '_order.json');
          const imageUrls = imageFiles.map(file => {
            const { data: { publicUrl } } = supabase.storage.from('gallery').getPublicUrl(`${folder}/${file.name}`);
            return publicUrl;
          });
          setImages(imageUrls);
        }
        setLoadingImages(false);
      };

      fetchImages();
    }
  }, [room]);

  const renderDetails = (details: Record<string, string | null>) => {
    return Object.entries(details)
      .filter(([key, value]) => value && key !== 'description')
      .map(([key, value]) => (
        <Badge key={key} variant="secondary" className="font-normal">
          {value}
        </Badge>
      ));
  };

  if (!room) return null;

  return (
    <Dialog open={!!room} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="max-w-full sm:max-w-4xl md:max-w-6xl h-[90vh] flex flex-col p-0 overflow-hidden">
        <DialogHeader className="p-4 pb-2 border-b flex-shrink-0">
          <div className="flex justify-between items-start">
            <div>
              <DialogTitle className="text-lg sm:text-xl font-bold">{room.name}</DialogTitle>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto p-4">
          <Tabs defaultValue="details" className="w-full h-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="details">Detalhes</TabsTrigger>
              <TabsTrigger value="booking">Reservar</TabsTrigger>
            </TabsList>
            <TabsContent value="details" className="mt-4 h-full">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-full">
                <div className="flex flex-col">
                  {loadingImages ? (
                    <div className="flex justify-center items-center h-48">
                      <Loader2 className="h-8 w-8 animate-spin" />
                    </div>
                  ) : images.length > 0 ? (
                    <Carousel className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg mx-auto">
                      <CarouselContent>
                        {images.map((image, index) => (
                          <CarouselItem key={index}>
                            <img
                              src={image}
                              alt={`Imagem ${index + 1}`}
                              className="w-full h-48 sm:h-64 md:h-80 object-cover rounded-md"
                            />
                          </CarouselItem>
                        ))}
                      </CarouselContent>
                      <CarouselPrevious />
                      <CarouselNext />
                    </Carousel>
                  ) : (
                    <p className="text-center text-gray-500">Nenhuma imagem disponível.</p>
                  )}
                </div>
                <div className="flex flex-col space-y-4">
                  <div>
                    <h3 className="text-xl font-semibold">{room.name}</h3>
                    {room.special_name && (
                      <p className="text-sm text-blue-800 font-medium">{room.special_name}</p>
                    )}
                    <p className="text-sm mt-2">{room.description}</p>
                  </div>
                  <div>
                    <h4 className="text-md font-semibold mb-2">Diferenciais</h4>
                    <div className="flex flex-wrap gap-2">
                      {renderDetails(room.details)}
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="booking" className="mt-4 h-full">
              <RoomBookingForm roomId={room.id} onCancel={() => {}} />
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RoomDetailsModal;