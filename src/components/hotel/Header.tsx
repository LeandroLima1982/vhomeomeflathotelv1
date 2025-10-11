"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Logo } from './Logo';
import { Nav } from './Nav';
import { MobileNav } from './MobileNav';
import clsx from 'clsx';

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Define se o fundo do header deve mudar
      setIsScrolled(currentScrollY > 50);

      // Define a visibilidade do header com base na direção do scroll
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Rolando para baixo
        setIsVisible(false);
      } else {
        // Rolando para cima
        setIsVisible(true);
      }

      // Atualiza a última posição de scroll
      setLastScrollY(currentScrollY <= 0 ? 0 : currentScrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const headerClasses = clsx(
    "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
    {
      "bg-white shadow-md": isScrolled,
      "bg-transparent": !isScrolled,
      "-translate-y-full": !isVisible, // Oculta o header
      "translate-y-0": isVisible,     // Mostra o header
    }
  );

  const containerClasses = clsx(
    "container mx-auto flex items-center justify-between px-4 md:px-6 transition-all duration-300",
    {
      "h-20": isScrolled,
      "h-28": !isScrolled,
    }
  );

  return (
    <header className={headerClasses}>
      <div className={containerClasses}>
        <a href="#" className="flex items-center gap-2">
          <Logo isScrolled={isScrolled} />
        </a>
        <Nav isScrolled={isScrolled} />
        <div className="flex items-center gap-4">
          <Button variant={isScrolled ? "default" : "outline"}>Reservar agora</Button>
          <MobileNav isScrolled={isScrolled} />
        </div>
      </div>
    </header>
  );
}