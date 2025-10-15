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
    // A lógica de rolagem agora se aplica a todas as páginas, incluindo as especiais.
    // O cabeçalho será transparente no topo e ficará sólido ao rolar.
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
  }, []); // Removido isSpecialPage das dependências para que a lógica de scroll sempre funcione

  const scrollToRooms = () => {
    const element = document.getElementById('rooms');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // O cabeçalho será sólido se for uma página clara (institucional) OU se estiver rolado.
  // Páginas especiais (BookingV2, Checkout) agora seguem essa mesma lógica.
  const useDarkTextAndSolidBg = isLightPage || isScrolled;
  
  // O cabeçalho é visível se a lógica de rolagem o permite OU se for uma página especial (para garantir que nunca se esconda).
  // No entanto, como a lógica de rolagem agora se aplica a páginas especiais,
  // `isVisible` já será `true` no topo e `false` ao rolar para baixo,
  // mas o `fixed` e `z-50` garantem que ele esteja sempre "visível" no sentido de estar na tela.
  // A classe `-translate-y-full` é que o esconde.
  // Para garantir que ele NUNCA se esconda em páginas especiais, mantemos a condição `isVisible || isSpecialPage`.
  const headerIsVisible = isVisible || isSpecialPage;


  const headerClasses = cn(
    "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
    {
      "bg-white shadow-md py-2 border-b border-gray-200": useDarkTextAndSolidBg,
      "bg-transparent py-4": !useDarkTextAndSolidBg,
      "-translate-y-full": !headerIsVisible, // Esta classe só será aplicada se headerIsVisible for false
    }
  );

  return (
    <header className={headerClasses}>
      <div className={cn(
        "container mx-auto px-4 flex items-center justify-between" // Sempre justify-between para logo à esquerda
      )}>
        <Link to="/">
          <Logo isScrolled={useDarkTextAndSolidBg} />
        </Link>        
        {/* Nav, Button e MobileNav agora são sempre exibidos, inclusive em páginas especiais */}
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
      </div>
    </header>
  );
}