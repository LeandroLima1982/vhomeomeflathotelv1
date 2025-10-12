import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabaseClient";
import { useEffect, useState } from "react";

interface LogoProps {
  isScrolled?: boolean;
  isFooter?: boolean;
  className?: string;
}

export function Logo({ className, isScrolled, isFooter }: LogoProps) {
  const [logoUrl, setLogoUrl] = useState<string | null>(null);

  useEffect(() => {
    const { data } = supabase.storage.from('gallery').getPublicUrl('logo/logo.png');
    if (data.publicUrl) {
      // Adiciona um timestamp para evitar problemas de cache do navegador ao atualizar o logo
      setLogoUrl(`${data.publicUrl}?t=${new Date().getTime()}`);
    }
  }, []);

  const logoClasses = cn("h-14 w-auto", className);

  if (!logoUrl) {
    // Mostra um placeholder para evitar que o layout mude enquanto o logo carrega
    return <div className="h-14 w-[210px] bg-gray-300/20 animate-pulse rounded-md" />;
  }

  return (
    <img
      src={logoUrl}
      alt="V-Home Logo"
      className={logoClasses}
      width="210"
      height="56"
    />
  );
}