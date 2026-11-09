// dun.not ana sayfa: katalogu okur, türe göre süzer; tür sekmelerinde ders kategorileri gösterir.
(function () {
  'use strict';
  // "Hepsi" vitrindir: yalnız vitrin:true kaynaklar. Diğer sekmeler tüm kaynakları ders kategorileriyle gösterir.
  const FILTRE = {
    hepsi: { baslik: 'Son eklenenler', uy: k => k.vitrin !== false },
    notlar: { baslik: 'Ders notları', uy: k => k.tur === 'not' },
    formul: { baslik: 'Formül kağıtları', uy: k => k.tur === 'formul' },
    sorular: { baslik: 'Sorular', uy: k => k.tur === 'cikmis' || k.tur === 'calisma' },
    siteler: { baslik: 'Etkileşimli siteler', uy: k => k.tur === 'site' }
  };
  const TUR_ADI = { not: 'Ders notu', formul: 'Formül kağıdı', cikmis: 'Çıkmış soru', calisma: 'Çalışma sorusu', site: 'Etkileşimli site' };
  const TUR_SIRA = { not: 0, formul: 1, cikmis: 2, calisma: 3, site: 4 };
  const DERS_SIRA = ['Genel Matematik I', 'Genel Matematik II', 'Genel Fizik I', 'Genel Fizik II', 'Genel Kimya', 'Lineer Cebir',
    'Diferansiyel Denklemler', 'Edebiyat', 'Türk Devrim Tarihi', 'PC Programlama', 'Mukavemet I', 'Termodinamik I',
    'Elektrik-Elektronik Temelleri', 'Laboratuvar 1', 'Malzeme Bilgisi'];
  const izgara = document.getElementById('izgara');
  const kat = document.getElementById('kat');
  let katalog = [];

  const kacis = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const slug = s => s.toLocaleLowerCase('tr').replace(/[çğıöşüâîû]/g, c => ({ ç: 'c', ğ: 'g', ı: 'i', ö: 'o', ş: 's', ü: 'u', â: 'a', î: 'i', û: 'u' }[c])).replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  const dersSira = d => { const i = DERS_SIRA.indexOf(d); return i < 0 ? 99 : i; };

  function kart(k) {
    const site = k.tur === 'site';
    const href = site ? k.url : 'oku.html?d=' + encodeURIComponent(k.id);
    const etiket = site ? `${TUR_ADI.site} · ${k.ders}` : [TUR_ADI[k.tur], k.donem, `${k.sayfa} s.`].filter(Boolean).join(' · ');
    const disari = site ? ' target="_blank" rel="noopener"' : '';
    const acik = k.koyu === false || site ? ' acik-sayfa' : '';
    const yatay = site || k.oran < 1 ? ' yatay' : '';
    return `<a class="kart${acik}${yatay}" href="${href}"${disari}>
      <div class="sayfa"><img src="${k.kapak}" alt="" loading="lazy"></div>
      <div class="etiket">${kacis(etiket)}</div>
      <h3>${kacis(k.baslik)}</h3>
      <p>${kacis(k.aciklama)}</p></a>`;
  }

  function sirala(l) {
    return l.slice().sort((a, b) => dersSira(a.ders) - dersSira(b.ders) || TUR_SIRA[a.tur] - TUR_SIRA[b.tur] ||
      (a.tur === 'cikmis' ? b.baslik.localeCompare(a.baslik, 'tr') : 0));
  }

  function ciz() {
    const [adHam, dersSlug] = ((location.hash || '#').slice(1) || 'hepsi').split('/');
    const ad = FILTRE[adHam] ? adHam : 'hepsi';
    const f = FILTRE[ad];
    document.querySelectorAll('.sekme [data-filtre]').forEach(a => a.classList.toggle('acik', a.dataset.filtre === ad));
    let liste = katalog.filter(f.uy);
    let dersler = [];
    if (ad !== 'hepsi') {
      const say = {}; liste.forEach(k => { say[k.ders] = (say[k.ders] || 0) + 1; });
      dersler = Object.keys(say).sort((a, b) => dersSira(a) - dersSira(b) || a.localeCompare(b, 'tr')).map(d => [d, say[d]]);
      liste = sirala(liste);
    }
    const secili = dersler.find(([d]) => slug(d) === dersSlug);
    if (secili) liste = liste.filter(k => k.ders === secili[0]);
    kat.hidden = ad === 'hepsi' || dersler.length < 2;
    kat.innerHTML = kat.hidden ? '' : [`<a href="#${ad}" class="${secili ? '' : 'acik'}">Tümü<b>${katalog.filter(f.uy).length}</b></a>`]
      .concat(dersler.map(([d, n]) => `<a href="#${ad}/${slug(d)}" class="${secili && secili[0] === d ? 'acik' : ''}">${kacis(d)}<b>${n}</b></a>`)).join('');

    document.getElementById('baslik').textContent = secili ? `${f.baslik} · ${secili[0]}` : f.baslik;
    const pdf = liste.filter(k => k.tur !== 'site').length, site = liste.length - pdf;
    document.getElementById('sayac').textContent = [pdf && `${pdf} PDF`, site && `${site} site`].filter(Boolean).join(' · ');

    if (!liste.length) { izgara.innerHTML = '<p class="bos">Bu türde henüz kaynak yok.</p>'; return; }
    let html = '', son = null;
    for (const k of liste) {
      if (ad !== 'hepsi' && !secili && k.ders !== son) {
        son = k.ders; html += `<h3 class="grup">${kacis(k.ders)}<span>${liste.filter(x => x.ders === k.ders).length}</span></h3>`;
      }
      html += kart(k);
    }
    izgara.innerHTML = html;
  }

  window.addEventListener('hashchange', () => {
    ciz();
    if (location.hash) document.getElementById('kaynaklar').scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  fetch('data/katalog.json').then(r => r.json()).then(j => {
    const sira = { not: 0, formul: 1, site: 2 };
    katalog = j.kaynaklar.slice().sort((a, b) => (b.eklendi || '').localeCompare(a.eklendi || '') || (sira[a.tur] ?? 1) - (sira[b.tur] ?? 1));
    ciz();
  }).catch(() => { izgara.innerHTML = '<p class="bos">Katalog yüklenemedi. Sayfayı yenile.</p>'; });
})();
