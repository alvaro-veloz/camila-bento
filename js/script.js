/* ═══════════════════════════════════════════════════════════════
   PSICOLOGÍA HUMANIZADA — script.js
   Interacciones, animaciones y sliders
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
     0.5 HERO SPLINE — solo se carga en desktop
     (el modelo 3D es pesado; en mobile trababa el
     scroll y gastaba batería/datos de más)
  ───────────────────────────────────────── */
  (function initHeroSpline() {
    const container = document.getElementById('heroSpline');
    if (!container) return;

    function loadSpline() {
      if (container.dataset.loaded) return;
      container.dataset.loaded = 'true';
      const iframe = document.createElement('iframe');
      iframe.src = 'https://my.spline.design/particleshandwithalan-TYf8OcSRXKPzd7m1Lp195ohC/';
      iframe.title = 'Modelo 3D interactivo — cerebro con partículas';
      iframe.loading = 'lazy';
      iframe.setAttribute('frameborder', '0');
      iframe.style.cssText = 'border:0; display:block; width:100%; height:100%;';
      container.appendChild(iframe);
    }

    // Se carga una sola vez, la primera vez que el hero entra en pantalla,
    // y ya no se desmonta más (desmontarlo y volver a montarlo causaba un
    // parpadeo del fondo de repuesto — el "filo"/luz que se veía a la derecha).
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          loadSpline();
          observer.disconnect();
        }
      });
    }, { threshold: 0.1 });
    observer.observe(container.closest('.hero'));
  })();

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
     3. LOADER
  ───────────────────────────────────────── */
  function initLoader(onComplete) {
    const loader = document.getElementById('loader');
    const bar    = document.getElementById('loaderBar');
    if (!loader) { onComplete(); return; }

    document.body.classList.add('is-loading');
    const start = performance.now();
    const dur   = 3600; // +2s extra para que el Spline termine de cargar bien

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
     6. TESTIMONIOS SLIDER
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
     7. GSAP ANIMACIONES
  ───────────────────────────────────────── */
  function initGSAP() {
    const { gsap, ScrollTrigger } = window;
    gsap.registerPlugin(ScrollTrigger);

    /* Evita que ScrollTrigger recalcule (y "salten" las animaciones)
       cuando en mobile aparece/desaparece la barra de direcciones */
    ScrollTrigger.config({ ignoreMobileResize: true });

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
  /* ─────────────────────────────────────────
     PHOTO SLIDER + LIGHTBOX
  ───────────────────────────────────────── */
  function initPhotoSlider() {
    const track    = document.getElementById('photoTrack');
    const prevBtn  = document.getElementById('photoPrev');
    const nextBtn  = document.getElementById('photoNext');
    const dotsWrap = document.getElementById('photoDots');
    if (!track) return;

    const slides = Array.from(track.querySelectorAll('.photo-slide'));
    const dots   = dotsWrap ? Array.from(dotsWrap.querySelectorAll('.photo-dot')) : [];
    const total  = slides.length;
    let current  = 0;

    function goTo(idx) {
      current = ((idx % total) + total) % total;
      track.style.transform = `translateX(-${current * 100}%)`;
      dots.forEach((d, i) => d.classList.toggle('active', i === current));
    }

    if (prevBtn) prevBtn.addEventListener('click', e => { e.stopPropagation(); goTo(current - 1); });
    if (nextBtn) nextBtn.addEventListener('click', e => { e.stopPropagation(); goTo(current + 1); });

    let tx = 0;
    track.addEventListener('touchstart', e => { tx = e.touches[0].clientX; }, { passive: true });
    track.addEventListener('touchend', e => {
      const d = tx - e.changedTouches[0].clientX;
      if (Math.abs(d) > 40) goTo(d > 0 ? current + 1 : current - 1);
    }, { passive: true });

    goTo(0);
    return { getCurrent: () => current };
  }

  function initLightbox(sliderRef) {
    const lightbox   = document.getElementById('lightbox');
    const lbImg      = document.getElementById('lightboxImg');
    const lbCounter  = document.getElementById('lightboxCounter');
    const lbClose    = document.getElementById('lightboxClose');
    const lbBackdrop = document.getElementById('lightboxBackdrop');
    const lbPrev     = document.getElementById('lightboxPrev');
    const lbNext     = document.getElementById('lightboxNext');
    if (!lightbox || !lbImg) return;

    // Cada carrusel tiene su propio set de fotos — así el visor
    // siempre agranda la foto correcta, aunque sean distintas entre sí.
    const images = Array.from(document.querySelectorAll('.photo-slide .photo-real'));

    // El marquee tiene el track duplicado x2 para el loop infinito, así
    // que tomamos solo las fotos únicas (las no-duplicadas) como fuente,
    // pero dejamos clickeables TODAS las tarjetas (reales y copias),
    // cada una apuntando a su foto real por data-lightbox-index.
    const marqueeUnique = Array.from(
      document.querySelectorAll('.photo-marquee-card:not([aria-hidden]) img[data-lightbox-index]')
    );
    const marqueeAll = Array.from(
      document.querySelectorAll('.photo-marquee-card img[data-lightbox-index]')
    );

    let activeSet = images;
    let current = 0;

    function openAt(idx, set) {
      activeSet = set || images;
      const total = activeSet.length;
      if (!total) return;
      current = ((idx % total) + total) % total;
      const src = activeSet[current].src;
      const alt = activeSet[current].alt;
      lbImg.src = src;
      lbImg.alt = alt;
      if (lbCounter) lbCounter.textContent = `${current + 1} / ${total}`;
      lightbox.hidden   = false;
      document.body.style.overflow = 'hidden';
      requestAnimationFrame(() => {
        requestAnimationFrame(() => lightbox.classList.add('is-open'));
      });
    }

    function close() {
      lightbox.classList.remove('is-open');
      document.body.style.overflow = '';
      setTimeout(() => { lightbox.hidden = true; }, 450);
    }

    function navTo(idx) {
      const total = activeSet.length;
      if (!total) return;
      lbImg.style.opacity   = '0';
      lbImg.style.transform = 'scale(0.95)';
      setTimeout(() => {
        current = ((idx % total) + total) % total;
        lbImg.src = activeSet[current].src;
        lbImg.alt = activeSet[current].alt;
        if (lbCounter) lbCounter.textContent = `${current + 1} / ${total}`;
        lbImg.style.opacity   = '1';
        lbImg.style.transform = 'scale(1)';
      }, 180);
    }

    lbImg.style.transition = 'opacity 0.18s ease, transform 0.18s ease';

    images.forEach((img, i) => {
      img.style.cursor = 'zoom-in';
      img.addEventListener('click', () => openAt(i, images));
    });

    // Fotos del segundo marquee — reales y copias abren la misma foto real
    marqueeAll.forEach(img => {
      img.style.cursor = 'zoom-in';
      const idx = parseInt(img.dataset.lightboxIndex, 10);
      img.addEventListener('click', () => openAt(idx, marqueeUnique));
    });

    if (lbClose)    lbClose.addEventListener('click', close);
    if (lbBackdrop) lbBackdrop.addEventListener('click', close);

    if (lbPrev) lbPrev.addEventListener('click', () => navTo(current - 1));
    if (lbNext) lbNext.addEventListener('click', () => navTo(current + 1));

    document.addEventListener('keydown', e => {
      if (lightbox.hidden) return;
      if (e.key === 'Escape')     close();
      if (e.key === 'ArrowLeft')  navTo(current - 1);
      if (e.key === 'ArrowRight') navTo(current + 1);
    });

    let lbTx = 0;
    lightbox.addEventListener('touchstart', e => { lbTx = e.touches[0].clientX; }, { passive: true });
    lightbox.addEventListener('touchend', e => {
      const d = lbTx - e.changedTouches[0].clientX;
      if (Math.abs(d) > 50) navTo(d > 0 ? current + 1 : current - 1);
    }, { passive: true });
  }

  /* ─────────────────────────────────────────
     13. LOTTIE — slots opcionales
     Se activan solos cuando el contenedor tiene
     un data-lottie-src con un link .json real.
  ───────────────────────────────────────── */
  /* ─────────────────────────────────────────
     12.5 MARQUEE ARRASTRABLE (especialidades)
     Autoplay suave + drag con mouse/dedo. El
     track está duplicado x2 en el HTML, así que
     el loop es perfecto haciendo módulo sobre la
     mitad del ancho total.
  ───────────────────────────────────────── */
  function initDraggableMarquee() {
    const viewport = document.querySelector('.marquee-viewport');
    const track = document.getElementById('marqueeTrack');
    if (!viewport || !track) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const SPEED = 36; // px por segundo, autoplay
    let half = track.scrollWidth / 2;
    let pos = 0;
    let dragging = false;
    let startX = 0;
    let startPos = 0;
    let resumeTimer = null;
    let lastTime = null;

    window.addEventListener('resize', () => { half = track.scrollWidth / 2; });

    function wrap(p) {
      if (half <= 0) return 0;
      p = p % half;
      if (p < 0) p += half;
      return p;
    }

    function apply() {
      track.style.transform = `translateX(${-pos}px)`;
    }

    function frame(now) {
      if (lastTime === null) lastTime = now;
      const dt = (now - lastTime) / 1000;
      lastTime = now;

      if (!dragging && !reduceMotion) {
        pos = wrap(pos + SPEED * dt);
        apply();
      }
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);

    function onDown(e) {
      dragging = true;
      track.classList.add('is-dragging');
      startX = e.clientX;
      startPos = pos;
      clearTimeout(resumeTimer);
      track.setPointerCapture && track.setPointerCapture(e.pointerId);
    }

    function onMove(e) {
      if (!dragging) return;
      const delta = e.clientX - startX;
      pos = wrap(startPos - delta);
      apply();
    }

    function onUp() {
      if (!dragging) return;
      dragging = false;
      track.classList.remove('is-dragging');
    }

    track.addEventListener('pointerdown', onDown);
    track.addEventListener('pointermove', onMove);
    track.addEventListener('pointerup', onUp);
    track.addEventListener('pointercancel', onUp);
    track.addEventListener('pointerleave', () => { if (dragging) onUp(); });

    // Evita que el navegador intente arrastrar las imágenes como si fueran links
    track.querySelectorAll('img').forEach(img => { img.draggable = false; });
  }

  function initLottieSlots() {
    const slots = document.querySelectorAll('[data-lottie-src], [data-lottie-key]');
    if (!slots.length) return;

    function run() {
      slots.forEach(el => {
        if (el.dataset.lottieLoaded) return;

        const key = el.getAttribute('data-lottie-key');
        const src = el.getAttribute('data-lottie-src');
        const embeddedData = key && window.LOTTIE_DATA ? window.LOTTIE_DATA[key] : null;

        if (!embeddedData && !src) return;

        el.dataset.lottieLoaded = 'true';
        el.classList.add('is-active');
        window.lottie.loadAnimation({
          container: el,
          renderer: 'svg',
          loop: true,
          autoplay: true,
          ...(embeddedData ? { animationData: embeddedData } : { path: src }),
        });
      });
    }

    // Espera a que lottie.min.js (y lottie-data.js) terminen de cargar,
    // en vez de rendirse si todavía no están listos.
    (function waitForLottie(tries) {
      if (window.lottie) { run(); return; }
      if (tries <= 0) return; // CDN no disponible — no rompe nada
      setTimeout(() => waitForLottie(tries - 1), 200);
    })(50); // hasta ~10s de espera
  }

  function main() {
    initNav();
    initTestimonios();
    initMagneticButtons();
    initLogoInteraction();
    initActiveNav();
    initBrainScrollEffect();
    initLottieSlots();
    initDraggableMarquee();
    const sliderRef = initPhotoSlider();
    initLightbox(sliderRef);
    waitForGSAP(initGSAP);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => initLoader(main));
  } else {
    initLoader(main);
  }

})();
