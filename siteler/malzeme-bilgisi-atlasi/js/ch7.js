(function () {
  const UI = window.UI, $ = UI.$, $$ = UI.$$;
  const TEAL = '#4FD8CF';
  const sm = (x, a, b) => { const t = UI.clamp((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };
  const CELLS = () => UI.cellData;

  /* ---- çekme eğrileri ---- */
  const E_ST = 2100; // MPa / % (E = 210 GPa)
  function steel(e) {
    if (e <= 300 / E_ST) return E_ST * e;
    if (e < 0.18) return 300 - 40 * sm(e, 300 / E_ST, 0.18);
    if (e < 2.5) return 260 + (e < 2.45 ? 5 * Math.sin(e * 23) : 0) + 2 * sm(e, 2.2, 2.5);
    if (e < 16) { const u = (e - 2.5) / 13.5; return 262 + 158 * (1 - Math.exp(-4.5 * u)) / (1 - Math.exp(-4.5)); }
    if (e <= 28) { const u = (e - 16) / 12; return 420 - 125 * Math.pow(u, 1.7); }
    return 0;
  }
  const ALT = []; for (let s = 0; s <= 300; s += 0.5) ALT.push([s / 700 + 0.2 * Math.pow(s / 180, 8.3), s]);
  function alum(e) {
    if (e > 21) return 0; if (e > 14.5) { const u = (e - 14.5) / 6.5; return 300 - 75 * Math.pow(u, 1.5); }
    for (let i = 1; i < ALT.length; i++) if (ALT[i][0] >= e) { const a = ALT[i - 1], b = ALT[i]; return a[1] + (b[1] - a[1]) * (e - a[0]) / (b[0] - a[0]); } return 300;
  }
  const MAT = {
    steel: { f: steel, E: E_ST, Ag: 16, A: 28, name: 'Düşük karbonlu çelik (belirgin akma)', Z: 0.55 },
    al: { f: alum, E: 700, Ag: 14.5, A: 21, name: 'Alüminyum (belirgin akma yok)', Z: 0.4 }
  };

  window.CH[7] = {
    intro: 'Malzeme yük altında ne yapar? Önce atomik düzeyde kayma ve ikizlenme, sonra elastik özellikler, sonra bütün bir çekme deneyi: akma, çekme dayanımı, boyun verme, kopma. En sonda çekme eğrisinin her noktasını bir deneyle yaşayacaksın.',
    sections: [
      {
        id: 'kayma', title: 'Plastik şekil değişimi: kayma sistemleri', pg: 's.81-86',
        build(b) {
          b.innerHTML = `<p>Metal <b>plastik</b> şekil değiştirirken atom düzlemleri birbiri üzerinde <b>kayar</b>. Kayma, atomların en sık dizildiği <b>düzlemde</b> ve en sık <b>doğrultuda</b> olur. Bir <b>düzlem + doğrultu</b> çiftine <b>kayma sistemi</b> denir.</p>
          <div class="widget drag"><canvas></canvas><div class="ctl"><span class="seg" id="ks"><button data-v="ymk" class="on">YMK</button><button data-v="hmk">HMK</button><button data-v="sdh">SDH</button></span><button class="btn" id="nx">Sonraki kayma sistemi</button></div><div class="cap"></div></div>
          <div class="wrap"><table><tr><th>Kafes</th><th>Düzlem</th><th>Doğrultu</th><th>Kayma sistemi sayısı</th><th>Örnek</th></tr>
          <tr><td>HMK</td><td>{110}</td><td>⟨1̄11⟩</td><td><b>6 × 2 = 12</b></td><td>α-Fe, V, Nb, Ta, Cr, Mo</td></tr>
          <tr><td>YMK</td><td>{111}</td><td>⟨1̄10⟩</td><td><b>4 × 3 = 12</b></td><td>γ-Fe, Cu, Ag, Au, Al, Pb, Ni, Pt</td></tr>
          <tr><td>SDH</td><td>(0001)</td><td>⟨112̄0⟩</td><td><b>1 × 3 = 3</b></td><td>Mg, Zn, Cd, α-Ti</td></tr></table></div>
          <div class="key"><ul><li>Kayma sistemi sayısı: <b>HMK 12, YMK 12, SDH 3</b> (s.84).</li><li><b>YMK'nın plastik şekillenmesi HMK'dan daha iyidir</b>: YMK'da atomların en yoğun olduğu düzlemler ve doğrultular daha yoğun; kayma için gereken kritik gerilme düşük. SDH'da yalnız 3 sistem olduğu için soğuk şekillenmesi zordur (s.84).</li><li><b>İri taneli</b> malzemenin plastik şekillenme kabiliyeti <b>ince taneliden kötüdür</b>; her tanede kayma doğrultusu farklı olduğundan şekil değişimi eşit olmaz (s.86).</li><li>Yüksek sıcaklıkta tane sınırı kayması toplam şekil değişiminin yaklaşık %30'unu getirebilir (s.86).</li><li>Plastik şekil değişimi için en önemli mekanizma: <b>dislokasyon hareketi</b> (kayma) ve <b>ikizlenme</b>.</li></ul></div>`;
          const w = b; let ty = 'ymk', idx = 0;
          const SYS = {
            ymk: { poly: [[[1, 0, 0], [0, 1, 0], [0, 0, 1]], [[0, 0, 0], [1, 1, 0], [1, 0, 1]], [[0, 0, 0], [1, 1, 0], [0, 1, 1]], [[0, 0, 0], [1, 0, 1], [0, 1, 1]]], dir: p => [[p[0], p[1]], [p[1], p[2]], [p[2], p[0]]], n: 12, txt: 'YMK: 4 {111} düzlemi × 3 ⟨110⟩ doğrultusu' },
            hmk: { poly: [[[0, 0, 0], [1, 1, 0], [1, 1, 1], [0, 0, 1]], [[1, 0, 0], [0, 1, 0], [0, 1, 1], [1, 0, 1]], [[0, 0, 0], [1, 0, 0], [1, 1, 1], [0, 1, 1]], [[0, 1, 0], [1, 1, 0], [1, 0, 1], [0, 0, 1]], [[0, 0, 0], [0, 1, 0], [1, 1, 1], [1, 0, 1]], [[1, 0, 0], [1, 1, 0], [0, 1, 1], [0, 0, 1]]], dir: p => [[p[0], p[2]], [p[1], p[3]]], n: 12, txt: 'HMK: 6 {110} düzlemi × 2 ⟨111⟩ doğrultusu' },
            sdh: { poly: [null], dir: () => [], n: 3, txt: 'SDH: 1 bazal (0001) düzlemi × 3 ⟨112̄0⟩ doğrultusu' }
          };
          UI.seg(w, '#ks', v => { ty = v; idx = 0; }); $('#nx', w).onclick = () => idx++;
          UI.view3d($('canvas', w), 0.62, (ctx, P, s, v) => {
            const C = CELLS()[ty], S = SYS[ty], sc = ty === 'sdh' ? 0.8 : 1; const info = drawCellProxy(ctx, P, C, sc);
            const ndir = ty === 'ymk' ? 3 : ty === 'hmk' ? 2 : 3, total = S.n, k = idx % total, pi = Math.floor(k / ndir), di = k % ndir;
            const T = info.T;
            if (ty === 'sdh') { const hx = []; for (let i = 0; i < 6; i++) { const a = i * Math.PI / 3; hx.push([Math.cos(a), Math.sin(a), 0]); } ctx.beginPath(); hx.forEach((p, i) => { const q = T(p); i ? ctx.lineTo(q.x, q.y) : ctx.moveTo(q.x, q.y); }); ctx.closePath(); ctx.fillStyle = 'rgba(79,216,207,.35)'; ctx.fill(); ctx.strokeStyle = TEAL; ctx.lineWidth = 2; ctx.stroke(); const A = T(hx[di]), B = T(hx[di + 3]); UI.arrow(ctx, A.x, A.y, B.x, B.y, '#F5C542', 3); }
            else { const poly = S.poly[pi % S.poly.length]; ctx.beginPath(); poly.forEach((p, i) => { const q = T(p); i ? ctx.lineTo(q.x, q.y) : ctx.moveTo(q.x, q.y); }); ctx.closePath(); ctx.fillStyle = 'rgba(79,216,207,.35)'; ctx.fill(); ctx.strokeStyle = TEAL; ctx.lineWidth = 2; ctx.stroke(); const pr = S.dir(poly)[di % S.dir(poly).length], A = T(pr[0]), B = T(pr[1]); UI.arrow(ctx, A.x, A.y, B.x, B.y, '#F5C542', 3); }
            UI.text(ctx, S.txt, 12, 16, '#fff', 13); UI.text(ctx, `Kayma sistemi ${k + 1} / ${total}`, s.W - 12, 16, TEAL, 14, 'right');
            UI.setCap(w, 'Turkuaz: <b>kayma düzlemi</b> · Sarı ok: <b>kayma doğrultusu</b>. Sistemleri tek tek gez: toplam sayı sınavda sorulur.');
          });
          function drawCellProxy(ctx, P, C, sc) { return UI.drawCell(ctx, P, C, { size: 0.3, s: sc, color: () => '#8E99A6' }); }
        }
      },
      {
        id: 'ikiz', title: 'İkizlenme: kayma ile farkı', pg: 's.84-85',
        build(b) {
          b.innerHTML = `<p>Kayma bir düzlemi <b>tam atom aralığı</b> kadar kaydırır. İkizlenmede kristalin bir bölgesinde <b>her düzlem</b> bir atom aralığından <b>küçük</b> kayar; sonuçta bölge <b>aynadaki görüntüsü</b> gibi yönlenir.</p>
          <div class="widget"><canvas></canvas><div class="ctl"><span class="seg" id="tw"><button data-v="kayma" class="on">Kayma</button><button data-v="ikiz">İkizlenme</button></span><label>Şekil değişimi <input type="range" min="0" max="100" value="0" id="tp"><output></output></label></div><div class="cap"></div></div>
          <div class="key"><ul><li><b>İkizlenme:</b> kristalin bir kısmının şekil değiştirmeden sonra düzleme göre <b>aynadaki görüntüsünü</b> almasıdır; bu düzleme <b>ikiz düzlemi</b> denir (s.84).</li><li>İkizlenmede atomların hareket miktarı <b>atomlar arası uzaklıktan küçük</b>, kayma miktarı ikiz düzleminden uzaklıkla artar. Bu yüzden <b>büyük plastik şekil değişimi sağlanamaz</b> (s.84-85).</li><li>İkizlenme genellikle kayma sistemi az olan (SDH: Zn, Mg, Ti) veya düşük sıcaklıkta/hızlı yüklemede HMK metallerde görülür.</li><li>Kayma izleri <b>ince çizgi</b>, ikizlenme izleri <b>kalın çizgi</b>dir (s.85).</li></ul></div>`;
          let mo = 'kayma', p = 0; UI.seg(b, '#tw', v => mo = v); UI.bind(b, '#tp', v => p = v / 100, v => v + '%');
          UI.loop($('canvas', b), 0.5, (ctx, W, H) => {
            const cols = 14, rows = 10, s = Math.min(W / (cols + 2), H / (rows + 1)), ox = W / 2 - (cols - 1) * s / 2, oy = H / 2 - (rows - 1) * s / 2 * 0.9, r1 = 3, r2 = 6;
            for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) { let sh = 0, col = '#6FB4FF';
              if (mo === 'kayma') { if (r <= r2) sh = p * 1.0; if (r === r2) col = '#F5C542'; }
              else { if (r >= r1 && r <= r2) { sh = p * 0.32 * (r - r1) ; col = '#FFA95C'; } else if (r > r2) sh = p * 0.32 * (r2 - r1); }
              const x = ox + (c + sh + (r % 2) * 0.0) * s - (mo === 'kayma' ? 0 : 0), y = oy + r * s * 0.9; UI.atom(ctx, x, y, s * 0.3, col); }
            if (mo === 'kayma') { UI.line(ctx, ox - s, oy + r2 * s * 0.9 + s * 0.45, ox + cols * s, oy + r2 * s * 0.9 + s * 0.45, '#F5C542', 1.5, [5, 4]); UI.text(ctx, 'kayma düzlemi: üst blok tam bir atom aralığı kayar', 12, 16, '#fff', 13); }
            else { UI.line(ctx, ox - s, oy + (r1 - 0.5) * s * 0.9, ox + cols * s, oy + (r1 - 0.5) * s * 0.9, '#FFA95C', 1.5, [5, 4]); UI.line(ctx, ox - s, oy + (r2 + 0.5) * s * 0.9, ox + cols * s, oy + (r2 + 0.5) * s * 0.9, '#FFA95C', 1.5, [5, 4]); UI.text(ctx, 'ikiz bölgesi: her düzlem farklı miktarda (uzaklıkla artan) kayar', 12, 16, '#fff', 13); }
          });
          UI.setCap(b, 'Kayma: tek düzlemde <b>1 atom aralığı</b> (büyük şekil değişimi için çok kez tekrar). İkizlenme: çok düzlemde <b>kesirli kayma</b> (toplamda küçük şekil değişimi).');
        }
      },
      {
        id: 'gerilme', title: 'Gerilme ve gerinim', pg: 's.86-87',
        build(b) {
          b.innerHTML = `<p><b>Gerilme</b>, birim alana etki eden kuvvettir. Kuvvet yüzeye <b>dik</b> ise <b>normal gerilme σ</b>, yüzeye <b>paralel</b> ise <b>kayma gerilmesi τ</b>.</p>
          <div class="widget"><canvas></canvas><div class="ctl"><span class="seg" id="gm"><button data-v="n" class="on">Normal (çekme)</button><button data-v="k">Kayma</button></span><label>Kuvvet F <input type="range" min="0" max="100" value="40" id="fk"><output></output></label><label>Alan S <input type="range" min="20" max="100" value="50" id="sk"><output></output></label></div><div class="cap"></div></div>
          <div class="key"><ul><li><b>σ = F / S</b> (N/mm²) (kuvvet alana dik). <b>τ = F<sub>s</sub> / S</b> (kuvvet alana paralel) (s.86).</li><li><b>Gerinim ε = ΔL / L<sub>0</sub></b> (birimsiz, ya da %). Kayma gerinimi: γ (açı değişimi) (s.87).</li><li>Aynı F'de alan küçülürse gerilme <b>artar</b>: ince çubuk daha çok zorlanır.</li></ul></div>`;
          let mo = 'n', F = 40, S = 50; UI.seg(b, '#gm', v => mo = v); UI.bind(b, '#fk', v => F = v, v => v + ' kN'); UI.bind(b, '#sk', v => S = v, v => v * 10 + ' mm²');
          UI.loop($('canvas', b), 0.42, (ctx, W, H, st) => {
            const cx = W * 0.36, cy = H / 2, w0 = 14 + S * 1.1, h0 = 80, sig = F * 1000 / (S * 10), eps = Math.min(0.35, sig / 1500);
            if (mo === 'n') { const h = h0 * (1 + eps), w = w0 * (1 - 0.3 * eps); UI.roundRect(ctx, cx - w / 2, cy - h / 2, w, h, 4, '#2c4a5e', '#6FB4FF'); UI.arrow(ctx, cx, cy - h / 2 - 4, cx, cy - h / 2 - 4 - 18 - F * 0.5, '#FF9E9E', 3); UI.arrow(ctx, cx, cy + h / 2 + 4, cx, cy + h / 2 + 4 + 18 + F * 0.5, '#FF9E9E', 3); UI.text(ctx, 'F', cx + 12, cy - h / 2 - 20, '#FF9E9E', 14); UI.text(ctx, 'ΔL', cx + w / 2 + 14, cy - h0 / 2 - (h - h0) / 2 + 12, '#F5C542', 12); UI.line(ctx, cx - w / 2 - 14, cy - h0 / 2, cx - w / 2 - 14, cy + h0 / 2, '#8E99A6', 1, [3, 3]); }
            else { const k = eps * 1.6, w = w0 * 1.4, h = h0 * 0.8; ctx.beginPath(); ctx.moveTo(cx - w / 2 + k * h / 2, cy - h / 2); ctx.lineTo(cx + w / 2 + k * h / 2, cy - h / 2); ctx.lineTo(cx + w / 2 - k * h / 2, cy + h / 2); ctx.lineTo(cx - w / 2 - k * h / 2, cy + h / 2); ctx.closePath(); ctx.fillStyle = '#2c4a5e'; ctx.fill(); ctx.strokeStyle = '#6FB4FF'; ctx.lineWidth = 2; ctx.stroke(); UI.arrow(ctx, cx - w / 2 + k * h / 2 - 20, cy - h / 2 - 6, cx + w / 2 + k * h / 2 + 20 + F * 0.4, cy - h / 2 - 6, '#FF9E9E', 3); UI.text(ctx, 'F', cx + 12, cy - h / 2 - 22, '#FF9E9E', 14); UI.text(ctx, 'γ', cx + w / 2 + 12, cy, '#F5C542', 14); }
            UI.text(ctx, mo === 'n' ? `σ = F/S = ${(F * 1000).toLocaleString('tr')} N / ${S * 10} mm² = ${sig.toFixed(1)} N/mm²` : `τ = F/S = ${(F * 1000).toLocaleString('tr')} N / ${S * 10} mm² = ${sig.toFixed(1)} N/mm²`, W * 0.46, H / 2 - 20, '#F5C542', 15);
            UI.text(ctx, mo === 'n' ? 'Kuvvet alana DİK → normal gerilme σ' : 'Kuvvet alana PARALEL → kayma gerilmesi τ', W * 0.46, H / 2 + 14, '#C9D0D8', 14);
          });
        }
      },
      {
        id: 'hooke', title: 'Elastik bölge: Hooke, E, rezilyans, Poisson', pg: 's.87-91',
        build(b) {
          b.innerHTML = `<p>Yük küçükken şekil değişimi <b>geri döner</b> (elastik). Gerilme ile gerinim <b>orantılıdır</b>: <b>σ = E·ε</b>. E ne kadar büyükse malzeme o kadar <b>rijit</b>. Malzemeyi seç, aynı gerilmeyi uygula.</p>
          <div class="widget"><canvas></canvas><div class="ctl"><span class="seg" id="hm"><button data-v="210" class="on">Çelik (210)</button><button data-v="125">Bakır (125)</button><button data-v="72">Alüminyum (72)</button><button data-v="45">Magnezyum (45)</button></span><label>Gerilme σ <input type="range" min="0" max="200" value="100" id="hs"><output></output></label><label>Elastiklik sınırı <input type="range" min="40" max="200" value="140" id="he"><output></output></label></div><div class="cap"></div></div>
          <div class="key"><ul><li><b>Hooke kanunu: σ = E·ε</b>; E = tan α = Δσ/Δε, Hooke doğrusunun eğimi. Elastisite modülü = <b>Young modülü</b> (s.88).</li><li>Çelik için E ≈ <b>210 GPa</b> (kN/mm²) (s.89). Aynı yük altında Fe'nin gerinimi 0,1 ise Al'ninki yaklaşık 0,3 olur: <b>E büyükse rijitlik büyük</b>.</li><li>E <b>kafes yönüne</b> bağlıdır (anizotropi); Fe'de hacim köşegeni yönünde yüksek, küp yüzüne dik yönde düşüktür (s.38, 88).</li><li><b>Rezilyans:</b> elastik şekil değişiminde absorbe edilen enerjiyi kuvvet kalkınca <b>geri verme</b> özelliği. Hooke doğrusu altında, <b>elastiklik sınırına (R<sub>e</sub>) kadar kalan alan</b> ile ölçülür. <b>Yay çeliklerinde rezilyans büyük</b> istenir (s.89).</li><li><b>Kayma modülü G:</b> τ = G·γ; <b>E = 2(1+μ)G ≈ 2,6 G</b> (s.90).</li><li><b>Poisson sayısı μ:</b> enine gerinimin boyuna gerinime oranı; metallerde ≈ <b>0,3</b> (s.90-91).</li></ul></div>
          <h3>Poisson: boyu uzayan kesiti daralır</h3>
          <div class="widget"><canvas></canvas><div class="ctl"><label>Poisson sayısı μ <input type="range" min="0" max="50" value="30" id="mu"><output></output></label><label>Boyuna gerinim <input type="range" min="0" max="30" value="20" id="ls"><output></output></label></div><div class="cap"></div></div>`;
          const w = b, cv = $$('canvas', b); let E = 210, sg = 100, se = 140, mu = 0.3, ls = 0.2;
          UI.seg(w, '#hm', v => E = +v); UI.bind(w, '#hs', v => sg = v, v => v + ' MPa'); UI.bind(w, '#he', v => se = v, v => v + ' MPa');
          const COLS = { 210: '#4FD8CF', 125: '#FFA95C', 72: '#C9D0D8', 45: '#C79CFF' };
          UI.loop(cv[0], 0.52, (ctx, W, H, st) => {
            const L = 56, R = W * 0.62, tp = 18, bt = H - 30, emax = 0.5, X = e => L + e / emax * (R - L), Y = s2 => bt - s2 / 220 * (bt - tp);
            UI.line(ctx, L, bt, R, bt, '#3a4654', 1); UI.line(ctx, L, tp, L, bt, '#3a4654', 1); UI.text(ctx, 'σ (MPa)', L + 4, 10, '#8E99A6', 11); UI.text(ctx, 'ε (%)', R, bt + 14, '#8E99A6', 11, 'right');
            [210, 125, 72, 45].forEach(e => { ctx.beginPath(); ctx.moveTo(L, bt); ctx.lineTo(X(Math.min(emax, 220 / (e * 1000) * 100)), Y(Math.min(220, emax * e * 1000 / 100))); ctx.strokeStyle = e === E ? COLS[e] : 'rgba(255,255,255,.18)'; ctx.lineWidth = e === E ? 3 : 1.5; ctx.stroke(); });
            const ee = sg / (E * 1000) * 100, ese = se / (E * 1000) * 100; ctx.beginPath(); ctx.moveTo(L, bt); ctx.lineTo(X(Math.min(ese, emax)), Y(Math.min(se, 220))); ctx.lineTo(X(Math.min(ese, emax)), bt); ctx.closePath(); ctx.fillStyle = 'rgba(79,216,207,.2)'; ctx.fill();
            UI.text(ctx, 'rezilyans (alan)', X(ese * 0.6), Y(se * 0.3), '#4FD8CF', 11); UI.line(ctx, X(Math.min(ese, emax)), Y(Math.min(se, 220)), X(Math.min(ese, emax)), bt, '#4FD8CF', 1, [3, 3]);
            UI.circle(ctx, X(Math.min(ee, emax)), Y(Math.min(sg, 220)), 6, '#fff');
            const bx = R + 40, bw = W - bx - 16, L0 = Math.max(60, Math.min(110, W - bx - 60)); UI.text(ctx, 'Aynı σ, aynı çubuk', bx, 14, '#8E99A6', 12);
            [[210, 'Çelik'], [E === 210 ? 72 : E, E === 210 ? 'Alüminyum' : (E === 125 ? 'Bakır' : E === 72 ? 'Alüminyum' : 'Magnezyum')]].forEach((m, i) => { const y = 48 + i * 60, e2 = sg / (m[0] * 1000) * 20000; UI.roundRect(ctx, bx, y, Math.min(bw, L0 + e2), 14, 4, i ? COLS[E === 210 ? 72 : E] : COLS[210]); UI.text(ctx, m[1] + ' · ε = ' + (sg / (m[0] * 1000) * 100).toFixed(3) + ' %', bx, y + 28, '#C9D0D8', 12); });
            UI.text(ctx, `E = ${E} GPa`, bx, H - 34, '#F5C542', 15); UI.text(ctx, `σ = ${sg} MPa ${sg > se ? '> R_e: plastik bölgeye geçildi!' : '(elastik)'}`, bx, H - 14, sg > se ? '#FF5A4D' : '#7FD99A', 12);
          });
          UI.setCap($$('.widget', w)[0], 'Eğim <b>E</b>: çelik en dik, Mg en yatık. Aynı gerilmede çelik en az uzar. Mavi alan: elastik şekil değişiminde depolanan enerji (rezilyans = σ<sub>e</sub>²/2E).');
          UI.bind(w, '#mu', v => mu = v / 100, v => (v / 100).toFixed(2)); UI.bind(w, '#ls', v => ls = v / 100, v => '%' + v / 10);
          UI.loop(cv[1], 0.4, (ctx, W, H) => {
            const cy = H / 2, L0 = W * 0.28, h0 = 54, e1 = ls * 0.1, bx = W * 0.1;
            UI.roundRect(ctx, bx, cy - h0 / 2, L0, h0, 4, null, 'rgba(255,255,255,.3)'); UI.roundRect(ctx, bx, cy - h0 / 2 * (1 - mu * e1 * 10), L0 * (1 + e1 * 10), h0 * (1 - mu * e1 * 10), 4, '#2c4a5e', TEAL);
            UI.arrow(ctx, bx + L0 * (1 + e1 * 10) + 4, cy, bx + L0 * (1 + e1 * 10) + 40, cy, '#FF9E9E', 3); UI.arrow(ctx, bx - 4, cy, bx - 40, cy, '#FF9E9E', 3);
            const G = 210 / (2 * (1 + mu)); UI.text(ctx, `ε_enine = −μ·ε_boyuna = ${(-mu * e1 * 100).toFixed(2)} %`, W * 0.52, H * 0.34, '#F5C542', 15);
            UI.text(ctx, `E = 2(1+μ)·G → G = ${G.toFixed(0)} GPa  (E = 210 alınırsa; E/G ≈ ${(2 * (1 + mu)).toFixed(2)})`, W * 0.52, H * 0.54, '#C9D0D8', 13); UI.text(ctx, mu > 0.45 ? 'μ ≈ 0,5: hacim değişmez (kauçuk gibi)' : 'metallerde μ ≈ 0,3', W * 0.52, H * 0.74, '#8E99A6', 12);
          });
          UI.setCap($$('.widget', w)[1], 'Noktalı çerçeve: gerilmeden önceki hal (şekildeki değişim 10 kat abartıldı). Boyu uzayan çubuğun <b>kesiti daralır</b>; oran Poisson sayısıdır.');
        }
      },
      {
        id: 'cekme', title: 'Çekme deneyi: σ–ε diyagramı', pg: 's.91-97',
        build(b) {
          b.innerHTML = `<p>Bir numuneyi koparana kadar çekiyoruz. Kaydırıcıyı sürükle; numuneye ve eğriye <b>aynı anda</b> bak. Her önemli nokta bir sınav sorusu.</p>
          <div class="widget"><canvas></canvas><div class="ctl"><span class="seg" id="tm"><button data-v="steel" class="on">Çelik</button><button data-v="al">Alüminyum</button></span><label>Şekil değişimi ε <input type="range" min="0" max="3000" value="0" id="te"><output></output></label><button class="btn" id="tp">Otomatik çek</button><button class="btn" id="tu">Yükü kaldır</button><label><input type="checkbox" id="tl" checked> Noktaları göster</label></div><div class="cap" style="font-size:15px"></div></div>
          <div class="key"><ul><li><b>Orantı/elastiklik sınırı</b>: Hooke doğrusunun bittiği nokta. Altında yük kalkınca şekil geri döner (s.92).</li><li><b>Akma sınırı R<sub>e</sub>:</b> kalıcı şekillenmeyi başlatan gerilme. Belirgin akmada: <b>R<sub>eH</sub> (üst akma)</b> ve <b>R<sub>eL</sub> (alt akma)</b>; belirgin değilse <b>R<sub>p0,2</sub></b> (%0,2 kalıcı uzamaya karşılık gelen gerilme) (s.92).</li><li><b>Çekme dayanımı R<sub>m</sub>:</b> malzemenin kopmadan dayandığı <b>en büyük gerilme</b>, eğrinin tepe noktası (s.95).</li><li><b>Üniform uzama A<sub>g</sub>:</b> R<sub>m</sub> noktasına kadar numunenin <b>her yerinde eşit</b> uzama; sonrasında <b>boyun verme</b> başlar (s.96-97). <b>A<sub>g</sub> = 2A<sub>11,3</sub> − A</b> (s.97).</li><li><b>Kopma uzaması A:</b> A = (L<sub>u</sub> − L<sub>0</sub>)/L<sub>0</sub> · 100; standart numunede <b>L<sub>0</sub> = 5d<sub>0</sub></b> (A<sub>5</sub>) ya da <b>L<sub>0</sub> = 5,65√S<sub>0</sub></b> (A<sub>5,65</sub>); orantılı olmayanlarda ölçü boyu indisle yazılır: A<sub>11,3</sub>, A<sub>80mm</sub> (s.95-96).</li><li><b>Kopma büzülmesi Z</b> = (S<sub>0</sub> − S<sub>u</sub>)/S<sub>0</sub> · 100 (s.96). Çekme eğrisi <b>mühendislik gerilmesi</b> (F/S<sub>0</sub>) ile çizildiği için boyun verince eğri düşer, oysa gerçek gerilme artar.</li></ul></div>`;
          const w = b; let M = MAT.steel, mkey = 'steel', e = 0, play = false, unl = false, labels = true, ST = null;
          const sl = $('#te', w); UI.seg(w, '#tm', v => { mkey = v; M = MAT[v]; e = 0; sl.value = 0; unl = false; });
          sl.addEventListener('input', () => { e = sl.value / 100; play = false; unl = false; }); $('#tp', w).onclick = () => { play = !play; if (play && e >= M.A) { e = 0; } unl = false; };
          $('#tu', w).onclick = () => { unl = !unl; play = false; }; $('#tl', w).onchange = ev => labels = ev.target.checked;
          const S0 = 78.5;
          function drawSpec(ctx, x0, y0, L0, h0, e) {
            const u = e < M.Ag ? 1 : 0, L = L0 * (1 + Math.min(e, M.Ag) / 100) + (e > M.Ag ? L0 * (e - M.Ag) / 100 * 0.5 : 0), dia = h0 / Math.sqrt(1 + Math.min(e, M.Ag) / 100) * 0.95;
            const neck = e > M.Ag ? Math.pow(UI.clamp((e - M.Ag) / (M.A - M.Ag), 0, 1), 1.2) * (1 - Math.sqrt(1 - M.Z)) : 0, broke = e >= M.A * 0.999;
            ctx.fillStyle = '#26323d'; UI.roundRect(ctx, x0 - 42, y0 - h0 * 0.9, 42, h0 * 1.8, 5, '#3a4654'); UI.roundRect(ctx, x0 + L, y0 - h0 * 0.9, 42, h0 * 1.8, 5, '#3a4654');
            const xs = []; const prof = x => dia * (1 - neck * Math.exp(-Math.pow((x - 0.5) / 0.09, 2)));
            const gap = broke ? 26 : 0;
            ctx.beginPath(); for (let i = 0; i <= 50; i++) { const t = i / 50; if (broke && t > 0.5) break; const x = x0 + t * L - (broke ? gap / 2 : 0), y = y0 - prof(t) / 2; i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); }
            if (broke) { ctx.lineTo(x0 + L / 2 - gap / 2, y0); } for (let i = broke ? 25 : 50; i >= 0; i--) { const t = i / 50, x = x0 + t * L - (broke ? gap / 2 : 0), y = y0 + prof(t) / 2; ctx.lineTo(x, y); } ctx.closePath(); const g = ctx.createLinearGradient(0, y0 - dia / 2, 0, y0 + dia / 2); g.addColorStop(0, '#8E99A6'); g.addColorStop(0.5, '#E8ECF0'); g.addColorStop(1, '#6a7785'); ctx.fillStyle = g; ctx.fill();
            if (broke) { ctx.beginPath(); for (let i = 25; i <= 50; i++) { const t = i / 50, x = x0 + t * L + gap / 2, y = y0 - prof(t) / 2; i === 25 ? ctx.moveTo(x, y) : ctx.lineTo(x, y); } for (let i = 50; i >= 25; i--) { const t = i / 50, x = x0 + t * L + gap / 2, y = y0 + prof(t) / 2; ctx.lineTo(x, y); } ctx.closePath(); ctx.fillStyle = g; ctx.fill(); }
            [0.18, 0.82].forEach(t => { const x = x0 + t * L + (broke ? (t < 0.5 ? -gap / 2 : gap / 2) : 0); UI.line(ctx, x, y0 - h0 * 0.62, x, y0 - h0 * 0.52, '#F5C542', 2); UI.line(ctx, x, y0 + h0 * 0.52, x, y0 + h0 * 0.62, '#F5C542', 2); });
            UI.text(ctx, 'L₀', x0 + L * 0.5, y0 - h0 * 0.85, '#F5C542', 12, 'center');
            if (mkey === 'steel' && e > 0.15 && e < 2.5) { const p = UI.clamp((e - 0.15) / 2.3, 0, 1), xf = x0 + 0.18 * L + p * 0.64 * L; ctx.fillStyle = 'rgba(255,169,92,.25)'; ctx.fillRect(x0 + 0.18 * L, y0 - dia / 2, p * 0.64 * L, dia); UI.line(ctx, xf, y0 - dia / 2 - 4, xf + 8, y0 + dia / 2 + 4, '#FFA95C', 2); UI.text(ctx, 'Lüders bandı ilerliyor', xf, y0 - h0 * 0.95, '#FFA95C', 12, 'center'); }
          }
          UI.loop($('canvas', w), 0.62, (ctx, W, H, st) => {
            if (play) { e += st.dt * (M.A / 9) * (mkey === 'steel' && e < 3 ? 0.35 : 1); if (e >= M.A + 0.3) { e = M.A + 0.3; play = false; } sl.value = e * 100; }
            const f = M.f, ef = Math.min(e, M.A + 0.3), sig = ef <= M.A ? f(ef) : 0;
            const sp = H * 0.34; drawSpec(ctx, W * 0.22, H * 0.17, W * 0.5, 22, ef);
            const L = 56, R = W - 18, tp = H * 0.33 + 14, bt = H - 28, X = x => L + x / 32 * (R - L), Y = s2 => bt - s2 / 480 * (bt - tp);
            UI.line(ctx, L, bt, R, bt, '#3a4654', 1); UI.line(ctx, L, tp, L, bt, '#3a4654', 1); UI.text(ctx, 'σ = F/S₀  (MPa)', L + 4, tp - 6, '#8E99A6', 11); UI.text(ctx, 'ε (%)', R, bt + 14, '#8E99A6', 11, 'right');
            const pts = []; for (let x = 0; x <= M.A + 0.001; x += 0.03) pts.push([x, f(x)]);
            ctx.beginPath(); pts.forEach((p, i) => i ? ctx.lineTo(X(p[0]), Y(p[1])) : ctx.moveTo(X(p[0]), Y(p[1]))); ctx.strokeStyle = 'rgba(255,255,255,.18)'; ctx.lineWidth = 2; ctx.stroke();
            ctx.beginPath(); let first = true; pts.forEach(p => { if (p[0] <= ef) { first ? ctx.moveTo(X(p[0]), Y(p[1])) : ctx.lineTo(X(p[0]), Y(p[1])); first = false; } }); ctx.strokeStyle = TEAL; ctx.lineWidth = 3; ctx.stroke();
            const E = M.E; if (unl && sig > 0) { const ep = ef - sig / E; ctx.beginPath(); ctx.moveTo(X(ef), Y(sig)); ctx.lineTo(X(ep), bt); ctx.strokeStyle = '#F5C542'; ctx.lineWidth = 2; ctx.setLineDash([5, 4]); ctx.stroke(); ctx.setLineDash([]); UI.text(ctx, `kalıcı uzama ε_p = ${ep.toFixed(2)} %`, X(ep) + 6, bt - 10, '#F5C542', 12); }
            if (ef <= M.A) UI.circle(ctx, X(ef), Y(sig), 6, '#fff'); else { UI.circle(ctx, X(M.A), Y(f(M.A * 0.999)), 6, '#FF5A4D'); UI.text(ctx, 'KOPMA', X(M.A) - 6, Y(f(M.A * 0.999)) - 14, '#FF5A4D', 13, 'right'); }
            if (labels) {
              const mk = (x, y, t, col, dx, dy) => { UI.circle(ctx, X(x), Y(y), 3.5, col); UI.text(ctx, t, X(x) + (dx || 8), Y(y) + (dy || -10), col, 12); };
              if (mkey === 'steel') { mk(300 / E_ST, 300, (W < 520 ? 'R_eH' : 'R_eH (üst akma)'), '#FF9E9E', 10, -12); mk(0.18, 260, (W < 520 ? 'R_eL' : 'R_eL (alt akma)'), '#FFA95C', 12, 14); UI.line(ctx, X(0.18), Y(262), X(2.5), Y(262), 'rgba(255,169,92,.6)', 4); UI.text(ctx, W < 520 ? 'Lüders' : 'Lüders bölgesi (sabit gerilmede akma)', X(0.4), Y(262) + 30, '#FFA95C', 11); mk(16, 420, (W < 520 ? 'R_m' : 'R_m (çekme dayanımı)'), '#F5C542', (W < 520 ? -34 : -150), -12); UI.line(ctx, X(16), Y(420), X(16), bt, 'rgba(245,197,66,.5)', 1, [3, 3]); UI.text(ctx, 'A_g', X(16), bt + 12, '#F5C542', 12, 'center'); UI.text(ctx, 'A', X(28), bt + 12, '#FF5A4D', 12, 'center'); }
              else { mk(0.2 + 180 / 700, 180, 'R_p0,2', '#FF9E9E', 10, -12); UI.line(ctx, X(0.2), bt, X(0.2 + 300 / 700), Y(300), 'rgba(255,158,158,.4)', 1, [4, 4]); mk(14.5, 300, 'R_m', '#F5C542', -48, -12); UI.line(ctx, X(14.5), Y(300), X(14.5), bt, 'rgba(245,197,66,.5)', 1, [3, 3]); UI.text(ctx, 'A_g', X(14.5), bt + 12, '#F5C542', 12, 'center'); UI.text(ctx, 'A', X(21), bt + 12, '#FF5A4D', 12, 'center'); }
            }
            const F = sig * S0 / 1000; let ph; if (ef > M.A) ph = 'KOPTU'; else if (mkey === 'steel') ph = ef <= 300 / E_ST ? 'Elastik bölge (Hooke)' : ef < 2.5 ? 'AKMA: Lüders bölgesi, gerilme ≈ sabit' : ef < 16 ? 'Pekleşme (üniform uzama)' : 'BOYUN VERME: kuvvet düşüyor'; else ph = ef < 0.43 ? 'Elastik bölge (Hooke)' : ef < 14.5 ? (sig > 180 ? 'Plastik: pekleşme (belirgin akma yok)' : 'Elastik-plastik geçiş') : 'BOYUN VERME';
            let msg = `<b>${ph}</b> · σ = ${sig.toFixed(0)} MPa · ε = ${ef.toFixed(2)} % · F = ${F.toFixed(1)} kN (S₀ = 78,5 mm²)`;
            if (ef > M.A) { const Z = M.Z * 100; msg += `<br>Kopma uzaması <b>A = ${M.A} %</b> · kopma büzülmesi <b>Z ≈ ${Z.toFixed(0)} %</b> · üniform uzama <b>A<sub>g</sub> = ${M.Ag} %</b> (boyun öncesi)`; }
            UI.setCap(w, msg);
          });
        }
      },
      {
        id: 'akma', title: 'Akma neden bir anda olur? Kottrel atmosferi ve Lüders', pg: 's.92-94',
        build(b) {
          b.innerHTML = `<p>Düşük karbonlu çelikte C ve N gibi <b>arayer atomları</b> dislokasyon çekirdeğinin çevresinde toplanır (<b>Kottrel atmosferi</b>) ve dislokasyonu <b>kilitler</b>. Kilidi kırmak için gereken yüksek gerilme <b>R<sub>eH</sub></b>; kilit kırılınca dislokasyon daha düşük gerilmeyle (<b>R<sub>eL</sub></b>) kayar. Gerilmeyi yavaşça artır.</p>
          <div class="widget"><canvas></canvas><div class="ctl"><label>Gerilme σ <input type="range" min="0" max="100" value="0" id="ks"><output></output></label><button class="btn" id="kr">Sıfırla</button></div><div class="cap"></div></div>
          <div class="key"><ul><li><b>Kottrel atmosferi:</b> arayer atomlarının (C, N) dislokasyon çevresinde toplanıp onları <b>kilitlemesi</b>. Akma düzensizliğinin başlıca nedeni <b>çözünmüş azot atomları</b> (s.92).</li><li>Kilit kırılınca gerilme düşer (R<sub>eH</sub> → R<sub>eL</sub>). Akma <b>numunenin bir ucundan başlayıp ilerleyen Lüders bandı</b> boyunca sabit gerilmede olur; <b>Lüders uzaması</b> bu bölgedeki toplam uzamadır (s.92).</li><li><b>PLC (Portevin–Le Chatelier) etkisi:</b> yabancı atomlar hareket eden dislokasyonları <b>tekrar tekrar yakalayıp kilitler</b> → eğride <b>tırtıllanma</b>. Koşul: yabancı atomun difüzyon hızı dislokasyon hızından yüksek olmalı (düşük şekil değiştirme hızı ve uygun sıcaklık) (s.93-94).</li></ul></div>
          <h3>PLC etkisi: tırtıllı eğri ne zaman oluşur?</h3>
          <div class="widget"><canvas></canvas><div class="ctl"><label>Şekil değiştirme hızı <input type="range" min="0" max="100" value="30" id="pr"><output></output></label><label>Sıcaklık <input type="range" min="0" max="100" value="55" id="pt"><output></output></label></div><div class="cap"></div></div>`;
          const w = b, cv = $$('canvas', b); let sg = 0, xd = 0.12; $('#kr', w).onclick = () => { sg = 0; xd = 0.12; $('#ks', w).value = 0; }; UI.bind(w, '#ks', v => { if (v < 100) sg = v; }, v => v < 50 ? v + ' (<R_eH)' : v + '');
          const R = (function () { let s = 3; return () => { s = (s * 16807) % 2147483647; return s / 2147483647; }; })(); const dots = Array.from({ length: 34 }, () => ({ a: R() * 6.28, r: 0.15 + R() * 0.6, p: R() * 6 }));
          let freed = false;
          UI.loop(cv[0], 0.5, (ctx, W, H, st) => {
            const REH = 70, REL = 50, cols = 12, s = Math.min(W / (cols + 2), H / 7), ox = W * 0.12, oy = H * 0.5 - 2.5 * s;
            const stv = parseFloat($('#ks', w).value); if (!freed && stv >= REH) freed = true; if (freed && stv < 25) { freed = false; xd = 0.12; }
            if (freed) xd = Math.min(cols - 1.2, xd + st.dt * (stv > REL ? 3.2 : 0.2));
            for (let r = 0; r < 5; r++) for (let c = 0; c < cols; c++) { const near = Math.abs(c - xd * 1) < 0.9, top = r < 2; if (c === Math.round(xd) && r === 2 && false) continue; let x = ox + c * s, y = oy + r * s, dis = Math.exp(-Math.pow((c - xd) / 1.5, 2)); if (r <= 1) y += dis * s * 0.18; UI.atom(ctx, x, y, s * 0.3, '#6FB4FF'); }
            const cx = ox + xd * s, cy = oy + s * 1.5; UI.text(ctx, '⊥', cx, cy, '#FF2D20', 26, 'center');
            const atm = freed ? 0.1 : 1;
            dots.forEach((d, i) => { const ax = (freed ? ox + 0.12 * s + 0 : cx) + Math.cos(d.a + st.t * 0.6) * s * d.r * 1.6 * (1.5 - atm * 0.5) + Math.sin(st.t * 2 + d.p) * 2, ay = cy + Math.sin(d.a + st.t * 0.6) * s * d.r * 1.1; UI.circle(ctx, ax, ay, 3.2, '#F5C542'); });
            if (freed) UI.text(ctx, 'atmosfer geride kaldı', ox + 0.12 * s, cy - s * 1.1, '#F5C542', 12, 'center'); else UI.text(ctx, 'Kottrel atmosferi (sarı: C, N atomları)', cx, cy - s * 1.2, '#F5C542', 12, 'center');
            UI.arrow(ctx, W * 0.85, oy - 20, W * 0.85 - 40 - stv * 0.4, oy - 20, '#fff', 2 + stv / 30); UI.text(ctx, 'σ', W * 0.85 + 8, oy - 20, '#fff', 14);
            const Lg = W * 0.08, Rg = W * 0.92, by = H - 24; UI.roundRect(ctx, Lg, by - 8, Rg - Lg, 12, 6, null, '#3a4654'); UI.roundRect(ctx, Lg, by - 8, (Rg - Lg) * stv / 100, 12, 6, freed ? '#FFA95C' : '#4FD8CF'); UI.line(ctx, Lg + (Rg - Lg) * 0.7, by - 14, Lg + (Rg - Lg) * 0.7, by + 10, '#FF9E9E', 2); UI.text(ctx, 'R_eH', Lg + (Rg - Lg) * 0.7, by + 18, '#FF9E9E', 11, 'center'); UI.line(ctx, Lg + (Rg - Lg) * 0.5, by - 14, Lg + (Rg - Lg) * 0.5, by + 10, '#FFA95C', 2); UI.text(ctx, 'R_eL', Lg + (Rg - Lg) * 0.5, by + 18, '#FFA95C', 11, 'center');
            UI.setCap($$('.widget', w)[0], !freed ? (stv < REH ? 'Dislokasyon <b>atmosfer tarafından kilitli</b>: gerilme R_eH\'ye ulaşana kadar kıpırdamaz.' : '') : (stv > REL ? 'Kilit koptu, dislokasyon <b>R_eL</b> gibi daha düşük gerilmede ilerliyor.' : 'Dislokasyon durdu; gerilmeyi düşürmek akmayı yavaşlatır.'));
          });
          let rate = 0.3, tmp = 0.55; UI.bind(w, '#pr', v => rate = v / 100, v => ['çok düşük', 'düşük', 'orta', 'yüksek', 'çok yüksek'][Math.min(4, Math.floor(v / 20))]); UI.bind(w, '#pt', v => tmp = v / 100, v => Math.round(20 + v * 3) + ' °C');
          UI.loop(cv[1], 0.4, (ctx, W, H, st) => {
            const L = 50, Rr = W - 14, tp = 16, bt = H - 26, X = e => L + e / 10 * (Rr - L), Y = s2 => bt - (s2 - 100) / 300 * (bt - tp);
            UI.line(ctx, L, bt, Rr, bt, '#3a4654', 1); UI.line(ctx, L, tp, L, bt, '#3a4654', 1); UI.text(ctx, 'σ', L + 6, 10, '#8E99A6', 11); UI.text(ctx, 'ε', Rr, bt + 14, '#8E99A6', 11, 'right');
            const D = Math.exp(-(1 - tmp) * 5) , v = Math.pow(10, (rate - 0.5) * 4), r = D / v * 4; const amp = Math.exp(-Math.pow(Math.log(r + 1e-6) / 1.8, 2)) * 38;
            ctx.beginPath(); for (let e = 0; e <= 10; e += 0.02) { const sg = 200 + 90 * (1 - Math.exp(-e / 3)) + amp * Math.sin(e * 9) * Math.sin(e * 9 * 0.3 + 1) * (e > 0.6 ? 1 : 0) * (Math.sin(e * 18) > -0.2 ? 1 : 0.2); const x = X(e), y = Y(sg); e ? ctx.lineTo(x, y) : ctx.moveTo(x, y); } ctx.strokeStyle = TEAL; ctx.lineWidth = 2.4; ctx.stroke();
            UI.setCap($$('.widget', w)[1], amp > 12 ? `<b>PLC etkisi var:</b> yabancı atomlar dislokasyonu yakalayıp bırakıyor (difüzyon ≈ dislokasyon hızı). Tırtıllar belirgin.` : r > 3 ? 'Çok yüksek sıcaklık/çok düşük hız: atomlar dislokasyonla birlikte kaçıyor, <b>tırtıl yok</b>.' : 'Hız yüksek ya da sıcaklık düşük: yabancı atomlar dislokasyona yetişemiyor, <b>tırtıl yok</b>.');
          });
        }
      },
      {
        id: 'hesap', title: 'A, Z ve A<sub>g</sub>: kopma ölçüleri', pg: 's.95-97',
        build(b) {
          b.innerHTML = `<p>Koptuktan sonra iki yarıyı birleştirip <b>ölçü boyunu</b> ve <b>kopma kesitini</b> ölçeriz. Değerleri değiştir, formülleri kullan.</p>
          <div class="widget"><div class="ctl" style="border:0"><label>d₀ (mm) <input type="range" min="6" max="20" value="10" id="d0"><output></output></label><label>L<sub>u</sub> (mm) <input type="range" min="50" max="80" value="64" id="lu"><output></output></label><label>d<sub>u</sub> (mm) <input type="range" min="3" max="10" step="0.1" value="5.5" id="du"><output></output></label><label>A<sub>11,3</sub> (%) <input type="range" min="10" max="40" value="24" id="a113"><output></output></label></div><div class="cap" style="font-size:15px;line-height:2"></div></div>
          <div class="key"><ul><li><b>Standart numunede L<sub>0</sub> = 5·d<sub>0</sub></b>. Kısa orantılı: L<sub>0</sub> = 5,65·√S<sub>0</sub> (s.95). Uzun orantılı: L<sub>0</sub> = 11,3·√S<sub>0</sub> (A<sub>11,3</sub>).</li><li><b>A = (L<sub>u</sub> − L<sub>0</sub>)/L<sub>0</sub> · 100</b>. Orantılı olmayan numunelerde ölçü boyu indisle yazılır: <b>A<sub>80mm</sub></b> (L<sub>0</sub> = 80 mm) (s.96).</li><li><b>Z = (S<sub>0</sub> − S<sub>u</sub>)/S<sub>0</sub> · 100</b> (s.96). Kopma anındaki büzülme, yani <b>boyun</b> kesiti.</li><li><b>A<sub>g</sub> = 2·A<sub>11,3</sub> − A</b> (s.97): üniform uzamanın hesabı.</li><li>Sünek malzemede A ve Z büyük, gevrekte küçük.</li></ul></div>`;
          const w = b; let d0 = 10, lu = 64, du = 5.5, a113 = 24; const upd = () => { const L0 = 5 * d0, A = (lu - L0) / L0 * 100, S0 = Math.PI * d0 * d0 / 4, Su = Math.PI * du * du / 4, Z = (S0 - Su) / S0 * 100, Ag = 2 * a113 - A; UI.setCap(w, `L₀ = 5·${d0} = <b>${L0} mm</b> · A = (${lu} − ${L0})/${L0}·100 = <b>${A.toFixed(1)} %</b><br>S₀ = ${S0.toFixed(1)} mm², S<sub>u</sub> = ${Su.toFixed(1)} mm² → Z = <b>${Z.toFixed(1)} %</b><br>A<sub>g</sub> = 2·${a113} − ${A.toFixed(1)} = <b>${Ag.toFixed(1)} %</b>`); };
          UI.bind(w, '#d0', v => { d0 = v; upd(); }, v => v + ' mm'); UI.bind(w, '#lu', v => { lu = v; upd(); }, v => v + ' mm'); UI.bind(w, '#du', v => { du = v; upd(); }, v => v.toFixed(1) + ' mm'); UI.bind(w, '#a113', v => { a113 = v; upd(); }, v => v + ' %'); upd();
        }
      }
    ]
  };
})();
