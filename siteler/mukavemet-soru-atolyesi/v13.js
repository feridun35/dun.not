'use strict';
/* ============ VİZE 13 · 2017–18 Güz vizesi · Soru 3 (dişlilerle bağlı iki şaft, burma) ============ */
VIZE.push({
  id: 'v13', no: 13, kod: 'V13', vize: true, tip: 'bu',
  src: '2017–18 Güz vizesi · Soru 3',
  img: 'img/v13.png',
  ad: 'Dişlilerle bağlı iki şaft: en büyük tork ve A\'nın dönmesi',
  ozet: 'A\'ya uygulanan tork, küçük dişliden büyük dişliye büyüyerek geçer. Her şaftın taşıyabileceği torku bul, A\'ya taşı, küçüğünü al. Sonra açıları topla.',
  soru: 'İçi dolu çelik şaftlar, şekilde gösterilen dişlilere bağlanmıştır. [Her bir] şaft için G = 70 GPa ve emniyet kayma gerilmesi 60 MPa olduğuna göre, (a) AB şaftının A ucunda uygulanabilecek en büyük T₀ torkunu, (b) AB şaftının A ucunun dönmesiyle oluşan karşı gelen dönme açısı φ<sub>A</sub>\'yı belirleyiniz. <br><small style="opacity:.75">Fotoğrafın sağ kenarı kesik; köşeli parantezdeki ve satır sonlarındaki kelimeler tamamlandı. Şekildeki ölçüler şöyle okundu: 25 mm ve 19 mm şaft <b>çapları</b> (oklar şaftın iki yanını gösteriyor), 60 mm ve 22 mm dişli <b>yarıçapları</b> (çizgi merkezden dişe gidiyor), 900 mm C–D, 600 mm B–A boyu.</small>',
  verilen: ['CD şaftı: d = 25 mm (c = 12,5 mm), L = 900 mm; D ucu duvara gömülü (dönemez)', 'AB şaftı: d = 19 mm (c = 9,5 mm), L = 600 mm; A ucu yatakta serbest', 'C dişlisi r<sub>C</sub> = 60 mm (CD\'nin ucunda), B dişlisi r<sub>B</sub> = 22 mm (AB\'nin ucunda)', 'G = 70 GPa, τ<sub>em</sub> = 60 MPa (iki şaft için)', 'Kâğıttaki formüller: φ = T·L/(J·G), τ<sub>max</sub> = T·c/J, J = π·c⁴/2'],
  istenen: '(a) En büyük T₀ ; (b) A ucunun dönme açısı φ<sub>A</sub>',
  p0: { L1: 600, L2: 900, d1: 19, d2: 25, rB: 22, rC: 60, G: 70, tau: 60 },
  solve(p) {
    const c1 = p.d1 / 2, c2 = p.d2 / 2, J1 = Math.PI * c1 ** 4 / 2, J2 = Math.PI * c2 ** 4 / 2, n = p.rC / p.rB, Gm = p.G * 1000;
    const Ta1 = p.tau * J1 / c1 / 1000, Ta2 = p.tau * J2 / c2 / 1000; // N·m
    const T0b = Ta2 / n, T0 = Math.min(Ta1, T0b), gov = Ta1 <= T0b ? 'AB' : 'CD', TCD = n * T0;
    const tau1 = T0 * 1000 * c1 / J1, tau2 = TCD * 1000 * c2 / J2;
    const phiCD = TCD * 1000 * p.L2 / (J2 * Gm), phiB = n * phiCD, phiAB = T0 * 1000 * p.L1 / (J1 * Gm), phiA = phiB + phiAB;
    const dg = 180 / Math.PI;
    return { c1, c2, J1, J2, n, Ta1, Ta2, T0b, T0, gov, TCD, tau1, tau2, phiCD, phiB, phiAB, phiA, phiAd: phiA * dg, phiCDd: phiCD * dg, phiBd: phiB * dg, phiABd: phiAB * dg };
  },
  anlam: [
    ['İçi dolu çelik şaft', 'Kesit tam daire: J = π·c⁴/2, c = yarıçap = çap / 2. (Boru olsaydı iç kısmı çıkarırdık.)'],
    ['dişlilere bağlanmış', 'İki şaft dişliyle konuşuyor. Temas noktasında <b>kuvvet aynı</b>, <b>yay uzunluğu aynı</b>. Tork ve açı yarıçap oranıyla değişir.'],
    ['D (sabit uç)', 'CD\'nin D ucu dönemez. C dişlisinin dönmesi tamamen CD\'nin burulmasından gelir: φ<sub>C</sub> = φ<sub>CD</sub>.'],
    ['emniyet kayma gerilmesi 60 MPa', 'Burmada gerilme <b>kayma</b> gerilmesidir: τ = T·c/J. İki şaftta da τ ≤ 60 MPa olmalı.'],
    ['A ucunda uygulanabilecek en büyük T₀', 'İki şart var (iki şaft). Her şartı T₀ cinsinden yaz, <b>küçüğü</b> cevap: ikisi de sağlansın.'],
    ['G = 70 GPa', 'Sadece açı (b) için lazım: φ = T·L/(J·G). (a) şıkkında G kullanılmaz.'],
    ['A ucunun dönme açısı φ<sub>A</sub>', 'A, iki sebeple döner: B dişlisi döndüğü için (bütün AB döner) + AB\'nin kendi burulması.']
  ],
  tetik: ['şaft', 'dişli', 'tork T₀', 'emniyet kayma gerilmesi', 'G verilmiş', 'dönme açısı φ'],
  tetikNot: '"Şaft + dişli + tork" görünce burma tarifi. "En büyük tork" = her şaft için ayrı sınır, sonra küçüğü. "Dönme açısı" = φ = TL/(JG) ve dişli temasında r·φ eşitliği.',
  zincir: [
    ['Tork nereden nereye gidiyor?', 'A → AB şaftı → B dişlisi → (temas) → C dişlisi → CD şaftı → D duvarı.'],
    ['AB\'deki tork ne?', 'Tamamen T₀. Arada başka tork yok.'],
    ['CD\'deki tork ne?', 'Temas kuvveti F aynı: T₀ = F·r<sub>B</sub>, T<sub>CD</sub> = F·r<sub>C</sub>. Yani T<sub>CD</sub> = (r<sub>C</sub>/r<sub>B</sub>)·T₀ = 2,73·T₀. Büyük dişli, büyük tork.'],
    ['Her şaft en çok ne taşır?', 'τ = T·c/J\'de τ yerine 60 MPa koy: T<sub>izin</sub> = 60·J/c.'],
    ['Hangisi belirler?', 'İki şartı T₀ cinsinden yaz; küçük olan cevap.'],
    ['A neden döner?', 'CD burulur → C döner → B, r<sub>C</sub>/r<sub>B</sub> kat fazla döner → AB bütün olarak döner, üstüne kendi burulması eklenir.']
  ],
  cam: { yaw: -0.42, pitch: 0.3, dist: 14.5, t: [3.9, 0.5, 0] },
  steps: [
    { t: 'Şekle bak: ne var, ne yok', st: { lab: 1, dim: 1, load: 1 },
      h: (p) => `İki çelik şaft yan yana duruyor. <b>Üstteki CD</b> (çapı ${p.d2} mm, boyu ${p.L2} mm): sağ ucu D'de duvara gömülü, dönemez; sol ucunda <b>büyük dişli C</b> (r = ${p.rC} mm). <b>Alttaki AB</b> (çapı ${p.d1} mm, boyu ${p.L1} mm): sol ucunda <b>küçük dişli B</b> (r = ${p.rB} mm), sağ ucu A yatakta serbest döner. A'ya T₀ torku uygulanıyor. İki dişli birbirine geçmiş. (Şaft ve dişli çapları görünsün diye büyütüldü.)`,
      why: '<b>Burma ne?</b> Bir çubuğu bir ucundan tutup öbür ucundan çevirmek: ıslak havluyu sıkmak gibi. Çeviren etkiye <b>tork</b> denir (T, birimi N·m = kuvvet × kol). Burmada parçanın kesitleri birbirine göre kayar, bu yüzden oluşan gerilme <b>kayma gerilmesi τ</b>\'dur, çekme değil.' },
    { t: 'Torkun yolu: A\'dan D duvarına', st: { lab: 1, load: 1, path: 1, react: 1 },
      h: () => 'T₀ önce AB şaftını burar. AB, ucundaki B dişlisini çevirir. B dişlisi temas noktasında C dişlisini bir <b>F</b> kuvvetiyle iter. C dişlisi CD şaftını burar. CD\'yi en sonda D duvarı tutar (beyaz ok: duvarın tepkisi). Her şaft, taşıdığı torku kendi boyu boyunca aynen taşır: AB\'nin her yerinde T₀, CD\'nin her yerinde T<sub>CD</sub>.',
      why: 'Şaftın üstünde başka dişli ya da kasnak yoksa iç tork sabittir. Bu soruda her şaftta tek bir tork değeri var; bu işi çok kolaylaştırıyor.' },
    { t: 'Dişli: kuvvet aynı, tork yarıçapla büyür', st: { lab: 1, F: 1, rad: 1, mk: 0, gv: 1, load: 0 }, cam: { yaw: -1.32, pitch: 0.14, dist: 6.4, t: [0.3, 0.7, 0.1] },
      h: (p, r) => `Dişlerin temas ettiği yerde B, C'yi <b>F</b> ile iter; C de B'yi aynı F ile geri iter (etki–tepki). Tork = kuvvet × yarıçap. Aynı F, büyük dişlide (r<sub>C</sub> = ${p.rC} mm) daha büyük tork yapar. Oran n = r<sub>C</sub>/r<sub>B</sub> = ${p.rC}/${p.rB} = <b>${f3(r.n)}</b>.`,
      f: (p, r) => `F = T₀ / r<sub>B</sub> = T<sub>CD</sub> / r<sub>C</sub> → <b>T<sub>CD</sub> = (${p.rC}/${p.rB})·T₀ = ${f3(r.n)}·T₀</b>`,
      why: 'Bisiklet vitesini düşün: küçük dişliden büyük dişliye geçen tork büyür, ama büyük dişli daha yavaş (daha az açı) döner. Tork ne kadar büyürse açı o kadar küçülür; bunu 7. adımda göreceğiz.' },
    { t: 'Her şaft en çok ne kadar tork taşır?', st: { lab: 1, sec: 1 },
      h: (p, r) => `Burmada kayma gerilmesi şaftın ortasında sıfır, <b>dış yüzeyde en büyük</b>: τ<sub>max</sub> = T·c/J. c yarıçap, J = π·c⁴/2 kesitin burulmaya direnci. τ<sub>max</sub> yerine emniyet değeri ${p.tau} MPa yazıp T'yi çözüyoruz: T<sub>izin</sub> = τ<sub>em</sub>·J/c.`,
      f: (p, r) => `AB: c = ${f2(r.c1)} mm, J = π·${f2(r.c1)}⁴/2 = ${fmt(r.J1, 0)} mm⁴ → T<sub>AB,izin</sub> = ${p.tau}·${fmt(r.J1, 0)}/${f2(r.c1)} = ${fmt(r.Ta1 * 1000, 0)} N·mm = <b>${f1(r.Ta1)} N·m</b><br>CD: c = ${f2(r.c2)} mm, J = π·${f2(r.c2)}⁴/2 = ${fmt(r.J2, 0)} mm⁴ → T<sub>CD,izin</sub> = ${p.tau}·${fmt(r.J2, 0)}/${f2(r.c2)} = ${fmt(r.Ta2 * 1000, 0)} N·mm = <b>${f1(r.Ta2)} N·m</b>`,
      why: 'Neden c⁴? Dış kısımdaki malzeme hem daha çok yük taşır hem de merkeze uzak olduğu için daha büyük kolla çalışır. Bu yüzden çap biraz artınca dayanım çok artar: CD\'nin çapı AB\'nin 1,3 katı ama taşıyabileceği tork 2,3 katı (c³ ile orantılı). Birim: MPa = N/mm², mm⁴/mm = mm³ → N·mm. 1000\'e bölüp N·m yap.' },
    { t: 'A\'ya taşı, küçüğünü seç → (a)', st: { lab: 1, sec: 1, gov: 1, load: 1 },
      h: (p, r) => `Her iki şart da T₀ cinsinden yazılmalı. AB'deki tork zaten T₀. CD'deki tork ${f3(r.n)}·T₀ olduğu için CD'nin sınırını ${f3(r.n)}'e <b>bölüyoruz</b>. İki şart da sağlanmalı, o yüzden <b>küçüğü</b> cevap. Burada ${r.gov === 'CD' ? 'kalın CD şaftı belirliyor: kalın ama dişli yüzünden ' + f2(r.n) + ' kat fazla tork taşıyor' : 'ince AB şaftı belirliyor'}.`,
      f: (p, r) => `AB şartı: T₀ ≤ <b>${f1(r.Ta1)} N·m</b><br>CD şartı: ${f3(r.n)}·T₀ ≤ ${f1(r.Ta2)} → T₀ ≤ <b>${f1(r.T0b)} N·m</b><br><b>T₀ = ${f1(r.T0)} N·m</b> (${r.gov} belirler)<br>Kontrol: τ<sub>AB</sub> = ${fmt(r.T0 * 1000, 0)}·${f2(r.c1)}/${fmt(r.J1, 0)} = ${f1(r.tau1)} MPa ≤ ${p.tau} ✓ ; τ<sub>CD</sub> = ${f1(r.tau2)} MPa ✓`,
      why: 'Büyüğü seçseydin (80,8 N·m), CD\'deki tork 2,727·80,8 = 220 N·m olurdu ve CD\'de τ = 72 MPa çıkardı: emniyet sınırı aşılır. Küçüğü seçince ikisi de güvende.' },
    { t: 'Burulma açısı: CD ne kadar döner?', st: { lab: 1, tc: 1, hx: 1, mk: 1, react: 1 }, cam: { yaw: -0.5, pitch: 0.26, dist: 11, t: [3.6, 1.1, 0] },
      h: (p, r) => `Şaftın üstüne düz çizgiler çizdiğini düşün. Tork gelince çizgiler <b>helis gibi kıvrılır</b>: D ucu yerinde, C ucu döner (kırmızı çizgi; kesikli olan burulmadan önceki hali). C ucunun dönme açısı φ = T·L/(J·G). D dönmediği için φ<sub>C</sub> = φ<sub>CD</sub>. Bu adımda AB'yi henüz burulmamış (katı) düşün: B dişlisi dönünce bütün AB de onunla döner.`,
      f: (p, r) => `φ<sub>CD</sub> = T<sub>CD</sub>·L/(J·G) = ${fmt(r.TCD * 1000, 0)}·${p.L2} / (${fmt(r.J2, 0)}·${fmt(p.G * 1000, 0)}) = <b>${f4(r.phiCD)} rad</b> (${f2(r.phiCDd)}°)`,
      why: 'φ = T·L/(J·G) yayın kuvvet/rijitlik formülüne benzer: tork büyürse ve şaft uzunsa açı büyür; J (kesit) ve G (malzeme) büyürse açı küçülür. Birimler N·mm, mm, mm⁴, N/mm² olunca sonuç doğrudan radyan çıkar. Sahnede açılar görünsün diye yaklaşık 10 kat abartıldı (ABART kaydırıcısı).' },
    { t: 'Dişli teması: yay uzunlukları eşit', st: { lab: 1, tc: 1, arc: 1, mk: 1, gv: 1, load: 0 }, cam: { yaw: -1.32, pitch: 0.14, dist: 6.4, t: [0.3, 0.7, 0.1] },
      h: (p, r) => `Dişler kaymaz: C'nin çevresinden temas noktasından ne kadar yay geçerse, B'nin çevresinden de o kadar geçer (iki kırmızı yay eşit uzunlukta). Yay = yarıçap × açı. Küçük dişli aynı yayı almak için <b>daha çok döner</b>.`,
      f: (p, r) => `r<sub>C</sub>·φ<sub>C</sub> = r<sub>B</sub>·φ<sub>B</sub> → φ<sub>B</sub> = (${p.rC}/${p.rB})·${f4(r.phiCD)} = <b>${f4(r.phiB)} rad</b> (${f2(r.phiBd)}°)`,
      why: 'Torkta oran r<sub>C</sub>/r<sub>B</sub> ile çarpılıyordu (CD\'nin torku büyük), açıda da aynı oranla çarpılıyor ama bu sefer B tarafı büyük (küçük dişli çok döner). Hangi taraf büyük? "Küçük dişli: küçük tork, büyük açı."' },
    { t: 'AB\'nin kendi burulması', st: { lab: 1, tc: 1, tb: 1, hx: 1, mk: 1, load: 1 }, cam: { yaw: -0.5, pitch: 0.3, dist: 10, t: [2.8, 0.4, 0] },
      h: (p, r) => `Şimdi AB de burulsun. B ucu φ<sub>B</sub> kadar dönmüş durumda; A ucu bunun üstüne AB'nin kendi burulması kadar daha döner. AB'deki tork T₀, boyu ${p.L1} mm, J'si küçük (ince şaft).`,
      f: (p, r) => `φ<sub>A/B</sub> = T₀·L/(J·G) = ${fmt(r.T0 * 1000, 0)}·${p.L1} / (${fmt(r.J1, 0)}·${fmt(p.G * 1000, 0)}) = <b>${f4(r.phiAB)} rad</b> (${f2(r.phiABd)}°)`,
      why: 'φ<sub>A/B</sub> "A\'nın B\'ye göre dönmesi" demek: B dursaydı A ne kadar dönerdi. Gerçek dönme, B\'nin kendi dönmesi ile bunun toplamı.' },
    { t: 'Toplam: φ_A → (b)', st: { lab: 1, tc: 1, tb: 1, hx: 1, mk: 1, angA: 1, load: 0 }, cam: { yaw: 0.6, pitch: 0.32, dist: 7.5, t: [4.6, 0.3, 0] },
      h: (p, r) => `A ucunun toplam dönmesi = B dişlisinin dönmesi (bütün AB onunla döner) + AB'nin kendi burulması. İkisi aynı yönde (ikisi de T₀ yönünde), toplanır.`,
      f: (p, r) => `φ<sub>A</sub> = φ<sub>B</sub> + φ<sub>A/B</sub> = ${f4(r.phiB)} + ${f4(r.phiAB)} = <b>${f4(r.phiA)} rad = ${f2(r.phiAd)}°</b>`,
      why: 'Dikkat: CD\'nin açısını (φ<sub>CD</sub>) doğrudan eklemiyoruz; önce dişli oranıyla B\'ye çeviriyoruz. En sık yapılan hata φ<sub>CD</sub> + φ<sub>AB</sub> yazmak.' }
  ],
  scene(v, p, r) {
    const X = 0.01, Rs = 0.018, Rsh = 0.026, PI = Math.PI;
    const L1 = p.L1 * X, L2 = p.L2 * X, rB = p.rB * Rs, rC = p.rC * Rs, c1 = p.d1 / 2 * Rsh, c2 = p.d2 / 2 * Rsh, yC = rB + rC;
    const thB = 0.5, thC = 0.32, NB = 11, NC = Math.max(NB + 2, Math.round(NB * p.rC / p.rB));
    // dişli: y–z düzleminde profil, x ekseni boyunca kalınlık. Diş merkezi θ (Rx açısı, θ = 0 → +y) ↔ profil açısı α = θ + π/2
    const gear = (R, N, th, th0) => {
      const m = 2 * R / N, ra = R + m, rr = R - 1.25 * m, hp = PI / N, pts = [];
      for (let k = 0; k < N; k++) {
        const a = th0 + PI / 2 + 2 * PI * k / N;
        [[rr, -0.55], [ra, -0.28], [ra, 0.28], [rr, 0.55]].forEach(([q, s]) => pts.push([q * Math.cos(a + s * hp), q * Math.sin(a + s * hp)]));
      }
      const M = E3.extrude(pts, th);
      return { v: M.v.map(q => [q[2], q[1], -q[0]]), f: M.f };
    };
    const gB = v.add(gear(rB, NB, thB, 0), { color: '#c3cbd4', pos: [0, 0, 0] });
    const gC = v.add(gear(rC, NC, thC, PI + PI / NC), { color: '#a3adb8', pos: [0, yC, 0] });
    const hub = v.add(E3.cyl(Math.max(rB * 0.72, c1 + 0.05), 0.45, 20, 'x'), { color: '#b3bcc6', pos: [thB / 2 + 0.22, 0, 0] });
    const segs = (x0, x1, y, R) => { const n = Math.ceil((x1 - x0) / 1.2), w = (x1 - x0) / n, o = []; for (let i = 0; i < n; i++) o.push(v.add(E3.cyl(R, w, 22, 'x'), { color: C.steel, pos: [x0 + w * (i + 0.5), y, 0] })); return o; };
    const stub = segs(-0.95, -thC / 2, yC, c2), sCD = stub.concat(segs(-thC / 2, L2 + 0.2, yC, c2)), sAB = segs(thB / 2, L1, 0, c1);
    const lb = v.add(E3.box(0.4, 1.0, 1.0), { color: C.base, pos: [-1.05, yC, 0] }); // sol yatak
    const Dw = v.add(E3.box(0.5, 2.0, 2.0), { color: C.base, pos: [L2 + 0.25, yC, 0] }); // D duvarı
    const xb = L1 - 0.38;
    v.add(E3.tube(c1 + 0.13, c1, 0.3, 20, 'x'), { color: '#7f8b97', pos: [xb, 0, 0] });
    v.add(E3.box(0.3, 0.5, 0.45), { color: '#6b7783', pos: [xb, -0.45, 0] });
    v.add(E3.box(1.0, 0.1, 0.9), { color: C.base, pos: [xb, -0.75, 0], bias: 0.5 });
    const def = { lab: 1, dim: 0, load: 1, path: 0, react: 0, F: 0, rad: 0, sec: 0, gov: 0, tc: 0, tb: 0, hx: 0, arc: 0, mk: 0, angA: 0, gv: 0 };
    const arcPts = (x, yc, R, a0, a1, n = 24) => { const P = []; for (let i = 0; i <= n; i++) { const t = a0 + (a1 - a0) * i / n; P.push([x, yc + R * Math.cos(t), R * Math.sin(t)]); } return P; };
    const tArc = (O, x, yc, R, a0, a1, color, alpha, w = 2.6) => { const P = arcPts(x, yc, R, a0, a1), n = P.length; O.push({ k: 'line', p: P.slice(0, n - 1), color, w, alpha }); O.push({ k: 'arrow', a: P[n - 3], b: P[n - 1], color, w, hs: 11, alpha }); };
    return {
      def, apply(S, time, v) {
        lb.alpha = 1 - S.gv; stub.forEach(o => o.alpha = 1 - S.gv); Dw.alpha = 1 - 0.8 * S.angA;
        const O = v.ov, K = 2 + 20 * S.ex, eye = v._basis().eye;
        const phC = r.phiCD * K * S.tc, phB = phC * r.n, phAB = r.phiAB * K * S.tb, phA = phB + phAB;
        gB.rot = [phB, 0, 0]; hub.rot = [phB, 0, 0]; gC.rot = [-phC, 0, 0];
        const pl = S.path * (0.55 + 0.45 * loop(time, 2.4));
        const govCD = r.gov === 'CD' ? S.gov : 0, govAB = r.gov === 'AB' ? S.gov : 0;
        sAB.forEach(o => { o.glow = pl; o.color = mixHex(C.steel, C.red, govAB * 0.75); });
        sCD.forEach(o => { o.glow = pl; o.color = mixHex(C.steel, C.red, govCD * 0.75); });
        // yüzey çizgileri (yalnız kameraya bakan kısımlar çizilir)
        const helix = (x0, x1, yc, R, th, alpha, ri, tref) => {
          for (let i = 0; i < 4; i++) {
            const red = i === ri, base = i * PI / 2 - 0.35, col = red ? C.red : '#c9d0d8', w = red ? 3.2 : 1.4; let seg = [];
            const flush = () => { if (seg.length > 1) O.push({ k: 'line', p: seg, color: col, w, alpha: alpha * (red ? 1 : 0.55) }); seg = []; };
            for (let k = 0; k <= 60; k++) {
              const x = x0 + (x1 - x0) * k / 60, t = base + th(x), q = [x, yc - R * Math.sin(t), R * Math.cos(t)];
              if (-Math.sin(t) * (eye[1] - q[1]) + Math.cos(t) * (eye[2] - q[2]) > 0) seg.push(q); else flush();
            }
            flush();
          }
          const t0 = tref; O.push({ k: 'line', p: [[x0, yc - R * Math.sin(t0), R * Math.cos(t0)], [x1, yc - R * Math.sin(t0), R * Math.cos(t0)]], color: C.white, w: 1.6, dash: [6, 5], alpha: alpha * 0.75 });
        };
        if (S.hx > 0.01) {
          helix(thC / 2 + 0.05, L2, yC, c2 * 1.03, x => -phC * (1 - x / L2), S.hx * (1 - 0.7 * S.angA), 0, -0.35);
          const ri = ((Math.round(-r.phiCD * K * r.n / (PI / 2)) % 4) + 4) % 4;
          helix(thB / 2 + 0.7, xb - 0.2, 0, c1 * 1.04, x => phB + phAB * x / L1, S.hx, ri, ri * PI / 2 - 0.35 + phB);
          O.push({ k: 'text', t: `açılar ≈ ${Math.round(K)} kat abartılı`, p: [L2 * 0.55, yC + 1.5, 0], size: 12, color: C.mute, alpha: S.hx * (1 - S.angA) });
        }
        if (S.lab > 0.01) {
          const a = S.lab, a2 = a * (1 - S.gv), a3 = a2 * (1 - S.path) * (1 - S.hx) * (1 - S.sec);
          O.push({ k: 'text', t: 'A', p: [L1 + 0.15, 0.62, 0], size: 17, alpha: a2 });
          O.push({ k: 'text', t: 'B', p: [0.1, -rB - 0.45, 0.2], size: 17, alpha: a });
          O.push({ k: 'text', t: 'C', p: [-0.35, yC + 0.05, 0.3], size: 17, alpha: a });
          O.push({ k: 'text', t: 'D', p: [L2 - 0.2, yC + 0.55, 0], size: 17, alpha: a2 });
          O.push({ k: 'text', t: 'D: duvara gömülü\n(dönemez)', p: [L2 + 0.3, yC - 1.35, 0.9], size: 12, color: C.mute, box: 1, alpha: a2 * (1 - S.gov) * (1 - S.angA) });
          O.push({ k: 'text', t: 'yatak\n(serbest döner)', p: [xb + 0.2, -1.25, 0.5], size: 12, color: C.mute, box: 1, alpha: a2 * (1 - S.sec) * (1 - S.angA) });
          O.push({ k: 'text', t: `CD · Ø${p.d2} mm`, p: [L2 * 0.62, yC + 0.5, 0], size: 13, color: C.dim, alpha: a3 });
          O.push({ k: 'text', t: `AB · Ø${p.d1} mm`, p: [L1 * 0.5, -0.5, 0.3], size: 13, color: C.dim, alpha: a3 });
        }
        if (S.dim > 0.01) {
          O.push({ k: 'dim', a: [0, yC + rC + 0.1, 0], b: [L2, yC + rC + 0.1, 0], off: [0, 0.45, 0], t: `${p.L2} mm`, alpha: S.dim });
          O.push({ k: 'dim', a: [0, -rB - 0.1, 0.6], b: [L1, -rB - 0.1, 0.6], off: [0, -0.8, 0], t: `${p.L1} mm`, alpha: S.dim });
          O.push({ k: 'text', t: `r_C = ${p.rC} mm`, p: [-0.6, yC + rC + 0.35, 0], size: 13, color: C.dim, alpha: S.dim });
          O.push({ k: 'text', t: `r_B = ${p.rB} mm`, p: [-0.7, -rB - 0.35, 0.3], size: 13, color: C.dim, alpha: S.dim });
        }
        if (S.load > 0.01) {
          tArc(O, L1 - 0.12, 0, 0.42, -1.3, 2.1, C.red, S.load, 3);
          O.push({ k: 'text', t: S.gov > 0.5 || S.angA > 0.5 ? `T_0 = ${f1(r.T0)} N·m` : 'T_0', p: [L1 + 0.75, 0.25, 0.3], size: 15, color: C.red, box: 1, alpha: S.load });
        }
        if (S.react > 0.01) {
          tArc(O, L2 - 0.9, yC, 0.5, -1.3, 2.1, C.white, S.react, 2.4);
          O.push({ k: 'text', t: 'duvar tutar: T_CD', p: [L2 - 0.9, yC + 1.0, 0], size: 13, color: C.white, box: 1, alpha: S.react * (1 - S.hx) });
        }
        if (S.path > 0.01) {
          const a = S.path;
          O.push({ k: 'text', t: '1. AB burulur: T_0', p: [L1 * 0.55, -0.85, 0.3], size: 13, color: C.white, box: 1, alpha: a });
          O.push({ k: 'text', t: '2. B, C\'yi F ile iter', p: [-0.9, rB + 0.05, 0.6], size: 13, color: C.white, box: 1, alpha: a });
          O.push({ k: 'text', t: `3. CD burulur: T_CD = ${f2(r.n)}·T_0`, p: [L2 * 0.5, yC + 0.75, 0], size: 13, color: C.white, box: 1, alpha: a });
          O.push({ k: 'ring', c: [-thB / 2 - 0.02, rB, 0], r: 0.13, u: [0, 1, 0], v: [0, 0, 1], color: C.red, w: 2.2, alpha: a });
        }
        if (S.F > 0.01) {
          const xp = -thB / 2 - 0.05, cp = [xp, rB, 0];
          O.push({ k: 'arrow', a: cp, b: [xp, rB, 1.0], color: C.red, w: 3, alpha: S.F });
          O.push({ k: 'arrow', a: cp, b: [xp, rB, -1.0], color: C.white, w: 3, alpha: S.F });
          O.push({ k: 'text', t: 'F: B, C\'yi iter', p: [xp, rB + 0.28, 1.25], size: 13, color: C.red, box: 1, alpha: S.F });
          O.push({ k: 'text', t: 'F: C, B\'yi geri iter', p: [xp, rB - 0.3, -1.35], size: 13, color: C.white, box: 1, alpha: S.F });
        }
        if (S.rad > 0.01) {
          const xr = -thC / 2 - 0.04;
          O.push({ k: 'line', p: [[xr, yC, 0], [xr, yC - rC, 0]], color: C.dim, w: 1.6, alpha: S.rad });
          O.push({ k: 'line', p: [[-thB / 2 - 0.04, 0, 0], [-thB / 2 - 0.04, rB, 0]], color: C.dim, w: 1.6, alpha: S.rad });
          O.push({ k: 'text', t: `r_C = ${p.rC} mm\nT_CD = F·r_C`, p: [xr, yC + 0.15, -0.55], size: 13, color: C.dim, box: 1, alpha: S.rad });
          O.push({ k: 'text', t: `r_B = ${p.rB} mm\nT_0 = F·r_B`, p: [xr, -0.55, -0.55], size: 13, color: C.dim, box: 1, alpha: S.rad });
        }
        if (S.sec > 0.01) {
          const a = S.sec, xm1 = L1 * 0.45, xm2 = L2 * 0.62;
          O.push({ k: 'ring', c: [xm1, 0, 0], r: c1 * 1.1, u: [0, 1, 0], v: [0, 0, 1], color: C.red, w: 2, alpha: a });
          O.push({ k: 'ring', c: [xm2, yC, 0], r: c2 * 1.1, u: [0, 1, 0], v: [0, 0, 1], color: C.red, w: 2, alpha: a });
          O.push({ k: 'text', t: `AB: c = ${f2(r.c1)} mm\nJ = ${fmt(r.J1, 0)} mm⁴\nT_izin = ${f1(r.Ta1)} N·m`, p: [xm1, -1.05, 0.3], size: 13, color: govAB > 0.5 ? C.red : C.white, box: 1, alpha: a });
          O.push({ k: 'text', t: `CD: c = ${f2(r.c2)} mm\nJ = ${fmt(r.J2, 0)} mm⁴\nT_izin = ${f1(r.Ta2)} N·m`, p: [xm2, yC + 1.05, 0], size: 13, color: govCD > 0.5 ? C.red : C.white, box: 1, alpha: a });
        }
        if (S.gov > 0.01) {
          O.push({ k: 'text', t: `A'ya taşı:\nAB → T_0 ≤ ${f1(r.Ta1)} N·m\nCD → T_0 ≤ ${f1(r.Ta2)} / ${f3(r.n)} = ${f1(r.T0b)} N·m`, p: [L2 + 1.4, -1.3, 0.6], size: 13, color: C.white, box: 1, alpha: S.gov });
        }
        if (S.mk > 0.01) {
          const a = S.mk, xc = -thC / 2 - 0.03, xbb = -thB / 2 - 0.03;
          O.push({ k: 'line', p: [[xc, yC, 0], [xc, yC + rC * 0.9, 0]], color: C.mute, w: 1.2, dash: [4, 4], alpha: a });
          O.push({ k: 'line', p: [[xc, yC, 0], [xc, yC + rC * 0.9 * Math.cos(-phC), rC * 0.9 * Math.sin(-phC)]], color: C.red, w: 2.6, alpha: a });
          O.push({ k: 'line', p: [[xbb, 0, 0], [xbb, -rB * 0.85, 0]], color: C.mute, w: 1.2, dash: [4, 4], alpha: a });
          O.push({ k: 'line', p: [[xbb, 0, 0], [xbb, -rB * 0.85 * Math.cos(phB), -rB * 0.85 * Math.sin(phB)]], color: C.red, w: 2.6, alpha: a });
          if (S.arc < 0.5 && S.tc > 0.5 && S.tb < 0.5) {
            O.push({ k: 'text', t: `φ_C = φ_CD = ${f4(r.phiCD)} rad`, p: [-0.4, yC + rC + 0.45, 0.3], size: 13, color: C.red, box: 1, alpha: a });
            O.push({ k: 'text', t: `φ_CD = ${f4(r.phiCD)} rad\n(D'de 0, C'de en büyük)`, p: [L2 * 0.45, yC + 1.0, 0], size: 13, color: C.red, box: 1, alpha: a * S.hx });
          }
        }
        if (S.arc > 0.01) {
          const a = S.arc, xbb = -thB / 2 - 0.05, xc = -thC / 2 - 0.05;
          O.push({ k: 'line', p: arcPts(xbb, 0, rB, 0, phB), color: C.red, w: 4, alpha: a });
          O.push({ k: 'line', p: arcPts(xc, yC, rC, PI, PI - phC), color: C.red, w: 4, alpha: a });
          O.push({ k: 'ring', c: [xbb, rB * Math.cos(phB), rB * Math.sin(phB)], r: 0.05, u: [0, 1, 0], v: [0, 0, 1], color: C.white, w: 2.5, alpha: a });
          O.push({ k: 'ring', c: [xc, yC + rC * Math.cos(PI - phC), rC * Math.sin(PI - phC)], r: 0.05, u: [0, 1, 0], v: [0, 0, 1], color: C.white, w: 2.5, alpha: a });
          O.push({ k: 'text', t: `C: yay = ${p.rC}·φ_C`, p: [xc, yC - 0.3, 1.45], size: 13, color: C.red, box: 1, alpha: a });
          O.push({ k: 'text', t: `B: yay = ${p.rB}·φ_B`, p: [xbb, -0.3, 1.25], size: 13, color: C.red, box: 1, alpha: a });
          O.push({ k: 'text', t: `yaylar eşit → φ_B = ${f2(r.n)}·φ_C = ${f4(r.phiB)} rad`, p: [xbb, -rB - 0.75, 0.2], size: 14, color: C.white, box: 1, alpha: a });
        }
        if (S.tb > 0.5 && S.hx > 0.5 && S.angA < 0.5) {
          O.push({ k: 'text', t: `φ_A/B = ${f4(r.phiAB)} rad\n(AB'nin kendi burulması)`, p: [L1 * 0.45, -1.0, 0.3], size: 13, color: C.red, box: 1, alpha: S.tb });
          O.push({ k: 'text', t: `B dişlisi: φ_B = ${f4(r.phiB)} rad`, p: [-0.5, -rB - 0.6, 0.3], size: 13, color: C.red, box: 1, alpha: S.tb });
        }
        if (S.angA > 0.01) {
          const a = S.angA, xa = L1 + 0.04, R = 0.8;
          O.push({ k: 'line', p: [[xa, 0, 0], [xa, R, 0]], color: C.mute, w: 1.4, dash: [4, 4], alpha: a });
          O.push({ k: 'line', p: [[xa, 0, 0], [xa, R * Math.cos(phA), R * Math.sin(phA)]], color: C.red, w: 3, alpha: a });
          O.push({ k: 'line', p: arcPts(xa, 0, R * 0.7, 0, phA), color: C.red, w: 1.6, alpha: a });
          O.push({ k: 'text', t: `φ_A = φ_B + φ_A/B\n= ${f4(r.phiB)} + ${f4(r.phiAB)}\n= ${f4(r.phiA)} rad = ${f2(r.phiAd)}°`, p: [L1 - 1.6, -1.3, 0], size: 14, color: C.white, box: 1, alpha: a });
          O.push({ k: 'text', t: `kesikli: A ucu başta\nkırmızı: A ucu şimdi\n(açı ≈ ${Math.round(K)} kat abartılı)\nT_0 = ${f1(r.T0)} N·m`, p: [L1 + 0.2, 1.5, 0], size: 12, color: C.mute, box: 1, alpha: a });
        }
      }
    };
  },
  whatif: {
    not: 'Şaft çaplarını ve dişli yarıçaplarını değiştir. Hangi şaftın belirlediğinin nasıl değiştiğine ve küçük dişli büyüdükçe φ<sub>A</sub>\'nın nasıl düştüğüne bak.',
    s: [{ k: 'd1', ad: 'AB çapı d₁', min: 12, max: 32, step: 1, u: 'mm' }, { k: 'd2', ad: 'CD çapı d₂', min: 15, max: 40, step: 1, u: 'mm' },
      { k: 'rB', ad: 'Küçük dişli r_B', min: 15, max: 55, step: 1, u: 'mm' }, { k: 'rC', ad: 'Büyük dişli r_C', min: 40, max: 120, step: 1, u: 'mm' }, { k: 'tau', ad: 'τ_em', min: 30, max: 120, step: 5, u: 'MPa' }],
    out: (p, r) => `<div class="mets"><div class="m"><small>AB şartı (T₀ ≤)</small><b>${f1(r.Ta1)} N·m</b></div><div class="m"><small>CD şartı (T₀ ≤)</small><b>${f1(r.T0b)} N·m</b></div>
      <div class="m red"><small>T₀ (${r.gov} belirler)</small><b>${f1(r.T0)} N·m</b></div><div class="m"><small>φ_A</small><b>${f4(r.phiA)} rad · ${f2(r.phiAd)}°</b></div></div>
      <p class="note">Oran n = r_C/r_B = ${f3(r.n)}. CD şartı T₀ ≤ T_CD,izin / n: n büyüdükçe CD daha çok zorlanır. T_izin çapın küpüyle büyür; çapı biraz artırmak çok fark eder. φ_A içinde CD'nin payı n·φ_CD = ${f4(r.phiB)} rad, AB'nin payı ${f4(r.phiAB)} rad.</p>`
  },
  kagit: (p, r) => `Dişli oranı: n = r_C/r_B = ${p.rC}/${p.rB} = ${f3(r.n)}   →   T_CD = n·T₀
J_AB = π·${f2(r.c1)}⁴/2 = ${fmt(r.J1, 0)} mm⁴      J_CD = π·${f2(r.c2)}⁴/2 = ${fmt(r.J2, 0)} mm⁴
(a) AB:  T₀ ≤ τ·J/c = ${p.tau}·${fmt(r.J1, 0)}/${f2(r.c1)} = ${fmt(r.Ta1 * 1000, 0)} N·mm = ${f1(r.Ta1)} N·m
    CD:  n·T₀ ≤ ${p.tau}·${fmt(r.J2, 0)}/${f2(r.c2)} = ${f1(r.Ta2)} N·m  →  T₀ ≤ ${f1(r.T0b)} N·m
    T₀,max = ${f1(r.T0)} N·m  (${r.gov} belirler)      T_CD = ${f1(r.TCD)} N·m
(b) φ_CD = T_CD·L/(J·G) = ${fmt(r.TCD * 1000, 0)}·${p.L2}/(${fmt(r.J2, 0)}·${fmt(p.G * 1000, 0)}) = ${f4(r.phiCD)} rad  (= φ_C, D sabit)
    r_C·φ_C = r_B·φ_B  →  φ_B = ${f3(r.n)}·${f4(r.phiCD)} = ${f4(r.phiB)} rad
    φ_A/B = T₀·L/(J·G) = ${fmt(r.T0 * 1000, 0)}·${p.L1}/(${fmt(r.J1, 0)}·${fmt(p.G * 1000, 0)}) = ${f4(r.phiAB)} rad
    φ_A = φ_B + φ_A/B = ${f4(r.phiB)} + ${f4(r.phiAB)} = ${f4(r.phiA)} rad = ${f2(r.phiAd)}°`,
  tuzak: ['<b>Dişli oranını unutmak.</b> CD\'deki tork T₀ değil, 2,727·T₀. Unutursan T₀ = 80,8 N·m çıkar ve CD\'de emniyet aşılır.',
    '<b>Oranı ters kullanmak.</b> CD\'nin sınırını n ile çarpmak (184,1·2,727) yanlış. A\'ya taşırken <b>bölünür</b>: küçük dişli tarafında tork küçüktür.',
    '<b>Çapı yarıçap yerine koymak.</b> τ = T·c/J ve J = π·c⁴/2\'de c yarıçap: 25 mm şaft için c = 12,5 mm.',
    '<b>Açıları doğrudan toplamak.</b> φ<sub>A</sub> = φ<sub>CD</sub> + φ<sub>AB</sub> yanlış. CD\'nin açısı önce dişli oranıyla B\'ye çevrilir: φ<sub>B</sub> = 2,727·φ<sub>CD</sub>.',
    '<b>Birimler.</b> T\'yi N·mm, L\'yi mm, J\'yi mm⁴, G\'yi N/mm² (70 GPa = 70 000 N/mm²) yaz: açı radyan çıkar. Dereceye çevirmek için × 180/π.',
    '<b>(a)\'da küçüğü almamak.</b> İki şart da sağlanmalı; büyüğü seçersen öbür şaft emniyeti aşar.'],
  hoca: `<p>Bu sorunun <b>cevap anahtarı PDF'te yok</b> (yalnız soru kâğıdının fotoğrafı var). Sonuçlar burada kâğıttaki değerlerle hesaplandı:</p>
    <p><b>(a)</b> T₀ = <b>67,5 N·m</b> (CD şaftı belirler; AB'den gelen sınır 80,8 N·m) &nbsp; <b>(b)</b> φ<sub>A</sub> = <b>0,2135 rad ≈ 12,2°</b> (φ<sub>CD</sub> = 0,0617 rad, φ<sub>B</sub> = 0,1683 rad, φ<sub>A/B</sub> = 0,0452 rad).</p>
    <p><b>Varsayımlar:</b> Fotoğrafın sağ kenarı kesik; "Her bir şaft için", "T₀ torkunu", "karşı gelen dönme açısı" ifadeleri tamamlandı. Şekilde 25 ve 19 mm şaft çapı, 60 ve 22 mm dişli yarıçapı, 900 mm C–D ve 600 mm B–A boyu olarak okundu (Beer &amp; Johnston'daki aynı şekilli soruyla uyumlu). Sol yatak ve A yatağı şaftın dönmesine engel olmuyor, yalnız D ucu sabit.</p>
    <p><b>Not:</b> Çelik için G genelde 77–80 GPa civarındadır; kâğıtta 70 GPa yazıyor, hesapta o kullanıldı. (a) şıkkı G'ye bağlı değil; (b) G = 77 GPa ile ≈ 0,194 rad olurdu.</p>`,
  gen() {
    return { L1: rnd(400, 900, 50), L2: rnd(600, 1200, 50), d1: rnd(15, 25, 1), d2: rnd(20, 36, 1), rB: rnd(20, 40, 2), rC: rnd(50, 100, 5), G: pick([70, 77, 80]), tau: pick([40, 50, 55, 60, 70]) };
  },
  pracText: p => `Aynı düzen. CD şaftı: d = ${p.d2} mm, L = ${p.L2} mm, D ucu duvara gömülü, C ucunda r<sub>C</sub> = ${p.rC} mm dişli. AB şaftı: d = ${p.d1} mm, L = ${p.L1} mm, B ucunda r<sub>B</sub> = ${p.rB} mm dişli, A ucuna T₀ uygulanıyor. G = ${p.G} GPa, τ<sub>em</sub> = ${p.tau} MPa. (a) En büyük T₀? (b) Bu T₀ ile B dişlisinin dönme açısı φ<sub>B</sub> (rad) ve A ucunun dönme açısı φ<sub>A</sub> (derece)?`,
  ans: [{ k: 'T0', ad: 'T₀ (en büyük)', u: 'N·m' }, { k: 'phiB', ad: 'φ_B', u: 'rad' }, { k: 'phiAd', ad: 'φ_A', u: '°' }],
  hints: (p, r) => [`Oran n = r_C/r_B = ${p.rC}/${p.rB} = ${f3(r.n)}. CD'deki tork n·T₀.`,
    `Her şaft için T_izin = τ_em·J/c, J = π·c⁴/2, c = d/2. AB: ${f1(r.Ta1)} N·m. CD: ${f1(r.Ta2)} N·m → A'ya taşırken n'e böl. Küçüğünü al.`,
    `φ_CD = T_CD·L_CD/(J_CD·G). φ_B = n·φ_CD. φ_A = φ_B + T₀·L_AB/(J_AB·G), sonra × 180/π.`],
  diag(p, r, u) {
    const near = (a, b) => isFinite(a) && Math.abs(a - b) <= Math.abs(b) * 0.02, dg = 180 / Math.PI;
    if (near(u.T0, Math.min(r.Ta1, r.Ta2)) && !near(r.T0, Math.min(r.Ta1, r.Ta2))) return 'Dişli oranını unuttun: CD\'deki tork T₀ değil n·T₀. CD\'nin sınırını n\'e böl.';
    if (near(u.T0, r.Ta2 * r.n)) return 'Oranı ters uygulamışsın: CD\'nin sınırını A\'ya taşırken n ile çarpılmaz, n\'e bölünür.';
    if (near(u.T0, Math.max(r.Ta1, r.T0b))) return 'İki şarttan büyüğünü almışsın. İki şaft da güvende olmalı: küçüğü cevap.';
    if (near(u.T0, r.T0 * 8)) return 'c yerine çapı kullanmış olabilirsin: c = d/2.';
    if (near(u.phiB, r.phiCD)) return 'φ_B, φ_C ile aynı değil: dişli temasında r_C·φ_C = r_B·φ_B. Küçük dişli daha çok döner.';
    if (near(u.phiB, r.phiCD / r.n)) return 'φ_B için oranı ters kullanmışsın: φ_B = (r_C/r_B)·φ_C, küçük dişli daha çok döner.';
    if (near(u.phiAd, r.phiA)) return 'φ_A\'yı radyan yazmışsın; derece isteniyor: × 180/π.';
    if (near(u.phiAd, (r.phiCD + r.phiAB) * dg)) return 'φ_CD\'yi doğrudan eklemişsin. Önce dişli oranıyla B\'ye çevir: φ_B = n·φ_CD.';
    if (near(u.phiAd, r.phiBd)) return 'AB\'nin kendi burulmasını (φ_A/B = T₀·L/(J·G)) eklemeyi unuttun.';
    if (near(u.phiAd, r.phiABd)) return 'Sadece AB\'nin burulmasını yazmışsın; B dişlisinin dönmesi φ_B de eklenir.';
    return 'Sıra: n → her şaft için T_izin → A\'ya taşı, küçüğü → φ_CD → φ_B = n·φ_CD → φ_A = φ_B + φ_A/B.';
  }
});
