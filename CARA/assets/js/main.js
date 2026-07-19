/* CARA Project — main.js
   Nav injection + dark/light mode toggle */
(function () {

  /* ── Theme: restore saved preference immediately ─────── */
  const savedTheme = localStorage.getItem('cara-theme');
  if (savedTheme === 'light') {
    document.documentElement.classList.add('light');
  }

  function getThemeIcon() {
    return document.documentElement.classList.contains('light') ? '🌙' : '☀';
  }

  function toggleTheme() {
    const isNowLight = document.documentElement.classList.toggle('light');
    localStorage.setItem('cara-theme', isNowLight ? 'light' : 'dark');
    const icon = document.getElementById('theme-icon');
    if (icon) icon.textContent = getThemeIcon();
  }

  /* ── Path helpers ─────────────────────────────────────── */
  const path       = location.pathname;
  const inBlog      = path.includes('/blog/');
  const inAppendix  = path.includes('/appendix/');
  const inSub      = inBlog || inAppendix;
  const base       = inSub ? '../' : '';
  const root       = inSub ? '../../' : '../';
  const blogHref     = inBlog     ? './' : 'blog/';
  const appendixHref = inAppendix ? './' : 'appendix/';

  const page        = path.split('/').pop() || 'index.html';
  const isBlogIndex = inSub && (page === 'index.html' || page === '');

  function a(href, label) {
    let cur = false;
    if (href === 'index.html') {
      // Home — only active at CARA root, never inside /blog/ or /appendix/
      cur = !inSub && (page === 'index.html' || page === '');
    } else if (href === blogHref) {
      // Blog — active whenever we are inside /blog/ (not /appendix/)
      cur = inBlog;
    } else if (href === appendixHref) {
      // Appendix — active whenever we are inside /appendix/ (not /blog/)
      cur = inAppendix;
    } else {
      // All other pages — simple filename match
      cur = href.split('/').pop() === page;
    }
    return `<a href="${base}${href}"${cur ? ' class="active"' : ''}>${label}</a>`;
  }

  function group(label, items) {
    const rendered  = items.map(([href, lbl]) => a(href, lbl));
    const hasActive = rendered.some(html => html.includes('class="active"'));
    return `<div class="nav-group${hasActive ? ' has-active' : ''}">
      <button class="nav-group-btn">${label}</button>
      <div class="nav-drop">
        ${rendered.join('')}
      </div>
    </div>`;
  }

  /* ── Nav HTML ─────────────────────────────────────────── */
  const html = `
    <a href="${base}index.html" class="nav-brand">CARA <span>Project</span></a>
    <div class="nav-links">
      ${a('index.html', 'Home')}
      ${group('Project',  [['about.html','About'],['objectives.html','Objectives']])}
      ${group('Research', [['research.html','Literature'],['fieldbooks.html','Field Books']])}
      ${group('System',   [['features.html','Features'],['hardware.html','Hardware'],['architecture.html','Architecture'],['docs.html','Docs'],[appendixHref,'Appendix']])}
      ${a('timeline.html', 'Timeline')}
      ${a('gallery.html',  'Gallery')}
      ${a(blogHref,        'Blog')}
      ${a('contact.html',  'Contact')}
    </div>
    <button class="nav-toggle" id="nav-toggle" aria-label="Menu">☰</button>
    <button class="theme-toggle" id="theme-toggle" aria-label="Toggle theme" title="Toggle dark/light mode">
      <span id="theme-icon">${getThemeIcon()}</span>
    </button>
    <a href="${root}" class="nav-portfolio">↗ portfolio</a>
  `;

  const nav = document.querySelector('.site-nav');
  if (nav) nav.innerHTML = html;

  /* ── Theme toggle event ───────────────────────────────── */
  const themeBtn = document.getElementById('theme-toggle');
  if (themeBtn) themeBtn.addEventListener('click', toggleTheme);

  /* ── Mobile toggle ────────────────────────────────────── */
  const toggle = document.getElementById('nav-toggle');
  const links  = nav && nav.querySelector('.nav-links');

  if (toggle && links) {
    toggle.addEventListener('click', (e) => {
      e.stopPropagation();
      links.classList.toggle('open');
      toggle.textContent = links.classList.contains('open') ? '✕' : '☰';
    });
    links.querySelectorAll('a').forEach(el => {
      el.addEventListener('click', () => {
        links.classList.remove('open');
        toggle.textContent = '☰';
      });
    });
  }

  /* ── Click outside closes mobile nav ─────────────────── */
  document.addEventListener('click', (e) => {
    if (links && !nav.contains(e.target)) {
      links.classList.remove('open');
      if (toggle) toggle.textContent = '☰';
    }
  });

  /* ── Dropdown group toggle (click) ───────────────────── */
  document.addEventListener('click', () => {
    document.querySelectorAll('.nav-group').forEach(g => g.classList.remove('open'));
  });

  if (nav) {
    nav.querySelectorAll('.nav-group-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const g       = btn.closest('.nav-group');
        const wasOpen = g.classList.contains('open');
        document.querySelectorAll('.nav-group').forEach(x => x.classList.remove('open'));
        if (!wasOpen) g.classList.add('open');
      });
    });
  }

})();
