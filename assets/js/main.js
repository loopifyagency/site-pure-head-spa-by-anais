/* ==========================================================================
   PURE HEAD SPA by Anaïs — mouvement
   GSAP + ScrollTrigger + Lenis. Tout est visible par défaut : le JS
   n'ajoute des états de départ que lorsqu'il sait les animer.
   ========================================================================== */
(() => {
  'use strict';

  const root = document.documentElement;
  const body = document.body;
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));
  const NS = 'http://www.w3.org/2000/svg';
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const hasGsap = !!(window.gsap && window.ScrollTrigger);
  const motion = hasGsap && !reduce;

  if (!motion) root.classList.add('no-motion');

  /* ------------------------------------------------------------------
     Éventail à fils de laiton : le fil rouge du site, dessiné en code
     ------------------------------------------------------------------ */
  function buildFan(svg) {
    const mk = (tag, attrs) => {
      const el = document.createElementNS(NS, tag);
      Object.keys(attrs).forEach((k) => el.setAttribute(k, attrs[k]));
      return el;
    };
    const cx = 100, cy = 100;
    svg.appendChild(mk('path', { class: 'fan__arch', pathLength: 1, d: 'M10 120V100A90 90 0 0 1 190 100V120' }));
    svg.appendChild(mk('path', { class: 'fan__arch', pathLength: 1, d: 'M78 100A22 22 0 0 1 122 100' }));
    const rays = 21;
    for (let i = 0; i < rays; i++) {
      const a = (6 + i * (168 / (rays - 1))) * Math.PI / 180;
      const r1 = 28, r2 = i % 2 ? 70 : 86;
      svg.appendChild(mk('path', {
        class: 'fan__ray', pathLength: 1,
        d: `M${(cx + r1 * Math.cos(a)).toFixed(2)} ${(cy - r1 * Math.sin(a)).toFixed(2)}L${(cx + r2 * Math.cos(a)).toFixed(2)} ${(cy - r2 * Math.sin(a)).toFixed(2)}`
      }));
    }
    svg.appendChild(mk('path', { class: 'fan__base', pathLength: 1, d: 'M4 120H196' }));
  }
  $$('[data-fan]').forEach(buildFan);

  /* Tresse de jute (séparateur) */
  (function buildBraid() {
    const svg = $('.braid svg');
    if (!svg) return;
    const W = 1600, H = 30;
    svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
    const wave = (phase) => {
      let d = '';
      for (let x = 0; x <= W; x += 8) {
        const y = H / 2 + Math.sin((x / 80) * Math.PI * 2 + phase) * 9;
        d += (x ? 'L' : 'M') + x + ' ' + y.toFixed(2);
      }
      return d;
    };
    const a = $('.braid__a', svg), b = $('.braid__b', svg);
    a.setAttribute('d', wave(0)); b.setAttribute('d', wave(Math.PI));
    a.setAttribute('pathLength', 1); b.setAttribute('pathLength', 1);
  })();

  /* ------------------------------------------------------------------
     Utilitaires de découpe de texte
     ------------------------------------------------------------------ */
  function splitWords(el, masked = true) {
    const label = el.textContent.replace(/\s+/g, ' ').trim();
    const walk = (node) => {
      Array.from(node.childNodes).forEach((n) => {
        if (n.nodeType === 3) {
          const frag = document.createDocumentFragment();
          n.textContent.split(/([ \t\r\n]+)/).forEach((part) => {
            if (!part) return;
            if (/^[ \t\r\n]+$/.test(part)) { frag.appendChild(document.createTextNode(' ')); return; }
            const inner = document.createElement('span');
            inner.className = 'wi';
            inner.textContent = part;
            if (masked) {
              const w = document.createElement('span');
              w.className = 'w';
              w.setAttribute('aria-hidden', 'true');
              w.appendChild(inner);
              frag.appendChild(w);
            } else {
              inner.className = 'sw';
              frag.appendChild(inner);
            }
          });
          n.replaceWith(frag);
        } else if (n.nodeType === 1) walk(n);
      });
    };
    walk(el);
    if (masked) el.setAttribute('aria-label', label);
    return $$(masked ? '.wi' : '.sw', el);
  }

  function splitChars(el) {
    const text = el.textContent;
    el.setAttribute('aria-label', text.trim());
    el.textContent = '';
    Array.from(text).forEach((c) => {
      if (c === ' ') { el.appendChild(document.createTextNode(' ')); return; }
      const s = document.createElement('span');
      s.className = 'ch';
      s.setAttribute('aria-hidden', 'true');
      s.textContent = c;
      el.appendChild(s);
    });
    return $$('.ch', el);
  }

  /* ------------------------------------------------------------------
     Horaires : statut du jour et ligne du jour
     ------------------------------------------------------------------ */
  const SCHEDULE = { 1: [570, 1080], 2: [570, 1080], 4: [570, 1080], 5: [570, 1080], 6: [600, 780] };
  const DAYS = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];
  const fmt = (m) => { const h = Math.floor(m / 60), mm = m % 60; return h + 'h' + (mm ? String(mm).padStart(2, '0') : ''); };

  function parisNow() {
    try {
      const parts = new Intl.DateTimeFormat('en-US', { timeZone: 'Europe/Paris', weekday: 'short', hour: 'numeric', minute: 'numeric', hourCycle: 'h23' }).formatToParts(new Date());
      const get = (t) => parts.find((p) => p.type === t).value;
      const day = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 }[get('weekday')];
      return { day, min: parseInt(get('hour'), 10) * 60 + parseInt(get('minute'), 10) };
    } catch (e) {
      const d = new Date();
      return { day: d.getDay(), min: d.getHours() * 60 + d.getMinutes() };
    }
  }

  function updateStatus() {
    const { day, min } = parisNow();
    let state = 'closed', text;
    const today = SCHEDULE[day];
    if (today && min >= today[0] && min < today[1]) {
      state = 'open';
      text = 'Ouvert · jusqu’à ' + fmt(today[1]);
    } else if (today && min < today[0]) {
      text = 'Fermé · ouvre aujourd’hui à ' + fmt(today[0]);
    } else if (!today) {
      text = DAYS[day].charAt(0).toUpperCase() + DAYS[day].slice(1) + ' · horaires sur appel';
    } else {
      let next = null;
      for (let d = 1; d <= 7; d++) {
        const nd = (day + d) % 7;
        if (SCHEDULE[nd]) { next = { d, nd }; break; }
      }
      text = 'Fermé · prochaine ouverture connue : ' + (next.d === 1 ? 'demain' : DAYS[next.nd]) + ' à ' + fmt(SCHEDULE[next.nd][0]);
    }
    $$('[data-status]').forEach((el) => { el.dataset.state = state; $('span', el).textContent = text; });
    $$('.hours tr').forEach((tr) => tr.classList.toggle('is-today', Number(tr.dataset.day) === day));
  }
  updateStatus();
  setInterval(updateStatus, 60000);

  /* ------------------------------------------------------------------
     FAQ (accordéon)
     ------------------------------------------------------------------ */
  $$('.qa').forEach((qa) => {
    const btn = $('button', qa);
    btn.addEventListener('click', () => {
      const open = btn.getAttribute('aria-expanded') === 'true';
      $$('.qa').forEach((o) => { o.classList.remove('is-open'); $('button', o).setAttribute('aria-expanded', 'false'); });
      if (!open) { qa.classList.add('is-open'); btn.setAttribute('aria-expanded', 'true'); }
      if (hasGsap) setTimeout(() => ScrollTrigger.refresh(), 850);
    });
  });

  /* ------------------------------------------------------------------
     Avis : défilement, boutons, barre, glisser à la souris
     ------------------------------------------------------------------ */
  (function reviews() {
    const sc = $('#reviews-scroller');
    if (!sc) return;
    const bar = $('.reviews__bar i');
    const cards = $$('.review', sc);
    const step = () => (cards[0].getBoundingClientRect().width + 24);
    const upd = () => {
      const max = sc.scrollWidth - sc.clientWidth;
      const ratio = max > 0 ? sc.scrollLeft / max : 1;
      const vis = sc.clientWidth / sc.scrollWidth;
      bar.style.transform = 'scaleX(' + (vis + (1 - vis) * ratio).toFixed(4) + ')';
    };
    sc.addEventListener('scroll', upd, { passive: true });
    window.addEventListener('resize', upd);
    upd();
    $('#rev-prev').addEventListener('click', () => sc.scrollBy({ left: -step(), behavior: reduce ? 'auto' : 'smooth' }));
    $('#rev-next').addEventListener('click', () => sc.scrollBy({ left: step(), behavior: reduce ? 'auto' : 'smooth' }));

    let down = false, startX = 0, startL = 0, moved = 0;
    sc.addEventListener('pointerdown', (e) => {
      if (e.pointerType !== 'mouse') return;
      down = true; moved = 0; startX = e.clientX; startL = sc.scrollLeft;
    });
    window.addEventListener('pointermove', (e) => {
      if (!down) return;
      const dx = e.clientX - startX;
      moved = Math.max(moved, Math.abs(dx));
      if (moved > 4) sc.classList.add('is-drag');
      sc.scrollLeft = startL - dx;
    });
    window.addEventListener('pointerup', () => { down = false; sc.classList.remove('is-drag'); });
  })();

  /* ------------------------------------------------------------------
     Menu mobile
     ------------------------------------------------------------------ */
  let lenis = null;
  const burger = $('#burger');
  const menu = $('#menu');
  let menuOpen = false;
  function setMenu(open) {
    menuOpen = open;
    root.classList.toggle('menu-open', open);
    menu.classList.toggle('is-open', open);
    menu.toggleAttribute('inert', !open);
    menu.setAttribute('aria-hidden', String(!open));
    burger.setAttribute('aria-expanded', String(open));
    $('.sr-only', burger).textContent = open ? 'Fermer le menu' : 'Ouvrir le menu';
    if (lenis) open ? lenis.stop() : lenis.start();
    else body.style.overflow = open ? 'hidden' : '';
    if (open && window.gsap) gsap.to('#nav', { yPercent: 0, duration: .4, overwrite: true });
  }
  burger.addEventListener('click', () => setMenu(!menuOpen));
  window.addEventListener('keydown', (e) => { if (e.key === 'Escape' && menuOpen) { setMenu(false); burger.focus(); } });
  window.matchMedia('(min-width: 900px)').addEventListener('change', (e) => { if (e.matches && menuOpen) setMenu(false); });

  /* Ancres : défilement fluide et focus accessible */
  $$('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      if (id.length < 2) return;
      const target = $(id);
      if (!target) return;
      e.preventDefault();
      if (menuOpen) setMenu(false);
      const go = () => {
        if (lenis) lenis.scrollTo(id === '#hero' ? 0 : target, { duration: 1.6, offset: id === '#hero' ? 0 : -10 });
        else target.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
        target.setAttribute('tabindex', '-1');
        target.focus({ preventScroll: true });
      };
      menuOpen ? setTimeout(go, 350) : go();
    });
  });

  /* ==================================================================
     Tout ce qui suit demande du mouvement
     ================================================================== */
  if (!motion) {
    const loader = $('#loader');
    if (loader) loader.remove();
    const nav0 = $('#nav'), call = $('#float-call');
    const onScroll = () => {
      nav0.classList.toggle('is-solid', window.scrollY > 40);
      call.classList.toggle('is-on', window.scrollY > window.innerHeight * .8);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return;
  }

  gsap.registerPlugin(ScrollTrigger);
  gsap.defaults({ ease: 'power3.out' });
  gsap.config({ nullTargetWarn: false });
  ScrollTrigger.config({ ignoreMobileResize: true });

  /* Smooth scroll (Lenis) branché sur ScrollTrigger */
  if (window.Lenis) {
    lenis = new Lenis({ duration: 1.15, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), wheelMultiplier: .95 });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((t) => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
    lenis.stop();
  }
  body.classList.add('is-loading');

  const mm = gsap.matchMedia();
  const EXPO = 'expo.out';

  /* ------------------------------------------------------------------
     États de départ du hero (le chargeur les cache)
     ------------------------------------------------------------------ */
  const pureChars = splitChars($('.hero__pure'));
  gsap.set(pureChars, { yPercent: 118, rotate: 5 });
  gsap.set('.hero__sub', { opacity: 0, y: 20 });
  gsap.set('.hero__arch', { clipPath: 'inset(100% 0% 0% 0%)' });
  gsap.set('.hero__arch img', { scale: 1.4 });
  gsap.set('.hero__copy > *', { opacity: 0, y: 36 });
  gsap.set('.hero__badge', { opacity: 0, scale: .5, rotate: -80 });
  gsap.set('.hero__fan [class^="fan__"]', { strokeDasharray: 1, strokeDashoffset: 1 });
  gsap.set('#nav', { yPercent: -120 });
  gsap.set('.hero__scroll', { opacity: 0 });

  /* ------------------------------------------------------------------
     Chargeur
     ------------------------------------------------------------------ */
  function runLoader() {
    return new Promise((resolve) => {
      const loader = $('#loader');
      const count = $('#loader-count');
      const fanParts = $$('.loader__fan [class^="fan__"]');
      gsap.set(fanParts, { strokeDasharray: 1, strokeDashoffset: 1 });
      const counter = { v: 0 };
      const tl = gsap.timeline({ onComplete: resolve });
      tl.to(fanParts, { strokeDashoffset: 0, duration: 1.5, ease: 'power3.inOut', stagger: { each: .035, from: 'center' } }, 0.1)
        .to('.loader__line', { y: 0, yPercent: 0, duration: 1.2, ease: EXPO }, 0.35)
        .to('.loader__sub', { opacity: 1, duration: 1 }, 0.9)
        .to('.loader__count', { opacity: .7, duration: .6 }, 0.5)
        .to(counter, { v: 100, duration: 2, ease: 'power2.inOut', onUpdate: () => { count.textContent = Math.round(counter.v); } }, 0.2)
        .to('.loader__panel > *', { y: -26, opacity: 0, duration: .7, ease: 'power3.in', stagger: .06 }, 2.35)
        .to(loader, { yPercent: -100, duration: 1.25, ease: 'expo.inOut' }, 2.55)
        .set(loader, { display: 'none' });
      tl.add(() => resolve(), 2.95); // le hero démarre avant la fin du rideau
    });
  }

  function heroIntro() {
    const tl = gsap.timeline({ defaults: { ease: EXPO } });
    tl.to(pureChars, { yPercent: 0, rotate: 0, duration: 1.7, stagger: .085 }, 0)
      .to('.hero__arch', { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.7, ease: 'expo.inOut' }, 0.1)
      .to('.hero__arch img', { scale: 1, duration: 2.6 }, 0.1)
      .to('.hero__fan [class^="fan__"]', { strokeDashoffset: 0, duration: 2.2, ease: 'power3.inOut', stagger: { each: .04, from: 'center' } }, 0.1)
      .to('.hero__sub', { opacity: 1, y: 0, duration: 1.2 }, 0.7)
      .to('.hero__copy > *', { opacity: 1, y: 0, duration: 1.3, stagger: .12 }, 0.6)
      .to('.hero__badge', { opacity: 1, scale: 1, rotate: 0, duration: 1.6 }, 0.9)
      .to('#nav', { yPercent: 0, duration: 1.3 }, 0.9)
      .to('.hero__scroll', { opacity: 1, duration: 1 }, 1.6);
    return tl;
  }

  /* ------------------------------------------------------------------
     Navigation, progression, bouton d'appel flottant
     ------------------------------------------------------------------ */
  const nav = $('#nav');
  let navShown = true;
  function showNav(show) {
    if (show === navShown) return;
    navShown = show;
    gsap.to(nav, { yPercent: show ? 0 : -115, duration: .8, ease: EXPO, overwrite: true });
  }
  ScrollTrigger.create({
    start: 0, end: 'max',
    onUpdate: (self) => {
      const y = self.scroll();
      nav.classList.toggle('is-solid', y > 40);
      if (menuOpen) return;
      if (self.direction === 1 && y > 260) showNav(false);
      else if (self.direction === -1) showNav(true);
    }
  });
  nav.addEventListener('focusin', () => showNav(true));
  gsap.to('.progress i', { scaleX: 1, ease: 'none', scrollTrigger: { start: 0, end: 'max', scrub: true } });
  const floatCall = $('#float-call');
  ScrollTrigger.create({
    trigger: '#hero', start: 'bottom 45%', endTrigger: '#rdv', end: 'top 75%',
    onToggle: (self) => floatCall.classList.toggle('is-on', self.isActive)
  });

  /* ------------------------------------------------------------------
     Curseur « halo », boutons magnétiques, inclinaison 3D
     ------------------------------------------------------------------ */
  if (fine) {
    root.classList.add('has-cursor');
    const cur = $('.cursor');
    const label = $('span', cur);
    const cx = gsap.quickTo(cur, 'x', { duration: .45, ease: 'power3' });
    const cy = gsap.quickTo(cur, 'y', { duration: .45, ease: 'power3' });
    window.addEventListener('pointermove', (e) => { cx(e.clientX); cy(e.clientY); cur.classList.add('is-on'); }, { passive: true });
    document.addEventListener('pointerleave', () => cur.classList.remove('is-on'));
    document.addEventListener('pointerover', (e) => {
      const t = e.target.closest('[data-cursor]');
      const clickable = e.target.closest('a, button');
      if (t) { label.textContent = t.dataset.cursor; cur.classList.add('is-label'); gsap.to(cur, { scale: 1.9, duration: .5 }); }
      else { cur.classList.remove('is-label'); gsap.to(cur, { scale: clickable ? 1.4 : 1, duration: .5 }); }
    });

    $$('[data-magnetic]').forEach((el) => {
      const inner = $('span', el);
      const mx = gsap.quickTo(el, 'x', { duration: .8, ease: 'elastic.out(1, .5)' });
      const my = gsap.quickTo(el, 'y', { duration: .8, ease: 'elastic.out(1, .5)' });
      const ix = inner ? gsap.quickTo(inner, 'x', { duration: .8, ease: 'elastic.out(1, .5)' }) : null;
      const iy = inner ? gsap.quickTo(inner, 'y', { duration: .8, ease: 'elastic.out(1, .5)' }) : null;
      el.addEventListener('pointermove', (e) => {
        const r = el.getBoundingClientRect();
        const dx = e.clientX - (r.left + r.width / 2), dy = e.clientY - (r.top + r.height / 2);
        mx(dx * .28); my(dy * .38);
        if (ix) { ix(dx * .12); iy(dy * .16); }
      });
      el.addEventListener('pointerleave', () => { mx(0); my(0); if (ix) { ix(0); iy(0); } });
    });

    $$('[data-tilt]').forEach((el) => {
      const rx = gsap.quickTo(el, 'rotationX', { duration: .7, ease: 'power3' });
      const ry = gsap.quickTo(el, 'rotationY', { duration: .7, ease: 'power3' });
      gsap.set(el, { transformPerspective: 900 });
      el.addEventListener('pointermove', (e) => {
        const r = el.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
        ry((px - .5) * 11); rx(-(py - .5) * 11);
        el.style.setProperty('--mx', (px * 100) + '%');
        el.style.setProperty('--my', (py * 100) + '%');
      });
      el.addEventListener('pointerleave', () => { rx(0); ry(0); });
    });
  }

  /* ------------------------------------------------------------------
     Hero : parallaxe multicouche (souris + défilement)
     ------------------------------------------------------------------ */
  const hero = $('#hero');
  if (fine) {
    const layers = $$('[data-depth]', hero).map((el) => ({
      qx: gsap.quickTo(el, 'x', { duration: 1.2, ease: 'power3' }),
      qy: gsap.quickTo(el, 'y', { duration: 1.2, ease: 'power3' }),
      d: parseFloat(el.dataset.depth)
    }));
    hero.addEventListener('pointermove', (e) => {
      const nx = e.clientX / window.innerWidth - .5, ny = e.clientY / window.innerHeight - .5;
      layers.forEach((l) => { l.qx(-nx * l.d * 2); l.qy(-ny * l.d * 2); });
    });
    hero.addEventListener('pointerleave', () => layers.forEach((l) => { l.qx(0); l.qy(0); }));
  }
  const heroScrub = { trigger: hero, start: 'top top', end: 'bottom top', scrub: true };
  gsap.to('.hero__fan', { yPercent: 18, scale: 1.08, ease: 'none', scrollTrigger: heroScrub });
  gsap.to('.hero__arch', { yPercent: -12, ease: 'none', scrollTrigger: heroScrub });
  gsap.to('.hero__arch img', { yPercent: 9, ease: 'none', scrollTrigger: heroScrub });
  gsap.to('.hero__title', { yPercent: -7, ease: 'none', scrollTrigger: heroScrub });
  gsap.to('.hero__copy', { yPercent: -22, opacity: .0, ease: 'none', scrollTrigger: { ...heroScrub, end: 'bottom 30%' } });
  gsap.to('.hero__badge', { yPercent: -60, ease: 'none', scrollTrigger: heroScrub });

  /* Parallaxe générique des éléments flottants */
  $$('[data-parallax]').forEach((el) => {
    if (el.closest('.hero')) return;
    gsap.fromTo(el, { yPercent: -parseFloat(el.dataset.parallax) }, {
      yPercent: parseFloat(el.dataset.parallax), ease: 'none',
      scrollTrigger: { trigger: el.closest('section'), start: 'top bottom', end: 'bottom top', scrub: true }
    });
  });

  /* ------------------------------------------------------------------
     Titres : montée mot par mot
     ------------------------------------------------------------------ */
  $$('[data-split]').forEach((h) => {
    const words = splitWords(h);
    gsap.from(words, {
      yPercent: 115, duration: 1.4, ease: EXPO, stagger: .07,
      scrollTrigger: { trigger: h, start: 'top 88%', once: true }
    });
  });

  /* ------------------------------------------------------------------
     Marquee : vitesse et sens réagissent au défilement
     ------------------------------------------------------------------ */
  (function marquee() {
    const rows = $$('[data-marquee]').map((row) => {
      const track = $('.marquee__track', row);
      const w = track.offsetWidth;
      const copies = Math.ceil((window.innerWidth * 1.4) / w) + 2;
      for (let i = 0; i < copies; i++) {
        const c = track.cloneNode(true);
        c.setAttribute('aria-hidden', 'true');
        row.appendChild(c);
      }
      const tracks = $$('.marquee__track', row);
      return { dir: parseFloat(row.dataset.marquee), w, x: 0, set: gsap.quickSetter(tracks, 'x', 'px') };
    });
    let vel = 0, dirMul = 1, targetDir = 1, boost = 0;
    ScrollTrigger.create({
      start: 0, end: 'max',
      onUpdate: (self) => { vel = self.getVelocity(); if (Math.abs(vel) > 40) targetDir = vel > 0 ? 1 : -1; }
    });
    gsap.ticker.add((time, dt) => {
      vel *= .93;
      dirMul += (targetDir - dirMul) * .05;
      boost += (Math.min(Math.abs(vel) / 450, 5) - boost) * .08;
      rows.forEach((r) => {
        r.x += r.dir * dirMul * (62 + boost * 70) * dt / 1000;
        if (r.x <= -r.w) r.x += r.w;
        if (r.x > 0) r.x -= r.w;
        r.set(r.x);
      });
    });
    gsap.from('.marquee', { yPercent: 8, duration: 1.4, ease: EXPO, scrollTrigger: { trigger: '.marquee', start: 'top 95%', once: true } });
  })();

  /* ------------------------------------------------------------------
     Manifeste : les mots s'allument au défilement
     ------------------------------------------------------------------ */
  (function manifeste() {
    const text = $('.manifeste__text');
    const words = splitWords(text, false);
    gsap.set(words, { opacity: .16 });
    gsap.to(words, {
      opacity: 1, ease: 'none', stagger: .6,
      scrollTrigger: { trigger: text, start: 'top 82%', end: 'bottom 52%', scrub: true }
    });
    gsap.from('.float--arch', { clipPath: 'inset(100% 0% 0% 0%)', duration: 1.8, ease: 'expo.inOut', scrollTrigger: { trigger: '.manifeste', start: 'top 70%', once: true } });
    gsap.from('.float--round', { clipPath: 'circle(0% at 50% 50%)', duration: 1.8, ease: 'expo.inOut', scrollTrigger: { trigger: '.manifeste', start: 'top 55%', once: true } });
  })();

  /* ------------------------------------------------------------------
     Rituel : section épinglée, la cabine s'assombrit
     ------------------------------------------------------------------ */
  const ritualTitleWords = splitWords($('#rituel .ritual__title'));
  mm.add('(min-width: 900px) and (min-height: 540px)', () => {
    const section = $('#rituel');
    const stage = $('.ritual__stage', section);
    const night = $('.ritual__night', section);
    const acts = $$('.act', section);
    const thread = $('.ritual__thread i', section);
    const N = acts.length;
    section.classList.add('is-pinned');

    const names = acts.map((a) => $('.act__name span', a));
    const nameBox = acts.map((a) => $('.act__name', a));
    nameBox.forEach((el) => { el.style.overflow = 'hidden'; el.style.paddingBottom = '.14em'; });
    gsap.set(acts, { autoAlpha: 0 });
    gsap.set(acts[0], { autoAlpha: 1 });
    gsap.set(acts.map((a) => $('.act__fig', a)), { clipPath: 'inset(100% 0% 0% 0%)' });
    gsap.set(names, { yPercent: 115 });
    gsap.set(acts.map((a) => $('.act__body', a)), { opacity: 0, y: 30 });

    const hideT = [];
    function enter(i, dir) {
      const a = acts[i];
      clearTimeout(hideT[i]);
      const fig = $('.act__fig', a), img = $('img', a), body = $('.act__body', a);
      gsap.set(a, { autoAlpha: 1 });
      gsap.fromTo(fig, { clipPath: dir > 0 ? 'inset(100% 0% 0% 0%)' : 'inset(0% 0% 100% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.5, ease: 'expo.inOut', overwrite: true });
      gsap.fromTo(img, { scale: 1.35 }, { scale: 1, duration: 2.2, overwrite: true });
      gsap.fromTo(names[i], { yPercent: 115 }, { yPercent: 0, duration: 1.3, ease: EXPO, delay: .25, overwrite: true });
      gsap.fromTo(body, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 1.1, delay: .5, overwrite: true });
    }
    function leave(i, dir) {
      const a = acts[i];
      gsap.to(names[i], { yPercent: -115 * dir, duration: .7, ease: 'power3.in', overwrite: true });
      gsap.to($('.act__body', a), { opacity: 0, y: -24 * dir, duration: .5, ease: 'power2.in', overwrite: true });
      gsap.to($('.act__fig', a), { clipPath: dir > 0 ? 'inset(0% 0% 100% 0%)' : 'inset(100% 0% 0% 0%)', duration: 1, ease: 'expo.inOut', overwrite: true });
      hideT[i] = setTimeout(() => gsap.set(a, { autoAlpha: 0 }), 1000);
    }

    let current = 0, introDone = false;
    const nightLevel = [0, .86, .97, 0];
    const setNight = (i) => {
      gsap.to(night, { opacity: nightLevel[i] || 0, duration: 1.4, ease: 'power2.inOut', overwrite: true });
      section.classList.toggle('is-night', i === 1 || i === 2);
    };
    const setThread = gsap.quickSetter(thread, 'scaleY');

    const pin = ScrollTrigger.create({
      trigger: stage, start: 'top top', end: () => '+=' + Math.round(window.innerHeight * 3.4),
      pin: true, anticipatePin: 1, scrub: true,
      onUpdate: (self) => {
        setThread(self.progress);
        const idx = Math.min(N - 1, Math.floor(self.progress * N));
        if (idx !== current) {
          const dir = idx > current ? 1 : -1;
          introDone = true;
          leave(current, dir); enter(idx, dir); setNight(idx); current = idx;
        }
      }
    });
    const first = ScrollTrigger.create({
      trigger: stage, start: 'top 75%', once: true,
      onEnter: () => { if (!introDone && current === 0) { introDone = true; enter(0, 1); } }
    });
    gsap.from(ritualTitleWords, { yPercent: 115, duration: 1.4, ease: EXPO, stagger: .07, scrollTrigger: { trigger: stage, start: 'top 70%', once: true } });

    return () => {
      section.classList.remove('is-pinned', 'is-night');
      pin.kill(); first.kill(); hideT.forEach(clearTimeout);
      gsap.set([acts, night, ...acts.map((a) => $$('*', a))].flat(), { clearProps: 'all' });
      nameBox.forEach((el) => { el.style.overflow = ''; el.style.paddingBottom = ''; });
    };
  });

  /* Rituel sur petits écrans : révélations simples */
  mm.add('(max-width: 899px), (max-height: 539px)', () => {
    $$('.act').forEach((a) => {
      gsap.from($('.act__fig', a), { clipPath: 'inset(100% 0% 0% 0%)', duration: 1.5, ease: 'expo.inOut', scrollTrigger: { trigger: a, start: 'top 80%', once: true } });
      gsap.from($$('.act__name span, .act__body', a), { y: 40, opacity: 0, duration: 1.2, stagger: .12, scrollTrigger: { trigger: a, start: 'top 78%', once: true } });
    });
  });

  /* ------------------------------------------------------------------
     Attentions : défilement horizontal piloté par le défilement vertical
     ------------------------------------------------------------------ */
  mm.add('(min-width: 900px) and (min-height: 540px)', () => {
    const rail = $('.rail');
    const pin = $('.rail__pin', rail);
    const track = $('.rail__track', rail);
    const svg = $('.rail__thread', rail);
    const path = $('path', svg);
    rail.classList.add('is-pinned');
    track.prepend(svg);

    const dist = () => Math.max(0, track.scrollWidth - window.innerWidth);
    function drawThread() {
      const W = track.scrollWidth, H = pin.clientHeight;
      svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
      svg.setAttribute('preserveAspectRatio', 'none');
      const m = H * .52, a = H * .1, L = 420;
      let d = `M0 ${m}Q${L / 2} ${m - a} ${L} ${m}`;
      for (let x = 2 * L; x <= W + L; x += L) d += `T${x} ${m}`;
      path.setAttribute('d', d);
      path.setAttribute('pathLength', 1);
      path.style.strokeDasharray = 1;
    }
    drawThread();
    gsap.set(path, { strokeDashoffset: 1 });

    const tween = gsap.to(track, {
      x: () => -dist(), ease: 'none',
      scrollTrigger: {
        trigger: pin, start: 'top top', end: () => '+=' + dist(),
        pin: true, scrub: .8, anticipatePin: 1, invalidateOnRefresh: true,
        onRefreshInit: drawThread
      }
    });
    gsap.to(path, { strokeDashoffset: 0, ease: 'none', scrollTrigger: { trigger: pin, start: 'top top', end: () => '+=' + dist(), scrub: true, invalidateOnRefresh: true } });

    $$('.panel__word span', track).forEach((w) => {
      gsap.fromTo(w, { xPercent: 14 }, { xPercent: -14, ease: 'none', scrollTrigger: { trigger: w.closest('.panel'), containerAnimation: tween, start: 'left right', end: 'right left', scrub: true } });
    });
    $$('.panel--photo img', track).forEach((img) => {
      gsap.fromTo(img, { xPercent: -10, scale: 1.25 }, { xPercent: 10, ease: 'none', scrollTrigger: { trigger: img.closest('.panel'), containerAnimation: tween, start: 'left right', end: 'right left', scrub: true } });
    });
    gsap.from('.panel--end .btn', { y: 30, opacity: 0, duration: 1, scrollTrigger: { trigger: '.panel--end', containerAnimation: tween, start: 'left 80%', once: true } });

    return () => {
      rail.classList.remove('is-pinned');
      pin.prepend(svg);
      gsap.set([track, path], { clearProps: 'all' });
    };
  });

  /* Les icônes se dessinent quand leur panneau entre dans l'écran */
  (function panelsIO() {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } });
    }, { threshold: .35 });
    $$('.panel').forEach((p) => io.observe(p));
  })();

  /* ------------------------------------------------------------------
     Chiffres : compteurs dans une phrase
     ------------------------------------------------------------------ */
  (function figures() {
    $$('[data-count]').forEach((el, i) => {
      const target = parseInt(el.dataset.count, 10);
      const o = { v: 0 };
      el.textContent = '0';
      gsap.to(o, {
        v: target, duration: 2.2 + i * .25, ease: 'power3.out', delay: i * .15,
        onUpdate: () => { el.textContent = Math.round(o.v); },
        scrollTrigger: { trigger: '.figures__line', start: 'top 78%', once: true }
      });
    });
    gsap.from('.figures__num', { y: 50, opacity: 0, duration: 1.4, ease: EXPO, stagger: .18, scrollTrigger: { trigger: '.figures__line', start: 'top 82%', once: true } });
    gsap.from('.figures__note', { opacity: 0, y: 14, duration: 1, scrollTrigger: { trigger: '.figures__note', start: 'top 95%', once: true } });
    gsap.from('.figures__arch', { scaleY: 0, transformOrigin: '50% 0%', duration: 1.6, ease: EXPO, scrollTrigger: { trigger: '.figures', start: 'top 85%', once: true } });
  })();

  /* ------------------------------------------------------------------
     Galerie : rideaux qui s'ouvrent, colonnes à vitesses différentes
     ------------------------------------------------------------------ */
  (function gallery() {
    $$('.tile').forEach((t) => {
      gsap.from(t, { clipPath: 'inset(0% 50% 0% 50%)', duration: 1.6, ease: 'expo.inOut', scrollTrigger: { trigger: t, start: 'top 90%', once: true } });
      gsap.from($('img', t), { scale: 1.35, duration: 2.2, scrollTrigger: { trigger: t, start: 'top 90%', once: true } });
    });
    gsap.from('.gallery__intro', { y: 30, opacity: 0, duration: 1.2, scrollTrigger: { trigger: '.gallery__intro', start: 'top 92%', once: true } });
  })();
  mm.add('(min-width: 900px)', () => {
    const amp = [60, -70, 100];
    $$('.gcol').forEach((col, i) => {
      gsap.fromTo(col, { y: amp[i] }, { y: -amp[i], ease: 'none', scrollTrigger: { trigger: '.gallery__cols', start: 'top bottom', end: 'bottom top', scrub: true } });
    });
  });

  /* Tresse de jute : se tisse au défilement */
  gsap.fromTo('.braid path', { strokeDasharray: 1, strokeDashoffset: 1 }, {
    strokeDashoffset: 0, ease: 'none', stagger: .05,
    scrollTrigger: { trigger: '.braid', start: 'top 95%', end: 'top 35%', scrub: true }
  });

  /* ------------------------------------------------------------------
     Avis
     ------------------------------------------------------------------ */
  gsap.from('.review', { y: 70, opacity: 0, duration: 1.4, ease: EXPO, stagger: .12, scrollTrigger: { trigger: '.reviews__scroller', start: 'top 85%', once: true } });
  gsap.from('.reviews__intro, .reviews__ctrl', { opacity: 0, y: 20, duration: 1, scrollTrigger: { trigger: '.reviews__scroller', start: 'top 85%', once: true } });

  /* ------------------------------------------------------------------
     FAQ
     ------------------------------------------------------------------ */
  gsap.from('.qa', { y: 40, opacity: 0, duration: 1.2, stagger: .1, scrollTrigger: { trigger: '.faq__list', start: 'top 88%', once: true } });

  /* ------------------------------------------------------------------
     Appel à l'action : la lampe s'allume
     ------------------------------------------------------------------ */
  (function cta() {
    const section = $('.cta');
    gsap.fromTo('.cta__iris', { scale: .2, opacity: 0 }, { scale: 1, opacity: 1, ease: 'none', scrollTrigger: { trigger: section, start: 'top 85%', end: 'center center', scrub: true } });
    const parts = $$('.cta__fan [class^="fan__"]');
    gsap.set(parts, { strokeDasharray: 1, strokeDashoffset: 1 });
    gsap.to(parts, { strokeDashoffset: 0, duration: 2.4, ease: 'power3.inOut', stagger: { each: .04, from: 'center' }, scrollTrigger: { trigger: section, start: 'top 70%', once: true } });

    const phone = $('.cta__phone');
    const chars = splitChars(phone);
    phone.style.overflow = 'hidden';
    gsap.from(chars, { yPercent: 115, duration: 1.4, ease: EXPO, stagger: .05, scrollTrigger: { trigger: phone, start: 'top 90%', once: true } });
    gsap.from('.cta__actions .btn', { y: 30, opacity: 0, duration: 1.1, stagger: .12, scrollTrigger: { trigger: '.cta__actions', start: 'top 94%', once: true } });
    gsap.from('.cta .status', { opacity: 0, duration: 1, scrollTrigger: { trigger: '.cta .status', start: 'top 98%', once: true } });
  })();

  /* ------------------------------------------------------------------
     Nous trouver
     ------------------------------------------------------------------ */
  gsap.from('.mapframe', { clipPath: 'circle(0% at 50% 88%)', duration: 1.9, ease: 'power3.out', scrollTrigger: { trigger: '.mapframe', start: 'top 82%', once: true } });
  gsap.from('.hours tr', { x: -24, opacity: 0, duration: 1, stagger: .07, scrollTrigger: { trigger: '.hours', start: 'top 88%', once: true } });
  gsap.from('.find__addr, .find__note, .find .btn', { y: 24, opacity: 0, duration: 1.1, stagger: .1, scrollTrigger: { trigger: '.find__info', start: 'top 80%', once: true } });

  /* ------------------------------------------------------------------
     Pied de page : le grand nom se lève
     ------------------------------------------------------------------ */
  (function footer() {
    const words = $$('.foot__word span').flatMap((s) => splitWords(s));
    gsap.from(words, { yPercent: 118, duration: 1.8, ease: EXPO, stagger: .12, scrollTrigger: { trigger: '.foot__word', start: 'top 100%', once: true } });
    gsap.from('.foot__top > *, .foot__legal', { opacity: 0, y: 24, duration: 1.1, stagger: .1, scrollTrigger: { trigger: '.foot', start: 'top 85%', once: true } });
  })();

  /* ------------------------------------------------------------------
     Démarrage : chargeur → hero → défilement libéré
     ------------------------------------------------------------------ */
  const start = () => {
    runLoader().then(() => {
      body.classList.remove('is-loading');
      heroIntro();
      if (lenis) lenis.start();
      ScrollTrigger.refresh();
    });
  };
  const fontsReady = document.fonts && document.fonts.ready ? Promise.race([document.fonts.ready, new Promise((r) => setTimeout(r, 1500))]) : Promise.resolve();
  fontsReady.then(() => { ScrollTrigger.refresh(); start(); });

  window.addEventListener('load', () => ScrollTrigger.refresh());
  let rz;
  window.addEventListener('resize', () => { clearTimeout(rz); rz = setTimeout(() => ScrollTrigger.refresh(), 250); });
})();
