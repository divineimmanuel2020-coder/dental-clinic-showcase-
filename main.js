/* Clínica Solmar demo. Plain JavaScript, no dependencies.
   Edit CONFIG below before going live. */
(function () {
  'use strict';

  var CONFIG = {
    demo: true,               // true: WhatsApp buttons scroll to the booking form. false: they open wa.me
    whatsapp: '34600000000',  // international format, digits only
    slotsLeft: 3,             // free scan places left this week (keep in sync with the real calendar)
    bonusLeft: 3,             // monthly bonuses left
    bonusTotal: 10
  };

  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var reduced = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  if (reduced) document.documentElement.classList.add('rm');

  var lang = 'en';
  try {
    lang = localStorage.getItem('solmar-lang') ||
      (((navigator.language || '').toLowerCase().indexOf('es') === 0) ? 'es' : 'en');
  } catch (e) {}
  var T = function (en, es) { return lang === 'es' ? es : en; };

  /* ---------- colour helpers ---------- */
  function hex2rgb(h) { h = h.replace('#', ''); return [0, 2, 4].map(function (i) { return parseInt(h.substr(i, 2), 16); }); }
  function rgb2hex(a) { return '#' + a.map(function (v) { return Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0'); }).join(''); }
  function mix(a, b, t) { var A = hex2rgb(a), B = hex2rgb(b); return rgb2hex(A.map(function (v, i) { return v + (B[i] - v) * t; })); }

  /* ---------- the mouth ---------- */
  var uid = 0;
  var HALF = [52, 44, 38, 34, 30];
  var CEN = [26, 74, 115, 151, 183];
  var VIS = [58, 52, 48, 42, 36];
  var VISL = [32, 30, 28, 25, 21];
  var Z = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  var FLAWS = {
    none: { rot: Z, dx: Z, dy: Z, len: Z, gap: 1 },
    crooked: { rot: [0, -9, 6, -4, 10, -8, 5, -10, 7, 0], dx: [0, -4, 5, -3, 6, -5, 4, -6, 5, 0], dy: [0, 5, -4, 3, -6, 4, -3, 6, -5, 0], len: Z, gap: 1 },
    worn: { rot: [0, 2, -2, 1, -3, 2, -1, 3, -2, 0], dx: Z, dy: Z, len: [-14, 6, -10, 4, -18, -12, 2, -8, 5, -16], gap: 0.86 }
  };
  var STAR = 'M0-16C2-6 6-2 16 0 6 2 2 6 0 16-2 6-6 2-16 0-6-2-2-6 0-16Z';

  function createMouth(host, opt) {
    opt = opt || {};
    var id = ++uid;
    var flaw = FLAWS[opt.flaw || 'none'];
    var base = opt.tooth || '#FEFEFC';
    var ut = '', lt = '', hl = '', sp = '', i;
    for (i = 0; i < 10; i++) {
      ut += '<rect class="ut" fill="url(#tg' + id + ')" stroke="rgba(0,0,0,.09)" stroke-width="1"/>';
      lt += '<rect class="lt" fill="url(#tl' + id + ')" stroke="rgba(0,0,0,.1)" stroke-width="1"/>';
      hl += '<rect class="hl" fill="#fff" opacity=".5"/>';
    }
    var spots = [[200, 262], [262, 252], [338, 250], [398, 264], [300, 244], [452, 232]];
    spots.forEach(function (p, k) {
      sp += '<g transform="translate(' + p[0] + ' ' + p[1] + ')"><path class="sp" style="--sd:' + (k * 0.12).toFixed(2) + 's" d="' + STAR + '" fill="#fff"/></g>';
    });
    host.innerHTML =
      '<svg class="mouth" viewBox="0 0 600 470" aria-hidden="true">' +
      '<defs>' +
      '<linearGradient id="tg' + id + '" x1="0" y1="0" x2="0" y2="1"><stop class="t0" offset="0" stop-color="' + mix(base, '#000000', 0.07) + '"/><stop class="t1" offset=".38" stop-color="' + base + '"/><stop class="t2" offset="1" stop-color="' + mix(base, '#8A7A5A', 0.12) + '"/></linearGradient>' +
      '<linearGradient id="tl' + id + '" x1="0" y1="0" x2="0" y2="1"><stop class="l0" offset="0" stop-color="' + mix(base, '#000000', 0.12) + '"/><stop class="l1" offset="1" stop-color="' + mix(base, '#000000', 0.04) + '"/></linearGradient>' +
      '<linearGradient id="ul' + id + '" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#D98592"/><stop offset="1" stop-color="#E7959F"/></linearGradient>' +
      '<linearGradient id="ll' + id + '" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#EE9EA8"/><stop offset="1" stop-color="#C36474"/></linearGradient>' +
      '<linearGradient id="cv' + id + '" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#26080F"/><stop offset="1" stop-color="#5A1B2A"/></linearGradient>' +
      '<radialGradient id="vg' + id + '" cx=".5" cy=".5" r=".55"><stop offset=".55" stop-color="#1E0409" stop-opacity="0"/><stop offset="1" stop-color="#1E0409" stop-opacity=".75"/></radialGradient>' +
      '<linearGradient id="gl' + id + '" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".5" stop-color="#fff" stop-opacity=".85"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>' +
      '<filter id="bl' + id + '" x="-10%" y="-60%" width="120%" height="220%"><feGaussianBlur stdDeviation="8"/></filter>' +
      '<clipPath id="cp' + id + '"><path class="cpp"/></clipPath>' +
      '</defs>' +
      '<g class="mg">' +
      '<path class="cav" fill="url(#cv' + id + ')"/>' +
      '<g clip-path="url(#cp' + id + ')">' +
      '<ellipse class="tongue" fill="#B94A5F" opacity=".92"/>' +
      '<g>' + lt + '</g><g>' + ut + '</g><g>' + hl + '</g>' +
      '<path class="eU" fill="none" stroke="#2A060E" stroke-opacity=".55" stroke-width="30" filter="url(#bl' + id + ')"/>' +
      '<path class="eL" fill="none" stroke="#2A060E" stroke-opacity=".4" stroke-width="26" filter="url(#bl' + id + ')"/>' +
      '<rect x="0" y="0" width="600" height="470" fill="url(#vg' + id + ')"/>' +
      '<rect class="gleam" x="0" y="40" width="110" height="300" fill="url(#gl' + id + ')"/>' +
      '</g>' +
      '<path class="lipU" fill="url(#ul' + id + ')" stroke="#9E4656" stroke-opacity=".35" stroke-width="1.5" stroke-linejoin="round"/>' +
      '<path class="lipL" fill="url(#ll' + id + ')" stroke="#9E4656" stroke-opacity=".3" stroke-width="1.5" stroke-linejoin="round"/>' +
      '<path class="hiU" fill="none" stroke="#fff" stroke-opacity=".28" stroke-width="6" stroke-linecap="round"/>' +
      '<path class="hiL" fill="none" stroke="#fff" stroke-opacity=".38" stroke-width="8" stroke-linecap="round"/>' +
      '<path class="dL" fill="none" stroke="#A8566A" stroke-opacity=".55" stroke-width="3" stroke-linecap="round"/>' +
      '<path class="dR" fill="none" stroke="#A8566A" stroke-opacity=".55" stroke-width="3" stroke-linecap="round"/>' +
      sp +
      '</g></svg>';

    var q = function (s) { return host.querySelector(s); };
    var qa = function (s) { return $$(s, host); };
    var svg = q('svg'), mg = q('.mg'), cav = q('.cav'), cpp = q('.cpp');
    var lipU = q('.lipU'), lipL = q('.lipL'), hiU = q('.hiU'), hiL = q('.hiL'), dL = q('.dL'), dR = q('.dR');
    var tongue = q('.tongue'), eU = q('.eU'), eL = q('.eL');
    var UT = qa('.ut'), LT = qa('.lt'), HL = qa('.hl');
    var f = function (v) { return v.toFixed(1); };

    function upd(s, o, tx, ty, tr) {
      tx = tx || 0; ty = ty || 0; tr = tr || 0;
      var CX = 300, W = 190 + 36 * s, yu = 210 - 5 * o, cy = yu + 6 - 34 * s;
      var yl = yu + 6 + 118 * o + 30 * s, Lx = CX - W, Rx = CX + W, m = yu - cy, n = yl - cy;
      var up = 'C ' + f(Lx + W * 0.5) + ' ' + f(cy + m * 0.9) + ' ' + f(CX - W * 0.35) + ' ' + f(yu) + ' ' + CX + ' ' + f(yu) +
        ' C ' + f(CX + W * 0.35) + ' ' + f(yu) + ' ' + f(Rx - W * 0.5) + ' ' + f(cy + m * 0.9) + ' ' + f(Rx) + ' ' + f(cy);
      var upR = 'C ' + f(Rx - W * 0.5) + ' ' + f(cy + m * 0.9) + ' ' + f(CX + W * 0.35) + ' ' + f(yu) + ' ' + CX + ' ' + f(yu) +
        ' C ' + f(CX - W * 0.35) + ' ' + f(yu) + ' ' + f(Lx + W * 0.5) + ' ' + f(cy + m * 0.9) + ' ' + f(Lx) + ' ' + f(cy);
      var lo = 'C ' + f(Rx - W * 0.12) + ' ' + f(cy + n * 0.85) + ' ' + f(CX + W * 0.55) + ' ' + f(yl) + ' ' + CX + ' ' + f(yl) +
        ' C ' + f(CX - W * 0.55) + ' ' + f(yl) + ' ' + f(Lx + W * 0.12) + ' ' + f(cy + n * 0.85) + ' ' + f(Lx) + ' ' + f(cy);
      var loF = 'C ' + f(Lx + W * 0.12) + ' ' + f(cy + n * 0.85) + ' ' + f(CX - W * 0.55) + ' ' + f(yl) + ' ' + CX + ' ' + f(yl) +
        ' C ' + f(CX + W * 0.55) + ' ' + f(yl) + ' ' + f(Rx - W * 0.12) + ' ' + f(cy + n * 0.85) + ' ' + f(Rx) + ' ' + f(cy);
      var cavD = 'M ' + f(Lx) + ' ' + f(cy) + ' ' + up + ' ' + lo + ' Z';
      cav.setAttribute('d', cavD);
      cpp.setAttribute('d', cavD);
      eU.setAttribute('d', 'M ' + f(Lx) + ' ' + f(cy) + ' ' + up);
      eL.setAttribute('d', 'M ' + f(Rx) + ' ' + f(cy) + ' ' + lo);

      var utp = yu - 52 - 3 * o;
      lipU.setAttribute('d', 'M ' + f(Lx) + ' ' + f(cy) +
        ' C ' + f(Lx + W * 0.18) + ' ' + f(cy - 12) + ' ' + f(CX - W * 0.52) + ' ' + f(utp + 8) + ' ' + f(CX - W * 0.2) + ' ' + f(utp) +
        ' Q ' + f(CX - W * 0.08) + ' ' + f(utp - 3) + ' ' + CX + ' ' + f(utp + 11) +
        ' Q ' + f(CX + W * 0.08) + ' ' + f(utp - 3) + ' ' + f(CX + W * 0.2) + ' ' + f(utp) +
        ' C ' + f(CX + W * 0.52) + ' ' + f(utp + 8) + ' ' + f(Rx - W * 0.18) + ' ' + f(cy - 12) + ' ' + f(Rx) + ' ' + f(cy) + ' ' + upR + ' Z');

      var lb = yl + 66 + 10 * o;
      lipL.setAttribute('d', 'M ' + f(Lx) + ' ' + f(cy) + ' ' + loF +
        ' C ' + f(Rx - W * 0.2) + ' ' + f(cy + (lb - cy) * 0.82) + ' ' + f(CX + W * 0.5) + ' ' + f(lb) + ' ' + CX + ' ' + f(lb) +
        ' C ' + f(CX - W * 0.5) + ' ' + f(lb) + ' ' + f(Lx + W * 0.2) + ' ' + f(cy + (lb - cy) * 0.82) + ' ' + f(Lx) + ' ' + f(cy) + ' Z');

      hiU.setAttribute('d', 'M ' + f(CX - W * 0.3) + ' ' + f(utp + 20) + ' Q ' + f(CX - W * 0.16) + ' ' + f(utp + 8) + ' ' + f(CX - W * 0.05) + ' ' + f(utp + 16));
      hiL.setAttribute('d', 'M ' + f(CX - W * 0.26) + ' ' + f(yl + 28) + ' Q ' + CX + ' ' + f(yl + 40) + ' ' + f(CX + W * 0.26) + ' ' + f(yl + 28));
      dL.setAttribute('d', 'M ' + f(Lx - 2) + ' ' + f(cy + 1) + ' q -9 -3 -12 -14');
      dR.setAttribute('d', 'M ' + f(Rx + 2) + ' ' + f(cy + 1) + ' q 9 -3 12 -14');

      tongue.setAttribute('cx', CX); tongue.setAttribute('cy', f(yl - 20));
      tongue.setAttribute('rx', f(W * 0.5)); tongue.setAttribute('ry', 46);

      var sx = (W * 0.97) / 198, k, side, wgap = flaw.gap;
      for (var j = 0; j < 10; j++) {
        side = j < 5 ? -1 : 1; k = j < 5 ? 4 - j : j - 5;
        var wu = HALF[k] * sx * wgap;
        var xc = side * CEN[k] * sx;
        var edge = yu - m * Math.pow(Math.abs(xc) / W, 2);
        var bot = edge + VIS[k] * (1 + 0.08 * s) + flaw.len[j] + flaw.dy[j] * 0.6;
        var topY = cy - 80;
        var x = CX + xc + flaw.dx[j] - wu / 2;
        var r = UT[j];
        r.setAttribute('x', f(x)); r.setAttribute('y', f(topY));
        r.setAttribute('width', f(wu)); r.setAttribute('height', f(bot - topY)); r.setAttribute('rx', f(wu * 0.36));
        r.setAttribute('transform', flaw.rot[j] ? 'rotate(' + flaw.rot[j] + ' ' + f(x + wu / 2) + ' ' + f(bot - 26) + ')' : '');
        var h = HL[j];
        h.setAttribute('x', f(x + wu * 0.2)); h.setAttribute('y', f(edge + 8));
        h.setAttribute('width', f(Math.max(1, wu * 0.15))); h.setAttribute('height', f(Math.max(0, (bot - edge) * 0.5)));
        h.setAttribute('rx', f(wu * 0.07));

        var wl = HALF[k] * sx * 0.8 * wgap;
        var xcl = side * CEN[k] * sx * 0.82;
        var edgeL = yl - n * Math.pow(Math.abs(xcl) / W, 2);
        var topL = edgeL - VISL[k] - flaw.len[j] * 0.2;
        var xl = CX + xcl + flaw.dx[j] * 0.6 - wl / 2;
        var rl = LT[j];
        rl.setAttribute('x', f(xl)); rl.setAttribute('y', f(topL));
        rl.setAttribute('width', f(wl)); rl.setAttribute('height', 90); rl.setAttribute('rx', f(wl * 0.34));
        rl.setAttribute('transform', flaw.rot[j] ? 'rotate(' + (-flaw.rot[j] * 0.6) + ' ' + f(xl + wl / 2) + ' ' + f(topL + 20) + ')' : '');
      }
      mg.setAttribute('transform', 'translate(' + f(tx) + ' ' + f(ty) + ') rotate(' + f(tr) + ' 300 240)');
    }

    function glint() {
      svg.classList.remove('glint');
      void svg.getBoundingClientRect();
      svg.classList.add('glint');
    }
    function setTooth(hex) {
      var set = function (c, v) { var e = q(c); if (e) e.setAttribute('stop-color', v); };
      set('.t0', mix(hex, '#000000', 0.07)); set('.t1', hex); set('.t2', mix(hex, '#8A7A5A', 0.12));
      set('.l0', mix(hex, '#000000', 0.12)); set('.l1', mix(hex, '#000000', 0.04));
    }

    upd(opt.s !== undefined ? opt.s : 0.92, opt.o !== undefined ? opt.o : 0.1);
    return { upd: upd, glint: glint, setTooth: setTooth, svg: svg };
  }

  /* ---------- hero: the talking, smiling mouth ---------- */
  var heroHost = $('#heroMouth');
  var hero = createMouth(heroHost, { tooth: '#FEFEFC', s: 0.45, o: 0.02 });
  var stage = $('#stage');
  var heroSec = $('#top');

  if (reduced) {
    hero.upd(1, 0.12);
  } else {
    var cs = 0.45, co = 0.02, t0 = performance.now(), last = t0, prev = 0;
    var px = 0, py = 0, tx = 0, ty = 0, visible = true;
    var LOOP = 10;
    window.addEventListener('pointermove', function (e) {
      px = (e.clientX / window.innerWidth - 0.5) * 2;
      py = (e.clientY / window.innerHeight - 0.5) * 2;
    }, { passive: true });
    new IntersectionObserver(function (es) { visible = es[0].isIntersecting; }, { threshold: 0.05 }).observe(heroSec);

    var frame = function (now) {
      requestAnimationFrame(frame);
      if (!visible || document.hidden) { last = now; return; }
      var dt = Math.min(0.05, (now - last) / 1000); last = now;
      var t = ((now - t0) / 1000) % LOOP, s, o;
      if (t < 1.4) { s = 0.42 + 0.05 * Math.sin(t * 2); o = 0.02; }
      else if (t < 5) {
        var k = t - 1.4;
        var gate = Math.min(1, k / 0.35) * Math.min(1, (5 - t) / 0.35);
        var env = Math.abs(Math.sin(k * 5.6)) * (0.55 + 0.45 * Math.sin(k * 1.9 + 1)) + 0.1 * Math.abs(Math.sin(k * 12));
        o = env * 0.5 * gate; s = 0.5 + 0.08 * Math.sin(k * 3);
      }
      else if (t < 5.9) { s = 1; o = 0.14; }
      else if (t < 8.2) { s = 1; o = 0.1 + 0.03 * Math.sin(t * 3); }
      else { s = 0.46; o = 0.02; }
      if (prev < 5 && t >= 5) hero.glint();
      prev = t;
      var kk = 1 - Math.exp(-dt * 14), kp = 1 - Math.exp(-dt * 4);
      cs += (s - cs) * kk; co += (o - co) * kk;
      tx += (px * 14 - tx) * kp; ty += (py * 9 - ty) * kp;
      hero.upd(cs, co, tx, ty, tx * 0.12);
    };
    requestAnimationFrame(frame);

    var smileNow = function () { t0 = performance.now() - 5000; prev = 5; hero.glint(); };
    heroHost.addEventListener('click', smileNow);

    var bg = $('#heroBg');
    for (var p = 0; p < 16; p++) {
      var d = document.createElement('i');
      d.style.setProperty('--x', (Math.random() * 100).toFixed(1) + '%');
      d.style.setProperty('--s', (2 + Math.random() * 4).toFixed(1) + 'px');
      d.style.setProperty('--t', (9 + Math.random() * 10).toFixed(1) + 's');
      d.style.setProperty('--dl', (-Math.random() * 14).toFixed(1) + 's');
      bg.appendChild(d);
    }
  }

  /* ---------- language ---------- */
  var track = $('#track');
  track.innerHTML += track.innerHTML;

  function fill() {
    $$('[data-slots]').forEach(function (e) { e.textContent = CONFIG.slotsLeft; });
    $$('[data-bonus-left]').forEach(function (e) { e.textContent = CONFIG.bonusLeft; });
    var now = new Date(), end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    var days = Math.max(1, end.getDate() - now.getDate() + 1);
    $$('[data-days]').forEach(function (e) { e.textContent = days; });
    var m = $('#meterFill');
    if (m) m.style.width = ((CONFIG.bonusTotal - CONFIG.bonusLeft) / CONFIG.bonusTotal * 100) + '%';
  }

  function apply(l) {
    lang = l;
    document.documentElement.lang = l;
    try { localStorage.setItem('solmar-lang', l); } catch (e) {}
    $$('[data-es]').forEach(function (el) {
      if (el.getAttribute('data-en') === null) el.setAttribute('data-en', el.innerHTML);
      el.innerHTML = l === 'es' ? el.getAttribute('data-es') : el.getAttribute('data-en');
    });
    $$('[data-es-ph]').forEach(function (el) {
      if (el.getAttribute('data-en-ph') === null) el.setAttribute('data-en-ph', el.getAttribute('placeholder'));
      el.setAttribute('placeholder', l === 'es' ? el.getAttribute('data-es-ph') : el.getAttribute('data-en-ph'));
    });
    $$('[data-es-label]').forEach(function (el) {
      if (el.getAttribute('data-en-label') === null) el.setAttribute('data-en-label', el.getAttribute('aria-label'));
      el.setAttribute('aria-label', l === 'es' ? el.getAttribute('data-es-label') : el.getAttribute('data-en-label'));
    });
    $$('[data-lang]').forEach(function (b) { b.setAttribute('aria-pressed', b.getAttribute('data-lang') === l ? 'true' : 'false'); });
    fill(); setWA(); renderCounts(); calc();
  }
  $$('[data-lang]').forEach(function (b) { b.addEventListener('click', function () { apply(b.getAttribute('data-lang')); }); });

  /* ---------- WhatsApp links ---------- */
  function msgFor(topic) {
    return lang === 'es'
      ? 'Hola, me gustaría reservar mi escáner 3D gratis.' + (topic ? ' Me interesa: ' + topic + '.' : '')
      : 'Hello! I would like to book my free 3D scan.' + (topic ? ' I am interested in: ' + topic + '.' : '');
  }
  function waHref(msg) { return CONFIG.demo ? '#visit' : 'https://wa.me/' + CONFIG.whatsapp + '?text=' + encodeURIComponent(msg); }
  function setWA() {
    $$('[data-wa]').forEach(function (a) {
      a.setAttribute('href', waHref(msgFor(a.getAttribute('data-wa'))));
      if (!CONFIG.demo) { a.setAttribute('target', '_blank'); a.setAttribute('rel', 'noopener'); }
    });
  }

  /* ---------- counters ---------- */
  function fmt(n, dec) {
    return n.toLocaleString(lang === 'es' ? 'es-ES' : 'en-GB', { minimumFractionDigits: dec, maximumFractionDigits: dec });
  }
  var counters = $$('[data-count]');
  counters.forEach(function (el) { el._to = parseFloat(el.getAttribute('data-count')); el._dec = parseInt(el.getAttribute('data-dec') || '0', 10); el._done = reduced; });
  function renderCounts() { counters.forEach(function (el) { if (el._done) el.textContent = fmt(el._to, el._dec); }); }
  function runCount(el) {
    var s = performance.now(), dur = 1700;
    (function step(now) {
      var p = Math.min(1, (now - s) / dur), e = 1 - Math.pow(1 - p, 3);
      el.textContent = fmt(el._to * e, el._dec);
      if (p < 1) requestAnimationFrame(step); else el._done = true;
    })(s);
  }

  /* ---------- reveal on scroll ---------- */
  $$('[data-stagger]').forEach(function (g) {
    Array.prototype.forEach.call(g.children, function (c, i) { c.style.setProperty('--d', (i * 90) + 'ms'); });
  });
  var io = new IntersectionObserver(function (es) {
    es.forEach(function (e) {
      if (!e.isIntersecting) return;
      e.target.classList.add('in');
      if (e.target.hasAttribute('data-count') && !e.target._done) runCount(e.target);
      io.unobserve(e.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
  $$('.rv').forEach(function (el) { io.observe(el); });
  counters.forEach(function (el) { if (!reduced) io.observe(el); });

  /* ---------- nav, progress, menu ---------- */
  var nav = $('#nav'), prog = $('#progress'), burger = $('#burger'), menu = $('#menu'), ticking = false;
  window.addEventListener('scroll', function () {
    if (ticking) return; ticking = true;
    requestAnimationFrame(function () {
      var y = window.scrollY, h = document.documentElement.scrollHeight - window.innerHeight;
      nav.classList.toggle('scrolled', y > 24 || menu.classList.contains('open'));
      prog.style.setProperty('--w', (h > 0 ? y / h * 100 : 0) + '%');
      ticking = false;
    });
  }, { passive: true });
  $$('#menu li a').forEach(function (a, i) { a.style.setProperty('--i', i); });
  function setMenu(o) {
    menu.classList.toggle('open', o);
    burger.setAttribute('aria-expanded', o ? 'true' : 'false');
    document.body.classList.toggle('noscroll', o);
    nav.classList.toggle('scrolled', o || window.scrollY > 24);
  }
  burger.addEventListener('click', function () { setMenu(!menu.classList.contains('open')); });
  menu.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setMenu(false); });

  /* ---------- treatment card glow ---------- */
  $$('.t-card').forEach(function (c) {
    c.addEventListener('pointermove', function (e) {
      var r = c.getBoundingClientRect();
      c.style.setProperty('--mx', (e.clientX - r.left) + 'px');
      c.style.setProperty('--my', (e.clientY - r.top) + 'px');
    });
  });

  /* ---------- shade studio ---------- */
  var shade = createMouth($('#shadeMouth'), { tooth: '#F3ECDA', s: 0.95, o: 0.12 });
  $$('.sw').forEach(function (b) {
    b.addEventListener('click', function () {
      $$('.sw').forEach(function (x) { x.classList.remove('on'); x.setAttribute('aria-checked', 'false'); });
      b.classList.add('on'); b.setAttribute('aria-checked', 'true');
      shade.setTooth(b.getAttribute('data-hex'));
      $('#shadeCode').textContent = b.getAttribute('data-code');
      shade.glint();
    });
  });

  /* ---------- before / after ---------- */
  var CASES = {
    whiten: { b: { tooth: '#D9C27F', flaw: 'none' }, a: { tooth: '#FFFFFF', flaw: 'none' } },
    veneers: { b: { tooth: '#D6CBA8', flaw: 'worn' }, a: { tooth: '#FCFCFA', flaw: 'none' } },
    align: { b: { tooth: '#F1ECDA', flaw: 'crooked' }, a: { tooth: '#FAF9F3', flaw: 'none' } }
  };
  var box = $('#baBox'), range = $('#baRange');
  function mountSide(id, o) {
    var side = $(id);
    side.innerHTML = '<div class="mouth-host"></div>';
    createMouth(side.firstChild, { tooth: o.tooth, flaw: o.flaw, s: 0.95, o: 0.12 });
  }
  function setCase(n) {
    mountSide('#baBefore', CASES[n].b);
    mountSide('#baAfter', CASES[n].a);
    $$('.tab').forEach(function (t) { var on = t.getAttribute('data-case') === n; t.classList.toggle('on', on); t.setAttribute('aria-selected', on ? 'true' : 'false'); });
    $$('.case').forEach(function (c) { c.classList.toggle('on', c.getAttribute('data-case') === n); });
  }
  $$('.tab').forEach(function (t) { t.addEventListener('click', function () { setCase(t.getAttribute('data-case')); }); });
  range.addEventListener('input', function () { box.style.setProperty('--p', range.value + '%'); });
  setCase('whiten');
  if (!reduced) {
    var hinted = false;
    new IntersectionObserver(function (es, ob) {
      if (!es[0].isIntersecting || hinted) return;
      hinted = true; ob.disconnect();
      var s = performance.now(), dur = 2600;
      (function step(now) {
        var p = Math.min(1, (now - s) / dur);
        var v = 50 + Math.sin(p * Math.PI * 2) * 30 * (1 - p * 0.3);
        range.value = v; box.style.setProperty('--p', v + '%');
        if (p < 1) requestAnimationFrame(step);
      })(s);
    }, { threshold: 0.5 }).observe(box);
  }

  /* ---------- financing calculator ---------- */
  var total = $('#calcTotal'), outEl = $('#calcOut'), totOut = $('#calcTotalOut'), months = 24;
  function money(n) { return '€' + Math.round(n).toLocaleString(lang === 'es' ? 'es-ES' : 'en-GB'); }
  function calc() {
    var v = parseFloat(total.value), mn = parseFloat(total.min), mx = parseFloat(total.max);
    total.style.setProperty('--p', ((v - mn) / (mx - mn) * 100) + '%');
    totOut.textContent = money(v);
    outEl.textContent = money(v / months);
  }
  total.addEventListener('input', calc);
  $$('#calcMonths button').forEach(function (b) {
    b.addEventListener('click', function () {
      months = parseInt(b.getAttribute('data-m'), 10);
      $$('#calcMonths button').forEach(function (x) { var on = x === b; x.classList.toggle('on', on); x.setAttribute('aria-checked', on ? 'true' : 'false'); });
      calc();
    });
  });

  /* ---------- reviews strip ---------- */
  var strip = $('#strip');
  $('#rPrev').addEventListener('click', function () { strip.scrollBy({ left: -strip.clientWidth * 0.8, behavior: 'smooth' }); });
  $('#rNext').addEventListener('click', function () { strip.scrollBy({ left: strip.clientWidth * 0.8, behavior: 'smooth' }); });

  /* ---------- booking form ---------- */
  var form = $('#bookForm'), errEl = $('#formErr'), okEl = $('#formOk');
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    errEl.textContent = ''; okEl.hidden = true;
    var name = $('#fname').value.trim(), digits = $('#fphone').value.replace(/\D/g, '');
    if (!name) { errEl.textContent = T('Please add your name.', 'Por favor, escribe tu nombre.'); $('#fname').focus(); return; }
    if (digits.length < 7) { errEl.textContent = T('Please add a valid WhatsApp number.', 'Por favor, escribe un número de WhatsApp válido.'); $('#fphone').focus(); return; }
    if (!$('#fok').checked) { errEl.textContent = T('Please tick the box so we can reply on WhatsApp.', 'Marca la casilla para que podamos responderte por WhatsApp.'); return; }
    var step = form.elements['step'].value, time = form.elements['time'].value, treat = $('#ftreat').value;
    var msg = T('Hello, I am ' + name + '. ', 'Hola, soy ' + name + '. ') + msgFor(step + ' / ' + treat + ' / ' + time);
    if (CONFIG.demo) {
      okEl.innerHTML = '';
      var b = document.createElement('b'); b.textContent = T('Thank you, ', 'Gracias, ') + name + '.';
      var sp = document.createElement('span');
      sp.textContent = T('This is your confirmation screen. On the live site this button opens WhatsApp with your details already written.',
        'Esta es tu pantalla de confirmación. En la web real, este botón abre WhatsApp con tus datos ya escritos.');
      okEl.appendChild(b); okEl.appendChild(sp); okEl.hidden = false;
    } else {
      window.open(waHref(msg), '_blank', 'noopener');
    }
  });

  /* ---------- cookie notice ---------- */
  var cookie = $('#cookie');
  function dismiss(v) { cookie.hidden = true; try { localStorage.setItem('solmar-cookie', v); } catch (e) {} }
  try { if (!localStorage.getItem('solmar-cookie')) cookie.hidden = false; } catch (e) { cookie.hidden = false; }
  $('#cookieAccept').addEventListener('click', function () { dismiss('yes'); });
  $('#cookieReject').addEventListener('click', function () { dismiss('no'); });

  /* ---------- pitch mode (explains the sales psychology) ---------- */
  $$('[data-psy]').forEach(function (el) {
    var t = document.createElement('span');
    t.className = 'psy-tag'; t.textContent = el.getAttribute('data-psy');
    el.appendChild(t);
  });
  var pitch = $('#pitchBtn');
  pitch.addEventListener('click', function () {
    var on = document.body.classList.toggle('pitching');
    pitch.setAttribute('aria-pressed', on ? 'true' : 'false');
  });

  /* ---------- go ---------- */
  apply(lang);
})();
