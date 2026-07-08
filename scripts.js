/**
 * Trades4Babes — Main JavaScript
 * Exact color theme from trades4babes.com.au
 */

(function() {
    'use strict';

    // ==================== AGE GATE ====================
    const ageGate = document.getElementById('age-gate');
    const ageYes = document.getElementById('age-yes');

    function checkAgeVerification() {
        if (localStorage.getItem('trades4babes_age_verified') === 'true') {
            ageGate?.classList.add('hidden');
        }
    }

    ageYes?.addEventListener('click', function() {
        localStorage.setItem('trades4babes_age_verified', 'true');
        ageGate.classList.add('hidden');
    });

    // ==================== MOBILE NAV ====================
    const menuToggle = document.getElementById('menu-toggle');
    const mobileNav = document.getElementById('mobile-nav');
    const mobileNavOverlay = document.getElementById('mobile-nav-overlay');
    const mobileNavClose = document.getElementById('mobile-nav-close');

    function openMobileNav() {
        mobileNav?.classList.add('open');
        document.body.style.overflow = 'hidden';
    }

    function closeMobileNav() {
        mobileNav?.classList.remove('open');
        document.body.style.overflow = '';
    }

    menuToggle?.addEventListener('click', openMobileNav);
    mobileNavOverlay?.addEventListener('click', closeMobileNav);
    mobileNavClose?.addEventListener('click', closeMobileNav);

    // ==================== MODALS ====================
    const modals = document.querySelectorAll('.modal');
    const openModalTriggers = document.querySelectorAll('[data-open-modal]');
    const closeModalTriggers = document.querySelectorAll('[data-close-modal]');

    function openModal(id, tabName) {
        const modal = document.getElementById(id);
        if (!modal) return;
        modal.classList.add('open');
        document.body.style.overflow = 'hidden';

        if (tabName) {
            const tab = modal.querySelector(`[data-tab="${tabName}"]`);
            if (tab) switchTab(tab);
        }
    }

    function closeModal(modal) {
        modal.classList.remove('open');
        document.body.style.overflow = '';
    }

    openModalTriggers.forEach(trigger => {
        trigger.addEventListener('click', function(e) {
            e.preventDefault();
            const modalId = this.getAttribute('data-open-modal');
            const tab = this.getAttribute('data-tab-trigger');
            openModal(modalId, tab);
        });
    });

    closeModalTriggers.forEach(trigger => {
        trigger.addEventListener('click', function() {
            const modal = this.closest('.modal');
            if (modal) closeModal(modal);
        });
    });

    modals.forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === this || e.target.classList.contains('modal__overlay')) {
                closeModal(this);
            }
        });
    });

    // Modal tabs
    const modalTabs = document.querySelectorAll('.modal__tab');
    const tabSwitches = document.querySelectorAll('[data-switch-tab]');

    function switchTab(activeTab) {
        const modal = activeTab.closest('.modal__content');
        if (!modal) return;

        modal.querySelectorAll('.modal__tab').forEach(t => t.classList.remove('active'));
        modal.querySelectorAll('.modal__panel').forEach(p => p.classList.remove('active'));

        activeTab.classList.add('active');
        const tabId = activeTab.getAttribute('data-tab');
        const panel = modal.querySelector(`#tab-${tabId}`);
        if (panel) panel.classList.add('active');
    }

    modalTabs.forEach(tab => {
        tab.addEventListener('click', () => switchTab(tab));
    });

    tabSwitches.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const tabName = this.getAttribute('data-switch-tab');
            const modal = this.closest('.modal__content');
            if (modal) {
                const tab = modal.querySelector(`[data-tab="${tabName}"]`);
                if (tab) switchTab(tab);
            }
        });
    });

    // ==================== TOAST NOTIFICATIONS ====================
    const toastContainer = document.getElementById('toast-container');

    window.showToast = function(message, type = 'info') {
        if (!toastContainer) return;

        const toast = document.createElement('div');
        toast.className = `toast toast--${type}`;

        const icons = {
            success: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>',
            error: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>',
            info: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>',
            warning: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>'
        };

        toast.innerHTML = `
            <span class="toast-icon">${icons[type] || icons.info}</span>
            <span class="toast-msg">${message}</span>
            <button class="toast-close" onclick="this.parentElement.remove()">✕</button>
        `;

        toastContainer.appendChild(toast);

        setTimeout(() => {
            toast.style.animation = 'toast-out 300ms ease forwards';
            setTimeout(() => toast.remove(), 300);
        }, 4000);
    };

    // ==================== PROMO CODE COPY ====================
    document.querySelectorAll('.promo-badge').forEach(badge => {
        badge.addEventListener('click', function() {
            const code = this.querySelector('.promo-badge__code')?.textContent;
            if (code) {
                navigator.clipboard.writeText(code).then(() => {
                    showToast(`Promo code ${code} copied!`, 'success');
                }).catch(() => {
                    showToast(`Promo code: ${code}`, 'info');
                });
            }
        });
    });

    // ==================== SCROLL ANIMATIONS ====================
    const fadeElements = document.querySelectorAll('.fade-up');

    function checkScroll() {
        fadeElements.forEach(el => {
            const rect = el.getBoundingClientRect();
            const delay = parseInt(el.getAttribute('data-delay') || '0');
            if (rect.top < window.innerHeight - 80) {
                setTimeout(() => el.classList.add('visible'), delay);
            }
        });
    }

    window.addEventListener('scroll', checkScroll, { passive: true });
    checkScroll();

    // ==================== HEADER SCROLL EFFECT ====================
    const header = document.getElementById('header');
    let lastScroll = 0;

    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;
        if (currentScroll > 100) {
            header?.classList.add('header--scrolled');
        } else {
            header?.classList.remove('header--scrolled');
        }
        lastScroll = currentScroll;
    }, { passive: true });

    // ==================== TESTIMONIALS SLIDER ====================
    const track = document.getElementById('testimonials-track');
    const dotsContainer = document.getElementById('testimonials-dots');
    const prevBtn = document.getElementById('testimonial-prev');
    const nextBtn = document.getElementById('testimonial-next');

    let currentSlide = 0;
    const testimonials = document.querySelectorAll('.testimonial');
    const totalSlides = testimonials.length;

    function createDots() {
        if (!dotsContainer) return;
        dotsContainer.innerHTML = '';
        testimonials.forEach((_, i) => {
            const dot = document.createElement('button');
            dot.className = 'testimonials__dot' + (i === 0 ? ' active' : '');
            dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
            dot.addEventListener('click', () => goToSlide(i));
            dotsContainer.appendChild(dot);
        });
    }

    function goToSlide(index) {
        if (index < 0) index = totalSlides - 1;
        if (index >= totalSlides) index = 0;
        currentSlide = index;

        if (track) {
            track.style.transform = `translateX(-${currentSlide * 100}%)`;
        }

        dotsContainer?.querySelectorAll('.testimonials__dot').forEach((dot, i) => {
            dot.classList.toggle('active', i === currentSlide);
        });
    }

    prevBtn?.addEventListener('click', () => goToSlide(currentSlide - 1));
    nextBtn?.addEventListener('click', () => goToSlide(currentSlide + 1));

    // Auto-advance testimonials
    let testimonialInterval = setInterval(() => goToSlide(currentSlide + 1), 6000);

    const testimonialsSection = document.getElementById('testimonials');
    testimonialsSection?.addEventListener('mouseenter', () => clearInterval(testimonialInterval));
    testimonialsSection?.addEventListener('mouseleave', () => {
        testimonialInterval = setInterval(() => goToSlide(currentSlide + 1), 6000);
    });

    createDots();

    // ==================== HERO PARTICLES ====================
    const particlesContainer = document.getElementById('hero-particles');
    if (particlesContainer) {
        for (let i = 0; i < 30; i++) {
            const p = document.createElement('div');
            p.className = 'hero__particle';
            p.style.left = Math.random() * 100 + '%';
            p.style.animationDuration = (Math.random() * 10 + 5) + 's';
            p.style.animationDelay = (Math.random() * 5) + 's';
            p.style.opacity = Math.random() * 0.4 + 0.1;
            p.style.width = (Math.random() * 3 + 2) + 'px';
            p.style.height = p.style.width;
            particlesContainer.appendChild(p);
        }
    }

    // ==================== MOCK DATA ====================
    const mockProfiles = [
        {
            name: 'Sophie',
            age: 28,
            location: 'Adelaide, SA',
            badges: ['verified', 'premium'],
            gender: 'Female',
            services: ['Escort', 'Massage', 'Dinner Date'],
            image: 'character.png'
        },
        {
            name: 'Ava',
            age: 26,
            location: 'Sydney, NSW',
            badges: ['verified', 'new'],
            gender: 'Female',
            services: ['Escort', 'Travel Companion'],
            image: 'character.png'
        },
        {
            name: 'Chloe',
            age: 30,
            location: 'Melbourne, VIC',
            badges: ['premium'],
            gender: 'Female',
            services: ['Massage', 'GFE', 'Overnight'],
            image: 'character.png'
        },
        {
            name: 'Mia',
            age: 24,
            location: 'Brisbane, QLD',
            badges: ['verified', 'new'],
            gender: 'Female',
            services: ['Escort', 'Dinner Date'],
            image: 'character.png'
        }
    ];

    const mockListings = [
        {
            title: 'Plumbing Work Needed — Bathroom Renovation',
            category: 'Plumbing',
            desc: 'Looking for a licensed plumber to install new fixtures and piping for a bathroom renovation. Must be available within the next week.',
            location: 'Adelaide, SA',
            budget: '$2,500',
            budgetType: 'Fixed',
            urgency: 'week',
            arrangement: 'Cash'
        },
        {
            title: 'Electrical — Home Theatre Setup',
            category: 'Electrical',
            desc: 'Need an electrician to wire up a home theatre room. HDMI, speaker wiring, and lighting control. Flexible on timing.',
            location: 'Sydney, NSW',
            budget: 'Negotiable',
            budgetType: 'Negotiable',
            urgency: 'flexible',
            arrangement: 'Trade'
        },
        {
            title: 'Carpentry — Custom Shelving Unit',
            category: 'Carpentry',
            desc: 'Want custom built-in shelving for a walk-in wardrobe. Oak or similar hardwood preferred. Budget negotiable for quality work.',
            location: 'Melbourne, VIC',
            budget: '$1,800',
            budgetType: 'Fixed',
            urgency: 'flexible',
            arrangement: 'Barter'
        },
        {
            title: 'IT Support — Network & Security Setup',
            category: 'IT',
            desc: 'Small business needs network setup, Wi-Fi mesh, and security camera installation. Ongoing maintenance possible.',
            location: 'Brisbane, QLD',
            budget: '$150/hr',
            budgetType: 'Hourly',
            urgency: 'urgent',
            arrangement: 'Cash'
        }
    ];

    // ==================== RENDER PROFILE CARDS ====================
    const featuredGrid = document.getElementById('featured-grid');
    if (featuredGrid) {
        featuredGrid.innerHTML = mockProfiles.map((profile, i) => `
            <div class="profile-card fade-up" data-delay="${i * 100}">
                <div class="profile-card__image-wrapper">
                    <img src="${profile.image}" alt="${profile.name}" class="profile-card__image">
                    <div class="profile-card__badges">
                        ${profile.badges.includes('verified') ? '<span class="profile-card__badge profile-card__badge--verified"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg> Verified</span>' : ''}
                        ${profile.badges.includes('premium') ? '<span class="profile-card__badge profile-card__badge--premium">Premium</span>' : ''}
                        ${profile.badges.includes('new') ? '<span class="profile-card__badge profile-card__badge--new">New</span>' : ''}
                    </div>
                </div>
                <div class="profile-card__info">
                    <h3 class="profile-card__name">${profile.name} <span style="color: var(--color-text-muted); font-weight: 400; font-size: 0.9em;">, ${profile.age}</span></h3>
                    <p class="profile-card__meta">${profile.gender} &middot; ${profile.location}</p>
                    <div class="profile-card__services">
                        ${profile.services.map(s => `<span class="profile-card__service">${s}</span>`).join('')}
                    </div>
                </div>
            </div>
        `).join('');
    }

    // ==================== RENDER LISTING CARDS ====================
    const listingGrid = document.getElementById('listing-grid');
    if (listingGrid) {
        listingGrid.innerHTML = mockListings.map(listing => `
            <div class="listing-card listing-card--${listing.urgency}">
                <div class="listing-card__header">
                    <div>
                        <h3 class="listing-card__title">${listing.title}</h3>
                        <span class="listing-card__category">${listing.category}</span>
                    </div>
                    <span class="listing-card__urgency listing-card__urgency--${listing.urgency}">
                        ${listing.urgency === 'urgent' ? 'Urgent' : listing.urgency === 'week' ? 'This Week' : 'Flexible'}
                    </span>
                </div>
                <p class="listing-card__desc">${listing.desc}</p>
                <div class="listing-card__meta">
                    <span class="listing-card__meta-item">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                        ${listing.location}
                    </span>
                    <span class="listing-card__meta-item">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                        ${listing.budgetType}
                    </span>
                </div>
                <div class="listing-card__footer">
                    <span class="listing-card__budget">${listing.budget}</span>
                    <span class="listing-card__type">${listing.arrangement}</span>
                </div>
            </div>
        `).join('');
    }

    // ==================== SEARCH PAGE MOCK DATA ====================
    const searchGrid = document.getElementById('search-grid');
    if (searchGrid) {
        const allProfiles = [...mockProfiles, ...mockProfiles, ...mockProfiles, ...mockProfiles];
        searchGrid.innerHTML = allProfiles.map((profile, i) => `
            <div class="profile-card">
                <div class="profile-card__image-wrapper">
                    <img src="${profile.image}" alt="${profile.name}" class="profile-card__image">
                    <div class="profile-card__badges">
                        ${profile.badges.includes('verified') ? '<span class="profile-card__badge profile-card__badge--verified"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg> Verified</span>' : ''}
                        ${profile.badges.includes('premium') ? '<span class="profile-card__badge profile-card__badge--premium">Premium</span>' : ''}
                    </div>
                </div>
                <div class="profile-card__info">
                    <h3 class="profile-card__name">${profile.name} <span style="color: var(--color-text-muted); font-weight: 400; font-size: 0.9em;">, ${profile.age}</span></h3>
                    <p class="profile-card__meta">${profile.gender} &middot; ${profile.location}</p>
                    <div class="profile-card__services">
                        ${profile.services.slice(0, 2).map(s => `<span class="profile-card__service">${s}</span>`).join('')}
                    </div>
                </div>
            </div>
        `).join('');
    }

    // ==================== FAQ ACCORDION ====================
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-item__question');
        question?.addEventListener('click', () => {
            const isOpen = item.classList.contains('open');
            faqItems.forEach(i => i.classList.remove('open'));
            if (!isOpen) item.classList.add('open');
        });
    });

    // ==================== SMOOTH SCROLL FOR ANCHOR LINKS ====================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // ==================== FORM VALIDATION HELPERS ====================
    document.querySelectorAll('form').forEach(form => {
        form.addEventListener('submit', function(e) {
            const inputs = form.querySelectorAll('input[required], textarea[required]');
            let valid = true;
            inputs.forEach(input => {
                if (!input.value.trim()) {
                    valid = false;
                    input.classList.add('form__input--error');
                } else {
                    input.classList.remove('form__input--error');
                }
            });
            if (!valid) {
                e.preventDefault();
                showToast('Please fill in all required fields.', 'error');
            }
        });
    });

    // ==================== DEMO LOGIN HEADER UPDATE ====================
    const demoUser = localStorage.getItem('trades4babes_demo_user');
    if (demoUser === 'true') {
        // Update header actions
        const headerActions = document.querySelector('.header__actions');
        if (headerActions && !document.querySelector('.dashboard')) {
            headerActions.innerHTML = `
                <a href="dashboard.html" class="header__link" style="display:flex;align-items:center;gap:8px;">
                    <img src="character.png" alt="Alex" style="width:32px;height:32px;border-radius:50%;object-fit:cover;border:2px solid var(--color-primary);">
                    <span style="font-size:0.85rem;font-weight:600;">Alex</span>
                </a>
                <a href="dashboard.html" class="btn btn--secondary btn--small">Dashboard</a>
                <button class="header__menu-btn" id="menu-toggle" aria-label="Toggle menu">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
                </button>
            `;
            // Re-attach menu toggle since we replaced the button
            const newMenuToggle = document.getElementById('menu-toggle');
            if (newMenuToggle) {
                newMenuToggle.addEventListener('click', openMobileNav);
            }
        }
        // Update mobile nav actions
        const mobileNavActions = document.querySelector('.mobile-nav__actions');
        if (mobileNavActions && !document.querySelector('.dashboard')) {
            mobileNavActions.innerHTML = `
                <a href="dashboard.html" class="btn btn--primary btn--full">Dashboard</a>
                <a href="index.html" class="btn btn--ghost btn--full" onclick="localStorage.removeItem('trades4babes_demo_user');">Logout</a>
            `;
        }
        // Add Dashboard link to nav if not present
        const mainNav = document.getElementById('main-nav');
        if (mainNav && !mainNav.querySelector('a[href="dashboard.html"]')) {
            const aboutLink = mainNav.querySelector('a[href="about.html"]');
            if (aboutLink) {
                const dashLink = document.createElement('a');
                dashLink.href = 'dashboard.html';
                dashLink.className = 'header__link';
                dashLink.textContent = 'Dashboard';
                mainNav.insertBefore(dashLink, aboutLink);
            }
        }
        // Add Dashboard link to mobile nav if not present
        const mobileNavLinks = document.querySelector('.mobile-nav__links');
        if (mobileNavLinks && !mobileNavLinks.querySelector('a[href="dashboard.html"]')) {
            const aboutMobLink = mobileNavLinks.querySelector('a[href="about.html"]');
            if (aboutMobLink) {
                const dashMobLink = document.createElement('a');
                dashMobLink.href = 'dashboard.html';
                dashMobLink.className = 'mobile-nav__link';
                dashMobLink.textContent = 'Dashboard';
                mobileNavLinks.insertBefore(dashMobLink, aboutMobLink);
            }
        }
    }

    // ==================== LOGIN FORM DEMO HANDLER ====================
    const loginForm = document.querySelector('#tab-login form');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            localStorage.setItem('trades4babes_demo_user', 'true');
            showToast('Demo login successful! Welcome back, Alex.', 'success');
            setTimeout(() => window.location.href = 'dashboard.html', 800);
        });
    }

    const registerForm = document.querySelector('#tab-register form');
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            localStorage.setItem('trades4babes_demo_user', 'true');
            showToast('Demo account created! Redirecting...', 'success');
            setTimeout(() => window.location.href = 'dashboard.html', 800);
        });
    }

    // ==================== INITIALIZE ====================
    checkAgeVerification();
    checkScroll();

})();
