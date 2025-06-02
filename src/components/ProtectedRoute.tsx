'use client';

import { useAuth } from '@/contexts/AuthContext';
import { LoginForm } from './LoginForm';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { authState } = useAuth();

  if (!authState.isAuthenticated) {
    return <LoginForm />;
  }

  return <>{children}</>;
};
