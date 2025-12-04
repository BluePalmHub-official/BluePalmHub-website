/* ===================================
   BluePalm Hub - Interactive Features
   ================================== */

// ===================================
// EmailJS Initialization
// ===================================
(function() {
    emailjs.init(KV-gWgjVQpnHZiRVi);  // REPLACE with your actual EmailJS public key
})();

// ===================================
// Navigation Functionality
// ===================================

/**
 * Mobile Navigation Toggle
 */
const mobileToggle = document.getElementById('mobileToggle');
const navMenu = document.getElementById('navMenu');

if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        mobileToggle.classList.toggle('active');
    });
    
    // Close mobile menu when clicking on a link
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            mobileToggle.classList.remove('active');
        });
    });
}

/**
 * Navbar Scroll Effect
 */
const navbar = document.getElementById('navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    // Add scrolled class for shadow effect
    if (currentScroll > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    lastScroll = currentScroll;
});

/**
 * Active Navigation Link Based on Scroll Position
 */
const sections = document.querySelectorAll('section[id]');
const navLinksForScroll = document.querySelectorAll('.nav-link');

function updateActiveNavLink() {
    const scrollPosition = window.pageYOffset + 100;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            navLinksForScroll.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

window.addEventListener('scroll', updateActiveNavLink);

// ===================================
// Smooth Scrolling
// ===================================

/**
 * Smooth scroll to section on anchor click
 */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        
        // Check if href is just '#' or an actual section
        if (href === '#' || href === '#contact' || href === '#home' || href === '#about' || href === '#services' || href === '#products' || href === '#portfolio') {
            e.preventDefault();
            
            const targetId = href.substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                const navbarHeight = navbar.offsetHeight;
                const targetPosition = targetSection.offsetTop - navbarHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            } else if (href === '#') {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            }
        }
    });
});

// ===================================
// Back to Top Button
// ===================================

const backToTopButton = document.getElementById('backToTop');

if (backToTopButton) {
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            backToTopButton.classList.add('show');
        } else {
            backToTopButton.classList.remove('show');
        }
    });
    
    backToTopButton.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ===================================
// Contact Form Validation & Submission
// ===================================

const contactForm = document.getElementById('contactForm');

if (contactForm) {
    const formFields = {
        name: document.getElementById('name'),
        email: document.getElementById('email'),
        projectType: document.getElementById('projectType'),
        message: document.getElementById('message')
    };
    
    const errorElements = {
        name: document.getElementById('nameError'),
        email: document.getElementById('emailError'),
        projectType: document.getElementById('projectTypeError'),
        message: document.getElementById('messageError')
    };
    
    const formSuccess = document.getElementById('formSuccess');
    
    /**
     * Validate individual field
     */
    function validateField(fieldName, value) {
        let isValid = true;
        let errorMessage = '';
        
        switch(fieldName) {
            case 'name':
                if (value.trim().length < 2) {
                    isValid = false;
                    errorMessage = 'Please enter your full name (at least 2 characters)';
                }
                break;
                
            case 'email':
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(value)) {
                    isValid = false;
                    errorMessage = 'Please enter a valid email address';
                }
                break;
                
            case 'projectType':
                if (!value) {
                    isValid = false;
                    errorMessage = 'Please select a project type';
                }
                break;
                
            case 'message':
                if (value.trim().length < 10) {
                    isValid = false;
                    errorMessage = 'Please provide more details about your project (at least 10 characters)';
                }
                break;
        }
        
        return { isValid, errorMessage };
    }
    
    /**
     * Display error message
     */
    function showError(fieldName, message) {
        const field = formFields[fieldName];
        const errorElement = errorElements[fieldName];
        
        field.classList.add('error');
        errorElement.textContent = message;
        errorElement.classList.add('show');
    }
    
    /**
     * Clear error message
     */
    function clearError(fieldName) {
        const field = formFields[fieldName];
        const errorElement = errorElements[fieldName];
        
        field.classList.remove('error');
        errorElement.textContent = '';
        errorElement.classList.remove('show');
    }
    
    /**
     * Real-time validation on blur
     */
    Object.keys(formFields).forEach(fieldName => {
        const field = formFields[fieldName];
        
        field.addEventListener('blur', () => {
            const { isValid, errorMessage } = validateField(fieldName, field.value);
            
            if (!isValid) {
                showError(fieldName, errorMessage);
            } else {
                clearError(fieldName);
            }
        });
        
        // Clear error on input
        field.addEventListener('input', () => {
            if (field.classList.contains('error')) {
                clearError(fieldName);
            }
        });
    });
    
    /**
     * Form submission handler with EmailJS
     */
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Clear previous success message
        formSuccess.classList.remove('show');
        
        // Validate all fields
        let formIsValid = true;
        
        Object.keys(formFields).forEach(fieldName => {
            const field = formFields[fieldName];
            const { isValid, errorMessage } = validateField(fieldName, field.value);
            
            if (!isValid) {
                showError(fieldName, errorMessage);
                formIsValid = false;
            } else {
                clearError(fieldName);
            }
        });
        
        // If form is valid, send via EmailJS
        if (formIsValid) {
            const submitButton = contactForm.querySelector('button[type="submit"]');
            const originalButtonText = submitButton.textContent;
            submitButton.disabled = true;
            submitButton.textContent = 'Sending...';
            
            // Send email using EmailJS
            emailjs.sendForm(service_kguv03s, template_g7i4wwj, contactForm)
                .then(function(response) {
                    console.log('SUCCESS!', response.status, response.text);
                    
                    // Show success message
                    formSuccess.classList.add('show');
                    
                    // Reset form
                    contactForm.reset();
                    
                    // Re-enable submit button
                    submitButton.disabled = false;
                    submitButton.textContent = originalButtonText;
                    
                    // Scroll to success message
                    formSuccess.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                    
                    // Hide success message after 10 seconds
                    setTimeout(() => {
                        formSuccess.classList.remove('show');
                    }, 10000);
                    
                }, function(error) {
                    console.log('FAILED...', error);
                    
                    // Show error alert
                    alert('Sorry, there was an error sending your message. Please email us directly at dennis.quijano@bluepalmhub.com');
                    
                    // Re-enable submit button
                    submitButton.disabled = false;
                    submitButton.textContent = originalButtonText;
                });
                
        } else {
            // Scroll to first error
            const firstError = document.querySelector('.form-group .error');
            if (firstError) {
                firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
    });
}

// ===================================
// Intersection Observer for Animations
// ===================================

/**
 * Animate elements when they come into view
 */
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const fadeInObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements that should fade in
const fadeElements = document.querySelectorAll('.service-card, .product-card, .value-card, .portfolio-item, .info-card');
fadeElements.forEach(element => {
    element.style.opacity = '0';
    element.style.transform = 'translateY(30px)';
    element.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
    fadeInObserver.observe(element);
});

// ===================================
// Dynamic Product Grid Hover Effects
// ===================================

const productCards = document.querySelectorAll('.product-card');

productCards.forEach(card => {
    card.addEventListener('mouseenter', function() {
        const image = this.querySelector('.product-placeholder');
        if (image) {
            image.style.transform = 'scale(1.05)';
            image.style.transition = 'transform 0.3s ease-out';
        }
    });
    
    card.addEventListener('mouseleave', function() {
        const image = this.querySelector('.product-placeholder');
        if (image) {
            image.style.transform = 'scale(1)';
        }
    });
});

// ===================================
// Service Card Interactions
// ===================================

const serviceCards = document.querySelectorAll('.service-card');

serviceCards.forEach(card => {
    card.addEventListener('mouseenter', function() {
        const icon = this.querySelector('.service-icon');
        if (icon) {
            icon.style.transform = 'rotate(5deg) scale(1.05)';
            icon.style.transition = 'transform 0.3s ease-out';
        }
    });
    
    card.addEventListener('mouseleave', function() {
        const icon = this.querySelector('.service-icon');
        if (icon) {
            icon.style.transform = 'rotate(0deg) scale(1)';
        }
    });
});

// ===================================
// Floating Cards Animation Enhancement
// ===================================

const floatingCards = document.querySelectorAll('.floating-card');

floatingCards.forEach((card, index) => {
    // Add slight rotation on hover
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-5px) rotate(2deg) scale(1.05)';
        this.style.transition = 'all 0.3s ease-out';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = '';
    });
});

// ===================================
// Statistics Counter Animation
// ===================================

/**
 * Animate counting numbers when they come into view
 */
function animateCounter(element, target, duration = 2000) {
    const start = 0;
    const increment = target / (duration / 16); // 60fps
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = formatNumber(target);
            clearInterval(timer);
        } else {
            element.textContent = formatNumber(Math.floor(current));
        }
    }, 16);
}

function formatNumber(num) {
    // Handle special formats like "99.9%" or "24/7"
    const text = num.toString();
    if (text.includes('%') || text.includes('/')) {
        return text;
    }
    // Add commas for thousands
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

// Observe stat numbers for counter animation
const statObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
            const text = entry.target.textContent.trim();
            
            // Extract number from text (handle %, K+, etc.)
            const numberMatch = text.match(/\d+/);
            if (numberMatch) {
                const number = parseInt(numberMatch[0]);
                entry.target.classList.add('counted');
                animateCounter(entry.target, number, 1500);
            }
        }
    });
}, { threshold: 0.5 });

const statNumbers = document.querySelectorAll('.trust-number, .stat-number');
statNumbers.forEach(stat => {
    statObserver.observe(stat);
});

// ===================================
// Page Load Optimizations
// ===================================

/**
 * Lazy load images when they're about to enter viewport
 */
const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            if (img.dataset.src) {
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        }
    });
}, {
    rootMargin: '50px'
});

// Observe all images with data-src attribute
const lazyImages = document.querySelectorAll('img[data-src]');
lazyImages.forEach(img => imageObserver.observe(img));

// ===================================
// Initialize on DOM Content Loaded
// ===================================

document.addEventListener('DOMContentLoaded', () => {
    console.log('BluePalm Hub website initialized successfully');
    
    // Set initial active nav link
    updateActiveNavLink();
    
    // Trigger initial animations for elements in view
    const initialVisibleElements = document.querySelectorAll('.animate-fade-in, .animate-fade-in-delay-1, .animate-fade-in-delay-2, .animate-fade-in-delay-3');
    initialVisibleElements.forEach(element => {
        element.style.opacity = '1';
    });
});

// ===================================
// Accessibility Enhancements
// ===================================

/**
 * Keyboard navigation support
 */
document.addEventListener('keydown', (e) => {
    // Close mobile menu on Escape
    if (e.key === 'Escape' && navMenu && navMenu.classList.contains('active')) {
        navMenu.classList.remove('active');
        mobileToggle.classList.remove('active');
    }
    
    // Focus management for modals (if implemented in future)
    // Add more keyboard shortcuts as needed
});

/**
 * Add focus visible styles for keyboard navigation
 */
const focusableElements = document.querySelectorAll('a, button, input, select, textarea');
focusableElements.forEach(element => {
    element.addEventListener('focus', function() {
        if (this.matches(':focus-visible')) {
            this.style.outline = '2px solid var(--color-primary)';
            this.style.outlineOffset = '2px';
        }
    });
    
    element.addEventListener('blur', function() {
        this.style.outline = '';
        this.style.outlineOffset = '';
    });
});

// ===================================
// Performance Monitoring (Development)
// ===================================

if (window.performance && window.performance.timing) {
    window.addEventListener('load', () => {
        setTimeout(() => {
            const perfData = window.performance.timing;
            const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
            const connectTime = perfData.responseEnd - perfData.requestStart;
            const renderTime = perfData.domComplete - perfData.domLoading;
            
            console.log('Performance Metrics:');
            console.log(`Page Load Time: ${pageLoadTime}ms`);
            console.log(`Server Response Time: ${connectTime}ms`);
            console.log(`DOM Render Time: ${renderTime}ms`);
        }, 0);
    });
}

// ===================================
// Error Handling
// ===================================

window.addEventListener('error', (e) => {
    console.error('An error occurred:', e.error);
    // In production, you might want to send this to an error tracking service
});

// ===================================
// Utility Functions
// ===================================

/**
 * Debounce function to limit how often a function can fire
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Throttle function to ensure a function runs at most once in a specified time period
 */
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Apply throttle to scroll events for better performance
const throttledScroll = throttle(() => {
    updateActiveNavLink();
}, 100);

window.addEventListener('scroll', throttledScroll);