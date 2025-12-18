"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BedDouble, Tag, Users, Calendar, X } from "lucide-react";
import DetailIcon from './DetailIcon';
import { parse, differenceInDays } from "date-fns";
import { ptBR } from "date-fns/locale";
import { generateReservationLink } from "@/utils/reservationLinks";
import { showError } from "@/utils/toast";

interface Room {
  id: number;
  name: string;
  special_name: string | null;
  imageUrl: string | null;
  details: Record<string, string | null> | null;
  details_order: string[] | null;
  custom_description: string | null;
  description: string | null;
  apiRoomId: number; // Added for external link
}

interface RoomDetailsModalProps {
  room: Room | null;
  onClose: () => void;
}

const RoomDetailsModal = ({ room, onClose }: RoomDetailsModalProps) => {
  const [currentSearchParams, setCurrentSearchParams] = useState<{ checkin: string; checkout: string; adults: number } | null>(null);

  useEffect(() => {
    // Get search params from localStorage or URL
    const savedCheckin = localStorage.getItem('lastCheckinDate');
    const savedCheckout = localStorage.getItem('lastCheckoutDate');
    const savedGuests = localStorage.getItem('lastGuests');

    if (savedCheckin && savedCheckout && savedGuests) {
      const checkinDate = parse(savedCheckin, "yyyyMMdd", new Date());
      const checkoutDate = parse(savedCheckout, "yyyyMMdd", new Date());
      const checkin = checkinDate.toISOString().split('T')[0].replace(/-/g, '');
      const checkout = checkoutDate.toISOString().split('T')[0].replace(/-/g, '');
      const adults = parseInt(savedGuests, 10);

      setCurrentSearchParams({ checkin, checkout, adults });
    }
  }, []);

  if (!room) return null;

  const getRoomDetails = (roomData: Room) => {
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
  
      return [...orderedDetails, ...unorderedDetails].slice(0, 9);
    }
  
    return validKeys.map(key => detailsObject[key] as string).slice(0, 9);
  };

  const details = getRoomDetails(room);

  const handleReserveClick = () => {
    if (currentSearchParams) {
      // Close the modal before redirecting
      onClose();
      
      // Generate the external reservation link with pre-filled data
      const reservationLink = generateReservationLink(room.apiRoomId, currentSearchParams);
      
      // Redirect to the external booking site
      window.location.href = reservationLink;
    } else {
      showError("Parâmetros de busca não encontrados. Por favor, faça uma nova busca.");
    }
  };

  const formattedPrice = currentSearchParams ? new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(0) : 'Preço não disponível'; // Placeholder, as we don't have price in modal

  const checkinDateObj = currentSearchParams ? parse(currentSearchParams.checkin, "yyyyMMdd", new Date()) : null;
  const checkoutDateObj = currentSearchParams ? parse(currentSearchParams.checkout, "yyyyMMdd", new Date()) : null;
  const numberOfNights = checkinDateObj && checkoutDateObj ? differenceInDays(checkoutDateObj, checkinDateObj) : 0;

  return (
    <Dialog open={!!room} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Detalhes da Acomodação</span>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Image Section */}
          <div className="space-y-4">
            <div className="aspect-video rounded-lg overflow-hidden bg-gray-200 flex items-center justify-center">
              {room.imageUrl ? (
                <img src={room.imageUrl} alt={room.name} className="w-full h-full object-cover" />
              ) : (
                <BedDouble className="h-16 w-16 text-gray-400" />
              )}
            </div>
          </div>

          {/* Details Section */}
          <div className="space-y-4">
            {room.special_name && (
              <Badge variant="secondary" className="w-fit">
                {room.special_name}
              </Badge>
            )}
            <h3 className="text-2xl font-bold text-gray-800">{room.name}</h3>
            
            {currentSearchParams && (
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>Check-in: {checkinDateObj?.toLocaleDateString('pt-BR')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>Check-out: {checkoutDateObj?.toLocaleDateString('pt-BR')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <span>{currentSearchParams.adults} Hóspede{currentSearchParams.adults > 1 ? 's' : ''}</span>
                </div>
              </div>
            )}

            <p className="text-gray-700 leading-relaxed">
              {room.custom_description || room.description || 'Descrição não disponível'}
            </p>

            {details.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-semibold text-gray-800">Características:</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {details.map((detail, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <DetailIcon detailText={detail} />
                      <span className="text-sm text-gray-600">{detail}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="pt-4 border-t">
              <div className="flex items-center justify-between mb-4">
                <span className="text-lg font-medium text-gray-700">Preço estimado:</span>
                <span className="text-2xl font-bold text-blue-800 flex items-center">
                  <Tag className="h-5 w-5 mr-2 opacity-70" />
                  {formattedPrice}
                </span>
              </div>
              {numberOfNights > 0 && (
                <p className="text-sm text-gray-500">
                  Para {numberOfNights} diária{numberOfNights > 1 ? 's' : ''}
                </p>
              )}
            </div>

            <Button onClick={handleReserveClick} className="w-full bg-blue-700 hover:bg-blue-800">
              Reservar Agora
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RoomDetailsModal;