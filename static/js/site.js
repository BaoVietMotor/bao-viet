/* Bảo Việt Motor site interactions. No dependencies, and every page still works without JavaScript. */
(function () {
  'use strict';
  var doc = document.documentElement;
  // Mark anything already on screen as revealed *before* enabling the hide-until-scrolled style,
  // so above-the-fold content never flickers.
  Array.prototype.forEach.call(document.querySelectorAll('.rv'), function (el) {
    var r = el.getBoundingClientRect();
    if (r.top < window.innerHeight && r.bottom > 0) el.classList.add('in');
  });
  doc.classList.add('js');
  var lang = doc.lang === 'en' ? 'en' : 'vi';
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var store = {
    get: function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set: function (k, v) { try { localStorage.setItem(k, v); } catch (e) { /* storage disabled */ } }
  };
  var fmtInt = function (n) {
    return Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, lang === 'vi' ? '.' : ',');
  };
  var fmtVND = function (n) { return lang === 'vi' ? fmtInt(n) + ' ₫' : '₫' + fmtInt(n); };

  /* ---------- solid header once scrolled ---------- */
  var header = $('.site-header'), ticking = false;
  var onScroll = function () {
    ticking = false;
    if (header) header.classList.toggle('solid', (window.pageYOffset || doc.scrollTop) > 12);
  };
  window.addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  onScroll();

  /* ---------- mobile menu ---------- */
  var btn = $('.menu-btn'), links = $('#nav-links');
  if (btn && links) {
    btn.addEventListener('click', function () {
      var open = links.classList.toggle('open');
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    links.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') { links.classList.remove('open'); btn.setAttribute('aria-expanded', 'false'); }
    });
  }

  /* ---------- language: remember explicit choice, gently suggest the other language ---------- */
  $$('[data-lang-switch]').forEach(function (a) {
    a.addEventListener('click', function () { store.set('lang', a.getAttribute('data-lang-switch')); });
  });
  (function suggestLanguage() {
    if (store.get('lang') || store.get('langHintDismissed')) return;
    var browser = (navigator.language || '').toLowerCase();
    var wantsVi = browser.indexOf('vi') === 0;
    var target = $('[data-lang-switch]');
    if (!target) return;
    if ((lang === 'vi' && !wantsVi) || (lang === 'en' && wantsVi)) {
      var bar = document.createElement('div');
      bar.className = 'lang-hint';
      bar.setAttribute('role', 'region');
      bar.setAttribute('aria-label', 'Language');
      var msg = lang === 'vi' ? 'This page is in Vietnamese.' : 'Trang này đang ở tiếng Anh.';
      var cta = lang === 'vi' ? 'View in English' : 'Xem bằng tiếng Việt';
      bar.innerHTML = '<span></span><a></a><button type="button" aria-label="Close">×</button>';
      bar.children[0].textContent = msg;
      bar.children[1].textContent = cta + ' →';
      bar.children[1].href = target.getAttribute('href');
      bar.children[1].addEventListener('click', function () { store.set('lang', lang === 'vi' ? 'en' : 'vi'); });
      bar.children[2].addEventListener('click', function () { store.set('langHintDismissed', '1'); bar.remove(); });
      document.body.insertBefore(bar, document.body.firstChild);
    }
  })();

  /* ---------- reveal on scroll + counters ---------- */
  function countUp(el) {
    var target = parseFloat(el.getAttribute('data-count'));
    if (!isFinite(target)) return;
    var final = fmtInt(target);
    // The real number is already in the HTML. Only animate when the page is actually visible,
    // and always guarantee the final value lands even if animation frames are paused.
    if (reduce || document.visibilityState !== 'visible' || !window.requestAnimationFrame) { el.textContent = final; return; }
    var start = null, dur = 1400, done = false;
    var finish = function () { if (!done) { done = true; el.textContent = final; } };
    setTimeout(finish, dur + 250);
    function step(ts) {
      if (done) return;
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      if (p >= 1) { finish(); return; }
      el.textContent = fmtInt(target * (1 - Math.pow(1 - p, 3)));
      requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        en.target.classList.add('in');
        $$('[data-count]', en.target).forEach(function (c) { if (!c.dataset.done) { c.dataset.done = '1'; countUp(c); } });
        io.unobserve(en.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    $$('.rv').forEach(function (el) { io.observe(el); });
  } else {
    $$('.rv').forEach(function (el) { el.classList.add('in'); });
  }

  /* ---------- product film ---------- */
  var film = $('#film');
  if (film) {
    var video = $('video', film);
    var play = function () {
      if (film.classList.contains('playing')) return;
      film.classList.add('playing');
      film.removeAttribute('role');
      film.removeAttribute('tabindex');
      var p = video.play();
      if (p && p.catch) p.catch(function () { /* autoplay blocked: controls are visible */ });
    };
    film.addEventListener('click', function (e) { if (e.target !== video) play(); });
    film.addEventListener('keydown', function (e) {
      if ((e.key === 'Enter' || e.key === ' ') && !film.classList.contains('playing')) { e.preventDefault(); play(); }
    });
  }

  /* ---------- live clips: silent loops that play only while on screen ----------
     Without JS they keep native controls. With reduced motion they wait for a tap. */
  var clipEls = $$('video[data-clip]');
  if (clipEls.length) {
    clipEls.forEach(function (v) {
      var btn = v.parentNode.querySelector('.clip-btn');
      v.removeAttribute('controls');
      v.muted = true;
      v.dataset.want = reduce ? '0' : '1';
      var sync = function () {
        if (!btn) return;
        var playing = !v.paused;
        btn.classList.toggle('paused', !playing);
        btn.setAttribute('aria-label', btn.getAttribute(playing ? 'data-l-pause' : 'data-l-play'));
      };
      v.addEventListener('play', sync);
      v.addEventListener('pause', sync);
      if (btn) {
        btn.hidden = false;
        sync();
        btn.addEventListener('click', function () {
          if (v.paused) { v.dataset.want = '1'; v.preload = 'auto'; var p = v.play(); if (p && p.catch) p.catch(function () {}); }
          else { v.dataset.want = '0'; v.pause(); }
        });
      }
    });
    var tryPlay = function (v) {
      if (v.dataset.want !== '1') return;
      v.preload = 'auto';
      var p = v.play();
      if (p && p.catch) p.catch(function () { /* autoplay refused (e.g. data saver): the button still works */ });
    };
    if ('IntersectionObserver' in window) {
      var cio = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          var v = en.target;
          if (en.isIntersecting) tryPlay(v);
          else if (!v.paused) v.pause();
        });
      }, { threshold: 0.35 });
      clipEls.forEach(function (v) { cio.observe(v); });
    }
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) clipEls.forEach(function (v) { if (!v.paused) v.pause(); });
    });
  }

  /* ---------- YouTube: nothing loads from YouTube until the visitor presses play ---------- */
  $$('[data-yt]').forEach(function (box) {
    var btn = $('.yt-play', box);
    if (!btn) return;
    btn.addEventListener('click', function () {
      var id = box.getAttribute('data-yt');
      if (!/^[\w-]{11}$/.test(id)) return;
      var f = document.createElement('iframe');
      f.src = 'https://www.youtube-nocookie.com/embed/' + id + '?autoplay=1&rel=0&modestbranding=1';
      f.title = box.getAttribute('data-yt-title') || 'YouTube';
      f.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
      f.allowFullscreen = true;
      f.referrerPolicy = 'strict-origin-when-cross-origin';
      btn.remove();
      box.appendChild(f);
      f.focus();
    });
  });

  /* ---------- price vs bike value ---------- */
  var calc = $('[data-calc]');
  if (calc) {
    var price = parseFloat(calc.getAttribute('data-price'));
    var range = $('#bikeValue', calc), out = $('#bikeValueOut', calc), pct = $('#pctOut', calc), bar = $('#pctBar', calc);
    var MIN = 20e6, MAX = 1.5e9;
    var nice = function (v) {
      var step = v < 1e8 ? 1e6 : v < 5e8 ? 5e6 : 1e7;
      return Math.round(v / step) * step;
    };
    var update = function () {
      var x = parseInt(range.value, 10) / 1000;
      var value = nice(MIN * Math.pow(MAX / MIN, x));
      var p = price / value * 100;
      out.textContent = fmtVND(value);
      var digits = p < 1 ? 2 : p < 10 ? 2 : 1;
      pct.textContent = p.toFixed(digits).replace('.', lang === 'vi' ? ',' : '.') + '%';
      bar.style.width = Math.min(100, p * 10) + '%';
      range.setAttribute('aria-valuetext', fmtVND(value));
    };
    // start the slider at 500,000,000 ₫ (a typical big bike); the markup shows the same value without JS
    range.value = String(Math.round(1000 * Math.log(5e8 / MIN) / Math.log(MAX / MIN)));
    range.addEventListener('input', update);
    update();
  }

  /* ---------- fit checker ---------- */
  var fit = $('[data-fit]');
  if (fit) {
    var L = +fit.getAttribute('data-l'), W = +fit.getAttribute('data-w'), H = +fit.getAttribute('data-h');
    var res = $('#fitResult', fit);
    fit.addEventListener('submit', function (e) {
      e.preventDefault();
      var l = +fit.l.value, w = +fit.w.value, h = +fit.h.value;
      res.className = 'fit-result';
      if (!(l > 0 && w > 0 && h > 0)) {
        res.textContent = lang === 'vi' ? 'Vui lòng nhập đủ ba số đo.' : 'Please enter all three measurements.';
        res.classList.add('no');
        return;
      }
      var over = [];
      if (l > L) over.push((lang === 'vi' ? 'dài hơn ' : 'longer by ') + fmtInt(l - L) + ' mm');
      if (w > W) over.push((lang === 'vi' ? 'rộng hơn ' : 'wider by ') + fmtInt(w - W) + ' mm');
      if (h > H) over.push((lang === 'vi' ? 'cao hơn ' : 'taller by ') + fmtInt(h - H) + ' mm');
      if (over.length) {
        res.textContent = (lang === 'vi' ? 'Có thể không vừa: xe ' : 'May not fit: the bike is ') + over.join(', ') + (lang === 'vi' ? ' so với lòng trong.' : ' than the inside of the enclosure.');
        res.classList.add('no');
      } else {
        var m = Math.min(L - l, W - w, H - h);
        res.textContent = (lang === 'vi' ? 'Vừa theo kích thước. Khoảng trống nhỏ nhất: ' : 'Fits by the numbers. Smallest clearance: ') + fmtInt(m) + ' mm.';
        res.classList.add('ok');
      }
    });
  }
})();
