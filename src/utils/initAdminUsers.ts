import { supabase } from '@/lib/supabaseClient';

export async function initializeAdminUsers() {
  try {
    // Lista de usuários para inicializar
    const adminUsers = [
      {
        email: 'admin@vhomeflathotel.com',
        password: 'admin123', // Em produção, use senhas fortes
        role: 'admin' as const,
        metadata: { first_name: 'Administrador', last_name: 'Principal' }
      },
      {
        email: 'editor@vhomeflathotel.com',
        password: 'editor123', // Em produção, use senhas fortes
        role: 'editor' as const,
        metadata: { first_name: 'Editor', last_name: 'Conteúdo' }
      },
      {
        email: 'viewer@vhomeflathotel.com',
        password: 'viewer123', // Em produção, use senhas fortes
        role: 'viewer' as const,
        metadata: { first_name: 'Visualizador', last_name: 'Dados' }
      }
    ];

    for (const user of adminUsers) {
      // Verifica se o usuário já existe
      const { data: existingUser, error: checkError } = await supabase.auth.admin.getUserByEmail(user.email);
      
      if (checkError && checkError.code !== 'PGRST116') { // PGRST116 = usuário não encontrado
        console.error(`Erro ao verificar usuário ${user.email}:`, checkError);
        continue;
      }

      if (existingUser?.user) {
        console.log(`Usuário ${user.email} já existe. Atualizando perfil...`);
        
        // Atualiza o perfil com o novo role
        const { error: updateError } = await supabase
          .from('profiles')
          .update({ role: user.role })
          .eq('id', existingUser.user.id);
          
        if (updateError) {
          console.error(`Erro ao atualizar perfil de ${user.email}:`, updateError);
        } else {
          console.log(`Perfil de ${user.email} atualizado com sucesso!`);
        }
      } else {
        // Cria novo usuário
        console.log(`Criando novo usuário: ${user.email}...`);
        
        const { data, error } = await supabase.auth.admin.createUser({
          email: user.email,
          password: user.password,
          email_confirm: true,
          user_metadata: user.metadata
        });
        
        if (error) {
          console.error(`Erro ao criar usuário ${user.email}:`, error);
          continue;
        }
        
        // Cria o perfil com o role
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: data.user!.id,
            email: user.email,
            role: user.role,
            created_at: new Date().toISOString()
          });
          
        if (profileError) {
          console.error(`Erro ao criar perfil para ${user.email}:`, profileError);
        } else {
          console.log(`Usuário ${user.email} criado com sucesso!`);
        }
      }
    }
    
    console.log('Inicialização de usuários administradores concluída!');
    return true;
  } catch (error) {
    console.error('Erro durante a inicialização:', error);
    return false;
  }
}

// Função para verificar se o script já foi executado
export async function checkIfScriptExecuted() {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('role')
      .limit(1);
      
    if (error) {
      console.error('Erro ao verificar execução do script:', error);
      return false;
    }
    
    // Se existirem perfis, o script já foi executado
    return data && data.length > 0;
  } catch (error) {
    console.error('Erro durante verificação:', error);
    return false;
  }
}