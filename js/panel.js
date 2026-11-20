// dun.not yönetici paneli: istatistik, yorum onayı, engeller. Veriyi yalnız firestore.rules'taki yönetici okuyup yazabilir.
import { auth, db, dinle, cikis, girisYap, kacis, tarih, collection, doc, getDocs, deleteDoc, writeBatch, serverTimestamp, getCountFromServer } from './fb.js';

const $ = id => document.getElementById(id);
const anahtar = s => s.toLowerCase().replace(/[^a-z0-9-]+/g, '_').slice(0, 120); // js/sayac.js ile aynı
const gunAdi = g => new Date(Date.UTC(g / 1e4 | 0, (g / 100 | 0) % 100 - 1, g % 100)).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short', timeZone: 'UTC' });
const bugun = () => +new Date().toLocaleDateString('sv-SE', { timeZone: 'Europe/Istanbul' }).replace(/-/g, '');
let bekleyen = {};

$('giris').onclick = () => girisYap().catch(() => { $('kim').textContent = 'Giriş yapılamadı, tekrar dene.'; });

dinle(u => {
  $('giris').hidden = !!u;
  $('kim').innerHTML = u ? '<a href="#" id="cik">Çıkış</a>' : '';
  if (u) { $('cik').onclick = e => { e.preventDefault(); cikis(); }; yukle(); } else $('icerik').innerHTML = '';
});

const liste = ad => getDocs(collection(db, ad)).then(s => s.docs.map(d => ({ id: d.id, ...d.data() })));
const sirala = l => l.sort((a, b) => (b.zaman ? b.zaman.seconds : 0) - (a.zaman ? a.zaman.seconds : 0));
const kart = (y, ad, tuslar) => `<div class="y"><div class="ust"><b>${kacis(y.ad)}</b>
  <a href="oku.html?d=${encodeURIComponent(y.belge)}">${kacis(ad[y.belge] || y.belge)}</a><span>${tarih(y.zaman)}</span></div>
  <p>${kacis(y.metin)}</p><div class="tuslar">${tuslar}</div></div>`;
const kutu = (sayi, ad, ek = '') => `<div class="kutu"><b>${sayi.toLocaleString('tr-TR')}</b><span>${ad}</span>${ek}</div>`;

async function yukle() {
  let b, o, e, ist, uye, kat;
  try {
    [b, o, e, ist, uye] = await Promise.all([liste('bekleyen'), liste('yorumlar'), liste('engel'), liste('istatistik'),
      getCountFromServer(collection(db, 'uyeler')).then(s => s.data().count)]);
  } catch (err) {
    $('icerik').innerHTML = '<p class="bos" style="margin-top:24px">Bu sayfa yalnız site sahibine açık.</p>';
    return;
  }
  try { kat = (await (await fetch('data/katalog.json')).json()).kaynaklar; } catch (err) { kat = []; }
  bekleyen = Object.fromEntries(b.map(y => [y.id, y]));
  const n = Object.fromEntries(ist.map(x => [x.id, x.n || 0]));
  const ad = Object.fromEntries(kat.map(k => [k.id, k.baslik]));
  const topla = on => ist.filter(x => x.id.startsWith(on)).reduce((t, x) => t + (x.n || 0), 0);

  // son 14 gün (Türkiye günü)
  const gunler = [], g0 = bugun();
  for (let i = 0; i < 14; i++) {
    const d = new Date(Date.UTC(g0 / 1e4 | 0, (g0 / 100 | 0) % 100 - 1, g0 % 100 - i));
    const g = d.getUTCFullYear() * 1e4 + (d.getUTCMonth() + 1) * 100 + d.getUTCDate();
    gunler.push([g, n['gun_' + g] || 0]);
  }
  const enCok = Math.max(1, ...gunler.map(x => x[1]));

  // belge başına
  const yorumSay = {};
  o.forEach(y => { yorumSay[y.belge] = (yorumSay[y.belge] || 0) + 1; });
  const satir = kat.map(k => {
    const site = k.tur === 'site';
    return { k, acilis: site ? (n[anahtar('siteler/' + k.id)] || 0) : (n[anahtar('oku/' + k.id)] || 0),
      tik: site ? (n[anahtar('site/' + k.id)] || 0) : null, indir: site ? null : (n[anahtar('indir/' + k.id)] || 0), yorum: yorumSay[k.id] || 0 };
  }).sort((x, y) => y.acilis - x.acilis);

  $('icerik').innerHTML =
    '<div class="kutular">' +
      kutu(n['gun_' + g0] || 0, 'Bugün ziyaret') + kutu(topla('gun_'), 'Toplam ziyaret') + kutu(n.ana || 0, 'Ana sayfa') +
      kutu(topla('indir_'), 'İndirme') +
      kutu(uye, 'Giriş yapan kişi', '<a href="https://console.firebase.google.com/project/dunnot/authentication/users" target="_blank" rel="noopener">Firebase\'de gör</a>') +
      kutu(b.length, 'Onay bekleyen') + kutu(o.length, 'Yayında yorum') + kutu(e.length, 'Engellenen') +
    '</div>' +
    `<h2>Son 14 gün <small>sayfa açılışı · Türkiye saati</small></h2><div class="gunler">` +
      gunler.map(([g, v]) => `<div class="gun"><span>${gunAdi(g)}</span><i style="width:${v / enCok * 100}%"></i><b>${v}</b></div>`).join('') + '</div>' +
    `<h2>Onay bekleyen <small>${b.length}</small></h2>` +
      (b.length ? sirala(b).map(y => kart(y, ad, `<button class="tus kucuk koyu" data-is="onayla" data-id="${kacis(y.id)}"><span class="led"></span>Onayla</button>
        <button class="tus kucuk" data-is="sil" data-id="${kacis(y.id)}">Sil</button>
        <button class="tus kucuk" data-is="engelle" data-id="${kacis(y.id)}" title="Bu kişi bir daha yorum gönderemez">Sil ve engelle</button>`)).join('') : '<p class="bos">Bekleyen yorum yok.</p>') +
    `<h2>Belgeler <small>${kat.length}</small></h2><div class="tablo"><table><thead><tr><th>Belge</th><th>Açılış</th><th>İndirme</th><th>Siteye tık</th><th>Yorum</th></tr></thead><tbody>` +
      satir.map(s => `<tr><td><a href="${s.k.tur === 'site' ? kacis(s.k.url) : 'oku.html?d=' + encodeURIComponent(s.k.id)}">${kacis(s.k.baslik)}</a><small>${s.k.tur === 'site' ? 'site' : 'pdf'}</small></td>
        <td>${s.acilis}</td><td>${s.indir ?? '–'}</td><td>${s.tik ?? '–'}</td><td>${s.yorum}</td></tr>`).join('') + '</tbody></table></div>' +
    `<h2>Yayında <small>${o.length}</small></h2>` +
      (o.length ? sirala(o).map(y => kart(y, ad, `<button class="tus kucuk" data-is="kaldir" data-id="${kacis(y.id)}">Yayından kaldır</button>`)).join('') : '<p class="bos">Yayında yorum yok.</p>') +
    `<h2>Engellenenler <small>${e.length}</small></h2>` +
      (e.length ? e.map(x => `<div class="y"><div class="ust"><b>Kimlik ${kacis(x.id.slice(0, 8))}…</b><span>${tarih(x.zaman)}</span></div>
        <div class="tuslar"><button class="tus kucuk" data-is="engel-kaldir" data-id="${kacis(x.id)}">Engeli kaldır</button></div></div>`).join('') : '<p class="bos">Engellenen kimse yok.</p>');
}

$('icerik').addEventListener('click', async e => {
  const t = e.target.closest('[data-is]');
  if (!t) return;
  t.disabled = true;
  const id = t.dataset.id, y = bekleyen[id];
  try {
    if (t.dataset.is === 'onayla') {
      // Yayındaki kopyada uid yok: herkese açık yorumlar kimseyi göstermez.
      const w = writeBatch(db);
      w.set(doc(db, 'yorumlar', id), { belge: y.belge, ad: y.ad, metin: y.metin, zaman: y.zaman });
      w.delete(doc(db, 'bekleyen', id));
      await w.commit();
    } else if (t.dataset.is === 'engelle') {
      const w = writeBatch(db);
      w.set(doc(db, 'engel', y.uid), { zaman: serverTimestamp() });
      w.delete(doc(db, 'bekleyen', id));
      await w.commit();
    } else {
      await deleteDoc(doc(db, { sil: 'bekleyen', kaldir: 'yorumlar', 'engel-kaldir': 'engel' }[t.dataset.is], id));
    }
  } catch (err) { t.textContent = 'Yapılamadı: ' + err.code; return; }
  yukle();
});
