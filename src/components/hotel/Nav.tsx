"use client";

import { cn } from "@/lib/utils";

type NavProps = {
  isScrolled: boolean;
};

const navItems = [
  { href: "#about", label: "Sobre" },
  { href: "#comodidades", label: "Comodidades" },
  { href: "#perto", label: "Proximidades" },
  { href: "#galeria", label: "Galeria" },
  { href: "#contato", label: "Contato" },
];

export function Nav({ isScrolled }: NavProps) {
  const linkClasses = cn(
    "text-sm font-medium transition-colors hover:text-blue-600",
    isScrolled ? "text-gray-700" : "text-white"
  );

  return (
    <nav className="hidden md:flex items-center gap-6">
      {navItems.map((item) => (
        <a key={item.href} href={item.href} className={linkClasses}>
          {item.label}
        </a>
      ))}
    </nav>
  );
}