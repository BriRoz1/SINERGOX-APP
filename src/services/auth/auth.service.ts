import { authConfig } from '../../core/config/auth.config';

export type TokenResponse = {
  access_token:   string;
  id_token:       string;
  refresh_token?: string;
  expires_in:     number;
  token_type:     string;
  scope:          string;
};

export type UserProfile = {
  name:  string;
  email: string;
};

export type BackendResponse = {
  user:        UserProfile;
  permissions: string[];
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

// ─── Limpiar prefijo XM_E del nombre ─────────────────────────

export function cleanDisplayName(rawName: string): string {
  return rawName.replace(/^[A-Z]+_[A-Z]?\s*/i, '').trim() || rawName;
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

// ─── Redirigir a Microsoft ────────────────────────────────────

export async function redirectToMicrosoft(): Promise<void> {
  const state         = crypto.randomUUID();
  const codeVerifier  = generateCodeVerifier();
  const codeChallenge = await generateCodeChallenge(codeVerifier);

  sessionStorage.setItem('oauth_state',         state);
  sessionStorage.setItem('oauth_code_verifier', codeVerifier);

  const params = new URLSearchParams({
    client_id:             authConfig.clientId,
    response_type:         'code',
    redirect_uri:          authConfig.redirectUri,
    scope:                 authConfig.scopes,
    state,
    response_mode:         'query',
    code_challenge:        codeChallenge,
    code_challenge_method: 'S256',
  });

  window.location.href = `${authConfig.ssoUrl}?${params.toString()}`;
}

// ─── Enviar access_token al backend .NET ─────────────────────

export async function sendTokenToBackend(accessToken: string, idToken?: string): Promise<BackendResponse> {
  const res = await fetch(
    'https://gr-sinergox-dev-01-ajcyauauhmd3etb2.eastus2-01.azurewebsites.net/api/Secure/permissions',
    {
      method:  'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type':  'application/json',
      },
    }
  );

  // 403 — usuario sin roles asignados o dominio inválido
  if (res.status === 403) {
    let name  = 'Usuario';
    let email = '';

    if (idToken) {
      try {
        const payload = JSON.parse(atob(idToken.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));
        name  = payload.name ?? payload.preferred_username ?? 'Usuario';
        email = payload.email ?? payload.upn ?? payload.preferred_username ?? '';
      } catch { /* usar defaults */ }
    }

    // Log del access token para diagnóstico
    console.log('🔑 Access Token:', accessToken);
    name = cleanDisplayName(name);

    // Validar dominio — solo se permite @xm.com.co
    const domain = email.split('@')[1]?.toLowerCase();
    if (domain !== 'xm.com.co') {
      throw new Error('ACCESO_DENEGADO');
    }

    // Usuario XM sin permisos asignados → bloquear acceso
    console.log('🔑 Access Token (usuario sin permisos):', accessToken);
    throw new Error('SIN_PERMISOS');
  }

  if (!res.ok) {
    const body = await res.text();
    console.error('Backend error:', res.status, res.statusText, body);
    throw new Error(`Error al autenticar con el backend (${res.status}): ${body}`);
  }

  return res.json() as Promise<BackendResponse>;
}