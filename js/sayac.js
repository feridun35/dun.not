// dun.not sayacı: çerez yok, kişisel veri yok. Firestore'da (istatistik/*) yalnız toplam sayılar tutulur:
// sayfa açılışı (ana, oku_<id>, siteler_<id>), olay (indir_<id>, site_<id>) ve günlük toplam (gun_YYYYMMDD, Türkiye günü).
// Do Not Track açıksa ve yöneticinin tarayıcısında saymaz.
(function () {
  'use strict';
  var ADRES = 'https://firestore.googleapis.com/v1/projects/dunnot/databases/(default)/documents:commit?key=AIzaSyBJ-825UO1-GPWwBUK7m__EU-B985az7kc';
  var KOK = 'projects/dunnot/databases/(default)/documents/istatistik/';
  window.dunnotSay = function () {};
  if (navigator.doNotTrack === '1' || localStorage.getItem('dunnot.yonetici') === '1') return;

  function art(id) { return { transform: { document: KOK + id, fieldTransforms: [{ fieldPath: 'n', increment: { integerValue: '1' } }] } }; }
  window.dunnotSay = function (yol, baslik, olay) {
    var id = String(yol).toLowerCase().replace(/[^a-z0-9-]+/g, '_').slice(0, 120);
    var w = [art(id)];
    if (!olay) w.push(art('gun_' + new Date().toLocaleDateString('sv-SE', { timeZone: 'Europe/Istanbul' }).replace(/-/g, '')));
    fetch(ADRES, { method: 'POST', keepalive: true, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ writes: w }) }).catch(function () {});
  };

  // Okuyucu kendi sayfasını (oku/<id>) bildirir; burada yalnız ana sayfa ve ders siteleri sayılır.
  if (!document.body || !document.body.classList.contains('okuyucu')) {
    var m = location.pathname.match(/siteler\/([^/]+)/);
    window.dunnotSay(m ? 'siteler/' + m[1] : 'ana');
  }
})();
