"use client";

import { useNavigate } from "react-router-dom";
import { BedDouble, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";

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
  const navigate = useNavigate();

  const formattedPrice = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(room.valorTotal);

  const handleSelectRoom = () => {
    navigate('/checkout', {
      state: {
        room,
        searchParams,
      },
    });
  };

  console.log(`RoomResultGridCard for ${room.nomeQuarto} (ID: ${room.idQuarto}), Image URL: ${room.imageUrl}`); // Debug log

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
          Selecionar
        </Button>
      </div>
    </div>
  );
}