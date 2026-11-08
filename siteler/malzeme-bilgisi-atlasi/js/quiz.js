/* Soru modu: bölüm soruları, karma 50 soruluk deneme, yanlışlarım */
(function () {
  const UI = window.UI, $ = UI.$;
  const Q = window.QBANK || [];
  const L = 'ABCDE';
  function shuffle(a, seed) { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
  UI.qForChapter = n => { const c = UI.chapters[n - 1]; return Q.filter(q => q.pg >= c.pg[0] && q.pg <= c.pg[1]); };
  UI.Q = Q;

  UI.quiz = function (root, list, opts) {
    opts = opts || {};
    let i = 0, score = 0, wrong = [], t0 = Date.now(), timer = null;
    const missed = new Set(UI.store.get('wrong', []));
    function saveWrong() { UI.store.set('wrong', [...missed]); }
    function finish() {
      clearInterval(timer);
      const ws = wrong.map(q => `<tr><td>${q.id}</td><td>${q.q}</td><td>${q.o[q.a]}</td><td>s.${q.p}</td></tr>`).join('');
      root.innerHTML = `<div class="qcard"><div class="sc">${score} / ${list.length}</div>
        <p>${score / list.length >= 0.8 ? 'Güçlü. Yanlışlarına bak, sayfasını bir kez daha tara.' : score / list.length >= 0.6 ? 'İyi gidiyor. Yanlış sayfaları bir kez daha oku.' : 'Önce yanlışların sayfalarını oku, sonra tekrar dene.'}</p>
        ${wrong.length ? `<div class="wrap"><table><tr><th>Soru</th><th>Metin</th><th>Doğru cevap</th><th>Sayfa</th></tr>${ws}</table></div>` : ''}
        <button class="btn" id="again">Yeniden başla</button></div>`;
      $('#again', root).onclick = () => UI.quiz(root, opts.redo ? opts.redo() : shuffle(list), opts);
    }
    function show() {
      if (i >= list.length) return finish();
      const q = list[i];
      const idx = q.o.map((_, k) => k); const order = shuffle(idx);
      const left = opts.minutes ? Math.max(0, opts.minutes * 60 - Math.round((Date.now() - t0) / 1000)) : null;
      root.innerHTML = `<div class="qcard"><div class="hint">Soru ${i + 1} / ${list.length} · ${q.id}${left != null ? ` · <span id="tm">${fmt(left)}</span>` : ''}</div>
        <div class="qt">${q.q}</div>
        ${order.map(k => `<button class="opt" data-k="${k}"><b>${L[order.indexOf(k)]})</b> ${q.o[k]}</button>`).join('')}
        <div class="fb" style="display:none"></div></div>`;
      const btns = root.querySelectorAll('.opt'), fb = $('.fb', root);
      btns.forEach(b => b.onclick = () => {
        const k = +b.dataset.k, ok = k === q.a;
        btns.forEach(x => { x.disabled = true; if (+x.dataset.k === q.a) x.classList.add('ok'); });
        if (!ok) { b.classList.add('no'); wrong.push(q); missed.add(q.id); } else { score++; missed.delete(q.id); }
        saveWrong();
        fb.style.display = 'block';
        fb.innerHTML = `<b>${ok ? 'Doğru.' : 'Yanlış.'}</b> ${q.w ? q.w + ' · ' : ''}Kitapta <b>s.${q.p}</b>.<br><span class="hint">${q.h || ''}</span><br><button class="btn" id="nx" style="margin-top:8px">${i + 1 >= list.length ? 'Sonucu gör' : 'Sonraki'}</button>`;
        $('#nx', root).onclick = () => { i++; show(); };
      });
    }
    function fmt(s) { return String(Math.floor(s / 60)).padStart(2, '0') + ':' + String(s % 60).padStart(2, '0'); }
    if (opts.minutes) { timer = setInterval(() => { const e = $('#tm', root); if (!e) { clearInterval(timer); return; } const left = Math.max(0, opts.minutes * 60 - Math.round((Date.now() - t0) / 1000)); e.textContent = fmt(left); if (!left) { clearInterval(timer); i = list.length; finish(); } }, 1000); }
    show();
  };

  UI.quizPage = function (main, kind) {
    main.innerHTML = '<div class="hero"><div class="tag">Soru modu</div><h1></h1><p class="lead"></p></div><div id="qroot"></div>';
    const h = $('h1', main), lead = $('.lead', main), root = $('#qroot', main);
    if (kind === 'sinav') {
      h.textContent = 'Deneme sınavı'; lead.textContent = 'Karma 50 soru, 50 dakika. Kitap kapalı, hızlı çöz. Yanlış doğruyu götürmediği için boş bırakma.';
      const mk = () => shuffle(Q).slice(0, 50);
      root.innerHTML = '<button class="btn on" id="go">Başlat (50 soru, 50 dk)</button>';
      $('#go', root).onclick = () => UI.quiz(root, mk(), { minutes: 50, redo: mk });
    } else if (kind === 'yanlis') {
      h.textContent = 'Yanlışlarım'; const ids = new Set(UI.store.get('wrong', []));
      const list = Q.filter(q => ids.has(q.id));
      lead.textContent = list.length ? `${list.length} sorunu daha doğru yapman gerekiyor. Doğru cevapladıkça listeden düşer.` : 'Henüz yanlış kaydın yok. Bölüm sorularını çöz.';
      if (list.length) UI.quiz(root, shuffle(list), {});
    } else {
      const n = +kind; const c = UI.chapters[n - 1]; h.textContent = `Bölüm ${n} soruları`; const list = UI.qForChapter(n);
      lead.textContent = `${c.t} (s.${c.pg[0]}-${c.pg[1]}): ${list.length} soru. Her cevaptan sonra kitaptaki sayfayı görürsün.`;
      UI.quiz(root, shuffle(list), { redo: () => shuffle(list) });
    }
  };
})();
