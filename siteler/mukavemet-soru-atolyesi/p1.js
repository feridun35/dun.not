'use strict';
/* ============ PROBLEM 1 ============ */
PROBS.push({
  id: 'p1', no: 1, tip: 'kg',
  ad: 'Kol, dört çubuk ve pimler',
  ozet: 'Kola dışarıdan yük geliyor; kolu tutan çubuklardaki gerilmeyi soruyor. Önce kuvvet, sonra gerilme.',
  soru: 'Dört düşey bağlantı çubuğunun her birinin kesiti 8 × 36 mm\'lik düzgün dikdörtgendir ve dört pimin her birinin çapı 16 mm\'dir. (a) B ve D noktalarını birleştiren bağlantı çubuklarındaki, (b) C ve E noktalarını birleştiren bağlantı çubuklarındaki ortalama normal gerilmenin maksimum değerini belirleyiniz.',
  verilen: ['A ucunda P = 20 kN (yukarı)', 'AB = 0,25 m, BC = 0,40 m', 'Çubuk kesiti 36 mm × 8 mm', 'Pim çapı d = 16 mm', 'Her bağlantıda kolun iki yanında birer çubuk (toplam 4)'],
  istenen: 'σ<sub>BD</sub> ve σ<sub>CE</sub> (maksimum ortalama normal gerilme)',
  p0: { P: 20, AB: 0.25, BC: 0.40, b: 36, t: 8, d: 16, n: 2 },
  solve(p) {
    const AC = p.AB + p.BC, FBD = p.P * AC / p.BC, FCE = p.P * p.AB / p.BC;
    const fb = FBD / p.n, fc = FCE / p.n, An = (p.b - p.d) * p.t, Ag = p.b * p.t;
    return { AC, FBD, FCE, fb, fc, An, Ag, sBD: fb * 1000 / An, sCE: fc * 1000 / Ag, sBDg: fb * 1000 / Ag };
  },
  anlam: [
    ['Dört düşey bağlantı çubuğu', 'Her pimde kolun <b>iki yanında birer</b> çubuk var. Bulduğun kuvvet <b>ikiye bölünecek</b>.'],
    ['kesiti 8 × 36 mm', 'Bir çubuğun tam alanı 36 · 8 = 288 mm².'],
    ['pimin çapı 16 mm', 'Çubukta 16 mm\'lik <b>delik</b> var. Delikli kesit daha zayıf: (36 − 16) · 8.'],
    ['ortalama normal gerilme', 'σ = F / A. Kayma değil, çekme ya da bası.'],
    ['maksimum değeri', 'Alanın <b>en küçük</b> olduğu kesit: çekmede delikli kesit.'],
    ['A\'da 20 kN', 'Bilinen tek dış yük. Çubuk kuvvetlerini bundan, <b>moment</b> ile bulacağız.']
  ],
  tetik: ['kol + çubuk + pim', 'ortalama normal gerilme', 'pim çapı verilmiş', 'maksimum gerilme'],
  tetikNot: 'Çubuklar sadece iki pimden tutuluyor, üzerlerinde başka yük yok: kuvvet çubuk ekseni boyunca gider. Bunu görünce "önce kuvvet, sonra alan" de.',
  zincir: [["Ne isteniyor?", "Çubuklarda gerilme. σ = F / A, yani önce <b>F</b> lazım."], ["F'yi nereden bulurum?", "Çubuklar kolu tutuyor; kolun dengesinden. Kolu ayırıp <b>moment</b> alacağım."], ["Kaç bilinmeyen, kaç denklem?", "İki çubuk kuvveti; iki moment denklemi (B ve C'ye göre) yeter."], ["Bir pimde kaç çubuk var?", "Şekilde kolun iki yanında birer tane: kuvvet <b>yarıya</b> bölünür."], ["Hangi alan?", "Çekmedeki çubukta delik düşülür (net), basıdakinde tam alan."]],
  cam: { yaw: -0.16, pitch: 0.09, dist: 13, t: [0.8, -0.9, 0] },
  steps: [
    { t: 'Şekle bak: ne var, ne yok', st: { lab: 1, dim: 1, load: 1 },
      h: (p, r) => `Yatay bir kol (A–B–C). Kolu <b>iki çift</b> düşey çubuk tutuyor: B'den D'ye ve C'den E'ye. A ucundan ${f2(p.P)} kN yukarı itiliyor. Bilmediğimiz şey: çubukların ne kadar kuvvet taşıdığı.`,
      why: 'Gerilme sorusunda ilk iş hep şu: "hangi parça, hangi kuvveti taşıyor?" Kuvveti bilmeden σ = F / A yazamazsın.' },
    { t: 'Çubuklar iki kuvvet elemanı', st: { lab: 1, gl: 1, axial: 1 },
      h: () => 'Her çubuk sadece iki ucundaki pimden tutuluyor, ortasına yük gelmiyor. Böyle parçada kuvvet <b>çubuğun ekseni boyunca</b> gider. Yani çubukta sadece çekme ya da bası var.',
      why: 'İki noktadan tutulan bir parça dengedeyse, iki uçtaki kuvvet eşit, zıt ve aynı doğru üzerinde olmak zorunda. O doğru da iki pimi birleştiren doğru: çubuğun ekseni.' },
    { t: 'Kolu ayır, kuvvetleri çiz (SCD)', st: { links: 0.12, base: 0, fbd: 1, tend: 1, lab: 1 },
      h: (p) => `Kolu tek başına düşün. Üstünde üç kuvvet var: A'da ${f2(p.P)} kN (yukarı), B'de F<sub>BD</sub>, C'de F<sub>CE</sub>. Kol B etrafında hafifçe döner (animasyona bak): A yukarı, C aşağı gitmek ister. Çubuklar bu harekete <b>karşı koyar</b>, oklar çubuğun kola uyguladığı kuvveti gösterir.`,
      why: 'Kolu tahterevalli gibi düşün; B ortadaki dayanak noktası. A yukarı itilince sol uç (A) yukarı, sağ uç (C) aşağı gitmek ister (kesikli oklar). Bu sırada B de yukarı kalkmak ister. Çubuk, kolun hareketine karşı koyar: BD, B\'yi aşağı çeker, yani BD gerilir (çekme). CE, C\'yi yukarı iter, yani CE sıkışır (bası). Ok, kolun üstündeki kuvveti gösterir. Kol yukarı gitmek istedi, çubuk onu aşağı tuttu. Sınavda yönü tahmin etmek şart değil: hepsini çekme varsay, hesap sonucu eksi çıkan bası demektir.' },
    { t: 'C\'ye göre moment al → F_BD', st: { links: 0.12, base: 0, fbd: 1, mC: 1, lab: 1 },
      h: (p, r) => `Momenti <b>C</b>'ye göre alıyoruz, çünkü F<sub>CE</sub> tam C'den geçiyor: kolu sıfır, denklemden düşer. Geriye tek bilinmeyen kalır.`,
      f: (p, r) => `${f2(p.P)} · ${f2(r.AC)} = F<sub>BD</sub> · ${f2(p.BC)} → <b>F<sub>BD</sub> = ${f2(r.FBD)} kN</b> (çekme)`,
      why: 'Moment = kuvvet × dik uzaklık. Bir kuvvet seçtiğin noktadan geçiyorsa uzaklığı 0, momenti 0. Bilinmeyenin üstünden moment almak onu yok etmenin en kısa yolu.' },
    { t: 'B\'ye göre moment al → F_CE', st: { links: 0.12, base: 0, fbd: 1, mB: 1, lab: 1 },
      h: () => 'Şimdi <b>B</b>\'ye göre: bu sefer F<sub>BD</sub> düşer.',
      f: (p, r) => `${f2(p.P)} · ${f2(p.AB)} = F<sub>CE</sub> · ${f2(p.BC)} → <b>F<sub>CE</sub> = ${f2(r.FCE)} kN</b> (bası)` },
    { t: 'Sağlama: düşey kuvvetler', st: { links: 0.12, base: 0, fbd: 1, tend: 1, val: 1, lab: 1 },
      h: () => 'Yukarı olanlar artı, aşağı olanlar eksi. Toplam sıfır çıkmalı. Oklar kolun üstündeki kuvvetlerdir: BD çubuğu B\'yi aşağı tutar, CE çubuğu C\'yi yukarı iter. Kolun kendisi ise A yukarı, C aşağı dönmek ister (kesikli oklar).',
      f: (p, r) => `${f2(p.P)} − ${f2(r.FBD)} + ${f2(r.FCE)} = <b>${f2(p.P - r.FBD + r.FCE)}</b> ✓` },
    { t: 'Her bağlantıda iki çubuk var', st: { split: 1, lab: 1 },
      h: (p, r) => `F<sub>BD</sub> tek bir çubuğa değil, kolun iki yanındaki <b>iki</b> çubuğa dağılıyor. Bir çubuk: ${f2(r.FBD)} / ${p.n} = <b>${f2(r.fb)} kN</b>. Aynı şekilde CE: ${f2(r.FCE)} / ${p.n} = <b>${f2(r.fc)} kN</b>.`,
      why: 'Şekle dikkat: B\'de kolun önünde de arkasında da çubuk var. Soruda "dört çubuk" demesi bunun ipucu.' },
    { t: 'Hangi alan? Delik fark eder', st: { sec: 1, links: 1, load: 0 }, cam: { yaw: -0.2, pitch: 0.12, dist: 8.2, t: [1.3, -1.3, 0.3] },
      h: (p, r) => `<b>BD çekmede:</b> çubuk delikli kesitten kopar, delik malzeme değil. Net alan = (${p.b} − ${p.d}) · ${p.t} = <b>${f1(r.An)} mm²</b>.<br><b>CE basıda:</b> delikte pim var, kuvveti pim taşır, kesit zayıflamaz. Tam alan = ${p.b} · ${p.t} = <b>${f1(r.Ag)} mm²</b>.`,
      why: 'Çekmede çubuğu ikiye ayırmaya çalışan kuvvet, delik hizasında daha az malzeme bulur. Basıda delik doluyken parçalar birbirini iter, delik bir boşluk gibi davranmaz.' },
    { t: 'Gerilmeler: σ = F / A', st: { def: 1, colr: 1, split: 1, sv: 1 },
      h: () => 'Kuvveti newtona çevir, alanı mm² bırak: sonuç doğrudan MPa (N/mm²). Kırmızı = çekme, mavi = bası. Şekil değişimi çok abartılı: B yukarı çıkıp BD\'yi uzatıyor, C aşağı inip CE\'yi kısaltıyor (kesikli çizgi kolun ilk yeri).',
      f: (p, r) => `σ<sub>BD</sub> = ${fmt(r.fb * 1000, 0)} / ${f1(r.An)} = <b>${f1(r.sBD)} MPa</b> (çekme)<br>σ<sub>CE</sub> = ${fmt(r.fc * 1000, 0)} / ${f1(r.Ag)} = <b>−${f1(r.sCE)} MPa</b> (bası)` }
  ],
  scene(v, p, r) {
    const U = 10, xA = -p.AB * U, xC = p.BC * U, cx = (xA + xC) / 2, LL = 2;
    const lev = v.add(E3.box(xC - xA + 0.8, 0.5, 0.3), { color: '#8a96a3', pos: [cx, 0, 0], piv: [-cx, 0, 0] });
    const lk = shift(E3.box(0.36, LL + 0.5, 0.08), 0, LL / 2, 0);
    const L = [[0, 0.21], [0, -0.21], [xC, 0.21], [xC, -0.21]].map(([x, z]) => v.add(lk, { color: C.steel, pos: [x, -LL, z] }));
    const pin = E3.cyl(0.08, 0.62, 18, 'z');
    const pB = v.add(pin, { color: '#d7dde3', pos: [0, 0, 0] }), pC = v.add(pin, { color: '#d7dde3', pos: [xC, 0, 0] });
    v.add(pin, { color: '#d7dde3', pos: [0, -LL, 0] }); v.add(pin, { color: '#d7dde3', pos: [xC, -LL, 0] });
    const fin = v.add(E3.box(xC + 1.2, 0.7, 0.3), { color: C.base, pos: [xC / 2, -LL - 0.12, 0] });
    const bs = v.add(E3.box(xC + 2.6, 0.4, 1.4), { color: '#2a323c', pos: [xC / 2, -LL - 0.66, 0], bias: 0.8 });
    const secN = [-0.13, 0.13].map(x => v.add(E3.box(0.1, 0.03, 0.1), { color: C.red, pos: [x, -LL, 0.21], alpha: 0 }));
    const secG = v.add(E3.box(0.38, 0.03, 0.1), { color: C.comp, pos: [xC, -LL, 0.21], alpha: 0 });
    const def = { lab: 0, dim: 0, load: 1, gl: 0, axial: 0, links: 1, base: 1, fbd: 0, mC: 0, mB: 0, val: 0, split: 0, sec: 0, def: 0, colr: 0, sv: 0, tend: 0 };
    return {
      def, apply(S, time, v) {
        const k = 0.6 * S.ex * (S.def + 0.55 * S.tend * loop(time, 2.2)), dB = k, dC = -k * Math.max(r.FCE / r.FBD, 0.5), ang = Math.atan2(dC - dB, xC);
        const y = x => dB + x * (dC - dB) / xC;
        lev.pos = [cx, dB, 0]; lev.rot = [0, 0, ang];
        pB.pos = [0, dB, 0]; pC.pos = [xC, dC, 0];
        L.forEach((o, i) => {
          const top = i < 2 ? dB : dC; o.scl = [1, (LL + top) / LL, 1]; o.alpha = S.links; o.glow = S.gl * (0.6 + 0.4 * loop(time, 3));
          o.color = i < 2 ? mixHex(C.steel, C.tens, S.colr) : mixHex(C.steel, C.comp, S.colr);
        });
        fin.alpha = bs.alpha = S.base;
        secN.forEach(o => o.alpha = S.sec * 0.95); secG.alpha = S.sec * 0.95;
        const O = v.ov, yA = y(xA);
        O.push({ k: 'arrow', a: [xA, yA - 2.1, 0], b: [xA, yA - 0.3, 0], color: C.red, w: 3, label: `${f2(p.P)} kN`, lp: [xA - 0.6, yA - 1.6, 0], alpha: S.load });
        if (S.lab > 0.01) [['A', xA - 0.35, yA + 0.45, 0], ['B', 0, dB + 0.55, 0], ['C', xC, dC + 0.55, 0], ['D', -0.45, -LL - 0.05, 0.3], ['E', xC + 0.45, -LL - 0.05, 0.3]]
          .forEach(([t, x, yy, z]) => O.push({ k: 'text', t, p: [x, yy, z], size: 16, alpha: S.lab * (t === 'D' || t === 'E' ? S.base * 0.8 + 0.2 : 1) }));
        O.push({ k: 'dim', a: [xA, 0.3, 0], b: [0, 0.3, 0], off: [0, 0.9, 0], t: `${f2(p.AB)} m`, alpha: S.dim });
        O.push({ k: 'dim', a: [0, 0.3, 0], b: [xC, 0.3, 0], off: [0, 0.9, 0], t: `${f2(p.BC)} m`, alpha: S.dim });
        if (S.axial > 0.01) [[0, 0.21], [xC, 0.21]].forEach(([x, z]) => {
          O.push({ k: 'arrow', a: [x, -0.9, z + 0.3], b: [x, 0.35, z + 0.3], color: C.white, w: 2, alpha: S.axial * 0.9 });
          O.push({ k: 'arrow', a: [x, -1.1, z + 0.3], b: [x, -2.35, z + 0.3], color: C.white, w: 2, alpha: S.axial * 0.9 });
        });
        const fa = S.fbd, T0 = '#e9edf1';
        if (S.tend > 0.01) {
          const arc = (a0, a1, R) => { const P = []; for (let i = 0; i <= 12; i++) { const a = (a0 + (a1 - a0) * i / 12) * Math.PI / 180; P.push([R * Math.cos(a), dB + R * Math.sin(a), 0.3]); } return P; };
          [[205, 150], [28, -28]].forEach(([a0, a1]) => { const P = arc(a0, a1, 1.45), n = P.length; O.push({ k: 'line', p: P.slice(0, n - 1), color: C.red, w: 2.2, alpha: S.tend * 0.9 }); O.push({ k: 'arrow', a: P[n - 2], b: P[n - 1], color: C.red, w: 2.2, hs: 9, alpha: S.tend * 0.9 }); });
          O.push({ k: 'text', t: 'B etrafında\ndönme', p: [-1.0, dB - 1.0, 0.3], color: C.red, size: 13, box: 1, alpha: S.tend });
          const tx = 'yukarı gitmek ister', dn = 'aşağı gitmek ister';
          O.push({ k: 'arrow', a: [xA + 0.6, yA + 0.35, 0.3], b: [xA + 0.6, yA + 1.15, 0.3], color: T0, w: 1.8, dash: [5, 4], alpha: S.tend * 0.85 });
          O.push({ k: 'text', t: 'A ' + tx, p: [xA + 0.6, yA + 1.5, 0.3], color: T0, size: 13, box: 1, alpha: S.tend });
          O.push({ k: 'arrow', a: [0.55, dB + 0.35, 0.3], b: [0.55, dB + 1.15, 0.3], color: T0, w: 1.8, dash: [5, 4], alpha: S.tend * 0.85 });
          O.push({ k: 'text', t: 'B ' + tx, p: [1.75, dB + 1.5, 0.3], color: T0, size: 13, box: 1, alpha: S.tend });
          O.push({ k: 'arrow', a: [xC + 0.95, dC + 0.1, 0.3], b: [xC + 0.95, dC - 0.8, 0.3], color: T0, w: 1.8, dash: [5, 4], alpha: S.tend * 0.85 });
          O.push({ k: 'text', t: 'C ' + dn, p: [xC + 1.7, dC - 1.15, 0.3], color: T0, size: 13, box: 1, alpha: S.tend });
        }
        if (S.def > 0.01) {
          O.push({ k: 'line', p: [[xA - 0.4, 0, 0.3], [xC + 0.4, 0, 0.3]], dash: [6, 5], color: C.mute, w: 1.2, alpha: S.def * 0.8 });
          O.push({ k: 'text', t: 'B yukarı\nBD uzar', p: [0, dB + 0.95, 0.3], color: C.tens, size: 13, box: 1, alpha: S.def });
          O.push({ k: 'text', t: 'C aşağı\nCE kısalır', p: [xC, dC + 0.95, 0.3], color: C.comp, size: 13, box: 1, alpha: S.def });
        }
        O.push({ k: 'arrow', a: [0, 2.0, 0], b: [0, dB + 0.3, 0], color: C.white, w: 2.6, label: S.val > 0.5 ? `F_BD = ${f2(r.FBD)} kN` : S.tend > 0.5 ? 'F_BD (kolu aşağı tutar)' : 'F_BD', lp: [0, 2.35, 0], alpha: fa });
        O.push({ k: 'arrow', a: [xC, -2.0, 0], b: [xC, dC - 0.3, 0], color: C.white, w: 2.6, label: S.val > 0.5 ? `F_CE = ${f2(r.FCE)} kN` : S.tend > 0.5 ? 'F_CE (kolu yukarı iter)' : 'F_CE', lp: [xC, -2.35, 0], alpha: fa * (1 - 0.7 * S.mC) });
        if (S.mC > 0.01) {
          O.push({ k: 'ring', c: [xC, 0, 0.16], r: 0.42, color: C.red, w: 2.5, alpha: S.mC });
          O.push({ k: 'text', t: 'C\'den geçiyor → momenti 0', p: [xC + 0.2, -2.8, 0], color: C.mute, size: 13, alpha: S.mC });
          O.push({ k: 'dim', a: [xA, -0.3, 0], b: [xC, -0.3, 0], off: [0, -0.9, 0], t: `kol ${f2(r.AC)} m`, alpha: S.mC });
          O.push({ k: 'dim', a: [0, 0.3, 0], b: [xC, 0.3, 0], off: [0, 0.7, 0], t: `kol ${f2(p.BC)} m`, alpha: S.mC });
        }
        if (S.mB > 0.01) {
          O.push({ k: 'ring', c: [0, 0, 0.16], r: 0.42, color: C.red, w: 2.5, alpha: S.mB });
          O.push({ k: 'dim', a: [xA, -0.3, 0], b: [0, -0.3, 0], off: [0, -0.9, 0], t: `kol ${f2(p.AB)} m`, alpha: S.mB });
          O.push({ k: 'dim', a: [0, -0.3, 0], b: [xC, -0.3, 0], off: [0, -0.9, 0], t: `kol ${f2(p.BC)} m`, alpha: S.mB });
          O.push({ k: 'text', t: 'B\'den geçiyor → momenti 0', p: [0, 2.7, 0], color: C.mute, size: 13, alpha: S.mB });
        }
        if (S.split > 0.01) {
          O.push({ k: 'text', t: `önde ve arkada\nher biri ${f2(r.fb)} kN`, p: [-1.15, -1, 0.3], color: S.colr > 0.5 ? C.tens : C.white, size: 14, box: 1, alpha: S.split });
          O.push({ k: 'text', t: `önde ve arkada\nher biri ${f2(r.fc)} kN`, p: [xC + 1.25, -1, 0.3], color: S.colr > 0.5 ? C.comp : C.white, size: 14, box: 1, alpha: S.split });
        }
        if (S.sec > 0.01) {
          O.push({ k: 'ring', c: [0, -LL, 0.26], r: 0.08, u: [1, 0, 0], v: [0, 1, 0], color: C.white, w: 1.5, alpha: S.sec });
          O.push({ k: 'text', t: `NET KESİT\n(${p.b} − ${p.d}) · ${p.t} = ${f1(r.An)} mm²`, p: [0, -LL + 0.75, 0.3], color: C.tens, size: 14, box: 1, alpha: S.sec });
          O.push({ k: 'text', t: `TAM KESİT\n${p.b} · ${p.t} = ${f1(r.Ag)} mm²`, p: [xC, -LL + 0.75, 0.3], color: C.comp, size: 14, box: 1, alpha: S.sec });
        }
        if (S.sv > 0.01) {
          O.push({ k: 'text', t: `σ_BD = ${f1(r.sBD)} MPa`, p: [-1.2, -2.6, 0.4], color: C.tens, size: 16, box: 1, alpha: S.sv });
          O.push({ k: 'text', t: `σ_CE = −${f1(r.sCE)} MPa`, p: [xC + 1.2, -2.6, 0.4], color: C.comp, size: 16, box: 1, alpha: S.sv });
        }
      }
    };
  },
  whatif: {
    not: 'Kaydırıcıları oynat. Kolun boyları değişince kuvvetler, pim büyüyünce net alan değişir. Hangisinin daha çok etkilediğini gör.',
    s: [{ k: 'P', ad: 'Yük P', min: 5, max: 40, step: 1, u: 'kN' }, { k: 'AB', ad: 'AB', min: 0.05, max: 0.6, step: 0.01, u: 'm' }, { k: 'BC', ad: 'BC', min: 0.15, max: 0.8, step: 0.01, u: 'm' }, { k: 'd', ad: 'Pim çapı d', min: 6, max: 30, step: 1, u: 'mm' }],
    out: (p, r) => `<div class="mets"><div class="m"><small>F_BD (çekme)</small><b>${f2(r.FBD)} kN</b></div><div class="m"><small>F_CE (bası)</small><b>${f2(r.FCE)} kN</b></div>
      <div class="m red"><small>σ_BD (net kesit)</small><b>${f1(r.sBD)} MPa</b></div><div class="m blue"><small>σ_CE (tam kesit)</small><b>−${f1(r.sCE)} MPa</b></div></div>
      <p class="note">F_BD her zaman P'den büyük: F_BD = F_CE + P. AB kısalırsa F_CE küçülür, F_BD de P'ye yaklaşır. Pimi büyütmek sadece çekmedeki çubuğu zayıflatır: BD'nin gerilmesi artar, CE değişmez.</p>`
  },
  kagit: (p, r) => `SCD (kol ABC):
ΣM_C = 0:  ${f2(p.P)}·${f2(r.AC)} − F_BD·${f2(p.BC)} = 0  →  F_BD = ${f2(r.FBD)} kN (çekme)
ΣM_B = 0:  ${f2(p.P)}·${f2(p.AB)} − F_CE·${f2(p.BC)} = 0  →  F_CE = ${f2(r.FCE)} kN (bası)
Kontrol ΣF_y: ${f2(p.P)} − ${f2(r.FBD)} + ${f2(r.FCE)} = 0 ✓
Her bağlantıda ${p.n} çubuk:  F_BD,1 = ${f2(r.fb)} kN   F_CE,1 = ${f2(r.fc)} kN
A_net = (${p.b}−${p.d})·${p.t} = ${f1(r.An)} mm²     A = ${p.b}·${p.t} = ${f1(r.Ag)} mm²
σ_BD = ${fmt(r.fb * 1000, 0)}/${f1(r.An)} = ${f1(r.sBD)} MPa
σ_CE = −${fmt(r.fc * 1000, 0)}/${f1(r.Ag)} = −${f1(r.sCE)} MPa`,
  tuzak: ['<b>İkiye bölmeyi unutmak.</b> Kuvveti tek çubuğa yüklersen gerilme iki kat çıkar.',
    '<b>Çekmede tam alanı kullanmak.</b> BD için 288 mm² kullanırsan 56,4 MPa bulursun; doğrusu delikli kesit, 101,6 MPa.',
    '<b>Basıda net alanı kullanmak.</b> Delikte pim var; tam alan kullanılır.',
    '<b>Moment kolunu karıştırmak.</b> C\'ye göre A\'nın kolu AB değil AC = AB + BC.',
    '<b>Birim.</b> kN\'yi N\'ye çevir (× 1000), alanı mm²\'de bırak: N/mm² = MPa.'],
  gen() {
    const b = rnd(24, 44, 2), d = rnd(8, Math.min(20, b - 10), 2);
    return { P: rnd(10, 40, 2), AB: rnd(0.15, 0.4, 0.05), BC: rnd(0.3, 0.6, 0.05), b, t: pick([6, 8, 10, 12]), d, n: 2 };
  },
  pracText: p => `Aynı düzen: A ucunda ${f2(p.P)} kN yukarı yük. AB = ${f2(p.AB)} m, BC = ${f2(p.BC)} m. Her bağlantıda iki çubuk var; çubuk kesiti ${p.b} × ${p.t} mm, pim çapı ${p.d} mm. Çubuk kuvvetlerini ve iki çubuk grubundaki maksimum ortalama normal gerilmeyi bul.`,
  ans: [{ k: 'FBD', ad: 'F_BD (toplam)', u: 'kN' }, { k: 'FCE', ad: 'F_CE (toplam)', u: 'kN' }, { k: 'sBD', ad: 'σ_BD', u: 'MPa' }, { k: 'sCE', ad: 'σ_CE (büyüklük)', u: 'MPa', abs: 1 }],
  hints: (p, r) => [`Momenti C'ye göre al. A'nın C'ye uzaklığı ${f2(p.AB)} + ${f2(p.BC)} = ${f2(r.AC)} m.`,
    `F_BD bulunca ikiye böl: bir çubuk ${f2(r.fb)} kN taşır.`, `BD çekmede: alan (${p.b} − ${p.d}) · ${p.t}. CE basıda: alan ${p.b} · ${p.t}.`],
  diag(p, r, u) {
    const near = (a, b) => isFinite(a) && Math.abs(a - b) <= Math.abs(b) * 0.02;
    if (near(u.sBD, r.sBD * 2)) return 'σ_BD tam iki katı çıkmış: kuvveti iki çubuğa bölmeyi unuttun.';
    if (near(u.sBD, r.sBDg)) return 'σ_BD için tam alanı kullanmışsın. Çekmede delikli (net) kesit kullanılır.';
    if (near(u.FBD, p.P * p.AB / p.BC) || near(u.FCE, p.P * (p.AB + p.BC) / p.BC)) return 'F_BD ile F_CE yer değiştirmiş. C\'ye göre momentte F_BD bulunur.';
    if (near(u.FBD, p.P * p.AB / p.BC + 0) && !near(u.FBD, r.FBD)) return 'Moment kolunu kontrol et: A\'nın C\'ye uzaklığı AB + BC.';
    return 'Adım adım git: önce iki moment denklemi, sonra ikiye böl, sonra doğru alan.';
  }
});
