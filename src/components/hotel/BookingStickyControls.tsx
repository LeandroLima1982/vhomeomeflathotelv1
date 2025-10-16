"use client";

import { useState } from "react";
import { Calendar, Users, Search, List, LayoutGrid } from "lucide-react";
import { format, parse } from "date-fns";
import { ptBR } from "date-fns/locale";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FilterControls } from "./FilterControls";
import { cn } from "@/lib/utils";

interface SearchParams {
  checkin: string;
  checkout: string;
  adults: number;
}

interface BookingStickyControlsProps {
  searchParams: SearchParams;
  sortOrder: string;
  onSortChange: (value: string) => void;
  scrollToSearchForm: () => void;
  viewMode: 'list' | 'grid';
  onViewModeChange: (mode: 'list' | 'grid') => void;
  availableRoomsCount: number;
}

export function BookingStickyControls({
  searchParams,
  sortOrder,
  onSortChange,
  scrollToSearchForm,
  viewMode,
  onViewModeChange,
  availableRoomsCount,
}: BookingStickyControlsProps) {
  const formatDate = (dateStr: string) => {
    const date = parse(dateStr, "yyyyMMdd", new Date());
    return format(date, "dd 'de' LLLL 'de' yyyy", { locale: ptBR });
  };

  return (
    <div className="sticky top-0 z-20 bg-gray-50 pb-4 pt-4 border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Resumo da Busca e Botão Modificar */}
        <Card className="mb-4 shadow-md bg-white">
          <CardContent className="p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4 text-gray-700 text-sm flex-wrap justify-center sm:justify-start">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4 text-blue-600" />
                <span>{formatDate(searchParams.checkin)}</span>
              </div>
              <span>-</span>
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4 text-blue-600" />
                <span>{formatDate(searchParams.checkout)}</span>
              </div>
              <div className="flex items-center gap-1 ml-2">
                <Users className="h-4 w-4 text-blue-600" />
                <span>{searchParams.adults} Hóspede{searchParams.adults > 1 ? 's' : ''}</span>
              </div>
            </div>
            <Button variant="outline" onClick={scrollToSearchForm} className="w-full sm:w-auto">
              <Search className="h-4 w-4 mr-2" />
              Modificar Busca
            </Button>
          </CardContent>
        </Card>

        {/* Título, Botões de Visualização e Filtro de Ordenação */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <h2 className="text-2xl font-bold text-gray-800 flex-shrink-0">
            Acomodações Disponíveis ({availableRoomsCount})
          </h2>
          <div className="flex items-center gap-4 w-full md:w-auto justify-end">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => onViewModeChange('list')}
                className={cn(viewMode === 'list' && 'bg-gray-200')}
                aria-label="Visualização em lista"
              >
                <List className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => onViewModeChange('grid')}
                className={cn(viewMode === 'grid' && 'bg-gray-200')}
                aria-label="Visualização em grade"
              >
                <LayoutGrid className="h-4 w-4" />
              </Button>
            </div>
            <FilterControls sortOrder={sortOrder} onSortChange={onSortChange} />
          </div>
        </div>
      </div>
    </div>
  );
}