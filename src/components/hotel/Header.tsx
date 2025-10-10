"use client";

import { useState, useEffect } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

const Logo = ({ isScrolled }: { isScrolled: boolean }) => (
  <div className="flex items-baseline gap-2">
    <div className="text-2xl font-bold">
      <span className="text-blue-600">V</span>
      <span className={isScrolled ? "text-gray-800" : "text-white"}>Home</span>
    </div>
    <span className={`font-light ${isScrolled ? "text-gray-600" : "text-gray-200"}`}>Flat Hotel</span>
  </div>
);

const NavLinks = ({ className }: { className?: string }) => (
  <nav className={`items-center gap-6 ${className}`}>
    <a href="#" className="hover:text-blue-600 transition-colors">Início</a>
    <a href="#sobre" className="hover:text-blue-600 transition-colors">Sobre</a>
    <a href="#galeria" className="hover:text-blue-600 transition-colors">Galeria</a>
    <a href="#comodidades" className="hover:text-blue-600 transition-colors">Comodidades</a>
    <a href="#contato" className="hover:text-blue-600 transition-colors">Contato</a>
  </nav>
);

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const headerClasses = `
    fixed top-0 left-0 right-0 z-50 transition-all duration-300
    ${isScrolled ? "bg-white shadow-md text-gray-800" : "bg-transparent text-white"}
  `;

  return (
    <header className={headerClasses}>
      <div className="container mx-auto flex h-20 items-center justify-between px-4 md:px-6">
        <a href="#" className="flex items-center gap-2">
          <Logo isScrolled={isScrolled} />
        </a>
        <div className="hidden md:flex items-center gap-6">
          <NavLinks className="flex" />
          <Button className="bg-blue-700 hover:bg-blue-800">
            Reserve Agora
          </Button>
        </div>
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Abrir menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px] bg-white text-gray-800">
              <div className="flex flex-col gap-6 p-6">
                <a href="#" className="flex items-center gap-2">
                  <Logo isScrolled={true} />
                </a>
                <NavLinks className="flex flex-col gap-4 text-lg" />
                <Button className="mt-4 bg-blue-700 hover:bg-blue-800">Reserve Agora</Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}