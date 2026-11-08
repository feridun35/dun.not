'use strict';
const TIP_ORDER = ['kg', 'km', 'rk', 'hs', 'cv'];

PAGES.ana = () => {
  const cards = PROBS.map(P => {
    const st = store.get('stat:' + P.id, { ok: 0, n: 0 }), done = store.get('done:' + P.id, false);
    return `<a class="pc ${done ? 'done' : ''}" href="#${P.id}"><div class="pc-n">${String(P.no).padStart(2, '0')}</div>
      <div class="pc-t">${P.ad}</div><div class="pc-r">${RECIPES[P.tip].ad}</div>
      <div class="pc-s">${done ? 'ANLADIM ✓' : 'BAŞLA'} · ${st.n ? 'ilk denemede doğru ' + st.ok + '/' + st.n : 'henüz denemedin'}</div></a>`;
  }).join('');
  return `
  <section class="hero center">
    <div class="kicker">MUKAVEMET I · ÖRNEK PROBLEMLER</div>
    <h1>SORU ATÖLYESİ</h1>
    <p class="sub">8 soru, 5 tarif. Formül ezberlemek yok: soruyu tanı, tarifi uygula, her adımı 3D gör.</p>
  </section>
  <section class="card">
    <h2><span class="n">1</span> YARIN SINAV: BURADAN BAŞLA</h2>
    <ol class="how">
      <li><b>Önce <a href="#fikir">5 fikir</a> sayfasını oku</b> (10 dakika). Formüllerin nereden çıktığını görürsün.</li>
      <li><b>Sonra <a href="#rehber">tanıma rehberine</a> bak.</b> Bir soruyu görünce hangi tarif olduğunu bulmayı öğrenirsin.</li>
      <li><b>Sonra aşağıdaki sorulardan 01'i aç</b> ve sırayla git. Çözdüğünü anladığında sayfanın içinde "ANLADIM" kutusunu işaretle; kartta görünür.</li>
      <li><b>En son <a href="#test">tip testini</a> çöz.</b> Tipi tanıyabiliyorsan hazırsın.</li>
    </ol>
  </section>
  <section class="card">
    <h2><span class="n">?</span> SLAYTTAKİLERİ ANLADIM, BUNLARI NEDEN ANLAMADIM?</h2>
    <div class="why3">
      <div><b>Slayt soruları tek fikirli.</b><p>"σ = F/A'yı uygula" gibi. Formülü bulunca biter.</p></div>
      <div><b>Bu sorular 2–3 fikri zincirliyor.</b><p>Önce kuvveti bul (moment), sonra doğru alanı seç (delik var mı?), sonra gerilme. Bir halka eksik kalınca soru "anlaşılmaz" görünür.</p></div>
      <div><b>Bilgi şekilde saklı.</b><p>"İki yanda birer çubuk", "pim deliği", "iki ucu sabit" gibi. Soruyu okurken bunları cümle cümle çözmeyi öğreneceksin: her sorudaki 02. kutu bunun için.</p></div>
    </div>
    <p class="lead" style="margin-top:14px">Kısa yol: bütün sorular 5 tariften biri. Önce <a href="#rehber">tanıma rehberine</a> 10 dakika ver, sonra soruları sırayla aç.</p>
  </section>
  <section class="card">
    <h2><span class="n">→</span> NASIL ÇALIŞ</h2>
    <ol class="how">
      <li><b>Soruyu oku, 2 dakika kendin dene.</b> 01 ve 02. kutular.</li>
      <li><b>Takıldığın yerde 3D çözümü aç.</b> Adım adım, her adımda "neden böyle?".</li>
      <li><b>"Kendin dene" ile 2 yeni soru çöz.</b> Yanlış yaparsan site nerede kaydığını söyler.</li>
      <li><b>Kâğıda yazılış halini bir kez elle yaz.</b> Sınavda bu sırayı göreceğin için.</li>
    </ol>
  </section>
  <div class="grid8">${cards}</div>
  <section class="card center">
    <div class="three"><a class="big" href="#rehber">TANIMA REHBERİ<small>Soruyu görünce tipini 30 saniyede bul</small></a>
    <a class="big" href="#fikir">5 FİKİR<small>Bütün formüller bunlardan çıkıyor</small></a>
    <a class="big" href="#test">TİP TESTİ<small>Soru tipini tanıyabiliyor musun?</small></a></div>
  </section>`;
};
