/* ============================================================
   QUICK STOP — shop.html catalogue: one-line dropdown filter bar,
   search, sort, and the product grid. Relies on window.QS (shared.js).
   ============================================================ */

(function () {
  "use strict";

  const { ICONS, currentPrice, productCardHTML, bindProductCards } = QS;

  let activeShop = "all"; // all | newsbooze | essentials  (the "Seller" filter)
  let activeCategory = "all";
  let activeBrand = "all";
  let activePriceRange = "all";
  let sortBy = "default";
  let searchTerm = "";
  let hideAgeRestricted = false;

  const PRICE_RANGES = {
    under2: { label: "Under £2", test: p => p < 2 },
    "2to5": { label: "£2 – £5", test: p => p >= 2 && p <= 5 },
    "5to10": { label: "£5 – £10", test: p => p > 5 && p <= 10 },
    over10: { label: "Over £10", test: p => p > 10 }
  };

  const $ = sel => document.querySelector(sel);
  const searchInput = $("#search-input");
  const shopSelect = $("#filter-shop");
  const categorySelect = $("#filter-category");
  const brandSelect = $("#filter-brand");
  const priceSelect = $("#filter-price");
  const sortSelect = $("#filter-sort");
  const hideAgeToggleEl = $("#hide-age-toggle");
  const resultCountEl = $("#result-count");
  const productGridEl = $("#product-grid");
  const activeFiltersEl = $("#active-filters");

  /* ---------------- Filter option builders ---------------- */
  function categoriesForShop(shopId) {
    const items = shopId === "all" ? PRODUCTS : PRODUCTS.filter(p => p.shop === shopId);
    const seen = [];
    items.forEach(p => { if (!seen.includes(p.category)) seen.push(p.category); });
    return seen;
  }

  function poolBeforeBrand() {
    let items = activeShop === "all" ? PRODUCTS.slice() : PRODUCTS.filter(p => p.shop === activeShop);
    if (activeCategory !== "all") items = items.filter(p => p.category === activeCategory);
    if (searchTerm.trim()) {
      const q = searchTerm.trim().toLowerCase();
      items = items.filter(p => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q));
    }
    return items;
  }

  function getFilteredProducts() {
    let items = poolBeforeBrand();
    if (activeBrand !== "all") items = items.filter(p => p.brand === activeBrand);
    if (activePriceRange !== "all") items = items.filter(p => PRICE_RANGES[activePriceRange].test(currentPrice(p)));
    if (hideAgeRestricted) items = items.filter(p => !p.age18);

    if (sortBy === "price-asc") items = items.slice().sort((a, b) => currentPrice(a) - currentPrice(b));
    else if (sortBy === "price-desc") items = items.slice().sort((a, b) => currentPrice(b) - currentPrice(a));
    else if (sortBy === "name-asc") items = items.slice().sort((a, b) => a.name.localeCompare(b.name));

    return items;
  }

  function fillSelect(selectEl, options, currentValue) {
    selectEl.innerHTML = options.map(o => `<option value="${o.value}" ${o.value === currentValue ? "selected" : ""}>${o.label}</option>`).join("");
  }

  function rebuildShopSelect() {
    const opts = [{ value: "all", label: "All Shops" }, ...Object.values(SHOPS).map(s => ({ value: s.id, label: s.name }))];
    fillSelect(shopSelect, opts, activeShop);
  }

  function rebuildCategorySelect() {
    const cats = categoriesForShop(activeShop);
    if (activeCategory !== "all" && !cats.includes(activeCategory)) activeCategory = "all";
    const opts = [{ value: "all", label: "All Categories" }, ...cats.map(c => ({ value: c, label: c }))];
    fillSelect(categorySelect, opts, activeCategory);
  }

  function rebuildBrandSelect() {
    const pool = poolBeforeBrand();
    const brands = [...new Set(pool.map(p => p.brand))].sort((a, b) => a.localeCompare(b));
    if (activeBrand !== "all" && !brands.includes(activeBrand)) activeBrand = "all";
    const opts = [{ value: "all", label: "All Brands" }, ...brands.map(b => ({ value: b, label: b }))];
    fillSelect(brandSelect, opts, activeBrand);
  }

  function rebuildPriceSelect() {
    const opts = [{ value: "all", label: "Any Price" }, ...Object.entries(PRICE_RANGES).map(([id, r]) => ({ value: id, label: r.label }))];
    fillSelect(priceSelect, opts, activePriceRange);
  }

  /* ---------------- Active filter pills (removable, under the bar) ---------------- */
  function renderActiveFilters() {
    const pills = [];
    if (activeShop !== "all") pills.push({ key: "shop", label: SHOPS[activeShop].shortName });
    if (activeCategory !== "all") pills.push({ key: "category", label: activeCategory });
    if (activeBrand !== "all") pills.push({ key: "brand", label: activeBrand });
    if (activePriceRange !== "all") pills.push({ key: "price", label: PRICE_RANGES[activePriceRange].label });
    if (searchTerm.trim()) pills.push({ key: "search", label: `"${searchTerm.trim()}"` });
    if (hideAgeRestricted) pills.push({ key: "age", label: "Hiding 18+" });

    if (!pills.length) { activeFiltersEl.innerHTML = ""; activeFiltersEl.style.display = "none"; return; }
    activeFiltersEl.style.display = "flex";
    activeFiltersEl.innerHTML = pills.map(p => `<button class="active-filter-pill" data-clear="${p.key}">${p.label} ${ICONS.close}</button>`).join("")
      + `<button class="clear-all-link" id="clear-all-filters">Clear all</button>`;

    activeFiltersEl.querySelectorAll("[data-clear]").forEach(btn => {
      btn.addEventListener("click", () => {
        const key = btn.dataset.clear;
        if (key === "shop") activeShop = "all";
        if (key === "category") activeCategory = "all";
        if (key === "brand") activeBrand = "all";
        if (key === "price") activePriceRange = "all";
        if (key === "search") { searchTerm = ""; searchInput.value = ""; }
        if (key === "age") { hideAgeRestricted = false; hideAgeToggleEl.classList.remove("active"); }
        syncAndRender();
      });
    });
    $("#clear-all-filters").addEventListener("click", clearAllFilters);
  }

  function clearAllFilters() {
    activeShop = "all"; activeCategory = "all"; activeBrand = "all"; activePriceRange = "all";
    searchTerm = ""; searchInput.value = "";
    hideAgeRestricted = false; hideAgeToggleEl.classList.remove("active");
    syncAndRender();
  }

  function syncAndRender() {
    rebuildShopSelect();
    rebuildCategorySelect();
    rebuildBrandSelect();
    rebuildPriceSelect();
    renderProducts();
  }

  /* ---------------- Product grid ---------------- */
  function renderProducts() {
    renderActiveFilters();
    const items = getFilteredProducts();
    resultCountEl.textContent = items.length === 1 ? "1 product found" : `${items.length} products found`;

    if (!items.length) {
      productGridEl.innerHTML = `<div class="empty-state">${ICONS.search}<p>No products match your filters. Try clearing a filter or search term.</p></div>`;
      return;
    }

    const grouped = sortBy === "default" && activeCategory === "all";
    let html = "";
    let lastCategory = null;
    items.forEach(p => {
      if (grouped && p.category !== lastCategory) {
        html += `<div class="category-heading">${p.category}</div>`;
        lastCategory = p.category;
      }
      html += productCardHTML(p, { showShopBadge: activeShop === "all" });
    });
    productGridEl.innerHTML = html;
    bindProductCards(productGridEl);
  }

  /* ---------------- Wire up filter bar ---------------- */
  shopSelect.addEventListener("change", (e) => { activeShop = e.target.value; activeCategory = "all"; activeBrand = "all"; syncAndRender(); });
  categorySelect.addEventListener("change", (e) => { activeCategory = e.target.value; activeBrand = "all"; syncAndRender(); });
  brandSelect.addEventListener("change", (e) => { activeBrand = e.target.value; syncAndRender(); });
  priceSelect.addEventListener("change", (e) => { activePriceRange = e.target.value; syncAndRender(); });
  sortSelect.addEventListener("change", (e) => { sortBy = e.target.value; renderProducts(); });
  searchInput.addEventListener("input", (e) => { searchTerm = e.target.value; syncAndRender(); });
  hideAgeToggleEl.addEventListener("click", () => {
    hideAgeRestricted = !hideAgeRestricted;
    hideAgeToggleEl.classList.toggle("active", hideAgeRestricted);
    renderProducts();
  });

  /* ---------------- Deep link from Home page (?shop=newsbooze&category=Wines) ---------------- */
  const params = new URLSearchParams(window.location.search);
  const shopParam = params.get("shop");
  if (shopParam && SHOPS[shopParam]) activeShop = shopParam;
  const categoryParam = params.get("category");
  if (categoryParam && categoriesForShop(activeShop).includes(categoryParam)) activeCategory = categoryParam;
  const searchParam = params.get("search");
  if (searchParam) { searchTerm = searchParam; searchInput.value = searchParam; }

  /* ---------------- Init ---------------- */
  rebuildShopSelect();
  rebuildCategorySelect();
  rebuildBrandSelect();
  rebuildPriceSelect();
  renderProducts();
})();
