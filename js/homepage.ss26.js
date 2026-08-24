'use strict';

document.addEventListener('DOMContentLoaded', () => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function revealCards(selector, delay) {
        const container = document.querySelector(selector);
        if (!container) return;
        const cards = [...container.querySelectorAll(':scope > article')];
        if (!cards.length) return;

        const reveal = () => cards.forEach((card, index) => {
            window.setTimeout(() => card.classList.add('visible'), reducedMotion ? 0 : index * delay);
        });

        if (reducedMotion || !('IntersectionObserver' in window)) {
            reveal();
            return;
        }

        const observer = new IntersectionObserver(entries => {
            if (!entries.some(entry => entry.isIntersecting)) return;
            reveal();
            observer.disconnect();
        }, {threshold: 0.1, rootMargin: '0px 0px -40px 0px'});
        observer.observe(container);
    }

    revealCards('.services_boxes', 160);
    revealCards('.how_work_boxes', 140);

    const marquee = document.querySelector('.project-marquee');
    const track = marquee?.querySelector('.project-marquee-track');
    const sourceGroup = track?.querySelector('[data-project-source]');
    const sourceCards = sourceGroup ? [...sourceGroup.querySelectorAll('.project-card')] : [];

    if (marquee && track && sourceGroup) {
        const createClone = () => {
            const clone = sourceGroup.cloneNode(true);
            clone.dataset.marqueeClone = 'true';
            clone.setAttribute('aria-hidden', 'true');
            clone.querySelectorAll('.project-card').forEach(card => card.tabIndex = -1);
            return clone;
        };

        const buildMarquee = () => {
            track.querySelectorAll('[data-marquee-clone]').forEach(clone => clone.remove());
            marquee.classList.remove('is-animated', 'is-static');
            track.style.removeProperty('--marquee-distance');

            if (sourceCards.length < 2 || reducedMotion) {
                marquee.classList.add('is-static');
                return;
            }

            const groupWidth = sourceGroup.getBoundingClientRect().width;
            if (!groupWidth) return;
            const cloneCount = Math.ceil((marquee.clientWidth * 2) / groupWidth);
            for (let index = 0; index < cloneCount; index += 1) track.appendChild(createClone());
            track.style.setProperty('--marquee-distance', `${groupWidth}px`);
            marquee.classList.add('is-animated');
        };

        buildMarquee();
        window.addEventListener('resize', buildMarquee, {passive: true});
    }

    const projectModal = document.getElementById('project-modal');
    const projectsTitle = document.getElementById('projects-title');

    function modalField(name) {
        return projectModal?.querySelector(`[data-project-modal="${name}"]`);
    }

    function populateModal(card) {
        const fields = ['mark', 'type', 'title', 'description'];
        fields.forEach(field => {
            const target = modalField(field);
            if (target) target.textContent = card.dataset[field] || '';
        });

        const link = modalField('link');
        if (link) {
            const hasUrl = Boolean(card.dataset.url);
            link.hidden = !hasUrl;
            if (hasUrl) link.href = card.dataset.url;
        }

        const scope = modalField('scope');
        if (scope) {
            scope.replaceChildren();
            (card.dataset.scope || '').split('|').filter(Boolean).forEach(item => {
                const li = document.createElement('li');
                li.textContent = item;
                scope.appendChild(li);
            });
        }
    }

    function closeProjectModal() {
        if (!projectModal || !projectModal.classList.contains('active')) return;
        projectModal.classList.remove('active');
        projectModal.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('project-modal-open');
        projectsTitle?.focus({preventScroll: true});
    }

    function openProjectModal(card) {
        if (!projectModal) return;
        populateModal(card);
        projectModal.classList.add('active');
        projectModal.setAttribute('aria-hidden', 'false');
        document.body.classList.add('project-modal-open');
        projectModal.querySelector('.project-modal-close')?.focus();
    }

    marquee?.addEventListener('click', event => {
        const card = event.target.closest('.project-card');
        if (card) openProjectModal(card);
    });

    if (!projectModal) return;
    projectModal.querySelectorAll('[data-project-modal-close]').forEach(close => {
        close.addEventListener('click', closeProjectModal);
    });

    projectModal.addEventListener('keydown', event => {
        if (event.key === 'Escape') {
            event.preventDefault();
            closeProjectModal();
            return;
        }
        if (event.key !== 'Tab') return;
        const focusable = [...projectModal.querySelectorAll('button:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])')];
        if (!focusable.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
            event.preventDefault();
            last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault();
            first.focus();
        }
    });
});
