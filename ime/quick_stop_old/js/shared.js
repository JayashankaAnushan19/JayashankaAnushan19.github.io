/* ============================================================
   QUICK STOP — shared logic (cart, checkout, age gate, WhatsApp FAB)
   Loaded on every page. Exposes window.QS for page-specific scripts
   (js/catalogue.js, js/home.js) to reuse icons, cart actions, etc.
   ============================================================ */

const QS = (function () {
  "use strict";

  /* ---------------- Icons ---------------- */
  const ICONS = {
    cart: '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>',
    star: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z"/></svg>',
    pin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>',
    clock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>',
    phone: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>',
    search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>',
    plus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>',
    minus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M5 12h14"/></svg>',
    trash: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0-1 14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2L4 6"/></svg>',
    close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>',
    check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>',
    whatsapp: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.28-1.38a9.9 9.9 0 0 0 4.76 1.21h.01c5.46 0 9.9-4.45 9.9-9.91C21.96 6.45 17.5 2 12.04 2zm5.8 14.02c-.24.68-1.38 1.3-1.9 1.35-.5.06-1.05.28-3.5-.73-2.96-1.22-4.86-4.18-5-4.38-.15-.2-1.2-1.6-1.2-3.05 0-1.45.76-2.16 1.03-2.46.27-.3.6-.37.8-.37.2 0 .4 0 .58.01.19.01.44-.07.68.53.24.6.83 2.06.9 2.2.07.15.12.32.02.52-.1.2-.15.32-.3.5-.15.17-.3.38-.44.51-.15.15-.3.3-.13.6.17.3.76 1.26 1.63 2.04 1.12 1 2.06 1.31 2.36 1.46.3.15.48.13.65-.08.18-.2.75-.87.95-1.17.2-.3.4-.25.65-.15.27.1 1.7.8 1.99.95.3.15.49.22.56.35.08.13.08.75-.16 1.42z"/></svg>',
    shield: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>',
    bag: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>',
    truck: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="3" width="15" height="13"/><path d="M16 8h4l3 3v5h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>',
    store: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l1-5h16l1 5"/><path d="M4 9v10a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1V9"/><path d="M9 20v-6h6v6"/></svg>',
    arrowLeft: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>',
    alert: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><path d="M12 9v4M12 17h.01"/></svg>',
    heart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z"/></svg>',
    filter: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z"/></svg>',
    snowflake: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v20M5 5l14 14M19 5 5 19M2 12h20"/></svg>',
    droplet: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2.69s6 6.13 6 10.44a6 6 0 1 1-12 0c0-4.31 6-10.44 6-10.44z"/></svg>',
    sparkle: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M18.4 5.6l-2.8 2.8M8.4 15.6l-2.8 2.8"/></svg>',
    basket: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 10h14l-1.5 9.5a2 2 0 0 1-2 1.5H8.5a2 2 0 0 1-2-1.5L5 10z"/><path d="M9 10V7a3 3 0 0 1 6 0v3"/></svg>',
    cup: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 8h13a3 3 0 0 1 0 6h-1"/><path d="M4 8v9a2 2 0 0 0 2 2h7a2 2 0 0 0 2-2V8"/><path d="M8 2c-.5 1 -1.5 1.5-1 3M12 2c-.5 1-1.5 1.5-1 3"/></svg>',
    chevron: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>',
    menu: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18M3 12h18M3 18h18"/></svg>'
  };

  /* Fallback icon for categories without a photo (see CATEGORY_IMAGES in data.js) */
  const CATEGORY_ICON_FALLBACK = {
    "Soft Drinks & Mixers": "cup",
    "Milk, Eggs & Dairy": "droplet",
    "Store Cupboard & Groceries": "basket",
    "Household & Cleaning": "sparkle",
    "Frozen Foods": "snowflake"
  };

  function starRow(rating) {
    const full = Math.round(rating);
    let out = "";
    for (let i = 0; i < 5; i++) {
      out += `<span style="opacity:${i < full ? 1 : 0.3}">${ICONS.star}</span>`;
    }
    return out;
  }

  function money(n) { return "£" + n.toFixed(2); }
  function productById(id) { return PRODUCTS.find(p => p.id === id); }
  function productImage(p) { return p.image || CATEGORY_IMAGES[p.category] || null; }

  /* Discounts: a product has a regular `price`, and optionally either
     `salePrice` or `discountPercent`, plus an optional `discountUntil`
     ("YYYY-MM-DD"). Expired offers switch off automatically. */
  function pricing(p) {
    const regular = p.price;
    let current = regular;
    let onSale = false;
    if (p.salePrice != null || p.discountPercent != null) {
      let active = true;
      if (p.discountUntil) active = new Date() <= new Date(p.discountUntil + "T23:59:59");
      if (active) {
        const candidate = p.salePrice != null ? p.salePrice : regular * (1 - p.discountPercent / 100);
        const rounded = Math.round(candidate * 100) / 100;
        if (rounded < regular) { current = rounded; onSale = true; }
      }
    }
    return {
      regular, current, onSale,
      percent: onSale ? Math.round((1 - current / regular) * 100) : 0,
      until: onSale ? (p.discountUntil || null) : null
    };
  }
  function currentPrice(p) { return pricing(p).current; }

  function formatShortDate(iso) {
    const d = new Date(iso + "T00:00:00");
    return d.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
  }

  /* One product card, used on Home (featured) and Shop pages. */
  function productCardHTML(p, opts) {
    opts = opts || {};
    const shop = SHOPS[p.shop];
    const pr = pricing(p);
    const img = productImage(p);
    const badge = pr.onSale ? `<span class="discount-badge">${pr.percent}% OFF</span>` : "";
    let media;
    if (img) {
      media = `<div class="product-card-media"><img src="${img}" alt="${p.name}" loading="lazy">${badge}</div>`;
    } else {
      const iconKey = CATEGORY_ICON_FALLBACK[p.category] || "bag";
      media = `<div class="product-card-media product-card-media-icon">${ICONS[iconKey] || ICONS.bag}${badge}</div>`;
    }
    const tag = opts.showShopBadge
      ? `<span class="shop-badge ${shop.badgeClass}">${shop.shortName}</span>`
      : `<span class="brand-tag">${p.brand}</span>`;
    const priceHTML = pr.onSale
      ? `<span class="product-price product-price-sale">${money(pr.current)}</span><span class="product-price-was">${money(pr.regular)}</span>`
      : `<span class="product-price">${money(pr.current)}</span>`;
    const ends = pr.until ? `<span class="sale-ends">Offer ends ${formatShortDate(pr.until)}</span>` : "";
    return `
      <div class="product-card" data-product="${p.id}">
        ${media}
        <div class="product-card-top">
          ${tag}
          ${p.age18 ? `<span class="age-badge">18+</span>` : ""}
        </div>
        <p class="product-name">${p.name}</p>
        <p class="product-unit">${p.unit}</p>
        <div class="product-card-bottom">
          <div class="product-price-wrap">${priceHTML}${ends}</div>
          <div class="qty-stepper">
            <button data-step="minus" aria-label="Decrease quantity">${ICONS.minus}</button>
            <span data-qty-display>1</span>
            <button data-step="plus" aria-label="Increase quantity">${ICONS.plus}</button>
          </div>
        </div>
        <button class="add-btn" data-add>${ICONS.cart} Add to basket</button>
      </div>
    `;
  }

  function bindProductCards(container) {
    container.querySelectorAll(".product-card").forEach(card => {
      const id = card.dataset.product;
      const qtyDisplay = card.querySelector("[data-qty-display]");
      let qty = 1;
      card.querySelector('[data-step="minus"]').addEventListener("click", () => {
        qty = Math.max(1, qty - 1);
        qtyDisplay.textContent = qty;
      });
      card.querySelector('[data-step="plus"]').addEventListener("click", () => {
        qty = Math.min(20, qty + 1);
        qtyDisplay.textContent = qty;
      });
      card.querySelector("[data-add]").addEventListener("click", () => {
        attemptAdd(id, qty);
        qty = 1;
        qtyDisplay.textContent = "1";
      });
    });
  }

  /* ---------------- State ---------------- */
  const CART_KEY = "quickstop_cart_v1";
  const AGE_KEY = "quickstop_age_ok";

  let cart = loadCart(); // { productId: qty }
  let cartView = "cart"; // cart | checkout | send
  let sentShops = new Set();
  let pendingAgeProduct = null; // {id, qty, onAdded} waiting on age confirm
  let customerInfo = { name: "", phone: "", orderType: "Collection", address: "", notes: "" };

  function loadCart() {
    try {
      const raw = localStorage.getItem(CART_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch (e) { return {}; }
  }
  function saveCart() {
    try { localStorage.setItem(CART_KEY, JSON.stringify(cart)); } catch (e) {}
  }
  function isAgeVerified() {
    try { return localStorage.getItem(AGE_KEY) === "1"; } catch (e) { return false; }
  }
  function setAgeVerified() {
    try { localStorage.setItem(AGE_KEY, "1"); } catch (e) {}
  }

  /* ---------------- DOM refs (present on every page) ---------------- */
  const $ = sel => document.querySelector(sel);
  const cartCountEl = $("#cart-count");
  const cartDrawer = $("#cart-drawer");
  const cartOverlay = $("#cart-overlay");
  const cartBody = $("#cart-body");
  const cartFooter = $("#cart-footer");
  const cartTitle = $("#cart-title");
  const ageModal = $("#age-modal");
  const toastEl = $("#toast");
  const yearEl = $("#year");
  const waFab = $("#whatsapp-fab");
  const waFabPopover = $("#whatsapp-fab-popover");

  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------------- Cart core ---------------- */
  function updateCartCount() {
    if (!cartCountEl) return;
    const total = Object.values(cart).reduce((a, b) => a + b, 0);
    cartCountEl.textContent = total;
    cartCountEl.style.display = total > 0 ? "inline-flex" : "none";
  }

  function attemptAdd(id, qty, btnEl) {
    const product = productById(id);
    if (product.age18 && !isAgeVerified()) {
      pendingAgeProduct = { id, qty, btnEl };
      openAgeModal();
      return;
    }
    addToCart(id, qty, btnEl);
  }

  function addToCart(id, qty, btnEl) {
    cart[id] = (cart[id] || 0) + qty;
    saveCart();
    updateCartCount();
    if (cartView === "cart") renderCartBody();
    showToast(`Added ${productById(id).name} to basket`);
  }

  /* ---------------- Age gate ---------------- */
  function openAgeModal() { if (ageModal) ageModal.classList.add("open"); }
  function closeAgeModal() { if (ageModal) ageModal.classList.remove("open"); pendingAgeProduct = null; }

  if ($("#age-confirm")) {
    $("#age-confirm").addEventListener("click", () => {
      setAgeVerified();
      ageModal.classList.remove("open");
      if (pendingAgeProduct) {
        addToCart(pendingAgeProduct.id, pendingAgeProduct.qty, pendingAgeProduct.btnEl);
        pendingAgeProduct = null;
      }
    });
  }
  if ($("#age-cancel")) $("#age-cancel").addEventListener("click", closeAgeModal);

  /* ---------------- Cart drawer ---------------- */
  function groupCartByShop() {
    const groups = {};
    Object.entries(cart).forEach(([id, qty]) => {
      if (qty <= 0) return;
      const product = productById(id);
      if (!product) return;
      if (!groups[product.shop]) groups[product.shop] = [];
      groups[product.shop].push({ product, qty });
    });
    return groups;
  }

  function cartGrandTotal() {
    return Object.entries(cart).reduce((sum, [id, qty]) => {
      const product = productById(id);
      return product ? sum + currentPrice(product) * qty : sum;
    }, 0);
  }

  function openCart() {
    cartView = "cart";
    renderCartBody();
    cartDrawer.classList.add("open");
    cartOverlay.classList.add("open");
    document.body.classList.add("cart-open");
  }
  function closeCart() {
    cartDrawer.classList.remove("open");
    cartOverlay.classList.remove("open");
    document.body.classList.remove("cart-open");
  }

  function renderCartBody() {
    if (cartView === "cart") renderCartListView();
    else if (cartView === "checkout") renderCheckoutFormView();
    else if (cartView === "send") renderSendView();
  }

  function renderCartListView() {
    cartTitle.textContent = "Your Basket";
    const groups = groupCartByShop();
    const shopIds = Object.keys(groups);

    if (!shopIds.length) {
      cartBody.innerHTML = `<div class="cart-empty">${ICONS.cart}<p>Your basket is empty.<br><a href="shop.html">Browse the shops</a> and add some items.</p></div>`;
      cartFooter.innerHTML = "";
      return;
    }

    let html = "";
    shopIds.forEach(shopId => {
      const shop = SHOPS[shopId];
      const items = groups[shopId];
      const subtotal = items.reduce((s, it) => s + currentPrice(it.product) * it.qty, 0);
      html += `<div class="cart-shop-group">
        <h4><span class="dot ${shopId === "newsbooze" ? "dot-nb" : "dot-es"}"></span>${shop.name}</h4>`;
      items.forEach(it => {
        html += `
          <div class="cart-item" data-cart-item="${it.product.id}">
            <div class="cart-item-info">
              <p class="name">${it.product.name}</p>
              <span class="unit">${it.product.unit}</span>
            </div>
            <div class="qty-stepper">
              <button data-cart-step="minus" aria-label="Decrease">${ICONS.minus}</button>
              <span>${it.qty}</span>
              <button data-cart-step="plus" aria-label="Increase">${ICONS.plus}</button>
            </div>
            <span class="cart-item-price">${money(currentPrice(it.product) * it.qty)}</span>
            <button class="cart-item-remove" data-cart-remove aria-label="Remove">${ICONS.trash}</button>
          </div>`;
      });
      html += `<div class="cart-shop-subtotal"><span>Subtotal</span><span>${money(subtotal)}</span></div></div>`;
    });
    cartBody.innerHTML = html;

    cartBody.querySelectorAll("[data-cart-item]").forEach(row => {
      const id = row.dataset.cartItem;
      row.querySelector('[data-cart-step="minus"]').addEventListener("click", () => {
        cart[id] = Math.max(0, (cart[id] || 0) - 1);
        if (cart[id] === 0) delete cart[id];
        saveCart(); updateCartCount(); renderCartListView();
      });
      row.querySelector('[data-cart-step="plus"]').addEventListener("click", () => {
        cart[id] = (cart[id] || 0) + 1;
        saveCart(); updateCartCount(); renderCartListView();
      });
      row.querySelector("[data-cart-remove]").addEventListener("click", () => {
        delete cart[id];
        saveCart(); updateCartCount(); renderCartListView();
      });
    });

    const grand = cartGrandTotal();
    cartFooter.innerHTML = `
      <div class="cart-grand-total"><span>Total</span><span>${money(grand)}</span></div>
      <button class="btn checkout-btn" id="go-checkout">Checkout</button>
      <button class="clear-link" id="clear-cart">Clear basket</button>
    `;
    $("#go-checkout").addEventListener("click", () => { cartView = "checkout"; renderCartBody(); });
    $("#clear-cart").addEventListener("click", () => {
      cart = {}; saveCart(); updateCartCount(); renderCartListView();
    });
  }

  function renderCheckoutFormView() {
    cartTitle.textContent = "Your Details";
    const groups = groupCartByShop();
    const hasAgeItems = Object.values(groups).flat().some(it => it.product.age18);

    cartBody.innerHTML = `
      <button class="back-link" id="back-to-cart">${ICONS.arrowLeft} Back to basket</button>
      <div class="checkout-form">
        <div class="form-field">
          <label for="cf-name">Your name</label>
          <input id="cf-name" type="text" placeholder="e.g. Priya Fernando" value="${customerInfo.name}">
        </div>
        <div class="form-field">
          <label for="cf-phone">Contact number</label>
          <input id="cf-phone" type="tel" placeholder="e.g. 07xxx xxxxxx" value="${customerInfo.phone}">
        </div>
        <div class="form-field">
          <label>Collection or delivery?</label>
          <div class="radio-row">
            <label class="radio-pill ${customerInfo.orderType === "Collection" ? "active" : ""}">
              <input type="radio" name="order-type" value="Collection" ${customerInfo.orderType === "Collection" ? "checked" : ""}> In-store Collection
            </label>
            <label class="radio-pill ${customerInfo.orderType === "Delivery" ? "active" : ""}">
              <input type="radio" name="order-type" value="Delivery" ${customerInfo.orderType === "Delivery" ? "checked" : ""}> Local Delivery
            </label>
          </div>
        </div>
        <div class="form-field" id="address-field" style="${customerInfo.orderType === "Delivery" ? "" : "display:none"}">
          <label for="cf-address">Delivery address</label>
          <textarea id="cf-address" placeholder="House number, street, postcode">${customerInfo.address}</textarea>
        </div>
        <div class="form-field">
          <label for="cf-notes">Order notes (optional)</label>
          <textarea id="cf-notes" placeholder="Any substitutions, preferred time, etc.">${customerInfo.notes}</textarea>
        </div>
        ${hasAgeItems ? `<div class="age-note">${ICONS.alert}<span>Your basket contains age-restricted (18+) products. Valid ID may be requested on collection or delivery.</span></div>` : ""}
        <button class="btn checkout-btn" id="review-order">Review &amp; Send Order</button>
      </div>
    `;

    $("#back-to-cart").addEventListener("click", () => { cartView = "cart"; renderCartBody(); });
    document.querySelectorAll('input[name="order-type"]').forEach(r => {
      r.addEventListener("change", (e) => {
        customerInfo.orderType = e.target.value;
        renderCheckoutFormView();
      });
    });
    $("#review-order").addEventListener("click", () => {
      customerInfo.name = $("#cf-name").value.trim();
      customerInfo.phone = $("#cf-phone").value.trim();
      customerInfo.address = customerInfo.orderType === "Delivery" ? $("#cf-address").value.trim() : "";
      customerInfo.notes = $("#cf-notes").value.trim();

      if (!customerInfo.name || !customerInfo.phone) {
        showToast("Please add your name and contact number");
        return;
      }
      if (customerInfo.orderType === "Delivery" && !customerInfo.address) {
        showToast("Please add a delivery address");
        return;
      }
      sentShops = new Set();
      cartView = "send";
      renderCartBody();
    });
    cartFooter.innerHTML = "";
  }

  function buildWhatsAppMessage(shopId, items) {
    const shop = SHOPS[shopId];
    const subtotal = items.reduce((s, it) => s + currentPrice(it.product) * it.qty, 0);
    const hasAge = items.some(it => it.product.age18);
    const lines = [];
    lines.push(`New order — ${shop.name}`);
    lines.push("");
    lines.push(`Customer: ${customerInfo.name}`);
    lines.push(`Phone: ${customerInfo.phone}`);
    lines.push(`Order type: ${customerInfo.orderType}`);
    if (customerInfo.orderType === "Delivery") lines.push(`Address: ${customerInfo.address}`);
    lines.push("");
    lines.push("Items:");
    items.forEach(it => lines.push(`${it.qty} x ${it.product.name} (${it.product.unit}) — ${money(currentPrice(it.product) * it.qty)}`));
    lines.push("");
    lines.push(`Subtotal: ${money(subtotal)}`);
    if (customerInfo.notes) lines.push(`Notes: ${customerInfo.notes}`);
    if (hasAge) lines.push("Note: basket includes 18+ products, ID may be requested.");
    lines.push("");
    lines.push("Order sent via the QUICK STOP website.");
    return lines.join("\n");
  }

  function renderSendView() {
    cartTitle.textContent = "Send Your Order";
    const groups = groupCartByShop();
    const shopIds = Object.keys(groups);
    const multi = shopIds.length > 1;

    let html = `<button class="back-link" id="back-to-form">${ICONS.arrowLeft} Edit details</button>`;
    if (multi) {
      html += `<p style="font-size:13px;color:var(--ink-500);margin:0 0 14px;">Your basket has items from both shops — send a separate WhatsApp message to each so the right shop gets your order.</p>`;
    } else {
      html += `<p style="font-size:13px;color:var(--ink-500);margin:0 0 14px;">Tap below to send your order on WhatsApp.</p>`;
    }
    html += `<div class="whatsapp-send-list">`;
    shopIds.forEach(shopId => {
      const shop = SHOPS[shopId];
      const items = groups[shopId];
      const subtotal = items.reduce((s, it) => s + currentPrice(it.product) * it.qty, 0);
      const sent = sentShops.has(shopId);
      html += `
        <button class="whatsapp-btn ${sent ? "sent" : ""}" data-send-shop="${shopId}">
          <span class="wa-left">
            ${sent ? ICONS.check : ICONS.whatsapp}
            <span class="wa-meta">
              <span>${sent ? "Sent to" : "Send to"} ${shop.name}</span>
              <small>${items.length} item${items.length > 1 ? "s" : ""} · ${money(subtotal)}</small>
            </span>
          </span>
          <span>${sent ? "" : "→"}</span>
        </button>`;
    });
    html += `</div><p class="checkout-hint">Each button opens WhatsApp with your order pre-filled — just hit send there too.</p>`;
    cartBody.innerHTML = html;

    $("#back-to-form").addEventListener("click", () => { cartView = "checkout"; renderCartBody(); });
    cartBody.querySelectorAll("[data-send-shop]").forEach(btn => {
      btn.addEventListener("click", () => {
        const shopId = btn.dataset.sendShop;
        const shop = SHOPS[shopId];
        const items = groups[shopId];
        const message = buildWhatsAppMessage(shopId, items);
        window.open(`https://wa.me/${shop.whatsapp}?text=${encodeURIComponent(message)}`, "_blank", "noopener");
        sentShops.add(shopId);
        renderSendView();
      });
    });

    cartFooter.innerHTML = shopIds.every(id => sentShops.has(id))
      ? `<button class="btn checkout-btn" id="finish-order">Done — Clear Basket</button>`
      : "";
    const finishBtn = $("#finish-order");
    if (finishBtn) {
      finishBtn.addEventListener("click", () => {
        cart = {};
        saveCart();
        updateCartCount();
        customerInfo = { name: "", phone: "", orderType: "Collection", address: "", notes: "" };
        cartView = "cart";
        closeCart();
        showToast("Thanks! Your order basket has been cleared.");
      });
    }
  }

  /* ---------------- Toast ---------------- */
  let toastTimer = null;
  function showToast(msg) {
    if (!toastEl) return;
    toastEl.innerHTML = `${ICONS.check}<span>${msg}</span>`;
    toastEl.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove("show"), 1600);
  }

  /* ---------------- Floating WhatsApp button (general inquiries) ---------------- */
  function initWhatsAppFab() {
    if (!waFab || !waFabPopover) return;
    waFabPopover.innerHTML = Object.values(SHOPS).map(shop => {
      const text = encodeURIComponent(`Hi ${shop.name}, I have a question about your shop.`);
      return `<a class="wa-fab-option" href="https://wa.me/${shop.whatsapp}?text=${text}" target="_blank" rel="noopener">
        ${ICONS.whatsapp}
        <span>${shop.name}</span>
      </a>`;
    }).join("");

    waFab.addEventListener("click", (e) => {
      e.stopPropagation();
      waFabPopover.classList.toggle("open");
    });
    document.addEventListener("click", (e) => {
      if (!waFabPopover.contains(e.target) && e.target !== waFab) {
        waFabPopover.classList.remove("open");
      }
    });
  }

  /* ---------------- Promotion banner + popup ---------------- */
  const PROMO_DISMISS_KEY = `quickstop_promo_dismissed_${(typeof PROMOTION !== "undefined" && PROMOTION.id) || "default"}`;
  const PROMO_POPUP_SEEN_KEY = "quickstop_promo_popup_seen";

  function initPromoBanner() {
    if (typeof PROMOTION === "undefined" || !PROMOTION.active) return;
    const banner = $("#promo-banner");
    if (!banner) return;
    let dismissed = false;
    try { dismissed = sessionStorage.getItem(PROMO_DISMISS_KEY) === "1"; } catch (e) {}
    if (dismissed) return;

    $("#promo-banner-text").textContent = PROMOTION.message;
    const cta = $("#promo-banner-cta");
    if (cta) {
      if (PROMOTION.ctaLabel && PROMOTION.ctaLink) {
        cta.textContent = PROMOTION.ctaLabel;
        cta.href = PROMOTION.ctaLink;
        cta.style.display = "";
      } else {
        cta.style.display = "none";
      }
    }
    banner.classList.add("show");

    const closeBtn = $("#promo-banner-close");
    if (closeBtn) {
      closeBtn.addEventListener("click", () => {
        banner.classList.remove("show");
        try { sessionStorage.setItem(PROMO_DISMISS_KEY, "1"); } catch (e) {}
      });
    }
  }

  function maybeShowPromoPopup() {
    if (typeof PROMOTION === "undefined" || !PROMOTION.active) return;
    const modal = $("#promo-modal");
    if (!modal) return;
    let seen = false;
    try { seen = sessionStorage.getItem(PROMO_POPUP_SEEN_KEY) === "1"; } catch (e) {}
    if (seen) return;

    $("#promo-modal-text").textContent = PROMOTION.message;
    const cta = $("#promo-modal-cta");
    if (cta) {
      if (PROMOTION.ctaLabel && PROMOTION.ctaLink) {
        cta.textContent = PROMOTION.ctaLabel;
        cta.href = PROMOTION.ctaLink;
        cta.style.display = "";
      } else {
        cta.style.display = "none";
      }
    }

    setTimeout(() => {
      modal.classList.add("open");
      try { sessionStorage.setItem(PROMO_POPUP_SEEN_KEY, "1"); } catch (e) {}
    }, 1200);

    const closeBtn = $("#promo-modal-close");
    if (closeBtn) closeBtn.addEventListener("click", () => modal.classList.remove("open"));
    modal.addEventListener("click", (e) => { if (e.target === modal) modal.classList.remove("open"); });
  }

  /* ---------------- Mobile nav ---------------- */
  function initMobileNav() {
    const toggle = $("#nav-toggle");
    const nav = $("#main-nav");
    if (!toggle || !nav) return;
    toggle.addEventListener("click", () => nav.classList.toggle("open"));
  }

  /* ---------------- Wire up global controls ---------------- */
  if ($("#cart-btn")) $("#cart-btn").addEventListener("click", openCart);
  if ($("#cart-close")) $("#cart-close").addEventListener("click", closeCart);
  if (cartOverlay) cartOverlay.addEventListener("click", closeCart);

  document.querySelectorAll("[data-scroll]").forEach(el => {
    el.addEventListener("click", (e) => {
      const target = document.querySelector(el.dataset.scroll);
      if (target) { e.preventDefault(); target.scrollIntoView({ behavior: "smooth", block: "start" }); }
    });
  });

  initWhatsAppFab();
  initMobileNav();
  initPromoBanner();
  updateCartCount();

  /* ---------------- Public API for page-specific scripts ---------------- */
  return {
    ICONS, CATEGORY_ICON_FALLBACK, starRow, money, productById, productImage,
    pricing, currentPrice, productCardHTML, bindProductCards,
    attemptAdd, addToCart, showToast, openCart, maybeShowPromoPopup
  };
})();
