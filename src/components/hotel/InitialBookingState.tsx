"use client";

import { Search, Calendar, Users } from "lucide-react";

export function InitialBookingState() {
  return (
    <div className="text-center p-10 bg-white rounded-lg shadow-md border border-gray-100">
      <div className="flex items-center justify-center gap-4 mb-6 text-blue-600">
        <Search className="h-12 w-12" />
        <Calendar className="h-10 w-10" />
        <Users className="h-10 w-10" />
      </div>
      <h3 className="text-2xl font-bold text-gray-800 mb-3">Encontre sua Acomodação Ideal</h3>
      <p className="text-gray-600 mt-2 max-w-md mx-auto">
        Use o formulário acima para verificar a disponibilidade e os preços para as suas datas de viagem e número de hóspedes.
      </p>
      <p className="text-sm text-gray-500 mt-4">
        Selecione as datas de check-in e check-out, informe o número de hóspedes e clique em "Verificar".
      </p>
    </div>
  );
}