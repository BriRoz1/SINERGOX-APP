import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../store/auth/AuthContext';

const AuthCallbackPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { login } = useAuth();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const code         = params.get('code');
    const returnedState = params.get('state');
    const errorParam   = params.get('error');
    const errorDesc    = params.get('error_description');

    // 1. Error devuelto por Microsoft
    if (errorParam) {
      console.error('Entra ID error:', errorParam, errorDesc);
      setError(errorDesc ?? 'Error al autenticar con Microsoft.');
      return;
    }

    // 2. Validar state anti-CSRF
    const savedState = sessionStorage.getItem('oauth_state');
    if (!savedState || savedState !== returnedState) {
      setError('Estado de sesión inválido. Intenta iniciar sesión nuevamente.');
      return;
    }

    // 3. Validar que llegó el code
    if (!code) {
      setError('No se recibió código de autorización.');
      return;
    }

    // 4. Intercambiar code por token y redirigir
    login(code)
      .then(() => navigate('/', { replace: true }))
      .catch((err: Error) => {
        console.error('Login error:', err);
        setError(err.message ?? 'Error procesando la sesión. Intenta nuevamente.');
      });
  }, []);

  if (error) {
    return (
      <div style={{ padding: '2rem' }}>
        <p style={{ color: '#c0392b', marginBottom: '1rem' }}>{error}</p>
        <button onClick={() => navigate('/')}>Volver al inicio</button>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem', color: '#555' }}>
      Iniciando sesión con Microsoft…
    </div>
  );
};

export default AuthCallbackPage;