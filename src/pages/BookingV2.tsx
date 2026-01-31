"use client";

import { useState, useEffect, useRef } from "react";
import Header from "@/components/hotel/Header";
import { AvailabilitySearchForm } from "@/components/hotel/AvailabilitySearchForm";
import SimpleFooter from "@/components/hotel/SimpleFooter";
import { supabase } from "@/lib/supabaseClient";
import { showError } from "@/utils/toast";
import { Loader2, ServerCrash, Calendar, Users, Search } from "lucide-react";
import { AvailabilityResults } from "@/components/hotel/AvailabilityResults";
import { format, parse } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { InitialBookingState } from "@/components/hotel/InitialBookingState";
import { BookingStickyControls } from "@/components/hotel/BookingStickyControls";

// Interface para os resultados da API externa
interface AvailabilityResult {
  idQuarto: number;
  apiRoomId: number; // Campo para o ID original da API
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

const BookingV2 = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [rawResults, setRawResults] = useState<AvailabilityResult[] | null>(null);
  const [displayedResults, setDisplayedResults] = useState<AvailabilityResult[] | null>(null);
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

      // Fetch Hero Image (this still comes from Supabase as it's a UI element, not room data)
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

  const handleSearch = async (params: SearchParams) => {
    setIsLoading(true);
    setRawResults(null);
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
      console.log('[BookingV2] Iniciando busca de disponibilidade com parâmetros:', params);

      const { data, error: functionError } = await supabase.functions.invoke('get-availability', {
        body: params,
      });

      if (functionError) {
        const errorDetails = await functionError.context.json();
        if (errorDetails && errorDetails.error) throw new Error(errorDetails.error);
        throw new Error(functionError.message || "Erro na comunicação com a função.");
      }

      if (data.error) throw new Error(data.error);

      console.log('[BookingV2] Dados recebidos da API:', data);
      console.log('[BookingV2] Número de quartos retornados pela API:', data.length);

      // Buscar dados locais dos quartos para mesclar com os resultados da API
      const { data: localRoomsData, error: localError } = await supabase
        .from('rooms')
        .select('id, name, special_name, imageUrl, details, details_order, api_category_id');

      if (localError) {
        console.warn("Erro ao buscar dados locais dos quartos:", localError);
      }

      console.log('[BookingV2] Dados locais dos quartos:', localRoomsData);
      console.log('[BookingV2] Número de quartos locais:', localRoomsData?.length || 0);

      // Buscar todas as imagens de capa dos quartos
      const { data: coverFiles, error: coverError } = await supabase.storage.from('gallery').list('rooms');

      const coverImageMap = new Map<number, string>();
      if (coverFiles && !coverError) {
        coverFiles.forEach(file => {
          const match = file.name.match(/^(\d+)\./);
          if (match) {
            const roomId = parseInt(match[1], 10);
            const { data: { publicUrl } } = supabase.storage.from('gallery').getPublicUrl(`rooms/${file.name}`);
            coverImageMap.set(roomId, `${publicUrl}?t=${new Date().getTime()}`);
          }
        });
      }

      console.log('[BookingV2] Mapa de imagens de capa:', coverImageMap);

      // MODIFICAÇÃO: Em vez de filtrar apenas quartos locais configurados,
      // vamos mostrar TODOS os quartos da API disponíveis
      const mergedResults = data.map((apiRoom: any) => {
        // Tentar encontrar correspondência local
        const localRoom = localRoomsData?.find(lr => lr.api_category_id === apiRoom.idQuarto);

        console.log(`[BookingV2] Processando quarto API ${apiRoom.idQuarto}:`, {
          apiRoom,
          localRoom: localRoom || 'não encontrado'
        });

        if (localRoom) {
          // Se encontrou correspondência local, usar dados locais
          return {
            ...apiRoom,
            idQuarto: localRoom.id, // Usar ID do Supabase
            apiRoomId: apiRoom.idQuarto, // Manter o ID original da API para links externos
            imageUrl: localRoom.imageUrl || coverImageMap.get(localRoom.id) || null,
            details: localRoom.details || null,
            details_order: localRoom.details_order || null,
            special_name: localRoom.special_name || null,
          };
        } else {
          // Se NÃO encontrou correspondência local, ainda assim mostrar o quarto da API
          // com dados padrão, mas tentar buscar imagem de capa usando ID ajustado
          const adjustedId = apiRoom.idQuarto - 3; // Usando offset da documentação
          const coverImage = coverImageMap.get(adjustedId);

          console.log(`[BookingV2] Quarto API ${apiRoom.idQuarto} não tem correspondência local, usando ID ajustado ${adjustedId}, imagem encontrada:`, !!coverImage);

          return {
            ...apiRoom,
            idQuarto: adjustedId, // Usar ID ajustado como ID do Supabase
            apiRoomId: apiRoom.idQuarto, // Manter o ID original da API para links externos
            imageUrl: coverImage || null, // Usar imagem de capa se encontrada
            details: null, // Sem detalhes locais
            details_order: null, // Sem ordem de detalhes
            special_name: null, // Sem nome especial
          };
        }
      });

      console.log('[BookingV2] Resultados mesclados finais:', mergedResults);
      console.log('[BookingV2] Número de quartos mesclados:', mergedResults.length);

      // Filtrar apenas quartos com disponibilidade > 0 E valorTotal > 0
      const availableResults = mergedResults.filter(room => room.disponibilidade > 0 && room.valorTotal > 0);

      console.log('[BookingV2] Quartos disponíveis (disponibilidade > 0 E valorTotal > 0):', availableResults);
      console.log('[BookingV2] Número de quartos disponíveis:', availableResults.length);

      setRawResults(availableResults);

    } catch (e: any) {
      console.error("Erro ao buscar disponibilidade:", e);
      const errorMessage = e.message || "Ocorreu um erro ao buscar a disponibilidade. Tente novamente.";
      setError(errorMessage);
      showError(errorMessage);
    } finally {
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
                Encontre e reserve sua acomodação perfeita em Macaé
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
          {!isLoading && !error && !displayedResults && (
            <InitialBookingState />
          )}
          {displayedResults && searchParams && (
            <>
              <BookingStickyControls
                searchParams={searchParams}
                sortOrder={sortOrder}
                onSortChange={setSortOrder}
                scrollToSearchForm={scrollToSearchForm}
                viewMode={viewMode}
                onViewModeChange={setViewMode}
                availableRoomsCount={displayedResults.filter(room => room.disponibilidade > 0).length}
              />

              <AvailabilityResults
                results={displayedResults}
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