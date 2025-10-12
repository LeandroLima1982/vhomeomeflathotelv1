"use client";

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Loader2 } from 'lucide-react'; // Para um indicador de carregamento

interface LogoProps {
  className?: string;
}

const BUCKET_NAME = 'gallery';
const LOGO_PATH = 'logo/logo.png'; // Caminho fixo para o logo no Supabase Storage

const Logo: React.FC<LogoProps> = ({ className }) => {
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

  const logoClasses = `h-8 w-auto ${className || ''}`;

  if (loading) {
    return (
      <div className="flex items-center space-x-3">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        <span className="text-xl font-semibold text-gray-800">Carregando...</span>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-3">
      {logoUrl ? (
        <img
          src={logoUrl}
          alt="Flat Hotel Logo"
          className={logoClasses}
          width="32"
          height="32"
        />
      ) : (
        <div className={`h-8 w-8 flex items-center justify-center bg-gray-200 rounded ${className || ''}`}>
          <span className="text-xs text-gray-500">Logo</span>
        </div>
      )}
      <span className="text-xl font-semibold text-gray-800">Flat Hotel</span>
    </div>
  );
};

export default Logo;