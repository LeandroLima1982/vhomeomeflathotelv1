"use client";

import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import FeatureListDisplay, { FeatureCategory } from './FeatureListDisplay'; // Importando o novo componente e a interface FeatureCategory
import { supabase } from '@/lib/supabaseClient';
import { Loader2 } from 'lucide-react';

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
      <DialogContent className="sm:max-w-[800px] h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>{room.name}</DialogTitle>
          <DialogDescription>
            Detalhes e informações sobre o quarto.
          </DialogDescription>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto">
          <Tabs defaultValue="details" className="w-full h-full">
            <TabsList className="grid w-full grid-cols-2 mx-6 mt-4 bg-gray-100 rounded-lg p-1">
              <TabsTrigger value="details" className="rounded-md font-medium transition-all">Detalhes</TabsTrigger>
              <TabsTrigger value="photos" className="rounded-md font-medium transition-all">Fotos</TabsTrigger>
            </TabsList>
            <TabsContent value="details" className="p-6 pt-4">
              <h2 className="text-xl font-bold mb-4">Sobre o Quarto</h2>
              <p className="text-gray-700 mb-6">{room.description}</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {/* Exemplo de como você pode extrair e exibir detalhes específicos se eles existirem */}
                {room.details.capacity && (
                  <div className="flex items-center">
                    <span className="font-medium mr-2">Capacidade:</span>
                    <span>{room.details.capacity} pessoas</span>
                  </div>
                )}
                {room.details.beds && (
                  <div className="flex items-center">
                    <span className="font-medium mr-2">Camas:</span>
                    <span>{room.details.beds}</span>
                  </div>
                )}
                {room.details.bathrooms && (
                  <div className="flex items-center">
                    <span className="font-medium mr-2">Banheiros:</span>
                    <span>{room.details.bathrooms}</span>
                  </div>
                )}
                {room.details.price && (
                  <div className="flex items-center">
                    <span className="font-medium mr-2">Preço por noite:</span>
                    <span>R$ {parseFloat(room.details.price).toFixed(2)}</span>
                  </div>
                )}
              </div>

              {roomAmenities.length > 0 && (
                <>
                  <h3 className="text-lg font-bold mb-3">Comodidades:</h3>
                  <ul className="list-disc list-inside text-gray-700 mb-6 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-1">
                    {roomAmenities.map((amenity, index) => (
                      <li key={index}>{amenity}</li>
                    ))}
                  </ul>
                </>
              )}

              {/* Nova seção de descrição adicional */}
              {room.additional_features && room.additional_features.length > 0 && (
                <>
                  <h3 className="text-lg font-bold mb-3">Descrição Adicional:</h3>
                  <FeatureListDisplay features={room.additional_features} />
                </>
              )}
              {/* Fim da nova seção */}

            </TabsContent>
            <TabsContent value="photos" className="p-6 pt-4">
              {loadingImages ? (
                <div className="flex justify-center items-center h-full">
                  <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
                  <p className="ml-4">Carregando imagens...</p>
                </div>
              ) : roomImages.length > 0 ? (
                <Carousel className="w-full max-w-full mx-auto">
                  <CarouselContent>
                    {roomImages.map((image, index) => (
                      <CarouselItem key={index}>
                        <div className="p-1">
                          <div className="flex aspect-video items-center justify-center p-6">
                            <img
                              src={image}
                              alt={`Room image ${index + 1}`}
                              className="rounded-md w-full h-full object-cover"
                            />
                          </div>
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious />
                  <CarouselNext />
                </Carousel>
              ) : (
                <div className="text-center text-gray-500 py-10">Nenhuma imagem disponível para esta acomodação.</div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RoomDetailsModal;