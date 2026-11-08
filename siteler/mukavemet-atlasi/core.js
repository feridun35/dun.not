"use strict";
var NS = "http://www.w3.org/2000/svg";
function h(tag, props) {
  var e = document.createElement(tag), k;
  props = props || {};
  for (k in props) {
    var v = props[k];
    if (k === "class") e.className = v;
    else if (k === "html") e.innerHTML = v;
    else if (k === "style") e.style.cssText = v;
    else if (k.indexOf("on") === 0) e.addEventListener(k.slice(2), v);
    else e.setAttribute(k, v);
  }
  for (var i = 2; i < arguments.length; i++) add(e, arguments[i]);
  return e;
}
function add(e, c) {
  if (c == null || c === false) return;
  if (Array.isArray(c)) { c.forEach(function (x) { add(e, x); }); return; }
  e.appendChild(c.nodeType ? c : document.createTextNode(c));
}
function s(tag, props) {
  var e = document.createElementNS(NS, tag), k;
  props = props || {};
  for (k in props) e.setAttribute(k, props[k]);
  for (var i = 2; i < arguments.length; i++) add(e, arguments[i]);
  return e;
}
function f(x, d) {
  if (d === undefined) d = 2;
  return Number(x).toFixed(d).replace(".", ",");
}
function fa(x, d) { return (x >= 0 ? "+" : "−") + f(Math.abs(x), d); }
function store(k, v) {
  try {
    if (v === undefined) return JSON.parse(localStorage.getItem("mk_" + k));
    localStorage.setItem("mk_" + k, JSON.stringify(v));
  } catch (e) { return null; }
}
function ctl(label, min, max, step, val, unit, cb, dec) {
  var out = h("span", { class: "val" });
  var inp = h("input", { type: "range", min: min, max: max, step: step, value: val });
  var d = dec === undefined ? (step < 1 ? (step < 0.1 ? 3 : 1) : 0) : dec;
  function upd() { out.textContent = f(inp.value, d) + (unit ? " " + unit : ""); }
  inp.addEventListener("input", function () { upd(); cb(+inp.value); });
  upd();
  var row = h("div", { class: "ctl" }, h("label", {}, label), inp, out);
  row.get = function () { return +inp.value; };
  row.set = function (v) { inp.value = v; upd(); };
  return row;
}
function metric(label, cls) {
  var b = h("b", {}, "—"), sm = h("small", {html: label});
  var d = h("div", { class: "m " + (cls || "") }, sm, b);
  d.set = function (txt, c) { b.innerHTML = txt; d.className = "m " + (c || cls || ""); };
  return d;
}
function tabs(names, cb, first) {
  var wrap = h("div", { class: "tabs" }), btns = [];
  names.forEach(function (n, i) {
    var b = h("button", { onclick: function () { sel(i); } }, n);
    btns.push(b); wrap.appendChild(b);
  });
  function sel(i) { btns.forEach(function (b, j) { b.className = j === i ? "on" : ""; }); cb(i); }
  wrap.sel = sel; wrap.first = function () { sel(first || 0); };
  return wrap;
}
function svgBox(w, hgt) {
  var el = s("svg", { viewBox: "0 0 " + w + " " + hgt, role: "img" });
  return el;
}
function clear(el) { while (el.firstChild) el.removeChild(el.firstChild); }
function arrow(g, x1, y1, x2, y2, col, w) {
  w = w || 2.5;
  var dx = x2 - x1, dy = y2 - y1, L = Math.sqrt(dx * dx + dy * dy);
  if (L < 1) return;
  var ux = dx / L, uy = dy / L, hl = Math.min(10, L * 0.5), hw = hl * 0.55;
  var bx = x2 - ux * hl, by = y2 - uy * hl;
  g.appendChild(s("line", { x1: x1, y1: y1, x2: bx, y2: by, stroke: col, "stroke-width": w, "stroke-linecap": "round" }));
  g.appendChild(s("polygon", { points: x2 + "," + y2 + " " + (bx - uy * hw) + "," + (by + ux * hw) + " " + (bx + uy * hw) + "," + (by - ux * hw), fill: col }));
}
function txt(g, x, y, t, o) {
  o = o || {};
  var e = s("text", { x: x, y: y, "font-size": o.size || 13, fill: o.fill || "currentColor", "text-anchor": o.anchor || "middle", "font-weight": o.bold ? 600 : 400 });
  e.textContent = t; g.appendChild(e); return e;
}
function chips(str) {
  var wrap = h("span", {});
  var toks = str.split(/\s+/), merged = [];
  toks.forEach(function (t, i) { if (t === "GA") { toks[i + 1] = "GA " + toks[i + 1]; } else merged.push(t); });
  merged.forEach(function (t) {
    if (!t) return;
    var c = h("span", { class: "chip" + (t[0] === "Ö" ? " o" : "") + (t === "Q25" ? " dead" : "") }, t);
    wrap.appendChild(c);
  });
  return wrap;
}
var SECTIONS = [];
function section(o) { SECTIONS.push(o); }
function widget(title, lead, say, build, exam) {
  var box = h("div", {});
  if (lead) box.appendChild(h("p", { class: "lead" }, lead));
  if (say) box.appendChild(h("div", { class: "say", html: say }));
  build(box);
  if (exam) box.appendChild(h("div", { class: "exam", html: "<b>Sınavda nasıl çıkıyor?</b> " + exam }));
  return box;
}
function heat(t) {
  t = Math.max(0, Math.min(1, t));
  var r = Math.round(120 + 135 * t), g = Math.round(170 - 110 * t), b = Math.round(220 - 190 * t);
  return "rgb(" + r + "," + g + "," + b + ")";
}
