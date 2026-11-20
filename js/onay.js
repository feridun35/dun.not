// dun.not yorum onayı: yalnız firestore.rules içindeki yönetici kimliği okuyup yazabilir.
import { auth, db, dinle, cikis, girisYap, kacis, tarih, collection, doc, getDocs, deleteDoc, writeBatch, serverTimestamp } from './fb.js';

const $ = id => document.getElementById(id);
let bekleyen = {};

$('giris').onclick = () => girisYap().catch(() => { $('kim').textContent = 'Giriş yapılamadı, tekrar dene.'; });

dinle(u => {
  $('giris').hidden = !!u;
  $('kim').innerHTML = u ? `Kimliğin: ${kacis(u.uid)} · <a href="#" id="cik">çıkış</a>` : '';
  if (u) { $('cik').onclick = e => { e.preventDefault(); cikis(); }; yukle(); } else $('icerik').innerHTML = '';
});

const sirala = l => l.sort((a, b) => (b.zaman ? b.zaman.seconds : 0) - (a.zaman ? a.zaman.seconds : 0));
const kart = (y, tuslar) => `<div class="y"><div class="ust"><b>${kacis(y.ad)}</b>
  <a href="oku.html?d=${encodeURIComponent(y.belge)}">${kacis(y.belge)}</a><span>${tarih(y.zaman)}</span></div>
  <p>${kacis(y.metin)}</p><div class="tuslar">${tuslar}</div></div>`;

async function yukle() {
  let b, o;
  try {
    b = (await getDocs(collection(db, 'bekleyen'))).docs.map(d => ({ id: d.id, ...d.data() }));
    o = (await getDocs(collection(db, 'yorumlar'))).docs.map(d => ({ id: d.id, ...d.data() }));
  } catch (e) {
    $('icerik').innerHTML = '<p class="bos">Bu sayfa yalnız site sahibine açık.</p>';
    return;
  }
  bekleyen = Object.fromEntries(b.map(y => [y.id, y]));
  $('icerik').innerHTML = `<h2>Onay bekleyen (${b.length})</h2>` +
    (b.length ? sirala(b).map(y => kart(y, `<button class="tus kucuk koyu" data-is="onayla" data-id="${y.id}"><span class="led"></span>Onayla</button>
      <button class="tus kucuk" data-is="sil" data-id="${y.id}">Sil</button>
      <button class="tus kucuk" data-is="engelle" data-id="${y.id}" title="Bu kişi bir daha yorum gönderemez">Sil ve engelle</button>`)).join('') : '<p class="bos">Bekleyen yorum yok.</p>') +
    `<h2>Yayında (${o.length})</h2>` +
    (o.length ? sirala(o).map(y => kart(y, `<button class="tus kucuk" data-is="kaldir" data-id="${y.id}">Yayından kaldır</button>`)).join('') : '<p class="bos">Yayında yorum yok.</p>');
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
      await deleteDoc(doc(db, t.dataset.is === 'sil' ? 'bekleyen' : 'yorumlar', id));
    }
  } catch (err) { t.textContent = 'Yapılamadı: ' + err.code; return; }
  yukle();
});
