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
  Image as ImageIcon,
  Star,
  MapPin,
  Calendar,
  Clock
} from 'lucide-react';
import FeatureListDisplay, { FeatureCategory } from './FeatureListDisplay';
import { supabase } from '@/lib/supabaseClient';
import { RoomBookingForm } from './RoomBookingForm';

interface RoomDetailsModalProps {
  room: any;
  onClose: () => void;
}

const RoomDetailsModal = ({ room, onClose }: RoomDetailsModalProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [roomImages, setRoomImages] = useState<string[]>([]);
  const [loadingImages, setLoadingImages] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showBookingForm, setShowBookingForm] = useState(false);

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
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentImageIndex((prev) => (prev + 1) % roomImages.length);
    setTimeout(() => setIsTransitioning(false), 300);
  };

  const prevImage = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentImageIndex((prev) => (prev - 1 + roomImages.length) % roomImages.length);
    setTimeout(() => setIsTransitioning(false), 300);
  };

  const goToImage = (index: number) => {
    if (isTransitioning || index === currentImageIndex) return;
    setIsTransitioning(true);
    setCurrentImageIndex(index);
    setTimeout(() => setIsTransitioning(false), 300);
  };

  const getFeatureIcon = (feature: string) => {
    const lowerFeature = feature.toLowerCase();
    if (lowerFeature.includes('wifi') || lowerFeature.includes('internet')) return <Wifi className="w-5 h-5" />;
    if (lowerFeature.includes('café') || lowerFeature.includes('coffee')) return <Coffee className="w-5 h-5" />;
    if (lowerFeature.includes('tv')) return <Tv className="w-5 h-5" />;
    if (lowerFeature.includes('ar') || lowerFeature.includes('condicionado')) return <Wind className="w-5 h-5" />;
    if (lowerFeature.includes('banheiro') || lowerFeature.includes('banho')) return <Droplets className="w-5 h-5" />;
    return <Sparkles className="w-5 h-5" />;
  };

  // Renderizar detalhes como badges modernos
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
        <div className="flex items-center gap-3 mb-3">
          <div className="w-1 h-6 bg-gradient-to-b from-emerald-400 to-teal-500 rounded-full"></div>
          <h3 className="text-lg sm:text-xl font-bold text-slate-800">Destaques</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {detailEntries.map((detail, index) => (
            <Badge 
              key={index}
              variant="secondary"
              className="px-3 py-1 text-xs bg-gradient-to-r from-emerald-50 to-teal-50 text-emerald-700 border border-emerald-200/60 hover:from-emerald-100 hover:to-teal-100 transition-all duration-200 font-medium shadow-sm"
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
      <DialogContent className="max-w-[100vw] sm:max-w-[95vw] md:max-w-[90vw] lg:max-w-[1100px] max-h-[95vh] w-full p-0 bg-white border-0 shadow-2xl overflow-hidden">
        {/* Container com scroll para o modal inteiro */}
        <div className="max-h-[95vh] overflow-y-auto">
          {/* Header com gradiente moderno */}
          <div className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
            {/* Botão fechar moderno */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-20 w-8 h-8 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center transition-all duration-200 group"
            >
              <X className="w-4 h-4 group-hover:scale-110 transition-transform" />
            </button>

            {/* Título e informações principais */}
            <div className="px-4 sm:px-6 lg:px-8 pt-6 pb-4">
              <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-yellow-400 font-medium text-xs">4 Estrelas</span>
                  </div>
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-1 leading-tight">
                    {room.name}
                  </h1>
                  {room.special_name && (
                    <p className="text-sm sm:text-base text-slate-300 font-light italic">
                      "{room.special_name}"
                    </p>
                  )}
                </div>
                
                {/* Rating e localização */}
                <div className="flex flex-col sm:flex-row gap-3 lg:flex-col lg:items-end">
                  <div className="flex items-center gap-2 text-slate-300">
                    <MapPin className="w-3 h-3" />
                    <span className="text-xs">Macaé, RJ</span>
                  </div>
                  <div className="flex items-center gap-1">
                    {[1,2,3,4].map((star) => (
                      <Star key={star} className="w-3 h-3 text-yellow-400 fill-current" />
                    ))}
                    <span className="text-slate-300 text-xs ml-2">(4.8)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sistema de reserva acima do carousel */}
          {showBookingForm ? (
            <div className="px-4 sm:px-6 lg:px-8 py-4 bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200/60">
              <RoomBookingForm roomId={room.id} onCancel={() => setShowBookingForm(false)} />
            </div>
          ) : (
            <div className="px-4 sm:px-6 lg:px-8 py-4 bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200/60">
              <div className="flex justify-center">
                <Button
                  onClick={() => setShowBookingForm(true)}
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 text-white font-semibold px-6 sm:px-8 py-3 sm:py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-sm sm:text-base transform hover:scale-105"
                >
                  <Calendar className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  Consultar Valor
                  <ExternalLink className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
                </Button>
              </div>
            </div>
          )}

          {/* Carousel de Imagens Moderno */}
          <div className="relative w-full h-48 sm:h-64 lg:h-[350px] bg-slate-100 overflow-hidden">
            {loadingImages ? (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-10 w-10 border-4 border-slate-300 border-t-slate-600 mx-auto mb-3"></div>
                  <p className="text-slate-600 font-medium text-sm">Carregando imagens...</p>
                </div>
              </div>
            ) : roomImages.length > 0 ? (
              <div className="relative w-full h-full group">
                <img
                  src={roomImages[currentImageIndex]}
                  alt={`${room.name} - Imagem ${currentImageIndex + 1}`}
                  className="w-full h-full object-cover transition-all duration-500 ease-out"
                />
                
                {/* Overlay gradiente sutil */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
                
                {/* Botões de navegação modernos */}
                {roomImages.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 hover:bg-white backdrop-blur-sm rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group"
                    >
                      <ChevronLeft className="w-5 h-5 text-slate-700 group-hover:scale-110 transition-transform" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 hover:bg-white backdrop-blur-sm rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group"
                    >
                      <ChevronRight className="w-5 h-5 text-slate-700 group-hover:scale-110 transition-transform" />
                    </button>
                  </>
                )}
                
                {/* Indicadores modernos */}
                {roomImages.length > 1 && (
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                    {roomImages.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => goToImage(index)}
                        className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                          index === currentImageIndex 
                            ? 'bg-white scale-125 shadow-lg' 
                            : 'bg-white/60 hover:bg-white/80'
                        }`}
                      />
                    ))}
                  </div>
                )}
                
                {/* Contador elegante */}
                <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-xs font-medium">
                  <ImageIcon className="w-3 h-3 inline mr-1.5" />
                  {currentImageIndex + 1} / {roomImages.length}
                </div>
              </div>
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
                <div className="text-center text-slate-500">
                  <ImageIcon className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p className="text-base font-medium">Nenhuma imagem disponível</p>
                  <p className="text-xs text-slate-400 mt-1">As imagens serão exibidas aqui em breve</p>
                </div>
              </div>
            )}
          </div>

          {/* Conteúdo principal com design moderno */}
          <div className="bg-gradient-to-b from-slate-50/50 to-white">
            <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">
              {/* Descrições completas */}
              <div className="mb-6 sm:mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-1 h-6 bg-gradient-to-b from-blue-500 to-indigo-600 rounded-full"></div>
                  <h3 className="text-lg sm:text-xl font-bold text-slate-800">Sobre este quarto</h3>
                </div>
                
                {/* Descrição principal */}
                {(room.custom_description || room.description) && (
                  <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-slate-200/60 mb-4">
                    <p className="text-sm sm:text-base text-slate-700 leading-relaxed whitespace-pre-wrap">
                      {room.custom_description || room.description}
                    </p>
                  </div>
                )}

                {/* Descrição adicional do banco de dados */}
                {room.details?.description && room.details.description !== (room.custom_description || room.description) && (
                  <div className="bg-gradient-to-r from-slate-50 to-slate-100 rounded-xl p-4 sm:p-6 border border-slate-200/60 mb-4">
                    <h4 className="text-base font-semibold text-slate-800 mb-2">Detalhes adicionais</h4>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">
                      {room.details.description}
                    </p>
                  </div>
                )}
              </div>

              {/* Destaques */}
              {renderDetails()}

              {/* Características Adicionais */}
              {room.additional_features && Array.isArray(room.additional_features) && room.additional_features.length > 0 && (
                <div className="mb-6 sm:mb-8">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-1 h-6 bg-gradient-to-b from-indigo-500 to-purple-600 rounded-full"></div>
                    <h3 className="text-lg sm:text-xl font-bold text-slate-800">Características</h3>
                  </div>
                  <div className="bg-white rounded-xl shadow-sm border border-slate-200/60 overflow-hidden">
                    <FeatureListDisplay features={room.additional_features as FeatureCategory[]} />
                  </div>
                </div>
              )}

              {/* Informações adicionais */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6 sm:mb-8">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100/50">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="p-1.5 bg-blue-500 rounded-lg">
                      <Clock className="w-4 h-4 text-white" />
                    </div>
                    <h4 className="font-semibold text-slate-800 text-sm">Check-in/out</h4>
                  </div>
                  <p className="text-xs text-slate-600">Check-in: 14:00<br />Check-out: 12:00</p>
                </div>
                
                <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-4 border border-emerald-100/50">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="p-1.5 bg-emerald-500 rounded-lg">
                      <Wifi className="w-4 h-4 text-white" />
                    </div>
                    <h4 className="font-semibold text-slate-800 text-sm">Conectividade</h4>
                  </div>
                  <p className="text-xs text-slate-600">Wi-Fi gratuito<br />em todas as áreas</p>
                </div>
                
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-100/50 sm:col-span-2 lg:col-span-1">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="p-1.5 bg-purple-500 rounded-lg">
                      <MapPin className="w-4 h-4 text-white" />
                    </div>
                    <h4 className="font-semibold text-slate-800 text-sm">Localização</h4>
                  </div>
                  <p className="text-xs text-slate-600">Av. Atlântica<br />Praia Campista</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RoomDetailsModal;