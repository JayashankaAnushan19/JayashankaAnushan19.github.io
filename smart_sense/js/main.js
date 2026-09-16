/* ==========================================================================
   Smart Sense — site behaviour: nav, product rendering, filters, accordion
   ========================================================================== */

function productCardHTML(p) {
  const badge = p.badge
    ? `<span class="product-badge ${p.badge === "Sale" ? "sale" : ""}">${p.badge}</span>`
    : "";
  const oldPrice = p.oldPrice
    ? `<span class="old">${formatRs(p.oldPrice)}</span>`
    : "";

  return `
    <div class="product-card" data-category="${p.category}">
      <div class="product-media ${p.colorClass}">
        ${badge}
        <img src="${p.image}" alt="${p.name}" loading="lazy">
      </div>
      <div class="product-body">
        <span class="product-cat">${CATEGORY_LABELS[p.category] || p.category}</span>
        <h3 class="product-title">${p.name}</h3>
        <p class="product-desc">${p.desc}</p>
        <div class="product-price">${formatRs(p.price)} ${oldPrice}</div>
        <div class="product-actions">
          <button type="button" class="btn btn-primary btn-block btn-sm" data-add-to-cart="${p.id}">
            Add to Cart
          </button>
        </div>
      </div>
    </div>`;
}

function renderProductGrid(targetId, list) {
  const el = document.getElementById(targetId);
  if (!el) return;
  el.innerHTML = list.map(productCardHTML).join("");
  bindAddToCartButtons(el);
}

function bindAddToCartButtons(scope) {
  scope.querySelectorAll("[data-add-to-cart]").forEach((btn) => {
    btn.addEventListener("click", () => addToCart(btn.getAttribute("data-add-to-cart")));
  });
}

document.addEventListener("DOMContentLoaded", () => {
  /* ---- mobile nav ---- */
  const toggle = document.getElementById("menuToggle");
  const navLinks = document.getElementById("navLinks");
  const navOverlay = document.getElementById("navOverlay");

  const closeMenu = () => {
    navLinks?.classList.remove("open");
    navOverlay?.classList.remove("open");
  };

  toggle?.addEventListener("click", () => {
    navLinks?.classList.toggle("open");
    navOverlay?.classList.toggle("open");
  });
  navOverlay?.addEventListener("click", closeMenu);
  navLinks?.querySelectorAll("a").forEach((a) => a.addEventListener("click", closeMenu));

  /* ---- footer year ---- */
  document.querySelectorAll("[data-year]").forEach((el) => {
    el.textContent = new Date().getFullYear();
  });

  /* ---- featured products (home page) ---- */
  const featuredGrid = document.getElementById("featuredGrid");
  if (featuredGrid) {
    const featured = PRODUCTS.filter((p) => p.badge).slice(0, 4);
    renderProductGrid("featuredGrid", featured.length ? featured : PRODUCTS.slice(0, 4));
  }

  /* ---- shop page: full grid + filters ---- */
  const shopGrid = document.getElementById("shopGrid");
  if (shopGrid) {
    const filterBar = document.getElementById("filterBar");

    const applyFilter = (cat) => {
      filterBar?.querySelectorAll(".filter-btn").forEach((b) => {
        b.classList.toggle("active", b.getAttribute("data-filter") === cat);
      });
      const list = cat === "all" ? PRODUCTS : PRODUCTS.filter((p) => p.category === cat);
      renderProductGrid("shopGrid", list);
    };

    const urlCat = new URLSearchParams(window.location.search).get("category");
    const validCats = Object.keys(CATEGORY_LABELS);
    applyFilter(validCats.includes(urlCat) ? urlCat : "all");

    filterBar?.addEventListener("click", (e) => {
      const btn = e.target.closest(".filter-btn");
      if (!btn) return;
      const cat = btn.getAttribute("data-filter");
      applyFilter(cat);
      const url = new URL(window.location);
      if (cat === "all") url.searchParams.delete("category");
      else url.searchParams.set("category", cat);
      window.history.replaceState({}, "", url);
    });
  }

  /* ---- FAQ accordion ---- */
  document.querySelectorAll(".accordion-item").forEach((item) => {
    const q = item.querySelector(".accordion-q");
    const a = item.querySelector(".accordion-a");
    q?.addEventListener("click", () => {
      const isOpen = item.classList.contains("open");
      document.querySelectorAll(".accordion-item").forEach((i) => {
        i.classList.remove("open");
        i.querySelector(".accordion-a").style.maxHeight = null;
      });
      if (!isOpen) {
        item.classList.add("open");
        a.style.maxHeight = a.scrollHeight + "px";
      }
    });
  });
});
