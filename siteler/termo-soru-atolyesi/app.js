"use strict";
/* ═════════════ yardımcılar ═════════════ */
const $ = (s, r = document) => r.querySelector(s);
const g = 9.81;
const rnd = (a, b, st = 1) => Math.round((a + Math.random() * (b - a)) / st) * st;
const pick = a => a[Math.floor(Math.random() * a.length)];
const r2 = (x, d) => Math.round(x * 10 ** d) / 10 ** d;
function f(x, d) { // ekranda sayı
  if (d === undefined && x !== 0 && Math.abs(x) < 0.001) return String(+(+x).toPrecision(3)); // çok küçük x: 3 anlamlı basamak
  if (d === undefined) { const a = Math.abs(x); d = a >= 1000 ? 1 : a >= 100 ? 2 : a >= 10 ? 3 : a >= 1 ? 4 : a >= 0.01 ? 5 : 6; }
  let s = (+x).toFixed(d);
  if (s.includes(".")) s = s.replace(/0+$/, "").replace(/\.$/, "");
  return s;
}
const keysN = o => Object.keys(o).map(Number).sort((a, b) => a - b);
function lin(x, x0, x1, y0, y1) { return y0 + (x - x0) / (x1 - x0) * (y1 - y0); }
function interpTable(tab, key, col) { // tablo anahtarına göre doğrusal
  const ks = keysN(tab);
  for (let i = 0; i < ks.length - 1; i++) if (key >= ks[i] && key <= ks[i + 1]) return lin(key, ks[i], ks[i + 1], tab[ks[i]][col], tab[ks[i + 1]][col]);
  return NaN;
}
const store = {
  k: "termo-atolye-v1",
  get() { try { return JSON.parse(localStorage.getItem(this.k)) || {}; } catch (e) { return {}; } },
  set(o) { try { localStorage.setItem(this.k, JSON.stringify(o)); } catch (e) { } },
  upd(fn) { const o = this.get(); fn(o); this.set(o); }
};
const REG = { comp: "Sıkıştırılmış sıvı", mix: "Doymuş karışım", sup: "Kızgın buhar", sf: "Doymuş sıvı", sg: "Doymuş buhar" };

/* ═════════════ T-v diyagramı (su, gerçek ölçek, log v) ═════════════ */
const DOME = (() => {
  const rows = keysN(A4).map(T => [T, A4[T][1], A4[T][2]]);
  rows.push([350, 0.001741, 0.008803]);
  return rows;
})();
const CRIT = [373.95, 0.003106];
function vfAt(T) { for (let i = 0; i < DOME.length - 1; i++) if (T >= DOME[i][0] && T <= DOME[i + 1][0]) return lin(T, DOME[i][0], DOME[i + 1][0], DOME[i][1], DOME[i + 1][1]); return T < 25 ? 0.001 : CRIT[1]; }
function vgAt(T) { for (let i = 0; i < DOME.length - 1; i++) if (T >= DOME[i][0] && T <= DOME[i + 1][0]) return Math.exp(lin(T, DOME[i][0], DOME[i + 1][0], Math.log(DOME[i][2]), Math.log(DOME[i + 1][2]))); return CRIT[1]; }
function tvSVG(sp) {
  const W = 620, H = 370, l = 52, r = 112, t = 18, b = 44, X0 = -3.15, X1 = 1.75;
  const xv = v => l + (Math.log10(v) - X0) / (X1 - X0) * (W - l - r);
  const yT = T => H - b - T / 400 * (H - t - b);
  const P = (v, T) => `${xv(v).toFixed(1)},${yT(T).toFixed(1)}`;
  let s = `<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" font-family="Bahnschrift,Barlow Condensed,Segoe UI,sans-serif" font-size="12">
<defs><marker id="ar" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="#ff2d20"/></marker></defs>`;
  // eksenler
  s += `<line x1="${l}" y1="${H - b}" x2="${W - r + 8}" y2="${H - b}" stroke="#8e99a6"/><line x1="${l}" y1="${H - b}" x2="${l}" y2="${t - 4}" stroke="#8e99a6"/>`;
  for (let T = 0; T <= 400; T += 100) s += `<text x="${l - 8}" y="${yT(T) + 4}" fill="#8e99a6" text-anchor="end">${T}</text><line x1="${l}" x2="${W - r}" y1="${yT(T)}" y2="${yT(T)}" stroke="#2a323c" stroke-dasharray="2 4"/>`;
  [0.001, 0.01, 0.1, 1, 10].forEach(v => s += `<text x="${xv(v)}" y="${H - b + 16}" fill="#8e99a6" text-anchor="middle">${v}</text>`);
  s += `<text x="${l + 8}" y="${t + 8}" fill="#c9d0d8">T (°C)</text><text x="${W - r}" y="${H - 8}" fill="#c9d0d8" text-anchor="end">v (m³/kg, log)</text>`;
  // kubbe
  let left = DOME.map(d => P(d[1], d[0])).join(" ") + " " + P(CRIT[1], CRIT[0]);
  let right = DOME.slice().reverse().map(d => P(d[2], d[0])).join(" ");
  s += `<polyline points="${left} ${right}" fill="rgba(255,255,255,.035)" stroke="#fff" stroke-width="1.6"/>`;
  s += `<circle cx="${xv(CRIT[1])}" cy="${yT(CRIT[0])}" r="3" fill="#fff"/><text x="${xv(CRIT[1]) + 6}" y="${yT(CRIT[0]) - 4}" fill="#c9d0d8">KN</text>`;
  s += `<text transform="translate(${xv(0.00086)},${yT(150)}) rotate(-90)" fill="#8e99a6" font-size="10" text-anchor="middle">sıkıştırılmış sıvı</text>`;
  s += `<text x="${xv(0.05)}" y="${yT(60)}" fill="#8e99a6" font-size="11" text-anchor="middle">doymuş karışım</text>`;
  s += `<text x="${xv(3)}" y="${yT(330)}" fill="#8e99a6" font-size="11" text-anchor="middle">kızgın buhar</text>`;
  // izobarlar
  const placed = [[xv(0.05), yT(60)], [xv(3), yT(330)]]; // bölge yazılarıyla da çakışmasın
  (sp.isobars || []).forEach(ib => {
    let Ts, lab, sup = null;
    if (ib.P !== undefined) { Ts = A5[ib.P][0]; lab = ib.P >= 1000 ? (ib.P / 1000) + " MPa" : ib.P + " kPa"; if (A6[ib.P]) sup = keysN(A6[ib.P]).filter(T => T > Ts).map(T => [A6[ib.P][T][0], T]); }
    else { Ts = ib.T; lab = ib.lab || (A4[ib.T] ? A4[ib.T][0] + " kPa" : ""); }
    const vg = vgAt(Ts), vf = vfAt(Ts);
    let pts = []; for (let T = 25; T < Ts; T += 10) pts.push(P(vfAt(T) * 0.985, T));
    pts.push(P(vf, Ts), P(vg, Ts));
    let dash = "";
    if (sup && sup.length) sup.forEach(q => pts.push(P(q[0], q[1])));
    else { dash = ""; for (let T = Ts + 20; T <= 400; T += 20) pts.push(P(vg * (T + 273.15) / (Ts + 273.15), T)); }
    s += `<polyline points="${pts.join(" ")}" fill="none" stroke="#8e99a6" stroke-width="1.1" stroke-dasharray="5 3"/>`;
    let lx = xv(Math.sqrt(vf * vg)), ly = yT(Ts) - 4;
    while (placed.some(q => Math.abs(q[1] - ly) < 13 && Math.abs(q[0] - lx) < 80)) lx += 82;
    placed.push([lx, ly]);
    s += `<text x="${lx}" y="${ly}" fill="#c9d0d8" font-size="11" text-anchor="middle">P = ${lab}</text>`;
  });
  if (sp.path) {
    for (let i = 0; i < sp.path.length - 1; i++) {
      const a = sp.path[i], c = sp.path[i + 1];
      s += `<line x1="${xv(a[0])}" y1="${yT(a[1])}" x2="${xv(c[0])}" y2="${yT(c[1])}" stroke="#ff2d20" stroke-width="2.2" ${i === sp.path.length - 2 ? 'marker-end="url(#ar)"' : ""}/>`;
    }
  }
  (sp.pts || []).forEach(p => {
    s += `<circle cx="${xv(p.v)}" cy="${yT(p.T)}" r="4.5" fill="#ff2d20" stroke="#0b0e12"/>`;
    s += `<text x="${xv(p.v) + 8}" y="${yT(p.T) - 7}" fill="#fff" font-size="13" font-weight="600">${p.l}</text>`;
  });
  return s + `</svg>`;
}
/* P-V diyagramı (iş = alan) */
function pvSVG(sp) {
  const W = 600, H = 330, l = 60, r = 30, t = 20, b = 46;
  const Vs = sp.pts.map(p => p[0]), Ps = sp.pts.map(p => p[1]);
  const Vm = Math.max(...Vs) * 1.15, Pm = Math.max(...Ps) * 1.25;
  const xv = V => l + V / Vm * (W - l - r), yP = p => H - b - p / Pm * (H - t - b);
  let s = `<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" font-family="Bahnschrift,Barlow Condensed,Segoe UI,sans-serif" font-size="12">
<defs><pattern id="hh" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><line x1="0" y1="0" x2="0" y2="8" stroke="rgba(255,45,32,.35)" stroke-width="2"/></pattern>
<marker id="ar2" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#ff2d20"/></marker></defs>`;
  s += `<line x1="${l}" y1="${H - b}" x2="${W - r + 10}" y2="${H - b}" stroke="#8e99a6"/><line x1="${l}" y1="${H - b}" x2="${l}" y2="${t - 6}" stroke="#8e99a6"/>`;
  s += `<text x="${l - 50}" y="${t + 2}" fill="#c9d0d8">P (kPa)</text><text x="${W - r}" y="${H - 8}" fill="#c9d0d8" text-anchor="end">V (m³)</text>`;
  const poly = sp.pts.map(p => `${xv(p[0])},${yP(p[1])}`).join(" ") + ` ${xv(Vs[Vs.length - 1])},${yP(0)} ${xv(Vs[0])},${yP(0)}`;
  s += `<polygon points="${poly}" fill="url(#hh)" stroke="none"/>`;
  for (let i = 0; i < sp.pts.length - 1; i++) {
    const a = sp.pts[i], c = sp.pts[i + 1];
    s += `<line x1="${xv(a[0])}" y1="${yP(a[1])}" x2="${xv(c[0])}" y2="${yP(c[1])}" stroke="#ff2d20" stroke-width="2.4" marker-end="url(#ar2)"/>`;
  }
  const seen = new Set();
  sp.pts.forEach(p => {
    s += `<line x1="${xv(p[0])}" y1="${yP(p[1])}" x2="${xv(p[0])}" y2="${yP(0)}" stroke="#8e99a6" stroke-dasharray="3 3"/>`;
    if (!seen.has(p[1])) { seen.add(p[1]); s += `<line x1="${l}" y1="${yP(p[1])}" x2="${xv(p[0])}" y2="${yP(p[1])}" stroke="#2a323c" stroke-dasharray="3 3"/><text x="${l - 6}" y="${yP(p[1]) + 4}" fill="#c9d0d8" text-anchor="end">${f(p[1])}</text>`; }
    s += `<text x="${xv(p[0])}" y="${H - b + 16}" fill="#c9d0d8" text-anchor="middle">${f(p[0])}</text>`;
    s += `<circle cx="${xv(p[0])}" cy="${yP(p[1])}" r="4.5" fill="#ff2d20" stroke="#0b0e12"/><text x="${xv(p[0]) + 6}" y="${yP(p[1]) - 8}" fill="#fff" font-size="13" font-weight="600">${p[2]}</text>`;
  });
  if (sp.split !== undefined) {
    s += `<line x1="${xv(Vs[0])}" y1="${yP(sp.split)}" x2="${xv(Vs[Vs.length - 1])}" y2="${yP(sp.split)}" stroke="#fff" stroke-dasharray="4 3"/>`;
    s += `<text x="${(xv(Vs[0]) + xv(Vs[1])) / 2}" y="${yP(sp.split / 2)}" fill="#fff" text-anchor="middle" font-size="13">${sp.splitLab[0]}</text>`;
    s += `<text x="${xv(Vs[0]) + (xv(Vs[1]) - xv(Vs[0])) * 0.66}" y="${yP(sp.split) - 8}" fill="#fff" text-anchor="middle" font-size="12">${sp.splitLab[1]}</text>`;
  } else (sp.areas || []).forEach(a => {
    const p0 = sp.pts[a[1]], p1 = sp.pts[a[2]];
    s += `<text x="${(xv(p0[0]) + xv(p1[0])) / 2}" y="${yP(Math.min(p0[1], p1[1]) / 2)}" fill="#fff" text-anchor="middle" font-size="13" font-weight="600">${a[0]}</text>`;
  });
  return s + `</svg>`;
}
/* şematik T-v (R-134a gibi tablosu sitede olmayanlar için) */
function schemSVG(sp) {
  const W = 560, H = 320;
  const L = t => [70 + (230 - 70) * (1 - (1 - t) ** 1.8), 300 - 250 * Math.sin(t * Math.PI / 2) ** 1.4];
  const R = t => [230 + (540 - 230) * t ** 0.85, 50 + 240 * (1 - (1 - t) ** 1.6)];
  const Lp = [], Rp = [];
  for (let i = 0; i <= 40; i++) { Lp.push(L(i / 40)); Rp.push(R(i / 40)); }
  const xAtY = (arr, y) => { let best = arr[0]; arr.forEach(p => { if (Math.abs(p[1] - y) < Math.abs(best[1] - y)) best = p; }); return best[0]; };
  let s = `<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" font-family="Bahnschrift,Barlow Condensed,Segoe UI,sans-serif" font-size="12">`;
  s += `<line x1="40" y1="305" x2="${W - 10}" y2="305" stroke="#8e99a6"/><line x1="40" y1="305" x2="40" y2="20" stroke="#8e99a6"/><text x="46" y="24" fill="#c9d0d8">T</text><text x="${W - 14}" y="298" fill="#c9d0d8" text-anchor="end">v</text>`;
  s += `<polyline points="${Lp.map(p => p.join(",")).join(" ")} ${Rp.map(p => p.join(",")).join(" ")}" fill="rgba(255,255,255,.035)" stroke="#fff" stroke-width="1.6"/>`;
  s += `<text x="236" y="44" fill="#c9d0d8">KN</text><text x="${W / 2}" y="${H - 2}" fill="#8e99a6" text-anchor="middle" font-size="11">${sp.title || "şematik"}</text>`;
  (sp.iso || []).forEach(ib => {
    const y = 300 - ib.y * 250, xl = xAtY(Lp, y), xr = xAtY(Rp, y);
    s += `<polyline points="${xl - 6},${y + 90} ${xl},${y} ${xr},${y} ${Math.min(xr + 120, W - 20)},${y - 70}" fill="none" stroke="#8e99a6" stroke-dasharray="5 3"/><text x="${Math.min(xr + 60, W - 120)}" y="${y - 44}" fill="#c9d0d8" font-size="11">P = ${ib.lab}</text>`;
    (sp.pts || []).forEach(p => { if (p.r === "mix") { const x = xl + (xr - xl) * p.x; s += `<circle cx="${x}" cy="${y}" r="4.5" fill="#ff2d20"/><text x="${x + 7}" y="${y - 8}" fill="#fff" font-weight="600">${p.l}</text>`; } });
  });
  return s + `</svg>`;
}
function dia(sp) { if (!sp) return ""; return `<div class="dia">${sp.kind === "tv" ? tvSVG(sp) : sp.kind === "pv" ? pvSVG(sp) : schemSVG(sp)}</div>`; }

/* ═════════════ alıştırma üreticileri ═════════════ */
// her biri: {title, tip, refs, make()} → {text, ask:[{k,lab,unit,val,tol,type,opts,traps}], steps:[], dia}
const GEN = {};
const tolR = (r) => ({ rel: r });
GEN.basinc = { title: "Basınç: manometre, vakum, barometre, derinlik", refs: ["tk2", "tk3", "tk4", "tk6", "tk7"], make() {
  const v = pick(["mano", "mano", "vakum", "baro", "derin"]);
  if (v === "mano") {
    const rho = pick([850, 900, 1000, 13600]), h = rho === 13600 ? rnd(4, 25, 1) : rnd(20, 90, 1), Pa = rnd(92, 101, 0.5);
    const pe = rho * g * h / 100 / 1000, P = Pa + pe;
    return { text: `Bir tankın basıncı, yoğunluğu ${rho} kg/m³ olan akışkanlı açık uçlu bir manometreyle ölçülüyor. Sütunlar arasındaki yükseklik farkı ${h} cm (açık uçtaki sütun daha yüksek) ve yerel atmosfer basıncı ${Pa} kPa. Tanktaki (a) etkin basıncı, (b) mutlak basıncı bulunuz.`,
      ask: [{ k: "pe", lab: "Etkin basınç", unit: "kPa", val: pe, traps: [{ v: pe * 1000, m: "Pa'yı kPa'ya çevirmemişsin (÷1000)." }] },
            { k: "P", lab: "Mutlak basınç", unit: "kPa", val: P, traps: [{ v: Pa - pe, m: "İşareti ters almışsın: açık uç yüksekse tank basıncı atmosferden BÜYÜK." }, { v: pe, m: "Bu etkin basınç; mutlak için atmosferi ekle." }] }],
      steps: [`ρgh = ${rho}·9.81·${h / 100} = ${f(pe * 1000, 1)} Pa = <b>${f(pe, 3)} kPa</b> (etkin)`, `P = P<sub>atm</sub> + ρgh = ${Pa} + ${f(pe, 3)} = <b>${f(P, 2)} kPa</b>`] };
  }
  if (v === "vakum") {
    const Pa = rnd(90, 101, 1), Pv = rnd(10, 70, 1), P = Pa - Pv;
    return { text: `Bir kaba bağlı vakum ölçer ${Pv} kPa gösteriyor. Atmosfer basıncı ${Pa} kPa. Kaptaki mutlak basınç?`,
      ask: [{ k: "P", lab: "Mutlak basınç", unit: "kPa", val: P, traps: [{ v: Pa + Pv, m: "Vakum atmosferin ALTINDA demek: çıkar." }] }],
      steps: [`P<sub>mutlak</sub> = P<sub>atm</sub> − P<sub>vakum</sub> = ${Pa} − ${Pv} = <b>${P} kPa</b>`] };
  }
  if (v === "baro") {
    const mm = rnd(700, 775, 1), P = 13600 * g * mm / 1000 / 1000;
    return { text: `Barometre ${mm} mmHg gösteriyor. Cıvanın yoğunluğu 13600 kg/m³. Atmosfer basıncı kaç kPa?`,
      ask: [{ k: "P", lab: "P_atm", unit: "kPa", val: P, traps: [{ v: P * 1000, m: "Pa çıktı; kPa için 1000'e böl." }, { v: P * 1000 * 1000, m: "mm'yi m'ye çevirmemişsin." }] }],
      steps: [`h = ${mm} mm = ${mm / 1000} m`, `P<sub>atm</sub> = ρgh = 13600·9.81·${mm / 1000} = ${f(P * 1000, 0)} Pa = <b>${f(P, 2)} kPa</b>`] };
  }
  const h1 = rnd(2, 6, 1), P1 = rnd(15, 60, 1), h2 = h1 + rnd(2, 10, 1), rho = P1 * 1000 / (g * h1), P2 = P1 * h2 / h1;
  return { text: `Bir sıvının ${h1} m derinlikteki gösterge basıncı ${P1} kPa. (a) Sıvının yoğunluğu, (b) aynı sıvının ${h2} m derinlikteki gösterge basıncı?`,
    ask: [{ k: "rho", lab: "ρ", unit: "kg/m³", val: rho }, { k: "P2", lab: "P₂ (gösterge)", unit: "kPa", val: P2, traps: [{ v: P2 + 100, m: "Gösterge basıncı isteniyor; atmosfer eklenmez." }] }],
    steps: [`${P1 * 1000} = ρ·9.81·${h1} → ρ = <b>${f(rho, 1)} kg/m³</b>`, `P<sub>2</sub> = ρgh<sub>2</sub> = ${P1}·${h2}/${h1} = <b>${f(P2, 2)} kPa</b>`] };
}};
GEN.agirlik = { title: "Kütle ve ağırlık", refs: ["tk1"], make() {
  const V = rnd(0.05, 0.6, 0.01), mk = rnd(1, 12, 0.5), rho = pick([1000, 850, 800]), mt = rho * V + mk, W = mt * g;
  return { text: `Hacmi ${V} m³ olan ${mk} kg'lık bir kap, yoğunluğu ${rho} kg/m³ olan sıvıyla tamamen doludur. (a) Sistemin toplam kütlesi, (b) toplam ağırlığı?`,
    ask: [{ k: "m", lab: "Toplam kütle", unit: "kg", val: mt, traps: [{ v: rho * V, m: "Kabın kendi kütlesini eklemeyi unuttun." }] }, { k: "W", lab: "Ağırlık", unit: "N", val: W, traps: [{ v: mt, m: "Ağırlık kuvvettir: m·g (N)." }] }],
    steps: [`m<sub>sıvı</sub> = ρV = ${rho}·${V} = ${f(rho * V, 2)} kg`, `m = ${f(rho * V, 2)} + ${mk} = <b>${f(mt, 2)} kg</b>`, `W = mg = ${f(mt, 2)}·9.81 = <b>${f(W, 1)} N</b>`] };
}};
function tsatAt(P) { return interpTable(A5, P, 0); }
GEN.piston = { title: "Piston dengesi (atmosfer, ağırlık, kaynama sıcaklığı)", refs: ["tk5", "ss3"], make() {
  if (Math.random() < 0.5) {
    const D = rnd(8, 20, 1), mp = rnd(3, 25, 1), Pa = rnd(92, 101, 0.5), A = Math.PI * (D / 100) ** 2 / 4;
    const Pg = r2(Pa + mp * g / A / 1000, 2), Patm = Pg - mp * g / A / 1000, kat = pick([1.5, 2, 2.5, 3]);
    const mw = (kat - 1) * Pg * 1000 * A / g;
    return { text: `Dikey bir piston-silindir düzeneğindeki gazın basıncı ${Pg} kPa. Pistonun çapı ${D} cm, kütlesi ${mp} kg. (a) Yerel atmosfer basıncını bulunuz. (b) Gaz basıncının başlangıçtakinin ${kat} katı olması için piston üzerine konacak ağırlıkların kütlesi?`,
      ask: [{ k: "Pa", lab: "P_atm", unit: "kPa", val: Patm, traps: [{ v: Pg - mp * g / (Math.PI * (D / 100) ** 2) / 1000, m: "Alanı πr² yerine πD² ile hesaplamışsın: A = πD²/4." }, { v: Pg - mp * g / A, m: "mg/A Pa çıkar; kPa için 1000'e böl." }] },
             { k: "mw", lab: "Ağırlıkların kütlesi", unit: "kg", val: mw }],
      steps: [`A = π(${D / 100})²/4 = ${f(A, 6)} m²`, `Denge: P<sub>gaz</sub>A = P<sub>atm</sub>A + m<sub>p</sub>g → P<sub>atm</sub> = ${Pg} − ${mp}·9.81/${f(A, 6)}/1000 = <b>${f(Patm, 2)} kPa</b>`,
        `2. hal: ${kat}·P<sub>gaz</sub>·A = P<sub>atm</sub>A + m<sub>p</sub>g + m<sub>ağ</sub>g → fark sadece ağırlıktan: m<sub>ağ</sub> = (${kat}−1)·${Pg}·1000·A/9.81 = <b>${f(mw, 2)} kg</b>`] };
  }
  let Acm, mp, Pa, P;
  do { Acm = rnd(40, 200, 10); mp = rnd(10, 80, 5); Pa = rnd(95, 101, 1); P = Pa + mp * g / (Acm / 1e4) / 1000; } while (P < 100 || P > 400 || A5[Math.round(P)]);
  const ks = keysN(A5); let i = 0; while (!(P >= ks[i] && P <= ks[i + 1])) i++;
  const T = lin(P, ks[i], ks[i + 1], A5[ks[i]][0], A5[ks[i + 1]][0]);
  return { text: `Su, dik bir piston-silindir düzeneğinde ısıtılıyor. Pistonun kütlesi ${mp} kg, kesit alanı ${Acm} cm². Atmosfer basıncı ${Pa} kPa. (a) Silindirdeki basınç, (b) suyun kaynamaya başlayacağı sıcaklık?`,
    ask: [{ k: "P", lab: "Basınç", unit: "kPa", val: P, traps: [{ v: Pa + mp * g / Acm / 1000, m: "cm²'yi m²'ye çevirmemişsin (×10⁻⁴)." }] }, { k: "T", lab: "Kaynama sıcaklığı", unit: "°C", val: T, tol: { abs: 0.4 } }],
    steps: [`A = ${Acm} cm² = ${Acm / 1e4} m²`, `P = P<sub>atm</sub> + mg/A = ${Pa} + ${mp}·9.81/${Acm / 1e4}/1000 = <b>${f(P, 2)} kPa</b>`,
      `Kaynama = T<sub>doyma</sub>(P). A-5: ${ks[i]} kPa → ${A5[ks[i]][0]} °C, ${ks[i + 1]} kPa → ${A5[ks[i + 1]][0]} °C`,
      `T = ${A5[ks[i]][0]} + (${f(P, 2)} − ${ks[i]})/(${ks[i + 1]} − ${ks[i]})·(${A5[ks[i + 1]][0]} − ${A5[ks[i]][0]}) = <b>${f(T, 2)} °C</b>`],
    dia: { kind: "tv", isobars: [{ T, lab: f(P, 1) + " kPa" }], pts: [{ v: vfAt(T), T, l: "x = 0" }] } };
}};
const selReg = (val, opts = ["comp", "mix", "sup"]) => ({ type: "sel", opts: opts.map(o => [o, REG[o]]), val });
GEN.faz = { title: "Tablodan hal bulma (bölge, P/T, x, h/u)", refs: ["ss1", "ss5", "ss7"], make() {
  const v = pick(["Tv", "Pv", "TPs", "TPc", "R"]);
  if (v === "Tv") {
    const T = pick(keysN(A4).filter(t => t >= 50 && t <= 250)), d = A4[T];
    const x0 = rnd(0.05, 0.9, 0.01), vv = +(d[1] + x0 * (d[2] - d[1])).toPrecision(4), x = (vv - d[1]) / (d[2] - d[1]), useU = Math.random() < 0.5;
    const y = useU ? d[3] + x * d[4] : d[6] + x * d[7];
    return { text: `Su için T = ${T} °C ve v = ${vv} m³/kg. (a) Bölge, (b) basınç, (c) kuruluk derecesi, (d) özgül ${useU ? "iç enerji u" : "entalpi h"}?`,
      ask: [{ k: "reg", lab: "Bölge", ...selReg("mix") }, { k: "P", lab: "P", unit: "kPa", val: d[0] }, { k: "x", lab: "x", unit: "", val: x, tol: { abs: 0.003 } }, { k: "y", lab: useU ? "u" : "h", unit: "kJ/kg", val: y }],
      steps: [`A-4 (${T} °C): v<sub>f</sub> = ${d[1]}, v<sub>g</sub> = ${d[2]} → v<sub>f</sub> &lt; ${vv} &lt; v<sub>g</sub> → <b>doymuş karışım</b>`, `P = P<sub>doyma</sub> = <b>${d[0]} kPa</b>`,
        `x = (${vv} − ${d[1]})/(${d[2]} − ${d[1]}) = <b>${f(x, 4)}</b>`, useU ? `u = u<sub>f</sub> + x·u<sub>fg</sub> = ${d[3]} + ${f(x, 4)}·${d[4]} = <b>${f(y, 2)} kJ/kg</b>` : `h = h<sub>f</sub> + x·h<sub>fg</sub> = ${d[6]} + ${f(x, 4)}·${d[7]} = <b>${f(y, 2)} kJ/kg</b>`],
      dia: { kind: "tv", isobars: [{ T, lab: d[0] + " kPa" }], pts: [{ v: vv, T, l: "hal" }] } };
  }
  if (v === "Pv") {
    const P = pick([100, 125, 150, 200, 250, 300, 400, 500, 600, 800, 1000]), d = A5[P], m = rnd(1, 8, 0.5);
    const x0 = rnd(0.03, 0.8, 0.01), V = +(m * (d[1] + x0 * (d[2] - d[1]))).toPrecision(3), vv = V / m, x = (vv - d[1]) / (d[2] - d[1]);
    const h = d[6] + x * d[7];
    return { text: `${V} m³'lük sabit hacimli bir kapta ${P} kPa basınçta ${m} kg su var. (a) Sıcaklık, (b) kuruluk derecesi, (c) toplam entalpi, (d) buhar fazının kütlesi?`,
      ask: [{ k: "T", lab: "T", unit: "°C", val: d[0] }, { k: "x", lab: "x", unit: "", val: x, tol: { abs: 0.003 } }, { k: "H", lab: "H", unit: "kJ", val: m * h, traps: [{ v: h, m: "Bu özgül entalpi (kJ/kg); toplam için kütleyle çarp." }] }, { k: "mg", lab: "m_g", unit: "kg", val: x * m }],
      steps: [`v = V/m = ${V}/${m} = ${f(vv, 5)} m³/kg`, `A-5 (${P} kPa): v<sub>f</sub> = ${d[1]}, v<sub>g</sub> = ${d[2]} → <b>karışım</b> → T = T<sub>doyma</sub> = <b>${d[0]} °C</b>`,
        `x = (${f(vv, 5)} − ${d[1]})/(${d[2]} − ${d[1]}) = <b>${f(x, 4)}</b>`, `h = ${d[6]} + ${f(x, 4)}·${d[7]} = ${f(h, 2)} kJ/kg → H = ${m}·${f(h, 2)} = <b>${f(m * h, 1)} kJ</b>`, `m<sub>g</sub> = x·m = <b>${f(x * m, 3)} kg</b>`],
      dia: { kind: "tv", isobars: [{ P }], pts: [{ v: vv, T: d[0], l: "hal" }] } };
  }
  if (v === "TPs") {
    const P = pick(keysN(A6)), T = pick(keysN(A6[P]).filter(t => t > A5[P][0])), d = A6[P][T], useH = Math.random() < 0.5;
    return { text: `Su, P = ${P} kPa ve T = ${T} °C'de. (a) Bölge, (b) özgül hacim, (c) ${useH ? "entalpi h" : "iç enerji u"}?`,
      ask: [{ k: "reg", lab: "Bölge", ...selReg("sup") }, { k: "v", lab: "v", unit: "m³/kg", val: d[0] }, { k: "y", lab: useH ? "h" : "u", unit: "kJ/kg", val: useH ? d[2] : d[1] }],
      steps: [`A-5: T<sub>doyma</sub>@${P} kPa = ${A5[P][0]} °C &lt; ${T} °C → <b>kızgın buhar</b> (ya da P &lt; P<sub>doyma</sub>@${T} °C)`, `A-6 (${P / 1000} MPa, ${T} °C): v = <b>${d[0]}</b>, u = ${d[1]}, h = ${d[2]}`],
      dia: { kind: "tv", isobars: [{ P }], pts: [{ v: d[0], T, l: "hal" }] } };
  }
  if (v === "TPc") {
    const T = pick([25, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150]), Ps = A4[T][0];
    const P = pick(keysN(A5).filter(p => p > Ps * 1.3));
    return { text: `Su, T = ${T} °C ve P = ${P} kPa'da. (a) Bölge, (b) yaklaşık özgül hacim, (c) yaklaşık entalpi?`,
      ask: [{ k: "reg", lab: "Bölge", ...selReg("comp") }, { k: "v", lab: "v", unit: "m³/kg", val: A4[T][1], traps: [{ v: A5[P][1], m: "v<sub>f</sub>'yi basınca göre (A-5) almışsın; sıkıştırılmış sıvıda SICAKLIĞA göre al (A-4)." }] }, { k: "h", lab: "h", unit: "kJ/kg", val: A4[T][6], traps: [{ v: A5[P][6], m: "h<sub>f</sub>'yi basınca göre almışsın; sıcaklığa göre al." }] }],
      steps: [`A-4: P<sub>doyma</sub>@${T} °C = ${Ps} kPa &lt; ${P} kPa → <b>sıkıştırılmış sıvı</b> (ya da T &lt; T<sub>doyma</sub>@${P} = ${A5[P][0]} °C)`, `A-7 5 MPa'dan başlar; tablo yok → aynı SICAKLIKTAKİ doymuş sıvı: v ≈ v<sub>f</sub>@${T} °C = <b>${A4[T][1]}</b>, h ≈ h<sub>f</sub>@${T} °C = <b>${A4[T][6]} kJ/kg</b>`],
      dia: { kind: "tv", isobars: [{ P }], pts: [{ v: A4[T][1], T, l: "hal" }] } };
  }
  const T = pick(Object.keys(A11)), d = A11[T], m = rnd(2, 15, 1), x0 = rnd(0.1, 0.8, 0.01);
  const V = +(m * (d[1] + x0 * (d[2] - d[1]))).toPrecision(3), vv = V / m, x = (vv - d[1]) / (d[2] - d[1]), u = d[3] + x * d[4];
  return { text: `${V} m³'lük rijit bir kapta ${T} °C'de ${m} kg R-134a var. (a) Basınç, (b) kuruluk derecesi, (c) toplam iç enerji, (d) sıvı fazın hacmi?`,
    ask: [{ k: "P", lab: "P", unit: "kPa", val: d[0] }, { k: "x", lab: "x", unit: "", val: x, tol: { abs: 0.003 } }, { k: "U", lab: "U", unit: "kJ", val: m * u }, { k: "Vf", lab: "V_f", unit: "m³", val: (1 - x) * m * d[1], traps: [{ v: m * d[1], m: "V<sub>f</sub> = m<sub>f</sub>·v<sub>f</sub>; toplam kütleyi değil sıvı kütlesini kullan." }] }],
    steps: [`v = ${V}/${m} = ${f(vv, 5)}; A-11 (${T} °C): v<sub>f</sub> = ${d[1]}, v<sub>g</sub> = ${d[2]} → karışım → P = <b>${d[0]} kPa</b>`, `x = (${f(vv, 5)} − ${d[1]})/(${d[2]} − ${d[1]}) = <b>${f(x, 4)}</b>`,
      `u = ${d[3]} + ${f(x, 4)}·${d[4]} = ${f(u, 2)} → U = <b>${f(m * u, 1)} kJ</b>`, `m<sub>f</sub> = (1−x)m = ${f((1 - x) * m, 3)} kg → V<sub>f</sub> = m<sub>f</sub>v<sub>f</sub> = <b>${f((1 - x) * m * d[1], 5)} m³</b>`],
    dia: { kind: "schem", title: "R-134a (şematik)", pts: [{ r: "mix", x: x, l: "hal" }], iso: [{ lab: d[0] + " kPa", y: 0.4 }] } };
}};
GEN.tablo4 = { title: "Tabloyu tamamla (4 satır, SM-1 tipi)", refs: ["ss1"], make() {
  // I: T + v karışım
  const T1 = pick([50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150]), d1 = A4[T1], v1 = +(d1[1] + rnd(0.1, 0.8, 0.01) * (d1[2] - d1[1])).toPrecision(3);
  // II: P + doymuş sıvı/buhar
  const P2 = pick([100, 150, 200, 300, 400, 500, 600, 800, 1000]), sg = Math.random() < 0.6, d2 = A5[P2];
  // III: T + P kızgın
  const P3 = pick(keysN(A6)), T3 = pick(keysN(A6[P3]).filter(t => t > A5[P3][0] + 20));
  // IV: T + P sıkıştırılmış
  const T4 = pick([30, 40, 50, 60, 80, 90, 100, 110, 120]), P4 = pick(keysN(A5).filter(p => p > A4[T4][0] * 1.5 && p <= 1000));
  const rows = `<table class="mini"><tr><th></th><th>T (°C)</th><th>P (kPa)</th><th>v (m³/kg)</th><th>Faz</th></tr>
<tr><td>I</td><td>${T1}</td><td>?</td><td>${v1}</td><td>?</td></tr><tr><td>II</td><td>?</td><td>${P2}</td><td>?</td><td>${sg ? "Doymuş buhar" : "Doymuş sıvı"}</td></tr>
<tr><td>III</td><td>${T3}</td><td>${P3}</td><td>?</td><td>?</td></tr><tr><td>IV</td><td>${T4}</td><td>${P4}</td><td>?</td><td>?</td></tr></table>`;
  return { text: `Su için tabloyu tamamlayınız.${rows}`,
    ask: [{ k: "P1", lab: "I · P", unit: "kPa", val: d1[0] }, { k: "f1", lab: "I · Faz", ...selReg("mix") },
      { k: "T2", lab: "II · T", unit: "°C", val: d2[0] }, { k: "v2", lab: "II · v", unit: "m³/kg", val: sg ? d2[2] : d2[1] },
      { k: "v3", lab: "III · v", unit: "m³/kg", val: A6[P3][T3][0] }, { k: "f3", lab: "III · Faz", ...selReg("sup") },
      { k: "v4", lab: "IV · v", unit: "m³/kg", val: A4[T4][1], traps: [{ v: A5[P4][1], m: "IV: v<sub>f</sub>'yi basınca göre almışsın; sıcaklığa göre al." }] }, { k: "f4", lab: "IV · Faz", ...selReg("comp") }],
    steps: [`I: A-4 (${T1} °C) v<sub>f</sub> = ${d1[1]}, v<sub>g</sub> = ${d1[2]} → karışım → P = P<sub>doyma</sub> = <b>${d1[0]} kPa</b>`,
      `II: ${sg ? "doymuş buhar, x = 1" : "doymuş sıvı, x = 0"} → A-5 (${P2} kPa): T = <b>${d2[0]} °C</b>, v = ${sg ? "v<sub>g</sub>" : "v<sub>f</sub>"} = <b>${sg ? d2[2] : d2[1]}</b>`,
      `III: T<sub>doyma</sub>@${P3} kPa = ${A5[P3][0]} °C &lt; ${T3} → kızgın → A-6: v = <b>${A6[P3][T3][0]}</b>`,
      `IV: P<sub>doyma</sub>@${T4} °C = ${A4[T4][0]} kPa &lt; ${P4} → sıkıştırılmış sıvı → v ≈ v<sub>f</sub>@${T4} °C = <b>${A4[T4][1]}</b>`],
    dia: { kind: "tv", isobars: [{ P: P3 }, { P: P4 }], pts: [{ v: v1, T: T1, l: "I" }, { v: sg ? d2[2] : d2[1], T: d2[0], l: "II" }, { v: A6[P3][T3][0], T: T3, l: "III" }, { v: A4[T4][1], T: T4, l: "IV" }] } };
}};
GEN.karisim = { title: "Hacim oranı verilen karışım tankı", refs: ["ss2"], make() {
  const T = pick([100, 120, 140, 150, 160, 180, 200, 220, 240, 250]), d = A4[T], V = rnd(0.5, 3, 0.1);
  const fr = pick([["1/3'ü", 1 / 3], ["1/4'ü", 0.25], ["yarısı", 0.5], ["%10'u", 0.1], ["1/5'i", 0.2]]);
  const Vf = V * fr[1], Vg = V - Vf, mf = Vf / d[1], mg = Vg / d[2], mt = mf + mg, x = mg / mt;
  return { text: `${V} m³ hacimli rijit bir tankta ${T} °C'de su ve su buharı dengededir. Hacmin ${fr[0]} sıvı, kalanı buhardır. (a) Basınç, (b) kuruluk derecesi, (c) karışımın yoğunluğu?`,
    ask: [{ k: "P", lab: "P", unit: "kPa", val: d[0] }, { k: "x", lab: "x", unit: "", val: x, tol: { abs: 0.0015, rel: 0.02 }, traps: [{ v: 1 - fr[1], m: "x hacim oranı değil, KÜTLE oranı: önce her fazın kütlesini bul." }, { v: fr[1], m: "x hacim oranı değil, KÜTLE oranı." }] },
      { k: "rho", lab: "ρ", unit: "kg/m³", val: mt / V }],
    steps: [`Karışım + T → P = P<sub>doyma</sub>@${T} °C = <b>${d[0]} kPa</b>`, `V<sub>f</sub> = ${f(Vf, 4)} m³, V<sub>g</sub> = ${f(Vg, 4)} m³`,
      `m<sub>f</sub> = V<sub>f</sub>/v<sub>f</sub> = ${f(Vf, 4)}/${d[1]} = ${f(mf, 2)} kg; m<sub>g</sub> = ${f(Vg, 4)}/${d[2]} = ${f(mg, 3)} kg`,
      `x = m<sub>g</sub>/(m<sub>f</sub>+m<sub>g</sub>) = <b>${f(x, 5)}</b>`, `ρ = ${f(mt, 2)}/${V} = <b>${f(mt / V, 2)} kg/m³</b>`],
    dia: { kind: "tv", isobars: [{ T, lab: d[0] + " kPa" }], pts: [{ v: V / mt, T, l: "hal" }] } };
}};
function supAt(P, T) { // kızgın buhar: doymuş buhar satırı (A-5) + A-6 satırları arasında doğrusal
  const rows = [[A5[P][0], A5[P][2], A5[P][8]], ...keysN(A6[P]).filter(t => t > A5[P][0]).map(t => [t, A6[P][t][0], A6[P][t][2]])];
  for (let i = 0; i < rows.length - 1; i++) if (T >= rows[i][0] && T <= rows[i + 1][0]) { const a = rows[i], b = rows[i + 1]; return { v: lin(T, a[0], b[0], a[1], b[1]), h: lin(T, a[0], b[0], a[2], b[2]), a, b }; }
  return null;
}
GEN.engel = { title: "Piston + engel: önce P sabit, sonra v sabit (SM-9 tipi)", refs: ["ss9"], make() {
  if (Math.random() < 0.6) { // soğutma: piston iner, engele oturur (hocanın sorusu)
    const P = pick(keysN(A6)), Ts = A5[P][0], dT = pick([5, 10, 15, 20, 25, 30]), T1 = r2(Ts + dT, 2), s1 = supAt(P, T1);
    const vf2 = A5[P][1], hf2 = A5[P][6], dh = hf2 - s1.h, w = P * (vf2 - s1.v);
    const T3 = pick(keysN(A4).filter(t => t >= 50 && t <= Ts - 10)), d = A4[T3], x3 = (vf2 - d[1]) / (d[2] - d[1]);
    const lo = s1.a[0] === Ts ? `doymuş buhar (${Ts} °C): v<sub>g</sub> = ${s1.a[1]}, h<sub>g</sub> = ${s1.a[2]}` : `${s1.a[0]} °C: v = ${s1.a[1]}, h = ${s1.a[2]}`;
    return { text: `Bir piston-silindir düzeneğinde ${P} kPa basınçta ${dT} °C kızdırılmış su buharı var. Buhar çevreye ısı verdikçe piston aşağı iniyor ve silindirde doymuş sıvı kaldığı anda engellere oturuyor. Soğuma, su ${T3} °C'ye düşünceye kadar sürüyor. (a) İlk sıcaklık, (b) h<sub>1</sub>, (c) piston engele oturana kadar Δh, (d) bu sırada birim kütle başına sınır işi, (e) son basınç, (f) son kuruluk derecesi?`,
      ask: [{ k: "T1", lab: "T₁", unit: "°C", val: T1, tol: { abs: 0.1 }, traps: [{ v: dT, m: "“" + dT + " °C kızdırılmış” T₁ = " + dT + " °C değil; T₁ = T<sub>doyma</sub> + " + dT + "." }] },
        { k: "h1", lab: "h₁", unit: "kJ/kg", val: s1.h, tol: { rel: 0.003 }, traps: [{ v: s1.b[2], m: "Tablodaki bir sonraki satırı aldın; T₁ iki satırın arasında, interpolasyon yap." }, { v: A5[P][8], m: "Bu h<sub>g</sub>; buhar doymuş değil, " + dT + " °C kızgın." }].filter(t => Math.abs(t.v - s1.h) > s1.h * 0.005) },
        { k: "dh", lab: "Δh₁₂", unit: "kJ/kg", val: dh, tol: { rel: 0.005 }, traps: [{ v: -dh, m: "İşaret: soğuyor, h azalır → Δh = h₂ − h₁ eksi." }, { v: A5[P][8] - s1.h, m: "2. hal doymuş SIVI: h<sub>2</sub> = h<sub>f</sub>, h<sub>g</sub> değil." }] },
        { k: "w", lab: "w₁₂", unit: "kJ/kg", val: w, tol: { rel: 0.005 }, traps: [{ v: -w, m: "İşaret: hacim küçülüyor (sıkıştırma) → iş eksi." }] },
        { k: "P3", lab: "P₃", unit: "kPa", val: d[0], traps: [{ v: P, m: "Piston engelde: 2→3'te P sabit değil, V sabit. P₃ = P<sub>doyma</sub>@T₃." }] },
        { k: "x3", lab: "x₃", unit: "", val: x3, tol: { rel: 0.03, abs: 0.000001 } }],
      steps: [`A-5 (${P} kPa): T<sub>doyma</sub> = ${Ts} °C → T<sub>1</sub> = ${Ts} + ${dT} = <b>${f(T1, 2)} °C</b> (kızgın buhar)`,
        `A-6'da ${P} kPa: ${lo}; ${s1.b[0]} °C: v = ${s1.b[1]}, h = ${s1.b[2]} → interpolasyon: h<sub>1</sub> = <b>${f(s1.h, 1)} kJ/kg</b>, v<sub>1</sub> = ${f(s1.v, 5)}`,
        `1→2 piston serbest → P sabit. 2. hal: doymuş sıvı (x = 0), ${P} kPa → h<sub>2</sub> = h<sub>f</sub> = ${hf2}, v<sub>2</sub> = v<sub>f</sub> = ${vf2}<br>Δh = ${hf2} − ${f(s1.h, 1)} = <b>${f(dh, 1)} kJ/kg</b> (eksi: ısı veriyor)`,
        `w<sub>12</sub> = P(v<sub>2</sub> − v<sub>1</sub>) = ${P}·(${vf2} − ${f(s1.v, 5)}) = <b>${f(w, 1)} kJ/kg</b>. 2→3'te piston engelde: iş yok.`,
        `2→3 piston engelde → V sabit, m sabit → v<sub>3</sub> = v<sub>2</sub> = ${vf2}. İki özellik: v<sub>3</sub> ve T<sub>3</sub> = ${T3} °C`,
        `A-4 (${T3} °C): v<sub>f</sub> = ${d[1]} &lt; ${vf2} &lt; v<sub>g</sub> = ${d[2]} → karışım → P<sub>3</sub> = P<sub>doyma</sub> = <b>${d[0]} kPa</b>`,
        `x<sub>3</sub> = (${vf2} − ${d[1]})/(${d[2]} − ${d[1]}) = <b>${f(x3)}</b> (çok küçük: neredeyse hepsi sıvı, hocanın sorusundaki gibi)`],
      dia: { kind: "tv", isobars: [{ P }, { T: T3, lab: d[0] + " kPa" }], path: [[s1.v, T1], [A5[P][2], Ts], [vf2, Ts], [vf2, T3]], pts: [{ v: s1.v, T: T1, l: "1" }, { v: vf2, T: Ts, l: "2" }, { v: vf2, T: T3, l: "3" }] } };
  }
  // ısıtma: piston engellerde durur, P_kalkma'ya ulaşınca kalkar
  let T1, d1, Pl, x1, v1;
  do { T1 = pick(keysN(A4).filter(t => t >= 60 && t <= 140)); d1 = A4[T1]; Pl = pick(keysN(A6).filter(p => p > d1[0] * 1.3)); x1 = rnd(0.02, 0.4, 0.01); v1 = d1[1] + x1 * (d1[2] - d1[1]); }
  while (!Pl || v1 >= A5[Pl][2] * 0.95);
  const Ts = A5[Pl][0], dl = A5[Pl], x2 = (v1 - dl[1]) / (dl[2] - dl[1]), m = rnd(1.5, 10, 0.5);
  const T3 = pick(keysN(A6[Pl]).filter(t => t > Ts + 20)), v3 = A6[Pl][T3][0], W = m * Pl * (v3 - v1);
  return { text: `Bir piston-silindir düzeneğinde piston engellerin üstünde duruyor; pistonu kaldırmak için içeride ${Pl} kPa basınç gerekiyor. Başlangıçta silindirde ${T1} °C'de, kuruluk derecesi ${x1} olan ${m} kg su var. Su ısıtılıyor; piston kalkıyor ve ısıtma ${T3} °C'ye kadar sürüyor. (a) İlk basınç, (b) piston kalkmaya başladığında sıcaklık, (c) o andaki kuruluk derecesi, (d) toplam sınır işi?`,
    ask: [{ k: "P1", lab: "P₁", unit: "kPa", val: d1[0] }, { k: "T2", lab: "T₂", unit: "°C", val: Ts, traps: [{ v: T1, m: "1→2'de V sabit ama T sabit değil; basınç " + Pl + " kPa'ya çıkınca T = T<sub>doyma</sub>@" + Pl + "." }] },
      { k: "x2", lab: "x₂", unit: "", val: x2, tol: { abs: 0.002, rel: 0.02 }, traps: [{ v: x1, m: "Engelli evrede x değişir; sabit olan v. x₂'yi v₂ = v₁'den hesapla." }] },
      { k: "W", lab: "W", unit: "kJ", val: W, traps: [{ v: m * d1[0] * (v3 - v1), m: "İş, piston hareket ederken yapılır; o sırada P = " + Pl + " kPa (P₁ değil)." }, { v: Pl * (v3 - v1), m: "Birim kütle başına işi buldun; kütleyle çarp." }] }],
    steps: [`1. hal karışım: P<sub>1</sub> = P<sub>doyma</sub>@${T1} °C = <b>${d1[0]} kPa</b>; v<sub>1</sub> = ${d1[1]} + ${x1}·(${d1[2]} − ${d1[1]}) = ${f(v1, 5)} m³/kg`,
      `1→2 piston engelde → V sabit → v<sub>2</sub> = v<sub>1</sub>; piston P = ${Pl} kPa olunca kalkar → 2. hal: P<sub>2</sub> = ${Pl} kPa, v<sub>2</sub> = ${f(v1, 5)}`,
      `A-5 (${Pl} kPa): v<sub>f</sub> = ${dl[1]} &lt; v<sub>2</sub> &lt; v<sub>g</sub> = ${dl[2]} → karışım → T<sub>2</sub> = <b>${Ts} °C</b>`,
      `x<sub>2</sub> = (${f(v1, 5)} − ${dl[1]})/(${dl[2]} − ${dl[1]}) = <b>${f(x2, 4)}</b>`,
      `2→3 piston serbest → P sabit = ${Pl} kPa; A-6 (${Pl} kPa, ${T3} °C): v<sub>3</sub> = ${v3}`,
      `W<sub>12</sub> = 0 (V sabit); W<sub>23</sub> = mP(v<sub>3</sub> − v<sub>2</sub>) = ${m}·${Pl}·(${v3} − ${f(v1, 5)}) = <b>${f(W, 1)} kJ</b>`],
    dia: { kind: "tv", isobars: [{ P: Pl }, { T: T1, lab: d1[0] + " kPa" }], path: [[v1, T1], [v1, Ts], [dl[2], Ts], [v3, T3]], pts: [{ v: v1, T: T1, l: "1" }, { v: v1, T: Ts, l: "2" }, { v: v3, T: T3, l: "3" }] } };
}};
GEN.rijit = { title: "Rijit kap: sabit v ile ısıtma/soğutma", refs: ["ss4", "ss6"], make() {
  if (Math.random() < 0.6) {
    let P1, T1, v1, cands;
    do { P1 = pick(keysN(A6)); T1 = pick(keysN(A6[P1]).filter(t => t >= 250)); v1 = A6[P1][T1][0]; cands = keysN(A4).filter(t => t < A5[P1][0] - 5 && A4[t][2] > v1 * 1.15 && t >= 50); } while (!cands.length);
    const T2 = pick(cands), d = A4[T2], x = (v1 - d[1]) / (d[2] - d[1]), useU = Math.random() < 0.5, y = useU ? d[3] + x * d[4] : d[6] + x * d[7];
    return { text: `Rijit bir kapta ${P1} kPa ve ${T1} °C'de kızgın su buharı var. Kap soğutularak sıcaklık ${T2} °C'ye düşürülüyor. Son halde (a) bölge, (b) basınç, (c) kuruluk derecesi, (d) ${useU ? "özgül iç enerji" : "özgül entalpi"}?`,
      ask: [{ k: "reg", lab: "Bölge", ...selReg("mix") }, { k: "P", lab: "P₂", unit: "kPa", val: d[0], traps: [{ v: P1, m: "Rijit kapta P sabit kalmaz; sabit olan v." }] }, { k: "x", lab: "x₂", unit: "", val: x, tol: { abs: 0.003 } }, { k: "y", lab: useU ? "u₂" : "h₂", unit: "kJ/kg", val: y }],
      steps: [`A-6 (${P1} kPa, ${T1} °C): v<sub>1</sub> = ${v1}. Rijit kap → v<sub>2</sub> = v<sub>1</sub>`, `A-4 (${T2} °C): v<sub>f</sub> = ${d[1]}, v<sub>g</sub> = ${d[2]} → karışım → P<sub>2</sub> = <b>${d[0]} kPa</b>`,
        `x<sub>2</sub> = (${v1} − ${d[1]})/(${d[2]} − ${d[1]}) = <b>${f(x, 4)}</b>`, useU ? `u<sub>2</sub> = ${d[3]} + ${f(x, 4)}·${d[4]} = <b>${f(y, 2)}</b>` : `h<sub>2</sub> = ${d[6]} + ${f(x, 4)}·${d[7]} = <b>${f(y, 2)}</b>`],
      dia: { kind: "tv", isobars: [{ P: P1 }, { T: T2, lab: d[0] + " kPa" }], path: [[v1, T1], [v1, T2]], pts: [{ v: v1, T: T1, l: "1" }, { v: v1, T: T2, l: "2" }] } };
  }
  const ks = keysN(A4).filter(t => t >= 110 && t <= 250);
  const i = Math.floor(Math.random() * (ks.length - 1)), Ta = ks[i], Tb = ks[i + 1];
  const m = rnd(2, 30, 1), vt = A4[Ta][2] + rnd(0.15, 0.85, 0.01) * (A4[Tb][2] - A4[Ta][2]), V = +(m * vt).toPrecision(3), v = V / m;
  const T1 = pick([40, 50, 60, 70, 80]), T2 = lin(v, A4[Ta][2], A4[Tb][2], Ta, Tb);
  return { text: `${V} m³'lük rijit bir kapta ${T1} °C'de ${m} kg doymuş sıvı-buhar karışımı var. Su yavaşça ısıtılıyor. Kaptaki suyun tamamen buharlaştığı sıcaklık?`,
    ask: [{ k: "T", lab: "T₂", unit: "°C", val: T2, tol: { abs: 0.5 } }],
    steps: [`v = V/m = ${V}/${m} = ${f(v, 5)} m³/kg (sabit)`, `Tamamen buharlaştı → x<sub>2</sub> = 1 → v<sub>g</sub> = ${f(v, 5)} olan sıcaklık`,
      `A-4: ${Ta} °C → v<sub>g</sub> = ${A4[Ta][2]}, ${Tb} °C → v<sub>g</sub> = ${A4[Tb][2]}`, `T<sub>2</sub> = ${Ta} + (${A4[Ta][2]} − ${f(v, 5)})/(${A4[Ta][2]} − ${A4[Tb][2]})·${Tb - Ta} = <b>${f(T2, 2)} °C</b>`],
    dia: { kind: "tv", path: [[v, T1], [v, T2]], pts: [{ v, T: T1, l: "1" }, { v, T: T2, l: "2" }] } };
}};
GEN.pistonsu = { title: "Sabit basınçta ısıtma: kütle, iş, ΔH", refs: ["ss8", "is3"], make() {
  const P = pick([200, 300, 400, 500, 600, 800]), Ts = A5[P][0];
  const T1 = pick(keysN(A4).filter(t => t >= 25 && t <= Ts - 20)), VL = rnd(10, 100, 5), v1 = A4[T1][1], h1 = A4[T1][6], m = VL / 1000 / v1;
  const sat = Math.random() < 0.4, T2 = sat ? Ts : pick(keysN(A6[P]).filter(t => t > Ts)), v2 = sat ? A5[P][2] : A6[P][T2][0], h2 = sat ? A5[P][8] : A6[P][T2][2];
  const W = m * P * (v2 - v1), dH = m * (h2 - h1);
  return { text: `Sürtünmesiz bir piston-silindir düzeneğinde ${P} kPa basınçta ve ${T1} °C'de ${VL} L sıvı su var. Su, sabit basınçta ${sat ? "tamamen buharlaşıncaya kadar" : T2 + " °C'ye kadar"} ısıtılıyor. (a) Suyun kütlesi, (b) son sıcaklık, (c) sınır işi, (d) toplam entalpi değişimi?`,
    ask: [{ k: "m", lab: "m", unit: "kg", val: m, traps: [{ v: VL / v1, m: "L → m³ çevirmeyi unuttun (÷1000)." }, { v: VL / 1000 / A5[P][1], m: "v<sub>1</sub>'i basınca göre almışsın; sıkıştırılmış sıvıda sıcaklığa göre (A-4)." }] },
      { k: "T2", lab: "T₂", unit: "°C", val: T2 }, { k: "W", lab: "W", unit: "kJ", val: W }, { k: "dH", lab: "ΔH", unit: "kJ", val: dH }],
    steps: [`P<sub>doyma</sub>@${T1} °C = ${A4[T1][0]} kPa &lt; ${P} → sıkıştırılmış sıvı → v<sub>1</sub> ≈ v<sub>f</sub>@${T1} °C = ${v1}, h<sub>1</sub> ≈ ${h1}`,
      `m = V/v<sub>1</sub> = ${VL / 1000}/${v1} = <b>${f(m, 3)} kg</b>`,
      sat ? `x<sub>2</sub> = 1 → T<sub>2</sub> = T<sub>doyma</sub>@${P} kPa = <b>${Ts} °C</b>; v<sub>2</sub> = v<sub>g</sub> = ${v2}, h<sub>2</sub> = h<sub>g</sub> = ${h2}`
          : `T<sub>doyma</sub>@${P} kPa = ${Ts} °C &lt; ${T2} → kızgın → A-6: v<sub>2</sub> = ${v2}, h<sub>2</sub> = ${h2}; T<sub>2</sub> = <b>${T2} °C</b>`,
      `W = mP(v<sub>2</sub> − v<sub>1</sub>) = ${f(m, 3)}·${P}·(${v2} − ${v1}) = <b>${f(W, 1)} kJ</b>`, `ΔH = m(h<sub>2</sub> − h<sub>1</sub>) = ${f(m, 3)}·(${h2} − ${h1}) = <b>${f(dH, 0)} kJ</b>`],
    dia: { kind: "tv", isobars: [{ P }], path: [[v1, T1], [A5[P][1], Ts], [v2, T2]], pts: [{ v: v1, T: T1, l: "1" }, { v: v2, T: T2, l: "2" }] } };
}};
GEN.yaygaz = { title: "Gaz + doğrusal yay: P₂, toplam iş, yay işi", refs: ["is2"], make() {
  const P1 = rnd(100, 400, 10), V1 = rnd(0.02, 0.2, 0.01), A = pick([0.1, 0.15, 0.2, 0.25, 0.3]), k = rnd(50, 300, 10), rr = pick([1.5, 2, 2.5, 3]);
  const V2 = V1 * rr, x = (V2 - V1) / A, F = k * x, P2 = P1 + F / A, W = (P1 + P2) / 2 * (V2 - V1), Wy = 0.5 * k * x * x;
  return { text: `Bir piston-silindir düzeneğinde ${P1} kPa ve ${f(V1, 3)} m³'te gaz var. Bu halde yay sabiti ${k} kN/m olan doğrusal bir yay pistona dokunuyor ama kuvvet uygulamıyor. Gaz ısıtılıyor ve hacmi ${rr} katına çıkıyor. Piston alanı ${A} m². (a) Son basınç, (b) toplam sınır işi, (c) yayı sıkıştırmak için yapılan iş?`,
    ask: [{ k: "P2", lab: "P₂", unit: "kPa", val: P2, traps: [{ v: P1 + F, m: "Kuvveti alana bölmeyi unuttun: ΔP = kx/A." }] }, { k: "W", lab: "W toplam", unit: "kJ", val: W, traps: [{ v: Wy, m: "Bu sadece yay işi; toplam işte sabit basınçlı alt dikdörtgen de var." }, { v: P2 * (V2 - V1), m: "Basınç sabit değil; yamuk alan: (P₁+P₂)/2·ΔV." }] }, { k: "Wy", lab: "W yay", unit: "kJ", val: Wy }],
    steps: [`V<sub>2</sub> = ${f(V2, 3)} m³; x = ΔV/A = ${f(V2 - V1, 3)}/${A} = ${f(x, 4)} m`, `F = kx = ${k}·${f(x, 4)} = ${f(F, 3)} kN → ΔP = F/A = ${f(F / A, 2)} kPa → P<sub>2</sub> = <b>${f(P2, 2)} kPa</b>`,
      `W = (P<sub>1</sub>+P<sub>2</sub>)/2·ΔV = (${P1}+${f(P2, 2)})/2·${f(V2 - V1, 3)} = <b>${f(W, 3)} kJ</b>`, `W<sub>yay</sub> = ½kx² = ½·${k}·${f(x, 4)}² = <b>${f(Wy, 3)} kJ</b>`],
    dia: { kind: "pv", pts: [[V1, P1, "1"], [V2, P2, "2"]], split: P1, splitLab: [f(W - Wy, 2) + " kJ", "yay " + f(Wy, 2) + " kJ"] } };
}};
GEN.yaysu = { title: "Su + sonradan değen yay (İŞ-1 tipi)", refs: ["is1"], make() {
  let P1, P3, A, k, x, m, T1, V1, V2, V3, v3;
  for (; ;) {
    P1 = pick([150, 200, 250, 300, 400]); P3 = pick(keysN(A5).filter(p => p > P1 && p <= 1000)); A = pick([0.1, 0.15, 0.2, 0.25]); k = pick([50, 100, 150, 200, 250]);
    x = (P3 - P1) * A / k; if (x < 0.05 || x > 0.6 || Math.abs(x * 100 - Math.round(x * 100)) > 1e-9) continue;
    m = rnd(10, 60, 5); T1 = pick([20 + 5, 30, 40, 50]); V1 = m * A4[T1][1]; V2 = r2(rnd(V1 * 2, m * A5[P3][2] * 0.5, 0.01), 2);
    V3 = V2 + x * A; v3 = V3 / m; if (V2 > V1 * 1.5 && v3 < A5[P3][2] * 0.9) break;
  }
  const W12 = P1 * (V2 - V1), W23 = (P1 + P3) / 2 * (V3 - V2);
  return { text: `Bir piston-silindir düzeneğinde ${P1} kPa ve ${T1} °C'de ${m} kg su var. Piston serbest, kesit alanı ${A} m². Suya ısı verilince su kısmen buharlaşıp genişliyor; hacim ${V2} m³ olunca piston yay sabiti ${k} kN/m olan doğrusal bir yaya dokunuyor. Isıtma, piston ${f(x * 100, 0)} cm daha yükselinceye kadar sürüyor. (a) Son basınç, (b) son sıcaklık, (c) toplam iş?`,
    ask: [{ k: "P3", lab: "P₃", unit: "kPa", val: P3 }, { k: "T3", lab: "T₃", unit: "°C", val: A5[P3][0] }, { k: "W", lab: "W", unit: "kJ", val: W12 + W23, traps: [{ v: W23, m: "1→2'deki sabit basınç işini (dikdörtgen) unuttun." }, { v: W12 + 0.5 * k * x * x, m: "2→3 işi sadece ½kx² değil; altındaki P₁·ΔV dikdörtgeni de var: yamuk alan." }] }],
    steps: [`1→2 piston serbest: P sabit = ${P1} kPa. P<sub>3</sub> = P<sub>1</sub> + kx/A = ${P1} + ${k}·${x}/${A} = <b>${P3} kPa</b>`,
      `V<sub>1</sub> = m·v<sub>f</sub>@${T1} °C = ${m}·${A4[T1][1]} = ${f(V1, 4)} m³ (sıkıştırılmış sıvı)`, `V<sub>3</sub> = ${V2} + ${x}·${A} = ${f(V3, 4)} m³ → v<sub>3</sub> = ${f(v3, 5)} m³/kg`,
      `A-5 (${P3} kPa): v<sub>f</sub> = ${A5[P3][1]}, v<sub>g</sub> = ${A5[P3][2]} → karışım → T<sub>3</sub> = <b>${A5[P3][0]} °C</b>`,
      `W<sub>12</sub> = ${P1}·(${V2} − ${f(V1, 4)}) = ${f(W12, 2)} kJ; W<sub>23</sub> = (${P1}+${P3})/2·${f(V3 - V2, 4)} = ${f(W23, 2)} kJ → W = <b>${f(W12 + W23, 2)} kJ</b>`],
    dia: { kind: "pv", pts: [[V1, P1, "1"], [V2, P1, "2"], [V3, P3, "3"]], areas: [[f(W12, 1) + " kJ", 0, 1], [f(W23, 1) + " kJ", 1, 2]] } };
}};
GEN.ideal = { title: "Mükemmel gaz (lastik, iki tank, ısıtılan tank)", refs: ["ig1", "ig2"], make() {
  const v = pick(["lastik", "tank2", "isit"]);
  if (v === "lastik") {
    const V = rnd(0.01, 0.04, 0.001), Tc = rnd(10, 40, 1), Pa = 100, Pg1 = rnd(120, 200, 10), Pg2 = Pg1 + rnd(30, 100, 10);
    const m1 = (Pg1 + Pa) * V / (R_AIR * (Tc + 273)), m2 = (Pg2 + Pa) * V / (R_AIR * (Tc + 273));
    return { text: `Hacmi ${V} m³ olan bir lastikteki hava ${Tc} °C'de ve ${Pg1} kPa (gösterge) basınçta. Basıncı ${Pg2} kPa'ya (gösterge) çıkarmak için eklenmesi gereken hava kütlesi? Atmosfer 100 kPa; T ve V sabit; R = 0.287 kJ/kg·K.`,
      ask: [{ k: "dm", lab: "Δm", unit: "kg", val: m2 - m1, traps: [{ v: (Pg2 - Pg1) * V / (R_AIR * Tc), m: "Sıcaklığı Kelvin'e çevirmedin." }] }],
      steps: [`Mutlak: P<sub>1</sub> = ${Pg1 + Pa}, P<sub>2</sub> = ${Pg2 + Pa} kPa; T = ${Tc + 273} K`, `m<sub>1</sub> = P<sub>1</sub>V/(RT) = ${f(m1, 5)} kg, m<sub>2</sub> = ${f(m2, 5)} kg`, `Δm = <b>${f(m2 - m1, 5)} kg</b> (gösterge farkıyla da aynı çıkar çünkü V/RT ortak; ama P'yi tek başına kullanacaksan mutlak şart)`] };
  }
  if (v === "tank2") {
    const VA = rnd(0.5, 2, 0.1), TA = rnd(15, 40, 1), PA = rnd(200, 600, 50), mB = rnd(2, 8, 1), TB = rnd(15, 50, 1), PB = rnd(100, 300, 50), Tf = rnd(15, 30, 1);
    const VB = mB * R_AIR * (TB + 273) / PB, mA = PA * VA / (R_AIR * (TA + 273)), P2 = (mA + mB) * R_AIR * (Tf + 273) / (VA + VB);
    return { text: `A tankı: ${VA} m³, ${TA} °C, ${PA} kPa hava. B tankı: ${mB} kg hava, ${TB} °C, ${PB} kPa. Aradaki vana açılıyor; sistem ${Tf} °C'deki çevreyle ısıl dengeye geliyor. (a) B'nin hacmi, (b) son basınç? (R = 0.287 kJ/kg·K)`,
      ask: [{ k: "VB", lab: "V_B", unit: "m³", val: VB }, { k: "P2", lab: "P₂", unit: "kPa", val: P2, traps: [{ v: (PA + PB) / 2, m: "Basınçların ortalaması alınmaz; kütle ve hacim toplanır." }] }],
      steps: [`V<sub>B</sub> = m<sub>B</sub>RT<sub>B</sub>/P<sub>B</sub> = ${mB}·0.287·${TB + 273}/${PB} = <b>${f(VB, 4)} m³</b>`, `m<sub>A</sub> = P<sub>A</sub>V<sub>A</sub>/(RT<sub>A</sub>) = ${f(mA, 4)} kg`, `P<sub>2</sub> = (m<sub>A</sub>+m<sub>B</sub>)RT<sub>son</sub>/(V<sub>A</sub>+V<sub>B</sub>) = ${f(mA + mB, 4)}·0.287·${Tf + 273}/${f(VA + VB, 4)} = <b>${f(P2, 2)} kPa</b>`] };
  }
  const V = rnd(0.5, 3, 0.1), P1 = rnd(100, 400, 10), T1 = rnd(10, 40, 1), T2 = rnd(80, 250, 10), P2 = P1 * (T2 + 273) / (T1 + 273), m = P1 * V / (R_AIR * (T1 + 273));
  return { text: `${V} m³'lük rijit bir tankta ${T1} °C ve ${P1} kPa'da hava var. Hava ${T2} °C'ye ısıtılıyor. (a) Havanın kütlesi, (b) son basınç? (R = 0.287 kJ/kg·K)`,
    ask: [{ k: "m", lab: "m", unit: "kg", val: m }, { k: "P2", lab: "P₂", unit: "kPa", val: P2, traps: [{ v: P1 * T2 / T1, m: "Oranı °C ile kurdun; Kelvin kullan." }] }],
    steps: [`m = PV/(RT) = ${P1}·${V}/(0.287·${T1 + 273}) = <b>${f(m, 4)} kg</b>`, `V, m sabit → P<sub>1</sub>/T<sub>1</sub> = P<sub>2</sub>/T<sub>2</sub> → P<sub>2</sub> = ${P1}·${T2 + 273}/${T1 + 273} = <b>${f(P2, 2)} kPa</b>`] };
}};
GEN.isler = { title: "Diğer işler: izotermal, politropik, mil, yay, elektrik, ivme", refs: [], make() {
  const v = pick(["izo", "poli", "mil", "yay", "elek", "ivme"]);
  if (v === "izo") {
    const P1 = rnd(100, 500, 10), V1 = rnd(0.1, 1, 0.05), V2 = r2(V1 * pick([0.25, 0.4, 0.5, 2, 3]), 3), W = P1 * V1 * Math.log(V2 / V1);
    return { text: `Bir piston-silindirde ${P1} kPa ve ${V1} m³'te hava var. Hava, sıcaklığı sabit tutularak (izotermal) ${V2} m³ hacme getiriliyor. Sınır işi?`,
      ask: [{ k: "W", lab: "W", unit: "kJ", val: W, traps: [{ v: -W, m: "İşaret: genişlemede +, sıkıştırmada −. ln(V₂/V₁) işareti kendisi verir." }] }],
      steps: [`İzotermal mükemmel gaz: W = P<sub>1</sub>V<sub>1</sub> ln(V<sub>2</sub>/V<sub>1</sub>)`, `W = ${P1}·${V1}·ln(${V2}/${V1}) = <b>${f(W, 2)} kJ</b> ${W < 0 ? "(eksi: sıkıştırma, sistem üzerinde iş)" : ""}`] };
  }
  if (v === "poli") {
    const P1 = rnd(100, 300, 10), V1 = rnd(0.2, 1, 0.05), V2 = r2(V1 * pick([0.2, 0.25, 0.4, 0.5]), 3), n = pick([1.2, 1.25, 1.3, 1.35, 1.4]);
    const P2 = P1 * (V1 / V2) ** n, W = (P2 * V2 - P1 * V1) / (1 - n);
    return { text: `Bir gaz ${P1} kPa ve ${V1} m³'ten PV<sup>${n}</sup> = sabit bağıntısıyla ${V2} m³'e sıkıştırılıyor. (a) Son basınç, (b) sınır işi?`,
      ask: [{ k: "P2", lab: "P₂", unit: "kPa", val: P2 }, { k: "W", lab: "W", unit: "kJ", val: W }],
      steps: [`P<sub>2</sub> = P<sub>1</sub>(V<sub>1</sub>/V<sub>2</sub>)<sup>n</sup> = ${P1}·(${V1}/${V2})<sup>${n}</sup> = <b>${f(P2, 2)} kPa</b>`, `W = (P<sub>2</sub>V<sub>2</sub> − P<sub>1</sub>V<sub>1</sub>)/(1 − n) = (${f(P2 * V2, 3)} − ${f(P1 * V1, 3)})/(1 − ${n}) = <b>${f(W, 2)} kJ</b>`] };
  }
  if (v === "mil") {
    const T = rnd(50, 400, 10), rpm = rnd(500, 4000, 100), t = rnd(1, 10, 1), Wd = 2 * Math.PI * rpm / 60 * T / 1000, W = Wd * t * 60;
    return { text: `Bir mil ${T} N·m tork ile ${rpm} dev/dk'da dönüyor. (a) İletilen güç, (b) ${t} dakikada iletilen iş?`,
      ask: [{ k: "P", lab: "Ẇ", unit: "kW", val: Wd, traps: [{ v: 2 * Math.PI * rpm * T / 1000, m: "dev/dk'yı dev/s'ye çevir (÷60)." }] }, { k: "W", lab: "W", unit: "kJ", val: W }],
      steps: [`ṅ = ${rpm}/60 = ${f(rpm / 60, 3)} dev/s`, `Ẇ = 2πṅT = 2π·${f(rpm / 60, 3)}·${T} = ${f(Wd * 1000, 0)} W = <b>${f(Wd, 3)} kW</b>`, `W = Ẇ·Δt = ${f(Wd, 3)}·${t * 60} s = <b>${f(W, 1)} kJ</b>`] };
  }
  if (v === "yay") {
    const k = rnd(50, 400, 10), x1 = rnd(0, 10, 1), x2 = x1 + rnd(5, 20, 1), W = 0.5 * k * ((x2 / 100) ** 2 - (x1 / 100) ** 2);
    return { text: `Yay sabiti ${k} kN/m olan doğrusal bir yay, serbest uzunluğundan ${x1} cm sıkışmış haldeyken ${x2} cm sıkışmaya getiriliyor. Yay üzerinde yapılan iş?`,
      ask: [{ k: "W", lab: "W_yay", unit: "kJ", val: W, traps: [{ v: 0.5 * k * ((x2 - x1) / 100) ** 2, m: "½k(x₂−x₁)² değil; ½k(x₂² − x₁²). x'ler serbest konumdan ölçülür." }] }],
      steps: [`W = ½k(x<sub>2</sub>² − x<sub>1</sub>²) = ½·${k}·(${x2 / 100}² − ${x1 / 100}²) = <b>${f(W, 4)} kJ</b>`] };
  }
  if (v === "elek") {
    const V = pick([12, 24, 110, 220, 230]), I = rnd(0.5, 10, 0.5), t = rnd(2, 30, 1), W = V * I * t * 60 / 1000;
    return { text: `${V} V gerilim altında ${I} A akım çeken bir ısıtıcı ${t} dakika çalışıyor. Yapılan elektrik işi?`,
      ask: [{ k: "W", lab: "W_e", unit: "kJ", val: W, traps: [{ v: V * I * t / 1000, m: "Süreyi saniyeye çevir." }] }],
      steps: [`Ẇ<sub>e</sub> = VI = ${f(V * I, 1)} W`, `W<sub>e</sub> = VIΔt = ${f(V * I, 1)}·${t * 60} = ${f(V * I * t * 60, 0)} J = <b>${f(W, 2)} kJ</b>`] };
  }
  const m = rnd(500, 2000, 100), V1 = rnd(0, 40, 10), V2 = V1 + rnd(20, 80, 10), W = 0.5 * m * ((V2 / 3.6) ** 2 - (V1 / 3.6) ** 2) / 1000;
  return { text: `${m} kg kütleli bir araç ${V1} km/h'den ${V2} km/h'e hızlandırılıyor. Gereken ivme işi?`,
    ask: [{ k: "W", lab: "W_a", unit: "kJ", val: W, traps: [{ v: 0.5 * m * (V2 ** 2 - V1 ** 2) / 1000, m: "km/h'yi m/s'ye çevir (÷3.6)." }] }],
    steps: [`V<sub>1</sub> = ${f(V1 / 3.6, 3)} m/s, V<sub>2</sub> = ${f(V2 / 3.6, 3)} m/s`, `W<sub>a</sub> = ½m(V<sub>2</sub>² − V<sub>1</sub>²) = <b>${f(W, 2)} kJ</b>`] };
}};

/* ═════════════ soru kutusu (alıştırma + deneme ortak) ═════════════ */
function parseNum(s) { s = String(s).trim().replace(/\s/g, "").replace(",", "."); return s === "" ? NaN : Number(s); }
function okNum(inp, a) {
  const t = a.tol || {}, rel = t.rel !== undefined ? t.rel : 0.015, ab = t.abs !== undefined ? t.abs : 0;
  return Math.abs(inp - a.val) <= Math.max(Math.abs(a.val) * rel, ab);
}
function askHTML(q, pre) {
  return `<div class="ask">${q.ask.map(a => a.type === "sel"
    ? `<label data-k="${a.k}">${a.lab}<select id="${pre}-${a.k}"><option value="">seç</option>${a.opts.map(o => `<option value="${o[0]}">${o[1]}</option>`).join("")}</select><span class="fb"></span></label>`
    : `<label data-k="${a.k}">${a.lab}${a.unit ? " (" + a.unit + ")" : ""}<input id="${pre}-${a.k}" inputmode="decimal" autocomplete="off"><span class="fb"></span></label>`).join("")}</div>`;
}
function grade(q, pre, root) {
  let n = 0, traps = [];
  q.ask.forEach(a => {
    const el = $(`#${pre}-${a.k}`, root), lab = el.parentElement, fb = $(".fb", lab);
    let ok;
    if (a.type === "sel") ok = el.value === a.val;
    else {
      const x = parseNum(el.value); ok = !isNaN(x) && okNum(x, a);
      if (!ok && !isNaN(x)) (a.traps || []).forEach(tp => { if (Math.abs(x - tp.v) <= Math.max(Math.abs(tp.v) * 0.015, 1e-9)) traps.push(`<b>${a.lab}:</b> ${tp.m}`); });
    }
    lab.classList.toggle("ok", ok); lab.classList.toggle("bad", !ok);
    fb.className = "fb " + (ok ? "ok" : "bad");
    fb.innerHTML = ok ? "doğru" : (el.value === "" ? "boş" : "olmadı");
    if (ok) n++;
  });
  return { n, total: q.ask.length, traps };
}
function answersHTML(q) {
  return `<div class="box small">${q.ask.map(a => `<b>${a.lab}</b> = ${a.type === "sel" ? REG[a.val] : f(a.val) + (a.unit ? " " + a.unit : "")}`).join(" · ")}</div>`;
}

/* ═════════════ sayfalar ═════════════ */
const PAGES = {};
const ALLP = GROUPS.flatMap(gr => gr.ids);
function done() { return store.get().done || {}; }

PAGES.home = () => {
  const d = done(), nd = ALLP.filter(i => d[i]).length, st = store.get();
  return `<div class="hero"><div class="kicker">Termodinamik I · Vize · Dr. Gülay Yakar</div><h1>Termo Soru Atölyesi</h1>
<p class="sub">Hocanın yüklediği 3 çözümlü soru PDF'indeki 18 soru adım adım; her tipten sınırsız yeni soru, faz drili, sözel kartlar ve deneme sınavı. İnternetsiz çalışır.</p>
<div class="chips"><span class="chip r">Vize: kitap s.1–68</span><span class="chip">Temel kavramlar</span><span class="chip">Saf madde</span><span class="chip">İş ve ısı (Birinci yasa yok)</span></div>
<p class="score">Çözülen hoca sorusu: ${nd}/18 · Faz avcısı en iyi: ${st.fazBest || 0}/10 · Deneme en iyi: ${st.denBest !== undefined ? st.denBest + "%" : "–"}</p></div>
<div class="card"><div class="sec"><span class="n">00</span><h2>Bu gece sırası</h2></div>
<div class="rec"><span class="n">1</span><span><a href="#/tarif">Ana tarif</a>i oku (10 dk). Bütün saf madde soruları aynı 6 adımla çözülüyor; sınavda “nereden başlayacağım” sorunu bununla biter.</span>
<span class="n">2</span><span><a href="#/faz">Faz avcısı</a>: bir tur, 8/10'u geçene kadar (10 dk). Bölgeyi yanlış bulursan sorunun geri kalanı da yanlış gider.</span>
<span class="n">3</span><span><a href="#/sorular">Hocanın 18 sorusu</a>: önce kendin çöz, takılınca sadece o adımı aç. Çözerken baktığın sorulardan başla (60–75 dk).</span>
<span class="n">4</span><span><a href="#/alistirma">Alıştırma</a>: her tipten en az 1 yeni sayılı soru (40 dk). Yanlışta site hangi tuzağa düştüğünü söyler.</span>
<span class="n">5</span><span><a href="#/sozel">Sözel kartlar</a>: önce ★ olanlar (kitapta “soru gelmiş” notu var) (20 dk).</span>
<span class="n">6</span><span><a href="#/deneme">Deneme sınavı</a>: 5 soru, saat çalışır; sonra yanlışların çözümüne bak (50 dk).</span></div>
<p class="dim small">Sınava girerken: hesap makinesi, formül kâğıdı, tablolar. Formül kâğıdında eksik var mı diye <a href="#/tarif">tarif sayfasının sonundaki listeye</a> bak.</p></div>
<div class="card"><div class="sec"><span class="n">01</span><h2>Sınav haritası</h2></div>
<p>Hoca sınavda bu 3 PDF'teki gibi soruyor (senin aktarımın). PDF'lerdeki 18 soru 4 tipe ayrılıyor:</p>
<div class="scroll"><table class="tbl"><tr><th>Tip</th><th>Hocanın soruları</th><th>Tarif</th><th>Alıştırma</th></tr>
<tr><td><b>Basınç / kuvvet dengesi</b></td><td>TK-1…7, SM-3</td><td>P = Patm + ρgh, piston serbest cisim diyagramı</td><td><a href="#/alistirma/basinc">basınç</a> · <a href="#/alistirma/piston">piston</a></td></tr>
<tr><td><b>Tablodan hal bulma</b></td><td>SM-1, 2, 4, 5, 6, 7, 8, 9</td><td>2 özellik → bölge → tablo → x → y</td><td><a href="#/alistirma/tablo4">tablo</a> · <a href="#/alistirma/faz">faz</a> · <a href="#/alistirma/rijit">rijit</a> · <a href="#/alistirma/engel">piston + engel</a> · <a href="#/alistirma/karisim">karışım</a></td></tr>
<tr><td><b>Mükemmel gaz</b></td><td>MG-1, 2</td><td>PV = mRT, P mutlak, T Kelvin</td><td><a href="#/alistirma/ideal">mükemmel gaz</a></td></tr>
<tr><td><b>Sınır işi</b></td><td>İŞ-1, 2, 3</td><td>P-V altındaki alan</td><td><a href="#/alistirma/yaygaz">yay+gaz</a> · <a href="#/alistirma/yaysu">yay+su</a> · <a href="#/alistirma/pistonsu">sabit P</a></td></tr></table></div>
<h3>Kitaptaki el yazısı notlar</h3>
<ul class="tz"><li><b>Vize çizgisi</b> s.68'de, Elektrik işinin altında. Birinci yasa (s.69+) vizede yok.</li>
<li>s.47 h<sub>fg</sub> bölümünde <span class="hl">“Soru gelmiş”</span> ve <span class="hl">“Sözel soru gelmiş”</span> (kritik noktaya yaklaştıkça h<sub>fg</sub> azalır). <a href="#/sozel">Kartlarda ★</a>.</li>
<li>s.53 Van der Waals denkleminin yanında <span class="hl">“YOK!”</span>: diğer hal denklemleri sorulmuyor.</li>
<li>Kitap tabloları için: “4-5-6 su ile ilgili, 11-12-13 R-134a ile ilgili”.</li></ul>
<p class="dim small">Kitapta izotermal ve politropik iş, mil/yay/elektrik/ivme işi de var; hocanın çözümlü sorularında yoklar. Ne olur ne olmaz diye <a href="#/alistirma/isler">“diğer işler”</a> alıştırmasına koydum.</p></div>`;
};

PAGES.tarif = () => `<div class="hero"><div class="kicker">Ezber değil, sıra</div><h1>Ana tarif</h1><p class="sub">Hocanın saf madde ve iş sorularının hepsi bu sırayla çözülüyor. Takıldığın yer neredeyse her zaman 2. ya da 3. adım.</p></div>
<div class="card"><div class="sec"><span class="n">A</span><h2>Saf madde sorusu: 6 adım</h2></div>
<div class="rec">
<span class="n">1</span><span><b>Halleri ayır, verilenleri yaz.</b> “I. hal: … / II. hal: …”. Her halin altına bildiğin her şeyi yaz (T, P, V, m, x, “doymuş sıvı” = x=0, “tamamen buharlaştı” = x=1).</span>
<span class="n">2</span><span><b>Ne sabit?</b> Bu, eksik ikinci özelliği verir:<br>· <b>rijit / kapalı kap / sabit hacim</b> → V ve m sabit → <b>v<sub>1</sub> = v<sub>2</sub></b><br>· <b>piston serbest / sürtünmesiz piston</b> → <b>P sabit</b> (P = P<sub>atm</sub> + m<sub>p</sub>g/A)<br>· <b>piston engele dayandı</b> → o andan sonra V sabit<br>· <b>yay</b> → P doğrusal değişir: P = P<sub>önce</sub> + kx/A</span>
<span class="n">3</span><span><b>Her halde iki bağımsız yeğin özellik topla</b> (hal postulası). v yoksa v = V/m. Kütle yoksa m = V/v (bilinen bir halden).</span>
<span class="n">4</span><span><b>Bölgeyi bul</b> (aşağıdaki kutu). Bu adımı atlama: tablo seçimi buna bağlı.</span>
<span class="n">5</span><span><b>Doğru tablodan oku</b>; karışımsa x = (v − v<sub>f</sub>)/(v<sub>g</sub> − v<sub>f</sub>), sonra y = y<sub>f</sub> + x·y<sub>fg</sub> (y: u, h). Toplam isteniyorsa m ile çarp.</span>
<span class="n">6</span><span><b>Diyagram iste­niyorsa</b>: kubbeyi çiz, sabit tutulanı çizgi olarak çiz (rijit → dikey, sabit P → izobar), halleri işaretle.</span></div></div>
<div class="two"><div class="card"><div class="sec"><span class="n">B</span><h2>Bölge bulma</h2></div>
<p><b>T ve P verilmişse</b>, ya T<sub>doyma</sub>(P)'ye ya P<sub>doyma</sub>(T)'ye bak:</p>
<table class="mini"><tr><th></th><th>sıkıştırılmış sıvı</th><th>karışım</th><th>kızgın buhar</th></tr>
<tr><td>P'yi P<sub>doyma</sub>@T ile</td><td>P &gt; P<sub>doyma</sub></td><td>P = P<sub>doyma</sub></td><td>P &lt; P<sub>doyma</sub></td></tr>
<tr><td>T'yi T<sub>doyma</sub>@P ile</td><td>T &lt; T<sub>doyma</sub></td><td>T = T<sub>doyma</sub></td><td>T &gt; T<sub>doyma</sub></td></tr>
<tr><td>v'yi v<sub>f</sub>, v<sub>g</sub> ile</td><td>v &lt; v<sub>f</sub></td><td>v<sub>f</sub> &lt; v &lt; v<sub>g</sub></td><td>v &gt; v<sub>g</sub></td></tr></table>
<p class="small">Karışımda T ve P birbirine bağlı: birini bilince öteki tablodan gelir. Kızgın buharda bağımsız.</p></div>
<div class="card"><div class="sec"><span class="n">C</span><h2>Hangi tablo</h2></div>
<table class="tbl small"><tr><th>Durum</th><th>Su</th><th>R-134a</th></tr>
<tr><td>Doymuş, T biliniyor</td><td>A-4</td><td>A-11</td></tr><tr><td>Doymuş, P biliniyor</td><td>A-5</td><td>A-12</td></tr>
<tr><td>Kızgın buhar</td><td>A-6</td><td>A-13</td></tr><tr><td>Sıkıştırılmış sıvı</td><td>A-7 (≥ 5 MPa); yoksa <b>v<sub>f</sub>, u<sub>f</sub>, h<sub>f</sub>@T</b> (A-4)</td><td>v<sub>f</sub>@T</td></tr>
<tr><td>Hava, N₂, O₂…</td><td colspan="2">Tablo değil: PV = mRT (R hava = 0.287)</td></tr></table>
<p class="small">Tabloda olmayan değer → iki komşu satır arasında doğrusal interpolasyon: y = y₁ + (x − x₁)/(x₂ − x₁)·(y₂ − y₁).</p></div></div>
<div class="card"><div class="sec"><span class="n">D</span><h2>İş sorusu: P-V altındaki alan</h2></div>
<div class="rec"><span class="n">1</span><span>Her halin (P, V) noktasını bul. V = m·v, ya da V<sub>yeni</sub> = V<sub>eski</sub> + x·A.</span>
<span class="n">2</span><span>Noktaları P-V'de birleştir. Sabit P → yatay çizgi, doğrusal yay → eğik düz çizgi, sabit V → dikey (iş = 0).</span>
<span class="n">3</span><span>Alanı parçalara böl: dikdörtgen P·ΔV, yamuk (P₁+P₂)/2·ΔV. Toplam iş = toplam alan.</span>
<span class="n">4</span><span>Yay işi ayrıca istenirse: ½k(x₂² − x₁²) = yamuğun üstündeki üçgen.</span></div>
<table class="tbl small"><tr><th>Hal değişimi</th><th>Sınır işi</th></tr>
<tr><td>Sabit hacim</td><td>W = 0</td></tr><tr><td>Sabit basınç</td><td>W = P(V₂ − V₁) = mP(v₂ − v₁)</td></tr>
<tr><td>Doğrusal yay (P doğrusal)</td><td>W = (P₁ + P₂)/2 · (V₂ − V₁)</td></tr>
<tr><td>İzotermal mükemmel gaz</td><td>W = P₁V₁ ln(V₂/V₁) = mRT ln(V₂/V₁)</td></tr>
<tr><td>Politropik PVⁿ = C</td><td>W = (P₂V₂ − P₁V₁)/(1 − n) = mR(T₂ − T₁)/(1 − n)</td></tr>
<tr><td>Yay / mil / elektrik / ivme / yerçekimi</td><td>½k(x₂² − x₁²) · 2πnT · VIΔt · ½m(V₂² − V₁²) · mgΔz</td></tr></table>
<p class="small">İşaret: genişleme (sistem iş yapar) +, sıkıştırma −.</p></div>
<div class="card"><div class="sec"><span class="n">E</span><h2>Basınç ve birim kâğıdı</h2></div>
<div class="two"><div><p>P<sub>mutlak</sub> = P<sub>atm</sub> + P<sub>gösterge</sub> = P<sub>atm</sub> − P<sub>vakum</sub><br>Manometre: P = P<sub>atm</sub> + ρgh · Barometre: P<sub>atm</sub> = ρgh<br>Piston dengesi: P<sub>gaz</sub>A = P<sub>atm</sub>A + m<sub>p</sub>g (+ yay kx, + ağırlıklar)<br>A = πD²/4</p></div>
<div><p>ρgh, mg/A → <b>Pa</b> çıkar; kPa için ÷1000<br>kPa·m³ = kJ · kN/m × m = kN · kN/m² = kPa<br>1 L = 0.001 m³ · 1 cm² = 10⁻⁴ m² · T(K) = T(°C) + 273<br>1 bar = 100 kPa · 1 atm = 101.325 kPa · 1 MPa = 1000 kPa</p></div></div></div>
<div class="card flat"><div class="sec"><span class="n">F</span><h2>Formül kâğıdı kontrol listesi</h2></div>
<p class="small dim">Kâğıdını hazırladın; bunlar üstünde var mı diye bir kez bak. Eksik olanı ekle.</p>
<ul class="tz small"><li>P<sub>mutlak</sub> = P<sub>atm</sub> ± …, ρgh, P = F/A, A = πD²/4</li><li>Bölge karşılaştırma kutusu (yukarıdaki B)</li><li>x = (v − v<sub>f</sub>)/v<sub>fg</sub>, y = y<sub>f</sub> + x·y<sub>fg</sub>, x = m<sub>g</sub>/m<sub>t</sub>, m<sub>f</sub> = V<sub>f</sub>/v<sub>f</sub></li><li>Sıkıştırılmış sıvı: y ≈ y<sub>f</sub>@T; h ≈ h<sub>f</sub>@T + v<sub>f</sub>(P − P<sub>doyma</sub>)</li><li>İnterpolasyon formülü</li><li>PV = mRT, P₁V₁/T₁ = P₂V₂/T₂, R = R<sub>u</sub>/M, R<sub>u</sub> = 8.314, R<sub>hava</sub> = 0.287</li><li>Z = Pv/RT, P<sub>R</sub> = P/P<sub>cr</sub>, T<sub>R</sub> = T/T<sub>cr</sub></li><li>İş tablosu (yukarıdaki D), yay F = kx, ½k(x₂² − x₁²)</li><li>h = u + Pv, H = U + PV, e = u + V²/2 + gz</li><li>Sıcaklık dönüşümleri, birim dönüşümleri</li><li>Su: kritik 373.95 °C / 22.06 MPa, üçlü 0.01 °C / 0.6117 kPa, h<sub>if</sub> 333.7, h<sub>fg</sub> 2256.5 kJ/kg (1 atm)</li></ul></div>`;

PAGES.sorular = () => {
  const d = done();
  return `<div class="hero"><div class="kicker">3 PDF · 18 soru</div><h1>Hocanın soruları</h1><p class="sub">Her soruda: soru → ne anlamalıyım → aklına nereden gelecek → adım adım (önce sen düşün, sonra aç) → diyagram → kâğıda yaz → tuzaklar → benzerini çöz.</p></div>
${GROUPS.map(gr => `<div class="card"><h2>${gr.title}</h2><p class="small dim">${gr.note}</p><div class="grid">${gr.ids.map(id => { const p = P[id]; return `<a class="tile ${d[id] ? "done" : ""}" href="#/p/${id}"><div class="no">${p.no}</div><div class="t">${p.title}</div><div class="small dim">${p.tip} · ${SRC[p.src].replace(" PDF", "")} s.${p.page}</div></a>`; }).join("")}</div></div>`).join("")}`;
};

PAGES.p = (id) => {
  const p = P[id]; if (!p) return PAGES.sorular();
  const i = ALLP.indexOf(id), prev = ALLP[i - 1], next = ALLP[i + 1], d = done();
  const gen = GEN[p.gen];
  return `<div class="hero"><div class="kicker">${p.no} · ${SRC[p.src]} s.${p.page}</div><h1>${p.title}</h1><div class="chips"><span class="chip r">${p.tip}</span></div></div>
<div class="card"><div class="sec"><span class="n">01</span><h2>Soru</h2></div><div class="qtext">${p.soru}</div></div>
<div class="card"><div class="sec"><span class="n">02</span><h2>Sorudan ne anlamalıyım</h2></div><table class="tbl anla">${p.anla.map(a => `<tr><td>${a[0]}</td><td>${a[1]}</td></tr>`).join("")}</table></div>
<div class="card"><div class="sec"><span class="n">03</span><h2>Aklına nereden gelecek</h2></div><ul class="tz">${p.tetik.map(t => `<li>${t}</li>`).join("")}</ul></div>
<div class="card" id="steps"><div class="sec"><span class="n">04</span><h2>Adım adım</h2></div><p class="small dim">Her adımda önce soruyu kendin cevapla (kâğıda), sonra aç.</p>
${p.adim.map((s, k) => `<div class="step"><div class="q" data-i="${k + 1}">${s.q}</div><div class="rv"><button class="btn ghost" data-open>Göster</button></div><div class="a">${s.a}</div></div>`).join("")}
<div class="btns"><button class="btn" id="allopen">Hepsini aç</button></div>${p.tablo ? `<div id="tbl-res" style="display:none">${p.tablo}</div>` : ""}</div>
${p.dia ? `<div class="card"><div class="sec"><span class="n">05</span><h2>Diyagram</h2></div>${dia(p.dia)}${p.dia.kind === "tv" ? `<p class="small dim center">Su için gerçek tablo değerleriyle çizildi (v log ölçekli). Kesikli çizgiler sabit basınç eğrileri.</p>` : p.dia.kind === "pv" ? `<p class="small dim center">Taralı alan = sınır işi.</p>` : ""}</div>` : ""}
<div class="card"><div class="sec"><span class="n">06</span><h2>Kâğıda böyle yaz</h2></div><div class="paper">${p.kagit.map(l => l.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")).join("\n")}</div><p class="small">Sonuç: <b>${p.cevap}</b></p></div>
<div class="card"><div class="sec"><span class="n">07</span><h2>Tuzaklar</h2></div><ul class="tz">${p.tuzak.map(t => `<li>${t}</li>`).join("")}</ul></div>
<div class="card flat center"><div class="sec" style="justify-content:center"><span class="n">08</span><h2>Benzerini çöz</h2></div>
<p>Aynı tipte yeni sayılarla: <a class="btn r" href="#/alistirma/${p.gen}">${gen ? gen.title : "Alıştırma"}</a></p>
<label class="done-tg"><input type="checkbox" id="donecb" ${d[id] ? "checked" : ""}> BU SORUYU ÇÖZEBİLİYORUM</label></div>
<div class="pnav">${prev ? `<a class="btn ghost" href="#/p/${prev}">← ${P[prev].no}</a>` : "<span></span>"}${next ? `<a class="btn ghost" href="#/p/${next}">${P[next].no} →</a>` : ""}</div>`;
};
function bindP(id) {
  document.querySelectorAll("[data-open]").forEach(b => b.onclick = () => { b.closest(".step").classList.add("open"); chkAll(); });
  const all = $("#allopen"); if (all) all.onclick = () => { document.querySelectorAll(".step").forEach(s => s.classList.add("open")); chkAll(); };
  function chkAll() { const t = $("#tbl-res"); if (t && [...document.querySelectorAll(".step")].every(s => s.classList.contains("open"))) t.style.display = "block"; }
  const cb = $("#donecb"); if (cb) cb.onchange = () => store.upd(o => { o.done = o.done || {}; o.done[id] = cb.checked; });
}

/* alıştırma */
PAGES.alistirma = (gid) => {
  if (!gid || !GEN[gid]) return `<div class="hero"><div class="kicker">Sınırsız yeni sayı</div><h1>Alıştırma</h1><p class="sub">Her tip hocanın sorularından biriyle aynı iskelette; sayılar her seferinde yeni. Tablo değerleri sitedeki <a href="#/tablolar">tablolardan</a> (kitaptaki tabloların aynısı).</p></div>
<div class="grid">${Object.entries(GEN).map(([k, v]) => `<a class="tile" href="#/alistirma/${k}"><div class="t">${v.title}</div><div class="small dim">${v.refs.length ? "Benzeri: " + v.refs.map(r => P[r].no).join(", ") : "Kitaptan (hoca sorularında yok)"}</div></a>`).join("")}</div>`;
  const G = GEN[gid];
  return `<div class="hero"><div class="kicker">Alıştırma</div><h1>${G.title}</h1>${G.refs.length ? `<div class="chips">${G.refs.map(r => `<a class="chip" href="#/p/${r}">${P[r].no}</a>`).join("")}</div>` : ""}</div>
<div class="card" id="ex"></div><div class="center"><a class="btn ghost" href="#/alistirma">← tüm tipler</a></div>`;
};
function bindEx(gid) {
  const box = $("#ex"); if (!box) return;
  const G = GEN[gid]; let q, hint = 0;
  const draw = () => {
    q = G.make(); hint = 0;
    box.innerHTML = `<div class="qtext">${q.text}</div>${askHTML(q, "ex")}
<div class="btns"><button class="btn r" id="chk">Kontrol et</button><button class="btn" id="hnt">İpucu (adım adım)</button><button class="btn ghost" id="sol">Çözümü göster</button><button class="btn ghost" id="new">Yeni sayılar</button></div>
<div id="trp"></div><div id="hints"></div><div id="soldiv"></div>`;
    $("#chk").onclick = () => {
      const r = grade(q, "ex", box);
      $("#trp").innerHTML = (r.traps.length ? `<div class="trap">${r.traps.join("<br>")}</div>` : "") + `<p class="score">${r.n}/${r.total} doğru${r.n === r.total ? " · tamam" : ""}</p>`;
      store.upd(o => { o.ex = o.ex || {}; o.ex[gid] = (o.ex[gid] || 0) + (r.n === r.total ? 1 : 0); });
    };
    $("#hnt").onclick = () => { if (hint < q.steps.length) { hint++; $("#hints").innerHTML = q.steps.slice(0, hint).map((s, i) => `<div class="step open"><div class="q" data-i="${i + 1}">${i === hint - 1 && hint < q.steps.length ? "Bu adımı uygula, sonra kontrol et." : "Adım"}</div><div class="a">${s}</div></div>`).join(""); } };
    $("#sol").onclick = () => { $("#hints").innerHTML = ""; $("#soldiv").innerHTML = q.steps.map((s, i) => `<div class="step open"><div class="q" data-i="${i + 1}">Adım</div><div class="a">${s}</div></div>`).join("") + answersHTML(q) + dia(q.dia); };
    $("#new").onclick = draw;
  };
  draw();
}

/* faz avcısı */
PAGES.faz = () => `<div class="hero"><div class="kicker">10 soru · hız</div><h1>Faz avcısı</h1><p class="sub">Su için iki özellik veriliyor; bölgeyi seç. Gerekli doyma değeri soruda yazılı değil; <a href="#/tablolar">tablolara</a> bakabilirsin (sınavdaki gibi).</p></div><div class="card flash" id="fz"></div>`;
function fazQ() {
  const t = pick(["TP", "TP", "Tv", "Pv", "PT"]);
  if (t === "TP" || t === "PT") {
    const r = pick(["comp", "sup", "comp", "sup", "mix"]);
    if (r === "mix") { const T = pick(keysN(A4).filter(x => x >= 40 && x <= 250)); return { s: `T = ${T} °C, P = ${A4[T][0]} kPa`, a: "mix", why: `P<sub>doyma</sub>@${T} °C = ${A4[T][0]} kPa → P = P<sub>doyma</sub>. Sadece T ve P ile hal tam belli değil (karışım ya da sınır), ama bölge doymuş bölge.` }; }
    if (t === "TP") {
      const T = pick(keysN(A4).filter(x => x >= 40 && x <= 250)), Ps = A4[T][0];
      const Pc = keysN(A5).filter(p => r === "comp" ? p > Ps * 1.15 : p < Ps * 0.85); if (!Pc.length) return fazQ();
      const P = pick(Pc); return { s: `T = ${T} °C, P = ${P} kPa`, a: r, why: `A-4: P<sub>doyma</sub>@${T} °C = ${Ps} kPa. P ${P > Ps ? "&gt;" : "&lt;"} P<sub>doyma</sub> → ${REG[r]}.` };
    }
    const P = pick(keysN(A5)), Ts = A5[P][0], T = r === "comp" ? rnd(25, Ts - 10, 5) : rnd(Ts + 10, 400, 10);
    if (T < 20) return fazQ();
    return { s: `P = ${P} kPa, T = ${T} °C`, a: r, why: `A-5: T<sub>doyma</sub>@${P} kPa = ${Ts} °C. T ${T > Ts ? "&gt;" : "&lt;"} T<sub>doyma</sub> → ${REG[r]}.` };
  }
  const r = pick(["comp", "mix", "mix", "sup"]);
  if (t === "Tv") {
    const T = pick(keysN(A4).filter(x => x >= 40 && x <= 250)), d = A4[T];
    const v = r === "mix" ? +(d[1] + rnd(0.05, 0.9, 0.01) * (d[2] - d[1])).toPrecision(3) : r === "sup" ? +(d[2] * rnd(1.2, 3, 0.1)).toPrecision(3) : +(d[1] * 0.997).toPrecision(4);
    return { s: `T = ${T} °C, v = ${v} m³/kg`, a: r, why: `A-4 (${T} °C): v<sub>f</sub> = ${d[1]}, v<sub>g</sub> = ${d[2]} → ${REG[r]}.` };
  }
  const P = pick(keysN(A5)), d = A5[P];
  const v = r === "mix" ? +(d[1] + rnd(0.05, 0.9, 0.01) * (d[2] - d[1])).toPrecision(3) : r === "sup" ? +(d[2] * rnd(1.2, 3, 0.1)).toPrecision(3) : +(d[1] * 0.997).toPrecision(4);
  return { s: `P = ${P} kPa, v = ${v} m³/kg`, a: r, why: `A-5 (${P} kPa): v<sub>f</sub> = ${d[1]}, v<sub>g</sub> = ${d[2]} → ${REG[r]}.` };
}
function bindFaz() {
  const box = $("#fz"); let i = 0, sc = 0, q;
  const next = () => {
    if (i === 10) {
      store.upd(o => { o.fazBest = Math.max(o.fazBest || 0, sc); });
      box.innerHTML = `<div class="big">${sc}/10</div><p class="center">${sc >= 8 ? "Bölge bulma oturmuş." : "Bir tur daha: yanlışlarda gerekçeyi oku, hangi karşılaştırmayı ters yaptığına bak."}</p><div class="choice"><button class="btn r" id="again">Yeni tur</button></div>`;
      $("#again").onclick = () => { i = 0; sc = 0; next(); }; return;
    }
    q = fazQ(); i++;
    box.innerHTML = `<p class="score">${i}/10 · puan ${sc}</p><div class="big" style="font-size:30px">${q.s}</div>
<div class="choice">${["comp", "mix", "sup"].map(k => `<button class="btn" data-r="${k}">${REG[k]}</button>`).join("")}</div><div id="why" class="center" style="margin-top:12px"></div>`;
    box.querySelectorAll("[data-r]").forEach(b => b.onclick = () => {
      if (box.dataset.lock === "1") return; box.dataset.lock = "1";
      const ok = b.dataset.r === q.a; if (ok) sc++;
      b.classList.add(ok ? "ok" : "bad"); if (!ok) box.querySelector(`[data-r="${q.a}"]`).classList.add("ok");
      $("#why").innerHTML = `<p>${q.why}</p><button class="btn r" id="nx">Sonraki</button>`;
      $("#nx").onclick = () => { box.dataset.lock = "0"; next(); };
    });
  };
  box.dataset.lock = "0"; next();
}

/* sözel */
PAGES.sozel = () => `<div class="hero"><div class="kicker">${CARDS.length} kart · kitap s.1–68</div><h1>Sözel kartlar</h1><p class="sub">Karta tıkla, cevabı aç; sonra “biliyordum / tekrar” işaretle. ★: kitabın kenarında “soru gelmiş” notu olan konu.</p>
<div class="tabs"><button class="btn on" data-f="all">Hepsi</button><button class="btn" data-f="star">★ önce</button><button class="btn" data-f="rep">Tekrar edilecekler</button><button class="btn" data-f="list">Liste halinde</button></div></div><div id="sz" class="flash"></div>`;
function bindSozel() {
  let mode = "all", order = [], k = 0;
  const st = () => store.get().cards || {};
  const build = () => {
    const s = st();
    order = CARDS.map((c, i) => i).filter(i => mode === "star" ? CARDS[i].star : mode === "rep" ? s[i] === "rep" : true);
    if (mode === "star") order = order.concat(CARDS.map((c, i) => i).filter(i => !CARDS[i].star));
    k = 0; show();
  };
  const show = () => {
    const box = $("#sz");
    if (mode === "list") { box.innerHTML = CARDS.map(c => `<div class="card"><div class="q" style="color:#fff">${c.star ? '<span class="star">★ SORU GELMİŞ · </span>' : ""}${c.q}</div><div class="small" style="margin-top:6px">${c.a}</div><div class="small dim">kitap s.${c.s}</div></div>`).join(""); return; }
    if (!order.length) { box.innerHTML = `<div class="card center">Tekrar edilecek kart yok.</div>`; return; }
    const i = order[k % order.length], c = CARDS[i], s = st();
    box.innerHTML = `<p class="score">${(k % order.length) + 1}/${order.length}${s[i] ? " · " + (s[i] === "ok" ? "biliyordun" : "tekrar") : ""}</p>
<div class="card fc" id="fcard">${c.star ? '<div class="star center">★ KİTAPTA “SORU GELMİŞ”</div>' : ""}<div class="q">${c.q}</div><div class="a">${c.a}<div class="small dim" style="margin-top:6px">kitap s.${c.s}</div></div></div>
<div class="choice"><button class="btn" id="rep">Tekrar</button><button class="btn r" id="okb">Biliyordum</button></div>`;
    $("#fcard").onclick = () => $("#fcard").classList.toggle("open");
    const mark = v => { store.upd(o => { o.cards = o.cards || {}; o.cards[i] = v; }); k++; show(); };
    $("#rep").onclick = () => mark("rep"); $("#okb").onclick = () => mark("ok");
  };
  document.querySelectorAll("[data-f]").forEach(b => b.onclick = () => { document.querySelectorAll("[data-f]").forEach(x => x.classList.remove("on")); b.classList.add("on"); mode = b.dataset.f; build(); });
  build();
}

/* deneme */
PAGES.deneme = () => `<div class="hero"><div class="kicker">5 soru · hocanın tiplerinden</div><h1>Deneme sınavı</h1><p class="sub">Kâğıt, hesap makinesi, formül kâğıdın ve <a href="#/tablolar">tablolar</a>. Çözümler “Bitir”den sonra açılır. Her denemede sayılar yeni.</p>
<div class="btns" style="justify-content:center"><button class="btn r" id="start">Denemeyi başlat</button></div></div><div id="dn"></div>`;
function bindDeneme() {
  $("#start").onclick = () => {
    const set = [GEN.tablo4, pick([GEN.karisim, GEN.rijit, GEN.faz]), pick([GEN.pistonsu, GEN.yaysu, GEN.engel]), pick([GEN.yaygaz, GEN.ideal]), pick([GEN.piston, GEN.basinc])];
    const qs = set.map(G => G.make()), t0 = Date.now();
    $("#start").parentElement.innerHTML = `<span class="timer" id="tm">00:00</span>`;
    const tick = setInterval(() => { const s = Math.floor((Date.now() - t0) / 1000), el = $("#tm"); if (!el) return clearInterval(tick); el.textContent = String(Math.floor(s / 60)).padStart(2, "0") + ":" + String(s % 60).padStart(2, "0"); }, 1000);
    $("#dn").innerHTML = qs.map((q, i) => `<div class="card" id="dq${i}"><div class="sec"><span class="n">${String(i + 1).padStart(2, "0")}</span><h2>Soru ${i + 1}</h2></div><div class="qtext">${q.text}</div>${askHTML(q, "d" + i)}<div class="res"></div></div>`).join("") +
      `<div class="center"><button class="btn r" id="fin">Bitir ve puanla</button></div><div id="dres"></div>`;
    $("#fin").onclick = () => {
      clearInterval(tick); let n = 0, tot = 0;
      qs.forEach((q, i) => {
        const root = $("#dq" + i), r = grade(q, "d" + i, root); n += r.n; tot += r.total;
        $(".res", root).innerHTML = (r.traps.length ? `<div class="trap">${r.traps.join("<br>")}</div>` : "") + `<p class="score">${r.n}/${r.total}</p>` + q.steps.map((s, k) => `<div class="step open"><div class="q" data-i="${k + 1}">Adım</div><div class="a">${s}</div></div>`).join("") + answersHTML(q) + dia(q.dia);
      });
      const pc = Math.round(n / tot * 100);
      store.upd(o => { o.denBest = Math.max(o.denBest || 0, pc); });
      $("#dres").innerHTML = `<div class="card center"><div class="big">%${pc}</div><p>${n}/${tot} kutucuk doğru · süre ${$("#tm") ? $("#tm").textContent : ""}</p><p class="small dim">Yanlış çıkan sorunun tipine <a href="#/alistirma">alıştırmadan</a> 2 tane daha çöz.</p><button class="btn r" onclick="location.reload()">Yeni deneme</button></div>`;
      $("#fin").remove();
    };
  };
}

/* tablolar */
PAGES.tablolar = () => {
  const t4 = keysN(A4).map(T => `<tr><td>${T}</td>${A4[T].map(x => `<td>${x}</td>`).join("")}</tr>`).join("");
  const t5 = keysN(A5).map(p => `<tr><td>${p}</td>${A5[p].map(x => `<td>${x}</td>`).join("")}</tr>`).join("");
  const t6 = keysN(A6).map(p => `<tr><th colspan="4">P = ${p / 1000} MPa (T<sub>doyma</sub> = ${A5[p][0]} °C)</th></tr>` + keysN(A6[p]).map(T => `<tr><td>${T}</td>${A6[p][T].map(x => `<td>${x}</td>`).join("")}</tr>`).join("")).join("");
  const t11 = Object.keys(A11).map(T => `<tr><td>${T}</td>${A11[T].map(x => `<td>${x}</td>`).join("")}</tr>`).join("");
  const hd = `<th>v<sub>f</sub></th><th>v<sub>g</sub></th><th>u<sub>f</sub></th><th>u<sub>fg</sub></th><th>u<sub>g</sub></th><th>h<sub>f</sub></th><th>h<sub>fg</sub></th><th>h<sub>g</sub></th>`;
  return `<div class="hero"><div class="kicker">Kitaptaki Ek 1'den</div><h1>Tablolar</h1><p class="sub">Sitedeki soruların kullandığı satırlar. Değerler hocanın PDF'indeki tablolardan satır satır yazıldı; sınavda kendi tablona bakarken de aynı sayıları bulmalısın.</p></div>
<div class="card scroll"><h2>A-4 Doymuş su (sıcaklık)</h2><table class="mini"><tr><th>T °C</th><th>P<sub>doy</sub> kPa</th>${hd}</tr>${t4}</table></div>
<div class="card scroll"><h2>A-5 Doymuş su (basınç)</h2><table class="mini"><tr><th>P kPa</th><th>T<sub>doy</sub> °C</th>${hd}</tr>${t5}</table></div>
<div class="card scroll"><h2>A-6 Kızgın su buharı</h2><table class="mini"><tr><th>T °C</th><th>v m³/kg</th><th>u kJ/kg</th><th>h kJ/kg</th></tr>${t6}</table></div>
<div class="card scroll"><h2>A-11 Doymuş R-134a (sıcaklık)</h2><table class="mini"><tr><th>T °C</th><th>P<sub>doy</sub> kPa</th>${hd}</tr>${t11}</table><p class="small dim">Hocanın İŞ-3 sorusundaki 900 kPa değerleri: T<sub>doy</sub> = 35.51 °C, v<sub>f</sub> = 0.0008580 (A-12); 0.9 MPa ve 70 °C'de v = 0.027413 (A-13).</p></div>`;
};

/* ═════════════ yönlendirme ═════════════ */
const NAV = [["#/", "Başla"], ["#/tarif", "Ana tarif"], ["#/sorular", "Hocanın soruları"], ["#/alistirma", "Alıştırma"], ["#/faz", "Faz avcısı"], ["#/sozel", "Sözel"], ["#/deneme", "Deneme"], ["#/tablolar", "Tablolar"]];
function route() {
  const h = location.hash || "#/", parts = h.slice(2).split("/");
  const page = parts[0] || "home", arg = parts[1];
  $("#nav").innerHTML = NAV.map(([href, t]) => `<a href="${href}" class="${(href === "#/" ? page === "home" : href.slice(2) === page || (page === "p" && href === "#/sorular")) ? "on" : ""}">${t}</a>`).join("");
  const fn = PAGES[page] || PAGES.home;
  $("#app").innerHTML = fn(arg);
  window.scrollTo(0, 0);
  if (page === "p") bindP(arg);
  if (page === "alistirma" && arg) bindEx(arg);
  if (page === "faz") bindFaz();
  if (page === "sozel") bindSozel();
  if (page === "deneme") bindDeneme();
}
window.addEventListener("hashchange", route);
route();
