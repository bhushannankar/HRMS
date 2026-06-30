import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { LoginResponse } from '../api/client';

interface AuthContextType {
  user: LoginResponse | null;
  login: (user: LoginResponse) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<LoginResponse | null>(() => {
    const stored = localStorage.getItem('hrms_user');
    return stored ? JSON.parse(stored) : null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('hrms_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('hrms_user');
      localStorage.removeItem('hrms_token');
    }
  }, [user]);

  const login = (data: LoginResponse) => {
    localStorage.setItem('hrms_token', data.token);
    setUser(data);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('hrms_token');
    localStorage.removeItem('hrms_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
