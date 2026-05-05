import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import {
  exchangeCodeForToken,
  sendTokenToBackend,
  cleanDisplayName,
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
  permissions?:    string[];
};

type AuthContextType = {
  auth:        AuthState;
  login:       (code: string) => Promise<void>;
  logout:      () => void;
  hasPermission: (permission: string) => boolean;
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

  // Handler de errores 401
  const handleAuthError = useCallback((message: string) => {
    setAuthError(message);
    setAuth({ isAuthenticated: false });
    localStorage.removeItem(AUTH_STORAGE_KEY);
  }, []);

  useEffect(() => {
    registerAuthErrorHandler(handleAuthError);
    return () => unregisterAuthErrorHandler();
  }, [handleAuthError]);

  const login = async (code: string) => {
    // 1. Intercambiar code por token con Microsoft
    const token = await exchangeCodeForToken(code);

    // 2. Enviar access_token al backend — obtiene usuario y permisos
    //    Si el usuario no tiene roles (403), retorna permisos vacíos
    //    usando el id_token para extraer nombre y email
    const { user, permissions } = await sendTokenToBackend(
      token.access_token,
      token.id_token,
    );

    // 3. Limpiar sessionStorage del flujo OAuth
    sessionStorage.removeItem('oauth_state');
    sessionStorage.removeItem('oauth_code_verifier');

    // 4. Limpiar prefijo XM_E del nombre
    const cleanUser: UserProfile = {
      name:  cleanDisplayName(user.name),
      email: user.email,
    };

    setAuth({ isAuthenticated: true, token, user: cleanUser, permissions });
  };

  const logout = () => {
    setAuth({ isAuthenticated: false });
    localStorage.removeItem(AUTH_STORAGE_KEY);
  };

  // Utilidad para verificar permisos en cualquier componente
  const hasPermission = (permission: string): boolean =>
    auth.permissions?.includes(permission) ?? false;

  return (
    <AuthContext.Provider value={{ auth, login, logout, hasPermission }}>
      {children}
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