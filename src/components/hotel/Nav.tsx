"use client";

import NavLinks from "./NavLinks";

type NavProps = {
  isScrolled: boolean;
};

export function Nav({ isScrolled }: NavProps) {
  const linkClasses = `
    hidden md:flex gap-6 font-medium
    ${isScrolled ? "text-gray-800" : "text-white"}
  `;

  return (
    <nav className={linkClasses}>
      <NavLinks isScrolled={isScrolled} />
    </nav>
  );
}