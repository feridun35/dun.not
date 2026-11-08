'use strict';
/* ============ PROBLEM 4 ============ */
PROBS.push({
  id: 'p4', no: 4, tip: 'rk',
  ad: 'İki kola asılı rijit kiriş',
  ozet: 'Kollar uzar, rijit kiriş biraz iner ve döner. Önce kuvvet, sonra uzama, sonra geometri.',
  soru: 'AB ve CD bağlantı kollarının her biri alüminyumdan (E = 75 GPa) yapılmıştır ve 125 mm²\'lik kesit alanına sahiptir. Bu kollar rijit BC elemanını taşıdıklarına göre, E noktasının yer değiştirmesini bulunuz.',
  verilen: ['Kollar AB, CD: E = 75 GPa, A = 125 mm², L = 360 mm', 'BC rijit: BE = 200 mm, EC = 440 mm', 'E noktasında P = 5 kN (aşağı)'],
  istenen: 'E noktasının düşey yer değiştirmesi δ<sub>E</sub>',
  p0: { P: 5, BE: 200, EC: 440, L: 360, A: 125, E: 75 },
  solve(p) {
    const BC = p.BE + p.EC, FAB = p.P * p.EC / BC, FCD = p.P * p.BE / BC, EA = p.A * p.E * 1000;
    const dAB = FAB * 1000 * p.L / EA, dCD = FCD * 1000 * p.L / EA, dE = dAB - (dAB - dCD) * p.BE / BC;
    return { BC, FAB, FCD, EA, dAB, dCD, dE, dEavg: (dAB + dCD) / 2 };
  },
  anlam: [
    ['rijit BC elemanı', 'BC <b>eğilmez, uzamaz</b>. Sadece aşağı iner ve biraz döner. Üzerindeki noktalar bir doğru üzerinde kalır.'],
    ['bağlantı kolları alüminyum, E, A verilmiş', 'Kollar <b>uzar</b>: δ = F·L / (A·E). E ve A bunun için verilmiş.'],
    ['E noktasının yer değiştirmesi', 'Yük, B ve C\'nin inişine bölünür; E ikisinin arasında, <b>doğrusal</b> orantıyla bulunur.'],
    ['5 kN E\'de', 'Önce kol kuvvetlerini moment ile buluyoruz.']
  ],
  tetik: ['rijit', 'yer değiştirme / çökme', 'kollar, E ve A verilmiş', 'nokta soruluyor'],
  tetikNot: '"Rijit" kelimesi = benzer üçgen. "E, A verilmiş" = δ = FL/(AE). Sorunun kalıbı: denge → uzama → geometri.',
  zincir: [["Ne isteniyor?", "Bir noktanın inişi: bu bir <b>geometri</b> sorusu."], ["İniş neye bağlı?", "Rijit kiriş düz kalır: B ve C'nin inişi belli olursa E aradan bulunur."], ["B ve C ne kadar iner?", "Kollar kadar uzar: δ = FL/(AE). Bunun için kol kuvvetleri lazım."], ["Kol kuvvetleri?", "Kirişi ayır, B ve C'ye göre moment."]],
  cam: { yaw: 0, pitch: 0.12, dist: 14, t: [3.2, 1.6, 0] },
  steps: [
    { t: 'Şekle bak', st: { dim: 1, lab: 1, load: 1 },
      h: () => 'Tavandan iki kol (AB ve CD) iniyor. Altlarına rijit bir BC kirişi asılı. Yük E\'de, B\'ye daha yakın.' },
    { t: 'Rijit ne demek?', st: { def: 1, lab: 1, load: 1, ghost: 1 },
      h: () => 'Kollar uzar, BC uzamaz. B, AB kadar; C, CD kadar iner. BC düz kalır, sadece döner: B daha çok, C daha az iner (iniş abartılı gösteriliyor). Kesikli çizgi: başlangıç konumu.',
      why: 'Bu yüzden E\'nin inişi, B ve C\'nin inişlerinin arasında bir değer olmak zorunda. İkisi farklıysa kiriş döner.' },
    { t: 'SCD: kirişi ayır', st: { fbd: 1, lab: 1, load: 1, links: 0.15 },
      h: () => 'BC\'nin üstünde üç kuvvet: B\'de F<sub>AB</sub> (yukarı), C\'de F<sub>CD</sub> (yukarı), E\'de 5 kN (aşağı). Kollar kirişi yukarı çekiyor, yani kollar çekmede.' },
    { t: 'C\'ye göre moment → F_AB', st: { fbd: 1, mC: 1, lab: 1, load: 1, links: 0.15 },
      h: () => 'Momenti C noktasında alıyoruz. F<sub>CD</sub> C\'den geçtiği için momenti yok, denklemden düşer. F<sub>AB</sub> kirişi bir yöne, 5 kN ters yöne döndürmek ister; ikisi eşit olmalı.',
      f: (p, r) => `F<sub>AB</sub> · ${r.BC} = ${f2(p.P)} · ${p.EC} → <b>F<sub>AB</sub> = ${f4(r.FAB)} kN</b>` },
    { t: 'B\'ye göre moment → F_CD', st: { fbd: 1, mB: 1, lab: 1, load: 1, links: 0.15 },
      h: () => 'Momenti B noktasında alıyoruz. F<sub>AB</sub> B\'den geçtiği için denklemden düşer. Kontrol: iki kuvvetin toplamı yüke eşit olmalı.',
      f: (p, r) => `F<sub>CD</sub> · ${r.BC} = ${f2(p.P)} · ${p.BE} → <b>F<sub>CD</sub> = ${f4(r.FCD)} kN</b><br>Kontrol: ${f4(r.FAB)} + ${f4(r.FCD)} = ${f2(r.FAB + r.FCD)} ✓` },
    { t: 'Kollar ne kadar uzar? δ = FL/(AE)', st: { def: 1, lab: 1, load: 1, dl: 1 },
      h: (p, r) => `İki kolda L, A, E aynı: paydayı bir kez hesapla. A·E = ${p.A} mm² · ${p.E}·10³ N/mm² = ${sci(r.EA)} N.`,
      f: (p, r) => `δ<sub>AB</sub> = ${fmt(r.FAB * 1000, 1)} · ${p.L} / ${sci(r.EA)} = <b>${f4(r.dAB)} mm</b><br>δ<sub>CD</sub> = ${fmt(r.FCD * 1000, 1)} · ${p.L} / ${sci(r.EA)} = <b>${f4(r.dCD)} mm</b>`,
      why: 'δ = FL/(AE): uzun ve çok yüklü parça çok uzar; kalın (A) ve sert (E) parça az uzar. Kesirdeki yerleri böyle hatırla.' },
    { t: 'Geometri: E\'nin inişi', st: { def: 1, lab: 1, load: 1, geo: 1, ghost: 1 },
      h: (p, r) => `B, ${f4(r.dAB)} mm; C, ${f4(r.dCD)} mm iniyor. Fark ${f4(r.dAB - r.dCD)} mm, ${r.BC} mm boyunca doğrusal azalıyor. E, B'den ${p.BE} mm uzakta.`,
      f: (p, r) => `δ<sub>E</sub> = δ<sub>B</sub> − (δ<sub>B</sub> − δ<sub>C</sub>) · BE/BC = ${f4(r.dAB)} − ${f4(r.dAB - r.dCD)} · ${p.BE}/${r.BC} = <b>${f4(r.dE)} mm ↓</b>`,
      why: 'Benzer üçgen: C\'nin seviyesinden yatay bir çizgi çiz. Kiriş bu çizgiden C\'de 0, B\'de (δB − δC) kadar aşağıdadır, arası doğrusaldır. Pratik yol: B\'nin inişinden başla, farkın BE/BC kadarını çıkar. Aynı sonucu δC + (δB − δC)·EC/BC de verir.' }
  ],
  scene(v, p, r) {
    const s = 0.01, xC = r.BC * s, xE = p.BE * s, Lk = p.L * s;
    const bar = v.add(E3.box(xC + 0.7, 0.35, 0.45), { color: '#8a96a3', pos: [xC / 2, 0, 0], piv: [-xC / 2, 0, 0] });
    const lk = shift(E3.box(0.26, Lk + 0.3, 0.16), 0, -Lk / 2, 0);
    const lA = v.add(lk, { color: C.alu, pos: [0, Lk, 0] }), lD = v.add(lk, { color: C.alu, pos: [xC, Lk, 0] });
    [0, xC].forEach(x => v.add(E3.box(1.1, 0.35, 0.9), { color: '#2a323c', pos: [x, Lk + 0.32, 0], bias: 0.3 }));
    const pin = E3.cyl(0.07, 0.5, 14, 'z');
    const pBo = v.add(pin, { color: '#d7dde3', pos: [0, 0, 0] }), pCo = v.add(pin, { color: '#d7dde3', pos: [xC, 0, 0] });
    v.add(pin, { color: '#d7dde3', pos: [0, Lk, 0] }); v.add(pin, { color: '#d7dde3', pos: [xC, Lk, 0] });
    const def = { dim: 0, lab: 1, load: 1, def: 0, ghost: 0, fbd: 0, mC: 0, mB: 0, dl: 0, geo: 0, links: 1 };
    return {
      def, apply(S, time, v) {
        const k = 0.75 * S.ex * S.def, dB = k, dC = k * r.dCD / r.dAB, yE = -(dB + (dC - dB) * xE / xC);
        bar.pos = [xC / 2, -dB, 0]; bar.rot = [0, 0, Math.atan2(-(dC - dB), xC)];
        pBo.pos = [0, -dB, 0]; pCo.pos = [xC, -dC, 0];
        lA.scl = [1, (Lk + dB) / Lk, 1]; lD.scl = [1, (Lk + dC) / Lk, 1]; lA.alpha = lD.alpha = S.links;
        lA.color = lD.color = mixHex(C.alu, C.tens, S.dl * 0.8);
        const O = v.ov;
        O.push({ k: 'arrow', a: [xE, yE + 2.2, 0], b: [xE, yE + 0.25, 0], color: C.red, w: 3, label: `${f2(p.P)} kN`, lp: [xE + 0.7, yE + 1.7, 0], alpha: S.load });
        [0, xC].forEach(x => O.push({ k: 'hatch', a: [x - 0.55, Lk + 0.5, 0], b: [x + 0.55, Lk + 0.5, 0], n: [0.2, 0.25, 0], color: C.mute }));
        if (S.lab > 0.01) [['A', -0.4, Lk], ['D', xC + 0.4, Lk], ['B', -0.35, -dB - 0.35], ['C', xC + 0.35, -dC - 0.35], ['E', xE, yE - 0.5]].forEach(([t, x, y]) => O.push({ k: 'text', t, p: [x, y, 0], size: 16, alpha: S.lab }));
        O.push({ k: 'dim', a: [0, -0.3, 0], b: [xE, -0.3, 0], off: [0, -0.8, 0], t: `${p.BE} mm`, alpha: S.dim });
        O.push({ k: 'dim', a: [xE, -0.3, 0], b: [xC, -0.3, 0], off: [0, -0.8, 0], t: `${p.EC} mm`, alpha: S.dim });
        O.push({ k: 'dim', a: [-0.2, 0, 0], b: [-0.2, Lk, 0], off: [-0.8, 0, 0], t: `${p.L} mm`, tdx: -26, tdy: 0, alpha: S.dim });
        if (S.ghost > 0.01) O.push({ k: 'line', p: [[-0.35, 0, 0], [xC + 0.35, 0, 0]], color: C.white, dash: [6, 5], w: 1.2, alpha: S.ghost * 0.8 });
        if (S.fbd > 0.01) {
          O.push({ k: 'arrow', a: [0, -dB - 0.2, 0.3], b: [0, -dB + 1.8, 0.3], color: C.white, w: 2.6, label: S.mB > 0.5 ? 'F_AB (düşer)' : 'F_AB', lp: [0, -dB + 2.2, 0.3], alpha: S.fbd * (1 - 0.6 * S.mB) });
          O.push({ k: 'arrow', a: [xC, -dC - 0.2, 0.3], b: [xC, -dC + 1.8, 0.3], color: C.white, w: 2.6, label: S.mC > 0.5 ? 'F_CD (düşer)' : 'F_CD', lp: [xC, -dC + 2.2, 0.3], alpha: S.fbd * (1 - 0.6 * S.mC) });
        }
        if (S.mC > 0.01) { O.push({ k: 'ring', c: [xC, 0, 0.3], r: 0.4, color: C.red, w: 2.5, alpha: S.mC }); O.push({ k: 'dim', a: [0, 0, 0], b: [xC, 0, 0], off: [0, -1.4, 0], t: `moment kolu ${r.BC} mm`, alpha: S.mC }); O.push({ k: 'dim', a: [xE, 0, 0], b: [xC, 0, 0], off: [0, -0.9, 0], t: `moment kolu ${p.EC}`, alpha: S.mC }); }
        if (S.mB > 0.01) { O.push({ k: 'ring', c: [0, 0, 0.3], r: 0.4, color: C.red, w: 2.5, alpha: S.mB }); O.push({ k: 'dim', a: [0, 0, 0], b: [xC, 0, 0], off: [0, -1.4, 0], t: `moment kolu ${r.BC} mm`, alpha: S.mB }); O.push({ k: 'dim', a: [0, 0, 0], b: [xE, 0, 0], off: [0, -0.9, 0], t: `moment kolu ${p.BE}`, alpha: S.mB }); }
        if (S.dl > 0.01) {
          O.push({ k: 'text', t: `F_AB = ${f4(r.FAB)} kN\nδ_AB = ${f4(r.dAB)} mm`, p: [-1.3, Lk / 2, 0], color: C.white, size: 14, box: 1, align: 'center', alpha: S.dl });
          O.push({ k: 'text', t: `F_CD = ${f4(r.FCD)} kN\nδ_CD = ${f4(r.dCD)} mm`, p: [xC + 1.4, Lk / 2, 0], color: C.white, size: 14, box: 1, alpha: S.dl });
        }
        if (S.geo > 0.01) {
          O.push({ k: 'line', p: [[0, -dC, 0], [xC, -dC, 0]], color: C.mute, dash: [4, 4], w: 1, alpha: S.geo });
          O.push({ k: 'dim', a: [0, 0, 0], b: [0, -dB, 0], off: [-0.5, 0, 0], t: `δB ${f4(r.dAB)}`, tdx: -40, tdy: 0, alpha: S.geo });
          O.push({ k: 'dim', a: [xC, 0, 0], b: [xC, -dC, 0], off: [0.5, 0, 0], t: `δC ${f4(r.dCD)}`, tdx: 40, tdy: 0, alpha: S.geo });
          O.push({ k: 'arrow', a: [xE, 0.02, 0.35], b: [xE, yE, 0.35], color: C.red, w: 2, hs: 7, alpha: S.geo });
          O.push({ k: 'text', t: `δE = ${f4(r.dE)} mm`, p: [xE + 0.2, yE - 1.1, 0.35], color: C.red, size: 16, box: 1, alpha: S.geo });
        }
      }
    };
  },
  whatif: {
    not: 'Yükü (E noktasını) kaydır: B\'ye yaklaştıkça AB kolu daha çok yüklenir, kiriş daha çok döner. Tam ortada iki kol eşit uzar.',
    s: [{ k: 'BE', ad: 'B–E uzaklığı', min: 0, max: 640, step: 10, u: 'mm' }, { k: 'P', ad: 'Yük P', min: 1, max: 20, step: 0.5, u: 'kN' }, { k: 'A', ad: 'Kol alanı A', min: 40, max: 400, step: 5, u: 'mm²' }, { k: 'E', ad: 'Kol E', min: 40, max: 210, step: 5, u: 'GPa' }],
    out: (p0, r0) => {
      const p = Object.assign({}, p0, { EC: 640 - p0.BE }), r = PROBS.find(q => q.id === 'p4').solve(p);
      return `<div class="mets"><div class="m"><small>F_AB</small><b>${f3(r.FAB)} kN</b></div><div class="m"><small>F_CD</small><b>${f3(r.FCD)} kN</b></div><div class="m"><small>δ_B</small><b>${f4(r.dAB)} mm</b></div><div class="m"><small>δ_C</small><b>${f4(r.dCD)} mm</b></div><div class="m red"><small>δ_E</small><b>${f4(r.dE)} mm</b></div></div>
      <p class="note">BC = 640 mm sabit tutuldu (EC = ${640 - p.BE} mm). Alan ya da E iki katına çıkınca bütün inişler yarıya iner: δ ∝ 1/(AE).</p>`;
    }
  },
  kagit: (p, r) => `SCD (rijit BC):
ΣM_C = 0:  F_AB·${r.BC} − ${f2(p.P)}·${p.EC} = 0   →  F_AB = ${f4(r.FAB)} kN
ΣM_B = 0:  F_CD·${r.BC} − ${f2(p.P)}·${p.BE} = 0   →  F_CD = ${f4(r.FCD)} kN
AE = ${p.A}·${p.E}·10³ = ${fmt(r.EA, 0)} N
δ_AB = F·L/(AE) = ${fmt(r.FAB * 1000, 1)}·${p.L}/${fmt(r.EA, 0)} = ${f4(r.dAB)} mm
δ_CD = ${fmt(r.FCD * 1000, 1)}·${p.L}/${fmt(r.EA, 0)} = ${f4(r.dCD)} mm
δ_E = δ_B − (δ_B − δ_C)·BE/BC = ${f4(r.dAB)} − ${f4(r.dAB - r.dCD)}·${p.BE}/${r.BC} = ${f4(r.dE)} mm ↓`,
  tuzak: ['<b>δE\'yi ortalama almak.</b> (δB + δC)/2 sadece E tam ortadaysa doğru. Burada ' + '0,096 mm çıkar, yanlış.',
    '<b>Moment kollarını ters yazmak.</b> C\'ye göre momentte P\'nin kolu EC, B\'ninki BC.',
    '<b>GPa ile N/mm².</b> 75 GPa = 75 000 N/mm². A mm², L mm, F N ise δ mm çıkar.',
    '<b>Yer değiştirmeyi kuvvetle orantılamak.</b> E, B\'den BE uzakta: oran BE/BC, kuvvetlerin oranı değil.'],
  gen() { const BC = rnd(400, 1000, 20), BE = rnd(Math.round(BC * 0.15 / 10) * 10, Math.round(BC * 0.85 / 10) * 10, 10); return { P: rnd(2, 20, 0.5), BE, EC: BC - BE, L: rnd(200, 800, 20), A: rnd(60, 300, 5), E: pick([70, 75, 105, 200, 210]) }; },
  pracText: p => `Rijit BC kirişi iki eşit kola (AB ve CD) asılı. Kol boyu ${p.L} mm, kesit ${p.A} mm², E = ${p.E} GPa. E noktası B'den ${p.BE} mm, C'den ${p.EC} mm uzakta ve orada ${f2(p.P)} kN aşağı yük var. Kol kuvvetlerini ve E'nin inişini bul.`,
  ans: [{ k: 'FAB', ad: 'F_AB', u: 'kN' }, { k: 'FCD', ad: 'F_CD', u: 'kN' }, { k: 'dE', ad: 'δ_E', u: 'mm' }],
  hints: (p, r) => [`C'ye göre moment: F_AB · ${r.BC} = ${f2(p.P)} · ${p.EC}.`, `δ = F·L/(A·E); A·E = ${p.A} · ${p.E}000 N.`, `δE = δB − (δB − δC) · ${p.BE}/${r.BC}.`],
  diag(p, r, u) {
    const near = (a, b) => isFinite(a) && Math.abs(a - b) <= Math.abs(b) * 0.02;
    if (near(u.dE, r.dEavg)) return 'Ortalama almışsın; E ortada değil. Benzer üçgen kullan.';
    if (near(u.dE, r.dCD + (r.dAB - r.dCD) * p.BE / r.BC)) return 'Oranı ters kurmuşsun: E, B\'ye yakınsa δE de δB\'ye yakın olmalı. δB\'den başla, farkın BE/BC kadarını çıkar.';
    if (near(u.FAB, r.FCD)) return 'F_AB ile F_CD yer değiştirmiş: yük hangi kola yakınsa o kol daha çok taşır.';
    if (near(u.dE, r.dE * 1000) || near(u.dE, r.dE / 1000)) return 'Birim kaymış: E\'yi N/mm² olarak (GPa × 1000) yaz.';
    return 'Sıra: iki moment → iki δ → doğrusal enterpolasyon.';
  }
});
