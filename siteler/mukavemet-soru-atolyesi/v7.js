'use strict';
/* ============ VİZE 7 · kitap 2.59: boşluklu iki çubuk + ısı ============ */
VIZE.push({
  id: 'v7', no: 7, kod: 'V7', vize: true, tip: 'hs',
  src: 'Kitap problemi 2.59 (vize PDF\'i s. 8)', img: 'img/v7.png',
  ad: 'Boşluklu bronz + alüminyum çubuk (ısı)',
  ozet: 'İki duvar arasında uç uca iki çubuk, bir uçta 0,5 mm boşluk. Isınınca önce boşluk kapanır; ancak ondan sonra kuvvet doğar.',
  soru: '82 °C\'lik bir sıcaklık artışından sonra, (a) şekilde gösterilen çubuklardaki basınç kuvvetini, (b) bronz çubuğun uzunluğundaki karşı gelen değişmeyi belirleyiniz.',
  verilen: ['Bronz: L<sub>b</sub> = 350 mm, A<sub>b</sub> = 1500 mm², E<sub>b</sub> = 105 GPa, α<sub>b</sub> = 21,6·10⁻⁶ 1/°C',
    'Alüminyum: L<sub>a</sub> = 450 mm, A<sub>a</sub> = 1800 mm², E<sub>a</sub> = 73 GPa, α<sub>a</sub> = 23,2·10⁻⁶ 1/°C',
    'Sol duvar ile bronz arasında 0,5 mm boşluk; alüminyum sağ duvara dayalı',
    'ΔT = +82 °C'],
  istenen: '(a) çubuklardaki bası kuvveti P ; (b) bronz çubuğun boy değişimi δ<sub>b</sub>',
  p0: { Lb: 350, Ab: 1500, Eb: 105000, ab: 21.6e-6, La: 450, Aa: 1800, Ea: 73000, aa: 23.2e-6, gap: 0.5, dT: 82 },
  solve(p) {
    const fb = p.Lb / (p.Eb * p.Ab), fa = p.La / (p.Ea * p.Aa);
    const dTb = p.ab * p.dT * p.Lb, dTa = p.aa * p.dT * p.La, dTt = dTb + dTa;
    const kap = dTt > p.gap, ex = Math.max(0, dTt - p.gap);
    const P = ex / (fb + fa), Pk = P / 1000;
    const dLb = dTb - P * fb, dLa = dTa - P * fa;
    const Tc = p.gap / (p.ab * p.Lb + p.aa * p.La); // boşluğun kapandığı sıcaklık artışı
    return { fb, fa, dTb, dTa, dTt, kap, ex, P, Pk, dLb, dLa, Tc, Pb: P * fb, Pa: P * fa,
      sb: -P / p.Ab, sa: -P / p.Aa, P0: dTt / (fb + fa), chk: dLb + dLa };
  },
  anlam: [
    ['0,5 mm boşluk', 'Çubuklar ancak <b>0,5 mm uzadıktan sonra</b> sol duvara değer. Uzamanın ilk 0,5 mm\'si serbest: kuvvet yok, gerilme yok.'],
    ['82 °C sıcaklık artışı', 'İki çubuk da kendi α\'sıyla uzamak ister: δ = α·ΔT·L. Sağ uç duvara dayalı, bu yüzden uzama sola, boşluğa doğru.'],
    ['çubuklardaki basınç kuvveti', 'Çubuklar uç uca (seri): ikisinde de <b>aynı P</b> var. Tek bilinmeyen P.'],
    ['bronz çubuğun uzunluğundaki değişme', 'Net değişim = ısıdan gelen uzama − P\'nin yaptığı kısalma. Bronz yine uzar, ama serbest kalsaydı uzayacağından az.'],
    ['E = 105 GPa, 73 GPa', 'N ve mm ile çalış: 105 GPa = 105 000 N/mm², 73 GPa = 73 000 N/mm².']
  ],
  tetik: ['iki duvar arasında', 'boşluk (0,5 mm)', 'sıcaklık artışı', 'farklı E ve α', 'basınç kuvveti'],
  tetikNot: 'İki duvar + ısı = P5/P6 tarifi. Yeni olan tek şey boşluk: uygunluk denklemi "toplam boy değişimi = 0" yerine "toplam boy değişimi = 0,5 mm" olur. Ve önce "boşluk kapanıyor mu?" diye bakarsın.',
  zincir: [
    ['Başta kuvvet var mı?', 'Yok. Alüminyum sağ duvara değiyor ama solda 0,5 mm boşluk var: kimse kimseyi itmiyor.'],
    ['Isınınca ne olur?', 'İkisi de uzar. Sağ uç duvarda, o yüzden çubuklar sola, boşluğa doğru büyür.'],
    ['Boşluk kapanır mı?', 'Duvar yokmuş gibi serbest uzamayı hesapla, 0,5 mm ile karşılaştır. Küçükse P = 0, soru biter.'],
    ['Kapanırsa?', 'Fazlası (δ<sub>T</sub> − 0,5) duvarlarca geri bastırılır. Seri bağlı: iki çubukta aynı P. P·(f<sub>b</sub> + f<sub>a</sub>) = δ<sub>T</sub> − 0,5.'],
    ['Bronzun boy değişimi?', 'Isıyla uzar, P ile kısalır: δ<sub>b</sub> = α<sub>b</sub>ΔTL<sub>b</sub> − P·f<sub>b</sub>. Sağlama: δ<sub>b</sub> + δ<sub>a</sub> = 0,5 mm.']
  ],
  get cam() { const nar = typeof window !== 'undefined' && window.innerWidth < 700; return { yaw: -0.1, pitch: 0.26, dist: nar ? 17.5 : 13.4, t: [3.9, 0.25, 0] }; }, // dar ekranda duvar okları kadraja sığsın
  steps: [
    { t: 'Şekle bak', st: { dim: 1, gd: 1, lab: 1 },
      h: () => 'U biçiminde bir oluk: iki duvar ve taban. Solda ince bronz çubuk, sağda kalın alüminyum çubuk, uç uca. Alüminyumun sağ ucu sağ duvara değiyor; bronzun sol ucu ile sol duvar arasında <b>0,5 mm boşluk</b> var. Boşluk görünsün diye çok büyütülerek çizildi.' },
    { t: 'Duvar yokmuş gibi: serbest uzama', st: { gd: 1, lab: 1, ghost: 1, fd: 1 },
      h: (p, r) => `Sol duvar olmasaydı iki çubuk ${p.dT} °C ısınınca serbestçe uzardı. Sağ uç duvara dayalı olduğu için uzama sola doğru olur. Saydam kırmızı parça: serbest uzama (çok büyütülmüş). Boşluğu geçip duvarın içine kadar uzanıyor.`,
      f: (p, r) => `δ<sub>T,b</sub> = α<sub>b</sub>·ΔT·L<sub>b</sub> = ${sci(p.ab)} · ${p.dT} · ${p.Lb} = ${f3(r.dTb)} mm<br>δ<sub>T,a</sub> = α<sub>a</sub>·ΔT·L<sub>a</sub> = ${sci(p.aa)} · ${p.dT} · ${p.La} = ${f3(r.dTa)} mm<br>δ<sub>T</sub> = ${f3(r.dTb)} + ${f3(r.dTa)} = <b>${f3(r.dTt)} mm</b>`,
      why: 'Isı tek başına gerilme yaratmaz. Gerilme, uzama ENGELLENİRSE doğar. Bu yüzden önce "engellenmeseydi ne kadar uzardı?" diye bakıyoruz.' },
    { t: 'Boşluk kapanır mı?', st: { anim: 1, lab: 1, gd: 0 },
      h: (p, r) => `Sıcaklığı yavaşça artırıp azaltıyoruz. Çubuklar uzar, boşluk daralır. <b>Boşluk kapanana kadar kuvvet sıfır.</b> Bronz duvara değdiği an duvar itmeye başlar ve P hızla büyür; çubuklar maviye döner (bası).`,
      f: (p, r) => `δ<sub>T</sub> = ${f3(r.dTt)} mm ${r.kap ? '&gt;' : '≤'} ${f2(p.gap)} mm → ${r.kap ? '<b>boşluk kapanır, kuvvet doğar</b>' : '<b>boşluk kapanmaz, P = 0</b>'}<br>Temas sıcaklığı: ΔT<sub>temas</sub> = ${f2(p.gap)} / (α<sub>b</sub>L<sub>b</sub> + α<sub>a</sub>L<sub>a</sub>) = <b>${f1(r.Tc)} °C</b>`,
      why: 'Sınavda bu kontrolü bir satırla yaz. δ_T boşluktan küçük çıksaydı çubuklar duvara hiç değmezdi: P = 0 ve bronzun boy değişimi sadece α·ΔT·L olurdu.' },
    { t: 'Fazlası duvarlarca bastırılır', st: { tq: 1, ghost: 1, over: 1, lab: 1, colr: 1 },
      h: (p, r) => `Serbest uzamanın ${f2(p.gap)} mm\'si boşluğa sığar. Geri kalanı duvarın içine girmek ister (kırmızı ölçü). Duvar buna izin vermez: çubukları bu kadar <b>geri bastırır</b>. Çubuklar artık boşluğu tam dolduruyor.`,
      f: (p, r) => `bastırılacak = δ<sub>T</sub> − boşluk = ${f3(r.dTt)} − ${f2(p.gap)} = <b>${f3(r.ex)} mm</b>`,
      why: 'Uygunluk denklemi: çubukların gerçek toplam boy değişimi = boşluk. Yani δ_T − P·(f_b + f_a) = 0,5. Boşluksuz sorularda (P5, P6) sağ taraf 0\'dı.' },
    { t: 'Her çubuk ne kadar yumuşak? f = L/(EA)', st: { tq: 1, lab: 1, fv: 1, colr: 1 },
      h: () => 'f: 1 N kuvvetin çubuğu kaç mm kısalttığı. İki çubuk uç uca, aynı P\'yi taşıyor; bastırılacak miktar ikisinin kısalmalarının toplamı.',
      f: (p, r) => `f<sub>b</sub> = ${p.Lb} / (${fmt(p.Eb, 0)} · ${p.Ab}) = ${sci(r.fb)} mm/N<br>f<sub>a</sub> = ${p.La} / (${fmt(p.Ea, 0)} · ${p.Aa}) = ${sci(r.fa)} mm/N` },
    { t: '(a) Bası kuvveti P', st: { tq: 1, lab: 1, reac: 1, colr: 1 },
      h: () => 'İki duvar çubukları içeri doğru iter. Çubuklar seri: ikisinde de aynı P (mavi, bası).',
      f: (p, r) => `P·(f<sub>b</sub> + f<sub>a</sub>) = δ<sub>T</sub> − boşluk<br>P = ${f3(r.ex)} / ${sci(r.fb + r.fa)} = ${fmt(r.P, 0)} N ≈ <b>${f1(r.Pk)} kN</b> (bası)`,
      why: 'Gerilmeler (sorudaki sayılarla): σ_b = −172 839/1500 ≈ −115,2 MPa, σ_a = −172 839/1800 ≈ −96,0 MPa. Kuvvet aynı, alan farklı; kesiti küçük olan bronzda gerilme daha büyük.' },
    { t: '(b) Bronzun boy değişimi', st: { tq: 1, lab: 1, reac: 1, colr: 1, db: 1 },
      h: (p, r) => `Bronz ısıyla ${f3(r.dTb)} mm uzamak istedi, P onu ${f3(r.Pb)} mm geri itti. Net: <b>uzadı</b>, ama serbest halinden az. Kesikli çizgiler çubukların ısınmadan önceki uçları.`,
      f: (p, r) => `δ<sub>b</sub> = α<sub>b</sub>ΔTL<sub>b</sub> − P·f<sub>b</sub> = ${f3(r.dTb)} − ${f3(r.Pb)} = <b>${f3(r.dLb)} mm</b> (uzama)<br>Sağlama: δ<sub>a</sub> = ${f3(r.dTa)} − ${f3(r.Pa)} = ${f3(r.dLa)} mm ; δ<sub>b</sub> + δ<sub>a</sub> = ${f3(r.chk)} mm = boşluk ✓`,
      why: 'İki çubuğun gerçek uzamalarının toplamı boşluğa eşit olmalı; çünkü çubuklar şimdi iki duvar arasını tam dolduruyor. Bu sağlama hesap hatasını hemen yakalar.' }
  ],
  scene(v, p, r) {
    const s = 0.01, Lbw = p.Lb * s, Law = p.La * s, Lt = Lbw + Law;
    const hb = 0.5, db = 0.6, ha = 0.85, da = 0.75, BR = '#c98a62';
    const bro = v.add(shift(E3.box(Lbw, hb, db), -Lbw / 2, 0, 0), { color: BR, pos: [Lbw, 0, 0] });
    const alu = v.add(shift(E3.box(Law, ha, da), -Law / 2, 0, 0), { color: C.alu, pos: [Lt, 0, 0] });
    // serbest uzamanın, çubuğun şu anki sol ucunun ötesine taşan kısmı (duvar yokmuş gibi)
    const gh = v.add(shift(E3.box(1, hb + 0.04, db + 0.04), -0.5, 0, 0), { color: C.red, alpha: 0, edge: 0, bias: -1, pos: [0, 0, 0] });
    const WC = '#2a323c', yF = -0.95;
    const wL = v.add(shift(E3.box(0.5, 2.3, 2), -0.25, 0, 0), { color: WC, pos: [0, 0.05, 0], bias: 0.5 });
    v.add(shift(E3.box(0.5, 2.3, 2), 0.25, 0, 0), { color: WC, pos: [Lt, 0.05, 0], bias: 0.5 });
    const fl = v.add(shift(E3.box(1, 0.3, 2), 0.5, 0, 0), { color: WC, pos: [0, yF - 0.15, 0], bias: 0.6 });
    const def = { dim: 0, gd: 0, lab: 0, ghost: 0, fd: 0, anim: 0, tq: 0, over: 0, fv: 0, reac: 0, colr: 0, db: 0 };
    const state = dTc => {
      const fr = dTc * (p.ab * p.Lb + p.aa * p.La), P = fr > p.gap ? (fr - p.gap) / (r.fb + r.fa) : 0;
      return { fr, P, db: p.ab * dTc * p.Lb - P * r.fb, da: p.aa * dTc * p.La - P * r.fa };
    };
    return {
      def, apply(S, time, v) {
        const G = 0.5 + 1.2 * S.ex, gW = p.gap * G, xW = -gW; // sol duvarın iç yüzü
        const tau = S.tq * (1 - S.anim) + loop(time, 0.55) * S.anim, Tc = tau * p.dT, st = state(Tc);
        const daW = st.da * G, dbW = st.db * G, xC = Lbw - daW, xL = xC - Lbw - dbW;
        alu.scl = [(Law + daW) / Law, 1, 1];
        bro.pos = [xC, 0, 0]; bro.scl = [(Lbw + dbW) / Lbw, 1, 1];
        wL.pos = [xW, 0.05, 0];
        fl.pos = [xW - 0.5, yF - 0.15, 0]; fl.scl = [Lt + gW + 1, 1, 1];
        const pr = r.P > 0 ? Math.min(1, st.P / r.P) : 0, cm = Math.max(S.colr, S.anim) * pr;
        bro.color = mixHex(BR, C.comp, cm * 0.85); alu.color = mixHex(C.alu, C.comp, cm * 0.85);
        // serbest uzama hayaleti (duvar yokmuş gibi, tam ΔT)
        const xFree = -r.dTt * G * S.ghost;
        gh.alpha = S.ghost * 0.45; gh.pos = [xL, 0, 0]; gh.scl = [Math.max(0.001, xL - xFree), 1, 1];
        const O = v.ov, yT = 1.2;
        O.push({ k: 'hatch', a: [xW - 0.5, yF - 0.3, 1], b: [xW - 0.5, 1.2, 1], n: [-0.3, -0.25, 0], color: C.mute });
        O.push({ k: 'hatch', a: [Lt + 0.5, yF - 0.3, 1], b: [Lt + 0.5, 1.2, 1], n: [0.3, -0.25, 0], color: C.mute });
        if (S.lab > 0.01) {
          O.push({ k: 'text', t: 'Bronz', p: [xL + Lbw / 2, -0.55, db / 2], size: 15, color: '#e0a47c', alpha: S.lab });
          O.push({ k: 'text', t: 'Alüminyum', p: [xC + Law / 2, -0.67, da / 2], size: 15, alpha: S.lab });
        }
        O.push({ k: 'dim', a: [0, ha / 2, 0], b: [Lbw, ha / 2, 0], off: [0, yT - ha / 2, 0], t: `${p.Lb} mm`, alpha: S.dim });
        O.push({ k: 'dim', a: [Lbw, ha / 2, 0], b: [Lt, ha / 2, 0], off: [0, yT - ha / 2, 0], t: `${p.La} mm`, alpha: S.dim });
        O.push({ k: 'dim', a: [xW, 1.15, 0], b: [0, 1.15, 0], off: [0, 0.75, 0], t: `boşluk ${f2(p.gap)} mm`, tdx: -30, tdy: -12, color: C.red, alpha: S.gd });
        if (S.fd > 0.01) {
          O.push({ k: 'dim', a: [xFree, -hb / 2, 0], b: [0, -hb / 2, 0], off: [0, -1.45, 0], t: `δ_T = ${f3(r.dTt)} mm`, tdy: 14, color: C.red, alpha: S.fd });
          O.push({ k: 'text', t: 'sağ uç duvarda: uzama sola gider', p: [Lt - 2.2, 1.85, 0], color: C.mute, size: 13, alpha: S.fd });
        }
        if (S.over > 0.01) {
          O.push({ k: 'dim', a: [xFree, -hb / 2, 0], b: [xW, -hb / 2, 0], off: [0, -1.45, 0], t: `δ_T − boşluk = ${f3(r.ex)} mm`, tdy: 14, color: C.red, alpha: S.over });
          O.push({ k: 'text', t: 'duvarın içine giremez → geri bastırılır', p: [xW + 1.4, 1.65, 0], color: C.red, size: 14, box: 1, alpha: S.over });
        }
        // duvar kuvvetleri (anlık P ile)
        const fa = Math.max(S.reac, S.anim * Math.min(1, st.P / (0.08 * r.P + 1e-9)));
        if (fa > 0.01 && st.P > 0) {
          const lab = `P = ${f1(st.P / 1000)} kN`;
          O.push({ k: 'arrow', a: [xL - 1.4, 0, 0], b: [xL - 0.04, 0, 0], color: C.white, w: 2.6, label: lab, lp: [xL - 0.7, 0.75, 0], alpha: fa });
          O.push({ k: 'arrow', a: [Lt + 1.4, 0, 0], b: [Lt + 0.04, 0, 0], color: C.white, w: 2.6, label: lab, lp: [Lt + 0.7, 0.75, 0], alpha: fa });
        }
        if (S.anim > 0.01) {
          const gl = Math.max(0, p.gap - st.fr);
          O.push({ k: 'text', t: `ΔT = ${fmt(Tc, 0)} °C`, p: [Lt / 2, 2.35, 0], size: 18, color: C.white, box: 1, alpha: S.anim });
          O.push({ k: 'text', t: st.P > 0 ? `temas var: duvar itiyor, P = ${f1(st.P / 1000)} kN` : `boşluk ${f3(gl)} mm kaldı: P = 0`, p: [Lt / 2, 1.7, 0], size: 15, color: st.P > 0 ? C.comp : C.mute, box: 1, alpha: S.anim });
        }
        if (S.fv > 0.01) {
          O.push({ k: 'text', t: `f_b = ${f3(r.fb * 1e6)}·10⁻⁶ mm/N`, p: [xL + Lbw / 2, 1.3, 0], size: 14, box: 1, alpha: S.fv });
          O.push({ k: 'text', t: `f_a = ${f3(r.fa * 1e6)}·10⁻⁶ mm/N`, p: [xC + Law / 2, 1.3, 0], size: 14, box: 1, alpha: S.fv });
          O.push({ k: 'text', t: 'ikisinde de aynı P', p: [Lt / 2, -1.75, 0], size: 14, color: C.comp, alpha: S.fv });
        }
        if (S.db > 0.01) {
          [[0, 'bronzun eski sol ucu'], [Lbw, 'eski birleşim']].forEach(([x, t], i) => {
            O.push({ k: 'line', p: [[x, -0.7, 0.4], [x, 1.25, 0.4]], dash: [4, 4], color: C.mute, alpha: S.db });
          });
          O.push({ k: 'text', t: `δ_b = ${f3(r.dTb)} − ${f3(r.Pb)} = +${f3(r.dLb)} mm`, p: [xL + Lbw / 2, 1.55, 0], size: 14, color: '#e0a47c', box: 1, alpha: S.db });
          O.push({ k: 'text', t: `δ_a = +${f3(r.dLa)} mm`, p: [xC + Law / 2, 1.55, 0], size: 14, box: 1, alpha: S.db });
          O.push({ k: 'dim', a: [xW, -hb / 2, 0], b: [0, -hb / 2, 0], off: [0, -0.95, 0], t: `δ_b + δ_a = ${f3(r.chk)} mm`, tdx: 60, tdy: 14, color: C.red, alpha: S.db });
        }
      }
    };
  },
  whatif: {
    not: 'Sıcaklığı yavaşça düşür: bir noktadan sonra boşluk kapanmaz ve P sıfıra iner. Boşluğu büyüt: aynı sıcaklıkta kuvvet azalır.',
    s: [{ k: 'dT', ad: 'Sıcaklık artışı ΔT', min: 0, max: 150, step: 1, u: '°C' }, { k: 'gap', ad: 'Boşluk', min: 0, max: 2, step: 0.05, u: 'mm' }, { k: 'Aa', ad: 'Alüminyum kesiti A_a', min: 600, max: 3000, step: 50, u: 'mm²' }],
    out: (p, r) => `<div class="mets"><div class="m ${r.P > 0 ? 'blue' : ''}"><small>P (bası)</small><b>${f1(r.Pk)} kN</b></div><div class="m"><small>δ_b (bronz)</small><b>${f3(r.dLb)} mm</b></div><div class="m ${r.P > 0 ? 'blue' : ''}"><small>σ_b</small><b>${f1(r.sb)} MPa</b></div><div class="m ${r.P > 0 ? 'blue' : ''}"><small>σ_a</small><b>${f1(r.sa)} MPa</b></div></div>
      <p class="note">${r.kap ? `Boşluk <b>kapandı</b>: serbest uzama ${f3(r.dTt)} mm, boşluk ${f2(p.gap)} mm.` : `Boşluk <b>kapanmadı</b> (serbest uzama ${f3(r.dTt)} mm): kuvvet yok, bronz serbestçe ${f3(r.dLb)} mm uzar.`} Temas sıcaklığı ≈ <b>${f1(r.Tc)} °C</b>.</p>`
  },
  kagit: (p, r) => {
    const m6 = x => f3(x * 1e6) + '·10⁻⁶';
    return `Serbest uzama (sol duvar yokmuş gibi):
δ_T = α_b·ΔT·L_b + α_a·ΔT·L_a = ${f3(r.dTb)} + ${f3(r.dTa)} = ${f3(r.dTt)} mm
Kontrol: ${f3(r.dTt)} ${r.kap ? '>' : '≤'} ${f2(p.gap)} → ${r.kap ? 'boşluk kapanır, kuvvet doğar' : 'boşluk kapanmaz, P = 0'}
f_b = L_b/(E_b·A_b) = ${p.Lb}/(${p.Eb}·${p.Ab}) = ${m6(r.fb)} mm/N
f_a = L_a/(E_a·A_a) = ${p.La}/(${p.Ea}·${p.Aa}) = ${m6(r.fa)} mm/N
Uygunluk: δ_T − P·(f_b + f_a) = ${f2(p.gap)}   (iki çubukta aynı P)
(a) P = (${f3(r.dTt)} − ${f2(p.gap)}) / ${m6(r.fb + r.fa)} = ${fmt(r.P, 0)} N ≈ ${f1(r.Pk)} kN (bası)
(b) δ_b = α_b·ΔT·L_b − P·f_b = ${f3(r.dTb)} − ${f3(r.Pb)} = ${f3(r.dLb)} mm (uzama)
Sağlama: δ_a = ${f3(r.dTa)} − ${f3(r.Pa)} = ${f3(r.dLa)} mm ;  δ_b + δ_a = ${f3(r.chk)} mm = boşluk ✓`;
  },
  tuzak: ['<b>Boşluğu unutmak.</b> P = δ<sub>T</sub>/(f<sub>b</sub>+f<sub>a</sub>) yazarsan kuvveti çok büyük bulursun. Önce 0,5 mm\'yi çıkar.',
    '<b>"Boşluk kapanır mı?" kontrolünü atlamak.</b> δ<sub>T</sub> boşluktan küçükse kuvvet sıfırdır; negatif P bulursan bu yüzdendir.',
    '<b>Bronzun boy değişimini sadece α·ΔT·L ya da sadece P·f sanmak.</b> İkisi birlikte: ısıyla uzar, P ile kısalır.',
    '<b>GPa\'yı çevirmemek.</b> 105 GPa = 105 000 N/mm². mm ve N ile çalışırsan f mm/N çıkar.',
    '<b>Kuvveti çubuklara bölmek.</b> Uç uca (seri) çubuklarda kuvvet bölünmez; ikisinde de aynı P.'],
  gen() {
    for (let i = 0; i < 200; i++) {
      const p = { Lb: rnd(200, 500, 50), Ab: rnd(800, 2000, 100), Eb: pick([100000, 105000, 110000]), ab: pick([21.6e-6, 18e-6, 20e-6]),
        La: rnd(250, 600, 50), Aa: rnd(1000, 2500, 100), Ea: pick([70000, 73000]), aa: pick([23.2e-6, 23.6e-6, 22.5e-6]),
        gap: rnd(0.2, 0.8, 0.1), dT: rnd(40, 120, 5) };
      const r = this.solve(p);
      if (r.dTt > p.gap * 1.3 && r.dLb > 0.05 && -r.sb < 200 && -r.sa < 200) return p; // boşluk kapansın, bronz uzasın, gerilme gerçekçi
    }
    return Object.assign({}, this.p0);
  },
  pracText: p => `İki duvar arasında uç uca bronz ve alüminyum çubuk var; alüminyum sağ duvara değiyor, bronz ile sol duvar arasında ${f2(p.gap)} mm boşluk var. Bronz: L = ${p.Lb} mm, A = ${p.Ab} mm², E = ${fmt(p.Eb / 1000, 0)} GPa, α = ${f1(p.ab * 1e6)}·10⁻⁶ 1/°C. Alüminyum: L = ${p.La} mm, A = ${p.Aa} mm², E = ${fmt(p.Ea / 1000, 0)} GPa, α = ${f1(p.aa * 1e6)}·10⁻⁶ 1/°C. Sıcaklık ${p.dT} °C artıyor. (a) Çubuklardaki bası kuvveti? (b) Bronz çubuğun boy değişimi?`,
  ans: [{ k: 'Pk', ad: '(a) P (bası)', u: 'kN', abs: 1 }, { k: 'dLb', ad: '(b) δ_b (uzama +)', u: 'mm' }],
  hints: (p, r) => [`Önce serbest uzama: δ_T = ΔT·(α_b·${p.Lb} + α_a·${p.La}). ${f2(p.gap)} mm'den büyük mü?`,
    `f_b = ${p.Lb}/(${p.Eb}·${p.Ab}), f_a = ${p.La}/(${p.Ea}·${p.Aa}). P = (δ_T − ${f2(p.gap)})/(f_b + f_a), sonra kN'a çevir.`,
    'δ_b = α_b·ΔT·L_b − P·f_b. Sağlama: δ_b + δ_a = boşluk.'],
  diag(p, r, u) {
    const near = (a, b) => isFinite(a) && Math.abs(a - b) <= Math.abs(b) * 0.02;
    if (near(Math.abs(u.Pk), r.P0 / 1000)) return 'Boşluğu çıkarmamışsın. Duvar ancak boşluk kapandıktan sonra iter: P = (δ_T − boşluk)/(f_b + f_a).';
    if (near(Math.abs(u.Pk), r.P) || near(Math.abs(u.Pk), r.P / 1e6)) return 'Birim: P\'yi kN olarak yaz (N\'u 1000\'e böl).';
    if (near(u.dLb, r.dTb)) return 'Bu bronzun serbest uzaması. Duvarın bası kuvveti onu P·f_b kadar kısaltır: δ_b = α_bΔTL_b − P·f_b.';
    if (near(Math.abs(u.dLb), r.Pb)) return 'Bu sadece P\'nin yaptığı kısalma. Isıdan gelen uzamayı ekle: δ_b = α_bΔTL_b − P·f_b.';
    if (near(u.dLb, p.gap)) return 'δ_b + δ_a = boşluk; boşluğun tamamı bronza ait değil. δ_b = α_bΔTL_b − P·f_b.';
    if (isFinite(u.dLb) && !isFinite(u.Pk)) return '(b) için P doğruydu; δ_b = α_bΔTL_b − P·f_b formülünü sayılarla tekrar kur.';
    return 'Sıra: serbest uzama → boşluk kapanır mı → P = (δ_T − boşluk)/(f_b + f_a) → δ_b = α_bΔTL_b − P·f_b.';
  },
  hoca: `<p>Bu soru PDF'te kitap problemi olarak (Beer–Johnston, 2.59) verilmiş; yanında <b>hocanın çözümü ya da cevap anahtarı yok</b>. Aşağıdaki sonuçlar bu sayfanın kendi hesabı:</p>
  <p>(a) P ≈ <b>172,8 kN</b> (bası; 172 839 N) · (b) δ<sub>b</sub> ≈ <b>+0,236 mm</b> (bronz uzar)</p>
  <p>Kendini kontrol etmenin yolu: alüminyumun boy değişimi δ<sub>a</sub> ≈ 0,264 mm çıkar ve δ<sub>b</sub> + δ<sub>a</sub> = 0,500 mm, yani tam boşluk kadar olmalı. Boşluk kapanma sıcaklığı ≈ 27,8 °C; 82 °C bunun çok üstünde, kuvvet doğar.</p>`
});
