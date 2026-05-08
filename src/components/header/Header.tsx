import { useState, useRef, useEffect } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
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

  const displayName = auth.user?.name ?? 'Mi cuenta';
  const userEmail   = auth.user?.email ?? '';

  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Clase activa para NavLink
  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `nav-item${isActive ? ' nav-item--active' : ''}`;

  const LoginButton = () => (
    <div className="user-menu-wrapper" ref={userMenuRef}>
      <button
        className="login-btn"
        onClick={() => auth.isAuthenticated ? setUserMenuOpen(p => !p) : handleLogin()}
      >
        {auth.isAuthenticated ? `👤 ${displayName}` : 'Inicio de sesión'}
      </button>

      {auth.isAuthenticated && userMenuOpen && (
        <div className="user-menu-dropdown">
          <div className="user-menu-dropdown__info">
            <span className="user-menu-dropdown__name">{displayName}</span>
            <span className="user-menu-dropdown__email">{userEmail}</span>
          </div>
          <div className="user-menu-dropdown__divider" />
          <button
            className="user-menu-dropdown__logout"
            onClick={() => { logout(); setUserMenuOpen(false); }}
          >
            🚪 Cerrar sesión
          </button>
        </div>
      )}
    </div>
  );

  return (
    <header className="header">
      <div className="portal-brand">

        {/* ROW 1: logos + login (mobile/tablet) */}
        <div className="header-row-top">
          <div className="header-logos">
            <div className="main-logo">
              <a href="https://www.xm.com.co/" target="_blank" rel="noreferrer">
                <img src={logoColorXm} alt="XM" title="XM" />
              </a>
            </div>
            <div className="portal-name">
              <NavLink to="/">
                <img src={sinergoxlogo} alt="Sinergox" title="Sinergox" />
              </NavLink>
            </div>
          </div>

          {/* Mobile/tablet only */}
          <div className="box-login box-login--inline">
            <LoginButton />
          </div>
        </div>

        {/* ROW 2: nav */}
        <nav className="top-nav_menu">
          <ul className="top-nav_menu_links">

            {/* Tools dropdown */}
            <li
              ref={herramientasRef}
              className={`has-submenu${openDropdown === 'tools' ? ' dropdown-open' : ''}`}
            >
              <span
                className="nav-item"
                onClick={() => toggleDropdown('tools')}
                role="button"
                tabIndex={0}
                onKeyDown={e => e.key === 'Enter' && toggleDropdown('tools')}
              >
                Herramientas
                <img src={arrowDownOrange} alt="" className="top-nav_menu_links_icon" aria-hidden="true" />
              </span>

              <div
                className="top-nav_menu_subitem"
                style={openDropdown === 'tools' && isNarrow ? { top: dropdownTop } : undefined}
              >
                <div className="top-nav_menu_subitem_main top-nav_menu_subitem_main--left">
                  <span>Referencias</span>
                  <ul>
                    <li>
                      <NavLink to="/dictionary" className={navLinkClass} onClick={() => setOpenDropdown(null)}>
                        Diccionario de términos
                      </NavLink>
                    </li>
                    <li>
                      <a href="/../../Histricos/InventarioMetricas.xlsx">Inventario métricas</a>
                    </li>
                    <li>
                      <a href="/../../Histricos/Cruces_Metricas_Tema.xlsx">Cruce Métricas Tema</a>
                    </li>
                    <li>
                      <NavLink to="/faq" className={navLinkClass} onClick={() => setOpenDropdown(null)}>
                        Preguntas frecuentes
                      </NavLink>
                    </li>
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

            {/* API — external link, no NavLink */}
            <li>
              <a
                href="https://github.com/EquipoAnaliticaXM/API_XM"
                target="_blank"
                rel="noreferrer"
                className="nav-item"
              >
                API
              </a>
            </li>

            {/* Multidimensional Analysis — only when authenticated */}
            {auth.isAuthenticated && (
              <li>
                <NavLink to="/multidimensional-analysis" className={({ isActive }) =>
                  `nav-item nav-item--highlight${isActive ? ' nav-item--active' : ''}`
                }>
                  Análisis Multidimensional
                </NavLink>
              </li>
            )}

            {/* Links of Interest */}
            <li>
              <NavLink to="/links-of-interest" className={navLinkClass}>
                Enlaces de interés
              </NavLink>
            </li>

            {/* About Sinergox */}
            <li>
              <NavLink to="/about-sinergox" className={navLinkClass}>
                Conoce Sinergox
              </NavLink>
            </li>

          </ul>
        </nav>

        {/* Desktop login */}
        <div className="box-login box-login--desktop">
          <LoginButton />
        </div>

      </div>
    </header>
  );
};

export default Header;