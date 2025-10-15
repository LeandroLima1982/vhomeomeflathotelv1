"use client";

import Logo from "./Logo";
import { Mail, Phone } from "lucide-react";
import { Link } from "react-router-dom";

export default function SimpleFooter() {
  return (
    <footer className="bg-blue-900 text-white py-8">
      <div className="container mx-auto px-4 text-center">
        <div className="flex flex-col items-center justify-center space-y-4">
          <Logo isFooter={true} className="h-12" /> {/* Logo menor para o rodapé simplificado */}
          
          <div className="flex flex-col sm:flex-row items-center gap-4 text-gray-300 text-sm">
            <div className="flex items-center">
              <Mail className="w-4 h-4 mr-2" />
              contato@vhomeflathotel.com
            </div>
            <div className="flex items-center">
              <Phone className="w-4 h-4 mr-2" />
              (22) 2141-2091
            </div>
          </div>

          <div className="flex gap-4 text-gray-400 text-xs">
            {/* Links de exemplo para políticas - você pode criar essas páginas se necessário */}
            <Link to="/politica-de-privacidade" className="hover:text-white">Política de Privacidade</Link>
            <Link to="/termos-de-servico" className="hover:text-white">Termos de Serviço</Link>
          </div>

          <div className="border-t border-blue-800 w-full max-w-md mt-6 pt-6 text-gray-300 text-sm">
            <p>&copy; 2025 V-Home Flat Hotel. Todos os direitos reservados.</p>
            <p className="mt-1 text-xs">
              Um empreendimento <Link to="/institucional" className="underline hover:text-white">VERY Construtora</Link>.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}