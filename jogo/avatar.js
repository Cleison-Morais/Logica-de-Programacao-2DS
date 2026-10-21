// ============================================================
//  AVATAR EM PIXEL ART – Ponto Certo Arcade
//  Grade de 24x28 pixels (estilo chibi) + contorno automático
// ============================================================
(function () {
  const BASE = [
    "........................", // 0
    "........................", // 1
    "........................", // 2
    ".........SSSSSS.........", // 3
    ".......SSSSSSSSSS.......", // 4
    "......SSSSSSSSSSSS......", // 5
    ".....SSSSSSSSSSSSSS.....", // 6
    ".....SSSSSSSSSSSSSS.....", // 7
    ".....SSOOOSSSSOOOSS.....", // 8  sobrancelhas
    "....sSSSEWSSSSEWSSSs....", // 9  olhos (com brilho)
    "....sSSSEESSSSEESSSs....", // 10
    "....sSSKSSSSSSSSKSSs....", // 11 bochechas
    ".....SSSSSMMMMSSSSS.....", // 12 boca
    ".....sSSSSSmmSSSSSs.....", // 13
    "......ssSSSSSSSSss......", // 14 queixo
    ".........ssssss.........", // 15 pescoço
    "......TTTTTTTTTTTT......", // 16 ombros
    ".....TTTTTTTTTTTTTT.....", // 17
    "....TTTTTTTTTTTTTTTT....", // 18 mangas
    "....SStTTTTTTTTTTtSS....", // 19 braços
    "....SStTTTTTTTTTTtSS....", // 20
    "....ssttttttttttttss....", // 21 mãos + barra
    "......PPPPPPPPPPPP......", // 22 calça
    "......PPPPPPPPPPPP......", // 23
    "......PPPPPppPPPPP......", // 24
    "......PPPPP..PPPPP......", // 25 pernas
    "......ppppp..ppppp......", // 26
    ".....BBBBBB..BBBBBB....."  // 27 tênis
  ];

  const L = (r, s) => [r, s];
  const TOPO_CURTO = [
    L(1, "........HHHHHHHH........"),
    L(2, "......HHHHHHHHHHHH......"),
    L(3, ".....HHHHjjjHHHHHHH....."),
    L(4, "....HHHHHHHHHHHHHHHH...."),
    L(5, "....HHHHHHHHHHHHHHHH...."),
    L(6, "....HHhHHHHhHHHHhHHH...."),
    L(7, "....HHh..h....h..hHH...."),
    L(8, "....HH............HH....")
  ];
  const CABELOS = {
    curto: TOPO_CURTO,
    espetado: [
      L(0, "......H...H...H...H....."),
      L(1, ".....HHH.HHH.HHH.HHH...."),
      L(2, "....HHHHHHHHHHHHHHHHH..."),
      ...TOPO_CURTO.slice(2)
    ],
    longo: [
      L(1, "........HHHHHHHH........"),
      L(2, "......HHHHHHHHHHHH......"),
      L(3, ".....HHHHjjjHHHHHHH....."),
      L(4, "...HHHHHHHHHHHHHHHHHH..."),
      L(5, "...HHHHHHHHHHHHHHHHHH..."),
      L(6, "...HHHhHHHHhHHHHhHHHH..."),
      L(7, "...HHHh..h....h..hHHH..."),
      ...[8, 9, 10, 11, 12, 13, 14].map(r => L(r, "...HH..............HH...")),
      L(15, "...hH..............Hh..."),
      L(16, "...hh..............hh...")
    ],
    afro: [
      L(0, ".......HHHHHHHHHH......."),
      L(1, ".....HHHHHHHHHHHHHH....."),
      L(2, "...HHHHHjHHHHHjHHHHHH..."),
      L(3, "..HHHHHHHHHHHHHHHHHHHH.."),
      L(4, "..HHHjHHHHHHHHHHjHHHHH.."),
      L(5, "..HHHHHHHHHHHHHHHHHHHH.."),
      L(6, "..HHHHhHHHHHHHHHHhHHHH.."),
      L(7, "..HHHH..h......h...HHH.."),
      L(8, "..HHH..............HHH.."),
      L(9, "...HH..............HH..."),
      L(10, "...hH..............Hh...")
    ],
    coque: [
      L(0, "..........HHHH.........."),
      L(1, ".........HHjHHH........."),
      ...TOPO_CURTO.slice(1)
    ],
    careca: [L(4, "........j..............."), L(5, ".......jj...............")].map(([r, s]) => [r, s.replace(/j/g, "q")])
  };

  const CAMADAS = {
    oculos: [L(9, ".....GGGGGGGGGGGGGG....."), L(10, ".......GgGG..GgGG.......")],
    visor: [L(9, "....NNNNNNNNNNNNNNNN...."), L(10, "....NnnnnnnnnnnnnnnN....")],
    bone: [
      L(1, "........CCCCCCCC........"),
      L(2, "......CCCCCCCCCCCC......"),
      L(3, ".....CCCCcCCCCCCCCC....."),
      L(4, "....CCCCCCCCCCCCCCCC...."),
      L(5, "....cccccccccccccccc...."),
      L(6, "...CCCCCCCCCCCCCCCCCC...")
    ],
    fone: [
      L(1, ".......FFFFFFFFFF......."),
      L(2, ".....FF..........FF....."),
      L(3, "....F..............F...."),
      L(4, "...F................F..."),
      L(5, "...F................F..."),
      L(6, "...F................F..."),
      L(7, "..FFF..............FFF.."),
      L(8, "..FfF..............FfF.."),
      L(9, "..FfF..............FfF.."),
      L(10, "..FfF..............FfF.."),
      L(11, "..FFF..............FFF..")
    ],
    coroa: [L(0, ".......K..K..K..K......."), L(1, ".......KKKKKKKKKK......."), L(2, ".......KkKKkKKkKK.......")],
    mochila: [16, 17, 18, 19, 20, 21].map(r => L(r, ".......W........W.......")),
    raio: [L(17, ".............R.........."), L(18, "............RR.........."), L(19, "...........RRR.........."), L(20, "...........RR..........."), L(21, "..........R.............")],
    dev: [L(18, "..........L............."), L(19, "...........L..LL........"), L(20, "..........L.............")]
  };
  const CAPA = [...Array(11)].map((_, k) => L(16 + k, "...VVVVVVVVVVVVVVVVVV...")).concat([L(27, "....VVVVVVVVVVVVVVVV....")]);

  const PALETA = {
    pele:     ["#fcd9bd", "#f0b98d", "#d4956a", "#a96b43", "#7d4a2b", "#573220"],
    cabelo:   ["#2a2230", "#5a3a1e", "#a0622d", "#e8c35a", "#e8e8ee", "#ff4f9a", "#3fa9ff", "#7a3cff"],
    camiseta: ["#e3263a", "#2a2a3a", "#2f6bff", "#2ecc71", "#ffd23f", "#ff7a00", "#9b59ff", "#f2f2f2"],
    calca:    ["#33507a", "#2a2a3a", "#6b4f2a", "#5f6b78", "#7a1020"],
    fundo:    ["#1b1b3a", "#3a0a1e", "#0a3a2e", "#2a1b4a", "dourado"]
  };

  const FIXAS = { E: "#1c1630", W: "#ffffff", M: "#b0303f", m: "#ff8a9a", B: "#3a2a24", G: "#141420", g: "#6ad0ff", N: "#00f0ff", n: "#7ff8ff",
    C: "#f2f2f2", c: "#c8c8d8", F: "#2a2a3a", f: "#ff2a4d", K2: "#ffd23f", k: "#ff2a4d", W2: "#7a4a1e", R: "#ffd23f", L: "#39ff6a", V: "#b0102a", q: "#ffffff" };

  const ITENS = [
    { id: "oculos",  nome: "Óculos escuros",  slot: "rosto",   estrelas: 3 },
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
    if (a.cabelo === "cacheado") a.cabelo = "afro";
    if (!CABELOS[a.cabelo]) a.cabelo = "curto";
    return a;
  }

  // escurece (f<1) ou clareia (f>1) uma cor
  function tom(hex, f) {
    const n = parseInt(hex.slice(1), 16);
    let r = n >> 16, g = (n >> 8) & 255, b = n & 255;
    if (f < 1) { r *= f; g *= f; b *= f; } else { r += (255 - r) * (f - 1); g += (255 - g) * (f - 1); b += (255 - b) * (f - 1); }
    return "#" + [r, g, b].map(v => Math.round(Math.max(0, Math.min(255, v))).toString(16).padStart(2, "0")).join("");
  }
  function mistura(a, b, t) {
    const x = parseInt(a.slice(1), 16), y = parseInt(b.slice(1), 16);
    const c = [16, 8, 0].map(s => Math.round(((x >> s) & 255) * (1 - t) + ((y >> s) & 255) * t));
    return "#" + c.map(v => v.toString(16).padStart(2, "0")).join("");
  }

  function montarGrade(av) {
    const g = Array.from({ length: 28 }, () => Array(24).fill("."));
    const aplicar = (linhas, troca) => linhas.forEach(([r, s]) => { for (let c = 0; c < 24; c++) { let ch = s[c]; if (ch && ch !== ".") { if (troca && troca[ch]) ch = troca[ch]; g[r][c] = ch; } } });
    if (av.costas === "capa") aplicar(CAPA);
    aplicar(BASE.map((s, i) => [i, s]));
    if (av.estampa && CAMADAS[av.estampa]) aplicar(CAMADAS[av.estampa]);
    if (av.costas === "mochila") aplicar(CAMADAS.mochila, { W: "W2" });
    aplicar(CABELOS[av.cabelo]);
    if (av.rosto && CAMADAS[av.rosto]) aplicar(CAMADAS[av.rosto]);
    if (av.cabeca && CAMADAS[av.cabeca]) aplicar(CAMADAS[av.cabeca], { K: "K2" });
    return g;
  }

  function cores(av) {
    const pele = PALETA.pele[av.pele] || PALETA.pele[1];
    const cab = PALETA.cabelo[av.corCabelo] || PALETA.cabelo[0];
    const cam = PALETA.camiseta[av.camiseta] || PALETA.camiseta[0];
    const cal = PALETA.calca[av.calca] || PALETA.calca[0];
    return Object.assign({}, FIXAS, {
      S: pele, s: tom(pele, 0.8), K: mistura(pele, "#ff6070", 0.35),
      H: cab, h: tom(cab, 0.72), j: tom(cab, 1.3), O: tom(cab, 0.6),
      T: cam, t: tom(cam, 0.75),
      P: cal, p: tom(cal, 0.72)
    });
  }

  function desenhar(canvas, avatarBruto, escala, comFundo) {
    const av = normalizar(avatarBruto);
    escala = escala || 6;
    const LW = 26, LH = 30;
    canvas.width = LW * escala; canvas.height = LH * escala;
    const ctx = canvas.getContext("2d");
    ctx.imageSmoothingEnabled = false;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (comFundo !== false) {
      const f = PALETA.fundo[av.fundo] || PALETA.fundo[0];
      if (f === "dourado") {
        const gr = ctx.createRadialGradient(canvas.width / 2, canvas.height / 2, 2, canvas.width / 2, canvas.height / 2, canvas.width * 0.75);
        gr.addColorStop(0, "#fff3a0"); gr.addColorStop(0.45, "#ffd23f"); gr.addColorStop(1, "#8a5a00");
        ctx.fillStyle = gr; ctx.fillRect(0, 0, canvas.width, canvas.height);
      } else {
        ctx.fillStyle = f; ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = tom(f, 1.12); // chão
        ctx.fillRect(0, 27 * escala, canvas.width, 3 * escala);
      }
    }
    const g = montarGrade(av), C = cores(av);
    const cheio = (r, c) => r >= 0 && r < 28 && c >= 0 && c < 24 && g[r][c] !== ".";
    ctx.fillStyle = "#140c1c";
    for (let r = -1; r <= 28; r++) for (let c = -1; c <= 24; c++) {
      if (cheio(r, c)) continue;
      if (cheio(r - 1, c) || cheio(r + 1, c) || cheio(r, c - 1) || cheio(r, c + 1)) ctx.fillRect((c + 1) * escala, (r + 1) * escala, escala, escala);
    }
    for (let r = 0; r < 28; r++) for (let c = 0; c < 24; c++) {
      if (!cheio(r, c)) continue;
      ctx.fillStyle = C[g[r][c]] || "#ff00ff";
      ctx.fillRect((c + 1) * escala, (r + 1) * escala, escala, escala);
    }
  }

  window.AVATAR = { desenhar, normalizar, PALETA, CABELOS: Object.keys(CABELOS), ITENS, PADRAO, tom };
})();
