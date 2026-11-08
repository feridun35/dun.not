'use strict';
(() => {
  const $ = (s, el = document) => el.querySelector(s);
  const app = $('#app'), nav = $('#nav');
  const st = {
    get(k, d) { try { const v = localStorage.getItem('eem:' + k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem('eem:' + k, JSON.stringify(v)); } catch (e) { } }
  };
  const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const T = id => TOPICS.find(t => t.id === id);
  const LET = 'ABCDE';

  /* ---------- 3D sahne montajı ---------- */
  let views = [], io = null;
  function mkPanel(el) {
    return {
      slider(lbl, o, cb) {
        const w = document.createElement('div'); w.className = 'sl';
        w.innerHTML = `<label><span>${lbl}</span><b></b></label><input type="range" min="${o.min}" max="${o.max}" step="${o.step}" value="${o.val}">`;
        const inp = w.querySelector('input'), b = w.querySelector('b');
        const show = () => { b.textContent = String(+inp.value).replace('.', ',') + (o.unit ? ' ' + o.unit : ''); };
        inp.addEventListener('input', () => { show(); cb(+inp.value); }); show(); el.append(w); return inp;
      },
      btns(list, o = {}) {
        const w = document.createElement('div'); w.className = 'bt';
        list.forEach(([t, cb], k) => {
          const b = document.createElement('button'); b.textContent = t;
          if (o.toggle && k === (o.sel ?? 0)) b.classList.add('on');
          b.onclick = () => { if (o.toggle) { w.querySelectorAll('button').forEach(x => x.classList.remove('on')); b.classList.add('on'); } cb(); };
          w.append(b);
        });
        el.append(w); return w;
      },
      out() { const d = document.createElement('div'); d.className = 'out'; el.append(d); return d; },
      note(h) { const d = document.createElement('div'); d.className = 'note'; d.innerHTML = h; el.append(d); return d; }
    };
  }
  const FLAT = ['turev', 'ark', 'anlikguc'];
  function mountScenes(root) {
    views.forEach(v => v.stop()); views = [];
    if (io) io.disconnect();
    io = new IntersectionObserver(es => es.forEach(e => {
      const fig = e.target, rec = fig._rec;
      if (e.isIntersecting) {
        if (!rec.V) {
          try {
            rec.V = new E3.View(rec.cv); views.push(rec.V);
            SC[rec.id].b(rec.V, mkPanel(rec.pnl));
          } catch (err) { rec.pnl.innerHTML = '<div class="out bad">Sahne yüklenemedi: ' + esc(err.message) + '</div>'; console.error(err); return; }
        }
        rec.V.start();
      } else if (rec.V) rec.V.stop();
    }), { rootMargin: '120px' });
    root.querySelectorAll('.scene').forEach(div => {
      const id = div.dataset.sc, S = SC[id]; if (!S) return;
      const flat = FLAT.includes(id);
      const fig = document.createElement('figure'); fig.className = 'scn';
      fig.innerHTML = `<figcaption><span>${S.t}</span><i>${flat ? 'kaydırıcıyla oynat' : 'sürükle: döndür · tekerlek: yakınlaş · çift tık: sıfırla'}</i></figcaption><div class="cvw${flat ? ' flat' : ''}"><canvas></canvas><button class="full" title="Tam ekran">⤢</button></div><div class="pnl"></div>`;
      div.replaceWith(fig);
      fig._rec = { id, cv: fig.querySelector('canvas'), pnl: fig.querySelector('.pnl'), V: null };
      fig.querySelector('.full').onclick = () => { fig.classList.toggle('fs'); };
      io.observe(fig);
    });
  }
  document.addEventListener('keydown', e => { if (e.key === 'Escape') document.querySelectorAll('figure.fs').forEach(f => f.classList.remove('fs')); });

  /* ---------- gezinme ---------- */
  function drawNav(cur) {
    const done = st.get('done', {});
    nav.innerHTML = `<a href="#ana" class="${cur === 'ana' ? 'on' : ''}">Başla</a><span class="sep"></span>` +
      TOPICS.map(t => `<a href="#${t.id}" class="${cur === t.id ? 'on' : ''} ${done[t.id] ? 'done' : ''}">${t.no} ${t.kisa}</a>`).join('') +
      `<span class="sep"></span><a href="#test" class="${cur === 'test' ? 'on' : ''}">Test</a><a href="#kart" class="${cur === 'kart' ? 'on' : ''}">Kartlar</a><a href="#ozet" class="${cur === 'ozet' ? 'on' : ''}">Sabah kâğıdı</a>`;
  }
  function route() {
    const h = (location.hash || '#ana').slice(1), [pg, arg] = h.split('-');
    views.forEach(v => v.stop());
    if (T(pg)) topicPage(T(pg));
    else if (pg === 'test') testPage(arg);
    else if (pg === 'kart') cardPage(arg);
    else if (pg === 'ozet') cheatPage();
    else if (pg === 'yanlis') testPage('yanlis');
    else homePage();
    drawNav(T(pg) ? pg : (pg === 'yanlis' ? 'test' : pg || 'ana'));
    const on = nav.querySelector('a.on'); if (on && nav.scrollWidth > nav.clientWidth) nav.scrollLeft = on.offsetLeft - nav.clientWidth / 2 + on.offsetWidth / 2;
    window.scrollTo(0, 0);
  }
  window.addEventListener('hashchange', route);

  /* ---------- ana sayfa ---------- */
  function homePage() {
    const done = st.get('done', {}), best = st.get('best', {}), known = st.get('known', {});
    const tot = TOPICS.reduce((a, t) => a + t.dk, 0), left = TOPICS.filter(t => !done[t.id]).reduce((a, t) => a + t.dk, 0);
    const wrong = st.get('wrong', []);
    app.innerHTML = `
<div class="hero"><div class="kicker">Elektrik-Elektronik Mühendisliğinin Temelleri · test sınavı</div><h1>Sıfırdan sınava, bu gece</h1>
<p class="sub">Kapsam (hocanın maili): EDS ders notlarının başından <b>Konu 10 PDF sayfa 12 dahil</b>. Ezber yerine <b>görerek</b>: her konu döndürebileceğin 3D sahnelerle, her sayı bir <b class="red">KANCA</b>yla.</p></div>
<section><h2>Bu gece nasıl çalışacaksın</h2>
<ol class="rules"><li><b>Konuyu oku, sahneyle oyna.</b> Kaydırıcıları oynat; “ne değişti?” diye bak. Kırmızı KANCA kutularını sesli oku.</li>
<li><b>Konu bitince 10 soruluk konu testi</b> (konunun sonundaki düğme). Yanlışların otomatik kaydedilir.</li>
<li><b>Kartlar</b>: sayılar ve tanımlar. “Biliyorum” dediklerin bir daha gelmez.</li>
<li><b>Hepsi bitince 40 soruluk karışık deneme</b>, sonra <b>Yanlışlarım</b>.</li>
<li><b>Sabah</b>: “Sabah kâğıdı” sayfasını bir kez baştan sona oku.</li></ol>
<p class="mut">Tam yol ≈ ${Math.round(tot / 60 * 10) / 10} saat (kalan ≈ ${Math.round(left / 60 * 10) / 10} saat). Vaktin azsa: her konuda yalnız KANCA + TUZAK kutuları + konu testi; sonra kartlar. En çok sözel puan <b>2 · Güvenlik</b>’te.</p></section>
<section><h2>Konular</h2><div class="plan">${TOPICS.map(t => {
      const kn = t.kart.filter((c, i) => known[t.id + ':' + i]).length, b = best[t.id];
      return `<a href="#${t.id}" class="${done[t.id] ? 'done' : ''}"><div class="n">KONU ${t.no}</div><b>${t.title}</b><div class="meta"><span>${t.src}</span><span>≈${t.dk} dk</span></div><div class="meta"><span>kart ${kn}/${t.kart.length}</span><span>${b != null ? 'test en iyi %' + b : 'test yok'}</span></div><div class="bar"><i style="width:${Math.round(kn / t.kart.length * 100)}%"></i></div></a>`;
    }).join('')}</div>
<div class="cta"><a class="btn pri" href="#test">Karışık deneme sınavı</a><a class="btn" href="#kart">Tüm kartlar</a>${wrong.length ? `<a class="btn" href="#yanlis">Yanlışlarım (${wrong.length})</a>` : ''}<a class="btn" href="#ozet">Sabah kâğıdı</a></div></section>
<section><h2>Test sınavı taktikleri</h2><ul class="sum">
<li><b>Birim kontrolü:</b> şıklardaki birimler çoğu zaman cevabı verir (J/C = V, C/s = A, J/s = W, V/A = Ω, A/V = S).</li>
<li><b>İşaret soruları:</b> pasif işaret kabulü — akım (+) uçtan giriyorsa p = +vi; p &gt; 0 yutar, p &lt; 0 sağlar.</li>
<li><b>Ön ekler:</b> m = 10⁻³, μ = 10⁻⁶, k = 10³; hesabı önce SI’ya çevir.</li>
<li><b>“DEĞİLDİR / YANLIŞTIR”</b> soru kökünü iki kez oku; en çok bu kaçar.</li>
<li><b>Sayı ezberi:</b> 5 mA (GFCI), 100–200 mA (ölüm), 76° ve 1/4 (merdiven), 6 ft/1,8 m (kemer), 3 ft/0,9 m (taşma), 6000 °C (ark), 10 dk (AFCI testi), NEC 250, 230 V–50 Hz, 1,602×10⁻¹⁹, 6,24×10¹⁸, 3600 J.</li></ul></section>`;
  }

  /* ---------- slayt galerisi ---------- */
  const NSL = { k1: 15, k2: 24, k3: 16, k4: 18, k5: 17, k6: 10, k7: 3, k8: 19, k9: 19, k10: 13 };
  const SNOTE = {
    'k3:4': 'Bu şeritte yazım hataları var (Tera iki kez, “Mili (c)”). Doğrusu konu sayfasındaki ön ek tablosu.',
    'k4:15':'Sonuç 29,7 W verilen denklemle tutmuyor (hesap ≈ −4175 W). Ayrıntı konu sayfasında.',
    'k5:15': 'Alıştırma 1.7’nin sayıları slaytta boş bırakılmış.', 'k5:16': 'Alıştırma 1.7’nin sayıları slaytta boş bırakılmış.',
    'k9:16': 'Bu slayt n = 2 diyor; bir sonraki slayt ve kitap 3 düğüm. Kitabın cevabı: 5 dal, 3 düğüm.',
    'k10:13': 'BONUS — sayfa 13 (mailde “12 dahil”): büyük olasılıkla kapsam dışı.'
  };
  function gallery(t) {
    const n = NSL[t.id]; if (!n) return '';
    const kind = t.id === 'k2' ? 'sayfa' : 'slayt';
    return `<section><h2>Orijinal ${kind}lar (${n})</h2><p class="mut">Konunun bütün ${kind}ları burada; yukarıdaki anlatım hepsini kapsıyor. Bir ${kind}a dokun: büyür, ← → ile gezersin. Hatalı ${kind}ların altında not var.</p>
<div class="gal">${Array.from({ length: n }, (_, i) => { const k = `${t.id}:${i + 1}`; return `<figure data-i="${i}"><img loading="lazy" src="slayt/${t.id}/${String(i + 1).padStart(2, '0')}.jpg" alt="${kind} ${i + 1}"><figcaption>${i + 1}${SNOTE[k] ? ' · <b class="amber">not</b>' : ''}</figcaption></figure>`; }).join('')}</div></section>`;
  }
  function lightbox(t, i) {
    const n = NSL[t.id]; let cur = i;
    const lb = document.createElement('div'); lb.className = 'lb';
    const draw = () => { const k = `${t.id}:${cur + 1}`; lb.innerHTML = `<div class="lbin"><img src="slayt/${t.id}/${String(cur + 1).padStart(2, '0')}.jpg"><div class="lbcap"><button data-d="-1">←</button><span>${cur + 1} / ${n}${SNOTE[k] ? ' · <b class="amber">' + SNOTE[k] + '</b>' : ''}</span><button data-d="1">→</button><button data-x>✕</button></div></div>`; };
    const close = () => { lb.remove(); document.removeEventListener('keydown', key); };
    const key = e => { if (e.key === 'Escape') close(); if (e.key === 'ArrowRight') { cur = Math.min(n - 1, cur + 1); draw(); } if (e.key === 'ArrowLeft') { cur = Math.max(0, cur - 1); draw(); } };
    lb.onclick = e => { const b = e.target.closest('button'); if (e.target === lb || (b && b.hasAttribute('data-x'))) return close(); if (b) { cur = Math.max(0, Math.min(n - 1, cur + +b.dataset.d)); draw(); } };
    document.addEventListener('keydown', key); draw(); document.body.append(lb);
  }

  /* ---------- konu sayfası ---------- */
  function topicPage(t) {
    const done = st.get('done', {}), i = TOPICS.indexOf(t), prev = TOPICS[i - 1], next = TOPICS[i + 1];
    app.innerHTML = `<div class="thead"><div><div class="kicker">Konu ${t.no} · ${t.src} · ≈${t.dk} dk</div><h1>${t.title}</h1></div>
<label class="donebox"><input type="checkbox" ${done[t.id] ? 'checked' : ''}> BU KONUYU BİTİRDİM</label></div>
${t.body}
<section><h2>Konuyu kilitle</h2><p>Şimdi <b>${t.kart.length} kart</b> ile sayıları ve tanımları pekiştir, ardından <b>10 soruluk konu testi</b> çöz.</p>
<div class="cta"><a class="btn pri" href="#test-${t.id}">Konu ${t.no} testi (10 soru)</a><a class="btn" href="#kart-${t.id}">Konu ${t.no} kartları</a></div></section>
${gallery(t)}
<div class="pager">${prev ?`<a class="btn" href="#${prev.id}">← ${prev.no} ${prev.kisa}</a>` : '<span></span>'}${next ? `<a class="btn" href="#${next.id}">${next.no} ${next.kisa} →</a>` : '<a class="btn pri" href="#test">Deneme sınavına geç →</a>'}</div>`;
    $('.donebox input', app).onchange = e => { const d = st.get('done', {}); d[t.id] = e.target.checked; st.set('done', d); drawNav(t.id); };
    app.querySelectorAll('.gal figure').forEach(f => f.onclick = () => lightbox(t, +f.dataset.i));
    mountScenes(app);
  }

  /* ---------- test ---------- */
  function buildQs(arg, n) {
    let pool;
    if (arg === 'yanlis') { const w = st.get('wrong', []); pool = w.map(i => ({ ...QB[i], id: i })).filter(q => q.q); return shuffle(pool).slice(0, n); }
    const ks = arg && T(arg) ? [arg] : TOPICS.map(t => t.id);
    const qb = shuffle(QB.map((q, i) => ({ ...q, id: i })).filter(q => ks.includes(q.k)));
    const gens = GEN.filter(g => ks.includes(g.k));
    const nGen = Math.min(gens.length * 2, Math.round(n * 0.25));
    const out = qb.slice(0, n - nGen);
    for (let i = 0; out.length < n && gens.length && i < nGen * 3; i++) { const g = gens[i % gens.length]; const q = g.g(); if (q.o.length >= 3) out.push({ ...q, k: g.k, id: null }); }
    for (const q of qb.slice(n - nGen)) { if (out.length >= n) break; out.push(q); }
    return shuffle(out).slice(0, n).map(q => { const order = shuffle(q.o.map((t, j) => j)); return { ...q, opts: order.map(j => q.o[j]), right: order.indexOf(0) }; });
  }
  function testPage(arg) {
    const topic = arg && T(arg);
    const title = arg === 'yanlis' ? 'Yanlışlarım' : topic ? `Konu ${topic.no} testi — ${topic.title}` : 'Karışık deneme sınavı';
    if (arg === 'yanlis' && !st.get('wrong', []).length) { app.innerHTML = `<section><h2>Yanlışlarım</h2><p>Kayıtlı yanlış yok. Önce bir test çöz.</p><a class="btn pri" href="#test">Teste git</a></section>`; return; }
    app.innerHTML = `<div class="hero"><div class="kicker">Test</div><h1>${esc(title)}</h1>
<p class="sub">Her soruda 5 şık. Cevabı seçince doğrusu ve kısa açıklaması gelir. Klavye: A–E ya da 1–5, sonraki: Enter.</p></div>
<section><div class="pick"><b>Kapsam:</b> <a class="btn ${!topic && arg !== 'yanlis' ? 'on' : ''}" href="#test">Tüm konular</a>${TOPICS.map(t => `<a class="btn ${topic === t ? 'on' : ''}" href="#test-${t.id}">${t.no}</a>`).join('')}${st.get('wrong', []).length ? `<a class="btn ${arg === 'yanlis' ? 'on' : ''}" href="#yanlis">Yanlışlarım (${st.get('wrong', []).length})</a>` : ''}</div>
<div class="pick"><b>Mod:</b> <button id="mL" class="on">Öğrenme (her soruda açıklama)</button><button id="mS">Sınav provası (cevaplar sonda, süre tutulur)</button></div>
<div class="pick"><b>Soru sayısı:</b> ${[10, 20, 40].map(n => `<button data-n="${n}" class="${n === (topic ? 10 : 20) ? 'pri' : ''}">${n} soru</button>`).join('')}</div></section>
<div id="qarea"></div>`;
    let exam = false;
    $('#mL').onclick = () => { exam = false; $('#mL').classList.add('on'); $('#mS').classList.remove('on'); };
    $('#mS').onclick = () => { exam = true; $('#mS').classList.add('on'); $('#mL').classList.remove('on'); };
    app.querySelectorAll('[data-n]').forEach(b => b.onclick = () => run(+b.dataset.n));
    function run(n) {
      const qs = buildQs(arg, n); if (!qs.length) return;
      let k = 0, score = 0; const res = [], t0 = Date.now();
      const tm = () => { const s = Math.round((Date.now() - t0) / 1000); return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`; };
      const area = $('#qarea'); app.querySelectorAll('section')[0].style.display = 'none';
      const show = () => {
        const q = qs[k], tp = T(q.k);
        area.innerHTML = `<section class="qbox"><div class="qtop"><span>SORU ${k + 1} / ${qs.length}</span><span>KONU ${tp.no} · ${tp.kisa.toUpperCase()}</span><span>${exam ? 'SÜRE ' + tm() : 'DOĞRU ' + score}</span></div>
<div class="qq">${esc(q.q)}</div>${q.opts.map((o, j) => `<button class="opt" data-j="${j}"><span class="L">${LET[j]})</span><span>${esc(o)}</span></button>`).join('')}<div id="ex"></div></section>`;
        area.querySelectorAll('.opt').forEach(b => b.onclick = () => answer(+b.dataset.j));
      };
      const answer = j => {
        const q = qs[k]; if (q.done) { return; } q.done = true;
        const ok = j === q.right; if (ok) score++; res.push({ q, ok, j });
        const w = new Set(st.get('wrong', []));
        if (q.id != null) { if (ok) w.delete(q.id); else w.add(q.id); st.set('wrong', [...w]); }
        if (exam) { nextQ(); return; }
        area.querySelectorAll('.opt').forEach((b, i) => { b.disabled = true; if (i === q.right) b.classList.add('right'); if (i === j && !ok) b.classList.add('wrong'); });
        $('#ex', area).innerHTML = `<div class="expl"><b class="${ok ? 'ok' : 'bad'}">${ok ? 'DOĞRU' : 'YANLIŞ — doğrusu ' + LET[q.right]}</b> · ${esc(q.e)} <a href="#${q.k}">konuya dön</a></div>
<div class="cta"><button class="pri" id="nx">${k + 1 < qs.length ? 'Sonraki soru →' : 'Sonucu gör'}</button></div>`;
        $('#nx', area).onclick = nextQ;
      };
      const nextQ = () => { k++; if (k < qs.length) show(); else finish(); };
      const finish = () => {
        const pct = Math.round(score / qs.length * 100);
        const by = {}; res.forEach(r => { by[r.q.k] = by[r.q.k] || [0, 0]; by[r.q.k][1]++; if (r.ok) by[r.q.k][0]++; });
        if (topic) { const b = st.get('best', {}); b[topic.id] = Math.max(b[topic.id] || 0, pct); st.set('best', b); }
        area.innerHTML = `<section class="qbox"><div class="score">${score} / ${qs.length} · %${pct}</div><div class="qtimer">SÜRE ${tm()}${exam ? ' · SINAV PROVASI' : ''}</div>
<p style="text-align:center">${pct >= 85 ? 'Çok iyi. Kartlara ve diğer konulara geç.' : pct >= 60 ? 'İyi gidiyor. Yanlışların konularına kısa bir dönüş yap.' : 'Bu konunun KANCA ve TUZAK kutularını tekrar oku, sonra yeniden dene.'}</p>
<table class="t"><tr><th>Konu</th><th>Doğru</th></tr>${Object.entries(by).map(([kk, [a, b]]) => `<tr><td><a href="#${kk}">${T(kk).no} · ${T(kk).kisa}</a></td><td>${a} / ${b}</td></tr>`).join('')}</table>
${res.filter(r => !r.ok).length ? `<h3>Yanlışların</h3>${res.filter(r => !r.ok).map(r => `<div class="expl"><b>${esc(r.q.q)}</b><br>Senin: <span class="bad">${esc(r.q.opts[r.j])}</span> · Doğru: <span class="ok">${esc(r.q.opts[r.q.right])}</span><br><span class="mut">${esc(r.q.e)}</span></div>`).join('')}` : ''}
<div class="cta"><button class="pri" id="again">Yeni soru seti</button>${st.get('wrong', []).length ? '<a class="btn" href="#yanlis">Yanlışlarım</a>' : ''}<a class="btn" href="#ana">Ana sayfa</a></div></section>`;
        $('#again', area).onclick = () => run(n);
      };
      document.onkeydown = e => {
        if (!$('#qarea') || !qs[k]) return;
        const m = 'abcde'.indexOf(e.key.toLowerCase()), d = '12345'.indexOf(e.key);
        if (!qs[k].done && (m >= 0 || d >= 0)) answer(m >= 0 ? m : d);
        else if (e.key === 'Enter' && qs[k].done) nextQ();
      };
      show();
    }
    if (topic) run(10); else if (arg === 'yanlis') run(Math.min(20, st.get('wrong', []).length));
  }

  /* ---------- kartlar ---------- */
  function cardPage(arg) {
    const topic = arg && T(arg);
    const known = st.get('known', {});
    let deck = [];
    (topic ? [topic] : TOPICS).forEach(t => t.kart.forEach((c, i) => { const key = t.id + ':' + i; if (!known[key]) deck.push({ t, c, key }); }));
    const total = (topic ? [topic] : TOPICS).reduce((a, t) => a + t.kart.length, 0);
    deck = shuffle(deck);
    app.innerHTML = `<div class="hero"><div class="kicker">Ezber kartları</div><h1>${topic ? 'Konu ' + topic.no + ' kartları' : 'Tüm kartlar'}</h1>
<p class="sub">Soruyu oku, cevabı kafanda söyle, sonra kartı çevir (tıkla ya da boşluk). Bildiysen “Biliyorum”, emin değilsen “Tekrar”.</p></div>
<div class="pick"><a class="btn ${!topic ? 'on' : ''}" href="#kart">Hepsi</a>${TOPICS.map(t => `<a class="btn ${topic === t ? 'on' : ''}" href="#kart-${t.id}">${t.no} ${t.kisa}</a>`).join('')}</div>
<div id="fc"></div>`;
    const box = $('#fc');
    const draw = () => {
      if (!deck.length) { box.innerHTML = `<section style="text-align:center"><h2>Bu destede bilmediğin kart kalmadı ✔</h2><div class="cta"><button id="rs">Bu destedeki bilinenleri sıfırla</button><a class="btn pri" href="#test${topic ? '-' + topic.id : ''}">Teste geç</a></div></section>`; $('#rs').onclick = () => { const kn = st.get('known', {}); Object.keys(kn).forEach(k => { if (!topic || k.startsWith(topic.id + ':')) delete kn[k]; }); st.set('known', kn); cardPage(arg); }; return; }
      const d = deck[0], kn = Object.keys(st.get('known', {})).filter(k => !topic || k.startsWith(topic.id + ':')).length;
      box.innerHTML = `<div class="mut" style="text-align:center">kalan ${deck.length} · bilinen ${kn}/${total}</div>
<div class="fc" id="card"><div class="tag">KONU ${d.t.no} · ${d.t.kisa.toUpperCase()}</div><div class="fq">${esc(d.c[0])}</div><div class="fa" hidden>${esc(d.c[1])}${d.c[2] ? `<div class="fk">kanca: ${esc(d.c[2])}</div>` : ''}</div><div class="mut" id="hint">çevirmek için tıkla</div></div>
<div class="cta"><button id="no">Tekrar sor</button><button class="pri" id="yes">Biliyorum</button></div>`;
      const flip = () => { $('.fa', box).hidden = false; $('#hint', box).hidden = true; };
      $('#card').onclick = flip;
      $('#yes').onclick = () => { const kn2 = st.get('known', {}); kn2[d.key] = 1; st.set('known', kn2); deck.shift(); draw(); };
      $('#no').onclick = () => { deck.shift(); deck.splice(Math.min(deck.length, 3 + Math.floor(Math.random() * 4)), 0, d); draw(); };
      document.onkeydown = e => { if (!$('#card')) return; if (e.key === ' ') { e.preventDefault(); flip(); } if (e.key === 'ArrowRight') $('#yes').click(); if (e.key === 'ArrowLeft') $('#no').click(); };
    };
    draw();
  }

  /* ---------- sabah kâğıdı ---------- */
  function cheatPage() {
    const B = (h, items) => `<div><h3>${h}</h3><ul>${items.map(x => `<li>${x}</li>`).join('')}</ul></div>`;
    app.innerHTML = `<div class="hero"><div class="kicker">Sınavdan önce bir kez oku</div><h1>Sabah kâğıdı</h1><p class="sub">Bütün formüller ve ezber sayıları tek sayfada.</p></div>
<div class="cheat">
${B('1 · Giriş', ['Elektrik = kas (enerji: jeneratör, trafo, motor, şebeke; yüksek V-I). Elektronik = beyin (sinyal: MCU, sensör, transistör, kart; düşük V, bilgi).', 'Elektron −→+; konvansiyonel akım +→−.', 'Su: V depo yüksekliği, I debi, R vana, P çark.', 'V = IR; P = VI; E = Pt (1 kW × 2 h = 2 kWh).', 'Verim: P_çıkış &lt; P_giriş, kayıp = ısı (1000 W, %90 → 900 W + 100 W ısı).', 'DC: yön/genlik sabit. AC: periyodik. TR: 230 V – 50 Hz.', 'Voltmetre PARALEL, ampermetre SERİ (paralel → kısa devre), ohmmetre ENERJİSİZ.', 'Osiloskop: genlik, periyot, frekans, dalga şekli, gürültü. Multimetre: tek sayı.', 'Sıcaklık→voltaj, load cell→direnç, enkoder→kare dalga frekansı, Hall→dijital.', 'Mekatronik: sensör → PLC → sürücü (güçlendirme) → motor → mekanik sonuç.'])}
${B('2 · Güvenlik — sayılar', ['3 adım test: canlı – ölü – canlı. En önemli kural: DÜŞÜN.', 'Tek elle çalış (el→el kalpten). 50 V üstü: ilk yardım/CPR.', 'mA: 2–3 karıncalanma · 9–10 his · 10–20 ağrı · 20–30 bırakamama · 30–40 kas felci · 40–60 solunum · 60–100 aşırı solunum · <b>100–200 ölüm (fibrilasyon)</b> · &gt;200 kalp sıkışır (defibrilatör).', 'En tehlikeli voltaj 120 V (100–200 mA geçirir). Terli → direnç düşer.', 'Hendek: yürüme, atlama, barikat, merdiven. Kapalı alan: dışarıdaki asla girmez; O₂ ve patlayıcı gaz.', 'Kilitleme-etiketleme: anahtar sende; ihlalde ilk uyarı yok.', 'Ark flaşı 30 ft (9 m). Kevlar = kesik. Kauçuk astarlı deri = voltaj.', 'Kemer 6 ft (1,8 m) üstü; lanyard 6 ft; D-halkası arkada.', 'İskele en güvenli. Alüminyum merdiven yok. 90/113/136 kg. 76° = taban H/4 (20 ft → 5 ft). 3 ft (0,9 m) taşma. A tipi: en üst basamak yok.'])}
${B('2 · Güvenlik — yangın, GFCI, AFCI', ['Yangın üçgeni: yakıt + ısı + oksijen.', 'A ahşap/kâğıt (su; elektrikte ASLA) · B benzin/gres/gaz (CO₂) · C cereyan = enerjili elektrik (kuru toz) · D demir = metal (toz kabuk, su yasak). ABC hepsi.', 'En büyük neden: gevşek bağlantı. P = I²R: 25 A, 0,25 Ω → 156,25 W. Havya 15–30 W.', 'GFCI: çarpılmaya karşı; faz–nötr farkı ≈5 mA. Kesici (uzun hat → parazit atma), priz, uzatma kablosu.', 'AFCI: yangına karşı; yangınların 1/3’ü ark; 6000 °C; 120 V 15–20 A konut devreleri.', 'Paralel ark: kısa devre, yüksek tepe, kolay tespit. Seri ark: gevşek bağlantı, normal akım, zor tespit.', 'AFCI: mikroişlemci + akım/sıcaklık sensörü + kalıcı bellek; büyüklük-süre-darbe arası zaman; süpürge/matkap attırabilir; 10 dk’da bir kendi testi.', 'Bağlantı: beyaz pigtail → nötr bara; beyaz → gümüş vida; siyah → pirinç vida.', 'Kurcalamaya dayanıklı priz: iki uç birden. Topraklama: NEC 250; 3. uç gövdeye, asla kesilmez.'])}
${B('3 · Yük, akım, gerilim', ['SI (1960) temel: m, kg, s, A, K, cd. Coulomb türetilmiş.', 'a 10⁻¹⁸ · f 10⁻¹⁵ · p 10⁻¹² · n 10⁻⁹ · μ 10⁻⁶ · m 10⁻³ · c 10⁻² · d 10⁻¹ · k 10³ · M 10⁶ · G 10⁹ · T 10¹² · P 10¹⁵ · E 10¹⁸.', 'e = −1,602×10⁻¹⁹ C; 1 C = 6,24×10¹⁸ elektron. Yük korunur.', 'i = dq/dt (eğim), Q = ∫i dt (alan). 1 A = 1 C/s. Ampère; Franklin yön kabulü.', 'v = dw/dq; 1 V = 1 J/C; Volta (1745–1827). v_ab = −v_ba.', 'Örnekler: 4600 e → −7,369×10⁻¹⁶ C · 6×10⁶ p → 9,612×10⁻¹³ C · 31,42 mA · 2,707 mA · 5,5 C · 13,333 C · 115 V · 5 V / −10 V.', '−5 A bir yönde = +5 A ters yönde. DC büyük I, AC küçük i.'])}
${B('4 · Güç ve enerji', ['p = dw/dt = vi; 1 W = 1 J/s.', 'Pasif işaret: akım (+) uçtan → p = +vi; (−) uçtan → p = −vi. p &gt; 0 yutar, p &lt; 0 sağlar.', 'Σp = 0. w = ∫p dt. 1 Wh = 3600 J; 1 kWh = 3,6×10⁶ J.', 'Örnek 1.5: 53,48 W (v=3i) · −6,396 kW (v=3di/dt) · 42,51 W (v=10+5∫i dt).', '100 W × 2 h = 200 Wh = 720 kJ. 240 V × 15 A = 3,6 kW; 180 kJ → 50 s.'])}
${B('5 · Elemanlar ve kaynaklar', ['Aktif: pil, üreteç, op-amp (p &lt; 0). Pasif: R yutar; L, C depolar.', 'Daire = bağımsız; elmas = bağımlı. Gerilim kaynağının akımı, akım kaynağının gerilimi devreye bağlı.', 'VCVS v = μvₓ · VCCS i = gvₓ · CCVS v = riₓ · CCCS i = βiₓ (transistör).', 'Örnek 1.7: −100 + 60 + 48 − 8 = 0.'])}
${B('6 · Uygulamalar', ['Braun 1879 CRT (ekran: sinyal → görüntü, değişen yoğunluk). Zworykin ikonoskop (kamera: görüntü → sinyal, sabit yoğunluk).', 'Tabanca → anot (hızlandırır, odaklar) → saptırma plakaları → fluoresan ekran.', 'i = e·dn/dt, p = V₀·i. 10¹⁵ e/s, 4 W → 25 kV. 10¹³ e/s, 30 kV → 48 mW.', 'Fatura: kWh × fiyat + sabit abonelik. Tablo 1.3: şofben 500 kWh en çok, saat 2 kWh en az.'])}
${B('7 · Problem çözme', ['1 tanımla · 2 bildiklerini sun · 3 alternatifler, en olasıyı seç · 4 çöz · 5 değerlendir/kontrol · 6 tatmin edici mi? değilse 3’e dön.', 'Aşamalar: kurulum (1-2), strateji-çözüm (3-4), doğrulama (5-6). Termo, akışkanlar, statik için de geçerli.'])}
${B('8 · Ohm ve direnç', ['R = ρℓ/A (ℓ↑ R↑, A↑ R↓). ρ: Ω·m.', 'Gümüş 1,64e-8 · bakır 1,72e-8 · karbon 4e-5 · Ge 0,47 · Si 640 · kâğıt 1e10 · teflon &gt;1e12.', 'v = iR (Ohm 1826; 1787–1854). 1 Ω = 1 V/A. (−) uçtan → v = −iR.', 'Kısa devre R = 0 → v = 0. Açık devre R = ∞ → i = 0.', 'Yalnız doğrusal elemanlar (diyot, ampul değil). Eğim 1/R.', 'G = 1/R, siemens (S) / mho (℧). p = vi = i²R = v²/R ≥ 0.', 'Wirewound yüksek güç; karbon film standart; potansiyometre/reosta silecekli; SMD kompakt.', 'Ütü 60 Ω · kızartıcı 7,333 A · 30 V/5 kΩ: 6 mA, 0,2 mS, 180 mW · 3 mA/10 kΩ: 30 V, 100 μS, 90 mW · 4 sin πt mA, 80 sin²πt mW · 7,5 kΩ.'])}
${B('9 · Topoloji', ['Dal = tek eleman (tel dal değil). Düğüm = elemanları bağlayan telin TAMAMI. Çevre = düğüm tekrarı olmayan kapalı yol.', '<b>b = l + n − 1</b> → l = b − n + 1.', 'Seri: tek ortak düğüm, başka dal yok → aynı AKIM. Paralel: aynı iki düğüm → aynı GERİLİM.', 'Örnek 2.4: b 4, n 3, l 2; 10 V–5 Ω seri; 6 Ω ∥ 2 A.', 'Alıştırma 2.4: b 5, n 3; 1 Ω ∥ 2 Ω; 4 Ω ∥ 10 V; 5 Ω (1∥2) ile seri.'])}
${B('10 · Kirchhoff', ['Kirchhoff 1847. KCL = yükün korunumu (düğüm, Σi = 0, giren = çıkan; kapalı yüzeyde de). KVL = enerjinin korunumu (çevre, Σv = 0, yükselme = düşüm).', 'KVL’de ilk karşılaşılan terminalin işaretini yaz.', 'Paralel akım kaynakları: I₁ − I₂ + I₃. Seri gerilim kaynakları: V₁ + V₂ − V₃.', 'Yasak: seri iki farklı akım kaynağı (KCL), paralel iki farklı gerilim kaynağı (KVL).', 'Kutsal üçlü: KCL + KVL + Ohm. Yönleri ata → yasaları uygula → Ohm ile indirge.', 'Örnek 2.5: −20 + v₁ − v₂ = 0; v₁ = 2i, v₂ = −3i → i = 4 A, v₁ = 8 V, v₂ = −12 V.', '(Bonus 2.6: 0,5i₀ + 3 = i₀ → i₀ = 6 A, v₀ = 24 V.)'])}
</div>`;
  }

  route();
})();
