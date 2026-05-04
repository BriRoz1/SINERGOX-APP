import { authConfig } from '../../core/config/auth.config';

export type TokenResponse = {
  access_token: string;
  id_token:     string;
  refresh_token?: string;
  expires_in:   number;
  token_type:   string;
  scope:        string;
};

export type UserProfile = {
  name:  string;
  email: string;
  oid:   string;  // ID único del usuario en Azure AD
};

// ─── PKCE ────────────────────────────────────────────────────

export function generateCodeVerifier(): string {
  const array = new Uint8Array(64);
  crypto.getRandomValues(array);
  return btoa(String.fromCharCode(...array))
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

export async function generateCodeChallenge(verifier: string): Promise<string> {
  const data   = new TextEncoder().encode(verifier);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return btoa(String.fromCharCode(...new Uint8Array(digest)))
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

// ─── Decodificar id_token (JWT) ───────────────────────────────
// El id_token es un JWT firmado por Microsoft. No necesitamos
// verificar la firma aquí (el backend lo hace). Solo leemos el
// payload para mostrar datos del usuario en la UI.

export function parseIdToken(idToken: string): UserProfile {
  try {
    const payload = idToken.split('.')[1];
    const json    = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
    const claims  = JSON.parse(json);

    // El nombre viene como "XM_E ANDRES FELIPE ROZO BRIJALDO"
    // Limpiamos el prefijo tipo "XM_E " o "XM_" al inicio
    const rawName = claims.name ?? claims.preferred_username ?? 'Usuario';
    const cleanName = rawName.replace(/^[A-Z]+_[A-Z]?\s*/i, '').trim() || rawName;

    return {
      name:  cleanName,
      email: claims.email ?? claims.upn ?? claims.preferred_username ?? '',
      oid:   claims.oid   ?? '',
    };
  } catch {
    throw new Error('No se pudo leer el id_token de Microsoft');
  }
}

// ─── Intercambiar code por token ─────────────────────────────

export async function exchangeCodeForToken(code: string): Promise<TokenResponse> {
  const codeVerifier = sessionStorage.getItem('oauth_code_verifier');
  if (!codeVerifier) throw new Error('code_verifier no encontrado. Inicia sesión nuevamente.');

  const body = new URLSearchParams({
    client_id:     authConfig.clientId,
    grant_type:    'authorization_code',
    code,
    redirect_uri:  authConfig.redirectUri,
    scope:         authConfig.scopes,
    code_verifier: codeVerifier,
  });

  const res = await fetch(authConfig.tokenUrl, {
    method:  'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body:    body.toString(),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error_description ?? 'Error al obtener token de Microsoft');
  }

  return res.json();
}

// ─── TODO: enviar access_token al backend .NET ───────────────
// export async function sendTokenToBackend(accessToken: string) {
//   const res = await fetch('/api/auth/login', {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify({ accessToken }),
//   });
//   if (!res.ok) throw new Error('Error al autenticar con el backend');
//   return res.json(); // { name, email, roles, ... }
// }