'use strict';
/* ============ PROBLEM 8 ============ */
PROBS.push({
  id: 'p8', no: 8, tip: 'rk',
  ad: 'Mafsallı rijit kiriş, çubuk ve yay',
  ozet: 'Kiriş A etrafında döner: her noktanın inişi A\'ya uzaklığıyla orantılı. Yayın çökmesi bilinince her şey geometriden.',
  soru: 'Verilen sistemde yay katsayısı 200 N/m ve yayın maksimum 0,5 mm çökmesine müsaade edildiğine göre BC çubuğunda meydana gelen gerilmeyi ve E noktasındaki çökmeyi hesaplayınız. (Not: AE çubuğu rijittir.) BC çubuğu için: S₀ = 400 mm², E = 70 GPa, l = 500 mm.',
  verilen: ['AE rijit, A\'da mafsal; AB = 1 m, AD = 3 m, AE = 5 m', 'BC çubuğu: S₀ = 400 mm², E = 70 GPa, l = 500 mm (B\'yi tavana bağlar)', 'D\'de yay: k = 200 N/m = 0,2 N/mm, en çok δ<sub>D</sub> = 0,5 mm', 'E\'de P = 5 kN'],
  istenen: 'σ<sub>BC</sub> ve δ<sub>E</sub>',
  p0: { P: 5, AB: 1, AD: 3, AE: 5, S0: 400, E: 70, l: 500, k: 0.2, dD: 0.5 },
  solve(p) {
    const dB = p.dD * p.AB / p.AD, dE = p.dD * p.AE / p.AD, eps = dB / p.l, sBC = p.E * 1000 * eps, FBC = sBC * p.S0, Fs = p.k * p.dD;
    const Preq = (FBC * p.AB + Fs * p.AD) / p.AE, kBC = p.E * 1000 * p.S0 / p.l;
    const th = p.P * 1000 * p.AE * 1000 / (kBC * Math.pow(p.AB * 1000, 2) + p.k * Math.pow(p.AD * 1000, 2));
    const dB2 = p.AB * 1000 * th, dD2 = p.AD * 1000 * th, dE2 = p.AE * 1000 * th, FBC2 = kBC * dB2, Fs2 = p.k * dD2;
    return { dB, dE, eps, sBC, FBC, Fs, Preq, kBC, th, dB2, dD2, dE2, FBC2, Fs2, sBC2: FBC2 / p.S0, RA2: p.P * 1000 - FBC2 - Fs2, ok2: dD2 <= p.dD };
  },
  anlam: [
    ['AE çubuğu rijittir, A\'da mafsal', 'Kiriş A etrafında küçük bir açı (θ) kadar <b>döner</b>. Her nokta A\'ya uzaklığıyla orantılı iner: δ = x·θ.'],
    ['yayın maksimum 0,5 mm çökmesine müsaade', 'δ<sub>D</sub> = 0,5 mm: dönmenin büyüklüğü bununla belli. <b>Gerisi geometri.</b>'],
    ['BC çubuğu S₀, E, l', 'B inince BC uzar: ε = δ<sub>B</sub>/l, σ = E·ε.'],
    ['yay katsayısı 200 N/m', 'Çok küçük bir yay (0,2 N/mm): yükün neredeyse tamamını BC taşır.'],
    ['P = 5 kN', 'Dikkat: 5 kN yayı 0,5 mm\'den fazla çökertiyor. Soru iki türlü okunabiliyor.']
  ],
  tetik: ['rijit + mafsal', 'çökme', 'yay', 'izin verilen çökme'],
  tetikNot: '"Rijit" + "mafsal" = döner, benzer üçgen. Bir noktanın inişi verilmişse (burada yay), diğer bütün inişler oranla bulunur. Kuvvet hesabına bile gerek kalmayabilir.',
  zincir: [["Kiriş ne yapıyor?", "A mafsalı etrafında küçük bir açıyla dönüyor: iniş = uzaklık × açı."], ["Neyi biliyorum?", "Yayın çökmesi 0,5 mm (D noktası). Gerisi oranla."], ["σ_BC nasıl?", "B'nin inişi = BC'nin uzaması → ε = δ/l → σ = E·ε."], ["5 kN ne olacak?", "Verilerle çelişiyor. Hangi kabulle çözdüğünü bir satırla yaz."]],
  cam: { yaw: -0.25, pitch: 0.16, dist: 15, t: [4, 0.4, 0] },
  steps: [
    { t: 'Şekle bak', st: { dim: 1, lab: 1, load: 1 },
      h: () => 'Sol duvarda A mafsalı. Yatay rijit kiriş A\'dan E\'ye. B\'den tavana BC çubuğu çıkıyor, D\'nin altında bir yay var, E\'de yük.' },
    { t: 'Önce dikkat: veriler çelişiyor', st: { lab: 1, load: 0, warn: 1 },
      h: (p, r) => `Soruya iki şey birden söylenmiş, ikisi tam uyuşmuyor: yay en çok ${f2(p.dD)} mm çökebilir, ama ${fmt(p.P)} kN uygulanırsa yay ${f2(r.dD2)} mm çöker. Bu senin hatan değil, sorunun sayıları. Sakin ol, iki yorumu da çözeceğiz. <b>Çözüm 1</b>: yay tam ${f2(p.dD)} mm çökmüş kabul et (yük kullanılmaz). <b>Çözüm 2</b>: ${fmt(p.P)} kN ile çöz, sonra ${f2(p.dD)} mm şartına bak. Soruda istenen büyük olasılıkla Çözüm 1.`,
      f: (p, r) => `Yay kuvveti: k·δ<sub>D</sub> = ${fmt(p.k)}·${f2(p.dD)} = ${f2(r.Fs)} N. Yük ise ${fmt(p.P * 1000, 0)} N: yay bunun neredeyse hiçbirini taşımaz.`,
      why: 'Sınavda böyle bir çelişki görürsen panik yapma: hangi kabulle çözdüğünü bir satırla yaz. Hoca mantığını görür.' },
    { t: 'Geometri: kiriş A etrafında döner', st: { def: 1, lab: 1, load: 0, geo: 1, ghost: 1 },
      h: () => 'Rijit kiriş eğilmez, düz kalır; A mafsalı sabit. Kiriş A etrafında aşağı döner ve B, D, E noktaları A\'ya uzaklıklarıyla orantılı iner: E en çok, B en az. Kırmızı çizgiler iniş miktarı, beyaz kesik çizgi ilk konum (çizim abartılı).',
      f: (p) => `δ<sub>B</sub> : δ<sub>D</sub> : δ<sub>E</sub> = ${fmt(p.AB)} : ${fmt(p.AD)} : ${fmt(p.AE)}`,
      why: 'Küçük açıda iniş = uzaklık × açı (radyan). Aynı açı, farklı uzaklık: üçgenler benzer.' },
    { t: 'Çözüm 1: yayın çökmesinden B ve E\'nin inişi', st: { def: 1, lab: 1, load: 0, geo: 1, ghost: 1, v1: 1 },
      h: (p) => `Çözüm 1\'de yay tam ${f2(p.dD)} mm çökmüş kabul ediliyor; ${fmt(p.P)} kN yük kullanılmıyor. Oranla B ve E\'nin inişi:`,
      f: (p, r) => `δ<sub>B</sub> = ${f2(p.dD)} · ${fmt(p.AB)}/${fmt(p.AD)} = <b>${f4(r.dB)} mm</b><br>δ<sub>E</sub> = ${f2(p.dD)} · ${fmt(p.AE)}/${fmt(p.AD)} = <b>${f3(r.dE)} mm</b>` },
    { t: 'Çözüm 1: BC\'deki gerilme', st: { def: 1, lab: 1, load: 0, bc: 1, v1: 1 },
      h: () => 'B aşağı inince BC çubuğu uzar (C tavanda sabit, uzama B\'nin inişine eşit). Önce birim uzama, sonra Hooke.',
      f: (p, r) => `ε = δ<sub>B</sub>/l = ${f4(r.dB)}/${p.l} = ${sci(r.eps)}<br>σ<sub>BC</sub> = E·ε = ${p.E * 1000} · ${sci(r.eps)} = <b>${f1(r.sBC)} MPa</b> (çekme)<br>Bu durumu yaratan yük (A\'ya göre moment): P = (${fmt(r.FBC, 0)}·${fmt(p.AB)} + ${f2(r.Fs)}·${fmt(p.AD)}) / ${fmt(p.AE)} ≈ ${fmt(r.Preq, 0)} N ≈ ${f2(r.Preq / 1000)} kN. ${fmt(p.P)} kN bunu aşar.`,
      why: 'Burada yük ve yay sabiti hiç kullanılmadı: çökme bilinince her şey geometri + Hooke. İstenen de muhtemelen bu.' },
    { t: 'Çözüm 2: P = 5 kN ile (hiperstatik)', st: { def: 1, lab: 1, load: 1, fbd: 1 },
      h: (p) => `Çözüm 2: ${fmt(p.P)} kN gerçekten uygulanıyor. Bilinmeyenler F<sub>BC</sub>, F<sub>yay</sub>, R<sub>A</sub>; denge yalnız 2 denklem verir, yetmez. Geometri yardım eder: F<sub>BC</sub> = k<sub>BC</sub>·(AB·θ), F<sub>yay</sub> = k·(AD·θ). Bunları A'ya göre moment denkleminde yerine koy, tek bilinmeyen θ kalır:`,
      f: (p, r) => `k<sub>BC</sub> = E·S₀/l = ${fmt(r.kBC, 0)} N/mm<br>${fmt(r.kBC, 0)}·(${fmt(p.AB * 1000, 0)}θ)·${fmt(p.AB * 1000, 0)} + ${fmt(p.k)}·(${fmt(p.AD * 1000, 0)}θ)·${fmt(p.AD * 1000, 0)} = ${fmt(p.P * 1000, 0)}·${fmt(p.AE * 1000, 0)}<br>θ = <b>${sci(r.th)} rad</b>` },
    { t: 'Çözüm 2: sonuçlar ve kontrol', st: { def: 1, lab: 1, load: 1, v2: 1 },
      h: (p, r) => `Yay ${f2(r.dD2)} mm çöküyor: izin verilen ${f2(p.dD)} mm ${r.ok2 ? 'aşılmıyor ✓' : '<b>aşılıyor ✗</b>'}: yani ${fmt(p.P)} kN bu yay şartıyla bağdaşmıyor. Yükün neredeyse tamamını BC taşıyor; yay ihmal edilecek kadar yumuşak.`,
      f: (p, r) => `δ<sub>B</sub> = ${f3(r.dB2)} mm, δ<sub>E</sub> = <b>${f2(r.dE2)} mm</b><br>F<sub>BC</sub> = ${fmt(r.FBC2, 0)} N → σ<sub>BC</sub> = <b>${f1(r.sBC2)} MPa</b><br>R<sub>A</sub> = P − F<sub>BC</sub> − F<sub>yay</sub> = ${fmt(r.RA2, 0)} N (eksi: yukarı kabul ettiğimizin tersi, A mafsalı kirişi aşağı çeker)` }
  ],
  scene(v, p, r) {
    const s = 1.6, xB = p.AB * s, xD = p.AD * s, xE = p.AE * s, hl = 2.2, gy = -2.2;
    const beam = v.add(shift(E3.box(xE + 0.35, 0.32, 0.5), (xE + 0.35) / 2, 0, 0), { color: '#8a96a3', pos: [0, 0, 0] });
    const rod = v.add(shift(E3.box(0.16, hl, 0.16), 0, -hl / 2, 0), { color: C.steel, pos: [xB, hl + 0.16, 0] });
    v.add(E3.box(1.4, 0.3, 1.0), { color: '#2a323c', pos: [xB, hl + 0.31, 0] });
    v.add(E3.box(0.4, 3.6, 1.6), { color: '#2a323c', pos: [-0.4, 0, 0] });
    v.add(E3.cyl(0.1, 0.7, 14, 'z'), { color: '#d7dde3', pos: [0, 0, 0] });
    v.add(E3.box(1.2, 0.2, 1.0), { color: '#2a323c', pos: [xD, gy - 0.1, 0] });
    const def = { c1: 0, c2: 0, dim: 0, lab: 1, load: 1, warn: 0, def: 0, geo: 0, ghost: 0, v1: 0, bc: 0, fbd: 0, v2: 0 };
    return {
      def, apply(S, time, v) {
        const k = 1.4 * S.ex * S.def, ang = Math.atan2(k, xE), dy = x => -x * Math.tan(ang);
        beam.rot = [0, 0, -ang];
        rod.scl = [1, (hl + (-dy(xB))) / hl, 1];
        rod.color = mixHex(C.steel, C.tens, S.bc);
        const O = v.ov;
        O.push({ k: 'hatch', a: [-0.6, -1.8, 0], b: [-0.6, 1.8, 0], n: [-0.3, -0.25, 0], color: C.mute });
        O.push({ k: 'hatch', a: [xB - 0.7, hl + 0.46, 0], b: [xB + 0.7, hl + 0.46, 0], n: [0.2, 0.25, 0], color: C.mute });
        O.push({ k: 'hatch', a: [xD - 0.6, gy - 0.2, 0], b: [xD + 0.6, gy - 0.2, 0], n: [0.2, -0.25, 0], color: C.mute });
        O.push({ k: 'spring', a: [xD, dy(xD) - 0.16, 0], b: [xD, gy, 0], side: [1, 0, 0], r: 0.22, n: 8, color: '#c9d0d8', w: 2 });
        O.push({ k: 'arrow', a: [xE, dy(xE) + 2.0, 0], b: [xE, dy(xE) + 0.2, 0], color: C.red, w: 3, label: `${fmt(p.P)} kN`, lp: [xE + 0.8, dy(xE) + 1.4, 0], alpha: S.load });
        if (Math.max(S.v1, S.bc) > 0.01) O.push({ k: 'text', t: `ÇÖZÜM 1: yay ${f2(p.dD)} mm kabul`, p: [5.6, 3.3, 0], color: C.white, size: 15, box: 1, alpha: Math.max(S.v1, S.bc) });
        if (Math.max(S.fbd, S.v2) > 0.01) O.push({ k: 'text', t: `ÇÖZÜM 2: P = ${fmt(p.P)} kN ile`, p: [5.6, 3.3, 0], color: C.white, size: 15, box: 1, alpha: Math.max(S.fbd, S.v2) });
        if (S.lab > 0.01) [['A', -0.1, 0.55], ['B', xB - 0.35, dy(xB) - 0.45], ['C', xB + 0.4, hl + 0.2], ['D', xD + 0.45, dy(xD) + 0.45], ['E', xE + 0.3, dy(xE) - 0.45]].forEach(([t, x, y]) => O.push({ k: 'text', t, p: [x, y, 0.3], size: 15, alpha: S.lab }));
        O.push({ k: 'dim', a: [0, -0.3, 0], b: [xB, -0.3, 0], off: [0, -0.5, 0.4], t: `${fmt(p.AB)} m`, alpha: S.dim });
        O.push({ k: 'dim', a: [xB, -0.3, 0], b: [xD, -0.3, 0], off: [0, -0.5, 0.4], t: `${fmt(p.AD - p.AB)} m`, alpha: S.dim });
        O.push({ k: 'dim', a: [xD, -0.3, 0], b: [xE, -0.3, 0], off: [0, -0.5, 0.4], t: `${fmt(p.AE - p.AD)} m`, alpha: S.dim });
        if (S.ghost > 0.01) O.push({ k: 'line', p: [[0, 0, 0.3], [xE + 0.3, 0, 0.3]], color: C.white, dash: [6, 5], w: 1.2, alpha: S.ghost * 0.8 });
        if (S.geo > 0.01) {
          O.push({ k: 'line', p: [[0, 0, 0.3], [xE, dy(xE), 0.3]], color: C.red, w: 1.4, alpha: S.geo });
          [[xB, 'δB'], [xD, 'δD'], [xE, 'δE']].forEach(([x, t]) => O.push({ k: 'line', p: [[x, 0, 0.3], [x, dy(x), 0.3]], color: C.red, w: 2.2, alpha: S.geo }));
          O.push({ k: 'text', t: 'δ = x · θ   (x: A\'dan uzaklık)', p: [xE * 0.62, 2.1, 0.3], color: C.red, size: 15, box: 1, alpha: S.geo });
        }
        {
          const a0 = S.geo * (1 - S.v1), a1 = Math.max(S.v1, S.bc) * S.geo;
          [[xB, 'δ_B', f4(r.dB)], [xD, 'δ_D', f2(p.dD)], [xE, 'δ_E', f3(r.dE)]].forEach(([x, n, val], q) => {
            const px = q === 2 ? x - 0.1 : q === 1 ? x + 0.2 : x + 0.65, py = q === 1 ? dy(x) + 1.0 : dy(x) - (q === 2 ? 1.05 : 0.85);
            if (a0 > 0.01) O.push({ k: 'text', t: n, p: [px, py, 0.3], color: C.red, size: 15, alpha: a0 });
            if (a1 > 0.01) O.push({ k: 'text', t: `${n} = ${val} mm`, p: [px, py, 0.3], color: C.red, size: 14, box: 1, alpha: a1 });
          });
        }
        if (S.bc > 0.01) O.push({ k: 'text', t: `σ_BC = ${f1(r.sBC)} MPa`, p: [xB + 1.9, hl * 0.55, 0], color: C.tens, size: 16, box: 1, alpha: S.bc });
        if (S.warn > 0.01) O.push({ k: 'text', t: `Çözüm 1: yay tam ${f2(p.dD)} mm çöker, yük kullanılmaz`, p: [xD, -3.0, 0], color: C.white, size: 15, box: 1, alpha: S.warn });
        if (S.warn > 0.01) O.push({ k: 'text', t: `Çözüm 2: ${fmt(p.P)} kN → yay ${f2(r.dD2)} mm çöker  >  ${f2(p.dD)} mm`, p: [xD, -3.8, 0], color: C.red, size: 15, box: 1, alpha: S.warn });
        if (S.fbd > 0.01) {
          O.push({ k: 'arrow', a: [xB, dy(xB) + 0.2, 0.4], b: [xB, dy(xB) + 1.6, 0.4], color: C.white, w: 2.4, label: 'F_BC = k_BC·δ_B', lp: [xB + 1.5, dy(xB) + 1.2, 0.4], alpha: S.fbd });
          O.push({ k: 'arrow', a: [xD, dy(xD) - 1.1, 0.4], b: [xD, dy(xD) - 0.2, 0.4], color: C.white, w: 2.4, label: 'F_yay = k·δ_D', lp: [xD + 1.6, dy(xD) - 0.8, 0.4], alpha: S.fbd });
          O.push({ k: 'arrow', a: [0.1, -1.4, 0.4], b: [0.1, -0.25, 0.4], color: C.white, w: 2.4, label: 'R_A', lp: [0.75, -0.95, 0.4], alpha: S.fbd });
        }
        if (S.v2 > 0.01) {
          O.push({ k: 'text', t: `σ_BC = ${f1(r.sBC2)} MPa`, p: [xB + 1.9, hl * 0.55, 0], color: C.tens, size: 15, box: 1, alpha: S.v2 });
          O.push({ k: 'text', t: `δ_E = ${f2(r.dE2)} mm`, p: [xE - 0.1, dy(xE) - 1.05, 0.3], color: C.red, size: 15, box: 1, alpha: S.v2 });
          O.push({ k: 'text', t: `yay: ${f2(r.dD2)} mm ${r.ok2 ? '≤' : '>'} ${f2(p.dD)}  ${r.ok2 ? '✓' : '✗'}`, p: [xD, -3.3, 0], color: r.ok2 ? C.white : C.red, size: 14, box: 1, alpha: S.v2 });
        }
      }
    };
  },
  whatif: {
    not: 'Çözüm 1 için: yayın çökmesini değiştir, her iniş onunla doğru orantılı büyür. B\'yi A\'dan uzaklaştır veya BC boyunu değiştir, gerilmenin nasıl değiştiğine bak.',
    s: [{ k: 'dD', ad: 'İzin verilen δ_D', min: 0.1, max: 2, step: 0.05, u: 'mm' }, { k: 'AB', ad: 'A–B uzaklığı', min: 0.5, max: 2.9, step: 0.1, u: 'm' }, { k: 'l', ad: 'BC boyu l', min: 200, max: 1500, step: 50, u: 'mm' }],
    out: (p, r) => `<div class="mets"><div class="m"><small>δ_B</small><b>${f4(r.dB)} mm</b></div><div class="m red"><small>σ_BC (Çözüm 1)</small><b>${f1(r.sBC)} MPa</b></div><div class="m"><small>δ_E</small><b>${f3(r.dE)} mm</b></div><div class="m"><small>Bu durumu yaratan P</small><b>${fmt(r.Preq, 0)} N</b></div></div>
      <p class="note">BC uzarsa (l büyür) aynı δ_B için ε küçülür: gerilme azalır. B, A'dan uzaklaşırsa (AB büyür) δ_B artar.</p>`
  },
  kagit: (p, r) => `Rijit AE, A etrafında döner:  δ_B/${fmt(p.AB)} = δ_D/${fmt(p.AD)} = δ_E/${fmt(p.AE)} = θ
Çözüm 1 (δ_D = ${f2(p.dD)} mm):
  δ_B = ${f2(p.dD)}·${fmt(p.AB)}/${fmt(p.AD)} = ${f4(r.dB)} mm      δ_E = ${f2(p.dD)}·${fmt(p.AE)}/${fmt(p.AD)} = ${f3(r.dE)} mm
  ε_BC = δ_B/l = ${f4(r.dB)}/${p.l} = ${(r.eps * 1e4).toLocaleString('tr-TR', { maximumFractionDigits: 3 })}·10⁻⁴
  σ_BC = E·ε = ${p.E * 1000}·${(r.eps * 1e4).toLocaleString('tr-TR', { maximumFractionDigits: 3 })}·10⁻⁴ = ${f1(r.sBC)} MPa (çekme)
Çözüm 2 (P = ${f2(p.P)} kN):  ΣM_A: k_BC(AB·θ)·AB + k(AD·θ)·AD = P·AE
  θ = ${sci(r.th).replace(/<\/?sup>/g, '')} rad → δ_E = ${f2(r.dE2)} mm, σ_BC = ${f1(r.sBC2)} MPa, δ_D = ${f2(r.dD2)} > ${f2(p.dD)} ✗`,
  tuzak: ['<b>Birimleri karıştırmak.</b> Uzaklıklar m, çökmeler mm: oran aldığın sürece fark etmez, ama σ = E·ε\'de l mm olmalı.',
    '<b>k = 200 N/m\'yi N/mm sanmak.</b> 200 N/m = 0,2 N/mm.',
    '<b>Çökmeyi kuvvetle orantılamak.</b> Rijit kirişte iniş uzaklıkla orantılı, kuvvetle değil.',
    '<b>Çelişkiyi görmezden gelmek.</b> Hangi kabulle çözdüğünü yaz.'],
  gen() { const AD = rnd(2, 4, 0.5), AE = AD + rnd(1, 3, 0.5); return { P: 5, AB: rnd(0.5, Math.min(2, AD - 0.5), 0.5), AD, AE, S0: rnd(200, 800, 50), E: pick([70, 200, 105]), l: rnd(300, 1000, 50), k: 0.2, dD: rnd(0.2, 1.5, 0.1) }; },
  pracText: p => `Mafsallı rijit kiriş A'dan E'ye. AB = ${fmt(p.AB)} m, AD = ${fmt(p.AD)} m, AE = ${fmt(p.AE)} m. B'yi tavana bağlayan çubuk: S₀ = ${p.S0} mm², E = ${p.E} GPa, l = ${p.l} mm. D'deki yay en çok ${f2(p.dD)} mm çökebiliyor ve tam o kadar çökmüş. σ_BC ve δ_E kaç?`,
  ans: [{ k: 'dB', ad: 'δ_B', u: 'mm' }, { k: 'sBC', ad: 'σ_BC', u: 'MPa' }, { k: 'dE', ad: 'δ_E', u: 'mm' }],
  hints: (p, r) => [`δ_B = ${f2(p.dD)} · ${fmt(p.AB)}/${fmt(p.AD)}.`, `ε = δ_B / ${p.l}, σ = ${p.E}000 · ε.`, `δ_E = ${f2(p.dD)} · ${fmt(p.AE)}/${fmt(p.AD)}.`],
  diag(p, r, u) {
    const near = (a, b) => isFinite(a) && Math.abs(a - b) <= Math.abs(b) * 0.02;
    if (near(u.sBC, r.sBC / 1000)) return 'E\'yi GPa olarak bırakmışsın: E = ' + p.E + '000 N/mm².';
    if (near(u.dE, p.dD * p.AD / p.AE)) return 'Oranı ters kurmuşsun: E, A\'dan daha uzak; daha çok iner.';
    return 'Önce oranla inişler, sonra ε = δ/l, sonra σ = E·ε.';
  }
});
