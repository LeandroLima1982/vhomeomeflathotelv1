"use client";

import React from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
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
} from 'lucide-react';

interface DetailIconProps {
  detailText: string;
}

const iconMap: Record<string, React.ElementType> = {
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

  return (
    <TooltipProvider delayDuration={100}>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="p-2 bg-blue-50 text-blue-700 rounded-full border border-blue-200/60 hover:bg-blue-100 transition-colors cursor-pointer">
            <IconComponent className="h-4 w-4" />
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>{detailText}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default DetailIcon;