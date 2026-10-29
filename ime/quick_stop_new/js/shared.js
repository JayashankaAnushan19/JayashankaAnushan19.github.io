/* ============================================================
   QUICK STOP — shared logic (icons, pricing, product cards,
   promotion banner, mobile nav). Loaded on every page. Exposes
   window.QS for page-specific scripts (js/catalogue.js, js/home.js).
   ============================================================ */

const QS = (function () {
  "use strict";

  /* ---------------- Icons ---------------- */
  const ICONS = {
    star: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z"/></svg>',
    pin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>',
    clock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>',
    phone: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>',
    search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>',
    close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>',
    bag: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>',
    store: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l1-5h16l1 5"/><path d="M4 9v10a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1V9"/><path d="M9 20v-6h6v6"/></svg>',
    directions: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 11l19-9-9 19-2-8-8-2z"/></svg>',
    snowflake: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v20M5 5l14 14M19 5 5 19M2 12h20"/></svg>',
    droplet: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2.69s6 6.13 6 10.44a6 6 0 1 1-12 0c0-4.31 6-10.44 6-10.44z"/></svg>',
    sparkle: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M18.4 5.6l-2.8 2.8M8.4 15.6l-2.8 2.8"/></svg>',
    basket: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 10h14l-1.5 9.5a2 2 0 0 1-2 1.5H8.5a2 2 0 0 1-2-1.5L5 10z"/><path d="M9 10V7a3 3 0 0 1 6 0v3"/></svg>',
    cup: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 8h13a3 3 0 0 1 0 6h-1"/><path d="M4 8v9a2 2 0 0 0 2 2h7a2 2 0 0 0 2-2V8"/><path d="M8 2c-.5 1 -1.5 1.5-1 3M12 2c-.5 1-1.5 1.5-1 3"/></svg>'
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

  /* Escape text from data.js before putting it into HTML. */
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  }

  function money(n) { return "£" + n.toFixed(2); }
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

  /* One product card, used on Home (featured) and Products pages. */
  function productCardHTML(p, opts) {
    opts = opts || {};
    const shop = SHOPS[p.shop];
    const pr = pricing(p);
    const img = productImage(p);
    const badge = pr.onSale ? `<span class="discount-badge">${pr.percent}% OFF</span>` : "";
    let media;
    if (img) {
      media = `<div class="product-card-media"><img src="${esc(img)}" alt="${esc(p.name)}" loading="lazy">${badge}</div>`;
    } else {
      const iconKey = CATEGORY_ICON_FALLBACK[p.category] || "bag";
      media = `<div class="product-card-media product-card-media-icon">${ICONS[iconKey] || ICONS.bag}${badge}</div>`;
    }
    const tag = opts.showShopBadge
      ? `<span class="shop-badge ${shop.badgeClass}">${esc(shop.shortName)}</span>`
      : `<span class="brand-tag">${esc(p.brand)}</span>`;
    const priceHTML = pr.onSale
      ? `<span class="product-price product-price-sale">${money(pr.current)}</span><span class="product-price-was">${money(pr.regular)}</span>`
      : `<span class="product-price">${money(pr.current)}</span>`;
    const ends = pr.until ? `<span class="sale-ends">Offer ends ${formatShortDate(pr.until)}</span>` : "";
    return `
      <div class="product-card" data-product="${esc(p.id)}">
        ${media}
        <div class="product-card-top">
          ${tag}
          ${p.age18 ? `<span class="age-badge">18+</span>` : ""}
        </div>
        <p class="product-name">${esc(p.name)}</p>
        <p class="product-unit">${esc(p.unit)}</p>
        <div class="product-card-bottom">
          <div class="product-price-wrap">${priceHTML}${ends}</div>
        </div>
      </div>
    `;
  }

  /* ---------------- DOM refs ---------------- */
  const $ = sel => document.querySelector(sel);
  const yearEl = $("#year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------------- Open now / closed ----------------
     Uses each shop's `opens` / `closes` ("HH:MM", UK time) from data.js.
     Any element with data-open-status="<shopId>" is filled in, and
     refreshed every minute. */
  function toMinutes(hhmm) {
    const [h, m] = String(hhmm).split(":").map(Number);
    return h * 60 + (m || 0);
  }
  function formatTime(hhmm) {
    const mins = toMinutes(hhmm) % (24 * 60);
    const h = Math.floor(mins / 60), m = mins % 60;
    const h12 = h % 12 === 0 ? 12 : h % 12;
    return `${h12}${m ? ":" + String(m).padStart(2, "0") : ""} ${h < 12 ? "AM" : "PM"}`;
  }
  function ukMinutesNow() {
    try {
      const parts = new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/London", hour: "2-digit", minute: "2-digit", hourCycle: "h23" }).formatToParts(new Date());
      const get = type => Number(parts.find(p => p.type === type).value);
      return get("hour") * 60 + get("minute");
    } catch (e) {
      const d = new Date();
      return d.getHours() * 60 + d.getMinutes();
    }
  }
  function openStatus(shop) {
    if (!shop || !shop.opens || !shop.closes) return null;
    const now = ukMinutesNow();
    const opens = toMinutes(shop.opens);
    let closes = toMinutes(shop.closes);
    if (closes <= opens) closes += 24 * 60; // closes after midnight
    const open = (now >= opens && now < closes) || (now + 24 * 60 >= opens && now + 24 * 60 < closes);
    if (open) {
      const minsLeft = ((closes - now) % (24 * 60) + 24 * 60) % (24 * 60);
      return minsLeft <= 60
        ? { state: "soon", label: `Closing soon · ${formatTime(shop.closes)}` }
        : { state: "open", label: `Open now · closes ${formatTime(shop.closes)}` };
    }
    return { state: "closed", label: `Closed · opens ${formatTime(shop.opens)}` };
  }
  function renderOpenStatus(root) {
    (root || document).querySelectorAll("[data-open-status]").forEach(el => {
      const st = openStatus(SHOPS[el.dataset.openStatus]);
      if (!st) { el.hidden = true; return; }
      el.hidden = false;
      el.className = `open-status is-${st.state}`;
      el.innerHTML = `<i aria-hidden="true"></i>${esc(st.label)}`;
    });
  }

  /* ---------------- Promotion banner ---------------- */
  const PROMO_DISMISS_KEY = `quickstop_promo_dismissed_${(typeof PROMOTION !== "undefined" && PROMOTION.id) || "default"}`;

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

  /* ---------------- Mobile nav ---------------- */
  function initMobileNav() {
    const toggle = $("#nav-toggle");
    const nav = $("#main-nav");
    if (!toggle || !nav) return;
    toggle.addEventListener("click", () => nav.classList.toggle("open"));
  }

  /* ---------------- Wire up global controls ---------------- */
  document.querySelectorAll("[data-scroll]").forEach(el => {
    el.addEventListener("click", (e) => {
      const target = document.querySelector(el.dataset.scroll);
      if (target) { e.preventDefault(); target.scrollIntoView({ behavior: "smooth", block: "start" }); }
    });
  });

  initMobileNav();
  initPromoBanner();
  // Page scripts render their own badges after this file runs, so wait for them.
  document.addEventListener("DOMContentLoaded", () => renderOpenStatus());
  setInterval(() => renderOpenStatus(), 60 * 1000);

  /* ---------------- Public API for page-specific scripts ---------------- */
  return {
    ICONS, CATEGORY_ICON_FALLBACK, esc, starRow, money, productImage,
    pricing, currentPrice, productCardHTML, openStatus, renderOpenStatus
  };
})();
