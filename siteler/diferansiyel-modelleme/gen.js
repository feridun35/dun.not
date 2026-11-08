/* Alıştırma: her seferinde yeni cümle → doğru denklemi seç. Her yanlış şıkkın neden yanlış olduğu yazılı. */
'use strict';
const rint = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
const pick = a => a[Math.floor(Math.random() * a.length)];
const num = x => String(x).replace('.', '{,}');

const GEN = [
  /* büyüme */
  () => {
    const c = pick([
      ['Bir kasabanın nüfusu', 'mevcut nüfusla', 'N', 'yıl'],
      ['Bir bankadaki para sürekli faizle', 'hesaptaki parayla', 'P', 'yıl'],
      ['Bir küf kolonisinin kütlesi', 'o anki kütlesiyle', 'M', 'gün'],
      ['Bir videoyu izleyenlerin sayısı', 'izlemiş olanların sayısıyla', 'I', 'saat']
    ]);
    const n = rint(2, 4), d = rint(5, 12);
    return {
      kalip: 'buyume', soru: `${c[0]}, ${c[1]} orantılı olarak artıyor. ${d} ${c[3]}da ${n} katına çıkıyor. Denklem ve koşul hangisi?`,
      dogru: R`$\frac{d${c[2]}}{dt}=k\,${c[2]}$, $\ ${c[2]}(${d})=${n}\,${c[2]}(0)$`,
      yanlis: [
        [R`$\frac{d${c[2]}}{dt}=-k\,${c[2]}$, $\ ${c[2]}(${d})=${n}\,${c[2]}(0)$`, 'Artıyor: işaret artı olmalı.'],
        [R`$\frac{d${c[2]}}{dt}=k$, $\ ${c[2]}(${d})=${n}\,${c[2]}(0)$`, 'Bu sabit hız (her zaman aynı artış). "Miktarla orantılı" demek hızın içinde miktar olması demek.'],
        [R`$\frac{d${c[2]}}{dt}=k\,${c[2]}$, $\ ${c[2]}(${n})=${d}\,${c[2]}(0)$`, 'Zaman ile kat yer değiştirmiş: parantez içine zaman yazılır.']
      ],
      not: 'Büyüme kalıbı: hız ∝ miktar, artı işaret. Koşulda parantez içi zamandır.'
    };
  },
  /* bozunma */
  () => {
    const c = pick([
      ['Kandaki ilaç miktarı', 'kandaki ilaç miktarıyla orantılı hızla atılıyor', 'A'],
      ['Bir şarjsız pilin depoladığı enerji', 'kalan enerjiyle orantılı olarak azalıyor', 'E'],
      ['Bir radyoaktif izotop', 'kalan miktarıyla orantılı hızla bozunuyor', 'y']
    ]);
    const p = pick([10, 20, 25, 40]);
    return {
      kalip: 'bozunma', soru: `${c[0]}, ${c[1]}. 1 saatte %${p}'i gidiyor. Hangi kurulum doğru?`,
      dogru: R`$\frac{d${c[2]}}{dt}=-k\,${c[2]}$, $\ ${c[2]}(1)=${num((100 - p) / 100)}\,${c[2]}(0)$`,
      yanlis: [
        [R`$\frac{d${c[2]}}{dt}=-k\,${c[2]}$, $\ ${c[2]}(1)=${num(p / 100)}\,${c[2]}(0)$`, `%${p}'i GİDİYOR, kalan %${100 - p}.`],
        [R`$\frac{d${c[2]}}{dt}=-k$, $\ ${c[2]}(1)=${num((100 - p) / 100)}\,${c[2]}(0)$`, 'Hız sabit olmaz; kalan azaldıkça giden de azalır.'],
        [R`$\frac{d${c[2]}}{dt}=k\,t$, $\ ${c[2]}(1)=${num((100 - p) / 100)}\,${c[2]}(0)$`, 'Hız zamanla değil, kalan miktarla orantılı.']
      ],
      not: '"Kalan miktarla orantılı azalıyor" → −k·y. "%p gidiyor" → kalan (1 − p/100).'
    };
  },
  /* Newton: soğuma ya da ısınma */
  () => {
    const heat = Math.random() < 0.5;
    const c = heat ? pick([['Buzdolabından 4 °C\'de çıkan içecek', 4, rint(20, 30), 'odada ısınıyor']]) : pick([['Fırından 180 °C\'de çıkan kek', 180, rint(18, 25), 'mutfakta soğuyor'], ['90 °C\'lik çorba', 90, rint(18, 25), 'odada soğuyor'], ['70 °C\'lik demir parça', 70, rint(10, 25), 'atölyede soğuyor']]);
    const Ta = c[2];
    return {
      kalip: 'newton', soru: `${c[0]}, ${Ta} °C\'lik ${c[3]}. Sıcaklık değişim hızı, sıcaklık farkıyla orantılı. Denklem?`,
      dogru: R`$\frac{dT}{dt}=-k\,(T-${Ta})$, $\ T(0)=${c[1]}$`,
      yanlis: [
        [R`$\frac{dT}{dt}=-k\,T$, $\ T(0)=${c[1]}$`, `Ortam unutulmuş; bu denklem 0 °C\'ye götürür, ${Ta} °C\'de durmalı.`],
        [R`$\frac{dT}{dt}=-k\,(T-${c[1]})$, $\ T(0)=${Ta}$`, 'Ortam ile başlangıç yer değiştirmiş.'],
        [R`$\frac{dT}{dt}=k\,(T-${Ta})$, $k>0$`, heat ? 'Isınmada da önce eksi: T < ortam iken parantez eksi, eksi·eksi = artı, kendiliğinden ısınır.' : 'Soğuyor: T > ortam iken hız eksi olmalı.']
      ],
      not: heat ? 'Isınma da aynı denklem: −k(T − T_ortam). İşareti parantez halleder.' : 'Hız sıcaklıkla değil farkla orantılı.'
    };
  },
  /* lojistik */
  () => {
    const c = pick([
      [1000, 'Bir okulda 1000 öğrenci var. Bir söylenti, söylentiyi duyan ve henüz duymayan öğrenci sayısıyla orantılı hızla yayılıyor.', 'S', 'duyan'],
      [5000, 'Bir kasabada 5000 kişi var. Grip, hasta olanlar ve henüz hastalanmamış olanlarla orantılı hızla yayılıyor.', 'H', 'hasta'],
      [800, 'Bir göl en fazla 800 balık besleyebiliyor. Balık sayısı, balık sayısı ve kalan kapasiteyle orantılı değişiyor.', 'B', 'balık']
    ]);
    const K = c[0], v = c[2];
    return {
      kalip: 'lojistik', soru: c[1] + ` $${v}$: ${c[3]} sayısı. Denklem?`,
      dogru: R`$\frac{d${v}}{dt}=k\,${v}\,(${K}-${v})$`,
      yanlis: [
        [R`$\frac{d${v}}{dt}=k\,${v}$`, 'Sınır unutulmuş; sonsuza gider.'],
        [R`$\frac{d${v}}{dt}=k\,(${K}-${v})$`, `Sadece kalanla orantılı olur; "${c[3]}" sayısı da çarpılmalı.`],
        [R`$\frac{d${v}}{dt}=k\,\frac{${v}}{${K}-${v}}$`, 'İkisiyle de DOĞRU orantı: bölme değil çarpma.']
      ],
      not: 'İki şeyle orantı → çarpım. "Henüz olmayan" = toplam − olan.'
    };
  },
  /* karışım */
  () => {
    const V0 = pick([40, 60, 100, 200]), a = rint(2, 6), b = rint(1, 6), c = rint(2, 4), x0 = pick([0, 5, 20]);
    const dV = a - b, V = dV === 0 ? `${V0}` : `${V0}${dV > 0 ? '+' : '-'}${Math.abs(dV)}t`;
    return {
      kalip: 'karisim', soru: `${V0} L'lik tankta ${x0 ? x0 + ' g tuz' : 'saf su'} var. Litresinde ${c} g tuz olan su ${a} L/sn ile giriyor, karışım homojen tutulup ${b} L/sn ile çıkıyor. $x(t)$: tanktaki tuz. Denklem?`,
      dogru: R`$\frac{dx}{dt}=${a * c}-\frac{${b}x}{${V}}$, $\ x(0)=${x0}$`,
      yanlis: [
        dV === 0
          ? [R`$\frac{dx}{dt}=${a * c}-\frac{${b}x}{${V0}+${a}t}$, $\ x(0)=${x0}$`, `Su çıkıyor da: giren ${a} = çıkan ${b}, hacim sabit ${V0} L.`]
          : [R`$\frac{dx}{dt}=${a * c}-\frac{${b}x}{${V0}}$, $\ x(0)=${x0}$`, `Hacim değişiyor: her saniye ${dV > 0 ? dV + ' L artıyor' : -dV + ' L azalıyor'}.`],
        [R`$\frac{dx}{dt}=${a * c}-${b}x$, $\ x(0)=${x0}$`, 'Çıkan tuz = debi × derişim; derişim x/V, x değil.'],
        [R`$\frac{dx}{dt}=${a}-\frac{${b}x}{${V}}$, $\ x(0)=${x0}$`, 'Giren tuz = debi × derişim = ' + a + '·' + c + ' g/sn.']
      ],
      not: 'giren g/sn = debi · derişim; çıkan g/sn = debi · x/V(t); V(t) = V₀ + (giren − çıkan) t.',
      same: dV === 0
    };
  },
  /* kuvvet */
  () => {
    const sq = Math.random() < 0.5;
    return {
      kalip: 'kuvvet', soru: `Kütlesi $m$ olan paraşütçü düşüyor. Hava direnci hızın ${sq ? 'karesiyle' : 'kendisiyle'} orantılı. $v$: aşağı yönlü hız. Denklem?`,
      dogru: sq ? R`$m\frac{dv}{dt}=mg-kv^2$` : R`$m\frac{dv}{dt}=mg-kv$`,
      yanlis: [
        [sq ? R`$m\frac{dv}{dt}=mg+kv^2$` : R`$m\frac{dv}{dt}=mg+kv$`, 'Direnç harekete ters: eksi.'],
        [sq ? R`$m\frac{dv}{dt}=mg-kv$` : R`$m\frac{dv}{dt}=mg-kv^2$`, sq ? '"Karesiyle" dendi: v².' : '"Kendisiyle" dendi: v, kare değil.'],
        [R`$m\frac{dv}{dt}=-kv$`, 'Ağırlık unutulmuş.']
      ],
      not: 'F_net = m·dv/dt; aşağı +, yukarı (direnç) −.'
    };
  },
  /* oran cümlesi */
  () => {
    const c = pick([
      ['$y$\'nin $x$\'e göre değişim oranı, $x$ ile doğru, $y$ ile ters orantılı.', R`$\frac{dy}{dx}=k\,\frac xy$`, R`$\frac{dy}{dx}=k\,\frac yx$`, R`$\frac{dy}{dx}=k\,xy$`],
      ['$y$\'deki değişmenin $x$\'e oranı, $x$ ve $y$\'nin toplamıyla doğru, $x$\'in karesiyle ters orantılı.', R`$\frac{dy}{dx}=k\,\frac{x+y}{x^2}$`, R`$\frac{dy}{dx}=k\,\frac{x^2}{x+y}$`, R`$\frac{dy}{dx}=k\,(x+y)\,x^2$`],
      ['Bir eğrinin her noktadaki eğimi, o noktanın koordinatlarının çarpımına eşit.', R`$\frac{dy}{dx}=xy$`, R`$\frac{dy}{dx}=x+y$`, R`$\frac{dy}{dx}=k\,\frac xy$`]
    ]);
    return {
      kalip: 'oran', soru: c[0] + ' Denklem?', dogru: c[1],
      yanlis: [[c[2], 'Doğru/ters yer değiştirmiş: doğru olan paya, ters olan paydaya.'], [c[3], c[0].includes('eşit') ? 'Eşit dendi: çarpım xy, sabit yok.' : 'Ters orantılı olan çarpılmaz, bölünür.']],
      not: 'Oran → dy/dx; doğru → pay, ters → payda; "eşit" → k = 1.'
    };
  },
  /* koşul çevir */
  () => {
    const c = pick([
      ['"3 yıl önce 200, 1 yıl önce 500, şimdi kaç?" En temiz zaman seçimi?', R`$P(0)=200,\ P(2)=500,\ P(3)=?$`, R`$P(0)=500,\ P(2)=200,\ P(3)=?$`, R`$P(3)=200,\ P(1)=500,\ P(0)=?$`, 'En eski bilgiyi t = 0 seç: 3 yıl önce t = 0, 1 yıl önce t = 2, şimdi t = 3. Zaman ileri akar; "3 yıl önce" t = 3 olmaz.'],
      ['"Orijinal miktarın %30\'u kaldığında" hangi koşul?', R`$y(t_1)=0{,}3\,y(0)$`, R`$y(t_1)=0{,}7\,y(0)$`, R`$y(0{,}3)=y(0)$`, 'Kalan %30: 0,3·y(0). %30 gitseydi 0,7.'],
      ['"Yarılanma ömrü 5730 yıl" hangi koşul?', R`$y(5730)=\frac{y(0)}{2}$`, R`$y(5730)=2\,y(0)$`, R`$y\left(\frac{5730}2\right)=y(0)$`, 'Yarılanma: o sürede yarısı kalır.'],
      ['"Durgun hâlden bırakılıyor" (hız denklemi)', R`$v(0)=0$`, R`$v(0)=g$`, R`$y(0)=v$`, 'İlk hız sıfır.']
    ]);
    return { kalip: 'basla', soru: c[0], dogru: c[1], yanlis: [[c[2], c[4]], [c[3], c[4]]], not: c[4] };
  }
];
