// Hocanın 3 çözümlü soru PDF'indeki 18 soru. Sayılar PDF'teki çözümlerle karşılaştırıldı;
// fark çıkan yerde ikisi de yazıldı.
const SRC = {
  tk: "Termodinamiğin Temel Kavramları PDF",
  ss: "Saf Maddenin Özellikleri PDF",
  is: "İş ve Isı PDF"
};
const GROUPS = [
  {id:"g1", title:"Basınç ve kuvvet dengesi", note:"Temel Kavramlar PDF'i. Tablo yok; P = F/A, P = Patm + ρgh ve piston dengesi.", ids:["tk1","tk2","tk3","tk4","tk5","tk6","tk7"]},
  {id:"g2", title:"Tablodan hal bulma (su, R-134a)", note:"Saf Madde PDF'i. Her soru aynı iskelet: iki bağımsız yeğin özellik → bölge → doğru tablo → x → istenen özellik.", ids:["ss1","ss2","ss3","ss4","ss5","ss6","ss7","ss8","ss9"]},
  {id:"g3", title:"Mükemmel gaz", note:"Saf Madde PDF'inin son kısmı. PV = mRT; basınç mutlak, sıcaklık Kelvin.", ids:["ig1","ig2"]},
  {id:"g4", title:"Sınır işi (P-V altındaki alan)", note:"İş ve Isı PDF'i. İş = P-V diyagramında yolun altındaki alan.", ids:["is1","is2","is3"]}
];

const P = {};

/* ───────────── TEMEL KAVRAMLAR ───────────── */
P.tk1 = {
  no:"TK-1", src:"tk", page:1, title:"Suyla dolu kabın ağırlığı", tip:"kütle → ağırlık", gen:"agirlik",
  soru:`Hacmi 0.2 m³ olan 3 kg'lık bir plastik kap suyla doludur. Suyun yoğunluğunun 1000 kg/m³ olduğunu kabul ederek sistemin toplam ağırlığını hesaplayınız.`,
  anla:[["Hacmi 0.2 m³ … suyla doludur","Suyun hacmi kabın hacmine eşit: V<sub>su</sub> = 0.2 m³."],
        ["3 kg'lık plastik kap","Kabın kendi kütlesi. Sistem = kap + su; bunu unutma."],
        ["toplam ağırlık","Ağırlık bir kuvvet: W = m·g, birimi N (kg değil)."]],
  tetik:["“Ağırlık” kelimesi → W = mg.","Yoğunluk + hacim verilmiş → kütle: m = ρV."],
  adim:[
    {q:"Suyun kütlesini nereden bulursun?", a:`m<sub>su</sub> = ρ·V = 1000 × 0.2 = <b>200 kg</b>`},
    {q:"Sistemin toplam kütlesi?", a:`m<sub>sistem</sub> = m<sub>kap</sub> + m<sub>su</sub> = 3 + 200 = <b>203 kg</b>`},
    {q:"Ağırlık?", a:`W = m·g = 203 × 9.81 = <b>1991 N</b> (kg·m/s² = N)`}
  ],
  kagit:["m_su = ρV = 1000·0.2 = 200 kg","m = 3 + 200 = 203 kg","W = mg = 203·9.81 ≈ 1991 N"],
  tuzak:["Cevabı kg yazmak: ağırlık N'dir.","Kabın 3 kg'ını eklemeyi unutmak."],
  cevap:"W ≈ 1991 N"
};
P.tk2 = {
  no:"TK-2", src:"tk", page:2, title:"Vakum ölçerden mutlak basınç", tip:"vakum", gen:"basinc",
  soru:`Bir odaya bağlı vakum ölçme cihazı, yerel atmosfer basıncının 100 kPa olduğu bir yerde 40 kPa değerini göstermektedir. Odadaki mutlak basıncı belirleyiniz.`,
  anla:[["vakum ölçme cihazı … 40 kPa","Cihaz atmosferin ne kadar ALTINDA olduğunu gösterir: P<sub>vakum</sub> = 40 kPa."],
        ["mutlak basınç","Gerçek basınç; tablolarda ve hesapta hep bu kullanılır."]],
  tetik:["“vakum” → P<sub>mutlak</sub> = P<sub>atm</sub> − P<sub>vakum</sub>","“gösterge / etkin” → P<sub>mutlak</sub> = P<sub>atm</sub> + P<sub>gösterge</sub>"],
  adim:[{q:"Vakum mu, gösterge mi?", a:"Vakum → atmosferden çıkar."},
        {q:"Hesapla.", a:`P<sub>mutlak</sub> = 100 − 40 = <b>60 kPa</b>`}],
  kagit:["P_mutlak = P_atm − P_vakum = 100 − 40 = 60 kPa"],
  tuzak:["Vakumu atmosfere eklemek (140 kPa yanlış)."],
  cevap:"P = 60 kPa"
};
P.tk3 = {
  no:"TK-3", src:"tk", page:2, title:"Barometreden atmosfer basıncı", tip:"barometre", gen:"basinc",
  soru:`Barometrik basıncın 750 mmHg olduğu bir yerde atmosferik basıncı hesaplayınız. Cıvanın yoğunluğu 13600 kg/m³.`,
  anla:[["750 mmHg","Barometredeki cıva sütunu h = 750 mm = 0.750 m."],["atmosferik basınç","Barometre atmosferi ölçer: P<sub>atm</sub> = ρgh."]],
  tetik:["“barometre / mmHg” → P<sub>atm</sub> = ρ<sub>Hg</sub>·g·h"],
  adim:[{q:"Birimleri hazırla.", a:"h = 0.750 m, ρ = 13600 kg/m³, g = 9.81 m/s²"},
        {q:"Hesapla ve kPa'ya çevir.", a:`P<sub>atm</sub> = 13600 × 9.81 × 0.750 = 100062 Pa ≈ <b>100.1 kPa</b>`}],
  kagit:["P_atm = ρgh = 13600·9.81·0.750 = 100062 Pa ≈ 100.1 kPa"],
  tuzak:["mm'yi m'ye çevirmemek.","Pa'yı kPa'ya çevirmeyi unutmak (÷1000)."],
  cevap:"P_atm ≈ 100.1 kPa"
};
P.tk4 = {
  no:"TK-4", src:"tk", page:3, title:"Derinlikle gösterge basıncı", tip:"ρgh oranı", gen:"basinc",
  soru:`Bir sıvının 3 m derinlikteki gösterge basıncı 28 kPa olarak okunmaktadır. Aynı sıvının 9 m derinlikteki gösterge basıncını hesaplayınız.`,
  anla:[["gösterge basıncı","Atmosferin üstündeki kısım: P<sub>gösterge</sub> = ρgh. Atmosfer işin içine girmiyor."],
        ["Aynı sıvının","ρ aynı. İlk veriden ρ'yu bul ya da oran kur."]],
  tetik:["Gösterge basıncı derinlikle doğru orantılı → P<sub>2</sub>/P<sub>1</sub> = h<sub>2</sub>/h<sub>1</sub>."],
  adim:[{q:"İlk veriden ρ?", a:`28000 = ρ × 9.81 × 3 → ρ ≈ <b>951.4 kg/m³</b>`},
        {q:"9 m'de?", a:`P<sub>2</sub> = 951.4 × 9.81 × 9 = 84000 Pa = <b>84 kPa</b> (kısa yol: 28 × 9/3)`}],
  kagit:["ρ = 28000/(9.81·3) = 951.4 kg/m³","P2 = ρgh2 = 951.4·9.81·9 = 84 000 Pa = 84 kPa"],
  tuzak:["Atmosfer basıncını eklemek: soru gösterge basıncı istiyor."],
  cevap:"P₂ = 84 kPa"
};
P.tk5 = {
  no:"TK-5", src:"tk", page:"4–5", title:"Piston dengesi ve ağırlıklar", tip:"kuvvet dengesi", gen:"piston",
  soru:`Dikey bir piston silindir düzeneğinde 100 kPa basınçta bir gaz bulunmaktadır. 12 cm çapındaki pistonun kütlesi 5 kg'dır. Piston üzerine ağırlıklar konularak silindir içindeki gazın basıncının başlangıçtakinin iki katı olabilmesi için o bölgedeki atmosfer basıncını ve ağırlıkların kütlesini hesaplayınız.`,
  anla:[["dikey … piston … 5 kg","Pistonun ağırlığı gazı ek olarak bastırır."],
        ["12 cm çapındaki","Alan çaptan: A = πD²/4 (yarıçap değil)."],
        ["basıncın iki katı","2. halde P<sub>gaz</sub> = 200 kPa; fark ağırlıklardan gelir."]],
  tetik:["Piston + “denge” → pistonun serbest cisim diyagramını çiz: yukarı itenler = aşağı itenler.","Basınç × alan = kuvvet."],
  adim:[
    {q:"Piston alanı?", a:`A = π(0.12)²/4 = <b>0.011310 m²</b>`},
    {q:"1. halde pistona etkiyen kuvvetleri yaz.", a:`Yukarı: P<sub>gaz</sub>·A. Aşağı: P<sub>atm</sub>·A + m<sub>p</sub>g.<br>P<sub>gaz</sub>A = P<sub>atm</sub>A + m<sub>p</sub>g`},
    {q:"P<sub>atm</sub>?", a:`100000 × 0.011310 = P<sub>atm</sub> × 0.011310 + 5 × 9.81<br>1131.0 = P<sub>atm</sub>·0.011310 + 49.05 → P<sub>atm</sub> = 95 661 Pa ≈ <b>95.66 kPa</b>`},
    {q:"2. halde (P = 200 kPa) denge?", a:`P<sub>gaz2</sub>A = P<sub>atm</sub>A + m<sub>p</sub>g + m<sub>ağ</sub>g<br>2262.0 = 1081.9 + 49.05 + m<sub>ağ</sub>·9.81 → m<sub>ağ</sub> ≈ <b>115.3 kg</b>`}
  ],
  kagit:["A = πD²/4 = 0.01131 m²","P1·A = Patm·A + mp·g → Patm = 95.66 kPa","2P1·A = Patm·A + mp·g + m·g → m ≈ 115.3 kg"],
  tuzak:["Pa ile N karıştırmak: Pa·m² = N. kPa kullanırsan m·g'yi 1000'e böl (kN).","Çapı yarıçap gibi kullanmak.","2. halde pistonun kendi ağırlığını unutmak."],
  cevap:"P_atm ≈ 95.66 kPa, m_ağırlık ≈ 115.3 kg"
};
P.tk6 = {
  no:"TK-6", src:"tk", page:6, title:"Manometreyle tank basıncı", tip:"manometre", gen:"basinc",
  soru:`Bir tank içerisindeki basıncı ölçmek için manometre kullanılıyor. Kullanılan akışkanın yoğunluğu 850 kg/m³ ve manometre akışkanının sütunları arasındaki yükseklik farkı 55 cm'dir. Yerel atmosferik basınç 96 kPa olduğuna göre tank içerisindeki mutlak basıncı belirleyiniz.`,
  anla:[["sütunları arasındaki yükseklik farkı 55 cm","h = 0.55 m; ρgh tankın atmosferden farkı (etkin basınç)."],["mutlak basınç","P = P<sub>atm</sub> + ρgh"]],
  tetik:["U borusu, açık uç atmosferde → P = P<sub>atm</sub> + ρgh (sıvı açık uçta yüksekse)."],
  adim:[{q:"ρgh (kPa)?", a:`850 × 9.81 × 0.55 / 1000 = <b>4.59 kPa</b> (etkin basınç)`},
        {q:"Mutlak?", a:`P = 96 + 4.59 = <b>100.6 kPa</b>`}],
  kagit:["P = Patm + ρgh = 96 + 850·9.81·0.55/1000 ≈ 100.6 kPa"],
  tuzak:["ρgh Pa çıkar; kPa ile toplamadan önce 1000'e böl."],
  cevap:"P ≈ 100.6 kPa"
};
P.tk7 = {
  no:"TK-7", src:"tk", page:7, title:"Yağ manometresi (45 cm / 60 cm)", tip:"manometre", gen:"basinc",
  soru:`Bir yağ (ρ = 850 kg/m³) manometresi içi hava dolu bir kaba sağlanmıştır. Sütunlar arasındaki yükseklik farkı 45 cm ve atmosfer basıncı 98 kPa olduğuna göre kap içindeki havanın mutlak basıncını hesaplayınız. (Aynı problem 60 cm için de çözülmüş.)`,
  anla:[["45 cm","h = 0.45 m"],["mutlak","P = P<sub>atm</sub> + ρgh"]],
  tetik:["TK-6 ile aynı tarif."],
  adim:[{q:"h = 0.45 m için?", a:`P = 98 + 850·9.81·0.45/1000 = 98 + 3.75 = <b>101.75 ≈ 102 kPa</b>`},
        {q:"h = 0.60 m için?", a:`P = 98 + 5.00 = <b>103.0 kPa</b>`}],
  kagit:["P = 98 + 850·9.81·0.45/1000 ≈ 101.8 kPa","h = 0.60 m → P ≈ 103 kPa"],
  tuzak:["Çözümde 101.75 → “102” diye yuvarlanmış; sınavda ara sonucu yazıp yuvarla."],
  cevap:"P ≈ 101.8 kPa (60 cm için 103 kPa)"
};

/* ───────────── SAF MADDE ───────────── */
P.ss1 = {
  no:"SM-1", src:"ss", page:"1–4", title:"Su için tabloyu tamamla (4 satır)", tip:"faz tayini", gen:"faz",
  soru:`Tabloyu su için tamamlayın.<table class="mini"><tr><th></th><th>T (°C)</th><th>P (kPa)</th><th>v (m³/kg)</th><th>Faz tanımı</th></tr>
<tr><td>I</td><td>50</td><td></td><td>4.16</td><td></td></tr><tr><td>II</td><td></td><td>200</td><td></td><td>Doymuş buhar</td></tr>
<tr><td>III</td><td>250</td><td>400</td><td></td><td></td></tr><tr><td>IV</td><td>110</td><td>600</td><td></td><td></td></tr></table>`,
  anla:[["Her satırda iki bilgi var","Basit sıkıştırılabilir sistemde hal = iki bağımsız yeğin özellik. Her satırda bu ikisi verilmiş; gerisini tablo verir."],
        ["“Doymuş buhar”","Bu bir özellik sayılır: x = 1. P ile birlikte hal belli."],
        ["T ve P birlikte verilmiş (III, IV)","Karışım bölgesinde T ve P bağımsız değil. O yüzden önce bölgeyi bul."]],
  tetik:["Hep ilk iş: verilen T'nin doyma basıncına (A-4) ya da verilen P'nin doyma sıcaklığına (A-5) bak, karşılaştır.","v verilmişse: v'yi aynı T veya P'deki v<sub>f</sub>, v<sub>g</sub> ile karşılaştır."],
  adim:[
    {q:"I. satır: T = 50 °C, v = 4.16. Bölge?", a:`A-4 (50 °C): v<sub>f</sub> = 0.001012, v<sub>g</sub> = 12.026 → v<sub>f</sub> &lt; 4.16 &lt; v<sub>g</sub> → <b>doymuş karışım (ıslak buhar)</b>.<br>Karışımda P = P<sub>doyma</sub>@50 °C = <b>12.352 kPa</b>.`},
    {q:"II. satır: P = 200 kPa, doymuş buhar. T ve v?", a:`Doymuş buhar → x = 1. A-5 (200 kPa): T = T<sub>doyma</sub> = <b>120.21 °C</b>, v = v<sub>g</sub> = <b>0.88578 m³/kg</b>.`},
    {q:"III. satır: T = 250 °C, P = 400 kPa. Bölge?", a:`Yol 1: A-4'ten P<sub>doyma</sub>@250 °C = 3976.2 kPa; 400 &lt; 3976.2 → <b>kızgın buhar</b>.<br>Yol 2: A-5'ten T<sub>doyma</sub>@400 kPa = 143.61 °C; 250 &gt; 143.61 → kızgın buhar.<br>A-6 (0.4 MPa, 250 °C): v = <b>0.59520 m³/kg</b>.`},
    {q:"IV. satır: T = 110 °C, P = 600 kPa. Bölge ve v?", a:`P<sub>doyma</sub>@110 °C = 143.38 kPa; 600 &gt; 143.38 → <b>sıkıştırılmış sıvı</b> (ya da T<sub>doyma</sub>@600 = 158.83 &gt; 110).<br>A-7 en düşük 5 MPa'dan başlıyor; 600 kPa yok. O zaman <b>aynı sıcaklıktaki doymuş sıvı</b> alınır: v ≈ v<sub>f</sub>@110 °C = <b>0.001052 m³/kg</b>.`}
  ],
  tablo:`<table class="mini"><tr><th>T (°C)</th><th>P (kPa)</th><th>v (m³/kg)</th><th>Faz</th></tr><tr><td>50</td><td>12.352</td><td>4.16</td><td>Doymuş karışım</td></tr><tr><td>120.21</td><td>200</td><td>0.88578</td><td>Doymuş buhar</td></tr><tr><td>250</td><td>400</td><td>0.59520</td><td>Kızgın buhar</td></tr><tr><td>110</td><td>600</td><td>0.001052</td><td>Sıkıştırılmış sıvı</td></tr></table>`,
  dia:{kind:"tv", isobars:[{P:400},{P:600},{P:200}], pts:[{v:4.16,T:50,l:"I"},{v:0.88578,T:120.21,l:"II"},{v:0.59520,T:250,l:"III"},{v:0.001052,T:110,l:"IV"}]},
  kagit:["I: vf<4.16<vg (A-4, 50°C) → karışım, P = Psat = 12.352 kPa","II: x=1, A-5 → T = 120.21 °C, v = vg = 0.88578","III: P < Psat@250 (3976.2) → kızgın, A-6 → v = 0.59520","IV: P > Psat@110 (143.38) → sıkıştırılmış sıvı, v ≈ vf@110 = 0.001052"],
  tuzak:["Kızgın buharda T ve P bağımsızdır; karışımda değil. Karışımda P'yi kendin seçemezsin, P = P<sub>doyma</sub>.","Sıkıştırılmış sıvıda v<sub>f</sub>'yi BASINCA göre değil SICAKLIĞA göre al (A-4).","v<sub>g</sub>'yi A-4 mü A-5 mi? T verildiyse A-4, P verildiyse A-5."],
  cevap:"Tablo yukarıda"
};
P.ss2 = {
  no:"SM-2", src:"ss", page:"4–6", title:"Hacmin 1/3'ü sıvı olan tank", tip:"karışım, hacim oranı", gen:"karisim",
  soru:`1.8 m³ sabit hacme sahip bir tank 220 °C'de sıvı ve buhar içermektedir. Hacmin 1/3'ü sıvı, kalan kısmı ise buhar fazındadır. Buna göre (a) buharın basıncını, (b) doymuş karışımın kuruluk derecesini ve (c) karışımın yoğunluğunu belirleyiniz.`,
  anla:[["sıvı ve buhar içermektedir","Sıvı ve buhar bir arada ve dengede → doymuş karışım. T = 220 °C olunca P = P<sub>doyma</sub>."],
        ["Hacmin 1/3'ü sıvı","HACİM oranı, kütle oranı değil. x kütle oranıdır; doğrudan 1/3 değil."],
        ["yoğunluk","ρ = m<sub>toplam</sub>/V<sub>toplam</sub>"]],
  tetik:["Karışımda fazlar ayrı ayrı: m<sub>f</sub> = V<sub>f</sub>/v<sub>f</sub>, m<sub>g</sub> = V<sub>g</sub>/v<sub>g</sub>.","x = m<sub>g</sub>/m<sub>toplam</sub>."],
  adim:[
    {q:"(a) Basınç?", a:`Karışım + T = 220 °C → A-4: P = P<sub>doyma</sub> = <b>2319.6 kPa</b>`},
    {q:"Sıvının ve buharın hacmi?", a:`V<sub>sıvı</sub> = 1.8/3 = 0.6 m³, V<sub>buhar</sub> = 1.2 m³`},
    {q:"Her fazın kütlesi? (220 °C: v<sub>f</sub> = 0.001190, v<sub>g</sub> = 0.086094)", a:`m<sub>f</sub> = 0.6/0.001190 = <b>504.2 kg</b><br>m<sub>g</sub> = 1.2/0.086094 = <b>13.94 kg</b><br>m<sub>t</sub> = 518.14 kg`},
    {q:"(b) x?", a:`x = m<sub>g</sub>/m<sub>t</sub> = 13.94/518.14 = <b>0.0269</b>`},
    {q:"(c) Yoğunluk?", a:`ρ = 518.14/1.8 = <b>287.9 kg/m³</b><br>Kontrol: v = v<sub>f</sub> + x(v<sub>g</sub>−v<sub>f</sub>) = 0.003474 m³/kg → 1/v = 287.9 ✓`}
  ],
  dia:{kind:"tv", isobars:[{T:220}], pts:[{v:0.003474,T:220,l:"hal"}]},
  kagit:["P = Psat@220 °C = 2319.6 kPa","Vf = 0.6, Vg = 1.2 m³","mf = 0.6/0.001190 = 504.2 kg; mg = 1.2/0.086094 = 13.94 kg","x = 13.94/518.14 = 0.0269","ρ = 518.14/1.8 = 287.9 kg/m³"],
  tuzak:["x = 1/3 ya da 2/3 yazmak: hacim oranı kütle oranı değildir. Sıvı çok yoğun olduğu için hacmin 1/3'ü bile kütlenin %97'si.","v<sub>f</sub> ve v<sub>g</sub>'yi karıştırmak."],
  cevap:"P = 2319.6 kPa, x = 0.0269, ρ ≈ 287.9 kg/m³"
};
P.ss3 = {
  no:"SM-3", src:"ss", page:6, title:"Pistonlu kapta kaynama sıcaklığı", tip:"piston + T_doyma", gen:"piston",
  soru:`Su, dik bir piston silindir düzeneğinde ısıtılmaktadır. Pistonun kütlesi 20 kg ve kesit alanı 100 cm²'dir. Yerel atmosfer basıncı 100 kPa olduğuna göre suyun hangi sıcaklıkta kaynamaya başlayacağını hesaplayınız.`,
  anla:[["kaynamaya başlayacağı","Doymuş sıvı hali (x = 0). Kaynama sıcaklığı = o basınçtaki T<sub>doyma</sub>."],
        ["pistonun kütlesi, alanı, atmosfer","Basınç doğrudan verilmemiş; kuvvet dengesinden bulunacak (ikinci yeğin özellik dolaylı)."]],
  tetik:["“hangi sıcaklıkta kaynar” → T<sub>doyma</sub>(P). Önce P lazım.","Piston serbestse P sabit = P<sub>atm</sub> + m<sub>p</sub>g/A."],
  adim:[
    {q:"Basınç?", a:`A = 100 cm² = 0.01 m²<br>P = P<sub>atm</sub> + m<sub>p</sub>g/A = 100000 + 20·9.81/0.01 = 119 620 Pa = <b>119.62 kPa</b>`},
    {q:"119.62 kPa tabloda yok. Ne yaparsın?", a:`A-5'te 100 kPa (99.61 °C) ile 125 kPa (105.97 °C) arasında <b>doğrusal interpolasyon</b>:<br>T = 99.61 + (119.62−100)/(125−100) × (105.97−99.61) = <b>104.6 °C</b>`}
  ],
  dia:{kind:"tv", isobars:[{T:104.6, lab:"119.6 kPa"}], pts:[{v:0.001047,T:104.6,l:"kaynama başlar (x=0)"}]},
  kagit:["P = Patm + mg/A = 100 + 20·9.81/0.01/1000 = 119.62 kPa","T = Tsat@119.62 kPa (A-5 interpolasyon) ≈ 104.6 °C"],
  tuzak:["cm² → m²: 100 cm² = 0.01 m² (10⁻⁴ ile çarp).","mg/A Pa çıkar; kPa'ya çevirmeden 100 ile toplama."],
  cevap:"T ≈ 104.6 °C"
};
P.ss4 = {
  no:"SM-4", src:"ss", page:"7–8", title:"Rijit kapta tamamen buharlaşma sıcaklığı", tip:"sabit v + interpolasyon", gen:"rijit",
  soru:`2.5 m³'lük sabit hacimli kapalı kapta, 75 °C sıcaklıkta 15 kg doymuş sıvı-buhar karışımı bulunmaktadır. Su yavaş yavaş ısıtılıyor. Kaptaki suyun tamamen buharlaştığı sıcaklığı hesaplayınız. Bu süreci T-v diyagramında doyma çizgilerini de dikkate alarak gösteriniz.`,
  anla:[["sabit hacimli kapalı kap","V sabit, m sabit → v = V/m sabit. Süreç T-v'de DİKEY çizgi."],
        ["tamamen buharlaştığı","2. hal doymuş buhar: x = 1, yani v<sub>2</sub> = v<sub>g</sub>."],
        ["75 °C","1. hali tanımlıyor ama soruyu çözmek için gerekmiyor (fazla bilgi)."]],
  tetik:["Rijit kap → v<sub>1</sub> = v<sub>2</sub>. Bu, 2. halin ikinci özelliğidir.","“tamamen buharlaştı” → v<sub>g</sub> = v; v<sub>g</sub> sütununda bu değeri ara."],
  adim:[
    {q:"v kaç?", a:`v = V/m = 2.5/15 = <b>0.1667 m³/kg</b> (süreç boyunca sabit)`},
    {q:"2. halde hangi bilgi var?", a:`x = 1 ve v = 0.1667 → v<sub>g</sub> = 0.1667 olan sıcaklık aranıyor.`},
    {q:"A-4'te v<sub>g</sub> = 0.1667 nerede?", a:`185 °C: v<sub>g</sub> = 0.17390; 190 °C: v<sub>g</sub> = 0.15636 → arada.`},
    {q:"İnterpolasyon.", a:`T = 185 + (0.17390 − 0.1667)/(0.17390 − 0.15636) × 5 = 185 + 2.05 = <b>187.05 °C</b>`}
  ],
  dia:{kind:"tv", path:[[0.1667,75],[0.1667,187.05]], pts:[{v:0.1667,T:75,l:"1"},{v:0.1667,T:187.05,l:"2"}]},
  kagit:["v1 = v2 = V/m = 2.5/15 = 0.1667 m³/kg","x2 = 1 → vg = 0.1667 → A-4: 185 °C (0.17390), 190 °C (0.15636)","T2 = 185 + (0.17390−0.1667)/(0.01754)·5 ≈ 187.05 °C"],
  tuzak:["İnterpolasyonda v<sub>g</sub> sıcaklık arttıkça AZALIR; oranı doğru kur.","Rijit kapta P sabit değildir; P de değişir."],
  cevap:"T₂ ≈ 187.05 °C"
};
P.ss5 = {
  no:"SM-5", src:"ss", page:"8–9", title:"Kapta sıcaklık, toplam entalpi, faz kütleleri", tip:"karışım, x, h", gen:"faz",
  soru:`0.15 m³'lük sabit hacimli bir kapta 2 kg kütlesinde 150 kPa basınçta su bulunmaktadır. Buna göre (a) sıcaklığını, (b) toplam entalpisini, (c) eğer karışımsa suyun her faz için kütlesini hesaplayınız.`,
  anla:[["0.15 m³, 2 kg","v = V/m: ikinci yeğin özellik."],["150 kPa","birinci yeğin özellik"],["toplam entalpi","H = m·h (kJ); h özgül (kJ/kg)."]],
  tetik:["P ve v var → A-5'te v<sub>f</sub>, v<sub>g</sub> ile karşılaştır.","Karışımsa: x bul, sonra y = y<sub>f</sub> + x·y<sub>fg</sub>."],
  adim:[
    {q:"v ve bölge?", a:`v = 0.15/2 = 0.075 m³/kg. A-5 (150 kPa): v<sub>f</sub> = 0.001053, v<sub>g</sub> = 1.1594 → <b>doymuş karışım</b>.`},
    {q:"(a) Sıcaklık?", a:`Karışım → T = T<sub>doyma</sub>@150 kPa = <b>111.35 °C</b>`},
    {q:"x?", a:`x = (v − v<sub>f</sub>)/(v<sub>g</sub> − v<sub>f</sub>) = (0.075 − 0.001053)/(1.1594 − 0.001053) = <b>0.06384</b>`},
    {q:"(b) h ve H? (h<sub>f</sub> = 467.13, h<sub>fg</sub> = 2226.0)", a:`h = 467.13 + 0.06384 × 2226.0 = <b>609.24 kJ/kg</b><br>H = m·h = 2 × 609.24 = <b>1218.5 kJ</b>`},
    {q:"(c) Faz kütleleri?", a:`m<sub>g</sub> = x·m = 0.06384 × 2 = <b>0.1277 kg</b>, m<sub>f</sub> = 2 − 0.1277 = <b>1.872 kg</b>`}
  ],
  dia:{kind:"tv", isobars:[{P:150}], pts:[{v:0.075,T:111.35,l:"hal"}]},
  kagit:["v = 0.15/2 = 0.075; vf<v<vg (150 kPa) → karışım","T = Tsat = 111.35 °C","x = (0.075−0.001053)/(1.1594−0.001053) = 0.06384","h = hf + x·hfg = 609.24 kJ/kg → H = 1218.5 kJ","mg = 0.1277 kg, mf = 1.872 kg"],
  tuzak:["h<sub>fg</sub> sütunu varken h<sub>g</sub> − h<sub>f</sub> hesaplamaya gerek yok; ikisi aynı.","Toplam istendiğinde m ile çarpmayı unutmak."],
  cevap:"T = 111.35 °C, H ≈ 1218.5 kJ, m_g ≈ 0.128 kg, m_f ≈ 1.872 kg"
};
P.ss6 = {
  no:"SM-6", src:"ss", page:"10–11", title:"Kızgın buharı rijit kapta soğutma", tip:"sabit v, kızgın → karışım", gen:"rijit",
  soru:`Kapalı kapta, 1.4 MPa basınç ve 250 °C sıcaklıktaki kızgın su buharı sabit hacimde sıcaklık 120 °C'ye düşünceye kadar bırakılıyor. Son durumda (a) basıncı, (b) eğer karışımsa kuruluk derecesini, (c) özgül entalpiyi hesaplayınız. Ayrıca bu hal değişimini T-v diyagramında doyma eğrilerini de dikkate alarak gösteriniz.`,
  anla:[["kapalı kap, sabit hacimde","v<sub>1</sub> = v<sub>2</sub>. 2. halin ikinci özelliği bu."],["1.4 MPa, 250 °C kızgın","1. hal tam belli → A-6'dan v<sub>1</sub>."],["120 °C'ye düşünceye","2. halin birinci özelliği T<sub>2</sub>."]],
  tetik:["Rijit kap sorusu = “v<sub>1</sub>'i bul, v<sub>2</sub> = v<sub>1</sub>, sonra 2. halde bölge bul”."],
  adim:[
    {q:"v<sub>1</sub>?", a:`A-6 (1.4 MPa, 250 °C): v<sub>1</sub> = <b>0.16356 m³/kg</b>`},
    {q:"2. hal bölgesi? (120 °C: v<sub>f</sub> = 0.001060, v<sub>g</sub> = 0.89133)", a:`v<sub>f</sub> &lt; 0.16356 &lt; v<sub>g</sub> → <b>doymuş karışım</b>`},
    {q:"(a) P<sub>2</sub>?", a:`P<sub>2</sub> = P<sub>doyma</sub>@120 °C = <b>198.67 kPa</b>`},
    {q:"(b) x<sub>2</sub>?", a:`x<sub>2</sub> = (0.16356 − 0.001060)/(0.89133 − 0.001060) = 0.16250/0.89027 = <b>0.1825</b><br><span class="dim">Hocanın çözümünde 0.1820 yazıyor; hesap 0.1825 veriyor. Fark küçük, yöntem aynı.</span>`},
    {q:"(c) h<sub>2</sub>? (h<sub>f</sub> = 503.81, h<sub>fg</sub> = 2202.1)", a:`h<sub>2</sub> = 503.81 + 0.1825 × 2202.1 = <b>905.7 kJ/kg</b> (çözümde 0.1820 ile 904.6)`}
  ],
  dia:{kind:"tv", isobars:[{P:1400},{T:120, lab:"198.67 kPa"}], path:[[0.16356,250],[0.16356,120]], pts:[{v:0.16356,T:250,l:"1"},{v:0.16356,T:120,l:"2"}]},
  kagit:["v1 = 0.16356 (A-6) = v2","120 °C: vf<v2<vg → karışım, P2 = 198.67 kPa","x2 = (0.16356−0.00106)/(0.89133−0.00106) ≈ 0.1825","h2 = 503.81 + 0.1825·2202.1 ≈ 905.7 kJ/kg"],
  tuzak:["Rijit kapta P sabit sanmak (1.4 MPa'da kalmaz).","1. hali A-5'ten okumak: kızgın buhar → A-6."],
  cevap:"P₂ = 198.67 kPa, x₂ ≈ 0.1825, h₂ ≈ 905.7 kJ/kg"
};
P.ss7 = {
  no:"SM-7", src:"ss", page:"12–13", title:"R-134a: basınç, iç enerji, sıvı hacmi", tip:"R-134a karışım", gen:"faz",
  soru:`0.5 m³'lük sabit hacimli bir kapta, −20 °C sıcaklıkta 10 kg soğutucu akışkan-134a (R-134a) bulunmaktadır. Buna göre (a) basıncı, (b) toplam iç enerjiyi ve (c) sıvı faz tarafından kaplanan hacmi hesaplayınız.`,
  anla:[["R-134a","Su tabloları değil: A-11 (T), A-12 (P), A-13 (kızgın)."],["0.5 m³, 10 kg, −20 °C","v ve T: iki bağımsız yeğin özellik."],["sıvı faz tarafından kaplanan hacim","V<sub>f</sub> = m<sub>f</sub>·v<sub>f</sub>"]],
  tetik:["Aynı iskelet, sadece tablo farklı.","toplam iç enerji → U = m·u, u = u<sub>f</sub> + x·u<sub>fg</sub>"],
  adim:[
    {q:"v ve bölge? (A-11, −20 °C: v<sub>f</sub> = 0.0007362, v<sub>g</sub> = 0.14729)", a:`v = 0.5/10 = 0.05 → v<sub>f</sub> &lt; v &lt; v<sub>g</sub> → <b>doymuş karışım</b>`},
    {q:"(a) P?", a:`P = P<sub>doyma</sub>@−20 °C = <b>132.82 kPa</b>`},
    {q:"x?", a:`x = (0.05 − 0.0007362)/(0.14729 − 0.0007362) = <b>0.3361</b>`},
    {q:"(b) U? (u<sub>f</sub> = 25.39, u<sub>fg</sub> = 193.45)", a:`u = 25.39 + 0.3361 × 193.45 = 90.41 kJ/kg → U = 10 × 90.41 = <b>904.1 kJ</b>`},
    {q:"(c) V<sub>f</sub>?", a:`m<sub>g</sub> = 0.3361 × 10 = 3.361 kg, m<sub>f</sub> = 6.639 kg<br>V<sub>f</sub> = m<sub>f</sub>·v<sub>f</sub> = 6.639 × 0.0007362 = <b>0.00489 m³</b>`}
  ],
  dia:{kind:"schem", title:"R-134a (şematik)", pts:[{r:"mix",x:0.34,l:"hal (−20 °C)"}], iso:[{lab:"132.82 kPa", y:0.38}]},
  kagit:["v = 0.05; −20 °C: vf<v<vg → karışım → P = 132.82 kPa","x = 0.3361","u = 25.39 + 0.3361·193.45 = 90.41 → U = 904.1 kJ","mf = 6.639 kg → Vf = 6.639·0.0007362 ≈ 0.00489 m³"],
  tuzak:["Su tablosuna bakmak.","V<sub>f</sub> için m<sub>f</sub> yerine m<sub>toplam</sub> kullanmak."],
  cevap:"P = 132.82 kPa, U ≈ 904.1 kJ, V_f ≈ 0.00489 m³"
};
P.ss8 = {
  no:"SM-8", src:"ss", page:"13–15", title:"Sabit basınçta tümüyle buharlaştırma", tip:"sabit P, ΔH", gen:"pistonsu",
  soru:`Bir piston silindir düzeneğinde başlangıçta 50 L sıvı su 40 °C sıcaklık ve 200 kPa basınçta bulunmaktadır. Daha sonra su, sabit basınçta tümüyle buharlaşana kadar ısıtılmaktadır. (a) Suyun kütlesi nedir? (b) Suyun son sıcaklığını hesaplayınız. (c) Toplam entalpi değişimini hesaplayınız. (d) Faz değişim sürecini T-v diyagramında doyma çizgilerini de dikkate alarak gösteriniz.`,
  anla:[["sıvı su 40 °C, 200 kPa","P<sub>doyma</sub>@40 °C = 7.385 kPa &lt; 200 → sıkıştırılmış sıvı. “sıvı” kelimesi fazla bilgi; yine de kontrol et."],
        ["sabit basınçta tümüyle buharlaşana","2. hal: P<sub>2</sub> = 200 kPa, x<sub>2</sub> = 1."]],
  tetik:["Sıkıştırılmış sıvıda özellik ≈ aynı T'deki doymuş sıvı: v ≈ v<sub>f</sub>@T, h ≈ h<sub>f</sub>@T.","Toplam entalpi değişimi: ΔH = m(h<sub>2</sub> − h<sub>1</sub>)."],
  adim:[
    {q:"(a) v<sub>1</sub> ve m?", a:`v<sub>1</sub> ≈ v<sub>f</sub>@40 °C = 0.001008 m³/kg, h<sub>1</sub> ≈ h<sub>f</sub>@40 °C = 167.53 kJ/kg<br>V = 50 L = 0.05 m³ → m = 0.05/0.001008 = <b>49.60 kg</b>`},
    {q:"(b) T<sub>2</sub>?", a:`x<sub>2</sub> = 1, P = 200 kPa → T<sub>2</sub> = T<sub>doyma</sub> = <b>120.21 °C</b>`},
    {q:"(c) ΔH? (h<sub>g</sub>@200 kPa = 2706.3)", a:`Δh = 2706.3 − 167.53 = 2538.77 kJ/kg<br>ΔH = 49.60 × 2538.77 ≈ <b>125 930 kJ</b> (çözümde m = 49.61 ile 125 948 kJ)`}
  ],
  dia:{kind:"tv", isobars:[{P:200}], path:[[0.001008,40],[0.001061,120.21],[0.88578,120.21]], pts:[{v:0.001008,T:40,l:"1"},{v:0.88578,T:120.21,l:"2"}]},
  kagit:["Psat@40 °C = 7.385 < 200 → sıkıştırılmış sıvı; v1 ≈ vf@40 = 0.001008, h1 ≈ 167.53","m = 0.05/0.001008 = 49.6 kg","T2 = Tsat@200 kPa = 120.21 °C","ΔH = m(hg − h1) = 49.6·2538.77 ≈ 125 930 kJ"],
  tuzak:["L → m³: 50 L = 0.05 m³.","h<sub>1</sub>'i 200 kPa'nın h<sub>f</sub>'sinden almak: sıkıştırılmış sıvıda SICAKLIĞA göre al."],
  cevap:"m ≈ 49.6 kg, T₂ = 120.21 °C, ΔH ≈ 125 930 kJ"
};
P.ss9 = {
  no:"SM-9", src:"ss", page:"17–19", title:"Kızgın buhar soğuyor, piston engele oturuyor (PDF'te 3. soru)", tip:"P sabit → v sabit", gen:"engel",
  soru:`Bir piston silindir düzeneğinde ilk başta 3.5 MPa basınçta 5 °C kızdırılmış buhar bulunmaktadır. Buhar çevresine ısı vermeye başladığında piston aşağı doğru hareket ederek, silindirin doymuş sıvı su içerdiği noktada silindirde bulunan engele çarpıyor. Soğuma, silindirde 200 °C sıcaklıkta su oluşuncaya kadar devam ediyor. Buna göre (a) ilk sıcaklığı, (b) piston engele çarpmadan önce buharın birim kütlesi başına düşen entalpi değişimini (Δh), (c) son basıncı ve kuruluk derecesini (eğer karışımsa) hesaplayınız.`,
  anla:[["5 °C kızdırılmış buhar","T<sub>1</sub> doyma sıcaklığının 5 °C ÜSTÜNDE: T<sub>1</sub> = T<sub>doyma</sub> + 5."],
        ["piston … doymuş sıvı … engele çarpıyor","1→2: P sabit (piston serbest). 2. hal: P = 3.5 MPa, x = 0."],
        ["Soğuma … 200 °C","2→3: piston engelde → V sabit → v<sub>3</sub> = v<sub>2</sub>."]],
  tetik:["Süreç iki parçaysa her parçada neyin sabit olduğunu ayrı yaz: önce P sabit, sonra v sabit.","“kızdırılmış ΔT” → T = T<sub>doyma</sub> + ΔT."],
  adim:[
    {q:"(a) T<sub>1</sub>?", a:`A-5 (3.5 MPa): T<sub>doyma</sub> = 242.56 °C → T<sub>1</sub> = <b>247.56 °C</b> (çözümde 242.6+5 = 247.6)`},
    {q:"h<sub>1</sub>?", a:`A-6, 3.5 MPa'da doymuş (242.56 °C) ile 250 °C arasında interpolasyon: h<sub>1</sub> ≈ <b>2821.1 kJ/kg</b>`},
    {q:"2. hal ve (b) Δh?", a:`x<sub>2</sub> = 0, P = 3.5 MPa → h<sub>2</sub> = h<sub>f</sub> = 1049.7, v<sub>2</sub> = v<sub>f</sub> = 0.001235<br>Δh = 1049.7 − 2821.1 = <b>−1771.4 kJ/kg</b> (eksi: ısı veriyor)`},
    {q:"3. halde hangi iki özellik?", a:`v<sub>3</sub> = v<sub>2</sub> = 0.001235 (piston engelde) ve T<sub>3</sub> = 200 °C`},
    {q:"(c) Bölge, P<sub>3</sub>, x<sub>3</sub>? (200 °C: v<sub>f</sub> = 0.001157, v<sub>g</sub> = 0.12721)", a:`v<sub>f</sub> &lt; 0.001235 &lt; v<sub>g</sub> → karışım → P<sub>3</sub> = P<sub>doyma</sub>@200 °C = <b>1554.9 kPa</b><br>x<sub>3</sub> = (0.001235 − 0.001157)/(0.12721 − 0.001157) ≈ <b>0.0006</b>`}
  ],
  dia:{kind:"tv", isobars:[{P:3500},{T:200, lab:"1554.9 kPa"}], path:[[0.0587,247.56],[0.057061,242.56],[0.001235,242.56],[0.001235,200]], pts:[{v:0.0587,T:247.56,l:"1"},{v:0.001235,T:242.56,l:"2"},{v:0.001235,T:200,l:"3"}]},
  kagit:["T1 = 242.56 + 5 = 247.56 °C; h1 ≈ 2821.1 (A-6 interp.)","2: x=0, 3.5 MPa → hf = 1049.7, vf = 0.001235","Δh = 1049.7 − 2821.1 = −1771.4 kJ/kg","3: v3 = 0.001235, T3 = 200 → karışım, P3 = 1554.9 kPa, x3 ≈ 0.0006"],
  tuzak:["“5 °C kızdırılmış”ı T<sub>1</sub> = 5 °C sanmak.","2→3'te P'yi sabit sanmak; piston engelde olduğu için artık V sabit."],
  cevap:"T₁ ≈ 247.6 °C, Δh ≈ −1771.4 kJ/kg, P₃ = 1554.9 kPa, x₃ ≈ 0.0006"
};
P.ig1 = {
  no:"MG-1", src:"ss", page:"15–16", title:"Lastiğe eklenecek hava", tip:"PV = mRT", gen:"ideal",
  soru:`Hacmi 0.015 m³ olan bir otomobil lastiğindeki havanın sıcaklığı 32 °C ve basıncı 140 kPa'dır. Lastik basıncını, önerilen değer olan 210 kPa'a yükseltmek için gerekli olan havanın kütlesini bulunuz. Atmosfer basıncının 100 kPa olduğunu, sıcaklık ve hacmin sabit kaldığını kabul ediniz.`,
  anla:[["Lastik basıncı 140, 210 kPa","Lastik basıncı ölçerle okunur → GÖSTERGE basıncı. Mutlaka çevir: +100."],["eklenecek havanın kütlesi","Δm = m<sub>2</sub> − m<sub>1</sub>"],["sıcaklık ve hacim sabit","T = 305 K, V = 0.015 m³ her iki halde."]],
  tetik:["Hava (veya N₂, O₂, He…) + oda koşulları → mükemmel gaz: PV = mRT.","PV = mRT'de P mutlak, T Kelvin."],
  adim:[
    {q:"Mutlak basınçlar?", a:`P<sub>1</sub> = 140 + 100 = <b>240 kPa</b>, P<sub>2</sub> = 210 + 100 = <b>310 kPa</b>`},
    {q:"m<sub>1</sub>? (R = 0.287 kJ/kg·K)", a:`m<sub>1</sub> = P<sub>1</sub>V/(RT) = 240 × 0.015/(0.287 × 305) = <b>0.04113 kg</b>`},
    {q:"m<sub>2</sub> ve Δm?", a:`m<sub>2</sub> = 310 × 0.015/(0.287 × 305) = 0.05312 kg → Δm = <b>0.0120 kg</b>`}
  ],
  kagit:["P1 = 240, P2 = 310 kPa (mutlak)","m1 = 240·0.015/(0.287·305) = 0.04113 kg","m2 = 0.05312 kg → Δm ≈ 0.012 kg"],
  tuzak:["Gösterge basıncını doğrudan kullanmak.","°C ile hesap: T mutlaka K.","Birim: kPa·m³/(kJ/kg·K · K) = kg. (Çözümde Pa ve 287 J/kg·K kullanılmış; ikisi tutarlıysa sonuç aynı.)"],
  cevap:"Δm ≈ 0.012 kg"
};
P.ig2 = {
  no:"MG-2", src:"ss", page:"16–17", title:"İki tank birleşiyor: son basınç", tip:"PV = mRT, karışım", gen:"ideal",
  soru:`İçinde 25 °C sıcaklıkta ve 500 kPa basınçta hava bulunan 1 m³ hacmindeki kapalı bir kapla (A), içinde 35 °C sıcaklıkta ve 200 kPa basınçta 5 kg hava bulunan başka bir kapalı kap (B), üzerinde vana bulunan bir boruyla birleştirilmiştir. Vana başlangıçta kapalıdır. Daha sonra vana açılmakta ve sistem hem kendi içinde mekanik dengeye hem de 20 °C sıcaklıktaki çevreyle ısıl dengeye gelmektedir. İkinci kabın hacmini ve son halde havanın basıncını hesaplayınız.`,
  anla:[["vana açılıyor","A + B tek sistem olur: V = V<sub>A</sub> + V<sub>B</sub>, m = m<sub>A</sub> + m<sub>B</sub>."],["mekanik denge","Son halde her yerde aynı P."],["20 °C çevreyle ısıl denge","T<sub>son</sub> = 293 K."]],
  tetik:["Bilinmeyeni olan her tank için ayrı PV = mRT; sonra birleşik sistem için bir tane daha."],
  adim:[
    {q:"V<sub>B</sub>?", a:`V<sub>B</sub> = m<sub>B</sub>RT<sub>B</sub>/P<sub>B</sub> = 5 × 0.287 × 308/200 = <b>2.21 m³</b>`},
    {q:"m<sub>A</sub>?", a:`m<sub>A</sub> = P<sub>A</sub>V<sub>A</sub>/(RT<sub>A</sub>) = 500 × 1/(0.287 × 298) = <b>5.846 kg</b>`},
    {q:"Son hal?", a:`V = 1 + 2.21 = 3.21 m³, m = 10.846 kg, T = 293 K<br>P<sub>2</sub> = mRT/V = 10.846 × 0.287 × 293/3.21 ≈ <b>284.1 kPa</b>`}
  ],
  kagit:["VB = 5·0.287·308/200 = 2.21 m³","mA = 500·1/(0.287·298) = 5.846 kg","P2 = 10.846·0.287·293/3.21 ≈ 284.1 kPa"],
  tuzak:["Son halde T<sub>A</sub> ya da T<sub>B</sub> kullanmak: çevre sıcaklığı 20 °C.","Basınçların ortalamasını almak (yanlış)."],
  cevap:"V_B ≈ 2.21 m³, P₂ ≈ 284.1 kPa"
};

/* ───────────── İŞ VE ISI ───────────── */
P.is1 = {
  no:"İŞ-1", src:"is", page:"1–3", title:"Su + sonradan değen yay", tip:"sınır işi, yay, tablo", gen:"yaysu",
  soru:`Bir piston silindir düzeneğinde başlangıçta 250 kPa basınç ve 25 °C sıcaklıkta 50 kg su bulunmaktadır. Pistonun kesit alanı 0.1 m²'dir. Daha sonra suya ısı geçişi olmakta, suyun bir bölümü buharlaşarak genişlemektedir. Hacim 0.2 m³ olduğu zaman piston yay sabiti 100 kN/m olan doğrusal bir yaya dokunmaktadır. Isı geçişi ve genişleme, piston 20 cm daha yükselinceye kadar devam etmektedir. a) Son haldeki basıncı bulunuz. b) Hal değişimini P-v diyagramında gösteriniz. c) Hal değişimi sırasında yapılan işi hesaplayınız.`,
  anla:[["Hacim 0.2 m³ olduğu zaman … yaya dokunmaktadır","1→2: yay yok, piston serbest → P sabit = 250 kPa. 2. halde V<sub>2</sub> = 0.2 m³."],
        ["20 cm daha yükselinceye","2→3: yay x = 0.2 m sıkışır. V<sub>3</sub> = V<sub>2</sub> + x·A. Basınç yay kuvveti kadar artar."],
        ["suyun bir bölümü buharlaşarak","2. ve 3. haller karışım bölgesinde olabilir; kontrol et."]],
  tetik:["İş = P-V altındaki alan. Önce her halin (P, V) noktasını bul, sonra yolu çiz, alanı topla.","Yaya değince: P<sub>3</sub> = P<sub>2</sub> + kx/A (pistonun kuvvet dengesi)."],
  adim:[
    {q:"(a) 3. halde pistonun kuvvet dengesi?", a:`P<sub>3</sub>A = P<sub>2</sub>A + kx → P<sub>3</sub> = 250 + 100 × 0.2/0.1 = <b>450 kPa</b>`},
    {q:"V<sub>1</sub>? (25 °C, 250 kPa)", a:`P<sub>doyma</sub>@25 °C = 3.17 kPa &lt; 250 → sıkıştırılmış sıvı → v<sub>1</sub> ≈ v<sub>f</sub>@25 °C = 0.001003<br>V<sub>1</sub> = 50 × 0.001003 = <b>0.05 m³</b>`},
    {q:"V<sub>3</sub>?", a:`V<sub>3</sub> = 0.2 + 0.2 × 0.1 = <b>0.22 m³</b> → v<sub>3</sub> = 0.22/50 = 0.0044 m³/kg`},
    {q:"3. hal bölgesi ve T<sub>3</sub>? (450 kPa: v<sub>f</sub> = 0.001088, v<sub>g</sub> = 0.41392)", a:`v<sub>f</sub> &lt; 0.0044 &lt; v<sub>g</sub> → karışım → T<sub>3</sub> = T<sub>doyma</sub>@450 kPa = <b>147.90 °C</b>`},
    {q:"(c) İş = alan. Parçala.", a:`W<sub>12</sub> = P(V<sub>2</sub> − V<sub>1</sub>) = 250 × (0.2 − 0.05) = 37.5 kJ (dikdörtgen)<br>W<sub>23</sub> = (P<sub>2</sub>+P<sub>3</sub>)/2 × (V<sub>3</sub> − V<sub>2</sub>) = 350 × 0.02 = 7 kJ (yamuk)<br>W<sub>13</sub> = <b>44.5 kJ</b>`}
  ],
  dia:{kind:"pv", pts:[[0.05,250,"1"],[0.2,250,"2"],[0.22,450,"3"]], areas:[["37.5 kJ",0,1],["7 kJ",1,2]]},
  kagit:["P3 = P2 + kx/A = 250 + 100·0.2/0.1 = 450 kPa","V1 = m·vf@25 = 50·0.001003 ≈ 0.05 m³; V3 = 0.2 + 0.2·0.1 = 0.22 m³","v3 = 0.0044 → karışım (450 kPa) → T3 = 147.9 °C","W = 250(0.15) + (250+450)/2·(0.02) = 37.5 + 7 = 44.5 kJ"],
  tuzak:["Yay kuvvetini N ile kPa'ya karıştırmak: k kN/m, x m → kN; ÷A (m²) → kPa ✓.","Yay işinin sadece ½kx² olduğunu sanmak: toplam işte atmosfer/sabit basınç kısmı (alt dikdörtgen) da var.","V<sub>3</sub>'te x·A eklemeyi unutmak."],
  cevap:"P₃ = 450 kPa, W ≈ 44.5 kJ"
};
P.is2 = {
  no:"İŞ-2", src:"is", page:"3–5", title:"Gaz + baştan değen yay", tip:"yay işi, yamuk alan", gen:"yaygaz",
  soru:`Bir piston silindir düzeneğinde başlangıçta 200 kPa basınç ve 0.05 m³ hacminde bir gaz bulunmaktadır. Sistem bu halde iken katsayısı 150 kN/m olan bir doğrusal yay pistona dokunmakta, fakat piston üzerinde herhangi bir kuvvet uygulamamaktadır. Daha sonra gaza ısı geçişi olmakta ve piston yayı sıkıştırarak gazın hacmi başlangıçtakinin iki katı olana kadar yükselmektedir. Pistonun kesit alanı 0.25 m²'dir. a) Son halde silindir içindeki basıncı, b) Gaz tarafından yapılan toplam işi, c) Toplam işin ne kadarlık bölümünün yayı sıkıştırmak için yapıldığını hesaplayınız.`,
  anla:[["yay pistona dokunmakta, fakat … kuvvet uygulamamaktadır","Başta yay serbest uzunlukta: x<sub>1</sub> = 0. Basınç 200 kPa'dan hemen artmaya başlar."],
        ["hacmi başlangıçtakinin iki katı","V<sub>2</sub> = 0.1 m³"],["toplam işin ne kadarlık bölümü yay","W<sub>yay</sub> = ½k(x<sub>2</sub>² − x<sub>1</sub>²) = üçgen alan."]],
  tetik:["Doğrusal yay → P-V'de düz çizgi → alan = yamuk = (P<sub>1</sub>+P<sub>2</sub>)/2 × ΔV.","x = ΔV/A"],
  adim:[
    {q:"V<sub>2</sub> ve yer değiştirme x?", a:`V<sub>2</sub> = 0.1 m³, x = ΔV/A = 0.05/0.25 = <b>0.2 m</b>`},
    {q:"Yay kuvveti ve yayın eklediği basınç?", a:`F = kx = 150 × 0.2 = 30 kN → P<sub>yay</sub> = F/A = 30/0.25 = 120 kPa`},
    {q:"(a) P<sub>2</sub>?", a:`P<sub>2</sub> = 200 + 120 = <b>320 kPa</b>`},
    {q:"(b) Toplam iş?", a:`W = (200 + 320)/2 × (0.1 − 0.05) = <b>13 kJ</b>`},
    {q:"(c) Yay işi?", a:`W<sub>yay</sub> = ½(320 − 200)(0.05) = <b>3 kJ</b> = ½k x² = ½ × 150 × 0.2² ✓<br>Geri kalan 10 kJ, 200 kPa'lık sabit kısmın (dikdörtgen) işi.`}
  ],
  dia:{kind:"pv", pts:[[0.05,200,"1"],[0.1,320,"2"]], areas:[["13 kJ",0,1]], split:200, splitLab:["10 kJ","yay 3 kJ"]},
  kagit:["V2 = 0.1, x = 0.05/0.25 = 0.2 m","F = kx = 30 kN → ΔP = 120 kPa → P2 = 320 kPa","W = (200+320)/2·0.05 = 13 kJ","W_yay = ½·150·0.2² = 3 kJ"],
  tuzak:["Toplam işi ½kx² sanmak (3 kJ değil 13 kJ).","x'i ΔV/A yerine ΔV olarak almak."],
  cevap:"P₂ = 320 kPa, W = 13 kJ, W_yay = 3 kJ"
};
P.is3 = {
  no:"İŞ-3", src:"is", page:"6–7", title:"R-134a sabit basınçta ısıtma işi", tip:"W = mP(v₂−v₁)", gen:"pistonsu",
  soru:`Sürtünmesiz bir piston silindir düzeneğinde başlangıçta doymuş sıvı halinde 200 L soğutucu akışkan-134a bulunmaktadır. Piston serbest hareket edebilmektedir ve kütlesi soğutucu akışkan üzerinde 900 kPa basınç olmasını sağlayacak büyüklüktedir. Soğutucu akışkan daha sonra 70 °C sıcaklığa ısıtılmaktadır. Hal değişimi sırasında yapılan işi hesaplayınız.`,
  anla:[["Piston serbest … 900 kPa","P sabit = 900 kPa (P<sub>1</sub> = P<sub>2</sub>)."],["doymuş sıvı","1. hal: x = 0 → v<sub>1</sub> = v<sub>f</sub>@900 kPa."],["70 °C'ye ısıtılıyor","2. hal: P = 900, T = 70 → bölgeyi bul."]],
  tetik:["Sabit basınç sınır işi: W = P(V<sub>2</sub> − V<sub>1</sub>) = mP(v<sub>2</sub> − v<sub>1</sub>)."],
  adim:[
    {q:"1. hal: v<sub>1</sub> ve m? (A-12, 900 kPa: v<sub>f</sub> = 0.0008580)", a:`m = V/v<sub>1</sub> = 0.2/0.0008580 = <b>233.1 kg</b>`},
    {q:"2. hal bölgesi?", a:`T<sub>doyma</sub>@900 kPa = 35.51 °C &lt; 70 → <b>kızgın buhar</b> (ya da P<sub>doyma</sub>@70 °C = 2118.2 kPa &gt; 900)<br>A-13 (0.9 MPa, 70 °C): v<sub>2</sub> = <b>0.027413 m³/kg</b>`},
    {q:"İş?", a:`W = mP(v<sub>2</sub> − v<sub>1</sub>) = 233.1 × 900 × (0.027413 − 0.000858) = <b>5571 kJ</b><br>Pozitif → iş sistem tarafından yapılıyor (genişleme).`}
  ],
  dia:{kind:"pv", pts:[[0.2,900,"1"],[6.39,900,"2"]], areas:[["5571 kJ",0,1]]},
  kagit:["P sabit = 900 kPa; v1 = vf = 0.0008580 → m = 233.1 kg","Tsat@900 = 35.51 < 70 → kızgın, A-13: v2 = 0.027413","W = mP(v2 − v1) = 233.1·900·0.026555 ≈ 5571 kJ"],
  tuzak:["kPa·m³ = kJ; MPa kullanırsan 1000 ile çarp.","Kızgın R-134a için A-13'e bakmak gerekir (su tablosu değil)."],
  cevap:"W ≈ 5571 kJ"
};
