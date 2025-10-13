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
      "bg-white/20 backdrop-blur-md border-b border-white/20 shadow-lg py-2": useDarkTextAndSolidBg,
      "bg-transparent py-4": !useDarkTextAndSolidBg,
      "-translate-y-full": !isVisible,
    }
  );

  return (
    <header className={headerClasses}>
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link to="/">
          <Logo isScrolled={useDarkTextAndSolidBg} />
        </Link>
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