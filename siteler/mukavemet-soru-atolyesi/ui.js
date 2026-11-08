'use strict';
/* Ortak yardımcılar, tarifler, problem sayfası, 3D adım oynatıcı, alıştırma. */
const PROBS = [];
const VIZE = []; // çıkmış vize soruları (aynı nesne yapısı + kod, src, img, cevapImg, hoca)
const PAGES = {};

const fmt = (x, d = 2) => {
  if (!isFinite(x)) return '—';
  if (Math.abs(x) < Math.pow(10, -d) / 2) x = 0; // −0 ve "−0,00" görünmesin
  const s = Math.abs(x) >= 10000 ? Math.round(x).toLocaleString('tr-TR') : Math.abs(x) >= 1000 ? x.toLocaleString('tr-TR', { maximumFractionDigits: Math.min(d, 1) }) : x.toLocaleString('tr-TR', { maximumFractionDigits: d, minimumFractionDigits: 0 });
  return s.replace(/\./g, ' ').replace(/^-/, '−'); // binlik ayracı ince boşluk: 16 250 (ondalık virgülle karışmasın)
};
const f1 = x => fmt(x, 1), f2 = x => fmt(x, 2), f3 = x => fmt(x, 3), f4 = x => fmt(x, 4);
const sci = (x, d = 3) => { if (!isFinite(x)) return '—'; if (x === 0) return '0'; let e = Math.floor(Math.log10(Math.abs(x))); let m = x / Math.pow(10, e); if (Math.abs(+m.toFixed(d)) >= 10) { e++; m /= 10; } return `${m.toLocaleString('tr-TR', { maximumFractionDigits: d })}·10<sup>${String(e).replace('-', '−')}</sup>`; };
const parseNum = s => {
  if (s == null) return NaN;
  s = String(s).trim().replace(/[\s  ]/g, '').replace(/[−–]/g, '-');
  if (s === '') return NaN;
  const sup = { '⁻': '-', '⁰': '0', '¹': '1', '²': '2', '³': '3', '⁴': '4', '⁵': '5', '⁶': '6', '⁷': '7', '⁸': '8', '⁹': '9' };
  s = s.replace(/[⁻⁰¹²³⁴⁵⁶⁷⁸⁹]/g, c => '^' + sup[c]).replace(/\^(?=\^)/g, '').replace(/\^-?\^/g, m => m.includes('-') ? '^-' : '^');
  const mm = s.match(/^([+-]?[\d.,]+)[x×*·]10\^?([+-]?\d+)$/i);
  const num = t => { if (t.includes(',') && t.includes('.')) t = t.lastIndexOf(',') > t.lastIndexOf('.') ? t.replace(/\./g, '').replace(',', '.') : t.replace(/,/g, ''); else t = t.replace(',', '.'); return Number(t); };
  if (mm) return num(mm[1]) * Math.pow(10, +mm[2]);
  return num(s);
};
const store = {
  get(k, d) { try { const v = localStorage.getItem('sa:' + k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
  set(k, v) { try { localStorage.setItem('sa:' + k, JSON.stringify(v)); } catch (e) { } }
};
const rnd = (a, b, step) => { const n = Math.round((b - a) / step); return +(a + step * Math.floor(Math.random() * (n + 1))).toFixed(6); };
const pick = arr => arr[Math.floor(Math.random() * arr.length)];
const h = (tag, cls, inner) => `<${tag}${cls ? ` class="${cls}"` : ''}>${inner}</${tag}>`;
const mixHex = (a, b, t) => {
  t = Math.max(0, Math.min(1, t));
  const A = a.match(/\w\w/g).map(x => parseInt(x, 16)), B = b.match(/\w\w/g).map(x => parseInt(x, 16));
  return '#' + A.map((v, i) => Math.round(v + (B[i] - v) * t).toString(16).padStart(2, '0')).join('');
};
const shift = (m, dx, dy, dz) => ({ v: m.v.map(p => [p[0] + dx, p[1] + dy, p[2] + dz]), f: m.f });
const loop = (time, sp = 1.3) => (1 - Math.cos(time * sp)) / 2; // 0 → 1 → 0 yumuşak döngü
const C = { steel: '#97a3b0', dark: '#5f6b78', alu: '#c3cbd4', wood: '#b48a58', base: '#39424d', red: '#ff2d20', tens: '#ff4a3d', comp: '#6f9bd1', white: '#ffffff', dim: '#c9d0d8', mute: '#8e99a6' };

/* Beş tarif: bütün sorular bunlardan biri. */
const RECIPES = {
  kg: {
    ad: 'KUVVET BUL → GERİLME', kisa: 'Kuvvet bul, alana böl',
    adim: ['Yükü taşıyan parçayı ayır, üstündeki kuvvetleri çiz (SCD).',
      'Moment al: noktayı bir bilinmeyenin üstünde seç, o bilinmeyen denklemden düşer.',
      'Aynı yeri birden çok çubuk tutuyorsa (eşit paylaşırlar) kuvveti çubuk sayısına böl.',
      'Doğru alanı seç: çekmede delikli (net) kesit, basıda tam kesit.',
      'σ = F / A. Birim: N / mm² = MPa.'],
    ipucu: 'Soruda "çubuk, pim, kol, mafsal" ve "ortalama normal gerilme" varsa bu tarif.'
  },
  km: {
    ad: 'EN ZAYIF HALKA (KOPMA BİÇİMLERİ)', kisa: 'Her kopma biçimini dene, en küçüğü al',
    adim: ['Yükün yolunu izle: kuvvet hangi parçadan hangisine geçiyor?',
      'Her olası kopma için kopan ya da kayan YÜZEYİ bul (kayma: kesilen yüzey; çekme: net kesit).',
      'Her biri için taşınabilen yük: P = (izin verilen gerilme) × (o yüzeyin alanı).',
      'Sistem en zayıf halkadan kopar: en küçük P belirleyicidir.',
      'Emniyet katsayısı verildiyse: P_izin = P_kopma / E.K.'],
    ipucu: '"… MPa\'yı aşmaması", "kopma mukavemeti", "emniyet katsayısı", "en büyük P" kelimeleri bu tarifi çağırır.'
  },
  rk: {
    ad: 'RİJİT KİRİŞ + ÇUBUKLAR', kisa: 'Denge → uzama → benzer üçgen',
    adim: ['Rijit parçayı ayır, moment alarak çubuk kuvvetlerini bul.',
      'Her çubuğun boy değişimi: δ = F·L / (A·E).',
      'Rijit parça doğru kalır: noktaların yer değiştirmesi doğrusal değişir (benzer üçgen).',
      'Mafsallıysa her noktanın inişi mafsala uzaklığıyla orantılıdır: δ = x·θ.',
      'Bilinmeyen çok ise (hiperstatik): kuvvetleri θ cinsinden yaz, moment denklemine koy.'],
    ipucu: '"rijit", "yer değiştirme", "çökme", "taşıyan kollar" kelimeleri bu tarifi çağırır.'
  },
  hs: {
    ad: 'İKİ UCU TUTULU ÇUBUK (HİPERSTATİK + ISI)', kisa: 'Denge + "toplam boy değişmez"',
    adim: ['Tek denge denklemi yaz: R_A + R_B = P. İki bilinmeyen var, yetmez.',
      'Kesim yöntemiyle her parçanın iç kuvvetini tek bilinmeyenle yaz (çekme +).',
      'Uygunluk: plakalar oynamadığı için toplam boy değişimi = 0 (parçalar yan yanaysa, yani paralelse: boy değişimleri birbirine eşit).',
      'Her parça: δ = N·f + α·ΔT·L, burada f = L / (E·A) (esneklik).',
      'Çöz, sonra δ toplamının gerçekten 0 olduğunu kontrol et.'],
    ipucu: '"iki ucundan sabitlenmiş", "rijit plakalar arasında", "sıcaklık artırılırsa" bu tarifi çağırır.'
  },
  cv: {
    ad: 'CIVATA – BORU (SOMUN SIKMA)', kisa: 'Kuvvetler eşit, boy değişimleri toplamı = somun ilerlemesi',
    adim: ['Denge: cıvatadaki çekme kuvveti = borudaki bası kuvveti = F.',
      'Uygunluk: cıvatanın uzaması + borunun kısalması = somunun ilerlemesi Δ.',
      'δ = F·f yaz: F·f_ç + F·f_al = Δ → F = Δ / (f_ç + f_al).',
      'Dış yük gelirse: iki parça yükü rijitlikleriyle orantılı paylaşır.',
      'σ = F / A (cıvata çekme +, boru bası −).'],
    ipucu: '"somun … mm hareket ettiğine göre", "sıkıştırılıyor", "boru ile cıvata" bu tarifi çağırır.'
  },
  bu: {
    ad: 'BURMA (ŞAFT, DİŞLİ)', kisa: 'Tork bul, τ = T·c/J ve φ = T·L/(J·G)',
    adim: ['Torku bul: güç verildiyse T = P/ω, ω = 2πn/60 (n dev/dk).',
      'Dişli varsa: temas noktasında kuvvet aynı → T₁/r₁ = T₂/r₂ (büyük dişli, büyük tork).',
      'Gerilme: τ = T·c/J, J = π·c⁴/2 (c yarıçap). Çap isteniyorsa τ_em değerinden c çözülür.',
      'Açı: φ = T·L/(J·G) radyan. Dişliler arası: φ₁·r₁ = φ₂·r₂ (yay uzunlukları eşit).',
      'Bir ucun toplam açısı = kendi şaftının açısı + karşı dişlinin döndürdüğü açı.'],
    ipucu: '"şaft", "dişli", "tork", "kW, dev/dk", "burulma açısı" kelimeleri bu tarifi çağırır.'
  },
  mo: {
    ad: 'DÜZLEM GERİLME (MOHR ÇEMBERİ)', kisa: 'Merkez + yarıçap çiz, çemberden oku',
    adim: ['İki nokta: x yüzü (σx, τ) ve y yüzü (σy, −τ). Sağ yüzde kayma aşağıysa τ çemberde yukarı.',
      'Merkez M = (σx+σy)/2, yarıçap R = √(((σx−σy)/2)² + τ²).',
      'σmax = M + R, σmin = M − R, τmax = R. Asal açı: tan 2θ = τ / ((σx−σy)/2).',
      'Kesit θ dönerse çemberde 2θ aynı yönde dön; nokta = (M + R·cos, R·sin).',
      'Akma kontrolü: Tresca τmax ≤ σ_y/2; von Mises √(σ1² − σ1σ2 + σ2²) ≤ σ_y.'],
    ipucu: '"asal gerilme", "Mohr", "maksimum kayma", "düzlem gerilme", "akma kriteri" kelimeleri bu tarifi çağırır.'
  },
  po: {
    ad: 'BOY VE ÇAP DEĞİŞİMİ (HOOKE + POISSON)', kisa: 'ε = σ/E, enine ε = −ν·ε',
    adim: ['Gerilmeyi bul: σ = F/A (her parça kendi alanıyla).',
      'Boyuna birim uzama: ε = σ/E; boy değişimi ΔL = ε·L (= F·L/(A·E)).',
      'Enine birim uzama: ε_enine = −ν·ε (çekilen incelir). Çap değişimi Δd = ε_enine·d.',
      'İki eksenli gerilmede: εx = (σx − ν·σy)/E, εy = (σy − ν·σx)/E.',
      'Köşegen: kenar değişimlerinden Pisagor, ya da ε_köşegen ile.'],
    ipucu: '"Poisson", "çap değişimi", "kenarın / köşegenin uzunluğundaki değişme" kelimeleri bu tarifi çağırır.'
  }
};

/* ------------------ problem sayfası ------------------ */
let ACTIVE = null; // aktif 3D oynatıcı

function chipRecipe(k) { return `<a class="chip" href="#rehber-${k}">${RECIPES[k].ad}</a>`; }

function renderProblem(P) {
  const p = Object.assign({}, P.p0), r = P.solve(p);
  const done = store.get('done:' + P.id, false);
  const R = RECIPES[P.tip];
  const L = P.vize ? VIZE : PROBS, i = L.indexOf(P), prev = L[i - 1], next = L[i + 1];
  const lab = x => x.kod || `PROBLEM ${x.no}`;
  return `
  <section class="hero">
    <div class="kicker">${lab(P)} · ${R.ad}${P.src ? ` · ${P.src}` : ''}</div>
    <h1>${P.ad}</h1>
    <p class="sub">${P.ozet}</p>
    <label class="donebox"><input type="checkbox" id="donechk" ${done ? 'checked' : ''}> ANLADIM</label>
  </section>

  <section class="card">
    <h2><span class="n">01</span> SORU</h2>
    <div class="soru">
      <div class="soru-txt">
        <p>${P.soru}</p>
        <div class="verilen"><b>VERİLENLER</b><ul>${P.verilen.map(v => `<li>${v}</li>`).join('')}</ul>
        <b>İSTENEN</b><p>${P.istenen}</p></div>
      </div>
      <figure class="fig"><img src="${P.img || `img/p${P.no}.png`}" alt="${lab(P)} şekli" loading="lazy"><figcaption>Sorudaki şekil</figcaption></figure>
    </div>
  </section>

  <section class="card">
    <h2><span class="n">02</span> SORUDAN NE ANLAMALIYIM</h2>
    <p class="lead">Sorudaki her cümle sana bir şey söylüyor. Soldaki sorudan, sağdaki senin kafanda olması gereken.</p>
    <div class="anlam">${P.anlam.map(([a, b]) => `<div class="an-row"><div class="an-q">"${a}"</div><div class="an-arr">→</div><div class="an-a">${b}</div></div>`).join('')}</div>
  </section>

  <section class="card">
    <h2><span class="n">03</span> AKLINA NEREDEN GELECEK</h2>
    <div class="tetik">
      <div><div class="lbl">TETİKLEYİCİ KELİMELER</div><div class="chips">${P.tetik.map(t => `<span class="kw">${t}</span>`).join('')}</div>
        <p class="lead" style="margin-top:12px">${P.tetikNot}</p></div>
      <div class="recipe"><div class="lbl">BU BİR ${R.ad} SORUSU</div>
        <ol>${R.adim.map(a => `<li>${a}</li>`).join('')}</ol>
        <a class="more" href="#rehber-${P.tip}">Tarifin tamamı ve benzer sorular</a></div>
    </div>
    ${P.zincir ? `<div class="lbl" style="margin-top:18px">DÜŞÜNCE ZİNCİRİ · SORUYU OKURKEN KENDİNE SOR</div>
    <div class="zincir">${P.zincir.map(([q, a], i) => `<div class="zn"><div class="zq"><span>${i + 1}</span>${q}</div><div class="za">${a}</div></div>`).join('')}</div>` : ''}
  </section>

  <section class="card wide">
    <h2><span class="n">04</span> 3D ÇÖZÜM, ADIM ADIM</h2>
    <p class="lead">Sürükle: döndür · Tekerlek / iki parmak: yakınlaş · Çift tık: görünümü sıfırla · Klavye: ← →</p>
    <div class="player">
      <div class="stage"><canvas id="cv"></canvas>
        <div class="stage-ctl">
          <span class="lbl">ŞEKİL DEĞİŞİMİNİ ABART</span><input type="range" id="ex" min="0" max="1" step="0.01" value="0.6">
        </div>
      </div>
      <div class="steps">
        <div class="dots" id="dots">${P.steps.map((s, k) => `<button data-k="${k}" title="${s.t}">${k + 1}</button>`).join('')}</div>
        <div id="stepbox" class="stepbox"></div>
        <div class="nav2"><button id="sprev">◀ GERİ</button><button id="splay">OYNAT</button><button id="snext" class="pri">İLERİ ▶</button></div>
      </div>
    </div>
  </section>

  ${P.whatif ? `<section class="card">
    <h2><span class="n">05</span> YA ŞÖYLE OLSAYDI?</h2>
    <p class="lead">${P.whatif.not}</p>
    <div class="wi"><div class="wi-ctl" id="wictl"></div><div class="wi-out" id="wiout"></div></div>
  </section>` : ''}

  <section class="card two">
    <div><h2><span class="n">06</span> KÂĞIDA BÖYLE YAZ</h2>
      <p class="lead">Sınavda hocanın görmek istediği sıra. Formül kâğıdı yok; her satırın nereden geldiğini 04'te gördün.</p>
      <pre class="kagit" id="kagit"></pre></div>
    <div><h2><span class="n">07</span> TUZAKLAR</h2>
      <ul class="tuzak">${P.tuzak.map(t => `<li>${t}</li>`).join('')}</ul></div>
  </section>

  ${P.hoca || P.cevapImg ? `<section class="card">
    <h2><span class="n">★</span> HOCANIN CEVAP ANAHTARI</h2>
    ${P.hoca ? `<div class="sx">${P.hoca}</div>` : ''}
    ${P.cevapImg ? `<details class="why"><summary>CEVAP ANAHTARININ ASLINI GÖSTER</summary><div><img src="${P.cevapImg}" alt="Cevap anahtarı" style="max-width:100%;background:#fff;border-radius:8px;margin-top:8px"></div></details>` : ''}
  </section>` : ''}

  <section class="card" id="prac">
    <h2><span class="n">08</span> KENDİN DENE</h2>
    <p class="lead">Aynı soru, yeni sayılar. Önce kendin çöz, cevabını yaz, kontrol et. Takılırsan ipucu al.</p>
    <div id="pracbox"></div>
  </section>

  <div class="pager">${prev ? `<a href="#${prev.id}">◀ ${lab(prev)}</a>` : '<span></span>'}<a href="#${P.vize ? 'cikmis' : 'ana'}">TÜM SORULAR</a>${next ? `<a href="#${next.id}">${lab(next)} ▶</a>` : P.vize ? '<a href="#ana">ANA SAYFA ▶</a>' : '<a href="#cikmis">ÇIKMIŞ VİZELER ▶</a>'}</div>`;
}

function mountProblem(P) {
  const p = Object.assign({}, P.p0), r = P.solve(p);
  document.getElementById('donechk').addEventListener('change', e => { store.set('done:' + P.id, e.target.checked); buildNav(); });
  document.getElementById('kagit').innerHTML = P.kagit(p, r);
  // 3D
  const cv = document.getElementById('cv'); const view = new E3.View(cv);
  const sc = P.scene(view, p, r);
  const S = Object.assign({}, sc.def, { ex: 0.6 }), T = Object.assign({}, S);
  let k = 0, playing = false, playT = 0;
  const box = document.getElementById('stepbox'), dots = [...document.querySelectorAll('#dots button')];
  function show(n) {
    k = Math.max(0, Math.min(P.steps.length - 1, n));
    const st = P.steps[k];
    Object.assign(T, sc.def, st.st || {}); T.ex = S.ex;
    view.setCam(Object.assign({}, P.cam, st.cam || {}));
    box.innerHTML = `<div class="sn">ADIM ${k + 1} / ${P.steps.length}</div><h3>${st.t}</h3><div class="sx">${st.h(p, r)}</div>
      ${st.f ? `<div class="fm">${st.f(p, r)}</div>` : ''}
      ${st.why ? `<details class="why"><summary>NEDEN BÖYLE?</summary><div>${st.why}</div></details>` : ''}`;
    dots.forEach((d, i) => d.classList.toggle('on', i === k));
    dots.forEach((d, i) => d.classList.toggle('past', i < k));
    playT = 0;
  }
  dots.forEach(d => d.addEventListener('click', () => { playing = false; upd(); show(+d.dataset.k); }));
  document.getElementById('sprev').onclick = () => { playing = false; upd(); show(k - 1); };
  document.getElementById('snext').onclick = () => { playing = false; upd(); show(k + 1); };
  const pb = document.getElementById('splay');
  function upd() { pb.textContent = playing ? 'DURDUR' : 'OYNAT'; pb.classList.toggle('on', playing); }
  pb.onclick = () => { playing = !playing; if (playing && k === P.steps.length - 1) show(0); upd(); };
  const ex = document.getElementById('ex'); ex.oninput = () => { S.ex = T.ex = +ex.value; };
  view.onFrame = (dt, time) => {
    const a = 1 - Math.exp(-dt * 3.2);
    for (const key in T) if (typeof T[key] === 'number') S[key] = (S[key] ?? T[key]) + (T[key] - (S[key] ?? T[key])) * a;
    if (playing) { playT += dt; if (playT > 7) { if (k < P.steps.length - 1) show(k + 1); else { playing = false; upd(); } } }
    view.ov = [];
    sc.apply(S, time, view);
  };
  show(0); view.start();
  ACTIVE = { view, key: e => { if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') { e.preventDefault(); playing = false; upd(); show(k + (e.key === 'ArrowRight' ? 1 : -1)); } } };
  // ya şöyle olsaydı
  if (P.whatif) mountWhatIf(P);
  mountPractice(P);
}

function mountWhatIf(P) {
  const W = P.whatif, q = Object.assign({}, P.p0);
  const ctl = document.getElementById('wictl'), out = document.getElementById('wiout');
  ctl.innerHTML = W.s.map(s => `<div class="sl"><label>${s.ad}</label><input type="range" data-k="${s.k}" min="${s.min}" max="${s.max}" step="${s.step}" value="${q[s.k]}"><span class="v" id="wv-${s.k}"></span></div>`).join('')
    + `<button class="mini" id="wireset">SORUDAKİ DEĞERLERE DÖN</button>`;
  const draw = () => {
    W.s.forEach(s => { document.getElementById('wv-' + s.k).textContent = fmt(q[s.k], 3) + ' ' + (s.u || ''); });
    out.innerHTML = W.out(q, P.solve(q));
  };
  ctl.querySelectorAll('input').forEach(inp => inp.addEventListener('input', () => { q[inp.dataset.k] = +inp.value; draw(); }));
  document.getElementById('wireset').onclick = () => { Object.assign(q, P.p0); ctl.querySelectorAll('input').forEach(inp => inp.value = q[inp.dataset.k]); draw(); };
  draw();
}

function mountPractice(P) {
  const box = document.getElementById('pracbox');
  let p, r, hint = 0, tries = 0, counted = false;
  const stats = store.get('stat:' + P.id, { ok: 0, n: 0 });
  function newQ() {
    p = P.gen(); r = P.solve(p); hint = 0; tries = 0; counted = false;
    box.innerHTML = `
      <div class="pq"><p>${P.pracText(p)}</p></div>
      <div class="ans">${P.ans.map(a => `<div class="ai"><label>${a.ad}</label><input inputmode="decimal" data-k="${a.k}" placeholder="?"><span class="u">${a.u}</span><span class="res" id="res-${a.k}"></span></div>`).join('')}</div>
      <div class="pbtn"><button class="pri" id="pchk">KONTROL ET</button><button id="phint">İPUCU</button><button id="psol">ÇÖZÜMÜ GÖSTER</button><button id="pnew">YENİ SAYILAR</button>
      <span class="stat">Doğru: ${stats.ok} / ${stats.n}</span></div>
      <div id="phbox" class="hintbox"></div><div id="psolbox"></div>`;
    document.getElementById('pchk').onclick = check;
    document.getElementById('phint').onclick = () => {
      const H = P.hints(p, r); if (hint < H.length) hint++;
      document.getElementById('phbox').innerHTML = H.slice(0, hint).map((t, i) => `<div class="hint"><b>İPUCU ${i + 1}</b> ${t}</div>`).join('') + (hint >= H.length ? '<div class="hint dim">İpucu bitti. Hâlâ takılıyorsan çözümü aç ve takıldığın adımı 3D çözümde tekrar izle.</div>' : '');
    };
    document.getElementById('psol').onclick = () => {
      document.getElementById('psolbox').innerHTML = `<div class="sol"><div class="lbl">ÇÖZÜM (BU SAYILARLA)</div>${P.steps.filter(s => !s.skipPrac).map((s, i) => `<div class="sol-st"><b>${i + 1}. ${s.t}</b><div>${s.h(p, r)}</div>${s.f ? `<div class="fm">${s.f(p, r)}</div>` : ''}</div>`).join('')}<pre class="kagit">${P.kagit(p, r)}</pre></div>`;
    };
    document.getElementById('pnew').onclick = newQ;
    box.querySelectorAll('input').forEach(inp => inp.addEventListener('keydown', e => { if (e.key === 'Enter') check(); }));
  }
  function check() {
    let all = true, any = false, blank = false; tries++;
    P.ans.forEach(a => {
      const inp = box.querySelector(`input[data-k="${a.k}"]`), v = parseNum(inp.value), want = r[a.k];
      const el = document.getElementById('res-' + a.k);
      if (isNaN(v)) { el.innerHTML = '<span class="bad">boş</span>'; inp.classList.remove('ok', 'bad'); all = false; blank = true; return; }
      any = true;
      const tol = a.tol ?? 0.02;
      const okv = a.abs ? Math.abs(Math.abs(v) - Math.abs(want)) <= Math.abs(want) * tol + 1e-9 : Math.abs(v - want) <= Math.abs(want) * tol + 1e-9;
      el.innerHTML = okv ? '<span class="ok">✓</span>' : `<span class="bad">✗</span>`;
      inp.classList.toggle('ok', okv); inp.classList.toggle('bad', !okv);
      if (!okv) all = false;
    });
    if (!any) return;
    if (!counted && !blank) { counted = true; stats.n++; if (all) stats.ok++; store.set('stat:' + P.id, stats); }
    const st = box.querySelector('.stat'); if (st) st.textContent = `Doğru: ${stats.ok} / ${stats.n}`;
    if (!all) {
      // teşhise sadece yanlış cevaplar gider; doğrular NaN olur, böylece doğru alan yüzünden yanlış teşhis çıkmaz
      const u = Object.fromEntries(P.ans.map(a => { const inp = box.querySelector(`input[data-k="${a.k}"]`); return [a.k, inp.classList.contains('bad') ? parseNum(inp.value) : NaN]; }));
      const d = P.diag ? P.diag(p, r, u) : '';
      document.getElementById('phbox').innerHTML = d ? `<div class="hint warn"><b>NEREDE KAYDIN?</b> ${d}</div>` : '';
    } else document.getElementById('phbox').innerHTML = '<div class="hint good"><b>TAMAM.</b> Hepsi doğru. Bir tane daha çöz, sonra sonraki probleme geç.</div>';
  }
  newQ();
}
