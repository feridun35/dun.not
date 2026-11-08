'use strict';
/* ============ VİZE 9 · 2018–19 Güz · Soru 1 ============ */
VIZE.push({
  id: 'v9', no: 9, kod: 'V9', vize: true, tip: 'po',
  src: '2018–19 Güz vizesi · Soru 1',
  img: 'img/v9.png', cevapImg: 'img/v9_cevap.png',
  ad: 'Pirinç + çelik basamaklı çubuk: gerilme, boy ve çap değişimi',
  ozet: 'Duvara bağlı iki parçalı çubuk ucundan çekiliyor. İki parçada kuvvet aynı, alan farklı. Sonra Hooke ile boy değişimi, Poisson ile çap değişimi.',
  soru: 'Kâğıdın başında "Gerekli Formüller" satırı var: φ = TL/(JG), τ<sub>maks</sub> = Tc/J, J = ½πc⁴, σ = E·ε, A = πd²/4, δ = α·ΔT·L, P = T·ω, ω = πn/30. (Bu soruda işe yarayanlar: <b>σ = E·ε</b> ve <b>A = πd²/4</b>. Poisson oranının tanımı ν = −ε<sub>y</sub>/ε<sub>x</sub> listede yok, bilmen gerekiyor.)<br><br>Şekilde gösterilen pirinç ve çelik çubuklar P = 5000 N kuvvet ile çekilmektedir. Pirinç çubuğun çapı d = 30 mm, elastisite modülü E = 110 GPa, Poisson oranı ν = 0,34\'tür. Çelik çubuğun çapı d = 20 mm, elastisite modülü E = 210 GPa, Poisson oranı ν = 0,30\'dur. (a) Çubuklardaki gerilmeleri (MPa) bulunuz. (5 puan) (b) Çubuk boylarındaki değişimi (ΔL, mm) bulunuz. (7,5 puan) (c) Çubuk çaplarındaki değişimi (ΔD, mm) bulunuz. (7,5 puan)',
  verilen: ['A ucu duvara bağlı (ankastre), C ucunda P = 5000 N çekme', 'Pirinç AB: L = 1,2 m, d = 30 mm, E = 110 GPa, ν = 0,34', 'Çelik BC: L = 0,8 m, d = 20 mm, E = 210 GPa, ν = 0,30'],
  istenen: '(a) σ<sub>pirinç</sub>, σ<sub>çelik</sub> · (b) ΔL<sub>pirinç</sub>, ΔL<sub>çelik</sub> · (c) ΔD<sub>pirinç</sub>, ΔD<sub>çelik</sub>',
  p0: { P: 5000, Lp: 1.2, dp: 30, Ep: 110, np: 0.34, Lc: 0.8, dc: 20, Ec: 210, nc: 0.30 },
  solve(p) {
    const Ap = Math.PI * p.dp * p.dp / 4, Ac = Math.PI * p.dc * p.dc / 4;
    const sp = p.P / Ap, sc = p.P / Ac;                       // MPa (N/mm²)
    const exp = sp / (p.Ep * 1000), exc = sc / (p.Ec * 1000); // boyuna birim uzama
    const dLp = exp * p.Lp * 1000, dLc = exc * p.Lc * 1000;   // mm
    const eyp = -p.np * exp, eyc = -p.nc * exc;               // enine birim uzama (eksi: incelir)
    const dDp = eyp * p.dp, dDc = eyc * p.dc;                 // mm
    return { Ap, Ac, sp, sc, exp, exc, dLp, dLc, dLt: dLp + dLc, eyp, eyc, dDp, dDc, dp1: p.dp + dDp, dc1: p.dc + dDc };
  },
  anlam: [
    ['pirinç ve çelik çubuklar … çekilmektedir', 'İki parça uç uca, <b>seri</b> bağlı. Aynı kuvvet ikisinden de geçer: N = P = 5000 N.'],
    ['A ucu duvarda', 'Duvar tutar, çubuğu sola doğru 5000 N ile çeker. Statikçe belirli: tek bilinmeyen var, ΣF<sub>x</sub> = 0 yeter.'],
    ['çapı d = 30 mm / d = 20 mm', 'Alanlar farklı: A = πd²/4. İnce parçada aynı kuvvet daha küçük alana biner, <b>gerilme büyür</b>.'],
    ['elastisite modülü E', 'Malzemenin sertliği. σ = E·ε ile gerilmeden birim uzamaya geçersin. GPa\'yı MPa yap: 110 GPa = 110 000 MPa.'],
    ['Poisson oranı ν', 'Boyuna uzayan çubuk enine daralır. Enine birim uzama ε<sub>y</sub> = −ν·ε<sub>x</sub>.'],
    ['çaplarındaki değişimi', 'ΔD = ε<sub>y</sub>·D. Çekmede ε<sub>y</sub> eksi, yani çap <b>küçülür</b>: ΔD eksi çıkmalı.']
  ],
  tetik: ['Poisson oranı', 'çap değişimi', 'boy değişimi ΔL', 'elastisite modülü', 'iki malzeme uç uca'],
  tetikNot: 'Soruda ν verilmiş ve "çap değişimi" isteniyorsa yol hep aynı: σ = F/A → ε = σ/E → ΔL = ε·L → ε<sub>enine</sub> = −ν·ε → ΔD = ε<sub>enine</sub>·D. Uç uca bağlı parçalarda her parçayı kendi A, E, ν, L\'siyle ayrı hesapla.',
  zincir: [
    ['Her parçada kuvvet ne?', 'Çubuğu herhangi bir yerden kes, sağ tarafa bak: yalnız P var. Demek ki <b>her kesitte N = P</b>.'],
    ['Gerilme neden farklı?', 'Kuvvet aynı, alan farklı. σ = N/A; ince çelikte alan küçük, gerilme büyük.'],
    ['Boy değişimi nereden?', 'Hooke: ε = σ/E, sonra ΔL = ε·L. Ya da tek seferde ΔL = PL/(AE).'],
    ['Çap neden değişir?', 'Çekilen malzeme boyuna uzarken yandan daralır. Oranı ν: ε<sub>y</sub> = −ν·ε<sub>x</sub>.'],
    ['ΔD işareti ne?', 'Çekmede ε<sub>x</sub> artı, ε<sub>y</sub> eksi → ΔD = ε<sub>y</sub>·D <b>eksi</b>: çap küçülür.']
  ],
  cam: { yaw: -0.24, pitch: 0.14, dist: 10.5, t: [3.4, -0.2, 0] },
  steps: [
    { t: 'Şekle bak', st: { lab: 1, dim: 1, load: 1 },
      h: (p) => `Sol uç (A) duvara bağlı. A'dan B'ye kalın <b>pirinç</b> (${f2(p.Lp)} m, Ø${p.dp} mm), B'den C'ye ince <b>çelik</b> (${f2(p.Lc)} m, Ø${p.dc} mm). C ucundan ${fmt(p.P, 0)} N sağa çekiliyor. Çubuk sadece çekiliyor; eğilme, burulma yok.`,
      why: 'Bu soruda iki malzeme, iki çap, iki boy var. Her şeyi iki kez hesaplayacaksın; karıştırmamak için baştan bir tablo kur: pirinç sütunu, çelik sütunu.' },
    { t: 'İç kuvvet: her kesitte N = P', st: { lab: 0.6, load: 1, cut: 1 },
      h: (p) => `Çubuğu pirinçte bir yerden, çelikte bir yerden hayalen kes. Kesimin <b>sağındaki</b> parçaya bak: üstünde yalnızca P var. Dengede kalması için kesitteki iç kuvvet de ${fmt(p.P, 0)} N olmalı (sola doğru). İki parçada da aynı: N = P.`,
      f: (p) => `ΣF<sub>x</sub> = 0 → N<sub>pirinç</sub> = N<sub>çelik</sub> = P = ${fmt(p.P, 0)} N (çekme)`,
      why: 'Sağ parçayı seçmek akıllıca, çünkü üstünde bilinen tek kuvvet (P) var. Sol parçayı seçseydin duvarın tepkisi gelirdi; o da ΣF_x = 0\'dan P çıkar, sonuç aynı.' },
    { t: '(a) Aynı kuvvet, farklı alan → farklı gerilme', st: { lab: 0.6, load: 1, sec: 1, colr: 1 },
      h: (p, r) => `Gerilme, kuvvetin alana bölünmesi. Kesitler gösterildi: pirinç ${f1(r.Ap)} mm², çelik ${f1(r.Ac)} mm². Çelik daha ince, aynı ${fmt(p.P, 0)} N daha küçük alana biniyor: gerilmesi daha büyük (rengi daha koyu kırmızı).`,
      f: (p, r) => `A<sub>p</sub> = π·${p.dp}²/4 = ${f1(r.Ap)} mm² → σ<sub>p</sub> = ${fmt(p.P, 0)} / ${f1(r.Ap)} = <b>${f2(r.sp)} MPa</b><br>A<sub>ç</sub> = π·${p.dc}²/4 = ${f1(r.Ac)} mm² → σ<sub>ç</sub> = ${fmt(p.P, 0)} / ${f1(r.Ac)} = <b>${f2(r.sc)} MPa</b>`,
      why: 'Çap 30 mm yerine 20 mm olunca alan bu oranın KARESİ kadar küçülür: (30/20)² = 2,25. Gerilme de aynı oranda büyür: 15,92 / 7,07 = 2,25.' },
    { t: '(b) Hooke: her parça kendi boyunda uzar', st: { lab: 0.6, load: 1, colr: 1, def: 1, anim: 1, dl: 1 },
      h: (p, r) => `σ = E·ε'den birim uzama ε = σ/E; boy değişimi ΔL = ε·L. Animasyonda uzama binlerce kat abartıldı. Kesikli çizgiler B ve C'nin ilk yeri: B sadece pirincin uzaması kadar, C iki uzamanın toplamı kadar sağa gider.`,
      f: (p, r) => `ΔL<sub>p</sub> = PL/(AE) = ${fmt(p.P, 0)} · ${fmt(p.Lp * 1000, 0)} / (${f1(r.Ap)} · ${fmt(p.Ep * 1000, 0)}) = <b>${f4(r.dLp)} mm</b><br>ΔL<sub>ç</sub> = ${fmt(p.P, 0)} · ${fmt(p.Lc * 1000, 0)} / (${f1(r.Ac)} · ${fmt(p.Ec * 1000, 0)}) = <b>${f4(r.dLc)} mm</b><br>C ucunun toplam yer değiştirmesi: ${f4(r.dLt)} mm`,
      why: 'ΔL = PL/(AE) yeni bir formül değil: σ = P/A, ε = σ/E, ΔL = ε·L üçünü birleştirince çıkıyor. Birimler: P (N), L (mm), A (mm²), E (MPa = N/mm²) → ΔL mm. L\'yi metre bırakırsan sonuç 1000 kat küçük çıkar.' },
    { t: '(c) Poisson: uzayan çubuk incelir', st: { lab: 0, load: 0, colr: 0.4, def: 1, anim: 1, el: 1 }, cam: { yaw: -0.1, pitch: 0.08, dist: 7, t: [1.9, 0, 0] },
      h: (p, r) => `Pirincin yüzeyine küçük bir kare çizdik. Çekince kare boyuna uzar (ε<sub>x</sub> artı) ama enine kısalır (ε<sub>y</sub> eksi). İkisinin oranı malzemenin Poisson oranı: ε<sub>y</sub> = −ν·ε<sub>x</sub>. Kesikli kare ilk hali.`,
      f: (p, r) => `ε<sub>x,p</sub> = σ<sub>p</sub>/E<sub>p</sub> = ${f2(r.sp)} / ${fmt(p.Ep * 1000, 0)} = ${sci(r.exp)}<br>ε<sub>y,p</sub> = −ν·ε<sub>x,p</sub> = −${f2(p.np)} · ${sci(r.exp)} = <b>${sci(r.eyp).replace('-', '−')}</b>`,
      why: 'Neden incelir? Malzemenin atomları boyuna çekilince aralarındaki bağlar yan taraftan da toplanır; hacim neredeyse korunmaya çalışır. ν, "boyuna 1 birim uzarsam enine kaç birim daralırım" sorusunun cevabı. Metallerde 0,25–0,35 arası.' },
    { t: '(c) Çap değişimi: ΔD = −ν·ε·D', st: { lab: 0.6, load: 0, colr: 0.4, def: 1, dia: 1 }, cam: { yaw: -0.08, pitch: 0.06, dist: 7.2, t: [3.7, 0, 0] },
      h: (p, r) => `Enine birim uzamayı çapla çarp. Kesikli çizgiler ilk çaplar: iki parça da daraldı (çizimde çok abartılı). İşaret <b>eksi</b>: çekilen çubuğun çapı küçülür.`,
      f: (p, r) => `ΔD<sub>p</sub> = ε<sub>y,p</sub>·D<sub>p</sub> = ${sci(r.eyp).replace('-', '−')} · ${p.dp} = <b>${sci(r.dDp).replace('-', '−')} mm</b><br>ε<sub>x,ç</sub> = ${f2(r.sc)} / ${fmt(p.Ec * 1000, 0)} = ${sci(r.exc)}, ε<sub>y,ç</sub> = −${f2(p.nc)} · ${sci(r.exc)} = ${sci(r.eyc).replace('-', '−')}<br>ΔD<sub>ç</sub> = ${sci(r.eyc).replace('-', '−')} · ${p.dc} = <b>${sci(r.dDc).replace('-', '−')} mm</b>`,
      why: 'Çap değişimi binde bir mikrometre mertebesinde; gözle göremezsin ama hassas yataklarda, sıkı geçmelerde önemlidir. Sınavda kontrol: |ΔD/D| = ν·|ΔL/L| olmalı.' },
    { t: 'Özet: iki parçanın karnesi', st: { lab: 1, load: 1, colr: 1, def: 1, sum: 1 },
      h: (p, r) => `Kuvvet her yerde aynı (${fmt(p.P, 0)} N). İnce ve sert çelikte gerilme ${f2(r.sc / r.sp)} kat büyük; E\'si de büyük olduğu için birim uzaması sadece ${f2(r.exc / r.exp)} kat büyük. Pirinç daha uzun olduğu için toplam uzamanın büyük kısmı pirinçte.`,
      f: (p, r) => `Pirinç: σ = ${f2(r.sp)} MPa, ΔL = ${f4(r.dLp)} mm, ΔD = ${sci(r.dDp).replace('-', '−')} mm<br>Çelik: σ = ${f2(r.sc)} MPa, ΔL = ${f4(r.dLc)} mm, ΔD = ${sci(r.dDc).replace('-', '−')} mm` }
  ],
  scene(v, p, r) {
    const U = 3, Lp = p.Lp * U, Lc = p.Lc * U, rp = p.dp * 0.015, rc = p.dc * 0.015;
    const M = 0.3 / r.exp, RB = 2.5; // çizim abartması: boy M kat, çap ayrıca RB kat
    const SUP = { '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹', '−': '⁻' };
    const sc = x => sci(x).replace(/^-/, '−').replace(/<sup>(.*?)<\/sup>/, (m, e) => [...e].map(c => SUP[c] || c).join(''));
    const BR = '#c9a35e';
    v.add(E3.box(0.5, 2.6, 2.4), { color: '#2a323c', pos: [-0.25, 0, 0], bias: 0.5 });
    const segP = v.add(E3.cyl(rp, Lp, 36, 'x'), { color: BR, pos: [Lp / 2, 0, 0] });
    const segC = v.add(E3.cyl(rc, Lc, 30, 'x'), { color: C.steel, pos: [Lp + Lc / 2, 0, 0] });
    const def = { lab: 0, dim: 0, load: 1, cut: 0, sec: 0, colr: 0, def: 0, anim: 0, dl: 0, el: 0, dia: 0, sum: 0 };
    const disc = (x, rr) => { const P = []; for (let i = 0; i <= 36; i++) { const a = 2 * Math.PI * i / 36; P.push([x, rr * Math.cos(a), rr * Math.sin(a)]); } return P; };
    return {
      def, apply(S, time, v) {
        const k = S.def * ((1 - S.anim) + S.anim * loop(time, 1.1)) * S.ex;
        const exV = r.exp * M * k, ecV = r.exc * M * k;
        const sxp = 1 + exV, sxc = 1 + ecV, srp = 1 - p.np * exV * RB, src = 1 - p.nc * ecV * RB;
        const xB = Lp * sxp, xC = xB + Lc * sxc, Rp = rp * srp, Rc = rc * src;
        segP.scl = [sxp, srp, srp]; segP.pos = [xB / 2, 0, 0];
        segC.scl = [sxc, src, src]; segC.pos = [xB + Lc * sxc / 2, 0, 0];
        const sMax = Math.max(r.sp, r.sc);
        segP.color = mixHex(BR, C.tens, S.colr * 0.75 * r.sp / sMax);
        segC.color = mixHex(C.steel, C.tens, S.colr * 0.95 * r.sc / sMax);
        const O = v.ov;
        O.push({ k: 'hatch', a: [-0.5, -1.3, 1.2], b: [-0.5, 1.3, 1.2], n: [-0.3, -0.25, 0], color: C.mute });
        // yük
        O.push({ k: 'arrow', a: [xC + 0.1, 0, 0], b: [xC + 1.7, 0, 0], color: C.red, w: 3, label: `P = ${fmt(p.P, 0)} N`, lp: [xC + 1.0, 0.55, 0], alpha: S.load });
        // etiketler
        if (S.lab > 0.01) {
          [['A', -0.05, rp + 0.45], ['B', xB, rp + 0.45], ['C', xC + 0.05, rc + 0.45]].forEach(([t, x, y]) => O.push({ k: 'text', t, p: [x, y, 0], size: 16, alpha: S.lab }));
          O.push({ k: 'text', t: `Pirinç Ø${p.dp}`, p: [xB / 2, rp + 0.75, 0], color: BR, size: 14, alpha: S.lab * (1 - S.sec) * (1 - S.sum) * (1 - S.dl) * (1 - S.dia) });
          O.push({ k: 'text', t: `Çelik Ø${p.dc}`, p: [xB + Lc * sxc / 2, rc + 0.75, 0], color: C.dim, size: 14, alpha: S.lab * (1 - S.sec) * (1 - S.sum) * (1 - S.dl) });
        }
        O.push({ k: 'dim', a: [0, -rp, 0], b: [Lp, -rp, 0], off: [0, -0.75, 0], t: `${f2(p.Lp)} m`, alpha: S.dim });
        O.push({ k: 'dim', a: [Lp, -rp, 0], b: [Lp + Lc, -rp, 0], off: [0, -0.75, 0], t: `${f2(p.Lc)} m`, alpha: S.dim });
        // kesim: iç kuvvet
        if (S.cut > 0.01) {
          [[xB * 0.55, Rp], [xB + Lc * sxc * 0.5, Rc]].forEach(([x, rr], i) => {
            O.push({ k: 'ring', c: [x, 0, 0], r: rr + 0.12, u: [0, 1, 0], v: [0, 0, 1], color: C.white, w: 2, dash: [5, 4], alpha: S.cut });
            O.push({ k: 'arrow', a: [x + 0.05, -rr - 0.55, 0], b: [x - 1.05, -rr - 0.55, 0], color: C.white, w: 2.4, label: `N = ${fmt(p.P, 0)} N`, lp: [x - 0.5, -rr - 0.95, 0], alpha: S.cut });
          });
          O.push({ k: 'text', t: 'Hayali kesim: sağ tarafta yalnız P var\n→ kesitteki iç kuvvet N = P', p: [xB * 0.6, rp + 1.3, 0], color: C.white, size: 14, box: 1, alpha: S.cut });
        }
        // kesit alanları ve gerilme
        if (S.sec > 0.01) {
          [[xB * 0.5, Rp, r.Ap, r.sp, 'PİRİNÇ'], [xB + Lc * sxc * 0.5, Rc, r.Ac, r.sc, 'ÇELİK']].forEach(([x, rr, A, s, nm]) => {
            O.push({ k: 'line', p: disc(x, rr + 0.02), color: C.white, w: 1.6, fill: 'rgba(255,74,61,0.35)', alpha: S.sec });
            O.push({ k: 'text', t: `${nm}\nA = ${f1(A)} mm²\nσ = ${f2(s)} MPa`, p: [x, rp + 1.05, 0], color: C.tens, size: 14, box: 1, alpha: S.sec });
          });
        }
        // boy değişimi
        if (S.dl > 0.01) {
          [[Lp, rp], [Lp + Lc, rc]].forEach(([x, rr]) => O.push({ k: 'line', p: [[x, -rp - 0.5, 0], [x, rp + 0.5, 0]], dash: [5, 4], color: C.mute, w: 1.3, alpha: S.dl }));
          O.push({ k: 'arrow', a: [Lp, -rp - 0.35, 0], b: [Math.max(xB, Lp + 0.05), -rp - 0.35, 0], color: C.tens, w: 2, hs: 8, alpha: S.dl * Math.min(1, (xB - Lp) * 4) });
          O.push({ k: 'arrow', a: [Lp + Lc, -rp - 0.35, 0], b: [Math.max(xC, Lp + Lc + 0.05), -rp - 0.35, 0], color: C.tens, w: 2, hs: 8, alpha: S.dl * Math.min(1, (xC - Lp - Lc) * 4) });
          O.push({ k: 'text', t: `B: ΔL pirinç = ${f4(r.dLp)} mm`, p: [Lp, -rp - 0.95, 0], color: C.tens, size: 14, box: 1, alpha: S.dl });
          O.push({ k: 'text', t: `C: ΔL pirinç + ΔL çelik = ${f4(r.dLt)} mm`, p: [Lp + Lc + 0.4, -rp - 1.45, 0], color: C.tens, size: 14, box: 1, alpha: S.dl });
          O.push({ k: 'text', t: 'uzama binlerce kat abartılı', p: [Lp / 2, rp + 1.0, 0], color: C.mute, size: 13, alpha: S.dl });
        }
        // Poisson elemanı (pirinç ön yüzü)
        if (S.el > 0.01) {
          const xe0 = Lp / 2, a = 0.7, xe = xe0 * sxp, ax = a * sxp, ay = a * srp, z0 = rp + 0.01, z1 = Rp + 0.01;
          const zf = (y, R) => Math.sqrt(Math.max(0, R * R - y * y)) + 0.01;
          const sq = (cx, w, hgt, R) => [[cx - w / 2, -hgt / 2, zf(hgt / 2, R)], [cx + w / 2, -hgt / 2, zf(hgt / 2, R)], [cx + w / 2, hgt / 2, zf(hgt / 2, R)], [cx - w / 2, hgt / 2, zf(hgt / 2, R)], [cx - w / 2, -hgt / 2, zf(hgt / 2, R)]];
          O.push({ k: 'line', p: sq(xe0, a, a, rp), dash: [5, 4], color: C.white, w: 1.5, alpha: S.el * 0.9 });
          O.push({ k: 'line', p: sq(xe, ax, ay, Rp), color: C.tens, w: 2.4, fill: 'rgba(255,74,61,0.18)', alpha: S.el });
          O.push({ k: 'arrow', a: [xe + ax / 2 + 0.05, 0, z1], b: [xe + ax / 2 + 0.6, 0, z1], color: C.tens, w: 2.2, hs: 9, alpha: S.el });
          O.push({ k: 'arrow', a: [xe - ax / 2 - 0.05, 0, z1], b: [xe - ax / 2 - 0.6, 0, z1], color: C.tens, w: 2.2, hs: 9, alpha: S.el });
          O.push({ k: 'arrow', a: [xe, ay / 2 + 0.75, z1], b: [xe, ay / 2 + 0.08, z1], color: C.comp, w: 2.2, hs: 9, alpha: S.el });
          O.push({ k: 'arrow', a: [xe, -ay / 2 - 0.75, z1], b: [xe, -ay / 2 - 0.08, z1], color: C.comp, w: 2.2, hs: 9, alpha: S.el });
          O.push({ k: 'text', t: `boyuna uzar\nε_x = ${sc(r.exp)}`, p: [xe + ax / 2 + 1.0, -0.85, z1], color: C.tens, size: 14, box: 1, alpha: S.el });
          O.push({ k: 'text', t: `enine daralır\nε_y = −ν·ε_x = ${sc(r.eyp)}`, p: [xe, ay / 2 + 1.25, z1], color: C.comp, size: 14, box: 1, alpha: S.el });
          O.push({ k: 'text', t: 'çap daralması ayrıca abartıldı', p: [xe, -rp - 0.85, z1], color: C.mute, size: 13, alpha: S.el });
        }
        // çap değişimi
        if (S.dia > 0.01) {
          [[0, xB, rp, Rp], [xB, xC, rc, Rc]].forEach(([x0, x1, r0, r1]) => {
            [1, -1].forEach(sg => O.push({ k: 'line', p: [[x0, sg * r0, 0], [x1, sg * r0, 0]], dash: [5, 4], color: C.white, w: 1.3, alpha: S.dia * 0.85 }));
          });
          const xm = xB - 0.9, xn = xB + 0.9;
          O.push({ k: 'arrow', a: [xm, rp + 0.55, 0], b: [xm, Rp + 0.03, 0], color: C.comp, w: 2.2, hs: 8, alpha: S.dia });
          O.push({ k: 'arrow', a: [xm, -rp - 0.55, 0], b: [xm, -Rp - 0.03, 0], color: C.comp, w: 2.2, hs: 8, alpha: S.dia });
          O.push({ k: 'arrow', a: [xn, rc + 0.55, 0], b: [xn, Rc + 0.03, 0], color: C.comp, w: 2.2, hs: 8, alpha: S.dia });
          O.push({ k: 'arrow', a: [xn, -rc - 0.55, 0], b: [xn, -Rc - 0.03, 0], color: C.comp, w: 2.2, hs: 8, alpha: S.dia });
          O.push({ k: 'text', t: `ΔD pirinç = ${sc(r.dDp)} mm`, p: [xm - 0.2, rp + 0.95, 0], color: C.comp, size: 14, box: 1, alpha: S.dia });
          O.push({ k: 'text', t: `ΔD çelik = ${sc(r.dDc)} mm`, p: [xn + 0.3, -rc - 0.95, 0], color: C.comp, size: 14, box: 1, alpha: S.dia });
          O.push({ k: 'text', t: 'kesikli: ilk çap · eksi = çap küçülür', p: [xB, -rp - 1.6, 0], color: C.mute, size: 13, alpha: S.dia });
        }
        // özet
        if (S.sum > 0.01) {
          O.push({ k: 'text', t: `PİRİNÇ\nσ = ${f2(r.sp)} MPa\nΔL = ${f4(r.dLp)} mm\nΔD = ${sc(r.dDp)} mm`, p: [xB / 2, rp + 1.45, 0], color: C.white, size: 14, box: 1, alpha: S.sum });
          O.push({ k: 'text', t: `ÇELİK\nσ = ${f2(r.sc)} MPa\nΔL = ${f4(r.dLc)} mm\nΔD = ${sc(r.dDc)} mm`, p: [xB + Lc * sxc / 2 + 0.3, -rp - 1.45, 0], color: C.white, size: 14, box: 1, alpha: S.sum });
          O.push({ k: 'text', t: 'N = P her kesitte', p: [xC + 0.9, -0.55, 0], color: C.mute, size: 13, alpha: S.sum });
        }
      }
    };
  },
  whatif: {
    not: 'Çelik çapını küçült: gerilmesi çapın karesiyle büyür. ν\'yü değiştir: boy değişimi aynı kalır, sadece çap değişimi değişir.',
    s: [{ k: 'P', ad: 'Kuvvet P', min: 1000, max: 30000, step: 500, u: 'N' }, { k: 'dp', ad: 'Pirinç çapı', min: 15, max: 60, step: 1, u: 'mm' }, { k: 'dc', ad: 'Çelik çapı', min: 8, max: 40, step: 1, u: 'mm' }, { k: 'np', ad: 'Pirinç ν', min: 0, max: 0.5, step: 0.01, u: '' }],
    out: (p, r) => `<div class="mets"><div class="m red"><small>σ pirinç</small><b>${f2(r.sp)} MPa</b></div><div class="m red"><small>σ çelik</small><b>${f2(r.sc)} MPa</b></div>
      <div class="m"><small>ΔL pirinç</small><b>${f4(r.dLp)} mm</b></div><div class="m"><small>ΔL çelik</small><b>${f4(r.dLc)} mm</b></div>
      <div class="m blue"><small>ΔD pirinç</small><b>${sci(r.dDp).replace('-', '−')} mm</b></div><div class="m blue"><small>ΔD çelik</small><b>${sci(r.dDc).replace('-', '−')} mm</b></div></div>
      <p class="note">σ<sub>ç</sub>/σ<sub>p</sub> = (d<sub>p</sub>/d<sub>ç</sub>)² = ${f2(r.sc / r.sp)}. ν = 0,5 olsaydı malzeme hacmini hiç değiştirmezdi (lastik gibi); ν = 0 ise çap hiç değişmezdi. ΔD her zaman eksi: çekilen çubuk incelir.</p>`
  },
  kagit: (p, r) => `Her kesitte N = P = ${fmt(p.P, 0)} N (çekme)
(a) A_p = π·${p.dp}²/4 = ${f1(r.Ap)} mm²    σ_p = ${fmt(p.P, 0)}/${f1(r.Ap)} = ${f2(r.sp)} MPa
    A_ç = π·${p.dc}²/4 = ${f1(r.Ac)} mm²    σ_ç = ${fmt(p.P, 0)}/${f1(r.Ac)} = ${f2(r.sc)} MPa
(b) ΔL_p = PL/(AE) = ${fmt(p.P, 0)}·${fmt(p.Lp * 1000, 0)}/(${f1(r.Ap)}·${fmt(p.Ep * 1000, 0)}) = ${f4(r.dLp)} mm
    ΔL_ç = ${fmt(p.P, 0)}·${fmt(p.Lc * 1000, 0)}/(${f1(r.Ac)}·${fmt(p.Ec * 1000, 0)}) = ${f4(r.dLc)} mm
(c) ε_x,p = σ_p/E_p = ${sci(r.exp)}    ε_y,p = −ν·ε_x = −${f2(p.np)}·${sci(r.exp)} = ${sci(r.eyp).replace('-', '−')}
    ΔD_p = ε_y,p·D = ${sci(r.eyp).replace('-', '−')}·${p.dp} = ${sci(r.dDp).replace('-', '−')} mm  (çap küçülür)
    ε_x,ç = σ_ç/E_ç = ${sci(r.exc)}    ε_y,ç = −${f2(p.nc)}·${sci(r.exc)} = ${sci(r.eyc).replace('-', '−')}
    ΔD_ç = ${sci(r.eyc).replace('-', '−')}·${p.dc} = ${sci(r.dDc).replace('-', '−')} mm  (çap küçülür)`,
  tuzak: ['<b>ΔD\'yi artı yazmak.</b> Çekilen çubuk incelir; ε<sub>y</sub> eksi, ΔD eksi. Cevap anahtarında bile işaret düşmüş; sen "−" ile ve "çap küçülür" diye yaz.',
    '<b>ν ile çarpmayı unutmak.</b> ΔD = ε<sub>x</sub>·D değil, ε<sub>y</sub>·D = −ν·ε<sub>x</sub>·D.',
    '<b>ΔD için boyu kullanmak.</b> Enine değişim çapla çarpılır (D = 30 mm), boyla (1200 mm) değil.',
    '<b>Birim karışıklığı.</b> E\'yi MPa (110 GPa = 110 000 MPa), L\'yi mm (1,2 m = 1200 mm) yaz. Hepsi N ve mm olunca ΔL mm çıkar.',
    '<b>Alanı yanlış almak.</b> A = πd²/4. d\'yi yarıçap gibi kullanırsan (πd²) gerilme 4 kat küçük çıkar.',
    '<b>Kuvveti bölmeye çalışmak.</b> Seri parçalar kuvveti paylaşmaz; ikisinde de N = P.'],
  hoca: `<p>Hocanın sonuçları: σ<sub>pirinç</sub> = 7,07 MPa, σ<sub>çelik</sub> = 15,91 MPa; ΔL<sub>p</sub> = 0,077 mm, ΔL<sub>ç</sub> = 0,0606 mm; ε<sub>x,p</sub> = 6,416·10⁻⁵, ε<sub>y,p</sub> = −2,1816·10⁻⁵, ΔD<sub>p</sub> = 6,545·10⁻⁴ mm; ε<sub>x,ç</sub> = 7,57·10⁻⁵, ε<sub>y,ç</sub> = 2,2725·10⁻⁵, ΔD<sub>ç</sub> = 4,545·10⁻⁴ mm.</p>
    <p>Bizim hesap: σ<sub>p</sub> = 7,07 MPa, σ<sub>ç</sub> = 15,92 MPa, ΔL<sub>p</sub> = 0,0772 mm, ΔL<sub>ç</sub> = 0,0606 mm, ΔD<sub>p</sub> = −6,56·10⁻⁴ mm, ΔD<sub>ç</sub> = −4,55·10⁻⁴ mm. Gerilmeler ve boy değişimleri aynı (15,9155 → hoca 15,91 diye kesmiş). Çap değişimlerindeki ‰2\'lik fark yuvarlamadan: hoca ε<sub>x</sub>\'i yuvarlanmış ΔL\'den (0,077/1200) hesaplamış; tam değer 6,43·10⁻⁵.</p>
    <p><b>Tek gerçek fark işaret.</b> Hoca ε<sub>y,p</sub>\'yi doğru olarak eksi bulmuş, ama ΔD satırında parantez içine "+" yazıp sonucu işaretsiz bırakmış; çelikte ε<sub>y</sub>\'yi de eksisiz yazmış. Çekilen çubuğun çapı <b>küçülür</b>, doğrusu ΔD<sub>p</sub> = −6,56·10⁻⁴ mm, ΔD<sub>ç</sub> = −4,55·10⁻⁴ mm. Büyüklükler doğru; sınavda sen eksi işaretiyle ya da "çap 6,56·10⁻⁴ mm küçülür" diye yaz.</p>`,
  gen() {
    const m = pick([['pirinç', 110, 0.34], ['alüminyum', 70, 0.33], ['bakır', 120, 0.34]]);
    const dp = rnd(24, 50, 2), dc = rnd(12, dp - 6, 2);
    return { P: rnd(3000, 20000, 500), Lp: rnd(0.6, 1.6, 0.1), dp, Ep: m[1], np: m[2], m1: m[0], Lc: rnd(0.4, 1.2, 0.1), dc, Ec: pick([200, 210]), nc: pick([0.28, 0.29, 0.3]) };
  },
  pracText: p => `Aynı düzen: duvara bağlı ${p.m1 || 'pirinç'} çubuk (L = ${f2(p.Lp)} m, d = ${p.dp} mm, E = ${p.Ep} GPa, ν = ${f2(p.np)}), ucuna eklenmiş çelik çubuk (L = ${f2(p.Lc)} m, d = ${p.dc} mm, E = ${p.Ec} GPa, ν = ${f2(p.nc)}). Uçtan P = ${fmt(p.P, 0)} N çekme. Gerilmeleri, boy değişimlerini ve çap değişimlerini bul. (ΔD'yi mm cinsinden işaretiyle yaz, örneğin −6,5e-4 ya da −0,00065.)`,
  ans: [{ k: 'sp', ad: 'σ (1. parça)', u: 'MPa' }, { k: 'sc', ad: 'σ çelik', u: 'MPa' }, { k: 'dLp', ad: 'ΔL (1. parça)', u: 'mm' }, { k: 'dLc', ad: 'ΔL çelik', u: 'mm' },
    { k: 'dDp', ad: 'ΔD (1. parça)', u: 'mm', tol: 0.03 }, { k: 'dDc', ad: 'ΔD çelik', u: 'mm', tol: 0.03 }],
  hints: (p, r) => [`İki parçada da N = ${fmt(p.P, 0)} N. A = πd²/4: ${f1(r.Ap)} mm² ve ${f1(r.Ac)} mm².`,
    `ΔL = PL/(AE). L'yi mm, E'yi MPa yaz: ${fmt(p.Ep * 1000, 0)} ve ${fmt(p.Ec * 1000, 0)} MPa.`,
    `ε_x = σ/E, ε_y = −ν·ε_x, ΔD = ε_y·D. Sonuç eksi çıkmalı.`],
  diag(p, r, u) {
    const near = (a, b) => isFinite(a) && Math.abs(a - b) <= Math.abs(b) * 0.03;
    if (near(u.dDp, -r.dDp) || near(u.dDc, -r.dDc)) return 'ΔD\'nin büyüklüğü doğru, işareti değil. Çekilen çubuk incelir: ε_y = −ν·ε_x eksi, ΔD de eksi.';
    if (near(u.dDp, r.exp * p.dp) || near(u.dDp, -r.exp * p.dp) || near(u.dDc, r.exc * p.dc) || near(u.dDc, -r.exc * p.dc)) return 'ΔD için ε_x\'i kullanmışsın. Önce ν ile çarp: ε_y = −ν·ε_x.';
    if (near(Math.abs(u.dDp), Math.abs(r.eyp) * p.Lp * 1000) || near(Math.abs(u.dDc), Math.abs(r.eyc) * p.Lc * 1000)) return 'Enine birim uzamayı boyla çarpmışsın; çapla (D) çarpılır.';
    if (near(u.sp, r.sp / 4) || near(u.sc, r.sc / 4)) return 'Alanı πd² almışsın; doğrusu πd²/4.';
    if (near(u.sp, r.sc) || near(u.sc, r.sp)) return 'Gerilmeler yer değiştirmiş: ince çubuğun gerilmesi büyük olur.';
    if (near(u.dLp, r.dLp / 1000) || near(u.dLc, r.dLc / 1000)) return 'L\'yi metre bırakmışsın; mm\'ye çevir (× 1000).';
    if (near(u.dLp, r.dLp * 1000) || near(u.dLc, r.dLc * 1000)) return 'E\'yi GPa olarak koymuşsun; MPa yaz (× 1000).';
    return 'Sırayla git: σ = P/A → ε = σ/E → ΔL = ε·L → ε_y = −ν·ε → ΔD = ε_y·D. Her parçayı kendi değerleriyle.';
  }
});
