"use client";

import { RoomResultCard } from "./RoomResultCard";
import { BedDouble } from "lucide-react";

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

interface AvailabilityResultsProps {
  results: AvailabilityResult[];
  searchParams: SearchParams;
}

export function AvailabilityResults({ results, searchParams }: AvailabilityResultsProps) {
  const availableRooms = results.filter(room => room.disponibilidade > 0);

  if (availableRooms.length === 0) {
    return (
      <div className="text-center p-10 bg-white rounded-lg shadow-md">
        <BedDouble className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-700">Nenhuma Acomodação Disponível</h3>
        <p className="text-gray-500 mt-2">
          Não encontramos quartos disponíveis para as datas e número de hóspedes selecionados. Por favor, tente outras datas.
        </p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-center mb-8 text-gray-800">Acomodações Disponíveis</h2>
      <div className="space-y-6">
        {availableRooms.map((room) => (
          <RoomResultCard key={room.idQuarto} room={room} searchParams={searchParams} />
        ))}
      </div>
    </div>
  );
}