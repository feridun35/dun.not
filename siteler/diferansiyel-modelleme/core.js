/* Modelleme Atölyesi · ortak araçlar: DOM, KaTeX, kayıt, RK4, grafik, kaydırıcı */
'use strict';
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
function h(tag, attrs, ...kids) {
  const e = document.createElement(tag);
  if (attrs) for (const [k, v] of Object.entries(attrs)) {
    if (k === 'class') e.className = v;
    else if (k === 'html') e.innerHTML = v;
    else if (k.startsWith('on')) e.addEventListener(k.slice(2), v);
    else e.setAttribute(k, v);
  }
  for (const c of kids.flat()) if (c != null) e.append(c.nodeType ? c : document.createTextNode(c));
  return e;
}
/* $...$ içindeki LaTeX'i KaTeX'e çevirir; geri kalan HTML olduğu gibi kalır */
function tx(s) {
  if (s == null) return '';
  return String(s).replace(/\$\$([\s\S]+?)\$\$|\$([^$]+?)\$/g, (m, d, i) => {
    try { return katex.renderToString((d || i).replace(/(\d),(\d)/g, '$1{,}$2'), { displayMode: !!d, throwOnError: false, strict: false }); }
    catch (e) { return m; }
  });
}
function H(html) { const d = h('div'); d.innerHTML = tx(html); return d.childNodes.length === 1 ? d.firstChild : d; }
function TX(tag, cls, html) { const e = h(tag, cls ? { class: cls } : null); e.innerHTML = tx(html); return e; }

/* tarayıcıda ilerleme kaydı (yoksa sessizce çalışmaya devam) */
const store = {
  get(k, d) { try { const v = localStorage.getItem('modat:' + k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
  set(k, v) { try { localStorage.setItem('modat:' + k, JSON.stringify(v)); } catch (e) {} }
};

/* sayı biçimi: Türkçe ondalık virgül */
function fmt(x, d = 2) {
  if (!isFinite(x)) return '—';
  const a = Math.abs(x);
  let s;
  if (a !== 0 && (a < 1e-3 || a >= 1e6)) s = x.toExponential(2).replace('e', '·10^');
  else s = x.toFixed(d).replace(/\.?0+$/, m => (m.startsWith('.') ? '' : m));
  return s.replace('.', ',');
}

/* RK4: dy/dt = f(t, y), y sayı ya da dizi */
function rk4(f, t0, y0, t1, n = 400) {
  const vec = Array.isArray(y0);
  const add = (a, b, s) => vec ? a.map((v, i) => v + s * b[i]) : a + s * b;
  const dt = (t1 - t0) / n; let t = t0, y = y0; const out = [[t, y]];
  for (let i = 0; i < n; i++) {
    const k1 = f(t, y), k2 = f(t + dt / 2, add(y, k1, dt / 2)), k3 = f(t + dt / 2, add(y, k2, dt / 2)), k4 = f(t + dt, add(y, k3, dt));
    y = vec ? y.map((v, j) => v + dt / 6 * (k1[j] + 2 * k2[j] + 2 * k3[j] + k4[j])) : y + dt / 6 * (k1 + 2 * k2 + 2 * k3 + k4);
    t += dt; out.push([t, y]);
  }
  return out;
}

/* Grafik: eksen, ızgara, eğri, işaret, teğet. Renk: beyaz eğri, kırmızı vurgu, gri ikincil. */
class Plot {
  constructor(canvas, opt = {}) {
    this.c = canvas; this.o = Object.assign({ xl: 't', yl: 'y', pad: [14, 16, 34, 52] }, opt);
    this.ro = new ResizeObserver(() => this.draw && this.draw()); this.ro.observe(canvas);
  }
  setup(xmin, xmax, ymin, ymax) {
    const c = this.c, dpr = window.devicePixelRatio || 1, w = c.clientWidth, hh = c.clientHeight;
    if (c.width !== Math.round(w * dpr)) { c.width = Math.round(w * dpr); c.height = Math.round(hh * dpr); }
    const g = c.getContext('2d'); g.setTransform(dpr, 0, 0, dpr, 0, 0); g.clearRect(0, 0, w, hh);
    const [pt, pr, pb, pl] = this.o.pad;
    Object.assign(this, { g, w, hh, x0: pl, x1: w - pr, y0: hh - pb, y1: pt, xmin, xmax, ymin, ymax });
    return g;
  }
  X(x) { return this.x0 + (x - this.xmin) / (this.xmax - this.xmin) * (this.x1 - this.x0); }
  Y(y) { return this.y0 - (y - this.ymin) / (this.ymax - this.ymin) * (this.y0 - this.y1); }
  axes() {
    const { g } = this, nice = (a, b) => { const r = (b - a) / 5, p = Math.pow(10, Math.floor(Math.log10(r))), m = r / p; return (m < 1.5 ? 1 : m < 3.5 ? 2 : m < 7.5 ? 5 : 10) * p; };
    g.font = '12px Bahnschrift, Barlow, sans-serif'; g.lineWidth = 1;
    const sx = nice(this.xmin, this.xmax), sy = nice(this.ymin, this.ymax);
    g.strokeStyle = 'rgba(201,208,216,.10)'; g.fillStyle = '#8e99a6';
    g.textAlign = 'center'; g.textBaseline = 'top';
    for (let x = Math.ceil(this.xmin / sx) * sx; x <= this.xmax + 1e-9; x += sx) {
      g.beginPath(); g.moveTo(this.X(x), this.y0); g.lineTo(this.X(x), this.y1); g.stroke();
      g.fillText(fmt(x, 2), this.X(x), this.y0 + 5);
    }
    g.textAlign = 'right'; g.textBaseline = 'middle';
    for (let y = Math.ceil(this.ymin / sy) * sy; y <= this.ymax + 1e-9; y += sy) {
      g.beginPath(); g.moveTo(this.x0, this.Y(y)); g.lineTo(this.x1, this.Y(y)); g.stroke();
      g.fillText(fmt(y, 2), this.x0 - 6, this.Y(y));
    }
    g.strokeStyle = '#c9d0d8'; g.beginPath(); g.moveTo(this.x0, this.y1); g.lineTo(this.x0, this.y0); g.lineTo(this.x1, this.y0); g.stroke();
    g.fillStyle = '#c9d0d8'; g.textAlign = 'right'; g.textBaseline = 'bottom'; g.fillText(this.o.xl, this.x1, this.y0 - 4);
    g.textAlign = 'left'; g.textBaseline = 'top'; g.fillText(this.o.yl, this.x0 + 6, this.y1);
  }
  line(pts, col = '#ffffff', wdt = 2.2, dash) {
    const { g } = this; g.save(); g.beginPath(); g.rect(this.x0, this.y1 - 2, this.x1 - this.x0 + 2, this.y0 - this.y1 + 4); g.clip();
    g.strokeStyle = col; g.lineWidth = wdt; g.setLineDash(dash || []); g.beginPath();
    pts.forEach(([x, y], i) => i ? g.lineTo(this.X(x), this.Y(y)) : g.moveTo(this.X(x), this.Y(y))); g.stroke(); g.restore();
  }
  hline(y, col = 'rgba(201,208,216,.55)', label) {
    this.line([[this.xmin, y], [this.xmax, y]], col, 1.2, [5, 5]);
    if (label) { const g = this.g; g.fillStyle = col; g.font = '12px Bahnschrift, sans-serif'; g.textAlign = 'right'; g.textBaseline = 'bottom'; g.fillText(label, this.x1 - 4, this.Y(y) - 3); }
  }
  vline(x, col = 'rgba(201,208,216,.4)') { this.line([[x, this.ymin], [x, this.ymax]], col, 1, [3, 4]); }
  dot(x, y, col = '#ff2d20', r = 5, label) {
    const g = this.g; g.fillStyle = col; g.beginPath(); g.arc(this.X(x), this.Y(y), r, 0, 7); g.fill();
    if (label) { g.font = '600 12px Bahnschrift, sans-serif'; g.textAlign = 'left'; g.textBaseline = 'bottom'; g.fillText(label, this.X(x) + 7, this.Y(y) - 5); }
  }
  tangent(x, y, slope, len = 0.16) {        // len: x aralığının oranı
    const dx = (this.xmax - this.xmin) * len;
    this.line([[x - dx, y - slope * dx], [x + dx, y + slope * dx]], '#ff2d20', 2, [6, 4]);
  }
}

/* kaydırıcı: {id, label, min, max, step, val, unit, fmt} → onChange(değerler) */
function sliders(defs, onChange) {
  const box = h('div', { class: 'sl' }), vals = {};
  const rows = {};
  for (const d of defs) {
    vals[d.id] = d.val;
    const out = h('output'), inp = h('input', { type: 'range', min: d.min, max: d.max, step: d.step, value: d.val, 'aria-label': d.plain || d.id });
    const show = () => { out.textContent = (d.f ? d.f(vals[d.id]) : fmt(vals[d.id], 3)) + (d.unit ? ' ' + d.unit : ''); };
    inp.addEventListener('input', () => { vals[d.id] = +inp.value; show(); onChange(vals); });
    show();
    const lab = h('label'); lab.innerHTML = tx(d.label);
    rows[d.id] = { inp, show };
    box.append(h('div', { class: 'slr' }, lab, inp, out));
  }
  box.vals = vals;
  box.set = (o) => {
    const cur = { ...vals };
    for (const [k, v] of Object.entries(o)) if (rows[k]) {
      const d = defs.find(x => x.id === k);
      let x = typeof v === 'function' ? v(cur) : v;
      x = Math.min(+d.max, Math.max(+d.min, x));
      vals[k] = x; rows[k].inp.value = x; rows[k].show();
    }
    onChange(vals);
  };
  return box;
}
const fk = v => fmt(v, Math.abs(v) < 0.01 ? 6 : 4);
