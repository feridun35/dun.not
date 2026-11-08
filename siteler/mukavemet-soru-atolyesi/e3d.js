'use strict';
/* Küçük 3D motoru: canvas 2D üstünde düz gölgeli çokgenler, ressam sıralaması,
   fareyle döndürme, ekran üstü teknik resim katmanı (ok, ölçü, etiket). Dış kütüphane yok. */
const E3 = (() => {
  const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
  const add = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
  const mul = (a, s) => [a[0] * s, a[1] * s, a[2] * s];
  const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
  const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
  const norm = a => { const l = Math.hypot(a[0], a[1], a[2]) || 1; return [a[0] / l, a[1] / l, a[2] / l]; };
  const lerp = (a, b, t) => a + (b - a) * t;

  // ---- mesh üreticileri (yüzler dışa bakacak sırada) ----
  function box(w, h, d) {
    const x = w / 2, y = h / 2, z = d / 2;
    const v = [[-x, -y, -z], [x, -y, -z], [x, y, -z], [-x, y, -z], [-x, -y, z], [x, -y, z], [x, y, z], [-x, y, z]];
    const f = [[0, 3, 2, 1], [4, 5, 6, 7], [0, 1, 5, 4], [2, 3, 7, 6], [1, 2, 6, 5], [0, 4, 7, 3]];
    return { v, f: f.map(i => ({ i, e: 1 })) };
  }
  // y ekseni boyunca; axis ile x ya da z'ye çevrilir
  function axisMap(v, axis) {
    if (axis === 'x') return v.map(p => [p[1], -p[0], p[2]]);
    if (axis === 'z') return v.map(p => [p[0], -p[2], p[1]]);
    return v;
  }
  // a0, arc: kesit görünümü için yay parçası (arc < 2π ise uçlar kapatılır)
  function cyl(r, h, n = 28, axis = 'y', a0 = 0, arc = 2 * Math.PI) {
    const full = arc >= 2 * Math.PI - 1e-6, m = full ? n : n + 1, v = [], f = [], y = h / 2;
    for (let k = 0; k < m; k++) { const a = a0 + arc * k / n; v.push([r * Math.cos(a), -y, r * Math.sin(a)]); }
    for (let k = 0; k < m; k++) { const a = a0 + arc * k / n; v.push([r * Math.cos(a), y, r * Math.sin(a)]); }
    for (let k = 0; k < n; k++) { const k1 = full ? (k + 1) % n : k + 1; f.push({ i: [k, m + k, m + k1, k1], e: 0 }); }
    if (full) {
      f.push({ i: [...Array(n).keys()], e: 1 });
      f.push({ i: [...Array(n).keys()].map(k => n + n - 1 - k), e: 1 });
    } else {
      const cb = v.length, ct = cb + 1; v.push([0, -y, 0], [0, y, 0]);
      f.push({ i: [cb, ...Array(m).keys()], e: 1 });
      f.push({ i: [...[...Array(m).keys()].map(k => m + m - 1 - k), ct], e: 1 });
      f.push({ i: [0, cb, ct, m], e: 1, cut: 1 });
      f.push({ i: [m - 1, 2 * m - 1, ct, cb], e: 1, cut: 1 });
    }
    return { v: axisMap(v, axis), f };
  }
  function tube(R, r, h, n = 32, axis = 'y', a0 = 0, arc = 2 * Math.PI) {
    const full = arc >= 2 * Math.PI - 1e-6, m = full ? n : n + 1, v = [], f = [], y = h / 2;
    const P = (rr, yy, k) => { const a = a0 + arc * k / n; return [rr * Math.cos(a), yy, rr * Math.sin(a)]; };
    for (let k = 0; k < m; k++) v.push(P(R, -y, k)); // dış alt
    for (let k = 0; k < m; k++) v.push(P(R, y, k));  // dış üst
    for (let k = 0; k < m; k++) v.push(P(r, -y, k)); // iç alt
    for (let k = 0; k < m; k++) v.push(P(r, y, k));  // iç üst
    for (let k = 0; k < n; k++) {
      const k1 = full ? (k + 1) % n : k + 1;
      f.push({ i: [k, m + k, m + k1, k1], e: 0 });
      f.push({ i: [2 * m + k, 2 * m + k1, 3 * m + k1, 3 * m + k], e: 0 });
      f.push({ i: [m + k, 3 * m + k, 3 * m + k1, m + k1], e: 0 });
      f.push({ i: [k, k1, 2 * m + k1, 2 * m + k], e: 0 });
    }
    if (!full) {
      f.push({ i: [0, 2 * m, 3 * m, m], e: 1, cut: 1 });
      f.push({ i: [m - 1, 2 * m - 1, 4 * m - 1, 3 * m - 1], e: 1, cut: 1 });
    }
    return { v: axisMap(v, axis), f };
  }
  // xy düzleminde saat tersi çokgen, z boyunca kalınlık
  function extrude(pts, d) {
    const n = pts.length, z = d / 2, v = [], f = [];
    pts.forEach(p => v.push([p[0], p[1], -z]));
    pts.forEach(p => v.push([p[0], p[1], z]));
    f.push({ i: [...Array(n).keys()].map(k => n + k), e: 1 });
    f.push({ i: [...Array(n).keys()].reverse(), e: 1 });
    for (let k = 0; k < n; k++) { const k1 = (k + 1) % n; f.push({ i: [k, k1, n + k1, n + k], e: 1 }); }
    return { v, f };
  }
  function hexRgb(h) { h = h.replace('#', ''); return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)]; }

  // Newell yöntemiyle normal (içbükey çokgende de doğru)
  function newell(pts) {
    let nx = 0, ny = 0, nz = 0;
    for (let i = 0; i < pts.length; i++) {
      const a = pts[i], b = pts[(i + 1) % pts.length];
      nx += (a[1] - b[1]) * (a[2] + b[2]); ny += (a[2] - b[2]) * (a[0] + b[0]); nz += (a[0] - b[0]) * (a[1] + b[1]);
    }
    return norm([nx, ny, nz]);
  }

  function rotMat(rx, ry, rz) {
    const cx = Math.cos(rx), sx = Math.sin(rx), cy = Math.cos(ry), sy = Math.sin(ry), cz = Math.cos(rz), sz = Math.sin(rz);
    // R = Rz * Ry * Rx
    return [
      [cz * cy, cz * sy * sx - sz * cx, cz * sy * cx + sz * sx],
      [sz * cy, sz * sy * sx + cz * cx, sz * sy * cx - cz * sx],
      [-sy, cy * sx, cy * cx]];
  }
  const mv = (m, p) => [m[0][0] * p[0] + m[0][1] * p[1] + m[0][2] * p[2], m[1][0] * p[0] + m[1][1] * p[1] + m[1][2] * p[2], m[2][0] * p[0] + m[2][1] * p[1] + m[2][2] * p[2]];

  class Obj {
    constructor(mesh, o = {}) {
      this.mesh = mesh; this.color = o.color || '#9aa6b2'; this.alpha = o.alpha ?? 1;
      this.pos = o.pos || [0, 0, 0]; this.rot = o.rot || [0, 0, 0]; this.scl = o.scl || [1, 1, 1];
      this.piv = o.piv || null; this.visible = o.visible ?? true; this.two = !!o.two; this.edge = o.edge ?? true;
      this.name = o.name || ''; this.glow = 0; this.prot = o.prot || null; this.bias = o.bias || 0;
    }
    // ölçek -> dönüş (pivot etrafında) -> öteleme ; isteğe bağlı üst dönüş (prot: {piv, ang z})
    world() {
      const m = rotMat(this.rot[0], this.rot[1], this.rot[2]), s = this.scl, P = this.pos, pv = this.piv || [0, 0, 0];
      let out = this.mesh.v.map(p => { let q = [p[0] * s[0], p[1] * s[1], p[2] * s[2]]; q = sub(q, pv); q = mv(m, q); q = add(q, pv); return add(q, P); });
      if (this.prot) {
        const c = Math.cos(this.prot.a), sn = Math.sin(this.prot.a), o = this.prot.piv;
        out = out.map(p => { const x = p[0] - o[0], y = p[1] - o[1]; return [o[0] + x * c - y * sn, o[1] + x * sn + y * c, p[2]]; });
      }
      return out;
    }
  }

  class View {
    constructor(canvas, o = {}) {
      this.cv = canvas; this.cx = canvas.getContext('2d');
      this.objs = []; this.ov = []; this.cam = { yaw: -0.6, pitch: 0.35, dist: 9, t: [0, 0, 0] };
      this.camT = Object.assign({}, this.cam, { t: [0, 0, 0] });
      this.light = norm([-0.45, 0.8, 0.55]); this.bg = o.bg || null;
      this.user = false; this.onFrame = null; this.time = 0; this._last = 0; this.running = false;
      this.font = '"Bahnschrift SemiCondensed","Bahnschrift","Arial Narrow",sans-serif';
      this._bind(); this.resize();
      this.ro = new ResizeObserver(() => this.resize()); this.ro.observe(canvas);
    }
    add(mesh, o) { const ob = new Obj(mesh, o); this.objs.push(ob); return ob; }
    clear() { this.objs = []; this.ov = []; }
    resize() {
      const r = this.cv.getBoundingClientRect(), d = Math.min(window.devicePixelRatio || 1, 2);
      this.W = Math.max(10, r.width); this.H = Math.max(10, r.height);
      this.cv.width = Math.round(this.W * d); this.cv.height = Math.round(this.H * d);
      this.cx.setTransform(d, 0, 0, d, 0, 0);
    }
    _bind() {
      const cv = this.cv; const ptrs = new Map(); let lastTap = 0, moved = 0, pinch = 0;
      const clampD = d => Math.max(2, Math.min(40, d));
      cv.addEventListener('pointerdown', e => {
        ptrs.set(e.pointerId, { x: e.clientX, y: e.clientY }); try { cv.setPointerCapture(e.pointerId); } catch (_) { }
        this.user = true; moved = 0;
        if (ptrs.size === 2) { const [a, b] = [...ptrs.values()]; pinch = Math.hypot(a.x - b.x, a.y - b.y); }
      });
      cv.addEventListener('pointermove', e => {
        const q = ptrs.get(e.pointerId); if (!q) return;
        const dx = e.clientX - q.x, dy = e.clientY - q.y; q.x = e.clientX; q.y = e.clientY; moved += Math.abs(dx) + Math.abs(dy);
        if (ptrs.size >= 2) {
          const [a, b] = [...ptrs.values()], d = Math.hypot(a.x - b.x, a.y - b.y);
          if (pinch > 0 && d > 0) this.camT.dist = clampD(this.camT.dist * pinch / d);
          pinch = d; return;
        }
        this.camT.yaw -= dx * 0.008; this.camT.pitch = Math.max(-1.2, Math.min(1.35, this.camT.pitch + dy * 0.006));
      });
      const up = e => {
        const was = ptrs.size; ptrs.delete(e.pointerId); pinch = 0;
        if (e.type === 'pointerup' && was === 1 && moved < 8 && e.pointerType !== 'mouse') { // dokunmada çift dokunma = sıfırla
          const now = performance.now(); if (now - lastTap < 350 && this.home) this.setCam(this.home); lastTap = now;
        }
      };
      cv.addEventListener('pointerup', up); cv.addEventListener('pointercancel', up);
      cv.addEventListener('wheel', e => { e.preventDefault(); this.camT.dist = clampD(this.camT.dist * Math.exp(e.deltaY * 0.0012)); }, { passive: false });
      cv.addEventListener('dblclick', () => { if (this.home) this.setCam(this.home); });
    }
    setCam(c) { this.home = c; this.camT = { yaw: c.yaw, pitch: c.pitch, dist: c.dist, t: (c.t || [0, 0, 0]).slice() }; }
    _basis() {
      const c = this.cam, cp = Math.cos(c.pitch);
      const eye = add(c.t, [c.dist * cp * Math.sin(c.yaw), c.dist * Math.sin(c.pitch), c.dist * cp * Math.cos(c.yaw)]);
      const f = norm(sub(c.t, eye)); const r = norm(cross(f, [0, 1, 0])); const u = cross(r, f);
      return { eye, f, r, u };
    }
    proj(p) {
      const B = this._b, q = sub(p, B.eye), z = dot(q, B.f), x = dot(q, B.r), y = dot(q, B.u);
      const k = this.H * 1.25 / Math.max(z, 0.05);
      return [this.W / 2 + x * k, this.H / 2 - y * k, z];
    }
    start() {
      if (this.running) return; this.running = true;
      const loop = ts => {
        if (!this.running) return;
        const dt = Math.min(0.05, (ts - (this._last || ts)) / 1000); this._last = ts; this.time += dt;
        const k = 1 - Math.exp(-dt * 4.2);
        this.cam.yaw = lerp(this.cam.yaw, this.camT.yaw, k); this.cam.pitch = lerp(this.cam.pitch, this.camT.pitch, k);
        this.cam.dist = lerp(this.cam.dist, this.camT.dist, k);
        this.cam.t = this.cam.t.map((v, i) => lerp(v, this.camT.t[i], k));
        if (this.onFrame) this.onFrame(dt, this.time);
        this.render();
        requestAnimationFrame(loop);
      };
      requestAnimationFrame(loop);
    }
    stop() { this.running = false; this._last = 0; }
    render() {
      const c = this.cx, W = this.W, H = this.H; this._b = this._basis();
      c.clearRect(0, 0, W, H);
      const faces = [], eye = this._b.eye, L = this.light;
      for (const ob of this.objs) {
        if (!ob.visible || ob.alpha <= 0.01) continue;
        const wv = ob.world(), pv = wv.map(p => this.proj(p)), base = hexRgb(ob.color);
        for (const F of ob.mesh.f) {
          const pts = F.i.map(i => wv[i]);
          let n = newell(pts);
          const cen = pts.reduce((a, p) => add(a, p), [0, 0, 0]).map(v => v / pts.length);
          const vd = dot(n, sub(eye, cen));
          if (vd <= 0) { if (!ob.two) continue; n = mul(n, -1); }
          let z = 0; for (const i of F.i) z += pv[i][2]; z /= F.i.length;
          if (z < 0.1) continue;
          const lam = Math.max(0, dot(n, L)), view = norm(sub(eye, cen));
          const h = norm(add(L, view)), spec = Math.pow(Math.max(0, dot(n, h)), 28) * 0.22;
          const k = 0.38 + 0.62 * lam;
          const col = base.map(v => Math.min(255, Math.round(v * k + 255 * spec + ob.glow * 60 + (F.cut ? 22 : 0))));
          faces.push({ z: z + (ob.bias || 0), p: F.i.map(i => pv[i]), col, a: ob.alpha, e: F.e && ob.edge, cut: F.cut });
        }
      }
      faces.sort((a, b) => b.z - a.z);
      c.lineJoin = 'round';
      for (const F of faces) {
        c.beginPath(); c.moveTo(F.p[0][0], F.p[0][1]);
        for (let i = 1; i < F.p.length; i++) c.lineTo(F.p[i][0], F.p[i][1]);
        c.closePath();
        c.fillStyle = `rgba(${F.col[0]},${F.col[1]},${F.col[2]},${F.a})`; c.fill();
        if (F.cut) { // kesit yüzeyi: teknik resim taraması
          c.save(); c.clip();
          let x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity;
          for (const q of F.p) { x0 = Math.min(x0, q[0]); x1 = Math.max(x1, q[0]); y0 = Math.min(y0, q[1]); y1 = Math.max(y1, q[1]); }
          c.strokeStyle = `rgba(255,255,255,${0.32 * F.a})`; c.lineWidth = 1; c.beginPath();
          for (let s = x0 - (y1 - y0); s < x1; s += 6) { c.moveTo(s, y1); c.lineTo(s + (y1 - y0), y0); }
          c.stroke(); c.restore();
          c.beginPath(); c.moveTo(F.p[0][0], F.p[0][1]); for (let i = 1; i < F.p.length; i++) c.lineTo(F.p[i][0], F.p[i][1]); c.closePath();
        }
        if (F.e) { c.strokeStyle = `rgba(255,255,255,${0.16 * F.a})`; c.lineWidth = 0.8; c.stroke(); }
        else if (F.a >= 0.99) { c.strokeStyle = `rgba(${F.col[0]},${F.col[1]},${F.col[2]},1)`; c.lineWidth = 0.6; c.stroke(); }
      }
      for (const o of this.ov) this._ov(o);
    }
    // ---- ekran üstü katman ----
    _ov(o) {
      const c = this.cx, a = o.alpha ?? 1; if (a <= 0.01) return;
      c.save(); c.globalAlpha = a;
      const col = o.color || '#ffffff';
      if (o.k === 'arrow') {
        const p0 = this.proj(o.a), p1 = this.proj(o.b), w = o.w || 2.4;
        const dx = p1[0] - p0[0], dy = p1[1] - p0[1], L = Math.hypot(dx, dy) || 1, ux = dx / L, uy = dy / L;
        const hs = Math.min(o.hs || 12, L * 0.6);
        c.strokeStyle = col; c.fillStyle = col; c.lineWidth = w; c.lineCap = 'round';
        if (o.dash) c.setLineDash(o.dash);
        c.beginPath(); c.moveTo(p0[0], p0[1]); c.lineTo(p1[0] - ux * hs * 0.8, p1[1] - uy * hs * 0.8); c.stroke(); c.setLineDash([]);
        c.beginPath(); c.moveTo(p1[0], p1[1]);
        c.lineTo(p1[0] - ux * hs - uy * hs * 0.45, p1[1] - uy * hs + ux * hs * 0.45);
        c.lineTo(p1[0] - ux * hs + uy * hs * 0.45, p1[1] - uy * hs - ux * hs * 0.45); c.closePath(); c.fill();
        if (o.label) this._txt(o.label, o.lp ? this.proj(o.lp) : [p0[0] - ux * 14, p0[1] - uy * 14], col, o.size || 14, o.align || 'center', o.box);
      } else if (o.k === 'line') {
        const P = o.p.map(p => this.proj(p));
        c.strokeStyle = col; c.lineWidth = o.w || 1.4; if (o.dash) c.setLineDash(o.dash);
        c.beginPath(); P.forEach((q, i) => i ? c.lineTo(q[0], q[1]) : c.moveTo(q[0], q[1])); if (o.close) c.closePath(); c.stroke();
        if (o.fill) { c.fillStyle = o.fill; c.fill(); }
      } else if (o.k === 'text') {
        const p = this.proj(o.p); this._txt(o.t, [p[0] + (o.dx || 0), p[1] + (o.dy || 0)], col, o.size || 14, o.align || 'center', o.box);
      } else if (o.k === 'dim') {
        // a,b: uçlar; off: ölçü çizgisinin kayma vektörü
        const A = add(o.a, o.off), B = add(o.b, o.off);
        const pa = this.proj(o.a), pb = this.proj(o.b), qa = this.proj(A), qb = this.proj(B);
        c.strokeStyle = col; c.fillStyle = col; c.lineWidth = 1;
        c.globalAlpha = a * 0.6; c.beginPath(); c.moveTo(pa[0], pa[1]); c.lineTo(qa[0], qa[1]); c.moveTo(pb[0], pb[1]); c.lineTo(qb[0], qb[1]); c.stroke();
        c.globalAlpha = a;
        c.beginPath(); c.moveTo(qa[0], qa[1]); c.lineTo(qb[0], qb[1]); c.stroke();
        const dx = qb[0] - qa[0], dy = qb[1] - qa[1], L = Math.hypot(dx, dy) || 1, ux = dx / L, uy = dy / L, hs = 7;
        [[qa, 1], [qb, -1]].forEach(([q, s]) => { c.beginPath(); c.moveTo(q[0], q[1]); c.lineTo(q[0] + s * ux * hs - uy * 3, q[1] + s * uy * hs + ux * 3); c.lineTo(q[0] + s * ux * hs + uy * 3, q[1] + s * uy * hs - ux * 3); c.closePath(); c.fill(); });
        this._txt(o.t, [(qa[0] + qb[0]) / 2 + (o.tdx || 0), (qa[1] + qb[1]) / 2 + (o.tdy ?? -9)], col, o.size || 13, 'center', true);
      } else if (o.k === 'ring') {
        const n = 40, P = []; const u = o.u || [1, 0, 0], v = o.v || [0, 1, 0];
        for (let i = 0; i <= n; i++) { const t = 2 * Math.PI * i / n; P.push(this.proj(add(o.c, add(mul(u, o.r * Math.cos(t)), mul(v, o.r * Math.sin(t)))))); }
        c.strokeStyle = col; c.lineWidth = o.w || 2; if (o.dash) c.setLineDash(o.dash);
        c.beginPath(); P.forEach((q, i) => i ? c.lineTo(q[0], q[1]) : c.moveTo(q[0], q[1])); c.stroke();
      } else if (o.k === 'hatch') {
        // a-b doğrusu boyunca destek taraması; n: taramanın yönü (dünya vektörü)
        const pa = this.proj(o.a), pb = this.proj(o.b), N = Math.max(4, Math.round(Math.hypot(pb[0] - pa[0], pb[1] - pa[1]) / 9));
        c.strokeStyle = col; c.lineWidth = 1.6; c.beginPath(); c.moveTo(pa[0], pa[1]); c.lineTo(pb[0], pb[1]); c.stroke();
        c.lineWidth = 1; c.beginPath();
        for (let i = 0; i <= N; i++) { const p = add(o.a, mul(sub(o.b, o.a), i / N)); const q0 = this.proj(p), q1 = this.proj(add(p, o.n)); c.moveTo(q0[0], q0[1]); c.lineTo(q1[0], q1[1]); }
        c.stroke();
      } else if (o.k === 'spring') {
        // a'dan b'ye zikzak yay
        const n = o.n || 8, P = [], ax = sub(o.b, o.a), side = o.side || [1, 0, 0];
        P.push(o.a); P.push(add(o.a, mul(ax, 0.12)));
        for (let i = 0; i < n; i++) { const t = 0.12 + 0.76 * (i + 0.5) / n; P.push(add(add(o.a, mul(ax, t)), mul(side, (i % 2 ? -1 : 1) * (o.r || 0.18)))); }
        P.push(add(o.a, mul(ax, 0.88))); P.push(o.b);
        const Q = P.map(p => this.proj(p));
        c.strokeStyle = col; c.lineWidth = o.w || 2; c.beginPath(); Q.forEach((q, i) => i ? c.lineTo(q[0], q[1]) : c.moveTo(q[0], q[1])); c.stroke();
      }
      c.restore();
    }
    // "F_BD" yazımı: alt simge olarak çizilir. Parça listesi: [{s, sub}]
    _segs(l) {
      const out = [], re = /([^\s_]*)_([A-Za-z0-9,]+)/g; let i = 0, m;
      while ((m = re.exec(l))) { if (m.index > i) out.push({ s: l.slice(i, m.index) }); out.push({ s: m[1] }); out.push({ s: m[2], sub: 1 }); i = m.index + m[0].length; }
      if (i < l.length) out.push({ s: l.slice(i) });
      return out.length ? out : [{ s: l }];
    }
    _txt(t, p, col, size, align, box) {
      const c = this.cx; c.font = `500 ${size}px ${this.font}`; c.textBaseline = 'middle';
      const lines = String(t).split('\n'), sf = Math.round(size * 0.72);
      const wid = l => this._segs(l).reduce((w, g) => { c.font = `500 ${g.sub ? sf : size}px ${this.font}`; return w + c.measureText(g.s).width; }, 0);
      const ws = lines.map(wid), W0 = Math.max(...ws), h = lines.length * (size + 3) + 4;
      // sol kenar x0: hizaya göre; tuvalin dışına taşmasın
      let x0 = align === 'center' ? p[0] - W0 / 2 : align === 'right' ? p[0] - W0 : p[0];
      const pad = box ? 5 : 2;
      x0 = Math.max(pad + 2, Math.min(this.W - W0 - pad - 2, x0));
      let y = Math.max(h / 2 + 1, Math.min(this.H - h / 2 - 1, p[1]));
      if (W0 + 2 * pad > this.W) x0 = pad;
      if (box) {
        c.fillStyle = 'rgba(11,14,18,.78)'; c.beginPath(); c.roundRect ? c.roundRect(x0 - 5, y - h / 2, W0 + 10, h, 5) : c.rect(x0 - 5, y - h / 2, W0 + 10, h); c.fill();
      }
      c.fillStyle = col; c.textAlign = 'left';
      lines.forEach((l, i) => {
        const ly = y + (i - (lines.length - 1) / 2) * (size + 3);
        let x = align === 'center' ? x0 + (W0 - ws[i]) / 2 : align === 'right' ? x0 + (W0 - ws[i]) : x0;
        for (const g of this._segs(l)) { c.font = `500 ${g.sub ? sf : size}px ${this.font}`; c.fillText(g.s, x, ly + (g.sub ? size * 0.22 : 0)); x += c.measureText(g.s).width; }
      });
    }
  }
  return { View, box, cyl, tube, extrude, add, sub, mul, norm, lerp };
})();
