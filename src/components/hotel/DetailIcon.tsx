"use client";

import React from 'react';
import {
  Wifi, Wind, Tv, Users, UtensilsCrossed, 
  Waves, Sun, Building2, CheckCircle, BedDouble
} from 'lucide-react';

interface DetailIconProps {
  detailText: string;
}

const iconMap: Record<string, React.ElementType> = {
  'wifi': Wifi,
  'wi-fi': Wifi,
  'ar-condicionado': Wind,
  'ar condicionado': Wind,
  'tv': Tv,
  'televisão': Tv,
  'pessoa': Users,
  'pessoas': Users,
  'hóspede': Users,
  'hospede': Users,
  'cozinha': UtensilsCrossed,
  'mar': Waves,
  'vista': Waves,
  'varanda': Sun,
  'cidade': Building2,
  'cama': BedDouble,
};

const DetailIcon: React.FC<DetailIconProps> = ({ detailText }) => {
  const lower = detailText.toLowerCase();
  let IconComponent: React.ElementType = CheckCircle;

  for (const keyword in iconMap) {
    if (lower.includes(keyword)) {
      IconComponent = iconMap[keyword];
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
