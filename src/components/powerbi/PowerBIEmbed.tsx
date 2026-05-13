import { useEffect, useRef, useState } from 'react';
import * as pbi from 'powerbi-client';
import './PowerBIEmbed.css';

// ── Tipos ────────────────────────────────────────────────────

export type PowerBIEmbedConfig = {
  token:    string;
  reportId: string;
  embedUrl: string;
};

export type PowerBIEmbedProps = {
  /** Configuración del reporte: token, reportId y embedUrl */
  config: PowerBIEmbedConfig;
  /** Mostrar panel de filtros (default: true) */
  showFilters?: boolean;
  /** Mostrar navegación de páginas (default: true) */
  showPageNavigation?: boolean;
  /** Altura del contenedor (default: '800px') */
  height?: string;
  /** Idioma del reporte (default: 'es') */
  language?: string;
  /** Formato de locale (default: 'es-ES') */
  formatLocale?: string;
  /** Callback cuando el reporte termina de cargar */
  onLoaded?: () => void;
  /** Callback cuando ocurre un error */
  onError?: (error: unknown) => void;
};

// ── Componente ───────────────────────────────────────────────

const PowerBIEmbed = ({
  config,
  showFilters      = true,
  showPageNavigation = true,
  height           = '800px',
  language         = 'es',
  formatLocale     = 'es-ES',
  onLoaded,
  onError,
}: PowerBIEmbedProps) => {
  const containerRef      = useRef<HTMLDivElement>(null);
  const powerbiServiceRef = useRef<pbi.service.Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);

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

        // Reset seguro — React StrictMode safe
        try { powerbiService.reset(containerRef.current); }
        catch { /* ignorar */ }

        const embedConfig: pbi.IEmbedConfiguration = {
          type:        'report',
          tokenType:   pbi.models.TokenType.Embed,
          id:          config.reportId,
          embedUrl:    config.embedUrl,
          accessToken: config.token,
          permissions: pbi.models.Permissions.Read,
          viewMode:    pbi.models.ViewMode.View,
          settings: {
            background: pbi.models.BackgroundType.Transparent,
            panes: {
              filters:        { visible: showFilters },
              pageNavigation: { visible: showPageNavigation },
            },
            localeSettings: { language, formatLocale },
          },
        };

        const report = powerbiService.embed(
          containerRef.current,
          embedConfig,
        ) as pbi.Report;

        report.on('loaded', () => {
          setLoading(false);
          onLoaded?.();
        });

        report.on('error', (event) => {
          console.error('Power BI error:', event.detail);
          setError('Error al cargar el reporte. Intenta recargar la página.');
          setLoading(false);
          onError?.(event.detail);
        });

      } catch (err) {
        console.error('Error embebiendo Power BI:', err);
        setError('No se pudo cargar el reporte de Power BI.');
        setLoading(false);
        onError?.(err);
      }
    };

    void embedReport();

    return () => {
      if (containerRef.current && powerbiServiceRef.current) {
        try { powerbiServiceRef.current.reset(containerRef.current); }
        catch { /* ignorar */ }
      }
    };
  }, [config.token, config.reportId, config.embedUrl]);

  return (
    <div className="pbi-embed" style={{ height }}>
      {/* Estado de carga */}
      {loading && !error && (
        <div className="pbi-embed__loading">
          <div className="pbi-embed__spinner" />
          <span>Cargando reporte…</span>
        </div>
      )}

      {/* Estado de error */}
      {error && (
        <div className="pbi-embed__error">
          <span className="pbi-embed__error-icon">⚠️</span>
          <p className="pbi-embed__error-msg">{error}</p>
        </div>
      )}

      {/* Contenedor del reporte */}
      <div
        ref={containerRef}
        className="pbi-embed__frame"
        style={{ height }}
      />
    </div>
  );
};

export default PowerBIEmbed;