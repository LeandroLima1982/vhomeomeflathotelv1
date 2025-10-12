"use client";

import React from 'react';
import { Home } from 'lucide-react';

interface LogoProps {
  isScrolled?: boolean;
  isFooter?: boolean;
  darkText?: boolean;
}

const Logo: React.FC<LogoProps> = ({ isScrolled = false, isFooter = false, darkText = false }) => {
  const textColor = darkText ? 'text-gray-800' : (isScrolled ? 'text-gray-800' : 'text-white');

  return (
    <div className="flex flex-col items-center">
      <h1 className={`font-light ${isFooter ? 'text-base' : isScrolled ? 'text-lg' : 'text-xl'} ${textColor}`}>
        Flat Hotel
      </h1>
      <div className="flex items-center space-x-1">
        <Home className={`h-4 w-4 ${textColor}`} />
        <span className={`text-xs font-medium ${textColor}`}>Hotel</span>
      </div>
    </div>
  );
};

export { Logo };