import { useState, useEffect } from "react";
import Header from "@/components/hotel/Header";
import { AvailabilitySearchForm } from "@/components/hotel/AvailabilitySearchForm";
import Footer from "@/components/hotel/Footer";
import { supabase } from "@/lib/supabaseClient";
import { showError } from "@/utils/toast";
import { Loader2, ServerCrash } from "lucide-react";
import { AvailabilityResults } from "@/components/hotel/AvailabilityResults";

interface LocalRoom {
  id: number;
  name: string;
  imageUrl: string | null;
}

interface AvailabilityResult {
  idQuarto: number;
  nomeQuarto: string;
  disponibilidade: number;
  valorTotal: number;
  imageUrl: string | null;
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
  const [localRoomsData, setLocalRoomsData] = useState<LocalRoom[]>([]);
  const [searchParams, setSearchParams] = useState<SearchParams | null>(null);

  useEffect(() => {
    const fetchLocalRooms = async () => {
      if (!supabase) return;
      
      const { data: roomData, error: roomError } = await supabase
        .from('rooms')
        .select('id, name')
        .order('id');

      if (roomError) {
        console.error("Error fetching local rooms:", roomError);
        return;
      }

      const roomsWithImages = await Promise.all(
        roomData.map(async (room) => {
          // 1. Tenta buscar a imagem de capa principal
          const { data: coverFiles } = await supabase.storage
            .from('gallery')
            .list('rooms', { search: `${room.id}.` });

          if (coverFiles && coverFiles.length > 0) {
            const { data: { publicUrl } } = supabase.storage
              .from('gallery')
              .getPublicUrl(`rooms/${coverFiles[0].name}`);
            return { ...room, imageUrl: `${publicUrl}?t=${new Date().getTime()}` };
          }

          // 2. Fallback: Busca a primeira imagem da galeria do quarto
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
              const { data: orderFileData } = await supabase.storage
                .from('gallery')
                .download(`rooms/${room.id}/gallery/_order.json`);

              let firstImageName = validFiles[0].name;

              if (orderFileData) {
                try {
                  const orderJson = await orderFileData.text();
                  const orderedNames = JSON.parse(orderJson) as string[];
                  if (orderedNames.length > 0) {
                    firstImageName = orderedNames[0];
                  }
                } catch (e) {
                  console.warn(`Could not parse order file for room ${room.id}`);
                }
              }

              const { data: { publicUrl } } = supabase.storage
                .from('gallery')
                .getPublicUrl(`rooms/${room.id}/gallery/${firstImageName}`);
              
              return { ...room, imageUrl: `${publicUrl}?t=${new Date().getTime()}` };
            }
          }

          // 3. Se não encontrar nenhuma imagem
          return { ...room, imageUrl: null };
        })
      );
      setLocalRoomsData(roomsWithImages);
    };

    fetchLocalRooms();
  }, []);

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
        if (errorDetails && errorDetails.error) {
          throw new Error(errorDetails.error);
        }
        throw new Error(functionError.message || "Erro na comunicação com a função.");
      }
      
      if (data.error) {
        throw new Error(data.error);
      }

      const normalizeName = (name: string) => {
        if (!name) return '';
        return name
          .trim()
          .toLowerCase()
          .replace(/[áàâã]/g, 'a')
          .replace(/[éèê]/g, 'e')
          .replace(/[íìî]/g, 'i')
          .replace(/[óòôõ]/g, 'o')
          .replace(/[úùû]/g, 'u')
          .replace(/[ç]/g, 'c')
          .replace(/[^a-z0-9\s]/g, '')
          .replace(/\s+/g, ' ');
      };

      const mergedResults = data.map((apiRoom: any) => {
        const normalizedApiName = normalizeName(apiRoom.nomeQuarto);
        const localRoom = localRoomsData.find(lr => lr.id === apiRoom.idQuarto) || 
                          localRoomsData.find(lr => normalizeName(lr.name) === normalizedApiName);
        return {
          ...apiRoom,
          imageUrl: localRoom ? localRoom.imageUrl : null,
        };
      });

      setResults(mergedResults);

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
      <main className="pt-32 pb-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              Consulta de Disponibilidade
            </h1>
            <p className="text-gray-600">
              Selecione as datas e o número de hóspedes para encontrar a acomodação perfeita para sua estadia.
            </p>
          </div>

          <div className="mb-16">
            <AvailabilitySearchForm onSearch={handleSearch} isLoading={isLoading} />
          </div>

          <div id="results-container" className="max-w-5xl mx-auto">
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
            {results && searchParams && (
              <AvailabilityResults results={results} searchParams={searchParams} />
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default BookingV2;