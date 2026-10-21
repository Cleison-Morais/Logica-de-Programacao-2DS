// ============================================================
//  CENÁRIOS EM PIXEL ART (desenhados por código)
//  pintarCenario(canvas, tema, largura, altura, pontosDoCaminho)
//  Temas: floresta, praia, deserto, neve, caverna, cidade, circuito
// ============================================================
(function () {
  function rng(seed) { let s = seed >>> 0; return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; }; }
  function distSeg(px, py, ax, ay, bx, by) {
    const dx = bx - ax, dy = by - ay, l = dx * dx + dy * dy;
    let t = l ? ((px - ax) * dx + (py - ay) * dy) / l : 0; t = Math.max(0, Math.min(1, t));
    return Math.hypot(px - ax - t * dx, py - ay - t * dy);
  }
  const SEMENTE = { floresta: 11, praia: 23, deserto: 37, neve: 41, caverna: 53, cidade: 67, circuito: 79 };

  function pintarCenario(cv, tema, W, H, ptsBrutos, semCaminho) {
    const P = 4, w = Math.ceil(W / P), h = Math.ceil(H / P);
    const low = document.createElement("canvas"); low.width = w; low.height = h;
    const c = low.getContext("2d"), R = rng((SEMENTE[tema] || 5) * 7919 + w);
    const pts = (ptsBrutos || []).map(([x, y]) => [x / P, y / P]);
    const dist = (x, y) => { if (semCaminho || pts.length < 2) return 999; let d = 1e9; for (let i = 1; i < pts.length; i++) d = Math.min(d, distSeg(x, y, pts[i - 1][0], pts[i - 1][1], pts[i][0], pts[i][1])); return d; };
    const D = []; for (let y = 0; y < h; y++) { D[y] = new Float32Array(w); for (let x = 0; x < w; x++) D[y][x] = dist(x, y); }
    const px = (x, y, cor) => { x = Math.round(x); y = Math.round(y); if (x < 0 || y < 0 || x >= w || y >= h) return; c.fillStyle = cor; c.fillRect(x, y, 1, 1); };
    const ret = (x, y, ww, hh, cor) => { c.fillStyle = cor; c.fillRect(Math.round(x), Math.round(y), ww, hh); };
    const disco = (cx, cy, r, cor) => { c.fillStyle = cor; for (let y = -r; y <= r; y++) for (let x = -r; x <= r; x++) if (x * x + y * y <= r * r + r * 0.6) c.fillRect(Math.round(cx + x), Math.round(cy + y), 1, 1); };
    const longe = (x, y, d) => x >= 0 && y >= 0 && x < w && y < h && D[Math.floor(y)][Math.floor(x)] > d;
    const chao = (cores, peso) => { for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) px(x, y, cores[R() < (peso || 0.12) ? 2 + (R() * (cores.length - 2) | 0) : (R() * 2 | 0)]); };
    const caminho = (borda, miolo, extra) => { for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) { const d = D[y][x]; if (d < 9.5) px(x, y, d > 8.3 ? borda : (extra ? extra(x, y, d) : miolo[R() < 0.5 ? 0 : 1])); } };
    const espalhar = (n, dmin, fn, dmax) => { for (let k = 0; k < n; k++) { const x = R() * w, y = R() * h; if (longe(x, y, dmin) && (!dmax || !longe(x, y, dmax))) fn(x, y); } };
    const objetos = (n, raio, dmin, desenha) => {
      const lista = [];
      for (let k = 0; k < n * 8 && lista.length < n; k++) { const x = R() * w, y = R() * h, r = raio(); if (longe(x, y, r + dmin) && !lista.some(a => Math.hypot(a.x - x, a.y - y) < (a.r + r) * 0.95)) lista.push({ x, y, r }); }
      lista.sort((a, b) => a.y - b.y).forEach(o => desenha(o.x, o.y, o.r));
    };
    const area = w * h;

    if (tema === "floresta") {
      chao(["#5cb83c", "#63c043", "#56ad37", "#6bc84a"]);
      caminho("#9c6a3c", ["#dcaa6e", "#d6a165"]);
      espalhar(area / 260, -1, (x, y) => { if (D[y | 0][x | 0] < 7) { px(x, y, "#b88450"); px(x + 1, y, "#e9c08a"); } });
      espalhar(area / 70, 11, (x, y) => { const cor = R() < 0.5 ? "#3f8f2a" : "#8be06a"; px(x, y, cor); px(x - 1, y - 1, cor); px(x + 1, y - 1, cor); });
      const fl = ["#ff4b5c", "#ffd23f", "#4fa8ff", "#ffffff", "#ff8a3d"];
      espalhar(area / 240, 12, (x, y) => { const cor = fl[R() * fl.length | 0]; px(x - 1, y, cor); px(x + 1, y, cor); px(x, y - 1, cor); px(x, y + 1, cor); px(x, y, "#ffe680"); px(x, y + 2, "#3f8f2a"); });
      objetos(area / 650, () => 7 + (R() * 5 | 0), 16, (x, y, r) => {
        c.fillStyle = "rgba(20,60,10,.45)"; for (let i = -r; i <= r; i++) c.fillRect(Math.round(x + i), Math.round(y + r + 2), 1, 2);
        ret(x - 1, y + r - 3, 3, 6, "#6b3f1d"); ret(x - 1, y + r - 3, 1, 6, "#8a5a2e");
        disco(x, y, r, "#1f5e22"); disco(x - 1, y - 1, r - 1, "#2f7d32"); disco(x - r * 0.3, y - r * 0.3, Math.max(2, r - 4), "#45a03c"); disco(x - r * 0.4, y - r * 0.45, Math.max(1, r - 7), "#6cc855");
        for (let i = 0; i < r; i++) { const a = R() * 6.28, d = R() * r * 0.8; px(x + Math.cos(a) * d, y + Math.sin(a) * d, R() < 0.5 ? "#1f5e22" : "#58b84a"); }
      });
      espalhar(18, 13, (x, y) => { disco(x, y, 3, "#2f7d32"); disco(x - 1, y - 1, 2, "#45a03c"); px(x - 1, y - 2, "#6cc855"); }, 22);
    }
    else if (tema === "praia") {
      chao(["#f2d58a", "#ecd07e", "#f6dc96", "#e2c070"]);
      for (let y = 0; y < h; y++) { const borda = w * 0.2 + Math.sin(y / 5) * 3; for (let x = 0; x < borda + 2; x++) { if (!longe(x, y, 10)) continue; px(x, y, x > borda ? "#ffffff" : (x > borda - 3 ? "#7fe0f0" : (((x + y * 3) % 11 === 0) ? "#9fe8ff" : (x < borda * 0.5 ? "#1a8ac0" : "#2aa6d8")))); } }
      caminho("#6b4423", null, (x, y) => (y % 3 === 0 ? "#8a5a32" : "#b07a48"));
      espalhar(area / 400, 12, (x, y) => { if (x < w * 0.25) return; const cor = R() < 0.5 ? "#ff8a6a" : "#fff0e0"; px(x, y, cor); px(x + 1, y, cor); px(x, y - 1, cor); });
      objetos(area / 1200, () => 6, 14, (x, y) => {
        if (x < w * 0.25) return;
        for (let i = 0; i < 12; i++) { px(x + Math.round(Math.sin(i / 4) * 2), y + i, i % 3 ? "#8a5a2e" : "#6b3f1d"); px(x + 1 + Math.round(Math.sin(i / 4) * 2), y + i, "#a8743e"); }
        for (const [dx, dy] of [[-6, 1], [6, 1], [-4, -3], [4, -3], [0, -4]]) for (let t = 0; t <= 6; t++) px(x + dx * t / 6, y + dy * t / 6 + (t > 3 ? (t - 3) * 0.6 : 0), t % 2 ? "#2f9a3a" : "#45c04a");
        px(x - 1, y + 1, "#6b3f1d"); px(x + 1, y + 1, "#6b3f1d");
      });
    }
    else if (tema === "deserto") {
      chao(["#e8a35a", "#e0994e", "#eeb06a", "#d48a40"]);
      for (let y = 4; y < h; y += 9) for (let x = 0; x < w; x++) if (longe(x, y, 11) && Math.sin((x + y) / 5) > 0.6) px(x, y + Math.round(Math.sin(x / 6) * 2), "#cc8240");
      caminho("#9a5a26", ["#c47a3a", "#bc7234"]);
      espalhar(area / 300, 12, (x, y) => { px(x, y, "#8a7a6a"); px(x + 1, y, "#aa9a8a"); });
      objetos(area / 1100, () => 5, 14, (x, y) => {
        ret(x - 1, y - 6, 3, 12, "#2f8a3a"); ret(x - 1, y - 6, 1, 12, "#45b04e");
        ret(x - 4, y - 3, 2, 4, "#2f8a3a"); ret(x - 4, y, 3, 1, "#2f8a3a"); ret(x + 3, y - 4, 2, 4, "#2f8a3a"); ret(x + 2, y - 1, 3, 1, "#2f8a3a");
        px(x, y - 7, "#ff5fa8"); ret(x - 3, y + 6, 7, 1, "rgba(120,60,10,.4)");
      });
      objetos(area / 2400, () => 4, 14, (x, y, r) => { disco(x, y, r, "#8a6a5a"); disco(x - 1, y - 1, r - 1, "#a88a78"); });
    }
    else if (tema === "neve") {
      chao(["#eef6ff", "#e4eef8", "#dbe8f5", "#ffffff"], 0.2);
      caminho("#6a90b8", ["#c4dcf0", "#b8d4ec"]);
      espalhar(area / 200, 11, (x, y) => px(x, y, "#c8d8ea"));
      objetos(area / 700, () => 6 + (R() * 3 | 0), 15, (x, y, r) => {
        ret(x - 1, y + r - 1, 2, 3, "#5a3a20");
        for (let k = 0; k < 3; k++) { const hh = r - k; for (let i = 0; i <= hh; i++) { const yy = y - k * 4 + i - 3, hw = Math.round(i * 0.8); ret(x - hw, yy, hw * 2 + 1, 1, i < 2 ? "#ffffff" : (i % 2 ? "#1f5e3a" : "#2a7a4a")); } }
      });
      espalhar(14, 14, (x, y) => { disco(x, y + 3, 3, "#ffffff"); disco(x, y - 1, 2, "#ffffff"); px(x - 1, y - 1, "#222"); px(x + 1, y - 1, "#222"); px(x, y, "#ff7a1a"); });
    }
    else if (tema === "caverna") {
      chao(["#2a1f3a", "#30243f", "#261c33", "#3a2c4a"]);
      caminho("#3a3448", ["#5a5470", "#625c78"]);
      const cr = ["#00e5ff", "#ff5fa8", "#9b59ff"];
      objetos(area / 900, () => 4, 13, (x, y) => { const cor = cr[R() * 3 | 0]; c.fillStyle = cor + "40"; c.fillRect(x - 4, y - 7, 9, 10); for (let i = 0; i < 7; i++) { const hw = Math.round(i / 3); ret(x - hw, y - 6 + i, hw * 2 + 1, 1, i < 2 ? "#ffffff" : cor); } });
      objetos(area / 1300, () => 3, 13, (x, y) => { for (let i = 0; i < 8; i++) ret(x - Math.round(i / 3), y - 7 + i, Math.round(i / 3) * 2 + 1, 1, i % 2 ? "#4a3c5a" : "#5a4a6a"); });
      espalhar(area / 500, 11, (x, y) => { px(x, y, "#ffd23f"); px(x, y + 1, "#c8b8a8"); });
    }
    else if (tema === "cidade") {
      chao(["#1e2230", "#22263a", "#1a1e2a", "#2a2e40"]);
      objetos(area / 900, () => 6 + (R() * 4 | 0), 13, (x, y, r) => {
        const bw = r + 3, bh = r * 2;
        ret(x - bw / 2, y - bh / 2, bw, bh, ["#3a3f5a", "#4a3a5a", "#2f4a5a"][R() * 3 | 0]);
        for (let yy = 1; yy < bh - 1; yy += 2) for (let xx = 1; xx < bw - 1; xx += 2) px(x - bw / 2 + xx, y - bh / 2 + yy, R() < 0.55 ? "#ffd23f" : "#1a1e2a");
      });
      caminho("#9aa0b0", ["#3a3e4a", "#363a46"]);
      for (let i = 1; i < pts.length; i++) { const [ax, ay] = pts[i - 1], [bx, by] = pts[i], n = Math.hypot(bx - ax, by - ay); for (let s = 0; s < n; s += 4) if (s % 8 < 4) px(ax + (bx - ax) * s / n, ay + (by - ay) * s / n, "#ffd23f"); }
      espalhar(20, 11, (x, y) => { ret(x, y - 5, 1, 6, "#8a8aa0"); disco(x, y - 6, 1, "#fff2a0"); c.fillStyle = "rgba(255,240,150,.15)"; c.fillRect(x - 3, y - 3, 7, 7); }, 14);
    }
    else { // circuito
      for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) px(x, y, (x % 8 === 0 && y % 8 === 0) ? "#1b6a4a" : (R() < 0.5 ? "#0f4a33" : "#0d4430"));
      for (let k = 0; k < area / 300; k++) {
        let x = R() * w | 0, y = R() * h | 0; if (!longe(x, y, 13)) continue;
        const passos = 8 + (R() * 30 | 0); let horiz = R() < 0.5;
        for (let s = 0; s < passos; s++) { if (!longe(x, y, 12)) break; px(x, y, "#c9a23a"); px(x + (horiz ? 0 : 1), y + (horiz ? 1 : 0), "#7a5f1c"); if (horiz) x++; else y++; if (R() < 0.08) horiz = !horiz; }
        if (longe(x, y, 12)) { px(x - 1, y, "#e8c35a"); px(x + 1, y, "#e8c35a"); px(x, y - 1, "#e8c35a"); px(x, y + 1, "#e8c35a"); px(x, y, "#0b2a1e"); }
      }
      for (let k = 0; k < area / 1400; k++) {
        const cw = 10 + (R() * 10 | 0), ch = 6 + (R() * 5 | 0), x = R() * (w - cw) | 0, y = R() * (h - ch) | 0;
        if (!longe(x, y, 14) || !longe(x + cw, y + ch, 14) || !longe(x + cw, y, 14) || !longe(x, y + ch, 14)) continue;
        ret(x, y, cw, ch, "#0b0b14"); ret(x + 1, y + 1, cw - 2, 1, "#24243a");
        for (let i = 1; i < cw - 1; i += 2) { px(x + i, y - 1, "#b8b8c8"); px(x + i, y + ch, "#b8b8c8"); }
      }
      espalhar(area / 500, 12, (x, y) => { const cor = R() < 0.6 ? "#00e5ff" : "#ff2a4d"; c.fillStyle = cor + "55"; c.fillRect(x - 1, y - 1, 4, 4); ret(x, y, 2, 2, cor); });
      caminho("#1a2430", null, (x, y, d) => d > 7.3 ? "#8aa0b8" : ((x + y) % 6 === 0 ? "#556a80" : "#4a5d70"));
      for (let i = 1; i < pts.length; i++) { const [ax, ay] = pts[i - 1], [bx, by] = pts[i], n = Math.hypot(bx - ax, by - ay); for (let s = 0; s < n; s += 6) px(ax + (bx - ax) * s / n, ay + (by - ay) * s / n, "#00e5ff"); }
    }

    cv.width = W; cv.height = H;
    const g = cv.getContext("2d"); g.imageSmoothingEnabled = false; g.drawImage(low, 0, 0, w * P, h * P);
  }

  // ---------------- ícones em pixel art (SVG) ----------------
  function pixelSvg(m, cores, px) {
    const h = m.length, wd = m[0].length; let r = "";
    m.forEach((l, y) => [...l].forEach((ch, x) => { if (cores[ch]) r += `<rect x="${x}" y="${y}" width="1.02" height="1.02" fill="${cores[ch]}"/>`; }));
    return `<svg class="pxi" viewBox="0 0 ${wd} ${h}" width="${px}" height="${Math.round(px * h / wd)}" shape-rendering="crispEdges">${r}</svg>`;
  }
  const ICONE = {
    estrela: (cor, px) => pixelSvg(["....#....", "...###...", "...###...", "#########", ".#######.", "..#####..", "..##.##..", ".##...##.", "##.....##"], { "#": cor || "#00e5ff" }, px || 14),
    cadeado: (px) => pixelSvg(["..####..", ".#....#.", ".#....#.", "########", "##YYYY##", "##YkkY##", "##YkkY##", "##YYYY##", "########"], { "#": "#3a2a00", "Y": "#ffd23f", "k": "#3a2a00" }, px || 28),
    trofeu: (px) => pixelSvg(["#########", "#YYYYYYY#", "#YYYYYYY#", ".#YYYYY#.", "..#YYY#..", "...#Y#...", "...#Y#...", "..#####..", ".#######."], { "#": "#7a5a00", "Y": "#ffd23f" }, px || 24),
    livro: (px) => pixelSvg([".####..####.", "#WWWW##WWWW#", "#WLLW##WLLW#", "#WWWW##WWWW#", "#WLLW##WLLW#", "#WWWW##WWWW#", "#WLLW##WLLW#", ".####RR####.", ".....RR....."], { "#": "#b3001e", "W": "#f4ecd8", "L": "#8a8ab0", "R": "#ffd23f" }, px || 24),
    moeda: (px) => pixelSvg(["..####..", ".#YYYY#.", "#YYWYYY#", "#YWYYYY#", "#YYYYYY#", "#YYYYOY#", ".#YYOY#.", "..####.."], { "#": "#8a5a00", "Y": "#ffd23f", "W": "#fff6c0", "O": "#e0a800" }, px || 16),
    caveira: (px) => pixelSvg([".#####.", "#######", "#..#..#", "#######", ".##.##.", ".#####."], { "#": "#ffffff" }, px || 26)
  };

  // ---------------- formas do fluxograma (SVG) ----------------
  const FORMAS = {
    terminal: { nome: "Oval", uso: "Início e Fim", cor: "#ff5fa8" },
    dados:    { nome: "Paralelogramo", uso: "Entrada e saída (ler / mostrar)", cor: "#00e5ff" },
    processo: { nome: "Retângulo", uso: "Processamento (contas e ações)", cor: "#ffd23f" },
    decisao:  { nome: "Losango", uso: "Decisão (pergunta de sim ou não)", cor: "#39ff6a" }
  };
  function formaSvg(f, x, y, w, h, texto, destaque) {
    const cor = f === "?" ? "#55557a" : FORMAS[f].cor, cx = x + w / 2, cy = y + h / 2;
    let s = "";
    const st = `fill="#0b0b1f" stroke="${cor}" stroke-width="4"${f === "?" ? ' stroke-dasharray="8 6"' : ""}`;
    if (f === "terminal") s = `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${h / 2}" ${st}/>`;
    else if (f === "dados") s = `<polygon points="${x + 18},${y} ${x + w},${y} ${x + w - 18},${y + h} ${x},${y + h}" ${st}/>`;
    else if (f === "processo" || f === "?") s = `<rect x="${x}" y="${y}" width="${w}" height="${h}" ${st}/>`;
    else if (f === "decisao") s = `<polygon points="${cx},${y - 10} ${x + w + 10},${cy} ${cx},${y + h + 10} ${x - 10},${cy}" ${st}/>`;
    const t = String(texto || "");
    const tam = t.length > 20 ? 17 : 21;
    s += `<text x="${cx}" y="${cy + 6}" text-anchor="middle" font-family="VT323, monospace" font-size="${tam}" fill="${t === "?" ? "#ffd23f" : "#f4f4ff"}">${t.replace(/&/g, "&amp;").replace(/</g, "&lt;")}</text>`;
    if (destaque) s = `<g class="pisca">${s}</g>`;
    return s;
  }
  // nos = [{f, t, sim?, nao?}] (vertical; decisão abre dois caminhos que se juntam)
  function fluxogramaSvg(nos) {
    const W = 520, cx = W / 2, bw = 230, bh = 50, gap = 34;
    let y = 10, s = "", ant = null;
    const seta = (x1, y1, x2, y2) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2 - 6}" stroke="#8a8ab0" stroke-width="3"/><polygon points="${x2 - 6},${y2 - 8} ${x2 + 6},${y2 - 8} ${x2},${y2}" fill="#8a8ab0"/>`;
    for (const n of nos) {
      if (ant !== null) s += seta(cx, ant, cx, y);
      if (n.f === "decisao") {
        s += formaSvg("decisao", cx - 95, y + 10, 190, 50, n.t, n.t === "?");
        const yd = y + 35, yb = y + 100, bw2 = 190;
        const xl = cx - 140, xr = cx + 140;
        s += `<polyline points="${cx - 105},${yd} ${xl},${yd} ${xl},${yb - 6}" fill="none" stroke="#8a8ab0" stroke-width="3"/><polygon points="${xl - 6},${yb - 8} ${xl + 6},${yb - 8} ${xl},${yb}" fill="#8a8ab0"/>`;
        s += `<polyline points="${cx + 105},${yd} ${xr},${yd} ${xr},${yb - 6}" fill="none" stroke="#8a8ab0" stroke-width="3"/><polygon points="${xr - 6},${yb - 8} ${xr + 6},${yb - 8} ${xr},${yb}" fill="#8a8ab0"/>`;
        s += `<text x="${xl + 10}" y="${yd - 8}" font-family="Press Start 2P, monospace" font-size="13" fill="#39ff6a">SIM</text><text x="${xr - 62}" y="${yd - 8}" font-family="Press Start 2P, monospace" font-size="13" fill="#ff6b81">NÃO</text>`;
        s += formaSvg(n.simF || "dados", xl - bw2 / 2 + 10, yb, bw2 - 20, bh, n.sim, n.sim === "?");
        s += formaSvg(n.naoF || "dados", xr - bw2 / 2 + 10, yb, bw2 - 20, bh, n.nao, n.nao === "?");
        const yj = yb + bh + 22;
        s += `<polyline points="${xl},${yb + bh} ${xl},${yj} ${xr},${yj} ${xr},${yb + bh}" fill="none" stroke="#8a8ab0" stroke-width="3"/>`;
        ant = yj; y = yj + gap;
      } else {
        s += formaSvg(n.f, cx - bw / 2, y, bw, bh, n.t, n.t === "?" || n.f === "?");
        ant = y + bh; y += bh + gap;
      }
    }
    return `<svg class="fluxo" viewBox="0 0 ${W} ${y - gap + 12}" width="100%" style="max-width:${W}px">${s}</svg>`;
  }
  function legendaSvg() {
    let s = ""; const lin = 74;
    Object.entries(FORMAS).forEach(([k, f], i) => {
      s += formaSvg(k, 20, 14 + i * lin, 150, 46, k === "terminal" ? "Início" : k === "dados" ? "Ler nome" : k === "processo" ? "Somar" : "Nota > 6?");
      s += `<text x="200" y="${30 + i * lin}" font-family="Press Start 2P, monospace" font-size="15" fill="${f.cor}">${f.nome.toUpperCase()}</text><text x="200" y="${58 + i * lin}" font-family="VT323, monospace" font-size="26" fill="#f4f4ff">${f.uso}</text>`;
    });
    s += `<line x1="20" y1="${20 + 4 * lin}" x2="160" y2="${20 + 4 * lin}" stroke="#8a8ab0" stroke-width="3"/><polygon points="160,${14 + 4 * lin} 172,${20 + 4 * lin} 160,${26 + 4 * lin}" fill="#8a8ab0"/><text x="200" y="${14 + 4 * lin}" font-family="Press Start 2P, monospace" font-size="15" fill="#8a8ab0">SETA</text><text x="200" y="${42 + 4 * lin}" font-family="VT323, monospace" font-size="26" fill="#f4f4ff">Mostra o caminho (a ordem)</text>`;
    return `<svg class="fluxo" viewBox="0 0 560 ${4 * lin + 50}" width="100%" style="max-width:560px">${s}</svg>`;
  }
  function formaIcone(k) { return `<svg viewBox="0 0 200 76" width="170">${formaSvg(k, 20, 14, 160, 46, FORMAS[k].nome)}</svg>`; }

  window.CENARIO = { pintarCenario, ICONE, pixelSvg, FORMAS, fluxogramaSvg, legendaSvg, formaIcone };
})();
