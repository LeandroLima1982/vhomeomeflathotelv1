"use client";

import { useState } from "react";
import { RoomResultCard } from "./RoomResultCard";
import { RoomResultGridCard } from "./RoomResultGridCard";
import { BedDouble, List, LayoutGrid } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
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
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800">Acomodações Disponíveis</h2>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setViewMode('list')}
            className={cn(viewMode === 'list' && 'bg-gray-200')}
            aria-label="Visualização em lista"
          >
            <List className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setViewMode('grid')}
            className={cn(viewMode === 'grid' && 'bg-gray-200')}
            aria-label="Visualização em grade"
          >
            <LayoutGrid className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {viewMode === 'list' ? (
        <div className="space-y-6">
          {availableRooms.map((room) => (
            <RoomResultCard key={room.idQuarto} room={room} searchParams={searchParams} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {availableRooms.map((room) => (
            <RoomResultGridCard key={room.idQuarto} room={room} searchParams={searchParams} />
          ))}
        </div>
      )}
    </div>
  );
}