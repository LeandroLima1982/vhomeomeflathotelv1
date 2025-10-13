"use client";

import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { X, MapPin, Users, Wifi, Car, Coffee, Dumbbell, Waves, Star, Calendar, Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import { Skeleton } from '@/components/ui/skeleton';

interface RoomDetailsModalProps {
  room: any;
  isOpen: boolean;
  onClose: () => void;
}

const RoomDetailsModal: React.FC<RoomDetailsModalProps> = ({ room, isOpen, onClose }) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [images, setImages] = useState<string[]>([]);
  const [loadingImages, setLoadingImages] = useState(false);

  useEffect(() => {
    if (isOpen && room) {
      fetchRoomImages();
    }
  }, [isOpen, room]);

  const fetchRoomImages = async () => {
    if (!room) return;
    setLoadingImages(true);
    const folder = `rooms/${room.id}/gallery`;
    const { data: files, error } = await supabase.storage.from('gallery').list(folder, {
      limit: 100,
      sortBy: { column: 'created_at', order: 'desc' },
    });

    if (error) {
      console.error("Error fetching room images:", error);
      setImages([]);
    } else {
      const imageFiles = files.filter(file => file.name !== '.emptyFolderPlaceholder' && file.name !== '_order.json');
      const imageUrls = imageFiles.map(file => ({
        name: file.name,
        url: supabase.storage.from('gallery').getPublicUrl(`${folder}/${file.name}`).data.publicUrl,
      }));

      // Check for order file
      const { data: orderFileData } = await supabase.storage.from('gallery').download(`${folder}/_order.json`);
      if (orderFileData) {
        try {
          const orderJson = await orderFileData.text();
          const orderedNames = JSON.parse(orderJson) as string[];
          const imageMap = new Map(imageUrls.map(img => [img.name, img.url]));
          const sortedUrls = orderedNames.map(name => imageMap.get(name)).filter((url): url is string => !!url);
          const newUrls = imageUrls.filter(img => !orderedNames.includes(img.name)).map(img => img.url);
          setImages([...sortedUrls, ...newUrls]);
        } catch (e) {
          console.error("Error parsing order file, using default order", e);
          setImages(imageUrls.map(img => img.url));
        }
      } else {
        setImages(imageUrls.map(img => img.url));
      }
    }
    setLoadingImages(false);
  };

  const nextImage = () => {
    setSelectedImage((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setSelectedImage((prev) => (prev - 1 + images.length) % images.length);
  };

  if (!room) return null;

  const features = room.additional_features ? room.additional_features.flatMap((cat: any) => cat.items.map((item: any) => item.text)) : [];

  const featureIcons: { [key: string]: React.ComponentType<any> } = {
    wifi: Wifi,
    parking: Car,
    breakfast: Coffee,
    gym: Dumbbell,
    pool: Waves,
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] sm:max-w-[90vw] md:max-w-[1000px] max-h-[95vh] w-full mx-2 sm:mx-4 bg-white/95 backdrop-blur-sm border-0 shadow-2xl rounded-2xl overflow-hidden flex flex-col">
        <DialogHeader className="relative bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 px-4 sm:px-6 md:px-8 py-4 sm:py-6 md:py-8 border-b border-slate-200/50 flex-shrink-0 overflow-hidden">
          {/* Elementos decorativos simplificados para mobile */}
          <div className="hidden sm:block absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-blue-100/30 to-transparent rounded-full -translate-y-16 translate-x-16"></div>
          <div className="hidden sm:block absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-purple-100/30 to-transparent rounded-full translate-y-12 -translate-x-12"></div>

          <div className="relative z-10 flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <DialogTitle className="text-lg sm:text-xl md:text-2xl font-bold text-slate-800 mb-2 leading-tight">
                {room.name}
              </DialogTitle>
              {room.special_name && (
                <DialogDescription className="text-sm sm:text-base text-slate-600 mb-3">
                  {room.special_name}
                </DialogDescription>
              )}
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <Badge variant="secondary" className="text-xs sm:text-sm">
                  <MapPin className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                  Localização
                </Badge>
                <Badge variant="outline" className="text-xs sm:text-sm">
                  <Users className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                  Até {room.details?.capacity || 2} pessoas
                </Badge>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="ml-2 p-1 sm:p-2 hover:bg-slate-100 rounded-full"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </Button>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8">
          {/* Image gallery */}
          {loadingImages ? (
            <div className="mb-6">
              <Skeleton className="aspect-video w-full rounded-xl" />
            </div>
          ) : images.length > 0 ? (
            <div className="mb-6">
              <div className="relative aspect-video rounded-xl overflow-hidden mb-4">
                <img
                  src={images[selectedImage]}
                  alt={room.name}
                  className="w-full h-full object-cover"
                />
                {images.length > 1 && (
                  <>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={prevImage}
                      className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white"
                    >
                      <ChevronLeft className="h-6 w-6" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={nextImage}
                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white"
                    >
                      <ChevronRight className="h-6 w-6" />
                    </Button>
                  </>
                )}
              </div>
              {images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {images.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden border-2 ${
                        selectedImage === index ? 'border-blue-500' : 'border-slate-200'
                      }`}
                    >
                      <img src={img} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="mb-6">
              <div className="aspect-video rounded-xl bg-gray-200 flex items-center justify-center">
                <p className="text-gray-500">Nenhuma imagem disponível</p>
              </div>
            </div>
          )}

          {/* Description */}
          <div className="mb-6">
            <h3 className="text-lg sm:text-xl font-semibold text-slate-800 mb-3">Descrição</h3>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              {room.custom_description || room.description || 'Descrição não disponível.'}
            </p>
          </div>

          {/* Features */}
          {features.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg sm:text-xl font-semibold text-slate-800 mb-3">Comodidades</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {features.map((feature: string, index: number) => {
                  const IconComponent = featureIcons[feature.toLowerCase()] || Star;
                  return (
                    <div key={index} className="flex items-center gap-2 p-2 sm:p-3 bg-slate-50 rounded-lg">
                      <IconComponent className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                      <span className="text-xs sm:text-sm text-slate-700 capitalize">{feature}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Booking section */}
          {room.booking_url && (
            <div className="border-t border-slate-200 pt-6">
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div>
                  <h3 className="text-lg sm:text-xl font-semibold text-slate-800 mb-2">Reserve Agora</h3>
                  <p className="text-sm sm:text-base text-slate-600">
                    Garanta sua estadia com facilidade através do nosso sistema de reservas.
                  </p>
                </div>
                <Button asChild className="w-full sm:w-auto">
                  <a href={room.booking_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Reservar
                  </a>
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RoomDetailsModal;