"use client";

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Skeleton } from '@/components/ui/skeleton';
import clsx from 'clsx';

type LogoProps = {
  isScrolled?: boolean;
  isFooter?: boolean;
};

const LOGO_PATH = 'logo/logo.png';

export function Logo({ isScrolled, isFooter }: LogoProps) {
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogo = async () => {
      setLoading(true);
      const { data: listData } = await supabase.storage.from('gallery').list('logo', {
        search: 'logo.png',
        limit: 1,
      });

      if (listData && listData.length > 0) {
        const { data } = supabase.storage.from('gallery').getPublicUrl(LOGO_PATH);
        setLogoUrl(data.publicUrl);
      } else {
        setLogoUrl(null); // Nenhum logo encontrado
      }
      setLoading(false);
    };

    fetchLogo();
  }, []);

  // Fallback para o logo de texto
  const TextLogo = () => {
    const primaryColor = isFooter ? "text-blue-600" : isScrolled ? "text-blue-800" : "text-white";
    const secondaryColor = isFooter ? "text-gray-300" : isScrolled ? "text-gray-800" : "text-gray-200";
    const textClasses = clsx("font-bold transition-all duration-300", {
      "text-3xl": isScrolled,
      "text-5xl": !isScrolled,
    });

    return (
      <div className={textClasses}>
        <span className={primaryColor}>V</span>
        <span className={secondaryColor}>Home</span>
      </div>
    );
  };

  if (loading) {
    return <Skeleton className="h-10 w-28" />;
  }

  if (logoUrl) {
    const logoClasses = clsx("w-auto transition-all duration-300", {
      "h-14": isScrolled,
      "h-24": !isScrolled,
    });
    return (
      <img src={logoUrl} alt="V-Home Logo" className={logoClasses} />
    );
  }

  return <TextLogo />;
}