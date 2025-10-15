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
  const isBookingV2Page = location.pathname === '/booking-v2'; // Nova variável para identificar a página BookingV2

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

  const useDarkTextAndSolidBg = isLightPage || isScrolled;

  const headerClasses = cn(
    "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
    {
      "bg-white shadow-md py-2 border-b border-gray-200": useDarkTextAndSolidBg,
      "bg-transparent py-4": !useDarkTextAndSolidBg,
      "-translate-y-full": !isVisible,
    }
  );

  return (
    <header className={headerClasses}>
      <div className={cn(
        "container mx-auto px-4 flex items-center",
        isBookingV2Page ? "justify-center" : "justify-between" // Centraliza o logo na BookingV2, mantém o espaçamento nas outras
      )}>
        <Link to="/">
          <Logo isScrolled={useDarkTextAndSolidBg} />
        </Link>        
        {!isBookingV2Page && ( // Oculta Nav, Button e MobileNav na página BookingV2
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