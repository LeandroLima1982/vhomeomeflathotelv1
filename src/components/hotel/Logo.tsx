"use client";

import React from 'react';
import { Star } from 'lucide-react';

interface LogoProps {
  isScrolled?: boolean;
  isFooter?: boolean;
}

const Logo: React.FC<LogoProps> = ({ isScrolled = false, isFooter = false }) => {
  return (
    <div className="flex flex-col items-center">
      <h1 className={`font-light ${isFooter ? 'text-base' : isScrolled ? 'text-lg' : 'text-xl'} ${isScrolled ? 'text-gray-800' : 'text-slate-800'}`}>
        Flat Hotel
      </h1>
      <div className="flex items-center space-x-1">
        <Star className="h-3 w-3 text-amber-500" />
        <Star className="h-3 w-3 text-amber-500" />
        <Star className="h-3 w-3 text-amber-500" />
        <Star className="h-3 w-3 text-amber-500" />
        <Star className="h-3 w-3 text-amber-500" />
      </div>
    </div>
  );
};

export { Logo };