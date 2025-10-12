import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu } from "lucide-react"

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Hotel Paraíso</h1>
        <nav className="hidden md:flex items-center space-x-6">
          <a href="#about" className="text-gray-600 hover:text-blue-600 transition-colors">Sobre</a>
          <a href="#rooms" className="text-gray-600 hover:text-blue-600 transition-colors">Acomodações</a>
          <a href="#comodidades" className="text-gray-600 hover:text-blue-600 transition-colors">Comodidades</a>
          <a href="#galeria" className="text-gray-600 hover:text-blue-600 transition-colors">Galeria</a>
          <a href="#contato" className="text-gray-600 hover:text-blue-600 transition-colors">Contato</a>
          <Button>Reservar Agora</Button>
        </nav>
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <nav className="flex flex-col space-y-4 mt-8">
                <a href="#about" className="text-gray-600 hover:text-blue-600 transition-colors">Sobre</a>
                <a href="#rooms" className="text-gray-600 hover:text-blue-600 transition-colors">Acomodações</a>
                <a href="#comodidades" className="text-gray-600 hover:text-blue-600 transition-colors">Comodidades</a>
                <a href="#galeria" className="text-gray-600 hover:text-blue-600 transition-colors">Galeria</a>
                <a href="#contato" className="text-gray-600 hover:text-blue-600 transition-colors">Contato</a>
                <Button className="mt-4">Reservar Agora</Button>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}