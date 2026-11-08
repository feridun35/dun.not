'use strict';
/* Sahne yardımcıları + 1. grup sahneler (1. Hafta ve Güvenlik bölümü).
   Her sahne: SC[id] = { t: başlık, b(V, P) } — V: E3.View, P: kontrol paneli. */
const SC = {};
const COL = { red: '#ff2d20', el: '#4fd8ff', volt: '#6f9bd1', amber: '#ffb020', ok: '#5fd18b', w: '#ffffff', mid: '#8e99a6', cu: '#c98a4b', bad: '#ff5a4f' };

const H = {
  path(pts, closed) {
    const P = closed ? pts.concat([pts[0]]) : pts.slice(), L = [0];
    for (let i = 1; i < P.length; i++) L.push(L[i - 1] + Math.hypot(P[i][0] - P[i - 1][0], P[i][1] - P[i - 1][1], P[i][2] - P[i - 1][2]));
    const len = L[L.length - 1];
    return {
      len, pts: P,
      at(s) {
        s = ((s % len) + len) % len;
        let i = 1; while (i < L.length - 1 && L[i] < s) i++;
        const t = (s - L[i - 1]) / ((L[i] - L[i - 1]) || 1), a = P[i - 1], b = P[i];
        return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
      }
    };
  },
  // bir yol boyunca akan parçacıklar
  flow(V, path, n, color, r = 0.06, glow = true) {
    const o = { k: 'dots', pts: [], r, color, glow, alpha: 1 }, s = Array.from({ length: n }, (_, i) => i * path.len / n);
    V.ov.push(o);
    const f = {
      o, path, step(d) { for (let i = 0; i < n; i++) s[i] += d; o.pts = s.map(x => path.at(x)); },
      set path2(p) { path = p; f.path = p; }
    };
    f.step(0); return f;
  },
  seg(V, a, b, color = '#b8925e', r = 0.045) {
    const d = E3.sub(b, a), L = Math.hypot(d[0], d[1], d[2]); if (L < 1e-6) return null;
    const ax = Math.abs(d[0]) > 1e-6 ? 'x' : Math.abs(d[1]) > 1e-6 ? 'y' : 'z';
    return V.add(E3.cyl(r, L, 8, ax), { pos: E3.mul(E3.add(a, b), 0.5), color, edge: false });
  },
  wire(V, pts, color, r) { const out = []; for (let i = 1; i < pts.length; i++) out.push(H.seg(V, pts[i - 1], pts[i], color, r)); return out.filter(Boolean); },
  resistor(len = 1.2, axis = 'x') {
    const r = 0.17, parts = [[E3.cyl(r, len, 18, 'y')]];
    [-0.3, -0.1, 0.12].forEach((t, k) => parts.push([E3.tube(r + 0.012, r - 0.02, 0.09, 18, 'y'), [0, t * len, 0]]));
    const m = E3.merge(parts);
    return axis === 'y' ? m : { v: m.v.map(p => axis === 'x' ? [p[1], -p[0], p[2]] : [p[0], -p[2], p[1]]), f: m.f };
  },
  battery(h = 1.1, r = 0.32) { return E3.merge([[E3.cyl(r, h, 22)], [E3.cyl(r * 0.35, 0.14, 12), [0, h / 2 + 0.07, 0]]]); },
  diamond(s = 0.55, t = 0.1) {
    const L = s * Math.SQRT2, b = E3.box(L, 0.07, t);
    return E3.merge([[b, [s / 2, s / 2, 0], [0, 0, -Math.PI / 4]], [b, [-s / 2, s / 2, 0], [0, 0, Math.PI / 4]], [b, [s / 2, -s / 2, 0], [0, 0, Math.PI / 4]], [b, [-s / 2, -s / 2, 0], [0, 0, -Math.PI / 4]]]);
  },
  person(scale = 1) {
    const s = scale, B = (w, h, d) => E3.box(w * s, h * s, d * s);
    return E3.merge([
      [B(0.8, 1.2, 0.36), [0, 2.2 * s, 0]], [E3.sphere(0.28 * s, 10), [0, 3.15 * s, 0]],
      [B(0.26, 1.3, 0.26), [-0.22 * s, 0.85 * s, 0]], [B(0.26, 1.3, 0.26), [0.22 * s, 0.85 * s, 0]],
      [B(1.25, 0.2, 0.2), [-1.0 * s, 2.65 * s, 0]], [B(1.25, 0.2, 0.2), [1.0 * s, 2.65 * s, 0]]]);
  },
  txt(V, p, t, o = {}) { const ov = Object.assign({ k: 'text', p, t, color: '#fff', size: 13, box: true }, o); V.ov.push(ov); return ov; },
  arrow(V, a, b, o = {}) { const ov = Object.assign({ k: 'arrow', a, b, color: COL.red }, o); V.ov.push(ov); return ov; },
  floor(V, w = 12, d = 6, y = 0) { return V.add(E3.box(w, 0.08, d), { pos: [0, y - 0.04, 0], color: '#1a2027', edge: false, bias: 50 }); },
  fmt(x, d = 2) { if (!isFinite(x)) return '∞'; const a = Math.abs(x); const s = a >= 1000 || a === 0 ? x.toFixed(0) : x.toFixed(a < 0.1 ? 4 : d); return s.replace('.', ','); },
  sm: (x, k) => x + (k - x) * 0.12
};

// 2D sahne: üç boyutlu nesne yok, yalnız ekran koordinatında çizim (aynı döngü, aynı boyutlama)
function plot2d(V, draw) { V.ov.push({ k: 'fn', fn: (c, v) => draw(c, v.W, v.H, v.time) }); }
function axes2d(c, x0, y0, w, h, lx, ly) {
  c.strokeStyle = '#4a5560'; c.lineWidth = 1; c.beginPath(); c.moveTo(x0, y0); c.lineTo(x0 + w, y0); c.moveTo(x0, y0 + h / 2); c.lineTo(x0, y0 - h / 2); c.stroke();
  c.fillStyle = '#8e99a6'; c.font = '500 12px "Bahnschrift SemiCondensed","Arial Narrow",sans-serif'; c.textAlign = 'right'; c.textBaseline = 'middle';
  c.fillText(lx, x0 + w, y0 + 12); c.textAlign = 'left'; c.fillText(ly, x0 + 4, y0 - h / 2 + 6);
}

/* ---------------- 1. HAFTA ---------------- */
SC.su = {
  t: 'Su analojisi — depo yüksekliği = V, vana = R, debi = I, çark = P',
  b(V, P) {
    V.setCam({ yaw: -0.42, pitch: 0.3, dist: 12.5, t: [-0.4, 1.7, 0] });
    H.floor(V, 11, 4.5);
    for (const [x, z] of [[-0.55, -0.55], [0.55, -0.55], [0.55, 0.55], [-0.55, 0.55]]) V.add(E3.box(0.1, 2, 0.1), { pos: [-3.6 + x, 1, z], color: '#5a646e' });
    V.add(E3.tube(1, 0.94, 3.1, 32), { pos: [-3.6, 3.55, 0], color: '#9aa6b2', alpha: 0.22, two: true, edge: false });
    V.add(E3.cyl(1, 0.1, 32), { pos: [-3.6, 2, 0], color: '#5a646e' });
    const water = V.add(E3.cyl(0.92, 1, 32), { pos: [-3.6, 2.5, 0], color: '#2f7fd6', alpha: 0.8, edge: false });
    V.add(E3.cyl(0.17, 1.5, 14), { pos: [-3.6, 1.25, 0], color: '#aab4bf', alpha: 0.3, edge: false });
    V.add(E3.cyl(0.17, 5.4, 14, 'x'), { pos: [-0.9, 0.5, 0], color: '#aab4bf', alpha: 0.3, edge: false });
    V.add(E3.box(0.55, 0.6, 0.55), { pos: [-1.2, 0.5, 0], color: '#c06a2b' });
    V.add(E3.cyl(0.05, 0.6, 8), { pos: [-1.2, 1.1, 0], color: '#aab4bf' });
    const hw = V.add(E3.merge([[E3.tube(0.36, 0.3, 0.06, 24)], [E3.box(0.62, 0.05, 0.05)], [E3.box(0.05, 0.05, 0.62)]]), { pos: [-1.2, 1.42, 0], color: '#ff2d20' });
    const gate = V.add(E3.box(0.08, 0.34, 0.36), { pos: [-1.2, 0.5, 0], color: '#2a323c' });
    const wheel = V.add(E3.merge([[E3.tube(1, 0.9, 0.36, 32, 'z')], [E3.cyl(0.12, 0.6, 12, 'z')],
      ...Array.from({ length: 8 }, (_, k) => { const a = k * Math.PI / 4; return [E3.box(0.42, 0.07, 0.5), [1.12 * Math.cos(a), 1.12 * Math.sin(a), 0], [0, 0, a]]; }),
      ...Array.from({ length: 4 }, (_, k) => [E3.box(1.8, 0.05, 0.05), [0, 0, 0], [0, 0, k * Math.PI / 4]])]), { pos: [2.85, 1.55, 0], color: '#c98a4b' });
    V.add(E3.box(0.12, 1.6, 0.12), { pos: [2.85, 0.8, -0.4], color: '#5a646e' });
    V.add(E3.box(1.6, 0.25, 1.1), { pos: [2.6, 0.12, 0], color: '#2a323c', alpha: 0.9 });
    const path = H.path([[-3.6, 2.2, 0], [-3.6, 0.5, 0], [1.8, 0.5, 0], [2.15, 0.45, 0], [2.4, 0.25, 0]]);
    const fl = H.flow(V, path, 70, COL.el, 0.07);
    const lab = {
      v: H.txt(V, [-3.6, 5.5, 0], ''), r: H.txt(V, [-1.2, 2.05, 0], 'Vana = direnç R'), i: H.txt(V, [0.4, 0.05, 0.9], 'Debi = akım I'), p: H.txt(V, [2.85, 3.05, 0], 'Çark = güç P')
    };
    let v = 12, r = 6, ang = 0, wl = 1.5;
    const out = P.out();
    const upd = () => {
      const I = r === 0 ? Infinity : r === Infinity ? 0 : v / r, Pw = v * I;
      lab.v.t = `Depo yüksekliği = gerilim V = ${v} V`;
      out.innerHTML = r === 0 ? `<b class="bad">KISA DEVRE (R = 0):</b> akımı sınırlayan hiçbir şey yok → I → ∞. Gerçekte kablo ısınır, sigorta atar. Uçlar arası gerilim = 0.`
        : r === Infinity ? `<b class="bad">AÇIK DEVRE (R = ∞):</b> vana tamamen kapalı → <b>I = 0</b>. Uçlar arasında gerilim durur ama akım yok.`
          : `I = V / R = ${v} / ${r} = <b>${H.fmt(I)} A</b> &nbsp;·&nbsp; P = V·I = ${v} × ${H.fmt(I)} = <b>${H.fmt(Pw)} W</b>`;
    };
    P.slider('Gerilim V (depo yüksekliği)', { min: 1, max: 24, step: 1, val: v, unit: 'V' }, x => { v = x; upd(); });
    const rs = P.slider('Direnç R (vana kısıklığı)', { min: 1, max: 24, step: 1, val: r, unit: 'Ω' }, x => { r = x; upd(); });
    P.btns([['Kısa devre (R = 0)', () => { r = 0; upd(); }], ['Açık devre (R = ∞)', () => { r = Infinity; upd(); }], ['Normale dön', () => { r = +rs.value; upd(); }]]);
    upd();
    V.onFrame = (dt) => {
      wl = H.sm(wl, v / 24 * 2.9);
      water.scl = [1, wl, 1]; water.pos = [-3.6, 2.05 + wl / 2, 0];
      const I = r === 0 ? 40 : r === Infinity ? 0 : v / r;
      const close = r === 0 ? 0 : r === Infinity ? 1 : 0.12 + 0.8 * (r - 1) / 23;
      gate.scl = [1, Math.max(0.02, close), 1]; gate.pos = [-1.2, 0.67 - 0.17 * close, 0];
      hw.rot = [0, close * 5, 0];
      fl.step(dt * (I === 0 ? 0 : 0.6 + 1.1 * Math.sqrt(I)));
      fl.o.alpha = I === 0 ? 0.25 : 1; fl.o.color = r === 0 ? COL.bad : COL.el;
      ang += dt * (I === 0 ? 0 : Math.min(9, 0.25 * Math.sqrt(v * I)));
      wheel.rot = [0, 0, -ang];
    };
  }
};

SC.tel = {
  t: 'Bakır telin içi — elektronlar bir yöne, geleneksel akım öbür yöne',
  b(V, P) {
    V.setCam({ yaw: -0.35, pitch: 0.28, dist: 9.5, t: [0, 0, 0] });
    V.add(E3.tube(0.75, 0.72, 9, 36, 'x'), { pos: [0, 0, 0], color: '#c98a4b', alpha: 0.18, two: true, edge: false });
    const atoms = { k: 'dots', pts: [], r: 0.085, color: '#6b7682', alpha: 1 };
    for (let x = -4.2; x <= 4.21; x += 0.7) for (const y of [-0.38, 0, 0.38]) for (const z of [-0.38, 0, 0.38]) atoms.pts.push([x, y, z]);
    V.ov.push(atoms);
    const N = 70, ex = [], ey = [], ez = [], ex0 = [];
    for (let i = 0; i < N; i++) { const a = Math.random() * 6.28, rr = Math.sqrt(Math.random()) * 0.6; ex0.push(-4.4 + 8.8 * i / N); ex.push(ex0[i]); ey.push(rr * Math.cos(a)); ez.push(rr * Math.sin(a)); }
    const el = { k: 'dots', pts: [], r: 0.06, color: COL.el, glow: true, alpha: 1 }; V.ov.push(el);
    V.ov.push({ k: 'ring', c: [0, 0, 0], r: 0.78, u: [0, 1, 0], v: [0, 0, 1], color: '#ffffff', w: 1.5, dash: [5, 4], alpha: 0.7 });
    H.txt(V, [0, -1.05, 0], 'kesit');
    const aI = H.arrow(V, [-2.5, 1.35, 0], [2.5, 1.35, 0], { color: COL.red, w: 3, label: 'Geleneksel akım yönü (I)', lp: [0, 1.75, 0] });
    const aE = H.arrow(V, [2.5, -1.45, 0], [-2.5, -1.45, 0], { color: COL.el, w: 3, label: 'Elektronların gerçek hareketi', lp: [0, -1.85, 0] });
    H.txt(V, [-4.9, 0, 0], '+', { size: 22, color: COL.red, box: false }); H.txt(V, [4.9, 0, 0], '−', { size: 22, color: COL.el, box: false });
    let mode = 'DC', sp = 1, q = 0, t0 = 0;
    const out = P.out();
    P.btns([['DC — doğru akım', () => { mode = 'DC'; }], ['AC — alternatif akım', () => { mode = 'AC'; }]], { toggle: true });
    P.slider('Akım şiddeti', { min: 0.2, max: 3, step: 0.1, val: 1, unit: '' }, x => { sp = x; });
    V.onFrame = (dt, t) => {
      let vel;
      if (mode === 'DC') vel = -sp * 1.2; else vel = -sp * 1.6 * Math.cos(2 * Math.PI * 0.45 * t);
      for (let i = 0; i < N; i++) {
        const prev = ex[i];
        ex[i] += vel * dt; if (ex[i] < -4.45) ex[i] += 8.9; if (ex[i] > 4.45) ex[i] -= 8.9;
        if (prev > 0 && ex[i] <= 0) q += 1; if (prev <= 0 && ex[i] > 0 && Math.abs(prev - ex[i]) < 1) q -= 1;
      }
      el.pts = ex.map((x, i) => [x, ey[i], ez[i]]);
      const s = vel < 0 ? 1 : -1;
      aI.a = [-2.5 * s, 1.35, 0]; aI.b = [2.5 * s, 1.35, 0]; aE.a = [2.5 * s, -1.45, 0]; aE.b = [-2.5 * s, -1.45, 0];
      aI.alpha = aE.alpha = mode === 'AC' ? 0.35 + 0.65 * Math.abs(Math.cos(2 * Math.PI * 0.45 * t)) : 1;
      if (t - t0 > 0.25) {
        t0 = t;
        out.innerHTML = mode === 'DC'
          ? `<b>DC:</b> yön ve büyüklük zamanla değişmez (pil, batarya, elektronik kartlar). Kesitten geçen elektron sayısı: <b>${q}</b> — birim zamanda geçen yük = akım: <b>i = dq/dt</b>.`
          : `<b>AC:</b> yön ve değer periyodik değişir; elektronlar yerinde ileri-geri salınır. Türkiye şebekesi <b>230 V – 50 Hz</b> = saniyede 50 tam periyot. (Animasyon yavaşlatıldı.)`;
      }
    };
  }
};

SC.mekatronik = {
  t: 'Mekatronik döngü — sensör → karar → güçlendirme → eylem → mekanik sonuç',
  b(V, P) {
    V.setCam({ yaw: -0.2, pitch: 0.62, dist: 11, t: [0, 0.3, 0] });
    H.floor(V, 9, 9, -0.3);
    const R = 3, st = [
      { a: -Math.PI / 2 - 0.0, n: '1. Durum tespiti: SENSÖR', s: 'fiziksel büyüklük → elektriksel sinyal', c: '#9aa6b2' },
      { a: -Math.PI / 2 + 1.257, n: '2. Karar: PLC / mikrodenetleyici', s: 'mantık programı çalışır', c: '#3b6fb6' },
      { a: -Math.PI / 2 + 2.513, n: '3. Güçlendirme: MOTOR SÜRÜCÜSÜ', s: 'kontrol sinyali → güç sinyali', c: '#3f8f5a' },
      { a: -Math.PI / 2 + 3.77, n: '4. Eylem: ELEKTRİK MOTORU', s: 'elektrik → mekanik', c: '#8e99a6' },
      { a: -Math.PI / 2 + 5.027, n: '5. Sonuç: MEKANİK SİSTEM', s: 'pompa / konveyör / mil hareket eder', c: '#c06a2b' }];
    const pos = a => [R * Math.cos(a), 0, R * Math.sin(a)];
    const objs = [];
    st.forEach((S, k) => {
      const p = pos(S.a); let o;
      if (k === 0) o = V.add(E3.merge([[E3.cyl(0.16, 0.9, 14), [0, 0.45, 0]], [E3.sphere(0.2, 8), [0, 1.0, 0]]]), { pos: p, color: S.c });
      if (k === 1) o = V.add(E3.merge([[E3.box(1.1, 0.22, 1.1), [0, 0.11, 0]], ...[-0.4, -0.13, 0.13, 0.4].map(x => [E3.box(0.06, 0.06, 1.4), [x, 0.08, 0]])]), { pos: p, color: S.c });
      if (k === 2) o = V.add(E3.merge([[E3.box(1.1, 0.35, 0.8), [0, 0.18, 0]], ...[-0.4, -0.2, 0, 0.2, 0.4].map(x => [E3.box(0.07, 0.4, 0.8), [x, 0.55, 0]])]), { pos: p, color: S.c });
      if (k === 3) o = V.add(E3.merge([[E3.cyl(0.42, 1.0, 22, 'x'), [0, 0.45, 0]], [E3.box(0.7, 0.12, 0.7), [0, 0.06, 0]]]), { pos: p, color: S.c });
      if (k === 4) o = V.add(E3.merge([[E3.box(1.8, 0.16, 0.8), [0, 0.35, 0]], [E3.cyl(0.18, 0.8, 12, 'z'), [-0.9, 0.35, 0]], [E3.cyl(0.18, 0.8, 12, 'z'), [0.9, 0.35, 0]], [E3.box(0.1, 0.35, 0.1), [-0.8, 0.12, 0]], [E3.box(0.1, 0.35, 0.1), [0.8, 0.12, 0]]]), { pos: p, color: S.c });
      o.rot = [0, -S.a - Math.PI / 2, 0]; objs.push(o);
      S.lab = H.txt(V, E3.add(pos(S.a), [0, 1.55, 0]), S.n + '\n' + S.s, { size: 12 });
    });
    const shaft = V.add(E3.cyl(0.06, 0.7, 8, 'x'), { pos: E3.add(pos(st[3].a), [0, 0.45, 0]), color: '#e0e6ec' });
    const boxes = [0, 1, 2].map(() => V.add(E3.box(0.3, 0.25, 0.3), { pos: [0, 0, 0], color: '#d8c39a' }));
    const ring = []; for (let i = 0; i <= 60; i++) { const a = i / 60 * 6.283; ring.push([R * Math.cos(a), 0.02, R * Math.sin(a)]); }
    V.ov.push({ k: 'line', p: ring, color: '#4a5560', w: 2, dash: [6, 5] });
    const pulse = { k: 'dots', pts: [[0, 0, 0]], r: 0.16, color: COL.el, glow: true }; V.ov.push(pulse);
    const out = P.out(); let ph = 0, last = -1;
    P.note('Fan örneği (slayt): motor (ELEKTRİK) pervaneyi çevirir; mikrodenetleyicili sıcaklık sensörü (ELEKTRONİK) motorun ne zaman çalışacağına karar verir.');
    V.onFrame = (dt, t) => {
      ph = (ph + dt * 0.55) % 6.2832;
      const a = -Math.PI / 2 + ph; pulse.pts = [[R * Math.cos(a), 0.3, R * Math.sin(a)]];
      const k = Math.floor(((ph + 0.6) % 6.2832) / 1.2566) % 5;
      objs.forEach((o, i) => { o.glow = H.sm(o.glow, i === k ? 1 : 0); });
      st.forEach((S, i) => { S.lab.color = i === k ? '#ffffff' : '#8e99a6'; });
      pulse.color = k >= 2 ? COL.amber : COL.el;
      if (k !== last) { last = k; out.innerHTML = `<b>${st[k].n}</b> — ${st[k].s}. ${k >= 2 ? 'Bu kısım <b>elektrik</b> (güç, enerji).' : 'Bu kısım <b>elektronik</b> (bilgi, sinyal).'}`; }
      shaft.rot = [t * 6, 0, 0];
      const c = st[4].a, cp = pos(c), dir = [-Math.sin(c), 0, Math.cos(c)];
      boxes.forEach((b, i) => { const u = ((t * 0.35 + i / 3) % 1) * 1.6 - 0.8; b.pos = [cp[0] + dir[0] * u, 0.57, cp[2] + dir[2] * u]; });
    };
  }
};

SC.olcum = {
  t: 'Multimetre — voltmetre PARALEL, ampermetre SERİ, ohmmetre ENERJİSİZ',
  b(V, P) {
    V.setCam({ yaw: 0.0, pitch: 0.95, dist: 10.5, t: [0, 0, 0.9] });
    V.add(E3.box(8.4, 0.12, 6.4), { pos: [0, -0.06, 0.6], color: '#18301f', bias: 50 });
    const bat = V.add(H.battery(1.2, 0.33), { pos: [-3, 0.0, 0], rot: [0, 0, 0], color: '#2a323c' });
    bat.rot = [Math.PI / 2, 0, 0]; bat.pos = [-3, 0.35, 0];
    H.txt(V, [-3.75, 0.4, 0], '12 V', { color: COL.volt });
    V.add(H.resistor(1.4, 'x'), { pos: [0, 0.2, -1.5], color: '#d8c39a' });
    H.txt(V, [0, 0.75, -1.5], 'R = 4 Ω');
    V.add(E3.cyl(0.18, 0.3, 12), { pos: [3, 0.15, 0], color: '#8e99a6' });
    const lamp = V.add(E3.sphere(0.38, 12), { pos: [3, 0.62, 0], color: '#ffd36b', alpha: 0.9 });
    H.txt(V, [3.75, 0.6, 0], 'lamba 2 Ω');
    const corners = [[-3, 0.1, -1.5], [3, 0.1, -1.5], [3, 0.1, 1.5], [-3, 0.1, 1.5]];
    const wTop = H.wire(V, [[-3, 0.1, -0.6], [-3, 0.1, -1.5], [-0.7, 0.1, -1.5]]).concat(H.wire(V, [[0.7, 0.1, -1.5], [3, 0.1, -1.5], [3, 0.1, -0.1]]));
    const wR = H.wire(V, [[3, 0.1, 0.1], [3, 0.1, 1.5], [0.7, 0.1, 1.5]]);
    const wL = H.wire(V, [[-3, 0.1, 0.6], [-3, 0.1, 1.5], [-0.7, 0.1, 1.5]]);
    const gap = H.seg(V, [-0.7, 0.1, 1.5], [0.7, 0.1, 1.5]);
    const meter = V.add(E3.box(1.4, 0.3, 1.9), { pos: [0, 0.15, 3.2], color: '#e2b23a' });
    V.add(E3.box(1.0, 0.04, 0.6), { pos: [0, 0.31, 2.85], color: '#9fb59a' });
    const disp = H.txt(V, [0, 0.4, 2.85], '', { size: 16, color: '#0b0e12', box: false });
    const probe = { k: 'line', p: [], color: COL.red, w: 2.5 }, probe2 = { k: 'line', p: [], color: '#d0d0d0', w: 2.5 };
    V.ov.push(probe, probe2);
    const spark = { k: 'dots', pts: [], r: 0.05, color: COL.amber, glow: true }; V.ov.push(spark);
    const loop = H.path(corners, true);
    const fl = H.flow(V, loop, 40, COL.el, 0.06);
    const out = P.out(); let mode = 'V';
    const M = {
      V: ['Voltmetre — PARALEL ✔', 'Problar direncin iki ucuna dokunur (basınç farkını ölçmek gibi). Devre bozulmaz, akım aynı. V_R = I·R = 2 × 4 = <b>8 V</b>.', '8.00 V'],
      A: ['Ampermetre — SERİ ✔', 'Devre açılır, ölçü aleti yolun İÇİNE girer (suyun akışını saymak için sayaç borunun içinde olmalı). I = 12 / (4 + 2) = <b>2 A</b>.', '2.00 A'],
      AX: ['HATA: Ampermetre paralel ✘', 'Ampermetrenin iç direnci ~0 → kaynağa paralel bağlamak <b>KISA DEVRE</b> yapar: çok büyük akım, sigorta/ölçü aleti yanar, lamba söner. TEHLİKELİ.', '!!! KISA DEVRE'],
      O: ['Ohmmetre — enerji KESİK ✔', 'Direnç ölçülürken devre güçten tamamen ayrılmalı; multimetre kendi içindeki pille ölçer. R = <b>4 Ω</b>.', '4.0 Ω'],
      OX: ['HATA: Ohmmetre enerjili devrede ✘', '“Enerjili devrede direnç ölçülmez.” Devredeki gerilim ölçümü bozar ve multimetreye zarar verebilir.', 'HATA']
    };
    const upd = () => { out.innerHTML = `<b>${M[mode][0]}</b> — ${M[mode][1]}`; disp.t = M[mode][2]; };
    P.btns([['Voltmetre (paralel)', () => { mode = 'V'; upd(); }], ['Ampermetre (seri)', () => { mode = 'A'; upd(); }], ['Ampermetre paralel (hata)', () => { mode = 'AX'; upd(); }],
    ['Ohmmetre (enerjisiz)', () => { mode = 'O'; upd(); }], ['Ohmmetre enerjili (hata)', () => { mode = 'OX'; upd(); }]], { toggle: true });
    upd();
    V.onFrame = (dt, t) => {
      const mp = [-0.4, 0.32, 2.4], mn = [0.4, 0.32, 2.4];
      gap.visible = mode !== 'A';
      let on = mode !== 'O', I = 1;
      if (mode === 'V') { probe.p = [mp, [-0.55, 0.6, 0.4], [-0.75, 0.25, -1.5]]; probe2.p = [mn, [0.55, 0.6, 0.4], [0.75, 0.25, -1.5]]; }
      if (mode === 'A') { probe.p = [mp, [-0.7, 0.12, 1.5]]; probe2.p = [mn, [0.7, 0.12, 1.5]]; }
      if (mode === 'AX') { probe.p = [mp, [-1.5, 0.6, 1.2], [-3, 0.4, 0.62]]; probe2.p = [mn, [-1.4, 0.7, 0.5], [-3, 0.4, -0.62]]; I = 0; }
      if (mode === 'O' || mode === 'OX') { probe.p = [mp, [-0.55, 0.6, 0.4], [-0.75, 0.25, -1.5]]; probe2.p = [mn, [0.55, 0.6, 0.4], [0.75, 0.25, -1.5]]; }
      fl.step(dt * (on && mode !== 'AX' ? 1.4 : 0)); fl.o.alpha = on && mode !== 'AX' ? 1 : 0.15;
      lamp.glow = H.sm(lamp.glow, on && mode !== 'AX' ? 1.4 : 0); lamp.color = on && mode !== 'AX' ? '#ffd36b' : '#6b6450';
      bat.glow = mode === 'O' ? 0 : 0;
      spark.pts = mode === 'AX' ? Array.from({ length: 14 }, () => [-3 + (Math.random() - 0.5) * 0.7, 0.5 + Math.random() * 0.8, (Math.random() - 0.5) * 1.2]) : [];
      meter.glow = mode.endsWith('X') ? 0.6 + 0.4 * Math.sin(t * 12) : 0;
    };
  }
};

SC.osilo = {
  t: 'Multimetre tek sayı söyler; osiloskop sinyalin filmini çeker',
  b(V, P) {
    V.setCam({ yaw: -0.25, pitch: 0.2, dist: 9, t: [0.3, 1.1, 0] });
    H.floor(V, 9, 4);
    V.add(E3.box(4.2, 2.6, 1.4), { pos: [-0.6, 1.3, 0], color: '#c9cfd6' });
    V.add(E3.box(3.0, 2.0, 0.05), { pos: [-1.05, 1.35, 0.71], color: '#0a1a14' });
    for (let k = 0; k < 3; k++) V.add(E3.cyl(0.14, 0.15, 14, 'z'), { pos: [0.95, 1.9 - k * 0.55, 0.75], color: '#5a646e' });
    V.add(E3.box(1.1, 1.8, 0.4), { pos: [3.0, 0.9, 0.2], color: '#e2b23a' });
    V.add(E3.box(0.8, 0.45, 0.05), { pos: [3.0, 1.4, 0.42], color: '#9fb59a' });
    const mm = H.txt(V, [3.0, 1.4, 0.45], '5.00 V', { size: 15, color: '#0b0e12', box: false });
    H.txt(V, [3.0, 2.1, 0.2], 'Multimetre: anlık / ortalama tek sayı');
    H.txt(V, [-1.05, 2.95, 0], 'Osiloskop: gerilim–zaman grafiği');
    let wave = 'sin';
    const out = P.out();
    const W = { sin: 'Sinüs', kare: 'Kare', ucgen: 'Üçgen', dc: 'DC' };
    P.btns(Object.entries(W).map(([k, n]) => [n, () => { wave = k; }]), { toggle: true });
    const f = x => wave === 'sin' ? Math.sin(x) : wave === 'kare' ? (Math.sin(x) >= 0 ? 0.85 : -0.85) : wave === 'ucgen' ? (2 / Math.PI) * Math.asin(Math.sin(x)) : 0.6;
    V.ov.push({
      k: 'fn', fn: (c, v) => {
        const z = 0.74, A = v.proj([-2.5, 2.3, z]), B = v.proj([0.4, 2.3, z]), C = v.proj([0.4, 0.4, z]), D = v.proj([-2.5, 0.4, z]);
        const map = (u, w) => { const x = A[0] + (B[0] - A[0]) * u + (D[0] - A[0]) * w + (A[0] - B[0] + C[0] - D[0]) * u * w, y = A[1] + (B[1] - A[1]) * u + (D[1] - A[1]) * w + (A[1] - B[1] + C[1] - D[1]) * u * w; return [x, y]; };
        c.strokeStyle = 'rgba(80,200,140,.18)'; c.lineWidth = 1;
        for (let i = 1; i < 8; i++) { const p = map(i / 8, 0), q = map(i / 8, 1); c.beginPath(); c.moveTo(p[0], p[1]); c.lineTo(q[0], q[1]); c.stroke(); }
        for (let i = 1; i < 6; i++) { const p = map(0, i / 6), q = map(1, i / 6); c.beginPath(); c.moveTo(p[0], p[1]); c.lineTo(q[0], q[1]); c.stroke(); }
        c.strokeStyle = '#59f0a8'; c.lineWidth = 2.2; c.shadowColor = '#59f0a8'; c.shadowBlur = 8; c.beginPath();
        for (let i = 0; i <= 160; i++) { const u = i / 160, y = f(u * 4 * Math.PI - v.time * 3); const p = map(u, 0.5 - 0.4 * y); i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1]); }
        c.stroke(); c.shadowBlur = 0;
      }
    });
    V.onFrame = (dt, t) => {
      mm.t = wave === 'dc' ? '5.00 V' : (wave === 'sin' ? '3.54 V' : wave === 'kare' ? '5.00 V' : '2.89 V');
      out.innerHTML = `<b>${W[wave]}</b> — osiloskop sinyalin <b>genliğini, periyodunu, frekansını, dalga şeklini ve gürültüsünü</b> gösterir. Multimetre aynı sinyal için yalnız tek bir sayı verir; hızlı değişimleri yakalayamaz.`;
    };
  }
};

SC.motor = {
  t: 'Güç ve verim — giren elektrik gücü > çıkan mekanik güç; fark ısı',
  b(V, P) {
    V.setCam({ yaw: -0.5, pitch: 0.3, dist: 10, t: [0, 1, 0] });
    H.floor(V, 10, 4);
    V.add(E3.merge([[E3.cyl(0.9, 2.0, 28, 'x'), [0, 1.1, 0]], ...Array.from({ length: 9 }, (_, k) => [E3.tube(0.98, 0.9, 0.08, 28, 'x'), [-0.8 + k * 0.2, 1.1, 0]]), [E3.box(1.6, 0.2, 1.4), [0, 0.1, 0]], [E3.box(0.5, 0.4, 0.5), [0, 2.15, 0]]]), { pos: [0, 0, 0], color: '#6f7a86' });
    const shaft = V.add(E3.merge([[E3.cyl(0.12, 1.8, 12, 'x')], [E3.box(0.5, 0.06, 0.06), [0.7, 0, 0]]]), { pos: [1.9, 1.1, 0], color: '#d0d6dc' });
    const gear = V.add(E3.merge([[E3.cyl(0.55, 0.25, 24, 'x')], ...Array.from({ length: 12 }, (_, k) => { const a = k * Math.PI / 6; return [E3.box(0.25, 0.22, 0.22), [0, 0.6 * Math.cos(a), 0.6 * Math.sin(a)], [a, 0, 0]]; })]), { pos: [2.75, 1.1, 0], color: '#c06a2b' });
    V.add(E3.box(0.5, 0.7, 0.2), { pos: [-4.2, 0.8, 0], color: '#e8eaed' });
    const cable = H.path([[-4.2, 0.8, 0.12], [-3.2, 0.5, 0.3], [-1.5, 0.5, 0.3], [-1.0, 1.1, 0]]);
    H.wire(V, [[-4.2, 0.6, 0.15], [-4.2, 0.5, 0.3], [-1.5, 0.5, 0.3], [-1.5, 1.1, 0.3]], '#2a323c', 0.06);
    const fin = H.flow(V, cable, 18, COL.el, 0.07);
    const heat = { k: 'dots', pts: [], r: 0.07, color: COL.amber, glow: true }; V.ov.push(heat);
    const hp = Array.from({ length: 40 }, () => [Math.random() * 1.8 - 0.9, Math.random(), Math.random() * 1.2 - 0.6]);
    const lin = H.txt(V, [-3.2, 1.9, 0], ''), lout = H.txt(V, [2.8, 2.2, 0], ''), lh = H.txt(V, [0, 3.4, 0], '');
    let Pin = 1000, eta = 90, hrs = 2, ang = 0;
    const out = P.out();
    const upd = () => {
      const Po = Pin * eta / 100, L = Pin - Po;
      lin.t = `Giren elektriksel güç\nP_giriş = ${Pin} W`; lout.t = `Çıkan mekanik güç\nP_çıkış = ${H.fmt(Po, 0)} W`; lh.t = `Kayıp = ısı = ${H.fmt(L, 0)} W`;
      out.innerHTML = `η = P_çıkış / P_giriş → P_çıkış = ${Pin} × %${eta} = <b>${H.fmt(Po, 0)} W</b>; kalan <b>${H.fmt(L, 0)} W ısıya</b> dönüşür (soğutma / termodinamik tasarım gerekir).<br>Enerji = güç × zaman: E = ${Pin / 1000} kW × ${hrs} h = <b>${H.fmt(Pin / 1000 * hrs)} kWh</b>. Güç = dönüşüm <i>hızı</i>, enerji = <i>toplam miktar</i>.`;
    };
    P.slider('Giren güç P_giriş', { min: 200, max: 3000, step: 100, val: Pin, unit: 'W' }, x => { Pin = x; upd(); });
    P.slider('Verim η', { min: 50, max: 99, step: 1, val: eta, unit: '%' }, x => { eta = x; upd(); });
    P.slider('Çalışma süresi', { min: 1, max: 10, step: 1, val: hrs, unit: 'h' }, x => { hrs = x; upd(); });
    upd();
    V.onFrame = (dt) => {
      ang += dt * (2 + Pin * eta / 100 / 300); shaft.rot = [ang, 0, 0]; gear.rot = [ang, 0, 0];
      fin.step(dt * (0.6 + Pin / 900));
      const loss = 1 - eta / 100, n = Math.round(4 + loss * 70);
      heat.pts = hp.slice(0, Math.min(40, n)).map(p => { p[1] = (p[1] + dt * 0.5) % 1; return [p[0], 2.0 + p[1] * 1.3, p[2]]; });
    };
  }
};

/* ---------------- GÜVENLİK ---------------- */
SC.vucut = {
  t: 'Akımın vücuda etkisi — öldüren voltaj değil AKIM (mA)',
  b(V, P) {
    V.setCam({ yaw: -0.25, pitch: 0.15, dist: 11, t: [1.2, 2, 0] });
    H.floor(V, 10, 4);
    const body = V.add(H.person(1), { pos: [-1.2, 0, 0], color: '#7d8894' });
    const heart = V.add(E3.sphere(0.17, 10), { pos: [-1.35, 2.45, 0.25], color: '#ff2d20' });
    const L = [
      [0, 9, 'his yok / hafif karıncalanma (2–3 mA)', '#3a7d5a'], [9, 10, 'orta derecede his, karıncalanma', '#4f8f4a'], [10, 20, 'çok şiddetli ağrı', '#8a9a3a'],
      [20, 30, 'devreyi BIRAKAMAMA (kilitlenme)', '#b59a2f'], [30, 40, 'KAS FELCİ', '#c4802a'], [40, 60, 'solunum güçlüğü', '#cf6a28'],
      [60, 100, 'aşırı solunum güçlüğü', '#d84f25'], [100, 200, 'ÖLÜM — kalpte FİBRİLASYON', '#ff2d20'], [200, 300, 'kalp sıkışarak durur; ağır iç yanıklar', '#8a1a14']];
    const hy = mA => { let i = L.findIndex(([a, b]) => mA >= a && mA < b); if (i < 0) i = mA < 0 ? 0 : L.length - 1; const [a, b] = L[i]; return 0.15 + 0.5 * (i + Math.min(1, (mA - a) / (b - a))); };
    L.forEach(([a, b, n, c]) => {
      const y0 = hy(a), y1 = hy(b);
      V.add(E3.box(0.6, y1 - y0 - 0.02, 0.6), { pos: [3.2, (y0 + y1) / 2, 0], color: c });
      H.txt(V, [3.6, (y0 + y1) / 2, 0.3], `${a}–${b} mA  ${n}`, { size: 11, align: 'left', color: '#c9d0d8' });
    });
    H.txt(V, [2.75, hy(5), 0.3], 'GFCI 5 mA\'de atar →', { size: 11, align: 'right', color: COL.ok });
    const mark = { k: 'arrow', a: [2.2, 1, 0.3], b: [2.85, 1, 0.3], color: '#fff', w: 3 }; V.ov.push(mark);
    const pathHH = H.path([[-3.25, 2.65, 0], [-1.7, 2.65, 0], [-1.35, 2.45, 0.2], [-0.8, 2.6, 0], [0.85, 2.65, 0]]);
    const pathHF = H.path([[0.85, 2.65, 0], [-0.8, 2.6, 0], [-1.35, 2.45, 0.2], [-1.3, 1.5, 0], [-1.42, 0.2, 0]]);
    let mA = 15, pth = 'hh';
    const fl = H.flow(V, pathHH, 22, COL.amber, 0.07);
    const out = P.out();
    const upd = () => {
      const lv = L.find(([a, b]) => mA >= a && mA < b) || L[L.length - 1];
      out.innerHTML = `<b>${mA} mA = ${H.fmt(mA / 1000, 3)} A</b> → <b style="color:${lv[3]}">${lv[2]}</b>. ` +
        (pth === 'hh' ? 'En kötü yol: <b>bir elden diğerine</b> — akım doğrudan kalpten geçer. Bu yüzden “mümkünse tek elle çalış”.' : 'El–ayak yolu: şiddetli bir şoktan kurtulmak mümkün olabilir; aynı akım el–el yolunda ölümcül olabilirdi.') +
        ' Vücut direnci kişiye göre değişir: terli (tuzlu su) → direnç düşer → aynı gerilimde daha çok akım.';
    };
    P.slider('Vücuttan geçen akım', { min: 1, max: 300, step: 1, val: mA, unit: 'mA' }, x => { mA = x; upd(); });
    P.btns([['El → el (kalpten)', () => { pth = 'hh'; fl.path2 = pathHH; upd(); }], ['El → ayak', () => { pth = 'hf'; fl.path2 = pathHF; upd(); }]], { toggle: true });
    upd();
    V.onFrame = (dt, t) => {
      const y = hy(mA); mark.a = [2.2, y, 0.3]; mark.b = [2.85, y, 0.3];
      fl.step(dt * (0.5 + Math.log10(mA) * 0.8));
      let s;
      if (mA >= 200) s = 0.8; else if (mA >= 100) s = 1 + 0.25 * Math.sin(t * 38) * Math.sin(t * 23); else s = 1 + 0.18 * Math.max(0, Math.sin(t * 7.5));
      heart.scl = [s, s, s];
      body.color = mA >= 100 ? '#a0453c' : mA >= 20 ? '#8f7a5a' : '#7d8894';
      body.glow = mA >= 30 ? 0.15 * Math.abs(Math.sin(t * 20)) : 0;
    };
  }
};

SC.merdiven = {
  t: 'Düz merdiven — 76° açı = taban mesafesi yüksekliğin 1/4\'ü',
  b(V, P) {
    V.setCam({ yaw: -0.85, pitch: 0.22, dist: 15, t: [1.4, 3.3, 0] });
    H.floor(V, 10, 6);
    V.add(E3.box(0.5, 6.1, 4), { pos: [-0.25, 3.05, 0], color: '#5a646e' });
    V.add(E3.box(2.2, 0.15, 4.2), { pos: [-1.1, 6.15, 0], color: '#3a434d' });
    const Hh = 6.1, ext = 0.9;
    const lad = V.add(E3.merge([[E3.box(0.1, 1, 0.1), [0, 0, -0.4]], [E3.box(0.1, 1, 0.1), [0, 0, 0.4]]]), { color: '#d8c39a' });
    const rungs = Array.from({ length: 22 }, () => V.add(E3.box(0.07, 0.07, 0.8), { color: '#c9b182' }));
    const dimH = { k: 'dim', a: [0.05, 0, 2.3], b: [0.05, Hh, 2.3], off: [0, 0, 0], t: 'yükseklik 6,1 m (20 ft)', color: '#fff' };
    const dimD = { k: 'dim', a: [0, 0, 2.2], b: [1.5, 0, 2.2], off: [0, 0, 0.3], t: '', color: '#fff' };
    const dimE = { k: 'dim', a: [0, Hh, 2.2], b: [0, Hh + ext, 2.2], off: [0, 0, 0], t: '0,9 m (3 ft) taşma', color: COL.amber, tdx: 60 };
    V.ov.push(dimH, dimD, dimE);
    const angT = H.txt(V, [2.2, 0.35, 0.5], '', { size: 14 });
    let d = 1.53, dd = 1.53;
    const out = P.out();
    P.slider('Taban mesafesi (duvardan)', { min: 0.4, max: 3.6, step: 0.05, val: d, unit: 'm' }, x => { d = x; });
    P.btns([['Kurala göre yerleştir (H/4)', () => { d = Hh / 4; }]]);
    V.onFrame = () => {
      dd = H.sm(dd, d);
      const ang = Math.atan2(Hh, dd), L = Math.hypot(Hh, dd) + ext / Math.sin(ang), deg = ang * 180 / Math.PI;
      const ok = Math.abs(dd - Hh / 4) < 0.12, col = ok ? '#d8c39a' : '#e0705e';
      const ux = -Math.cos(ang), uy = Math.sin(ang), base = [dd + 0.1, 0, 0];
      lad.scl = [1, L, 1]; lad.rot = [0, 0, Math.PI / 2 - ang]; lad.pos = [base[0] + ux * L / 2, uy * L / 2, 0]; lad.color = col;
      rungs.forEach((r, k) => { const s = 0.3 + k * 0.32; r.visible = s < L - 0.1; r.pos = [base[0] + ux * s, uy * s, 0]; r.color = col; });
      dimD.b = [dd, 0, 2.2]; dimD.t = `taban ${H.fmt(dd)} m`;
      angT.t = `${deg.toFixed(1).replace('.', ',')}°`; angT.color = ok ? COL.ok : COL.bad;
      out.innerHTML = ok ? `<b class="ok">DOĞRU:</b> taban = 6,1 / 4 ≈ 1,5 m (20 ft için 5 ft) → açı ≈ <b>76°</b>. Çatıya çıkılacaksa merdiven <b>0,9 m (3 ft)</b> yukarı taşmalı.`
        : dd < Hh / 4 ? `<b class="bad">Çok dik (${deg.toFixed(0)}°):</b> merdiven geriye devrilebilir. Kural: taban mesafesi = yüksekliğin <b>1/4</b>'ü.` : `<b class="bad">Çok yatık (${deg.toFixed(0)}°):</b> taban kayar. Kural: taban mesafesi = yüksekliğin <b>1/4</b>'ü → ≈ 76°.`;
    };
  }
};

SC.yangin = {
  t: 'Yangın üçgeni — yakıt + ısı + oksijen; birini al, yangın söner',
  b(V, P) {
    V.setCam({ yaw: -0.25, pitch: 0.55, dist: 12.5, t: [0, 0.9, -0.8] });
    H.floor(V, 12, 9);
    const sides = [['ISI', '#ff6a2b', 0], ['YAKIT', '#8a6a3a', 2.094], ['OKSİJEN', '#4f9fe0', 4.189]].map(([n, c, a]) => {
      const R = 1.05, cx = R * Math.cos(a + Math.PI / 3), cz = R * Math.sin(a + Math.PI / 3);
      const o = V.add(E3.box(3.4, 0.4, 0.4), { pos: [cx, 0.2, cz], rot: [0, -(a + Math.PI / 3) - Math.PI / 2, 0], color: c });
      return { n, o, home: [cx, 0.2, cz], gone: false, lab: H.txt(V, [cx * 2.0, 0.75, cz * 2.0], n, { size: 15 }) };
    });
    const fl = [0, 1, 2, 3].map(k => V.add(E3.cone(0.6 - k * 0.11, 1.8 - k * 0.2, 16), { pos: [0, 0.9, 0], color: ['#ff4a1a', '#ff7a1a', '#ffb020', '#ffe07a'][k], alpha: 0.85, edge: false }));
    const ex = [['A', '#e8eaed', 'Ahşap, kâğıt\nsu'], ['B', '#4f9fe0', 'Benzin, gres, gaz\nCO₂'], ['C', '#ffd36b', 'Cereyan (elektrik)\nkuru toz'], ['D', '#c06a2b', 'Demir (metal)\ntoz kabuk']];
    const exo = ex.map(([l, c, d], k) => {
      const x = -3.6 + k * 2.4, o = V.add(E3.merge([[E3.cyl(0.32, 1.2, 18), [0, 0.6, 0]], [E3.cyl(0.12, 0.25, 10), [0, 1.32, 0]]]), { pos: [x, 0, -3.4], color: '#c4302a' });
      H.txt(V, [x, 0.75, -3.05], l, { size: 22, color: c, box: false }); H.txt(V, [x, 2.15, -3.4], d, { size: 11 });
      return o;
    });
    const out = P.out(); let lev = 1;
    const tell = { ISI: 'Isıyı al → sıcaklık yanma sıcaklığının altına iner (A sınıfı: SU).', YAKIT: 'Yakıtı kaldır → yanacak bir şey kalmaz.', OKSİJEN: 'Oksijeni kes → yangın boğulur (B: CO₂, C: kuru toz, D: toz kabuk).' };
    P.btns(sides.map(S => [S.n + ' kenarını çek', () => { S.gone = true; out.innerHTML = `<b>${S.n} çekildi:</b> ${tell[S.n]} Üçgen bozuldu → <b>yangın söner</b>.`; }]).concat([['Yeniden yak', () => { sides.forEach(S => S.gone = false); out.innerHTML = 'Üç kenar da yerinde: yangın yanar.'; }]]));
    P.btns(ex.map(([l], k) => [l + ' sınıfı', () => {
      exo.forEach((o, j) => o.glow = j === k ? 1 : 0);
      out.innerHTML = ['<b>A:</b> ahşap/kâğıt — genelde su ile, yakıtı yanma sıcaklığının altına düşürerek. <b>Sadece A sınıfı söndürücü elektrik yangınında ASLA kullanılmaz</b> (su iletken → ölümcül).',
        '<b>B:</b> gres, yanıcı sıvı/gaz — genelde <b>CO₂</b>: sıcaklığı düşürür + oksijenden mahrum bırakır. CO₂ elektrik yangınlarında da sık kullanılır çünkü ekipmanı kuru tozla kaplayıp bozmaz.',
        '<b>C:</b> enerjili elektrikli ekipman — genelde <b>kuru toz</b> ile boğulur. “ABC” etiketli söndürücü üç sınıfta da kullanılabilir. Söndürücüyü derecelendirilmediği yangında kullanma.',
        '<b>D:</b> yanan metal — bazı metallere su yangını <b>artırır</b>. Toz tabakası kabuk yapıp oksijeni keser; söndürülemiyorsa yayılmayı önlemek için kullanılır.'][k];
    }]), { toggle: true });
    out.innerHTML = 'Bir kenarı çekerek yangını söndür; altta söndürücü sınıflarına bak. Kanca: <b>A</b>hşap · <b>B</b>enzin · <b>C</b>ereyan · <b>D</b>emir.';
    V.onFrame = (dt, t) => {
      const alive = sides.every(S => !S.gone);
      lev = H.sm(lev, alive ? 1 : 0);
      sides.forEach(S => { const tgt = S.gone ? E3.add(S.home, E3.mul([S.home[0], 0, S.home[2]], 1.4)).map((v, i) => i === 1 ? -3 : v) : S.home; S.o.pos = S.o.pos.map((v, i) => H.sm(v, tgt[i])); S.lab.alpha = S.gone ? 0.25 : 1; });
      fl.forEach((f, k) => { const s = lev * (1 + 0.12 * Math.sin(t * 9 + k * 2)); f.scl = [s, s * (1 + 0.15 * Math.sin(t * 13 + k)), s]; f.pos = [0.05 * Math.sin(t * 7 + k), 0.15 + (0.9 - k * 0.1) * s, 0.05 * Math.cos(t * 5 + k)]; f.visible = lev > 0.03; });
    };
  }
};

SC.gfci = {
  t: 'GFCI (toprak kaçağı kesicisi) — faz ve nötr akımını karşılaştırır, ~5 mA farkta açar',
  b(V, P) {
    V.setCam({ yaw: -0.3, pitch: 0.3, dist: 10.5, t: [0.4, 1.3, 0] });
    H.floor(V, 13, 5);
    const yF = 1.6, zF = -0.22, zN = 0.22;
    H.seg(V, [-4.5, yF, zF], [3.2, yF, zF], '#2a2a2a', 0.07); H.seg(V, [-4.5, yF, zN], [3.2, yF, zN], '#4f7fd0', 0.07);
    V.add(E3.tube(0.75, 0.5, 0.5, 30, 'x'), { pos: [-2.2, yF, 0], color: '#6f7a86' });
    H.txt(V, [-2.2, yF + 1.1, 0], 'algılama halkası (fark akımı)');
    const brk = V.add(E3.box(0.9, 1.4, 1.1), { pos: [-4.9, yF, 0], color: '#e8eaed' });
    const lever = V.add(E3.box(0.12, 0.6, 0.12), { pos: [-4.9, yF + 0.95, 0], color: '#ff2d20', piv: [0, -0.3, 0] });
    H.txt(V, [-4.9, yF - 1.05, 0], 'GFCI kesici');
    const app = V.add(E3.box(1.4, 2.4, 1.2), { pos: [3.7, 1.2, 0], color: '#9aa6b2' });
    H.txt(V, [3.7, 2.75, 0], 'arızalı cihaz');
    const man = V.add(H.person(0.9), { pos: [5.75, 0, 0], color: '#7d8894' });
    const fp = H.path([[-4.5, yF, zF], [3.2, yF, zF]]), np = H.path([[3.2, yF, zN], [-4.5, yF, zN]]);
    const leak = H.path([[4.4, 2.38, 0], [5.75, 2.2, 0], [5.75, 1.0, 0], [5.95, 0.05, 0], [5.3, 0.05, 0.6]]);
    const fF = H.flow(V, fp, 26, '#ffd36b', 0.06), fN = H.flow(V, np, 26, COL.el, 0.06), fL = H.flow(V, leak, 8, COL.red, 0.07);
    const tF = H.txt(V, [0.5, yF + 0.55, zF], ''), tN = H.txt(V, [0.5, yF - 0.55, zN], '');
    let k = 0, trip = false, ang = 0;
    const out = P.out();
    const upd = () => {
      tF.t = `faz: ${(10 + k / 1000).toFixed(3).replace('.', ',')} A →`; tN.t = `← nötr: 10,000 A`;
      out.innerHTML = trip ? `<b class="bad">GFCI ATTI.</b> Fark ${k} mA ≥ ~5 mA → devre açıldı, insan korundu. (Normal sigorta 10 A'yı görür, 0,005 A'lık farkı göremez.)`
        : k === 0 ? 'Normalde faz ve nötr akımı <b>eşit ama zıt</b> yönlü (10 A ↔ 10 A): fark = 0, kesici kapalı kalır.'
          : `Kaçak: ${k} mA insanın üzerinden toprağa gidiyor. Faz ${(10 + k / 1000).toFixed(3).replace('.', ',')} A, nötr 10,000 A → fark ${k} mA. ${k < 5 ? '5 mA altında: henüz atmaz.' : ''}`;
    };
    const sl = P.slider('İnsandan toprağa kaçak akım', { min: 0, max: 100, step: 1, val: 0, unit: 'mA' }, x => { k = x; if (k >= 5) trip = true; upd(); });
    P.btns([['Sıfırla (kesiciyi kapat)', () => { trip = false; k = 0; sl.value = 0; sl.dispatchEvent(new Event('input')); upd(); }]]);
    upd();
    V.onFrame = (dt, t) => {
      ang = H.sm(ang, trip ? 1.1 : 0); lever.rot = [0, 0, ang];
      const on = !trip; fF.step(dt * (on ? 1.6 : 0)); fN.step(dt * (on ? 1.6 : 0)); fL.step(dt * (on && k > 0 ? 1.2 : 0));
      fF.o.alpha = fN.o.alpha = on ? 1 : 0.15; fL.o.alpha = on && k > 0 ? 1 : 0;
      man.color = on && k > 0 ? '#a0453c' : '#7d8894'; brk.glow = trip ? 0.4 + 0.3 * Math.sin(t * 8) : 0;
    };
  }
};

SC.topraklama = {
  t: 'Topraklama — gövdeyi toprak potansiyelinde tutan düşük dirençli yol',
  b(V, P) {
    V.setCam({ yaw: -0.45, pitch: 0.3, dist: 12, t: [0.5, 1.2, 0] });
    H.floor(V, 12, 5);
    const box = V.add(E3.box(1.8, 2.4, 1.6), { pos: [0, 1.2, 0], color: '#a7b1bb' });
    H.txt(V, [0, 2.75, 0], 'metal gövdeli cihaz');
    const man = V.add(H.person(0.85), { pos: [2.35, 0, 0.2], color: '#7d8894' });
    H.wire(V, [[-0.9, 1.6, -0.3], [-3, 1.6, -0.3]], '#8a5a2b'); H.wire(V, [[-0.9, 1.4, 0], [-3, 1.4, 0]], '#4f7fd0');
    const gw = H.wire(V, [[-0.9, 1.2, 0.3], [-2.4, 1.2, 0.3], [-2.4, 0.0, 0.3], [-2.4, -0.6, 0.3]], '#7fbf3f', 0.05);
    H.txt(V, [-3.4, 1.6, -0.3], 'faz', { size: 11 }); H.txt(V, [-3.4, 1.4, 0], 'nötr', { size: 11 }); H.txt(V, [-3.4, 1.0, 0.3], 'toprak (3. uç)', { size: 11, color: '#9fdf5f' });
    V.add(E3.cyl(0.08, 1.2, 8), { pos: [-2.4, -0.4, 0.3], color: '#c98a4b' });
    const toG = H.flow(V, H.path([[-0.9, 1.2, 0.3], [-2.4, 1.2, 0.3], [-2.4, -0.6, 0.3]]), 14, COL.red, 0.07);
    const toM = H.flow(V, H.path([[0.95, 2.25, 0.2], [2.35, 2.2, 0.2], [2.35, 1.0, 0.2], [2.5, 0.05, 0.2]]), 12, COL.red, 0.07);
    const sp = { k: 'dots', pts: [], r: 0.04, color: COL.amber, glow: true }; V.ov.push(sp);
    let fault = false, ground = true;
    const out = P.out();
    const upd = () => {
      gw.forEach(w => w.visible = ground);
      out.innerHTML = !fault ? 'Normal çalışma: gövde toprak potansiyelinde (0 V), dokunmak güvenli.'
        : ground ? '<b class="ok">Topraklı:</b> faz gövdeye değdi → akım düşük dirençli <b>toprak iletkeninden</b> doğrudan toprağa gider, büyük akım kesiciyi attırır. İnsana akım gitmez.'
          : '<b class="bad">Topraksız:</b> gövde faz gerilimine çıktı. Dokunan kişi akımın toprağa giden yolu olur. <b>Fişteki üçüncü uç asla kesilmez / devre dışı bırakılmaz.</b> (Kurallar: NEC 250)';
    };
    P.btns([['Arıza: faz gövdeye değdi', () => { fault = !fault; upd(); }], ['Toprak ucunu kes / tak', () => { ground = !ground; upd(); }]]);
    upd();
    V.onFrame = (dt, t) => {
      toG.step(dt * 1.6); toM.step(dt * 1.2);
      toG.o.alpha = fault && ground ? 1 : 0; toM.o.alpha = fault && !ground ? 1 : 0;
      man.color = fault && !ground ? '#a0453c' : '#7d8894';
      box.glow = fault && !ground ? 0.3 + 0.2 * Math.sin(t * 10) : 0;
      sp.pts = fault ? Array.from({ length: 6 }, () => [-0.9 + Math.random() * 0.2, 1.6 + Math.random() * 0.3, -0.3 + Math.random() * 0.2]) : [];
    };
  }
};

SC.ark = {
  t: 'Ark hatası — anahtarın kısa sıçraması ile ark hatasının düzensiz darbelerini ayırt etmek',
  b(V, P) {
    let mode = 'sw';
    const out = P.out();
    const T = {
      sw: '<b>Normal ark (ışık anahtarı):</b> tek, kısa süreli akım sıçraması (spike). Anahtar, röle, açık cihazı prize takmak, güç açıkken ampul değiştirmek, fırçalı motorlar normal ark üretir.',
      par: '<b>Paralel ark:</b> iki iletken birbirine değer (ezilmiş kordon). Akım yalnız iletken direnciyle sınırlı → tepe akımları nominalin <b>çok üstünde</b>, çok ısı, sıcak metal fırlar. Daha fazla ısı → daha tehlikeli olabilir; ama tespiti KOLAY.',
      ser: '<b>Seri ark:</b> gevşek vida / kötü kablo somunu. Akımı yük sınırlar; tepe akım normalden büyük DEĞİL → sıradan termik-manyetik kesici göremez. Saç kurutma: 12 A, yarı süre temas → ortalama 6 A ama küçük alanda muazzam ısı. Tespiti ZOR.'
    };
    P.btns([['Normal anahtar arkı', () => mode = 'sw'], ['Paralel ark hatası', () => mode = 'par'], ['Seri ark hatası', () => mode = 'ser']], { toggle: true });
    const rnd = Array.from({ length: 400 }, () => Math.random());
    plot2d(V, (c, W, Hh, t) => {
      const x0 = 40, w = W - 70, y0 = Hh * 0.55, h = Hh * 0.8;
      axes2d(c, x0, y0, w, h, 'zaman', 'akım');
      const base = x => Math.sin(x * 0.12);
      c.strokeStyle = 'rgba(111,155,209,.45)'; c.setLineDash([4, 4]); c.beginPath(); c.moveTo(x0, y0 - h * 0.18); c.lineTo(x0 + w, y0 - h * 0.18); c.stroke(); c.setLineDash([]);
      c.fillStyle = '#8e99a6'; c.font = '12px Bahnschrift'; c.fillText('kesicinin normal atma seviyesi', x0 + 8, y0 - h * 0.18 - 9);
      c.strokeStyle = mode === 'sw' ? COL.ok : COL.red; c.lineWidth = 2; c.beginPath();
      const off = Math.floor(t * 40);
      for (let i = 0; i <= w; i += 2) {
        const k = i + off; let y = base(k) * 0.12;
        if (mode === 'sw') { const m = k % 300; if (m > 150 && m < 156) y += 0.35 * Math.sin((m - 150) / 6 * Math.PI); }
        if (mode === 'par') { const r = rnd[Math.floor(k / 9) % 400]; if (r > 0.72) y += (r - 0.6) * 1.1 * Math.sin(k * 0.9); }
        if (mode === 'ser') { const r = rnd[Math.floor(k / 7) % 400]; y = r > 0.45 ? base(k) * 0.12 + (r - 0.45) * 0.12 * Math.sin(k * 1.7) : 0.0; }
        const yy = y0 - y * h; i ? c.lineTo(x0 + i, yy) : c.moveTo(x0 + i, yy);
      }
      c.stroke();
    });
    V.onFrame = () => { out.innerHTML = T[mode] + ' <br>AFCI içinde <b>mikroişlemci</b>, akım ve sıcaklık sensörleri, kalıcı bellek var; belirli bir dalga formu değil akımın <b>büyüklüğü, süresi ve darbeler arası zamanı</b> izlenir.'; };
  }
};
