"use client";

import React from 'react';
import { useTheme } from 'next-themes';

interface LogoProps {
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ className }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // Determine the logo URL based on the theme
  const logoUrl = isDark
    ? '/images/logo-dark.png' // Path to your dark mode logo
    : '/images/logo-light.png'; // Path to your light mode logo

  const logoClasses = `h-8 w-auto ${className || ''}`;

  return (
    <div className="flex items-center space-x-3">
      <img
        src={logoUrl}
        alt="Flat Hotel Logo"
        className={logoClasses}
        width="32" // Adicionado para reservar espaço
        height="32" // Adicionado para reservar espaço
      />
      <span className="text-xl font-semibold">Flat Hotel</span>
    </div>
  );
};

export default Logo;