import { useNavigate } from 'react-router-dom';
import './AccessDeniedPage.css';

const AccessDeniedPage = () => {
  const navigate = useNavigate();

  return (
    <div className="access-denied">
      <div className="access-denied__card">

        <div className="access-denied__icon">🔒</div>

        <h1 className="access-denied__title">Acceso no autorizado</h1>

        <p className="access-denied__message">
          Tu cuenta no pertenece al dominio autorizado para acceder a este portal.
        </p>

        <p className="access-denied__hint">
          Solo los usuarios con correo <strong>@xm.com.co</strong> pueden ingresar a Sinergox.
        </p>

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