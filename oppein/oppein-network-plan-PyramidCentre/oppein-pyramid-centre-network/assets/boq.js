// Editable BOQ — tick lines in/out, add / remove your own lines, live totals and numbering,
// amount in words, per-browser saving, print with letterhead, export to Word (.doc).
(function () {
  const doc = document.getElementById('boq');
  if (!doc) return;
  const KEY = 'o14-boq-v8'; // v8: ticks on every line + custom lines
  const VAT = +doc.dataset.vat || 5;
  const $ = s => document.getElementById(s);
  const money = n => n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const rows = () => [...doc.querySelectorAll('tr.it')];
  const isOn = r => r.querySelector('.inc').checked;

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

  /* ---------- custom lines ---------- */
  let seq = 0;
  function addLine(sec, v = {}) {
    const anchor = doc.querySelector(`tr.addrow[data-sec="${sec}"]`); if (!anchor) return null;
    const opt = !!doc.querySelector(`tr.grp[data-grp="${sec}"].optgrp`);
    const key = v.key || `${sec}.x${Date.now().toString(36)}${seq++}`;
    const tr = document.createElement('tr');
    tr.className = 'it custom' + (opt ? ' opt' : '');
    tr.dataset.key = key; tr.dataset.sec = sec; tr.dataset.defon = '1';
    tr.innerHTML = `<td class="m"><input type="checkbox" class="inc no-print"${v.inc === false ? '' : ' checked'} aria-label="Include line"> <span class="no"></span></td>
      <td><input class="dsc" placeholder="Description of the item" value="${esc(v.d || '')}" aria-label="Description"><div class="rmk no-print">Your own line · <button type="button" class="delline">Remove line</button></div></td>
      <td class="u"><input class="un" value="${esc(v.u || 'pc')}" aria-label="Unit"></td>
      <td class="n"><input class="q" type="number" inputmode="decimal" min="0" step="1" value="${v.q != null ? v.q : 1}" data-def="${v.q != null ? v.q : 1}" aria-label="Quantity"></td>
      <td class="n"><input class="r" type="number" inputmode="decimal" min="0" step="0.01" value="${v.r != null ? v.r : '0.00'}" data-def="${(+(v.r || 0)).toFixed(2)}" aria-label="Unit rate"></td>
      <td class="n amt">0.00</td>`;
    anchor.before(tr);
    return tr;
  }
  doc.addEventListener('click', e => {
    const add = e.target.closest('.addline');
    if (add) { const tr = addLine(add.dataset.sec); calc(); save(); tr.querySelector('.dsc').focus(); return; }
    const del = e.target.closest('.delline');
    if (del) { del.closest('tr').remove(); calc(); save(); }
  });

  /* ---------- section ticks ---------- */
  // on click (fires before input/change), so calc() sees the new line ticks rather than resetting the section box
  doc.addEventListener('click', e => {
    if (!e.target.classList.contains('secinc')) return;
    const sec = e.target.closest('tr').dataset.grp;
    rows().filter(r => r.dataset.sec === sec).forEach(r => { r.querySelector('.inc').checked = e.target.checked; });
  }, true);
  const setAll = on => { rows().forEach(r => { r.querySelector('.inc').checked = on; }); calc(); save(); };
  $('boq-all').addEventListener('click', () => setAll(true));
  $('boq-none').addEventListener('click', () => setAll(false));

  /* ---------- totals + numbering ---------- */
  function calc() {
    const subs = {}, count = {}, n = {}; let base = 0, opt = 0;
    rows().forEach(r => {
      const sec = r.dataset.sec, q = parseFloat(r.querySelector('.q').value) || 0, rate = parseFloat(r.querySelector('.r').value) || 0;
      const inc = isOn(r), amt = q * rate;
      r.querySelector('.amt').textContent = money(amt);
      r.classList.toggle('excluded', !inc);
      r.querySelector('.q').classList.toggle('changed', r.querySelector('.q').value !== r.querySelector('.q').dataset.def);
      r.querySelector('.r').classList.toggle('changed', (+r.querySelector('.r').value).toFixed(2) !== r.querySelector('.r').dataset.def);
      count[sec] = (count[sec] || 0) + 1;
      r.querySelector('.no').textContent = inc ? `${sec}.${(n[sec] = (n[sec] || 0) + 1)}` : '—';
      if (!inc) return;
      subs[sec] = (subs[sec] || 0) + amt;
      if (r.classList.contains('opt')) opt += amt; else base += amt;
    });
    // section tick: on / off / mixed; hide a section in print and export when nothing in it is ticked
    doc.querySelectorAll('tr.grp').forEach(g => {
      const sec = g.dataset.grp, on = n[sec] || 0, all = count[sec] || 0, box = g.querySelector('.secinc');
      box.checked = all > 0 && on === all; box.indeterminate = on > 0 && on < all;
      g.classList.toggle('empty', on === 0);
      const st = doc.querySelector(`tr.subt[data-sub="${sec}"]`); if (st) st.classList.toggle('empty', on === 0);
    });
    doc.querySelectorAll('[data-subamt]').forEach(c => { c.textContent = money(subs[c.dataset.subamt] || 0); });
    const cp = parseFloat($('t-contp').value) || 0;
    const cont = (base + opt) * cp / 100, net = base + opt + cont, vat = net * VAT / 100, grand = net + vat;
    const set = (id, v) => { const e = $(id); if (e) e.textContent = money(v); };
    set('t-base', base); set('t-opt', opt); set('t-cont', cont); set('t-net', net); set('t-vat', vat); set('t-grand', grand);
    doc.classList.toggle('no-opt', opt === 0);
    $('t-words').textContent = inWords(Math.round(grand * 100) / 100);
    const live = { base: 'AED ' + Math.round(base).toLocaleString('en-US'), grand: 'AED ' + Math.round(grand).toLocaleString('en-US'), perpt: 'AED ' + Math.round(grand / (+doc.dataset.points || 1)).toLocaleString('en-US') };
    document.querySelectorAll('[data-live]').forEach(e => { e.textContent = live[e.dataset.live]; });
    const bars = $('boq-bars');
    if (bars) {
      const tot = Object.values(subs).reduce((a, b) => a + b, 0) || 1;
      const title = k => doc.querySelector(`tr.grp[data-grp="${k}"] .gt-title`).textContent;
      bars.innerHTML = `<div class="sbar">${Object.entries(subs).map(([k, v]) => `<i class="s${k}" style="width:${(v / tot * 100).toFixed(1)}%" title="${k}: AED ${money(v)}"></i>`).join('')}</div>
        <div class="sleg">${Object.entries(subs).map(([k, v]) => `<span><i class="s${k}"></i>${k} · ${esc(title(k))} — ${Math.round(v / tot * 100)} %</span>`).join('')}</div>`;
    }
  }

  /* ---------- save / restore ---------- */
  const load = () => { try { return JSON.parse(localStorage.getItem(KEY) || '{}'); } catch (e) { return {}; } };
  function save() {
    const s = { rows: {}, custom: [], f: {}, cont: $('t-contp').value };
    rows().forEach(r => {
      const v = { q: r.querySelector('.q').value, r: r.querySelector('.r').value, inc: isOn(r) };
      if (r.classList.contains('custom')) s.custom.push({ key: r.dataset.key, sec: r.dataset.sec, d: r.querySelector('.dsc').value, u: r.querySelector('.un').value, ...v });
      else s.rows[r.dataset.key] = v;
    });
    doc.querySelectorAll('[data-f]').forEach(i => { s.f[i.dataset.f] = i.value; });
    try { localStorage.setItem(KEY, JSON.stringify(s)); } catch (e) {}
  }
  const s = load();
  if (s.rows) rows().forEach(r => {
    const v = s.rows[r.dataset.key]; if (!v) return;
    r.querySelector('.q').value = v.q; r.querySelector('.r').value = v.r; r.querySelector('.inc').checked = !!v.inc;
  });
  (s.custom || []).forEach(v => addLine(v.sec, v));
  if (s.f) doc.querySelectorAll('[data-f]').forEach(i => { if (s.f[i.dataset.f] != null) i.value = s.f[i.dataset.f]; });
  if (s.cont != null) $('t-contp').value = s.cont;

  doc.addEventListener('input', () => { calc(); save(); });
  doc.addEventListener('change', () => { calc(); save(); });
  $('boq-print').addEventListener('click', () => window.print());
  $('boq-reset').addEventListener('click', () => {
    if (!confirm('Reset all ticks, quantities, rates and header fields to the original estimate, and remove your own lines?')) return;
    try { localStorage.removeItem(KEY); } catch (e) {}
    location.reload();
  });

  /* ---------- export to Word (.doc: Word-compatible HTML, opens in Word / LibreOffice / Google Docs) ---------- */
  $('boq-word').addEventListener('click', () => {
    calc();
    const f = k => { const i = doc.querySelector(`[data-f="${k}"]`); return i ? i.value.trim() : ''; };
    const txt = id => ($(id) || {}).textContent || '';
    let body = '';
    doc.querySelectorAll('table.boq tbody tr').forEach(r => {
      if (r.classList.contains('grp') && !r.classList.contains('empty')) body += `<tr class="g"><td>${esc(r.dataset.grp)}</td><td colspan="5">${esc(r.querySelector('.gt-title').textContent)}</td></tr>`;
      else if (r.classList.contains('it') && isOn(r)) {
        const custom = r.classList.contains('custom');
        const d = custom ? esc(r.querySelector('.dsc').value || '(no description)') : `${esc(r.querySelector('.d').textContent)}<br><span class="fn">${esc(r.querySelector('.fn').textContent)}</span>`;
        const u = custom ? r.querySelector('.un').value : r.querySelector('.u').textContent;
        body += `<tr><td>${esc(r.querySelector('.no').textContent)}</td><td>${d}</td><td>${esc(u)}</td><td class="n">${esc(r.querySelector('.q').value)}</td><td class="n">${money(parseFloat(r.querySelector('.r').value) || 0)}</td><td class="n">${r.querySelector('.amt').textContent}</td></tr>`;
      } else if (r.classList.contains('subt') && !r.classList.contains('empty')) body += `<tr class="s"><td></td><td colspan="4">${esc(r.children[1].textContent)}</td><td class="n">${esc(r.lastElementChild.textContent)}</td></tr>`;
    });
    const cp = $('t-contp').value;
    const tot = [['Subtotal A–E', txt('t-base')], ...(doc.classList.contains('no-opt') ? [] : [['Optional items (F, ticked)', txt('t-opt')]]), [`Contingency ${cp} %`, txt('t-cont')], ['Total before VAT', txt('t-net')], [`VAT ${VAT} %`, txt('t-vat')]];
    const meta = [['Estimate no.', f('ref')], ['Date', f('date')], ['Valid for', f('valid')], ['Revision', f('rev')], ['Prepared for', f('to')], ['Project', f('proj')], ['Site', f('site')], ['Currency', f('cur')]];
    const terms = [...doc.querySelectorAll('.terms li')].map(li => `<li>${esc(li.textContent)}</li>`).join('');
    const sign = [['Prepared by', f('by')], ['Reviewed by', f('rev_by')], ['Approved by', f('appr')]];
    const html = `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">
<head><meta charset="utf-8"><title>${esc(f('ref') || 'Estimate')}</title>
<!--[if gte mso 9]><xml><w:WordDocument><w:View>Print</w:View><w:Zoom>100</w:Zoom></w:WordDocument></xml><![endif]-->
<style>
@page Section1{size:21cm 29.7cm;margin:1.6cm 1.5cm 1.6cm 1.5cm}div.Section1{page:Section1}
body{font-family:Calibri,Arial,sans-serif;font-size:10pt;color:#1d1a17}
h1{font-size:20pt;margin:0;letter-spacing:1pt}h2{font-size:14pt;margin:10pt 0 4pt}
.tag{color:#5c554d;font-size:8.5pt;text-transform:uppercase;letter-spacing:.5pt}
.rule{border-bottom:3pt solid #b8691f;margin:6pt 0 10pt}
table{border-collapse:collapse;width:100%}
table.meta td{padding:2pt 6pt;font-size:9pt;border:0}table.meta td.k{color:#5c554d;width:18%}
table.boq th{background:#1d1a17;color:#fff;font-size:8.5pt;text-align:left;padding:4pt 5pt;border:1pt solid #1d1a17}
table.boq td{border:1pt solid #d9d2c8;padding:3pt 5pt;vertical-align:top;font-size:9.5pt}
table.boq tr.g td{background:#f6f2ec;font-weight:bold}table.boq tr.s td{font-weight:bold;color:#5c554d}
.n{text-align:right}.fn{color:#5c554d;font-size:8.5pt}
table.tot{width:55%;margin-left:45%;margin-top:8pt}table.tot td{border:1pt solid #d9d2c8;padding:3pt 6pt}
table.tot tr.gt td{background:#1d1a17;color:#fff;font-weight:bold;font-size:11pt}
.words{margin-top:6pt;font-style:italic}
ol{font-size:9pt;color:#5c554d}
table.sign td{width:33%;border:0;padding-top:28pt;font-size:9pt;vertical-align:bottom}
.line{border-top:1pt solid #1d1a17;padding-top:2pt;color:#5c554d}
</style></head>
<body><div class="Section1">
<table><tr><td style="border:0"><h1>${esc(f('co'))}</h1><div class="tag">${esc(f('tag'))}</div></td>
<td style="border:0;text-align:right;font-size:8.5pt;color:#5c554d">${[f('addr'), f('tel'), f('mail'), f('trn')].filter(Boolean).map(esc).join('<br>')}</td></tr></table>
<div class="rule"></div>
<h2>Estimate — Bill of Quantities</h2><div class="tag">Budget estimate · not a quotation</div>
<table class="meta">${[0, 2, 4, 6].map(i => `<tr><td class="k">${meta[i][0]}</td><td>${esc(meta[i][1])}</td><td class="k">${meta[i + 1][0]}</td><td>${esc(meta[i + 1][1])}</td></tr>`).join('')}</table>
<br><table class="boq"><thead><tr><th style="width:8%">No.</th><th>Description</th><th style="width:7%">Unit</th><th style="width:8%" class="n">Qty</th><th style="width:12%" class="n">Rate</th><th style="width:14%" class="n">Amount</th></tr></thead><tbody>${body}</tbody></table>
<table class="tot">${tot.map(([k, v]) => `<tr><td>${k}</td><td class="n">${v}</td></tr>`).join('')}<tr class="gt"><td>Grand total (AED)</td><td class="n">${txt('t-grand')}</td></tr></table>
<p class="words">${esc(txt('t-words'))}</p>
<h2>Notes &amp; conditions</h2><ol>${terms}</ol>
<table class="sign"><tr>${sign.map(([k, v]) => `<td>${esc(v)}<div class="line">${k} — signature &amp; date</div></td>`).join('')}</tr></table>
</div></body></html>`;
    const blob = new Blob(['﻿', html], { type: 'application/msword' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `${(f('ref') || 'BOQ').replace(/[^\w.-]+/g, '_')}.doc`;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 2000);
  });

  calc();
})();
