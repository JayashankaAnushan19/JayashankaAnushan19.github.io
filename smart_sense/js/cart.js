/* ==========================================================================
   Smart Sense — cart logic (localStorage based, WhatsApp checkout)
   ========================================================================== */

const CART_KEY = "smartsense_cart_v1";
const WHATSAPP_NUMBER = "94719042611"; // 071 904 2611 in international format, no leading 0

function getCart() {
  try {
    const raw = localStorage.getItem(CART_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateCartCount();
}

function findProduct(id) {
  return PRODUCTS.find((p) => p.id === id);
}

function addToCart(id) {
  const cart = getCart();
  const existing = cart.find((item) => item.id === id);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ id, qty: 1 });
  }
  saveCart(cart);
  renderCart();
  showToast("Added to cart 🧸");
  openCart();
}

function changeQty(id, delta) {
  const cart = getCart();
  const item = cart.find((i) => i.id === id);
  if (!item) return;
  item.qty += delta;
  const next = item.qty <= 0 ? cart.filter((i) => i.id !== id) : cart;
  saveCart(next);
  renderCart();
}

function removeFromCart(id) {
  const cart = getCart().filter((i) => i.id !== id);
  saveCart(cart);
  renderCart();
}

function cartCount() {
  return getCart().reduce((sum, i) => sum + i.qty, 0);
}

function cartSubtotal() {
  return getCart().reduce((sum, i) => {
    const p = findProduct(i.id);
    return p ? sum + p.price * i.qty : sum;
  }, 0);
}

function formatRs(n) {
  return "Rs. " + n.toLocaleString("en-LK");
}

function updateCartCount() {
  document.querySelectorAll("[data-cart-count]").forEach((el) => {
    el.textContent = cartCount();
  });
}

function renderCart() {
  const list = document.getElementById("cartItems");
  if (!list) return;
  const cart = getCart();

  if (cart.length === 0) {
    list.innerHTML = `
      <div class="cart-empty">
        <span class="emoji">🧸</span>
        <p>Your cart is empty.<br>Add a squishy to get started!</p>
      </div>`;
  } else {
    list.innerHTML = cart
      .map((item) => {
        const p = findProduct(item.id);
        if (!p) return "";
        return `
        <div class="cart-item">
          <div class="cart-item-media ${p.colorClass}"><img src="${p.image}" alt="${p.name}"></div>
          <div class="cart-item-info">
            <div class="name">${p.name}</div>
            <div class="variant">${formatRs(p.price)} each</div>
            <div class="qty-control">
              <button type="button" aria-label="Decrease quantity" onclick="changeQty('${p.id}', -1)">−</button>
              <span>${item.qty}</span>
              <button type="button" aria-label="Increase quantity" onclick="changeQty('${p.id}', 1)">+</button>
            </div>
          </div>
          <div>
            <div class="cart-item-price">${formatRs(p.price * item.qty)}</div>
            <button type="button" class="cart-item-remove" onclick="removeFromCart('${p.id}')">Remove</button>
          </div>
        </div>`;
      })
      .join("");
  }

  document.querySelectorAll("[data-cart-subtotal]").forEach((el) => {
    el.textContent = formatRs(cartSubtotal());
  });

  const checkoutBtn = document.getElementById("goToCheckoutForm");
  if (checkoutBtn) checkoutBtn.disabled = cart.length === 0;
}

function buildWhatsAppMessage() {
  const cart = getCart();
  const name = (document.getElementById("custName") || {}).value || "";
  const phone = (document.getElementById("custPhone") || {}).value || "";
  const address = (document.getElementById("custAddress") || {}).value || "";
  const notes = (document.getElementById("custNotes") || {}).value || "";

  let msg = "Hi Smart Sense! 🧸 I'd like to place an order:%0A%0A";
  cart.forEach((item) => {
    const p = findProduct(item.id);
    if (!p) return;
    msg += `• ${p.name} x${item.qty} – ${formatRs(p.price * item.qty)}%0A`;
  });
  msg += `%0ASubtotal: ${formatRs(cartSubtotal())}%0A%0A`;
  msg += `Name: ${name || "-"}%0APhone: ${phone || "-"}%0AAddress: ${address || "-"}%0A`;
  if (notes) msg += `Notes: ${notes}%0A`;
  return msg;
}

function openCart() {
  document.getElementById("cartDrawer")?.classList.add("open");
  document.getElementById("cartOverlay")?.classList.add("open");
  document.body.style.overflow = "hidden";
}

function closeCart() {
  document.getElementById("cartDrawer")?.classList.remove("open");
  document.getElementById("cartOverlay")?.classList.remove("open");
  document.body.style.overflow = "";
  const form = document.getElementById("checkoutForm");
  if (form) form.classList.remove("open");
  const goBtn = document.getElementById("goToCheckoutForm");
  const sendBtn = document.getElementById("sendWhatsappOrder");
  if (goBtn) goBtn.hidden = false;
  if (sendBtn) sendBtn.hidden = true;
}

function showToast(text) {
  const toast = document.getElementById("toast");
  if (!toast) return;
  toast.textContent = text;
  toast.classList.add("show");
  clearTimeout(window.__toastTimer);
  window.__toastTimer = setTimeout(() => toast.classList.remove("show"), 2200);
}

document.addEventListener("DOMContentLoaded", () => {
  updateCartCount();
  renderCart();

  document.querySelectorAll("[data-open-cart]").forEach((btn) =>
    btn.addEventListener("click", openCart)
  );
  document.getElementById("cartClose")?.addEventListener("click", closeCart);
  document.getElementById("cartOverlay")?.addEventListener("click", closeCart);

  document.getElementById("goToCheckoutForm")?.addEventListener("click", () => {
    document.getElementById("checkoutForm")?.classList.add("open");
    document.getElementById("goToCheckoutForm").hidden = true;
    const sendBtn = document.getElementById("sendWhatsappOrder");
    if (sendBtn) sendBtn.hidden = false;
  });

  document.getElementById("sendWhatsappOrder")?.addEventListener("click", () => {
    const name = document.getElementById("custName");
    const phone = document.getElementById("custPhone");
    const address = document.getElementById("custAddress");

    if (!name.value.trim() || !phone.value.trim() || !address.value.trim()) {
      showToast("Please fill in name, phone & address");
      return;
    }

    const message = buildWhatsAppMessage();
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;
    window.open(url, "_blank");
  });

  document.querySelectorAll("[data-add-to-cart]").forEach((btn) => {
    btn.addEventListener("click", () => addToCart(btn.getAttribute("data-add-to-cart")));
  });
});
