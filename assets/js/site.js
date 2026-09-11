/* Kaup · 智御无疆 — 官网交互
   主题切换 · 移动导航 · 滚动入场 · 年份
   主题的首次应用在 <head> 内联脚本中完成（避免闪烁）。 */
(function () {
  "use strict";

  var root = document.documentElement;
  var STORE_KEY = "kaup-theme";

  /* ---------- 主题切换 ---------- */
  function currentTheme() {
    return root.getAttribute("data-theme") === "dark" ? "dark" : "light";
  }

  function applyTheme(theme) {
    root.setAttribute("data-theme", theme);
    try { localStorage.setItem(STORE_KEY, theme); } catch (e) {}
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", theme === "dark" ? "#0A1A2F" : "#F7F9FC");
    document.querySelectorAll("[data-theme-toggle]").forEach(function (btn) {
      btn.setAttribute("aria-pressed", String(theme === "dark"));
      btn.setAttribute("aria-label", theme === "dark" ? "切换到浅色主题" : "切换到深色主题");
    });
  }

  document.querySelectorAll("[data-theme-toggle]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      applyTheme(currentTheme() === "dark" ? "light" : "dark");
    });
  });

  window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", function (e) {
    var stored = null;
    try { stored = localStorage.getItem(STORE_KEY); } catch (err) {}
    if (!stored) applyTheme(e.matches ? "dark" : "light");
  });

  /* ---------- 移动导航 ---------- */
  var navToggle = document.querySelector("[data-nav-toggle]");
  var nav = document.getElementById("site-nav");
  var header = document.querySelector(".site-header");

  /* ---------- 顶栏遮罩 ----------
     顶端透明（首页 hero 从视口顶端铺起），滚过顶端就升起毛玻璃底，
     否则 hero 里的字会直接从导航上穿过去；移动菜单展开时同理。 */
  function syncHeader() {
    if (!header) return;
    var open = !!nav && nav.getAttribute("data-open") === "true";
    header.classList.toggle("is-scrolled", open || window.scrollY > 4);
  }

  function closeNav() {
    if (!nav || !navToggle) return;
    nav.setAttribute("data-open", "false");
    navToggle.setAttribute("aria-expanded", "false");
    syncHeader();
  }

  if (navToggle && nav) {
    navToggle.addEventListener("click", function () {
      var open = nav.getAttribute("data-open") === "true";
      nav.setAttribute("data-open", String(!open));
      navToggle.setAttribute("aria-expanded", String(!open));
      syncHeader();
    });
    nav.addEventListener("click", function (e) {
      if (e.target.closest("a")) closeNav();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeNav();
    });
  }

  if (header) {
    syncHeader();
    window.addEventListener("scroll", syncHeader, { passive: true });
    window.addEventListener("resize", syncHeader);
  }

  /* ---------- 滚动入场 ---------- */
  var reveals = document.querySelectorAll(".reveal");
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (!reveals.length) {
    /* no-op */
  } else if (reduce || !("IntersectionObserver" in window)) {
    reveals.forEach(function (el) { el.classList.add("is-visible"); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        io.unobserve(entry.target);
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.06 });
    reveals.forEach(function (el) { io.observe(el); });
  }

  /* ---------- 年份 ---------- */
  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = String(new Date().getFullYear());
  });
})();
