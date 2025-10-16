import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '@/lib/supabaseClient';
import Logo from '@/components/hotel/Logo';
import { showSuccess } from '@/utils/toast';

const UpdatePassword = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'USER_UPDATED') {
        showSuccess('Sua senha foi atualizada com sucesso!');
        navigate('/login');
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="mb-8">
        <Logo isScrolled={true} />
      </div>
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">Redefinir Senha</h2>
        <p className="text-center text-gray-500 mb-8">Crie uma nova senha para sua conta.</p>
        <Auth
          supabaseClient={supabase}
          appearance={{ theme: ThemeSupa }}
          view="update_password"
          theme="light"
          localization={{
            variables: {
              update_password: {
                password_label: 'Nova senha',
                password_input_placeholder: 'Sua nova senha',
                button_label: 'Salvar nova senha',
                loading_button_label: 'Salvando...',
              },
            },
          }}
        />
      </div>
    </div>
  );
};

export default UpdatePassword;