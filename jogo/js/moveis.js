// ============================================================
//  MÓVEIS ISOMÉTRICOS (desenhados por código)
//  Cada móvel é montado com "caixas" isométricas.
//  Os preços oficiais ficam no banco (tabela moveis): mantenha iguais.
//  Para criar um móvel novo: copie um bloco, mude id/nome/preço,
//  ajuste as partes e acrescente o mesmo id no supabase/schema.sql.
//
//  partes: [x, y, larg, prof, z, altura, cores, textura?]
//    cores   = [topo, frente-esquerda, frente-direita]  (use c3("#cor"))
//    textura = "veio" (madeira), "tecido" (pontinhos) ou "listra"
//  extra(ctx, cx, cy, r, t): detalhes desenhados por cima (cx, cy = centro
//    do móvel no chão; r = rotação; t = tempo em segundos, para animar)
//  pet: "gato"/"cachorro" = bichinho que anda sozinho pelo quarto (ISO.pet)
//
//  Propriedades de colisão (usadas pelo motor do quarto):
//    andavel  (canWalk)  = dá para pisar em cima (tapetes)
//    sentavel (canSit)   = o avatar senta nele; assento = altura do assento
//    frente   = para onde a pessoa sentada olha, com rotação 0: [dx, dy] na grade
//               (sem "frente", como no pufe, a pessoa mantém a direção em que chegou)
//    altura   (height)   = calculada sozinha pelas partes (ISO.altura)
// ============================================================
(function () {
  const TW = 32, TH = 16;
  const tom = (hex, f) => window.AVATAR ? AVATAR.tom(hex, f) : hex;
  const c3 = base => [tom(base, 1.18), base, tom(base, 0.72)];   // [topo, frente-esquerda, frente-direita]

  // ponto da tela para a coordenada (x, y) do piso na altura z
  const ponto = (ox, oy, x, y, z) => [ox + (x - y) * TW / 2, oy + (x + y) * TH / 2 - (z || 0)];
  function poli(ctx, pts, cor) { ctx.beginPath(); pts.forEach(([a, b], i) => i ? ctx.lineTo(a, b) : ctx.moveTo(a, b)); ctx.closePath(); ctx.fillStyle = cor; ctx.fill(); }
  function linha(ctx, pts, cor, lw) { ctx.beginPath(); pts.forEach(([a, b], i) => i ? ctx.lineTo(a, b) : ctx.moveTo(a, b)); ctx.strokeStyle = cor; ctx.lineWidth = lw || 0.8; ctx.stroke(); }

  function caixa(ctx, ox, oy, x, y, w, d, z, h, cores, tex) {
    const P = (a, b, zz) => ponto(ox, oy, a, b, zz);
    const [ct, cl, cr] = cores;
    const esq = [P(x, y + d, z + h), P(x + w, y + d, z + h), P(x + w, y + d, z), P(x, y + d, z)];
    const dir = [P(x + w, y, z + h), P(x + w, y + d, z + h), P(x + w, y + d, z), P(x + w, y, z)];
    const topo = [P(x, y, z + h), P(x + w, y, z + h), P(x + w, y + d, z + h), P(x, y + d, z + h)];
    poli(ctx, esq, cl); poli(ctx, dir, cr); poli(ctx, topo, ct);
    // textura
    if (tex === "veio" && h >= 3) {
      for (let k = 2; k < h - 0.5; k += 3) { linha(ctx, [P(x, y + d, z + k), P(x + w, y + d, z + k)], "rgba(60,30,10,.18)", 0.6); linha(ctx, [P(x + w, y + d, z + k), P(x + w, y, z + k)], "rgba(40,20,5,.2)", 0.6); }
      for (let k = 0.25; k < w; k += 0.35) linha(ctx, [P(x + k, y, z + h), P(x + k, y + d, z + h)], "rgba(60,30,10,.12)", 0.6);
    }
    if (tex === "tecido") {
      ctx.fillStyle = "rgba(255,255,255,.18)";
      for (let i = 0.15; i < w; i += 0.22) for (let j = 0.15; j < d; j += 0.22) { const [a, b] = P(x + i, y + j, z + h); ctx.fillRect(Math.round(a), Math.round(b), 1, 1); }
    }
    if (tex === "listra") for (let k = 0.2; k < w; k += 0.4) poli(ctx, [P(x + k, y, z + h), P(x + k + 0.18, y, z + h), P(x + k + 0.18, y + d, z + h), P(x + k, y + d, z + h)], "rgba(255,255,255,.22)");
    // contorno escuro
    ctx.strokeStyle = "rgba(20,12,28,.6)"; ctx.lineWidth = 0.8; ctx.lineJoin = "round";
    ctx.beginPath(); [[P(x, y, z + h), P(x + w, y, z + h), P(x + w, y + d, z + h), P(x, y + d, z + h), P(x, y, z + h)], [P(x, y + d, z), P(x + w, y + d, z), P(x + w, y, z)]].forEach(l => { l.forEach(([a, b], i) => i ? ctx.lineTo(a, b) : ctx.moveTo(a, b)); });
    ctx.moveTo(...P(x, y + d, z + h)); ctx.lineTo(...P(x, y + d, z)); ctx.moveTo(...P(x + w, y + d, z + h)); ctx.lineTo(...P(x + w, y + d, z)); ctx.moveTo(...P(x + w, y, z + h)); ctx.lineTo(...P(x + w, y, z));
    ctx.stroke();
    // brilho nas quinas de cima (dá volume, como nos hotéis de pixel)
    const [a1, b1] = P(x, y + d, z + h), [a2, b2] = P(x + w, y + d, z + h), [a3, b3] = P(x + w, y, z + h);
    linha(ctx, [[a1 + 0.4, b1 + 0.7], [a2, b2 + 0.7], [a3 - 0.4, b3 + 0.7]], "rgba(255,255,255,.38)", 0.7);
    if (h >= 2) { const [a4, b4] = P(x + w, y + d, z); linha(ctx, [[a2, b2 + 1], [a4, b4 - 0.5]], "rgba(255,255,255,.14)", 0.7); }
  }
  const bola = (ctx, x, y, r, cor) => { ctx.fillStyle = cor; ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.fill(); };
  const elip = (ctx, x, y, rx, ry, cor, borda) => { ctx.beginPath(); ctx.ellipse(x, y, rx, ry, 0, 0, 7); if (cor) { ctx.fillStyle = cor; ctx.fill(); } if (borda) { ctx.strokeStyle = borda; ctx.lineWidth = 0.8; ctx.stroke(); } };
  const brilho = (ctx, x, y, r, cor) => { const g = ctx.createRadialGradient(x, y, 1, x, y, r); g.addColorStop(0, cor); g.addColorStop(1, "rgba(0,0,0,0)"); ctx.fillStyle = g; ctx.fillRect(x - r, y - r, r * 2, r * 2); };

  const MAD = "#b0743e", MADE = "#7a4a26", BRANCO = "#f2f2f6", PRETO = "#2a2a3a", METAL = "#9aa0aa";
  const TELA = ["#14142a", "#3fd0ff", "#10102a"], VIDRO = ["rgba(200,240,255,.55)", "rgba(150,210,240,.55)", "rgba(110,170,210,.55)"];

  const MOVEIS = [
    { id: "cacto", nome: "Cacto", preco: 25, w: 1, d: 1,
      partes: () => [[0.34, 0.34, 0.32, 0.32, 0, 6, c3("#d0703a"), "veio"], [0.36, 0.36, 0.28, 0.28, 6, 1, c3("#8a5a3a")], [0.42, 0.42, 0.16, 0.16, 7, 19, c3("#3fa64a"), "listra"],
        [0.58, 0.45, 0.12, 0.1, 12, 3, c3("#3fa64a")], [0.66, 0.45, 0.08, 0.1, 12, 9, c3("#45b04e")], [0.3, 0.45, 0.12, 0.1, 15, 3, c3("#3fa64a")], [0.28, 0.45, 0.08, 0.1, 15, 7, c3("#45b04e")]],
      extra(ctx, cx, cy) { bola(ctx, cx, cy - 27, 2.4, "#ff5fa8"); bola(ctx, cx, cy - 27, 1, "#ffd23f"); } },
    { id: "planta", nome: "Planta", preco: 30, w: 1, d: 1,
      partes: () => [[0.3, 0.3, 0.4, 0.4, 0, 7, c3("#c0602e"), "veio"], [0.32, 0.32, 0.36, 0.36, 7, 1, c3("#4a2e1c")]],
      extra(ctx, cx, cy) { [[0, -16, 6, "#2f8a3a"], [-5, -12, 5, "#3fa64a"], [5, -12, 5, "#2f8a3a"], [-2, -20, 5, "#58c060"], [3, -19, 4, "#45b04e"], [0, -10, 4, "#3fa64a"], [-3, -22, 2, "#7ad87e"], [4, -15, 1.6, "#7ad87e"]].forEach(([dx, dy, r, c]) => bola(ctx, cx + dx, cy + dy, r, c)); } },
    { id: "pufe", nome: "Pufe", preco: 35, w: 1, d: 1, sentavel: true, assento: 8.5,
      partes: () => [[0.2, 0.2, 0.6, 0.6, 0, 7, c3("#ff5fa8"), "tecido"], [0.24, 0.24, 0.52, 0.52, 7, 1.5, c3("#ff8ac0"), "tecido"]] },
    { id: "cadeira", nome: "Cadeira", preco: 40, w: 1, d: 1, sentavel: true, assento: 9.8, frente: [0, 1],
      partes: () => [[0.24, 0.24, 0.08, 0.08, 0, 7, c3(MADE)], [0.68, 0.24, 0.08, 0.08, 0, 7, c3(MADE)], [0.24, 0.68, 0.08, 0.08, 0, 7, c3(MADE)], [0.68, 0.68, 0.08, 0.08, 0, 7, c3(MADE)],
        [0.22, 0.22, 0.56, 0.1, 9, 11, c3(MAD), "veio"], [0.2, 0.2, 0.6, 0.6, 7, 2, c3(MAD)], [0.26, 0.26, 0.48, 0.48, 9, 0.8, c3("#e3263a"), "tecido"]] },
    { id: "tapete", nome: "Tapete", preco: 40, w: 2, d: 2, andavel: true,
      partes: () => [[0.1, 0.1, 1.8, 1.8, 0, 0.8, c3("#3a5ad0")], [0.3, 0.3, 1.4, 1.4, 0.8, 0.2, c3("#ffd23f")], [0.5, 0.5, 1.0, 1.0, 1, 0.2, c3("#e3263a"), "tecido"]] },
    { id: "tapete_redondo", nome: "Tapete redondo", preco: 45, w: 2, d: 2, andavel: true,
      partes: () => [],
      extra(ctx, cx, cy) { elip(ctx, cx, cy + 1, 29, 14.5, "rgba(0,0,0,.18)"); [[28, 14, "#9b59ff"], [23, 11.5, "#f2f2f6"], [18, 9, "#ff5fa8"], [12, 6, "#f2f2f6"], [6, 3, "#ffd23f"]].forEach(([rx, ry, c]) => elip(ctx, cx, cy, rx, ry, c, "rgba(20,12,28,.35)")); } },
    { id: "abajur", nome: "Abajur", preco: 50, w: 1, d: 1,
      partes: () => [[0.35, 0.35, 0.3, 0.3, 0, 2, c3(PRETO)], [0.47, 0.47, 0.06, 0.06, 2, 15, c3(METAL)], [0.3, 0.3, 0.4, 0.4, 16, 9, c3("#ffe070"), "listra"]],
      extra(ctx, cx, cy) { brilho(ctx, cx, cy - 20, 24, "rgba(255,230,120,.45)"); } },
    { id: "mesa_centro", nome: "Mesa de centro", preco: 55, w: 1, d: 1,
      partes: () => [[0.15, 0.15, 0.08, 0.08, 0, 6, c3(MADE)], [0.77, 0.15, 0.08, 0.08, 0, 6, c3(MADE)], [0.15, 0.77, 0.08, 0.08, 0, 6, c3(MADE)], [0.77, 0.77, 0.08, 0.08, 0, 6, c3(MADE)],
        [0.15, 0.15, 0.7, 0.7, 2, 1, c3(MAD), "veio"], [0.1, 0.1, 0.8, 0.8, 6, 1.5, VIDRO]],
      extra(ctx, cx, cy) { ctx.fillStyle = "#e3263a"; ctx.fillRect(cx - 5, cy - 11, 4, 3); ctx.fillStyle = "#fff"; ctx.fillRect(cx - 4, cy - 12, 2, 1); ctx.fillStyle = "#ffd23f"; ctx.fillRect(cx + 2, cy - 10, 5, 2); } },
    { id: "mesa", nome: "Mesa", preco: 60, w: 1, d: 1,
      partes: () => [[0.42, 0.42, 0.16, 0.16, 0, 12, c3(MADE), "veio"], [0.3, 0.3, 0.4, 0.4, 0, 1, c3(MADE)], [0.05, 0.05, 0.9, 0.9, 12, 2.5, c3(MAD), "veio"]] },
    { id: "lava", nome: "Luminária de lava", preco: 70, w: 1, d: 1,
      partes: () => [[0.36, 0.36, 0.28, 0.28, 0, 4, c3("#c8c8d8")], [0.4, 0.4, 0.2, 0.2, 4, 15, ["rgba(255,120,200,.7)", "rgba(200,60,160,.7)", "rgba(150,40,130,.7)"]], [0.38, 0.38, 0.24, 0.24, 19, 3, c3("#c8c8d8")]],
      extra(ctx, cx, cy, r, t) {
        brilho(ctx, cx, cy - 14, 20, "rgba(255,90,200,.35)");
        for (let i = 0; i < 3; i++) { const f = (t * 0.25 + i / 3) % 1, yy = cy - 7 - f * 12, s = Math.sin((t + i) * 2) * 0.6; ctx.fillStyle = "#ffd23f"; ctx.beginPath(); ctx.ellipse(cx + s, yy, 1.8, 2.2 + Math.sin(t * 3 + i), 0, 0, 7); ctx.fill(); }
      } },
    { id: "palmeira", nome: "Palmeira", preco: 75, w: 1, d: 1,
      partes: () => [[0.28, 0.28, 0.44, 0.44, 0, 8, c3("#f2f2f6")], [0.3, 0.3, 0.4, 0.4, 8, 1, c3("#4a2e1c")], [0.45, 0.45, 0.1, 0.1, 9, 8, c3("#9a6a3a")], [0.46, 0.46, 0.09, 0.09, 17, 8, c3("#a87a4a")], [0.47, 0.47, 0.08, 0.08, 25, 7, c3("#9a6a3a")]],
      extra(ctx, cx, cy) {
        const ty = cy - 33;
        [[-1, -0.35, "#2f8a3a"], [1, -0.3, "#3fa64a"], [-0.8, 0.5, "#3fa64a"], [0.9, 0.55, "#2f8a3a"], [0, -1, "#58c060"], [0.15, 1, "#45b04e"]].forEach(([dx, dy, c]) => {
          ctx.beginPath(); ctx.moveTo(cx, ty); ctx.quadraticCurveTo(cx + dx * 10, ty + dy * 8 - 6, cx + dx * 16, ty + dy * 6 + 4); ctx.quadraticCurveTo(cx + dx * 8, ty + dy * 6 - 1, cx, ty + 2); ctx.fillStyle = c; ctx.fill();
        });
        bola(ctx, cx - 1, ty + 3, 1.8, "#7a4a26"); bola(ctx, cx + 2, ty + 3, 1.8, "#6a3a1c");
      } },
    { id: "poltrona", nome: "Poltrona", preco: 80, w: 1, d: 1, sentavel: true, assento: 10, frente: [0, 1],
      partes: () => { const c = c3("#1aa0a0"), l = c3("#3ac8c0"); return [[0.08, 0.1, 0.84, 0.8, 0, 7, c, "tecido"], [0.08, 0.1, 0.84, 0.2, 7, 12, c, "tecido"], [0.08, 0.1, 0.16, 0.8, 7, 5, c], [0.76, 0.1, 0.16, 0.8, 7, 5, c], [0.24, 0.3, 0.52, 0.58, 7, 3, l, "tecido"]]; } },
    { id: "estante", nome: "Estante de livros", preco: 90, w: 1, d: 1,
      partes() {
        const p = [[0.05, 0.05, 0.9, 0.06, 0, 33, c3(MADE), "veio"], [0.05, 0.05, 0.06, 0.4, 0, 33, c3(MADE)]];
        const livros = ["#e3263a", "#2f6bff", "#38c870", "#ffd23f", "#9b59ff", "#ff7a1a"];
        [0, 11, 22].forEach((z, k) => { p.push([0.05, 0.05, 0.9, 0.4, z, 1.5, c3(MAD)]); for (let i = 0; i < 4; i++) p.push([0.14 + i * 0.19, 0.12, 0.13, 0.26, z + 1.5, 6 + ((i + k) % 3), c3(livros[(i + k * 2) % livros.length])]); });
        p.push([0.89, 0.05, 0.06, 0.4, 0, 33, c3(MAD), "veio"], [0.05, 0.05, 0.9, 0.4, 33, 1.5, c3(MAD)]);
        return p;
      } },
    { id: "caixa_som", nome: "Caixa de som", preco: 90, w: 1, d: 1,
      partes: () => [[0.25, 0.25, 0.5, 0.5, 0, 26, c3(PRETO)], [0.27, 0.75, 0.46, 0.01, 3, 9, ["#555", "#3a3a4a", "#3a3a4a"]], [0.27, 0.75, 0.46, 0.01, 15, 8, ["#555", "#3a3a4a", "#3a3a4a"]]],
      extra(ctx, cx, cy, r, t) {
        const s = r % 2 ? 1 : -1, pulso = 1 + Math.max(0, Math.sin(t * 8)) * 0.4;
        [[cy - 2, 4.2], [cy - 14, 3.2]].forEach(([yy, rr]) => { elip(ctx, cx + s * 4, yy, rr * pulso * 0.8, rr * pulso, "#14141e", "#6a6a7a"); elip(ctx, cx + s * 4, yy, 1.2, 1.4, "#6a6a7a"); });
        ctx.fillStyle = "#39ff6a"; ctx.fillRect(cx + s * 4 - 1, cy - 23, 2, 1);
      } },
    { id: "violao", nome: "Violão", preco: 110, w: 1, d: 1,
      partes: () => [[0.4, 0.4, 0.2, 0.2, 0, 1.5, c3(PRETO)], [0.48, 0.48, 0.04, 0.04, 1.5, 8, c3(PRETO)]],
      extra(ctx, cx, cy) {
        const x = cx + 1, y = cy - 6;
        ctx.fillStyle = "#3a1e10"; ctx.fillRect(x - 1, y - 27, 3, 14); ctx.fillRect(x - 2, y - 30, 5, 4);
        elip(ctx, x + 0.5, y - 3, 6.5, 6, "#c0702e", "#5a2e10"); elip(ctx, x + 0.5, y - 11, 5, 4.6, "#c0702e", "#5a2e10"); elip(ctx, x + 0.5, y - 4, 5, 4.4, "#d8843a");
        elip(ctx, x + 0.5, y - 7, 1.8, 1.8, "#2a1408"); ctx.fillStyle = "#2a1408"; ctx.fillRect(x - 1, y - 2, 4, 1);
        ctx.fillStyle = "rgba(255,255,255,.6)"; ctx.fillRect(x, y - 26, 1, 22); ctx.fillStyle = "#ffd23f"; ctx.fillRect(x - 2, y - 29, 1, 1); ctx.fillRect(x + 2, y - 29, 1, 1);
      } },
    { id: "sofa", nome: "Sofá", preco: 120, w: 2, d: 1, sentavel: true, assento: 9, frente: [0, 1],
      partes: () => { const c = c3("#e3263a"), l = c3("#ff5a6a"); return [[0.05, 0.1, 1.9, 0.8, 0, 6, c, "tecido"], [0.05, 0.1, 1.9, 0.2, 6, 11, c, "tecido"], [0.05, 0.1, 0.2, 0.8, 6, 5, c], [0.25, 0.3, 0.74, 0.58, 6, 3, l, "tecido"], [1.01, 0.3, 0.74, 0.58, 6, 3, l, "tecido"], [1.75, 0.1, 0.2, 0.8, 6, 5, c], [0.4, 0.15, 0.4, 0.15, 9, 7, c3("#ffd23f")]]; } },
    { id: "guarda_roupa", nome: "Guarda-roupa", preco: 130, w: 2, d: 1,
      partes: () => [[0.05, 0.1, 1.9, 0.8, 0, 44, c3(MAD), "veio"], [0.0, 0.05, 2.0, 0.9, 44, 2, c3(MADE)], [0.05, 0.1, 1.9, 0.8, 0, 2, c3(MADE)],
        [0.98, 0.9, 0.04, 0.02, 3, 39, c3(MADE)], [0.85, 0.9, 0.06, 0.04, 20, 6, c3("#ffd23f")], [1.09, 0.9, 0.06, 0.04, 20, 6, c3("#ffd23f")], [0.3, 0.9, 0.5, 0.02, 30, 10, ["#cfe8ff", "#a8d0f0", "#88b0d0"]]] },
    { id: "cadeira_gamer", nome: "Cadeira gamer", preco: 130, w: 1, d: 1, sentavel: true, assento: 11, frente: [0, 1],
      partes: () => [[0.2, 0.46, 0.6, 0.08, 0, 1, c3(PRETO)], [0.46, 0.2, 0.08, 0.6, 0, 1, c3(PRETO)], [0.46, 0.46, 0.08, 0.08, 1, 7, c3(METAL)],
        [0.18, 0.2, 0.64, 0.62, 8, 3, c3("#2a2a3a")], [0.2, 0.2, 0.6, 0.12, 11, 20, c3("#2a2a3a")], [0.38, 0.19, 0.24, 0.12, 12, 18, c3("#ff2a8a")],
        [0.14, 0.3, 0.06, 0.45, 11, 6, c3("#3a3a4a")], [0.8, 0.3, 0.06, 0.45, 11, 6, c3("#3a3a4a")], [0.26, 0.18, 0.48, 0.14, 31, 4, c3("#2a2a3a")]] },
    { id: "geladeira", nome: "Geladeira", preco: 140, w: 1, d: 1,
      partes: () => [[0.1, 0.15, 0.8, 0.7, 0, 46, c3(BRANCO)], [0.1, 0.85, 0.8, 0.02, 30, 1, c3("#c8c8d0")], [0.72, 0.85, 0.06, 0.04, 33, 8, c3(METAL)], [0.72, 0.85, 0.06, 0.04, 14, 12, c3(METAL)]],
      extra(ctx, cx, cy, r) { const s = r % 2 ? 1 : -1; [["#ff2a4d", 0, 0], ["#2f6bff", 3, 4], ["#ffd23f", -2, 7]].forEach(([c, dx, dy]) => { ctx.fillStyle = c; ctx.fillRect(cx + s * (4 + dx), cy - 36 + dy, 2, 2); }); } },
    { id: "cama", nome: "Cama", preco: 150, w: 1, d: 2,
      partes: () => [[0.05, 0.05, 0.9, 1.9, 0, 5, c3(MAD), "veio"], [0.05, 0.05, 0.9, 0.12, 0, 17, c3(MADE), "veio"], [0.1, 0.17, 0.8, 1.75, 5, 3, c3(BRANCO)], [0.2, 0.22, 0.6, 0.35, 8, 2.5, c3("#ffffff"), "tecido"], [0.08, 0.72, 0.84, 1.2, 5, 4.5, c3("#2f6bff"), "listra"]] },
    { id: "gato", nome: "Gatinho", preco: 150, w: 1, d: 1, pet: "gato", partes: () => [] },
    { id: "tv", nome: "TV", preco: 160, w: 1, d: 1,
      partes: () => [[0.1, 0.2, 0.8, 0.6, 0, 8, c3("#4a3a34"), "veio"], [0.46, 0.42, 0.08, 0.08, 8, 3, c3(PRETO)], [0.08, 0.4, 0.84, 0.1, 11, 17, TELA]],
      extra(ctx, cx, cy) { ctx.fillStyle = "rgba(255,255,255,.7)"; ctx.fillRect(cx - 10, cy - 24, 3, 1); ctx.fillRect(cx - 9, cy - 22, 2, 1); } },
    { id: "cachorro", nome: "Cachorrinho", preco: 180, w: 1, d: 1, pet: "cachorro", partes: () => [] },
    { id: "cesta", nome: "Cesta de basquete", preco: 180, w: 1, d: 1,
      partes: () => [[0.3, 0.3, 0.4, 0.4, 0, 3, c3(PRETO)], [0.46, 0.46, 0.08, 0.08, 3, 40, c3(METAL)], [0.1, 0.42, 0.8, 0.06, 38, 18, c3(BRANCO)], [0.35, 0.47, 0.3, 0.02, 41, 8, ["#fff", "#e3263a", "#e3263a"]]],
      extra(ctx, cx, cy, r) {
        const s = r % 2 ? 1 : -1;
        elip(ctx, cx + s * 6, cy - 37, 6, 2.6, null, "#ff7a1a"); ctx.lineWidth = 1.4; ctx.stroke();
        ctx.strokeStyle = "rgba(255,255,255,.75)"; ctx.lineWidth = 0.6; for (let i = -4; i <= 4; i += 2) { ctx.beginPath(); ctx.moveTo(cx + s * 6 + i, cy - 36); ctx.lineTo(cx + s * 6 + i * 0.6, cy - 29); ctx.stroke(); }
        bola(ctx, cx - s * 7, cy + 2, 3.5, "#ff7a1a"); ctx.strokeStyle = "#7a2a00"; ctx.lineWidth = 0.6; ctx.beginPath(); ctx.moveTo(cx - s * 7 - 3.5, cy + 2); ctx.lineTo(cx - s * 7 + 3.5, cy + 2); ctx.moveTo(cx - s * 7, cy - 1.5); ctx.lineTo(cx - s * 7, cy + 5.5); ctx.stroke();
      } },
    { id: "mesa_pc", nome: "PC gamer", preco: 200, w: 1, d: 1,
      partes: () => [[0.62, 0.55, 0.28, 0.35, 0, 11, ["#3a3a4a", "#2a2a3a", "#ff2a8a"]], [0.06, 0.06, 0.08, 0.88, 0, 12, c3("#c8c8d8")], [0.06, 0.06, 0.88, 0.88, 12, 2, c3("#e8e8f0")],
        [0.25, 0.55, 0.45, 0.15, 14, 1, c3(PRETO)], [0.46, 0.3, 0.08, 0.08, 14, 3, c3(PRETO)], [0.18, 0.25, 0.64, 0.08, 17, 12, TELA]],
      extra(ctx, cx, cy, r, t) { ctx.fillStyle = `hsl(${(t * 90) % 360},100%,60%)`; ctx.fillRect(cx + (r % 2 ? -8 : 7), cy - 6, 1, 4); } },
    { id: "aquario", nome: "Aquário", preco: 220, w: 1, d: 1,
      partes: () => [[0.08, 0.25, 0.84, 0.5, 0, 10, c3(PRETO)], [0.1, 0.27, 0.8, 0.46, 10, 15, ["rgba(160,232,255,.85)", "rgba(63,184,232,.85)", "rgba(42,138,192,.85)"]], [0.08, 0.25, 0.84, 0.5, 25, 1.5, c3(PRETO)]],
      extra(ctx, cx, cy, r, t) {
        [[-6, -17, "#ff7a1a", 0], [3, -21, "#ffd23f", 2], [-1, -14, "#ff5fa8", 4]].forEach(([dx, dy, c, f]) => { const mx = Math.round(Math.sin(t * 0.8 + f) * 4), vira = Math.cos(t * 0.8 + f) < 0; ctx.fillStyle = c; ctx.fillRect(cx + dx + mx, cy + dy, 3, 2); ctx.fillRect(cx + dx + mx + (vira ? 3 : -1), cy + dy, 1, 2); });
        ctx.fillStyle = "#38c870"; ctx.fillRect(cx + 6, cy - 16, 1, 6); ctx.fillRect(cx - 9, cy - 15, 1, 5);
        ctx.fillStyle = "rgba(255,255,255,.7)"; const b = (t * 6) % 12; ctx.fillRect(cx + 2, cy - 12 - b, 1, 1);
      } },
    { id: "pebolim", nome: "Pebolim", preco: 250, w: 2, d: 1,
      partes: () => [[0.15, 0.15, 0.1, 0.1, 0, 10, c3(MADE)], [1.75, 0.15, 0.1, 0.1, 0, 10, c3(MADE)], [0.15, 0.75, 0.1, 0.1, 0, 10, c3(MADE)], [1.75, 0.75, 0.1, 0.1, 0, 10, c3(MADE)],
        [0.1, 0.1, 1.8, 0.8, 10, 5, c3(MAD), "veio"], [0.18, 0.18, 1.64, 0.64, 14, 1.2, c3("#38a850")],
        [0.5, 0.0, 0.05, 1.0, 17, 1, c3(METAL)], [0.85, 0.0, 0.05, 1.0, 17, 1, c3(METAL)], [1.15, 0.0, 0.05, 1.0, 17, 1, c3(METAL)], [1.5, 0.0, 0.05, 1.0, 17, 1, c3(METAL)]],
      extra(ctx, cx, cy, r) {
        const P = (x, y) => r % 2 ? ponto(cx, cy - 15.5, y - 0.5, x - 1, 0) : ponto(cx, cy - 15.5, x - 1, y - 0.5, 0);
        [[0.52, "#e3263a"], [0.87, "#2f6bff"], [1.17, "#e3263a"], [1.52, "#2f6bff"]].forEach(([x, c]) => [0.3, 0.5, 0.7].forEach(y => { const [a, b] = P(x, y); ctx.fillStyle = c; ctx.fillRect(Math.round(a) - 1, Math.round(b) - 3, 2, 4); }));
        const [a, b] = P(1, 0.5); bola(ctx, a, b, 1.2, "#fff");
      } },
    { id: "refri", nome: "Máquina de refri", preco: 280, w: 1, d: 1,
      partes: () => [[0.1, 0.15, 0.8, 0.7, 0, 48, c3("#e3263a")], [0.14, 0.85, 0.42, 0.02, 18, 26, ["#cfe8ff", "#a8e0ff", "#a8e0ff"]], [0.62, 0.85, 0.22, 0.02, 24, 18, c3("#2a2a3a")], [0.2, 0.85, 0.5, 0.03, 4, 7, c3("#14141e")]],
      extra(ctx, cx, cy, r, t) {
        const F = (u, z) => r % 2 ? ponto(cx, cy, 0.38, u - 0.5, z) : ponto(cx, cy, u - 0.5, 0.38, z);
        ["#ff7a1a", "#38c870", "#2f6bff", "#ffd23f"].forEach((c, j) => { const [a, b] = F(0.73, 38 - j * 4); ctx.fillStyle = c; ctx.fillRect(Math.round(a) - 1, Math.round(b) - 1, 3, 2); });
        const [a, b] = F(0.35, 40); ctx.fillStyle = Math.floor(t * 2) % 2 ? "#ffffff" : "#ffd23f"; ctx.fillRect(Math.round(a) - 3, Math.round(b) - 1, 6, 1);
        for (let k = 0; k < 3; k++) { const [x1, y1] = F(0.25 + k * 0.1, 22); ctx.fillStyle = ["#e3263a", "#38c870", "#ff7a1a"][k]; ctx.fillRect(Math.round(x1) - 1, Math.round(y1) - 7, 2, 7); ctx.fillStyle = "#fff"; ctx.fillRect(Math.round(x1) - 1, Math.round(y1) - 5, 2, 1); }
      } },
    { id: "arcade", nome: "Fliperama", preco: 300, w: 1, d: 1,
      partes: () => [[0.15, 0.2, 0.7, 0.5, 0, 34, c3("#7a3cff")], [0.15, 0.55, 0.7, 0.25, 12, 3, c3(PRETO)], [0.18, 0.7, 0.64, 0.04, 17, 11, TELA], [0.15, 0.2, 0.7, 0.5, 34, 4, c3("#ffd23f")]],
      extra(ctx, cx, cy, r, t) { bola(ctx, cx - 4, cy - 15, 1.2, "#ff2a4d"); bola(ctx, cx + 1, cy - 14, 1.2, "#38c870"); ctx.fillStyle = Math.floor(t * 3) % 2 ? "#ffd23f" : "#ff5fa8"; ctx.fillRect(cx - 6, cy - 26, 2, 2); ctx.fillRect(cx - 1, cy - 24, 2, 2); } },
    { id: "lareira", nome: "Lareira", preco: 350, w: 2, d: 1,
      partes: () => { const t = ["#c8644a", "#b0503a", "#8a3a2a"]; return [[0.05, 0.1, 1.9, 0.8, 0, 30, t, "veio"], [0.0, 0.05, 2.0, 0.9, 30, 3, c3("#e8e0d0")], [0.45, 0.88, 1.1, 0.04, 2, 18, c3("#1a0c08")]]; },
      extra(ctx, cx, cy, r, t) {
        const P = (u, z) => r % 2 ? ponto(cx, cy, 0.42, u - 1, z) : ponto(cx, cy, u - 1, 0.42, z);
        const [a, b] = P(1, 2);
        brilho(ctx, a, b - 6, 22, "rgba(255,140,40,.35)");
        for (let i = -2; i <= 2; i++) { const h = 7 + Math.sin(t * 9 + i * 1.7) * 2.5 + (2 - Math.abs(i)) * 2; ctx.fillStyle = "#ff7a1a"; ctx.fillRect(Math.round(a + i * 3) - 1, Math.round(b - h), 3, Math.round(h)); ctx.fillStyle = "#ffd23f"; ctx.fillRect(Math.round(a + i * 3), Math.round(b - h * 0.6), 1, Math.round(h * 0.6)); }
        ctx.fillStyle = "#4a2a14"; ctx.fillRect(Math.round(a) - 8, Math.round(b) - 1, 16, 2);
      } },
    { id: "trofeu", nome: "Troféu de ouro", preco: 400, w: 1, d: 1,
      partes: () => [[0.2, 0.2, 0.6, 0.6, 0, 11, c3(BRANCO)], [0.34, 0.34, 0.32, 0.32, 11, 3, c3("#c9a23a")], [0.46, 0.46, 0.08, 0.08, 14, 4, c3("#ffd23f")], [0.32, 0.32, 0.36, 0.36, 18, 9, c3("#ffd23f")]],
      extra(ctx, cx, cy, r, t) { ctx.fillStyle = "rgba(255,255,255,.8)"; ctx.fillRect(cx - 4, cy - 27, 1, 4); if (Math.floor(t * 1.5) % 3 === 0) { ctx.fillStyle = "#fff"; ctx.fillRect(cx + 3, cy - 31, 1, 3); ctx.fillRect(cx + 2, cy - 30, 3, 1); } } }
  ];

  // ---------------- bichinhos ----------------
  // Desenhados com blocos de pixel. dir: 1 = olhando para a direita da tela, -1 = esquerda
  const PETS = {
    gato:     { corpo: "#f0a040", escuro: "#c87a28", barriga: "#fff4e0", orelha: "gato", rabo: "gato", listras: true },
    cachorro: { corpo: "#c08048", escuro: "#7a4a26", barriga: "#f6e6d0", orelha: "cachorro", rabo: "cachorro", listras: false }
  };
  function pet(ctx, x, y, tipo, dir, quadro, t) {
    const p = PETS[tipo] || PETS.gato, s = dir < 0 ? -1 : 1;
    x = Math.round(x); y = Math.round(y);
    if (!(arguments[7] && arguments[7].semSombra)) elip(ctx, x, y, 8, 3, "rgba(0,0,0,.22)");
    const R = []; // [x0, y0, larg, alt, cor]  (x relativo, olhando para a direita)
    const pe = quadro % 2 ? [1, 0, 0, 1] : quadro ? [0, 1, 1, 0] : [0, 0, 0, 0];
    [-6, -3, 3, 6].forEach((lx, i) => R.push([lx, -5 - pe[i], 2, 5 - (pe[i] ? 0 : 0), i % 2 ? p.escuro : p.corpo]));
    R.push([-8, -12, 15, 7, p.corpo], [-7, -13, 13, 1, p.corpo], [-6, -6, 11, 1, p.barriga]);
    if (p.listras) R.push([-5, -13, 2, 3, p.escuro], [-1, -13, 2, 3, p.escuro], [3, -13, 2, 3, p.escuro]);
    if (p.rabo === "gato") { const bal = Math.round(Math.sin(t * 3)); R.push([-10, -13, 2, 3, p.corpo], [-11 + bal, -16, 2, 3, p.corpo], [-11 + bal, -18, 2, 2, p.escuro]); }
    else { const ab = Math.sin(t * 14) > 0 ? 1 : 0; R.push([-10, -14 - ab, 2, 3, p.corpo], [-11, -16 - ab, 2, 2, p.corpo]); }
    R.push([4, -18, 9, 8, p.corpo], [5, -19, 7, 1, p.corpo], [9, -13, 5, 3, p.barriga]);
    if (p.orelha === "gato") R.push([4, -21, 2, 3, p.corpo], [5, -22, 1, 1, p.corpo], [10, -21, 2, 3, p.corpo], [10, -22, 1, 1, p.corpo], [5, -20, 1, 1, "#ff8a9a"], [10, -20, 1, 1, "#ff8a9a"]);
    else R.push([4, -18, 3, 7, p.escuro], [5, -11, 2, 1, p.escuro]);
    const pis = Math.floor(t * 1.3) % 6 === 0;
    const olho = [[9, -16, 2, pis ? 1 : 2, "#1c1630"], [9, -16, 1, 1, pis ? "#1c1630" : "#ffffff"]];
    const focinho = [[13, -13, 1, 1, "#1c1630"], [11, -11, 2, 1, p.orelha === "gato" ? "#ff8a9a" : "#1c1630"]];
    const fx = (rx, w) => s > 0 ? x + rx : x - rx - w;
    // contorno: o mesmo desenho 1 px maior em volta, em cor escura
    ctx.fillStyle = "#1c1630";
    R.forEach(([rx, ry, w, h]) => ctx.fillRect(fx(rx, w) - 1, y + ry - 1, w + 2, h + 2));
    R.forEach(([rx, ry, w, h, c]) => { ctx.fillStyle = c; ctx.fillRect(fx(rx, w), y + ry, w, h); });
    ctx.fillStyle = "rgba(255,255,255,.35)"; ctx.fillRect(fx(-6, 8), y - 12, 8, 1); ctx.fillRect(fx(6, 4), y - 18, 4, 1);
    olho.concat(focinho).forEach(([rx, ry, w, h, c]) => { ctx.fillStyle = c; ctx.fillRect(fx(rx, w), y + ry, w, h); });
    if (tipo === "cachorro") { ctx.fillStyle = "#e3263a"; ctx.fillRect(fx(4, 6), y - 10, 6, 1); ctx.fillStyle = "#ffd23f"; ctx.fillRect(fx(7, 1), y - 9, 1, 1); }
  }

  // tamanho com rotação
  const pegada = (m, r) => (r % 2 ? [m.d, m.w] : [m.w, m.d]);
  const tempo = () => performance.now() / 1000;

  // Desenha o móvel m na posição (X, Y) do piso, com rotação r (0 ou 1)
  const achar = mov => typeof mov === "string" ? MOVEIS.find(x => x.id === mov) : mov;
  // altura do móvel (topo da parte mais alta), usada como "height"
  const alturas = {};
  function altura(mov) { const m = achar(mov); if (!m) return 0; if (alturas[m.id] == null) alturas[m.id] = m.partes().reduce((a, p) => Math.max(a, p[4] + p[5]), 0); return alturas[m.id]; }
  // direção para onde a pessoa sentada olha, já com a rotação
  function frenteSentado(mov, r) { const m = achar(mov); if (!m || !m.frente) return null; const [a, b] = m.frente; return r % 2 ? [b, a] : [a, b]; }

  // sombra no chão (o motor desenha todas as sombras numa camada própria)
  function sombra(ctx, ox, oy, mov, X, Y, r) {
    const m = achar(mov); if (!m || m.andavel || m.pet || !m.partes().length) return;
    const [pw, pd] = pegada(m, r), P = (a, b) => ponto(ox, oy, a, b, 0), e = 0.06;
    poli(ctx, [P(X + e, Y + e), P(X + pw + 0.12, Y + e), P(X + pw + 0.12, Y + pd + 0.12), P(X + e, Y + pd + 0.12)], "rgba(0,0,0,.16)");
  }

  // opc.semSombra = true quando a sombra já foi desenhada na camada de sombras
  function desenhar(ctx, ox, oy, mov, X, Y, r, alpha, opc) {
    const m = achar(mov); if (!m) return;
    ctx.save(); if (alpha != null) ctx.globalAlpha = alpha;
    const [pw, pd] = pegada(m, r);
    if (m.pet) { const [cx, cy] = ponto(ox, oy, X + 0.5, Y + 0.5, 0); pet(ctx, cx, cy, m.pet, r % 2 ? -1 : 1, 0, tempo()); ctx.restore(); return; }
    if (!(opc && opc.semSombra)) sombra(ctx, ox, oy, m, X, Y, r);
    let partes = m.partes();
    if (r % 2) partes = partes.map(([x, y, w, d, z, h, c, t]) => [y, x, d, w, z, h, [c[0], c[2], c[1]], t]);
    partes.forEach(([x, y, w, d, z, h, c, t]) => caixa(ctx, ox, oy, X + x, Y + y, w, d, z, h, c, t));
    if (m.extra) { const [cx, cy] = ponto(ox, oy, X + pw / 2, Y + pd / 2, 0); m.extra(ctx, cx, cy, r || 0, tempo()); }
    ctx.restore();
  }

  // Miniatura do móvel num <canvas> (para a loja e o inventário)
  function miniatura(canvas, id, escala) {
    const m = MOVEIS.find(x => x.id === id); const e = escala || 2;
    const lw = 72, lh = 84;
    canvas.width = lw * e; canvas.height = lh * e;
    const ctx = canvas.getContext("2d"); ctx.imageSmoothingEnabled = false;
    const low = document.createElement("canvas"); low.width = lw; low.height = lh;
    const l = low.getContext("2d");
    const [pw, pd] = pegada(m, 0);
    const ox = lw / 2 - (pw - pd) * TW / 4, oy = lh - 8 - (pw + pd) * TH / 2;
    if (m.pet) pet(l, lw / 2, lh - 14, m.pet, 1, 0, 0.5);
    else desenhar(l, ox, oy, m, 0, 0, 0);
    ctx.drawImage(low, 0, 0, lw * e, lh * e);
  }

  window.MOVEIS = MOVEIS;
  window.ISO = { TW, TH, ponto, caixa, poli, desenhar, sombra, miniatura, pegada, pet, altura, frenteSentado, achar };
})();
