"use client";

import { createContext, useState, useEffect, useContext, ReactNode, useCallback } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabaseClient';

export interface UserPermissions {
  gallery: boolean;
  hero: boolean;
  about: boolean;
  rooms: boolean;
  prices: boolean;
  covers: boolean;
  logo: boolean;
  permissions: boolean;
}

interface Profile {
  id: string;
  role: 'admin' | 'editor' | 'viewer';
  permissions: UserPermissions;
}

const defaultPermissions: UserPermissions = {
  gallery: true,
  hero: true,
  about: true,
  rooms: true,
  prices: true,
  covers: true,
  logo: true,
  permissions: true,
};

interface AuthContextType {
  session: Session | null;
  profile: Profile | null;
  isLoading: boolean;
  isAdmin: boolean;
  isEditor: boolean;
  hasPermission: (tab: keyof UserPermissions) => boolean;
}

const AuthContext = createContext<AuthContextType>({
  session: null,
  profile: null,
  isLoading: true,
  isAdmin: false,
  isEditor: false,
  hasPermission: () => false,
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProfile = useCallback(async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, role, permissions')
        .eq('id', userId)
        .single();
      
      if (!error && data) {
        setProfile({
          ...data,
          permissions: data.permissions || defaultPermissions
        } as Profile);
      } else {
        // Auto-cria perfil como admin para permitir acesso imediato
        console.log('Perfil não encontrado, criando perfil padrão admin...');
        const { error: insertError } = await supabase
          .from('profiles')
          .insert({
            id: userId,
            role: 'admin',
            permissions: defaultPermissions,
            created_at: new Date().toISOString()
          });
        
        if (!insertError) {
          setProfile({
            id: userId,
            role: 'admin',
            permissions: defaultPermissions
          });
        } else {
          console.error('Erro ao criar perfil:', insertError);
          // Fallback: permite acesso mesmo sem perfil
          setProfile({
            id: userId,
            role: 'admin',
            permissions: defaultPermissions
          });
        }
      }
    } catch (error) {
      console.error('Erro ao buscar/criar perfil:', error);
      // Fallback para admin
      setProfile({
        id: userId,
        role: 'admin',
        permissions: defaultPermissions
      });
    }
  }, []);

  useEffect(() => {
    let mounted = true;

    const getInitialSession = async () => {
      try {
        setIsLoading(true);
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!mounted) return;
        setSession(session);
        
        if (session?.user) {
          await fetchProfile(session.user.id);
        } else {
          setProfile(null);
        }
      } catch (error) {
        console.error('Erro na inicialização da sessão:', error);
        if (!mounted) return;
        setSession(null);
        setProfile(null);
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    getInitialSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;

        console.log('Evento de autenticação:', event);
        
        if (event === 'SIGNED_OUT') {
          setSession(null);
          setProfile(null);
          setIsLoading(false);
        } else if (event === 'SIGNED_IN' || event === 'INITIAL_SESSION') {
          setSession(session);
          if (session?.user) {
            setIsLoading(true);
            await fetchProfile(session.user.id);
            if (mounted) setIsLoading(false);
          } else {
            setProfile(null);
            setIsLoading(false);
          }
        } else if (event === 'USER_UPDATED') {
          setSession(session);
          if (session?.user) {
            setIsLoading(true);
            await fetchProfile(session.user.id);
            if (mounted) setIsLoading(false);
          }
        } else {
          setSession(session);
          setIsLoading(false);
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [fetchProfile]);

  const hasPermission = (tab: keyof UserPermissions) => {
    if (profile?.role === 'admin') return true;
    return profile?.permissions?.[tab] || false;
  };

  const value = {
    session,
    profile,
    isLoading,
    isAdmin: profile?.role === 'admin',
    isEditor: profile?.role === 'admin' || profile?.role === 'editor',
    hasPermission,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
