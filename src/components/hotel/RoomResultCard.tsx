"use client";

import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BedDouble, Tag } from "lucide-react";
import DetailIcon from './DetailIcon';
import { parse, differenceInDays } from "date-fns"; // Importando parse e differenceInDays

interface RoomResult {
  idQuarto: number;
  nomeQuarto: string;
  disponibilidade: number;
  valorTotal: number;
  imageUrl: string | null;
  details: Record<string, string | null> | null;
  details_order: string[] | null;
  special_name?: string | null; // Adicionado para garantir que a propriedade exista
  [key: string]: any;
}

interface SearchParams {
  checkin: string;
  checkout: string;
  adults: number;
}

interface RoomResultCardProps {
  room: RoomResult;
  searchParams: SearchParams;
}

export function RoomResultCard({ room, searchParams }: RoomResultCardProps) {
  const navigate = useNavigate();

  const formattedPrice = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(room.valorTotal);

  // Calcular o número de diárias
  const checkinDateObj = parse(searchParams.checkin, "yyyyMMdd", new Date());
  const checkoutDateObj = parse(searchParams.checkout, "yyyyMMdd", new Date());
  const numberOfNights = differenceInDays(checkoutDateObj, checkinDateObj);

  const handleSelectRoom = () => {
    navigate('/checkout', {
      state: {
        room,
        searchParams,
      },
    });
  };

  const getRoomDetails = (roomData: RoomResult) => {
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
  
      return [...orderedDetails, ...unorderedDetails];
    }
  
    return validKeys.map(key => detailsObject[key] as string);
  };

  const details = getRoomDetails(room);

  return (
    <Card className="overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col md:flex-row">
      <div className="md:w-1/3 bg-gray-200 flex items-center justify-center p-4 min-h-[200px] relative">
        {room.imageUrl ? (
          <img src={room.imageUrl} alt={room.nomeQuarto} className="absolute inset-0 w-full h-full object-cover" />
        ) : (
          <BedDouble className="h-16 w-16 text-gray-400" />
        )}
      </div>
      <div className="flex-1 flex flex-col">
        <CardHeader>
          {room.special_name && (
            <div className="inline-block mb-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-md">
              {room.special_name}
            </div>
          )}
          <CardTitle className="text-xl text-gray-800">{room.nomeQuarto}</CardTitle>
        </CardHeader>
        <CardContent className="flex-grow">
          {details.length > 0 && (
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 mb-4">
              {details.map((detail, index) => (
                <div key={index} className="flex items-center gap-2">
                  <DetailIcon detailText={detail} />
                  <span className="text-sm text-gray-600">{detail}</span>
                </div>
              ))}
            </div>
          )}
          <p className="text-sm text-gray-600">
            {room.disponibilidade > 0 
              ? `${room.disponibilidade} unidade${room.disponibilidade > 1 ? 's' : ''} disponível${room.disponibilidade > 1 ? 's' : ''}`
              : "Indisponível"}
          </p>
        </CardContent>
        <CardFooter className="bg-gray-50 p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex flex-col items-start"> {/* Alterado para flex-col para empilhar os itens */}
            <span className="text-sm text-gray-600">Total para o período</span>
            <p className="text-2xl font-bold text-blue-800 flex items-center">
              <Tag className="h-5 w-5 mr-2 opacity-70" />
              {formattedPrice}
            </p>
            {numberOfNights > 0 && ( // Exibe o número de diárias apenas se for maior que zero
              <span className="text-xs text-gray-500 mt-1">
                ({numberOfNights} diária{numberOfNights > 1 ? 's' : ''})
              </span>
            )}
          </div>
          <Button onClick={handleSelectRoom} className="w-full sm:w-auto bg-blue-700 hover:bg-blue-800">
            Reservar
          </Button>
        </CardFooter>
      </div>
    </Card>
  );
}