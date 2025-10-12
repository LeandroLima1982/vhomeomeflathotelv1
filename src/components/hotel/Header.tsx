"use client";

import { useState, useEffect } from "react";
import { Logo } from "./Logo";
import { Nav } from "./Nav";
import { MobileNav } from "./MobileNav";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Define se a página foi rolada para além do topo
      setIsScrolled(currentScrollY > 50);

      // Determina a direção da rolagem para a visibilidade
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Rolando para baixo
        setIsVisible(false);
      } else {
        // Rolando para cima
        setIsVisible(true);
      }

      // Guarda a posição atual para a próxima verificação
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Define o estado inicial ao carregar
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [lastScrollY]);

  const headerClasses = cn(
    "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
    {
      "bg-white/80 backdrop-blur-sm shadow-md py-2": isScrolled,
      "bg-transparent py-4": !isScrolled,
      "transform -translate-y-full": !isVisible && isScrolled, // Oculta apenas quando rolando para baixo
    }
  );

  return (
    <header className={headerClasses}>
      <div className="container mx-auto px-4 flex justify-between items-center">
        <a href="#">
          <Logo isScrolled={isScrolled} />
        </a>
        <div className="flex items-center gap-4">
          <Nav isScrolled={isScrolled} />
          <Button
            className={cn(
              "hidden md:inline-flex transition-colors",
              isScrolled
                ? "bg-blue-800 hover:bg-blue-900 text-white"
                : "bg-white hover:bg-gray-200 text-gray-800"
            )}
          >
            Reservar Agora
          </Button>
          <MobileNav isScrolled={isScrolled} />
        </div>
      </div>
    </header>
  );
}