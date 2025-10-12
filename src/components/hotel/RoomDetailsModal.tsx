"use client";

import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { X, Loader2, Star } from "lucide-react";
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
        <Badge key={key} variant="secondary" className="font-normal bg-blue-100 text-blue-800 hover:bg-blue-200 transition-colors">
          {value}
        </Badge>
      ));
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-5 w-5 ${i < rating ? 'text-yellow-500 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  if (!room) return null;

  return (
    <Dialog open={!!room} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="max-w-full sm:max-w-5xl lg:max-w-7xl h-[95vh] flex flex-col p-0 overflow-hidden bg-white shadow-2xl rounded-2xl">
        <DialogHeader className="p-6 pb-4 border-b border-gray-100 flex-shrink-0 bg-gradient-to-r from-blue-50 to-white">
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <DialogTitle className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight">{room.name}</DialogTitle>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  {renderStars(4)}
                  <span className="text-sm font-medium text-gray-600 ml-2">4 Estrelas</span>
                </div>
                {room.special_name && (
                  <div className="flex items-center gap-2">
                    <Star className="h-5 w-5 text-yellow-500 fill-current" />
                    <span className="text-sm font-medium text-blue-700 bg-blue-50 px-3 py-1 rounded-full">{room.special_name}</span>
                  </div>
                )}
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose} className="hover:bg-gray-100 rounded-full p-2">
              <X className="h-5 w-5" />
            </Button>
          </div>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto">
          <Tabs defaultValue="details" className="w-full h-full">
            <TabsList className="grid w-full grid-cols-2 mx-6 mt-4 bg-gray-100 rounded-lg p-1">
              <TabsTrigger value="details" className="rounded-md font-medium transition-all">Detalhes</TabsTrigger>
              <TabsTrigger value="booking" className="rounded-md font-medium transition-all">Reservar</TabsTrigger>
            </TabsList>
            <TabsContent value="details" className="mt-6 px-6 pb-6 h-full">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-full">
                <div className="lg:col-span-2 flex flex-col">
                  {loadingImages ? (
                    <div className="flex justify-center items-center h-64 lg:h-96 bg-gray-100 rounded-xl">
                      <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
                    </div>
                  ) : images.length > 0 ? (
                    <Carousel className="w-full">
                      <CarouselContent>
                        {images.map((image, index) => (
                          <CarouselItem key={index}>
                            <div className="relative h-64 lg:h-96 rounded-xl overflow-hidden shadow-lg">
                              <img
                                src={image}
                                alt={`Imagem ${index + 1} de ${room.name}`}
                                className="w-full h-full object-cover"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                            </div>
                          </CarouselItem>
                        ))}
                      </CarouselContent>
                      <CarouselPrevious className="left-4 bg-white/90 hover:bg-white shadow-lg" />
                      <CarouselNext className="right-4 bg-white/90 hover:bg-white shadow-lg" />
                    </Carousel>
                  ) : (
                    <div className="flex justify-center items-center h-64 lg:h-96 bg-gray-100 rounded-xl">
                      <p className="text-gray-500 font-medium">Nenhuma imagem disponível</p>
                    </div>
                  )}
                </div>
                <div className="lg:col-span-1 flex flex-col space-y-6">
                  <div className="bg-gray-50 p-6 rounded-xl shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Sobre esta acomodação</h3>
                    <p className="text-gray-700 leading-relaxed">{room.description}</p>
                  </div>
                  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h4 className="text-md font-semibold text-gray-900 mb-4">Diferenciais</h4>
                    <div className="flex flex-wrap gap-2">
                      {renderDetails(room.details)}
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="booking" className="mt-6 px-6 pb-6 h-full">
              <div className="max-w-md mx-auto">
                <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
                  <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">Faça sua reserva</h3>
                  <RoomBookingForm roomId={room.id} onCancel={() => {}} />
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RoomDetailsModal;