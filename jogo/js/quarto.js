// ============================================================
//  MOTOR DO QUARTO ISOMÉTRICO (Isometric Room Engine)
//  Organizado em 5 partes, como nos "hotéis" de pixel:
//   1. GRADE 2:1 ......... ladrilhos em losango de 64×32 px na tela (32×16 no
//                          desenho, com resolução dobrada), paredes em corte e
//                          destaque no ladrilho do mouse
//   2. CAMINHO A* ........ clique num ladrilho e o avatar desvia dos móveis,
//                          andando em 8 direções de ladrilho em ladrilho
//   3. MÓVEIS ............ colisão por móvel: andavel (canWalk), sentavel
//                          (canSit), altura (height). Clicou numa cadeira ou
//                          sofá, o avatar vai até lá e senta virado para a frente
//   4. CAMADAS ........... a cada quadro: chão → tapetes → destaque → sombras →
//                          móveis/bichos/avatar por profundidade (x + y) → balões
//   5. AVATAR ............ desenhado por código em avatar.js (sombra oval, pernas
//                          e braços balançando ao andar, pose sentada) e balões
//                          de fala que sobem em cascata
//  Coordenadas da grade: x cresce para baixo-direita, y para baixo-esquerda.
//  Controles: clique/toque no chão, setas/WASD, controle na tela (celular).
//  A porta (parede da esquerda) leva para o mapa dos mundos.
// ============================================================
(function () {
  const N = 8, LW = 304, LH = 236, OX = LW / 2, OY = 86, PAREDE = 74;
  const ESCALA = 2;                          // 32×16 no desenho → 64×32 na tela
  const PORTA = { x: 0, y: 2 };              // ladrilho na frente da porta
  const VELOCIDADE = 0.0042;                 // ladrilhos por milissegundo
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
  const chave = (x, y) => x + "," + y;
  const dentro = (x, y) => x >= 0 && y >= 0 && x < N && y < N;
  const VIZINHOS = [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [1, -1], [-1, 1], [-1, -1]];
  const TECLAS = { ArrowRight: [1, 0], ArrowLeft: [-1, 0], ArrowDown: [0, 1], ArrowUp: [0, -1], d: [1, 0], a: [-1, 0], s: [0, 1], w: [0, -1] };

  class Quarto {
    constructor(canvas, op) {
      this.cv = canvas; this.op = op;
      this.ctx = canvas.getContext("2d");
      canvas.width = LW * ESCALA; canvas.height = LH * ESCALA;   // resolução dobrada: o avatar fica bem definido
      this.ctx.imageSmoothingEnabled = false;
      this.q = JSON.parse(JSON.stringify(op.quarto || { piso: 0, parede: 0, itens: [] }));
      this.q.itens = (this.q.itens || []).filter(i => MOVEIS.some(m => m.id === i.m));
      // estado do avatar: (x, y) = ladrilho atual; (px, py) = posição na tela entre ladrilhos
      this.eu = { x: 3, y: 3, px: 3, py: 3, dir: 0, dir8: 2, quadro: 0, t: 0, sentado: null };
      if (!this.livre(3, 3)) { const l = this.primeiroLivre(); if (l) Object.assign(this.eu, { x: l[0], y: l[1], px: l[0], py: l[1] }); }
      this.caminho = []; this.destino = null; this.teclas = new Set(); this.vivo = true;
      this.editando = false; this.pegando = null; this.selecionado = null; this.mouse = null;
      this.piscaT = 0; this.pets = new Map(); this.baloes = [];
      this._tecla = e => this.tecla(e); this._solta = e => this.teclas.delete(e.key);
      addEventListener("keydown", this._tecla); addEventListener("keyup", this._solta);
      canvas.addEventListener("pointerdown", e => this.toque(e));
      canvas.addEventListener("pointermove", e => { this.mouse = this.ladrilho(e); this.cursor(); });
      canvas.addEventListener("pointerleave", () => { this.mouse = null; });
      this.ultimo = performance.now();
      requestAnimationFrame(t => this.loop(t));
    }
    parar() { this.vivo = false; removeEventListener("keydown", this._tecla); removeEventListener("keyup", this._solta); }

    // =========================================================
    //  1. GRADE E COLISÃO
    // =========================================================
    // Mapa de colisão: para cada ladrilho ocupado, "b" (bloqueado) ou um assento { m, item }
    mapa(ignorar) {
      const mp = new Map();
      this.q.itens.forEach(it => {
        if (it === ignorar) return;
        const m = ISO.achar(it.m); if (!m || m.andavel || m.pet) return;
        const [w, d] = ISO.pegada(m, it.r);
        for (let i = 0; i < w; i++) for (let j = 0; j < d; j++) mp.set(chave(it.x + i, it.y + j), m.sentavel ? { m, item: it } : "b");
      });
      return mp;
    }
    ocupado(ignorar) { return new Set(this.mapa(ignorar).keys()); }      // ladrilhos onde não dá para passar
    livre(x, y) { return dentro(x, y) && !this.mapa().has(chave(x, y)); }
    assentoEm(x, y) { const v = this.mapa().get(chave(x, y)); return v && v !== "b" ? v : null; }
    primeiroLivre() { for (let s = 0; s < 2 * N; s++) for (let x = 0; x <= s; x++) { const y = s - x; if (this.livre(x, y)) return [x, y]; } return null; }
    cabe(m, X, Y, r, ignorar) {
      const [w, d] = ISO.pegada(m, r); const oc = this.ocupado(ignorar);
      for (let i = 0; i < w; i++) for (let j = 0; j < d; j++) {
        const x = X + i, y = Y + j;
        if (!dentro(x, y)) return false;
        if (!m.andavel && (oc.has(chave(x, y)) || (this.eu.x === x && this.eu.y === y) || (x === PORTA.x && y === PORTA.y))) return false;
        if (m.andavel && this.q.itens.some(it => it !== ignorar && it.m === m.id && it.x === X && it.y === Y)) return false;
        if (m.pet && this.q.itens.some(it => it !== ignorar && (ISO.achar(it.m) || {}).pet && it.x === X && it.y === Y)) return false;
      }
      return true;
    }
    itemEm(x, y) {
      for (let k = this.q.itens.length - 1; k >= 0; k--) { const it = this.q.itens[k], m = ISO.achar(it.m), [w, d] = ISO.pegada(m, it.r); if (x >= it.x && x < it.x + w && y >= it.y && y < it.y + d) return it; }
      return null;
    }

    // ---------- tela → ladrilho ----------
    ladrilho(e) {
      const r = this.cv.getBoundingClientRect();
      const lx = (e.clientX - r.left) * LW / r.width - OX, ly = (e.clientY - r.top) * LH / r.height - OY;
      const x = Math.floor((ly / (ISO.TH / 2) + lx / (ISO.TW / 2)) / 2), y = Math.floor((ly / (ISO.TH / 2) - lx / (ISO.TW / 2)) / 2);
      const [ax, ay] = P(0, 2, 0), [bx, by] = P(0, 3, 0);
      const naPorta = lx + OX >= ax - 2 && lx + OX <= bx + 2 && ly + OY <= by && ly + OY >= ay - 44 && x < 0;
      // clicar no encosto de uma cadeira (que fica acima do chão) também conta como clicar nela
      let assento = null;
      if (!naPorta) for (const it of this.q.itens) {
        const m = ISO.achar(it.m); if (!m || !m.sentavel) continue;
        const [w, d] = ISO.pegada(m, it.r), [cx, cy] = P(it.x + w / 2, it.y + d / 2, 0), alto = ISO.altura(m);
        if (lx + OX > cx - (w + d) * 8 && lx + OX < cx + (w + d) * 8 && ly + OY < cy + 4 && ly + OY > cy - alto - 6) {
          // escolhe o ladrilho do assento mais perto do clique
          let melhor = null, dist = 1e9;
          for (let i = 0; i < w; i++) for (let j = 0; j < d; j++) { const [sx, sy] = P(it.x + i + 0.5, it.y + j + 0.5, 0), dd = Math.abs(sx - lx - OX); if (dd < dist) { dist = dd; melhor = [it.x + i, it.y + j]; } }
          assento = melhor;
        }
      }
      return { x, y, porta: naPorta, assento };
    }
    cursor() {
      const t = this.mouse, ok = t && !this.op.visita && (this.editando || t.porta || t.assento || (dentro(t.x, t.y) && this.livre(t.x, t.y)));
      this.cv.style.cursor = ok ? "pointer" : "default";
    }

    // =========================================================
    //  2. CAMINHO A* (8 direções, sem cortar quina de móvel)
    // =========================================================
    aEstrela(ini, fim) {
      const mp = this.mapa();
      const passa = (x, y) => dentro(x, y) && !mp.has(chave(x, y));
      const pode = (x, y) => passa(x, y) || (x === fim[0] && y === fim[1] && dentro(x, y) && mp.get(chave(x, y)) !== "b");   // assento só como destino
      const h = (x, y) => { const dx = Math.abs(x - fim[0]), dy = Math.abs(y - fim[1]); return Math.max(dx, dy) + 0.4142 * Math.min(dx, dy); };
      const aberto = [{ x: ini[0], y: ini[1], g: 0, f: h(...ini) }], g = new Map([[chave(...ini), 0]]), veio = new Map(), fechado = new Set();
      while (aberto.length) {
        let k = 0; for (let i = 1; i < aberto.length; i++) if (aberto[i].f < aberto[k].f) k = i;
        const n = aberto.splice(k, 1)[0], kn = chave(n.x, n.y);
        if (n.x === fim[0] && n.y === fim[1]) {
          const cam = []; let c = kn;
          while (veio.has(c)) { cam.unshift(c.split(",").map(Number)); c = veio.get(c); }
          return cam;
        }
        if (fechado.has(kn)) continue; fechado.add(kn);
        for (const [dx, dy] of VIZINHOS) {
          const nx = n.x + dx, ny = n.y + dy, kv = chave(nx, ny);
          if (!pode(nx, ny) || fechado.has(kv)) continue;
          if (dx && dy && (!passa(n.x + dx, n.y) || !passa(n.x, n.y + dy))) continue;   // não corta a quina
          const ng = n.g + (dx && dy ? 1.4142 : 1);
          if (ng < (g.has(kv) ? g.get(kv) : 1e9)) { g.set(kv, ng); veio.set(kv, kn); aberto.push({ x: nx, y: ny, g: ng, f: ng + h(nx, ny) }); }
        }
      }
      return null;   // sem caminho
    }
    irPara(x, y, sairDepois) {
      const e = this.eu;
      // se está no meio de um passo, termina esse passo e calcula a rota a partir do próximo ladrilho
      const meioDoPasso = this.caminho.length && (e.px !== e.x || e.py !== e.y), proximo = meioDoPasso ? this.caminho[0] : null;
      if (!meioDoPasso && e.x === x && e.y === y) { if (sairDepois) this.sair(); else if (this.assentoEm(x, y)) this.sentar(); return; }
      const cam = this.aEstrela(proximo || [e.x, e.y], [x, y]);
      if (!cam) { if (this.op.aoErro && !this.op.visita) this.op.aoErro("Não dá para chegar aí."); return; }
      this.levantar();
      if (proximo) cam.unshift(proximo);
      this.caminho = cam; this.destino = [x, y]; this.sairNoFim = sairDepois;
    }

    // ---------- entrada ----------
    toque(e) {
      const t = this.ladrilho(e);
      if (this.editando) return this.toqueEditar(t);
      if (this.op.visita) return;
      if (t.porta) { this.irPara(PORTA.x, PORTA.y, true); return; }
      if (t.assento) { this.irPara(t.assento[0], t.assento[1], false); return; }
      if (!dentro(t.x, t.y)) return;
      this.irPara(t.x, t.y, false);
    }
    tecla(e) {
      if (this.op.visita || this.editando) return;
      const k = e.key; if (!TECLAS[k]) return;
      if (document.activeElement && /INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName)) return;
      e.preventDefault(); this.teclas.add(k); if (!this.caminho.length) this.passo(...TECLAS[k]);
    }
    passo(dx, dy) {
      const e = this.eu, nx = e.x + dx, ny = e.y + dy;
      this.levantar();
      e.dir8 = AVATAR.direcao8(dx, dy); e.dir = AVATAR.vista(e.dir8, e.dir);
      if (e.x === PORTA.x && e.y === PORTA.y && dx === -1) { this.sair(); return; }
      if (this.livre(nx, ny) || this.assentoEm(nx, ny)) { this.caminho = [[nx, ny]]; this.destino = [nx, ny]; }
    }
    dpad(dx, dy) { if (!this.caminho.length && !this.editando) this.passo(dx, dy); }
    sair() { if (this.op.aoSair) { this.parar(); this.op.aoSair(); } }

    // =========================================================
    //  3. MÓVEIS: SENTAR E LEVANTAR
    // =========================================================
    sentar() {
      const e = this.eu, a = this.assentoEm(e.x, e.y); if (!a) return;
      const f = ISO.frenteSentado(a.m, a.item.r);
      if (f) e.dir8 = AVATAR.direcao8(f[0], f[1]);
      e.dir = AVATAR.vista(e.dir8, e.dir);
      // o desenho sentado já fica na altura de um assento de ~9.5; o resto é compensado aqui
      e.sentado = { item: a.item, x: e.x, y: e.y, dz: Math.round(((a.m.assento || 9.5) - 9.5) * ESCALA) };
      e.quadro = 0;
    }
    levantar() { this.eu.sentado = null; }
    // se o móvel em que está sentado foi movido ou guardado, levanta
    conferirAssento() {
      const s = this.eu.sentado; if (!s) return;
      const a = this.assentoEm(s.x, s.y);
      if (!a || a.item !== s.item) this.levantar();
    }

    // ---------- decorar ----------
    toqueEditar(t) {
      if (!dentro(t.x, t.y)) return;
      if (this.pegando) {
        const m = ISO.achar(this.pegando.m);
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
      const m = ISO.achar(it.m), nr = (it.r + 1) % 2;
      if (this.cabe(m, it.x, it.y, nr, it)) { it.r = nr; if (this.eu.sentado && this.eu.sentado.item === it) this.sentar(); this.op.aoMudar && this.op.aoMudar(); } else this.op.aoErro && this.op.aoErro("Sem espaço para girar.");
    }
    guardar() { if (!this.selecionado) return; this.q.itens = this.q.itens.filter(i => i !== this.selecionado); this.selecionado = null; this.op.aoMudar && this.op.aoMudar(); }
    usados(id) { return this.q.itens.filter(i => i.m === id).length; }

    // =========================================================
    //  5. BALÕES DE FALA (sobem em cascata)
    // =========================================================
    falar(texto) {
      texto = String(texto || "").replace(/\s+/g, " ").trim().slice(0, 70); if (!texto) return;
      const e = this.eu, [sx, sy] = P(e.px + 0.5, e.py + 0.5, 0);
      const topo = sy * ESCALA - AVATAR.PES + (e.sentado ? AVATAR.DESCE - e.sentado.dz : 0) + 4;   // logo acima da cabeça
      const novo = { nome: this.op.nome || "", texto, x: sx * ESCALA, y: topo - 16, t: 0, a: 0 };
      this.medirBalao(novo);
      // os balões antigos sobem para dar lugar ao novo
      let y = novo.y; for (let k = this.baloes.length - 1; k >= 0; k--) { y -= this.baloes[k].h + 6; this.baloes[k].alvo = Math.min(this.baloes[k].alvo ?? this.baloes[k].y, y); }
      this.baloes.push(novo);
      if (this.baloes.length > 6) this.baloes.shift();
    }
    medirBalao(b) {
      const c = this.ctx; c.save(); c.setTransform(1, 0, 0, 1, 0, 0);
      c.font = "bold 18px VT323, monospace"; const wn = b.nome ? c.measureText(b.nome + ": ").width : 0;
      c.font = "18px VT323, monospace"; b.wn = wn; b.w = Math.ceil(wn + c.measureText(b.texto).width) + 18; b.h = 24;
      c.restore();
    }
    atualizarBaloes(dt) {
      this.baloes.forEach(b => {
        b.t += dt; b.a = Math.min(1, b.a + dt / 150);
        if (b.alvo != null && b.alvo < b.y) b.y = Math.max(b.alvo, b.y - dt * 0.35);   // sobe para a vaga nova
        b.y -= dt * 0.004;                                                           // e continua subindo devagar
        if (b.alvo != null) b.alvo -= dt * 0.004;
      });
      this.baloes = this.baloes.filter(b => b.t < 12000 && b.y > -30);
    }
    desenharBaloes() {
      const c = this.ctx, Wt = LW * ESCALA; c.save(); c.setTransform(1, 0, 0, 1, 0, 0);
      this.baloes.forEach((b, k) => {
        const fim = b.t > 10500 ? Math.max(0, 1 - (b.t - 10500) / 1500) : 1;
        c.globalAlpha = b.a * fim;
        const x = Math.round(Math.max(6, Math.min(Wt - b.w - 6, b.x - b.w / 2))), y = Math.round(b.y);
        c.fillStyle = "#0c0a18"; c.fillRect(x - 2, y - 2, b.w + 4, b.h + 4);          // borda pixelada
        c.fillStyle = "#ffffff"; c.fillRect(x, y, b.w, b.h);
        c.fillStyle = "#d8d8e8"; c.fillRect(x, y + b.h - 3, b.w, 3);
        if (k === this.baloes.length - 1 && b.alvo == null) {                          // bico só no balão mais novo
          const bx = Math.round(Math.max(x + 8, Math.min(x + b.w - 12, b.x - 4)));
          c.fillStyle = "#0c0a18"; c.fillRect(bx - 2, y + b.h + 2, 12, 2); c.fillRect(bx, y + b.h + 4, 8, 2); c.fillRect(bx + 2, y + b.h + 6, 4, 2);
          c.fillStyle = "#ffffff"; c.fillRect(bx, y + b.h, 8, 2); c.fillRect(bx + 2, y + b.h + 2, 4, 2);
        }
        c.textBaseline = "middle";
        if (b.nome) { c.font = "bold 18px VT323, monospace"; c.fillStyle = "#3a2aa0"; c.fillText(b.nome + ":", x + 9, y + b.h / 2); }
        c.font = "18px VT323, monospace"; c.fillStyle = "#14102a"; c.fillText(b.texto, x + 9 + b.wn, y + b.h / 2);
      });
      c.restore();
    }

    // =========================================================
    //  LAÇO DE ANIMAÇÃO
    // =========================================================
    loop(t) {
      if (!this.vivo) return;
      const dt = Math.min(50, t - this.ultimo); this.ultimo = t;
      this.andar(dt);
      this.conferirAssento();
      this.piscaT += dt;
      this.andarPets(dt);
      this.atualizarBaloes(dt);
      this.desenhar();
      requestAnimationFrame(tt => this.loop(tt));
    }
    // anda em linha reta (interpolação) do ladrilho atual até o próximo do caminho
    andar(dt) {
      const e = this.eu;
      if (!this.caminho.length) { if (!e.sentado) e.quadro = 0; e.t = 0; return; }
      let [tx, ty] = this.caminho[0];
      // um móvel apareceu no caminho? recalcula a rota
      if (!this.livre(tx, ty) && !(this.destino && tx === this.destino[0] && ty === this.destino[1] && this.assentoEm(tx, ty))) {
        const d = this.destino; this.caminho = [];
        if (d && (e.px !== e.x || e.py !== e.y)) { e.px = e.x; e.py = e.y; }
        if (d) { const cam = this.aEstrela([e.x, e.y], d); if (cam && cam.length) this.caminho = cam; }
        return;
      }
      const dx = tx - e.px, dy = ty - e.py, dist = Math.hypot(dx, dy), v = VELOCIDADE * dt;
      e.dir8 = AVATAR.direcao8(tx - e.x, ty - e.y); e.dir = AVATAR.vista(e.dir8, e.dir);
      if (dist <= v) {
        e.px = e.x = tx; e.py = e.y = ty; this.caminho.shift();
        if (!this.caminho.length) {
          if (this.sairNoFim && e.x === PORTA.x && e.y === PORTA.y) { this.sairNoFim = false; this.sair(); return; }
          if (this.assentoEm(e.x, e.y)) { this.sentar(); return; }
          const k = [...this.teclas].pop();
          if (k && TECLAS[k]) this.passo(...TECLAS[k]);
        }
      } else { e.px += dx / dist * v; e.py += dy / dist * v; }
      e.t += dt; e.quadro = [1, 0, 2, 0][Math.floor(e.t / 140) % 4];
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

    // =========================================================
    //  CENÁRIO (paredes em corte, papel de parede, janela, piso)
    // =========================================================
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

    desenharCenario() {
      const c = this.ctx, q = this.q;
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
    }

    // destaque no ladrilho do mouse: branco = dá para andar, amarelo = dá para sentar
    desenharDestaque() {
      const c = this.ctx, losango = (x, y, w, d) => { c.beginPath(); c.moveTo(...P(x, y, 0)); c.lineTo(...P(x + w, y, 0)); c.lineTo(...P(x + w, y + d, 0)); c.lineTo(...P(x, y + d, 0)); c.closePath(); };
      const marca = (x, y, w, d, cor, fundo) => { losango(x, y, w, d); if (fundo) { c.fillStyle = fundo; c.fill(); } c.strokeStyle = cor; c.lineWidth = 1.2; c.stroke(); };
      const mo = this.mouse;
      if (this.editando) {
        if (this.selecionado && !this.pegando) { const m = ISO.achar(this.selecionado.m), [w, d] = ISO.pegada(m, this.selecionado.r); marca(this.selecionado.x, this.selecionado.y, w, d, "#ffd23f", "rgba(255,210,63,.15)"); }
        if (this.pegando && mo && dentro(mo.x, mo.y)) {
          const m = ISO.achar(this.pegando.m), [w, d] = ISO.pegada(m, this.pegando.r), ok = this.cabe(m, mo.x, mo.y, this.pegando.r, this.pegando.item);
          marca(mo.x, mo.y, w, d, ok ? "#39ff6a" : "#ff2a4d", ok ? "rgba(57,255,106,.15)" : "rgba(255,42,77,.15)");
        }
        return;
      }
      if (!mo || this.op.visita) return;
      if (mo.porta) { marca(PORTA.x, PORTA.y, 1, 1, "#ffd23f", "rgba(255,210,63,.18)"); return; }
      if (mo.assento) { marca(mo.assento[0], mo.assento[1], 1, 1, "#ffd23f", "rgba(255,210,63,.22)"); return; }
      if (dentro(mo.x, mo.y) && this.livre(mo.x, mo.y)) marca(mo.x, mo.y, 1, 1, "rgba(255,255,255,.75)", "rgba(255,255,255,.16)");
    }

    // =========================================================
    //  4. RENDERIZAÇÃO EM CAMADAS (Painter's Algorithm)
    // =========================================================
    desenhar() {
      const c = this.ctx, q = this.q, tempo = performance.now() / 1000;
      c.setTransform(1, 0, 0, 1, 0, 0); c.clearRect(0, 0, LW * ESCALA, LH * ESCALA); c.setTransform(ESCALA, 0, 0, ESCALA, 0, 0);

      // camada 1: chão e paredes
      this.desenharCenario();

      // camada 2: tapetes (dá para pisar em cima)
      q.itens.filter(i => (ISO.achar(i.m) || {}).andavel).forEach(i => ISO.desenhar(c, OX, OY, i.m, i.x, i.y, i.r));

      // camada 3: destaque do ladrilho
      this.desenharDestaque();

      // monta a fila de objetos (móveis, bichos e avatar)
      const fila = [], av = this.op.avatar ? this.op.avatar() : null, e = this.eu;
      q.itens.forEach(i => {
        const m = ISO.achar(i.m); if (!m || m.andavel) return;
        if (this.pegando && this.pegando.item === i) return;
        const pt = m.pet && this.pets.get(i);
        if (pt && !this.editando) {
          fila.push({ prof: Math.max(pt.x + pt.y, pt.alvo ? pt.alvo[0] + pt.alvo[1] : 0), camada: 1,
            sombra: () => { const [sx, sy] = P(pt.px + 0.5, pt.py + 0.5, 0); c.fillStyle = "rgba(0,0,0,.22)"; c.beginPath(); c.ellipse(Math.round(sx), Math.round(sy), 8, 3, 0, 0, 7); c.fill(); },
            desenha: () => { const [sx, sy] = P(pt.px + 0.5, pt.py + 0.5, 0); ISO.pet(c, sx, sy, m.pet, pt.dir, pt.quadro, tempo, { semSombra: true }); } });
          return;
        }
        const [w, d] = ISO.pegada(m, i.r);
        fila.push({ prof: (i.x + w - 1) + (i.y + d - 1), camada: 0,
          sombra: () => ISO.sombra(c, OX, OY, m, i.x, i.y, i.r),
          desenha: () => ISO.desenhar(c, OX, OY, m, i.x, i.y, i.r, null, { semSombra: true }) });
      });
      if (av) {
        // andando: usa o ladrilho mais "na frente" entre o atual e o próximo; sentado: logo depois do móvel
        let prof = e.x + e.y;
        if (this.caminho.length) prof = Math.max(prof, this.caminho[0][0] + this.caminho[0][1]);
        if (e.sentado) { const m = ISO.achar(e.sentado.item.m), [w, d] = ISO.pegada(m, e.sentado.item.r); prof = (e.sentado.item.x + w - 1) + (e.sentado.item.y + d - 1); }
        fila.push({ prof, camada: 2,
          sombra: () => { const [sx, sy] = P(e.px + 0.5, e.py + 0.5, 0); c.fillStyle = "rgba(0,0,0,.24)"; c.beginPath(); c.ellipse(sx, sy, 9, 4, 0, 0, 7); c.fill(); },
          desenha: () => {
            const [sx, sy] = P(e.px + 0.5, e.py + 0.5, 0), pisc = (this.piscaT % 3200) < 150;
            const spr = AVATAR.sprite(av, e.dir, e.quadro, pisc, e.sentado ? "sentado" : "");
            c.save(); c.setTransform(1, 0, 0, 1, 0, 0);
            c.drawImage(spr, Math.round(sx * ESCALA - AVATAR.LARGURA / 2), Math.round(sy * ESCALA) - AVATAR.PES - 2 - (e.sentado ? e.sentado.dz : 0));
            c.restore();
          } });
      }

      // camada 4: todas as sombras (ficam sempre embaixo de qualquer objeto)
      fila.forEach(o => o.sombra());

      // camada 5: objetos do fundo para a frente (x + y menor primeiro)
      fila.sort((a, b) => a.prof - b.prof || a.camada - b.camada).forEach(o => o.desenha());

      // fantasma do móvel sendo colocado (modo decorar)
      const mo = this.mouse;
      if (this.editando && this.pegando && mo && dentro(mo.x, mo.y)) ISO.desenhar(c, OX, OY, this.pegando.m, mo.x, mo.y, this.pegando.r, 0.6);

      // camada 6: balões de fala, sempre por cima de tudo
      this.desenharBaloes();
    }
  }
  window.Quarto = Quarto;
  window.QUARTO_OPCOES = { PISOS, PAREDES, PAPEIS, papelCss, N, PORTA };
})();
