import React, { createContext, useContext, useEffect, useState } from 'react';
import { HiperFlowApi } from '../../features/support/services/HiperFlowApi';

interface User {
  id: string;
  email: string;
  role: 'cliente' | 'admin' | string;
  name?: string;
}

interface AuthContextValue {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const mockUsers: User[] = [
  {
    id: 'cliente',
    name: 'Cliente Demo',
    email: 'cliente@hipermaxi.com',
    role: 'cliente',
  },
  {
    id: 'admin',
    name: 'Administrador Demo',
    email: 'admin@hipermaxi.com',
    role: 'admin',
  },
];

const mockCredentials: Record<string, string> = {
  'cliente@hipermaxi.com': 'Cliente123*',
  'admin@hipermaxi.com': 'Admin123*',
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    // try to restore session from localStorage (token validated server-side)
    const raw = localStorage.getItem('session');
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        setUser(parsed.user ?? null);
        setToken(parsed.token ?? null);
      } catch {
        localStorage.removeItem('session');
      }
    }
  }, []);

  const saveSession = (u: User | null, t: string | null) => {
    setUser(u);
    setToken(t);
    if (u && t) {
      localStorage.setItem('session', JSON.stringify({ user: u, token: t }));
    } else {
      localStorage.removeItem('session');
    }
  };

  const login = async (email: string, password: string) => {
    const normalizedEmail = email.trim().toLowerCase();
    const mockMatch = mockUsers.find((user) => user.email === normalizedEmail);
    const isMockCredential = mockMatch && mockCredentials[normalizedEmail] === password;

    const handleMockLogin = () => {
      const u = mockMatch as User;
      const t = `${u.role}-demo-token`;
      saveSession(u, t);
      void HiperFlowApi.logInteraction({
        userId: u.id,
        userEmail: u.email,
        module: 'Auth',
        action: 'LOGIN_SUCCESS',
        description: `Demo ${u.role} login success for ${u.email}`,
        createdAt: new Date().toISOString(),
      } as any).catch(() => null);
      return true;
    };

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: normalizedEmail, password }),
      });

      if (!res.ok) {
        if (import.meta.env && import.meta.env.DEV && isMockCredential) {
          return handleMockLogin();
        }

        void HiperFlowApi.logInteraction({
          userId: normalizedEmail,
          userEmail: normalizedEmail,
          module: 'Auth',
          action: 'LOGIN_FAILED',
          description: `Login failed for ${normalizedEmail}`,
          createdAt: new Date().toISOString(),
        } as any).catch(() => null);

        return false;
      }

      const payload = await res.json();
      const u: User = payload.user;
      const t: string = payload.token;

      saveSession(u, t);

      void HiperFlowApi.logInteraction({
        userId: u.id,
        userEmail: u.email,
        module: 'Auth',
        action: 'LOGIN_SUCCESS',
        description: `Login success for ${u.email}`,
        createdAt: new Date().toISOString(),
      } as any).catch(() => null);

      return true;
    } catch (err) {
      if (import.meta.env && import.meta.env.DEV && isMockCredential) {
        return handleMockLogin();
      }
      console.warn('Auth login error', err);
      return false;
    }
  };

  const logout = () => {
    saveSession(null, null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

export default AuthContext;
