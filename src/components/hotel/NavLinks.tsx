"use client";

import { SheetClose } from "@/components/ui/sheet";
import { useLocation } from "react-router-dom";

const navLinks = [
  { name: "Sobre nós", href: "#about" },
  { name: "Acomodações", href: "#acomodacoes" },
  { name: "Comodidades", href: "#comodidades" },
  { name: "Imagens", href: "#galeria" },
  { name: "Contato", href: "#contato" },
];

interface NavLinksProps {
  isMobile?: boolean;
  isScrolled?: boolean;
}

const NavLinks = ({ isMobile, isScrolled }: NavLinksProps) => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  const getLinkHref = (href: string) => {
    return isHomePage ? href : `/${href}`;
  };

  if (isMobile) {
    return (
      <>
        {navLinks.map((link) => (
          <li key={link.name}>
            <SheetClose asChild>
              <a
                href={getLinkHref(link.href)}
                className="block text-lg text-gray-700 hover:text-blue-600 transition-colors"
              >
                {link.name}
              </a>
            </SheetClose>
          </li>
        ))}
      </>
    );
  }

  // Desktop version
  const hoverClasses = isScrolled ? "hover:text-gray-600" : "hover:text-gray-300";
  return (
    <>
      {navLinks.map((link) => (
        <a key={link.name} href={getLinkHref(link.href)} className={`transition-colors ${hoverClasses}`}>
          {link.name}
        </a>
      ))}
    </>
  );
};

export default NavLinks;
