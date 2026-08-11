"use client";

import { useState } from "react";
import { RoomResultCard } from "./RoomResultCard";
import { RoomResultGridCard } from "./RoomResultGridCard";
import { BedDouble, List, LayoutGrid } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
// FilterControls não é mais importado aqui, pois foi movido para BookingStickyControls

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
  viewMode: 'list' | 'grid'; // Agora recebemos viewMode como prop
  // sortOrder e onSortChange não são mais necessários aqui
}

export function AvailabilityResults({ results, searchParams, viewMode }: AvailabilityResultsProps) {
  // viewMode não é mais um estado local, é uma prop
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
    <div className="pt-4"> {/* Mantém o padding-top para espaçamento abaixo da barra sticky */}
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
      <div className="mt-6 text-xs text-gray-600 bg-amber-50 border border-amber-200 rounded-lg p-3">
        * Valor de referência. O site é apenas consultivo: o valor final e a disponibilidade dependem
        de consulta prévia para confirmação (via WhatsApp).
      </div>
    </div>
  );
}