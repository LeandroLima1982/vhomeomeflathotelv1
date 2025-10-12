"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface AvailabilityResultsProps {
  loading: boolean;
  error: string | null;
  results: any[] | null;
}

export function AvailabilityResults({ loading, error, results }: AvailabilityResultsProps) {
  if (loading) {
    return (
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto text-blue-800" />
          <p className="mt-4 text-gray-600">Verificando disponibilidade...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <Card className="max-w-lg mx-auto bg-red-50 border-red-200">
            <CardContent className="pt-6">
              <p className="text-red-700">{error}</p>
            </CardContent>
          </Card>
        </div>
      </section>
    );
  }

  if (!results || results.length === 0) {
    return null;
  }

  const bookingBaseUrl = "https://vhomeflathotel.motordereservas.com.br/novareserva";

  return (
    <section id="availability" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-12">Acomodações Disponíveis</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {results.map((room, index) => (
            <Card key={index} className="flex flex-col">
              <CardHeader>
                <CardTitle>{room.categoriaNome || 'Categoria Indisponível'}</CardTitle>
                {room.descricao && <CardDescription>{room.descricao}</CardDescription>}
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-2xl font-bold text-blue-800 mb-4">
                  {room.valor ? `R$ ${parseFloat(room.valor).toFixed(2)}` : 'Preço sob consulta'}
                  <span className="text-sm font-normal text-gray-500"> / noite</span>
                </p>
              </CardContent>
              <div className="p-6 pt-0">
                {room.idquartoCategoria ? (
                  <a
                    href={`${bookingBaseUrl}?idquartoCategoria=${room.idquartoCategoria}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full"
                  >
                    <Button className="w-full bg-green-600 hover:bg-green-700">Reservar Agora</Button>
                  </a>
                ) : (
                  <Button className="w-full" disabled>Reserva Indisponível</Button>
                )}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}