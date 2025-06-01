'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import supabase from '@/lib/supabaseClient'; // Supabase client from @supabase/ssr createBrowserClient

interface UserContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Listen for auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('UserProvider - onAuthStateChange event:', event); // Log event
        console.log('UserProvider - onAuthStateChange session:', session); // Log session
        setSession(session);
        setUser(session?.user || null);
        setIsLoading(false);
      }
    );

    // Get initial session on mount
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        console.error('UserProvider - Error getting initial session:', error.message);
      } else {
        console.log('UserProvider - Initial session obtained on mount:', session);
        setSession(session);
        setUser(session?.user || null);
      }
      setIsLoading(false);
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []); // Empty dependency array to run only on mount

  return (
    <UserContext.Provider value={{ user, session, isLoading }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}; 