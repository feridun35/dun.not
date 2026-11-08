'use strict';
/* Konu anlatımları 4–10 */
const svg17 = `<svg class="sch" viewBox="0 0 420 200" aria-label="Örnek 1.7 devresi">
<g stroke="#c9d0d8" stroke-width="2" fill="none"><path d="M60 40 H130 M190 40 H260 H330 V160 H60 V40"/><path d="M260 40 V75 M260 125 V160"/></g>
<circle cx="60" cy="100" r="20" fill="#11151a" stroke="#6f9bd1" stroke-width="2"/><text x="60" y="96" fill="#fff" text-anchor="middle" font-size="14">+</text><text x="60" y="114" fill="#fff" text-anchor="middle" font-size="14">−</text>
<rect x="130" y="32" width="60" height="16" fill="#11151a" stroke="#ffb020" stroke-width="2"/><rect x="252" y="75" width="16" height="50" fill="#11151a" stroke="#ffb020" stroke-width="2"/>
<path d="M330 80 L345 100 L330 120 L315 100 Z" fill="#11151a" stroke="#4fd8ff" stroke-width="2"/><path d="M330 112 V90 M324 96 L330 88 L336 96" stroke="#4fd8ff" stroke-width="2" fill="none"/>
<g fill="#c9d0d8" font-size="13" font-family="Bahnschrift,Arial Narrow"><text x="22" y="104">20V</text><text x="148" y="26">12V</text><text x="124" y="44">+</text><text x="194" y="44">−</text><text x="142" y="68">I = 5A →</text><text x="230" y="104">6A↓</text><text x="275" y="104">8V</text><text x="266" y="72">+</text><text x="266" y="140">−</text><text x="352" y="104">0,2I</text></g></svg>`;

const svg25 = `<svg class="sch" viewBox="0 0 420 190" aria-label="Örnek 2.5 devresi">
<g stroke="#c9d0d8" stroke-width="2" fill="none"><path d="M90 30 H180 M240 30 H320 V70 M320 130 V160 H90 V30"/></g>
<rect x="180" y="22" width="60" height="16" fill="#11151a" stroke="#ffb020" stroke-width="2"/><rect x="312" y="70" width="16" height="60" fill="#11151a" stroke="#ffb020" stroke-width="2"/>
<circle cx="90" cy="95" r="20" fill="#11151a" stroke="#6f9bd1" stroke-width="2"/>
<path d="M190 95 a28 28 0 1 1 30 25" stroke="#ff2d20" stroke-width="2" fill="none"/><path d="M216 126 l6 -8 l2 10z" fill="#ff2d20"/>
<g fill="#c9d0d8" font-size="13" font-family="Bahnschrift,Arial Narrow"><text x="90" y="91" text-anchor="middle" fill="#fff">+</text><text x="90" y="110" text-anchor="middle" fill="#fff">−</text><text x="40" y="99">20 V</text>
<text x="196" y="16">2 Ω</text><text x="176" y="56">+ v₁ −</text><text x="338" y="104">3 Ω</text><text x="296" y="78">−</text><text x="296" y="128">+</text><text x="282" y="104">v₂</text><text x="200" y="100" fill="#ff2d20">i</text></g></svg>`;

TOPICS.push({
  id: 'k4', no: 4, kisa: 'Güç·Enerji', title: 'Güç ve enerji, pasif işaret kabulü (Bölüm 1.5)', src: 'Konu 4 Ders Notu v2 · 18 slayt', dk: 30,
  body: `
<section><h2>Gücün tanımı</h2>
<div class="formula">p = dw / dt</div>
<p>Güç, <b>enerjinin harcanma veya emilme hızıdır</b>: ne kadar enerji kullanıldığını değil, bunun ne kadar sürede gerçekleştiğini ölçer. p: watt (W), dw: joule (J), dt: saniye (s). <b>1 W = 1 J/s</b>.</p>
<h3>Köprü denklemi (zincir kuralı)</h3>
<div class="formula">p = (dw/dq) · (dq/dt) = <span class="blue">v</span> × <span class="red">i</span></div>
<p><b>Anlık güç:</b> p zamana bağlı değişir: p(t) = v(t)·i(t) — elemanın o anki gerilimi ile içinden geçen akımın çarpımı.</p>
${hook('dw/dt’nin ortasına <b>dq</b> sıkıştır: dw/<b>dq</b> = v, <b>dq</b>/dt = i → <b>p = v·i</b>. “Volt kere amper = watt.”')}
</section>

<section><h2>Yön problemi: güç üretiliyor mu, harcanıyor mu?</h2>
<p>Batarya (güç sağlayan/üreten) enerjiyi devreye verir; direnç/motor (güç yutan/harcayan) tüketir. Bunu matematikle <b>akımın yönü ile gerilimin kutbu arasındaki ilişkiye</b> bakarak anlarız.</p>
${sc('pasif')}
<div class="key"><b>Pasif işaret kabulü (passive sign convention):</b> akımın elemanın <b>pozitif (+) terminalinden girdiği</b> durumu standart kabul eder.<br>
<b>Kural 1:</b> akım (+) uçtan girerse <b>p = +vi</b> (sonuç pozitifse eleman güç <b>yutar</b>).<br><b>Kural 2:</b> akım (−) uçtan girerse <b>p = −vi</b> (eleman güç <b>sağlar</b>).<br>Aksi belirtilmedikçe tüm analizlerde bu kabul uygulanır.</div>
<table class="t mat"><tr><th></th><th>Akım (+) uçtan girer</th><th>Akım (−) uçtan girer</th></tr><tr><th>Çarpım p &gt; 0</th><td class="y">güç YUTAR (harcar)</td><td class="g">güç ÜRETİR (sağlar)</td></tr><tr><th>Çarpım p &lt; 0</th><td class="g">güç ÜRETİR (sağlar)</td><td class="y">güç YUTAR (harcar)</td></tr></table>
<p><b>12 W güç emilmesi = −12 W güç sağlanması</b> (power absorbed = −power supplied).</p>
${ex('Rakamlarla (Şekil 1.9 / 1.10)', '4 V’luk eleman, 3 A.', ['Şekil 1.9: 3 A (+) uçtan → p = 4 × 3 = <b>+12 W</b> → harcar', 'Aynı durum: (−) uçtan −3 A girerse p = 4 × (−(−3)) = +12 W', 'Şekil 1.10: 3 A (−) uçtan → p = 4 × (−3) = <b>−12 W</b> → üretir'], 'p > 0 yutar, p < 0 sağlar')}
${hook('Su yukarıdan (+) girip aşağı (−) iniyorsa çarkı <b>çevirir</b> = enerji yer (yutar). Aşağıdan (−) girip yukarı (+) çıkıyorsa birisi onu <b>pompalıyor</b> = enerji verir (pil).')}
</section>

<section><h2>Gücün korunumu ve enerji</h2>
<div class="formula">Σ p = 0</div>
<p>Herhangi bir anda devredeki güçlerin cebirsel toplamı sıfırdır: <b>toplam sağlanan güç = toplam emilen güç</b>.</p>
<div class="formula">w = ∫ p dt = ∫ v·i dt</div>
<p>Güç bir anın ölçüsü, <b>enerji zaman içindeki birikim</b>dir (p(t) eğrisinin altındaki alan). Enerji = <b>iş yapma kapasitesi</b>. w: joule, p: watt, t: saniye.</p>
<h3>Enerji birimleri</h3>
<div class="pipe"><span>1 J = 1 W·s</span><i>× 3600 →</i><span>1 Wh = 3600 J</span><i>× 1000 →</i><span>1 kWh = 3,6 × 10⁶ J</span></div>
<p>Elektrik dağıtım şirketleri enerjiyi joule yerine <b>watt-saat (Wh / kWh)</b> ile ölçer. <b>1 Wh = 3 600 J, 1 kWh = 3 600 000 J</b>.</p>
${hook('Bir saat = 3600 saniye → <b>1 Wh = 3600 J</b>. Bir “k” daha → <b>3,6 milyon</b>.')}
</section>

<section><h2>Örnekler</h2>
${ex('Örnek 1.5 (a)', 'i(t) = 5 cos(60πt) A, v = 3i. t = 3 ms’de güç?', ['v = 3i = 15 cos(60πt) V', 'p = v·i = 75 cos²(60πt) W', 't = 3×10⁻³ s → açı = 60π × 0,003 = 0,18π rad (= 32,4°)', 'p = 75 cos²(0,18π) = 75 × 0,8443² '], 'p = 53,48 W')}
${ex('Örnek 1.5 (b)', 'Aynı akım, v = 3 di/dt. t = 3 ms’de güç?', ['v = 3 d/dt[5 cos(60πt)] = 3(−60π)5 sin(60πt) = −900π sin(60πt) V', 'p = v·i = −4500π sin(60πt) cos(60πt) W', 'p = −4500π sin(32,4°) cos(32,4°)'], 'p = −6396 W = −6,396 kW')}
${ex('Alıştırma 1.5 (a)', 'Aynı akım, v = 10 + 5∫i dt. t = 3 ms’de güç?', ['v = 10 + 5 · (5/(60π)) sin(60πt) = 10 + 0,1326 sin(60πt)', 't = 3 ms: v = 10 + 0,1326 × 0,5358 = 10,071 V; i = 5 cos 32,4° = 4,222 A', 'p = v·i'], 'p = 42,51 W')}
${ex('Alıştırma 1.5 (b)', 'Aynı akım, v = 2 di/dt + 5i. t = 3 ms’de güç?', ['di/dt = −300π sin(60πt) = −942,5 × 0,5358 = −505,0 A/s', 'v = 2(−505,0) + 5(4,222) = −988,9 V', 'p = v·i = −988,9 × 4,222'], 'Hesap: p ≈ −4 175 W. <span class="bad">Slaytta 29,7 W yazıyor</span> — bu, kitaptaki farklı bir sorunun (t = 5 ms, v = 10 + 5∫i dt) cevabı. Sınavda bu soru çıkar ve şıklarda 29,7 W görürsen hocanın cevabı odur.')}
${ex('Örnek 1.6 — ampul', '100 W ampul 2 saat çalışırsa enerji?', ['w = p × t', 'Wh: w = 100 W × 2 h = 200 Wh', 'Joule: w = 100 × 2 × 60 × 60 = 720 000 J'], '200 Wh = 720 kJ')}
${ex('Alıştırma 1.6 — ocak', '240 V hatta ocak 15 A çekiyor. 180 kJ tüketmesi için süre?', ['p = v × i = 240 × 15 = 3600 W (3,6 kW)', 't = w / p = 180 000 J / 3600 W'], 't = 50 s')}
</section>

<section><h2>4 temel ilke (sentez)</h2>
<div class="grid4"><div><b>p = v × i</b><br>güç anlık değişebilir, enerjinin değişim hızıdır</div><div><b>Pasif işaret kabulü</b><br>akım (+) uçtan girerse p = +vi (yutar); analizde hatayı önler</div><div><b>Σp = 0</b><br>sağlanan toplam = harcanan toplam</div><div><b>w = ∫p dt</b><br>enerji (J, Wh, kWh) iş yapma kapasitesi</div></div></section>`,
  kart: [
    ['Gücün tanımı?', 'Enerjinin harcanma/emilme hızı: p = dw/dt.'],
    ['1 W = ?', '1 J/s'],
    ['p = v·i nereden gelir?', 'Zincir kuralı: p = (dw/dq)(dq/dt) = v·i'],
    ['Anlık güç?', 'p(t) = v(t)·i(t) — o anki gerilim ile akımın çarpımı.'],
    ['Pasif işaret kabulü neyi standart alır?', 'Akımın elemanın (+) terminalinden girdiği durumu.'],
    ['Akım (+) uçtan girerse p = ?', '+vi'],
    ['Akım (−) uçtan girerse p = ?', '−vi'],
    ['p > 0 ne demek?', 'Eleman güç yutar (harcar).'],
    ['p < 0 ne demek?', 'Eleman güç üretir (sağlar).'],
    ['12 W emilmesi neye eşdeğer?', '−12 W sağlanmasına.'],
    ['Gücün korunumu?', 'Σp = 0: sağlanan toplam = emilen toplam.'],
    ['Enerji ile güç ilişkisi?', 'w = ∫p dt (eğri altı alan); enerji = iş yapma kapasitesi.'],
    ['1 Wh kaç J?', '3600 J'],
    ['1 kWh kaç J?', '3,6 × 10⁶ J'],
    ['Elektrik şirketleri enerjiyi hangi birimle ölçer?', 'Watt-saat (kWh).'],
    ['i = 5cos60πt, v = 3i, t = 3 ms → p?', '53,48 W'],
    ['i = 5cos60πt, v = 3 di/dt, t = 3 ms → p?', '−6,396 kW'],
    ['v = 10 + 5∫i dt, t = 3 ms → p? (slayt)', '42,51 W'],
    ['100 W ampul 2 saat?', '200 Wh = 720 kJ'],
    ['240 V, 15 A ocak 180 kJ için süre?', '50 s (p = 3600 W)'],
    ['60πt açısı t = 3 ms’de kaç derece?', '0,18π rad = 32,4°']
  ]
});

TOPICS.push({
  id: 'k5', no: 5, kisa: 'Devre elemanları', title: 'Enerji ekosistemi: devre elemanları ve kaynaklar (Bölüm 1.6)', src: 'Konu 5 Ders Notu · 17 slayt', dk: 25,
  body: `
<section><h2>Aktif ve pasif elemanlar</h2>
<p>Devre rastgele semboller değil, <b>kusursuz bir enerji alışveriş ekosistemi</b>dir; analiz rolleri ve enerjinin akış yönünü anlamaktan geçer.</p>
<table class="t"><tr><th>Kriter</th><th>Aktif elemanlar</th><th>Pasif elemanlar</th></tr>
<tr><td>Rol</td><td>devreye enerji <b>sağlar/üretir</b> (güç jeneratörü)</td><td>enerjiyi <b>yutar (harcar) veya depolar</b></td></tr>
<tr><td>Güç işareti</td><td>genellikle <b>p &lt; 0</b> (slaytta mavi)</td><td>genellikle <b>p &gt; 0</b> (slaytta turuncu)</td></tr>
<tr><td>Örnekler</td><td><b>piller, üreteçler, operasyonel amplifikatörler (op-amp)</b></td><td><b>direnç R (yutar), kondansatör C (depolar), bobin L (depolar)</b></td></tr></table>
${hook('Op-amp da <b>aktif</b>! “Pil, üreteç, op-amp: <b>P-Ü-O</b> pompalar.” Pasifler: <b>R</b> yer, <b>L</b> ve <b>C</b> saklar.')}
</section>

<section><h2>Bağımsız ve bağımlı kaynaklar</h2>
${sc('kaynak')}
<div class="two"><div><h3>Bağımsız (koşulsuz) kaynak — DAİRE</h3>Devrenin geri kalanından tamamen bağımsız olarak terminallerinde belirli gerilim veya akım sağlayan <b>aktif</b> eleman.<br><b>Gerilim kaynağı:</b> gerilim sabit (veya tanımlı fonksiyon); <b>akımı devreye bağlı</b>. Sembol: daire içinde +/−, ya da pil sembolü.<br><b>Akım kaynağı:</b> ok yönünde sabit akım; <b>gerilimi devreye bağlı</b>. Sembol: daire içinde ok.<br><b>İdeal kaynak paradoksu:</b> durumunu korumak için teoride <b>sonsuz</b> akım/gerilim verebilir; gerçek pil ve jeneratörler bunun yaklaşımıdır.</div>
<div><h3>Bağımlı (kontrollü) kaynak — ELMAS</h3>Ürettiği gerilim/akım devrenin <b>başka bir noktasındaki</b> akım veya gerilim tarafından kontrol edilir. Elmas sembolü “bağımlı” olduğunu gösterir.
<table class="t"><tr><th>Tür</th><th>Kontrol eden → üretilen</th><th>Denklem</th></tr>
<tr><td><b>VCVS</b></td><td>gerilim → gerilim</td><td>v = μ·vₓ</td></tr><tr><td><b>VCCS</b></td><td>gerilim → akım</td><td>i = g·vₓ</td></tr>
<tr><td><b>CCVS</b></td><td>akım → gerilim</td><td>v = r·iₓ</td></tr><tr><td><b>CCCS</b></td><td>akım → akım</td><td>i = β·iₓ</td></tr></table></div></div>
${hook('İsmi soldan oku: <b>V</b>oltage/<b>C</b>urrent <b>C</b>ontrolled <b>V</b>oltage/<b>C</b>urrent <b>S</b>ource. İlk harf kontrol eden, üçüncü harf üretilen. Katsayı harfleri: <b>μ</b> (V→V), <b>g</b> (V→I, “g”eçirgenlik, siemens), <b>r</b> (I→V, “r”ezistans, ohm), <b>β</b> (I→I, “β”eta transistör).')}
<p><b>Neden gerekli?</b> Modern elektroniğin yapıtaşı <b>transistör ve op-amp</b>, doğrusal analiz için eşdeğer devrelerinde bağımlı kaynakla modellenir. BJT: küçük giriş akımı i<sub>b</sub>, çok büyük çıkış akımını <b>β·i<sub>b</sub></b> kontrol eder (CCCS). “Elmas sembolü elektroniğin dilidir.”</p>
</section>

<section><h2>Örnek 1.7 — güç analizi</h2>
${svg17}
<p>Hedef: her elemanın gücünü bul, <b>Σp = 0</b>’ı ispatla.</p>
${ex('Adım 1 — bağımsız kaynak p₁', '20 V kaynak, I = 5 A', ['Akım kaynağın (−) terminalinden giriyor (ya da (+)’dan çıkıyor)', 'p₁ = v · (−i) = 20 × (−5)'], 'p₁ = −100 W (üretilen/sağlanan)')}
${ex('Adım 2 — pasifler p₂, p₃', '12 V eleman (5 A), 8 V eleman (6 A)', ['Eleman 2 (tepe): 5 A (+) uçtan → p₂ = 12 × 5 = +60 W (yutulan)', 'Eleman 3 (orta): 6 A (+) uçtan → p₃ = 8 × 6 = +48 W (yutulan)', 'İkisi toplam 108 W çekiyor'], 'p₂ = +60 W, p₃ = +48 W')}
${ex('Adım 3 — bağımlı kaynak p₄', '0,2I akım kaynağı, üzerinde 8 V', ['Değeri: 0,2 × I = 0,2 × 5 = 1 A', 'Ok yukarı: akım (−) terminalden giriyor', 'p₄ = v · (−i) = 8 × (−1)'], 'p₄ = −8 W (sağlanan)')}
${sc('terazi')}
<div class="key">Σp = −100 + 60 + 48 − 8 = <b>0 W</b> ✔ · Üretilen −108 W, yutulan +108 W. <b>Evrensel kural:</b> enerji yok edilemez, sadece aktarılır.<br><b>Alıştırma 1.7 stratejisi:</b> 1) pasif işaret kabulüyle akımın (+) mı (−) mi uçtan girdiğini tespit et 2) p = v·i uygula 3) Σp = 0’ı doğrula. (Slaytta sayılar boş bırakılmış: “[Insert P1 Value]”.)</div>
</section>

<section><h2>Bölüm özeti</h2>
<div class="grid4"><div><b>1. İki sınıf</b><br>enerjiyi yaratanlar (aktif) ve tüketen/depolayanlar (pasif)</div><div><b>2. Sembollerin gücü</b><br>daireler bağımsız güç, elmaslar transistör/op-amp’ı modelleyen “akıllı regülatörler”</div><div><b>3. Altın kural</b><br>(−) giriş = üretim, (+) giriş = tüketim</div><div><b>4. Termodinamiğin yansıması</b><br>her an Σp = 0</div></div></section>`,
  kart: [
    ['Aktif eleman nedir? Örnekler?', 'Devreye enerji sağlar/üretir: pil, üreteç, op-amp.', 'P-Ü-O'],
    ['Pasif eleman nedir? Örnekler?', 'Enerjiyi yutar veya depolar: direnç (yutar), kondansatör ve bobin (depolar).'],
    ['Aktif elemanın güç işareti genellikle?', 'Negatif (p < 0).'],
    ['Op-amp aktif mi pasif mi?', 'Aktif.'],
    ['Bağımsız kaynağın sembolü?', 'Daire.'],
    ['Bağımlı kaynağın sembolü?', 'Elmas (diamond).'],
    ['İdeal gerilim kaynağının akımı neye bağlıdır?', 'Devrenin geri kalanına.'],
    ['İdeal akım kaynağının gerilimi neye bağlıdır?', 'Devrenin geri kalanına.'],
    ['İdeal kaynak paradoksu?', 'Durumunu korumak için teoride sonsuz akım/gerilim verebilir.'],
    ['VCVS denklemi?', 'v = μ·vₓ'],
    ['VCCS denklemi?', 'i = g·vₓ'],
    ['CCVS denklemi?', 'v = r·iₓ'],
    ['CCCS denklemi?', 'i = β·iₓ'],
    ['Transistör (BJT) hangi bağımlı kaynakla modellenir?', 'CCCS: çıkış akımı β·i_b.'],
    ['Bağımlı kaynaklar neden gerekli?', 'Transistör ve op-amp’ı doğrusal analiz için eşdeğer devrede modellemek.'],
    ['Örnek 1.7: p₁, p₂, p₃, p₄?', '−100 W, +60 W, +48 W, −8 W; toplam 0.'],
    ['Örnek 1.7’de bağımlı kaynağın akımı?', '0,2 × 5 = 1 A']
  ]
});

TOPICS.push({
  id: 'k6', no: 6, kisa: 'Uygulamalar', title: 'Gerçek hayatta uygulamalar: CRT ve elektrik faturası (Bölüm 1.7)', src: 'Konu 6 Ders Notu · 10 slayt', dk: 15,
  body: `
<section><h2>Ölçeklerin mühendisliği</h2>
<p>Teorik temeller <b>[q, i, v, p, w]</b> iki ölçekte: <b>mikro</b> — yükün ve akımın vakum tüpünde ışığa dönüşmesi (CRT); <b>makro</b> — milyonlarca watt enerjinin evlerde tüketimi, ölçümü ve maliyeti (elektrik faturası).</p></section>
<section><h2>Televizyonun tarihsel temelleri</h2>
<div class="two"><div><h3>Görüntüyü GÖSTERMEK</h3><b>Karl Ferdinand Braun (1879)</b> — <b>katot ışınlı tüp (CRT)</b>. Elektronları yönlendirerek ekranda görüntü oluşturma.</div><div><h3>Görüntüyü YAKALAMAK</h3><b>Vladimir K. Zworykin</b> — <b>ikonoskop</b> ve modern TV kamerası. Optik görüntüyü elektriksel sinyale dönüştürme.</div></div>
<table class="t"><tr><th></th><th>İkonoskop</th><th>CRT</th></tr><tr><td>İşlev</td><td>optik görüntü → elektriksel sinyal (<b>kamera</b>)</td><td>elektriksel sinyal → optik görüntü (<b>ekran</b>)</td></tr>
<tr><td>Elektron demeti</td><td><b>sabit yoğunluklu</b> demetle tarar</td><td>gelen sinyale göre yoğunluğu <b>sürekli değişen</b> demet</td></tr></table>
${hook('“<b>İkonoskop dünyayı OKUR, CRT onu yeniden ÇİZER.</b>” <b>B</b>raun = <b>B</b>aşlangıç ekranı (1879). <b>Z</b>worykin = <b>Z</b>oom yapan kamera.')}
</section>
<section><h2>CRT’nin anatomisi</h2>
${sc('crt')}
<ul><li><b>Elektron tabancası:</b> yüksek potansiyelde tutulur, elektron demetini ateşler.</li><li><b>Anot (+):</b> elektronları hızlandırır ve odaklar.</li><li><b>Saptırma plakaları:</b> dikey ve yatay; demetin ekranda sağa-sola, aşağı-yukarı “boyama” yapmasını sağlar.</li><li><b>Fluoresan ekran:</b> demet çarptığı noktada ışık yayar.</li></ul>
<div class="two"><div class="formula">i = dq/dt = e · dn/dt</div><div class="formula">p = V₀ · i</div></div>
<p>Akım, saniyede taşınan elektron sayısına (n) ve bir elektronun yüküne (e) bağlıdır (eksi işaret akımın elektron akışına ters olduğunu gösterir). Hızlandırma gerilimi V₀, demetin gücünü belirler.</p>
${ex('Örnek 1.8', 'Saniyede 10¹⁵ elektron taşıyan demeti 4 W güce ulaştırmak için V₀?', ['i = e·(dn/dt) = (−1,6×10⁻¹⁹)(10¹⁵) = −1,6×10⁻⁴ A (büyüklük 1,6×10⁻⁴ A)', 'p = V₀·i → V₀ = p/i = 4 / (1,6×10⁻⁴)'], 'V₀ = 25 000 V = 25 kV')}
${ex('Alıştırma 1.8', 'Saniyede 10¹³ elektron, V₀ = 30 kV. Demet gücü?', ['i = 1,6×10⁻¹⁹ × 10¹³ = 1,6×10⁻⁶ A', 'p = 30 000 × 1,6×10⁻⁶'], 'p = 0,048 W = 48 mW (az elektron, çok yüksek gerilim → miliwatt)')}
</section>
<section><h2>Makro ölçek: evlerde tüketim</h2>
<div class="formula">[Güç (kW)] × [Zaman (h)] = [Enerji (kWh)] → [Maliyet]</div>
<p>Faturalandırma <b>kWh</b> ölçümüne dayanır. Tüketim sıfır olsa bile şebekeye bağlı kalmanın altyapısal bir maliyeti (<b>sabit abonelik ücreti</b>) vardır.</p>
${sc('tuketim')}
<p>Tablo 1.3 (beş kişilik aile, aylık ortalama), slayttaki üç grupla:</p>
<table class="t"><tr><th>Grup</th><th>Cihazlar (kWh/ay)</th></tr>
<tr><td><b>Isıtma ve soğutma (en yüksek)</b></td><td>şofben <b>500</b> · fırın/ocak 100 · buzdolabı/dondurucu 100</td></tr>
<tr><td><b>Beyaz eşya (orta)</b></td><td>çamaşır makinesi 120 · kurutma makinesi 80</td></tr>
<tr><td><b>Elektronik ve aydınlatma (düşük)</b></td><td>aydınlatma 100 · TV 10 · saat <b>2</b></td></tr></table>
<p>Isıtma odaklı cihazlarla mikro-elektronikler arasında devasa enerji farkı var.</p>
${hook('“<b>Isıtan yakar</b>”: şofben tek başına diğer her şeyden fazla. Saat yalnız 2 kWh.')}
</section>`,
  kart: [
    ['CRT’yi kim, ne zaman icat etti?', 'Karl Ferdinand Braun, 1879.', 'B-aşlangıç'],
    ['İkonoskopu kim geliştirdi?', 'Vladimir K. Zworykin.'],
    ['İkonoskopun işlevi?', 'Optik görüntüyü elektriksel sinyale çevirir (kamera).'],
    ['CRT’nin işlevi?', 'Elektriksel sinyali optik görüntüye çevirir (ekran).'],
    ['İkonoskop ve CRT’de elektron demeti farkı?', 'İkonoskop: sabit yoğunluklu demetle tarar. CRT: sinyale göre yoğunluğu değişen demet.'],
    ['“Dünyayı okur / yeniden çizer”?', 'İkonoskop okur, CRT çizer.'],
    ['CRT’de anodun görevi?', 'Elektronları hızlandırmak ve odaklamak.'],
    ['Saptırma plakalarının görevi?', 'Demeti sağa-sola, aşağı-yukarı yönlendirmek (boyama).'],
    ['Fluoresan ekran ne yapar?', 'Demet çarptığı noktada ışık yayar.'],
    ['CRT akım formülü?', 'i = e·dn/dt'],
    ['CRT güç formülü?', 'p = V₀·i'],
    ['10¹⁵ e/s, 4 W → V₀?', '25 kV'],
    ['10¹³ e/s, 30 kV → p?', '48 mW'],
    ['Fatura neye göre?', 'Enerji (kWh) × birim fiyat + sabit abonelik ücreti.'],
    ['Tablo 1.3’te en çok tüketen?', 'Şofben (500 kWh/ay).'],
    ['Tablo 1.3’te en az tüketen?', 'Saat (2 kWh/ay); TV 10 kWh.'],
    ['Tablo 1.3’ün üç grubu?', 'Isıtma-soğutma (en yüksek: şofben, fırın, buzdolabı), beyaz eşya (orta: çamaşır, kurutma), elektronik-aydınlatma (düşük: aydınlatma, TV, saat).'],
    ['Çamaşır ve kurutma makinesinin aylık tüketimi?', '120 kWh ve 80 kWh.'],
    ['Mikro ve makro ölçek örnekleri (Konu 6)?', 'Mikro: CRT’de yük/akımın ışığa dönüşmesi. Makro: evlerde enerji tüketimi ve elektrik faturası.']
  ]
});

TOPICS.push({
  id: 'k7', no: 7, kisa: 'Problem çözme', title: 'Mühendislikte problem çözme: 6 adımlı metot (Bölüm 1.8)', src: 'Konu 7 Ders Notu · 3 slayt', dk: 8,
  body: `
<section><h2>Değişmeyen tek şey: problem çözme ilkeleri</h2>
<p>Kariyer boyunca problemlerin karmaşıklığı ve boyutu değişir; <b>temel ilkeler değişmez</b>. Başka gezegendeki bir cihazı (NASA Mars Rover: milyonlarca km uzakta, bakım gerektirmeyen otonom elektro-mekanik sistem) tasarlamak ile basit bir direnci analiz etmek <b>aynı evrensel mantık dizgesini</b> gerektirir.</p>
<div class="flow6">
<div class="ph p1"><b>Aşama 1: Kurulum</b> (Adım 1 & 2)<ol><li><b>Problemi dikkatle tanımla.</b></li><li><b>Problem hakkında bildiklerini sun</b> (veriler, istenen).</li></ol></div>
<div class="ph p2"><b>Aşama 2: Strateji ve Çözüm</b> (Adım 3 & 4)<ol start="3"><li><b>Alternatif çözümler kur, başarı olasılığı en yüksek olanı seç.</b></li><li><b>Çözmeyi dene.</b></li></ol></div>
<div class="ph p3"><b>Aşama 3: Doğrulama</b> (Adım 5 & 6)<ol start="5"><li><b>Çözümü değerlendir, doğruluğunu kontrol et.</b></li><li><b>Problem tatmin edici çözüldü mü?</b> Evet → sun. Hayır → 3. adıma dön.</li></ol></div></div>
<p class="mut">Girdi: belirsiz problem → çıktı: doğrulanmış çözüm. Slaytta yalnız 3 aşama ve geri besleme okları var; adımların açık hali ders kitabından (Alexander &amp; Sadiku 1.8).</p>
<div class="key"><b>Kritik içgörü:</b> bu metot yalnız devreleri değil; <b>termodinamik, akışkanlar mekaniği ve statik</b> problemlerini çözmek için de evrensel bir şablondur.</div>
${hook('<b>T-B-S-Ç-K-T</b>: “<b>T</b>anımla, <b>B</b>ildiğini yaz, <b>S</b>eç, <b>Ç</b>öz, <b>K</b>ontrol et, <b>T</b>amam mı?” — 3 aşama × 2 adım. Hayırsa <b>3’e (Seç)</b> geri dön.')}
</section>`,
  kart: [
    ['6 adımlı yöntemin 3 aşaması?', 'Kurulum (1-2), Strateji ve çözüm (3-4), Doğrulama (5-6).'],
    ['1. ve 2. adım?', '1) Problemi dikkatle tanımla 2) Bildiklerini sun.'],
    ['3. ve 4. adım?', '3) Alternatif çözümler, en olasıyı seç 4) Çözmeyi dene.'],
    ['5. ve 6. adım?', '5) Değerlendir/doğruluğu kontrol et 6) Tatmin edici mi? Değilse 3. adıma dön.'],
    ['Çözüm tatmin edici değilse hangi adıma dönülür?', '3. adım (alternatif çözümler).'],
    ['Bu metot hangi alanlarda da kullanılabilir?', 'Termodinamik, akışkanlar mekaniği, statik (evrensel şablon).'],
    ['Slaytta örnek verilen otonom sistem?', 'NASA Mars Rover.']
  ]
});

TOPICS.push({
  id: 'k8', no: 8, kisa: 'Ohm·Direnç', title: 'Temel yasalar: Ohm yasası ve direnç (Bölüm 2.1–2.2)', src: 'Konu 8 Ders Notu v2 · 19 slayt', dk: 30,
  body: `
<section><h2>Devre teorisinin temel alfabesi</h2>
<p>En karmaşık devreler bile üç yasa üzerine kurulur: <b>Ohm yasası, Kirchhoff akım yasası (KCL), Kirchhoff gerilim yasası (KVL)</b>. Bu bölüm malzemenin elektriksel davranışını tanımlayan Ohm yasası.</p></section>
<section><h2>Direncin fiziksel geometrisi</h2>
<div class="formula">R = ρ · ℓ / A</div>
${sc('ozdirenc')}
<ul><li><b>R (direnç, Ω):</b> malzemenin akıma gösterdiği zorluk.</li><li><b>ρ (özdirenç, Ω·m):</b> malzemenin atomik yapısına bağlı spesifik sabit.</li><li><b>ℓ (uzunluk):</b> elektronların kat etmesi gereken yol — uzunluk arttıkça direnç artar.</li><li><b>A (kesit alanı):</b> akış koridoru — alan genişledikçe direnç düşer (akışkanlardaki boru çapı gibi).</li></ul>
<table class="t"><tr><th>İletkenler — akımın serbest otobanı</th><th>Yarı iletkenler — koşullara bağlı anahtarlar</th><th>Yalıtkanlar — aşılmaz duvarlar</th></tr>
<tr><td>gümüş 1,64×10⁻⁸ · bakır 1,72×10⁻⁸ · alüminyum · altın</td><td>karbon 4×10⁻⁵ · germanyum 0,47 · silisyum 640</td><td>kâğıt 10¹⁰ · mika · cam · teflon &gt;10¹²</td></tr></table>
${hook('En iyi iletken <b>gümüş</b> (1,64), hemen ardından <b>bakır</b> (1,72). Yarı iletkenler “<b>K-G-S</b>” sırayla büyür: Karbon → Germanyum → Silisyum. Yalıtkanda “<b>Teflon tavada hiçbir şey yapışmaz</b>” → en büyük (&gt;10¹²).')}
<p>Mühendislik soyutlaması: karmaşık fiziksel yapıyı ve geometriyi devre analizinde <b>tek bir parametreye (R)</b> indirgeriz.</p></section>
<section><h2>Ohm yasası (1826)</h2>
<div class="formula big"><span class="blue">v</span> = <span class="red">i</span> · R</div>
<p><b>Georg Simon Ohm (1787–1854)</b>: direnç üzerindeki gerilim, üzerinden geçen akımla <b>doğru orantılı</b>dır. Direnç birimi <b>ohm (Ω)</b>: <b>1 Ω = 1 V/A</b>.</p>
<h3>Pasif işaret kabulü</h3>
<div class="two"><div><b>Doğru yönleme:</b> akım (+) uçtan girer → <b>v = +i·R</b></div><div><b>Ters yönleme:</b> akım (−) uçtan girer → <b>v = −i·R</b></div></div>
<p class="mut">Makine notu: akım yüksek potansiyelden düşüğe akar (su yüksekten aşağı akar gibi); enerji harcayan pasif elemanlarda akım daima (+) uçtan girer.</p>
<h3>Direncin iki uç durumu</h3>
<div class="two"><div><h3>Kısa devre: R = 0 Ω → v = 0 V</h3>Akım serbestçe ve limitsizce akar; iki nokta arası voltaj farkı sıfır. (Tamamen açık boru.)</div><div><h3>Açık devre: R = ∞ Ω → i = 0 A</h3>Akım tamamen durur; iki uç arasında maksimum gerilim (potansiyel fark) bulunabilir. (Kapalı vana.)</div></div>
${sc('su')}
${trap('Kısa devrede <b>gerilim</b> sıfırdır (akım değil). Açık devrede <b>akım</b> sıfırdır (gerilim değil).')}
</section>
<section><h2>Direnç çeşitleri, doğrusallık, iletkenlik</h2>
<table class="t"><tr><th>Sabit</th><th>Ayarlanabilir</th><th>Modern</th></tr><tr><td><b>Wirewound</b> (tel sargılı): yüksek güç kapasitesi · <b>Karbon film</b>: standart devre elemanı</td><td><b>Potansiyometre & reosta</b>: hareketli silecek (wiper) ile değişen direnç — mekanik sistemlere entegrasyon için kritik</td><td><b>Entegre devre / SMD</b> (yüzey montajlı): kompakt elektronik</td></tr></table>
<p><b>Doğrusal ve doğrusal olmayan:</b> Ohm yasası yalnız <b>doğrusal</b> elemanlar için geçerlidir (i–v grafiği düz çizgi, eğim m = 1/R). Diyot, ampul gibi doğrusal olmayan elemanlarda R anlık akım/gerilime göre değişir.</p>
<div class="formula">G = 1/R = i/v</div>
<p><b>İletkenlik (conductance):</b> elemanın akıma ne kadar direndiği yerine ne kadar iyi ilettiği. Birimi <b>siemens (S)</b> veya geleneksel <b>mho (℧, ters ohm)</b>. Paralel devrelerde matematiksel kolaylık.</p>
${hook('<b>mho</b> = ohm’un tersten yazılışı; sembolü de ters Ω: <b>℧</b>.')}
<h3>Dirençte harcanan güç</h3>
<div class="formula">p = v·i = i²R = v²/R = v²G = i²/G</div>
<p><b>Güç daima pozitif (p ≥ 0).</b> Direnç pasiftir; enerji üretemez, yalnız güç absorbe eder ve ısıya dönüştürür.</p>
</section>
<section><h2>Analitik çözüm metodolojisi ve örnekler</h2>
<div class="tri"><div><b>Adım 1: Devre (sistem modeli)</b><br>şemayı incele, yönleri belirle</div><div><b>Adım 2: Veriler & kural</b><br>bilinenleri (V, I, R) çıkar, yasayı (Ohm) seç</div><div><b>Adım 3: Çözüm</b><br>işlemleri uygula, birimleri kontrol et</div></div>
${ex('Örnek 2.1 — ütü', '120 V’ta 2 A çeken ütünün direnci?', ['R = V / I = 120 / 2'], 'R = 60 Ω')}
${ex('Alıştırma 2.1 — ekmek kızartıcı', '110 V, R = 15 Ω. Akım?', ['I = V / R = 110 / 15'], 'I = 7,333 A')}
${ex('Gerilim kaynağı ile', '30 V kaynağa 5 kΩ bağlı. i, G, p?', ['i = v/R = 30/5000 = 6 mA', 'G = 1/R = 1/5000 = 0,2 mS', 'p = v·i = 30 × 6×10⁻³ = 180 mW'], 'i = 6 mA, G = 0,2 mS, p = 180 mW')}
${ex('Akım kaynağı ile', '3 mA kaynağa 10 kΩ bağlı. v, G, p?', ['v = i·R = 3×10⁻³ × 10×10³ = 30 V', 'G = 1/10000 = 100 μS', 'p = i²R = (3×10⁻³)² × 10⁴ = 90 mW'], 'v = 30 V, G = 100 μS, p = 90 mW')}
${sc('anlikguc')}
${ex('Zamanla değişen sinyal', 'v(t) = 20 sin(πt) V, R = 5 kΩ. i(t), p(t)?', ['Ohm yasası her ANDA geçerli: i(t) = v(t)/R = 20 sin(πt)/5000', 'i(t) = 4 sin(πt) mA', 'p(t) = v·i = 20 sin(πt) × 4 sin(πt)'], 'i = 4 sin πt mA, p = 80 sin²πt mW')}
${ex('Tersine mühendislik', 'p(t) = 30 cos²(t) mW, v(t) = 15 cos(t) V. i(t) ve R?', ['p = v·i → 30 cos²t = 15 cos t · i(t)', 'i(t) = 2 cos(t) mA', 'R = v/i = 15 cos t / (2×10⁻³ cos t)'], 'i = 2 cos t mA, R = 7,5 kΩ')}
<table class="t"><tr><th>Değişken</th><th>Sembol</th><th>Birim</th><th>Bağıntı</th><th>Enerji rolü</th></tr>
<tr><td>Gerilim</td><td>v</td><td>volt (V)</td><td>v = i·R</td><td>enerji iten güç</td></tr><tr><td>Akım</td><td>i</td><td>amper (A)</td><td>i = v/R</td><td>yük akışı</td></tr>
<tr><td>Direnç</td><td>R</td><td>ohm (Ω)</td><td>R = ρℓ/A</td><td>akışa karşı koyma</td></tr><tr><td>İletkenlik</td><td>G</td><td>siemens (S)</td><td>G = 1/R</td><td>akış kolaylığı</td></tr>
<tr><td>Güç</td><td>p</td><td>watt (W)</td><td>p = i²R = v²/R</td><td>harcanan enerji</td></tr></table>
</section>`,
  kart: [
    ['Devre teorisinin 3 temel yasası?', 'Ohm, KCL, KVL.'],
    ['Direnç–geometri formülü?', 'R = ρℓ/A'],
    ['Uzunluk artarsa direnç? Kesit artarsa?', 'Uzunluk ↑ → R ↑; kesit ↑ → R ↓.'],
    ['Özdirencin birimi?', 'Ω·m'],
    ['En düşük özdirençli malzeme (slayt)?', 'Gümüş 1,64×10⁻⁸ Ω·m (bakır 1,72×10⁻⁸).'],
    ['Karbon, germanyum, silisyum hangi sınıf?', 'Yarı iletken (4×10⁻⁵, 0,47, 640 Ω·m).'],
    ['Kâğıt, mika, cam, teflon?', 'Yalıtkan (kâğıt 10¹⁰, teflon >10¹²).'],
    ['Ohm yasası kimin, ne zaman?', 'Georg Simon Ohm (1787–1854), 1826.'],
    ['1 Ω = ?', '1 V/A'],
    ['Akım (−) uçtan girerse Ohm yasası?', 'v = −iR'],
    ['Kısa devre: R, v?', 'R = 0, v = 0 (akım limitsiz).'],
    ['Açık devre: R, i?', 'R = ∞, i = 0 (gerilim olabilir).'],
    ['Ohm yasası hangi elemanlar için geçerli?', 'Doğrusal (lineer) elemanlar; diyot, ampul gibi doğrusal olmayanlarda değil.'],
    ['Doğrusal direncin i–v eğimi?', '1/R'],
    ['Potansiyometre/reosta?', 'Hareketli silecekli ayarlanabilir direnç.'],
    ['Wirewound direncin özelliği?', 'Yüksek güç kapasitesi.'],
    ['İletkenlik formülü ve birimi?', 'G = 1/R = i/v; siemens (S) veya mho (℧).'],
    ['Dirençte güç formülleri?', 'p = vi = i²R = v²/R = v²G = i²/G'],
    ['Dirençte güç işareti?', 'Daima p ≥ 0 (yutar, ısıya çevirir).'],
    ['120 V, 2 A ütü → R?', '60 Ω'],
    ['110 V, 15 Ω → I?', '7,333 A'],
    ['30 V, 5 kΩ → i, G, p?', '6 mA, 0,2 mS, 180 mW'],
    ['3 mA, 10 kΩ → v, G, p?', '30 V, 100 μS, 90 mW'],
    ['v = 20 sin πt, R = 5 kΩ → i, p?', 'i = 4 sin πt mA; p = 80 sin²πt mW'],
    ['p = 30cos²t mW, v = 15cos t → i, R?', 'i = 2 cos t mA; R = 7,5 kΩ'],
    ['Ohm yasası zamanla değişen sinyallerde geçerli mi?', 'Evet, her anda (instantaneous) geçerli.']
  ]
});

TOPICS.push({
  id: 'k9', no: 9, kisa: 'Topoloji', title: 'Ağ topolojisi: düğümler, dallar, çevreler (Bölüm 2.3)', src: 'Konu 9 Ders Notu v2 · 19 slayt', dk: 25,
  body: `
<section><h2>Mekanizmalardan elektrik ağlarına</h2>
<p>Makinede sistemler <b>uzuvlar</b> (parçalar) ve <b>mafsallardan</b> (bağlantılar) oluşur. Elektrikte elemanlar (<b>dallar</b>) ideal iletkenlerle birleştiği (<b>düğümler</b>) <b>ağlardan</b> (network) oluşur. <b>Devre</b>, kapalı yol sağlayan özel bir ağdır. <b>Topoloji</b> ağın fiziksel boyutundan bağımsız olarak yalnız “geometrik bağlantı düzenini” inceler.</p>
<div class="tri"><div><b>Dal (branch)</b><br>analoji: makine uzvu / eleman<br>gerilim kaynağı, direnç vb. iki uçlu <b>tek bir elektriksel eleman</b></div><div><b>Düğüm (node)</b><br>analoji: mafsal / bağlantı noktası<br><b>iki veya daha fazla dalın birleştiği</b> ortak nokta</div><div><b>Çevre (loop)</b><br>analoji: kapalı hareket döngüsü<br>bir düğümden başlayıp <b>hiçbir düğümden iki kez geçmeden</b> aynı noktaya dönen kapalı yol</div></div></section>
<section><h2>Dal ve düğüm kuralları</h2>
<ul><li><b>Her eleman tek bir dal</b> sayılır (10 V kaynak, 5 Ω direnç, 2 A kaynak…). <b>İdeal iletken teller dal değildir</b>; yalnız elemanları birbirine bağlayan köprülerdir.</li>
<li><b>En yaygın yanılgı:</b> şemadaki her siyah noktayı ayrı düğüm sanmak. Gerçek: iki veya daha fazla elemanı bağlayan <b>ideal iletken telin tamamı eşpotansiyeldir ve tek bir düğümdür</b>. Düğüm kâğıttaki nokta değil, aynı gerilime sahip bir <b>bölge</b>dir.</li>
<li><b>Geometrik illüzyon:</b> uzatılmış tellerle çizilen devre ile tellerin tek noktada büzüldüğü devre <b>tamamen aynıdır</b>. Mesafe ve şekil önemsiz; “<b>kim kiminle bağlı</b>” önemli.</li></ul>
<h3>Çevre ve bağımsızlık</h3>
<p><b>Bağımsız çevre:</b> diğer çevrelerde bulunmayan <b>en az bir benzersiz dala</b> sahip kapalı yol. İki iç göz bağımsızdır; dış çevre bağımlıdır (içindekilerin toplamı). Bilinmeyenleri çözmek için yalnız bağımsız çevreler lineer bağımsız denklem verir.</p>
<div class="formula big">b = l + n − 1</div>
<p><b>Topolojinin temel teoremi:</b> b = dal sayısı (elemanlar), l = bağımsız çevre sayısı (denklemler), n = düğüm sayısı. Makinede Grübler denklemi serbestliği belirler; elektrik ağında bu teorem bağımsız denklem sayısını belirler.</p>
${hook('“<b>Dal = Loop + Node − 1</b>” → “<b>b</b>ir <b>l</b>imon <b>n</b>e kadar eksi bir”. Çevir: <b>l = b − n + 1</b>.')}
</section>
<section><h2>Seri ve paralel</h2>
<table class="t"><tr><th>Bağlantı</th><th>Topolojik kriter</th><th>Paylaşılan büyüklük</th><th>Mekanik analoji</th></tr>
<tr><td><b>SERİ</b></td><td>yalnızca <b>tek bir ortak düğüm</b> paylaşırlar ve o düğüme <b>başka hiçbir dal bağlı değil</b></td><td><b>aynı AKIM</b></td><td>aynı debili, uç uca eklenmiş iki boru</td></tr>
<tr><td><b>PARALEL</b></td><td>aynı <b>iki düğüme</b> doğrudan bağlılar</td><td><b>aynı GERİLİM</b></td><td>aynı zeminden aynı tavana çıkan iki merdiven</td></tr>
<tr><td>Karma</td><td>belirsiz / değişken</td><td>hiçbiri</td><td></td></tr></table>
${hook('<b>S</b>eri = <b>S</b>ıra (tek sıra, tek akım). <b>P</b>aralel = <b>P</b>otansiyel aynı (iki ortak düğüm, aynı gerilim).')}
<h3>Topolojik inceleme algoritması</h3>
<ol><li><b>Düğümleri renklendir:</b> kesişim noktalarını bul, ideal iletken boyunca rengi uzat.</li><li><b>Dalları say:</b> tüm aktif ve pasif elemanları tek tek etiketle.</li><li><b>İlişkileri teşhis et:</b> ortak düğüm sayısına bakarak seri/paralel matrisini uygula.</li></ol>
${sc('topoloji')}
${ex('Örnek 2.4', 'Dal ve düğüm sayısı; seri/paralel ilişkiler?', ['Dallar: 10 V kaynak, 5 Ω, 6 Ω, 2 A kaynak → b = 4', 'Düğümler: Düğüm 1 (kaynak–5 Ω arası), Düğüm 2 (üst sağ tel), Düğüm 3 (alt tel) → n = 3', 'l = b − n + 1 = 4 − 3 + 1 = 2 bağımsız çevre', '10 V ve 5 Ω: yalnız Düğüm 1’i paylaşıyor → SERİ (aynı akım)', '6 Ω ve 2 A: ikisi de Düğüm 2–3 arası → PARALEL (aynı gerilim)'], 'b = 4, n = 3, l = 2')}
${ex('Alıştırma 2.4', 'Kaynak 10 V; dirençler 5, 1, 2, 4 Ω.', ['b = 5 (10 V, 5 Ω, 1 Ω, 2 Ω, 4 Ω)', 'n = 3 (kitap cevabı)', '1 Ω ∥ 2 Ω', '4 Ω ∥ 10 V kaynak (fiziksel olarak uzak ama aynı iki düğüme bağlı!)', '5 Ω tek tek seri ya da paralel değil; 1 Ω ve 2 Ω’un paralel eşdeğeriyle seri konumda'], 'b = 5, n = 3 → l = 3')}
${trap('Alıştırma 2.4 slaytlarında çelişki var: bir slayt “n = 2, tüm elemanlar paralel” diyor, sonraki slayt 3 düğümle (1 Ω ∥ 2 Ω, 4 Ω ∥ 10 V, 5 Ω seri) anlatıyor. Kitabın cevabı <b>5 dal, 3 düğüm</b>. Şıklarda “4 Ω ile 10 V paralel” ve “1 Ω ile 2 Ω paralel” görürsen doğru.')}
<div class="key"><b>Sentez:</b> Yapı (anatomi): elemanlar = dallar (b), bağlantılar = düğümler (n), döngüler = çevreler (l). İşlev: tek düğüm (seri) → akım bütünlüğü; iki düğüm (paralel) → gerilim bütünlüğü. Sistem kanunu: b = l + n − 1. <b>“Bir devrenin görünümü sizi yanıltabilir; gerçeği yalnızca topolojisi söyler.”</b> Mekanikteki kinematik zincirler hareket sınırlarını nasıl çiziyorsa, düğüm ve dal yapısı da akım ve gerilimin izleyeceği yolları belirler. <b>“Topolojiyi anlamak, devreyi okumaktır.”</b></div>
</section>`,
  kart: [
    ['Dal (branch) nedir?', 'İki uçlu tek bir elektriksel eleman (kaynak, direnç…).', 'uzuv'],
    ['Düğüm (node) nedir?', 'İki veya daha fazla dalın birleştiği ortak nokta (eşpotansiyel bölge).', 'mafsal'],
    ['Çevre (loop) nedir?', 'Hiçbir düğümden iki kez geçmeden başlangıca dönen kapalı yol.'],
    ['İdeal teller dal sayılır mı?', 'Hayır; yalnız elemanları bağlayan köprülerdir.'],
    ['Şemadaki her nokta ayrı düğüm müdür?', 'Hayır; ideal telin tamamı tek düğümdür.'],
    ['Topolojide ne önemlidir?', '“Kim kiminle bağlı”; mesafe ve şekil önemsiz.'],
    ['Bağımsız çevre?', 'Diğer çevrelerde olmayan en az bir benzersiz dalı olan kapalı yol.'],
    ['Topolojinin temel teoremi?', 'b = l + n − 1', 'bir limon ne kadar eksi bir'],
    ['b = 5, n = 3 → l?', '3'],
    ['b = 4, n = 3 → l?', '2'],
    ['Seri bağlantı kriteri ve ortak büyüklük?', 'Tek ortak düğüm, o düğüme başka dal yok; aynı akım.'],
    ['Paralel bağlantı kriteri ve ortak büyüklük?', 'Aynı iki düğüme bağlı; aynı gerilim.'],
    ['Paralelin mekanik analojisi?', 'Aynı zeminden aynı tavana çıkan iki merdiven.'],
    ['Serinin mekanik analojisi?', 'Aynı debiye sahip uç uca eklenmiş iki boru.'],
    ['Topolojik inceleme 3 adımı?', 'Düğümleri renklendir, dalları say, ilişkileri teşhis et.'],
    ['Örnek 2.4: b, n?', 'b = 4, n = 3'],
    ['Örnek 2.4’te seri olanlar?', '10 V kaynak ve 5 Ω.'],
    ['Örnek 2.4’te paralel olanlar?', '6 Ω ve 2 A kaynak.'],
    ['Alıştırma 2.4: b, n, paraleller?', 'b = 5, n = 3; 1 Ω ∥ 2 Ω; 4 Ω ∥ 10 V.'],
    ['Alıştırma 2.4’te 5 Ω’un durumu?', '1 Ω ∥ 2 Ω eşdeğeriyle seri.'],
    ['Devre ile ağ farkı?', 'Ağ: elemanların düğümlerde birleşmesi. Devre: kapalı yol sağlayan özel bir ağ.'],
    ['Topoloji neyi inceler?', 'Ağın fiziksel boyutundan bağımsız, yalnız geometrik bağlantı düzenini.'],
    ['Makinede serbestliği hangi denklem belirler (slayttaki benzetme)?', 'Grübler denklemi; elektrikte karşılığı b = l + n − 1.'],
    ['Topoloji slaytının son cümlesi?', '“Topolojiyi anlamak, devreyi okumaktır.”']
  ]
});

TOPICS.push({
  id: 'k10', no: 10, kisa: 'Kirchhoff', title: 'Kirchhoff yasaları: KCL ve KVL (Bölüm 2.4)', src: 'Konu 10 Ders Notu v2 · sayfa 1–12 (+13 bonus)', dk: 30,
  body: `
<section><h2>İki temel korunum yasası</h2>
<p><b>Gustav Robert Kirchhoff (1824–1887)</b>, <b>1847</b>’de devrelerdeki karmaşık akım ve gerilim ilişkilerini doğanın iki değişmez kuralına dayandırarak basitleştirdi.</p>
<div class="two"><div><b>Yükün korunumu</b> (law of conservation of charge): kapalı sistemde net yük yoktan var edilemez, var olan yok edilemez → <b>KCL’nin temeli</b>.</div><div><b>Enerjinin korunumu</b> (law of conservation of energy): kapalı döngüde harcanan ve kazanılan enerjilerin toplamı sıfır → <b>KVL’nin temeli</b>.</div></div>
${hook('<b>K-C-L</b> = <b>C</b>harge (yük) korunur; <b>K-V-L</b> = <b>V</b>olt → enerji korunur. “<b>A</b>kım <b>d</b>üğümde, <b>g</b>erilim <b>ç</b>evrede.”')}
</section>
<section><h2>KCL — Kirchhoff’un akım yasası</h2>
<p>Sıkıştırılamaz akışkanlarda boruların birleştiği noktada kütle korunur: giren su = çıkan su. Elektrik akımı da bu kurala kusursuzca uyar. <b>Düğüm net yük depolayamaz.</b> KCL, kütlenin korunumu yasasının elektriksel karşılığıdır.</p>
${sc('kcl')}
<div class="formula">Σ<sub>n=1</sub><sup>N</sup> iₙ = 0</div>
<p><b>Tanım:</b> bir düğüme giren akımların cebirsel toplamı sıfırdır. İşaret sözleşmesi (slayt): <b>giren akımlar (−), çıkan akımlar (+)</b> → −i₁ − i₂ + i₃ + i₄ + i₅ = 0. <b>Alternatif ifade:</b> Σi<sub>giren</sub> = Σi<sub>çıkan</sub> → i₁ + i₂ = i₃ + i₄ + i₅.</p>
<p><b>Kapalı yüzeyler ve süperdüğümler:</b> KCL yalnız tek bir nokta için değil, devrenin herhangi bir bölümünü içine alan <b>kapalı yüzey</b> (closed boundary) için de geçerlidir. Düğüm, uzayda bir noktaya küçültülmüş kapalı yüzeydir. Kutunun içinde ne olduğu önemsiz; KCL yalnız sınırı delen kablolara bakar: <b>toplam giren = toplam çıkan</b>.</p>
<p><b>KCL pratiği — paralel akım kaynakları:</b> ortak düğüme KCL uygulanarak tek eşdeğer kaynağa dönüşür: <b>I<sub>eş</sub> = I₁ − I₂ + I₃</b> (ters yönlü olan çıkarılır).</p>
${trap('<b>Kritik kural:</b> KCL ihlal edilmesin diye aynı kola <b>seri bağlı iki farklı akım kaynağı</b> bulunamaz (tam olarak aynı değerde değilse).')}
</section>
<section><h2>KVL — Kirchhoff’un gerilim yasası</h2>
<p>Termodinamikte kapalı yol boyunca yapılan net iş sıfırdır. Gerilim “elektriksel yükseklik” gibidir: kapalı bir çevrede tura çıktığında çıktığın tepeler (gerilim yükselmeleri, pil) ve indiğin vadiler (gerilim düşümleri, direnç) sonunda başladığın noktaya <b>sıfır net değişimle</b> döndürür. Kablo boyunca değişim 0 V. <b>Çevre net enerji üretemez veya yok edemez</b>; KVL enerjinin korunumunun ta kendisidir.</p>
${sc('yukus')}
<div class="formula">Σ<sub>m=1</sub><sup>M</sup> vₘ = 0</div>
<p><b>Tanım:</b> kapalı bir çevre boyunca tüm gerilimlerin cebirsel toplamı sıfırdır. <b>Kutupluluk kuralı:</b> çevre etrafında (saat yönü veya tersi) dönerken bir elemanın <b>ilk karşılaşılan terminalinin işareti</b> (+ veya −) denkleme yazılır. Örnek: −v₁ + v₂ + v₃ − v₄ + v₅ = 0. <b>Alternatif:</b> toplam gerilim yükselmesi = toplam gerilim düşümü → v₂ + v₃ + v₅ = v₁ + v₄.</p>
<p><b>KVL pratiği — seri gerilim kaynakları:</b> tek eşdeğer kaynağa dönüşür: <b>V<sub>eş</sub> = V₁ + V₂ − V₃</b> (ters kutuplu olan çıkarılır).</p>
${sc('serikaynak')}
${trap('<b>Kritik kural:</b> KVL ihlal edilmesin diye <b>paralel kollarda iki farklı gerilim kaynağı</b> bulunamaz (tam aynı değerde değilse); aksi halde kısa devre oluşur.')}
</section>
<section><h2>Teşhis matrisi</h2>
<table class="t"><tr><th></th><th>KCL</th><th>KVL</th></tr>
<tr><td>Fiziksel ilke</td><td>yükün korunumu</td><td>enerjinin korunumu</td></tr><tr><td>Uygulama alanı</td><td>düğüm / kapalı yüzey</td><td>kapalı çevre / döngü</td></tr>
<tr><td>Matematik</td><td>Σi = 0</td><td>Σv = 0</td></tr><tr><td>Fiziksel analoji</td><td>boru kavşağında sıvı debisi</td><td>topografik yükseklik değişimi</td></tr>
<tr><td>Kaynak birleştirme</td><td>paralel akım kaynakları</td><td>seri gerilim kaynakları</td></tr></table>
<h3>Devre çözüm motoru: kutsal üçlü</h3>
<p>KCL ve KVL yalnız yapısal iskeleti (dengeyi) verir. Malzemenin fiziksel davranışı için <b>Ohm yasası (v = iR)</b> gerekir: v ve i’yi birbirine bağlar. <b>Bu üçlü birleşince analiz edilemeyecek hiçbir lineer devre yoktur.</b></p>
<div class="tri"><div><b>1 · Yönleri ata (assign)</b><br>bilinmeyen akımlara keyfi yön, gerilimlere keyfi +/− ver. Yanlış seçersen sonuç sadece negatif çıkar.</div><div><b>2 · Yasaları uygula (apply)</b><br>düğümlere KCL, çevrelere KVL. İlk karşılaşılan işaret kuralına sadık kal.</div><div><b>3 · Ohm ile indirge (reduce)</b><br>v terimlerini i·R cinsinden (ya da tersi) yaz, cebirsel olarak çöz.</div></div>
</section>
<section><h2>Örnek 2.5 — tek çevreli sistem</h2>
${svg25}
${ex('Örnek 2.5', 'Devrede v₁ ve v₂ gerilimlerini bulunuz.', ['KVL (saat yönünde): −20 + v₁ − v₂ = 0', 'Ohm: v₁ = 2i', 'Ohm: v₂ = −3i (akım i, 3 Ω’a <b>eksi</b> ucundan girdiği için negatif)', 'Yerine koy: −20 + 2i − (−3i) = 0 → 5i = 20 → i = 4 A'], 'v₁ = 8 V, v₂ = −12 V')}
${hook('Kaynağa (−) ucundan girdin → <b>−20</b>. 2 Ω’a (+) ucundan girdin → <b>+v₁</b>. 3 Ω’a (−) ucundan girdin → <b>−v₂</b>. “<b>İlk gördüğün işareti yaz.</b>”')}
</section>
<section class="bonus"><h2>Bonus · Örnek 2.6 — tek düğümlü sistem (s. 13)</h2>
<p class="mut">Hocanın mailine göre sınır “sayfa 12 dahil, sayfa 13’e kadar”. Bu örnek 13. sayfada; büyük olasılıkla kapsam dışı ama iki dakikada öğrenilir.</p>
${ex('Örnek 2.6', 'v₀ ve i₀’ı KCL ile bulun (3 A kaynak, 0,5i₀ bağımlı akım kaynağı, 4 Ω).', ['Düğüm KCL (giren = çıkan): 0,5i₀ + 3 = i₀', '3 = 0,5i₀ → i₀ = 6 A', 'Ohm: v₀ = 4·i₀'], 'i₀ = 6 A, v₀ = 24 V')}
</section>`,
  kart: [
    ['Kirchhoff yasalarını ne zaman ortaya koydu?', '1847 (Gustav Robert Kirchhoff, 1824–1887).'],
    ['KCL hangi korunuma dayanır?', 'Yükün korunumu.'],
    ['KVL hangi korunuma dayanır?', 'Enerjinin korunumu.'],
    ['KCL tanımı?', 'Bir düğüme giren akımların cebirsel toplamı sıfırdır: Σi = 0 (giren = çıkan).'],
    ['KVL tanımı?', 'Kapalı çevre boyunca gerilimlerin cebirsel toplamı sıfırdır: Σv = 0.'],
    ['KCL’nin akışkan analojisi?', 'Boru kavşağında kütle korunumu (giren su = çıkan su).'],
    ['KVL’nin analojisi?', 'Topografik yükseklik: tepeler (pil) ve vadiler (direnç); tur sonunda net 0.'],
    ['Düğüm yük depolayabilir mi?', 'Hayır.'],
    ['KCL kapalı yüzeye uygulanabilir mi?', 'Evet (süperdüğüm); sınırı delen akımlara bakılır.'],
    ['Paralel akım kaynakları nasıl birleşir?', 'KCL ile: I_eş = I₁ − I₂ + I₃ (yönlere göre).'],
    ['Seri gerilim kaynakları nasıl birleşir?', 'KVL ile: V_eş = V₁ + V₂ − V₃ (kutuplara göre).'],
    ['Hangi bağlantı KCL’yi bozar?', 'Aynı kolda seri iki farklı akım kaynağı.'],
    ['Hangi bağlantı KVL’yi bozar?', 'Paralel iki farklı gerilim kaynağı (kısa devre).'],
    ['KVL’de hangi işaret yazılır?', 'Dönerken elemanın ilk karşılaşılan terminalinin işareti.'],
    ['Toplam gerilim yükselmesi = ?', 'Toplam gerilim düşümü.'],
    ['Kutsal üçlü?', 'KCL + KVL + Ohm yasası.'],
    ['Devre analizi algoritmasının 3 adımı?', 'Yönleri ata, yasaları uygula, Ohm ile indirge.'],
    ['Yanlış yön seçersen?', 'Sonuç sadece negatif çıkar.'],
    ['Örnek 2.5 sonucu?', 'i = 4 A, v₁ = 8 V, v₂ = −12 V'],
    ['Örnek 2.5’te v₂ neden −3i?', 'Akım 3 Ω’a eksi ucundan giriyor.'],
    ['Örnek 2.6 (bonus) sonucu?', 'i₀ = 6 A, v₀ = 24 V']
  ]
});
