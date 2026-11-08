(function () {
  const UI = window.UI, $ = UI.$;
  window.CH[1] = {
    intro: 'Önce büyük resim: malzeme bilgisi neyi öğretir, malzemeler hangi gruplara ayrılır, seçimde maliyet neden önemli. Bu bölüm kısa ama sınavda sınıflandırma sorusu çıkabilir.',
    sections: [
      {
        id: 'giris', title: 'Malzeme bilgisi neyi öğretir?', pg: 's.1-2',
        build(b) {
          b.innerHTML = `<p>Malzeme bilgisi, bir malzemenin <b>nasıl elde edildiğini, nasıl işlendiğini, nerede kullanılacağını ve özelliklerini</b> öğretir. Kitap bunu örneklerle anlatıyor: aynı ham madde işlenişine göre bambaşka bir şeye dönüşür.</p>
          <div class="key"><ul><li>Malzeme mühendisliği: ham maddeden üretimden, kullanımdan sonra <b>hurdadan geri kazanıma</b> kadar olan süreci planlar (s.1-2).</li><li>"Malzemenin <b>iyisi kötüsü yoktur</b>, uygun olanı ve uygun olmayanı vardır" (s.2). Doğru seçim için malzemeyi iyi tanımak gerekir.</li></ul></div>
          <h3>Kitaptaki örneklerle: ne olur?</h3><div class="widget" id="g1"><div style="padding:14px 18px"></div></div>`;
          const L = [
            { q: 'Alüminyumdan ne yapılır? (kitabın örneği)', o: ['Piston, motor, uçak', 'Semaver, kablo', 'Roket, füze', 'İplik, havlu'], a: 0, w: 'Al: piston, motor, uçak (s.1-2).' },
            { q: 'Titanyum haddelenip işlenirse ne olur?', o: ['Semaver', 'Roket, füze', 'Kazak', 'Eşarp'], a: 1, w: 'Ti: roket, füze (hafif ve dayanıklı).' },
            { q: 'Bakır şekillendirilirse ne olur?', o: ['Roket', 'Neşter', 'Semaver, kablo', 'Keçe'], a: 2, w: 'Cu: semaver, kablo (iletken, işlenebilir).' },
            { q: 'Çeliğe su verilirse (sertleştirilirse) ne olabilir?', o: ['Top, tüfek, bıçak, neşter, dişli çark', 'Havlu, bornoz', 'Halı, kravat', 'Ev, mezar'], a: 0, w: 'Demirden çelik, çelikten alet ve makine parçası.' },
            { q: 'Mermer kesilip taşlanırsa?', o: ['Roket', 'Ev, mezar', 'Piston', 'Kablo'], a: 1, w: 'Mermer: inorganik doğal malzeme.' },
            { q: 'Pamuk, ipek ve yün hangi gruptadır?', o: ['Doğal organik malzeme (tekstil)', 'Metal', 'Seramik', 'Yarı iletken'], a: 0, w: 'Tekstil mühendisi metal olmayan doğal/yapay malzemeleri öne çıkarır (s.2).' }
          ];
          UI.mini($('div', $('#g1', b)), L);
        }
      },
      {
        id: 'sinif', title: 'Mühendislik malzemelerinin sınıflandırılması', pg: 's.2-3 (Şekil 1.2.1)',
        build(b) {
          b.innerHTML = `<p>Kitaptaki şema (Şekil 1.2.1) iki görüşle çizilmiş. Dalları açıp kapat; dalın üstüne tıklayınca örnekleri görürsün.</p>
          <div class="widget"><div class="tree" id="tr"></div><div class="ctl"><button class="btn" id="open">Hepsini aç</button><button class="btn" id="close">Kapat</button></div><div class="cap">Bir kutuya tıkla.</div></div>
          <div class="grid">
            <div class="mini"><b>Makine mühendisi</b>Demir esaslı metaller (çelik, dökme demir)</div>
            <div class="mini"><b>Elektrik mühendisi</b>Cu, Al, yarı iletkenler</div>
            <div class="mini"><b>Tekstil mühendisi</b>Metal olmayan doğal ve yapay malzemeler</div>
            <div class="mini"><b>İnşaat mühendisi</b>Beton, taş, tuğla</div></div>
          <div class="key"><ul><li>Metaller: <b>demir esaslı</b> (çelikler; dökme demirler: lamel grafitli, küresel grafitli) ve <b>demir dışı</b> (hafif: Al, Mg, Ti; ağır metaller).</li><li>Metal olmayanlar: <b>organik</b> (plastik, ağaç, deri) ve <b>inorganik</b> (seramik, cam, mermer, beton).</li><li>Ayrıca <b>kompozit</b> malzemeler ve <b>yarı iletkenler</b> ayrı gruplanır.</li></ul></div>
          <h3>Hangi gruba girer?</h3><div class="widget" id="g2"><div style="padding:14px 18px"></div></div>`;
          const T = { n: 'Mühendislik malzemeleri', c: [
            { n: 'Metaller', c: [
              { n: 'Demir esaslı', c: [{ n: 'Çelikler', ex: 'Yapı çelikleri, takım çelikleri' }, { n: 'Dökme demirler', ex: 'Lamel grafitli, küresel grafitli' }] },
              { n: 'Demir olmayan', c: [{ n: 'Hafif metaller', ex: 'Al, Mg, Ti' }, { n: 'Ağır metaller', ex: 'Cu, Pb, Zn gibi yoğun metaller' }] }] },
            { n: 'Metal olmayanlar', c: [
              { n: 'Organik', c: [{ n: 'Plastikler', ex: 'Polimerler' }, { n: 'Organik doğal', ex: 'Ağaç, deri' }] },
              { n: 'İnorganik', c: [{ n: 'Seramikler', ex: 'Seramik, mermer, beton' }, { n: 'Camlar', ex: 'Amorf inorganik' }, { n: 'İnorganik doğal', ex: 'Mermer, taş' }] }] },
            { n: 'Kompozitler', ex: 'Birden çok malzemeyi birleştiren' },
            { n: 'Yarı iletkenler', ex: 'Elektrik mühendisliğinin malzemesi' }] };
          const root = $('#tr', b), cap = $('.cap', b);
          function node(t, depth) {
            const w = document.createElement('div'); w.className = 'tbranch';
            const btn = document.createElement('button'); btn.className = 'tn'; btn.innerHTML = t.n + (t.ex ? `<small>${t.ex}</small>` : '');
            w.appendChild(btn);
            if (t.c) {
              const k = document.createElement('div'); k.className = 'kids' + (depth > 0 ? ' hide' : ''); t.c.forEach(c => k.appendChild(node(c, depth + 1))); w.appendChild(k);
              btn.onclick = () => { k.classList.toggle('hide'); cap.innerHTML = `<b>${t.n}</b>: ` + t.c.map(c => c.n).join(', '); };
            } else btn.onclick = () => { root.querySelectorAll('.tn').forEach(x => x.classList.remove('sel')); btn.classList.add('sel'); cap.innerHTML = `<b>${t.n}</b>: ${t.ex || ''}`; };
            return w;
          }
          root.appendChild(node(T, 0));
          $('#open', b).onclick = () => root.querySelectorAll('.kids').forEach(k => k.classList.remove('hide'));
          $('#close', b).onclick = () => root.querySelectorAll('.kids').forEach((k, i) => k.classList.toggle('hide', i > 0));
          const G = ['Demir esaslı metal', 'Hafif metal (demir dışı)', 'Organik', 'İnorganik'];
          UI.mini($('div', $('#g2', b)), [
            { q: 'Takım çeliği hangi gruptadır?', o: G, a: 0, w: 'Çelikler, demir esaslı metallerdir.' },
            { q: 'Küresel grafitli dökme demir?', o: G, a: 0, w: 'Dökme demirler demir esaslıdır.' },
            { q: 'Titanyum?', o: G, a: 1, w: 'Hafif metaller: Al, Mg, Ti.' },
            { q: 'Plastik?', o: G, a: 2, w: 'Plastik, ağaç, deri organiktir.' },
            { q: 'Beton ve mermer?', o: G, a: 3, w: 'Seramikler, mermer, beton inorganiktir.' },
            { q: 'Cam?', o: G, a: 3, w: 'Camlar inorganiktir.' },
            { q: 'Alüminyum?', o: G, a: 1, w: 'Al hafif metaldir.' },
            { q: 'Deri?', o: G, a: 2, w: 'Organik doğal malzeme.' }
          ]);
        }
      },
      {
        id: 'secim', title: 'Malzeme seçimi ve maliyet', pg: 's.4-5 (Çizelge 1.3.1)',
        build(b) {
          b.innerHTML = `<p>Seçimde <b>maliyet önemli belirleyici faktörlerden biridir</b>. Kitap bazı malzemelerin yaklaşık maliyetini $/kg olarak verir. Aşağıda aralıkları <b>logaritmik</b> eksende gör: her çizgi 10 kat demek.</p>
          ${UI.W('cost', 0.5)}
          <div class="key"><ul><li>Sınavda sayı beklenmez ama sıralama mantığı sorulabilir: <b>yapı çeliği en ucuzlardan; altın en pahalılardan</b>.</li><li>Doğru seçim yapan mühendis kurumuna para kazandırır (s.2-3).</li></ul></div>
          <p class="hint">Değerler kitaptaki çizelgeden (OCR'dan) okundu; birkaç satırı kitaptan bir kez teyit et.</p>`;
          const items = [['Yapı çeliği (S235JR)', 0.4, 1.2], ['Saf bakır', 8.6, 9.25], ['Ti-6Al-4V', 10, 50], ['Saf gümüş', 510, 765], ['Sarı altın', 38000, 57000]];
          const w = $('#cost', b);
          UI.loop($('canvas', w), 0.5, (ctx, W, H, st) => {
            const x0 = 150, x1 = W - 20, lo = Math.log10(0.1), hi = Math.log10(100000);
            const X = v => x0 + (Math.log10(v) - lo) / (hi - lo) * (x1 - x0);
            for (let e = -1; e <= 5; e++) { const x = X(Math.pow(10, e)); UI.line(ctx, x, 20, x, H - 34, '#222b34', 1); UI.text(ctx, e >= 0 ? Math.pow(10, e).toLocaleString('tr') : '0,1', x, H - 18, '#8E99A6', 11, 'center'); }
            UI.text(ctx, '$/kg', x1, H - 4, '#8E99A6', 11, 'right');
            const grow = Math.min(1, st.t / 1.2);
            items.forEach((it, i) => {
              const y = 38 + i * ((H - 90) / items.length) + 8, ba = X(it[1]), bb = ba + (X(it[2]) - ba) * grow;
              UI.text(ctx, it[0], 10, y, '#EEF1F4', 13);
              UI.roundRect(ctx, ba, y - 9, Math.max(6, bb - ba), 18, 5, '#F5C542');
              if (grow >= 1) UI.text(ctx, it[1].toLocaleString('tr') + '–' + it[2].toLocaleString('tr'), Math.min(bb + 8, W - 130), y, '#C9D0D8', 12);
            });
          });
          UI.setCap(w, 'Altın ile yapı çeliği arasında yaklaşık <b>5 basamak</b> (100 bin kat) fark var.');
        }
      }
    ]
  };
})();
