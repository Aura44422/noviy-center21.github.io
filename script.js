// Mobile Menu Toggle
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const nav = document.querySelector('.nav');
    
    if (mobileMenuToggle && nav) {
        mobileMenuToggle.addEventListener('click', function() {
            nav.classList.toggle('active');
            mobileMenuToggle.classList.toggle('active');
        });
    }
    
    // Close mobile menu when clicking on a link
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            nav.classList.remove('active');
            mobileMenuToggle.classList.remove('active');
        });
    });
});

// Smooth scrolling for anchor links
document.addEventListener('DOMContentLoaded', function() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
});

// Form submission handling
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.querySelector('.contact-form form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const name = this.querySelector('input[type="text"]').value;
            const phone = this.querySelector('input[type="tel"]').value;
            const email = this.querySelector('input[type="email"]').value;
            const message = this.querySelector('textarea').value;
            
            // Simple validation
            if (!name || !phone) {
                alert('Пожалуйста, заполните обязательные поля (имя и телефон)');
                return;
            }
            
            // Show success message
            alert('Спасибо! Ваша заявка отправлена. Мы свяжемся с вами в ближайшее время.');
            
            // Reset form
            this.reset();
        });
    }
});

// Intersection Observer for animations
document.addEventListener('DOMContentLoaded', function() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animatedElements = document.querySelectorAll('.feature-card, .space-card, .infrastructure-item, .stat, .gallery-item');
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// Header scroll effect
window.addEventListener('scroll', function() {
    const header = document.querySelector('.header');
    
    if (window.scrollY > 100) {
        header.style.background = 'rgba(255, 255, 255, 0.95)';
        header.style.backdropFilter = 'blur(10px)';
    } else {
        header.style.background = 'var(--white)';
        header.style.backdropFilter = 'none';
    }
});

// Working hours dynamic status removed per minimalistic header requirements

// Image lazy loading
document.addEventListener('DOMContentLoaded', function() {
    const images = document.querySelectorAll('img[src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                
                // Only apply lazy loading effect if image hasn't been loaded yet
                if (!img.complete) {
                    img.style.opacity = '0';
                    img.style.transition = 'opacity 0.3s ease';
                    
                    img.onload = function() {
                        img.style.opacity = '1';
                    };
                }
                
                observer.unobserve(img);
            }
        });
    });
    
    images.forEach(img => {
        imageObserver.observe(img);
    });
});

// Counter animation for statistics
function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);
    
    // Get the unit if it exists
    const unitElement = element.querySelector('.unit');
    const unitText = unitElement ? unitElement.outerHTML : '';
    
    function updateCounter() {
        start += increment;
        if (start < target) {
            const formattedNumber = Math.floor(start).toLocaleString('ru-RU');
            element.innerHTML = formattedNumber + unitText;
            requestAnimationFrame(updateCounter);
        } else {
            const formattedTarget = target.toLocaleString('ru-RU');
            element.innerHTML = formattedTarget + unitText;
        }
    }
    
    updateCounter();
}

// Trigger counter animation when stats come into view
document.addEventListener('DOMContentLoaded', function() {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                const text = element.textContent;
                const number = parseFloat(text.replace(/[^\d.]/g, ''));
                
                if (!isNaN(number)) {
                    // Handle numbers with commas (like 40,000)
                    const cleanNumber = number.toString().replace(/,/g, '');
                    const finalNumber = parseFloat(cleanNumber);
                    animateCounter(element, finalNumber);
                }
                
                statsObserver.unobserve(element);
            }
        });
    }, { threshold: 0.5 });
    
    statNumbers.forEach(stat => {
        statsObserver.observe(stat);
    });
});

// Image Slider Functionality
document.addEventListener('DOMContentLoaded', function() {
    const slider = document.querySelector('.slider');
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    
    if (!slider || slides.length === 0) return;
    
    let currentSlide = 0;
    let autoPlayInterval;
    
    // Initialize slider
    function initSlider() {
        slides.forEach((slide, index) => {
            if (index === 0) {
                slide.classList.add('active');
            } else {
                slide.classList.remove('active');
            }
        });
        
        updateDots();
        startAutoPlay();
    }
    
    // Update dots
    function updateDots() {
        dots.forEach((dot, index) => {
            if (index === currentSlide) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    }
    
    // Go to specific slide
    function goToSlide(index) {
        if (index < 0) index = slides.length - 1;
        if (index >= slides.length) index = 0;
        
        // Remove active class from current slide
        slides[currentSlide].classList.remove('active');
        
        // Add prev class to current slide for animation
        slides[currentSlide].classList.add('prev');
        
        // Update current slide
        currentSlide = index;
        
        // Add active class to new slide
        slides[currentSlide].classList.add('active');
        slides[currentSlide].classList.remove('prev');
        
        updateDots();
    }
    
    // Next slide
    function nextSlide() {
        goToSlide(currentSlide + 1);
    }
    
    // Previous slide
    function prevSlide() {
        goToSlide(currentSlide - 1);
    }
    
    // Start autoplay
    function startAutoPlay() {
        autoPlayInterval = setInterval(nextSlide, 4000); // Change slide every 4 seconds
    }
    
    // Stop autoplay
    function stopAutoPlay() {
        if (autoPlayInterval) {
            clearInterval(autoPlayInterval);
        }
    }
    
    // Event listeners
    if (prevBtn) {
        prevBtn.addEventListener('click', function() {
            stopAutoPlay();
            prevSlide();
            startAutoPlay();
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', function() {
            stopAutoPlay();
            nextSlide();
            startAutoPlay();
        });
    }
    
    // Dot navigation
    dots.forEach((dot, index) => {
        dot.addEventListener('click', function() {
            stopAutoPlay();
            goToSlide(index);
            startAutoPlay();
        });
    });
    
    // Pause autoplay on hover
    slider.addEventListener('mouseenter', stopAutoPlay);
    slider.addEventListener('mouseleave', startAutoPlay);
    
    // Touch and Mouse Drag Support
    let touchStartX = 0;
    let touchEndX = 0;
    let mouseStartX = 0;
    let isDragging = false;
    let dragStartTime = 0;
    
    // Touch events for mobile
    slider.addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
        dragStartTime = Date.now();
    });
    
    slider.addEventListener('touchend', function(e) {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });
    
    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;
        const dragDuration = Date.now() - dragStartTime;
        
        if (Math.abs(diff) > swipeThreshold || (Math.abs(diff) > 20 && dragDuration < 300)) {
            if (diff > 0) {
                // Swipe left - next slide
                stopAutoPlay();
                nextSlide();
                startAutoPlay();
            } else {
                // Swipe right - previous slide
                stopAutoPlay();
                prevSlide();
                startAutoPlay();
            }
        }
    }
    
    // Mouse drag events for desktop
    slider.addEventListener('mousedown', function(e) {
        if (e.button !== 0) return; // Only left mouse button
        mouseStartX = e.clientX;
        isDragging = true;
        dragStartTime = Date.now();
        slider.style.cursor = 'grabbing';
        e.preventDefault();
    });
    
    slider.addEventListener('mousemove', function(e) {
        if (!isDragging) return;
        const currentX = e.clientX;
        const diff = mouseStartX - currentX;
        
        // Visual feedback during drag
        if (Math.abs(diff) > 10) {
            const offset = -currentSlide * 100 + (diff / slider.offsetWidth) * 100;
            slider.style.transform = `translateX(${offset}%)`;
        }
    });
    
    slider.addEventListener('mouseup', function(e) {
        if (!isDragging) return;
        isDragging = false;
        slider.style.cursor = 'grab';
        
        const diff = mouseStartX - e.clientX;
        const dragDuration = Date.now() - dragStartTime;
        
        if (Math.abs(diff) > 100 || (Math.abs(diff) > 50 && dragDuration < 500)) {
            if (diff > 0) {
                stopAutoPlay();
                nextSlide();
                startAutoPlay();
            } else {
                stopAutoPlay();
                prevSlide();
                startAutoPlay();
            }
        } else {
            // Reset to current position
            goToSlide(currentSlide);
        }
    });
    
    slider.addEventListener('mouseleave', function() {
        if (isDragging) {
            isDragging = false;
            slider.style.cursor = 'grab';
            goToSlide(currentSlide);
        }
    });
    
    // Set initial cursor
    slider.style.cursor = 'grab';
    
    // Initialize the slider
    initSlider();
    
    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowLeft') {
            stopAutoPlay();
            prevSlide();
            startAutoPlay();
        } else if (e.key === 'ArrowRight') {
            stopAutoPlay();
            nextSlide();
            startAutoPlay();
        }
    });
});

// Tenants Fullscreen Carousel (empty, ready for future photos)
document.addEventListener('DOMContentLoaded', function() {
    const tenantsCarousel = document.getElementById('tenantsCarousel');
    const homeCarousel = document.getElementById('homeCarousel');
    const carousels = [tenantsCarousel, homeCarousel].filter(Boolean);
    carousels.forEach((carousel) => initFullscreenCarousel(carousel));
});

function initFullscreenCarousel(carousel) {
    if (!carousel) return;

    const track = carousel.querySelector('.carousel-track');
    const prev = carousel.querySelector('.carousel-btn.prev');
    const next = carousel.querySelector('.carousel-btn.next');
    const dotsContainer = carousel.querySelector('.carousel-dots');
    const placeholder = carousel.querySelector('.carousel-placeholder');

    let slides = Array.from(carousel.querySelectorAll('.carousel-slide'));
    let currentIndex = 0;
    let autoplayTimer;

    function updateSlidesRefs() {
        slides = Array.from(carousel.querySelectorAll('.carousel-slide'));
    }

    function updateUI() {
        const total = slides.length;
        // Placeholder visible if no slides
        placeholder.style.display = total === 0 ? 'grid' : 'none';

        // Dots rebuild
        dotsContainer.innerHTML = '';
        for (let i = 0; i < total; i++) {
            const dot = document.createElement('button');
            dot.type = 'button';
            dot.setAttribute('role', 'tab');
            dot.setAttribute('aria-label', `Слайд ${i + 1}`);
            if (i === currentIndex) dot.setAttribute('aria-selected', 'true');
            dot.addEventListener('click', () => {
                stopAutoplay();
                goTo(i);
                startAutoplay();
            });
            dotsContainer.appendChild(dot);
        }

        // Track transform
        const offset = -currentIndex * 100;
        track.style.transform = `translateX(${offset}%)`;

        // Controls visibility
        const controlsVisible = total > 1;
        if (prev) prev.style.display = controlsVisible ? 'flex' : 'none';
        if (next) next.style.display = controlsVisible ? 'flex' : 'none';
        dotsContainer.style.display = controlsVisible ? 'flex' : 'none';
    }

    function goTo(index) {
        if (slides.length === 0) return;
        if (index < 0) index = slides.length - 1;
        if (index >= slides.length) index = 0;
        currentIndex = index;
        updateUI();
    }

    function nextSlide() { goTo(currentIndex + 1); }
    function prevSlide() { goTo(currentIndex - 1); }

    function startAutoplay() {
        if (slides.length <= 1) return;
        stopAutoplay();
        autoplayTimer = setInterval(nextSlide, 5000);
    }
    function stopAutoplay() {
        if (autoplayTimer) clearInterval(autoplayTimer);
    }

    // Buttons
    if (prev) prev.addEventListener('click', () => { stopAutoplay(); prevSlide(); startAutoplay(); });
    if (next) next.addEventListener('click', () => { stopAutoplay(); nextSlide(); startAutoplay(); });

    // Keyboard
    carousel.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') { stopAutoplay(); prevSlide(); startAutoplay(); }
        if (e.key === 'ArrowRight') { stopAutoplay(); nextSlide(); startAutoplay(); }
    });

    // Touch and Mouse Drag Support
    let touchStartX = 0;
    let touchEndX = 0;
    let mouseStartX = 0;
    let isDragging = false;
    let dragStartTime = 0;
    
    // Touch events for mobile
    carousel.addEventListener('touchstart', (e) => { 
        touchStartX = e.changedTouches[0].clientX; 
        dragStartTime = Date.now();
    }, { passive: true });
    
    carousel.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].clientX;
        const diff = touchStartX - touchEndX;
        const dragDuration = Date.now() - dragStartTime;
        
        if (Math.abs(diff) > 50 || (Math.abs(diff) > 20 && dragDuration < 300)) {
            stopAutoplay();
            if (diff > 0) nextSlide(); else prevSlide();
            startAutoplay();
        }
    });
    
    // Mouse drag events for desktop
    carousel.addEventListener('mousedown', (e) => {
        if (e.button !== 0) return; // Only left mouse button
        mouseStartX = e.clientX;
        isDragging = true;
        dragStartTime = Date.now();
        carousel.style.cursor = 'grabbing';
        e.preventDefault();
    });
    
    carousel.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        const currentX = e.clientX;
        const diff = mouseStartX - currentX;
        
        // Visual feedback during drag
        if (Math.abs(diff) > 10) {
            const offset = -currentIndex * 100 + (diff / carousel.offsetWidth) * 100;
            track.style.transform = `translateX(${offset}%)`;
        }
    });
    
    carousel.addEventListener('mouseup', (e) => {
        if (!isDragging) return;
        isDragging = false;
        carousel.style.cursor = 'grab';
        
        const diff = mouseStartX - e.clientX;
        const dragDuration = Date.now() - dragStartTime;
        
        if (Math.abs(diff) > 100 || (Math.abs(diff) > 50 && dragDuration < 500)) {
            stopAutoplay();
            if (diff > 0) nextSlide(); else prevSlide();
            startAutoplay();
        } else {
            // Reset to current position
            updateUI();
        }
    });
    
    carousel.addEventListener('mouseleave', () => {
        if (isDragging) {
            isDragging = false;
            carousel.style.cursor = 'grab';
            updateUI();
        }
    });
    
    // Set initial cursor
    carousel.style.cursor = 'grab';

    // Resize handler (in case of dynamic content)
    if (window.ResizeObserver) {
        const resizeObserver = new ResizeObserver(() => {
            updateSlidesRefs();
            updateUI();
        });
        resizeObserver.observe(track);
    }

    // Init
    updateSlidesRefs();
    updateUI();
    startAutoplay();
}

// Add CSS for mobile menu
const style = document.createElement('style');
style.textContent = `
    @media (max-width: 768px) {
        .nav {
            display: none;
            width: 100%;
            order: 3;
        }
        
        .nav.active {
            display: block;
        }
        
        .nav-list {
            background: var(--white);
            border-radius: 8px;
            box-shadow: var(--shadow);
            margin-top: 1rem;
        }
        
        .mobile-menu-toggle.active span:nth-child(1) {
            transform: rotate(45deg) translate(5px, 5px);
        }
        
        .mobile-menu-toggle.active span:nth-child(2) {
            opacity: 0;
        }
        
        .mobile-menu-toggle.active span:nth-child(3) {
            transform: rotate(-45deg) translate(7px, -6px);
        }
    }
`;
document.head.appendChild(style);

// Floor Plan Modal Functionality
document.addEventListener('DOMContentLoaded', function() {
    const zoomBtn = document.querySelector('.zoom-btn');
    const modal = document.getElementById('floorPlanModal');
    const modalClose = document.querySelector('.modal-close');
    
    if (zoomBtn && modal && modalClose) {
        zoomBtn.addEventListener('click', function() {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
        
        modalClose.addEventListener('click', function() {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        });
        
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                modal.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
        
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && modal.classList.contains('active')) {
                modal.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }
});

// Yandex Map Initialization
document.addEventListener('DOMContentLoaded', function() {
    const mapContainer = document.getElementById('yandex-map');
    
    if (mapContainer && typeof ymaps !== 'undefined') {
        ymaps.ready(function() {
            const map = new ymaps.Map('yandex-map', {
                center: [55.4215, 38.2644], // Координаты Бронниц
                zoom: 15,
                controls: ['zoomControl', 'fullscreenControl']
            });
            
            const placemark = new ymaps.Placemark([55.4215, 38.2644], {
                balloonContent: 'Торгово-бытовой центр "НОВЫЙ"<br>Г. Бронницы, Каширский пер. 68'
            }, {
                preset: 'islands#blackDotIcon',
                iconColor: '#000000'
            });
            
            map.geoObjects.add(placemark);
            
            map.behaviors.disable('scrollZoom');
            map.behaviors.disable('drag');
            
            // Hide controls in fullscreen mode
            map.events.add('fullscreenenter', function() {
                setTimeout(function() {
                    const fullscreenElements = document.querySelectorAll('[class*="route"], [class*="taxi"], [class*="create"], [class*="copyright"]');
                    fullscreenElements.forEach(function(el) {
                        el.style.display = 'none';
                        el.style.visibility = 'hidden';
                        el.style.opacity = '0';
                        el.style.pointerEvents = 'none';
                    });
                }, 100);
            });
        });
    }
});