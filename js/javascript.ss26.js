'use strict';

document.addEventListener('DOMContentLoaded', () => {

    const header = document.querySelector('.header');
    const burger = document.querySelector('.burger');
    const navList = document.querySelector('.nav_list');

    const EASE = 'cubic-bezier(.16, 1, .3, 1)';
    const EASE_SPRING = 'cubic-bezier(.34, 1.56, .64, 1)';

    function injectStyle(rules) {
        const s = document.createElement('style');
        s.textContent = rules;
        document.head.appendChild(s);
    }

    function animEl(el, delay, fromTransform, duration = 0.9, ease = EASE) {
        if (!el) return;
        el.style.transform = fromTransform;
        setTimeout(() => {
            el.style.transition = `opacity ${duration}s ${ease}, transform ${duration}s ${ease}`;
            el.style.opacity = '1';
            el.style.transform = 'translateY(0) translateX(0) scale(1) rotate(0deg)';
        }, delay);
    }

    function onEnter(target, callback, opts = {}) {
        if (!target) return;
        const obs = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                callback();
                obs.disconnect();
            });
        }, {threshold: 0.12, rootMargin: '0px 0px -50px 0px', ...opts});
        obs.observe(target);
    }

    function openMenu() {
        header.classList.add('nav-open');
        burger.classList.add('active');
        burger.setAttribute('aria-label', 'Затваряне на навигационното меню');
        document.body.style.overflow = 'hidden';
    }

    function closeMenu() {
        header.classList.remove('nav-open');
        burger.classList.remove('active');
        burger.setAttribute('aria-label', 'Отваряне на навигационно меню');
        document.body.style.overflow = '';
    }

    burger.addEventListener('click', () => {
        header.classList.contains('nav-open') ? closeMenu() : openMenu();
    });

    burger.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            burger.click();
        }
    });

    navList.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));

    document.addEventListener('click', (e) => {
        if (header.classList.contains('nav-open') && !header.contains(e.target)) closeMenu();
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && header.classList.contains('nav-open')) {
            closeMenu();
            burger.focus();
        }
    });

    window.addEventListener('resize', () => {
        if (window.innerWidth >= 1024) closeMenu();
    }, {passive: true});

    const isMobile = () => window.innerWidth < 1024;
    let ticking = false;

    function updateHeader() {
        if (isMobile()) {
            header.classList.remove('shrunk');
        } else {
            header.classList.toggle('shrunk', window.scrollY > 80);
        }
    }

    window.addEventListener('scroll', () => {
        if (ticking) return;
        requestAnimationFrame(() => {
            updateHeader();
            ticking = false;
        });
        ticking = true;
    }, {passive: true});

    window.addEventListener('resize', updateHeader, {passive: true});

    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener('click', (e) => {
            const id = anchor.getAttribute('href');
            if (id === '#') return;
            const target = document.querySelector(id);
            if (!target) return;
            e.preventDefault();
            const offset = target.getBoundingClientRect().top + window.scrollY - header.offsetHeight - 16;
            window.scrollTo({top: offset, behavior: 'smooth'});
        });
    });

    const scrollUpBtn = document.querySelector('.scroll_up');
    if (scrollUpBtn) {
        scrollUpBtn.style.cssText = 'opacity:0; pointer-events:none; transition: opacity .4s ease';
        window.addEventListener('scroll', () => {
            const show = window.scrollY > 400;
            scrollUpBtn.style.opacity = show ? '1' : '0';
            scrollUpBtn.style.pointerEvents = show ? 'auto' : 'none';
        }, {passive: true});
    }

    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav_list a, .footer_nav a');

    function setActiveLink() {
        const scrollY = window.scrollY;
        const hh = header.offsetHeight;
        sections.forEach((section) => {
            const top = section.offsetTop - hh - 10;
            const bottom = top + section.offsetHeight;
            const id = section.getAttribute('id');
            if (scrollY >= top && scrollY < bottom) {
                navLinks.forEach(link => {
                    link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
                });
            }
        });
    }

    window.addEventListener('scroll', setActiveLink, {passive: true});
    setActiveLink();

    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const btn = this.querySelector('.form_submit');
            const success = document.getElementById('formSuccess');

            let valid = true;
            this.querySelectorAll('[required]').forEach(field => {
                field.classList.remove('error');
                if (!field.value.trim()) {
                    field.classList.add('error');
                    valid = false;
                }
            });
            if (!valid) return;

            btn.classList.add('loading');
            btn.querySelector('.form_submit_text').textContent = 'Изпращане...';

            setTimeout(() => {
                btn.style.display = 'none';
                success.classList.add('show');
                this.querySelectorAll('input, select, textarea').forEach(f => f.disabled = true);
            }, 1200);
        });

        contactForm.querySelectorAll('input, select, textarea').forEach(field => {
            field.addEventListener('input', () => field.classList.remove('error'));
        });
    }

    (function initHero() {
        const heroBadge = document.querySelector('.hero_budget');
        const heroTitle = document.querySelector('.hero_title');
        const heroSub = document.querySelector('.hero_sub_title');
        const heroBtn = document.querySelector('.hero_button_more');

        const hasWordSpans = heroTitle && heroTitle.querySelector('.hero_word');

        if (hasWordSpans) {
            injectStyle(`
                .hero_budget, .hero_word, .hero_sub_title, .hero_button_more,
                .block1, .block2, .block3, .block4 { opacity:0; will-change:opacity,transform; }
            `);

            if (heroBadge) {
                heroBadge.style.transform = 'scale(0.82) translateY(10px)';
                setTimeout(() => {
                    heroBadge.style.transition = `opacity .8s ${EASE}, transform .85s ${EASE_SPRING}`;
                    heroBadge.style.opacity = '1';
                    heroBadge.style.transform = 'scale(1) translateY(0)';
                }, 200);
            }

            heroTitle.querySelectorAll('.hero_word').forEach((word, i) => {
                word.style.transform = 'translateY(22px)';
                setTimeout(() => {
                    word.style.transition = `opacity .75s ${EASE}, transform .8s ${EASE}`;
                    word.style.opacity = '1';
                    word.style.transform = 'translateY(0)';
                }, 430 + i * 120);
            });

        } else if (heroTitle) {
            injectStyle(`
        .hero_budget, .hero_sub_title, .hero_button_more,
        .block1, .block2, .block3, .block4 { opacity:0; will-change:opacity,transform; }
    `);

            heroTitle.style.opacity = '0';
            heroTitle.style.transform = 'translateY(22px)';

            setTimeout(() => {
                heroTitle.style.transition = `opacity .75s ${EASE}, transform .8s ${EASE}`;
                heroTitle.style.opacity = '1';
                heroTitle.style.transform = 'translateY(0)';
            }, 430);
        }

        if (heroBadge) {
            heroBadge.style.transform = heroBadge.style.transform || 'scale(0.82) translateY(10px)';
            setTimeout(() => {
                heroBadge.style.transition = `opacity .8s ${EASE}, transform .85s ${EASE_SPRING}`;
                heroBadge.style.opacity = '1';
                heroBadge.style.transform = 'scale(1) translateY(0)';
            }, 200);
        }

        animEl(heroSub, 860, 'translateY(18px)', 0.85);

        if (heroBtn) {
            heroBtn.style.transform = 'scale(0.85) translateY(10px)';
            setTimeout(() => {
                heroBtn.style.transition = `opacity .8s ${EASE}, transform .85s ${EASE_SPRING}`;
                heroBtn.style.opacity = '1';
                heroBtn.style.transform = 'scale(1) translateY(0)';
            }, 1100);
        }

        [
            {sel: '.block1', delay: 1300, from: 'translateY(-26px) translateX(14px) scale(0.91) rotate(1.5deg)'},
            {sel: '.block2', delay: 1460, from: 'translateY(-18px) translateX(22px) scale(0.93) rotate(-1deg)'},
            {sel: '.block3', delay: 1600, from: 'translateY(26px) translateX(-14px) scale(0.91) rotate(-1.5deg)'},
            {sel: '.block4', delay: 1730, from: 'translateY(26px) translateX(14px) scale(0.93) rotate(1deg)'},
        ].forEach(({sel, delay, from}) => {
            animEl(document.querySelector(sel), delay, from, 0.9);
        });
    })();

    function initStagger(containerSel, cardSel, opts = {}) {
        const container = document.querySelector(containerSel);
        if (!container) return;
        const cards = container.querySelectorAll(cardSel);
        if (!cards.length) return;

        const {
            delay = 160,
            duration = 0.85,
            offsetY = 38,
            scale = 0.93,
            threshold = 0.12,
            rootMargin = '0px 0px -70px 0px'
        } = opts;

        const st = document.createElement('style');
        st.textContent = `${cardSel} { opacity:0; will-change:opacity,transform; }`;
        document.head.appendChild(st);

        cards.forEach(card => {
            card.style.transform = `translateY(${offsetY}px) scale(${scale})`;
        });

        onEnter(container, () => {
            cards.forEach((card, i) => {
                setTimeout(() => {
                    card.style.transition = `opacity ${duration}s ${EASE}, transform ${duration}s ${EASE_SPRING}`;
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0) scale(1)';
                }, i * delay);
            });
        }, {threshold, rootMargin});
    }

    initStagger('.services_boxes', '.services_boxes > div', {
        delay: 180, duration: 0.9, offsetY: 42, scale: 0.92,
        threshold: 0.15, rootMargin: '0px 0px -80px 0px',
    });

    initStagger('.how_work_boxes', '.how_work_boxes > div', {
        delay: 170, duration: 0.85, offsetY: 34, scale: 0.94,
        threshold: 0.12, rootMargin: '0px 0px -60px 0px',
    });

    const aboutSection = document.querySelector('#about_us');
    if (aboutSection) {
        injectStyle(`
            #about_us .about_us_icon, #about_us .about_us_budget,
            #about_us .about_us_title, #about_us .about_us_title_content p,
            #about_us .about_us_list li { opacity:0; will-change:opacity,transform; }
        `);

        const aIcon = aboutSection.querySelector('.about_us_icon');
        const aBadge = aboutSection.querySelector('.about_us_budget');
        const aTitle = aboutSection.querySelector('.about_us_title');

        if (aIcon) aIcon.style.transform = 'translateX(-44px) scale(0.94)';
        if (aBadge) aBadge.style.transform = 'scale(0.82) translateY(8px)';
        if (aTitle) aTitle.style.transform = 'translateY(22px)';

        aboutSection.querySelectorAll('.about_us_title_content p').forEach(p => {
            p.style.transform = 'translateY(16px)';
        });
        aboutSection.querySelectorAll('.about_us_list li').forEach(li => {
            li.style.transform = 'translateX(-14px)';
        });

        onEnter(aboutSection, () => {
            animEl(aIcon, 0, 'translateX(-44px) scale(0.94)', 1.05);

            if (aBadge) {
                setTimeout(() => {
                    aBadge.style.transition = `opacity .75s ${EASE}, transform .8s ${EASE_SPRING}`;
                    aBadge.style.opacity = '1';
                    aBadge.style.transform = 'scale(1) translateY(0)';
                }, 240);
            }

            animEl(aTitle, 400, 'translateY(22px)', 0.9);

            aboutSection.querySelectorAll('.about_us_title_content p').forEach((p, i) => {
                animEl(p, 580 + i * 180, 'translateY(16px)', 0.85);
            });

            aboutSection.querySelectorAll('.about_us_list li').forEach((li, i) => {
                setTimeout(() => {
                    li.style.transition = `opacity .7s ${EASE}, transform .7s ${EASE}`;
                    li.style.opacity = '1';
                    li.style.transform = 'translateX(0)';
                }, 860 + i * 100);
            });
        }, {threshold: 0.12});
    }

    const contactSection = document.querySelector('#contact');
    if (contactSection) {
        injectStyle(`
            #contact .contact_budget, #contact .contact_title, #contact .how_work_sub_title,
            #contact .contact_form, #contact .contact_list li, #contact .contact_icon {
                opacity:0; will-change:opacity,transform;
            }
        `);

        const cBadge = contactSection.querySelector('.contact_budget');
        const cTitle = contactSection.querySelector('.contact_title');
        const cSub = contactSection.querySelector('.how_work_sub_title');
        const cForm = contactSection.querySelector('.contact_form');
        const cImg = contactSection.querySelector('.contact_icon');

        if (cBadge) cBadge.style.transform = 'scale(0.82) translateY(8px)';
        if (cTitle) cTitle.style.transform = 'translateY(22px)';
        if (cSub) cSub.style.transform = 'translateY(16px)';
        if (cForm) cForm.style.transform = 'translateX(-36px) scale(0.97)';
        if (cImg) cImg.style.transform = 'translateY(28px) scale(0.94)';

        contactSection.querySelectorAll('.contact_list li').forEach(li => {
            li.style.transform = 'translateX(28px)';
        });

        onEnter(contactSection, () => {
            if (cBadge) {
                setTimeout(() => {
                    cBadge.style.transition = `opacity .75s ${EASE}, transform .8s ${EASE_SPRING}`;
                    cBadge.style.opacity = '1';
                    cBadge.style.transform = 'scale(1) translateY(0)';
                }, 0);
            }

            animEl(cTitle, 200, 'translateY(22px)', 0.9);
            animEl(cSub, 360, 'translateY(16px)', 0.85);
            animEl(cForm, 520, 'translateX(-36px) scale(0.97)', 0.95);

            contactSection.querySelectorAll('.contact_list li').forEach((li, i) => {
                setTimeout(() => {
                    li.style.transition = `opacity .7s ${EASE}, transform .7s ${EASE}`;
                    li.style.opacity = '1';
                    li.style.transform = 'translateX(0)';
                }, 660 + i * 120);
            });

            animEl(cImg, 1000, 'translateY(28px) scale(0.94)', 0.9, EASE_SPRING);
        }, {threshold: 0.1});
    }

});