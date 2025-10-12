"use client";

import { useState, useEffect } from "react";
import { Logo } from "./Logo";
import { Nav } from "./Nav";
import { MobileNav } from "./MobileNav";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Set initial state on mount
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const headerClasses = cn(
    "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
    {
      "bg-white shadow-md py-2": isScrolled,
      "bg-transparent py-4": !isScrolled,
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