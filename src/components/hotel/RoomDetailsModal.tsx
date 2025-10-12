"use client";

import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { X } from "lucide-react";

interface RoomDetailsModalProps {
  room: any;
  onClose: () => void;
}

const RoomDetailsModal: React.FC<RoomDetailsModalProps> = ({ room, onClose }) => {
  if (!room) return null;

  return (
    <Dialog open={!!room} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="max-w-full sm:max-w-4xl md:max-w-6xl h-[90vh] flex flex-col p-0 overflow-hidden">
        <DialogHeader className="p-4 pb-2 border-b flex-shrink-0">
          <div className="flex justify-between items-start">
            <div>
              <DialogTitle className="text-lg sm:text-xl font-bold">{room.name}</DialogTitle>
              <p className="text-sm text-muted-foreground">{room.description}</p>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto p-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-full">
            <div className="flex flex-col">
              <h3 className="text-md font-semibold mb-2">Imagens</h3>
              <Carousel className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg mx-auto">
                <CarouselContent>
                  {room.images?.map((image: string, index: number) => (
                    <CarouselItem key={index}>
                      <img
                        src={image}
                        alt={`Imagem ${index + 1}`}
                        className="w-full h-48 sm:h-64 md:h-80 object-cover rounded-md"
                      />
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
              </Carousel>
            </div>
            <div className="flex flex-col space-y-4">
              <div>
                <h3 className="text-md font-semibold">Detalhes</h3>
                <p className="text-sm">Preço: R$ {room.price} por noite</p>
                <p className="text-sm">Capacidade: {room.capacity} pessoas</p>
                <p className="text-sm">Comodidades: {room.amenities?.join(', ')}</p>
              </div>
              <Button className="w-full">Reservar Agora</Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RoomDetailsModal;