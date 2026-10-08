/* =====================================================================
   CARA 2 — documentation & research journal · site script
   - header (grouped nav) / footer injection, theme toggle, mobile menu
   - index renderers: daily notes, journal entries, experiments, gallery
   - per-page helpers: note media + prev/next, experiment back-links
   - print helpers, image lightbox, click-to-load YouTube embeds
   Every page sets <body data-root="…" data-page="…">; data-root is the
   relative path back to /CARA2/. Indexes live in ../data/*.js.
   ===================================================================== */
(function () {
  'use strict';

  var B = document.body;
  var ROOT = (B && B.dataset.root) || '';
  var PAGE = (B && B.dataset.page) || '';

  /* ── storage (guarded: private mode / blocked storage) ─────────── */
  function store(key, val) {
    try {
      if (val === undefined) return window.localStorage.getItem(key);
      window.localStorage.setItem(key, val);
    } catch (e) { return null; }
  }

  /* ── theme ─────────────────────────────────────────────────────── */
  var saved = store('cara2-theme');
  if (saved === 'light' || saved === 'dark') document.documentElement.setAttribute('data-theme', saved);
  function currentTheme() {
    var t = document.documentElement.getAttribute('data-theme');
    if (t) return t;
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  function toggleTheme() {
    var next = currentTheme() === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    store('cara2-theme', next);
    var b = document.getElementById('theme-btn');
    if (b) b.textContent = next === 'dark' ? '☀' : '☾';
  }

  /* ── helpers ───────────────────────────────────────────────────── */
  var MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  var DOW = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  function parseDate(iso) {
    var p = String(iso).split('-').map(Number);
    var d = new Date(Date.UTC(p[0], p[1] - 1, p[2]));
    return { y: p[0], m: p[1], d: p[2], dow: DOW[d.getUTCDay()], month: MONTHS[p[1] - 1] };
  }
  function longDate(iso) { var p = parseDate(iso); return p.d + ' ' + p.month + ' ' + p.y; }
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function url(path) {
    if (!path) return '';
    if (/^(https?:)?\/\//.test(path) || path.charAt(0) === '/') return path;
    return ROOT + path;
  }
  function $(sel, el) { return (el || document).querySelector(sel); }
  function $all(sel, el) { return Array.prototype.slice.call((el || document).querySelectorAll(sel)); }

  var DAILY = window.CARA2_DAILY || [];
  var JOURNAL = window.CARA2_JOURNAL || [];
  var EXPS = window.CARA2_EXPERIMENTS || [];

  function noteId(n) { return 'DN-' + n.date.replace(/-/g, '') + (n.seq ? '-' + n.seq : ''); }
  function noteFile(n) { return n.date + (n.seq ? '-' + n.seq : '') + '.html'; }
  function expFile(e) { return e.id.toLowerCase() + '.html'; }
  function expById(id) { for (var i = 0; i < EXPS.length; i++) if (EXPS[i].id === id) return EXPS[i]; return null; }
  function expChip(id) {
    var e = expById(id);
    return '<a class="tag exp" href="' + ROOT + 'experiments/' + esc(id.toLowerCase()) + '.html" title="' + esc(e ? e.title : id) + '">' + esc(id) + '</a>';
  }
  function statusPill(s) { return '<span class="pill ' + esc(String(s).toLowerCase()) + '">' + esc(s) + '</span>'; }
  function sortedDaily() {
    return DAILY.slice().sort(function (a, b) { return (b.date + (b.seq || 0)).localeCompare(a.date + (a.seq || 0)); });
  }
  function sortedJournal() { return JOURNAL.slice().sort(function (a, b) { return b.id.localeCompare(a.id); }); }

  /* ── header / footer ───────────────────────────────────────────── */
  var NAV = [
    ['Home', '', 'home'],
    ['Project', [['About', 'about.html', 'about'], ['Objectives', 'objectives.html', 'objectives']]],
    ['System', [['Architecture', 'architecture.html', 'architecture'], ['Hardware', 'hardware.html', 'hardware'], ['Features', 'features.html', 'features']]],
    ['Daily Notes', 'daily/', 'daily'],
    ['Journal', 'journal/', 'journal'],
    ['Experiments', 'experiments/', 'experiments'],
    ['Gallery', 'gallery.html', 'gallery']
  ];
  function link(label, href, key) {
    return '<a href="' + ROOT + href + '"' + (PAGE === key ? ' aria-current="page"' : '') + '>' + label + '</a>';
  }
  function header() {
    var nav = NAV.map(function (item) {
      if (typeof item[1] === 'string') return link(item[0], item[1], item[2]);
      var active = item[1].some(function (c) { return c[2] === PAGE; });
      return '<div class="nav-group' + (active ? ' active' : '') + '"><button class="nav-group-btn" aria-haspopup="true">' + item[0] + '</button>' +
        '<div class="nav-drop">' + item[1].map(function (c) { return link(c[0], c[1], c[2]); }).join('') + '</div></div>';
    }).join('') + '<a class="ext" href="' + ROOT + '../CARA/">V1</a>';
    var h = document.createElement('header');
    h.className = 'site-head';
    h.innerHTML =
      '<a class="skip" href="#main">Skip to content</a>' +
      '<div class="wrap">' +
        '<a class="brand" href="' + ROOT + '"><b>CARA<sup>2</sup></b><span>Documentation &amp; Journal</span></a>' +
        '<button class="icon-btn menu-btn" id="menu-btn" aria-expanded="false" aria-controls="site-nav">Menu</button>' +
        '<nav class="nav" id="site-nav" aria-label="Main">' + nav +
          '<button class="icon-btn" id="theme-btn" title="Toggle light/dark" aria-label="Toggle light or dark theme">' + (currentTheme() === 'dark' ? '☀' : '☾') + '</button>' +
        '</nav>' +
      '</div>';
    B.insertBefore(h, B.firstChild);
    $('#theme-btn').addEventListener('click', toggleTheme);
    var mb = $('#menu-btn'), sn = $('#site-nav');
    mb.addEventListener('click', function () {
      var open = sn.classList.toggle('open');
      mb.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    $all('.nav-group-btn', h).forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.stopPropagation();
        var g = btn.parentNode, was = g.classList.contains('open');
        $all('.nav-group.open', h).forEach(function (x) { x.classList.remove('open'); });
        if (!was) g.classList.add('open');
      });
    });
    document.addEventListener('click', function () { $all('.nav-group.open', h).forEach(function (x) { x.classList.remove('open'); }); });
  }

  function footer() {
    var f = document.createElement('footer');
    f.className = 'site-foot';
    f.innerHTML =
      '<div class="wrap">' +
        '<div><h4>CARA<sup>2</sup></h4>' +
          '<p>Documentation and open research journal for CARA V2.0 — the independent continuation of the Companion Assistive Robot for the Aged. Negative results are reported; corrections are appended, never silently edited.</p>' +
          '<p>© 2026 Jayashanka Anushan. Text licensed CC BY 4.0 unless stated otherwise.</p></div>' +
        '<div><h4>Documentation</h4><ul>' +
          '<li><a href="' + ROOT + 'about.html">About</a></li>' +
          '<li><a href="' + ROOT + 'objectives.html">Objectives</a></li>' +
          '<li><a href="' + ROOT + 'architecture.html">Architecture</a></li>' +
          '<li><a href="' + ROOT + 'hardware.html">Hardware</a></li>' +
          '<li><a href="' + ROOT + 'features.html">Features</a></li></ul></div>' +
        '<div><h4>Research record</h4><ul>' +
          '<li><a href="' + ROOT + 'daily/">Daily Notes</a></li>' +
          '<li><a href="' + ROOT + 'journal/">Journal</a></li>' +
          '<li><a href="' + ROOT + 'experiments/">Experiments</a></li>' +
          '<li><a href="' + ROOT + 'gallery.html">Gallery</a></li>' +
          '<li><a href="https://github.com/JayashankaAnushan19/CARA-Companion-Assistive-Robot-for-the-Aged-V2.0">Source code</a></li>' +
          '<li><a href="' + ROOT + '../CARA/">V1 documentary</a></li></ul></div>' +
      '</div>';
    B.appendChild(f);
  }

  /* ── media ─────────────────────────────────────────────────────── */
  function mediaHTML(items) {
    if (!items || !items.length) return '';
    return '<div class="gallery">' + items.map(function (m) {
      var cap = m.caption ? '<figcaption>' + m.caption + '</figcaption>' : '';
      if (m.type === 'youtube') {
        return '<figure><button class="yt" data-yt="' + esc(m.id) + '" aria-label="Play video" style="background-image:url(https://i.ytimg.com/vi/' + esc(m.id) + '/hqdefault.jpg)"></button>' +
          '<p class="print-video-note">Video: https://youtu.be/' + esc(m.id) + '</p>' + cap + '</figure>';
      }
      if (m.type === 'video') {
        return '<figure><video controls preload="none"' + (m.poster ? ' poster="' + esc(url(m.poster)) + '"' : '') + ' src="' + esc(url(m.src)) + '"></video>' +
          '<p class="print-video-note">Video: ' + esc(m.src) + '</p>' + cap + '</figure>';
      }
      return '<figure><img loading="lazy" src="' + esc(url(m.src)) + '" alt="' + esc(m.alt || String(m.caption || '').replace(/<[^>]+>/g, '')) + '" data-zoom>' + cap + '</figure>';
    }).join('') + '</div>';
  }
  function wireMedia(scope) {
    $all('.yt[data-yt]', scope).forEach(function (b) {
      if (b.dataset.wired) return;
      b.dataset.wired = '1';
      b.addEventListener('click', function () {
        if (b.classList.contains('playing')) return;
        b.classList.add('playing');
        b.innerHTML = '<iframe src="https://www.youtube-nocookie.com/embed/' + encodeURIComponent(b.dataset.yt) +
          '?autoplay=1&rel=0" title="YouTube video" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe>';
      });
    });
    $all('img[data-zoom]', scope).forEach(function (img) {
      if (img.dataset.wired) return;
      img.dataset.wired = '1';
      img.addEventListener('click', function () { openLightbox(img.currentSrc || img.src, img.alt); });
    });
  }
  var lb;
  function openLightbox(src, alt) {
    if (!lb) {
      lb = document.createElement('div');
      lb.className = 'lightbox';
      lb.setAttribute('role', 'dialog');
      lb.setAttribute('aria-modal', 'true');
      lb.innerHTML = '<button aria-label="Close">×</button><img alt=""><p></p>';
      B.appendChild(lb);
      lb.addEventListener('click', function (e) { if (e.target === lb || e.target.tagName === 'BUTTON') lb.classList.remove('open'); });
      document.addEventListener('keydown', function (e) { if (e.key === 'Escape') lb.classList.remove('open'); });
    }
    $('img', lb).src = src;
    $('img', lb).alt = alt || '';
    $('p', lb).textContent = alt || '';
    lb.classList.add('open');
  }

  /* ── Daily Notes index ─────────────────────────────────────────── */
  function renderDailyIndex(el) {
    var notes = sortedDaily();
    if (!notes.length) { el.innerHTML = '<p class="muted">No notes yet.</p>'; return; }
    el.innerHTML = '<ol class="note-index">' + notes.map(function (n) {
      var p = parseDate(n.date);
      var cover = (n.media || []).filter(function (m) { return m.type === 'image'; })[0];
      return '<li data-tags="' + esc((n.tags || []).concat(n.experiments || []).join('|')) + '">' +
        '<div class="ni-date"><span class="d">' + p.d + '</span><span class="my">' + p.month.slice(0, 3) + ' ' + p.y + '</span><span class="nid">' + esc(noteId(n)) + '</span></div>' +
        '<div class="ni-body"><h3><a href="' + ROOT + 'daily/' + esc(noteFile(n)) + '">' + esc(n.title) + '</a></h3>' +
          '<p>' + esc(n.summary || '') + '</p>' +
          '<div class="chips">' + (n.experiments || []).map(expChip).join('') + (n.tags || []).map(function (t) { return '<span class="tag">' + esc(t) + '</span>'; }).join('') + '</div></div>' +
        (cover ? '<a class="ni-cover" href="' + ROOT + 'daily/' + esc(noteFile(n)) + '" tabindex="-1" aria-hidden="true"><img loading="lazy" src="' + esc(url(cover.src)) + '" alt=""></a>' : '') +
      '</li>';
    }).join('') + '</ol>';
    var fb = $('#daily-filters');
    if (fb) {
      var keys = {};
      notes.forEach(function (n) { (n.tags || []).concat(n.experiments || []).forEach(function (t) { keys[t] = 1; }); });
      fb.innerHTML = '<label>Filter</label><button aria-pressed="true" data-f="">All</button>' +
        Object.keys(keys).sort().map(function (k) { return '<button aria-pressed="false" data-f="' + esc(k) + '">' + esc(k) + '</button>'; }).join('');
      $all('button', fb).forEach(function (b) {
        b.addEventListener('click', function () {
          $all('button', fb).forEach(function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
          var f = b.dataset.f;
          $all('.note-index > li', el).forEach(function (li) {
            li.style.display = !f || li.dataset.tags.split('|').indexOf(f) !== -1 ? '' : 'none';
          });
        });
      });
    }
  }

  /* ── Daily Note page: media from the index + prev/next ─────────── */
  function initNotePage(el) {
    var key = el.dataset.note;                       // 'YYYY-MM-DD' or 'YYYY-MM-DD-2'
    var notes = sortedDaily();
    var idx = -1;
    for (var i = 0; i < notes.length; i++) if (noteFile(notes[i]) === key + '.html') idx = i;
    if (idx === -1) return;
    var n = notes[idx];
    var m = $('#note-media');
    if (m) { m.innerHTML = mediaHTML(n.media); wireMedia(m); }
    var chips = $('#note-chips');
    if (chips) chips.innerHTML = (n.experiments || []).map(expChip).join('') + (n.tags || []).map(function (t) { return '<span class="tag">' + esc(t) + '</span>'; }).join('');
    var pn = $('#note-pager');
    if (pn) {
      var newer = notes[idx - 1], older = notes[idx + 1];
      pn.innerHTML =
        (older ? '<a class="pg prev" href="' + esc(noteFile(older)) + '"><span>← Older</span>' + esc(older.title) + '</a>' : '<span></span>') +
        (newer ? '<a class="pg next" href="' + esc(noteFile(newer)) + '"><span>Newer →</span>' + esc(newer.title) + '</a>' : '<span></span>');
    }
  }

  /* ── Journal index ─────────────────────────────────────────────── */
  function renderJournalList(el, limit) {
    var list = sortedJournal();
    if (limit) list = list.slice(0, limit);
    if (!list.length) { el.innerHTML = '<p class="muted">No journal entries yet.</p>'; return; }
    el.innerHTML = '<ol class="toc-list">' + list.map(function (j) {
      return '<li><div><div class="jid">' + esc(j.id) + '</div><div class="jdate">' + longDate(j.published) + '</div></div>' +
        '<div><div class="paper-type">' + esc(j.type) + '</div>' +
        '<h3><a href="' + ROOT + 'journal/' + esc(j.file) + '">' + esc(j.title) + '</a></h3>' +
        '<p class="abs">' + esc(j.summary) + '</p>' +
        '<div class="chips">' + (j.experiments || []).map(expChip).join('') +
          (j.keywords || []).slice(0, 4).map(function (k) { return '<span class="tag">' + esc(k) + '</span>'; }).join('') + '</div></div></li>';
    }).join('') + '</ol>';
  }

  /* ── Experiments index & page ──────────────────────────────────── */
  function renderExperimentIndex(el) {
    if (!EXPS.length) { el.innerHTML = '<p class="muted">No experiments registered yet.</p>'; return; }
    el.innerHTML = '<div class="table-wrap"><table class="exp-table"><thead><tr><th>ID</th><th>Experiment</th><th>Area</th><th>Status</th><th>Records</th></tr></thead><tbody>' +
      EXPS.map(function (e) {
        var nN = DAILY.filter(function (n) { return (n.experiments || []).indexOf(e.id) !== -1; }).length;
        var nJ = JOURNAL.filter(function (j) { return (j.experiments || []).indexOf(e.id) !== -1; }).length;
        return '<tr><td class="mono"><a href="' + esc(expFile(e)) + '">' + esc(e.id) + '</a></td>' +
          '<td><a class="exp-title" href="' + esc(expFile(e)) + '">' + esc(e.title) + '</a><div class="small muted">' + esc(e.question) + '</div></td>' +
          '<td class="small">' + esc(e.area) + '</td><td>' + statusPill(e.status) + '</td>' +
          '<td class="small muted">' + nN + ' note' + (nN === 1 ? '' : 's') + ' · ' + nJ + ' entr' + (nJ === 1 ? 'y' : 'ies') + '</td></tr>';
      }).join('') + '</tbody></table></div>';
  }
  function renderExperimentCards(el, limit) {
    el.innerHTML = EXPS.slice(0, limit || EXPS.length).map(function (e) {
      return '<div class="card"><div class="meta">' + esc(e.id) + ' · ' + esc(e.area) + '</div>' +
        '<h3><a href="' + ROOT + 'experiments/' + esc(expFile(e)) + '">' + esc(e.title) + '</a></h3>' +
        '<p>' + esc(e.question) + '</p><div class="foot">' + statusPill(e.status) + '</div></div>';
    }).join('');
  }
  function initExperimentPage(el) {
    var e = expById(el.dataset.exp);
    if (!e) return;
    var s = $('#exp-status'); if (s) s.innerHTML = statusPill(e.status);
    var r = $('#exp-records');
    if (r) {
      var notes = sortedDaily().filter(function (n) { return (n.experiments || []).indexOf(e.id) !== -1; });
      var entries = sortedJournal().filter(function (j) { return (j.experiments || []).indexOf(e.id) !== -1; });
      var rows = entries.map(function (j) { return '<li><span class="mono">' + esc(j.id) + '</span> <a href="../journal/' + esc(j.file) + '">' + esc(j.title) + '</a> <span class="muted small">· ' + longDate(j.published) + '</span></li>'; })
        .concat(notes.map(function (n) { return '<li><span class="mono">' + esc(noteId(n)) + '</span> <a href="../daily/' + esc(noteFile(n)) + '">' + esc(n.title) + '</a> <span class="muted small">· ' + longDate(n.date) + '</span></li>'; }));
      r.innerHTML = rows.length ? '<ul class="rec-list">' + rows.join('') + '</ul>' : '<p class="muted">No notes or entries linked yet.</p>';
    }
    var pn = $('#exp-pager');
    if (pn) {
      var i = EXPS.indexOf(e), prev = EXPS[i - 1], next = EXPS[i + 1];
      pn.innerHTML =
        (prev ? '<a class="pg prev" href="' + esc(expFile(prev)) + '"><span>← ' + esc(prev.id) + '</span>' + esc(prev.title) + '</a>' : '<span></span>') +
        (next ? '<a class="pg next" href="' + esc(expFile(next)) + '"><span>' + esc(next.id) + ' →</span>' + esc(next.title) + '</a>' : '<span></span>');
    }
  }

  /* ── Home widgets ──────────────────────────────────────────────── */
  function renderRecentNotes(el, limit) {
    el.innerHTML = sortedDaily().slice(0, limit || 3).map(function (n) {
      return '<div class="card"><div class="meta">' + esc(noteId(n)) + ' · ' + longDate(n.date) + '</div>' +
        '<h3><a href="' + ROOT + 'daily/' + esc(noteFile(n)) + '">' + esc(n.title) + '</a></h3>' +
        (n.summary ? '<p>' + esc(n.summary) + '</p>' : '') +
        '<div class="foot">' + (n.experiments || []).map(expChip).join('') + '</div></div>';
    }).join('') || '<p class="muted">No notes yet.</p>';
  }
  function renderStats(el) {
    var first = DAILY.map(function (n) { return n.date; }).sort()[0] || '2026-10-08';
    var open = EXPS.filter(function (e) { return e.status !== 'Closed'; }).length;
    var p = parseDate(first);
    el.innerHTML =
      '<div class="stat"><b>' + JOURNAL.length + '</b><span>Journal entries</span></div>' +
      '<div class="stat"><b>' + DAILY.length + '</b><span>Daily notes</span></div>' +
      '<div class="stat"><b>' + open + '</b><span>Open experiments</span></div>' +
      '<div class="stat"><b>' + p.d + ' ' + p.month.slice(0, 3) + ' ' + p.y + '</b><span>V2.0 started</span></div>';
  }

  /* ── Gallery: every photo/video from the daily notes ───────────── */
  function renderGallery(el) {
    var items = [];
    sortedDaily().forEach(function (n) {
      (n.media || []).forEach(function (m) {
        var c = (m.caption || '') + ' <a href="daily/' + esc(noteFile(n)) + '">' + esc(noteId(n)) + '</a>';
        items.push({ type: m.type, src: m.src, id: m.id, poster: m.poster, alt: m.alt, caption: c });
      });
    });
    el.innerHTML = items.length ? mediaHTML(items) : '<p class="muted">No media yet.</p>';
    wireMedia(el);
  }

  /* ── Journal article page ──────────────────────────────────────── */
  function initPaper() {
    var banner = $('.paper-banner[data-entry]');
    if (!banner) return;
    var id = banner.dataset.entry.replace(/"/g, '');
    var st = document.createElement('style');
    st.textContent = '@media print { @page { @top-right { content: "' + id + '"; } } @page :first { @top-right { content: none; } } }';
    document.head.appendChild(st);
  }

  /* ── boot ──────────────────────────────────────────────────────── */
  header();
  footer();
  var main = document.getElementById('main');
  if (main) main.setAttribute('tabindex', '-1');

  var map = {
    'daily-list': renderDailyIndex,
    'journal-list': function (el) { renderJournalList(el, Number(el.dataset.limit) || 0); },
    'exp-index': renderExperimentIndex,
    'exp-cards': function (el) { renderExperimentCards(el, Number(el.dataset.limit) || 0); },
    'recent-notes': function (el) { renderRecentNotes(el, Number(el.dataset.limit) || 3); },
    'stats': renderStats,
    'gallery-all': renderGallery
  };
  Object.keys(map).forEach(function (id) { var el = document.getElementById(id); if (el) map[id](el); });
  var notePage = $('[data-note]'); if (notePage) initNotePage(notePage);
  var expPage = $('[data-exp]'); if (expPage) initExperimentPage(expPage);
  initPaper();

  $all('[data-action="print"]').forEach(function (b) { b.addEventListener('click', function () { window.print(); }); });
  $all('[data-copy]').forEach(function (b) {
    b.addEventListener('click', function () {
      var src = document.getElementById(b.dataset.copy);
      if (!src || !navigator.clipboard) return;
      navigator.clipboard.writeText(src.textContent.trim()).then(function () {
        var o = b.textContent; b.textContent = 'Copied'; setTimeout(function () { b.textContent = o; }, 1400);
      }, function () {});
    });
  });
  wireMedia(main || document);

  window.CARA2 = { longDate: longDate };
})();
