"use client";

import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import FeatureListDisplay, { FeatureCategory } from './FeatureListDisplay'; // Importando o novo componente e a interface FeatureCategory
import { supabase } from '@/lib/supabaseClient';
import { Loader2, Calendar, Info, Image as ImageIcon } from 'lucide-react';
import { RoomBookingForm } from './RoomBookingForm';

interface Room {
  id: number;
  name: string;
  description: string | null;
  details: Record<string, string | null>;
  additional_features: FeatureCategory[] | null; // Nova propriedade
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
          
          // Optionally, fetch and apply order if you have an _order.json for room galleries
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
      <DialogContent className="sm:max-w-[900px] h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-800">{room.name}</DialogTitle>
          <DialogDescription className="text-gray-600">
            Explore os detalhes e reserve sua estadia perfeita
          </DialogDescription>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto">
          <Tabs defaultValue="details" className="w-full h-full">
            <TabsList className="grid w-full grid-cols-3 mx-6 mt-4 bg-gray-100 rounded-lg p-1">
              <TabsTrigger value="details" className="rounded-md font-medium transition-all flex items-center gap-2">
                <Info className="h-4 w-4" />
                Detalhes
              </TabsTrigger>
              <TabsTrigger value="gallery" className="rounded-md font-medium transition-all flex items-center gap-2">
                <ImageIcon className="h-4 w-4" />
                Galeria
              </TabsTrigger>
              <TabsTrigger value="book" className="rounded-md font-medium transition-all flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Agendar
              </TabsTrigger>
            </TabsList>
            <TabsContent value="details" className="p-6 pt-4">
              <div className="space-y-6">
                {/* Carrossel de Imagens */}
                {loadingImages ? (
                  <div className="flex justify-center items-center h-64 bg-gray-100 rounded-lg">
                    <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
                    <p className="ml-4">Carregando imagens...</p>
                  </div>
                ) : roomImages.length > 0 ? (
                  <div className="space-y-4">
                    <Carousel className="w-full max-w-full mx-auto">
                      <CarouselContent>
                        {roomImages.map((image, index) => (
                          <CarouselItem key={index}>
                            <div className="p-1">
                              <div className="flex aspect-video items-center justify-center p-6">
                                <img
                                  src={image}
                                  alt={`Imagem do quarto ${index + 1}`}
                                  className="rounded-lg w-full h-full object-cover shadow-lg"
                                />
                              </div>
                            </div>
                          </CarouselItem>
                        ))}
                      </CarouselContent>
                      <CarouselPrevious className="left-4" />
                      <CarouselNext className="right-4" />
                    </Carousel>
                    <p className="text-center text-gray-500 text-sm">
                      {roomImages.length} imagem{roomImages.length !== 1 ? 's' : ''} disponível{roomImages.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                ) : (
                  <div className="text-center py-12 bg-gray-100 rounded-lg">
                    <ImageIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">Nenhuma imagem disponível para esta acomodação.</p>
                    <p className="text-sm text-gray-400 mt-2">Imagens serão adicionadas em breve.</p>
                  </div>
                )}

                <div>
                  <h3 className="text-xl font-bold mb-4 text-gray-800">Sobre o Quarto</h3>
                  <p className="text-gray-700 mb-6 leading-relaxed">{room.description}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-lg mb-3 text-gray-800">Características Principais</h4>
                    {roomAmenities.length > 0 ? (
                      <ul className="list-disc list-inside text-gray-700 space-y-1">
                        {roomAmenities.map((amenity, index) => (
                          <li key={index}>{amenity}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-500">Nenhuma característica específica listada.</p>
                    )}
                  </div>

                  <div>
                    <h4 className="font-semibold text-lg mb-3 text-gray-800">Capacidade e Preços</h4>
                    <div className="space-y-2">
                      {room.details.capacity && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Capacidade:</span>
                          <span className="font-medium">{room.details.capacity} pessoas</span>
                        </div>
                      )}
                      {room.details.beds && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Camas:</span>
                          <span className="font-medium">{room.details.beds}</span>
                        </div>
                      )}
                      {room.details.price && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Preço por noite:</span>
                          <span className="font-medium text-green-600">R$ {parseFloat(room.details.price).toFixed(2)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {room.additional_features && room.additional_features.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-lg mb-3 text-gray-800">Características Adicionais</h4>
                    <FeatureListDisplay features={room.additional_features} />
                  </div>
                )}
              </div>
            </TabsContent>
            <TabsContent value="gallery" className="p-6 pt-4">
              <div className="text-center py-12">
                <ImageIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">A galeria completa está disponível na aba Detalhes.</p>
                <p className="text-sm text-gray-400 mt-2">Navegue para a aba Detalhes para ver todas as imagens.</p>
              </div>
            </TabsContent>
            <TabsContent value="book" className="p-6 pt-4">
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-gray-800">Reserve sua Estadia</h3>
                <p className="text-gray-600 mb-4">
                  Selecione as datas desejadas e verifique a disponibilidade para {room.name}.
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