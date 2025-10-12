import { supabase } from "@/lib/supabaseClient";
import React from "react";

interface SupabaseProviderProps {
  children: React.ReactNode;
}

export default function SupabaseProvider({ children }: SupabaseProviderProps) {
  if (!supabase) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center p-8 bg-white rounded-lg shadow-md max-w-lg mx-4">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Erro de Configuração</h1>
          <p className="text-gray-700">
            A conexão com o Supabase não pôde ser estabelecida.
          </p>
          <p className="text-gray-600 mt-2">
            Por favor, verifique se as variáveis de ambiente <code className="bg-gray-200 p-1 rounded text-sm">VITE_SUPABASE_URL</code> e <code className="bg-gray-200 p-1 rounded text-sm">VITE_SUPABASE_ANON_KEY</code> estão configuradas corretamente no seu ambiente de deploy.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}