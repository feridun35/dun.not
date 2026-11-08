'use strict';
/* ============ VİZE 6 · Kitap 2.66: iki eksenli gerilmede kare (Hooke + Poisson) ============ */
VIZE.push((() => {
  // birim uzamayı "340·10⁻⁶" biçiminde yaz (ekran üstü ve düz metin için)
  const u6 = x => fmt(x * 1e6, 1) + '·10⁻⁶';
  const sg = x => (x >= 0 ? '+' : '') + fmt(x * 1e6, 1);
  const um = x => fmt(x, 2) + ' μm';
  const ne = x => (x >= 0 ? 'uzar' : 'kısalır');
  return {
    id: 'v6', no: 6, kod: 'V6', vize: true, tip: 'po',
    src: 'Kitap problemi 2.66 (vize PDF\'i s. 7)', img: 'img/v6.png',
    hoca: 'Bu soru PDF’te cevap anahtarı olmadan, kitap sorusu olarak verilmiş; hocanın çözümü yok. Sonuçlar kitabın (Beer–Johnston 2.66) cevabıyla karşılaştırıldı ve aynı çıktı: <b>δ_AB = 10,2 μm</b>, <b>δ_BC = 2,4 μm</b>, <b>δ_AC ≈ 8,91 μm</b>.',
    ad: 'Basınç kabına çizilmiş kare',
    ozet: 'Kare iki yönde birden çekiliyor. Her yön kendi gerilmesiyle uzar, öbür yöndeki gerilme yüzünden biraz daralır (Poisson). İkisini topla, kenarla çarp.',
    soru: 'Geniş bir çelik basınç kabının kenarı üzerine 30 mm\'lik bir kare çizilmiştir. Basınç uygulandıktan sonra, karedeki iki eksenli gerilme durumu şekilde gösterildiği gibidir. E = 200 GPa ve ν = 0,30 olduğuna göre, (a) AB kenarının, (b) BC kenarının, (c) AC köşegeninin uzunluğundaki değişmeyi belirleyiniz.',
    verilen: ['Kare ABCD, kenar a = 30 mm (A sol üst, B sağ üst, C sağ alt, D sol alt)', 'σ<sub>x</sub> = 80 MPa (yatay, çekme)', 'σ<sub>y</sub> = 40 MPa (düşey, çekme)', 'Kayma gerilmesi yok', 'E = 200 GPa = 200 000 MPa, ν = 0,30'],
    istenen: 'δ<sub>AB</sub>, δ<sub>BC</sub> ve δ<sub>AC</sub> (uzunluk değişimleri)',
    p0: { sx: 80, sy: 40, E: 200, nu: 0.30, a: 30, mat: 'çelik' },
    solve(p) {
      const E = p.E * 1000; // GPa → MPa
      const ex1 = p.sx / E, ey1 = -p.nu * p.sx / E;   // yalnız σx
      const ey2 = p.sy / E, ex2 = -p.nu * p.sy / E;   // yalnız σy
      const ex = ex1 + ex2, ey = ey1 + ey2;
      const dAB = ex * p.a * 1000, dBC = ey * p.a * 1000; // μm
      const L0 = p.a * Math.SQRT2, ab = p.a * (1 + ex), bc = p.a * (1 + ey), L1 = Math.hypot(ab, bc);
      const eAC = (ex + ey) / 2;
      return { E, ex1, ey1, ey2, ex2, ex, ey, dAB, dBC, L0, ab, bc, L1, dAC: (L1 - L0) * 1000, eAC, dACk: eAC * L0 * 1000 };
    },
    anlam: [
      ['30 mm\'lik bir kare', 'Dört kenar 30 mm, köşegen 30√2 = 42,43 mm. Bunlar <b>ilk</b> boylar; soru sadece ne kadar <b>değiştiklerini</b> soruyor.'],
      ['iki eksenli gerilme', 'Kare aynı anda <b>iki yönde</b> çekiliyor: yatayda σ<sub>x</sub>, düşeyde σ<sub>y</sub>. Tek çubuk sorusu gibi σ/E yetmez; öbür yönün etkisi de var.'],
      ['ν = 0,30', 'Poisson oranı: bir yönde çekilen malzeme <b>yan yönde incelir</b>. İnceleme payı = 0,30 × o yöndeki uzama.'],
      ['AB kenarı', 'Şekilde A sol üst, B sağ üst: AB <b>yatay</b> kenar, x yönünde. Değişimi ε<sub>x</sub> ile.'],
      ['BC kenarı', 'B sağ üst, C sağ alt: BC <b>düşey</b> kenar, y yönünde. Değişimi ε<sub>y</sub> ile.'],
      ['AC köşegeni', 'Sol üstten sağ alta 45° giden köşegen. Kayma yok, kare dikdörtgen olur: yeni boyu Pisagor ile.'],
      ['E = 200 GPa', 'MPa ile bölmek için 200 000 MPa yaz. Sonuç milimetrenin binde biri: <b>μm</b> mertebesi.']
    ],
    tetik: ['iki eksenli gerilme', 'ν (Poisson oranı)', 'kenarın uzunluğundaki değişme', 'köşegen', 'çizilmiş kare'],
    tetikNot: 'Soruda kuvvet değil doğrudan gerilme verilmiş ve "uzunluk değişimi" soruluyor: bu bir şekil değiştirme sorusu. İki yönde gerilme + ν görünce aklına şu gelsin: her yön = kendi gerilmesinin uzatması − öbür gerilmenin Poisson daraltması.',
    zincir: [
      ['Ne isteniyor?', 'Uzunluk değişimi δ. δ = ε · L, yani önce her yöndeki <b>birim uzama ε</b> lazım.'],
      ['ε\'yi nasıl bulurum?', 'Tek yönde çekme olsaydı ε = σ/E. Burada iki gerilme var; her birinin etkisini <b>ayrı ayrı</b> bulup toplarım.'],
      ['σ<sub>x</sub> y yönüne ne yapar?', 'y yönünü <b>daraltır</b> (Poisson): −ν·σ<sub>x</sub>/E. Aynı şekilde σ<sub>y</sub> de x yönünü daraltır.'],
      ['Hangi kenar hangi yön?', 'Şekle bak: AB yatay → ε<sub>x</sub>. BC düşey → ε<sub>y</sub>.'],
      ['Köşegen?', 'Kayma yok, köşeler 90° kalır. Yeni kenarlarla Pisagor, ya da kısa yol: köşegenin birim uzaması (ε<sub>x</sub> + ε<sub>y</sub>)/2.']
    ],
    cam: { yaw: -0.1, pitch: 0.06, dist: 13, t: [0.7, -0.2, 0] },
    steps: [
      { t: 'Şekle bak: kare iki yönde çekiliyor', st: { sx: 1, sy: 1, lab: 1, dim: 1 },
        h: (p) => `Kabın duvarından küçük bir parça (gri levha) ve üstüne çizilmiş ${p.a} mm'lik kare. Basınç gelince duvar <b>iki yönde</b> gerilir: yatayda σ<sub>x</sub> = ${fmt(p.sx)} MPa, düşeyde σ<sub>y</sub> = ${fmt(p.sy)} MPa. Köşeler: A sol üst, B sağ üst, C sağ alt, D sol alt. Yani <b>AB yatay</b> (x), <b>BC düşey</b> (y), AC köşegen.`,
        why: 'Kenarlara dik oklar var, kenar boyunca (teğet) ok yok: kayma gerilmesi sıfır. Bu yüzden köşeler 90° kalır, kare sadece bir dikdörtgene dönüşür. Köşegeni Pisagor ile bulabilmemizin nedeni bu.' },
      { t: 'Sadece σx olsaydı: x\'te uzar, y\'de daralır', st: { sx: 1, ux: 1, pulse: 1, ghost: 1, px: 1, lab: 1 },
        h: (p, r) => `Önce yalnız yatay çekmeyi düşün. Kare x yönünde uzar: σ<sub>x</sub>/E. Ama aynı anda <b>y yönünde incelir</b>, tıpkı çektiğin bir lastiğin incelmesi gibi (mavi oklar). Bu inceleme uzamanın ν katıdır. Bu yana daralmaya <b>Poisson etkisi</b> denir.`,
        f: (p, r) => `x: σ<sub>x</sub>/E = ${fmt(p.sx)} / ${fmt(r.E)} = <b>${u6(r.ex1)}</b> (uzama)<br>y: −ν · σ<sub>x</sub>/E = −${fmt(p.nu)} · ${u6(r.ex1)} = <b>${u6(r.ey1)}</b> (daralma)`,
        why: 'Malzemeyi bir yönde çekince atomlar o yönde birbirinden uzaklaşır, yan yönde biraz yaklaşır. Ne kadar yaklaşacağı malzemenin özelliğidir: ν. Çelikte ν ≈ 0,3: çekilen yönde 1 birim (oransal) uzarken yan yönde 0,3 birim kısalır. Animasyonda kesikli çizgi karenin ilk hali; değişim binlerce kat abartılı.' },
      { t: 'Sadece σy olsaydı: y\'de uzar, x\'te daralır', st: { sy: 1, uy: 1, pulse: 1, ghost: 1, py: 1, lab: 1 },
        h: (p, r) => `Şimdi tersini düşün: yalnız düşey çekme. Kare y yönünde uzar, bu sefer <b>x yönünde incelir</b>. Aynı kural, yönler yer değiştirdi.`,
        f: (p, r) => `y: σ<sub>y</sub>/E = ${fmt(p.sy)} / ${fmt(r.E)} = <b>${u6(r.ey2)}</b> (uzama)<br>x: −ν · σ<sub>y</sub>/E = −${fmt(p.nu)} · ${u6(r.ey2)} = <b>${u6(r.ex2)}</b> (daralma)` },
      { t: 'İkisi birlikte: etkileri topla', st: { sx: 1, sy: 1, ux: 1, uy: 1, def: 1, ghost: 1, tab: 1, lab: 1 },
        h: (p, r) => `Gerilmeler gerçekte aynı anda var. Şekil değişimleri küçük olduğu için etkiler birbirini bozmaz, <b>üst üste toplanır</b>. Her yön için: kendi gerilmesinin uzatması, eksi öbür gerilmenin Poisson daraltması. Bak: σ<sub>y</sub> tek başına y'yi ${sg(r.ey2)} uzatacaktı, σ<sub>x</sub> bunun ${fmt(-r.ey1 * 1e6, 1)}'ini geri aldı.`,
        f: (p, r) => `ε<sub>x</sub> = (σ<sub>x</sub> − ν·σ<sub>y</sub>)/E = (${fmt(p.sx)} − ${fmt(p.nu)}·${fmt(p.sy)}) / ${fmt(r.E)} = <b>${u6(r.ex)}</b><br>ε<sub>y</sub> = (σ<sub>y</sub> − ν·σ<sub>x</sub>)/E = (${fmt(p.sy)} − ${fmt(p.nu)}·${fmt(p.sx)}) / ${fmt(r.E)} = <b>${u6(r.ey)}</b>`,
        why: 'Bu iki satıra "genelleştirilmiş Hooke yasası" denir. Ezberleme: 2. ve 3. adımın toplamından başka bir şey değil. Her seferinde "kendi yönüm artı, öbür yön ν katı eksi" de. (Kalınlık yönü z\'de gerilme yok ama o da incelir: ε<sub>z</sub> = −ν(σ<sub>x</sub> + σ<sub>y</sub>)/E. Bu soruda sorulmuyor.)' },
      { t: '(a) AB kenarı: yatay, εx ile', st: { ux: 1, uy: 1, def: 1, ghost: 1, hAB: 1, lab: 1, dim: 1 },
        h: (p, r) => `AB yatay kenar, x yönünde uzanıyor. Boyu x yönündeki birim uzama kadar oransal değişir: değişim = ε<sub>x</sub> · ilk boy.`,
        f: (p, r) => `δ<sub>AB</sub> = ε<sub>x</sub> · a = ${u6(r.ex)} · ${fmt(p.a)} mm = ${fmt(r.dAB / 1000, 5)} mm = <b>${um(r.dAB)}</b> (${ne(r.dAB)})`,
        why: 'μm = mikrometre = milimetrenin binde biri. 0,0102 mm = 10,2 μm. Saç telinin kalınlığının yaklaşık onda biri kadar: gözle görülmez, ama ölçülebilir (gerinim ölçerler tam bunu ölçer).' },
      { t: '(b) BC kenarı: düşey, εy ile', st: { ux: 1, uy: 1, def: 1, ghost: 1, hBC: 1, lab: 1, dim: 1 },
        h: (p, r) => `BC düşey kenar, y yönünde. Bu sefer ε<sub>y</sub> ile çarp. σ<sub>y</sub> çekme olmasına rağmen uzama küçük, çünkü σ<sub>x</sub>'in Poisson daraltması y uzamasının büyük kısmını yedi.`,
        f: (p, r) => `δ<sub>BC</sub> = ε<sub>y</sub> · a = ${u6(r.ey)} · ${fmt(p.a)} mm = ${fmt(r.dBC / 1000, 5)} mm = <b>${um(r.dBC)}</b> (${ne(r.dBC)})` },
      { t: '(c) AC köşegeni: yeni kenarlarla Pisagor', st: { ux: 1, uy: 1, def: 1, ghost: 1, hAC: 1, lab: 1 },
        h: (p, r) => `Köşeler 90° kaldığı için yeni şekil bir dikdörtgen. Köşegeni yeni kenarlardan Pisagor ile bul, ilk köşegenden çıkar. <b>Dikkat:</b> sayılar 42,43 ile 42,43 gibi çok yakın; hesap makinesinde en az 6 ondalık tut.`,
        f: (p, r) => `ilk: AC₀ = ${fmt(p.a)}·√2 = ${fmt(r.L0, 6)} mm<br>yeni: AC = √(${fmt(r.ab, 6)}² + ${fmt(r.bc, 6)}²) = ${fmt(r.L1, 6)} mm<br>δ<sub>AC</sub> = ${fmt(r.L1 - r.L0, 6)} mm = <b>${um(r.dAC)}</b>`,
        why: 'Kısa yol: 45° köşegen yarı yarıya x ve y yönünde gider, bu yüzden birim uzaması ikisinin ortalamasıdır: ε<sub>AC</sub> = (ε<sub>x</sub> + ε<sub>y</sub>)/2. Buradan δ<sub>AC</sub> = ε<sub>AC</sub> · a√2. (Genel hali ε<sub>θ</sub> = ε<sub>x</sub>cos²θ + ε<sub>y</sub>sin²θ; 45°\'de cos² = sin² = 1/2.) İki yol aynı sonucu verir.' },
      { t: 'Kısa yol ve özet', st: { ux: 1, uy: 1, def: 1, ghost: 1, hAB: 1, hBC: 1, hAC: 1, lab: 1 },
        h: (p, r) => `Köşegenin birim uzaması, iki kenarın birim uzamalarının ortalaması. Sonuçlar: AB ${um(r.dAB)}, BC ${um(r.dBC)}, AC ${um(r.dAC)}. Köşegen değişimi iki kenarın arasında bir yerde: ne toplamları ne Pisagor'la birleşimleri.`,
        f: (p, r) => `ε<sub>AC</sub> = (${u6(r.ex)} + ${u6(r.ey)}) / 2 = ${u6(r.eAC)}<br>δ<sub>AC</sub> = ${u6(r.eAC)} · ${fmt(r.L0, 3)} mm = <b>${um(r.dACk)}</b> ✓` }
    ],
    scene(v, p, r) {
      const A0 = 3, Z = 0.03; // kare 3 birim = a mm
      v.add(E3.box(11, 8, 0.3), { color: '#4a5562', pos: [0, 0, -0.18], bias: 0.6 });
      const sq = v.add(E3.box(A0, A0, 0.04), { color: '#d3e2ee', pos: [0, 0, 0], bias: -0.3 });
      const def = { sx: 0, sy: 0, ux: 0, uy: 0, def: 0, pulse: 0, ghost: 0, px: 0, py: 0, tab: 0, lab: 0, dim: 0, hAB: 0, hBC: 0, hAC: 0 };
      return {
        def, apply(S, time, v) {
          const amp = S.ex * 1500, m = S.def * (1 - S.pulse) + S.pulse * loop(time, 1.5);
          // abartılı birim uzamalar: ux/uy hangi gerilmenin etkisi açık
          const exs = S.ux * r.ex1 + S.uy * r.ex2, eys = S.ux * r.ey1 + S.uy * r.ey2;
          const W = A0 * (1 + exs * amp * m), H = A0 * (1 + eys * amp * m), w = W / 2, hh = H / 2;
          sq.scl = [W / A0, H / A0, 1];
          const O = v.ov, A = [-w, hh, Z], B = [w, hh, Z], Cc = [w, -hh, Z], D = [-w, -hh, Z];
          if (S.ghost > 0.01) O.push({ k: 'line', p: [[-1.5, 1.5, Z], [1.5, 1.5, Z], [1.5, -1.5, Z], [-1.5, -1.5, Z]], close: 1, dash: [5, 4], color: C.white, w: 1.3, alpha: S.ghost * 0.75 });
          // gerilme okları (kenara dik, dışarı)
          const ys = [-1.1, -0.55, 0, 0.55, 1.1];
          if (S.sx > 0.01) {
            ys.forEach(y => { O.push({ k: 'arrow', a: [w + 0.1, y * H / A0, Z], b: [w + 1.0, y * H / A0, Z], color: C.tens, w: 2, hs: 9, alpha: S.sx }); O.push({ k: 'arrow', a: [-w - 0.1, y * H / A0, Z], b: [-w - 1.0, y * H / A0, Z], color: C.tens, w: 2, hs: 9, alpha: S.sx }); });
            O.push({ k: 'text', t: `σ_x = ${fmt(p.sx)} MPa`, p: [w + 1.25, -0.9, Z], align: 'left', color: C.tens, size: 15, box: 1, alpha: S.sx });
          }
          if (S.sy > 0.01) {
            ys.forEach(x => { O.push({ k: 'arrow', a: [x * W / A0, hh + 0.1, Z], b: [x * W / A0, hh + 1.0, Z], color: C.tens, w: 2, hs: 9, alpha: S.sy }); O.push({ k: 'arrow', a: [x * W / A0, -hh - 0.1, Z], b: [x * W / A0, -hh - 1.0, Z], color: C.tens, w: 2, hs: 9, alpha: S.sy }); });
            O.push({ k: 'text', t: `σ_y = ${fmt(p.sy)} MPa`, p: [0, hh + 1.45, Z], color: C.tens, size: 15, box: 1, alpha: S.sy });
          }
          // Poisson daralması: mavi, içe doğru
          if (S.px > 0.01) {
            [-0.9, 0, 0.9].forEach(x => { O.push({ k: 'arrow', a: [x * W / A0, hh + 0.95, Z], b: [x * W / A0, hh + 0.15, Z], color: C.comp, w: 2.4, hs: 10, alpha: S.px }); O.push({ k: 'arrow', a: [x * W / A0, -hh - 0.95, Z], b: [x * W / A0, -hh - 0.15, Z], color: C.comp, w: 2.4, hs: 10, alpha: S.px }); });
            O.push({ k: 'text', t: `Poisson: y'de daralır\nε_y = ${u6(r.ey1)}`, p: [0, hh + 1.55, Z], color: C.comp, size: 14, box: 1, alpha: S.px });
            O.push({ k: 'text', t: `x'te uzar\nε_x = +${u6(r.ex1)}`, p: [w + 1.25, 0.9, Z], align: 'left', color: C.tens, size: 14, box: 1, alpha: S.px });
          }
          if (S.py > 0.01) {
            [-0.9, 0, 0.9].forEach(y => { O.push({ k: 'arrow', a: [w + 0.95, y * H / A0, Z], b: [w + 0.15, y * H / A0, Z], color: C.comp, w: 2.4, hs: 10, alpha: S.py }); O.push({ k: 'arrow', a: [-w - 0.95, y * H / A0, Z], b: [-w - 0.15, y * H / A0, Z], color: C.comp, w: 2.4, hs: 10, alpha: S.py }); });
            O.push({ k: 'text', t: `Poisson: x'te daralır\nε_x = ${u6(r.ex2)}`, p: [w + 1.2, -1.6, Z], align: 'left', color: C.comp, size: 14, box: 1, alpha: S.py });
            O.push({ k: 'text', t: `y'de uzar\nε_y = +${u6(r.ey2)}`, p: [w + 1.2, 1.6, Z], align: 'left', color: C.tens, size: 14, box: 1, alpha: S.py });
          }
          if (S.tab > 0.01) O.push({ k: 'text', t: `kendi + Poisson = toplam (·10⁻⁶)\nx:  ${sg(r.ex1)}  ${sg(r.ex2)}  = ${sg(r.ex)}\ny:  ${sg(r.ey2)}  ${sg(r.ey1)}  = ${sg(r.ey)}`, p: [0, -hh - 2.0, Z], color: C.white, size: 14, box: 1, alpha: S.tab });
          if (S.lab > 0.01) [['A', A, -1, 1], ['B', B, 1, 1], ['C', Cc, 1, -1], ['D', D, -1, -1]].forEach(([t, q, sx, sy]) =>
            O.push({ k: 'text', t, p: [q[0] + sx * 0.32, q[1] + sy * 0.32, Z], size: 17, color: C.white, alpha: S.lab }));
          if (S.dim > 0.01 && S.hAB < 0.5) O.push({ k: 'dim', a: [-1.5, -hh, Z], b: [1.5, -hh, Z], off: [0, -1.25, 0], t: `${fmt(p.a)} mm`, alpha: S.dim * (1 - S.sy * 0.5) * (1 - S.hBC) });
          if (S.dim > 0.01 && S.hBC < 0.5) O.push({ k: 'dim', a: [-w, -1.5, Z], b: [-w, 1.5, Z], off: [-1.3, 0, 0], t: `${fmt(p.a)} mm`, tdx: -22, tdy: 0, alpha: S.dim * (1 - S.sx * 0.5) * (1 - S.hAB) });
          // vurgu: kenarlar ve köşegen
          if (S.hAB > 0.01) {
            O.push({ k: 'line', p: [A, B], color: C.red, w: 4.5, alpha: S.hAB });
            O.push({ k: 'text', t: `AB: ${fmt(p.a)} → ${fmt(r.ab, 4)} mm\nδ_AB = ${um(r.dAB)}`, p: [0, hh + 0.95, Z], color: C.red, size: 14, box: 1, alpha: S.hAB });
          }
          if (S.hBC > 0.01) {
            O.push({ k: 'line', p: [B, Cc], color: '#ffb020', w: 4.5, alpha: S.hBC });
            O.push({ k: 'text', t: `BC: ${fmt(p.a)} → ${fmt(r.bc, 4)} mm\nδ_BC = ${um(r.dBC)}`, p: [w + 0.5, 0, Z], align: 'left', color: '#ffb020', size: 14, box: 1, alpha: S.hBC });
          }
          if (S.hAC > 0.01) {
            O.push({ k: 'line', p: [A, Cc], color: C.white, w: 3.5, alpha: S.hAC });
            O.push({ k: 'line', p: [[-1.5, 1.5, Z], [1.5, -1.5, Z]], color: C.mute, w: 1.3, dash: [5, 4], alpha: S.hAC * S.ghost });
            O.push({ k: 'text', t: `AC: ${fmt(r.L0, 3)} → ${fmt(r.L1, 4)} mm\nδ_AC = ${um(r.dAC)}`, p: [-w - 0.2, -hh - 1.05, Z], align: 'left', color: C.white, size: 14, box: 1, alpha: S.hAC });
          }
          if (S.def > 0.5 && S.pulse < 0.5) O.push({ k: 'text', t: 'kesikli: ilk kare · değişim binlerce kat abartılı', p: [0, -3.65, Z], color: C.mute, size: 12, alpha: S.ghost * 0.9 * (1 - S.tab) });
        }
      };
    },
    whatif: {
      not: 'Kaydırıcıları oynat. ν\'yü sıfıra çek: Poisson etkisi kalkar, her kenar sadece kendi gerilmesiyle uzar. σx\'i büyütüp σy\'yi küçült: BC kenarı çekmede olduğu halde kısalabilir.',
      s: [{ k: 'sx', ad: 'σx', min: -100, max: 200, step: 5, u: 'MPa' }, { k: 'sy', ad: 'σy', min: -100, max: 200, step: 5, u: 'MPa' }, { k: 'nu', ad: 'ν', min: 0, max: 0.5, step: 0.01, u: '' }, { k: 'E', ad: 'E', min: 50, max: 220, step: 5, u: 'GPa' }],
      out: (p, r) => `<div class="mets"><div class="m"><small>ε_x</small><b>${u6(r.ex)}</b></div><div class="m"><small>ε_y</small><b>${u6(r.ey)}</b></div>
        <div class="m ${r.dAB >= 0 ? 'red' : 'blue'}"><small>δ_AB (yatay)</small><b>${um(r.dAB)}</b></div><div class="m ${r.dBC >= 0 ? 'red' : 'blue'}"><small>δ_BC (düşey)</small><b>${um(r.dBC)}</b></div>
        <div class="m"><small>δ_AC (köşegen)</small><b>${um(r.dAC)}</b></div></div>
        <p class="note">${p.sy > 0 && r.ey < 0 ? '<b>Dikkat:</b> y yönünde çekme var ama BC kısalıyor. σx\'in Poisson daraltması (ν·σx), σy\'nin kendi uzatmasından büyük. ' : p.sx > 0 && r.ex < 0 ? '<b>Dikkat:</b> x yönünde çekme var ama AB kısalıyor: ν·σy, σx\'ten büyük. ' : ''}Kural hep aynı: kendi gerilmesi artı, öbür gerilmenin ν katı eksi. Köşegenin birim uzaması her zaman iki kenarınkinin ortalaması.</p>`
    },
    kagit: (p, r) => `Kayma yok → kare dikdörtgen olur. E = ${fmt(r.E)} MPa
εx = (σx − ν·σy)/E = (${fmt(p.sx)} − ${fmt(p.nu)}·${fmt(p.sy)})/${fmt(r.E)} = ${u6(r.ex)}
εy = (σy − ν·σx)/E = (${fmt(p.sy)} − ${fmt(p.nu)}·${fmt(p.sx)})/${fmt(r.E)} = ${u6(r.ey)}
(a) AB yatay:  δAB = εx·a = ${u6(r.ex)}·${fmt(p.a)} = ${fmt(r.dAB / 1000, 5)} mm = ${um(r.dAB)}
(b) BC düşey:  δBC = εy·a = ${u6(r.ey)}·${fmt(p.a)} = ${fmt(r.dBC / 1000, 5)} mm = ${um(r.dBC)}
(c) AC:  AC₀ = ${fmt(p.a)}√2 = ${fmt(r.L0, 6)} mm
    AC = √(${fmt(r.ab, 6)}² + ${fmt(r.bc, 6)}²) = ${fmt(r.L1, 6)} mm
    δAC = ${um(r.dAC)}
    (kontrol: εAC = (εx+εy)/2 = ${u6(r.eAC)} → δAC = ${u6(r.eAC)}·${fmt(r.L0, 3)} = ${um(r.dACk)})`,
    tuzak: ['<b>Poisson\'u unutmak.</b> δ<sub>AB</sub> = σ<sub>x</sub>/E · a yazarsan 12 μm bulursun; doğrusu 10,2 μm. BC\'de fark daha büyük: 6 μm yerine 2,4 μm.',
      '<b>İşareti ters almak.</b> Öbür yöndeki çekme <b>daraltır</b>: (σ<sub>x</sub> − ν·σ<sub>y</sub>), artı değil.',
      '<b>Kenarları karıştırmak.</b> Şekle bak: A sol üst, B sağ üst. AB yatay → ε<sub>x</sub>; BC düşey → ε<sub>y</sub>.',
      '<b>Köşegeni kenar değişimlerinden Pisagor\'la bulmak.</b> √(10,2² + 2,4²) = 10,48 μm yanlış. Pisagor yeni <b>boylara</b> uygulanır, değişimlere değil. Toplamak da yanlış (12,6 μm).',
      '<b>Az ondalık tutmak.</b> 42,435 − 42,426 farkı mikronlarda; yuvarlarsan sonuç 0 ya da çok yanlış çıkar. Kısa yolu (ε<sub>x</sub> + ε<sub>y</sub>)/2 kullan, yuvarlama derdi yok.',
      '<b>Birim.</b> E = 200 GPa = 200 000 MPa. MPa/MPa → ε birimsiz; mm ile çarp, sonra × 1000 → μm.'],
    gen() {
      const M = [['çelik', 200, 0.30], ['çelik', 200, 0.30], ['alüminyum', 70, 0.33], ['bronz', 105, 0.34]];
      for (let i = 0; i < 60; i++) {
        const m = pick(M), p = { sx: rnd(40, 160, 10), sy: rnd(20, 120, 10), E: m[1], nu: m[2], a: pick([20, 25, 30, 40, 50]), mat: m[0] };
        const r = this.solve(p);
        if (Math.abs(r.dAB) >= 1 && Math.abs(r.dBC) >= 1) return p;
      }
      return Object.assign({}, this.p0);
    },
    pracText: p => `Bir ${p.mat || 'çelik'} levhaya ${fmt(p.a)} mm'lik ABCD karesi çizilmiş (A sol üst, B sağ üst, C sağ alt, D sol alt). Levhada yatayda σx = ${fmt(p.sx)} MPa, düşeyde σy = ${fmt(p.sy)} MPa çekme var, kayma yok. E = ${fmt(p.E)} GPa, ν = ${fmt(p.nu)}. AB kenarının, BC kenarının ve AC köşegeninin uzunluk değişimini μm cinsinden bul (kısalma çıkarsa eksi yaz).`,
    ans: [{ k: 'dAB', ad: 'δ_AB', u: 'μm', tol: 0.03 }, { k: 'dBC', ad: 'δ_BC', u: 'μm', tol: 0.03 }, { k: 'dAC', ad: 'δ_AC', u: 'μm', tol: 0.03 }],
    hints: (p, r) => [`Her yön: kendi gerilmesi eksi ν × öbür gerilme, hepsi bölü E. εx = (${fmt(p.sx)} − ${fmt(p.nu)}·${fmt(p.sy)}) / ${fmt(r.E)}.`,
      `AB yatay → εx·${fmt(p.a)} mm; BC düşey → εy·${fmt(p.a)} mm. mm'yi 1000 ile çarp → μm.`,
      `Köşegen: εAC = (εx + εy)/2, ilk boy ${fmt(p.a)}·√2 = ${fmt(r.L0, 3)} mm.`],
    diag(p, r, u) {
      const near = (a, b) => isFinite(a) && Math.abs(a - b) <= Math.abs(b) * 0.03 + 1e-9;
      const E = r.E, k = p.a * 1000;
      if (near(u.dAB, r.dAB / 1000) || near(u.dBC, r.dBC / 1000) || near(u.dAC, r.dAC / 1000)) return 'Sonuç mm cinsinden kalmış. Soru μm istiyor: 1000 ile çarp.';
      if (near(u.dAB, r.dAB * 1000) || near(u.dAB, r.dAB / 1e6) || near(u.dBC, r.dBC * 1000)) return 'Birim sorunu: E\'yi GPa\'dan MPa\'ya çevir (× 1000), σ zaten MPa.';
      if (near(u.dAB, r.dBC) && near(u.dBC, r.dAB)) return 'AB ile BC yer değiştirmiş. A sol üst, B sağ üst: AB yatay (εx), BC düşey (εy).';
      if (near(u.dAB, p.sx / E * k) || near(u.dBC, p.sy / E * k)) return 'Poisson payını unuttun: öbür yöndeki gerilme bu yönü ν katı kadar daraltır. εx = (σx − ν·σy)/E.';
      if (near(u.dAB, (p.sx + p.nu * p.sy) / E * k) || near(u.dBC, (p.sy + p.nu * p.sx) / E * k)) return 'İşaret ters: öbür yöndeki çekme daraltır, ν·σ\'yı çıkar.';
      if (near(u.dAC, r.dAB + r.dBC)) return 'Köşegen değişimi kenar değişimlerinin toplamı değil. εAC = (εx + εy)/2, sonra ilk köşegenle çarp.';
      if (near(u.dAC, Math.hypot(r.dAB, r.dBC))) return 'Pisagor\'u değişimlere uygulamışsın. Pisagor yeni boylara uygulanır; ya da kısa yol: εAC = (εx + εy)/2.';
      if (near(u.dAC, r.eAC * k)) return 'εAC doğru ama kenarla (a) çarpmışsın. Köşegenin ilk boyu a·√2.';
      return 'Adım adım git: önce εx ve εy (Poisson payıyla), sonra kenarla çarp, köşegen için ortalama ε ve a√2.';
    }
  };
})());
