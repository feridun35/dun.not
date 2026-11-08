(function () {
  const UI = window.UI, $ = UI.$, $$ = UI.$$;
  /* Z=1..36 verileri: sembol, ad, en yaygın nötron sayısı, iyonlaşma enerjisi (eV), elektronegatiflik, atom yarıçapı (pm) */
  const E = [null,
    ['H', 'Hidrojen', 0, 13.6, 2.20, 25], ['He', 'Helyum', 2, 24.6, 0, 31], ['Li', 'Lityum', 4, 5.39, 0.98, 145], ['Be', 'Berilyum', 5, 9.32, 1.57, 105],
    ['B', 'Bor', 6, 8.30, 2.04, 85], ['C', 'Karbon', 6, 11.26, 2.55, 70], ['N', 'Azot', 7, 14.53, 3.04, 65], ['O', 'Oksijen', 8, 13.62, 3.44, 60],
    ['F', 'Flor', 10, 17.42, 3.98, 50], ['Ne', 'Neon', 10, 21.56, 0, 38], ['Na', 'Sodyum', 12, 5.14, 0.93, 180], ['Mg', 'Magnezyum', 12, 7.65, 1.31, 150],
    ['Al', 'Alüminyum', 14, 5.99, 1.61, 125], ['Si', 'Silisyum', 14, 8.15, 1.90, 110], ['P', 'Fosfor', 16, 10.49, 2.19, 100], ['S', 'Kükürt', 16, 10.36, 2.58, 100],
    ['Cl', 'Klor', 18, 12.97, 3.16, 100], ['Ar', 'Argon', 22, 15.76, 0, 71], ['K', 'Potasyum', 20, 4.34, 0.82, 220], ['Ca', 'Kalsiyum', 20, 6.11, 1.00, 180],
    ['Sc', 'Skandiyum', 24, 6.56, 1.36, 160], ['Ti', 'Titanyum', 26, 6.83, 1.54, 140], ['V', 'Vanadyum', 28, 6.75, 1.63, 135], ['Cr', 'Krom', 28, 6.77, 1.66, 140],
    ['Mn', 'Mangan', 30, 7.43, 1.55, 140], ['Fe', 'Demir', 30, 7.90, 1.83, 140], ['Co', 'Kobalt', 32, 7.88, 1.88, 135], ['Ni', 'Nikel', 30, 7.64, 1.91, 135],
    ['Cu', 'Bakır', 34, 7.73, 1.90, 135], ['Zn', 'Çinko', 34, 9.39, 1.65, 135], ['Ga', 'Galyum', 38, 6.00, 1.81, 130], ['Ge', 'Germanyum', 42, 7.90, 2.01, 125],
    ['As', 'Arsenik', 42, 9.79, 2.18, 115], ['Se', 'Selenyum', 46, 9.75, 2.55, 115], ['Br', 'Brom', 44, 11.81, 2.96, 115], ['Kr', 'Kripton', 48, 14.0, 3.0, 88]];
  const SUBS = [['1s', 1, 0, 2], ['2s', 2, 0, 2], ['2p', 2, 1, 6], ['3s', 3, 0, 2], ['3p', 3, 1, 6], ['4s', 4, 0, 2], ['3d', 3, 2, 10], ['4p', 4, 1, 6]];
  function config(Z) {
    const f = SUBS.map(s => 0); let z = Z;
    for (let i = 0; i < SUBS.length && z > 0; i++) { const k = Math.min(z, SUBS[i][3]); f[i] = k; z -= k; }
    if (Z === 24) { f[5] = 1; f[6] = 5; }   // Cr: 4s1 3d5
    if (Z === 29) { f[5] = 1; f[6] = 10; }  // Cu: 4s1 3d10
    return f;
  }
  function shells(Z) { const f = config(Z), s = [0, 0, 0, 0, 0]; SUBS.forEach((x, i) => s[x[1]] += f[i]); return s.slice(1); }
  function cfgStr(Z) { const f = config(Z); return SUBS.map((s, i) => f[i] ? `${s[0]}<sup>${f[i]}</sup>` : '').filter(Boolean).join(' '); }
  const COL = { 1: 1, 2: 2, 3: 13, 4: 14, 5: 15, 6: 16, 7: 17, 8: 18 };
  function cell(Z) { // satır, sütun
    if (Z === 1) return [1, 1]; if (Z === 2) return [1, 18];
    if (Z <= 4) return [2, Z - 2]; if (Z <= 10) return [2, Z + 8];
    if (Z <= 12) return [3, Z - 10]; if (Z <= 18) return [3, Z];
    return [4, Z - 18];
  }
  const GROUP = ['', '1A', '2A', '3B', '4B', '5B', '6B', '7B', '8B', '8B', '8B', '1B', '2B', '3A', '4A', '5A', '6A', '7A', '8A'];
  const GNAME = { 1: 'Alkali metaller', 2: 'Toprak alkali metaller', 13: 'Toprak metaller', 14: 'Karbon grubu', 15: 'Azot grubu', 16: 'Kalkojenler (oksijen grubu)', 17: 'Halojenler', 18: 'Soy (asal) gazlar', 11: 'Bakır grubu', 12: 'Çinko grubu', 3: 'Skandiyum grubu', 4: 'Titanyum grubu', 5: 'Vanadyum grubu', 6: 'Krom grubu', 7: 'Mangan grubu', 8: 'Demir grubu (8B)', 9: 'Demir grubu (8B)', 10: 'Demir grubu (8B)' };
  const NONMETAL = [1, 2, 6, 7, 8, 9, 10, 15, 16, 17, 18, 34, 35, 36], SEMI = [5, 14, 32, 33];
  const LIGHT = [3, 4, 11, 12, 13, 19, 20, 21, 22];
  const TM = { 3: 180, 4: 1287, 11: 98, 12: 650, 13: 660, 19: 63, 20: 842, 21: 1541, 22: 1668, 23: 1910, 24: 1907, 25: 1246, 26: 1538, 27: 1495, 28: 1455, 29: 1085, 30: 420, 31: 30 };

  window.CH[2] = {
    intro: 'Atom neden böyle davranıyor? Bu bölümde atomu içinden görürsün: çekirdek, tabakalar, elektronların yerleşmesi ve periyodik cetvelin neden öyle dizildiği. Sonraki bölümlerdeki bağlar bunun üstüne kurulu.',
    sections: [
      {
        id: 'model', title: 'Atom modeli: çekirdek, tabakalar, izotop', pg: 's.6-7',
        build(b) {
          b.innerHTML = `<p>Atom <b>çekirdek</b> (proton + nötron) ve etrafında tabakalarda dolanan <b>elektronlardan</b> oluşur. Şemada Z ve N kaydırıcılarını oyna.</p>
          <div class="widget" id="atom"><canvas></canvas><div class="ctl">
            <label>Proton Z <input type="range" min="1" max="36" value="26"><output></output></label>
            <label>Nötron N <input type="range" min="0" max="50" value="30" id="nn"><output></output></label>
            <span class="seg" id="pre"><button data-v="h1">¹H</button><button data-v="h2">²H</button><button data-v="h3">³H</button><button data-v="c14">¹⁴C</button><button data-v="n14">¹⁴N</button></span></div><div class="cap"></div></div>
          <div class="key"><ul><li><b>Kütle sayısı A = Z + N</b> (proton + nötron) (s.6).</li><li><b>İzotop:</b> Z aynı, N farklı (¹H, ²H, ³H). <b>İzobar:</b> Z farklı, A aynı (¹⁴C ve ¹⁴N) (s.7).</li><li>Elektron sayısı = Z (nötr atom). Tabakalar K, L, M, N (n = 1, 2, 3, 4).</li></ul></div>
          <div class="tip">Çekirdek atomun merkezinde nokta gibi küçüktür ama kütlenin neredeyse hepsi oradadır. Elektronlar bir stadyumun tribünlerindeki seyirci gibi: her tabakanın sınırlı koltuğu var.</div>`;
          const w = $('#atom', b); let Z = 26, N = 30; const sl = $$('input', w);
          function info() { UI.setCap(w, `<b>${E[Z][1]} (${E[Z][0]})</b> · Z = ${Z}, N = ${N} → <b>A = ${Z + N}</b> · elektron düzeni: ${cfgStr(Z)} · kabuklar K-L-M-N: ${shells(Z).join(', ')}`); }
          UI.bind(w, 'input:not(#nn)', v => { Z = v; info(); }); UI.bind(w, '#nn', v => { N = v; info(); });
          UI.seg(w, '#pre', (v) => { const P = { h1: [1, 0], h2: [1, 1], h3: [1, 2], c14: [6, 8], n14: [7, 7] }[v]; if (!P) return; Z = P[0]; N = P[1]; sl[0].value = Z; sl[1].value = N; $$('output', w).forEach((o, i) => o.textContent = i ? N : Z); info(); }, false);
          const nuc = {}; const eth = [];
          UI.loop($('canvas', w), 0.62, (ctx, W, H, st) => {
            const cx = W / 2, cy = H / 2, sh = shells(Z), nmax = sh.filter(x => x > 0).length, rmax = Math.min(W / 2, H / 2) - 14, A = Z + N;
            const rn = Math.min(26, 8 + Math.cbrt(A) * 3.1);
            for (let n = 1; n <= nmax; n++) { const r = rn + 14 + (n) * (rmax - rn - 14) / nmax; UI.circle(ctx, cx, cy, r, null, '#2A323C', 1.2); UI.text(ctx, 'KLMN'[n - 1], cx + r * 0.71 + 6, cy - r * 0.71 - 4, '#8E99A6', 11); }
            for (let i = 0; i < A; i++) { const r = rn * Math.sqrt((i + 0.5) / A), a = i * 2.39996 + 0.4, p = Math.floor((i + 1) * Z / A) > Math.floor(i * Z / A); UI.circle(ctx, cx + r * Math.cos(a), cy + r * Math.sin(a), Math.max(2.6, rn / 5.6), p ? '#FF5A4D' : '#8E99A6', '#0B0E12', 0.6); }
            for (let n = 1; n <= nmax; n++) {
              const r = rn + 14 + n * (rmax - rn - 14) / nmax, c = sh[n - 1];
              for (let k = 0; k < c; k++) { const a = st.t * 1.6 / Math.sqrt(n) * (n % 2 ? 1 : -1) + 6.2832 * k / c; const x = cx + r * Math.cos(a), y = cy + r * Math.sin(a); UI.circle(ctx, x, y, 8, 'rgba(95,180,255,.22)'); UI.circle(ctx, x, y, 4.2, '#5FB4FF'); }
            }
            UI.text(ctx, E[Z][0], 14, 22, '#fff', 26, 'left', 'Bahnschrift, sans-serif'); UI.text(ctx, `${Z + N}`, 14, 9, '#8E99A6', 11);
            UI.text(ctx, 'proton', 14, H - 34, '#FF5A4D', 12); UI.text(ctx, 'nötron', 14, H - 20, '#8E99A6', 12); UI.text(ctx, 'elektron', 14, H - 6, '#5FB4FF', 12);
          });
        }
      },
      {
        id: 'agirlik', title: 'Atom ağırlığı, amu ve Avogadro sayısı', pg: 's.8-9',
        build(b) {
          b.innerHTML = `<p>Atomlar çok hafif olduğu için ağırlıkları <b>amu</b> ile ifade edilir: <b>¹²C izotopunun gerçek kütlesinin 1/12'si</b> (s.8). <b>Bağıl atom ağırlığı A birimsizdir.</b> A gram madde, <b>N<sub>A</sub> = 6,02·10²³</b> atom içerir (s.9).</p>
          <div class="widget"><div class="ctl" style="border:0">
            <span class="seg" id="el"><button data-v="55.85" class="on">Fe</button><button data-v="63.55">Cu</button><button data-v="26.98">Al</button><button data-v="12.01">C</button></span>
            <label>Kütle (g) <input type="range" min="1" max="200" value="55" id="m"><output></output></label></div>
            <div class="cap" id="av"></div></div>
          <div class="key"><ul><li>1 mol = A gram = <b>6,02·10²³ atom</b> (Avogadro sayısı).</li><li>Tek atomun gerçek kütlesi = A / N<sub>A</sub> gram.</li><li>Elementer yük e = 1,6·10⁻¹⁹ As; 1 eV = 1,6·10⁻¹⁹ J (s.9-10).</li></ul></div>`;
          const w = b; let A = 55.85, m = 55;
          function upd() { const mol = m / A, n = mol * 6.02252e23, ma = A / 6.02252e23; $('#av', w).innerHTML = `<b>${m} g</b> / ${A} g/mol = <b>${mol.toFixed(2)} mol</b> → <b>${n.toExponential(2).replace('e+', ' × 10<sup>').replace(/$/, '</sup>')}</b> atom. Tek atom kütlesi = ${ma.toExponential(2)} g.`; }
          UI.seg(w, '#el', v => { A = +v; upd(); }); UI.bind(w, '#m', v => { m = v; upd(); }, v => v + ' g');
        }
      },
      {
        id: 'elektron', title: 'Elektronlar tabakalara nasıl dolar?', pg: 's.9-11',
        build(b) {
          b.innerHTML = `<p>Elektronlar <b>en düşük enerjili</b> yere önce yerleşir. Her orbitale en çok 2 elektron girer (zıt spinli, <b>Pauli ilkesi</b>). Z'yi arttır ve elektronların dolduğunu izle: önemli not, <b>4s, 3d'den önce dolar</b>.</p>
          <div class="widget" id="aufbau"><canvas></canvas><div class="ctl"><label>Z <input type="range" min="1" max="36" value="14"><output></output></label><button class="btn" id="play">Otomatik doldur</button></div><div class="cap"></div></div>
          <div class="key"><ul><li>Bir tabakadaki en çok elektron: <b>2n²</b> (K=2, L=8, M=18, N=32) (s.10).</li><li>Tabakalar K, L, M, N, O, P, Q (n = 1…7).</li><li><b>Valans elektronu:</b> tam dolmamış ana veya ara tabakadaki elektronlar (s.11). Kimyasal tepkimede atomu terk edebilenler.</li><li>Metallerin dış kabuğunda en fazla <b>üç</b> elektron bulunur (s.25).</li></ul></div>
          <p class="hint">Cr ve Cu'da bir elektron 4s'den 3d'ye geçer (yarı dolu/dolu 3d daha kararlı). Şemada bunu da görürsün.</p>`;
          const w = $('#aufbau', b); let Z = 14, playing = false, tt = 0;
          const inp = $('input', w); UI.bind(w, 'input', v => { Z = v; });
          $('#play', w).onclick = () => { playing = !playing; if (playing) { Z = 1; inp.value = 1; } };
          const rows = [['1s', 1], ['2s', 1], ['2p', 3], ['3s', 1], ['3p', 3], ['4s', 1], ['3d', 5], ['4p', 3]];
          UI.loop($('canvas', w), 0.64, (ctx, W, H, st) => {
            if (playing) { tt += st.dt; if (tt > 0.45) { tt = 0; if (Z < 36) { Z++; inp.value = Z; inp.dispatchEvent(new Event('input')); } else playing = false; } }
            const f = config(Z), x0 = 60, bw = 34, rh = (H - 40) / rows.length;
            rows.forEach(([nm, nb], i) => {
              const idx = SUBS.findIndex(s => s[0] === nm), y = H - 26 - (i + 0.5) * rh, cnt = f[idx];
              UI.text(ctx, nm, 14, y, '#C9D0D8', 15, 'left', 'Bahnschrift, sans-serif');
              for (let k = 0; k < nb; k++) {
                const x = x0 + k * (bw + 6); UI.roundRect(ctx, x, y - 14, bw, 28, 5, '#151A20', '#3a4654');
                const up = cnt > k, dn = cnt > nb + k;
                const fresh = idx === lastIdx(Z) && (cnt - 1 === k || cnt - 1 === nb + k);
                if (up) UI.arrow(ctx, x + bw * 0.32, y + 10, x + bw * 0.32, y - 10, fresh && !dn ? '#fff' : '#5FB4FF', 2);
                if (dn) UI.arrow(ctx, x + bw * 0.68, y - 10, x + bw * 0.68, y + 10, fresh ? '#fff' : '#5FB4FF', 2);
              }
            });
            const sh = shells(Z), cap = [2, 8, 18, 32], bx = Math.max(240, W * 0.5);
            UI.text(ctx, 'Tabaka doluluğu', bx, 18, '#C9D0D8', 13);
            sh.forEach((c, i) => { const y = 48 + i * 44, bwid = W - bx - 24; UI.text(ctx, 'KLMN'[i], bx, y, '#8E99A6', 14); UI.roundRect(ctx, bx + 24, y - 11, bwid, 22, 5, null, '#3a4654'); UI.roundRect(ctx, bx + 24, y - 11, Math.max(0, bwid * c / cap[i]), 22, 5, ['#F5C542', '#FF9E9E', '#7FD99A', '#6FB4FF'][i]); UI.text(ctx, c + ' / ' + cap[i], bx + 30, y, '#0B0E12', 12); });
            const vtxt = valence(Z); UI.text(ctx, 'Valans: ' + vtxt, bx, H - 40, '#FF9E9E', 14);
          });
          function lastIdx(Z) { const f = config(Z); let k = -1; for (let i = 0; i < SUBS.length; i++) if (f[i] > 0) { k = i; } if (Z === 24) return 6; if (Z === 29) return 6; return k; }
          function valence(Z) { const f = config(Z); if (Z >= 21 && Z <= 28) return `${f[5] + f[6]} (4s + 3d, ara tabaka dolu değil)`; if (Z === 29) return '1 (4s)'; if (Z === 30) return '2 (4s)'; if (Z <= 2) return String(Z); const sh = shells(Z); const outer = sh.filter(x => x > 0); return outer[outer.length - 1] + ' (dış tabaka)'; }
          let capZ = 0; const capEl = $('.cap', w);
          const _draw = st0 => { };
          w.addEventListener('pointermove', () => { }); setInterval(() => { if (capZ !== Z && document.body.contains(w)) { capZ = Z; capEl.innerHTML = `<b>${E[Z][1]}</b> ${cfgStr(Z)}`; } }, 150);
        }
      },
      {
        id: 'periyodik', title: 'Periyodik cetvel: yer, eğilim, sınıflar', pg: 's.12-16',
        build(b) {
          b.innerHTML = `<p>Düşey sütunlar <b>grup</b>, yatay sıralar <b>periyot</b> (s.12). Bir elemente tıkla: elektron düzenini yazıp yerini bulduğumuz yöntemi adım adım görürsün. Üstteki düğmelerle her elementi bir özelliğe göre boya.</p>
          <div class="widget"><div class="ctl" style="border:0"><span class="seg" id="mode"><button data-v="none" class="on">Yalnız cetvel</button><button data-v="r">Atom yarıçapı</button><button data-v="ie">İyonlaşma enerjisi</button><button data-v="en">Elektronegatiflik</button><button data-v="cls">Metal sınıfı</button><button data-v="tm">Ergime sınıfı</button></span></div>
            <div style="overflow-x:auto;padding:6px 14px"><div id="pt" style="display:grid;grid-template-columns:repeat(18,minmax(34px,1fr));gap:4px;min-width:700px"></div></div>
            <div class="cap" id="pinfo" style="min-height:70px">Bir element seç.</div></div>
          <div class="key"><ul><li><b>Yeri bulma:</b> elektron düzenini yaz. <b>Valans elektron sayısı = grup</b>, <b>son ana tabaka = periyot</b>. Son orbital <b>s veya p</b> ile bitiyorsa <b>A</b>, <b>d</b> ile bitiyorsa <b>B</b> grubu (s.13).</li><li>Örnek (kitap): Z=15 → 1s² 2s² 2p⁶ 3s² 3p³ → 3. periyot, 5A.</li><li><b>Soldan sağa:</b> atom çapı <b>azalır</b>, iyonlaşma enerjisi ve elektronegatiflik <b>artar</b>, metalik özellik azalır, asitlik artar.</li><li><b>Yukarıdan aşağıya:</b> atom çapı <b>artar</b>, iyonlaşma enerjisi ve elektronegatiflik azalır, metalik özellik ve elektron verme artar (s.13-14).</li><li>İyonlaşma enerjisi atom çapıyla <b>ters orantılı</b> (s.14).</li></ul></div>
          <div class="wrap"><table><tr><th>Sınıf (kitap çizelgesi)</th><th>Elementler</th></tr>
            <tr><td>Metal olmayanlar (2.4.1)</td><td>H, C (elmas), N, O, P, S, halojenler, soy gazlar</td></tr>
            <tr><td>Yarı metaller (2.4.1)</td><td>B, C (grafit), Si, Ge, As, Se, Sb, Te, Po, α-Sn (13,2 °C altındaki Sn)</td></tr>
            <tr><td>Hafif metaller (2.4.2)</td><td>Yoğunluk &lt; 5 g/cm³: Li, Be, Na, Mg, Al, K, Ca, Sc, Ti, Rb, Sr, Cs, Ba, Fr</td></tr>
            <tr><td>Ergime (2.4.3)</td><td>Düşük &lt; 1000 °C (Li, Mg, Al, K, Ca, Zn, Ag…) · Orta 1000-2000 °C (Be, Sc, Ti, V, Cr, Mn, Fe, Co, Ni, Cu…) · Yüksek &gt; 2000 °C (Mo, Tc, Hf, Ta, W, Re, Os, Ir)</td></tr></table></div>
          <p class="hint">Grup adları: 1A alkali metaller, 2A toprak alkali, 3A toprak metaller, 4A karbon, 5A azot, 6A kalkojenler, 7A halojenler, 8A soy gazlar; 1B bakır, 2B çinko, 8B demir grubu (s.13).</p>`;
          const pt = $('#pt', b); const cells = [];
          for (let col = 1; col <= 18; col++) { }
          for (let Z = 1; Z <= 36; Z++) { const [r, c] = cell(Z); const el = document.createElement('button'); el.className = 'tn'; el.style.cssText = `grid-row:${r};grid-column:${c};padding:5px 2px;text-align:center;border-left-width:1px;font-size:13px`; el.innerHTML = `<small style="font-size:10px">${Z}</small><b style="font-size:15px">${E[Z][0]}</b>`; el.onclick = () => select(Z); pt.appendChild(el); cells[Z] = el; }
          for (let c = 1; c <= 18; c++) { const g = document.createElement('div'); g.style.cssText = `grid-row:5;grid-column:${c};text-align:center;font-size:11px;color:#8E99A6;cursor:default`; g.textContent = GROUP[c]; g.title = GNAME[c] || ''; pt.appendChild(g); }
          let mode = 'none', sel = 0;
          const val = { r: Z => E[Z][5], ie: Z => E[Z][3], en: Z => E[Z][4] || null, tm: Z => TM[Z] || null };
          function paint() {
            for (let Z = 1; Z <= 36; Z++) {
              const el = cells[Z]; let bg = '', fg = '';
              if (mode === 'cls') { const c = NONMETAL.includes(Z) ? '#6FB4FF' : SEMI.includes(Z) ? '#C79CFF' : LIGHT.includes(Z) ? '#7FD99A' : '#FF9E9E'; bg = c; fg = '#0B0E12'; }
              else if (mode === 'tm') { if (!TM[Z]) { bg = '#1C232B'; } else { const t = TM[Z] < 1000 ? '#6FB4FF' : TM[Z] < 2000 ? '#FFA95C' : '#FF5A4D'; bg = t; fg = '#0B0E12'; } }
              else if (mode !== 'none') { const vs = []; for (let k = 1; k <= 36; k++) { const v = val[mode](k); if (v) vs.push(v); } const mn = Math.min(...vs), mx = Math.max(...vs), v = val[mode](Z); if (v) { const t = (v - mn) / (mx - mn); bg = `rgba(255,158,158,${0.12 + 0.88 * t})`; fg = t > 0.5 ? '#0B0E12' : ''; } }
              el.style.background = bg; el.style.color = fg; el.classList.toggle('sel', Z === sel); el.querySelector('small').style.color = fg || '';
            }
            const msg = { r: '↓ aşağı: çap büyür · → sağa: çap küçülür', ie: '→ sağa: iyonlaşma enerjisi artar · ↓ aşağı: azalır', en: '→ sağa ve ↑ yukarı: elektronegatiflik artar', cls: 'Mavi: metal olmayan · Mor: yarı metal · Yeşil: hafif metal · Pembe: diğer metaller', tm: 'Mavi: düşük (<1000 °C) · Turuncu: orta · Kırmızı: yüksek (>2000)' }[mode];
            if (msg && !sel) $('#pinfo', b).innerHTML = msg;
          }
          function select(Z) {
            sel = Z; const f = config(Z), sh = shells(Z), per = sh.filter(x => x > 0).length, [row, col] = cell(Z);
            let last = -1; SUBS.forEach((s, i) => { if (f[i] > 0) last = i; }); if (Z === 24 || Z === 29) last = 6;
            const lastName = SUBS[last][0], typ = lastName.endsWith('d') ? 'B' : 'A';
            const valn = typ === 'A' ? (sh[per - 1]) : (f[5] + f[6]);
            $('#pinfo', b).innerHTML = `<b>${E[Z][1]} (${E[Z][0]})</b> · Z=${Z} · elektron düzeni: ${cfgStr(Z)}<br>Son orbital <b>${lastName}</b> → <b>${typ}</b> grubu · ${typ === 'A' ? 'valans elektronu' : '4s + 3d elektronu'} = <b>${valn}</b> · son ana tabaka n=<b>${per}</b> → <b>${per}. periyot</b>.<br>Cetveldeki yeri: <b>${GROUP[col]}</b> (${GNAME[col] || ''}), ${row}. periyot. ${E[Z][4] ? 'Elektronegatiflik ' + E[Z][4] + '.' : ''} Atom yarıçapı ≈ ${E[Z][5]} pm. İyonlaşma enerjisi ${E[Z][3]} eV.`;
            paint();
          }
          UI.seg(b, '#mode', v => { mode = v; paint(); });
        }
      },
      {
        id: 'egilim', title: 'Eğilimleri grafikte gör', pg: 's.13-14',
        build(b) {
          b.innerHTML = `<p>Z = 1…36 için bir özelliğin değişimi <b>testere dişi</b> gibi. Her yeni periyot alkali metalle başlar (dibe düşer), soy gazda zirve yapar. Özelliği seç.</p>
          <div class="widget"><canvas></canvas><div class="ctl"><span class="seg" id="mt"><button data-v="ie" class="on">İyonlaşma enerjisi</button><button data-v="r">Atom yarıçapı</button><button data-v="en">Elektronegatiflik</button></span></div><div class="cap"></div></div>
          <div class="tip">Atom çapı küçülünce çekirdek dış elektronlara daha sıkı tutunur → elektronu koparmak (iyonlaşma) zorlaşır, başkasından çekmek (elektronegatiflik) kolaylaşır. <b>Bu üçü aynı hikâyedir.</b></div>`;
          let m = 'ie', t0 = 0; const info = { ie: ['İyonlaşma enerjisi (eV)', 'Soy gazlar zirvede, alkali metaller dipte. Periyotta soldan sağa artar.'], r: ['Atom yarıçapı (pm)', 'Periyotta soldan sağa azalır; yeni periyotta alkali metalle bir basamak yukarı fırlar (yeni yörünge).'], en: ['Elektronegatiflik', 'Sağ üst köşeye (F) doğru artar. Soy gazlar için tanımlı değil.'] };
          UI.seg(b, '#mt', v => { m = v; t0 = 0; UI.setCap(b, info[v][1]); });
          UI.loop($('canvas', b), 0.5, (ctx, W, H, st) => {
            t0 = Math.min(1, t0 + st.dt / 1.4); const L = 50, R = W - 14, T = 24, B = H - 36;
            const vals = []; for (let Z = 1; Z <= 36; Z++) vals.push(m === 'ie' ? E[Z][3] : m === 'r' ? E[Z][5] : E[Z][4] || null);
            const mx = Math.max(...vals.filter(Boolean)) * 1.08, X = Z => L + (Z - 1) / 35 * (R - L), Y = v => B - v / mx * (B - T);
            UI.line(ctx, L, B, R, B, '#3a4654', 1); UI.line(ctx, L, T, L, B, '#3a4654', 1);
            [[2, 'He'], [10, 'Ne'], [18, 'Ar'], [36, 'Kr']].forEach(([z, s]) => { UI.line(ctx, X(z), T, X(z), B, '#222b34', 1, [3, 4]); UI.text(ctx, s, X(z), B + 14, '#8E99A6', 11, 'center'); });
            [[3, 'Li'], [11, 'Na'], [19, 'K']].forEach(([z, s]) => UI.text(ctx, s, X(z), B + 14, '#FF9E9E', 11, 'center'));
            UI.text(ctx, info[m][0], L + 6, 12, '#C9D0D8', 12);
            const n = Math.floor(t0 * 36); ctx.beginPath(); let started = false;
            for (let Z = 1; Z <= n; Z++) { if (!vals[Z - 1]) { started = false; continue; } const x = X(Z), y = Y(vals[Z - 1]); if (!started) { ctx.moveTo(x, y); started = true; } else ctx.lineTo(x, y); }
            ctx.strokeStyle = '#FF9E9E'; ctx.lineWidth = 2; ctx.stroke();
            for (let Z = 1; Z <= n; Z++) if (vals[Z - 1]) UI.circle(ctx, X(Z), Y(vals[Z - 1]), 3.4, [2, 10, 18, 36].includes(Z) ? '#fff' : '#FF9E9E');
          });
        }
      },
      {
        id: 'iyon', title: 'Elektron verince küçülür, alınca büyür', pg: 's.14',
        build(b) {
          b.innerHTML = `<p><b>Metalik özellik</b> elektron verme eğilimiyle, <b>ametalik özellik</b> elektron alma eğilimiyle ölçülür (s.14). Na bir elektron verir, Cl alır: iyon bağının başlangıcı bu.</p>
          <div class="widget"><canvas></canvas><div class="ctl"><button class="btn on" id="go">Elektronu aktar</button><button class="btn" id="back">Geri al</button></div><div class="cap"></div></div>
          <div class="key"><ul><li>Gruplarda <b>yukarıdan aşağı</b> elektron verme özelliği <b>artar</b>; periyotta <b>soldan sağa azalır</b>.</li><li>Yörünge sayısı eşitse <b>değerlik elektronu az olan</b> daha kolay elektron verir.</li><li>Elektron veren atom <b>küçülür</b> (katyon), elektron alan atom <b>büyür</b> (anyon).</li></ul></div>`;
          let tgt = 0, p = 0; $('#go', b).onclick = () => tgt = 1; $('#back', b).onclick = () => tgt = 0;
          UI.loop($('canvas', b), 0.42, (ctx, W, H, st) => {
            p += (tgt - p) * Math.min(1, st.dt * 2.2); const cy = H / 2, ax = W * 0.27, bx = W * 0.73, sc = Math.min(W / 700, 1);
            const rNa = (180 - 85 * p) * 0.55 * sc * 1.1, rCl = (100 + 81 * p) * 0.55 * sc * 1.1;
            UI.circle(ctx, ax, cy, rNa, 'rgba(255,158,158,.14)', '#FF9E9E', 2); UI.circle(ctx, ax, cy, 12, '#FF5A4D');
            UI.circle(ctx, bx, cy, rCl, 'rgba(111,180,255,.14)', '#6FB4FF', 2); UI.circle(ctx, bx, cy, 12, '#FF5A4D');
            const ex = UI.lerp(ax + rNa, bx - rCl, p), ey = cy - 4 * Math.sin(p * 3.14) * 18;
            UI.circle(ctx, ex, ey, 16, 'rgba(95,180,255,.25)'); UI.circle(ctx, ex, ey, 7, '#5FB4FF');
            UI.text(ctx, p > 0.95 ? 'Na⁺' : 'Na', ax, cy + rNa + 20, '#fff', 20, 'center'); UI.text(ctx, p > 0.95 ? 'Cl⁻' : 'Cl', bx, cy + rCl + 20, '#fff', 20, 'center');
            UI.text(ctx, `≈ ${Math.round(180 - 85 * p)} pm`, ax, cy - rNa - 14, '#8E99A6', 12, 'center'); UI.text(ctx, `≈ ${Math.round(100 + 81 * p)} pm`, bx, cy - rCl - 14, '#8E99A6', 12, 'center');
            if (p > 0.95) UI.arrow(ctx, ax + rNa + 6, cy + 4, bx - rCl - 6, cy + 4, '#F5C542', 1.5);
          });
          UI.setCap(b, 'Na: 2-8-1 → verir → 2-8 (küçülür, +). Cl: 2-8-7 → alır → 2-8-8 (büyür, −). Zıt yükler birbirini çeker.');
        }
      }
    ]
  };
})();
