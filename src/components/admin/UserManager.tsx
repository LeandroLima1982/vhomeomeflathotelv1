"use client";

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, ShieldCheck, UserCog } from 'lucide-react';
import { showSuccess, showError } from '@/utils/toast';

interface UserProfile {
  id: string;
  email: string;
  role: 'admin' | 'editor' | 'viewer';
}

export default function UserManager() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('email');

    if (error) {
      showError('Erro ao carregar usuários.');
    } else {
      setUsers(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const updateRole = async (userId: string, newRole: string) => {
    const { error } = await supabase
      .from('profiles')
      .update({ role: newRole })
      .eq('id', userId);

    if (error) {
      showError('Erro ao atualizar permissão.');
    } else {
      showSuccess('Permissão atualizada com sucesso!');
      fetchUsers();
    }
  };

  if (loading) return <div className="flex justify-center p-10"><Loader2 className="animate-spin" /></div>;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserCog className="h-5 w-5" /> Gerenciar Permissões
        </CardTitle>
        <CardDescription>Defina quem pode editar conteúdos ou apenas visualizar o painel.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {users.map((user) => (
            <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg bg-gray-50">
              <div>
                <p className="font-medium text-gray-800">{user.email}</p>
                <p className="text-xs text-gray-500">ID: {user.id}</p>
              </div>
              <div className="flex items-center gap-3">
                <Select 
                  defaultValue={user.role} 
                  onValueChange={(value) => updateRole(user.id, value)}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="editor">Editor</SelectItem>
                    <SelectItem value="viewer">Visualizador</SelectItem>
                  </SelectContent>
                </Select>
                {user.role === 'admin' && <ShieldCheck className="h-5 w-5 text-blue-600" />}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}