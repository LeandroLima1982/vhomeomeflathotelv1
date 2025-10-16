"use client";

import { useState } from "react";
import { Calendar, Users, Search, List, LayoutGrid } from "lucide-react";
import { format, parse } from "date-fns";
import { ptBR } from "date-fns/locale";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
    return format(date, "dd/MM", { locale: ptBR });
  };

  return (
    <div className="sticky top-0 z-20 bg-gray-50 py-2 sm:py-4 border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-2 sm:px-4 max-w-5xl">
        {/* Resumo da Busca e Botão Modificar */}
        <Card className="mb-2 sm:mb-4 shadow-md bg-white">
          <CardContent className="p-2 sm:p-4 flex flex-col md:flex-row items-center justify-between gap-2 sm:gap-4">
            <div className="flex items-center gap-2 sm:gap-4 text-gray-700 text-xs sm:text-sm flex-wrap justify-center md:justify-start">
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600" />
                <span>
                  {formatDate(searchParams.checkin)} - {formatDate(searchParams.checkout)}
                </span>
              </div>
              <div className="flex items-center gap-1 ml-0 sm:ml-2">
                <Users className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600" />
                <span>{searchParams.adults} Hóspede{searchParams.adults > 1 ? 's' : ''}</span>
              </div>
            </div>
            <Button variant="outline" onClick={scrollToSearchForm} className="w-full sm:w-auto h-8 px-3 text-xs sm:text-sm">
              <Search className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              Modificar Busca
            </Button>
          </CardContent>
        </Card>

        {/* Título, Botões de Visualização e Filtro de Ordenação */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-4">
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 flex-shrink-0 text-center sm:text-left">
            Quartos Disponíveis ({availableRoomsCount})
          </h2>
          <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto justify-center sm:justify-end">
            <div className="flex items-center gap-1 sm:gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => onViewModeChange('list')}
                className={cn("h-8 w-8", viewMode === 'list' && 'bg-gray-200')}
                aria-label="Visualização em lista"
              >
                <List className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => onViewModeChange('grid')}
                className={cn("h-8 w-8", viewMode === 'grid' && 'bg-gray-200')}
                aria-label="Visualização em grade"
              >
                <LayoutGrid className="h-4 w-4" />
              </Button>
            </div>
            {/* Seletor de ordenação direto, sem Card */}
            <div className="w-full max-w-[120px] sm:max-w-[150px]">
              <Select value={sortOrder} onValueChange={onSortChange}>
                <SelectTrigger id="sort-order" className="h-8 text-xs sm:text-sm">
                  <SelectValue placeholder="Ordenar por..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="relevance">Relevância</SelectItem>
                  <SelectItem value="price_asc">Menor Preço</SelectItem>
                  <SelectItem value="price_desc">Maior Preço</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}