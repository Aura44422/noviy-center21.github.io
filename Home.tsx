import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Phone, Building, Car, MapPin, Lightbulb, DoorOpen, Utensils, Shield, Truck, Navigation, Clock } from 'lucide-react';
import './Home.css';

interface Feature {
  icon: string;
  title: string;
  description: string;
}

interface GalleryImage {
  src: string;
  alt: string;
}

const Home: React.FC = () => {
  const assetPath = (p: string) => `${import.meta.env.BASE_URL}${p.replace(/^\//, '')}`;
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [userInteracted, setUserInteracted] = useState(false);
  const carouselTimerRef = useRef<number | null>(null);
  const idleTimerRef = useRef<number | null>(null);

  const features: Feature[] = [
    {
      icon: 'lightbulb',
      title: 'Современное освещение',
      description: 'Светодиодное освещение зала обеспечивает комфортную атмосферу для работы и покупок'
    },
    {
      icon: 'meeting_room',
      title: 'Удобные входы',
      description: 'Два центральных входа с автоматическими дверями для максимального комфорта'
    },
    {
      icon: 'restaurant',
      title: 'Зона под кафе',
      description: 'Двухэтажная зона под кафе для организации питания посетителей'
    },
    {
      icon: 'security',
      title: 'Безопасность',
      description: 'АПСТ, пожарная и охранная сигнализация, эвакуационные выходы'
    },
    {
      icon: 'local_shipping',
      title: 'Погрузка',
      description: 'Два автоматических дебаркадера для удобной погрузки товаров'
    },
    {
      icon: 'directions_car',
      title: 'Отдельный въезд',
      description: 'Отдельный въезд и выезд для беспрепятственного доступа'
    }
  ];

  const galleryImages: GalleryImage[] = [
    {
      src: assetPath('assets/photoMAKET/WhatsApp Image 2025-08-06 at 11.14.44.jpeg'),
      alt: 'Фотография центра 1'
    },
    {
      src: assetPath('assets/photoMAKET/WhatsApp Image 2025-08-06 at 11.14.46.jpeg'),
      alt: 'Фотография центра 2'
    },
    {
      src: assetPath('assets/photoMAKET/WhatsApp Image 2025-08-06 at 11.14.43.jpeg'),
      alt: 'Фотография центра 3'
    },
    {
      src: assetPath('assets/photoMAKET/WhatsApp Image 2025-08-06 at 11.14.45.jpeg'),
      alt: 'Фотография центра 4'
    }
  ];

  const getIconComponent = (iconName: string) => {
    const iconMap: { [key: string]: React.ComponentType<any> } = {
      lightbulb: Lightbulb,
      meeting_room: DoorOpen,
      restaurant: Utensils,
      security: Shield,
      local_shipping: Truck,
      directions_car: Navigation
    };
    return iconMap[iconName] || Lightbulb;
  };

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

  const smoothScrollTo = (selector: string) => {
    const target = document.querySelector(selector);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const nextSlide = (manual: boolean = false) => {
    if (manual) markUserInteraction();
    setCurrentSlide(prev => prev < galleryImages.length - 1 ? prev + 1 : 0);
  };

  const previousSlide = (manual: boolean = false) => {
    if (manual) markUserInteraction();
    setCurrentSlide(prev => prev > 0 ? prev - 1 : galleryImages.length - 1);
  };

  const goToSlide = (index: number, manual: boolean = false) => {
    if (manual) markUserInteraction();
    setCurrentSlide(index);
  };

  const startCarousel = () => {
    stopCarousel();
    
    if (galleryImages.length === 0) return;
    if (currentSlide >= galleryImages.length) {
      setCurrentSlide(0);
    }
    
    carouselTimerRef.current = setInterval(() => {
      if (!isPaused && !document.hidden) {
        nextSlide();
      }
    }, 5000);
  };

  const stopCarousel = () => {
    if (carouselTimerRef.current) {
      clearInterval(carouselTimerRef.current);
      carouselTimerRef.current = null;
    }
  };

  const pauseCarousel = () => {
    setIsPaused(true);
    if (idleTimerRef.current) {
      clearTimeout(idleTimerRef.current);
      idleTimerRef.current = null;
    }
  };

  const resumeCarousel = () => {
    if (!userInteracted) {
      setIsPaused(false);
    }
  };

  const markUserInteraction = () => {
    setUserInteracted(true);
    stopCarousel();
    if (idleTimerRef.current) {
      clearTimeout(idleTimerRef.current);
      idleTimerRef.current = null;
    }
  };

  const handleTouchStart = () => {
    pauseCarousel();
  };

  const handleTouchEnd = () => {
    // Resume after touch interaction
    if (!userInteracted) {
      resumeCarousel();
    }
  };

  useEffect(() => {
    if (!userInteracted) {
      startCarousel();
    }
    
    const handleVisibilityChange = () => {
      if (document.hidden) {
        pauseCarousel();
      } else {
        resumeCarousel();
        if (!userInteracted) {
          startCarousel();
        }
      }
    };

    const handleWindowFocus = () => {
      if (!userInteracted) {
        resumeCarousel();
        startCarousel();
      }
    };

    const handleWindowBlur = () => {
      pauseCarousel();
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleWindowFocus);
    window.addEventListener('blur', handleWindowBlur);

    return () => {
      stopCarousel();
      if (idleTimerRef.current) {
        clearTimeout(idleTimerRef.current);
      }
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleWindowFocus);
      window.removeEventListener('blur', handleWindowBlur);
    };
  }, [userInteracted]);

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="container">
            <div className="hero-text">
              <h1 className="hero-title">
                <span className="hero-line-one">Добро пожаловать</span>
                <span className="hero-line-two">в торгово-бытовой центр</span>
                <span className="hero-highlight">
                  <img src={assetPath('assets/logo-noviy.png')} alt="НОВЫЙ" className="hero-logo-image" />
                </span>
              </h1>
              <p className="hero-description">
                Современный торговый комплекс в самом сердце Бронниц. Здесь вы найдете все необходимое для комфортной жизни и успешного бизнеса.
              </p>
              <div className="hero-stats">
                <div className="stat-chip">
                  <Building size={18} />
                  <span>5000 м²</span>
                </div>
                <div className="stat-chip">
                  <Car size={18} />
                  <span>160 мест</span>
                </div>
                <div className="stat-chip">
                  <MapPin size={18} />
                  <span>А-107 × М5</span>
                </div>
              </div>
              <div className="hero-actions">
                <button 
                  className="hero-btn-primary"
                  onClick={() => handlePhoneClick('8 (496) 464-44-04')}
                >
                  <Phone size={16} />
                  <span>8 (496) 464-44-04</span>
                </button>
                <button 
                  className="hero-btn-secondary"
                  onClick={() => smoothScrollTo('#about')}
                >
                  <span>Узнать больше</span>
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="hero-image">
          <img 
            src={assetPath('assets/photoMAKET/photo_2025-08-06_16-13-53 (1) (1).jpg')} 
            alt="Торгово-бытовой центр НОВЫЙ" 
            className="hero-main-image"
          />
        </div>
      </section>

      {/* About Section */}
      <section className="about-section" id="about">
        <div className="container">
          <div className="about-card">
            <div className="about-content">
              <div className="about-text">
                <h2>О нашем центре</h2>
                <p>
                  Торгово-бытовой центр «НОВЫЙ» — это современный комплекс, расположенный в стратегически важной точке на пересечении автодороги А-107 (ММК) и федеральной трассы М5 «Урал». Ежедневный автомобильный поток составляет 40,000 машин, что обеспечивает высокую проходимость и отличную видимость для вашего бизнеса.
                </p>
                <p>
                  Наша территория граничит с гипермаркетом крупной сети, что создает дополнительный поток клиентов. Население города Бронницы составляет 25,000 человек, а благодаря удобному расположению мы привлекаем покупателей из соседних городов.
                </p>
              </div>
              <div className="about-stats">
                <div className="stats-grid">
                  <div className="stat-card">
                    <div className="stat-number">5000<span className="unit">м²</span></div>
                    <div className="stat-label">общая площадь</div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-number">6<span className="unit">м</span></div>
                    <div className="stat-label">высота потолков</div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-number">160</div>
                    <div className="stat-label">парковочных мест</div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-number">40,000</div>
                    <div className="stat-label">машин в сутки</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <h2 className="section-title">Почему выбирают нас</h2>
          <div className="features-grid">
            {features.map((feature, index) => {
              const IconComponent = getIconComponent(feature.icon);
              return (
                <div key={index} className="feature-card">
                  <div className="feature-content">
                    <div className="feature-icon">
                      <IconComponent size={40} />
                    </div>
                    <h3>{feature.title}</h3>
                    <p>{feature.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="gallery-section">
        <div className="gallery-container">
          <div className="gallery-card">
            <h2 className="gallery-title">Фотографии центра</h2>
            <p className="gallery-description">Отдельный въезд и выезд для беспрепятственного доступа</p>
            <div 
              className="carousel-container"
              onMouseEnter={pauseCarousel}
              onMouseLeave={resumeCarousel}
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            >
              <div 
                className="carousel-track"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                {galleryImages.map((image, i) => (
                  <div 
                    key={i} 
                    className={`carousel-slide ${i === currentSlide ? 'active' : ''}`}
                  >
                    <img 
                      src={image.src} 
                      alt={image.alt} 
                      className="carousel-image"
                      loading={i === 0 ? 'eager' : 'lazy'}
                    />
                  </div>
                ))}
              </div>
              <button 
                className="carousel-btn prev" 
                onClick={() => previousSlide(true)}
                disabled={currentSlide === 0}
              >
                <ChevronLeft size={24} />
              </button>
              <button 
                className="carousel-btn next" 
                onClick={() => nextSlide(true)}
                disabled={currentSlide === galleryImages.length - 1}
              >
                <ChevronRight size={24} />
              </button>
              <div className="carousel-dots">
                {galleryImages.map((_, i) => (
                  <button 
                    key={i}
                    className={`dot-btn ${i === currentSlide ? 'active' : ''}`}
                    onClick={() => goToSlide(i, true)}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="contact-section">
        <div className="container">
          <div className="contact-card">
            <div className="contact-content">
              <h2>Свяжитесь с нами</h2>
              <p>
                Готовы начать успешный бизнес в нашем центре? Мы ждем вас и готовы ответить на все вопросы!
              </p>
              <div className="contact-details">
                <div className="contact-item">
                  <Phone size={24} />
                  <div>
                    <strong>Телефон:</strong>
                    <button 
                      type="button"
                      className="phone-link"
                      onClick={() => handlePhoneClick('+7 901 524-18-48')}
                      aria-label="Позвонить по номеру +7 901 524-18-48"
                    >
                      +7 901 524-18-48
                    </button>
                  </div>
                </div>
                <div className="contact-item">
                  <MapPin size={24} />
                  <div>
                    <strong>Адрес:</strong>
                    <span>Г. Бронницы, Каширский пер. 68</span>
                  </div>
                </div>
                <div className="contact-item">
                  <Clock size={24} />
                  <div>
                    <strong>Режим работы:</strong>
                    <span>с 9:00 до 20:00, ежедневно</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
