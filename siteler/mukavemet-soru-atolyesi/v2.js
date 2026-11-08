'use strict';
/* ============ VİZE 2 · 2016–17 Yaz S2 = kitap 2.46 = 2018–19 Güz S2 · F'de mafsallı rijit AF + iki çubuk ============ */
VIZE.push({
  id: 'v2', no: 2, kod: 'V2', vize: true, tip: 'rk',
  src: '2016–17 Yaz vizesi · Soru 2 (kitap 2.46 ve 2018–19 Güz vizesi · Soru 2 ile aynı)',
  img: 'img/v2.png', cevapImg: 'img/v2_cevap.png',
  hoca: `<p><b>2016–17 Yaz, Soru 2</b> (kitap 2.46 ile aynı sayılar: E = 200 GPa, P = 2,4 kN). Hoca kuvvetleri θ cinsinden yazmış: P<sub>CB</sub> = 14 400 000·θ, P<sub>DE</sub> = 5 760 000·θ; ΣM<sub>F</sub> = 0 ile <b>θ = 0,000277 rad</b>, <b>P<sub>CB</sub> = 4000 N</b>, <b>P<sub>DE</sub> = 1600 N</b>, <b>δ<sub>A</sub> = 200·θ = 0,055 mm</b>.</p>
  <p>Bizim sonuç: θ = 2,778·10⁻⁴ rad (tam değeri 1/3600), 4000 N, 1600 N, δ<sub>A</sub> = 0,0556 mm. Kuvvetler birebir aynı. δ<sub>A</sub>\'daki küçük fark yuvarlamadan: hoca θ\'yı 0,000277\'de kesip 200 ile çarpmış (0,0554 → 0,055). Doğrusu 0,0556 ≈ 0,056 mm; sınavda ikisi de kabul görür ama θ\'yı en az 4 anlamlı basamakla taşı.</p>
  <p><b>2018–19 Güz, Soru 2</b> (E = 210 GPa, P = 3 kN). Hoca bu sefer önce oranı kurmuş: δ<sub>C</sub> = 2·δ<sub>D</sub>, δ<sub>C</sub> = 6,613·10⁻⁶·P<sub>C</sub>, δ<sub>D</sub> = 8,2671·10⁻⁶·P<sub>D</sub> → P<sub>C</sub> = 2,5·P<sub>D</sub>; momentten <b>P<sub>D</sub> = 2000 N</b>, <b>P<sub>C</sub> = 5000 N</b>, <b>δ<sub>C</sub> = 0,0330 mm</b>, δ<sub>D</sub> = 0,01653 mm, <b>δ<sub>A</sub> = (200/100)·δ<sub>C</sub> = 0,06613 mm</b>.</p>
  <p>Bizim sonuç: 5000 N, 2000 N, θ = 3,307·10⁻⁴ rad, δ<sub>C</sub> = 0,03307 mm, δ<sub>A</sub> = 0,06614 mm. Aynı (son basamak yuvarlama). Dikkat: kuvvetler sadece P ile büyüdü (2,4 → 3 kN, ×1,25); E\'nin 200\'den 210\'a çıkması kuvvetleri değiştirmedi, sadece yer değiştirmeleri biraz küçülttü.</p>
  <p>İki anahtar aynı fikrin iki yazılışı: (1) her şeyi θ ile yaz, momente koy (3D\'deki 5–7. adımlar); (2) önce kuvvet oranını bul, momente koy (9. adım). Hoca P<sub>CB</sub>, P<sub>C</sub> diyor; burada F<sub>BC</sub> dedik, aynı şey.</p>`,
  ad: 'Mafsallı rijit AF, biri sola biri sağa bağlı iki çubuk',
  ozet: 'AF, F etrafında çok az döner (θ). Her nokta F\'ye uzaklığıyla orantılı kayar: δ = x·θ. Çubuk kuvvetlerini θ cinsinden yaz, F\'ye göre moment al, θ\'yı bul.',
  soru: 'Şekilde BC ve DE bağlantı çubukları çelikten (E = 200 GPa) yapılmış olup, her biri 12 mm genişliğinde ve 6 mm kalınlığındadır. Şekilde görülen rijit AF elemanına 2,4 kN\'luk P kuvveti uygulandığında, (a) her bir bağlantı çubuğundaki kuvveti, (b) A noktasının karşı gelen yer değiştirmesini belirleyiniz.',
  verilen: ['Rijit AF, alt ucu F\'de mafsallı (dik duruyor)', 'F\'den yukarı: D 50 mm, C 100 mm, A 200 mm',
    'BC çubuğu: C\'den sola, sol duvara, L = 100 mm', 'DE çubuğu: D\'den sağa, sağ duvara, L = 125 mm',
    'Çubuklar: 12 mm × 6 mm (A = 72 mm²), E = 200 GPa', 'A\'da P = 2,4 kN, yatay, sağa',
    '2018–19 Güz\'de aynı soru: E = 210 GPa, P = 3 kN'],
  istenen: '(a) F<sub>BC</sub>, F<sub>DE</sub> ; (b) δ<sub>A</sub>',
  p0: { P: 2.4, E: 200, b: 12, t: 6, a: 200, c: 100, d: 50, L1: 100, L2: 125 },
  solve(p) {
    const A = p.b * p.t, EA = A * p.E * 1000, k1 = EA / p.L1, k2 = EA / p.L2, M = p.P * 1000 * p.a;
    const th = M / (k1 * p.c * p.c + k2 * p.d * p.d);
    const dC = p.c * th, dD = p.d * th, dA = p.a * th, FC = k1 * dC, FD = k2 * dD;
    // yanlış yollar (teşhis için)
    const Feq = M / (p.c + p.d);                                   // iki kuvvet eşit sanmak
    const FCnoL = M * p.c / (p.c * p.c + p.d * p.d), FDnoL = M * p.d / (p.c * p.c + p.d * p.d); // boyları eşit sanmak
    const dSame = M / (k1 * p.c + k2 * p.d);                       // C ve D aynı kayar sanmak
    return { A, EA, k1, k2, M, th, dC, dD, dA, FC, FD, s1: FC / A, s2: FD / A, Fx: FC + FD - p.P * 1000,
      ratio: (p.c / p.d) * (p.L2 / p.L1), Feq, FCnoL, FDnoL, FCsame: k1 * dSame, FDsame: k2 * dSame,
      chk: FC * p.c + FD * p.d - M };
  },
  anlam: [
    ['rijit AF elemanı', 'AF <b>eğilmez, boyu değişmez</b>. F\'de mafsallı olduğu için tek yapabildiği şey F etrafında <b>dönmek</b>.'],
    ['F noktası (mafsal)', 'F yerinde kalır. Dönme açısı θ ise F\'den x kadar yukarıdaki nokta <b>x·θ</b> kadar yana kayar.'],
    ['BC ve DE bağlantı çubukları, E, 12 mm × 6 mm', 'Çubuklar kayan noktaları tutar ve boyları değişir: δ = F·L/(A·E). A = 12·6 = 72 mm².'],
    ['B solda, E sağda', 'AF sağa yattığında C, B\'den <b>uzaklaşır</b> (BC uzar, çekme); D, E\'ye <b>yaklaşır</b> (DE kısalır, bası).'],
    ['her bir bağlantı çubuğundaki kuvvet', 'F\'de 2 tepki + 2 çubuk kuvveti = 4 bilinmeyen, 3 denge denklemi. <b>Hiperstatik</b>: eksik denklemi geometri (δ = x·θ) verir.'],
    ['A noktasının yer değiştirmesi', 'A, F\'den 200 mm yukarıda: δ<sub>A</sub> = 200·θ. Önce θ lazım.']
  ],
  tetik: ['rijit', 'mafsallı (pim) uç', 'iki bağlantı çubuğu', 'E ve kesit verilmiş', 'yer değiştirme'],
  tetikNot: '"Rijit + bir ucu mafsallı + birden çok çubuk" gördüğün an: δ = x·θ yaz, her çubuk kuvvetini θ ile ifade et (F = AE·δ/L), mafsala göre moment al. Bilinmeyen tek: θ.',
  zincir: [
    ['Kaç bilinmeyen var?', 'F\'de F<sub>x</sub>, F<sub>y</sub>; çubuklarda F<sub>BC</sub>, F<sub>DE</sub>. Dört bilinmeyen, üç denklem. F\'ye göre moment F<sub>x</sub>, F<sub>y</sub>\'yi düşürür ama yine iki bilinmeyen kalır.'],
    ['Eksik denklem nereden?', 'AF rijit ve F etrafında dönüyor: δ<sub>C</sub> = 100θ, δ<sub>D</sub> = 50θ. İki çubuğun boy değişimi <b>tek bir θ\'ya</b> bağlı.'],
    ['Çubuk kuvveti boy değişiminden nasıl çıkar?', 'δ = FL/(AE) ters çevrilir: F = (AE/L)·δ. Yani F<sub>BC</sub> = (AE/100)·100θ, F<sub>DE</sub> = (AE/125)·50θ.'],
    ['θ nasıl bulunur?', 'ΣM<sub>F</sub> = 0: P·200 = F<sub>BC</sub>·100 + F<sub>DE</sub>·50. Kuvvetler θ cinsinden yazıldığı için tek bilinmeyen θ.'],
    ['Hangisi çekme, hangisi bası?', 'P sağa iter, AF sağa yatar. C sağa kayar, B solda: BC uzar → <b>çekme</b>. D sağa kayar, E sağda: DE kısalır → <b>bası</b>.']
  ],
  cam: { yaw: -0.16, pitch: 0.04, dist: 10.3, t: [0.3, 1.5, 0] },
  steps: [
    { t: 'Şekle bak', st: { dim: 1 },
      h: () => 'Dik duran rijit AF, en altta F\'de mafsallı. C\'den sola BC çubuğu sol duvara (B), D\'den sağa DE çubuğu sağ duvara (E) gidiyor. P, en üstteki A\'dan yatay sağa itiyor.' },
    { t: 'Neden hiperstatik?', st: { fbd: 1, unk: 1, links: 0.15 },
      h: () => 'AF\'yi ayır. Üstünde: P (bilinen), F<sub>BC</sub> ve F<sub>DE</sub> (çubuklardan), F<sub>x</sub> ve F<sub>y</sub> (mafsaldan). Dört bilinmeyen, düzlemde üç denge denklemi. Statik yetmez.',
      f: () => 'ΣM<sub>F</sub> = 0 :  P·200 = F<sub>BC</sub>·100 + F<sub>DE</sub>·50   (tek denklem, iki bilinmeyen)',
      why: 'F\'ye göre moment almak akıllıca: F<sub>x</sub> ve F<sub>y</sub> F\'den geçer, denklemden düşer. Ama geriye yine iki çubuk kuvveti kalır. Eksik denklemi şekil değişiminden alacağız.' },
    { t: 'AF nasıl hareket eder? δ = x·θ', st: { def: 1, ghost: 1, geo: 1 },
      h: () => 'AF rijit, F sabit: AF, F etrafında küçük bir θ açısıyla döner (çok abartılı gösteriliyor). Kesikli çizgi ilk konum. F\'den ne kadar uzaksa o kadar çok kayar: A, C\'nin iki katı; C, D\'nin iki katı.',
      f: (p) => `δ<sub>D</sub> = ${p.d}·θ ,  δ<sub>C</sub> = ${p.c}·θ ,  δ<sub>A</sub> = ${p.a}·θ`,
      why: 'Açı çok küçük olduğu için yay uzunluğu ≈ yatay kayma: δ = x·θ (θ radyan). Bu, p4\'teki "benzer üçgen"in mafsallı hâli: üçgenin tepesi F, kaymalar F\'den uzaklıkla doğru orantılı.' },
    { t: 'Hangi çubuk çekmede, hangisi basıda?', st: { def: 1, ghost: 1, col: 1, tc: 1 },
      h: () => 'C sağa kayıyor ama B solda, duvarda sabit: C, B\'den uzaklaşır, <b>BC uzar → çekme</b> (kırmızı). D de sağa kayıyor ama E sağda: D, E\'ye yaklaşır, <b>DE kısalır → bası</b> (mavi).',
      why: 'Çubukların biri sola, biri sağa bağlı olduğu için aynı yöndeki kayma birini uzatır, diğerini kısaltır. İkisi de AF\'yi sola, P\'nin tersine çeker/iter: ikisi de dönmeye direnir.' },
    { t: 'Çubuk kuvvetlerini θ ile yaz', st: { def: 1, col: 1, kv: 1 },
      h: (p, r) => `δ = FL/(AE)\'yi ters çevir: F = (AE/L)·δ. İki çubukta A·E aynı: ${p.b}·${p.t} = ${r.A} mm², A·E = ${sci(r.EA)} N. Boyları farklı.`,
      f: (p, r) => `F<sub>BC</sub> = (AE/${p.L1})·${p.c}θ = ${fmt(r.k1, 0)}·${p.c}θ = <b>${sci(r.k1 * p.c)}·θ</b> N<br>F<sub>DE</sub> = (AE/${p.L2})·${p.d}θ = ${fmt(r.k2, 0)}·${p.d}θ = <b>${sci(r.k2 * p.d)}·θ</b> N`,
      why: 'AE/L çubuğun "yay sabiti": 1 mm boy değişimi için kaç N gerektiği. Kısa çubuk serttir (BC, 100 mm), uzun çubuk yumuşaktır (DE, 125 mm).' },
    { t: "F'ye göre moment → θ", st: { fbd: 1, mF: 1, links: 0.15, col: 1 },
      h: () => 'Momenti F\'de al: mafsal tepkileri düşer. P saat yönünde, iki çubuk kuvveti saat tersine döndürür. θ ile yazılmış kuvvetleri yerine koy: tek bilinmeyen θ.',
      f: (p, r) => `${f2(p.P)}·10³ · ${p.a} = (${sci(r.k1 * p.c)}·θ)·${p.c} + (${sci(r.k2 * p.d)}·θ)·${p.d}<br>${sci(r.M)} = ${sci(r.k1 * p.c * p.c + r.k2 * p.d * p.d)}·θ  →  <b>θ = ${sci(r.th)} rad</b>`,
      why: 'Moment kolu, kuvvetin F\'ye dik uzaklığı. Çubuklar yatay, AF dik: kollar doğrudan F\'den yükseklikler (100 ve 50 mm), P\'ninki 200 mm.' },
    { t: '(a) Çubuk kuvvetleri', st: { def: 1, col: 1, res: 1 },
      h: (p, r) => `θ\'yı geri koy. BC çekmede, DE basıda. Kontrol: ${fmt(r.FC, 0)}·${p.c} + ${fmt(r.FD, 0)}·${p.d} = ${fmt(r.M, 0)} N·mm = P·${p.a} ✓`,
      f: (p, r) => `F<sub>BC</sub> = ${sci(r.k1 * p.c)} · ${sci(r.th)} = <b>${fmt(r.FC, 0)} N (çekme)</b><br>F<sub>DE</sub> = ${sci(r.k2 * p.d)} · ${sci(r.th)} = <b>${fmt(r.FD, 0)} N (bası)</b><br>σ<sub>BC</sub> = ${fmt(r.FC, 0)}/${r.A} = ${f1(r.s1)} MPa ,  σ<sub>DE</sub> = −${f1(r.s2)} MPa`,
      why: 'BC, P\'den bile büyük kuvvet taşıyor: kolu (100 mm) P\'ninkinin (200 mm) yarısı, üstelik daha sert. Mafsal F de aradaki farkı karşılıyor: F<sub>x</sub> = F<sub>BC</sub> + F<sub>DE</sub> − P.' },
    { t: '(b) A\'nın yer değiştirmesi', st: { def: 1, ghost: 1, geo: 1, dA: 1, col: 1 },
      h: (p, r) => `A, F\'den ${p.a} mm yukarıda: δ<sub>A</sub> = ${p.a}·θ. Sağlama: δ<sub>C</sub> = ${p.c}θ, BC\'nin FL/(AE) uzamasına eşit olmalı.`,
      f: (p, r) => `δ<sub>A</sub> = ${p.a} · ${sci(r.th)} = <b>${f4(r.dA)} mm →</b><br>δ<sub>C</sub> = ${fmt(r.FC, 0)}·${p.L1}/${sci(r.EA)} = ${f4(r.dC)} mm = ${p.c}θ ✓<br>δ<sub>D</sub> = ${p.d}θ = ${f4(r.dD)} mm`,
      why: 'A, C\'den iki kat uzakta: δ_A = 2·δ_C. Hoca 2018 anahtarında tam böyle yapmış: δ_A = (200/100)·δ_C.' },
    { t: 'Kısa yol: kuvvet oranı', st: { def: 1, col: 1, res: 1 },
      h: (p, r) => `2018 anahtarındaki yol: önce geometri, δ<sub>C</sub>/δ<sub>D</sub> = ${p.c}/${p.d}. Sonra FL/(AE) yaz; AE aynı olduğu için sadeleşir ve kuvvet oranı çıkar. Bunu moment denklemine koy.`,
      f: (p, r) => `F<sub>BC</sub>·${p.L1} = (${p.c}/${p.d})·F<sub>DE</sub>·${p.L2}  →  F<sub>BC</sub> = ${f2(r.ratio)}·F<sub>DE</sub><br>${p.d}·F<sub>DE</sub> + ${p.c}·${f2(r.ratio)}·F<sub>DE</sub> = ${fmt(r.M, 0)}  →  F<sub>DE</sub> = <b>${fmt(r.FD, 0)} N</b>, F<sub>BC</sub> = <b>${fmt(r.FC, 0)} N</b>`,
      why: 'İki çubuk aynı malzeme ve kesitte olunca E kuvvetleri etkilemez, sadece yer değiştirmeleri etkiler. 2018\'de E = 210 GPa, P = 3 kN: kuvvetler P ile 3/2,4 = 1,25 kat büyür (5000 N, 2000 N).' }
  ],
  scene(v, p, r) {
    const s = 0.02, yA = p.a * s, yC = p.c * s, yD = p.d * s, xB = -p.L1 * s, xE = p.L2 * s, zL = 0.17;
    const base = '#2a323c';
    // duvarlar ve taban (U kanal)
    const fl = -0.45;
    v.add(E3.box(0.4, yC + 1.2 - fl, 0.9), { color: base, pos: [xB - 0.35, (yC + 1.2 + fl) / 2, 0], bias: 0.4 });
    v.add(E3.box(0.4, yD + 0.75 - fl, 0.9), { color: base, pos: [xE + 0.35, (yD + 0.75 + fl) / 2, 0], bias: 0.4 });
    v.add(E3.box(xE - xB + 1.1, 0.3, 0.9), { color: base, pos: [(xB + xE) / 2, fl - 0.15, 0], bias: 0.4 });
    // mafsal braketleri
    v.add(E3.box(0.2, 0.36, 0.4), { color: '#4a5562', pos: [xB - 0.07, yC, zL], bias: 0.2 });
    v.add(E3.box(0.2, 0.36, 0.4), { color: '#4a5562', pos: [xE + 0.07, yD, zL], bias: 0.2 });
    v.add(E3.box(0.5, 0.45, 0.5), { color: '#4a5562', pos: [0, fl + 0.225, 0], bias: 0.2 });
    // rijit AF (F etrafında döner)
    const AF = v.add(shift(E3.box(0.36, yA + 0.5, 0.22), 0, yA / 2, 0), { color: C.wood, pos: [0, 0, 0] });
    // çubuklar: başlangıç noktası mesh orijininde, x yönünde 1 birim
    const lk = shift(E3.box(1, 0.2, 0.1), 0.5, 0, 0);
    const BC = v.add(lk, { color: C.alu, pos: [xB, yC, zL] }), DE = v.add(lk, { color: C.alu, pos: [0, yD, zL] });
    const pin = E3.cyl(0.075, 0.55, 14, 'z');
    const pA = v.add(pin, { color: '#d7dde3' }), pC = v.add(pin, { color: '#d7dde3' }), pD = v.add(pin, { color: '#d7dde3' });
    v.add(pin, { color: '#d7dde3', pos: [xB, yC, zL] }); v.add(pin, { color: '#d7dde3', pos: [xE, yD, zL] }); v.add(pin, { color: '#d7dde3', pos: [0, 0, 0.1] });
    const def = { dim: 0, lab: 1, load: 1, def: 0, ghost: 0, fbd: 0, unk: 0, geo: 0, col: 0, tc: 0, kv: 0, mF: 0, res: 0, dA: 0, links: 1 };
    return {
      def, apply(S, time, v) {
        const ph = 0.3 * S.ex * S.def, sn = Math.sin(ph), cs = Math.cos(ph);
        const at = y => [y * sn, y * cs];               // F'den y yukarıdaki noktanın yeni yeri (saat yönünde dönüş)
        const [Ax, Ay] = at(yA), [Cx, Cy] = at(yC), [Dx, Dy] = at(yD);
        AF.rot = [0, 0, -ph]; AF.alpha = 1 - 0.55 * S.geo;
        pA.pos = [Ax, Ay, 0.05]; pC.pos = [Cx, Cy, zL - 0.05]; pD.pos = [Dx, Dy, zL - 0.05];
        const setL = (o, x0, y0, x1, y1) => { o.pos = [x0, y0, zL]; o.scl = [Math.hypot(x1 - x0, y1 - y0), 1, 1]; o.rot = [0, 0, Math.atan2(y1 - y0, x1 - x0)]; };
        setL(BC, xB, yC, Cx, Cy); setL(DE, Dx, Dy, xE, yD);
        BC.alpha = DE.alpha = S.links;
        BC.color = mixHex(C.alu, C.tens, S.col * 0.85); DE.color = mixHex(C.alu, C.comp, S.col * 0.9);
        const O = v.ov, zf = 0.5;
        // yük
        O.push({ k: 'arrow', a: [Ax + 0.22, Ay, zf], b: [Ax + 1.75, Ay, zf], color: C.red, w: 3, label: `P = ${f2(p.P)} kN`, lp: [Ax + 1.05, Ay + 0.38, zf], alpha: S.load });
                if (S.lab > 0.01) [['A', Ax - 0.42, Ay], ['C', Cx - 0.42, Cy + 0.36], ['D', Dx - 0.42, Dy], ['F', -0.48, 0.42], ['B', xB, yC + 0.42], ['E', xE, yD + 0.42]]
          .forEach(([t, x, y]) => O.push({ k: 'text', t, p: [x, y, zf], size: 16, alpha: S.lab }));
        if (S.dim > 0.01) {
          [[0, yD, p.d], [yD, yC, p.c - p.d], [yC, yA, p.a - p.c]].forEach(([y0, y1, t]) =>
            O.push({ k: 'dim', a: [0.25, y0, 0], b: [0.25, y1, 0], off: [0.75, 0, 0], t: `${t} mm`, tdx: 34, tdy: 0, alpha: S.dim }));
          O.push({ k: 'dim', a: [xB, fl - 0.3, 0.45], b: [0, fl - 0.3, 0.45], off: [0, -0.4, 0], t: `BC: ${p.L1} mm`, alpha: S.dim });
          O.push({ k: 'dim', a: [0, fl - 0.3, 0.45], b: [xE, fl - 0.3, 0.45], off: [0, -0.4, 0], t: `DE: ${p.L2} mm`, alpha: S.dim });
        }
        if (S.ghost > 0.01) O.push({ k: 'line', p: [[0, 0, zf], [0, yA + 0.3, zf]], color: C.white, dash: [6, 5], w: 1.2, alpha: S.ghost * 0.8 });
        if (S.geo > 0.01) {
          const thv = S.dA > 0.5;
          [[yA, Ax, Ay, thv ? `δ_A = ${f4(r.dA)} mm` : `δ_A = ${p.a}·ϑ`], [yC, Cx, Cy, thv ? `δ_C = ${f4(r.dC)} mm` : `δ_C = ${p.c}·ϑ`], [yD, Dx, Dy, thv ? `δ_D = ${f4(r.dD)} mm` : `δ_D = ${p.d}·ϑ`]]
            .forEach(([y, x1, y1, t], i) => {
              O.push({ k: 'arrow', a: [0, y1, zf], b: [x1, y1, zf], color: C.red, w: 2, hs: 7, alpha: S.geo });
              O.push({ k: 'text', t, p: [x1 + 0.2, y1 + (i === 0 ? -0.42 : 0.28), zf], color: i === 0 ? C.red : C.white, size: i === 0 ? 15 : 13, box: 1, align: 'left', alpha: S.geo });
            });
          const R = 3, arc = []; for (let i = 0; i <= 16; i++) { const t = ph * i / 16; arc.push([R * Math.sin(t), R * Math.cos(t), zf]); }
          O.push({ k: 'line', p: arc, color: C.red, w: 2, alpha: S.geo });
          O.push({ k: 'text', t: 'ϑ', p: [-0.3, R - 0.15, zf], color: C.red, size: 16, alpha: S.geo });
          O.push({ k: 'line', p: [[0, 0, zf], [Ax * 1.06, Ay * 1.06, zf]], color: C.red, dash: [3, 4], w: 1, alpha: S.geo * 0.6 });
        }
        if (S.tc > 0.01) {
          O.push({ k: 'text', t: 'C, B\'den uzaklaşır\nBC uzar → ÇEKME', p: [xB / 2, yC + 0.75, zf], color: C.tens, size: 14, box: 1, alpha: S.tc });
          O.push({ k: 'text', t: 'D, E\'ye yaklaşır\nDE kısalır → BASI', p: [xE / 2 + 0.1, yD - 0.72, zf], color: C.comp, size: 14, box: 1, alpha: S.tc });
        }
        if (S.kv > 0.01) {
          O.push({ k: 'text', t: `k_BC = AE/${p.L1} = ${fmt(r.k1, 0)} N/mm\nF_BC = ${fmt(r.k1, 0)}·${p.c}·ϑ`, p: [xB / 2 - 0.1, yC + 1.05, zf], color: C.white, size: 14, box: 1, alpha: S.kv });
          O.push({ k: 'text', t: `k_DE = AE/${p.L2} = ${fmt(r.k2, 0)} N/mm\nF_DE = ${fmt(r.k2, 0)}·${p.d}·ϑ`, p: [xE / 2 + 0.75, yD - 0.65, zf], color: C.white, size: 14, box: 1, alpha: S.kv });
        }
        if (S.fbd > 0.01) {
          const q = S.unk > 0.5 ? ' = ?' : '';
          O.push({ k: 'arrow', a: [Cx - 0.2, Cy, zf], b: [Cx - 1.55, Cy, zf], color: C.tens, w: 2.6, label: `F_BC${q}`, lp: [Cx - 1.0, Cy + 0.36, zf], alpha: S.fbd });
          O.push({ k: 'arrow', a: [Dx - 0.2, Dy, zf], b: [Dx - 1.55, Dy, zf], color: C.comp, w: 2.6, label: `F_DE${q}`, lp: [Dx - 1.0, Dy + 0.36, zf], alpha: S.fbd });
          O.push({ k: 'arrow', a: [-1.5, -0.02, zf], b: [-0.22, -0.02, zf], color: C.white, w: 2.2, label: S.mF > 0.5 ? 'F_x (düşer)' : 'F_x', lp: [-1.6, 0.3, zf], alpha: S.fbd * (1 - 0.55 * S.mF) });
          O.push({ k: 'arrow', a: [0.55, -1.2, zf], b: [0.55, -0.2, zf], color: C.white, w: 2.2, label: S.mF > 0.5 ? 'F_y (düşer)' : 'F_y', lp: [1.35, -0.85, zf], alpha: S.fbd * (1 - 0.55 * S.mF) });
        }
        if (S.mF > 0.01) {
          O.push({ k: 'ring', c: [0, 0, zf], r: 0.38, color: C.red, w: 2.5, alpha: S.mF });
          [[yD, p.d, 0.55], [yC, p.c, 1.15], [yA, p.a, 2.35]].forEach(([y, t, o]) =>
            O.push({ k: 'dim', a: [0.2, 0, 0], b: [0.2, y, 0], off: [o, 0, 0], t: `kol ${t}`, tdx: 26, tdy: 0, alpha: S.mF }));
        }
        if (S.res > 0.01) {
          O.push({ k: 'text', t: `F_BC = ${fmt(r.FC, 0)} N (çekme)\nσ = ${f1(r.s1)} MPa`, p: [xB / 2 - 0.1, yC + 1.05, zf], color: C.tens, size: 14, box: 1, alpha: S.res });
          O.push({ k: 'text', t: `F_DE = ${fmt(r.FD, 0)} N (bası)\nσ = −${f1(r.s2)} MPa`, p: [xE / 2 + 0.75, yD - 0.65, zf], color: C.comp, size: 14, box: 1, alpha: S.res });
        }
      }
    };
  },
  whatif: {
    not: 'E\'yi değiştir: kuvvetler hiç değişmiyor, sadece θ ve δ<sub>A</sub> değişiyor (iki çubuk aynı malzemeden). DE\'yi uzatırsan DE yumuşar, yükü daha çok BC taşır.',
    s: [{ k: 'P', ad: 'Yük P', min: 0.5, max: 6, step: 0.1, u: 'kN' }, { k: 'E', ad: 'Çubuk E', min: 70, max: 210, step: 5, u: 'GPa' },
      { k: 'L1', ad: 'BC boyu', min: 50, max: 250, step: 5, u: 'mm' }, { k: 'L2', ad: 'DE boyu', min: 50, max: 250, step: 5, u: 'mm' }],
    out: (p, r) => {
      return `<div class="mets"><div class="m red"><small>F_BC (çekme)</small><b>${fmt(r.FC, 0)} N</b></div><div class="m blue"><small>F_DE (bası)</small><b>${fmt(r.FD, 0)} N</b></div><div class="m"><small>θ</small><b>${f3(r.th * 1e4)}·10⁻⁴ rad</b></div><div class="m"><small>δ_A</small><b>${f4(r.dA)} mm</b></div></div>
      <p class="note">F_BC / F_DE = (${p.c}/${p.d})·(L_DE/L_BC) = ${f2(r.ratio)}. P = 3 kN, E = 210 GPa yapınca 2018 anahtarını görürsün: 5000 N, 2000 N, δ_A = 0,0661 mm.</p>`;
    }
  },
  kagit(p, r) {
    const one = (p, r) => `A = ${p.b}·${p.t} = ${r.A} mm²,  E = ${p.E}·10³ MPa
Geometri (F etrafında θ):  δ_C = ${p.c}θ,  δ_D = ${p.d}θ,  δ_A = ${p.a}θ
F_BC = A·E·δ_C/L_BC = ${r.A}·${p.E}000·${p.c}θ/${p.L1} = ${fmt(r.k1 * p.c, 0)}·θ   (çekme)
F_DE = A·E·δ_D/L_DE = ${r.A}·${p.E}000·${p.d}θ/${p.L2} = ${fmt(r.k2 * p.d, 0)}·θ   (bası)
ΣM_F = 0:  ${fmt(p.P * 1000, 0)}·${p.a} = F_BC·${p.c} + F_DE·${p.d}
   ${fmt(r.M, 0)} = ${fmt(r.k1 * p.c * p.c + r.k2 * p.d * p.d, 0)}·θ   →   θ = ${sci(r.th)} rad
(a) F_BC = ${fmt(r.FC, 0)} N (çekme),   F_DE = ${fmt(r.FD, 0)} N (bası)
(b) δ_A = ${p.a}·θ = ${f4(r.dA)} mm  (sağa)`;
    const isP0 = Object.keys(this.p0).every(k => p[k] === this.p0[k]);
    if (!isP0) return one(p, r);
    const p2 = Object.assign({}, p, { P: 3, E: 210 }), r2 = this.solve(p2);
    return `── 2016–17 Yaz (E = 200 GPa, P = 2,4 kN) ──
${one(p, r)}

── 2018–19 Güz (E = 210 GPa, P = 3 kN) ──
${one(p2, r2)}
   δ_C = ${f4(r2.dC)} mm,  δ_D = ${f4(r2.dD)} mm`;
  },
  tuzak: ['<b>İki çubuğu da çekme sanmak.</b> B solda, E sağda. Aynı sağa kayma BC\'yi uzatır, DE\'yi kısaltır. Hangi duvara bağlı olduğuna bak.',
    '<b>C ve D aynı miktar kayar sanmak.</b> Rijit ama mafsallı: kayma F\'ye uzaklıkla orantılı, δ_C = 2·δ_D.',
    '<b>Çubuk boylarını eşit almak.</b> BC 100 mm, DE 125 mm. Kuvvet = (AE/L)·δ; L farklı olunca sertlik farklı.',
    '<b>Moment kolunu çubuk boyu sanmak.</b> F\'ye göre momentte kol, kuvvetin F\'ye dik uzaklığı: 100 ve 50 mm (yükseklikler), 100 ve 125 mm değil.',
    '<b>δ_A yerine δ_C yazmak.</b> δ_C BC\'nin uzaması. A iki kat yukarıda: δ_A = 200θ = 2·δ_C.',
    '<b>Statikle çözmeye çalışmak.</b> Tek moment denklemi iki bilinmeyen kuvvet bırakır; θ\'sız çözülmez.'],
  gen() {
    const d = rnd(30, 80, 10), c = d + rnd(30, 100, 10), a = c + rnd(50, 150, 10);
    return { P: rnd(1.5, 6, 0.1), E: pick([70, 105, 200, 210]), b: rnd(10, 25, 1), t: rnd(4, 10, 1), a, c, d, L1: rnd(60, 200, 5), L2: rnd(60, 200, 5) };
  },
  pracText: p => `Dik duran rijit AF elemanı alt ucu F'den mafsallı. F'den ${p.c} mm yukarıdaki C noktasından sola doğru BC çubuğu (${p.L1} mm) sol duvara, F'den ${p.d} mm yukarıdaki D noktasından sağa doğru DE çubuğu (${p.L2} mm) sağ duvara bağlı. F'den ${p.a} mm yukarıdaki A ucuna ${f2(p.P)} kN yatay, sağa doğru P kuvveti etkiyor. Çubuklar ${p.b} mm × ${p.t} mm kesitli, E = ${p.E} GPa. Çubuk kuvvetlerini (büyüklük) ve A'nın yer değiştirmesini bul.`,
  ans: [{ k: 'FC', ad: 'F_BC', u: 'N', abs: 1 }, { k: 'FD', ad: 'F_DE', u: 'N', abs: 1 }, { k: 'dA', ad: 'δ_A', u: 'mm', abs: 1 }],
  hints: (p, r) => [`Kaymalar: δ_C = ${p.c}θ, δ_D = ${p.d}θ, δ_A = ${p.a}θ.`,
    `F = (A·E/L)·δ: F_BC = ${r.A}·${p.E}000·${p.c}θ/${p.L1}, F_DE = ${r.A}·${p.E}000·${p.d}θ/${p.L2}.`,
    `ΣM_F: ${fmt(p.P * 1000, 0)}·${p.a} = F_BC·${p.c} + F_DE·${p.d} → θ, sonra δ_A = ${p.a}·θ.`],
  diag(p, r, u) {
    const near = (x, y) => isFinite(x) && Math.abs(Math.abs(x) - Math.abs(y)) <= Math.abs(y) * 0.02;
    if (near(u.FC, r.FD) || near(u.FD, r.FC)) return 'F_BC ile F_DE yer değiştirmiş: F\'den uzak ve kısa olan çubuk (BC) daha çok taşır.';
    if (near(u.FC, r.Feq) || near(u.FD, r.Feq)) return 'İki kuvveti eşit almışsın. Eşit değiller: δ = x·θ ve F = (AE/L)·δ, ikisi de çubuğa göre değişir.';
    if (near(u.FC, r.FCnoL) || near(u.FD, r.FDnoL)) return 'Çubuk boylarını eşit almışsın gibi. BC ' + p.L1 + ' mm, DE ' + p.L2 + ' mm: AE/L farklı.';
    if (near(u.FC, r.FCsame) || near(u.FD, r.FDsame)) return 'C ve D\'nin aynı kaydığını varsaymışsın. Mafsallı rijitte kayma F\'ye uzaklıkla orantılı: δ_C = ' + p.c + 'θ, δ_D = ' + p.d + 'θ.';
    if (near(u.dA, r.dC)) return 'Bu δ_C (BC\'nin uzaması). A daha yukarıda: δ_A = ' + p.a + '·θ.';
    if (near(u.dA, r.dD)) return 'Bu δ_D. A için δ_A = ' + p.a + '·θ.';
    if (near(u.dA, r.dA * 1000) || near(u.dA, r.dA / 1000)) return 'Birim kaymış: E\'yi N/mm² (GPa × 1000), boyları mm yaz; δ mm çıkar.';
    if (near(u.dA, r.th)) return 'θ\'yı yazmışsın; δ_A = ' + p.a + '·θ.';
    return 'Sıra: δ = x·θ → F = (AE/L)·δ → ΣM_F = 0 ile θ → δ_A = ' + p.a + '·θ.';
  }
});
