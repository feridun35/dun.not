'use strict';
/* ============ VİZE 10 · 2018–19 Güz · Soru 3 ============ */
VIZE.push({
  id: 'v10', no: 10, kod: 'V10', vize: true, tip: 'hs',
  src: '2018–19 Güz vizesi · Soru 3',
  img: 'img/v10.png', cevapImg: 'img/v10_cevap.png',
  ad: 'Isıtılan alüminyum, onu tutan iki çelik çubuk',
  ozet: 'Ortadaki alüminyum ısınıp uzamak ister; üstteki ve alttaki çelik çubuklar rijit A ve B parçalarını birbirine bağlayıp buna izin vermez. Alüminyum basıda, çelikler çekmede. Denge: F_al = 2·F_ç. Uygunluk: ikisi AYNI miktarda uzar.',
  soru: 'Şekildeki EF alüminyum çubuk 300 mm uzunluğunda ve 90 mm çapındadır. CD ve GH çelik çubukları ise 450 mm uzunluğunda ve 20 mm çapındadır. A ve B parçaları rijittir. 20 °C oda sıcaklığında montajı yapılan parçalar gerilmesizdir. Sadece alüminyum çubuk 100 °C sıcaklığa ısıtıldığında; (a) Çelik ve alüminyum çubuk boylarındaki (ΔL, mm) değişimi bulunuz. (15 puan) (b) Çelik ve alüminyum çubuklardaki gerilmeleri (MPa) bulunuz. (10 puan)',
  verilen: ['Alüminyum EF: L = 300 mm, d = 90 mm, E = 73 GPa, α = 23,2·10⁻⁶ 1/°C', 'Çelik CD ve GH (iki tane): L = 450 mm, d = 20 mm, E = 210 GPa, α = 11,7·10⁻⁶ 1/°C', 'A ve B rijit; 20 °C\'de montaj, gerilmesiz', 'Yalnız alüminyum 100 °C\'ye ısıtılıyor: ΔT = 80 °C (çelikler ısınmıyor)'],
  istenen: '(a) ΔL<sub>çelik</sub>, ΔL<sub>al</sub> ; (b) σ<sub>çelik</sub>, σ<sub>al</sub>',
  p0: { La: 300, da: 90, Ea: 73000, aa: 23.2e-6, Ls: 450, ds: 20, Es: 210000, as: 11.7e-6, dT: 80, dTs: 0 },
  solve(p) {
    const Aa = Math.PI * p.da * p.da / 4, As = Math.PI * p.ds * p.ds / 4;
    const fa = p.La / (p.Ea * Aa), fs = p.Ls / (p.Es * As); // fs: TEK çelik çubuğun esnekliği
    const dTa = p.aa * p.dT * p.La, dTsv = p.as * p.dTs * p.Ls; // serbest ısıl uzamalar
    const F = (dTa - dTsv) / (fa + fs / 2), Fs = F / 2; // F = F_AB (alüminyumdaki bası)
    const d = dTa - F * fa; // ortak boy değişimi (iki parça da)
    return { Aa, As, fa, fs, dTa, dTsv, F, Fs, d, da: d, ds: dTsv + Fs * fs, back: F * fa,
      sa: -F / Aa, ss: Fs / As, sam: F / Aa,
      // sık yapılan hatalar (teşhis için)
      Fno2: (dTa - dTsv) / (fa + fs), Frig: (dTa - dTsv) / (fs / 2), Fboth: (dTa - p.as * p.dT * p.Ls) / (fa + fs / 2) };
  },
  anlam: [
    ['A ve B parçaları rijittir', 'A ve B eğilmez, kısalmaz. Hepsi birlikte hareket eder: B\'nin A\'dan uzaklaşması kadar <b>her</b> çubuk uzar.'],
    ['CD ve GH çelik çubuklar (iki tane)', 'Aynı boy, aynı çap, simetrik: kuvveti <b>eşit paylaşırlar</b>. Her biri F<sub>AB</sub>/2 taşır.'],
    ['20 °C\'de montaj, gerilmesiz', 'Başlangıçta kimsede kuvvet yok. Her şey sıcaklık farkından doğacak: ΔT = 100 − 20 = <b>80 °C</b>.'],
    ['Sadece alüminyum ısıtılıyor', 'Çeliğin α\'sı verilmiş ama <b>kullanılmaz</b>: çelik ısınmıyor, ısıl uzaması yok. Tuzak veri.'],
    ['ΔL\'leri bulunuz', 'Cevap bir uzama: alüminyum serbestçe 0,5568 mm uzamak isterdi, çelikler tuttuğu için biraz daha az uzar. Çelik de <b>aynı</b> miktarda uzar.'],
    ['gerilmeleri bulunuz', 'Alüminyum geri tutuluyor → <b>bası</b> (−). Çelikler çekiliyor → <b>çekme</b> (+). Kuvvet aynı değil: alüminyum F, her çelik F/2.']
  ],
  tetik: ['rijit parçalar arasında', 'sadece biri ısıtılıyor', 'montajda gerilmesiz', 'iki çelik bir alüminyum', 'boy değişimi ve gerilme'],
  tetikNot: 'Birbirine paralel bağlanmış parçalar (aynı iki rijit parçanın arasında duranlar) ve sıcaklık: bu bir "iki ucu tutulu + ısı" sorusu. Fark şu: duvar yerine diğer çubuklar tutuyor. Paralel parçalarda boy değişimleri <b>eşittir</b>, kuvvetler toplanır (seri parçaların tersi).',
  zincir: [
    ['Kim kimi tutuyor?', 'Alüminyum A ile B\'yi ayırmak (itmek) ister; iki çelik çubuk A ile B\'yi birbirine bağlayıp geri çeker.'],
    ['Bilinmeyen ne?', 'Alüminyumdaki kuvvet F<sub>AB</sub> ve çeliklerdeki F<sub>D</sub>, F<sub>H</sub>. Simetri: F<sub>D</sub> = F<sub>H</sub>.'],
    ['Denge?', 'B parçasını ayır: alüminyum sağa iter, iki çelik sola çeker → F<sub>AB</sub> = 2·F<sub>ç</sub>. Tek denklem, kuvvetin büyüklüğünü vermez.'],
    ['Eksik denklem?', 'A ve B rijit: alüminyumun boy değişimi = çeliğin boy değişimi. <b>δ<sub>al</sub> = δ<sub>ç</sub></b>.'],
    ['Her birini nasıl yazarım?', 'δ<sub>al</sub> = α·ΔT·L − F·L/(EA) (ısınıp uzar, kuvvet geri iter). δ<sub>ç</sub> = (F/2)·L/(EA) (sadece kuvvetle uzar).'],
    ['Sonra?', 'Eşitle, F\'yi çöz. δ\'yı yerine koy. σ = kuvvet / kendi alanı (çelikte F/2!).']
  ],
  get cam() { const nar = typeof window !== 'undefined' && window.innerWidth < 700; return { yaw: -0.14, pitch: 0.2, dist: nar ? 14 : 9.6, t: [nar ? 2.75 : 2.35, -0.05, 0] }; }, // dar ekranda kuvvet okları kadraja sığsın
  steps: [
    { t: 'Şekle bak', st: { dim: 1, lab: 1, mat: 1 },
      h: () => 'Solda rijit A, sağda rijit B. Ortada kalın alüminyum çubuk EF (300 mm, çap 90 mm) A ile B\'nin arasında sıkışık durur. Üstte CD, altta GH: ince çelik çubuklar (450 mm, çap 20 mm). A ve B\'nin deliklerinden geçer, dışarıdan somunla (C, G, D, H) tutulur. Hiç dış yük yok; tek "yük" sıcaklık.' },
    { t: 'Isı: alüminyum uzamak ister', st: { lab: 1, heat: 1, free: 1, stl: 0.15, freeTxt: 1 },
      h: (p, r) => `Sadece alüminyum ${p.dT} °C ısınıyor. Çelikleri bir an yok say: alüminyum serbestçe uzar, B\'yi sağa iterdi. Bu serbest uzama ${f4(r.dTa)} mm (çizimde çok abartılı).`,
      f: (p, r) => `δ<sub>T</sub> = α<sub>al</sub>·ΔT·L<sub>al</sub> = ${sci(p.aa)} · ${p.dT} · ${p.La} = <b>${f4(r.dTa)} mm</b>`,
      why: 'ΔT = 100 − 20 = 80 °C. Montaj sıcaklığı 20 °C, gerilmesiz: ısı farkı oradan sayılır. Çelikler ısınmadığı için çeliğin α\'sı bu soruda hiç kullanılmaz.' },
    { t: 'Çelikler tutar: denge', st: { lab: 1, heat: 0.5, fin: 1, colr: 1, frc: 1 },
      h: () => 'Gerçekte çelikler var. B uzaklaştıkça çelikleri <b>çeker</b> (kırmızı, çekme); çelikler de B\'yi geri çeker ve alüminyumu sıkıştırır (mavi, bası). B parçasını ayrı düşün: alüminyum onu sağa F<sub>AB</sub> ile iter, iki çelik sola F<sub>D</sub> ve F<sub>H</sub> ile çeker. B durduğuna göre toplam sıfır. A parçasında da aynısı, ayna gibi.',
      f: () => 'ΣF<sub>x</sub> = 0 (B): F<sub>AB</sub> − F<sub>D</sub> − F<sub>H</sub> = 0<br>Simetri: F<sub>D</sub> = F<sub>H</sub> = F<sub>ç</sub> → <b>F<sub>AB</sub> = 2·F<sub>ç</sub></b>',
      why: 'Dış yük olmadığı için kuvvetler içeride kapalı bir döngü kurar: alüminyumdaki bası, çeliklerdeki çekmelerin toplamına eşit. Bu tek denklem F\'nin büyüklüğünü söylemez; ikinci denklem boy değişiminden gelecek.' },
    { t: 'Uygunluk: ikisi aynı miktarda uzar', st: { lab: 1, fin: 1, colr: 1, dd: 1, orig: 1 },
      h: () => 'A ve B rijit. Alüminyum A ile B\'nin iç yüzleri arasında, çelikler A ile B\'nin dış yüzleri (somunlar) arasında duruyor. B, A\'dan ne kadar uzaklaşırsa iki parçanın boyu da <b>o kadar</b> değişir. Kesikli çizgi B\'nin ilk yeri. (A burada yerinde tutuldu; değişim abartılı.)',
      f: () => '<b>δ<sub>al</sub> = δ<sub>ç</sub></b>  (paralel parçalar: boy değişimleri eşit)',
      why: 'Seri bağlı parçalarda (uç uca) kuvvet aynı, boy değişimleri toplanır. Paralel parçalarda (aynı iki rijit parçanın arasında yan yana) boy değişimi aynı, kuvvetler toplanır. Bu soru ikincisi.' },
    { t: 'Her parçanın boy değişimi', st: { lab: 1, fin: 1, colr: 1, fv: 1 },
      h: () => 'Alüminyum: ısıdan uzar, çeliklerin kuvveti onu geri iter (eksi). Çelik: ısınmadı, sadece F/2 kuvvetiyle uzar. f = L/(EA): 1 N\'un kaç mm uzattığı.',
      f: (p, r) => `A<sub>al</sub> = π·${p.da}²/4 = ${f1(r.Aa)} mm² ; A<sub>ç</sub> = π·${p.ds}²/4 = ${f2(r.As)} mm²<br>δ<sub>al</sub> = α·ΔT·L − F<sub>AB</sub>·L/(A·E) = ${f4(r.dTa)} − ${sci(r.fa, 4)}·F<sub>AB</sub><br>δ<sub>ç</sub> = (F<sub>AB</sub>/2)·${p.Ls}/(${f2(r.As)}·${fmt(p.Es, 0)}) = ${sci(r.fs / 2, 4)}·F<sub>AB</sub>`,
      why: 'Çelikteki 1/2 çarpanı çok önemli: iki çelik çubuk var, her biri F_AB\'nin yarısını taşır. Hoca bunu "0,5·F_AB·450" diye yazmış.' },
    { t: 'Eşitle ve kuvveti çöz', st: { lab: 1, fin: 1, colr: 1, frc: 1, val: 1 },
      h: () => 'İki ifadeyi eşitle. F<sub>AB</sub> sağ tarafta toplanır: sabit terim (ısının istediği uzama) iki esnekliğin toplamına bölünür.',
      f: (p, r) => `${f4(r.dTa)} − ${sci(r.fa, 4)}·F = ${sci(r.fs / 2, 4)}·F<br>F<sub>AB</sub> = ${f4(r.dTa)} / ${sci(r.fa + r.fs / 2, 4)} = <b>${fmt(r.F, 0)} N</b> (alüminyumda bası)<br>F<sub>D</sub> = F<sub>H</sub> = F<sub>AB</sub>/2 = <b>${fmt(r.Fs, 0)} N</b> (her çelikte çekme)`,
      why: 'Hoca 137 265,8 N bulmuş; fark katsayıların yuvarlanmasından (6,459·10⁻⁷ yerine tam değer 6,4599·10⁻⁷). Binde birin altında, sınavda ikisi de doğru sayılır.' },
    { t: '(a) Boy değişimleri', st: { lab: 1, fin: 1, colr: 1, dd: 1, orig: 1, ghost: 1 },
      h: (p, r) => `Alüminyum ${f4(r.dTa)} mm uzamak isterdi (kırmızı kesikli çizgi). Çelikler onu ${f4(r.back)} mm geri itti. Sonuçta alüminyum <b>${f4(r.d)} mm uzadı</b>; çelikler de aynı miktarda uzadı. Alüminyum basıda olduğu halde uzuyor: ısının uzatması, basının kısaltmasından büyük.`,
      f: (p, r) => `δ<sub>al</sub> = ${f4(r.dTa)} − ${sci(r.fa, 4)}·${fmt(r.F, 0)} = <b>${f4(r.d)} mm</b> (uzama)<br>δ<sub>ç</sub> = ${sci(r.fs / 2, 4)}·${fmt(r.F, 0)} = <b>${f4(r.ds)} mm</b> (uzama) ✓ aynı` },
    { t: '(b) Gerilmeler', st: { lab: 1, fin: 1, colr: 1, sv: 1 },
      h: () => 'Her parçanın kuvvetini <b>kendi</b> alanına böl. Alüminyumun kuvveti iki katı ama alanı 20 kattan fazla: gerilmesi küçük. İnce çelikler büyük gerilme taşır.',
      f: (p, r) => `σ<sub>al</sub> = −F<sub>AB</sub>/A<sub>al</sub> = −${fmt(r.F, 0)}/${f1(r.Aa)} = <b>${f2(r.sa)} MPa</b> (bası)<br>σ<sub>ç</sub> = F<sub>ç</sub>/A<sub>ç</sub> = ${fmt(r.Fs, 0)}/${f2(r.As)} = <b>${f2(r.ss)} MPa</b> (çekme)`,
      why: 'Çelik 218 MPa: yapı çeliğinin akma sınırına (≈ 250 MPa) yakın. Alüminyumu biraz daha ısıtsan (ΔT ≈ 92 °C) çelikler akmaya başlardı; 05\'teki kaydırıcıyla dene.' }
  ],
  scene(v, p, r) {
    const tb = 0.55, bl = 0.2, Lst = 4.5, xE = tb + bl, Lal = 3.0, xF = xE + Lal, yR = 1.55, rS = 0.11, rA = 0.45;
    const RIG = '#5f6b78', dep = 1.1;
    v.add(E3.box(tb, 4, dep), { color: RIG, pos: [tb / 2, 0, 0] });
    v.add(E3.box(bl, 1.3, dep), { color: RIG, pos: [tb + bl / 2, 0, 0] });
    const bBlk = v.add(E3.box(tb, 4, dep), { color: RIG, pos: [Lst - tb / 2, 0, 0] });
    const bBos = v.add(E3.box(bl, 1.3, dep), { color: RIG, pos: [xF + bl / 2, 0, 0] });
    const al = v.add(shift(E3.cyl(rA, Lal, 30, 'x'), Lal / 2, 0, 0), { color: C.alu, pos: [xE, 0, 0] });
    const Lmid = Lst - 2 * tb, stl = [], stub = [], nut = [];
    [1, -1].forEach(sg => {
      stl.push(v.add(shift(E3.cyl(rS, Lmid, 14, 'x'), Lmid / 2, 0, 0), { color: C.steel, pos: [tb, sg * yR, 0] }));
      v.add(E3.cyl(rS, 0.3, 14, 'x'), { color: C.steel, pos: [-0.15, sg * yR, 0] });
      v.add(E3.box(0.16, 0.36, 0.36), { color: '#7f8b97', pos: [-0.08, sg * yR, 0] });
      stub.push(v.add(E3.cyl(rS, 0.3, 14, 'x'), { color: C.steel, pos: [Lst + 0.15, sg * yR, 0] }));
      nut.push(v.add(E3.box(0.16, 0.36, 0.36), { color: '#7f8b97', pos: [Lst + 0.08, sg * yR, 0] }));
    });
    const def = { dim: 0, lab: 0, mat: 0, heat: 0, free: 0, stl: 1, freeTxt: 0, fin: 0, colr: 0, frc: 0, val: 0, dd: 0, orig: 0, fv: 0, ghost: 0, sv: 0 };
    return {
      def, apply(S, time, v) {
        const K = 0.01 * 200 * S.ex; // mm → çizim birimi, abartılı
        const rel = K * (r.dTa * S.free + r.d * S.fin), relF = K * r.dTa, xb = Lst + rel, xf = xF + rel;
        bBlk.pos = [Lst - tb / 2 + rel, 0, 0]; bBos.pos = [xF + bl / 2 + rel, 0, 0];
        al.scl = [(Lal + rel) / Lal, 1, 1];
        al.color = mixHex(C.alu, C.comp, S.colr);
        stl.forEach((o, i) => { o.scl = [(Lmid + rel) / Lmid, 1, 1]; o.color = mixHex(C.steel, C.tens, S.colr); o.alpha = S.stl; stub[i].pos = [xb + 0.15, o.pos[1], 0]; stub[i].alpha = S.stl; nut[i].pos = [xb + 0.08, o.pos[1], 0]; nut[i].alpha = S.stl; });
        const O = v.ov;
        if (S.lab > 0.01) {
          [['A', tb / 2, -1.0, dep / 2 + 0.02], ['B', xb - tb / 2, -1.0, dep / 2 + 0.02], ['C', -0.3, yR + 0.4, 0], ['G', -0.3, -yR - 0.4, 0], ['D', xb + 0.3, yR + 0.4, 0], ['H', xb + 0.3, -yR - 0.4, 0], ['E', xE + 0.15, -0.72, 0.3], ['F', xf - 0.15, -0.72, 0.3]]
            .forEach(([t, x, y, z]) => O.push({ k: 'text', t, p: [x, y, z], size: 16, alpha: S.lab * (t === 'D' || t === 'H' || t === 'C' || t === 'G' ? Math.max(S.stl, 0.3) : 1) }));
        }
        if (S.mat > 0.01) {
          O.push({ k: 'text', t: 'çelik CD (Ø20)', p: [2.25, yR + 0.33, 0], size: 13, color: C.dim, alpha: S.mat });
          O.push({ k: 'text', t: 'çelik GH (Ø20)', p: [2.25, -yR + 0.33, 0], size: 13, color: C.dim, alpha: S.mat });
          O.push({ k: 'text', t: 'alüminyum EF (Ø90)', p: [2.25, 0.72, 0.2], size: 13, color: C.dim, alpha: S.mat });
        }
        O.push({ k: 'dim', a: [0, 2.0, 0], b: [Lst, 2.0, 0], off: [0, 0.45, 0], t: `${p.Ls} mm (çelik)`, alpha: S.dim });
        O.push({ k: 'dim', a: [xE, -2.0, 0], b: [xF, -2.0, 0], off: [0, -0.45, 0], t: `${p.La} mm (alüminyum)`, alpha: S.dim });
        if (S.heat > 0.01) {
          for (let i = 0; i < 5; i++) {
            const x0 = xE + 0.4 + i * (Lal + rel - 0.8) / 4, P = [];
            for (let k = 0; k <= 10; k++) P.push([x0 + 0.07 * Math.sin(k * 1.1 - time * 3 + i), 0.55 + 0.065 * k, 0]);
            O.push({ k: 'line', p: P, color: C.red, w: 1.6, alpha: S.heat * 0.7 });
          }
          O.push({ k: 'text', t: `ΔT = ${p.dT} °C (yalnız alüminyum)`, p: [2.25 + rel / 2, -2.45, 0], size: 14, color: C.red, box: 1, alpha: S.heat });
        }
        if (S.freeTxt > 0.01) {
          O.push({ k: 'dim', a: [Lst, -2.0, 0], b: [Lst + relF, -2.0, 0], off: [0, -0.4, 0], t: `serbest: +${f4(r.dTa)} mm`, color: C.red, alpha: S.freeTxt * S.free });
          O.push({ k: 'text', t: 'çelikler yok sayıldı', p: [2.25, yR + 0.35, 0], size: 13, color: C.mute, alpha: S.freeTxt });
        }
        if (S.frc > 0.01) {
          const lab = (n, val) => S.val > 0.5 ? `${n} = ${fmt(val, 0)} N` : n;
          O.push({ k: 'arrow', a: [xf - 1.15, 0, rA + 0.15], b: [xf - 0.03, 0, rA + 0.15], color: C.white, w: 2.8, label: lab('F_AB', r.F), lp: [xf - 1.0, 0.3, rA + 0.15], align: 'right', alpha: S.frc });
          O.push({ k: 'arrow', a: [xE + 1.15, 0, rA + 0.15], b: [xE + 0.03, 0, rA + 0.15], color: C.white, w: 2.8, alpha: S.frc * 0.45 });
          [['F_D', yR], ['F_H', -yR]].forEach(([n, y]) => {
            O.push({ k: 'arrow', a: [xb + 1.25, y, 0], b: [xb + 0.18, y, 0], color: C.white, w: 2.6, label: lab(n, r.Fs), lp: [xb + 1.35, y, 0], align: 'left', alpha: S.frc });
            O.push({ k: 'arrow', a: [-1.15, y, 0], b: [-0.18, y, 0], color: C.white, w: 2.6, alpha: S.frc * 0.45 });
          });
        }
        if (S.orig > 0.01) {
          const z = dep / 2 + 0.01, P = [[Lst - tb, -2, z], [Lst, -2, z], [Lst, 2, z], [Lst - tb, 2, z], [Lst - tb, 0.65, z], [xF, 0.65, z], [xF, -0.65, z], [Lst - tb, -0.65, z]];
          O.push({ k: 'line', p: P, close: 1, dash: [5, 4], color: C.mute, w: 1.3, alpha: S.orig });
        }
        if (S.dd > 0.01 && rel > 0.02) {
          O.push({ k: 'dim', a: [Lst, 2.0, 0], b: [xb, 2.0, 0], off: [0, 0.4, 0], t: `δ çelik = ${f4(r.ds)} mm`, color: C.tens, alpha: S.dd });
          O.push({ k: 'dim', a: [xF, -0.65, 0.5], b: [xf, -0.65, 0.5], off: [0, -1.6, 0], t: `δ alüminyum = ${f4(r.d)} mm`, color: C.comp, alpha: S.dd });
        }
        if (S.ghost > 0.01) { const xg = xE + Lal + relF; O.push({ k: 'line', p: [[xE, rA, 0], [xg, rA, 0], [xg, -rA, 0], [xE, -rA, 0]], dash: [6, 4], color: C.red, w: 1.6, alpha: S.ghost }); }
        if (S.ghost > 0.01) O.push({ k: 'text', t: `isterdi +${f4(r.dTa)} mm`, p: [xF + relF + 0.1, 0.62, 0.5], size: 13, color: C.red, box: 1, align: 'left', alpha: S.ghost });
        if (S.fv > 0.01) {
          O.push({ k: 'text', t: `δ_al = ${f4(r.dTa)} − F·f_al`, p: [2.25 + rel / 2, -0.85, 0.5], size: 14, box: 1, color: C.comp, alpha: S.fv });
          O.push({ k: 'text', t: 'çelik: (F/2)·L/(EA)', p: [2.25 + rel / 2, yR + 0.35, 0], size: 14, box: 1, color: C.tens, alpha: S.fv });
          O.push({ k: 'text', t: 'çelik: (F/2)·L/(EA)', p: [2.25 + rel / 2, -yR - 0.35, 0], size: 14, box: 1, color: C.tens, alpha: S.fv });
        }
        if (S.sv > 0.01) {
          O.push({ k: 'text', t: `σ_al = ${f2(r.sa)} MPa (bası)`, p: [2.25 + rel / 2, -0.85, 0.5], size: 15, box: 1, color: C.comp, alpha: S.sv });
          O.push({ k: 'text', t: `σ çelik = ${f2(r.ss)} MPa (çekme)`, p: [2.25 + rel / 2, yR + 0.38, 0], size: 15, box: 1, color: C.tens, alpha: S.sv });
          O.push({ k: 'text', t: `σ çelik = ${f2(r.ss)} MPa (çekme)`, p: [2.25 + rel / 2, -yR - 0.38, 0], size: 15, box: 1, color: C.tens, alpha: S.sv });
        }
      }
    };
  },
  whatif: {
    not: 'Isıyı artır: kuvvet ve gerilmeler doğrusal büyür. Çelik çapını küçült: çelikler yumuşar, alüminyum daha çok uzar, kuvvet azalır ama çelik gerilmesi yine de artabilir. Çeliği de ısıt: istenen uzama farkı küçülür, kuvvet düşer.',
    s: [{ k: 'dT', ad: 'ΔT alüminyum', min: 0, max: 160, step: 5, u: '°C' }, { k: 'dTs', ad: 'ΔT çelik', min: 0, max: 160, step: 5, u: '°C' }, { k: 'ds', ad: 'çelik çapı d', min: 10, max: 40, step: 1, u: 'mm' }, { k: 'da', ad: 'alüminyum çapı', min: 40, max: 120, step: 5, u: 'mm' }],
    out: (p, r) => `<div class="mets"><div class="m"><small>F_AB</small><b>${fmt(r.F, 0)} N</b></div><div class="m"><small>δ (ikisi de)</small><b>${f4(r.d)} mm</b></div><div class="m blue"><small>σ_al</small><b>${f2(r.sa)} MPa</b></div><div class="m red"><small>σ_ç</small><b>${f2(r.ss)} MPa</b></div></div>
      <p class="note">${r.ss > 250 ? '<b>Dikkat:</b> σ_ç yapı çeliğinin akma sınırını (≈ 250 MPa) aşıyor; elastik hesap artık geçerli değil, çelikler kalıcı uzar.' : r.F < 0 ? 'Çelik alüminyumdan çok uzamak istiyor: kuvvetler yön değiştirdi (alüminyum çekmede, çelik basıda).' : `Alüminyum serbestçe ${f4(r.dTa)} mm uzardı; çelikler onu ${f4(r.back)} mm geri tuttu.`}</p>`
  },
  kagit: (p, r) => `Denge (B parçası):  F_AB − F_D − F_H = 0 ,  F_D = F_H  →  F_AB = 2·F_ç
Uygunluk (A, B rijit):  δ_al = δ_ç
A_al = π·${p.da}²/4 = ${f1(r.Aa)} mm²    A_ç = π·${p.ds}²/4 = ${f2(r.As)} mm²
δ_al = α·ΔT·L − F_AB·L/(A·E) = ${sci(p.aa).replace(/<\/?sup>/g, '')}·${p.dT}·${p.La} − F_AB·${p.La}/(${f1(r.Aa)}·${p.Ea})
     = ${f4(r.dTa)} − ${(r.fa * 1e7).toLocaleString('tr-TR', { maximumFractionDigits: 4 })}·10⁻⁷·F_AB
δ_ç  = (0,5·F_AB)·${p.Ls}/(${f2(r.As)}·${p.Es}) = ${(r.fs / 2 * 1e6).toLocaleString('tr-TR', { maximumFractionDigits: 4 })}·10⁻⁶·F_AB
Eşitle:  F_AB = ${f4(r.dTa)} / ${sci(r.fa + r.fs / 2, 4).replace(/<\/?sup>/g, '')} = ${fmt(r.F, 0)} N ;  F_ç = ${fmt(r.Fs, 0)} N
(a) δ_al = δ_ç = ${f4(r.d)} mm  (ikisi de uzar)
(b) σ_al = −${fmt(r.F, 0)}/${f1(r.Aa)} = ${f2(r.sa)} MPa (bası)
    σ_ç  = ${fmt(r.Fs, 0)}/${f2(r.As)} = ${f2(r.ss)} MPa (çekme)`,
  tuzak: ['<b>Çeliğin α\'sını kullanmak.</b> Sadece alüminyum ısıtılıyor; çeliğin ısıl uzaması yok. α<sub>ç</sub> tuzak veri.',
    '<b>İki çeliği unutmak.</b> Her çelik çubuk F<sub>AB</sub>/2 taşır. 1/2\'yi unutursan kuvvet de gerilme de yanlış çıkar.',
    '<b>"Toplam boy değişimi sıfır" demek.</b> Burada duvar yok; parçalar paralel: δ<sub>al</sub> = δ<sub>ç</sub>, ikisi de uzar.',
    '<b>Alüminyumun uzamasını sadece α·ΔT·L sanmak.</b> O serbest uzama (0,5568 mm). Çelikler geri ittiği için gerçek uzama daha az.',
    '<b>ΔT\'yi 100 almak.</b> Montaj 20 °C\'de: ΔT = 100 − 20 = 80 °C.',
    '<b>Gerilmeyi aynı kuvvetle hesaplamak.</b> σ<sub>al</sub> = F<sub>AB</sub>/A<sub>al</sub>, σ<sub>ç</sub> = (F<sub>AB</sub>/2)/A<sub>ç</sub>.'],
  hoca: `<p>Hocanın sonuçları: F<sub>AB</sub> = 2F<sub>D</sub> = 2F<sub>H</sub>; δ<sub>al</sub> = 0,5568 − 6,459·10⁻⁷·F<sub>AB</sub>, δ<sub>çelik</sub> = 3,4104·10⁻⁶·F<sub>AB</sub>; F<sub>AB</sub> = 137 265,8 N; σ<sub>al</sub> = 21,57 MPa, σ<sub>çelik</sub> = 218,45 MPa; δ<sub>al</sub> = δ<sub>çelik</sub> = 0,4681 mm.</p>
    <p>Bizim hesap: F<sub>AB</sub> = 137 263 N, F<sub>ç</sub> = 68 631 N, σ<sub>al</sub> = −21,58 MPa (bası), σ<sub>ç</sub> = 218,46 MPa (çekme), δ = 0,4681 mm. Yol ve sonuç aynı.</p>
    <p>Küçük farklar: (1) Kuvvetteki 3 N\'luk fark, hocanın katsayıyı 6,459·10⁻⁷ diye kesmesinden (tam değer 6,4599·10⁻⁷); binde birin altında. (2) Hoca σ<sub>çelik</sub> satırında F<sub>H</sub> = 68 628,4 N yazmış; kendi F<sub>AB</sub>\'sinin yarısı 68 632,9 N olmalı (yazım hatası, sonuç etkilenmemiş). (3) Cevap anahtarında başlıklar ters: gerilmeler "a)", boy değişimleri "b)" altında yazılmış; soruda (a) boy değişimi, (b) gerilme. (4) σ<sub>al</sub> işaretsiz yazılmış; alüminyum <b>basıda</b>, sınavda eksi ya da "(bası)" yaz.</p>`,
  gen() {
    const m = pick([[73000, 23.2e-6], [70000, 23e-6], [70000, 23.6e-6]]);
    const La = rnd(200, 400, 50);
    return { La, da: rnd(60, 100, 10), Ea: m[0], aa: m[1], Ls: La + rnd(100, 200, 50), ds: rnd(16, 30, 2), Es: pick([200000, 210000]), as: pick([11.7e-6, 12e-6]), dT: rnd(40, 90, 5), dTs: 0 };
  },
  pracText: p => `Aynı düzen: rijit A ve B arasında alüminyum çubuk (L = ${p.La} mm, d = ${p.da} mm, E = ${fmt(p.Ea / 1000, 0)} GPa, α = ${sci(p.aa, 2)} 1/°C). Üstte ve altta iki çelik çubuk (L = ${p.Ls} mm, d = ${p.ds} mm, E = ${fmt(p.Es / 1000, 0)} GPa, α = ${sci(p.as, 2)} 1/°C). Montajda gerilmesiz; sadece alüminyum ${p.dT} °C ısıtılıyor. F_AB, ortak boy değişimi δ ve gerilmeleri bul.`,
  ans: [{ k: 'F', ad: 'F_AB (alüminyumdaki kuvvet)', u: 'N' }, { k: 'd', ad: '(a) δ_al = δ_ç', u: 'mm' }, { k: 'sa', ad: '(b) σ_al (büyüklük)', u: 'MPa', abs: 1 }, { k: 'ss', ad: '(b) σ_ç', u: 'MPa' }],
  hints: (p, r) => [`Denge: F_AB = 2·F_ç. Uygunluk: δ_al = δ_ç (A ve B rijit).`,
    `δ_al = α·ΔT·L − F_AB·f_al = ${f4(r.dTa)} − F_AB·${sci(r.fa, 4)} ; δ_ç = (F_AB/2)·f_ç, f_ç = ${p.Ls}/(E·πd²/4).`,
    `F_AB = α·ΔT·L / (f_al + f_ç/2). σ_al = F_AB/A_al, σ_ç = (F_AB/2)/A_ç.`],
  diag(p, r, u) {
    const near = (a, b) => isFinite(a) && Math.abs(a - b) <= Math.abs(b) * 0.02;
    if (near(u.F, r.Fno2) || near(u.ss, r.Fno2 / 2 / r.As) || near(u.ss, r.Fno2 / r.As)) return 'İki çelik çubuk var: her biri F_AB/2 taşır. Uygunlukta δ_ç = (F_AB/2)·f_ç yazmalısın.';
    if (near(u.F, r.Fboth)) return 'Çeliği de ısıtmışsın. Soruda yalnız alüminyum ısınıyor; çeliğin α\'sı kullanılmaz.';
    if (near(u.F, r.Frig)) return 'Alüminyumun kendi esnekliğini (−F·f_al) unutmuşsun. Alüminyum da sıkışır.';
    if (near(u.d, r.dTa)) return 'Bu serbest uzama (α·ΔT·L). Çelikler geri ittiği için gerçek uzama daha az: δ = α·ΔT·L − F_AB·f_al.';
    if (near(u.ss, r.F / r.As)) return 'Çelik gerilmesinde F_AB\'nin tamamını kullanmışsın; her çelik yarısını taşır.';
    if (near(u.d, r.back)) return 'Bu, çeliklerin geri ittiği miktar. Soru gerçek uzamayı istiyor: serbest uzama eksi bu.';
    return 'Denge F_AB = 2F_ç, uygunluk δ_al = δ_ç. Alüminyumda ısı terimi + kuvvet terimi, çelikte sadece kuvvet terimi.';
  }
});
