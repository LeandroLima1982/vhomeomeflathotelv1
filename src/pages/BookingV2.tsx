"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Header from "@/components/hotel/Header";
import { AvailabilitySearchForm } from "@/components/hotel/AvailabilitySearchForm";
import SimpleFooter from "@/components/hotel/SimpleFooter";
import { supabase } from "@/lib/supabaseClient";
import { showError } from "@/utils/toast";
import { Loader2, ServerCrash } from "lucide-react";
import { AvailabilityResults } from "@/components/hotel/AvailabilityResults";
import { format, parse, addDays, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { InitialBookingState } from "@/components/hotel/InitialBookingState";
import { BookingStickyControls } from "@/components/hotel/BookingStickyControls";
import { useSearchParams } from "react-router-dom";

interface LocalRoom {
  id: number;
  name: string;
  special_name: string | null;
  imageUrl: string | null;
  details: Record<string, string | null> | null;
  details_order: string[] | null;
}

interface AvailabilityResult {
  idQuarto: number;
  apiRoomId: number;
  nomeQuarto: string;
  disponibilidade: number;
  valorTotal: number;
  imageUrl: string | null;
  details: Record<string, string | null> | null;
  details_order: string[] | null;
  [key: string]: any;
}

interface SearchParams {
  checkin: string;
  checkout: string;
  adults: number;
}

const BookingV2 = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [rawResults, setRawResults] = useState<AvailabilityResult[] | null>(null);
  const [displayedResults, setDisplayedResults] = useState<AvailabilityResult[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [localRoomsData, setLocalRoomsData] = useState<LocalRoom[]>([]);
  const [searchParams, setSearchParams] = useState<SearchParams | null>(null);
  const [sortOrder, setSortOrder] = useState('price_asc'); // Alterado para 'price_asc'
  const [heroImageUrl, setHeroImageUrl] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');

  const searchFormRef = useRef<HTMLDivElement>(null);
  const resultsContainerRef = useRef<HTMLDivElement>(null);
  const [urlSearchParams] = useSearchParams();

  const handleSearch = useCallback(async (params: SearchParams) => {
    setIsLoading(true);
    setRawResults(null);
    setError(null);
    setSearchParams(params);

    // Removido: Rolagem para a seção de resultados no início da busca.
    // Será acionada após a conclusão da busca no useEffect abaixo.

    if (!supabase) {
      const errorMessage = "Cliente Supabase não está disponível. Verifique a configuração.";
      setError(errorMessage);
      showError(errorMessage);
      setIsLoading(false);
      return;
    }

    try {
      const { data, error: functionError } = await supabase.functions.invoke('get-availability', {
        body: params,
      });

      if (functionError) {
        const errorDetails = await functionError.context.json();
        if (errorDetails && errorDetails.error) throw new Error(errorDetails.error);
        throw new Error(functionError.message || "Erro na comunicação com a função.");
      }
      
      if (data.error) throw new Error(data.error);

      const mergedResults = data.map((apiRoom: any) => {
        // Mapeamento personalizado para quartos com offset -4 (API IDs 12 e 13)
        const apiToSupabaseMapping = { 12: 8, 13: 9 };
        const adjustedRoomId = apiToSupabaseMapping[apiRoom.idQuarto] || (apiRoom.idQuarto - 3); // Usa -4 para IDs 12 e 13, -3 como fallback
        const localRoom = localRoomsData.find(lr => lr.id === adjustedRoomId);
        return {
          ...apiRoom,
          idQuarto: adjustedRoomId,
          apiRoomId: apiRoom.idQuarto,
          imageUrl: localRoom?.imageUrl || null,
          details: localRoom?.details || null,
          details_order: localRoom?.details_order || null,
          special_name: localRoom?.special_name || null,
        };
      });

      // Filtrar quartos que têm valor total > 0 E uma imagem de capa
      const pricedAndImagedResults = mergedResults.filter((room: AvailabilityResult) => 
        room.valorTotal > 0 && room.imageUrl // Adicionada a condição room.imageUrl
      );
      setRawResults(pricedAndImagedResults);

    } catch (e: any) {
      console.error("Erro ao buscar disponibilidade:", e);
      const errorMessage = e.message || "Ocorreu um erro ao buscar a disponibilidade. Tente novamente.";
      setError(errorMessage);
      showError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [localRoomsData]);

  useEffect(() => {
    setIsMounted(true);
    const fetchInitialData = async () => {
      if (!supabase) {
        console.error('Supabase client not available in BookingV2 fetchInitialData');
        return;
      }

      // Fetch Hero Image
      try {
        const { data: orderFileData } = await supabase.storage.from('gallery').download('hero/_order.json');
        let imageName: string | null = null;

        if (orderFileData) {
          const orderJson = await orderFileData.text();
          const orderedNames = JSON.parse(orderJson) as string[];
          if (orderedNames.length > 0) imageName = orderedNames[0];
        }

        if (!imageName) {
          const { data: files } = await supabase.storage.from('gallery').list('hero', { limit: 1, sortBy: { column: 'created_at', order: 'desc' } });
          const firstFile = files?.find(f => f.name !== '_order.json' && f.name !== '.emptyFolderPlaceholder');
          if (firstFile) imageName = firstFile.name;
        }

        if (imageName) {
          const { data: { publicUrl } } = supabase.storage.from('gallery').getPublicUrl(`hero/${imageName}`);
          setHeroImageUrl(publicUrl);
        } else {
          setHeroImageUrl("https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto-format&fit=crop&q=80");
        }
      } catch (e) {
        console.warn("Could not fetch hero image, using fallback.", e);
        setHeroImageUrl("https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto-format&fit=crop&q=80");
      }

      // Fetch Local Rooms Data
      const { data: roomData, error: roomError } = await supabase
        .from('rooms')
        .select('*')
        .order('id');

      if (roomError) {
        console.error("Error fetching local rooms data from Supabase:", roomError);
        return;
      }

      if (!roomData) {
        setLocalRoomsData([]);
        return;
      }

      const roomsWithImages = await Promise.all(
        roomData.map(async (room) => {
          let imageUrl: string | null = null;
          try {
            // Try to find a cover image directly in 'rooms/' folder
            const { data: coverFiles } = await supabase.storage
              .from('gallery')
              .list('rooms', { search: `${room.id}.` });

            if (coverFiles && coverFiles.length > 0) {
              const coverFile = coverFiles[0];
              const { data: { publicUrl } } = supabase.storage
                .from('gallery')
                .getPublicUrl(`rooms/${coverFile.name}`);
              imageUrl = `${publicUrl}?t=${new Date().getTime()}`;
            }

            // If no cover image, try to find the first image in the room's gallery subfolder
            if (!imageUrl) {
              const { data: galleryFiles } = await supabase.storage
                .from('gallery')
                .list(`rooms/${room.id}/gallery`, { 
                  limit: 100,
                  sortBy: { column: 'created_at', order: 'desc' }
                });

              if (galleryFiles && galleryFiles.length > 0) {
                const validFiles = galleryFiles.filter(
                  file => file.name !== '.emptyFolderPlaceholder' && file.name !== '_order.json'
                );

                if (validFiles.length > 0) {
                  let firstImageName: string | null = null;
                  const { data: orderFileData } = await supabase.storage
                    .from('gallery')
                    .download(`rooms/${room.id}/gallery/_order.json`);

                  if (orderFileData) {
                    try {
                      const orderJson = await orderFileData.text();
                      const orderedNames = JSON.parse(orderJson) as string[];
                      const validOrderedName = orderedNames.find(name => 
                        validFiles.some(file => file.name === name)
                      );
                      if (validOrderedName) {
                        firstImageName = validOrderedName;
                      }
                    } catch (e) {
                      console.warn(`Could not parse order file for room ${room.id}:`, e);
                    }
                  }

                  if (!firstImageName) {
                    firstImageName = validFiles[0].name;
                  }
                  
                  const { data: { publicUrl } } = supabase.storage
                    .from('gallery')
                    .getPublicUrl(`rooms/${room.id}/gallery/${firstImageName}`);
                  
                  imageUrl = `${publicUrl}?t=${new Date().getTime()}`;
                }
              }
            }
            return { ...room, imageUrl };
          } catch (error) {
            console.error(`Error fetching image for room ${room.id}:`, error);
            return { ...room, imageUrl: null };
          }
        })
      );
      setLocalRoomsData(roomsWithImages);
    };

    fetchInitialData();
  }, []);

  // Efeito para ler os parâmetros da URL e disparar a busca
  useEffect(() => {
    if (localRoomsData.length > 0) {
      const checkinParam = urlSearchParams.get('checkin');
      const checkoutParam = urlSearchParams.get('checkout');
      const adultsParam = urlSearchParams.get('adults');

      if (checkinParam && checkoutParam && adultsParam) {
        const parsedAdults = parseInt(adultsParam, 10);
        if (!isNaN(parsedAdults) && parsedAdults > 0) {
          const paramsFromUrl = {
            checkin: checkinParam,
            checkout: checkoutParam,
            adults: parsedAdults,
          };
          setSearchParams(paramsFromUrl);
          handleSearch(paramsFromUrl);
        }
      }
    }
  }, [urlSearchParams, localRoomsData, handleSearch]);

  useEffect(() => {
    if (!rawResults) {
      setDisplayedResults(null);
      return;
    }
    let sortedResults = [...rawResults];
    if (sortOrder === 'price_asc') {
      sortedResults.sort((a, b) => a.valorTotal - b.valorTotal);
    } else if (sortOrder === 'price_desc') {
      sortedResults.sort((a, b) => b.valorTotal - a.valorTotal);
    } else if (sortOrder === 'relevance') {
      sortedResults = [...rawResults]; 
    }
    setDisplayedResults(sortedResults);
  }, [rawResults, sortOrder]);

  // NOVO useEffect para rolar para os resultados após a conclusão da busca
  useEffect(() => {
    if (!isLoading && (displayedResults || error)) {
      resultsContainerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [isLoading, displayedResults, error]);

  const scrollToSearchForm = () => {
    searchFormRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      <Header />
      <main className="pb-20 flex-grow min-h-[600px]">
        <section
          className="relative bg-cover bg-center bg-gray-700 py-40"
          style={{ backgroundImage: `url(${heroImageUrl || ''})` }}
        >
          <div className="absolute inset-<dyad-write path="src/components/hotel/RoomDetailsModal.tsx" description="Adjusting the ID mapping in the modal's availability search to handle exceptions for Supabase IDs 8 and 9, using +4 offset instead of +3 for these specific rooms.">
"use client";

import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Users, 
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
import { showError } from '@/utils/toast';
import { useNavigate } from 'react-router-dom';
import { format, parse, differenceInDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import DetailIcon from './DetailIcon'; // Importando o DetailIcon

// Interface para o objeto 'room' que vem do estado da localização
interface RoomResultForCheckout {
  idQuarto: number; // ID do Supabase (ajustado)
  apiRoomId: number; // ID original da API
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
  room: any; // O quarto original do Supabase
  onClose: () => void;
}

const RoomDetailsModal = ({ room, onClose }: RoomDetailsModalProps) => {
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [roomImages, setRoomImages] = useState<string[]>([]);
  const [loadingImages, setLoadingImages] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showBookingForm, setShowBookingForm] = useState(false);

  // Novos estados para a busca de disponibilidade
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

  // Função para realizar a busca de disponibilidade
  const handleAvailabilitySearch = async (checkin: string, checkout: string, adults: number) => {
    setIsSearchingAvailability(true);
    setRoomAvailabilityResult(null);
    setAvailabilitySearchError(null);
    setCurrentSearchParams({ checkin, checkout, adults });

    if (!supabase) {
      const errorMessage = "Cliente Supabase não está disponível. Verifique a configuração.";
      setAvailabilitySearchError(errorMessage);
      showError(errorMessage);
      setIsSearchingAvailability(false);
      setShowBookingForm(false); // Adicionado para ocultar o formulário em caso de erro
      return;
    }

    try {
      // Mapeamento personalizado para quartos com offset +4 (Supabase IDs 8 e 9)
      const supabaseToApiMapping = { 8: 12, 9: 13 };
      const targetApiRoomId = supabaseToApiMapping[room.id] || (room.id + 3); // Usa +4 para IDs 8 e 9, +3 como fallback

      const { data, error: functionError } = await supabase.functions.invoke('get-availability', {
        body: { checkin, checkout, adults },
      });

      if (functionError) {
        const errorDetails = await functionError.context.json();
        if (errorDetails && errorDetails.error) throw new Error(errorDetails.error);
        throw new Error(functionError.message || "Erro na comunicação com a função.");
      }
      
      if (data.error) throw new Error(data.error);

      // A Edge Function retorna o idQuarto como o ID original da API.
      // Precisamos encontrar o quarto que corresponde ao nosso room.id do Supabase.
      // A correção de ID é -3 para ir da API para o Supabase, então para ir do Supabase para a API é +3.
      const foundRoom = data.find((apiRoom: any) => apiRoom.idQuarto === targetApiRoomId);

      if (foundRoom && foundRoom.disponibilidade > 0 && foundRoom.valorTotal > 0) {
        setRoomAvailabilityResult({
          idQuarto: room.id, // ID do Supabase
          apiRoomId: foundRoom.idQuarto, // ID original da API
          nomeQuarto: room.name,
          disponibilidade: foundRoom.disponibilidade,
          valorTotal: foundRoom.valorTotal,
          imageUrl: room.imageUrl, // Usamos a imagem do Supabase
          details: room.details,
          details_order: room.details_order,
          special_name: room.special_name,
        });
        setShowBookingForm(false); // IMPORTANTE: Ocultar o formulário para mostrar os resultados
      } else {
        setAvailabilitySearchError("Desculpe, esta acomodação não está disponível para as datas e hóspedes selecionados.");
        setShowBookingForm(false); // IMPORTANTE: Ocultar o formulário para mostrar a mensagem de erro
      }

    } catch (e: any) {
      console.error("Erro ao buscar disponibilidade no modal:", e);
      const errorMessage = e.message || "Ocorreu um erro ao buscar a disponibilidade. Tente novamente.";
      setAvailabilitySearchError(errorMessage);
      setShowBookingForm(false); // IMPORTANTE: Ocultar o formulário para mostrar a mensagem de erro
    } finally {
      setIsSearchingAvailability(false);
    }
  };

  const handleReserveClick = (isDirectBooking: boolean) => {
    if (roomAvailabilityResult && currentSearchParams) {
      const targetPath = isDirectBooking ? '/direct-checkout' : '/checkout';
      navigate(targetPath, {
        state: {
          room: roomAvailabilityResult,
          searchParams: currentSearchParams,
        },
      });
    }
  };

  const handleViewOtherOptions = (isDirectBooking: boolean) => {
    if (currentSearchParams) {
      const { checkin, checkout, adults } = currentSearchParams;
      const targetPath = isDirectBooking ? '/direct-booking' : '/booking-v2';
      navigate(`${targetPath}?checkin=${checkin}&checkout=${checkout}&adults=${adults}`);
    } else {
      // Se não houver searchParams, apenas navega para a página de busca geral
      const targetPath = isDirectBooking ? '/direct-booking' : '/booking-v2';
      navigate(targetPath);
    }
    onClose(); // Fecha o modal ao navegar para a página de busca
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

  const getRoomDetails = (roomData: any) => {
    if (!roomData.details || typeof roomData.details !== 'object') return [];
  
    const detailsObject = roomData.details;
  
    const validKeys = Object.keys(detailsObject).filter(key => {
      const value = detailsObject[key];
      return value && typeof value === 'string' && value.trim() !== '' && key !== 'description';
    });
  
    if (roomData.details_order && Array.isArray(roomData.details_order)) {
      const orderedDetails = roomData.details_order
        .map((key: string) => {
          if (validKeys.includes(key)) {
            return detailsObject[key];
          }
          return null;
        })
        .filter((value: string | null): value is string => value !== null);
      
      const unorderedKeys = validKeys.filter(key => !roomData.details_order.includes(key));
      const unorderedDetails = unorderedKeys.map(key => detailsObject[key] as string);
  
      return [...orderedDetails, ...unorderedDetails].slice(0, 9); // Limita a 9 detalhes para não sobrecarregar
    }
  
    return validKeys.map(key => detailsObject[key] as string).slice(0, 9);
  };

  const roomDetails = getRoomDetails(room);

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
                    <div className="mt-2 inline-block bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-md">
                      {room.special_name}
                    </div>
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
          <div className="px-4 sm:px-6 lg:px-8 py-4 bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200/60">
            {showBookingForm ? (
              // Formulário de busca de disponibilidade
              <RoomBookingForm 
                roomId={room.id} 
                onCancel={() => {
                  setShowBookingForm(false);
                  setRoomAvailabilityResult(null);
                  setAvailabilitySearchError(null);
                  setCurrentSearchParams(null);
                }}
                onConsult={handleAvailabilitySearch}
                isLoading={isSearchingAvailability}
                initialCheckin={currentSearchParams ? parse(currentSearchParams.checkin, "yyyyMMdd", new Date()) : undefined}
                initialCheckout={currentSearchParams ? parse(currentSearchParams.checkout, "yyyyMMdd", new Date()) : undefined}
                initialGuests={currentSearchParams?.adults}
              />
            ) : isSearchingAvailability ? ( // Adicionado estado de carregamento
              <div className="flex flex-col items-center justify-center text-center p-10 bg-white rounded-lg shadow-md">
                <Loader2 className="h-12 w-12 animate-spin text-blue-600 mb-4" />
                <p className="text-lg font-semibold text-gray-700">Buscando disponibilidade...</p>
                <p className="text-gray-500">Por favor, aguarde um momento.</p>
              </div>
            ) : roomAvailabilityResult ? (
              // Resultados da disponibilidade para o quarto atual
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
                  <div className="flex items-center gap-2 text-gray-700">
                    <Users className="h-5 w-5 text-blue-600" />
                    <span>{currentSearchParams!.adults} Hóspede{currentSearchParams!.adults > 1 ? 's' : ''}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <BedDouble className="h-5 w-5 text-blue-600" />
                    <span>{roomAvailabilityResult.disponibilidade} unidade{roomAvailabilityResult.disponibilidade > 1 ? 's' : ''} disponível{roomAvailabilityResult.disponibilidade > 1 ? 's' : ''}</span>
                  </div>
                </div>
                <Separator className="my-4" />
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-center sm:text-left">
                    <span className="text-sm text-gray-600">Total para {numberOfNights} diária{numberOfNights > 1 ? 's' : ''}</span>
                    <p className="text-3xl font-bold text-blue-800 flex items-center gap-2 mt-1">
                      <Tag className="h-6 w-6 opacity-70" />
                      {formattedPrice}
                    </p>
                  </div>
                  <Button
                    onClick={() => handleReserveClick(false)} // Passa false para indicar que não é direct booking
                    size="lg"
                    className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 text-white font-semibold px-6 sm:px-8 py-3 sm:py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-sm sm:text-base transform hover:scale-105 w-full sm:w-auto"
                  >
                    <ExternalLink className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                    Reservar Agora
                  </Button>
                </div>
                <div className="mt-4 text-center">
                  <Button variant="link" onClick={() => handleViewOtherOptions(false)} className="text-blue-600 hover:text-blue-800">
                    <Search className="h-4 w-4 mr-2" /> Ver Outras Opções
                  </Button>
                </div>
              </div>
            ) : availabilitySearchError ? (
              // Mensagem de erro
              <div className="p-6 bg-red-50 rounded-lg shadow-md border border-red-200 text-center">
                <div className="flex items-center justify-center mb-4">
                  <ServerCrash className="h-12 w-12 text-red-500" />
                </div>
                <h3 className="text-xl font-bold text-red-800 mb-2">Erro na Consulta</h3>
                <p className="text-red-700 mb-4">{availabilitySearchError}</p>
                <div className="flex flex-col sm:flex-row justify-center gap-3">
                  <Button variant="outline" onClick={() => setShowBookingForm(true)}>
                    <ArrowLeft className="h-4 w-4 mr-2" /> Tentar Novamente
                  </Button>
                  <Button onClick={() => handleViewOtherOptions(false)}>
                    <Search className="h-4 w-4 mr-2" /> Ver Outras Opções
                  </Button>
                </div>
              </div>
            ) : (
              // Botão inicial para consultar preço
              <div className="flex justify-center">
                <Button
                  onClick={() => setShowBookingForm(true)}
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 text-white font-semibold px-6 sm:px-8 py-3 sm:py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-sm sm:text-base transform hover:scale-105"
                >
                  <Calendar className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  Consultar preço
                  <ExternalLink className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
                </Button>
              </div>
            )}
          </div>

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