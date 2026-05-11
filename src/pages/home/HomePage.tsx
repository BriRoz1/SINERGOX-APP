import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as pbi from 'powerbi-client';
import { useAuth } from '../../store/auth/AuthContext';
import './HomePage.css';
import sinergoxbanner from '../../assets/banner-sinergox.jpg';
import HomeCards from '../../components/home-cards/HomeCards';
// ── Tipos ────────────────────────────────────────────────────

type Novedad = {
  id: string;
  fecha: string;
  texto: string;
  link: string;
};

// ── Datos de novedades ───────────────────────────────────────

const NOVEDADES: Novedad[] = [
  {
    id: '1',
    fecha: '15/4/2025',
    texto: 'A partir del mes de abril, los informes mensuales de análisis del mercado ya no se publicarán de forma individual. En su lugar, se presentará un informe general consolidado.',
    link: '#',
  },
  {
    id: '2',
    fecha: '4/4/2025',
    texto: '​Informamos que desde el 03 de abril se encuentra disponible la versión 0.3.14 de pydataxm, nuestra librería para consumir la API XM y la API SIMEM. En esta versión se tienen funcionalidades optimizadas para el consumo de la API SIMEM y se pueden seguir usando las mismas funcionalidades disponibles anteriormente, con esta implementación es posible consultar diferentes variables en distintas versiones. Ingresa al enlace para conocer mas información.',
    link: '#',
  },
];

// ── Obtener configuración Power BI desde el backend ──────────

async function getEmbedConfig(
  reportName: string
): Promise<{ token: string; reportId: string; embedUrl: string }> {
  const res = await fetch(
    'https://asp-sinergox-dev-02-crb0e2g7feghcteq.eastus2-01.azurewebsites.net/api/PowerBi/embed-token',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reportName }),
    }
  );

  if (!res.ok) {
    throw new Error('No se pudo obtener configuración Power BI');
  }

  return res.json();
}

// ── Componente Power BI ──────────────────────────────────────

const PowerBIEmbed = () => {
  const containerRef      = useRef<HTMLDivElement>(null);
  const powerbiServiceRef = useRef<pbi.service.Service | null>(null);
  const [loading, setLoading] = useState(true);

  const REPORT_NAME = 'Buscador Metadata';

  useEffect(() => {
    const embedReport = async () => {
      try {
        if (!containerRef.current) return;

        // Inicializar servicio una sola vez
        if (!powerbiServiceRef.current) {
          powerbiServiceRef.current = new pbi.service.Service(
            pbi.factories.hpmFactory,
            pbi.factories.wpmpFactory,
            pbi.factories.routerFactory,
          );
        }

        const powerbiService = powerbiServiceRef.current;

        // Reset seguro — React StrictMode monta dos veces en desarrollo
        try {
          powerbiService.reset(containerRef.current);
        } catch { /* ignorar error de StrictMode */ }

        // Obtener token, embedUrl y reportId desde el backend
        const { token, embedUrl, reportId } = await getEmbedConfig(REPORT_NAME);

        const config: pbi.IEmbedConfiguration = {
          type:        'report',
          tokenType:   pbi.models.TokenType.Embed,
          id:          reportId,
          embedUrl:    embedUrl,
          accessToken: token,
          permissions: pbi.models.Permissions.All,
          viewMode:    pbi.models.ViewMode.View,
          settings: {
            background: pbi.models.BackgroundType.Transparent,
            panes: {
              filters:        { visible: true },
              pageNavigation: { visible: true },
            },
            localeSettings: {
              language:     'es',
              formatLocale: 'es-ES',
            },
          },
        };

        const report = powerbiService.embed(containerRef.current, config) as pbi.Report;

        report.on('loaded', () => setLoading(false));

        report.on('error', (event) => {
          console.error('Power BI error:', event.detail);
          setLoading(false);
        });

        // Nota: tokenExpired no está soportado en esta versión del SDK.
        // El token del backend se renueva recargando la página cuando expire.

      } catch (err) {
        console.error('Error embebiendo Power BI:', err);
        setLoading(false);
      }
    };

    void embedReport();

    return () => {
      if (containerRef.current && powerbiServiceRef.current) {
        try {
          powerbiServiceRef.current.reset(containerRef.current);
        } catch { /* ignorar */ }
      }
    };
  }, []);

  return (
    <div className="home-pbi__sdk-container">
      {loading && (
        <div className="home-pbi__loading">
          <div className="home-auth-loading__spinner" />
          <span>Cargando indicadores…</span>
        </div>
      )}
      <div ref={containerRef} className="home-pbi__sdk-frame" />
    </div>
  );
};

// ── Componente Principal ─────────────────────────────────────

const HomePage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [novedadesOpen, setNovedadesOpen]   = useState(true);
  const [procesandoAuth, setProcesandoAuth] = useState(false);

  // Manejar callback OAuth en el home
  useEffect(() => {
    const params        = new URLSearchParams(window.location.search);
    const code          = params.get('code');
    const returnedState = params.get('state');
    const errorParam    = params.get('error');

    if (errorParam) {
      console.error('Auth error:', errorParam);
      window.history.replaceState({}, '', '/');
      return;
    }

    if (code) {
      const savedState = sessionStorage.getItem('oauth_state');
      if (!savedState || savedState !== returnedState) {
        console.error('State mismatch — posible CSRF');
        window.history.replaceState({}, '', '/');
        return;
      }

      setProcesandoAuth(true);
      login(code)
        .then(() => window.history.replaceState({}, '', '/'))
        .catch((err: Error) => {
          if (err.message === 'ACCESO_DENEGADO') {
            navigate('/access-denied', { replace: true });
          } else {
            console.error('Login error:', err);
            window.history.replaceState({}, '', '/');
          }
        })
        .finally(() => setProcesandoAuth(false));
    }
  }, []);

  if (procesandoAuth) {
    return (
      <div className="home-auth-loading">
        <div className="home-auth-loading__spinner" />
        <p>Iniciando sesión con Microsoft…</p>
      </div>
    );
  }

  return (
    <div className="home-page">
      <div className="home-card">

        <h3 className="home-indicadores-title">Indicadores</h3>

        {/* Banner */}
        <div className="home-banner">
          <div className="home-banner__image">
            <a
              id="banner-link"
              href="https://sinergox.xm.com.co/Histricos/InventarioMetricas_Inconsistencia.xlsx?d=wda27867e5b484dbd9005073f312749ac"
              target="_blank"
              rel="noreferrer"
            >
              <img
                src={sinergoxbanner}
                alt="Sinergox"
                className="home-banner__img"
              />
            </a>
          </div>
        </div>

        {/* Power BI + Novedades */}
        <div className="home-content">

          <div className="home-pbi">
            <PowerBIEmbed />
          </div>

          <div className={`home-novedades${novedadesOpen ? '' : ' home-novedades--closed'}`}>
            <button
              className="home-novedades__toggle"
              onClick={() => setNovedadesOpen(p => !p)}
              aria-label={novedadesOpen ? 'Cerrar novedades' : 'Abrir novedades'}
            >
              <span className="home-novedades__toggle-label">Novedades</span>
              <span className="home-novedades__toggle-icon">{novedadesOpen ? '›' : '‹'}</span>
            </button>

            {novedadesOpen && (
              <div className="home-novedades__panel">
                <h2 className="home-novedades__titulo">Novedades</h2>
                <div className="home-novedades__lista">
                  {NOVEDADES.map(n => (
                    <div key={n.id} className="novedad-item">
                      <span className="novedad-item__fecha">{n.fecha}</span>
                      <p className="novedad-item__texto">{n.texto}</p>
                      <a href={n.link} className="novedad-item__link">Seguir vínculo</a>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

        </div>{/* /home-content */}

        {/* Cards — Diccionario y Preguntas frecuentes */}
        <HomeCards />

      </div>{/* /home-card */}
    </div>
  );
};

export default HomePage;