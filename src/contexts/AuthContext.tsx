'use client';

import type React from 'react';
import { createContext, useContext, useState, useEffect } from 'react';
import type { AuthState } from '@/lib/types';
import { validateAdmin } from '@/lib/storage';

interface AuthContextType {
  authState: AuthState;
  login: (username: string, password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    username: null
  });

  useEffect(() => {
    // Check if user is already logged in (from localStorage)
    const savedAuth = localStorage.getItem('auth');
    if (savedAuth) {
      const parsedAuth = JSON.parse(savedAuth);
      setAuthState(parsedAuth);
    }
  }, []);

  const login = (username: string, password: string): boolean => {
    if (validateAdmin(username, password)) {
      const newAuthState = {
        isAuthenticated: true,
        username
      };
      setAuthState(newAuthState);
      localStorage.setItem('auth', JSON.stringify(newAuthState));
      return true;
    }
    return false;
  };

  const logout = () => {
    const newAuthState = {
      isAuthenticated: false,
      username: null
    };
    setAuthState(newAuthState);
    localStorage.removeItem('auth');
  };

  return (
    <AuthContext.Provider value={{ authState, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
