/* ═══════════════════════════════════════════
   feed.js — GitHub repos + YouTube RSS loader
═══════════════════════════════════════════ */

const GITHUB_USER  = 'JayashankaAnushan19';
const YT_HANDLE    = 'jayashankaanushan1336';

const LANG_COLORS = {
  Python:'#3572A5', JavaScript:'#f1e05a', 'C++':'#f34b7d',
  C:'#555555', Shell:'#89e051', MATLAB:'#e16737',
  HTML:'#e34c26', CSS:'#563d7c', TypeScript:'#2b7489',
  Makefile:'#427819', Jupyter:'#DA5B0B'
};

// ── GITHUB ────────────────────────────────
async function loadGitHub() {
  const container = document.getElementById('repos-container');
  if (!container) return;

  try {
    // GitHub API doesn't need a proxy — it has proper CORS headers
    // But if running from file://, add a timeout so it fails fast
    const res = await fetch(
      `https://api.github.com/users/${GITHUB_USER}/repos?sort=updated&per_page=9&type=public`,
      { signal: AbortSignal.timeout(8000) }
    );
    const repos = await res.json();

    if (!res.ok || repos.message) {
      throw new Error(repos.message || 'API error');
    }

    if (!Array.isArray(repos) || !repos.length) {
      container.innerHTML = '<p class="loading-msg">// No public repositories yet.</p>';
      return;
    }

    container.innerHTML = repos.map(repo => {
      const langDot = repo.language
        ? `<span class="repo-lang">
            <span class="lang-dot" style="background:${LANG_COLORS[repo.language] || '#6b8aaa'}"></span>
            ${repo.language}
           </span>` : '';
      const updated = repo.updated_at
        ? new Date(repo.updated_at).toLocaleDateString('en-GB', { month:'short', year:'numeric' })
        : '';
      return `
        <a href="${repo.html_url}" target="_blank" rel="noopener" class="repo-card reveal">
          <div class="repo-name">
            <svg viewBox="0 0 16 16" fill="currentColor">
              <path d="M2 2.5A2.5 2.5 0 014.5 0h8.75a.75.75 0 01.75.75v12.5a.75.75 0 01-.75.75h-2.5a.75.75 0 010-1.5h1.75v-2h-8a1 1 0 00-.714 1.7.75.75 0 01-1.072 1.05A2.495 2.495 0 012 11.5v-9zm10.5-1V9h-8c-.356 0-.694.074-1 .208V2.5a1 1 0 011-1h8z"/>
            </svg>
            ${repo.name}
          </div>
          <div class="repo-desc">${repo.description || 'No description provided.'}</div>
          <div class="repo-footer">
            ${langDot}
            <span class="repo-stars">★ ${repo.stargazers_count}</span>
            <span class="repo-forks">⑂ ${repo.forks_count}</span>
            <span class="repo-updated">${updated}</span>
          </div>
        </a>`;
    }).join('');

    container.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

  } catch (err) {
    console.warn('GitHub load error:', err.message);
    const isRateLimit = err.message?.toLowerCase().includes('rate limit');
    container.innerHTML = `
      <div style="grid-column:1/-1;background:var(--surface);border:1px solid var(--border);
        border-left:3px solid var(--accent);border-radius:6px;padding:24px 28px;">
        <p style="font-family:'Space Mono',monospace;font-size:11px;color:var(--accent);
          letter-spacing:2px;margin-bottom:10px;">
          ${isRateLimit ? '// GITHUB RATE LIMIT HIT' : '// GITHUB — OPEN LOCALLY TO TEST'}
        </p>
        <p style="font-size:13px;color:var(--text-muted);line-height:1.9;">
          ${isRateLimit
            ? 'GitHub API rate limit reached (60 req/hour). Try again shortly.'
            : 'GitHub loads correctly on GitHub Pages. Opening index.html directly as a local file blocks API calls due to browser security (CORS). Deploy to GitHub Pages to see live repos.'}
          <br><br>
          <a href="https://github.com/${GITHUB_USER}?tab=repositories" target="_blank"
            style="color:var(--accent);">View all repositories on GitHub →</a>
        </p>
      </div>`;
  }
}

// ── YOUTUBE via handle → channel ID → RSS ─
async function loadYouTube() {
  const container = document.getElementById('yt-container');
  if (!container) return;

  // ── PASTE YOUR VIDEO IDs HERE ──────────────────────────────
  // Go to your YouTube channel → click a video → copy the ID from the URL
  // youtube.com/watch?v=THIS_PART_HERE
    const FALLBACK_VIDEOS = [
    { id: 'hloTcTfTxGg', title: 'Arduino Braille-to-Text | Full Hardware Prototype Demo (JS_BlindTalk v1.0)', date: '2025' },
    { id: 'i6VVDJAOV_g', title: 'CONTROL TURTLESIM WITH A JOYSTICK?! | Arduino + ROS Setup', date: '2025' },
    { id: 'HQzhFaWsArA', title: 'Path Programming with Epson VT-6 Robot – PDE4431 Coursework Demonstration | Middlesex University', date: '2025' },
  ];
  // ────────────────────────────────────────────────────────────

  function renderVideos(videos) {
    container.innerHTML = '<div class="yt-grid">' + videos.map(v => `
      <a href="https://www.youtube.com/watch?v=${v.id}" target="_blank" rel="noopener" class="yt-card reveal">
        <div class="yt-thumb">
          <img src="https://i.ytimg.com/vi/${v.id}/mqdefault.jpg" alt="${v.title}" loading="lazy"
               onerror="this.src='https://i.ytimg.com/vi/${v.id}/hqdefault.jpg'">
          <div class="yt-play"><svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg></div>
        </div>
        <div class="yt-info">
          <div class="yt-title">${v.title}</div>
          <div class="yt-meta"><span>${v.date}</span></div>
        </div>
      </a>`).join('') + '</div>';
    container.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
  }

  container.innerHTML = '<p class="loading-msg">// Fetching latest videos...</p>';

  // Try multiple proxies in order — first one that works wins
  const PROXIES = [
    url => `https://corsproxy.io/?${encodeURIComponent(url)}`,
    url => `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`,
    url => `https://thingproxy.freeboard.io/fetch/${url}`,
  ];

  async function fetchViaProxy(targetUrl) {
    for (const makeProxy of PROXIES) {
      try {
        const res = await fetch(makeProxy(targetUrl), { signal: AbortSignal.timeout(5000) });
        if (!res.ok) continue;
        const text = await res.text();
        // allorigins wraps in JSON {contents:...}, others return raw
        try {
          const json = JSON.parse(text);
          if (json.contents) return json.contents;
        } catch {}
        return text;
      } catch { continue; }
    }
    return null;
  }

  try {
    // Step 1: get channel ID from handle page
    const pageHtml = await fetchViaProxy(`https://www.youtube.com/@${YT_HANDLE}`);
    if (!pageHtml) throw new Error('all proxies failed');

    const match = pageHtml.match(/"channelId":"(UC[^"]{20,})"/);
    if (!match) throw new Error('no channel ID found');
    const channelId = match[1];

    // Step 2: fetch RSS feed
    const rssXml = await fetchViaProxy(
      `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`
    );
    if (!rssXml) throw new Error('RSS fetch failed');

    const xml = new DOMParser().parseFromString(rssXml, 'text/xml');
    const entries = Array.from(xml.querySelectorAll('entry')).slice(0, 6);
    if (!entries.length) throw new Error('no entries');

    const liveVideos = entries.map(e => ({
      id:    e.querySelector('videoId')?.textContent || '',
      title: e.querySelector('title')?.textContent || '',
      date:  e.querySelector('published')?.textContent
               ? new Date(e.querySelector('published').textContent)
                   .toLocaleDateString('en-US', { year:'numeric', month:'short', day:'numeric' })
               : ''
    }));
    renderVideos(liveVideos);

  } catch (err) {
    console.warn('YouTube live load failed, using fallback:', err.message);

    // Show fallback videos (or instructions if IDs not filled in yet)
    if (FALLBACK_VIDEOS[0].id.startsWith('REPLACE')) {
      container.innerHTML = `
        <div style="background:var(--surface);border:1px solid var(--border);
          border-left:3px solid var(--accent3);border-radius:6px;padding:24px 28px;">
          <p style="font-family:'Space Mono',monospace;font-size:11px;
            color:var(--accent3);letter-spacing:2px;margin-bottom:14px;">
            // PASTE YOUR VIDEO IDs TO ENABLE
          </p>
          <p style="font-size:13px;color:var(--text-muted);line-height:2;">
            In <code style="color:var(--accent)">js/feed.js</code>, find 
            <code style="color:var(--accent)">FALLBACK_VIDEOS</code> and replace each 
            <code style="color:var(--accent)">REPLACE_VIDEO_ID</code> with the ID from your video URL.<br><br>
            From: <code style="color:var(--accent2)">youtube.com/watch?v=<strong>dQw4w9WgXcQ</strong></code><br>
            The ID is: <code style="color:var(--accent2)">dQw4w9WgXcQ</code><br><br>
            <a href="https://www.youtube.com/@${YT_HANDLE}" target="_blank"
              style="color:var(--accent3);">▶ Open your channel to copy video IDs →</a>
          </p>
        </div>`;
    } else {
      renderVideos(FALLBACK_VIDEOS);
    }
  }
}


// ── HELPERS ───────────────────────────────
function escHtml(s) {
  return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

// ── INIT ──────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  loadGitHub();
  loadYouTube();
});
