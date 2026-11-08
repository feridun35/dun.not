'use strict';
/* ---------- yönlendirme ---------- */
function buildNav() {
  const nav = document.getElementById('nav'), cur = (location.hash || '#ana').slice(1).split('-')[0];
  nav.innerHTML = [['ana', 'ANA'], ['rehber', 'REHBER'], ['fikir', '5 FİKİR']].map(([k, t]) => `<a href="#${k}" class="${cur === k ? 'on' : ''}">${t}</a>`).join('')
    + `<span class="sep"></span>` + PROBS.map(P => `<a href="#${P.id}" class="pn ${cur === P.id ? 'on' : ''} ${store.get('done:' + P.id, false) ? 'done' : ''}" title="${P.ad}">P${P.no}</a>`).join('')
    + `<span class="sep"></span><a href="#cikmis" class="${cur === 'cikmis' || /^v\d/.test(cur) ? 'on' : ''}">ÇIKMIŞ VİZE</a><a href="#test" class="${cur === 'test' ? 'on' : ''}">TEST</a><a href="../Mukavemet Atlası/index.html" class="ext" title="Konu atlası">ATLAS ↗</a>`;
}

function route() {
  if (ACTIVE) { ACTIVE.view.stop(); ACTIVE.view.ro.disconnect(); ACTIVE = null; }
  const h = (location.hash || '#ana').slice(1), [page, sub] = h.split('-');
  const app = document.getElementById('app');
  const P = PROBS.find(x => x.id === page) || VIZE.find(x => x.id === page);
  if (P) { app.innerHTML = renderProblem(P); mountProblem(P); document.title = `${P.kod || 'P' + P.no} · ${P.ad} · Soru Atölyesi`; }
  else if (PAGES[page]) { app.innerHTML = PAGES[page](sub); document.title = 'Soru Atölyesi'; if (page === 'rehber') mountRehber(sub); if (page === 'fikir') mountFikir(); if (page === 'test') mountTest(); }
  else { location.hash = '#ana'; return; }
  buildNav();
  if (!(page === 'rehber' && sub)) window.scrollTo(0, 0);
}
window.addEventListener('hashchange', route);
window.addEventListener('keydown', e => { if (ACTIVE && !/INPUT|TEXTAREA/.test(document.activeElement.tagName)) ACTIVE.key(e); });
window.addEventListener('DOMContentLoaded', route);
