import Logo from "./Logo";
import { Mail, Phone, Facebook, Instagram } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

export default function Footer() {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  const getLinkHref = (href: string) => {
    return isHomePage ? href : `/${href}`;
  };

  return (
    <footer id="contato" className="bg-blue-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <Logo isFooter={true} />
            <p className="mt-4 text-gray-300 max-w-md">
              Hotel 4 estrelas localizado na Av. Atlântica em Macaé, oferecendo conforto e sofisticação à beira-mar.
            </p>
            <div className="flex space-x-4 mt-4">
              <a href="#" className="text-white hover:text-gray-300 p-2 bg-blue-800 rounded-md">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-white hover:text-gray-300 p-2 bg-blue-800 rounded-md">
                <Instagram size={20} />
              </a>
            </div>
          </div>
          <div>
            <h3 className="font-bold text-lg text-white">Links Rápidos</h3>
            <ul className="mt-4 space-y-2">
              <li><a href={getLinkHref("#about")} className="text-gray-300 hover:text-white">Sobre</a></li>
              <li><a href={getLinkHref("#galeria")} className="text-gray-300 hover:text-white">Imagens</a></li>
              <li><a href={getLinkHref("#comodidades")} className="text-gray-300 hover:text-white">Comodidades</a></li>
              <li><a href={getLinkHref("#rooms")} className="text-gray-300 hover:text-white">Acomodações</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-lg text-white">Contato</h3>
            <ul className="mt-4 space-y-2">
              <li className="flex items-center text-gray-300">
                <Mail className="w-4 h-4 mr-2" />
                contato@vhomeflathotel.com
              </li>
              <li className="flex items-center text-gray-300">
                <Phone className="w-4 h-4 mr-2" />
                (22) 2141-2091
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-blue-800 mt-8 pt-8 text-center text-gray-300">
          <p>&copy; 2025 V-Home Flat Hotel. Todos os direitos reservados.</p>
          <p className="mt-2 text-sm">
            Um empreendimento <Link to="/institucional" className="underline hover:text-white">VERY</Link>.
          </p>
        </div>
      </div>
    </footer>
  );
}