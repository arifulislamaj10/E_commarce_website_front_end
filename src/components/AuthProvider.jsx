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

  async function loginWithGoogle(credential) {
    const data = await api('/auth/google', { method: 'POST', body: { credential }, auth: false });
    tokenStore.set(data.accessToken);
    setUser(data.user);
    return data.user;
  }

  // Password reset
  const forgotPassword = (email) =>
    api('/auth/forgot-password', { method: 'POST', body: { email }, auth: false });

  async function resetPassword(email, code, password) {
    const data = await api('/auth/reset-password', { method: 'POST', body: { email, code, password }, auth: false });
    tokenStore.set(data.accessToken);
    setUser(data.user);
    return data.user;
  }

  // Email verification (requires the user to be logged in)
  const resendVerification = () => api('/auth/send-verification', { method: 'POST' });

  async function verifyEmail(code) {
    const data = await api('/auth/verify-email', { method: 'POST', body: { code } });
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
    <AuthContext.Provider
      value={{
        user, loading, login, register, logout, refreshUser,
        loginWithGoogle, forgotPassword, resetPassword, resendVerification, verifyEmail,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
