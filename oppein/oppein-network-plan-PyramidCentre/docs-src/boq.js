// Editable BOQ — live totals, amount in words, per-browser saving, print with letterhead.
(function () {
  const doc = document.getElementById('boq');
  if (!doc) return;
  const KEY = 'o14-boq-v3'; // v3: BOQ rows changed
  const VAT = +doc.dataset.vat || 5;
  const load = () => { try { return JSON.parse(localStorage.getItem(KEY) || '{}'); } catch (e) { return {}; } };
  const save = () => {
    const s = { rows: {}, f: {}, cont: document.getElementById('t-contp').value };
    doc.querySelectorAll('tr.it').forEach(r => {
      s.rows[r.dataset.key] = { q: r.querySelector('.q').value, r: r.querySelector('.r').value, inc: r.querySelector('.inc') ? r.querySelector('.inc').checked : true };
    });
    doc.querySelectorAll('[data-f]').forEach(i => { s.f[i.dataset.f] = i.value; });
    try { localStorage.setItem(KEY, JSON.stringify(s)); } catch (e) {}
  };
  const money = n => n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  // number → words (international), dirhams and fils
  const ONES = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
  const TENS = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
  const w999 = n => {
    let s = '';
    if (n >= 100) { s += ONES[Math.floor(n / 100)] + ' Hundred'; n %= 100; if (n) s += ' and '; }
    if (n >= 20) { s += TENS[Math.floor(n / 10)]; if (n % 10) s += '-' + ONES[n % 10]; }
    else if (n) s += ONES[n];
    return s;
  };
  const words = n => {
    if (n === 0) return 'Zero';
    const parts = []; const units = [[1e9, 'Billion'], [1e6, 'Million'], [1e3, 'Thousand']];
    for (const [v, l] of units) if (n >= v) { parts.push(w999(Math.floor(n / v)) + ' ' + l); n %= v; }
    if (n) parts.push(w999(n));
    return parts.join(' ');
  };
  const inWords = amt => {
    const d = Math.floor(amt + 1e-9), f = Math.round((amt - d) * 100);
    return `UAE Dirhams ${words(d)}${f ? ` and ${words(f)} Fils` : ''} only`;
  };

  function calc() {
    const subs = {}; let base = 0, opt = 0;
    doc.querySelectorAll('tr.it').forEach(r => {
      const q = parseFloat(r.querySelector('.q').value) || 0, rate = parseFloat(r.querySelector('.r').value) || 0;
      const inc = r.querySelector('.inc') ? r.querySelector('.inc').checked : true;
      const amt = q * rate;
      r.querySelector('.amt').textContent = money(amt);
      r.classList.toggle('excluded', !inc);
      r.querySelector('.q').classList.toggle('changed', r.querySelector('.q').value !== r.querySelector('.q').dataset.def);
      r.querySelector('.r').classList.toggle('changed', (+r.querySelector('.r').value).toFixed(2) !== r.querySelector('.r').dataset.def);
      if (!inc) return;
      subs[r.dataset.sec] = (subs[r.dataset.sec] || 0) + amt;
      if (r.classList.contains('opt')) opt += amt; else base += amt;
    });
    doc.querySelectorAll('[data-subamt]').forEach(c => { c.textContent = money(subs[c.dataset.subamt] || 0); });
    const cp = parseFloat(document.getElementById('t-contp').value) || 0;
    const cont = (base + opt) * cp / 100, net = base + opt + cont, vat = net * VAT / 100, grand = net + vat;
    const set = (id, v) => { const e = document.getElementById(id); if (e) e.textContent = money(v); };
    set('t-base', base); set('t-opt', opt); set('t-cont', cont); set('t-net', net); set('t-vat', vat); set('t-grand', grand);
    doc.classList.toggle("no-opt", opt === 0);
    document.getElementById("t-words").textContent = inWords(Math.round(grand * 100) / 100);
    const live = { base: 'AED ' + Math.round(base).toLocaleString('en-US'), grand: 'AED ' + Math.round(grand).toLocaleString('en-US'), perpt: 'AED ' + Math.round(grand / (+doc.dataset.points || 1)).toLocaleString('en-US') };
    document.querySelectorAll('[data-live]').forEach(e => { e.textContent = live[e.dataset.live]; });
    // share bars by section
    const bars = document.getElementById('boq-bars');
    if (bars) {
      const tot = Object.values(subs).reduce((a, b) => a + b, 0) || 1;
      bars.innerHTML = `<div class="sbar">${Object.entries(subs).map(([k, v]) => `<i class="s${k}" style="width:${(v / tot * 100).toFixed(1)}%" title="${k}: AED ${money(v)}"></i>`).join('')}</div>
        <div class="sleg">${Object.entries(subs).map(([k, v]) => `<span><i class="s${k}"></i>${k} · ${doc.querySelector(`tr.subt [data-subamt="${k}"]`).closest('tr').children[1].textContent.replace(/^Subtotal \w — /, '').replace(' (included items)', '')} — ${Math.round(v / tot * 100)} %</span>`).join('')}</div>`;
    }
  }

  // restore
  const s = load();
  if (s.rows) doc.querySelectorAll('tr.it').forEach(r => {
    const v = s.rows[r.dataset.key]; if (!v) return;
    r.querySelector('.q').value = v.q; r.querySelector('.r').value = v.r;
    if (r.querySelector('.inc')) r.querySelector('.inc').checked = !!v.inc;
  });
  if (s.f) doc.querySelectorAll('[data-f]').forEach(i => { if (s.f[i.dataset.f] != null) i.value = s.f[i.dataset.f]; });
  if (s.cont != null) document.getElementById('t-contp').value = s.cont;

  doc.addEventListener('input', () => { calc(); save(); });
  doc.addEventListener('change', () => { calc(); save(); });
  document.getElementById('boq-print').addEventListener('click', () => window.print());
  document.getElementById('boq-reset').addEventListener('click', () => {
    if (!confirm('Reset all quantities, rates and header fields to the original estimate?')) return;
    try { localStorage.removeItem(KEY); } catch (e) {}
    location.reload();
  });
  calc();
})();
