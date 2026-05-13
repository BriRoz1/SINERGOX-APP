import { useNavigate, useSearchParams } from 'react-router-dom';
import './AccessDeniedPage.css';

const MESSAGES = {
  domain: {
    icon: '🔒',
    title: 'Acceso no autorizado',
    message: 'Tu cuenta no pertenece al dominio autorizado para acceder a este portal.',
    hint: 'Solo los usuarios con correo @xm.com.co pueden ingresar a Sinergox.',
  },
  permissions: {
    icon: '🚫',
    title: 'Sin permisos asignados',
    message: 'Tu cuenta no cuenta con los permisos necesarios para acceder a este portal.',
    hint: 'Contacta al administrador del sistema para solicitar acceso.',
  },
};

const AccessDeniedPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const reason = searchParams.get('reason') === 'permissions' ? 'permissions' : 'domain';
  const { icon, title, message, hint } = MESSAGES[reason];

  return (
    <div className="access-denied">
      <div className="access-denied__card">
        <div className="access-denied__icon">{icon}</div>
        <h1 className="access-denied__title">{title}</h1>
        <p className="access-denied__message">{message}</p>
        <p className="access-denied__hint">{hint}</p>
        <button
          className="access-denied__btn"
          onClick={() => navigate('/login')}
        >
          Volver al inicio de sesión
        </button>
      </div>
    </div>
  );
};

export default AccessDeniedPage;