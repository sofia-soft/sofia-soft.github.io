'use strict';

document.addEventListener('DOMContentLoaded', () => {
    document.body.classList.add('ready');

    const lang = document.documentElement.lang;
    const header = document.querySelector('.header');
    const burger = document.querySelector('.burger');
    const navList = document.querySelector('.nav_list');
    const CONSENT_KEY = 'cookiesConsent';
    let analyticsLoaded = false;

    localStorage.setItem('lang', lang);

    function openMenu() {
        if (!header || !burger) return;
        header.classList.add('nav-open');
        burger.classList.add('active');
        burger.setAttribute('aria-label', lang === 'bg' ? 'Затваряне на навигационното меню' : 'Close navigation menu');
        document.body.style.overflow = 'hidden';
    }

    function closeMenu() {
        if (!header || !burger) return;
        header.classList.remove('nav-open');
        burger.classList.remove('active');
        burger.setAttribute('aria-label', lang === 'bg' ? 'Отваряне на навигационното меню' : 'Open navigation menu');
        document.body.style.overflow = '';
    }

    if (burger) {
        burger.addEventListener('click', () => header.classList.contains('nav-open') ? closeMenu() : openMenu());
        burger.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                burger.click();
            }
        });
    }

    if (navList) navList.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));

    document.addEventListener('click', (event) => {
        if (header && header.classList.contains('nav-open') && !header.contains(event.target)) closeMenu();
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && header && header.classList.contains('nav-open')) {
            closeMenu();
            if (burger) burger.focus();
        }
    });

    window.addEventListener('resize', () => {
        if (window.innerWidth >= 1024) closeMenu();
    }, {passive: true});

    let scrollTicking = false;
    function updateHeader() {
        if (header) header.classList.toggle('shrunk', window.innerWidth >= 1024 && window.scrollY > 80);
    }

    window.addEventListener('scroll', () => {
        if (scrollTicking) return;
        requestAnimationFrame(() => {
            updateHeader();
            scrollTicking = false;
        });
        scrollTicking = true;
    }, {passive: true});
    window.addEventListener('resize', updateHeader, {passive: true});
    updateHeader();

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (event) => {
            const target = document.querySelector(anchor.getAttribute('href'));
            if (!target || !header) return;
            event.preventDefault();
            const offset = target.getBoundingClientRect().top + window.scrollY - header.offsetHeight - 16;
            window.scrollTo({top: offset, behavior: 'smooth'});
        });
    });

    const scrollUpBtn = document.querySelector('.scroll_up');
    if (scrollUpBtn) {
        scrollUpBtn.style.cssText = 'opacity:0; pointer-events:none; transition: opacity .4s ease';
        const updateScrollUp = () => {
            const visible = window.scrollY > 400;
            scrollUpBtn.style.opacity = visible ? '1' : '0';
            scrollUpBtn.style.pointerEvents = visible ? 'auto' : 'none';
        };
        window.addEventListener('scroll', updateScrollUp, {passive: true});
        updateScrollUp();
    }

    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav_list a, .footer_nav a');
    function setActiveLink() {
        if (!header) return;
        const scrollY = window.scrollY;
        sections.forEach(section => {
            const top = section.offsetTop - header.offsetHeight - 10;
            const bottom = top + section.offsetHeight;
            if (scrollY < top || scrollY >= bottom) return;
            const id = section.getAttribute('id');
            navLinks.forEach(link => link.classList.toggle('active', link.getAttribute('href') === `#${id}`));
        });
    }
    window.addEventListener('scroll', setActiveLink, {passive: true});
    setActiveLink();

    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', async function (event) {
            event.preventDefault();
            const button = this.querySelector('.form_submit');
            const buttonText = this.querySelector('.form_submit_text');
            const success = document.getElementById('formSuccess');
            const initialText = buttonText ? buttonText.textContent : '';
            if (button) button.disabled = true;
            if (buttonText) buttonText.textContent = lang === 'bg' ? 'Изпращане...' : 'Sending...';

            const data = {
                name: document.getElementById('name')?.value.trim(),
                email: document.getElementById('email')?.value.trim(),
                phone: document.getElementById('phone')?.value.trim(),
                service: document.getElementById('service')?.value,
                message: document.getElementById('message')?.value.trim()
            };

            try {
                const response = await fetch('https://contact-form.myrobotch.workers.dev', {
                    method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(data)
                });
                if (!response.ok) throw new Error('Contact form request failed');
                this.reset();
                if (success) {
                    success.style.display = 'flex';
                    setTimeout(() => { success.style.display = 'none'; }, 5000);
                }
                if (buttonText) buttonText.textContent = initialText;
            } catch {
                if (buttonText) buttonText.textContent = lang === 'bg' ? 'Грешка — опитайте отново' : 'Error — please try again';
                setTimeout(() => { if (buttonText) buttonText.textContent = initialText; }, 3000);
            } finally {
                if (button) button.disabled = false;
            }
        });
    }

    const cookiePopup = document.getElementById('cookie-consent-popup');
    const cookieModal = document.getElementById('cookie-modal');
    const cookieState = localStorage.getItem(CONSENT_KEY);
    if (!cookieState && cookiePopup) cookiePopup.style.display = 'block';

    function enableAnalytics() {
        if (analyticsLoaded) return;
        analyticsLoaded = true;
        window.dataLayer = window.dataLayer || [];
        window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
        window.gtag('consent', 'default', {analytics_storage: 'denied'});
        const script = document.createElement('script');
        script.async = true;
        script.src = 'https://www.googletagmanager.com/gtag/js?id=G-JJWTBVCPJV';
        script.onload = () => {
            window.gtag('js', new Date());
            window.gtag('consent', 'update', {analytics_storage: 'granted'});
            window.gtag('config', 'G-JJWTBVCPJV');
            window.gtag('event', 'page_view');
        };
        document.head.appendChild(script);
    }

    function disableAnalytics() {
        analyticsLoaded = false;
        if (typeof window.gtag === 'function') window.gtag('consent', 'update', {analytics_storage: 'denied'});
        document.cookie.split(';').forEach(cookie => {
            const name = cookie.split('=')[0].trim();
            if (!name.startsWith('_ga')) return;
            document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
            document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${location.hostname};`;
        });
    }

    function openCookieSection(sectionId) {
        if (!cookieModal) return;
        cookieModal.querySelectorAll('.cookie-section').forEach(section => section.classList.replace('active', 'hidden'));
        const section = document.getElementById(sectionId);
        if (section) section.classList.replace('hidden', 'active');
        cookieModal.classList.add('active');
    }

    function closeCookieModal() {
        if (cookieModal) cookieModal.classList.remove('active');
    }

    document.getElementById('accept-cookies')?.addEventListener('click', () => {
        localStorage.setItem(CONSENT_KEY, 'accepted');
        if (cookiePopup) cookiePopup.style.display = 'none';
        enableAnalytics();
    });
    document.getElementById('decline-cookies')?.addEventListener('click', () => {
        localStorage.setItem(CONSENT_KEY, 'rejected');
        if (cookiePopup) cookiePopup.style.display = 'none';
    });
    document.getElementById('show-cookie-info')?.addEventListener('click', () => openCookieSection('cookieIntro'));
    document.getElementById('cookies_button')?.addEventListener('click', () => openCookieSection('cookieSettings'));
    document.getElementById('cookies-footer-trigger')?.addEventListener('click', () => openCookieSection('cookieIntro'));
    document.querySelectorAll('.privacy-trigger').forEach(trigger => trigger.addEventListener('click', () => openCookieSection('privacyInfo')));
    document.getElementById('modalClose')?.addEventListener('click', closeCookieModal);

    document.getElementById('save_cookies')?.addEventListener('click', () => {
        const analytics = document.getElementById('analyticsToggle')?.checked;
        localStorage.setItem(CONSENT_KEY, analytics ? 'accepted' : 'rejected');
        analytics ? enableAnalytics() : disableAnalytics();
        closeCookieModal();
    });
    document.getElementById('reject_all_cookies')?.addEventListener('click', () => {
        localStorage.setItem(CONSENT_KEY, 'rejected');
        const toggle = document.getElementById('analyticsToggle');
        if (toggle) toggle.checked = false;
        disableAnalytics();
        closeCookieModal();
    });

    if (cookieState === 'accepted') enableAnalytics();
});
