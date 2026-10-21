// ============================================================
//  MÓVEIS ISOMÉTRICOS (desenhados por código)
//  Cada móvel é montado com "caixas" isométricas.
//  Os preços oficiais ficam no banco (tabela moveis): mantenha iguais.
//  Para criar um móvel novo: copie um bloco, mude id/nome/preço,
//  ajuste as partes e acrescente o mesmo id no supabase/schema.sql.
// ============================================================
(function () {
  const TW = 32, TH = 16;
  const tom = (hex, f) => window.AVATAR ? AVATAR.tom(hex, f) : hex;
  const c3 = base => [tom(base, 1.18), base, tom(base, 0.72)];   // [topo, frente-esquerda, frente-direita]

  // ponto da tela para a coordenada (x, y) do piso na altura z
  const ponto = (ox, oy, x, y, z) => [ox + (x - y) * TW / 2, oy + (x + y) * TH / 2 - (z || 0)];
  function poli(ctx, pts, cor) { ctx.beginPath(); pts.forEach(([a, b], i) => i ? ctx.lineTo(a, b) : ctx.moveTo(a, b)); ctx.closePath(); ctx.fillStyle = cor; ctx.fill(); }
  function caixa(ctx, ox, oy, x, y, w, d, z, h, cores) {
    const P = (a, b, zz) => ponto(ox, oy, a, b, zz);
    const [ct, cl, cr] = cores;
    poli(ctx, [P(x, y + d, z + h), P(x + w, y + d, z + h), P(x + w, y + d, z), P(x, y + d, z)], cl);
    poli(ctx, [P(x + w, y, z + h), P(x + w, y + d, z + h), P(x + w, y + d, z), P(x + w, y, z)], cr);
    poli(ctx, [P(x, y, z + h), P(x + w, y, z + h), P(x + w, y + d, z + h), P(x, y + d, z + h)], ct);
    ctx.strokeStyle = "rgba(20,12,28,.55)"; ctx.lineWidth = 0.8;
    ctx.beginPath(); [[P(x, y, z + h), P(x + w, y, z + h), P(x + w, y + d, z + h), P(x, y + d, z + h)], [P(x, y + d, z), P(x + w, y + d, z), P(x + w, y, z)]].forEach(l => { l.forEach(([a, b], i) => i ? ctx.lineTo(a, b) : ctx.moveTo(a, b)); });
    ctx.moveTo(...P(x, y + d, z + h)); ctx.lineTo(...P(x, y + d, z)); ctx.moveTo(...P(x + w, y + d, z + h)); ctx.lineTo(...P(x + w, y + d, z)); ctx.moveTo(...P(x + w, y, z + h)); ctx.lineTo(...P(x + w, y, z));
    ctx.stroke();
  }
  const bola = (ctx, x, y, r, cor) => { ctx.fillStyle = cor; ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.fill(); };

  const MAD = "#b0743e", MADE = "#7a4a26", BRANCO = "#f2f2f6", PRETO = "#2a2a3a";
  const TELA = ["#14142a", "#3fd0ff", "#10102a"];

  // partes: [x, y, larg, prof, z, altura, cores]  (coordenadas dentro do espaço do móvel, rotação 0)
  const MOVEIS = [
    { id: "planta", nome: "Planta", preco: 30, w: 1, d: 1,
      partes: () => [[0.3, 0.3, 0.4, 0.4, 0, 7, c3("#c0602e")], [0.32, 0.32, 0.36, 0.36, 7, 1, c3("#4a2e1c")]],
      extra(ctx, cx, cy) { [[0, -16, 6, "#2f8a3a"], [-5, -12, 5, "#3fa64a"], [5, -12, 5, "#2f8a3a"], [-2, -20, 5, "#58c060"], [3, -19, 4, "#45b04e"], [0, -10, 4, "#3fa64a"]].forEach(([dx, dy, r, c]) => bola(ctx, cx + dx, cy + dy, r, c)); } },
    { id: "pufe", nome: "Pufe", preco: 35, w: 1, d: 1,
      partes: () => [[0.2, 0.2, 0.6, 0.6, 0, 7, c3("#ff5fa8")], [0.24, 0.24, 0.52, 0.52, 7, 1.5, c3("#ff8ac0")]] },
    { id: "cadeira", nome: "Cadeira", preco: 40, w: 1, d: 1,
      partes: () => [[0.24, 0.24, 0.08, 0.08, 0, 7, c3(MADE)], [0.68, 0.24, 0.08, 0.08, 0, 7, c3(MADE)], [0.24, 0.68, 0.08, 0.08, 0, 7, c3(MADE)], [0.68, 0.68, 0.08, 0.08, 0, 7, c3(MADE)],
        [0.22, 0.22, 0.56, 0.1, 9, 11, c3(MAD)], [0.2, 0.2, 0.6, 0.6, 7, 2, c3(MAD)]] },
    { id: "tapete", nome: "Tapete", preco: 40, w: 2, d: 2, andavel: true,
      partes: () => [[0.1, 0.1, 1.8, 1.8, 0, 0.8, c3("#3a5ad0")], [0.3, 0.3, 1.4, 1.4, 0.8, 0.2, c3("#ffd23f")], [0.5, 0.5, 1.0, 1.0, 1, 0.2, c3("#e3263a")]] },
    { id: "abajur", nome: "Abajur", preco: 50, w: 1, d: 1,
      partes: () => [[0.35, 0.35, 0.3, 0.3, 0, 2, c3(PRETO)], [0.47, 0.47, 0.06, 0.06, 2, 15, c3("#9aa0aa")], [0.3, 0.3, 0.4, 0.4, 16, 9, c3("#ffe070")]],
      extra(ctx, cx, cy) { const g = ctx.createRadialGradient(cx, cy - 20, 1, cx, cy - 20, 22); g.addColorStop(0, "rgba(255,230,120,.45)"); g.addColorStop(1, "rgba(255,230,120,0)"); ctx.fillStyle = g; ctx.fillRect(cx - 24, cy - 44, 48, 48); } },
    { id: "mesa", nome: "Mesa", preco: 60, w: 1, d: 1,
      partes: () => [[0.42, 0.42, 0.16, 0.16, 0, 12, c3(MADE)], [0.05, 0.05, 0.9, 0.9, 12, 2.5, c3(MAD)]] },
    { id: "estante", nome: "Estante de livros", preco: 90, w: 1, d: 1,
      partes() {
        const p = [[0.05, 0.05, 0.9, 0.06, 0, 33, c3(MADE)], [0.05, 0.05, 0.06, 0.4, 0, 33, c3(MADE)]];
        const livros = ["#e3263a", "#2f6bff", "#38c870", "#ffd23f", "#9b59ff", "#ff7a1a"];
        [0, 11, 22].forEach((z, k) => { p.push([0.05, 0.05, 0.9, 0.4, z, 1.5, c3(MAD)]); for (let i = 0; i < 4; i++) p.push([0.14 + i * 0.19, 0.12, 0.13, 0.26, z + 1.5, 6 + ((i + k) % 3), c3(livros[(i + k * 2) % livros.length])]); });
        p.push([0.89, 0.05, 0.06, 0.4, 0, 33, c3(MAD)], [0.05, 0.05, 0.9, 0.4, 33, 1.5, c3(MAD)]);
        return p;
      } },
    { id: "sofa", nome: "Sofá", preco: 120, w: 2, d: 1,
      partes: () => { const c = c3("#e3263a"), l = c3("#ff5a6a"); return [[0.05, 0.1, 1.9, 0.8, 0, 6, c], [0.05, 0.1, 1.9, 0.2, 6, 11, c], [0.05, 0.1, 0.2, 0.8, 6, 5, c], [0.25, 0.3, 0.74, 0.58, 6, 3, l], [1.01, 0.3, 0.74, 0.58, 6, 3, l], [1.75, 0.1, 0.2, 0.8, 6, 5, c]]; } },
    { id: "cama", nome: "Cama", preco: 150, w: 1, d: 2,
      partes: () => [[0.05, 0.05, 0.9, 1.9, 0, 5, c3(MAD)], [0.05, 0.05, 0.9, 0.12, 0, 17, c3(MADE)], [0.1, 0.17, 0.8, 1.75, 5, 3, c3(BRANCO)], [0.2, 0.22, 0.6, 0.35, 8, 2.5, c3("#ffffff")], [0.08, 0.72, 0.84, 1.2, 5, 4.5, c3("#2f6bff")]] },
    { id: "tv", nome: "TV", preco: 160, w: 1, d: 1,
      partes: () => [[0.1, 0.2, 0.8, 0.6, 0, 8, c3("#4a3a34")], [0.46, 0.42, 0.08, 0.08, 8, 3, c3(PRETO)], [0.08, 0.4, 0.84, 0.1, 11, 17, TELA]],
      extra(ctx, cx, cy) { ctx.fillStyle = "rgba(255,255,255,.7)"; ctx.fillRect(cx - 10, cy - 24, 3, 1); ctx.fillRect(cx - 9, cy - 22, 2, 1); } },
    { id: "mesa_pc", nome: "PC gamer", preco: 200, w: 1, d: 1,
      partes: () => [[0.62, 0.55, 0.28, 0.35, 0, 11, ["#3a3a4a", "#2a2a3a", "#ff2a8a"]], [0.06, 0.06, 0.08, 0.88, 0, 12, c3("#c8c8d8")], [0.06, 0.06, 0.88, 0.88, 12, 2, c3("#e8e8f0")],
        [0.25, 0.55, 0.45, 0.15, 14, 1, c3(PRETO)], [0.46, 0.3, 0.08, 0.08, 14, 3, c3(PRETO)], [0.18, 0.25, 0.64, 0.08, 17, 12, TELA]] },
    { id: "aquario", nome: "Aquário", preco: 220, w: 1, d: 1,
      partes: () => [[0.08, 0.25, 0.84, 0.5, 0, 10, c3(PRETO)], [0.1, 0.27, 0.8, 0.46, 10, 15, ["rgba(160,232,255,.85)", "rgba(63,184,232,.85)", "rgba(42,138,192,.85)"]], [0.08, 0.25, 0.84, 0.5, 25, 1.5, c3(PRETO)]],
      extra(ctx, cx, cy) { [[-6, -17, "#ff7a1a"], [3, -21, "#ffd23f"], [-1, -14, "#ff5fa8"]].forEach(([dx, dy, c]) => { ctx.fillStyle = c; ctx.fillRect(cx + dx, cy + dy, 3, 2); ctx.fillRect(cx + dx - 1, cy + dy, 1, 2); }); ctx.fillStyle = "#38c870"; ctx.fillRect(cx + 6, cy - 16, 1, 6); ctx.fillRect(cx - 9, cy - 15, 1, 5); } },
    { id: "arcade", nome: "Fliperama", preco: 300, w: 1, d: 1,
      partes: () => [[0.15, 0.2, 0.7, 0.5, 0, 34, c3("#7a3cff")], [0.15, 0.55, 0.7, 0.25, 12, 3, c3(PRETO)], [0.18, 0.7, 0.64, 0.04, 17, 11, TELA], [0.15, 0.2, 0.7, 0.5, 34, 4, c3("#ffd23f")]],
      extra(ctx, cx, cy) { bola(ctx, cx - 4, cy - 15, 1.2, "#ff2a4d"); bola(ctx, cx + 1, cy - 14, 1.2, "#38c870"); } },
    { id: "trofeu", nome: "Troféu de ouro", preco: 400, w: 1, d: 1,
      partes: () => [[0.2, 0.2, 0.6, 0.6, 0, 11, c3(BRANCO)], [0.34, 0.34, 0.32, 0.32, 11, 3, c3("#c9a23a")], [0.46, 0.46, 0.08, 0.08, 14, 4, c3("#ffd23f")], [0.32, 0.32, 0.36, 0.36, 18, 9, c3("#ffd23f")]],
      extra(ctx, cx, cy) { ctx.fillStyle = "rgba(255,255,255,.8)"; ctx.fillRect(cx - 4, cy - 27, 1, 4); } }
  ];

  // tamanho com rotação
  const pegada = (m, r) => (r % 2 ? [m.d, m.w] : [m.w, m.d]);

  // Desenha o móvel m na posição (X, Y) do piso, com rotação r (0 ou 1)
  function desenhar(ctx, ox, oy, mov, X, Y, r, alpha) {
    const m = typeof mov === "string" ? MOVEIS.find(x => x.id === mov) : mov; if (!m) return;
    ctx.save(); if (alpha != null) ctx.globalAlpha = alpha;
    let partes = m.partes();
    if (r % 2) partes = partes.map(([x, y, w, d, z, h, c]) => [y, x, d, w, z, h, [c[0], c[2], c[1]]]);
    partes.forEach(([x, y, w, d, z, h, c]) => caixa(ctx, ox, oy, X + x, Y + y, w, d, z, h, c));
    const [pw, pd] = pegada(m, r);
    if (m.extra) { const [cx, cy] = ponto(ox, oy, X + pw / 2, Y + pd / 2, 0); m.extra(ctx, cx, cy); }
    ctx.restore();
  }

  // Miniatura do móvel num <canvas> (para a loja e o inventário)
  function miniatura(canvas, id, escala) {
    const m = MOVEIS.find(x => x.id === id); const e = escala || 2;
    const lw = 72, lh = 64;
    canvas.width = lw * e; canvas.height = lh * e;
    const ctx = canvas.getContext("2d"); ctx.imageSmoothingEnabled = false;
    const low = document.createElement("canvas"); low.width = lw; low.height = lh;
    const l = low.getContext("2d");
    const [pw, pd] = pegada(m, 0);
    const ox = lw / 2 - (pw - pd) * TW / 4, oy = lh - 8 - (pw + pd) * TH / 2;
    desenhar(l, ox, oy, m, 0, 0, 0);
    ctx.drawImage(low, 0, 0, lw * e, lh * e);
  }

  window.MOVEIS = MOVEIS;
  window.ISO = { TW, TH, ponto, caixa, poli, desenhar, miniatura, pegada };
})();
