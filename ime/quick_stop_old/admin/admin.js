/* ============================================================
   QUICK STOP — private Product Manager
   Edits a working copy of js/data.js, then writes the new file
   (and any new photos) back to the website folder, or hands over
   a ZIP. No server or database involved.
   ============================================================ */
(function () {
  "use strict";

  /* ---------------- helpers ---------------- */
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const esc = s => String(s == null ? "" : s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const clone = o => JSON.parse(JSON.stringify(o));
  const round2 = n => Math.round(n * 100) / 100;
  const money = n => "£" + Number(n).toFixed(2);
  const slug = s => String(s).toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "")
    .replace(/&/g, " and ").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  const stable = o => JSON.stringify(o, (k, v) => (v && typeof v === "object" && !Array.isArray(v))
    ? Object.keys(v).sort().reduce((a, key) => { a[key] = v[key]; return a; }, {}) : v);
  const todayISO = () => { const d = new Date(); return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0"); };
  const fmtDate = iso => new Date(iso + "T00:00:00").toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
  const fmtShort = iso => new Date(iso + "T00:00:00").toLocaleDateString("en-GB", { day: "numeric", month: "short" });
  const fmtLong = iso => new Date(iso + "T00:00:00").toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short", year: "numeric" });
  const hashStr = s => { let h = 5381; for (let i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) | 0; return Math.abs(h).toString(36); };

  const DRAFT_KEY = "qs_admin_draft_v1";
  const IMG_DIR = "images/products/";
  const SHOP_PREFIX = { newsbooze: "nb", essentials: "es" };
  const ICON_BAG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>';
  const ICON_CART = '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>';
  const HAS_FS = typeof window.showDirectoryPicker === "function";

  let bust = Date.now();

  /* ---------------- toast ---------------- */
  let toastTimer;
  function toast(msg, ms) {
    const el = $("#adm-toast");
    el.textContent = msg;
    el.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove("show"), ms || 2600);
  }

  /* ---------------- IndexedDB (unpublished photos + folder handle) ---------------- */
  const dbPromise = new Promise(resolve => {
    try {
      const r = indexedDB.open("qs-admin", 1);
      r.onupgradeneeded = () => { r.result.createObjectStore("images"); r.result.createObjectStore("meta"); };
      r.onsuccess = () => resolve(r.result);
      r.onerror = () => resolve(null);
    } catch (e) { resolve(null); }
  });
  async function idbOp(store, mode, fn) {
    const db = await dbPromise;
    if (!db) return null;
    return new Promise(resolve => {
      try {
        const tx = db.transaction(store, mode);
        const req = fn(tx.objectStore(store));
        tx.oncomplete = () => resolve(req ? req.result : null);
        tx.onerror = () => resolve(null);
      } catch (e) { resolve(null); }
    });
  }
  const idbPut = (store, key, val) => idbOp(store, "readwrite", s => s.put(val, key));
  const idbGet = (store, key) => idbOp(store, "readonly", s => s.get(key));
  const idbDel = (store, key) => idbOp(store, "readwrite", s => s.delete(key));
  async function idbAllImages() {
    const db = await dbPromise;
    if (!db) return [];
    return new Promise(resolve => {
      const out = [];
      try {
        const req = db.transaction("images", "readonly").objectStore("images").openCursor();
        req.onsuccess = () => {
          const c = req.result;
          if (c) { out.push([c.key, c.value]); c.continue(); } else resolve(out);
        };
        req.onerror = () => resolve(out);
      } catch (e) { resolve(out); }
    });
  }

  /* ---------------- state ---------------- */
  const SHOP_IDS = Object.keys(SHOPS);
  const pendingImages = new Map(); // path -> { blob, url }
  let baseline = { products: clone(PRODUCTS), promotion: clone(PROMOTION) };
  let state = clone(baseline);
  let dirty = false;
  const selected = new Set();

  function loadDraft() {
    try {
      const raw = localStorage.getItem(DRAFT_KEY);
      if (!raw) return;
      const d = JSON.parse(raw);
      if (d && Array.isArray(d.products) && d.promotion) state = d;
    } catch (e) { /* ignore corrupt draft */ }
  }
  function persist() {
    dirty = stable(state) !== stable(baseline) || hasUnsavedImages();
    try {
      if (dirty) localStorage.setItem(DRAFT_KEY, JSON.stringify(state));
      else localStorage.removeItem(DRAFT_KEY);
    } catch (e) { /* storage full or blocked */ }
    updateStatus();
  }
  function hasUnsavedImages() {
    return state.products.some(p => p.image && pendingImages.has(p.image));
  }
  function updateStatus() {
    const chip = $("#status-chip");
    chip.textContent = dirty ? "Unpublished changes (draft saved)" : "Up to date with website";
    chip.classList.toggle("dirty", dirty);
    $("#btn-discard").hidden = !dirty;
  }

  /* ---------------- offers & prices ---------------- */
  function offerInfo(p) {
    const has = p.salePrice != null || p.discountPercent != null;
    if (!has) return { kind: "none", current: p.price, percent: 0 };
    const cand = p.salePrice != null ? p.salePrice : p.price * (1 - p.discountPercent / 100);
    const cur = round2(cand);
    if (!(cur < p.price) || cur <= 0) return { kind: "invalid", current: p.price, percent: 0 };
    const active = !p.discountUntil || new Date() <= new Date(p.discountUntil + "T23:59:59");
    return {
      kind: active ? "active" : "expired",
      current: active ? cur : p.price,
      offerPrice: cur,
      percent: Math.round((1 - cur / p.price) * 100),
      saving: round2(p.price - cur),
      until: p.discountUntil || null
    };
  }
  const shopName = id => (SHOPS[id] ? SHOPS[id].shortName : id);

  function imgUrl(path) {
    const pi = pendingImages.get(path);
    return pi ? pi.url : "../" + path + "?v=" + bust;
  }
  function thumbHTML(p) {
    if (p.image) return `<div class="adm-thumb"><img src="${esc(imgUrl(p.image))}" alt=""></div>`;
    if (CATEGORY_IMAGES[p.category]) return `<div class="adm-thumb fallback" title="Using the category photo"><img src="../${esc(CATEGORY_IMAGES[p.category])}" alt=""></div>`;
    return `<div class="adm-thumb">${ICON_BAG}</div>`;
  }

  /* ---------------- filters + table ---------------- */
  const filters = { q: "", shop: "all", category: "all", status: "all", sort: "shop" };

  function categoriesFor(shopId) {
    const seen = [];
    state.products.filter(p => shopId === "all" || p.shop === shopId).forEach(p => { if (!seen.includes(p.category)) seen.push(p.category); });
    return seen;
  }
  function buildFilterSelects() {
    $("#f-shop").innerHTML = `<option value="all">All shops</option>` + SHOP_IDS.map(id => `<option value="${id}">${esc(SHOPS[id].name)}</option>`).join("");
    $("#f-shop").value = filters.shop;
    refreshCategoryFilter();
  }
  function refreshCategoryFilter() {
    const cats = categoriesFor(filters.shop);
    if (filters.category !== "all" && !cats.includes(filters.category)) filters.category = "all";
    $("#f-category").innerHTML = `<option value="all">All categories</option>` + cats.map(c => `<option value="${esc(c)}">${esc(c)}</option>`).join("");
    $("#f-category").value = filters.category;
  }

  function visibleProducts() {
    const q = filters.q.trim().toLowerCase();
    let list = state.products.filter(p => {
      if (filters.shop !== "all" && p.shop !== filters.shop) return false;
      if (filters.category !== "all" && p.category !== filters.category) return false;
      if (q && !(`${p.name} ${p.brand} ${p.category}`.toLowerCase().includes(q))) return false;
      const o = offerInfo(p);
      switch (filters.status) {
        case "offer": return o.kind === "active";
        case "expired": return o.kind === "expired";
        case "featured": return !!p.featured;
        case "nophoto": return !p.image;
        case "age": return !!p.age18;
      }
      return true;
    });
    const shopOrder = id => SHOP_IDS.indexOf(id);
    const catOrder = (id, c) => categoriesFor(id).indexOf(c);
    if (filters.sort === "name") list.sort((a, b) => a.name.localeCompare(b.name));
    else if (filters.sort === "price-asc") list.sort((a, b) => offerInfo(a).current - offerInfo(b).current);
    else if (filters.sort === "price-desc") list.sort((a, b) => offerInfo(b).current - offerInfo(a).current);
    else if (filters.sort === "offer") list.sort((a, b) => offerInfo(b).percent * (offerInfo(b).kind === "active") - offerInfo(a).percent * (offerInfo(a).kind === "active"));
    else list.sort((a, b) => shopOrder(a.shop) - shopOrder(b.shop) || catOrder(a.shop, a.category) - catOrder(b.shop, b.category));
    return list;
  }

  function renderStats() {
    const total = state.products.length;
    const active = state.products.filter(p => offerInfo(p).kind === "active").length;
    const expired = state.products.filter(p => offerInfo(p).kind === "expired").length;
    const noPhoto = state.products.filter(p => !p.image).length;
    const perShop = SHOP_IDS.map(id => `<div class="adm-stat"><b>${state.products.filter(p => p.shop === id).length}</b><span>${esc(SHOPS[id].shortName)}</span></div>`).join("");
    $("#stats").innerHTML =
      `<div class="adm-stat"><b>${total}</b><span>Products</span></div>${perShop}` +
      `<div class="adm-stat"><b>${active}</b><span>On offer now</span></div>` +
      (expired ? `<div class="adm-stat"><b>${expired}</b><span>Expired offers</span></div>` : "") +
      `<div class="adm-stat"><b>${total - noPhoto}</b><span>With own photo</span></div>`;
  }

  function nowCell(p) {
    const o = offerInfo(p);
    if (o.kind === "active") {
      return `<div class="adm-now"><b class="sale">${money(o.current)}</b> <span class="adm-pill adm-pill-red">${o.percent}% off</span>` +
        `<small>${o.until ? "ends " + fmtShort(o.until) : "no end date"}</small></div>`;
    }
    if (o.kind === "expired") {
      return `<div class="adm-now"><b>${money(p.price)}</b> <span class="adm-pill adm-pill-grey">offer ended ${fmtShort(o.until)}</span></div>`;
    }
    if (o.kind === "invalid") {
      return `<div class="adm-now"><b>${money(p.price)}</b> <span class="adm-pill adm-pill-dark">check offer</span></div>`;
    }
    return `<div class="adm-now"><b>${money(p.price)}</b></div>`;
  }

  function renderTable() {
    const list = visibleProducts();
    const rows = list.map(p => `
      <tr data-id="${esc(p.id)}">
        <td><input type="checkbox" class="row-check" ${selected.has(p.id) ? "checked" : ""} aria-label="Select ${esc(p.name)}"></td>
        <td>${thumbHTML(p)}</td>
        <td><span class="adm-pname">${esc(p.name)}</span><span class="adm-pmeta">${esc(p.unit || "")} · ${esc(p.brand || "Generic")}</span></td>
        <td><span class="adm-pill ${p.shop === "newsbooze" ? "adm-pill-nb" : "adm-pill-es"}">${esc(shopName(p.shop))}</span></td>
        <td>${esc(p.category)}</td>
        <td class="adm-num">${money(p.price)}</td>
        <td>${nowCell(p)}</td>
        <td>${p.featured ? '<span class="adm-pill adm-pill-gold">Featured</span> ' : ""}${p.age18 ? '<span class="adm-pill adm-pill-dark">18+</span>' : ""}</td>
        <td><div class="adm-row-actions">
          <button class="adm-btn adm-btn-sm" data-act="edit">Edit</button>
          <button class="adm-btn adm-btn-sm adm-btn-ghost" data-act="dup" title="Duplicate">Copy</button>
          <button class="adm-btn adm-btn-sm adm-btn-danger" data-act="del" title="Delete">✕</button>
        </div></td>
      </tr>`).join("");
    $("#product-rows").innerHTML = rows;
    $("#empty-note").hidden = list.length > 0;
    const allVisibleSelected = list.length > 0 && list.every(p => selected.has(p.id));
    $("#check-all").checked = allVisibleSelected;
    renderBulkBar();
  }

  function renderAll() {
    renderStats();
    refreshCategoryFilter();
    renderTable();
  }

  function renderBulkBar() {
    // drop selections that no longer exist
    Array.from(selected).forEach(id => { if (!state.products.some(p => p.id === id)) selected.delete(id); });
    $("#bulk-bar").hidden = selected.size === 0;
    $("#bulk-count").textContent = selected.size + " selected";
  }

  /* ---------------- toolbar + table events ---------------- */
  $("#f-search").addEventListener("input", e => { filters.q = e.target.value; renderTable(); });
  $("#f-shop").addEventListener("change", e => { filters.shop = e.target.value; filters.category = "all"; refreshCategoryFilter(); renderTable(); });
  $("#f-category").addEventListener("change", e => { filters.category = e.target.value; renderTable(); });
  $("#f-status").addEventListener("change", e => { filters.status = e.target.value; renderTable(); });
  $("#f-sort").addEventListener("change", e => { filters.sort = e.target.value; renderTable(); });

  $("#check-all").addEventListener("change", e => {
    visibleProducts().forEach(p => e.target.checked ? selected.add(p.id) : selected.delete(p.id));
    renderTable();
  });
  $("#product-rows").addEventListener("change", e => {
    if (!e.target.classList.contains("row-check")) return;
    const id = e.target.closest("tr").dataset.id;
    e.target.checked ? selected.add(id) : selected.delete(id);
    renderBulkBar();
    const list = visibleProducts();
    $("#check-all").checked = list.length > 0 && list.every(p => selected.has(p.id));
  });
  $("#product-rows").addEventListener("click", e => {
    const btn = e.target.closest("[data-act]");
    if (!btn) return;
    const id = btn.closest("tr").dataset.id;
    const p = state.products.find(x => x.id === id);
    if (!p) return;
    if (btn.dataset.act === "edit") openForm(p, "edit");
    else if (btn.dataset.act === "dup") openForm(p, "dup");
    else if (btn.dataset.act === "del") {
      if (confirm(`Delete "${p.name}"?\n\n(Its photo file, if any, is kept on disk.)`)) { removeProducts([id]); toast("Product deleted"); }
    }
  });
  $("#btn-add").addEventListener("click", () => openForm(null, "add"));

  function cleanupPendingImage(path) {
    if (!path || !pendingImages.has(path)) return;
    if (state.products.some(p => p.image === path)) return;
    const pi = pendingImages.get(path);
    if (pi && pi.url) URL.revokeObjectURL(pi.url);
    pendingImages.delete(path);
    idbDel("images", path);
  }
  function removeProducts(ids) {
    const removedImages = state.products.filter(p => ids.includes(p.id)).map(p => p.image);
    state.products = state.products.filter(p => !ids.includes(p.id));
    ids.forEach(id => selected.delete(id));
    removedImages.forEach(cleanupPendingImage);
    persist();
    renderAll();
  }

  /* ---------------- bulk actions ---------------- */
  $("#bulk-none").addEventListener("click", () => { selected.clear(); renderTable(); });
  $("#bulk-delete").addEventListener("click", () => {
    if (confirm(`Delete ${selected.size} selected product(s)?`)) { const n = selected.size; removeProducts(Array.from(selected)); toast(n + " products deleted"); }
  });
  $("#bulk-clear-offer").addEventListener("click", () => {
    state.products.forEach(p => { if (selected.has(p.id)) { delete p.salePrice; delete p.discountPercent; delete p.discountUntil; } });
    persist(); renderAll(); toast("Offers cleared");
  });
  const bulkDlg = $("#bulk-dialog");
  $("#bulk-offer").addEventListener("click", () => {
    $("#bulk-summary").textContent = `This sets the same % off on ${selected.size} selected product(s). Any existing offer on them is replaced.`;
    $("#bulk-error").hidden = true;
    $("#bulk-until").value = "";
    bulkDlg.showModal();
  });
  $("#bulk-form").addEventListener("submit", e => {
    e.preventDefault();
    const pct = parseFloat($("#bulk-percent").value);
    const until = $("#bulk-until").value;
    const err = $("#bulk-error");
    if (!(pct >= 1 && pct <= 95)) { err.textContent = "Enter a discount between 1 and 95%."; err.hidden = false; return; }
    if (until && until < todayISO()) { err.textContent = "That end date has already passed."; err.hidden = false; return; }
    state.products.forEach(p => {
      if (!selected.has(p.id)) return;
      delete p.salePrice;
      p.discountPercent = pct;
      if (until) p.discountUntil = until; else delete p.discountUntil;
    });
    persist(); renderAll(); bulkDlg.close();
    toast(`${pct}% offer applied`);
  });

  /* ---------------- product dialog ---------------- */
  const dlg = $("#product-dialog");
  const F = {
    name: $("#pf-name"), shop: $("#pf-shop"), category: $("#pf-category"), brand: $("#pf-brand"),
    unit: $("#pf-unit"), price: $("#pf-price"), featured: $("#pf-featured"), age: $("#pf-age"),
    offerValue: $("#pf-offer-value"), offerLabel: $("#pf-offer-label"), offerFields: $("#pf-offer-fields"),
    until: $("#pf-until"), calc: $("#pf-calc"), error: $("#pf-error"), preview: $("#pf-preview"),
    drop: $("#pf-drop"), file: $("#pf-file"), dropEmpty: $("#pf-drop-empty"), dropImg: $("#pf-drop-img"),
    photoNote: $("#pf-photo-note"), photoRemove: $("#pf-photo-remove")
  };
  F.shop.innerHTML = SHOP_IDS.map(id => `<option value="${id}">${esc(SHOPS[id].shortName)}</option>`).join("");

  let editing = null;   // product being edited
  let formMode = "add";
  let offerType = "none";
  let ageTouched = false;
  let formImg = null;   // { blob, url, size, dims } | { existing: path } | { removed: true } | null

  function refreshDatalists() {
    const cats = categoriesFor(F.shop.value);
    const list = cats.length ? cats : categoriesFor("all");
    $("#dl-categories").innerHTML = list.map(c => `<option value="${esc(c)}">`).join("");
    const brands = Array.from(new Set(state.products.map(p => p.brand).filter(Boolean))).sort();
    $("#dl-brands").innerHTML = brands.map(b => `<option value="${esc(b)}">`).join("");
  }

  function setOfferType(t) {
    offerType = t;
    $$("#pf-offer-type button").forEach(b => b.classList.toggle("active", b.dataset.type === t));
    F.offerFields.hidden = t === "none";
    F.offerLabel.textContent = t === "price" ? "New price (£)" : "Discount (%)";
    F.offerValue.placeholder = t === "price" ? "e.g. 3.99" : "e.g. 20";
  }

  function openForm(p, mode) {
    editing = mode === "edit" ? p : null;
    formMode = mode;
    ageTouched = mode !== "add";
    $("#pf-title").textContent = mode === "edit" ? "Edit product" : mode === "dup" ? "Duplicate product" : "Add product";
    F.error.hidden = true;
    F.shop.value = p ? p.shop : (filters.shop !== "all" ? filters.shop : SHOP_IDS[0]);
    refreshDatalists();
    F.name.value = p ? (mode === "dup" ? p.name + " (copy)" : p.name) : "";
    F.category.value = p ? p.category : (filters.category !== "all" ? filters.category : "");
    F.brand.value = p ? (p.brand === "Generic" ? "" : p.brand || "") : "";
    F.unit.value = p ? (p.unit || "") : "";
    F.price.value = p ? p.price : "";
    F.featured.checked = !!(p && p.featured);
    F.age.checked = !!(p && p.age18);
    const t = p && p.salePrice != null ? "price" : p && p.discountPercent != null ? "percent" : "none";
    setOfferType(t);
    F.offerValue.value = t === "price" ? p.salePrice : t === "percent" ? p.discountPercent : "";
    F.until.value = (p && p.discountUntil) || "";
    F.until.min = todayISO();
    formImg = (mode === "edit" && p && p.image) ? { existing: p.image } : null;
    updatePhotoUI();
    refreshForm();
    dlg.showModal();
    F.name.focus();
  }

  function closeForm() {
    if (formImg && formImg.url) URL.revokeObjectURL(formImg.url);
    formImg = null;
    dlg.close();
  }
  $$("[data-close]", dlg).forEach(b => b.addEventListener("click", closeForm));
  dlg.addEventListener("cancel", () => { if (formImg && formImg.url) URL.revokeObjectURL(formImg.url); formImg = null; });
  $$("[data-close]", bulkDlg).forEach(b => b.addEventListener("click", () => bulkDlg.close()));

  function readForm() {
    const price = parseFloat(F.price.value);
    const ov = parseFloat(F.offerValue.value);
    return {
      name: F.name.value.trim(), shop: F.shop.value, category: F.category.value.trim(),
      brand: F.brand.value.trim(), unit: F.unit.value.trim(),
      price: isNaN(price) ? null : price, featured: F.featured.checked, age18: F.age.checked,
      offerType, offerValue: isNaN(ov) ? null : ov, until: F.until.value
    };
  }

  /* Live auto-calculation of the offer */
  function calcOffer(v) {
    const out = { ok: true, current: v.price, percent: 0, saving: 0, warn: "" };
    if (v.offerType === "none" || v.price == null || v.offerValue == null) return out;
    let cur;
    if (v.offerType === "percent") {
      if (v.offerValue < 1 || v.offerValue > 95) { out.ok = false; out.warn = "Discount must be between 1% and 95%."; return out; }
      cur = round2(v.price * (1 - v.offerValue / 100));
    } else {
      cur = round2(v.offerValue);
      if (cur <= 0) { out.ok = false; out.warn = "New price must be more than £0."; return out; }
      if (cur >= v.price) { out.ok = false; out.warn = "New price must be lower than the regular price."; return out; }
    }
    out.current = cur;
    out.saving = round2(v.price - cur);
    out.percent = Math.round((1 - cur / v.price) * 100);
    out.on = true;
    return out;
  }

  function refreshForm() {
    const v = readForm();
    // calc box
    const c = calcOffer(v);
    let html;
    if (v.price == null) html = "Enter the regular price to see the maths.";
    else if (v.offerType === "none") html = `Customers pay <b>${money(v.price)}</b> (no offer).`;
    else if (!c.on && !c.warn) html = `Enter the ${v.offerType === "percent" ? "discount %" : "new price"} to see the result.`;
    else if (c.warn) html = `<span class="adm-warn">${esc(c.warn)}</span>`;
    else {
      html = `Regular <b>${money(v.price)}</b> → customers pay <span class="adm-sale">${money(c.current)}</span><br>` +
        `Saving <b>${money(c.saving)}</b> · <b>${c.percent}% off</b><br>` +
        (v.until
          ? (v.until < todayISO()
            ? `<span class="adm-warn">Ends ${esc(fmtLong(v.until))} — that date has passed, so the offer won't show.</span>`
            : `Runs until the end of <b>${esc(fmtLong(v.until))}</b>, then switches off by itself.`)
          : `No end date — stays on until you remove it.`);
    }
    F.calc.innerHTML = html;
    updatePreview(v, c);
    updatePhotoNote(v);
  }

  function previewProduct(v, c) {
    const p = { name: v.name || "Product name", unit: v.unit || "each", brand: v.brand || "Generic", shop: v.shop, category: v.category, price: v.price == null ? 0 : v.price, age18: v.age18 };
    return { p, on: !!(c.on && c.ok && (!v.until || v.until >= todayISO())), c };
  }
  function updatePreview(v, c) {
    const { p, on } = previewProduct(v, c);
    let media;
    let src = null;
    if (formImg && formImg.url) src = formImg.url;
    else if (formImg && formImg.existing) src = imgUrl(formImg.existing);
    else if (CATEGORY_IMAGES[p.category]) src = "../" + CATEGORY_IMAGES[p.category];
    const badge = on ? `<span class="discount-badge">${c.percent}% OFF</span>` : "";
    media = src
      ? `<div class="product-card-media"><img src="${esc(src)}" alt="">${badge}</div>`
      : `<div class="product-card-media product-card-media-icon">${ICON_BAG}${badge}</div>`;
    const price = on
      ? `<span class="product-price product-price-sale">${money(c.current)}</span><span class="product-price-was">${money(p.price)}</span>`
      : `<span class="product-price">${money(p.price)}</span>`;
    const ends = on && v.until ? `<span class="sale-ends">Offer ends ${esc(fmtShort(v.until))}</span>` : "";
    F.preview.innerHTML = `
      <div class="product-card">
        ${media}
        <div class="product-card-top"><span class="shop-badge ${p.shop === "newsbooze" ? "badge-nb" : "badge-es"}">${esc(shopName(p.shop))}</span>${p.age18 ? '<span class="age-badge">18+</span>' : ""}</div>
        <p class="product-name">${esc(p.name)}</p>
        <p class="product-unit">${esc(p.unit)}</p>
        <div class="product-card-bottom"><div class="product-price-wrap">${price}${ends}</div></div>
        <button class="add-btn" type="button">${ICON_CART} Add to basket</button>
      </div>`;
  }

  ["input", "change"].forEach(ev => {
    [F.name, F.brand, F.unit, F.price, F.offerValue, F.until, F.featured].forEach(el => el.addEventListener(ev, refreshForm));
  });
  F.age.addEventListener("change", () => { ageTouched = true; refreshForm(); });
  F.shop.addEventListener("change", () => { refreshDatalists(); refreshForm(); });
  F.category.addEventListener("input", () => {
    if (!ageTouched) {
      const known = state.products.some(p => p.category.toLowerCase() === F.category.value.trim().toLowerCase() && p.age18);
      F.age.checked = known;
    }
    refreshForm();
  });
  $$("#pf-offer-type button").forEach(b => b.addEventListener("click", () => { setOfferType(b.dataset.type); refreshForm(); }));
  $$(".adm-quick button").forEach(b => b.addEventListener("click", () => {
    const d = b.dataset.days;
    if (d === "none") F.until.value = "";
    else {
      const dt = new Date();
      if (d === "month") dt.setMonth(dt.getMonth() + 1, 0);
      else dt.setDate(dt.getDate() + parseInt(d, 10));
      F.until.value = dt.getFullYear() + "-" + String(dt.getMonth() + 1).padStart(2, "0") + "-" + String(dt.getDate()).padStart(2, "0");
    }
    refreshForm();
  }));

  /* ---- photo: choose / drop / paste, then auto-resize + rename ---- */
  function usedPaths(exceptPath) {
    const s = new Set();
    state.products.forEach(p => { if (p.image && p.image !== exceptPath) s.add(p.image); });
    pendingImages.forEach((v, k) => { if (k !== exceptPath) s.add(k); });
    return s;
  }
  function plannedPath(v) {
    const base = slug(`${shopName(v.shop).replace(/&/g, " ")} ${v.name || "product"}`) || "product";
    const own = editing && editing.image ? editing.image : null;
    const used = usedPaths(own);
    let path = IMG_DIR + base + ".jpg";
    for (let n = 2; used.has(path); n++) path = IMG_DIR + base + "-" + n + ".jpg";
    return path;
  }
  function updatePhotoNote(v) {
    if (formImg && formImg.blob) {
      F.photoNote.innerHTML = `Optimised to ${formImg.dims} · ${Math.round(formImg.blob.size / 1024)} KB.<br>Will be saved as <code>${esc(plannedPath(v))}</code>`;
    } else if (formImg && formImg.existing) {
      F.photoNote.innerHTML = `Current photo: <code>${esc(formImg.existing)}</code>`;
    } else {
      F.photoNote.textContent = "No photo yet — the category photo will be used.";
    }
  }
  function updatePhotoUI() {
    const src = formImg && formImg.blob ? formImg.url : formImg && formImg.existing ? imgUrl(formImg.existing) : null;
    F.dropImg.hidden = !src;
    F.dropEmpty.hidden = !!src;
    if (src) F.dropImg.src = src;
    F.photoRemove.hidden = !src;
  }

  function loadBitmap(file) {
    if (window.createImageBitmap) return createImageBitmap(file).catch(() => loadViaImg(file));
    return loadViaImg(file);
  }
  function loadViaImg(file) {
    return new Promise((resolve, reject) => {
      const url = URL.createObjectURL(file);
      const img = new Image();
      img.onload = () => { resolve(img); };
      img.onerror = () => { reject(new Error("decode")); };
      img.src = url;
    });
  }
  async function handleFile(file) {
    if (!file || !/^image\//.test(file.type)) { showFormError("That file isn't an image. Use a JPG, PNG or WebP photo."); return; }
    try {
      const bmp = await loadBitmap(file);
      const w = bmp.width || bmp.naturalWidth, h = bmp.height || bmp.naturalHeight;
      const scale = Math.min(1, 900 / Math.max(w, h));
      const cw = Math.round(w * scale), ch = Math.round(h * scale);
      const canvas = document.createElement("canvas");
      canvas.width = cw; canvas.height = ch;
      const ctx = canvas.getContext("2d");
      ctx.fillStyle = "#fff"; ctx.fillRect(0, 0, cw, ch);
      ctx.drawImage(bmp, 0, 0, cw, ch);
      const blob = await new Promise(r => canvas.toBlob(r, "image/jpeg", 0.84));
      if (formImg && formImg.url) URL.revokeObjectURL(formImg.url);
      formImg = { blob, url: URL.createObjectURL(blob), dims: `${cw}×${ch}` };
      F.error.hidden = true;
      updatePhotoUI();
      refreshForm();
    } catch (e) {
      showFormError("Couldn't read that image. Try a JPG, PNG or WebP (HEIC photos need converting first).");
    }
  }
  F.drop.addEventListener("click", () => F.file.click());
  F.drop.addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); F.file.click(); } });
  F.file.addEventListener("change", () => { if (F.file.files[0]) handleFile(F.file.files[0]); F.file.value = ""; });
  ["dragenter", "dragover"].forEach(ev => F.drop.addEventListener(ev, e => { e.preventDefault(); F.drop.classList.add("over"); }));
  ["dragleave", "drop"].forEach(ev => F.drop.addEventListener(ev, e => { e.preventDefault(); F.drop.classList.remove("over"); }));
  F.drop.addEventListener("drop", e => { const f = e.dataTransfer && e.dataTransfer.files[0]; if (f) handleFile(f); });
  dlg.addEventListener("paste", e => {
    const item = Array.from((e.clipboardData && e.clipboardData.items) || []).find(i => i.type.startsWith("image/"));
    if (item) { e.preventDefault(); handleFile(item.getAsFile()); }
  });
  F.photoRemove.addEventListener("click", () => {
    if (formImg && formImg.url) URL.revokeObjectURL(formImg.url);
    formImg = { removed: true };
    updatePhotoUI(); refreshForm();
  });

  function showFormError(msg) { F.error.textContent = msg; F.error.hidden = false; F.error.scrollIntoView({ block: "nearest" }); }

  /* ---- save product ---- */
  function newId(shop, name) {
    const prefix = SHOP_PREFIX[shop] || shop.slice(0, 2);
    const base = `${prefix}-${slug(name).slice(0, 40) || "item"}`;
    let id = base;
    for (let n = 2; state.products.some(p => p.id === id); n++) id = base + "-" + n;
    return id;
  }

  $("#product-form").addEventListener("submit", async e => {
    e.preventDefault();
    const v = readForm();
    if (!v.name) return showFormError("Please enter the product name.");
    if (!v.category) return showFormError("Please choose or type a category.");
    if (v.price == null || v.price <= 0) return showFormError("Please enter the regular price (more than £0).");
    const c = calcOffer(v);
    if (v.offerType !== "none") {
      if (v.offerValue == null) return showFormError(`Enter the ${v.offerType === "percent" ? "discount %" : "new price"}, or choose "No offer".`);
      if (!c.ok) return showFormError(c.warn);
    }

    const p = {
      id: editing ? editing.id : newId(v.shop, v.name),
      shop: v.shop, category: v.category, name: v.name,
      unit: v.unit || "each", price: round2(v.price), brand: v.brand || "Generic"
    };
    if (v.age18) p.age18 = true;
    if (v.featured) p.featured = true;
    if (v.offerType === "percent") p.discountPercent = v.offerValue;
    if (v.offerType === "price") p.salePrice = round2(v.offerValue);
    if (v.offerType !== "none" && v.until) p.discountUntil = v.until;

    // photo
    const oldPath = editing ? editing.image : null;
    if (formImg && formImg.blob) {
      const path = plannedPath(v);
      const old = pendingImages.get(path);
      if (old && old.url) URL.revokeObjectURL(old.url);
      pendingImages.set(path, { blob: formImg.blob, url: URL.createObjectURL(formImg.blob) });
      await idbPut("images", path, { blob: formImg.blob });
      p.image = path;
    } else if (formImg && formImg.existing) {
      p.image = formImg.existing;
    }

    if (editing) {
      const i = state.products.findIndex(x => x.id === editing.id);
      state.products[i] = p;
    } else {
      let at = -1;
      state.products.forEach((x, i) => { if (x.shop === p.shop && x.category === p.category) at = i; });
      if (at >= 0) state.products.splice(at + 1, 0, p); else state.products.push(p);
    }
    if (oldPath && oldPath !== p.image) cleanupPendingImage(oldPath);

    persist();
    if (formImg && formImg.url) { /* the pending copy holds its own URL */ URL.revokeObjectURL(formImg.url); }
    formImg = null;
    dlg.close();
    renderAll();
    toast(editing ? "Product updated" : "Product added");
  });

  /* ---------------- promotion tab ---------------- */
  const PR = { active: $("#promo-active"), message: $("#promo-message"), label: $("#promo-cta-label"), link: $("#promo-cta-link") };
  function loadPromoUI() {
    const p = state.promotion;
    PR.active.checked = !!p.active;
    PR.message.value = p.message || "";
    PR.label.value = p.ctaLabel || "";
    PR.link.value = p.ctaLink || "shop.html";
    if (!Array.from(PR.link.options).some(o => o.value === PR.link.value) && PR.link.value) {
      PR.link.insertAdjacentHTML("beforeend", `<option value="${esc(PR.link.value)}">${esc(PR.link.value)}</option>`);
      PR.link.value = p.ctaLink;
    }
    refreshPromoPreview();
  }
  function refreshPromoPreview() {
    $("#promo-count").textContent = PR.message.value.length;
    $("#promo-prev-text").textContent = PR.message.value || "Your message appears here";
    const cta = $("#promo-prev-cta");
    cta.textContent = PR.label.value;
    cta.style.display = PR.label.value ? "" : "none";
  }
  function onPromoInput() {
    const message = PR.message.value.trim();
    state.promotion = {
      active: PR.active.checked,
      id: "promo-" + hashStr(message + "|" + PR.link.value),
      message,
      ctaLabel: PR.label.value.trim(),
      ctaLink: PR.link.value
    };
    refreshPromoPreview();
    persist();
  }
  [PR.active, PR.message, PR.label, PR.link].forEach(el => { el.addEventListener("input", onPromoInput); el.addEventListener("change", onPromoInput); });

  /* ---------------- data.js generation ---------------- */
  function buildDataJs() {
    const q = JSON.stringify;
    const lines = [];
    lines.push(`/* ============================================================
   QUICK STOP — shop & product data
   Generated by the private Product Manager (admin/admin.html) on ${new Date().toLocaleString("en-GB")}.
   You can still edit this file by hand, but changes made in the Product
   Manager are the easiest way to keep it tidy.

   Product fields: id, shop, category, name, unit, price (regular, GBP),
   brand, age18, featured, image (path to a photo).
   Offers: EITHER discountPercent OR salePrice, plus optional discountUntil
   ("YYYY-MM-DD"); expired offers switch themselves off.
   ============================================================ */
`);
    lines.push(`/* Site-wide promotion (banner on every page + one-time popup on Home). */`);
    lines.push(`const PROMOTION = ${JSON.stringify(state.promotion, null, 2)};\n`);
    lines.push(`const SHOPS = ${JSON.stringify(SHOPS, null, 2)};\n`);
    lines.push(`/* Category -> placeholder photo. Categories not listed show an icon tile. */`);
    lines.push(`const CATEGORY_IMAGES = ${JSON.stringify(CATEGORY_IMAGES, null, 2)};\n`);
    lines.push(`const PRODUCTS = [`);
    const entries = [];
    SHOP_IDS.forEach(shopId => {
      const shopProducts = state.products.filter(p => p.shop === shopId);
      if (!shopProducts.length) return;
      entries.push(`  // ---------------- ${SHOPS[shopId].name.toUpperCase()} ----------------`);
      categoriesFor(shopId).forEach(cat => {
        const items = shopProducts.filter(p => p.category === cat);
        if (!items.length) return;
        entries.push(`  // ${cat}`);
        items.forEach(p => {
          const parts = [`id: ${q(p.id)}`, `shop: ${q(p.shop)}`, `category: ${q(p.category)}`, `name: ${q(p.name)}`,
            `unit: ${q(p.unit)}`, `price: ${Number(p.price).toFixed(2)}`, `brand: ${q(p.brand)}`];
          if (p.age18) parts.push("age18: true");
          if (p.featured) parts.push("featured: true");
          if (p.salePrice != null) parts.push(`salePrice: ${Number(p.salePrice).toFixed(2)}`);
          if (p.discountPercent != null) parts.push(`discountPercent: ${p.discountPercent}`);
          if (p.discountUntil) parts.push(`discountUntil: ${q(p.discountUntil)}`);
          if (p.image) parts.push(`image: ${q(p.image)}`);
          entries.push({ line: `  { ${parts.join(", ")} }` });
        });
        entries.push("");
      });
    });
    // join with commas between products only
    let out = [];
    const products = entries.filter(x => typeof x === "object");
    let seen = 0;
    entries.forEach(x => {
      if (typeof x === "object") { seen++; out.push(x.line + (seen < products.length ? "," : "")); }
      else out.push(x);
    });
    lines.push(out.join("\n"));
    lines.push(`];\n`);
    const js = lines.join("\n");
    // self-check: the file must parse and contain every product
    const n = new Function(js + "\n;return PRODUCTS.length;")();
    if (n !== state.products.length) throw new Error("Self-check failed: product count mismatch");
    return js;
  }

  function validateBeforePublish() {
    if (state.promotion.active && !state.promotion.message) return "The promotion is switched on but has no message (see the Promotion banner tab).";
    if (!state.products.length) return "There are no products to publish.";
    return null;
  }
  function referencedPending() {
    return state.products.filter(p => p.image && pendingImages.has(p.image)).map(p => p.image);
  }

  /* ---------------- publish: folder ---------------- */
  async function getRootHandle(forcePick) {
    let h = forcePick ? null : await idbGet("meta", "root");
    if (h) {
      let perm = await h.queryPermission({ mode: "readwrite" });
      if (perm !== "granted") perm = await h.requestPermission({ mode: "readwrite" });
      if (perm === "granted") return h;
    }
    h = await window.showDirectoryPicker({ mode: "readwrite", id: "qs-website" });
    await idbPut("meta", "root", h);
    return h;
  }
  async function writeFile(dir, name, data) {
    const fh = await dir.getFileHandle(name, { create: true });
    const w = await fh.createWritable();
    await w.write(data);
    await w.close();
  }
  async function getDir(root, parts) {
    let d = root;
    for (const p of parts) d = await d.getDirectoryHandle(p, { create: true });
    return d;
  }

  async function publishToFolder(forcePick) {
    const problem = validateBeforePublish();
    if (problem) return toast(problem, 4200);
    let js;
    try { js = buildDataJs(); } catch (e) { return toast("Couldn't build data.js: " + e.message, 5000); }

    let root;
    try { root = await getRootHandle(forcePick); }
    catch (e) { if (e && e.name === "AbortError") return; return toast("Couldn't open the folder: " + e.message, 5000); }

    try {
      let jsDir, dataHandle;
      try {
        jsDir = await root.getDirectoryHandle("js");
        dataHandle = await jsDir.getFileHandle("data.js");
      } catch (e) {
        await idbDel("meta", "root");
        return toast("That folder doesn't look like the QUICK STOP website (no js/data.js). Choose the folder that contains index.html.", 6000);
      }
      // backup the current file
      try {
        const oldText = await (await dataHandle.getFile()).text();
        const stamp = new Date().toISOString().replace(/[:T]/g, "-").slice(0, 19);
        const backups = await getDir(root, ["admin", "backups"]);
        await writeFile(backups, `data-${stamp}.js`, oldText);
      } catch (e) { /* backup is best-effort */ }

      // photos first, then data.js
      const paths = referencedPending();
      if (paths.length) {
        const imgDir = await getDir(root, ["images", "products"]);
        for (const path of paths) await writeFile(imgDir, path.split("/").pop(), pendingImages.get(path).blob);
      }
      await writeFile(jsDir, "data.js", js);

      // success: what we published is now the baseline
      paths.forEach(path => { const pi = pendingImages.get(path); if (pi) URL.revokeObjectURL(pi.url); pendingImages.delete(path); idbDel("images", path); });
      baseline = clone(state);
      bust = Date.now();
      persist();
      renderAll();
      showFolder(root.name);
      toast(`Published! Wrote data.js${paths.length ? " and " + paths.length + " photo(s)" : ""}. Now upload the website files (not the admin folder).`, 6500);
    } catch (e) {
      toast("Publish failed: " + (e && e.message ? e.message : e), 6000);
    }
  }

  /* ---------------- publish: ZIP fallback ---------------- */
  async function downloadZip() {
    const problem = validateBeforePublish();
    if (problem) return toast(problem, 4200);
    let js;
    try { js = buildDataJs(); } catch (e) { return toast("Couldn't build data.js: " + e.message, 5000); }
    const enc = new TextEncoder();
    const files = [{ name: "js/data.js", data: enc.encode(js) }];
    for (const path of referencedPending()) {
      files.push({ name: path, data: new Uint8Array(await pendingImages.get(path).blob.arrayBuffer()) });
    }
    const blob = QSZip.build(files);
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "quickstop-update-" + todayISO() + ".zip";
    document.body.appendChild(a);
    a.click();
    setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 1000);
    toast("ZIP downloaded — unzip it over your website folder (replace js and images), then upload.", 7000);
  }

  function showFolder(name) {
    const line = $("#folder-line");
    if (!HAS_FS || !name) { line.hidden = true; return; }
    line.hidden = false;
    line.innerHTML = `Publishing to folder: <strong>${esc(name)}</strong> <button type="button" id="change-folder">Change folder</button>`;
    $("#change-folder").addEventListener("click", () => publishFolderPickOnly());
  }
  async function publishFolderPickOnly() {
    try { const h = await getRootHandle(true); showFolder(h.name); toast("Folder set. Press Publish when ready."); }
    catch (e) { if (!e || e.name !== "AbortError") toast("Couldn't set folder"); }
  }

  $("#btn-publish").addEventListener("click", () => HAS_FS ? publishToFolder(false) : downloadZip());
  $("#btn-zip").addEventListener("click", downloadZip);
  $("#btn-discard").addEventListener("click", () => {
    if (!confirm("Throw away all unpublished changes and reload the products from js/data.js?")) return;
    pendingImages.forEach((v, k) => { URL.revokeObjectURL(v.url); idbDel("images", k); });
    pendingImages.clear();
    state = clone(baseline);
    selected.clear();
    persist(); loadPromoUI(); renderAll();
    toast("Changes discarded");
  });

  if (!HAS_FS) {
    $("#btn-publish").textContent = "Download update (ZIP)";
    $("#btn-zip").hidden = true;
  }

  /* ---------------- tabs ---------------- */
  $$(".adm-tab").forEach(t => t.addEventListener("click", () => {
    $$(".adm-tab").forEach(x => x.classList.toggle("active", x === t));
    ["products", "promo", "help"].forEach(id => { $("#tab-" + id).hidden = id !== t.dataset.tab; });
  }));

  /* ---------------- init ---------------- */
  function imageExists(path) {
    return new Promise(resolve => {
      const img = new Image();
      img.onload = () => resolve(true);
      img.onerror = () => resolve(false);
      img.src = "../" + path + "?probe=" + Date.now();
    });
  }

  async function init() {
    loadDraft();
    const stored = await idbAllImages();
    for (const [path, val] of stored) {
      if (val && val.blob) pendingImages.set(path, { blob: val.blob, url: URL.createObjectURL(val.blob) });
    }
    // drop pending photos that nothing uses, or that already exist on disk (published earlier via ZIP)
    for (const path of Array.from(pendingImages.keys())) {
      const usedNow = state.products.some(p => p.image === path);
      const usedByBaseline = baseline.products.some(p => p.image === path);
      if (!usedNow) { cleanupPendingImage(path); continue; }
      if (usedByBaseline && await imageExists(path)) {
        const pi = pendingImages.get(path); URL.revokeObjectURL(pi.url); pendingImages.delete(path); idbDel("images", path);
      }
    }
    buildFilterSelects();
    loadPromoUI();
    persist();
    renderAll();
    if (HAS_FS) {
      const h = await idbGet("meta", "root");
      if (h) showFolder(h.name);
    }
    if (dirty) toast("Restored your unpublished draft", 3200);
  }
  init();
})();
