"use client";

const navLinks = [
  { name: "Sobre", href: "#about" },
  { name: "Acomodações", href: "#rooms" },
  { name: "Comodidades", href: "#comodidades" },
  { name: "Galeria", href: "#galeria" },
  { name: "Contato", href: "#contato" },
];

type NavProps = {
  isScrolled: boolean;
};

export function Nav({ isScrolled }: NavProps) {
  const linkClasses = `
    hidden md:flex gap-6 font-medium
    ${isScrolled ? "text-white" : "text-white"}
  `;

  const hoverClasses = isScrolled ? "hover:text-gray-300" : "hover:text-gray-300";

  return (
    <nav className={linkClasses}>
      {navLinks.map((link) => (
        <a key={link.name} href={link.href} className={`transition-colors ${hoverClasses}`}>
          {link.name}
        </a>
      ))}
    </nav>
  );
}