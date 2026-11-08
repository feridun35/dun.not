// dun.not ana sayfa: katalogu okur, türe göre süzer.
(function () {
  'use strict';
  const FILTRE = {
    hepsi: { baslik: 'Son eklenenler', uy: () => true },
    notlar: { baslik: 'Ders notları', uy: k => k.tur === 'not' },
    formul: { baslik: 'Formül kağıtları', uy: k => k.tur === 'formul' },
    siteler: { baslik: 'Etkileşimli siteler', uy: k => k.tur === 'site' }
  };
  const TUR_ADI = { not: 'Ders notu', formul: 'Formül kağıdı', site: 'Etkileşimli site' };
  const izgara = document.getElementById('izgara');
  let katalog = [];

  const kacis = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  function kart(k) {
    const site = k.tur === 'site';
    const href = site ? k.url : 'oku.html?d=' + encodeURIComponent(k.id);
    const etiket = site ? `${TUR_ADI.site} · ${k.ders}` : `${TUR_ADI[k.tur]} · ${k.sayfa} s.`;
    const disari = site ? ' target="_blank" rel="noopener"' : '';
    const acik = k.koyu === false || site ? ' acik-sayfa' : '';
    const yatay = site || k.oran < 1 ? ' yatay' : '';
    return `<a class="kart${acik}${yatay}" href="${href}"${disari}>
      <div class="sayfa"><img src="${k.kapak}" alt="" loading="lazy"></div>
      <div class="etiket">${kacis(etiket)}</div>
      <h3>${kacis(k.baslik)}</h3>
      <p>${kacis(k.aciklama)}</p></a>`;
  }

  function ciz() {
    const ad = (location.hash || '#').slice(1) || 'hepsi';
    const f = FILTRE[ad] || FILTRE.hepsi;
    document.querySelectorAll('.sekme [data-filtre]').forEach(a =>
      a.classList.toggle('acik', a.dataset.filtre === (FILTRE[ad] ? ad : 'hepsi')));
    const liste = katalog.filter(f.uy);
    document.getElementById('baslik').textContent = f.baslik;
    const pdf = liste.filter(k => k.tur !== 'site').length, site = liste.length - pdf;
    document.getElementById('sayac').textContent =
      [pdf && `${pdf} PDF`, site && `${site} site`].filter(Boolean).join(' · ');
    izgara.innerHTML = liste.length ? liste.map(kart).join('') : '<p class="bos">Bu türde henüz kaynak yok.</p>';
  }

  window.addEventListener('hashchange', () => {
    ciz();
    if (location.hash) document.getElementById('kaynaklar').scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  fetch('data/katalog.json').then(r => r.json()).then(j => {
    const sira = { not: 0, formul: 1, site: 2 };
    katalog = j.kaynaklar.slice().sort((a, b) => (b.eklendi || '').localeCompare(a.eklendi || '') || sira[a.tur] - sira[b.tur]);
    ciz();
  }).catch(() => { izgara.innerHTML = '<p class="bos">Katalog yüklenemedi. Sayfayı yenile.</p>'; });
})();
