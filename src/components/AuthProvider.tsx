import { createContext, useState, useEffect, useContext, ReactNode } from 'react';
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

interface AuthContextType {
  session: Session | null;
  profile: Profile | null;
  isLoading: boolean;
  isAdmin: boolean;
  isEditor: boolean;
  hasPermission: (tab: keyof UserPermissions) => boolean;
}

const defaultPermissions: UserPermissions = {
  gallery: true,
  hero: true,
  about: true,
  rooms: false,
  prices: false,
  covers: false,
  logo: false,
  permissions: false,
};

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

  const fetchProfile = async (userId: string) => {
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
      setProfile(null);
    }
  };

  useEffect(() => {
    let mounted = true;

    const getInitialSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!mounted) return;
        setSession(session);
        if (session?.user) {
          await fetchProfile(session.user.id);
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
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

        if (event === 'SIGNED_OUT') {
          setSession(null);
          setProfile(null);
          setIsLoading(false);
        } else {
          setSession(session);
          if (session?.user) {
            await fetchProfile(session.user.id);
          } else {
            setProfile(null);
          }
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

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