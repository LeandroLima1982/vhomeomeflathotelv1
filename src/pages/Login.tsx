"use client";

import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '@/lib/supabaseClient';
import Logo from '@/components/hotel/Logo';
import { ArrowLeft } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const [loginError, setLoginError] = useState<string | null>(null);

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        setTimeout(() => {
          navigate('/admin');
        }, 800);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 relative">
      <div className="absolute top-8 left-8">
        <Link 
          to="/" 
          className="flex items-center text-gray-600 hover:text-blue-700 transition-colors font-medium group"
        >
          <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
          Voltar ao site
        </Link>
      </div>

      <div className="mb-8">
        <Link to="/" className="hover:opacity-90 transition-opacity">
          <Logo isScrolled={true} />
        </Link>
      </div>
      
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">Acesso Administrativo</h2>
        <p className="text-center text-gray-500 mb-8">Faça login para gerenciar o conteúdo do site.</p>
        
        {loginError && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-700 text-sm">{loginError}</p>
          </div>
        )}
        
        <Auth
          supabaseClient={supabase}
          appearance={{ theme: ThemeSupa }}
          providers={[]}
          theme="light"
          showLinks={false}
          localization={{
            variables: {
              sign_in: {
                email_label: 'Endereço de e-mail',
                password_label: 'Sua senha',
                email_input_placeholder: 'seu@email.com',
                password_input_placeholder: 'Sua senha',
                button_label: 'Entrar',
                loading_button_label: 'Entrando...',
              }
            },
          }}
          onAuthError={(error) => {
            setLoginError(error.message || 'Erro ao fazer login. Verifique suas credenciais.');
          }}
        />
      </div>
    </div>
  );
};

export default Login;