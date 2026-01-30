"use client";

import { BedDouble, Calendar, Users, Tag, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format, parse } from "date-fns";
import { ptBR } from "date-fns/locale";
import { showError } from "@/utils/toast";
import DetailIcon from './DetailIcon';

interface AvailabilityResult {
  idQuarto: number;
  nomeQuarto: string;
  disponibilidade: number;
  valorTotal: number;
  imageUrl: string | null;
  details: Record<string, string | null> | null;
  details_order: string[] | null;
  special_name?: string | null;
  [key: string]: any;
}

interface SearchParams {
  checkin: string;
  checkout: string;
  adults: number;
}

interface RoomResultGridCardProps {
  room: AvailabilityResult;
  searchParams: SearchParams;
}

export function RoomResultGridCard({ room, searchParams }: RoomResultGridCardProps) {
  const formatDate = (dateStr: string) => {
    const date = parse(dateStr, "yyyyMMdd", new Date());
    return format(date, "dd/MM", { locale: ptBR });
  };

  const formattedPrice = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(room.valorTotal);

  const handleSelectRoom = () => {
    try {
      const baseUrl = 'https://vhomeflathotel.motordereservas.com.br/novareserva';
      const params = new URLSearchParams({
        inicio: searchParams.checkin,
        fim: searchParams.checkout,
        adultos: searchParams.adults.toString(),
        idquartoCategoria: room.idQuarto.toString(), // Usar o idQuarto ajustado como idquartoCategoria
      });
      const reservationLink = `${baseUrl}?${params.toString()}`;
      window.location.href = reservationLink;
    } catch (error) {
      console.error("Erro ao gerar link de reserva:", error);
      showError("Erro ao redirecionar para reserva. Tente novamente.");
    }
  };

  const getRoomDetails = (roomData: AvailabilityResult) => {
    if (!roomData.details || typeof roomData.details !== 'object') return [];
  
    const detailsObject = roomData.details;
  
    const validKeys = Object.keys(detailsObject).filter(key => {
      const value = detailsObject[key];
      return value && typeof value === 'string' && value.trim() !== '' && key !== 'description';
    });
  
    if (roomData.details_order && Array.isArray(roomData.details_order)) {
      const orderedDetails = roomData.details_order
        .map(key => {
          if (validKeys.includes(key)) {
            return detailsObject[key];
          }
          return null;
        })
        .filter((value): value is string => value !== null);
      
      const unorderedKeys = validKeys.filter(key => !roomData.details_order.includes(key));
      const unorderedDetails = unorderedKeys.map(key => detailsObject[key] as string);
  
      return [...orderedDetails, ...unorderedDetails].slice(0, 6); // Limita a 6 para grid
    }
  
    return validKeys.map(key => detailsObject[key] as string).slice(0, 6);
  };

  const roomDetails = getRoomDetails(room);

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="aspect-square bg-gray-200 flex items-center justify-center relative">
        {room.imageUrl ? (
          <img src={room.imageUrl} alt={room.nomeQuarto} className="w-full h-full object-cover" />
        ) : (
          <BedDouble className="h-12 w-12 text-gray-400" />
        )}
        {room.special_name && (
          <div className="absolute top-2 left-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-bold px-2 py-1 rounded-full">
            {room.special_name}
          </div>
        )}
      </div>
      <CardContent className="p-4">
        <CardHeader className="p-0 mb-2">
          <CardTitle className="text-lg text-gray-800">{room.nomeQuarto}</CardTitle>
        </CardHeader>

        <div className="text-sm text-gray-600 mb-3">
          <div className="flex items-center gap-1 mb-1">
            <Calendar className="h-3 w-3 text-blue-600" />
            <span>{formatDate(searchParams.checkin)} - {formatDate(searchParams.checkout)}</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="h-3 w-3 text-blue-600" />
            <span>{searchParams.adults} Hóspede{searchParams.adults > 1 ? 's' : ''}</span>
          </div>
        </div>

        {roomDetails.length > 0 && (
          <div className="mb-3">
            <div className="grid grid-cols-1 gap-1">
              {roomDetails.map((detail, index) => (
                <div key={index} className="flex items-center gap-1 text-xs text-gray-600">
                  <DetailIcon detailText={detail} />
                  <span>{detail}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="text-lg font-bold text-blue-800 flex items-center gap-1">
            <Tag className="w-4 h-4 opacity-70" />
            {formattedPrice}
          </div>
          <Button onClick={handleSelectRoom} size="sm" className="bg-blue-600 hover:bg-blue-700">
            <ArrowRight className="h-3 w-3 mr-1" />
            Reservar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}