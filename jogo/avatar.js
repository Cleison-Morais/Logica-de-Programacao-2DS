// ============================================================
//  AVATAR EM PIXEL ART – Ponto Certo Arcade
//  Grade de 16x16 pixels + contorno automático (18x18)
// ============================================================
(function () {
  const BASE = [
    "................",
    "................",
    ".....SSSSSS.....",
    "....SSSSSSSS....",
    "....SSSSSSSS....",
    "....SESSSSES....",
    "....SSSSSSSS....",
    "....SSSmmSSS....",
    ".....SSSSSS.....",
    "...TTTTTTTTTT...",
    "..STTTTTTTTTTS..",
    "..STTTTTTTTTTS..",
    "..S.TTTTTTTT.S..",
    "....PPPPPPPP....",
    "....PPP..PPP....",
    "....BBB..BBB...."
  ];

  // Cabelos: cada linha é [número da linha, desenho]
  const CABELOS = {
    curto:    [[1, ".....HHHHHH....."], [2, "....HHHHHHHH...."], [3, "....HHHHHHHH...."], [4, "....H......H...."]],
    espetado: [[0, "....H..H..H....."], [1, "....HHHHHHHH...."], [2, "...HHHHHHHHHH..."], [3, "....HHHHHHHH...."], [4, "....H......H...."]],
    longo:    [[1, ".....HHHHHH....."], [2, "....HHHHHHHH...."], [3, "...HHHHHHHHHH..."], [4, "...HH......HH..."], [5, "...H........H..."], [6, "...H........H..."], [7, "...H........H..."], [8, "...HH......HH..."], [9, "...H........H..."]],
    cacheado: [[0, "....HHHHHHHH...."], [1, "...HHHHHHHHHH..."], [2, "..HHHHHHHHHHHH.."], [3, "..HHHHHHHHHHHH.."], [4, "..HH........HH.."], [5, "..H..........H.."], [6, "..H..........H.."]],
    coque:    [[0, "......HHHH......"], [1, ".....HHHHHH....."], [2, "....HHHHHHHH...."], [3, "....HHHHHHHH...."], [4, "....H......H...."]],
    careca:   []
  };

  const CAMADAS = {
    oculos: [[5, "....GgGGGGgG...."]],
    visor:  [[5, "...NNNNNNNNNN..."]],
    bone:   [[1, ".....CCCCCC....."], [2, "....CCCCCCCC...."], [3, "....CCCCCCCCcc.."]],
    fone:   [[2, "....FFFFFFFF...."], [3, "...F........F..."], [4, "...F........F..."], [5, "...F........F..."], [6, "...F........F..."]],
    coroa:  [[0, "....K..KK..K...."], [1, "....KKKKKKKK...."]],
    mochila:[[9, "....W......W...."], [10, "....W......W...."], [11, "....W......W...."]],
    raio:   [[9, "........R......."], [10, ".......RRR......"], [11, "......RRR......."], [12, ".......R........"]],
    dev:    [[10, "......L........."], [11, ".......L.LL....."], [12, "......L........."]]
  };
  const CAPA = [[9, "..VVVVVVVVVVVV.."], [10, "..VVVVVVVVVVVV.."], [11, "..VVVVVVVVVVVV.."], [12, "..VVVVVVVVVVVV.."], [13, "..VVVVVVVVVVVV.."], [14, "...VVVVVVVVVV..."]];

  const PALETA = {
    pele:     ["#f8d0b0", "#e8b48c", "#c68a5e", "#a0663e", "#7a4a2a", "#5a3420"],
    cabelo:   ["#1a1a1a", "#5a3a1e", "#a0622d", "#e8c35a", "#e8e8e8", "#ff4f9a", "#3fa9ff", "#7a3cff"],
    camiseta: ["#e30613", "#1a1a1a", "#2f6bff", "#2ecc71", "#ffd23f", "#ff7a00", "#9b59ff", "#ffffff"],
    calca:    ["#2b3a67", "#1a1a1a", "#6b4f2a", "#5f6b78", "#7a1020"],
    fundo:    ["#1b1b3a", "#3a0a1e", "#0a3a2e", "#2a1b4a", "dourado"]
  };

  const FIXAS = { E: "#1a1a2e", m: "#a0303a", B: "#2a2a2a", G: "#111111", g: "#7fd8ff", N: "#00f0ff", C: "#e30613", c: "#a00410", F: "#222222", K: "#ffd23f", W: "#7a4a1e", R: "#ffd23f", L: "#39ff6a", V: "#b0102a" };

  // Itens que se ganham com estrelas
  const ITENS = [
    { id: "oculos",  nome: "Óculos",          slot: "rosto",   estrelas: 3 },
    { id: "bone",    nome: "Boné",            slot: "cabeca",  estrelas: 6 },
    { id: "raio",    nome: "Estampa raio",    slot: "estampa", estrelas: 9 },
    { id: "fone",    nome: "Fone gamer",      slot: "cabeca",  estrelas: 12 },
    { id: "mochila", nome: "Mochila",         slot: "costas",  estrelas: 15 },
    { id: "dev",     nome: "Estampa >_ dev",  slot: "estampa", estrelas: 18 },
    { id: "visor",   nome: "Visor neon",      slot: "rosto",   estrelas: 22 },
    { id: "capa",    nome: "Capa de herói",   slot: "costas",  estrelas: 26 },
    { id: "coroa",   nome: "Coroa",           slot: "cabeca",  estrelas: 32 },
    { id: "dourado", nome: "Fundo dourado",   slot: "fundo",   estrelas: 39 }
  ];

  const PADRAO = { pele: 1, cabelo: "curto", corCabelo: 0, camiseta: 0, calca: 0, fundo: 0, cabeca: "", rosto: "", costas: "", estampa: "" };

  function normalizar(av) {
    const a = Object.assign({}, PADRAO, av || {});
    if (!CABELOS[a.cabelo]) a.cabelo = "curto";
    return a;
  }

  function montarGrade(av) {
    const g = Array.from({ length: 16 }, () => Array(16).fill("."));
    const aplicar = (linhas) => linhas.forEach(([r, s]) => { for (let c = 0; c < 16; c++) if (s[c] !== ".") g[r][c] = s[c]; });
    if (av.costas === "capa") aplicar(CAPA);
    aplicar(BASE.map((s, i) => [i, s]));
    if (av.estampa && CAMADAS[av.estampa]) aplicar(CAMADAS[av.estampa]);
    if (av.costas === "mochila") aplicar(CAMADAS.mochila);
    aplicar(CABELOS[av.cabelo]);
    if (av.rosto && CAMADAS[av.rosto]) aplicar(CAMADAS[av.rosto]);
    if (av.cabeca && CAMADAS[av.cabeca]) aplicar(CAMADAS[av.cabeca]);
    return g;
  }

  function cor(ch, av) {
    switch (ch) {
      case "S": return PALETA.pele[av.pele] || PALETA.pele[1];
      case "H": return PALETA.cabelo[av.corCabelo] || PALETA.cabelo[0];
      case "T": return PALETA.camiseta[av.camiseta] || PALETA.camiseta[0];
      case "P": return PALETA.calca[av.calca] || PALETA.calca[0];
      default: return FIXAS[ch] || "#ff00ff";
    }
  }

  // Desenha o avatar num <canvas>. escala = tamanho de cada pixel.
  function desenhar(canvas, avatarBruto, escala, comFundo) {
    const av = normalizar(avatarBruto);
    escala = escala || 8;
    const N = 18;
    canvas.width = N * escala; canvas.height = N * escala;
    const ctx = canvas.getContext("2d");
    ctx.imageSmoothingEnabled = false;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (comFundo !== false) {
      const f = PALETA.fundo[av.fundo] || PALETA.fundo[0];
      if (f === "dourado") {
        const gr = ctx.createRadialGradient(canvas.width / 2, canvas.height / 2, 2, canvas.width / 2, canvas.height / 2, canvas.width * 0.7);
        gr.addColorStop(0, "#fff3a0"); gr.addColorStop(0.45, "#ffd23f"); gr.addColorStop(1, "#8a5a00");
        ctx.fillStyle = gr;
      } else ctx.fillStyle = f;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    const g = montarGrade(av);
    const cheio = (r, c) => r >= 0 && r < 16 && c >= 0 && c < 16 && g[r][c] !== ".";
    // contorno
    ctx.fillStyle = "#0a0a14";
    for (let r = -1; r <= 16; r++) for (let c = -1; c <= 16; c++) {
      if (cheio(r, c)) continue;
      if (cheio(r - 1, c) || cheio(r + 1, c) || cheio(r, c - 1) || cheio(r, c + 1)) ctx.fillRect((c + 1) * escala, (r + 1) * escala, escala, escala);
    }
    for (let r = 0; r < 16; r++) for (let c = 0; c < 16; c++) {
      if (!cheio(r, c)) continue;
      ctx.fillStyle = cor(g[r][c], av);
      ctx.fillRect((c + 1) * escala, (r + 1) * escala, escala, escala);
    }
  }

  window.AVATAR = { desenhar, normalizar, PALETA, CABELOS: Object.keys(CABELOS), ITENS, PADRAO };
})();
