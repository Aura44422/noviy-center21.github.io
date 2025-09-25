import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Building, Menu, X } from 'lucide-react';
import './Header.css';

interface TimerState {
  hours: number;
  minutes: string;
  prefixText: string;
  state: 'open' | 'closingSoon' | 'closed' | 'openingSoon';
}

const Header: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [timer, setTimer] = useState<TimerState>({
    hours: 0,
    minutes: '00',
    prefixText: '',
    state: 'closed'
  });
  const location = useLocation();

  useEffect(() => {
    const updateBusinessTimer = () => {
      // Get current UTC time
      const nowUtc = new Date();
      
      // Convert to Moscow time (UTC+3) - always consistent
      const mskOffset = 3 * 60; // 3 hours in minutes
      const nowMsk = new Date(nowUtc.getTime() + mskOffset * 60 * 1000);
      
      const hours = nowMsk.getUTCHours();
      
      const openHourMsk = 9;   // 09:00 MSK
      const closeHourMsk = 20; // 20:00 MSK
      const isOpen = hours >= openHourMsk && hours < closeHourMsk;
      
      let targetMsk: Date;
      if (isOpen) {
        // Today at close time (20:00 MSK)
        targetMsk = new Date(Date.UTC(nowMsk.getUTCFullYear(), nowMsk.getUTCMonth(), nowMsk.getUTCDate(), closeHourMsk, 0, 0));
      } else if (hours < openHourMsk) {
        // Today at open time (09:00 MSK)
        targetMsk = new Date(Date.UTC(nowMsk.getUTCFullYear(), nowMsk.getUTCMonth(), nowMsk.getUTCDate(), openHourMsk, 0, 0));
      } else {
        // Tomorrow at open time (09:00 MSK)
        const tomorrow = new Date(nowMsk.getTime() + 24 * 60 * 60 * 1000);
        targetMsk = new Date(Date.UTC(tomorrow.getUTCFullYear(), tomorrow.getUTCMonth(), tomorrow.getUTCDate(), openHourMsk, 0, 0));
      }
      
      // Calculate difference in MSK time
      const diffMs = targetMsk.getTime() - nowMsk.getTime();
      const totalMinutes = Math.max(0, Math.floor(diffMs / (60 * 1000)));
      
      const hh = Math.floor(totalMinutes / 60);
      const mm = totalMinutes % 60;
      
      // Determine visual state
      let state: TimerState['state'];
      let prefixText: string;
      
      if (isOpen) {
        state = totalMinutes <= 30 ? 'closingSoon' : 'open';
        prefixText = 'закроется через';
      } else {
        state = totalMinutes <= 30 ? 'openingSoon' : 'closed';
        prefixText = 'откроется через';
      }
      
      setTimer({
        hours: hh,
        minutes: mm.toString().padStart(2, '0'),
        prefixText,
        state
      });
    };

    updateBusinessTimer();
    // Update every minute for precise MSK time display
    const timerId = setInterval(updateBusinessTimer, 60000);

    return () => {
      if (timerId) {
        clearInterval(timerId);
      }
    };
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="header-toolbar">
      <div className="header-content">
        <Link to="/" className="logo">
          <img src="/assets/logo.png" alt="Логотип НОВЫЙ" className="logo-icon" />
        </Link>
        
        <nav className="nav">
          <Link 
            to="/" 
            className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
          >
            <Home size={19} />
            <span>Главная</span>
          </Link>
          <Link 
            to="/tenants" 
            className={`nav-link ${location.pathname === '/tenants' ? 'active' : ''}`}
          >
            <Building size={19} />
            <span>Арендаторы</span>
          </Link>
        </nav>
        
        <div className="header-contact">
          <div className={`working-hours ${timer.state}`}>
            <div className="timer">
              <div className="timer-prefix">{timer.prefixText}</div>
              <div className="timer-row">
                <span className="timer-hours">{timer.hours}</span>
                <span className="timer-label">ч.</span>
                <span className="timer-colon" aria-hidden="true">:</span>
                <span className="timer-minutes">{timer.minutes}</span>
                <span className="timer-label">мин.</span>
              </div>
            </div>
          </div>
        </div>
        
        <button className="mobile-menu-toggle" onClick={toggleMobileMenu}>
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
      
      {/* Mobile Menu */}
      <div className={`mobile-menu ${isMobileMenuOpen ? 'open' : ''}`}>
        <Link 
          to="/" 
          className={`mobile-nav-link ${location.pathname === '/' ? 'active' : ''}`}
          onClick={closeMobileMenu}
        >
          <Home size={19} />
          <span>Главная</span>
        </Link>
        <Link 
          to="/tenants" 
          className={`mobile-nav-link ${location.pathname === '/tenants' ? 'active' : ''}`}
          onClick={closeMobileMenu}
        >
          <Building size={19} />
          <span>Арендаторы</span>
        </Link>
        <div className="mobile-contact">
          <div className={`working-hours ${timer.state}`}>
            <div className="timer">
              <div className="timer-prefix">{timer.prefixText}</div>
              <div className="timer-row">
                <span className="timer-hours">{timer.hours}</span>
                <span className="timer-label">ч.</span>
                <span className="timer-colon" aria-hidden="true">:</span>
                <span className="timer-minutes">{timer.minutes}</span>
                <span className="timer-label">мин.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
