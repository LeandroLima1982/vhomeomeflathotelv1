import { useState } from "react";
import Header from "@/components/hotel/Header";
import { AvailabilitySearchForm } from "@/components/hotel/AvailabilitySearchForm";
import Footer from "@/components/hotel/Footer";
import { supabase } from "@/lib/supabaseClient";
import { showError } from "@/utils/toast";
import { Loader2, ServerCrash } from "lucide-react";

interface AvailabilityResult {
  idQuarto: number;
  nomeQuarto: string;
  disponibilidade: number;
  valorTotal: number;
  [key: string]: any;
}

const BookingV2 = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<AvailabilityResult[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (params: { checkin: string; checkout: string; adults: number }) => {
    setIsLoading(true);
    setResults(null);
    setError(null);

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
        throw functionError;
      }
      
      if (data.error) {
        throw new Error(data.error);
      }

      setResults(data);

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
              Nova Consulta de Disponibilidade (Teste)
            </h1>
            <p className="text-gray-600">
              Esta é uma página de desenvolvimento para a nova experiência de reserva.
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
            {results && (
              <div>
                <h2 className="text-2xl font-bold text-center mb-6">Resultados da Busca</h2>
                <pre className="bg-gray-800 text-white p-4 rounded-lg overflow-x-auto">
                  {JSON.stringify(results, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default BookingV2;