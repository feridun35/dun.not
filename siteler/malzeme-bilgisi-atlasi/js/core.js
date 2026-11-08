/* Ortak yardımcılar: canvas döngüsü, 3B görünüm, kontroller, kayıt */
(function () {
  const UI = (window.UI = {});
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  UI.$ = $; UI.$$ = $$;
  UI.store = {
    get(k, d) { try { const v = localStorage.getItem('mb_' + k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem('mb_' + k, JSON.stringify(v)); } catch (e) {} }
  };
  UI.clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  UI.lerp = (a, b, t) => a + (b - a) * t;
  UI.rnd = (function () { let s = 7; return () => ((s = (s * 16807) % 2147483647) - 1) / 2147483646; })();

  /* Canvas döngüsü: görünürken çalışır, boyutu genişliğe göre ayarlar */
  UI.loop = function (canvas, ratio, draw) {
    const ctx = canvas.getContext('2d');
    const st = { t: 0, dt: 0, W: 0, H: 0, px: 0, py: 0, down: false, ctx };
    let last = 0, raf = 0, vis = false;
    function fit() {
      const cw = canvas.clientWidth || 600, dpr = Math.min(2, window.devicePixelRatio || 1);
      st.W = cw; st.H = Math.round(cw * (cw < 520 ? Math.min(ratio * 1.35, 1.1) : ratio));
      canvas.width = st.W * dpr; canvas.height = st.H * dpr; canvas.style.height = st.H + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    fit();
    if (window.ResizeObserver) new ResizeObserver(() => { if (Math.abs(canvas.clientWidth - st.W) > 1) fit(); }).observe(canvas);
    function tick(dt) { st.dt = dt; st.t += dt; ctx.clearRect(0, 0, st.W, st.H); draw(ctx, st.W, st.H, st); }
    function frame(now) {
      if (!vis) { raf = 0; return; }
      tick(Math.min(0.2, (now - last) / 1000)); last = now;
      raf = requestAnimationFrame(frame);
    }
    st.canvas = canvas; st.tick = tick; (UI._loops = UI._loops || []).push(st);
    function pos(e) { const r = canvas.getBoundingClientRect(); st.px = e.clientX - r.left; st.py = e.clientY - r.top; }
    canvas.addEventListener('pointerdown', e => { st.down = true; pos(e); try { canvas.setPointerCapture(e.pointerId); } catch (x) {} st.onDown && st.onDown(st); });
    canvas.addEventListener('pointermove', e => { const ox = st.px, oy = st.py; pos(e); st.dx = st.px - ox; st.dy = st.py - oy; st.onMove && st.onMove(st); });
    canvas.addEventListener('pointerup', e => { st.down = false; st.onUp && st.onUp(st); });
    canvas.addEventListener('pointercancel', () => { st.down = false; });
    const io = new IntersectionObserver(es => { vis = es[0].isIntersecting; if (vis && !raf) { last = performance.now(); raf = requestAnimationFrame(frame); } });
    io.observe(canvas);
    st.redraw = () => { ctx.clearRect(0, 0, st.W, st.H); draw(ctx, st.W, st.H, st); };
    return st;
  };

  /* Kaydırıcı bağlama: <input type=range id=x><output> */
  UI.bind = function (root, sel, fn, fmt) {
    const inp = $(sel, root); if (!inp) return null;
    const out = inp.parentElement.querySelector('output');
    const upd = () => { const v = parseFloat(inp.value); if (out) out.textContent = fmt ? fmt(v) : v; fn(v); };
    inp.addEventListener('input', upd); upd(); return inp;
  };
  UI.seg = function (root, sel, fn, init) {
    const box = $(sel, root); if (!box) return;
    const btns = $$('button', box);
    function pick(b) { btns.forEach(x => x.classList.toggle('on', x === b)); fn(b.dataset.v, b); }
    btns.forEach(b => b.addEventListener('click', () => pick(b)));
    if (init !== false) pick(btns.find(b => b.classList.contains('on')) || btns[0]);
  };
  UI.setCap = (root, html) => { const c = $('.cap', root); if (c) c.innerHTML = html; };

  /* Basit çizim yardımcıları */
  UI.circle = (ctx, x, y, r, fill, stroke, lw) => { ctx.beginPath(); ctx.arc(x, y, r, 0, 6.2832); if (fill) { ctx.fillStyle = fill; ctx.fill(); } if (stroke) { ctx.lineWidth = lw || 1; ctx.strokeStyle = stroke; ctx.stroke(); } };
  UI.line = (ctx, x1, y1, x2, y2, col, lw, dash) => { ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.strokeStyle = col || '#8E99A6'; ctx.lineWidth = lw || 1; ctx.setLineDash(dash || []); ctx.stroke(); ctx.setLineDash([]); };
  UI.text = (ctx, s, x, y, col, size, align, font) => { ctx.fillStyle = col || '#C9D0D8'; ctx.font = (size || 13) + 'px ' + (font || 'Segoe UI, sans-serif'); ctx.textAlign = align || 'left'; ctx.textBaseline = 'middle'; ctx.fillText(s, x, y); };
  UI.arrow = (ctx, x1, y1, x2, y2, col, lw) => {
    UI.line(ctx, x1, y1, x2, y2, col, lw || 2);
    const a = Math.atan2(y2 - y1, x2 - x1), h = 8 + (lw || 2);
    ctx.beginPath(); ctx.moveTo(x2, y2); ctx.lineTo(x2 - h * Math.cos(a - 0.4), y2 - h * Math.sin(a - 0.4)); ctx.lineTo(x2 - h * Math.cos(a + 0.4), y2 - h * Math.sin(a + 0.4)); ctx.closePath(); ctx.fillStyle = col || '#8E99A6'; ctx.fill();
  };
  UI.roundRect = (ctx, x, y, w, h, r, fill, stroke) => {
    ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r); ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
    if (fill) { ctx.fillStyle = fill; ctx.fill(); } if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = 1; ctx.stroke(); }
  };
  /* küre gibi gölgeli atom */
  UI.atom = (ctx, x, y, r, col) => {
    const g = ctx.createRadialGradient(x - r * 0.35, y - r * 0.35, r * 0.1, x, y, r);
    g.addColorStop(0, '#fff'); g.addColorStop(0.25, col); g.addColorStop(1, shade(col, -0.55));
    ctx.beginPath(); ctx.arc(x, y, r, 0, 6.2832); ctx.fillStyle = g; ctx.fill();
  };
  function shade(hex, f) {
    const n = parseInt(hex.slice(1), 16); let r = n >> 16, g = (n >> 8) & 255, b = n & 255;
    const m = f < 0 ? 0 : 255, p = Math.abs(f);
    r = Math.round((m - r) * p + r); g = Math.round((m - g) * p + g); b = Math.round((m - b) * p + b);
    return `rgb(${r},${g},${b})`;
  }
  UI.shade = shade;

  /* 3B görünüm: z yukarı. draw(ctx, P, st) içinde P(x,y,z) -> {x,y,d,k} */
  UI.view3d = function (canvas, ratio, drawScene, opts) {
    opts = opts || {};
    const v = { yaw: opts.yaw != null ? opts.yaw : 0.7, pitch: opts.pitch != null ? opts.pitch : 0.45, auto: opts.auto !== false, zoom: opts.zoom || 1 };
    const st = UI.loop(canvas, ratio, (ctx, W, H, s) => {
      if (v.auto && !s.down) v.yaw += s.dt * 0.35;
      const cy = Math.cos(v.yaw), sy = Math.sin(v.yaw), cp = Math.cos(v.pitch), sp = Math.sin(v.pitch);
      const sc = Math.min(W, H * 1.15) * 0.3 * v.zoom;
      const P = (x, y, z) => {
        const X = x * cy - y * sy, Y = x * sy + y * cy;
        const d = Y * cp - z * sp, k = 1 / (1 + 0.1 * d);
        return { x: W / 2 + X * sc * k, y: H / 2 - (z * cp + Y * sp) * sc * k, d, k, sc };
      };
      drawScene(ctx, P, s, v);
    });
    st.onMove = s => { if (s.down) { v.yaw += s.dx * 0.01; v.pitch = UI.clamp(v.pitch + s.dy * 0.01, -1.3, 1.3); } };
    st.v = v; return st;
  };

  /* Bölüm tanımları */
  window.CH = {};
  UI.chapters = [
    { n: 1, t: 'Malzeme Bilgisine Giriş', pg: [1, 5], c: '#F5C542' },
    { n: 2, t: 'Atom Yapısı', pg: [6, 19], c: '#FF9E9E' },
    { n: 3, t: 'Atomlar Arası Bağlar', pg: [20, 31], c: '#7FD99A' },
    { n: 4, t: 'Kafes Sistemleri', pg: [32, 46], c: '#6FB4FF' },
    { n: 5, t: 'Ergime ve Katılaşma', pg: [47, 59], c: '#C79CFF' },
    { n: 6, t: 'Yapı Hataları', pg: [60, 80], c: '#FFA95C' },
    { n: 7, t: 'Mekanik Özellikler', pg: [81, 97], c: '#4FD8CF' }
  ];
  /* Küçük çoktan seçmeli oyun: list=[{q,o:[..],a:index,w:'neden'}] */
  UI.mini = function (root, list) {
    let i = 0, ok = 0; const order = list.map((_, k) => k).sort(() => Math.random() - 0.5);
    function show() {
      if (i >= order.length) { root.innerHTML = `<div class="fb"><b>${ok} / ${order.length}</b> doğru. <button class="btn" id="mr">Tekrar</button></div>`; $('#mr', root).onclick = () => { i = 0; ok = 0; order.sort(() => Math.random() - 0.5); show(); }; return; }
      const it = list[order[i]];
      root.innerHTML = `<div class="hint">${i + 1} / ${order.length}</div><div class="qt" style="font-size:17px;margin:4px 0 8px">${it.q}</div><div class="chips">${it.o.map((o, k) => `<button class="btn" data-k="${k}">${o}</button>`).join('')}</div><div class="hint" id="mf" style="min-height:22px"></div>`;
      $$('.btn', root).forEach(b => b.onclick = () => {
        const k = +b.dataset.k; $$('.btn', root).forEach(x => { x.disabled = true; if (+x.dataset.k === it.a) x.classList.add('on'); });
        if (k === it.a) ok++; else b.style.borderColor = '#FF5A4D';
        $('#mf', root).innerHTML = (k === it.a ? '<b style="color:#5FD08A">Doğru.</b> ' : '<b style="color:#FF5A4D">Yanlış.</b> ') + (it.w || '') + ' <button class="btn" id="mn" style="margin-left:8px">Sonraki</button>';
        $('#mn', root).onclick = () => { i++; show(); };
      });
    }
    show();
  };

  /* Bölüm şablonu yardımcıları */
  UI.W = (id, ratio, extra) => `<div class="widget ${extra || ''}" id="${id}"><canvas></canvas><div class="ctl"></div><div class="cap"></div></div>`;
})();
