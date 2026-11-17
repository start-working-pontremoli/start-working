// Start Working Pontremoli: everything the pages do, for all three pages.
const $ = (sel, el = document) => el.querySelector(sel);
const $$ = (sel, el = document) => [...el.querySelectorAll(sel)];
const make = (tag, text) => Object.assign(document.createElement(tag), { textContent: text });
const onLang = [];

/* Language. The pages are written in Italian; window.EN (src/en.json, inlined by the build) maps
   each Italian text to its English one, so the markup needs no keys. */
const EN = window.EN || {};
let lang = localStorage.lang || (navigator.language.startsWith('en') ? 'en' : 'it');
const T = (it) => (lang === 'en' && EN[it]) || it;
const walker = document.createTreeWalker(document.documentElement, NodeFilter.SHOW_TEXT);
const texts = [];
for (let n; (n = walker.nextNode());) if (EN[n.nodeValue.trim()]) texts.push([n, n.nodeValue]);
const attrs = $$('[alt],[placeholder],[aria-label],[title],meta[content]').flatMap((el) =>
  ['alt', 'placeholder', 'aria-label', 'title', 'content'].filter((a) => EN[el.getAttribute(a)]).map((a) => [el, a, el.getAttribute(a)]));

function setLang(l) {
  lang = localStorage.lang = document.documentElement.lang = l;
  texts.forEach(([node, it]) => (node.nodeValue = it.replace(it.trim(), T(it.trim()))));
  attrs.forEach(([el, a, it]) => el.setAttribute(a, T(it)));
  $$('[data-lang]').forEach((b) => b.setAttribute('aria-pressed', b.dataset.lang === l));
  $$('article[lang]').forEach((a) => (a.hidden = a.lang !== l));
  onLang.forEach((f) => f());
}
$$('[data-lang]').forEach((b) => (b.onclick = () => setLang(b.dataset.lang)));

/* Menu: the Amor opens it; a click anywhere but the language switch closes it */
const menuBtn = $('#menu-btn'), menu = $('#menu');
const toggleMenu = (open) => {
  menu.classList.toggle('open', open);
  menuBtn.setAttribute('aria-expanded', open);
  menuBtn.ariaLabel = T(open ? 'Chiudi menu' : 'Apri menu');
  document.body.style.overflow = open ? 'hidden' : '';
};
if (menuBtn) {
  const hero = $('.hero'); // white lines over the photo, navy over the paper
  if (hero) new IntersectionObserver(([e]) => menuBtn.classList.toggle('dark', !e.isIntersecting), { rootMargin: '-40px 0px 0px' }).observe(hero);
  let still; // hidden while the page scrolls, back a moment after it stops
  addEventListener('scroll', () => {
    menuBtn.classList.add('away');
    clearTimeout(still);
    still = setTimeout(() => menuBtn.classList.remove('away'), 250);
  }, { passive: true });
  menuBtn.onclick = () => toggleMenu(!menu.classList.contains('open'));
  menu.onclick = (e) => e.target.closest('[data-lang]') || toggleMenu(false); // a click anywhere else closes it
  addEventListener('keydown', (e) => e.key === 'Escape' && toggleMenu(false));
}

/* Videos and calendar follow the language */
onLang.push(() => {
  const video = $('[data-en]'), cal = $('#calendar');
  const v = video && `https://www.youtube.com/embed/${video.dataset[lang]}`;
  if (video && video.src !== v) video.src = v;
  if (cal && !cal.src.includes('hl=' + lang)) cal.src = cal.src.replace(/hl=\w+/, 'hl=' + lang);
});

/* Photos with a pool: a click shows the next one, the dots jump to any */
$$('[data-pool]').forEach((img) => {
  const pool = [img.getAttribute('src'), ...img.dataset.pool.split(' ')];
  const dots = make('div');
  dots.className = 'dots';
  let i = 0;
  const show = (n) => {
    i = (n + pool.length) % pool.length;
    img.src = pool[i];
    img.animate({ opacity: [0.3, 1] }, 350);
    [...dots.children].forEach((d, k) => d.setAttribute('aria-current', k === i));
  };
  pool.forEach((_, k) => dots.append(Object.assign(make('button'), { ariaLabel: k + 1, onclick: () => show(k) })));
  dots.firstChild.setAttribute('aria-current', true);
  img.after(dots);
  img.onclick = () => show(i + 1);
});

/* Our stories: the photo viewer (buttons, arrow keys, swipe) */
const box = $('#lightbox'), shots = $$('#gallery button');
let shot = 0;
const view = (n) => {
  shot = (n + shots.length) % shots.length;
  const img = $('img', shots[shot]);
  Object.assign($('img', box), { src: img.src, alt: img.alt });
  $('p', box).innerHTML = $('span', shots[shot]).innerHTML; // the quote, with the author in bold
};
if (box) {
  shots.forEach((b, i) => (b.onclick = () => { view(i); box.showModal(); }));
  $('.prev', box).onclick = () => view(shot - 1);
  $('.next', box).onclick = () => view(shot + 1);
  $('.close', box).onclick = () => box.close();
  // Arrow keys step; a click on the left or right half of the photo steps; a swipe steps; a click anywhere else closes
  box.onkeydown = (e) => (e.key === 'ArrowLeft' || e.key === 'ArrowRight') && view(shot + (e.key === 'ArrowLeft' ? -1 : 1));
  let x, swiped = false;
  box.onpointerdown = (e) => { x = e.clientX; swiped = false; };
  box.onpointerup = (e) => { if (Math.abs(e.clientX - x) > 50) { swiped = true; view(shot + (e.clientX < x ? 1 : -1)); } };
  box.onclick = (e) => {
    if (swiped || e.target.closest('button')) return;
    const img = $('img', box);
    if (e.target === img) { const r = img.getBoundingClientRect(); view(shot + (e.clientX < r.left + r.width / 2 ? -1 : 1)); }
    else box.close();
  };
}

/* Where we come from: a world map, shaded by how many of us came from each country.
   Click a country: a side panel lists who came from there. Wheel, trackpad or pinch zooms; drag pans. */
const map = $('#map');
if (map) {
  const tip = $('#tip');
  const W = 1000, H = 651, MIN = 30; // the map's size in SVG units, and the closest zoom
  let svg, byId = {}, pinned = null, vb = [0, 0, W, H];
  const country = (code) => new Intl.DisplayNames([lang], { type: 'region' }).of(code);
  const count = (n) => `${n} ${T(n === 1 ? 'persona' : 'persone')}`;
  // The panel: ‹ › step through every country with people (in alphabetical order), × closes it
  const ids = () => Object.keys(byId).sort((a, b) => country(byId[a][0].c).localeCompare(country(byId[b][0].c), lang));
  const fill = (id) => {
    const g = byId[id], list = ids(), i = list.indexOf(id);
    // Drawn icons rather than ← → × characters, so all three sit exactly in the middle of their squares
    const icon = (d) => `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="${d}"/></svg>`;
    const btn = (cls, label, d, go) => Object.assign(make('button'), { className: cls, ariaLabel: T(label), innerHTML: icon(d), onclick: go });
    const bar = make('div'), names = make('div');
    bar.className = 'tip-bar';
    names.className = 'tip-list';
    bar.append(make('b', `${country(g[0].c)} (${g.length})`), btn('prev', 'Paese precedente', 'M19 12H5M11 6l-6 6 6 6', () => pin(list.at(i - 1), true)),
      btn('next', 'Paese successivo', 'M5 12h14M13 6l6 6-6 6', () => pin(list[(i + 1) % list.length], true)), btn('close', 'Chiudi', 'M6 6l12 12M18 6L6 18', () => pin(null)));
    names.append(...[...g].sort((a, b) => a.city.localeCompare(b.city) || a.n.localeCompare(b.n)).map((p) => make('p', `${p.n}, ${p.a} · ${p.city}`)));
    tip.replaceChildren(bar, names);
  };
  const pin = (id, keep) => { // a second click on the open country closes it, unless it comes from the arrows
    $$('.on', svg).forEach((p) => p.classList.remove('on'));
    pinned = byId[id] && (keep || id !== pinned) ? id : null;
    tip.hidden = !pinned;
    if (!pinned) return;
    tip.style.height = map.offsetHeight + 'px'; // the map's height, not the caption's below it
    $$(`[data-id="${id}"]`, svg).forEach((p) => p.classList.add('on'));
    hidePrompt();
    fill(id);
    $('.tip-list', tip).scrollTop = 0;
  };
  onLang.push(() => pinned && fill(pinned));
  const draw = () => svg.setAttribute('viewBox', vb.join(' '));
  // The view takes the box's shape (square on phones). Beyond the map's edges there's empty paper, so nothing is ever cut:
  // fully zoomed out the whole world fits, and the middle of the view can go anywhere on the map
  const clamp = ([x, y, w]) => {
    const r = map.clientHeight / map.clientWidth;
    w = Math.min(Math.max(W, H / r), Math.max(MIN, w));
    const h = w * r;
    // how far past the map's edge the view may go: freely when zoomed in, none once the view is wider than the map (it stays centred)
    const fit = (c, v, M) => { const m = v >= M ? 0 : v / 2 * Math.sqrt(1 - v / M); return v >= M ? M / 2 : Math.min(M - v / 2 + m, Math.max(v / 2 - m, c)); };
    const cx = fit(x + w / 2, w, W), cy = fit(y + h / 2, h, H);
    return [cx - w / 2, cy - h / 2, w, h];
  };
  const toSvg = (cx, cy) => { const p = new DOMPoint(cx, cy).matrixTransform(svg.getScreenCTM().inverse()); return [p.x, p.y]; };
  const zoomAt = (cx, cy, k) => { // k > 1 zooms out, around the screen point (cx, cy)
    const [px, py] = toSvg(cx, cy);
    vb = clamp([px - (px - vb[0]) * k, py - (py - vb[1]) * k, vb[2] * k]);
    draw();
    hidePrompt();
  };
  const europe = () => { const w = 240, h = w * map.clientHeight / map.clientWidth; return clamp([528 - w / 2, 300 - h / 2, w]); }; // the default view, centred on Europe
  const hidePrompt = () => $('#map-prompt')?.classList.add('gone');
  new IntersectionObserver(async ([e], io) => {
    if (!e.isIntersecting) return;
    io.disconnect();
    const [markup, data] = await Promise.all([fetch('img/world-map.svg').then((r) => r.text()), fetch('data/people.json').then((r) => r.json())]);
    map.innerHTML = markup;
    map.removeAttribute('aria-busy');
    svg = $('svg', map);
    svg.setAttribute('preserveAspectRatio', 'xMidYMid meet'); // the whole map, never cropped
    data.people.forEach((p) => (byId[p.id] ||= []).push(p));
    const most = Math.max(...Object.values(byId).map((g) => g.length));
    $$('path', svg).forEach((p) => {
      const g = byId[p.dataset.id];
      if (!g) return;
      p.style.setProperty('--w', 0.35 + 0.65 * Math.sqrt(g.length / most)); // square root, so a few people still show
      p.tabIndex = 0;
      p.onkeydown = (e) => e.key === 'Enter' && pin(p.dataset.id);
    });

    // Like Google Maps, the page keeps scrolling over the map: a plain wheel or one finger scrolls the page.
    // Ctrl/⌘ + wheel or a trackpad pinch (a wheel event with ctrlKey) zooms; on phones two fingers move and zoom.
    // Trying the plain gesture flashes the prompt that says how
    let flash;
    const nudge = () => {
      const p = $('#map-prompt');
      p.classList.remove('gone');
      clearTimeout(flash);
      flash = setTimeout(() => p.classList.add('gone'), 1600);
    };
    svg.addEventListener('wheel', (e) => {
      if (!e.ctrlKey && !e.metaKey) return nudge();
      e.preventDefault();
      zoomAt(e.clientX, e.clientY, Math.exp(e.deltaY * 0.01));
    }, { passive: false });
    svg.addEventListener('touchmove', (e) => e.touches.length > 1 && e.preventDefault(), { passive: false }); // two fingers: the map's, not the page's

    // The mouse drags (captured, so it keeps going smoothly across countries); two fingers pinch and pan together. A drag isn't a tap
    const pts = new Map();
    let last = null, moved = 0, downOn = null;
    const mid = () => { const [a, b] = [...pts.values()]; return [(a.x + b.x) / 2, (a.y + b.y) / 2, Math.hypot(a.x - b.x, a.y - b.y)]; };
    svg.onpointerdown = (e) => {
      if (e.pointerType === 'mouse') svg.setPointerCapture(e.pointerId);
      pts.set(e.pointerId, { x: e.clientX, y: e.clientY });
      if (pts.size === 1) { moved = 0; downOn = e.target.dataset.id; }
      last = pts.size === 2 ? mid() : null;
    };
    svg.onpointermove = (e) => {
      const p = pts.get(e.pointerId);
      if (!p) return;
      if (pts.size === 1) {
        moved += Math.hypot(e.clientX - p.x, e.clientY - p.y);
        if (e.pointerType === 'touch') { if (moved > 30) nudge(); } // one finger scrolls the page
        else {
          const [x0, y0] = toSvg(p.x, p.y), [x1, y1] = toSvg(e.clientX, e.clientY);
          vb = clamp([vb[0] - (x1 - x0), vb[1] - (y1 - y0), vb[2]]);
          draw();
          if (moved > 5) hidePrompt();
        }
      }
      p.x = e.clientX; p.y = e.clientY;
      if (pts.size === 2) {
        const now = mid();
        if (last) { // pan with the midpoint, zoom with the spread
          const [x0, y0] = toSvg(last[0], last[1]), [x1, y1] = toSvg(now[0], now[1]);
          vb = clamp([vb[0] - (x1 - x0), vb[1] - (y1 - y0), vb[2]]);
          zoomAt(now[0], now[1], last[2] / now[2]);
        }
        last = now;
        moved = 99;
      }
    };
    const up = (e) => {
      if (pts.size === 1 && moved < 5) pin(downOn);
      pts.delete(e.pointerId);
      last = pts.size === 2 ? mid() : null;
    };
    svg.onpointerup = up;
    svg.onpointercancel = (e) => { pts.delete(e.pointerId); last = null; moved = 99; };

    vb = europe();
    draw();
    addEventListener('resize', () => { vb = clamp(vb); draw(); });
  }, { rootMargin: '600px 0px' }).observe(map);
}

/* How to join: the postcard is postmarked with today's date and flies off when sent */
const form = $('#form');
if (form) {
  onLang.push(() => {
    const d = Object.fromEntries(new Intl.DateTimeFormat(lang, { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'Europe/Rome' })
      .formatToParts(new Date()).map((p) => [p.type, p.value]));
    $('#pm-day').textContent = d.day;
    $('#pm-month').textContent = d.month.replace('.', '').toUpperCase();
    $('#pm-year').textContent = d.year;
  });
  form.onsubmit = async (e) => {
    e.preventDefault();
    const btn = $('[type=submit]', form), status = $('#status');
    btn.disabled = true;
    status.textContent = T('La stiamo imbucando…');
    form.classList.add('posted');
    try {
      const res = await fetch(form.action.replace('.co/', '.co/ajax/'), { method: 'POST', headers: { Accept: 'application/json' }, body: new FormData(form) });
      if (String((await res.json()).success) !== 'true') throw new Error('FormSubmit');
      status.textContent = '';
      setTimeout(() => form.classList.add('sent'), 500);
      setTimeout(() => { btn.disabled = false; form.hidden = true; $('#thanks').hidden = false; form.reset(); }, 1400);
    } catch {
      form.classList.remove('posted');
      status.textContent = T('Qualcosa è andato storto. Riprova o scrivici a info@start-working.it.');
      btn.disabled = false;
    }
  };
  $('#again').onclick = () => { form.classList.remove('posted', 'sent'); form.hidden = false; $('#thanks').hidden = true; };
}

setLang(lang);

/* Carousels: swipe, scroll, click a neighbour or use the arrows; whoever is nearest the middle is "active" */
$$('.rail').forEach((rail) => {
  const wrap = Object.assign(make('div'), { className: 'rail-wrap' });
  rail.before(wrap);
  wrap.append(rail);
  const items = [...rail.children];
  const go = (i) => items[Math.max(0, Math.min(items.length - 1, i))].scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
  const cur = () => items.indexOf(rail.querySelector('.active'));
  const btn = (cls, label, txt, d) => wrap.append(Object.assign(make('button', txt), { className: 'rail-btn ' + cls, ariaLabel: label, onclick: () => go(cur() + d) }));
  btn('prev', 'Precedente', '‹', -1);
  btn('next', 'Successivo', '›', 1);
  const mark = () => {
    const mid = rail.scrollLeft + rail.clientWidth / 2, dist = (it) => Math.abs(it.offsetLeft + it.offsetWidth / 2 - mid);
    const near = items.reduce((a, b) => (dist(b) < dist(a) ? b : a));
    items.forEach((it) => it.classList.toggle('active', it === near));
    $('.prev', wrap).hidden = near === items[0];
    $('.next', wrap).hidden = near === items.at(-1);
  };
  rail.addEventListener('scroll', mark, { passive: true });
  addEventListener('resize', mark);
  items.forEach((it, i) => it.addEventListener('click', (e) => {
    if (it.classList.contains('active')) return;
    e.preventDefault(); e.stopPropagation();
    go(i);
  }, true));
  rail.tabIndex = 0;
  rail.onkeydown = (e) => e.key.startsWith('Arrow') && (e.preventDefault(), go(cur() + (e.key === 'ArrowLeft' ? -1 : 1)));
  mark();
});
