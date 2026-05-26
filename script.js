/* ═══════════════════════════════════════════════════════════════
   PSICOLOGÍA HUMANIZADA — script.js  (v2 — fixes)
   Sin Lenis (scroll nativo) · GSAP ScrollTrigger · Slider fix
═══════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ─────────────────────────────────────────
     0. WAIT FOR GSAP
  ───────────────────────────────────────── */
  function waitForGSAP(callback) {
    const check = () => {
      if (window.gsap && window.ScrollTrigger) callback();
      else requestAnimationFrame(check);
    };
    check();
  }

  /* ─────────────────────────────────────────
     1. AÑO FOOTER
  ───────────────────────────────────────── */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ─────────────────────────────────────────
     2. DARK / LIGHT TOGGLE + LUCECITA
  ───────────────────────────────────────── */
  (function initTheme() {
    const root   = document.documentElement;
    const btn    = document.getElementById('themeToggle');
    const label  = document.getElementById('themeLabel');
    const stored = localStorage.getItem('ph-theme');
    if (stored) root.setAttribute('data-theme', stored);

    function applyTheme(theme) {
      root.setAttribute('data-theme', theme);
      localStorage.setItem('ph-theme', theme);
      if (label) label.textContent = theme === 'dark' ? 'Oscuro' : 'Claro';

      const brainSvg = document.querySelector('.logo-brain-svg');
      if (brainSvg) {
        brainSvg.style.transition = 'transform 0.3s cubic-bezier(0.16,1,0.3,1)';
        brainSvg.style.transform  = 'scale(1.2) rotate(-8deg)';
        setTimeout(() => { brainSvg.style.transform = 'scale(1) rotate(0deg)'; }, 320);
      }
    }

    applyTheme(root.getAttribute('data-theme') || 'dark');
    if (btn) btn.addEventListener('click', () => {
      applyTheme(root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
    });
  })();

  /* ─────────────────────────────────────────
     3. CURSOR NEURAL
  ───────────────────────────────────────── */
  (function initCursor() {
    if (!window.matchMedia('(hover: hover)').matches) return;
    const dot  = document.querySelector('.cursor-dot');
    const ring = document.querySelector('.cursor-ring');
    if (!dot || !ring) return;

    let mx = -100, my = -100, rx = -100, ry = -100;

    document.addEventListener('mousemove', e => {
      mx = e.clientX; my = e.clientY;
      dot.style.left = mx + 'px';
      dot.style.top  = my + 'px';
    });

    (function loop() {
      rx += (mx - rx) * 0.12;
      ry += (my - ry) * 0.12;
      ring.style.left = rx + 'px';
      ring.style.top  = ry + 'px';
      requestAnimationFrame(loop);
    })();

    document.querySelectorAll('a, button, [data-gsap-service]').forEach(el => {
      el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
      el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
    });
    document.addEventListener('mouseleave', () => { dot.style.opacity = '0'; ring.style.opacity = '0'; });
    document.addEventListener('mouseenter', () => { dot.style.opacity = '1'; ring.style.opacity = '1'; });
  })();

  /* ─────────────────────────────────────────
     4. LOADER
  ───────────────────────────────────────── */
  function initLoader(onComplete) {
    const loader = document.getElementById('loader');
    const bar    = document.getElementById('loaderBar');
    if (!loader) { onComplete(); return; }

    document.body.classList.add('is-loading');
    const start = performance.now();
    const dur   = 1600;

    function tick(now) {
      const p = Math.min(((now - start) / dur) * 100, 100);
      if (bar) bar.style.width = p + '%';
      if (p < 100) { requestAnimationFrame(tick); return; }
      setTimeout(() => {
        loader.classList.add('is-hidden');
        document.body.classList.remove('is-loading');
        setTimeout(onComplete, 600);
      }, 150);
    }
    requestAnimationFrame(tick);
  }

  /* ─────────────────────────────────────────
     5. NAV
  ───────────────────────────────────────── */
  function initNav() {
    const header    = document.getElementById('siteHeader');
    const hamburger = document.getElementById('navHamburger');
    const mobile    = document.getElementById('navMobile');

    window.addEventListener('scroll', () => {
      if (header) header.classList.toggle('is-scrolled', window.scrollY > 40);
    }, { passive: true });

    if (hamburger && mobile) {
      hamburger.addEventListener('click', () => {
        const open = hamburger.classList.toggle('is-open');
        mobile.classList.toggle('is-open', open);
        hamburger.setAttribute('aria-expanded', open.toString());
        mobile.setAttribute('aria-hidden', (!open).toString());
        document.body.style.overflow = open ? 'hidden' : '';
      });
      document.querySelectorAll('.nav-mobile-link').forEach(link => {
        link.addEventListener('click', () => {
          hamburger.classList.remove('is-open');
          mobile.classList.remove('is-open');
          hamburger.setAttribute('aria-expanded', 'false');
          mobile.setAttribute('aria-hidden', 'true');
          document.body.style.overflow = '';
        });
      });
    }
  }

  /* ─────────────────────────────────────────
     6. TESTIMONIOS SLIDER — fix overflow
  ───────────────────────────────────────── */
  function initTestimonios() {
    const track       = document.getElementById('testimoniosTrack');
    const prevBtn     = document.getElementById('testimoniosPrev');
    const nextBtn     = document.getElementById('testimoniosNext');
    const progressBar = document.getElementById('testimoniosProgressBar');
    if (!track) return;

    const items = Array.from(track.querySelectorAll('.testimonio'));
    if (!items.length) return;
    const total   = items.length;
    let current   = 0;
    let autoplay;

    function goTo(idx) {
      current = ((idx % total) + total) % total;
      track.style.transform = `translateX(-${current * 100}%)`;
      if (progressBar) progressBar.style.width = ((current + 1) / total * 100) + '%';
    }

    function start() { autoplay = setInterval(() => goTo(current + 1), 5000); }
    function stop()  { clearInterval(autoplay); }

    if (prevBtn) prevBtn.addEventListener('click', () => { stop(); goTo(current - 1); start(); });
    if (nextBtn) nextBtn.addEventListener('click', () => { stop(); goTo(current + 1); start(); });

    let tx = 0;
    track.addEventListener('touchstart', e => { tx = e.touches[0].clientX; }, { passive: true });
    track.addEventListener('touchend',   e => {
      const d = tx - e.changedTouches[0].clientX;
      if (Math.abs(d) > 50) { stop(); goTo(d > 0 ? current + 1 : current - 1); start(); }
    }, { passive: true });

    goTo(0);
    start();
  }

  /* ─────────────────────────────────────────
     7. GSAP ANIMACIONES (sin Lenis)
  ───────────────────────────────────────── */
  function initGSAP() {
    const { gsap, ScrollTrigger } = window;
    gsap.registerPlugin(ScrollTrigger);

    /* ── Hero entrance ── */
    gsap.timeline({ delay: 0.15 })
      .to('.hero-eyebrow',   { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' })
      .to('.headline-line',  { opacity: 1, y: 0, duration: 1,   ease: 'power4.out', stagger: 0.12 }, '-=0.4')
      .to('.hero-subtext',   { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, '-=0.5')
      .to('.hero-actions',   { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }, '-=0.5')
      .to('.hero-counter',   { opacity: 1, duration: 0.6 }, '<');

    /* ── Parallax Spline ── */
    gsap.to('.hero-spline', {
      yPercent: 20, ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1.5 },
    });

    /* ── Parallax foto ── */
    gsap.to('.photo-frame', {
      yPercent: -8, ease: 'none',
      scrollTrigger: { trigger: '.sobre-mi', start: 'top bottom', end: 'bottom top', scrub: 1.2 },
    });

    /* ── Reveals genéricos ── */
    gsap.utils.toArray('[data-gsap-reveal]').forEach(el => {
      gsap.to(el, {
        opacity: 1, y: 0, duration: 0.9, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none none' },
      });
    });

    /* ── Section titles ── */
    gsap.utils.toArray('.section-title').forEach(el => {
      gsap.fromTo(el, { opacity: 0, y: 30 }, {
        opacity: 1, y: 0, duration: 1, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none none' },
      });
    });

    /* ── Servicios ── */
    gsap.utils.toArray('[data-gsap-service]').forEach((el, i) => {
      gsap.to(el, {
        opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', delay: i * 0.06,
        scrollTrigger: { trigger: el, start: 'top 90%', toggleActions: 'play none none none' },
      });
    });

    /* ── Proceso steps ── */
    gsap.utils.toArray('[data-gsap-step]').forEach((el, i) => {
      gsap.to(el, {
        opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', delay: i * 0.15,
        scrollTrigger: { trigger: '.proceso-steps', start: 'top 80%', toggleActions: 'play none none none' },
      });
    });

    /* ── Proceso connectors ── */
    gsap.utils.toArray('.proceso-connector').forEach((el, i) => {
      gsap.fromTo(el, { scaleX: 0, opacity: 0 }, {
        scaleX: 1, opacity: 0.4, duration: 0.8, ease: 'power2.out',
        transformOrigin: 'left center', delay: i * 0.2 + 0.4,
        scrollTrigger: { trigger: '.proceso-steps', start: 'top 80%' },
      });
    });

    /* ── Credencial bounce ── */
    gsap.fromTo('.sobre-credential', { opacity: 0, y: 20, scale: 0.9 }, {
      opacity: 1, y: 0, scale: 1, duration: 0.9, ease: 'back.out(1.4)',
      scrollTrigger: { trigger: '.sobre-mi-visual', start: 'top 70%' },
    });

    /* ── Línea foto ── */
    gsap.fromTo('.photo-accent-line', { scaleY: 0 }, {
      scaleY: 1, duration: 1.2, ease: 'power3.out', transformOrigin: 'top center',
      scrollTrigger: { trigger: '.sobre-mi', start: 'top 70%' },
    });

    /* ── Badges stagger ── */
    gsap.fromTo('.badge', { opacity: 0, scale: 0.85, y: 10 }, {
      opacity: 1, scale: 1, y: 0, duration: 0.5, stagger: 0.07, ease: 'back.out(1.5)',
      scrollTrigger: { trigger: '.sobre-badges', start: 'top 85%' },
    });

    /* ── CTA Band ── */
    gsap.fromTo('.cta-band-headline', { opacity: 0, scale: 0.95, y: 30 }, {
      opacity: 1, scale: 1, y: 0, duration: 1, ease: 'power3.out',
      scrollTrigger: { trigger: '.cta-band', start: 'top 75%' },
    });

    /* ── Contacto card ── */
    gsap.fromTo('.contacto-card', { opacity: 0, x: 40 }, {
      opacity: 1, x: 0, duration: 1, ease: 'power3.out',
      scrollTrigger: { trigger: '.contacto-card', start: 'top 80%' },
    });

    /* ── WhatsApp CTA ── */
    gsap.fromTo('.whatsapp-cta', { opacity: 0, x: -20 }, {
      opacity: 1, x: 0, duration: 0.8, ease: 'power3.out',
      scrollTrigger: { trigger: '.whatsapp-cta', start: 'top 82%' },
    });

    /* ── Section counters ── */
    gsap.utils.toArray('.section-counter').forEach(el => {
      gsap.fromTo(el, { opacity: 0 }, {
        opacity: 1, duration: 1, ease: 'power2.out',
        scrollTrigger: { trigger: el, start: 'top 90%' },
      });
    });

    /* ── Footer reveal — texto gigante ── */
    const footerSpans = document.querySelectorAll('.footer-reveal-text span');
    if (footerSpans.length) {
      gsap.to(footerSpans, {
        y: 0, duration: 1.4, ease: 'power4.out', stagger: 0.1,
        scrollTrigger: { trigger: '.site-footer', start: 'top 85%', toggleActions: 'play none none none' },
      });
    }

    ScrollTrigger.refresh();
  }

  /* ─────────────────────────────────────────
     8. MAGNETIC BUTTONS
  ───────────────────────────────────────── */
  function initMagneticButtons() {
    if (!window.matchMedia('(hover: hover)').matches) return;
    document.querySelectorAll('.btn--primary, .servicio-link').forEach(btn => {
      btn.addEventListener('mousemove', e => {
        const r = btn.getBoundingClientRect();
        const x = (e.clientX - r.left - r.width  / 2) * 0.25;
        const y = (e.clientY - r.top  - r.height / 2) * 0.25;
        btn.style.transform = `translate(${x}px,${y}px)`;
      });
      btn.addEventListener('mouseleave', () => {
        btn.style.transition = 'transform 0.5s cubic-bezier(0.16,1,0.3,1)';
        btn.style.transform  = '';
        setTimeout(() => { btn.style.transition = ''; }, 500);
      });
    });
  }

  /* ─────────────────────────────────────────
     9. LOGO HOVER SPARKLE
  ───────────────────────────────────────── */
  function initLogoInteraction() {
    const logo = document.querySelector('.nav-logo');
    if (!logo || !window.matchMedia('(hover: hover)').matches) return;
    logo.addEventListener('mouseenter', () => {
      if (document.documentElement.getAttribute('data-theme') !== 'dark') return;
      const glow = logo.querySelector('.brain-light-glow');
      if (glow) glow.style.filter = 'drop-shadow(0 0 12px rgba(255,229,102,0.9)) drop-shadow(0 0 24px rgba(255,229,102,0.5))';
    });
    logo.addEventListener('mouseleave', () => {
      const glow = logo.querySelector('.brain-light-glow');
      if (glow) glow.style.filter = '';
    });
  }

  /* ─────────────────────────────────────────
     10. ACTIVE NAV
  ───────────────────────────────────────── */
  function initActiveNav() {
    const navLinks = document.querySelectorAll('.nav-link');
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const id = entry.target.id;
        navLinks.forEach(link => {
          const active = link.getAttribute('href') === `#${id}` && !link.classList.contains('nav-link--cta');
          link.style.color      = active ? 'var(--text)' : '';
          link.style.background = active ? 'var(--border-soft)' : '';
        });
      });
    }, { rootMargin: '-40% 0px -50% 0px' });
    document.querySelectorAll('section[id]').forEach(s => observer.observe(s));
  }

  /* ─────────────────────────────────────────
     11. BRAIN LIGHT — intensidad por scroll
  ───────────────────────────────────────── */
  function initBrainScrollEffect() {
    const glow = document.querySelector('.brain-light-glow');
    const rays = document.querySelector('.light-rays');
    if (!glow) return;
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        if (document.documentElement.getAttribute('data-theme') !== 'dark') { ticking = false; return; }
        const max   = document.documentElement.scrollHeight - window.innerHeight;
        const ratio = max > 0 ? Math.min(window.scrollY / max, 1) : 0;
        glow.style.filter = `drop-shadow(0 0 ${4 + ratio * 14}px rgba(255,229,102,${0.5 + ratio * 0.4}))`;
        if (rays) rays.style.opacity = 0.6 + ratio * 0.4;
        ticking = false;
      });
    }, { passive: true });
  }

  /* ─────────────────────────────────────────
     12. MAIN
  ───────────────────────────────────────── */
  function main() {
    initNav();
    initTestimonios();
    initMagneticButtons();
    initLogoInteraction();
    initActiveNav();
    initBrainScrollEffect();
    waitForGSAP(initGSAP);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => initLoader(main));
  } else {
    initLoader(main);
  }

})();
