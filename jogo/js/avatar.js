// ============================================================
//  AVATAR ISOMÉTRICO (inspirado no estilo dos hotéis de pixel)
//  Grade de 56 x 82 pixels, 4 direções e 3 quadros de animação.
//  dir: 0 = frente-direita, 1 = frente-esquerda, 2 = costas-esquerda, 3 = costas-direita
//  quadro: 0 = parado, 1 e 2 = andando
//  Cada parte (cabeça, cabelo, braço, perna, roupa, chapéu) é desenhada numa
//  camada própria e ganha um contorno escuro da própria cor: é isso que
//  deixa o boneco bem definido, como nos hotéis de pixel.
// ============================================================
(function () {
  const W = 56, H = 82;
  const CX = 27, CY = 31, RX = 13, RY = 12;   // cabeça
  const Y0 = 47, YL = 61, YS = 75;            // ombro, quadril, topo do sapato (proporção chibi: corpo curto, cabeça grande)
  const EY = CY - 1, OLHO = [28, 34], MY = CY + 7;  // olhos (longe, perto) e boca

  // ---------------- opções ----------------
  const PALETA = {
    pele:   ["#ffe0c8", "#f6c7a0", "#e3a878", "#c48452", "#9a6038", "#6e4026", "#4a2a1a"],
    cabelo: ["#2a2230", "#4a2e1c", "#7a4a26", "#b0703a", "#e8c35a", "#f0ece4", "#9aa0aa", "#e8443a", "#ff5fa8", "#3fa9ff", "#7a4cff", "#38c870"],
    olhos:  ["#2a2230", "#4a2e1c", "#2f7de0", "#2fa060", "#8a5ad0"],
    roupa:  ["#e3263a", "#ff7a1a", "#ffd23f", "#38c870", "#1aa0a0", "#2f6bff", "#3a3ad0", "#9b59ff", "#ff5fa8", "#f2f2f2", "#8a8a9a", "#2a2a3a"],
    calca:  ["#33507a", "#23314a", "#2a2a3a", "#6b4f2a", "#5f6b78", "#7a1020", "#2f6b3a", "#c8b48a", "#f2f2f2"],
    calcado:["#f2f2f2", "#e3263a", "#2a2a3a", "#2f6bff", "#ffd23f", "#38c870", "#7a4a26", "#ff5fa8"],
    fundo:  ["#1b1b3a", "#3a0a1e", "#0a3a2e", "#2a1b4a", "#3a2a0a", "#0a2a3a"]
  };
  const ESTILOS = {
    sexo:    ["m", "f"],
    cabelo:  ["curto", "degrade", "topete", "espetado", "moicano", "careca", "franja", "lateral", "chanel", "longo", "rabo", "chiquinha", "coque", "tranca", "cacheado", "afro"],
    rosto:   ["normal", "feliz", "mal", "surpreso", "sono", "piscando", "lingua"],
    roupa:   ["camiseta", "estampa", "time", "listrada", "polo", "xadrez", "moletom", "jaqueta", "social", "jardineira", "regata", "vestido"],
    calca:   ["calca", "rasgada", "bermuda", "shorts", "saia"],
    calcado: ["tenis", "cano", "bota", "sapatilha", "chinelo"]
  };
  const NOMES = {
    m: "Masculino", f: "Feminino",
    curto: "Curto", topete: "Topete", espetado: "Espetado", moicano: "Moicano", careca: "Careca", franja: "Franja", chanel: "Chanel",
    degrade: "Degradê", lateral: "Franja de lado", chiquinha: "Maria-chiquinha", longo: "Longo", rabo: "Rabo de cavalo", coque: "Coque", tranca: "Trança", cacheado: "Cacheado", afro: "Black power",
    normal: "Normal", feliz: "Feliz", mal: "Cara de mal", surpreso: "Surpreso", sono: "Com sono", piscando: "Piscadinha", lingua: "Língua",
    camiseta: "Camiseta", estampa: "Camiseta estampada", time: "Camisa de time", jardineira: "Jardineira", listrada: "Listrada", polo: "Polo", xadrez: "Xadrez", moletom: "Moletom", jaqueta: "Jaqueta", social: "Social + gravata", regata: "Regata", vestido: "Vestido",
    calca: "Calça", rasgada: "Calça rasgada", bermuda: "Bermuda", shorts: "Shorts", saia: "Saia",
    tenis: "Tênis", cano: "Tênis cano alto", bota: "Bota", sapatilha: "Sapatilha", chinelo: "Chinelo"
  };
  // Chapéus e acessórios liberados por estrelas (soma de todas as fases)
  const ITENS = [
    { id: "bone",    nome: "Boné",            slot: "chapeu", estrelas: 3 },
    { id: "laco",    nome: "Laço",            slot: "chapeu", estrelas: 4 },
    { id: "bonetras",nome: "Boné pra trás",   slot: "chapeu", estrelas: 5 },
    { id: "oculos",  nome: "Óculos",          slot: "rosto2", estrelas: 6 },
    { id: "cachecol",nome: "Cachecol",        slot: "pescoco", estrelas: 7 },
    { id: "gorro",   nome: "Gorro",           slot: "chapeu", estrelas: 9 },
    { id: "bandana", nome: "Bandana",         slot: "chapeu", estrelas: 10 },
    { id: "faixa",   nome: "Faixa ninja",     slot: "chapeu", estrelas: 12 },
    { id: "mochila", nome: "Mochila",         slot: "costas", estrelas: 13 },
    { id: "fone",    nome: "Fone gamer",      slot: "chapeu", estrelas: 15 },
    { id: "gatinho", nome: "Orelhas de gato", slot: "chapeu", estrelas: 16 },
    { id: "escuros", nome: "Óculos escuros",  slot: "rosto2", estrelas: 18 },
    { id: "cowboy",  nome: "Chapéu de cowboy",slot: "chapeu", estrelas: 21 },
    { id: "corrente",nome: "Corrente de ouro",slot: "pescoco", estrelas: 24 },
    { id: "cartola", nome: "Cartola",         slot: "chapeu", estrelas: 28 },
    { id: "chifres", nome: "Chifrinhos",      slot: "chapeu", estrelas: 32 },
    { id: "visor",   nome: "Visor neon",      slot: "rosto2", estrelas: 35 },
    { id: "capa",    nome: "Capa de herói",   slot: "costas", estrelas: 40 },
    { id: "mago",    nome: "Chapéu de mago",  slot: "chapeu", estrelas: 45 },
    { id: "aureola", nome: "Auréola",         slot: "chapeu", estrelas: 50 },
    { id: "coroa",   nome: "Coroa",           slot: "chapeu", estrelas: 60 }
  ];
  const PADRAO = { sexo: "m", pele: 1, cabelo: "curto", corCabelo: 0, rosto: "normal", corOlhos: 0, roupa: "camiseta", corRoupa: 0, corRoupa2: 9, calca: "calca", corCalca: 0, calcado: "tenis", corCalcado: 0, fundo: 0, chapeu: "", rosto2: "", pescoco: "", costas: "", corChapeu: 0 };
  const SLOTS = ["chapeu", "rosto2", "pescoco", "costas"];

  function normalizar(av) {
    const a = Object.assign({}, PADRAO, av || {});
    for (const k of Object.keys(ESTILOS)) if (!ESTILOS[k].includes(a[k])) a[k] = PADRAO[k];
    for (const sl of SLOTS) if (a[sl] && !ITENS.some(i => i.id === a[sl] && i.slot === sl)) a[sl] = "";
    return a;
  }

  // ---------------- cores ----------------
  function tom(hex, f) {
    const n = parseInt(hex.slice(1), 16);
    let r = n >> 16, g = (n >> 8) & 255, b = n & 255;
    if (f < 1) { r *= f; g *= f; b *= f; } else { r += (255 - r) * (f - 1); g += (255 - g) * (f - 1); b += (255 - b) * (f - 1); }
    return "#" + [r, g, b].map(v => Math.round(Math.max(0, Math.min(255, v))).toString(16).padStart(2, "0")).join("");
  }
  // Cada material tem 4 tons: 0 = base, 1 = sombra, 2 = brilho, 3 = contorno
  function cores(av) {
    const m = {};
    const add = (k, hex, fc) => { m[k + "0"] = hex; m[k + "1"] = tom(hex, 0.78); m[k + "2"] = tom(hex, 1.25); m[k + "3"] = tom(hex, fc || 0.45); };
    const pele = PALETA.pele[av.pele] ?? PALETA.pele[1];
    add("S", pele, 0.55); m.S1 = tom(pele, 0.86); m.S2 = tom(pele, 1.12);
    add("H", PALETA.cabelo[av.corCabelo] ?? PALETA.cabelo[0]);
    add("T", PALETA.roupa[av.corRoupa] ?? PALETA.roupa[0]);
    add("U", PALETA.roupa[av.corRoupa2] ?? PALETA.roupa[9]);
    add("P", PALETA.calca[av.corCalca] ?? PALETA.calca[0]);
    add("B", PALETA.calcado[av.corCalcado] ?? PALETA.calcado[0]);
    add("C", PALETA.roupa[av.corChapeu] ?? PALETA.roupa[0]);
    add("Z", "#f4f4f8", 0.55); add("G", "#22222e", 0.6); add("L", "#3a4a6a"); add("N", "#00d8f0"); add("K", "#ffd23f"); add("Q", "#a0662e"); add("A", "#5a3ad0"); add("D", "#2a2a3a", 0.6); add("R", "#e3263a");
    m.E0 = "#1c1630"; m.W0 = "#ffffff"; m.I0 = PALETA.olhos[av.corOlhos] ?? PALETA.olhos[0];
    m.M0 = "#7a2232"; m.m0 = "#ff8a9a"; m.r0 = "#e8607a"; m.k0 = "#ff2a4d"; m.j0 = "#2f9bff";
    return m;
  }

  // ---------------- camadas ----------------
  function camada() {
    const p = Array.from({ length: H }, () => Array(W).fill(null));
    const L = {
      p,
      set(x, y, k) { x = Math.round(x); y = Math.round(y); if (x >= 0 && y >= 0 && x < W && y < H) p[y][x] = k; },
      get(x, y) { return x >= 0 && y >= 0 && x < W && y < H ? p[y][x] : null; },
      ret(x0, y0, x1, y1, k) { for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) L.set(x, y, k); },
      // forma genérica: teste(x, y) diz se o pixel entra; tomFn(x, y) devolve "0", "1" ou "2"
      forma(teste, mat, tomFn) { for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) if (teste(x, y)) L.set(x, y, mat + (tomFn ? tomFn(x, y) : "0")); },
      elipse(cx, cy, rx, ry, mat, fixo, filtro) {
        for (let y = Math.floor(cy - ry); y <= Math.ceil(cy + ry); y++) for (let x = Math.floor(cx - rx); x <= Math.ceil(cx + rx); x++) {
          const nx = (x - cx) / rx, ny = (y - cy) / ry; if (nx * nx + ny * ny > 1) continue;
          if (filtro && !filtro(x, y)) continue;
          L.set(x, y, mat + (fixo != null ? fixo : tomDe(nx, ny)));
        }
      },
      pinta(fn) { for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) { const k = p[y][x]; if (k) { const n = fn(x, y, k); if (n) p[y][x] = n; } } },
      apaga(fn) { for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) if (p[y][x] && fn(x, y)) p[y][x] = null; }
    };
    return L;
  }
  // luz vindo de cima e da direita (lado do rosto)
  const tomDe = (nx, ny) => (-nx * 0.5 + ny * 0.85 > 0.55 ? "1" : (nx * 0.45 - ny * 0.85 > 0.62 ? "2" : "0"));
  // junta a camada na imagem final, com contorno escuro em volta (semCont(x, y) pula pontos do contorno)
  function compor(base, cam, contorno, semCont, sombra) {
    const p = cam.p;
    // sombra projetada: escurece "sombra" pixels logo abaixo da camada (ex.: franja sobre a testa)
    if (sombra) for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
      if (!p[y][x] || (y < H - 1 && p[y + 1][x])) continue;
      for (let k = 1; k <= sombra; k++) { const v = y + k < H && base.p[y + k][x]; if (v && (v[1] === "0" || v[1] === "2") && "EWIMmrkj".indexOf(v[0]) < 0 && !(y + k < H && p[y + k][x])) base.p[y + k][x] = v[0] + "1"; }
    }
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) if (p[y][x]) base.p[y][x] = p[y][x];
    if (contorno === false) return;
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
      if (p[y][x] || (semCont && semCont(x, y))) continue;
      const v = (y > 0 && p[y - 1][x]) || (y < H - 1 && p[y + 1][x]) || (x > 0 && p[y][x - 1]) || (x < W - 1 && p[y][x + 1]);
      if (v && "EWIMmrkj".indexOf(v[0]) < 0) base.p[y][x] = v[0] + "3";
    }
  }

  // formato da cabeça: um "quadrado arredondado", com o queixo mais estreito
  function naCabeca(x, y, folga) {
    const f = folga || 0, ny = (y - CY) / (RY + f);
    const rx = (RX + f) * (ny > 0 ? 1 - 0.16 * ny : 1);
    const nx = (x - CX) / rx;
    return Math.pow(Math.abs(nx), 2.6) + Math.pow(Math.abs(ny), 2.6) <= 1;
  }

  // ---------------- desenho ----------------
  function desenharGrade(av, costas, quadro, piscar) {
    const base = camada();
    const fem = av.sexo === "f";
    const roupa = av.roupa, calca = av.calca, cab = av.cabelo, rs = av.rosto;
    // deslocamentos da caminhada: [perna da frente, perna de trás, braço da frente, braço de trás]
    const passo = quadro === 1 ? [3, -3, -2, 2] : quadro === 2 ? [-3, 3, 2, -2] : [0, 0, 0, 0];
    const mangaLonga = ["moletom", "jaqueta", "social", "xadrez"].includes(roupa);
    const corTronco = roupa === "social" ? "U" : "T";
    const tx0 = fem ? 18 : 17, tx1 = fem ? 37 : 38;            // largura do tronco
    const larg = y => {                                           // largura do tronco em cada linha
      if (y === Y0) return [tx0 + 2, tx1 - 2];
      if (y === Y0 + 1) return [tx0 + 1, tx1 - 1];
      if (fem && y >= Y0 + 6 && y <= Y0 + 10) return [tx0 + 1, tx1 - 1];
      return [tx0, tx1];
    };

    const costasIt = av.costas, pesc = av.pescoco;
    // ===== 0. capa (de frente ela fica atrás de tudo) =====
    if (costasIt === "capa" && !costas) {
      const k = camada();
      k.forma((x, y) => y >= Y0 && y <= YS - 2 && x >= tx0 - 3 - Math.floor((y - Y0) / 5) && x <= tx1 + 1 + Math.floor((y - Y0) / 7), "C", (x, y) => (y >= YS - 3 ? "1" : (x - y) % 7 === 0 ? "0" : "1"));
      compor(base, k);
    }

    // ===== 1. cabelo comprido atrás do corpo =====
    const cabeloAtras = () => {
      const c = camada();
      if (cab === "longo") {
        if (costas) c.forma((x, y) => y >= CY - 2 && y <= CY + 24 && x >= CX - 12 + Math.max(0, y - CY - 18) && x <= CX + 12 - Math.max(0, y - CY - 18), "H", (x, y) => (x > CX + 8 ? "1" : x < CX - 9 ? "2" : "0"));
        else c.forma((x, y) => y >= CY - 4 && y <= CY + 22 && x >= CX - 14 + Math.max(0, y - CY - 16) && x <= CX - 2 + Math.round((y - CY) / 6), "H", (x, y) => (x < CX - 11 ? "1" : "0"));
      }
      if (cab === "chanel") {
        if (costas) c.forma((x, y) => y >= CY - 2 && y <= CY + 9 && Math.abs(x - CX) <= 14, "H", (x, y) => (y === CY + 9 ? "1" : "0"));
        else c.forma((x, y) => y >= CY - 2 && y <= CY + 8 && x >= CX - 15 && x <= CX - 4, "H", (x, y) => (y === CY + 8 || x < CX - 12 ? "1" : "0"));
      }
      if (cab === "rabo") {
        const ox = costas ? CX : CX - 13;
        for (let k = 0; k <= 16; k++) { const hw = 3.2 - Math.abs(k - 6) * 0.22; c.elipse(ox - (costas ? 0 : Math.round(k / 5)), CY + 1 + k, Math.max(1.4, hw), 1.2, "H", k % 4 === 0 ? "1" : null); }
      }
      if (cab === "chiquinha") {
        const lados = costas ? [CX - 14, CX + 14] : [CX - 14];
        lados.forEach(ox => { const s = ox < CX ? -1 : 1; for (let k = 0; k <= 13; k++) { const hw = 3 - Math.abs(k - 5) * 0.2; c.elipse(ox + s * Math.round(k / 6), CY - 3 + k, Math.max(1.3, hw), 1.2, "H", k % 4 === 1 ? "1" : null); } c.ret(ox - 1, CY - 4, ox + 1, CY - 3, "R0"); });
      }
      if (cab === "tranca") {
        const ox = costas ? CX : CX - 11;
        for (let k = 0; k < 6; k++) c.elipse(ox, CY + 4 + k * 4, 2.8, 2.4, "H", k % 2 ? "1" : null);
        c.ret(ox - 1, CY + 27, ox + 1, CY + 28, "R0");
        c.elipse(ox, CY + 31, 2, 2.2, "H");
      }
      if (cab === "cacheado") c.forma((x, y) => { const nx = (x - CX + 1) / 16, ny = (y - CY - 1) / 15; return nx * nx + ny * ny <= 1 && y >= CY - 4 && (costas || x <= CX - 2); }, "H", (x, y) => ((x * 3 + y * 7) % 8 === 0 ? "1" : (x * 5 + y * 3) % 11 === 0 ? "2" : "0"));
      if (cab === "afro") c.forma((x, y) => { const nx = (x - CX + 1) / 18, ny = (y - CY + 4) / 16; return nx * nx + ny * ny <= 1; }, "H", (x, y) => ((x * 7 + y * 13) % 9 === 0 ? "2" : (x * 3 + y * 5) % 7 === 0 ? "1" : "0"));
      if (["cacheado", "afro"].includes(cab)) {   // bordas em "nuvem"
        c.apaga((x, y) => { const v = c.get; return (!v(x - 1, y) || !v(x + 1, y) || !v(x, y - 1) || !v(x, y + 1)) && (x * 5 + y * 3) % 4 === 0; });
      }
      return c;
    };
    const cabeloLongo = ["longo", "chanel", "rabo", "chiquinha", "tranca", "cacheado", "afro"].includes(cab);
    if (cabeloLongo && !costas) compor(base, cabeloAtras());
    if (cab === "afro" && costas) compor(base, cabeloAtras());

    // ===== 2. pernas e calçados =====
    const perna = (x0, x1, dx, frente) => {
      const c = camada(), s = camada();
      for (let y = YL + 2; y <= YS - 1; y++) {
        const d = y >= YL + 5 ? dx : Math.round(dx / 2);
        const pele = (calca === "bermuda" && y >= YL + 7) || (calca === "shorts" && y >= YL + 3) || (calca === "saia" && y >= YL + 2) || (roupa === "vestido" && y >= YL + 2);
        const buraco = calca === "rasgada" && (y === YL + 6 || y === YL + 7) && frente;
        for (let x = x0; x <= x1; x++) {
          let t = frente ? (x === x0 ? "1" : x === x1 - 1 && !pele ? "2" : "0") : (x >= x1 - 1 ? "0" : "1");
          if (!pele && frente && y === YL + 7 && x === x0 + 3) t = "1";              // dobra do joelho
          if (buraco && x >= x0 + 2 && x <= x1 - 2) { c.set(x + d, y, y === YL + 6 ? "Z0" : "S0"); continue; }
          c.set(x + d, y, (pele ? "S" : "P") + (pele ? (t === "2" ? "0" : t) : t));
        }
      }
      // calçado
      const a = x0 + dx - 1, b = x1 + dx + 3, tb = frente ? "0" : "1";
      const pe = () => { s.ret(a + 1, YS, b - 1, YS + 2, "S" + tb); };
      if (av.calcado === "tenis" || av.calcado === "cano") {
        const topo = av.calcado === "cano" ? YS - 3 : YS;
        s.ret(a + 1, topo, b - 2, YS + 1, "B" + tb); s.ret(a, YS + 1, b, YS + 3, "B" + tb);
        s.ret(b - 3, YS + 1, b, YS + 3, "Z0"); s.set(b, YS + 1, "Z1");
        s.ret(a, YS + 4, b, YS + 5, "Z" + (frente ? "0" : "1")); s.ret(a, YS + 5, b, YS + 5, "Z1");
        for (let x = a + 3; x < b - 3; x += 2) s.set(x, YS, "Z0");
        if (av.calcado === "cano") { s.ret(a + 2, YS - 2, a + 3, YS - 1, "Z0"); s.ret(a + 1, topo, b - 2, topo, "Z0"); }
      } else if (av.calcado === "bota") {
        s.ret(a + 1, YS - 4, b - 3, YS + 1, "B" + tb); s.ret(a, YS + 1, b, YS + 4, "B" + tb); s.ret(b - 2, YS + 1, b, YS + 2, "B2");
        s.ret(a + 1, YS - 4, b - 3, YS - 3, "B1"); s.ret(a, YS + 5, b, YS + 5, "D0"); s.ret(a, YS + 4, a + 2, YS + 5, "D0");
      } else if (av.calcado === "sapatilha") {
        pe(); s.ret(a, YS + 2, b, YS + 4, "B" + tb); s.ret(b - 2, YS + 1, b - 1, YS + 1, "B" + tb); s.ret(a, YS + 5, b, YS + 5, "B1"); s.set(b - 4, YS + 2, "B2");
      } else {
        pe(); s.ret(a + 1, YS + 3, b, YS + 3, "S" + tb);
        for (let k = 0; k < 4; k++) s.set(b - 5 + k, YS + 1 + (k > 1 ? 1 : 0), "B0");
        s.ret(a, YS + 4, b + 1, YS + 5, "B1");
      }
      compor(base, c); compor(base, s);
    };
    perna(costas ? 30 : 19, costas ? 36 : 26, costas ? passo[1] : passo[1], false);
    perna(costas ? 19 : 29, costas ? 26 : 36, passo[0], true);
    if (costas) {   // de costas, a perna da esquerda fica na frente
      // já desenhada na ordem certa: a da direita (atrás) primeiro
    }

    // ===== 3. quadril, saia e vestido =====
    const q = camada();
    if (roupa !== "vestido") {
      q.ret(tx0, YL, tx1, YL + 3, "P0");
      for (let y = YL; y <= YL + 3; y++) { q.set(tx0, y, "P1"); q.set(tx0 + 1, y, "P1"); }
      q.ret(tx0, YL, tx1, YL, "P1");
      if (!costas && calca !== "saia") q.ret(28, YL + 1, 28, YL + 3, "P1");
      if (calca === "saia") q.forma((x, y) => y >= YL && y <= YL + 6 && x >= tx0 - Math.floor((y - YL) / 2) && x <= tx1 + Math.floor((y - YL) / 2), "P", (x, y) => (y === YL + 6 || x <= tx0 - Math.floor((y - YL) / 2) + 1 ? "1" : (x - y) % 6 === 0 ? "1" : "0"));
    } else {
      q.forma((x, y) => y >= YL && y <= YL + 7 && x >= tx0 - Math.floor((y - YL) / 2) && x <= tx1 + Math.floor((y - YL) / 2), "T", (x, y) => (y >= YL + 6 ? "1" : x <= tx0 - Math.floor((y - YL) / 2) + 1 ? "1" : (x + y) % 7 === 0 ? "1" : "0"));
      q.ret(tx0 - 3, YL + 6, tx1 + 3, YL + 6, "U0");
    }
    compor(base, q);

    // ===== 4. braços e tronco =====
    const aw = fem ? 4 : 5;
    const braco = (x0, dx, frente) => {
      const c = camada();
      for (let y = Y0 + 1; y <= Y0 + 12; y++) {
        const d = y >= Y0 + 6 ? dx : y >= Y0 + 3 ? Math.round(dx / 2) : 0;
        const fimManga = mangaLonga ? Y0 + 11 : roupa === "regata" ? Y0 - 1 : roupa === "vestido" ? Y0 + 3 : Y0 + 4;
        const manga = y <= fimManga;
        const mat = manga ? (roupa === "social" || roupa === "listrada" && y === fimManga ? "U" : "T") : "S";
        for (let x = x0; x <= x0 + aw - 1; x++) {
          let t = frente ? (x === x0 ? "1" : x === x0 + aw - 1 && manga ? "2" : "0") : "1";
          if (manga && y === fimManga) t = "1";
          if (roupa === "time" && manga && y >= fimManga - 1) { c.set(x + d, y, "U" + (frente ? "0" : "1")); continue; }
          if (roupa === "listrada" && manga && (y - Y0) % 4 === 3) { c.set(x + d, y, "U" + (frente ? "0" : "1")); continue; }
          c.set(x + d, y, mat + (mat === "S" && t === "2" ? "0" : t));
        }
      }
      c.elipse(x0 + (aw - 1) / 2 + dx, Y0 + 14, fem ? 2.3 : 2.7, 2.4, "S", frente ? "0" : "1");
      compor(base, c);
    };
    const braco1 = costas ? tx1 + 1 : tx0 - aw, braco2 = costas ? tx0 - aw : tx1;
    if (costasIt === "mochila" && !costas) { const k = camada(); k.forma((x, y) => y >= Y0 + 2 && y <= Y0 + 12 && x >= tx0 - 6 && x <= tx0 + 1 && !(y === Y0 + 2 && x === tx0 - 6), "C", (x, y) => (x <= tx0 - 5 ? "1" : y === Y0 + 2 ? "2" : y === Y0 + 7 ? "1" : "0")); compor(base, k); }
    braco(braco1, passo[3], false);

    const t = camada();
    for (let y = Y0; y <= YL - 1; y++) {
      const [a, b] = larg(y);
      for (let x = a; x <= b; x++) {
        let k = "0";
        if (costas) { if (x >= b - 2) k = "1"; else if (x <= a + 1 && y > Y0 + 1) k = "2"; }
        else { if (x <= a + 2) k = "1"; else if (x >= b - 1 && y > Y0 + 1 && y < Y0 + 6) k = "2"; }
        if (y === YL - 1) k = "1";
        if (fem && !costas && y === Y0 + 5 && x >= a + 4 && x <= b - 3) k = "1";   // linha do busto
        t.set(x, y, corTronco + k);
      }
    }
    // detalhes da roupa
    const meio = 28;
    if (!costas) {
      const decote = (fundo) => { for (let k = 0; k <= fundo; k++) t.ret(meio - 3 + k, Y0 + k, meio + 2 - k, Y0 + k, "S" + (k === 0 ? "1" : "0")); };
      if (["camiseta", "estampa", "jardineira", "listrada", "vestido", "xadrez"].includes(roupa)) { decote(roupa === "vestido" && fem ? 3 : 2); t.ret(meio - 2, Y0 + 3, meio + 1, Y0 + 3, corTronco + "1"); }
      if (roupa === "polo") { decote(1); t.ret(meio - 5, Y0, meio - 3, Y0 + 2, "U0"); t.ret(meio + 2, Y0, meio + 4, Y0 + 2, "U0"); t.set(meio - 1, Y0 + 3, "T1"); t.set(meio - 1, Y0 + 5, "U0"); t.set(meio - 1, Y0 + 7, "U0"); }
      if (roupa === "regata") { decote(4); for (let y = Y0; y <= Y0 + 5; y++) { const [a, b] = larg(y); t.ret(a, y, a + 2 - (y > Y0 + 3 ? 1 : 0), y, "S1"); t.ret(b - 2 + (y > Y0 + 3 ? 1 : 0), y, b, y, "S0"); } }
      if (roupa === "moletom") {
        t.ret(meio - 6, Y0, meio + 5, Y0 + 1, "T1"); t.ret(meio - 3, Y0, meio + 2, Y0, "S1");
        t.ret(meio - 3, Y0 + 2, meio - 3, Y0 + 5, "U0"); t.ret(meio + 2, Y0 + 2, meio + 2, Y0 + 4, "U0");
        t.ret(tx0 + 5, Y0 + 8, tx1 - 4, Y0 + 8, "T1"); t.ret(tx0 + 4, Y0 + 9, tx0 + 4, Y0 + 12, "T1"); t.ret(tx1 - 3, Y0 + 9, tx1 - 3, Y0 + 12, "T1");
      }
      if (roupa === "jaqueta") {
        t.forma((x, y) => y >= Y0 && y < YL && x >= meio - 3 && x <= meio + 2, "U", (x, y) => (y === YL - 1 ? "1" : "0"));
        for (let y = Y0; y < YL; y++) { t.set(meio - 4, y, "T1"); t.set(meio + 3, y, "T2"); }
        t.ret(meio - 6, Y0, meio - 4, Y0 + 3, "T2"); t.ret(meio + 3, Y0, meio + 5, Y0 + 3, "T1");
        t.set(meio + 4, Y0 + 6, "K0"); t.set(meio + 4, Y0 + 10, "K0");
      }
      if (roupa === "social") {
        t.ret(meio - 3, Y0, meio - 2, Y0 + 1, "Z0"); t.ret(meio + 1, Y0, meio + 2, Y0 + 1, "Z0");
        t.ret(meio - 1, Y0, meio, Y0 + 1, "T1"); t.ret(meio - 1, Y0 + 2, meio, Y0 + 9, "T0"); t.ret(meio - 2, Y0 + 7, meio + 1, Y0 + 9, "T0"); t.set(meio, Y0 + 3, "T2"); t.ret(meio - 1, Y0 + 10, meio, Y0 + 10, "T1");
      }
      if (roupa === "vestido") { t.ret(tx0, Y0 + 9, tx1, Y0 + 10, "U0"); }
      if (roupa === "estampa") {   // estrela no peito
        ["..#..", ".###.", "#####", ".###.", "##.##"].forEach((l, j) => [...l].forEach((ch, i) => { if (ch === "#") t.set(meio - 1 + i, Y0 + 5 + j, j < 2 && i > 2 ? "U2" : "U0"); }));
      }
      if (roupa === "time") {
        decote(3); for (let k = 0; k <= 3; k++) { t.set(meio - 3 + k, Y0 + k, "U0"); t.set(meio + 2 - k, Y0 + k, "U0"); }
        for (let y = Y0 + 2; y < YL - 1; y++) { t.set(tx0 + 3, y, "U1"); t.set(tx1 - 2, y, "U0"); }
        t.ret(meio + 3, Y0 + 5, meio + 4, Y0 + 6, "K0"); t.set(meio + 4, Y0 + 5, "K2");
      }
      if (roupa === "jardineira") {
        t.forma((x, y) => (y >= Y0 + 5 && y < YL && x >= meio - 5 && x <= meio + 4) || (y >= Y0 + 10 && y < YL && x >= tx0 && x <= tx1), "P", (x, y) => (x <= tx0 + 2 || x === meio - 5 ? "1" : y === Y0 + 5 ? "2" : "0"));
        for (let y = Y0; y <= Y0 + 5; y++) { t.ret(meio - 7, y, meio - 6, y, "P1"); t.ret(meio + 5, y, meio + 6, y, "P0"); }
        t.set(meio - 6, Y0 + 5, "K0"); t.set(meio + 5, Y0 + 5, "K0");
        t.ret(meio - 2, Y0 + 7, meio + 1, Y0 + 7, "P1"); t.ret(meio - 2, Y0 + 8, meio - 2, Y0 + 9, "P1"); t.ret(meio + 1, Y0 + 8, meio + 1, Y0 + 9, "P1"); t.ret(meio - 2, Y0 + 9, meio + 1, Y0 + 9, "P1");
      }
    } else {
      if (roupa === "time") {   // número 10 nas costas
        const dig = { 1: [".#", "##", ".#", ".#", "##"], 0: ["###", "#.#", "#.#", "#.#", "###"] };
        [[dig[1], meio - 4], [dig[0], meio]].forEach(([g, x0]) => g.forEach((l, j) => [...l].forEach((ch, i) => { if (ch === "#") t.set(x0 + i, Y0 + 4 + j, "U0"); })));
      }
      if (roupa === "jardineira") {
        for (let k = 0; k <= 9; k++) { t.ret(meio - 7 + Math.round(k * 1.3), Y0 + k, meio - 6 + Math.round(k * 1.3), Y0 + k, "P0"); t.ret(meio + 5 - Math.round(k * 1.3), Y0 + k, meio + 6 - Math.round(k * 1.3), Y0 + k, "P1"); }
        t.forma((x, y) => y >= Y0 + 10 && y < YL && x >= tx0 && x <= tx1, "P", (x, y) => (x >= tx1 - 2 ? "1" : "0"));
      }
      if (roupa === "moletom") { t.forma((x, y) => y >= Y0 - 1 && y <= Y0 + 6 && Math.abs(x - meio + 0.5) <= 8 - Math.max(0, y - Y0 - 2) * 1.4, "T", (x, y) => (y >= Y0 + 5 ? "1" : y === Y0 - 1 ? "2" : "0")); t.forma((x, y) => y >= Y0 && y <= Y0 + 3 && Math.abs(x - meio + 0.5) <= 5 - (y - Y0), "T", () => "1"); }
      if (roupa === "regata") { t.forma((x, y) => y >= Y0 && y <= Y0 + 3 && Math.abs(x - meio + 0.5) <= 6 - (y - Y0), "S", () => "1"); }
      if (["camiseta", "estampa", "time", "listrada", "polo", "xadrez", "vestido", "social", "jardineira"].includes(roupa)) t.ret(meio - 3, Y0, meio + 2, Y0, roupa === "polo" || roupa === "time" ? "U0" : "S1");
      if (roupa === "jaqueta") t.ret(meio - 5, Y0, meio + 4, Y0 + 1, "T1");
      if (roupa === "vestido") t.ret(tx0, Y0 + 9, tx1, Y0 + 10, "U0");
    }
    if (roupa === "listrada") t.pinta((x, y, k) => (k[0] === "T" && (y - Y0) % 4 === 3 ? "U" + k[1] : null));
    if (roupa === "xadrez") t.pinta((x, y, k) => { if (k[0] !== "T") return null; const lx = (x + 1) % 6 < 2, ly = (y - Y0) % 6 < 2; return lx && ly ? "U1" : lx || ly ? "U0" : null; });
    if (costasIt === "mochila" && !costas) for (let y = Y0; y <= Y0 + 8; y++) { t.ret(tx0 + 3, y, tx0 + 4, y, y === Y0 + 5 ? "G1" : "G0"); if (y <= Y0 + 6) t.set(tx1 - 3, y, "G0"); }
    if (costasIt === "capa" && !costas) { t.ret(tx0, Y0, tx0 + 2, Y0 + 1, "C0"); t.ret(tx1 - 2, Y0, tx1, Y0 + 1, "C0"); t.set(tx0 + 3, Y0 + 1, "K0"); t.set(tx1 - 3, Y0 + 1, "K0"); }
    compor(base, t);
    if (costas && costasIt === "mochila") {
      const k = camada();
      k.forma((x, y) => y >= Y0 + 1 && y <= Y0 + 13 && x >= tx0 + 1 && x <= tx1 - 1 && !((y === Y0 + 1 || y === Y0 + 13) && (x === tx0 + 1 || x === tx1 - 1)), "C", (x, y) => (x >= tx1 - 3 ? "1" : y <= Y0 + 2 ? "2" : "0"));
      k.ret(tx0 + 2, Y0 + 5, tx1 - 2, Y0 + 5, "C1");
      k.forma((x, y) => y >= Y0 + 8 && y <= Y0 + 12 && x >= meio - 6 && x <= meio + 5, "C", (x, y) => (y === Y0 + 8 ? "1" : x >= meio + 4 ? "1" : "0"));
      k.ret(meio - 5, Y0 + 9, meio + 4, Y0 + 9, "Z0"); k.set(meio + 4, Y0 + 10, "K0");
      compor(base, k);
    }
    const pc = camada();
    pc.ret(CX - 3, CY + 8, CX + 3, Y0, "S1"); pc.ret(CX + 1, CY + 8, CX + 3, Y0 - 1, "S0");
    compor(base, pc, true, (x, y) => y > Y0);
    // acessórios do pescoço
    if (pesc === "cachecol") {
      const k = camada();
      k.forma((x, y) => y >= Y0 - 3 && y <= Y0 + 1 && Math.abs(x - meio + 0.5) <= 6.5 - (y === Y0 - 3 ? 1 : 0), "C", (x, y) => (y === Y0 + 1 ? "1" : "0"));
      k.pinta((x, y, v) => (v[0] === "C" && x % 4 === 0 ? "Z" + (y === Y0 + 1 ? "1" : "0") : null));
      const tx = costas ? -99 : meio - 4;
      if (!costas) k.forma((x, y) => y > Y0 + 1 && y <= Y0 + 7 && x >= tx && x <= tx + 2, "C", (x, y) => (y >= Y0 + 6 ? "1" : x === tx ? "1" : "0"));
      k.pinta((x, y, v) => (y === Y0 + 7 && x % 2 === 0 ? "Z0" : y === Y0 + 4 && v[0] === "C" ? "Z0" : null));
      compor(base, k, true, null, 1);
    }
    if (pesc === "corrente" && !costas) {
      const k = camada();
      for (let i = 0; i <= 4; i++) { k.set(meio - 5 + i, Y0 + i, i % 2 ? "K1" : "K0"); k.set(meio + 4 - i, Y0 + i, i % 2 ? "K1" : "K0"); }
      k.ret(meio - 1, Y0 + 5, meio, Y0 + 7, "K0"); k.set(meio, Y0 + 5, "K2");
      compor(base, k, false);
    }
    if (costas && costasIt === "capa") {
      const k = camada();
      k.forma((x, y) => y >= Y0 - 1 && y <= YS - 2 && x >= tx0 - 2 - Math.floor((y - Y0) / 5) && x <= tx1 + 2 + Math.floor((y - Y0) / 5), "C", (x, y) => { const a = tx0 - 2 - Math.floor((y - Y0) / 5), b = tx1 + 2 + Math.floor((y - Y0) / 5); return y >= YS - 3 || x >= b - 1 ? "1" : x <= a + 1 ? "2" : (x - meio) % 6 === 0 && y > Y0 + 6 ? "1" : "0"; });
      k.ret(meio - 7, Y0 - 1, meio + 6, Y0, "C1");
      compor(base, k);
    }
    braco(braco2, passo[2], true);

    // ===== 5. cabelo comprido por cima das costas =====
    if (costas && cabeloLongo && !["afro", "rabo", "tranca", "chiquinha"].includes(cab)) compor(base, cabeloAtras());

    // ===== 6. cabeça =====
    const cb = camada();
    cb.forma((x, y) => naCabeca(x, y), "S", (x, y) => {
      const nx = (x - CX) / RX, ny = (y - CY) / RY;
      if (ny > 0.78) return "1";
      if (costas ? nx > 0.62 : nx < -0.62) return "1";
      if (!costas && nx > 0.15 && ny < -0.55) return "2";
      return "0";
    });
    if (!costas) { cb.ret(41, CY + 2, 41, CY + 3, "S0"); cb.set(40, CY + 4, "S1"); }
    compor(base, cb);
    const orelha = () => { const o = camada(), ox = costas ? CX + 7 : CX - 7; o.elipse(ox, CY + 2, 2, 2.8, "S", "0"); o.set(ox, CY + 2, "S1"); o.set(ox, CY + 3, "S1"); o.set(ox + (costas ? -1 : 1), CY + 1, "S1"); compor(base, o); };
    const orelhaVisivel = !["longo", "chanel", "cacheado", "afro"].includes(cab);
    if (!costas) orelha();

    // ===== 7. rosto =====
    const B = base;
    if (!costas) {
      const [xl, xn] = OLHO;
      const aberto = (x) => { B.ret(x, EY, x + 2, EY, "E0"); for (let y = EY + 1; y <= EY + 3; y++) { B.set(x, y, "W0"); B.set(x + 1, y, "I0"); B.set(x + 2, y, "E0"); } B.set(x + 1, EY + 1, "W0"); };
      const fechado = (x) => B.ret(x, EY + 2, x + 2, EY + 2, "E0");
      const feliz = (x) => { B.set(x, EY + 2, "E0"); B.set(x + 1, EY + 1, "E0"); B.set(x + 2, EY + 2, "E0"); };
      [xl, xn].forEach((x, i) => {
        if (piscar || rs === "sono" || (rs === "piscando" && i === 1)) { fechado(x); if (rs === "sono") B.set(x + 1, EY + 3, "S1"); }
        else if (rs === "feliz" || rs === "lingua") feliz(x);
        else if (rs === "surpreso") { B.ret(x, EY - 1, x + 2, EY - 1, "E0"); B.ret(x, EY, x + 2, EY + 3, "W0"); B.set(x + 1, EY + 1, "E0"); B.set(x + 1, EY + 2, "E0"); }
        else if (rs === "mal") { B.ret(x, EY + 1, x + 2, EY + 1, "E0"); for (let y = EY + 2; y <= EY + 3; y++) { B.set(x, y, "W0"); B.set(x + 1, y, "I0"); B.set(x + 2, y, "E0"); } }
        else aberto(x);
        // cílios no feminino
        if (fem && !(rs === "mal")) { const y = rs === "surpreso" ? EY - 2 : (piscar || rs === "sono" || rs === "feliz" || rs === "lingua" || (rs === "piscando" && i === 1)) ? EY + 1 : EY - 1; B.set(i === 0 ? x - 1 : x + 3, y, "E0"); }
        if (fem && rs === "mal") B.set(i === 0 ? x - 1 : x + 3, EY, "E0");
      });
      // sobrancelhas
      const sb = "H3";
      if (rs === "mal") { B.set(27, EY - 3, sb); B.set(28, EY - 3, sb); B.set(29, EY - 2, sb); B.set(30, EY - 1, sb); B.set(29, EY - 3, sb); B.set(34, EY - 1, sb); B.set(35, EY - 2, sb); B.set(36, EY - 3, sb); B.set(37, EY - 3, sb); B.set(35, EY - 3, sb); }
      else if (rs === "surpreso") { B.ret(28, EY - 4, 30, EY - 4, sb); B.ret(34, EY - 4, 36, EY - 4, sb); }
      else if (rs === "sono") { B.set(28, EY - 1, sb); B.set(29, EY - 2, sb); B.set(30, EY - 2, sb); B.set(34, EY - 2, sb); B.set(35, EY - 2, sb); B.set(36, EY - 1, sb); }
      else { B.ret(28, EY - 2, 30, EY - 2, sb); B.ret(34, EY - 2, 36, EY - 2, sb); if (fem) { B.set(31, EY - 2, null); } }
      // bochechas
      if (rs === "feliz" || rs === "piscando" || rs === "lingua" || fem) { B.set(27, CY + 3, "m0"); B.set(37, CY + 3, "m0"); B.set(38, CY + 3, "m0"); }
      // boca
      const L0 = fem ? "r0" : "M0";
      if (rs === "feliz") { B.set(31, MY - 1, "M0"); B.ret(32, MY, 34, MY, "W0"); B.set(31, MY, "M0"); B.set(35, MY - 1, "M0"); B.set(35, MY, "M0"); B.ret(32, MY + 1, 34, MY + 1, "M0"); }
      else if (rs === "lingua") { B.set(31, MY - 1, "M0"); B.ret(32, MY, 34, MY, "M0"); B.set(35, MY - 1, "M0"); B.ret(33, MY + 1, 34, MY + 1, "k0"); B.set(33, MY + 2, "m0"); B.set(34, MY + 2, "k0"); }
      else if (rs === "mal") { B.ret(32, MY, 35, MY, "M0"); B.set(31, MY + 1, "M0"); B.set(32, MY - 1, "W0"); B.set(34, MY - 1, "W0"); B.set(33, MY - 1, "M0"); }
      else if (rs === "surpreso") { B.ret(32, MY - 1, 33, MY - 1, "M0"); B.set(31, MY, "M0"); B.set(34, MY, "M0"); B.ret(32, MY + 1, 33, MY + 1, "M0"); B.ret(32, MY, 33, MY, "k0"); }
      else if (rs === "sono") { B.ret(32, MY, 34, MY, "M0"); B.set(33, MY + 1, "M0"); }
      else if (rs === "piscando") { B.set(31, MY - 1, "M0"); B.ret(32, MY, 34, MY, L0); B.set(35, MY - 1, "M0"); B.set(35, MY - 2, "M0"); }
      else { B.ret(32, MY, 34, MY, L0); B.set(35, MY - 1, L0); if (fem) B.ret(32, MY + 1, 33, MY + 1, "m0"); }
    }

    // ===== 8. cabelo da frente =====
    const h = camada();
    const tomCab = (x, y) => { const nx = (x - CX) / RX, ny = (y - CY) / RY; let k = tomDe(nx, ny); if (y >= CY - RY - 1 && y <= CY - RY + 1 && x >= CX - 2 && x <= CX + 6) k = "2"; if ((x * 7 + y * 3) % 23 === 0 && k === "0") k = "1"; return k; };
    const topo = (x, y) => naCabeca(x, y, 1.6) && y <= CY - 6;
    const nuca = (x, y, lim) => naCabeca(x, y, 1.4) && x <= CX - 9 && y <= lim;
    if (costas) {
      const lim = { degrade: CY - 1, lateral: CY + 6, chiquinha: CY + 6, curto: CY + 4, topete: CY + 4, espetado: CY + 4, franja: CY + 6, chanel: CY + 9, longo: CY + 9, rabo: CY + 6, coque: CY + 6, tranca: CY + 6, cacheado: CY + 9, afro: CY + 8 }[cab];
      if (lim) h.forma((x, y) => naCabeca(x, y, cab === "degrade" ? 1 : 1.6) && y <= lim && (cab !== "degrade" || y <= CY - 5 || (x + y) % 2 === 0), "H", tomCab);
      if (cab === "rabo") { h.ret(CX - 2, CY + 1, CX + 2, CY + 2, "R0"); }
      if (cab === "tranca") h.ret(CX - 1, CY + 2, CX + 1, CY + 3, "H1");
    } else if (cab !== "careca" && cab !== "moicano") {
      const liso = ["rabo", "chiquinha", "coque", "tranca", "longo"].includes(cab);
      h.forma((x, y) => {
        if (cab === "degrade") return (naCabeca(x, y, 1) && y <= CY - 7) || (naCabeca(x, y, 1) && x <= CX - 4 && y <= CY + 1 && (y <= CY - 5 || (x + y) % 2 === 0));
        if (topo(x, y)) return true;
        if (nuca(x, y, ["longo", "chanel", "cacheado", "afro"].includes(cab) ? CY + 7 : CY + 3)) return true;
        if (naCabeca(x, y, 1.4) && x <= CX - 5 && y <= (["longo", "chanel", "cacheado", "afro"].includes(cab) ? CY + 7 : CY - 2)) return true;
        if (x >= CX - 4 && x <= CX - 3 && y <= CY + 2 && naCabeca(x, y)) return !["rabo", "chiquinha", "coque", "tranca"].includes(cab) || y <= CY - 1;   // costeleta
        if (!naCabeca(x, y, 1.6)) return false;
        if (cab === "lateral") return y <= Math.min(CY + 1, CY - 4 + Math.floor(Math.max(0, x - CX + 2) / 1.6));
        if (cab === "franja" || cab === "chanel") return y <= CY - 3 - (cab === "franja" ? Math.floor(Math.max(0, x - CX - 2) / 4) : 0) + (cab === "franja" && x < CX + 2 ? 1 : 0);
        if (liso) return y === CY - 5 && x >= CX - 4 && x <= CX + 4;
        if (cab === "cacheado" || cab === "afro") return y <= CY - 4 && (x % 3 !== 0 || y <= CY - 5);
        // curto / topete / espetado: franja picotada
        if (y === CY - 5) return x % 4 !== 0;
        if (y === CY - 4) return x % 4 === 1 && x > CX - 3;
        return false;
      }, "H", tomCab);
      if (cab === "chanel") h.forma((x, y) => x >= CX + 11 && x <= CX + 14 && y >= CY - 6 && y <= CY + 6 && naCabeca(x, y, 1.8) && !naCabeca(x - 2, y), "H", () => "1");
      if (cab === "longo") h.forma((x, y) => x >= CX + 10 && x <= CX + 14 && y >= CY - 6 && y <= CY + 9 && !naCabeca(x - 1, y) && naCabeca(x - 2, Math.min(y, CY + 4), 2.6), "H", () => "1");
      if (liso) { for (let x = CX - 4; x <= CX + 6; x += 3) h.set(x, CY - 9, "H1"); }
      if (cab === "chiquinha") { const ox = CX + 14; for (let k = 0; k <= 13; k++) { const hw = 3 - Math.abs(k - 5) * 0.2; h.elipse(ox + Math.round(k / 6), CY - 3 + k, Math.max(1.3, hw), 1.2, "H", k % 4 === 1 ? "1" : k % 4 === 3 ? "2" : null); } h.ret(ox - 1, CY - 4, ox + 1, CY - 3, "R0"); }
    }
    if (!costas || ["topete", "espetado", "moicano", "coque"].includes(cab)) {
      if (cab === "topete") { h.elipse(CX + 4, CY - RY - 2, 9, 4.2, "H"); h.elipse(CX + 11, CY - RY - 1, 3.5, 2.6, "H"); h.set(CX + 13, CY - RY + 1, "H1"); }
      if (cab === "espetado") for (const [sx, alt] of [[CX - 9, 5], [CX - 4, 8], [CX + 1, 9], [CX + 6, 8], [CX + 10, 5]]) for (let k = 0; k <= alt; k++) { const hw = Math.round((alt - k) / alt * 2.4); for (let x = sx - hw; x <= sx + hw; x++) h.set(x - Math.round(k / 3), CY - RY + 2 - k, "H" + (x > sx ? "1" : k > alt - 2 ? "2" : "0")); }
      if (cab === "coque") { h.elipse(CX - 6, CY - RY - 3, 5.5, 4.5, "H"); h.ret(CX - 8, CY - RY + 1, CX - 4, CY - RY + 1, "R0"); }
      if (cab === "moicano") {
        for (let x = CX - 9; x <= CX + 8; x++) { const base0 = CY - RY + 1 + Math.round(Math.pow((x - CX) / 11, 2) * 4); const alto = base0 - 7 - ((x + 40) % 3 === 0 ? 2 : 0); for (let y = alto; y <= base0 + 1; y++) h.set(x, y, "H" + (y < alto + 2 ? "2" : x > CX + 4 ? "1" : "0")); }
        if (!costas) base.pinta((x, y, k) => (k === "S0" && naCabeca(x, y) && y < CY - 4 && (x + y) % 3 === 0 ? "S1" : null));
      }
    }
    if (cab === "careca") { base.set(CX - 4, CY - 9, "S2"); base.set(CX - 3, CY - 9, "S2"); base.set(CX - 5, CY - 8, "S2"); }
    if (cab === "afro" || cab === "cacheado") h.pinta((x, y, k) => ((x * 7 + y * 13) % 9 === 0 ? "H2" : (x * 3 + y * 5) % 7 === 0 ? "H1" : null));
    compor(base, h, true, null, 1);
    if (costas && (cab === "rabo" || cab === "tranca" || cab === "chiquinha")) compor(base, cabeloAtras());
    if (cab === "rabo" && !costas) base.ret(CX - 8, CY - 3, CX - 7, CY - 1, "R0");

    // ===== 9. óculos (só de frente) =====
    const r2 = av.rosto2;
    if (!costas && (r2 === "oculos" || r2 === "escuros")) {
      const g = camada();
      for (const x0 of [27, 33]) { g.ret(x0, EY - 1, x0 + 4, EY - 1, "G0"); g.ret(x0, EY + 3, x0 + 4, EY + 3, "G0"); g.ret(x0, EY - 1, x0, EY + 3, "G0"); g.ret(x0 + 4, EY - 1, x0 + 4, EY + 3, "G0"); if (r2 === "escuros") { g.ret(x0 + 1, EY, x0 + 3, EY + 2, "L1"); g.set(x0 + 1, EY, "L2"); g.set(x0 + 2, EY, "L2"); } }
      g.ret(18, EY, 26, EY, "G0");
      compor(base, g, false);
    }
    if (!costas && r2 === "visor") { const g = camada(); g.ret(19, EY - 1, 41, EY + 3, "N1"); g.ret(20, EY, 40, EY + 2, "N0"); g.ret(22, EY, 26, EY, "Z0"); compor(base, g); }

    // ===== 10. chapéus =====
    const ch = av.chapeu, c = camada();
    const cupula = (ymax, mat, listras, folga) => c.forma((x, y) => y <= ymax && naCabeca(x, y, folga || 2), mat, (x, y) => (listras && y % 2 ? "1" : tomDe((x - CX) / RX, (y - CY) / RY)));
    if (ch === "bone") {
      cupula(CY - 5, "C"); c.forma((x, y) => y >= CY - 6 && y <= CY - 5 && naCabeca(x, y, 2), "C", () => "1");
      if (!costas) { c.ret(CX + 5, CY - 6, CX + 19, CY - 4, "C1"); c.ret(CX + 6, CY - 7, CX + 18, CY - 7, "C0"); }
      else c.ret(CX + 8, CY - 9, CX + 16, CY - 8, "C1");
      c.set(CX, CY - RY - 2, "C2"); c.set(CX + 1, CY - RY - 2, "C2");
    }
    if (ch === "gorro") { cupula(CY - 5, "C", true, 2.2); c.forma((x, y) => y >= CY - 6 && y <= CY - 3 && naCabeca(x, y, 2.4), "Z", (x, y) => (x % 2 ? "1" : "0")); c.elipse(CX - 1, CY - RY - 5, 3, 3, "Z"); }
    if (ch === "faixa") { c.forma((x, y) => y >= CY - 8 && y <= CY - 6 && naCabeca(x, y, 1.8), "C", (x, y) => (y === CY - 6 ? "1" : "0")); const ox = costas ? 41 : 9; const s = costas ? 1 : -1; for (let k = 0; k < 6; k++) { c.set(ox + s * k * 0.6 + (costas ? -2 : 4), CY - 7 + Math.floor(k / 2), "C0"); c.set(ox + s * k * 0.6 + (costas ? -2 : 4), CY - 6 + Math.floor(k / 2), "C1"); } }
    if (ch === "fone") {
      for (let x = CX - 12; x <= CX + 12; x++) { const y = Math.round(CY - RY - 2 - 2 * Math.sin(Math.PI * (x - CX + 12) / 24) + (costas ? 0 : 0)); c.set(x, y, "D0"); c.set(x, y + 1, "D1"); }
      const ox = costas ? 38 : 16; c.elipse(ox, CY + 1, 3.5, 4.8, "D", "0"); c.ret(ox - 1, CY - 2, ox + 1, CY + 3, "k0"); c.forma((x, y) => Math.abs(x - ox) <= 1 && y >= CY - RY + 1 && y < CY - 3, "D", () => "1");
    }
    if (ch === "cowboy") { c.elipse(CX, CY - 12, 10, 7, "Q", null, (x, y) => y <= CY - 8); c.ret(CX - 2, CY - 19, CX + 2, CY - 18, "Q1"); c.ret(CX - 9, CY - 9, CX + 9, CY - 8, "D0"); c.elipse(CX + 1, CY - 7, 21, 3.4, "Q"); }
    if (ch === "cartola") { c.forma((x, y) => y >= 1 && y <= CY - 9 && Math.abs(x - CX) <= 10, "D", (x, y) => (x >= CX + 8 ? "1" : x <= CX - 8 ? "2" : "0")); c.ret(CX - 10, CY - 13, CX + 10, CY - 11, "R0"); c.ret(CX - 15, CY - 8, CX + 15, CY - 6, "D1"); c.ret(CX - 14, CY - 8, CX + 14, CY - 8, "D0"); }
    if (ch === "mago") { for (let k = 0; k <= 22; k++) { const hw = Math.max(1, (22 - k) * 0.55); const cx2 = CX + 1 - k * 0.25; for (let x = Math.round(cx2 - hw); x <= Math.round(cx2 + hw); x++) c.set(x, CY - 7 - k, "A" + (x > cx2 + 1 ? "1" : "0")); } c.elipse(CX, CY - 6, 20, 3.2, "A", "1"); [[CX + 1, CY - 13], [CX - 2, CY - 19], [CX - 3, CY - 25]].forEach(([x, y]) => { c.set(x, y, "K0"); c.set(x - 1, y, "K1"); c.set(x + 1, y, "K1"); c.set(x, y - 1, "K1"); c.set(x, y + 1, "K1"); }); }
    if (ch === "coroa") { c.ret(CX - 11, CY - 12, CX + 11, CY - 8, "K0"); c.ret(CX - 11, CY - 8, CX + 11, CY - 8, "K1"); for (const sx of [CX - 11, CX - 6, CX, CX + 6, CX + 11]) for (let k = 0; k <= 4; k++) for (let x = sx - (k < 2 ? 1 : 0); x <= sx + (k < 2 ? 1 : 0); x++) c.set(x, CY - 13 - k, "K" + (k === 4 ? "2" : "0")); [[CX - 6, "k0"], [CX, "j0"], [CX + 6, "k0"]].forEach(([x, k]) => c.ret(x - 1, CY - 11, x, CY - 10, k)); }
    if (ch === "laco") { const lx = costas ? CX - 4 : CX + 2; c.elipse(lx - 5, CY - RY - 2, 4.5, 3.4, "C"); c.elipse(lx + 5, CY - RY - 2, 4.5, 3.4, "C"); c.ret(lx - 1, CY - RY - 4, lx + 1, CY - RY, "C1"); c.set(lx - 5, CY - RY - 2, "C1"); c.set(lx + 5, CY - RY - 2, "C1"); }
    if (ch === "bonetras") {
      cupula(CY - 5, "C"); c.forma((x, y) => y >= CY - 6 && y <= CY - 5 && naCabeca(x, y, 2), "C", () => "1");
      c.ret(CX - 20, CY - 6, CX - 8, CY - 4, "C1"); c.ret(CX - 19, CY - 7, CX - 9, CY - 7, "C0");
      if (costas) { c.ret(CX - 2, CY - 9, CX + 2, CY - 7, "S1"); c.ret(CX - 2, CY - 9, CX + 2, CY - 9, "C1"); }
      c.set(CX, CY - RY - 2, "C2"); c.set(CX + 1, CY - RY - 2, "C2");
    }
    if (ch === "bandana") {
      cupula(CY - 6, "C", false, 1.8);
      c.pinta((x, y, v) => (v[0] === "C" && (x + y) % 4 === 0 && x % 2 === 0 ? "Z0" : null));
      const ox = costas ? CX : CX - 13;
      c.elipse(ox, CY - 5, 2.4, 2, "C", "1");
      for (let k = 1; k <= 7; k++) { c.set(ox - 1 - Math.floor(k / 3), CY - 4 + k, "C0"); c.set(ox + 1 + Math.floor(k / 4), CY - 4 + k, "C1"); }
    }
    if (ch === "gatinho") {
      c.forma((x, y) => y >= CY - 10 && y <= CY - 9 && naCabeca(x, y, 1.8) && !naCabeca(x, y + 2, 1.8), "C", () => "1");
      for (const sx of [CX - 7, CX + 6]) for (let k = 0; k <= 7; k++) { const hw = Math.round((7 - k) * 0.55); for (let x = sx - hw; x <= sx + hw; x++) c.set(x, CY - RY - k, k >= 1 && k <= 4 && Math.abs(x - sx) <= hw - 2 ? "m0" : "C" + (x > sx ? "1" : "0")); }
    }
    if (ch === "chifres") {
      for (const [sx, s] of [[CX - 7, -1], [CX + 6, 1]]) for (let k = 0; k <= 6; k++) { const hw = Math.round((6 - k) / 2.6); const cx2 = sx + s * Math.round(k / 3); for (let x = cx2 - hw; x <= cx2 + hw; x++) c.set(x, CY - RY + 1 - k, "R" + (k >= 5 ? "2" : x > cx2 ? "1" : "0")); }
    }
    if (ch === "aureola") {
      c.forma((x, y) => { const nx = (x - CX) / 10.5, ny = (y - (CY - RY - 7)) / 2.8; const d = nx * nx + ny * ny; return d <= 1 && d >= 0.42; }, "K", (x, y) => (y > CY - RY - 7 ? "1" : "2"));
    }
    compor(base, c, true, null, 1);

    return base.p;
  }

  // ---------------- pose sentada ----------------
  // Usa o boneco em pé, abaixa a parte de cima e desenha as pernas dobradas
  // para a frente (para a direita da grade; o espelho cuida do outro lado).
  const DESCE = 4;    // quanto o quadril desce ao sentar
  function gradeSentada(emPe, av) {
    const base = camada(), fem = av.sexo === "f";
    const tx0 = fem ? 18 : 17, tx1 = fem ? 37 : 38, quadril = YL + DESCE;
    const curta = av.calca === "shorts" || av.calca === "saia" || av.roupa === "vestido";
    const pernaM = (x, y) => (curta && x > tx0 + 6) || (av.calca === "bermuda" && x > tx1 + 2 && y > quadril + 8) ? "S" : "P";
    const perna = (dx, dy, frente) => {
      const c = camada(), t0 = frente ? "0" : "1";
      // coxa (na horizontal) e canela (na vertical)
      for (let y = quadril + 1 + dy; y <= quadril + 5 + dy; y++) for (let x = tx0 + 1 + dx; x <= tx1 + 6 + dx; x++) c.set(x, y, pernaM(x, y) + (y === quadril + 1 + dy && frente ? "2" : y === quadril + 5 + dy ? "1" : t0));
      for (let y = quadril + 5 + dy; y <= YS - 1 + dy; y++) for (let x = tx1 + 2 + dx; x <= tx1 + 6 + dx; x++) c.set(x, y, pernaM(x, y) + (x === tx1 + 2 + dx ? "1" : t0));
      // calçado apontando para a frente
      const a = tx1 + 1 + dx, b = tx1 + 10 + dx, y0 = YS + dy;
      c.ret(a, y0, b - 2, y0 + 2, "B" + t0); c.ret(a, y0 + 2, b, y0 + 3, "B" + t0); c.set(b - 1, y0 + 1, "B2");
      if (av.calcado === "tenis" || av.calcado === "cano") c.ret(a, y0 + 4, b, y0 + 4, "Z" + t0); else c.ret(a, y0 + 4, b, y0 + 4, "B1");
      compor(base, c);
    };
    perna(-2, -2, false);
    perna(0, 0, true);
    const lim = curta ? YL + 6 : YL + 3;
    for (let y = 0; y <= lim; y++) for (let x = 0; x < W; x++) { const v = emPe[y][x]; if (v && y + DESCE < H) base.p[y + DESCE][x] = v; }
    return base.p;
  }

  // ---------------- sprite (cache) ----------------
  // pose: "" (em pé) ou "sentado"
  const cache = new Map();
  function sprite(avBruto, dir, quadro, piscar, pose) {
    const av = normalizar(avBruto);
    dir = dir || 0; quadro = quadro || 0; pose = pose || "";
    const chave = JSON.stringify(av) + "|" + dir + "|" + quadro + "|" + (piscar ? 1 : 0) + "|" + pose;
    if (cache.has(chave)) return cache.get(chave);
    const costas = dir === 2 || dir === 3, espelho = dir === 1 || dir === 2;
    let g = desenharGrade(av, costas, pose === "sentado" ? 0 : quadro, piscar);
    if (pose === "sentado") g = gradeSentada(g, av);
    const C = cores(av);
    const c = document.createElement("canvas"); c.width = W; c.height = H;
    const ctx = c.getContext("2d");
    for (let r = 0; r < H; r++) for (let k = 0; k < W; k++) {
      const v = g[r][k]; if (!v) continue;
      ctx.fillStyle = C[v] || "#ff00ff"; ctx.fillRect(espelho ? W - 1 - k : k, r, 1, 1);
    }
    if (cache.size > 600) cache.clear();
    cache.set(chave, c);
    return c;
  }

  // Desenha num <canvas>. opc = { dir, quadro, piscar, retrato (só cabeça e ombros) }
  const ALT_RETRATO = 58;
  function desenhar(canvas, av, escala, comFundo, opc) {
    opc = opc || {};
    const e = escala || 2, s = sprite(av, opc.dir || 0, opc.quadro || 0, opc.piscar, opc.pose);
    const alt = opc.retrato ? ALT_RETRATO : H;
    canvas.width = Math.round(W * e); canvas.height = Math.round(alt * e);
    const ctx = canvas.getContext("2d"); ctx.imageSmoothingEnabled = false;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (comFundo !== false) {
      const f = PALETA.fundo[normalizar(av).fundo] ?? PALETA.fundo[0];
      ctx.fillStyle = f; ctx.fillRect(0, 0, canvas.width, canvas.height);
      if (!opc.retrato) { ctx.fillStyle = tom(f, 1.18); ctx.beginPath(); ctx.ellipse(canvas.width / 2, (YS + 5) * e, 15 * e, 4 * e, 0, 0, 7); ctx.fill(); }
    }
    ctx.drawImage(s, 0, 0, W, alt, 0, 0, canvas.width, canvas.height);
  }

  // Avatar animado (pisca e pode andar sem sair do lugar). Devolve função para parar.
  function animar(canvas, getAvatar, escala, comFundo, getOpc) {
    let t = 0, vivo = true;
    const passo = () => {
      if (!vivo || !canvas.isConnected && t > 2) return;
      t++;
      const o = Object.assign({}, getOpc ? getOpc() : {});
      if (o.andando) o.quadro = [1, 0, 2, 0][t % 4];
      o.piscar = (t % 16) === 0;
      desenhar(canvas, getAvatar(), escala, comFundo, o);
      setTimeout(passo, 180);
    };
    passo();
    return () => { vivo = false; };
  }

  function aleatorio(sexo) {
    const pick = a => a[Math.floor(Math.random() * a.length)], idx = a => Math.floor(Math.random() * a.length);
    const sx = sexo || pick(["m", "f"]);
    const cab = sx === "f" ? ["franja", "lateral", "chanel", "longo", "rabo", "chiquinha", "coque", "tranca", "cacheado", "afro"] : ["curto", "degrade", "topete", "espetado", "moicano", "lateral", "afro", "cacheado", "careca"];
    const rp = sx === "f" ? ["camiseta", "estampa", "time", "listrada", "polo", "moletom", "jaqueta", "jardineira", "regata", "vestido", "xadrez"] : ["camiseta", "estampa", "time", "listrada", "polo", "xadrez", "moletom", "jaqueta", "social", "jardineira", "regata"];
    const cl = sx === "f" ? ["calca", "rasgada", "shorts", "saia"] : ["calca", "rasgada", "bermuda", "shorts"];
    const cd = sx === "f" ? ["tenis", "cano", "bota", "sapatilha", "chinelo"] : ["tenis", "cano", "bota", "chinelo"];
    return normalizar({
      sexo: sx, pele: idx(PALETA.pele), cabelo: pick(cab), corCabelo: idx(PALETA.cabelo),
      rosto: pick(ESTILOS.rosto), corOlhos: idx(PALETA.olhos), roupa: pick(rp), corRoupa: idx(PALETA.roupa), corRoupa2: idx(PALETA.roupa),
      calca: pick(cl), corCalca: idx(PALETA.calca), calcado: pick(cd), corCalcado: idx(PALETA.calcado), fundo: idx(PALETA.fundo)
    });
  }

  // ---------------- 8 direções ----------------
  // O motor do quarto trabalha com 8 direções (como nos hotéis isométricos):
  //   0 = ↗ (grade y-1)   1 = → (x+1, y-1)   2 = ↘ (x+1)   3 = ↓ (x+1, y+1)
  //   4 = ↙ (grade y+1)   5 = ← (x-1, y+1)   6 = ↖ (x-1)   7 = ↑ (x-1, y-1)
  // O desenho por código tem 4 ângulos (as diagonais da tela). As direções
  // "retas" (1, 3, 5 e 7) usam o ângulo mais próximo, mantendo o lado anterior.
  // Para trocar por spritesheet, basta substituir esta função.
  const DIR8_PARA_4 = { 0: [3], 1: [0, 3], 2: [0], 3: [0, 1], 4: [1], 5: [1, 2], 6: [2], 7: [2, 3] };
  function vista(dir8, anterior) { const op = DIR8_PARA_4[dir8 & 7]; return op.includes(anterior) ? anterior : op[0]; }
  function direcao8(dx, dy) {
    const sx = Math.sign(dx), sy = Math.sign(dy);
    return { "0,-1": 0, "1,-1": 1, "1,0": 2, "1,1": 3, "0,1": 4, "-1,1": 5, "-1,0": 6, "-1,-1": 7 }[sx + "," + sy] ?? 2;
  }

  // altura do quadril do boneco sentado, medida do chão (em pixels do desenho do quarto, que é a metade)
  const ASSENTO = (YS + 5 - (YL + DESCE)) / 2;

  window.AVATAR = { SLOTS, vista, direcao8, DESCE, ASSENTO, desenhar, sprite, animar, normalizar, aleatorio, PALETA, ESTILOS, NOMES, ITENS, PADRAO, tom, LARGURA: W, ALTURA: H, PES: YS + 5 };
})();
