'use strict';
/* 2. grup sahneler: Konu 3–10 */

SC.onek = {
  t: 'SI ön ekleri merdiveni — her basamak 1000 kat (10³)',
  b(V, P) {
    V.setCam({ yaw: -0.15, pitch: 0.32, dist: 15, t: [0, 1.7, 0] });
    H.floor(V, 16, 4);
    const S = [['p', 'piko', -12, 'kapasitör: pF'], ['n', 'nano', -9, 'nanosaniye'], ['μ', 'mikro', -6, 'μC, μS'], ['m', 'mili', -3, 'mA: vücut akımı'], ['', 'temel birim', 0, 'V, A, Ω, W'],
    ['k', 'kilo', 3, 'kΩ, kWh'], ['M', 'mega', 6, 'MW santral'], ['G', 'giga', 9, 'GHz işlemci'], ['T', 'tera', 12, 'TW']];
    const bx = S.map(([s, n, e, u], k) => {
      const x = -6.4 + k * 1.6, h = 0.35 + (e + 12) * 0.13;
      const o = V.add(E3.box(1.4, h, 1.4), { pos: [x, h / 2, 0], color: e === 0 ? '#ff2d20' : e < 0 ? '#3b6fb6' : '#c06a2b' });
      H.txt(V, [x, h + 0.45, 0], `${s || '—'}  10${sup(e)}`, { size: 14 }); H.txt(V, [x, -0.35, 0.8], n, { size: 11, color: '#8e99a6', box: false });
      return o;
    });
    function sup(e) { const m = { '-': '⁻', 0: '⁰', 1: '¹', 2: '²', 3: '³', 4: '⁴', 5: '⁵', 6: '⁶', 7: '⁷', 8: '⁸', 9: '⁹' }; return String(e).split('').map(c => m[c]).join(''); }
    const out = P.out();
    P.btns(S.map(([s, n, e, u], k) => [(s || '1') + ' ' + n, () => { bx.forEach((o, j) => o.glow = j === k ? 1 : 0); out.innerHTML = `<b>${n} (${s || '—'}) = 10${sup(e)}</b> · örnek: ${u}. ` + (e ? `1 ${s}A = ${e < 0 ? '0,' + '0'.repeat(-e - 1) + '1' : '1' + '0'.repeat(e)} A` : ''); }]), { toggle: true });
    P.note('Ayrıca santi c = 10⁻², desi d = 10⁻¹. Slayttaki ön ek şeridinde yazım hataları var (Tera iki kez, “Mili (c)”); doğrusu bu merdivendir.');
    out.innerHTML = 'Bir basamak sağa = ×1000. Örnek: 4700 Ω = 4,7 kΩ; 0,003 A = 3 mA; 3 ms = 3×10⁻³ s.';
    V.onFrame = () => { };
  }
};

SC.turev = {
  t: 'i = dq/dt (eğim) ve Q = ∫ i dt (alan) — aynı olayın iki yüzü',
  b(V, P) {
    let T = 0.6, auto = true;
    const q = t => 10 * (1 - Math.exp(-2 * t)), i = t => 20 * Math.exp(-2 * t);
    const out = P.out();
    const sl = P.slider('Zaman t', { min: 0, max: 2.5, step: 0.01, val: T, unit: 's' }, x => { T = x; auto = false; });
    P.btns([['Oynat', () => { auto = true; }]]);
    plot2d(V, (c, W, Hh, tm) => {
      if (auto) { T = (tm * 0.35) % 2.5; sl.value = T; sl.parentElement.querySelector('b').textContent = H.fmt(T) + ' s'; }
      const x0 = 46, w = W - 80, sx = t => x0 + t / 2.5 * w;
      // üst: q(t)
      const y1 = Hh * 0.45, h1 = Hh * 0.36, sy1 = v => y1 - v / 10 * h1;
      axes2d(c, x0, y1, w, h1 * 2, 't (s)', 'q (mC)');
      c.strokeStyle = COL.volt; c.lineWidth = 2.4; c.beginPath();
      for (let k = 0; k <= 200; k++) { const t = k / 200 * 2.5; k ? c.lineTo(sx(t), sy1(q(t))) : c.moveTo(sx(t), sy1(q(t))); } c.stroke();
      const m = i(T), px = sx(T), py = sy1(q(T)), dt = 0.5;
      c.strokeStyle = COL.amber; c.lineWidth = 2; c.beginPath(); c.moveTo(sx(T - dt), sy1(q(T) - m * dt)); c.lineTo(sx(T + dt), sy1(q(T) + m * dt)); c.stroke();
      c.fillStyle = COL.amber; c.beginPath(); c.arc(px, py, 5, 0, 7); c.fill();
      c.font = '600 13px Bahnschrift'; c.textAlign = 'left'; c.fillText(`teğetin eğimi = dq/dt = ${H.fmt(m)} mA`, px + 10, py + 18);
      // alt: i(t)
      const y2 = Hh * 0.93, h2 = Hh * 0.36, sy2 = v => y2 - v / 20 * h2;
      axes2d(c, x0, y2, w, h2 * 2, 't (s)', 'i (mA)');
      c.fillStyle = 'rgba(255,45,32,.28)'; c.beginPath(); c.moveTo(sx(0), y2);
      for (let k = 0; k <= 100; k++) { const t = k / 100 * T; c.lineTo(sx(t), sy2(i(t))); } c.lineTo(sx(T), y2); c.closePath(); c.fill();
      c.strokeStyle = COL.red; c.lineWidth = 2.4; c.beginPath();
      for (let k = 0; k <= 200; k++) { const t = k / 200 * 2.5; k ? c.lineTo(sx(t), sy2(i(t))) : c.moveTo(sx(t), sy2(i(t))); } c.stroke();
      c.fillStyle = '#fff'; c.fillText(`taralı alan = ∫₀ᵗ i dt = ${H.fmt(q(T))} mC`, sx(Math.min(T, 1.2)) + 10, y2 - h2 * 0.55);
      out.innerHTML = `Alıştırma 1.2: q(t) = 10 − 10e<sup>−2t</sup> mC → <b>i = dq/dt = 20e<sup>−2t</sup> mA</b>. t = ${H.fmt(T)} s: i = <b>${H.fmt(i(T))} mA</b> (t = 1 s → 2,707 mA). Alttaki alan, üstteki q değerine eşit: integral geri götürür.`;
    });
  }
};

SC.yukus = {
  t: 'Gerilim = yükseklik — kapalı turda çıkılan = inilen (KVL, Örnek 2.5)',
  b(V, P) {
    V.setCam({ yaw: -0.6, pitch: 0.5, dist: 12.5, t: [0, 1.4, 0] });
    H.floor(V, 9, 9, -0.05);
    let Vs = 20, R1 = 2, R2 = 3;
    const C = [[-3, 0, 3], [-3, 0, -3], [3, 0, -3], [3, 0, 3]];
    const segs = [{ n: 'kaynak', c: '#ff2d20' }, { n: 'R1', c: '#ffb020' }, { n: 'R2', c: '#ffb020' }, { n: 'tel', c: '#5a646e' }];
    const k = 0.1, N = 24;
    let objs = [], labs = [];
    const heights = () => { const i = Vs / (R1 + R2); return [Vs, -i * R1, -i * R2, 0]; };
    const prof = (s) => { // s: 0..4 kenar parametresi → yükseklik
      const d = heights(); let h = 0; const e = Math.floor(s), f = s - e;
      for (let j = 0; j < e; j++) h += d[j];
      if (e < 4) { const ff = e === 3 ? 0 : (e === 0 ? f : f); h += d[e] * ff; }
      return h * k;
    };
    const ptAt = s => { const e = Math.min(3, Math.floor(s)), f = s - e, a = C[e], b = C[(e + 1) % 4]; return [a[0] + (b[0] - a[0]) * f, prof(s), a[2] + (b[2] - a[2]) * f]; };
    const build = () => {
      objs.forEach(o => V.objs.splice(V.objs.indexOf(o), 1)); objs = [];
      for (let e = 0; e < 4; e++) for (let j = 0; j < N; j++) {
        const s0 = e + j / N, s1 = e + (j + 1) / N, a = ptAt(s0), b = ptAt(s1);
        const dx = b[0] - a[0], dz = b[2] - a[2], L = Math.hypot(dx, dz), nx = -dz / L * 0.35, nz = dx / L * 0.35;
        const m = { v: [[a[0] - nx, a[1], a[2] - nz], [a[0] + nx, a[1], a[2] + nz], [b[0] + nx, b[1], b[2] + nz], [b[0] - nx, b[1], b[2] - nz]], f: [{ i: [0, 1, 2, 3], e: 0 }] };
        objs.push(V.add(m, { color: segs[e].c, two: true, edge: false, alpha: 0.95 }));
        if (j % 6 === 0) objs.push(V.add(E3.box(0.04, Math.max(0.01, a[1]), 0.04), { pos: [a[0], a[1] / 2, a[2]], color: '#3a434d', edge: false }));
      }
    };
    build();
    const ball = V.add(E3.sphere(0.22, 12), { color: '#ffffff' });
    const L = [H.txt(V, [-3.7, 1, 0], ''), H.txt(V, [0, 2.6, -3.6], ''), H.txt(V, [3.7, 1, 0], ''), H.txt(V, [0, 0.4, 3.6], 'tel: 0 V değişim')];
    const out = P.out();
    let s = 0;
    const upd = () => {
      const i = Vs / (R1 + R2), v1 = i * R1, v2 = -i * R2;
      L[0].t = `kaynak +${H.fmt(Vs)} V ↑`; L[1].t = `R1=${R1} Ω: −${H.fmt(v1)} V ↓`; L[2].t = `R2=${R2} Ω: −${H.fmt(-v2)} V ↓`;
      build();
      out.innerHTML = `Saat yönünde KVL: <b>−${Vs} + v₁ − v₂ = 0</b>, Ohm: v₁ = ${R1}i, v₂ = −${R2}i (akım R2'ye eksi ucundan girer) → ${Vs} = ${R1 + R2}i → <b>i = ${H.fmt(i)} A</b>, <b>v₁ = ${H.fmt(v1)} V</b>, <b>v₂ = ${H.fmt(v2)} V</b>. Kaynakta tırmanılan ${Vs} V, dirençlerde inilen ${H.fmt(v1)} + ${H.fmt(-v2)} V'a eşit → net değişim 0.`;
    };
    P.slider('Kaynak gerilimi', { min: 5, max: 40, step: 1, val: Vs, unit: 'V' }, x => { Vs = x; upd(); });
    P.slider('R1', { min: 1, max: 10, step: 1, val: R1, unit: 'Ω' }, x => { R1 = x; upd(); });
    P.slider('R2', { min: 1, max: 10, step: 1, val: R2, unit: 'Ω' }, x => { R2 = x; upd(); });
    upd();
    V.onFrame = (dt) => { s = (s + dt * 0.35) % 4; const p = ptAt(s); ball.pos = [p[0], p[1] + 0.22, p[2]]; };
  }
};

SC.pasif = {
  t: 'Pasif işaret kabulü — akım (+) uçtan girerse p = +vi',
  b(V, P) {
    V.setCam({ yaw: -0.5, pitch: 0.18, dist: 10, t: [0, 1.9, 0] });
    H.floor(V, 7, 4);
    const el = V.add(E3.box(1.1, 1.8, 1.1), { pos: [0, 1.5, 0], color: '#5a646e' });
    V.add(E3.cyl(0.08, 0.8, 10), { pos: [0, 2.8, 0], color: '#d0d6dc' }); V.add(E3.cyl(0.08, 0.8, 10), { pos: [0, 0.2, 0], color: '#d0d6dc' });
    const tp = H.txt(V, [0.75, 2.5, 0.6], '+', { size: 26, color: COL.red, box: false }), tm = H.txt(V, [0.75, 0.55, 0.6], '−', { size: 26, color: COL.el, box: false });
    const va = H.arrow(V, [1.4, 2.3, 0], [1.4, 0.7, 0], { color: COL.volt, w: 2.5, label: 'v', lp: [1.75, 1.5, 0] });
    const ia = H.arrow(V, [-0.6, 3.4, 0], [-0.6, 2.75, 0], { color: COL.red, w: 3.5, label: 'i', lp: [-0.95, 3.1, 0] });
    const pth = H.path([[0, 3.3, 0], [0, -0.3, 0]]);
    const fl = H.flow(V, pth, 16, COL.el, 0.07);
    const big = H.txt(V, [0, 4.1, 0], '', { size: 18 });
    let v = 4, i = 3, top = true;
    const out = P.out();
    const upd = () => {
      const p = (top ? 1 : -1) * v * i;
      big.t = `p = ${top ? '+' : '−'}v·i = ${top ? '' : '−'}(${v})(${i}) = ${p > 0 ? '+' : ''}${p} W`;
      big.color = p > 0 ? COL.amber : p < 0 ? COL.el : '#fff';
      out.innerHTML = `Akım <b>${top ? '(+)' : '(−)'} uçtan</b> giriyor → p = <b>${top ? '+' : '−'}vi</b> = ${p} W → ` + (p > 0 ? '<b style="color:#ffb020">p &gt; 0: eleman güç YUTAR (harcar) — direnç, motor gibi.</b>' : p < 0 ? '<b style="color:#4fd8ff">p &lt; 0: eleman güç ÜRETİR (sağlar) — batarya gibi.</b>' : 'p = 0.') + ' “12 W yutmak = −12 W sağlamak.”';
      ia.a = top ? [-0.6, 3.4, 0] : [-0.6, -0.4, 0]; ia.b = top ? [-0.6, 2.75, 0] : [-0.6, 0.25, 0]; ia.lp = top ? [-0.95, 3.1, 0] : [-0.95, -0.1, 0];
      ia.label = `i = ${i} A`;
    };
    P.slider('Gerilim v (+ üstte)', { min: -10, max: 10, step: 1, val: v, unit: 'V' }, x => { v = x; upd(); });
    P.slider('Akım i (ok yönünde)', { min: -5, max: 5, step: 1, val: i, unit: 'A' }, x => { i = x; upd(); });
    P.btns([['Akım + uçtan girsin', () => { top = true; upd(); }], ['Akım − uçtan girsin', () => { top = false; upd(); }]], { toggle: true });
    P.note('Şekil 1.9: 4 V, 3 A (+) uçtan → +12 W yutar. Şekil 1.10: 3 A (−) uçtan → −12 W sağlar. (−3 A, (−) uçtan) = +12 W: aynı durum.');
    upd();
    V.onFrame = (dt) => {
      const p = (top ? 1 : -1) * v * i, realDown = (top ? 1 : -1) * Math.sign(i);
      fl.step(-dt * 1.2 * realDown); fl.o.alpha = i === 0 ? 0.1 : 1;
      el.color = p > 0 ? '#b5762a' : p < 0 ? '#2f6a9a' : '#5a646e';
      el.glow = H.sm(el.glow, Math.min(1, Math.abs(p) / 30));
    };
  }
};

SC.terazi = {
  t: 'Gücün korunumu — Σp = 0: sağlanan toplam = yutulan toplam (Örnek 1.7)',
  b(V, P) {
    V.setCam({ yaw: -0.2, pitch: 0.25, dist: 11, t: [0, 1.8, 0] });
    H.floor(V, 10, 4);
    V.add(E3.cyl(0.18, 2.4, 14), { pos: [0, 1.2, 0], color: '#8e99a6' });
    V.add(E3.box(1.4, 0.2, 1), { pos: [0, 0.1, 0], color: '#5a646e' });
    const beam = V.add(E3.box(6.4, 0.14, 0.3), { pos: [0, 2.45, 0], color: '#c9cfd6', piv: [0, 0, 0] });
    const panL = V.add(E3.cyl(1.1, 0.1, 24), { color: '#3b6fb6' }), panR = V.add(E3.cyl(1.1, 0.1, 24), { color: '#c06a2b' });
    const items = [['p₁ — 20 V kaynak', -100, '20 V × (−5 A): akım (−) uçtan girer'], ['p₂ — 12 V eleman', 60, '12 V × 5 A: (+) uçtan girer'], ['p₃ — 8 V eleman', 48, '8 V × 6 A: (+) uçtan girer'], ['p₄ — bağımlı kaynak 0,2I', -8, '0,2 × 5 = 1 A, (−) uçtan → 8 V × (−1 A)']];
    const blocks = items.map(([n, p], k) => ({ o: V.add(E3.box(0.7, Math.abs(p) / 60, 0.7), { color: p < 0 ? '#4f8fdc' : '#ffb020', visible: false }), p, on: false, k }));
    const tl = H.txt(V, [-3.2, 4.7, 0], ''), tr = H.txt(V, [3.2, 4.7, 0], '');
    let tilt = 0;
    const out = P.out();
    const upd = () => {
      const on = blocks.filter(b => b.on), sup = on.filter(b => b.p < 0).reduce((s, b) => s + b.p, 0), abs = on.filter(b => b.p > 0).reduce((s, b) => s + b.p, 0);
      tl.t = `Sağlanan (p < 0): ${sup} W`; tr.t = `Yutulan (p > 0): +${abs} W`;
      out.innerHTML = on.length ? `Σp = ${on.map(b => (b.p > 0 ? '+' : '') + b.p).join(' ')} = <b>${sup + abs} W</b>` + (on.length === 4 ? ' → <b class="ok">denge: Σp = 0 ✔</b> Enerji yok edilemez, sadece aktarılır.' : '') : 'Elemanları tek tek teraziye koy.';
    };
    P.btns(items.map(([n, p, d], k) => [n, () => { blocks[k].on = !blocks[k].on; upd(); out.innerHTML += `<br><span class="mut">${n}: ${d} → ${p > 0 ? '+' : ''}${p} W</span>`; }]));
    P.btns([['Hepsini koy', () => { blocks.forEach(b => b.on = true); upd(); }], ['Boşalt', () => { blocks.forEach(b => b.on = false); upd(); }]]);
    upd();
    V.onFrame = () => {
      const on = blocks.filter(b => b.on), net = on.reduce((s, b) => s + b.p, 0);
      tilt = H.sm(tilt, Math.max(-0.35, Math.min(0.35, -net / 160)));
      beam.rot = [0, 0, tilt];
      const L = [-3 * Math.cos(tilt), 2.45 - 3 * Math.sin(tilt)], R = [3 * Math.cos(tilt), 2.45 + 3 * Math.sin(tilt)];
      panL.pos = [L[0], L[1] - 0.6, 0]; panR.pos = [R[0], R[1] - 0.6, 0];
      let hl = 0, hr = 0, il = 0, ir = 0;
      blocks.forEach(b => {
        b.o.visible = b.on; if (!b.on) return;
        const h = Math.abs(b.p) / 60;
        if (b.p < 0) { b.o.pos = [L[0] - 0.4 + (il++) * 0.8, L[1] - 0.55 + h / 2, 0]; hl += h; }
        else { b.o.pos = [R[0] - 0.4 + (ir++) * 0.8, R[1] - 0.55 + h / 2, 0]; hr += h; }
      });
    };
  }
};

SC.kaynak = {
  t: 'Kaynakların sembol dili — DAİRE bağımsız, ELMAS bağımlı',
  b(V, P) {
    V.setCam({ yaw: 0, pitch: 0.12, dist: 12, t: [0, 1.6, 0] });
    const items = [
      ['Bağımsız gerilim', 'c', 'v', 'Uçlarındaki gerilim sabit (ya da tanımlı fonksiyon); verdiği akım devrenin geri kalanına bağlı. İdeal kaynak teoride sonsuz akım verebilir.'],
      ['Bağımsız akım', 'c', 'i', 'Ok yönünde sabit akım verir; üzerindeki gerilim devrenin geri kalanına bağlı.'],
      ['VCVS  v = μ·vₓ', 'd', 'v', 'Gerilim Kontrollü Gerilim Kaynağı: başka yerdeki GERİLİM, bu GERİLİMİ belirler. μ birimsiz (kazanç).'],
      ['VCCS  i = g·vₓ', 'd', 'i', 'Gerilim Kontrollü Akım Kaynağı: GERİLİM → AKIM. g birimi A/V = Siemens.'],
      ['CCVS  v = r·iₓ', 'd', 'v', 'Akım Kontrollü Gerilim Kaynağı: AKIM → GERİLİM. r birimi V/A = Ω.'],
      ['CCCS  i = β·iₓ', 'd', 'i', 'Akım Kontrollü Akım Kaynağı: AKIM → AKIM. β birimsiz. Transistör (BJT) modeli: küçük i_b, büyük β·i_b çıkış akımını kontrol eder.']];
    const objs = items.map(([n, s, t], k) => {
      const x = -4.4 + (k % 3) * 4.4, y = k < 3 ? 3.0 : 0.4;
      const parts = [[s === 'c' ? E3.tube(0.85, 0.74, 0.18, 36, 'z') : H.diamond(0.85, 0.18)]];
      parts.push([E3.box(0.06, 0.7, 0.06), [0, 1.2, 0]], [E3.box(0.06, 0.7, 0.06), [0, -1.2, 0]]);
      if (t === 'i') parts.push([E3.box(0.08, 0.7, 0.08), [0, -0.1, 0]], [E3.cone(0.2, 0.36, 12), [0, 0.38, 0]]);
      else parts.push([E3.box(0.34, 0.07, 0.07), [0, 0.32, 0]], [E3.box(0.07, 0.34, 0.07), [0, 0.32, 0]], [E3.box(0.34, 0.07, 0.07), [0, -0.32, 0]]);
      const o = V.add(E3.merge(parts), { pos: [x, y, 0], color: s === 'c' ? '#6f9bd1' : '#4fd8ff' });
      H.txt(V, [x, y - 1.75, 0], n, { size: 13 });
      return o;
    });
    const out = P.out();
    P.btns(items.map(([n, , , d], k) => [n.split('  ')[0], () => { objs.forEach((o, j) => o.glow = j === k ? 1 : 0); out.innerHTML = `<b>${n}</b> — ${d}`; }]), { toggle: true });
    P.note('Kanca: ilk harf KONTROL EDEN, üçüncü harf ÜRETİLEN. V-C-V-S = Voltage Controlled Voltage Source. Aktif elemanlar: pil, üreteç, op-amp. Pasif: direnç (yutar), kondansatör ve bobin (depolar).');
    out.innerHTML = 'Bir sembole tıkla.';
    V.onFrame = (dt, t) => { objs.forEach((o, k) => { o.rot = [0, 0.5 * Math.sin(t * 0.8 + k), 0]; }); };
  }
};

SC.crt = {
  t: 'CRT (katot ışınlı tüp) — elektron tabancası, anot, saptırma plakaları, fluoresan ekran',
  b(V, P) {
    V.setCam({ yaw: -0.5, pitch: 0.28, dist: 9.5, t: [0.6, 0, 0] });
    const prof = [[0.01, -4.3], [0.42, -4.3], [0.42, -1.2], [0.6, -0.6], [1.15, 0.6], [1.7, 1.9], [1.75, 2.2], [0.01, 2.25]];
    V.add(E3.lathe(prof, 36, 'x'), { pos: [0, 0, 0], rot: [0, Math.PI, 0], color: '#9fc6e8', alpha: 0.16, two: true, edge: false });
    V.add(E3.cyl(1.68, 0.04, 36, 'x'), { pos: [-2.18, 0, 0], color: '#0d2a33', alpha: 0.9 });
    V.add(E3.cyl(0.2, 0.7, 14, 'x'), { pos: [3.6, 0, 0], color: '#8e99a6' });
    [2.6, 2.2].forEach(x => V.add(E3.tube(0.3, 0.2, 0.12, 20, 'x'), { pos: [x, 0, 0], color: '#c98a4b' }));
    V.add(E3.box(0.5, 0.05, 0.4), { pos: [1.5, 0.28, 0], color: '#d0d6dc' }); V.add(E3.box(0.5, 0.05, 0.4), { pos: [1.5, -0.28, 0], color: '#d0d6dc' });
    V.add(E3.box(0.5, 0.4, 0.05), { pos: [0.9, 0, 0.28], color: '#d0d6dc' }); V.add(E3.box(0.5, 0.4, 0.05), { pos: [0.9, 0, -0.28], color: '#d0d6dc' });
    H.txt(V, [4.1, -0.7, 0], 'elektron tabancası'); H.txt(V, [2.4, 0.8, 0], 'anot (+): hızlandırır, odaklar'); H.txt(V, [1.1, -0.9, 0], 'saptırma plakaları'); H.txt(V, [-2.2, 2.05, 0], 'fluoresan ekran');
    const beam = { k: 'dots', pts: [], r: 0.035, color: COL.el, glow: true }; V.ov.push(beam);
    const trail = { k: 'dots', pts: [], r: 0.05, color: '#7dffb0', glow: true }; V.ov.push(trail);
    const tr = [];
    let ex = 15, kv = 25;
    const out = P.out();
    const upd = () => {
      const n = Math.pow(10, ex), i = 1.6e-19 * n, p = kv * 1000 * i;
      out.innerHTML = `i = e·(dn/dt) = 1,6×10⁻¹⁹ × 10<sup>${ex}</sup> = <b>${i.toExponential(1).replace('.', ',')} A</b> &nbsp; p = V₀·i = ${kv} kV × i = <b>${p >= 1 ? H.fmt(p) + ' W' : H.fmt(p * 1000) + ' mW'}</b>. (Eksi işaret: akım elektron akışına ters; büyüklük aynı.)`;
    };
    P.slider('Saniyede elektron sayısı: 10^', { min: 12, max: 16, step: 1, val: ex, unit: '' }, x => { ex = x; upd(); });
    P.slider('Hızlandırma gerilimi V₀', { min: 5, max: 40, step: 1, val: kv, unit: 'kV' }, x => { kv = x; upd(); });
    P.btns([['Örnek 1.8: 10¹⁵ e/s, 4 W → V₀?', () => { ex = 15; kv = 25; upd(); out.innerHTML += '<br>V₀ = p / i = 4 / 1,6×10⁻⁴ = <b>25 000 V = 25 kV</b>'; }], ['Alıştırma 1.8: 10¹³ e/s, 30 kV', () => { ex = 13; kv = 30; upd(); out.innerHTML += '<br>p = 30 000 × 1,6×10⁻⁶ = <b>0,048 W = 48 mW</b>'; }]]);
    upd();
    V.onFrame = (dt, t) => {
      const yy = 1.1 * Math.sin(t * 2.1), zz = 1.1 * Math.sin(t * 1.4 + 0.7), tgt = [-2.15, yy, zz];
      const pts = [], N = 14 + (ex - 12) * 6;
      for (let k = 0; k < N; k++) {
        const u = ((t * 1.6 + k / N) % 1);
        let p;
        if (u < 0.45) { const s = u / 0.45; p = [3.3 - s * 2.1, 0, 0]; }
        else { const s = (u - 0.45) / 0.55; p = [1.2 - s * 3.35, yy * s * s, zz * s * s]; }
        pts.push(p);
      }
      beam.pts = pts; beam.alpha = 0.5 + (kv / 40) * 0.5;
      tr.push(tgt); if (tr.length > 90) tr.shift(); trail.pts = tr;
    };
  }
};

SC.ozdirenc = {
  t: 'R = ρ·ℓ / A — uzun tel → çok direnç, kalın tel → az direnç, malzeme → ρ',
  b(V, P) {
    V.setCam({ yaw: -0.4, pitch: 0.3, dist: 10, t: [0, 0, 0] });
    const M = [['Gümüş', 1.64e-8, '#d9dde2'], ['Bakır', 1.72e-8, '#c98a4b'], ['Alüminyum', 2.8e-8, '#b8c0c8'], ['Karbon', 4e-5, '#3a3a3a'], ['Germanyum', 0.47, '#7c8a96'], ['Silisyum', 640, '#4e5b6e']];
    let mi = 1, Lm = 2, dmm = 1.0;
    const rod = V.add(E3.cyl(1, 1, 30, 'x'), { color: '#c98a4b', edge: false });
    const el = { k: 'dots', pts: [], r: 0.05, color: COL.el, glow: true }; V.ov.push(el);
    const seeds = Array.from({ length: 50 }, () => [Math.random(), Math.random() * 6.28, Math.sqrt(Math.random())]);
    const dimL = { k: 'dim', a: [0, 0, 0], b: [0, 0, 0], off: [0, -1, 0], t: '', color: '#fff' }; V.ov.push(dimL);
    const ringA = { k: 'ring', c: [0, 0, 0], r: 0.3, u: [0, 1, 0], v: [0, 0, 1], color: COL.amber, w: 2 }; V.ov.push(ringA);
    const tA = H.txt(V, [0, 0, 0], '', { color: COL.amber });
    const out = P.out(); let R = 0;
    const upd = () => {
      const A = Math.PI * Math.pow(dmm / 1000, 2) / 4; R = M[mi][1] * Lm / A;
      out.innerHTML = `${M[mi][0]}: ρ = ${M[mi][1].toExponential(2).replace('.', ',')} Ω·m · ℓ = ${H.fmt(Lm)} m · çap ${H.fmt(dmm)} mm → A = ${A.toExponential(2).replace('.', ',')} m² <br><b>R = ρℓ/A = ${R < 1 ? R.toExponential(2).replace('.', ',') : R > 1e5 ? R.toExponential(2).replace('.', ',') : H.fmt(R)} Ω</b> · ` +
        (mi < 3 ? 'İLETKEN: akımın serbest otobanı.' : 'YARI İLETKEN: koşullara bağlı anahtar.') + ' (Yalıtkanlar: kâğıt 10¹⁰, teflon >10¹² Ω·m — mika, cam.)';
    };
    P.btns(M.map(([n], k) => [n, () => { mi = k; upd(); }]), { toggle: true, sel: 1 });
    P.slider('Uzunluk ℓ', { min: 0.5, max: 5, step: 0.1, val: Lm, unit: 'm' }, x => { Lm = x; upd(); });
    P.slider('Çap', { min: 0.3, max: 4, step: 0.1, val: dmm, unit: 'mm' }, x => { dmm = x; upd(); });
    upd();
    let ph = 0;
    V.onFrame = (dt) => {
      const len = 1.2 + Lm * 1.2, r = 0.12 + dmm * 0.22;
      rod.scl = [len, r, r]; rod.color = M[mi][2];
      dimL.a = [-len / 2, -r, 0]; dimL.b = [len / 2, -r, 0]; dimL.off = [0, -0.5, 0]; dimL.t = `ℓ = ${H.fmt(Lm)} m`;
      ringA.c = [len / 2 + 0.02, 0, 0]; ringA.r = r * 1.02; tA.p = [len / 2 + 0.3, r + 0.35, 0]; tA.t = 'kesit A';
      const sp = Math.max(0.05, Math.min(3, 1.6 / Math.pow(Math.max(R, 1e-6), 0.12) * (mi >= 3 ? 0.3 : 1)));
      ph += dt * sp;
      el.pts = seeds.map(([u, a, rr]) => [(((u + ph * 0.2) % 1) - 0.5) * len, r * 0.85 * rr * Math.cos(a), r * 0.85 * rr * Math.sin(a)]);
      el.alpha = mi >= 4 ? 0.35 : 1;
    };
  }
};

SC.topoloji = {
  t: 'Dal, düğüm, çevre — teli boya, düğümü say: b = l + n − 1',
  b(V, P) {
    V.setCam({ yaw: 0, pitch: 0.05, dist: 10, t: [0, 1, 0] });
    V.add(E3.box(9, 4.2, 0.1), { pos: [0, 1, -0.2], color: '#16202a', bias: 50 });
    const NC = ['#ff8a1f', '#ff2d20', '#4fb0ff'];
    let built = [], mode = 'ex', paint = 0;
    const clear = () => { built.forEach(o => { const i = V.objs.indexOf(o); if (i >= 0) V.objs.splice(i, 1); const j = V.ov.indexOf(o); if (j >= 0) V.ov.splice(j, 1); }); built = []; };
    const W = (pts, node) => { const ws = H.wire(V, pts, '#c9d0d8', 0.05); ws.forEach(w => { w.node = node; }); built.push(...ws); return ws; };
    const T = (p, t, o) => { const ov = H.txt(V, p, t, o); built.push(ov); return ov; };
    const comp = (mesh, pos, color) => { const o = V.add(mesh, { pos, color }); built.push(o); return o; };
    const vsrc = (x, y) => { comp(E3.tube(0.45, 0.38, 0.12, 30, 'z'), [x, y, 0], '#6f9bd1'); T([x, y + 0.15, 0.2], '+', { box: false, size: 16 }); T([x, y - 0.18, 0.2], '−', { box: false, size: 16 }); };
    const isrc = (x, y) => { comp(E3.merge([[E3.tube(0.45, 0.38, 0.12, 30, 'z')], [E3.box(0.07, 0.45, 0.07), [0, -0.08, 0]], [E3.cone(0.13, 0.22, 10), [0, 0.22, 0]]]), [x, y, 0], '#6f9bd1'); };
    let info = { b: 0, n: 0, ser: '', par: '' };
    const build = () => {
      clear();
      if (mode === 'ex') {
        vsrc(-3, 1); T([-3.8, 1, 0], '10 V');
        comp(H.resistor(1.2, 'x'), [-1.5, 2, 0], '#d8c39a'); T([-1.5, 2.45, 0], '5 Ω');
        comp(H.resistor(1.2, 'y'), [0.5, 1, 0], '#d8c39a'); T([1.05, 1, 0], '6 Ω');
        isrc(2.5, 1); T([3.2, 1, 0], '2 A');
        W([[-3, 1.45, 0], [-3, 2, 0], [-2.1, 2, 0]], 0);
        W([[-0.9, 2, 0], [2.5, 2, 0]], 1); W([[0.5, 2, 0], [0.5, 1.6, 0]], 1); W([[2.5, 2, 0], [2.5, 1.45, 0]], 1);
        W([[-3, 0.55, 0], [-3, 0, 0], [2.5, 0, 0]], 2); W([[0.5, 0, 0], [0.5, 0.4, 0]], 2); W([[2.5, 0, 0], [2.5, 0.55, 0]], 2);
        info = { b: 4, n: 3, ser: '10 V kaynak ile 5 Ω <b>SERİ</b>: yalnız Düğüm 1\'i paylaşıyorlar, o düğüme başka dal yok → aynı akım.', par: '6 Ω ile 2 A kaynak <b>PARALEL</b>: ikisi de Düğüm 2 ile Düğüm 3 arasında → aynı gerilim.' };
      } else {
        vsrc(-3.4, 1); T([-4.2, 1, 0], '10 V');
        comp(H.resistor(0.8, 'y'), [-1.6, 1.6, 0], '#d8c39a'); T([-1.05, 1.65, 0], '5 Ω');
        comp(H.resistor(0.7, 'y'), [0, 0.55, 0], '#d8c39a'); T([0.5, 0.55, 0], '1 Ω');
        comp(H.resistor(0.7, 'y'), [1.4, 0.55, 0], '#d8c39a'); T([1.9, 0.55, 0], '2 Ω');
        comp(H.resistor(1.2, 'y'), [3.2, 1, 0], '#d8c39a'); T([3.75, 1, 0], '4 Ω');
        W([[-3.4, 1.45, 0], [-3.4, 2.2, 0], [3.2, 2.2, 0], [3.2, 1.6, 0]], 0); W([[-1.6, 2.2, 0], [-1.6, 2.0, 0]], 0);
        W([[-1.6, 1.2, 0], [-1.6, 1.05, 0], [1.4, 1.05, 0], [1.4, 0.9, 0]], 1); W([[0, 1.05, 0], [0, 0.9, 0]], 1);
        W([[-3.4, 0.55, 0], [-3.4, -0.2, 0], [3.2, -0.2, 0], [3.2, 0.4, 0]], 2); W([[0, 0.2, 0], [0, -0.2, 0]], 2); W([[1.4, 0.2, 0], [1.4, -0.2, 0]], 2);
        info = { b: 5, n: 3, ser: '5 Ω, 1 Ω ve 2 Ω\'nin <b>paralel eşdeğeriyle SERİ</b> konumdadır (tek tek hiçbir elemanla seri değil: orta düğümde 3 dal var).', par: '1 Ω ∥ 2 Ω (ikisi de orta düğüm ile alt düğüm arasında). 4 Ω ∥ 10 V kaynak (fiziksel olarak uzak ama ikisi de üst ve alt düğüme bağlı!).' };
      }
      paint = 0;
    };
    const out = P.out();
    const say = () => { const l = info.b - info.n + 1; out.innerHTML = `Dal b = <b>${info.b}</b> (her eleman bir dal; boş teller dal değil) · Düğüm n = <b>${info.n}</b> · Bağımsız çevre l = b − n + 1 = <b>${l}</b>`; };
    P.btns([['Örnek 2.4', () => { mode = 'ex'; build(); say(); }], ['Alıştırma 2.4', () => { mode = 'al'; build(); say(); }]], { toggle: true });
    P.btns([['1. Düğümleri boya', () => { paint = 0.001; say(); }], ['Seri olanlar', () => { say(); out.innerHTML += '<br>' + info.ser; }], ['Paralel olanlar', () => { say(); out.innerHTML += '<br>' + info.par; }]]);
    P.note('Kural: bir İDEAL teldeki her nokta aynı düğümdür — tel ne kadar uzun çizilirse çizilsin. Şemadaki her siyah nokta ayrı düğüm DEĞİLDİR. Alıştırma 2.4\'te slaytlar kendi içinde çelişiyor (bir slayt n = 2, diğeri 3 düğüm); kitabın cevabı: 5 dal, 3 düğüm.');
    build(); say();
    V.onFrame = (dt) => {
      if (paint > 0) paint = Math.min(3.2, paint + dt * 1.1);
      built.forEach(o => { if (o.node === undefined) return; const p = paint - o.node; o.color = p > 0 ? NC[o.node] : '#c9d0d8'; o.glow = p > 0 && p < 0.6 ? 1 - p / 0.6 : 0; });
    };
  }
};

SC.kcl = {
  t: 'KCL — düğüme giren toplam = çıkan toplam (boru kavşağında su gibi)',
  b(V, P) {
    V.setCam({ yaw: -0.3, pitch: 0.75, dist: 10, t: [0, 0, 0] });
    H.floor(V, 9, 9, -0.6);
    V.add(E3.sphere(0.42, 14), { color: '#2a8f9a' });
    const dirs = [[-1, 0.0, -0.6], [-0.7, 0, 1], [1, 0, -0.75], [0.8, 0, 0.9]].map(d => E3.norm(d));
    const pipes = dirs.map(d => { const a = Math.atan2(d[2], d[0]); return V.add(E3.cyl(0.2, 3.2, 14, 'x'), { pos: E3.mul(d, 2.1), rot: [0, -a, 0], color: '#9aa6b2', alpha: 0.28, edge: false }); });
    const flows = dirs.map(d => H.flow(V, H.path([E3.mul(d, 3.7), E3.mul(d, 0.45)]), 12, COL.el, 0.07));
    const labs = dirs.map(d => H.txt(V, E3.add(E3.mul(d, 4.25), [0, 0.3, 0]), ''));
    let I = [5, 3, 2, 0], mode = 'free';
    const out = P.out();
    const upd = () => {
      if (mode === 'free') {
        I[3] = I[0] + I[1] - I[2];
        labs[0].t = `i₁ = ${I[0]} A (giren)`; labs[1].t = `i₂ = ${I[1]} A (giren)`; labs[2].t = `i₃ = ${I[2]} A (çıkan)`;
        labs[3].t = I[3] >= 0 ? `i₄ = ${I[3]} A (çıkan)` : `i₄ = ${I[3]} A → aslında ${-I[3]} A GİRİYOR`;
        out.innerHTML = `Giren = çıkan: i₁ + i₂ = i₃ + i₄ → ${I[0]} + ${I[1]} = ${I[2]} + i₄ → <b>i₄ = ${I[3]} A</b>. ` + (I[3] < 0 ? 'Negatif sonuç: seçtiğin yön ters, gerçek akım düğüme giriyor.' : '') + ' Cebirsel yazım: −i₁ − i₂ + i₃ + i₄ = 0 (Σi = 0). Düğüm yük depolayamaz.';
        pipes[3].visible = true; labs[3].alpha = 1;
      } else {
        I = [3, 3, 6, 0];
        labs[0].t = '3 A kaynağı (giren)'; labs[1].t = '0,5·i₀ bağımlı kaynak (giren)'; labs[2].t = 'i₀ → 4 Ω direnç (çıkan)'; labs[3].t = '';
        pipes[3].visible = false;
        out.innerHTML = '<b>Örnek 2.6 (bonus, Konu 10 s.13):</b> KCL: 0,5i₀ + 3 = i₀ → 3 = 0,5i₀ → <b>i₀ = 6 A</b>; Ohm: v₀ = 4·i₀ = <b>24 V</b>. Bağımlı kaynak da bir akım kaynağıdır: KCL\'ye aynen girer.';
      }
    };
    P.btns([['Serbest kavşak', () => { mode = 'free'; I = [5, 3, 2, 0]; upd(); }], ['Örnek 2.6 (bonus)', () => { mode = '26'; upd(); }]], { toggle: true });
    P.slider('i₁ (giren)', { min: 0, max: 10, step: 1, val: 5, unit: 'A' }, x => { mode = 'free'; I[0] = x; upd(); });
    P.slider('i₂ (giren)', { min: 0, max: 10, step: 1, val: 3, unit: 'A' }, x => { mode = 'free'; I[1] = x; upd(); });
    P.slider('i₃ (çıkan)', { min: 0, max: 15, step: 1, val: 2, unit: 'A' }, x => { mode = 'free'; I[2] = x; upd(); });
    upd();
    V.onFrame = (dt) => {
      const sgn = [1, 1, -1, -1];
      flows.forEach((f, k) => { const v = I[k] * sgn[k]; f.step(dt * v * 0.35); f.o.alpha = I[k] === 0 || (mode !== 'free' && k === 3) ? 0 : 1; f.o.color = (v > 0) ? COL.el : COL.amber; });
    };
  }
};

SC.serikaynak = {
  t: 'Seri gerilim kaynakları toplanır (KVL) · Paralel akım kaynakları toplanır (KCL)',
  b(V, P) {
    V.setCam({ yaw: -0.2, pitch: 0.2, dist: 13, t: [0.5, 1.8, 0] });
    H.floor(V, 13, 5);
    const Vv = [6, 4, 3], up = [true, true, false];
    const cells = Vv.map((v, k) => V.add(H.battery(0.95, 0.4), { pos: [-4, 0.6 + k * 1.15, 0], color: ['#3b6fb6', '#3f8f5a', '#c06a2b'][k] }));
    const cl = Vv.map((v, k) => H.txt(V, [-4.9, 0.6 + k * 1.15, 0], ''));
    const bar = V.add(E3.box(0.35, 1, 0.35), { color: COL.red });
    const veq = H.txt(V, [-2.2, 4.4, 0], '', { size: 15 });
    H.txt(V, [-4, -0.2, 0.5], 'b (−)', { size: 11 }); H.txt(V, [-4, 4.1, 0.5], 'a (+)', { size: 11 });
    const Ii = [5, 2, 3], iu = [true, false, true];
    H.wire(V, [[0.8, 3.4, 0], [4.8, 3.4, 0]]); H.wire(V, [[0.8, 0.2, 0], [4.8, 0.2, 0]]);
    const ar = Ii.map((v, k) => { H.wire(V, [[1.2 + k * 1.3, 0.2, 0], [1.2 + k * 1.3, 3.4, 0]], '#5a646e', 0.03); return V.add(E3.merge([[E3.box(0.12, 1.3, 0.12)], [E3.cone(0.3, 0.5, 14), [0, 0.85, 0]]]), { pos: [1.2 + k * 1.3, 1.8, 0], color: '#6f9bd1' }); });
    const al = Ii.map((v, k) => H.txt(V, [1.2 + k * 1.3, -0.3, 0.3], ''));
    const big = V.add(E3.merge([[E3.box(0.2, 1.6, 0.2)], [E3.cone(0.45, 0.7, 16), [0, 1.1, 0]]]), { pos: [6.2, 1.6, 0], color: COL.red });
    const ieq = H.txt(V, [6.2, 3.9, 0], '', { size: 15 });
    const out = P.out();
    const upd = () => {
      const s = Vv.reduce((a, v, k) => a + (up[k] ? v : -v), 0), si = Ii.reduce((a, v, k) => a + (iu[k] ? v : -v), 0);
      cl.forEach((t, k) => t.t = `${up[k] ? '+' : '−'}${Vv[k]} V`); al.forEach((t, k) => t.t = `${iu[k] ? '↑' : '↓'} ${Ii[k]} A`);
      veq.t = `V_eş = ${Vv.map((v, k) => (k ? (up[k] ? ' + ' : ' − ') : (up[k] ? '' : '−')) + v).join('')} = ${s} V`;
      ieq.t = `I_eş = ${Ii.map((v, k) => (k ? (iu[k] ? ' + ' : ' − ') : (iu[k] ? '' : '−')) + v).join('')} = ${si} A`;
      out.innerHTML = `<b>Seri gerilim kaynakları</b> (KVL): yönüne göre topla/çıkar → tek kaynak V_eş = ${s} V. <b>Paralel akım kaynakları</b> (KCL): okun yönüne göre topla/çıkar → I_eş = ${si} A.<br><b class="bad">Yasak:</b> aynı kolda SERİ iki farklı akım kaynağı (KCL bozulur) ve PARALEL iki farklı gerilim kaynağı (KVL bozulur — kısa devre). Ancak değerleri tam eşitse olur.`;
      return [s, si];
    };
    P.btns(Vv.map((v, k) => [`${v} V pilini ters çevir`, () => { up[k] = !up[k]; upd(); }]));
    P.btns(Ii.map((v, k) => [`${v} A kaynağını ters çevir`, () => { iu[k] = !iu[k]; upd(); }]));
    upd();
    V.onFrame = () => {
      const [s, si] = upd.call ? [Vv.reduce((a, v, k) => a + (up[k] ? v : -v), 0), Ii.reduce((a, v, k) => a + (iu[k] ? v : -v), 0)] : [0, 0];
      cells.forEach((c, k) => { c.rot = [H.sm(c.rot[0], up[k] ? 0 : Math.PI), 0, 0]; });
      ar.forEach((c, k) => { c.rot = [0, 0, H.sm(c.rot[2], iu[k] ? 0 : Math.PI)]; });
      const h = Math.max(0.05, Math.abs(s) * 0.25); bar.scl = [1, h, 1]; bar.pos = [-2.9, h / 2 + 0.1, 0]; bar.color = s >= 0 ? COL.red : COL.el;
      big.rot = [0, 0, si >= 0 ? 0 : Math.PI]; const sc = Math.max(0.2, Math.min(1.6, Math.abs(si) / 5)); big.scl = [1, sc, 1];
    };
  }
};

SC.tuketim = {
  t: 'Evde aylık tüketim (Tablo 1.3) — ısıtma yapanlar devdir',
  b(V, P) {
    V.setCam({ yaw: -0.35, pitch: 0.35, dist: 13, t: [0, 1.6, 0] });
    H.floor(V, 13, 5);
    const D = [['Şofben', 500], ['Çamaşır mak.', 120], ['Fırın/ocak', 100], ['Buzdolabı', 100], ['Aydınlatma', 100], ['Kurutma mak.', 80], ['TV', 10], ['Saat', 2]];
    const bars = D.map(([n, v], k) => { const x = -5.25 + k * 1.5; const o = V.add(E3.box(1.0, 1, 1.0), { pos: [x, 0, 0], color: k === 0 ? '#ff2d20' : '#ffb020' }); H.txt(V, [x, -0.4, 0.8], n, { size: 11, box: false, color: '#c9d0d8' }); return { o, v, x, lab: H.txt(V, [x, 0, 0], v + ' kWh', { size: 12 }) }; });
    let pr = 3, grow = 0;
    const out = P.out();
    const tot = D.reduce((a, d) => a + d[1], 0);
    const upd = () => { out.innerHTML = `Toplam ≈ <b>${tot} kWh/ay</b>. Fatura = enerji (kWh) × birim fiyat: ${tot} × ${pr} = <b>${H.fmt(tot * pr, 0)} TL</b> (+ tüketim sıfır olsa bile sabit abonelik ücreti). Şofben tek başına ${H.fmt(500 * pr, 0)} TL. Güç (kW) × zaman (h) = enerji (kWh) → maliyet.`; };
    P.slider('Birim fiyat (örnek)', { min: 1, max: 6, step: 0.5, val: pr, unit: 'TL/kWh' }, x => { pr = x; upd(); });
    P.btns([['Tekrar büyüt', () => { grow = 0; }]]);
    upd();
    V.onFrame = (dt) => { grow = Math.min(1, grow + dt * 0.6); const e = 1 - Math.pow(1 - grow, 3); bars.forEach(b => { const h = Math.max(0.03, b.v / 500 * 4.2 * e); b.o.scl = [1, h, 1]; b.o.pos = [b.x, h / 2, 0]; b.lab.p = [b.x, h + 0.35, 0]; }); };
  }
};

SC.anlikguc = {
  t: 'Anlık güç p(t) = v(t)·i(t); eğri altındaki alan = enerji w = ∫p dt',
  b(V, P) {
    let T = 1.2, auto = true;
    const out = P.out();
    const sl = P.slider('Zaman t', { min: 0, max: 4, step: 0.01, val: T, unit: 's' }, x => { T = x; auto = false; });
    P.btns([['Oynat', () => { auto = true; }]]);
    plot2d(V, (c, W, Hh, tm) => {
      if (auto) { T = (tm * 0.4) % 4; sl.value = T; sl.parentElement.querySelector('b').textContent = H.fmt(T) + ' s'; }
      const x0 = 46, w = W - 80, sx = t => x0 + t / 4 * w, y0 = Hh * 0.5, h = Hh * 0.85, sy = v => y0 - v / 85 * h / 2;
      axes2d(c, x0, y0, w, h, 't (s)', '');
      const v = t => 20 * Math.sin(Math.PI * t), i = t => 4 * Math.sin(Math.PI * t), p = t => v(t) * i(t);
      c.fillStyle = 'rgba(255,176,32,.25)'; c.beginPath(); c.moveTo(sx(0), y0);
      for (let k = 0; k <= 200; k++) { const t = k / 200 * T; c.lineTo(sx(t), sy(p(t))); } c.lineTo(sx(T), y0); c.closePath(); c.fill();
      const curve = (f, col, sc) => { c.strokeStyle = col; c.lineWidth = 2.2; c.beginPath(); for (let k = 0; k <= 300; k++) { const t = k / 300 * 4, y = sy(f(t) * sc); k ? c.lineTo(sx(t), y) : c.moveTo(sx(t), y); } c.stroke(); };
      curve(v, COL.volt, 2); curve(i, COL.red, 5); curve(p, COL.amber, 1);
      c.strokeStyle = '#fff'; c.setLineDash([4, 4]); c.beginPath(); c.moveTo(sx(T), y0 - h / 2); c.lineTo(sx(T), y0 + h / 2); c.stroke(); c.setLineDash([]);
      c.font = '600 13px Bahnschrift'; c.textAlign = 'left';
      c.fillStyle = COL.volt; c.fillText('v(t) = 20 sin πt  V', x0 + 8, 18); c.fillStyle = COL.red; c.fillText('i(t) = 4 sin πt  mA', x0 + 170, 18); c.fillStyle = COL.amber; c.fillText('p(t) = 80 sin² πt  mW', x0 + 330, 18);
      const wv = 40 * T - 20 / Math.PI * Math.sin(2 * Math.PI * T);
      out.innerHTML = `5 kΩ direnç: i = v/R = 20 sin πt / 5000 = <b>4 sin πt mA</b>; p = v·i = <b>80 sin²πt mW</b> (direnç için p ≥ 0: hep yutar). t = ${H.fmt(T)} s anında p = ${H.fmt(p(T))} mW, taralı alan = enerji w ≈ <b>${H.fmt(wv)} mJ</b>.`;
    });
  }
};
