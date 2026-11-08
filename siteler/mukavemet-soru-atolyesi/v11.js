'use strict';
/* ============ VİZE 11 · 2018–19 Güz · Soru 4 (dişliyle bağlı iki şaft) ============ */
VIZE.push({
  id: 'v11', no: 11, kod: 'V11', vize: true, tip: 'bu',
  src: '2018–19 Güz vizesi · Soru 4', img: 'img/v11.png', cevapImg: 'img/v11_cevap.png',
  ad: 'İki şaft, iki dişli: motor F\'de, makine C\'de',
  ozet: 'Motorun gücünden torku bul, dişliyle öbür şafta taşı (büyük dişlide tork büyür), τ = T·c/J ile çapları, φ = T·L/(J·G) ve dişli yaylarıyla F ucunun dönme açısını bul.',
  soru: 'İçi dolu iki şaft, gösterildiği gibi dişlilerle bağlanmıştır ve emniyet kayma gerilmesi 60 MPa olan çelikten yapılmıştır. F\'de 1200 devir/dk ve 3,2 kW gücünde bir elektrik motoru DF şaftını döndürmektedir. C\'de ise AC şaftı ile bir tekstil makinesine güç aktarmaktadır. (a) Şaftların çaplarını bulunuz. (15 puan) (b) Şaftların boyları 300 mm olduğuna göre F\'deki burulma açısını radyan cinsinden hesaplayınız. G = 77 GPa (15 puan)',
  verilen: ['Motor F\'de: P = 3,2 kW, n = 1200 dev/dk (DF şaftını döndürür)', 'Dişli yarıçapları: r<sub>D</sub> = 60 mm (küçük, DF üstünde), r<sub>A</sub> = 100 mm (büyük, AC üstünde)', 'İki şaft da içi dolu çelik, τ<sub>em</sub> = 60 MPa', 'Şaft boyları L = 300 mm, G = 77 GPa', 'C ucu tekstil makinesine bağlı (gücü alan uç)'],
  istenen: '(a) d<sub>DF</sub> ve d<sub>AC</sub> ; (b) F ucunun burulma açısı φ<sub>F</sub> (radyan)',
  p0: { P: 3.2, n: 1200, rA: 100, rD: 60, tau: 60, L: 300, G: 77 },
  solve(p) {
    const w = Math.PI * p.n / 30, TF = p.P * 1000 / w, TFn = TF * 1000; // N·m, N·mm
    const k = p.rA / p.rD, TC = TF * k, TCn = TC * 1000, Fc = TFn / p.rD, nA = p.n / k;
    const cDF = Math.cbrt(2 * TFn / (Math.PI * p.tau)), cAC = Math.cbrt(2 * TCn / (Math.PI * p.tau));
    const JDF = Math.PI * Math.pow(cDF, 4) / 2, JAC = Math.PI * Math.pow(cAC, 4) / 2, Gm = p.G * 1000;
    const phiDF = TFn * p.L / (JDF * Gm), phiA = TCn * p.L / (JAC * Gm), phiD = phiA * k, phiF = phiD + phiDF;
    return { w, TF, TFn, k, TC, TCn, Fc, nA, cDF, cAC, dDF: 2 * cDF, dAC: 2 * cAC, JDF, JAC, Gm, phiDF, phiA, phiD, phiF,
      phiFdeg: phiF * 180 / Math.PI, wA: w / k, wrong: { Tn: p.P * 1000 / p.n, T2pi: p.P * 1000 / (2 * Math.PI * p.n) } };
  },
  anlam: [
    ['elektrik motoru … DF şaftını döndürüyor', 'Güç F\'den girer. Motor şafta bir <b>tork</b> (döndürme momenti) uygular; önce o torku bulacağız.'],
    ['3,2 kW, 1200 dev/dk', 'Güç = tork × açısal hız: <b>P = T·ω</b>. Devri rad/s\'ye çevir: ω = 2π·n/60 = π·n/30.'],
    ['dişlilerle bağlanmış', 'Temas noktasında iki dişli birbirini <b>aynı kuvvetle</b> iter. Tork = kuvvet × yarıçap: büyük dişlide tork büyür, hız düşer.'],
    ['C\'de tekstil makinesine güç aktarıyor', 'AC şaftı torku C\'ye kadar taşır. C ucu makineye bağlı, dönmeye karşı koyan uç: burulmada <b>sabit uç</b> gibi alınır.'],
    ['emniyet kayma gerilmesi 60 MPa', 'Burulmada gerilme <b>kayma</b> gerilmesidir: τ = T·c/J en çok 60 MPa olabilir. Çap buradan çıkar.'],
    ['içi dolu şaft', 'J = π·c⁴/2 (c = dış yarıçap). Boru olsaydı iç kısım çıkarılırdı.'],
    ['F\'deki burulma açısı', 'F ucunun sabit C\'ye göre ne kadar döndüğü: AC\'nin burulması dişliden D\'ye geçer, üstüne DF\'nin kendi burulması <b>eklenir</b>.']
  ],
  tetik: ['kW ve dev/dk', 'dişliyle bağlı iki şaft', 'emniyet kayma gerilmesi', 'içi dolu şaft çapı', 'burulma açısı, G'],
  tetikNot: 'Güç ve devir görünce ilk satır hep T = P/ω. Dişli görünce "temas kuvveti aynı" de: torklar yarıçapla doğru orantılı, dönme açıları yarıçapla ters orantılı.',
  zincir: [
    ['Ne isteniyor?', 'Çap ve açı. İkisi de <b>tork</b> ister: τ = T·c/J, φ = T·L/(J·G). Önce iki şaftın torku.'],
    ['DF\'nin torku nereden?', 'Motorun gücünden: T<sub>F</sub> = P/ω, ω rad/s olmalı.'],
    ['AC\'nin torku nereden?', 'Dişli temasından: kuvvet aynı, F = T<sub>F</sub>/r<sub>D</sub> = T<sub>C</sub>/r<sub>A</sub> → T<sub>C</sub> = (r<sub>A</sub>/r<sub>D</sub>)·T<sub>F</sub>.'],
    ['Çapı nasıl çözerim?', 'τ<sub>em</sub> = T·c/(π·c⁴/2) = 2T/(π·c³) → c = ∛(2T/(π·τ<sub>em</sub>)), d = 2c.'],
    ['F neden C\'ye göre döner?', 'C makineye bağlı (sabit). AC burulunca A döner; A, D\'yi döndürür (yaylar eşit); DF de burulur. Hepsi toplanır.']
  ],
  cam: { yaw: -0.72, pitch: 0.28, dist: 8.0, t: [1.6, 0.45, 0] },
  steps: [
    { t: 'Şekle bak: iki şaft, iki dişli', st: { lab: 1, dim: 1 },
      h: () => 'Altta <b>DF şaftı</b>: F ucunda motor, D ucunda küçük dişli (r = 60 mm). Üstte <b>AC şaftı</b>: A ucunda büyük dişli (r = 100 mm), C ucunda tekstil makinesi. Şaftlar iki ayağın (G, H) yataklarında serbestçe döner; B ve E yatak noktaları. İki dişli birbirine geçmiş.',
      why: 'Güç yolu: motor → DF şaftı → D dişlisi → A dişlisi → AC şaftı → makine. Her parça bir sonrakine tork aktarır. Yataklar şaftı sadece taşır, tork almaz.' },
    { t: 'Motor döndürür: güç ve tork', st: { lab: 1, spin: 1, tqF: 1 },
      h: (p, r) => `Burma (burulma) sorusunun anahtarı <b>tork</b>: şaftı kendi ekseni etrafında döndüren moment (kuvvet × yarıçap, N·m). Motor F'den bir T<sub>F</sub> torku uygular ve şaft ${p.n} dev/dk döner. Güç, tork ile açısal hızın çarpımıdır. Açısal hızı rad/s'ye çevir: bir tur 2π radyan, bir dakika 60 s.`,
      f: (p, r) => `ω = 2π·n/60 = π·${p.n}/30 = ${f2(r.w)} rad/s<br>P = T·ω → T<sub>F</sub> = ${fmt(p.P * 1000, 0)} W / ${f2(r.w)} = <b>${f3(r.TF)} N·m = ${fmt(r.TFn, 0)} N·mm</b>`,
      why: 'Aynı gücü yavaş dönen bir şaft daha büyük torkla, hızlı dönen daha küçük torkla taşır. Bisiklette hafif vitese geçince pedal kolay döner ama çok çevirirsin: aynı güç, küçük tork, büyük hız. kW\'ı W\'a (× 1000) çevirmeyi unutma; çıkan tork N·m olur, mm ile çalışacağımız için × 1000 ile N·mm\'ye geç.' },
    { t: 'Dişli teması: kuvvet aynı', st: { lab: 1, few: 1, spin: 0.35, fc: 1, rad: 1 }, cam: { yaw: -1.32, pitch: 0.12, dist: 6.4, t: [0.4, 0.7, 0] },
      h: (p, r) => `İki dişli tek bir noktada (dişlerin değdiği yer) birbirine dokunur. Orada D, A'yı bir F kuvvetiyle iter; A da D'yi <b>aynı büyüklükte</b> ters yönde iter (etki–tepki). D şaftının torku bu kuvvetin D'nin yarıçapıyla çarpımı.`,
      f: (p, r) => `T<sub>F</sub> = F·r<sub>D</sub> → F = ${fmt(r.TFn, 0)} / ${p.rD} = <b>${f1(r.Fc)} N</b>`,
      why: 'Burada F hem F ucunun adı hem temas kuvveti diye geçiyor; hocanın çözümündeki F, temas kuvveti. Dişli kuvvetinin yönü dişe teğettir, yarıçapa dik; o yüzden tork = F × r.' },
    { t: 'Büyük dişli: tork büyür, hız düşer', st: { lab: 1, spin: 1, rad: 1, tqF: 1, tqC: 1, spd: 1 },
      h: (p, r) => `Aynı F kuvveti büyük dişliye daha uzun bir kolla (r<sub>A</sub> = ${p.rA} mm) etki eder: AC'deki tork büyür. Buna karşılık büyük dişli yavaş döner: bir turunda küçük dişli ${f2(r.k)} tur atar. Güç değişmez (sürtünme yok).`,
      f: (p, r) => `T<sub>C</sub> = F·r<sub>A</sub> = (r<sub>A</sub>/r<sub>D</sub>)·T<sub>F</sub> = (${p.rA}/${p.rD})·${fmt(r.TFn, 0)} = <b>${fmt(r.TCn, 0)} N·mm</b> (${f2(r.TC)} N·m)<br>n<sub>A</sub> = n·r<sub>D</sub>/r<sub>A</sub> = ${fmt(r.nA, 0)} dev/dk · kontrol: T<sub>C</sub>·ω<sub>A</sub> = ${f2(r.TC)}·${f2(r.wA)} = ${fmt(r.TC * r.wA, 0)} W ✓`,
      why: 'Temas noktasında iki dişlinin çevresi aynı hızla ilerler (diş kaymaz): r_D·ω_D = r_A·ω_A. Kuvvet aynı, yarıçap büyük → tork büyük; yarıçap büyük → açısal hız küçük. Çarpım (güç) aynı kalır.' },
    { t: 'Burulma nedir? Düz çizgi helis olur', st: { lab: 1, demo: 1, lines: 1 },
      h: () => 'Şaftın yüzeyine boydan boya düz bir çizgi çizdiğini düşün (kesikli çizgi ilk hali). Bir ucu tutulup öbür ucu döndürülünce kesitler birbirine göre biraz döner, çizgi <b>helis</b> gibi kıvrılır (kırmızı). Uç kesitin dönme açısına <b>burulma açısı φ</b> denir. Kesitlerin birbirine göre kayması <b>kayma gerilmesi τ</b> doğurur.',
      why: 'Çekmede çubuk uzar (δ), burmada şaft dönerek burulur (φ). Formüller de benzer: δ = F·L/(A·E) ↔ φ = T·L/(J·G). Kuvvet yerine tork, alan yerine J, E yerine G (kayma modülü). Gerçek açılar çok küçük; sahnede "abart" kaydırıcısıyla büyütülüyor.' },
    { t: 'Kesitte gerilme: τ = T·c/J', st: { lab: 0, sec: 1 }, cam: { yaw: -0.95, pitch: 0.2, dist: 4.6, t: [1.4, 0.1, 1.2] },
      h: (p, r) => 'Şaftı bir yerinden kesip kesite bak. Kayma gerilmesi merkezde sıfır, dışa doğru doğrusal artar, <b>yüzeyde en büyük</b>. ρ yarıçaplı noktada τ = T·ρ/J; en büyüğü yüzeyde (ρ = c). J, kesitin burulmaya karşı direnci (polar atalet momenti).',
      f: () => 'τ<sub>max</sub> = T·c / J ,  dolu şaftta J = π·c⁴/2<br>→ τ<sub>max</sub> = 2T / (π·c³)',
      why: 'J\'de c⁴ var: yarıçapı 2 katına çıkarırsan J 16 kat, gerilme 8 kat azalır. O yüzden çap küçük değişse de gerilme çok değişir. c = yarıçap, d = 2c. Formülde çap yazmak en sık hata.' },
    { t: '(a) DF şaftının çapı', st: { lab: 1, dDF: 1 },
      h: (p, r) => `DF'de tork T<sub>F</sub>. Gerilme yüzeyde ${p.tau} MPa'ya ulaşacak kadar ince olabilir: τ<sub>max</sub> = τ<sub>em</sub> koyup c'yi çöz.`,
      f: (p, r) => `${p.tau} = 2·${fmt(r.TFn, 0)} / (π·c³) → c³ = ${f2(2 * r.TFn / (Math.PI * p.tau))} mm³<br>c<sub>DF</sub> = <b>${f2(r.cDF)} mm</b> → <b>d<sub>DF</sub> = ${f2(r.dDF)} mm</b>` },
    { t: '(a) AC şaftının çapı', st: { lab: 1, dDF: 1, dAC: 1 },
      h: (p, r) => `AC daha büyük torku (T<sub>C</sub>) taşıyor, o yüzden daha kalın olmalı. Aynı işlem.`,
      f: (p, r) => `${p.tau} = 2·${fmt(r.TCn, 0)} / (π·c³) → c³ = ${f2(2 * r.TCn / (Math.PI * p.tau))} mm³<br>c<sub>AC</sub> = <b>${f2(r.cAC)} mm</b> → <b>d<sub>AC</sub> = ${f2(r.dAC)} mm</b>`,
      why: 'Hoca bu şafta "AB şaftı" diyor; AB, A dişlisinden B yatağına kadar olan kısım ama tork A\'dan C\'ye kadar aynı. Pratikte bu çapları bir üst standart değere (13 mm, 16 mm gibi) yuvarlarsın; sınavda hesaplanan değeri yaz.' },
    { t: '(b) AC burulur: A ucu döner', st: { lab: 1, twAC: 1, lines: 1, dAC: 0.0 },
      h: (p, r) => `C ucu makineye bağlı, dönmeye karşı koyuyor: onu sabit kabul et. AC boyunca tork T<sub>C</sub>; A ucu C'ye göre φ<sub>A</sub> kadar döner (çizgi A'da kıvrıldı, C'de düz). A dönünce D dişlisini de döndürür: alttaki çizgi şimdilik <b>bütün olarak</b> kaydı (DF'nin kendi burulmasını son adımda ekleyeceğiz).`,
      f: (p, r) => `J<sub>AC</sub> = π·${f2(r.cAC)}⁴/2 = ${fmt(r.JAC, 0)} mm⁴ ,  G = ${fmt(r.Gm, 0)} MPa<br>φ<sub>A</sub> = T<sub>C</sub>·L/(J·G) = ${fmt(r.TCn, 0)}·${p.L} / (${fmt(r.JAC, 0)}·${fmt(r.Gm, 0)}) = <b>${f4(r.phiA)} rad</b>`,
      why: 'Kısa yol: T/J = τ/c olduğu için φ = τ_em·L/(c·G) = 60·300/(7,66·77 000) da aynı sonucu verir. G\'yi GPa\'dan MPa\'ya çevir (77 GPa = 77 000 MPa = 77 000 N/mm²); tork N·mm, boy mm olunca açı radyan çıkar.' },
    { t: 'Dişliden geçen açı: yaylar eşit', st: { lab: 1, few: 1, twAC: 1, arc: 1 }, cam: { yaw: -1.32, pitch: 0.12, dist: 6.4, t: [0.4, 0.7, 0] },
      h: (p, r) => `A dişlisi φ<sub>A</sub> dönünce temas noktası çevresi boyunca bir yay kadar ilerler; D dişlisinin çevresi de <b>aynı yay</b> kadar ilerlemek zorunda (dişler kaymaz). Küçük dişli aynı yay için daha büyük açıyla döner.`,
      f: (p, r) => `r<sub>A</sub>·φ<sub>A</sub> = r<sub>D</sub>·φ<sub>D</sub> → φ<sub>D</sub> = (${p.rA}/${p.rD})·${f4(r.phiA)} = <b>${f4(r.phiD)} rad</b>`,
      why: 'Dikkat: tork büyük dişlide büyüktü (T_C = (r_A/r_D)·T_F); açı ise küçük dişlide büyük (φ_D = (r_A/r_D)·φ_A). İkisi de "yay/kuvvet temas noktasında aynı" fikrinden çıkıyor. Yönleri zıttır, ama büyüklük soruluyor.' },
    { t: 'DF de burulur: F\'nin toplam açısı', st: { lab: 1, twAC: 1, twDF: 1, lines: 1, sum: 1 },
      h: (p, r) => `D ucu zaten φ<sub>D</sub> dönmüş durumda (dişli yüzünden). DF şaftı da T<sub>F</sub> ile burulur: F ucu D'ye göre φ<sub>DF</sub> kadar daha döner. F'nin sabit C'ye göre açısı ikisinin toplamı (uçtaki beyaz yay φ<sub>D</sub>, kırmızı yay φ<sub>DF</sub>).`,
      f: (p, r) => `J<sub>DF</sub> = π·${f2(r.cDF)}⁴/2 = ${fmt(r.JDF, 0)} mm⁴<br>φ<sub>DF</sub> = ${fmt(r.TFn, 0)}·${p.L} / (${fmt(r.JDF, 0)}·${fmt(r.Gm, 0)}) = ${f4(r.phiDF)} rad<br>φ<sub>F</sub> = φ<sub>D</sub> + φ<sub>DF</sub> = ${f4(r.phiD)} + ${f4(r.phiDF)} = <b>${f4(r.phiF)} rad</b> (= ${f2(r.phiFdeg)}°)`,
      why: 'Neden toplanıyor? Merdiven gibi düşün: C sabit → A, C\'ye göre φ_A döndü → D, dişli yüzünden φ_D döndü → F, D\'ye göre φ_DF daha döndü. Motor F\'yi döndürüyor, D dişlisi frenliyor: F, D\'den ileride. Bu yüzden ikisi aynı yönde eklenir.' }
  ],
  scene(v, p, r) {
    const Lx = 3, yU = (p.rA + p.rD) / 100, RA = p.rA / 100, RD = p.rD / 100;
    const rAC = 0.25, rDF = rAC * r.cDF / r.cAC; // şaftlar görünsün diye kalın çizildi (oran gerçek)
    const gearMesh = (R, N, th) => {
      const pts = [], ad = 0.075, de = 0.085;
      for (let k = 0; k < N; k++) {
        const a = 2 * Math.PI * k / N, s = 2 * Math.PI / N;
        [[-0.5, R - de], [-0.27, R + ad * 0.2], [-0.15, R + ad], [0.15, R + ad], [0.27, R + ad * 0.2]].forEach(([f, rr]) => {
          const t = a + f * s; pts.push([rr * Math.cos(t), rr * Math.sin(t)]);
        });
      }
      const m = E3.extrude(pts, th); // (u,v,w) → (x=w, y=u, z=v): dişli yz düzleminde
      return { v: m.v.map(q => [q[2], q[0], q[1]]), f: m.f };
    };
    const NA = Math.round(RA / 0.04), ND = Math.round(RD / 0.04);
    const gA = v.add(gearMesh(RA, NA, 0.16), { color: '#9fb0c0', pos: [0, yU, 0] });
    const gD = v.add(gearMesh(RD, ND, 0.16), { color: '#b8c4cf', pos: [0, 0, 0] });
    const hubA = v.add(E3.cyl(rAC * 1.6, 0.26, 20, 'x'), { color: '#7d8a97', pos: [0, yU, 0] });
    const hubD = v.add(E3.cyl(rDF * 1.6, 0.26, 20, 'x'), { color: '#7d8a97', pos: [0, 0, 0] });
    const seg = 6, segs = [];
    for (let i = 0; i < seg; i++) {
      const x0 = -0.05 + (Lx + 0.25) * i / seg, l = (Lx + 0.25) / seg;
      segs.push({ s: 'AC', o: v.add(E3.cyl(rAC, l, 20, 'x'), { color: C.steel, pos: [x0 + l / 2, yU, 0] }) });
      segs.push({ s: 'DF', o: v.add(E3.cyl(rDF, l, 20, 'x'), { color: C.steel, pos: [x0 + l / 2, 0, 0] }) });
    }
    const upX = [1.0, 2.3];
    upX.forEach(x => v.add(E3.box(0.18, 3.1, 0.62), { color: '#6b7886', pos: [x, 0.55, 0], alpha: 0.93 }));
    v.add(E3.box(2.2, 0.26, 1.5), { color: '#8d7a5c', pos: [1.65, -1.13, 0], bias: 0.5 });
    const motor = v.add(E3.cyl(0.36, 0.85, 24, 'x'), { color: '#3d4753', pos: [Lx + 0.62, 0, 0] });
    v.add(E3.box(0.7, 0.2, 0.6), { color: '#2e363f', pos: [Lx + 0.62, -0.42, 0] });
    const mach = v.add(E3.box(0.85, 0.85, 0.85), { color: '#56606b', pos: [Lx + 0.62, yU, 0] });
    const SZ = 1.75; // büyütülmüş kesit, çerçevenin önünde
    const secD = v.add(E3.cyl(0.6, 0.04, 40, 'x'), { color: '#c8d2dc', pos: [1.65, 0, SZ], alpha: 0, two: true });
    let ph = 0, last = null;
    const def = { few: 0, lab: 0, dim: 0, spin: 0, tqF: 0, tqC: 0, fc: 0, rad: 0, spd: 0, demo: 0, lines: 0, sec: 0, dDF: 0, dAC: 0, twAC: 0, twDF: 0, arc: 0, sum: 0 };
    const t0A = 1.6, t0D = 0.4; // yüzey çizgilerinin başlangıç açısı (kameraya bakan taraf)
    const P3 = (x, yc, rr, t) => [x, yc + rr * Math.cos(t), rr * Math.sin(t)];
    const arcPts = (x, yc, rr, a0, a1, n = 18) => { const o = []; for (let i = 0; i <= n; i++) o.push(P3(x, yc, rr, a0 + (a1 - a0) * i / n)); return o; };
    const arcArrow = (O, x, yc, rr, a0, a1, color, alpha, w = 2.4) => {
      const P = arcPts(x, yc, rr, a0, a1), n = P.length;
      O.push({ k: 'line', p: P.slice(0, n - 1), color, w, alpha });
      O.push({ k: 'arrow', a: P[n - 3], b: P[n - 1], color, w, hs: 10, alpha });
    };
    return {
      def, apply(S, time, v) {
        const dt = last == null ? 0 : Math.min(0.05, Math.max(0, time - last)); last = time;
        ph += dt * 1.5 * S.spin;
        const g = 2 + 30 * S.ex;
        const dm = S.demo * loop(time, 1.1);
        const tA = Math.max(S.twAC, dm), tD = Math.max(S.twDF, dm);
        const aA = -r.phiA * g * tA, aD = r.phiD * g * tA, aF = aD + r.phiDF * g * tD;
        gD.rot = [ph + aD, 0, 0];
        gA.rot = [-ph * RD / RA + aA + (NA % 2 ? 0 : Math.PI / NA), 0, 0];
        secD.alpha = S.sec * 0.55;
        segs.forEach(({ s, o }) => {
          const hl = s === 'DF' ? S.dDF : S.dAC;
          o.color = mixHex(C.steel, '#e2e8ee', hl * 0.6); o.glow = hl * 0.25;
          o.alpha = 1 - S.sec * (s === 'AC' ? 0.75 : 0);
        });
        gA.alpha = hubA.alpha = mach.alpha = gD.alpha = hubD.alpha = 1 - S.sec * 0.75;
        const O = v.ov;
        if (S.lab > 0.01) {
          [['A', [-0.25, yU + 0.32, 0.25]], ['D', [-0.25, -0.3, 0.35]], ['B', [upX[0], yU + 0.42, 0.35]], ['E', [upX[0], 0.38, 0.35]],
            ['C', [Lx + 0.05, yU + 0.38, 0.1]], ['F', [Lx + 0.05, 0.36, 0.1]], ['G', [upX[0], -0.85, 0.42]], ['H', [upX[1], -0.85, 0.42]]]
            .forEach(([t, q]) => O.push({ k: 'text', t, p: q, size: 16, alpha: S.lab * (t === 'A' || t === 'D' ? 1 : 1 - S.few) }));
          O.push({ k: 'text', t: 'MOTOR', p: [Lx + 0.62, -0.75, 0.3], size: 12, color: C.mute, box: 1, alpha: S.lab * (1 - S.sec) * (1 - S.sum) * (1 - S.tqF) * (1 - S.few) });
          O.push({ k: 'text', t: 'TEKSTİL\nMAKİNESİ', p: [Lx + 0.62, yU + 0.75, 0.3], size: 12, color: C.mute, box: 1, alpha: S.lab * (1 - S.sec) * (1 - S.few) });
        }
        if (S.dim > 0.01 || S.rad > 0.01) {
          const al = Math.max(S.dim, S.rad);
          O.push({ k: 'line', p: [[-0.12, yU, 0], [-0.12, yU - RA, 0]], color: C.red, w: 2, alpha: al });
          O.push({ k: 'line', p: [[-0.12, 0, 0], [-0.12, RD, 0]], color: C.white, w: 2, alpha: al });
          O.push({ k: 'text', t: `r_A = ${p.rA} mm`, p: [-0.15, yU - RA / 2, -0.15], dx: -52, color: C.red, size: 13, box: 1, alpha: al });
          O.push({ k: 'text', t: `r_D = ${p.rD} mm`, p: [-0.15, RD * 0.3, -0.15], dx: 52, color: C.white, size: 13, box: 1, alpha: al });
        }
        if (S.dim > 0.01) O.push({ k: 'dim', a: [0, 0, rDF], b: [Lx, 0, rDF], off: [0, -0.62, 0.6], t: `L = ${p.L} mm (iki şaft da)`, alpha: S.dim });
        if (S.spin > 0.05) {
          arcArrow(O, -0.14, 0, RD + 0.22, 2.5, 3.7, C.white, S.spin * 0.8, 1.8);
          arcArrow(O, -0.14, yU, RA + 0.18, 0.6, -0.5, C.white, S.spin * 0.8, 1.8);
        }
        if (S.tqF > 0.01) {
          arcArrow(O, Lx - 0.3, 0, rDF + 0.22, -0.9, 2.4, C.red, S.tqF, 2.8);
          O.push({ k: 'text', t: `T_F = ${f2(r.TF)} N·m`, p: [Lx - 0.3, -0.62, 0.4], color: C.red, size: 14, box: 1, alpha: S.tqF });
        }
        if (S.tqC > 0.01) {
          arcArrow(O, Lx - 0.3, yU, rAC + 0.26, -0.9, 2.4, C.red, S.tqC, 3.4);
          O.push({ k: 'text', t: `T_C = ${f2(r.TC)} N·m\n(makinenin karşı torku)`, p: [Lx - 0.3, yU + 0.72, 0.4], color: C.red, size: 13, box: 1, alpha: S.tqC });
        }
        if (S.spd > 0.01) {
          O.push({ k: 'text', t: `D: ${fmt(p.n, 0)} dev/dk\nküçük tork`, p: [-0.2, -0.95, 0.4], color: C.white, size: 13, box: 1, alpha: S.spd });
          O.push({ k: 'text', t: `A: ${fmt(r.nA, 0)} dev/dk\nbüyük tork`, p: [-0.2, yU + 1.3, 0.3], color: C.white, size: 13, box: 1, alpha: S.spd });
        }
        if (S.fc > 0.01) {
          const yc = RD;
          O.push({ k: 'ring', c: [-0.1, yc, 0], r: 0.07, u: [0, 1, 0], v: [0, 0, 1], color: C.red, w: 2, alpha: S.fc });
          O.push({ k: 'arrow', a: [-0.16, yc + 0.08, 0.02], b: [-0.16, yc + 0.08, 0.85], color: C.red, w: 2.6, label: 'F: D, A\'yı iter', lp: [-0.16, yc + 0.28, 1.0], alpha: S.fc });
          O.push({ k: 'arrow', a: [-0.16, yc - 0.08, -0.02], b: [-0.16, yc - 0.08, -0.85], color: C.comp, w: 2.6, label: 'F: A, D\'yi frenler', lp: [-0.16, yc - 0.42, -1.0], alpha: S.fc });
        }
        if (S.lines > 0.01) {
          const lineOn = (yc, rr, x0, x1, a0, a1, col, t0) => {
            const P = [], R0 = [];
            for (let i = 0; i <= 30; i++) { const x = x0 + (x1 - x0) * i / 30; P.push(P3(x, yc, rr + 0.01, t0 + a0 + (a1 - a0) * i / 30)); R0.push(P3(x, yc, rr + 0.01, t0)); }
            O.push({ k: 'line', p: R0, color: C.dim, w: 1.4, dash: [5, 4], alpha: S.lines * 0.9 });
            O.push({ k: 'line', p: P, color: col, w: 2.6, alpha: S.lines });
          };
          lineOn(yU, rAC, 0.15, Lx, aA, 0, C.tens, t0A);
          lineOn(0, rDF, 0.15, Lx, aD, aF, C.tens, t0D);
        }
        if (S.demo > 0.01) {
          O.push({ k: 'text', t: 'C tutuluyor', p: [Lx + 0.1, yU - 0.45, 0.4], color: C.white, size: 13, box: 1, alpha: S.demo });
          O.push({ k: 'text', t: 'F\'yi motor\ndöndürüyor', p: [Lx + 0.1, -0.55, 0.4], color: C.white, size: 13, box: 1, alpha: S.demo });
          O.push({ k: 'text', t: 'düz çizgi → helis', p: [1.65, yU + 0.6, 0.4], color: C.tens, size: 14, box: 1, alpha: S.demo });
        }
        if (S.sec > 0.01) {
          const x = 1.62, Rr = 0.55, Pz = q => [q[0], q[1], q[2] + SZ];
          O.push({ k: 'line', p: [[1.65, 0, rDF], [1.65, 0, SZ - Rr]], color: C.mute, w: 1.2, dash: [4, 4], alpha: S.sec });
          O.push({ k: 'ring', c: [1.65, 0, 0], r: rDF + 0.03, u: [0, 1, 0], v: [0, 0, 1], color: C.mute, w: 1.5, alpha: S.sec });
          O.push({ k: 'ring', c: [x, 0, SZ], r: Rr, u: [0, 1, 0], v: [0, 0, 1], color: C.white, w: 1.5, alpha: S.sec });
          for (let i = 0; i < 8; i++) {
            const t = i * Math.PI / 4;
            [[Rr, 0.3], [Rr / 2, 0.15]].forEach(([rr, l]) => {
              const a = Pz(P3(x, 0, rr, t)), tg = [0, -Math.sin(t), Math.cos(t)];
              O.push({ k: 'arrow', a: [a[0], a[1] - tg[1] * l / 2, a[2] - tg[2] * l / 2], b: [a[0], a[1] + tg[1] * l / 2, a[2] + tg[2] * l / 2], color: rr === Rr ? C.red : C.tens, w: rr === Rr ? 2.4 : 1.8, hs: 8, alpha: S.sec });
            });
          }
          O.push({ k: 'line', p: [[x, 0, SZ], Pz(P3(x, 0, Rr, -0.6))], color: C.white, w: 1.3, alpha: S.sec });
          O.push({ k: 'text', t: 'c', p: Pz(P3(x - 0.02, 0, Rr * 0.55, -0.85)), color: C.white, size: 14, alpha: S.sec });
          O.push({ k: 'text', t: 'yüzeyde τ_max', p: Pz(P3(x, 0, Rr + 0.3, 0)), color: C.red, size: 14, box: 1, alpha: S.sec });
          O.push({ k: 'text', t: 'büyütülmüş kesit', p: [x, Rr + 0.45, SZ], color: C.mute, size: 13, alpha: S.sec });
          O.push({ k: 'text', t: 'merkezde τ = 0', p: [x, -Rr - 0.3, SZ], color: C.white, size: 13, box: 1, alpha: S.sec });
        }
        if (S.dDF > 0.01) O.push({ k: 'text', t: `d_DF = ${f2(r.dDF)} mm`, p: [1.35, -0.5, 0.55], color: C.white, size: 15, box: 1, alpha: S.dDF });
        if (S.dAC > 0.01) O.push({ k: 'text', t: `d_AC = ${f2(r.dAC)} mm\n(büyük tork → kalın)`, p: [1.65, yU + 0.55, 0.5], color: C.white, size: 15, box: 1, alpha: S.dAC });
        if (S.twAC > 0.01) {
          O.push({ k: 'text', t: `φ_A = ${f4(r.phiA)} rad`, p: [0.55, yU + 0.5, 0.35], color: C.tens, size: 14, box: 1, alpha: S.twAC * (1 - S.sum) * (1 - S.few) });
          O.push({ k: 'text', t: 'C sabit (φ = 0)', p: [Lx, yU - 0.5, 0.5], color: C.mute, size: 13, box: 1, alpha: S.twAC * (1 - S.sum) * (1 - S.few) });
        }
        if (S.arc > 0.01) {
          const xa = -0.13;
          const PD = arcPts(xa, 0, RD, 0, aD), PA = arcPts(xa, yU, RA, Math.PI, Math.PI + aA);
          O.push({ k: 'line', p: PD, color: C.red, w: 4, alpha: S.arc });
          O.push({ k: 'line', p: PA, color: C.white, w: 4, alpha: S.arc });
          O.push({ k: 'text', t: `beyaz yay (A) = kırmızı yay (D)\nr_A·φ_A = r_D·φ_D\nφ_D = ${f4(r.phiD)} rad`, p: [-0.2, RD - 0.2, -1.5], color: C.red, size: 14, box: 1, alpha: S.arc });
        }
        if (S.sum > 0.01) {
          const xe = Lx + 0.02, rr = rDF + 0.2;
          O.push({ k: 'line', p: arcPts(xe, 0, rr, t0D, t0D + aD), color: C.white, w: 3, alpha: S.sum });
          O.push({ k: 'line', p: arcPts(xe, 0, rr, t0D + aD, t0D + aF), color: C.red, w: 3, alpha: S.sum });
          O.push({ k: 'line', p: [[xe, 0, 0], P3(xe, 0, rr + 0.1, t0D)], color: C.mute, w: 1.2, dash: [4, 3], alpha: S.sum });
          O.push({ k: 'line', p: [[xe, 0, 0], P3(xe, 0, rr + 0.1, t0D + aF)], color: C.red, w: 1.2, alpha: S.sum });
          O.push({ k: 'text', t: `φ_D = ${f4(r.phiD)}`, p: [0.55, -0.35, 0.75], color: C.white, size: 13, box: 1, alpha: S.sum });
          O.push({ k: 'text', t: `φ_F = ${f4(r.phiD)} + ${f4(r.phiDF)}\n= ${f4(r.phiF)} rad`, p: [Lx + 0.9, -0.95, 0.6], color: C.red, size: 14, box: 1, alpha: S.sum });
        }
      }
    };
  },
  whatif: {
    not: 'Dişli oranını değiştir: büyük dişli büyüdükçe AC\'nin torku ve çapı artar, D\'nin dönme açısı da artar. Gücü artırınca iki şaft da kalınlaşır.',
    s: [{ k: 'P', ad: 'Motor gücü P', min: 0.5, max: 15, step: 0.1, u: 'kW' }, { k: 'n', ad: 'Devir n', min: 300, max: 3000, step: 50, u: 'dev/dk' },
      { k: 'rA', ad: 'r_A (büyük dişli)', min: 40, max: 200, step: 5, u: 'mm' }, { k: 'rD', ad: 'r_D (küçük dişli)', min: 30, max: 150, step: 5, u: 'mm' },
      { k: 'tau', ad: 'τ_em', min: 30, max: 120, step: 5, u: 'MPa' }, { k: 'L', ad: 'Şaft boyu L', min: 100, max: 1000, step: 25, u: 'mm' }],
    out: (p, r) => `<div class="mets"><div class="m"><small>T_F</small><b>${f2(r.TF)} N·m</b></div><div class="m"><small>T_C</small><b>${f2(r.TC)} N·m</b></div>
      <div class="m"><small>d_DF</small><b>${f2(r.dDF)} mm</b></div><div class="m"><small>d_AC</small><b>${f2(r.dAC)} mm</b></div>
      <div class="m red"><small>φ_F</small><b>${f4(r.phiF)} rad (${f2(r.phiFdeg)}°)</b></div></div>
      <p class="note">Devri iki katına çıkar: tork yarıya iner, çaplar ∛2 ≈ 1,26 kat incelir. Çaplar τ_em\'e göre seçildiği için φ = τ_em·L/(c·G): L ile doğru, c ile ters orantılı.</p>`
  },
  kagit: (p, r) => `ω = π·n/30 = π·${p.n}/30 = ${f2(r.w)} rad/s
P = T·ω  →  T_F = ${fmt(p.P * 1000, 0)}/${f2(r.w)} = ${f3(r.TF)} N·m = ${fmt(r.TFn, 0)} N·mm
Dişli teması (kuvvet aynı):  T_F/r_D = T_C/r_A
T_C = (${p.rA}/${p.rD})·${fmt(r.TFn, 0)} = ${fmt(r.TCn, 0)} N·mm
(a) τ = T·c/J ,  J = π·c⁴/2  →  c = ∛(2T/(π·τ_em))
c_DF = ∛(2·${fmt(r.TFn, 0)}/(π·${p.tau})) = ${f2(r.cDF)} mm   →  d_DF = ${f2(r.dDF)} mm
c_AC = ∛(2·${fmt(r.TCn, 0)}/(π·${p.tau})) = ${f2(r.cAC)} mm   →  d_AC = ${f2(r.dAC)} mm
(b) φ = T·L/(J·G) ,  G = ${fmt(r.Gm, 0)} MPa
J_AC = ${fmt(r.JAC, 0)} mm⁴    J_DF = ${fmt(r.JDF, 0)} mm⁴
φ_A  = ${fmt(r.TCn, 0)}·${p.L}/(${fmt(r.JAC, 0)}·${fmt(r.Gm, 0)}) = ${f4(r.phiA)} rad   (C sabit)
r_A·φ_A = r_D·φ_D  →  φ_D = (${p.rA}/${p.rD})·${f4(r.phiA)} = ${f4(r.phiD)} rad
φ_DF = ${fmt(r.TFn, 0)}·${p.L}/(${fmt(r.JDF, 0)}·${fmt(r.Gm, 0)}) = ${f4(r.phiDF)} rad
φ_F = φ_D + φ_DF = ${f4(r.phiF)} rad  (= ${f2(r.phiFdeg)}°)`,
  tuzak: ['<b>Devri rad/s\'ye çevirmemek.</b> T = 3200/1200 yazarsan 2,67 N·m bulursun; doğrusu ω = π·n/30 ile 25,46 N·m.',
    '<b>kW\'ı W\'a çevirmemek.</b> 3,2 değil 3200 W.',
    '<b>Dişli oranını ters kurmak.</b> Tork büyük dişlide büyük: T_C = (r_A/r_D)·T_F. Açı küçük dişlide büyük: φ_D = (r_A/r_D)·φ_A.',
    '<b>Formülde çap kullanmak.</b> J = π·c⁴/2 ve τ = T·c/J\'de c yarıçap. Sonunda d = 2c yaz.',
    '<b>φ_F\'yi sadece φ_DF sanmak.</b> D ucu da döndü (AC\'nin burulması dişliden geçti). İkisini topla.',
    '<b>Birim karışıklığı.</b> T N·mm, L mm, G MPa (N/mm²), c mm: açı radyan çıkar. G = 77 GPa = 77 000 MPa.'],
  hoca: `<p>Hocanın sonuçları: T<sub>F</sub> = 25,465 N·m; T<sub>C</sub> = 42 441,66 N·mm; c<sub>DF</sub> = 6,46 mm → <b>d<sub>DF</sub> = 12,92 mm</b>; c<sub>AB</sub> = 7,66 mm → <b>d<sub>AB</sub> = 15,32 mm</b>; φ<sub>DF</sub> = 0,0362 rad; φ<sub>D</sub> = 1,66·φ<sub>A</sub> = 0,0507 rad; <b>φ<sub>F</sub> = 0,0869 rad = 4,97°</b>.</p>
    <p>Buradaki hesap: d<sub>DF</sub> = 12,93 mm, d<sub>AC</sub> = 15,33 mm, φ<sub>D</sub> = 0,0508 rad, φ<sub>F</sub> = 0,0870 rad (4,98°). Yöntem birebir aynı; farklar yuvarlamadan: hoca c'leri iki haneye kesmiş (6,4648 → 6,46; 7,6649 → 7,66) ve 100/60 oranını 1,667 yerine 1,66 almış. Sınavda iki sonuç da doğru sayılır. Hocanın "AB şaftı" dediği, buradaki AC şaftı.</p>`,
  gen() {
    const rD = rnd(40, 90, 5), rA = rnd(rD + 20, Math.min(200, rD * 2.5), 5);
    return { P: rnd(1, 10, 0.2), n: rnd(600, 2400, 100), rA, rD, tau: rnd(40, 90, 5), L: rnd(200, 800, 50), G: pick([75, 77, 80]) };
  },
  pracText: p => `Aynı düzen: F'deki motor ${f1(p.P)} kW, ${fmt(p.n, 0)} dev/dk ile DF şaftını döndürüyor. D dişlisinin yarıçapı ${p.rD} mm, A dişlisininki ${p.rA} mm. C ucu makineye bağlı (sabit kabul et). İçi dolu çelik şaftlar: τ_em = ${p.tau} MPa, G = ${p.G} GPa, boylar ${p.L} mm. T_F, iki şaftın çapı ve F ucunun burulma açısı (radyan) kaç?`,
  ans: [{ k: 'TF', ad: 'T_F', u: 'N·m' }, { k: 'dDF', ad: 'd_DF', u: 'mm' }, { k: 'dAC', ad: 'd_AC', u: 'mm' }, { k: 'phiF', ad: 'φ_F', u: 'rad' }],
  hints: (p, r) => [`ω = π·${fmt(p.n, 0)}/30 = ${f2(r.w)} rad/s; T_F = P/ω (P watt).`,
    `T_C = (${p.rA}/${p.rD})·T_F = ${f2(r.TC)} N·m. c = ∛(2T/(π·τ_em)) — T'yi N·mm yaz, sonunda d = 2c.`,
    `φ_A = T_C·L/(J_AC·G), φ_D = (${p.rA}/${p.rD})·φ_A, φ_DF = T_F·L/(J_DF·G); φ_F = φ_D + φ_DF.`],
  diag(p, r, u) {
    const near = (a, b) => isFinite(a) && Math.abs(a - b) <= Math.abs(b) * 0.02;
    if (near(u.TF, r.wrong.Tn) || near(u.TF, r.wrong.Tn * 1000)) return 'Devri rad/s\'ye çevirmeden bölmüşsün: ω = π·n/30.';
    if (near(u.TF, r.wrong.T2pi) || near(u.TF, r.wrong.T2pi * 1000)) return '2π·n yazmışsın ama 60\'a bölmedin: dakikayı saniyeye çevir.';
    if (near(u.TF, r.TF / 1000) || near(u.TF, r.TFn)) return 'Birim: kW → W (× 1000) ve sonuç N·m olarak istendi.';
    if (near(u.dDF, r.cDF) || near(u.dAC, r.cAC)) return 'Yarıçapı (c) yazmışsın; çap d = 2c.';
    if (near(u.dAC, 2 * Math.cbrt(2 * r.TFn * p.rD / p.rA / (Math.PI * p.tau)))) return 'Dişli oranı ters: büyük dişlinin torku büyük, T_C = (r_A/r_D)·T_F.';
    if (near(u.phiF, r.phiDF)) return 'Sadece DF\'nin burulmasını yazmışsın; D ucu da döndü: φ_F = φ_D + φ_DF.';
    if (near(u.phiF, r.phiDF + r.phiA)) return 'φ_A\'yı D\'ye taşırken dişli oranını unuttun: φ_D = (r_A/r_D)·φ_A.';
    if (near(u.phiF, r.phiDF + r.phiA * p.rD / p.rA)) return 'Açı oranı ters: küçük dişli daha çok döner, φ_D = (r_A/r_D)·φ_A.';
    if (near(u.phiF, r.phiFdeg)) return 'Derece yazmışsın; radyan isteniyor.';
    return 'Sıra: T_F → T_C → c = ∛(2T/(πτ)) → φ_A → φ_D → φ_DF → topla.';
  }
});
