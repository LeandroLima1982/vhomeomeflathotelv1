import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import NavLinks from "./NavLinks";

const MobileNav = () => {
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
      <SheetContent side="left" className="p-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold">Menu</h2>
        </div>
        <nav>
          <ul className="space-y-4">
            <NavLinks isMobile={true} />
          </ul>
        </nav>
      </SheetContent>
    </Sheet>
  );
};

export default MobileNav;