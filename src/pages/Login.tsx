import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '@/lib/supabaseClient';
import Logo from '@/components/hotel/Logo';
import { initializeAdminUsers, checkIfScriptExecuted } from '@/utils/initAdminUsers';
import { showSuccess } from '@/utils/toast';
import { Loader2 } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const initializeIfNeeded = async () => {
      try {
        const alreadyExecuted = await checkIfScriptExecuted();
        
        if (!alreadyExecuted) {
          console.log('Executando script de inicialização de usuários...');
          const success = await initializeAdminUsers();
          
          if (success) {
            showSuccess('Usuários administradores inicializados com sucesso!');
          }
        }
      } catch (error) {
        console.error('Erro durante inicialização:', error);
      } finally {
        setIsInitializing(false);
      }
    };

    initializeIfNeeded();
  }, []);

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
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

  if (isInitializing) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600 mb-4" />
        <p className="text-gray-600">Preparando o painel...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <div className="mb-8">
            <Logo isScrolled={true} />
        </div>
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">Acesso Administrativo</h2>
        <p className="text-center text-gray-500 mb-8">Faça login para gerenciar o conteúdo do site.</p>
        <Auth
          supabaseClient={supabase}
          appearance={{ theme: ThemeSupa }}
          providers={[]}
          theme="light"
          localization={{
            variables: {
              sign_in: {
                email_label: 'Endereço de e-mail',
                password_label: 'Sua senha',
                email_input_placeholder: 'seu@email.com',
                password_input_placeholder: 'Sua senha',
                button_label: 'Entrar',
                loading_button_label: 'Entrando...',
                social_provider_text: 'Entrar com {{provider}}',
                link_text: 'Já tem uma conta? Entre',
              },
              sign_up: {
                email_label: 'Endereço de e-mail',
                password_label: 'Crie uma senha',
                email_input_placeholder: 'seu@email.com',
                password_input_placeholder: 'Crie uma senha segura',
                button_label: 'Registrar',
                loading_button_label: 'Registrando...',
                social_provider_text: 'Registrar com {{provider}}',
                link_text: 'Não tem uma conta? Registre-se',
              },
              forgotten_password: {
                email_label: 'Endereço de e-mail',
                email_input_placeholder: 'seu@email.com',
                button_label: 'Enviar instruções',
                loading_button_label: 'Enviando...',
                link_text: 'Esqueceu sua senha?',
              },
            },
          }}
        />
        
        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h3 className="font-medium text-blue-800 mb-2">Usuários de Teste:</h3>
          <ul className="text-sm text-blue-700 space-y-1">
            <li><strong>admin@vhomeflathotel.com</strong> (senha: admin123) - Acesso total</li>
            <li><strong>editor@vhomeflathotel.com</strong> (senha: editor123) - Edição de conteúdo</li>
            <li><strong>viewer@vhomeflathotel.com</strong> (senha: viewer123) - Apenas visualização</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Login;