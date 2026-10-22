// Office 14 Network docs — floor-plan pan/zoom and device highlighting
(function () {
  /* floor-plan drawing is shared from assets/plan-art.js */
  if (window.PLAN_ART) document.querySelectorAll('[data-art]').forEach(g => { g.innerHTML = window.PLAN_ART; });

  /* highlight a device across the plan, topology and tables */
  function highlight(id) {
    document.querySelectorAll('svg.canvas, svg.diagram').forEach(svg => {
      svg.classList.toggle('dim', !!id);
      svg.querySelectorAll('.hl').forEach(n => n.classList.remove('hl'));
      if (id) svg.querySelectorAll(`[data-id="${id}"]`).forEach(n => n.classList.add('hl'));
    });
    document.querySelectorAll('tr[data-id]').forEach(r => r.classList.toggle('hl', r.dataset.id === id));
    document.querySelectorAll('.chip[data-id]').forEach(c => c.classList.toggle('on', c.dataset.id === id));
  }
  let pinned = null;
  const hover = id => { if (!pinned) highlight(id); };
  document.querySelectorAll('[data-id]').forEach(n => {
    if (n.dataset.id === 'RACK') return;
    n.addEventListener('mouseenter', () => hover(n.dataset.id));
    n.addEventListener('mouseleave', () => hover(null));
    n.addEventListener('click', e => { e.stopPropagation(); pinned = pinned === n.dataset.id ? null : n.dataset.id; highlight(pinned); });
  });

  /* pan / zoom by rewriting the viewBox */
  const svg = document.getElementById('plan');
  if (!svg) return;
  const home = svg.dataset.vb.split(' ').map(Number);
  let vb = home.slice();
  const set = () => svg.setAttribute('viewBox', vb.map(v => v.toFixed(1)).join(' '));
  const toWorld = (cx, cy) => {
    const r = svg.getBoundingClientRect();
    const s = Math.max(vb[2] / r.width, vb[3] / r.height);
    const ox = (r.width * s - vb[2]) / 2, oy = (r.height * s - vb[3]) / 2;
    return { x: vb[0] - ox + (cx - r.left) * s, y: vb[1] - oy + (cy - r.top) * s, s };
  };
  const zoom = (f, cx, cy) => {
    const r = svg.getBoundingClientRect();
    if (cx == null) { cx = r.left + r.width / 2; cy = r.top + r.height / 2; }
    const w = toWorld(cx, cy);
    const nw = Math.min(home[2] * 1.6, Math.max(home[2] / 20, vb[2] / f));
    const k = nw / vb[2];
    vb = [w.x - (w.x - vb[0]) * k, w.y - (w.y - vb[1]) * k, nw, vb[3] * k];
    set();
  };
  svg.addEventListener('wheel', e => { e.preventDefault(); zoom(Math.exp(-e.deltaY * 0.0015), e.clientX, e.clientY); }, { passive: false });
  const ptrs = new Map(); let moved = 0;
  svg.addEventListener('pointerdown', e => { ptrs.set(e.pointerId, { x: e.clientX, y: e.clientY }); moved = 0; svg.classList.add('panning'); });
  svg.addEventListener('pointermove', e => {
    if (!ptrs.has(e.pointerId)) return;
    const prev = ptrs.get(e.pointerId), cur = { x: e.clientX, y: e.clientY };
    if (ptrs.size === 1) {
      const s = toWorld(0, 0).s;
      vb[0] -= (cur.x - prev.x) * s; vb[1] -= (cur.y - prev.y) * s; set();
      moved += Math.abs(cur.x - prev.x) + Math.abs(cur.y - prev.y);
      if (moved > 4) svg.setPointerCapture(e.pointerId);
    } else if (ptrs.size === 2) {
      const other = [...ptrs.entries()].find(([k]) => k !== e.pointerId)[1];
      const d0 = Math.hypot(prev.x - other.x, prev.y - other.y), d1 = Math.hypot(cur.x - other.x, cur.y - other.y);
      if (d0 > 0) zoom(d1 / d0, (cur.x + other.x) / 2, (cur.y + other.y) / 2);
      moved += 99;
    }
    ptrs.set(e.pointerId, cur);
  });
  const end = e => { ptrs.delete(e.pointerId); if (!ptrs.size) svg.classList.remove('panning'); };
  svg.addEventListener('pointerup', end); svg.addEventListener('pointercancel', end);
  svg.addEventListener('click', () => { if (moved < 5 && pinned) { pinned = null; highlight(null); } });
  document.querySelectorAll('[data-z]').forEach(b => b.addEventListener('click', () => {
    const z = b.dataset.z; if (z === 'fit') { vb = home.slice(); set(); } else zoom(z === 'in' ? 1.4 : 1 / 1.4);
  }));
  const cov = document.getElementById('tcov');
  cov && cov.addEventListener('click', () => {
    const on = cov.getAttribute('aria-pressed') !== 'true';
    cov.setAttribute('aria-pressed', on); svg.classList.toggle('show-cov', on);
  });
})();
