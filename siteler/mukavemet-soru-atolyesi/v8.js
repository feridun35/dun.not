'use strict';
/* ============ VİZE 8 · kitap 3.21: iki şaft, iki dişli, en büyük T_C ============ */
VIZE.push({
  id: 'v8', no: 8, kod: 'V8', vize: true, tip: 'bu',
  src: 'Kitap sorusu 3.21 · vize PDF\'i',
  img: 'img/v8.png',
  hoca: 'Bu soru PDF\'te kitaptan alınmış bir alıştırma olarak verilmiş; <b>hocanın el yazısı cevap anahtarı yok</b>. Aşağıdaki sonuçlar bizim hesabımız:<br>' +
    '• BC şaftı: J = 251 327 mm⁴ → T<sub>C</sub> ≤ <b>628,3 N·m</b><br>' +
    '• EF şaftı: J = 79 522 mm⁴ → T<sub>EF</sub> ≤ 265,1 N·m → T<sub>C</sub> ≤ 265,1 / 0,6 = <b>441,8 N·m</b><br>' +
    '• <b>T<sub>C,max</sub> ≈ 442 N·m</b> (EF belirleyici). Sağlama: bu torkta τ<sub>BC</sub> = 35,2 MPa, τ<sub>EF</sub> = 50 MPa.<br>' +
    'Kitapta dişli yarıçapları yazıda değil şekilde verilmiş (100 mm A\'nın, 60 mm D\'nin). Sınavda şekle bakıp hangi dişlinin hangi şaftta olduğunu sen belirlemelisin.',
  ad: 'İki şaft, iki dişli: C\'ye en büyük tork',
  ozet: 'C\'den çevirdiğin tork BC şaftını burar, dişliler üzerinden küçülerek EF şaftına geçer. İki şaftın da kayma sınırını aşmaması lazım: her şaft için ayrı bir T_C sınırı bul, küçüğünü seç.',
  soru: 'İçi dolu iki şaft, gösterildiği gibi dişlilerle bağlanmıştır ve emniyet kayma gerilmesi 50 MPa olan çelikten yapılmıştır. Şaftların çapları, d<sub>BC</sub> = 40 mm ve d<sub>EF</sub> = 30 mm olduğuna göre, C\'de uygulanabilecek en büyük T<sub>C</sub> torkunu belirleyiniz.',
  verilen: ['τ<sub>em</sub> = 50 MPa (iki şaft da aynı çelik)', 'd<sub>BC</sub> = 40 mm → c = 20 mm', 'd<sub>EF</sub> = 30 mm → c = 15 mm', 'A dişlisi (BC şaftında): r<sub>A</sub> = 100 mm', 'D dişlisi (EF şaftında): r<sub>D</sub> = 60 mm', 'Şaftlar dolu (içi boş değil)'],
  istenen: 'C\'ye uygulanabilecek en büyük T<sub>C</sub> (iki şaftta da τ ≤ 50 MPa)',
  p0: { tau: 50, dBC: 40, dEF: 30, rA: 100, rD: 60 },
  solve(p) {
    const cB = p.dBC / 2, cE = p.dEF / 2, JB = Math.PI * Math.pow(cB, 4) / 2, JE = Math.PI * Math.pow(cE, 4) / 2;
    const TB = p.tau * JB / cB / 1000, TE = p.tau * JE / cE / 1000; // N·m
    const k = p.rD / p.rA, TC2 = TE / k, TC = Math.min(TB, TC2);
    const TF = TC * k, F = TC / p.rA; // kN (N·m / mm)
    const tB = TC * 1000 * cB / JB, tE = TF * 1000 * cE / JE;
    return { cB, cE, JB, JE, TB, TE, k, TC2, TC, TF, F, tB, tE, uB: tB / p.tau, uE: tE / p.tau, gov: TB <= TC2 ? 'BC' : 'EF', spd: p.rA / p.rD };
  },
  anlam: [
    ['İçi dolu iki şaft', 'Kesit tam daire. Kutupsal atalet momenti <b>J = π·c⁴/2</b> (c yarıçap).'],
    ['dişlilerle bağlanmıştır', 'Bir şafttaki tork öbürüne dişli temasından geçer. Temas noktasında kuvvet <b>aynı</b>, tork = kuvvet × yarıçap.'],
    ['emniyet kayma gerilmesi 50 MPa', 'Burulmada gerilme kaymadır. İki şaftta da en büyük τ (dış yüzeyde) 50 MPa\'yı geçmeyecek.'],
    ['d<sub>BC</sub> = 40 mm ve d<sub>EF</sub> = 30 mm', 'Formüle <b>yarıçap</b> girer: c = 20 mm ve c = 15 mm.'],
    ['100 mm ve 60 mm (şekilde)', 'Dişli yarıçapları. 100 mm oku A\'nın merkezinden çıkıyor: A büyük dişli, üst şaft BC\'de. 60 mm D\'nin: küçük dişli, alt şaft EF\'de.'],
    ['C\'de uygulanabilecek en büyük T<sub>C</sub>', 'İki şart var (BC ve EF). Her biri T<sub>C</sub> için bir üst sınır verir; ikisini de sağlayan en büyük değer <b>küçük olanı</b>.']
  ],
  tetik: ['şaft', 'dişli', 'tork', 'emniyet kayma gerilmesi', 'en büyük T'],
  tetikNot: '"Şaft + tork + kayma gerilmesi" görünce burma: τ = T·c/J. "Dişli" de varsa ikinci şaftın torku dişli oranıyla değişir. "En büyük" diyorsa her parça için ayrı sınır bul, küçüğü cevap (P2\'deki en zayıf halka mantığı).',
  zincir: [
    ['Ne isteniyor?', 'C\'deki en büyük tork. Sınır, şaftlardaki kayma gerilmesi.'],
    ['Hangi şaft hangi torku taşıyor?', 'BC, C\'deki torku olduğu gibi taşır: T<sub>BC</sub> = T<sub>C</sub>. EF ise dişliden gelen torku taşır: T<sub>EF</sub> = T<sub>C</sub>·r<sub>D</sub>/r<sub>A</sub>.'],
    ['Bir şaft en çok ne taşır?', 'τ = T·c/J\'yi T için çöz: T<sub>izin</sub> = τ<sub>em</sub>·J/c = τ<sub>em</sub>·π·c³/2.'],
    ['Dişli oranı hangi yönde?', 'Temas kuvveti F aynı. T = F·r: küçük dişli (D) küçük tork alır. 0,6 ile çarp, bölme.'],
    ['Cevap?', 'BC\'den bir T<sub>C</sub>, EF\'den bir T<sub>C</sub>. Küçüğü.']
  ],
  cam: { yaw: 0.72, pitch: 0.3, dist: 19, t: [3.3, 3.5, 0] },
  steps: [
    { t: 'Şekle bak: iki şaft, iki dişli', st: { lab: 1, dim: 1, tq: 1, tf: 1 },
      h: (p) => `Üstte <b>BC şaftı</b> (çap ${p.dBC} mm), sol ucunda büyük <b>A dişlisi</b> (r = ${p.rA} mm). Altta <b>EF şaftı</b> (çap ${p.dEF} mm), sol ucunda küçük <b>D dişlisi</b> (r = ${p.rD} mm). Dişler birbirine geçmiş. C ucundan T<sub>C</sub> ile çeviriyoruz; F ucundaki T<sub>F</sub>, sistemi dengede tutan karşı tork (örneğin F\'ye bağlı bir makine). G ve H sadece yatak: şaftı tutar, dönmesini engellemez.`,
      why: 'Hangi dişli hangi şaftta? Şekilde A harfi üst şaftın ucundaki büyük dişlinin göbeğinde; 100 mm oku da o merkezden çıkıyor. D harfi alt şafttaki küçük dişlinin göbeğinde, 60 mm oku oradan çıkıyor. A, B, C aynı hizada (üst şaft); D, E, F aynı hizada (alt şaft).' },
    { t: 'Burulma nedir?', st: { tw: 1, tq: 1, tf: 0, lab: 0.5, fE: 1 }, cam: { yaw: 0.55, pitch: 0.35, dist: 15, t: [3.8, 4.6, 0] },
      h: () => 'Şaftın bir ucu tutulup öbür ucu çevrilince şaft <b>burulur</b>. Yüzeye düz bir çizgi çizdiğini düşün (kesikli çizgi): burulunca çizgi vida dişi gibi eğilir (kırmızı). Her ince dilim yanındakine göre biraz döner, dilimler birbirinin üstünde <b>kayar</b>. Bu kaymanın gerilmesi τ: <b>kayma gerilmesi</b>. Şaft fazla zorlanırsa bu kayma yüzünden kopar.',
      why: 'Bir deste kâğıdı iki ucundan tutup çevir: yapraklar birbiri üstünde kayar. Şaft da ince disklerden oluşmuş bir deste gibi davranır. Burada A ucu dişliyle tutuluyor (D dişlisi karşı koyuyor), C ucu çevriliyor. Dönme gerçekte çok küçük; ekrandaki abartılı.' },
    { t: 'τ nerede en büyük? τ = T·c / J', st: { sec: 1, tq: 0, tf: 0, lab: 0, fE: 1 }, cam: { yaw: 1.5, pitch: 0.12, dist: 8.5, t: [9.3, 5.0, 0] },
      h: (p) => `Şaftın ucundaki kesiti büyüttük. Merkezde kayma <b>yok</b>, dışa doğru düz bir çizgiyle artıyor (oklar). En büyüğü dış yüzeyde, ρ = c\'de. Bu yüzden hesapta hep yüzeydeki değeri kullanırız. Dikkat: c <b>yarıçap</b> (${p.dBC} mm\'lik şaftta c = ${p.dBC / 2} mm).`,
      f: () => 'τ = T·ρ / J &nbsp;→&nbsp; τ<sub>max</sub> = T·c / J &nbsp;&nbsp; J = π·c⁴ / 2 (dolu daire)<br>T\'yi çek: <b>T<sub>izin</sub> = τ<sub>em</sub>·J / c = τ<sub>em</sub>·π·c³ / 2</b>',
      why: 'J (kutupsal atalet momenti), kesitin burulmaya direncidir. Neden c⁴? Merkezden ρ uzaktaki ince bir halkada gerilme ρ ile artar, bu gerilmenin momente kolu da ρ\'dur, halkanın alanı da ρ ile büyür. Toplayınca c⁴ çıkar. Sonuç: J/c = π·c³/2, yani taşınan tork yarıçapın <b>küpüyle</b> artar. Çapı %10 büyütmek torku %33 artırır.' },
    { t: 'Dişli teması: kuvvet aynı, tork farklı', st: { F: 1, arm: 1, tq: 0, tf: 0, lab: 0.45 }, cam: { yaw: -0.95, pitch: 0.15, dist: 11, t: [0, 3.6, 0] },
      h: (p, r) => `C\'deki tork şaft boyunca A dişlisine gelir: T<sub>BC</sub> = T<sub>C</sub>. Dişlerin değdiği noktada A, D\'yi bir <b>F</b> kuvvetiyle iter; D de A\'yı <b>aynı F</b> ile geri iter (etki–tepki). Tork = kuvvet × kol; kol dişlinin yarıçapı. F iki dişlide aynı, kollar farklı.`,
      f: (p, r) => `F = T<sub>C</sub> / r<sub>A</sub> = T<sub>EF</sub> / r<sub>D</sub><br><b>T<sub>EF</sub> = T<sub>C</sub> · r<sub>D</sub> / r<sub>A</sub> = T<sub>C</sub> · ${p.rD}/${p.rA} = ${f2(r.k)} · T<sub>C</sub></b>`,
      why: 'Küçük dişli küçük tork alır: aynı kuvvet, kısa kol. Oranı ters çevirmemek için bunu hatırla: "büyük dişli büyük tork". Yatakların sürtünmesi yok sayılır, bu yüzden C\'den A\'ya tork kaybolmadan gelir.' },
    { t: 'Dişli oranı: yay uzunlukları eşit', st: { roll: 1, arc: 1, tq: 0, tf: 0, lab: 0.35 }, cam: { yaw: -0.95, pitch: 0.15, dist: 11, t: [0, 3.4, 0] },
      h: (p, r) => `Dişliler kaymadan döner: temas noktasından iki dişlinin çevresinden de <b>aynı uzunluk</b> geçer (kırmızı yaylar eşit). Bu yüzden r<sub>A</sub>·θ<sub>A</sub> = r<sub>D</sub>·θ<sub>D</sub>. Küçük D dişlisi ${f2(r.spd)} kat <b>hızlı</b> döner ama ${f2(r.k)} kat tork taşır. Yönleri de terstir.`,
      f: (p, r) => `r<sub>A</sub>·θ<sub>A</sub> = r<sub>D</sub>·θ<sub>D</sub> → θ<sub>D</sub> = θ<sub>A</sub> · ${p.rA}/${p.rD} = ${f2(r.spd)}·θ<sub>A</sub>`,
      why: 'Bu soruda açı istenmiyor, ama burulma açısı sorularında bu eşitlik gerekir (tarifin 4. ve 5. maddesi). Tork ile açının oranı ters: tork r<sub>D</sub>/r<sub>A</sub> ile küçülür, açı r<sub>A</sub>/r<sub>D</sub> ile büyür. İkisinin çarpımı (iş, güç) aynı kalır.' },
    { t: 'BC şaftının sınırı', st: { fE: 1, hB: 1, limB: 1 },
      h: (p, r) => `BC şaftı T<sub>C</sub>\'nin kendisini taşır. Yarıçap c = ${f1(r.cB)} mm. Bu şaftın τ = ${p.tau} MPa\'ya ulaştığı tork:`,
      f: (p, r) => `J = π · ${f1(r.cB)}⁴ / 2 = ${fmt(r.JB, 0)} mm⁴<br>T = ${p.tau} · ${fmt(r.JB, 0)} / ${f1(r.cB)} = ${fmt(r.TB * 1000, 0)} N·mm = <b>${f1(r.TB)} N·m</b><br>→ <b>T<sub>C</sub> ≤ ${f1(r.TB)} N·m</b>`,
      why: 'Birim: MPa = N/mm², mm⁴ / mm = mm³. Çarpım N·mm çıkar; 1000\'e bölünce N·m.' },
    { t: 'EF şaftının sınırı', st: { fB: 1, hE: 1, limE: 1 },
      h: (p, r) => `EF daha ince (c = ${f1(r.cE)} mm) ama torkun sadece ${f2(r.k)} katını taşır. Önce EF\'nin kendi sınırını bul, sonra bunu T<sub>C</sub>\'ye çevir.`,
      f: (p, r) => `J = π · ${f1(r.cE)}⁴ / 2 = ${fmt(r.JE, 0)} mm⁴<br>T<sub>EF,izin</sub> = ${p.tau} · ${fmt(r.JE, 0)} / ${f1(r.cE)} = ${fmt(r.TE * 1000, 0)} N·mm = <b>${f1(r.TE)} N·m</b><br>${f2(r.k)} · T<sub>C</sub> ≤ ${f1(r.TE)} → <b>T<sub>C</sub> ≤ ${f1(r.TE)} / ${f2(r.k)} = ${f1(r.TC2)} N·m</b>`,
      why: 'Tuzak burada: EF\'nin taşıyabileceği tork (265,1 N·m) cevap değil. Soru C\'deki torku soruyor. EF\'ye gelen tork T<sub>C</sub>\'nin 0,6 katı olduğu için T<sub>C</sub> bundan büyük olabilir: 265,1 / 0,6. Bölmek mi çarpmak mı diye kararsız kalırsan sor: "C\'deki tork EF\'dekinden büyük mü?" Büyük dişli büyük tork, yani evet.' },
    { t: 'Hangisi önce sınıra ulaşır?', st: { ramp: 1, bars: 1, util: 1 },
      h: (p, r) => `T<sub>C</sub>\'yi sıfırdan yavaşça artırıyoruz (animasyon). İki şaftın gerilmesi birlikte artar. <b>${r.gov}</b> şaftı %100\'e T<sub>C</sub> = ${f1(r.TC)} N·m\'de ulaşıyor; o anda ${r.gov === 'EF' ? 'BC' : 'EF'} sadece %${fmt((r.gov === 'EF' ? r.uB : r.uE) * 100, 0)}\'de. Daha fazla artırırsak ${r.gov} sınırı aşar.`,
      f: (p, r) => `T<sub>C,max</sub> = min(${f1(r.TB)} ; ${f1(r.TC2)}) = <b>${f1(r.TC)} N·m</b> &nbsp;(belirleyici: ${r.gov} şaftı)`,
      why: 'EF\'nin torku 0,6 kat küçük ama yarıçapı da küçük ve tork yarıçapın küpüyle düşüyor: (15/20)³ = 0,42. 0,42 &lt; 0,6 olduğu için EF önce zorlanır.' },
    { t: 'Sağlama: en büyük torkla', st: { val: 1, util: 1, tw: 0.6, twE: 0.6, tq: 1, tf: 1 },
      h: (p, r) => `Bulduğun T<sub>C</sub>\'yi geri koy. EF tam sınırda, BC rahat. İkisi de ${p.tau} MPa\'yı geçmiyor.`,
      f: (p, r) => `τ<sub>BC</sub> = ${fmt(r.TC * 1000, 0)} · ${f1(r.cB)} / ${fmt(r.JB, 0)} = <b>${f1(r.tB)} MPa</b> ≤ ${p.tau} ✓<br>T<sub>EF</sub> = ${f2(r.k)} · ${f1(r.TC)} = ${f1(r.TF)} N·m → τ<sub>EF</sub> = ${fmt(r.TF * 1000, 0)} · ${f1(r.cE)} / ${fmt(r.JE, 0)} = <b>${f1(r.tE)} MPa</b> ≤ ${p.tau} ✓` }
  ],
  scene(v, p, r) {
    const U = 0.02, rA = p.rA * U, rD = p.rD * U, cB = r.cB * U, cE = r.cE * U, th = 0.5;
    const yA = 5.4, yD = yA - rA - rD, xG = 2.4, xH = 5.2, xC = 7.5, xs = -0.45, xf = th / 2 + 0.03, pw = 0.23;
    const gear = (R, N, a0) => {
      const m = 2 * R / N, ro = R + m, rr = R - 1.15 * m, P = 2 * Math.PI / N, pts = [];
      for (let k = 0; k < N; k++) {
        const a = a0 + k * P;
        [[rr, -0.5], [rr, -0.27], [ro, -0.13], [ro, 0.13], [rr, 0.27]].forEach(([rad, f]) => pts.push([rad * Math.cos(a + f * P), rad * Math.sin(a + f * P)]));
      }
      const g = E3.extrude(pts, th);
      return { v: g.v.map(q => [q[2], q[1], -q[0]]), f: g.f };
    };
    v.add(E3.box(5.2, 0.6, 3.0), { color: C.base, pos: [3.8, -0.3, 0], bias: 0.8 });
    const plates = [xG, xH].map(x => v.add(E3.box(0.46, 6.3, 1.1), { color: '#7d8995', pos: [x, 3.15, 0] }));
    const segs = (c, y) => [[xs, xG - pw], [xG + pw, xH - pw], [xH + pw, xC]].map(([a, b]) => v.add(E3.cyl(c, b - a, 24, 'x'), { color: C.steel, pos: [(a + b) / 2, y, 0] }));
    const sB = segs(cB, yA), sE = segs(cE, yD);
    const gA = v.add(gear(rA, 20, -Math.PI / 2), { color: '#a9b8c6', pos: [0, yA, 0] });
    const gD = v.add(gear(rD, 12, Math.PI / 2 + Math.PI / 12), { color: '#a9b8c6', pos: [0, yD, 0] });
    const hA = v.add(E3.cyl(0.62, th + 0.3, 20, 'x'), { color: '#8794a1', pos: [0, yA, 0] });
    const hD = v.add(E3.cyl(0.48, th + 0.3, 20, 'x'), { color: '#8794a1', pos: [0, yD, 0] });
    const secD = v.add(E3.cyl(1.5, 0.04, 40, 'x'), { color: '#4a5560', pos: [xC + 1.8, yA, 0], alpha: 0, two: 1 });
    const grpB = [...sB, gA, hA], grpE = [...sE, gD, hD];
    const W = (x, y, R, a) => [x, y + R * Math.sin(a), R * Math.cos(a)];
    const arcPts = (x, y, R, a0, a1, n = 16) => [...Array(n + 1).keys()].map(i => W(x, y, R, a0 + (a1 - a0) * i / n));
    const sm = t => t * t * (3 - 2 * t);
    const def = { lab: 1, dim: 0, tq: 1, tf: 1, tw: 0, twE: 0, sec: 0, F: 0, arm: 0, roll: 0, arc: 0, fB: 0, fE: 0, hB: 0, hE: 0, limB: 0, limE: 0, ramp: 0, bars: 0, util: 0, val: 0 };
    return {
      def, apply(S, time, v) {
        const O = v.ov;
        // T_C artışı (8. adım) ya da sabit değer
        const ph = (time * 0.17) % 1, s = sm(Math.min(1, ph / 0.72));
        const Tn = r.TC * (S.ramp > 0.5 ? s : 1);
        const uB = Tn / r.TB, uE = Tn * r.k / r.TE;
        const colB = mixHex(C.steel, C.red, S.util * uB * uB), colE = mixHex(C.steel, C.red, S.util * uE * uE);
        sB.forEach(o => { o.color = colB; o.glow = S.hB * (0.4 + 0.3 * loop(time, 3)); });
        sE.forEach(o => { o.color = colE; o.glow = S.hE * (0.4 + 0.3 * loop(time, 3)); });
        grpB.forEach(o => o.alpha = 1 - 0.72 * S.fB); grpE.forEach(o => o.alpha = 1 - 0.72 * S.fE);
        plates.forEach(o => o.alpha = 1 - 0.5 * Math.max(S.fB, S.fE, S.sec, S.F, S.roll));
        // dişlilerin dönmesi (yay eşitliği)
        const thA = S.roll * 1.25 * loop(time, 0.8), thD = thA * rA / rD;
        gA.rot = [-thA, 0, 0]; gD.rot = [thD, 0, 0];
        const aB = 1 - 0.72 * S.fB, aE = 1 - 0.72 * S.fE;
        // etiketler
        if (S.lab > 0.01) [['A', 0.3, yA + 0.95, 0.75, aB], ['B', xG + 0.55, yA + 0.6, 0, aB], ['C', xC + 0.15, yA + 0.75, 0, aB], ['D', 0.3, yD + 0.75, 0.6, aE], ['E', xG + 0.55, yD + 0.55, 0, aE], ['F', xC + 0.15, yD + 0.7, 0, aE], ['G', xG, 0.45, 0.8, 1], ['H', xH, 0.45, 0.8, 1]]
          .forEach(([t, x, y, z, al]) => O.push({ k: 'text', t, p: [x, y, z], size: 16, alpha: S.lab * al }));
        if (S.dim > 0.01) {
          const a1 = 0.9, a2 = -0.9;
          O.push({ k: 'arrow', a: [xf, yA, 0], b: W(xf, yA, rA, a1), color: C.white, w: 1.6, hs: 9, alpha: S.dim });
          O.push({ k: 'text', t: `r_A = ${p.rA} mm`, p: W(xf, yA, rA + 0.9, a1), size: 14, box: 1, alpha: S.dim });
          O.push({ k: 'arrow', a: [xf, yD, 0], b: W(xf, yD, rD, a2), color: C.white, w: 1.6, hs: 9, alpha: S.dim });
          O.push({ k: 'text', t: `r_D = ${p.rD} mm`, p: W(xf, yD, rD + 0.9, a2), size: 14, box: 1, alpha: S.dim });
          O.push({ k: 'text', t: `d_BC = ${p.dBC} mm`, p: [(xH + xC) / 2 + 0.3, yA + 0.75, 0], size: 13, color: C.dim, box: 1, alpha: S.dim });
          O.push({ k: 'text', t: `d_EF = ${p.dEF} mm`, p: [(xH + xC) / 2 + 0.3, yD + 0.7, 0], size: 13, color: C.dim, box: 1, alpha: S.dim });
        }
        // torklar (şekildeki gibi: ön yüz yukarı döner)
        const torque = (x, y, R, lab, al, below) => {
          if (al <= 0.01) return;
          const P = arcPts(x, y, R, -1.7, 1.45, 14), n = P.length;
          O.push({ k: 'line', p: P.slice(0, n - 1), color: C.red, w: 3, alpha: al });
          O.push({ k: 'arrow', a: P[n - 2], b: P[n - 1], color: C.red, w: 3, hs: 11, alpha: al });
          O.push({ k: 'line', p: [[xC, y, 0], [x + 0.8, y, 0]], color: C.mute, w: 1, alpha: al * 0.7 });
          O.push({ k: 'text', t: lab, p: below ? [x + 0.2, y - R - 0.5, -0.2] : [x + 0.2, y + R + 0.45, -0.2], color: C.red, size: 15, box: 1, align: 'left', alpha: al });
        };
        const xo = -xf; // dişli adımlarında kamera dişli tarafında
        const tcl = S.ramp > 0.5 ? `T_C = ${f1(Tn)} N·m` : S.val > 0.5 ? `T_C = ${f1(r.TC)} N·m` : 'T_C';
        torque(xC + 0.45, yA, 0.85, tcl, S.tq * aB);
        torque(xC + 0.45, yD, 0.7, S.val > 0.5 || S.ramp > 0.5 ? `T_F = ${f2(r.k)}·T_C` : 'T_F (karşı tork)', S.tf * aE, true);
        // burulma çizgisi (helis)
        const helix = (y, c, tw, al, held) => {
          if (al <= 0.01) return;
          const x0 = xf, L = xC - x0, th0 = 0.45;
          [[x0, xG - pw], [xG + pw, xH - pw], [xH + pw, xC]].forEach(([a, b]) => {
            const P = [], D = []; for (let i = 0; i <= 14; i++) { const x = a + (b - a) * i / 14; P.push(W(x, y, c + 0.012, th0 + tw * (x - x0) / L)); D.push(W(x, y, c + 0.012, th0)); }
            O.push({ k: 'line', p: D, color: C.white, w: 1.2, dash: [5, 4], alpha: al * 0.6 });
            O.push({ k: 'line', p: P, color: C.red, w: 2.6, alpha: al });
          });
          O.push({ k: 'line', p: [[xC + 0.01, y, 0], W(xC + 0.01, y, c, th0)], color: C.white, w: 1.2, dash: [3, 3], alpha: al * 0.7 });
          O.push({ k: 'line', p: [[xC + 0.01, y, 0], W(xC + 0.01, y, c, th0 + tw)], color: C.red, w: 2.4, alpha: al });
          if (held) {
            O.push({ k: 'text', t: 'bu uç dişliyle tutuluyor', p: [xf, y + rA + 0.6, 0], size: 13, color: C.dim, box: 1, alpha: al });
            O.push({ k: 'text', t: 'C ucu çevriliyor\nçizgi helis gibi eğilir', p: [xC - 1.3, y + 1.6, 0.3], size: 13, color: C.red, box: 1, alpha: al });
          }
        };
        const twA = (0.3 + 1.1 * S.ex) * (S.ramp > 0.5 ? s : 0.35 + 0.65 * loop(time, 1.3));
        helix(yA, cB, twA * (S.val > 0.5 ? uB : 1), S.tw, S.val < 0.5);
        helix(yD, cE, twA * 1.35, S.twE, false);
        // büyütülmüş kesit: τ dağılımı
        secD.alpha = S.sec * 0.92;
        if (S.sec > 0.01) {
          const x = xC + 1.8, R = 1.5;
          O.push({ k: 'ring', c: [x, yA, 0], r: R, u: [0, 1, 0], v: [0, 0, 1], color: C.white, w: 2, alpha: S.sec });
          O.push({ k: 'line', p: [[xC, yA, 0], [x, yA, 0]], color: C.mute, w: 1, dash: [4, 4], alpha: S.sec * 0.7 });
          O.push({ k: 'line', p: [[x, yA, -R], [x, yA, R]], color: C.mute, w: 1, alpha: S.sec });
          for (let i = 1; i <= 5; i++) {
            const rho = R * i / 5, L = 0.95 * i / 5;
            O.push({ k: 'arrow', a: [x, yA, rho], b: [x, yA + L, rho], color: C.red, w: 2.2, hs: 8, alpha: S.sec });
            O.push({ k: 'arrow', a: [x, yA, -rho], b: [x, yA - L, -rho], color: C.red, w: 2.2, hs: 8, alpha: S.sec });
          }
          O.push({ k: 'line', p: [[x, yA, 0], [x, yA + 0.95, R]], color: C.red, w: 1, dash: [3, 3], alpha: S.sec * 0.8 });
          O.push({ k: 'text', t: 'merkezde τ = 0', p: [x, yA - 0.35, 0], size: 13, color: C.dim, box: 1, alpha: S.sec });
          O.push({ k: 'text', t: 'yüzeyde (ρ = c)\nτ_max = T·c / J', p: [x, yA + 1.55, R + 0.2], size: 14, color: C.red, box: 1, alpha: S.sec });
          O.push({ k: 'text', t: 'BC kesiti (büyütülmüş)', p: [x, yA - R - 0.55, 0], size: 13, color: C.dim, box: 1, alpha: S.sec });
        }
        // dişli teması: aynı F, farklı kol
        const Py = yA - rA;
        if (S.F > 0.01) {
          O.push({ k: 'arrow', a: [xo, Py + 0.13, 0], b: [xo, Py + 0.13, -1.5], color: C.white, w: 2.6, alpha: S.F });
          O.push({ k: 'text', t: 'F: D, A\'yı iter', p: [xo, Py + 0.55, -1.9], size: 13, box: 1, alpha: S.F });
          O.push({ k: 'arrow', a: [xo, Py - 0.13, 0], b: [xo, Py - 0.13, 1.5], color: C.white, w: 2.6, alpha: S.F });
          O.push({ k: 'text', t: 'F: A, D\'yi iter', p: [xo, Py - 0.6, 1.9], size: 13, box: 1, alpha: S.F });
          O.push({ k: 'text', t: 'temas: kuvvet aynı', p: [xo, Py - 0.45, -3.0], size: 12, color: C.dim, alpha: S.F });
        }
        if (S.arm > 0.01) {
          O.push({ k: 'line', p: [[xo, yA, 0], [xo, Py, 0]], color: C.red, w: 3, alpha: S.arm });
          O.push({ k: 'line', p: [[xo, yD, 0], [xo, Py, 0]], color: C.comp, w: 3, alpha: S.arm });
          O.push({ k: 'text', t: `kol r_A = ${p.rA} mm\nT_BC = F · r_A = T_C`, p: [xo, yA - rA / 2 + 0.3, 0], dx: -100, size: 13, color: C.red, box: 1, alpha: S.arm });
          O.push({ k: 'text', t: `kol r_D = ${p.rD} mm\nT_EF = F · r_D`, p: [xo, yD - 0.1, 0], dx: -95, dy: 30, size: 13, color: C.comp, box: 1, alpha: S.arm });
        }
        // yay uzunlukları
        if (S.arc > 0.01) {
          const PA = arcPts(xo, yA, rA, -Math.PI / 2, -Math.PI / 2 + thA, 18), PD = arcPts(xo, yD, rD, Math.PI / 2, Math.PI / 2 - thD, 18);
          O.push({ k: 'line', p: PA, color: C.red, w: 4.5, alpha: S.arc });
          O.push({ k: 'line', p: PD, color: C.red, w: 4.5, alpha: S.arc });
          O.push({ k: 'line', p: [[xo, yA, 0], PA[PA.length - 1]], color: C.white, w: 1.4, alpha: S.arc * 0.8 });
          O.push({ k: 'line', p: [[xo, yD, 0], PD[PD.length - 1]], color: C.white, w: 1.4, alpha: S.arc * 0.8 });
          O.push({ k: 'text', t: 'yay = r_A · θ_A', p: [xo, yA + 0.7, 0], dx: 70, size: 13, color: C.white, box: 1, alpha: S.arc });
          O.push({ k: 'text', t: 'yay = r_D · θ_D', p: [xo, yD - 0.4, 0], dx: 70, dy: 25, size: 13, color: C.white, box: 1, alpha: S.arc });
          O.push({ k: 'text', t: `kırmızı yaylar eşit\nθ_D = ${f2(r.spd)} · θ_A (ters yönde)`, p: [xo, yD - rD - 0.9, 0], size: 14, color: C.red, box: 1, alpha: S.arc });
        }
        // sınır etiketleri
        if (S.limB > 0.01) {
          O.push({ k: 'ring', c: [xC + 0.01, yA, 0], r: cB, u: [0, 1, 0], v: [0, 0, 1], color: C.red, w: 2.5, alpha: S.limB });
          O.push({ k: 'text', t: `BC: c = ${f1(r.cB)} mm\nJ = ${fmt(r.JB, 0)} mm⁴\nT_C ≤ ${f1(r.TB)} N·m`, p: [xC - 1.4, yA + 1.9, 0], size: 14, color: C.white, box: 1, alpha: S.limB });
        }
        if (S.limE > 0.01) {
          O.push({ k: 'ring', c: [xC + 0.01, yD, 0], r: cE, u: [0, 1, 0], v: [0, 0, 1], color: C.red, w: 2.5, alpha: S.limE });
          O.push({ k: 'text', t: `EF: c = ${f1(r.cE)} mm\nT_EF ≤ ${f1(r.TE)} N·m\nT_C ≤ ${f1(r.TE)} / ${f2(r.k)} = ${f1(r.TC2)} N·m`, p: [xC - 1.4, yD - 1.6, 0.3], size: 14, color: C.white, box: 1, alpha: S.limE });
        }
        // doluluk çubukları (ekrana paralel)
        if (S.bars > 0.01) {
          const B = v._basis(), rr = B.r, uu = B.u, nar = v.W < 600, Lb = nar ? 2.5 : 4.2, sh = nar ? -1.2 : 0;
          const at = (o, a0, b) => { const a = a0 + sh; return [o[0] + rr[0] * a + uu[0] * b, o[1] + rr[1] * a + uu[1] * b, o[2] + rr[2] * a + uu[2] * b]; };
          const o0 = [5.6, 9.2, 0.6];
          [['BC', uB, 0], ['EF', uE, -0.9]].forEach(([n, u, dy]) => {
            const a = at(o0, 0, dy), full = at(o0, Lb, dy), fil = at(o0, Lb * Math.min(1, u), dy);
            O.push({ k: 'line', p: [a, full], color: '#2a323c', w: 12, alpha: S.bars });
            O.push({ k: 'line', p: [a, fil], color: u >= 0.995 ? C.red : C.steel, w: 12, alpha: S.bars });
            O.push({ k: 'text', t: `${n}  %${fmt(u * 100, 0)}`, p: at(o0, -0.3, dy), size: 14, align: 'right', color: u >= 0.995 ? C.red : C.white, alpha: S.bars });
          });
          O.push({ k: 'text', t: `τ / τ_em  (sınır %100)`, p: at(o0, Lb / 2, 0.75), size: 12, color: C.dim, alpha: S.bars });
          if (uE >= 0.995 || uB >= 0.995) O.push({ k: 'text', t: `${uE >= uB ? 'EF' : 'BC'} SINIRDA`, p: at(o0, Lb + 0.4, -1.8), size: 15, color: C.red, box: 1, align: 'right', alpha: S.bars });
        }
        if (S.val > 0.01) {
          O.push({ k: 'text', t: `τ_BC = ${f1(r.tB)} MPa (%${fmt(r.uB * 100, 0)})`, p: [(xG + xH) / 2 + 0.3, yA + 1.45, 0.3], size: 14, color: C.white, box: 1, alpha: S.val });
          O.push({ k: 'text', t: `τ_EF = ${f1(r.tE)} MPa (%${fmt(r.uE * 100, 0)})`, p: [(xH + xC) / 2, yD - 0.9, 0.3], size: 14, color: C.red, box: 1, alpha: S.val });
        }
      }
    };
  },
  whatif: {
    not: 'Çapları ve dişli yarıçaplarını oynat. Hangi şaftın belirleyici olduğu değişiyor mu? Çapın etkisi küp ile, dişli oranının etkisi doğrusal.',
    s: [{ k: 'tau', ad: 'τ_em', min: 20, max: 120, step: 5, u: 'MPa' }, { k: 'dBC', ad: 'd_BC', min: 20, max: 70, step: 1, u: 'mm' }, { k: 'dEF', ad: 'd_EF', min: 15, max: 60, step: 1, u: 'mm' }, { k: 'rA', ad: 'r_A (BC dişlisi)', min: 40, max: 160, step: 5, u: 'mm' }, { k: 'rD', ad: 'r_D (EF dişlisi)', min: 30, max: 160, step: 5, u: 'mm' }],
    out: (p, r) => {
      const mx = Math.max(r.TB, r.TC2) * 1.1;
      return `<div class="mets"><div class="m"><small>T_EF = k · T_C, k = r_D / r_A</small><b>${f3(r.k)}</b></div><div class="m red"><small>T_C,max</small><b>${f1(r.TC)} N·m</b></div></div>
      <div class="bars"><div class="bar ${r.gov === 'BC' ? 'gov' : ''}"><span>BC şartı: T_C ≤</span><i style="width:${r.TB / mx * 100}%"></i><b>${f1(r.TB)} N·m</b></div>
      <div class="bar ${r.gov === 'EF' ? 'gov' : ''}"><span>EF şartı: T_C ≤</span><i style="width:${r.TC2 / mx * 100}%"></i><b>${f1(r.TC2)} N·m</b></div></div>
      <p class="note">Belirleyici: <b>${r.gov} şaftı</b>. EF\'yi rahatlatmanın iki yolu: çapını büyütmek (c³ ile) ya da D dişlisini küçültmek (EF\'ye daha az tork gelir). τ_em iki sınırı da aynı oranda değiştirir, belirleyiciyi değiştirmez.</p>`;
    }
  },
  kagit: (p, r) => `BC şaftı (T_BC = T_C):  c = ${f1(r.cB)} mm
  J = π·c⁴/2 = π·${f1(r.cB)}⁴/2 = ${fmt(r.JB, 0)} mm⁴
  T_C ≤ τ_em·J/c = ${p.tau}·${fmt(r.JB, 0)}/${f1(r.cB)} = ${fmt(r.TB * 1000, 0)} N·mm = ${f1(r.TB)} N·m
Dişli teması (F aynı):  F = T_C/r_A = T_EF/r_D
  T_EF = T_C·r_D/r_A = T_C·${p.rD}/${p.rA} = ${f2(r.k)}·T_C
EF şaftı:  c = ${f1(r.cE)} mm
  J = π·${f1(r.cE)}⁴/2 = ${fmt(r.JE, 0)} mm⁴
  T_EF ≤ ${p.tau}·${fmt(r.JE, 0)}/${f1(r.cE)} = ${fmt(r.TE * 1000, 0)} N·mm = ${f1(r.TE)} N·m
  ${f2(r.k)}·T_C ≤ ${f1(r.TE)}  →  T_C ≤ ${f1(r.TC2)} N·m
T_C,max = min(${f1(r.TB)} ; ${f1(r.TC2)}) = ${f1(r.TC)} N·m   (belirleyici: ${r.gov})`,
  tuzak: ['<b>Çapı c yerine koymak.</b> c yarıçap. 40 mm koyarsan tork 8 kat büyük çıkar.',
    '<b>Dişli oranını ters çevirmek.</b> T<sub>EF</sub> = T<sub>C</sub>·r<sub>D</sub>/r<sub>A</sub> (küçük dişli, küçük tork). Ters yazarsan T<sub>C</sub> ≤ 159 N·m gibi yanlış bir değer bulursun.',
    '<b>EF\'nin torkunu cevap sanmak.</b> 265,1 N·m, EF\'nin taşıyabileceği tork. Soru C\'deki torku istiyor: 265,1 / 0,6.',
    '<b>Büyüğü seçmek.</b> İki şaft da sağlam kalmalı: iki sınırın küçüğü.',
    '<b>J\'yi karıştırmak.</b> Burmada J = π·c⁴/2 (kutupsal). π·c⁴/4 eğilmedeki I\'dır; onu koyarsan tork yarıya düşer.',
    '<b>Birim.</b> MPa · mm³ = N·mm. N·m için 1000\'e böl.'],
  gen() {
    const rA = rnd(60, 150, 10);
    return { tau: rnd(40, 90, 5), dBC: rnd(30, 60, 5), dEF: rnd(20, 50, 5), rA, rD: rnd(40, Math.max(40, rA - 10), 10) };
  },
  pracText: p => `Aynı düzen: iki dolu çelik şaft dişlilerle bağlı, τ<sub>em</sub> = ${p.tau} MPa. Üst şaft BC\'nin çapı ${p.dBC} mm, ucundaki A dişlisinin yarıçapı ${p.rA} mm. Alt şaft EF\'nin çapı ${p.dEF} mm, ucundaki D dişlisinin yarıçapı ${p.rD} mm. Tork C\'ye uygulanıyor. Her şaftın verdiği T<sub>C</sub> sınırını ve C\'ye uygulanabilecek en büyük T<sub>C</sub>\'yi bul (N·m).`,
  ans: [{ k: 'TB', ad: 'BC şartından T_C ≤', u: 'N·m' }, { k: 'TC2', ad: 'EF şartından T_C ≤', u: 'N·m' }, { k: 'TC', ad: 'T_C,max', u: 'N·m' }],
  hints: (p, r) => [`Önce yarıçaplar: c = ${f1(r.cB)} mm ve ${f1(r.cE)} mm. T_izin = τ_em · π · c³ / 2 (N·mm çıkar, 1000'e böl).`,
    `BC şaftı T_C'nin kendisini taşır: T_C ≤ ${f1(r.TB)} N·m.`,
    `EF şaftına gelen tork T_C · ${p.rD}/${p.rA}. EF en çok ${f1(r.TE)} N·m taşır; T_C ≤ ${f1(r.TE)} · ${p.rA}/${p.rD}.`,
    'İki sınırın küçüğü cevap.'],
  diag(p, r, u) {
    const near = (a, b) => isFinite(a) && Math.abs(a - b) <= Math.abs(b) * 0.02;
    if (near(u.TB, r.TB * 8) || near(u.TC2, r.TC2 * 8)) return 'Tam 8 katı çıkmış: c yerine çapı koymuşsun. c = d / 2.';
    if (near(u.TB, r.TB / 2) || near(u.TC2, r.TC2 / 2)) return 'Yarısı çıkmış: J = π·c⁴/2 olmalı (π·c⁴/4 değil; çapla yazdıysan J = π·d⁴/32 ve c = d/2).';
    if (near(u.TB, r.TB * 1000) || near(u.TC2, r.TC2 * 1000) || near(u.TC, r.TC * 1000)) return 'Sonuç N·mm. N·m için 1000\'e böl.';
    if (near(u.TC2, r.TE * r.k)) return 'Dişli oranını ters kullandın. EF\'ye gelen tork T_C · r_D/r_A; o yüzden T_C = T_EF · r_A/r_D (büyür).';
    if (near(u.TC2, r.TE) || near(u.TC, r.TE)) return 'Bu EF\'nin taşıyabileceği tork (T_EF). Soru C\'deki torku istiyor: T_EF · r_A / r_D.';
    if (near(u.TC, Math.max(r.TB, r.TC2))) return 'Büyüğü seçtin. İki şaft da sağlam kalmalı: küçüğü.';
    return 'Sırayla git: önce her şaftın T_izin = τ·π·c³/2 değeri, sonra EF için dişli oranı, sonra küçüğü.';
  }
});
