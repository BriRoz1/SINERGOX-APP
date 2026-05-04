import { useState } from 'react';
import './MainMenu.css';
import arrowDownWhite from '../../assets/arrow-down-orange.svg';

const MainMenu = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);

  const toggleSubmenu = (name: string) => {
    setOpenSubmenu(prev => (prev === name ? null : name));
  };

  return (
    <nav className="main-menu">
      <div className="main-menu-container">

        {/* Botón hamburguesa — solo visible en móvil */}
        <button
          className="menu-toggle"
          aria-label="Abrir menú"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(prev => !prev)}
        >
          {menuOpen ? '✕' : '☰'}
        </button>

        <ul className={`main-menu-list${menuOpen ? ' open' : ''}`}>

          {/* Demandas y Fronteras */}
          <li className={`has-submenu${openSubmenu === 'demandas' ? ' submenu-open' : ''}`}>
            <span onClick={() => toggleSubmenu('demandas')}>
              Demandas y Fronteras
              <img src={arrowDownWhite} alt="" />
            </span>
            <ul className="submenu">
              <li><a href="/../../Paginas/Informes/DemandaRealPerdidas.aspx">Demanda Comercial</a></li>
              <li><a href="/../../Paginas/Informes/DemandaEnergiaSIN-DNA.aspx">Demanda del SIN</a></li>
              <li><a href="/../../Paginas/Informes/Demanda_Tiempo_Real.aspx">Demanda Real</a></li>
              <li><a href="/../../Paginas/Informes/EvolucionFrtComerciales.aspx">Fronteras</a></li>
              <li><a href="/../../Paginas/Historicos/Historicos.aspx">Ir a históricos</a></li>
            </ul>
          </li>

          {/* Hidrología */}
          <li className={`has-submenu${openSubmenu === 'hidrologia' ? ' submenu-open' : ''}`}>
            <span onClick={() => toggleSubmenu('hidrologia')}>
              Hidrología
              <img src={arrowDownWhite} alt="" />
            </span>
            <ul className="submenu">
              <li><a href="/../../Paginas/Informes/MapaHidrologiaSIN.aspx">Hidrología del SIN</a></li>
              <li><a href="/../../Paginas/Informes/ReservasHidricasSIN.aspx">Reservas</a></li>
              <li><a href="/../../Paginas/Informes/DetalleAportesHidricos.aspx">Aportes</a></li>
              <li><a href="/../../Paginas/Informes/Vertimientos.aspx">Vertimientos</a></li>
              <li><a href="/../../Paginas/Historicos/Historicos.aspx">Ir a históricos</a></li>
            </ul>
          </li>

          {/* Oferta y Generación */}
          <li className={`has-submenu${openSubmenu === 'oferta' ? ' submenu-open' : ''}`}>
            <span onClick={() => toggleSubmenu('oferta')}>
              Oferta y Generación
              <img src={arrowDownWhite} alt="" />
            </span>
            <ul className="submenu">
              <li><a href="/../../Paginas/Informes/GeneracionSIN.aspx">Generación</a></li>
              <li><a href="/../../Paginas/Informes/AGPE.aspx">Autogeneración</a></li>
              <li><a href="/../../Paginas/Informes/CapacidadEfectiva.aspx">Capacidad y Combustible</a></li>
              <li><a href="/../../Paginas/Informes/DisponibilidadReal.aspx">Disponibilidad</a></li>
              <li><a href="/../../Paginas/Informes/Frecuencia_Tiempo_Real.aspx">Operación</a></li>
              <li><a href="/../../Paginas/Historicos/Historicos.aspx">Ir a históricos</a></li>
            </ul>
          </li>

          {/* Transacciones y Precios */}
          <li className={`has-submenu${openSubmenu === 'transacciones' ? ' submenu-open' : ''}`}>
            <span onClick={() => toggleSubmenu('transacciones')}>
              Transacciones y Precios
              <img src={arrowDownWhite} alt="" />
            </span>
             <ul className="submenu">
              <li><a href="/../../Paginas/Informes/GeneracionSIN.aspx">Precios</a></li>
              <li><a href="/../../Paginas/Informes/AGPE.aspx">Contratos</a></li>
              <li><a href="/../../Paginas/Informes/CapacidadEfectiva.aspx">Cargo por Confibialidad</a></li>
              <li><a href="/../../Paginas/Informes/DisponibilidadReal.aspx">Montos Liquidados</a></li>
              <li><a href="/../../Paginas/Historicos/Historicos.aspx">Ir a históricos</a></li>
            </ul>
          </li>

          {/* Intercambios Internacionales */}
          <li className={`has-submenu${openSubmenu === 'intercambios' ? ' submenu-open' : ''}`}>
            <span onClick={() => toggleSubmenu('intercambios')}>
              Intercambios Internacionales
              <img src={arrowDownWhite} alt="" />
            </span>
             <ul className="submenu">
              <li><a href="/../../Paginas/Informes/GeneracionSIN.aspx">Importaciones y Exportaciones</a></li>
              <li><a href="/../../Paginas/Historicos/Historicos.aspx">Ir a históricos</a></li>
            </ul>
          </li>

          {/* Restricciones */}
          <li className={`has-submenu${openSubmenu === 'restricciones' ? ' submenu-open' : ''}`}>
            <span onClick={() => toggleSubmenu('restricciones')}>
              Restricciones
              <img src={arrowDownWhite} alt="" />
            </span>
             <ul className="submenu">
              <li><a href="/../../Paginas/Informes/GeneracionSIN.aspx">Servicios de AGC</a></li>
              <li><a href="/../../Paginas/Informes/AGPE.aspx">Generación de Seguridad</a></li>
              <li><a href="/../../Paginas/Informes/CapacidadEfectiva.aspx">Reconciliaciones</a></li>
              <li><a href="/../../Paginas/Informes/DisponibilidadReal.aspx">Restricciones</a></li>
              <li><a href="/../../Paginas/Historicos/Historicos.aspx">Ir a históricos</a></li>
            </ul>
          </li>

          <li>
            <a href="/informes">Informes</a>
          </li>

        </ul>
      </div>
    </nav>
  );
};

export default MainMenu;
