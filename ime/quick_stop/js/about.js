/* ============================================================
   QUICK STOP — Our Story page: scroll reveals + counting numbers
   ============================================================ */
(function () {
  "use strict";
  const reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* Live product count from the catalogue */
  document.querySelectorAll("[data-count-products]").forEach(el => {
    el.setAttribute("data-count", String(PRODUCTS.length));
  });

  function format(n, decimals) { return decimals ? n.toFixed(decimals) : String(Math.round(n)); }

  function countUp(el) {
    const target = parseFloat(el.getAttribute("data-count"));
    const decimals = parseInt(el.getAttribute("data-decimals") || "0", 10);
    if (reduce) { el.textContent = format(target, decimals); return; }
    const start = performance.now();
    const duration = 1400;
    (function tick(now) {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      el.textContent = format(target * eased, decimals);
      if (t < 1) requestAnimationFrame(tick);
    })(start);
  }

  const revealEls = document.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window)) {
    revealEls.forEach(el => el.classList.add("in"));
    document.querySelectorAll("[data-count]").forEach(el => { el.textContent = format(parseFloat(el.dataset.count), parseInt(el.dataset.decimals || "0", 10)); });
    return;
  }

  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("in");
      entry.target.querySelectorAll("[data-count]").forEach(countUp);
      io.unobserve(entry.target);
    });
  }, { threshold: 0.18 });
  revealEls.forEach(el => io.observe(el));
})();
