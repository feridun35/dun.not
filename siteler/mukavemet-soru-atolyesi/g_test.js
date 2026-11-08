'use strict';
/* ---------- tip testi ---------- */
const QUIZ = [
  ['İki ucu duvara kaynaklı bakır çubuk 40 °C ısıtılıyor. Duvarlara gelen kuvvet nedir?', 'hs', 'İki ucu tutulu + ısı: uzama engelleniyor, Σδ = 0.'],
  ['Bir kol, iki bağlantı çubuğu ve pimlerle duvara tutturulmuş; kolun ucuna 15 kN asılıyor. Çubuklardaki ortalama normal gerilme?', 'kg', 'Önce kol üzerinden moment ile çubuk kuvveti, sonra σ = F/A.'],
  ['Çelik cıvata alüminyum kovanın içinden geçiyor; somun çeyrek tur sıkılıyor (adım 1,5 mm). Gerilmeler?', 'cv', 'Somun ilerlemesi = cıvata uzaması + kovan kısalması; kuvvetler eşit.'],
  ['Rijit bir kiriş iki çelik çubukla asılı; kirişin ucuna yük konuyor. Uç noktanın çökmesi?', 'rk', 'Denge → çubuk kuvvetleri → δ = FL/AE → benzer üçgen.'],
  ['Zımba ile 3 mm\'lik saçtan 20 mm çaplı delik açılacak; saçın kayma mukavemeti 300 MPa. Gerekli kuvvet?', 'km', 'Kopan yüzeyi bul (π·d·t), yüzey × dayanım = kuvvet. Tek kopma biçimi olsa da "yüzey × izin verilen gerilme" mantığı bu tarifin.'],
  ['Ahşap bağlantıda cıvata, ahşabın kesmesi ve ezilmesi kontrol ediliyor; emniyet katsayısı 2,5. İzin verilen yük?', 'km', 'Birden çok kopma biçimi + emniyet katsayısı: en zayıf halka.'],
  ['Beton kolonun içinde çelik donatı var; ikisi aynı rijit plakayla yüklenip aynı miktar kısalıyor. Yük ikisine nasıl paylaşılır, betondaki ve çelikteki gerilme nedir?', 'hs', 'Yük iki parçaya bölünüyor ama nasıl bölündüğü bilinmiyor: tek denge denklemi (F₁ + F₂ = P), iki bilinmeyen. Eksik denklem uygunluktan gelir: iki parça aynı kısalıyor (δ₁ = δ₂). "İki ucu tutulu çubuk" ile aynı tarif; orada da uygunluk şartı "toplam boy değişimi 0".'],
  ['Mafsallı rijit kol, bir çubuk ve bir yay ile tutuluyor; yayın çökmesi 2 mm\'yi geçmemeli. Kol ucundaki çökme?', 'rk', 'Mafsal etrafında dönen rijit parça: δ = x·θ.'],
  ['Basamaklı çubuk iki plaka arasında; ortasından P kuvveti etkiyor. Reaksiyonlar?', 'hs', 'İki bilinmeyen, tek denklem → toplam boy değişimi 0.'],
  ['Kafes sistemde bir çubuğun kesit alanı 400 mm²; düğüm noktasında 30 kN. Çubuktaki gerilme?', 'kg', 'Düğüm dengesi ile çubuk kuvveti, sonra σ = F/A.'],
  ['Pim çapı 10 mm, çift kesme; pimin kayma gerilmesi 100 MPa\'yı aşmamalı ve plakada ezilme 200 MPa\'yı aşmamalı. En büyük P?', 'km', 'İki sınır, iki yüzey, küçüğü.'],
  ['Alüminyum boru ve içindeki çelik çubuk aynı boyda; iki ucundaki rijit plakalara birlikte bağlı (plakalar dışarıdan tutulmuyor) ve ısıtılıyor. Gerilmeler?', 'hs', 'İki parça paralel, ikisi aynı plakalara bağlı: boy değişimleri eşit olmak zorunda (uygunluk), ısıl genleşmeleri farklı olduğu için biri çekilir biri bastırılır. Denge: plakalara dışarıdan kuvvet yok, yani Fa + Fç = 0. Hiperstatik ailesinden; kuvvetler denge + uygunluk ile bulunur.']
];

PAGES.test = () => `
  <section class="hero center"><div class="kicker">ALIŞTIRMA</div><h1>TİP TESTİ</h1>
  <p class="sub">Soruyu çözme; sadece hangi tarifle çözüleceğini bul. Sınavda ilk 30 saniyen bu.</p></section>
  <section class="card"><div id="quiz"></div></section>`;

function mountTest() {
  const box = document.getElementById('quiz'); let order = QUIZ.map((_, i) => i).sort(() => Math.random() - 0.5), i = 0, ok = 0, miss = [];
  const draw = () => {
    if (i >= order.length) { const best = Math.max(store.get('quiz', 0), ok); store.set('quiz', best); const mk = [...new Set(miss)]; box.innerHTML = `<div class="tq hit"><h3>${ok} / ${order.length}</h3><div class="sn">EN İYİ SKORUN: ${best} / ${order.length}</div>${mk.length ? `<p>Karıştırdığın tarifler: ${mk.map(k => RECIPES[k].kisa).join(' · ')}</p>` : ''}<p>${ok >= 10 ? 'Tanıma tamam. Şimdi problemlerde "Kendin dene" ile hız kazan.' : 'Yanlış yaptıklarının tarifini rehberde tekrar oku, sonra testi tekrarla.'}</p><button id="qr" class="pri">TEKRAR</button></div>`; document.getElementById('qr').onclick = () => { order.sort(() => Math.random() - 0.5); i = 0; ok = 0; miss = []; draw(); }; return; }
    const [q, a, why] = QUIZ[order[i]];
    box.innerHTML = `<div class="tq"><div class="sn">SORU ${i + 1} / ${order.length} · DOĞRU ${ok}${store.get('quiz', 0) ? ' · EN İYİ ' + store.get('quiz', 0) : ''}</div><p class="qq">${q}</p>
      <div class="qopt">${TIP_ORDER.map(k => `<button data-k="${k}">${RECIPES[k].ad}</button>`).join('')}</div><div id="qfb"></div></div>`;
    box.querySelectorAll('.qopt button').forEach(b => b.onclick = () => {
      const right = b.dataset.k === a; if (right) ok++; else miss.push(a);
      box.querySelectorAll('.qopt button').forEach(x => { x.disabled = true; if (x.dataset.k === a) x.classList.add('right'); else if (x === b) x.classList.add('wrong'); });
      document.getElementById('qfb').innerHTML = `<div class="hint ${right ? 'good' : 'warn'}"><b>${right ? 'DOĞRU.' : 'DEĞİL.'}</b> ${why}</div><button class="pri" id="qn">${i + 1 >= order.length ? 'SONUCU GÖR' : 'SONRAKİ'} ▶</button>`;
      document.getElementById('qn').onclick = () => { i++; draw(); };
    });
  };
  draw();
}
