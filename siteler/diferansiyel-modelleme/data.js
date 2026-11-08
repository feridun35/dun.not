/* İçerik: 8 kalıp, her kalıpta 3. hafta slayt örnekleri + Feridun'un not örnekleri.
   Soru metni parçaları: düz yazı ya da [ifade, matematik karşılığı, neden]. */
'use strict';
const R = String.raw;

const TARIF = [
  ['Tanımla', R`Soruda geçen her büyüklüğe harf ver ve <b>ne olduğunu yaz</b>: "$y(t)$: $t$ anındaki insan sayısı". Aynı şeyin iki adı varsa (nüfus = insan sayısı) <b>tek harf</b>.`],
  ['Hızı bul', R`"hız", "değişim", "artış", "bozunma hızı" → türev $\frac{dy}{dt}$. Zaman yoksa "$y$'nin $x$'e göre değişimi" → $\frac{dy}{dx}$.`],
  ['Neyle orantılı?', R`"… ile orantılı" → $\propto$. Orantıyı eşitliğe çevirmek için sabit koy: $\propto\ \to\ =k\cdot$. Doğru orantı çarpar, ters orantı böler, iki şeyle orantı ikisini çarpar.`],
  ['İşaret', R`Artıyor, büyüyor, ısınıyor → $+k$. Azalıyor, bozunuyor, soğuyor, direnç → $-k$ ($k>0$). İşareti cümle söyler.`],
  ['Verileri koşula çevir', R`"başlangıçta 100" → $y(0)=100$ · "4 saatte 2 katı" → $y(4)=2\,y(0)$ · "yarısı" → $\frac{y(0)}2$ · en eski bilgi → $t=0$.`],
  ['Şekline bak', R`Kurduğun denklem hangi anahtar? $\frac{dy}{y}=k\,dt$ → ayrılabilir (K1). $y'+p\,y=q$ → integral çarpanı (K4). Pay ve payda aynı dereceli → $y=ux$ (K2).`]
];

const SOZLUK = [
  ['"… hızı", "… değişimi", "artış hızı"', R`$\frac{dy}{dt}$`, 'türev = birim zamandaki değişim'],
  ['"$y$\'nin $x$\'e oranı", "$x$\'e göre değişme"', R`$\frac{dy}{dx}$`, 'zaman yerine x'],
  ['"… ile orantılı"', R`$\propto\ \to\ =k\cdot(\ldots)$`, 'k: orantı sabiti'],
  ['"doğru orantılı"', R`$\times(\ldots)$`, 'çarp'],
  ['"ters orantılı"', R`$\div(\ldots)$`, 'böl'],
  ['"hem A hem B ile orantılı"', R`$k\cdot A\cdot B$`, 'çarpım'],
  ['"… ile birbirine eşit"', R`$k=1$`, 'orantı değil, eşitlik'],
  ['"mevcut", "kalan", "o anki"', R`$y(t)$`, 'şu anki miktar'],
  ['"başlangıçta", "ilk", "orijinal"', R`$y(0)$`, 't = 0'],
  ['"artıyor / ısınıyor"', R`$+k$`, ''],
  ['"azalıyor / bozunuyor / soğuyor"', R`$-k$`, ''],
  ['"üstel biçimde büyüyor"', R`$\frac{dy}{dt}=k\,y$`, 'tanımı bu'],
  ['"$n$ katına çıkıyor"', R`$y(t)=n\cdot y(0)$`, ''],
  ['"yarılanma ömrü"', R`$y(t)=\frac{y(0)}{2}$`, 'süre aranıyor'],
  ['"%10\'una iniyor" / "%10 azalıyor"', R`$0{,}1\,y(0)$ / $0{,}9\,y(0)$`, 'kalan mı, giden mi?'],
  ['"2 yıl önce … 1 yıl önce … şimdi"', R`$t=0,\ t=1,\ t=2$`, 'en eski bilgi t = 0'],
  ['"ortam sıcaklığı"', R`$T_{ortam}$ (sabit)`, 'değişken değil'],
  ['"aşamıyor", "sınırlı"', R`$K-P$`, 'kalan pay'],
  ['"homojen karışım"', R`derişim $=\frac{x}{V}$`, 'her litrede aynı'],
  ['"serbest bırakılıyor"', R`$v(0)=0$`, 'ilk hız sıfır']
];

const KALIP = [
/* ============================== 1 · BÜYÜME ============================== */
{
  id: 'buyume', no: 1, ad: 'Büyüme', kalip: R`$\dfrac{dy}{dt}=+k\,y$`,
  tani: ['"… ile orantılı artıyor"', '"üstel biçimde büyüyor"', '"… sürede 2 katına çıkıyor"'],
  neden: R`<p>Bir ülkede her 100 kişiden yılda 2 bebek doğduğunu düşün. 1000 kişilik kasabada yılda 20, bir milyonluk şehirde 20 000 bebek doğar. Artış hızı, yani yılda kaç kişi eklendiği, insan sayısıyla aynı oranda büyür. İnsan sayısı 2 katına çıkınca hız da 2 katına çıkar. <b>"Orantılı"</b> bu demek: $\frac{dy}{dt}\propto y$.</p>
<p>Orantıyı eşitliğe çevirmek için bir sabit koyarız: $\frac{dy}{dt}=k\,y$. $k$ her bir kişinin katkısıdır; yukarıdaki örnekte $0{,}02$. Nüfus artığı için önündeki işaret artıdır.</p>
<div class="key"><span>NEYE NE DENİR</span>$y$ ya da $y(t)$: $t$ anındaki miktar. Bu tek bir sayı değil, zamanla değişen bir <b>fonksiyon</b>; $y(4)$ = 4. saatteki miktar. $y(0)$: başlangıç miktarı. $\frac{dy}{dt}$: hız, yani birim zamandaki değişim (kişi/yıl, bakteri/saat).</div>`,
  sim: 'ustel', simOpt: { sign: 1, yl: 'y(t)' },
  degis: [
    ['Başlangıcı 2 katına çıkar', { A: v => v.A * 2 }, 'Grafik yukarı kayar ama kesikli çizgiler (her biri bir "2 katı") aynı yerde kalır. Katlanma süresi başlangıca bağlı değil; bu yüzden soruda $y(0)$ verilmese de süreyi bulursun.'],
    ['$k$\'yı 2 katına çıkar', { k: v => v.k * 2 }, 'Her anda hız 2 katına çıkar, katlanma süresi yarıya iner: 50 yıl → 25 yıl.'],
    ['İmleci sona götür', { t: 1 }, 'Miktar büyüdükçe eğim büyür, ama tablodaki $\frac{dy/dt}{y}$ oranı hep aynı kalır: bu $k$. Orantının anlamı bu.']
  ],
  sorular: [
    {
      id: 'o2', ad: 'Ö2 · Nüfus', kaynak: '3. hafta slayt 3 · Örnek 2',
      metin: ['Bir ülkenin ', ['nüfusu', R`$y(t)$`, R`Nüfus = ülkedeki insan sayısı. İkisi aynı büyüklük, o yüzden tek harf: $y$. (Sen nüfusa ayrı değişken vermiştin; aynı şey olduğu için gerek yok, iki harf denklemi iki bilinmeyenli yapar.)`],
        ', ', ['ülkede yaşayan insan sayısı ile orantılı olarak', R`$\frac{dy}{dt}\propto y$`, R`Değişim hızı (türev) şu anki insan sayısıyla orantılı.`],
        ' ', ['artmaktadır', R`$+k$`, R`Artış → türev pozitif → $+k$, $k>0$.`],
        '. Ülkenin nüfusu ', ['50 yılda 2 katına çıkıyorsa', R`$y(50)=2A$`, R`Başlangıç verilmemiş; adı $A$ olsun: $y(0)=A$. 50 yıl sonra iki katı: $2A$. $A$ hesapta sadeleşir.`],
        ', ', ['kaç yıl sonra 4 katına çıkacağını', R`$y(t_1)=4A,\ \ t_1=?$`, 'Aranan bir zaman, adı $t_1$.'],
        ' hesaplayınız? Fiziksel olgunun diferansiyel denklemini bulunuz ve çözümünü yapınız?'],
      adim: [
        ['Tanımla', R`$y(t)$: $t$ yıl sonraki insan sayısı (= nüfus) · $t$: yıl`],
        ['Hız neyle orantılı?', R`artış hızı ∝ insan sayısı: $\frac{dy}{dt}\propto y$`],
        ['İşaret + sabit', R`artıyor → $\boxed{\frac{dy}{dt}=k\,y}$, $k>0$`],
        ['Koşullar', R`$y(0)=A$ · $y(50)=2A$ · $y(t_1)=4A$`],
        ['Şekli', R`$\frac{dy}{y}=k\,dt$ → ayrılabilir (K1)`]
      ],
      sim: { A: 100, k: 0.0139, T: 150, t: 0.33 },
      cozum: R`$\ln y=kt+c\Rightarrow y=Ce^{kt}$ · $y(0)=A\Rightarrow C=A$ · $e^{50k}=2\Rightarrow k=\frac{\ln2}{50}=0{,}01386$ · $e^{kt_1}=4\Rightarrow t_1=\frac{\ln4}{k}=$ <b>100 yıl</b>. Neden 200 değil: 2 katına çıkma süresi hep 50 yıl; $4=2\cdot2$, yani iki tane 50 yıl.`,
      test: [
        ['Soruda hem "nüfus" hem "insan sayısı" geçiyor. Kaç değişken tanımlarsın ($t$ hariç)?', ['Bir: $y$, çünkü ikisi aynı şey', 'İki: nüfus $N$, insan sayısı $y$', 'Hiç, $k$ yeter'], 0, 'Nüfus zaten insan sayısı. İki harf verirsen denklem iki bilinmeyenli olur ve kurulamaz.'],
        ['50 yılda 2 katına çıkan nüfus 3 katına ne zaman çıkar?', [R`$50\cdot\frac{\ln3}{\ln2}\approx79{,}2$ yıl`, '75 yıl', '150 yıl'], 0, R`$e^{kt}=3$, $k=\frac{\ln2}{50}$ → $t=50\frac{\ln3}{\ln2}$. "1,5 katı süre" diye doğrusal düşünürsen 75 bulursun; büyüme doğrusal değil.`]
      ]
    },
    {
      id: 'bakteri', ad: 'Bakteri', kaynak: 'Notun · 3. hafta s10',
      metin: ['Bir bakteri kültüründe, ', ['bakteri artış hızı', R`$\frac{dy}{dt}$`, 'Artış hızı = türev. Birimi bakteri/saat.'],
        ' ', ['mevcut bakteri miktarıyla orantılıdır', R`$\propto y$`, R`"Mevcut" = şu anki = $y(t)$.`],
        '. Bu kültürdeki bakteri miktarı ', ['4 saatte başlangıçtaki bakteri miktarının 2 katına', R`$y(4)=2\,y(0)$`, R`$y(0)=C$ dersen $y(4)=2C$.`],
        ' çıkıyorsa, ', ['12 saat sonunda', R`$y(12)=?$`, ''], ' başlangıç miktarının kaç katına çıkar?'],
      adim: [
        ['Tanımla', R`$y(t)$: $t$ saatteki bakteri miktarı · $y(0)$: başlangıç · $\frac{dy}{dt}$: artış hızı. (Notundaki parantez tam bu; yanındaki soru işareti: $y(t)$ "t anındaki bakteri" demek, $t$ değiştikçe değişen bir sayı.)`],
        ['Orantı', R`$\frac{dy}{dt}\propto y\ \to\ \frac{dy}{dt}=k\,y$`],
        ['Koşullar', R`$y(0)=C$ · $y(4)=2C$ · $y(12)=?\cdot C$`]
      ],
      sim: { A: 100, k: 0.1733, T: 12, t: 1 }, simOpt: { kmax: 0.5, Tmax: 48, tunit: 'saat' },
      cozum: R`$y=Ce^{kt}$, $e^{4k}=2$ → $y(12)=Ce^{12k}=C\left(e^{4k}\right)^3=2^3C=$ <b>8 katı</b>. Notundaki hile: $k$'yı hiç hesaplamadan $e^{12k}=(e^{4k})^3$.`,
      test: [
        ['4 saatte 2 katı. 2 saatte kaç katı?', [R`$\sqrt2\approx1{,}41$`, '1,5', '1'], 0, R`$e^{2k}=\left(e^{4k}\right)^{1/2}=\sqrt2$. Üstel büyümede yarım süre "yarım artış" değildir.`]
      ]
    },
    {
      id: 'tavsan', ad: 'Tavşan', kaynak: 'Notun · 3. hafta s10–11',
      metin: ['Bir çiftlikte bulunan ', ['1000 tavşanın', R`$y(0)=1000$`, 'Başlangıç ($t=0$) değeri.'],
        ' sayısı ', ['üstel bir biçimde büyümektedir', R`$\frac{dy}{dt}=k\,y$`, R`"Orantılı" kelimesi geçmiyor ama "üstel büyüme" zaten "artış hızı miktarla orantılı" demek; çözümü $e^{kt}$ olur.`],
        '. ', ['t = 4 anında çiftlikte 2000 tavşan', R`$y(4)=2000$`, ''], ' varsa, ', ['herhangi bir t anında', R`$y(t)=?$`, 'Sayı değil formül isteniyor.'], ' çiftlikteki tavşan sayısını veren bir formül yazınız.'],
      adim: [
        ['Tanımla', R`$y(t)$: tavşan sayısı · $t$: zaman`],
        ['Cümle', R`"üstel büyüme" → $\frac{dy}{dt}=k\,y$`],
        ['Koşullar', R`$y(0)=1000$ · $y(4)=2000$`]
      ],
      sim: { A: 1000, k: 0.1733, T: 16, t: 0.25 }, simOpt: { Amin: 100, Amax: 5000, Astep: 100, kmax: 0.5, Tmax: 48 },
      cozum: R`$y=1000e^{kt}$, $e^{4k}=2\Rightarrow k=\frac{\ln2}{4}$ → $y(t)=1000\,e^{\frac{\ln2}{4}t}=$ <b>$1000\cdot2^{t/4}$</b>`,
      test: [
        ['Cümlede "orantılı" yok, sadece "üstel biçimde büyüyor" yazıyor. Denklem?', [R`$\frac{dy}{dt}=k\,y$`, R`$y=k\,t$`, R`$\frac{dy}{dt}=k$`], 0, R`$\frac{dy}{dt}=k$ sabit hızdır (her saat aynı sayıda tavşan): bu doğrusal büyüme, üstel değil.`]
      ]
    }
  ]
},
/* ============================== 2 · BOZUNMA ============================== */
{
  id: 'bozunma', no: 2, ad: 'Bozunma', kalip: R`$\dfrac{dy}{dt}=-k\,y$`,
  tani: ['"bozunma hızı kalan miktarla orantılı"', '"yarılanma ömrü"', '"… vücuttan atılıyor", "boşalıyor"'],
  neden: R`<p>Her atomun bir saat içinde bozunma şansı aynıdır; diyelim %20. 100 g varsa 20 g, 50 g varsa 10 g bozunur. Kalan ne kadar azsa bozunan da o kadar azdır. Yani hız kalan miktarla orantılı: $\frac{dy}{dt}\propto y$.</p>
<p>Miktar azaldığı için türev negatiftir: $\frac{dy}{dt}=-k\,y$, $k>0$. Senin notundaki gibi $\frac{dy}{dt}=k\,y$ yazıp "$k<0$" demek de doğru. İkisi aynı denklem; fark, eksiyi denklemin önünde mi $k$'nın içinde mi tuttuğun.</p>
<div class="trap"><span>TUZAK</span>"İlk miktarla orantılı" ya da "her saat 20 g azalıyor" diye okursan hız sabit olur ($\frac{dy}{dt}=-k$) ve madde düz çizgiyle biter. Bozunmada hız her an <b>kalan</b> miktara bağlıdır.</div>`,
  sim: 'ustel', simOpt: { sign: -1, yl: 'y(t) kalan', unit: 'g', vislab: 'her nokta = aynı miktar madde' },
  degis: [
    ['Başlangıcı yarıya indir', { A: v => v.A / 2 }, 'Yarılanma süresi (kesikli çizgiler) değişmez. Yarılanma ömrü maddenin özelliğidir, ne kadar olduğuna bağlı değildir.'],
    ['$k$\'yı 2 katına çıkar', { k: v => v.k * 2 }, 'Bozunma iki kat hızlı, yarılanma süresi yarıya iner.'],
    ['İmleci yarılanmaya getir', { t: v => Math.log(2) / v.k / v.T }, 'Kalan 50 g; eğim de başlangıçtakinin yarısı. Hız kalanla birlikte yarıya iner.']
  ],
  sorular: [
    {
      id: 'o3', ad: 'Ö3 · Radyoaktif', kaynak: '3. hafta slayt 4 · Örnek 3',
      metin: ['Bir radyoaktif madde ', ['bozunmaktadır', R`$-$`, 'Bozunma = azalma → türev negatif.'],
        ' ve radyoaktif maddenin ', ['bozunma hızı', R`$\frac{dy}{dt}$`, ''], ', ', ['kalan madde miktarı', R`$\propto y$`, R`"Kalan" = şu anki miktar, $y(t)$.`],
        '; ', ['ilk madde miktarı ile orantılıdır', R`$y(0)$: yalnız koşul`, R`Slayttaki cümle karışık yazılmış. Hız her an <b>kalan</b> miktarla orantılıdır; ilk miktar (100 g) yalnızca başlangıç koşuludur. İlk miktarla orantılı olsaydı hız sabit olurdu.`],
        '. ', ['100 gram', R`$y(0)=100$`, ''], ' radyoaktif madde ', ['1 saat sonra 80 grama', R`$y(1)=80$`, ''], ' iniyorsa, maddenin ',
        ['yarılanma ömrü', R`$y(t_1)=50$`, R`Yarılanma ömrü = yarısına inme süresi: $100\to50$. Aranan $t_1$.`], ' kaçtır?'],
      adim: [
        ['Tanımla', R`$y(t)$: $t$ saatte kalan madde (g)`],
        ['Orantı', R`bozunma hızı ∝ kalan: $\frac{dy}{dt}\propto y$`],
        ['İşaret', R`azalıyor → $\boxed{\frac{dy}{dt}=-k\,y}$`],
        ['Koşullar', R`$y(0)=100$ · $y(1)=80$ · $y(t_1)=50$`]
      ],
      sim: { A: 100, k: 0.2231, T: 12, t: 0.259 }, simOpt: { kmax: 1, Tmax: 30, tunit: 'saat' },
      cozum: R`$y=100e^{-kt}$ · $e^{-k}=0{,}8\Rightarrow k=\ln1{,}25=0{,}2231$ · $e^{-kt_1}=\frac12\Rightarrow t_1=\frac{\ln2}{k}=$ <b>3,106 saat</b>. Slayttaki 3,108: $k$ 0,223'e yuvarlanınca çıkıyor.`,
      test: [
        ['1 saatte 100 g → 80 g. 2. saatin sonunda kaç g kalır?', ['64 g', '60 g', '40 g'], 0, R`Her saat kalanın %80'i kalır: $100\cdot0{,}8^2=64$. "Her saat 20 g" diye düşünürsen 60 bulursun; oysa hız kalanla birlikte azalır.`]
      ]
    },
    {
      id: 'y1500', ad: 'Yarılanma 1500 yıl', kaynak: 'Notun · 3. hafta s12–13',
      metin: ['Radyoaktif bir maddenin ', ['bozunma hızı', R`$\frac{dy}{dt}$`, ''], ' elementin ', ['mevcut miktarı ile doğru orantılıdır', R`$\propto y$`, ''],
        '. Radyoaktif elementin ', ['orijinal ağırlığının yarısı 1500 yıl içinde dağıldığına', R`$y(0)=A,\ \ y(1500)=\frac A2$`, R`Orijinal = başlangıç, $A$. Yarısı dağıldı → kalan $\frac A2$.`],
        ' göre, a) ', ['4500 yıl sonra', R`$y(4500)=?$`, ''], ' radyoaktif maddenin ağırlığını bulunuz. b) ',
        ['Orijinal ağırlığın %10\'una ulaşması', R`$y(t_1)=0{,}1\,A$`, R`%10'u <b>kalıyor</b>: $0{,}1A$. "%10'u dağılsaydı" kalan $0{,}9A$ olurdu. Cümleyi dikkatli oku.`],
        ' için ne kadar zaman geçmesi gerektiğini bulunuz.'],
      adim: [
        ['Tanımla', R`$y(t)$: $t$ yılda kalan madde · $y(0)=A$`],
        ['Orantı', R`$\frac{dy}{dt}=k\,y$, $k<0$ (notundaki yazım) ya da $-k\,y$, $k>0$`],
        ['Koşullar', R`$y(1500)=\frac A2$ · $y(4500)=?$ · $y(t_1)=\frac{A}{10}$`]
      ],
      sim: { A: 100, k: 0.000462, T: 6000, t: 0.75 }, simOpt: { kmin: 0.0001, kmax: 0.002, kstep: 0.000001, Tmax: 12000, tunit: 'yıl' },
      cozum: R`a) $4500=3\cdot1500$: üç kez yarılanma → $y=\frac A8$ (notundaki $A\,e^{3\ln\frac12}=\frac A8$). b) $e^{kt_1}=\frac1{10}$, $k=\frac{\ln\frac12}{1500}$ → $t_1=1500\cdot\frac{\ln0{,}1}{\ln0{,}5}\approx$ <b>4983 yıl</b>.`,
      test: [
        ['Yarılanma 1500 yıl. 3000 yıl sonra ne kalır?', [R`$\frac A4$`, R`$0$`, R`$\frac A3$`], 0, 'İki kez yarılanma: yarısının yarısı. Hiçbir zaman sıfır olmaz.']
      ]
    }
  ]
},
/* ============================== 3 · NEWTON ============================== */
{
  id: 'newton', no: 3, ad: 'Newton soğuma', kalip: R`$\dfrac{dT}{dt}=-k\,(T-T_{ortam})$`,
  tani: ['sıcak/soğuk bir cisim + "ortam sıcaklığı"', '"soğuma hızı sıcaklık farkıyla orantılı"', 'soruda yasa yazmasa bile'],
  neden: R`<p>Çayla oda arasındaki fark büyükse ısı hızlı akar, fark küçükse yavaş. Çay oda sıcaklığına gelince fark sıfırdır ve sıcaklık artık değişmez. Yani hız sıcaklığın kendisiyle değil <b>farkla</b> orantılı: $\frac{dT}{dt}\propto(T-T_{ortam})$.</p>
<p>Çay soğuyor; $T>T_{ortam}$ iken hız eksi olmalı. O yüzden önüne eksi koyarız: $\frac{dT}{dt}=-k\,(T-T_{ortam})$, $k>0$.</p>
<p>Aynı denklem ısınmayı da anlatır. Soğuk içecek sıcak odada dururken $T<T_{ortam}$, parantez eksi olur; eksi ile eksinin çarpımı artı, içecek ısınır. Notundaki $\frac{dT}{dt}=k\,(T_t-T_s)$ yazımında ise $k$ negatif çıkar; ikisi aynı denklem.</p>
<div class="trap"><span>TUZAK</span>$\frac{dT}{dt}=-k\,T$ yazmak. O zaman çay 0 °C'ye kadar soğurdu; oda 20 °C ise 20'de durmalı.</div>`,
  sim: 'newton', simOpt: {},
  degis: [
    ['Ortamı 40 °C yap', { Ta: 40 }, 'Çay artık 40 °C\'ye yaklaşır ve orada durur. Sınır çizgisini ortam belirler.'],
    ['Çayı 10 °C\'den başlat', { T0: 10 }, 'Fark eksi, hız artı: içecek ısınır. Denklem aynı, yalnız başlangıç değişti.'],
    ['$k$\'yı 2 katına çıkar', { k: v => v.k * 2 }, 'İnce bardak gibi düşün: daha hızlı soğur ama yine ortam sıcaklığında durur.']
  ],
  sorular: [
    {
      id: 'o4', ad: 'Ö4 · Çay', kaynak: '3. hafta slayt 5 · Örnek 4',
      metin: [['Sıcaklığı 80 °C', R`$T(0)=80$`, ''], ' olan bir bardak çay, ', ['20 °C\'lik bir ortamda', R`$T_{ortam}=20$`, 'Ortam sabit kabul edilir; o bir değişken değil.'],
        ' bulunuyor. ', ['10 dakika sonra çayın sıcaklığı 60 °C\'ye', R`$T(10)=60$`, ''], ' indiğine göre ', ['30 dakika sonra', R`$T(30)=?$`, ''],
        ' çayın sıcaklığı kaç °C olur? ', ['Fiziksel olgunun diferansiyel denklemini', R`$\frac{dT}{dt}\propto(T-T_{ortam})$`, R`Soru yasayı söylemiyor. "Sıcak cisim + ortam" gördüğün an Newton soğuma yasasını yazarsın: hız farkla orantılı.`], ' bulunuz.'],
      adim: [
        ['Tanımla', R`$T(t)$: çayın $t$ dakikadaki sıcaklığı · $T_{ortam}=20$ sabit (notunda "derece: T")`],
        ['Orantı', R`hız ∝ fark: $\frac{dT}{dt}\propto(T-20)$`],
        ['İşaret', R`soğuyor → $\boxed{\frac{dT}{dt}=-k\,(T-20)}$`],
        ['Koşullar', R`$T(0)=80$ · $T(10)=60$ · $T(30)=?$`]
      ],
      sim: { T0: 80, Ta: 20, k: 0.0405, T: 60, t: 0.5 },
      cozum: R`$\ln(T-20)=-kt+c\Rightarrow T=20+Ce^{-kt}$ · $C=60$ · $e^{-10k}=\frac23$ ($k=0{,}0405$) → $T(30)=20+60\left(\frac23\right)^3=$ <b>37,8 °C</b>. Fark 60 → 40 → 26,7 → 17,8: her 10 dakikada farkın $\frac23$'ü kalıyor.`,
      test: [
        ['Hangisi YANLIŞ kurulum?', [R`$\frac{dT}{dt}=-k\,T$`, R`$\frac{dT}{dt}=-k\,(T-20)$`, R`$\frac{dT}{dt}=k\,(T-20)$, $k<0$`], 0, R`$-kT$ ortamı unutur, çayı 0 °C'ye götürür. Diğer ikisi aynı denklemin iki yazımı.`],
        ['Fark 60 °C iken hız −2,4 °C/dk. Fark 30 °C olunca hız?', ['−1,2 °C/dk', '−2,4 °C/dk', '−4,8 °C/dk'], 0, 'Hız farkla orantılı: fark yarıya inince hız da yarıya iner.']
      ]
    },
    {
      id: 'c40', ad: '40 °C cisim', kaynak: 'Notun · 3. hafta s12',
      metin: [['Bir cismin sıcaklığı 40 °C', R`$T(0)=40$`, ''], 'dir. Bu cisim ', ['ortam sıcaklığı 20 °C', R`$T_s=20$`, ''], ' olan bir yere konulduğunda ',
        ['10 dakika sonra 35 °C\'ye', R`$T(10)=35$`, R`Süre 10 dakika, üsse $10k$ gelir: $e^{-10k}$.`], ' düşüyor. Buna göre bu cismin sıcaklığının ',
        ['30 °C\'ye düşmesi için gereken süre', R`$T(t_1)=30,\ \ t_1=?$`, ''], ' nedir?'],
      adim: [
        ['Tanımla', R`$T(t)$ · $T_s=20$ · $T_0=40$`],
        ['Denklem', R`$\frac{dT}{dt}=-k\,(T-20)$ → çözümü notundaki gibi $T=T_s+(T_0-T_s)e^{-kt}$`],
        ['Koşullar', R`$T(10)=35$ · $T(t_1)=30$`]
      ],
      sim: { T0: 40, Ta: 20, k: 0.0288, T: 60, t: 0.4 },
      cozum: R`$T=20+20e^{-kt}$ · $e^{-10k}=\frac34$ · $20e^{-kt_1}=10\Rightarrow t_1=10\cdot\frac{\ln\frac12}{\ln\frac34}=$ <b>24,1 dk</b>. <span class="red">Notundaki 28,9 dk</span>: orada üs $e^{12k}$ yazılmış (12 dakika gibi). Soru 10 dakika diyor; 10 ile 24,1 dk çıkar.`,
      test: [
        ['Fark 10 dakikada 20 → 15 oldu. Fark 10\'a (yani 30 °C\'ye) inmesi kaç dakika?', ['≈ 24,1 dk', '20 dk', '40 dk'], 0, R`Her 10 dakikada fark $\times\frac34$. Yarıya inmesi için $\left(\frac34\right)^{t/10}=\frac12$ → $t=24{,}1$. "5 derece/10 dk" diye düz düşünürsen 20 bulursun.`]
      ]
    }
  ]
},
/* ============================== 4 · LOJİSTİK ============================== */
{
  id: 'lojistik', no: 4, ad: 'Lojistik', kalip: R`$\dfrac{dP}{dt}=k\,P\,(K-P)$`,
  tani: ['"… aşamamaktadır", "sınırlı yiyecek"', '"A ve B ile orantılı" (iki şey)', '"söylenti, salgın: bilen ve bilmeyen"'],
  neden: R`<p>Sincaplar ürer: sayıları arttıkça artış da artar ($\propto P$). Ama yiyecek ancak 1200 sincaba yetiyor. 1200'e yaklaştıkça sıkıntı çekenlerin payı biter ve artış durur. İki etki birlikte çalışır: artış hem $P$ ile hem de kalan pay $(1200-P)$ ile orantılı. "İki şeyle orantılı" ikisini çarpmak demek: $\frac{dP}{dt}=k\,P\,(1200-P)$.</p>
<p>$P$ küçükken doğuran az, artış yavaş. $P$ 1200'e yakınken yer az, artış yine yavaş. En hızlı artış ortada, $P=600$'de olur. Alttaki grafikte tepe noktası bu.</p>
<div class="key"><span>NEYE NE DENİR</span>Soruda üç isim var: "sincap nüfusu", "sincap sayısı", "sıkıntı yaşayan sincaplar". İlk ikisi aynı şey, ikisine de $P$ dersin. Sıkıntılılar $B$. Sınırdan $P+B=1200$, yani $B=1200-P$. $B$'yi $P$ ile yazarsın ki denklemde tek bilinmeyen kalsın. Notundaki "P + B ≤ 1200, B = 1200 − P" tam bu.</div>`,
  sim: 'lojistik', simOpt: {},
  degis: [
    ['1000 sincapla başlat', { P0: 1000 }, 'Yine 1200\'e gider ama yavaşlayarak; sınırı hiç aşmaz.'],
    ['600\'den başlat', { P0: 600 }, 'En hızlı noktadan başlar: alttaki grafikte tepede.'],
    ['Sınırı 2400 yap', { K: 2400 }, 'Daha çok yiyecek: daha yükseğe çıkar ve aynı $k$ ile daha hızlı büyür.']
  ],
  sorular: [
    {
      id: 'o6', ad: 'Ö6 · Sincap', kaynak: '3. hafta slayt 8 · Örnek 6',
      metin: ['Bir bölgede sınırlı yiyecek ve çevresel diğer faktörler yüzünden ', ['sincap nüfusu 1200\'ü aşamamaktadır', R`$P+B\le1200$`, R`Toplam en fazla 1200: bu sınır, $K=1200$.`],
        '. ', ['Sincap nüfusu', R`$\frac{dP}{dt}$`, R`Cümlenin devamı "… değişmektedir": nüfusun değişimi = türev.`], ', ', ['sincap sayısı', R`$P$`, ''],
        ' ve ', ['sınırlı yiyecek kaynaklarından dolayı sıkıntı yaşayan sincaplarla', R`$B=1200-P$`, 'Sıkıntılılar, 1200\'e kalan pay.'],
        ' ', ['doğru orantılı olarak', R`$\propto P\cdot B$`, 'İki şeyle birden doğru orantı → ikisini çarp.'],
        ' değişmektedir. Eğer ', ['2 yıl önce 100', R`$P(0)=100$`, R`En eski bilgiyi $t=0$ seç. O zaman 1 yıl önce $t=1$, şimdi $t=2$ olur.`],
        ', ', ['1 yıl önce 400', R`$P(1)=400$`, ''], ' sincap varsa ', ['şimdi', R`$P(2)=?$`, ''], ' kaç sincap yaşamaktadır?'],
      adim: [
        ['Tanımla', R`$P$: sincap sayısı (= nüfus) · $B$: sıkıntılılar · $t$: yıl`],
        ['Sınır', R`$P+B=1200\Rightarrow B=1200-P$`],
        ['Orantı', R`$\frac{dP}{dt}\propto P\cdot B\ \Rightarrow\ \boxed{\frac{dP}{dt}=k\,P\,(1200-P)}$`],
        ['Zaman', R`2 yıl önce $t=0$: $P(0)=100$ · $P(1)=400$ · şimdi $P(2)=?$`],
        ['Şekli', R`$\frac{dP}{P(1200-P)}=k\,dt$ → ayrılabilir + basit kesir (K1 + K3)`]
      ],
      sim: { P0: 100, K: 1200, k: 0.00142, T: 5, t: 0.4 },
      cozum: R`$P=\frac{1200}{1+11e^{-1200kt}}$ · $P(1)=400\Rightarrow e^{-1200k}=\frac2{11}$ ($k=0{,}00142$) → $P(2)=\frac{1200}{1+11\cdot\frac4{121}}=$ <b>880 sincap</b>.`,
      test: [
        ['"Şimdi" hangi $t$?', [R`$t=2$`, R`$t=0$`, R`$t=-2$`], 0, R`2 yıl önceyi $t=0$ seçtik; şimdi ondan 2 yıl sonra.`],
        [R`$P$ çok küçükken ($P=10$) denklem neye benzer?`, [R`$\frac{dP}{dt}\approx1200k\,P$: büyüme kalıbı`, R`$\frac{dP}{dt}\approx0$`, R`$\frac{dP}{dt}\approx-k\,P$`], 0, R`$1200-P\approx1200$ olduğu için lojistik, başta üstel büyüme gibi başlar.`]
      ]
    }
  ]
},
/* ============================== 5 · ORAN CÜMLESİ ============================== */
{
  id: 'oran', no: 5, ad: 'Oran cümlesi', kalip: R`$\dfrac{dy}{dx}=k\cdot\dfrac{\text{doğru}}{\text{ters}}$`,
  tani: ['"… değişmenin x\'e oranı"', '"… ile doğru, … ile ters orantılı"', 'zaman yok; fizik yok, sadece cümle'],
  neden: R`<p>Burada fizik yok; cümle doğrudan matematiğe çevrilir. "$y$'deki değişmenin $x$'e oranı" = $\frac{dy}{dx}$, yani $y$'nin $x$'e göre ne hızla değiştiği. Doğru orantılı olan çarpılır, ters orantılı olan bölünür. Birden fazla şeyle orantılıysa hepsi tek ifadede birleşir: $\frac{dy}{dx}=k\cdot\frac{(\text{doğru olanlar})}{(\text{ters olanlar})}$.</p>
<p>Ö5'te "birbirlerine eşitliğini" dendiği için orantı sabiti yoktur, $k=1$.</p>`,
  sim: 'maliyet', simOpt: {},
  degis: [
    ['Başka bir noktadan geçir: (2; 2)', { x0: 2, y0: 2 }, 'Aynı denklem, farklı koşul: başka bir eğri. Koşul ($x=1$ iken $y=3$) hangi eğrinin seçileceğini belirler.'],
    ['Soru: (1; 3)', { x0: 1, y0: 3 }, R`Sorunun eğrisi: $y^2=x^2+8x$.`],
    ['İmleci $x=4$\'e götür', { xc: 4 }, R`Eğim = $\frac{x^2+y^2}{2xy}$. Sayıları tabloda gör: pay doğru orantılı kısım, payda ters orantılı kısım.`]
  ],
  sorular: [
    {
      id: 'o5', ad: 'Ö5 · Maliyet', kaynak: '3. hafta slayt 6–7 · Örnek 5',
      metin: ['Bir firma, üretmiş olduğu bir malın stoklama ve sipariş ', ['maliyetlerindeki y', R`$y$`, 'Maliyet = $y$, bağımlı değişken.'],
        ' ', ['değişmenin', R`$dy$`, ''], ', ', ['sipariş büyüklüğü olan x', R`$x$`, R`Bağımsız değişken $x$. Zaman yok, türev $x$'e göre alınır.`],
        '\'e ', ['oranının', R`$\frac{dy}{dx}$`, R`"$y$ değişmenin $x$'e oranı" → $\frac{dy}{dx}$.`], '; ',
        ['bunların karelerinin toplamıyla doğru', R`$\times(x^2+y^2)$`, R`"Bunlar" = $x$ ve $y$. Karelerinin toplamı $x^2+y^2$; doğru orantı → çarp.`], ', ',
        ['çarpımının 2 katı ile ters orantılı', R`$\div\,2xy$`, R`Çarpımları $xy$, 2 katı $2xy$; ters orantı → böl.`], ' bir şekilde ',
        ['birbirlerine eşitliğini', R`$k=1$`, 'Orantı değil eşitlik dediği için sabit yok.'], ' tespit etmiştir. ', ['X = 1 iken y = 3', R`$y(1)=3$`, ''],
        ' ise sipariş büyüklüğü ile maliyeti arasındaki bağıntıyı diferansiyel denklem modelleme yaparak bulunuz?'],
      adim: [
        ['Tanımla', R`$y$: maliyet · $x$: sipariş büyüklüğü (bağımsız)`],
        ['Oran', R`"$y$ değişmenin $x$'e oranı" → $\frac{dy}{dx}$`],
        ['Doğru / ters', R`doğru: $(x^2+y^2)$ paya · ters: $2xy$ paydaya`],
        ['Denklem', R`$\boxed{\frac{dy}{dx}=(x^2+y^2)\cdot\frac{1}{2xy}}$ · $y(1)=3$`],
        ['Şekli', R`pay ve payda 2. dereceden → $y=ux$ (K2)`]
      ],
      sim: { x0: 1, y0: 3, xc: 2 },
      cozum: R`$y=ux$: $\frac{2u\,du}{1-u^2}=\frac{dx}{x}$ → $-\ln(1-u^2)=\ln x+\ln c$ → $\frac{1}{1-\frac{y^2}{x^2}}=c\,x$; $(1;3)$: $c=-\frac18$ → <b>$\frac{1}{1-\frac{y^2}{x^2}}=-\frac x8$</b>, sadeleşmiş hâli $y^2=x^2+8x$. (Notundaki soru işaretli adım: $-\ln(1-u^2)=\ln(1-u^2)^{-1}$; iki taraf $\ln$ olunca $\ln$'ler gider.)`,
      test: [
        ['"A ile doğru, B ile ters orantılı" hangisi?', [R`$k\,\frac AB$`, R`$k\,AB$`, R`$k\,\frac BA$`], 0, 'Doğru orantı paya, ters orantı paydaya.'],
        ['"$x$ ile $y$\'nin çarpımının 2 katı"', [R`$2xy$`, R`$(xy)^2$`, R`$2x+2y$`], 0, 'Önce çarp ($xy$), sonra 2 katı.']
      ]
    }
  ]
},
/* ============================== 6 · KARIŞIM ============================== */
{
  id: 'karisim', no: 6, ad: 'Karışım', kalip: R`$\dfrac{dx}{dt}=\text{giren}-\text{çıkan}$`,
  tani: ['tank, depo, havuz + "… lt/sn hızla"', '"litresinde … gram"', '"homojen tutulurken"'],
  neden: R`<p>Tanktaki tuz miktarı $x(t)$ iki yoldan değişir: giren su tuz getirir, çıkan su tuz götürür. Değişim hızı = giren tuz hızı − çıkan tuz hızı (g/sn).</p>
<p>Her biri <b>debi × derişim</b> ile bulunur, çünkü $\frac{\text{L}}{\text{sn}}\cdot\frac{\text{g}}{\text{L}}=\frac{\text{g}}{\text{sn}}$. Girenin derişimi soruda yazar (2 g/L). Çıkanın derişimi tankın o anki derişimidir: tanktaki tuz ÷ tanktaki su $=\frac{x}{V(t)}$. Tank homojen karıştırıldığı için her litresinde aynı tuz vardır. Hacim değişiyorsa $V(t)=V_0+(\text{giren debi}-\text{çıkan debi})\,t$.</p>
<div class="key"><span>NOTUNDAKİ SORU İŞARETLERİ</span>① "$\frac{x(t)}{50+2t}$ = $t$ anında karışımın litresindeki tuz miktarı": evet, bu derişim (toplam tuz / toplam litre). ② Kutulu denklemde $10$ = giren tuz (5 L/sn · 2 g/L = 10 g/sn), $\frac{3x}{50+2t}$ = çıkan tuz (3 L/sn × derişim). ③ "$y'+p(x)y=q(x)$?": $x'+\frac{3}{50+2t}x=10$. Burada bilinmeyen $x$, değişken $t$; $p(t)=\frac3{50+2t}$, $q(t)=10$. Yani K4.</div>`,
  sim: 'tank', simOpt: {},
  degis: [
    ['Giren = çıkan = 5 L/sn', { a: 5, b: 5 }, R`Hacim sabit 50 L kalır, payda $50$ olur. Derişim yine 2 g/L'ye yaklaşır.`],
    ['Saf su girsin', { c: 0 }, R`Giren tuz $0$: $\frac{dx}{dt}=-\frac{3x}{50+2t}$. Sadece çıkış var, tuz azalır (bozunmaya benzer).`],
    ['Tank saf suyla başlasın', { x0: 0, c: 2 }, R`Koşul $x(0)=0$ olur, denklem aynı kalır.`],
    ['Çıkan > giren', { a: 3, b: 5 }, R`Hacim $50-2t$: tank 25 sn'de boşalır.`]
  ],
  sorular: [
    {
      id: 'tank', ad: 'Tuzlu tank', kaynak: 'Notun · 3. hafta s13–14',
      metin: ['Bir su deposunda ', ['başlangıçta 10 gram tuz', R`$x(0)=10$`, ''], ' içeren ', ['50 litrelik', R`$V_0=50$`, ''], ' tuzlu su bulunmaktadır. ',
        ['Litresinde 2 gram tuz', R`$c_{giren}=2$ g/L`, 'Giren suyun derişimi.'], ' içeren başka bir tuzlu su karışımı bu depoya ',
        ['5 lt/sn hızla', R`giren: $5\cdot2=10$ g/sn`, 'Debi × derişim = saniyede giren tuz.'], ' ilave edilmeye başlanıyor. Karıştırıcı ile bu depodaki karışım ',
        ['homojen tutulurken', R`derişim $=\frac{x}{V}$`, 'Homojen: tankın her litresinde aynı tuz var. Çıkan suyun derişimi tankın derişimine eşit.'],
        ' depoya karışım eklenmeye başladığı anda, depodan ', ['3 lt/sn hızla', R`çıkan: $3\cdot\frac{x}{V}$ g/sn`, ''],
        ' bir vana vasıtasıyla dışarı karışım boşaltılmaktadır. ', ['Herhangi bir zamanda karışımdaki tuz miktarını', R`$x(t)=?$`, ''], ' bulunuz.'],
      adim: [
        ['Tanımla', R`$x(t)$: $t$ saniyede tanktaki tuz (g) · $V(t)$: tanktaki su (L)`],
        ['Hacim', R`her saniye $5-3=2$ L artar → $V(t)=50+2t$`],
        ['Giren / çıkan', R`giren: $5\cdot2=10$ g/sn · çıkan: $3\cdot\frac{x}{50+2t}$ g/sn`],
        ['Denklem', R`$\boxed{\frac{dx}{dt}=10-\frac{3x}{50+2t}}$, $x(0)=10$`],
        ['Şekli', R`$x'+\frac{3}{50+2t}\,x=10$ → K4, $\mu=(50+2t)^{3/2}$`]
      ],
      sim: { a: 5, c: 2, b: 3, V0: 50, x0: 10, T: 60, t: 0.25 },
      cozum: R`$x(t)=2(50+2t)-\frac{90\cdot50^{3/2}}{(50+2t)^{3/2}}$. Kontrol: $x(0)=100-90=10$ ✓. Uzun sürede derişim $\frac{x}{V}\to2$ g/L olur; tank, giren su gibi olur.`,
      test: [
        [R`Çıkan tuz hızı neden $3\cdot\frac{x}{50}$ değil?`, [R`Hacim zamanla değişiyor: $V=50+2t$`, '50 yanlış, 53 olmalı', 'Çıkan su saf olduğu için'], 0, 'Giren 5, çıkan 3 → tank her saniye 2 L doluyor. Derişim o anki hacme bölünür.'],
        ['Giren ve çıkan debi ikisi de 4 L/sn olsaydı?', [R`$\frac{dx}{dt}=8-\frac{4x}{50}$`, R`$\frac{dx}{dt}=8-\frac{4x}{50+8t}$`, R`$\frac{dx}{dt}=8-4x$`], 0, R`Hacim sabit (50 L). Giren $4\cdot2=8$ g/sn, çıkan $4\cdot\frac{x}{50}$.`],
        ['Tank başlangıçta saf su olsaydı ne değişir?', [R`Sadece koşul: $x(0)=0$`, R`$V_0=0$ olur`, 'Denklemdeki 10 sıfır olur'], 0, R`Denklem aynı kalır, değişen başlangıç koşulu. Giren tuz (10 g/sn) giren sudan gelir, tankın başlangıcından değil.`]
      ]
    }
  ]
},
/* ============================== 7 · KUVVET ============================== */
{
  id: 'kuvvet', no: 7, ad: 'Kuvvet · düşme', kalip: R`$m\dfrac{dv}{dt}=F_{net}$`,
  tani: ['"m kütleli cisim"', '"serbest düşme", "bırakılıyor"', '"hava direnci hızla orantılı"'],
  neden: R`<p>Newton'un 2. yasası: net kuvvet = kütle × ivme, $F_{net}=m\,a$. İvme hızın türevidir, $a=\frac{dv}{dt}$; hız da konumun türevidir, $v=\frac{dy}{dt}$. Diferansiyel denklem buradan çıkar: cisme etkiyen kuvvetleri yaz ve $m\frac{dv}{dt}$'ye eşitle.</p>
<p>Serbest düşmede tek kuvvet ağırlıktır: $m\frac{dv}{dt}=mg$, yani $\frac{d^2y}{dt^2}=g$. Hava direnci "hızla orantılı" ise $F_{hd}=k\,v$. Direnç harekete ters (yukarı) olduğu için eksiyle girer: $m\frac{dv}{dt}=mg-kv$.</p>
<p>Cisim hızlandıkça direnç büyür. Bir hızda direnç ağırlığa eşit olur, net kuvvet sıfırlanır ve hız artık değişmez. Bu hız uç hızdır: $v=\frac{mg}{k}$.</p>`,
  sim: 'dusme', simOpt: {},
  degis: [
    ['Direnç yok ($k=0$)', { k: 0 }, R`Serbest düşme: hız düz çizgiyle artar, $v=gt$. Sınır yok.`],
    ['Kütleyi 2 katına çıkar', { m: v => v.m * 2 }, R`Uç hız $\frac{mg}{k}$ kütleyle birlikte artar.`],
    ['$k$\'yı 2 katına çıkar', { k: v => Math.max(1, v.k) * 2 }, 'Paraşüt açılmış gibi: uç hız yarıya iner.']
  ],
  sorular: [
    {
      id: 'o1', ad: 'Ö1 · Serbest düşme', kaynak: '3. hafta slayt 2 · Örnek 1',
      metin: [['m kütleli bir cisim', R`$m$`, ''], ' ', ['yüksek bir yerden', R`$y$: konum (aşağı +)`, R`Konumu veren $y$ (notunda "konumunu veren"). Aşağı yönü artı aldık.`],
        ' ', ['serbest düşmeye bırakılırsa', R`$F=mg$ · $y(0)=0,\ y'(0)=0$`, R`"Serbest": yalnız yer çekimi var, direnç yok. "Bırakılır": ilk hız sıfır, $y'(0)=0$. Başladığı nokta $y(0)=0$.`],
        ', cismin diferansiyel denklemini bulunuz ve çözümünü yapınız?'],
      adim: [
        ['Tanımla', R`$y(t)$: konum · $v=\frac{dy}{dt}$ · $a=\frac{d^2y}{dt^2}$`],
        ['Kuvvet', R`$F=m\cdot a$: $mg=m\cdot a\Rightarrow g=a$`],
        ['Denklem', R`$\boxed{\frac{d^2y}{dt^2}=g}$ (2. mertebe)`],
        ['Koşullar', R`2. mertebe → iki sabit → iki koşul: $y(0)=0$, $y'(0)=0$`]
      ],
      sim: { m: 50, k: 0, T: 5, t: 0.5 },
      cozum: R`İki kez integral: $y'=gt+c_1$, $y=\frac12gt^2+c_1t+c_2$. Koşullardan $c_1=c_2=0$ → <b>$y=\frac12g\,t^2$</b>.`,
      test: [
        ['Neden iki koşul gerekiyor?', ['Denklem 2. mertebe: iki integral, iki sabit', R`Biri $g$ için`, 'Gerekmez, biri yeter'], 0, R`Her integral bir sabit getirir; iki sabit için iki bilgi gerekir.`]
      ]
    },
    {
      id: 'hava', ad: 'Hava direnci', kaynak: 'Notun · 3. hafta s14',
      metin: ['Kütlesi m olan bir cisim bırakılıyor; ', ['hava direnci', R`$F_{hd}$`, ''], ' ', ['hızla orantılı', R`$F_{hd}=k\,v$`, ''], ' ve ',
        ['harekete ters', R`$-k\,v$`, 'Ağırlık aşağı (+), direnç yukarı (−).'], '. ', ['Hız', R`$v(t)=?$`, R`Bu kez bilinmeyen hız: denklem 1. mertebe, tek koşul yeter.`],
        ' nasıl değişir? ', ['(durgun bırakıldı)', R`$v(0)=0$`, '']],
      adim: [
        ['Tanımla', R`$v(t)$: hız (aşağı +)`],
        ['Kuvvetler', R`$mg$ aşağı · $k\,v$ yukarı → $F_{net}=mg-kv$`],
        ['Denklem', R`$\boxed{m\frac{dv}{dt}=mg-kv}$ → $\frac{dv}{dt}+\frac km\,v=g$`],
        ['Şekli', R`$v'+p\,v=q$ → K4 · koşul $v(0)=0$ (notunda $v_0$)`]
      ],
      sim: { m: 50, k: 12, T: 30, t: 0.15 },
      cozum: R`$v=\frac{mg}{k}+\left(v_0-\frac{mg}{k}\right)e^{-\frac kmt}$ (notundaki); $v_0=0$ → $v=\frac{mg}{k}\left(1-e^{-\frac kmt}\right)$. Uç hız $\frac{mg}{k}$.`,
      test: [
        ['Direnç hızın karesiyle orantılı olsaydı?', [R`$m\frac{dv}{dt}=mg-kv^2$`, R`$m\frac{dv}{dt}=mg+kv^2$`, R`$m\frac{dv}{dt}=mg-kv$`], 0, R`"Karesiyle orantılı" → $kv^2$; direnç yine ters yönde, eksi.`]
      ]
    }
  ]
},
/* ============================== 8 · DEVRE ============================== */
{
  id: 'devre', no: 8, ad: 'RC devresi', kalip: R`$R\dfrac{dq}{dt}+\dfrac1C\,q=V(t)$`,
  tani: ['direnç + kondansatör + kaynak', '"şarj", "deşarj"', 'Kirchhoff: gerilimler toplamı'],
  neden: R`<p>Kirchhoff: devredeki gerilim düşümlerinin toplamı kaynağa eşittir, $V_R+V_C=V(t)$. Direnç için $V_R=i\,R$, kondansatör için $V_C=\frac qC$; akım da yükün türevidir, $i=\frac{dq}{dt}$. Bunları yerine koyunca $R\frac{dq}{dt}+\frac1C\,q=V(t)$ çıkar.</p>
<p>Kondansatör doldukça $V_C$ büyür, dirence kalan gerilim ve akım azalır. Kondansatör dolunca akım sıfır olur.</p>`,
  sim: 'rc', simOpt: {},
  degis: [
    ['Deşarj: kaynak yok, dolu başla', { V0: 0, q0: 30 }, R`$\frac{dq}{dt}=-\frac{1}{RC}q$: bozunma kalıbı.`],
    ['$R$\'yi 2 katına çıkar', { R: 10, V0: 12, q0: 0 }, R`$RC$ büyür, daha yavaş dolar; son yük aynı ($V_0C$).`],
    ['$C$\'yi 2 katına çıkar', { C: 2, R: 5, V0: 12, q0: 0 }, 'Hem daha yavaş dolar hem daha çok yük alır.']
  ],
  sorular: [
    {
      id: 'rc', ad: 'RC devresi', kaynak: 'Notun · 3. hafta s14',
      metin: [['RC devresi', R`$V_R+V_C=V(t)$`, 'Kirchhoff'], ': ', ['direnç', R`$V_R=i\,R$`, ''], ', ', ['kondansatör', R`$V_C=\frac qC$`, ''], ', ',
        ['akım', R`$i=\frac{dq}{dt}$`, 'Akım = birim zamanda geçen yük.'], ', ', ['kaynak sabit (pil)', R`$V(t)=V_0$`, ''], ', ',
        ['başlangıçta boş kondansatör', R`$q_0=0$ (şarj)`, ''], ' / ', ['kaynak yok', R`$V_0=0$ (deşarj)`, ''], '.'],
      adim: [
        ['Tanımla', R`$q(t)$: kondansatördeki yük · $i=\frac{dq}{dt}$`],
        ['Kirchhoff', R`$V_R+V_C=V_0$`],
        ['Yerine koy', R`$\boxed{R\frac{dq}{dt}+\frac1C\,q=V_0}$`],
        ['Şekli', R`$\frac{dq}{dt}+\frac{1}{RC}\,q=\frac{V_0}{R}$ → K4, $\mu=e^{t/RC}$`]
      ],
      sim: { V0: 12, R: 5, C: 1, q0: 0, t: 0.2 },
      cozum: R`$q=V_0C+(q_0-V_0C)\,e^{-t/RC}$. Boş başlarsa $q=V_0C\left(1-e^{-t/RC}\right)$, $i=\frac{V_0}{R}e^{-t/RC}$. (Notunda üsteki $t$ eksik yazılmış: doğrusu $e^{-t/RC}$.)`,
      test: [
        ['Deşarj (kaynak yok) denklemi?', [R`$R\frac{dq}{dt}+\frac qC=0$`, R`$R\frac{dq}{dt}=\frac qC$`, R`$\frac{dq}{dt}=V_0$`], 0, R`$\frac{dq}{dt}=-\frac{1}{RC}\,q$: bozunma kalıbı.`]
      ]
    }
  ]
}
];
