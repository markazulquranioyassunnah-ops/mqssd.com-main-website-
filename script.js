
/* মারকাযুল কুরআনি ওয়াস সুন্নাহ — main script */
(function () {
  'use strict';
  var BN = '০১২৩৪৫৬৭৮৯';
  var bn = function (s) { return String(s).replace(/\d/g, function (d) { return BN[d]; }); };
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  document.documentElement.classList.add('js');

  /* ---------- Splash screen ---------- */
  (function () {
    var sp = $('#splash');
    if (!sp) return;
    var rest = $$('body > :not(#splash):not(script)'), started = Date.now(), closed = false, loaded = document.readyState === 'complete';
    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var MIN = reduce ? 900 : 2500, MAX = 6500;
    document.body.classList.add('no-scroll');
    rest.forEach(function (e) { e.inert = true; });
    function close() {
      if (closed) return; closed = true;
      sp.classList.add('out');
      rest.forEach(function (e) { e.inert = false; });
      document.body.classList.remove('no-scroll');
      setTimeout(function () { sp.hidden = true; }, 1600);
    }
    function check() { if (loaded && Date.now() - started >= MIN) close(); }
    if (!loaded) window.addEventListener('load', function () { loaded = true; check(); });
    var iv = setInterval(function () { check(); if (closed || Date.now() - started >= MAX) { clearInterval(iv); close(); } }, 150);
    sp.addEventListener('click', close);
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' || e.key === 'Enter') close(); });
  })();

  /* ---------- Mobile menu ---------- */
  var burger = $('.burger'), mm = $('.mobile-menu');
  function setMM(open) {
    mm.classList.toggle('open', open);
    document.body.classList.toggle('no-scroll', open);
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    if (open) { var c = $('.close', mm); if (c) c.focus(); } else if (document.activeElement && mm.contains(document.activeElement)) burger.focus();
  }
  if (burger && mm) {
    burger.addEventListener('click', function () { setMM(true); });
    mm.addEventListener('click', function (e) {
      if (e.target === mm || e.target.classList.contains('close') || (e.target.tagName === 'A' && !e.target.classList.contains('js-admin') && !e.target.classList.contains('js-com'))) setMM(false);
    });
    window.addEventListener('resize', function () { if (window.innerWidth > 1180) setMM(false); });
  }

  /* ---------- Hero slider ---------- */
  var slides = $$('.slider .slide'), dots = $$('.slider .dots button');
  if (slides.length) {
    var cur = 0, timer = null;
    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var go = function (n) {
      slides.forEach(function (s, k) { s.classList.toggle('active', k === n); });
      dots.forEach(function (d, k) { d.classList.toggle('active', k === n); d.setAttribute('aria-current', k === n ? 'true' : 'false'); });
      cur = n;
    };
    var start = function () { if (reduce || timer) return; timer = setInterval(function () { go((cur + 1) % slides.length); }, 5500); };
    var stop = function () { clearInterval(timer); timer = null; };
    dots.forEach(function (d, k) { d.addEventListener('click', function () { go(k); stop(); start(); }); });
    var sl = $('.slider');
    sl.addEventListener('mouseenter', stop); sl.addEventListener('mouseleave', start);
    document.addEventListener('visibilitychange', function () { document.hidden ? stop() : start(); });
    go(0); start();
  }

  /* ---------- Reveal on scroll ---------- */
  var io = ('IntersectionObserver' in window) ? new IntersectionObserver(function (entries) {
    entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { threshold: 0.12 }) : null;
  function observeVisible(root) {
    $$('.reveal:not(.in)', root).forEach(function (el) { io ? io.observe(el) : el.classList.add('in'); });
  }

  /* ---------- Router (hash based, single file) ---------- */
  var pages = $$('.spa-page');
  var baseTitle = 'মারকাযুল কুরআনি ওয়াস সুন্নাহ — সাভার, ঢাকা';
  var alias = { home: 'index', 'darul-ifta': 'departments', facilities: 'about', teachers: 'about' };
  function show() {
    var raw = (location.hash || '#home').slice(1), h = alias[raw] || raw;
    var el = document.getElementById('page-' + h);
    if (!el) { h = 'index'; el = document.getElementById('page-index'); }
    pages.forEach(function (p) { p.hidden = p !== el; });
    $$('.menu a,.mobile-menu .panel a').forEach(function (a) {
      var t = (a.getAttribute('href') || '').slice(1); t = alias[t] || t;
      var on = t === h; a.classList.toggle('active', on);
      if (on) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
    });
    var t = el.getAttribute('data-title');
    document.title = (h === 'index' || !t) ? baseTitle : t + ' | মারকাযুল কুরআনি ওয়াস সুন্নাহ';
    window.scrollTo(0, 0);
    observeVisible(el);
    if (raw === 'darul-ifta') setTimeout(function () { gotoDept('fatwa'); }, 50);
    if (raw === 'facilities') setTimeout(function () { var f = document.getElementById('facilities'); if (f) { $$('.reveal', f).forEach(function (r) { r.classList.add('in'); }); f.scrollIntoView(); } }, 60);
  }
  window.addEventListener('hashchange', show);

  /* ---------- Department jump ---------- */
  function gotoDept(id) {
    var el = document.getElementById('dept-' + id);
    if (!el) return;
    el.classList.add('in');
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    el.classList.add('hl'); setTimeout(function () { el.classList.remove('hl'); }, 1800);
  }
  document.addEventListener('click', function (e) {
    var g = e.target.closest('[data-goto]');
    if (!g) return;
    var id = g.getAttribute('data-goto');
    if (document.getElementById('page-departments').hidden) {
      e.preventDefault();
      location.hash = '#departments';
      setTimeout(function () { gotoDept(id); }, 80);
    } else { e.preventDefault(); gotoDept(id); }
  });

  /* ---------- Popups (login placeholder, community) ---------- */
  var lastFocus = null, openedModal = null;
  function openModal(m) { if (!m) return; lastFocus = document.activeElement; openedModal = m; m.classList.add('open'); m.setAttribute('aria-hidden', 'false'); $('.box', m).focus(); }
  function closeModal() { if (!openedModal) return; openedModal.classList.remove('open'); openedModal.setAttribute('aria-hidden', 'true'); openedModal = null; if (lastFocus && lastFocus.focus) lastFocus.focus(); }
  function bindOpen(sel, id) { $$(sel).forEach(function (b) { b.addEventListener('click', function (e) { e.preventDefault(); if (mm.classList.contains('open')) setMM(false); openModal($(id)); }); }); }
  bindOpen('.js-admin', '#admin-modal');
  bindOpen('.js-com', '#com-modal');
  $$('.admin-modal').forEach(function (m) { m.addEventListener('click', function (e) { if (e.target === m || e.target.classList.contains('js-admin-close')) closeModal(); }); });
  document.addEventListener('click', function (e) {
    var im = e.target.closest ? e.target.closest('.g-item img') : null;
    if (!im) return;
    var big = $('#lb-img'); big.src = im.src; big.alt = im.alt; openModal($('#lb-modal'));
  });
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    if (openedModal) closeModal(); else if (mm.classList.contains('open')) setMM(false);
  });

  /* ---------- Date, Hijri date & prayer times (Bangladesh / Dhaka time) ---------- */
  var dhakaParts = function () {
    var f = new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Dhaka', hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit', year: 'numeric', hourCycle: 'h23' });
    var o = {}; f.formatToParts(new Date()).forEach(function (p) { o[p.type] = p.value; }); return o;
  };
  var HIJRI_MONTHS = ['মুহাররম', 'সফর', 'রবিউল আউয়াল', 'রবিউস সানি', 'জমাদিউল আউয়াল', 'জমাদিউস সানি', 'রজব', 'শা’বান', 'রমজান', 'শাওয়াল', 'জিলকদ', 'জিলহজ'];
  /* Bangladesh follows local moon sighting. Add one line [first day (Gregorian), hijri year, month 1-12] when the Islamic Foundation announces a new month.
     Without a matching line the date falls back to the Umm al-Qura calendar minus one day. */
  var HIJRI_STARTS = [['2026-10-12', 1448, 5], ['2026-11-12', 1448, 6]];
  var HIJRI_FALLBACK_OFFSET = -1;
  function hijriBD(y, m, d) {
    var today = Date.UTC(y, m - 1, d), best = null;
    HIJRI_STARTS.forEach(function (r) { var t = Date.parse(r[0]); if (t <= today && (!best || t > best[0])) best = [t, r[1], r[2]]; });
    if (best) { var n = Math.floor((today - best[0]) / 864e5) + 1; if (n >= 1 && n <= 29) return { day: n, month: best[2], year: best[1] }; }
    var hp = {}; new Intl.DateTimeFormat('en-u-ca-islamic-umalqura-nu-latn', { timeZone: 'UTC', day: 'numeric', month: 'numeric', year: 'numeric' })
      .formatToParts(new Date(today + 432e5 + HIJRI_FALLBACK_OFFSET * 864e5)).forEach(function (p) { hp[p.type] = p.value; });
    return { day: +hp.day, month: +hp.month, year: parseInt(hp.year, 10) };
  }
  function showDates() {
    var d = dhakaParts();
    $$('.yr').forEach(function (e) { e.textContent = bn(d.year); });
    var dEl = $('#today-date');
    if (dEl) { try { dEl.textContent = new Date().toLocaleDateString('bn-BD', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Asia/Dhaka' }); } catch (_) { } }
    var hEl = $('#hijri-date');
    if (hEl) {
      try {
        var h = hijriBD(+d.year, +d.month, +d.day);
        if (h.year > 1400 && HIJRI_MONTHS[h.month - 1]) { hEl.hidden = false; $('#hijri-dot').hidden = false; hEl.textContent = bn(h.day) + ' ' + HIJRI_MONTHS[h.month - 1] + ', ' + bn(h.year) + ' হিজরি'; }
      } catch (_) { }
    }
  }

  var grid = $('#prayer-grid'), sunGrid = $('#sun-grid');
  /* Prayer times for Dhaka: Karachi method (Fajr/Isha 18°), Hanafi Asr, small corrections so the result matches the Islamic Foundation's published Dhaka timetable (checked on 3 sample dates, within about 1 minute). */
  var TUNE = { Fajr: 3, Dhuhr: 4, Asr: -1, Maghrib: 3, Isha: 1 };
  var PT = (function () {
    var LAT = 23.7806, LNG = 90.4193, TZ = 6, R = Math.PI / 180;
    var sin = function (x) { return Math.sin(x * R); }, cos = function (x) { return Math.cos(x * R); }, tan = function (x) { return Math.tan(x * R); };
    var asin = function (x) { return Math.asin(x) / R; }, acos = function (x) { return Math.acos(x) / R; }, atan2 = function (y, x) { return Math.atan2(y, x) / R; }, acot = function (x) { return Math.atan(1 / x) / R; };
    var fix = function (a, m) { a = a - m * Math.floor(a / m); return a < 0 ? a + m : a; };
    function julian(y, m, d) {
      if (m <= 2) { y -= 1; m += 12; }
      var A = Math.floor(y / 100), B = 2 - A + Math.floor(A / 4);
      return Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m + 1)) + d + B - 1524.5;
    }
    function sun(jd) {
      var D = jd - 2451545.0, g = fix(357.529 + 0.98560028 * D, 360), q = fix(280.459 + 0.98564736 * D, 360);
      var L = fix(q + 1.915 * sin(g) + 0.020 * sin(2 * g), 360), e = 23.439 - 0.00000036 * D, ra = fix(atan2(cos(e) * sin(L), cos(L)), 360) / 15;
      return { decl: asin(sin(e) * sin(L)), eq: q / 15 - ra + 24 * Math.round((ra - q / 15) / 24) };
    }
    function calc(y, m, d) {
      var jd = julian(y, m, d) - LNG / 360, off = TZ - LNG / 15;
      function at(h) {
        var s = sun(jd + h / 24), noon = fix(12 - s.eq, 24);
        var ha = function (alt) { return acos((sin(alt) - sin(s.decl) * sin(LAT)) / (cos(s.decl) * cos(LAT))) / 15; };
        return { Fajr: noon - ha(-18), Sunrise: noon - ha(-0.833), Noon: noon, Asr: noon + ha(acot(2 + tan(Math.abs(LAT - s.decl)))), Sunset: noon + ha(-0.833), Isha: noon + ha(-18) };
      }
      var guess = { Fajr: 5, Sunrise: 6, Noon: 12, Asr: 15.5, Sunset: 18, Isha: 19 }, o = {};
      Object.keys(guess).forEach(function (k) { o[k] = at(guess[k])[k] + off; });
      o.Dhuhr = o.Noon + TUNE.Dhuhr / 60; o.Maghrib = o.Sunset + TUNE.Maghrib / 60;
      o.Fajr += TUNE.Fajr / 60; o.Asr += TUNE.Asr / 60; o.Isha += TUNE.Isha / 60;
      return o;
    }
    return { calc: calc };
  })();
  if (grid) {
    var namesBn = { Fajr: 'ফজর', Dhuhr: 'যোহর', Asr: 'আসর', Maghrib: 'মাগরিব', Isha: 'এশা' };
    var order = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
    var icons = {
      Fajr: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><g transform="translate(0 1.5)"><path d="M3 18h18M5 18a7 7 0 0 1 14 0M12 3v3M5 7l2 2M19 7l-2 2"/></g></svg>',
      Dhuhr: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>',
      Asr: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2"/></svg>',
      Maghrib: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M3 20h18M5 20a7 7 0 0 1 14 0M12 14V4M9 7l3-3 3 3"/></svg>',
      Isha: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>'
    };
    var fmt = function (hr) {
      var tot = Math.round(hr * 60), h = Math.floor(tot / 60) % 24, m = tot % 60;
      return bn(((h + 11) % 12) + 1 + ':' + String(m).padStart(2, '0')) + (h >= 12 ? ' PM' : ' AM');
    };
    var showTimes = function (t) {
      grid.innerHTML = order.map(function (k) {
        return '<div class="prayer"><div class="ic">' + icons[k] + '</div><div class="name">' + namesBn[k] + '</div><div class="time">' + fmt(t[k]) + '</div></div>';
      }).join('');
      var map = { sunrise: t.Sunrise, zawal: t.Noon, sunset: t.Sunset };
      $$('[data-k]', sunGrid).forEach(function (el) { el.textContent = fmt(map[el.dataset.k]); });
    };
    var toHours = function (s) { var p = String(s).split(' ')[0].split(':'); return +p[0] + p[1] / 60; };
    /* Once a day: show the calculated times at once, then replace them with the web (Aladhan) times if they arrive and agree with the calculation. */
    var shownDay = '';
    function loadDay() {
      var d = dhakaParts(), key = d.day + '-' + d.month + '-' + d.year;
      if (key === shownDay) return;
      shownDay = key; showDates();
      var local = PT.calc(+d.year, +d.month, +d.day); showTimes(local);
      var accept = function (api) {
        var t = {}, ok = true;
        ['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Sunset', 'Maghrib', 'Isha'].forEach(function (k) { t[k] = toHours(api[k]); if (!(Math.abs(t[k] - local[k]) < 0.1)) ok = false; });
        if (!ok) return;
        t.Noon = local.Noon; showTimes(t);
      };
      try {
        Object.keys(localStorage).forEach(function (k) { if (k.indexOf('pt-') === 0 && k !== 'pt-' + key) localStorage.removeItem(k); });   // keep only today's cache
        var c = JSON.parse(localStorage.getItem('pt-' + key)); if (c) { accept(c); return; }
      } catch (_) { }
      var url = 'https://api.aladhan.com/v1/timings/' + key + '?latitude=23.7806&longitude=90.4193&method=1&school=1&timezonestring=Asia/Dhaka&tune=0,' + TUNE.Fajr + ',0,' + TUNE.Dhuhr + ',' + TUNE.Asr + ',' + TUNE.Maghrib + ',0,' + TUNE.Isha + ',0';
      var ctl = ('AbortController' in window) ? new AbortController() : null, to = setTimeout(function () { if (ctl) ctl.abort(); }, 8000);
      fetch(url, ctl ? { signal: ctl.signal } : undefined)
        .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
        .then(function (j) {
          var api = j.data && j.data.timings; if (!api) return;
          accept(api); try { localStorage.setItem('pt-' + key, JSON.stringify(api)); } catch (_) { }
        })
        .catch(function () { })
        .then(function () { clearTimeout(to); });
    }
    loadDay(); setInterval(loadDay, 600000);
  } else { showDates(); }

  /* ---------- Scroll progress + header shadow ---------- */
  var bar = $('#progress'), hdr = $('.site-header'), tick = false;
  function onScroll() {
    tick = false;
    var h = document.documentElement, max = h.scrollHeight - h.clientHeight;
    if (bar) bar.style.transform = 'scaleX(' + (max > 0 ? Math.min(1, h.scrollTop / max) : 0) + ')';
    if (hdr) hdr.classList.toggle('scrolled', h.scrollTop > 8);
  }
  window.addEventListener('scroll', function () { if (!tick) { tick = true; requestAnimationFrame(onScroll); } }, { passive: true });
  window.addEventListener('hashchange', onScroll);
  onScroll();

  show();
})();

