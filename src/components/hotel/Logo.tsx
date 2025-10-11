"use client";

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Skeleton } from '@/components/ui/skeleton';

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

    return (
      <div className="text-2xl font-bold">
        <span className={primaryColor}>V</span>
        <span className={secondaryColor}>Home</span>
      </div>
    );
  };

  if (loading) {
    return <Skeleton className="h-8 w-24" />;
  }

  if (logoUrl) {
    return (
      <img src={logoUrl} alt="V-Home Logo" className="h-10 w-auto" />
    );
  }

  return <TextLogo />;
}