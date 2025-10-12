"use client";

import React, { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';

interface LogoProps {
  isScrolled?: boolean;
  isFooter?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ isScrolled = false, isFooter = false }) => {
  const [logoUrl, setLogoUrl] = useState<string>('/placeholder.svg'); // Fallback to placeholder

  useEffect(() => {
    const fetchLogo = async () => {
      try {
        const { data } = supabase.storage.from('gallery').getPublicUrl('logo/logo.png');
        if (data.publicUrl) {
          setLogoUrl(`${data.publicUrl}?t=${new Date().getTime()}`); // Add timestamp to avoid cache issues
        }
      } catch (error) {
        console.error('Error fetching logo:', error);
        // Keep placeholder if error
      }
    };

    fetchLogo();
  }, []);

  const logoClasses = isFooter ? "h-20 w-auto" : isScrolled ? "h-20 w-auto" : "h-24 w-auto";

  return (
    <div className="flex items-center space-x-3">
      <img
        src={logoUrl}
        alt="Flat Hotel Logo"
        className={logoClasses}
      />
      <div className="flex flex-col items-center">
        <h1 className={`font-light ${isFooter ? 'text-base' : isScrolled ? 'text-lg' : 'text-xl'} ${isScrolled ? 'text-gray-800' : 'text-white'}`}>
          Flat Hotel
        </h1>
        <div className="flex items-center space-x-1">
          {Array.from({ length: 4 }).map((_, index) => (
            <Star key={index} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
          ))}
        </div>
      </div>
    </div>
  );
};