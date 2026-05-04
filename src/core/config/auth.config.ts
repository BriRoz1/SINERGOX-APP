export const authConfig = {
  clientId:    import.meta.env.VITE_SSO_CLIENT_ID   as string,
  tenantId:    import.meta.env.VITE_SSO_TENANT_ID   as string,
  redirectUri: import.meta.env.VITE_SSO_REDIRECT_URI as string,

  get ssoUrl() {
    return `https://login.microsoftonline.com/${this.tenantId}/oauth2/v2.0/authorize`;
  },
  get tokenUrl() {
    return `https://login.microsoftonline.com/${this.tenantId}/oauth2/v2.0/token`;
  },

  // openid + profile + email → datos básicos del usuario en el id_token
  // api://.../.../access_as_user → permiso para llamar al backend .NET
  // NO incluir User.Read aquí — ese es para Graph, no para el backend
  scopes: [
    'openid',
    'profile',
    'email',
    'api://512fb124-c618-4c50-ada9-89d19ca8a8e6/access_as_user',
  ].join(' '),
};