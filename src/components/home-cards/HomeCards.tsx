import { NavLink } from 'react-router-dom';
import iconDiccionario from '../../assets/icon-diccionario.png';
import iconPreguntas from '../../assets/icon-preguntas.png';
import './HomeCards.css';

const CARDS = [
  {
    id: 'dictionary',
    icon: iconDiccionario,
    alt: 'Diccionario',
    label: 'Diccionario de términos',
    to: '/dictionary',
  },
  {
    id: 'faq',
    icon: iconPreguntas,
    alt: 'Preguntas',
    label: 'Preguntas frecuentes',
    to: '/faq',
  },
];

const HomeCards = () => (
  <div className="home-cards">
    {CARDS.map(card => (
      <NavLink key={card.id} to={card.to} className="home-card-item">
        <div className="home-card-item__icon-wrapper">
          <img
            src={card.icon}
            alt={card.alt}
            className="home-card-item__icon"
          />
        </div>
        <div className="home-card-item__label">{card.label}</div>
      </NavLink>
    ))}
  </div>
);

export default HomeCards;