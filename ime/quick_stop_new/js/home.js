/* ============================================================
   QUICK STOP — index.html (Home) page-specific rendering:
   the two shop cards (open-now status, call, directions),
   featured products and browse-by-category tiles.
   ============================================================ */

(function () {
  "use strict";
  const { ICONS, CATEGORY_ICON_FALLBACK, esc, starRow, pricing, productCardHTML } = QS;

  /* ---------------- Search (hands off to shop.html?search=...) ---------------- */
  const searchForm = document.getElementById("home-search-form");
  if (searchForm) {
    searchForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const term = document.getElementById("home-search-input").value.trim();
      window.location.href = term ? `shop.html?search=${encodeURIComponent(term)}` : "shop.html";
    });
  }

  /* ---------------- Shop cards ---------------- */
  const shopGrid = document.getElementById("shop-grid");
  if (shopGrid) {
    shopGrid.innerHTML = Object.values(SHOPS).map(shop => `
      <div class="shop-card">
        <div class="shop-card-top">
          <div class="shop-icon ${shop.id === "newsbooze" ? "nb" : "es"}">${shop.id === "newsbooze" ? ICONS.bag : ICONS.store}</div>
          <div class="shop-rating">${starRow(shop.rating)} ${shop.rating.toFixed(1)} <span style="opacity:.6;font-weight:600">(${shop.reviewCount})</span></div>
        </div>
        <div>
          <h3>${esc(shop.name)}</h3>
          <p class="shop-tagline">${esc(shop.tagline)}</p>
        </div>
        <span data-open-status="${esc(shop.id)}" hidden></span>
        <div class="shop-meta">
          <div>${ICONS.pin}<span>${esc(shop.address)}</span></div>
          <div>${ICONS.clock}<span>${esc(shop.hours)}</span></div>
        </div>
        <div class="shop-card-actions">
          <a class="btn btn-shop" href="${esc(shop.phoneHref)}">${ICONS.phone} Call</a>
          <a class="btn btn-outline" href="${esc(shop.mapsUrl)}" target="_blank" rel="noopener">${ICONS.directions} Directions</a>
        </div>
        <a class="shop-card-link" href="shop.html?shop=${esc(shop.id)}">See what's on the shelves →</a>
      </div>
    `).join("");
  }

  /* ---------------- Featured products ---------------- */
  const featuredGrid = document.getElementById("featured-grid");
  if (featuredGrid) {
    // Products on offer first, then the ones flagged `featured`.
    const onOffer = PRODUCTS.filter(p => pricing(p).onSale);
    const flagged = PRODUCTS.filter(p => p.featured && !pricing(p).onSale);
    const featured = [...onOffer, ...flagged].slice(0, 8);
    featuredGrid.innerHTML = featured.map(p => productCardHTML(p, { showShopBadge: true })).join("");
  }

  /* ---------------- Browse by category ---------------- */
  const categoryGrid = document.getElementById("category-tile-grid");
  if (categoryGrid) {
    const seen = [];
    PRODUCTS.forEach(p => { if (!seen.includes(p.category)) seen.push(p.category); });
    categoryGrid.innerHTML = seen.map(cat => {
      const iconKey = CATEGORY_ICON_FALLBACK[cat] || "bag";
      const count = PRODUCTS.filter(p => p.category === cat).length;
      return `
        <a class="category-tile" href="shop.html?category=${encodeURIComponent(cat)}">
          <span class="category-tile-icon">${ICONS[iconKey] || ICONS.bag}</span>
          <span class="category-tile-name">${esc(cat)}</span>
          <span class="category-tile-count">${count} item${count > 1 ? "s" : ""}</span>
        </a>
      `;
    }).join("");
  }
})();
