// dun.not ziyaretçi sayacı: GoatCounter (çerezsiz, kişisel veri tutmaz). KOD boşsa hiçbir şey yüklenmez.
// Kod: goatcounter.com'da açılan site adı (kod.goatcounter.com). Aşağıya yaz, commit et.
(function () {
  'use strict';
  var KOD = '';
  window.dunnotSay = function () {};
  if (!KOD || navigator.doNotTrack === '1') return;
  var tabani = location.pathname.replace(/(siteler\/[^/]+\/|oku\.html|p\/[^/]+\/|index\.html)?$/, '');
  var bekleyen = [];
  window.dunnotSay = function (yol, baslik, olay) {
    var o = { path: yol, title: baslik || yol, event: !!olay };
    if (window.goatcounter && window.goatcounter.count) window.goatcounter.count(o); else bekleyen.push(o);
  };
  var s = document.createElement('script');
  s.async = true; s.src = 'https://gc.zgo.at/count.js';
  s.setAttribute('data-goatcounter', 'https://' + KOD + '.goatcounter.com/count');
  s.setAttribute('data-goatcounter-settings', JSON.stringify({ no_onload: true }));
  s.onload = function () { bekleyen.splice(0).forEach(function (o) { window.goatcounter.count(o); }); };
  document.head.appendChild(s);
  // Okuyucu kendi sayfa adını (belge kimliği) bildirir; diğer sayfalar kendiliğinden sayılır.
  if (!document.body || !document.body.classList.contains('okuyucu')) {
    var yol = location.pathname.slice(tabani.length) || 'ana';
    window.dunnotSay(yol.replace(/\/$/, '') || 'ana', document.title);
  }
})();
