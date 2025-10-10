"use client";

import { Facebook, Instagram } from "lucide-react";

const Logo = () => (
    <div className="text-2xl font-bold">
      <span className="text-blue-600">V</span>
      <span className="text-gray-300">Home</span>
    </div>
  );

export function Footer() {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <Logo />
            <p className="mt-4 text-gray-400 max-w-md">
              Hotel 4 estrelas localizado na Av. Atlântica em Macaé, oferecendo conforto e sofisticação à beira-mar.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-4">Links Rápidos</h3>
            <ul className="space-y-2">
              <li><a href="#sobre" className="text-gray-400 hover:text-white">Sobre</a></li>
              <li><a href="#comodidades" className="text-gray-400 hover:text-white">Comodidades</a></li>
              <li><a href="#galeria" className="text-gray-400 hover:text-white">Galeria</a></li>
              <li><a href="#depoimentos" className="text-gray-400 hover:text-white">Depoimentos</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-4">Contato</h3>
            <ul className="space-y-2 text-gray-400">
              <li>Av. Atlântica, 433, Macaé - RJ</li>
              <li>contato@vhomeflathotel.com.br</li>
              <li>(22) 1234-5678</li>
            </ul>
            <div className="flex gap-4 mt-4">
              <a href="#" className="text-gray-400 hover:text-white"><Facebook /></a>
              <a href="#" className="text-gray-400 hover:text-white"><Instagram /></a>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-700 pt-6 text-center text-gray-500 text-sm">
          <p>&copy; {new Date().getFullYear()} V-Home Flat Hotel. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
}