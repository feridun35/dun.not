(function () {
  const UI = window.UI, $ = UI.$, $$ = UI.$$;
  const sm = (x, a, b) => { const t = UI.clamp((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };
  function seeded(seed) { let s = seed >>> 0 || 1; return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; }; }
  const OR = '#FFA95C';

  window.CH[6] = {
    intro: 'Gerçek kristal kusursuz değildir. Bu bölümün kahramanı <b>dislokasyon</b>: metallerin neden teoride olması gerekenden yüzlerce kat zayıf, ama bu sayede şekillenebilir olduğunu açıklar. Önce hata türlerine bak, sonra dislokasyonun nasıl hareket ettiğini izle.',
    sections: [
      {
        id: 'ideal', title: 'İdeal kristal ve neden gerçek mukavemet çok düşük', pg: 's.60-62',
        build(b) {
          b.innerHTML = `<p><b>İdeal kristal:</b> kafes sisteminde hiçbir bozukluk ve yabancı atom bulunmayan yapı. Böyle bir kristali kaydırmak için bütün bir atom düzleminin <b>aynı anda</b> kayması gerekir: çok büyük kuvvet. Gerçek metaller, kusurları sayesinde bunun <b>binde birinde</b> kayar.</p>
          <div class="widget"><canvas></canvas><div class="cap">Çizelge 6.3.3'teki kritik kayma gerilmeleri (çubuk, N/mm², logaritmik eksen) ve <b>teorik değerleri</b> (τ<sub>kr</sub> × 1000).</div></div>
          <div class="key"><ul><li>Gerçek mukavemet teorik mukavemetten <b>yüzlerce-binlerce kat</b> düşüktür: sebep kristal içindeki <b>kusurlar</b> (dislokasyonlar). <b>τ<sub>kr</sub>·1000 = τ<sub>teorik</sub></b> (s.70).</li><li><b>Elektriki hatalar:</b> elektron veya boşluk (hole) fazlalığı (s.60). <b>Kimyasal hatalar:</b> yabancı atomlar, alaşım elementi (s.61). <b>İç yapı hataları:</b> boyutlarına göre sınıflanır (Çizelge 6.3.1).</li></ul></div>
          <div class="wrap"><table><tr><th>Boyut</th><th>Hata</th><th>Burger vektörü</th></tr>
          <tr><td><b>0 boyutlu</b> (nokta)</td><td>Boş yer, kafes arası atom, Frenkel çifti, yabancı atom, boş yer yığılması</td><td>b = 0</td></tr>
          <tr><td><b>1 boyutlu</b> (çizgi)</td><td>Dislokasyon, dizgi hatası</td><td>dislokasyonda b ≠ 0</td></tr>
          <tr><td><b>2 boyutlu</b> (düzlem)</td><td>Tane sınırı, ikiz sınırı, faz sınırı</td><td>—</td></tr>
          <tr><td><b>3 boyutlu</b> (hacim)</td><td>Çok tanelilik, gaz habbeleri, metalik/ametalik fazlar, intermetalik faz, kalıntılar, segregasyon</td><td>—</td></tr></table></div>
          <div class="tip">Kalın bir halıyı tek hamlede çekmeyi dene: ağır. Halıya küçük bir kabarık yap ve onu ilerlet: halı hiç zorlamadan ilerler. Dislokasyon bu kabarık.</div>`;
          const M = [['Cu (YMK)', 65], ['Ag (YMK)', 48], ['α-Fe (HMK)', 2800], ['Mo (HMK)', 5000], ['Zn (SDH)', 18], ['Mg (SDH)', 77], ['Ti (SDH)', 1400]];
          UI.loop($('canvas', b), 0.62, (ctx, W, H, st) => {
            const L = 100, R = W - 70, X = v => L + (Math.log10(v) - 0.7) / (6.1 - 0.7) * (R - L), g = Math.min(1, st.t / 1.2), rh = (H - 50) / M.length;
            for (let e = 1; e <= 6; e++) { UI.line(ctx, X(Math.pow(10, e)), 8, X(Math.pow(10, e)), H - 28, '#222b34', 1); UI.text(ctx, '10' + '⁰¹²³⁴⁵⁶'[e], X(Math.pow(10, e)), H - 14, '#8E99A6', 11, 'center'); }
            M.forEach((m, i) => { const y = 20 + i * rh + rh / 2; UI.text(ctx, m[0], 8, y, '#EEF1F4', 12); const x1 = X(m[1]), x2 = X(m[1] * 1000); UI.roundRect(ctx, L, y - 8, Math.max(3, (x2 - L) * g), 7, 3, 'rgba(255,255,255,.25)'); UI.roundRect(ctx, L, y + 1, Math.max(3, (x1 - L) * g), 7, 3, OR); if (g >= 1) { UI.text(ctx, m[1], x1 + 6, y + 5, '#FFA95C', 11); } });
            UI.text(ctx, 'gerçek (turuncu)', R, 10, OR, 11, 'right'); UI.text(ctx, 'teorik (gri) = 1000 ×', R, 24, '#C9D0D8', 11, 'right');
          });
        }
      },
      {
        id: 'nokta', title: 'Nokta hataları: boş yer, kafes arası atom, Frenkel', pg: 's.61-65',
        build(b) {
          b.innerHTML = `<p>Bir veya birkaç atom büyüklüğündeki hatalar. Hatayı seç; çevre atomların nasıl <b>itildiğini ya da çekildiğini</b> gör. Boş yer seçiliyken "Isı" ile boş yerin <b>gezindiğini</b> izle.</p>
          <div class="widget"><canvas></canvas><div class="ctl"><span class="seg" id="pd"><button data-v="ideal">İdeal</button><button data-v="bos" class="on">Boş yer</button><button data-v="ara">Kafes arası atom</button><button data-v="fr">Frenkel çifti</button><button data-v="ya">Yabancı atom (yer alan)</button><button data-v="yb">Yabancı atom (arayer)</button><button data-v="yig">Boş yer yığılması</button></span><label><input type="checkbox" id="ht"> Isı (boş yer hareketi)</label></div><div class="cap"></div></div>
          <div class="key"><ul><li><b>Boş yer:</b> atomu eksik kafes noktası. Çevre atomlar boşluğa doğru kayar. Oluşum enerjisi ≈ <b>0,5–1,0 eV</b>; sıcaklıkla artar. <b>C<sub>BY</sub> = exp(−E<sub>BY</sub>/RT)</b>; oda sıcaklığında yaklaşık 10<sup>−12</sup>'dir (s.62).</li><li><b>Kafes arası atom</b> (Anti-Schottky): kafeste kendi yeri dışında, diğer atomların arasında duran atom; enerjisi ≈ <b>5 eV</b>, çok pahalı olduğundan seyrektir (s.63).</li><li><b>Frenkel çifti:</b> boş yer + kafes arası atom birlikte (atom yerinden fırlar) (s.63).</li><li><b>Yabancı atom:</b> yer alan (kafes yerini işgal) ya da arayer (küçük atomlar: C, N, H) (s.61-64).</li><li><b>Boş yer yığılması:</b> boş yerlerin birleşip daha büyük boşluk oluşturması (s.65).</li><li>Nokta hatalarda <b>Burger vektörü b = 0</b>; soğuk şekillendirme boş yer sayısını arttırır.</li></ul></div>
          <h3>Boş yer sayısı sıcaklıkla ne kadar artar?</h3>
          <div class="widget"><canvas></canvas><div class="ctl"><label>Oluşum enerjisi <input type="range" min="40" max="150" value="74" id="ev"><output></output></label><label>Sıcaklık <input type="range" min="300" max="1300" value="300" id="tk"><output></output></label></div><div class="cap"></div></div>`;
          const w = b, cv = $$('canvas', b), cols = 12, rows = 7; let mode = 'bos', ap = 0, heat = false;
          UI.seg(w, '#pd', v => { mode = v; ap = 0; }); $('#ht', w).onchange = e => heat = e.target.checked;
          const cap = { ideal: 'Kusursuz kristal: her atom komşularıyla dengede.', bos: 'Çevre atomlar boş yere doğru yaklaşır (kafes büzülür).', ara: 'Fazladan atom komşuları <b>iter</b>, kafes şişer (basma gerilmesi).', fr: 'Atom yerinden fırlayıp kafes arasına girdi: <b>boş yer + kafes arası</b> birlikte = Frenkel çifti.', ya: 'Yer alan yabancı atom: kafes yerini işgal eder. Büyükse çevreyi iter, küçükse çeker.', yb: 'Küçük atom (C, N, H) kafes aralığına girer, çevreyi hafifçe iter. Çelikte C ve N böyle yerleşir.', yig: 'Birkaç boş yer birleşti: <b>boşluk</b> oluştu, çevre çöküyor.' };
          let vac = [5, 3], hop = null;
          UI.loop(cv[0], 0.55, (ctx, W, H, st) => {
            ap = Math.min(1, ap + st.dt * 1.4); const s = Math.min(W / (cols + 1), H / (rows + 1)), ox = W / 2 - (cols - 1) * s / 2, oy = H / 2 - (rows - 1) * s / 2;
            const defs = []; const rem = new Set(); let extra = null, foreign = null;
            const key = (i, j) => i + ',' + j; let vs = mode === 'bos' ? [vac] : mode === 'fr' ? [[4, 3]] : mode === 'yig' ? [[5, 3], [6, 3], [5, 2], [6, 2]] : mode === 'ya' ? [] : [];
            vs.forEach(v => rem.add(key(v[0], v[1])));
            if (mode === 'ara') extra = { x: 5.5, y: 3.5, col: '#F5F5F5', r: 0.3, push: 0.2 }; if (mode === 'fr') extra = { x: 6.5, y: 3.5, col: '#F5F5F5', r: 0.3, push: 0.2 }; if (mode === 'yb') extra = { x: 5.5, y: 3.5, col: '#FF5A4D', r: 0.2, push: 0.1 };
            if (mode === 'ya') foreign = { i: 5, j: 3, col: '#FF5A4D', r: 0.5, push: 0.09 };
            if (mode === 'bos' && heat) { if (!hop) { if (Math.random() < st.dt * 1.8) { const d = [[1, 0], [-1, 0], [0, 1], [0, -1]][Math.floor(Math.random() * 4)], n = [vac[0] + d[0], vac[1] + d[1]]; if (n[0] > 0 && n[0] < cols - 1 && n[1] > 0 && n[1] < rows - 1) hop = { from: n.slice(), t: 0 }; } } else { hop.t += st.dt * 2.5; if (hop.t >= 1) { vac = hop.from; hop = null; } } }
            for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) {
              if (rem.has(key(i, j))) continue; let x = i, y = j, dx = 0, dy = 0;
              if (mode === 'bos' && hop && hop.from[0] === i && hop.from[1] === j) { dx = (vac[0] - i) * sm(hop.t, 0, 1); dy = (vac[1] - j) * sm(hop.t, 0, 1); }
              const sv = vs.length; const sources = vs.map(v => ({ x: v[0], y: v[1], k: -0.55 / Math.max(1, sv * 0.7) }));
              if (extra) sources.push({ x: extra.x, y: extra.y, k: extra.push * 2.2 }); if (foreign) sources.push({ x: foreign.i, y: foreign.j, k: foreign.push * 2.2 });
              sources.forEach(sc => { const rx = (i + dx) - sc.x, ry = (j + dy) - sc.y, d = Math.hypot(rx, ry) || 1; const f = sc.k * ap / (d * d + 0.8) * 0.45; dx += rx / d * f; dy += ry / d * f; });
              let col = '#6FB4FF'; const px = ox + (i + dx) * s, py = oy + (j + dy) * s;
              UI.atom(ctx, px, py, s * 0.33, foreign && foreign.i === i && foreign.j === j ? foreign.col : col);
            }
            vs.forEach(v => { const x = ox + v[0] * s, y = oy + v[1] * s; ctx.setLineDash([4, 3]); UI.circle(ctx, x, y, s * 0.33 * (mode === 'yig' ? 1.15 : 1) * ap + 1, null, 'rgba(255,255,255,.6)', 1.5); ctx.setLineDash([]); });
            if (extra) { const x = ox + extra.x * s, y = oy + extra.y * s; if (mode === 'fr') { UI.arrow(ctx, ox + 4 * s + 8, oy + 3 * s - 4, x - 10, y - 2, '#F5C542', 2); } UI.atom(ctx, x, y, s * extra.r, extra.col); }
            if (foreign) UI.atom(ctx, ox + foreign.i * s, oy + foreign.j * s, s * 0.41, foreign.col);
            UI.text(ctx, mode === 'ideal' ? 'İdeal kristal' : 'Sıfır boyutlu (nokta) hata · b = 0', 12, 16, '#fff', 13);
          });
          UI.setCap(w, ''); const upd = () => { $('.cap', $$('.widget', w)[0]).innerHTML = cap[mode]; }; setInterval(() => { if (document.body.contains(w)) upd(); }, 400); upd();
          let E = 0.74, Tk = 300; UI.bind(w, '#ev', v => E = v / 100, v => (v / 100).toFixed(2) + ' eV'); UI.bind(w, '#tk', v => Tk = v, v => v + ' K');
          UI.loop(cv[1], 0.4, (ctx, W, H) => {
            const L = 56, R = W - 14, tp = 14, bt = H - 28, X = t => L + (t - 300) / 1000 * (R - L), Y = lc => bt - (lc + 20) / 20 * (bt - tp); // log10 C: -20..0
            UI.line(ctx, L, bt, R, bt, '#3a4654', 1); UI.line(ctx, L, tp, L, bt, '#3a4654', 1); UI.text(ctx, 'log C_BY', 6, 10, '#8E99A6', 11);
            for (let e = -20; e <= 0; e += 5) { UI.line(ctx, L, Y(e), R, Y(e), '#1c242c', 1); UI.text(ctx, '10^' + e, L - 4, Y(e), '#8E99A6', 10, 'right'); }
            ctx.beginPath(); for (let t = 300; t <= 1300; t += 10) { const lc = -E / (8.617e-5 * t) / Math.LN10, x = X(t), y = Y(lc); t === 300 ? ctx.moveTo(x, y) : ctx.lineTo(x, y); } ctx.strokeStyle = OR; ctx.lineWidth = 2.4; ctx.stroke();
            const lc = -E / (8.617e-5 * Tk) / Math.LN10; UI.circle(ctx, X(Tk), Y(lc), 6, '#fff'); UI.text(ctx, 'T (K)', R, bt + 14, '#8E99A6', 11, 'right');
            UI.setCap(cv[1].closest('.widget'), `E = ${E.toFixed(2)} eV, T = ${Tk} K → boş yer oranı C = <b>${Math.pow(10, lc).toExponential(1)}</b> (yaklaşık ${Math.round(1 / Math.pow(10, lc)).toExponential(1)} atomda bir). Isıtınca <b>üstel</b> artar.`);
          });
        }
      },
      {
        id: 'kenar', title: 'Kenar dislokasyonu: kayma animasyonu', pg: 's.65-70',
        build(b) {
          b.innerHTML = `<p>Kristalin içinde <b>fazladan bir yarım atom düzlemi</b> var (⊥ işareti). Kayma gerilmesi uygulanınca bütün düzlemi birden değil, bu kusuru <b>bir atom aralığı</b> ilerleterek kaydırırız. Gerilmeyi artır.</p>
          <div class="widget"><canvas></canvas><div class="ctl"><label>Kayma gerilmesi τ <input type="range" min="0" max="100" value="0" id="ts"><output></output></label><button class="btn" id="rs">Sıfırla</button></div><div class="cap"></div></div>
          <div class="key"><ul><li><b>Kayma düzlemi:</b> atomların en sık dizildiği düzlem; kayma hep bu düzlemde olur (s.65).</li><li><b>Kenar dislokasyonu:</b> fazladan yarım düzlem. <b>Burger vektörü b, dislokasyon çizgisine DİK</b>; b = atom aralığı a (s.67).</li><li>τ kritik değeri (<b>τ<sub>kr</sub></b>) aşınca dislokasyon kayar; kristalin yüzeyine varınca <b>bir basamak (b kadar)</b> oluşur. Çok sayıda dislokasyon geçerse görünür plastik şekil değişimi olur.</li><li>Dislokasyon çizgisi uygulanan gerilmeye dik, hareket yönü çizgiye dik (s.71).</li></ul></div>
          <h3>Burger çemberi: b nasıl bulunur?</h3><div class="widget"><canvas></canvas><div class="cap">Mükemmel kristalde aynı sayıda adımlı çember kapanır. Dislokasyonlu kristalde <b>kapanmaz</b>; eksik kalan vektör <b>Burger vektörü b</b>'dir (s.67).</div></div>
          <h3>Neden dislokasyon kolaylaştırır? (halı benzetmesi)</h3><div class="widget"><canvas></canvas><div class="cap">Üstte: halıyı <b>tamamen</b> sürüklemek (rijit kayma) ağır. Altta: halıda <b>kabarık</b> ilerletmek: aynı yer değişimi çok az kuvvetle (dislokasyonlu kayma) (Şekil 6.3.8).</div></div>`;
          let tau = 0, xd = 2.0, steps = 0; const w = b, cv = $$('canvas', b), N = 14;
          UI.bind(w, '#ts', v => tau = v, v => '%' + v); $('#rs', w).onclick = () => { xd = 2; steps = 0; };
          UI.loop(cv[0], 0.52, (ctx, W, H, st) => {
            const s = Math.min(W / (N + 3), H / 9), ox = W / 2 - (N - 1) * s / 2, oy = H / 2 - 0.5 * s, rowsT = 3, rowsB = 3, ww = 1.4;
            const kr = 45; if (tau > kr) { xd += (tau - kr) / 55 * st.dt * 3.2; } if (xd > N + 1) { xd = N + 2; }
            const D = X => 0.5 - Math.atan((X - xd) / ww) / Math.PI;
            for (let r = -rowsB; r < rowsT; r++) { const top = r < 0; for (let i = 0; i < N; i++) { let u = 0; if (top) u = -D(i) / 2; else u = D(i) / 2; if (xd >= N + 1) u = top ? -0.5 : 0.5; const x = ox + (i + u) * s, y = oy + (r + (top ? 0.5 : 0.5) + (top ? 0.32 * Math.exp(-Math.pow((i - xd) / 2, 2)) * (r === -1 ? 1 : 0.3) : -0.22 * Math.exp(-Math.pow((i - xd) / 2, 2)) * (r === 0 ? 1 : 0.3))) * s * 0.95; const near = Math.abs(i - xd) < 0.8 && top; UI.atom(ctx, x, y, s * 0.33, near ? '#F5C542' : (top ? '#FFA95C' : '#6FB4FF')); } }
            UI.line(ctx, ox - s, oy + s * 0.5 * 0.95, ox + N * s, oy + s * 0.5 * 0.95, 'rgba(255,255,255,.25)', 1, [5, 4]); UI.text(ctx, 'kayma düzlemi', ox + N * s - 4, oy + s * 0.5 * 0.95 + 10, '#C9D0D8', 11, 'right');
            if (xd < N) { const cx = ox + xd * s; UI.text(ctx, '⊥', cx, oy + s * 0.5 * 0.95 - 4, '#FF2D20', 26, 'center'); }
            UI.arrow(ctx, ox + N * s * 0.5 + 40, oy - 3 * s - 8, ox + N * s * 0.5 - 40, oy - 3 * s - 8, 'rgba(255,255,255,' + (0.3 + 0.7 * tau / 100) + ')', 2 + tau / 30); UI.text(ctx, 'τ', ox + N * s * 0.5, oy - 3 * s - 22, '#fff', 14, 'center');
            UI.arrow(ctx, ox + N * s * 0.5 - 40, oy + 3 * s + 8, ox + N * s * 0.5 + 40, oy + 3 * s + 8, 'rgba(255,255,255,' + (0.3 + 0.7 * tau / 100) + ')', 2 + tau / 30);
            if (xd >= N + 1) UI.text(ctx, 'Yüzeyde bir BASAMAK (b) oluştu: kristal bir atom aralığı kadar kaydı', W / 2, H - 14, '#7FD99A', 14, 'center');
            const msg = tau <= kr ? (tau > 0 ? 'τ < τ_kr: dislokasyon yerinde duruyor (yalnız elastik gerilme)' : 'Sağ taraftan gerilme uygula') : xd < N + 1 ? 'τ > τ_kr: dislokasyon kayıyor (bir atom aralığı bir adımda)' : '';
            UI.text(ctx, msg, 12, 16, '#fff', 13);
          });
          UI.loop(cv[1], 0.36, (ctx, W, H) => {
            const s = Math.min(W / 14, H / 6.5); const draw = (ox, bad) => { const n = 5, pts = [[0, 0], [n, 0], [n, n], [0, n]]; const path = []; for (let i = 0; i <= n; i++) path.push([i, 0]); for (let i = 1; i <= n; i++) path.push([n, i]); for (let i = 1; i <= n; i++) path.push([n - i, n]); for (let i = 1; i <= n - (bad ? 1 : 0); i++) path.push([0, n - i]);
              for (let j = 0; j <= n; j++) for (let i = 0; i <= n; i++) if (!(bad && i === 2 && j > 3 && false)) UI.circle(ctx, ox + i * s, 12 + j * s, 2.8, '#6FB4FF'); if (bad) { for (let j = 3; j <= n; j++) UI.circle(ctx, ox + 2.0 * s, 12 + j * s, 4, 'rgba(255,169,92,.0)'); }
              ctx.beginPath(); path.forEach((p, i) => i ? ctx.lineTo(ox + p[0] * s, 12 + p[1] * s) : ctx.moveTo(ox + p[0] * s, 12 + p[1] * s)); ctx.strokeStyle = '#F5C542'; ctx.lineWidth = 2.4; ctx.stroke(); const last = path[path.length - 1]; UI.circle(ctx, ox, 12, 5, '#7FD99A'); if (bad) { UI.circle(ctx, ox + last[0] * s, 12 + last[1] * s, 5, '#FF5A4D'); UI.arrow(ctx, ox + last[0] * s, 12 + last[1] * s, ox, 12, '#FF5A4D', 2.5); UI.text(ctx, 'b', ox + 8, 12 + (n * s) / 2 + 2, '#FF5A4D', 16); } };
            draw(W * 0.14, false); draw(W * 0.62, true);
            UI.text(ctx, 'İdeal kristal: çember KAPANIR', W * 0.14 + 2.5 * s, H - 8, '#C9D0D8', 12, 'center'); UI.text(ctx, 'Dislokasyonlu: çember KAPANMAZ (b)', W * 0.62 + 2.5 * s, H - 8, '#C9D0D8', 12, 'center');
            UI.text(ctx, '(yeşil: başlangıç, kırmızı: bitiş)', W / 2, 10, '#8E99A6', 11, 'center');
          });
          UI.loop(cv[2], 0.55, (ctx, W, H, st) => {
            const fl = H * 0.46, fl2 = H * 0.92, len = W * 0.62, x0 = W * 0.08, ph = (st.t * 0.5) % 1;
            [[fl, 'A'], [fl2, 'B']].forEach(([y, k]) => { UI.line(ctx, 8, y, W - 8, y, '#3a4654', 3); UI.text(ctx, k === 'A' ? 'Rijit kayma' : 'Dislokasyonlu kayma', 10, y - H * 0.4, '#fff', 13); });
            const shift = ph * W * 0.12; ctx.fillStyle = '#FFA95C'; UI.roundRect(ctx, x0 + shift, fl - 14, len, 11, 4, '#FFA95C');
            UI.arrow(ctx, x0 + len + shift + 6, fl - 9, x0 + len + shift + 50, fl - 9, '#fff', 3); const f1 = 1; UI.text(ctx, 'kuvvet', W - 14, fl - 30, '#FF5A4D', 12, 'right'); UI.roundRect(ctx, W - 120, fl - 22, 106 * f1, 6, 3, '#FF5A4D');
            const hump = x0 + ph * len * 0.9; ctx.beginPath(); ctx.moveTo(x0, fl2 - 3); for (let x = x0; x <= x0 + len; x += 3) { const d = (x - hump) / 18, h = 18 * Math.exp(-d * d); ctx.lineTo(x + (x > hump ? 0 : ph * W * 0.12 * 0.2), fl2 - 8 - h); } ctx.lineTo(x0 + len, fl2 - 3); ctx.closePath(); ctx.fillStyle = '#FFA95C'; ctx.fill();
            UI.arrow(ctx, hump + 28, fl2 - 36, hump + 60, fl2 - 36, '#fff', 2); UI.roundRect(ctx, W - 120, fl2 - 22, 106 * 0.06, 6, 3, '#7FD99A'); UI.text(ctx, 'küçük kuvvet', W - 14, fl2 - 30, '#7FD99A', 12, 'right');
          });
        }
      },
      {
        id: 'vida', title: 'Vida dislokasyonu, kayma ve tırmanma', pg: 's.68-74',
        build(b) {
          b.innerHTML = `<p>Kristal bir çizgi boyunca <b>yarılıp bir atom aralığı kaydırılmış</b> gibi düşün: atom düzlemleri bir <b>sarmal merdiven (rampa)</b> hâline gelir. Sürükle ve çevir.</p>
          <div class="widget drag"><canvas></canvas><div class="ctl"><span class="seg" id="sc"><button data-v="screw" class="on">Vida dislokasyonu</button></span><label><input type="checkbox" id="bv" checked> Burger vektörü</label></div><div class="cap"></div></div>
          <div class="wrap"><table><tr><th></th><th>Kenar dislokasyonu</th><th>Vida dislokasyonu</th></tr><tr><td>Burger vektörü b ve çizgi</td><td><b>b ⊥ çizgi</b></td><td><b>b ∥ çizgi</b></td></tr><tr><td>Görüntü</td><td>Fazladan yarım düzlem</td><td>Sarmal rampa (vida)</td></tr><tr><td>Hareket</td><td>Kayma yönü = b</td><td>Kayma yönü çizgiye dik, b'ye dik</td></tr></table></div>
          <h3>Tırmanma: dislokasyon yukarı çıkabilir mi?</h3>
          <div class="widget"><canvas></canvas><div class="ctl"><button class="btn" id="vb">Boş yer gönder</button><button class="btn" id="vr">Sıfırla</button></div><div class="cap"></div></div>
          <div class="key"><ul><li><b>Kayma:</b> dislokasyonun <b>kayma düzlemi içinde</b> hareketi. <b>Tırmanma:</b> kayma düzlemine <b>dik</b> hareket; boş yerlerin yayınmasıyla olur, <b>yüksek sıcaklık</b> ister (s.70).</li><li><b>Peierls–Nabarro kuvveti:</b> kristalin dislokasyonun kaymasına gösterdiği sürtünme direnci (s.70).</li><li><b>Dislokasyon enerjisi:</b> çevre atomların normal konumdan sapmasından doğan potansiyel enerji artışı (s.71).</li><li><b>Dislokasyon yoğunluğu</b> (çizgi uzunluğu/hacim): <b>10⁶–10¹² cm/cm³</b> (Çizelge 6.3.1, s.62, 72). Soğuk şekillendirme yoğunluğu arttırır: dislokasyonlar birbirini engeller, malzeme <b>pekleşir</b>.</li><li>Dislokasyonlar bağlandıkları yerlerde (tane sınırı, yüzey, diğer dislokasyon) biter; <b>ucu boşta dislokasyon yoktur</b> (s.71).</li></ul></div>`;
          const w = b, cv = $$('canvas', b); let bv = true; $('#bv', w).onchange = e => bv = e.target.checked;
          UI.view3d(cv[0], 0.62, (ctx, P, st, v) => {
            const R0 = 1.1, H = 1.0, turns = 3.2, segs = [];
            for (let k = 0; k <= 14; k++) { const r = 0.08 + (R0 - 0.08) * k / 14; ctx.beginPath(); for (let a = 0; a <= turns * 6.2832; a += 0.18) { const p = P(r * Math.cos(a), r * Math.sin(a), -0.9 + H * a / 6.2832 * 0.55); a ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y); } ctx.strokeStyle = 'rgba(255,169,92,' + (0.25 + 0.6 * k / 14) + ')'; ctx.lineWidth = 1.2; ctx.stroke(); }
            for (let a = 0; a < turns * 6.2832; a += 0.5236) { const p0 = P(0.08 * Math.cos(a), 0.08 * Math.sin(a), -0.9 + H * a / 6.2832 * 0.55), p1 = P(R0 * Math.cos(a), R0 * Math.sin(a), -0.9 + H * a / 6.2832 * 0.55); UI.line(ctx, p0.x, p0.y, p1.x, p1.y, 'rgba(255,169,92,.55)', 1.3); }
            const A = P(0, 0, -1.05), B = P(0, 0, 1.3); UI.line(ctx, A.x, A.y, B.x, B.y, '#F5C542', 3); UI.text(ctx, 'dislokasyon çizgisi', B.x + 12, B.y, '#F5C542', 12);
            if (bv) { const A2 = P(0.0, 1.35, -0.2), B2 = P(0.0, 1.35, 0.55); UI.arrow(ctx, A2.x, A2.y, B2.x, B2.y, '#FF5A4D', 3); UI.text(ctx, 'b ∥ çizgi', B2.x + 10, (A2.y + B2.y) / 2, '#FF5A4D', 13); }
            UI.text(ctx, 'Atom düzlemleri çizgi etrafında sarmal bir rampa oluşturur', 12, 18, '#fff', 13);
          }, { pitch: 0.55 });
          UI.setCap($$('.widget', w)[0], 'Çizgi etrafında bir tur dönen yol, bir atom aralığı yükselir: <b>vida</b> gibi. Kenar dislokasyonundan farkı: <b>b çizgiye paralel</b>.');
          let steps = 0, anim = null; const cols = 9;
          $('#vb', w).onclick = () => { if (!anim && steps < 3) anim = { t: 0 }; }; $('#vr', w).onclick = () => { steps = 0; anim = null; };
          UI.loop(cv[1], 0.52, (ctx, W, H, st) => {
            const s = Math.min(W / (cols + 3), H / 9), ox = W / 2 - (cols - 1) * s / 2, oy = H / 2 - 3 * s; let a = anim ? Math.min(1, anim.t) : 0; if (anim) { anim.t += st.dt * 0.7; if (anim.t >= 1) { steps++; anim = null; a = 0; } }
            const bottom = 2 + steps; // yarım düzlemin alt ucu satırı
            for (let r = 0; r <= 6; r++) for (let c = 0; c < cols; c++) { const x = ox + c * s, y = oy + r * s, hp = c === 4 && r <= 2 + steps; UI.atom(ctx, x, y, s * 0.33, hp ? '#FFA95C' : '#6FB4FF'); }
            const cy = oy + (2 + steps) * s + s * 0.55; UI.text(ctx, '⊥', ox + 4 * s, cy, '#FF2D20', 24, 'center');
            if (anim) { const vx = ox + 4 * s + s * 1.2 * (1 - sm(anim.t, 0, 0.6)), vy = oy + (3 + steps) * s; UI.circle(ctx, vx + (anim.t < 0.6 ? 0 : 0), vy, s * 0.3, null, 'rgba(255,255,255,.7)', 1.6); UI.text(ctx, 'boş yer', vx + s * 0.5, vy + s * 0.55, '#fff', 11); }
            UI.arrow(ctx, ox - s, oy + s * 6.5, ox - s, oy + s * 4, '#7FD99A', 2); UI.text(ctx, 'tırmanma', ox - s + 6, oy + s * 5.4, '#7FD99A', 12);
            UI.text(ctx, `Tırmanma adımı: ${steps}`, W - 12, 16, '#F5C542', 14, 'right'); UI.setCap(cv[1].closest('.widget'), steps ? 'Boş yer yarım düzlemin alt atomunu aldı: yarım düzlem kısaldı, dislokasyon <b>kayma düzlemine dik</b> yukarı çıktı. Bu bir <b>yayınma</b> olayıdır.' : 'Boş yeri dislokasyon çekirdeğine gönder: yarım düzlemin alttaki atomu boş yere geçer.');
          });
        }
      },
      {
        id: 'dizgi', title: 'Dizgi hatası: katmanların dizilişi', pg: 's.74-76',
        build(b) {
          b.innerHTML = `<p>Sıkı paketlenmiş düzlemler üst üste farklı biçimde oturabilir. <b>YMK: ABCABC…</b> · <b>SDH: ABAB…</b>. Dizgi hatası bu düzenin bir yerde bozulmasıdır.</p>
          <div class="widget"><canvas></canvas><div class="ctl"><span class="seg" id="sq"><button data-v="ymk" class="on">YMK ABCABC</button><button data-v="sdh">SDH ABAB</button><button data-v="hata">YMK + dizgi hatası</button></span></div><div class="cap"></div></div>
          <div class="key"><ul><li><b>YMK</b> sıkı paket düzlemleri <b>ABCABC…</b> (3 farklı konum, 3 katta tekrar). <b>SDH</b> ise <b>ABAB…</b> (2 konum) (s.75).</li><li><b>Dizgi hatası:</b> kayma düzlemi dizilişlerinin ideal sıradan sapması (örn. ABCAB<u>AB</u>C: bir C katı yok, orada SDH dizilişi oluştu). <b>Çizgi (1 boyutlu)</b> hata sınıfındadır (s.74-76).</li></ul></div>`;
          let sq = 'ymk'; UI.seg(b, '#sq', v => sq = v);
          const seqs = { ymk: 'ABCABCABC', sdh: 'ABABABABA', hata: 'ABCABABCA' }, tx = { ymk: 'A=0, B=1/3, C=2/3: her katman bir önceki çukuruna oturur, 3. kat sonra tekrar', sdh: 'Üçüncü kat doğrudan birinci katın üstüne gelir', hata: 'Bir C katı eksik: ABCAB|ABC. AB ABAB gibi kısa bir SDH bölgesi oluştu (kırmızı)' };
          const colr = { A: '#FF9E9E', B: '#6FB4FF', C: '#7FD99A' };
          UI.loop($('canvas', b), 0.62, (ctx, W, H, st) => {
            const s = seqs[sq], n = s.length, ly = Math.min((H - 30) / (n + 0.6), 38), cx = W * 0.32, d = Math.min(ly * 1.1, 34), off = { A: 0, B: d / 3 * 2 * 0.5 * 1.5, C: d * 1.0 };
            for (let k = 0; k < n; k++) { const y = H - 20 - k * ly, c = s[k]; for (let i = -3; i <= 3; i++) { const x = cx + i * d * 1.5 + off[c] - d * 0.5; UI.atom(ctx, x, y, d * 0.5, colr[c]); } UI.text(ctx, c, cx - 3 * d * 1.5 - d * 1.1, y, colr[c], 15, 'center'); }
            if (sq === 'hata') { UI.roundRect(ctx, cx - 3.9 * d * 1.5, H - 20 - 6 * ly - ly * 0.55, 7.8 * d * 1.5, ly * 3 * 0.99 + 4, 8, null, '#FF5A4D'); }
            UI.text(ctx, 'Yan görünüş: katmanlar', 12, 14, '#8E99A6', 12);
            const tx0 = W * 0.7, ty = H * 0.45, R = Math.min(W * 0.14, 50); UI.text(ctx, 'Üstten görünüş', tx0, 14, '#8E99A6', 12, 'center');
            const hexPts = (px, py, rr, col, al) => { for (let i = -2; i <= 2; i++) for (let j = -2; j <= 2; j++) { const x = px + (i + j * 0.5) * rr * 2, y = py + j * rr * 1.732; if (Math.hypot(x - px, y - py) < rr * 4.2) { ctx.globalAlpha = al; UI.circle(ctx, x, y, rr * 0.97, col); ctx.globalAlpha = 1; } } };
            const r0 = R * 0.4; hexPts(tx0, ty, r0, 'rgba(255,158,158,.55)', 1); const hb = (dx, dy, col) => { for (let i = -2; i <= 2; i++) for (let j = -2; j <= 2; j++) { const x = tx0 + (i + j * 0.5) * r0 * 2 + dx, y = ty + j * r0 * 1.732 + dy; if (Math.hypot(x - tx0, y - ty) < r0 * 4) UI.circle(ctx, x, y, r0 * 0.42, col); } };
            hb(r0, r0 * 0.577, 'rgba(111,180,255,.95)'); if (s.includes('C')) hb(r0 * 2, 0, 'rgba(127,217,154,.9)'); UI.text(ctx, 'A: büyük · B, C: A\'nın üç\'lü çukurlarına', tx0, H - 12, '#C9D0D8', 11, 'center');
            UI.setCap(b, `Dizilim: <b>${s}</b> — ${tx[sq]}`);
          });
        }
      },
      {
        id: 'duzlem', title: 'Düzlem hataları: tane, ikiz ve faz sınırı', pg: 's.77-79',
        build(b) {
          b.innerHTML = `<p>Atom düzenin bir yüzey boyunca değiştiği hatalar. Tane sınırında iki kristalin <b>yönü</b> farklı, faz sınırında iki bölgenin <b>cinsi</b> farklı, ikiz sınırında bir taraf diğerinin <b>ayna görüntüsü</b>.</p>
          <div class="widget"><canvas></canvas><div class="ctl"><span class="seg" id="pl"><button data-v="tane" class="on">Tane sınırı</button><button data-v="ikiz">İkiz sınırı</button><button data-v="faz">Faz sınırı</button></span><label id="lb">Yönelim farkı θ <input type="range" min="2" max="40" value="6" id="th"><output></output></label></div><div class="cap"></div></div>
          <div class="key"><ul><li><b>Tane (kristal):</b> içinde kafes sistemi aynı, kayma düzlemleri benzer, kimyasal yapısı aynı katı bölge. <b>Tane sınırı:</b> taneleri ayıran yüzey (s.77).</li><li><b>Dar açılı</b> tane sınırı: yönelim farkı <b>10°'den küçük</b> (dislokasyon dizisi gibi); <b>geniş açılı</b>: 10°'den büyük (s.78).</li><li><b>İkiz sınırı:</b> iki tarafın birbirinin ayna görüntüsü (s.77-78). Kafes sınırda <b>bozulmadan</b> devam eder, enerjisi düşüktür.</li><li><b>Faz:</b> kendi içinde homojen, çevresinden kimyasal veya fiziksel yapıca farklı bölge. <b>Faz sınırı</b> iki farklı fazı ayırır (s.78-79).</li></ul></div>`;
          let pl = 'tane', th = 6; UI.seg(b, '#pl', v => { pl = v; $('#lb', b).firstChild.textContent = v === 'faz' ? 'Boyut farkı δ ' : v === 'ikiz' ? 'Ayna açısı ' : 'Yönelim farkı θ '; const t = $('#th', b); if (t) t.dispatchEvent(new Event('input')); });
          UI.bind(b, '#th', v => th = v, v => pl === 'faz' ? v + '%' : v + '°');
          UI.loop($('canvas', b), 0.56, (ctx, W, H, st) => {
            const s = Math.min(W / 18, H / 11), cx = W / 2, cy = H / 2, rad = th * Math.PI / 180;
            ctx.save(); ctx.beginPath(); ctx.rect(0, 0, W, H); ctx.clip();
            if (pl === 'tane') {
              const pts = (sign, side) => { const out = []; for (let i = -22; i <= 22; i++) for (let j = -14; j <= 14; j++) { const a = sign * rad / 2, x = i * s * 0.8, y = j * s * 0.8, X = x * Math.cos(a) - y * Math.sin(a), Y = x * Math.sin(a) + y * Math.cos(a); if (side * X > 3) out.push([cx + X, cy + Y]); } return out; };
              const L = pts(1, -1), R = pts(-1, 1); const all = [];
              L.forEach(p => all.push([p, '#6FB4FF'])); R.forEach(p => all.push([p, '#FFA95C']));
              const near = all.filter(a => Math.abs(a[0][0] - cx) < s * 1.1);
              all.forEach(a => { const dmin = Math.min(...near.map(q => q === a ? 99 : Math.hypot(q[0][0] - a[0][0], q[0][1] - a[0][1]))); const edge = Math.abs(a[0][0] - cx) < s * 0.9; if (a[0][0] > 4 && a[0][0] < W - 4 && a[0][1] > 4 && a[0][1] < H - 4) UI.atom(ctx, a[0][0], a[0][1], s * 0.24, edge ? '#FF5A4D' : a[1]); });
              UI.line(ctx, cx, 6, cx, H - 6, 'rgba(255,255,255,.22)', 1, [4, 4]);
              if (th < 10) { const spc = Math.max(s * 1.6, 0.8 * s / Math.sin(rad / 2) / 2); for (let y = cy % spc; y < H; y += spc) UI.text(ctx, '⊥', cx, y, '#F5C542', 20, 'center'); }
              UI.text(ctx, th < 10 ? `DAR AÇILI sınır (θ = ${th}° < 10°): sıralı dislokasyonlar` : `GENİŞ AÇILI sınır (θ = ${th}° > 10°): düzensiz bölge`, 12, 16, th < 10 ? '#F5C542' : '#FF9E9E', 14);
              UI.setCap(b, 'Kırmızı atomlar sınır bölgesi: <b>düzensiz, enerjisi yüksek</b>. Açı büyüdükçe sınır enerjisi artar; bu bölge korozyona ve difüzyona açıktır.');
            } else if (pl === 'ikiz') {
              const a = (20 + th * 0.6) * Math.PI / 180; for (let i = -22; i <= 22; i++) for (let j = 0; j <= 14; j++) { const x = i * s * 0.8, y = j * s * 0.8, X = x * Math.cos(a) - y * Math.sin(a), Y = x * Math.sin(a) + y * Math.cos(a); const pt = [cx + X, cy + Y + 2]; if (pt[0] > 4 && pt[0] < W - 4 && pt[1] > cy + 2 && pt[1] < H - 4) UI.atom(ctx, pt[0], pt[1], s * 0.24, '#6FB4FF'); const q = [cx + X, cy - Y - 2]; if (q[0] > 4 && q[0] < W - 4 && q[1] < cy - 2 && q[1] > 4) UI.atom(ctx, q[0], q[1], s * 0.24, '#FFA95C'); }
              UI.line(ctx, 6, cy, W - 6, cy, '#F5C542', 2); UI.text(ctx, 'ikiz düzlemi (ayna)', W - 12, cy - 10, '#F5C542', 13, 'right'); UI.text(ctx, 'İKİZ SINIRI: üst yarı alt yarının ayna görüntüsü', 12, 16, '#fff', 14);
              UI.setCap(b, 'Üst ve alt kristal <b>aynı kafes</b>, yalnız ayna simetrisiyle yönlenmiş; sınırda atomlar iki tarafa da uyar, bu yüzden <b>enerji düşüktür</b>. İkizlenme plastik şekillenmede de görülür (Bölüm 7).');
            } else {
              const d = th / 100, s1 = s * 0.8, s2 = s1 * (1 + d); const n = 14;
              for (let j = -n; j <= n; j++) { const y1 = cy + j * s1, y2 = cy + j * s2; for (let i = 1; i <= 7; i++) { const x1 = cx - i * s1, x2 = cx + i * s2; if (y1 > 4 && y1 < H - 4 && x1 > 4) UI.atom(ctx, x1, y1, s * 0.24, '#6FB4FF'); if (y2 > 4 && y2 < H - 4 && x2 < W - 4) UI.atom(ctx, x2, y2, s * 0.26, '#FFA95C'); }
                if (y1 > 4 && y1 < H - 4 && y2 > 4 && y2 < H - 4) { const mis = Math.abs(y1 - y2); if (mis < s1 * 0.35) UI.line(ctx, cx - s1, y1, cx + s2, y2, '#7FD99A', 1.6); else if (mis < s1 * 0.6) UI.line(ctx, cx - s1, y1, cx + s2, y2, 'rgba(255,90,77,.5)', 1, [3, 3]); } }
              UI.line(ctx, cx, 6, cx, H - 6, 'rgba(255,255,255,.2)', 1, [4, 4]);
              UI.text(ctx, d < 0.05 ? 'UYUMLU (koherent) faz sınırı' : d < 0.14 ? 'YARI UYUMLU: bazı satırlar uyuşmuyor (dislokasyon)' : 'UYUMSUZ (inkoherent) faz sınırı', 12, 16, d < 0.05 ? '#7FD99A' : d < 0.14 ? '#F5C542' : '#FF9E9E', 14);
              UI.setCap(b, 'Mavi ve turuncu iki <b>farklı faz</b> (atom cinsi/kafes aralığı farklı). Boyut farkı arttıkça yeşil bağlantılar kopar: sınırda <b>uyumsuzluk</b> birikir ve enerji yükselir.');
            }
            ctx.restore();
          });
        }
      },
      {
        id: 'hacim', title: 'Hacimsel hatalar: gaz, kalıntı, segregasyon', pg: 's.80',
        build(b) {
          b.innerHTML = `<p>Üç boyutlu, görünür büyüklükte hatalar: <b>çok tanelilik, gaz habbeleri, metalik ve ametalik fazlar, intermetalik faz, kalıntılar ve segregasyon</b> (s.80). Seç ve gör.</p>
          <div class="widget"><canvas></canvas><div class="ctl"><span class="seg" id="hv"><button data-v="gaz" class="on">Gaz habbeleri</button><button data-v="kal">Kalıntılar (MnS, WC…)</button><button data-v="int">Intermetalik faz</button><button data-v="seg">Segregasyon (ingot)</button></span></div><div class="cap"></div></div>
          <div class="key"><ul><li><b>Gaz habbeleri:</b> ergiyikten çıkamayan gaz kabarcıkları.</li><li><b>Kalıntılar:</b> cevherden veya katkılardan gelen ametalik parçacıklar (örn. MnS, oksit) (s.80).</li><li><b>Intermetalik faz:</b> iki metalin kimyasal bileşiği; sert ve gevrek (örn. çelikte FeCr σ fazı).</li><li><b>Segregasyon (ayrışma):</b> kimyasal bileşimi farklı bölgeler. Külçede (ingot) bileşim merkezden kenara değişir: Şekil 6.3.21 (%0,04 → %0,10 C).</li></ul></div>`;
          let m = 'gaz'; UI.seg(b, '#hv', v => m = v); const R = seeded(9), cells = []; for (let i = 0; i < 70; i++) cells.push([R(), R(), R()]);
          const things = Array.from({ length: 16 }, () => [R(), R(), R()]);
          UI.loop($('canvas', b), 0.5, (ctx, W, H, st) => {
            if (m === 'seg') {
              const zones = [['%0,04 C', '#3a4a6a'], ['%0,05 C', '#4b6a94'], ['%0,06 C', '#6b8fb8'], ['%0,08 C', '#d6a24f'], ['%0,10 C', '#FF5A4D']], bw = W * 0.5, bh = H * 0.86, bx = W * 0.08, by = H * 0.07;
              zones.forEach((z, i) => { const inset = i * Math.min(bw, bh) * 0.1; UI.roundRect(ctx, bx + inset, by + inset * 0.8, bw - 2 * inset, bh - 1.6 * inset, 14 - i * 2, z[1]); UI.text(ctx, z[0], bx + bw + 24, by + 20 + i * (bh - 40) / 4, z[1], 14); UI.line(ctx, bx + bw + 14, by + 20 + i * (bh - 40) / 4, bx + inset + (bw - 2 * inset) / 2 + 24 * (i === 4 ? 1 : 0), by + 20 + i * (bh - 40) / 4, 'rgba(255,255,255,.2)', 1); });
              UI.text(ctx, 'Külçe kesiti: en son katılaşan merkez, yabancı elementçe zengin', 12, H - 8, '#C9D0D8', 12); UI.setCap(b, '<b>Segregasyon:</b> ilk katılaşan kenar saf, son katılaşan merkez zengin. Sonuç: aynı külçede bileşim ve özellik farklı.');
              return;
            }
            const gs = Math.min(W, H) / 8; for (let j = -1; j < H / (gs * 0.87) + 1; j++) for (let i = -1; i < W / gs + 1; i++) { const x = i * gs + (j % 2) * gs / 2, y = j * gs * 0.87, c = cells[(i + 3 + j * 7 + 140) % cells.length]; ctx.beginPath(); for (let k = 0; k < 6; k++) { const a = k * Math.PI / 3 + Math.PI / 6; k ? ctx.lineTo(x + Math.cos(a) * gs * 0.58, y + Math.sin(a) * gs * 0.58) : ctx.moveTo(x + Math.cos(a) * gs * 0.58, y + Math.sin(a) * gs * 0.58); } ctx.closePath(); ctx.fillStyle = `hsl(${205 + c[2] * 30},${20 + c[0] * 12}%,${24 + c[1] * 10}%)`; ctx.fill(); ctx.strokeStyle = '#0B0E12'; ctx.lineWidth = 1.5; ctx.stroke(); }
            things.forEach((t, i) => { const x = t[0] * W, y = t[1] * H; if (m === 'gaz') { UI.circle(ctx, x, y + Math.sin(st.t * 1.2 + i) * 3, 6 + t[2] * 14, 'rgba(255,255,255,.12)', '#E8ECF0', 1.6); } else if (m === 'kal') { ctx.save(); ctx.translate(x, y); ctx.rotate(t[2] * 2.4); ctx.fillStyle = '#0B0E12'; ctx.beginPath(); ctx.ellipse(0, 0, 16 + t[2] * 18, 4 + t[2] * 5, 0, 0, 6.2832); ctx.fill(); ctx.strokeStyle = '#FF9E9E'; ctx.lineWidth = 1.2; ctx.stroke(); ctx.restore(); } else { ctx.save(); ctx.translate(x, y); ctx.rotate(t[2] * 3); ctx.beginPath(); for (let k = 0; k < 5; k++) { const a = k * 6.2832 / 5, r = 10 + t[2] * 10 + (k % 2 ? 4 : 0); k ? ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r) : ctx.moveTo(Math.cos(a) * r, Math.sin(a) * r); } ctx.closePath(); ctx.fillStyle = '#FFA95C'; ctx.fill(); ctx.restore(); } });
            UI.setCap(b, { gaz: 'Yuvarlak boşluklar: <b>gaz habbeleri</b> mukavemeti düşürür, gerilme yığar.', kal: 'Koyu uzun parçacıklar: <b>kalıntılar</b> (ör. MnS); çatlak başlangıç noktası olabilir.', int: 'Köşeli turuncu parçacıklar: <b>intermetalik faz</b>, sert ve gevrek.' }[m]);
          });
        }
      }
    ]
  };
})();
