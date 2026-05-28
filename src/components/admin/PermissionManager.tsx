"use client";

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { ShieldCheck, UserCog, Layout, Save, Loader2 } from 'lucide-react';
import { showSuccess, showError, showLoading, dismissToast } from '@/utils/toast';
import { UserPermissions } from '../AuthProvider';

interface UserProfile {
  id: string;
  email: string;
  role: 'admin' | 'editor' | 'viewer';
  permissions: UserPermissions;
}

const TABS_CONFIG = [
  { id: 'gallery', label: 'Galeria' },
  { id: 'hero', label: 'Banner (Hero)' },
  { id: 'about', label: 'Sobre' },
  { id: 'rooms', label: 'Quartos' },
  { id: 'prices', label: 'Preços' },
  { id: 'covers', label: 'Capas' },
  { id: 'logo', label: 'Logo' },
  { id: 'permissions', label: 'Permissões' },
];

export default function PermissionManager() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);

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

  const handlePermissionChange = (userId: string, tabId: string, checked: boolean) => {
    setUsers(prev => prev.map(user => {
      if (user.id === userId) {
        return {
          ...user,
          permissions: {
            ...user.permissions,
            [tabId]: checked
          }
        };
      }
      return user;
    }));
  };

  const handleRoleChange = (userId: string, role: 'admin' | 'editor' | 'viewer') => {
    setUsers(prev => prev.map(user => {
      if (user.id === userId) {
        return { ...user, role };
      }
      return user;
    }));
  };

  const saveUserPermissions = async (user: UserProfile) => {
    setSavingId(user.id);
    const toastId = showLoading(`Salvando permissões de ${user.email}...`);

    const { error } = await supabase
      .from('profiles')
      .update({
        role: user.role,
        permissions: user.permissions
      })
      .eq('id', user.id);

    dismissToast(toastId);
    setSavingId(null);

    if (error) {
      showError(`Erro ao salvar: ${error.message}`);
    } else {
      showSuccess('Permissões atualizadas com sucesso!');
    }
  };

  if (loading) return <div className="flex justify-center p-10"><Loader2 className="animate-spin" /></div>;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShieldCheck className="h-5 w-5" /> Controle de Acesso Master
        </CardTitle>
        <CardDescription>Defina o nível de acesso e quais abas cada usuário pode gerenciar.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {users.map((user) => (
            <div key={user.id} className="p-4 border rounded-lg bg-gray-50 space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <p className="font-bold text-gray-800">{user.email}</p>
                  <p className="text-xs text-gray-500">ID: {user.id}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Select 
                    value={user.role} 
                    onValueChange={(value: any) => handleRoleChange(user.id, value)}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="editor">Editor</SelectItem>
                      <SelectItem value="viewer">Viewer</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button 
                    size="sm" 
                    onClick={() => saveUserPermissions(user)}
                    disabled={savingId === user.id}
                  >
                    {savingId === user.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                    Salvar
                  </Button>
                </div>
              </div>

              {user.role !== 'admin' && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2 border-t">
                  {TABS_CONFIG.map((tab) => (
                    <div key={tab.id} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`perm-${user.id}-${tab.id}`}
                        checked={user.permissions?.[tab.id as keyof UserPermissions] || false}
                        onCheckedChange={(checked) => handlePermissionChange(user.id, tab.id, !!checked)}
                      />
                      <Label 
                        htmlFor={`perm-${user.id}-${tab.id}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {tab.label}
                      </Label>
                    </div>
                  ))}
                </div>
              )}
              
              {user.role === 'admin' && (
                <div className="pt-2 border-t">
                  <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                    Administradores têm acesso total a todas as abas.
                  </Badge>
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}