(function () {
  const UI = window.UI, $ = UI.$, $$ = UI.$$;
  const CH = 1.633;
  /* ---------- kafes tanımları (a = 1) ---------- */
  const corners = [[0, 0, 0], [1, 0, 0], [0, 1, 0], [1, 1, 0], [0, 0, 1], [1, 0, 1], [0, 1, 1], [1, 1, 1]];
  const CUBE_EDGES = [[0, 1], [0, 2], [1, 3], [2, 3], [4, 5], [4, 6], [5, 7], [6, 7], [0, 4], [1, 5], [2, 6], [3, 7]];
  function mk(type) {
    let atoms = [], edges = [], verts = [], r, name, cn, ado, per, vol, ctr = [0.5, 0.5, 0.5];
    if (type === 'sc' || type === 'hmk' || type === 'ymk') {
      verts = corners.slice(); edges = CUBE_EDGES;
      corners.forEach(p => atoms.push({ p, w: 1 / 8, k: 'corner' }));
      if (type === 'hmk') atoms.push({ p: [0.5, 0.5, 0.5], w: 1, k: 'body' });
      if (type === 'ymk') [[0.5, 0.5, 0], [0.5, 0.5, 1], [0.5, 0, 0.5], [0.5, 1, 0.5], [0, 0.5, 0.5], [1, 0.5, 0.5]].forEach(p => atoms.push({ p, w: 1 / 2, k: 'face' }));
      r = { sc: 0.5, hmk: Math.sqrt(3) / 4, ymk: Math.sqrt(2) / 4 }[type]; vol = 1;
      name = { sc: 'Basit kübik', hmk: 'Hacim merkezli kübik (HMK)', ymk: 'Yüzey merkezli kübik (YMK)' }[type]; cn = { sc: 6, hmk: 8, ymk: 12 }[type];
      per = { sc: 1, hmk: 2, ymk: 4 }[type];
    } else {
      ctr = [0, 0, CH / 2];
      for (let i = 0; i < 6; i++) { const a = i * Math.PI / 3; verts.push([Math.cos(a), Math.sin(a), 0]); }
      for (let i = 0; i < 6; i++) { const a = i * Math.PI / 3; verts.push([Math.cos(a), Math.sin(a), CH]); }
      for (let i = 0; i < 6; i++) { edges.push([i, (i + 1) % 6]); edges.push([6 + i, 6 + (i + 1) % 6]); edges.push([i, 6 + i]); }
      verts.forEach(p => atoms.push({ p, w: 1 / 6, k: 'corner' })); atoms.push({ p: [0, 0, 0], w: 1 / 2, k: 'face' }); atoms.push({ p: [0, 0, CH], w: 1 / 2, k: 'face' });
      [30, 150, 270].forEach(d => { const a = d * Math.PI / 180, q = 1 / Math.sqrt(3); atoms.push({ p: [q * Math.cos(a), q * Math.sin(a), CH / 2], w: 1, k: 'body' }); });
      r = 0.5; vol = 1.5 * Math.sqrt(3) * CH; name = 'Sıkı düzenli heksagonal (SDH)'; cn = 12; per = 6;
    }
    ado = per * 4 / 3 * Math.PI * r * r * r / vol;
    return { type, atoms, edges, verts, r, name, cn, ado, per, ctr };
  }
  const CELLS = {}; ['sc', 'hmk', 'ymk', 'sdh'].forEach(t => CELLS[t] = mk(t));
  /* sonsuz kafeste komşular */
  function lattice(type) {
    const pts = [], R = 3;
    if (type === 'sdh') { const a1 = [1, 0, 0], a2 = [0.5, Math.sqrt(3) / 2, 0], a3 = [0, 0, CH];
      for (let i = -R; i <= R; i++) for (let j = -R; j <= R; j++) for (let k = -R; k <= R; k++) { const o = [i * a1[0] + j * a2[0], i * a1[1] + j * a2[1], k * CH]; pts.push(o); pts.push([o[0] + 0.5, o[1] + 0.2887, o[2] + CH / 2]); }
    } else { const bas = { sc: [[0, 0, 0]], hmk: [[0, 0, 0], [.5, .5, .5]], ymk: [[0, 0, 0], [.5, .5, 0], [.5, 0, .5], [0, .5, .5]] }[type];
      for (let i = -R; i <= R; i++) for (let j = -R; j <= R; j++) for (let k = -R; k <= R; k++) bas.forEach(b => pts.push([i + b[0], j + b[1], k + b[2]]));
    }
    return pts;
  }
  const SEL = { sc: [0, 0, 0], hmk: [0.5, 0.5, 0.5], ymk: [0.5, 0.5, 0], sdh: [0, 0, 0] };
  function neighbors(type) {
    const c = SEL[type], pts = lattice(type), ds = pts.map(p => Math.hypot(p[0] - c[0], p[1] - c[1], p[2] - c[2])).filter(d => d > 1e-6), dm = Math.min(...ds);
    return pts.filter(p => { const d = Math.hypot(p[0] - c[0], p[1] - c[1], p[2] - c[2]); return d > 1e-6 && d < dm * 1.001; });
  }
  const near = (p, q) => Math.hypot(p[0] - q[0], p[1] - q[1], p[2] - q[2]) < 1e-3;
  UI.cellData = CELLS;

  /* hücre çizimi (ortak) */
  function drawCell(ctx, P, C, o) {
    o = o || {}; const sz = o.size == null ? 1 : o.size, ctr = C.ctr, alpha = o.alpha == null ? 1 : o.alpha;
    const T = p => P((p[0] - ctr[0]) * (o.s || 1), (p[1] - ctr[1]) * (o.s || 1), (p[2] - ctr[2]) * (o.s || 1));
    ctx.globalAlpha = alpha;
    C.edges.forEach(e => { const a = T(C.verts[e[0]]), b = T(C.verts[e[1]]); UI.line(ctx, a.x, a.y, b.x, b.y, '#566473', 1.4); });
    const list = [];
    C.atoms.forEach((at, i) => { const q = at.p.map((v, k) => v + ((o.jit && o.jit(i, k)) || 0)); const pp = T(q); list.push({ pp, at, i, ghost: false }); });
    (o.ghosts || []).forEach(g => list.push({ pp: T(g), at: { k: 'ghost' }, i: -1, ghost: true }));
    list.sort((a, b) => b.pp.d - a.pp.d);
    list.forEach(it => {
      const rr = C.r * sz * (o.s || 1) * it.pp.sc * it.pp.k; const col = o.color ? o.color(it) : (it.at.k === 'corner' ? '#FF9E9E' : it.at.k === 'face' ? '#6FB4FF' : it.at.k === 'ghost' ? null : '#F5F5F5');
      if (it.ghost) { UI.circle(ctx, it.pp.x, it.pp.y, rr, 'rgba(255,255,255,.07)', 'rgba(255,255,255,.6)', 1.2); }
      else UI.atom(ctx, it.pp.x, it.pp.y, Math.max(2, rr), col);
      if (o.label) { const t = o.label(it); if (t) UI.text(ctx, t, it.pp.x, it.pp.y, '#0B0E12', 12, 'center'); }
    });
    ctx.globalAlpha = 1; return { T, list };
  }
  UI.drawCell = drawCell; UI.mkCell = mk;

  /* ---------- Miller yardımcıları ---------- */
  const gcd = (a, b) => b ? gcd(b, a % b) : Math.abs(a), lcm = (a, b) => a * b / gcd(a, b);
  const bar = n => n < 0 ? Math.abs(n) + '̄' : String(n);
  const FR = { 'inf': [1, 0], '1/4': [1, 4], '1/3': [1, 3], '1/2': [1, 2], '2/3': [2, 3], '1': [1, 1], '3/2': [3, 2], '2': [2, 1], '3': [3, 1], '-1/2': [-1, 2], '-1': [-1, 1], '0': [0, 1] };
  const fstr = f => f[1] === 0 ? '∞' : (f[1] === 1 ? String(f[0]) : f[0] + '/' + f[1]);
  const val = f => f[1] === 0 ? Infinity : f[0] / f[1];
  function millerPlane(ix) { // ix: üç kesişim [n,d]
    const rec = ix.map(f => f[1] === 0 ? [0, 1] : [f[1] * (f[0] < 0 ? -1 : 1), Math.abs(f[0])]); // 1/(n/d) = d/n
    let L = 1; rec.forEach(f => { L = lcm(L, f[1]); }); let m = rec.map(f => f[0] * L / f[1]); let g = 0; m.forEach(v => g = gcd(g, v)); if (g > 1) m = m.map(v => v / g);
    return { rec, L, m };
  }
  function millerDir(pt) {
    let L = 1; pt.forEach(f => L = lcm(L, f[1])); let m = pt.map(f => f[0] * L / f[1]); let g = 0; m.forEach(v => g = gcd(g, v)); if (g > 1) m = m.map(v => v / g); return { L, m };
  }
  function family(h, k, l, signs) {
    const out = new Set(), base = [h, k, l];
    const perm = (a) => a.length <= 1 ? [a] : a.flatMap((x, i) => perm([...a.slice(0, i), ...a.slice(i + 1)]).map(r => [x, ...r]));
    perm(base).forEach(pm => { for (let s = 0; s < 8; s++) { const v = pm.map((x, i) => (s >> i) & 1 ? -x : x); out.add(v.map(x => x === 0 ? 0 : x).join(',')); } });
    return [...out].map(s => s.split(',').map(Number));
  }

  window.CH[4] = {
    intro: 'Metaller kristaldir: atomlar üç boyutta tekrar eden bir düzende dizilir. Bu bölümde birim hücreleri döndürüp içlerini sayacak, ısıtınca demirin kafesinin değiştiğini görecek ve Miller indislerini kendi ellerinle üreteceksin.',
    sections: [
      {
        id: 'hucre', title: 'Birim hücre: HMK, YMK, SDH', pg: 's.32-37',
        build(b) {
          b.innerHTML = `<p>Fareyle/parmakla <b>sürükle, döndür</b>. Her kafesin atomlarını sayabilir, bir atomun komşularını ışıklandırabilirsin.</p>
          <div class="widget drag"><canvas></canvas><div class="ctl"><span class="seg" id="ty"><button data-v="sc">Basit kübik</button><button data-v="hmk" class="on">HMK</button><button data-v="ymk">YMK</button><button data-v="sdh">SDH</button></span><span class="seg" id="md"><button data-v="pos" class="on">Konumlar</button><button data-v="real">Gerçek boyut</button></span><button class="btn" id="nb">Komşuları göster</button><button class="btn" id="ct">Hücredeki atomu say</button></div><div class="cap"></div></div>
          <div class="wrap"><table><tr><th>Sistem</th><th>Koordinasyon sayısı</th><th>Hücredeki atom</th><th>ADO</th><th>Örnekler</th></tr>
          <tr><td><b>HMK</b></td><td>8</td><td>2</td><td>%68</td><td>α-Fe, V, Nb, Ta, Cr, Mo, W</td></tr>
          <tr><td><b>YMK</b></td><td>12</td><td>4</td><td>%74</td><td>Cu, Ag, Au, Al, Pb, Ni</td></tr>
          <tr><td><b>SDH</b></td><td>12</td><td>6</td><td>%74</td><td>Be, Mg, Zn, Cd, α-Ti</td></tr></table></div>
          <div class="key"><ul><li><b>Koordinasyon sayısı:</b> bir atoma en yakın komşu sayısı (s.32).</li><li><b>ADO:</b> hücredeki atomların hacmi / hücre hacmi (s.33). Basit kübik %52, HMK %68, YMK ve SDH %74. En sık paketlenmiş yapıda bile hacmin <b>%26'sı boş</b> (s.35).</li><li>HMK: köşelerde 8 × 1/8 + merkez 1 = <b>2</b>. YMK: 8 × 1/8 + 6 × 1/2 = <b>4</b>. SDH: 12 × 1/6 + 2 × 1/2 + 3 = <b>6</b>.</li><li>HMK'da atomlar <b>hacim köşegeninde</b> değer: 4r = a√3. YMK'da yüz köşegeninde: 4r = a√2.</li><li>Kafes parametresi: kübikte kenar <b>a</b>; heksagonalde <b>a</b> ve yükseklik <b>c</b>, ideal <b>c/a ≈ 1,63</b> (s.35, 37).</li></ul></div>
          <div class="tip">Portakal kasasını düşün: en alta sıkı dizilmiş bir kat, üstüne çukurlara oturan ikinci kat. Aradaki boşluk hep var, o yüzden %74'ün üstüne çıkılamaz.</div>`;
          const w = b; let ty = 'hmk', real = false, nb = false, count = -1, ct0 = 0;
          UI.seg(w, '#ty', v => { ty = v; count = -1; }); UI.seg(w, '#md', v => { real = v === 'real'; });
          $('#nb', w).onclick = () => { nb = !nb; count = -1; }; $('#ct', w).onclick = () => { count = 0; ct0 = 0; };
          const nbs = {}; ['sc', 'hmk', 'ymk', 'sdh'].forEach(t => nbs[t] = neighbors(t));
          const st = UI.view3d($('canvas', w), 0.62, (ctx, P, s, v) => {
            const C = CELLS[ty], sc = ty === 'sdh' ? 0.8 : 1; let cap = '';
            const selp = SEL[ty]; const ghosts = nb ? nbs[ty].filter(p => !C.atoms.some(a => near(a.p, p))) : [];
            if (count >= 0) { ct0 += s.dt; if (ct0 > 0.55 && count < C.atoms.length) { count++; ct0 = 0; } }
            let sum = 0; if (count >= 0) for (let i = 0; i < Math.min(count, C.atoms.length); i++) sum += C.atoms[i].w;
            drawCell(ctx, P, C, {
              size: real ? 1 : 0.34, s: sc, ghosts: ghosts,
              color: it => { if (it.ghost) return null; if (count >= 0) { const idx = it.i; return idx < count ? (it.at.k === 'corner' ? '#FF9E9E' : it.at.k === 'face' ? '#6FB4FF' : '#FFFFFF') : '#2a3340'; } if (nb) { if (near(it.at.p, selp)) return '#F5C542'; if (nbs[ty].some(p => near(p, it.at.p))) return '#7FD99A'; return '#364352'; } return it.at.k === 'corner' ? '#FF9E9E' : it.at.k === 'face' ? '#6FB4FF' : '#F5F5F5'; }
            });
            if (nb) { const c = P((selp[0] - C.ctr[0]) * sc, (selp[1] - C.ctr[1]) * sc, (selp[2] - C.ctr[2]) * sc); nbs[ty].forEach(p => { const q = P((p[0] - C.ctr[0]) * sc, (p[1] - C.ctr[1]) * sc, (p[2] - C.ctr[2]) * sc); UI.line(ctx, c.x, c.y, q.x, q.y, 'rgba(245,197,66,.75)', 2); }); }
            UI.text(ctx, C.name, 14, 18, '#fff', 15);
            if (count >= 0) { UI.text(ctx, `Sayılan konum: ${Math.min(count, C.atoms.length)} / ${C.atoms.length}  →  hücredeki tam atom Σ = ${sum.toFixed(2).replace(/\.00$/, '')}`, 14, s.H - 14, '#F5C542', 15); }
            else UI.text(ctx, `Koordinasyon ${C.cn} · hücrede ${C.per} atom · ADO %${Math.round(C.ado * 100)}`, 14, s.H - 14, '#C9D0D8', 13);
            if (nb) UI.text(ctx, `${nbs[ty].length} en yakın komşu (sarı merkez, yeşil komşu, boş daire hücre dışı)`, 14, 38, '#7FD99A', 13);
          });
          UI.setCap(w, 'Kırmızı: <b>köşe</b> (her biri 1/8 ya da 1/6) · Mavi: <b>yüz merkezi</b> (1/2) · Beyaz: <b>hücre içi</b> (1). "Gerçek boyut"ta atomların birbirine nasıl değdiğini gör.');
        }
      },
      {
        id: 'bravais', title: 'Yedi kristal sistemi, 14 Bravais kafesi', pg: 's.32, 36',
        build(b) {
          b.innerHTML = `<p>Her kafes üç kenar (a, b, c) ve üç açıyla (α, β, γ) tanımlanır. Sistemi seç, kutunun nasıl eğilip uzadığını gör.</p>
          <div class="widget drag"><canvas></canvas><div class="ctl"><span class="seg" id="bs"><button data-v="0" class="on">Kübik</button><button data-v="1">Tetragonal</button><button data-v="2">Ortorombik</button><button data-v="3">Monoklinik</button><button data-v="4">Triklinik</button><button data-v="5">Romboedrik</button><button data-v="6">Heksagonal</button></span></div><div class="cap"></div></div>
          <div class="key"><ul><li><b>7 kristal sistemi, 14 Bravais kafesi:</b> kübik 3 (basit, HMK, YMK), tetragonal 2, ortorombik 4, monoklinik 2, triklinik 1, romboedrik 1, heksagonal 1 → toplam 14 (s.32).</li><li>Kübik: a=b=c, tüm açılar 90°. Heksagonal: a=b≠c, γ=120°.</li></ul></div>`;
          const S = [
            [1, 1, 1, 90, 90, 90, 'a = b = c · α = β = γ = 90°', '3 kafes: basit, HMK, YMK'], [1, 1, 1.55, 90, 90, 90, 'a = b ≠ c · α = β = γ = 90°', '2 kafes'], [1, 1.4, 0.8, 90, 90, 90, 'a ≠ b ≠ c · α = β = γ = 90°', '4 kafes'],
            [1, 1.25, 1.1, 90, 112, 90, 'a ≠ b ≠ c · α = γ = 90° ≠ β', '2 kafes'], [1, 1.2, 1.05, 82, 100, 72, 'a ≠ b ≠ c · α ≠ β ≠ γ', '1 kafes'], [1, 1, 1, 72, 72, 72, 'a = b = c · α = β = γ ≠ 90°', '1 kafes'], [1, 1, 1.63, 90, 90, 120, 'a = b ≠ c · α = β = 90°, γ = 120°', '1 kafes']];
          let sel = 0; UI.seg(b, '#bs', v => sel = +v);
          const cur = [1, 1, 1, 90, 90, 90]; const rad = x => x * Math.PI / 180;
          UI.view3d($('canvas', b), 0.62, (ctx, P, st) => {
            const T = S[sel]; for (let i = 0; i < 6; i++) cur[i] += (T[i] - cur[i]) * Math.min(1, st.dt * 5);
            const [a, bb, c, al, be, ga] = cur, ca = Math.cos(rad(al)), cb = Math.cos(rad(be)), cg = Math.cos(rad(ga)), sg = Math.sin(rad(ga));
            const v1 = [a, 0, 0], v2 = [bb * cg, bb * sg, 0], cx = c * cb, cy = c * (ca - cb * cg) / sg, cz = Math.sqrt(Math.max(0.01, c * c - cx * cx - cy * cy)), v3 = [cx, cy, cz];
            const pts = []; for (let i = 0; i < 8; i++) { const x = i & 1, y = (i >> 1) & 1, z = (i >> 2) & 1; pts.push([x * v1[0] + y * v2[0] + z * v3[0], x * v1[1] + y * v2[1] + z * v3[1], x * v1[2] + y * v2[2] + z * v3[2]]); }
            const ctr = pts.reduce((s, p) => [s[0] + p[0] / 8, s[1] + p[1] / 8, s[2] + p[2] / 8], [0, 0, 0]);
            const Q = pts.map(p => P(p[0] - ctr[0], p[1] - ctr[1], p[2] - ctr[2]));
            [[0, 1], [0, 2], [1, 3], [2, 3], [4, 5], [4, 6], [5, 7], [6, 7], [0, 4], [1, 5], [2, 6], [3, 7]].forEach(e => UI.line(ctx, Q[e[0]].x, Q[e[0]].y, Q[e[1]].x, Q[e[1]].y, '#6FB4FF', 2));
            Q.forEach(q => UI.circle(ctx, q.x, q.y, 5, '#F5F5F5'));
            UI.text(ctx, ['Kübik', 'Tetragonal', 'Ortorombik', 'Monoklinik', 'Triklinik', 'Romboedrik', 'Heksagonal'][sel] + ' sistem', 14, 18, '#fff', 15);
            UI.text(ctx, 'a=' + a.toFixed(2) + ' b=' + bb.toFixed(2) + ' c=' + c.toFixed(2) + ' · α=' + Math.round(al) + '° β=' + Math.round(be) + '° γ=' + Math.round(ga) + '°', 14, st.H - 14, '#C9D0D8', 13);
            UI.setCap(b, `<b>${T[6]}</b> · ${T[7]}`);
          });
        }
      },
      {
        id: 'isi', title: 'Isıtınca atomlara ne olur? Demir ve allotropi', pg: 's.38-40',
        build(b) {
          b.innerHTML = `<p>Isı atomları <b>titreştirir</b>, kafes genleşir. Demir ise daha ilginç: belli sıcaklıklarda <b>kafesini değiştirir</b> (<b>allotropi / polimorfi</b>). Sıcaklığı yavaşça yükselt.</p>
          <div class="widget drag"><canvas></canvas><div class="ctl"><label>Sıcaklık <input type="range" min="20" max="1650" value="20" id="tt"><output></output></label><button class="btn" id="hp">Isıt (otomatik)</button><span class="seg" id="st"><button data-v="0">α 20 °C</button><button data-v="1000">γ 1000 °C</button><button data-v="1450">δ 1450 °C</button></span></div><div class="cap"></div></div>
          <div class="widget"><canvas></canvas><div class="cap">Şematik: demirde atom başına hacim sıcaklıkla artar, 911 °C'de YMK'ya geçerken <b>küçülür</b>.</div></div>
          <div class="key"><ul><li><b>α-Fe: HMK, 911 °C altı.</b> γ-Fe: <b>YMK, 911–1392 °C</b>. δ-Fe: <b>HMK, 1392–1536 °C</b>. 1536 °C'de ergir (s.39-40).</li><li>HMK → YMK geçişinde atomlar daha sık paketlenir, <b>özgül hacim küçülür</b> (s.39).</li><li><b>Allotropi (polimorfi):</b> bir metalin birden fazla kafes sistemine sahip olması. Başka örnekler: Ti (SDH ↔ HMK), Sn (elmas tipi α ↔ tetragonal β, 13,2 °C), Co, Mn (s.40).</li><li>Isıtınca kafes parametresi artar (genleşme) (s.38).</li></ul></div>`;
          const w = b, cw = $$('.widget', b); let T = 20, auto = false;
          const inp = $('#tt', b); UI.bind(w, '#tt', v => { T = v; }, v => Math.round(v) + ' °C');
          $('#hp', w).onclick = () => { auto = !auto; if (auto && T > 1500) { T = 20; inp.value = 20; } };
          UI.seg(w, '#st', v => { T = +v; inp.value = T; inp.dispatchEvent(new Event('input')); }, false);
          const sm = (x, a, b2) => { const t = UI.clamp((x - a) / (b2 - a), 0, 1); return t * t * (3 - 2 * t); };
          const volAt = t => { const lt = 3.7e-5, ex = 1; if (t < 911) return 1 + lt * (t - 20); if (t < 1392) return 1 + lt * 891 - 0.009 + 4.5e-5 * (t - 911); if (t < 1536) return 1 + lt * 891 - 0.009 + 4.5e-5 * 481 + 0.005 + 4.2e-5 * (t - 1392); return 1 + lt * 891 - 0.009 + 4.5e-5 * 481 + 0.005 + 4.2e-5 * 144 + 0.035; };
          const liq = Array.from({ length: 14 }, (_, i) => ({ x: Math.random() * 2 - 1, y: Math.random() * 2 - 1, z: Math.random() * 2 - 1, a: Math.random() * 6, b: Math.random() * 6 }));
          const hex = tt => { const f = UI.clamp(tt / 1600, 0, 1), c0 = [111, 180, 255], c1 = [255, 90, 77]; const m = c0.map((v, i) => Math.round(v + (c1[i] - v) * f)); return '#' + m.map(x => x.toString(16).padStart(2, '0')).join(''); };
          UI.view3d($('canvas', w), 0.6, (ctx, P, s, v) => {
            if (auto) { T = Math.min(1650, T + s.dt * 130); inp.value = T; inp.dispatchEvent(new Event('input')); if (T >= 1650) auto = false; }
            const wY = sm(T, 905, 920) - sm(T, 1386, 1400), wH = 1 - wY, liquid = T > 1536, amp = 0.012 + 0.00012 * T;
            const exp = 1 + 2.2e-5 * T; const col = hex(T);
            const jit = (i, k) => Math.sin(s.t * (6 + k) + i * 3.7 + k * 1.3) * amp;
            if (!liquid) {
              const aH = 1 * exp, aY = 1.2247 * exp;
              if (wH > 0.02) drawCell(ctx, P, CELLS.hmk, { alpha: wH, size: 0.42, s: aH * 1.1, jit, color: () => col });
              if (wY > 0.02) drawCell(ctx, P, CELLS.ymk, { alpha: wY, size: 0.42, s: aY * 1.1, jit, color: () => col });
            } else {
              liq.forEach((q, i) => { q.a += s.dt * (1.2 + (i % 3) * 0.3); q.b += s.dt * 0.9; const p = P(Math.sin(q.a) * 0.8 + q.x * 0.3, Math.cos(q.b) * 0.8 + q.y * 0.3, Math.sin(q.a * 0.7 + i) * 0.8 + q.z * 0.2); UI.atom(ctx, p.x, p.y, 0.2 * p.sc * p.k * 0.8, col); });
            }
            const nm = liquid ? 'Sıvı demir (1536 °C üstü): düzen yok' : T < 905 ? 'α-Fe · HMK (koordinasyon 8, ADO %68)' : T < 1386 && T > 920 ? 'γ-Fe · YMK (koordinasyon 12, ADO %74)' : T > 1400 ? 'δ-Fe · HMK' : 'Dönüşüm bölgesi…';
            UI.text(ctx, nm, 14, 18, '#fff', 15); UI.text(ctx, Math.round(T) + ' °C', s.W - 14, 18, '#F5C542', 18, 'right', 'Bahnschrift, sans-serif');
            UI.text(ctx, 'Mavi: soğuk atom → kırmızı: sıcak, daha çok titrer', 14, s.H - 14, '#8E99A6', 12);
          });
          UI.loop($('canvas', cw[1]), 0.34, (ctx, W, H) => {
            const L = 54, R = W - 14, tp = 18, bt = H - 30, X = t => L + (t - 20) / 1650 * (R - L), Y = v => bt - (v - 1.0) / 0.1 * (bt - tp);
            UI.line(ctx, L, bt, R, bt, '#3a4654', 1); UI.line(ctx, L, tp, L, bt, '#3a4654', 1); UI.text(ctx, 'atom başına hacim (bağıl)', L + 6, 10, '#8E99A6', 11); UI.text(ctx, '°C', R, bt + 14, '#8E99A6', 11, 'right');
            [[911, 'α→γ'], [1392, 'γ→δ'], [1536, 'ergime']].forEach(([t, s]) => { UI.line(ctx, X(t), tp, X(t), bt, '#222b34', 1, [3, 4]); UI.text(ctx, t, X(t), bt + 14, '#8E99A6', 11, 'center'); UI.text(ctx, s, X(t) + 4, tp + 10, '#FF9E9E', 11); });
            ctx.beginPath(); let started = false; for (let t = 20; t <= 1650; t += 3) { const v = volAt(t), jump = (t === 911 || t === 1392 || t === 1536); if (!started || [909, 912, 1390, 1393, 1534, 1537].includes(t)) { } const x = X(t), y = Y(v); if (!started) { ctx.moveTo(x, y); started = true; } else ctx.lineTo(x, y); } ctx.strokeStyle = '#4FD8CF'; ctx.lineWidth = 2.4; ctx.stroke();
            UI.circle(ctx, X(T), Y(volAt(T)), 6, '#fff'); UI.line(ctx, X(T), tp, X(T), bt, 'rgba(255,255,255,.25)', 1);
          });
          UI.setCap(w, '911 °C\'de dev adımı izle: HMK küp, <b>YMK</b>\'ya dönüşür; kafes parametresi büyür ama atomlar daha sık paketlendiği için hacim <b>küçülür</b>.');
        }
      },
      {
        id: 'miller', title: 'Miller indisleri: düzlem ve doğrultu bulma', pg: 's.41-45',
        build(b) {
          b.innerHTML = `<p>Kafesteki düzlemleri ve doğrultuları kısa bir sayı üçlüsüyle anlatırız. Önce <b>kesişimleri</b> seç, adımları aşağıda izle. Kitaptaki örnek: x=1, y=½, z=2 → <b>(241)</b>.</p>
          <div class="widget drag"><canvas></canvas><div class="ctl"><span class="seg" id="mm"><button data-v="p" class="on">Düzlem (hkl)</button><button data-v="d">Doğrultu [uvw]</button></span><label>x <select id="sx"></select></label><label>y <select id="sy"></select></label><label>z <select id="sz"></select></label><span class="seg" id="pr"></span></div><div class="cap" style="font-size:15px"></div></div>
          <div class="key"><ul><li><b>Düzlem:</b> eksen kesişimleri → <b>tersleri</b> → <b>paydaları eşitle</b> (payda kesirli bırakılmaz) → <b>(hkl)</b>. Eksene paralel düzlem sonsuzda keser, indis <b>0</b> (s.41-43).</li><li><b>Doğrultu:</b> orijinden geçen vektörün uç noktası → en küçük tam sayılar → <b>[uvw]</b>. Ters alınmaz, köşeli parantez (s.43).</li><li>Negatif indis <b>üst çizgiyle</b> yazılır: 1̄. Aynı düzlem ailesi <b>{ }</b>, aynı doğrultu ailesi <b>⟨ ⟩</b>.</li><li>Kübik sistemde bir düzlemle <b>aynı indisli doğrultu o düzleme diktir</b> (s.44).</li></ul></div>`;
          const w = b; let mode = 'p'; const sel = [$('#sx', w), $('#sy', w), $('#sz', w)];
          const PO = ['inf', '1/2', '1', '2', '3', '-1', '-1/2'], DO = ['0', '1/2', '1', '2', '-1/2', '-1'];
          function fill() { const list = mode === 'p' ? PO : DO; sel.forEach(s => { const old = s.value; s.innerHTML = list.map(k => `<option value="${k}">${k === 'inf' ? '∞' : k}</option>`).join(''); if (list.includes(old)) s.value = old; }); }
          const presets = { p: [['(100)', ['1', 'inf', 'inf']], ['(110)', ['1', '1', 'inf']], ['(111)', ['1', '1', '1']], ['(241)', ['1', '1/2', '2']], ['(1̄10)', ['-1', '1', 'inf']]], d: [['[100]', ['1', '0', '0']], ['[110]', ['1', '1', '0']], ['[111]', ['1', '1', '1']], ['[210]', ['1', '1/2', '0']], ['[1̄11]', ['-1', '1', '1']]] };
          function pre() { $('#pr', w).innerHTML = presets[mode].map(p => `<button data-v="${p[0]}">${p[0]}</button>`).join(''); $$('#pr button', w).forEach((bt, i) => bt.onclick = () => { presets[mode][i][1].forEach((v, k) => sel[k].value = v); }); }
          UI.seg(w, '#mm', v => { mode = v; fill(); pre(); const d = presets[mode][mode === 'p' ? 3 : 3][1]; d.forEach((x, k) => sel[k].value = x); });
          let sp = null;
          UI.view3d($('canvas', w), 0.64, (ctx, P, s, v) => {
            const q = sel.map(x => FR[x.value]); const o = (x, y, z) => P(x - 0.5, y - 0.5, z - 0.5);
            CUBE_EDGES.forEach(e => { const a = corners[e[0]], c = corners[e[1]], A = o(...a), B = o(...c); UI.line(ctx, A.x, A.y, B.x, B.y, '#566473', 1.4); });
            const ax = [[1.7, 0, 0, 'x', '#FF9E9E'], [0, 1.7, 0, 'y', '#7FD99A'], [0, 0, 1.7, 'z', '#6FB4FF']]; const O0 = o(0, 0, 0);
            ax.forEach(a => { const E = o(a[0], a[1], a[2]); UI.line(ctx, O0.x, O0.y, E.x, E.y, a[4], 1.2, [4, 3]); UI.text(ctx, a[3], E.x, E.y - 8, a[4], 14, 'center'); });
            let caption = '';
            if (mode === 'p') {
              const vals = q.map(val), rec = vals.map(x => x === Infinity ? 0 : 1 / x);
              if (rec.every(x => x === 0)) { caption = 'En az bir kesişim sonlu olmalı.'; }
              else {
                let poly = []; CUBE_EDGES.forEach(e => { const A = corners[e[0]], B = corners[e[1]], fa = rec[0] * A[0] + rec[1] * A[1] + rec[2] * A[2] - 1, fb = rec[0] * B[0] + rec[1] * B[1] + rec[2] * B[2] - 1; if (Math.abs(fa) < 1e-9) poly.push(A.slice()); if (Math.abs(fb) < 1e-9) poly.push(B.slice()); if (fa * fb < -1e-12) { const t = fa / (fa - fb); poly.push([A[0] + (B[0] - A[0]) * t, A[1] + (B[1] - A[1]) * t, A[2] + (B[2] - A[2]) * t]); } });
                poly = poly.filter((p, i) => poly.findIndex(q => Math.hypot(q[0] - p[0], q[1] - p[1], q[2] - p[2]) < 1e-6) === i); if (poly.length >= 3) { const c = poly.reduce((s2, p) => [s2[0] + p[0] / poly.length, s2[1] + p[1] / poly.length, s2[2] + p[2] / poly.length], [0, 0, 0]); const nrm = rec; let u = [1, 0, 0]; if (Math.abs(nrm[0]) > 0.9 * Math.hypot(...nrm)) u = [0, 1, 0]; const e1 = [nrm[1] * u[2] - nrm[2] * u[1], nrm[2] * u[0] - nrm[0] * u[2], nrm[0] * u[1] - nrm[1] * u[0]], e2 = [nrm[1] * e1[2] - nrm[2] * e1[1], nrm[2] * e1[0] - nrm[0] * e1[2], nrm[0] * e1[1] - nrm[1] * e1[0]];
                  const ang = p => { const d = [p[0] - c[0], p[1] - c[1], p[2] - c[2]]; return Math.atan2(d[0] * e2[0] + d[1] * e2[1] + d[2] * e2[2], d[0] * e1[0] + d[1] * e1[1] + d[2] * e1[2]); }; poly.sort((p1, p2) => ang(p1) - ang(p2));
                  ctx.beginPath(); poly.forEach((p, i) => { const Q = o(...p); i ? ctx.lineTo(Q.x, Q.y) : ctx.moveTo(Q.x, Q.y); }); ctx.closePath(); ctx.fillStyle = 'rgba(245,197,66,.35)'; ctx.fill(); ctx.strokeStyle = '#F5C542'; ctx.lineWidth = 2; ctx.stroke(); }
                vals.forEach((vv, i) => { if (vv !== Infinity) { const p = [0, 0, 0]; p[i] = vv; const Q = o(...p); UI.circle(ctx, Q.x, Q.y, 5, '#fff'); } });
                if (poly.length < 3 || vals.some(x => x < 0)) { const fin = []; vals.forEach((vv, i) => { if (vv !== Infinity) { const p = [0, 0, 0]; p[i] = vv; fin.push(p); } }); const c0 = fin.reduce((a, p) => [a[0] + p[0] / fin.length, a[1] + p[1] / fin.length, a[2] + p[2] / fin.length], [0, 0, 0]); const nn = rec, nl = Math.hypot(...nn); let u = Math.abs(nn[0]) > 0.9 * nl ? [0, 1, 0] : [1, 0, 0]; let e1 = [nn[1] * u[2] - nn[2] * u[1], nn[2] * u[0] - nn[0] * u[2], nn[0] * u[1] - nn[1] * u[0]]; const l1 = Math.hypot(...e1); e1 = e1.map(x => x / l1); let e2 = [nn[1] * e1[2] - nn[2] * e1[1], nn[2] * e1[0] - nn[0] * e1[2], nn[0] * e1[1] - nn[1] * e1[0]]; const l2 = Math.hypot(...e2); e2 = e2.map(x => x / l2); const h = 0.85; ctx.beginPath(); [[1, 1], [1, -1], [-1, -1], [-1, 1]].forEach(([a, b2], i) => { const Q = o(c0[0] + h * (a * e1[0] + b2 * e2[0]), c0[1] + h * (a * e1[1] + b2 * e2[1]), c0[2] + h * (a * e1[2] + b2 * e2[2])); i ? ctx.lineTo(Q.x, Q.y) : ctx.moveTo(Q.x, Q.y); }); ctx.closePath(); ctx.fillStyle = 'rgba(245,197,66,.2)'; ctx.fill(); ctx.setLineDash([5, 4]); ctx.strokeStyle = '#F5C542'; ctx.lineWidth = 1.5; ctx.stroke(); ctx.setLineDash([]); }
                const M = millerPlane(q); caption = `Kesişimler: <b>(${q.map(fstr).join(', ')})</b> → tersleri: (${M.rec.map(r => r[1] === 1 ? r[0] : r[0] + '/' + r[1]).join(', ')}) → paydaları eşitle (× ${M.L}) → <b style="color:#F5C542;font-size:18px">(${M.m.map(bar).join('')})</b>`;
              }
            } else {
              const pt = q.map(x => val(x)).map(x => x === Infinity ? 0 : x); const Z = pt.every(x => x === 0);
              if (!Z) { const E = o(...pt), K = o(0, 0, 0); UI.arrow(ctx, K.x, K.y, E.x, E.y, '#F5C542', 3); UI.circle(ctx, E.x, E.y, 5, '#fff'); }
              const M = millerDir(q); caption = Z ? 'Uç nokta orijin olamaz.' : `Uç nokta: <b>(${q.map(fstr).join(', ')})</b> → paydaları eşitle (× ${M.L}) → en küçük tam sayılar → <b style="color:#F5C542;font-size:18px">[${M.m.map(bar).join('')}]</b>`;
            }
            UI.setCap(w, caption);
          });
          fill(); pre(); [['1', '1/2', '2']].forEach(([x, y, z]) => { sel[0].value = x; sel[1].value = y; sel[2].value = z; });
        }
      },
      {
        id: 'aile', title: 'Düzlem ve doğrultu aileleri: kaç üyesi var?', pg: 's.42-44',
        build(b) {
          b.innerHTML = `<p>Kübik sistemde aynı atom dizilimini gösteren tüm düzlemler/doğrultular bir <b>ailedir</b>. Sınav klasiği: "⟨111⟩ ailesinin kaç üyesi vardır?" Üçlü gir, üyeleri gör.</p>
          <div class="widget"><div class="ctl" style="border:0"><span class="seg" id="fa"><button data-v="100">100</button><button data-v="110">110</button><button data-v="111" class="on">111</button><button data-v="210">210</button></span><span class="seg" id="ft"><button data-v="d" class="on">⟨ ⟩ doğrultu ailesi</button><button data-v="p">{ } düzlem ailesi</button></span></div><div class="cap" style="min-height:90px"></div></div>
          <div class="key"><ul><li>Kitaba göre <b>{100} ailesi 6 üyeli</b>: (100), (010), (001), (1̄00), (01̄0), (001̄) (s.44).</li><li><b>⟨100⟩ = 6, ⟨110⟩ = 12, ⟨111⟩ = 8</b> (işaret ve sıra değişimleri) (s.42).</li></ul></div>`;
          let idx = [1, 1, 1], ty = 'd'; const w = b;
          function show() { const L = family(...idx); const br = ty === 'd' ? ['[', ']'] : ['(', ')']; const ob = ty === 'd' ? ['⟨', '⟩'] : ['{', '}']; UI.setCap(w, `<b>${ob[0]}${idx.join('')}${ob[1]}</b> ailesi: <b style="color:#F5C542">${L.length} üye</b><div class="chips">${L.map(v => `<span class="chip">${br[0]}${v.map(bar).join('')}${br[1]}</span>`).join('')}</div>`); }
          UI.seg(w, '#fa', v => { idx = v.split('').map(Number); show(); }); UI.seg(w, '#ft', v => { ty = v; show(); });
        }
      },
      {
        id: 'dens', title: 'Doğrusal atom yoğunluğu ve yöne bağlılık', pg: 's.38, 45-46',
        build(b) {
          b.innerHTML = `<p>Bir doğrultu boyunca birim uzunluğa kaç atom düşer? Plastik şekillenmede (kayma) atomların en sık dizildiği doğrultular önemlidir.</p>
          <div class="widget drag"><canvas></canvas><div class="ctl"><span class="seg" id="ld"><button data-v="hmk" class="on">HMK [111]</button><button data-v="ymk">YMK [110]</button></span></div><div class="cap" style="font-size:15px"></div></div>
          <div class="key"><ul><li><b>HMK [111]:</b> uzunluk a√3; atom ½ + 1 + ½ = 2 → <b>2/(a√3)</b> (s.45).</li><li><b>YMK [110]:</b> uzunluk a√2; atom ½ + 1 + ½ = 2 → <b>2/(a√2)</b> (s.46).</li><li>YMK'nın doğrusal yoğunluğu HMK'dan <b>büyüktür</b> → YMK <b>plastik şekillenmeye</b> daha yatkın (s.46).</li><li><b>Anizotropi:</b> özelliğin kafes yönüne bağlı olması; <b>izotropi</b> yönden bağımsızlık (s.38). Örnek: Fe'nin E modülü hacim köşegeninde 290, yüz köşegeninde 216, küp yüzüne dik 135 kN/mm². Cu: 190 (hacim köşegeni) ve 66,6 (yüz köşegeni) (s.38).</li></ul></div>`;
          let ty = 'hmk'; UI.seg(b, '#ld', v => ty = v);
          UI.view3d($('canvas', b), 0.62, (ctx, P, s, v) => {
            const C = CELLS[ty], o = ty === 'hmk' ? [[0, 0, 0], [1, 1, 1]] : [[0, 0, 0], [1, 1, 0]];
            const mid = ty === 'hmk' ? [0.5, 0.5, 0.5] : [0.5, 0.5, 0], len = ty === 'hmk' ? Math.sqrt(3) : Math.sqrt(2), pulse = 0.5 + 0.5 * Math.sin(s.t * 3);
            const T = p => P(p[0] - 0.5, p[1] - 0.5, p[2] - 0.5);
            drawCell(ctx, P, C, { size: 0.42, color: it => { if (it.ghost) return null; if (near(it.at.p, o[0]) || near(it.at.p, o[1])) return '#F5C542'; if (near(it.at.p, mid)) return '#F5C542'; return '#364352'; } });
            const A = T(o[0]), B = T(o[1]); UI.line(ctx, A.x, A.y, B.x, B.y, '#FF5A4D', 3); ctx.save(); ctx.setLineDash([]); UI.circle(ctx, A.x + (B.x - A.x) * pulse, A.y + (B.y - A.y) * pulse, 4, '#fff'); ctx.restore();
            UI.text(ctx, ty === 'hmk' ? 'HMK, hacim köşegeni [111]' : 'YMK, yüz köşegeni [110]', 14, 18, '#fff', 15);
            UI.text(ctx, 'atom: ½ + 1 + ½ = 2', 14, s.H - 14, '#F5C542', 14);
            UI.setCap(b, ty === 'hmk' ? 'Uzunluk <b>a√3 ≈ 1,73a</b> · 2 atom → yoğunluk = 2/(1,73a) = <b>1,15/a</b>' : 'Uzunluk <b>a√2 ≈ 1,41a</b> · 2 atom → yoğunluk = 2/(1,41a) = <b>1,41/a</b> (daha yoğun)');
          });
        }
      }
    ]
  };
})();
