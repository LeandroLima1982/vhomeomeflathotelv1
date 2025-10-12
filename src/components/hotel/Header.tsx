"use client";

import { useState, useEffect, useRef } from "react";
import { Logo } from "./Logo";
import { Nav } from "./Nav";
import { MobileNav } from "./MobileNav";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      setIsScrolled(currentScrollY > 50);

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

  const headerClasses = cn(
    "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
    {
      "bg-white/20 backdrop-blur-md border-b border-white/20 shadow-lg py-2": isScrolled,
      "bg-transparent py-4": !isScrolled,
      "-translate-y-full": !isVisible,
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