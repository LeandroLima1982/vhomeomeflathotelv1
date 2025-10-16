"use client";

import React from 'react';
import { Star } from 'lucide-react';

interface LogoProps {
  isScrolled?: boolean;
  isFooter?: boolean;
  isModal?: boolean;
  className?: string;
  isTransparentHeaderOnLightBackground?: boolean; // Nova propriedade
}

// URL estática para o logo, construída com as informações do projeto.
const LOGO_URL = 'https://hvlycmbcvcftathcnzdr.supabase.co/storage/v1/object/public/gallery/logo/logo.png';

const Logo: React.FC<LogoProps> = ({ isScrolled, isFooter, isModal, className, isTransparentHeaderOnLightBackground }) => {
  const logoImageClasses = `h-16 w-auto ${className || ''}`;

  // Lógica para definir a cor do texto e das estrelas
  let textColor = "text-white";
  let starColor = "text-yellow-400";

  if (isFooter || isModal) {
    textColor = "text-white";
    starColor = "text-yellow-400";
  } else if (isTransparentHeaderOnLightBackground) { // Prioriza esta condição para fundos claros
    textColor = "text-gray-800";
    starColor = "text-yellow-600"; // Um amarelo mais escuro para contraste
  } else if (isScrolled) {
    textColor = "text-gray-800";
    starColor = "text-yellow-500";
  }

  return (
    <div className="flex items-center space-x-3">
      <img
        src={LOGO_URL}
        alt="Flat Hotel Logo"
        className={logoImageClasses}
        width="64"
        height="64"
      />
      <div className="flex flex-col">
        <span className={`text-xl font-bold ${textColor}`}>Flat Hotel</span>
        <div className="flex items-center gap-0.5">
          {[...Array(4)].map((_, i) => (
            <Star key={i} className={`h-4 w-4 fill-current ${starColor}`} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Logo;