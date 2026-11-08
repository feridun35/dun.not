'use strict';
/* ---------- tanıma rehberi ---------- */
const TREE = [
  { q: 'Soruda cıvata ve boru birlikte var mı, "somun … mm ilerledi / döndü" diyor mu?', y: 'cv' },
  { q: 'Tek bir çubuğun İKİ ucu da sabit mi? (iki duvar, iki rijit plaka arasında; ısı ya da yük verilmiş olabilir)', y: 'hs' },
  { q: '"Rijit" bir kiriş / parça var mı (çubuklar ya da yay onu taşıyor) ve kuvvet ya da bir noktanın inişi mi soruluyor? Çubuk sayısı fazla olsa da tarif bu.', y: 'rk' },
  { q: 'Birden çok sınır (… MPa\'yı aşmasın, kopma mukavemeti) veya emniyet katsayısı var mı, "en büyük P" mi soruluyor?', y: 'km' },
  { q: 'Kol / çubuk / pim sistemi var mı ve bir elemandaki gerilme mi soruluyor?', y: 'kg' }
];
const KEYW = [
  ['somun ilerledi, sıkıştırılıyor, boru ve cıvata', 'cv', 'P7'],
  ['iki ucundan sabitlenmiş, rijit plakalar arasında', 'hs', 'P5, P6'],
  ['sıcaklık artırılırsa, termik gerilme', 'hs', 'P5, P6 (iki uç tutuluysa)'],
  ['rijit eleman / kiriş, yer değiştirme, çökme, kollar taşıyor', 'rk', 'P4, P8 (çubuk fazla olsa da)'],
  ['mafsal + yay + çubuk', 'rk', 'P8'],
  ['kayma gerilmesi … aşmaması, en büyük P', 'km', 'P2'],
  ['kopma mukavemeti, emniyet katsayısı', 'km', 'P3'],
  ['ortalama normal gerilme, pim çapı, bağlantı çubuğu', 'kg', 'P1'],
  ['iki kuvvet elemanı, kafes, kol', 'kg', 'P1']
];

PAGES.rehber = (sub) => `
  <section class="hero center">
    <div class="kicker">ADIM 0</div><h1>TANIMA REHBERİ</h1>
    <p class="sub">Soruyu okuyunca ilk iş: "bu hangi tarif?" Soruları sırayla cevapla; ilk "evet" tarifin. Sıra önemli: üstteki soru alttakinden önce gelir.</p>
  </section>
  <section class="card">
    <h2><span class="n">01</span> KARAR AĞACI</h2>
    <p class="lead">Bir soru düşün (ya da bir problemi aç) ve sırayla cevapla.</p>
    <div id="tree" class="tree"></div>
  </section>
  <section class="card">
    <h2><span class="n">02</span> KELİME → TARİF</h2>
    <div class="kwt">${KEYW.map(([k, t, ex]) => `<div class="kwr"><div class="kw">${k}</div><div class="an-arr">→</div><div><a href="#rehber-${t}">${RECIPES[t].ad}</a><small>${ex}</small></div></div>`).join('')}</div>
  </section>
  ${TIP_ORDER.map((k, i) => {
    const R = RECIPES[k], ex = PROBS.filter(P => P.tip === k);
    return `<section class="card" id="rehber-${k}">
      <h2><span class="n">T${i + 1}</span> ${R.ad}</h2>
      <p class="lead">${R.kisa}. ${R.ipucu}</p>
      <ol class="recipe-l">${R.adim.map(a => `<li>${a}</li>`).join('')}</ol>
      <div class="exl">Bu tarifle çözülen: ${ex.map(P => `<a class="chip" href="#${P.id}">P${P.no} · ${P.ad}</a>`).join(' ')}</div>
    </section>`;
  }).join('')}
  <section class="card">
    <h2><span class="n">!</span> BİRİM KÂĞIDI</h2>
    <div class="units">
      <div><b>N / mm² = MPa</b><span>Kuvvet N, alan mm² ise gerilme doğrudan MPa.</span></div>
      <div><b>kN × 1000 = N</b><span>Gerilmeden önce kN'yi çevir.</span></div>
      <div><b>GPa × 1000 = N/mm²</b><span>E = 70 GPa = 70 000 N/mm².</span></div>
      <div><b>N/m ÷ 1000 = N/mm</b><span>k = 200 N/m = 0,2 N/mm.</span></div>
      <div><b>cm × 10 = mm, m × 1000 = mm</b><span>Bütün boyları mm'ye çevir, δ mm çıkar.</span></div>
      <div><b>α · ΔT · L</b><span>α [1/°C], ΔT [°C], L [mm] → mm.</span></div>
    </div>
  </section>`;

function mountRehber(sub) {
  const box = document.getElementById('tree'); let i = 0;
  const draw = () => {
    if (i >= TREE.length) { box.innerHTML = `<div class="tq"><p>Hiçbiri değilse: soruyu tekrar oku; çoğu zaman "iki ucu tutulu" ya da "rijit" ipucu şekilde saklıdır.</p><button id="trst">BAŞA DÖN</button></div>`; document.getElementById('trst').onclick = () => { i = 0; draw(); }; return; }
    box.innerHTML = `<div class="tq"><div class="sn">SORU ${i + 1} / ${TREE.length}</div><p>${TREE[i].q}</p><div class="yn"><button class="pri" id="ty">EVET</button><button id="tn">HAYIR</button></div></div>`;
    document.getElementById('ty').onclick = () => {
      const k = TREE[i].y, R = RECIPES[k];
      box.innerHTML = `<div class="tq hit"><div class="sn">TARİFİN</div><h3>${R.ad}</h3><p class="lead">${R.kisa}</p><ol>${R.adim.map(a => `<li>${a}</li>`).join('')}</ol><p class="lead"><a href="#rehber-${k}">Tarifin tam sayfası</a> · ${PROBS.filter(P => P.tip === k).map(P => `<a class="chip" href="#${P.id}">P${P.no}</a>`).join(' ')}</p><button id="trst">BAŞA DÖN</button></div>`;
      document.getElementById('trst').onclick = () => { i = 0; draw(); };
    };
    document.getElementById('tn').onclick = () => { i++; draw(); };
  };
  draw();
  if (sub) { const el = document.getElementById('rehber-' + sub); if (el) setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'start' }), 60); }
}
