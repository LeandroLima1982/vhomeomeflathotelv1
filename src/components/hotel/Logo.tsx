"use client";

import React from 'react';
import { Star } from 'lucide-react';

interface LogoProps {
  logoUrl: string;
  logoClasses?: string;
}

export const Logo: React.FC<LogoProps> = ({ logoUrl, logoClasses = "h-12 w-auto" }) => {
  return (
    <div className="flex items-center space-x-3">
      <img
        src={logoUrl}
        alt="Falat Hotel Logo"
        className={logoClasses}
      />
      <div className="flex items-center space-x-1">
        {Array.from({ length: 4 }).map((_, index) => (
          <Star key={index} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
        ))}
      </div>
      <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
        Falat Hotel
      </h1>
    </div>
  );
};