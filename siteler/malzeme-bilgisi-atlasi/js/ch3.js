(function () {
  const UI = window.UI, $ = UI.$, $$ = UI.$$;
  const AT = { H: ['#E8ECF0', 20], C: ['#8E99A6', 30], N: ['#6FB4FF', 28], O: ['#FF5A4D', 27], Cl: ['#7FD99A', 34] };
  const MOL = {
    H2: { c: ['H', 1], L: [['H', 1, 1]], an: [0], name: 'Hidrojen H₂' }, Cl2: { c: ['Cl', 7], L: [['Cl', 7, 1]], an: [0], name: 'Klor Cl₂' },
    O2: { c: ['O', 6], L: [['O', 6, 2]], an: [0], name: 'Oksijen O₂ (iki ortak çift)' }, N2: { c: ['N', 5], L: [['N', 5, 3]], an: [0], name: 'Azot N₂ (üç ortak çift)' },
    H2O: { c: ['O', 6], L: [['H', 1, 1], ['H', 1, 1]], an: [0.67, 2.47], name: 'Su H₂O' }, NH3: { c: ['N', 5], L: [['H', 1, 1], ['H', 1, 1], ['H', 1, 1]], an: [1.571, 3.67, -0.52], name: 'Amonyak NH₃' },
    CH4: { c: ['C', 4], L: [['H', 1, 1], ['H', 1, 1], ['H', 1, 1], ['H', 1, 1]], an: [0, 1.571, 3.1416, 4.712], name: 'Metan CH₄' }
  };
  function lonePairs(n, bondAngles) {
    const out = [], taken = bondAngles.slice(), TP = Math.PI * 2;
    for (let k = 0; k < n; k++) { let best = 0, bd = -1; for (let a = 0; a < TP; a += 0.1745) { let d = 9; taken.forEach(t => { const x = Math.abs((((a - t + Math.PI) % TP) + TP) % TP - Math.PI); d = Math.min(d, x); }); if (d > bd + 1e-9) { bd = d; best = a; } } out.push(best); taken.push(best); }
    return out;
  }
  const diatomic = k => MOL[k].L.length === 1;
  const Uf = (r, a, e) => e * (Math.pow(a / r, 12) - 2 * Math.pow(a / r, 6));
  const Ff = (r, a, e) => 12 * e / a * (Math.pow(a / r, 13) - Math.pow(a / r, 7));

  window.CH[3] = {
    intro: 'Atomlar neden birbirine yapışır? Elektron alışverişi ya da paylaşımıyla. Dört bağ tipini hareket ederken göreceksin; malzemenin sert mi gevrek mi, iletken mi olduğu bu bağdan çıkar.',
    sections: [
      {
        id: 'dort', title: 'Dört bağ tipi bir bakışta', pg: 's.20',
        build(b) {
          b.innerHTML = `<p>Atomlar arası bağlar dörde ayrılır: <b>kovalent, iyon, metal ve Van der Waals</b> (s.20). Hepsinin özü elektronlar ve zıt yüklerin çekimi.</p>
          <div class="wrap"><table><tr><th>Bağ</th><th>Elektron ne yapar?</th><th>Sıcaklık artınca elektrik iletkenliği</th><th>Ortalama bağ enerjisi</th><th>Tipik özellik</th></tr>
          <tr><td><b>Kovalent</b> (atom, elektron köprüsü, homöopolar)</td><td>Ortak çift paylaşılır</td><td>artar</td><td>125–300 kcal/mol</td><td>Yönlü, sert (elmas)</td></tr>
          <tr><td><b>İyon</b> (heteropolar)</td><td>Bir atom verir, diğeri alır</td><td>artar (sulu çözeltide iyon iletkenliği)</td><td>150–370 kcal/mol</td><td>Gevrek, şekillenmez</td></tr>
          <tr><td><b>Metal</b></td><td>Valans elektronları serbest (elektron gazı)</td><td><b>azalır</b></td><td>25–200 kcal/mol</td><td>Sünek, iletken</td></tr>
          <tr><td><b>Van der Waals</b> (dipol, hidrojen köprüsü)</td><td>Dipoller çeker</td><td>artar</td><td>&lt; 10 kcal/mol</td><td>En zayıf bağ</td></tr></table></div>
          <div class="key"><ul><li>Sıcaklık arttıkça iletkenlik <b>yalnız metallerde azalır</b>, diğer üçünde artar.</li><li>En zayıf bağ <b>Van der Waals</b> (s.30-31).</li><li>İyon bağı: <b>heteropolar</b>; kovalent: <b>homöopolar</b>, "elektron köprüsü" (s.20).</li></ul></div>
          <h3>Bağ dedektifi</h3><div class="widget" id="bd"><div style="padding:14px 18px"></div></div>`;
          const G = ['Kovalent', 'İyon', 'Metal', 'Van der Waals'];
          UI.mini($('div', $('#bd', b)), [
            { q: 'Elmasın atomları nasıl bağlıdır?', o: G, a: 0, w: 'Karbonlar elektron çiftlerini paylaşır.' },
            { q: 'NaCl kristali sert ama darbede çatlıyor, ergiyince iletken. Bağ?', o: G, a: 1, w: 'Gevrek + iyonik iletim → iyon bağı.' },
            { q: 'Sıcaklık artınca elektrik iletkenliği azalıyor. Bağ?', o: G, a: 2, w: 'Metal: kafes titreşimi elektronları saçar.' },
            { q: 'Buzdaki su molekülleri arasındaki çekim?', o: G, a: 3, w: 'Dipol / hidrojen köprüsü.' },
            { q: 'Polimer zincirleri arasında hangi bağ var?', o: G, a: 3, w: 'Zincir içi kovalent, zincirler arası Van der Waals.' },
            { q: 'Valans elektronları serbest, "elektron gazı" oluşuyor. Bağ?', o: G, a: 2, w: 'Metal bağı.' },
            { q: 'Cl₂ molekülünde iki Cl arası?', o: G, a: 0, w: 'Ortak elektron çifti.' },
            { q: 'Bağ enerjisi 10 kcal/mol altında?', o: G, a: 3, w: 'VdW en zayıf.' }
          ]);
        }
      },
      {
        id: 'kov', title: 'Kovalent bağ: elektron çifti paylaşmak', pg: 's.21-23',
        build(b) {
          b.innerHTML = `<p>İki atom <b>ortak elektron çiftleri</b> oluşturur; her atom kendini en yakın soy gaz gibi görür (<b>oktet</b>: 8, H için 2 elektron). Bir molekül seç, atomları yaklaştır.</p>
          <div class="widget"><canvas></canvas><div class="ctl"><span class="seg" id="ml"><button data-v="H2" class="on">H₂</button><button data-v="Cl2">Cl₂</button><button data-v="O2">O₂</button><button data-v="N2">N₂</button><button data-v="H2O">H₂O</button><button data-v="NH3">NH₃</button><button data-v="CH4">CH₄</button></span><label>Atomlar arası <input type="range" min="0" max="100" value="0" id="ap"><output></output></label></div><div class="cap"></div></div>
          <div class="key"><ul><li>Kovalent bağ: <b>ortak elektron çifti</b> (zıt spinli) (s.21-23). Atom, elektron köprüsü, homöopolar bağ.</li><li>Bağ <b>yönlüdür</b>: H₂O'da bükük, CH₄'te dört yöne.</li><li>Çok atomlu moleküllerde <b>valans sayısı kadar</b> bağ yapılır: H 1, O 2, N 3, C 4.</li><li>Sıcaklık artınca iletkenlik <b>artar</b> (s.25).</li></ul></div>
          <div class="tip">Biri çantayı tek başına taşıyamaz: iki kişi birlikte tutar, ikisi de "çantam var" der. Ortak çift böyle iki atomu birden doyurur.</div>`;
          let key = 'H2', p = 0;
          UI.seg(b, '#ml', v => { key = v; });
          UI.bind(b, '#ap', v => p = v / 100, v => v < 5 ? 'uzak' : v > 95 ? 'bağlı' : v + '%');
          UI.loop($('canvas', b), 0.5, (ctx, W, H, st) => {
            const M = MOL[key], D = Math.min(W * 0.24, H * (diatomic(key) ? 0.5 : 0.3)), far = 1 + 0.9 * (1 - p), d = D * far;
            const cx = W / 2, cy = H / 2; const diat = M.L.length === 1;
            const cpos = diat ? [cx - d / 2, cy] : [cx, cy];
            const lp = M.L.map((l, i) => { const a = M.an[i]; return [cpos[0] + d * Math.cos(a), cpos[1] + d * Math.sin(a), a]; });
            const orders = M.L.map(l => l[2]), totalC = orders.reduce((s, x) => s + x, 0);
            const bonds = lp.map((q, i) => ({ a: [cpos[0], cpos[1]], b: [q[0], q[1]], n: orders[i] }));
            bonds.forEach(bd => UI.line(ctx, bd.a[0], bd.a[1], bd.b[0], bd.b[1], 'rgba(200,210,220,' + (0.15 + 0.3 * p) + ')', 2, [4, 4]));
            const atoms = [{ s: M.c[0], v: M.c[1], x: cpos[0], y: cpos[1], bo: totalC, ang: lp.map(q => q[2]) }].concat(M.L.map((l, i) => ({ s: l[0], v: l[1], x: lp[i][0], y: lp[i][1], bo: l[2], ang: [lp[i][2] + 3.1416] })));
            atoms.forEach(a => {
              const [col, r] = AT[a.s]; UI.atom(ctx, a.x, a.y, r, col);
              UI.text(ctx, a.s, a.x, a.y, '#0B0E12', 15, 'center', 'Bahnschrift, sans-serif');
              const lone = Math.max(0, Math.round((a.v - a.bo) / 2)); const angs = lonePairs(lone, a.ang);
              angs.forEach(an => { for (let k = -1; k <= 1; k += 2) { const t = an + k * 0.2, rr = r + 10; UI.circle(ctx, a.x + rr * Math.cos(t), a.y + rr * Math.sin(t), 3, '#5FB4FF'); } });
              a.e = lone * 2 + a.bo * 2; a.tot = a.e;
            });
            bonds.forEach(bd => {
              const mx = (bd.a[0] + bd.b[0]) / 2, my = (bd.a[1] + bd.b[1]) / 2, ang = Math.atan2(bd.b[1] - bd.a[1], bd.b[0] - bd.a[0]), nx = -Math.sin(ang), ny = Math.cos(ang);
              for (let k = 0; k < bd.n; k++) { const o = (k - (bd.n - 1) / 2) * 11; for (let s = -1; s <= 1; s += 2) { const x = mx + nx * o + Math.cos(ang) * s * 4, y = my + ny * o + Math.sin(ang) * s * 4; UI.circle(ctx, x, y, 7 * p, 'rgba(245,197,66,.25)'); UI.circle(ctx, x, y, 3.2, p > 0.6 ? '#F5C542' : '#5FB4FF'); } }
            });
            UI.text(ctx, M.name, 14, 18, '#fff', 15);
            if (p > 0.9) UI.text(ctx, 'Her atom oktete ulaştı: ' + atoms.map(a => a.s + ' = ' + (a.s === 'H' ? 2 : 8)).filter((x, i, ar) => ar.indexOf(x) === i).join(', '), 14, H - 14, '#7FD99A', 13);
            else UI.text(ctx, 'Atomları yaklaştır: elektronlar ortak bölgeye girer', 14, H - 14, '#8E99A6', 13);
          });
          UI.setCap(b, '<b>Sarı noktalar</b> ortak çift, <b>mavi noktalar</b> bağ yapmayan (yalnız) çiftler.');
        }
      },
      {
        id: 'iyon', title: 'İyon bağı: ver, al, çek', pg: 's.24-25',
        build(b) {
          b.innerHTML = `<p>Bir atom elektron verip <b>katyon</b>, diğeri alıp <b>anyon</b> olur; zıt yüklü iyonlar birbirini çeker (<b>heteropolar</b> bağ). Önce elektronun geçişini, sonra kristale kuvvet uygulandığında ne olduğunu gör.</p>
          <div class="widget"><canvas></canvas><div class="ctl"><button class="btn" id="tr">1) Elektronu aktar</button><button class="btn" id="fo">2) Kuvvet uygula</button><button class="btn" id="rs">Başa dön</button></div><div class="cap"></div></div>
          <div class="key"><ul><li>İyon bağlı malzeme <b>gevrektir, şekillenmez</b>: bir katman kayınca aynı yükler karşı karşıya gelir, itişir, kristal kırılır (s.24).</li><li>Katı halde elektriği iletmez; <b>ergiyince veya sulu çözeltide iyon iletkenliği</b> görülür. Sıcaklıkla iletkenlik artar.</li><li>Bağ <b>yönsüzdür</b>, iyonlar her yönde komşu çeker.</li></ul></div>`;
          let phase = 0, t0 = 0, trf = 0; const w = b;
          $('#tr', b).onclick = () => { if (phase === 0) phase = 1; }; $('#fo', b).onclick = () => { if (phase === 2) { phase = 3; t0 = 0; } }; $('#rs', b).onclick = () => { phase = 0; t0 = 0; trf = 0; };
          UI.loop($('canvas', b), 0.5, (ctx, W, H, st) => {
            const cols = 8, rows = 4, s = Math.min(W / (cols + 1), H / (rows + 2.2), 52), ox = W / 2 - (cols - 1) * s / 2, oy = H / 2 - (rows - 1) * s / 2 + 8;
            if (phase === 0 || phase === 1) {
              if (phase === 1) trf = Math.min(1, trf + st.dt * 0.8); if (trf >= 1) phase = 2;
              const cy = H / 2, ax = W * 0.3, bx = W * 0.7, rn = 40 * (1 - 0.45 * trf), rc = 36 * (1 + 0.8 * trf);
              UI.circle(ctx, ax, cy, rn, 'rgba(255,158,158,.15)', '#FF9E9E', 2); UI.circle(ctx, bx, cy, rc * 0.9, 'rgba(127,217,154,.15)', '#7FD99A', 2);
              UI.text(ctx, trf > 0.97 ? 'Na⁺' : 'Na', ax, cy, '#fff', 18, 'center'); UI.text(ctx, trf > 0.97 ? 'Cl⁻' : 'Cl', bx, cy, '#fff', 18, 'center');
              const ex = UI.lerp(ax + rn, bx - rc * 0.9, trf), ey = cy - 30 * Math.sin(trf * 3.14); UI.circle(ctx, ex, ey, 6, '#5FB4FF');
              UI.text(ctx, 'Na bir valans elektronu verir, Cl alır', W / 2, 20, '#C9D0D8', 14, 'center'); UI.setCap(w, 'Elektron geçti: Na⁺ küçüldü, Cl⁻ büyüdü. Şimdi bunlardan bir kristal örülür.');
              return;
            }
            let shift = 0, gap = 0, rep = 0;
            if (phase === 3) { t0 += st.dt; shift = Math.min(1, t0 / 1.1) * s; rep = shift >= s * 0.98 ? Math.min(1, (t0 - 1.1) / 0.5) : 0; gap = Math.max(0, (t0 - 1.7)) * 40; if (gap > 50) gap = 50; }
            for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
              const pos = (r + c) % 2 === 0, top = r < 2; const x = ox + c * s + (top ? shift : 0) + (top && gap ? 0 : 0), y = oy + r * s + (top ? -gap * 0.35 : gap * 0.35);
              const jitter = rep > 0 && top ? (Math.random() - 0.5) * 3 * (1 - Math.min(1, gap / 20)) : 0;
              UI.circle(ctx, x + jitter, y, pos ? s * 0.2 : s * 0.32, pos ? '#FF9E9E' : '#7FD99A'); UI.text(ctx, pos ? '+' : '−', x + jitter, y, '#0B0E12', pos ? 12 : 16, 'center');
            }
            if (rep > 0 && gap < 30) { for (let c = 0; c < cols; c++) { const x = ox + c * s + shift; UI.arrow(ctx, x, oy + s * 0.5 - 2, x, oy + s * 0.5 - 14, '#FF2D20', 2); UI.arrow(ctx, x, oy + s * 0.5 + 2, x, oy + s * 0.5 + 14, '#FF2D20', 2); } }
            if (phase === 2) UI.setCap(w, 'Kristal hazır: <b>+ ve − dönüşümlü</b>. "Kuvvet uygula" ile üst iki katmanı bir adım kaydır.');
            if (phase === 3) UI.setCap(w, rep ? (gap > 5 ? '<b>Kırıldı.</b> Aynı yükler üst üste geldi, itme kristali yardı: iyon kristali plastik şekil değiştirmez, gevrektir.' : 'Aynı yükler karşı karşıya: <b style="color:#FF5A4D">itme</b>!') : 'Katman kayıyor…');
          });
        }
      },
      {
        id: 'metal', title: 'Metal bağı: elektron gazı', pg: 's.25-28',
        build(b) {
          b.innerHTML = `<p>Metal atomları <b>valans elektronlarını</b> (dış kabukta en fazla 3) serbest bırakır; geride kalan pozitif iyonlar <b>elektron gazı</b> içinde durur. Voltaj ve sıcaklığı değiştir, katmanı kaydır.</p>
          <div class="widget"><canvas></canvas><div class="ctl"><label>Voltaj <input type="range" min="0" max="100" value="50" id="vv"><output></output></label><label>Sıcaklık <input type="range" min="0" max="100" value="20" id="tt"><output></output></label><button class="btn" id="sl">Katmanı kaydır</button></div><div class="cap"></div></div>
          <div class="key"><ul><li>Sıcaklık artınca iyonlar daha çok titrer, elektronları saçar → <b>iletkenlik azalır</b> (sıcaklıkla ters orantılı).</li><li>Katmanlar kayınca elektron gazı bağı sürdürür → <b>sünek, şekillenebilir</b> (iyon bağıyla fark).</li><li>Metaller oklet kuralını <b>elektron vererek</b> sağlar; 1-3 valans elektronu (s.25). Bağ <b>yönsüzdür</b>.</li><li>Ortalama bağ enerjisi: 25–200 kcal/mol (s.31).</li></ul></div>`;
          let V = 0.5, T = 0.2, slip = 0, tgt = 0; $('#sl', b).onclick = () => tgt = tgt ? 0 : 1;
          UI.bind(b, '#vv', v => V = v / 100, v => v + ' V'); UI.bind(b, '#tt', v => T = v / 100, v => Math.round(20 + v * 10) + ' K');
          const el = []; for (let i = 0; i < 60; i++) el.push({ x: Math.random(), y: Math.random(), a: Math.random() * 6.28 });
          UI.loop($('canvas', b), 0.5, (ctx, W, H, st) => {
            slip += (tgt - slip) * Math.min(1, st.dt * 3); const cols = 9, rows = 4, s = Math.min(W / (cols + 1.5), H / (rows + 2), 56), ox = W / 2 - (cols - 1) * s / 2, oy = H / 2 - (rows - 1) * s / 2 + 6;
            const drift = V * 140 / (1 + T * 5), amp = 1 + T * 7;
            ctx.fillStyle = 'rgba(95,180,255,.05)'; ctx.fillRect(ox - s * 0.8, oy - s * 0.8, (cols - 1) * s + s * 1.6, (rows - 1) * s + s * 1.6);
            el.forEach(e => { e.a += (Math.random() - 0.5) * (0.5 + T * 3); const sp = 40 + T * 120; e.x += (Math.cos(e.a) * sp + drift) * st.dt / W; e.y += Math.sin(e.a) * sp * st.dt / H; if (e.x > 1) e.x -= 1; if (e.x < 0) e.x += 1; e.y = (e.y + 1) % 1; const x = ox - s * 0.8 + e.x * ((cols - 1) * s + s * 1.6), y = oy - s * 0.8 + e.y * ((rows - 1) * s + s * 1.6); UI.circle(ctx, x, y, 3, '#5FB4FF'); });
            for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) { const x = ox + c * s + (r < 2 ? slip * s : 0) + Math.sin(st.t * 14 + c * 2 + r) * amp * 0.5, y = oy + r * s + Math.cos(st.t * 12 + c + r * 3) * amp * 0.5; UI.circle(ctx, x, y, s * 0.26, '#FF9E9E'); UI.text(ctx, '+', x, y, '#0B0E12', 13, 'center'); }
            const cur = V / (1 + T * 5); UI.text(ctx, 'Akım', 14, 18, '#C9D0D8', 13); UI.roundRect(ctx, 56, 10, 160, 16, 4, null, '#3a4654'); UI.roundRect(ctx, 56, 10, Math.max(2, 160 * cur / 1), 16, 4, '#F5C542');
            UI.arrow(ctx, W - 90, H - 16, W - 24, H - 16, 'rgba(95,180,255,.8)', 2); UI.text(ctx, 'elektron akışı', W - 100, H - 16, '#8E99A6', 11, 'right');
          });
          UI.setCap(b, 'Sıcaklığı yükselt: iyonlar daha çok titrer, <b>akım çubuğu kısalır</b>. Katmanı kaydır: bağ kopmaz, çünkü elektron gazı her yeri sarıyor.');
        }
      },
      {
        id: 'vdw', title: 'Van der Waals bağı: zayıf ama her yerde', pg: 's.29-31',
        build(b) {
          b.innerHTML = `<p>Elektron alışverişi ya da paylaşımı yoktur; <b>dipoller</b> birbirini çeker. En zayıf bağdır (&lt; 10 kcal/mol). Üç görünümüne bak.</p>
          <div class="widget"><canvas></canvas><div class="ctl"><span class="seg" id="vm"><button data-v="su" class="on">Su (hidrojen köprüsü)</button><button data-v="soy">Soy gaz (anlık dipol)</button><button data-v="zin">Polimer zincirleri</button></span><label>Isı <input type="range" min="0" max="100" value="20" id="vt"><output></output></label></div><div class="cap"></div></div>
          <div class="key"><ul><li><b>Dipol:</b> molekülün bir ucu kısmen (+), diğeri kısmen (−). Zıt uçlar çeker (s.30).</li><li><b>Hidrojen köprüsü:</b> H atomunun O, N, F gibi atomlarla kurduğu güçlü dipol çekimi (suda).</li><li>Polimerlerde (PVC gibi) zincir içi <b>kovalent</b>, zincirler arası <b>Van der Waals</b> (s.31). Isınca zincirler kayar, yumuşar.</li><li>Sıcaklıkla iletkenlik artar; bağ enerjisi < 10 kcal/mol.</li></ul></div>`;
          let mode = 'su', T = 0.2; UI.seg(b, '#vm', v => { mode = v; }); UI.bind(b, '#vt', v => T = v / 100, v => v + '%');
          function water(ctx, x, y, a, s) { const hx = [Math.cos(a - 0.9) * s, Math.cos(a + 0.9) * s], hy = [Math.sin(a - 0.9) * s, Math.sin(a + 0.9) * s]; UI.line(ctx, x, y, x + hx[0], y + hy[0], '#8E99A6', 2); UI.line(ctx, x, y, x + hx[1], y + hy[1], '#8E99A6', 2); UI.circle(ctx, x, y, s * 0.32, '#FF5A4D'); UI.circle(ctx, x + hx[0], y + hy[0], s * 0.17, '#E8ECF0'); UI.circle(ctx, x + hx[1], y + hy[1], s * 0.17, '#E8ECF0'); return [[x + hx[0], y + hy[0]], [x + hx[1], y + hy[1]], [x, y]]; }
          UI.loop($('canvas', b), 0.5, (ctx, W, H, st) => {
            if (mode === 'su') {
              const n = 4, m = 3, s = Math.min(W / (n + 1), H / (m + 0.8)) * 0.9, pts = [];
              for (let r = 0; r < m; r++) for (let c = 0; c < n; c++) { const x = W / 2 + (c - (n - 1) / 2) * s + (r % 2) * s * 0.4, y = H / 2 + (r - (m - 1) / 2) * s + Math.sin(st.t * (3 + T * 8) + c + r) * T * 10, a = Math.PI / 2 + 0.5 + Math.sin(st.t * 1.5 + c * 2 + r) * (0.2 + T * 0.9); pts.push({ x, y, a }); }
              const hs = []; pts.forEach(p => { hs.push(water(ctx, p.x, p.y, p.a, s * 0.34)); });
              hs.forEach((w1, i) => [0, 1].forEach(k => { let best = null, bd = 1e9; hs.forEach((w2, j) => { if (i === j) return; const d = Math.hypot(w1[k][0] - w2[2][0], w1[k][1] - w2[2][1]); if (d < bd) { bd = d; best = w2; } }); if (best && bd < s * 0.9 && T < 0.85) UI.line(ctx, w1[k][0], w1[k][1], best[2][0], best[2][1], 'rgba(245,197,66,.85)', 1.8, [4, 3]); }));
              UI.text(ctx, 'O: δ−  ·  H: δ+  ·  kesikli sarı çizgi = hidrojen köprüsü', 14, 18, '#C9D0D8', 13); UI.setCap(b, T > 0.85 ? 'Isı fazla: köprüler kopuyor, <b>su buhara</b> geçiyor.' : '<b>H</b> kısmen (+), <b>O</b> kısmen (−). Komşu molekülün O\'suna çekilir. Isıtınca molekül oynar ama köprüler kopmaya direnir.');
            } else if (mode === 'soy') {
              const y = H / 2, r = Math.min(W * 0.12, 60), ax = W * 0.32, bx = W * 0.68, a1 = Math.sin(st.t * (2 + T * 6)) * r * 0.55, a2 = Math.sin(st.t * (2 + T * 6) - 0.5) * r * 0.45;
              [[ax, a1], [bx, a2]].forEach(([x, a]) => { UI.circle(ctx, x, y, r, 'rgba(95,180,255,.1)', '#3a4654', 1); UI.circle(ctx, x + a, y, r * 0.78, 'rgba(95,180,255,.22)'); UI.circle(ctx, x, y, 7, '#FF5A4D'); UI.text(ctx, a > 0 ? 'δ−' : 'δ+', x + a * 1.1 + (a > 0 ? 14 : -14), y - r - 8, a > 0 ? '#5FB4FF' : '#FF9E9E', 14, 'center'); });
              const f = 1 - Math.abs(a1 - a2) / r; UI.arrow(ctx, ax + r, y + r + 18, bx - r, y + r + 18, `rgba(245,197,66,${0.3 + 0.7 * f})`, 2 + 2 * f);
              UI.text(ctx, 'Argon: dipolü yok, ama elektron bulutu anlık kayar', W / 2, 18, '#C9D0D8', 13, 'center'); UI.setCap(b, 'Elektron bulutu bir an bir yana kayınca geçici dipol doğar; komşuda <b>indüklenen dipol</b> oluşur ve iki atom hafifçe çekilir. Çok zayıf: soy gazlar çok düşük sıcaklıkta sıvılaşır.');
            } else {
              const nc = 4, len = 9, sp = Math.min(H / (nc + 0.8), 62) * (1 + T * 0.7), sx = Math.min(W / (len + 1), 50), x0 = W / 2 - (len - 1) * sx / 2;
              for (let c = 0; c < nc; c++) {
                const yy = H / 2 + (c - (nc - 1) / 2) * sp, wob = Math.sin(st.t * (2 + T * 5) + c * 1.7) * (4 + 28 * T) * (c % 2 ? 1 : -1), pts = [];
                for (let i = 0; i < len; i++) { const x = x0 + i * sx + wob * (c % 2 ? 1 : 0.6), y = yy + (i % 2 ? 7 : -7); pts.push([x, y]); }
                for (let i = 0; i < len - 1; i++) UI.line(ctx, pts[i][0], pts[i][1], pts[i + 1][0], pts[i + 1][1], '#F5C542', 3);
                pts.forEach(p => UI.circle(ctx, p[0], p[1], 6, '#8E99A6'));
                if (c < nc - 1) for (let i = 1; i < len; i += 2) UI.line(ctx, pts[i][0], pts[i][1] + 5, pts[i][0] - wob * 0.2, pts[i][1] + sp - 12, 'rgba(95,180,255,.65)', 1, [3, 3]);
              }
              UI.text(ctx, 'Sarı: kovalent (zincir içi)  ·  mavi kesikli: Van der Waals (zincirler arası)', 14, 18, '#C9D0D8', 13);
              UI.setCap(b, T > 0.7 ? 'Isı arttı: zincirler arası zayıf bağlar aşıldı, zincirler birbiri üzerinde kayıyor → polimer <b>yumuşadı</b>.' : 'Zincir içindeki kovalent bağlar çok güçlü, zincirler arasındaki Van der Waals bağları zayıf. Isıyı artır.');
            }
          });
        }
      },
      {
        id: 'fm', title: 'Kuvvet–uzaklık eğrisi: bağın fiziği', pg: 's.26-28 (Şekil 3.3.3)',
        build(b) {
          b.innerHTML = `<p>İki atom arasında hem <b>çekme</b> (zıt yük, elektron) hem <b>itme</b> (çekirdek-çekirdek, elektron bulutları) var. Dengede bu ikisi eşit: <b>kritik atom aralığı a</b>. Kaydırıcıları oyna.</p>
          <div class="widget"><canvas></canvas><div class="ctl"><label>Uzaklık r/a <input type="range" min="85" max="220" value="100" id="rr"><output></output></label><label>Isı (titreşim enerjisi) <input type="range" min="0" max="95" value="0" id="ee"><output></output></label><label>Bağ enerjisi <input type="range" min="25" max="300" value="120" id="ep"><output></output></label></div><div class="cap"></div></div>
          <div class="key"><ul><li>Atomlar <b>r = a</b> uzaklığında dengededir: net kuvvet 0, enerji en düşük. <b>Atom yarıçapı r = a/2</b> (s.28).</li><li>a'dan yakınsa itme, uzaksa çekme baskın.</li><li><b>Çukur ne kadar derin</b> (bağ enerjisi büyük) → ergime sıcaklığı yüksek, ısıl genleşme küçük, elastisite modülü büyük.</li><li>Isıtınca atomlar çukurda salınır; eğri <b>asimetrik</b> olduğu için ortalama uzaklık büyür: <b>ısıl genleşme</b> (s.38).</li></ul></div>`;
          let r = 1, eh = 0, eps = 120; UI.bind(b, '#rr', v => r = v / 100, v => (v / 100).toFixed(2) + ' a'); UI.bind(b, '#ee', v => eh = v / 100, v => '%' + v); UI.bind(b, '#ep', v => eps = v, v => v + ' kcal/mol');
          UI.loop($('canvas', b), 0.85, (ctx, W, H, st) => {
            const L = 56, R = W - 16, top = 14, h1 = H * 0.42, X = rv => L + (rv - 0.85) / (2.25 - 0.85) * (R - L), YU = u => top + h1 / 2 - u / 330 * (h1 / 2);
            UI.line(ctx, L, YU(0), R, YU(0), '#3a4654', 1); UI.line(ctx, L, top, L, top + h1, '#3a4654', 1); UI.text(ctx, 'Enerji', 8, top + 6, '#8E99A6', 11);
            const curve = (fn, col, dash) => { ctx.beginPath(); let go = false; for (let x = 0.88; x <= 2.25; x += 0.01) { const y = YU(Math.max(-340, Math.min(340, fn(x)))); const px = X(x); if (!go) { ctx.moveTo(px, y); go = true; } else ctx.lineTo(px, y); } ctx.strokeStyle = col; ctx.lineWidth = dash ? 1.4 : 2.4; ctx.setLineDash(dash ? [5, 4] : []); ctx.stroke(); ctx.setLineDash([]); };
            curve(x => eps * Math.pow(1 / x, 12), '#FF5A4D', true); curve(x => -2 * eps * Math.pow(1 / x, 6), '#5FB4FF', true); curve(x => Uf(x, 1, eps), '#F5C542');
            UI.text(ctx, 'itme', X(0.92), YU(150) , '#FF5A4D', 12); UI.text(ctx, 'çekme', X(1.95), YU(-90), '#5FB4FF', 12); UI.text(ctx, 'toplam enerji', X(1.55), YU(Uf(1.55, 1, eps)) - 22, '#F5C542', 12);
            UI.line(ctx, X(1), top, X(1), top + h1, '#222b34', 1, [3, 4]); UI.text(ctx, 'a', X(1), top + h1 + 10, '#fff', 12, 'center');
            const lvl = -eps + eh * eps; if (eh > 0) UI.line(ctx, L, YU(lvl), R, YU(lvl), 'rgba(255,255,255,.35)', 1, [2, 3]);
            let lo = 1, hi = 1; if (eh > 0) { let a1 = 0.85, a2 = 1; for (let i = 0; i < 40; i++) { const m = (a1 + a2) / 2; Uf(m, 1, eps) > lvl ? a1 = m : a2 = m; } lo = (a1 + a2) / 2; a1 = 1; a2 = 20; for (let i = 0; i < 60; i++) { const m = (a1 + a2) / 2; Uf(m, 1, eps) < lvl ? a1 = m : a2 = m; } hi = (a1 + a2) / 2; }
            const rm = (lo + hi) / 2, osc = eh > 0 ? rm + (hi - lo) / 2 * Math.sin(st.t * 5) : r; const rcur = eh > 0 ? Math.min(osc, 2.2) : r;
            if (eh > 0) { UI.line(ctx, X(lo), YU(lvl) - 8, X(lo), YU(lvl) + 8, '#fff', 2); UI.line(ctx, X(Math.min(hi, 2.2)), YU(lvl) - 8, X(Math.min(hi, 2.2)), YU(lvl) + 8, '#fff', 2); UI.line(ctx, X(rm), top, X(rm), top + h1, '#7FD99A', 1.5, [5, 3]); UI.text(ctx, 'ortalama', X(rm), top + h1 + 24, '#7FD99A', 11, 'center'); }
            UI.circle(ctx, X(rcur), YU(Uf(rcur, 1, eps)), 6, '#fff');
            const y2 = top + h1 + 44, h2 = H * 0.24; UI.line(ctx, L, y2 + h2 / 2, R, y2 + h2 / 2, '#3a4654', 1); UI.line(ctx, L, y2, L, y2 + h2, '#3a4654', 1); UI.text(ctx, 'Kuvvet', 8, y2 + 4, '#8E99A6', 11);
            ctx.beginPath(); for (let x = 0.9; x <= 2.25; x += 0.01) { const f = Math.max(-1, Math.min(1, Ff(x, 1, eps) / 800)), px = X(x), py = y2 + h2 / 2 - f * h2 / 2; x === 0.9 ? ctx.moveTo(px, py) : ctx.lineTo(px, py); } ctx.strokeStyle = '#C79CFF'; ctx.lineWidth = 2; ctx.stroke(); UI.text(ctx, '+ itme', R - 4, y2 + 8, '#8E99A6', 11, 'right'); UI.text(ctx, '− çekme', R - 4, y2 + h2 - 4, '#8E99A6', 11, 'right');
            const fcur = Math.max(-1, Math.min(1, Ff(rcur, 1, eps) / 800)); UI.circle(ctx, X(rcur), y2 + h2 / 2 - fcur * h2 / 2, 5, '#fff'); UI.line(ctx, X(rcur), y2, X(rcur), y2 + h2, 'rgba(255,255,255,.2)', 1);
            const ya = y2 + h2 + 34, sp = 60 * rcur, cx0 = W / 2 - 40;
            UI.atom(ctx, cx0 - sp / 2 * 0.9 - 30, ya, 24, '#FF9E9E'); UI.atom(ctx, cx0 + sp / 2 * 0.9 + 30, ya, 24, '#FF9E9E');
            const fnet = Ff(rcur, 1, eps); if (Math.abs(fnet) > 6) { const dir = fnet > 0 ? 1 : -1, ln = Math.min(46, Math.abs(fnet) / 10 + 8); UI.arrow(ctx, cx0 - sp / 2 * 0.9 - 30 + (dir > 0 ? -26 : 26), ya, cx0 - sp / 2 * 0.9 - 30 + (dir > 0 ? -26 - ln : 26 + ln), ya, dir > 0 ? '#FF5A4D' : '#5FB4FF', 3); UI.arrow(ctx, cx0 + sp / 2 * 0.9 + 30 + (dir > 0 ? 26 : -26), ya, cx0 + sp / 2 * 0.9 + 30 + (dir > 0 ? 26 + ln : -26 - ln), ya, dir > 0 ? '#FF5A4D' : '#5FB4FF', 3); }
            UI.text(ctx, `r = ${rcur.toFixed(2)} a`, W - 14, ya, '#C9D0D8', 13, 'right');
            UI.setCap(b, eh > 0 ? `Atomlar çukurda <b>salınıyor</b>. Sol sınır ${lo.toFixed(2)}a, sağ sınır ${Math.min(hi, 9).toFixed(2)}a, ortalama <b>${rm.toFixed(3)}a</b> > a: genleşme. Isıyı arttırdıkça ortalama sağa kayar.` : `Bağ enerjisi ${eps} kcal/mol. r = a'da net kuvvet 0; daha yakında <b style="color:#FF5A4D">itme</b>, daha uzakta <b style="color:#5FB4FF">çekme</b> baskın.`);
          });
        }
      },
      {
        id: 'enerji', title: 'Bağ enerjileri sıralaması', pg: 's.31',
        build(b) {
          b.innerHTML = `<p>Aralıklar ortalama bağ enerjisi (kcal/mol). Ne kadar yüksekse malzeme o kadar zor ergir.</p>${UI.W('be', 0.38)}
          <div class="key"><ul><li>Kovalent <b>125–300</b> · İyon <b>150–370</b> · Metal <b>25–200</b> · Van der Waals <b>&lt; 10</b> kcal/mol.</li><li>İyon bağı aralığı <b>en yüksek uca</b> çıkar; Van der Waals ise ölçeğin dibinde.</li></ul></div>`;
          const it = [['İyon', 150, 370, '#6FB4FF'], ['Kovalent', 125, 300, '#F5C542'], ['Metal', 25, 200, '#FF9E9E'], ['Van der Waals', 0, 10, '#7FD99A']];
          UI.loop($('canvas', $('#be', b)), 0.38, (ctx, W, H, st) => {
            const L = 120, R = W - 20, X = v => L + v / 400 * (R - L), g = Math.min(1, st.t / 1.1);
            for (let v = 0; v <= 400; v += 100) { UI.line(ctx, X(v), 10, X(v), H - 28, '#222b34', 1); UI.text(ctx, v, X(v), H - 14, '#8E99A6', 11, 'center'); }
            it.forEach((x, i) => { const y = 30 + i * (H - 70) / 3; UI.text(ctx, x[0], 10, y, '#EEF1F4', 13); const w = Math.max(4, X(x[2]) - X(x[1])) * g; UI.roundRect(ctx, X(x[1]), y - 11, w, 22, 5, x[3]); if (g >= 1) UI.text(ctx, (x[1] ? x[1] + '–' + x[2] : '< ' + x[2]), X(x[2]) + 8, y, '#C9D0D8', 12); });
          });
        }
      }
    ]
  };
})();
