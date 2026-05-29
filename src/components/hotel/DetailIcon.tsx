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
  Users,
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
  'hóspedes': Users,
  'hospedes': Users,
  'pessoas': Users,
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

  return (
    <div className="flex items-center gap-2 text-sm text-gray-700">
      <IconComponent className="h-4 w-4 text-blue-600 flex-shrink-0" />
      <span>{detailText}</span>
    </div>
  );
};

export default DetailIcon;
