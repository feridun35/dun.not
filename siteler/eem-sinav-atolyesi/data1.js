'use strict';
/* Konu anlatımları 1–3. Her konu: id, no, kisa, title, src, dk (tahmini süre), body (HTML), kart ([soru, cevap, kanca?]) */
const TOPICS = [];
const sc = id => `<div class="scene" data-sc="${id}"></div>`;
const hook = h => `<div class="hook"><span>KANCA</span>${h}</div>`;
const ex = (t, q, steps, ans) => `<details class="ex"><summary><b>${t}</b> — ${q}</summary><ol>${steps.map(s => `<li>${s}</li>`).join('')}</ol><div class="ans">${ans}</div></details>`;
const trap = h => `<div class="trap"><span>TUZAK</span>${h}</div>`;

TOPICS.push({
  id: 'k1', no: 1, kisa: 'Giriş', title: 'Görünmez gücü anlamak ve kontrol etmek', src: '1. Hafta Ders Notu · 15 slayt', dk: 25,
  body: `
<section><h2>1 · Makine mühendisi neden elektrik bilmeli?</h2>
<p>Modern sistemler (<b>elektrikli araçlar, CNC, robotik</b>) tek bir disiplinden oluşmaz; “kusursuz bir senfoni”dir. Üç ayak:</p>
<div class="tri"><div><b>Makine</b><br>mekanik yapı, şasi, ısıl sistemler, soğutma</div><div><b>Elektrik-Elektronik</b><br>elektrik motoru, batarya, motor sürücüsü, sensörler, güç elektroniği</div><div><b>Bilgisayar/Yazılım</b><br>kontrol algoritmaları, haberleşme</div></div>
<p class="mut">Dersin amacı: devre teorisinde boğulmak değil, <b>mekatronik sistemleri yönetebilecek mühendislik vizyonu</b> kazanmak.</p></section>

<section><h2>2 · Elektrik mi, elektronik mi? Güç ve bilgi</h2>
<table class="t"><tr><th></th><th>ELEKTRİK = kas gücü</th><th>ELEKTRONİK = sinir sistemi ve beyin</th></tr>
<tr><td>Odak</td><td>enerjinin <b>üretilmesi, iletilmesi, mekanik güce dönüştürülmesi</b></td><td>elektriksel <b>sinyallerin işlenmesi, ölçülmesi</b>, sistemlerin <b>kontrol</b> edilmesi</td></tr>
<tr><td>Örnek</td><td>jeneratör, trafo, elektrik motoru, güç şebekesi</td><td>mikrodenetleyici, sensör, transistör, kontrol kartı</td></tr>
<tr><td>Karakter</td><td><b>yüksek gerilim, yüksek akım, enerji transferi</b></td><td><b>düşük gerilim, hassas akım, bilgi transferi</b></td></tr></table>
${hook('<b>Fan örneği:</b> motor pervaneyi çevirir = ELEKTRİK (kas). Mikrodenetleyicili sıcaklık sensörü motorun <i>ne zaman</i> çalışacağına karar verir = ELEKTRONİK (beyin). “Kas taşır, beyin karar verir.”')}
${sc('mekatronik')}
<p><b>Mekatronik bir sistemin anatomisi</b> (döngü): 1) <b>Sensör</b> — durum tespiti, elektriksel sinyal üretir → 2) <b>PLC / mikrodenetleyici</b> — karar, mantık programı çalışır → 3) <b>Motor sürücüsü</b> — güçlendirme, kontrol sinyalini güç sinyaline çevirir → 4) <b>Elektrik motoru</b> — eylem, elektriği mekaniğe çevirir → 5) <b>Mekanik sistem</b> — sonuç: pompa, konveyör veya mil hareket eder.</p>
${hook('Sırayı “<b>S-K-G-E-S</b>”: <b>S</b>ensör <b>K</b>arar verir, <b>G</b>üçlendirilir, <b>E</b>ylem olur, <b>S</b>onuç çıkar. Gerçek sistemler elektrik + elektronik + yazılım + mekaniğin ortak döngüsüdür.')}
</section>

<section><h2>3 · Görünmez hareket: elektronlar ve akım</h2>
<p>Maddenin temelinde <b>proton (+), nötron (0), elektron (−)</b> bulunur. Elektriksel olaylar, <b>kütlesi çok küçük olan elektronların serbest kalarak hareket etmesiyle</b> başlar. İletkenin içindeki negatif yüklü elektronların hareketi elektrik akımını oluşturur.</p>
${sc('tel')}
<div class="key"><b>Tarihsel kabullenme (mühendislik notu):</b> elektronlar <b>negatif (−) uçtan pozitif (+) uca</b> gitse de mühendislikte <b>konvansiyonel akım yönü</b> her zaman <b>pozitif yüklerin hareket yönü</b>, yani <b>+’dan −’ye</b> kabul edilir. Analizler bu kurala göre yapılır.</div>
${hook('Elektron “eksi”dir, eksi işler tersine gider: <b>elektron ←, akım →</b>. Okları hep zıt çiz.')}
</section>

<section><h2>4 · Zihinsel model: su analojisi</h2>
${sc('su')}
<table class="t"><tr><th>Büyüklük</th><th>Su karşılığı</th><th>Anlamı</th></tr>
<tr><td><b>Gerilim V</b> (Volt)</td><td>su deposunun <b>yüksekliği</b></td><td>iki nokta arasındaki elektriksel potansiyel (basınç) farkı; yükleri hareket ettiren ana güç. Örn. 1,5 V pil, 12 V akü, 230 V şebeke</td></tr>
<tr><td><b>Akım I</b> (Amper)</td><td>borudan akan su <b>debisi</b></td><td>birim zamanda hareket eden elektrik yükü miktarı</td></tr>
<tr><td><b>Direnç R</b> (Ohm)</td><td>borudaki <b>daralma / vana</b></td><td>akımın geçişine karşı gösterilen fiziksel zorluk</td></tr>
<tr><td><b>Güç P</b> (Watt)</td><td>dönen <b>su çarkı</b></td><td>birim zamanda aktarılan veya işe dönüştürülen enerji</td></tr></table>
${hook('“Gerilim <b>iter</b> (basınç), akım <b>akar</b> (debi), direnç <b>daraltır</b> (vana), güç <b>çevirir</b> (çark).”')}
</section>

<section><h2>5 · Elektriğin temel yasası: Ohm kanunu</h2>
<div class="formula">V = I × R</div>
<p>Gerilim, akım ve direnç birbirine kopmaz bir bağla bağlıdır. <b>Direncin etkisi:</b> gerilim sabitken direnç artarsa akım azalır (vanayı kısarsanız debi düşer).</p>
<div class="ohm"><div class="tri-ohm"><span class="v">V</span><span class="i">I</span><span class="r">R</span></div><div>Üçgende istediğin harfi kapat: <b>V = I·R</b>, <b>I = V/R</b>, <b>R = V/I</b>.</div></div>
${ex('Sistem hesabı (slayt 6)', '12 V bataryaya 6 Ω ısıtıcı bağlandı.', ['Akım: I = V/R = 12/6 = <b>2 A</b>', 'Güç: P = V·I = 12 × 2 = <b>24 W</b> elektriksel güç harcanır'], 'I = 2 A, P = 24 W')}
</section>

<section><h2>6 · Makineciler için odak: güç ve verim</h2>
${sc('motor')}
<div class="key"><b>Güç (Watt)</b> enerjinin dönüşüm <b>hızıdır</b>. <b>Enerji (Joule / kWh)</b> ise toplam miktardır: <b>E = P × t</b>. Örn. 1000 W (1 kW) cihaz 2 saat çalışırsa <b>2 kWh</b> enerji tüketir.<br><b>Sistem verimi (η):</b> gerçek sistemlerde mekanik çıkış, elektriksel girişten <b>daima küçüktür</b>. Kayıp her zaman <b>ısıdır</b> → soğutma / termodinamik tasarım gerekir.</div>
${ex('Hesap örneği (slayt 7)', '1000 W çeken motorun verimi %90.', ['P_çıkış = 1000 × 0,90 = <b>900 W</b> mekanik güç (şafttan)', 'Kayıp = 1000 − 900 = <b>100 W</b> ısıya dönüşür'], '900 W mekanik, 100 W ısı')}
</section>

<section><h2>7 · Akım türleri: AC ve DC</h2>
<div class="two"><div><h3>DC — doğru akım</h3>Akımın <b>yönü ve genliği zamanla değişmez</b> (grafikte düz çizgi). Taşınabilir sistemlerde, bataryalı cihazlarda, elektronik kartların beslemesinde. Örn. pil, powerbank, güneş paneli.</div>
<div><h3>AC — alternatif akım</h3>Akımın <b>yönü ve değeri zamanla periyodik</b> değişir (sinüs). Evlerde ve sanayide şebeke AC’dir. <b>Türkiye: 230 V – 50 Hz</b>; 50 Hz = gerilim saniyede <b>50 tam periyot</b> değişir.</div></div>
${hook('Türkiye şebekesi “<b>230’a 50</b>”: iki-üç-sıfır volt, elli hertz.')}
</section>

<section><h2>8 · Elektrik devresinin anatomisi</h2>
<p>Elektrik devresi: enerjinin bir kaynaktan çıkıp <b>yük üzerinden geçerek tekrar kaynağa döndüğü kapalı döngü</b>. <b>Açık devre</b> (anahtar açık): akım = 0. <b>Kapalı devre</b>: akım dolaşır, lamba yanar.</p>
<table class="t"><tr><th>Eleman</th><th>Görevi</th></tr>
<tr><td>Gerilim kaynağı</td><td>sistemi besler (pil, akü, güç kaynağı)</td></tr>
<tr><td>İletken</td><td>yolu oluşturur (kablolar, PCB yolları)</td></tr>
<tr><td>Yük (direnç)</td><td>enerjiyi işe dönüştürür (ampul, motor, ısıtıcı)</td></tr>
<tr><td>Kondansatör & bobin</td><td>enerjiyi elektrik/manyetik alanda <b>depolar</b></td></tr>
<tr><td>Yarı iletkenler (diyot, transistör)</td><td>akımın <b>yönünü belirler ve anahtarlama</b> yapar</td></tr></table>
</section>

<section><h2>9 · Alet çantası: multimetre ve ölçüm kuralları</h2>
<p>Mühendislikte sistemin nasıl çalıştığını görmek için ölçüm şarttır.</p>
${sc('olcum')}
<table class="t"><tr><th>Ölçü aleti</th><th>Birim</th><th>Bağlantı</th><th>Neden</th></tr>
<tr><td><b>Voltmetre</b> (gerilim)</td><td>Volt (V)</td><td><b class="blue">PARALEL</b></td><td>iki nokta arasındaki basınç farkını ölçmek için problar bileşenin iki ucuna dokundurulur</td></tr>
<tr><td><b>Ampermetre</b> (akım)</td><td>Amper (A)</td><td><b class="amber">SERİ</b></td><td>suyun akışını saymak için sayaç borunun içine girmeli. Doğrudan kaynağa paralel bağlamak <b>KISA DEVRE</b> yapar, TEHLİKELİ</td></tr>
<tr><td><b>Ohmmetre</b> (direnç)</td><td>Ohm (Ω)</td><td><b>ENERJİ OLMAMALI</b></td><td>sistem tamamen güçten kesilmiş olmalı; multimetre kendi içindeki pille ölçer</td></tr></table>
${hook('<b>V</b>oltmetre = <b>V</b> harfi gibi iki bacağını açar, elemanın iki yanına basar → paralel. <b>A</b>mpermetre = <b>A</b>kışın içine girer → seri. <b>Ohm</b>metre = “<b>O</b>ff” (kapalı devrede).')}
</section>

<section><h2>10 · Osiloskop: sinyallerin zaman makinesi</h2>
${sc('osilo')}
<p><b>Multimetrenin sınırı:</b> anlık ve ortalama durumu söyler (“gerilim 5 V”); hızlı değişimleri yakalayamaz. <b>Osiloskobun gücü:</b> sinyalin zamana bağlı değişiminin (gerilim–zaman grafiği) <b>filmini çeker</b>. Gösterdikleri: <b>genlik, periyot, frekans, dalga şekli</b> (sinüs, kare, üçgen) ve <b>gürültü</b>. Motor kontrol ve sensör okumalarında kritik.</p>
${hook('Multimetre = <b>fotoğraf</b> (tek kare, tek sayı). Osiloskop = <b>film</b>.')}
</section>

<section><h2>11 · Sensörler: makinenin duyu organları</h2>
<p>Fiziksel bir büyüklüğü algılayarak mikrodenetleyicinin anlayabileceği <b>elektriksel sinyale dönüştüren tercümanlar</b>.</p>
<table class="t"><tr><th>Fiziksel büyüklük</th><th>Sensör</th><th>Çıktı</th></tr>
<tr><td>Sıcaklık</td><td>sıcaklık sensörü</td><td><b>voltaj değişimi</b></td></tr>
<tr><td>Basınç / kuvvet</td><td><b>load cell</b> (yük hücresi)</td><td><b>direnç değişimi</b></td></tr>
<tr><td>Konum / hız</td><td><b>enkoder</b> / hız sensörü</td><td><b>kare dalga frekansı</b></td></tr>
<tr><td>Manyetik alan</td><td><b>Hall</b> sensörü</td><td><b>dijital sinyal</b></td></tr></table>
${hook('“<b>S</b>ıcak <b>V</b>olt, <b>Y</b>ük <b>D</b>irenç, <b>E</b>nkoder <b>F</b>rekans, <b>H</b>all <b>D</b>ijital” → <b>SV · YD · EF · HD</b>.')}
</section>

<section><h2>12 · Mühendislikte elektriksel güvenlik (4 kural)</h2>
<div class="grid4"><div><b>Ölümcül potansiyel</b><br>230 V şebeke ciddi çarpılma ve ölüm riski. Enerji kesilmeden fiziksel müdahale yok.</div><div><b>Seri–paralel karışıklığı</b><br>Ampermetreyi doğrudan gerilim kaynağına paralel bağlamak patlamaya ve kısa devreye yol açar.</div><div><b>Enerjili devrede direnç ölçülmez</b><br>Ohmmetre ölçerken sistem tamamen kapalı ve güçten arındırılmış olmalı.</div><div><b>İzolasyon</b><br>Hasarlı kablolar, yalıtımı zedelenmiş problar asla kullanılmaz.</div></div>
</section>

<section><h2>13 · Temel çıkarımlar (slayt 15)</h2>
<ul class="sum"><li><b>Elektrik vs elektronik:</b> elektrik enerjiyi taşır ve dönüştürür (motorlar); elektronik bilgiyi işler ve kontrol eder (PLC, sensörler).</li>
<li><b>Su analojisi:</b> V itici basınç, I hareket eden debi, R daralma.</li>
<li><b>Ohm ve güç:</b> V = I×R (elektriksel ilişki), P = V×I (mekanik işe dönüşecek gücün kaynağı).</li>
<li><b>Sistem verimi:</b> P_giriş &gt; P_çıkış; kayıp her zaman ısıdır.</li>
<li><b>Ölçüm:</b> voltmetre paralel, ampermetre seri.</li></ul>
<div class="key">Slaytın kapanış cümlesi: “<b>Sizler elektrik devreleri tasarlamayabilirsiniz, ancak bu dili konuşamayan bir makine mühendisi modern endüstride sistemleri yönetemez.</b>”</div></section>`,
  kart: [
    ['Elektrik ile elektroniğin farkı?', 'Elektrik: enerjiyi üretir/iletir/mekaniğe dönüştürür (yüksek V ve I, enerji transferi). Elektronik: sinyalleri işler, ölçer, kontrol eder (düşük V, hassas akım, bilgi transferi).', 'kas gücü vs sinir sistemi-beyin'],
    ['Jeneratör, trafo, motor, güç şebekesi hangi gruba girer?', 'Elektrik', 'kas'],
    ['Mikrodenetleyici, sensör, transistör, kontrol kartı hangi gruba girer?', 'Elektronik', 'beyin'],
    ['Konvansiyonel (geleneksel) akım yönü?', 'Pozitif yüklerin hareket yönü: + uçtan − uca. Elektronlar ise − uçtan + uca gider.', 'elektron ←, akım →'],
    ['Su analojisinde gerilim, akım, direnç, güç?', 'V = depo yüksekliği (basınç), I = debi, R = daralma/vana, P = su çarkı.', 'iter–akar–daraltır–çevirir'],
    ['12 V bataryaya 6 Ω bağlanırsa I ve P?', 'I = 2 A, P = 24 W'],
    ['Güç ile enerji farkı?', 'Güç dönüşüm hızıdır (W); enerji toplam miktardır (J, kWh): E = P·t.'],
    ['1 kW cihaz 2 saatte ne kadar enerji tüketir?', '2 kWh'],
    ['1000 W giriş, %90 verim → mekanik çıkış ve kayıp?', '900 W mekanik, 100 W ısı'],
    ['Gerçek sistemlerde kayıp hangi enerji biçimidir?', 'Isı (soğutma/termodinamik tasarım gerekir).'],
    ['Türkiye şebeke standardı?', '230 V – 50 Hz AC (saniyede 50 tam periyot).', '230’a 50'],
    ['DC nerede kullanılır?', 'Taşınabilir/bataryalı sistemler, elektronik kartların beslemesi (pil, powerbank, güneş paneli).'],
    ['Açık devrede akım?', 'Sıfır (I = 0).'],
    ['Kondansatör ve bobinin görevi?', 'Enerjiyi elektrik/manyetik alanda depolamak.'],
    ['Diyot/transistör (yarı iletken) görevi?', 'Akımın yönünü belirler ve anahtarlama yapar.'],
    ['Voltmetre nasıl bağlanır?', 'Paralel (ölçülen elemanın iki ucuna).', 'V iki bacağını açar'],
    ['Ampermetre nasıl bağlanır?', 'Seri. Kaynağa paralel bağlanırsa kısa devre — tehlikeli.', 'akışın içine girer'],
    ['Ohmmetre için kritik kural?', 'Devrede enerji olmamalı; multimetre kendi pilini kullanır.', 'Off'],
    ['Osiloskop neleri gösterir?', 'Genlik, periyot, frekans, dalga şekli (sinüs, kare, üçgen), gürültü.', 'film'],
    ['Multimetrenin sınırı?', 'Anlık/ortalama değer verir, hızlı değişimleri yakalayamaz.', 'fotoğraf'],
    ['Load cell neyi ölçer, çıktısı?', 'Basınç/kuvvet → direnç değişimi.', 'YD'],
    ['Enkoderin çıktısı?', 'Kare dalga frekansı (konum/hız).', 'EF'],
    ['Hall sensörü neyi algılar, çıktısı?', 'Manyetik alan → dijital sinyal.', 'HD'],
    ['Sıcaklık sensörünün çıktısı?', 'Voltaj değişimi.', 'SV'],
    ['Mekatronik döngünün 5 adımı?', 'Sensör (durum tespiti) → PLC/MCU (karar) → motor sürücüsü (güçlendirme) → elektrik motoru (eylem) → mekanik sistem (sonuç).', 'S-K-G-E-S'],
    ['Motor sürücüsünün görevi?', 'Kontrol sinyalini güç sinyaline çevirmek (güçlendirme).'],
    ['Modern mühendislik sistemleri hangi üç disiplinden oluşur?', 'Makine (şasi, ısıl, soğutma), Elektrik-Elektronik (motor, batarya, sürücü, sensör, güç elektroniği), Bilgisayar/Yazılım (kontrol algoritması, haberleşme).'],
    ['Dersin amacı (slayt 2)?', 'Devre teorisinde boğulmak değil, mekatronik sistemleri yönetebilecek mühendislik vizyonu.'],
    ['Maddenin temelindeki üç parçacık ve yükleri?', 'Proton (+), nötron (0), elektron (−).'],
    ['Su analojisinde gerilim örnekleri?', '1,5 V pil, 12 V akü, 230 V şebeke.'],
    ['230 V şebekenin riski (güvenlik slaytı)?', 'Ciddi çarpılma ve ölüm; enerji kesilmeden fiziksel müdahale yapılmaz.'],
    ['Hasarlı kablo ve yalıtımı zedelenmiş prob?', 'Asla kullanılmaz (izolasyon kuralı).']
  ]
});

TOPICS.push({
  id: 'k2', no: 2, kisa: 'Güvenlik', title: 'Güvenlik, temel elektrik ve Ohm kanunu', src: 'Bölüm 2 (S-1 … S-9) · 24 sayfa', dk: 45,
  body: `
<p class="lead">Bu bölüm tamamen <b>sözel ve sayı ezberi</b>: test sorularının en kolay toplanacağı yer. Her sayının bir kancası var.</p>
<section><h2>Güvenliğe genel bakış — neden bilmeniz gerekiyor?</h2>
<p><b>Güvenlik her bireyin sorumluluğudur.</b> Yalnızca kendi güvenliğinle değil, <b>etrafındaki diğer kişilerin güvenliğiyle de</b> ilgilenmelisin. Bu özellikle elektrik alanında çalışanlar için geçerlidir; elektrikli ekipman veya devrelerle çalışırken bazı genel kurallara uyulur. (Bölüm başlığı: “Güvenlik, Temel Elektrik ve Ohm Kanunu”.)</p></section>
<section><h2>Terimler</h2>
<p class="chips"><span>suni solunum</span><span>kardiyopulmoner resüsitasyon (CPR)</span><span>fibrilasyon</span><span>miliamper (mA)</span><span>şakalaşma (horseplay)</span><span>OSHA</span><span>alev geciktirici giysi</span><span>geçici çitler (barikatlar)</span><span>aptal koruması (idiot proofing)</span><span>kilitleme ve etiketleme (lockout/tagout)</span><span>devre kesici</span><span>ölçü aleti (meter)</span><span>gerilimsiz (ölü / “sonsuz”) devre</span><span>enerjili devre</span></p>
<p class="mut">Slayttaki iki sütun: <b>Terimler</b> (suni solunum, CPR, fibrilasyon, mA, şakalaşma, OSHA, alev geciktirici giysi) ve <b>Güvenlik metotları &amp; standartlar</b> (geçici çitler/barikatlar, aptal koruması, kilitleme-etiketleme, devre kesici, ölçü aleti, gerilimsiz ve enerjili devre). OSHA = ABD İş Güvenliği ve Sağlığı İdaresi.</p></section>

<section><h2>S-1 · Genel güvenlik kuralları</h2>
<ol class="rules">
<li><b>Güç kesilebiliyorsa asla enerjili devrede çalışma.</b> Gücün kapalı olduğundan emin olmak için <b>üç adımlı kontrol</b>:
  <ol><li>Ölçü aletini <b>bilinen canlı</b> devrede test et (alet çalışıyor mu?)</li><li>Gücü kapat, çalışacağın devreyi ölç (gerçekten gerilimsiz mi?)</li><li>Aleti tekrar <b>bilinen canlı</b> devrede test et (alet hâlâ çalışıyor mu?)</li></ol>
  Bağlantı kesme noktasına <b>uyarı etiketi</b> tak; mümkünse <b>kilit</b> kullan.</li>
<li><b>Düşün.</b> Tüm güvenlik kuralları arasında <b>belki de en önemlisi</b>. Ekipmanı aptal korumalı yapmak, harekete geçmeden önce düşünmek kadar koruyamaz. Birçok teknisyen “ölü” sanılan devreler yüzünden öldü: devre kesiciye, sigortaya, başkasına güvenme; <b>dokunmadan önce kendin test et</b>. Yüksek voltajda yalıtımlı eldiven ve ölçüm probları.</li>
<li><b>Şakalaşmaktan kaçın</b> — şakaların yeri ve zamanı vardır ama devre ya da hareketli makine üzerinde çalışılırken asla. Birinin yaralanmasına/ölmesine neden olma, başkasının da senin yaralanmana neden olmasına izin verme.</li>
<li><b>Yalnız çalışma</b> — yanında gücü kapatabilecek, <b>suni solunum ve/veya CPR</b> yapabilecek biri olsun. Birden fazla çarpılma solunum güçlüğü ve kalpte fibrilasyon yapabilir.</li>
<li><b>Mümkünse tek elle çalış</b> — en kötü çarpılma akımın <b>bir elden diğerine</b> geçip kalpten geçtiği durumdur. El–ayak şokundan kurtulunabilir; aynı akım el–el yolunda ölümcül olabilirdi.</li>
<li><b>İlk yardım öğren</b> — özellikle <b>50 voltun üzerinde</b> çalışanlar; CPR hayat kurtarır.</li>
<li><b>Alkol ve uyuşturucudan uzak dur</b> — iş sahasında yeri yok. Yalnız kullanana ve çevresine tehlikeli değil, <b>sanayiye yılda milyonlarca dolara</b> mal olur; bağımlılar her yıl otoyollarda <b>binlerce</b> insanı öldürür ve iş sahasında da direksiyondaki kadar tehlikelidir. Birçok kuruluş alkol/uyuşturucu <b>tarama testi</b> uygular; testi pozitif çıkan kişi, politikanın katılığına göre ilk seferde <b>uyarı alabilir veya almayabilir</b>.</li></ol>
${hook('3 adımlı test = <b>CANLI – ÖLÜ – CANLI</b>. Aletin bozuk olup “ölü” göstermesini yakalar.')}
</section>

<section><h2>S-2 · Elektrik akımının vücut üzerindeki etkileri</h2>
<p>İnsanı öldüren <b>voltaj değil akımdır</b> — ama voltajı küçümseme: voltaj akımı iten kuvvettir (borudaki basınç; basınç arttıkça akan suyun hacmi artar). “Belirli voltajda vücuttan ne kadar akım geçer?” sorusunun <b>kolay cevabı yoktur</b>. Belirli voltajda ne kadar akım geçeceğini <b>akım yolunun direnci</b> belirler; kişiden kişiye değişir. Terli sıcak günde direnç <b>düşer</b> (tuzlu su iyi iletken); yenilen-içilen, akım yolunun uzunluğu ve <b>yolun nereden geçtiği</b> (el–el mi, el–ayak mı) direnci etkiler.</p>
${sc('vucut')}
<p class="mut">Şekil S-1 geneldir: bazı insanların elektriğe toleransı daha az, bazılarının daha fazla olabilir.</p>
<table class="t"><tr><th>Akım</th><th>Etki</th></tr>
<tr><td>2–3 mA</td><td>hafif karıncalanma</td></tr><tr><td>0,009–0,010 A (≈10 mA)</td><td>orta derecede his / karıncalanma; ~10 mA’de çok belirgin</td></tr>
<tr><td>0,010–0,020 A</td><td>çok şiddetli ağrı (~20 mA çok acılı)</td></tr><tr><td>0,020–0,030 A</td><td><b>devreyi bırakamama / kilitlenme</b> (hattı tutar)</td></tr>
<tr><td>0,030–0,040 A</td><td><b>kas felci</b></td></tr><tr><td>0,040–0,060 A</td><td>solunum güçlüğü</td></tr><tr><td>0,060–0,100 A</td><td>aşırı solunum güçlüğü</td></tr>
<tr><td><b>0,100–0,200 A</b></td><td><b>ÖLÜM — kalpte fibrilasyon</b> (kalp “titrer”, kan pompalamayı durdurur)</td></tr>
<tr><td>&gt; 0,200 A</td><td>kalp <b>sıkışarak kapanır</b>; akım çekilince genelde normale döner → <b>defibrilatörün çalışma prensibi</b>. Büyük akımlar ağır <b>iç yanıklar</b> yapar (dışı yanık görünmeyebilir).</td></tr></table>
<div class="key">Çalışmak için <b>en tehlikeli kabul edilen voltaj 120 V</b>tur: çoğu insanın vücudundan genellikle <b>100–200 mA</b> (tam fibrilasyon aralığı) akıtır.</div>
${hook('“<b>Yüz – ikiyüz</b> miliamper, kalp <b>titrer</b>.” Merdiveni basamak basamak çık: <b>10</b> his → <b>20</b> ağrı → <b>30</b> bırakamam → <b>40</b> felç → <b>60</b> nefes → <b>100</b> çok zor nefes → <b>200</b> ölüm. “Bırakamama” felçten <b>önce</b> gelir: önce kilitlenirsin, sonra felç olursun.')}
</section>

<section><h2>S-3 · Yerinde (sahada)</h2>
<div class="two"><div><h3>Hendekler (kablo borusu gömmek için)</h3><p>Bazı koşullarda hendek, <b>çökme olursa bir insanı gömecek kadar derin</b> olabilir.</p><ol><li>Gerekli değilse hendeğin yakınında <b>yürüme</b> (toprak gevşer, çökme riski).</li><li>Etrafından dolanmak mümkünse <b>üzerinden atlama</b>.</li><li>Etrafına <b>barikat</b> koy.</li><li>Girip çıkmak için <b>merdiven</b> kullan.</li></ol></div>
<div><h3>Kapalı alanlar (sınırlı giriş-çıkış)</h3><p>Genellikle <b>son derece zararlı veya ölümcül atmosfer</b> içeren çok tehlikeli iş yerleri. Sınırlı açıklık yüzünden <b>havalandırılması çok zor</b>; işçi sıklıkla <b>özel giysi</b> ve <b>harici hava kaynağı</b> kullanır.</p><ol><li>Dışarıda içeridekileri izleyen <b>bir kişi</b> olsun: sürekli <b>sesli veya görsel temas</b>, hava numunesi okumaları, <b>oksijen ve patlayıcı gaz</b> seviyesi.</li><li>Dışarıdaki kişi <b>acil durumda bile alana ASLA girmez</b>, acil durum personelini arar (o da düşerse yardım çağıracak kimse kalmaz).</li><li>Yalnız o atmosfer için <b>onaylı</b> ekipman. Açık fırçalı, kıvılcım çıkaran aletler için <b>yakma izni</b> gerekebilir.</li><li>İçerideki kişi dışarıya uzanan <b>halatlı emniyet kemeri</b> takar (dışarıdaki onu çekebilsin).</li></ol></div></div>
<h3>Kilitleme ve etiketleme (lockout / tagout)</h3>
<p>Birisinin ekipmana <b>yanlışlıkla enerji vermesini önler</b> (anahtar, devre kesici, vana). Ekipmana <b>etiket</b> (DANGER), çoğu zaman <b>asma kilit</b>: işi yapan kilidi takar, <b>anahtarı kendisi tutar</b>. Çoğu kuruluşun kendi iç politikası var: bazıları yalnız <b>etiket</b> ister, bazıları <b>asma kilidi de</b> şart koşar. Birden fazla kişi aynı ekipmanda çalışıyorsa çoklu asma kilit + güvenlik etiketi takılabilen cihaz (Şekil S-5). İhlali çoğu sanayide son derece ciddi: genelde <b>iş sözleşmesinin derhal feshi</b>, <b>ilk seferde uyarı verilmez</b>. Kilitledikten sonra yine <b>canlı-ölü-canlı</b> testi yapılır; bunun için ölçülecek gerilime yetecek kadar <b>yüksek aralıklı voltaj test cihazı veya voltmetre</b> kullanılır. Bu prosedür, arızalı aletin enerjili devreyi gerilimsiz gibi göstermesi olasılığını ortadan kaldırır.</p>
${hook('Kapalı alanda dışarıdaki kişi = <b>telsizci</b>: konuşur, ölçer, arar ama <b>asla içeri girmez</b>. Kilit-etiket: “<b>Anahtar cebimde</b>” — ve ihlale ikinci şans yok.')}
${trap('Alkol/uyuşturucu testinde ilk seferde <b>uyarı alabilir de almayabilir de</b>; kilitleme-etiketleme ihlalinde ise genel kural <b>ilk seferde uyarı YOK</b>.')}
</section>

<section><h2>S-4 · Koruyucu giysiler</h2>
<p>Bakım ve inşaat işçileri, <b>çalışma alanının ortamı ve yapılan işe</b> göre belirlenen koruyucu giysileri giyer.</p>
<table class="t"><tr><th>Ekipman</th><th>Bilinmesi gereken</th></tr>
<tr><td>Baş koruması (baret)</td><td>hemen her iş sahasında; elektrikçi bareti <b>yalıtkan plastik</b>, takılı emniyet gözlüğü olabilir</td></tr>
<tr><td>Göz koruması</td><td>üretim alanına giren <b>herkes</b> (sadece çalışanlar değil); emniyet gözlükleri <b>numaralı olabilir veya olmayabilir</b> ama neredeyse hepsi <b>yan koruma</b> sağlar; bazen tam yüz siperliği</td></tr>
<tr><td>İşitme koruması</td><td>ihtiyaç ortamın <b>ses seviyesine</b> bağlı; kulak tıkacı / kulaklık</td></tr>
<tr><td>Alev geciktirici giysi</td><td><b>ark flaşına</b> maruz kalabilecek herkes; trafo kurulumu, <b>motor kontrol merkezi</b>. Ark flaşı <b>30 ft (≈9 m)</b> uzaktaki insanı öldürebilir</td></tr>
<tr><td>Eldiven</td><td><b>Kauçuk iç kaplamalı deri</b>: enerjili devre, belirli voltaja derecelendirilir, kullanmadan önce delik/yırtık kontrolü. <b>Kevlar</b>: bıçakla kablo soyarken <b>kesiklere</b> karşı</td></tr>
<tr><td>Emniyet kemeri (düşüş durdurma)</td><td>bacak, omuz, göğüs kayışları; arkada <b>D-halkası</b>; <b>lanyard ≈ 6 ft (1,8 m)</b> halat sabit yapıya bağlanır. Takılır: <b>6 ft (1,8 m) üstünde</b>, delik/uçurum yakınında, yüksek iskelede</td></tr></table>
${hook('Kemer: “<b>Boyundan yüksekteysen kemer tak</b>” — 1,8 m ≈ bir insan boyu; lanyard da bir boy (6 ft). Kevlar = <b>K</b>esik, kauçuk = <b>K</b>ilovolt değil ama “akım”.')}
</section>

<section><h2>S-5 · Merdivenler ve iskeleler</h2>
<p><b>İskeleler genel olarak en güvenli yüksek çalışma platformudur.</b> Standart bölümlerden sahada monte edilir; alt bölümlerde ayarlanabilir ayak; iki uç bölüm <b>X-çaprazlarıyla</b> rijit platform olur; istenen yüksekliğe üst üste istiflenir. <b>Tekerlekli iskele:</b> düz zeminde (bina içi), tekerlekler konumda <b>kilitlenir</b>. <b>Asma / askılı iskele:</b> destek yapısından <b>kablolarla</b> asılır; el vinci veya elektrik motoruyla bina kenarında indirip kaldırılır.</p>
${sc('merdiven')}
<div class="key">Merdivenler iki ana türe ayrılır: <b>düz</b> ve <b>merdiven tipi (ayaklı)</b>.<br><b>Düz merdiven:</b> iki paralel ray + basamak; bir ucunda kaymayı önleyen güvenlik ayakları. Elektrik işinde <b>ahşap veya fiberglas</b>; <b>alüminyumdan kaçınılır (iletken)</b>. Yük kapasitesi merdivenin <b>yan tarafında</b> yazar: <b>200 lb (90 kg), 250 lb (113 kg), 300 lb (136 kg)</b> yaygın; kendi ağırlığın + aletler + taşıdıkların.<br>
Açı <b>≈ 76°</b>: taban, yapıdan merdiven yüksekliğinin <b>1/4</b>’ü kadar uzakta. <b>20 ft (6,1 m) → 5 ft (1,5 m)</b>. Yapının üstüne erişim için <b>3 ft (0,9 m)</b> yukarı taşmalı.<br>
<b>Çift taraflı (A tipi, kırmalı) merdiven:</b> kendi kendine durur, üstten menteşeli iki bölüm; önde ray + basamak, arkada ray + çapraz. <b>En üst basamak kullanılmaz</b> (denge bozulur). En üst basamak = merdiven <b>tepesinden önceki son basamak</b> (çoğu kişi tepeyi basamak sanır). Şekil S-16 parçaları: en üst basamak, kullanılabilir en yüksek basamak, merdiven tepesi, <b>gergi makası</b> (iki bölümü açık tutan kilit).</div>
${hook('“<b>Dört yukarı, bir geri</b>” (4:1) → 76°. “<b>3 ayak taşır</b>” → çatıya 3 ft (0,9 m) uzat. Merdiven ağırlıkları <b>90-113-136</b> kg (200-250-300 lb).')}
</section>

<section><h2>S-6 · Yangınlar</h2>
${sc('yangin')}
<p>Yanma için üçü de gerekir: <b>yakıt, ısı, oksijen</b>. Yakıt: ahşap, kâğıt, kumaş, yanıcı tozlar, hatta bazı metaller — yanabilen her şey. <b>Farklı malzemeler farklı miktarda ısı</b> ister; malzemenin sıcaklığı yanma sıcaklığının altındaysa yanmaz; oksijenden mahrum bırakılan yangın söner. Yangınlar dört sınıfa ayrılır:</p>
<table class="t"><tr><th>Sınıf</th><th>Yakıt</th><th>Söndürme</th></tr>
<tr><td><b>A</b></td><td>ahşap, kâğıt (yaygın yanıcılar)</td><td>genelde <b>su</b> (sıcaklığı düşürür). Sadece A sınıfı söndürücü <b>elektrik yangınında asla</b> kullanılmaz</td></tr>
<tr><td><b>B</b></td><td>gres, yanıcı sıvı veya gaz</td><td>genelde <b>CO₂</b>: sıcaklığı büyük ölçüde düşürür ve oksijeni keser. CO₂ elektrik yangınlarında da sık: ekipmanı kuru tozla kaplayıp tahrip etmez</td></tr>
<tr><td><b>C</b></td><td><b>enerjili elektrikli ekipman</b></td><td>genelde <b>kuru toz</b> (boğar). <b>ABC</b> etiketli söndürücü üç sınıfta da. Söndürücüyü derecelendirilmediği yangında kullanma; elektrik yangınında sulu A söndürücü ölümcül olabilir</td></tr>
<tr><td><b>D</b></td><td><b>yanan metal</b></td><td>su bazı metallerde yangını <b>artırır</b>. Toz tabakası kabuk yapar, oksijeni keser; söndürülemezse yayılmayı önlemek için kullanılır</td></tr></table>
${hook('<b>A</b>hşap · <b>B</b>enzin · <b>C</b>ereyan · <b>D</b>emir. (Cereyan = elektrik akımı.)')}
<h3>Elektrik yangınlarının en büyük tek nedeni: zayıf / gevşek bağlantılar</h3>
<p>Zayıf bağlantı <b>direnç</b> oluşturur, direnç <b>ısı</b> yapar. <b>Elektrik saf bir enerji biçimidir</b>; direnç varken elektrik enerjisi termal enerjiye (ısıya) dönüşür. Watt birimi başka biçime dönüştürülen elektrik enerjisini ölçer. Havya genellikle <b>15–30 W</b> — küçük bir direnç bile yüksek akımda çok ısı üretir.</p>
${ex('Gevşek klemens (S-6)', '25 A çeken devrede bağlantı 0,25 Ω direnç geliştirdi. Bağlantıda dağılan ısı?', ['P = I² × R', 'P = 25 × 25 × 0,25', 'P = <b>156,25 W</b> — bir havyanın 5–10 katı; birçok malzemeyi tutuşturur'], '156,25 W')}
<p>Isınan bağlantı konnektör ve klemens metalini <b>oksitler</b> → direnç daha da artar → kısır döngü; iletken sonunda erir, yanarak kopar.</p>
</section>

<section><h2>S-7 · Toprak kaçağı devre kesicileri (GFCI)</h2>
${sc('gfci')}
<p>GFCI insanları <b>elektrik çarpmasına karşı</b> korur. Faz (topraklanmamış, “hot”) ve nötr (topraklanmış) iletkenlerdeki akımı algılar: teoride <b>eşit ama zıt kutuplu</b> olmalı (örnekte 10 A – 10 A). Toprak kaçağı = amaçlanan yol dışında toprağa yol kurulması (arızalı cihaza dokunan topraklanmış insan). Örnek: insandan 0,1 A geçerse faz 10,1 A, nötr 10 A. GFCI <b>≈ 5 mA (0,005 A)</b> fark algılayınca devreyi açar.</p>
<table class="t"><tr><th>GFCI cihazı</th><th>Özellik</th></tr>
<tr><td>GFCI devre kesici (otomatik sigorta tipi)</td><td>tüm devreyi korur; <b>uzun kablo hatları gereksiz atmaya</b> (parazit tetikleme) yol açabilir</td></tr>
<tr><td>GFCI korumalı priz</td><td>bağlantı noktasında koruma; yalnız kendine bağlıları ya da sonraki prizleri de koruyacak şekilde bağlanabilir; pano–ekipman arası <b>kaçak kapasitans kaybı yok</b></td></tr>
<tr><td>GFCI uzatma kablosu</td><td>herhangi bir standart prize takılır; ona bağlı her şey korunur</td></tr></table>
${hook('GFCI = “<b>5 parmak</b>”: eline değdi, <b>5 mA</b>’de atar. <b>G</b>FCI → <b>G</b>övdeni (insanı) korur; AFCI → <b>A</b>teşten (yangından) korur.')}
</section>

<section><h2>S-8 · Ark hatası devre kesicileri (AFCI)</h2>
<p>GFCI çarpılmaya karşı; <b>AFCI yangına karşı</b> korur. Elektrikle ilgili yangınların <b>üçte biri</b> ark hatasından. Ulusal Elektrik Kodu: konutlarda <b>oturma odası, yemek odası, salon, kütüphane, çalışma odası, yatak odası, güneş odası, hobi odası, dolap, koridor</b> veya benzeri alanları besleyen tüm <b>120 V, tek fazlı, 15 ve 20 A</b> devrelerde AFCI şart. Ark hatası <b>6000 °C (10 832 °F)</b> üstüne çıkabilen <b>plazma alevi</b>dir; kesintili boşluk akımın iki yüzey arasında “atlamasına” izin verince oluşur.</p>
${sc('ark')}
<div class="two"><div><h3>Paralel ark</h3>iki iletken birbirine kısa devre (lamba kordonu yalıtımı hasarlı). Akımı <b>yük değil, iletkenlerin direnci</b> sınırlar → nominalin çok üstünde. Sürekli kısa devrede kesicinin <b>manyetik</b> kısmı hemen atar; kesintili kısa devrede <b>termik</b> kısmın ısınması zaman alır. Termik/manyetik kesiciler bu arklara karşı genelde etkilidir; ama lamba kordonu, küçük uzatma kablosu gibi <b>ince iletkenler</b> yangın başlatacak kadar uzun süre direnç ekleyebilir. Daha çok ısı → seri arktan daha tehlikeli olabilir, sıcak metal fırlatır. Ama tepe akımları yüksek olduğu için AFCI <b>çok hızlı tespit</b> eder.</div>
<div><h3>Seri ark</h3><b>gevşek bağlantılar</b> (priz klemensinde gevşek vida, kötü kablo somunu). Arka seri bir yük (direnç) var → akım termik/manyetik atma değerinin altında kalır; tepe akımı normal akımdan <b>büyük değil</b> → tespiti <b>daha zor</b>, daha tehlikeli olabilir. Saç kurutma 12 A, yarı süre temas → ortalama <b>6 A</b>, yine de küçük alanda muazzam ısı.</div></div>
<p><b>Normal arklar:</b> ışık anahtarı açıp kapamak, motor rölesi, açık cihazı prize takmak, güç açıkken ampul değiştirmek, <b>komütatör ve fırçalı</b> motorlar. AFCI bunları ark hatasından ayırt eder: anahtar <b>kısa süreli tek sıçrama</b>, ark hatası çeşitli büyüklük ve sürelerde sıçramalar.</p>
<div class="key">AFCI içinde: <b>akım ve sıcaklık sensörleri</b> (aşırı yük/kısa devrede normal kesici gibi çalışır), <b>mikroişlemci</b>, <b>kalıcı bellek</b> (güç kesilince bilgiyi korur). Mikroişlemci akımı <b>sürekli izler ve dalga formunu bellekteki bilgilerle karşılaştırır</b>; belirli bir dalga formunu değil, akımın <b>büyüklüğünü, süresini ve darbeler arası zamanı</b> izler → <b>elektrikli süpürge, el matkabı</b> (fırça-komütatörlü motor) AFCI’yi attırabilir.<br>
<b>Bağlantı:</b> GFCI ile aynı. <b>Beyaz kuyruk kablo (pigtail) → panodaki nötr baraya.</b> Devrenin <b>nötr (beyaz) teli → gümüş vida</b>, <b>siyah (faz) tel → pirinç vida</b>. Önde kısa devre ve ark testi için <b>test anahtarı</b>; ayrıca mikroişlemci yaklaşık <b>10 dakikada bir kendini test eder</b>.</div>
${hook('Renk eşle: <b>beyaz ↔ gümüş</b> (ikisi de açık), <b>siyah ↔ pirinç</b> (koyu). AFCI “<b>10 dakikada bir</b> aynaya bakar”. Paralel ark = <b>P</b>atlar (yüksek tepe, kolay görülür); seri ark = <b>S</b>insi (normal akım gibi, zor görülür).')}
<h3>Çocuk korumalı (kurcalamaya dayanıklı) prizler</h3>
<p>Priz açıklıklarını örten plastik mekanizma; kapak <b>yalnızca iki uçlu fiş</b> aynı anda takılınca açılır, tek deliğe bastırılan nesnede açılmaz. Kreş, oyun odası gibi alanlarda.</p>
</section>

<section><h2>S-9 · Topraklama</h2>
${sc('topraklama')}
<p>Elektrikteki en önemli güvenlik konularından. İletken nesnelerin yüksek potansiyelde bulunmasını önlemek için toprağa <b>düşük dirençli yol</b> sağlar. Birçok ev aletinde <b>üç telli kablo</b>: üçüncü uç cihaz <b>gövdesine</b> bağlı, gövdeyi toprak potansiyelinde tutar. Faz gövdeye değerse akımı doğrudan toprağa iletir. <b>Fişteki üçüncü uç asla kesilmemeli / devre dışı bırakılmamalı.</b> Topraklama gereksinimleri: <b>NEC 250</b>.</p>
${hook('<b>NEC 250</b>: “<b>Toprak 250</b> gram” — topraklama kuralları.')}
</section>

<section><h2>Özet (S. 24)</h2>
<ul class="sum"><li>Güç kesilebiliyorsa asla enerjili devrede çalışma. En önemli kural: <b>düşünmek</b>.</li><li>Şakalaşma yok, yalnız çalışma yok, mümkünse tek el, ilk yardım ve CPR.</li><li>Kalpten geçen <b>100–200 mA</b> genellikle ölüm.</li><li>İş yerinde alkol ve uyuşturucu yok.</li><li>Hendek: yakınında yürüme, üzerinden atlama, barikat, merdiven.</li><li>Kapalı alanda dışarıdaki kişi sürekli temas halinde.</li><li>Kilitleme-etiketleme: yanlışlıkla enerji verilmesini önler.</li><li>İskeleler genelde en güvenli yüksek platform; düz merdiven tabanı yüksekliğin <b>1/4</b>’ü.</li><li>Yangın sınıfları A ahşap-kâğıt, B gres-sıvı-gaz, C enerjili elektrik, D metal.</li><li>GFCI çarpılmaya karşı, <b>≈5 mA</b>’de açar. AFCI ark hatasını mikroişlemciyle algılayıp yangına karşı korur.</li><li><b>NEC 250</b> topraklama. Zayıf bağlantılar elektrik yangınlarının önde gelen nedeni.</li></ul></section>`,
  kart: [
    ['Güvenlikteki belki de en önemli kural?', 'Düşünmek (harekete geçmeden önce düşün).'],
    ['Gerilimsizliği doğrulamak için 3 adımlı test?', '1) Aleti bilinen canlı devrede test et 2) Gücü kapat, devreyi ölç 3) Aleti tekrar bilinen canlı devrede test et.', 'canlı–ölü–canlı'],
    ['Neden yalnız çalışılmaz?', 'Gücü kapatabilecek, suni solunum/CPR yapabilecek biri olmalı.'],
    ['Neden tek elle çalışılır?', 'En kötü çarpılma el→el yolu: akım doğrudan kalpten geçer.'],
    ['Hangi gerilimin üstünde çalışanlar mutlaka ilk yardım öğrenmeli?', '50 V'],
    ['İnsanı öldüren voltaj mı akım mı?', 'Akım (ama voltaj akımı iten kuvvettir).'],
    ['Terli vücutta direnç?', 'Düşer (tuzlu su iyi iletken) → daha çok akım.'],
    ['Fibrilasyon/ölüm aralığı?', '100–200 mA (0,1–0,2 A).', 'yüz-ikiyüz kalp titrer'],
    ['Devreyi bırakamama (kilitlenme) aralığı?', '20–30 mA'],
    ['Kas felci aralığı?', '30–40 mA'],
    ['Solunum güçlüğü aralığı?', '40–60 mA (60–100 mA aşırı solunum güçlüğü)'],
    ['Çok şiddetli ağrı aralığı?', '10–20 mA'],
    ['Hafif karıncalanma kaç mA?', '2–3 mA (≈10 mA’de çok belirgin)'],
    ['200 mA üstünde ne olur?', 'Kalp sıkışarak kapanır; akım kesilince genelde normale döner (defibrilatör prensibi); iç yanıklar.'],
    ['En tehlikeli kabul edilen çalışma voltajı ve neden?', '120 V; çoğu insandan 100–200 mA geçirir.'],
    ['Hendek için 4 kural?', 'Yakınında yürüme, üzerinden atlama, barikat koy, girip çıkmak için merdiven.'],
    ['Kapalı alanda dışarıdaki kişi acil durumda içeri girer mi?', 'Asla; acil durum personelini arar.'],
    ['Kapalı alanda dışarıdaki kişi neleri izler?', 'Sesli/görsel temas, hava numunesi, oksijen ve patlayıcı gaz seviyesi.'],
    ['Kıvılcım çıkaran (açık fırçalı) aletler için kapalı alanda ne gerekebilir?', 'Yakma izni.'],
    ['Kilitleme-etiketlemenin amacı?', 'Birinin ekipmana yanlışlıkla enerji vermesini önlemek.'],
    ['Kilitleme-etiketleme ihlalinde ilk seferde uyarı var mı?', 'Genel kural: yok; genelde derhal işten çıkarma.'],
    ['Kevlar eldiven ne için?', 'Bıçakla kablo soyarken kesiklere karşı.'],
    ['Kauçuk iç kaplamalı deri eldiven?', 'Enerjili devrelerde; belirli voltaja derecelendirilir, delik/yırtık kontrol edilir.'],
    ['Ark flaşı ne kadar uzaktaki insanı öldürebilir?', '30 ft ≈ 9 m (motor kontrol merkezi).'],
    ['Emniyet kemeri ne zaman takılır?', '6 ft (1,8 m) üstünde, delik/uçurum yakınında, yüksek iskelede.', 'boyundan yüksek'],
    ['Lanyard uzunluğu?', '≈ 6 ft (1,8 m), D-halkasına takılır.'],
    ['En güvenli yüksek çalışma platformu?', 'İskele.'],
    ['İskele bölümlerini rijit yapan?', 'X-çaprazları.'],
    ['Elektrik işinde hangi merdivenden kaçınılır?', 'Alüminyum (iletken). Ahşap veya fiberglas kullanılır.'],
    ['Merdivenin yük kapasitesi nerede yazar? Yaygın değerler?', 'Yan tarafında; 200 lb (90 kg), 250 lb (113 kg), 300 lb (136 kg).'],
    ['Düz merdiven açısı ve taban kuralı?', '≈76°; taban mesafesi yüksekliğin 1/4’ü (20 ft → 5 ft).', 'dört yukarı bir geri'],
    ['Çatıya erişen merdiven ne kadar taşmalı?', '3 ft (0,9 m).'],
    ['A tipi merdivende hangi basamak kullanılmaz?', 'En üst basamak (tepeden önceki son basamak).'],
    ['Yangın üçgeni?', 'Yakıt, ısı, oksijen.'],
    ['A sınıfı yangın ve söndürücüsü?', 'Ahşap, kâğıt; su. Elektrik yangınında asla.', 'Ahşap'],
    ['B sınıfı yangın ve söndürücüsü?', 'Gres, yanıcı sıvı/gaz; CO₂.', 'Benzin'],
    ['C sınıfı yangın ve söndürücüsü?', 'Enerjili elektrikli ekipman; kuru toz (CO₂ de sık).', 'Cereyan'],
    ['D sınıfı yangın?', 'Yanan metal; su artırabilir; toz kabuk.', 'Demir'],
    ['CO₂ söndürücü elektrik yangınında neden tercih edilir?', 'Ekipmanı kuru tozla kaplayıp tahrip etmez.'],
    ['Elektrik yangınlarının en büyük tek nedeni?', 'Zayıf / gevşek bağlantılar (direnç → ısı).'],
    ['25 A, 0,25 Ω bağlantıda ısı?', 'P = I²R = 156,25 W'],
    ['Tipik havya gücü?', '15–30 W'],
    ['GFCI neye karşı korur, kaç mA’de açar?', 'Elektrik çarpmasına; ≈5 mA (0,005 A) fark.', '5 parmak'],
    ['GFCI neyi karşılaştırır?', 'Faz ve nötr iletkenlerindeki akımı (eşit ve zıt olmalı).'],
    ['GFCI devre kesicisinin dezavantajı?', 'Uzun kablo hatlarında gereksiz atma (parazit tetikleme).'],
    ['GFCI prizin avantajı?', 'Bağlantı noktasında koruma; kaçak kapasitans kaybı yok; esnek bağlanabilir.'],
    ['AFCI neye karşı korur?', 'Yangına (ark hatası).'],
    ['Elektrik yangınlarının ne kadarı ark hatasından?', 'Üçte biri.'],
    ['Ark hatası sıcaklığı?', '6000 °C (10 832 °F) üstü plazma alevi.'],
    ['Paralel ark nedeni?', 'İki iletkenin birbiriyle kısa devre yapması (hasarlı kordon yalıtımı).'],
    ['Seri ark nedeni?', 'Gevşek bağlantılar (gevşek vida, kötü kablo somunu).'],
    ['Hangi ark türünü tespit etmek daha zor?', 'Seri ark (tepe akımı normal akımdan büyük değil).', 'Sinsi'],
    ['AFCI hangi büyüklükleri izler?', 'Akımın büyüklüğü, süresi, darbeler arası zaman (belirli dalga formu değil).'],
    ['AFCI’yi gereksiz attırabilecek cihazlar?', 'Fırça-komütatörlü motorlu cihazlar: elektrikli süpürge, el matkabı.'],
    ['AFCI bağlantısı: beyaz pigtail, beyaz tel, siyah tel?', 'Pigtail → nötr bara; beyaz (nötr) → gümüş vida; siyah (faz) → pirinç vida.', 'beyaz-gümüş, siyah-pirinç'],
    ['AFCI kendi kendini ne sıklıkla test eder?', 'Yaklaşık 10 dakikada bir.'],
    ['Konutlarda AFCI zorunlu devreler?', '120 V, tek fazlı, 15 ve 20 A devreler (oturma, yatak odası vb.).'],
    ['Kurcalamaya dayanıklı priz nasıl açılır?', 'Yalnız iki uçlu fiş iki deliğe aynı anda takılınca.'],
    ['Topraklamanın amacı?', 'İletken nesnelerin yüksek potansiyelde kalmasını önleyen düşük dirençli yol.'],
    ['Topraklama gereksinimlerini hangi kod listeler?', 'NEC 250'],
    ['Fişin üçüncü ucu neye bağlıdır?', 'Cihaz gövdesine (toprak); asla kesilmez.'],
    ['Güvenlik kimin sorumluluğudur?', 'Her bireyin; yalnız kendi değil, çevrendekilerin güvenliği de.'],
    ['Alkol/uyuşturucunun sanayiye maliyeti?', 'Yılda milyonlarca dolar; bağımlılar her yıl otoyollarda binlerce kişiyi öldürür.'],
    ['Kapalı alanlar neden çok tehlikelidir?', 'Zararlı/ölümcül atmosfer, havalandırma çok zor; özel giysi ve harici hava kaynağı gerekir.'],
    ['Kapalı alandaki işçi neden halatlı emniyet kemeri takar?', 'Dışarıdaki kişi gerekirse onu güvenli yere çekebilsin.'],
    ['Kilitledikten sonra gerilimsizlik hangi aletle test edilir?', 'Yeterince yüksek aralıklı voltaj test cihazı veya voltmetre (canlı–ölü–canlı).'],
    ['Merdivenlerin iki ana türü?', 'Düz merdiven ve merdiven tipi (ayaklı, A tipi).'],
    ['A tipi merdivende gergi makası ne işe yarar?', 'İki menteşeli bölümü açık tutar (Şekil S-16).'],
    ['Emniyet gözlükleri numaralı mıdır?', 'Olabilir veya olmayabilir; neredeyse hepsi yan koruma sağlar.'],
    ['“Elektrik saf bir enerji biçimidir” — dirençte ne olur?', 'Elektrik enerjisi termal enerjiye (ısıya) dönüşür.'],
    ['Paralel arkta termik-manyetik kesici neden yetmeyebilir?', 'İnce iletkenler (lamba kordonu, küçük uzatma) yangın başlatacak kadar uzun süre direnç ekleyebilir.'],
    ['AFCI’nin zorunlu olduğu bazı konut odaları?', 'Oturma, yemek, yatak, salon, kütüphane, çalışma, güneş, hobi odası, dolap, koridor.']
  ]
});

TOPICS.push({
  id: 'k3', no: 3, kisa: 'Yük·Akım·Gerilim', title: 'Devrenin anatomisi: yük, akım, gerilim (Bölüm 1.1–1.4)', src: 'Konu 3 Ders Notu · 16 slayt', dk: 30,
  body: `
<section><h2>Elektrik devresi nedir?</h2>
<p>Elektrik devresi, <b>elektriksel elemanların birbiriyle bağlanmasıyla oluşan ve enerji aktarımını sağlayan yapı</b>dır. En basiti (Şekil 1.1): <b>pil</b> (enerji kaynağı), <b>lamba</b> (yük) ve bağlantı kabloları — enerjinin bir noktadan diğerine aktarıldığı kapalı yol. Karmaşık radyo alıcısı devresi (Şekil 1.2) de aynı fizik ve matematiğe (yük, akım, gerilim) itaat eder.</p></section>

<section><h2>SI birimleri ve ön ekler</h2>
<p>Tüm hesaplar <b>1960’ta kabul edilen Uluslararası Birimler Sistemi (SI)</b> üzerine kuruludur. Slayttaki temel birimler: uzunluk <b>metre (m)</b>, kütle <b>kilogram (kg)</b>, zaman <b>saniye (s)</b>, elektrik akımı <b>amper (A)</b>, termodinamik sıcaklık <b>kelvin (K)</b>, ışık şiddeti <b>kandela (cd)</b>. <b>Elektrik yükü coulomb (C) türetilmiş</b> birimdir (temel değil!).</p>
${trap('Temel birim <b>amper</b>dir, coulomb değil. C = A·s türetilmiştir.')}
${sc('onek')}
<table class="t"><tr><th>Ön ek</th><th>Sembol</th><th>Çarpan</th><th></th><th>Ön ek</th><th>Sembol</th><th>Çarpan</th></tr>
<tr><td>exa</td><td>E</td><td>10¹⁸</td><td></td><td>desi</td><td>d</td><td>10⁻¹</td></tr>
<tr><td>peta</td><td>P</td><td>10¹⁵</td><td></td><td>santi</td><td>c</td><td>10⁻²</td></tr>
<tr><td>tera</td><td>T</td><td>10¹²</td><td></td><td>mili</td><td>m</td><td>10⁻³</td></tr>
<tr><td>giga</td><td>G</td><td>10⁹</td><td></td><td>mikro</td><td>μ</td><td>10⁻⁶</td></tr>
<tr><td>mega</td><td>M</td><td>10⁶</td><td></td><td>nano</td><td>n</td><td>10⁻⁹</td></tr>
<tr><td>kilo</td><td>k</td><td>10³</td><td></td><td>piko</td><td>p</td><td>10⁻¹²</td></tr>
<tr><td colspan="3"></td><td></td><td>femto</td><td>f</td><td>10⁻¹⁵</td></tr>
<tr><td colspan="3"></td><td></td><td>atto</td><td>a</td><td>10⁻¹⁸</td></tr></table>
<p class="mut">Slayttaki şeritte “mühendislik odak alanı” tera (10¹²) ile piko (10⁻¹²) arasıdır.</p>
<p class="mut">Devre analizinde nadiren tam sayılarla çalışırız: bilgisayar frekansları GHz, kapasitörler pF seviyesinde.</p></section>

<section><h2>Elektrik yükü (q)</h2>
<div class="three"><div><b>Tanım</b><br>Yük, maddenin atomik parçacıklarının elektriksel özelliğidir. Birimi <b>coulomb (C)</b>.</div><div><b>Elektron</b><br><b>e = −1,602 × 10⁻¹⁹ C</b>. 1 C için <b>6,24 × 10¹⁸</b> elektron gerekir (pratikte pC, nC, μC).</div><div><b>Yükün korunumu</b><br>Yük <b>yaratılamaz, yok edilemez, sadece aktarılır</b>. Doğadaki tüm yükler elektron yükünün tam katlarıdır.</div></div>
${hook('“<b>1,6 kuruşluk</b> elektron”: 1,602×10⁻¹⁹. Tersini al: 1/1,602×10⁻¹⁹ = <b>6,24×10¹⁸</b> elektron = 1 C.')}
${ex('Örnek 1.1', '4 600 elektronun yükü?', ['q = n × e = 4600 × (−1,602×10⁻¹⁹ C)'], 'q = −7,369 × 10⁻¹⁶ C')}
${ex('Alıştırma 1.1', '6 milyon protonun yükü?', ['Proton yükü +1,602×10⁻¹⁹ C', 'q = 6 000 000 × (+1,602×10⁻¹⁹)'], 'q = +9,612 × 10⁻¹³ C')}
</section>

<section><h2>Elektrik akımı (i)</h2>
${sc('tel')}
<div class="formula">i = dq / dt</div>
<p>Elektrik akımı <b>yükün zaman içindeki değişim hızı</b>dır. Birimi <b>amper (A)</b>: <b>1 A = 1 C/s</b>. Temelleri <b>André-Marie Ampère</b> tarafından atılmıştır. <b>Benjamin Franklin’in kabulü:</b> gerçekte akımı sağlayan negatif elektronların hareketidir; ama evrensel kabul gereği akım yönü <b>pozitif yüklerin hareket yönü</b> (elektronlara zıt) alınır.</p>
<div class="two"><div><h3>Anlık akım — türev</h3><b>i = dq/dt</b>: q(t) eğrisinin <b>teğetinin eğimi</b>. Fiziksel anlam: belirli bir t anında telin bir kesitinden saniyede geçen yük.</div><div><h3>Toplam yük — integral</h3><b>Q = ∫ i dt</b>: i(t) eğrisinin <b>altında kalan alan</b>. İki zaman arasında o noktadan geçen toplam birikmiş yük.</div></div>
${sc('turev')}
${hook('<b>Yükten akıma: TÜREV al</b> (eğim). <b>Akımdan yüke: İNTEGRAL al</b> (alan). “Eğim = anlık, alan = toplam.”')}
${ex('Örnek 1.2', 'q(t) = 5t·sin(4πt) mC. t = 0,5 s’de akım?', ['Türev (çarpım kuralı): i = dq/dt = 5 sin(4πt) + 20πt cos(4πt) mA', 't = 0,5: i = 5 sin(2π) + 10π cos(2π)', 'sin 2π = 0, cos 2π = 1 → i = 0 + 10π'], 'i = 31,42 mA')}
${ex('Alıştırma 1.2', 'q(t) = (10 − 10e⁻²ᵗ) mC. t = 1 s’de akım?', ['i = dq/dt = 20e⁻²ᵗ mA', 't = 1: i = 20e⁻²'], 'i = 2,707 mA')}
${ex('Örnek 1.3', 'i(t) = (3t² − t) A. t = 1 s ile 2 s arası toplam yük?', ['Q = ∫₁² (3t² − t) dt', 'Q = [t³ − t²/2]₁²', 'Q = (8 − 2) − (1 − 0,5)'], 'Q = 5,5 C')}
${ex('Alıştırma 1.3 (parçalı)', '0 < t ≤ 1: i = 4 A; t > 1: i = 4t² A. t = 0 → 2 toplam yük?', ['Q = ∫₀¹ 4 dt + ∫₁² 4t² dt', 'Q = [4t]₀¹ + [4t³/3]₁²', 'Q = 4 + 4(8 − 1)/3 = 4 + 9,333'], 'Q = 13,333 C')}
<h3>DC ve AC</h3>
<div class="two"><div><b>Doğru akım (DA / DC):</b> zamanla değişmeyen, sabit akım. <b>Büyük “I”</b> ile gösterilir. Piller, bataryalar, elektronik cihazların iç devreleri.</div><div><b>Alternatif akım (AA / AC):</b> zamanla sinüzoidal değişen, yön değiştiren akım. <b>Küçük “i”</b> ile gösterilir. Prizler, klimalar, buzdolapları, jeneratörler.</div></div>
<h3>İşaret kabulleri ve yönler</h3>
<p>Akım her zaman bir akış yönüyle ifade edilir. <b>Referans yön kuralı:</b> bir yönde akan <b>−5 A</b>, zıt yönde akan <b>+5 A</b> ile matematiksel ve fiziksel olarak <b>eşdeğerdir</b>. Çözümde yön keyfi seçilebilir; sonuç negatif çıkarsa gerçek akım seçilen yönün tersinedir.</p>
</section>

<section><h2>Gerilim — potansiyel fark (v)</h2>
<div class="formula">v<sub>ab</sub> = dw / dq &nbsp; (iş / yük)</div>
<p>Gerilim, <b>birim yükü bir eleman üzerinden geçirmek için gereken enerji (iş)</b> miktarıdır. Birimi <b>volt (V)</b>: <b>1 V = 1 J/C</b>. Adını ilk voltaik pili icat eden İtalyan fizikçi <b>Alessandro Volta (1745–1827)</b> almıştır. <b>Not:</b> akım elemanın <b>içinden geçer</b>; gerilim elemanın <b>iki ucu arasında</b> ölçülür.</p>
<h3>Kutupluluk ve referans yönleri</h3>
<div class="polar"><div>a <b class="r">+</b> [ 9 V ] <b class="b">−</b> b</div><div class="eq">=</div><div>a <b class="b">−</b> [ −9 V ] <b class="r">+</b> b</div></div>
<ul><li>+ ve − işaretleri referans yönünü (polariteyi) belirler.</li><li>v<sub>ab</sub>: a noktasının b’ye göre potansiyeli.</li><li><b>v<sub>ab</sub> = −v<sub>ba</sub></b>: “a, b’den 9 V yüksek” = “b, a’dan −9 V yüksek”.</li><li>Gerilim düşümü (voltage drop) = v<sub>ab</sub>; gerilim yükselmesi (rise) = v<sub>ba</sub>.</li></ul>
${hook('Gerilim = <b>yükseklik farkı</b>. a’dan b’ye <b>9 m inmek</b> = b’den a’ya <b>−9 m inmek</b>. İşaret değiştir, harfleri yer değiştir.')}
${ex('Örnek 1.4', 'Kaynak bir ampulden 10 s boyunca 2 A geçiriyor; ışık ve ısı olarak 2,3 kJ yayılıyor. Ampuldeki gerilim düşümü?', ['Toplam yük: Δq = i × Δt = 2 A × 10 s = 20 C', 'Gerilim: v = Δw / Δq = 2300 J / 20 C'], 'v = 115 V')}
${ex('Alıştırma 1.4', 'Bir yükü a’dan b’ye taşımak için 30 J iş gerekiyor.', ['Durum A: q = 6 C → v = 30/6 = 5 V', 'Durum B: q = −3 C → v = 30/(−3) = −10 V'], 'v_ab = 5 V (A) ; −10 V (B)')}
</section>

<section><h2>Büyük resim</h2>
<div class="three"><div><b>YÜK (q) — “temel madde”</b><br>her şeyin yapıtaşı; ölçü: coulomb (miktar)</div><div><b>AKIM (i) — “akış hızı”</b><br>dq/dt; ölçü: amper (hız)</div><div><b>GERİLİM (v) — “itici güç”</b><br>dw/dq; ölçü: volt (baskı/kuvvet)</div></div>
<p class="mut">Bu üç parametre üzerine kurulacak sonraki kavram: güç ve enerji (Bölüm 1.5).</p></section>`,
  kart: [
    ['Elektrik devresinin tanımı?', 'Elektriksel elemanların birbiriyle bağlanmasıyla oluşan, enerji aktarımını sağlayan yapı.'],
    ['SI ne zaman kabul edildi?', '1960'],
    ['Elektrik akımının SI birimi temel mi türetilmiş mi?', 'Amper TEMEL birimdir.'],
    ['Coulomb temel mi türetilmiş mi?', 'Türetilmiş (C = A·s).'],
    ['Işık şiddetinin SI birimi?', 'Kandela (cd).'],
    ['Termodinamik sıcaklığın SI birimi?', 'Kelvin (K).'],
    ['piko, nano, mikro, mili?', '10⁻¹², 10⁻⁹, 10⁻⁶, 10⁻³'],
    ['kilo, mega, giga, tera?', '10³, 10⁶, 10⁹, 10¹²'],
    ['santi ve desi?', '10⁻², 10⁻¹'],
    ['peta ve exa?', '10¹⁵ (P) ve 10¹⁸ (E)'],
    ['femto ve atto?', '10⁻¹⁵ (f) ve 10⁻¹⁸ (a)'],
    ['Elektriksel olaylar neyle başlar?', 'Kütlesi çok küçük elektronların serbest kalarak hareket etmesiyle.'],
    ['Bir elektronun yükü?', '−1,602 × 10⁻¹⁹ C', '1,6 kuruş'],
    ['1 C için kaç elektron?', '6,24 × 10¹⁸'],
    ['Yükün korunumu?', 'Yük yaratılamaz, yok edilemez, sadece aktarılır; tüm yükler elektron yükünün tam katı.'],
    ['4600 elektronun yükü?', '−7,369 × 10⁻¹⁶ C'],
    ['6 milyon protonun yükü?', '+9,612 × 10⁻¹³ C'],
    ['Akımın tanımı ve formülü?', 'Yükün zamana göre değişim hızı: i = dq/dt.'],
    ['1 amper = ?', '1 coulomb / saniye'],
    ['Akımın temellerini kim attı?', 'André-Marie Ampère'],
    ['Akım yönünü pozitif yük hareketi olarak kim kabul etti?', 'Benjamin Franklin'],
    ['Yükten akım bulmak için?', 'Türev: i = dq/dt (eğim).'],
    ['Akımdan toplam yük bulmak için?', 'İntegral: Q = ∫ i dt (eğri altı alan).'],
    ['q = 5t sin(4πt) mC, t = 0,5 s’de i?', '31,42 mA (10π)'],
    ['q = 10 − 10e⁻²ᵗ mC, t = 1 s’de i?', '2,707 mA'],
    ['i = 3t² − t A, 1→2 s arası Q?', '5,5 C'],
    ['DC hangi harfle, AC hangi harfle gösterilir?', 'DC: büyük I; AC: küçük i.'],
    ['Bir yönde −5 A neye eşdeğerdir?', 'Zıt yönde +5 A’ya.'],
    ['Sonuç negatif çıkarsa?', 'Gerçek akım seçilen yönün tersine akıyor.'],
    ['Gerilimin tanımı ve formülü?', 'Birim yükü elemandan geçirmek için gereken iş: v = dw/dq.'],
    ['1 volt = ?', '1 joule / coulomb'],
    ['Volt adını kimden alır?', 'Alessandro Volta (1745–1827), ilk voltaik pil.'],
    ['Akım ve gerilim nerede ölçülür?', 'Akım elemanın içinden geçer; gerilim iki ucu arasında ölçülür.'],
    ['v_ab ile v_ba ilişkisi?', 'v_ab = −v_ba'],
    ['2 A, 10 s, 2,3 kJ → gerilim?', '115 V'],
    ['30 J iş, q = −3 C → v?', '−10 V']
  ]
});
