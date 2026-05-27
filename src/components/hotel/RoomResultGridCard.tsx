"use client";

import { BedDouble, Tag, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { generateWhatsAppLink } from "@/utils/reservationLinks";

interface AvailabilityResult {
  idQuarto: number;
  nomeQuarto: string;
  disponibilidade: number;
  valorTotal: number;
  imageUrl: string | null;
  details: Record<string, string | null> | null;
  details_order: string[] | null;
  special_name?: string | null;
  apiRoomId: number;
  api_category_id?: number | null;
  booking_url?: string | null;
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
  const formattedPrice = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(room.valorTotal);

  const handleSelectRoom = (e: React.MouseEvent) => {
    e.stopPropagation();
    const whatsappLink = generateWhatsAppLink(room.nomeQuarto, searchParams);
    window.open(whatsappLink, '_blank');
  };

  const getCapacityDisplay = (details: Record<string, string | null> | null) => {
    if (!details) return null;
    const capacityDetail = Object.entries(details).find(([key, value]) =>
      key.toLowerCase().includes('capacidade') || (value && value.toLowerCase().includes('hóspedes')) || (value && value.toLowerCase().includes('adultos'))
    );
    return capacityDetail ? capacityDetail[1] : null;
  };

  const capacity = getCapacityDisplay(room.details);

  const showUrgencyBadge = room.disponibilidade > 0 && room.disponibilidade <= 2;
  const urgencyMessage = room.disponibilidade === 1 ? "Apenas 1 quarto restante!" : "Últimas 2 unidades!";

  return (
    <div
      className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group cursor-pointer"
      onClick={handleSelectRoom}
    >
      <div className="h-64 relative overflow-hidden">
        {room.imageUrl ? (
          <div
            className="w-full h-full bg-cover bg-center group-hover:scale-105 transition-transform duration-300"
            style={{ backgroundImage: `url(${room.imageUrl})` }}
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <BedDouble className="h-16 w-16 text-gray-400" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        <div className="absolute bottom-0 left-0 p-4 text-white">
          {room.special_name && (
            <div className="inline-block mb-1 bg-blue-600 text-white px-2 py-0.5 rounded-full text-xs font-semibold">
              {room.special_name}
            </div>
          )}
          <h3 className="text-lg font-semibold">{room.nomeQuarto}</h3>
          {capacity && (
            <div className="flex items-center gap-2 text-xs text-gray-200 mt-1">
              <Users className="h-3 w-3" />
              <span>{capacity}</span>
            </div>
          )}
          {showUrgencyBadge && (
            <Badge variant="destructive" className="mt-2 w-fit bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full animate-pulse">
              {urgencyMessage}
            </Badge>
          )}
        </div>
      </div>
      <div className="p-4 bg-gray-50 flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">Total</p>
          <p className="text-xl font-bold text-blue-800 flex items-center">
            <Tag className="h-4 w-4 mr-1.5 opacity-70" />
            {formattedPrice}
          </p>
        </div>
        <Button onClick={handleSelectRoom} className="bg-blue-700 hover:bg-blue-800">
          Reservar
        </Button>
      </div>
    </div>
  );
}