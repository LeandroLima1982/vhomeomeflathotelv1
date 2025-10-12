"use client";

import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import FeatureListDisplay, { FeatureCategory } from './FeatureListDisplay';
import { supabase } from '@/lib/supabaseClient';
import { Loader2, Calendar, Info, Star } from 'lucide-react';
import { RoomBookingForm } from './RoomBookingForm';

interface Room {
  id: number;
  name: string;
  description: string | null;
  details: Record<string, string | null>;
  additional_features: FeatureCategory[] | null;
}

interface RoomDetailsModalProps {
  room: Room | null;
  onClose: () => void;
}

const RoomDetailsModal: React.FC<RoomDetailsModalProps> = ({ room, onClose }) => {
  const [roomImages, setRoomImages] = useState<string[]>([]);
  const [loadingImages, setLoadingImages] = useState(true);

  useEffect(() => {
    if (room) {
      const fetchRoomImages = async () => {
        setLoadingImages(true);
        const folderPath = `rooms/${room.id}/gallery`;
        const { data: files, error } = await supabase.storage.from('gallery').list(folderPath);

        if (error) {
          console.error("Error fetching room images:", error);
          setRoomImages([]);
        } else {
          const imageUrls = files
            .filter(file => file.name !== '.emptyFolderPlaceholder' && file.name !== '_order.json')
            .map(file => supabase.storage.from('gallery').getPublicUrl(`${folderPath}/${file.name}`).data.publicUrl);

          const { data: orderFileData } = await supabase.storage.from('gallery').download(`${folderPath}/_order.json`);
          if (orderFileData) {
            try {
              const orderJson = await orderFileData.text();
              const orderedNames = JSON.parse(orderJson) as string[];
              const imageMap = new Map(imageUrls.map(url => [url.split('/').pop(), url]));
              const sortedUrls = orderedNames.map(name => imageMap.get(name)).filter((url): url is string => !!url);
              const newImageUrls = imageUrls.filter(url => !orderedNames.includes(url.split('/').pop() || ''));
              setRoomImages([...sortedUrls, ...newImageUrls]);
            } catch (e) {
              console.error("Error parsing room gallery order file, using default order", e);
              setRoomImages(imageUrls);
            }
          } else {
            setRoomImages(imageUrls);
          }
        }
        setLoadingImages(false);
      };
      fetchRoomImages();
    }
  }, [room]);

  if (!room) return null;

  const roomAmenities = Object.entries(room.details)
    .filter(([key, value]) => value && value.trim() !== '' && key !== 'description')
    .map(([, value]) => value as string);

  return (
    <Dialog open={!!room} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[1000px] max-h-[95vh] w-full mx-4 bg-white/95 backdrop-blur-sm border-0 shadow-2xl rounded-2xl overflow-hidden">
        <DialogHeader className="bg-gradient-to-r from-slate-50 to-slate-100 px-8 py-6 border-b border-slate-200">
          <DialogTitle className="text-3xl font-bold text-slate-800 flex items-center gap-3">
            <Star className="h-6 w-6 text-amber-500" />
            {room.name}
          </DialogTitle>
          <DialogDescription className="text-slate-600 text-lg mt-2">
            Descubra o conforto e reserve sua experiência única
          </DialogDescription>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto px-8 py-6">
          <Tabs defaultValue="details" className="w-full h-full">
            <TabsList className="grid w-full grid-cols-2 bg-slate-100 rounded-xl p-1 mb-6 shadow-inner">
              <TabsTrigger value="details" className="rounded-lg font-semibold transition-all flex items-center gap-2 py-3 text-slate-700 hover:bg-white hover:shadow-md">
                <Info className="h-5 w-5" />
                Detalhes
              </TabsTrigger>
              <TabsTrigger value="book" className="rounded-lg font-semibold transition-all flex items-center gap-2 py-3 text-slate-700 hover:bg-white hover:shadow-md">
                <Calendar className="h-5 w-5" />
                Reservar
              </TabsTrigger>
            </TabsList>
            <TabsContent value="details" className="space-y-8 mt-0">
              <div className="flex flex-col lg:flex-row gap-8">
                {/* Carrossel de Imagens */}
                <div className="lg:w-1/2">
                  {loadingImages ? (
                    <div className="flex justify-center items-center h-64 bg-slate-50 rounded-xl shadow-sm">
                      <Loader2 className="h-8 w-8 animate-spin text-slate-500" />
                      <p className="ml-3 text-slate-600 font-medium">Carregando imagens...</p>
                    </div>
                  ) : roomImages.length > 0 ? (
                    <div className="space-y-3">
                      <Carousel className="w-full max-w-md mx-auto lg:mx-0">
                        <CarouselContent>
                          {roomImages.map((image, index) => (
                            <CarouselItem key={index}>
                              <div className="p-2">
                                <div className="flex aspect-[4/3] items-center justify-center">
                                  <img
                                    src={image}
                                    alt={`Imagem do quarto ${index + 1}`}
                                    className="rounded-xl w-full h-full object-cover shadow-lg hover:shadow-xl transition-shadow duration-300"
                                  />
                                </div>
                              </div>
                            </CarouselItem>
                          ))}
                        </CarouselContent>
                        <CarouselPrevious className="left-2 bg-white/80 hover:bg-white shadow-md" />
                        <CarouselNext className="right-2 bg-white/80 hover:bg-white shadow-md" />
                      </Carousel>
                      <p className="text-center text-slate-500 text-sm font-medium">
                        {roomImages.length} imagem{roomImages.length !== 1 ? 's' : ''} disponível{roomImages.length !== 1 ? 's' : ''}
                      </p>
                    </div>
                  ) : (
                    <div className="text-center py-12 bg-slate-50 rounded-xl shadow-sm">
                      <p className="text-slate-500 font-medium">Nenhuma imagem disponível para esta acomodação.</p>
                      <p className="text-sm text-slate-400 mt-2">Imagens serão adicionadas em breve.</p>
                    </div>
                  )}
                </div>

                {/* Conteúdo Textual */}
                <div className="lg:w-1/2 space-y-6">
                  <div className="bg-slate-50 rounded-xl p-6 shadow-sm">
                    <h3 className="text-2xl font-bold mb-4 text-slate-800">Sobre o Quarto</h3>
                    <p className="text-slate-700 leading-relaxed text-lg">{room.description}</p>
                  </div>

                  <div className="grid grid-cols-1 gap-6">
                    <div className="bg-slate-50 rounded-xl p-6 shadow-sm">
                      <h4 className="font-bold text-xl mb-4 text-slate-800">Características Principais</h4>
                      {roomAmenities.length > 0 ? (
                        <ul className="list-disc list-inside text-slate-700 space-y-2 text-lg">
                          {roomAmenities.map((amenity, index) => (
                            <li key={index} className="leading-relaxed">{amenity}</li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-slate-500 font-medium">Nenhuma característica específica listada.</p>
                      )}
                    </div>

                    <div className="bg-slate-50 rounded-xl p-6 shadow-sm">
                      <h4 className="font-bold text-xl mb-4 text-slate-800">Capacidade e Preços</h4>
                      <div className="space-y-3">
                        {room.details.capacity && (
                          <div className="flex justify-between items-center py-2 border-b border-slate-200 last:border-b-0">
                            <span className="text-slate-600 font-medium">Capacidade:</span>
                            <span className="font-bold text-slate-800">{room.details.capacity} pessoas</span>
                          </div>
                        )}
                        {room.details.beds && (
                          <div className="flex justify-between items-center py-2 border-b border-slate-200 last:border-b-0">
                            <span className="text-slate-600 font-medium">Camas:</span>
                            <span className="font-bold text-slate-800">{room.details.beds}</span>
                          </div>
                        )}
                        {room.details.price && (
                          <div className="flex justify-between items-center py-2 border-b border-slate-200 last:border-b-0">
                            <span className="text-slate-600 font-medium">Preço por noite:</span>
                            <span className="font-bold text-emerald-600 text-xl">R$ {parseFloat(room.details.price).toFixed(2)}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {room.additional_features && room.additional_features.length > 0 && (
                    <div className="bg-slate-50 rounded-xl p-6 shadow-sm">
                      <h4 className="font-bold text-xl mb-4 text-slate-800">Características Adicionais</h4>
                      <FeatureListDisplay features={room.additional_features} />
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>
            <TabsContent value="book" className="space-y-6 mt-0">
              <div className="bg-slate-50 rounded-xl p-8 shadow-sm">
                <h3 className="text-2xl font-bold text-slate-800 mb-4">Reserve sua Estadia</h3>
                <p className="text-slate-600 mb-6 text-lg">
                  Selecione as datas desejadas e confirme a disponibilidade para {room.name}.
                </p>
                <RoomBookingForm roomId={room.id} onCancel={() => {}} />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RoomDetailsModal;