'use strict';
/* ============ VİZE 12 · 2017–18 Güz S1: iki kola bağlı rijit ABC, A'nın inişi sınırlı → P_max ============ */
VIZE.push({
  id: 'v12', no: 12, kod: 'V12', vize: true, tip: 'rk',
  src: '2017–18 Güz vizesi · Soru 1', img: 'img/v12.png',
  ad: 'Biri yukarıda biri aşağıda iki kol: A\'nın inişinden P_max',
  ozet: 'Kuvvetleri P cinsinden bul, uzamaları P cinsinden yaz, rijit doğrudan A\'nın inişini P cinsinden çıkar, sonra 0,35 mm\'ye eşitle. Püf noktası: CE çekmede ama C\'yi yukarı kaldırıyor.',
  soru: 'BD bağlantı kolu pirinçten (E = 105 GPa) yapılmıştır ve 280 mm²\'lik kesit alanına sahiptir. CE bağlantı kolu alüminyumdan (E = 72 GPa) yapılmıştır ve 300 mm²\'lik kesit alanına sahiptir. Bu kollar rijit ABC elemanını desteklemektedir. A noktasının yer değiştirmesinin 0,35 mm\'yi geçmemesi gerekiyorsa, A noktasına uygulanabilen maksimum P kuvvetini belirleyiniz. <br><small style="opacity:.75">Not: Fotoğrafın sağ kenarı kesik; CE\'nin alanı okunmuyor. Soru Beer &amp; Johnston\'dan alınmış; kitaptaki 300 mm² kullanıldı. BD alanı kâğıtta açıkça 280 mm² (kitapta 240 mm²).</small>',
  verilen: ['BD (pirinç): E = 105 GPa, A = 280 mm², L = 225 mm. D tavanda, BD B\'den yukarı çıkıyor', 'CE (alüminyum): E = 72 GPa, A = 300 mm² (fotoğrafta kesik, kitaptaki değer), L = 150 mm. E yerde, CE C\'den aşağı iniyor', 'ABC rijit, yatay: AB = 125 mm, BC = 225 mm (A, B\'nin solunda, dışarıda)', 'P, A\'da düşey aşağı', 'Sınır: δ<sub>A</sub> ≤ 0,35 mm'],
  istenen: 'A\'nın inişi 0,35 mm\'yi geçmeyecek en büyük P',
  p0: { AB: 125, BC: 225, LBD: 225, LCE: 150, A1: 280, E1: 105, A2: 300, E2: 72, dA: 0.35 },
  solve(p) {
    const AC = p.AB + p.BC;
    const kB = AC / p.BC, kC = p.AB / p.BC;               // F_BD = kB·P, F_CE = kC·P
    const EA1 = p.A1 * p.E1 * 1000, EA2 = p.A2 * p.E2 * 1000; // N
    const cB = kB * 1000 * p.LBD / EA1, cC = kC * 1000 * p.LCE / EA2; // mm / kN (P kN iken)
    const cT = (cB + cC) / p.BC, cA = cB + p.AB * cT;     // rad / kN, mm / kN
    const Pk = p.dA / cA;
    return { AC, kB, kC, EA1, EA2, cB, cC, cT, cA, Pk, FBD: kB * Pk, FCE: kC * Pk, dB: cB * Pk, dC: cC * Pk, th: cT * Pk,
      s1: kB * Pk * 1000 / p.A1, s2: kC * Pk * 1000 / p.A2, x0: p.BC * cB / (cB + cC),
      wOnlyB: p.dA / cB, wSign: p.dA / (cB + p.AB * (cB - cC) / p.BC), wFixC: p.dA / (cB * AC / p.BC) };
  },
  anlam: [
    ['rijit ABC elemanı', 'ABC <b>eğilmez</b>: iner ve döner ama hep düz bir çizgi kalır. Noktalarının yer değiştirmesi doğrusal değişir.'],
    ['BD … pirinç, CE … alüminyum, E ve A verilmiş', 'Kollar <b>uzar ya da kısalır</b>: δ = F·L/(A·E). Her kolun kendi E\'si ve A\'sı var, ayrı ayrı hesaplanır.'],
    ['D yukarıda, E aşağıda (şekil)', 'BD tavana, CE yere bağlı. Yön buradan çıkar: BD uzarsa B <b>iner</b>; CE uzarsa C <b>kalkar</b>.'],
    ['A noktası B\'nin solunda', 'A iki kolun <b>dışında</b>. Kiriş dönünce A, B\'den de çok iner: δ<sub>A</sub> > δ<sub>B</sub>.'],
    ['0,35 mm\'yi geçmemesi', 'Bu bir sınır: δ<sub>A</sub> = 0,35 mm yap, P\'yi çöz. Her şey P ile <b>orantılı</b>, o yüzden önce her şeyi "çarpı P" olarak yaz.'],
    ['maksimum P', 'Bilinmeyen yük. Kuvvetler, uzamalar ve δ<sub>A</sub> hep P\'nin katı çıkacak.']
  ],
  tetik: ['rijit', 'bağlantı kolu', 'E ve A verilmiş', 'yer değiştirmesi … geçmemesi', 'maksimum P'],
  tetikNot: '"Rijit + kollar + yer değiştirme" = denge → uzama → benzer üçgen. "… geçmemesi, maksimum P" = aynı yolu ters yürü: δ<sub>A</sub>\'yı P cinsinden yaz, sınıra eşitle.',
  zincir: [
    ['Ne isteniyor?', 'P_max. Ama sınır bir <b>yer değiştirme</b> (δ<sub>A</sub>). Demek ki δ<sub>A</sub>\'yı P cinsinden yazmalıyım.'],
    ['δ<sub>A</sub> neye bağlı?', 'ABC rijit: B ve C\'nin hareketi belli olursa A doğrunun uzantısından bulunur.'],
    ['B ve C ne kadar oynar?', 'Kollar kadar: δ = F·L/(A·E). Bunun için kol kuvvetleri lazım.'],
    ['Kol kuvvetleri?', 'ABC\'yi ayır. C\'ye göre moment → F<sub>BD</sub>; B\'ye göre moment → F<sub>CE</sub>.'],
    ['Hangi yöne oynarlar?', 'İkisi de çekmede (uzar). BD\'nin sabit ucu yukarıda → B iner. CE\'nin sabit ucu aşağıda → C <b>kalkar</b>.'],
    ['Sonra?', 'Kiriş B ile C arasında bir noktada döner. A dışarıda: δ<sub>A</sub> = δ<sub>B</sub> + AB·θ. Sonra = 0,35 mm, P\'yi çöz.']
  ],
  cam: { yaw: -0.22, pitch: 0.08, dist: 10.3, t: [0.85, 0.05, 0] },
  steps: [
    { t: 'Şekle bak', st: { dim: 1, lab: 1, load: 1 },
      h: () => 'Yatay rijit ABC kirişi iki kola bağlı. Pirinç BD kolu B\'den <b>yukarı</b>, tavandaki D\'ye gidiyor. Alüminyum CE kolu C\'den <b>aşağı</b>, yerdeki E\'ye iniyor. P, en soldaki A\'da aşağı. A iki kolun dışında kalıyor.',
      why: 'Kolların hangi tarafta sabitlendiği, sonradan "B iner mi kalkar mı, C iner mi kalkar mı" sorusunun cevabını verecek. Bu soruda en çok hata buradan çıkıyor.' },
    { t: 'SCD: ABC\'yi ayır', st: { fbd: 1, lab: 1, load: 1, links: 0.15 },
      h: () => 'Kirişi kollardan kopar. Üstünde üç kuvvet var: A\'da P (aşağı), B\'de F<sub>BD</sub>, C\'de F<sub>CE</sub>. Yönlerini tahmin et: P, A\'yı aşağı bastırınca kiriş B etrafında döner ve C yukarı kalkmak ister. CE kolu C\'yi <b>aşağı</b> tutmalı. B\'yi ise BD yukarı tutar.',
      why: 'Kol, kirişi kendi sabit ucuna doğru çekiyorsa çekmededir. BD, B\'yi yukarı (D\'ye doğru) çekiyor: çekme. CE, C\'yi aşağı (E\'ye doğru) çekiyor: o da çekme.' },
    { t: 'C\'ye göre moment → F_BD', st: { fbd: 1, mC: 1, lab: 1, load: 1, links: 0.15 },
      h: () => 'Momenti C\'de al: F<sub>CE</sub> C\'den geçer, denklemden düşer. P\'nin C\'ye kolu AC = AB + BC; F<sub>BD</sub>\'nin kolu BC.',
      f: (p, r) => `F<sub>BD</sub> · ${p.BC} = P · ${r.AC} → <b>F<sub>BD</sub> = ${f4(r.kB)} · P</b> (çekme)`,
      why: 'P, kolu en uzun olan kuvvet; bu yüzden F<sub>BD</sub> P\'den büyük çıkar. Kaldıraç gibi düşün: B destek gibi davranıyor, A ucu uzun.' },
    { t: 'B\'ye göre moment → F_CE', st: { fbd: 1, mB: 1, lab: 1, load: 1, links: 0.15 },
      h: () => 'Momenti B\'de al: F<sub>BD</sub> düşer. P\'nin kolu AB, F<sub>CE</sub>\'nin kolu BC. P kirişi A aşağı, C yukarı olacak şekilde döndürmek ister; F<sub>CE</sub> C\'yi aşağı çekerek bunu dengeler.',
      f: (p, r) => `F<sub>CE</sub> · ${p.BC} = P · ${p.AB} → <b>F<sub>CE</sub> = ${f4(r.kC)} · P</b> (çekme)<br>Kontrol (düşey): ${f4(r.kB)}P − ${f4(r.kC)}P − P = 0 ✓` },
    { t: 'Uzamalar, P cinsinden', st: { def: 1, dl: 1, lab: 1, load: 1 },
      h: (p, r) => `İki kolun malzemesi ve alanı farklı: paydaları ayrı hesapla. A·E (BD) = ${p.A1} · ${fmt(p.E1 * 1000, 0)} = ${sci(r.EA1)} N; A·E (CE) = ${p.A2} · ${fmt(p.E2 * 1000, 0)} = ${sci(r.EA2)} N. P\'yi kN olarak tut, kuvveti N\'ye çevirmek için 1000 ile çarp.`,
      f: (p, r) => `δ<sub>BD</sub> = ${f4(r.kB)}·1000·P · ${p.LBD} / ${sci(r.EA1)} = <b>${fmt(r.cB, 6)} · P mm</b><br>δ<sub>CE</sub> = ${f4(r.kC)}·1000·P · ${p.LCE} / ${sci(r.EA2)} = <b>${fmt(r.cC, 6)} · P mm</b> &nbsp;(P kN)`,
      why: 'P bilinmiyor diye takılma: δ = F·L/(AE) ve F = (sayı)·P olduğu için δ de (sayı)·P olur. Kolları kırmızı görüyorsun: ikisi de çekmede, ikisi de uzuyor.' },
    { t: 'B iner, C kalkar', st: { def: 1, ghost: 1, dir: 1, lab: 1, load: 1 },
      h: (p, r) => `İki kol da uzuyor ama sonuç zıt yönde. BD\'nin üst ucu D sabit: uzayınca alt ucu B <b>iner</b> (${fmt(r.cB, 6)}·P). CE\'nin alt ucu E sabit: uzayınca üst ucu C <b>kalkar</b> (${fmt(r.cC, 6)}·P). Kesikli çizgi kirişin ilk konumu; hareket abartılı.`,
      why: 'Kural: kolun uzaması, serbest ucu sabit uçtan <b>uzaklaştırır</b>. D yukarıda → B aşağı gider. E aşağıda → C yukarı gider. Kitaptaki çözüm de δ<sub>C</sub>\'yi yukarı alır.' },
    { t: 'Rijit doğru: A\'nın inişi', st: { def: 1, geo: 1, ghost: 1, lab: 1, load: 1 },
      h: (p, r) => `B aşağı, C yukarı gittiği için kiriş, aradaki bir O noktası etrafında döner (O\'da iniş sıfır). Dönme açısı: B ile C arasındaki toplam fark bölü BC. A, B\'nin ${p.AB} mm solunda: B\'nin inişine AB·θ kadar daha eklenir.`,
      f: (p, r) => `θ = (δ<sub>B</sub> + δ<sub>C</sub>) / BC = (${fmt(r.cB, 6)} + ${fmt(r.cC, 6)})·P / ${p.BC} = ${sci(r.cT)} · P rad<br>δ<sub>A</sub> = δ<sub>B</sub> + AB·θ = ${fmt(r.cB, 6)}·P + ${p.AB} · ${sci(r.cT)}·P = <b>${fmt(r.cA, 6)} · P mm</b>`,
      why: "Benzer üçgenle de aynı sonuç: kiriş O noktasında sıfır iner. O, B'den x₀ = BC·δ<sub>B</sub>/(δ<sub>B</sub>+δ<sub>C</sub>) kadar sağda (soru sayılarıyla ≈ 170 mm). A, O'dan AB + x₀ uzakta: δ<sub>A</sub>/(AB + x₀) = δ<sub>B</sub>/x₀. δ<sub>C</sub>'yi yanlışlıkla aşağı alırsan θ küçülür ve P olduğundan büyük çıkar." },
    { t: 'Sınıra eşitle → P_max', st: { def: 1, geo: 1, ghost: 1, fin: 1, lab: 1, load: 1 },
      h: (p, r) => `δ<sub>A</sub> en çok ${f2(p.dA)} mm olabilir. Her şey P ile orantılı olduğu için tek bölme yeter. Sonra sayıları yerine koyup kontrol et.`,
      f: (p, r) => `${fmt(r.cA, 6)} · P = ${f2(p.dA)} → <b>P<sub>max</sub> = ${f2(r.Pk)} kN</b><br>Bu yükte: F<sub>BD</sub> = ${f2(r.FBD)} kN, F<sub>CE</sub> = ${f2(r.FCE)} kN; δ<sub>B</sub> = ${f4(r.dB)} mm ↓, δ<sub>C</sub> = ${f4(r.dC)} mm ↑<br>Kontrol: ${f4(r.dB)} + ${p.AB}·(${f4(r.dB)} + ${f4(r.dC)})/${p.BC} = ${f3(r.dB + p.AB * (r.dB + r.dC) / p.BC)} mm ✓<br>Gerilmeler: σ<sub>BD</sub> = ${f1(r.s1)} MPa, σ<sub>CE</sub> = ${f1(r.s2)} MPa`,
      why: 'Gerilmeleri neden kontrol ediyoruz? δ = FL/(AE) sadece malzeme akmadıysa geçerli. Bulunan gerilmeler pirinç ve alüminyumun akma sınırının çok altında, yani hesap tutarlı.' }
  ],
  scene(v, p, r) {
    const s = 0.01, xA = -p.AB * s, xC = p.BC * s, LB = p.LBD * s, LC = p.LCE * s, brass = '#c9a54e';
    const bar = v.add(shift(E3.box(xC - xA + 0.4, 0.28, 0.36), (xA + xC) / 2, 0, 0), { color: '#8a96a3' });
    const lBD = v.add(shift(E3.box(0.24, LB, 0.12), 0, -LB / 2, 0), { color: brass, pos: [0, LB, 0.26] });
    const lCE = v.add(shift(E3.box(0.24, LC, 0.12), 0, LC / 2, 0), { color: C.alu, pos: [xC, -LC, 0.26] });
    v.add(E3.box(1.0, 0.3, 0.8), { color: '#2a323c', pos: [0, LB + 0.27, 0.1], bias: 0.3 });
    v.add(E3.box(1.0, 0.3, 0.8), { color: '#2a323c', pos: [xC, -LC - 0.27, 0.1], bias: 0.3 });
    const pin = E3.cyl(0.07, 0.6, 14, 'z'), pc = '#d7dde3';
    const pA = v.add(pin, { color: pc }), pB = v.add(pin, { color: pc }), pC = v.add(pin, { color: pc });
    v.add(pin, { color: pc, pos: [0, LB, 0.1] }); v.add(pin, { color: pc, pos: [xC, -LC, 0.1] });
    const def = { dim: 0, lab: 1, load: 1, def: 0, ghost: 0, fbd: 0, mC: 0, mB: 0, dl: 0, dir: 0, geo: 0, fin: 0, links: 1 };
    return {
      def, apply(S, time, v) {
        const k = S.ex * S.def, dAv = 0.9 * k, dBv = dAv * r.cB / r.cA, dCv = dAv * r.cC / r.cA;
        const ang = Math.asin(Math.min(0.9, (dBv + dCv) / xC)), ca = Math.cos(ang), sa = Math.sin(ang);
        const yB = -dBv, yC = xC * sa - dBv, yA = xA * sa - dBv, xAd = xA * ca, xCd = xC * ca;
        bar.pos = [0, yB, 0]; bar.rot = [0, 0, ang];
        pA.pos = [xAd, yA, 0.1]; pB.pos = [0, yB, 0.1]; pC.pos = [xCd, yC, 0.1];
        lBD.scl = [1, (LB - yB) / LB, 1]; lCE.scl = [1, (LC + yC) / LC, 1];
        lBD.alpha = lCE.alpha = S.links;
        lBD.color = mixHex(brass, C.tens, S.dl * 0.8); lCE.color = mixHex(C.alu, C.tens, S.dl * 0.8);
        const O = v.ov, z = 0.35;
        O.push({ k: 'arrow', a: [xAd, yA - 0.2, z], b: [xAd, yA - 1.45, z], color: C.red, w: 3, label: S.fin > 0.5 ? `P = ${f2(r.Pk)} kN` : 'P', lp: S.fin > 0.5 ? [xAd + 0.95, yA - 1.15, z] : [xAd - 0.35, yA - 1.05, z], alpha: S.load });
        O.push({ k: 'hatch', a: [-0.5, LB + 0.42, 0.1], b: [0.5, LB + 0.42, 0.1], n: [0.2, 0.25, 0], color: C.mute });
        O.push({ k: 'hatch', a: [xC - 0.5, -LC - 0.42, 0.1], b: [xC + 0.5, -LC - 0.42, 0.1], n: [-0.2, -0.25, 0], color: C.mute });
        if (S.lab > 0.01) [['A', xAd - 0.1, yA + 0.42], ['B', -0.32, yB - 0.38], ['C', xCd + 0.38, yC + 0.32], ['D', 0.45, LB], ['E', xC + 0.42, -LC]].forEach(([t, x, y]) => O.push({ k: 'text', t, p: [x, y, z], size: 16, alpha: S.lab }));
        // ölçüler (şekildeki gibi)
        O.push({ k: 'dim', a: [xA, -0.2, 0], b: [0, -0.2, 0], off: [0, -2.3, 0], t: `${p.AB} mm`, alpha: S.dim });
        O.push({ k: 'dim', a: [0, -0.2, 0], b: [xC, -0.2, 0], off: [0, -2.3, 0], t: `${p.BC} mm`, alpha: S.dim });
        O.push({ k: 'dim', a: [xC + 0.2, 0, 0], b: [xC + 0.2, LB, 0], off: [0.55, 0, 0], t: `${p.LBD} mm`, tdx: 34, tdy: 0, alpha: S.dim });
        O.push({ k: 'dim', a: [xC + 0.2, 0, 0], b: [xC + 0.2, -LC, 0], off: [0.55, 0, 0], t: `${p.LCE} mm`, tdx: 34, tdy: 0, alpha: S.dim });
        if (S.dim > 0.01) {
          O.push({ k: 'text', t: 'BD pirinç\n280 mm²', p: [-0.85, LB * 0.62, 0], size: 13, color: C.dim, box: 1, alpha: S.dim });
          O.push({ k: 'text', t: `CE alüminyum\n${p.A2} mm²`, p: [xC - 0.95, -LC * 0.55, 0], size: 13, color: C.dim, box: 1, alpha: S.dim });
        }
        if (S.ghost > 0.01) O.push({ k: 'line', p: [[xA - 0.25, 0, z], [xC + 0.25, 0, z]], color: C.white, dash: [6, 5], w: 1.2, alpha: S.ghost * 0.8 });
        if (S.fbd > 0.01) {
          O.push({ k: 'arrow', a: [0, yB + 0.2, z], b: [0, yB + 1.5, z], color: C.white, w: 2.6, label: S.mB > 0.5 ? 'F_BD (düşer)' : 'F_BD', lp: [0, yB + 1.85, z], alpha: S.fbd * (1 - 0.6 * S.mB) });
          O.push({ k: 'arrow', a: [xCd, yC - 0.2, z], b: [xCd, yC - 1.3, z], color: C.white, w: 2.6, label: S.mC > 0.5 ? 'F_CE (düşer)' : 'F_CE', lp: [xCd - 0.6, yC - 0.95, z], alpha: S.fbd * (1 - 0.6 * S.mC) });
        }
        if (S.mC > 0.01) {
          O.push({ k: 'ring', c: [xC, 0, z], r: 0.4, color: C.red, w: 2.5, alpha: S.mC });
          O.push({ k: 'dim', a: [xA, 0, 0], b: [xC, 0, 0], off: [0, 1.0, 0], t: `P'nin kolu ${r.AC} mm`, alpha: S.mC });
          O.push({ k: 'dim', a: [0, 0, 0], b: [xC, 0, 0], off: [0, 0.55, 0], t: `F_BD kolu ${p.BC}`, alpha: S.mC });
        }
        if (S.mB > 0.01) {
          O.push({ k: 'ring', c: [0, 0, z], r: 0.4, color: C.red, w: 2.5, alpha: S.mB });
          O.push({ k: 'dim', a: [xA, 0, 0], b: [0, 0, 0], off: [0, 0.7, 0], t: `${p.AB}`, alpha: S.mB });
          O.push({ k: 'dim', a: [0, 0, 0], b: [xC, 0, 0], off: [0, 0.7, 0], t: `F_CE kolu ${p.BC}`, alpha: S.mB });
        }
        if (S.dl > 0.01) {
          O.push({ k: 'text', t: `F_BD = ${f4(r.kB)}·P\nδ_BD = ${fmt(r.cB, 5)}·P mm`, p: [-1.25, LB * 0.62, z], color: C.white, size: 14, box: 1, alpha: S.dl });
          O.push({ k: 'text', t: `F_CE = ${f4(r.kC)}·P\nδ_CE = ${fmt(r.cC, 5)}·P mm`, p: [xC - 1.3, -LC * 0.6, z], color: C.white, size: 14, box: 1, alpha: S.dl });
        }
        if (S.dir > 0.01) {
          O.push({ k: 'arrow', a: [0.45, 0.55, z], b: [0.45, -0.25, z], color: C.tens, w: 2.4, hs: 9, alpha: S.dir });
          O.push({ k: 'text', t: 'B iner\n(D sabit, BD uzar)', p: [1.15, 0.85, z], color: C.white, size: 13, box: 1, alpha: S.dir });
          O.push({ k: 'arrow', a: [xC - 0.45, -0.75, z], b: [xC - 0.45, 0.05, z], color: C.tens, w: 2.4, hs: 9, alpha: S.dir });
          O.push({ k: 'text', t: 'C kalkar\n(E sabit, CE uzar)', p: [xC - 1.35, -1.0, z], color: C.white, size: 13, box: 1, alpha: S.dir });
        }
        if (S.geo > 0.01) {
          const xO = r.x0 * s;
          O.push({ k: 'dim', a: [0, 0, z], b: [0, yB, z], off: [0.35, 0, 0], t: `δB ${fmt(r.cB, 5)}P ↓`, tdx: 52, tdy: 6, alpha: S.geo * (1 - S.fin) });
          O.push({ k: 'dim', a: [xC, 0, z], b: [xCd, yC, z], off: [0.4, 0, 0], t: `δC ${fmt(r.cC, 5)}P ↑`, tdx: 52, tdy: -4, alpha: S.geo * (1 - S.fin) });
          O.push({ k: 'arrow', a: [xA - 0.3, 0.02, z], b: [xA - 0.3, yA, z], color: C.red, w: 2.2, hs: 8, alpha: S.geo });
          O.push({ k: 'text', t: S.fin > 0.5 ? `δA = ${f2(p.dA)} mm (sınır)` : `δA = ${fmt(r.cA, 5)}·P mm`, p: [xA - 0.1, 0.55, z], color: C.red, size: 15, box: 1, alpha: S.geo });
          O.push({ k: 'ring', c: [xO, 0, z], r: 0.08, color: C.white, w: 2, alpha: S.geo });
          O.push({ k: 'text', t: 'O (iniş 0)', p: [xO, 0.38, z], color: C.white, size: 13, alpha: S.geo });
        }
        if (S.fin > 0.01) {
          O.push({ k: 'text', t: `P_max = ${f2(r.Pk)} kN\nδB = ${f4(r.dB)} mm ↓   δC = ${f4(r.dC)} mm ↑`, p: [xC + 0.75, LB * 0.72, z], color: C.white, size: 15, box: 1, alpha: S.fin });
        }
      }
    };
  },
  whatif: {
    not: 'Alanları, A\'nın konumunu ve sınırı değiştir. BD alanını kitaptaki 240 mm²\'ye çekersen P<sub>max</sub> ≈ 14,7 kN olur. A, B\'den uzaklaştıkça hem F<sub>BD</sub> büyür hem kaldıraç uzar: P<sub>max</sub> hızla düşer.',
    s: [{ k: 'A1', ad: 'BD alanı', min: 100, max: 500, step: 10, u: 'mm²' }, { k: 'A2', ad: 'CE alanı', min: 100, max: 500, step: 10, u: 'mm²' }, { k: 'AB', ad: 'A–B uzaklığı', min: 25, max: 300, step: 25, u: 'mm' }, { k: 'dA', ad: 'δ_A sınırı', min: 0.1, max: 1, step: 0.05, u: 'mm' }],
    out: (q, r0) => {
      const r = VIZE.find(x => x.id === 'v12').solve(q);
      return `<div class="mets"><div class="m"><small>F_BD / P</small><b>${f3(r.kB)}</b></div><div class="m"><small>F_CE / P</small><b>${f3(r.kC)}</b></div><div class="m"><small>δ_B (P_max)</small><b>${f4(r.dB)} mm ↓</b></div><div class="m"><small>δ_C (P_max)</small><b>${f4(r.dC)} mm ↑</b></div><div class="m red"><small>P_max</small><b>${f2(r.Pk)} kN</b></div></div>
      <p class="note">δ<sub>A</sub> = ${fmt(r.cA, 5)}·P mm. Bunun ${f1(100 * r.cB / r.cA)} %'i B'nin inişinden, kalanı kirişin dönmesinden geliyor. CE alanını büyütmek C'nin kalkmasını azaltır ama etkisi küçüktür; asıl belirleyici BD.</p>`;
    }
  },
  kagit: (p, r) => `SCD (rijit ABC), F_BD ve F_CE çekme varsayıldı:
ΣM_C = 0:  F_BD·${p.BC} − P·${r.AC} = 0   →  F_BD = ${f4(r.kB)}·P
ΣM_B = 0:  F_CE·${p.BC} − P·${p.AB} = 0   →  F_CE = ${f4(r.kC)}·P
(P kN, F N için ×1000)
δ_BD = F·L/(AE) = ${f4(r.kB)}·1000·P·${p.LBD}/(${p.A1}·${fmt(p.E1 * 1000, 0)}) = ${fmt(r.cB, 6)}·P mm  → B iner
δ_CE = ${f4(r.kC)}·1000·P·${p.LCE}/(${p.A2}·${fmt(p.E2 * 1000, 0)}) = ${fmt(r.cC, 6)}·P mm  → C kalkar
θ = (δ_B + δ_C)/BC = (${fmt(r.cB, 6)} + ${fmt(r.cC, 6)})·P/${p.BC}
δ_A = δ_B + AB·θ = ${fmt(r.cB, 6)}·P + ${p.AB}·θ = ${fmt(r.cA, 6)}·P mm
δ_A = ${f2(p.dA)} mm  →  P_max = ${f2(p.dA)}/${fmt(r.cA, 6)} = ${f2(r.Pk)} kN`,
  tuzak: ['<b>δ<sub>A</sub>\'yı δ<sub>B</sub> sanmak.</b> A, B\'nin dışında; kiriş döndüğü için A, B\'den daha çok iner. Sadece δ<sub>B</sub> ile P ≈ 29,4 kN çıkar, çok büyük.',
    '<b>C\'yi aşağı indirmek.</b> CE çekmede ve uzuyor ama sabit ucu (E) aşağıda: C <b>yukarı</b> kalkar. δ<sub>C</sub>\'yi aşağı alırsan θ küçülür, P ≈ 21,4 kN gibi yanlış çıkar.',
    '<b>C\'ye göre momentte P\'nin kolunu 125 almak.</b> C\'ye uzaklık AC = 125 + 225 = 350 mm.',
    '<b>İki kola aynı A·E koymak.</b> Pirinç 105 GPa ve 280 mm²; alüminyum 72 GPa ve 300 mm². Her kol kendi değeriyle.',
    '<b>Birim.</b> GPa × 1000 = N/mm². P\'yi kN tutuyorsan kuvveti 1000 ile çarpıp N yap; δ mm çıkar.',
    '<b>Kesik veri.</b> Bu kâğıtta CE\'nin alanı fotoğrafta okunmuyor; sınavda böyle bir şey olursa soruyu hocaya sor, sayı uydurma.'],
  gen() {
    return { AB: rnd(75, 250, 25), BC: rnd(150, 350, 25), LBD: rnd(150, 400, 25), LCE: rnd(100, 300, 25),
      A1: rnd(150, 400, 10), E1: pick([70, 72, 105, 200]), A2: rnd(150, 400, 10), E2: pick([70, 72, 105, 200]), dA: rnd(0.2, 0.5, 0.05) };
  },
  pracText: p => `Rijit ABC kirişi yatay. A, B'nin ${p.AB} mm solunda; C, B'nin ${p.BC} mm sağında. BD kolu B'den yukarı tavana gider: L = ${p.LBD} mm, A = ${p.A1} mm², E = ${p.E1} GPa. CE kolu C'den aşağı yere iner: L = ${p.LCE} mm, A = ${p.A2} mm², E = ${p.E2} GPa. A'ya düşey aşağı P uygulanıyor ve A'nın inişi ${f2(p.dA)} mm'yi geçmemeli. P_max'ı ve bu yükte F_BD, δ_B, δ_C'yi bul.`,
  ans: [{ k: 'Pk', ad: 'P_max', u: 'kN' }, { k: 'FBD', ad: 'F_BD (P_max\'ta)', u: 'kN' }, { k: 'dB', ad: 'δ_B (iniş)', u: 'mm', abs: true }, { k: 'dC', ad: 'δ_C (kalkış)', u: 'mm', abs: true }],
  hints: (p, r) => [`C'ye göre moment: F_BD · ${p.BC} = P · ${r.AC}; B'ye göre: F_CE · ${p.BC} = P · ${p.AB}.`,
    `δ = F·L/(A·E), her kol kendi A ve E'siyle. F = (sayı)·P olduğu için δ da (sayı)·P.`,
    `B iner, C kalkar. θ = (δB + δC)/${p.BC}; δA = δB + ${p.AB}·θ. Sonra δA = ${f2(p.dA)}.`],
  diag(p, r, u) {
    const near = (a, b) => isFinite(a) && Math.abs(a - b) <= Math.abs(b) * 0.02;
    if (near(u.Pk, r.wOnlyB)) return 'δA yerine δB kullanmışsın. A, B\'nin dışında; kiriş dönünce A daha çok iner: δA = δB + AB·θ.';
    if (near(u.Pk, r.wSign)) return 'C\'yi aşağı indirmişsin. CE uzuyor ama alt ucu E sabit: C yukarı kalkar. θ = (δB + δC)/BC.';
    if (near(u.Pk, r.wFixC)) return 'C\'yi sabit saymışsın. CE de uzuyor; C\'nin kalkışını da dönmeye ekle.';
    if (near(u.Pk, r.Pk * 1000) || near(u.Pk, r.Pk / 1000) || near(u.dB, r.dB * 1000) || near(u.dB, r.dB / 1000)) return 'Birim kaymış: E\'yi N/mm² (GPa × 1000), kuvveti N olarak yaz; sonucu kN\'a çevir.';
    if (near(u.FBD, r.kC * r.Pk) || near(u.FBD, r.Pk * p.AB / r.AC)) return 'Moment kolları karışmış: C\'ye göre momentte P\'nin kolu AC = AB + BC.';
    if (isFinite(u.dB) || isFinite(u.dC)) return 'δB ve δC, P_max bulunduktan sonra hesaplanır: δB = (δB/P)·P_max. Önce P_max\'ı kontrol et.';
    return 'Sıra: iki moment → iki δ (P cinsinden) → θ ve δA → δA = sınır.';
  },
  hoca: `<p><b>Bu kâğıdın cevap anahtarı PDF'te yok.</b> Aşağıdaki sonuç bizim çözümümüz.</p>
  <p><b>Veri notu:</b> Fotoğrafın sağ kenarı kesik. BD alanı kâğıtta açıkça <b>280 mm²</b> yazıyor. CE alanı okunmuyor; fotoğrafta kesik, kitaptaki (Beer &amp; Johnston) <b>300 mm²</b> alındı.</p>
  <p><b>Sonuç (280 / 300 mm²):</b> F<sub>BD</sub> = 1,556·P, F<sub>CE</sub> = 0,556·P (ikisi de çekme); δ<sub>A</sub> = 0,02066·P mm → <b>P<sub>max</sub> ≈ 16,94 kN</b>. Bu yükte δ<sub>B</sub> = 0,2017 mm ↓, δ<sub>C</sub> = 0,0654 mm ↑.</p>
  <p><b>Kitaptaki sayılarla (240 / 300 mm²)</b> aynı yol δ<sub>A</sub> = 0,02375·P mm ve <b>P<sub>max</sub> ≈ 14,74 kN</b> verir. Sınavda kâğıttaki sayıyı kullan; hoca alanı bilerek 280 yapmış olabilir.</p>`
});
