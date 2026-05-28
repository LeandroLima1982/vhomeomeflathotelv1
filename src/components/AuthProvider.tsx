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
  gallery: true, hero: true, about: true, rooms: true,
  prices: true, covers: true, logo: true, permissions: true,
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
  session: null, profile: null, isLoading: true,
  isAdmin: false, isEditor: false, hasPermission: () => false,
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProfile = useCallback(async (userId: string) => {
    const { data } = await supabase
      .from('profiles')
      .select('id, role, permissions')
      .eq('id', userId)
      .single();

    if (data) {
      setProfile({
        ...data,
        permissions: data.permissions || defaultPermissions
      } as Profile);
    } else {
      // fallback admin
      setProfile({ id: userId, role: 'admin', permissions: defaultPermissions });
    }
  }, []);

  const hasPermission = (tab: keyof UserPermissions) => {
    if (profile?.role === 'admin') return true;
    return profile?.permissions?.[tab] === true;
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setSession(null);
    setProfile(null);
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      if (data.session) fetchProfile(data.session.user.id);
      setIsLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, newSession) => {
      if (event === 'SIGNED_OUT') {
        setSession(null); setProfile(null); setIsLoading(false);
      } else if (newSession) {
        setSession(newSession);
        fetchProfile(newSession.user.id);
        setIsLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, [fetchProfile]);

  return (
    <AuthContext.Provider value={{
      session, profile, isLoading,
      isAdmin: profile?.role === 'admin',
      isEditor: profile?.role === 'admin' || profile?.role === 'editor',
      hasPermission
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
