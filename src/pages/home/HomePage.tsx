import { useEffect, useRef, useState } from 'react';
import * as pbi from 'powerbi-client';
import { useAuth } from '../../store/auth/AuthContext';
import './HomePage.css';
import sinergoxbanner from '../../assets/banner-sinergox.jpg';

// ── Configuración Power BI ───────────────────────────────────

const PBI_REPORT_ID  = 'f5b14991-c26f-461a-8e2c-227443b75a16';
const PBI_GROUP_ID   = '4805a845-c2d9-48e7-aefb-2cd728444bf2';
const PBI_EMBED_URL  =
  `https://app.powerbi.com/reportEmbed` +
  `?reportId=${PBI_REPORT_ID}` +
  `&groupId=${PBI_GROUP_ID}` +
  `&language=es&formatLocale=en`;

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
    texto: 'Informamos que desde el 03 de abril se encuentra disponible la versión 0.3.14 de pydataxm, nuestra librería para consumir la API XM y la API SIMEM.',
    link: '#',
  },
];

// ── Hook: obtener embed token ────────────────────────────────

async function getEmbedToken(): Promise<string> {
  // TODO: cuando el backend esté listo, reemplazar por:
  //
  // const res = await fetch('/api/powerbi/embed-token', {
  //   method: 'POST',
  //   headers: {
  //     'Content-Type': 'application/json',
  //     'Authorization': `Bearer ${accessToken}`
  //   },
  //   body: JSON.stringify({ reportId: PBI_REPORT_ID, groupId: PBI_GROUP_ID }),
  // });
  // const data = await res.json();
  // return data.token;

  // Token temporal para pruebas — expira pronto, reemplazar con endpoint del backend
  return 'H4sIAAAAAAAEAB2Sx66rVgBF_-VOiUQ14EhvQDOdQy-e0U09mA5R_j1XmS9pS2uvf37s9OphWvz8_fMUNhj7TXRR_JQFQbAQ9rXeUsIRCbXAwLifEmPxnzOc58HYZyGDEj5RGW_lPAyfIc0iorn7qux2wuWIvH4sZkfanZpjVuLleoMZjacFFlK9dd9hEXjal0hM2QhDxuVGxnpHQWNTxmtUAIFgpxik2VkKTmnUj0rgJzNKUrDAhjMlImpO2ibnsvRGQOc5vPXnIdZQgXuC13B6vs4nLITezInSMNnsyVguhq0x1-oubUSIoTRLWX43lpvIARwzcj9qUmmsB3T21PKrk-QY7R01Yp4g-F4Ph9uIJSAh6FDOx6OWrLzRPft3BufnRymlZBrrBA-ta0YXvIccQuLuDorlofGIjqmXdXTCXHDPq26ollSCPY0j9Fg_Z1w1tPN4ir2joODDDome7KuTjPMsRi3WCcfDySvEl9HTJVDNp-GmPKqQ1U_5Kcg-ly73jGGxlsl0GDvpZ0Yz9w43kD56BpkPVL9Ftd2Nxjgq1p0PyxZnqelSKT7IQJvlUGTzHvcvNjMjHsSDyMn3SIUB0udoJpC2jenjqVyOEdIfmfuI6tctTFC-fHBplskYs1f_NmJXn_2RbAa84JscvwaVbndWs9ItIna4DqbLdMsJTnMjtLieTRR78EzeULfD-Umc2BYH87ll3tf69ZxUCt1JY11u_8TLAyLDS8HUkA17d88ye6qjvfuiZPdhvxtYoWXQw4QewAg7ixAcWkce3BMtjZcfNOIyZDLZkvuoYrBk-NOYcVryy0Eu7xH78_PXjzBf0wr18vpN38TNekJ2ndTXK-1JV_M678zajZYq7LtpeamRlJ-TuliLwjqk_J4k6VVdy6juatdw5zTHTZFrYLgXaapEKkXOE-yyVPYVbajRQY0M46B57Ia_yfABWDesxcOK0_ZXkQEmYZthX4uNHsu9kC_GKcHD8OOkd6f5YE0C5-LpkgpKYqV0edMkJcWo6knEmm5alZ4HgTr5FY9SM8C24-7f3_eIpFPzhFRTfK47zbji2r99oNjNaHs7VJFl76cTHGo6Lbr2WsUUjQeW5noCeIMBMxKtxxRgtNMQtdUB5h6-wkN-TWNytR3iTQ0lo6gnCarPlmEhYr5JFnqsgW11NSYzJieq-PrP_5qv6VPOavhrOcySrAr2FYjrk3L6ySI4Yj7-p7zmd2_d5vIX45C7xSqMilUVpILrW2d-NEc00UZoNK-jpkw6eRl6Exucvw6r_-4LUAE_Gu8tPxapqJXYMC0864gW9ZnmhZwMT9IvpqSckKIRXYvbYiSG-4VOIL3W4O1Tpf1GxU8vcxVRvZO9XBsvNbKy7Zk99ZWKFL-2uqxDourtF0cPghO8ymWseOQJAc0n_D7sln5-czw3AnyLgScy6ePjvReHMnisxUCLUM-0mujWjQ6rs9KKvb5Tzk3RAK783BDb6CrxGEXbl1drxTJUKRb6bOxPUBfghSiKWiOdw1R5PlmiSofZF96pEkNf1ahoIrUHPM4PozaBK-MJcTnz-9VkktgZcPi-7u9zdn41__sfTx0tHe4FAAA=.eyJjbHVzdGVyVXJsIjoiaHR0cHM6Ly9XQUJJLVNPVVRILUNFTlRSQUwtVVMtcmVkaXJlY3QuYW5hbHlzaXMud2luZG93cy5uZXQiLCJleHAiOjE3NzgwMTE2MzQsImFsbG93QWNjZXNzT3ZlclB1YmxpY0ludGVybmV0Ijp0cnVlfQ==';
}

// ── Componente Power BI ──────────────────────────────────────

const PowerBIEmbed = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [useFallback, setUseFallback] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let report: pbi.Report | null = null;

    const embed = async () => {
      try {
        const token = await getEmbedToken();

        // Si no hay token aún, usar iframe de fallback
        if (!token) {
          setUseFallback(true);
          setLoading(false);
          return;
        }

        if (!containerRef.current) return;

        const powerbiService = new pbi.service.Service(
          pbi.factories.hpmFactory,
          pbi.factories.wpmpFactory,
          pbi.factories.routerFactory,
        );

        const config: pbi.IEmbedConfiguration = {
          type:       'report',
          tokenType:  pbi.models.TokenType.Embed,
          id:         PBI_REPORT_ID,
          embedUrl:   PBI_EMBED_URL,
          accessToken: token,
          permissions: pbi.models.Permissions.All,
          viewMode:   pbi.models.ViewMode.View,
          settings: {
            filterPaneEnabled:    true,
            navContentPaneEnabled: true,
            localeSettings: {
              language:     'es',
              formatLocale: 'en',
            },
          },
        };

        report = powerbiService.embed(
          containerRef.current,
          config,
        ) as pbi.Report;

        report.on('loaded', () => setLoading(false));
        report.on('error',  () => { setUseFallback(true); setLoading(false); });

      } catch {
        setUseFallback(true);
        setLoading(false);
      }
    };

    void embed();

    return () => {
      if (containerRef.current) {
        try {
          const svc = new pbi.service.Service(
            pbi.factories.hpmFactory,
            pbi.factories.wpmpFactory,
            pbi.factories.routerFactory,
          );
          svc.reset(containerRef.current);
        } catch { /* ignorar */ }
      }
    };
  }, []);

  if (useFallback) {
    return (
      <iframe
        className="home-pbi__iframe home-pbi__iframe--loaded"
        src={PBI_EMBED_URL}
        title="Indicadores Sinergox"
        allowFullScreen
        onLoad={() => setLoading(false)}
      />
    );
  }

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
  const [novedadesOpen, setNovedadesOpen] = useState(true);
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
          console.error('Login error:', err);
          window.history.replaceState({}, '', '/');
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

        {/* Banner — solo imagen, el contenido va dentro de la imagen */}
        <div className="home-banner">
          <div className="home-banner__image">
         <a id="banner-link" href="https://sinergox.xm.com.co/Histricos/InventarioMetricas_Inconsistencia.xlsx?d=wda27867e5b484dbd9005073f312749ac" target="_blank">
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

      </div>{/* home-content */}
      </div>{/* home-card */}
    </div>
  );
};

export default HomePage;