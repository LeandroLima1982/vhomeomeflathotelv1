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
  const resultsContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsMounted(true);
    const fetchInitialData = async () => {
      if (!supabase) return;

      try {
        const timestamp = new Date().getTime();
        const { data: orderFileData } = await supabase.storage.from('gallery').download(`hero/_order.json?t=${timestamp}`);
        let imageName: string | null = null;

        if (orderFileData) {
          const orderJson = await orderFileData.text();
          const orderedNames = JSON.parse(orderJson) as string[];
          if (orderedNames.length > 0) imageName = orderedNames[0];
        }

        if (!imageName) {
          const { data: files } = await supabase.storage.from('gallery').list('hero');
          const firstFile = files?.find(f => f.name !== '_order.json' && f.name !== '.emptyFolderPlaceholder');
          if (firstFile) imageName = firstFile.name;
        }

        if (imageName) {
          const { data: { publicUrl } } = supabase.storage.from('gallery').getPublicUrl(`hero/${imageName}`);
          setHeroImageUrl(`${publicUrl}?t=${timestamp}`);
        }
      } catch (e) {
        setHeroImageUrl("https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto-format&fit=crop&q=80");
      }
    };

    fetchInitialData();
  }, []);

  useEffect(() => {
    if (!results) return;
    let sortedResults = [...results];
    if (sortOrder === 'price_asc') {
      sortedResults.sort((a, b) => a.valorTotal - b.valorTotal);
    } else if (sortOrder === 'price_desc') {
      sortedResults.sort((a, b) => b.valorTotal - a.valorTotal);
    }
    setResults(sortedResults);
  }, [sortOrder]);

  const handleSearch = async (params: SearchParams) => {
    setIsLoading(true);
    setResults(null);
    setError(null);
    setSearchParams(params);

    if (!supabase) {
      setError("Erro de conexão.");
      setIsLoading(false);
      return;
    }

    try {
      const timestamp = new Date().getTime();
      
      // 1. Buscar disponibilidade da API
      const { data: apiData, error: functionError } = await supabase.functions.invoke('get-availability', {
        body: params,
      });

      if (functionError || apiData.error) throw new Error("Erro ao consultar API externa.");

      // 2. Buscar dados locais (com cache-buster para garantir descrições)
      const { data: localRoomsData, error: localError } = await supabase
        .from('rooms')
        .select('*')
        .order('id');

      if (localError) throw new Error("Erro ao carregar dados das acomodações.");

      // 3. Mapa de imagens com timestamp
      const { data: coverFiles } = await supabase.storage.from('gallery').list('rooms');
      const coverImageMap = new Map<number, string>();
      coverFiles?.forEach(file => {
        const match = file.name.match(/^(\d+)\./);
        if (match) {
          const { data: { publicUrl } } = supabase.storage.from('gallery').getPublicUrl(`rooms/${file.name}`);
          coverImageMap.set(parseInt(match[1]), `${publicUrl}?t=${timestamp}`);
        }
      });

      const getTokens = (str: string) => str?.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").split(/\s+/).filter(t => t.length > 1) || [];

      const mergedResults = localRoomsData.map((localRoom: any) => {
        const localTokens = getTokens(localRoom.name);
        const apiRoom = apiData.find((api: any) => {
          if (api.idQuarto === localRoom.api_category_id) return true;
          const apiTokens = getTokens(api.nomeQuarto);
          return localTokens.every(token => apiTokens.includes(token));
        });

        if (!apiRoom) return null;

        return {
          ...apiRoom,
          idQuarto: localRoom.id,
          apiRoomId: apiRoom.idQuarto,
          imageUrl: coverImageMap.get(localRoom.id) || null,
          details: localRoom.details,
          details_order: localRoom.details_order,
          special_name: localRoom.special_name,
          nomeQuarto: localRoom.name,
          booking_url: localRoom.booking_url
        };
      }).filter(Boolean);

      setResults(mergedResults);
      
      if (mergedResults.length > 0) {
        setTimeout(() => resultsContainerRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
      }

    } catch (e: any) {
      setError(e.message);
      showError(e.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      <Header />
      <main className="pb-20 flex-grow">
        <section className="relative bg-cover bg-center py-40" style={{ backgroundImage: `url(${heroImageUrl || ''})` }}>
          <div className="absolute inset-0 bg-black/60" />
          <div className="relative container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Reserva de Acomodações</h1>
            <p className="text-gray-200 text-lg">Verifique a disponibilidade e reserve sua estadia.</p>
          </div>
        </section>

        <div ref={searchFormRef} className="relative z-10 -mt-16">
          <AvailabilitySearchForm onSearch={handleSearch} isLoading={isLoading} />
        </div>

        <div ref={resultsContainerRef} className="container mx-auto px-4 max-w-5xl pt-4 pb-16">
          {isLoading ? (
            <div className="text-center p-10 bg-white rounded-lg shadow-md">
              <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
              <p>Buscando disponibilidade...</p>
            </div>
          ) : error ? (
            <div className="text-center p-10 bg-red-50 rounded-lg border border-red-200">
              <ServerCrash className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <p className="text-red-700">{error}</p>
            </div>
          ) : !results ? (
            <InitialBookingState />
          ) : (
            <>
              <BookingStickyControls
                searchParams={searchParams!}
                sortOrder={sortOrder}
                onSortChange={setSortOrder}
                scrollToSearchForm={() => searchFormRef.current?.scrollIntoView({ behavior: 'smooth' })}
                viewMode={viewMode}
                onViewModeChange={setViewMode}
                availableRoomsCount={results.length}
              />
              <AvailabilityResults results={results} searchParams={searchParams!} viewMode={viewMode} />
            </>
          )}
        </div>
      </main>
      <SimpleFooter />
    </div>
  );
};

export default BookingV2;