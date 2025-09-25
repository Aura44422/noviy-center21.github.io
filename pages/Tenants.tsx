import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Phone, ZoomIn, X, Building, Ruler, Home, Car, Navigation, Users, Store, Flame, Zap, Thermometer, Wind, Shield, Truck } from 'lucide-react';
import './Tenants.css';

interface BuildingStat {
  icon: string;
  title: string;
  value: string;
}

interface Tenant {
  name: string;
  company: string;
  phone: string;
}

interface GalleryImage {
  src: string;
  alt: string;
}

interface AvailableSpace {
  title: string;
  count: string;
  benefits: string[];
}

interface Infrastructure {
  icon: string;
  title: string;
  description: string;
}

interface LocationBenefit {
  icon: string;
  title: string;
  description: string;
}

const Tenants: React.FC = () => {
  const assetPath = (p: string) => `${import.meta.env.BASE_URL}${p.replace(/^\//, '')}`;
  const [currentTenantsSlide, setCurrentTenantsSlide] = useState(0);
  const [isFloorPlanModalOpen, setIsFloorPlanModalOpen] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isMapInteractive, setIsMapInteractive] = useState(false);
  const mapDeactivateTimerRef = useRef<number | null>(null);
  const [userInteracted, setUserInteracted] = useState(false);
  const carouselTimerRef = useRef<number | null>(null);
  const idleTimerRef = useRef<number | null>(null);

  const buildingStats: BuildingStat[] = [
    {
      icon: 'business',
      title: 'Общая площадь',
      value: '5000м²'
    },
    {
      icon: 'height',
      title: 'Высота потолков',
      value: '6м'
    },
    {
      icon: 'home',
      title: 'Тип здания',
      value: 'Одноэтажное с открытой планировкой'
    },
    {
      icon: 'local_parking',
      title: 'Парковка',
      value: '160 мест'
    }
  ];

  const tenants: Tenant[] = [
    {
      name: 'Магазин "Шторы"',
      company: 'ИП Сафронова О.Л.',
      phone: '+7 (985) 066-15-01'
    },
    {
      name: 'Магазин "Краски.ру"',
      company: 'ООО "Технологии, ресурсы строительства"',
      phone: '+7 (919) 764-86-57'
    },
    {
      name: 'Магазин электротоваров и крепежа',
      company: 'ИП Саргсян А.А.',
      phone: '+7 (926) 321-82-50'
    },
    {
      name: 'Магазин сантехники',
      company: 'ИП Парсян К.Л.',
      phone: '+7 (926) 561-82-92'
    },
    {
      name: 'Exist.ru ПВЗ Автозапчасти',
      company: 'ООО "АВТО ПРОФИ"',
      phone: '+7 (499) 136-58-44'
    },
    {
      name: 'Строительство каркасных домов',
      company: 'ИП Кокшаров А.В.',
      phone: '+7 (967) 227-01-11'
    },
    {
      name: 'Автозапчасти для ГАЗ',
      company: 'ИП Илюхин С.А.',
      phone: '+7 (903) 777-51-63'
    },
    {
      name: 'Салон мебели',
      company: 'ИП Очередниченко М.В.',
      phone: '+7 (901) 519-44-17'
    },
    {
      name: 'Сайдинг, профиль, направляющие',
      company: 'ИП Фролов А.В.',
      phone: '+7 (996) 051-85-55'
    },
    {
      name: 'Магазин "ВсеИнструменты.ру"',
      company: 'ООО "ВсеИнструменты.ру"',
      phone: '+7 (919) 772-85-75'
    },
    {
      name: 'Бани-бочки',
      company: 'ИП Калиничева М.В.',
      phone: '+7 (916) 297-65-04'
    },
    {
      name: 'Заборы, ограждения',
      company: 'ООО "МАСТЕРОВИТ РУФ"',
      phone: '+7 (917) 557-05-57'
    }
  ];

  const tenantsGalleryImages: GalleryImage[] = [
    {
      src: assetPath('assets/photoMAKET/WhatsApp Image 2025-08-17 at 20.41.26.jpeg'),
      alt: 'Наши арендаторы фото 1'
    },
    {
      src: assetPath('assets/photoMAKET/WhatsApp Image 2025-08-17 at 20.39.37.jpeg'),
      alt: 'Наши арендаторы фото 2'
    },
    {
      src: assetPath('assets/photoMAKET/WhatsApp Image 2025-08-17 at 20.40.39.jpeg'),
      alt: 'Наши арендаторы фото 3'
    },
    {
      src: assetPath('assets/photoMAKET/WhatsApp Image 2025-08-17 at 20.42.36.jpeg'),
      alt: 'Наши арендаторы фото 4'
    },
    {
      src: assetPath('assets/photoMAKET/WhatsApp Image 2025-08-17 at 20.11.54.jpeg'),
      alt: 'Наши арендаторы фото 5'
    },
    {
      src: assetPath('assets/photoMAKET/WhatsApp Image 2025-08-17 at 20.10.42.jpeg'),
      alt: 'Наши арендаторы фото 6'
    },
    {
      src: assetPath('assets/photoMAKET/WhatsApp Image 2025-08-17 at 20.09.03.jpeg'),
      alt: 'Наши арендаторы фото 7'
    },
    {
      src: assetPath('assets/photoMAKET/WhatsApp Image 2025-08-17 at 20.07.47 (1).jpeg'),
      alt: 'Наши арендаторы фото 8'
    },
    {
      src: assetPath('assets/photoMAKET/WhatsApp Image 2025-08-17 at 20.06.09.jpeg'),
      alt: 'Наши арендаторы фото 9'
    }
  ];

  const availableSpaces: AvailableSpace[] = [
    {
      title: 'Помещения 50.5 м²',
      count: 'Множество единиц',
      benefits: [
        'Идеально для розничной торговли',
        'Высокая проходимость',
        'Современная отделка',
        'Готовность к работе'
      ]
    },
    {
      title: 'Помещения 101 м²',
      count: '5 единиц',
      benefits: [
        'Средний размер',
        'Подходит для услуг',
        'Удобное расположение',
        'Отдельный вход'
      ]
    },
    {
      title: 'Помещения 151,5 м²',
      count: '20 единиц',
      benefits: [
        'Расширенное пространство',
        'Универсальное использование',
        'Выгодная цена',
        'Быстрый старт'
      ]
    }
  ];

  const infrastructure: Infrastructure[] = [
    {
      icon: 'whatshot',
      title: 'Газовая котельная',
      description: 'Мощность 1000 кВт'
    },
    {
      icon: 'bolt',
      title: 'Электрическая мощность',
      description: '1260 кВт'
    },
    {
      icon: 'device_thermostat',
      title: 'Отопление и ГВС',
      description: 'Полное обеспечение'
    },
    {
      icon: 'air',
      title: 'Вентиляция',
      description: 'Современная система'
    },
    {
      icon: 'shield',
      title: 'Безопасность',
      description: 'АПСТ, пожарная сигнализация'
    },
    {
      icon: 'local_shipping',
      title: 'Дебаркадеры',
      description: '2 автоматических погрузчика'
    }
  ];

  const locationBenefits: LocationBenefit[] = [
    {
      icon: 'directions_car',
      title: '40,000 машин в сутки',
      description: 'Высокий автомобильный поток'
    },
    {
      icon: 'people',
      title: '25,000 жителей',
      description: 'Население города Бронницы'
    },
    {
      icon: 'store',
      title: 'Гипермаркет рядом',
      description: 'Дополнительный поток клиентов'
    }
  ];

  const getIconComponent = (iconName: string) => {
    const iconMap: { [key: string]: React.ComponentType<any> } = {
      business: Building,
      height: Ruler,
      home: Home,
      local_parking: Car,
      directions_car: Navigation,
      people: Users,
      store: Store,
      whatshot: Flame,
      bolt: Zap,
      device_thermostat: Thermometer,
      air: Wind,
      shield: Shield,
      local_shipping: Truck
    };
    return iconMap[iconName] || Building;
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

  const scrollToCta = () => {
    const el = document.getElementById('cta');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const nextTenantsSlide = (manual: boolean = false) => {
    if (manual) markUserInteraction();
    setCurrentTenantsSlide(prev => prev < tenantsGalleryImages.length - 1 ? prev + 1 : 0);
  };

  const previousTenantsSlide = (manual: boolean = false) => {
    if (manual) markUserInteraction();
    setCurrentTenantsSlide(prev => prev > 0 ? prev - 1 : tenantsGalleryImages.length - 1);
  };

  const goToTenantsSlide = (index: number, manual: boolean = false) => {
    if (manual) markUserInteraction();
    setCurrentTenantsSlide(index);
  };

  const startTenantsCarousel = () => {
    stopTenantsCarousel();
    
    if (tenantsGalleryImages.length === 0) return;
    if (currentTenantsSlide >= tenantsGalleryImages.length) {
      setCurrentTenantsSlide(0);
    }
    
    carouselTimerRef.current = setInterval(() => {
      if (!isPaused && !document.hidden) {
        nextTenantsSlide();
      }
    }, 5000);
  };

  const stopTenantsCarousel = () => {
    if (carouselTimerRef.current) {
      clearInterval(carouselTimerRef.current);
      carouselTimerRef.current = null;
    }
  };

  const pauseTenantsCarousel = () => {
    setIsPaused(true);
    if (idleTimerRef.current) {
      clearTimeout(idleTimerRef.current);
      idleTimerRef.current = null;
    }
  };

  const resumeTenantsCarousel = () => {
    if (!userInteracted) {
      setIsPaused(false);
    }
  };

  const markUserInteraction = () => {
    setUserInteracted(true);
    stopTenantsCarousel();
    if (idleTimerRef.current) {
      clearTimeout(idleTimerRef.current);
      idleTimerRef.current = null;
    }
  };

  const handleTouchStart = () => {
    pauseTenantsCarousel();
  };

  const handleTouchEnd = () => {
    if (!userInteracted) {
      resumeTenantsCarousel();
    }
  };

  const openFloorPlanModal = () => {
    setIsFloorPlanModalOpen(true);
  };

  const closeFloorPlanModal = () => {
    setIsFloorPlanModalOpen(false);
  };

  useEffect(() => {
    if (!userInteracted) {
      startTenantsCarousel();
    }
    
    const handleVisibilityChange = () => {
      if (document.hidden) {
        pauseTenantsCarousel();
      } else {
        resumeTenantsCarousel();
        if (!userInteracted) {
          startTenantsCarousel();
        }
      }
    };

    const handleWindowFocus = () => {
      if (!userInteracted) {
        resumeTenantsCarousel();
        startTenantsCarousel();
      }
    };

    const handleWindowBlur = () => {
      pauseTenantsCarousel();
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleWindowFocus);
    window.addEventListener('blur', handleWindowBlur);

    return () => {
      stopTenantsCarousel();
      if (idleTimerRef.current) {
        clearTimeout(idleTimerRef.current);
      }
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleWindowFocus);
      window.removeEventListener('blur', handleWindowBlur);
    };
  }, [userInteracted]);

  // Auto-deactivate map interactivity on mobile after inactivity
  useEffect(() => {
    if (!isMapInteractive) {
      if (mapDeactivateTimerRef.current) {
        clearTimeout(mapDeactivateTimerRef.current);
        mapDeactivateTimerRef.current = null;
      }
      return;
    }

    mapDeactivateTimerRef.current = window.setTimeout(() => {
      setIsMapInteractive(false);
      mapDeactivateTimerRef.current = null;
    }, 10000);

    return () => {
      if (mapDeactivateTimerRef.current) {
        clearTimeout(mapDeactivateTimerRef.current);
        mapDeactivateTimerRef.current = null;
      }
    };
  }, [isMapInteractive]);

  return (
    <div className="tenants">
      {/* Page Header */}
      <section className="page-header">
        <div className="container">
          <div className="header-card">
            <h1>Аренда помещений</h1>
            <p>Выберите идеальное помещение для вашего бизнеса</p>
          </div>
        </div>
      </section>

      {/* Building Info */}
      <section className="building-info-section">
        <div className="container">
          <div className="building-stats">
            {buildingStats.map((stat, index) => (
              <div key={index} className="stat-card">
                <div className="stat-content">
                  <div className="stat-text">
                    <h4>{stat.title}</h4>
                    <div className="stat-value">{stat.value}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Tenants */}
      <section className="tenants-section">
        <div className="container">
          <h2 className="section-title">Наши арендаторы</h2>
          <div className="tenants-grid">
            {tenants.map((tenant, index) => (
              <div key={index} className="tenant-card">
                <div className="tenant-content">
                  <div className="tenant-main">
                    <h3>{tenant.name}</h3>
                    <p className="tenant-company">{tenant.company}</p>
                  </div>
                  <div className="tenant-contact">
                    <button 
                      className="phone-btn"
                      onClick={() => handlePhoneClick(tenant.phone)}
                    >
                      <Phone size={20} />
                      <span>{tenant.phone}</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tenants Gallery */}
      <section className="tenants-gallery-section">
        <div className="gallery-container">
          <div className="gallery-card">
            <h2 className="gallery-title">Фотогалерея арендаторов</h2>
            <div 
              className="carousel-container"
              onMouseEnter={pauseTenantsCarousel}
              onMouseLeave={resumeTenantsCarousel}
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            >
              <div 
                className="carousel-track"
                style={{ transform: `translateX(-${currentTenantsSlide * 100}%)` }}
              >
                {tenantsGalleryImages.map((image, i) => (
                  <div 
                    key={i} 
                    className={`carousel-slide ${i === currentTenantsSlide ? 'active' : ''}`}
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
                onClick={() => previousTenantsSlide(true)}
                disabled={currentTenantsSlide === 0}
              >
                <ChevronLeft size={24} />
              </button>
              <button 
                className="carousel-btn next" 
                onClick={() => nextTenantsSlide(true)}
                disabled={currentTenantsSlide === tenantsGalleryImages.length - 1}
              >
                <ChevronRight size={24} />
              </button>
              <div className="carousel-dots">
                {tenantsGalleryImages.map((_, i) => (
                  <button 
                    key={i}
                    className={`dot-btn ${i === currentTenantsSlide ? 'active' : ''}`}
                    onClick={() => goToTenantsSlide(i, true)}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Available Spaces */}
      <section className="spaces-section">
        <div className="container">
          <h2 className="section-title">Доступные помещения</h2>
          <div className="spaces-grid">
            {availableSpaces.map((space, index) => (
              <div key={index} className="space-card">
                <div className="space-header">
                  <h3 className="space-title">{space.title}</h3>
                  <div className="space-count">{space.count}</div>
                </div>
                <div className="space-content">
                  <ul className="space-benefits">
                    {space.benefits.map((benefit, i) => (
                      <li key={i}>{benefit}</li>
                    ))}
                  </ul>
                </div>
                <div className="space-actions">
                  <button 
                    className="space-btn"
                    onClick={scrollToCta}
                  >
                    <span>Узнать цену</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Floor Plan */}
      <section className="floor-plan-section">
        <div className="container">
          <h2 className="section-title">Планировка</h2>
          <div className="floor-plan-card">
            <div className="floor-plan-container" onClick={openFloorPlanModal}>
              <img 
                src={assetPath('assets/photoMAKET/Screenshot_2.png')} 
                alt="Планировка торгового центра" 
                className="floor-plan-image"
              />
              <button className="zoom-btn" onClick={openFloorPlanModal}>
                <ZoomIn size={24} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Infrastructure */}
      <section className="infrastructure-section">
        <div className="container">
          <h2 className="section-title">Инженерная инфраструктура</h2>
          <div className="infrastructure-grid">
            {infrastructure.map((infra, index) => (
              <div key={index} className="infra-card">
                <div className="infra-content">
                  <div className="infra-text">
                    <h3>{infra.title}</h3>
                    <p>{infra.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Location */}
      <section className="location-section">
        <div className="container">
          <div className="location-card">
            <div className="location-content">
              <div className="location-text">
                <h2>Удобное расположение</h2>
                <p>
                  Торгово-бытовой центр «НОВЫЙ» расположен в стратегически важной точке на пересечении автодороги А-107 (ММК) и федеральной трассы М5 «Урал». Это обеспечивает:
                </p>
                <div className="location-benefits">
                  {locationBenefits.map((benefit, index) => {
                    const IconComponent = getIconComponent(benefit.icon);
                    return (
                      <div key={index} className="benefit-item">
                        <div className="benefit-icon">
                          <IconComponent size={40} />
                        </div>
                        <div className="benefit-text">
                          <h3>{benefit.title}</h3>
                          <p>{benefit.description}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="location-map">
                <div className={`map-embed ${isMapInteractive ? 'active' : ''}`}>
                  <iframe
                    src="https://yandex.ru/map-widget/v1/?text=%D0%91%D1%80%D0%BE%D0%BD%D0%BD%D0%B8%D1%86%D1%8B%2C%20%D0%9A%D0%B0%D1%88%D0%B8%D1%80%D1%81%D0%BA%D0%B8%D0%B9%20%D0%BF%D0%B5%D1%80.%2068&lang=ru_RU&z=16"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    allowFullScreen
                  />
                  {/* Mobile-only activation button */}
                  {!isMapInteractive && (
                    <button 
                      type="button"
                      className="map-activate-btn"
                      onClick={() => setIsMapInteractive(true)}
                      aria-label="Активировать карту"
                    >
                      Активировать карту
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="contact-cta-section" id="cta">
        <div className="container">
          <div className="cta-card">
            <div className="cta-content">
              <h2>Готовы начать бизнес?</h2>
              <p>Свяжитесь с нами для получения подробной информации о доступных помещениях и условиях аренды</p>
              <div className="cta-contact">
                <button 
                  className="cta-btn"
                  onClick={() => handlePhoneClick('8 (496) 464-44-04')}
                >
                  <Phone size={20} />
                  <span>8 (496) 464-44-04</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Floor Plan Modal */}
      <div 
        className={`floor-plan-modal ${isFloorPlanModalOpen ? 'open' : ''}`}
        onClick={closeFloorPlanModal}
      >
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <button className="modal-close" onClick={closeFloorPlanModal}>
            <X size={24} />
          </button>
          <img 
            src={assetPath('assets/photoMAKET/Screenshot_2.png')} 
            alt="Планировка торгового центра" 
            className="modal-image"
          />
        </div>
      </div>
    </div>
  );
};

export default Tenants;
