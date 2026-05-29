"use client";

import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Phone, Instagram, Facebook } from 'lucide-react';
import Logo from './Logo';
import { Button } from '@/components/ui/button';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Início', href: '#home' },
    { name: 'Acomodações', href: '#acomodacoes' },
    { name: 'Galeria', href: '#gallery' },
    { name: 'Localização', href: '#location' },
    { name: 'Contato', href: '#contact' },
  ];

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (isHome && href.startsWith('#')) {
      e.preventDefault();
      const element = document.querySelector(href);
      if (element) {
        const offset = 80;
        const bodyRect = document.body.getBoundingClientRect().top;
        const elementRect = element.getBoundingClientRect().top;
        const elementPosition = elementRect - bodyRect;
        const offsetPosition = elementPosition - offset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled || !isHome ? 'bg-white shadow-md py-2' : 'bg-transparent py-4'
      }`}
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link to="/" className="flex items-center">
          <Logo isScrolled={isScrolled || !isHome} />
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={isHome ? link.href : `/${link.href}`}
              onClick={(e) => handleNavClick(e, link.href)}
              className={`font-medium transition-colors hover:text-blue-600 ${
                isScrolled || !isHome ? 'text-gray-700' : 'text-white'
              }`}
            >
              {link.name}
            </a>
          ))}
          <Button className="bg-blue-700 hover:bg-blue-800 text-white rounded-full px-6">
            Reservar Agora
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden p-2"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? (
            <X className={isScrolled || !isHome ? 'text-gray-800' : 'text-white'} />
          ) : (
            <Menu className={isScrolled || !isHome ? 'text-gray-800' : 'text-white'} />
          )}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white shadow-xl border-t animate-fade-in">
          <div className="flex flex-col p-6 space-y-4">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={isHome ? link.href : `/${link.href}`}
                onClick={(e) => handleNavClick(e, link.href)}
                className="text-lg font-medium text-gray-800 hover:text-blue-700 py-2 border-b border-gray-100"
              >
                {link.name}
              </a>
            ))}
            <div className="pt-4 flex flex-col space-y-4">
              <Button className="bg-blue-700 hover:bg-blue-800 text-white w-full py-6 text-lg">
                Reservar Agora
              </Button>
              <div className="flex justify-center space-x-6 pt-4">
                <Instagram className="text-gray-600 w-6 h-6" />
                <Facebook className="text-gray-600 w-6 h-6" />
                <Phone className="text-gray-600 w-6 h-6" />
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
