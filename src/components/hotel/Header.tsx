"use client";

import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import Logo from "./Logo";
import { Nav } from "./Nav";
import MobileNav from "./MobileNav";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { generateWhatsAppLink } from "@/utils/reservationLinks";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const isLightPage = location.pathname === '/institucional';
  const isBookingV2Page = location.pathname === '/booking-v2';
  const isCheckoutPage = location.pathname === '/checkout';
  const isSpecialPage = isCheckoutPage || isBookingV2Page; 

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const useDarkTextAndSolidBg = isLightPage || isScrolled;
  
  const headerClasses = cn(
    "top-0 left-0 right-0 z-50 transition-all duration-300",
    {
      "fixed": !isSpecialPage,
      "absolute": isSpecialPage,
      "bg-white shadow-md py-2 border-b border-gray-200": useDarkTextAndSolidBg && !isSpecialPage,
      "bg-transparent py-4": !useDarkTextAndSolidBg || isSpecialPage,
    }
  );

  const handleReserveClick = () => {
    const whatsappLink = generateWhatsAppLink();
    window.open(whatsappLink, '_blank');
  };

  return (
    <header className={headerClasses}>
      <div className={cn(
        "container mx-auto px-4 flex items-center justify-between"
      )}>
        <Link to="/">
          <Logo 
            isScrolled={useDarkTextAndSolidBg} 
            isTransparentHeaderOnLightBackground={isCheckoutPage}
          />
        </Link>        
        {!isSpecialPage && (
          <div className="flex items-center gap-4">
            <Nav isScrolled={useDarkTextAndSolidBg} />
            <Button
              onClick={handleReserveClick}
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