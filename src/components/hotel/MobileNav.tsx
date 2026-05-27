import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu, Home, Bed, Star, Image, Phone, Calendar } from "lucide-react";
import Logo from "./Logo";
import { generateWhatsAppLink } from "@/utils/reservationLinks";

const MobileNav = () => {
  const handleReserveClick = () => {
    const whatsappLink = generateWhatsAppLink();
    window.open(whatsappLink, '_blank');
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon"
          className="bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300 shadow-sm transition-all duration-200"
        >
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent 
        side="left" 
        className="p-6 flex flex-col h-full max-h-[80vh] bg-gradient-to-b from-white to-gray-50 border-r border-gray-200 shadow-xl"
      >
        <div className="flex flex-col flex-grow gap-6">
          <div className="flex justify-center mb-4">
            <div className="hover:scale-105 transition-transform duration-200 cursor-pointer">
              <Logo isScrolled={true} className="h-12" />
            </div>
          </div>

          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-800">Menu</h2>
          </div>

          <nav className="flex-grow">
            <ul className="space-y-6" role="menu">
              <li role="menuitem">
                <SheetClose asChild>
                  <a href="#about" className="flex items-center gap-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200 py-2 px-3 rounded-lg">
                    <Home className="w-5 h-5 text-blue-600" />
                    <span className="font-medium">Sobre</span>
                  </a>
                </SheetClose>
              </li>
              <li role="menuitem">
                <SheetClose asChild>
                  <a href="#rooms" className="flex items-center gap-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200 py-2 px-3 rounded-lg">
                    <Bed className="w-5 h-5 text-blue-600" />
                    <span className="font-medium">Acomodações</span>
                  </a>
                </SheetClose>
              </li>
              <li role="menuitem">
                <SheetClose asChild>
                  <a href="#comodidades" className="flex items-center gap-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200 py-2 px-3 rounded-lg">
                    <Star className="w-5 h-5 text-blue-600" />
                    <span className="font-medium">Comodidades</span>
                  </a>
                </SheetClose>
              </li>
              <li role="menuitem">
                <SheetClose asChild>
                  <a href="#galeria" className="flex items-center gap-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200 py-2 px-3 rounded-lg">
                    <Image className="w-5 h-5 text-blue-600" />
                    <span className="font-medium">Imagens</span>
                  </a>
                </SheetClose>
              </li>
              <li role="menuitem">
                <SheetClose asChild>
                  <a href="#contato" className="flex items-center gap-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200 py-2 px-3 rounded-lg">
                    <Phone className="w-5 h-5 text-blue-600" />
                    <span className="font-medium">Contato</span>
                  </a>
                </SheetClose>
              </li>
            </ul>
          </nav>

          <div className="mt-auto pt-6 border-t border-gray-200">
            <SheetClose asChild>
              <Button
                onClick={handleReserveClick}
                className="w-full bg-gradient-to-r from-blue-700 to-blue-800 hover:from-blue-800 hover:to-blue-900 text-white py-4 text-lg font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
              >
                <Calendar className="w-5 h-5 mr-2" />
                Reservar via WhatsApp
              </Button>
            </SheetClose>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileNav;