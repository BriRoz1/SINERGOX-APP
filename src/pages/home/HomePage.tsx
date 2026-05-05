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
  return 'H4sIAAAAAAAEAB3Sxw6r1gKF4Xc5UyIBpkfKADBgOpsOMzreNNPB0X33a2W-Bkuf_n__ONndT1n55-8_bHxR6xli6iE2NtrQZlG-g8cyPndNT9A5_T59rLxIYntMMrdhWwpdvlgpSL5l_Kso6utOO3Syc6NJBxvvL_vbgU6_CIm5WEGuvYer5Mp367_vF5wC45z7zl9WN9kryvNFLPWMYzGLUQjmi9SOzMm7TEHJiwl53SYnnWZKeQqRZ_f7QbO-QO1fNCwj_gE5nuUWLipMksSZ9Q75t3UambsXgNpcbw7G4miaOZAuuB98KSVbCYt4puuuLkXcosBZlZg1VyMdN8jSR3ZANXo-YPi9QUWOLaw-aCy8FGRKSGBmaI85uGA4vXmVktM-KSo0lCLgDdTzlzGaVS8aqUrZ3ppz4IiLukRvIz4orlsA6mPac1EEyqiuSDhYieR9lpdaPWeqbnyW5iAX6fpKmjm94nSNHiKF11jPGuwmXlxAdGtvYZZflvEPeqXzTzg_PzcRPCJKzPelCkqayUuXycl28kHbfR43hwvcuaTL84zi59hPXRfiySWM_ofpKlP0YgYqQW-fHBpBqsgSzxxmq8o_jqfh8Yy-6ZRH5QwznYqCx1A5F0dAwHWNrlk9xSqG_70xI1ha6by3vZcuhAj44Zyv4-6pxKjrKZzKlTVChFCvUvfBh7cbdMd6wWAVl5Z22OaLqodNwKr-4cCJ54qztAMh-Pgh8wRBdyEMKPSqdCCk5F1wYkNnG8aeeEQWES8b2RvpTTfCkzQ4EGrvcny1DIt-m6fWv5jpCqZESpFoOcAaqua2BaBN_vnz1x9xuT_bpFf3L33d0aKPV901LJdu7TAhfpkRW0xLyqlRBeZRzo6U39cHt6SHQlxztGUChwB2nrYmZF72eE--PuVMEUHNAri-tj1X03MlG_oyXwlix2lFbvDJGnZ_P6JELm7IEeLvefpVHecILS3Y-Tnl2poP-6g5FtpIvmWReulgEcw9D6Ch0qoP7RuqLNwH3sDa72iUWPggYPaVR67A_TNNJyVpBilA6lHCgQQoG9KZATI7CtzdP3dguMuVV0vLdoRpWRpHBhWK3MvX8dd7IuEVmFV-DcTN-ng-3F4WnyE6RRRd9sVsMHKjbqBGz14zVuN-MuhF7UkyrgnXJxbm8UXmjjtLvPl45trzn_-Y709bLWr4Uw5u8FySQpSl9fJcbH7hEH01_628dzNm26_g3ywRw1iG9KZ_W1mU4pq9igioNhWS1Za9U5Sm2TrKb1ChLfRT-rULIjtruDNQrQDioxcJFx2IuM2akINqItwvNKWkvLJF1tdEzI8GPO_qrL-4sf4uLiGwZYIXZU8DgVDTkxtOUUvTuBLeF2shjeTSj2AWMD3KiL3xnrln41mI9b4p2Eczeypns0WbYj2mkxepu-4imxZw6jlEdU-zDeETGoNp2i5OD-RZ3ucvf32MN8sx1GKNOl-7NucpSr9Y91X5ueReh3ri2yH5JAvS0zGFMww0gMDxLOD-8QiO1EasduDLG-_Hq3jW_iyMxMn1DirLW2NFcJHWCRwJ6e9mNoKLG2jwY_7f_wFI8Jru7gUAAA==.eyJjbHVzdGVyVXJsIjoiaHR0cHM6Ly9XQUJJLVNPVVRILUNFTlRSQUwtVVMtcmVkaXJlY3QuYW5hbHlzaXMud2luZG93cy5uZXQiLCJleHAiOjE3Nzc5MzU3OTUsImFsbG93QWNjZXNzT3ZlclB1YmxpY0ludGVybmV0Ijp0cnVlfQ==';
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
              <h3 className="home-novedades__titulo">Novedades</h3>
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