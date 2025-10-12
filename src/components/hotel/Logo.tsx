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

  // O logo é maior quando a página está no topo (!isScrolled) e não está no rodapé.
  const isLarge = !isScrolled && !isFooter;

  const logoClasses = cn(
    "w-auto transition-all duration-300",
    {
      "h-20": isLarge, // Tamanho maior no topo
      "h-14": !isLarge, // Tamanho normal ao rolar ou no rodapé
    },
    className
  );

  const placeholderClasses = cn(
    "bg-gray-300/20 animate-pulse rounded-md transition-all duration-300",
    {
      "h-20 w-[300px]": isLarge,
      "h-14 w-[210px]": !isLarge,
    }
  );

  if (!logoUrl) {
    // Mostra um placeholder com o tamanho correto para evitar que o layout mude
    return <div className={placeholderClasses} />;
  }

  return (
    <img
      src={logoUrl}
      alt="V-Home Logo"
      className={logoClasses}
    />
  );
}