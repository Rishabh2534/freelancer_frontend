import React, { createContext, useContext, useEffect, useState } from 'react';
import { api } from '@/services/api';

type User = {
  id: string;
  email: string;
  role: string;
  createdAt: string;
  profile?: any;
};

type AuthContextType = {
  session: { token: string; user: User } | null;
  user: User | null;
  profile: any | null;
  isLoading: boolean;
  signOut: () => Promise<void>;
  /** Call after login/register to sync auth state without full page reload */
  refreshUser: () => Promise<boolean>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<{ token: string; user: User } | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshUser = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      if (token) {
        const { user: currentUser } = await api.getCurrentUser();
        setUser(currentUser);
        setProfile(currentUser.profile);
        setSession({ token, user: currentUser });
        return true;
      }
    } catch (error) {
      // Token is invalid, clear it
      localStorage.removeItem('auth_token');
      api.setToken(null);
      setSession(null);
      setUser(null);
      setProfile(null);
    }
    return false;
  };

  useEffect(() => {
    // Check if user is already logged in
    const checkAuth = async () => {
      await refreshUser();
      setIsLoading(false);
    };

    checkAuth();

    // Listen for storage changes (login from another tab)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'auth_token') {
        refreshUser();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Fetch user profile when user changes
  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) {
        setProfile(null);
        return;
      }

      try {
        if (user.profile) {
          setProfile(user.profile);
        } else {
          // Fetch full profile
          const { profile: userProfile } = await api.getMyProfile();
          setProfile(userProfile);
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    fetchProfile();
  }, [user]);

  const signOut = async () => {
    try {
      await api.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setSession(null);
      setUser(null);
      setProfile(null);
    }
  };

  const value = {
    session,
    user,
    profile,
    isLoading,
    signOut,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}