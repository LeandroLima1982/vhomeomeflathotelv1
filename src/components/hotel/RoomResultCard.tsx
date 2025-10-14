"use client";

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BedDouble, Tag } from "lucide-react";

interface RoomResult {
  idQuarto: number;
  nomeQuarto: string;
  disponibilidade: number;
  valorTotal: number;
}

interface RoomResultCardProps {
  room: RoomResult;
}

export function RoomResultCard({ room }: RoomResultCardProps) {
  const formattedPrice = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(room.valorTotal);

  return (
    <Card className="overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col md:flex-row">
      <div className="md:w-1/3 bg-gray-200 flex items-center justify-center p-4 min-h-[150px]">
        {/* Placeholder para a imagem do quarto */}
        <BedDouble className="h-16 w-16 text-gray-400" />
      </div>
      <div className="flex-1 flex flex-col">
        <CardHeader>
          <CardTitle className="text-xl text-gray-800">{room.nomeQuarto}</CardTitle>
        </CardHeader>
        <CardContent className="flex-grow">
          <p className="text-sm text-gray-600">
            {room.disponibilidade > 0 
              ? `${room.disponibilidade} unidade${room.disponibilidade > 1 ? 's' : ''} disponível${room.disponibilidade > 1 ? 's' : ''}`
              : "Indisponível"}
          </p>
        </CardContent>
        <CardFooter className="bg-gray-50 p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-baseline gap-2">
            <span className="text-sm text-gray-600">Total para o período</span>
            <p className="text-2xl font-bold text-blue-800 flex items-center">
              <Tag className="h-5 w-5 mr-2 opacity-70" />
              {formattedPrice}
            </p>
          </div>
          <Button className="w-full sm:w-auto bg-blue-700 hover:bg-blue-800">
            Selecionar
          </Button>
        </CardFooter>
      </div>
    </Card>
  );
}