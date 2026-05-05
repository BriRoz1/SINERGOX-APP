import './Footer.css';
import sinergoxBlanco from '../../assets/sinergox_blanco.svg';
import bannerImg from '../../assets/banner-sinergox_2.jpg';
import barraNaranjaImg from '../../assets/barra-naranja.jpg';


const Footer = () => {
  return (
    <footer>

      {/* Banner inferior — réplica de .banner_bottom */}
      <div className="banner-bottom">
        <div className="banner-bottom__image" role="img" aria-label="Banner Sinergox"  style={{ backgroundImage: `url(${bannerImg})` }} />

        <div className="banner-bottom__text">
          {/* Logo blanco — reemplaza el div por: */}
          {/* <img src="/assets/sinergox-blanco.svg" alt="Sinergox" /> */}
          <img src={sinergoxBlanco} alt="Sinergox" />
          <p>
            Un sitio web administrado por XM, que centraliza la información pública del{' '}
            <strong>Mercado de Energía Mayorista (MEM)</strong>{' '}
            y la operación del{' '}
            <strong>Sistema Interconectado Nacional (SIN)</strong>,{' '}
            apoya la toma de decisiones de los diferentes públicos de interés y promueve
            la competencia y transparencia en el mercado.
          </p>
        </div>
      </div>

      {/* Envoltura-3: barra naranja + datos de contacto */}
      <div className="footer-envoltura">

        {/* Barra naranja — centrada */}
        <div className="footer-barra">
          <div className="footer-barra__inner" style={{ backgroundImage: `url(${barraNaranjaImg})` }} />
        </div>

        {/* Datos de contacto */}
        <div className="footer-bottom">
          <div className="footer-bottom__inner">
            <p className="footer-bottom__txt">
              XM S.A. E.S.P. Calle 12 Sur No. 18 -168. Teléfono: 57 (4) 3172244,
              Fax: 57 (4) 3170989. Medellín Colombia.
            </p>
            <div className="footer-bottom__terminos">
              <a
                href="https://sinergox.xm.com.co/Documentos/Terminos_Condiciones/Terminos_Legales_Uso_Sinergox.pdf"
                target="_blank"
                rel="noreferrer"
              >
                Términos y Condiciones de Uso
              </a>
            </div>
          </div>
        </div>

      </div>

    </footer>
  );
};

export default Footer;