// Builds the multi-page documentation into ../oppein-pyramid-centre-network/
// Run: node docs-src/build.mjs
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as D from './data.mjs';
import * as Q from './boq.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.resolve(HERE, '..', 'oppein-pyramid-centre-network');
fs.mkdirSync(path.join(OUT, 'assets'), { recursive: true });

// index.html (DOC 00) is the project's entry page — the hub card links straight to it.
const PAGES = [
  ['index.html', '00', 'Overview'],
  ['floor-plan.html', '01', 'Floor plan & routes'],
  ['topology.html', '02', 'Topology & ports'],
  ['rack.html', '03', 'Rack layout'],
  ['cable-schedule.html', '04', 'Cable schedule'],
  ['materials.html', '05', 'BOQ & estimate'],
  ['equipment.html', '06', 'Equipment & buying guide'],
  ['device-lab.html', '07', 'Device lab'],
  ['installation.html', '08', 'Installation method'],
  ['testing.html', '09', 'Testing & handover'],
  ['open-items.html', '10', 'Open items'],
];

const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const f1 = n => n.toFixed(1);
const swatch = t => `<span class="sw" style="background:${D.TYPE_COLOR[t]}"></span>`;
const link = (file, text) => `<a href="${file}">${text}</a>`;
const docRef = file => { const p = PAGES.find(x => x[0] === file); return link(file, `DOC ${p[1]} · ${p[2]}`); };

/* ---------------- page shell ---------------- */
function page(file, { lead, body, wide = false, bodyClass = '', scripts = [] }) {
  const i = PAGES.findIndex(p => p[0] === file);
  const [, code, title] = PAGES[i];
  const prev = PAGES[i - 1], next = PAGES[i + 1];
  const nav = PAGES.map(([f, c, t]) =>
    `<a href="${f}"${f === file ? ' aria-current="page"' : ''}><span class="num">${c}</span>${t}</a>`).join('');
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${title} — Office 14 Network · OPPEIN</title>
<meta name="description" content="Office 14, Pyramid Centre — structured cabling and network documentation. ${esc(title)}.">
<meta name="robots" content="noindex, nofollow">
<link rel="icon" type="image/webp" href="../../assets/oppein-logo.webp">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=IBM+Plex+Sans:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap" rel="stylesheet">
<link rel="stylesheet" href="assets/style.css">
</head>
<body${bodyClass ? ` class="${bodyClass}"` : ''}>
<nav class="top">
  <div class="top-in">
    <a class="logo" href="../../index.html" title="Back to the project hub">
      <img class="logo-img" src="../../assets/oppein-logo.webp" alt="OPPEIN" onload="this.classList.add('loaded')">
      <span class="logo-dot"></span><span class="logo-txt">OPPEIN</span>
    </a>
    <span class="crumb"><a href="../../index.html">Projects</a> / <a href="index.html">Office 14 Network</a></span>
    <span class="nav-tag">${D.META.rev} · ${D.META.status}</span>
  </div>
</nav>
<div class="shell${wide ? ' wide' : ''}">
  <aside class="side" aria-label="Document pages">
    <div class="side-h">Office 14 · Pyramid Centre</div>
    <div class="side-nav">${nav}</div>
  </aside>
  <main>
    <header class="ph">
      <div class="eyebrow"><span class="led"></span>DOC ${code} · ${esc(title).toUpperCase()}</div>
      <h1>${title}</h1>
      ${lead ? `<p class="lead">${lead}</p>` : ''}
      <div class="meta"><span>${D.META.site}</span><span>${D.META.rev} · ${D.META.date}</span><span>${D.META.author}</span></div>
    </header>
${body}
    <footer class="pn">
      ${prev ? `<a class="prev" href="${prev[0]}"><small>← DOC ${prev[1]}</small>${prev[2]}</a>` : '<span></span>'}
      ${next ? `<a class="next" href="${next[0]}"><small>DOC ${next[1]} →</small>${next[2]}</a>` : '<span></span>'}
    </footer>
    <p class="foot">OPPEIN — Project hub · Office 14 Network documentation · ${D.META.rev}</p>
  </main>
</div>
${scripts.map(s => s.startsWith('<') ? s : `<script src="${s}"></script>`).join('\n')}
<script src="assets/site.js"></script>
</body>
</html>
`;
}
const section = (id, label, title, inner, sub = '') =>
  `    <section class="sec" id="${id}">
      <div class="module-label">${label}</div>
      <h2>${title}</h2>
      ${sub ? `<p class="sub">${sub}</p>` : ''}
      ${inner}
    </section>\n`;
const table = (head, rows, opts = {}) =>
  `<div class="tw"><table${opts.cls ? ` class="${opts.cls}"` : ''}><thead><tr>${head.map(h => `<th${/^(Port|PoE|Qty|Outlets|Length|Pull m|Tray m|Drops m|Sched\. m|Measured m)$/.test(h) ? ' class="n"' : ''}>${h}</th>`).join('')}</tr></thead><tbody>${rows.join('')}</tbody>${opts.foot || ''}</table></div>`;
const tiles = arr => `<div class="tiles">${arr.map(([v, l, s]) => `<div class="tile"><div class="tv">${v}</div><div class="tl">${l}</div>${s ? `<div class="ts">${s}</div>` : ''}</div>`).join('')}</div>`;
const callout = (kind, html) => `<div class="callout ${kind}">${html}</div>`;

/* ---------------- floor plan svg ---------------- */
const el = (tag, a, inner = '') => `<${tag} ${Object.entries(a).map(([k, v]) => `${k}="${v}"`).join(' ')}${inner === null ? '/>' : `>${inner}</${tag}>`}`;
const toD = p => 'M' + p.map(q => q.x.toFixed(1) + ' ' + q.y.toFixed(1)).join(' L');
function norm(a, b) { const dx = b.x - a.x, dy = b.y - a.y, l = Math.hypot(dx, dy) || 1; return { x: -dy / l, y: dx / l }; }
function offsetPath(p, off) {
  if (!off) return p;
  const out = [p[0]];
  for (let i = 1; i < p.length - 1; i++) {
    const n1 = norm(p[i - 1], p[i]), n2 = norm(p[i], p[i + 1]);
    let nx = n1.x + n2.x, ny = n1.y + n2.y; const l = Math.hypot(nx, ny) || 1; nx /= l; ny /= l;
    const cos = nx * n1.x + ny * n1.y || 1;
    out.push({ x: p[i].x + nx * off / cos, y: p[i].y + ny * off / cos });
  }
  out.push(p.at(-1)); return out;
}
function glyph(d) {
  const c = D.TYPE_COLOR[d.type];
  if (d.type === 'ap') return el('circle', { r: 17, fill: 'var(--panel)', stroke: c, 'stroke-width': 4 }, null)
    + el('path', { d: 'M-8 -1a11 11 0 0 1 16 0M-4.5 3a6 6 0 0 1 9 0', fill: 'none', stroke: c, 'stroke-width': 2.6, 'stroke-linecap': 'round' }, null)
    + el('circle', { cy: 7, r: 2.4, fill: c }, null);
  if (d.type === 'prn') return el('rect', { x: -16, y: -13, width: 32, height: 26, rx: 4, fill: c }, null)
    + el('rect', { x: -9, y: -18, width: 18, height: 9, fill: 'var(--panel)', stroke: c, 'stroke-width': 2 }, null)
    + el('rect', { x: -9, y: 3, width: 18, height: 6, fill: 'var(--panel)' }, null);
  if (d.type === 'ph') return el('rect', { x: -10, y: -17, width: 20, height: 34, rx: 5, fill: c }, null)
    + el('rect', { x: -6, y: -12, width: 12, height: 20, rx: 1, fill: 'var(--panel)' }, null);
  if (d.type === 'srv') return el('rect', { x: -15, y: -18, width: 30, height: 36, rx: 3, fill: c }, null)
    + [-10, -2, 6].map(y => el('rect', { x: -10, y, width: 20, height: 4, fill: 'var(--panel)' }, null)).join('');
  return el('rect', { x: -17, y: -14, width: 34, height: 23, rx: 3, fill: c }, null)
    + el('rect', { x: -13, y: -10, width: 26, height: 15, fill: 'var(--panel)' }, null)
    + el('rect', { x: -6, y: 9, width: 12, height: 6, fill: c }, null);
}
function floorPlanSVG({ lab = false } = {}) {
  const B = D.BOUNDS;
  let s = `<svg class="canvas${lab ? ' lab' : ''}" id="plan" viewBox="${B.x} ${B.y} ${B.w} ${B.h}" data-vb="${B.x} ${B.y} ${B.w} ${B.h}" role="img" aria-label="Office 14 floor plan with Cat6 cable routes from the IT Room cabinet to each outlet">`;
  if (lab) s += `<image id="heat" x="${B.x}" y="${B.y}" width="${B.w}" height="${B.h}" preserveAspectRatio="none" style="image-rendering:auto"/>`;
  s += `<g class="plan" data-art></g>`;
  if (lab) s += `<g id="rings"></g>`;
  s += `<g class="zones">${[['SHOWROOM · OFFICE 14', 760, 1250, 0], ['DESIGN', 840, 300, 45]].map(([t, x, y, r]) =>
    el('text', { x, y, class: 'zoneLbl', 'font-size': 26, 'text-anchor': 'middle', transform: `rotate(${r} ${x} ${y})` }, t)).join('')}</g>`;
  s += `<g class="covers">${D.DEVICES.filter(d => d.type === 'ap').map(d => el('circle', { cx: d.x, cy: d.y, r: (7000 / D.MM_PER_PT).toFixed(0), class: 'cover' }, null)).join('')}</g>`;
  s += `<g class="trays">${el('path', { d: toD(D.TRUNK.slice(1)), fill: 'none', stroke: 'var(--tray)', 'stroke-width': 30, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, null)}`;
  D.TRUNK.slice(2).forEach((p, i) => {
    s += el('circle', { cx: p.x, cy: p.y, r: 7, fill: 'var(--panel)', stroke: 'var(--amber)', 'stroke-width': 2.5 }, null);
    s += el('text', { x: p.x + 12, y: p.y + 24, class: 'svgmono', 'font-size': 14 }, 'J' + (i + 1));
  });
  s += el('text', { x: 1520, y: 1400, class: 'svgmono', 'font-size': 14, 'text-anchor': 'end' }, 'exit above door') + '</g>';
  s += '<g class="cables">';
  D.DEVICES.forEach((d, i) => {
    const off = (i - (D.DEVICES.length - 1) / 2) * 3.2;
    const p = toD(offsetPath(d.path, d.local ? 0 : off));
    s += el('path', { d: p, class: 'cable', stroke: D.TYPE_COLOR[d.type], 'stroke-width': d.opt ? 3 : 3.4, 'data-id': d.id, ...(d.opt ? { 'stroke-dasharray': '12 8' } : {}) }, null);
  });
  s += '</g><g class="devs">';
  for (const d of D.DEVICES) {
    s += `<g class="dev" data-id="${d.id}" transform="translate(${d.x} ${d.y}) scale(1.35)"${d.opt ? ' opacity=".85"' : ''}><title>${d.id} — ${esc(d.name)} · ${d.cable} · ${d.est} m</title>`
      + el('circle', { r: 26, fill: 'transparent' }, null) + glyph(d)
      + el('text', { y: -26, class: 'devlbl', 'font-size': 20, 'text-anchor': 'middle' }, d.id)
      + el('text', { y: 40, class: 'devsub', 'font-size': 13, 'text-anchor': 'middle' }, `${d.cable} · ${d.est} m`) + '</g>';
  }
  const R = D.RACK;
  s += `<g class="dev" data-id="RACK"><title>16U wall cabinet — IT Room</title>${el('rect', { x: R.x - 26, y: R.y - 22, width: 52, height: 44, rx: 4, fill: 'var(--ink)' }, null)}`
    + [0, 1, 2, 3].map(i => el('rect', { x: R.x - 20, y: R.y - 16 + i * 9, width: 40, height: 5, rx: 1, fill: 'var(--bg)', opacity: .8 }, null)).join('')
    + el('text', { x: R.x, y: R.y + 48, class: 'devlbl', 'font-size': 20, 'text-anchor': 'middle' }, '16U CABINET') + '</g>';
  return s + '</g></svg>';
}

/* ---------------- topology svg ---------------- */
function topologySVG() {
  const zones = ['Showroom', 'Design', 'IT Room'];
  const list = D.DEVICES.slice().sort((a, b) => zones.indexOf(a.zone) - zones.indexOf(b.zone) || a.port - b.port);
  const rowH = 58, top = 40; const H = Math.max(860, top + list.length * rowH + zones.length * 40 + 20);
  const cy = H / 2;
  const box = (x, y, w, h, title, sub, color) =>
    el('rect', { x, y, width: w, height: h, rx: 8, class: 'box', stroke: color }, null)
    + el('rect', { x, y, width: 7, height: h, rx: 3, fill: color }, null)
    + el('text', { x: x + 18, y: y + h / 2 - (sub ? 3 : -6), class: 'svgtxt', 'font-size': 19, 'font-weight': 700 }, esc(title))
    + (sub ? el('text', { x: x + 18, y: y + h / 2 + 17, class: 'svgmono', 'font-size': 12.5 }, esc(sub)) : '');
  let s = `<svg class="diagram" viewBox="0 0 1500 ${H}" role="img" aria-label="Logical topology: Internet, ONT and router, PoE switch, patch panel, then each device grouped by zone">`;
  s += box(20, cy - 150, 190, 64, 'Internet', 'ISP fibre', 'var(--c-wan)');
  s += box(20, cy - 40, 190, 72, 'ONT / Router', 'gateway · DHCP · firewall', 'var(--c-wan)');
  s += box(290, cy - 90, 230, 180, 'PoE Switch', '16 × 1 GbE · 802.3at', 'var(--amber)');
  s += box(600, cy - 90, 200, 180, 'Patch panel', '24 × Cat6 · PP-1…24', 'var(--ink-faint)');
  s += el('path', { d: `M115 ${cy - 86} V ${cy - 40}`, stroke: 'var(--c-wan)', 'stroke-width': 4, fill: 'none' }, null);
  s += el('path', { d: `M210 ${cy - 4} H 290`, stroke: 'var(--ink)', 'stroke-width': 4, fill: 'none' }, null);
  s += el('text', { x: 250, y: cy - 14, class: 'svgmono', 'font-size': 12, 'text-anchor': 'middle' }, `LAN → P${D.UPLINK_PORT}`);
  for (let i = 0; i < 16; i++) {
    const px = 306 + (i % 8) * 26, py = cy + 30 + Math.floor(i / 8) * 24;
    const used = D.DEVICES.some(d => d.port === i + 1) || i + 1 === D.UPLINK_PORT;
    s += el('rect', { x: px, y: py, width: 20, height: 16, rx: 2, fill: used ? 'var(--amber)' : 'var(--panel-2)', stroke: 'var(--border)' }, null);
    s += el('text', { x: px + 10, y: py + 12, 'font-size': 9, 'text-anchor': 'middle', class: 'svgmono', style: `fill:${used ? 'var(--bg)' : 'var(--ink-faint)'}` }, i + 1);
  }
  s += el('path', { d: `M520 ${cy} H 600`, stroke: 'var(--ink-dim)', 'stroke-width': 6, fill: 'none', 'stroke-dasharray': '2 3' }, null);
  s += el('text', { x: 560, y: cy - 12, class: 'svgmono', 'font-size': 12, 'text-anchor': 'middle' }, '0.5 m patch');
  let y = top, lastZone = null; const X = 1020;
  for (const d of list) {
    if (d.zone !== lastZone) { y += lastZone ? 24 : 0; s += el('text', { x: X, y: y + 4, class: 'zoneLbl', 'font-size': 18 }, esc(d.zone.toUpperCase())); y += 16; lastZone = d.zone; }
    const ny = y + rowH / 2 - 4, c = D.TYPE_COLOR[d.type];
    s += `<g class="lnk" data-id="${d.id}">`;
    s += el('path', { d: `M800 ${cy} C 900 ${cy}, 900 ${ny}, ${X} ${ny}`, fill: 'none', stroke: c, 'stroke-width': 3, ...(d.opt ? { 'stroke-dasharray': '10 7' } : {}) }, null);
    s += el('text', { x: X - 12, y: ny - 7, class: 'svgmono', 'font-size': 12, 'text-anchor': 'end' }, `${d.cable} · ${d.est} m`);
    s += box(X, y, 440, rowH - 10, /^PC \d$/.test(d.name) ? d.id : `${d.id} — ${d.name}`, `SW P${d.port} · PP-${d.port} · ${D.TYPE_NAME[d.type]}${d.poe ? ' · PoE' : ''}`, c);
    s += '</g>';
    y += rowH;
  }
  return s + '</svg>';
}

/* ---------------- rack svg ---------------- */
function rackSVG() {
  const U = 46, X = 120, W = 480, top = 80;
  let s = `<svg class="diagram rack" viewBox="0 0 1000 ${16 * U + 200}" role="img" aria-label="Front elevation of the 16U wall cabinet">`;
  s += el('rect', { x: X - 40, y: top - 50, width: W + 80, height: 16 * U + 100, rx: 10, fill: 'var(--panel-2)', stroke: 'var(--border)', 'stroke-width': 2 }, null);
  s += el('text', { x: X + W / 2, y: top - 18, class: 'svgtxt', 'font-size': 20, 'font-weight': 700, 'text-anchor': 'middle' }, '19″ 16U WALL CABINET · IT ROOM');
  for (let u = 16; u >= 1; u--) {
    const y = top + (16 - u) * U; const [name, kind] = D.RACK_UNITS[u];
    s += el('text', { x: X - 14, y: y + U / 2 + 5, class: 'svgmono', 'font-size': 13, 'text-anchor': 'end' }, 'U' + u);
    const fill = kind === 'sw' ? 'var(--amber)' : (kind === 'pp' || kind === 'pdu') ? '#2a2420' : (kind === 'cm' || kind === 'shelf' || kind === 'brush') ? 'var(--panel)' : 'var(--bg-alt)';
    s += el('rect', { x: X, y: y + 2, width: W, height: U - 4, rx: 3, fill, stroke: 'var(--border)' }, null);
    if (kind === 'pp') for (let i = 0; i < 24; i++) { const used = D.DEVICES.some(d => d.port === i + 1); s += el('rect', { x: X + 22 + i * 18.5, y: y + 14, width: 14, height: 12, rx: 1.5, fill: used ? 'var(--c-prn)' : 'var(--ink-faint)' }, null); }
    if (kind === 'sw') for (let i = 0; i < 16; i++) { const used = D.DEVICES.some(d => d.port === i + 1) || i + 1 === D.UPLINK_PORT; s += el('rect', { x: X + 22 + i * 22, y: y + 14, width: 17, height: 13, rx: 1.5, fill: used ? 'var(--bg)' : 'rgba(0,0,0,.25)' }, null); }
    if (kind === 'shelf') {
      s += el('rect', { x: X + 20, y: y + 8, width: 110, height: 30, rx: 3, fill: 'var(--c-wan)' }, null) + el('rect', { x: X + 150, y: y + 8, width: 150, height: 30, rx: 3, fill: 'var(--ink-dim)' }, null);
      s += el('text', { x: X + 75, y: y + 28, 'font-size': 12, 'text-anchor': 'middle', class: 'svgmono', style: 'fill:var(--bg)' }, 'ONT') + el('text', { x: X + 225, y: y + 28, 'font-size': 12, 'text-anchor': 'middle', class: 'svgmono', style: 'fill:var(--bg)' }, 'ROUTER');
    }
    if (kind === 'cm') for (let i = 0; i < 10; i++) s += el('rect', { x: X + 24 + i * 46, y: y + 10, width: 28, height: 22, rx: 4, fill: 'none', stroke: 'var(--ink-faint)', 'stroke-width': 2 }, null);
    if (kind === 'brush') s += el('rect', { x: X + 30, y: y + 17, width: W - 60, height: 8, rx: 4, fill: 'var(--ink-faint)' }, null);
    if (kind === 'pdu') for (let i = 0; i < 8; i++) s += el('rect', { x: X + 30 + i * 52, y: y + 12, width: 22, height: 18, rx: 3, fill: 'var(--ink-dim)' }, null);
    s += el('text', { x: X + W + 64, y: y + U / 2 + 5, class: kind === 'spare' || kind === 'blank' || kind === 'shelfb' ? 'svgmono' : 'svgtxt', 'font-size': 15 }, esc(name));
  }
  s += el('text', { x: X - 40, y: top + 16 * U + 84, class: 'svgmono', 'font-size': 13 }, `Patch-panel ports used: ${D.BY_PORT.map(d => d.port).join(', ')}`);
  s += el('text', { x: X - 40, y: top + 16 * U + 104, class: 'svgmono', 'font-size': 13 }, `Switch P${D.UPLINK_PORT} = router uplink · spare switch ports: ${D.SPARE_SW.join(', ')}`);
  return s + '</svg>';
}

/* ================= PAGES ================= */
const zones = [...new Set(D.DEVICES.map(d => d.zone))];
const out = {};

/* Overview content — DOC 00 (index.html), assembled after GROUPS below */
const OVERVIEW_LEAD = `Cat6 structured cabling and the local network for Office 14 at Pyramid Centre. Every cable is a home run from one 16U cabinet in the IT Room to a single outlet. The runs serve ${D.DEVICES.filter(d => d.type === 'pc' || d.type === 'srv').length} PCs, a printer, a mobile point, and ${D.DEVICES.filter(d => d.type === 'ap').length} Wi-Fi access points. Everything needed to approve, buy and install it is in these documents.`;
const OVERVIEW_SCOPE = section('scope', 'SCOPE', 'Scope of work',
      `<div class="cols2"><div class="card"><h3>In scope</h3><ul class="ticks">
        <li>Supply and mount a 19″ 16U wall cabinet in the IT Room</li>
        <li>Ceiling cable tray from the IT Room door to the Design area</li>
        <li>${D.DEVICES.length} Cat6 home runs, terminated on a 24-port patch panel and RJ45 outlets</li>
        <li>Labelling of every cable at both ends, patch panel and faceplate</li>
        <li>Testing of every link and a written test record</li>
        <li>Fitting and configuring the PoE switch, router shelf and access points</li>
      </ul></div><div class="card"><h3>Not in scope (unless agreed)</h3><ul class="crosses">
        <li>ISP fibre to the building and the ONT itself (ISP)</li>
        <li>Electrical works: new power sockets, the cabinet supply circuit</li>
        <li>PC, printer and software set-up</li>
        <li>CCTV, access control, telephone system</li>
        <li>Ceiling repair or painting after the work</li>
      </ul></div></div>`, 'Draft scope based on the cabling plan. To be agreed before work starts.');
const OVERVIEW_ZONES = section('zones', 'ZONES', 'Areas served',
      table(['Zone', 'Devices', 'Outlets', 'Length'], zones.map(z => {
        const ds = D.DEVICES.filter(d => d.zone === z);
        return `<tr><td><b>${z}</b></td><td>${ds.map(d => `${swatch(d.type)}${d.id}`).join(' &nbsp; ')}</td><td class="n">${ds.filter(d => !d.local).length}</td><td class="n">${ds.reduce((s, d) => s + d.est, 0)} m</td></tr>`;
      })));
const OVERVIEW_HISTORY = section('history', 'REV', 'Revision history',
      table(['Rev', 'Date', 'Change', 'By'], [`<tr><td class="m">${D.META.rev}</td><td class="m">${D.META.date}</td><td>First issue. Built from the hand sketch, the Office 14 floor plan and the interactive cabling plan.</td><td>${D.META.author}</td></tr>`]));

out['floor-plan.html'] = page('floor-plan.html', {
  wide: true, scripts: ['assets/plan-art.js'],
  lead: 'Plan view of Office 14 with the ceiling tray, every Cat6 home run and the device positions. Device positions come from the hand sketch and must be checked on site.',
  body:
    section('routes', 'PLAN-01', 'Cable routes', // not id "plan" — that is the SVG site.js pans/zooms
      `<div class="planrow">
      <div class="stage">
        ${floorPlanSVG()}
        <div class="toolbar">
          <button class="tool" data-z="in" aria-label="Zoom in">+</button>
          <button class="tool" data-z="out" aria-label="Zoom out">−</button>
          <button class="tool" data-z="fit" aria-label="Fit to screen">⤢</button>
          <button class="tool" id="tcov" aria-pressed="false" title="Show Wi-Fi coverage">Wi-Fi</button>
        </div>
      </div>
      <div class="chips side-chips" id="devchips" aria-label="Devices">${D.BY_PORT.map(d => `<button class="chip" data-id="${d.id}">${swatch(d.type)}${d.id}<small>${d.cable} · ${d.est} m</small></button>`).join('')}</div>
      </div>
      <div class="legend legend-below">
        <span>${swatch('ap')}Access point · PoE</span><span>${swatch('pc')}Workstation PC</span><span>${swatch('srv')}Server</span>
        <span>${swatch('prn')}Printer</span><span>${swatch('ph')}Mobile point</span><span><i class="tray"></i>Ceiling tray</span>
      </div>
      <p class="note">Scroll or pinch to zoom, drag to pan. Hover or tap a device on the plan, or a device in the list, to pick out its cable. The Wi-Fi circles show a 7 m radius and are only a guide, not a survey. To move an outlet to its real position and recalculate lengths, use the <a href="interactive-plan.html">interactive planner</a>.</p>`)
    + section('tray', 'PLAN-02', 'Tray route and junctions',
      `<p>All cables leave the cabinet, rise to ceiling level and exit the IT Room <b>above the door</b>. A single ceiling tray runs diagonally across the Showroom to the Design area. Each cable leaves the tray at the junction closest to its outlet, then drops down the wall (desks) or goes to a ceiling box (APs). Tray length: <b>${f1(D.TRAY_M)} m</b> (${Math.ceil(D.TRAY_M) + 2} m ordered).</p>`
      + table(['Junction', 'Serves', 'Cables leaving here'], Object.entries(D.JUNCTION_NOTES).map(([j, note]) => {
        const ds = D.BY_PORT.filter(d => d.junction === j);
        return `<tr><td class="m"><b>${j}</b></td><td>${note}</td><td>${ds.map(d => `${swatch(d.type)}${d.cable} ${d.id}`).join(' &nbsp; ') || '—'}</td></tr>`;
      }).concat([`<tr><td class="m"><b>Cabinet</b></td><td>Inside the IT Room</td><td>${D.DEVICES.filter(d => d.local).map(d => `${swatch(d.type)}${d.cable} ${d.id}`).join(' ')}</td></tr>`])))
    + section('heights', 'PLAN-03', 'Outlet positions',
      table(['Outlet type', 'Mounting', 'Used for'], [
        '<tr><td><b>Wall outlet</b></td><td>Single RJ45 faceplate, 300 mm above finished floor, next to a power socket</td><td>PCs, printer, mobile point</td></tr>',
        '<tr><td><b>Ceiling outlet</b></td><td>Surface box next to the AP position; 300 mm service loop kept in the ceiling</td><td>AP1, AP2</td></tr>',
        '<tr><td><b>Direct</b></td><td>Patched straight from the cabinet, no outlet</td><td>PC 7 · Server</td></tr>',
      ]) + callout('warn', '<b>Check on site:</b> every outlet position on this plan is taken from a sketch. Mark each one on the wall or ceiling with the furniture layout in hand before any cable is pulled (open item A-01).')),
});

out['topology.html'] = page('topology.html', {
  wide: true,
  lead: 'How the network fits together: the ISP line comes into the router, the router feeds the PoE switch, and each switch port is patched to the matching patch-panel port and cable.',
  body:
    section('logical', 'NET-01', 'Logical topology', `<div class="figure">${topologySVG()}</div>
      <p class="note">ISP fibre → ONT / router → PoE switch → patch panel → wall or ceiling outlet → device. Port numbers are the same on the switch, the patch panel and the cable ID.</p>`)
    + section('ports', 'NET-02', 'Port map',
      table(['Port', 'Patch panel', 'Cable', 'Device', 'Zone', 'PoE', 'Proposed IP'], D.BY_PORT.map(d => `<tr data-id="${d.id}"><td class="n">${d.port}</td><td class="m">PP-${d.port}</td><td class="m">${swatch(d.type)}${d.cable}</td><td>${d.name}</td><td>${d.zone}</td><td class="n">${d.poe ? 'Yes' : '—'}</td><td class="m">${{ AP1: '.11', AP2: '.12', PRN: '.20', PC7: '.30' }[d.id] || 'DHCP'}</td></tr>`)
        .concat([`<tr><td class="n">${D.UPLINK_PORT}</td><td class="m">—</td><td class="m"><span class="sw" style="background:var(--c-wan)"></span>UPL</td><td>Router LAN uplink</td><td>IT Room</td><td class="n">—</td><td class="m">.1 (router)</td></tr>`])
        .concat(D.SPARE_SW.map(p => `<tr class="spare"><td class="n">${p}</td><td class="m">PP-${p}</td><td class="m">—</td><td>Spare</td><td>—</td><td class="n">—</td><td class="m">—</td></tr>`))
        .sort((a, b) => +a.match(/class="n">(\d+)/)[1] - +b.match(/class="n">(\d+)/)[1])),
      `Switch port = patch-panel port = cable number. Switch ports ${D.SPARE_SW.join(' and ')} are spare. Patch-panel ports PP-17 to PP-24 have no switch port and stay unpatched.`)
    + section('ip', 'NET-03', 'Proposed addressing', callout('info', '<b>Proposal only.</b> Nothing below is agreed yet; see open item D-01. It is here so the switch, APs and printer can be set up the same day the cabling is finished.')
      + table(['Item', 'Address / range', 'Note'], D.IP_PLAN.map(([a, b, c]) => `<tr><td>${a}</td><td class="m">${b}</td><td>${c}</td></tr>`)))
    + section('wifi', 'NET-04', 'Wi-Fi', table(['SSID (proposed)', 'For', 'Security'], [
      '<tr><td class="m">OPPEIN-Office</td><td>Staff laptops and phones</td><td>WPA2/WPA3-Personal, strong passphrase</td></tr>',
      '<tr><td class="m">OPPEIN-Guest</td><td>Visitors and showroom clients</td><td>Separate passphrase, client isolation, internet only</td></tr>',
    ]) + `<p>The same SSIDs go on all access points so devices roam between them. Use non-overlapping 2.4 GHz channels (1 / 6 / 11) and auto channel on 5 GHz. After installation, walk the office with a Wi-Fi analyser to confirm coverage (see ${docRef('testing.html')}).</p>`),
});

out['rack.html'] = page('rack.html', {
  lead: 'Front view of the 19″ 16U wall cabinet in the IT Room. Short 0.5 m patch cords run from each patch-panel port straight down to the same switch port.',
  body:
    section('elev', 'RACK-01', 'Front elevation', `<div class="figure narrow">${rackSVG()}</div>`)
    + section('units', 'RACK-02', 'Unit schedule', table(['U', 'Item', 'Note'], Object.keys(D.RACK_UNITS).sort((a, b) => b - a).map(u => {
      const [n, k] = D.RACK_UNITS[u];
      const note = { brush: 'Cables enter from the top of the cabinet', pp: `${D.DEVICES.length} ports used`, sw: `P1–P12, P14 devices · P${D.UPLINK_PORT} uplink`, cm: 'Route 0.5 m cords', shelf: 'ONT (ISP) and router side by side', spare: 'Keep free for growth', pdu: 'Fed from a dedicated socket' }[k] || '';
      return `<tr${k === 'spare' || k === 'blank' || k === 'shelfb' ? ' class="spare"' : ''}><td class="m">U${u}</td><td>${n}</td><td>${note}</td></tr>`;
    })))
    + section('env', 'RACK-03', 'Power, cooling and access', `<ul class="ticks">
      <li><b>Power:</b> one dedicated 230 V socket next to the cabinet feeding the PDU. A UPS is recommended (open item D-05).</li>
      <li><b>Cooling:</b> fan on top of the cabinet; keep the side vents clear. U2 can take a fan tray if the top fan is not possible.</li>
      <li><b>Mounting:</b> fix to a solid wall at a height where the top of the cabinet is below the ceiling tray exit, so cables enter through the brush panel.</li>
      <li><b>Access:</b> lockable glass door; key kept by IT. Leave about 600 mm clear in front for working.</li>
      <li><b>Patch cords:</b> one colour per device type makes faults easier to trace: blue for PCs, yellow for APs, green for printer and server, red for the router uplink.</li>
    </ul>`),
});

out['cable-schedule.html'] = page('cable-schedule.html', {
  wide: true,
  lead: 'One home run per outlet. Each cable is labelled with the same ID at both ends and lands on the patch-panel port and switch port of the same number.',
  body:
    section('sched', 'CAB-01', 'Schedule',
      table(['Cable', 'Device', 'Type', 'Zone', 'Outlet', 'Via', 'Tray m', 'Drops m', 'Pull m', 'Port', 'PoE'], D.BY_PORT.map(d =>
        `<tr data-id="${d.id}"${d.opt ? ' class="opt"' : ''}><td class="m">${swatch(d.type)}<b>${d.cable}</b></td><td>${d.name}</td><td>${D.TYPE_NAME[d.type]}</td><td>${d.zone}</td><td>${d.outletShort}</td><td class="m">${d.junction}</td><td class="n">${f1(d.trayM)}</td><td class="n">${f1(d.drops)}</td><td class="n"><b>${d.est}</b></td><td class="n">${d.port}</td><td class="n">${d.poe ? 'Yes' : '—'}</td></tr>`)
        .concat([`<tr><td class="m"><span class="sw" style="background:var(--c-wan)"></span><b>UPL</b></td><td>Router → switch</td><td>Uplink</td><td>IT Room</td><td>In cabinet</td><td class="m">—</td><td class="n">—</td><td class="n">—</td><td class="n">patch</td><td class="n">${D.UPLINK_PORT}</td><td class="n">—</td></tr>`]),
        { foot: `<tfoot><tr><td colspan="8">Total</td><td class="n">${D.TOTAL_M} m</td><td colspan="2"></td></tr></tfoot>` }))
    + section('method', 'CAB-02', 'How lengths are worked out', `<p class="formula">Pull length = ( tray route + 2.0 m cabinet drop + outlet drop ) × 1.10, rounded up to the next metre</p>
      ${table(['Part', 'Allowance'], [
        '<tr><td>Tray route</td><td>Measured on the plan from the cabinet, along the tray, to the junction, then straight to the outlet</td></tr>',
        '<tr><td>Cabinet drop</td><td>2.0 m: up the wall from the cabinet to ceiling level, plus the dressing loop in the cabinet</td></tr>',
        '<tr><td>Outlet drop</td><td>2.5 m wall outlet (ceiling 2.8 m down to 300 mm) · 0.6 m ceiling AP · 0.5 m direct in IT Room</td></tr>',
        '<tr><td>Slack</td><td>10 % for routing around obstacles and termination</td></tr>',
      ])}
      ${callout('info', `The longest run is ${D.LONGEST.cable} at <b>${D.LONGEST.est} m</b>, well inside the 90 m Cat6 permanent-link limit. Cut lengths on site from the real route, not from this table; this table is for ordering and checking.`)}`)
    + section('labels', 'CAB-03', 'Label format', table(['Where', 'Label', 'Example'], [
      '<tr><td>Cable, cabinet end (within 300 mm of termination)</td><td>Cable ID</td><td class="m">C-03</td></tr>',
      '<tr><td>Cable, outlet end</td><td>Cable ID</td><td class="m">C-03</td></tr>',
      '<tr><td>Patch-panel port</td><td>Device ID</td><td class="m">PP-3 · PC1</td></tr>',
      '<tr><td>Faceplate / ceiling box</td><td>Cable ID / patch-panel port</td><td class="m">C-03 / PP-3</td></tr>',
    ])),
});

/* ---------- DOC 05 · BOQ & estimate ---------- */
const money = n => n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const STORE = { amazon: 'Amazon.ae', noon: 'noon UAE' };
function boqRows() {
  let h = '';
  for (const sec of Q.BOQ) {
    h += `<tr class="grp${sec.optional ? ' optgrp' : ''}"><td class="m">${sec.code}</td><td colspan="5">${sec.title}${sec.optional ? ' <span class="optnote no-print">— tick an item to include it in the total</span>' : ''}</td></tr>`;
    sec.items.forEach(([desc, unit, q, r, fn, basis, guide], i) => {
      const key = `${sec.code}.${i + 1}`;
      h += `<tr class="it${sec.optional ? ' opt excluded' : ''}" data-key="${key}" data-sec="${sec.code}">
        <td class="m">${sec.optional ? '<input type="checkbox" class="inc no-print" aria-label="Include ' + key + '"> ' : ''}${key}</td>
        <td><span class="d">${esc(desc)}</span><div class="fn">${esc(fn)}</div><div class="rmk no-print">${basis ? 'Rate basis: ' + esc(basis) + ' · ' : ''}<a href="equipment.html#${guide}">Function &amp; where to buy →</a></div></td>
        <td class="u">${unit}</td>
        <td class="n"><input class="q" type="number" inputmode="decimal" min="0" step="1" value="${q}" data-def="${q}" aria-label="Quantity ${key}"></td>
        <td class="n"><input class="r" type="number" inputmode="decimal" min="0" step="0.01" value="${r.toFixed(2)}" data-def="${r.toFixed(2)}" aria-label="Unit rate ${key}"></td>
        <td class="n amt">${money(q * r)}</td></tr>`;
    });
    h += `<tr class="subt${sec.optional ? ' optsub' : ''}"><td></td><td colspan="4">Subtotal ${sec.code} — ${sec.title}${sec.optional ? ' (included items)' : ''}</td><td class="n" data-subamt="${sec.code}">—</td></tr>`;
  }
  return h;
}
const paper = `<div class="boq-tools no-print">
      <button class="btn solid" id="boq-print">Print / save as PDF</button>
      <button class="btn" id="boq-reset">Reset to estimate</button>
      <span class="hint">Click any quantity, rate or header field to edit it. Totals update as you type. Changed values are highlighted. Edits are saved in this browser only.</span>
    </div>
    <div class="paper-wrap"><article class="paper" id="boq" data-vat="${Q.VAT_PCT}" data-points="${D.DEVICES.length}">
      <header class="lh">
        <div class="lh-brand">
          <img src="../../assets/oppein-logo.webp" alt="" class="lh-logo" onload="this.classList.add('ok')" onerror="this.remove()">
          <div class="lh-id"><input class="lh-name" data-f="co" value="OPPEIN" aria-label="Company name"><input class="lh-tag" data-f="tag" value="IT Department · Projects &amp; Infrastructure" aria-label="Department"></div>
        </div>
        <div class="lh-contact">
          <input data-f="addr" placeholder="Office address, Dubai, UAE" aria-label="Address">
          <input data-f="tel" placeholder="Tel: +971 …" aria-label="Telephone">
          <input data-f="mail" placeholder="Email" aria-label="Email">
          <input data-f="trn" placeholder="TRN: …" aria-label="Tax registration number">
        </div>
      </header>
      <div class="lh-rule"></div>
      <div class="doc-title"><h2>Estimate — Bill of Quantities</h2><span class="stamp">Budget estimate · not a quotation</span></div>
      <div class="doc-meta">
        <label>Estimate no.<input data-f="ref" value="OPP-IT-EST-O14-001"></label>
        <label>Date<input data-f="date" type="date" value="${D.META.date}"></label>
        <label>Valid for<input data-f="valid" value="30 days"></label>
        <label>Revision<input data-f="rev" value="${D.META.rev}"></label>
        <label class="w2">Prepared for<input data-f="to" placeholder="Client / management name"></label>
        <label class="w2">Project<input data-f="proj" value="Office 14 — Structured cabling &amp; network"></label>
        <label class="w2">Site<input data-f="site" value="${D.META.site}"></label>
        <label class="w2">Currency<input data-f="cur" value="${Q.CURRENCY} · rates excl. VAT"></label>
      </div>
      <div class="tw-paper"><table class="boq">
        <colgroup><col style="width:8%"><col><col style="width:7%"><col style="width:9%"><col style="width:12%"><col style="width:14%"></colgroup>
        <thead><tr><th>No.</th><th>Description &amp; function</th><th>Unit</th><th class="n">Qty</th><th class="n">Rate</th><th class="n">Amount</th></tr></thead>
        <tbody>${boqRows()}</tbody>
      </table></div>
      <div class="totals">
        <div class="words"><small>Grand total in words</small><p id="t-words">—</p></div>
        <dl>
          <dt>Subtotal A–E</dt><dd id="t-base">—</dd>
          <dt>Optional items (F, ticked)</dt><dd id="t-opt">—</dd>
          <dt>Contingency <input id="t-contp" type="number" min="0" max="50" step="1" value="${Q.CONTINGENCY_PCT}" aria-label="Contingency percent"> %</dt><dd id="t-cont">—</dd>
          <dt>Total before VAT</dt><dd id="t-net">—</dd>
          <dt>VAT ${Q.VAT_PCT} %</dt><dd id="t-vat">—</dd>
          <dt class="gt">Grand total (${Q.CURRENCY})</dt><dd class="gt" id="t-grand">—</dd>
        </dl>
      </div>
      <div class="terms">
        <h3>Notes &amp; conditions</h3>
        <ol>
          <li>Budget estimate for planning and approval. Rates are UAE market estimates (${Q.PRICE_DATE}) and are replaced by supplier quotations before ordering.</li>
          <li>Quantities follow the Office 14 cable schedule: ${D.DEVICES.length} Cat6 home runs, ${D.TOTAL_M} m, ${D.OUTLETS} outlets. To be confirmed after the site survey.</li>
          <li>Excluded: ISP fibre and ONT, electrical works and sockets, ceiling repair or painting, PCs, printers and software licences.</li>
          <li>Optional items (section F) are included only where ticked. Contingency covers site variations.</li>
          <li>All cable and termination to be Cat6 solid bare copper; CCA cable is not accepted.</li>
        </ol>
      </div>
      <div class="sign">
        <div><span>Prepared by</span><input data-f="by" value="${D.META.author}"><i>Signature &amp; date</i></div>
        <div><span>Reviewed by</span><input data-f="rev_by" placeholder="Name"><i>Signature &amp; date</i></div>
        <div><span>Approved by</span><input data-f="appr" placeholder="Name"><i>Signature &amp; date</i></div>
      </div>
      <footer class="pf"><span>OPPEIN · Office 14 Network · Estimate BOQ</span><span>Generated from the project documentation</span></footer>
    </article></div>`;
const noPrint = h => h.replace('<section class="sec"', '<section class="sec no-print"');

out['materials.html'] = page('materials.html', {
  wide: true, bodyClass: 'boq-page', scripts: ['assets/boq.js'],
  lead: `A bill of quantities for the whole job: cabling, cabinet, active equipment, patching and labour, with estimated UAE rates. Quantities come from the cable schedule. You can edit every quantity and rate, and print the result as an estimate on the OPPEIN letterhead.`,
  body:
    noPrint(section('summary', 'BOQ-01', 'Estimate at a glance', `<div class="tiles">
      <div class="tile"><div class="tv" data-live="base">—</div><div class="tl">Subtotal A–E</div><div class="ts">excl. contingency &amp; VAT</div></div>
      <div class="tile"><div class="tv" data-live="grand">—</div><div class="tl">Grand total</div><div class="ts">incl. contingency + ${Q.VAT_PCT} % VAT</div></div>
      <div class="tile"><div class="tv" data-live="perpt">—</div><div class="tl">Per cable point</div><div class="ts">grand total ÷ ${D.DEVICES.length} points</div></div>
    </div><div id="boq-bars"></div>`, 'Figures update live from the BOQ below.'))
    + `    <section class="sec boq-sec" id="boq-sec">
      <div class="module-label no-print">BOQ-02</div>
      <h2 class="no-print">Bill of quantities</h2>
      ${paper}
    </section>\n`
    + noPrint(section('basis', 'BOQ-03', 'Basis of rates', table(['Item', 'Market reference found', 'Source'],
      Q.BOQ_SOURCES.map(([a, b, u]) => `<tr><td><b>${a}</b></td><td>${esc(b)}</td><td class="m"><a href="${u}" target="_blank" rel="noopener">${new URL(u).hostname.replace('www.', '')} ↗</a></td></tr>`))
      + callout('info', `<b>How the rates were set.</b> Product rates come from UAE listings on Amazon.ae, noon and Dubai suppliers seen on ${Q.PRICE_DATE}, rounded to a typical trade price. Labour is a typical small-office contractor rate. Treat every figure as ±20 % until written quotations arrive. Specific products are compared in ${docRef('equipment.html')}.`),
      'Web search, prices excl. 5 % VAT unless stated.'))
    + noPrint(section('spare', 'BOQ-04', 'Spare capacity bought with this BOQ', tiles([
      [`${24 - D.DEVICES.length}`, 'Patch-panel ports free', 'of 24'],
      [`${D.SPARE_SW.length}`, 'Switch ports free', `P${D.SPARE_SW.join(', P')}`],
      [`${D.BOXES * 305 - D.TOTAL_M} m`, 'Cable left on the box', 'for later moves and adds'],
    ]))),
});

/* ---------- DOC 06 · Equipment & buying guide ---------- */
const ICON = {
  cable: '<path d="M4 18c4 0 4-12 8-12s4 12 8 12"/>', switch: '<rect x="3" y="7" width="18" height="10" rx="2"/><path d="M7 12h1M11 12h1M15 12h1"/>',
  wifi: '<path d="M2 9a15 15 0 0 1 20 0M5 13a10 10 0 0 1 14 0M8.5 16.5a5 5 0 0 1 7 0"/><circle cx="12" cy="20" r="1"/>',
  rack: '<rect x="5" y="3" width="14" height="18" rx="1"/><path d="M8 7h8M8 11h8M8 15h8"/>', outlet: '<rect x="4" y="4" width="16" height="16" rx="3"/><path d="M9 10h6v5H9z"/>',
  patch: '<path d="M4 12h6M14 12h6M10 9v6M14 9v6"/>', ups: '<rect x="6" y="3" width="12" height="18" rx="2"/><path d="M13 7l-3 5h4l-3 5"/>',
  tray: '<path d="M3 8h18v4H3zM6 12v6M18 12v6"/>', tools: '<path d="M14 6l4 4-8 8H6v-4z"/>',
};
const qtyOf = id => Q.BOQ.flatMap(s => s.items.filter(i => i[6] === id).map(i => `${i[2]} ${i[1]}`)).join(' + ');
out['equipment.html'] = page('equipment.html', {
  lead: `What each component does in the Office 14 network, the specification to insist on, and products currently listed on Amazon.ae and noon UAE. Prices are what the listings showed on ${Q.PRICE_DATE}. Stock and prices change, so open the listing before buying.`,
  body:
    section('howto', 'EQ-00', 'How the parts work together', `<div class="flow">
      ${[['Internet', 'ISP fibre → ONT → router'], ['Switch', 'Shares the connection, powers APs (PoE)'], ['Patch panel', 'Fixed end of every cable'], ['Cat6 cable', `${D.DEVICES.length} home runs, ${D.TOTAL_M} m`], ['Outlet', 'Keystone + faceplate'], ['Device', 'PC, printer, AP, phone']].map(([t, d], i) => `<div class="fstep"><span class="fnum">${i + 1}</span><b>${t}</b><small>${d}</small></div>`).join('<span class="farrow">→</span>')}
    </div>`, 'Every device has its own cable straight back to the cabinet, so a fault on one cable never affects another.')
    + Q.GUIDE.map((g, gi) => `    <section class="sec eq" id="${g.id}">
      <div class="module-label">EQ-${String(gi + 1).padStart(2, '0')}</div>
      <div class="eq-head"><svg class="eq-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${ICON[g.icon]}</svg><div><h2>${g.title}</h2>${qtyOf(g.id) ? `<span class="eq-qty">BOQ quantity: ${qtyOf(g.id)}</span>` : ''}</div></div>
      <div class="eq-grid">
        <div class="card"><h3>Function</h3><p>${esc(g.fn)}</p></div>
        <div class="card"><h3>Must have</h3><ul class="ticks">${g.needs.map(n => `<li>${esc(n)}</li>`).join('')}</ul></div>
      </div>
      ${g.picks.length ? `<div class="picks">${g.picks.map(p => `<a class="pick" href="${p.url}" target="_blank" rel="noopener sponsored">
        <span class="ptag t-${p.tag.toLowerCase().replace(/\s+/g, '-')}">${p.tag}</span>
        <b>${esc(p.name)}</b>
        <span class="pmeta"><span class="store s-${p.store}">${STORE[p.store]}</span><span class="price">${p.price}</span></span>
        <span class="pgo">View listing ↗</span></a>`).join('')}</div>` : '<p class="note">Normally supplied by the installer at trade price. See the BOQ for the allowance.</p>'}
      ${g.avoid ? callout('warn', `<b>Avoid:</b> ${esc(g.avoid)}`) : ''}
    </section>\n`).join('')
    + callout('info', `Links open the public store listing. They are suggestions, not endorsements. Check the seller, the warranty (UAE vs. international) and that the model number matches before ordering. To compare a model's Wi-Fi range or PoE fit, try it in ${docRef('device-lab.html')}.`),
});

/* ---------- DOC 07 · Device lab ---------- */
const labData = `<script>window.O14=${JSON.stringify({
  MM_PER_PT: D.MM_PER_PT, BOUNDS: D.BOUNDS, MOB_W: 6.5,
  devices: D.DEVICES.map(d => ({ id: d.id, type: d.type, zone: d.zone, name: d.name, x: d.x, y: d.y, poe: !!d.poe, est: d.est, cable: d.cable, port: d.port })),
})};</script>`;
const apToggles = D.DEVICES.filter(d => d.type === 'ap').map(d => `<label class="tog"><input type="checkbox" data-apon="${d.id}"> ${d.id}<small>${d.zone}</small></label>`).join('');
out['device-lab.html'] = page('device-lab.html', {
  wide: true, scripts: ['assets/plan-art.js', 'assets/models.js', labData, 'assets/lab.js'],
  lead: 'Try real equipment against the Office 14 layout before buying. Search a model or pick one, and the lab shows its capabilities, the Wi-Fi range on the floor plan, the expected signal at every desk, whether the switch can power everything, and how much signal each cable run loses.',
  body:
    section('search', 'LAB-01', 'Find a device model', `<div class="lab-search">
        <input id="lab-search" list="lab-list" placeholder="e.g. U6 Lite, EAP650, TL-SG1218MPE, Cat6 CCA" autocomplete="off" aria-label="Device model">
        <datalist id="lab-list"></datalist>
        <button class="btn solid" id="lab-find">Search</button>
      </div>
      <p class="found" id="lab-found">The library holds common access points, PoE switches and cable types. A model that is not listed can be added from its datasheet below.</p>
      <details class="custom" id="custom"><summary>Add a model from its datasheet</summary>
        <div class="cgrid">
          <label>Type<select id="c-cat"><option value="ap">Access point</option><option value="switch">PoE switch</option><option value="cable">Cable</option></select></label>
          <label>Model name<input id="c-model" placeholder="Model"></label>
          <label data-for="ap switch">Brand<input id="c-brand"></label>
          <label data-for="ap switch">Standard / management<input id="c-std" placeholder="Wi-Fi 6 / Smart managed"></label>
          <label data-for="ap">Streams<input id="c-streams" placeholder="2×2"></label>
          <label data-for="ap">2.4 GHz TX power (dBm)<input id="c-tx24" type="number" value="22"></label>
          <label data-for="ap">2.4 GHz antenna gain (dBi)<input id="c-g24" type="number" value="4"></label>
          <label data-for="ap">2.4 GHz max rate (Mbps)<input id="c-phy24" type="number" value="574"></label>
          <label data-for="ap">5 GHz TX power (dBm)<input id="c-tx5" type="number" value="25"></label>
          <label data-for="ap">5 GHz antenna gain (dBi)<input id="c-g5" type="number" value="5"></label>
          <label data-for="ap">5 GHz max rate (Mbps)<input id="c-phy5" type="number" value="2402"></label>
          <label data-for="ap">Max power draw (W)<input id="c-watt" type="number" value="13"></label>
          <label data-for="ap">Clients<input id="c-clients" type="number" value="250"></label>
          <label data-for="ap">Coverage claim (m²)<input id="c-area" type="number" value="120"></label>
          <label data-for="ap switch">PoE standard<select id="c-poe"><option value="af">802.3af (15.4 W)</option><option value="at" selected>802.3at PoE+ (30 W)</option><option value="bt">802.3bt (60 W+)</option></select></label>
          <label data-for="switch">Ports<input id="c-ports" type="number" value="16"></label>
          <label data-for="switch">PoE ports<input id="c-poePorts" type="number" value="16"></label>
          <label data-for="switch">PoE budget (W)<input id="c-budget" type="number" value="150"></label>
          <label data-for="cable">Conductor<select id="c-cond"><option>Bare copper</option><option>CCA</option></select></label>
          <label data-for="cable">AWG<input id="c-awg" type="number" value="23"></label>
          <label data-for="cable">DC resistance (Ω/100 m)<input id="c-R" type="number" step="0.01" value="6.66"></label>
          <label data-for="cable">Rated frequency (MHz)<input id="c-f" type="number" value="250"></label>
          <label data-for="cable">Loss limit at that frequency (dB)<input id="c-limit" type="number" step="0.1" value="30.7"></label>
        </div>
        <div class="cact"><button class="btn solid" id="c-save">Add &amp; apply</button><button class="btn" id="c-clear">Remove my custom models</button></div>
      </details>`)
    + section('wifi', 'LAB-02', 'Wi-Fi coverage on the floor plan', `<div class="lab-grid">
        <div class="lab-ctl">
          <label>Access point model<select id="sel-ap"></select></label>
          <div class="ctl-row"><span>Band</span><label class="tog"><input type="radio" name="band" value="5"> 5 GHz</label><label class="tog"><input type="radio" name="band" value="2.4"> 2.4 GHz</label></div>
          <div class="ctl-row"><span>APs switched on</span>${apToggles}</div>
          <label>Building loss exponent n = <b id="pl-n-v"></b><input type="range" id="pl-n" min="2" max="4" step="0.1"><small>2.0 open hall · 3.0 open office · 3.5 – 4 many walls / glass partitions</small></label>
          <label>Extra wall / furniture loss <b id="walls-v"></b><input type="range" id="walls" min="0" max="15" step="1"><small>Add ~3 dB per glass or plaster wall in the way</small></label>
          <div class="legend2">${[['#14a0aa', '−30 … −45 very strong'], ['#3fbf7f', '≥ −60 dBm excellent'], ['#9ccc4a', '−67 good (video calls)'], ['#e8c24a', '−72 fair (browsing)'], ['#e8833a', '−80 weak (edge)']].map(([c, t]) => `<span><i style="background:${c}"></i>${t}</span>`).join('')}</div>
        </div>
        <div class="stage lab-stage">${floorPlanSVG({ lab: true })}<div class="probe" id="probe" hidden></div>
          <div class="toolbar"><button class="tool" data-z="in" aria-label="Zoom in">+</button><button class="tool" data-z="out" aria-label="Zoom out">−</button><button class="tool" data-z="fit" aria-label="Fit to screen">⤢</button></div>
        </div>
      </div>
      <div class="ap-summary" id="ap-summary"></div>
      <div class="cards3"><div class="card cap" id="ap-card"></div></div>
      <h3 class="h3">Signal at each desk</h3>
      ${table(['Device', 'Zone', 'Best AP', 'Signal', 'Strength', 'Rating'], [], { cls: 'lab-t' }).replace('<tbody></tbody>', '<tbody id="desk-tbl"></tbody>')}
      <p class="note">Model: RSSI = EIRP − path loss at 1 m − 10·n·log₁₀(distance) − wall loss. EIRP is capped at 20 dBm (2.4 GHz) and 23 dBm (5 GHz) as typical indoor limits. This is a planning estimate; confirm with a walk test after installation.</p>`,
      'Coloured area = best signal from any switched-on AP. Dashed rings mark the good / fair / edge range of each AP.')
    + section('poe', 'LAB-03', 'Switch & PoE budget', `<label class="inline">Switch model <select id="sel-sw"></select></label>
      <div class="cards3"><div class="card cap" id="sw-card"></div></div>
      <div id="poe-bar"></div>`, `Power drawn by the APs (model above) and the mobile point (${6.5} W, IP-phone class) against the switch budget.`)
    + section('cable', 'LAB-04', 'Cable signal strength per run', `<label class="inline">Cable type <select id="sel-cable"></select></label>
      <div class="cards3"><div class="card cap" id="cable-card"></div></div>
      ${table(['Cable', 'Device', 'Length', 'Loss', 'Signal left', '%', 'Margin', 'PoE over this run'], [], { cls: 'lab-t' }).replace('<tbody></tbody>', '<tbody id="cable-tbl"></tbody>')}
      <p class="note">Insertion loss at <span id="cable-f"></span> MHz (the cable's rated frequency) for the scheduled pull length, plus two connections. Margin = permanent-link limit − loss: more is better, and below 3 dB is risky. PoE: 50 V source, two-pair delivery.</p>`),
});

out['installation.html'] = page('installation.html', {
  lead: 'Rules for the installer and the order of work. The aim is one visit with the ceiling open, every cable pulled, and nothing left to guess about later.',
  body:
    section('rules', 'INS-01', 'Installation rules', table(['Rule', 'Requirement'], [
      ['Wiring standard', 'T568B at both ends, on every outlet and the patch panel'],
      ['Run length', 'Permanent link ≤ 90 m (longest here is ' + D.LONGEST.est + ' m)'],
      ['Bend radius', 'Not tighter than 4 × the cable diameter (about 25 mm)'],
      ['Pulling tension', 'No more than 110 N (about 11 kg); pull by hand, do not use force'],
      ['Untwisting', 'Keep pair twists to within 13 mm of each termination'],
      ['Fixing', 'Velcro ties only; no cable ties pulled tight and no staples'],
      ['Power separation', 'At least 300 mm from unshielded power cables and light fittings; cross at 90°'],
      ['Ceiling', 'Cables lie in the tray or on J-hooks every 1.2–1.5 m; never on the ceiling tiles or grid'],
      ['Service loops', 'About 1 m inside the cabinet, 300 mm behind each outlet'],
      ['Fire stopping', 'Re-seal any wall or ceiling penetrations after the cables are through'],
    ].map(([a, b]) => `<tr><td><b>${a}</b></td><td>${b}</td></tr>`)))
    + section('seq', 'INS-02', 'Sequence of work', `<ol class="steps">
      <li><b>Survey and mark out.</b> Walk the site with this pack. Mark every outlet and AP position; confirm the IT Room cabinet wall and the tray route. Close items A-01 to A-05.</li>
      <li><b>Containment.</b> Mount the cabinet. Fit the ceiling tray / J-hooks from above the IT Room door to J5. Fit back boxes or surface boxes at each outlet.</li>
      <li><b>Pull cables.</b> Pull all ${D.DEVICES.length} cables in one go. Label both ends <i>before</i> cutting from the box.</li>
      <li><b>Terminate.</b> Punch down on the patch panel in port order and on the keystones at each outlet. Fit faceplates and labels.</li>
      <li><b>Test.</b> Test every link and fill in the test log (${docRef('testing.html')}). Fix and retest any failures.</li>
      <li><b>Active equipment.</b> Fit the shelf, ONT, router, switch and PDU. Patch with 0.5 m cords, port n to port n. Mount and connect the access points.</li>
      <li><b>Configure and commission.</b> Set up router, switch and Wi-Fi to the agreed plan. Check every device online.</li>
      <li><b>Handover.</b> Update this pack to "as built", hand over the test results, passwords (separately) and keys.</li>
    </ol>`)
    + section('coord', 'INS-03', 'Site coordination', `<ul class="ticks">
      <li>Book the cabling while the ceiling is open; the pull is the only step that needs the ceiling.</li>
      <li>The electrician provides the cabinet power socket and the desk power sockets before termination day.</li>
      <li>The ISP installs the fibre and ONT into the IT Room; agree the entry point so the ONT reaches the U11 shelf.</li>
      <li>Keep a clear path between the IT Room door and the Design area on pull day.</li>
    </ul>`),
});

out['testing.html'] = page('testing.html', {
  lead: 'What "done" means. Every link is tested and recorded, every device is checked on the network, and the client receives a handover pack.',
  body:
    section('accept', 'TST-01', 'Acceptance criteria', table(['Test', 'Pass', 'Tool'], [
      ['Wire map', 'All 8 conductors correct, T568B, no splits, opens or shorts', 'Cable tester'],
      ['Length', '≤ 90 m, and close to the scheduled length', 'Cable tester (TDR)'],
      ['Cat6 performance', 'Permanent link passes Cat6 limits (preferred)', 'Certification tester, e.g. Fluke DSX'],
      ['Link speed', 'Device links up at 1 Gbps full duplex', 'Switch port status'],
      ['PoE', 'AP / mobile point powers up from the switch', 'Switch PoE status'],
      ['Wi-Fi', 'Usable signal (about −67 dBm or better) in the Showroom and Design areas', 'Wi-Fi analyser app'],
    ].map(([a, b, c]) => `<tr><td><b>${a}</b></td><td>${b}</td><td class="muted">${c}</td></tr>`)))
    + section('log', 'TST-02', 'Test log', `<p class="sub">Print this page and fill it in on site. <button class="btn" onclick="window.print()">Print</button></p>`
      + table(['Cable', 'Device', 'Sched. m', 'Measured m', 'Wire map', 'Speed', 'Result', 'Initials / date'], D.BY_PORT.map(d =>
        `<tr><td class="m">${swatch(d.type)}${d.cable}</td><td>${d.id}</td><td class="n">${d.est}</td><td class="blank"></td><td class="blank"></td><td class="blank"></td><td class="blank">Pass / Fail</td><td class="blank"></td></tr>`), { cls: 'log' }))
    + section('commission', 'TST-03', 'Commissioning checklist', `<ul class="checks">
      ${['Internet up through the ONT and router', 'Switch reachable on its management address; firmware updated; admin password changed',
        'Every patch cord matches the port map (port n → PP-n)', 'AP1 and AP2 online and powered by PoE',
        'Staff and guest SSIDs broadcast; guest cannot reach office devices', 'Printer reachable on its reserved address and prints from a PC',
        'PC 1–PC 8 get an address and reach the internet', 'Server PC 7 on its static address',
        'Cabinet fan running; door locks; labels on every port', 'Wi-Fi walk test done in every zone'].map(t => `<li><label><input type="checkbox"> ${t}</label></li>`).join('')}
    </ul>`)
    + section('handover', 'TST-04', 'Handover pack', `<ul class="ticks">
      <li>This documentation updated to <b>as built</b>: real outlet positions and measured lengths</li>
      <li>Test log (and certification report if a certifier was used)</li>
      <li>Device list with serial numbers, MAC addresses and warranty dates</li>
      <li>Admin credentials for the router, switch and Wi-Fi, handed over <b>separately</b> and never written in this pack</li>
      <li>Cabinet keys</li>
    </ul>`),
});

out['open-items.html'] = page('open-items.html', {
  lead: 'Everything that is assumed or not yet decided. Each item should be closed before the stage it affects. Work can start once the A-items are confirmed and D-02 and D-03 are decided.',
  body:
    section('assumptions', 'OPEN-01', 'Assumptions to confirm on site', table(['ID', 'Assumption', 'Affects', 'Status'],
      D.ASSUMPTIONS.map(([id, t, a]) => `<tr><td class="m"><b>${id}</b></td><td>${t}</td><td class="muted">${a}</td><td><span class="pill open">Open</span></td></tr>`)))
    + section('decisions', 'OPEN-02', 'Decisions needed', table(['ID', 'Decision', 'Owner', 'Status'],
      D.DECISIONS.map(([id, t, o]) => `<tr><td class="m"><b>${id}</b></td><td>${t}</td><td class="muted">${o}</td><td><span class="pill open">Open</span></td></tr>`)))
    + section('risks', 'OPEN-03', 'Risks', table(['Risk', 'Level', 'Mitigation'],
      D.RISKS.map(([r, l, m]) => `<tr><td>${r}</td><td><span class="pill ${l.toLowerCase()}">${l}</span></td><td>${m}</td></tr>`)))
    + section('next', 'NEXT', 'Next steps', `<ol class="steps">
      <li>Review this pack and correct anything that is wrong.</li>
      <li>Site visit: close A-01 to A-05.</li>
      <li>Decide D-02, D-03 and D-05, then request supplier quotations against the ${docRef('materials.html')}.</li>
      <li>Book the installation while the ceiling is open.</li>
    </ol>`),
});

/* ---------- original interactive planner, re-themed ---------- */
const FONTS = '<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=IBM+Plex+Sans:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap" rel="stylesheet">';
{
  let p = fs.readFileSync(path.join(HERE, 'interactive-plan.src.html'), 'utf8');
  const theme = `${FONTS}<style>
:root,:root:not([data-theme="light"]),:root[data-theme="dark"],:root[data-theme="light"]{
  --bg:#0B0A08!important;--panel:#161310!important;--ink:#F0EAE2!important;--muted:#A99C8C!important;--line:#2E2620!important;--soft:#1C1712!important;
  --wall:#CFC5B8!important;--wall2:#6B6055!important;--accent:#D98A3D!important;--tray:rgba(217,138,61,.22)!important;
  --c-ap:#E8C24A!important;--c-pc:#6D9FF5!important;--c-srv:#B07CF0!important;--c-prn:#3CC7AD!important;--c-ph:#E46AA3!important;--c-wan:#F0645C!important;--c-up:#F0EAE2!important;
  --f-display:"Space Grotesk",sans-serif!important;--f-body:"IBM Plex Sans",sans-serif!important;--f-mono:"IBM Plex Mono",monospace!important;color-scheme:dark}
.back{display:inline-block;font:500 12px "IBM Plex Mono",monospace;letter-spacing:.1em;text-transform:uppercase;color:#D98A3D;text-decoration:none;margin-bottom:8px}
.back:hover{text-decoration:underline}
</style>`;
  p = p.replace('<header>', theme + '\n<header>')
    .replace('<title>Office 14 Network Cabling</title>', '<title>Interactive planner — Office 14 Network · OPPEIN</title>')
    .replace('<div class="ttl">', '<div class="ttl">\n    <a class="back" href="index.html">← Office 14 docs</a> <a class="back" href="floor-plan.html" style="margin-left:14px">DOC 01 floor plan</a>');
  fs.writeFileSync(path.join(OUT, 'interactive-plan.html'), p);
}

/* ---------- DOC 00 overview (entry page) ---------- */
const DESC = {
  'floor-plan.html': 'Plan with the ceiling tray, every cable and Wi-Fi coverage.',
  'topology.html': 'Network diagram, switch / patch-panel port map, proposed IP plan.',
  'rack.html': 'U-by-U layout of the 16U cabinet, power and cooling.',
  'cable-schedule.html': 'Every home run: ID, route, junction, pull length.',
  'materials.html': 'Editable bill of quantities with AED rates. Prints on a letterhead.',
  'equipment.html': 'What each part does and products to buy on Amazon.ae and noon.',
  'device-lab.html': 'Try a device model: Wi-Fi range, desk signal, PoE budget, cable loss.',
  'installation.html': 'Installer rules, sequence of work, labelling.',
  'testing.html': 'Acceptance tests, printable test log, commissioning, handover.',
  'open-items.html': 'Assumptions to confirm, decisions needed, risks.',
};
const GROUPS = [
  ['PLAN', 'Design', 'Where everything goes and how it connects.', ['floor-plan.html', 'topology.html', 'rack.html', 'cable-schedule.html']],
  ['BUY', 'Cost & equipment', 'What to buy, what it costs, and how it will perform.', ['materials.html', 'equipment.html', 'device-lab.html']],
  ['BUILD', 'Install & hand over', 'How it is installed, tested and closed out.', ['installation.html', 'testing.html', 'open-items.html']],
];
const card = f => { const [, c, t] = PAGES.find(p => p[0] === f); return `<a class="doc-card" href="${f}"><span class="num">DOC ${c}</span><b>${t}</b><span>${DESC[f]}</span></a>`; };
out['index.html'] = page('index.html', {
  lead: OVERVIEW_LEAD,
  body: `    <div class="hero-cta">
      <a class="btn solid" href="floor-plan.html">Start with the floor plan →</a>
      <a class="btn" href="materials.html">BOQ &amp; estimate</a>
      <a class="btn" href="device-lab.html">Device lab</a>
      <a class="btn" href="interactive-plan.html">Interactive planner</a>
    </div>\n`
    + section('summary', 'SUM-01', 'At a glance', tiles([
      [D.DEVICES.length, 'Home runs', 'one per outlet / device'],
      [`${D.TOTAL_M} m`, 'Cat6 to pull', `${D.BOXES} × 305 m box`],
      [D.OUTLETS, 'Outlets', `${D.DEVICES.filter(d => d.ceil).length} ceiling · ${D.OUTLETS - D.DEVICES.filter(d => d.ceil).length} wall`],
      [D.POE, 'PoE devices', '16-port PoE+ switch'],
      ['16U', 'Wall cabinet', 'IT Room'],
      [`${D.LONGEST.est} m`, 'Longest run', `${D.LONGEST.cable} · limit 90 m`],
    ]))
    + GROUPS.map(([k, t, d, files]) => section(k.toLowerCase(), k, t,
      `<div class="doc-grid">${files.map(card).join('')}${k === 'PLAN' ? `<a class="doc-card alt" href="interactive-plan.html"><span class="num">TOOL</span><b>Interactive planner</b><span>The original plan. Drag outlets to their real spot and lengths recalculate.</span></a>` : ''}</div>`, d)).join('')
    + OVERVIEW_SCOPE + OVERVIEW_ZONES
    + section('status', 'STATUS', 'Where the project stands', `<ol class="steps">
        <li><b>Documentation ${D.META.rev}:</b> drafted ${D.META.date}, for review.</li>
        <li><b>Next:</b> site visit to confirm outlet positions, then decisions on APs, switch and UPS (${link('open-items.html', 'open items')}).</li>
        <li><b>Then:</b> supplier quotations against the ${link('materials.html', 'BOQ')} and booking the installation.</li>
      </ol>`)
    + OVERVIEW_HISTORY,
});

fs.rmSync(path.resolve(HERE, '..', 'index.html'), { force: true }); // old separate landing page — the hub links straight to DOC 00
for (const [f, html] of Object.entries(out)) fs.writeFileSync(path.join(OUT, f), html);
for (const a of ['style.css', 'site.js', 'boq.js', 'lab.js', 'models.js']) fs.copyFileSync(path.join(HERE, a), path.join(OUT, 'assets', a));
fs.writeFileSync(path.join(OUT, 'assets', 'plan-art.js'), 'window.PLAN_ART=' + JSON.stringify(fs.readFileSync(path.join(HERE, 'plan-raw.svg'), 'utf8')) + ';\n');
console.log('Built', Object.keys(out).length, 'pages →', OUT, '| total', D.TOTAL_M, 'm');
