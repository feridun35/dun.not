/* Yönlendirme, kenar menü, ilerleme */
(function () {
  const UI = window.UI, $ = UI.$, main = $('#main'), side = $('#side');
  const done = UI.store.get('done', {});
  function secKey(n, id) { return n + ':' + id; }
  function chProg(n) {
    const ch = window.CH[n]; if (!ch) return [0, 0];
    const tot = ch.sections.length; const d = ch.sections.filter(s => done[secKey(n, s.id)]).length; return [d, tot];
  }
  function totalProg() { let d = 0, t = 0; for (const c of UI.chapters) { const [a, b] = chProg(c.n); d += a; t += b; } return t ? Math.round(100 * d / t) : 0; }
  function paintTop() { const p = totalProg(); $('#topProg').textContent = p + '%'; $('#topBar').style.width = p + '%'; }

  function buildSide(cur) {
    let h = `<a href="#home" class="${cur === 'home' ? 'on' : ''}"><span class="dot" style="--c:#fff"></span>Başlangıç</a><h6>Bölümler</h6>`;
    for (const c of UI.chapters) {
      const [d, t] = chProg(c.n);
      h += `<a href="#ch${c.n}" class="${cur === 'ch' + c.n ? 'on' : ''}"><span class="dot" style="--c:${c.c}"></span>${c.n}. ${c.t}<span class="n">${d}/${t}</span></a>`;
    }
    h += `<h6>Pekiştir</h6><a href="#ozet" class="${cur === 'ozet' ? 'on' : ''}"><span class="dot" style="--c:#fff"></span>Tek sayfa özet</a>`;
    h += `<a href="#sinav" class="${cur === 'sinav' ? 'on' : ''}"><span class="dot" style="--c:#FF2D20"></span>Deneme sınavı (50 soru)</a>`;
    h += `<a href="#yanlis" class="${cur === 'yanlis' ? 'on' : ''}"><span class="dot" style="--c:#FF2D20"></span>Yanlışlarım</a>`;
    side.innerHTML = h;
  }

  function home() {
    const cards = UI.chapters.map(c => { const [d, t] = chProg(c.n); return `<a class="cc" href="#ch${c.n}" style="--c:${c.c}"><small>Bölüm ${c.n} · s.${c.pg[0]}-${c.pg[1]}</small><b>${c.t}</b><small>${t} konu, ${UI.qForChapter(c.n).length} soru</small><div class="bar"><i style="width:${t ? 100 * d / t : 0}%"></i></div></a>`; }).join('');
    main.innerHTML = `<div class="hero"><div class="tag">Kitabı gözünün önüne getir</div><h1>Malzeme Bilgisi Atlası</h1>
      <p class="lead">Yüksel–Meran, s.1-97. Her konu animasyon ya da elle oynayabileceğin bir şekille anlatılıyor; yanında kitaptaki sayfa var. Okuduğun sayfayı burada hareket ederken gör, sonra soruyla sına.</p></div>
      <div class="key"><ul><li>Sırayla ilerle. Her konunun altında <b>Anladım</b> butonu var; sınavdan önce işaretlemediklerine geri dön.</li><li>Şekilleri <b>sürükle, kaydırıcıyı oyna</b>. Aklında kalan şey hareket eden şeydir.</li><li><b>SINAVDA</b> kutuları ezberlenecek kısa bilgi. <b>AKLINDA CANLANSIN</b> kutuları benzetme.</li><li>Sayfa numarası (s.33 gibi) kitabın kendi numarasıdır.</li></ul></div>
      <div class="cards">${cards}</div>`;
  }

  function renderChapter(n) {
    const ch = window.CH[n], c = UI.chapters[n - 1];
    if (!ch) { main.innerHTML = '<div class="hero"><h1>' + c.t + '</h1><p class="lead">Bu bölüm henüz hazırlanıyor.</p></div>'; return; }
    main.style.setProperty('--ac', c.c);
    main.innerHTML = `<div class="hero"><div class="tag">Bölüm ${n} · s.${c.pg[0]}-${c.pg[1]}</div><h1>${c.t}</h1><p class="lead">${ch.intro}</p></div><div id="secs"></div>
      <div class="card"><header><h2>Bölümü sına</h2></header><p>Bu bölümün ${UI.qForChapter(n).length} sorusu. Cevaptan sonra kitaptaki sayfayı söyler.</p><a class="btn on" href="#q${n}" style="text-decoration:none;display:inline-block">Sorulara geç</a></div>
      <div class="hint" style="display:flex;justify-content:space-between;margin-top:24px">${n > 1 ? `<a href="#ch${n - 1}">← ${UI.chapters[n - 2].t}</a>` : '<span></span>'}${n < 7 ? `<a href="#ch${n + 1}">${UI.chapters[n].t} →</a>` : ''}</div>`;
    const secs = $('#secs', main);
    for (const s of ch.sections) {
      const box = document.createElement('section'); box.className = 'card'; box.id = 's-' + s.id;
      box.innerHTML = `<header><h2>${s.title}</h2><span class="pg">${s.pg}</span><button class="done${done[secKey(n, s.id)] ? ' on' : ''}">${done[secKey(n, s.id)] ? 'ANLADIM ✓' : 'ANLADIM'}</button></header><div class="body"></div>`;
      secs.appendChild(box);
      const btn = $('.done', box);
      btn.onclick = () => { const k = secKey(n, s.id); done[k] = !done[k]; UI.store.set('done', done); btn.classList.toggle('on', !!done[k]); btn.textContent = done[k] ? 'ANLADIM ✓' : 'ANLADIM'; paintTop(); buildSide('ch' + n); };
      try { s.build($('.body', box)); } catch (e) { $('.body', box).innerHTML = '<p class="hint">Bu bölüm yüklenemedi: ' + e.message + '</p>'; console.error(s.id, e); }
    }
  }

  function ozet() {
    main.innerHTML = '<div class="hero"><div class="tag">Sınavdan hemen önce</div><h1>Tek sayfa özet</h1><p class="lead">Sınavda en çok işe yarayacak sayılar ve karşılaştırmalar. Hepsinin kitaptaki sayfası yanında.</p></div><div id="oz"></div>';
    $('#oz', main).innerHTML = (window.OZET || '');
  }

  function route() {
    const h = (location.hash || '#home').slice(1);
    let cur = h;
    document.body.classList.remove('menu');
    if (/^ch[1-7]$/.test(h)) renderChapter(+h.slice(2));
    else if (/^q[1-7]$/.test(h)) { UI.quizPage(main, h.slice(1)); cur = 'ch' + h.slice(1); }
    else if (h === 'sinav' || h === 'yanlis') UI.quizPage(main, h);
    else if (h === 'ozet') ozet();
    else { cur = 'home'; home(); }
    buildSide(cur); paintTop(); window.scrollTo(0, 0); side.classList.remove('open');
  }
  $('#menuBtn').onclick = () => side.classList.toggle('open');
  window.addEventListener('hashchange', route);
  route();
})();
