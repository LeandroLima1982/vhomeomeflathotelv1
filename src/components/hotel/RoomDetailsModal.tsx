"use client";

import React, { useState } from 'react';
import { X, MapPin, Users, Wifi, Car, Coffee, Utensils, Dumbbell, Waves, Star, Calendar, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

interface RoomDetailsModalProps {
  room: {
    id: number;
    name: string;
    special_name?: string;
    booking_url?: string;
    details?: any;
    description?: string;
    custom_description?: string;
    additional_features?: any;
  };
  onClose: () => void;
}

const RoomDetailsModal: React.FC<RoomDetailsModalProps> = ({ room, onClose }) => {
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  if (!room) return null;

  const getFeatureIcon = (feature: string) => {
    const iconMap: { [key: string]: React.ComponentType<any> } = {
      'Wi-Fi': Wifi,
      'Estacionamento': Car,
      'Café da manhã': Coffee,
      'Restaurante': Utensils,
      'Academia': Dumbbell,
      'Piscina': Waves,
    };
    return iconMap[feature] || Star;
  };

  const renderFeatures = (features: any) => {
    if (!features) return null;
    return Object.entries(features).map(([feature, value]) => {
      if (typeof value === 'boolean' && value) {
        const Icon = getFeatureIcon(feature);
        return (
          <div key={feature} className="flex items-center gap-2">
            <Icon className="w-4 h-4 text-blue-600" />
            <span className="text-sm">{feature}</span>
          </div>
        );
      }
      return null;
    });
  };

  const renderAdditionalFeatures = (features: any) => {
    if (!features) return null;
    return Object.entries(features).map(([feature, value]) => {
      if (typeof value === 'boolean' && value) {
        const Icon = getFeatureIcon(feature);
        return (
          <div key={feature} className="flex items-center gap-2">
            <Icon className="w-4 h-4 text-blue-600" />
            <span className="text-sm">{feature}</span>
          </div>
        );
      }
      return null;
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-lg hover:bg-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          
          {/* Imagem do quarto */}
          <div className="relative h-64 md:h-80 bg-gradient-to-r from-blue-600 to-purple-600">
            {!isImageLoaded && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
              </div>
            )}
            <img
              src={room.details?.image || '/placeholder-room.jpg'}
              alt={room.name}
              className="w-full h-full object-cover"
              onLoad={() => setIsImageLoaded(true)}
            />
            <div className="absolute inset-0 bg-black/20"></div>
          </div>
        </div>

        {/* Conteúdo */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-320px)]">
          {/* Título e nome especial */}
          <div className="mb-6">
            <h2 className="text-2xl md:text-3xl font-bold mb-2">{room.name}</h2>
            {room.special_name && (
              <p className="text-lg md:text-xl text-gray-600">{room.special_name}</p>
            )}
          </div>

          {/* Descrição */}
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-3">Sobre este quarto</h3>
            <p className="text-gray-700 leading-relaxed">
              {room.custom_description || room.description || 'Descrição não disponível.'}
            </p>
          </div>

          {/* Detalhes */}
          {room.details && (
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-3">Detalhes</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {room.details.capacity && (
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-blue-600" />
                    <span className="text-sm">Capacidade: {room.details.capacity} pessoas</span>
                  </div>
                )}
                {room.details.size && (
                  <div className="flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-blue-600" />
                    <span className="text-sm">Tamanho: {room.details.size}</span>
                  </div>
                )}
                {room.details.view && (
                  <div className="flex items-center gap-2">
                    <Star className="w-5 h-5 text-blue-600" />
                    <span className="text-sm">Vista: {room.details.view}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Características */}
          {(room.details?.features || room.additional_features) && (
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-3">Características</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {renderFeatures(room.details?.features)}
                {renderAdditionalFeatures(room.additional_features)}
              </div>
            </div>
          )}

          {/* Botão de reserva */}
          {room.booking_url && (
            <div className="mt-6">
              <Button
                asChild
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg font-semibold"
              >
                <a href={room.booking_url} target="_blank" rel="noopener noreferrer">
                  <Calendar className="w-5 h-5 mr-2" />
                  Reservar Agora
                </a>
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RoomDetailsModal;