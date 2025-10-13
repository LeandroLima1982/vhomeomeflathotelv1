"use client";

import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { MapPin, Wifi, Coffee, Car, Snowflake, Tv, Utensils, ShowerHead, BedSingle, SquareParking, PawPrint, Accessibility, CalendarDays } from 'lucide-react';
// import Image from 'next/image'; // Removido, pois não é um projeto Next.js

const featureIcons = {
  wifi: <Wifi className="h-5 w-5 text-blue-600" />,
  coffee: <Coffee className="h-5 w-5 text-blue-600" />,
  parking: <Car className="h-5 w-5 text-blue-600" />,
  air_conditioning: <Snowflake className="h-5 w-5 text-blue-600" />,
  tv: <Tv className="h-5 w-5 text-blue-600" />,
  restaurant: <Utensils className="h-5 w-5 text-blue-600" />,
  private_bathroom: <ShowerHead className="h-5 w-5 text-blue-600" />,
  double_bed: <BedSingle className="h-5 w-5 text-blue-600" />,
  free_parking: <SquareParking className="h-5 w-5 text-blue-600" />,
  pet_friendly: <PawPrint className="h-5 w-5 text-blue-600" />,
  accessibility: <Accessibility className="h-5 w-5 text-blue-600" />,
};

const RoomDetailsModal = ({ room, onClose }) => {
  if (!room) return null;

  const features = room.additional_features || {};
  const details = room.details || {};

  return (
    <Dialog open={!!room} onOpenChange={onClose}>
      <DialogContent className="
        max-w-[95vw] w-full h-full mx-2 overflow-y-auto // Full height and scrollable on mobile
        sm:max-w-[90vw] sm:max-h-[95vh] sm:mx-4 sm:rounded-2xl sm:overflow-hidden // Revert to max-height, rounded, and internal scrolling on sm+
        md:max-w-[1000px]
        bg-white/95 backdrop-blur-sm border-0 shadow-2xl flex flex-col
      ">
        <DialogHeader className="relative bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 px-6 sm:px-8 md:px-10 py-6 sm:py-8 md:py-10 border-b border-slate-200/50 flex-shrink-0 overflow-hidden">
          {/* Elemento decorativo sutil */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-blue-100/30 to-transparent rounded-full -translate-y-16 translate-x-16"></div>
          <DialogTitle className="text-3xl sm:text-4xl font-extrabold text-gray-900 relative z-10 leading-tight">
            {room.name}
          </DialogTitle>
          {room.special_name && (
            <DialogDescription className="text-lg sm:text-xl text-indigo-700 font-semibold relative z-10 mt-1">
              {room.special_name}
            </DialogDescription>
          )}
          <div className="flex items-center text-gray-600 mt-3 relative z-10">
            <MapPin className="h-5 w-5 mr-2 text-indigo-500" />
            <span>Localização do Hotel (Exemplo)</span>
          </div>
        </DialogHeader>

        <div className="flex-grow overflow-y-auto p-6 sm:p-8 md:p-10">
          {room && (
            <div className="grid md:grid-cols-2 gap-8">
              {/* Coluna da Esquerda: Imagem e Descrição */}
              <div>
                {details.image_url && (
                  <div className="relative w-full h-64 sm:h-80 md:h-96 rounded-xl overflow-hidden shadow-lg mb-6">
                    <img
                      src={details.image_url}
                      alt={room.name}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                    />
                  </div>
                )}
                <h3 className="text-2xl font-bold text-gray-800 mb-3">Sobre o Quarto</h3>
                <p className="text-gray-700 leading-relaxed mb-6">
                  {room.custom_description || room.description || 'Nenhuma descrição disponível para este quarto.'}
                </p>

                <Separator className="my-6 bg-slate-200" />

                <h3 className="text-2xl font-bold text-gray-800 mb-3">Detalhes Adicionais</h3>
                <ul className="space-y-2 text-gray-700">
                  {details.capacity && (
                    <li className="flex items-center">
                      <BedSingle className="h-5 w-5 mr-3 text-indigo-500" />
                      Capacidade: {details.capacity} pessoa(s)
                    </li>
                  )}
                  {details.bed_type && (
                    <li className="flex items-center">
                      <BedSingle className="h-5 w-5 mr-3 text-indigo-500" />
                      Tipo de Cama: {details.bed_type}
                    </li>
                  )}
                  {details.size && (
                    <li className="flex items-center">
                      <SquareParking className="h-5 w-5 mr-3 text-indigo-500" />
                      Tamanho: {details.size} m²
                    </li>
                  )}
                  {details.view && (
                    <li className="flex items-center">
                      <MapPin className="h-5 w-5 mr-3 text-indigo-500" />
                      Vista: {details.view}
                    </li>
                  )}
                </ul>
              </div>

              {/* Coluna da Direita: Preço e Características */}
              <div>
                <div className="bg-blue-50 p-6 rounded-xl shadow-md mb-6">
                  <p className="text-lg text-gray-600 mb-2">Preço por noite:</p>
                  <p className="text-4xl font-extrabold text-blue-700">
                    {details.price ? `R$ ${details.price.toFixed(2).replace('.', ',')}` : 'Preço não disponível'}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">Impostos e taxas podem ser aplicados.</p>
                  <Button className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg text-lg transition-colors duration-200">
                    <CalendarDays className="h-5 w-5 mr-2" />
                    Reservar Agora
                  </Button>
                </div>

                <Separator className="my-6 bg-slate-200" />

                <h3 className="text-2xl font-bold text-gray-800 mb-3">Comodidades</h3>
                <div className="grid grid-cols-2 gap-4 text-gray-700">
                  {Object.entries(features).map(([key, value]) => value && (
                    <div key={key} className="flex items-center">
                      {featureIcons[key.toLowerCase()] || <span className="h-5 w-5 mr-3 text-gray-500"></span>}
                      <span className="capitalize">{key.replace(/_/g, ' ')}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="flex-shrink-0 p-6 sm:p-8 md:p-10 border-t border-slate-200/50 bg-white/90">
          <Button onClick={onClose} variant="outline" className="w-full sm:w-auto border-slate-300 text-gray-700 hover:bg-slate-100">
            Fechar
          </Button>
          {room.booking_url && (
            <Button asChild className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white">
              <a href={room.booking_url} target="_blank" rel="noopener noreferrer">
                Ir para Reserva
              </a>
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RoomDetailsModal;