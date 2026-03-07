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

// ── INIT ───────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initReveal();
  initNav();
  initCounters();
  initSmoothScroll();
  // Terminal runs only if present
  if (document.querySelector('.type-line')) initTerminal();
});
