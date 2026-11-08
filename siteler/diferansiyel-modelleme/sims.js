/* Canlı modeller. Her biri mount(kutu) → {set(değerler)} döndürür. Sayısal çözüm RK4, kapalı çözüm yalnız gösterim için. */
'use strict';
const SIM = {};

function simShell(el, opts = {}) {
  el.classList.add('sim');
  const vis = opts.vis ? h('canvas', { class: 'vis', height: '220' }) : null;
  const plot = h('canvas', { class: 'plot', height: '260' });
  const plot2 = opts.plot2 ? h('canvas', { class: 'plot', height: '200' }) : null;
  const eq = h('div', { class: 'simeq' });
  const ro = h('div', { class: 'ro' });
  const top = h('div', { class: 'simtop' + (vis ? ' two' : '') }, vis, h('div', null, plot, plot2));
  el.append(eq, top, ro);
  return { vis, plot, plot2, eq, ro };
}
function readout(ro, rows) {
  ro.innerHTML = rows.map(([k, v, hot]) => `<div class="${hot ? 'hot' : ''}"><span class="lab">${tx(k)}</span><b>${tx(v)}</b></div>`).join('');
}
function vctx(cv) {
  const dpr = window.devicePixelRatio || 1, w = cv.clientWidth, hh = cv.clientHeight;
  if (cv.width !== Math.round(w * dpr)) { cv.width = Math.round(w * dpr); cv.height = Math.round(hh * dpr); }
  const g = cv.getContext('2d'); g.setTransform(dpr, 0, 0, dpr, 0, 0); g.clearRect(0, 0, w, hh);
  g.font = '13px Bahnschrift, Barlow, sans-serif'; return { g, w, hh };
}
function arrow(g, x1, y1, x2, y2, col, wdt = 2.5) {
  const a = Math.atan2(y2 - y1, x2 - x1), L = Math.hypot(x2 - x1, y2 - y1); if (L < 2) return;
  g.strokeStyle = g.fillStyle = col; g.lineWidth = wdt; g.beginPath(); g.moveTo(x1, y1); g.lineTo(x2 - 8 * Math.cos(a), y2 - 8 * Math.sin(a)); g.stroke();
  g.beginPath(); g.moveTo(x2, y2); g.lineTo(x2 - 11 * Math.cos(a - .4), y2 - 11 * Math.sin(a - .4)); g.lineTo(x2 - 11 * Math.cos(a + .4), y2 - 11 * Math.sin(a + .4)); g.fill();
}
/* noktalarla miktar: n nokta (en çok 600), sabit tohumla hep aynı yerlerde */
function dots(g, x, y, w, hh, n, col = '#c9d0d8') {
  n = Math.max(0, Math.min(600, Math.round(n))); let s = 7;
  const rnd = () => (s = (s * 16807) % 2147483647) / 2147483647;
  g.fillStyle = col;
  for (let i = 0; i < n; i++) { const px = x + 6 + rnd() * (w - 12), py = y + 6 + rnd() * (hh - 12); g.beginPath(); g.arc(px, py, 2.2, 0, 7); g.fill(); }
}

/* 1 · BÜYÜME / BOZUNMA: dy/dt = ±k y */
SIM.ustel = function (el, o) {
  const sign = o.sign || 1, U = o.unit || '', TU = o.tunit || 'yıl';
  const S = simShell(el, { vis: true });
  const P = new Plot(S.plot, { xl: 't (' + TU + ')', yl: o.yl || 'y(t)' });
  const sl = sliders([
    { id: 'A', label: '$y(0)=A$ (başlangıç)', min: o.Amin || 10, max: o.Amax || 1000, step: o.Astep || 10, val: o.A || 100, unit: U },
    { id: 'k', label: 'orantı sabiti $k$', min: o.kmin || 0.005, max: o.kmax || 0.2, step: o.kstep || 0.0001, val: o.k || 0.0139, f: v => fmt(v, v < 0.01 ? 6 : 4) },
    { id: 'T', label: 'grafik süresi', min: 5, max: o.Tmax || 200, step: 1, val: o.T || 100, unit: TU },
    { id: 't', label: 'imleç $t$', min: 0, max: 1, step: 0.005, val: 0.5, f: v => '%' + Math.round(v * 100) }
  ], draw);
  el.append(sl);
  function draw(v) {
    v = v || sl.vals; const { A, k, T } = v, t = v.t * T;
    const f = (tt, y) => sign * k * y, pts = rk4(f, 0, A, T, 300);
    const y = A * Math.exp(sign * k * t), r = sign * k * y;
    const ymax = sign > 0 ? Math.max(A * Math.exp(k * T), A) * 1.05 : A * 1.08;
    P.draw = () => {
      P.setup(0, T, 0, ymax); P.axes();
      const th = Math.log(2) / k;                              // ikiye katlanma / yarılanma süresi
      for (let i = 1; i * th < T && i < 12; i++) { P.vline(i * th); }
      P.line(pts); P.tangent(t, y, r); P.dot(t, y, '#ff2d20', 5, 'eğim = ' + fmt(r, 2));
    };
    P.draw();
    const V = vctx(S.vis), g = V.g;
    g.fillStyle = '#8e99a6'; g.fillText(o.vislab || 'her nokta = aynı miktar', 10, 18);
    g.strokeStyle = '#2a323c'; g.strokeRect(8, 26, V.w - 16, V.hh - 70);
    dots(g, 8, 26, V.w - 16, V.hh - 70, y / ymax * 600);
    g.fillStyle = '#fff'; g.font = '600 15px Bahnschrift, sans-serif';
    g.fillText(`t = ${fmt(t, 1)} ${TU}   y = ${fmt(y, 1)} ${U}`, 10, V.hh - 26);
    g.fillStyle = '#ff2d20'; g.fillText(`hız = ${sign > 0 ? '+' : '−'}k·y = ${fmt(r, 2)} ${U}/${TU}`, 10, V.hh - 6);
    const th = Math.log(2) / k;
    S.eq.innerHTML = tx(sign > 0
      ? `$\\dfrac{dy}{dt}=+k\\,y=${fk(k)}\\,y$ &nbsp;→&nbsp; $y=${fmt(A, 0)}\\,e^{${fk(k)}t}$`
      : `$\\dfrac{dy}{dt}=-k\\,y=-${fk(k)}\\,y$ &nbsp;→&nbsp; $y=${fmt(A, 0)}\\,e^{-${fk(k)}t}$`);
    readout(S.ro, [
      ['$y(t)$', fmt(y, 2) + ' ' + U],
      ['hız $\\frac{dy}{dt}$', fmt(r, 3) + ' ' + U + '/' + TU, 1],
      ['$\\frac{dy/dt}{y}$ (hep aynı!)', fmt(r / y, 4), 1],
      [sign > 0 ? 'ikiye katlanma süresi $\\frac{\\ln 2}{k}$' : 'yarılanma süresi $\\frac{\\ln 2}{k}$', fmt(th, 2) + ' ' + TU],
      ['kesikli çizgiler', sign > 0 ? 'her biri bir "2 katı"' : 'her biri bir "yarısı"']
    ]);
  }
  draw();
  return { set: o2 => sl.set(o2) };
};

/* 3 · NEWTON SOĞUMA: dT/dt = −k (T − T_ortam) */
SIM.newton = function (el, o) {
  const S = simShell(el, { vis: true });
  const P = new Plot(S.plot, { xl: 't (dk)', yl: 'T (°C)' });
  const sl = sliders([
    { id: 'T0', label: 'başlangıç $T(0)$', min: 0, max: 100, step: 1, val: o.T0 ?? 80, unit: '°C' },
    { id: 'Ta', label: 'ortam $T_{ortam}$', min: 0, max: 60, step: 1, val: o.Ta ?? 20, unit: '°C' },
    { id: 'k', label: 'orantı sabiti $k$', min: 0.005, max: 0.2, step: 0.001, val: o.k ?? 0.0405, f: v => fmt(v, 4) },
    { id: 'T', label: 'grafik süresi', min: 10, max: 150, step: 1, val: o.T ?? 60, unit: 'dk' },
    { id: 't', label: 'imleç $t$', min: 0, max: 1, step: 0.005, val: 0.3, f: v => '%' + Math.round(v * 100) }
  ], draw);
  el.append(sl);
  function draw(v) {
    v = v || sl.vals; const { T0, Ta, k, T } = v, t = v.t * T;
    const pts = rk4((tt, y) => -k * (y - Ta), 0, T0, T, 300);
    const Tt = Ta + (T0 - Ta) * Math.exp(-k * t), r = -k * (Tt - Ta);
    const lo = Math.min(T0, Ta) - 5, hi = Math.max(T0, Ta) + 5;
    P.draw = () => { P.setup(0, T, Math.max(lo, -10), hi); P.axes(); P.hline(Ta, 'rgba(201,208,216,.7)', 'ortam ' + fmt(Ta, 0) + '°C'); P.line(pts); P.tangent(t, Tt, r); P.dot(t, Tt, '#ff2d20', 5, 'eğim = ' + fmt(r, 2)); };
    P.draw();
    const V = vctx(S.vis), g = V.g, base = V.hh - 40, top = 34, sc = (V.hh - 80) / (hi - lo);
    const yy = T => base - (T - lo) * sc;
    g.fillStyle = '#8e99a6'; g.fillText('çay', 40, 18); g.fillText('ortam', V.w - 100, 18);
    g.fillStyle = '#2a323c'; g.fillRect(40, top, 34, base - top); g.fillRect(V.w - 100, top, 34, base - top);
    g.fillStyle = '#fff'; g.fillRect(40, yy(Tt), 34, base - yy(Tt));
    g.fillStyle = '#8e99a6'; g.fillRect(V.w - 100, yy(Ta), 34, base - yy(Ta));
    g.strokeStyle = '#ff2d20'; g.lineWidth = 2; g.setLineDash([4, 3]);
    g.beginPath(); g.moveTo(74, yy(Tt)); g.lineTo(V.w - 100, yy(Tt)); g.moveTo(74, yy(Ta)); g.lineTo(V.w - 100, yy(Ta)); g.stroke(); g.setLineDash([]);
    const mx = (74 + V.w - 100) / 2; arrow(g, mx, yy(Ta), mx, yy(Tt), '#ff2d20', 2); arrow(g, mx, yy(Tt), mx, yy(Ta), '#ff2d20', 2);
    g.fillStyle = '#ff2d20'; g.font = '600 14px Bahnschrift, sans-serif'; g.textAlign = 'center';
    g.fillText('fark = ' + fmt(Tt - Ta, 1) + '°C', mx, (yy(Ta) + yy(Tt)) / 2 - 6);
    g.fillStyle = '#fff'; g.fillText(fmt(Tt, 1) + '°C', 57, yy(Tt) - 6); g.textAlign = 'left';
    g.fillStyle = '#c9d0d8'; g.fillText(`t = ${fmt(t, 1)} dk   hız = −k·fark = ${fmt(r, 2)} °C/dk`, 10, V.hh - 12);
    S.eq.innerHTML = tx(`$\\dfrac{dT}{dt}=-k\\,(T-T_{ortam})=-${fk(k)}\\,(T-${fmt(Ta, 0)})$ &nbsp;→&nbsp; $T=${fmt(Ta, 0)}+${fmt(T0 - Ta, 0)}\\,e^{-${fk(k)}t}$`);
    readout(S.ro, [
      ['$T(t)$', fmt(Tt, 2) + ' °C'],
      ['fark $T-T_{ortam}$', fmt(Tt - Ta, 2) + ' °C', 1],
      ['hız $\\frac{dT}{dt}$', fmt(r, 3) + ' °C/dk', 1],
      ['$\\frac{dT/dt}{\\text{fark}}$ (hep $-k$)', fmt(r / (Tt - Ta || 1e-9), 4)],
      ['durum', T0 > Ta ? 'soğuyor (hız eksi)' : T0 < Ta ? 'ısınıyor (hız artı)' : 'denge: değişmez']
    ]);
  }
  draw();
  return { set: o2 => sl.set(o2) };
};

/* 4 · LOJİSTİK: dP/dt = k P (K − P) */
SIM.lojistik = function (el, o) {
  const S = simShell(el, { vis: true, plot2: true });
  const P = new Plot(S.plot, { xl: 't (yıl)', yl: 'P(t)' });
  const P2 = new Plot(S.plot2, { xl: 'P', yl: 'dP/dt' });
  const sl = sliders([
    { id: 'P0', label: 'başlangıç $P(0)$', min: 10, max: 1190, step: 10, val: o.P0 ?? 100 },
    { id: 'K', label: 'sınır (yiyeceğin yettiği)', min: 400, max: 3000, step: 50, val: o.K ?? 1200 },
    { id: 'k', label: 'orantı sabiti $k$', min: 0.0002, max: 0.004, step: 0.00002, val: o.k ?? 0.00142, f: v => fmt(v, 5) },
    { id: 'T', label: 'grafik süresi', min: 2, max: 20, step: 0.5, val: o.T ?? 5, unit: 'yıl' },
    { id: 't', label: 'imleç $t$', min: 0, max: 1, step: 0.005, val: 0.4, f: v => '%' + Math.round(v * 100) }
  ], draw);
  el.append(sl);
  function draw(v) {
    v = v || sl.vals; const { P0, K, k, T } = v, t = v.t * T;
    const f = (tt, p) => k * p * (K - p), pts = rk4(f, 0, P0, T, 500);
    const D = (K - P0) / P0, Pt = K / (1 + D * Math.exp(-K * k * t)), r = f(0, Pt);
    P.draw = () => { P.setup(0, T, 0, Math.max(K, P0) * 1.08); P.axes(); P.hline(K, 'rgba(201,208,216,.7)', 'sınır ' + K); P.hline(K / 2, 'rgba(201,208,216,.35)', 'yarısı ' + K / 2 + ' (en hızlı)'); P.line(pts); P.tangent(t, Pt, r, .08); P.dot(t, Pt, '#ff2d20', 5, 'eğim = ' + fmt(r, 1)); };
    P.draw();
    const par = []; for (let i = 0; i <= 100; i++) { const p = K * i / 100; par.push([p, k * p * (K - p)]); }
    P2.draw = () => { P2.setup(0, K, 0, k * K * K / 4 * 1.15); P2.axes(); P2.line(par, '#c9d0d8', 2); P2.dot(Pt, r, '#ff2d20', 5); };
    P2.draw();
    const V = vctx(S.vis), g = V.g, w = V.w - 20, bw = w * Pt / K;
    g.fillStyle = '#8e99a6'; g.fillText('toplam sınır = ' + K + ' (yiyecek bu kadarına yetiyor)', 10, 18);
    g.fillStyle = '#fff'; g.fillRect(10, 30, Math.max(0, Math.min(w, bw)), 34);
    g.fillStyle = '#2a323c'; g.fillRect(10 + bw, 30, Math.max(0, w - bw), 34);
    g.font = '600 13px Bahnschrift, sans-serif'; g.fillStyle = '#0b0e12'; if (bw > 70) g.fillText('P = ' + fmt(Pt, 0), 16, 52);
    g.fillStyle = '#c9d0d8'; if (w - bw > 90) g.fillText('B = K−P = ' + fmt(K - Pt, 0), 16 + bw, 52);
    dots(g, 10, 74, Math.max(4, Math.min(w, bw)), V.hh - 124, Pt / K * 250, '#fff');
    g.fillStyle = '#ff2d20'; g.font = '600 14px Bahnschrift, sans-serif';
    g.fillText(`hız = k · P · B = ${fmt(k, 5)} · ${fmt(Pt, 0)} · ${fmt(K - Pt, 0)} = ${fmt(r, 1)} /yıl`, 10, V.hh - 30);
    g.fillStyle = '#8e99a6'; g.font = '13px Bahnschrift, sans-serif';
    g.fillText(Pt < K * 0.3 ? 'P az: doğuran az → yavaş' : Pt > K * 0.7 ? 'B az: yiyecek bitiyor → yavaş' : 'ikisi de orta: en hızlı bölge', 10, V.hh - 10);
    S.eq.innerHTML = tx(`$\\dfrac{dP}{dt}=k\\cdot P\\cdot B=k\\,P\\,(${K}-P)$ &nbsp;→&nbsp; $P=\\dfrac{${K}}{1+${fmt(D, 2)}\\,e^{-${K}\\cdot${fmt(k, 5)}\\,t}}$`);
    readout(S.ro, [
      ['$P(t)$ sağlıklı (sayılan)', fmt(Pt, 1)],
      ['$B=K-P$ sıkıntılı', fmt(K - Pt, 1)],
      ['hız $\\frac{dP}{dt}$', fmt(r, 2) + ' /yıl', 1],
      ['$P(1)$, $P(2)$', fmt(K / (1 + D * Math.exp(-K * k)), 0) + ' , ' + fmt(K / (1 + D * Math.exp(-2 * K * k)), 0)],
      ['alt grafik', 'hız, P\'ye göre: tepe P = K/2']
    ]);
  }
  draw();
  return { set: o2 => sl.set(o2) };
};

/* 5 · MALİYET: dy/dx = (x²+y²)/(2xy) — yön alanı + (x0,y0)'dan geçen eğri y² = x² + D x */
SIM.maliyet = function (el, o) {
  const S = simShell(el, {});
  const P = new Plot(S.plot, { xl: 'x (sipariş büyüklüğü)', yl: 'y (maliyet)' });
  S.plot.height = 320;
  const sl = sliders([
    { id: 'x0', label: 'verilen nokta $x_0$', min: 0.5, max: 4, step: 0.1, val: 1 },
    { id: 'y0', label: 'verilen nokta $y_0$', min: 0.5, max: 8, step: 0.1, val: 3 },
    { id: 'xc', label: 'imleç $x$', min: 0.3, max: 6, step: 0.05, val: 2 }
  ], draw);
  el.append(sl);
  const F = (x, y) => (x * x + y * y) / (2 * x * y);
  function draw(v) {
    v = v || sl.vals; const { x0, y0, xc } = v, D = (y0 * y0 - x0 * x0) / x0;
    const Y = x => { const q = x * x + D * x; return q > 0 ? Math.sqrt(q) : NaN; };
    const pts = []; for (let i = 1; i <= 300; i++) { const x = 6 * i / 300, y = Y(x); if (isFinite(y)) pts.push([x, y]); }
    const yc = Y(xc), m = F(xc, yc);
    P.draw = () => {
      P.setup(0, 6, 0, 9); P.axes(); const g = P.g; g.strokeStyle = 'rgba(201,208,216,.35)'; g.lineWidth = 1.2;
      for (let i = 1; i <= 12; i++) for (let j = 1; j <= 9; j++) {
        const x = i * 0.5, y = j, s = F(x, y), a = Math.atan(s * (P.y0 - P.y1) / 9 / ((P.x1 - P.x0) / 6)), L = 9;
        g.beginPath(); g.moveTo(P.X(x) - L * Math.cos(a), P.Y(y) + L * Math.sin(a)); g.lineTo(P.X(x) + L * Math.cos(a), P.Y(y) - L * Math.sin(a)); g.stroke();
      }
      P.line(pts); P.dot(x0, y0, '#fff', 5, `(${fmt(x0, 1)}; ${fmt(y0, 1)})`);
      if (isFinite(yc)) { P.tangent(xc, yc, m, .08); P.dot(xc, yc, '#ff2d20', 5); }
    };
    P.draw();
    S.eq.innerHTML = tx(`$\\dfrac{dy}{dx}=\\underbrace{(x^2+y^2)}_{\\text{doğru: çarp}}\\cdot\\underbrace{\\dfrac{1}{2xy}}_{\\text{ters: böl}}$ &nbsp;→&nbsp; $y^2=x^2+${fmt(D, 2)}\\,x$`);
    readout(S.ro, [
      ['imleçte $x$, $y$', isFinite(yc) ? fmt(xc, 2) + ' ; ' + fmt(yc, 3) : 'eğri burada yok'],
      ['$x^2+y^2$', isFinite(yc) ? fmt(xc * xc + yc * yc, 3) : '—'],
      ['$2xy$', isFinite(yc) ? fmt(2 * xc * yc, 3) : '—'],
      ['eğim $\\frac{dy}{dx}$ = bölüm', isFinite(yc) ? fmt(m, 3) : '—', 1],
      ['gri çizgiler', 'her noktada denklemin verdiği eğim']
    ]);
  }
  draw();
  return { set: o2 => sl.set(o2) };
};

/* 6 · KARIŞIM: dx/dt = a·c − b·x/(V0 + (a−b) t) */
SIM.tank = function (el, o) {
  const S = simShell(el, { vis: true, plot2: true });
  const P = new Plot(S.plot, { xl: 't (sn)', yl: 'x(t) tuz (g)' });
  const P2 = new Plot(S.plot2, { xl: 't (sn)', yl: 'derişim x/V (g/L)' });
  const sl = sliders([
    { id: 'a', label: 'giren debi', min: 0, max: 10, step: 0.5, val: 5, unit: 'L/sn' },
    { id: 'c', label: 'girenin derişimi', min: 0, max: 5, step: 0.1, val: 2, unit: 'g/L' },
    { id: 'b', label: 'çıkan debi', min: 0, max: 10, step: 0.5, val: 3, unit: 'L/sn' },
    { id: 'V0', label: 'başlangıç hacmi $V_0$', min: 10, max: 200, step: 5, val: 50, unit: 'L' },
    { id: 'x0', label: 'başlangıç tuzu $x(0)$', min: 0, max: 300, step: 5, val: 10, unit: 'g' },
    { id: 'T', label: 'grafik süresi', min: 10, max: 300, step: 5, val: 60, unit: 'sn' },
    { id: 't', label: 'imleç $t$', min: 0, max: 1, step: 0.005, val: 0.25, f: v => '%' + Math.round(v * 100) }
  ], draw);
  el.append(sl);
  function draw(v) {
    v = v || sl.vals; const { a, c, b, V0, x0 } = v; let T = v.T;
    const Vt = t => V0 + (a - b) * t;
    let Tend = T, empty = false; if (a < b) { const te = V0 / (b - a); if (te < T) { Tend = te * 0.999; empty = true; } }
    const f = (t, x) => a * c - b * x / Vt(t), pts = rk4(f, 0, x0, Tend, 600);
    const t = v.t * Tend, xt = rk4(f, 0, x0, t || 1e-9, 300).pop()[1], Vn = Vt(t), cn = xt / Vn;
    const ymax = Math.max(...pts.map(p => p[1])) * 1.1 + 1;
    P.draw = () => { P.setup(0, T, 0, ymax); P.axes(); P.line(pts); P.dot(t, xt, '#ff2d20', 5, fmt(xt, 1) + ' g'); };
    P.draw();
    const cp = pts.map(([tt, x]) => [tt, x / Vt(tt)]), cmax = Math.max(c, ...cp.map(p => p[1])) * 1.15 + 0.1;
    P2.draw = () => { P2.setup(0, T, 0, cmax); P2.axes(); P2.hline(c, 'rgba(201,208,216,.6)', 'giren derişim ' + fmt(c, 1)); P2.line(cp, '#c9d0d8', 2); P2.dot(t, cn, '#ff2d20', 4); };
    P2.draw();
    /* tank çizimi */
    const W = vctx(S.vis), g = W.g, tx0 = W.w * 0.28, tw = W.w * 0.44, ty = 40, th = W.hh - 80;
    const Vmax = Math.max(V0, Vt(T), V0 + Math.max(0, a - b) * T) * 1.05, lvl = th * Math.max(0, Vn) / Vmax;
    g.strokeStyle = '#c9d0d8'; g.lineWidth = 2; g.beginPath(); g.moveTo(tx0, ty); g.lineTo(tx0, ty + th); g.lineTo(tx0 + tw, ty + th); g.lineTo(tx0 + tw, ty); g.stroke();
    const shade = Math.min(1, cn / Math.max(c, 0.5, cmax * 0.8));
    g.fillStyle = `rgba(201,208,216,${0.12 + 0.55 * shade})`; g.fillRect(tx0 + 2, ty + th - lvl, tw - 4, lvl);
    arrow(g, 6, ty + 6, tx0 + 20, ty + 6, '#fff'); arrow(g, tx0 + tw - 4, ty + th - 12, W.w - 6, ty + th - 12, '#ff2d20');
    g.fillStyle = '#fff'; g.font = '600 13px Bahnschrift, sans-serif'; g.fillText(`giren: ${fmt(a, 1)} L/sn × ${fmt(c, 1)} g/L`, 6, 18);
    g.fillText(`= ${fmt(a * c, 2)} g/sn`, 6, 34);
    g.fillStyle = '#ff2d20'; g.textAlign = 'right'; g.fillText(`çıkan: ${fmt(b, 1)} L/sn × ${fmt(cn, 3)} g/L`, W.w - 6, ty + th + 12);
    g.fillText(`= ${fmt(b * cn, 2)} g/sn`, W.w - 6, ty + th + 28); g.textAlign = 'center';
    g.fillStyle = '#0b0e12'; if (lvl > 40) { g.fillText(`V = ${fmt(Vn, 1)} L`, tx0 + tw / 2, ty + th - lvl / 2 - 6); g.fillText(`x = ${fmt(xt, 1)} g`, tx0 + tw / 2, ty + th - lvl / 2 + 12); }
    else { g.fillStyle = '#c9d0d8'; g.fillText(`V = ${fmt(Vn, 1)} L, x = ${fmt(xt, 1)} g`, tx0 + tw / 2, ty + th / 2); }
    g.textAlign = 'left';
    const dV = a - b, Vtex = dV === 0 ? `${V0}` : `${V0}${dV > 0 ? '+' : '-'}${fmt(Math.abs(dV), 1)}t`;
    S.eq.innerHTML = tx(`$\\dfrac{dx}{dt}=\\underbrace{${fmt(a, 1)}\\cdot${fmt(c, 1)}}_{\\text{giren g/sn}}-\\underbrace{${fmt(b, 1)}\\cdot\\dfrac{x}{${Vtex}}}_{\\text{çıkan g/sn}}$ , &nbsp; $x(0)=${fmt(x0, 0)}$`);
    readout(S.ro, [
      ['hacim $V(t)$', fmt(Vn, 2) + ' L' + (dV === 0 ? ' (sabit)' : '')],
      ['tuz $x(t)$', fmt(xt, 2) + ' g'],
      ['derişim $\\frac{x}{V}$', fmt(cn, 3) + ' g/L'],
      ['giren − çıkan', `${fmt(a * c, 2)} − ${fmt(b * cn, 2)} = ${fmt(a * c - b * cn, 2)} g/sn`, 1],
      ['not', empty ? 'tank ' + fmt(V0 / (b - a), 1) + ' sn\'de boşalıyor' : 'derişim giren derişime yaklaşır']
    ]);
  }
  draw();
  return { set: o2 => sl.set(o2) };
};

/* 7 · DÜŞME: m dv/dt = mg − k v  (k = 0 → serbest düşme) */
SIM.dusme = function (el, o) {
  const S = simShell(el, { vis: true });
  const P = new Plot(S.plot, { xl: 't (sn)', yl: 'v (m/sn)' });
  const g0 = 9.81;
  const sl = sliders([
    { id: 'm', label: 'kütle $m$', min: 1, max: 100, step: 1, val: o.m ?? 70, unit: 'kg' },
    { id: 'k', label: 'hava direnci sabiti $k$', min: 0, max: 40, step: 0.5, val: o.k ?? 12, unit: 'kg/sn' },
    { id: 'T', label: 'grafik süresi', min: 2, max: 60, step: 1, val: o.T ?? 30, unit: 'sn' },
    { id: 't', label: 'imleç $t$', min: 0, max: 1, step: 0.005, val: 0.15, f: v => '%' + Math.round(v * 100) }
  ], draw);
  el.append(sl);
  function draw(v) {
    v = v || sl.vals; const { m, k, T } = v, t = v.t * T;
    const f = (tt, vv) => g0 - k / m * vv, pts = rk4(f, 0, 0, T, 400);
    const vt = k > 0 ? m * g0 / k * (1 - Math.exp(-k / m * t)) : g0 * t, vl = k > 0 ? m * g0 / k : Infinity;
    const ymax = (k > 0 ? Math.min(vl * 1.15, g0 * T) : g0 * T) * 1.05 + 1;
    P.draw = () => { P.setup(0, T, 0, ymax); P.axes(); if (k > 0) P.hline(vl, 'rgba(201,208,216,.7)', 'uç hız mg/k = ' + fmt(vl, 1)); P.line(pts); P.tangent(t, vt, f(0, vt)); P.dot(t, vt, '#ff2d20', 5, 'a = ' + fmt(f(0, vt), 2)); };
    P.draw();
    const W = vctx(S.vis), g = W.g, cx = W.w / 2, cy = W.hh / 2 - 4, sc = 110 / (m * g0);
    g.fillStyle = '#fff'; g.beginPath(); g.arc(cx, cy, 16, 0, 7); g.fill();
    arrow(g, cx, cy + 18, cx, cy + 18 + m * g0 * sc, '#c9d0d8', 3);
    if (k > 0) arrow(g, cx, cy - 18, cx, cy - 18 - k * vt * sc, '#ff2d20', 3);
    g.font = '600 13px Bahnschrift, sans-serif'; g.fillStyle = '#c9d0d8'; g.fillText('ağırlık mg = ' + fmt(m * g0, 0) + ' N', cx + 14, cy + 70);
    g.fillStyle = '#ff2d20'; g.fillText('direnç kv = ' + fmt(k * vt, 0) + ' N', cx + 14, cy - 40);
    g.fillStyle = '#fff'; g.fillText('net = mg − kv = ' + fmt(m * g0 - k * vt, 0) + ' N', 10, W.hh - 10);
    S.eq.innerHTML = tx(k > 0
      ? `$m\\dfrac{dv}{dt}=mg-kv\\ \\to\\ \\dfrac{dv}{dt}+\\dfrac{${fmt(k, 1)}}{${fmt(m, 0)}}\\,v=9{,}81$ &nbsp;→&nbsp; $v=\\dfrac{mg}{k}\\left(1-e^{-\\frac kmt}\\right)$`
      : `$m\\dfrac{dv}{dt}=mg\\ \\to\\ \\dfrac{dv}{dt}=g$ &nbsp;→&nbsp; $v=g\\,t,\\ \\ y=\\tfrac12g\\,t^2$`);
    readout(S.ro, [
      ['hız $v(t)$', fmt(vt, 2) + ' m/sn'],
      ['direnç $k\\,v$', fmt(k * vt, 1) + ' N'],
      ['ivme $\\frac{dv}{dt}=g-\\frac kmv$', fmt(f(0, vt), 3) + ' m/sn²', 1],
      ['uç hız $\\frac{mg}{k}$', k > 0 ? fmt(vl, 2) + ' m/sn' : 'direnç yok → sınırsız'],
      ['yol (serbest düşme)', k > 0 ? '—' : '$y=\\tfrac12gt^2$ = ' + fmt(g0 * t * t / 2, 1) + ' m']
    ]);
  }
  draw();
  return { set: o2 => sl.set(o2) };
};

/* 8 · RC DEVRESİ: R dq/dt + q/C = V0 */
SIM.rc = function (el, o) {
  const S = simShell(el, { vis: true });
  const P = new Plot(S.plot, { xl: 't (sn)', yl: 'q (C)' });
  const sl = sliders([
    { id: 'V0', label: 'kaynak $V_0$ (0 = deşarj)', min: 0, max: 24, step: 1, val: 12, unit: 'V' },
    { id: 'R', label: 'direnç $R$', min: 1, max: 20, step: 1, val: 5, unit: 'Ω' },
    { id: 'C', label: 'kondansatör $C$', min: 0.1, max: 2, step: 0.1, val: 1, unit: 'F' },
    { id: 'q0', label: 'başlangıç yükü $q_0$', min: 0, max: 40, step: 1, val: 0, unit: 'C' },
    { id: 't', label: 'imleç $t$', min: 0, max: 1, step: 0.005, val: 0.2, f: v => '%' + Math.round(v * 100) }
  ], draw);
  el.append(sl);
  function draw(v) {
    v = v || sl.vals; const { V0, R, C, q0 } = v, tau = R * C, T = 5 * tau, t = v.t * T;
    const f = (tt, q) => V0 / R - q / (R * C), pts = rk4(f, 0, q0, T, 300);
    const qt = V0 * C + (q0 - V0 * C) * Math.exp(-t / tau), it = f(0, qt);
    const ymax = Math.max(V0 * C, q0) * 1.12 + 0.5;
    P.draw = () => { P.setup(0, T, 0, ymax); P.axes(); P.hline(V0 * C, 'rgba(201,208,216,.7)', 'denge V₀C = ' + fmt(V0 * C, 1)); P.vline(tau); P.line(pts); P.tangent(t, qt, it); P.dot(t, qt, '#ff2d20', 5, 'i = ' + fmt(it, 2) + ' A'); };
    P.draw();
    const W = vctx(S.vis), g = W.g, VR = it * R, VC = qt / C, bw = W.w - 20, sc = bw / Math.max(V0, VR + VC, 1);
    g.fillStyle = '#8e99a6'; g.fillText('gerilimler toplamı = kaynak (Kirchhoff)', 10, 18);
    g.fillStyle = '#ff2d20'; g.fillRect(10, 34, Math.max(0, VR * sc), 32); g.fillStyle = '#c9d0d8'; g.fillRect(10 + Math.max(0, VR * sc), 34, Math.max(0, VC * sc), 32);
    g.strokeStyle = '#fff'; g.strokeRect(10, 30, V0 * sc, 40);
    g.font = '600 13px Bahnschrift, sans-serif'; g.fillStyle = '#ff2d20'; g.fillText('V_R = iR = ' + fmt(VR, 2) + ' V', 10, 92);
    g.fillStyle = '#c9d0d8'; g.fillText('V_C = q/C = ' + fmt(VC, 2) + ' V', 10, 112);
    g.fillStyle = '#fff'; g.fillText('toplam = ' + fmt(VR + VC, 2) + ' V = V₀', 10, 132);
    g.fillStyle = '#8e99a6'; g.font = '13px Bahnschrift, sans-serif';
    g.fillText('kondansatör doldukça V_C artar, V_R ve akım azalır', 10, W.hh - 12);
    S.eq.innerHTML = tx(`$R\\dfrac{dq}{dt}+\\dfrac1Cq=V_0\\ \\to\\ \\dfrac{dq}{dt}+\\dfrac{1}{${fmt(tau, 1)}}\\,q=\\dfrac{${V0}}{${R}}$ &nbsp; ($RC=${fmt(tau, 1)}$ sn)`);
    readout(S.ro, [
      ['yük $q(t)$', fmt(qt, 2) + ' C'],
      ['akım $i=\\frac{dq}{dt}$', fmt(it, 3) + ' A', 1],
      ['$V_R+V_C$', fmt(VR, 2) + ' + ' + fmt(VC, 2) + ' = ' + fmt(VR + VC, 2) + ' V'],
      ['zaman sabiti $RC$', fmt(tau, 2) + ' sn (kesikli çizgi)'],
      ['$t\\to\\infty$', 'q → V₀C = ' + fmt(V0 * C, 1) + ' C, i → 0']
    ]);
  }
  draw();
  return { set: o2 => sl.set(o2) };
};

/* Orantı tanıtımı: y = k·x, doğru/ters/çarpım */
SIM.oranti = function (el) {
  const S = simShell(el, {});
  const P = new Plot(S.plot, { xl: 'x', yl: 'y' });
  let mode = 'dogru';
  const tabs = h('div', { class: 'seg' });
  const modes = [['dogru', 'doğru orantı'], ['ters', 'ters orantı'], ['kare', 'karesiyle orantı']];
  for (const [m, l] of modes) tabs.append(h('button', { class: m === mode ? 'on' : '', onclick: e => { mode = m; $$('button', tabs).forEach(b => b.classList.remove('on')); e.target.classList.add('on'); draw(); } }, l));
  el.prepend(tabs);
  const sl = sliders([{ id: 'k', label: 'orantı sabiti $k$', min: 0.2, max: 3, step: 0.1, val: 1 }, { id: 'x', label: 'imleç $x$', min: 0.5, max: 5, step: 0.5, val: 2 }], draw);
  el.append(sl);
  function draw(v) {
    v = v || sl.vals; const { k, x } = v, F = mode === 'dogru' ? q => k * q : mode === 'ters' ? q => k / q : q => k * q * q;
    const pts = []; for (let i = 1; i <= 200; i++) { const q = 5 * i / 200; pts.push([q, F(q)]); }
    P.draw = () => { P.setup(0, 5, 0, mode === 'kare' ? k * 25 * 1.05 : mode === 'ters' ? Math.min(k * 6, 12) : k * 5 * 1.05); P.axes(); P.line(pts); P.dot(x, F(x), '#ff2d20', 5); if (2 * x <= 5) P.dot(2 * x, F(2 * x), '#c9d0d8', 5, '2x'); };
    P.draw();
    const T = { dogru: '$y\\propto x\\ \\to\\ y=k\\,x$', ters: '$y\\propto\\dfrac1x\\ \\to\\ y=\\dfrac kx$', kare: '$y\\propto x^2\\ \\to\\ y=k\\,x^2$' };
    S.eq.innerHTML = tx(T[mode] + ' &nbsp; ($\\propto$ "orantılı" demek; $k$ yazınca eşittir olur)');
    const r = F(2 * x) / F(x);
    readout(S.ro, [['$x$ → $y$', fmt(x, 1) + ' → ' + fmt(F(x), 2)], ['$2x$ → $y$', fmt(2 * x, 1) + ' → ' + fmt(F(2 * x), 2)], ['x 2 katı olunca y', '× ' + fmt(r, 2), 1], ['$\\frac{y}{x}$, $y\\cdot x$, $\\frac{y}{x^2}$', mode === 'dogru' ? 'y/x = k sabit' : mode === 'ters' ? 'y·x = k sabit' : 'y/x² = k sabit']]);
  }
  draw();
  return { set: o => sl.set(o) };
};
