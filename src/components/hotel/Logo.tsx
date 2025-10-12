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

  const logoClasses = isFooter ? "h-12 w-auto" : isScrolled ? "h-14 w-auto" : "h-16 w-auto";

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
      <h1 className={`font-bold ${isFooter ? 'text-lg' : isScrolled ? 'text-xl' : 'text-2xl'} text-gray-800 dark:text-white`}>
        Falat Hotel
      </h1>
    </div>
  );
};