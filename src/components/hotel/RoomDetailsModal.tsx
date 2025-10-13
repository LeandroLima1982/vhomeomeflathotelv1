"use client";

import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Users, 
  Bed, 
  Wifi, 
  Coffee, 
  Tv, 
  Wind, 
  Droplets,
  X,
  ExternalLink,
  Sparkles,
  Check,
  ChevronLeft,
  ChevronRight,
  Image as ImageIcon
} from 'lucide-react';
import FeatureListDisplay, { FeatureCategory } from './FeatureListDisplay';
import { supabase } from '@/lib/supabaseClient';

interface RoomDetailsModalProps {
  room: any;
  onClose: () => void;
}

const RoomDetailsModal = ({ room, onClose }: RoomDetailsModalProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [roomImages, setRoomImages] = useState<string[]>([]);
  const [loadingImages, setLoadingImages] = useState(true);

  useEffect(() => {
    const fetchRoomImages = async () => {
      if (!room?.id) return;

      setLoadingImages(true);
      const { data: files, error: listError } = await supabase.storage.from('gallery').list(`rooms/${room.id}/gallery`, {
        limit: 100,
        offset: 0,
        sortBy: { column: 'created_at', order: 'desc' },
      });

      if (listError) {
        console.error("Erro ao carregar imagens do quarto:", listError);
        setRoomImages([]);
        setLoadingImages(false);
        return;
      }

      const imageFiles = files.filter(file => file.name !== '.emptyFolderPlaceholder' && file.name !== '_order.json');
      const imageUrls = imageFiles.map(file => ({
        name: file.name,
        url: supabase.storage.from('gallery').getPublicUrl(`rooms/${room.id}/gallery/${file.name}`).data.publicUrl,
      }));

      const { data: orderFileData } = await supabase.storage.from('gallery').download(`rooms/${room.id}/gallery/_order.json`);

      if (!orderFileData) {
        setRoomImages(imageUrls.map(img => img.url).slice(0, 10));
      } else {
        const orderJson = await orderFileData.text();
        try {
          const orderedNames = JSON.parse(orderJson) as string[];
          const imageMap = new Map(imageUrls.map(img => [img.name, img.url]));
          const sortedUrls = orderedNames.map(name => imageMap.get(name)).filter((url): url is string => !!url);
          const newImageUrls = imageUrls.filter(img => !orderedNames.includes(img.name)).map(img => img.url);
          setRoomImages([...sortedUrls, ...newImageUrls].slice(0, 10));
        } catch (e) {
          console.error("Erro ao analisar arquivo de ordem das imagens:", e);
          setRoomImages(imageUrls.map(img => img.url).slice(0, 10));
        }
      }
      setLoadingImages(false);
    };

    if (room) {
      fetchRoomImages();
    }
  }, [room]);

  if (!room) return null;

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % roomImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + roomImages.length) % roomImages.length);
  };

  const getFeatureIcon = (feature: string) => {
    const lowerFeature = feature.toLowerCase();
    if (lowerFeature.includes('wifi') || lowerFeature.includes('internet')) return <Wifi className="w-4 h-4" />;
    if (lowerFeature.includes('café') || lowerFeature.includes('coffee')) return <Coffee className="w-4 h-4" />;
    if (lowerFeature.includes('tv')) return <Tv className="w-4 h-4" />;
    if (lowerFeature.includes('ar') || lowerFeature.includes('condicionado')) return <Wind className="w-4 h-4" />;
    if (lowerFeature.includes('banheiro') || lowerFeature.includes('banho')) return <Droplets className="w-4 h-4" />;
    return <Sparkles className="w-4 h-4" />;
  };

  // Renderizar detalhes como badges
  const renderDetails = () => {
    if (!room.details || typeof room.details !== 'object') return null;
    
    const detailEntries = Object.entries(room.details)
      .filter(([key, value]) => 
        value && 
        typeof value === 'string' && 
        value.trim() !== '' && 
        key !== 'description' &&
        key !== 'capacity' &&
        key !== 'bed_type' &&
        key !== 'amenities' &&
        key !== 'images'
      )
      .map(([_, value]) => value as string);
    
    if (detailEntries.length === 0) return null;

    return (
      <div className="mb-6 sm:mb-8">
        <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-slate-800 mb-3 sm:mb-4 flex items-center gap-2">
          <div className="w-1 h-6 sm:h-7 bg-gradient-to-b from-green-500 to-emerald-500 rounded-full"></div>
          Destaques
        </h3>
        <div className="flex flex-wrap gap-2">
          {detailEntries.map((detail, index) => (
            <Badge 
              key={index}
              variant="secondary"
              className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 border border-green-200/50 hover:from-green-200 hover:to-emerald-200 transition-colors"
            >
              {detail}
            </Badge>
          ))}
        </div>
      </div>
    );
  };

  return (
    <Dialog open={!!room} onOpenChange={onClose}>
      <DialogContent className="max-w-[100vw] sm:max-w-[95vw] md:max-w-[90vw] lg:max-w-[1000px] max-h-[100vh] sm:max-h-[95vh] w-full p-0 bg-white/95 backdrop-blur-sm border-0 shadow-2xl sm:rounded-2xl overflow-hidden flex flex-col gap-0">
        {/* Carousel de Imagens */}
        <div className="relative w-full h-64 sm:h-80 md:h-96 bg-slate-100 overflow-hidden">
          {loadingImages ? (
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-center text-slate-500">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-500 mx-auto mb-2"></div>
                <p className="text-sm">Carregando imagens...</p>
              </div>
            </div>
          ) : roomImages.length > 0 ? (
            <div className="relative w-full h-full">
              <img
                src={roomImages[currentImageIndex]}
                alt={`${room.name} - Imagem ${currentImageIndex + 1}`}
                className="w-full h-full object-cover"
              />
              
              {/* Overlay gradiente */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
              
              {/* Botões de navegação */}
              {roomImages.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 p-2 sm:p-3 bg-white/90 hover:bg-white rounded-full shadow-lg transition-all z-10"
                  >
                    <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 text-slate-700" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 p-2 sm:p-3 bg-white/90 hover:bg-white rounded-full shadow-lg transition-all z-10"
                  >
                    <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-slate-700" />
                  </button>
                </>
              )}
              
              {/* Indicadores */}
              {roomImages.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                  {roomImages.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all ${
                        index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                      }`}
                    />
                  ))}
                </div>
              )}
              
              {/* Contador de imagens */}
              <div className="absolute top-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-xs sm:text-sm font-medium z-10">
                <ImageIcon className="w-3 h-3 sm:w-4 sm:h-4 inline mr-1" />
                {currentImageIndex + 1}/{roomImages.length}
              </div>
            </div>
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-center text-slate-500">
                <ImageIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p className="text-sm">Nenhuma imagem disponível</p>
              </div>
            </div>
          )}
        </div>

        <DialogHeader className="relative bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 px-4 sm:px-6 md:px-8 lg:px-10 py-4 sm:py-6 md:py-8 lg:py-10 border-b border-slate-200/50 flex-shrink-0 overflow-hidden">
          {/* Elemento decorativo sutil */}
          <div className="absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-bl from-blue-100/30 to-transparent rounded-full -translate-y-12 translate-x-12 sm:-translate-y-16 sm:translate-x-16"></div>
          
          {/* Botão de fechar mobile */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 p-2 rounded-full bg-white/80 hover:bg-white shadow-md transition-all"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6 text-slate-600" />
          </button>

          <div className="relative z-10">
            <DialogTitle className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-slate-800 via-blue-900 to-indigo-900 bg-clip-text text-transparent mb-2 sm:mb-3 pr-10 sm:pr-12">
              {room.name}
            </DialogTitle>
            {room.special_name && (
              <p className="text-base sm:text-lg md:text-xl text-indigo-600 font-medium italic">
                "{room.special_name}"
              </p>
            )}
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-4 sm:px-6 md:px-8 lg:px-10 py-4 sm:py-6 md:py-8">
          {/* Descrição */}
          {(room.custom_description || room.description) && (
            <div className="mb-6 sm:mb-8">
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-slate-800 mb-3 sm:mb-4 flex items-center gap-2">
                <div className="w-1 h-6 sm:h-7 bg-gradient-to-b from-blue-500 to-indigo-500 rounded-full"></div>
                Descrição
              </h3>
              <div className="bg-slate-50 rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 border border-slate-200/50">
                <p className="text-sm sm:text-base md:text-lg text-slate-700 leading-relaxed whitespace-pre-wrap">
                  {room.custom_description || room.description}
                </p>
              </div>
            </div>
          )}

          {/* Destaques (outros detalhes) */}
          {renderDetails()}

          {/* Características Adicionais (usando o componente FeatureListDisplay) */}
          {room.additional_features && Array.isArray(room.additional_features) && room.additional_features.length > 0 && (
            <div className="mb-6 sm:mb-8">
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-slate-800 mb-3 sm:mb-4 flex items-center gap-2">
                <div className="w-1 h-6 sm:h-7 bg-gradient-to-b from-indigo-500 to-blue-500 rounded-full"></div>
                Características Adicionais
              </h3>
              <div className="bg-white rounded-xl sm:rounded-2xl border border-slate-200/50 overflow-hidden">
                <FeatureListDisplay features={room.additional_features as FeatureCategory[]} />
              </div>
            </div>
          )}

          <Separator className="my-6 sm:my-8" />

          {/* Botão de reserva */}
          {room.booking_url && (
            <div className="flex justify-center">
              <Button
                onClick={() => window.open(room.booking_url, '_blank')}
                size="lg"
                className="w-full sm:w-auto bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 text-white font-semibold px-6 sm:px-8 md:px-12 py-4 sm:py-5 md:py-6 rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl transition-all text-base sm:text-lg md:text-xl"
              >
                <ExternalLink className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3" />
                Reservar Agora
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RoomDetailsModal;