"use client";

import React from 'react';
import {
  Wifi,
  Wind,
  Tv,
  Car,
  Coffee,
  Waves,
  UtensilsCrossed,
  CheckCircle,
  BedDouble,
  Users, // Importando o ícone Users
  ShowerHead,
  Sun,
  Building2,
} from 'lucide-react';

interface DetailIconProps {
  detailText: string;
}

const iconMap: Record<string, React.ElementType> = {
  'tv': Tv,
  'mar': Waves,
  'cidade': Building2,
  'wi-fi': Wifi,
  'wifi': Wifi,
  'internet': Wifi,
  'ar-condicionado': Wind,
  'ar condicionado': Wind,
  'estacionamento': Car,
  'garagem': Car,
  'café da manhã': Coffee,
  'cafe da manha': Coffee,
  'piscina': Waves,
  'cozinha': UtensilsCrossed,
  'cama': BedDouble,
  'hóspedes': Users, // Mapeando para Users
  'hospedes': Users, // Mapeando para Users
  'pessoas': Users, // Mapeando para Users
  'banheiro': ShowerHead,
  'varanda': Sun,
};

const DetailIcon: React.FC<DetailIconProps> = ({ detailText }) => {
  const lowerDetailText = detailText.toLowerCase();
  let IconComponent: React.ElementType = CheckCircle;

  for (const key in iconMap) {
    if (lowerDetailText.includes(key)) {
      IconComponent = iconMap[key];
      break;
    }
  }

  return <IconComponent className="h-5 w-5 text-blue-700 flex-shrink-0" />;
};

export default DetailIcon;