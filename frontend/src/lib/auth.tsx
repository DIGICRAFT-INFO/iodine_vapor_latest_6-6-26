'use client';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authApi } from './api';
import Cookies from 'js-cookie';

interface User { id: string; name: string; email: string; role: 'admin' | 'superadmin'; avatar?: string; }
interface AuthCtx { user: User | null; loading: boolean; login: (e: string, p: string) => Promise<void>; logout: () => void; isSuper: boolean; }

const Ctx = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser]       = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = Cookies.get('iv_token') || localStorage.getItem('iv_token');
    if (token) authApi.me().then(setUser).catch(() => { Cookies.remove('iv_token'); localStorage.removeItem('iv_token'); }).finally(() => setLoading(false));
    else setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const data = await authApi.login({ email, password });
    Cookies.set('iv_token', data.token, { expires: 7 });
    localStorage.setItem('iv_token', data.token);
    setUser(data.user);
  };

  const logout = () => {
    Cookies.remove('iv_token'); localStorage.removeItem('iv_token'); setUser(null);
  };

  return <Ctx.Provider value={{ user, loading, login, logout, isSuper: user?.role === 'superadmin' }}>{children}</Ctx.Provider>;
}

export const useAuth = () => { const c = useContext(Ctx); if (!c) throw new Error('useAuth outside AuthProvider'); return c; };
