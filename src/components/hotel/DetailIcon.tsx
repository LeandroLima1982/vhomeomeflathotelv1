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
  Landmark,
} from 'lucide-react';

interface DetailIconProps {
  detailText: string;
}

const iconMap: Record<string, React.ElementType> = {
  'mar': Waves,
  'cidade': Landmark,
  'wi-fi': Wifi,
  'wifi': Wifi,
  'internet': Wifi,
  'ar-condicionado': Wind,
  'ar condicionado': Wind,
  'tv': Tv,
  'estacionamento': Car,
  'garagem': Car,
  'café da manhã': Coffee,
  'cafe da manha': Coffee,
  'piscina': Waves,
  'cozinha': UtensilsCrossed,
  'cama': BedDouble,
  'hóspedes': Users,
  'hospedes': Users,
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