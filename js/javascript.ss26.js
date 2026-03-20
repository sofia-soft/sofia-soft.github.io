'use strict';

/*
   BURGER MENU
*/
const header = document.querySelector('.header');
const burger = document.querySelector('.burger');
const navList = document.querySelector('.nav_list');

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

function toggleMenu() {
    if (header.classList.contains('nav-open')) {
        closeMenu();
    } else {
        openMenu();
    }
}

burger.addEventListener('click', toggleMenu);
burger.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleMenu();
    }
});

navList.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
        closeMenu();
    });
});

document.addEventListener('click', (e) => {
    if (
        header.classList.contains('nav-open') &&
        !header.contains(e.target)
    ) {
        closeMenu();
    }
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && header.classList.contains('nav-open')) {
        closeMenu();
        burger.focus();
    }
});

window.addEventListener('resize', () => {
    if (window.innerWidth >= 1024) {
        closeMenu();
    }
});

/*
   SMOOTH SCROLL
*/
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
        const targetId = anchor.getAttribute('href');
        if (targetId === '#') return;

        const target = document.querySelector(targetId);
        if (!target) return;

        e.preventDefault();

        const headerHeight = header.offsetHeight;
        const targetTop = target.getBoundingClientRect().top + window.scrollY - headerHeight;

        window.scrollTo({
            top: targetTop,
            behavior: 'smooth',
        });
    });
});

/*
   SCROLL UP БУТОН
*/
const scrollUpBtn = document.querySelector('.scroll_up');

window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
        scrollUpBtn.style.opacity = '1';
        scrollUpBtn.style.pointerEvents = 'auto';
    } else {
        scrollUpBtn.style.opacity = '0';
        scrollUpBtn.style.pointerEvents = 'none';
    }
}, {passive: true});

scrollUpBtn.style.opacity = '0';
scrollUpBtn.style.pointerEvents = 'none';
scrollUpBtn.style.transition = 'opacity 0.3s ease';


const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav_list a, .footer_nav a');

function setActiveLink() {
    const scrollY = window.scrollY;
    const headerHeight = header.offsetHeight;

    sections.forEach((section) => {
        const sectionTop = section.offsetTop - headerHeight - 10;
        const sectionBottom = sectionTop + section.offsetHeight;
        const sectionId = section.getAttribute('id');

        if (scrollY >= sectionTop && scrollY < sectionBottom) {
            navLinks.forEach((link) => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

window.addEventListener('scroll', setActiveLink, {passive: true});
setActiveLink();

document.getElementById('contactForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const form = e.target;
    const btn = form.querySelector('.form_submit');
    const success = document.getElementById('formSuccess');

    let valid = true;
    form.querySelectorAll('[required]').forEach(field => {
        field.classList.remove('error');
        if (!field.value.trim()) {
            field.classList.add('error');
            valid = false;
        }
    });

    if (!valid) return;
    const formData = new FormData(form);

    const data = Object.fromEntries(formData.entries());

    btn.classList.add('loading');
    btn.querySelector('.form_submit_text').textContent = 'Изпращане...';

    setTimeout(() => {
        btn.style.display = 'none';
        success.classList.add('show');
        form.querySelectorAll('input, select, textarea').forEach(f => f.disabled = true);
    }, 1200);
});

document.getElementById('contactForm').querySelectorAll('input, select, textarea').forEach(field => {
    field.addEventListener('input', () => field.classList.remove('error'));
});