'use strict';
/* ============ VİZE 1 · 2016–17 Yaz · Soru 1 ============ */
VIZE.push({
  id: 'v1', no: 1, kod: 'V1', vize: true, tip: 'km',
  src: '2016–17 Yaz vizesi · Soru 1',
  img: 'img/v1.png', cevapImg: 'img/v1_cevap.png',
  ad: 'L dirsek: çubuk, pim ve konsol',
  ozet: 'Bir yük, üç parçayı üç ayrı biçimde zorluyor: çubuk çekilir, pim kesilir, konsol ezilir. Önce dirseğin dengesi, sonra her parça için "alan = kuvvet / izin verilen gerilme".',
  soru: 'Şekilde gösterilen BCD dirseğine şekildeki gibi iki kuvvet uygulanmaktadır. (a) AB kontrol çubuğu 600 MPa kopma normal gerilmesine sahip çelikten yapıldığına göre çubuğun çapını, emniyet katsayısı 2 olacak şekilde belirleyiniz. (b) C\'deki pim kopma kayma gerilmesi 360 MPa olan bir çelikten yapılacaktır. C piminin çapını, kesmeye göre emniyet katsayısı 2 olacak şekilde belirleyiniz. (c) Kullanılan çeliğin emniyet yatak gerilmesi 300 MPa olduğuna göre C\'deki konsol mesnetlerin gerekli kalınlığını belirleyiniz.',
  verilen: ['B, C\'nin 0,6 m üstünde; AB çubuğu yatay, A\'dan P ile sola çekiliyor',
    'Yatay kolda C\'den 0,3 m sonra 15 kN, 0,6 m sonra (D ucu) 50 kN, ikisi de aşağı',
    'AB: σ<sub>kopma</sub> = 600 MPa, E.K. = 2',
    'C pimi: τ<sub>kopma</sub> = 360 MPa, E.K. = 2; dirsek iki konsolun arasında (yandan görünüş: t | | t)',
    'Konsol çeliği: σ<sub>yatak,em</sub> = 300 MPa'],
  istenen: '(a) d<sub>AB</sub> · (b) d<sub>C</sub> · (c) konsol kalınlığı t',
  p0: { F1: 15, F2: 50, a: 0.3, b: 0.3, h: 0.6, sU: 600, tU: 360, sB: 300, EK: 2 },
  solve(p) {
    const x2 = p.a + p.b, MC = p.F1 * p.a + p.F2 * x2, P = MC / p.h;
    const sa = p.sU / p.EK, AAB = P * 1000 / sa, dAB = Math.sqrt(4 * AAB / Math.PI);
    const Cx = P, Cy = p.F1 + p.F2, FC = Math.hypot(Cx, Cy), ang = Math.atan2(Cy, Cx) * 180 / Math.PI;
    const ta = p.tU / p.EK, AC = FC * 1000 / (2 * ta), dC = Math.sqrt(4 * AC / Math.PI);
    const Fk = FC / 2, Ab = Fk * 1000 / p.sB, t = Ab / dC;
    return {
      x2, MC, P, sa, AAB, dAB, Cx, Cy, FC, ang, ta, AC, dC, Fk, Ab, t,
      // yanlış yolların sonuçları (teşhis için)
      Pw: (p.F1 * p.a + p.F2 * p.b) / p.h, dAB0: Math.sqrt(4 * P * 1000 / (Math.PI * p.sU)),
      dC1: Math.sqrt(4 * FC * 1000 / (Math.PI * ta)), dCy: Math.sqrt(4 * Cy * 1000 / (2 * Math.PI * ta)),
      dC0: Math.sqrt(4 * FC * 1000 / (2 * Math.PI * p.tU)), tFull: 2 * t, tPi: Fk * 1000 / (p.sB * Math.PI * dC / 2)
    };
  },
  anlam: [
    ['BCD dirseğine iki kuvvet', 'L biçimli <b>rijit</b> bir parça. C\'de pime takılı, B\'den AB çubuğu tutuyor. Bilinmeyenler: P, C<sub>x</sub>, C<sub>y</sub>. Üç denge denklemi yeter.'],
    ['AB kontrol çubuğu', 'İki ucundan pimli, ortasına yük gelmeyen çubuk: kuvvet çubuk ekseni boyunca, yani <b>yatay</b>. Çubuktaki kuvvet P.'],
    ['600 MPa kopma normal gerilmesi, emniyet katsayısı 2', 'Kopma değeri izin verilen değer değil. İzin verilen: σ<sub>em</sub> = 600 / 2 = 300 MPa.'],
    ['C\'deki pim … kopma kayma gerilmesi 360 MPa', 'Pim <b>kesilmeye</b> çalışılıyor (kayma). İzin verilen τ<sub>em</sub> = 360 / 2 = 180 MPa.'],
    ['şekildeki küçük yandan görünüş: t | | t', 'Dirsek <b>iki konsol plakanın ortasında</b>. Pim iki yerden kesilir: çift kesme, alan 2 · πd²/4.'],
    ['C\'deki pim kuvveti', 'Pim C\'deki <b>bileşke</b> kuvveti taşır: √(C<sub>x</sub>² + C<sub>y</sub>²). Sadece düşey bileşen değil.'],
    ['emniyet yatak gerilmesi 300 MPa', 'Pim deliğin iç yüzeyine <b>bastırır</b> (ezme). Alan t · d (deliğin izdüşümü). Bu değer zaten izin verilen değer: tekrar 2\'ye bölme.'],
    ['konsol mesnetlerin kalınlığı', 'Bilinmeyen t. d, (b)\'de bulduğun pim çapı. Her konsol F<sub>C</sub>/2 taşır.']
  ],
  tetik: ['dirsek + çubuk + pim', 'kopma gerilmesi + emniyet katsayısı', 'çapını belirleyiniz', 'pim + iki konsol (çatal)', 'yatak gerilmesi', 'konsol kalınlığı'],
  tetikNot: 'Üç ayrı "belirleyiniz" var ama hepsi aynı kalıp: kuvveti bul, izin verilen gerilmeye böl, çıkan alandan boyutu çek. Fark sadece ALANIN ne olduğunda: çubukta dolu daire, pimde iki daire (çift kesme), konsolda t · d dikdörtgeni.',
  zincir: [
    ['Ne isteniyor?', 'Üç boyut: çubuk çapı, pim çapı, konsol kalınlığı. Hepsi <b>gerekli alan = kuvvet / izin verilen gerilme</b>.'],
    ['Kuvvetler nereden gelecek?', 'Dirseğin dengesinden. Dirseği ayır: P, C<sub>x</sub>, C<sub>y</sub> ve iki yük.'],
    ['P\'yi nasıl bulurum?', 'C\'ye göre moment: C<sub>x</sub> ve C<sub>y</sub> C\'den geçer, düşer. Tek bilinmeyen P kalır.'],
    ['Pim hangi kuvveti taşır?', 'C\'deki bileşke: ΣF<sub>x</sub> ile C<sub>x</sub>, ΣF<sub>y</sub> ile C<sub>y</sub>, sonra Pisagor.'],
    ['Pim kaç yerden kesilir?', 'Dirsek iki konsolun arasında: iki kesme düzlemi. Her biri F<sub>C</sub>/2.'],
    ['Konsolda ne olur?', 'Pim deliğe bastırır: yatak gerilmesi. Kuvvet F<sub>C</sub>/2, alan t · d.']
  ],
  cam: { yaw: -0.32, pitch: 0.14, dist: 17.5, t: [0.9, 2.3, 0] },
  steps: [
    { t: 'Şekle bak: dirsek, çubuk, pim', st: { lab: 1, dim: 1, load: 1 },
      h: (p) => `L biçimli BCD dirseği C'de bir <b>pime</b> takılı. Pim, dirseğin iki yanındaki <b>iki konsol</b> plakasından geçiyor (şekildeki küçük yandan görünüş: t | | t). Yatay kola ${f2(p.F1)} kN ve ${f2(p.F2)} kN aşağı yük biniyor. Dirseğin tepesindeki B'ye yatay AB kontrol çubuğu bağlı; A ucundan P ile sola çekiliyor.`,
      why: 'Üç parça, üç soru: AB çubuğu (çekme), C pimi (kayma), konsol plakaları (yatak, yani ezilme). Üçünün kuvveti de aynı yerden gelir: dirseğin dengesinden. O yüzden ilk iş dirsek.' },
    { t: 'Dirsek C etrafında dönmek ister', st: { lab: 1, load: 1, tend: 1, rodc: 1 },
      h: () => 'İki yük de C\'nin sağında ve aşağı: dirseği C etrafında <b>saat yönünde</b> döndürmek ister (animasyon abartılı). Dönerse tepedeki B sağa kayar. AB çubuğu buna izin vermez: B\'yi sola çekerek tutar. Yani AB <b>çekmede</b>, çubuktaki kuvvet tam olarak P.',
      why: 'B, C\'nin 0,6 m üstünde. C etrafında saat yönünde dönen bir L\'nin üst ucu sağa gider. Çubuk B\'yi geri (sola) çektiği için uzamaya zorlanır: çekme. A ucundaki P, bu çubuğun ucundaki kuvvettir; çubuk iki kuvvet elemanı olduğundan aynı kuvvet çubuk boyunca taşınır.' },
    { t: 'C\'ye göre moment → P', st: { lab: 1, load: 1, mC: 1, base: 0.15, rodc: 1 },
      h: (p, r) => `Dirseği tek başına düşün (konsollar soluk). C'deki pim kuvvetinin iki bileşeni bilinmiyor ama ikisi de <b>C'den geçer</b>: C'ye göre momentleri sıfır. Geriye tek bilinmeyen kalır: P. P yatay olduğu için kolu düşey mesafe: ${f2(p.h)} m. Yüklerin kolları yatay: ${f2(p.a)} m ve ${f2(r.x2)} m.`,
      f: (p, r) => `P · ${f2(p.h)} = ${f2(p.F1)} · ${f2(p.a)} + ${f2(p.F2)} · ${f2(r.x2)} = ${f2(r.MC)} kN·m<br><b>P = ${f2(r.P)} kN</b> (AB çekmede)`,
      why: 'Moment = kuvvet × kuvvetin doğrultusuna dik uzaklık. Yatay kuvvetin kolu düşey mesafedir (C ile AB hattı arası 0,6 m). Düşey yüklerin kolu yatay mesafedir: 0,3 m ve 0,3 + 0,3 = 0,6 m. P saat tersine, yükler saat yönüne döndürür; denge için eşit olmalı.' },
    { t: '(a) AB çubuğunun çapı', st: { lab: 1, load: 0, rodc: 1, rsec: 1, val: 1 }, cam: { yaw: -0.12, pitch: 0.04, dist: 9, t: [-1.4, 5.6, 0] },
      h: () => 'Önce izin verilen gerilme: kopma gerilmesini emniyet katsayısına böl. Çubuğu ortadan kesersek kesit dolu bir daire (kırmızı disk); bu kesit P ile çekilir. Gerekli alan = kuvvet / izin verilen gerilme. Alandan çapa geç.',
      f: (p, r) => `σ<sub>em</sub> = ${p.sU} / ${fmt(p.EK)} = ${f1(r.sa)} MPa<br>A = ${fmt(r.P * 1000, 0)} N / ${f1(r.sa)} MPa = ${f2(r.AAB)} mm²<br>π · d² / 4 = ${f2(r.AAB)} → <b>d<sub>AB</sub> = ${f2(r.dAB)} mm</b>`,
      why: 'Emniyet katsayısı 2: malzemeyi kopma gerilmesinin yarısından fazla zorlamıyoruz. Çap bir üst standart değere yuvarlanır (örneğin 16 mm). Daha ince seçersen gerilme izin verileni aşar.' },
    { t: 'C\'deki pim kuvveti (bileşke)', st: { lab: 1, load: 1, val: 1, base: 0.15, reac: 1, rodc: 1 },
      h: (p) => `Kuvvet dengesi. <b>Yatay:</b> P dirseği sola çeker, pim dirseği sağa iter: C<sub>x</sub> = P. <b>Düşey:</b> iki yük aşağı, pim yukarı iter: C<sub>y</sub> = ${f2(p.F1)} + ${f2(p.F2)}. Pim bu iki bileşeni <b>birlikte</b> taşır; pimi kesen, ikisinin bileşkesi (kırmızı ok).`,
      f: (p, r) => `C<sub>x</sub> = ${f2(r.Cx)} kN, C<sub>y</sub> = ${f2(r.Cy)} kN<br>F<sub>C</sub> = √(${f2(r.Cy)}² + ${f2(r.Cx)}²) = <b>${f2(r.FC)} kN</b>`,
      why: 'Pim kuvvetin yönüne bakmaz: kuvvet hangi yönden gelirse o yönde kesilmeye çalışılır. Sadece düşey (65 kN) ya da sadece yatay bileşeni almak pimi gereğinden ince yapar.' },
    { t: '(b) Pim iki yerden kesilir', st: { lab: 0, load: 0, cut: 1, shear: 1 }, cam: { yaw: -1.42, pitch: 0.1, dist: 4.8, t: [0, -0.25, 0] },
      h: () => 'Yandan bakıyoruz, model ortadan kesildi (taralı yüzler kesit). Ortada dirsek, iki yanında konsollar. Dirsek pimin <b>orta parçasını</b> bir yöne iter, konsollar <b>uç parçaları</b> geri tutar (animasyon abartılı). Pim iki düzlemde (kırmızı) kesilmeye çalışılır: <b>çift kesme</b>. Her düzleme F<sub>C</sub>/2 düşer, yani kayma alanı iki kat.',
      f: (p, r) => `τ<sub>em</sub> = ${p.tU} / ${fmt(p.EK)} = ${f1(r.ta)} MPa<br>τ = F<sub>C</sub> / (2 · πd²/4) → A = ${fmt(r.FC * 1000, 0)} / (2 · ${f1(r.ta)}) = ${f2(r.AC)} mm²<br>π · d² / 4 = ${f2(r.AC)} → <b>d<sub>C</sub> = ${f2(r.dC)} mm</b>`,
      why: 'Makas gibi düşün: orta parça bir yöne, iki uç öbür yöne gider. Pimin kopması için iki kesitin birden kopması gerekir; bu yüzden toplam kayma alanı 2 · πd²/4. Dirsek tek bir konsolun yanında dursaydı tek kesme olurdu, gereken çap √2 kat büyürdü.' },
    { t: '(c) Konsolda yatak (ezilme) gerilmesi', st: { lab: 0, load: 0, bear: 1 }, cam: { yaw: 0.62, pitch: 0.3, dist: 3.4, t: [0, -0.05, 0.44] },
      h: () => 'Öndeki konsola yakından bakıyoruz (konsol saydam). Pim, konsol deliğinin iç yüzeyine <b>bastırır</b> (kırmızı yarım silindir); fazla bastırırsa deliği ezer, ovalleştirir. Gerçek basınç bu yarım yüzeye eşit dağılmaz: ortada en büyük (beyaz oklar). Hesapta basitleştiririz: kuvveti deliğin <b>izdüşümüne</b>, yani kalınlık t × pim çapı d dikdörtgenine (kırmızı dikdörtgen) bölüyoruz. Her konsol F<sub>C</sub>/2 taşır.',
      f: (p, r) => `F<sub>konsol</sub> = ${f2(r.FC)} / 2 = ${fmt(r.Fk * 1000, 0)} N<br>σ<sub>b</sub> = F / (t · d) ≤ ${p.sB} MPa<br>t = ${fmt(r.Fk * 1000, 0)} / (${p.sB} · ${f2(r.dC)}) = <b>${f2(r.t)} mm</b>`,
      why: 'Yatak gerilmesi, birbirine bastıran iki parçanın temas yüzeyindeki basınçtır. Yuvarlak temas yüzeyi yerine onun düz izdüşümü (t · d) kullanılır; bu, ders kitabının standart kabulüdür. Konsol kalınlaştıkça temas uzar, basınç düşer. Burada emniyet katsayısı yok: verilen 300 MPa zaten izin verilen değer.' },
    { t: 'Üç şart, üç ayrı yüzey', st: { lab: 1, load: 1, val: 1, rodc: 1, rsec: 1, shear: 1, sum: 1 }, cam: { yaw: -0.5, pitch: 0.24, dist: 17.5, t: [0.9, 2.3, 0] },
      h: () => 'Aynı yük üç yerde, üç ayrı biçimde zorluyor: AB\'nin <b>dolu kesiti</b> (çekme, σ = P/A), pimin <b>iki kesme düzlemi</b> (kayma, τ = F/2A), konsol deliğinin <b>izdüşümü</b> (yatak, σ = F/(t·d)). Hepsinde soru aynı: gerekli alan = kuvvet / izin verilen gerilme.',
      f: (p, r) => `d<sub>AB</sub> = <b>${f2(r.dAB)} mm</b> · d<sub>C</sub> = <b>${f2(r.dC)} mm</b> · t = <b>${f2(r.t)} mm</b>` }
  ],
  scene(v, p, r) {
    const U = 10, H = p.h * U, X1 = p.a * U, X2 = (p.a + p.b) * U, w = 0.45, tb = 0.5, rp = 0.22, tc = 0.3, g = 0.04;
    const zi = tb / 2 + g, zc = zi + tc / 2, xA = -2.6, LAB = -xA, BR = '#8a96a3', PIN = '#d7dde3';
    const cutF = (m, i) => { m.f[i] = Object.assign({}, m.f[i], { cut: 1 }); return m; };
    // dirsek: C orijinde, z kalınlığı tb
    const brk = v.add(E3.extrude([[-w, -w], [X2 + 0.5, -w], [X2 + 0.5, w], [w, w], [w, H + 0.5], [-w, H + 0.5]], tb), { color: BR });
    const brS = v.add(cutF(shift(E3.box(w, 2 * w, tb), w / 2, 0, 0), 5), { color: BR, alpha: 0 }); // kesit görünümünde C çevresi
    // konsollar: x<0 yarısı (önde, saydamlaşır) ve x>0 yarısı (kesit yüzü taralı)
    const hc = 1.85, yc = 0.35 - hc / 2;
    const cons = [1, -1].map(s => ({
      s, f: v.add(shift(E3.box(0.5, hc, tc), -0.25, yc, 0), { color: C.steel, pos: [0, 0, s * zc] }),
      b: v.add(cutF(shift(E3.box(0.5, hc, tc), 0.25, yc, 0), 5), { color: C.steel, pos: [0, 0, s * zc] })
    }));
    const base = v.add(E3.box(2.6, 0.35, 1.9), { color: C.base, pos: [0, -1.675, 0] });
    const ground = v.add(E3.box(4.2, 0.3, 2.6), { color: '#2a323c', pos: [0, -2.0, 0], bias: 0.8 });
    // pim: üç parça (orta: dirsekte, uçlar: konsollarda), her biri iki yarım
    const Lm = 2 * zi, Lo = tc + 0.14, zo = zi + Lo / 2;
    const half = (L, a0) => E3.cyl(rp, L, 20, 'z', a0, Math.PI);
    const seg = z => [v.add(half(z ? Lo : Lm, Math.PI / 2), { color: PIN, pos: [0, 0, z] }), v.add(half(z ? Lo : Lm, -Math.PI / 2), { color: PIN, pos: [0, 0, z] })];
    const pM = seg(0), pO = [seg(zo), seg(-zo)];
    // kesme düzlemleri
    const shP = [zi - g / 2, -(zi - g / 2)].map(z => v.add(E3.cyl(rp + 0.05, 0.012, 28, 'z'), { color: C.red, alpha: 0, pos: [0, 0, z], bias: -3, edge: 0 }));
    // AB çubuğu ve B pimi
    const rod = v.add(E3.cyl(0.13, LAB, 16, 'x'), { color: C.steel, pos: [xA / 2, H, 0] });
    const rsec = v.add(E3.cyl(0.24, 0.04, 24, 'x'), { color: C.red, alpha: 0, pos: [xA / 2, H, 0], bias: -1 });
    const pB = v.add(E3.cyl(0.13, tb + 0.3, 14, 'z'), { color: PIN, pos: [0, H, 0] });
    // yatak yüzeyi: pimin bastırdığı yarım silindir (konsol deliği)
    const ux = r.Cx / r.FC, uy = r.Cy / r.FC, ex = -ux, ey = -uy, nx = -ey, ny = ex; // e: pimin konsola bastırdığı yön
    const th = Math.atan2(ey, ex), surf = E3.cyl(rp + 0.012, tc, 24, 'z', -th - Math.PI / 2, Math.PI); surf.f = surf.f.slice(0, 24);
    const bS = v.add(surf, { color: C.red, alpha: 0, pos: [0, 0, zc], two: 1, edge: 0, bias: -4 });
    const def = { lab: 1, dim: 0, load: 1, base: 1, tend: 0, mC: 0, val: 0, rodc: 0, rsec: 0, reac: 0, cut: 0, shear: 0, bear: 0, sum: 0 };
    return {
      def, apply(S, time, v) {
        const ang = 0.05 * S.ex * S.tend * loop(time, 2.0), ca = Math.cos(ang), sa = Math.sin(ang);
        const R = ([x, y, z]) => [x * ca + y * sa, -x * sa + y * ca, z]; // C etrafında saat yönünde
        const sh = 0.3 * (S.ex / 0.6) * S.cut * loop(time, 1.6), mx = ex * sh * 0.35, my = ey * sh; // orta parçanın kayması (yanda görünen düşey kısım abartılı)
        brk.rot = [0, 0, -ang]; brk.pos = [mx, my, 0]; brk.alpha = (1 - 0.94 * S.cut) * (1 - 0.75 * S.bear);
        brS.alpha = S.cut; brS.pos = [mx, my, 0];
        cons.forEach(c => {
          const fr = c.s > 0 ? 1 - 0.7 * S.bear : 1 - 0.8 * S.bear;
          c.f.alpha = S.base * fr * (1 - 0.92 * S.cut); c.b.alpha = S.base * fr;
        });
        base.alpha = ground.alpha = S.base * (1 - 0.75 * S.bear);
        const pb = -0.6 * S.cut;
        pM.forEach(o => { o.pos = [mx, my, 0]; o.bias = pb; });
        const pa = 1 - 0.55 * S.bear; pM.forEach(o => o.alpha = pa); pO.forEach(sg => sg.forEach(o => { o.alpha = pa; o.bias = pb; }));
        pM[0].alpha = pa * (1 - 0.92 * S.cut); pO.forEach(sg => { sg[0].alpha = pa * (1 - 0.92 * S.cut); });
        shP.forEach(o => o.alpha = S.shear * 0.6);
        const Bp = R([0, H, 0]); pB.pos = Bp;
        const L = Bp[0] - xA; rod.scl = [L / LAB, 1, 1]; rod.pos = [(xA + Bp[0]) / 2, H, 0];
        rod.color = mixHex(C.steel, C.tens, S.rodc * 0.85); rod.glow = S.tend * 0.5 * loop(time, 3);
        rsec.alpha = S.rsec; rsec.pos = [(xA + Bp[0]) / 2, H, 0];
        bS.alpha = Math.max(S.bear, 0) * 0.7;
        const O = v.ov, T0 = '#e9edf1';
        // yükler
        const q1 = R([X1, w, 0]), q2 = R([X2, w, 0]);
        O.push({ k: 'arrow', a: [q1[0], q1[1] + 2.6, 0], b: [q1[0], q1[1] + 0.05, 0], color: C.red, w: 3, label: `${f2(p.F1)} kN`, lp: [q1[0], q1[1] + 2.95, 0], alpha: S.load });
        O.push({ k: 'arrow', a: [q2[0], q2[1] + 2.6, 0], b: [q2[0], q2[1] + 0.05, 0], color: C.red, w: 3, label: `${f2(p.F2)} kN`, lp: [q2[0], q2[1] + 2.95, 0], alpha: S.load });
        O.push({ k: 'arrow', a: [xA - 0.05, H, 0], b: [xA - 2.0, H, 0], color: C.red, w: 3, label: S.val > 0.5 ? `P = ${f2(r.P)} kN` : 'P', lp: [xA - 1.1, H + 0.5, 0], alpha: Math.max(S.load, S.rsec) });
        if (S.lab > 0.01) [['A', xA, H - 0.5, 0], ['B', Bp[0] + 0.8, H + 0.35, 0], ['C', -0.85, 0.45, 0.6], ['D', R([X2, 0, 0])[0] + 0.15, -0.95, 0]]
          .forEach(([t, x, y, z]) => O.push({ k: 'text', t, p: [x, y, z], size: 16, alpha: S.lab }));
        if (S.lab > 0.01 && S.base > 0.5) O.push({ k: 'text', t: 'iki konsol', p: [-1.9, -1.1, 0.6], color: C.mute, size: 13, alpha: S.lab * S.dim });
        // ölçüler
        O.push({ k: 'dim', a: [xA - 0.4, 0, 0], b: [xA - 0.4, H, 0], off: [-0.6, 0, 0], t: `${f2(p.h)} m`, tdx: -24, tdy: 0, alpha: S.dim });
        O.push({ k: 'dim', a: [0, -2.15, 0], b: [X1, -2.15, 0], off: [0, -0.3, 0], t: `${f2(p.a)} m`, alpha: S.dim });
        O.push({ k: 'dim', a: [X1, -2.15, 0], b: [X2, -2.15, 0], off: [0, -0.3, 0], t: `${f2(p.b)} m`, alpha: S.dim });
        // dönme eğilimi
        if (S.tend > 0.01) {
          const P = []; for (let i = 0; i <= 14; i++) { const a = (70 - 80 * i / 14) * Math.PI / 180; P.push([2.1 * Math.cos(a), 2.1 * Math.sin(a), 0.4]); }
          O.push({ k: 'line', p: P.slice(0, 14), color: C.red, w: 2.4, alpha: S.tend });
          O.push({ k: 'arrow', a: P[13], b: P[14], color: C.red, w: 2.4, hs: 10, alpha: S.tend });
          O.push({ k: 'text', t: 'yükler dirseği C etrafında\nsaat yönünde döndürmek ister', p: [4.0, -2.0, 0.4], color: C.red, size: 13, box: 1, alpha: S.tend });
          O.push({ k: 'arrow', a: [Bp[0] + 0.55, H + 0.75, 0.3], b: [Bp[0] + 1.6, H + 0.75, 0.3], color: T0, w: 1.8, dash: [5, 4], alpha: S.tend * 0.9 });
          O.push({ k: 'text', t: 'B sağa gitmek ister', p: [Bp[0] + 2.6, H + 1.2, 0.3], color: T0, size: 13, box: 1, alpha: S.tend });
          O.push({ k: 'arrow', a: [-0.4, H + 0.75, 0.3], b: [-1.7, H + 0.75, 0.3], color: C.tens, w: 2.4, alpha: S.tend });
          O.push({ k: 'text', t: 'AB, B\'yi sola çeker:\nçubuk çekmede', p: [-1.4, H + 1.5, 0.3], color: C.tens, size: 13, box: 1, alpha: S.tend });
        }
        // moment
        if (S.mC > 0.01) {
          O.push({ k: 'ring', c: [0, 0, 0.4], r: 0.45, color: C.red, w: 2.5, alpha: S.mC });
          O.push({ k: 'dim', a: [xA - 0.4, 0, 0], b: [xA - 0.4, H, 0], off: [-0.6, 0, 0], t: `kol ${f2(p.h)} m`, tdx: -30, tdy: 0, alpha: S.mC });
          O.push({ k: 'dim', a: [0, -0.6, 0], b: [X1, -0.6, 0], off: [0, -0.5, 0], t: `kol ${f2(p.a)} m`, alpha: S.mC });
          O.push({ k: 'dim', a: [0, -0.6, 0], b: [X2, -0.6, 0], off: [0, -1.25, 0], t: `kol ${f2(r.x2)} m`, alpha: S.mC });
          O.push({ k: 'arrow', a: [-2.2, 0, 0.6], b: [-0.35, 0, 0.6], color: C.white, w: 2.2, dash: [5, 4], label: 'C_x ?', lp: [-2.7, 0, 0.6], alpha: S.mC });
          O.push({ k: 'arrow', a: [0, -2.3, 0.6], b: [0, -0.35, 0.6], color: C.white, w: 2.2, dash: [5, 4], label: 'C_y ?', lp: [0.6, -2.3, 0.6], alpha: S.mC });
          O.push({ k: 'text', t: 'C_x ve C_y C\'den geçer → momentleri 0', p: [-2.6, -3.0, 0.6], color: C.mute, size: 13, alpha: S.mC });
        }
        // çubuk kesiti
        if (S.rsec > 0.01 && S.sum < 0.5) {
          const xm = (xA + Bp[0]) / 2;
          O.push({ k: 'arrow', a: [xm - 0.3, H - 0.55, 0.3], b: [xm - 1.1, H - 0.55, 0.3], color: C.tens, w: 2, alpha: S.rsec });
          O.push({ k: 'arrow', a: [xm + 0.3, H - 0.55, 0.3], b: [xm + 1.1, H - 0.55, 0.3], color: C.tens, w: 2, alpha: S.rsec });
          O.push({ k: 'text', t: `kesit A = π·d²/4\nσ = P/A ≤ ${f1(r.sa)} MPa`, p: [xm, H + 1.25, 0.3], color: C.tens, size: 14, box: 1, alpha: S.rsec });
          O.push({ k: 'text', t: `d_AB = ${f2(r.dAB)} mm`, p: [xm, H - 1.25, 0.3], color: C.white, size: 15, box: 1, alpha: S.rsec * S.val });
        }
        // tepki
        if (S.reac > 0.01) {
          O.push({ k: 'arrow', a: [-2.4, 0, 0.7], b: [-0.35, 0, 0.7], color: C.white, w: 2.4, label: `C_x = ${f2(r.Cx)} kN`, lp: [-2.9, 0.5, 0.7], alpha: S.reac });
          O.push({ k: 'arrow', a: [0, -2.5, 0.7], b: [0, -0.35, 0.7], color: C.white, w: 2.4, label: `C_y = ${f2(r.Cy)} kN`, lp: [1.3, -2.4, 0.7], alpha: S.reac });
          O.push({ k: 'arrow', a: [-2.9 * ux, -2.9 * uy, 0.7], b: [-0.32 * ux, -0.32 * uy, 0.7], color: C.red, w: 3, label: `F_C = ${f2(r.FC)} kN`, lp: [-3.2 * ux - 1.3, -3.2 * uy - 0.2, 0.7], alpha: S.reac });
        }
        // çift kesme (yandan kesit)
        if (S.cut > 0.01) {
          const sp = rp + 0.05;
          O.push({ k: 'arrow', a: [ux * (sp + 1.0) + mx, uy * (sp + 1.0) + my, 0], b: [ux * sp + mx, uy * sp + my, 0], color: C.white, w: 2.4, label: `F_C = ${f2(r.FC)} kN\n(dirsek iter)`, lp: [ux * (sp + 1.3), uy * (sp + 1.3) + 0.25, 0], alpha: S.cut });
          [zo, -zo].forEach(z => O.push({ k: 'arrow', a: [-ux * (sp + 0.8), -uy * (sp + 0.8), z], b: [-ux * sp, -uy * sp, z], color: C.comp, w: 2.4, label: `F_C/2`, lp: [-ux * (sp + 1.05), -uy * (sp + 1.05) - 0.12, z], alpha: S.cut }));
          O.push({ k: 'text', t: 'konsol', p: [0, 0.75, zc], color: C.mute, size: 13, alpha: S.cut });
          O.push({ k: 'text', t: 'konsol', p: [0, 0.75, -zc], color: C.mute, size: 13, alpha: S.cut });
          O.push({ k: 'text', t: 'dirsek', p: [0, -0.62 + my, 0], color: C.mute, size: 13, alpha: S.cut });
        }
        if (S.shear > 0.01 && S.sum < 0.5) {
          O.push({ k: 'text', t: `2 kesme düzlemi\nher biri F_C/2 = ${f2(r.Fk)} kN\nd_C = ${f2(r.dC)} mm`, p: [0, -1.75, 0], color: C.red, size: 14, box: 1, alpha: S.shear * S.cut });
        }
        // yatak
        if (S.bear > 0.01) {
          const zf = zc + tc / 2 + 0.005, zb = zc - tc / 2;
          for (let i = -3; i <= 3; i++) {
            const ph = i * 25 * Math.PI / 180, c = Math.cos(ph), dx = c * ex + Math.sin(ph) * nx, dy = c * ey + Math.sin(ph) * ny, L = 0.06 + 0.32 * c;
            O.push({ k: 'arrow', a: [dx * (rp + 0.01), dy * (rp + 0.01), zf], b: [dx * (rp + 0.01 + L), dy * (rp + 0.01 + L), zf], color: T0, w: 1.6, hs: 7, alpha: S.bear });
          }
          const Q = [[nx * rp, ny * rp, zb], [nx * rp, ny * rp, zf], [-nx * rp, -ny * rp, zf], [-nx * rp, -ny * rp, zb]];
          O.push({ k: 'line', p: Q, close: 1, color: C.red, w: 2, fill: 'rgba(255,45,32,0.35)', alpha: S.bear });
          O.push({ k: 'dim', a: [nx * rp, ny * rp, zf], b: [-nx * rp, -ny * rp, zf], off: [ex * -0.25 + 0, ey * -0.25, 0.02], t: `d = ${f2(r.dC)}`, alpha: S.bear });
          O.push({ k: 'dim', a: [-nx * rp, -ny * rp, zb], b: [-nx * rp, -ny * rp, zf], off: [-ex * 0.0 - nx * 0.25, -ny * 0.25, 0], t: `t = ${f2(r.t)}`, tdx: -30, tdy: 0, alpha: S.bear });
          O.push({ k: 'text', t: 'pimin bastırdığı yüzey\n(yarım silindir)', p: [ex * 0.75 - 0.25, ey * 0.75 - 0.15, zf], color: C.red, size: 13, box: 1, alpha: S.bear });
          O.push({ k: 'text', t: `izdüşüm alanı t · d\nσ_b = (F_C/2) / (t·d) ≤ ${p.sB} MPa`, p: [0.55, 0.62, zf], color: C.white, size: 13, box: 1, alpha: S.bear });
          O.push({ k: 'text', t: 'oklar: gerçek basınç\n(ortada en büyük)', p: [-0.1, -0.85, zf], color: T0, size: 12, box: 1, alpha: S.bear });
        }
        // özet
        if (S.sum > 0.01) {
          [zc, -zc].forEach(z => {
            const Q = [[nx * rp, ny * rp, z - tc / 2], [nx * rp, ny * rp, z + tc / 2], [-nx * rp, -ny * rp, z + tc / 2], [-nx * rp, -ny * rp, z - tc / 2]];
            O.push({ k: 'line', p: Q, close: 1, color: C.red, w: 1.6, fill: 'rgba(255,45,32,0.45)', alpha: S.sum });
          });
          O.push({ k: 'text', t: `ÇEKME · AB kesiti\nd_AB = ${f2(r.dAB)} mm`, p: [xA / 2, H + 1.3, 0], color: C.tens, size: 14, box: 1, alpha: S.sum });
          O.push({ k: 'text', t: `KAYMA · pim, 2 düzlem\nd_C = ${f2(r.dC)} mm`, p: [-3.2, 1.4, 0.6], color: C.red, size: 14, box: 1, alpha: S.sum });
          O.push({ k: 'text', t: `YATAK · konsol, t · d\nt = ${f2(r.t)} mm`, p: [-2.6, -1.3, 0.6], color: C.red, size: 14, box: 1, alpha: S.sum });
        }
      }
    };
  },
  whatif: {
    not: 'Kaydırıcıları oynat. Dirseğin yüksekliği, uçtaki yük, emniyet katsayısı ve konsol çeliği değişince üç boyutun nasıl değiştiğine bak.',
    s: [{ k: 'F2', ad: 'Uçtaki yük', min: 10, max: 100, step: 5, u: 'kN' }, { k: 'h', ad: 'Yükseklik h (C → AB)', min: 0.3, max: 1.2, step: 0.05, u: 'm' },
      { k: 'EK', ad: 'Emniyet katsayısı', min: 1.5, max: 4, step: 0.5, u: '' }, { k: 'sB', ad: 'Emniyet yatak gerilmesi', min: 150, max: 500, step: 10, u: 'MPa' }],
    out: (p, r) => `<div class="mets"><div class="m"><small>P (AB kuvveti)</small><b>${f2(r.P)} kN</b></div><div class="m"><small>F_C (pim)</small><b>${f2(r.FC)} kN</b></div>
      <div class="m red"><small>d_AB</small><b>${f2(r.dAB)} mm</b></div><div class="m red"><small>d_C</small><b>${f2(r.dC)} mm</b></div><div class="m blue"><small>konsol t</small><b>${f2(r.t)} mm</b></div></div>
      <p class="note">h büyüdükçe P küçülür (kol uzar), AB incelir; ama pim kuvveti C<sub>y</sub> = ${f2(r.Cy)} kN'nin altına hiç inmez. Emniyet katsayısı çapları √E.K. oranında büyütür. Konsol kalınlığı t = (F_C/2)/(σ_b·d) pim çapına bağlı: pim kalınlaşınca temas genişler, konsol biraz incelebilir.</p>`
  },
  kagit: (p, r) => `Dirsek BCD, SCD:
ΣM_C = 0:  P·${f2(p.h)} − ${f2(p.F1)}·${f2(p.a)} − ${f2(p.F2)}·${f2(r.x2)} = 0  →  P = ${f2(r.P)} kN (AB çekme)
a) σ_em = ${p.sU}/${fmt(p.EK)} = ${f1(r.sa)} MPa
   σ_em = P/A → ${fmt(r.P * 1000, 0)}/(π·d²/4) = ${f1(r.sa)}  →  d_AB = ${f2(r.dAB)} mm
b) τ_em = ${p.tU}/${fmt(p.EK)} = ${f1(r.ta)} MPa
   ΣF_y = 0: C_y − ${f2(p.F1)} − ${f2(p.F2)} = 0 → C_y = ${f2(r.Cy)} kN
   ΣF_x = 0: P − C_x = 0 → C_x = ${f2(r.Cx)} kN
   F_C = √(C_x² + C_y²) = ${f2(r.FC)} kN
   Çift kesme: τ_em = F_C/(2·π·d²/4) → ${fmt(r.FC * 1000, 0)}/(2·π·d²/4) = ${f1(r.ta)}  →  d_C = ${f2(r.dC)} mm
c) Her konsol: F = F_C/2 = ${fmt(r.Fk * 1000, 0)} N
   σ_b = F/(t·d) = ${p.sB} → ${fmt(r.Fk * 1000, 0)}/(t·${f2(r.dC)}) = ${p.sB}  →  t = ${f2(r.t)} mm`,
  tuzak: ['<b>Pimde tek kesme almak.</b> Dirsek iki konsolun arasında: iki kesme düzlemi var. Tek alanla d = 24,78 mm bulursun (√2 kat fazla).',
    '<b>Pim kuvveti olarak sadece C<sub>y</sub> = 65 kN almak.</b> Pim bileşkeyi taşır: √(65² + 57,5²) = 86,78 kN. Yalnız 65 kN ile d = 15,16 mm çıkar, pim ince kalır.',
    '<b>Emniyet katsayısını unutmak.</b> 600 ve 360 MPa kopma değerleri; önce 2\'ye böl. Yatakta ise 300 MPa zaten "emniyet" değeri: bir daha bölme.',
    '<b>Yatakta F<sub>C</sub>\'nin tamamını tek konsola yüklemek.</b> İki konsol paylaşır; tamamını alırsan t = 16,51 mm, iki katı çıkar.',
    '<b>Yatak alanını π·d·t ya da π·d²/4 almak.</b> Yatakta alan, deliğin izdüşümü: t · d.',
    '<b>Moment kolu.</b> P yatay, kolu düşey 0,6 m. 50 kN\'nin kolu 0,3 değil, C\'den 0,3 + 0,3 = 0,6 m.'],
  gen() {
    return { F1: rnd(5, 40, 5), F2: rnd(20, 80, 5), a: rnd(0.2, 0.5, 0.05), b: rnd(0.2, 0.5, 0.05), h: rnd(0.4, 0.9, 0.05),
      sU: pick([400, 500, 600, 700]), tU: pick([240, 300, 360, 400]), sB: pick([200, 250, 300, 350]), EK: pick([2, 2.5, 3]) };
  },
  pracText: p => `Aynı düzen: L dirseğin yatay koluna C'den ${f2(p.a)} m sonra ${f2(p.F1)} kN, ondan ${f2(p.b)} m sonra (uçta) ${f2(p.F2)} kN aşağı yük biniyor. B, C'nin ${f2(p.h)} m üstünde; yatay AB çubuğu A'dan P ile tutuluyor. AB çeliği σ<sub>kopma</sub> = ${p.sU} MPa, C pimi τ<sub>kopma</sub> = ${p.tU} MPa, ikisinde de emniyet katsayısı ${fmt(p.EK)}. Pim, dirseğin iki yanındaki iki konsoldan geçiyor; konsol çeliğinin emniyet yatak gerilmesi ${p.sB} MPa. P, AB çapı, pim kuvveti, pim çapı ve konsol kalınlığı kaç?`,
  ans: [{ k: 'P', ad: 'P', u: 'kN' }, { k: 'dAB', ad: 'd_AB', u: 'mm' }, { k: 'FC', ad: 'F_C (pim kuvveti)', u: 'kN' }, { k: 'dC', ad: 'd_C (pim)', u: 'mm' }, { k: 't', ad: 'konsol kalınlığı t', u: 'mm' }],
  hints: (p, r) => [`C'ye göre moment: P · ${f2(p.h)} = ${f2(p.F1)} · ${f2(p.a)} + ${f2(p.F2)} · ${f2(r.x2)}.`,
    `İzin verilen gerilmeler: σ_em = ${p.sU}/${fmt(p.EK)}, τ_em = ${p.tU}/${fmt(p.EK)}. Alan = kuvvet / izin verilen.`,
    `Pim kuvveti bileşke: C_x = P, C_y = ${f2(p.F1)} + ${f2(p.F2)}. Pim çift kesmede: alan 2 · πd²/4.`,
    `Her konsol F_C/2 taşır; yatak alanı t · d_C.`],
  diag(p, r, u) {
    const near = (a, b) => isFinite(a) && Math.abs(a - b) <= Math.abs(b) * 0.02;
    if (near(u.P, r.Pw)) return 'P\'de uçtaki yükün kolunu yanlış almışsın: C\'den uzaklığı a + b.';
    if (near(u.dAB, r.dAB0)) return 'd_AB\'de emniyet katsayısını unuttun: σ_em = σ_kopma / E.K.';
    if (near(u.FC, r.Cy) || near(u.FC, r.Cx)) return 'Pim kuvveti tek bileşen değil, bileşke: √(C_x² + C_y²).';
    if (near(u.FC, r.Cx + r.Cy)) return 'Bileşkeyi düz toplamışsın. Bileşenler dik: Pisagor kullan.';
    if (near(u.dC, r.dC1)) return 'd_C √2 kat büyük: pimi tek kesmede almışsın. Dirsek iki konsolun arasında, iki kesme düzlemi var.';
    if (near(u.dC, r.dCy)) return 'd_C\'de sadece düşey bileşeni kullanmışsın; bileşke F_C ile hesapla.';
    if (near(u.dC, r.dC0)) return 'd_C\'de emniyet katsayısını unuttun: τ_em = τ_kopma / E.K.';
    if (near(u.t, r.tFull)) return 't iki katı çıkmış: her konsol F_C\'nin yarısını taşır.';
    if (near(u.t, r.tPi)) return 'Yatak alanını yarım silindir yüzeyi (π·d·t/2) almışsın. Standart kabul izdüşüm: t · d.';
    return 'Sırayla git: ΣM_C → P; σ_em → d_AB; ΣF_x, ΣF_y → F_C; çift kesme → d_C; F_C/2 ve t·d → t.';
  },
  hoca: `<p><b>Hocanın sonuçları:</b> P = 57,5 kN · (a) σ<sub>em</sub> = 300 MPa, d<sub>AB</sub> = 15,62 mm · (b) τ<sub>em</sub> = 180 MPa, F<sub>C</sub> = √(65² + 57,5²) = 86,78 kN, τ<sub>em</sub> = F/(2A) → d<sub>C</sub> = 17,51 mm · (c) P<sub>konsol</sub> = 86 780 / 2 = 43 390 N, σ = P/(t·d) = 300 → t = 8,26 mm. Puanlar: a 7,5 · b 10 · c 7,5.</p>
  <p><b>Bizim hesapla karşılaştırma:</b> P, d<sub>AB</sub>, F<sub>C</sub> ve t birebir aynı. Pim çapında hesap 17,519 mm veriyor; hoca 17,51 diye yazmış (yuvarlama yerine kesme). Fark 0,01 mm, sonuca etkisi yok: t iki değerle de 8,26 mm.</p>
  <p><b>Not:</b> Gerçek tasarımda bulunan değerler bir üst standart ölçüye yuvarlanır (örneğin 16 mm çubuk, 18 mm pim, 8,5–10 mm konsol). Sınavda hocanın yaptığı gibi hesaplanan değeri yazman yeterli.</p>`
});
