"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SlidersHorizontal } from "lucide-react";

interface FilterControlsProps {
  sortOrder: string;
  onSortChange: (value: string) => void;
}

export function FilterControls({ sortOrder, onSortChange }: FilterControlsProps) {
  return (
    <Card className="mb-8 shadow-md">
      <CardContent className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-5 w-5 text-gray-600" />
          <h3 className="text-md font-semibold text-gray-800">Ordenar Resultados</h3>
        </div>
        <div className="w-full max-w-[200px]">
          <Select value={sortOrder} onValueChange={onSortChange}>
            <SelectTrigger id="sort-order">
              <SelectValue placeholder="Ordenar por..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="relevance">Relevância</SelectItem>
              <SelectItem value="price_asc">Menor Preço</SelectItem>
              <SelectItem value="price_desc">Maior Preço</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
}