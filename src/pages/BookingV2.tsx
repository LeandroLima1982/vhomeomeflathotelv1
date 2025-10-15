import { useState, useEffect } from "react";
import Header from "@/components/hotel/Header";
import { AvailabilitySearchForm } from "@/components/hotel/AvailabilitySearchForm";
import Footer from "@/components/hotel/Footer";
import { supabase } from "@/lib/supabaseClient";
import { showError } from "@/utils/toast";
import { Loader2, ServerCrash } from "lucide-react";
import { AvailabilityResults } from "@/components/hotel/AvailabilityResults";
import { FilterControls } from "@/components/hotel/FilterControls";

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
  const [sortOrder, setSortOrder] = useState('relevance');
  const [heroImageUrl, setHeroImageUrl] = useState<string | null>(null);

  useEffect(() => {
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

      const roomsWithImages = await Promise.all(
        roomData.map(async (room) => {
          let imageUrl: string | null = null;
          try {
            // Try to find a cover image directly in 'rooms/' folder
            const { data: coverFiles } = await supabase.storage
              .from('gallery')
              .list('rooms', { search: `${room.id}.` }); // e.g., '4.png'

            if (coverFiles && coverFiles.length > 0) {
              const coverFile = coverFiles[0]; // Take the first one found
              const { data: { publicUrl } } = supabase.storage
                .from('gallery')
                .getPublicUrl(`rooms/${coverFile.name}`);
              imageUrl = `${publicUrl}?t=${new Date().getTime()}`; // Add timestamp to bust cache
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
                    firstImageName = validFiles[0].name; // Fallback to first file if no order or parsing error
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
    } else if (sortOrder === 'relevance') { // Adicionando ordenação por idQuarto para 'relevance'
      sortedResults.sort((a, b) => a.idQuarto - b.idQuarto);
    }
    setDisplayedResults(sortedResults);
  }, [rawResults, sortOrder]);

  const handleSearch = async (params: SearchParams) => {
    setIsLoading(true);
    setRawResults(null);
    setError(null);
    setSearchParams(params);
    setSortOrder('relevance');

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
        const adjustedRoomId = apiRoom.idQuarto - 3; // CORRIGIDO: Subtraindo 3 para alinhar com IDs do Supabase
        const localRoom = localRoomsData.find(lr => lr.id === adjustedRoomId);
        return {
          ...apiRoom,
          idQuarto: adjustedRoomId, 
          imageUrl: localRoom?.imageUrl || null,
          details: localRoom?.details || null,
          details_order: localRoom?.details_order || null,
          special_name: localRoom?.special_name || null,
        };
      });

      const pricedResults = mergedResults.filter(room => room.valorTotal > 0);
      setRawResults(pricedResults);

    } catch (e: any) {
      console.error("Erro ao buscar disponibilidade:", e);
      const errorMessage = e.message || "Ocorreu um erro ao buscar a disponibilidade. Tente novamente.";
      setError(errorMessage);
      showError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <Header />
      <main>
        <section
          className="relative bg-cover bg-center bg-gray-700 py-40"
          style={{ backgroundImage: `url(${heroImageUrl || ''})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/40" />
          <div className="relative container mx-auto px-4 text-center">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-lg">
                Consulta de Disponibilidade
              </h1>
              <p className="text-gray-200 text-lg drop-shadow-md">
                Selecione as datas e o número de hóspedes para encontrar a acomodação perfeita para sua estadia.
              </p>
            </div>
          </div>
        </section>

        <div className="relative z-10 -mt-16">
          <AvailabilitySearchForm onSearch={handleSearch} isLoading={isLoading} />
        </div>

        <div id="results-container" className="container mx-auto px-4 max-w-5xl py-16">
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
          {displayedResults && searchParams && (
            <>
              <FilterControls sortOrder={sortOrder} onSortChange={setSortOrder} />
              <AvailabilityResults results={displayedResults} searchParams={searchParams} />
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default BookingV2;