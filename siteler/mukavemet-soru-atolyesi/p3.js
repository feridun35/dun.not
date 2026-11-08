'use strict';
/* ============ PROBLEM 3 ============ */
PROBS.push({
  id: 'p3', no: 3, tip: 'km',
  ad: 'Tavana asılı ahşap ve çelik pim',
  ozet: 'Üç farklı kopma biçimi var. Her biri için kopma yükünü bul, en küçüğünü al, emniyet katsayısına böl.',
  soru: 'Bir P yükü, tavandan asılan kısa bir ahşap elemana sokulmuş bir çelik pim tarafından taşınmaktadır. Kullanılan ağacın kopma mukavemeti çekmede 60 MPa ve kesmede 7,5 MPa, çeliğin kesmede kopma mukavemeti ise 150 MPa\'dır. b = 40 mm, c = 55 mm ve d = 12 mm olduğuna göre, sistemin emniyet katsayısının 3,2 olması halinde P yükünü belirleyiniz.',
  verilen: ['Ahşap kesiti 40 mm × b, b = 40 mm', 'Pimin altındaki ahşap boyu c = 55 mm', 'Pim çapı d = 12 mm; pimin iki ucuna P/2', 'Ahşap: σ<sub>U</sub> = 60 MPa (çekme), τ<sub>U</sub> = 7,5 MPa (kesme)', 'Çelik pim: τ<sub>U</sub> = 150 MPa', 'Emniyet katsayısı 3,2'],
  istenen: 'Emniyetli P yükü',
  p0: { w: 40, b: 40, c: 55, d: 12, su: 60, tw: 7.5, ts: 150, ek: 3.2 },
  solve(p) {
    const An = p.w * (p.b - p.d), Pa = p.su * An / 1000, Ab = 2 * p.w * p.c, Pb = p.tw * Ab / 1000;
    const As = 2 * Math.PI * p.d * p.d / 4, Pc = p.ts * As / 1000, PU = Math.min(Pa, Pb, Pc), Pz = PU / p.ek;
    const gov = PU === Pa ? 'ahşapta çekme' : PU === Pb ? 'ahşapta kesme (blok sıyrılır)' : 'pimde çift kesme';
    return { An, Pa, Ab, Pb, As, Pc, PU, Pz, gov, Pc1: p.ts * As / 2 / 1000, Pb1: p.tw * p.w * p.c / 1000 };
  },
  anlam: [
    ['kopma mukavemeti çekmede 60, kesmede 7,5', 'Ahşap iki türlü kopabilir: <b>çekmeden</b> (σ) ve <b>kaymadan</b> (τ).'],
    ['çeliğin kesmede kopma mukavemeti 150', 'Pim de kesilebilir: üçüncü kopma biçimi.'],
    ['b, c, d', 'b: ahşabın pime dik genişliği (pim deliği bundan d kadar götürür). c: pimin altında kalan ahşap boyu (sıyrılan blok). d: pim çapı.'],
    ['emniyet katsayısı 3,2', 'Kopma yükünü bul, <b>3,2\'ye böl</b>: P_izin = P_U / 3,2.'],
    ['pimin iki ucuna P/2', 'Pim ahşabın iki yanında taşınır: <b>çift kesme</b>, iki kesit.']
  ],
  tetik: ['kopma mukavemeti', 'emniyet katsayısı', 'pim + delik', 'üç malzeme değeri'],
  tetikNot: 'Birden çok "mukavemet" değeri ve bir emniyet katsayısı = en zayıf halka sorusu. Her değer bir kopma biçimine aittir; her biri için kopan yüzeyi hayal et.',
  zincir: [["Ne isteniyor?", "Emniyetli P: önce sistemi koparan yük, sonra <b>÷ emniyet katsayısı</b>."], ["Kaç kopma yolu var?", "Üç mukavemet değeri verilmiş → üç yol: ahşap çekme, ahşap kesme, pim kesme."], ["Her yolun yüzeyi?", "Delikli net kesit; pimin altındaki bloğun iki yan yüzü; pimin iki dairesel kesiti."], ["Sonuç?", "En küçük kopma yükü ÷ 3,2."]],
  cam: { yaw: 0.7, pitch: 0.26, dist: 26, t: [0, 2.2, 0] },
  steps: [
    { t: 'Şekle bak', st: { dim: 1, load: 1 },
      h: () => 'Tavana bağlı, kesiti 40 mm × b olan bir ahşap. Altına yakın, ahşabı 40 mm boyunca delip geçen çelik bir pim. Pimin iki ucundan P/2 ile aşağı çekiliyor. Ölçüler şekildeki gibi: 40 mm pimin boyu, b pime dik genişlik, c pimin altındaki boy.' },
    { t: 'Yük yolu', st: { path: 1, load: 1 },
      h: () => 'P/2 + P/2 → pim → pim, <b>altındaki</b> ahşaba bastırır → ahşap yükü yukarı, tavana taşır. Pimin üstündeki ahşap ise P\'nin tamamıyla çekilir.',
      why: 'Pim aşağı itilirken altındaki tahtayı da aşağı itmeye çalışır. Bu yüzden pimin altındaki c boyundaki parça kritik.' },
    { t: 'Fikir: kopma yükü ÷ emniyet katsayısı', st: { load: 1, ghost: 1 },
      h: (p) => `Önce sistemi <b>koparan</b> yükü (P<sub>U</sub>) bulacağız. Sonra güvenli olsun diye ${f1(p.ek)}'ye böleceğiz. Sistem birden fazla yoldan kopabilir; kopma yükü, bu yolların <b>en küçüğü</b>.`,
      f: (p) => `P<sub>izin</sub> = P<sub>U</sub> / E.K. = P<sub>U</sub> / ${f1(p.ek)}` },
    { t: 'Kopma (a): ahşap çekmeden kopar', st: { ma: 1, ha: 1, load: 1, xr: 1 }, cam: { dist: 17, t: [0, 0.3, 0], pitch: 0.5 },
      h: (p) => `Pimin hizasında ahşap delikli: genişlik b'den d kadar eksik. Bu <b>net kesit</b> (kırmızı iki yan şerit) en zayıf yer: ahşap burada çekilip kopar, pimin altındaki her şey aşağı gider.`,
      f: (p, r) => `A<sub>net</sub> = ${p.w} · (${p.b} − ${p.d}) = ${fmt(r.An, 0)} mm²<br>P<sub>U,a</sub> = ${p.su} · ${fmt(r.An, 0)} = <b>${f1(r.Pa)} kN</b>` },
    { t: 'Kopma (b): pimin altındaki blok sıyrılır', st: { mb: 1, hb: 1, load: 1, xr: 1 }, cam: { dist: 17, t: [0, -2.2, 0], yaw: 0.45, pitch: 0.3 },
      h: (p) => `Pim, altındaki <b>d genişliğinde, c boyunda</b> tahta bloğu aşağı iter. Blok iki yan yüzeyinden kayarak çıkar. Her yüzey ${p.c} × ${p.w} mm, iki tane.`,
      f: (p, r) => `A = 2 · ${p.w} · ${p.c} = ${fmt(r.Ab, 0)} mm²<br>P<sub>U,b</sub> = ${f1(p.tw)} · ${fmt(r.Ab, 0)} = <b>${f1(r.Pb)} kN</b>`,
      why: 'Blok aşağı kayarken yanındaki tahtadan ayrılır. Kayan yüzeyler bloğun iki yanındaki düşey düzlemlerdir: pimin boyuna paralel, 40 mm boyunca uzanırlar (şekildeki kesikli çizgiler).' },
    { t: 'Kopma (c): pim iki yerden kesilir', st: { mc: 1, hc: 1, load: 1, xr: 1 }, cam: { dist: 15, t: [0, 0, 0], yaw: 0.1, pitch: 0.12 },
      h: () => 'Pimin uçları (P/2 ile) aşağı gider, ortası ahşabın içinde yerinde kalır. Pim ahşabın <b>iki yüzünde</b> kesilir: çift kesme, iki daire kesit.',
      f: (p, r) => `A = 2 · π · ${p.d}² / 4 = ${f1(r.As)} mm²<br>P<sub>U,c</sub> = ${p.ts} · ${f1(r.As)} = <b>${f1(r.Pc)} kN</b>` },
    { t: 'En küçüğü al, emniyete böl', st: { all: 1, load: 1, xr: 1 },
      h: (p, r) => `Sistem en zayıf yoldan kopar: <b>${r.gov}</b>.`,
      f: (p, r) => `P<sub>U</sub> = min(${f1(r.Pa)} ; ${f1(r.Pb)} ; ${f1(r.Pc)}) = ${f1(r.PU)} kN<br>P<sub>izin</sub> = ${f1(r.PU)} / ${f1(p.ek)} = <b>${f2(r.Pz)} kN</b>` }
  ],
  scene(v, p, r) {
    const s = 0.1, W = p.w * s, B = p.b * s, cc = p.c * s, rd = p.d / 2 * s, top = 8;
    const up = v.add(E3.box(W, top, B), { color: C.wood, pos: [0, top / 2, 0] });
    const zl = (B / 2 - rd), lowL = v.add(E3.box(W, cc, zl), { color: C.wood, pos: [0, -cc / 2, -(rd + zl / 2)] });
    const lowR = v.add(E3.box(W, cc, zl), { color: C.wood, pos: [0, -cc / 2, rd + zl / 2] });
    const blk = v.add(E3.box(W, cc, 2 * rd), { color: '#c39a66', pos: [0, -cc / 2, 0] });
    const pinM = v.add(E3.cyl(rd, W, 20, 'x'), { color: '#d7dde3', pos: [0, 0, 0] });
    const pinL = v.add(E3.cyl(rd, 2.4, 20, 'x'), { color: '#d7dde3', pos: [-(W / 2 + 1.2), 0, 0] });
    const pinR = v.add(E3.cyl(rd, 2.4, 20, 'x'), { color: '#d7dde3', pos: [W / 2 + 1.2, 0, 0] });
    v.add(E3.box(9, 1.2, 9), { color: '#2a323c', pos: [0, top + 0.6, 0], bias: 1 });
    const wd = [up, lowL, lowR, blk];
    const ha = [-1, 1].map(sg => v.add(E3.box(W + 0.06, 0.04, zl), { color: C.red, alpha: 0, bias: -4, pos: [0, 0, sg * (rd + zl / 2)] }));
    const hb = [-1, 1].map(sg => v.add(E3.box(W + 0.06, cc, 0.04), { color: C.red, alpha: 0, two: 1, bias: -4, pos: [0, -cc / 2, sg * rd] }));
    const hc = [-1, 1].map(sg => v.add(E3.cyl(rd + 0.04, 0.05, 20, 'x'), { color: C.red, alpha: 0, bias: -4, pos: [sg * W / 2, 0, 0] }));
    const def = { xr: 0, dim: 0, load: 1, path: 0, ghost: 0, ma: 0, ha: 0, mb: 0, hb: 0, mc: 0, hc: 0, all: 0 };
    return {
      def, apply(S, time, v) {
        wd.forEach(o => o.alpha = 1 - 0.55 * S.xr);
        const ph = loop(time, 1.4), da = S.ma * ph * 1.6, db = S.mb * ph * 1.6, dc = S.mc * ph * 1.1;
        lowL.pos = [0, -cc / 2 - da, -(rd + zl / 2)]; lowR.pos = [0, -cc / 2 - da, rd + zl / 2];
        blk.pos = [0, -cc / 2 - da - db, 0]; pinM.pos = [0, -da - db, 0];
        pinL.pos = [-(W / 2 + 1.2), -da - db - dc, 0]; pinR.pos = [W / 2 + 1.2, -da - db - dc, 0];
        const gA = r.PU === r.Pa ? 1 : 0, gB = r.PU === r.Pb ? 1 : 0, gC = r.PU === r.Pc ? 1 : 0;
        ha.forEach(o => o.alpha = Math.max(S.ha, S.all * gA * 0.8) * 0.75); hb.forEach(o => { o.alpha = Math.max(S.hb, S.all * gB * 0.8) * 0.6; o.pos[1] = -cc / 2 - db * 0.5; });
        hc.forEach(o => o.alpha = Math.max(S.hc, S.all * gC * 0.8) * 0.85);
        const yl = -da - db - dc, O = v.ov;
        [-1, 1].forEach(sg => O.push({ k: 'arrow', a: [sg * (W / 2 + 1.8), yl - 0.4, 0], b: [sg * (W / 2 + 1.8), yl - 2.6, 0], color: C.red, w: 3, label: 'P/2', lp: [sg * (W / 2 + 2.6), yl - 1.8, 0], alpha: S.load }));
        O.push({ k: 'hatch', a: [-4.5, top + 1.2, 0], b: [4.5, top + 1.2, 0], n: [0.35, 0.4, 0], color: C.mute, alpha: 0.7 });
        O.push({ k: 'dim', a: [W / 2, -cc, B / 2], b: [W / 2, 0, B / 2], off: [0.9, 0, 0], t: `c = ${p.c}`, tdx: 26, tdy: 0, alpha: S.dim });
        O.push({ k: 'dim', a: [W / 2, -cc, B / 2], b: [W / 2, -cc, -B / 2], off: [0.9, -0.9, 0], t: `b = ${p.b}`, alpha: S.dim });
        O.push({ k: 'dim', a: [-W / 2, -cc, B / 2], b: [W / 2, -cc, B / 2], off: [0, -0.9, 0.9], t: `${p.w} mm`, alpha: S.dim });
        O.push({ k: 'dim', a: [W / 2 + 2.3, rd, 0], b: [W / 2 + 2.3, -rd, 0], off: [0.6, 0, 0.6], t: `d = ${p.d}`, tdx: 26, tdy: 0, alpha: S.dim });
        if (S.path > 0.01) {
          O.push({ k: 'arrow', a: [0, -0.2, B / 2 + 0.6], b: [0, -2.6, B / 2 + 0.6], color: C.white, w: 2, label: 'pim alttaki tahtayı iter', lp: [0, -3.2, B / 2 + 0.6], alpha: S.path });
          O.push({ k: 'arrow', a: [0, 2, B / 2 + 0.6], b: [0, 6.4, B / 2 + 0.6], color: C.white, w: 2, label: 'ahşap yükü tavana taşır', lp: [0, 7, B / 2 + 0.6], alpha: S.path });
        }
        const lab = (t, P, a, red) => O.push({ k: 'text', t, p: P, color: red ? C.red : C.white, size: 14, box: 1, alpha: a });
        if (S.ha > 0.01) lab(`NET KESİT\n${p.w}·(${p.b}−${p.d}) = ${fmt(r.An, 0)} mm²`, [0, 2.6, B / 2 + 1.5], S.ha, 1);
        if (S.hb > 0.01) lab(`2 KAYMA DÜZLEMİ\n2·${p.w}·${p.c} = ${fmt(r.Ab, 0)} mm²`, [0, -cc - 1.6, B / 2 + 1], S.hb, 1);
        if (S.hc > 0.01) lab(`2 KESİT\n2·π·${p.d}²/4 = ${f1(r.As)} mm²`, [0, 2.4, 1.2], S.hc, 1);
        if (S.all > 0.01) {
          const Lb = [[`(a) çekme: ${f1(r.Pa)} kN`, r.Pa], [`(b) blok: ${f1(r.Pb)} kN`, r.Pb], [`(c) pim: ${f1(r.Pc)} kN`, r.Pc]];
          Lb.forEach(([t, val], i) => lab(t + (val === r.PU ? '  ← EN KÜÇÜK' : ''), [-W / 2 - 4.8, 9 - i * 1.6, 0], S.all, val === r.PU));
          lab(`P_izin = ${f1(r.PU)} / ${f1(p.ek)} = ${f2(r.Pz)} kN`, [-W / 2 - 4.8, 4, 0], S.all, 0);
        }
        if (S.ghost > 0.01) lab('Hangi yoldan kopar?\n(a) çekme · (b) blok · (c) pim', [0, 9.5, B / 2 + 1.2], S.ghost, 0);
      }
    };
  },
  whatif: {
    not: 'c\'yi büyütünce blok zor sıyrılır; ama bir yerden sonra pim belirleyici olur. Pimi büyütmek ise ahşabın net kesitini küçültür.',
    s: [{ k: 'c', ad: 'Pim altı boy c', min: 15, max: 120, step: 1, u: 'mm' }, { k: 'd', ad: 'Pim çapı d', min: 6, max: 24, step: 1, u: 'mm' }, { k: 'b', ad: 'Genişlik b', min: 25, max: 60, step: 1, u: 'mm' }, { k: 'ek', ad: 'Emniyet katsayısı', min: 1, max: 5, step: 0.1, u: '' }],
    out: (p, r) => {
      const mx = Math.max(r.Pa, r.Pb, r.Pc) * 1.08;
      const row = (t, v) => `<div class="bar ${v === r.PU ? 'gov' : ''}"><span>${t}</span><i style="width:${v / mx * 100}%"></i><b>${f1(v)} kN</b></div>`;
      return `<div class="bars">${row('(a) Ahşap çekme', r.Pa)}${row('(b) Blok kesme', r.Pb)}${row('(c) Pim çift kesme', r.Pc)}</div><p class="note">Belirleyici: <b>${r.gov}</b>. P_izin = ${f1(r.PU)} / ${f1(p.ek)} = <b>${f2(r.Pz)} kN</b></p>`;
    }
  },
  kagit: (p, r) => `(a) Ahşap çekme (net kesit): A = ${p.w}·(${p.b}−${p.d}) = ${fmt(r.An, 0)} mm²
    P_U = ${p.su}·${fmt(r.An, 0)} = ${f1(r.Pa)} kN
(b) Ahşap kesme (2 düzlem): A = 2·${p.w}·${p.c} = ${fmt(r.Ab, 0)} mm²
    P_U = ${f1(p.tw)}·${fmt(r.Ab, 0)} = ${f1(r.Pb)} kN
(c) Pim çift kesme: A = 2·π·${p.d}²/4 = ${f1(r.As)} mm²
    P_U = ${p.ts}·${f1(r.As)} = ${f1(r.Pc)} kN
P_U = min = ${f1(r.PU)} kN  (${r.gov})
P_izin = P_U / E.K. = ${f1(r.PU)} / ${f1(p.ek)} = ${f2(r.Pz)} kN`,
  tuzak: ['<b>Emniyet katsayısıyla çarpmak.</b> Kopma yükünü katsayıya <b>bölersin</b>; izin verilen yük daha küçük olmalı.',
    '<b>Tek kesme almak.</b> Pim ahşabın iki yanında kesilir: alan 2 · πd²/4.',
    '<b>Bloğun tek yüzeyini almak.</b> Blok iki yanından kayar: 2 · 40 · c.',
    '<b>Net kesitte b·40 kullanmak.</b> Delik d kadar malzeme götürür: 40 · (b − d).',
    '<b>Önce böl sonra min al karışıklığı.</b> Sonuç aynı çıkar ama sırayı koru: üç kopma yükü → en küçüğü → böl.'],
  gen() { return { w: rnd(30, 60, 5), b: rnd(30, 60, 5), c: rnd(30, 90, 5), d: rnd(8, 20, 2), su: rnd(40, 80, 5), tw: rnd(5, 10, 0.5), ts: rnd(120, 200, 10), ek: rnd(2, 4, 0.2) }; },
  pracText: p => `Tavana asılı ahşabın kesiti ${p.w} × ${p.b} mm, pim çapı ${p.d} mm, pimin altındaki ahşap boyu c = ${p.c} mm. Ahşap: çekmede ${p.su} MPa, kesmede ${f1(p.tw)} MPa; çelik pim kesmede ${p.ts} MPa kopuyor. Emniyet katsayısı ${f1(p.ek)}. Üç kopma yükünü ve izin verilen P'yi bul.`,
  ans: [{ k: 'Pa', ad: 'P_U (a) çekme', u: 'kN' }, { k: 'Pb', ad: 'P_U (b) blok', u: 'kN' }, { k: 'Pc', ad: 'P_U (c) pim', u: 'kN' }, { k: 'Pz', ad: 'P_izin', u: 'kN' }],
  hints: (p, r) => [`Net kesit: ${p.w} · (${p.b} − ${p.d}).`, `Blok iki düzlemden kayar: 2 · ${p.w} · ${p.c}.`, `Pim çift kesme: 2 · π · ${p.d}² / 4. Sonra en küçüğü ${f1(p.ek)}'ye böl.`],
  diag(p, r, u) {
    const near = (a, b) => isFinite(a) && Math.abs(a - b) <= Math.abs(b) * 0.02;
    if (near(u.Pc, r.Pc1)) return '(c) yarı çıkmış: pim iki yerden kesilir, alan 2 · πd²/4.';
    if (near(u.Pb, r.Pb1)) return '(b) yarı çıkmış: blok iki düzlemden kayar.';
    if (near(u.Pa, p.su * p.w * p.b / 1000)) return '(a) için deliksiz alan kullanmışsın: b − d.';
    if (near(u.Pz, r.PU * p.ek)) return 'Emniyet katsayısıyla çarpmışsın; bölmen gerek.';
    return 'Üç kopma yükünü ayrı ayrı bul; en küçüğü emniyete böl.';
  }
});
