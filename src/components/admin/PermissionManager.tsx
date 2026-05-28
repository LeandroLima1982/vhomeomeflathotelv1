"use client";

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { ShieldCheck, UserCog, AlertTriangle } from 'lucide-react';
import { showSuccess, showError } from '@/utils/toast';

interface UserProfile {
  id: string;
  email: string;
  role: 'admin' | 'editor' | 'viewer';
  created_at: string;
}

interface PermissionLevel {
  value: 'admin' | 'editor' | 'viewer';
  label: string;
  description: string;
  color: string;
  icon: React.ReactNode;
}

const permissionLevels: PermissionLevel[] = [
  {
    value: 'admin',
    label: 'Administrador',
    description: 'Acesso total ao painel administrativo',
    color: 'bg-red-100 text-red-800',
    icon: <ShieldCheck className="h-4 w-4" />
  },
  {
    value: 'editor',
    label: 'Editor',
    description: 'Pode editar conteúdo e gerenciar quartos',
    color: 'bg-blue-100 text-blue-800',
    icon: <UserCog className="h-4 w-4" />
  },
  {
    value: 'viewer',
    label: 'Visualizador',
    description: 'Apenas visualização do painel',
    color: 'bg-gray-100 text-gray-800',
    icon: <AlertTriangle className="h-4 w-4" />
  }
];

export default function PermissionManager() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      showError('Erro ao carregar usuários.');
      console.error(error);
    } else {
      setUsers(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const updateRole = async (userId: string, newRole: string) => {
    setUpdating(userId);
    
    const { error } = await supabase
      .from('profiles')
      .update({ role: newRole })
      .eq('id', userId);

    if (error) {
      showError('Erro ao atualizar permissão.');
      console.error(error);
    } else {
      showSuccess('Permissão atualizada com sucesso!');
      fetchUsers();
    }
    
    setUpdating(null);
  };

  const getPermissionLevel = (role: string) => {
    return permissionLevels.find(level => level.value === role) || permissionLevels[2];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShieldCheck className="h-5 w-5" />
          Gerenciador de Permissões
        </CardTitle>
        <CardDescription>
          Defina os níveis de acesso para cada usuário no painel administrativo.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-4 border-gray-300 border-t-blue-600"></div>
            </div>
          ) : users.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <UserCog className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>Nenhum usuário encontrado no sistema.</p>
              <p className="text-sm">Usuários precisam fazer login pelo sistema para aparecerem aqui.</p>
            </div>
          ) : (
            users.map((user) => {
              const permission = getPermissionLevel(user.role);
              return (
                <div key={user.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border rounded-lg bg-gray-50 gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                        <span className="font-semibold text-gray-700">
                          {user.email.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-800">{user.email}</h3>
                        <p className="text-xs text-gray-500">ID: {user.id}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={permission.color}>
                        {permission.icon}
                        <span className="ml-1">{permission.label}</span>
                      </Badge>
                      <span className="text-xs text-gray-500">
                        Criado em: {formatDate(user.created_at)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full sm:w-auto">
                    <div className="text-xs text-gray-600 mb-2 sm:mb-0">
                      {permission.description}
                    </div>
                    <Select 
                      value={user.role} 
                      onValueChange={(value) => updateRole(user.id, value)}
                      disabled={updating === user.id}
                    >
                      <SelectTrigger className="w-full sm:w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {permissionLevels.map((level) => (
                          <SelectItem key={level.value} value={level.value}>
                            <div className="flex items-center gap-2">
                              {level.icon}
                              <span>{level.label}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {updating === user.id && (
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-gray-300 border-t-blue-600"></div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h4 className="font-medium text-blue-800 mb-2">Níveis de Acesso:</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {permissionLevels.map((level) => (
              <div key={level.value} className="flex items-start gap-2">
                <div className={`w-3 h-3 rounded-full mt-1.5 ${level.color.replace('bg-', 'bg-').replace('text-', '')}`}></div>
                <div>
                  <div className="font-medium text-sm">{level.label}</div>
                  <div className="text-xs text-gray-600">{level.description}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}