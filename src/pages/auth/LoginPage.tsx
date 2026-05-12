import { useAuth } from '../../store/auth/AuthContext';
import { generateCodeVerifier, generateCodeChallenge } from '../../services/auth/auth.service';
import { authConfig } from '../../core/config/auth.config';
import './LoginPage.css';

// ── Reemplaza estas rutas con las tuyas ──────────────────────
import xmLogo      from '../../assets/xm-orange.svg';
import backgroundImg from '../../assets/login-bg.png';      // imagen del paisaje
// ────────────────────────────────────────────────────────────

const LoginPage = () => {
  const { auth } = useAuth();

  const handleMicrosoftLogin = async () => {
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
  };

  // Si ya está autenticado redirigir al home
  if (auth.isAuthenticated) {
    window.location.replace('/');
    return null;
  }

  return (
    <div className="login-page">
      <div className="login-card">

        {/* Panel izquierdo — formulario */}
        <div className="login-panel">
        <div className="login-panel__inner">

          {/* Logo */}
          <div className="login-logo">
            <img src={xmLogo} alt="XM" />
          </div>

        

          {/* Título */}
          <h1 className="login-title">!Bienvenido!</h1>
          <p className="login-subtitle">
            Te invitamos a iniciar sesión a través de tu cuenta de usuario XM
          </p>

          {/* Botón Microsoft */}
          <button
            className="login-microsoft-btn"
            onClick={() => void handleMicrosoftLogin()}
          >
            <span className="login-microsoft-btn__icon">
              {/* Ícono de Microsoft */}
              <svg width="20" height="20" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="1"  y="1"  width="9" height="9" fill="#F25022"/>
                <rect x="11" y="1"  width="9" height="9" fill="#7FBA00"/>
                <rect x="1"  y="11" width="9" height="9" fill="#00A4EF"/>
                <rect x="11" y="11" width="9" height="9" fill="#FFB900"/>
              </svg>
            </span>
            Ingresar con directorio activo XM
          </button>

          {/* Footer del panel */}
          <p className="login-footer">
            ¿Tienes problemas para acceder?{' '}
            <a href="mailto:soporte@xm.com.co">Contacta soporte</a>
          </p>

        </div>
      </div>

        {/* Panel derecho — imagen */}
        <div
          className="login-image"
          style={{ backgroundImage: `url(${backgroundImg})` }}
          aria-hidden="true"
        />

      </div>
    </div>
  );
};

export default LoginPage;