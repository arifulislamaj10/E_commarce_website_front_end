'use client';

import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { api, tokenStore } from '@/lib/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    if (!tokenStore.get()) {
      setUser(null);
      return null;
    }
    try {
      const me = await api('/auth/me');
      setUser(me);
      return me;
    } catch {
      tokenStore.clear();
      setUser(null);
      return null;
    }
  }, []);

  useEffect(() => {
    refreshUser().finally(() => setLoading(false));
  }, [refreshUser]);

  async function login(email, password) {
    const data = await api('/auth/login', { method: 'POST', body: { email, password }, auth: false });
    tokenStore.set(data.accessToken);
    setUser(data.user);
    return data.user;
  }

  async function register(payload) {
    const data = await api('/auth/register', { method: 'POST', body: payload, auth: false });
    tokenStore.set(data.accessToken);
    setUser(data.user);
    return data.user;
  }

  async function logout() {
    try {
      await api('/auth/logout', { method: 'POST' });
    } catch {
      /* ignore */
    }
    tokenStore.clear();
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
