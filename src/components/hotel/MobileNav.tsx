import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import NavLinks from "./NavLinks";
import { useNavigate } from "react-router-dom";
import Logo from "./Logo";

const MobileNav = () => {
  const navigate = useNavigate();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon"
          className="bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300 shadow-sm"
        >
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-4 flex flex-col h-full">
        <div className="flex flex-col flex-grow">
          {/* Logo no topo */}
          <div className="flex justify-center mb-6">
            <Logo isScrolled={true} />
          </div>

          {/* Título do menu */}
          <div className="text-center mb-6">
            <h2 className="text-xl font-semibold text-gray-800">Menu</h2>
          </div>

          {/* Navegação principal */}
          <nav className="flex-grow">
            <ul className="space-y-4">
              <NavLinks isMobile={true} />
            </ul>
          </nav>

          {/* Botão de ação na parte inferior */}
          <div className="mt-auto pt-6 border-t border-gray-200">
            <Button
              onClick={() => navigate('/booking-v2')}
              className="w-full bg-blue-800 hover:bg-blue-900 text-white py-3 text-lg font-medium"
            >
              Reservar Agora
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileNav;