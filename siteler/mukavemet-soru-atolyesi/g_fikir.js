'use strict';
/* ---------- 5 fikir ---------- */
PAGES.fikir = () => `
  <section class="hero center">
    <div class="kicker">FORMÜL KÂĞIDI YOK</div><h1>5 FİKİR</h1>
    <p class="sub">Bu sorulardaki bütün formüller beş fikirden çıkıyor. Fikri anlarsan formülü yeniden kurarsın.</p>
  </section>
  <section class="card"><h2><span class="n">1</span> GERİLME = KUVVET ÷ YÜZEY</h2>
    <p>Gerilme, kuvvetin yüzeye ne kadar yoğun dağıldığı. Tek soru: <b>hangi yüzey?</b></p>
    <div class="idea">
      <div><b>Normal (σ)</b><span>Kuvvete dik kesit. Çekmede delik varsa net kesit.</span><code>σ = F / A</code></div>
      <div><b>Kayma (τ)</b><span>Kayan, kesilen yüzey. Silindir yüzeyi: çevre × kalınlık.</span><code>τ = F / (π·d·t)</code></div>
      <div><b>Pim kesmesi</b><span>Pimin kesilen daire kesiti; iki yerden kesiliyorsa iki kat.</span><code>τ = F / (2·πd²/4)</code></div>
    </div></section>
  <section class="card"><h2><span class="n">2</span> MALZEME BİR YAYDIR</h2>
    <p>Bir çubuğu çekince yay gibi uzar. 1 N'luk kuvvette ne kadar uzadığına <b>esneklik f</b> diyelim. Uzun çubuk daha yumuşak, kalın ve sert (büyük E) çubuk daha az uzar. Bunu düşünürsen kesrin yeri kendiliğinden oturur:</p>
    <div class="formula">f = L / (E · A)      δ = F · f = F · L / (E · A)</div>
    <div class="wi"><div class="wi-ctl" id="fk"></div><div class="wi-out" id="fko"></div></div>
    <p class="note">σ = E·ε (Hooke) da aynı fikir: σ = F/A, ε = δ/L yerine koyunca δ = FL/(EA) çıkar.</p></section>
  <section class="card"><h2><span class="n">3</span> ISINAN ŞEY UZAMAK İSTER</h2>
    <p>Isınan çubuğun her milimetresi, her 1 °C için α kadar uzar. Serbestse gerilme <b>yok</b>; uzaması engellenirse engelleyen kuvvet doğar (ısınıp engellenen çubuk bası görür).</p>
    <div class="formula">δ<sub>T</sub> = α · ΔT · L        (engellenince: F = δ<sub>T</sub> / Σf, Σf = toplam esneklik)</div></section>
  <section class="card"><h2><span class="n">4</span> DENGE: TOPLAM KUVVET VE MOMENT SIFIR</h2>
    <p>Duran her parça için ΣF = 0, ΣM = 0. Püf noktası: <b>momenti bir bilinmeyenin üstünden al</b>, o bilinmeyen denklemden düşer.</p>
    <div class="formula">ΣF<sub>y</sub> = 0     ΣM<sub>nokta</sub> = 0  (kuvvet × dik uzaklık)</div></section>
  <section class="card"><h2><span class="n">5</span> UYGUNLUK: PARÇALAR BİRBİRİNE UYMAK ZORUNDA</h2>
    <p>Denge yetmezse (hiperstatik) ikinci denklem geometriden gelir. Bu sorularda üç hali var:</p>
    <div class="idea">
      <div><b>İki ucu tutulu</b><span>Toplam boy değişmez.</span><code>Σδ = 0</code></div>
      <div><b>Cıvata – boru</b><span>Uzama + kısalma = somun ilerlemesi.</span><code>δç + δal = Δ</code></div>
      <div><b>Rijit kiriş</b><span>Noktalar bir doğru üzerinde kalır.</span><code>δ = x · θ</code></div>
    </div></section>
  <section class="card"><h2><span class="n">=</span> HANGİ FORMÜL HANGİ FİKİRDEN</h2>
    <div class="map">
      ${[['Net alan (b − d)·t', '1', 'Delik malzeme değil.'], ['Kayma alanı π·d·t', '1', 'Silindir yüzeyini aç: dikdörtgen.'], ['δ = FL/(EA)', '2', 'Yay fikri.'], ['σ = E·ε', '2', 'Aynı fikrin birim hali.'], ['σ_T = E·α·ΔT (iki ucu tutulu, tek parça)', '2+3+5', 'Serbest ısıl uzama α·ΔT·L, kuvvetle geri bastırılır; ısınırsa bası.'], ['R_B = P·f₂/(f₁+f₂)', '2+4+5', 'Üst plaka olmasa yük alt parçayı sıkıştırır, uç aşağı iner (boşluk P·f₂); R_B çubuğu geri çekip bu boşluğu kapatır.'], ['F = Δ/(f_ç + f_al)', '2+4+5', 'Eşit kuvvet, toplam boy değişimi.'], ['δ_E = δ_B − (δ_B − δ_C)·BE/BC', '5', 'Rijit doğru: benzer üçgen.'], ['P_izin = P_U / E.K.', '—', 'Emniyet tanımı: kopma yükünün E.K. kadar altı.']]
        .map(([a, b, c]) => `<div class="mr"><code>${a}</code><span class="ti">fikir ${b}</span><span>${c}</span></div>`).join('')}
    </div></section>`;

function mountFikir() {
  const q = { F: 10, L: 500, A: 200, E: 200 };
  const S = [{ k: 'F', ad: 'Kuvvet F', min: 1, max: 50, step: 1, u: 'kN' }, { k: 'L', ad: 'Boy L', min: 100, max: 2000, step: 50, u: 'mm' }, { k: 'A', ad: 'Alan A', min: 50, max: 1000, step: 10, u: 'mm²' }, { k: 'E', ad: 'E', min: 50, max: 210, step: 5, u: 'GPa' }];
  const ctl = document.getElementById('fk'), out = document.getElementById('fko');
  ctl.innerHTML = S.map(s => `<div class="sl"><label>${s.ad}</label><input type="range" data-k="${s.k}" min="${s.min}" max="${s.max}" step="${s.step}" value="${q[s.k]}"><span class="v" id="fv-${s.k}"></span></div>`).join('');
  const draw = () => {
    S.forEach(s => document.getElementById('fv-' + s.k).textContent = fmt(q[s.k], 2) + ' ' + s.u);
    const f = q.L / (q.E * 1000 * q.A), d = q.F * 1000 * f, eps = d / q.L, ex = Math.min(60, eps * 500 * 100), bw = 20 + 50 * (q.L - 100) / 1900;
    out.innerHTML = `<div class="mets"><div class="m"><small>esneklik f</small><b>${fmt(f * 1e6, 3)}·10⁻⁶ mm/N</b></div><div class="m red"><small>uzama δ</small><b>${f3(d)} mm</b></div><div class="m"><small>gerilme σ</small><b>${f1(q.F * 1000 / q.A)} MPa</b></div></div>
      <div class="spring"><div style="width:${bw}%;display:flex;align-items:center"><div class="sp-bar" style="flex:1;min-width:0"></div><div class="sp-bar" style="width:${ex}%;min-width:3px;background:var(--red)"></div></div><span>kırmızı: uzama, 500 kat abartılı</span></div>`;
  };
  ctl.querySelectorAll('input').forEach(i => i.addEventListener('input', () => { q[i.dataset.k] = +i.value; draw(); }));
  draw();
}
