// dun.not PDF okuyucu: pdf.js ile sürekli kaydırma, konu haritası, kağıt modu, sayfa linki, kaldığın yer.
(function () {
  'use strict';
  const $ = id => document.getElementById(id);
  const pdfjs = window.pdfjsLib;
  pdfjs.GlobalWorkerOptions.workerSrc = 'vendor/pdfjs/pdf.worker.min.js';

  const TUR = { not: ['Ders notları', 'notlar', 'El yazısı'], formul: ['Formül kağıtları', 'formul', 'Formül kağıdı'],
    cikmis: ['Sorular', 'sorular', 'Çıkmış soru'], calisma: ['Sorular', 'sorular', 'Çalışma sorusu'] };
  const YAKIN = [0.5, 0.67, 0.8, 1, 1.25, 1.5, 2, 2.5, 3];
  const kap = $('sayfalar');
  const telefon = () => matchMedia('(max-width:820px)').matches;

  let k = null, doc = null, sayfaDiv = [], simdi = 1, yakin = 1, temelGen = 800;
  const cizilen = new Map(); // sayfa no -> {canvas, gen, gorev}
  let metinler = null; // sayfa metinleri (arama)

  const kacis = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const kucuk = s => s.toLocaleLowerCase('tr').replace(/ı/g, 'i').normalize('NFC');

  // ---------- yükleme ----------
  async function basla() {
    const id = new URLSearchParams(location.search).get('d');
    let j;
    try { j = await (await fetch('data/katalog.json')).json(); } catch (e) { return hata('Katalog yüklenemedi', 'Bağlantını kontrol edip sayfayı yenile.'); }
    k = j.kaynaklar.find(x => x.id === id && x.tur !== 'site');
    if (!k) return hata('Belge bulunamadı', 'Bu bağlantı eski olabilir. Ana sayfadan tekrar seç.');

    document.title = k.baslik + ' · dun.not';
    $('ad').textContent = k.baslik;
    const t = TUR[k.tur];
    $('tur-bag').textContent = t[0]; $('tur-bag').href = './#' + t[1];
    $('bilgi').textContent = `${t[2]} · ${k.sayfa} s.` + (/releases/.test(k.indir) ? ` · ${k.boyut} orijinal` : '');
    const ind = $('indir'); ind.href = k.indir;
    ind.querySelector('span').textContent = /releases/.test(k.indir) ? `İndir · ${k.boyut}` : 'İndir';
    document.documentElement.style.setProperty('--oran-ters', `1 / ${k.oran}`);
    $('toplam').textContent = '/ ' + k.sayfa;
    $('ters-ad').textContent = k.koyu ? 'Kağıt modu' : 'Gece modu';
    $('ters').title = k.koyu ? 'Siyah zemini beyaz kağıda çevirir' : 'Beyaz sayfayı koyulaştırır';
    tersUygula(localStorage.getItem('dunnot.ters.' + (k.koyu ? 'koyu' : 'acik')) === '1');

    yanKur();
    iskelet();

    const hedef = parseInt((location.hash.match(/s=(\d+)/) || [])[1], 10);
    if (hedef >= 1 && hedef <= k.sayfa) git(hedef, false); else yerHatirlat();
    guncelle();

    try {
      doc = await pdfjs.getDocument({ url: k.pdf, isEvalSupported: false, disableAutoFetch: true, rangeChunkSize: 262144 }).promise;
    } catch (e) { return bildir('<div><b>PDF açılamadı</b><small>Bağlantını kontrol et ya da dosyayı indir.</small></div>', 0); }
    gozlemciKur();
  }

  function hata(baslik, metin) {
    $('ad').textContent = baslik;
    kap.innerHTML = `<div class="hata"><h2>${kacis(baslik)}</h2><p>${kacis(metin)}</p><p style="margin-top:18px"><a class="tus koyu" href="./"><span class="led"></span>Ana sayfa</a></p></div>`;
    $('arac').hidden = true;
  }

  // ---------- düzen ----------
  function temelGenislik() {
    const g = kap.clientWidth - (telefon() ? 20 : 48);
    const tavan = k && k.oran < 1 ? 1240 : 820; // yatay kağıtlar daha geniş açılır
    return Math.max(240, Math.min(g, telefon() ? g : tavan));
  }

  function iskelet() {
    temelGen = temelGenislik();
    const frag = document.createDocumentFragment();
    sayfaDiv = [];
    for (let n = 1; n <= k.sayfa; n++) {
      const d = document.createElement('div');
      d.className = 'syf' + (k.koyu ? '' : ' acik'); d.dataset.n = n; d.id = 's' + n;
      d.innerHTML = `<img alt="" loading="lazy" src="sayfa/${k.id}/${n}.jpg"><span class="numara">${n}</span>`;
      frag.appendChild(d); sayfaDiv.push(d);
    }
    kap.appendChild(frag);
    boyutla();
  }

  function boyutla() {
    const g = Math.round(temelGen * yakin);
    for (const d of sayfaDiv) {
      const oran = parseFloat(d.dataset.oran || k.oran);
      d.style.width = g + 'px'; d.style.height = Math.round(g * oran) + 'px';
    }
    $('yakin').textContent = Math.round(yakin * 100) + '%';
  }

  function yakinlastir(yeni) {
    yeni = Math.max(YAKIN[0], Math.min(YAKIN[YAKIN.length - 1], yeni));
    if (yeni === yakin) return;
    const d = sayfaDiv[simdi - 1];
    const ic = (kap.scrollTop - d.offsetTop) / d.offsetHeight;
    yakin = yeni; boyutla();
    kap.scrollTop = d.offsetTop + ic * d.offsetHeight;
    cizilen.forEach((v, n) => { if (v.gen !== hedefGen()) bosalt(n); });
    gorunenleriCiz();
  }

  // ---------- çizim ----------
  const hedefGen = () => Math.round(temelGen * yakin * Math.min(window.devicePixelRatio || 1, 2.5));
  let gozlemci;
  function gozlemciKur() {
    gozlemci = new IntersectionObserver(es => {
      for (const e of es) {
        const n = +e.target.dataset.n;
        if (e.isIntersecting) ciz(n); else bosalt(n);
      }
    }, { root: kap, rootMargin: '120% 0px' });
    sayfaDiv.forEach(d => gozlemci.observe(d));
  }
  function gorunenleriCiz() {
    const ust = kap.scrollTop - kap.clientHeight * 1.2, alt = kap.scrollTop + kap.clientHeight * 2.2;
    for (const d of sayfaDiv) if (d.offsetTop + d.offsetHeight > ust && d.offsetTop < alt) ciz(+d.dataset.n);
  }

  async function ciz(n) {
    if (!doc) return;
    const gen = hedefGen(), v = cizilen.get(n);
    if (v && v.gen === gen) return;
    if (v) bosalt(n);
    const kayit = { gen, canvas: null, gorev: null };
    cizilen.set(n, kayit);
    try {
      const sayfa = await doc.getPage(n);
      if (cizilen.get(n) !== kayit) return;
      const v1 = sayfa.getViewport({ scale: 1 });
      const d = sayfaDiv[n - 1];
      const oran = v1.height / v1.width;
      if (Math.abs(oran - parseFloat(d.dataset.oran || k.oran)) > 0.01) { d.dataset.oran = oran; boyutla(); }
      const vp = sayfa.getViewport({ scale: gen / v1.width });
      const c = document.createElement('canvas');
      c.width = Math.round(vp.width); c.height = Math.round(vp.height);
      kayit.canvas = c;
      kayit.gorev = sayfa.render({ canvasContext: c.getContext('2d', { alpha: false }), viewport: vp });
      await kayit.gorev.promise;
      if (cizilen.get(n) !== kayit) return;
      d.appendChild(c);
      const img = d.querySelector('img'); if (img) img.style.visibility = 'hidden';
    } catch (e) { if (cizilen.get(n) === kayit) cizilen.delete(n); }
  }

  function bosalt(n) {
    const v = cizilen.get(n); if (!v) return;
    if (v.gorev) try { v.gorev.cancel(); } catch (e) { }
    if (v.canvas) { v.canvas.remove(); v.canvas.width = v.canvas.height = 0; }
    cizilen.delete(n);
    const img = sayfaDiv[n - 1].querySelector('img'); if (img) img.style.visibility = '';
  }

  // ---------- gezinme ----------
  function git(n, yumusak, y) {
    n = Math.max(1, Math.min(k.sayfa, n | 0));
    const d = sayfaDiv[n - 1];
    const ic = y ? Math.max(0, y * d.offsetHeight - 16) : 0; // başlık sayfanın ortasındaysa ona in
    kap.scrollTo({ top: d.offsetTop + ic - (telefon() ? 10 : 80), behavior: yumusak ? 'smooth' : 'auto' });
    if (!yumusak) { simdi = n; guncelle(); }
  }

  let kareIstek = 0;
  kap.addEventListener('scroll', () => {
    if (kareIstek) return;
    kareIstek = requestAnimationFrame(() => {
      kareIstek = 0;
      const orta = kap.scrollTop + kap.clientHeight * 0.35;
      let lo = 0, hi = sayfaDiv.length - 1;
      while (lo < hi) { const m = (lo + hi + 1) >> 1; if (sayfaDiv[m].offsetTop <= orta) lo = m; else hi = m - 1; }
      if (lo + 1 !== simdi) { simdi = lo + 1; guncelle(); }
    });
  }, { passive: true });

  let kayitZaman;
  function guncelle() {
    if (document.activeElement !== $('no')) $('no').value = simdi;
    $('serit-sayac').textContent = `${simdi} / ${k.sayfa}`;
    history.replaceState(null, '', `${location.pathname}${location.search}#s=${simdi}`);
    konuIsaretle(); seritIsaretle();
    clearTimeout(kayitZaman);
    kayitZaman = setTimeout(() => {
      try {
        const y = JSON.parse(localStorage.getItem('dunnot.yer') || '{}');
        y[k.id] = { s: simdi, t: Date.now() };
        localStorage.setItem('dunnot.yer', JSON.stringify(y));
      } catch (e) { }
    }, 800);
  }

  // ---------- yan panel ----------
  function duzKonular() {
    const l = [];
    (k.konular || []).forEach(a => { l.push({ ...a, ana: true }); (a.alt || []).forEach(b => l.push({ ...b, ana: false, ust: a.t })); });
    return l;
  }
  function konuBul(n) {
    let son = null;
    for (const x of duzKonular()) if (x.s <= n) son = x;
    return son;
  }

  function yanKur() {
    const p = $('p-konular');
    if (k.konular && k.konular.length) {
      p.innerHTML = duzKonular().map(x => `<button type="button" class="konu${x.ana ? '' : ' alt'}" data-s="${x.s}" data-y="${x.y || 0}" data-t="${kacis(x.t)}">
        ${x.ana ? '<i class="nokta"></i>' : ''}<span>${kacis(x.t)}</span>${x.vize ? '<i class="vize">VİZE</i>' : ''}<span class="s">s. ${x.s}</span></button>`).join('');
    } else {
      $('sek-konular').textContent = 'Sayfalar';
      p.innerHTML = (k.tur === 'not' ? '<p class="konu-yok">Bu notun konu haritası henüz hazır değil.</p>' : '') +
        '<div class="izgara-k">' + Array.from({ length: k.sayfa }, (_, i) =>
          `<button type="button" data-s="${i + 1}"><img loading="lazy" alt="" src="sayfa/${k.id}/${i + 1}.jpg">${i + 1}</button>`).join('') + '</div>';
      $('konu-serit').querySelector('em').textContent = 'Sayfalar ▾';
    }
    p.addEventListener('click', e => { const b = e.target.closest('[data-s]'); if (b) { git(+b.dataset.s, false, +(b.dataset.y || 0)); panelKapat(); } });

    $('serit').innerHTML = Array.from({ length: k.sayfa }, (_, i) =>
      `<button type="button" data-s="${i + 1}" aria-label="Sayfa ${i + 1}"><img loading="lazy" alt="" src="sayfa/${k.id}/${i + 1}.jpg"></button>`).join('');
    $('serit').addEventListener('click', e => { const b = e.target.closest('[data-s]'); if (b) git(+b.dataset.s, false); });

    document.querySelectorAll('.yan .sekme button').forEach(b => b.addEventListener('click', () => sekmeAc(b.dataset.panel)));
    sekmeAc('konular');
    $('ara-not').textContent = k.koyu ? 'El yazısı taramada konu başlıklarında arar.' : 'Konu başlıklarında ve sayfa metninde arar.';
    $('ara-kutu').addEventListener('input', ara);
  }

  function sekmeAc(ad) {
    document.querySelectorAll('.yan .sekme button').forEach(b => b.classList.toggle('acik', b.dataset.panel === ad));
    $('p-konular').hidden = ad !== 'konular'; $('p-ara').hidden = ad !== 'ara';
    if (ad === 'ara') setTimeout(() => $('ara-kutu').focus(), 50);
  }

  function konuIsaretle() {
    const x = konuBul(simdi);
    const ana = x ? (x.ana ? x.t : x.ust) : null;
    let gecti = true;
    document.querySelectorAll('#p-konular .konu').forEach(b => {
      const bu = b.dataset.t === (x && x.t) && +b.dataset.s === x.s;
      b.classList.toggle('simdi', !!bu && b.classList.contains('konu') && (bu));
      if (bu) gecti = false;
      b.classList.toggle('gecti', gecti && !bu);
      if (bu && !telefon()) b.scrollIntoView({ block: 'nearest' });
    });
    document.querySelectorAll('#p-konular .izgara-k button').forEach(b => b.classList.toggle('simdi', +b.dataset.s === simdi));
    $('konu-ad').textContent = x ? (ana && !x.ana ? `${ana} · ${x.t}` : x.t) : `Sayfa ${simdi}`;
  }

  function seritIsaretle() {
    const s = $('serit'); const b = s.children[simdi - 1];
    s.querySelectorAll('.simdi').forEach(e => e.classList.remove('simdi'));
    if (b) { b.classList.add('simdi'); s.scrollTo({ left: b.offsetLeft - s.clientWidth / 2 + 23, behavior: 'smooth' }); }
  }

  // ---------- arama ----------
  function metinleriAl() {
    if (!doc || k.koyu) return Promise.resolve([]);
    if (!metinler) metinler = (async () => {
      const l = [];
      for (let n = 1; n <= doc.numPages; n++) {
        const tc = await (await doc.getPage(n)).getTextContent();
        l.push(tc.items.map(i => i.str + (i.hasEOL ? ' ' : '')).join('').replace(/\s+/g, ' '));
      }
      return l;
    })();
    return metinler;
  }
  let araSira = 0;
  async function ara() {
    const q = kucuk($('ara-kutu').value.trim()), sira = ++araSira;
    const out = $('ara-sonuc');
    if (q.length < 2) { out.innerHTML = ''; return; }
    const sonuc = [];
    for (const x of duzKonular()) if (kucuk(x.t).includes(q)) sonuc.push({ s: x.s, y: x.y || 0, m: x.t, konu: true });
    const mt = await metinleriAl();
    if (sira !== araSira) return;
    mt.forEach((t, i) => {
      const lt = kucuk(t); let at = 0, adet = 0, j;
      while ((j = lt.indexOf(q, at)) !== -1 && adet < 3) {
        sonuc.push({ s: i + 1, m: t.slice(Math.max(0, j - 40), j + q.length + 50), konu: false }); at = j + q.length; adet++;
      }
    });
    const vurgula = m => {
      const km = kucuk(m); let out = '', at = 0, j;
      while ((j = km.indexOf(q, at)) !== -1) { out += kacis(m.slice(at, j)) + '<mark>' + kacis(m.slice(j, j + q.length)) + '</mark>'; at = j + q.length; }
      return out + kacis(m.slice(at));
    };
    out.innerHTML = sonuc.length ? sonuc.slice(0, 60).map(r =>
      `<button type="button" class="sonuc" data-s="${r.s}" data-y="${r.y || 0}"><b>s. ${r.s}</b>${r.konu ? '' : '…'}${vurgula(r.m)}${r.konu ? '' : '…'}</button>`).join('')
      : '<p class="ara-not">Sonuç yok.</p>';
  }
  $('ara-sonuc').addEventListener('click', e => { const b = e.target.closest('[data-s]'); if (b) { git(+b.dataset.s, false, +(b.dataset.y || 0)); panelKapat(); } });

  // ---------- araç çubuğu ----------
  $('onceki').addEventListener('click', () => git(simdi - 1, true));
  $('sonraki').addEventListener('click', () => git(simdi + 1, true));
  $('no').addEventListener('change', e => git(parseInt(e.target.value, 10) || simdi, false));
  $('no').addEventListener('keydown', e => { if (e.key === 'Enter') e.target.blur(); });
  $('no').addEventListener('focus', e => e.target.select());
  $('buyut').addEventListener('click', () => yakinlastir(YAKIN.find(z => z > yakin + 0.01) || yakin));
  $('kucult').addEventListener('click', () => yakinlastir([...YAKIN].reverse().find(z => z < yakin - 0.01) || yakin));
  $('sigdir').addEventListener('click', () => yakinlastir(1));
  $('ters').addEventListener('click', () => {
    const acik = !document.body.classList.contains('ters'); tersUygula(acik);
    try { localStorage.setItem('dunnot.ters.' + (k.koyu ? 'koyu' : 'acik'), acik ? '1' : '0'); } catch (e) { }
  });
  function tersUygula(acik) {
    document.body.classList.toggle('ters', acik);
    $('ters').setAttribute('aria-pressed', String(acik)); $('ters').classList.toggle('basili', acik);
  }
  $('link').addEventListener('click', async () => {
    const url = `${location.origin}${location.pathname}?d=${encodeURIComponent(k.id)}#s=${simdi}`;
    let ok = false;
    try { await navigator.clipboard.writeText(url); ok = true; } catch (e) { }
    if (!ok) { window.prompt('Bağlantıyı kopyala:', url); return; }
    bildir(`<div><b>Bağlantı kopyalandı</b><small>${kacis(k.baslik)} · s. ${simdi}</small></div>`, 2600);
  });
  $('tam').addEventListener('click', () => {
    if (document.fullscreenElement) document.exitFullscreen(); else document.documentElement.requestFullscreen().catch(() => { });
  });

  document.addEventListener('keydown', e => {
    if (!k || e.target.closest('input,textarea')) return;
    if (e.key === 'ArrowRight' || e.key === 'PageDown') { e.preventDefault(); git(simdi + 1, true); }
    else if (e.key === 'ArrowLeft' || e.key === 'PageUp') { e.preventDefault(); git(simdi - 1, true); }
    else if ((e.key === '+' || e.key === '=') && !e.ctrlKey) { $('buyut').click(); }
    else if (e.key === '-' && !e.ctrlKey) { $('kucult').click(); }
    else if (e.key === 'Escape') panelKapat();
  });

  // telefon: konu şeridi yan paneli alttan açar
  $('konu-serit').addEventListener('click', () => {
    const a = !document.body.classList.contains('panel-acik');
    document.body.classList.toggle('panel-acik', a); $('konu-serit').setAttribute('aria-expanded', String(a));
  });
  $('perde').addEventListener('click', panelKapat);
  function panelKapat() { document.body.classList.remove('panel-acik'); $('konu-serit').setAttribute('aria-expanded', 'false'); }

  let boyutZaman;
  window.addEventListener('resize', () => {
    clearTimeout(boyutZaman);
    boyutZaman = setTimeout(() => {
      if (!k) return;
      const yeni = temelGenislik(); if (Math.abs(yeni - temelGen) < 4) return;
      const n = simdi; temelGen = yeni; boyutla(); git(n, false);
      cizilen.forEach((v, i) => bosalt(i)); gorunenleriCiz();
    }, 200);
  });

  // ---------- bildirim, kaldığın yer ----------
  let bildirimZaman;
  function bildir(html, sure) {
    const b = $('bildirim'); b.innerHTML = html + '<button class="kapat" type="button" aria-label="Kapat">×</button>'; b.hidden = false;
    b.querySelector('.kapat').onclick = () => { b.hidden = true; };
    clearTimeout(bildirimZaman); if (sure) bildirimZaman = setTimeout(() => { b.hidden = true; }, sure);
    return b;
  }
  function ne_zaman(t) {
    const g = Math.floor((Date.now() - t) / 864e5);
    if (g < 1) return 'bugün'; if (g === 1) return 'dün'; if (g < 7) return g + ' gün önce';
    return Math.floor(g / 7) + ' hafta önce';
  }
  function yerHatirlat() {
    let y; try { y = JSON.parse(localStorage.getItem('dunnot.yer') || '{}')[k.id]; } catch (e) { }
    if (!y || y.s <= 1 || y.s > k.sayfa) return;
    const x = konuBul(y.s);
    const b = bildir(`<div><b>Kaldığın yer: s. ${y.s}</b><small>${x ? kacis(x.t) + ' · ' : ''}${ne_zaman(y.t)}</small></div>
      <button class="tus kucuk koyu" type="button" id="devam"><span class="led"></span>Devam et</button>`, 15000);
    b.querySelector('#devam').onclick = () => { b.hidden = true; git(y.s, false); };
  }

  basla();
})();
