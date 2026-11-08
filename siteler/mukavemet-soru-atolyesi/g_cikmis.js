'use strict';
/* ---------- çıkmış vize soruları sayfası ---------- */
VIZE.sort((a, b) => a.no - b.no);

PAGES.cikmis = () => {
  const card = V => {
    const st = store.get('stat:' + V.id, { ok: 0, n: 0 }), done = store.get('done:' + V.id, false);
    return `<a class="pc ${done ? 'done' : ''}" href="#${V.id}"><div class="pc-n">${V.kod}</div>
      <div class="pc-t">${V.ad}</div><div class="pc-r">${(RECIPES[V.tip] || {}).ad || ''}</div>
      <div class="pc-s">${V.src || ''}</div>
      <div class="pc-s">${done ? 'ANLADIM ✓' : 'BAŞLA'} · ${st.n ? `ilk denemede doğru ${st.ok}/${st.n}` : 'henüz denemedin'}</div></a>`;
  };
  const groups = [['kg', 'km', 'po'], ['rk'], ['hs'], ['mo'], ['bu']];
  const names = { 0: 'GERİLME, PİM, POISSON', 1: 'RİJİT ELEMAN + ÇUBUKLAR', 2: 'İKİ UCU TUTULU + ISI', 3: 'MOHR ÇEMBERİ', 4: 'BURMA (ŞAFT, DİŞLİ)' };
  return `
  <section class="hero center">
    <div class="kicker">MENG 207 · ESKİ ARA SINAVLAR</div>
    <h1>ÇIKMIŞ VİZE SORULARI</h1>
    <p class="sub">2016–17 Yaz, 2017–18 Güz, 2018–19 Güz vizeleri ve aynı PDF'teki kitap soruları. Her biri örnek problemlerdeki gibi: soru, anlamı, 3D çözüm, hocanın cevap anahtarı, kendin dene.</p>
  </section>
  <section class="card">
    <h2><span class="n">!</span> BU SORULARDAN NE ÇIKIYOR?</h2>
    <div class="why3">
      <div><b>Hep aynı tipler dönüyor.</b><p>Rijit eleman + iki çubuk, iki ucu tutulu + ısı ve dişli–şaft burma her yıl var. Aynı soru farklı sayılarla tekrar sorulmuş (V2, V3).</p></div>
      <div><b>Burma sorusuna dikkat.</b><p>Eski vizelerin hepsinde bir burma sorusu var. Senin slaytlarında burma yoktu; bu yıl çıkıp çıkmayacağını hocanın kapsamından teyit et. Yine de V4, V8, V11, V13'e bak.</p></div>
      <div><b>Formüller soru kâğıdında.</b><p>Eski kâğıtlarda φ = TL/(JG), τ = Tc/J, J = πc⁴/2 gibi "gerekli formüller" yazılmış. Bu yıl formül kâğıdı yok dendi; o yüzden 5 fikir sayfasındaki mantığı bil.</p></div>
    </div>
  </section>
  ${groups.map((g, i) => {
    const L = VIZE.filter(V => g.includes(V.tip));
    return L.length ? `<section class="card"><h2><span class="n">${i + 1}</span> ${names[i]}</h2><div class="grid8">${L.map(card).join('')}</div></section>` : '';
  }).join('')}
  ${VIZE.length ? '' : '<section class="card"><p class="lead">Sorular yükleniyor (dosyalar henüz eklenmedi).</p></section>'}`;
};
