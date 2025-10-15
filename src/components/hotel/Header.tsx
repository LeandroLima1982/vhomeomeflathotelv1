"use client";

import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import Logo from "./Logo";
import { Nav } from "./Nav";
import MobileNav from "./MobileNav";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);
  const location = useLocation();
  const isLightPage = location.pathname === '/institucional';
  const isSpecialPage = location.pathname === '/booking-v2' || location.pathname === '/checkout'; 

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      setIsScrolled(currentScrollY > 10);

      if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
        // Rolando para baixo
        setIsVisible(false);
      } else {
        // Rolando para cima
        setIsVisible(true);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToRooms = () => {
    const element = document.getElementById('rooms');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // O cabeçalho será sólido se for uma página clara (institucional) OU se estiver rolado.
  const useDarkTextAndSolidBg = isLightPage || isScrolled;
  
  // O cabeçalho é visível se a lógica de rolagem o permite OU se for uma página especial (para garantir que nunca se esconda).
  // Para páginas especiais, o cabeçalho não será fixo, então a visibilidade não importa para o translate-y-full
  const headerIsVisible = isVisible || isSpecialPage;


  const headerClasses = cn(
    "top-0 left-0 right-0 z-50 transition-all duration-300", // Classes base
    {
      "fixed": !isSpecialPage, // Fixed for non-special pages
      "absolute": isSpecialPage, // Absolute for special pages
      "bg-white shadow-md py-2 border-b border-gray-200": useDarkTextAndSolidBg && !isSpecialPage,
      "bg-transparent py-4": !useDarkTextAndSolidBg || isSpecialPage,
      "-translate-y-full": !headerIsVisible && !isSpecialPage, // Esconde apenas se não for especial E não estiver visível
    }
  );

  return (
    <header className={headerClasses}>
      <div className={cn(
        "container mx-auto px-4 flex items-center justify-between"
      )}>
        <Link to="/">
          <Logo isScrolled={useDarkTextAndSolidBg} />
        </Link>        
        {/* Oculta Nav, Button e MobileNav se for uma página especial */}
        {!isSpecialPage && (
          <div className="flex items-center gap-4">
            <Nav isScrolled={useDarkTextAndSolidBg} />
            <Button
              onClick={scrollToRooms}
              className={cn(
                "hidden md:inline-flex transition-colors",
                useDarkTextAndSolidBg
                  ? "bg-blue-800 hover:bg-blue-900 text-white"
                  : "bg-white hover:bg-gray-200 text-gray-800"
              )}
            >
              Reservar Agora
            </Button>
            <MobileNav />
          </div>
        )}
      </div>
    </header>
  );
}