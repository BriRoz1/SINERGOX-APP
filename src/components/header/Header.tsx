import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import logoColorXm from '../../assets/logo-color-xm.svg';
import sinergoxlogo from '../../assets/sinergox-logo.svg';
import arrowDownOrange from '../../assets/arrow-down-orange.svg';
import { useAuth } from '../../store/auth/AuthContext';
import './Header.css';

const Header = () => {
  const { auth, logout } = useAuth();
  const navigate = useNavigate();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [dropdownTop, setDropdownTop] = useState<number>(0);
  const [isNarrow, setIsNarrow] = useState<boolean>(window.innerWidth <= 1024);
  const herramientasRef = useRef<HTMLLIElement>(null);

  // El botón del header redirige a la página de login
  const handleLogin = () => navigate('/login');

  const toggleDropdown = (name: string) => {
    if (openDropdown !== name) {
      const narrow = window.innerWidth <= 1024;
      setIsNarrow(narrow);
      if (narrow && herramientasRef.current) {
        const rect = herramientasRef.current.getBoundingClientRect();
        setDropdownTop(rect.bottom + 8);
      }
      setOpenDropdown(name);
    } else {
      setOpenDropdown(null);
    }
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (herramientasRef.current && !herramientasRef.current.contains(e.target as Node)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      const narrow = window.innerWidth <= 1024;
      setIsNarrow(narrow);
      if (openDropdown && narrow && herramientasRef.current) {
        const rect = herramientasRef.current.getBoundingClientRect();
        setDropdownTop(rect.bottom + 8);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [openDropdown]);

  // Nombre limpio del usuario
  const displayName = auth.user?.name ?? 'Mi cuenta';

  const LoginButton = () => (
    <button
      className="login-btn"
      onClick={() => auth.isAuthenticated ? logout() : handleLogin()}
    >
      {auth.isAuthenticated ? `👤 ${displayName}` : 'Inicio de sesión'}
    </button>
  );

  return (
    <header className="header">
      <div className="portal-brand">

        {/* FILA 1 (siempre): logos a la izquierda, login a la derecha */}
        <div className="header-row-top">
          <div className="header-logos">
            <div className="main-logo">
              <a href="https://www.xm.com.co/" target="_blank" rel="noreferrer">
                <img src={logoColorXm} alt="XM" title="XM" />
              </a>
            </div>
            <div className="portal-name">
              <a href="/">
                <img src={sinergoxlogo} alt="Sinergox" title="Sinergox" />
              </a>
            </div>
          </div>

          {/* Visible solo en móvil/tablet */}
          <div className="box-login box-login--inline">
            <LoginButton />
          </div>
        </div>

        {/* FILA 2: nav (en desktop va inline con los logos via CSS) */}
        <nav className="top-nav_menu">
          <ul className="top-nav_menu_links">

            {/* Herramientas */}
            <li
              ref={herramientasRef}
              className={`has-submenu${openDropdown === 'herramientas' ? ' dropdown-open' : ''}`}
            >
              <span
                className="nav-item"
                onClick={() => toggleDropdown('herramientas')}
                role="button"
                tabIndex={0}
                onKeyDown={e => e.key === 'Enter' && toggleDropdown('herramientas')}
              >
                Herramientas
                <img src={arrowDownOrange} alt="" className="top-nav_menu_links_icon" aria-hidden="true" />
              </span>

              <div
                className="top-nav_menu_subitem"
                style={openDropdown === 'herramientas' && isNarrow ? { top: dropdownTop } : undefined}
              >
                  <div className="top-nav_menu_subitem_main top-nav_menu_subitem_main--left">
                  <span>Referencias</span>
                  <ul>
                  <li><a href="/../../Paginas/Reportes/busmeta.aspx">Diccionario de términos</a></li>
                  <li><a href="/../../Paginas/Reportes/busmeta.aspx">Inventario metricas</a></li>
                  <li><a href="/../../Paginas/Reportes/busmeta.aspx">Cruce Métricas Tema</a></li>
                  <li><a href="/Paginas/PreguntasFrecuentes.aspx">Preguntas frecuentes</a></li>
                  </ul>
                </div>
                <div className="top-nav_menu_subitem_main top-nav_menu_subitem_main--right">
                  <span>Información complementaria</span>
                  <ul>
                    <li><a href="/../../Histricos/Listado_Agentes.xlsx">Listado Agentes</a></li>
                    <li><a href="/../../Histricos/Listado_Recursos_Generacion.xlsx">Listado Recursos Generación</a></li>
                    <li><a href="/../../Histricos/Listado_Recursos_AGPE.xlsx">Listado de Recursos AGPE</a></li>
                    <li><a href="/../../Histricos/InventarioSuscripcionesSinergox.xlsx">Listado Suscripciones</a></li>
                  </ul>
                </div>
              </div>
            </li>

            <li>
              <a href="https://github.com/EquipoAnaliticaXM/API_XM" target="_blank" rel="noreferrer" className="nav-item">
                API
              </a>
            </li>

            {/* Visible solo cuando el usuario está autenticado */}
            {auth.isAuthenticated && (
              <li>
                <a href="/analisis-multidimensional" className="nav-item nav-item--highlight">
                  Análisis Multidimensional
                </a>
              </li>
            )}

            <li><a href="/../../Paginas/EnlacesInteres.aspx" className="nav-item">Enlaces de interés</a></li>
            <li><a href="/../../Paginas/Conoce.aspx" className="nav-item">Conoce Sinergox</a></li>
          </ul>
        </nav>

        {/* Visible solo en desktop */}
        <div className="box-login box-login--desktop">
          <LoginButton />
        </div>

      </div>
    </header>
  );
};

export default Header;