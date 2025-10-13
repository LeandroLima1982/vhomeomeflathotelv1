"use client";

import React, { useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton'; // Importar o componente Skeleton

interface LogoProps {
  logoUrl?: string | null;
  logoImageClasses?: string;
}

const Logo: React.FC<LogoProps> = ({ logoUrl, logoImageClasses = "h-10 w-auto" }) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <>
      {logoUrl ? (
        <div className="relative">
          {!imageLoaded && (
            <Skeleton className={logoImageClasses} />
          )}
          <img
            src={logoUrl}
            alt="Flat Hotel Logo"
            className={`${logoImageClasses} ${imageLoaded ? 'opacity-100' : 'opacity-0 absolute'}`}
            onLoad={() => setImageLoaded(true)}
            style={{ transition: 'opacity 0.3s ease-in-out' }}
          />
        </div>
      ) : (
        <div className="text-2xl font-bold text-gray-800">Flat Hotel</div>
      )}
    </>
  );
};

export default Logo;