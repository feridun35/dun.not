'use strict';
const fk6 = x => isFinite(x) ? x.toLocaleString('tr-TR', { maximumFractionDigits: 1 }).replace(/\./g, ' ').replace(/^-/, '−') : '—'; // 1 142,9 N: PDF ile aynı ondalık
/* ============ PROBLEM 6 ============ */
PROBS.push({
  id: 'p6', no: 6, tip: 'hs',
  ad: 'İki malzemeli yatay çubuk (+ ısı)',
  ozet: 'Problem 5\'in aynısı, yatay ve iki farklı malzeme. Fark: f ve α her parçada farklı.',
  soru: '1000 mm boyundaki çubuk A ve B uçlarından iki rijit plakaya sabitlenmiştir. C noktasından P = 2 kN\'luk kuvvet etkimektedir. (a) A ve B\'de doğacak reaksiyon kuvvetlerini ve gerilmeleri hesaplayınız. (b) Sıcaklık 100 °C artırılırsa meydana gelecek termik gerilmeleri hesaplayınız.',
  verilen: ['AC (1): L₁ = 750 mm, A₁ = 500 mm², E₁ = 2·10⁵ N/mm², α₁ = 1,6·10⁻⁶ 1/°C', 'CB (2): L₂ = 250 mm, A₂ = 250 mm², E₂ = 1·10⁵ N/mm², α₂ = 1·10⁻⁶ 1/°C', 'C\'de P = 2 kN, sola (A\'ya doğru)', '(b)\'de ΔT = +100 °C'],
  istenen: '(a) R<sub>A</sub>, R<sub>B</sub>, σ₁, σ₂ ; (b) termik gerilmeler σ₁ᵀ, σ₂ᵀ',
  p0: { P: 2, L1: 750, A1: 500, E1: 200000, a1: 1.6e-6, L2: 250, A2: 250, E2: 100000, a2: 1e-6, dT: 100 },
  solve(p) {
    const f1 = p.L1 / (p.E1 * p.A1), f2 = p.L2 / (p.E2 * p.A2), F = p.P * 1000;
    const RB = F * f1 / (f1 + f2), RA = F - RB, dTf = p.dT * (p.a1 * p.L1 + p.a2 * p.L2), RT = dTf / (f1 + f2);
    return { f1, f2, F, RA, RB, N1: -RA, N2: RB, s1: -RA / p.A1, s2: RB / p.A2, dTf, RT, s1T: -RT / p.A1, s2T: -RT / p.A2,
      gapP: F * f1, sum1: -RA / p.A1 - RT / p.A1, sum2: RB / p.A2 - RT / p.A2 };
  },
  anlam: [
    ['A ve B uçlarından sabitlenmiş', 'Yine iki bilinmeyen (R<sub>A</sub>, R<sub>B</sub>), yatayda tek denklem: <b>hiperstatik</b>.'],
    ['E₁ ≠ E₂, α₁ ≠ α₂', 'Parçalar farklı malzeme: her birinin f\'si ve ısı uzaması <b>ayrı</b> hesaplanır.'],
    ['P sola, A\'ya doğru', 'P, C\'yi A\'ya iter: AC <b>sıkışır</b> (bası), CB <b>gerilir</b> (çekme).'],
    ['termik gerilmeleri', 'Sadece ısının etkisi: kuvvet iki parçada <b>aynı</b>, ama alanlar farklı → gerilmeler farklı.']
  ],
  tetik: ['iki ucu rijit plakaya sabit', 'farklı E ve α', 'termik gerilme', 'reaksiyon ve gerilmeler'],
  tetikNot: 'Problem 5\'i tanıdıysan bunu da tanırsın: iki duvar arasında çubuk. Tarif aynı; yalnızca f₁, f₂ ve ısı terimi her parçada ayrı.',
  zincir: [["Bunu nereden tanıyorum?", "Problem 5'in yatayı: iki duvar arası çubuk, iki reaksiyon, tek denklem."], ["Farkı ne?", "Parçaların E'si ve α'sı farklı: f₁, f₂ ve ısı uzamalarını <b>ayrı ayrı</b> yaz."], ["Yükü kim daha çok taşır?", "Sert olan (küçük f). R_B = P·f₁/(f₁+f₂)."], ["Termik gerilme?", "Duvar kuvveti iki parçada <b>aynı</b>; gerilme = kuvvet / kendi alanı."]],
  cam: { yaw: -0.08, pitch: 0.3, dist: 17, t: [5, -0.2, 0] },
  steps: [
    { t: 'Şekle bak', st: { dim: 1, load: 1, lab: 1 },
      h: () => 'Yatay bir çubuk iki duvar arasında (A solda, B sağda). Sol parça (AC) uzun ve kalın, sağ parça (CB) kısa ve ince. P, C noktasını sola, A\'ya doğru itiyor.' },
    { t: 'Hiperstatik: bir duvarı kaldır', st: { load: 1, lab: 1, gap: 1, wallB: 0.15 },
      h: () => 'Önce B duvarını kaldırdığını düşün. P, AC\'yi sıkıştırır; C ve çubuğun B ucu sola kayar, çubukla B duvarı arasında <b>boşluk</b> açılır. Gerçekte duvar var: R<sub>B</sub> çubuğu geri çekip bu boşluğu kapatmak zorunda. Denklemi buradan kuracağız.',
      f: (p, r) => `boşluk = P · f₁ = ${fmt(r.F, 0)} · ${sci(r.f1)} = ${f4(r.gapP)} mm` },
    { t: 'Esneklikler f = L/(EA)', st: { load: 1, lab: 1, fv: 1 },
      h: () => 'f, 1 N kuvvetin parçayı kaç mm uzattığı (ya da kısalttığı). Küçük f = sert parça. Bu sefer E de farklı, her parçanın f\'si ayrı: CB daha yumuşak (f₂ > f₁).',
      f: (p, r) => `f₁ = ${p.L1} / (${sci(p.E1, 0)} · ${p.A1}) = ${sci(r.f1)} mm/N<br>f₂ = ${p.L2} / (${sci(p.E2, 0)} · ${p.A2}) = ${sci(r.f2)} mm/N` },
    { t: '(a) Reaksiyonlar', st: { load: 1, lab: 1, reac: 1, val: 1, colr: 1 },
      h: () => 'Uygunluk: AC\'nin kısalması = CB\'nin uzaması. R<sub>B</sub> B ucunu geri çeker: CB gerilir (kırmızı, çekme), AC sıkışık kalır (mavi, bası). Şekil değişimi abartılı.',
      f: (p, r) => `R<sub>B</sub> = P·f₁/(f₁+f₂) = <b>${fk6(r.RB)} N</b> (sağa)<br>R<sub>A</sub> = P − R<sub>B</sub> = <b>${fk6(r.RA)} N</b> (sağa)`,
      why: 'PDF\'deki yol: N₁ = −R_A, N₂ = R_B, uygunluk −R_A·f₁ + R_B·f₂ = 0 → R_A = R_B·f₂/f₁. Denge ile birleştirince aynı sonuç.' },
    { t: '(a) Gerilmeler', st: { load: 1, lab: 1, reac: 1, val: 1, colr: 1, sv: 1 },
      h: () => 'Her parçanın kuvvetini kendi alanına böl.',
      f: (p, r) => `σ₁ = −${fk6(r.RA)} / ${p.A1} = <b>${f2(r.s1)} MPa</b> (bası)<br>σ₂ = ${fk6(r.RB)} / ${p.A2} = <b>${f2(r.s2)} MPa</b> (çekme)` },
    { t: '(b) Serbest uzama', st: { lab: 1, ghost: 1, th: 1, load: 0 },
      h: () => 'Duvarlar olmasaydı her parça kendi α\'sıyla uzardı. Saydam çubuk serbest hali gösteriyor (abartılı).',
      f: (p, r) => `δ<sub>T</sub> = α₁ΔTL₁ + α₂ΔTL₂ = ${f3(p.a1 * p.dT * p.L1)} + ${f3(p.a2 * p.dT * p.L2)} = <b>${f3(r.dTf)} mm</b>` },
    { t: '(b) Duvarlar sıkıştırır: termik gerilme', st: { lab: 1, th: 1, reacT: 1, colr: 1, sv: 1, load: 0 },
      h: (p) => 'Dış yük yok: duvar kuvveti R<sub>T</sub> iki parçada <b>aynı</b> (iki duvar çubuğu sıkıştırıyor). Ama CB\'nin kesiti AC\'ninkinin ' + f2(p.A2 / p.A1) + ' katı: gerilmesi ' + f2(p.A1 / p.A2) + ' kat.',
      f: (p, r) => `R<sub>T</sub> = δ<sub>T</sub>/(f₁+f₂) = ${f3(r.dTf)} / ${sci(r.f1 + r.f2)} = <b>${fk6(r.RT)} N</b><br>σ₁ᵀ = −${fk6(r.RT)}/${p.A1} = <b>${f2(r.s1T)} MPa</b>, σ₂ᵀ = −${fk6(r.RT)}/${p.A2} = <b>${f2(r.s2T)} MPa</b>`,
      why: 'P ve ısı birlikte etkirse (soruda verilen sayılarla) gerilmeleri topla: σ₁ = −2,29 − 16,57 = −18,86 MPa, σ₂ = 3,43 − 33,14 = −29,71 MPa. Süperpozisyon serbest (doğrusal-elastik). Isı çubuğun tamamını bası yapar.' }
  ],
  scene(v, p, r) {
    const s = 0.008, Lt = (p.L1 + p.L2) * s, xC = p.L1 * s, w1 = 0.9, w2 = 0.62;
    const s1 = v.add(shift(E3.box(xC, w1, w1), xC / 2, 0, 0), { color: C.steel, pos: [0, 0, 0] });
    const s2 = v.add(shift(E3.box(Lt - xC, w2, w2), (Lt - xC) / 2, 0, 0), { color: '#b39770', pos: [xC, 0, 0] });
    const gh = v.add(shift(E3.box(Lt, w1 + 0.04, w1 + 0.04), Lt / 2, 0, 0), { color: C.red, alpha: 0, edge: 0, pos: [0, 0, 0] });
    v.add(E3.box(0.5, 3.2, 2.4), { color: '#2a323c', pos: [-0.25, 0, 0] });
    const wB = v.add(E3.box(0.5, 3.2, 2.4), { color: '#2a323c', pos: [Lt + 0.25, 0, 0] });
    const def = { dim: 0, load: 1, lab: 0, gap: 0, wallB: 1, fv: 0, reac: 0, val: 0, colr: 0, sv: 0, ghost: 0, th: 0, reacT: 0 };
    return {
      def, apply(S, time, v) {
        const g = 7 * S.ex, base2 = '#b39770';
        const thermal = S.th > 0.5;
        const N1 = thermal ? -r.RT : r.N1, N2 = thermal ? -r.RT : r.N2;
        const dC = (thermal ? 0 : r.N1 * r.f1) * g * S.colr - r.gapP * g * 8 * S.gap;
        s1.scl = [(xC + dC) / xC, 1, 1]; s2.pos = [xC + dC, 0, 0];
        s2.scl = [S.gap > 0.01 ? 1 : (Lt - xC - dC) / (Lt - xC), 1, 1];
        wB.alpha = S.wallB;
        s1.color = mixHex(C.steel, N1 > 0 ? C.tens : C.comp, S.colr); s2.color = mixHex(base2, N2 > 0 ? C.tens : C.comp, S.colr);
        gh.alpha = S.ghost * 0.28; gh.scl = [(Lt + r.dTf * g * S.ghost) / Lt, 1, 1];
        const O = v.ov, xc = xC + dC;
        O.push({ k: 'hatch', a: [-0.5, -1.6, 0], b: [-0.5, 1.6, 0], n: [-0.3, -0.25, 0], color: C.mute });
        O.push({ k: 'hatch', a: [Lt + 0.5, -1.6, 0], b: [Lt + 0.5, 1.6, 0], n: [0.3, -0.25, 0], color: C.mute, alpha: S.wallB });
        [1, -1].forEach(sg => O.push({ k: 'arrow', a: [xc + 1.3, sg * 0.62, 0], b: [xc + 0.05, sg * 0.62, 0], color: C.red, w: 3, label: sg > 0 ? `P = ${f2(p.P)} kN` : '', lp: [xc + 1.3, 1.2, 0], alpha: S.load * (sg > 0 ? 1 : 0.6) }));
        if (S.lab > 0.01) [['A', -0.9, 1.9], ['C', xc, 1.25], ['B', Lt + 0.9, 1.9], ['1', xC / 2, 0.8], ['2', xC + (Lt - xC) * 0.75, 0.65]].forEach(([t, x, y]) => O.push({ k: 'text', t, p: [x, y, 0], size: 15, alpha: S.lab }));
        O.push({ k: 'dim', a: [0, -0.5, 0], b: [xC, -0.5, 0], off: [0, -0.9, 0], t: `${p.L1} mm`, alpha: S.dim });
        O.push({ k: 'dim', a: [xC, -0.5, 0], b: [Lt, -0.5, 0], off: [0, -0.9, 0], t: `${p.L2} mm`, alpha: S.dim });
        if (S.gap > 0.01) O.push({ k: 'dim', a: [xc + Lt - xC, -0.5, 0], b: [Lt, -0.5, 0], off: [0, -0.9, 0], t: 'boşluk = P·f₁', color: C.red, alpha: S.gap });
        if (S.fv > 0.01) {
          O.push({ k: 'text', t: `f₁ = ${(r.f1 * 1e6).toLocaleString('tr-TR')}·10⁻⁶ mm/N`, p: [xC / 2, -1.6, 0], size: 14, box: 1, alpha: S.fv });
          O.push({ k: 'text', t: `f₂ = ${(r.f2 * 1e6).toLocaleString('tr-TR')}·10⁻⁶ mm/N`, p: [xC + (Lt - xC) / 2, -1.6, 0], size: 14, box: 1, alpha: S.fv });
        }
        if (S.reac > 0.01) {
          O.push({ k: 'arrow', a: [-1.6, 0, 0.9], b: [-0.1, 0, 0.9], color: C.white, w: 2.6, label: S.val > 0.5 ? `R_A = ${fk6(r.RA)} N` : 'R_A', lp: [-0.3, 1.1, 0.9], alpha: S.reac });
          O.push({ k: 'arrow', a: [Lt + 0.1, 0, 0.9], b: [Lt + 1.9, 0, 0.9], color: C.white, w: 2.6, label: S.val > 0.5 ? `R_B = ${fk6(r.RB)} N` : 'R_B', lp: [Lt + 1.4, 0.55, 0.9], alpha: S.reac });
        }
        if (S.reacT > 0.01) {
          O.push({ k: 'arrow', a: [-1.6, 0, 0.9], b: [-0.1, 0, 0.9], color: C.white, w: 2.6, label: `R_T = ${fk6(r.RT)} N`, lp: [-0.3, 1.1, 0.9], alpha: S.reacT });
          O.push({ k: 'arrow', a: [Lt + 1.9, 0, 0.9], b: [Lt + 0.1, 0, 0.9], color: C.white, w: 2.6, label: `R_T = ${fk6(r.RT)} N`, lp: [Lt + 1.4, 0.55, 0.9], alpha: S.reacT });
        }
        if (S.sv > 0.01) {
          const a = thermal ? r.s1T : r.s1, b = thermal ? r.s2T : r.s2;
          O.push({ k: 'text', t: `σ₁ = ${f2(a)} MPa`, p: [xC / 2, -1.6, 0.5], color: a > 0 ? C.tens : C.comp, size: 15, box: 1, alpha: S.sv });
          O.push({ k: 'text', t: `σ₂ = ${f2(b)} MPa`, p: [xC + (Lt - xC) / 2, -1.6, 0.5], color: b > 0 ? C.tens : C.comp, size: 15, box: 1, alpha: S.sv });
        }
        if (S.ghost > 0.01) O.push({ k: 'text', t: `serbest olsaydı +${f3(r.dTf)} mm`, p: [Lt - 1.5, 1.9, 0], color: C.red, size: 14, box: 1, alpha: S.ghost });
      }
    };
  },
  whatif: {
    not: 'İkinci parçanın kesitini büyüt: termik kuvvet büyür ama gerilme küçülür. Kuvvet her parçada aynı, gerilme alanla ters orantılı.',
    s: [{ k: 'A2', ad: 'A₂ (sağ parça)', min: 100, max: 800, step: 10, u: 'mm²' }, { k: 'E2', ad: 'E₂', min: 50000, max: 210000, step: 5000, u: 'MPa' }, { k: 'dT', ad: 'ΔT', min: 0, max: 200, step: 5, u: '°C' }],
    out: (p, r) => `<div class="mets"><div class="m"><small>R_A (a)</small><b>${fk6(r.RA)} N</b></div><div class="m"><small>R_B (a)</small><b>${fk6(r.RB)} N</b></div><div class="m"><small>R_T (b)</small><b>${fk6(r.RT)} N</b></div><div class="m blue"><small>σ₁ᵀ</small><b>${f2(r.s1T)} MPa</b></div><div class="m blue"><small>σ₂ᵀ</small><b>${f2(r.s2T)} MPa</b></div></div>
      <p class="note">(a)'da sert parça (küçük f) yükün çoğunu taşır: R_A / P = ${f1(r.RA / r.F * 100)} %.</p>`
  },
  kagit: (p, r) => `Denge: R_A + R_B = P = ${fmt(r.F, 0)} N ;  N₁ = −R_A,  N₂ = R_B
f₁ = ${p.L1}/(${p.E1}·${p.A1}) = ${(r.f1 * 1e6).toLocaleString('tr-TR')}·10⁻⁶ ;  f₂ = ${p.L2}/(${p.E2}·${p.A2}) = ${(r.f2 * 1e6).toLocaleString('tr-TR')}·10⁻⁶ mm/N
(a) −R_A·f₁ + R_B·f₂ = 0  →  R_B = P·f₁/(f₁+f₂) = ${fk6(r.RB)} N,  R_A = ${fk6(r.RA)} N
    σ₁ = −${fk6(r.RA)}/${p.A1} = ${f2(r.s1)} MPa   σ₂ = ${fk6(r.RB)}/${p.A2} = ${f2(r.s2)} MPa
(b) δ_T = α₁ΔTL₁ + α₂ΔTL₂ = ${f3(r.dTf)} mm
    R_T = δ_T/(f₁+f₂) = ${fk6(r.RT)} N
    σ₁ᵀ = ${f2(r.s1T)} MPa   σ₂ᵀ = ${f2(r.s2T)} MPa`,
  tuzak: ['<b>Tek E kullanmak.</b> E₁ = 2·10⁵, E₂ = 1·10⁵: f\'ler ayrı.',
    '<b>Tek α kullanmak.</b> Isı uzaması her parçada kendi α\'sı ve L\'siyle.',
    '<b>Termik kuvveti parçalara bölmek.</b> Seri bağlı parçalarda kuvvet aynıdır; bölünmez.',
    '<b>Termik gerilmeyi aynı sanmak.</b> Kuvvet aynı, alan farklı: ince parçada gerilme büyük.'],
  gen() { const L1 = rnd(300, 800, 50); return { P: rnd(1, 10, 0.5), L1, A1: rnd(200, 800, 50), E1: pick([200000, 210000, 70000]), a1: pick([1.2e-5, 1.6e-6, 2.3e-5]), L2: 1000 - L1, A2: rnd(100, 500, 50), E2: pick([100000, 70000, 105000]), a2: pick([1e-6, 1.7e-5, 2.3e-5]), dT: rnd(20, 120, 10) }; },
  pracText: p => `İki duvar arasındaki çubuk: (1) L₁ = ${p.L1} mm, A₁ = ${p.A1} mm², E₁ = ${p.E1} MPa, α₁ = ${sci(p.a1, 2)} 1/°C; (2) L₂ = ${p.L2} mm, A₂ = ${p.A2} mm², E₂ = ${p.E2} MPa, α₂ = ${sci(p.a2, 2)} 1/°C. Birleşim yerinde ${f2(p.P)} kN, (1)'e doğru. (a) R_A, R_B? (b) ${p.dT} °C ısınınca termik gerilmeler?`,
  ans: [{ k: 'RA', ad: '(a) R_A', u: 'N' }, { k: 'RB', ad: '(a) R_B', u: 'N' }, { k: 's1T', ad: '(b) σ₁ᵀ (büyüklük)', u: 'MPa', abs: 1 }, { k: 's2T', ad: '(b) σ₂ᵀ (büyüklük)', u: 'MPa', abs: 1 }],
  hints: (p, r) => [`f₁ = ${p.L1}/(E₁·A₁), f₂ = ${p.L2}/(E₂·A₂).`, 'R_B = P·f₁/(f₁+f₂). Yükün itildiği taraf (1) sıkışır.', `δ_T = ΔT(α₁L₁ + α₂L₂), R_T = δ_T/(f₁+f₂), σ = R_T/A.`],
  diag(p, r, u) {
    const near = (a, b) => isFinite(a) && Math.abs(a - b) <= Math.abs(b) * 0.02;
    if (near(u.RA, r.RB)) return 'R_A ile R_B yer değiştirmiş. Sert parça (küçük f) daha çok taşır.';
    if (near(Math.abs(u.s1T), Math.abs(r.s2T)) || near(Math.abs(u.s2T), Math.abs(r.s1T))) return 'Termik gerilmeleri karıştırmışsın: aynı kuvvet, her parça kendi alanına bölünür.';
    return 'Esneklikleri ayrı yaz; termik kuvvet iki parçada aynı.';
  }
});
