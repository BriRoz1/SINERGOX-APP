import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import {
  exchangeCodeForToken,
  parseIdToken,
  type TokenResponse,
  type UserProfile,
} from '../../services/auth/auth.service';
import {
  registerAuthErrorHandler,
  unregisterAuthErrorHandler,
} from '../../services/http/httpClient';
import AuthErrorToast from '../../components/auth/AuthErrorToast';

type AuthState = {
  isAuthenticated: boolean;
  token?:          TokenResponse;
  user?:           UserProfile;
};

type AuthContextType = {
  auth:   AuthState;
  login:  (code: string) => Promise<void>;
  logout: () => void;
};

const AuthContext      = createContext<AuthContextType | undefined>(undefined);
const AUTH_STORAGE_KEY = 'auth_state';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [auth, setAuth]           = useState<AuthState>({ isAuthenticated: false });
  const [authError, setAuthError] = useState<string | null>(null);

  // Restaurar sesión al cargar
  useEffect(() => {
    const stored = localStorage.getItem(AUTH_STORAGE_KEY);
    if (stored) {
      try { setAuth(JSON.parse(stored)); }
      catch { localStorage.removeItem(AUTH_STORAGE_KEY); }
    }
  }, []);

  // Persistir sesión al cambiar
  useEffect(() => {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(auth));
  }, [auth]);

  // Registrar handler de errores 401 para httpClient
  const handleAuthError = useCallback((message: string) => {
    setAuthError(message);
    // Limpiar sesión al recibir 401
    setAuth({ isAuthenticated: false });
    localStorage.removeItem(AUTH_STORAGE_KEY);
  }, []);

  useEffect(() => {
    registerAuthErrorHandler(handleAuthError);
    return () => unregisterAuthErrorHandler();
  }, [handleAuthError]);

  const login = async (code: string) => {
    const token = await exchangeCodeForToken(code);
    const user  = parseIdToken(token.id_token);

    sessionStorage.removeItem('oauth_state');
    sessionStorage.removeItem('oauth_code_verifier');

    console.group('✅ Usuario autenticado');
    console.log('Nombre:', user.name);
    console.log('Email:',  user.email);
    console.log('OID:',    user.oid);
    const claims = JSON.parse(atob(token.id_token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));
    console.log('Claims completos:', claims);
    console.groupEnd();

    setAuth({ isAuthenticated: true, token, user });
  };

  const logout = () => {
    setAuth({ isAuthenticated: false });
    localStorage.removeItem(AUTH_STORAGE_KEY);
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {children}

      {/* Toast de error 401 — se muestra sobre cualquier contenido */}
      {authError && (
        <AuthErrorToast
          message={authError}
          onClose={() => setAuthError(null)}
        />
      )}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};