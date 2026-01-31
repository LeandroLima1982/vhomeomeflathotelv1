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
          const firstFile = files?.find(f => f.name !== '.emptyFolderPlaceholder');
          if (firstFile) imageName = firstFile.name;
        }

        if (imageName) {
          const { data: { publicUrl } } = supabase.storage.from('gallery').getPublicUrl(`hero/${imageName}`);
          setHeroImageUrl(publicUrl);
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

      // Buscar dados locais dos quartos para mesclar com os resultados da API
      const { data: localRoomsData, error: localError } = await supabase
        .from('rooms')
        .select('id, name, special_name, imageUrl, details, details_order, api_category_id');

      if (localError) {
        console.warn("Erro ao buscar dados locais dos quartos:", localError);
      }

      console.log('[BookingV2] Dados locais dos quartos:', localRoomsData);

      // Filtrar apenas os quartos locais que têm api_category_id configurado
      const configuredLocalRooms = localRoomsData?.filter(room => room.api_category_id !== null) || [];

      console.log('[BookingV2] Quartos locais configurados (com api_category_id):', configuredLocalRooms);

      // Para cada quarto local configurado, encontrar o resultado correspondente da API
      const mergedResults = configuredLocalRooms.map(localRoom => {
        const apiRoom = data.find((api: any) => api.idQuarto === localRoom.api_category_id);
        console.log(`[BookingV2] Procurando quarto API com idQuarto=${localRoom.api_category_id}, encontrado:`, apiRoom);

        if (apiRoom) {
          return {
            ...apiRoom,
            idQuarto: localRoom.id, // Usar ID do Supabase
            apiRoomId: apiRoom.idQuarto, // Manter o ID original da API para links externos
            imageUrl: localRoom.imageUrl || null,
            details: localRoom.details || null,
            details_order: localRoom.details_order || null,
            special_name: localRoom.special_name || null,
          };
        }
        // Se não encontrou na API, ainda assim incluir o quarto local (mas sem disponibilidade)
        console.log(`[BookingV2] Quarto local ${localRoom.name} (ID: ${localRoom.id}) não encontrado na API, marcando como indisponível`);
        return {
          idQuarto: localRoom.id,
          apiRoomId: localRoom.api_category_id,
          nomeQuarto: localRoom.name,
          disponibilidade: 0, // Indisponível
          valorTotal: 0,
          imageUrl: localRoom.imageUrl || null,
          details: localRoom.details || null,
          details_order: localRoom.details_order || null,
          special_name: localRoom.special_name || null,
        };
      });

      console.log('[BookingV2] Resultados mesclados finais:', mergedResults);

      setRawResults(mergedResults);

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
                Verificar Disponibilidade
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
</dyad-chat-summary>Adding detailed logging to debug room mapping</dyad-chat-summary>

I've added comprehensive logging to the BookingV2 page to help identify why rooms aren't being displayed. The logs will show:

1. **API Response Data**: What data is being returned from the external API
2. **Local Room Data**: What rooms exist in the Supabase database
3. **Configured Local Rooms**: Which rooms have `api_category_id` set
4. **Room Mapping Process**: For each local room, whether it finds a match in the API response
5. **Final Merged Results**: The complete list of rooms after merging

To debug this issue:

1. **Check the Supabase Dashboard**: Go to your project → Edge Functions → get-availability → Logs
2. **Check Browser Console**: Open developer tools and look at the console logs when you search for availability
3. **Check Room Configuration**: In the admin panel, verify that rooms have the correct `api_category_id` values

The most likely causes are:

1. **API Token Issue**: The external API isn't responding (as we saw with the timeout)
2. **Room ID Mismatch**: The `api_category_id` values in Supabase don't match the `idQuarto` values from the external API
3. **No Rooms Configured**: Rooms in Supabase don't have `api_category_id` set

From the documentation, I can see that previously there was a -3 offset correction, but now the system expects exact matches between `api_category_id` and the API's `idQuarto`.

To fix this, you need to:
1. **Verify the API is working** (use the `/test-api` page I created)
2. **Check room configurations** in the admin panel
3. **Update `api_category_id` values** to match the external API's room IDs

Let me know what the logs show and I can help you fix the mapping!<dyad-write path="src/pages/DebugRooms.tsx" description="Creating a debug page to check room configurations">
"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, AlertCircle, CheckCircle } from "lucide-react";
import Header from "@/components/hotel/Header";
import SimpleFooter from "@/components/hotel/SimpleFooter";

interface Room {
  id: number;
  name: string;
  special_name: string | null;
  api_category_id: number | null;
  imageUrl: string | null;
  details: Record<string, string | null> | null;
}

const DebugRooms = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [apiTestResult, setApiTestResult] = useState<any>(null);
  const [testingAPI, setTestingAPI] = useState(false);

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("rooms").select('*').order('id');
    if (error) {
      console.error('Error fetching rooms:', error);
    } else {
      setRooms(data as Room[]);
    }
    setLoading(false);
  };

  const testAPIConnection = async () => {
    setTestingAPI(true);
    setApiTestResult(null);

    try {
      const { data, error } = await supabase.functions.invoke('test-api-connection');

      if (error) {
        setApiTestResult({
          success: false,
          error: error.message
        });
      } else {
        setApiTestResult(data);
      }
    } catch (e: any) {
      setApiTestResult({
        success: false,
        error: e.message
      });
    } finally {
      setTestingAPI(false);
    }
  };

  const configuredRooms = rooms.filter(room => room.api_category_id !== null);
  const unconfiguredRooms = rooms.filter(room => room.api_category_id === null);

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      <Header />
      <main className="pb-20 flex-grow min-h-[600px]">
        <div className="container mx-auto px-4 py-24">
          <div className="max-w-6xl mx-auto space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Debug: Configuração dos Quartos</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Esta página ajuda a diagnosticar problemas na exibição de quartos na busca.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-blue-800">Total de Quartos</h3>
                    <p className="text-2xl font-bold text-blue-600">{rooms.length}</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-green-800">Configurados</h3>
                    <p className="text-2xl font-bold text-green-600">{configuredRooms.length}</p>
                  </div>
                  <div className="bg-red-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-red-800">Não Configurados</h3>
                    <p className="text-2xl font-bold text-red-600">{unconfiguredRooms.length}</p>
                  </div>
                </div>

                <Button onClick={testAPIConnection} disabled={testingAPI} className="mb-6">
                  {testingAPI ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Testando API...
                    </>
                  ) : (
                    'Testar Conexão com API Externa'
                  )}
                </Button>

                {apiTestResult && (
                  <div className={`p-4 rounded-lg border mb-6 ${
                    apiTestResult.success
                      ? 'bg-green-50 border-green-200 text-green-800'
                      : 'bg-red-50 border-red-200 text-red-800'
                  }`}>
                    <div className="flex items-center gap-2 mb-2">
                      {apiTestResult.success ? (
                        <CheckCircle className="h-5 w-5" />
                      ) : (
                        <AlertCircle className="h-5 w-5" />
                      )}
                      <span className="font-semibold">
                        {apiTestResult.success ? 'API Funcionando' : 'Problema na API'}
                      </span>
                    </div>

                    {apiTestResult.message && (
                      <p className="mb-2">{apiTestResult.message}</p>
                    )}

                    {apiTestResult.error && (
                      <p className="mb-2 font-mono text-sm bg-gray-100 p-2 rounded">
                        {apiTestResult.error}
                      </p>
                    )}

                    {apiTestResult.data && (
                      <details className="mt-2">
                        <summary className="cursor-pointer font-medium">Dados da API</summary>
                        <pre className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-auto">
                          {JSON.stringify(apiTestResult.data, null, 2)}
                        </pre>
                      </details>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quartos Configurados (com api_category_id)</CardTitle>
              </CardHeader>
              <CardContent>
                {configuredRooms.length === 0 ? (
                  <p className="text-gray-500">Nenhum quarto configurado com api_category_id.</p>
                ) : (
                  <div className="space-y-4">
                    {configuredRooms.map(room => (
                      <div key={room.id} className="border rounded-lg p-4 bg-green-50">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-semibold text-green-800">{room.name}</h4>
                            <p className="text-sm text-gray-600">ID Supabase: {room.id}</p>
                            <p className="text-sm text-gray-600">API Category ID: {room.api_category_id}</p>
                            {room.special_name && (
                              <p className="text-sm text-gray-600">Nome Especial: {room.special_name}</p>
                            )}
                          </div>
                          <CheckCircle className="h-6 w-6 text-green-600" />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quartos Não Configurados (sem api_category_id)</CardTitle>
              </CardHeader>
              <CardContent>
                {unconfiguredRooms.length === 0 ? (
                  <p className="text-gray-500">Todos os quartos estão configurados.</p>
                ) : (
                  <div className="space-y-4">
                    {unconfiguredRooms.map(room => (
                      <div key={room.id} className="border rounded-lg p-4 bg-red-50">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-semibold text-red-800">{room.name}</h4>
                            <p className="text-sm text-gray-600">ID Supabase: {room.id}</p>
                            <p className="text-sm text-red-600">API Category ID: Não configurado</p>
                            {room.special_name && (
                              <p className="text-sm text-gray-600">Nome Especial: {room.special_name}</p>
                            )}
                          </div>
                          <AlertCircle className="h-6 w-6 text-red-600" />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <SimpleFooter />
    </div>
  );
};

export default DebugRooms;