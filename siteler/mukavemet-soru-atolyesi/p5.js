'use strict';
/* ============ PROBLEM 5 ============ */
PROBS.push({
  id: 'p5', no: 5, tip: 'hs',
  ad: 'İki plaka arasında basamaklı çubuk (+ ısı)',
  ozet: 'İki bilinmeyen reaksiyon, bir denge denklemi. Eksik denklem: "çubuğun toplam boyu değişemez".',
  soru: '1000 mm boyundaki çubuk A ve B uçlarından iki rijit plakayla sabitlenmiştir. C noktasından P = 4 kN\'luk kuvvet etkimektedir. (a) A ve B\'de doğacak reaksiyon kuvvetlerini hesaplayınız. (b) Sıcaklık 50 °C artırılırsa reaksiyon kuvvetleri ne olur, hesaplayınız.',
  verilen: ['BC (üst): L₁ = 250 mm, A₁ = 500 mm²', 'CA (alt): L₂ = 750 mm, A₂ = 250 mm²', 'E = 2·10⁵ N/mm², α = 12·10⁻⁶ 1/°C (soruda 1,2·10⁻⁶ yazıyor; yazım hatası)', 'C\'de P = 4 kN (aşağı); (b)\'de ΔT = +50 °C'],
  istenen: '(a) R<sub>A</sub>, R<sub>B</sub> ; (b) ısınınca R<sub>A</sub>, R<sub>B</sub>',
  p0: { P: 4, L1: 250, A1: 500, L2: 750, A2: 250, E: 200000, a: 12e-6, dT: 50 },
  solve(p) {
    const f1 = p.L1 / (p.E * p.A1), f2 = p.L2 / (p.E * p.A2), F = p.P * 1000, dTf = p.a * p.dT * (p.L1 + p.L2);
    const RBa = F * f2 / (f1 + f2), RAa = F - RBa, RB = (F * f2 - dTf) / (f1 + f2), RA = F - RB;
    const RT = dTf / (f1 + f2);
    return { f1, f2, F, dTf, RBa, RAa, RB, RA, RT, N1a: RBa, N2a: RBa - F, N1: RB, N2: RB - F,
      s1a: RBa / p.A1, s2a: (RBa - F) / p.A2, s1: RB / p.A1, s2: (RB - F) / p.A2, gapP: F * f2,
      chk: RB * f1 + (RB - F) * f2 + dTf };
  },
  anlam: [
    ['iki rijit plakayla sabitlenmiştir', 'Çubuğun iki ucu da tutulu: <b>iki bilinmeyen</b> reaksiyon (R<sub>A</sub>, R<sub>B</sub>).'],
    ['C noktasından P', 'Düşeyde tek denge denklemi var: R<sub>A</sub> + R<sub>B</sub> = P. <b>Yetmez</b> → hiperstatik.'],
    ['plakalar rijit', 'Plakalar oynamaz: çubuğun <b>toplam boyu değişemez</b>. Eksik denklem bu.'],
    ['A₁, A₂, L₁, L₂, E', 'Her parçanın ne kadar "yumuşak" olduğunu bulmak için: f = L / (E·A).'],
    ['sıcaklık 50 °C artırılırsa', 'Çubuk uzamak ister (α·ΔT·L) ama plakalar izin vermez: ek <b>bası</b> kuvveti doğar.']
  ],
  tetik: ['iki ucundan sabitlenmiş', 'rijit plakalar', 'reaksiyon kuvvetleri', 'sıcaklık artırılırsa'],
  tetikNot: 'Bilinmeyen sayısı > denge denklemi sayısı ise "hiperstatik". Bunu gördüğün an, ikinci denklemi geometriden (boy değişimi) arayacaksın.',
  zincir: [["Kaç bilinmeyen var?", "R_A ve R_B. Düşeyde tek denklem: <b>hiperstatik</b>."], ["İkinci denklem nereden?", "Plakalar oynamıyor: çubuğun <b>toplam boyu değişmez</b>."], ["Boy değişimini nasıl yazarım?", "Her parça: δ = N·L/(EA), ısı varsa + α·ΔT·L."], ["N'leri nasıl bulurum?", "Kesim: üst parçada N₁ = R_B, alt parçada N₂ = R_B − P."], ["Isı gelince?", "Aynı denkleme +α·ΔT·L ekle. Eksi çıkan reaksiyon sadece yön değiştirmiş demek."]],
  cam: { yaw: -0.5, pitch: 0.12, dist: 17.5, t: [0.4, 4.1, 0] },
  steps: [
    { t: 'Şekle bak', st: { dim: 1, load: 1, lab: 1 },
      h: () => 'Dik bir çubuk. Üstte B plakası, altta A plakası. Üst parça (BC) kalın ve kısa, alt parça (CA) ince ve uzun. Yük C\'de, iki parçanın birleştiği yerde, aşağı.' },
    { t: 'Neden hiperstatik?', st: { load: 1, lab: 1, reac: 1, q: 1 },
      h: () => 'Bilinmeyenler: R<sub>A</sub> ve R<sub>B</sub>. Denge: R<sub>A</sub> + R<sub>B</sub> = P. Bir denklem, iki bilinmeyen. Statik tek başına çözemez.',
      f: () => 'R<sub>A</sub> + R<sub>B</sub> = P   (tek denklem)',
      why: 'Moment denklemi işe yaramıyor: bütün kuvvetler aynı doğru üzerinde. Yatay denklem de boş. Geriye tek düşey denklem kalıyor.' },
    { t: 'Eksik denklem: üst plakayı kaldır, ne olur?', st: { load: 1, lab: 1, gap: 1, top: 0.15 },
      h: (p, r) => `Üst plaka olmasaydı P, alt parçayı (CA) sıkıştırırdı. C ve çubuğun üst ucu aşağı inerdi: bir <b>boşluk</b> açılırdı. Ama plaka var, boşluk açılamaz. Demek ki plaka çubuğu R<sub>B</sub> ile yukarı çekip bu boşluğu kapatıyor.`,
      f: (p, r) => `boşluk = P · f₂ = ${fmt(r.F, 0)} · ${sci(r.f2)} = ${f4(r.gapP)} mm`,
      why: 'Bu "süperpozisyon" yolu: önce bir mesnedi kaldır, açılan boşluğu bul; sonra kaldırdığın reaksiyonun bu boşluğu kapatması gerektiğini yaz. Hiperstatik sorularda en kolay düşünme yolu bu.' },
    { t: 'Her parça ne kadar yumuşak? f = L/(EA)', st: { load: 1, lab: 1, fv: 1 },
      h: () => 'f: 1 N kuvvette parçanın kaç mm uzadığı. Uzun parça yumuşak, kalın parça sert.',
      f: (p, r) => `f₁ = ${p.L1} / (${sci(p.E, 0)} · ${p.A1}) = ${sci(r.f1)} mm/N<br>f₂ = ${p.L2} / (${sci(p.E, 0)} · ${p.A2}) = ${sci(r.f2)} mm/N` },
    { t: '(a) R_B boşluğu kapatır', st: { load: 1, lab: 1, reac: 1, val: 1, colr: 1 },
      h: (p, r) => `R<sub>B</sub> çubuğun tamamını (iki parça seri) uzatarak boşluğu kapatır: R<sub>B</sub> · (f₁ + f₂) = boşluk. Kırmızı: çekme (BC), mavi: bası (CA).`,
      f: (p, r) => `R<sub>B</sub> = P·f₂ / (f₁ + f₂) = ${fmt(r.F, 0)} · ${sci(r.f2)} / ${sci(r.f1 + r.f2)} = <b>${f1(r.RBa)} N</b><br>R<sub>A</sub> = P − R<sub>B</sub> = <b>${f1(r.RAa)} N</b> (ikisi de yukarı)`,
      why: 'PDF\'deki yol da aynı yere çıkar: N₁ = R_B, N₂ = R_B − P yaz, N₁f₁ + N₂f₂ = 0 de. Bu denklemi açınca R_B(f₁+f₂) = P·f₂ olur.' },
    { t: '(a) Sağlama: toplam boy değişimi 0', st: { load: 1, lab: 1, reac: 1, val: 1, colr: 1, nv: 1 },
      h: () => 'Üst parça uzadı, alt parça kısaldı; ikisi birbirini tam götürmeli.',
      f: (p, r) => `δ = N₁f₁ + N₂f₂ = ${f1(r.N1a)} · ${sci(r.f1)} + (${f1(r.N2a)}) · ${sci(r.f2)} = ${f4(r.N1a * r.f1)} − ${f4(-r.N2a * r.f2)} = 0 ✓<br>σ₁ = ${f2(r.s1a)} MPa, σ₂ = ${f2(r.s2a)} MPa` },
    { t: '(b) Isınınca serbest uzama', st: { lab: 1, th: 1, ghost: 1, load: 0.3 },
      h: (p, r) => `Plakalar olmasaydı çubuk ${p.dT} °C ısınınca uzardı. Saydam kırmızı çubuk: serbest uzamış hali (çok abartılı çizildi). Üst ucu plakanın içine girerdi; plaka buna izin vermez, çubuğu geri iter.`,
      f: (p, r) => `δ<sub>T</sub> = α · ΔT · L = ${sci(p.a)} · ${p.dT} · ${p.L1 + p.L2} = <b>${f3(r.dTf)} mm</b>`,
      why: 'Isı tek başına gerilme yaratmaz; uzama ENGELLENİRSE yaratır. Serbest çubuk ısınınca rahatça uzar, gerilmesiz kalır.' },
    { t: '(b) Plakalar geri iter', st: { lab: 1, th: 1, reac: 1, val: 1, colr: 1, load: 1 },
      h: (p, r) => `Aynı uygunluk denklemine ısı terimi eklenir. R<sub>B</sub> eksi çıkıyor: plaka artık çubuğu <b>aşağı itiyor</b>. Çubuğun tamamı basıda (iki parça da mavi).`,
      f: (p, r) => `R<sub>B</sub> = (P·f₂ − δ<sub>T</sub>) / (f₁+f₂) = (${f4(r.gapP)} − ${f3(r.dTf)}) / ${sci(r.f1 + r.f2)} = <b>${fmt(r.RB, 0)} N</b><br>R<sub>A</sub> = P − R<sub>B</sub> = <b>${fmt(r.RA, 0)} N</b><br>σ₁ = ${f1(r.s1)} MPa, σ₂ = ${f1(r.s2)} MPa<br>Isıdan doğan bası: R<sub>T</sub> = δ<sub>T</sub> / (f₁+f₂) = ${fmt(r.RT, 0)} N`,
      why: 'Isıdan doğan bası kuvveti R_T = δ_T/(f₁+f₂), yükten doğan R_B değerini aşarsa R_B yön değiştirir: R_B = P·f₂/(f₁+f₂) − R_T.' }
  ],
  scene(v, p, r) {
    const s = 0.008, H = (p.L1 + p.L2) * s, yC = p.L2 * s, w1 = 0.9, w2 = 0.62;
    const segA = v.add(shift(E3.box(w2, yC, w2), 0, yC / 2, 0), { color: C.steel, pos: [0, 0, 0] });
    const segB = v.add(shift(E3.box(w1, H - yC, w1), 0, (H - yC) / 2, 0), { color: C.steel, pos: [0, yC, 0] });
    const ghostA = v.add(shift(E3.box(w2 + 0.04, yC, w2 + 0.04), 0, yC / 2, 0), { color: C.red, alpha: 0, pos: [0, 0, 0], edge: 0, bias: -1 });
    const ghostB = v.add(shift(E3.box(w1 + 0.04, H - yC, w1 + 0.04), 0, (H - yC) / 2, 0), { color: C.red, alpha: 0, pos: [0, yC, 0], edge: 0, bias: -1 });
    const top = v.add(E3.box(3.4, 0.35, 2.2), { color: '#2a323c', pos: [0, H + 0.175, 0], bias: 0.5 });
    v.add(E3.box(3.4, 0.35, 2.2), { color: '#2a323c', pos: [0, -0.175, 0], bias: 0.5 });
    const def = { dim: 0, load: 1, lab: 0, reac: 0, q: 0, gap: 0, top: 1, fv: 0, val: 0, colr: 0, nv: 0, th: 0, ghost: 0 };
    return {
      def, apply(S, time, v) {
        const g = 1.6 * S.ex, th = S.th;
        // gerçek boy değişimleri (mm) → abartılı birim
        const N1 = r.N1a + (r.N1 - r.N1a) * th, N2 = r.N2a + (r.N2 - r.N2a) * th;
        const dA = (N2 * r.f2 + p.a * p.dT * p.L2 * th) * g * S.colr, gapv = -r.gapP * g * 6 * S.gap;
        const yc = yC + dA + gapv;
        segA.scl = [1, yc / yC, 1]; segB.pos = [0, yc, 0];
        segB.scl = [1, S.gap > 0.01 ? 1 : (H - yc) / (H - yC), 1];
        top.alpha = S.top;
        const cA = N2 > 0 ? C.tens : C.comp, cB = N1 > 0 ? C.tens : C.comp;
        segA.color = mixHex(C.steel, cA, S.colr * Math.min(1, Math.abs(N2) / 300));
        segB.color = mixHex(C.steel, cB, S.colr * Math.min(1, Math.abs(N1) / 300));
        const gs = (H + r.dTf * g * S.ghost) / H;
        ghostA.alpha = ghostB.alpha = S.ghost * 0.3; ghostA.scl = ghostB.scl = [1, gs, 1]; ghostB.pos = [0, yC * gs, 0];
        const O = v.ov, yTop = S.gap > 0.01 ? H + gapv : H;
        O.push({ k: 'hatch', a: [-1.7, H + 0.35, 0], b: [1.7, H + 0.35, 0], n: [0.25, 0.3, 0], color: C.mute, alpha: S.top });
        O.push({ k: 'hatch', a: [-1.7, -0.35, 0], b: [1.7, -0.35, 0], n: [0.25, -0.3, 0], color: C.mute });
        O.push({ k: 'arrow', a: [0.95, yc + 1.4, 0], b: [0.95, yc + 0.08, 0], color: C.red, w: 3, label: `P = ${f2(p.P)} kN`, lp: [2.2, yc + 0.9 - 1.7 * Math.max(S.fv, S.nv), 0], alpha: S.load });
        O.push({ k: 'line', p: [[w2 / 2, yc, 0], [0.95, yc, 0]], color: C.red, w: 2, alpha: S.load });
        if (S.lab > 0.01) [['B', -0.9, H + 0.7], ['C', -0.75, yc], ['A', -0.9, -0.7], ['A₁', 0, yC + (H - yC) / 2], ['A₂', 0, yC / 2]].forEach(([t, x, y]) => O.push({ k: 'text', t, p: [x, y, w1 / 2 + 0.05], size: 15, alpha: S.lab }));
        O.push({ k: 'dim', a: [-0.5, yC, 0], b: [-0.5, H, 0], off: [-1.2, 0, 0], t: `${p.L1} mm`, tdx: -30, tdy: 0, alpha: S.dim });
        O.push({ k: 'dim', a: [-0.5, 0, 0], b: [-0.5, yC, 0], off: [-1.2, 0, 0], t: `${p.L2} mm`, tdx: -30, tdy: 0, alpha: S.dim });
        if (S.reac > 0.01) {
          const RB = S.val > 0.5 ? (th > 0.5 ? r.RB : r.RBa) : null, RA = S.val > 0.5 ? (th > 0.5 ? r.RA : r.RAa) : null;
          const up = RB == null || RB >= 0;
          O.push({ k: 'arrow', a: [-1.4, up ? H - 1.2 : H + 0.3, 0.6], b: [-1.4, up ? H + 0.2 : H - 1.3, 0.6], color: C.white, w: 2.6, label: RB == null ? 'R_B = ?' : `R_B = ${fmt(RB, 0)} N`, lp: [-1.8, H - 0.5, 0.6], align: 'right', alpha: S.reac });
          O.push({ k: 'arrow', a: [-1.4, -1.5, 0.6], b: [-1.4, -0.1, 0.6], color: C.white, w: 2.6, label: RA == null ? 'R_A = ?' : `R_A = ${fmt(RA, 0)} N`, lp: [-1.8, -1.0, 0.6], align: 'right', alpha: S.reac });
        }
        if (S.gap > 0.01) {
          O.push({ k: 'dim', a: [0.5, yTop, 0], b: [0.5, H, 0], off: [0.9, 0, 0], t: `boşluk P·f₂`, tdx: 46, tdy: 0, color: C.red, alpha: S.gap });
          O.push({ k: 'text', t: 'Üst plaka yokmuş gibi düşün', p: [0, H + 1.4, 0], color: C.mute, size: 14, alpha: S.gap });
        }
        if (S.fv > 0.01) {
          O.push({ k: 'text', t: `f₁ = ${(r.f1 * 1e6).toLocaleString('tr-TR')}·10⁻⁶ mm/N\nkısa + kalın → sert`, p: [1.5, yC + (H - yC) / 2, 0], size: 14, box: 1, align: 'left', alpha: S.fv });
          O.push({ k: 'text', t: `f₂ = ${(r.f2 * 1e6).toLocaleString('tr-TR')}·10⁻⁶ mm/N\nuzun + ince → yumuşak`, p: [1.5, yC / 2, 0], size: 14, box: 1, align: 'left', alpha: S.fv });
        }
        if (S.nv > 0.01) {
          O.push({ k: 'text', t: `N₁ = +${fmt(r.N1a, 0)} N (çekme)`, p: [1.5, yC + 1, 0], color: C.tens, size: 14, box: 1, align: 'left', alpha: S.nv });
          O.push({ k: 'text', t: `N₂ = ${fmt(r.N2a, 0)} N (bası)`, p: [1.5, yC / 2, 0], color: C.comp, size: 14, box: 1, align: 'left', alpha: S.nv });
        }
        if (S.ghost > 0.01) O.push({ k: 'text', t: `serbest olsaydı +${f2(r.dTf)} mm uzardı`, p: [0, H + r.dTf * g + 0.9, 0], color: C.red, size: 14, box: 1, alpha: S.ghost });
        if (S.q > 0.01) O.push({ k: 'text', t: '2 bilinmeyen, 1 denklem', p: [1.3, H / 2, 0], color: C.red, size: 16, box: 1, align: 'left', alpha: S.q });
      }
    };
  },
  whatif: {
    not: 'Sıcaklığı yavaşça artır: R_B önce küçülür, sıfırdan geçer ve yön değiştirir. Hangi ΔT\'de sıfır olduğuna bak.',
    s: [{ k: 'dT', ad: 'Sıcaklık artışı ΔT', min: 0, max: 80, step: 1, u: '°C' }, { k: 'P', ad: 'Yük P', min: 0, max: 20, step: 0.5, u: 'kN' }, { k: 'A2', ad: 'Alt kesit A₂', min: 100, max: 1000, step: 10, u: 'mm²' }],
    out: (p, r) => {
      const dT0 = r.F * r.f2 / (p.a * (p.L1 + p.L2));
      return `<div class="mets"><div class="m ${r.RB < 0 ? 'blue' : ''}"><small>R_B</small><b>${fmt(r.RB, 0)} N</b></div><div class="m"><small>R_A</small><b>${fmt(r.RA, 0)} N</b></div><div class="m ${r.s1 < 0 ? 'blue' : 'red'}"><small>σ₁ (üst)</small><b>${f1(r.s1)} MPa</b></div><div class="m ${r.s2 < 0 ? 'blue' : 'red'}"><small>σ₂ (alt)</small><b>${f1(r.s2)} MPa</b></div></div>
      <p class="note">R_B yön değiştirdi mi? ${r.RB < 0 ? '<b>Evet</b>: plaka çubuğu aşağı itiyor.' : 'Hayır: plaka çubuğu hâlâ yukarı çekiyor.'} R_B = 0 olduğu sıcaklık ≈ <b>${f1(dT0)} °C</b>.</p>`;
    }
  },
  kagit: (p, r) => `Denge: R_A + R_B = P = ${fmt(r.F, 0)} N   (2 bilinmeyen → hiperstatik)
Kesim: N₁ = R_B (BC),  N₂ = R_B − P (CA)
f₁ = L₁/(EA₁) = ${p.L1}/(${p.E}·${p.A1}) = ${(r.f1 * 1e6).toLocaleString('tr-TR')}·10⁻⁶ mm/N
f₂ = L₂/(EA₂) = ${p.L2}/(${p.E}·${p.A2}) = ${(r.f2 * 1e6).toLocaleString('tr-TR')}·10⁻⁶ mm/N
Uygunluk: N₁f₁ + N₂f₂ + αΔT·L = 0
(a) ΔT = 0:  R_B = P·f₂/(f₁+f₂) = ${f1(r.RBa)} N ↑   R_A = ${f1(r.RAa)} N ↑
(b) δ_T = αΔTL = ${sci(p.a).replace(/<\/?sup>/g, '')}·${p.dT}·${p.L1 + p.L2} = ${f3(r.dTf)} mm
    R_B = (P·f₂ − δ_T)/(f₁+f₂) = ${fmt(r.RB, 0)} N  (eksi → aşağı)
    R_A = P − R_B = ${fmt(r.RA, 0)} N ↑
Kontrol: ${fmt(r.RB, 0)}·f₁ + (${fmt(r.RB - r.F, 0)})·f₂ + ${f3(r.dTf)} ≈ 0 ✓`,
  tuzak: ['<b>Tek parça gibi hesaplamak.</b> İki parçanın L\'si ve A\'sı farklı; δ\'yi ayrı ayrı yaz, topla.',
    '<b>İşareti kaybetmek.</b> Çekmeyi +, basıyı − al. N₂ = R_B − P, eksi çıkar (bası).',
    '<b>Eksi reaksiyonu "yanlış" sanmak.</b> Eksi sadece "tahmin ettiğin yönün tersi" demek.',
    '<b>α\'daki yazım hatası.</b> Soruda 1,2·10⁻⁶ yazıyor; çeliğin α\'sı 12·10⁻⁶. Sınavda verileni kullan, şüphen varsa yanına not düş.',
    '<b>Isı teriminde L.</b> Toplam boy 1000 mm, her parçaya ayrı ayrı da yazabilirsin (aynı α ise toplam aynı).'],
  gen() { const L1 = rnd(150, 500, 50); return { P: rnd(2, 12, 1), L1, A1: rnd(300, 800, 50), L2: 1000 - L1, A2: rnd(150, 500, 50), E: 200000, a: 12e-6, dT: rnd(20, 80, 5) }; },
  pracText: p => `${p.L1 + p.L2} mm'lik basamaklı çelik çubuk iki rijit plaka arasında. Üst parça: ${p.L1} mm, ${p.A1} mm²; alt parça: ${p.L2} mm, ${p.A2} mm². E = 2·10⁵ MPa, α = 12·10⁻⁶ 1/°C. Birleşim noktasında ${f2(p.P)} kN aşağı yük var. (a) Reaksiyonları bul. (b) ${p.dT} °C ısınırsa reaksiyonlar ne olur?`,
  ans: [{ k: 'RBa', ad: '(a) R_B', u: 'N' }, { k: 'RAa', ad: '(a) R_A', u: 'N' }, { k: 'RB', ad: '(b) R_B (yukarı +)', u: 'N' }, { k: 'RA', ad: '(b) R_A', u: 'N' }],
  hints: (p, r) => [`f₁ = ${p.L1}/(2·10⁵·${p.A1}), f₂ = ${p.L2}/(2·10⁵·${p.A2}).`, `(a) R_B = P·f₂/(f₁+f₂).`, `(b) δ_T = 12·10⁻⁶·${p.dT}·${p.L1 + p.L2}; R_B = (P·f₂ − δ_T)/(f₁+f₂). Eksi çıkabilir.`],
  diag(p, r, u) {
    const near = (a, b) => isFinite(a) && Math.abs(a - b) <= Math.abs(b) * 0.02;
    if (near(u.RBa, r.RAa)) return 'R_A ile R_B yer değiştirmiş. Üst plaka, alt parçanın (f₂) açtığı boşluğu kapatır: R_B = P·f₂/(f₁+f₂).';
    if (near(u.RB, -r.RB)) return '(b)\'de R_B\'nin işareti ters: yukarıyı + aldık, ısınınca R_B eksi (aşağı) çıkar.';
    if (near(u.RB, -r.RT) || near(u.RB, r.RT)) return '(b) şıkkında sadece ısı etkisini bulmuşsun. P·f₂ terimini de ekle: R_B = (P·f₂ − δ_T)/(f₁+f₂).';
    if (near(u.RBa, r.F * p.L2 / (p.L1 + p.L2))) return 'Sadece boylarla oranlamışsın; alanlar farklı, f = L/(EA) kullan.';
    return 'Uygunluk denklemini yaz: R_B·f₁ + (R_B − P)·f₂ + δ_T = 0.';
  }
});
