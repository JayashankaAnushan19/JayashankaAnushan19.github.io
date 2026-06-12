/* ═══════════════════════════════════════════
   app.js — scroll reveal, nav, counters
═══════════════════════════════════════════ */

// ── SCROLL REVEAL ──────────────────────────
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      const delay = parseInt(entry.target.dataset.delay || 0);
      setTimeout(() => entry.target.classList.add('visible'), delay);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

function initReveal() {
  document.querySelectorAll('.reveal:not(.visible)').forEach(el => {
    revealObserver.observe(el);
  });
}

// ── ACTIVE NAV ─────────────────────────────
function initNav() {
  const nav = document.getElementById('nav');
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');

  window.addEventListener('scroll', () => {
    // Scrolled class
    nav.classList.toggle('scrolled', window.scrollY > 40);

    // Active section
    let current = '';
    sections.forEach(s => {
      if (window.scrollY >= s.offsetTop - 200) current = s.id;
    });
    navLinks.forEach(a => {
      a.classList.toggle('active', a.getAttribute('href') === '#' + current);
    });
  }, { passive: true });
}

// ── ANIMATED COUNTERS ──────────────────────
function animateCount(el, target, suffix = '', duration = 1800) {
  let start = 0;
  const step = (timestamp) => {
    if (!start) start = timestamp;
    const progress = Math.min((timestamp - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
    el.textContent = Math.floor(eased * target) + suffix;
    if (progress < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

function initCounters() {
  const counterObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.target);
        const suffix = el.dataset.suffix || '';
        animateCount(el, target, suffix);
        counterObs.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('[data-target]').forEach(el => counterObs.observe(el));
}

// ── TERMINAL TYPING EFFECT ─────────────────
function initTerminal() {
  const lines = document.querySelectorAll('.type-line');
  let delay = 300;
  lines.forEach((line) => {
    const text = line.dataset.text || '';
    const speed = parseInt(line.dataset.speed || 40);
    line.textContent = '';
    setTimeout(() => {
      let i = 0;
      const type = () => {
        if (i < text.length) {
          line.textContent += text[i++];
          setTimeout(type, speed);
        } else {
          line.classList.add('done');
        }
      };
      type();
    }, delay);
    delay += text.length * speed + 200;
  });
}

// ── SMOOTH SCROLL FOR ANCHOR LINKS ─────────
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = target.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({ top: offset, behavior: 'smooth' });
      }
    });
  });
}

// ── SCROLL PROGRESS BAR ───────────────────
function initScrollProgress() {
  const bar = document.getElementById('scroll-progress');
  if (!bar) return;
  window.addEventListener('scroll', () => {
    const total = document.documentElement.scrollHeight - window.innerHeight;
    if (total > 0) bar.style.width = (window.scrollY / total * 100) + '%';
  }, { passive: true });
}

// ── BACK TO TOP ────────────────────────────
function initBackToTop() {
  const btn = document.getElementById('back-to-top');
  if (!btn) return;
  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

// ── HAMBURGER / MOBILE NAV ─────────────────
function initHamburger() {
  const hamburger = document.getElementById('nav-hamburger');
  const mobileNav = document.getElementById('mobile-nav');
  const closeBtn  = document.getElementById('mobile-nav-close');
  if (!hamburger || !mobileNav) return;

  const open = () => {
    mobileNav.classList.add('open');
    hamburger.classList.add('open');
    hamburger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  };
  const close = () => {
    mobileNav.classList.remove('open');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  };

  hamburger.addEventListener('click', () => mobileNav.classList.contains('open') ? close() : open());
  closeBtn?.addEventListener('click', close);
  mobileNav.querySelectorAll('a').forEach(a => a.addEventListener('click', close));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
}

// ── INIT ───────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initReveal();
  initNav();
  initCounters();
  initSmoothScroll();
  initScrollProgress();
  initBackToTop();
  initHamburger();
  if (document.querySelector('.type-line')) initTerminal();
});
