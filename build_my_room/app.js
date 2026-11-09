(function () {
  const page = document.body.dataset.page;
  const app = document.getElementById("app");

  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const thumb = (f) => "images/thumbs/" + f.replace(/\.(png|jpg)$/i, ".jpg");
  const full = (f) => "images/" + f;
  const themeHref = (t) => t.id + ".html";
  const fullPrompt = (p) => BASE_LOCK + " " + p;

  /* ---------- shared chrome ---------- */
  function header(active) {
    const links = THEMES.map((t) =>
      `<a href="${themeHref(t)}"${active === t.id ? ' aria-current="page"' : ""}>${esc(t.name)}</a>`
    ).join("");
    return `
      <header class="top">
        <div class="wrap top-row">
          <a class="brand" href="index.html"><span class="brand-dot"></span>Build&nbsp;My&nbsp;Room</a>
          <nav class="top-nav">
            <a href="index.html"${active === "home" ? ' aria-current="page"' : ""}>All themes</a>
            <a href="prompts.html"${active === "prompts" ? ' aria-current="page"' : ""}>Prompts</a>
            <a href="../index.html">Portfolio ↗</a>
          </nav>
        </div>
        <div class="wrap theme-strip">${links}</div>
      </header>`;
  }

  function footer() {
    return `<footer class="foot"><div class="wrap">Build My Room · AI concept renders of one real room · <a href="prompts.html">Make more variations</a></div></footer>`;
  }

  function figure(img, gi, idx) {
    return `
      <figure class="shot" data-g="${gi}" data-i="${idx}">
        <button class="shot-btn" aria-label="Open ${esc(img.title)} full size">
          <img src="${thumb(img.file)}" alt="${esc(img.title)}: ${esc(img.note)}" loading="lazy" width="900" height="528">
        </button>
        <figcaption><strong>${esc(img.title)}</strong><span>${esc(img.note)}</span></figcaption>
      </figure>`;
  }

  function promptCard(text, label, results) {
    const res = (results || []).map((r) => `
      <figure class="shot result" data-g="${r.ti}" data-i="${r.idx}">
        <button class="shot-btn" aria-label="Open result: ${esc(r.img.title)}"><img src="${thumb(r.img.file)}" alt="Result: ${esc(r.img.title)}" loading="lazy" width="900" height="502"></button>
      </figure>`).join("");
    return `
      <div class="prompt">
        <div class="prompt-head"><span>${esc(label)}</span><button class="copy" data-copy="${esc(fullPrompt(text))}">Copy</button></div>
        <p>${esc(text)}</p>
        ${res ? `<div class="results"><span class="mini">Result${results.length > 1 ? "s" : ""}</span>${res}</div>` : ""}
      </div>`;
  }

  /* All prompt cards for one theme, each with the renders it produced. */
  function themePrompts(t, ti) {
    return t.prompts.map((p, pi) => {
      const results = t.images.map((img, idx) => ({ img, ti, idx })).filter((r) => r.img.prompt === pi);
      const label = t.promptNames ? t.promptNames[pi] : pi === 0 ? "Recreate" : "Variation " + pi;
      return promptCard(p, label, results);
    }).join("");
  }

  /* ---------- pages ---------- */
  function renderHome() {
    const total = THEMES.reduce((n, t) => n + t.images.length, 0);
    const fromPrompts = THEMES.reduce((n, t) => n + t.images.filter((i) => i.round === 2).length, 0);
    app.innerHTML = header("home") + `
      <main>
        <section class="hero wrap">
          <div class="hero-text">
            <p class="eyebrow">Room concept board</p>
            <h1>One empty room.<br><span class="grad">Seven ways to build it.</span></h1>
            <p class="lead">${total} AI renders of the same room, from a robotics R&amp;D lab to a Kandyan-heritage bedroom. ${fromPrompts} of them were made with the prompt kit on this site. Pick a theme to see every variation, or grab a prompt and make more.</p>
            <div class="hero-cta">
              <a class="btn" href="#themes">Browse themes</a>
              <a class="btn ghost" href="prompts.html">Get the prompts</a>
            </div>
          </div>
          <figure class="hero-base shot" data-g="base" data-i="0">
            <button class="shot-btn" aria-label="Open the empty room full size">
              <img src="${thumb(BASE_ROOM.file)}" alt="${esc(BASE_ROOM.note)}" width="900" height="528">
            </button>
            <figcaption><strong>Starting point</strong><span>${esc(BASE_ROOM.note)}</span></figcaption>
          </figure>
        </section>

        <section id="themes" class="wrap">
          <h2 class="section-title">Themes</h2>
          <div class="theme-grid">
            ${THEMES.map((t) => `
              <a class="theme-card" href="${themeHref(t)}">
                <div class="theme-card-img"><img src="${thumb(t.images[0].file)}" alt="${esc(t.name)} preview" loading="lazy" width="900" height="528"><span class="count">${t.images.length} renders</span></div>
                <div class="theme-card-body">
                  <h3>${esc(t.name)}</h3>
                  <p>${esc(t.tagline)}</p>
                  <div class="swatches">${t.palette.map((c) => `<i style="background:${c}"></i>`).join("")}<em>${esc(t.mood)}</em></div>
                </div>
              </a>`).join("")}
          </div>
        </section>
      </main>` + footer();
  }

  function renderTheme() {
    const id = document.body.dataset.theme;
    const ti = THEMES.findIndex((t) => t.id === id);
    const t = THEMES[ti];
    const prev = THEMES[(ti - 1 + THEMES.length) % THEMES.length];
    const next = THEMES[(ti + 1) % THEMES.length];
    app.innerHTML = header(t.id) + `
      <main class="wrap">
        <section class="theme-head">
          <p class="eyebrow">Theme ${ti + 1} of ${THEMES.length}</p>
          <h1>${esc(t.name)}</h1>
          <p class="lead">${esc(t.description)}</p>
          <div class="swatches big">${t.palette.map((c) => `<i style="background:${c}" title="${c}"></i>`).join("")}<em>${esc(t.mood)}</em></div>
        </section>

        ${galleries(t, ti)}

        <section class="two-col">
          <div class="panel">
            <h2>What's in the room</h2>
            <ul class="ticks">${t.elements.map((e) => `<li>${esc(e)}</li>`).join("")}</ul>
            <div class="compare">
              <p class="mini">Before</p>
              <figure class="shot" data-g="base" data-i="0"><button class="shot-btn" aria-label="Open the empty room"><img src="${thumb(BASE_ROOM.file)}" alt="Empty room before" loading="lazy" width="900" height="528"></button></figure>
            </div>
          </div>
          <div class="panel">
            <h2>Prompts for more like this</h2>
            <p class="mini">Copy adds the base-room lock text automatically. Attach your empty-room photo when you paste.</p>
            ${themePrompts(t, ti)}
          </div>
        </section>

        <nav class="pager">
          <a href="${themeHref(prev)}">← ${esc(prev.name)}</a>
          <a href="${themeHref(next)}">${esc(next.name)} →</a>
        </nav>
      </main>` + footer();
  }

  /* First-round renders, then the ones made from this site's prompts. */
  function galleries(t, ti) {
    const all = t.images.map((img, i) => ({ img, i }));
    const r1 = all.filter((x) => x.img.round !== 2);
    const r2 = all.filter((x) => x.img.round === 2);
    let html = "";
    if (r1.length) html += `<section class="gallery">${r1.map((x) => figure(x.img, ti, x.i)).join("")}</section>`;
    if (r2.length) html += `
      ${r1.length ? `<h2 class="section-title">From the prompts <em>${r2.length} new</em></h2>` : ""}
      <section class="gallery${r1.length ? " even" : ""}">${r2.map((x) => figure(x.img, ti, x.i)).join("")}</section>`;
    return html;
  }

  function renderPrompts() {
    const nd = THEMES.findIndex((t) => t.id === "new-directions");
    app.innerHTML = header("prompts") + `
      <main class="wrap">
        <section class="theme-head">
          <p class="eyebrow">Prompt kit</p>
          <h1>Make more variations</h1>
          <p class="lead">Attach the empty-room photo, paste a prompt, then add modifiers. Every <b>Copy</b> button includes the base-room lock below, so the window and walls stay put.</p>
        </section>

        <section class="panel lock">
          <div class="prompt-head"><h2>1 · Base-room lock</h2><button class="copy" data-copy="${esc(BASE_LOCK)}">Copy</button></div>
          <p>${esc(BASE_LOCK)}</p>
        </section>

        <h2 class="section-title">2 · Theme prompts</h2>
        <div class="prompt-themes">
          ${THEMES.map((t, ti) => ti === nd ? "" : `
            <section class="panel">
              <div class="pt-head"><img src="${thumb(t.images[0].file)}" alt="" loading="lazy" width="900" height="528"><div><h3><a href="${themeHref(t)}">${esc(t.name)}</a></h3><p class="mini">${esc(t.tagline)}</p></div></div>
              ${themePrompts(t, ti)}
            </section>`).join("")}
        </div>

        <h2 class="section-title">3 · New directions <a href="new-directions.html">see all →</a></h2>
        <div class="new-grid">
          ${themePrompts(THEMES[nd], nd)}
        </div>

        <h2 class="section-title">4 · Modifiers</h2>
        <p class="mini">Tap a chip to copy it, then add it to the end of any prompt.</p>
        <div class="mods">
          ${MODIFIERS.map((m) => `
            <div class="panel"><h3>${esc(m.group)}</h3><div class="chips">${m.items.map((x) => `<button class="chip copy" data-copy="${esc(x)}" data-raw="1">${esc(x)}</button>`).join("")}</div></div>`).join("")}
        </div>

        <section class="panel tips">
          <h2>Tips</h2>
          <ul class="ticks">
            <li>Change one thing per round ("same room, but…"). Big rewrites drift away from the real room.</li>
            <li>If text comes out garbled, add <i>"make all labels readable and correctly spelled"</i> or remove the text.</li>
            <li>Keep a winning render and use it as the base for the next round instead of the empty room.</li>
            <li>Ask for a top-down floor plan to check whether a layout actually fits.</li>
          </ul>
        </section>
      </main>` + footer();
  }

  /* ---------- lightbox ---------- */
  function lightbox() {
    const groups = { base: [BASE_ROOM] };
    THEMES.forEach((t, i) => (groups[i] = t.images));
    let g = null, i = 0;
    const box = document.createElement("div");
    box.className = "lb";
    box.hidden = true;
    box.innerHTML = `
      <button class="lb-x" aria-label="Close">×</button>
      <button class="lb-nav lb-prev" aria-label="Previous">‹</button>
      <figure><img alt=""><figcaption></figcaption></figure>
      <button class="lb-nav lb-next" aria-label="Next">›</button>`;
    document.body.appendChild(box);
    const img = box.querySelector("img"), cap = box.querySelector("figcaption");

    function show() {
      const list = groups[g], it = list[i];
      img.src = full(it.file);
      img.alt = it.title;
      cap.innerHTML = `<strong>${esc(it.title)}</strong> · ${esc(it.note)} <span>${i + 1} / ${list.length}</span>`;
      box.querySelectorAll(".lb-nav").forEach((b) => (b.hidden = list.length < 2));
    }
    const open = (gg, ii) => { g = gg; i = ii; show(); box.hidden = false; document.body.style.overflow = "hidden"; box.querySelector(".lb-x").focus(); };
    const close = () => { box.hidden = true; document.body.style.overflow = ""; };
    const step = (d) => { const n = groups[g].length; i = (i + d + n) % n; show(); };

    document.addEventListener("click", (e) => {
      const fig = e.target.closest(".shot");
      if (fig && e.target.closest(".shot-btn")) open(fig.dataset.g, +fig.dataset.i);
    });
    box.addEventListener("click", (e) => {
      if (e.target.closest(".lb-prev")) step(-1);
      else if (e.target.closest(".lb-next")) step(1);
      else if (e.target === box || e.target.closest(".lb-x")) close();
    });
    document.addEventListener("keydown", (e) => {
      if (box.hidden) return;
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") step(-1);
      if (e.key === "ArrowRight") step(1);
    });
    let x0 = null;
    box.addEventListener("touchstart", (e) => (x0 = e.touches[0].clientX), { passive: true });
    box.addEventListener("touchend", (e) => {
      if (x0 === null) return;
      const dx = e.changedTouches[0].clientX - x0;
      if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1);
      x0 = null;
    });
  }

  /* ---------- copy buttons ---------- */
  function copyButtons() {
    document.addEventListener("click", async (e) => {
      const b = e.target.closest(".copy");
      if (!b) return;
      const text = b.dataset.copy;
      try {
        await navigator.clipboard.writeText(text);
      } catch (_) {
        const ta = document.createElement("textarea");
        ta.value = text; document.body.appendChild(ta); ta.select();
        try { document.execCommand("copy"); } catch (__) {}
        ta.remove();
      }
      const old = b.textContent;
      b.classList.add("done");
      b.textContent = b.dataset.raw ? "✓ copied" : "Copied ✓";
      setTimeout(() => { b.classList.remove("done"); b.textContent = old; }, 1400);
    });
  }

  if (page === "home") renderHome();
  else if (page === "theme") renderTheme();
  else if (page === "prompts") renderPrompts();
  lightbox();
  copyButtons();
})();
