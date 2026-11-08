'use strict';
/* ============ VİZE 3 · 2016–17 Yaz S3 (= 2017–18 Güz S2) · çelik + pirinç çubuk, ısınma ============ */
const v3a = x => `${(x * 1e6).toLocaleString('tr-TR')}·10⁻⁶`; // 11,7·10⁻⁶ biçimi (sorudaki gibi)
VIZE.push({
  id: 'v3', no: 3, kod: 'V3', vize: true, tip: 'hs',
  src: '2016–17 Yaz vizesi · Soru 3 (2017–18 Güz vizesi · Soru 2 ile aynı)',
  img: 'img/v3.png', cevapImg: 'img/v3_cevap.png',
  ad: 'Çelik + pirinç çubuk iki ucu tutulu, 50 °C ısınıyor',
  ozet: 'Dış yük yok; kuvveti ısı yaratıyor. Serbest uzamayı bul, duvar onu geri bastırır: P = δ_T / (f₁ + f₂). Kuvvet iki parçada aynı, gerilme alanla ters orantılı.',
  soru: 'AB ve BC silindirik parçalarından oluşan bir çubuk her iki ucundan sabitlenmiştir. Başlangıçta çubuk gerilmesiz olduğuna göre, 50 °C\'lık bir sıcaklık artışı olduğu zaman ABC\'de ortaya çıkan basınç kuvvetini ve her bir çubukta oluşan gerilmeleri belirleyiniz. AB parçası çelikten (E<sub>ç</sub> = 200 GPa, α<sub>ç</sub> = 11,7·10⁻⁶ 1/°C), BC parçası pirinçten (E<sub>p</sub> = 105 GPa, α<sub>p</sub> = 20,9·10⁻⁶ 1/°C) yapılmıştır.',
  verilen: ['AB (üst, çelik): L₁ = 250 mm, d₁ = 30 mm, E₁ = 200 GPa, α₁ = 11,7·10⁻⁶ 1/°C',
    'BC (alt, pirinç): L₂ = 300 mm, d₂ = 50 mm, E₂ = 105 GPa, α₂ = 20,9·10⁻⁶ 1/°C',
    'A ve C uçları sabit (iki duvar arası), başlangıçta gerilme yok',
    'ΔT = +50 °C, dış yük yok'],
  istenen: 'Bası kuvveti P; σ<sub>çelik</sub> ve σ<sub>pirinç</sub>',
  p0: { dT: 50, L1: 250, d1: 30, E1: 200, a1: 11.7e-6, L2: 300, d2: 50, E2: 105, a2: 20.9e-6, m2: 'pirinç' },
  solve(p) {
    const A1 = Math.PI * p.d1 * p.d1 / 4, A2 = Math.PI * p.d2 * p.d2 / 4;
    const f1 = p.L1 / (p.E1 * 1000 * A1), f2 = p.L2 / (p.E2 * 1000 * A2);
    const d1T = p.a1 * p.dT * p.L1, d2T = p.a2 * p.dT * p.L2, dTf = d1T + d2T;
    const P = dTf / (f1 + f2);
    const n1 = d1T - P * f1, n2 = d2T - P * f2; // her parçanın NET boy değişimi (mm), toplamı 0
    return { A1, A2, f1, f2, d1T, d2T, dTf, P, PkN: P / 1000, s1: -P / A1, s2: -P / A2, s1a: P / A1, s2a: P / A2,
      n1, n2, uB: n2, chk: n1 + n2, ratio: A2 / A1 };
  },
  anlam: [
    ['her iki ucundan sabitlenmiştir', 'A ve C oynamaz: çubuğun <b>toplam boyu değişemez</b>. Eksik denklem bu.'],
    ['başlangıçta gerilmesiz', 'Isınmadan önce kuvvet yok. Bütün kuvveti <b>ısı</b> yaratacak.'],
    ['50 °C sıcaklık artışı', 'Her parça kendi α\'sıyla uzamak ister: δ = α·ΔT·L. Duvar izin vermez → <b>bası</b>.'],
    ['ABC\'de ortaya çıkan basınç kuvveti', 'Dış yük yok: iki duvarın ittiği kuvvet aynı, çubuğun her kesitinde de aynı P. <b>Tek bilinmeyen P</b>.'],
    ['30 mm çap, 50 mm çap', 'Alanı çaptan sen bulacaksın: A = π·d²/4. Kalın pirinç, ince çelik.'],
    ['her bir çubukta oluşan gerilmeler', 'Aynı P\'yi iki farklı alana böl: <b>ince çelik daha çok gerilir</b>.']
  ],
  tetik: ['her iki ucundan sabitlenmiş', 'başlangıçta gerilmesiz', 'sıcaklık artışı', 'basınç kuvveti', 'iki farklı malzeme (E, α)'],
  tetikNot: 'Örnek Problem 6\'nın (b) şıkkı ile aynı iş: dış yük yok, sadece ısı. "İki ucu sabit + ısınma" gördüğün an: serbest uzamayı bul, duvarın bu uzamayı geri bastırdığını yaz.',
  zincir: [
    ['Kaç bilinmeyen var?', 'İki duvar tepkisi. Dış yük olmadığı için dengeden R<sub>A</sub> = R<sub>C</sub> = P çıkar, ama P\'nin <b>kaç</b> olduğunu denge söylemez.'],
    ['Eksik denklem nereden?', 'Duvarlar oynamıyor: <b>toplam boy değişimi = 0</b>.'],
    ['Duvar olmasaydı ne olurdu?', 'İki parça da uzardı: δ<sub>T</sub> = α₁ΔTL₁ + α₂ΔTL₂ (her parça kendi α\'sıyla).'],
    ['Duvar bu uzamayı nasıl siler?', 'P ile bastırır. P\'nin kısalttığı miktar: δ<sub>P</sub> = P·(f₁ + f₂), f = L/(EA).'],
    ['Denklem?', 'δ<sub>P</sub> = δ<sub>T</sub> → P = δ<sub>T</sub> / (f₁ + f₂).'],
    ['Gerilmeler?', 'Kuvvet iki parçada aynı (seri bağlı). σ = P/A, ikisi de bası (eksi).']
  ],
  cam: { yaw: -0.42, pitch: 0.14, dist: 14.5, t: [0.7, 3.6, 0] },
  steps: [
    { t: 'Şekle bak', st: { dim: 1, lab: 1, mat: 1 },
      h: (p) => `Dik bir çubuk iki duvar arasında. Üstte A, altta C sabit. Üst parça AB ${p.L1} mm boyunda, ${p.d1} mm çaplı <b>çelik</b> (ince). Alt parça BC ${p.L2} mm, ${p.d2} mm çaplı <b>${p.m2}</b> (kalın). Dışarıdan hiçbir kuvvet yok; sadece ısınıyor.` },
    { t: 'Neden hiperstatik?', st: { lab: 1, reac: 1, q: 1 },
      h: () => 'Bilinmeyenler: üst duvarın tepkisi R<sub>A</sub> ve alt duvarın tepkisi R<sub>C</sub>. Dış yük yok, düşey denge yalnızca R<sub>A</sub> = R<sub>C</sub> der. İkisinin <b>büyüklüğünü</b> söylemez: statik tek başına çözemez.',
      f: () => 'R<sub>A</sub> = R<sub>C</sub> = P   (P = ?)',
      why: 'Isınmadan önce P = 0 da dengedir, P = 1000 kN da. Hangisi olduğunu ancak "duvarlar oynamıyor" bilgisiyle buluruz.' },
    { t: 'Üst duvarı kaldır: serbest ısıl uzama', st: { lab: 1, free: 1, top: 0.12, tv: 1 }, cam: { t: [0.7, 4.3, 0], dist: 15.5 },
      h: (p, r) => `Üst duvar olmasaydı çubuk ${p.dT} °C ısınınca rahatça uzardı ve hiç gerilme olmazdı. Her parça <b>kendi α\'sıyla</b> uzar: ${p.m2}ın α\'sı büyük ve parçası uzun, o yüzden uzamanın çoğu ondan gelir. (Şekil değişimi abartılı.)`,
      f: (p, r) => `δ₁ = α₁·ΔT·L₁ = ${v3a(p.a1)} · ${p.dT} · ${p.L1} = ${f4(r.d1T)} mm<br>δ₂ = α₂·ΔT·L₂ = ${v3a(p.a2)} · ${p.dT} · ${p.L2} = ${f4(r.d2T)} mm<br>δ<sub>T</sub> = δ₁ + δ₂ = <b>${fmt(r.dTf, 5)} mm</b>`,
      why: 'Isı tek başına gerilme yaratmaz; uzama ENGELLENİRSE yaratır. Bu adımda çubuk serbest, gerilmesi sıfır.' },
    { t: 'Duvar geri iter: δ_P = P·(f₁ + f₂)', st: { lab: 1, free: 1, push: 1, ghost: 1, reac: 1, fv: 1 }, cam: { t: [0.7, 4.3, 0], dist: 15.5 },
      h: (p, r) => `Gerçekte duvar orada. Saydam kırmızı: çubuğun gitmek istediği boy. Duvar çubuğu P ile bastırıp <b>${f3(r.dTf)} mm</b> geri iter. P iki parçayı da kısaltır; ne kadar kısaltacağı her parçanın esnekliğine bağlı: f = L/(E·A).`,
      f: (p, r) => `A₁ = π·${p.d1}²/4 = ${f1(r.A1)} mm² ;  A₂ = π·${p.d2}²/4 = ${f1(r.A2)} mm²<br>f₁ = ${p.L1} / (${fmt(p.E1 * 1000, 0)} · ${f1(r.A1)}) = ${sci(r.f1)} mm/N<br>f₂ = ${p.L2} / (${fmt(p.E2 * 1000, 0)} · ${f1(r.A2)}) = ${sci(r.f2)} mm/N<br>δ<sub>P</sub> = P·(f₁ + f₂) = ${sci(r.f1 + r.f2, 4)} · P`,
      why: 'E\'yi GPa\'dan N/mm²\'ye çevir: 200 GPa = 200 000 N/mm². Uzunluk mm, alan mm² olunca δ mm çıkar.' },
    { t: 'Uygunluk: δ_P = δ_T → P', st: { lab: 1, free: 1, push: 1, ghost: 0.5, reac: 1, val: 1, colr: 1 },
      h: () => 'Duvar çubuğu tam başladığı boya döndürür: P\'nin kısalttığı miktar, ısının uzattığı miktara eşit. Bu tek denklem P\'yi verir. Çubuğun tamamı basıda (mavi).',
      f: (p, r) => `${sci(r.f1 + r.f2, 4)} · P = ${fmt(r.dTf, 5)}<br>P = δ<sub>T</sub> / (f₁ + f₂) = <b>${fmt(r.P, 0)} N ≈ ${f1(r.PkN)} kN</b> (bası)`,
      why: 'Aynı şey işaretli yazımla: toplam boy değişimi = (δ₁ − P·f₁) + (δ₂ − P·f₂) = 0. Açınca yine P = δ_T/(f₁+f₂).' },
    { t: 'Gerilmeler: aynı P, farklı alan', st: { lab: 1, free: 1, push: 1, reac: 1, val: 1, colr: 1, sv: 1 },
      h: (p, r) => `Parçalar seri bağlı: çeliğin her kesitinde de ${p.m2}ın her kesitinde de <b>aynı P</b> var. Ama ${p.m2}ın alanı çeliğinkinin ${f2(r.ratio)} katı; çeliğin gerilmesi ${f2(r.ratio)} kat büyük. Rengin koyuluğu gerilmenin büyüklüğünü gösteriyor: ince çelik daha koyu mavi.`,
      f: (p, r) => `σ<sub>çelik</sub> = −P/A₁ = −${fmt(r.P, 0)} / ${f1(r.A1)} = <b>${f2(r.s1)} MPa</b><br>σ<sub>${p.m2}</sub> = −P/A₂ = −${fmt(r.P, 0)} / ${f1(r.A2)} = <b>${f2(r.s2)} MPa</b>`,
      why: 'Gerilme kuvvetin değil, kuvvet / alanın sonucudur. Kuvveti bölmek (P/2 her parçaya) en sık hata: seri parçalarda kuvvet bölünmez.' },
    { t: 'Sağlama: B noktası nereye kaydı?', st: { lab: 1, free: 1, push: 1, colr: 1, bv: 1 },
      h: (p, r) => `Her parçanın NET boy değişimi = ısıl uzama − P\'nin kısaltması. Çelik net <b>${r.n1 < 0 ? 'kısaldı' : 'uzadı'}</b>, ${p.m2} net <b>${r.n2 > 0 ? 'uzadı' : 'kısaldı'}</b>; ikisi birbirini tam götürür, toplam 0. B noktası ${f3(Math.abs(r.uB))} mm <b>${r.uB > 0 ? 'yukarı (A\'ya doğru)' : 'aşağı'}</b> kaydı: ${p.m2} çeliği yukarı itti.`,
      f: (p, r) => `çelik: ${f4(r.d1T)} − ${fmt(r.P, 0)}·${sci(r.f1)} = ${f4(r.n1)} mm<br>${p.m2}: ${f4(r.d2T)} − ${fmt(r.P, 0)}·${sci(r.f2)} = ${f4(r.n2)} mm<br>toplam = ${f4(r.n1)} + ${f4(r.n2)} = 0 ✓`,
      why: 'Bu sağlama bir sınav sorusunda ayrıca sorulabilir ("B noktasının yer değiştirmesi"). Cevap: alt parçanın net boy değişimi kadar.' }
  ],
  scene(v, p, r) {
    const s = 0.012, Lb = p.L2 * s, Ls = p.L1 * s, H = Lb + Ls, rb = 0.66, rs = rb * p.d1 / p.d2;
    const cS = '#a9b7c5', cB = '#c9a256';
    const brass = v.add(shift(E3.cyl(rb, Lb, 40, 'y'), 0, Lb / 2, 0), { color: cB, pos: [0, 0, 0] });
    const steel = v.add(shift(E3.cyl(rs, Ls, 32, 'y'), 0, Ls / 2, 0), { color: cS, pos: [0, Lb, 0] });
    const gB = v.add(shift(E3.cyl(rb + 0.04, Lb, 40, 'y'), 0, Lb / 2, 0), { color: C.red, alpha: 0, edge: 0, pos: [0, 0, 0], bias: -1 });
    const gS = v.add(shift(E3.cyl(rs + 0.04, Ls, 32, 'y'), 0, Ls / 2, 0), { color: C.red, alpha: 0, edge: 0, pos: [0, Lb, 0], bias: -1 });
    const top = v.add(E3.box(2.8, 0.35, 2), { color: '#2a323c', pos: [0, H + 0.175, 0], bias: 0.5 });
    v.add(E3.box(2.8, 0.35, 2), { color: '#2a323c', pos: [0, -0.175, 0], bias: 0.5 });
    const def = { dim: 0, lab: 0, mat: 0, reac: 0, q: 0, free: 0, push: 0, top: 1, tv: 0, ghost: 0, fv: 0, val: 0, colr: 0, sv: 0, bv: 0 };
    const smax = Math.max(Math.abs(r.s1), Math.abs(r.s2)) || 1;
    return {
      def, apply(S, time, v) {
        const g = 7 * S.ex;
        const e1 = (S.free * r.d1T - S.push * r.P * r.f1) * g, e2 = (S.free * r.d2T - S.push * r.P * r.f2) * g;
        const yB = Lb + e2, yT = yB + Ls + e1;
        brass.scl = [1, yB / Lb, 1]; steel.pos = [0, yB, 0]; steel.scl = [1, (Ls + e1) / Ls, 1];
        const gb = Lb + r.d2T * g, gs = Ls + r.d1T * g;
        gB.scl = [1, gb / Lb, 1]; gS.pos = [0, gb, 0]; gS.scl = [1, gs / Ls, 1];
        gB.alpha = gS.alpha = S.ghost * 0.28;
        top.alpha = S.top;
        steel.color = mixHex(cS, C.comp, S.colr * S.push * Math.abs(r.s1) / smax);
        brass.color = mixHex(cB, C.comp, S.colr * S.push * Math.abs(r.s2) / smax);
        const O = v.ov, xr = rb + 0.35;
        O.push({ k: 'hatch', a: [-1.4, H + 0.35, 0], b: [1.4, H + 0.35, 0], n: [0.25, 0.3, 0], color: C.mute, alpha: S.top });
        O.push({ k: 'hatch', a: [-1.4, -0.35, 0], b: [1.4, -0.35, 0], n: [0.25, -0.3, 0], color: C.mute });
        if (S.lab > 0.01) [['A', rs + 0.3, yT - 0.3], ['B', rb + 0.3, yB + 0.3], ['C', rb + 0.3, 0.3]].forEach(([t, x, y]) => O.push({ k: 'text', t, p: [x, y, 0.3], size: 15, alpha: S.lab }));
        O.push({ k: 'dim', a: [-0.7, Lb, 0], b: [-0.7, H, 0], off: [-0.9, 0, 0], t: `${p.L1} mm`, tdx: -30, tdy: 0, alpha: S.dim });
        O.push({ k: 'dim', a: [-0.7, 0, 0], b: [-0.7, Lb, 0], off: [-0.9, 0, 0], t: `${p.L2} mm`, tdx: -30, tdy: 0, alpha: S.dim });
        if (S.mat > 0.01) {
          O.push({ k: 'text', t: `çelik, Ø${p.d1} mm\nE = ${p.E1} GPa, α = ${(p.a1 * 1e6).toLocaleString('tr-TR')}·10⁻⁶`, p: [xr + 0.3, Lb + Ls / 2, 0], size: 13, box: 1, align: 'left', alpha: S.mat });
          O.push({ k: 'text', t: `${p.m2}, Ø${p.d2} mm\nE = ${p.E2} GPa, α = ${(p.a2 * 1e6).toLocaleString('tr-TR')}·10⁻⁶`, p: [xr + 0.3, Lb / 2, 0], size: 13, box: 1, align: 'left', alpha: S.mat });
          O.push({ k: 'text', t: `ΔT = +${p.dT} °C`, p: [0, H + 1.0, 0], color: C.red, size: 15, box: 1, alpha: S.mat });
        }
        if (S.reac > 0.01) {
          const lab = S.val > 0.5 ? `P = ${f1(r.PkN)} kN` : S.q > 0.5 ? 'R_A = ?' : 'P = ?';
          O.push({ k: 'arrow', a: [-1.25, H + 1.1, 0.6], b: [-1.25, H - 0.1, 0.6], color: C.white, w: 2.6, label: lab, lp: [-1.6, H + 0.6, 0.6], align: 'right', alpha: S.reac });
          O.push({ k: 'arrow', a: [-1.25, -1.1, 0.6], b: [-1.25, 0.1, 0.6], color: C.white, w: 2.6, label: S.val > 0.5 ? `P = ${f1(r.PkN)} kN` : S.q > 0.5 ? 'R_C = ?' : 'P = ?', lp: [-1.6, -0.6, 0.6], align: 'right', alpha: S.reac });
        }
        if (S.q > 0.01) O.push({ k: 'text', t: 'denge: R_A = R_C\nama kaç? bilinmiyor', p: [xr + 0.3, Lb + Ls * 0.6, 0], color: C.red, size: 15, box: 1, align: 'left', alpha: S.q });
        if (S.tv > 0.01) {
          O.push({ k: 'text', t: `çelik +${f3(r.d1T)} mm`, p: [xr + 0.3, Lb + e2 + (Ls + e1) / 2, 0], color: C.red, size: 14, box: 1, align: 'left', alpha: S.tv });
          O.push({ k: 'text', t: `${p.m2} +${f3(r.d2T)} mm`, p: [xr + 0.3, yB / 2, 0], color: C.red, size: 14, box: 1, align: 'left', alpha: S.tv });
          O.push({ k: 'line', p: [[-1.4, H, 0], [0.5, H, 0]], color: C.mute, w: 1.5, dash: [5, 5], alpha: S.tv });
          O.push({ k: 'dim', a: [-0.5, H, 0], b: [-0.5, yT, 0], off: [-0.7, 0, 0], t: `δ_T = ${f3(r.dTf)} mm`, tdx: -50, tdy: 0, color: C.red, alpha: S.tv });
          O.push({ k: 'text', t: 'üst duvar yokmuş gibi düşün', p: [0, yT + 1.0, 0], color: C.mute, size: 14, alpha: S.tv });
        }
        if (S.ghost > 0.01) O.push({ k: 'text', t: `gitmek istediği boy: +${f3(r.dTf)} mm`, p: [0, H + r.dTf * g + 0.75, 0], color: C.red, size: 14, box: 1, alpha: S.ghost });
        if (S.fv > 0.01) {
          O.push({ k: 'text', t: `f₁ = ${(r.f1 * 1e6).toLocaleString('tr-TR', { maximumFractionDigits: 3 })}·10⁻⁶ mm/N`, p: [xr + 0.3, Lb + Ls / 2, 0], size: 14, box: 1, align: 'left', alpha: S.fv });
          O.push({ k: 'text', t: `f₂ = ${(r.f2 * 1e6).toLocaleString('tr-TR', { maximumFractionDigits: 3 })}·10⁻⁶ mm/N`, p: [xr + 0.3, Lb / 2, 0], size: 14, box: 1, align: 'left', alpha: S.fv });
        }
        if (S.sv > 0.01) {
          O.push({ k: 'text', t: `σ = ${f1(r.s1)} MPa\nA₁ = ${fmt(r.A1, 0)} mm²`, p: [xr + 0.3, Lb + Ls / 2, 0], color: C.comp, size: 14, box: 1, align: 'left', alpha: S.sv });
          O.push({ k: 'text', t: `σ = ${f1(r.s2)} MPa\nA₂ = ${fmt(r.A2, 0)} mm²`, p: [xr + 0.3, Lb / 2, 0], color: C.comp, size: 14, box: 1, align: 'left', alpha: S.sv });
          O.push({ k: 'ring', c: [0, yB + Ls * 0.55, 0], r: rs, u: [1, 0, 0], v: [0, 0, 1], color: C.white, w: 2, alpha: S.sv });
          O.push({ k: 'ring', c: [0, Lb * 0.55, 0], r: rb, u: [1, 0, 0], v: [0, 0, 1], color: C.white, w: 2, alpha: S.sv });
        }
        if (S.bv > 0.01) {
          O.push({ k: 'line', p: [[-1.3, Lb, 0], [1.3, Lb, 0]], color: C.mute, w: 1.5, dash: [5, 5], alpha: S.bv });
          O.push({ k: 'text', t: 'B\'nin ilk yeri', p: [-1.4, Lb - 0.35, 0], color: C.mute, size: 13, align: 'right', alpha: S.bv });
          O.push({ k: 'arrow', a: [rb + 0.2, Lb, 0], b: [rb + 0.2, yB, 0], color: C.red, w: 2.6, alpha: S.bv * (Math.abs(yB - Lb) > 0.1 ? 1 : 0) });
          O.push({ k: 'text', t: `B ${f3(Math.abs(r.uB))} mm ${r.uB > 0 ? 'yukarı' : 'aşağı'}`, p: [xr + 0.5, yB - 0.5, 0], color: C.red, size: 14, box: 1, align: 'left', alpha: S.bv });
          O.push({ k: 'text', t: `çelik net ${f3(r.n1)} mm`, p: [xr + 0.3, yB + Ls * 0.6, 0], color: C.comp, size: 14, box: 1, align: 'left', alpha: S.bv });
          O.push({ k: 'text', t: `${p.m2} net +${f3(r.n2)} mm`, p: [xr + 0.3, Lb * 0.4, 0], color: C.comp, size: 14, box: 1, align: 'left', alpha: S.bv });
        }
      }
    };
  },
  whatif: {
    not: 'Çelik çapını büyüt: çelik sertleşir, duvar kuvveti P büyür ama çeliğin gerilmesi küçülür. Sıcaklığı ikiye katla: her şey tam ikiye katlanır (doğrusal).',
    s: [{ k: 'dT', ad: 'Sıcaklık artışı ΔT', min: 0, max: 120, step: 5, u: '°C' },
      { k: 'd1', ad: 'Çelik çapı d₁', min: 15, max: 60, step: 1, u: 'mm' },
      { k: 'd2', ad: 'Pirinç çapı d₂', min: 25, max: 90, step: 1, u: 'mm' }],
    out: (p, r) => `<div class="mets"><div class="m blue"><small>P (bası)</small><b>${f1(r.PkN)} kN</b></div><div class="m blue"><small>σ çelik</small><b>${f1(r.s1)} MPa</b></div><div class="m blue"><small>σ pirinç</small><b>${f1(r.s2)} MPa</b></div><div class="m"><small>B kayması</small><b>${f3(r.uB)} mm</b></div></div>
      <p class="note">Gerilme oranı σ<sub>çelik</sub> / σ<sub>pirinç</sub> = ${f2(r.s1 / r.s2)} = A₂ / A₁ = (d₂/d₁)². ${r.s1a > 250 ? '<b>Çelik 250 MPa\'yı aşıyor</b>: sıradan yapı çeliği akmaya başlardı.' : 'Kuvvet aynı olduğu için oran yalnızca alanlara bağlı.'}</p>`
  },
  kagit: (p, r) => `Dış yük yok → R_A = R_C = P (bası) ; tek denge denklemi yetmez
Uygunluk: toplam boy değişimi = 0  →  δ_P = δ_T
δ_T = α₁ΔTL₁ + α₂ΔTL₂ = (${(p.a1 * 1e6).toLocaleString('tr-TR')}·10⁻⁶·${p.L1} + ${(p.a2 * 1e6).toLocaleString('tr-TR')}·10⁻⁶·${p.L2})·${p.dT} = ${fmt(r.dTf, 5)} mm
A₁ = π·${p.d1}²/4 = ${f1(r.A1)} mm²   A₂ = π·${p.d2}²/4 = ${f1(r.A2)} mm²
δ_P = P·L₁/(A₁E₁) + P·L₂/(A₂E₂)
    = P·(${(r.f1 * 1e6).toLocaleString('tr-TR', { maximumFractionDigits: 4 })} + ${(r.f2 * 1e6).toLocaleString('tr-TR', { maximumFractionDigits: 4 })})·10⁻⁶ = ${(r.f1 * 1e6 + r.f2 * 1e6).toLocaleString('tr-TR', { maximumFractionDigits: 4 })}·10⁻⁶·P
P = ${fmt(r.dTf, 5)} / ${(r.f1 * 1e6 + r.f2 * 1e6).toLocaleString('tr-TR', { maximumFractionDigits: 4 })}·10⁻⁶ = ${fmt(r.P, 0)} N ≈ ${f1(r.PkN)} kN (bası)
σ_çelik = −P/A₁ = ${f2(r.s1)} MPa
σ_${p.m2} = −P/A₂ = ${f2(r.s2)} MPa
Kontrol: (${f4(r.d1T)} − P·f₁) + (${f4(r.d2T)} − P·f₂) = ${f4(r.n1)} + ${f4(r.n2)} = 0 ✓`,
  tuzak: ['<b>E\'yi GPa olarak bırakmak.</b> 200 GPa = 200 000 N/mm². GPa\'yı olduğu gibi koyarsan P bin kat büyük çıkar.',
    '<b>Çapı alan yerine kullanmak.</b> A = π·d²/4: 30 mm çap → 706,9 mm². Yarıçapla π·r² de aynı sonucu verir; π·d² vermez.',
    '<b>Tek α kullanmak.</b> Çelik ve pirinç farklı uzar: her parçanın ısıl uzaması kendi α ve L\'siyle.',
    '<b>Kuvveti parçalara bölmek.</b> Seri bağlı parçalarda kuvvet bölünmez; ikisinde de aynı P.',
    '<b>Ara sonuçları erken yuvarlamak.</b> δ_T = 0,45975 mm; 0,459 alırsan P = 142,4 kN çıkar, doğrusu 142,6 kN. Fark küçük ama ondalığı kesmek yerine 3–4 anlamlı basamak tut.',
    '<b>Gerilmenin işaretini unutmak.</b> İki parça da basıda: σ eksi. "Bası kuvveti ve gerilmeler" sorulduğunda büyüklüğü yazıp "(bası)" demek de kabul.'],
  gen() {
    const m = pick([{ m2: 'pirinç', E2: 105, a2: 20.9e-6 }, { m2: 'alüminyum', E2: 70, a2: 23.6e-6 }, { m2: 'bronz', E2: 100, a2: 18e-6 }]);
    const d1 = rnd(20, 40, 5);
    return Object.assign({ dT: rnd(20, 80, 5), L1: rnd(150, 400, 25), d1, E1: 200, a1: 11.7e-6, L2: rnd(150, 400, 25), d2: d1 + rnd(10, 30, 5) }, m);
  },
  pracText: p => `İki ucu sabit dik bir çubuk: üst parça AB çelik, L₁ = ${p.L1} mm, d₁ = ${p.d1} mm, E = 200 GPa, α = 11,7·10⁻⁶ 1/°C; alt parça BC ${p.m2}, L₂ = ${p.L2} mm, d₂ = ${p.d2} mm, E = ${p.E2} GPa, α = ${(p.a2 * 1e6).toLocaleString('tr-TR')}·10⁻⁶ 1/°C. Başlangıçta gerilme yok. Sıcaklık ${p.dT} °C artınca çubuktaki bası kuvvetini ve iki parçadaki gerilmeleri bul.`,
  ans: [{ k: 'PkN', ad: 'Bası kuvveti P', u: 'kN' }, { k: 's1', ad: 'σ çelik (büyüklük)', u: 'MPa', abs: 1 }, { k: 's2', ad: 'σ ikinci parça (büyüklük)', u: 'MPa', abs: 1 }],
  hints: (p, r) => [`δ_T = (11,7·10⁻⁶·${p.L1} + ${(p.a2 * 1e6).toLocaleString('tr-TR')}·10⁻⁶·${p.L2})·${p.dT} = ${fmt(r.dTf, 5)} mm.`,
    `A = π·d²/4; f = L/(E·A), E\'yi N/mm² yaz (${p.E2} GPa = ${fmt(p.E2 * 1000, 0)} N/mm²).`,
    'P = δ_T / (f₁ + f₂). Gerilmeler: σ = P / kendi alanı.'],
  diag(p, r, u) {
    const near = (a, b) => isFinite(a) && Math.abs(Math.abs(a) - Math.abs(b)) <= Math.abs(b) * 0.02;
    if (near(u.PkN, r.PkN * 1000) || near(u.PkN, r.P)) return 'Birim: kuvveti kN olarak yaz (N\'yi 1000\'e böl). E\'yi N/mm² aldığından emin ol.';
    if (near(u.PkN, r.PkN * 4)) return 'Alanı π·d² ile bulmuşsun; π·d²/4 olmalı.';
    const PoneA = p.a1 * p.dT * (p.L1 + p.L2) / (r.f1 + r.f2) / 1000, PtwoA = p.a2 * p.dT * (p.L1 + p.L2) / (r.f1 + r.f2) / 1000;
    if (near(u.PkN, PoneA) || near(u.PkN, PtwoA)) return 'Isıl uzamada tek α kullanmışsın. Her parça kendi α\'sıyla: δ_T = α₁ΔTL₁ + α₂ΔTL₂.';
    if (near(u.s1, r.s2) || near(u.s2, r.s1)) return 'Gerilmeleri karıştırmışsın: ince çelik (küçük alan) daha büyük gerilme alır.';
    if (near(u.s1, r.s1a / 2) || near(u.s2, r.s2a / 2)) return 'Kuvveti ikiye bölmüşsün. Seri parçalarda iki parçada da aynı P vardır.';
    if (isFinite(u.s1) || isFinite(u.s2)) return 'Önce P\'yi doğru bul; sonra σ = P / A, her parça kendi alanıyla.';
    return 'Uygunluk: P·(f₁ + f₂) = δ_T. f = L/(E·A); alanlar çaptan, E N/mm² biriminde.';
  },
  hoca: `<p>Hocanın cevap anahtarı (2016–17 Yaz S3; aynı soru 2017–18 Güz vizesinde Soru 2 olarak tekrar sorulmuş, o kâğıdın anahtarı yok): δ<sub>T</sub> = 0,459 mm, δ<sub>P</sub> = (1,768 + 1,455)·10⁻⁶·P = 3,223·10⁻⁶·P, <b>P = 142 391 N</b>, <b>σ<sub>çelik</sub> = 201,44 MPa</b>, <b>σ<sub>pirinç</sub> = 72,51 MPa</b>.</p>
  <p>Bizim hesap: δ<sub>T</sub> = 0,45975 mm, f₁ + f₂ = 1,7684 + 1,4551 = 3,2235·10⁻⁶ mm/N, <b>P = 142 624 N ≈ 142,6 kN</b>, <b>σ<sub>çelik</sub> = −201,77 MPa</b>, <b>σ<sub>pirinç</sub> = −72,64 MPa</b> (ikisi de bası).</p>
  <p>Yol birebir aynı (δ<sub>P</sub> = δ<sub>T</sub>). Aradaki ‰1,6'lık fark yalnızca <b>yuvarlamadan</b>: hoca δ<sub>T</sub> = 0,45975 mm'yi 0,459'a kesmiş (0,459 / 3,2235·10⁻⁶ = 142 391 N). İki sonuç da doğru kabul edilir. Hoca gerilmeleri işaretsiz yazmış; soru "basınç kuvveti" dediği için büyüklük yeterli, istersen eksi işaretini ya da "(bası)" notunu ekle.</p>`
});
