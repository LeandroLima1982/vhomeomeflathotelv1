"use client";

import React from 'react';

interface LogoProps {
  isScrolled: boolean;
  isFooter?: boolean;
}

const Logo: React.FC<LogoProps> = ({ isScrolled, isFooter = false }) => {
  return (
    <div className="flex flex-col items-center">
      <h1 className={`font-light ${isFooter ? 'text-base' : isScrolled ? 'text-lg' : 'text-xl'} ${isScrolled ? 'text-blue-600' : 'text-white'}`}>
        Flat Hotel
      </h1>
      <div className="flex items-center space-x-1">
        <span className={`text-xs ${isScrolled ? 'text-gray-600' : 'text-gray-300'}`}>★</span>
        <span className={`text-xs ${isScrolled ? 'text-gray-600' : 'text-gray-300'}`}>4.8</span>
        <span className={`text-xs ${isScrolled ? 'text-gray-600' : 'text-gray-300'}`}> (120 reviews)</span>
      </div>
    </div>
  );
};

export { Logo };