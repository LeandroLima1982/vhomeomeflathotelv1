"use client";

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Loader2, Star } from 'lucide-react'; // Importando o ícone Star

interface LogoProps {
  isScrolled?: boolean;
  isFooter?: boolean;
  isModal?: boolean;
  className?: string;
}

const BUCKET_NAME = 'gallery';
const LOGO_PATH = 'logo/logo.png'; // Caminho fixo para o logo no Supabase Storage

const Logo: React.FC<LogoProps> = ({ isScrolled, isFooter, isModal, className }) => {
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogo = async () => {
      setLoading(true);
      if (!supabase) {
        console.error("Supabase client not initialized.");
        setLoading(false);
        return;
      }

      // Verifica se o arquivo de logo existe
      const { data: listData } = await supabase.storage.from(BUCKET_NAME).list('logo', {
          search: 'logo.png'
      });

      if (listData && listData.length > 0) {
          const { data } = supabase.storage.from(BUCKET_NAME).getPublicUrl(LOGO_PATH);
          // Adiciona um timestamp para evitar problemas de cache do navegador
          setLogoUrl(`${data.publicUrl}?t=${new Date().getTime()}`);
      } else {
          setLogoUrl(null); // Nenhuma logo encontrada
      }
      setLoading(false);
    };

    fetchLogo();
  }, []);

  // Ajustando o tamanho da logo para ser maior (h-12 = 48px)
  const logoImageClasses = `h-12 w-auto ${className || ''}`;

  // Determine text color based on props
  const textColor = isFooter || isModal ? "text-white" : (isScrolled ? "text-gray-800" : "text-white");
  const starColor = isFooter || isModal ? "text-yellow-400" : (isScrolled ? "text-yellow-500" : "text-yellow-400");


  if (loading) {
    return (
      <div className="flex items-center space-x-3">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        <span className={`text-xl font-semibold ${textColor}`}>Carregando...</span>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-3">
      {logoUrl ? (
        <img
          src={logoUrl}
          alt="Flat Hotel Logo"
          className={logoImageClasses}
          width="48" // Ajustado para corresponder a h-12
          height="48" // Ajustado para corresponder a h-12
        />
      ) : (
        <div className={`h-12 w-12 flex items-center justify-center bg-gray-200 rounded ${className || ''}`}>
          <span className="text-xs text-gray-500">Logo</span>
        </div>
      )}
      <div className="flex flex-col">
        <span className={`text-xl font-semibold ${textColor}`}>Flat Hotel</span>
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