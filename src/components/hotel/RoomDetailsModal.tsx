"use client";

import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Badge } from "@/components/ui/badge";
import FeatureListDisplay, { FeatureCategory } from './FeatureListDisplay';
import { supabase } from '@/lib/supabaseClient';
import { Loader2, Calendar, Info } from 'lucide-react';
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
      <DialogContent className="max-w-[95vw] sm:max-w-[90vw] md:max-w-[1000px] max-h-[95vh] w-full mx-2 sm:mx-4 bg-white/95 backdrop-blur-sm border-0 shadow-2xl rounded-2xl overflow-hidden flex flex-col">
        <DialogHeader className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 px-4 sm:px-6 md:px-8 py-4 sm:py-5 md:py-6 border-b border-slate-200 flex-shrink-0 flex items-center justify-center">
          <div className="text-center">
            <DialogTitle className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-800">
              {room.name}
            </DialogTitle>
            <DialogDescription className="text-slate-600 text-sm sm:text-base md:text-lg mt-1 sm:mt-2">
              Descubra o conforto e reserve sua experiência única
            </DialogDescription>
          </div>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 md:px-8 py-4 sm:py-5 md:py-6">
          <Tabs defaultValue="details" className="w-full h-full">
            <TabsList className="grid w-full grid-cols-2 bg-slate-100 rounded-xl p-1 mb-4 sm:mb-6 shadow-inner flex-shrink-0">
              <TabsTrigger value="details" className="rounded-lg font-semibold transition-all flex items-center gap-1 sm:gap-2 py-2 sm:py-3 text-xs sm:text-sm md:text-base text-slate-700 hover:bg-white hover:shadow-md">
                <Info className="h-4 w-4 sm:h-5 sm:w-5" />
                Detalhes
              </TabsTrigger>
              <TabsTrigger value="book" className="rounded-lg font-semibold transition-all flex items-center gap-1 sm:gap-2 py-2 sm:py-3 text-xs sm:text-sm md:text-base text-slate-700 hover:bg-white hover:shadow-md">
                <Calendar className="h-4 w-4 sm:h-5 sm:w-5" />
                Reservar
              </TabsTrigger>
            </TabsList>
            <TabsContent value="details" className="space-y-4 sm:space-y-6 md:space-y-8 mt-0">
              <div className="md:flex md:gap-8">
                {/* Carrossel de Imagens - Sticky à esquerda em telas médias e maiores */}
                <div className="w-full md:w-1/2 md:sticky md:top-0 md:self-start">
                  {loadingImages ? (
                    <div className="flex justify-center items-center h-48 sm:h-56 md:h-64 bg-slate-50 rounded-xl shadow-sm">
                      <Loader2 className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 animate-spin text-slate-500" />
                      <p className="ml-2 sm:ml-3 text-slate-600 font-medium text-sm sm:text-base">Carregando imagens...</p>
                    </div>
                  ) : roomImages.length > 0 ? (
                    <div className="space-y-2 sm:space-y-3">
                      <Carousel className="w-full max-w-[280px] sm:max-w-sm md:max-w-md mx-auto md:mx-0">
                        <CarouselContent>
                          {roomImages.map((image, index) => (
                            <CarouselItem key={index}>
                              <div className="p-1 sm:p-2">
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
                        <CarouselPrevious className="left-1 sm:left-2 bg-white/80 hover:bg-white shadow-md h-8 w-8 sm:h-9 sm:w-9" />
                        <CarouselNext className="right-1 sm:right-2 bg-white/80 hover:bg-white shadow-md h-8 w-8 sm:h-9 sm:w-9" />
                      </Carousel>
                      <p className="text-center text-slate-500 text-xs sm:text-sm font-medium">
                        {roomImages.length} imagem{roomImages.length !== 1 ? 's' : ''} disponível{roomImages.length !== 1 ? 's' : ''}
                      </p>
                    </div>
                  ) : (
                    <div className="text-center py-8 sm:py-10 md:py-12 bg-slate-50 rounded-xl shadow-sm">
                      <p className="text-slate-500 font-medium text-sm sm:text-base">Nenhuma imagem disponível para esta acomodação.</p>
                      <p className="text-xs sm:text-sm text-slate-400 mt-1 sm:mt-2">Imagens serão adicionadas em breve.</p>
                    </div>
                  )}
                </div>

                {/* Conteúdo Textual - Rola independentemente */}
                <div className="w-full md:w-1/2 space-y-4 sm:space-y-5 md:space-y-6">
                  <div className="bg-slate-50 rounded-xl p-4 sm:p-5 md:p-6 shadow-sm">
                    <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-3 sm:mb-4 text-slate-800 flex items-center justify-between">
                      <span>Sobre o Quarto</span>
                      {room.special_name && (
                        <Badge className="bg-gradient-to-r from-blue-500 to-purple-500 text-white border-0 rounded-full px-3 py-1 text-xs sm:text-sm font-semibold shadow-md">
                          {room.special_name}
                        </Badge>
                      )}
                    </h3>
                    <p className="text-slate-700 leading-relaxed text-sm sm:text-base md:text-lg">{room.description}</p>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:gap-5 md:gap-6">
                    <div className="bg-slate-50 rounded-xl p-4 sm:p-5 md:p-6 shadow-sm">
                      <h4 className="font-bold text-base sm:text-lg md:text-xl mb-3 sm:mb-4 text-slate-800">Características Principais</h4>
                      {roomAmenities.length > 0 ? (
                        <ul className="list-disc list-inside text-slate-700 space-y-1 sm:space-y-2 text-sm sm:text-base md:text-lg">
                          {roomAmenities.map((amenity, index) => (
                            <li key={index} className="leading-relaxed">{amenity}</li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-slate-500 font-medium text-sm sm:text-base">Nenhuma característica específica listada.</p>
                      )}
                    </div>

                    <div className="bg-slate-50 rounded-xl p-4 sm:p-5 md:p-6 shadow-sm">
                      <h4 className="font-bold text-base sm:text-lg md:text-xl mb-3 sm:mb-4 text-slate-800">Capacidade e Preços</h4>
                      <div className="space-y-2 sm:space-y-3">
                        {room.details.capacity && (
                          <div className="flex justify-between items-center py-1 sm:py-2 border-b border-slate-200 last:border-b-0">
                            <span className="text-slate-600 font-medium text-sm sm:text-base">Capacidade:</span>
                            <span className="font-bold text-slate-800 text-sm sm:text-base">{room.details.capacity} pessoas</span>
                          </div>
                        )}
                        {room.details.beds && (
                          <div className="flex justify-between items-center py-1 sm:py-2 border-b border-slate-200 last:border-b-0">
                            <span className="text-slate-600 font-medium text-sm sm:text-base">Camas:</span>
                            <span className="font-bold text-slate-800 text-sm sm:text-base">{room.details.beds}</span>
                          </div>
                        )}
                        {room.details.price && (
                          <div className="flex justify-between items-center py-1 sm:py-2 border-b border-slate-200 last:border-b-0">
                            <span className="text-slate-600 font-medium text-sm sm:text-base">Preço por noite:</span>
                            <span className="font-bold text-emerald-600 text-base sm:text-lg md:text-xl">R$ {parseFloat(room.details.price).toFixed(2)}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {room.additional_features && room.additional_features.length > 0 && (
                    <div className="bg-slate-50 rounded-xl p-4 sm:p-5 md:p-6 shadow-sm">
                      <h4 className="font-bold text-base sm:text-lg md:text-xl mb-3 sm:mb-4 text-slate-800">Características Adicionais</h4>
                      <FeatureListDisplay features={room.additional_features} />
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>
            <TabsContent value="book" className="space-y-4 sm:space-y-5 md:space-y-6 mt-0">
              <div className="bg-slate-50 rounded-xl p-4 sm:p-6 md:p-8 shadow-sm">
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-slate-800 mb-3 sm:mb-4">Reserve sua Estadia</h3>
                <p className="text-slate-600 mb-4 sm:mb-5 md:mb-6 text-sm sm:text-base md:text-lg">
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