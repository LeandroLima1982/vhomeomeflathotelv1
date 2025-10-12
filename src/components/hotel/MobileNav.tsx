"use client";

import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import Logo from "./Logo"; // Corrigido para default import

const navLinks = [
  { name: "Sobre", href: "#about" },
  { name: "Acomodações", href: "#rooms" },
  { name: "Comodidades", href: "#comodidades" },
  { name: "Galeria", href: "#galeria" },
  { name: "Contato", href: "#contato" },
];

type MobileNavProps = {
  isScrolled: boolean;
};

export function MobileNav({ isScrolled }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false);
  const iconColor = isScrolled ? "text-gray-800" : "text-white";

  const scrollToRooms = () => {
    const element = document.getElementById('rooms');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsOpen(false); // Close the mobile menu after clicking
  };

  return (
    <div className="md:hidden">
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon">
            <Menu className={`h-6 w-6 ${iconColor}`} />
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-[300px] sm:w-[400px] bg-white p-0">
          <div className="p-6 flex justify-between items-center border-b">
             <Logo isScrolled={true} />
             <SheetClose asChild>
                <Button variant="ghost" size="icon">
                    <X className="h-6 w-6" />
                </Button>
             </SheetClose>
          </div>
          <nav className="flex flex-col p-6 space-y-4">
            {navLinks.map((link) => (
              <SheetClose asChild key={link.name}>
                <a
                  href={link.href}
                  className="text-lg font-medium text-gray-700 hover:text-blue-800"
                  onClick={() => setIsOpen(false)}
                >
                  {link.name}
                </a>
              </SheetClose>
            ))}
            <Button onClick={scrollToRooms} className="mt-4 bg-blue-800 hover:bg-blue-900">
              Reservar Agora
            </Button>
          </nav>
        </SheetContent>
      </Sheet>
    </div>
  );
}