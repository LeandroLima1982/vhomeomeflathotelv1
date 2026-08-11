"use client";

import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Users,
  Wifi,
  X,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Image as ImageIcon,
  Star,
  MapPin,
  Calendar,
  Clock,
  Tag,
  Loader2,
  ArrowLeft,
  Search,
  BedDouble,
  ServerCrash
} from 'lucide-react';
import FeatureListDisplay, { FeatureCategory } from './FeatureListDisplay';
import { supabase } from '@/lib/supabaseClient';
import { RoomBookingForm } from './RoomBookingForm';
import { useNavigate } from 'react-router-dom';
import { format, parse, differenceInDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { generateWhatsAppLink } from '@/utils/reservationLinks';

interface RoomResultForCheckout {
  idQuarto: number;
  apiRoomId: number;
  originalApiRoomId: number;
  nomeQuarto: string;
  disponibilidade: number;
  valorTotal: number;
  imageUrl: string | null;
  details: Record<string, string | null> | null;
  details_order: string[] | null;
  special_name?: string | null;
  [key: string]: any;
}

interface SearchParams {
  checkin: string;
  checkout: string;
  adults: number;
}

interface RoomDetailsModalProps {
  room: any;
  onClose: () => void;
}

const RoomDetailsModal = ({ room, onClose }: RoomDetailsModalProps) => {
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [roomImages, setRoomImages] = useState<string[]>([]);
  const [loadingImages, setLoadingImages] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showBookingForm, setShowBookingForm] = useState(false);

  const [isSearchingAvailability, setIsSearchingAvailability] = useState(false);
  const [roomAvailabilityResult, setRoomAvailabilityResult] = useState<RoomResultForCheckout | null>(null);
  const [availabilitySearchError, setAvailabilitySearchError] = useState<string | null>(null);
  const [currentSearchParams, setCurrentSearchParams] = useState<SearchParams | null>(null);

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
    if (isTransitioning || roomImages.length === 0) return;
    setIsTransitioning(true);
    setCurrentImageIndex((prev) => (prev + 1) % roomImages.length);
    setTimeout(() => setIsTransitioning(false), 300);
  };

  const prevImage = () => {
    if (isTransitioning || roomImages.length === 0) return;
    setIsTransitioning(true);
    setCurrentImageIndex((prev) => (prev - 1 + roomImages.length) % roomImages.length);
    setTimeout(() => setIsTransitioning(false), 300);
  };

  const goToImage = (index: number) => {
    if (isTransitioning || index === currentImageIndex || roomImages.length === 0) return;
    setIsTransitioning(true);
    setCurrentImageIndex(index);
    setTimeout(() => setIsTransitioning(false), 300);
  };

  const handleShowBookingForm = () => {
    setShowBookingForm(true);
  };

  const handleReserveClick = () => {
    const whatsappLink = generateWhatsAppLink(room.name, currentSearchParams || undefined);
    window.open(whatsappLink, '_blank');
  };

  const handleViewOtherOptions = (isDirectBooking: boolean) => {
    if (currentSearchParams) {
      const { checkin, checkout, adults } = currentSearchParams;
      const targetPath = isDirectBooking ? '/direct-booking' : '/booking-v2';
      navigate(`${targetPath}?checkin=${checkin}&checkout=${checkout}&adults=${adults}`);
    } else {
      const targetPath = isDirectBooking ? '/direct-booking' : '/booking-v2';
      navigate(targetPath);
    }
    onClose();
  };

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

  const formattedPrice = roomAvailabilityResult ? new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(roomAvailabilityResult.valorTotal) : '';

  const checkinDateObj = currentSearchParams ? parse(currentSearchParams.checkin, "yyyyMMdd", new Date()) : null;
  const checkoutDateObj = currentSearchParams ? parse(currentSearchParams.checkout, "yyyyMMdd", new Date()) : null;
  const numberOfNights = (checkinDateObj && checkoutDateObj) ? differenceInDays(checkoutDateObj, checkinDateObj) : 0;

  return (
    <Dialog open={!!room} onOpenChange={onClose}>
      <DialogContent className="max-w-[100vw] sm:max-w-[95vw] md:max-w-[90vw] lg:max-w-[1100px] max-h-[95vh] w-full p-0 bg-white border-0 shadow-2xl overflow-hidden">
        <div className="max-h-[95vh] overflow-y-auto">
          <div className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-20 w-8 h-8 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center transition-all duration-200 group"
            >
              <X className="w-4 h-4 group-hover:scale-110 transition-transform" />
            </button>

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
                    <div className="mt-2 inline-block bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-md">
                      {room.special_name}
                    </div>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row gap-3 lg:flex-col lg:items-end">
                  <div className="flex items-center gap-2 text-slate-300">
                    <MapPin className="w-3 h-3" />
                    <span className="text-xs">Macaé, RJ</span>
                  </div>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4].map((star) => (
                      <Star key={star} className="w-3 h-3 text-yellow-400 fill-current" />
                    ))}
                    <span className="text-slate-300 text-xs ml-2">(4.8)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="px-4 sm:px-6 lg:px-8 py-4 bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200/60">
            {showBookingForm ? (
              <RoomBookingForm
                roomId={room.id}
                onCancel={() => {
                  setShowBookingForm(false);
                  setRoomAvailabilityResult(null);
                  setAvailabilitySearchError(null);
                  setCurrentSearchParams(null);
                }}
                onConsult={(checkin, checkout, adults) => {
                  const whatsappLink = generateWhatsAppLink(room.name, { checkin, checkout, adults });
                  window.open(whatsappLink, '_blank');
                }}
                isLoading={false}
              />
            ) : isSearchingAvailability ? (
              <div className="flex flex-col items-center justify-center text-center p-10 bg-white rounded-lg shadow-md">
                <Loader2 className="h-12 w-12 animate-spin text-blue-600 mb-4" />
                <p className="text-lg font-semibold text-gray-700">Buscando disponibilidade...</p>
              </div>
            ) : roomAvailabilityResult ? (
              <div className="p-6 bg-white rounded-lg shadow-md border border-blue-100">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-blue-800">Disponível!</h3>
                  <Button variant="outline" onClick={() => setShowBookingForm(true)}>
                    <ArrowLeft className="h-4 w-4 mr-2" /> Modificar Datas
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center gap-2 text-gray-700">
                    <Calendar className="h-5 w-5 text-blue-600" />
                    <span>Check-in: {format(parse(currentSearchParams!.checkin, "yyyyMMdd", new Date()), "dd/MM/yyyy", { locale: ptBR })}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <Calendar className="h-5 w-5 text-blue-600" />
                    <span>Check-out: {format(parse(currentSearchParams!.checkout, "yyyyMMdd", new Date()), "dd/MM/yyyy", { locale: ptBR })}</span>
                  </div>
                </div>
                <Separator className="my-4" />
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-center sm:text-left">
                    <span className="text-sm text-gray-600">Valor de referência para {numberOfNights} diária{numberOfNights > 1 ? 's' : ''}*</span>
                    <p className="text-3xl font-bold text-blue-800 flex items-center gap-2 mt-1">
                      <Tag className="h-6 w-6 opacity-70" />
                      {formattedPrice}
                    </p>
                    <p className="text-xs text-gray-500 mt-1 italic">
                      Valor de referência, sujeito a confirmação.
                    </p>
                  </div>
                  <Button
                    onClick={handleReserveClick}
                    size="lg"
                    className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 text-white font-semibold px-6 sm:px-8 py-3 sm:py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-sm sm:text-base transform hover:scale-105 w-full sm:w-auto"
                  >
                    <ExternalLink className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                    Reservar via WhatsApp
                  </Button>
                </div>
              </div>
            ) : availabilitySearchError ? (
              <div className="p-6 bg-red-50 rounded-lg shadow-md border border-red-200 text-center">
                <div className="flex items-center justify-center mb-4">
                  <ServerCrash className="h-12 w-12 text-red-500" />
                </div>
                <h3 className="text-xl font-bold text-red-800 mb-2">Erro na Consulta</h3>
                <p className="text-red-700 mb-4">{availabilitySearchError}</p>
                <Button variant="outline" onClick={() => setShowBookingForm(true)}>
                  <ArrowLeft className="h-4 w-4 mr-2" /> Tentar Novamente
                </Button>
              </div>
            ) : (
              <div className="flex justify-center">
                <Button
                  onClick={handleShowBookingForm}
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 text-white font-semibold px-6 sm:px-8 py-3 sm:py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-sm sm:text-base transform hover:scale-105"
                >
                  <Calendar className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  Reservar via WhatsApp
                </Button>
              </div>
            )}
          </div>

          <div className="relative w-full h-48 sm:h-64 lg:h-[350px] bg-slate-100 overflow-hidden">
            {loadingImages ? (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
                <div className="animate-spin rounded-full h-10 w-10 border-4 border-slate-300 border-t-slate-600 mx-auto mb-3"></div>
              </div>
            ) : roomImages.length > 0 ? (
              <div className="relative w-full h-full group">
                <img
                  src={roomImages[currentImageIndex]}
                  alt={`${room.name} - Imagem ${currentImageIndex + 1}`}
                  className="w-full h-full object-cover transition-all duration-500 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
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
                <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-xs font-medium">
                  <ImageIcon className="w-3 h-3 inline mr-1.5" />
                  {currentImageIndex + 1} / {roomImages.length}
                </div>
              </div>
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
                <ImageIcon className="w-12 h-12 mx-auto mb-3 opacity-50" />
              </div>
            )}
          </div>

          <div className="bg-gradient-to-b from-slate-50/50 to-white">
            <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">
              <div className="mb-6 sm:mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-1 h-6 bg-gradient-to-b from-blue-500 to-indigo-600 rounded-full"></div>
                  <h3 className="text-lg sm:text-xl font-bold text-slate-800">Sobre este quarto</h3>
                </div>
                {(room.custom_description || room.description) && (
                  <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-slate-200/60 mb-4">
                    <p className="text-sm sm:text-base text-slate-700 leading-relaxed whitespace-pre-wrap">
                      {room.custom_description || room.description}
                    </p>
                  </div>
                )}
              </div>
              {renderDetails()}
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
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RoomDetailsModal;