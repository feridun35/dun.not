'use strict';
/* ============ PROBLEM 7 ============ */
PROBS.push({
  id: 'p7', no: 7, tip: 'cv',
  ad: 'Alüminyum boru, çelik cıvata, somun',
  ozet: 'Somunu sıkınca cıvata uzar, boru kısalır. İkisinin toplamı somunun ilerlemesi. Kuvvetler eşit.',
  soru: 'Başlangıçta boyları aynı olan alüminyum boru ile çelik civata bir somunla sıkıştırılıyor. (a) Somun 2 mm hareket ettiğine göre boru ve civatada meydana gelen gerilmeleri hesaplayınız. (b) Civatanın ucundan P = 1 kN\'luk bir kuvvet etki ettiğinde meydana gelecek gerilmeler nasıl değişir?',
  verilen: ['Boy L = 10 cm = 100 mm (boru ve cıvata)', 'Alüminyum boru: E<sub>al</sub> = 0,6·10⁵ N/mm², A<sub>al</sub> = 100 mm²', 'Çelik cıvata: E<sub>ç</sub> = 2·10⁵ N/mm², d<sub>ç</sub> = 8 mm', 'Somunun ilerlemesi Δ = 2 mm; (b)\'de cıvata ucunda P = 1 kN'],
  istenen: '(a) σ<sub>ç</sub>, σ<sub>al</sub> ; (b) P etkisinde yeni gerilmeler',
  p0: { L: 100, Ea: 60000, Aa: 100, Ec: 200000, dc: 8, D: 2, P: 1 },
  solve(p) {
    const Ac = Math.PI * p.dc * p.dc / 4, fc = p.L / (p.Ec * Ac), fa = p.L / (p.Ea * p.Aa), F = p.D / (fc + fa);
    const Pn = p.P * 1000, dTn = Pn * fa / (fc + fa), dCn = Pn * fc / (fc + fa);
    return { Ac, fc, fa, F, sc: F / Ac, sa: -F / p.Aa, dcv: F * fc, dav: F * fa, dTn, dCn, T: F + dTn, Cc: F - dCn,
      sc2: (F + dTn) / Ac, sa2: -(F - dCn) / p.Aa, dsc: dTn / Ac, dsa: dCn / p.Aa, Fw: p.D / fc, scw: p.D / fc / Ac };
  },
  anlam: [
    ['boyları aynı', 'Başlangıçta boşluk yok; somun dokunduğu andan itibaren her tur ikisini birden zorlar.'],
    ['somun 2 mm hareket etti', 'Uygunluk: <b>cıvatanın uzaması + borunun kısalması = 2 mm</b>.'],
    ['boru ile cıvata sıkıştırılıyor', 'Denge: cıvatayı çeken kuvvet = boruyu sıkıştıran kuvvet = <b>F</b> (aynı!).'],
    ['E, A, d verilmiş', 'Her parçanın f = L/(EA) değerini bul.'],
    ['ucundan P = 1 kN', 'Ön gerilmeli bağlantıya dış yük: yük iki parçaya <b>rijitlikleriyle orantılı</b> dağılır.']
  ],
  tetik: ['somun … mm hareket', 'boru + cıvata', 'sıkıştırılıyor', 'boyları aynı'],
  tetikNot: '"Somun döndü / ilerledi" cümlesi her zaman bu tarifi çağırır: kuvvetler eşit, boy değişimleri toplamı somun ilerlemesi.',
  zincir: [["Somun ilerleyince ne olur?", "Cıvata uzar, boru kısalır; ikisinin toplamı somunun ilerlemesi."], ["Kuvvetler?", "Alt plakanın dengesi: cıvatanın çekmesi = borunun basısı = F."], ["F nasıl çıkar?", "F·f_ç + F·f_al = Δ → F = Δ / (f_ç + f_al)."], ["Dış yük gelince?", "İki parça paylaşır; cıvataya P·f_al/(f_ç+f_al) kadarı eklenir."]],
  cam: { yaw: -0.4, pitch: 0.06, dist: 22, t: [0.6, 2.7, 0] },
  steps: [
    { t: 'Şekle bak', st: { dim: 1, lab: 1, cut: 1 },
      h: () => 'İki plaka arasında alüminyum bir boru. Borunun içinden çelik bir cıvata geçiyor. Cıvatanın başı üstte, somunu altta. Somun sıkılınca plakalar birbirine yaklaşmak ister. (Borunun önü kesik: taralı yüzey kesit, içinde cıvata.) Sorudaki P, cıvatanın alt ucuna aşağı doğru etki edecek (son adım).' },
    { t: 'Somunu sık: kim ne yapar?', st: { tight: 1, lab: 1, cut: 1, colr: 1 },
      h: () => 'Somun ilerledikçe alt plakayı yukarı iter: alt plaka ve somun yukarı kayar, boru <b>kısalır</b> (bası, mavi), cıvata <b>uzar</b> (çekme, kırmızı; başı üstte sabit, ucu aşağı uzar). Gerçekte değişim çok küçük; burada abartılı gösteriliyor.',
      why: 'Cıvata hiç uzamasaydı boru 2 mm kısalırdı. Boru hiç kısalmasaydı cıvata 2 mm uzardı. Gerçekte ikisi paylaşır.' },
    { t: 'Denge: iki kuvvet eşit', st: { tight: 1, lab: 1, cut: 1, colr: 1, fbd: 1 },
      h: () => 'Alt plaka + somunu ayır. Cıvata somunu yukarı <b>F<sub>ç</sub></b> ile çeker (kırmızı ok, somunun altından). Boru plakayı aşağı <b>F<sub>al</sub></b> ile iter (mavi oklar, plakanın üstünde; iki ok tek borunun toplam F değerini gösterir). Plaka duruyor, başka yük yok; o halde yukarı ve aşağı kuvvet eşit.',
      f: () => 'ΣF<sub>y</sub> = 0 → F<sub>ç</sub> = F<sub>al</sub> = F' },
    { t: 'Uygunluk: δç + δal = Δ', st: { tight: 1, lab: 1, cut: 1, colr: 1, stack: 1 },
      h: (p) => `Sağdaki çubuk: somunun ${p.D} mm'lik ilerlemesi, cıvatanın uzaması (kırmızı) ile borunun kısalmasının (mavi) toplamı. Çubuğun boyu Δ; iki renk onu paylaşıyor.`,
      f: (p) => `δ<sub>ç</sub> + δ<sub>al</sub> = ${p.D} mm` },
    { t: 'f\'ler ve F', st: { tight: 1, lab: 1, cut: 1, colr: 1, stack: 1 },
      h: (p, r) => `A<sub>ç</sub> = π·${p.dc}²/4 = ${f2(r.Ac)} mm². δ = F·f yaz, F ortak çarpan olur.`,
      f: (p, r) => `f<sub>ç</sub> = ${p.L}/(${sci(p.Ec, 0)}·${f2(r.Ac)}) = ${sci(r.fc)} ; f<sub>al</sub> = ${p.L}/(${sci(p.Ea, 1)}·${p.Aa}) = ${sci(r.fa)}<br>F = Δ/(f<sub>ç</sub>+f<sub>al</sub>) = ${p.D} / ${sci(r.fc + r.fa)} = <b>${fmt(r.F, 0)} N</b>` },
    { t: '(a) Gerilmeler', st: { tight: 1, lab: 1, cut: 1, colr: 1, sv: 1 },
      h: () => 'Aynı kuvvet, farklı alanlar. Kontrol: δ\'ların toplamı 2 mm olmalı.',
      f: (p, r) => `σ<sub>ç</sub> = ${fmt(r.F, 0)}/${f2(r.Ac)} = <b>${fmt(r.sc, 0)} MPa</b> (çekme)<br>σ<sub>al</sub> = −${fmt(r.F, 0)}/${p.Aa} = <b>${f1(r.sa)} MPa</b> (bası)<br>Kontrol: ${f3(r.dcv)} + ${f3(r.dav)} = ${f3(r.dcv + r.dav)} mm ✓`,
      why: 'Bu gerilmeler çeliğin ve alüminyumun akma sınırının çok üstünde: 100 mm boy için 2 mm ilerleme çok büyük. Hesap doğrusal-elastik kabulle yapılır; gerçekte malzemeler akardı. Sınavda sonucu yaz, istersen bunu not düş.' },
    { t: '(b) Cıvata ucuna P gelince', st: { tight: 1, lab: 1, cut: 1, colr: 1, pl: 1, sv2: 1 },
      h: (p, r) => `P, cıvatayı ve altındaki plakayı aşağı çeker. Plaka biraz inerse cıvata ek uzar, boru da biraz <b>gevşer</b> (basısı azalır). Plakanın bu ek hareketi ikisi için aynıdır: ΔT·f<sub>ç</sub> = ΔC·f<sub>al</sub>, ayrıca ΔT + ΔC = P. Sert olan (cıvata, f küçük) yükten çok pay alır. Somun ayarı değişmediği için δ<sub>ç</sub> + δ<sub>al</sub> = Δ hâlâ geçerli.`,
      f: (p, r) => `ΔT = P·f<sub>al</sub>/(f<sub>ç</sub>+f<sub>al</sub>) = ${f1(r.dTn)} N (cıvata +)<br>ΔC = P·f<sub>ç</sub>/(f<sub>ç</sub>+f<sub>al</sub>) = ${f1(r.dCn)} N (boru −)<br>σ<sub>ç</sub> = ${f1(r.sc2)} MPa (+${f2(r.dsc)}), σ<sub>al</sub> = ${f1(r.sa2)} MPa (basısı ${f2(r.dsa)} azaldı)`,
      why: 'Ön gerilmenin faydası: cıvata dış yükün tamamını hissetmez, sadece %62,6 oranında (626 N). Kalan %37,4 (374 N) borudaki basının azalmasıyla karşılanır. Cıvatanın somunun altında kalan ucunda ise yalnızca P etkir: σ = 1000/50,27 = 19,9 MPa.' }
  ],
  scene(v, p, r) {
    const s = 0.08, Lv = p.L * s, Rb = 0.34, RtO = 1.15, RtI = 0.88;
    const PI = Math.PI;
    const tubB = v.add(shift(E3.tube(RtO, RtI, Lv, 20, 'y', PI, PI), 0, Lv / 2, 0), { color: C.alu, pos: [0, 0, 0] });
    const tub = v.add(shift(E3.tube(RtO, RtI, Lv, 20, 'y', 0, PI), 0, Lv / 2, 0), { color: C.alu, pos: [0, 0, 0] });
    const topP = v.add(E3.box(5.6, 0.6, 2.8), { color: '#3a434e', pos: [0, Lv + 0.3, 0], bias: 0.6 });
    const botP = v.add(E3.box(5.6, 0.6, 2.8), { color: '#3a434e', pos: [0, -0.3, 0], bias: 0.6 });
    const BH = Lv + 3.2, bolt = v.add(shift(E3.cyl(Rb, BH, 20), 0, -BH / 2, 0), { color: C.steel, pos: [0, Lv + 1, 0] });
    v.add(E3.cyl(0.75, 0.5, 6), { color: '#7f8b97', pos: [0, Lv + 0.85, 0] });
    const nut = v.add(E3.cyl(0.75, 0.55, 6), { color: '#c9d0d8', pos: [0, -0.875, 0] });
    const def = { dim: 0, lab: 1, cut: 1, tight: 0, colr: 0, fbd: 0, stack: 0, sv: 0, pl: 0, sv2: 0 };
    return {
      def, apply(S, time, v) {
        const g = 0.45 * S.ex * S.tight, da = r.dav * g, dc = r.dcv * g;
        [tub, tubB].forEach(o => { o.scl = [1, (Lv - da) / Lv, 1]; o.pos = [0, da, 0]; o.color = mixHex(C.alu, C.comp, S.colr * 0.9); });
        botP.pos = [0, da - 0.3, 0]; nut.pos = [0, da - 0.875, 0]; nut.rot = [0, S.tight * 6, 0];
        bolt.scl = [1, 1 + dc / BH, 1];
        tub.alpha = 1 - 0.9 * S.cut;
        bolt.color = mixHex(C.steel, C.tens, S.colr * 0.9);
        const O = v.ov;
        if (S.lab > 0.01) {
          O.push({ k: 'text', t: 'ALÜMİNYUM BORU', p: [-1.5, Lv / 2, 0], size: 13, color: C.dim, align: 'right', alpha: S.lab });
          O.push({ k: 'text', t: 'ÇELİK CIVATA', p: [-0.7, -1.9, 0], size: 13, color: C.dim, align: 'right', alpha: S.lab });
          O.push({ k: 'text', t: 'somun', p: [1.0, da - 1.2, 0], size: 13, color: C.dim, align: 'left', alpha: S.lab });
        }
        O.push({ k: 'dim', a: [2.8, 0, 0], b: [2.8, Lv, 0], off: [0.6, 0, 0], t: `L = ${p.L} mm`, tdx: 34, tdy: 0, alpha: S.dim });
        if (S.tight > 0.01 && S.tight < 0.98) O.push({ k: 'ring', c: [0, da - 0.875, 0], r: 1.2, u: [1, 0, 0], v: [0, 0, 1], color: C.red, w: 2, dash: [5, 5], alpha: 0.7 });
        if (S.fbd > 0.01) {
          O.push({ k: 'arrow', a: [0, da - 3.0, 1.4], b: [0, da - 1.25, 1.4], color: C.tens, w: 2.6, label: 'F (cıvata çeker)', lp: [1.9, da - 2.4, 1.4], alpha: S.fbd });
          [-1, 1].forEach(sg => O.push({ k: 'arrow', a: [sg * 1.0, da + 2.6, 0], b: [sg * 1.0, da + 0.1, 0], color: C.comp, w: 2.6, label: 'F/2', lp: [sg * 1.0, da + 3.0, 0], alpha: S.fbd }));
          O.push({ k: 'text', t: 'boru iter: F/2 + F/2 = F', p: [1.6, da + 3.7, 0], size: 13, color: C.comp, align: 'left', alpha: S.fbd });
        }
        if (S.stack > 0.01) {
          const k = 2.6 / p.D, x = 3.8, y0 = Lv / 2 - 1.3;
          O.push({ k: 'line', p: [[x, y0, 0], [x, y0 + r.dcv * k, 0]], color: C.tens, w: 9, alpha: S.stack });
          O.push({ k: 'line', p: [[x, y0 + r.dcv * k, 0], [x, y0 + p.D * k, 0]], color: C.comp, w: 9, alpha: S.stack });
          O.push({ k: 'text', t: `δç = ${f3(r.dcv)} mm`, p: [x + 0.4, y0 + r.dcv * k / 2, 0], size: 13, color: C.tens, align: 'left', alpha: S.stack });
          O.push({ k: 'text', t: `δal = ${f3(r.dav)} mm`, p: [x + 0.4, y0 + r.dcv * k + r.dav * k / 2, 0], size: 13, color: C.comp, align: 'left', alpha: S.stack });
          O.push({ k: 'text', t: `Δ = ${p.D} mm`, p: [x, y0 + p.D * k + 0.5, 0], size: 14, alpha: S.stack });
        }
        if (S.sv > 0.01 || S.sv2 > 0.01) {
          const b2 = S.sv2 > 0.5;
          O.push({ k: 'text', t: `σç = ${fmt(b2 ? r.sc2 : r.sc, 1)} MPa`, p: [-3.2, Lv * 0.75, 0], color: C.tens, size: 15, box: 1, alpha: Math.max(S.sv, S.sv2) });
          O.push({ k: 'text', t: `σal = ${fmt(b2 ? r.sa2 : r.sa, 1)} MPa`, p: [-3.2, Lv * 0.25, 0], color: C.comp, size: 15, box: 1, alpha: Math.max(S.sv, S.sv2) });
        }
        if (S.pl > 0.01) O.push({ k: 'arrow', a: [0, -2.4, 0], b: [0, -4.1, 0], color: C.red, w: 3, label: `P = ${f2(p.P)} kN`, lp: [1.5, -3.5, 0], alpha: S.pl });
      }
    };
  },
  whatif: {
    not: 'Somun ilerlemesini 0,2 mm\'ye indir: gerilmeler 10 kat küçülür, gerçekçi değerlere iner. (b)\'deki değişimler ise Δ\'ya bağlı değil.',
    s: [{ k: 'D', ad: 'Somun ilerlemesi Δ', min: 0.05, max: 2.5, step: 0.05, u: 'mm' }, { k: 'dc', ad: 'Cıvata çapı d', min: 4, max: 20, step: 1, u: 'mm' }, { k: 'Aa', ad: 'Boru alanı A_al', min: 40, max: 400, step: 5, u: 'mm²' }, { k: 'P', ad: 'Dış yük P', min: 0, max: 10, step: 0.5, u: 'kN' }],
    out: (p, r) => `<div class="mets"><div class="m"><small>Ön germe F</small><b>${fmt(r.F, 0)} N</b></div><div class="m red"><small>σ_ç (a)</small><b>${f1(r.sc)} MPa</b></div><div class="m blue"><small>σ_al (a)</small><b>${f1(r.sa)} MPa</b></div><div class="m"><small>P'nin cıvataya geçen payı</small><b>${f1(r.dTn / Math.max(1e-9, p.P * 1000) * 100)} %</b></div></div>
      <p class="note">Cıvata incelirse (küçük d) daha yumuşak olur: dış yükün daha azını alır, boru daha çok rahatlar.</p>`
  },
  kagit: (p, r) => `Denge: F_ç = F_al = F
Uygunluk: δ_ç + δ_al = Δ = ${p.D} mm
A_ç = π·${p.dc}²/4 = ${f2(r.Ac)} mm²
f_ç = L/(E_ç A_ç) = ${p.L}/(${p.Ec}·${f2(r.Ac)}) = ${(r.fc * 1e6).toLocaleString('tr-TR', { maximumFractionDigits: 3 })}·10⁻⁶ mm/N
f_al = L/(E_al A_al) = ${p.L}/(${p.Ea}·${p.Aa}) = ${(r.fa * 1e6).toLocaleString('tr-TR', { maximumFractionDigits: 3 })}·10⁻⁶ mm/N
F = Δ/(f_ç + f_al) = ${fmt(r.F, 0)} N
(a) σ_ç = F/A_ç = ${fmt(r.sc, 1)} MPa    σ_al = −F/A_al = ${fmt(r.sa, 1)} MPa
(b) T = F + P·f_al/(f_ç+f_al) = ${fmt(r.T, 0)} N  →  σ_ç = ${fmt(r.sc2, 1)} MPa
    C = F − P·f_ç/(f_ç+f_al) = ${fmt(r.Cc, 0)} N  →  σ_al = ${fmt(r.sa2, 1)} MPa`,
  tuzak: ['<b>Somun ilerlemesini tek parçaya vermek.</b> 2 mm\'yi sadece cıvataya verirsen F çok büyük çıkar. Δ ikisine paylaşılır.',
    '<b>Kuvvetleri farklı sanmak.</b> Cıvatadaki çekme = borudaki bası. Gerilmeler farklı, çünkü alanlar farklı.',
    '<b>(b)\'de P\'nin tamamını cıvataya eklemek.</b> Sadece f_al/(f_ç+f_al) kadarı eklenir.',
    '<b>Alanı çapla yazmak.</b> A = π·d²/4, π·d değil.'],
  gen() { return { L: rnd(60, 200, 10), Ea: pick([60000, 70000]), Aa: rnd(60, 300, 10), Ec: pick([200000, 210000]), dc: rnd(6, 16, 1), D: rnd(0.1, 0.6, 0.05), P: rnd(0.5, 5, 0.5) }; },
  pracText: p => `Boyları ${p.L} mm olan alüminyum boru (E = ${p.Ea} MPa, A = ${p.Aa} mm²) ve çelik cıvata (E = ${p.Ec} MPa, d = ${p.dc} mm) somunla sıkılıyor. Somun ${f2(p.D)} mm ilerliyor. (a) F, σ_ç, σ_al? (b) Cıvata ucuna ${f2(p.P)} kN gelirse σ_ç kaç olur?`,
  ans: [{ k: 'F', ad: 'Ön germe F', u: 'N' }, { k: 'sc', ad: 'σ_ç (a)', u: 'MPa' }, { k: 'sa', ad: 'σ_al (a) (büyüklük)', u: 'MPa', abs: 1 }, { k: 'sc2', ad: 'σ_ç (b)', u: 'MPa' }],
  hints: (p, r) => [`A_ç = π·${p.dc}²/4; f = L/(E·A) her parça için.`, `F = ${f2(p.D)} / (f_ç + f_al).`, `(b) Cıvataya eklenen: P·f_al/(f_ç+f_al).`],
  diag(p, r, u) {
    const near = (a, b) => isFinite(a) && Math.abs(a - b) <= Math.abs(b) * 0.02;
    if (near(u.F, r.Fw)) return 'Δ\'nın tamamını cıvataya vermişsin. Uzama + kısalma = Δ.';
    if (near(u.sc2, r.sc + p.P * 1000 / r.Ac)) return '(b)\'de P\'nin tamamını cıvataya eklemişsin; sadece f_al/(f_ç+f_al) payı geçer.';
    if (near(u.sc, r.F / (Math.PI * p.dc))) return 'Alanı π·d almışsın: A = π·d²/4.';
    return 'Sıra: f_ç, f_al → F → σ = F/A.';
  }
});
