'use strict';
/* ============ VİZE 4 · 2016–17 Yaz S4 · dişli–şaft sistemi, burma ============ */
VIZE.push({
  id: 'v4', no: 4, kod: 'V4', vize: true, tip: 'bu',
  src: '2016–17 Yaz vizesi · Soru 4',
  img: 'img/v4.png', cevapImg: 'img/v4_cevap.png',
  ad: 'Dişli–şaft: A\'yı çevir, D sabit, açı ve gerilme sınırı',
  ozet: 'A\'ya tork uygulanınca iki şaft da burulur. A\'nın toplam dönmesi = kendi şaftının burulması + dişlinin B\'yi döndürdüğü açı. Açı şartı ve gerilme şartı ayrı ayrı yazılır; ikisi aynı anda sınırdayken c ve T<sub>A</sub> çıkar.',
  soru: 'Şekilde gösterilen dişli-şaft sisteminin özellikleri, kullanılan her iki şaftın da aynı çaplı olmasını ve D kasnağı sabit tutulmuşken, A kasnağının T<sub>A</sub> torkuna maruz kaldığında oluşan açının 7,5°\'yi aşmaması gerekmektedir. G = 77 GPa ve τ<sub>em</sub> = 84 MPa olan çelikten yapılan şaftların çapını ve T<sub>A</sub> torkunu belirleyiniz.',
  verilen: ['Üst şaft AB: A kasnağından B dişlisine L<sub>AB</sub> = 200 + 400 = 600 mm',
    'Alt şaft CD: D kasnağından C dişlisine L<sub>CD</sub> = 600 mm (D, A ile; C, B ile aynı hizada)',
    'B dişlisi r<sub>B</sub> = 50 mm, C dişlisi r<sub>C</sub> = 125 mm (yarıçap)',
    'İki şaft aynı çaplı (aynı c, aynı J); G = 77 GPa, τ<sub>em</sub> = 84 MPa',
    'D sabit; A\'nın dönme açısı φ<sub>A</sub> ≤ 7,5°',
    'B\'nin arkasındaki 150 mm\'lik parça yalnızca yatakta dönüyor, tork taşımıyor'],
  istenen: 'Şaft çapı d (= 2c) ve T<sub>A</sub> torku',
  p0: { LAB: 600, LCD: 600, rB: 50, rC: 125, G: 77, te: 84, phd: 7.5, Tg: 200 },
  solve(p) {
    const n = p.rC / p.rB, phi = p.phd * Math.PI / 180, Gm = p.G * 1000, K = p.LAB + n * n * p.LCD;
    const c = p.te * K / (n * phi * Gm), d = 2 * c, J = Math.PI * Math.pow(c, 4) / 2;
    const TA = p.te * J / (n * c), TD = n * TA, JG = J * Gm;
    const phAB = TA * p.LAB / JG, phCD = TD * p.LCD / JG, phB = n * phCD, phA = phAB + phB;
    const kA = phi * Gm * Math.PI / (2 * K), kS = p.te * Math.PI / (2 * n);
    const phiH = Math.round(phi * 100) / 100, cH = p.te * K / (n * phiH * Gm), TAH = kS * Math.pow(cH, 3) / 1000;
    const Tgn = p.Tg * 1000, cAng = Math.pow(2 * Tgn * K / (Math.PI * phi * Gm), 0.25), cTau = Math.cbrt(2 * n * Tgn / (Math.PI * p.te));
    return { n, phi, Gm, K, c, d, J, TA, TAk: TA / 1000, TD, TDk: TD / 1000, JG, phAB, phCD, phB, phA,
      tauAB: TA * c / J, tauCD: TD * c / J, kA, kS, phiH, cH, dH: 2 * cH, TAH,
      cAng, cTau, cReq: Math.max(cAng, cTau), gov: cTau >= cAng ? 'gerilme' : 'açı', F: TA / p.rB };
  },
  anlam: [
    ['dişli-şaft sistemi', 'İki ayrı şaft var, birbirine <b>dişliyle</b> bağlı. Tork bir şafttan ötekine dişli temasındaki kuvvetle geçer.'],
    ['D kasnağı sabit tutulmuşken', 'Alt şaftın D ucu dönemez. Alt şaft burulursa C dişlisi biraz döner; bu dönme B\'yi de döndürür.'],
    ['A kasnağının T<sub>A</sub> torkuna maruz kaldığında', 'Yük üst şaftın ucunda. Üst şaft A ile B arasında T<sub>A</sub> taşır.'],
    ['açının 7,5°\'yi aşmaması', 'Bu A\'nın <b>toplam</b> dönmesi (D\'ye göre): φ<sub>A</sub> = φ<sub>AB</sub> + φ<sub>B</sub>. Formüllere girmeden önce radyana çevir.'],
    ['her iki şaftın da aynı çaplı', 'İki şaftta aynı c, aynı J = π·c⁴/2. Bilinmeyen çap tek.'],
    ['τ<sub>em</sub> = 84 MPa', 'Gerilme şartı: τ = T·c/J ≤ 84. Torku büyük olan şaft (CD) belirler.'],
    ['çapı ve T<sub>A</sub> torkunu belirleyiniz', 'İki bilinmeyen (c ve T<sub>A</sub>), iki şart (açı, gerilme). İkisi aynı anda sınırda alınır.']
  ],
  tetik: ['dişli–şaft', 'kasnak sabit', 'dönme açısı … aşmamalı', 'G ve τ_em verilmiş', 'aynı çaplı'],
  tetikNot: 'G (kayma modülü) ve bir açı sınırı görüyorsan φ = T·L/(J·G); τ_em görüyorsan τ = T·c/J. Dişli varsa iki ek kural: temas kuvveti ortak (tork yarıçapla orantılı) ve temasta yay uzunlukları eşit (açı yarıçapla ters orantılı).',
  zincir: [
    ['Hangi şaft hangi torku taşıyor?', 'AB: T<sub>A</sub>. Temasta ortak kuvvet F = T<sub>A</sub>/r<sub>B</sub>; C\'ye F·r<sub>C</sub> = 2,5·T<sub>A</sub> tork verir. CD: 2,5·T<sub>A</sub>.'],
    ['A neden döner?', 'İki sebep: AB şaftı kendi içinde burulur (φ<sub>AB</sub>) ve B dişlisi de dönmüştür (φ<sub>B</sub>).'],
    ['B neden döner?', 'D sabit, CD burulur, C φ<sub>CD</sub> kadar döner. Temasta yaylar eşit: φ<sub>B</sub>·r<sub>B</sub> = φ<sub>C</sub>·r<sub>C</sub> → φ<sub>B</sub> = 2,5·φ<sub>CD</sub>.'],
    ['A\'nın açısı T_A ile nasıl bağlanır?', 'φ<sub>A</sub> = T<sub>A</sub>·L/(JG) + 2,5·(2,5·T<sub>A</sub>)·L/(JG) = 7,25·T<sub>A</sub>·L/(JG).'],
    ['İki şartı nasıl kullanırım?', 'Açı şartından T<sub>A</sub> = (sayı)·c⁴, gerilme şartından T<sub>A</sub> = (sayı)·c³. Eşitle: c çıkar, sonra T<sub>A</sub>.']
  ],
  cam: { yaw: -0.85, pitch: 0.3, dist: 12.2, t: [3.6, 0.3, 0] },
  steps: [
    { t: 'Şekle bak', st: { dim: 1, lab: 1 },
      h: () => 'İki paralel şaft. Üstteki şaftın önünde <b>A kasnağı</b> (tork burada uygulanıyor), arkasında küçük <b>B dişlisi</b>. Alttaki şaftın önünde <b>D kasnağı</b> (sabit tutuluyor, taralı blok), arkasında büyük <b>C dişlisi</b>. B ile C birbirine geçiyor. Şaftlar iki plakadaki yataklarda serbestçe dönüyor (plakalar saydam çizildi).',
      why: 'Uzunluklar: A\'dan ön plakaya 200 mm, oradan B\'ye 400 mm → L<sub>AB</sub> = 600 mm. D, A ile aynı hizada, C de B ile → L<sub>CD</sub> = 600 mm. B\'nin arkasındaki 150 mm\'lik uç yalnızca yatakta dönüyor; tork ondan geçmez, hesaba girmez.' },
    { t: 'Burma: şaft nasıl burulur?', st: { lab: 1, twist: 1, anim: 1, ghost: 1 },
      h: () => 'Bir şaftın bir ucunu tut, öbür ucunu çevir. Yüzeye çizilmiş <b>düz bir çizgi</b> (kesikli: başlangıç) <b>helis</b> gibi kıvrılır. Uçların birbirine göre dönme açısı <b>φ</b> (burulma açısı). Kırmızı çizgilere bak: alt şaftta D ucu hiç dönmüyor, C ucu dönüyor. Üst şaftta B\'nin arkasındaki parça düz kalıyor: orada tork yok. (Dönmeler çok abartılı.)',
      f: () => 'φ = T·L / (J·G) (radyan) &nbsp;&nbsp; τ = T·c / J (en büyüğü yüzeyde) &nbsp;&nbsp; J = π·c⁴/2',
      why: 'T büyükse daha çok burulur; L uzunsa her dilimin küçük dönmesi üst üste biner; J·G büyükse (kalın, sert şaft) zor burulur. J, kesitin dönmeye karşı "kolu": c⁴ ile büyür, çapı biraz büyütmek şaftı çok sertleştirir. τ ise merkezde sıfır, yüzeyde en büyük; o yüzden c (yarıçap) ile çarpılır.' },
    { t: 'Dişli: tork 2,5 katına çıkar', st: { lab: 1, F: 1, plates: 0, back: 1 }, cam: { yaw: 1.45, pitch: 0.12, dist: 6.4, t: [6, 0.55, 0] },
      h: (p, r) => `B ile C temas noktasında birbirini <b>aynı F kuvvetiyle</b> iter (etki–tepki). Üst şaft: T<sub>A</sub> = F·r<sub>B</sub>. Alt şaft: dişlinin C\'ye verdiği tork F·r<sub>C</sub>, bunu D\'deki tutma torku T<sub>D</sub> dengeler. Aynı kuvvet, ${f1(r.n)} kat uzun kol → ${f1(r.n)} kat tork. Büyük dişli = büyük tork.`,
      f: (p, r) => `F·${p.rB} = T<sub>A</sub> &nbsp; ; &nbsp; F·${p.rC} = T<sub>D</sub> &nbsp;→&nbsp; <b>T<sub>D</sub> = (${p.rC}/${p.rB})·T<sub>A</sub> = ${f2(r.n)}·T<sub>A</sub></b><br>AB şaftındaki tork: T<sub>A</sub> &nbsp; ; &nbsp; CD şaftındaki tork: ${f2(r.n)}·T<sub>A</sub>`,
      why: 'Bisiklet vitesi gibi: küçük dişli büyüğü çevirirken büyük dişlinin şaftındaki tork artar, dönme açısı azalır. Kuvvet aynı kalır, değişen kol uzunluğu. T_D\'nin yönü: C\'nin dönmek istediği yönün tersi; büyüklük için yön önemli değil.' },
    { t: 'Temas: yay uzunlukları eşit', st: { lab: 1, twist: 1, arc: 1, ghost: 1, plates: 0, back: 1 }, cam: { yaw: 1.45, pitch: 0.12, dist: 6.4, t: [6, 0.55, 0] },
      h: (p, r) => `Dişliler kaymadan döner: temas noktasından B\'nin çevresinde geçen yay (kırmızı) ile C\'nin çevresinde geçen yay (mavi) <b>aynı uzunlukta</b>. B küçük olduğu için aynı yayla <b>daha büyük açı</b> döner. Bak: B\'nin dilimi geniş, C\'ninki dar. Dönüş yönleri ters.`,
      f: (p, r) => `φ<sub>B</sub>·r<sub>B</sub> = φ<sub>C</sub>·r<sub>C</sub> → φ<sub>B</sub> = (${p.rC}/${p.rB})·φ<sub>C</sub> = <b>${f2(r.n)}·φ<sub>CD</sub></b><br>(D sabit olduğu için C\'nin dönmesi = CD şaftının burulması: φ<sub>C</sub> = φ<sub>CD</sub>)`,
      why: 'Yay uzunluğu = yarıçap × açı (radyan). Temas noktasında iki dişlinin dişleri birlikte ilerler; biri ötekinden fazla yol alsaydı dişler kırılır ya da kayardı. Dikkat: tork oranında r_C/r_B çarpandı (T büyür), açı oranında da r_C/r_B çarpan ama bu sefer küçük dişli tarafı (φ_B) büyük.' },
    { t: 'A\'nın toplam açısı', st: { lab: 1, twist: 1, sumA: 1, ghost: 1 },
      h: (p, r) => `D\'den A\'ya yürü: D sabit → CD burulur, C φ<sub>CD</sub> döner → B, ${f1(r.n)} katı kadar döner (φ<sub>B</sub>) → AB burulur, A B\'den φ<sub>AB</sub> daha fazla döner. Kasnak ve dişlilerdeki çizgiler (kesikli: başlangıç) her parçanın dönmesini gösterir.`,
      f: (p, r) => `φ<sub>A</sub> = φ<sub>AB</sub> + φ<sub>B</sub> = T<sub>A</sub>·L<sub>AB</sub>/(JG) + ${f2(r.n)}·(${f2(r.n)}·T<sub>A</sub>)·L<sub>CD</sub>/(JG)<br>= T<sub>A</sub>·(${p.LAB} + ${f2(r.n * r.n)}·${p.LCD})/(JG) = <b>T<sub>A</sub>·${fmt(r.K, 0)} / (J·G)</b>${p.LAB === p.LCD ? ` &nbsp;(= ${f2(r.K / p.LAB)}·${p.LAB}·T<sub>A</sub>/(JG))` : ''}`,
      why: 'n = r_C/r_B iki kez çıkar: bir kez CD\'nin torku n katı olduğu için, bir kez de B\'nin açısı C\'ninkinin n katı olduğu için. Bu yüzden n² = 6,25. Alt şaft, üst şafttan 6,25 kat daha çok katkı yapar.' },
    { t: 'Açı şartı → T_A = (sayı)·c⁴', st: { lab: 1, twist: 1, sumA: 1, cond: 1 },
      h: (p, r) => `Sınır: φ<sub>A</sub> = ${String(p.phd).replace('.', ',')}°. Önce radyana çevir. J = π·c⁴/2 yerine koy. G\'yi MPa (N/mm²) yaz, uzunlukları mm: T<sub>A</sub> N·mm çıkar.`,
      f: (p, r) => `φ = ${String(p.phd).replace('.', ',')}·π/180 = <b>${f4(r.phi)} rad</b><br>T<sub>A</sub> = φ·J·G / ${fmt(r.K, 0)} = ${f4(r.phi)}·(π·c⁴/2)·${fmt(r.Gm, 0)} / ${fmt(r.K, 0)} = <b>${f3(r.kA)}·c⁴</b> (N·mm)`,
      why: 'Radyana çevirmezsen sonuç 57 kat şaşar: φ = TL/(JG) formülü radyanla türetildi (yay = yarıçap × açı).' },
    { t: 'Gerilme şartı → T_A = (sayı)·c³', st: { lab: 1, str: 1, tq: 1 },
      h: (p, r) => `İki şaft aynı çaplı, ama CD\'nin torku ${f1(r.n)} kat büyük (koyu kırmızı). En büyük τ orada, yüzeyde. O şaftı τ<sub>em</sub>\'e eşitle.`,
      f: (p, r) => `τ<sub>max</sub> = (${f2(r.n)}·T<sub>A</sub>)·c / J = ${p.te} MPa → T<sub>A</sub> = ${p.te}·(π·c⁴/2) / (${f2(r.n)}·c) = <b>${f2(r.kS)}·c³</b> (N·mm)`,
      why: 'AB\'yi (T_A ile) kontrol etseydin daha ince şaft yeter derdin; ama CD o çapta 84 MPa\'yı ' + 'aşardı. Aynı çaplı şaftlarda torku büyük olan belirler.' },
    { t: 'İki şart birlikte → c, d, T_A', st: { lab: 1, twist: 1, fin: 1 },
      h: (p, r) => `T<sub>A</sub> verilmemiş: iki bilinmeyen (c, T<sub>A</sub>), iki şart. Şaft hem açı hem gerilme sınırına <b>aynı anda</b> ulaşsın: iki ifadeyi eşitle. c<sup>3</sup> sadeleşir, c tek başına kalır.`,
      f: (p, r) => `${f3(r.kA)}·c⁴ = ${f2(r.kS)}·c³ → c = ${f2(r.kS)} / ${f3(r.kA)} = <b>${f2(r.c)} mm</b> → <b>d = ${f2(r.d)} mm</b><br>T<sub>A</sub> = ${f2(r.kS)}·${f2(r.c)}³ = ${fmt(r.TA, 0)} N·mm = <b>${f1(r.TAk)} N·m</b> &nbsp;(T<sub>D</sub> = ${f1(r.TDk)} N·m)<br>Kontrol: φ<sub>A</sub> = ${f4(r.phAB)} + ${f4(r.phB)} = ${f4(r.phA)} rad = ${f2(r.phA * 180 / Math.PI)}° ✓ &nbsp; τ<sub>CD</sub> = ${f1(r.tauCD)} MPa ✓`,
      why: 'Daha ince bir şaft seçersen T_A\'yı açı şartı sınırlar (c⁴ hızlı küçülür); daha kalın seçersen gerilme şartı. Eşitlik noktası, iki sınırın kesiştiği "dengeli" tasarım: hocanın çözdüğü budur. Kısa yol: c = τ_em·K / (n·φ·G).' },
    { t: 'T_A verilseydi: iki c, büyüğü', st: { lab: 1, giv: 1, str: 0.5 }, skipPrac: true,
      h: (p, r) => `Kitaptaki benzer sorularda T<sub>A</sub> verilir (örneğin ${p.Tg} N·m). O zaman her şart <b>ayrı bir c</b> verir. Şaft ikisini de sağlamalı: <b>büyük c</b> seçilir (ince olan şaft öbür şartı bozar).`,
      f: (p, r) => `Açı: c⁴ = 2·T·${fmt(r.K, 0)}/(π·φ·G) → c = ${f2(r.cAng)} mm<br>Gerilme: c³ = 2·(${f2(r.n)}·T)/(π·τ<sub>em</sub>) → c = ${f2(r.cTau)} mm<br>Seç: <b>c = ${f2(r.cReq)} mm</b> (belirleyici: ${r.gov}), d = ${f1(2 * r.cReq)} mm` }
  ],
  scene(v, p, r) {
    const s = 0.01, xg = p.LAB * s, xp1 = 2, xp2 = xg + 1.5, yU = (p.rB + p.rC) * s, RB = p.rB * s, RC = p.rC * s, rs = 0.19;
    const P0 = 2.6; // çizgilerin başladığı açı (kameraya bakan yüz)
    const toX = m => ({ v: m.v.map(q => [q[2], q[1], -q[0]]), f: m.f });
    const gear = (R, N, hh) => { const pts = [], pa = 2 * Math.PI / N, Rr = R - hh / 2, Rt = R + hh / 2;
      for (let k = 0; k < N; k++) { const a = k * pa; [[Rr, -0.32], [Rt, -0.16], [Rt, 0.16], [Rr, 0.32]].forEach(([rr, o]) => pts.push([rr * Math.cos(a + o * pa), rr * Math.sin(a + o * pa)])); }
      return pts; };
    const PT = (x, y, R, ps) => [x, y + R * Math.sin(ps), -R * Math.cos(ps)];
    v.add(E3.box(9.6, 0.15, 2.4), { color: C.wood, pos: [3.9, -1.62, 0], bias: 1 });
    const pl1 = v.add(E3.box(0.12, 4.0, 1.3), { color: '#9fb4c8', pos: [xp1, 0.45, 0], alpha: 0.28 });
    const pl2 = v.add(E3.box(0.12, 4.0, 1.3), { color: '#9fb4c8', pos: [xp2, 0.45, 0], alpha: 0.28 });
    const hU = xp2 + 0.4 + 0.1, shU = v.add(E3.cyl(rs, hU, 18, 'x'), { color: C.steel, pos: [hU / 2 - 0.1, yU, 0] });
    const hL = xp2 + 0.4 + 0.55, shL = v.add(E3.cyl(rs, hL, 18, 'x'), { color: C.steel, pos: [hL / 2 - 0.55, 0, 0] });
    const pA = v.add(E3.cyl(0.38, 0.14, 24, 'x'), { color: '#c9d0d8', pos: [0, yU, 0] });
    const pD = v.add(E3.cyl(0.38, 0.14, 24, 'x'), { color: '#c9d0d8', pos: [0, 0, 0] });
    v.add(E3.box(0.22, 1.0, 1.0), { color: '#2a323c', pos: [-0.6, 0, 0] });
    const gB = v.add(toX(E3.extrude(gear(RB, 12, 0.1), 0.22)), { color: '#b9c3cd', pos: [xg, yU, 0] });
    const gC = v.add(toX(E3.extrude(gear(RC, 30, 0.1), 0.22)), { color: '#aab6c2', pos: [xg, 0, 0] });
    const arcPts = (x, y, R, a0, a1, n = 24) => [...Array(n + 1).keys()].map(k => PT(x, y, R, a0 + (a1 - a0) * k / n));
    const arcArrow = (O, x, y, R, a0, a1, col, label, lp, al) => {
      const P = arcPts(x, y, R, a0, a1, 24);
      O.push({ k: 'line', p: P.slice(0, 24), color: col, w: 2.6, alpha: al });
      O.push({ k: 'arrow', a: P[22], b: P[24], color: col, w: 2.6, hs: 11, alpha: al });
      if (label) O.push({ k: 'text', t: label, p: lp, color: col, size: 15, alpha: al });
    };
    const def = { dim: 0, lab: 1, twist: 0, anim: 0, ghost: 0, F: 0, tq: 0, arc: 0, sumA: 0, cond: 0, str: 0, fin: 0, giv: 0, plates: 1, back: 0 };
    return {
      def, apply(S, time, v) {
        const g = (25 + 95 * S.ex) * Math.PI / 180 / r.phA, ph = 1 - S.anim * 0.75 * (1 - loop(time, 1.1)), tw = S.twist * ph * g;
        const thA = tw * r.phA, thB = tw * r.phB, thC = -tw * r.phCD;
        pA.rot = [thA, 0, 0]; shU.rot = [thB, 0, 0]; gB.rot = [thB, 0, 0]; gC.rot = [thC, 0, 0]; shL.rot = [thC, 0, 0];
        pl1.alpha = pl2.alpha = 0.28 * S.plates; shU.alpha = shL.alpha = 1 - 0.8 * S.back;
        const fr = 1 - S.back;
        shU.color = mixHex(C.steel, C.tens, S.str * 0.35); shL.color = mixHex(C.steel, C.tens, S.str * 0.9);
        const O = v.ov, R1 = rs + 0.006;
        // yüzey çizgileri: üst şaftta A→B doğrusal, B'nin arkası sabit; alt şaftta D (0) → C
        const lineU = [...Array(25).keys()].map(k => { const x = xg * k / 24; return PT(x, yU, R1, P0 + thA + (thB - thA) * k / 24); });
        lineU.push(PT(xp2 + 0.35, yU, R1, P0 + thB));
        const lineL = [...Array(25).keys()].map(k => { const x = xg * k / 24; return PT(x, 0, R1, P0 + thC * k / 24); });
        lineL.push(PT(xp2 + 0.35, 0, R1, P0 + thC));
        const lw = S.twist > 0.01 ? 2.4 : 1.6;
        if (S.ghost > 0.01 && S.twist > 0.01) {
          O.push({ k: 'line', p: [PT(0, yU, R1, P0), PT(xp2 + 0.35, yU, R1, P0)], color: C.mute, w: 1.2, dash: [5, 5], alpha: S.ghost * 0.9 });
          O.push({ k: 'line', p: [PT(0, 0, R1, P0), PT(xp2 + 0.35, 0, R1, P0)], color: C.mute, w: 1.2, dash: [5, 5], alpha: S.ghost * 0.9 });
        }
        O.push({ k: 'line', p: lineU, color: C.red, w: lw, alpha: 0.95 * fr });
        O.push({ k: 'line', p: lineL, color: C.red, w: lw, alpha: 0.95 * fr });
        // kasnak/dişli işaret çizgileri (yüzlerine)
        const mark = (x, y, R, th, al) => {
          if (S.ghost > 0.01 && S.twist > 0.01) O.push({ k: 'line', p: [[x, y, 0], PT(x, y, R, P0)], color: C.mute, w: 1.4, dash: [4, 4], alpha: al * S.ghost });
          O.push({ k: 'line', p: [[x, y, 0], PT(x, y, R, P0 + th)], color: C.white, w: 2.2, alpha: al });
        };
        mark(-0.08, yU, 0.36, thA, 0.9 * fr); mark(-0.08, 0, 0.36, 0, 0.9 * fr);
        const fx = S.arc > 0.5 || S.F > 0.5 ? xg + 0.13 : xg - 0.13;
        mark(fx, yU, RB * 0.8, thB, (0.6 + 0.4 * S.sumA) * fr); mark(fx, 0, RC * 0.85, thC, (0.6 + 0.4 * S.sumA) * fr);
        // sabit D
        O.push({ k: 'hatch', a: [-0.72, -0.55, 0.5], b: [-0.72, 0.55, 0.5], n: [-0.25, -0.2, 0], color: C.dim, alpha: 0.8 * fr });
        if (S.lab > 0.01) {
          const L = (t, pp, col, al = 1, sz = 15) => O.push({ k: 'text', t, p: pp, color: col || C.white, size: sz, alpha: S.lab * al });
          L('A', [0.15, yU - 0.62, 0.3], null, fr); L('D (sabit)', [-0.6, -0.95, 0], C.dim, fr);
          L('B', [xg, yU + RB + 0.3, 0.75], null, fr); L('C', [xg, -RC - 0.32, 0.3], null, fr);
          L('B', [xg + 0.14, yU + 0.15, 0.95], null, S.back, 18); L('C', [xg + 0.14, -0.35, 1.75], null, S.back, 18);
        }
        if (S.dim > 0.01) {
          const yd = yU + 1.25;
          O.push({ k: 'dim', a: [0, yd - 0.3, 0], b: [xp1, yd - 0.3, 0], off: [0, 0.3, 0], t: '200 mm', alpha: S.dim });
          O.push({ k: 'dim', a: [xp1, yd - 0.3, 0], b: [xg, yd - 0.3, 0], off: [0, 0.3, 0], t: '400 mm', alpha: S.dim });
          O.push({ k: 'dim', a: [xg, yd - 0.3, 0], b: [xp2, yd - 0.3, 0], off: [0, 0.3, 0], t: '150 mm', alpha: S.dim });
          O.push({ k: 'line', p: [[xg - 0.12, yU, 0], PT(xg - 0.12, yU, RB, 3.3)], color: C.dim, w: 1.4, alpha: S.dim });
          O.push({ k: 'text', t: `r_B = ${p.rB} mm`, p: [xg - 0.12, yU + 0.05, 1.25], color: C.dim, size: 13, box: 1, alpha: S.dim });
          O.push({ k: 'line', p: [[xg - 0.12, 0, 0], PT(xg - 0.12, 0, RC, 3.6)], color: C.dim, w: 1.4, alpha: S.dim });
          O.push({ k: 'text', t: `r_C = ${p.rC} mm`, p: PT(xg - 0.12, -0.15, RC + 0.45, 3.6), color: C.dim, size: 13, box: 1, alpha: S.dim });
          O.push({ k: 'text', t: 'L_AB = 600 mm', p: [3, yU + 0.45, 0.4], color: C.dim, size: 13, alpha: S.dim * 0.9 });
          O.push({ k: 'text', t: 'L_CD = 600 mm', p: [3, -0.5, 0.4], color: C.dim, size: 13, alpha: S.dim * 0.9 });
        }
        // torklar
        const tqA = Math.max(S.tq, S.dim);
        if (tqA > 0.01) {
          arcArrow(O, -0.22, yU, 0.6, 3.6, 8.0, C.red, 'T_A', [-0.3, yU + 1.0, 1.2], tqA);
          arcArrow(O, -0.22, 0, 0.6, 3.6, 8.0, C.white, 'T_D', [-0.3, 0.88, 0.6], tqA * 0.9);
        }
        if (S.tq > 0.01) {
          O.push({ k: 'text', t: 'AB şaftında tork: T_A', p: [2.6, yU + 0.55, 0], color: S.str > 0.5 ? mixHex(C.dim, C.tens, 0.4) : C.dim, size: 14, box: 1, alpha: S.tq });
          O.push({ k: 'text', t: `CD şaftında tork: ${f1(r.n)}·T_A`, p: [2.6, -0.6, 0.3], color: S.str > 0.5 ? C.tens : C.dim, size: 14, box: 1, alpha: S.tq });
        }
        if (S.F > 0.01) {
          const yc = yU - RB, xa = xg + 0.14;
          O.push({ k: 'arrow', a: [xa, yc + 0.07, -1.3], b: [xa, yc + 0.07, -0.03], color: C.red, w: 3, label: "F (C, B'yi iter)", lp: [xa, yc + 0.32, -1.25], alpha: S.F });
          O.push({ k: 'arrow', a: [xa, yc - 0.07, 1.3], b: [xa, yc - 0.07, 0.03], color: C.comp, w: 3, label: "F (B, C'yi iter)", lp: [xa, yc - 0.32, 1.25], alpha: S.F });
          O.push({ k: 'line', p: [[xa, yU, 0], [xa, yc, 0]], color: C.red, w: 2, dash: [4, 3], alpha: S.F });
          O.push({ k: 'line', p: [[xa, 0, 0], [xa, yc, 0]], color: C.comp, w: 2, dash: [4, 3], alpha: S.F });
          O.push({ k: 'text', t: `r_B = ${p.rB}`, p: [xa, yU - RB * 0.45, -0.33], color: C.red, size: 13, box: 1, alpha: S.F });
          O.push({ k: 'text', t: `r_C = ${p.rC}`, p: [xa, RC * 0.45, -0.38], color: C.comp, size: 13, box: 1, alpha: S.F });
          O.push({ k: 'text', t: 'T_A = F·r_B', p: [xa, yU + RB + 0.35, -0.2], color: C.red, size: 15, box: 1, alpha: S.F });
          O.push({ k: 'text', t: `T_D = F·r_C = ${f1(r.n)}·T_A`, p: [xa, -RC - 0.3, 0], color: C.comp, size: 15, box: 1, alpha: S.F });
        }
        if (S.arc > 0.01) {
          const xa = xg + 0.14;
          const aB = arcPts(xa, yU, RB, -Math.PI / 2, -Math.PI / 2 + thB), aC = arcPts(xa, 0, RC, Math.PI / 2, Math.PI / 2 + thC);
          O.push({ k: 'line', p: [[xa, yU, 0], ...aB, [xa, yU, 0]], color: C.red, w: 1.4, fill: 'rgba(255,45,32,.22)', alpha: S.arc });
          O.push({ k: 'line', p: [[xa, 0, 0], ...aC, [xa, 0, 0]], color: C.comp, w: 1.4, fill: 'rgba(111,155,209,.22)', alpha: S.arc });
          O.push({ k: 'line', p: aB, color: C.red, w: 5, alpha: S.arc });
          O.push({ k: 'line', p: aC, color: C.comp, w: 5, alpha: S.arc });
          O.push({ k: 'text', t: `φ_B (geniş dilim)\nyay = φ_B·r_B`, p: [xa, yU + 0.55, -1.1], color: C.red, size: 13, box: 1, alpha: S.arc });
          O.push({ k: 'text', t: `φ_C (dar dilim)\nyay = φ_C·r_C`, p: [xa, 0.45, -1.75], color: C.comp, size: 13, box: 1, alpha: S.arc });
          O.push({ k: 'text', t: 'iki yay eşit', p: [xa, yU - RB + 0.05, 1.0], color: C.white, size: 14, box: 1, alpha: S.arc });
        }
        if (S.sumA > 0.01) {
          O.push({ k: 'text', t: 'φ_A = φ_AB + φ_B', p: [-0.2, yU + 1.15, 0.3], color: C.red, size: 15, box: 1, alpha: S.sumA });
          O.push({ k: 'text', t: `φ_B = ${f1(r.n)}·φ_CD`, p: [xg, yU + 1.0, -0.6], color: C.white, size: 14, box: 1, alpha: S.sumA });
          O.push({ k: 'text', t: 'φ_C = φ_CD', p: [xg, -RC - 0.45, -0.9], color: C.white, size: 14, box: 1, alpha: S.sumA });
          O.push({ k: 'text', t: 'φ_D = 0', p: [-0.2, 0.75, 0.6], color: C.dim, size: 14, box: 1, alpha: S.sumA });
        }
        if (S.cond > 0.01) O.push({ k: 'text', t: `φ_A ≤ ${String(p.phd).replace('.', ',')}° = ${f4(r.phi)} rad`, p: [3, yU + 1.6, 0], color: C.red, size: 16, box: 1, alpha: S.cond });
        if (S.str > 0.01 && S.giv < 0.5) O.push({ k: 'text', t: `τ_max = (${f1(r.n)}·T_A)·c / J ≤ ${p.te} MPa\nCD belirler`, p: [3.4, yU + 1.7, 0], color: C.tens, size: 15, box: 1, alpha: S.str });
        if (S.fin > 0.01) {
          O.push({ k: 'text', t: `c = ${f2(r.c)} mm   d = ${f1(r.d)} mm\nT_A = ${f1(r.TAk)} N·m   T_D = ${f1(r.TDk)} N·m`, p: [3.4, yU + 1.6, 0], color: C.white, size: 16, box: 1, alpha: S.fin });
          O.push({ k: 'text', t: `φ_A = ${f2(r.phA * 180 / Math.PI)}°   τ_CD = ${f1(r.tauCD)} MPa`, p: [3.4, -1.3, 0.6], color: C.tens, size: 14, box: 1, alpha: S.fin });
        }
        if (S.giv > 0.01) {
          const ga = r.gov === 'açı';
          O.push({ k: 'text', t: `T_A = ${p.Tg} N·m verilseydi`, p: [3.4, yU + 1.75, 0], color: C.white, size: 15, box: 1, alpha: S.giv });
          O.push({ k: 'text', t: `açı şartı: c = ${f2(r.cAng)} mm` + (ga ? '  ← BÜYÜK' : ''), p: [3.4, yU + 1.15, 0], color: ga ? C.red : C.dim, size: 15, box: 1, alpha: S.giv });
          O.push({ k: 'text', t: `gerilme şartı: c = ${f2(r.cTau)} mm` + (!ga ? '  ← BÜYÜK' : ''), p: [3.4, -1.3, 0.6], color: !ga ? C.red : C.dim, size: 15, box: 1, alpha: S.giv });
        }
      }
    };
  },
  whatif: {
    not: 'Açı sınırını, izin verilen gerilmeyi ve dişli oranını değiştir. Son kaydırıcı, kitaptaki gibi T_A verilseydi iki şartın ayrı ayrı hangi c\'yi istediğini gösterir.',
    s: [{ k: 'phd', ad: 'Açı sınırı φ_A', min: 2, max: 15, step: 0.5, u: '°' }, { k: 'te', ad: 'τ_em', min: 40, max: 150, step: 2, u: 'MPa' },
      { k: 'rC', ad: 'C dişlisi r_C', min: 60, max: 200, step: 5, u: 'mm' }, { k: 'LCD', ad: 'CD şaftı boyu', min: 200, max: 1200, step: 50, u: 'mm' },
      { k: 'Tg', ad: 'Verilen T_A (kitap tipi)', min: 20, max: 2000, step: 10, u: 'N·m' }],
    out: (p, r) => {
      const mx = Math.max(r.cAng, r.cTau) * 1.1;
      return `<div class="mets"><div class="m"><small>Oran n = r_C/r_B</small><b>${f2(r.n)}</b></div><div class="m red"><small>c (iki şart birlikte)</small><b>${f2(r.c)} mm</b></div><div class="m"><small>d</small><b>${f1(r.d)} mm</b></div><div class="m red"><small>T_A</small><b>${f1(r.TAk)} N·m</b></div></div>
      <p class="note">T_A = ${p.Tg} N·m verilseydi her şartın istediği c:</p>
      <div class="bars"><div class="bar ${r.gov === 'açı' ? 'gov' : ''}"><span>Açı şartı</span><i style="width:${r.cAng / mx * 100}%"></i><b>${f2(r.cAng)} mm</b></div>
      <div class="bar ${r.gov === 'gerilme' ? 'gov' : ''}"><span>Gerilme şartı</span><i style="width:${r.cTau / mx * 100}%"></i><b>${f2(r.cTau)} mm</b></div></div>
      <p class="note">Kırmızı belirleyici: c = ${f2(r.cReq)} mm (büyüğü; ikisini de sağlar). Verilen T_A, ${f1(r.TAk)} N·m'den küçükse açı şartı, büyükse gerilme şartı belirler.</p>`;
    }
  },
  kagit: (p, r) => `φ_A = ${String(p.phd).replace('.', ',')}° · π/180 = ${f4(r.phi)} rad
Dişli (temas kuvveti ortak):  F·${p.rB} = T_A ,  F·${p.rC} = T_D  →  T_D = ${f2(r.n)}·T_A
Temas (yaylar eşit):  φ_B·r_B = φ_CD·r_C  →  φ_B = ${f2(r.n)}·φ_CD
φ_A = φ_AB + φ_B = T_A·${p.LAB}/(JG) + ${f2(r.n)}·(${f2(r.n)}·T_A)·${p.LCD}/(JG) = ${fmt(r.K, 0)}·T_A/(JG)
Açı şartı:  T_A = ${f4(r.phi)}·J·${fmt(r.Gm, 0)}/${fmt(r.K, 0)} ,  J = πc⁴/2  →  T_A = ${f3(r.kA)}·c⁴
Gerilme (CD, tork ${f2(r.n)}·T_A):  ${p.te} = ${f2(r.n)}·T_A·c/J  →  T_A = ${f2(r.kS)}·c³
Eşitle:  ${f3(r.kA)}·c⁴ = ${f2(r.kS)}·c³  →  c = ${f2(r.c)} mm ,  d = ${f2(r.d)} mm
T_A = ${f2(r.kS)}·${f2(r.c)}³ = ${fmt(r.TA, 0)} N·mm = ${f1(r.TAk)} N·m   (T_D = ${f1(r.TDk)} N·m)`,
  tuzak: ['<b>Dereceyle hesaplamak.</b> 7,5° → 0,1309 rad. φ = TL/(JG) radyan verir.',
    '<b>φ_B\'yi unutmak.</b> A\'nın dönmesi yalnız AB\'nin burulması değil; B de dönüyor. φ_A = φ_AB + φ_B.',
    '<b>n\'yi bir kez yazmak.</b> CD\'nin torku n·T_A, B\'nin açısı n·φ_CD: alt şaftın katkısı n² = 6,25 kat. 7,25 = 1 + 6,25.',
    '<b>Oranı ters kurmak.</b> Tork büyük dişlide büyür (T_D = 2,5·T_A); açı küçük dişlide büyür (φ_B = 2,5·φ_C).',
    '<b>Gerilmeyi AB\'de kontrol etmek.</b> Aynı çaplı şaftlarda torku büyük olan CD belirler.',
    '<b>c ile d\'yi karıştırmak.</b> J = πc⁴/2 ve τ = Tc/J yarıçapla; cevap çap: d = 2c.',
    '<b>150 mm\'yi boya eklemek.</b> B\'nin arkasındaki uçtan tork geçmiyor; L_AB = 200 + 400 = 600 mm.'],
  gen() {
    const V = VIZE.find(x => x.id === 'v4');
    for (let i = 0; i < 60; i++) {
      const rB = rnd(30, 80, 5), p = { LAB: rnd(300, 900, 50), LCD: rnd(300, 900, 50), rB, rC: rB * pick([1.5, 2, 2.5, 3]), G: pick([77, 80]), te: rnd(50, 110, 5), phd: rnd(3, 10, 0.5), Tg: 200 };
      const d = V.solve(p).d; if (d >= 18 && d <= 60) return p;
    }
    return Object.assign({}, V.p0);
  },
  pracText: p => `Dişli–şaft sistemi: A kasnağı üst şaftta, B dişlisinden ${p.LAB} mm uzakta (r_B = ${p.rB} mm). Alt şaftta D kasnağı sabit, C dişlisine uzaklığı ${p.LCD} mm (r_C = ${p.rC} mm). İki şaft aynı çaplı, G = ${p.G} GPa, τ_em = ${p.te} MPa. A'nın dönmesi ${String(p.phd).replace('.', ',')}°'yi aşmayacak. İki şart aynı anda sınırdayken şaft çapı d ve T_A kaç?`,
  ans: [{ k: 'd', ad: 'Şaft çapı d', u: 'mm', tol: 0.02 }, { k: 'TAk', ad: 'T_A', u: 'N·m', tol: 0.03 }],
  hints: (p, r) => [`n = r_C/r_B = ${f2(r.n)}. T_CD = n·T_A, φ_B = n·φ_CD. φ'yi radyana çevir: ${f4(r.phi)} rad.`,
    `φ_A = T_A·(L_AB + n²·L_CD)/(JG) = T_A·${fmt(r.K, 0)}/(JG). J = πc⁴/2 → açı şartı T_A = ${f3(r.kA)}·c⁴.`,
    `Gerilme CD'de: ${p.te} = n·T_A·c/J → T_A = ${f2(r.kS)}·c³. Eşitle: c = ${f2(r.c)} mm; d = 2c.`],
  diag(p, r, u) {
    const near = (a, b) => isFinite(a) && Math.abs(a - b) <= Math.abs(b) * 0.025;
    const cOf = (K, nS, ph) => p.te * K / (nS * ph * r.Gm);
    const TOf = c => p.te * Math.PI * Math.pow(c, 3) / (2 * r.n) / 1000;
    const n = r.n, cases = [
      [cOf(r.K, n, p.phd), 'Açıyı derece olarak koymuşsun. φ = ' + String(p.phd).replace('.', ',') + '·π/180 rad.'],
      [cOf(p.LAB + n * p.LCD, n, r.phi), 'Alt şaftın katkısında n\'yi bir kez yazmışsın. Tork da açı da n ile çarpılır: n²·L_CD.'],
      [cOf(n * n * p.LCD, n, r.phi), 'φ_AB\'yi unutmuşsun: A, B\'den fazla döner, AB şaftı da burulur.'],
      [cOf(p.LAB + n * n * p.LCD, 1, r.phi), 'Gerilmeyi T_A ile yazmışsın; en büyük tork CD\'de: n·T_A.'],
      [cOf(p.LAB + p.LCD / (n * n), n, r.phi), 'Dişli oranını ters kurmuşsun: φ_B = (r_C/r_B)·φ_C, küçük dişli daha çok döner.']];
    for (const [c, msg] of cases) { if (near(u.d, 2 * c) || near(u.TAk, TOf(c))) return msg; }
    if (near(u.d, r.c)) return 'Yarıçapı yazmışsın; istenen çap d = 2c.';
    if (near(u.TAk, r.TAk * 1000) || near(u.TAk, r.TAk / 1000)) return 'Birim: T_A N·mm çıkar, 1000\'e bölünce N·m.';
    if (near(u.TAk, r.TDk)) return 'Bu T_D (alt şaftın torku). İstenen T_A = T_D/n.';
    if (near(u.TAk, p.te * Math.PI * Math.pow(r.d, 3) / (2 * n) / 1000)) return 'T_A\'yı d ile hesaplamışsın; formülde c (yarıçap) var.';
    return 'Sıra: n → φ (rad) → φ_A = T_A·(L_AB + n²L_CD)/(JG) → T_A = (sayı)·c⁴ ve T_A = (sayı)·c³ → eşitle.';
  },
  hoca: `<p>Hocanın cevap anahtarı: φ<sub>A</sub> = 7,5·π/180 = 0,13 rad; F·50 = T<sub>A</sub>, F·125 = T<sub>D</sub> → T<sub>D</sub> = 2,5·T<sub>A</sub>; φ<sub>B</sub>·r<sub>B</sub> = φ<sub>CD</sub>·r<sub>C</sub> → φ<sub>B</sub> = 2,5·φ<sub>CD</sub>; φ<sub>A</sub> = φ<sub>AB</sub> + φ<sub>B</sub> → 0,13 = 7,25·600·T<sub>A</sub>/(J·G); τ<sub>em</sub> = 84 = 2,5·T<sub>A</sub>·c/J; iki T<sub>A</sub> ifadesini eşitleyerek <b>c = 14,6 mm, d = 29,2 mm</b>. (Her adım 5 puan.)</p>
  <p>Bizim sonuç: <b>c = 14,50 mm, d = 29,0 mm, T<sub>A</sub> = 160,9 N·m</b> (T<sub>D</sub> = 402 N·m). Yol birebir aynı. Fark yalnızca <b>yuvarlamadan</b>: hoca 0,1309 rad\'ı 0,13 yazmış; c bu sayıyla ters orantılı olduğu için %0,7 büyük çıkıyor (14,60). Hoca T<sub>A</sub>\'nın sayısını yazmamış, formülde bırakmış; kendi c\'siyle T<sub>A</sub> = 84·π·14,6³/5 ≈ 164 N·m çıkar (T<sub>A</sub>, c³ ile orantılı, fark %2). Sınavda T<sub>A</sub>\'yı da sayıyla yaz.</p>
  <p>Şaft boyları: hocanın her iki şaft için aldığı 600 mm şekle uyuyor (A–ön plaka 200 + plaka–B 400; D, A ile, C de B ile aynı hizada). 150 mm, B\'nin arkasındaki tork taşımayan uç.</p>`
});
