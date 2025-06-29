// Age Verification
document.addEventListener('DOMContentLoaded', function() {
    const ageModal = document.getElementById('ageModal');
    const confirmAgeBtn = document.getElementById('confirmAge');
    const leaveSiteBtn = document.getElementById('leaveSite');

    // Check if user has already confirmed age
    if (!localStorage.getItem('ageConfirmed')) {
        ageModal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }

    confirmAgeBtn.addEventListener('click', function() {
        localStorage.setItem('ageConfirmed', 'true');
        ageModal.style.display = 'none';
        document.body.style.overflow = 'auto';
        initAnimations();
    });

    leaveSiteBtn.addEventListener('click', function() {
        window.location.href = 'https://www.google.com';
    });
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Header scroll effect
window.addEventListener('scroll', function() {
    const header = document.querySelector('.header');
    if (window.scrollY > 100) {
        header.style.background = 'rgba(0, 0, 0, 0.95)';
    } else {
        header.style.background = 'rgba(0, 0, 0, 0.9)';
    }
});

// Intersection Observer for animations
function initAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('loading');
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animateElements = document.querySelectorAll('.about-content, .product-card, .feature, .contact-form');
    animateElements.forEach(el => {
        observer.observe(el);
    });
}

// Form handling
document.getElementById('contactForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const formData = new FormData(this);
    const data = Object.fromEntries(formData);
    
    // Validate form
    if (!validateForm(data)) {
        return;
    }
    
    // Show loading state
    const submitBtn = this.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Отправка...';
    submitBtn.disabled = true;
    
    // Simulate form submission (replace with actual endpoint)
    setTimeout(() => {
        showNotification('Заявка успешно отправлена! Мы свяжемся с вами в ближайшее время.', 'success');
        this.reset();
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }, 2000);
});

// Form validation
function validateForm(data) {
    const requiredFields = ['name', 'phone', 'email', 'city'];
    
    for (let field of requiredFields) {
        if (!data[field] || data[field].trim() === '') {
            showNotification(`Пожалуйста, заполните поле "${getFieldLabel(field)}"`, 'error');
            return false;
        }
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
        showNotification('Пожалуйста, введите корректный email адрес', 'error');
        return false;
    }
    
    // Phone validation
    const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
    if (!phoneRegex.test(data.phone)) {
        showNotification('Пожалуйста, введите корректный номер телефона', 'error');
        return false;
    }
    
    return true;
}

function getFieldLabel(fieldName) {
    const labels = {
        'name': 'Имя',
        'phone': 'Телефон',
        'email': 'Email',
        'city': 'Город/регион'
    };
    return labels[fieldName] || fieldName;
}

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
        color: white;
        padding: 15px 20px;
        border-radius: 5px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        z-index: 10000;
        max-width: 400px;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Close button functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    });
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// Add notification animations to CSS
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .notification-close {
        background: none;
        border: none;
        color: white;
        font-size: 20px;
        cursor: pointer;
        margin-left: 10px;
        padding: 0;
        line-height: 1;
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
`;
document.head.appendChild(notificationStyles);

// Parallax effect for hero section (mouse move, desktop only)
(function() {
    const heroImg = document.querySelector('.hero-image img');
    if (!heroImg) return;

    function handleParallax(e) {
        // Только для экранов шире 900px
        if (window.innerWidth < 900) {
            heroImg.style.transform = '';
            return;
        }
        const rect = heroImg.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const moveX = (e.clientX - centerX) / rect.width * 30; // max 30px
        const moveY = (e.clientY - centerY) / rect.height * 30;
        heroImg.style.transform = `translate(${moveX}px, ${moveY}px)`;
    }

    function resetParallax() {
        heroImg.style.transform = '';
    }

    window.addEventListener('mousemove', handleParallax);
    window.addEventListener('mouseleave', resetParallax);
    window.addEventListener('resize', resetParallax);
})();

// Product card hover effects
document.querySelectorAll('.product-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-10px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// Feature card animations
document.querySelectorAll('.feature').forEach(feature => {
    feature.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-5px)';
        this.style.borderColor = '#ff4444';
    });
    
    feature.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
        this.style.borderColor = '#333';
    });
});

// Form input focus effects
document.querySelectorAll('.form-group input, .form-group textarea').forEach(input => {
    input.addEventListener('focus', function() {
        this.parentElement.style.transform = 'scale(1.02)';
    });
    
    input.addEventListener('blur', function() {
        this.parentElement.style.transform = 'scale(1)';
    });
});

// Initialize animations if age is already confirmed
if (localStorage.getItem('ageConfirmed')) {
    initAnimations();
}

// Mobile menu toggle (for future mobile menu implementation)
function toggleMobileMenu() {
    const navMenu = document.querySelector('.nav-menu');
    navMenu.classList.toggle('active');
}

// Мобильное меню-гамбургер
function openMobileMenu() {
    document.getElementById('mobileMenuOverlay').classList.add('active');
    document.getElementById('mobileMenuBtn').classList.add('hide');
    document.body.style.overflow = 'hidden';
}
function closeMobileMenu() {
    document.getElementById('mobileMenuOverlay').classList.remove('active');
    document.getElementById('mobileMenuBtn').classList.remove('hide');
    document.body.style.overflow = '';
}

document.getElementById('mobileMenuBtn').addEventListener('click', openMobileMenu);
document.getElementById('mobileMenuClose').addEventListener('click', closeMobileMenu);
// Закрытие по клику вне меню
window.addEventListener('click', function(e) {
    const overlay = document.getElementById('mobileMenuOverlay');
    if (overlay.classList.contains('active') && e.target === overlay) {
        closeMobileMenu();
    }
});

// Скролл к секции с формой по клику на feature
function scrollToContact(e) {
    const target = document.querySelector('#contact');
    if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}
document.querySelectorAll('.scroll-to-contact').forEach(el => {
    el.addEventListener('click', scrollToContact);
});

// Product Modal Functionality
document.addEventListener('DOMContentLoaded', function() {
    const productModal = document.getElementById('productModal');
    const productModalImage = document.getElementById('productModalImage');
    const productModalClose = document.getElementById('productModalClose');
    const productCards = document.querySelectorAll('.product-card');

    // Open modal when clicking on product card
    productCards.forEach(card => {
        card.addEventListener('click', function(e) {
            // Don't open modal if clicking on the button inside card
            if (e.target.closest('.scroll-to-contact')) {
                return;
            }
            
            const productImage = this.querySelector('.product-image img');
            if (productImage) {
                productModalImage.src = productImage.src;
                productModalImage.alt = productImage.alt;
                productModal.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        });
    });

    // Close modal when clicking close button
    productModalClose.addEventListener('click', function() {
        closeProductModal();
    });

    // Close modal when clicking outside
    productModal.addEventListener('click', function(e) {
        if (e.target === productModal) {
            closeProductModal();
        }
    });

    // Close modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && productModal.classList.contains('active')) {
            closeProductModal();
        }
    });

    function closeProductModal() {
        productModal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
}); 