(function () {
  const UI = window.UI, $ = UI.$, $$ = UI.$$;
  const sm = (x, a, b) => { const t = UI.clamp((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };
  function seeded(seed) { let s = seed >>> 0 || 1; return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; }; }

  window.CH[5] = {
    intro: 'Sıvı metal nasıl katı olur? Ergiyen atomlar önce küçük kümeler, sonra kristaller (taneler) oluşturur. Taneler ne kadar ince ya da yönlü olursa malzemenin mukavemeti ve davranışı o kadar değişir. Bölümün hepsi bu hikâyeyi anlatıyor.',
    sections: [
      {
        id: 'erime', title: 'Ergime: ısı atomları nasıl çözer?', pg: 's.47-50',
        build(b) {
          b.innerHTML = `<p>Kristalde atomlar yerlerinde titrer. Isı verdikçe <b>titreşim genliği</b> artar. Bir noktada genlik o kadar büyür ki katı hâl korunamaz: <b>ergime</b>. Isı miktarını artır ve iki malzemeyi karşılaştır.</p>
          <div class="widget"><canvas></canvas><div class="ctl"><span class="seg" id="mm"><button data-v="k" class="on">Kristal (metal)</button><button data-v="a">Amorf (cam, plastik)</button></span><label>Verilen ısı <input type="range" min="0" max="100" value="0" id="qq"><output></output></label><button class="btn" id="au">Otomatik ısıt</button></div><div class="cap"></div></div>
          <div class="key"><ul><li><b>Ergime noktası:</b> titreşim genliğinin ısıyla artıp katı hâlin korunamadığı kritik sıcaklık (s.48).</li><li>Ergime sırasında <b>sıcaklık sabit kalır</b>: verilen ısı <b>ergime ısısına ΔH<sub>E</sub></b> dönüşür, titreşim enerjisine değil (s.48).</li><li>ΔH<sub>E</sub> = T<sub>E</sub>·ΔS<sub>E</sub>; metallerde ΔS<sub>E</sub> ≈ 8 J/(mol·K).</li><li><b>Amorf yapıların</b> (cam, plastik) <b>belirli ergime noktası yoktur</b>; yavaş yavaş yumuşarlar (s.48).</li></ul></div>`;
          let mode = 'k', Q = 0, auto = false; const inp = $('#qq', b);
          UI.seg(b, '#mm', v => { mode = v; }); UI.bind(b, '#qq', v => Q = v, v => '%' + Math.round(v));
          $('#au', b).onclick = () => { auto = !auto; if (auto && Q >= 99) { Q = 0; inp.value = 0; } };
          const R = seeded(5), cols = 12, rows = 8, at = []; for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) at.push({ hx: c + (r % 2) * 0.5, hy: r * 0.866, f: R(), p: [R() * 6, R() * 6, R() * 6, R() * 6], dx: R() - 0.5, dy: R() - 0.5 });
          const Tof = (m, q) => { if (m === 'k') { if (q < 30) return 0.6 * q / 30; if (q < 60) return 0.6; return 0.6 + 0.4 * (q - 60) / 40; } return q / 100 * 0.95; };
          UI.loop($('canvas', b), 0.5, (ctx, W, H, st) => {
            if (auto) { Q = Math.min(100, Q + st.dt * 9); inp.value = Q; inp.dispatchEvent(new Event('input')); if (Q >= 100) auto = false; }
            const T = Tof(mode, Q), melt = mode === 'k' ? UI.clamp((Q - 30) / 30, 0, 1) : sm(Q / 100, 0.3, 0.85);
            const bw = W * 0.54, sp = Math.min(bw / (cols + 1), H / (rows * 0.866 + 1.6)), ox = 18 + sp * 0.8, oy = 30 + sp * 0.5;
            UI.roundRect(ctx, 6, 6, bw, H - 12, 8, '#0B1016', '#2A323C');
            const amp = (0.04 + 0.12 * Math.min(1, T / 0.6)) * sp;
            at.forEach(a => {
              const free = mode === 'k' ? sm(melt, a.f * 0.96, a.f * 0.96 + 0.05) * (melt > 0 ? 1 : 0) : UI.clamp((melt - a.f * 0.85) / 0.15, 0, 1);
              const dis = mode === 'a' ? 0.55 : 0;
              let x = a.hx * sp + a.dx * dis * sp, y = a.hy * sp + a.dy * dis * sp;
              x += Math.sin(st.t * 9 + a.p[0]) * amp + Math.cos(st.t * 7 + a.p[1]) * amp * 0.5; y += Math.cos(st.t * 8 + a.p[2]) * amp + Math.sin(st.t * 6 + a.p[3]) * amp * 0.5;
              x += free * (Math.sin(st.t * 1.7 + a.p[0] * 3) * sp * 1.1 + Math.sin(st.t * 0.9 + a.p[1]) * sp * 0.7); y += free * (Math.cos(st.t * 1.3 + a.p[2] * 3) * sp * 1.0 + Math.cos(st.t * 0.7 + a.p[3]) * sp * 0.6);
              const px = UI.clamp(ox + x, 14, 6 + bw - 14), py = UI.clamp(oy + y, 14, H - 20);
              const hot = UI.clamp(T, 0, 1), col = `rgb(${Math.round(111 + 144 * hot)},${Math.round(180 - 90 * hot)},${Math.round(255 - 178 * hot)})`; UI.circle(ctx, px, py, sp * 0.36, col, 'rgba(0,0,0,.35)', 1);
            });
            UI.text(ctx, melt <= 0 ? (mode === 'k' ? 'KATI' : 'KATI (amorf)') : melt >= 1 ? 'SIVI' : (mode === 'k' ? 'ERİYOR  %' + Math.round(melt * 100) + ' sıvı' : 'YUMUŞUYOR'), 16, 20, '#fff', 14, 'left', 'Bahnschrift, sans-serif');
            const L = bw + 50, Rr = W - 14, tp = 24, bt = H - 34, X = q => L + q / 100 * (Rr - L), Y = t => bt - t * (bt - tp);
            UI.line(ctx, L, bt, Rr, bt, '#3a4654', 1); UI.line(ctx, L, tp, L, bt, '#3a4654', 1); UI.text(ctx, 'sıcaklık', L + 4, 12, '#8E99A6', 11); UI.text(ctx, 'verilen ısı →', Rr, bt + 16, '#8E99A6', 11, 'right');
            ctx.beginPath(); for (let q = 0; q <= 100; q += 1) { const x = X(q), y = Y(Tof(mode, q)); q ? ctx.lineTo(x, y) : ctx.moveTo(x, y); } ctx.strokeStyle = 'rgba(255,255,255,.2)'; ctx.lineWidth = 2; ctx.stroke();
            ctx.beginPath(); for (let q = 0; q <= Q; q += 1) { const x = X(q), y = Y(Tof(mode, q)); q ? ctx.lineTo(x, y) : ctx.moveTo(x, y); } ctx.strokeStyle = '#C79CFF'; ctx.lineWidth = 3; ctx.stroke(); UI.circle(ctx, X(Q), Y(T), 5, '#fff');
            if (mode === 'k') { UI.line(ctx, L, Y(0.6), Rr, Y(0.6), 'rgba(199,156,255,.4)', 1, [4, 4]); UI.text(ctx, 'T_E', L - 6, Y(0.6), '#C79CFF', 12, 'right'); UI.text(ctx, 'ΔH_E: ısı verilir, sıcaklık sabit', X(45), Y(0.6) - 12, '#C9D0D8', 11, 'center'); }
            else UI.text(ctx, 'belirli bir ergime noktası yok', X(55), Y(0.3), '#C9D0D8', 12, 'center');
          });
          UI.setCap(b, 'Kristalde eğri <b>plato</b> yapar (ergime sabit sıcaklıkta). Amorfta plato yok: yapı sıcaklıkla yavaş yavaş gevşer.');
        }
      },
      {
        id: 'amorf', title: 'Kristal mi, amorf mu? n = 8 − N kuralı', pg: 's.50-51',
        build(b) {
          b.innerHTML = `<p>Katılaşan malzeme <b>düzenli (kristal)</b> ya da <b>düzensiz (amorf)</b> bir iç yapı kurar. Metaller çoğu zaman kristalleşir; plastikler ve camlar amorftur.</p>
          <div class="widget"><canvas></canvas><div class="ctl"><span class="seg" id="gn"><button data-v="4" class="on">N = 4 (C, Si)</button><button data-v="5">N = 5 (As, Sb)</button><button data-v="6">N = 6 (Se, Te)</button><button data-v="7">N = 7 (halojen)</button></span></div><div class="cap"></div></div>
          <div class="key"><ul><li><b>Kristal yapı:</b> düzenli mikroyapı. <b>Amorf yapı:</b> düzensiz katılaşmış mikroyapı. Plastik ve camlar amorftur (s.50).</li><li>Kovalent bağlı elementlerin koordinasyon sayısı <b>n = 8 − N</b> (N: değerlik, n: en yakın komşu). Bu kurala uyanlar periyodik cetvelde <b>metal–ametal sınır bölgesindedir</b> (s.51).</li></ul></div>`;
          let N = 4; UI.seg(b, '#gn', v => N = +v);
          UI.loop($('canvas', b), 0.4, (ctx, W, H, st) => {
            const n = 8 - N, cx = W * 0.3, cy = H / 2, R = Math.min(H * 0.33, 90);
            const ang = { 4: [-0.8, 0.8, 2.34, 3.94], 3: [-1.57, 0.52, 2.62], 2: [0, 3.14], 1: [0] }[n];
            ang.forEach((a, i) => { const x = cx + R * Math.cos(a + Math.sin(st.t * 2 + i) * 0.04), y = cy + R * Math.sin(a + Math.sin(st.t * 2 + i) * 0.04); UI.line(ctx, cx, cy, x, y, '#F5C542', 3); UI.atom(ctx, x, y, 17, '#C79CFF'); });
            UI.atom(ctx, cx, cy, 22, '#FF9E9E'); UI.text(ctx, 'N=' + N, cx, cy, '#0B0E12', 13, 'center');
            const tx = W * 0.58; UI.text(ctx, `Değerlik N = ${N}`, tx, H * 0.3, '#fff', 20, 'left', 'Bahnschrift, sans-serif'); UI.text(ctx, `n = 8 − ${N} = ${n} komşu`, tx, H * 0.46, '#F5C542', 22, 'left', 'Bahnschrift, sans-serif');
            UI.text(ctx, { 4: 'Elmas tipi: 4 yönlü bağ', 3: 'Katmanlı yapı: 3 komşu', 2: 'Zincir yapı: 2 komşu', 1: 'İkili molekül: 1 komşu' }[n], tx, H * 0.62, '#C9D0D8', 15);
          });
          UI.setCap(b, 'Değerlik arttıkça komşu sayısı <b>azalır</b>: 4 → 4, 5 → 3, 6 → 2, 7 → 1. Örnekler kitapta Çizelge 5.2.1 (C-elmas, Si, Sn, Sb…).');
        }
      },
      {
        id: 'cekirdek', title: 'Çekirdek oluşumu: kritik yarıçap', pg: 's.51-54',
        build(b) {
          b.innerHTML = `<p>Sıvıda atomlar sürekli küçük kümeler kurup dağıtır. Bir küme <b>belli bir boyutu (kritik yarıçap r<sub>c</sub>)</b> geçerse büyür ve <b>çekirdek</b> olur; geçemezse çözülür. Aşırı soğuma ne kadar çoksa bu eşik o kadar küçük.</p>
          <div class="widget"><canvas></canvas><div class="ctl"><label>Aşırı soğuma ΔT <input type="range" min="15" max="100" value="30" id="dt"><output></output></label><label><input type="checkbox" id="in"> Yabancı çekirdek ekle (aşılama)</label></div><div class="cap"></div></div>
          <div class="key"><ul><li><b>Çekirdek:</b> kristalleşmeyi başlatan en küçük katı oluşum (s.51). <b>Homojen:</b> ergiyiğin kendi atomlarından; <b>heterojen:</b> yabancı katı parçacıklar üzerinde (s.52).</li><li>Gibbs enerjisi: hacim kazancı (−) ile yüzey enerjisi harcaması (+) yarışır. Tepe noktası <b>kritik yarıçap r<sub>c</sub> = 2σ / Δg</b> (s.53).</li><li><b>Aşırı soğuma ΔT</b> arttıkça r<sub>c</sub> küçülür, çekirdek sayısı artar, taneler <b>küçülür</b> (s.54).</li><li>Dışarıdan katılan yabancı çekirdek: <b>aşılama / tohumlama</b> (örn. Al'a TiB₂) (s.55).</li></ul></div>`;
          let dT = 30, inoc = false; UI.bind(b, '#dt', v => dT = v, v => v + ' K'); $('#in', b).onchange = e => inoc = e.target.checked;
          const cl = [], R = seeded(11); let spawn = 0;
          UI.loop($('canvas', b), 0.62, (ctx, W, H, st) => {
            const g = dT / 100, rcr = 2 / g, eff = inoc ? 0.35 : 1, L = 46, Rr = W * 0.52, tp = 14, bt = H - 30, rmax = 16, ymax = 800;
            const X = r => L + r / rmax * (Rr - L), y0 = tp + (bt - tp) * 0.72, Y = v => UI.clamp(y0 - v / ymax * (y0 - tp), tp, bt);
            const dG = r => eff * (4 * Math.PI * r * r - (4 / 3) * Math.PI * r * r * r * g);
            UI.line(ctx, L, y0, Rr, y0, '#3a4654', 1); UI.line(ctx, L, tp, L, bt, '#3a4654', 1); UI.text(ctx, 'ΔG', L + 6, tp + 4, '#8E99A6', 11); UI.text(ctx, 'r →', Rr, y0 + 12, '#8E99A6', 11, 'right');
            ctx.beginPath(); for (let r = 0; r <= rmax; r += 0.1) { const x = X(r), y = Y(dG(r)); r ? ctx.lineTo(x, y) : ctx.moveTo(x, y); } ctx.strokeStyle = '#C79CFF'; ctx.lineWidth = 2.6; ctx.stroke();
            if (rcr < rmax) { const pk = dG(rcr); UI.line(ctx, X(rcr), Y(pk), X(rcr), y0, 'rgba(255,255,255,.4)', 1, [3, 3]); UI.circle(ctx, X(rcr), Y(pk), 5, '#F5C542'); UI.text(ctx, 'r_c', X(rcr), y0 + 14, '#F5C542', 12, 'center'); UI.text(ctx, 'ΔG* bariyer', Math.min(X(rcr) + 8, Rr - 70), Math.max(tp + 14, Y(pk) - 12), '#C9D0D8', 11); }
            const bx = Rr + 24, bw = W - bx - 10, by = 10, bh = H - 20; UI.roundRect(ctx, bx, by, bw, bh, 10, '#10161d', '#2A323C'); UI.text(ctx, inoc ? 'sıvı + yabancı parçacık' : 'sıvı', bx + 10, by + 14, '#C9D0D8', 12);
            spawn += st.dt * 3; while (spawn > 1 && cl.length < 26) { spawn -= 1; const par = inoc && R() < 0.6; cl.push({ x: R(), y: R(), r: 2 + R() * 12, par }); } spawn = Math.min(spawn, 1);
            const px = Math.max(3, rcr * 2.2);
            for (let i = cl.length - 1; i >= 0; i--) { const c = cl[i], th = c.par ? px * 0.45 : px; c.r += (c.r > th ? 1 : -1) * st.dt * (5 + Math.abs(c.r - th) * 1.1); if (c.r < 0.8) { cl.splice(i, 1); continue; } c.r = Math.min(c.r, Math.min(bw, bh) * 0.12); }
            cl.forEach(c => { const x = bx + 20 + c.x * (bw - 40), y = by + 30 + c.y * (bh - 50), th = c.par ? px * 0.45 : px; if (c.par) UI.roundRect(ctx, x - 4, y - 4, 8, 8, 2, '#8E99A6'); const big = c.r > th; UI.circle(ctx, x, y, c.r, big ? 'rgba(199,156,255,.45)' : 'rgba(255,255,255,.08)', big ? '#C79CFF' : 'rgba(255,255,255,.35)', 1.5); });
            UI.line(ctx, bx + 12, by + bh - 12, bx + 12 + px, by + bh - 12, '#F5C542', 2); UI.text(ctx, 'eşik yarıçap', bx + 18 + px, by + bh - 12, '#F5C542', 11);
          });
          UI.setCap(b, 'Mor daire: eşiği aşıp <b>büyüyen çekirdek</b>. Soluk daire: eşiğin altında kalıp <b>çözülen küme</b>. ΔT\'yi artır: bariyer düşer, çekirdek sayısı fırlar. Yabancı parçacık eklersen bariyer daha da düşer.');
        }
      },
      {
        id: 'sogu', title: 'Soğuma eğrisi ve aşırı soğuma', pg: 's.54',
        build(b) {
          b.innerHTML = `<p>Saf bir metal soğurken sıcaklığı <b>ergime noktasının biraz altına</b> iner (aşırı soğuma ΔT), çekirdekler oluşunca ısı açığa çıkar ve sıcaklık T<sub>E</sub>'ye geri atlar. Sonra <b>plato</b>: katılaşma tamamlanana kadar sıcaklık sabit.</p>
          <div class="widget"><canvas></canvas><div class="ctl"><label>Aşırı soğuma ΔT <input type="range" min="0" max="60" value="25" id="so"><output></output></label><span class="seg" id="kl"><button data-v="kum" class="on">Kum kalıp</button><button data-v="kokil">Kokil kalıp</button></span><button class="btn" id="re">Yeniden</button></div><div class="cap"></div></div>
          <div class="key"><ul><li><b>Kokil</b> metalden yapılmış, tekrar kullanılan kalıp; ısıyı iyi iletir, <b>hızlı soğutur</b>, aşırı soğuma büyür, <b>ince taneli</b> yapı oluşur (s.54, 57).</li><li>İnce taneli yapı: <b>mukavemeti yüksek</b>. Ama tane sınırı malzemesi nedeniyle <b>korozyon dayanımı azalır</b> (s.55).</li></ul></div>`;
          let dT = 25, k = 'kum', t0 = 0; UI.bind(b, '#so', v => { dT = v; t0 = 0; }, v => v + ' K'); UI.seg(b, '#kl', v => { k = v; t0 = 0; }); $('#re', b).onclick = () => t0 = 0;
          UI.loop($('canvas', b), 0.5, (ctx, W, H, st) => {
            t0 += st.dt; const L = 52, R = W - 16, tp = 22, bt = H - 30, Te = 0.55, slope = k === 'kum' ? 0.55 : 1.1;
            const pts = []; let t = 0, T = 1.0, phase = 0, plate = 0;
            for (let i = 0; i < 400; i++) { pts.push([t, T]); if (phase === 0) { T -= slope * 0.005; if (T <= Te - dT / 160) { phase = 1; } } else if (phase === 1) { T += 0.02 * (Te - T + 0.02) * 10; if (T >= Te - 0.001) { T = Te; phase = 2; } } else if (phase === 2) { plate += 1; if (plate > (k === 'kum' ? 90 : 55)) phase = 3; } else T -= slope * 0.005 * 0.9; t += 1; }
            const X = tt => L + tt / 400 * (R - L), Y = v => bt - (v - 0.15) / 0.95 * (bt - tp);
            UI.line(ctx, L, bt, R, bt, '#3a4654', 1); UI.line(ctx, L, tp, L, bt, '#3a4654', 1); UI.text(ctx, 'sıcaklık', L + 4, 10, '#8E99A6', 11); UI.text(ctx, 'zaman →', R, bt + 16, '#8E99A6', 11, 'right');
            UI.line(ctx, L, Y(Te), R, Y(Te), 'rgba(199,156,255,.5)', 1, [4, 4]); UI.text(ctx, 'T_E', L - 6, Y(Te), '#C79CFF', 12, 'right');
            const n = Math.min(pts.length - 1, Math.floor(t0 * 120)); ctx.beginPath(); pts.slice(0, n).forEach((p, i) => i ? ctx.lineTo(X(p[0]), Y(p[1])) : ctx.moveTo(X(p[0]), Y(p[1]))); ctx.strokeStyle = '#C79CFF'; ctx.lineWidth = 3; ctx.stroke();
            const cur = pts[n]; UI.circle(ctx, X(cur[0]), Y(cur[1]), 5, '#fff');
            const mi = pts.reduce((a, p) => p[1] < a[1] ? p : a, pts[0]); if (n * 1 > pts.indexOf(mi)) { UI.line(ctx, X(mi[0]) + 22, Y(Te), X(mi[0]) + 22, Y(mi[1]), '#F5C542', 2); UI.text(ctx, 'ΔT', X(mi[0]) + 30, (Y(Te) + Y(mi[1])) / 2, '#F5C542', 13); }
            UI.text(ctx, cur[1] > Te + 0.01 ? 'SIVI soğuyor' : n < 140 && cur[1] < Te - 0.005 ? 'aşırı soğuma' : cur[1] >= Te - 0.002 && n < 250 ? 'KATILAŞMA (plato)' : 'KATI soğuyor', R - 6, tp - 4, '#fff', 13, 'right');
          });
          UI.setCap(b, 'ΔT\'yi büyüt: sıcaklık daha derine iner. Kokil seçince eğri daha dik soğur ve plato kısalır.');
        }
      },
      {
        id: 'tane', title: 'Tane büyümesi: taneler nasıl oluşur?', pg: 's.55-58',
        build(b) {
          b.innerHTML = `<p>Her çekirdek bir <b>tane (kristal)</b> olur: içinde yön aynıdır, komşusuyla yönü farklıdır. Taneler birbirine çarpınca ortaya <b>tane sınırı</b> çıkar. Kalıbı ve soğumayı seç, izle.</p>
          <div class="widget"><canvas></canvas><div class="ctl"><span class="seg" id="gm"><button data-v="kum" class="on">Kum kalıp (yavaş)</button><button data-v="hizli">Hızlı soğuma</button><button data-v="inoc">Aşılanmış</button><button data-v="kokil">Kokil duvarı</button></span><button class="btn" id="gr">Yeniden başlat</button></div><div class="cap"></div></div>
          <div class="key"><ul><li><b>Tane (kristal):</b> içinde kafes sistemi aynı, kayma düzlemleri benzer katı bölge; <b>tane sınırı</b> taneleri ayıran yüzey (s.77).</li><li>Aşırı soğuma, hızlı soğuma ve aşılama çekirdek sayısını arttırır → <b>ince taneli</b>, mukavemeti yüksek yapı (s.55, 57).</li><li><b>Eş eksenli taneler:</b> her yönde aynı boyutta. <b>Yönlenmiş taneler:</b> kalıp duvarından içe uzayan sütunlar; genelde <b>istenmez</b> (s.56-58).</li><li><b>Kokil / kum kalıp farkı:</b> kokil metaldir, ısıyı hızlı alır, daha ince tane (s.57).</li></ul></div>
          <h3>Dentrit: çam ağacı biçimli tane</h3><div class="widget"><canvas></canvas><div class="cap">Katılaşma ön cephesi düz değilse sivri bir kol önce uzar, kollardan yan kollar çıkar: <b>dentrit</b> (s.57). Alaşımlarda yabancı atomlar bol olduğunda belirgindir.</div></div>
          <h3>Lamelli tane: iki faz birlikte</h3><div class="widget"><canvas></canvas><div class="cap">İki katı faz <b>aynı anda</b> ayrışınca şerit şerit (lamelli) tane oluşur; çelikte <b>ferrit + sementit = perlit</b> (s.58).</div></div>`;
          const w = b, cv = $$('canvas', b); let mode = 'kum', ver = 0, tstart = 0, t00 = performance.now(); const GW = 170, GH = 100;
          let arr, own, nuc, colors, tEnd;
          function build() {
            const R = seeded(77 + ver * 13); arr = new Float32Array(GW * GH).fill(1e9); own = new Int16Array(GW * GH).fill(-1); nuc = [];
            const cfg = { kum: [7, 0.7], hizli: [60, 0.7], inoc: [140, 0.55], kokil: [20, 0.7] }[mode], N = cfg[0], v = GW * 0.9; const cand = [];
            for (let i = 0; i < N; i++) cand.push([R() * cfg[1], R() * GW, R() * GH]);
            if (mode === 'kokil') { for (let i = 0; i < 55; i++) cand.push([R() * 0.06, R() * 3, (i + R()) / 55 * GH]); for (let i = 0; i < 6; i++) cand.push([0.45 + R() * 0.25, GW * (0.5 + R() * 0.45), R() * GH]); }
            cand.sort((a, b2) => a[0] - b2[0]);
            for (const [t, x, y] of cand) { const px = Math.floor(UI.clamp(x, 0, GW - 1)), py = Math.floor(UI.clamp(y, 0, GH - 1)); if (arr[py * GW + px] <= t) continue; const id = nuc.length; nuc.push({ x, y, t }); for (let j = 0; j < GH; j++) for (let i = 0; i < GW; i++) { const a = t + Math.hypot(i - x, j - y) / v; const p = j * GW + i; if (a < arr[p]) { arr[p] = a; own[p] = id; } } }
            tEnd = 0; for (let i = 0; i < arr.length; i++) if (arr[i] < 1e8) tEnd = Math.max(tEnd, arr[i]);
            colors = nuc.map(() => { const h = 190 + R() * 110, l = 36 + R() * 24; return [h, l]; }).map(([h, l]) => { const c = (1 - Math.abs(2 * l / 100 - 1)) * 0.5, x = c * (1 - Math.abs((h / 60) % 2 - 1)), m = l / 100 - c / 2; let r, g, bb; const k = Math.floor(h / 60) % 6; [[c, x, 0], [x, c, 0], [0, c, x], [0, x, c], [x, 0, c], [c, 0, x]][k].forEach((val, i) => { if (i === 0) r = val; else if (i === 1) g = val; else bb = val; }); return [Math.round((r + m) * 255), Math.round((g + m) * 255), Math.round((bb + m) * 255)]; });
            t00 = performance.now();
          }
          UI.seg(w, '#gm', v => { mode = v; ver++; build(); }); $('#gr', w).onclick = () => { ver++; build(); };
          const off = document.createElement('canvas'); off.width = GW; off.height = GH; const octx = off.getContext('2d'), img = octx.createImageData(GW, GH);
          UI.loop(cv[0], 0.6, (ctx, W, H, st) => {
            tstart = (performance.now() - t00) / 1000; const tNow = Math.min(tEnd * 1.02, tstart / 6 * tEnd * 1.0), d = img.data;
            for (let j = 0; j < GH; j++) for (let i = 0; i < GW; i++) {
              const p = j * GW + i, k = p * 4;
              if (arr[p] <= tNow) { const c = colors[own[p]]; let edge = (i < GW - 1 && own[p + 1] !== own[p] && arr[p + 1] <= tNow) || (j < GH - 1 && own[p + GW] !== own[p] && arr[p + GW] <= tNow); if (edge) { d[k] = 15; d[k + 1] = 18; d[k + 2] = 24; } else { d[k] = c[0]; d[k + 1] = c[1]; d[k + 2] = c[2]; } }
              else { const g = 20 + 14 * Math.sin(i * 0.2 + st.t * 2 + j * 0.15); d[k] = 70 + g; d[k + 1] = 38 + g * 0.5; d[k + 2] = 22; }
              d[k + 3] = 255;
            }
            octx.putImageData(img, 0, 0); ctx.imageSmoothingEnabled = true; ctx.drawImage(off, 0, 0, W, H);
            const done = tNow >= tEnd; UI.text(ctx, done ? `${nuc.length} tane · ortalama tane çapı ≈ ${Math.round(Math.sqrt(GW * GH / nuc.length) * 100 / GW * 10) / 10} birim` : 'katılaşıyor… (turuncu: sıvı)', 12, 16, '#fff', 13);
            UI.setCap(cv[0].closest('.widget'), { kum: 'Yavaş soğuma: az çekirdek, <b>iri taneler</b>, düşük mukavemet.', hizli: 'Hızlı soğuma / büyük aşırı soğuma: çok çekirdek, <b>ince taneler</b>.', inoc: 'Aşılama (yabancı çekirdek): çok sayıda çekirdek, <b>ince, eş eksenli</b> tane.', kokil: 'Kokil duvarından içe doğru <b>sütun biçimli (yönlenmiş) taneler</b>; ortada eş eksenliler. Yönlenmiş taneler genelde istenmez.' }[mode]);
          });
          /* dentrit */
          const segs = []; (function gen() { const R = seeded(3); function br(x, y, a, len, d, t) { if (d > 4 || len < 4) return; const x2 = x + Math.cos(a) * len, y2 = y + Math.sin(a) * len; segs.push([x, y, x2, y2, d, t]); const n = d < 2 ? 5 : 3; for (let i = 1; i <= n; i++) { const f = i / (n + 1), px = x + (x2 - x) * f, py = y + (y2 - y) * f; br(px, py, a + 1.0 + R() * 0.12, len * (0.42 - 0.05 * d), d + 1, t + f * len / 100 + 0.25 * (d + 1)); br(px, py, a - 1.0 - R() * 0.12, len * (0.42 - 0.05 * d), d + 1, t + f * len / 100 + 0.25 * (d + 1)); } } br(0, 0, -Math.PI / 2, 150, 0, 0); })();
          UI.loop(cv[1], 0.55, (ctx, W, H, st) => {
            const tt = (st.t % 9), sc = Math.min(W, H * 1.8) / 360; ctx.save(); ctx.translate(W / 2, H - 14); ctx.scale(sc, sc);
            segs.forEach(s => { const p = UI.clamp((tt - s[5]) * 1.3, 0, 1); if (p <= 0) return; ctx.beginPath(); ctx.moveTo(s[0], s[1]); ctx.lineTo(s[0] + (s[2] - s[0]) * p, s[1] + (s[3] - s[1]) * p); ctx.strokeStyle = s[4] === 0 ? '#E8ECF0' : s[4] === 1 ? '#C79CFF' : '#9a7fd0'; ctx.lineWidth = 4 - s[4] * 0.7; ctx.lineCap = 'round'; ctx.stroke(); });
            ctx.restore();
          });
          /* lamelli */
          UI.loop(cv[2], 0.45, (ctx, W, H, st) => {
            const p = Math.min(1, (st.t % 7) / 4), R = Math.min(W / 2 - 10, H / 2 - 10) * p, cx = W / 2, cy = H / 2;
            ctx.save(); ctx.beginPath(); ctx.arc(cx, cy, R, 0, 6.2832); ctx.clip();
            for (let i = -40; i < 40; i++) { ctx.fillStyle = i % 2 ? '#C9D0D8' : '#4a5866'; const x = cx + i * 9; ctx.fillRect(x, cy - 200, 9 * (i % 2 ? 0.55 : 1.0), 400); }
            ctx.restore(); ctx.beginPath(); ctx.arc(cx, cy, R, 0, 6.2832); ctx.strokeStyle = '#C79CFF'; ctx.lineWidth = 2; ctx.stroke();
            UI.text(ctx, 'açık: sementit (sert) · koyu: ferrit', W - 10, H - 12, '#C9D0D8', 12, 'right');
          });
          build();
        }
      },
      {
        id: 'tekstur', title: 'İzotropi, anizotropi ve tekstür', pg: 's.58-59',
        build(b) {
          b.innerHTML = `<p>Her tanenin kendi yönü var. Taneler <b>rastgele</b> yönlenmişse malzeme her yönde aynı davranır. Yönleri benzerse malzeme <b>yöne bağlı</b> olur. Kaydırıcıyla taneleri hizala; sağdaki şekil özelliğin yöne göre değişimini gösterir.</p>
          <div class="widget"><canvas></canvas><div class="ctl"><label>Tekstür derecesi <input type="range" min="0" max="100" value="0" id="tx"><output></output></label></div><div class="cap"></div></div>
          <div class="key"><ul><li><b>Kütlesel izotropi:</b> ince taneli malzemede taneler gelişigüzel yönlendiğinden anizotropi yok olur (s.58).</li><li><b>Tekstür:</b> tanelerin yönlerinin birbirine yakın olduğu <b>anizotrop</b> iç yapı (s.59).</li><li>Tekstürlü sac konstrüksiyonda makbul değil; <b>transformatör sacında</b> özel elektro-ferro-manyetik özellik (gürültü ve demir kaybını azaltma) için <b>istenir</b> (s.59).</li><li><b>Normalizasyon</b>: ince ve eş eksenli tane (s.56).</li></ul></div>`;
          let tx = 0; UI.bind(b, '#tx', v => tx = v / 100, v => v + '%');
          const R = seeded(21), gr = []; for (let r = 0; r < 7; r++) for (let c = 0; c < 10; c++) gr.push({ c, r, a: (R() - 0.5) * 2 * Math.PI / 2, cj: R() - 0.5, rj: R() - 0.5 });
          UI.loop($('canvas', b), 0.5, (ctx, W, H, st) => {
            const bw = W * 0.58, s = Math.min(bw / 10.5, H / 7.7); const ox = 12 + s * 0.5, oy = 12 + s * 0.5; let sx = 0, sy = 0;
            gr.forEach(g => { const cx = ox + (g.c + (g.r % 2) * 0.5 + g.cj * 0.25) * s, cy = oy + (g.r * 0.9 + g.rj * 0.2) * s, ang = g.a * (1 - tx) + Math.sin(st.t * 0 ) * 0; UI.roundRect(ctx, cx - s * 0.46, cy - s * 0.46, s * 0.92, s * 0.92, 6, '#151A20', '#2A323C');
              for (let k = -1; k <= 1; k++) { const o = k * s * 0.2; UI.line(ctx, cx - Math.cos(ang) * s * 0.34 - Math.sin(ang) * o, cy - Math.sin(ang) * s * 0.34 + Math.cos(ang) * o, cx + Math.cos(ang) * s * 0.34 - Math.sin(ang) * o, cy + Math.sin(ang) * s * 0.34 + Math.cos(ang) * o, '#C79CFF', 2); }
              sx += Math.cos(2 * ang); sy += Math.sin(2 * ang); });
            const n = gr.length, mag = Math.hypot(sx, sy) / n, phi = Math.atan2(sy, sx) / 2;
            const px = bw + (W - bw) / 2 + 6, py = H / 2, rr = Math.min((W - bw) / 2 - 14, H / 2 - 20);
            UI.circle(ctx, px, py, rr, null, '#2A323C', 1); UI.circle(ctx, px, py, rr * 0.5, null, '#222b34', 1);
            ctx.beginPath(); for (let a = 0; a <= 6.2832 + 0.05; a += 0.05) { const v = (0.5 + 0.45 * mag * Math.cos(2 * (a - phi))) * 0.5 + 0.5 * 0.5; const d = rr * (0.45 + 0.55 * (0.5 + 0.5 * mag * Math.cos(2 * (a - phi)))); const x = px + d * Math.cos(a), y = py - d * Math.sin(a); a ? ctx.lineTo(x, y) : ctx.moveTo(x, y); } ctx.closePath(); ctx.fillStyle = 'rgba(199,156,255,.25)'; ctx.fill(); ctx.strokeStyle = '#C79CFF'; ctx.lineWidth = 2.4; ctx.stroke();
            UI.text(ctx, 'özelliğin yöne göre değişimi', px, 12, '#8E99A6', 11, 'center'); UI.text(ctx, mag < 0.25 ? 'İZOTROP (daire)' : 'ANİZOTROP (yöne bağlı)', px, H - 12, mag < 0.25 ? '#7FD99A' : '#FF9E9E', 13, 'center');
          });
          UI.setCap(b, '%0: taneler gelişigüzel → <b>daire</b> (izotrop). %100: hepsi aynı yönde → <b>yöne bağlı şekil</b> (anizotrop, tekstür): bir yönde özellik yüksek, dik yönde düşük.');
        }
      }
    ]
  };
})();
