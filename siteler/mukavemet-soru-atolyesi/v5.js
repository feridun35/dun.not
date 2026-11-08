'use strict';
/* ============ VİZE 5 · Mohr çemberi (ters soru: σmin verilmiş, τxy bilinmiyor) ============ */
VIZE.push({
  id: 'v5', no: 5, kod: 'V5', vize: true, tip: 'mo',
  src: 'Vize kâğıdı · Soru 2 (yılı yazmıyor)',
  img: 'img/v5.png', cevapImg: 'img/v5_cevap.png',
  ad: 'Ters Mohr: σmin verilmiş, τ bulunacak',
  ozet: 'σx ve σy verilmiş ama kayma gerilmesi verilmemiş; onun yerine σmin verilmiş. Önce çemberi σmin\'den kur, τ\'yu Pisagor\'la bul, sonra her şeyi çemberden oku ve iki akma ölçütüyle kontrol et.',
  soru: 'Şekilde gösterilen düzlem gerilme hali için normal ve kayma gerilmeleri şekildeki gibi yönlenmiş olup σ<sub>x</sub> = 98 MPa, σ<sub>y</sub> = 63 MPa ve σ<sub>min</sub> = 35 MPa\'dır. Mohr dairesini kullanarak (a) asal gerilme düzlemlerini gösteriniz ve σ<sub>max</sub> asal gerilmesini bulunuz; (b) maksimum kayma gerilmesini belirleyiniz ve düzlemini gösteriniz; (c) malzemenin akma gerilmesi σ<sub>Y</sub> = 100 MPa olduğuna göre maksimum kayma gerilmesi ve maksimum distorsiyon enerjisi ölçütlerine göre emniyetli olup olmadığını kontrol ediniz.',
  verilen: ['σ<sub>x</sub> = 98 MPa (çekme), σ<sub>y</sub> = 63 MPa (çekme)', 'Kayma şekildeki gibi: sağ yüzde yukarı, üst yüzde sağa (büyüklüğü verilmemiş)', 'σ<sub>min</sub> = 35 MPa', 'Akma gerilmesi σ<sub>Y</sub> = 100 MPa'],
  istenen: '(a) asal düzlemler ve σ<sub>max</sub>; (b) τ<sub>max</sub> ve düzlemi; (c) Tresca ve von Mises ile emniyet kontrolü',
  hoca: `<p><b>Hocanın sonuçları:</b> M = 80,5 MPa; R = 80,5 − 35 = 45,5 MPa; τ<sub>xy</sub> = R·sin 2θ<sub>p</sub> = 41,97 ≈ 42 MPa; cos 2θ<sub>p</sub> = 17,5 / 45,5 → 2θ<sub>p</sub> = 67,38°, θ<sub>p</sub> = 33,69°; σ<sub>max</sub> = σ<sub>min</sub> + 2R = 126 MPa; τ<sub>max</sub> = R = 45,5 MPa; 2θ<sub>s</sub> = 90° − 67,38° = 22,62°, θ<sub>s</sub> = 11,31°; Tresca: τ<sub>em</sub> = 100/2 = 50 MPa, 45,5 &lt; 50 → emniyetli; von Mises: 112,65 &gt; 100 → emniyetsiz.</p>
  <p><b>Karşılaştırma:</b> Bütün sayılar bu sayfadakiyle aynı. Küçük farklar:</p>
  <ul><li><b>τ<sub>xy</sub>:</b> hoca 41,97 bulup 42'ye yuvarlamış, çünkü önce açıyı yuvarlayıp sinüsle geri hesaplamış. Pisagor'la doğrudan τ = √(45,5² − 17,5²) = √1764 = <b>tam 42</b>.</li>
  <li><b>von Mises yazımı:</b> kâğıtta kök içi "126² − 126·35 − 35²" gibi okunuyor. Doğrusu <b>+ 35²</b>; hocanın sonucu (112,65) artıyla hesaplanmış, yani sadece yazım hatası.</li>
  <li><b>Tresca:</b> hoca düzlem içi τ<sub>max</sub> = R = 45,5 MPa'yı kullanmış. Düzlem gerilmede üçüncü asal gerilme σ₃ = 0 alınırsa mutlak τ<sub>max</sub> = (126 − 0)/2 = 63 MPa &gt; 50 olur ve Tresca da "emniyetsiz" der (kitapların yolu bu; normalde Tresca, von Mises'ten daha temkinlidir). Ders notunda hoca "üç eksenli Mohr çıkmaz" dediği için <b>sınavda hocanın yolunu yaz</b>; istersen yanına küçük bir not düş.</li>
  <li><b>Açı yönleri:</b> hoca yön yazmamış; çizimine göre θ<sub>p</sub> saat tersi (x'ten σ<sub>max</sub>'a), θ<sub>s</sub> saat yönünde.</li>
  <li>Soru kâğıdında (b) şıkkı yanlışlıkla "c)" yazılmış.</li></ul>`,
  p0: { sx: 98, sy: 63, smin: 35, sY: 100 },
  solve(p) {
    const M = (p.sx + p.sy) / 2, a = (p.sx - p.sy) / 2, R = M - p.smin;
    const ok = R > Math.abs(a) + 1e-9;
    const t = ok ? Math.sqrt(R * R - a * a) : NaN;
    const smax = M + R, s2 = p.smin, d2p = Math.atan2(t, a) * 180 / Math.PI, tp = d2p / 2;
    const d2s = 90 - d2p, ts = d2s / 2, tmax = R, tem = p.sY / 2;
    const vm = Math.sqrt(smax * smax - smax * s2 + s2 * s2);
    const vm2 = Math.sqrt(p.sx * p.sx - p.sx * p.sy + p.sy * p.sy + 3 * t * t);
    const tabs = Math.max(Math.abs(smax - s2), Math.abs(smax), Math.abs(s2)) / 2;
    return { M, a, R, ok, t, smax, s2, d2p, tp, d2s, ts, tmax, tem, nT: tem / tmax, okT: tmax <= tem, vm, vm2, nV: p.sY / vm, okV: vm <= p.sY, tabs, okT3: tabs <= tem };
  },
  anlam: [
    ['σx = 98, σy = 63 MPa', 'İki nokta çemberin yatay yerini verir: X noktası σ = 98\'de, Y noktası σ = 63\'te. Merkez ikisinin ortası.'],
    ['kayma gerilmeleri şekildeki gibi yönlenmiş', 'Büyüklük yok, sadece <b>yön</b> var. Yön, X noktasının çemberde yukarıda mı aşağıda mı olduğunu söyler (sağ yüzde yukarı → X aşağıda).'],
    ['σmin = 35 MPa', 'Çemberin <b>en sol</b> noktası. Merkezden uzaklığı yarıçap: R = M − σ<sub>min</sub>. τ\'yu bulduran bilgi bu.'],
    ['Mohr dairesini kullanarak', 'Çemberi çiz, değerleri çemberden oku: σ<sub>max</sub> = M + R, τ<sub>max</sub> = R, açılar çemberde 2θ.'],
    ['asal gerilme düzlemlerini gösteriniz', 'Kaymanın sıfır olduğu yüzler. Elemanı θ<sub>p</sub> kadar döndürüp çiz.'],
    ['maksimum kayma … düzlemini gösteriniz', 'Çemberin en alt/üst noktası. Asal düzlemden 45° dönük; o yüzlerde normal gerilme M kadar.'],
    ['maksimum kayma / distorsiyon enerjisi ölçütleri', 'Tresca: τ<sub>max</sub> ≤ σ<sub>Y</sub>/2. von Mises: √(σ₁² − σ₁σ₂ + σ₂²) ≤ σ<sub>Y</sub>. (Kâğıtta (b) şıkkı yanlışlıkla "c)" yazılmış.)']
  ],
  tetik: ['Mohr dairesi', 'asal gerilme / asal düzlem', 'σmin verilmiş, τ verilmemiş', 'maksimum kayma gerilmesi', 'akma gerilmesi + iki ölçüt'],
  tetikNot: 'Normal Mohr sorusunda τ verilir, σmin bulunur. Burada <b>tersi</b>: σmin verilmiş, τ yok. Bunu görünce "R = M − σmin, sonra Pisagor" de. Gerisi aynı tarif.',
  zincir: [
    ['Ne verilmiş, ne eksik?', 'σ<sub>x</sub>, σ<sub>y</sub> var; τ<sub>xy</sub> yok, onun yerine σ<sub>min</sub> var. Ters soru.'],
    ['Çemberde τ\'yu bilmeden ne bulurum?', 'Merkez: M = (σ<sub>x</sub> + σ<sub>y</sub>)/2. τ\'ya bağlı değil.'],
    ['σmin çemberin neresi?', 'En sol nokta. Merkeze uzaklığı R: <b>R = M − σ<sub>min</sub></b>.'],
    ['τ\'yu nasıl bulurum?', 'M, σ<sub>x</sub> ve X noktası dik üçgen: R hipotenüs, (σ<sub>x</sub> − σ<sub>y</sub>)/2 yatay kenar, τ düşey kenar.'],
    ['Sonra?', 'Her şey çemberden: σ<sub>max</sub> = M + R, τ<sub>max</sub> = R, tan 2θ<sub>p</sub> = τ / ((σ<sub>x</sub> − σ<sub>y</sub>)/2).'],
    ['Akma?', 'Tresca: τ<sub>max</sub> ile σ<sub>Y</sub>/2\'yi karşılaştır. von Mises: iki asal gerilmeden eşdeğer gerilme, σ<sub>Y</sub> ile karşılaştır.']
  ],
  cam: { yaw: 0, pitch: 0, dist: 14.2, t: [0.05, -0.1, 0] },
  steps: [
    { t: 'Şekle bak: ne var, ne eksik?', st: { tq: 0 },
      h: (p) => `Gerilme elemanının her yüzünde iki ok var: yüzü çeken <b>normal</b> gerilme (kırmızı) ve yüz boyunca kayan <b>kayma</b> gerilmesi (beyaz). σ<sub>x</sub> = ${fmt(p.sx)} ve σ<sub>y</sub> = ${fmt(p.sy)} MPa verilmiş. Kayma oklarının <b>yönü</b> belli, <b>büyüklüğü yok</b>. Onun yerine σ<sub>min</sub> = ${fmt(p.smin)} MPa verilmiş. Yanında (telefonda altında) Mohr çemberini çizeceğimiz eksenler.`,
      why: 'Normal soruda τ verilir, çember kurulur, σmin çemberden okunur. Burada tersini yapacağız: σmin\'den çemberi kurup τ\'yu çemberden okuyacağız. Çemberi belirlemek için iki şey yeter: merkez ve yarıçap.' },
    { t: 'Kayma oku çemberde yukarı mı, aşağı mı?', st: { tq: 0, rule: 1, vl: 1 },
      h: () => 'Her yüz çemberde bir nokta: x yüzü <b>X(σ<sub>x</sub>, τ)</b>, y yüzü <b>Y(σ<sub>y</sub>, τ)</b>. Kural: bir yüz çiftindeki kayma elemanı <b>saat yönünde</b> döndürmek istiyorsa nokta <b>yukarı</b>, saat tersine ise <b>aşağı</b> çizilir.<br>Sağ yüzde kayma yukarı, sol yüzde aşağı: saat tersi → <b>X aşağıda</b>. Üst yüzde sağa, alt yüzde sola: saat yönü → <b>Y yukarıda</b>.',
      why: 'Hocanın cevap anahtarındaki çizim de böyle: X sağ altta, Y sol üstte. Bazı kitaplar işareti ters kullanır; o zaman açının dönüş yönü ters okunur ama σmax, τmax sayıları aynı çıkar. Sınavda hocanın kuralını kullan. X ve Y her zaman çemberin tam karşı uçlarındadır (bir çapın iki ucu).' },
    { t: 'Merkez: τ\'yu bilmeden bulunur', st: { tq: 0, vl: 0.5, cM: 1 },
      h: () => 'X ve Y bir çapın iki ucu, çapın ortası merkez. X ile Y\'nin yükseklikleri eşit ve zıt, yani merkez tam σ ekseni üzerinde (yüksekliği sıfır). Yatay yeri ise σ<sub>x</sub> ile σ<sub>y</sub>\'nin ortası.',
      f: (p, r) => `M = (σ<sub>x</sub> + σ<sub>y</sub>) / 2 = (${fmt(p.sx)} + ${fmt(p.sy)}) / 2 = <b>${f2(r.M)} MPa</b><br>Merkezden σ<sub>x</sub>\'e yatay uzaklık: (σ<sub>x</sub> − σ<sub>y</sub>) / 2 = <b>${f2(r.a)} MPa</b>`,
      why: 'Merkezi bulmak için τ\'ya hiç ihtiyaç yok. Ters sorunun anahtarı bu: merkezi zaten biliyoruz, eksik olan tek şey yarıçap.' },
    { t: 'Ters adım: σmin\'den yarıçap', st: { tq: 0, cM: 1, rB: 1, circ: 1 },
      h: (p) => `Çemberin en sol noktası B: σ<sub>min</sub> = ${fmt(p.smin)} MPa. Merkezden B\'ye uzaklık yarıçaptır. M ve σ<sub>min</sub> biliniyor, aradaki fark R. Şimdi çemberi çizebiliriz.`,
      f: (p, r) => `σ<sub>min</sub> = M − R → R = ${f2(r.M)} − ${fmt(p.smin)} = <b>${f2(r.R)} MPa</b>`,
      why: 'Düz soruda R = √(((σx−σy)/2)² + τ²) ile bulunur, sonra σmin = M − R. Aynı bağıntıyı ters kullanıyoruz: σmin ve M belli, R çıkar. τ\'yu henüz bilmiyoruz ama R için gerek yok.' },
    { t: 'τxy: dik üçgen (Pisagor)', st: { tq: 1, cM: 1, circ: 1, tri: 1, pts: 1 },
      h: (p, r) => `X noktası çemberin üstünde, yani merkeze uzaklığı R. Merkezden σ<sub>x</sub>\'e yatay kenar ${f2(r.a)}, merkezden X\'e hipotenüs R = ${f2(r.R)}. Düşey kenar X\'in yüksekliği: aradığımız τ<sub>xy</sub>. X aşağıda, Y karşı uçta yukarıda.`,
      f: (p, r) => `R² = ((σ<sub>x</sub> − σ<sub>y</sub>)/2)² + τ<sub>xy</sub>²<br>τ<sub>xy</sub> = √(${f2(r.R)}² − ${f2(r.a)}²) = √${fmt(r.R * r.R - r.a * r.a, 2)} = <b>${f2(r.t)} MPa</b>`,
      why: 'Hipotenüs her zaman en uzun kenar: τ = √(R² − 17,5²), artı değil eksi. Hoca 41,97 ≈ 42 bulmuş, çünkü önce açıyı yuvarlayıp τ = R·sin 2θp ile geri hesaplamış. Tam değer 42 (√1764 = 42).' },
    { t: '(a) σmax ve asal düzlem', st: { tq: 1, circ: 1, pts: 1, live: 1, a2p: 1, thp: 1 },
      h: (p, r) => `Çemberin en sağ noktası A: <b>σ<sub>max</sub></b>. Orada kayma sıfır, yani asal düzlem. Çemberde X\'ten A\'ya <b>saat tersi</b> 2θ<sub>p</sub> dönülür; eleman aynı yöne θ<sub>p</sub> kadar döner. Elemanı izle: dönerken kayma okları küçülüp kayboluyor; çemberde kırmızı çap X\'ten A\'ya dönüyor.`,
      f: (p, r) => `σ<sub>max</sub> = M + R = ${f2(r.M)} + ${f2(r.R)} = <b>${f2(r.smax)} MPa</b> &nbsp;(= σ<sub>min</sub> + 2R)<br>tan 2θ<sub>p</sub> = τ<sub>xy</sub> / ((σ<sub>x</sub> − σ<sub>y</sub>)/2) = ${f2(r.t)} / ${f2(r.a)} → 2θ<sub>p</sub> = ${f2(r.d2p)}° → <b>θ<sub>p</sub> = ${f2(r.tp)}°</b> (saat tersi)<br>σ<sub>min</sub> = ${fmt(p.smin)} MPa, ona dik düzlemde (θ<sub>p</sub> + 90°)`,
      why: 'Kesit θ dönünce çemberde 2θ dönülür. Çünkü elemanda x ve y yüzleri arasında 90° var, çemberde X ve Y arasında 180°. Hoca açıyı cos 2θp = 17,5 / 45,5 ile bulmuş; aynı açı.' },
    { t: '(b) τmax ve düzlemi', st: { tq: 1, circ: 1, pts: 1, live: 1, a2s: 1, ths: 1 },
      h: (p, r) => `Çemberin en alt ve en üst noktaları: <b>τ<sub>max</sub> = R</b>. X\'ten en alt noktaya <b>saat yönünde</b> 2θ<sub>s</sub> dönülür. Eleman ${f2(r.ts)}° saat yönünde döner. Dikkat: bu düzlemde normal gerilme sıfır değil, dört yüzde de M = ${f2(r.M)} MPa.`,
      f: (p, r) => `τ<sub>max</sub> = R = <b>${f2(r.R)} MPa</b><br>2θ<sub>s</sub> = 90° − 2θ<sub>p</sub> = 90° − ${f2(r.d2p)}° = ${f2(r.d2s)}° → <b>θ<sub>s</sub> = ${f2(r.ts)}°</b> (saat yönü)<br>Bu yüzlerde σ = M = ${f2(r.M)} MPa`,
      why: 'τmax düzlemi asal düzlemle her zaman 45° yapar: θp + θs = ' + '33,69° + 11,31° = 45°. Çemberde bu 90° demek: en sağ nokta ile en alt nokta arası.' },
    { t: '(c) Tresca: maksimum kayma ölçütü', st: { tq: 1, circ: 1, tres: 1, ths: 1 },
      h: (p, r) => `Malzeme, kayma gerilmesi bir sınırı aşınca akar. Çekme deneyinde σ<sub>Y</sub> = ${fmt(p.sY)} MPa\'da akıyorsa, o anda en büyük kayma σ<sub>Y</sub>/2 = ${f2(r.tem)} MPa. Çemberde bu sınır τ = ±${f2(r.tem)} çizgileri. Hocanın yolu: çemberin tepesi ${f2(r.tmax)} MPa, ${r.okT ? 'sınırın altında → <b>emniyetli</b>' : 'sınırın üstünde → <b>emniyetsiz</b>'}.`,
      f: (p, r) => `τ<sub>em</sub> = σ<sub>Y</sub> / 2 = ${fmt(p.sY)} / 2 = ${f2(r.tem)} MPa<br>τ<sub>max</sub> = ${f2(r.tmax)} ${r.okT ? '&lt;' : '&gt;'} ${f2(r.tem)} → <b>${r.okT ? 'emniyetli' : 'emniyetsiz'}</b> (E.K. = ${f2(r.tem)} / ${f2(r.tmax)} = ${f2(r.nT)})`,
      why: 'Sınavda hocanın yolunu yaz: düzlem içi çemberin τmax\'ı. Bilgi için: düzlem gerilmede dışarı bakan yüzde üçüncü asal gerilme σ₃ = 0\'dır. 0 ile σmax arasına da bir çember çizilebilir; onun yarıçapı σmax/2 = 63 MPa ve 50\'yi aşar. Kitaplar Tresca\'da bu büyük çemberi kullanır ve "emniyetsiz" der. Ders notunda hoca "üç eksenli Mohr çıkmaz" dediği için sınavda 45,5 ile karşılaştırmak yeterli.' },
    { t: '(c) von Mises: distorsiyon enerjisi', st: { tq: 1, circ: 1, vm: 1, thp: 1 },
      h: (p, r) => `İki asal gerilmeyi tek bir <b>eşdeğer çekme gerilmesine</b> çeviririz ve σ<sub>Y</sub> ile karşılaştırırız. Formül kâğıda ezbere yazılır: σ<sub>e</sub> = √(σ₁² − σ₁·σ₂ + σ₂²). Aşağıdaki sayı doğrusu: σ<sub>e</sub> = ${f2(r.vm)}, sınır σ<sub>Y</sub> = ${fmt(p.sY)}.`,
      f: (p, r) => `σ<sub>e</sub> = √(${f2(r.smax)}² − ${f2(r.smax)}·${f2(r.s2)} + ${f2(r.s2)}²) = √${fmt(r.vm * r.vm, 0)} = <b>${f2(r.vm)} MPa</b><br>${f2(r.vm)} ${r.okV ? '&lt;' : '&gt;'} ${fmt(p.sY)} → <b>${r.okV ? 'emniyetli' : 'emniyetsiz'}</b> (E.K. = ${fmt(p.sY)} / ${f2(r.vm)} = ${f2(r.nV)})<br>Sağlama: √(σ<sub>x</sub>² − σ<sub>x</sub>σ<sub>y</sub> + σ<sub>y</sub>² + 3τ<sub>xy</sub>²) = √(${fmt(p.sx)}² − ${fmt(p.sx)}·${fmt(p.sy)} + ${fmt(p.sy)}² + 3·${f2(r.t)}²) = ${f2(r.vm2)} ✓`,
      why: 'Distorsiyon = şekil bozulması. Metali akıtan, hacmini değil şeklini değiştiren enerjidir. Formülde σ₁·σ₂ terimi eksi: iki gerilme aynı yönde (ikisi de çekme) iken eleman daha az "biçim bozar". Hocanın kâğıdında kök içi "126² − 126·35 − 35²" gibi okunuyor; doğrusu + 35². Sonucu (112,65) doğru, yani yalnız yazım hatası.' },
    { t: 'Sonuç: iki ölçüt farklı dedi', st: { tq: 1, circ: 1, tres: 1, vm: 1, sum: 1, thp: 1 },
      h: (p, r) => `Tresca (hocanın yolu, düzlem içi τ<sub>max</sub>): <b>${r.okT ? 'emniyetli' : 'emniyetsiz'}</b>. von Mises: <b>${r.okV ? 'emniyetli' : 'emniyetsiz'}</b>. Soru "kontrol ediniz" diyor: ikisini ayrı ayrı yaz, her birinin sonucunu açıkça belirt.`,
      why: 'Normalde Tresca, von Mises\'ten daha temkinlidir: von Mises "emniyetsiz" diyorsa Tresca da der. Burada tersi çıkmasının sebebi σ₃ = 0\'ın hesaba katılmaması. Mutlak τmax = 63 MPa ile Tresca da emniyetsiz derdi ve iki ölçüt uyuşurdu. Sınavda hocanın yolunu yaz; istersen yanına "σ₃ = 0 alınırsa τ = 63 MPa" diye küçük bir not düşebilirsin.' }
  ],
  scene(v, p, r) {
    const EX = -4.0, hh = 1.05, k = 0.04, X0 = 0.6, D = Math.PI / 180;
    const mx = s => X0 + s * k, my = tp => tp * k; // tp: çizimdeki τ (aşağı = x yüzü saat tersi)
    const el = v.add(E3.box(2 * hh, 2 * hh, 0.25), { color: '#8fb0c8', pos: [EX, 0, 0] });
    const ref = Math.max(Math.abs(r.smax), Math.abs(r.s2), r.R);
    const thT = { tp: r.tp, ts: -r.ts };
    const def = { thp: 0, ths: 0, tq: 1, rule: 0, vl: 0, cM: 0, rB: 0, circ: 0, tri: 0, pts: 0, live: 0, a2p: 0, a2s: 0, tres: 0, vm: 0, sum: 0 };
    const arc = (cx, cy, R, a0, a1, z = 0, n = 24) => { const P = []; for (let i = 0; i <= n; i++) { const a = (a0 + (a1 - a0) * i / n) * D; P.push([cx + R * Math.cos(a), cy + R * Math.sin(a), z]); } return P; };
    const arcArrow = (O, P, color, alpha, w = 2) => { const n = P.length; O.push({ k: 'line', p: P.slice(0, n - 1), color, w, alpha }); O.push({ k: 'arrow', a: P[n - 2], b: P[n - 1], color, w, hs: 9, alpha }); };
    const dot = (O, x, y, color, alpha, rr = 0.09) => O.push({ k: 'line', p: arc(x, y, rr, 0, 360, 0, 14), color, fill: color, close: 1, w: 1, alpha });
    return {
      def: Object.assign({}, def),
      apply(S, time, v) {
        const O = v.ov, th = S.thp * r.tp - S.ths * r.ts, c = Math.cos(th * D), s = Math.sin(th * D);
        el.rot = [0, 0, th * D];
        // dar ekran (telefon): eleman üstte, çember altta; geniş ekranda yan yana
        const narrow = v.W / v.H < 1.1, eOff = narrow ? [0.05 - EX, 2.9] : [0, 0], mOff = narrow ? [-3.6, -2.3] : [0, 0];
        el.pos = [EX + eOff[0], eOff[1], 0];
        const mv = (from, d) => { if (!d[0] && !d[1]) return; const sh = q => [q[0] + d[0], q[1] + d[1], q[2] || 0]; for (let j = from; j < O.length; j++) { const o = O[j]; ['a', 'b', 'lp', 'c'].forEach(kk => { if (o[kk]) o[kk] = sh(o[kk]); }); if (o.p) o.p = Array.isArray(o.p[0]) ? o.p.map(sh) : sh(o.p); } };
        const o0 = O.length;
        const c2 = Math.cos(2 * th * D), s2 = Math.sin(2 * th * D);
        const sxp = r.M + r.a * c2 + r.t * s2, syp = r.M - r.a * c2 - r.t * s2, tau = -r.a * s2 + r.t * c2;
        const near = (a, b) => Math.abs(a - b) < 0.4;
        let nx = 'σ_x\'', ny = 'σ_y\'', nt = 'τ';
        if (near(th, 0)) { nx = 'σ_x'; ny = 'σ_y'; nt = 'τ_xy'; }
        else if (near(th, r.tp)) { nx = 'σ_max'; ny = 'σ_min'; }
        else if (near(th, -r.ts)) { nx = 'σ_ort'; ny = 'σ_ort'; nt = 'τ_max'; }
        const W = (x, y, z = 0.2) => [EX + x, y, z];
        const faces = [[1, 0, sxp, [0, 1]], [-1, 0, sxp, [0, -1]], [0, 1, syp, [1, 0]], [0, -1, syp, [-1, 0]]];
        faces.forEach(([lx, ly, sg, td], i) => {
          const n = [lx * c - ly * s, lx * s + ly * c], d0 = [td[0] * c - td[1] * s, td[0] * s + td[1] * c];
          const L = 0.3 + 1.2 * Math.abs(sg) / ref, r0 = hh + 0.02, r1 = hh + 0.02 + L;
          const A = sg >= 0 ? [n[0] * r0, n[1] * r0] : [n[0] * r1, n[1] * r1], B = sg >= 0 ? [n[0] * r1, n[1] * r1] : [n[0] * r0, n[1] * r0];
          O.push({ k: 'arrow', a: W(A[0], A[1]), b: W(B[0], B[1]), color: sg >= 0 ? C.tens : C.comp, w: 2.6 });
          // kayma oku
          const ts = Math.sign(tau) || 1, Ls = 0.25 + 1.2 * Math.abs(tau) / ref, m = [n[0] * (hh + 0.34), n[1] * (hh + 0.34)];
          const d = [d0[0] * ts, d0[1] * ts], ta = Math.min(1, Math.abs(tau) / 3);
          const xFace = i < 2, scol = xFace ? mixHex(C.white, C.red, S.rule) : C.white;
          const T1 = [m[0] - d[0] * Ls / 2, m[1] - d[1] * Ls / 2], T2 = [m[0] + d[0] * Ls / 2, m[1] + d[1] * Ls / 2];
          O.push({ k: 'arrow', a: W(T1[0], T1[1]), b: W(T2[0], T2[1]), color: scol, w: 2.4, hs: 10, alpha: ta });
          const side = Math.abs(n[0]) > Math.abs(n[1]) ? (n[0] > 0 ? 'left' : 'right') : 'center';
          if (i === 0 || i === 2) {
            const off = side === 'center' ? 0.32 : 0.15;
            const lab = (i === 0 ? nx : ny) + ' = ' + f1(sg);
            O.push({ k: 'text', t: lab, p: W(B[0] + n[0] * off, B[1] + n[1] * off + (side === 'center' ? 0 : -0.05)), color: sg >= 0 ? C.tens : C.comp, size: 14, box: 1, align: side });
          }
          if (i === 0 && ta > 0.05) {
            const tl = S.tq < 0.5 && near(th, 0) ? 'τ_xy = ?' : `${nt} = ${f1(Math.abs(tau))}`;
            O.push({ k: 'text', t: tl, p: W(T2[0] + d[0] * 0.2 + n[0] * 0.1, T2[1] + d[1] * 0.2 + n[1] * 0.1), color: scol, size: 14, box: 1, align: side, alpha: ta });
          }
        });
        // dönme açısı (eleman üstünde)
        if (Math.abs(th) > 0.5) {
          O.push({ k: 'line', p: [W(0, 0, 0.2), W(hh * 0.95, 0, 0.2)], color: '#1b2128', dash: [4, 3], w: 1.4 });
          O.push({ k: 'line', p: [W(0, 0, 0.2), W(hh * 0.95 * c, hh * 0.95 * s, 0.2)], color: '#1b2128', w: 1.6 });
          O.push({ k: 'line', p: arc(EX, 0, 0.6, 0, th, 0.2, 12), color: C.red, w: 2 });
          const nm = near(th, r.tp) ? `θ_p = ${f2(r.tp)}°\nsaat tersi` : near(th, -r.ts) ? `θ_s = ${f2(r.ts)}°\nsaat yönü` : `θ = ${f1(Math.abs(th))}°`;
          O.push({ k: 'text', t: nm, p: th > 0 ? W(-2.95, 0.15) : W(-2.3, -2.25), color: C.red, size: 13, box: 1 });
        }
        // kural: yüz çiftlerinin döndürme yönü
        if (S.rule > 0.01) {
          arcArrow(O, arc(EX, 0, 0.72, -50, 50, 0.2), C.red, S.rule, 2.2);
          arcArrow(O, arc(EX, 0, 0.72, 140, 40, 0.2), '#1b2128', S.rule, 2.4);
          O.push({ k: 'text', t: 'x yüzleri (sağ-sol):\nsaat tersi', p: W(1.6, -0.95), color: C.red, size: 12, box: 1, align: 'left', alpha: S.rule });
          O.push({ k: 'text', t: 'y yüzleri (üst-alt):\nsaat yönü', p: W(-0.55, 1.8), color: C.white, size: 12, box: 1, align: 'right', alpha: S.rule });
        }
        mv(o0, eOff); const o1 = O.length;
        // ---------- Mohr çemberi ----------
        const xmin = mx(Math.min(0, r.s2) - 8), xmax = mx(r.smax + 14), yax = Math.max(r.R, r.tem) * k + 0.5;
        O.push({ k: 'arrow', a: [xmin, 0, 0], b: [xmax, 0, 0], color: C.mute, w: 1.4, hs: 9 });
        O.push({ k: 'text', t: 'σ (MPa)', p: [xmax + 0.15, -0.3, 0], color: C.mute, size: 13, align: 'left' });
        O.push({ k: 'arrow', a: [X0, -yax, 0], b: [X0, yax, 0], color: C.mute, w: 1.4, hs: 9 });
        O.push({ k: 'text', t: 'τ', p: [X0 - 0.3, yax - 0.1, 0], color: C.mute, size: 15 });
        O.push({ k: 'text', t: '0', p: [X0 - 0.25, -0.28, 0], color: C.mute, size: 12 });
        const xM = mx(r.M), yX = my(-r.t), xS = mx(p.sx), xSy = mx(p.sy);
        if (S.vl > 0.01) {
          [[xS, 'σ_x = ' + fmt(p.sx), 'X bu çizgide\nsaat tersi → AŞAĞI', -1], [xSy, 'σ_y = ' + fmt(p.sy), 'Y bu çizgide\nsaat yönü → YUKARI', 1]].forEach(([x, t1, t2, sg]) => {
            O.push({ k: 'line', p: [[x, -2.3, 0], [x, 2.3, 0]], color: sg < 0 ? C.red : C.white, dash: [5, 4], w: 1.3, alpha: S.vl * 0.8 });
            O.push({ k: 'text', t: t1, p: [x, sg < 0 ? 0.3 : -0.3, 0], color: C.dim, size: 12, box: 1, alpha: S.vl });
            O.push({ k: 'text', t: t2, p: [x + (sg < 0 ? 0.9 : -0.9), sg * 1.9, 0], color: sg < 0 ? C.red : C.white, size: 12, box: 1, alpha: S.vl });
          });
        }
        if (S.cM > 0.01) {
          dot(O, xM, 0, C.white, S.cM);
          O.push({ k: 'text', t: `M = ${f1(r.M)}`, p: [xM, -0.32, 0], color: C.white, size: 13, box: 1, alpha: S.cM });
          if (S.tri < 0.5 && S.rB < 0.5) O.push({ k: 'dim', a: [xM, 0, 0], b: [xS, 0, 0], off: [0, -0.75, 0], t: f1(r.a), alpha: S.cM * (1 - S.tri) * (1 - S.rB) });
        }
        if (S.circ > 0.01) {
          const n = 72, P = arc(xM, 0, r.R * k, 180, 180 + 360 * Math.min(1, S.circ), 0, n);
          O.push({ k: 'line', p: P, color: '#e9edf1', w: 2, alpha: Math.min(1, S.circ * 1.5) });
        }
        if (S.rB > 0.01) {
          const xB = mx(r.s2);
          dot(O, xB, 0, C.comp, S.rB);
          O.push({ k: 'text', t: `B: σ_min = ${f1(r.s2)}`, p: [xB + 0.12, 0.3, 0], color: C.comp, size: 13, box: 1, align: 'left', alpha: S.rB });
          O.push({ k: 'dim', a: [xB, 0, 0], b: [xM, 0, 0], off: [0, 0.95, 0], t: `R = ${f1(r.M)} − ${f1(r.s2)} = ${f1(r.R)}`, alpha: S.rB });
        }
        if (S.tri > 0.01) {
          O.push({ k: 'line', p: [[xM, 0, 0], [xS, 0, 0], [xS, yX, 0], [xM, 0, 0]], color: C.red, w: 2.2, alpha: S.tri });
          O.push({ k: 'text', t: f1(r.a), p: [(xM + xS) / 2, 0.25, 0], color: C.red, size: 13, box: 1, alpha: S.tri });
          O.push({ k: 'text', t: `τ_xy = ${f1(r.t)}`, p: [xS + 0.15, yX / 2, 0], color: C.red, size: 14, box: 1, align: 'left', alpha: S.tri });
          O.push({ k: 'text', t: `R = ${f1(r.R)}`, p: [(xM + xS) / 2 - 0.55, yX / 2 - 0.1, 0], color: C.red, size: 13, box: 1, alpha: S.tri });
        }
        if (S.pts > 0.01) {
          dot(O, xS, yX, C.red, S.pts); dot(O, xSy, -yX, C.white, S.pts);
          O.push({ k: 'line', p: [[xS, yX, 0], [xSy, -yX, 0]], color: C.mute, w: 1.2, dash: [4, 4], alpha: S.pts * 0.8 });
          O.push({ k: 'text', t: `X (${fmt(p.sx)} ; ${f1(r.t)})`, p: [xS + 0.15, yX - 0.32, 0], color: C.red, size: 13, box: 1, align: 'left', alpha: S.pts });
          O.push({ k: 'text', t: `Y (${fmt(p.sy)} ; ${f1(r.t)})`, p: [xSy - 0.15, -yX + 0.3, 0], color: C.white, size: 13, box: 1, align: 'right', alpha: S.pts });
        }
        if (S.live > 0.01) {
          // elemanın şu anki x' yüzü: çizimde (σx', −τx'y')
          const P1 = [mx(sxp), my(-tau), 0], P2 = [mx(syp), my(tau), 0];
          O.push({ k: 'line', p: [P2, P1], color: C.red, w: 2.6, alpha: S.live });
          dot(O, P1[0], P1[1], C.red, S.live, 0.11);
          if (!near(th, 0)) O.push({ k: 'text', t: 'x\'', p: [P1[0] + 0.3, P1[1] + 0.05, 0], color: C.red, size: 13, alpha: S.live });
        }
        if (S.a2p > 0.01) {
          const xA = mx(r.smax), xB = mx(r.s2);
          dot(O, xA, 0, C.tens, S.a2p); dot(O, xB, 0, C.comp, S.a2p);
          arcArrow(O, arc(xM, 0, 0.75, -r.d2p, -2, 0, 16), C.tens, S.a2p, 2);
          O.push({ k: 'text', t: `2θ_p = ${f2(r.d2p)}°`, p: [xM + 1.0, -0.62, 0], color: C.tens, size: 13, box: 1, align: 'left', alpha: S.a2p });
          O.push({ k: 'text', t: `A: σ_max = ${f1(r.smax)}`, p: [xA + 0.15, 0.32, 0], color: C.tens, size: 14, box: 1, align: 'left', alpha: S.a2p });
          O.push({ k: 'text', t: `B: σ_min = ${f1(r.s2)}`, p: [xB + 0.1, -0.32, 0], color: C.comp, size: 13, box: 1, align: 'left', alpha: S.a2p * (1 - S.rB) });
        }
        if (S.a2s > 0.01) {
          const yb = -r.R * k;
          dot(O, xM, yb, C.red, S.a2s); dot(O, xM, -yb, C.mute, S.a2s);
          O.push({ k: 'line', p: [[xM, 0, 0], [xM, yb, 0]], color: C.mute, w: 1.2, dash: [4, 4], alpha: S.a2s });
          arcArrow(O, arc(xM, 0, 1.0, -r.d2p, -90 + 2, 0, 12), C.red, S.a2s, 2);
          O.push({ k: 'text', t: `2θ_s = ${f2(r.d2s)}°`, p: [xM + 0.75, -1.35, 0], color: C.red, size: 13, box: 1, align: 'left', alpha: S.a2s });
          O.push({ k: 'text', t: `τ_max = R = ${f1(r.R)}`, p: [xM - 0.2, yb - 0.1, 0], color: C.red, size: 14, box: 1, align: 'right', alpha: S.a2s });
          O.push({ k: 'text', t: `σ = M = ${f1(r.M)}`, p: [xM - 0.2, 0.3, 0], color: C.dim, size: 12, box: 1, align: 'right', alpha: S.a2s });
        }
        if (S.tres > 0.01) {
          const yt = r.tem * k, x0 = mx(r.s2) - 0.4, x1 = mx(r.smax) + 0.4;
          [yt, -yt].forEach(y => O.push({ k: 'line', p: [[x0, y, 0], [x1, y, 0]], color: C.red, w: 1.8, dash: [7, 4], alpha: S.tres }));
          O.push({ k: 'text', t: `sınır τ_em = σ_Y/2 = ${f1(r.tem)}`, p: [x0, yt + 0.3, 0], color: C.red, size: 13, box: 1, align: 'left', alpha: S.tres * (1 - S.sum) });
          dot(O, xM, r.R * k, C.white, S.tres); dot(O, xM, -r.R * k, C.white, S.tres);
          O.push({ k: 'text', t: `tepe τ_max = ${f1(r.tmax)} ${r.okT ? '<' : '>'} ${f1(r.tem)}`, p: [xM, -yt - 0.32, 0], color: C.white, size: 13, box: 1, alpha: S.tres * (1 - S.sum) });
        }
        if (S.vm > 0.01) {
          const yb = -Math.max(r.R, r.tem) * k - 0.85, xY = mx(p.sY), xV = mx(r.vm);
          O.push({ k: 'line', p: [[X0, yb, 0], [mx(Math.max(r.vm, p.sY) + 12), yb, 0]], color: C.mute, w: 1.2, alpha: S.vm });
          O.push({ k: 'line', p: [[X0, yb, 0], [xV, yb, 0]], color: r.okV ? C.white : C.tens, w: 5, alpha: S.vm });
          O.push({ k: 'line', p: [[xY, yb - 0.3, 0], [xY, yb + 0.3, 0]], color: C.red, w: 2.6, alpha: S.vm });
          O.push({ k: 'text', t: `σ_Y = ${fmt(p.sY)}`, p: [xY - 0.1, yb - 0.55, 0], color: C.red, size: 13, box: 1, align: 'right', alpha: S.vm });
          O.push({ k: 'text', t: `σ_e = ${f2(r.vm)} ${r.okV ? '< σ_Y' : '> σ_Y'}`, p: [xV + 0.1, yb - 0.55, 0], color: r.okV ? C.white : C.tens, size: 13, box: 1, align: 'left', alpha: S.vm });
          dot(O, mx(r.smax), 0, C.tens, S.vm); dot(O, mx(r.s2), 0, C.tens, S.vm);
          O.push({ k: 'text', t: `σ_1 = ${f1(r.smax)}`, p: [mx(r.smax) + 0.12, 0.3, 0], color: C.tens, size: 13, box: 1, align: 'left', alpha: S.vm * (1 - S.sum) });
          O.push({ k: 'text', t: `σ_2 = ${f1(r.s2)}`, p: [mx(r.s2) + 0.12, 0.3, 0], color: C.tens, size: 13, box: 1, align: 'left', alpha: S.vm * (1 - S.sum) });
          O.push({ k: 'text', t: 'von Mises', p: [X0 + 0.1, yb + 0.32, 0], color: C.dim, size: 12, align: 'left', alpha: S.vm });
        }
        if (S.sum > 0.01) {
          O.push({ k: 'text', t: `Tresca (hoca): ${f1(r.tmax)} ${r.okT ? '<' : '>'} ${f1(r.tem)} → ${r.okT ? 'EMNİYETLİ' : 'EMNİYETSİZ'}\nvon Mises: ${f2(r.vm)} ${r.okV ? '<' : '>'} ${fmt(p.sY)} → ${r.okV ? 'EMNİYETLİ' : 'EMNİYETSİZ'}`, p: [mx(r.M), Math.max(r.R, r.tem) * k + 0.75, 0], color: C.white, size: 14, box: 1, alpha: S.sum });
        }
        mv(o1, mOff);
      }
    };
  },
  whatif: {
    not: 'σmin\'i küçült: çember büyür, τxy artar. σmin, σy\'ye yaklaşınca τ sıfıra iner. σmin, σy\'yi geçerse böyle bir çember kurulamaz. σY\'yi oynatıp iki ölçütün ne zaman ayrıştığına bak.',
    s: [{ k: 'sx', ad: 'σx', min: 40, max: 160, step: 1, u: 'MPa' }, { k: 'sy', ad: 'σy', min: 0, max: 140, step: 1, u: 'MPa' }, { k: 'smin', ad: 'σmin', min: -40, max: 120, step: 1, u: 'MPa' }, { k: 'sY', ad: 'Akma σY', min: 60, max: 250, step: 5, u: 'MPa' }],
    out: (p, r) => {
      if (!r.ok) return `<p class="note"><b>Bu σmin ile çember kurulamaz.</b> R = M − σmin = ${f1(r.M - p.smin)} MPa, ama yarıçap en az |σx − σy|/2 = ${f1(Math.abs(r.a))} MPa olmalı. σmin her zaman σx ve σy'nin ikisinden de küçük (ya da eşit) olur.</p>`;
      const xs = [Math.min(0, r.s2) - 10, r.smax + 10], ty = Math.max(r.R, r.tem) * 1.15, Wd = 320, Hd = 190;
      const sc = Math.min((Wd - 20) / (xs[1] - xs[0]), (Hd - 20) / (2 * ty));
      const X = s => 10 + (s - xs[0]) * sc, Y = t => Hd / 2 + t * sc;
      const svg = `<svg viewBox="0 0 ${Wd} ${Hd}" style="width:100%;max-width:420px;display:block;margin:6px 0 10px">
        <line x1="${X(xs[0])}" y1="${Y(0)}" x2="${X(xs[1])}" y2="${Y(0)}" stroke="#8e99a6"/><line x1="${X(0)}" y1="4" x2="${X(0)}" y2="${Hd - 4}" stroke="#8e99a6"/>
        <line x1="${X(xs[0])}" y1="${Y(-r.tem)}" x2="${X(xs[1])}" y2="${Y(-r.tem)}" stroke="#ff2d20" stroke-dasharray="5 4"/><line x1="${X(xs[0])}" y1="${Y(r.tem)}" x2="${X(xs[1])}" y2="${Y(r.tem)}" stroke="#ff2d20" stroke-dasharray="5 4"/>
        <circle cx="${X(r.M)}" cy="${Y(0)}" r="${r.R * sc}" fill="none" stroke="#e9edf1" stroke-width="1.6"/>
        <line x1="${X(p.sx)}" y1="${Y(r.t)}" x2="${X(p.sy)}" y2="${Y(-r.t)}" stroke="#ff4a3d" stroke-width="1.6"/>
        <circle cx="${X(p.sx)}" cy="${Y(r.t)}" r="4" fill="#ff4a3d"/><circle cx="${X(p.sy)}" cy="${Y(-r.t)}" r="4" fill="#ffffff"/>
        <text x="${X(p.sx) + 6}" y="${Y(r.t) + 12}" fill="#ff4a3d" font-size="12">X</text><text x="${X(p.sy) - 14}" y="${Y(-r.t) - 6}" fill="#fff" font-size="12">Y</text>
        <text x="${X(xs[1]) - 70}" y="${Y(-r.tem) - 4}" fill="#ff2d20" font-size="11">τ_em = ${f1(r.tem)}</text></svg>`;
      return svg + `<div class="mets"><div class="m"><small>τ_xy</small><b>${f2(r.t)} MPa</b></div><div class="m"><small>R = τ_max</small><b>${f2(r.R)} MPa</b></div>
        <div class="m red"><small>σ_max</small><b>${f2(r.smax)} MPa</b></div><div class="m"><small>θ_p (saat tersi)</small><b>${f2(r.tp)}°</b></div>
        <div class="m ${r.okT ? '' : 'red'}"><small>Tresca (düzlem içi)</small><b>${r.okT ? 'emniyetli' : 'emniyetsiz'}</b></div><div class="m ${r.okV ? '' : 'red'}"><small>von Mises σ_e = ${f1(r.vm)}</small><b>${r.okV ? 'emniyetli' : 'emniyetsiz'}</b></div></div>
        <p class="note">σ₃ = 0 da hesaba katılırsa mutlak τ<sub>max</sub> = ${f2(r.tabs)} MPa → Tresca ${r.okT3 ? 'emniyetli' : 'emniyetsiz'}. Hocanın yolu düzlem içi τ<sub>max</sub> = R.</p>`;
    }
  },
  kagit: (p, r) => {
    const lt = (a, b) => a <= b ? '&lt;' : '&gt;';
    return `Verilen: σx = ${fmt(p.sx)} MPa, σy = ${fmt(p.sy)} MPa, σmin = ${fmt(p.smin)} MPa, τxy = ?
Merkez:  M = (σx + σy)/2 = (${fmt(p.sx)} + ${fmt(p.sy)})/2 = ${f2(r.M)} MPa
Yarıçap: σmin = M − R  →  R = ${f2(r.M)} − ${fmt(p.smin)} = ${f2(r.R)} MPa
         (σx − σy)/2 = ${f2(r.a)} MPa
τxy:     R² = ${f2(r.a)}² + τxy²  →  τxy = √(${f2(r.R)}² − ${f2(r.a)}²) = ${f2(r.t)} MPa
Noktalar: X(${fmt(p.sx)} ; ${f2(r.t)}) aşağıda, Y(${fmt(p.sy)} ; ${f2(r.t)}) yukarıda
          (x yüzlerinde kayma saat tersi döndürür → X aşağı)
[Çemberi çiz: merkez M, yarıçap R; A = σmax, B = σmin işaretle]

a) σmax = M + R = ${f2(r.M)} + ${f2(r.R)} = ${f2(r.smax)} MPa      σmin = ${fmt(p.smin)} MPa
   tan 2θp = ${f2(r.t)} / ${f2(r.a)}  →  2θp = ${f2(r.d2p)}°  →  θp = ${f2(r.tp)}° (saat tersi)
   [Elemanı θp döndür: x' yüzünde σmax, y' yüzünde σmin, kayma yok]
b) τmax = R = ${f2(r.R)} MPa
   2θs = 90° − ${f2(r.d2p)}° = ${f2(r.d2s)}°  →  θs = ${f2(r.ts)}° (saat yönü)
   [Bu yüzlerde σ = M = ${f2(r.M)} MPa]
c) σY = ${fmt(p.sY)} MPa
   Tresca:    τem = σY/2 = ${f2(r.tem)} MPa ;  τmax = ${f2(r.tmax)} ${lt(r.tmax, r.tem)} ${f2(r.tem)}  →  ${r.okT ? 'emniyetli' : 'emniyetsiz'}
   von Mises: σe = √(σ1² − σ1·σ2 + σ2²) = √(${f2(r.smax)}² − ${f2(r.smax)}·${f2(r.s2)} + ${f2(r.s2)}²)
                 = ${f2(r.vm)} MPa ${lt(r.vm, p.sY)} ${fmt(p.sY)}  →  ${r.okV ? 'emniyetli' : 'emniyetsiz'}`;
  },
  tuzak: ['<b>R\'yi Pisagor\'la bulmaya çalışmak.</b> τ bilinmiyor; R = M − σ<sub>min</sub>.',
    '<b>Pisagor\'da R\'yi kenar sanmak.</b> R hipotenüs: τ = √(R² − 17,5²), √(R² + 17,5²) değil.',
    '<b>Çemberdeki açıyı elemana aynen koymak.</b> 67,38° çemberde; eleman yarısı kadar, 33,69° döner.',
    '<b>X\'i yanlış tarafa koymak.</b> Sağ yüzde kayma yukarı → saat tersi → X aşağıda. Yanlış koyarsan açının yönü ters çıkar (sayılar aynı kalır).',
    '<b>τmax düzleminde σ = 0 sanmak.</b> Orada normal gerilme M = 80,5 MPa.',
    '<b>Tresca\'da σ<sub>Y</sub>\'yi doğrudan τ ile karşılaştırmak.</b> Kayma sınırı σ<sub>Y</sub>/2 = 50 MPa.',
    '<b>von Mises işareti.</b> σ₁·σ₂ terimi eksi, σ₂² artı: √(126² − 126·35 + 35²).'],
  gen() {
    const sx = rnd(70, 150, 1), sy = rnd(20, sx - 10, 1), smin = rnd(Math.max(-30, sy - 50), sy - 6, 1);
    const q = { sx, sy, smin, sY: 100 }, r = VIZE.find(x => x.id === 'v5').solve(q);
    q.sY = Math.max(60, Math.round(r.vm * rnd(0.8, 1.25, 0.01) / 10) * 10);
    return q;
  },
  pracText: p => `Düzlem gerilme: σx = ${fmt(p.sx)} MPa, σy = ${fmt(p.sy)} MPa (çekme). Kayma şekildeki gibi (sağ yüzde yukarı) ama büyüklüğü verilmemiş; σmin = ${fmt(p.smin)} MPa. Akma gerilmesi σY = ${fmt(p.sY)} MPa. τxy, σmax, θp, düzlem içi τmax ve von Mises eşdeğer gerilmesini bul. (Tresca ve von Mises'e göre emniyetli mi, kendin karar ver; çözümde yazıyor.)`,
  ans: [{ k: 't', ad: 'τ<sub>xy</sub>', u: 'MPa' }, { k: 'smax', ad: 'σ<sub>max</sub>', u: 'MPa' }, { k: 'tp', ad: 'θ<sub>p</sub>', u: '°', tol: 0.03 }, { k: 'tmax', ad: 'τ<sub>max</sub> (düzlem içi)', u: 'MPa' }, { k: 'vm', ad: 'σ<sub>e</sub> (von Mises)', u: 'MPa' }],
  hints: (p, r) => [`Merkez τ'ya bağlı değil: M = (${fmt(p.sx)} + ${fmt(p.sy)})/2 = ${f2(r.M)}. σmin en sol nokta: R = M − σmin.`,
    `Dik üçgen: yatay kenar (σx − σy)/2 = ${f2(r.a)}, hipotenüs R. τ = √(R² − ${f2(r.a)}²).`,
    'σmax = M + R. tan 2θp = τ / ((σx − σy)/2); elemanın açısı bunun yarısı.',
    'τmax = R. von Mises: √(σmax² − σmax·σmin + σmin²).'],
  diag(p, r, u) {
    const near = (a, b) => isFinite(a) && isFinite(b) && Math.abs(a - b) <= Math.abs(b) * 0.02 + 1e-9;
    if (near(u.t, Math.sqrt(r.R * r.R + r.a * r.a))) return 'τ için R² + 17,5² almışsın. R hipotenüs: τ² = R² − ((σx − σy)/2)².';
    if (near(u.t, r.R)) return 'τxy\'yi R ile karıştırdın. R hipotenüs, τxy düşey kenar: Pisagor.';
    if (near(u.smax, p.smin + r.R)) return 'σmax = σmin + R değil, σmin + 2R (ya da M + R).';
    if (near(u.tp, r.d2p)) return 'Çemberdeki açıyı (2θp) yazdın. Eleman yarısı kadar döner: θp.';
    if (near(u.tp, r.ts)) return 'Bu θs (τmax düzlemi). θp için tan 2θp = τ / ((σx − σy)/2).';
    if (near(u.tmax, r.R / 2) || near(u.tmax, r.tem)) return 'Düzlem içi τmax çemberin yarıçapı: τmax = R. σY/2 Tresca sınırı, cevap değil.';
    if (near(u.tmax, r.smax / 2)) return 'σmax/2 mutlak τmax (σ₃ = 0 ile). Hocanın yolu düzlem içi: τmax = R.';
    if (near(u.vm, Math.sqrt(r.smax ** 2 + r.smax * r.s2 + r.s2 ** 2))) return 'von Mises\'te σ1·σ2 terimi eksi olmalı.';
    if (near(u.vm, Math.sqrt(Math.max(0, r.smax ** 2 - r.smax * r.s2 - r.s2 ** 2)))) return 'σ2² terimi artı: √(σ1² − σ1σ2 + σ2²).';
    if (near(u.vm, Math.sqrt(p.sx ** 2 - p.sx * p.sy + p.sy ** 2))) return 'σx, σy ile von Mises yazarsan 3τxy² terimini unutma; ya da asal gerilmeleri kullan.';
    return 'Sırayla git: M, sonra R = M − σmin, sonra τ = √(R² − a²), sonra çemberden oku.';
  }
});
