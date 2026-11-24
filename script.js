/* BestGlobalBroker.com · JAIAK V1 — site logic (no dependencies) */
(function () {
  "use strict";

  /* ------------------------------------------------------------------
     CHECKOUT LINKS (USDT / USDC)
     Paste here the crypto payment link of each EA ($49) from your
     gateway (e.g. NOWPayments payment link / invoice). The "Buy" button
     opens it in a new tab and also prepares the form, where the buyer
     sends the payment ID + MT5 account number. While a link is empty,
     "Buy" only opens the form with that EA pre-filled.
     ------------------------------------------------------------------ */
  var CHECKOUT = {
    jury:  "https://nowpayments.io/payment/?iid=5262230301",
    angle: "https://nowpayments.io/payment/?iid=5262230301",
    rider: "https://nowpayments.io/payment/?iid=5262230301",
    ice:   "https://nowpayments.io/payment/?iid=5262230301"
  };
  var FORM_ENDPOINT = "https://formsubmit.co/ajax/jackzmaertens@gmail.com";

  var lang = "es";
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  function store(k, v) { try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (e) { return null; } }
  function t(k) { return (window.translations && translations[lang] && translations[lang][k]) || ""; }

  /* ---------------- i18n */
  function setLang(l) {
    if (!window.translations || !translations[l]) return;
    lang = l;
    $$("[data-i18n]").forEach(function (el) { var v = translations[l][el.getAttribute("data-i18n")]; if (v) el.innerHTML = v; });
    $$("[data-i18n-ph]").forEach(function (el) { var v = translations[l][el.getAttribute("data-i18n-ph")]; if (v) el.setAttribute("placeholder", v); });
    $$("[data-href-en]").forEach(function (el) { if (!el.hasAttribute("data-href-es")) el.setAttribute("data-href-es", el.getAttribute("href")); el.setAttribute("href", l === "en" ? el.getAttribute("data-href-en") : el.getAttribute("data-href-es")); });
    $$("img[data-src-en]").forEach(function (el) { if (!el.hasAttribute("data-src-es")) { el.setAttribute("data-src-es", el.getAttribute("src")); el.setAttribute("data-alt-es", el.getAttribute("alt") || ""); } el.setAttribute("src", l === "en" ? el.getAttribute("data-src-en") : el.getAttribute("data-src-es")); if (el.hasAttribute("data-alt-en")) el.setAttribute("alt", l === "en" ? el.getAttribute("data-alt-en") : el.getAttribute("data-alt-es")); });
    document.documentElement.lang = l;
    store("bgb_lang", l);
    ["es", "en"].forEach(function (x) { var b = $("#lang-" + x); if (b) { b.classList.toggle("on", x === l); b.setAttribute("aria-pressed", x === l ? "true" : "false"); } });
    renderPanel(current, true);
  }
  function initialLang() {
    var q = /[?&]lang=(es|en)/.exec(location.search);
    if (q) return q[1];
    var s = store("bgb_lang");
    if (s === "es" || s === "en") return s;
    var n = (navigator.language || "es").toLowerCase();
    return n.indexOf("es") === 0 ? "es" : (n.indexOf("en") === 0 ? "en" : "es");
  }

  /* ---------------- demo panel (sample values, same layout as the real EA panels) */
  var PANELS = [
    { name: "TREND JURY", tf: "M1", mode: "closed bar", acc: "--acc-jury", st: "ACTIVE", hero: "BUY READY", heroC: "up", side: "3/4 votes",
      rows: [["JURY VOTES"], ["PSAR", "BUY  dist 412p", "up"], ["ADX", "27.4  rising", "up"], ["ATR", "BUY  318p", "up"], ["Stoch", "FLAT  K 54.1", ""],
             ["RISK & GUARDS"], ["Day P/L", "+49.86  limit -1570", "up"], ["SL plan", "ATRx2.5  R 795p", ""], ["Targets", "BE 994p  Part 994p", ""],
             ["POSITION"], ["Position", "none", ""], ["Manage", "flat", ""]] },
    { name: "ANGLE SHIFT", tf: "M5", mode: "mode TREND", acc: "--acc-angle", st: "RUNNING", hero: "+21.6°  STRONG UP", heroC: "up", side: "",
      rows: [["SIGNAL"], ["Regime", "MOMENTUM (fixed)", ""], ["ER", "0.42 / 0.30", ""], ["EMA 110", "UP  close ABOVE", "up"], ["Confirm", "OFF", ""],
             ["POSITION"], ["Open", "x1  0.33 lots  +86.40", "up"], ["Result", "+0.71R", "up"], ["P / BE / Trail", "wait / DONE / wait", "wa"],
             ["PERFORMANCE"], ["Net R", "+1.02", "up"], ["Profit factor", "inf", ""]] },
    { name: "BREAKOUT RIDER", tf: "M1", mode: "", acc: "--acc-rider", st: "ACTIVE", hero: "SELL ONLY", heroC: "dn", side: "83%  5/6 votes",
      rows: [["TREND"], ["Trail stop", "BEAR  3704.55", "dn"], ["EMA cloud 21/34", "BEAR", "dn"], ["Bias M15/H1/H4", "BEAR BEAR BEAR", "dn"],
             ["VOTES"], ["RSI", "37.4", ""], ["ADX", "39.3 BEAR", "dn"], ["MACD", "BEAR", "dn"],
             ["POSITION"], ["Break-even", "ARMED 0.8R", "wa"], ["Partial", "ARMED 1.50R", "wa"], ["Signal mode", "FLIP +1BAR", ""]] },
    { name: "ICE CROSS", tf: "M1", mode: "", acc: "--acc-ice", st: "ACTIVE", hero: "ARMED BUY", heroC: "up", side: "trend BULLISH",
      rows: [["MARKET"], ["Fast EMA 14", "3698.81", "up"], ["Slow EMA 38", "3694.17", ""], ["ATR", "299 pts", ""], ["Session", "24h", "up"],
             ["SETTINGS"], ["Risk / SL / TP", "0.3%  SL 2.0  TP 2.5 ATR", ""], ["BE / Partial", "0.4 ATR  50% @ 50%", ""], ["Trailing", "ATR 1.0 / 0.8", ""],
             ["PERFORMANCE"], ["Win rate", "--", ""], ["Profit factor", "--", ""]] }
  ];
  var current = 0, rotTimer = null;
  function esc(s) { return String(s).replace(/[&<>]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]; }); }
  function renderPanel(i, quiet) {
    var p = PANELS[i], jp = $("#jp-demo"); if (!jp) return;
    jp.style.setProperty("--acc", "var(" + p.acc + ")");
    $(".jp-name", jp).textContent = p.name;
    $(".jp-sym", jp).textContent = "XAUUSD   " + p.tf + (p.mode ? "   " + p.mode : "");
    $(".jp-st", jp).textContent = p.st;
    var h1 = $(".jp-h1", jp); h1.textContent = p.hero; h1.style.color = p.heroC === "dn" ? "var(--down)" : (p.heroC === "up" ? "var(--up)" : "var(--cyan)");
    $(".jp-h2", jp).textContent = p.side;
    var html = "";
    p.rows.forEach(function (r) {
      if (r.length === 1) html += '<div class="jp-sec">' + esc(r[0]) + "</div>";
      else html += '<div class="jp-r"><span>' + esc(r[0]) + '</span><b class="' + (r[2] || "") + '">' + esc(r[1]) + "</b></div>";
    });
    $("#jp-rows").innerHTML = html;
    $$("#jp-tabs button").forEach(function (b, k) { b.classList.toggle("on", k === i); b.setAttribute("aria-selected", k === i ? "true" : "false"); });
    if (!quiet) { jp.classList.remove("swap"); void jp.offsetWidth; jp.classList.add("swap"); }
    chartBias = p.heroC === "dn" ? -1 : 1;
  }
  function startRotation() { stopRotation(); rotTimer = setInterval(function () { current = (current + 1) % PANELS.length; renderPanel(current); }, 5200); }
  function stopRotation() { if (rotTimer) clearInterval(rotTimer); rotTimer = null; }

  /* ---------------- hero chart (decorative candles + PSAR dots) */
  var chartBias = 1;
  function heroChart() {
    var cv = $("#hero-chart"); if (!cv || !cv.getContext) return;
    var ctx = cv.getContext("2d"), dpr = Math.min(window.devicePixelRatio || 1, 2);
    var W, H, bars = [], n = 40, seed = 7;
    function rnd() { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; }
    function resize() {
      var r = cv.getBoundingClientRect(); W = Math.max(200, r.width); H = Math.max(200, r.height);
      cv.width = W * dpr; cv.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); draw();
    }
    function gen() {
      var p = 100; bars = [];
      for (var i = 0; i < n; i++) { var o = p, c = o + (rnd() - 0.45) * 2.4, h = Math.max(o, c) + rnd() * 1.2, l = Math.min(o, c) - rnd() * 1.2; bars.push([o, h, l, c]); p = c; }
    }
    function step() {
      var last = bars[bars.length - 1][3], o = last, c = o + (rnd() - 0.5 + 0.08 * chartBias) * 2.4;
      bars.push([o, Math.max(o, c) + rnd() * 1.1, Math.min(o, c) - rnd() * 1.1, c]); if (bars.length > n) bars.shift(); draw();
    }
    function draw() {
      if (!W) return;
      ctx.clearRect(0, 0, W, H);
      var hi = -1e9, lo = 1e9; bars.forEach(function (b) { hi = Math.max(hi, b[1]); lo = Math.min(lo, b[2]); });
      var pad = (hi - lo) * 0.12; hi += pad; lo -= pad;
      var x0 = W * 0.42, cw = (W - x0 - 46) / n, y = function (v) { return 14 + (H - 28) * (hi - v) / (hi - lo); };
      ctx.strokeStyle = "rgba(0,150,190,0.07)"; ctx.lineWidth = 1;
      for (var g = 1; g < 6; g++) { ctx.beginPath(); ctx.moveTo(0, H * g / 6); ctx.lineTo(W, H * g / 6); ctx.stroke(); }
      // EMA cloud
      var fa = [], sl = [], ef = bars[0][3], es = bars[0][3];
      bars.forEach(function (b) { ef += (b[3] - ef) * 0.18; es += (b[3] - es) * 0.07; fa.push(ef); sl.push(es); });
      ctx.beginPath(); fa.forEach(function (v, i) { var X = x0 + i * cw + cw / 2; i ? ctx.lineTo(X, y(v)) : ctx.moveTo(X, y(v)); });
      for (var i2 = sl.length - 1; i2 >= 0; i2--) ctx.lineTo(x0 + i2 * cw + cw / 2, y(sl[i2]));
      ctx.closePath(); ctx.fillStyle = fa[fa.length - 1] >= sl[sl.length - 1] ? "rgba(0,255,156,0.08)" : "rgba(0,170,255,0.09)"; ctx.fill();
      bars.forEach(function (b, i) {
        var X = x0 + i * cw, up = b[3] >= b[0], col = up ? "#00ff9c" : "#00aaff";
        ctx.strokeStyle = col; ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(X + cw / 2, y(b[1])); ctx.lineTo(X + cw / 2, y(b[2])); ctx.stroke();
        var top = y(Math.max(b[0], b[3])), hgt = Math.max(1, Math.abs(y(b[0]) - y(b[3])));
        ctx.globalAlpha = up ? 0.95 : 0.9; ctx.fillRect(X + cw * 0.18, top, cw * 0.64, hgt); ctx.globalAlpha = 1;
        if (i % 2 === 0) { var d = up ? b[2] - 0.9 : b[1] + 0.9; ctx.beginPath(); ctx.arc(X + cw / 2, y(d), 1.6, 0, 6.3); ctx.fillStyle = up ? "rgba(0,255,156,.7)" : "rgba(0,170,255,.7)"; ctx.fill(); }
      });
      var lc = bars[bars.length - 1][3], ly = y(lc);
      ctx.setLineDash([4, 4]); ctx.strokeStyle = "rgba(0,230,220,.6)"; ctx.beginPath(); ctx.moveTo(x0 - 10, ly); ctx.lineTo(W - 44, ly); ctx.stroke(); ctx.setLineDash([]);
      ctx.fillStyle = "#00e6dc"; ctx.fillRect(W - 44, ly - 9, 42, 18); ctx.fillStyle = "#04161a"; ctx.font = "700 10px JetBrains Mono, Consolas, monospace";
      ctx.fillText((3600 + lc).toFixed(2), W - 41, ly + 3.5);
    }
    gen(); resize();
    window.addEventListener("resize", resize);
    var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!reduce) setInterval(step, 1400);
  }

  /* ---------------- modal */
  var lastFocus = null;
  function openModal(type) {
    var m = $("#modal"), title = t(type + "_title"), body = t(type + "_content"); if (!m || !title) return;
    $("#modal-t").textContent = title; $("#modal-c").innerHTML = body;
    lastFocus = document.activeElement; m.hidden = false; document.body.classList.add("lock"); $("#modal-x").focus();
  }
  function closeModal() { var m = $("#modal"); if (!m || m.hidden) return; m.hidden = true; document.body.classList.remove("lock"); if (lastFocus) lastFocus.focus(); }

  /* ---------------- boot */
  document.addEventListener("DOMContentLoaded", function () {
    setLang(initialLang());
    $("#lang-es") && $("#lang-es").addEventListener("click", function () { setLang("es"); });
    $("#lang-en") && $("#lang-en").addEventListener("click", function () { setLang("en"); });

    // mobile menu
    var burger = $("#burger"), links = $("#navlinks");
    function closeMenu() { if (links) links.classList.remove("open"); if (burger) burger.setAttribute("aria-expanded", "false"); }
    if (burger && links) {
      burger.addEventListener("click", function () { var o = links.classList.toggle("open"); burger.setAttribute("aria-expanded", o ? "true" : "false"); });
      $$("a", links).forEach(function (a) { a.addEventListener("click", closeMenu); });
    }

    // active section in nav
    if ("IntersectionObserver" in window) {
      var navMap = {}; $$(".links a").forEach(function (a) { navMap[a.getAttribute("href").slice(1)] = a; });
      var io = new IntersectionObserver(function (es) {
        es.forEach(function (e) { if (e.isIntersecting && navMap[e.target.id]) { $$(".links a").forEach(function (a) { a.classList.remove("on"); }); navMap[e.target.id].classList.add("on"); } });
      }, { rootMargin: "-45% 0px -50% 0px" });
      Object.keys(navMap).forEach(function (id) { var s = document.getElementById(id); if (s) io.observe(s); });
      var rv = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); rv.unobserve(e.target); } }); }, { threshold: 0.12 });
      $$(".reveal").forEach(function (el) { rv.observe(el); });
    } else { $$(".reveal").forEach(function (el) { el.classList.add("in"); }); }

    // demo panel
    renderPanel(0, true); startRotation();
    $$("#jp-tabs button").forEach(function (b) { b.addEventListener("click", function () { current = +b.getAttribute("data-ea"); renderPanel(current); startRotation(); }); });
    heroChart();

    // buy buttons
    $$("[data-buy]").forEach(function (b) {
      b.addEventListener("click", function (e) {
        var key = b.getAttribute("data-buy"), url = CHECKOUT[key];
        if (url) window.open(url, "_blank", "noopener");
        var reason = $("#form-reason"), msg = $("#claim-form textarea");
        if (reason) reason.value = "crypto_purchase";
        if (msg && !msg.value) msg.value = (lang === "es" ? "Quiero comprar JAIAK " : "I want to buy JAIAK ") + b.closest(".card").querySelector("h3").textContent + " V1";
      });
    });

    // form
    var form = $("#claim-form"), ok = $("#form-ok"), err = $("#form-err");
    if (form) form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (err) err.hidden = true;
      if (!form.checkValidity()) { form.reportValidity && form.reportValidity(); return; }
      var f = form.elements;
      if (f._honey && f._honey.value) return;
      var btn = $("button[type=submit]", form), label = btn.innerHTML; btn.disabled = true; btn.textContent = t("form_sending") || "…";
      var data = { Nombre: f["name"].value.trim(), Email: f["email"].value.trim(), Cuenta_MT5: f["account"].value.trim() || "-", Pago_cripto: f["payment"].value.trim() || "-",
        Motivo: f["reason"].value, Mensaje: f["message"].value.trim() || "-", Idioma: lang, _subject: "Nueva solicitud JAIAK V1 — BestGlobalBroker.com", _template: "table" };
      fetch(FORM_ENDPOINT, { method: "POST", headers: { "Content-Type": "application/json", "Accept": "application/json" }, body: JSON.stringify(data) })
        .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
        .then(function () { form.hidden = true; if (ok) ok.hidden = false; })
        .catch(function () { if (err) err.hidden = false; btn.disabled = false; btn.innerHTML = label; });
    });

    // legal modal
    $$(".legal").forEach(function (a) { a.addEventListener("click", function (e) { e.preventDefault(); openModal(a.getAttribute("data-modal")); }); });
    $("#modal-x") && $("#modal-x").addEventListener("click", closeModal);
    $("#modal-ok") && $("#modal-ok").addEventListener("click", closeModal);
    $("#modal") && $("#modal").addEventListener("click", function (e) { if (e.target.id === "modal") closeModal(); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") { closeModal(); closeMenu(); } });
    var h = location.hash.slice(1); if (["terms", "privacy", "risk", "affiliate"].indexOf(h) >= 0) openModal(h);
  });
})();
