// dun.not okuyucu hesabı: isteğe bağlı Google girişi, girişe bağlı İndir, onaylı yorumlar.
// Saklanan: yorumda takma ad + metin; onay bekleyende ayrıca Google kullanıcı kimliği (uid). Ad/e-posta yazılmaz.
import { auth, db, dinle, cikis, girisYap, kacis, tarih, collection, doc, query, where, getDoc, getDocs, writeBatch, serverTimestamp } from './fb.js';

const $ = id => document.getElementById(id);
const belge = new URLSearchParams(location.search).get('d') || '';
const AD = 'dunnot.takmaad';
const GUNLUK = 3; // firestore.rules ile aynı olmalı
const KILIT = '<rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>';
const OK = '<path d="M12 4v11M7 10l5 5 5-5M5 20h14"/>';
let yorumAcik = false;

function bildir(baslik, metin) {
  const b = $('bildirim');
  b.innerHTML = `<div><b>${kacis(baslik)}</b><small>${kacis(metin)}</small></div><button class="kapat" type="button" aria-label="Kapat">×</button>`;
  b.hidden = false; b.querySelector('.kapat').onclick = () => { b.hidden = true; };
}

async function giris() {
  try { return await girisYap(); }
  catch (e) { bildir('Giriş yapılamadı', 'Bağlantını kontrol edip tekrar dene.'); return false; }
}

// Giriş tuşu: girişliyken çıkış yapar.
const hesap = $('hesap');
hesap.hidden = false;
hesap.addEventListener('click', () => auth.currentUser ? cikis() : giris());

// İndir kilidi: girişsiz tıklama önce girişi açar, giriş olunca indirmeyi sürdürür.
// shortcut: yalnız tuş kilidi; PDF okuyucu için zaten herkese açık. Gerçek kilit gerekirse PDF'ler public repodan çıkmalı.
document.addEventListener('click', async e => {
  const a = e.target.closest('#indir');
  if (!a || auth.currentUser) return;
  e.preventDefault(); e.stopPropagation();
  if (await giris()) a.click();
}, true);

// Yorumlar sekmesi ilk açılışta yüklenir.
document.querySelector('.yan .sekme [data-panel="yorumlar"]').addEventListener('click', () => { if (!yorumAcik) { yorumAcik = true; yukle(); } });

dinle(u => {
  hesap.querySelector('span').textContent = u ? 'Çıkış' : 'Giriş';
  hesap.title = u ? 'Hesaptan çık' : 'Google ile giriş yap';
  const ind = $('indir');
  ind.classList.toggle('kilitli', !u);
  ind.querySelector('svg').innerHTML = u ? OK : KILIT;
  ind.title = u ? '' : 'İndirmek için Google ile giriş yap';
  formCiz();
  if (yorumAcik) yukle();
});

function formCiz() {
  const f = $('yorum-form');
  if (!auth.currentUser) {
    f.innerHTML = '<button type="button" class="tus kucuk koyu" id="yorum-giris"><span class="led"></span>Google ile giriş yap</button><small>Yorum yazmak ve PDF indirmek için.</small>';
    $('yorum-giris').onclick = giris;
    return;
  }
  f.innerHTML = `<label class="gizli" for="yorum-ad">Takma ad</label>
    <input id="yorum-ad" class="ara-kutu" maxlength="24" minlength="2" required placeholder="Takma adın" autocomplete="off" value="${kacis(localStorage.getItem(AD) || '')}">
    <label class="gizli" for="yorum-metin">Yorum</label>
    <textarea id="yorum-metin" class="ara-kutu" maxlength="1000" rows="4" required placeholder="Sorun ya da yorumun"></textarea>
    <button class="tus kucuk koyu" type="submit">Gönder</button><small id="yorum-durum">Feridun onaylayınca herkes görür. Günde en fazla ${GUNLUK} yorum.</small>`;
}

$('yorum-form').addEventListener('submit', async e => {
  e.preventDefault();
  const ad = $('yorum-ad').value.trim(), metin = $('yorum-metin').value.trim();
  if (ad.length < 2 || !metin || !auth.currentUser) return;
  const tus = e.target.querySelector('button[type=submit]'); tus.disabled = true;
  try {
    // Günlük sınır kurallarda: sayaç aynı yazımda artar, yorum kimliği uid_gün_sıra olur (UTC günü).
    const uid = auth.currentUser.uid, t = new Date();
    const gun = t.getUTCFullYear() * 10000 + (t.getUTCMonth() + 1) * 100 + t.getUTCDate();
    const sRef = doc(db, 'sayac', uid), s = (await getDoc(sRef)).data();
    const adet = s && s.gun === gun ? s.adet + 1 : 1;
    if (adet > GUNLUK) { $('yorum-durum').textContent = `Bugünlük ${GUNLUK} yorum hakkını kullandın, yarın yine yazabilirsin.`; tus.disabled = false; return; }
    const w = writeBatch(db);
    w.set(sRef, { gun, adet });
    w.set(doc(db, 'bekleyen', `${uid}_${gun}_${adet}`), { belge, ad, metin, uid, zaman: serverTimestamp() });
    await w.commit();
    localStorage.setItem(AD, ad);
    $('yorum-metin').value = '';
    $('yorum-durum').textContent = `Gönderildi, onaylanınca herkes görecek. Bugün ${GUNLUK - adet} hakkın kaldı.`;
    yukle();
  } catch (err) { $('yorum-durum').textContent = 'Gönderilemedi, biraz sonra tekrar dene.'; }
  tus.disabled = false;
});

async function yukle() {
  const l = $('yorum-liste');
  let liste;
  try { liste = (await getDocs(query(collection(db, 'yorumlar'), where('belge', '==', belge)))).docs.map(d => d.data()); }
  catch (e) { l.innerHTML = '<p class="konu-yok">Yorumlar yüklenemedi.</p>'; return; }
  const u = auth.currentUser;
  if (u) try {
    const s = await getDocs(query(collection(db, 'bekleyen'), where('belge', '==', belge), where('uid', '==', u.uid)));
    liste = liste.concat(s.docs.map(d => ({ ...d.data(), bekliyor: true })));
  } catch (e) { /* bekleyenler gösterilemezse onaylılar yine görünür */ }
  liste.sort((a, b) => (a.zaman ? a.zaman.seconds : 1e10) - (b.zaman ? b.zaman.seconds : 1e10));
  l.innerHTML = liste.length ? liste.map(y => `<div class="yorum${y.bekliyor ? ' bekliyor' : ''}">
      <div class="yorum-ust"><b>${kacis(y.ad)}</b><time>${tarih(y.zaman)}</time></div>
      ${y.bekliyor ? '<em>Onay bekliyor · yalnız sen görüyorsun</em>' : ''}<p>${kacis(y.metin)}</p></div>`).join('')
    : '<p class="konu-yok">Henüz yorum yok. Takıldığın yeri sorabilirsin.</p>';
}
