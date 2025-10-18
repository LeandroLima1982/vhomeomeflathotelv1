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
        // Mapeamento personalizado para quartos com offset -4 (API IDs 7, 12 e 13)
        const adjustedRoomId = (apiRoom.idQuarto === 7 || apiRoom.idQuarto === 12 || apiRoom.idQuarto === 13) ? apiRoom.idQuarto - 4 : apiRoom.idQuarto - 3; // Usa -4 para IDs 7, 12 e 13, -3 como fallback
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
                Encontre a acomodação perfeita para sua estadia
              </p>
            </div>
          </div>
        </section>

        <div ref={searchFormRef} className="relative z-10 -mt-16">
          <AvailabilitySearchForm onSearch={handleSearch} isLoading={isLoading} />
        </div>

        <div id="results-container" ref={resultsContainerRef} className="container mx-auto px-4 max-w-5xl pt-4 pb-16">
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
              <h3 className="text-xl font-semibold text-red-700">Ocorreu um Erro</h3>
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