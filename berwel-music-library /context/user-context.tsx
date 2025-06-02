'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabaseClient'; // Use the createClient function

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
    const supabase = createClient(); // Create client inside useEffect

    // Listen for auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => { // Made the listener async
        console.log('UserProvider - onAuthStateChange event:', event); // Log event
        console.log('UserProvider - onAuthStateChange session:', session); // Log session

        if (event === 'SIGNED_IN') {
          // Explicitly get user after sign in event
          const { data: { user }, error } = await supabase.auth.getUser();
          if (error) {
            console.error('UserProvider - Error getting user after sign in:', error.message);
            setUser(null);
            setSession(null);
          } else {
            console.log('UserProvider - User obtained after sign in:', user);
            setUser(user);
            setSession(session);
          }
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          setSession(null);
        } else {
           setSession(session);
           setUser(session?.user || null);
        }

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

  // Add logging for state changes
  useEffect(() => {
    console.log('UserProvider State Change - user:', user);
    console.log('UserProvider State Change - isLoading:', isLoading);
  }, [user, isLoading]);

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