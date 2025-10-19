"use client";

import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Logo from "./Logo";
import { Nav } from "./Nav";
import MobileNav from "./MobileNav";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const lastScrollY = useRef(0);
  const location = useLocation();
  const navigate = useNavigate();
  const isLightPage = location.pathname === '/institucional';
  const isBookingV2Page = location.pathname === '/booking-v2';
  const isCheckoutPage = location.pathname === '/checkout'; // Nova variável para identificar a página de checkout
  const isSpecialPage = isCheckoutPage || isBookingV2Page; 

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      setIsScrolled(currentScrollY > 10);

      // Removida a lógica de isVisible para manter o header sempre visível
      // lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const useDarkTextAndSolidBg = isLightPage || isScrolled;
  
  // Removida a variável headerIsVisible, sempre true
  const headerClasses = cn(
    "top-0 left-0 right-0 z-50 transition-all duration-300",
    {
      "fixed": !isSpecialPage,
      "absolute": isSpecialPage,
      "bg-white shadow-md py-2 border-b border-gray-200": useDarkTextAndSolidBg && !isSpecialPage,
      "bg-transparent py-4": !useDarkTextAndSolidBg || isSpecialPage,
      // Removida a classe "-translate-y-full" para manter sempre visível
    }
  );

  return (
    <header className={headerClasses}>
      <div className={cn(
        "container mx-auto px-4 flex items-center justify-between"
      )}>
        <Link to="/">
          <Logo 
            isScrolled={useDarkTextAndSolidBg} 
            isTransparentHeaderOnLightBackground={isCheckoutPage} // Agora passa 'true' apenas para a página de checkout
          />
        </Link>        
        {!isSpecialPage && (
          <div className="flex items-center gap-4">
            <Nav isScrolled={useDarkTextAndSolidBg} />
            <Button
              onClick={() => navigate('/booking-v2')}
              className={cn(
                "hidden md:inline-flex transition-colors",
                useDarkTextAndSolidBg
                  ? "bg-blue-800 hover:bg-blue-900 text-white"
                  : "bg-white hover:bg-gray-200 text-gray-800"
              )}
            >
              Reservar Agora
            </Button>
            <div className="md:hidden">
              <MobileNav />
            </div>
          </div>
        )}
      </div>
    </header>
  );
}