"use client";

import { RoomResultCardV3 } from "./RoomResultCardV3";
import { RoomResultGridCardV3 } from "./RoomResultGridCardV3";
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

interface AvailabilityResultsV3Props {
  results: AvailabilityResult[];
  searchParams: SearchParams;
  viewMode: 'list' | 'grid';
}

export function AvailabilityResultsV3({ results, searchParams, viewMode }: AvailabilityResultsV3Props) {
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
    <div className="pt-4">
      {viewMode === 'list' ? (
        <div className="space-y-6">
          {availableRooms.map((room) => (
            <RoomResultCardV3 key={room.idQuarto} room={room} searchParams={searchParams} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {availableRooms.map((room) => (
            <RoomResultGridCardV3 key={room.idQuarto} room={room} searchParams={searchParams} />
          ))}
        </div>
      )}
    </div>
  );
}