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
  ['drawing.html', 'DWG', 'Drawing'],
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

/* ---------------- page shell ----------------
   One template for every section (SYS-01 Internet & Telephone, SYS-02 CCTV, SYS-03 Rack & Cabinet). Section folders sit
   side by side under the Pyramid Centre folder, so ../index.html is the Pyramid Centre hub and ../../ the OPPEIN hub. */
const SEC_NET = {
  pages: PAGES, assets: 'assets/', crumb: 'Internet &amp; Telephone', side: 'SYS-01 · Internet &amp; Telephone',
  tag: `${D.META.rev} · ${D.META.status}`, title: 'Office 14 Network', meta: `${D.META.rev} · ${D.META.date}`,
  foot: `Office 14 Network documentation · ${D.META.rev}`,
};
const SA = '../oppein-pyramid-centre-network/assets/'; // shared assets for the other sections
const SEC_CCTV = {
  pages: [['index.html', '00', 'Overview'], ['drawing.html', 'DWG', 'Drawing'], ['cameras.html', '01', 'Camera schedule'], ['recording.html', '02', 'Recording & storage'], ['materials.html', '03', 'BOQ & estimate']],
  assets: SA, crumb: 'CCTV', side: 'SYS-02 · CCTV', tag: 'Upcoming', title: 'CCTV · Office 114', meta: 'Upcoming', foot: 'CCTV documentation · upcoming',
};
const SEC_CAB = {
  pages: [['index.html', '00', 'Overview'], ['design.html', '01', 'Cabinet design'], ['materials.html', '02', 'BOQ & estimate']],
  assets: SA, crumb: 'Rack &amp; Cabinet', side: 'SYS-03 · Rack &amp; Cabinet', tag: 'Upcoming', title: 'Rack & Cabinet · Office 114', meta: 'Upcoming', foot: 'Rack &amp; cabinet documentation · upcoming',
};
function page(file, { lead, body, wide = false, bodyClass = '', scripts = [] }, sec = SEC_NET) {
  const P = sec.pages;
  const i = P.findIndex(p => p[0] === file);
  const [, code, title] = P[i];
  const prev = P[i - 1], next = P[i + 1];
  const nav = P.map(([f, c, t]) =>
    `<a href="${f}"${f === file ? ' aria-current="page"' : ''}><span class="num">${c}</span>${t}</a>`).join('');
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${title} — ${sec.title} · OPPEIN</title>
<meta name="description" content="Office 14, Pyramid Centre — structured cabling and network documentation. ${esc(title)}.">
<meta name="robots" content="noindex, nofollow">
<link rel="icon" type="image/webp" href="../../assets/oppein-logo.webp">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Chakra+Petch:wght@400;500;600;700&family=IBM+Plex+Sans:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
<link rel="stylesheet" href="${sec.assets}style.css">
</head>
<body${bodyClass ? ` class="${bodyClass}"` : ''}>
<nav class="top">
  <div class="top-in">
    <a class="logo" href="../../index.html" title="Back to the project hub">
      <img class="logo-img" src="../../assets/oppein-logo.webp" alt="OPPEIN" onload="this.classList.add('loaded')">
      <span class="logo-dot"></span><span class="logo-txt">OPPEIN</span>
    </a>
    <span class="crumb"><a href="../../index.html">Projects</a> / <a href="../index.html">Pyramid Centre</a> / <a href="index.html">${sec.crumb}</a></span>
    <span class="nav-tag">${sec.tag}</span>
  </div>
</nav>
<div class="shell${wide ? ' wide' : ''}">
  <aside class="side" aria-label="Document pages">
    <div class="side-h">${sec.side}</div>
    <div class="side-nav">${nav}</div>
  </aside>
  <main>
    <header class="ph">
      <div class="eyebrow"><span class="led"></span>DOC ${code} · ${esc(title).toUpperCase()}</div>
      <h1>${title}</h1>
      ${lead ? `<p class="lead">${lead}</p>` : ''}
      <div class="meta"><span>${D.META.site}</span><span>${sec.meta}</span><span>${D.META.author}</span></div>
    </header>
${body}
    <footer class="pn">
      ${prev ? `<a class="prev" href="${prev[0]}"><small>← DOC ${prev[1]}</small>${prev[2]}</a>` : '<span></span>'}
      ${next ? `<a class="next" href="${next[0]}"><small>DOC ${next[1]} →</small>${next[2]}</a>` : '<span></span>'}
    </footer>
    <p class="foot">OPPEIN — Project hub · ${sec.foot}</p>
  </main>
</div>
${scripts.map(s => s.startsWith('<') ? s : `<script src="${s}"></script>`).join('\n')}
<script src="${sec.assets}site.js"></script>
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
    let nx = n1.x + n2.x, ny = n1.y + n2.y; const l = Math.hypot(nx, ny);
    if (l < 0.3) { nx = n1.x; ny = n1.y; } else { nx /= l; ny /= l; } // near U-turn: no miter
    const cos = Math.max(0.5, Math.abs(nx * n1.x + ny * n1.y)); // cap the miter so sharp turns cannot spike
    out.push({ x: p[i].x + nx * off / cos, y: p[i].y + ny * off / cos });
  }
  out.push(p.at(-1)); return out;
}
function glyph(d) {
  const c = D.TYPE_COLOR[d.type];
  if (d.type === 'sw') return el('rect', { x: -24, y: -12, width: 48, height: 24, rx: 4, fill: c }, null)
    + [...Array(d.ports)].map((_, i) => el('rect', { x: -20 + i * (40 / d.ports), y: -3, width: 40 / d.ports - 2, height: 7, rx: 1, fill: 'var(--bg)' }, null)).join('');
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
function floorPlanSVG({ lab = false, drawing = false, cams = false } = {}) {
  const B = D.BOUNDS;
  let s = `<svg class="canvas${lab ? ' lab' : ''}${drawing ? ' drawing' : ''}${cams ? ' show-camfov' : ''}" id="plan" viewBox="${B.x} ${B.y} ${B.w} ${B.h}" data-vb="${B.x} ${B.y} ${B.w} ${B.h}" role="img" aria-label="Office 14 floor plan with the ceiling conduit and wall casing route, the two switches and every Cat6 run">`;
  if (lab) s += `<image id="heat" x="${B.x}" y="${B.y}" width="${B.w}" height="${B.h}" preserveAspectRatio="none" style="image-rendering:auto"/>`;
  s += `<g class="plan" data-art></g>`;
  if (lab) s += `<g id="rings"></g>`;
  s += `<g class="zones">${[['SHOWROOM · OFFICE 14', 760, 1250, 0], ['DESIGN', 840, 300, 45]].map(([t, x, y, r]) =>
    el('text', { x, y, class: 'zoneLbl', 'font-size': 26, 'text-anchor': 'middle', transform: `rotate(${r} ${x} ${y})` }, t)).join('')}</g>`;
  s += `<g class="covers">${D.DEVICES.filter(d => d.type === 'ap').map(d => el('circle', { cx: d.x, cy: d.y, r: (7000 / D.MM_PER_PT).toFixed(0), class: 'cover' }, null)).join('')}</g>`;
  // ceiling PVC conduit (cabinet → mark 2, mark 2 → AP2) dashed; wall casing solid
  const conduitD = [toD(D.ROUTE.slice(0, 2)), ...D.RUNS.filter(r => r.viaCeiling).map(r => toD([D.ROUTE[1], r.to]))];
  s += `<g class="trays">${conduitD.map(d => el('path', { d, fill: 'none', stroke: 'var(--tray)', 'stroke-width': 12, 'stroke-dasharray': '22 12', 'stroke-linecap': 'round' }, null)).join('')}`
    + el('path', { d: toD(D.ROUTE.slice(1)), fill: 'none', stroke: 'var(--tray)', 'stroke-width': 16, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, null);
  s += el('circle', { cx: D.ROUTE[1].x, cy: D.ROUTE[1].y, r: 9, fill: 'var(--amber)', stroke: 'var(--panel)', 'stroke-width': 2.5 }, null)
    + el('text', { x: D.ROUTE[1].x + 14, y: D.ROUTE[1].y + 28, class: 'svgmono', 'font-size': 14 }, 'drop at 2');
  D.ROUTE.slice(2).forEach((p, i) => {
    s += el('circle', { cx: p.x, cy: p.y, r: 7, fill: 'var(--panel)', stroke: 'var(--amber)', 'stroke-width': 2.5 }, null);
    s += el('text', { x: p.x + 12, y: p.y + 24, class: 'svgmono', 'font-size': 14 }, 'J' + (i + 1));
  });
  s += el('text', { x: 1520, y: 1400, class: 'svgmono', 'font-size': 14, 'text-anchor': 'middle', transform: `rotate(56 ${(D.ROUTE[0].x + D.ROUTE[1].x) / 2 + 40} ${(D.ROUTE[0].y + D.ROUTE[1].y) / 2})` }, 'PVC conduit in the ceiling').replace('x="1520" y="1400"', `x="${(D.ROUTE[0].x + D.ROUTE[1].x) / 2 + 40}" y="${(D.ROUTE[0].y + D.ROUTE[1].y) / 2}"`) + '</g>';
  // CCTV drawing (cams): leave the Internet & Telephone cables and devices out; camLayer draws the cabinet instead
  if (!cams) {
  s += '<g class="cables">';
  D.RUNS.forEach((r, i) => {
    const off = (i - (D.RUNS.length - 1) / 2) * 3.2;
    s += el('path', { d: toD(offsetPath(r.path, off)), class: 'cable', stroke: D.TYPE_COLOR[r.type], 'stroke-width': r.kind === 'device' ? 3.4 : r.kind === 'phone' ? 3 : 5, 'data-id': r.toId, ...(r.kind === 'phone' ? { 'stroke-dasharray': '10 6' } : {}) }, null);
  });
  s += '</g><g class="devs">';
  for (const d of [...D.SWITCHES.filter(w => !w.cabinet).map(w => ({ ...w, type: 'sw' })), ...D.DEVICES.filter(x => !x.cab)]) {
    const sub = d.type === 'sw' ? `${d.ports}-port · ${d.at}` : d.local ? `patch · ${d.label}` : d.unpatched ? `${d.cable} · ${d.est} m · not patched` : `${d.cable} · ${d.est} m`;
    s += `<g class="dev${d.type === 'sw' ? ' swdev' : ''}" data-id="${d.id}" transform="translate(${d.x} ${d.y}) scale(1.35)"><title>${d.id} — ${esc(d.name)} · ${esc(sub)}</title>`
      + el('circle', { r: 26, fill: 'transparent' }, null) + glyph(d)
      + el('text', { y: -26, class: 'devlbl', 'font-size': 20, 'text-anchor': 'middle' }, d.id)
      + el('text', { y: 40, class: 'devsub', 'font-size': 13, 'text-anchor': 'middle' }, esc(sub)) + '</g>';
  }
  const R = D.RACK;
  s += `<g class="dev" data-id="RACK"><title>${D.RACK_U}U wall cabinet — ONT, router, Switch-01/02, DVR · IT Room</title>${el('rect', { x: R.x - 26, y: R.y - 22, width: 52, height: 44, rx: 4, fill: 'var(--ink)' }, null)}`
    + [0, 1, 2, 3].map(i => el('rect', { x: R.x - 20, y: R.y - 16 + i * 9, width: 40, height: 5, rx: 1, fill: 'var(--bg)', opacity: .8 }, null)).join('')
    + el('text', { x: R.x, y: R.y + 48, class: 'devlbl', 'font-size': 20, 'text-anchor': 'middle' }, 'CABINET · 12U') + '</g>';
  s += '</g>';
  }
  if (cams) s += camLayer();
  return s + '</svg>';
}

/* ---------------- CCTV camera layer (field-of-view cones, camera cables, camera icons) ---------------- */
function camLayer() {
  const k = 1000 / D.MM_PER_PT, rad = a => a * Math.PI / 180;
  let fov = '<g class="camfov">', cab = '<g class="camcab">', ico = '<g class="cams">';
  for (const c of D.CAMERAS) {
    const r = c.range * k, a1 = rad(c.dir - c.fov / 2), a2 = rad(c.dir + c.fov / 2);
    const p1 = [c.x + r * Math.cos(a1), c.y + r * Math.sin(a1)], p2 = [c.x + r * Math.cos(a2), c.y + r * Math.sin(a2)];
    fov += el('path', { d: `M${c.x} ${c.y}L${p1[0].toFixed(1)} ${p1[1].toFixed(1)}A${r.toFixed(1)} ${r.toFixed(1)} 0 0 1 ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}Z`, class: 'fov', 'data-id': c.id }, null);
    cab += el('path', { d: toD(c.run.path), class: 'cable camcable', 'data-id': c.id }, null);
    const ux = Math.cos(rad(c.dir)), uy = Math.sin(rad(c.dir));
    ico += `<g class="cam" data-id="${c.id}" transform="translate(${c.x} ${c.y})"><title>${c.id} — ${esc(c.name)} · ${esc(c.view)} · ${c.run.cable} siamese ${c.run.est} m · DVR CH${c.port}</title>`
      + el('circle', { r: 20, class: 'cambody' }, null) + el('circle', { r: 8, class: 'camlens', cx: (ux * 7).toFixed(1), cy: (uy * 7).toFixed(1) }, null)
      + el('text', { y: -28, class: 'devlbl', 'font-size': 20, 'text-anchor': 'middle' }, c.id) + '</g>';
  }
  const R = D.RACK;
  ico += `<g class="cabinet"><title>Cabinet (mark 1) — DVR and 12 V camera supply</title>${el('rect', { x: R.x - 26, y: R.y - 22, width: 52, height: 44, rx: 4, fill: 'var(--ink)' }, null)}`
    + el('text', { x: R.x, y: R.y + 48, class: 'devlbl', 'font-size': 20, 'text-anchor': 'middle' }, 'CABINET · DVR · 12 V') + '</g>';
  return fov + '</g>' + cab + '</g>' + ico + '</g>';
}

/* ---------------- topology svg ---------------- */
// Router → Switch-01 / Switch-02 (all in the cabinet) on the left; each unit's devices listed to the right of it.
function topologySVG() {
  const rowH = 54, gap = 34, X = 900, BW = 470;
  const groups = D.BY_UNIT.map(g => ({ ...g, devices: g.devices }));
  let y = 150; const pos = {}; // room above the router for the Internet box
  for (const g of groups) { pos[g.unit.id] = { top: y }; y += Math.max(g.devices.length + (g.unit.id === 'RTR' && D.PHONE ? 1 : 0), 2) * rowH + gap + 30; pos[g.unit.id].bottom = y - gap; }
  const H = Math.max(720, y + 20);
  const box = (x, yy, w, h, title, sub, color) =>
    el('rect', { x, y: yy, width: w, height: h, rx: 8, class: 'box', stroke: color }, null)
    + el('rect', { x, y: yy, width: 7, height: h, rx: 3, fill: color }, null)
    + el('text', { x: x + 18, y: yy + h / 2 - (sub ? 3 : -6), class: 'svgtxt', 'font-size': 18, 'font-weight': 700 }, esc(title))
    + (sub ? el('text', { x: x + 18, y: yy + h / 2 + 17, class: 'svgmono', 'font-size': 12 }, esc(sub)) : '');
  let s = `<svg class="diagram" viewBox="0 0 1500 ${H}" role="img" aria-label="Logical topology: Internet, ONT and router, then Switch-01 and Switch-02 in the cabinet, and the devices on each">`;
  const UX = 330, UW = 300;
  const uy = id => pos[id].top + 30;
  s += box(20, uy('RTR') - 100, 220, 60, 'Internet', 'ISP fibre → ONT', 'var(--c-wan)');
  s += el('path', { d: `M130 ${uy('RTR') - 40} V ${uy('RTR')}`, stroke: 'var(--c-wan)', 'stroke-width': 4, fill: 'none' }, null);
  for (const g of groups) {
    const u = g.unit, top = uy(u.id), h = 76;
    const isR = u.id === 'RTR';
    s += box(isR ? 20 : UX, top, isR ? 220 : UW, h, isR ? 'Router' : u.name, isR ? `cabinet · ${u.ports} LAN · DHCP · Wi-Fi` : `${u.at} · unmanaged · no PoE`, isR ? 'var(--c-wan)' : 'var(--amber)');
    if (isR && D.PHONE) { const r = D.PHONE, yy = pos[u.id].top, ny = yy + (rowH - 10) / 2;
      s += `<g class="lnk" data-id="TEL">` + el('path', { d: `M240 ${top - 70} C 520 ${top - 70}, ${X - 160} ${ny}, ${X} ${ny}`, fill: 'none', stroke: D.TYPE_COLOR.tel, 'stroke-width': 3, 'stroke-dasharray': '8 5' }, null)
        + el('text', { x: X - 12, y: ny - 7, class: 'svgmono', 'font-size': 12, 'text-anchor': 'end' }, `${r.cable} · ${r.est} m`)
        + box(X, yy, BW, rowH - 10, 'TEL — Phone line to desk 5', `ONT-TEL1 · RJ11 phone · separate from the LAN`, D.TYPE_COLOR.tel) + '</g>'; }
    const ox = (isR ? 240 : UX + UW);
    // chain link to the next switch
    for (const nxt of D.SWITCHES.filter(w => w.from === u.id)) {
      // router: straight down from its box; a switch: out of its left side and down the left margin, so the
      // line to SW2 does not cross the SW1 box
      const r = D.feedOf(nxt.id), ty = uy(nxt.id) + 38, sx = isR ? 130 : UX - 34;
      const d = isR ? `M${sx} ${top + h} V ${ty} H ${UX}` : `M${UX} ${top + h / 2} H ${sx} V ${ty} H ${UX}`;
      s += `<g class="lnk" data-id="${nxt.id}">` + el('path', { d, stroke: D.TYPE_COLOR[r.type], 'stroke-width': 5, fill: 'none' }, null)
        + el('text', isR ? { x: sx + 10, y: ty - 12, class: 'svgmono', 'font-size': 11 } : { x: sx - 8, y: ty + 4, class: 'svgmono', 'font-size': 11, 'text-anchor': 'end' }, r.run ? `${r.cable} · ${r.est} m · ${D.portLabel(r.from, r.fromPort)} → ${nxt.id}-P${nxt.inPort}` : `patch · ${D.portLabel(r.from, r.fromPort)} → ${nxt.id}-P${nxt.inPort}`) + '</g>';
    }
    g.devices.forEach((d, i) => {
      const yy = pos[u.id].top + (i + (isR && D.PHONE ? 1 : 0)) * rowH, ny = yy + (rowH - 10) / 2, c = D.TYPE_COLOR[d.type];
      s += `<g class="lnk" data-id="${d.id}">`;
      s += el('path', { d: `M${ox} ${top + h / 2} C ${ox + 120} ${top + h / 2}, ${X - 140} ${ny}, ${X} ${ny}`, fill: 'none', stroke: c, 'stroke-width': 3, ...(d.local ? { 'stroke-dasharray': '3 5' } : {}) }, null);
      s += el('text', { x: X - 12, y: ny - 7, class: 'svgmono', 'font-size': 12, 'text-anchor': 'end' }, d.local ? 'patch cord' : `${d.cable} · ${d.est} m`);
      s += box(X, yy, BW, rowH - 10, /^PC \d$/.test(d.name) ? d.id : `${d.id} — ${d.name}`, `${d.label} · ${D.TYPE_NAME[d.type]}${d.poe ? ' · PoE injector' : ''}`, c);
      s += '</g>';
    });
  }
  return s + '</svg>';
}

/* ---------------- rack svg ---------------- */
function rackSVG() {
  const U = 46, X = 120, W = 480, top = 80;
  const N = D.RACK_U;
  let s = `<svg class="diagram rack" viewBox="0 0 1000 ${N * U + 200}" role="img" aria-label="Front elevation of the ${N}U wall cabinet">`;
  s += el('rect', { x: X - 40, y: top - 50, width: W + 80, height: N * U + 100, rx: 10, fill: 'var(--panel-2)', stroke: 'var(--border)', 'stroke-width': 2 }, null);
  s += el('text', { x: X + W / 2, y: top - 18, class: 'svgtxt', 'font-size': 20, 'font-weight': 700, 'text-anchor': 'middle' }, `19″ ${N}U WALL CABINET · IT ROOM`);
  for (let u = N; u >= 1; u--) {
    const y = top + (N - u) * U; const [name, kind] = D.RACK_UNITS[u];
    s += el('text', { x: X - 14, y: y + U / 2 + 5, class: 'svgmono', 'font-size': 13, 'text-anchor': 'end' }, 'U' + u);
    const fill = (kind === 'pp' || kind === 'pdu') ? '#2a2420' : (kind === 'cm' || kind === 'shelf' || kind === 'brush' || kind === 'sw' || kind === 'dvr' || kind === 'ont') ? 'var(--panel)' : 'var(--bg-alt)';
    s += el('rect', { x: X, y: y + 2, width: W, height: U - 4, rx: 3, fill, stroke: 'var(--border)' }, null);
    // switch shelf: the three desktop switches side by side, used ports dark
    if (kind === 'sw') { let x0 = X + 16; for (const w of D.SWITCHES) { const used = D.usedPorts(w.id), bw = w.ports * 14 + 40; s += el('rect', { x: x0, y: y + 7, width: bw, height: U - 14, rx: 3, fill: 'var(--amber)' }, null) + el('text', { x: x0 + 6, y: y + U / 2 + 4, 'font-size': 10, class: 'svgmono', style: 'fill:var(--bg)' }, w.id); for (let i = 0; i < w.ports; i++) s += el('rect', { x: x0 + 32 + i * 14, y: y + 16, width: 10, height: 12, rx: 1.5, fill: used.has(i + 1) ? 'var(--bg)' : 'rgba(0,0,0,.25)' }, null); x0 += bw + 10; }
      for (let i = 0; i < D.POE; i++) { s += el('rect', { x: x0 + i * 62, y: y + 11, width: 54, height: 22, rx: 3, fill: 'var(--c-ap)' }, null) + el('text', { x: x0 + i * 62 + 27, y: y + 26, 'font-size': 10, 'text-anchor': 'middle', class: 'svgmono', style: 'fill:var(--bg)' }, 'PoE INJ'); } }
    if (kind === 'pp') for (let i = 0; i < 24; i++) { const used = i < D.PANEL.length; s += el('rect', { x: X + 22 + i * 18.5, y: y + 14, width: 14, height: 13, rx: 1.5, fill: used ? 'var(--c-prn)' : 'var(--ink-faint)' }, null); }
    const box = (x, w, h, fillc, t) => el('rect', { x: X + x, y: y + U - 4 - h, width: w, height: h, rx: 3, fill: fillc }, null) + el('text', { x: X + x + w / 2, y: y + U - 4 - h / 2 + 4, 'font-size': 12, 'text-anchor': 'middle', class: 'svgmono', style: 'fill:var(--bg)' }, t);
    if (kind === 'shelf') s += box(110, 220, 30, 'var(--ink-dim)', 'ROUTER') + el('rect', { x: X + 4, y: y + U - 5, width: W - 8, height: 3, fill: '#6b5a48' }, null);
    if (kind === 'ont') s += box(130, 180, 26, 'var(--c-wan)', 'ONT (on the router)');
    if (kind === 'dvr') s += box(40, 200, 32, 'var(--c-cam)', 'DVR 4-CH') + box(270, 110, 26, 'var(--c-cam)', 'PSU 12 V');
    if (kind === 'cm') for (let i = 0; i < 10; i++) s += el('rect', { x: X + 24 + i * 46, y: y + 10, width: 28, height: 22, rx: 4, fill: 'none', stroke: 'var(--ink-faint)', 'stroke-width': 2 }, null);
    if (kind === 'brush') s += el('rect', { x: X + 30, y: y + 17, width: W - 60, height: 8, rx: 4, fill: 'var(--ink-faint)' }, null);
    if (kind === 'pdu') for (let i = 0; i < 6; i++) s += el('rect', { x: X + 30 + i * 52, y: y + 12, width: 22, height: 18, rx: 3, fill: 'var(--ink-dim)' }, null);
    s += el('text', { x: X + W + 64, y: y + U / 2 + 5, class: kind === 'spare' || kind === 'blank' || kind === 'shelfb' ? 'svgmono' : 'svgtxt', 'font-size': 15 }, esc(name));
  }
  s += el('text', { x: X - 40, y: top + N * U + 84, class: 'svgmono', 'font-size': 13 }, `Patch panel: ${D.PANEL.map(p => `PP-${p.pp} ${p.run.cable} (${p.run.toId})`).join(' · ')}`);
  s += el('text', { x: X - 40, y: top + N * U + 104, class: 'svgmono', 'font-size': 13 }, `Router L1 → Switch-02 · L2 → Switch-01 · L3/L4 IT PC 3/4 · free: ${D.SPARE_RANGE}`);
  return s + '</svg>';
}

/* ================= PAGES ================= */
const zones = [...new Set(D.DEVICES.map(d => d.zone))];
const out = {};

/* Overview content — DOC 00 (index.html), assembled after GROUPS below */
const OVERVIEW_LEAD = `The local network and Cat6 cabling for Office 14 at Pyramid Centre. Everything active sits in one 12U cabinet in the IT Room: the ONT and router on one shelf, the two existing switches (Switch-01 5-port, Switch-02 8-port) fed straight from the router, and the CCTV recorder. Every device has its own cable from the cabinet: the IT Room PCs along the IT Room walls, and everything else up through a PVC conduit in the ceiling to mark 2, then in wall casing to each desk. A separate phone line runs from the ONT to desk 5. Between them they connect ${D.DEVICES.filter(d => d.type === 'pc').length} PCs, a printer, a mobile and ${D.DEVICES.filter(d => d.type === 'ap').length} Wi-Fi access points.`;
const OVERVIEW_SCOPE = section('scope', 'SCOPE', 'Scope of work',
      `<div class="cols2"><div class="card"><h3>In scope</h3><ul class="ticks">
        <li>19″ ${D.RACK_U}U wall cabinet in the IT Room, laid out as in the plan sheet: router + ONT shelf, switch shelf, cable manager, fully loaded patch panel, PDUs</li>
        <li>PVC conduit in the ceiling from the cabinet to mark 2 (≈ ${Math.round(D.CONDUIT_M)} m), then wall casing to every desk and up to AP1 (≈ ${Math.round(D.CASING_M)} m)</li>
        <li>${D.RUNS.length} Cat6 runs (${D.TOTAL_M} m), terminated in RJ45 surface boxes and on the cabinet patch panel</li>
        <li>The two existing switches on one shelf in the cabinet, fed straight from the router, plus PoE injectors for AP1 and AP2</li>
        <li>A separate phone line (${D.PHONE.cable}) from the ONT phone port to the mobile at desk 5</li>
        <li>Labelling of every cable at both ends, panel port and surface box</li>
        <li>Testing of every link, a written test record, and configuring the router and access points</li>
      </ul></div><div class="card"><h3>Not in scope (unless agreed)</h3><ul class="crosses">
        <li>ISP fibre to the building and the ONT itself (ISP)</li>
        <li>Electrical works: new power sockets, the cabinet supply circuit</li>
        <li>PC, printer and software set-up</li>
        <li>CCTV, access control, telephone system</li>
        <li>Painting or making good the walls after the casing is fixed</li>
      </ul></div></div>`, 'Draft scope based on the cabling plan. To be agreed before work starts.');
const OVERVIEW_ZONES = section('zones', 'ZONES', 'Areas served',
      table(['Zone', 'Devices', 'Connected to', 'Outlets', 'Length'], zones.map(z => {
        const ds = D.DEVICES.filter(d => d.zone === z);
        return `<tr><td><b>${z}</b></td><td>${ds.map(d => `${swatch(d.type)}${d.id}`).join(' &nbsp; ')}</td><td class="m">${[...new Set(ds.map(d => d.on))].join(', ')}</td><td class="n">${ds.filter(d => !d.local).length}</td><td class="n">${ds.reduce((s, d) => s + d.est, 0)} m</td></tr>`;
      })));
const OVERVIEW_HISTORY = section('history', 'REV', 'Revision history',
      table(['Rev', 'Date', 'Change', 'By'], D.REVISIONS.map(([r, d, c]) => `<tr><td class="m">${r}</td><td class="m">${d}</td><td>${c}</td><td>${D.META.author}</td></tr>`)));

/* ---------- DWG · drawing only ---------- */
out['drawing.html'] = page('drawing.html', {
  wide: true, scripts: ['assets/plan-art.js'],
  lead: 'The Office 14 floor plan drawing on its own. It opens as the bare drawing; switch on the layers you need.',
  body: `    <div class="stage drawing-stage">
        ${floorPlanSVG({ drawing: true })}
        <div class="toolbar">
          <button class="tool" data-z="in" aria-label="Zoom in">+</button>
          <button class="tool" data-z="out" aria-label="Zoom out">−</button>
          <button class="tool" data-z="fit" aria-label="Fit to screen">⤢</button>
        </div>
      </div>
      <div class="layers" role="group" aria-label="Layers">
        <span class="layers-h">Layers</span>
        <button class="tool" data-layer="tray" aria-pressed="false">Conduit &amp; casing</button>
        <button class="tool" data-layer="cables" aria-pressed="false">Cables</button>
        <button class="tool" data-layer="devs" aria-pressed="false">Devices &amp; switches</button>
        <button class="tool" data-layer="cov" aria-pressed="false">Wi-Fi</button>
      </div>
      <p class="note">Scroll or pinch to zoom, drag to pan. For cable IDs, lengths and the device list, see ${docRef('floor-plan.html')}.</p>
`,
});

out['floor-plan.html'] = page('floor-plan.html', {
  wide: true, scripts: ['assets/plan-art.js'],
  lead: 'Plan view of Office 14 with the ceiling conduit, the wall casing, the switches, every Cat6 run and the device positions (from the marked plan, marks 1–8). Check positions on site.',
  body:
    section('routes', 'PLAN-01', 'Cable routes', // not id "plan" — that is the SVG site.js pans/zooms
      `<div class="planrow">
      <div class="stage">
        ${floorPlanSVG()}
        <div class="toolbar">
          <a class="tool" href="drawing.html" title="Open the drawing on its own page">DWG</a>
          <button class="tool" data-z="in" aria-label="Zoom in">+</button>
          <button class="tool" data-z="out" aria-label="Zoom out">−</button>
          <button class="tool" data-z="fit" aria-label="Fit to screen">⤢</button>
          <button class="tool" id="tcov" aria-pressed="false" title="Show Wi-Fi coverage">Wi-Fi</button>
        </div>
      </div>
      <div class="chips side-chips" id="devchips" aria-label="Devices">${D.RUNS.map(r => `<button class="chip" data-id="${r.toId}">${swatch(r.type)}${r.toId}<small>${r.cable} · ${r.est} m</small></button>`).join('')}${D.LOCAL.map(d => `<button class="chip" data-id="${d.id}">${swatch(d.type)}${d.id}<small>patch · ${d.label}</small></button>`).join('')}</div>
      </div>
      <div class="legend legend-below">
        <span><i class="tel"></i>Phone line</span><span>${swatch('ap')}Access point</span><span>${swatch('pc')}Workstation PC</span><span>${swatch('srv')}Server</span>
        <span>${swatch('prn')}Printer</span><span>${swatch('ph')}Mobile point</span><span><i class="tray"></i>Wall casing</span><span><i class="conduit"></i>Ceiling PVC conduit</span>
      </div>
      <p class="note">Scroll or pinch to zoom, drag to pan. Hover or tap a device on the plan, or a device in the list, to pick out its cable. The Wi-Fi circles show a 7 m radius and are only a guide, not a survey. The <a href="interactive-plan.html">interactive planner</a> is the original Rev A design (ceiling tray, one switch) and is kept for reference only.</p>`)
    + section('casing', 'PLAN-02', 'Conduit and casing route',
      `<p>Cables for the Design area leave the top of the cabinet into a <b>PVC conduit in the ceiling</b> and run straight to <b>mark 2</b> (${D.CONDUIT[0].list.join(', ')}). At mark 2 they come down behind the wall to skirting level and continue in <b>wall casing</b> along the desk wall to desks 3, 4, 5 and 6. AP2 (Showroom) leaves the casing at mark 2, goes back up and crosses the ceiling in its own conduit. AP1 has a casing up the wall to the ceiling. The 4 IT Room PCs stay inside the IT Room in casing along its walls.</p>`
      + table(['Ceiling conduit', 'Length', 'Cables', 'Conduit'], D.CONDUIT.map(c => `<tr><td>${c.what}</td><td class="n">${f1(c.len)} m</td><td class="n">${c.cables}</td><td class="m">${c.size} PVC</td></tr>`))
      + table(['Wall casing (from mark 2)', 'Length', 'Cables', 'Casing'], D.CASING_SEGS.map(c => `<tr${c.cables ? '' : ' class="spare"'}><td class="m">${c.from} → ${c.to}</td><td class="n">${f1(c.len)} m</td><td class="n">${c.cables || '—'}</td><td class="m">${c.size}</td></tr>`))
      + table(['Branch', 'Length', 'Cables', 'Casing'], D.CASING_LEGS.map(c => `<tr><td class="m">${c.from} ↔ ${c.at}</td><td class="n">${f1(c.len)} m</td><td class="n">${c.cables}</td><td class="m">${c.size}</td></tr>`)
        .concat([...D.CASING_VERT, ...D.CASING_ROOM].map(c => `<tr><td>${c.what}</td><td class="n">${f1(c.len)} m</td><td class="n">—</td><td class="m">${c.size}</td></tr>`)))
      + `<p class="note">Conduit: ${f1(D.CONDUIT_M)} m of 20 mm PVC (${Math.ceil(D.CONDUIT_M * 1.1 / 3)} × 3 m lengths) — or reuse the pipe already in place. Casing to order: ${D.CASING_SIZES.map(c => `<b>${c.size}</b> ${f1(c.m)} m → ${c.lengths} × 2 m lengths`).join(' · ')} (10 % added for offcuts). Junctions:</p>`
      + table(['Junction', 'Note', 'Cables leaving here'], Object.entries(D.JUNCTION_NOTES).map(([j, note]) => {
        const rs = D.RUNS.filter(r => r.junction === j);
        return `<tr><td class="m"><b>${j}</b></td><td>${note}</td><td>${rs.map(r => `${swatch(r.type)}${r.cable} ${r.toId}`).join(' &nbsp; ') || '—'}</td></tr>`;
      })))
    + section('heights', 'PLAN-03', 'Outlet positions',
      table(['Outlet type', 'Mounting', 'Used for'], [
        `<tr><td><b>Desk outlet</b></td><td>1× RJ45 surface box at the end of the casing, 300 mm above floor, next to a power socket</td><td>${D.DEVICES.filter(d => !d.local && !d.ceil).map(d => d.id).join(', ')}</td></tr>`,
        `<tr><td><b>AP outlet</b></td><td>Surface box at ceiling level next to the AP, at the top of the vertical casing; 300 mm service loop</td><td>${D.DEVICES.filter(d => d.ceil).map(d => d.id).join(', ')}</td></tr>`,
        `<tr><td><b>Phone socket</b></td><td>1× RJ45 surface box at desk 5 on its own cable (${D.PHONE.cable}) from the ONT phone port; the phone's RJ11 plug fits the RJ45 jack</td><td>Mobile / phone</td></tr>`,
      ]) + callout('warn', '<b>Check on site:</b> every outlet position on this plan is taken from a sketch. Mark each one on the wall or ceiling with the furniture layout in hand before any casing is fixed (open item A-01). The IT Room PC positions are not marked yet (A-03).')),
});

out['topology.html'] = page('topology.html', {
  wide: true,
  lead: 'How the network fits together: the ISP line comes into the ONT and router in the cabinet. The router feeds Switch-02 and Switch-01 directly with patch cords; every device cable starts on the cabinet patch panel and is patched to its switch or router port. The ONT phone port has its own line to desk 5. The mobile\'s data cable is pulled but not patched (no free port).',
  body:
    section('logical', 'NET-01', 'Logical topology', `<div class="figure">${topologySVG()}</div>
      <p class="note">ISP fibre → ONT → router → Switch-02 (L1) and Switch-01 (L2), all patched inside the cabinet. Every device has its own cable from the cabinet; the dashed pink line is the phone line. The APs get power from a PoE injector beside their switch.</p>`)
    + section('ports', 'NET-02', 'Port map', D.UNITS.map(u => `<h3 class="h3">${u.id === 'RTR' ? 'Router LAN (cabinet) · ONT phone port TEL1 → ' + D.PHONE.cable + ' to desk 5' : `${u.name} · ${u.at}`}</h3>`
      + table(['Port', 'Connects to', 'Cable', 'Zone', 'PoE', 'Proposed IP'], D.portMap(u.id).map(x => `<tr${x.dev ? ` data-id="${x.dev.id}"` : ''}${x.what === 'Spare' ? ' class="spare"' : ''}><td class="m">${D.portLabel(u.id, x.p)}</td><td>${x.type ? swatch(x.type) : ''}${x.what}</td><td class="m">${x.cable}</td><td>${x.dev ? x.dev.zone : '—'}</td><td class="n">${x.dev?.poe ? 'Injector' : '—'}</td><td class="m">${x.dev ? ({ AP1: '.11', AP2: '.12', PRN: '.20', IT1: '.31', IT2: '.32', IT3: '.33', IT4: '.34' }[x.dev.id] || 'DHCP') : '—'}</td></tr>`))).join(''),
      `Spare ports: ${Object.entries(D.SPARE).map(([k, v]) => `${k} ${v.length ? v.map(p => D.portLabel(k, p)).join(', ') : 'none'}`).join(' · ')}.`)
    + section('ip', 'NET-03', 'Proposed addressing', callout('info', '<b>Proposal only.</b> Nothing below is agreed yet; see open item D-01. SW1 and SW2 are unmanaged, so they have no address. The plan is here so the router, APs and printer can be set up the same day the cabling is finished.')
      + table(['Item', 'Address / range', 'Note'], D.IP_PLAN.map(([a, b, c]) => `<tr><td>${a}</td><td class="m">${b}</td><td>${c}</td></tr>`)))
    + section('wifi', 'NET-04', 'Wi-Fi', table(['SSID (proposed)', 'For', 'Security'], [
      '<tr><td class="m">OPPEIN-Office</td><td>Staff laptops and phones</td><td>WPA2/WPA3-Personal, strong passphrase</td></tr>',
      '<tr><td class="m">OPPEIN-Guest</td><td>Visitors and showroom clients</td><td>Separate passphrase, client isolation on the AP, internet only</td></tr>',
    ]) + `<p>The switches are unmanaged (no VLANs), so guest isolation is done by the APs' guest-network setting. The same SSIDs go on all access points so devices roam between them. Use non-overlapping 2.4 GHz channels (1 / 6 / 11) and auto channel on 5 GHz. After installation, walk the office with a Wi-Fi analyser to confirm coverage (see ${docRef('testing.html')}).</p>`),
});

out['rack.html'] = page('rack.html', {
  lead: `Front view of the 19″ ${D.RACK_U}U wall cabinet in the IT Room, laid out as in the plan sheet. The router sits on a plain shelf with the ONT stacked on top and free space above; the two switches and the PoE injectors share the shelf below; the DVR and the camera supply sit on the top shelf. All ${D.PANEL.length} cables end on the fully loaded 24-port patch panel. Free: ${D.SPARE_RANGE}.`,
  body:
    section('elev', 'RACK-01', 'Front elevation', `<div class="figure narrow">${rackSVG()}</div>`)
    + section('units', 'RACK-02', 'Unit schedule', table(['U', 'Item', 'Note'], Object.keys(D.RACK_UNITS).sort((a, b) => b - a).map(u => {
      const [n, k] = D.RACK_UNITS[u];
      const note = { brush: 'Cables enter from the casing above the cabinet', pp: `${D.PANEL.length} ports used: ${D.PANEL.map(p => `PP-${p.pp} ${p.run.cable}`).join(', ')}`, sw: `Switch-02 ← router L1 · Switch-01 ← router L2 · ports all in use`, cm: 'Route 0.5 m cords', shelf: `Plain shelf; the ONT is stacked on the router · router L3/L4 → IT PC 3/4 · ONT TEL1 → PP (${D.PHONE.cable} phone line)`, ont: 'Sits on the router; free space above (U8–U10)', dvr: 'DVR → Switch-01 P5; camera coax lands on the DVR, power on the 12 V supply', spare: 'Kept free', shelfb: 'Free space above the router / ONT stack', pdu: 'Two 6-way PDUs (U2, U1): 8 sockets in use' }[k] || '';
      return `<tr${k === 'spare' || k === 'blank' || k === 'shelfb' ? ' class="spare"' : ''}><td class="m">U${u}</td><td>${n}</td><td>${note}</td></tr>`;
    })))
    + section('env', 'RACK-03', 'Power, cooling and access', `<ul class="ticks">
      <li><b>Power:</b> a dedicated 230 V socket next to the cabinet for the two 6-way PDUs (8 plugs in use, 4 spare). A tower UPS beside the cabinet is recommended (open item D-05).</li>
      <li><b>Cooling:</b> fan on top of the cabinet; keep the side vents clear and close the spare slots with blank panels.</li>
      <li><b>Mounting:</b> fix to a solid wall; the cables come down from the ceiling conduit and the IT Room casing and enter through the top cable entry (brush grommet).</li>
      <li><b>Access:</b> lockable glass door; key kept by IT. Leave about 600 mm clear in front for working.</li>
      <li><b>Patch cords:</b> one colour per use makes faults easier to trace: red for router-to-switch cords, blue for PCs, yellow for AP / injector cords, pink RJ11–RJ45 cord for the phone line.</li>
    </ul>`),
});

out['cable-schedule.html'] = page('cable-schedule.html', {
  wide: true,
  lead: 'One cable per device, every one starting on the cabinet patch panel. Each cable is labelled with the same ID at both ends; the patch-panel port is patched to the switch port shown.',
  body:
    section('sched', 'CAB-01', 'Schedule',
      table(['Cable', 'From', 'To', 'Type', 'Zone', 'End', 'Via', 'Route m', 'Drops m', 'Pull m', 'PoE'], D.RUNS.map(r =>
        `<tr data-id="${r.toId}"><td class="m">${swatch(r.type)}<b>${r.cable}</b></td><td class="m">${D.portLabel(r.fromId, r.fromPort)}</td><td>${r.kind === 'device' ? r.name : `${r.toId} (${r.to.name})`}</td><td>${D.TYPE_NAME[r.type]}</td><td>${r.zone}</td><td>${r.kind === 'device' ? r.to.outletShort : r.kind === 'phone' ? 'Phone socket' : 'Switch desk'}</td><td class="m">${r.junction}</td><td class="n">${f1(r.casingM)}</td><td class="n">${f1(r.drops)}</td><td class="n"><b>${r.est}</b></td><td class="n">${r.poe ? 'Injector' : '—'}</td></tr>`)
        .concat(D.LOCAL.map(d => `<tr data-id="${d.id}" class="spare"><td class="m">${swatch(d.type)}patch</td><td class="m">${d.label}</td><td>${d.name}</td><td>${D.TYPE_NAME[d.type]}</td><td>${d.zone}</td><td>Patch cord</td><td class="m">—</td><td class="n">—</td><td class="n">—</td><td class="n">2 m cord</td><td class="n">—</td></tr>`)),
        { foot: `<tfoot><tr><td colspan="9">Total Cat6</td><td class="n">${D.TOTAL_M} m</td><td></td></tr></tfoot>` }))
    + section('method', 'CAB-02', 'How lengths are worked out', `<p class="formula">Pull length = ( conduit + casing route + start drop + mark-2 drop + end drop ) × ${1 + D.SLACK}, rounded up to the next metre</p>
      ${table(['Part', 'Allowance'], [
        '<tr><td>Route</td><td>Measured on the plan: cabinet → ceiling conduit → mark 2, then along the wall casing to the junction nearest the device and along the branch. IT Room runs follow the IT Room walls.</td></tr>',
        `<tr><td>Start drop</td><td>${D.DROP.rack} m from the cabinet up to the conduit (or down to the IT Room casing), incl. dressing loop</td></tr>`,
        `<tr><td>Mark-2 drop</td><td>${D.CEIL_DROP} m from the ceiling down behind the wall to skirting (cabinet runs), or back up for AP2</td></tr>`,
        `<tr><td>End drop</td><td>${D.DROP.wall} m at a desk surface box · ${D.DROP.ap} m up the wall to AP1 · ${D.DROP.apCeil} m at AP2 in the ceiling · ${D.DROP.switch} m when the far end is a switch</td></tr>`,
        `<tr><td>Slack</td><td>${D.SLACK * 100} % for following the walls around obstacles and termination</td></tr>`,
      ])}
      ${callout('info', `The longest run is ${D.LONGEST.cable} (${D.LONGEST.name}) at <b>${D.LONGEST.est} m</b>, well inside the 90 m Cat6 limit. Measure the real route on site before cutting; this table is for ordering and checking.`)}`)
    + section('labels', 'CAB-03', 'Label format', table(['Where', 'Label', 'Example'], [
      '<tr><td>Cable, both ends (within 300 mm of termination)</td><td>Cable ID</td><td class="m">C-06</td></tr>',
      '<tr><td>Surface box at the device</td><td>Cable ID / switch port</td><td class="m">C-06 / SW2-P4</td></tr>',
      '<tr><td>Cabinet patch-panel port</td><td>Cable ID / device</td><td class="m">PP-1 · C-01 PC2</td></tr>',
      '<tr><td>Switch (sticker on top)</td><td>Switch ID / what feeds it</td><td class="m">SW2 ← RTR-L1</td></tr>',
    ])),
});

/* ---------- DOC 05 · BOQ & estimate ---------- */
const money = n => n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const STORE = { amazon: 'Amazon.ae', noon: 'noon UAE' };
function boqRows(boq = Q.BOQ, guides = true) {
  let h = '';
  for (const sec of boq) {
    // every line has a tick (boq.js numbers the ticked lines A.1, A.2 … and totals only those); the section tick sets all of it
    h += `<tr class="grp${sec.optional ? ' optgrp' : ''}" data-grp="${sec.code}"><td class="m"><input type="checkbox" class="secinc no-print" aria-label="Tick or untick all of section ${sec.code}"> ${sec.code}</td><td colspan="5"><span class="gt-title">${sec.title}</span>${sec.optional ? ' <span class="optnote no-print">— tick an item to include it in the total</span>' : ''}</td></tr>`;
    sec.items.forEach(([desc, unit, q, r, fn, basis, guide, sheet], i) => {
      const key = `${sec.code}.${i + 1}`;
      h += `<tr class="it${sec.optional ? ' opt' : ''}" data-key="${key}" data-sec="${sec.code}" data-defon="${sec.optional ? 0 : 1}">
        <td class="m"><input type="checkbox" class="inc no-print"${sec.optional ? '' : ' checked'} aria-label="Include ${key}"> <span class="no">${key}</span></td>
        <td><span class="d">${esc(desc)}</span><div class="fn">${esc(fn)}</div><div class="rmk no-print">${basis ? 'Rate basis: ' + esc(basis) : ''}${guides && guide ? `${basis ? ' · ' : ''}<a href="equipment.html#${guide}">Function &amp; where to buy →</a>` : ''}${sheet ? ` · <a href="${sheet}" target="_blank" rel="noopener">Plan-sheet link ↗</a>` : ''}</div></td>
        <td class="u">${unit}</td>
        <td class="n"><input class="q" type="number" inputmode="decimal" min="0" step="1" value="${q}" data-def="${q}" aria-label="Quantity ${key}"></td>
        <td class="n"><input class="r" type="number" inputmode="decimal" min="0" step="0.01" value="${r.toFixed(2)}" data-def="${r.toFixed(2)}" aria-label="Unit rate ${key}"></td>
        <td class="n amt">${money(q * r)}</td></tr>`;
    });
    h += `<tr class="addrow no-print" data-sec="${sec.code}"><td></td><td colspan="5"><button type="button" class="addline" data-sec="${sec.code}">+ Add a line to ${sec.code}</button></td></tr>`;
    h += `<tr class="subt${sec.optional ? ' optsub' : ''}" data-sub="${sec.code}"><td></td><td colspan="4">Subtotal ${sec.code} — ${sec.title}${sec.optional ? ' (included items)' : ''}</td><td class="n" data-subamt="${sec.code}">—</td></tr>`;
  }
  return h;
}
// One letterhead BOQ for every section; `key` keeps each section's edits apart in the browser.
function boqPaper({ boq, key, points, ref, proj, notes, foot, guides = true, logo = '../../assets/oppein-logo.webp' }) {
  const main = boq.filter(s => !s.optional).map(s => s.code), opt = boq.filter(s => s.optional).map(s => s.code);
  const baseLabel = `Subtotal ${main[0]}${main.length > 1 ? '–' + main.at(-1) : ''}`, optLabel = `Optional items (${opt.join(', ') || '—'}, ticked)`;
  return `<div class="boq-tools no-print">
      <button class="btn solid" id="boq-print">Print / save as PDF</button>
      <button class="btn solid" id="boq-word">Export to Word</button>
      <button class="btn" id="boq-all">Tick all</button>
      <button class="btn" id="boq-none">Untick all</button>
      <button class="btn" id="boq-reset">Reset to estimate</button>
      <span class="hint">Tick the lines to include: only ticked lines are numbered, totalled, printed and exported. Add your own lines with “+ Add a line” in any section. Click any quantity, rate or header field to edit it. Edits are saved in this browser only.</span>
    </div>
    <div class="paper-wrap"><article class="paper" id="boq" data-vat="${Q.VAT_PCT}" data-points="${points}" data-key="${key}">
      <header class="lh">
        <div class="lh-brand">
          <img src="${logo}" alt="" class="lh-logo" onload="this.classList.add('ok')" onerror="this.remove()">
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
        <label>Estimate no.<input data-f="ref" value="${ref}"></label>
        <label>Date<input data-f="date" type="date" value="${D.META.date}"></label>
        <label>Valid for<input data-f="valid" value="30 days"></label>
        <label>Revision<input data-f="rev" value="${D.META.rev}"></label>
        <label class="w2">Prepared for<input data-f="to" placeholder="Client / management name"></label>
        <label class="w2">Project<input data-f="proj" value="${proj}"></label>
        <label class="w2">Site<input data-f="site" value="${D.META.site}"></label>
        <label class="w2">Currency<input data-f="cur" value="${Q.CURRENCY} · rates excl. VAT"></label>
      </div>
      <div class="tw-paper"><table class="boq">
        <colgroup><col style="width:8%"><col><col style="width:7%"><col style="width:9%"><col style="width:12%"><col style="width:14%"></colgroup>
        <thead><tr><th>No.</th><th>Description &amp; function</th><th>Unit</th><th class="n">Qty</th><th class="n">Rate</th><th class="n">Amount</th></tr></thead>
        <tbody>${boqRows(boq, guides)}</tbody>
      </table></div>
      <div class="totals">
        <div class="words"><small>Grand total in words</small><p id="t-words">—</p></div>
        <dl>
          <dt>${baseLabel}</dt><dd id="t-base">—</dd>
          <dt>${optLabel}</dt><dd id="t-opt">—</dd>
          <dt>Contingency <input id="t-contp" type="number" min="0" max="50" step="1" value="${Q.CONTINGENCY_PCT}" aria-label="Contingency percent"> %</dt><dd id="t-cont">—</dd>
          <dt>Total before VAT</dt><dd id="t-net">—</dd>
          <dt>VAT ${Q.VAT_PCT} %</dt><dd id="t-vat">—</dd>
          <dt class="gt">Grand total (${Q.CURRENCY})</dt><dd class="gt" id="t-grand">—</dd>
        </dl>
      </div>
      <div class="terms">
        <h3>Notes &amp; conditions</h3>
        <ol>
${notes.map(n => `          <li>${n}</li>`).join('\n')}
        </ol>
      </div>
      <div class="sign">
        <div><span>Prepared by</span><input data-f="by" value="${D.META.author}"><i>Signature &amp; date</i></div>
        <div><span>Reviewed by</span><input data-f="rev_by" placeholder="Name"><i>Signature &amp; date</i></div>
        <div><span>Approved by</span><input data-f="appr" placeholder="Name"><i>Signature &amp; date</i></div>
      </div>
      <footer class="pf"><span>OPPEIN · ${foot} · Estimate BOQ</span><span>Generated from the project documentation</span></footer>
    </article></div>`;
}
const paper = boqPaper({
  boq: Q.BOQ, key: 'o14-boq-v12', points: D.RUNS.length, ref: 'OPP-IT-EST-O14-002', proj: 'Office 14 — Structured cabling &amp; network', foot: 'Office 14 Network',
  notes: [
    `Budget estimate for planning and approval. Rates are UAE market estimates (${Q.PRICE_DATE}) and are replaced by supplier quotations before ordering.`,
    `Quantities follow the Office 14 cable schedule: ${D.RUNS.length} Cat6 runs, ${D.TOTAL_M} m, ≈ ${Math.round(D.CASING_M)} m of wall casing. To be confirmed after the site survey.`,
    'Router, ONT, Switch-01 and Switch-02 are existing and priced at zero. The 12U cabinet and its hardware from the plan sheet are priced in the Rack &amp; Cabinet BOQ (SYS-03), not here.',
    'Excluded: ISP fibre and ONT, electrical works and sockets, painting or making good, PCs, printers and software licences.',
    'Optional items (section F) are included only where ticked. Contingency covers site variations.',
    'All cable and termination to be Cat6 solid bare copper; CCA cable is not accepted.',
  ],
});
const noPrint = h => h.replace('<section class="sec"', '<section class="sec no-print"');
// Every row of the user's plan sheet and the BOQ line it became (shown on the SYS-01 and SYS-03 BOQ pages).
const sheetTable = (cabLink = '') => noPrint(section('sheet', 'BOQ-00', 'Plan sheet → BOQ', table(['Plan sheet item', 'Link / note in the sheet', 'BOQ line', 'In the BOQ'], Q.SHEET.map(([a, l, w, c]) => `<tr><td><b>${esc(a)}</b></td><td>${l.startsWith('http') ? `<a href="${l}" target="_blank" rel="noopener">amazon.ae ↗</a>` : esc(l)}</td><td class="m">${w}</td><td>${esc(c)}</td></tr>`))
  + (cabLink ? callout('info', `The cabinet and its hardware are priced in the <a href="${cabLink}">Rack &amp; Cabinet BOQ</a>, not in this one.`) : ''), 'Every item from “Network - Oud Metha.xlsx” and where it sits in the BOQs. The sheet has no prices, so the rates are estimates.'));

out['materials.html'] = page('materials.html', {
  wide: true, bodyClass: 'boq-page', scripts: ['assets/boq.js'],
  lead: `A bill of quantities for the whole job: cabling and casing, cabinet, active equipment, patching and labour, with estimated UAE rates. Quantities come from the cable schedule. Tick lines in or out, add your own lines, edit every quantity and rate, then print the estimate on the OPPEIN letterhead or export it to Word.`,
  body:
    noPrint(section('summary', 'BOQ-01', 'Estimate at a glance', `<div class="tiles">
      <div class="tile"><div class="tv" data-live="base">—</div><div class="tl">Subtotal A–D</div><div class="ts">excl. contingency &amp; VAT</div></div>
      <div class="tile"><div class="tv" data-live="grand">—</div><div class="tl">Grand total</div><div class="ts">incl. contingency + ${Q.VAT_PCT} % VAT</div></div>
      <div class="tile"><div class="tv" data-live="perpt">—</div><div class="tl">Per cable run</div><div class="ts">grand total ÷ ${D.RUNS.length} runs</div></div>
    </div><div id="boq-bars"></div>`, 'Figures update live from the BOQ below.'))
    + sheetTable('../cabinet/materials.html')
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
      [`${24 - D.PANEL.length}`, 'Patch-panel ports free', 'of 24 in the cabinet'],
      [`${Object.values(D.SPARE).flat().length}`, 'Network ports free', Object.entries(D.SPARE).filter(([, v]) => v.length).map(([k, v]) => v.map(p => D.portLabel(k, p)).join(', ')).join(' · ') || 'none'],
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
      ${[['Internet', 'ISP fibre → ONT → router'], ['Switches', 'router → Switch-01 + Switch-02, in the cabinet'], ['Patch panel', 'fixed end of every cable'], ['Cat6 in casing', `${D.RUNS.length} runs, ${D.TOTAL_M} m`], ['Surface box', 'Keystone at each end'], ['Device', 'PC, printer, phone; APs via PoE injector']].map(([t, d], i) => `<div class="fstep"><span class="fnum">${i + 1}</span><b>${t}</b><small>${d}</small></div>`).join('<span class="farrow">→</span>')}
    </div>`, 'Every device has its own cable back to the cabinet, so a fault on one cable never affects another. Everything depends on the router.')
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
  devices: D.DEVICES.map(d => ({ id: d.id, type: d.type, zone: d.zone, name: d.name, x: d.x, y: d.y, poe: !!d.poe, est: d.est, cable: d.cable, label: d.label })),
  runs: D.RUNS.map(r => ({ cable: r.cable, id: r.toId, est: r.est, poe: !!r.poe, type: r.type })),
})};</script>`;
const apToggles = D.DEVICES.filter(d => d.type === 'ap').map(d => `<label class="tog"><input type="checkbox" data-apon="${d.id}"> ${d.id}<small>${d.zone}</small></label>`).join('');
out['device-lab.html'] = page('device-lab.html', {
  wide: true, scripts: ['assets/plan-art.js', 'assets/models.js', labData, 'assets/lab.js'],
  lead: 'Try real equipment against the Office 14 layout before buying. Search a model or pick one, and the lab shows its capabilities, the Wi-Fi range on the floor plan, the expected signal at every desk, the PoE injector each AP needs, and how much signal each cable run loses.',
  body:
    section('search', 'LAB-01', 'Find a device model', `<div class="lab-search">
        <input id="lab-search" list="lab-list" placeholder="e.g. U6 Lite, EAP650, Cat6 CCA" autocomplete="off" aria-label="Device model">
        <datalist id="lab-list"></datalist>
        <button class="btn solid" id="lab-find">Search</button>
      </div>
      <p class="found" id="lab-found">The library holds common access points and cable types. A model that is not listed can be added from its datasheet below.</p>
      <details class="custom" id="custom"><summary>Add a model from its datasheet</summary>
        <div class="cgrid">
          <label>Type<select id="c-cat"><option value="ap">Access point</option><option value="cable">Cable</option></select></label>
          <label>Model name<input id="c-model" placeholder="Model"></label>
          <label data-for="ap">Brand<input id="c-brand"></label>
          <label data-for="ap">Standard<input id="c-std" placeholder="Wi-Fi 6 / Smart managed"></label>
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
          <label data-for="ap">PoE standard<select id="c-poe"><option value="af">802.3af (15.4 W)</option><option value="at" selected>802.3at PoE+ (30 W)</option><option value="bt">802.3bt (60 W+)</option></select></label>
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
    + section('poe', 'LAB-03', 'PoE injectors for the APs', `<div class="cards3"><div class="card cap" id="inj-card"></div></div>
      <div id="poe-bar"></div>`, 'SW1 and SW2 give no PoE, so each AP needs an injector that matches its PoE type and power (AP model above).')
    + section('cable', 'LAB-04', 'Cable signal strength per run', `<label class="inline">Cable type <select id="sel-cable"></select></label>
      <div class="cards3"><div class="card cap" id="cable-card"></div></div>
      ${table(['Cable', 'Device', 'Length', 'Loss', 'Signal left', '%', 'Margin', 'PoE over this run'], [], { cls: 'lab-t' }).replace('<tbody></tbody>', '<tbody id="cable-tbl"></tbody>')}
      <p class="note">Insertion loss at <span id="cable-f"></span> MHz (the cable's rated frequency) for the scheduled pull length, plus two connections. Margin = permanent-link limit − loss: more is better, and below 3 dB is risky. PoE: 50 V source, two-pair delivery.</p>`),
});

out['installation.html'] = page('installation.html', {
  lead: 'Rules for the installer and the order of work. Everything runs in surface casing on the walls, so no ceiling access is needed except at the two AP positions.',
  body:
    section('rules', 'INS-01', 'Installation rules', table(['Rule', 'Requirement'], [
      ['Wiring standard', 'T568B at both ends: every surface box keystone and the cabinet patch panel'],
      ['Run length', 'Permanent link ≤ 90 m (longest here is ' + D.LONGEST.est + ' m)'],
      ['Bend radius', 'Not tighter than 4 × the cable diameter (about 25 mm)'],
      ['Pulling tension', 'No more than 110 N (about 11 kg); pull by hand, do not use force'],
      ['Untwisting', 'Keep pair twists to within 13 mm of each termination'],
      ['Fixing', 'Velcro ties only; no cable ties pulled tight and no staples'],
      ['Power separation', 'At least 300 mm from unshielded power cables and light fittings; cross at 90°'],
      ['Casing', 'Screw-fix every 500 mm, level, at skirting height (desk height behind desks is fine); proper corner / tee fittings; fill no more than 60–70 %'],
      ['Casing size', D.CASING_SIZES.map(c => `${c.size}: ${Math.round(c.m)} m`).join(' · ') + ' (see DOC 01)'],
      ['Lids', 'Fitted after the cables are tested; cut lids to meet the fittings with no gaps'],
      ['Service loops', 'About 1 m inside the cabinet, 300 mm at each surface box'],
      ['Ceiling conduit', 'PVC conduit fixed above the ceiling (not resting on tiles), large bends only, draw wire left in; fill no more than 40 %'],
      ['Through walls', 'Sleeve the hole at mark 2 and at the cabinet, keep the bend radius, and re-seal after the cables are through'],
    ].map(([a, b]) => `<tr><td><b>${a}</b></td><td>${b}</td></tr>`)))
    + section('seq', 'INS-02', 'Sequence of work', `<ol class="steps">
      <li><b>Survey and mark out.</b> Walk the site with this pack. Mark the casing line on the walls, every surface box and the two AP positions. Close items A-01 to A-08.</li>
      <li><b>Conduit and casing.</b> Mount the cabinet. Check (or fit) the ceiling PVC conduit from the cabinet to mark 2 and from mark 2 to AP2, with a draw wire. Fix the vertical casing behind the wall at mark 2, the wall casing to J4, the branches to each desk, AP1's casing up the wall, and the IT Room casing. Leave the lids off.</li>
      <li><b>Pull cables.</b> Pull all ${D.RUNS.length} cables from the cabinet: the Design-area bundle through the ceiling conduit to mark 2 in one pull (use the draw wire), then lay each one into the casing to its desk; ${D.PHONE.cable} is the phone line, so label it TEL. Label both ends <i>before</i> cutting from the box.</li>
      <li><b>Terminate.</b> Punch down the ${D.PANEL.length} cabinet cables on the patch panel and every other end on a keystone in its surface box. Fit labels.</li>
      <li><b>Test, then close.</b> Test every link and fill in the test log (${docRef('testing.html')}). Fix and retest failures, then fit the casing lids.</li>
      <li><b>Active equipment.</b> Fit the shelves, the router with the ONT on top, both switches, the PoE injectors, the DVR with its 12 V supply, and the two PDUs. Patch router L1 → Switch-02 P1 and L2 → Switch-01 P1, then every panel port to its switch / router port as in DOC 02 (AP cables through their injectors), the DVR to Switch-01 P5, and the phone line to ONT TEL1 with an RJ11–RJ45 cord. Leave the mobile's data port unpatched. Mount and connect the access points.</li>
      <li><b>Configure and commission.</b> Set up router, switch and Wi-Fi to the agreed plan. Check every device online.</li>
      <li><b>Handover.</b> Update this pack to "as built", hand over the test results, passwords (separately) and keys.</li>
    </ol>`)
    + section('coord', 'INS-03', 'Site coordination', `<ul class="ticks">
      <li>Casing goes on the walls, so desks and cabinets along the route need to be pulled out on install day.</li>
      <li>The electrician provides the cabinet power socket(s) (two 6-way PDUs feed the ONT, router, both switches, the ${D.POE} PoE injectors, the DVR and the 12 V camera supply) and the desk power sockets before termination day.</li>
      <li>The ISP installs the fibre and ONT into the IT Room; agree the entry point so the fibre reaches the ONT on the router shelf (U6–U7).</li>
      <li>A ladder is needed at AP1 and AP2 only.</li>
    </ul>`),
});

out['testing.html'] = page('testing.html', {
  lead: 'What "done" means. Every link is tested and recorded, every device is checked on the network, and the client receives a handover pack.',
  body:
    section('accept', 'TST-01', 'Acceptance criteria', table(['Test', 'Pass', 'Tool'], [
      ['Wire map', 'All 8 conductors correct, T568B, no splits, opens or shorts', 'Cable tester'],
      ['Length', '≤ 90 m, and close to the scheduled length', 'Cable tester (TDR)'],
      ['Cat6 performance', 'Permanent link passes Cat6 limits (preferred)', 'Certification tester, e.g. Fluke DSX'],
      ['Link speed', 'Every link comes up at 1 Gbps full duplex', 'Switch / router port LEDs'],
      ['PoE', 'AP1 and AP2 power up from their injectors', 'AP status LED / controller'],
      ['Wi-Fi', 'Usable signal (about −67 dBm or better) in the Showroom and Design areas', 'Wi-Fi analyser app'],
    ].map(([a, b, c]) => `<tr><td><b>${a}</b></td><td>${b}</td><td class="muted">${c}</td></tr>`)))
    + section('log', 'TST-02', 'Test log', `<p class="sub">Print this page and fill it in on site. <button class="btn" onclick="window.print()">Print</button></p>`
      + table(['Cable', 'Device', 'Sched. m', 'Measured m', 'Wire map', 'Speed', 'Result', 'Initials / date'], D.RUNS.map(d =>
        `<tr><td class="m">${swatch(d.type)}${d.cable}</td><td>${d.toId}</td><td class="n">${d.est}</td><td class="blank"></td><td class="blank"></td><td class="blank"></td><td class="blank">Pass / Fail</td><td class="blank"></td></tr>`), { cls: 'log' }))
    + section('commission', 'TST-03', 'Commissioning checklist', `<ul class="checks">
      ${['Internet up through the ONT and router; router firmware updated; admin password changed', 'SW1 and SW2 powered, all used ports lit, link LEDs at 1 Gbps',
        'Every patch cord matches the port map (DOC 02)', 'AP1 and AP2 online, powered by their injectors', 'Dial tone and a test call on the phone at desk 5', 'IT Room PCs IT1–IT4 online (Switch-02 P7/P8, router L3/L4)',
        'Staff and guest SSIDs broadcast; guest cannot reach office devices', 'Printer reachable on its reserved address and prints from a PC',
        'PC 1–PC 8 get an address and reach the internet', 'Server PC 7 on its static address',
        'Cabinet fan running; door locks; labels on every port and on both switches', 'Casing lids on and fixed; no cables visible outside the casing', 'Wi-Fi walk test done in every zone'].map(t => `<li><label><input type="checkbox"> ${t}</label></li>`).join('')}
    </ul>`)
    + section('handover', 'TST-04', 'Handover pack', `<ul class="ticks">
      <li>This documentation updated to <b>as built</b>: real outlet positions and measured lengths</li>
      <li>Test log (and certification report if a certifier was used)</li>
      <li>Device list with serial numbers, MAC addresses and warranty dates</li>
      <li>Admin credentials for the router and Wi-Fi, handed over <b>separately</b> and never written in this pack</li>
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
      <li>Site visit: close A-01 to A-06 (IT Room PC places; whether the ceiling conduit can take 10 cables).</li>
      <li>Decide D-02, D-03 and D-05, then request supplier quotations against the ${docRef('materials.html')}.</li>
      <li>Book the installation; clear the desks along the casing route for the day.</li>
    </ol>`),
});

/* ---------- original interactive planner, re-themed ---------- */
const FONTS = '<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Chakra+Petch:wght@400;500;600;700&family=IBM+Plex+Sans:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">';
{
  let p = fs.readFileSync(path.join(HERE, 'interactive-plan.src.html'), 'utf8');
  const theme = `${FONTS}<style>
:root,:root:not([data-theme="light"]),:root[data-theme="dark"],:root[data-theme="light"]{
  --bg:#05080D!important;--panel:#0B111B!important;--ink:#E3EEF8!important;--muted:#8FA3B8!important;--line:#1B2A3D!important;--soft:#0F1826!important;
  --wall:#B9C7D6!important;--wall2:#4A5B70!important;--accent:#22D3EE!important;--tray:rgba(34,211,238,.20)!important;
  --c-ap:#E8C24A!important;--c-pc:#6D9FF5!important;--c-srv:#B07CF0!important;--c-prn:#3CC7AD!important;--c-ph:#E46AA3!important;--c-wan:#F0645C!important;--c-up:#F0EAE2!important;
  --f-display:"Chakra Petch",sans-serif!important;--f-body:"IBM Plex Sans",sans-serif!important;--f-mono:"JetBrains Mono",monospace!important;color-scheme:dark}
.back{display:inline-block;font:500 12px "JetBrains Mono",monospace;letter-spacing:.1em;text-transform:uppercase;color:#22D3EE;text-decoration:none;margin-bottom:8px}
.back:hover{text-decoration:underline}
</style>`;
  p = p.replace('<header>', theme + '\n<header>')
    .replace('<title>Office 14 Network Cabling</title>', '<title>Interactive planner — Office 14 Network · OPPEIN</title>')
    .replace('<div class="ttl">', '<div class="ttl">\n    <a class="back" href="index.html">← Office 14 docs</a> <a class="back" href="floor-plan.html" style="margin-left:14px">DOC 01 floor plan</a>\n    <p class="superseded" style="margin:6px 0 4px;padding:6px 10px;border:1px solid #0E5566;border-radius:6px;color:#22D3EE;font:500 12.5px JetBrains Mono,monospace">Original Rev A design (ceiling tray, one 16-port switch) — superseded by the current revision. Kept for reference only.</p>');
  fs.writeFileSync(path.join(OUT, 'interactive-plan.html'), p);
}

/* ---------- DOC 00 overview (entry page) ---------- */
const DESC = {
  'drawing.html': 'The floor plan drawing on its own, full size. Turn cables, devices and Wi-Fi on or off.',
  'floor-plan.html': 'Plan with the ceiling tray, every cable and Wi-Fi coverage.',
  'topology.html': 'Network diagram, switch / patch-panel port map, proposed IP plan.',
  'rack.html': 'U-by-U layout of the 12U cabinet, power and cooling.',
  'cable-schedule.html': 'Every home run: ID, route, junction, pull length.',
  'materials.html': 'Editable bill of quantities with AED rates. Prints on a letterhead.',
  'equipment.html': 'What each part does and products to buy on Amazon.ae and noon.',
  'device-lab.html': 'Try a device model: Wi-Fi range, desk signal, PoE budget, cable loss.',
  'installation.html': 'Installer rules, sequence of work, labelling.',
  'testing.html': 'Acceptance tests, printable test log, commissioning, handover.',
  'open-items.html': 'Assumptions to confirm, decisions needed, risks.',
};
const GROUPS = [
  ['PLAN', 'Design', 'Where everything goes and how it connects.', ['floor-plan.html', 'drawing.html', 'topology.html', 'rack.html', 'cable-schedule.html']],
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
      [D.RUNS.length, 'Cable runs', `${D.DEVICE_RUNS.length} devices + phone line, all from the cabinet`],
      [`${D.TOTAL_M} m`, 'Cat6 to pull', `${D.BOXES} × 305 m box`],
      [D.SWITCHES.length, 'Switches', 'existing · Switch-01 5-port · Switch-02 8-port'],
      [`${Math.round(D.CONDUIT_M)} + ${Math.round(D.CASING_M)} m`, 'Conduit + casing', 'ceiling to mark 2, then walls'],
      [`${D.RACK_U}U`, 'Wall cabinet', `IT Room · ${D.SPARE_U}U free`],
      [`${D.LONGEST.est} m`, 'Longest run', `${D.LONGEST.cable} · limit 90 m`],
    ]))
    + GROUPS.map(([k, t, d, files]) => section('docs-' + k.toLowerCase(), k, t,
      `<div class="doc-grid">${files.map(card).join('')}${k === 'PLAN' ? `<a class="doc-card alt" href="interactive-plan.html"><span class="num">TOOL</span><b>Interactive planner</b><span>The original Rev A plan (ceiling tray, one switch). Kept for reference; superseded.</span></a>` : ''}</div>`, d)).join('')
    + OVERVIEW_SCOPE + OVERVIEW_ZONES
    + section('status', 'STATUS', 'Where the project stands', `<ol class="steps">
        <li><b>Documentation ${D.META.rev}:</b> drafted ${D.META.date}, for review.</li>
        <li><b>Next:</b> site visit to confirm outlet positions, then decisions on APs, switch and UPS (${link('open-items.html', 'open items')}).</li>
        <li><b>Then:</b> supplier quotations against the ${link('materials.html', 'BOQ')} and booking the installation.</li>
      </ol>`)
    + OVERVIEW_HISTORY,
});

/* ---------- Pyramid Centre system hub (../index.html) and the CCTV section (../cctv/) ----------
   The OPPEIN hub card opens ../index.html, which offers the two systems. Both share the drawing and the cabinet. */
const NET = 'oppein-pyramid-centre-network/';
function standalone({ title, desc, css, logo, hub, crumb, body, scripts = [], tag = D.META.status }) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${title}</title>
<meta name="description" content="${esc(desc)}">
<meta name="robots" content="noindex, nofollow">
<link rel="icon" type="image/webp" href="${logo}">
${FONTS.replace('family=Space+Grotesk:wght@400;500;600;700&family=IBM+Plex+Sans:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500', 'family=Chakra+Petch:wght@400;500;600;700&family=IBM+Plex+Sans:wght@400;500;600&family=JetBrains+Mono:wght@400;500')}
<link rel="stylesheet" href="${css}">
</head>
<body class="landing">
<nav class="top"><div class="top-in">
  <a class="logo" href="${hub}" title="Back to the project hub"><img class="logo-img" src="${logo}" alt="OPPEIN" onload="this.classList.add('loaded')" onerror="this.remove()"><span class="logo-dot"></span><span class="logo-txt">OPPEIN</span></a>
  <span class="crumb">${crumb}</span>
  <span class="nav-tag">${tag}</span>
</div></nav>
<main class="land">
${body}
  <p class="foot">OPPEIN — Office 114 · Pyramid Centre · ${D.META.author}</p>
</main>
${scripts.map(src => `<script src="${src}"></script>`).join('')}
</body>
</html>
`;
}
const ICONS = {
  net: '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="24" cy="24" r="17"/><path d="M7 24h34M24 7c5 5 7 11 7 17s-2 12-7 17M24 7c-5 5-7 11-7 17s2 12 7 17"/><path d="M34 33l6 3v5c0 3-3 5-6 6-3-1-6-3-6-6v-5z" fill="var(--bg)"/><path d="M32 41l2 2 3-4"/></svg>',
  rack: '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="10" y="5" width="28" height="38" rx="2"/><path d="M14 12h20M14 19h20M14 26h20M14 33h20"/><circle cx="31" cy="12" r="1" fill="currentColor"/><circle cx="31" cy="19" r="1" fill="currentColor"/><path d="M16 43v2M32 43v2"/></svg>',
  cam: '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 14h26l6 6-6 6H6z"/><circle cx="16" cy="20" r="3"/><path d="M38 20h4M14 26v8M8 38h16"/><circle cx="40" cy="36" r="2" fill="currentColor"/></svg>',
};
const pcs = D.DEVICES.filter(d => d.type === 'pc').length;
fs.writeFileSync(path.resolve(HERE, '..', 'index.html'), standalone({
  title: 'Office 114 · Pyramid Centre — OPPEIN', desc: 'Office 114, Pyramid Centre: Internet & Telephone and CCTV systems.',
  css: `${NET}assets/style.css`, logo: '../assets/oppein-logo.webp', hub: '../index.html',
  crumb: '<a href="../index.html">Projects</a> / Office 114 · Pyramid Centre',
  body: `  <header class="hero sys-hero">
    <div class="eyebrow"><span class="led"></span>PROJECT · ${esc(D.META.site.toUpperCase())}</div>
    <h1>Office 114 <span>Pyramid Centre</span></h1>
    <p class="lead">Low-voltage systems for the office. Internet &amp; Telephone and CCTV share one floor-plan drawing and one cabinet in the IT Room; the cabinet itself gets its own combined plan. Choose a section to open it.</p>
  </header>
  <div class="sys-grid">
    <a class="sys-card" href="${NET}index.html">
      <div class="sys-top"><span class="sys-id">SYS-01</span><span class="sys-state on"><i></i>On going · wiring</span></div>
      <div class="sys-ico">${ICONS.net}</div>
      <h2>Internet &amp; Telephone</h2>
      <p>Cat6 network, Wi-Fi and the phone line: cabinet, switches, cable routes, port map, BOQ, installation and testing.</p>
      <ul class="sys-stats">
        <li><b>${D.RUNS.length}</b> cable runs · ${D.TOTAL_M} m</li>
        <li><b>${pcs}</b> PCs · <b>${D.POE}</b> APs · phone line</li>
        <li><b>${D.SWITCHES.length}</b> switches · ${D.RACK_U}U cabinet</li>
      </ul>
      <span class="sys-go">Open documents <span>→</span></span>
    </a>
    <a class="sys-card next" href="cctv/index.html">
      <div class="sys-top"><span class="sys-id">SYS-02</span><span class="sys-state soon"><i></i>Upcoming</span></div>
      <div class="sys-ico">${ICONS.cam}</div>
      <h2>CCTV</h2>
      <p>Camera system for the office. It will use the same floor-plan drawing and the same IT Room cabinet.</p>
      <ul class="sys-stats">
        <li>Camera plan · <b>to come</b></li>
        <li>DVR on the top shelf of the <b>${D.RACK_U}U</b> cabinet</li>
        <li>Route via the ceiling conduit · <b>to check</b></li>
      </ul>
      <span class="sys-go">View section <span>→</span></span>
    </a>
    <a class="sys-card next" href="cabinet/index.html">
      <div class="sys-top"><span class="sys-id">SYS-03</span><span class="sys-state soon"><i></i>Upcoming</span></div>
      <div class="sys-ico">${ICONS.rack}</div>
      <h2>Rack &amp; Cabinet Management</h2>
      <p>One combined cabinet plan for Internet, Telephone and CCTV: the same IT Room cabinet, fully customised.</p>
      <ul class="sys-stats">
        <li>Same cabinet · <b>IT Room, mark 1</b></li>
        <li>Combined layout · <b>to come</b></li>
        <li>Power, cooling, labelling · <b>to come</b></li>
      </ul>
      <span class="sys-go">View section <span>→</span></span>
    </a>
  </div>
  <section class="sec">
    <div class="module-label">SHARED</div>
    <h2>Shared across all sections</h2>
    <div class="doc-grid">
      <a class="doc-card" href="${NET}drawing.html"><span class="num">DWG</span><b>Floor-plan drawing</b><span>The Office 114 drawing with layer toggles. One drawing for every section.</span></a>
      <a class="doc-card" href="cabinet/index.html"><span class="num">RACK</span><b>IT Room cabinet</b><span>One cabinet at mark 1 for all systems: ${D.RACK_U}U with ${D.SPARE_U}U (${D.SPARE_RANGE}) free. Combined plan in SYS-03.</span></a>
      <a class="doc-card" href="${NET}floor-plan.html"><span class="num">ROUTE</span><b>Ceiling conduit to mark 2</b><span>The cable path from the cabinet into the office.</span></a>
    </div>
  </section>`,
}));
/* ---------- SYS-02 CCTV and SYS-03 Rack & Cabinet: sidebar sections (upcoming) ---------- */
const sectionBOQ = (Bq, cfg) => `    <section class="sec boq-sec" id="boq-sec">
      <div class="module-label no-print">BOQ-02</div>
      <h2 class="no-print">Bill of quantities</h2>
      ${boqPaper({ boq: Bq, guides: false, ...cfg })}
    </section>\n`;
const glance = () => noPrint(section('summary', 'BOQ-01', 'Estimate at a glance', `<div class="tiles">
      <div class="tile"><div class="tv" data-live="base">—</div><div class="tl">Subtotal (main)</div><div class="ts">excl. contingency &amp; VAT</div></div>
      <div class="tile"><div class="tv" data-live="grand">—</div><div class="tl">Grand total</div><div class="ts">incl. contingency + ${Q.VAT_PCT} % VAT</div></div>
    </div><div id="boq-bars"></div>`, 'Figures update live from the BOQ below.'));
const outCCTV = {}, outCAB = {};

const camRows = () => D.CAMERAS.map(c => `<tr data-id="${c.id}"><td class="m"><span class="sw" style="background:var(--c-cam)"></span><b>${c.id}</b></td><td>${esc(c.name)}</td><td>${c.zone}</td><td>${esc(c.view)}</td><td class="m">CH${c.port}</td><td class="m">${c.run.cable}</td><td class="n">${c.run.est} m</td></tr>`);
outCCTV['index.html'] = page('index.html', {
  lead: `The camera system for Office 114: <b>${D.CAMERAS.length} HD analog cameras</b> recorded by a DVR in the shared cabinet. Each camera has <b>one siamese cable</b> (coax for video + a power pair) back to the cabinet. One camera covers the Designers strip, two face each other across the Showroom, and one covers the kitchen.`,
  body: section('glance', 'CCTV-01', 'At a glance', tiles([
      [D.CAMERAS.length, 'Cameras', '2 MP HD analog dome, IR'],
      ['4-ch DVR', 'Recorder', 'BNC inputs · in the cabinet'],
      [`${D.PSU.volts} V DC`, 'Camera power', `${D.PSU.amps} A supply in the cabinet · load ${D.PSU_LOAD} A`],
      [`${D.CCTV_TOTAL_M} m`, 'Siamese cable', `RG59 + power · ${D.CCTV_ROLLS} × 100 m roll`],
      [`≈ ${D.recDays(D.REC.rec)} days`, 'Recording', `${D.REC.rec} TB disk, continuous`],
    ]))
    + section('cams', 'CCTV-02', 'Cameras', table(['Camera', 'Location', 'Zone', 'Looks at', 'DVR input', 'Cable', 'Length'], camRows())
      + `<p class="note">Positions follow your placement. See them with their fields of view on the ${link('drawing.html', 'CCTV drawing')}; full details in the ${link('cameras.html', 'camera schedule')}.</p>`)
    + section('design', 'CCTV-03', 'Design choices', `<div class="cols2"><div class="card"><h3>Coverage</h3><ul class="ticks">
      <li><b>CAM1</b> on the Designers ceiling at the printer looks down the whole strip, so every desk and the printer are in view.</li>
      <li><b>CAM2</b> and <b>CAM3</b> face each other across the Showroom: each one sees the other's blind spot below it, and together they cover the entrance.</li>
      <li><b>CAM4</b> covers the kitchen from the corner nearest the cabinet — the shortest camera cable.</li>
    </ul></div><div class="card"><h3>System</h3><ul class="ticks">
      <li><b>One siamese cable per camera</b> (RG59 coax + 2 × 0.75 mm² power in one jacket), home-run to the cabinet: CAM1 and CAM3 through the ceiling conduit to mark 2, CAM2 and CAM4 straight across the ceiling.</li>
      <li>Video: coax → <b>DVR</b> BNC input. Power: power pair → <b>${D.PSU.volts} V DC CCTV power supply</b> (one fused output per camera). Both sit in the <a href="../cabinet/design.html">cabinet</a>.</li>
      <li>Analog cameras are not on any network. <b>Only the DVR</b> joins the office LAN (patch cord to Switch-01 port 5) for phone-app viewing.</li>
      <li>Camera cables do not use the network patch panel or the Cat6 cable.</li>
    </ul></div></div>`)
    + section('open', 'CCTV-04', 'To confirm', `<ul class="crosses">
      <li>Exact camera spots on site (ceiling grid, lights, sprinklers) and the kitchen corner.</li>
      <li>Camera and DVR must use the same analog standard (AHD / TVI / CVI) — buy them as a set.</li>
      <li>Kitchen camera: agree with management that staff areas may be recorded, and put up notice signs.</li>
      <li>Dubai rules: CCTV in many commercial premises falls under SIRA requirements — check whether this office does, and use an approved installer if so.</li>
      <li>Retention period wanted (the ${D.REC.rec} TB disk gives ≈ ${D.recDays(D.REC.rec)} days).</li>
      <li>The DVR uses Switch-01 port 5 — after that no switch port is free.</li><li>Camera quantity is still open in the plan sheet; this design uses 4.</li>
    </ul>`),
}, SEC_CCTV);

outCCTV['drawing.html'] = page('drawing.html', {
  wide: true, scripts: [`${SA}plan-art.js`],
  lead: 'The Office 114 floor plan with the camera positions, their fields of view and their siamese cables back to the cabinet. The plan comes from the one shared drawing file also used by Internet &amp; Telephone.',
  body: `    <div class="stage drawing-stage">
        ${floorPlanSVG({ drawing: true, cams: true })}
        <div class="toolbar">
          <button class="tool" data-z="in" aria-label="Zoom in">+</button>
          <button class="tool" data-z="out" aria-label="Zoom out">−</button>
          <button class="tool" data-z="fit" aria-label="Fit to screen">⤢</button>
        </div>
      </div>
      <div class="layers" role="group" aria-label="Layers">
        <span class="layers-h">Layers</span>
        <button class="tool" data-layer="camfov" aria-pressed="true">Fields of view</button>
        <button class="tool" data-layer="camcab" aria-pressed="false">Siamese cables</button>
        <button class="tool" data-layer="tray" aria-pressed="false">Conduit &amp; casing</button>
      </div>
      <p class="note">Cones show the useful view of each camera (2.8 mm lens, ≈ 90° at the lens, drawn tighter to the area it identifies people in); cameras do not see through the partition or counters. Hover a camera for details. The cabinet at mark 1 is shared by every section.</p>
`,
}, SEC_CCTV);

outCCTV['cameras.html'] = page('cameras.html', {
  wide: true,
  lead: `Every camera with its place, what it looks at, its DVR input, its power output and its siamese cable (${D.CCTV_CABLE}) from the cabinet.`,
  body: section('sched', 'CAM-01', 'Camera schedule', table(['Camera', 'Location', 'Looks at', 'Type / lens', 'DVR', 'Power', 'Cable', 'Route', 'Route m', 'Pull m'], D.CAMERAS.map(c =>
      `<tr data-id="${c.id}"><td class="m"><span class="sw" style="background:var(--c-cam)"></span><b>${c.id}</b></td><td>${esc(c.name)}</td><td>${esc(c.view)}</td><td>${esc(c.type)}</td><td class="m">CH${c.port}</td><td class="m">PSU-${c.port}</td><td class="m">${c.run.cable}</td><td>${c.route === 'mark2' ? 'Cabinet → ceiling conduit → mark 2 → ceiling' : 'Cabinet → ceiling (direct)'}</td><td class="n">${f1(c.run.routeM)}</td><td class="n"><b>${c.run.est}</b></td></tr>`),
      { foot: `<tfoot><tr><td colspan="9">Total siamese cable</td><td class="n">${D.CCTV_TOTAL_M} m</td></tr></tfoot>` }))
    + section('power', 'CAM-02', 'Power check (12 V over the cable)', table(['Camera', 'Cable', 'Length', 'Current', 'Voltage lost', 'At camera', 'Result'], D.CAMERAS.map(c =>
      `<tr><td class="m"><b>${c.id}</b></td><td class="m">${c.run.cable}</td><td class="n">${c.run.est} m</td><td class="n">${D.PSU.camA} A</td><td class="n">${c.run.vDrop.toFixed(2)} V</td><td class="n"><b>${c.run.vCam.toFixed(1)} V</b></td><td>${c.run.vCam >= 10.8 ? '<span class="pill low">OK</span>' : '<span class="pill high">Too low</span>'}</td></tr>`))
      + `<p class="note">Voltage lost = 2 × length × 0.0245 Ω/m (0.75 mm² copper, go + return) × ${D.PSU.camA} A (camera with IR on, typical maximum). Cameras accept 12 V ± 10 % (≥ 10.8 V). Total load ${D.PSU_LOAD} A on a ${D.PSU.amps} A supply.</p>`)
    + section('method', 'CAM-03', 'How lengths are worked out', `<p class="formula">Pull length = ( ceiling route + ${D.DROP.rack} m cabinet drop + 0.6 m camera drop ) × ${1 + D.SLACK}, rounded up</p>
      ${callout('info', `At the cabinet each siamese cable splits: the coax gets a BNC connector into the DVR input, the power pair goes to its fused output on the ${D.PSU.volts} V supply. At the camera: BNC on the coax, DC pigtail on the power pair. Total ${D.CCTV_TOTAL_M} m — order ${D.CCTV_ROLLS} × 100 m roll.`)}`)
    + section('labels', 'CAM-04', 'Labels', table(['Where', 'Label', 'Example'], [
      '<tr><td>Cable, both ends</td><td>Cable ID</td><td class="m">V-01</td></tr>',
      '<tr><td>DVR input</td><td>Camera ID</td><td class="m">CH1 · CAM1</td></tr>',
      '<tr><td>Power supply output</td><td>Camera ID</td><td class="m">PSU-1 · CAM1</td></tr>',
    ])),
}, SEC_CCTV);

const recRows = D.REC.disks.map(tb => `<tr><td class="m">${tb} TB</td><td class="n">${D.recDays(tb)}</td><td>${tb === D.REC.rec ? '<b>Recommended</b>' : tb < D.REC.rec ? 'Minimum' : 'If a longer history is wanted'}</td></tr>`);
outCCTV['recording.html'] = page('recording.html', {
  lead: 'How the DVR records, how long footage is kept, and how viewing is kept secure.',
  body: section('store', 'REC-01', 'Storage', tiles([
      [`${D.REC.mbps} Mbit/s`, 'Per camera', '2 MP (1080p), H.265+, continuous (typical)'],
      [`${(D.CAMERAS.length * D.REC.mbps * 86400 / 8 / 1000).toFixed(0)} GB`, 'Per day', `${D.CAMERAS.length} cameras together`],
      [`≈ ${D.recDays(D.REC.rec)} days`, `On ${D.REC.rec} TB`, `${D.REC.usable * 100} % of the disk usable`],
    ]) + table(['Disk', 'Days kept', 'Note'], recRows) + '<p class="note">Motion-only recording at night stretches this further. The DVR overwrites the oldest footage when the disk is full.</p>')
    + section('settings', 'REC-02', 'Recommended DVR settings', table(['Setting', 'Value'], [
      ['Input mode', 'Match each channel to the camera standard (AHD / TVI / CVI) — or auto-detect'],
      ['Recording', 'Continuous, main stream 1080p / 15 fps, H.265+'],
      ['Sub-stream', 'Low resolution for phone-app live view'],
      ['Motion events', 'On for all cameras; event tags for quick search'],
      ['Time', 'NTP from the router, so the timestamps are right'],
      ['Night', 'IR auto; check each camera after dark at handover'],
    ].map(([a, b]) => `<tr><td><b>${a}</b></td><td>${b}</td></tr>`)))
    + section('secure', 'REC-03', 'Security', `<ul class="ticks">
      <li>The analog cameras are not network devices — they cannot be reached or hacked over the network. The DVR is the only CCTV device on the LAN.</li>
      <li>Change the DVR default password; one admin account for IT, view-only accounts for staff.</li>
      <li>Remote viewing through the maker's app with two-factor login, or a VPN — no open router ports.</li>
      <li>Keep the DVR firmware up to date; turn off UPnP and unused services.</li>
      <li>Export clips only on request, to an encrypted USB drive; keep an export log.</li>
    </ul>`),
}, SEC_CCTV);

outCCTV['materials.html'] = page('materials.html', {
  wide: true, bodyClass: 'boq-page', scripts: [`${SA}boq.js`],
  lead: `Bill of quantities for the CCTV system: ${D.CAMERAS.length} HD analog cameras on siamese cable, a 4-channel DVR, a ${D.REC.rec} TB disk and a ${D.PSU.volts} V power supply, from the camera schedule. Tick lines in or out, add your own lines, edit every quantity and rate, then print or export to Word.`,
  body: glance()
    + sectionBOQ(Q.BOQ_CCTV, {
      key: 'o14-cctv-boq-v5', points: 1, ref: 'OPP-IT-EST-O14-CCTV-001', proj: 'Office 114 — CCTV system', foot: 'Office 114 CCTV',
      notes: [
        `Budget estimate for planning. Rates are typical UAE trade estimates (${Q.PRICE_DATE}); replace them with supplier quotations.`,
        `Quantities follow the camera schedule: ${D.CAMERAS.length} HD analog cameras, ${D.CCTV_TOTAL_M} m of siamese cable (RG59 + power).`,
        'Cameras and DVR to be the same analog standard (AHD / TVI / CVI).',
        'The DVR and the camera power supply go in the shared cabinet; cabinet items are priced in SYS-03, not here.',
        'Optional items (section F) are included only where ticked. Contingency covers site variations.',
        'Excluded: electrical works, painting or making good.',
      ],
    }),
}, SEC_CCTV);

outCAB['index.html'] = page('index.html', {
  lead: `One cabinet for Internet, Telephone and CCTV together: the <b>${D.RACK_U}U 19″ wall cabinet</b> in the IT Room, laid out as in the plan sheet. This is the <b>same cabinet</b> used by the other two sections; see <a href="design.html">Cabinet design</a> for the to-scale view and fit checks.`,
  body: callout('info', `<b>Note:</b> there is only one cabinet, in the IT Room at mark 1. The ${D.RACK_U}U layout in <a href="../oppein-pyramid-centre-network/rack.html">SYS-01 · Rack layout</a> follows the plan sheet and already includes the CCTV recorder. Every item from the plan sheet (cabinet, patch panel, cable manager, tags, PDU, shelves, and the existing router, ONT, switches and DVR) is in the <a href="materials.html">BOQ here</a>, with UPS, cooling and fit-out.`)
    + section('now', 'CAB-01', 'What the cabinet holds today (SYS-01)', table(['U', 'Item'], Object.keys(D.RACK_UNITS).sort((a, b) => b - a).map(u => `<tr${D.RACK_UNITS[u][1] === 'spare' ? ' class="spare"' : ''}><td class="m">U${u}</td><td>${esc(D.RACK_UNITS[u][0])}</td></tr>`)))
    + section('plan', 'CAB-02', 'Status', `<div class="cols2"><div class="card"><h3>Settled (plan sheet)</h3><ul class="ticks">
      <li>${D.RACK_U}U 19″ wall cabinet; shelf-by-shelf layout for network, telephone and CCTV — <a href="design.html">to scale</a></li>
      <li>Router with the ONT stacked on it on one shelf; both switches + PoE injectors on the shelf below</li>
      <li>One fully loaded 24-port patch panel for all Cat6 (${D.PANEL.length} used); camera coax goes straight to the DVR</li>
      <li>Two 6-way PDUs: 8 plugs in use, 4 spare</li>
    </ul></div><div class="card"><h3>Still open</h3><ul class="ticks">
      <li>Cabinet depth (≥ 450 mm) and whether the listing includes a fan</li>
      <li>Measure the real router, ONT and DVR against the shelves</li>
      <li>UPS size and run time for the whole cabinet (D-05)</li>
      <li>Patch-cord colour code, as-built record and maintenance checklist</li>
    </ul></div></div>`).replace("id=\"plan\"", 'id="cab-plan"'),
}, SEC_CAB);
/* ---------- SYS-03 · Cabinet design: the 12U cabinet to scale ---------- */
// 19″ rack: 1U = 4.445 cm, 48.3 cm across the rail flanges, ≈ 45 cm clear between the rails. Active-kit sizes are typical
// for these desktop units — measure the real router, ONT, switches and DVR before ordering the shelves.
const RK = { u: 4.445, rail: 48.3, open: 45, plate: 0.2, outerW: 60, frame: 5 };
// [label, W, H, D cm, shelf U, x from the left rail (cm), stacked on (label) or null, colour]
const KIT = [
  ['DVR 4-CH', 26, 4.5, 22, 11, 1.5, null, 'var(--c-cam)'],
  ['PSU 12 V', 16, 5, 10, 11, 28.5, null, 'var(--c-cam)'],
  ['ROUTER', 24, 4, 16, 6, 10, null, 'var(--ink-dim)'],
  ['ONT', 18, 3, 12, 6, 13, 'ROUTER', 'var(--c-wan)'],
  ...D.SWITCHES.map((w, i) => [`${w.id} · ${w.ports}-port`, w.ports === 5 ? 10 : 16, 2.7, w.ports === 5 ? 7 : 10, 5, i ? 12 : 1, null, 'var(--amber)']),
  ...Array.from({ length: D.POE }, (_, i) => [`INJ ${i + 1}`, 7, 3.5, 11, 5, 29.5 + i * 8, null, 'var(--c-ap)']),
];
const kitH = k => k[2] + (k[6] ? kitH(KIT.find(b => b[0] === k[6])) : 0);
// per shelf: width used, stack height, head room up to the next fitted unit
const SHELVES = [...new Set(KIT.map(k => k[4]))].sort((a, b) => b - a).map(u => {
  const items = KIT.filter(k => k[4] === u);
  let n = 1; for (let v = u + 1; v <= D.RACK_U && ['spare', 'shelfb', 'ont'].includes(D.RACK_UNITS[v][1]); v++) n++;
  return { u, items, n, wUsed: Math.max(...items.filter(k => !k[6]).map(k => k[5] + k[1])), hUsed: Math.max(...items.map(kitH)), dMax: Math.max(...items.map(k => k[3])), room: +(n * RK.u - RK.plate).toFixed(1) };
});
const ONE_U = +(RK.u - RK.plate).toFixed(1);
// Heat in the cabinet (typical figures).
const HEAT = [['ONT', 10], ['Router', 15], ['Switch-01 + Switch-02', 10], ['2 PoE injectors (AP load + losses)', 30], ['DVR + disk', 15], ['12 V camera supply (4 cameras + losses)', 30]];
const HEAT_W = HEAT.reduce((t, [, w]) => t + w, 0);
const cab12SVG = () => {
  const k = 10, N = D.RACK_U, X = 110, Y = 60, OW = RK.outerW * k, F = RK.frame * k, UH = RK.u * k, IH = N * UH;
  const L = X + (RK.outerW - RK.open) / 2 * k;              // left edge of the clear opening
  const RL = X + (RK.outerW - RK.rail) / 2 * k;             // left edge of the rail flange
  const top = u => Y + F + (N - u) * UH, bot = u => top(u) + UH;
  let s = `<svg class="diagram" viewBox="0 0 ${X + OW + 470} ${Y + IH + 2 * F + 120}" role="img" aria-label="12U cabinet, front view to scale with the planned equipment">`;
  s += `<defs><marker id="ar12" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="var(--ink-faint)"/></marker></defs>`;
  s += el('rect', { x: X, y: Y, width: OW, height: IH + 2 * F, rx: 8, fill: 'var(--panel-2)', stroke: 'var(--border)', 'stroke-width': 2 }, null);
  s += el('rect', { x: L, y: Y + F, width: RK.open * k, height: IH, fill: 'var(--bg-alt)' }, null);
  for (const x of [RL, L + RK.open * k]) {                  // rail flanges with 3 holes per U
    s += el('rect', { x, y: Y + F, width: (RK.rail - RK.open) / 2 * k, height: IH, fill: 'var(--panel)', stroke: 'var(--border)' }, null);
    for (let u = 1; u <= N; u++) for (const f of [0.2, 0.5, 0.8]) s += el('rect', { x: x + 5, y: top(u) + f * UH - 2.5, width: 6.5, height: 5, fill: 'var(--bg)' }, null);
  }
  for (let u = N; u >= 1; u--) {
    const [name, kind] = D.RACK_UNITS[u], y = top(u);
    s += el('text', { x: X - 12, y: y + UH / 2 + 4, class: 'svgmono', 'font-size': 12, 'text-anchor': 'end' }, 'U' + u);
    s += el('path', { d: `M${L} ${bot(u)}H${L + RK.open * k}`, stroke: 'var(--border)', 'stroke-dasharray': '3 5' }, null);
    const panel = (fill) => el('rect', { x: RL, y: y + 1, width: RK.rail * k, height: UH - 2, rx: 3, fill, stroke: 'rgba(0,0,0,.35)' }, null);
    if (kind === 'pp') { s += panel('#2a2420'); for (let i = 0; i < 24; i++) s += el('rect', { x: L + 12 + i * 17.8, y: y + 15, width: 12, height: 13, rx: 1.5, fill: i < D.PANEL.length ? 'var(--c-prn)' : 'var(--ink-faint)' }, null); }
    if (kind === 'cm') { s += panel('#2a2420'); for (let i = 0; i < 10; i++) s += el('rect', { x: L + 14 + i * 43.5, y: y + 10, width: 26, height: 24, rx: 4, fill: 'none', stroke: 'var(--ink-faint)', 'stroke-width': 2 }, null); }
    if (kind === 'pdu') { s += panel('#2a2420'); for (let i = 0; i < 6; i++) s += el('rect', { x: L + 30 + i * 48, y: y + 12, width: 26, height: 20, rx: 3, fill: 'var(--ink-dim)' }, null); }
    if (['dvr', 'shelf', 'sw'].includes(kind)) s += el('rect', { x: L, y: bot(u) - 3, width: RK.open * k, height: 3, fill: '#8a7a68' }, null); // shelf plate
    s += el('text', { x: X + OW + 26, y: y + UH / 2 + 5, class: kind === 'spare' || kind === 'shelfb' ? 'svgmono' : 'svgtxt', 'font-size': 13 }, esc(name));
  }
  for (const it of KIT) {                                   // the active kit, to scale, standing on its shelf
    const [label, w, h, , u, x, on, fill] = it;
    const yb = bot(u) - 3 - (on ? kitH(KIT.find(b => b[0] === on)) * k : 0);
    s += el('rect', { x: L + x * k, y: yb - h * k, width: w * k, height: h * k, rx: 3, fill, stroke: 'rgba(0,0,0,.35)' }, null);
    s += el('text', { x: L + (x + w / 2) * k, y: yb - h * k / 2 + 4, 'font-size': w < 12 ? 10 : 12, 'text-anchor': 'middle', class: 'svgmono', style: 'fill:var(--bg);font-weight:600' }, label);
  }
  const dim = (x1, y1, x2, y2, t, tx, ty, rot = 0) => el('path', { d: `M${x1} ${y1}L${x2} ${y2}`, stroke: 'var(--ink-faint)', 'stroke-width': 1.5, 'marker-start': 'url(#ar12)', 'marker-end': 'url(#ar12)' }, null)
    + el('text', { x: tx, y: ty, 'font-size': 13, 'text-anchor': 'middle', class: 'svgmono', ...(rot ? { transform: `rotate(${rot} ${tx} ${ty})` } : {}) }, t);
  const yb = Y + IH + 2 * F;
  s += dim(L, yb + 24, L + RK.open * k, yb + 24, `≈ ${RK.open} cm clear between the rails`, L + RK.open * k / 2, yb + 44);
  s += dim(RL, yb + 64, RL + RK.rail * k, yb + 64, `19″ panels ${RK.rail} cm`, RL + RK.rail * k / 2, yb + 84);
  s += dim(X + OW + 12, Y + F, X + OW + 12, Y + F + IH, '', 0, 0);
  s += el('text', { x: X - 60, y: Y + F + IH / 2, 'font-size': 13, 'text-anchor': 'middle', class: 'svgmono', transform: `rotate(-90 ${X - 60} ${Y + F + IH / 2})` }, `${N}U = ${(N * RK.u).toFixed(1)} cm`);
  return s + '</svg>';
};
const fitRow = (ok, item, why) => `<tr><td><span class="pill ${ok === 'ok' ? 'low' : ok === 'warn' ? 'medium' : 'high'}">${ok === 'ok' ? 'Fits' : ok === 'warn' ? 'Check' : 'No'}</span></td><td><b>${item}</b></td><td>${why}</td></tr>`;
// Earlier concept (superseded): the user's sample drawings of a custom wall-hung laminate module, kept for reference.
const CAB = { w: 80, h: 40, d: 35 };
const CAB_IMGS = [
  ['1.jfif', 'cabinet-1.jpg', 'As-built view', 'Wall-hung module above the 240 cm desk; inner 80 × 40 cm, 18 mm board (section A-A).'],
  ['2.jfif', 'cabinet-2.jpg', 'Isolated module', 'Inner width 80 cm, height 40 cm, depth 35 cm; edge joint detail.'],
  ['3.jfif', 'cabinet-3.jpg', 'Shelves, inlet & ventilation', 'Two 21 cm shelves, Ø10 cm back cable inlet, 64 × 3 cm top vent slot, 5 cm lower vent gap with filter.'],
  ['4.jfif', 'cabinet-4.jpg', 'Revised blueprint (hinge-free)', 'Fixed-panel joinery, no door hinges; top view and front elevation. Part-list text in this image is not legible — dimensions only.'],
];
const S11 = SHELVES.find(x => x.u === 11), S6 = SHELVES.find(x => x.u === 6), S5 = SHELVES.find(x => x.u === 5);
outCAB['design.html'] = page('design.html', {
  wide: true,
  lead: `The <b>${D.RACK_U}U 19″ wall cabinet</b> from the plan sheet, drawn to scale with the planned equipment, and the checks that everything fits. The layout is the same as <a href="../oppein-pyramid-centre-network/rack.html">SYS-01 · Rack layout</a>. Sizes of the router, ONT, switches, injectors and DVR are <b>typical</b> for these units — measure the real ones before buying the shelves.`,
  body: section('fit', 'DES-01', 'How the equipment would sit (to scale)', `<div class="figure">${cab12SVG()}</div>
      <p class="note">Front view, 1 cm = 10 drawing units. From the top: U12 kept free (head room for the DVR), the DVR and 12 V camera supply on the U11 shelf, free space U8–U10, the ONT stacked on the router on the U6 shelf, both switches and the ${D.POE} PoE injectors on the U5 shelf, then the cable manager (U4), the fully loaded patch panel (U3, ${D.PANEL.length} of 24 ports used) and the two 6-way PDUs (U2, U1).</p>`)
    + section('shelves', 'DES-02', 'Shelf by shelf', table(['Shelf', 'Holds (typical size W × H × D cm)', 'Width', 'Height', 'Result'], SHELVES.map(x => {
      const okW = x.wUsed <= RK.open, okH = x.hUsed <= x.room, tight = RK.open - x.wUsed < 2;
      const intoNext = x.hUsed > ONE_U && D.RACK_UNITS[x.u + 1][1] === 'spare', stacked = x.items.some(k => k[6]);
      const notes = [intoNext && `rises into U${x.u + 1} — keep it free`, stacked && `the ${x.items.find(k => k[6])[0]} sits in U${x.u + 1}, as planned`, tight && 'width is tight'].filter(Boolean).join('; ');
      return `<tr><td class="m">U${x.u}</td><td>${x.items.map(k => `${k[0]} ${k[1]} × ${k[2]} × ${k[3]}${k[6] ? ` (on the ${k[6].toLowerCase()})` : ''}`).join('<br>')}</td><td class="n">${x.wUsed.toFixed(1)} of ${RK.open} cm</td><td class="n">${x.hUsed.toFixed(1)} of ${x.room} cm</td><td><span class="pill ${okW && okH ? (intoNext || tight ? 'medium' : 'low') : 'high'}">${okW && okH ? (intoNext || tight ? 'Check' : 'Fits') : 'No'}</span> ${notes}</td></tr>`;
    })))
    + section('checks', 'DES-03', 'Engineering checks', table(['Result', 'Item', 'Why'], [
      fitRow(S5.wUsed <= RK.open - 2 ? 'ok' : 'warn', 'Switch shelf width (U5)', `Switch-01 + Switch-02 + ${D.POE} injectors side by side take about ${S5.wUsed.toFixed(0)} of ${RK.open} cm. If the real injectors are bigger, stand them beside the router on the U6 shelf (≈ ${(RK.open - 24).toFixed(0)} cm free there).`),
      fitRow(S5.hUsed <= ONE_U ? 'ok' : 'no', 'Switch shelf height (U5)', `Only ${ONE_U} cm under the router shelf; the tallest unit is ≈ ${S5.hUsed} cm. Plug the cords in from the front and route them down to the cable manager.`),
      fitRow(S6.hUsed <= S6.room ? 'ok' : 'no', 'Router + ONT stack (U6–U10)', `Router ≈ 4 cm + ONT ≈ 3 cm on top = ${S6.hUsed} cm in a ${S6.room} cm zone (U6–U10). Room for router antennas up to ≈ ${(S6.room - 4).toFixed(0)} cm; don't put anything heavy on the ONT.`),
      fitRow('warn', 'DVR and camera supply (U11)', `The DVR (≈ 4.5 cm) and the 12 V supply box (≈ 5 cm) are taller than one shelf space (${ONE_U} cm), so they rise into U12 — keep U12 free (a front blank panel is fine).`),
      fitRow('warn', 'Depth', `The plan sheet does not give the cabinet depth: choose ≥ 450 mm. The deepest unit is the DVR (≈ ${S11.dMax} cm) plus ≈ 5 cm for plugs; use shelves ≈ 25–35 cm deep and keep the back clear for cables.`),
      fitRow('ok', 'Power sockets', `8 plugs (ONT, router, 2 switches, ${D.POE} PoE injectors, DVR, camera supply) on two 6-way PDUs = 12 sockets, 4 spare. The cabinet needs one 13 A wall socket per PDU, or one PDU fed through the UPS.`),
      fitRow('warn', 'Heat', `About ${HEAT_W} W in a closed cabinet (${HEAT.map(([n, w]) => `${n} ${w} W`).join(', ')}). Fit the roof fan (SYS-03 BOQ D.1) and close the free U with blank panels so the air passes through the kit.`),
      fitRow('ok', `Cable entry for ${D.RUNS.length + D.CAMERAS.length} cables`, `${D.RUNS.length} Cat6 (Ø6 mm) + ${D.CAMERAS.length} siamese RG59 + power (≈ 7 × 11 mm) ≈ ${(D.RUNS.length * 0.28 + D.CAMERAS.length * 0.6).toFixed(0)} cm² of cable: enter through the top cable entry from the ceiling conduit with a brush grommet. Coax goes straight to the DVR, not via the patch panel.`),
      fitRow('no', 'Rack UPS', 'A 1–1.5 kVA rack UPS takes 2U, is ≈ 40–50 cm deep and weighs 15–25 kg — too much for a 12U wall cabinet. Use a tower UPS beside or under the cabinet (SYS-03 BOQ C.1).'),
      fitRow('warn', 'Wall fixing', 'Cabinet ≈ 15–20 kg plus ≈ 8–10 kg of equipment: fix to masonry with heavy-duty anchors, not to plasterboard alone.'),
    ]))
    + section('concept', 'DES-04', 'Earlier concept — custom laminate module (superseded)', callout('info', `<b>Not used:</b> before the plan sheet, a custom wall-hung laminate box (${CAB.w} × ${CAB.h} × ${CAB.d} cm inside, 18 mm board, two shelves, no door) was sketched. It has no 19″ rails, so the patch panel, cable manager and PDUs would not mount, and a ${CAB.h} cm height is only ≈ ${(CAB.h / RK.u).toFixed(0)}U. The 12U cabinet replaces it. The drawings are kept for reference.`)
      + `<div class="gallery">${CAB_IMGS.map(([, f, t, c], i) => `<figure class="shot"><button type="button" class="shot-btn" data-full="img/${f}" data-cap="${esc(t)} — ${esc(c)}" aria-label="Enlarge: ${esc(t)}"><img src="img/${f}" alt="${esc(t)}" loading="lazy"></button><figcaption><span class="num">IMG ${i + 1}</span><b>${t}</b>${c}</figcaption></figure>`).join('')}</div>
      <dialog class="lightbox" id="lightbox"><button type="button" class="lb-close" aria-label="Close">×</button><img alt=""><p></p></dialog>
      <script>(()=>{const d=document.getElementById('lightbox');document.querySelectorAll('.shot-btn').forEach(b=>b.addEventListener('click',()=>{d.querySelector('img').src=b.dataset.full;d.querySelector('p').textContent=b.dataset.cap;d.showModal();}));d.addEventListener('click',e=>{if(e.target===d||e.target.classList.contains('lb-close'))d.close();});})();</script>`, 'Click an image to enlarge.'),
}, SEC_CAB);

outCAB['materials.html'] = page('materials.html', {
  wide: true, bodyClass: 'boq-page', scripts: [`${SA}boq.js`],
  lead: 'Everything for the shared 12U cabinet, as listed in the plan sheet: the cabinet, fully loaded patch panel, cable manager, wire tags, PDUs and shelves (with the sheet links), the existing router, ONT, switches and DVR, plus UPS, cooling and fit-out. Tick lines in or out, add your own lines, edit every quantity and rate, then print or export to Word.',
  body: callout('info', '<b>No double counting:</b> the cabinet and its hardware are priced only here, not in the Internet &amp; Telephone BOQ. Existing equipment is listed at 0.')
    + glance() + sheetTable()
    + sectionBOQ(Q.BOQ_CAB, {
      key: 'o14-cab-boq-v5', points: 1, ref: 'OPP-IT-EST-O14-CAB-001', proj: 'Office 114 — Rack &amp; cabinet (all systems)', foot: 'Office 114 Rack &amp; Cabinet',
      notes: [
        `Starter estimate for planning. Rates are typical UAE trade estimates (${Q.PRICE_DATE}); replace them with supplier quotations.`,
        'One 12U cabinet in the IT Room (mark 1) for Internet, Telephone and CCTV, laid out as in the plan sheet.',
        'Items and links follow the plan sheet (Network - Oud Metha.xlsx). The sheet has no prices: rates are estimates until the listings are checked.',
        'Router, ONT, Switch-01, Switch-02 and DVR exist (plan sheet) and are priced at zero. New active equipment (APs, injectors, cameras, camera supply) is in its own section BOQ.',
        'Optional items (section F) are included only where ticked. Contingency covers site variations.',
      ],
    }),
}, SEC_CAB);

// copy the sample cabinet drawings (.jfif = JPEG) into cabinet/img/ as .jpg
fs.mkdirSync(path.resolve(HERE, '..', 'cabinet', 'img'), { recursive: true });
for (const [src, dst] of CAB_IMGS) fs.copyFileSync(path.resolve(HERE, '..', 'sketch plan for full network cabinet', src), path.resolve(HERE, '..', 'cabinet', 'img', dst));
for (const [dir, o] of [['cctv', outCCTV], ['cabinet', outCAB]]) {
  fs.mkdirSync(path.resolve(HERE, '..', dir), { recursive: true });
  for (const [f, html] of Object.entries(o)) fs.writeFileSync(path.resolve(HERE, '..', dir, f), html);
}
for (const [f, html] of Object.entries(out)) fs.writeFileSync(path.join(OUT, f), html);
for (const a of ['style.css', 'site.js', 'boq.js', 'lab.js', 'models.js']) fs.copyFileSync(path.join(HERE, a), path.join(OUT, 'assets', a));
fs.writeFileSync(path.join(OUT, 'assets', 'plan-art.js'), 'window.PLAN_ART=' + JSON.stringify(fs.readFileSync(path.join(HERE, 'plan-raw.svg'), 'utf8')) + ';\n');
console.log('Built', Object.keys(out).length, 'pages →', OUT, '| total', D.TOTAL_M, 'm');
