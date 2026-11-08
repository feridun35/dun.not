/* Sayfalar: #basla · #k-<kalıp>[/<soru>] · #alistirma */
'use strict';
const app = $('#app');
const done = store.get('done', {});
const markDone = k => { done[k] = 1; store.set('done', done); navDraw(); };

function navDraw() {
  const nav = $('#nav'); nav.innerHTML = '';
  const cur = location.hash.replace('#', '').split('/')[0] || 'basla';
  const add = (href, label, key) => nav.append(h('a', { href: '#' + href, class: (cur === href ? 'on ' : '') + (done[key] ? 'done' : '') }, label));
  add('basla', 'BAŞLA', 'basla');
  nav.append(h('span', { class: 'sep' }));
  for (const k of KALIP) add('k-' + k.id, k.no + ' ' + k.ad.toUpperCase(), k.id);
  nav.append(h('span', { class: 'sep' }));
  add('alistirma', 'ALIŞTIRMA', 'alistirma');
}

function quizBlock(items, key) {
  const box = h('div', { class: 'quiz' });
  items.forEach(([q, opts, ans, why], qi) => {
    const order = opts.map((o, i) => i).sort(() => Math.random() - 0.5);
    const card = h('div', { class: 'qz' }, TX('div', 'qq', (qi + 1) + '. ' + q));
    const row = h('div', { class: 'opts' }), fb = h('div', { class: 'fb' });
    for (const i of order) {
      const b = h('button', { class: 'opt' }); b.innerHTML = tx(opts[i]);
      b.addEventListener('click', () => {
        $$('.opt', row).forEach(x => x.disabled = true);
        b.classList.add(i === ans ? 'ok' : 'bad');
        if (i !== ans) $$('.opt', row)[order.indexOf(ans)].classList.add('ok');
        fb.innerHTML = tx((i === ans ? '<b class="okc">Doğru.</b> ' : '<b class="badc">Değil.</b> ') + why);
        if (i === ans && key) markDone(key);
      });
      row.append(b);
    }
    card.append(row, fb); box.append(card);
  });
  return box;
}

function textBlock(parts) {
  const wrap = h('div', { class: 'qtext' }), panel = h('div', { class: 'tap' }, TX('p', 'mut', 'İşaretli yerlere dokun: o ifadenin matematikteki karşılığı ve nedeni burada çıkar.'));
  const p = h('p');
  parts.forEach(seg => {
    if (typeof seg === 'string') { const sp = h('span'); sp.innerHTML = tx(seg.replace(/</g, '&lt;')); p.append(sp); return; }
    const [phrase, m, why] = seg;
    const s = h('span', { class: 'ph', tabindex: '0', role: 'button' });
    s.innerHTML = tx(phrase);
    const show = () => {
      $$('.ph', p).forEach(x => x.classList.remove('on')); s.classList.add('on'); s.classList.add('seen');
      panel.innerHTML = '';
      panel.append(TX('div', 'tapq', '“' + phrase + '”'), TX('div', 'tapm', '→ ' + m));
      if (why) panel.append(TX('div', 'tapw', why));
    };
    s.addEventListener('click', show); s.addEventListener('keydown', e => { if (e.key === 'Enter') show(); });
    p.append(s);
  });
  const all = h('button', { class: 'ghost', onclick: () => {
    panel.innerHTML = '';
    const t = h('table', { class: 't' }, h('tr', null, h('th', null, 'Cümlede'), h('th', null, 'Matematikte')));
    parts.filter(x => typeof x !== 'string').forEach(([a, b]) => t.append(h('tr', null, TX('td', null, a), TX('td', null, b))));
    panel.append(t); $$('.ph', p).forEach(x => x.classList.add('seen'));
  } }, 'Hepsini tablo olarak göster');
  wrap.append(p, panel, all);
  return wrap;
}

function stepsBlock(adim) {
  const box = h('div', { class: 'steps' }); let n = 0;
  const list = h('ol');
  const nextB = h('button', { class: 'btn' }, 'Sonraki adım'), allB = h('button', { class: 'ghost' }, 'Hepsini aç');
  const show = () => {
    list.innerHTML = '';
    adim.slice(0, n).forEach(([t, b], i) => list.append(h('li', { class: i === n - 1 ? 'new' : '' }, h('b', null, t), TX('div', null, b))));
    nextB.disabled = n >= adim.length; nextB.textContent = n === 0 ? 'Başla: 1. adım' : n >= adim.length ? 'Denklem kuruldu' : 'Sonraki adım (' + (n + 1) + '/' + adim.length + ')';
  };
  nextB.addEventListener('click', () => { n = Math.min(adim.length, n + 1); show(); });
  allB.addEventListener('click', () => { n = adim.length; show(); });
  show();
  box.append(TX('p', 'mut', 'Önce kendin düşün: bu adımda ne yazardın? Sonra aç.'), list, h('div', { class: 'row' }, nextB, allB));
  return box;
}

function kalipPage(K, qid) {
  const Q = K.sorular.find(q => q.id === qid) || K.sorular[0];
  app.innerHTML = '';
  const hero = h('div', { class: 'hero' },
    h('div', { class: 'kicker' }, 'KALIP ' + K.no),
    h('h1', null, K.ad),
    TX('div', 'big', K.kalip),
    h('div', { class: 'chips' }, h('span', { class: 'mut' }, 'Nasıl tanırım: '), ...K.tani.map(t => TX('span', 'chip', t))));
  app.append(hero);
  app.append(h('section', null, h('h2', null, 'Neden bu orantı?'), TX('div', null, K.neden)));

  const tabs = h('div', { class: 'seg qtabs' });
  K.sorular.forEach(q => tabs.append(h('a', { href: '#k-' + K.id + '/' + q.id, class: q.id === Q.id ? 'on' : '' }, q.ad)));
  app.append(h('div', { class: 'tabwrap' }, h('div', { class: 'mut small' }, K.sorular.length > 1 ? 'Bu kalıbın soruları:' : 'Bu kalıbın sorusu:'), tabs));

  app.append(h('section', null, h('h2', null, '1 · Soruyu oku'), h('div', { class: 'src' }, Q.kaynak), textBlock(Q.metin)));
  app.append(h('section', null, h('h2', null, '2 · Denklemi kur'), stepsBlock(Q.adim)));

  const simBox = h('div');
  const simSec = h('section', null, h('h2', null, '3 · Canlı model: ne değişirse ne değişir?'), TX('p', 'mut', 'Kaydırıcılarla oyna. Kırmızı kesikli çizgi o anki eğim, yani türev; denklem tam olarak bu eğimi anlatır.'), simBox);
  app.append(simSec);
  const sim = SIM[K.sim](simBox, Object.assign({}, K.simOpt, Q.simOpt || {}, Q.sim));
  sim.set(Q.sim);
  const wf = h('div', { class: 'whatif' }), wfText = h('div', { class: 'wftext' });
  K.degis.forEach(([l, set, t]) => {
    const b = h('button', { class: 'ghost' }); b.innerHTML = tx(l);
    b.addEventListener('click', () => { sim.set(set); wfText.innerHTML = tx(t); $$('button', wf).forEach(x => x.classList.remove('on')); b.classList.add('on'); });
    wf.append(b);
  });
  wf.append(h('button', { class: 'ghost', onclick: () => { sim.set(Q.sim); wfText.innerHTML = tx('Sorudaki değerlere döndü.'); $$('button', wf).forEach(x => x.classList.remove('on')); } }, 'Sorudaki değerlere dön'));
  simSec.append(h('h3', null, 'Dene: ne olur?'), wf, wfText);

  app.append(h('section', null, h('h2', null, '4 · Kendini dene'), quizBlock(Q.test, K.id)));
  const det = h('details', { class: 'sol' }, h('summary', null, 'Çözüm ve sonuç (kurduktan sonra bakmak için)'), TX('div', null, Q.cozum));
  app.append(h('section', null, det));

  const i = KALIP.indexOf(K), prev = KALIP[i - 1], next = KALIP[i + 1];
  app.append(h('div', { class: 'pn' },
    prev ? h('a', { href: '#k-' + prev.id }, '← ' + prev.no + ' ' + prev.ad) : h('a', { href: '#basla' }, '← Başla'),
    next ? h('a', { href: '#k-' + next.id }, next.no + ' ' + next.ad + ' →') : h('a', { href: '#alistirma' }, 'Alıştırma →')));
}

function baslaPage() {
  app.innerHTML = '';
  app.append(h('div', { class: 'hero' }, h('div', { class: 'kicker' }, 'MAT 219 · 3. HAFTA · MODELLEME'), h('h1', null, 'Denklemi kurmak'),
    TX('p', 'sub', 'Modelleme sorusunda zor olan çözüm değil, <b>cümleyi denkleme çevirmek</b>. Bu site her örnekte üç şeyi gösteriyor: neye ne deniyor, neden onunla orantılı, bir şey değişince ne değişiyor. Örnekler hocanın 3. hafta slaytlarından ve senin notlarından.')));

  const steps = h('ol', { class: 'tarif' });
  TARIF.forEach(([t, b]) => steps.append(h('li', null, h('b', null, t), TX('div', null, b))));
  app.append(h('section', null, h('h2', null, 'Kurma tarifi · her soruda aynı 6 adım'), steps));

  const simBox = h('div');
  app.append(h('section', null, h('h2', null, '"Orantılı" ne demek?'),
    TX('p', null, 'Biri iki katına çıkınca öteki de iki katına çıkıyorsa doğru orantılıdır: $y\\propto x$. Orantıyı eşitliğe çevirmek için bir sabit koyarız: $y=k\\,x$. Ters orantıda biri iki katına çıkınca öteki yarıya iner. Diferansiyel denklemde orantılı olan şey <b>hız</b>, yani türevdir: "artış hızı miktarla orantılı" → $\\frac{dy}{dt}=k\\,y$.'), simBox));
  SIM.oranti(simBox);

  const t = h('table', { class: 't' }, h('tr', null, h('th', null, 'Soruda geçerse'), h('th', null, 'Yaz'), h('th', null, 'Not')));
  SOZLUK.forEach(([a, b, c]) => t.append(h('tr', null, TX('td', null, a), TX('td', null, b), TX('td', 'mut', c))));
  app.append(h('section', null, h('h2', null, 'Çeviri sözlüğü'), h('div', { class: 'tablewrap' }, t)));

  const grid = h('div', { class: 'grid' });
  KALIP.forEach(k => grid.append(h('a', { class: 'kc', href: '#k-' + k.id },
    h('div', { class: 'kno' }, 'KALIP ' + k.no + (done[k.id] ? ' · ✓' : '')), h('div', { class: 'kad' }, k.ad), TX('div', 'kf', k.kalip),
    TX('div', 'mut small', k.tani.join(' · ')), h('div', { class: 'small' }, k.sorular.map(q => q.ad).join(' · ')))));
  app.append(h('section', null, h('h2', null, 'Hangi kalıp? Soruda ne görürsen'), grid));
  markDone('basla');
}

function alistirmaPage() {
  app.innerHTML = '';
  const sc = store.get('score', { ok: 0, n: 0 });
  const score = h('div', { class: 'score' });
  const drawScore = () => score.innerHTML = `Bu cihazda: <b>${sc.ok}</b> / ${sc.n} doğru`;
  drawScore();
  app.append(h('div', { class: 'hero' }, h('div', { class: 'kicker' }, 'ALIŞTIRMA'), h('h1', null, 'Cümle → denklem'),
    TX('p', 'sub', 'Her soru yeniden üretilir: bağlam ve sayılar değişir, kalıp aynı kalır. Çözme yok, yalnız kurulum. Yanlış şıkkın neden yanlış olduğunu da gösterir.'), score));
  const box = h('section');
  app.append(box);
  let filt = 'hepsi';
  const fbar = h('div', { class: 'seg' });
  [['hepsi', 'Karışık'], ...KALIP.map(k => [k.id, k.no + ' ' + k.ad]), ['basla', 'Koşul çevirme']].forEach(([id, l]) => {
    const b = h('button', { class: id === filt ? 'on' : '' }, l);
    b.addEventListener('click', () => { filt = id; $$('button', fbar).forEach(x => x.classList.remove('on')); b.classList.add('on'); next(); });
    fbar.append(b);
  });
  app.insertBefore(h('div', { class: 'tabwrap' }, fbar), box);
  function next() {
    let q, guard = 0;
    do { q = pick(GEN)(); } while (filt !== 'hepsi' && q.kalip !== filt && ++guard < 200);
    if (filt !== 'hepsi' && q.kalip !== filt) { box.innerHTML = ''; box.append(TX('p', 'mut', 'Bu kalıp için üretici yok; Karışık\'ı dene.')); return; }
    box.innerHTML = '';
    const K = KALIP.find(k => k.id === q.kalip);
    box.append(h('div', { class: 'src' }, K ? 'Kalıp ' + K.no + ' · ' + K.ad : 'Koşul çevirme'), TX('div', 'qq big2', q.soru));
    const opts = [[q.dogru, null], ...q.yanlis].sort(() => Math.random() - 0.5);
    const row = h('div', { class: 'opts col' }), fb = h('div', { class: 'fb' });
    opts.forEach(([o, why]) => {
      const b = h('button', { class: 'opt' }); b.innerHTML = tx(o);
      b.addEventListener('click', () => {
        $$('.opt', row).forEach(x => x.disabled = true);
        const ok = why == null; sc.n++; if (ok) sc.ok++; store.set('score', sc); drawScore();
        b.classList.add(ok ? 'ok' : 'bad');
        $$('.opt', row)[opts.findIndex(x => x[1] == null)].classList.add('ok');
        fb.innerHTML = tx((ok ? '<b class="okc">Doğru.</b> ' : '<b class="badc">Değil:</b> ' + why + '<br>') + ' <span class="mut">' + q.not + '</span>');
        if (ok) markDone('alistirma');
      });
      row.append(b);
    });
    box.append(row, fb, h('div', { class: 'row' }, h('button', { class: 'btn', onclick: next }, 'Yeni soru'), K ? h('a', { class: 'ghost lnk', href: '#k-' + K.id }, 'Bu kalıbı aç') : null));
  }
  next();
}

function route() {
  const [p, q] = location.hash.replace('#', '').split('/');
  window.scrollTo(0, 0);
  if (p && p.startsWith('k-')) { const K = KALIP.find(k => 'k-' + k.id === p); if (K) kalipPage(K, q); else baslaPage(); }
  else if (p === 'alistirma') alistirmaPage();
  else baslaPage();
  navDraw();
}
window.addEventListener('hashchange', route);
route();
