import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, MapPin, Clock } from 'lucide-react';
import './Footer.css';

const Footer: React.FC = () => {

  const handlePhoneClick = (phoneNumber: string) => {
    const normalized = phoneNumber.replace(/[^+\d]/g, '');
    const telNumber = normalized.startsWith('+') ? normalized : `+${normalized}`;

    const isMobile = /android|iphone|ipad|ipod|mobile|opera mini|iemobile/i.test(navigator.userAgent);
    if (isMobile) {
      window.location.href = `tel:${telNumber}`;
      return;
    }

    navigator.clipboard.writeText(phoneNumber).then(() => {
      (window as any).__toast && (window as any).__toast(`Номер скопирован: ${phoneNumber}`);
    }).catch(() => {
      (window as any).__toast && (window as any).__toast('Не удалось скопировать номер');
    });
  };

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <div className="logo">
              <img src="/assets/logo.png" alt="Логотип НОВЫЙ" className="footer-logo" />
            </div>
            <p>Современный торгово-бытовой центр в Бронницах</p>
          </div>
          
          <div className="footer-section">
            <h4>Контакты</h4>
            <div className="contact-item">
              <Phone size={18} />
              <button
                type="button"
                className="phone-link"
                onClick={() => handlePhoneClick('+7 901 524-18-48')}
                aria-label="Позвонить по номеру +7 901 524-18-48"
              >
                +7 901 524-18-48
              </button>
            </div>
            <div className="contact-item">
              <MapPin size={18} />
              <span>г. Бронницы</span>
            </div>
            <div className="contact-item">
              <Clock size={18} />
              <span>с 9:00 до 20:00</span>
            </div>
          </div>
          
          <div className="footer-section">
            <h4>Навигация</h4>
            <ul className="footer-nav">
              <li><Link to="/">Главная</Link></li>
              <li><Link to="/tenants">Арендаторы</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="footer-bottom" />
      </div>
    </footer>
  );
};

export default Footer;
