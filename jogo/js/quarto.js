// ============================================================
//  QUARTO ISOMÉTRICO
//  • Andar: setas / WASD, tocar no piso, ou o controle na tela
//  • A porta (parede da esquerda) leva para o mapa dos mundos
//  • Modo DECORAR: colocar, girar e guardar móveis
//  Coordenadas: x cresce para baixo-direita, y para baixo-esquerda.
// ============================================================
(function () {
  const N = 8, LW = 304, LH = 236, OX = LW / 2, OY = 86, PAREDE = 74;
  const PORTA = { x: 0, y: 2 };              // ladrilho na frente da porta
  const PISOS = [["#c8955a", "#b8854a", "madeira"], ["#a8aec0", "#9aa0b2", "xadrez"], ["#5aa86a", "#4e9c5e", "grama"], ["#e8e0d0", "#dcd2c0", "xadrez"], ["#6a5aa8", "#5e4e9c", "xadrez"], ["#2a2e40", "#3a3e52", "xadrez"],
    ["#b07a48", "#9a6a3c", "taco"], ["#d84a6a", "#b83a58", "carpete"], ["#3a8ad0", "#2f78bc", "carpete"], ["#ececf2", "#d4d4e0", "marmore"], ["#16102a", "#ff2a8a", "neon"], ["#16102a", "#3fd0ff", "neon"]];
  const PAREDES = ["#8ab4e8", "#e8a0b4", "#a0d8a0", "#e8d090", "#b0a0e0", "#d0d0d8", "#3a3a5a", "#ff9a5a", "#5ad0c0", "#f4f0e6", "#1e1e2e"];
  const PAPEIS = ["Lisa", "Listras", "Bolinhas", "Tijolos", "Lambri", "Estrelas"];
  const papelCss = (i, c) => {
    const e = AVATAR.tom(c, 0.85), cl = AVATAR.tom(c, 1.35);
    return [c, `repeating-linear-gradient(90deg,${c} 0 7px,${e} 7px 12px)`, `radial-gradient(${cl} 2px,transparent 3px) 0 0/11px 11px,${c}`,
      `repeating-linear-gradient(0deg,${c} 0 7px,${AVATAR.tom(c, 0.7)} 7px 8px)`, `linear-gradient(${c} 50%,#6a4020 50%,#6a4020 54%,#a8743e 54%)`, `radial-gradient(#ffd23f 1.5px,transparent 2px) 0 0/12px 12px,${c}`][i] || c;
  };
  const sorte = (a, b) => { const v = Math.sin(a * 127.1 + b * 311.7) * 43758.5453; return v - Math.floor(v); };
  const P = (x, y, z) => ISO.ponto(OX, OY, x, y, z);

  class Quarto {
    constructor(canvas, op) {
      this.cv = canvas; this.op = op;
      this.ctx = canvas.getContext("2d");
      canvas.width = LW * 2; canvas.height = LH * 2;   // resolução dobrada: o avatar fica bem definido
      this.ctx.imageSmoothingEnabled = false;
      this.q = JSON.parse(JSON.stringify(op.quarto || { piso: 0, parede: 0, itens: [] }));
      this.q.itens = (this.q.itens || []).filter(i => MOVEIS.some(m => m.id === i.m));
      this.eu = { x: 3, y: 3, px: 3, py: 3, dir: 0, quadro: 0, t: 0 };
      if (!this.livre(3, 3)) { const l = this.primeiroLivre(); if (l) Object.assign(this.eu, { x: l[0], y: l[1], px: l[0], py: l[1] }); }
      this.caminho = []; this.teclas = new Set(); this.vivo = true;
      this.editando = false; this.pegando = null; this.selecionado = null; this.mouse = null;
      this.piscaT = 0; this.pets = new Map();
      this._tecla = e => this.tecla(e); this._solta = e => this.teclas.delete(e.key);
      addEventListener("keydown", this._tecla); addEventListener("keyup", this._solta);
      canvas.addEventListener("pointerdown", e => this.toque(e));
      canvas.addEventListener("pointermove", e => { this.mouse = this.ladrilho(e); });
      canvas.addEventListener("pointerleave", () => { this.mouse = null; });
      this.ultimo = performance.now();
      requestAnimationFrame(t => this.loop(t));
    }
    parar() { this.vivo = false; removeEventListener("keydown", this._tecla); removeEventListener("keyup", this._solta); }

    // ---------- ocupação ----------
    ocupado(ignorar) {
      const o = new Set();
      this.q.itens.forEach(it => { if (it === ignorar) return; const m = MOVEIS.find(x => x.id === it.m); if (!m || m.andavel || m.pet) return; const [w, d] = ISO.pegada(m, it.r); for (let i = 0; i < w; i++) for (let j = 0; j < d; j++) o.add((it.x + i) + "," + (it.y + j)); });
      return o;
    }
    livre(x, y) { return x >= 0 && y >= 0 && x < N && y < N && !this.ocupado().has(x + "," + y); }
    primeiroLivre() { for (let s = 0; s < 2 * N; s++) for (let x = 0; x <= s; x++) { const y = s - x; if (this.livre(x, y)) return [x, y]; } return null; }
    cabe(m, X, Y, r, ignorar) {
      const [w, d] = ISO.pegada(m, r); const oc = this.ocupado(ignorar);
      for (let i = 0; i < w; i++) for (let j = 0; j < d; j++) {
        const x = X + i, y = Y + j;
        if (x < 0 || y < 0 || x >= N || y >= N) return false;
        if (!m.andavel && (oc.has(x + "," + y) || (Math.round(this.eu.px) === x && Math.round(this.eu.py) === y) || (x === PORTA.x && y === PORTA.y))) return false;
        if (m.andavel && this.q.itens.some(it => it !== ignorar && it.m === m.id && it.x === X && it.y === Y)) return false;
        if (m.pet && this.q.itens.some(it => it !== ignorar && (MOVEIS.find(z => z.id === it.m) || {}).pet && it.x === X && it.y === Y)) return false;
      }
      return true;
    }
    itemEm(x, y) {
      for (let k = this.q.itens.length - 1; k >= 0; k--) { const it = this.q.itens[k], m = MOVEIS.find(z => z.id === it.m), [w, d] = ISO.pegada(m, it.r); if (x >= it.x && x < it.x + w && y >= it.y && y < it.y + d) return it; }
      return null;
    }

    // ---------- entrada ----------
    ladrilho(e) {
      const r = this.cv.getBoundingClientRect();
      const lx = (e.clientX - r.left) * LW / r.width - OX, ly = (e.clientY - r.top) * LH / r.height - OY;
      const x = Math.floor((ly / (ISO.TH / 2) + lx / (ISO.TW / 2)) / 2), y = Math.floor((ly / (ISO.TH / 2) - lx / (ISO.TW / 2)) / 2);
      // clique na porta?
      const [ax, ay] = P(0, 2, 0), [bx, by] = P(0, 3, 0);
      const naPorta = lx + OX >= ax - 2 && lx + OX <= bx + 2 && ly + OY <= by && ly + OY >= ay - 44 && x < 0;
      return { x, y, porta: naPorta };
    }
    toque(e) {
      const t = this.ladrilho(e);
      if (this.editando) return this.toqueEditar(t);
      if (this.op.visita) return;
      if (t.porta) { this.irPara(PORTA.x, PORTA.y, true); return; }
      if (t.x < 0 || t.y < 0 || t.x >= N || t.y >= N) return;
      this.irPara(t.x, t.y, false);
    }
    tecla(e) {
      if (this.op.visita || this.editando) return;
      const k = e.key; const mapa = { ArrowRight: [1, 0], ArrowLeft: [-1, 0], ArrowDown: [0, 1], ArrowUp: [0, -1], d: [1, 0], a: [-1, 0], s: [0, 1], w: [0, -1] };
      if (!mapa[k]) return;
      if (document.activeElement && /INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName)) return;
      e.preventDefault(); this.teclas.add(k); if (!this.caminho.length) this.passo(...mapa[k]);
    }
    passo(dx, dy) {
      const e = this.eu, nx = e.x + dx, ny = e.y + dy;
      e.dir = dx > 0 ? 0 : dy > 0 ? 1 : dx < 0 ? 2 : 3;
      if (e.x === PORTA.x && e.y === PORTA.y && dx === -1) { this.sair(); return; }
      if (this.livre(nx, ny)) this.caminho = [[nx, ny]];
    }
    irPara(x, y, sairDepois) {
      const ini = [this.eu.x, this.eu.y], oc = this.ocupado();
      const chave = (a, b) => a + "," + b, vindo = new Map([[chave(...ini), null]]), fila = [ini];
      while (fila.length) {
        const [cx, cy] = fila.shift(); if (cx === x && cy === y) break;
        for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
          const nx = cx + dx, ny = cy + dy, k = chave(nx, ny);
          if (nx < 0 || ny < 0 || nx >= N || ny >= N || oc.has(k) || vindo.has(k)) continue;
          vindo.set(k, [cx, cy]); fila.push([nx, ny]);
        }
      }
      if (!vindo.has(chave(x, y))) return;
      const cam = []; let c = [x, y];
      while (c && chave(...c) !== chave(...ini)) { cam.unshift(c); c = vindo.get(chave(...c)); }
      this.caminho = cam; this.sairNoFim = sairDepois;
      if (!cam.length && sairDepois) this.sair();
    }
    sair() { if (this.op.aoSair) { this.parar(); this.op.aoSair(); } }
    dpad(dx, dy) { if (!this.caminho.length && !this.editando) this.passo(dx, dy); }

    // ---------- decorar ----------
    toqueEditar(t) {
      if (t.x < 0 || t.y < 0 || t.x >= N || t.y >= N) return;
      if (this.pegando) {
        const m = MOVEIS.find(z => z.id === this.pegando.m);
        if (this.cabe(m, t.x, t.y, this.pegando.r, this.pegando.item)) {
          if (this.pegando.item) { Object.assign(this.pegando.item, { x: t.x, y: t.y, r: this.pegando.r }); this.selecionado = this.pegando.item; }
          else { const it = { m: m.id, x: t.x, y: t.y, r: this.pegando.r }; this.q.itens.push(it); this.selecionado = it; }
          this.pegando = null; this.op.aoMudar && this.op.aoMudar();
        } else this.op.aoErro && this.op.aoErro("Não cabe aí!");
        return;
      }
      const it = this.itemEm(t.x, t.y);
      this.selecionado = it; this.op.aoMudar && this.op.aoMudar();
    }
    pegarDoInventario(id) { this.pegando = { m: id, r: 0, item: null }; this.selecionado = null; }
    moverSelecionado() { if (this.selecionado) { this.pegando = { m: this.selecionado.m, r: this.selecionado.r, item: this.selecionado }; } }
    girar() {
      if (this.pegando) { this.pegando.r = (this.pegando.r + 1) % 2; return; }
      const it = this.selecionado; if (!it) return;
      const m = MOVEIS.find(z => z.id === it.m), nr = (it.r + 1) % 2;
      if (this.cabe(m, it.x, it.y, nr, it)) { it.r = nr; this.op.aoMudar && this.op.aoMudar(); } else this.op.aoErro && this.op.aoErro("Sem espaço para girar.");
    }
    guardar() { if (!this.selecionado) return; this.q.itens = this.q.itens.filter(i => i !== this.selecionado); this.selecionado = null; this.op.aoMudar && this.op.aoMudar(); }
    usados(id) { return this.q.itens.filter(i => i.m === id).length; }

    // ---------- laço de animação ----------
    loop(t) {
      if (!this.vivo) return;
      const dt = Math.min(50, t - this.ultimo); this.ultimo = t;
      const e = this.eu, vel = 0.0045 * dt;
      if (this.caminho.length) {
        const [tx, ty] = this.caminho[0];
        const dx = tx - e.px, dy = ty - e.py;
        e.dir = tx > e.x ? 0 : ty > e.y ? 1 : tx < e.x ? 2 : 3;
        if (Math.abs(dx) + Math.abs(dy) <= vel) {
          e.px = e.x = tx; e.py = e.y = ty; this.caminho.shift();
          if (!this.caminho.length) {
            if (this.sairNoFim && e.x === PORTA.x && e.y === PORTA.y) { this.sairNoFim = false; this.sair(); return; }
            const k = [...this.teclas].pop();
            const mapa = { ArrowRight: [1, 0], ArrowLeft: [-1, 0], ArrowDown: [0, 1], ArrowUp: [0, -1], d: [1, 0], a: [-1, 0], s: [0, 1], w: [0, -1] };
            if (k && mapa[k]) this.passo(...mapa[k]);
          }
        } else { e.px += Math.sign(dx) * vel; e.py += Math.sign(dy) * vel; }
        e.t += dt; e.quadro = [1, 0, 2, 0][Math.floor(e.t / 140) % 4];
      } else { e.quadro = 0; e.t = 0; }
      this.piscaT += dt;
      this.andarPets(dt);
      this.desenhar();
      requestAnimationFrame(tt => this.loop(tt));
    }

    // ---------- bichinhos ----------
    andarPets(dt) {
      const vivos = new Set();
      const oc = this.ocupado(), eu = [Math.round(this.eu.px), Math.round(this.eu.py)];
      this.q.itens.forEach(it => {
        const m = MOVEIS.find(z => z.id === it.m); if (!m || !m.pet) return;
        vivos.add(it);
        let p = this.pets.get(it);
        if (!p || this.editando) { p = { x: it.x, y: it.y, px: it.x, py: it.y, alvo: null, espera: 600 + Math.random() * 2000, dir: it.r % 2 ? -1 : 1, t: 0, quadro: 0 }; this.pets.set(it, p); if (this.editando) return; }
        if (!p.alvo) {
          p.quadro = 0; p.espera -= dt;
          if (p.espera <= 0) {
            const op = [[1, 0], [-1, 0], [0, 1], [0, -1]].map(([dx, dy]) => [p.x + dx, p.y + dy]).filter(([x, y]) => x >= 0 && y >= 0 && x < N && y < N && !oc.has(x + "," + y) && !(x === PORTA.x && y === PORTA.y) && !(x === eu[0] && y === eu[1]) && ![...this.pets.values()].some(o => o !== p && ((o.x === x && o.y === y) || (o.alvo && o.alvo[0] === x && o.alvo[1] === y))));
            if (op.length) { p.alvo = op[Math.floor(Math.random() * op.length)]; p.dir = (p.alvo[0] - p.x) - (p.alvo[1] - p.y) > 0 ? 1 : -1; }
            p.espera = 700 + Math.random() * 2600;
          }
        } else {
          const v = 0.0016 * dt, dx = p.alvo[0] - p.px, dy = p.alvo[1] - p.py;
          if (Math.abs(dx) + Math.abs(dy) <= v) { p.px = p.x = p.alvo[0]; p.py = p.y = p.alvo[1]; p.alvo = null; }
          else { p.px += Math.sign(dx) * v; p.py += Math.sign(dy) * v; }
          p.t += dt; p.quadro = [1, 0, 2, 0][Math.floor(p.t / 120) % 4];
        }
      });
      for (const k of [...this.pets.keys()]) if (!vivos.has(k)) this.pets.delete(k);
    }

    // parede: retângulo no plano da parede ("e" = esquerda, x = 0; "d" = direita, y = 0)
    quadParede(lado, u0, u1, v0, v1, cor) {
      const Q = (u, v) => lado === "e" ? P(0, u, v) : P(u, 0, v);
      ISO.poli(this.ctx, [Q(u0, v1), Q(u1, v1), Q(u1, v0), Q(u0, v0)], cor);
    }
    papelDeParede(tipo, cp) {
      const Q = (l, u0, u1, v0, v1, cor) => this.quadParede(l, u0, u1, v0, v1, cor);
      ["e", "d"].forEach(l => {
        const esc = l === "e" ? "rgba(0,0,0,.1)" : "rgba(0,0,0,.08)", cla = "rgba(255,255,255,.28)";
        if (tipo === 1) for (let u = 0.25; u < N; u += 0.5) Q(l, u, u + 0.22, 0, PAREDE, esc);
        if (tipo === 2) for (let v = 8, k = 0; v < PAREDE - 4; v += 10, k++) for (let u = (k % 2) * 0.25 + 0.12; u < N; u += 0.5) Q(l, u, u + 0.09, v, v + 2.5, cla);
        if (tipo === 3) for (let v = 6, k = 0; v < PAREDE; v += 6, k++) { Q(l, 0, N, v, v + 0.9, "rgba(0,0,0,.16)"); for (let u = (k % 2) * 0.3; u < N; u += 0.6) Q(l, u, u + 0.05, v - 5.1, v, "rgba(0,0,0,.14)"); }
        if (tipo === 4) { Q(l, 0, N, 0, 28, l === "e" ? "#8a5a30" : "#a8743e"); for (let u = 0.33; u < N; u += 0.33) Q(l, u, u + 0.04, 3, 27, "rgba(0,0,0,.18)"); Q(l, 0, N, 27, 30, l === "e" ? "#5a3a1c" : "#6a4020"); Q(l, 0, N, 29.4, 30, "rgba(255,255,255,.25)"); }
        if (tipo === 5) for (let k = 0; k < 26; k++) { const u = sorte(k, l === "e" ? 1 : 2) * (N - 0.2) + 0.1, v = 6 + sorte(k, 7) * (PAREDE - 12); Q(l, u - 0.03, u + 0.03, v - 2, v + 2, "#ffd23f"); Q(l, u - 0.09, u + 0.09, v - 0.6, v + 0.6, "#ffd23f"); }
      });
    }
    janela() {
      const Q = (u0, u1, v0, v1, cor) => this.quadParede("d", u0, u1, v0, v1, cor);
      Q(4.75, 6.45, 26, 60, "#f2f2f6");                        // moldura
      Q(4.88, 6.32, 29, 57, "#8fd8ff"); Q(4.88, 6.32, 43, 57, "#b8e8ff");   // vidro (céu)
      Q(5.0, 5.4, 49, 52, "rgba(255,255,255,.9)"); Q(5.2, 5.7, 51, 54, "rgba(255,255,255,.9)");   // nuvem
      Q(5.57, 5.63, 29, 57, "#f2f2f6"); Q(4.88, 6.32, 42.5, 44, "#f2f2f6");   // cruz
      Q(4.92, 5.1, 30, 41, "rgba(255,255,255,.35)");
      Q(4.65, 6.55, 23.5, 26, "#d0d0dc");                      // parapeito
      const c = this.ctx, [a, b] = P(4.75, 0, 60), [a2, b2] = P(4.75, 0, 26); c.fillStyle = "rgba(20,12,28,.35)"; c.fillRect(Math.round(a) - 1, Math.round(b), 1, Math.round(b2 - b));
    }

    desenhar() {
      const c = this.ctx, q = this.q;
      c.setTransform(1, 0, 0, 1, 0, 0); c.clearRect(0, 0, LW * 2, LH * 2); c.setTransform(2, 0, 0, 2, 0, 0);
      // paredes
      const cp = PAREDES[q.parede] || PAREDES[0], cp1 = AVATAR.tom(cp, 0.82), cp2 = AVATAR.tom(cp, 0.68);
      ISO.poli(c, [P(0, 0, PAREDE), P(0, N, PAREDE), P(0, N, 0), P(0, 0, 0)], cp1);
      ISO.poli(c, [P(0, 0, PAREDE), P(N, 0, PAREDE), P(N, 0, 0), P(0, 0, 0)], cp);
      c.fillStyle = "rgba(255,255,255,.08)";
      for (let i = 1; i < N; i++) { const [a, b] = P(i, 0, PAREDE), [, d] = P(i, 0, 0); c.fillRect(Math.round(a), Math.round(b), 1, Math.round(d - b)); }
      for (let i = 1; i < N; i++) { const [a, b] = P(0, i, PAREDE), [, d] = P(0, i, 0); c.fillStyle = "rgba(0,0,0,.08)"; c.fillRect(Math.round(a), Math.round(b), 1, Math.round(d - b)); }
      ISO.poli(c, [P(0, 0, PAREDE), P(0, N, PAREDE), P(-0.25, N, PAREDE + 2), P(-0.25, -0.25, PAREDE + 2)], cp2);
      ISO.poli(c, [P(0, 0, PAREDE), P(N, 0, PAREDE), P(N, -0.25, PAREDE + 2), P(-0.25, -0.25, PAREDE + 2)], AVATAR.tom(cp, 1.15));
      this.papelDeParede(q.papel || 0, cp);
      this.janela();
      // rodapé
      ISO.poli(c, [P(0, 0, 3), P(0, N, 3), P(0, N, 0), P(0, 0, 0)], AVATAR.tom(cp, 0.6));
      ISO.poli(c, [P(0, 0, 3), P(N, 0, 3), P(N, 0, 0), P(0, 0, 0)], AVATAR.tom(cp, 0.7));
      // porta
      ISO.poli(c, [P(0, 2.08, 40), P(0, 2.92, 40), P(0, 2.92, 0), P(0, 2.08, 0)], "#5a3a20");
      ISO.poli(c, [P(0, 2.16, 37), P(0, 2.84, 37), P(0, 2.84, 0), P(0, 2.16, 0)], "#140c1c");
      const [px, py] = P(0, 2.75, 18); c.fillStyle = "#ffd23f"; c.fillRect(Math.round(px) - 1, Math.round(py), 2, 2);
      if (!this.op.visita) { c.fillStyle = "#ffd23f"; c.font = "8px 'Press Start 2P', monospace"; const [tx, ty] = P(0, 2.5, 50); c.lineWidth = 2; c.strokeStyle = "#140c1c"; c.strokeText("SAIR", Math.round(tx) - 18, Math.round(ty)); c.fillText("SAIR", Math.round(tx) - 18, Math.round(ty)); }
      // piso
      const [p0, p1, tipo] = PISOS[q.piso] || PISOS[0];
      const lado = (x0, y0, x1, y1, cor, lw) => { c.strokeStyle = cor; c.lineWidth = lw || 0.6; c.beginPath(); c.moveTo(...P(x0, y0, 0)); c.lineTo(...P(x1, y1, 0)); c.stroke(); };
      for (let x = 0; x < N; x++) for (let y = 0; y < N; y++) {
        const cor = tipo === "madeira" ? ((x + Math.floor(y / 2)) % 2 ? p0 : p1) : tipo === "grama" ? ((x * 7 + y * 3) % 5 ? p0 : p1) : tipo === "taco" ? ((x + y) % 2 ? p0 : p1) : (tipo === "carpete" || tipo === "neon") ? p0 : ((x + y) % 2 ? p0 : p1);
        ISO.poli(c, [P(x, y, 0), P(x + 1, y, 0), P(x + 1, y + 1, 0), P(x, y + 1, 0)], cor);
        if (tipo === "taco") { for (const k of [0.33, 0.66]) (x + y) % 2 ? lado(x + k, y, x + k, y + 1, "rgba(0,0,0,.14)") : lado(x, y + k, x + 1, y + k, "rgba(0,0,0,.14)"); }
        if (tipo === "carpete") for (let k = 0; k < 5; k++) { const [a, b] = P(x + sorte(x * 9 + k, y), y + sorte(y * 7 + k, x + 3), 0); c.fillStyle = k % 2 ? p1 : AVATAR.tom(p0, 1.12); c.fillRect(Math.round(a), Math.round(b), 1, 1); }
        if (tipo === "marmore") { const s0 = sorte(x, y); lado(x + s0 * 0.6, y, x + 0.3 + s0 * 0.5, y + 1, "rgba(150,150,170,.35)", 0.5); }
        if (tipo === "grama" && (x * 5 + y * 3) % 4 === 0) { const [a, b] = P(x + 0.5, y + 0.5, 0); c.fillStyle = AVATAR.tom(p0, 1.2); c.fillRect(Math.round(a), Math.round(b) - 1, 1, 2); c.fillRect(Math.round(a) + 2, Math.round(b), 1, 1); }
      }
      if (tipo === "neon") { for (let i = 0; i <= N; i++) { lado(i, 0, i, N, p1 + "55", 2.2); lado(0, i, N, i, p1 + "55", 2.2); } for (let i = 0; i <= N; i++) { lado(i, 0, i, N, p1, 0.6); lado(0, i, N, i, p1, 0.6); } }
      else { c.strokeStyle = "rgba(0,0,0,.12)"; c.lineWidth = 0.6;
        for (let i = 0; i <= N; i++) { c.beginPath(); c.moveTo(...P(i, 0, 0)); c.lineTo(...P(i, N, 0)); c.moveTo(...P(0, i, 0)); c.lineTo(...P(N, i, 0)); c.stroke(); } }
      // sombra suave no canto entre o piso e as paredes
      [0.16, 0.09, 0.04].forEach((a, k) => { ISO.poli(c, [P(0, k * 0.12, 0), P(N, k * 0.12, 0), P(N, (k + 1) * 0.12, 0), P(0, (k + 1) * 0.12, 0)], `rgba(0,0,0,${a})`); ISO.poli(c, [P(k * 0.12, 0, 0), P((k + 1) * 0.12, 0, 0), P((k + 1) * 0.12, N, 0), P(k * 0.12, N, 0)], `rgba(0,0,0,${a})`); });
      // borda frontal do piso
      ISO.poli(c, [P(0, N, 0), P(N, N, 0), P(N, N, -6), P(0, N, -6)], AVATAR.tom(p0, 0.6));
      ISO.poli(c, [P(N, 0, 0), P(N, N, 0), P(N, N, -6), P(N, 0, -6)], AVATAR.tom(p0, 0.45));
      // tapetes (andáveis) primeiro
      q.itens.filter(i => (MOVEIS.find(m => m.id === i.m) || {}).andavel).forEach(i => ISO.desenhar(c, OX, OY, i.m, i.x, i.y, i.r));
      // destaque do mouse / seleção (modo decorar)
      if (this.editando) {
        const marca = (x, y, w, d, cor) => { c.strokeStyle = cor; c.lineWidth = 1.2; c.beginPath(); c.moveTo(...P(x, y, 0)); c.lineTo(...P(x + w, y, 0)); c.lineTo(...P(x + w, y + d, 0)); c.lineTo(...P(x, y + d, 0)); c.closePath(); c.stroke(); };
        if (this.selecionado && !this.pegando) { const m = MOVEIS.find(z => z.id === this.selecionado.m), [w, d] = ISO.pegada(m, this.selecionado.r); marca(this.selecionado.x, this.selecionado.y, w, d, "#ffd23f"); }
        if (this.pegando && this.mouse && this.mouse.x >= 0 && this.mouse.y >= 0 && this.mouse.x < N && this.mouse.y < N) {
          const m = MOVEIS.find(z => z.id === this.pegando.m), [w, d] = ISO.pegada(m, this.pegando.r), ok = this.cabe(m, this.mouse.x, this.mouse.y, this.pegando.r, this.pegando.item);
          marca(this.mouse.x, this.mouse.y, w, d, ok ? "#39ff6a" : "#ff2a4d");
        }
      } else if (this.mouse && !this.op.visita && this.mouse.x >= 0 && this.mouse.y >= 0 && this.mouse.x < N && this.mouse.y < N) {
        c.strokeStyle = "rgba(255,255,255,.5)"; c.lineWidth = 1; c.beginPath(); c.moveTo(...P(this.mouse.x, this.mouse.y, 0)); c.lineTo(...P(this.mouse.x + 1, this.mouse.y, 0)); c.lineTo(...P(this.mouse.x + 1, this.mouse.y + 1, 0)); c.lineTo(...P(this.mouse.x, this.mouse.y + 1, 0)); c.closePath(); c.stroke();
      }
      // objetos ordenados pela profundidade
      const obj = [];
      q.itens.forEach(i => {
        const m = MOVEIS.find(z => z.id === i.m); if (!m || m.andavel) return;
        if (this.pegando && this.pegando.item === i) return;
        const pt = m.pet && this.pets.get(i);
        if (pt && !this.editando) { obj.push({ k: pt.px + pt.py + 0.99, f: () => { const [sx, sy] = P(pt.px + 0.5, pt.py + 0.5, 0); ISO.pet(c, sx, sy, m.pet, pt.dir, pt.quadro, performance.now() / 1000); } }); return; }
        const [w, d] = ISO.pegada(m, i.r);
        obj.push({ k: i.x + i.y + w + d - 1.01, f: () => ISO.desenhar(c, OX, OY, m, i.x, i.y, i.r) });
      });
      const av = this.op.avatar ? this.op.avatar() : null;
      if (av) {
        const e = this.eu;
        obj.push({ k: e.px + e.py + 1, f: () => {
          const [sx, sy] = P(e.px + 0.5, e.py + 0.5, 0);
          c.fillStyle = "rgba(0,0,0,.22)"; c.beginPath(); c.ellipse(sx, sy, 9, 4, 0, 0, 7); c.fill();
          const pisc = (this.piscaT % 3200) < 150;
          c.save(); c.setTransform(1, 0, 0, 1, 0, 0);
          c.drawImage(AVATAR.sprite(av, e.dir, e.quadro, pisc), Math.round(sx * 2 - AVATAR.LARGURA / 2), Math.round(sy * 2) - AVATAR.PES - 2);
          c.restore();
        } });
      }
      obj.sort((a, b) => a.k - b.k).forEach(o => o.f());
      // fantasma do móvel sendo colocado
      if (this.editando && this.pegando && this.mouse && this.mouse.x >= 0 && this.mouse.y >= 0 && this.mouse.x < N && this.mouse.y < N)
        ISO.desenhar(c, OX, OY, this.pegando.m, this.mouse.x, this.mouse.y, this.pegando.r, 0.6);
    }
  }
  window.Quarto = Quarto;
  window.QUARTO_OPCOES = { PISOS, PAREDES, PAPEIS, papelCss };
})();
