import { useEffect, useState } from 'react';
import './AuthErrorToast.css';

type Props = {
  message: string;
  onClose: () => void;
  duration?: number; // ms antes de cerrarse solo (default 5000)
};

const AuthErrorToast = ({ message, onClose, duration = 5000 }: Props) => {
  const [hiding, setHiding] = useState(false);

  const close = () => {
    setHiding(true);
    setTimeout(onClose, 280); // esperar animación de salida
  };

  // Cerrar automáticamente después de `duration` ms
  useEffect(() => {
    const timer = setTimeout(close, duration);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`auth-error-toast${hiding ? ' auth-error-toast--hiding' : ''}`} role="alert">
      <span className="auth-error-toast__icon">⚠️</span>

      <div className="auth-error-toast__body">
        <div className="auth-error-toast__title">Sesión no válida</div>
        <div className="auth-error-toast__message">{message}</div>
      </div>

      <button
        className="auth-error-toast__close"
        onClick={close}
        aria-label="Cerrar"
      >
        ✕
      </button>

      <div className="auth-error-toast__progress" />
    </div>
  );
};

export default AuthErrorToast;