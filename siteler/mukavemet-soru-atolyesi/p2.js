'use strict';
/* ============ PROBLEM 2 ============ */
PROBS.push({
  id: 'p2', no: 2, tip: 'km',
  ad: 'Başlıklı çubuk ve delikli plaka',
  ozet: 'Çubuk iki yerden kopabilir: kendi başlığından sıyrılarak ya da plakayı zımba gibi delerek. İkisini de hesapla, küçüğünü seç.',
  soru: 'İçine 12 mm çaplı delik açılmış bir alüminyum plaka tarafından taşınan bir çelik çubuğa P yükü uygulanmaktadır. Kayma gerilmesinin çelik çubukta 180 MPa\'yı, alüminyum plakada 70 MPa\'yı aşmaması gerektiğine göre, çubuğa uygulanabilecek en büyük P yükünü belirleyiniz.',
  verilen: ['Çubuk gövde çapı d = 12 mm', 'Başlık çapı D = 40 mm, başlık kalınlığı t<sub>b</sub> = 10 mm', 'Alüminyum plaka kalınlığı t<sub>p</sub> = 8 mm', 'τ<sub>çelik</sub> ≤ 180 MPa, τ<sub>Al</sub> ≤ 70 MPa'],
  istenen: 'İki şartı birlikte sağlayan en büyük P',
  p0: { d: 12, D: 40, tb: 10, tp: 8, ts: 180, ta: 70 },
  solve(p) {
    const A1 = Math.PI * p.d * p.tb, P1 = p.ts * A1 / 1000, A2 = Math.PI * p.D * p.tp, P2 = p.ta * A2 / 1000;
    const Pz = Math.min(P1, P2), Aw = Math.PI * p.d * p.d / 4;
    return { A1, P1, A2, P2, Pz, gov: P1 <= P2 ? 'çelik başlık' : 'alüminyum plaka', tchk: Pz * 1000 / A2, tchk2: Pz * 1000 / A1, Aw, Pw: p.ts * Aw / 1000 };
  },
  anlam: [
    ['plaka tarafından taşınan çubuk', 'Yük yolu: P → çubuk gövdesi → başlık → plaka → mesnet. Her geçişte bir yüzey kayabilir.'],
    ['kayma gerilmesinin … aşmaması', 'Normal gerilme değil, <b>kayma</b>: τ = P / (kayan yüzeyin alanı).'],
    ['çelik çubukta 180 MPa', 'Çelikte kayan yüzey: gövdenin başlığı deldiği <b>silindir</b>: π · d · t<sub>b</sub>.'],
    ['alüminyum plakada 70 MPa', 'Plakada kayan yüzey: başlığın plakayı zımbaladığı <b>silindir</b>: π · D · t<sub>p</sub>.'],
    ['en büyük P', 'İki şart da sağlanmalı: iki P\'den <b>küçüğü</b>.']
  ],
  tetik: ['kayma gerilmesi … aşmaması', 'iki malzeme, iki sınır', 'en büyük P', 'başlık / plaka / delik'],
  tetikNot: 'İki farklı izin verilen gerilme görüyorsan iki ayrı kopma biçimi var demektir. Her birinin YÜZEYİNİ bul. Kaymada yüzey, kayan iki parçanın birbirine sürtündüğü yüzeydir; silindir için çevre × kalınlık.',
  zincir: [["Ne isteniyor?", "En büyük P. İki ayrı sınır var: her sınır için ayrı bir P bulacağım."], ["Yük nereden geçiyor?", "Gövde → başlık → plaka. Her geçişte bir parça ötekini <b>keserek</b> geçebilir."], ["Kesilen yüzey ne?", "Silindir: çevre × kalınlık. Çelikte gövde çapı ve başlık kalınlığı; alüminyumda başlık çapı ve plaka kalınlığı."], ["Hangisini seçerim?", "İki şart birlikte sağlanmalı: <b>küçük</b> P."]],
  cam: { yaw: -0.35, pitch: 0.3, dist: 20, t: [0, -1.2, 0] },
  steps: [
    { t: 'Şekle bak', st: { dim: 1, load: 1, cut: 0 },
      h: () => 'Çubuğun ucunda geniş bir başlık var. Başlık, ortası delik alüminyum plakanın üstüne oturuyor. Çubuğu aşağı çekince başlık plakaya bastırıyor. Sonraki adımlarda model ortadan kesilecek (taralı yüzeyler kesit), içini göreceksin.' },
    { t: 'Yük nereden nereye gidiyor?', st: { path: 1, load: 1, cut: 1 },
      h: () => 'P çubuğu aşağı çeker → gövde, başlığı aşağı çeker → başlık, plakaya bastırır → plaka, mesnede bastırır. Bu yolda iki yerde <b>kayma</b> ile kopma olabilir.',
      why: 'Kopma, kuvvetin bir parçadan diğerine geçtiği yerde olur. Yük yolunu izlersen hangi yüzeylerin zorlandığını görürsün.' },
    { t: 'Kopma 1: gövde başlığı delip çıkar', st: { mS: 1, hS: 1, load: 1, cut: 1 }, cam: { dist: 17, t: [0, -0.9, 0] },
      h: (p, r) => `Gövde aşağı çekilince başlığın ortasındaki d çaplı kısım ile dışı arasında bir <b>silindir yüzey</b> kayar. Bu yüzeyin alanı: çevre × yükseklik = π · d · t<sub>b</sub>.`,
      f: (p, r) => `A₁ = π · ${p.d} · ${p.tb} = ${f1(r.A1)} mm²<br>P₁ = τ · A = ${p.ts} · ${f1(r.A1)} = ${fmt(r.P1 * 1000, 0)} N = <b>${f1(r.P1)} kN</b>`,
      why: 'Kayma gerilmesi, yüzeye paralel kuvvettir. Silindir yüzeyi aç, bir dikdörtgen olur: bir kenarı çevre (π·d), öbürü kalınlık. Alanı ikisinin çarpımı.' },
    { t: 'Kopma 2: başlık plakayı zımbalar', st: { mA: 1, hA: 1, load: 1, cut: 1 }, cam: { dist: 17, t: [0, -0.9, 0] },
      h: () => 'Bu sefer başlığın tamamı, plakadan <b>D çaplı</b> bir diski koparıp aşağı iter. Kayan yüzey plakanın içinde: π · D · t<sub>p</sub>.',
      f: (p, r) => `A₂ = π · ${p.D} · ${p.tp} = ${f1(r.A2)} mm²<br>P₂ = ${p.ta} · ${f1(r.A2)} = ${fmt(r.P2 * 1000, 0)} N = <b>${f1(r.P2)} kN</b>` },
    { t: 'İkisinden küçüğü', st: { hS: 0.5, hA: 0.5, both: 1, load: 1, cut: 1 },
      h: (p, r) => `P iki şartı birden sağlamalı. Büyük olanı seçersen öbür parça kopar. <b>Belirleyici: ${r.gov}.</b>`,
      f: (p, r) => `P<sub>izin</sub> = min(${f1(r.P1)} ; ${f1(r.P2)}) = <b>${f1(r.Pz)} kN</b><br>Kontrol: ${r.gov === 'çelik başlık' ? 'alüminyumda' : 'çelikte'} τ = ${fmt(r.Pz * 1000, 0)} / ${f1(r.gov === 'çelik başlık' ? r.A2 : r.A1)} = ${f1(r.gov === 'çelik başlık' ? r.tchk : r.tchk2)} MPa ≤ ${r.gov === 'çelik başlık' ? p.ta : p.ts} ✓`,
      why: 'Zincir en zayıf halkasından kopar. Alüminyumun izin verilen gerilmesi düşük olsa da, kayan yüzeyi (D = 40 mm çevresi) çok daha büyük olduğu için daha çok yük taşır.' },
    { t: 'Tuzak: πd²/4 değil', st: { wrong: 1, load: 1, cut: 1 }, cam: { dist: 17, t: [0, -0.9, 0] },
      h: (p, r) => `Çelik için gövdenin enine kesit alanını (π·d²/4 = ${f1(r.Aw)} mm², kırmızı daire) kullanmak <b>yanlış</b>: o alan çubuğun çekme gerilmesine ait. Burada çubuk çekilip kopmuyor, başlığından sıyrılıyor; kayan yüzey silindirin yan yüzeyi.`,
      f: (p, r) => `Yanlış: P = ${p.ts} · ${f1(r.Aw)} = <b>${f1(r.Pw)} kN</b><br>Doğru: P = ${p.ts} · ${f1(r.A1)} = <b>${f1(r.P1)} kN</b> (kayan yüzey alanı çok daha büyük)` }
  ],
  scene(v, p, r) {
    const s = 0.1, rd = p.d / 2 * s, RD = p.D / 2 * s, tb = p.tb * s, tp = p.tp * s, Rp = 4.6, PI = Math.PI;
    // her parça iki yarım: arka yarı (kesit yüzü bize bakar) ve saydamlaşabilen ön yarı
    const two = (mk, o) => [v.add(mk(PI, PI), Object.assign({}, o)), v.add(mk(0, PI), Object.assign({}, o))];
    const ring = two((a, b) => E3.tube(Rp, RD, tp, 22, 'y', a, b), { color: C.alu, bias: 0.4 });
    const disc = two((a, b) => E3.tube(RD, rd, tp, 18, 'y', a, b), { color: '#b9c3cd' });
    const headO = two((a, b) => E3.tube(RD, rd, tb, 18, 'y', a, b), { color: C.steel });
    const core = two((a, b) => E3.cyl(rd, tb, 12, 'y', a, b), { color: '#aab6c2' });
    const rod = two((a, b) => E3.cyl(rd, 5.6, 12, 'y', a, b), { color: C.steel });
    const sup = two((a, b) => E3.tube(Rp, RD + 1.1, 0.7, 22, 'y', a, b), { color: '#2a323c', bias: 0.6 });
    // kayan yüzey: tam silindir yüzeyi, her şeyin üstüne yarı saydam çizilir (kesitte arkada kalmasın)
    const surf = (R, h, n) => { const m = E3.cyl(R, h, n); m.f = m.f.slice(0, n); return m; };
    const hS = v.add(surf(rd + 0.015, tb, 24), { color: C.red, alpha: 0, two: 1, edge: 0, bias: -4 });
    const hA = v.add(surf(RD + 0.015, tp, 36), { color: C.red, alpha: 0, two: 1, edge: 0, bias: -4 });
    const wr = v.add(E3.cyl(rd + 0.05, 0.05, 22), { color: C.red, alpha: 0, pos: [0, -1.5, 0] });
    const put = (pr, y) => pr.forEach(o => o.pos = [0, y, 0]);
    const def = { dim: 0, load: 1, path: 0, mS: 0, hS: 0, mA: 0, hA: 0, both: 0, wrong: 0, cut: 1 };
    return {
      def, apply(S, time, v) {
        const ph = loop(time, 1.5), dS = S.mS * ph * 1.4, dA = S.mA * ph * 1.4;
        put(core, tp + tb / 2 - dS - dA); put(rod, -2.8 + tp - dS - dA);
        put(headO, tp + tb / 2 - dA); put(disc, tp / 2 - dA); put(ring, tp / 2); put(sup, -0.35);
        const fa = 1 - 0.88 * S.cut;
        [ring, disc, headO, core, rod, sup].forEach(pr => pr[1].alpha = fa);
        hS.alpha = S.hS * 0.42; hS.pos = core[0].pos; hA.alpha = S.hA * 0.42; hA.pos = disc[0].pos;
        wr.alpha = S.wrong; wr.pos = [0, -1.5 - dS - dA, 0];
        const O = v.ov, yb = -5 + tp - dS - dA;
        O.push({ k: 'arrow', a: [0, yb, 0], b: [0, yb - 1.8, 0], color: C.red, w: 3, label: S.both > 0.5 ? `P = ${f1(r.Pz)} kN` : 'P', lp: [S.both > 0.5 ? 2.3 : 0.9, yb - 1.2, 0], alpha: S.load });
        O.push({ k: 'dim', a: [-RD, tp + tb, 0], b: [RD, tp + tb, 0], off: [0, 0.9, 0], t: `D = ${p.D} mm`, alpha: S.dim });
        O.push({ k: 'dim', a: [-rd, -2.2, 0], b: [rd, -2.2, 0], off: [0, 0, 0.8], t: `d = ${p.d} mm`, alpha: S.dim });
        O.push({ k: 'dim', a: [RD, tp, 0], b: [RD, tp + tb, 0], off: [1.3, 0, 0], t: `t_b = ${p.tb}`, tdx: 22, tdy: 0, alpha: S.dim });
        O.push({ k: 'dim', a: [Rp, 0, 0], b: [Rp, tp, 0], off: [0.8, 0, 0], t: `t_p = ${p.tp}`, tdx: 22, tdy: 0, alpha: S.dim });
        if (S.path > 0.01) {
          O.push({ k: 'arrow', a: [0, -1.2, 0.9], b: [0, -3.5, 0.9], color: C.white, w: 2, alpha: S.path, label: '1 · gövde başlığı çeker', lp: [-2.9, -2.4, 0.9] });
          [-1, 1].forEach(sg => O.push({ k: 'arrow', a: [sg * (rd + RD) / 2, tp + tb + 0.6, 0], b: [sg * (rd + RD) / 2, tp + 0.15, 0], color: C.white, w: 2, alpha: S.path }));
          O.push({ k: 'text', t: '2 · başlık plakaya basar', p: [0, tp + tb + 1.1, 0], size: 13, alpha: S.path });
          [-1, 1].forEach(sg => O.push({ k: 'arrow', a: [sg * 3.9, 0.2, 0], b: [sg * 3.9, -1.3, 0], color: C.white, w: 2, alpha: S.path }));
          O.push({ k: 'text', t: '3 · plaka mesnede basar', p: [3.9, -1.8, 0], size: 13, alpha: S.path });
        }
        const a1 = Math.max(0, (S.hS - 0.5) * 2), a2 = Math.max(0, (S.hA - 0.5) * 2);
        if (a1 > 0.01) O.push({ k: 'text', t: `KAYAN YÜZEY 1 (çelik)\nπ · d · t_b = ${f1(r.A1)} mm²`, p: [-2.6, tp + tb + 1.4, 0], color: C.red, size: 14, box: 1, alpha: a1 });
        if (a2 > 0.01) O.push({ k: 'text', t: `KAYAN YÜZEY 2 (alüminyum)\nπ · D · t_p = ${f1(r.A2)} mm²`, p: [3.6, tp + 1.9, 0], color: C.red, size: 14, box: 1, alpha: a2 });
        if (S.both > 0.01) {
          O.push({ k: 'text', t: `P₁ = ${f1(r.P1)} kN` + (r.P1 <= r.P2 ? '  ← KÜÇÜK' : ''), p: [-3.4, tp + tb + 0.5, 0], color: r.P1 <= r.P2 ? C.red : C.white, size: 15, box: 1, alpha: S.both });
          O.push({ k: 'text', t: `P₂ = ${f1(r.P2)} kN` + (r.P2 < r.P1 ? '  ← KÜÇÜK' : ''), p: [3.6, -0.9, 0], color: r.P2 < r.P1 ? C.red : C.white, size: 15, box: 1, alpha: S.both });
        }
        if (S.wrong > 0.01) O.push({ k: 'text', t: `πd²/4 = ${f1(r.Aw)} mm²\nBU ÇEKME ALANI,
KAYMA DEĞİL`, p: [3.0, -2.6, 0], color: C.red, size: 14, box: 1, alpha: S.wrong });
      }
    };
  },
  whatif: {
    not: 'Başlığı inceltirsen çelik, plakayı inceltirsen alüminyum belirleyici olur. İki çizginin kesiştiği yer "dengeli tasarım".',
    s: [{ k: 'tb', ad: 'Başlık kalınlığı t_b', min: 3, max: 20, step: 0.5, u: 'mm' }, { k: 'tp', ad: 'Plaka kalınlığı t_p', min: 3, max: 20, step: 0.5, u: 'mm' }, { k: 'D', ad: 'Başlık çapı D', min: 16, max: 70, step: 1, u: 'mm' }, { k: 'd', ad: 'Gövde çapı d', min: 6, max: 24, step: 1, u: 'mm' }],
    out: (p, r) => {
      const mx = Math.max(r.P1, r.P2) * 1.1;
      return `<div class="bars"><div class="bar ${r.P1 <= r.P2 ? 'gov' : ''}"><span>Çelik başlık sıyrılır</span><i style="width:${r.P1 / mx * 100}%"></i><b>${f1(r.P1)} kN</b></div>
      <div class="bar ${r.P2 < r.P1 ? 'gov' : ''}"><span>Alüminyum zımbalanır</span><i style="width:${r.P2 / mx * 100}%"></i><b>${f1(r.P2)} kN</b></div></div>
      <p class="note">Kırmızı çubuk belirleyici: <b>P_izin = ${f1(r.Pz)} kN</b> (${r.gov}).</p>`;
    }
  },
  kagit: (p, r) => `Çelik (başlığın sıyrılması):  A₁ = π·d·t_b = π·${p.d}·${p.tb} = ${f1(r.A1)} mm²
  P₁ = τ_ç·A₁ = ${p.ts}·${f1(r.A1)} = ${fmt(r.P1 * 1000, 0)} N = ${f1(r.P1)} kN
Alüminyum (zımbalama):  A₂ = π·D·t_p = π·${p.D}·${p.tp} = ${f1(r.A2)} mm²
  P₂ = τ_Al·A₂ = ${p.ta}·${f1(r.A2)} = ${fmt(r.P2 * 1000, 0)} N = ${f1(r.P2)} kN
P_izin = min(P₁, P₂) = ${f1(r.Pz)} kN   (belirleyici: ${r.gov})`,
  tuzak: ['<b>Kesit alanı (πd²/4) kullanmak.</b> Kaymada kesilen yüzey: π · çap · kalınlık.',
    '<b>Çapları karıştırmak.</b> Çelikte gövde çapı d ve başlık kalınlığı; alüminyumda başlık çapı D ve plaka kalınlığı.',
    '<b>Büyüğü seçmek.</b> "En büyük P" = iki şartı da sağlayan en büyük değer = iki sonucun küçüğü.',
    '<b>Yarıçapla çevre yazmak.</b> Çevre π·d (çapla) ya da 2·π·r.'],
  gen() { return { d: rnd(8, 20, 2), D: rnd(28, 56, 2), tb: rnd(6, 16, 1), tp: rnd(5, 14, 1), ts: rnd(120, 200, 10), ta: rnd(50, 90, 5) }; },
  pracText: p => `Başlıklı çelik çubuk delikli alüminyum plakaya oturuyor. Gövde çapı d = ${p.d} mm, başlık çapı D = ${p.D} mm, başlık kalınlığı ${p.tb} mm, plaka kalınlığı ${p.tp} mm. Kayma gerilmesi çelikte ${p.ts} MPa'yı, alüminyumda ${p.ta} MPa'yı aşmayacak. En büyük P kaç kN?`,
  ans: [{ k: 'P1', ad: 'P₁ (çelik şartı)', u: 'kN' }, { k: 'P2', ad: 'P₂ (alüminyum şartı)', u: 'kN' }, { k: 'Pz', ad: 'P_izin', u: 'kN' }],
  hints: (p, r) => [`Çelikte kayan yüzey gövde çapında bir silindir: π · ${p.d} · ${p.tb}.`, `Alüminyumda kayan yüzey başlık çapında bir silindir: π · ${p.D} · ${p.tp}.`, 'İkisinden küçüğü cevaptır.'],
  diag(p, r, u) {
    const near = (a, b) => isFinite(a) && Math.abs(a - b) <= Math.abs(b) * 0.02;
    if (near(u.P1, r.Pw)) return 'P₁ için kesit alanı πd²/4 kullanmışsın. Kayan yüzey π·d·t_b.';
    if (near(u.P1, p.ts * Math.PI * p.D * p.tb / 1000)) return 'Çelikte D kullanmışsın; çelikte kayan yüzey gövde çapı d ile.';
    if (near(u.P2, p.ta * Math.PI * p.d * p.tp / 1000)) return 'Alüminyumda d kullanmışsın; plakada kayan yüzey başlık çapı D ile.';
    if (near(u.Pz, Math.max(r.P1, r.P2))) return 'Büyük olanı seçtin. İki şart birlikte sağlanmalı: küçüğü.';
    return 'Her iki yüzeyi ayrı ayrı yaz: çevre × kalınlık. Birim: N/mm² × mm² = N.';
  }
});
