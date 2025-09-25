import { useEffect, useRef, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Tenants from './pages/Tenants';
import './App.css';

function App() {
  const [toastText, setToastText] = useState<string | null>(null);
  const hideTimerRef = useRef<number | null>(null);

  useEffect(() => {
    (window as any).__toast = (text: string) => {
      // Always show a single toast: update text and extend lifetime
      setToastText(text);
      if (hideTimerRef.current) {
        window.clearTimeout(hideTimerRef.current);
      }
      hideTimerRef.current = window.setTimeout(() => {
        setToastText(null);
        hideTimerRef.current = null;
      }, 2200);
    };
  }, []);

  return (
    <Router>
      <div className="app">
        <ScrollToTop />
        <Header />
        <main className="main">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/tenants" element={<Tenants />} />
          </Routes>
        </main>
        <div className="toast-container">
          {toastText && <div className="toast">{toastText}</div>}
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;

// Scroll to top on mount and on route changes
function ScrollToTop() {
  const location = useLocation();

  // On first mount
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, []);

  // On route/pathname change
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [location.pathname, location.search]);

  return null;
}
