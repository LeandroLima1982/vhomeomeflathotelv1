"use client";

import { useState, useEffect, useRef } from "react";
import Header from "@/components/hotel/Header";
import { AvailabilitySearchForm } from "@/components/hotel/AvailabilitySearchForm";
import SimpleFooter from "@/components/hotel/SimpleFooter";
import { supabase } from "@/lib/supabaseClient";
import { showError } from "@/utils/toast";
import { Loader2, ServerCrash } from "lucide-react";
import { AvailabilityResults } from "@/components/hotel/AvailabilityResults";
import { format, parse } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { InitialBookingState } from "@/components/hotel/InitialBookingState";
import { BookingStickyControls } from "@/components/hotel/BookingStickyControls";

interface AvailabilityResult {
  idQuarto: number;
  nomeQuarto: string;
  disponibilidade: number;
  valorTotal: number;
  imageUrl: string | null;
  details: Record<string, string | null> | null;
  details_order: string[] | null;
  special_name?: string | null;
  apiRoomId: number;
  api_category_id?: number | null;
  [key: string]: any;
}

interface SearchParams {
  checkin: string;
  checkout: string;
  adults: number;
}

const BookingV2 = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<AvailabilityResult[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [searchParams, setSearchParams] = useState<SearchParams | null>(null);
  const [sortOrder, setSortOrder] = useState('relevance');
  const [heroImageUrl, setHeroImageUrl] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');

  const searchFormRef = useRef<HTMLDivElement>(null);

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
    };

    fetchInitialData();
  }, []);

  useEffect(() => {
    if (!results) {
      return;
    }
    let sortedResults = [...results];
    if (sortOrder === 'price_asc') {
      sortedResults.sort((a, b) => a.valorTotal - b.valorTotal);
    } else if (sortOrder === 'price_desc') {
      sortedResults.sort((a, b) => b.valorTotal - a.valorTotal);
    } else if (sortOrder === 'relevance') {
      sortedResults = [...results];
    }
    setResults(sortedResults);
  }, [sortOrder]);

  const handleSearch = async (params: SearchParams) => {
    setIsLoading(true);
    setResults(null);
    setError(null);
    setSearchParams(params);

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

      // Buscar dados locais dos quartos
      const { data: localRoomsData, error: localError } = await supabase
        .from('rooms')
        .select('id, name, special_name, details, details_order, api_category_id');

      if (localError) {
        console.warn("Erro ao buscar dados locais dos quartos:", localError);
      }

      console.log('[BookingV2] Dados locais dos quartos:', localRoomsData);
      console.log('[BookingV2] Dados da API externa:', data);

      // Construir mapa de imagens de capa do storage baseado no ID da tabela rooms
      const coverImageMap = new Map<number, string>();
      try {
        const { data: coverFiles, error: coverError } = await supabase.storage.from('gallery').list('rooms');
        if (coverError) {
          console.warn("Erro ao buscar imagens de capa:", coverError);
        } else if (coverFiles) {
          for (const file of coverFiles) {
            if (file.name !== '.emptyFolderPlaceholder') {
              const roomIdMatch = file.name.match(/^(\d+)\./);
              if (roomIdMatch) {
                const roomId = parseInt(roomIdMatch[1], 10);
                const { data: { publicUrl } } = supabase.storage.from('gallery').getPublicUrl(`rooms/${file.name}`);
                coverImageMap.set(roomId, `${publicUrl}?t=${new Date().getTime()}`);
              }
            }
          }
        }
      } catch (e) {
        console.warn("Erro ao construir mapa de imagens de capa:", e);
      }

      console.log('[BookingV2] Mapa de imagens de capa:', Object.fromEntries(coverImageMap));

      // Mesclar dados da API com dados locais usando mapeamento direto: api_category_id === idQuarto da API
      const mergedResults = data.map((apiRoom: any) => {
        const localRoom = localRoomsData?.find(lr => lr.api_category_id === apiRoom.idQuarto);
        
        console.log(`[BookingV2] API Room ID: ${apiRoom.idQuarto}, Local Room Match:`, localRoom);
        
        return {
          ...apiRoom,
          idQuarto: localRoom ? localRoom.id : apiRoom.idQuarto, // Usa o ID do Supabase se encontrado, senão o da API
          apiRoomId: apiRoom.idQuarto, // Mantém o ID original da API para reserva
          api_category_id: apiRoom.idQuarto, // O api_category_id é o idQuarto original da API
          imageUrl: localRoom ? coverImageMap.get(localRoom.id) || null : null, // Busca imagem baseada no ID do Supabase
          details: localRoom?.details || null,
          details_order: localRoom?.details_order || null,
          special_name: localRoom?.special_name || null,
        };
      });

      console.log('[BookingV2] Resultados mesclados:', mergedResults);

      // Filtrar apenas quartos com disponibilidade > 0 E valorTotal > 0
      const availableResults = mergedResults.filter(room => room.disponibilidade > 0 && room.valorTotal > 0);

      console.log('[BookingV2] Quartos disponíveis (disponibilidade > 0 E valorTotal > 0):', availableResults);
      console.log('[BookingV2] Número de quartos disponíveis:', availableResults.length);

      setResults(availableResults);
      setIsLoading(false);
    } catch (e: any) {
      console.error("Erro ao buscar disponibilidade:", e);
      const errorMessage = e.message || "Ocorreu um erro ao buscar a disponibilidade. Tente novamente.";
      setError(errorMessage);
      showError(errorMessage);
      setIsLoading(false);
    }
  };

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
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70" />
          <div className="relative container mx-auto px-4 text-center">
            <div className="max-w-4xl mx-auto">
              <h1 className={cn(
                "text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-lg transition-all duration-700 ease-out",
                isMounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              )}>
                Reserva de Acomodações
              </h1>
              <p className={cn(
                "text-gray-200 text-lg drop-shadow-md transition-all duration-700 ease-out delay-200",
                isMounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              )}>
                Verifique a disponibilidade e reserve sua estadia perfeita.
              </p>
            </div>
          </div>
        </section>

        <div ref={searchFormRef} className="relative z-10 -mt-16">
          <AvailabilitySearchForm onSearch={handleSearch} isLoading={isLoading} />
        </div>

        <div id="results-container" className="container mx-auto px-4 max-w-5xl pt-4 pb-16">
          {isLoading && (
            <div className="flex flex-col items-center justify-center text-center p-10 bg-white rounded-lg shadow-md">
              <Loader2 className="h-12 w-12 animate-spin text-blue-600 mb-4" />
              <p className="text-lg font-semibold text-gray-700">Buscando disponibilidade...</p>
              <p className="text-gray-500">Por favor, aguarde um momento.</p>
            </div>
          )}
          {error && (
            <div className="flex flex-col items-center justify-center text-center p-10 bg-red-50 rounded-lg shadow-md border border-red-200">
              <ServerCrash className="h-12 w-12 text-red-500 mb-4" />
              <p className="text-lg font-semibold text-red-700">Ocorreu um Erro</p>
              <p className="text-red-600 max-w-md">{error}</p>
            </div>
          )}
          {!isLoading && !error && !results && (
            <InitialBookingState />
          )}
          {results && searchParams && (
            <>
              <BookingStickyControls
                searchParams={searchParams}
                sortOrder={sortOrder}
                onSortChange={setSortOrder}
                scrollToSearchForm={scrollToSearchForm}
                viewMode={viewMode}
                onViewModeChange={setViewMode}
                availableRoomsCount={results.filter(room => room.disponibilidade > 0).length}
              />

              <AvailabilityResults 
                results={results} 
                searchParams={searchParams} 
                viewMode={viewMode}
              />
            </>
          )}
        </div>
      </main>
      <SimpleFooter />
    </div>
  );
};

export default BookingV2;