// Device lab — model search, capability cards, Wi-Fi heatmap, PoE budget, cable signal.
// Propagation: log-distance path loss  RSSI = EIRP − PL(1 m) − 10·n·log10(d) − walls
(function () {
  const O = window.O14, LIB = window.O14_MODELS;
  if (!O || !LIB) return;
  const $ = s => document.querySelector(s);
  const KEY = 'o14-lab-v1';
  const load = () => { try { return JSON.parse(localStorage.getItem(KEY) || '{}'); } catch (e) { return {}; } };
  const save = s => { try { localStorage.setItem(KEY, JSON.stringify(s)); } catch (e) {} };
  const st = Object.assign({ ap: 'u6-lite', sw: 'sg1218mpe', cable: 'cat6-cu', band: '5', n: 3.0, walls: 3, on: { AP1: true, AP2: true }, custom: { ap: [], switch: [], cable: [] } }, load());
  const lib = cat => LIB[cat].concat(st.custom[cat] || []);
  const find = (cat, id) => lib(cat).find(m => m.id === id) || lib(cat)[0];
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const f1 = n => (Math.round(n * 10) / 10).toFixed(1);

  const CAP = { '2.4': 20, '5': 23 };            // indoor EIRP caps used (dBm) — typical, confirm with TDRA rules
  const FREQ = { '2.4': 2437, '5': 5500 };
  const PL1 = b => 20 * Math.log10(FREQ[b]) - 27.55;
  const TIERS = [[-60, 'Excellent', '#3fbf7f'], [-67, 'Good', '#9ccc4a'], [-72, 'Fair', '#e8c24a'], [-80, 'Weak', '#e8833a'], [-200, 'No service', '#d9534f']];
  const tier = r => TIERS.find(t => r >= t[0]);
  const eirp = (m, b) => { const k = b === '5' ? m.b5 : m.b24; return Math.min(k.tx + k.gain, CAP[b]); };
  const rssiAt = (m, b, dM) => eirp(m, b) - PL1(b) - 10 * st.n * Math.log10(Math.max(dM, 1)) - st.walls;
  const radius = (m, b, thr) => Math.pow(10, (eirp(m, b) - PL1(b) - st.walls - thr) / (10 * st.n));
  const toM = pt => pt * O.MM_PER_PT / 1000;
  const aps = () => O.devices.filter(d => d.type === 'ap' && st.on[d.id]);

  /* ---------- selects + search ---------- */
  function fillSelect(sel, cat) {
    sel.innerHTML = lib(cat).map(m => `<option value="${m.id}">${esc((m.brand ? m.brand + ' ' : '') + m.model)}${m.custom ? ' (custom)' : ''}</option>`).join('');
    sel.value = st[cat === 'switch' ? 'sw' : cat];
  }
  function fillAll() {
    fillSelect($('#sel-ap'), 'ap'); fillSelect($('#sel-sw'), 'switch'); fillSelect($('#sel-cable'), 'cable');
    $('#lab-list').innerHTML = ['ap', 'switch', 'cable'].flatMap(c => lib(c).map(m => `<option value="${esc((m.brand ? m.brand + ' ' : '') + m.model)}">`)).join('');
  }
  const norm = s => s.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
  function search(q) {
    const toks = norm(q).split(' ').filter(Boolean); if (!toks.length) return null;
    let best = null, score = 0;
    for (const cat of ['ap', 'switch', 'cable']) for (const m of lib(cat)) {
      const hay = norm(`${m.brand || ''} ${m.model} ${m.id}`).replace(/ /g, '') + ' ' + norm(`${m.brand || ''} ${m.model} ${m.id}`);
      const s = toks.filter(t => hay.includes(t)).length / toks.length;
      if (s > score) { score = s; best = { cat, m }; }
    }
    return score >= 0.5 ? best : null;
  }
  $('#lab-find').addEventListener('click', doSearch);
  $('#lab-search').addEventListener('keydown', e => { if (e.key === 'Enter') doSearch(); });
  function doSearch() {
    const q = $('#lab-search').value, r = search(q), out = $('#lab-found');
    if (!r) {
      out.innerHTML = `<b>"${esc(q)}" is not in the library.</b> Add it below with the values from its datasheet. It will then appear in the selectors and the plan.`;
      $('#custom').open = true; $('#c-model').value = q; return;
    }
    const key = r.cat === 'switch' ? 'sw' : r.cat;
    st[key] = r.m.id; save(st); fillAll(); render();
    out.innerHTML = `Found <b>${esc((r.m.brand ? r.m.brand + ' ' : '') + r.m.model)}</b> (${r.cat === 'ap' ? 'access point' : r.cat}). Applied to the plan below.`;
    document.getElementById(r.cat === 'ap' ? 'ap-card' : r.cat === 'switch' ? 'sw-card' : 'cable-card').scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
  [['#sel-ap', 'ap'], ['#sel-sw', 'sw'], ['#sel-cable', 'cable']].forEach(([s, k]) => $(s).addEventListener('change', e => { st[k] = e.target.value; save(st); render(); }));
  document.querySelectorAll('[name=band]').forEach(r => { r.checked = r.value === st.band; r.addEventListener('change', () => { st.band = r.value; save(st); render(); }); });
  document.querySelectorAll('[data-apon]').forEach(c => { c.checked = !!st.on[c.dataset.apon]; c.addEventListener('change', () => { st.on[c.dataset.apon] = c.checked; save(st); render(); }); });
  [['#pl-n', 'n'], ['#walls', 'walls']].forEach(([s, k]) => { const el = $(s); el.value = st[k]; el.addEventListener('input', () => { st[k] = +el.value; save(st); render(); }); });

  /* ---------- custom models ---------- */
  const cfields = { ap: ['tx24', 'g24', 'tx5', 'g5', 'phy5', 'watt', 'poe', 'clients'], switch: ['ports', 'poePorts', 'budget', 'poe'], cable: ['R', 'f', 'limit'] };
  const showC = () => { const c = $('#c-cat').value; document.querySelectorAll('[data-for]').forEach(el => el.hidden = !el.dataset.for.split(' ').includes(c)); };
  $('#c-cat').addEventListener('change', showC); showC();
  $('#c-save').addEventListener('click', () => {
    const c = $('#c-cat').value, v = id => $('#c-' + id).value, n = id => +$('#c-' + id).value;
    const name = v('model').trim(); if (!name) { $('#c-model').focus(); return; }
    const id = 'c-' + norm(name).replace(/ /g, '-') + '-' + Date.now().toString(36);
    let m;
    if (c === 'ap') m = { id, brand: v('brand'), model: name, std: v('std') || '—', streams: v('streams') || '—', b24: { tx: n('tx24'), gain: n('g24'), phy: n('phy24') || 0 }, b5: { tx: n('tx5'), gain: n('g5'), phy: n('phy5') }, poe: v('poe'), watt: n('watt'), clients: n('clients'), area: n('area') || 0 };
    else if (c === 'switch') m = { id, brand: v('brand'), model: name, ports: n('ports'), poePorts: n('poePorts'), poe: v('poe'), budget: n('budget'), managed: v('std') || '—', uplinks: '—' };
    else m = { id, model: name, awg: n('awg') || 23, cond: v('cond'), R: n('R'), a: 1.808, b: 0.017, c: 0.2, f: n('f'), limit: n('limit'), ok: v('cond') !== 'CCA' };
    m.custom = true;
    st.custom[c] = (st.custom[c] || []).concat([m]); st[c === 'switch' ? 'sw' : c] = id; save(st); fillAll(); render();
    $('#lab-found').innerHTML = `Added <b>${esc(name)}</b> to your library and applied it.`;
  });
  $('#c-clear').addEventListener('click', () => { st.custom = { ap: [], switch: [], cable: [] }; st.ap = 'u6-lite'; st.sw = 'sg1218mpe'; st.cable = 'cat6-cu'; save(st); fillAll(); render(); });

  /* ---------- render ---------- */
  const heat = document.getElementById('heat'), rings = document.getElementById('rings');
  // continuous colour ramp: strong (teal) → good (green) → fair (yellow) → weak (orange/red)
  const STOPS = [[-30, [20, 160, 170]], [-45, [40, 185, 130]], [-60, [63, 191, 127]], [-67, [156, 204, 74]], [-72, [232, 194, 74]], [-80, [232, 131, 58]], [-85, [217, 83, 79]]];
  function ramp(v) {
    if (v >= STOPS[0][0]) return STOPS[0][1];
    for (let i = 1; i < STOPS.length; i++) if (v >= STOPS[i][0]) {
      const [a, ca] = STOPS[i - 1], [b, cb] = STOPS[i], t = (a - v) / (a - b);
      return ca.map((c, k) => Math.round(c + (cb[k] - c) * t));
    }
    return STOPS.at(-1)[1];
  }
  // live probe: signal under the cursor
  const svg = document.getElementById('plan'), probe = document.getElementById('probe');
  svg.addEventListener('pointermove', e => {
    const list = aps(); if (!list.length || !probe) return;
    const p = svg.createSVGPoint(); p.x = e.clientX; p.y = e.clientY;
    const q = p.matrixTransform(svg.getScreenCTM().inverse());
    let best = -200, from = ''; for (const a of list) { const r = rssiAt(find('ap', st.ap), st.band, toM(Math.hypot(a.x - q.x, a.y - q.y))); if (r > best) { best = r; from = a.id; } }
    const t = tier(best);
    probe.hidden = false;
    probe.innerHTML = `<b style="color:${t[2]}">${Math.round(best)} dBm</b> ${t[1]} · from ${from} · ${f1(toM(Math.hypot(list.find(a => a.id === from).x - q.x, list.find(a => a.id === from).y - q.y)))} m`;
  });
  svg.addEventListener('pointerleave', () => { if (probe) probe.hidden = true; });
  const cv = document.createElement('canvas');
  function drawHeat(m) {
    const B = O.BOUNDS, step = 12, W = Math.ceil(B.w / step), H = Math.ceil(B.h / step);
    cv.width = W; cv.height = H; const ctx = cv.getContext('2d'); const img = ctx.createImageData(W, H);
    const list = aps();
    for (let j = 0; j < H; j++) for (let i = 0; i < W; i++) {
      const x = B.x + (i + .5) * step, y = B.y + (j + .5) * step;
      let best = -200; for (const a of list) best = Math.max(best, rssiAt(m, st.band, toM(Math.hypot(a.x - x, a.y - y))));
      const k = (j * W + i) * 4;
      if (best < -85 || !list.length) { img.data[k + 3] = 0; continue; }
      const c = ramp(best); img.data[k] = c[0]; img.data[k + 1] = c[1]; img.data[k + 2] = c[2]; img.data[k + 3] = 120;
    }
    ctx.putImageData(img, 0, 0);
    heat.setAttribute('href', cv.toDataURL());
    let r = '';
    for (const a of list) for (const [thr, , col] of TIERS.slice(1, 4)) {
      const rad = radius(m, st.band, thr) * 1000 / O.MM_PER_PT;
      r += `<circle cx="${a.x}" cy="${a.y}" r="${rad.toFixed(0)}" fill="none" stroke="${col}" stroke-width="2.5" stroke-dasharray="10 8" opacity=".9"/>`;
    }
    rings.innerHTML = r;
  }
  function card(el, title, rows, note) {
    el.innerHTML = `<h3>${title}</h3><dl>${rows.map(([k, v]) => `<dt>${k}</dt><dd>${v}</dd>`).join('')}</dl>${note ? `<p class="cnote">${note}</p>` : ''}`;
  }
  function render() {
    const ap = find('ap', st.ap), sw = find('switch', st.sw), cb = find('cable', st.cable);
    drawHeat(ap);
    $('#pl-n-v').textContent = st.n.toFixed(1); $('#walls-v').textContent = st.walls + ' dB';
    const r67 = radius(ap, st.band, -67), r72 = radius(ap, st.band, -72), r80 = radius(ap, st.band, -80);
    card($('#ap-card'), `${esc(ap.brand || '')} ${esc(ap.model)}`, [
      ['Standard', esc(ap.std) + ' · ' + esc(ap.streams)],
      ['2.4 GHz', `${ap.b24.tx} dBm + ${ap.b24.gain} dBi → EIRP ${f1(eirp(ap, '2.4'))} dBm · up to ${ap.b24.phy} Mbps`],
      ['5 GHz', `${ap.b5.tx} dBm + ${ap.b5.gain} dBi → EIRP ${f1(eirp(ap, '5'))} dBm · up to ${ap.b5.phy} Mbps`],
      ['Power', `PoE 802.3${ap.poe} · ${ap.watt} W max`],
      ['Clients / area', `${ap.clients} clients · ${ap.area ? ap.area + ' m² (maker claim)' : '—'}`],
      [`Range @ ${st.band} GHz`, `<b>${f1(r67)} m</b> good (−67) · ${f1(r72)} m fair (−72) · ${f1(r80)} m edge (−80)`],
    ], ap.custom ? 'Custom model — values entered by you.' : 'Typical datasheet values — confirm on the maker\'s site.');
    // desk signal
    const list = aps();
    $('#desk-tbl').innerHTML = O.devices.filter(d => d.type !== 'ap').map(d => {
      let best = -200, from = '—';
      for (const a of list) { const r = rssiAt(ap, st.band, toM(Math.hypot(a.x - d.x, a.y - d.y))); if (r > best) { best = r; from = a.id; } }
      const t = tier(best);
      return `<tr><td class="m">${d.id}</td><td>${esc(d.zone)}</td><td class="m">${from}</td><td class="n">${list.length ? Math.round(best) + ' dBm' : '—'}</td><td><span class="lvl" style="--c:${t[2]}"><i style="width:${Math.max(4, Math.min(100, (best + 90) * 2.5))}%"></i></span></td><td style="color:${t[2]}">${list.length ? t[1] : 'No AP on'}</td></tr>`;
    }).join('');
    const spacing = list.length > 1 ? list.slice(1).map((a, i) => `${list[i].id}–${a.id} ${f1(toM(Math.hypot(a.x - list[i].x, a.y - list[i].y)))} m`).join(' · ') : '—';
    $('#ap-summary').innerHTML = `<span><b>${list.length}</b> AP on</span><span>Spacing: ${spacing}</span><span>Capacity: <b>${list.length * ap.clients}</b> clients</span><span>Model: n = ${st.n.toFixed(1)}, walls ${st.walls} dB, ${st.band} GHz</span>`;
    // switch + PoE
    const loads = O.devices.filter(d => d.poe && (d.type !== 'ap' || st.on[d.id])).map(d => ({ id: d.id, w: d.type === 'ap' ? ap.watt : O.MOB_W }));
    const used = loads.reduce((s, l) => s + l.w, 0), pct = Math.min(100, used / sw.budget * 100);
    const afOnly = sw.poe === 'af' && ap.poe === 'at';
    const poeMax = Math.max(...O.devices.filter(d => d.poe).map(d => d.port));
    card($('#sw-card'), `${esc(sw.brand || '')} ${esc(sw.model)}`, [
      ['Ports', `${sw.ports} × 1 GbE · ${sw.poePorts} PoE (802.3${sw.poe})`],
      ['PoE budget', `${sw.budget} W`],
      ['Management', esc(sw.managed)],
      ['Uplinks', esc(sw.uplinks)],
      ['Fit for Office 14', sw.ports >= 15 && sw.poePorts >= poeMax && !afOnly && used <= sw.budget ? '<span class="ok">✓ Suitable</span>' : `<span class="bad">✗ ${sw.ports < 15 ? 'Too few ports. ' : ''}${sw.poePorts < poeMax ? `PoE only on ports 1–${sw.poePorts}; PoE is needed up to port ${poeMax}. ` : ''}${afOnly ? 'AP needs 802.3at. ' : ''}${used > sw.budget ? 'Over PoE budget.' : ''}</span>`],
    ], sw.custom ? 'Custom model — values entered by you.' : 'Typical datasheet values — confirm on the maker\'s site.');
    $('#poe-bar').innerHTML = `<div class="pbar"><i style="width:${pct}%;background:${used > sw.budget ? '#d9534f' : used > sw.budget * .8 ? '#e8c24a' : '#3fbf7f'}"></i></div>
      <div class="pleg">${loads.map(l => `<span>${l.id} ${l.w} W</span>`).join('')}<b>${f1(used)} W of ${sw.budget} W (${Math.round(used / sw.budget * 100)} %)</b></div>`;
    // cable
    card($('#cable-card'), esc(cb.model), [
      ['Conductor', `${cb.awg} AWG ${esc(cb.cond)} · ${cb.R} Ω / 100 m per conductor`],
      ['Rated', `${cb.f} MHz · permanent-link loss limit ${cb.limit} dB`],
      ['Standard', cb.ok ? '<span class="ok">✓ Meets TIA/ISO if installed correctly</span>' : '<span class="bad">✗ Not standards-compliant (CCA): fails certification, PoE heat</span>'],
    ], 'Insertion loss model per TIA-568.2-D cable formula; connectors 0.02√f dB each.');
    const ILc = (L, f) => L / 100 * (cb.a * Math.sqrt(f) + cb.b * f + cb.c / Math.sqrt(f)) + 2 * 0.02 * Math.sqrt(f);
    const rows = O.devices.slice().sort((a, b) => a.port - b.port).map(d => {
      const il = ILc(d.est, cb.f), margin = cb.limit - il, remain = Math.pow(10, -il / 20) * 100;
      let poe = '—';
      if (d.poe) {
        const pd = d.type === 'ap' ? ap.watt : O.MOB_W, R = cb.R / 100 * d.est, V = 50;
        let I = pd / V; for (let k = 0; k < 4; k++) I = pd / (V - I * R);
        poe = `${f1(I * I * R)} W lost · ${f1(V - I * R)} V at device`;
      }
      return `<tr><td class="m">${d.cable}</td><td>${d.id}</td><td class="n">${d.est} m</td><td class="n">${f1(il)} dB</td>
        <td><span class="lvl" style="--c:${margin > 10 ? '#3fbf7f' : margin > 3 ? '#e8c24a' : '#d9534f'}"><i style="width:${remain.toFixed(0)}%"></i></span></td>
        <td class="n">${remain.toFixed(0)} %</td><td class="n">${f1(margin)} dB</td><td class="muted">${poe}</td></tr>`;
    });
    $('#cable-tbl').innerHTML = rows.join('');
    $('#cable-f').textContent = cb.f;
  }
  fillAll(); render();
})();
