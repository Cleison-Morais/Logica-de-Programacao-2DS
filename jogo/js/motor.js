// ============================================================
//  MOTOR DO JOGO – telas, fases, desafios e recompensas
// ============================================================
"use strict";
const $ = s => document.querySelector(s);
const CFG = window.CONFIG || {};
const { ICONE, FORMAS } = CENARIO;
const NPC = { pele: 2, cabelo: "careca", chapeu: "mago", roupa: "moletom", corRoupa: 7, corRoupa2: 4, rosto: "feliz", corCalca: 2, fundo: 3 };
const esc = s => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const sleep = ms => new Promise(r => setTimeout(r, ms));
const semAcento = s => s.normalize("NFD").replace(/[̀-ͯ]/g, "");
function fnv(str) { let h = 0x811c9dc5; for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 0x01000193) >>> 0; } return h >>> 0; }
function codigoVerif(...partes) { return "CA-" + fnv(partes.join("|") + "|codigoarcade").toString(16).toUpperCase().padStart(8, "0").slice(0, 6); }
function canvasAv(av, escala, fundo, opc) { const c = document.createElement("canvas"); AVATAR.desenhar(c, av, escala, fundo, opc); return c; }
function moldura(el) { const m = document.createElement("div"); m.className = "moldura"; m.appendChild(el); return m; }

/* ---------- destaque de código Python ---------- */
function hl(line) {
  const re = /(#.*$)|(f?"[^"]*"|'[^']*')|\b(def)\b|\b(while|if|elif|else|return|in|and|or|not|for|True|False)\b|\b(print|input|float|int|len|str)\b(?=\()|\b(\d+(?:\.\d+)?)\b|\b([a-z_][a-z0-9_]*)(?=\()/g;
  let out = "", last = 0, m;
  while ((m = re.exec(line))) {
    out += esc(line.slice(last, m.index));
    const v = esc(m[0]);
    out += m[1] ? `<span class="cm">${v}</span>` : m[2] ? `<span class="st">${v}</span>` : m[3] ? `<span class="df">${v}</span>` : m[4] ? `<span class="kw">${v}</span>` : m[5] ? `<span class="bi">${v}</span>` : m[6] ? `<span class="nm">${v}</span>` : `<span class="fn">${v}</span>`;
    last = re.lastIndex;
  }
  return out + esc(line.slice(last));
}
const hlCode = code => code.split("\n").map(hl).join("\n");

/* ---------- som 8 bits ---------- */
let som = true; try { som = localStorage.getItem("ca_som") !== "0"; } catch (e) {}
let actx = null;
function bip(notas) {
  if (!som) return;
  try {
    actx = actx || new (window.AudioContext || window.webkitAudioContext)();
    let t = actx.currentTime;
    notas.forEach(([f, d]) => { const o = actx.createOscillator(), g = actx.createGain(); o.type = "square"; o.frequency.value = f; g.gain.value = 0.05; o.connect(g); g.connect(actx.destination); o.start(t); o.stop(t + d); t += d; });
  } catch (e) {}
}
const SOM = { ok: () => bip([[660, .08], [880, .12]]), erro: () => bip([[200, .12], [150, .18]]), clique: () => bip([[520, .04]]), estrela: () => bip([[784, .1], [988, .1], [1318, .2]]), fim: () => bip([[523, .12], [659, .12], [784, .12], [1046, .3]]) };

/* =================================================================
   ESTADO
   ================================================================= */
let J = null;        // { token, aluno:{id,nome,turma_id,turma,avatar}, progresso:{faseId:{estrelas,xp}} }
let TURMAS = [];
let pararAnim = [];  // animações de avatar ativas
const TOTAL = () => FASES.length * 3;
const est = (p = J.progresso) => Object.values(p).reduce((s, f) => s + (f.estrelas || 0), 0);
const xp = (p = J.progresso) => Object.values(p).reduce((s, f) => s + (f.xp || 0), 0);
const feita = id => ((J.progresso[id] || {}).estrelas || 0) > 0;
const fasesDo = n => FASES.filter(f => f.mundo === n);
const mundoCompleto = n => fasesDo(n).length > 0 && fasesDo(n).every(f => feita(f.id));
const mundoLiberado = n => { const m = MUNDOS.find(x => x.n === n); if (!m || !m.pronto || !fasesDo(n).length) return false; const ant = MUNDOS.filter(x => x.n < n && x.pronto && fasesDo(x.n).length); return ant.every(x => mundoCompleto(x.n)); };
function liberada(f) { const lista = fasesDo(f.mundo), i = lista.indexOf(f); return mundoLiberado(f.mundo) && (i === 0 || feita(lista[i - 1].id)); }

/* =================================================================
   TELA INICIAL: ENTRAR / CRIAR CONTA
   ================================================================= */
const DOMINIO = (CFG.DOMINIO_EMAIL || "").replace(/^@/, "").toLowerCase();
(async function iniciar() {
  $("#logoNome").innerHTML = `${esc(CFG.NOME_DO_JOGO || "CÓDIGO ARCADE")}<span>★ APRENDA PROGRAMAÇÃO JOGANDO ★</span>`;
  $("#rodape").innerHTML = `TÉCNICO EM DESENVOLVIMENTO DE SISTEMAS · LÓGICA E LINGUAGEM DE PROGRAMAÇÃO<br>${esc((CFG.PROFESSOR || "").toUpperCase())}<br>${DADOS.modo === "online" ? "● ONLINE: SEU PROGRESSO FICA SALVO NA NUVEM" : "● MODO OFFLINE: O PROGRESSO FICA SALVO NESTE COMPUTADOR"}`;
  if (DOMINIO) $("#cEmail").placeholder = "seunome@" + DOMINIO;
  const sp = $("#spritesInicio");
  for (let k = 0; k < 3; k++) { const cv = document.createElement("canvas"); const av = k === 1 ? NPC : AVATAR.aleatorio(); const d = k; sp.appendChild(moldura(cv)); AVATAR.animar(cv, () => av, 2, true, () => ({ dir: d === 2 ? 1 : 0, andando: d !== 1 })); }
  try { TURMAS = await DADOS.turmas(); } catch (e) { TURMAS = []; msg("Não consegui carregar as turmas. Confira a internet.", true); }
  $("#cTurma").innerHTML = TURMAS.map(t => `<option value="${t.id}">${esc(t.nome)}</option>`).join("") || "<option>Sem turmas</option>";
  try { const u = localStorage.getItem("ca_login"); if (u) $("#lLogin").value = u; } catch (e) {}
})();
function abaLogin(qual) {
  $("#formEntrar").style.display = qual === "entrar" ? "" : "none";
  $("#formCriar").style.display = qual === "criar" ? "" : "none";
  $("#abaEntrar").className = "btn " + (qual === "entrar" ? "yl" : "dk");
  $("#abaCriar").className = "btn " + (qual === "criar" ? "yl" : "dk");
  msg("");
}
$("#abaEntrar").onclick = () => { SOM.clique(); abaLogin("entrar"); };
$("#abaCriar").onclick = () => { SOM.clique(); abaLogin("criar"); };
["#lLogin", "#lSenha"].forEach(s => $(s).addEventListener("keydown", e => { if (e.key === "Enter") entrar(); }));
$("#bEntrar").onclick = () => entrar();
$("#bCriarConta").onclick = () => criarConta();
function msg(t, err) { const m = $("#lMsg"); m.textContent = t; m.className = "msg" + (err ? " err" : ""); }
const ERROS = {
  login: "Nickname/e-mail ou senha errados.", bloqueado: "Muitas tentativas erradas. Espere 10 minutos e tente de novo.",
  nome: "Digite seu NOME e SOBRENOME.", nick: "O nickname precisa ter de 3 a 16 letras, números, ponto ou _ (sem espaço).",
  email: "Digite um e-mail válido.", senha: "A senha precisa ter pelo menos 6 caracteres.", turma: "Escolha a sua turma.",
  nick_existe: "Esse nickname já existe. Escolha outro!", email_existe: "Esse e-mail já tem conta. Use a aba ENTRAR.",
  senha_confere: "As duas senhas não são iguais.", dominio: "Use o e-mail da escola (@" + DOMINIO + ").", senha_atual: "A senha atual está errada."
};
async function entrar() {
  SOM.clique();
  const login = $("#lLogin").value.trim(), senha = $("#lSenha").value;
  if (!login || !senha) return msg("Preencha o nickname (ou e-mail) e a senha.", true);
  msg("Conectando...");
  let r; try { r = await DADOS.entrar(login, senha); } catch (e) { return msg("Sem conexão com o servidor. Confira a internet e tente de novo.", true); }
  if (!r.ok) return msg(ERROS[r.erro] || ("Erro: " + r.erro), true);
  try { localStorage.setItem("ca_login", login); } catch (e) {}
  iniciarSessao(r);
}
async function criarConta() {
  SOM.clique();
  const nome = DADOS.normNome($("#cNome").value), nick = $("#cNick").value.trim(), email = $("#cEmail").value.trim().toLowerCase(), senha = $("#cSenha").value, senha2 = $("#cSenha2").value, turma = $("#cTurma").value;
  if (nome.split(" ").length < 2) return msg(ERROS.nome, true);
  if (!/^[A-Za-z0-9_.]{3,16}$/.test(nick)) return msg(ERROS.nick, true);
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return msg(ERROS.email, true);
  if (DOMINIO && !email.endsWith("@" + DOMINIO)) return msg(ERROS.dominio, true);
  if (senha.length < 6) return msg(ERROS.senha, true);
  if (senha !== senha2) return msg(ERROS.senha_confere, true);
  msg("Criando sua conta...");
  let r; try { r = await DADOS.cadastrar(turma, nome, nick, email, senha); } catch (e) { return msg("Sem conexão com o servidor. Confira a internet e tente de novo.", true); }
  if (!r.ok) return msg(ERROS[r.erro] || ("Erro: " + r.erro), true);
  try { localStorage.setItem("ca_login", nick); } catch (e) {}
  iniciarSessao(r);
}
function iniciarSessao(r) {
  J = { token: r.token, aluno: r.aluno, progresso: r.aluno.progresso || {} };
  J.aluno.avatar = AVATAR.normalizar(J.aluno.avatar);
  J.aluno.inventario = J.aluno.inventario || {}; J.aluno.quarto = J.aluno.quarto || { piso: 0, parede: 0, itens: [] };
  ["#lSenha", "#cSenha", "#cSenha2"].forEach(s => $(s).value = ""); msg("");
  $("#hud").style.display = "flex";
  atualizarHud(); sync();
  if (r.novo) abrirAvatar(true); else ir("quarto");
}
$("#bSair").onclick = () => { SOM.clique(); J = null; pararTudo(); $("#hud").style.display = "none"; abaLogin("entrar"); mostrar("tInicio"); };
$("#bSom").onclick = () => { som = !som; try { localStorage.setItem("ca_som", som ? "1" : "0"); } catch (e) {} $("#bSom").textContent = som ? "♪" : "×"; SOM.clique(); };
$("#bSom").textContent = som ? "♪" : "×";
$("#hudConta").onclick = () => abrirConta();
function abrirConta() {
  SOM.clique();
  const a = J.aluno;
  modal(`<p class="px" style="font-size:11px;color:var(--yellow)">MINHA CONTA</p>
    <p class="mt" style="text-align:left">Nome: <b>${esc(a.nome)}</b><br>Nickname: <b>${esc(a.nick)}</b><br>E-mail: <b>${esc(a.email || "")}</b><br>Turma: <b>${esc(a.turma || "")}</b></p>
    <p class="px mt" style="font-size:9px;color:var(--cyan);text-align:left">TROCAR SENHA</p>
    <input class="inp mt" id="tsAtual" type="password" placeholder="senha atual"><input class="inp mt" id="tsNova" type="password" placeholder="nova senha (mínimo 6)">
    <p class="msg" id="tsMsg"></p><button class="btn gr" id="tsOk">TROCAR</button><button class="btn dk" onclick="fecharModal()">FECHAR</button>`);
  $("#tsOk").onclick = async () => {
    try { const r = await DADOS.trocarSenha(J.token, $("#tsAtual").value, $("#tsNova").value); $("#tsMsg").textContent = r.ok ? "✔ Senha trocada!" : (ERROS[r.erro] || r.erro); }
    catch (e) { $("#tsMsg").textContent = "Sem conexão."; }
  };
}

async function sync() {
  const s = $("#hudSync");
  if (DADOS.modo !== "online") { s.className = "sync off"; s.textContent = "💾 OFFLINE"; return; }
  if (DADOS.pendentes()) { s.className = "sync"; s.textContent = "⏳ ENVIANDO"; const resto = await DADOS.enviarPendentes(); if (resto) { s.className = "sync off"; s.textContent = "⚠ SEM INTERNET"; return; } }
  s.className = "sync ok"; s.textContent = "☁ SALVO";
}
setInterval(() => { if (J && DADOS.pendentes()) sync(); }, 30000);

/* =================================================================
   NAVEGAÇÃO
   ================================================================= */
let sala = null; // quarto em exibição
function pararTudo() { pararAnim.forEach(f => f()); pararAnim = []; if (sala) { sala.parar(); sala = null; } }
function mostrar(id) { pararTudo(); document.querySelectorAll(".tela").forEach(t => t.classList.toggle("on", t.id === id)); window.scrollTo(0, 0); }
let mundoAtual = 1;
function ir(dest) {
  SOM.clique();
  if (dest === "mundos") { mostrar("tMundos"); renderMundos(); }
  else if (dest === "mapa") { mostrar("tMapa"); renderMapa(); }
  else if (dest === "quarto") abrirQuarto();
  else if (dest === "loja") abrirLoja();
  else if (dest === "avatar") abrirAvatar(false);
  else if (dest === "ranking") abrirRanking();
  else if (dest === "caderno") abrirCaderno();
  else if (dest === "trofeus") abrirTrofeus();
}
document.querySelectorAll("[data-go]").forEach(b => b.onclick = () => ir(b.dataset.go));
function atualizarHud() {
  AVATAR.desenhar($("#hudAv"), J.aluno.avatar, 1, true, { retrato: true });
  $("#hudNome").innerHTML = `${esc(J.aluno.nick || J.aluno.nome)}<small>${esc(J.aluno.turma || "")}</small>`;
  $("#hudSt").innerHTML = `${ICONE.estrela("#ffd23f", 14)} ${est()}`;
  $("#hudXp").textContent = `${xp()} XP`;
  $("#hudMoedas").innerHTML = `${ICONE.moeda(14)} ${J.aluno.moedas}`;
}
function modal(html) { $("#modalBox").innerHTML = html; $("#modal").classList.add("on"); }
function fecharModal() { $("#modal").classList.remove("on"); }
$("#modal").onclick = e => { if (e.target.id === "modal") fecharModal(); };
let avisoT = null;
function aviso(t) { let a = $("#aviso"); if (!a) { a = document.createElement("div"); a.id = "aviso"; a.className = "aviso"; document.body.appendChild(a); } a.textContent = t; a.classList.add("on"); clearTimeout(avisoT); avisoT = setTimeout(() => a.classList.remove("on"), 2200); }

/* =================================================================
   QUARTO
   ================================================================= */
function abrirQuarto() {
  mostrar("tQuarto");
  $("#qTitulo").textContent = `QUARTO DE ${(J.aluno.nick || "").toUpperCase()}`;
  $("#qPainel").style.display = "none"; $("#bDecorar").textContent = "DECORAR";
  sala = new Quarto($("#qCanvas"), {
    quarto: J.aluno.quarto, avatar: () => J.aluno.avatar, nome: J.aluno.nick,
    aoSair: () => { sala = null; ir("mundos"); },
    aoMudar: () => painelDecorar(), aoErro: t => { SOM.erro(); aviso(t); }
  });
}
$("#bDecorar").onclick = () => {
  if (!sala) return; SOM.clique();
  sala.editando = !sala.editando; sala.pegando = null; sala.selecionado = null;
  $("#bDecorar").textContent = sala.editando ? "✔ PRONTO" : "DECORAR";
  $("#qPainel").style.display = sala.editando ? "" : "none";
  if (sala.editando) painelDecorar();
  else { J.aluno.quarto = JSON.parse(JSON.stringify(sala.q)); DADOS.salvarQuarto(J.token, J.aluno.quarto).then(r => { if (r && r.ok === false && r.erro) aviso("Não salvou: " + r.erro); sync(); }).catch(() => aviso("Sem conexão: tente de novo.")); SOM.ok(); aviso("Quarto salvo!"); }
};
$("#qChat").onsubmit = e => { e.preventDefault(); const t = $("#qFala").value.trim(); if (sala && t) { sala.falar(t); $("#qFala").value = ""; SOM.clique(); } };
["cima", "baixo", "esq", "dir"].forEach(k => { const b = $("#dp_" + k); if (b) b.addEventListener("pointerdown", e => { e.preventDefault(); if (sala) sala.dpad(...{ cima: [0, -1], baixo: [0, 1], esq: [-1, 0], dir: [1, 0] }[k]); }); });
function painelDecorar() {
  if (!sala || !sala.editando) return;
  const inv = J.aluno.inventario || {};
  const sel = sala.selecionado;
  let h = `<div class="secao">${sel ? "MÓVEL SELECIONADO" : sala.pegando ? "TOQUE NO CHÃO PARA COLOCAR" : "SEUS MÓVEIS (toque em um e depois no chão)"}</div>`;
  if (sel || sala.pegando) h += `<div class="row"><button class="btn sm cy" id="dGirar">↻ GIRAR</button>${sel && !sala.pegando ? `<button class="btn sm cy" id="dMover">✥ MOVER</button><button class="btn sm" id="dGuardar">⬇ GUARDAR</button>` : ""}<button class="btn sm dk" id="dCancelar">CANCELAR</button></div>`;
  h += `<div class="inv" id="dInv"></div>`;
  h += `<div class="secao">PISO</div><div class="grade" id="dPiso"></div><div class="secao">PAREDE</div><div class="grade" id="dParede"></div><div class="secao">ESTAMPA DA PAREDE</div><div class="grade" id="dPapel"></div>`;
  $("#qPainel").innerHTML = h;
  const invBox = $("#dInv");
  const ids = MOVEIS.filter(m => (inv[m.id] || 0) > 0);
  if (!ids.length) invBox.innerHTML = `<p style="color:var(--gray)">Você ainda não tem móveis. Vá na <b>LOJA</b> e compre com suas moedas!</p>`;
  ids.forEach(m => {
    const livres = (inv[m.id] || 0) - sala.usados(m.id);
    const b = document.createElement("button"); b.className = "it" + (livres <= 0 ? " lock" : "") + (sala.pegando && !sala.pegando.item && sala.pegando.m === m.id ? " on" : "");
    const cv = document.createElement("canvas"); ISO.miniatura(cv, m.id, 1.5); b.appendChild(cv); b.append(`${m.nome} (${livres})`);
    b.onclick = () => { if (livres <= 0) { SOM.erro(); aviso("Todos já estão no quarto."); return; } SOM.clique(); sala.pegarDoInventario(m.id); painelDecorar(); };
    invBox.appendChild(b);
  });
  const { PISOS, PAREDES } = QUARTO_OPCOES;
  PISOS.forEach((p, i) => { const b = document.createElement("button"); b.className = "sw" + (sala.q.piso === i ? " on" : ""); b.style.background = `linear-gradient(135deg,${p[0]} 50%,${p[1]} 50%)`; b.onclick = () => { sala.q.piso = i; painelDecorar(); }; $("#dPiso").appendChild(b); });
  PAREDES.forEach((p, i) => { const b = document.createElement("button"); b.className = "sw" + (sala.q.parede === i ? " on" : ""); b.style.background = p; b.onclick = () => { sala.q.parede = i; painelDecorar(); }; $("#dParede").appendChild(b); });
  const { PAPEIS, papelCss } = QUARTO_OPCOES, corP = PAREDES[sala.q.parede] || PAREDES[0];
  PAPEIS.forEach((nome, i) => { const b = document.createElement("button"); b.className = "sw" + ((sala.q.papel || 0) === i ? " on" : ""); b.title = nome; b.style.background = papelCss(i, corP); b.onclick = () => { sala.q.papel = i; painelDecorar(); }; $("#dPapel").appendChild(b); });
  const on = (id, fn) => { const el = $(id); if (el) el.onclick = () => { SOM.clique(); fn(); painelDecorar(); }; };
  on("#dGirar", () => sala.girar()); on("#dMover", () => sala.moverSelecionado()); on("#dGuardar", () => sala.guardar()); on("#dCancelar", () => { sala.pegando = null; sala.selecionado = null; });
}

/* =================================================================
   LOJA
   ================================================================= */
async function abrirLoja() {
  mostrar("tLoja");
  const box = $("#lojaGrade"); box.innerHTML = `<p class="blink">CARREGANDO...</p>`;
  let precos = [];
  try { precos = await DADOS.moveis(); } catch (e) { precos = MOVEIS.map(m => ({ id: m.id, preco: m.preco })); }
  const preco = id => (precos.find(p => p.id === id) || MOVEIS.find(m => m.id === id)).preco;
  box.innerHTML = "";
  $("#lojaSaldo").innerHTML = `${ICONE.moeda(16)} ${J.aluno.moedas} MOEDAS`;
  MOVEIS.filter(m => precos.some(p => p.id === m.id)).sort((a, b) => preco(a.id) - preco(b.id)).forEach(m => {
    const p = preco(m.id), tem = (J.aluno.inventario || {})[m.id] || 0, pode = J.aluno.moedas >= p;
    const card = document.createElement("div"); card.className = "loja-card";
    const cv = document.createElement("canvas"); ISO.miniatura(cv, m.id, 2); card.appendChild(cv);
    card.insertAdjacentHTML("beforeend", `<div class="px" style="font-size:10px">${esc(m.nome.toUpperCase())}</div><div class="preco">${ICONE.moeda(14)} ${p}</div><small>Você tem: ${tem}</small>`);
    const b = document.createElement("button"); b.className = "btn sm " + (pode ? "gr" : "dk"); b.textContent = pode ? "COMPRAR" : "FALTAM " + (p - J.aluno.moedas);
    b.disabled = !pode;
    b.onclick = async () => {
      b.disabled = true;
      try {
        const r = await DADOS.comprar(J.token, m.id);
        if (!r.ok) { SOM.erro(); aviso(r.erro === "moedas" ? "Moedas insuficientes." : "Não deu: " + r.erro); b.disabled = false; return; }
        J.aluno.moedas = r.moedas; J.aluno.inventario = r.inventario; atualizarHud(); SOM.estrela(); aviso(`${m.nome} comprado! Vá em DECORAR no seu quarto.`); abrirLoja();
      } catch (e) { SOM.erro(); aviso("Sem conexão: tente de novo."); b.disabled = false; }
    };
    card.appendChild(b); box.appendChild(card);
  });
}

/* =================================================================
   VISITAR O QUARTO DE UM COLEGA
   ================================================================= */
async function visitar(nick) {
  let r; try { r = await DADOS.verQuarto(nick); } catch (e) { aviso("Sem conexão."); return; }
  if (!r || !r.ok) { aviso("Quarto não encontrado."); return; }
  mostrar("tVisita");
  $("#vTitulo").textContent = `QUARTO DE ${r.nick.toUpperCase()}`;
  sala = new Quarto($("#vCanvas"), { quarto: r.quarto, avatar: () => r.avatar, visita: true });
}

/* =================================================================
   MAPA DOS MUNDOS
   ================================================================= */
function renderMundos() {
  const w = $("#mundosWrap");
  w.innerHTML = `<div class="fhead"><h2>ESCOLHA O MUNDO</h2><span class="tag" style="background:var(--yellow)">${FASES.filter(f => feita(f.id)).length}/${FASES.length} FASES</span></div><div class="mundos" id="grid"></div>`;
  const grid = $("#grid");
  MUNDOS.forEach(m => {
    const fs = fasesDo(m.n), feitas = fs.filter(f => feita(f.id)).length, lib = mundoLiberado(m.n);
    const card = document.createElement("div");
    card.className = "mcard" + (lib ? "" : " breve");
    const cv = document.createElement("canvas");
    card.appendChild(cv);
    card.insertAdjacentHTML("beforeend", `<span class="num" style="background:${m.cor}">MUNDO ${m.n}</span>
      ${!m.pronto ? `<div class="selo">EM BREVE</div>` : (!lib ? `<div class="selo">${ICONE.cadeado(30)}<br>TERMINE O MUNDO ANTERIOR</div>` : "")}
      <div class="info"><div class="px" style="color:${m.cor}">${esc(m.nome.toUpperCase())}</div><small>${esc(m.sub)}</small>
      ${fs.length ? `<div class="barra"><i style="width:${Math.round(feitas / fs.length * 100)}%"></i></div><small>${feitas}/${fs.length} fases</small>` : ""}</div>`);
    card.onclick = () => { if (!lib) { SOM.erro(); return; } mundoAtual = m.n; ir("mapa"); };
    grid.appendChild(card);
    requestAnimationFrame(() => {
      const W = card.clientWidth || 300;
      CENARIO.pintarCenario(cv, m.tema, W, 150, [], true);
    });
  });
}

/* =================================================================
   MAPA DE FASES DE UM MUNDO
   ================================================================= */
function renderMapa() {
  const m = MUNDOS.find(x => x.n === mundoAtual), fs = fasesDo(m.n);
  const w = $("#mapaWrap");
  w.innerHTML = `<div class="fhead"><button class="btn sm dk" onclick="ir('mundos')">◀ MUNDOS</button><h2>MUNDO ${m.n} · ${esc(m.nome.toUpperCase())}</h2><span class="tag" style="background:${m.cor}">${fs.filter(f => feita(f.id)).length}/${fs.length}</span></div>`;
  const W = Math.min(960, (w.clientWidth || document.documentElement.clientWidth - 32) - 24), H = 160 + fs.length * 130;
  const amp = W < 600 ? W * 0.2 : Math.min(170, W * 0.17);
  const pts = fs.map((x, k) => [Math.round(W / 2 + Math.sin(k * 1.25 + m.n) * amp), 180 + k * 130]);
  const atual = fs.find(f => liberada(f) && !feita(f.id));
  const tr = document.createElement("div"); tr.className = "trilha"; tr.style.width = W + "px"; tr.style.height = H + "px";
  const cen = document.createElement("canvas"); cen.className = "cenario"; tr.appendChild(cen);
  CENARIO.pintarCenario(cen, m.tema, W, H, [[W / 2, 0], ...pts, [pts[pts.length - 1][0], H]]);
  const linha = pts.map(p => p.join(",")).join(" ");
  tr.insertAdjacentHTML("beforeend", `<svg viewBox="0 0 ${W} ${H}"><polyline points="${linha}" fill="none" stroke="#000" stroke-width="12"/><polyline points="${linha}" fill="none" stroke="${m.cor}" stroke-width="6" stroke-dasharray="12 10"/></svg>
    <div class="banner" style="background:${m.cor}">MUNDO ${m.n} · ${esc(m.nome.toUpperCase())}<small>${esc(m.sub)}</small></div>`);
  fs.forEach((f, k) => {
    const pr = J.progresso[f.id] || {}, ok = feita(f.id), lib = liberada(f);
    const b = document.createElement("button");
    b.className = "no" + (f.chefe ? " boss" : "") + (lib ? (ok ? " feito" : " livre") : " lock " + (k % 2 ? "caixote" : "pedra")) + (f === atual ? " atual" : "") + (pts[k][0] > W / 2 ? " esq" : "");
    b.style.left = pts[k][0] + "px"; b.style.top = pts[k][1] + "px";
    if (ok) b.style.setProperty("--cor", m.cor);
    b.innerHTML = (lib ? `<span class="num">${f.chefe ? ICONE.caveira(30) : (k + 1)}</span>` : `<span class="cad">${ICONE.cadeado(28)}</span>`) +
      (ok ? `<span class="stars">${[1, 2, 3].map(n => ICONE.estrela(n <= pr.estrelas ? "#ffd23f" : "#3a3a5a", 16)).join("")}</span>` : "") +
      `<span class="tt">${f.chefe ? "" : "FASE " + (k + 1) + "<br>"}${esc(f.titulo)}</span>`;
    b.onclick = () => { if (lib) abrirFase(f); else { SOM.erro(); modal(`<p class="px" style="font-size:11px">FASE BLOQUEADA</p><p class="mt">Vença a fase anterior para liberar.</p><button class="btn mt" onclick="fecharModal()">OK</button>`); } };
    tr.appendChild(b);
    if (f === atual) {
      const eu = document.createElement("canvas"); eu.className = "eu";
      const meia = f.chefe ? 54 : 43; eu.style.left = (pts[k][0] > W / 2 ? pts[k][0] + meia : pts[k][0] - meia - 56) + "px"; eu.style.top = (pts[k][1] - 78) + "px";
      tr.appendChild(eu); const dirEu = pts[k][0] > W / 2 ? 1 : 0; pararAnim.push(AVATAR.animar(eu, () => J.aluno.avatar, 1, false, () => ({ dir: dirEu })));
    }
  });
  w.appendChild(tr);
  if (!atual && mundoCompleto(m.n)) {
    const prox = MUNDOS.find(x => x.n > m.n && mundoLiberado(x.n));
    w.insertAdjacentHTML("beforeend", `<div class="box center"><p class="px" style="color:var(--yellow);font-size:12px">MUNDO ${m.n} COMPLETO!</p><p class="mt">Pegue 3 estrelas em todas as fases para ganhar mais itens.</p>
      <button class="btn yl mt" onclick="ir('trofeus')">VER TROFÉU</button>${prox ? `<button class="btn mt" onclick="mundoAtual=${prox.n};ir('mapa')">MUNDO ${prox.n} ▶</button>` : ""}</div>`);
  }
}
window.addEventListener("resize", () => { if ($("#tMapa").classList.contains("on")) { pararTudo(); renderMapa(); } });

/* =================================================================
   FASE
   ================================================================= */
let F = null;
function abrirFase(f) {
  F = { f, d: 0, erros: 0, xp: 0, errouAtual: false };
  const m = MUNDOS.find(x => x.n === f.mundo), k = fasesDo(f.mundo).indexOf(f);
  mostrar("tFase");
  const w = $("#faseWrap");
  w.innerHTML = `<div class="fhead"><span class="tag" style="background:${m.cor}">${f.chefe ? "CHEFÃO" : "FASE " + (k + 1)}</span><h2>${esc(f.titulo)}</h2></div>
    <div class="box dialogo"><div class="moldura"><canvas id="npc"></canvas></div><div class="fala"><div class="quem">${esc((m.guia && m.guia.nome) || "MESTRE ALGO · GUARDIÃO DA VILA")}</div><div id="falaTxt"></div></div></div>
    <div class="center"><button class="btn" id="bCont">CONTINUAR ▶</button></div>`;
  const guia = (m.guia && m.guia.avatar) || NPC;
  pararAnim.push(AVATAR.animar($("#npc"), () => guia, 2));
  digitar($("#falaTxt"), f.historia);
  $("#bCont").onclick = () => { SOM.clique(); mostrarAprenda(); };
}
async function digitar(el, txt) {
  el.textContent = ""; let pular = false;
  el.parentElement.addEventListener("click", () => pular = true, { once: true });
  for (let k = 0; k < txt.length; k++) { if (pular || !el.isConnected) { el.textContent = txt; return; } el.textContent += txt[k]; if (k % 3 === 0) await sleep(16); }
}
function blocoAprenda(a) {
  let h = `<p>${a.texto}</p>`;
  if (a.passos) h += `<ol class="passos">${a.passos.map(p => `<li>${esc(p)}</li>`).join("")}</ol>`;
  if (a.legenda) h += `<div class="fluxo-box">${CENARIO.legendaSvg()}</div>`;
  if (a.fluxo) h += `<div class="fluxo-box">${CENARIO.fluxogramaSvg(a.fluxo)}</div>`;
  if (a.codigo) h += `<div class="code">${hlCode(a.codigo)}</div>`;
  return h;
}
function mostrarAprenda() {
  pararTudo();
  const f = F.f;
  $("#faseWrap").innerHTML = `<div class="fhead"><span class="tag" style="background:var(--cyan)">APRENDA</span><h2>${esc(f.titulo)}</h2></div>
    <div class="box">${blocoAprenda(f.aprenda)}</div>
    <div class="center"><button class="btn gr" id="bDes">COMEÇAR DESAFIOS ▶</button></div>`;
  window.scrollTo(0, 0);
  $("#bDes").onclick = () => { SOM.clique(); renderDesafio(); };
}
const estrelasDe = erros => erros === 0 ? 3 : erros <= 2 ? 2 : 1;
const NOMES_TIPO = { quiz: "PERGUNTA", escolha: "COMPLETE O CÓDIGO", saida: "O QUE APARECE NO TERMINAL?", bug: "ENCONTRE O ERRO", ordem: "COLOQUE EM ORDEM", digite: "DIGITE A RESPOSTA", forma: "QUAL É A FORMA?", fluxo: "FLUXOGRAMA" };
function renderDesafio() {
  const f = F.f, d = f.desafios[F.d];
  F.errouAtual = false;
  const e = estrelasDe(F.erros);
  $("#faseWrap").innerHTML = `<div class="fhead"><span class="tag" style="background:var(--yellow)">${F.d + 1}/${f.desafios.length}</span><h2>${esc(f.titulo)}</h2></div>
    <div class="prog"><div class="bar">${f.desafios.map((_, k) => `<i class="${k < F.d ? "ok" : k === F.d ? "now" : ""}"></i>`).join("")}</div><div class="meter" id="meter">${"★".repeat(e)}<span class="off">${"★".repeat(3 - e)}</span></div></div>
    <div class="box"><div class="tipo">${NOMES_TIPO[d.tipo]}</div><div class="perg">${esc(d.pergunta)}</div><div id="area"></div>
      <div class="dica" id="dica"></div>
      <div class="acerto" id="acerto"><span class="px" id="acTxt"></span><button class="btn gr" id="bProx">PRÓXIMO ▶</button></div></div>`;
  window.scrollTo(0, 0);
  ({ quiz: dOpcoes, saida: dOpcoes, escolha: dEscolha, bug: dBug, ordem: dOrdem, digite: dDigite, forma: dForma, fluxo: dFluxo })[d.tipo](d, $("#area"));
  $("#bProx").onclick = () => { SOM.clique(); F.d++; if (F.d < f.desafios.length) renderDesafio(); else terminarFase(); };
}
function errou(d, j, el) {
  SOM.erro(); F.erros++; F.errouAtual = true;
  const e = estrelasDe(F.erros);
  $("#meter").innerHTML = `${"★".repeat(e)}<span class="off">${"★".repeat(3 - e)}</span>`;
  const txt = (d.dicas && j != null && d.dicas[j]) || d.dica || "Tente outra vez!";
  const di = $("#dica"); di.classList.remove("on"); void di.offsetWidth;
  di.innerHTML = `<b>✘ AINDA NÃO.</b> ${esc(txt)}`; di.classList.add("on");
  if (el) { el.classList.remove("err"); void el.offsetWidth; el.classList.add("err"); }
}
function acertou(el) {
  SOM.ok();
  const g = F.errouAtual ? 5 : 10; F.xp += g;
  $("#dica").classList.remove("on");
  const frases = ["MANDOU BEM!", "BOA!", "PERFEITO!", "É ISSO AÍ!", "SHOW!", "ACERTOU!"];
  $("#acTxt").textContent = `✔ ${frases[Math.floor(Math.random() * frases.length)]}  +${g} XP`;
  $("#acerto").classList.add("on");
  if (el) { const r = el.getBoundingClientRect(); const fx = document.createElement("div"); fx.className = "xpfloat"; fx.textContent = "+" + g + " XP"; fx.style.left = (r.left + r.width / 2 - 40) + "px"; fx.style.top = (r.top - 10) + "px"; document.body.appendChild(fx); setTimeout(() => fx.remove(), 1100); }
  $("#bProx").focus({ preventScroll: true });
}
function botoesOpcoes(area, opcoes, certa, d, classe, rotulo) {
  const div = document.createElement("div"); div.className = classe || "ops";
  // as alternativas aparecem embaralhadas (menos nos ícones das formas, que têm ordem fixa)
  const ordem = opcoes.map((o, j) => j), lista = rotulo ? ordem : embaralhar(ordem);
  lista.forEach(j => { const o = opcoes[j];
    const b = document.createElement("button"); b.className = "op" + (d.tipo === "saida" ? " mono" : ""); b.innerHTML = rotulo ? rotulo(o) : esc(o);
    b.onclick = () => { if (j === certa) { b.classList.add("ok"); div.querySelectorAll(".op").forEach(x => x.disabled = true); acertou(b); if (d._aoAcertar) d._aoAcertar(o); } else { b.disabled = true; errou(d, j, b); } };
    div.appendChild(b);
  });
  area.appendChild(div);
}
function dOpcoes(d, area) { if (d.codigo) area.innerHTML = `<div class="code">${hlCode(d.codigo)}</div>`; botoesOpcoes(area, d.opcoes, d.certa, d); }
function dEscolha(d, area) {
  area.innerHTML = `<div class="code">${hlCode(d.codigo).replace("@@", '<span class="slot" id="slot">?</span>')}</div>`;
  d._aoAcertar = o => { const s = $("#slot"); s.textContent = o; s.classList.add("ok"); };
  botoesOpcoes(area, d.opcoes, d.certa, d, "chips");
  area.querySelectorAll(".op").forEach(b => b.classList.add("mono"));
}
function dBug(d, area) {
  area.innerHTML = `<div class="linhas">${d.linhas.map((l, j) => `<div class="lin" data-j="${j}"><span class="n">${j + 1}</span><span>${d.texto ? esc(l) : (hl(l) || " ")}</span></div>`).join("")}</div>`;
  let fim = false;
  area.querySelectorAll(".lin").forEach(el => el.onclick = () => {
    if (fim) return; const j = +el.dataset.j; if (!d.linhas[j].trim()) return;
    if (j === d.certa) { fim = true; el.classList.add("ok"); acertou(el); } else errou(d, null, el);
  });
}
function embaralhar(arr) { const a = arr.slice(); do { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } } while (arr.length > 1 && a.every((x, k) => x === arr[k])); return a; }
function dOrdem(d, area) {
  const pecas = embaralhar(d.linhas.map((l, k) => ({ l, k })));
  let resp = [], fim = false;
  const fmt = l => d.texto ? esc(l) : hl(l);
  area.innerHTML = `<p style="font-size:20px;color:var(--gray)">Clique nas peças na ordem certa. Clique numa peça montada para devolver.</p>
    <div class="ordem"><div><h4>PEÇAS</h4><div class="pool" id="pool"></div></div><div><h4>${d.texto ? "SUA SEQUÊNCIA" : "SEU CÓDIGO"}</h4><div class="resp" id="resp"></div></div></div>
    <div class="center mt"><button class="btn cy" id="bConf" disabled>CONFERIR</button></div>`;
  function draw() {
    const usados = new Set(resp.map(p => p.k));
    $("#pool").innerHTML = ""; $("#resp").innerHTML = "";
    pecas.filter(p => !usados.has(p.k)).forEach(p => { const b = document.createElement("button"); b.className = "peca" + (d.texto ? " txt" : ""); b.innerHTML = fmt(p.l); b.onclick = () => { if (fim) return; SOM.clique(); resp.push(p); draw(); }; $("#pool").appendChild(b); });
    resp.forEach((p, i) => { const b = document.createElement("button"); b.className = "peca" + (d.texto ? " txt" : "") + (p.bad ? " bad" : ""); b.innerHTML = (d.texto ? `<b>${i + 1}.</b> ` : "") + fmt(p.l); b.onclick = () => { if (fim) return; SOM.clique(); resp.splice(i, 1); resp.forEach(x => x.bad = false); draw(); }; $("#resp").appendChild(b); });
    $("#bConf").disabled = resp.length !== d.linhas.length || fim;
  }
  draw();
  $("#bConf").onclick = () => {
    if (resp.every((p, i) => p.l === d.linhas[i])) { fim = true; draw(); acertou($("#bConf")); }
    else { const k = resp.findIndex((p, i) => p.l !== d.linhas[i]); resp.forEach((p, i) => p.bad = i >= k); errou(d, null, null); draw(); }
  };
}
function dDigite(d, area) {
  area.innerHTML = (d.codigo ? `<div class="code">${hlCode(d.codigo)}</div>` : "") + `<div class="digita"><input class="inp" id="dig" autocomplete="off" spellcheck="false" placeholder="digite aqui..."><button class="btn cy" id="bDig">CONFERIR</button></div>`;
  const norm = s => s.replace(/\s+/g, "").replace(/'/g, '"').toLowerCase();
  let fim = false;
  const conf = () => { if (fim) return; const v = $("#dig").value; if (!v.trim()) return; if (d.respostas.map(norm).includes(norm(v))) { fim = true; $("#dig").disabled = true; $("#dig").style.color = "var(--green)"; acertou($("#bDig")); } else errou(d, null, $("#dig")); };
  $("#bDig").onclick = conf; $("#dig").addEventListener("keydown", e => { if (e.key === "Enter") conf(); }); $("#dig").focus();
}
const ORDEM_FORMAS = ["terminal", "dados", "processo", "decisao"];
function opcoesFormas(area, d) {
  botoesOpcoes(area, ORDEM_FORMAS, ORDEM_FORMAS.indexOf(d.certa), d, "ops", k => `${CENARIO.formaIcone(k)}<small>${FORMAS[k].uso}</small>`);
  area.querySelectorAll(".op").forEach(b => b.classList.add("forma"));
}
function dForma(d, area) {
  area.innerHTML = `<div class="fluxo-box"><span class="px" style="font-size:9px;color:var(--gray)">PASSO:</span><div style="font-size:34px;color:var(--yellow);margin-top:6px">“${esc(d.texto)}”</div></div>`;
  opcoesFormas(area, d);
}
function dFluxo(d, area) {
  area.innerHTML = `<div class="fluxo-box">${CENARIO.fluxogramaSvg(d.nos)}</div>`;
  if (d.formas) opcoesFormas(area, d); else botoesOpcoes(area, d.opcoes, d.certa, d);
}

async function terminarFase() {
  const f = F.f, e = estrelasDe(F.erros), ganho = F.xp + 50;
  const antes = est(), prev = J.progresso[f.id] || {}, primeira = !prev.estrelas;
  J.progresso[f.id] = { estrelas: Math.max(e, prev.estrelas || 0), xp: Math.max(ganho, prev.xp || 0) };
  const novos = AVATAR.ITENS.filter(it => it.estrelas > antes && it.estrelas <= est());
  atualizarHud();
  const lista = fasesDo(f.mundo), prox = lista[lista.indexOf(f) + 1];
  const fimMundo = !prox && mundoCompleto(f.mundo);
  $("#resWrap").innerHTML = `<div class="res">
    <h2>${f.chefe ? "CHEFÃO DERROTADO!" : "FASE COMPLETA!"}</h2>
    <div class="big">${[1, 2, 3].map(n => `<span class="${n <= e ? "on" : ""}">★</span>`).join("")}</div>
    <p class="px" style="font-size:12px;color:var(--green)">+${ganho} XP · ${F.erros} ERRO(S)</p><p class="px mt" style="font-size:14px;color:var(--yellow)" id="resMoedas">${ICONE.moeda(18)} ...</p>
    ${e < 3 ? `<p class="mt" style="color:var(--gray)">Jogue de novo sem errar para fazer 3 estrelas!</p>` : ""}
    <div class="box unl"><div>${ICONE.livro(40)}</div><div><div class="px">${primeira ? "NOVO RESUMO NO SEU CADERNO" : "RESUMO DA FASE"}</div>${esc(f.resumo.slice(0, 150))}...</div></div>
    ${novos.map(it => `<div class="box unl"><div data-item="${it.id}"></div><div><div class="px" style="color:var(--yellow)">ITEM DESBLOQUEADO!</div>${esc(it.nome)} para o seu avatar.</div></div>`).join("")}
    ${fimMundo ? `<div class="box unl"><div>${ICONE.trofeu(40)}</div><div><div class="px" style="color:var(--yellow)">MUNDO COMPLETO!</div>Seu troféu e o código de verificação estão em TROFÉUS.</div></div>` : ""}
    <div class="mt">
      <button class="btn gr" onclick="ir('caderno')">LER NO CADERNO</button>
      ${novos.length ? `<button class="btn yl" onclick="ir('avatar')">VESTIR ITEM</button>` : ""}
      <button class="btn dk" id="bDeNovo">JOGAR DE NOVO</button>
      ${prox ? `<button class="btn" id="bProxFase">PRÓXIMA FASE ▶</button>` : `<button class="btn yl" onclick="ir('trofeus')">TROFÉUS</button>`}
      <button class="btn cy" onclick="ir('mapa')">MAPA</button>
      <button class="btn dk" onclick="ir('quarto')">QUARTO</button>
    </div></div>`;
  $("#bDeNovo").onclick = () => abrirFase(f);
  if (prox) $("#bProxFase").onclick = () => abrirFase(prox);
  $("#resWrap").querySelectorAll("[data-item]").forEach(el => { const it = AVATAR.ITENS.find(x => x.id === el.dataset.item); const a = Object.assign({}, J.aluno.avatar, { [it.slot]: it.id }); el.appendChild(canvasAv(a, 1)); });
  mostrar("tResultado");
  e === 3 ? SOM.fim() : SOM.estrela();
  // salva
  const s = $("#hudSync"); s.className = "sync"; s.textContent = "⏳ SALVANDO";
  try {
    const r = await DADOS.salvarFase(J.token, f.id, e, ganho);
    if (r && r.progresso) { J.progresso = r.progresso; if (r.moedas != null) J.aluno.moedas = r.moedas; atualizarHud(); }
    const em = $("#resMoedas"); if (em) em.innerHTML = r && r.ganhou != null ? `${ICONE.moeda(18)} +${r.ganhou} MOEDAS${r.ganhou ? " PARA A LOJA!" : " (você já ganhou as moedas desta fase)"}` : `${ICONE.moeda(18)} moedas serão somadas quando a internet voltar`;
  }
  catch (err) { if (String(err.message).includes("sessao_invalida")) { modal(`<p>Sua sessão expirou. Entre de novo para salvar.</p><button class="btn mt" onclick="location.reload()">OK</button>`); } }
  sync();
}

/* =================================================================
   EDITOR DE AVATAR
   ================================================================= */
let AV = null, aba = "rosto", primeiroAv = false, avDir = 0, avAndar = false;
const ABAS = [["rosto", "CORPO E ROSTO"], ["cabelo", "CABELO"], ["roupa", "ROUPA"], ["calca", "CALÇA"], ["calcado", "CALÇADO"], ["itens", "ACESSÓRIOS"], ["fundo", "FUNDO"]];
function abrirAvatar(primeiro) {
  primeiroAv = primeiro; AV = Object.assign({}, J.aluno.avatar); avDir = 0; avAndar = false;
  mostrar("tAvatar");
  $("#avTitulo").textContent = primeiro ? "CRIE SEU PERSONAGEM!" : "EDITAR PERSONAGEM";
  $("#avTabs").innerHTML = ABAS.map(([k, n]) => `<button class="btn dk" data-aba="${k}">${n}${k === "itens" ? " " + ICONE.estrela("#ffd23f", 12) : ""}</button>`).join("");
  $("#avTabs").querySelectorAll("button").forEach(b => b.onclick = () => { SOM.clique(); aba = b.dataset.aba; renderAv(); });
  pararAnim.push(AVATAR.animar($("#avPrev"), () => AV, 3, true, () => ({ dir: avDir, andando: avAndar })));
  renderAv();
}
$("#avGirarE").onclick = () => { SOM.clique(); avDir = (avDir + 3) % 4; };
$("#avGirarD").onclick = () => { SOM.clique(); avDir = (avDir + 1) % 4; };
$("#avAndar").onclick = () => { SOM.clique(); avAndar = !avAndar; $("#avAndar").textContent = avAndar ? "■ PARAR" : "▶ ANDAR"; };
function renderAv() {
  const e = est(), prox = AVATAR.ITENS.find(it => it.estrelas > e);
  $("#avEstrelas").innerHTML = `${ICONE.estrela("#ffd23f", 14)} ${e} ESTRELAS<br>${prox ? `PRÓXIMO ITEM: ${esc(prox.nome).toUpperCase()} (${prox.estrelas} ${ICONE.estrela("#ffd23f", 10)})` : "TODOS OS ITENS LIBERADOS!"}`;
  $("#avTabs").querySelectorAll("button").forEach(b => b.classList.toggle("on", b.dataset.aba === aba));
  const g = $("#avGrade"); g.innerHTML = "";
  const P = AVATAR.PALETA, rosto = ["rosto", "cabelo", "itens"].includes(aba);
  const secao = t => { const h = document.createElement("div"); h.className = "secao"; h.textContent = t; g.appendChild(h); const d = document.createElement("div"); d.className = "grade"; g.appendChild(d); return d; };
  const mini = av => canvasAv(av, rosto ? 1.5 : 1, true, { retrato: rosto });
  const cores = (titulo, lista, campo) => { const d = secao(titulo); lista.forEach((c, j) => { const b = document.createElement("button"); b.className = "sw" + (AV[campo] === j ? " on" : ""); b.style.background = c; b.onclick = () => { SOM.clique(); AV[campo] = j; renderAv(); }; d.appendChild(b); }); };
  const estilos = (titulo, lista, campo, extra) => { const d = secao(titulo); lista.forEach(v => { const b = document.createElement("button"); b.className = "it" + (AV[campo] === v ? " on" : ""); b.appendChild(mini(Object.assign({}, AV, { [campo]: v }, extra || {}))); b.append(AVATAR.NOMES[v] || v); b.onclick = () => { SOM.clique(); AV[campo] = v; renderAv(); }; d.appendChild(b); }); };
  if (aba === "rosto") { estilos("SEXO", AVATAR.ESTILOS.sexo, "sexo", { chapeu: "", rosto2: "" }); cores("COR DA PELE", P.pele, "pele"); estilos("EXPRESSÃO", AVATAR.ESTILOS.rosto, "rosto", { chapeu: "", rosto2: "" }); cores("COR DOS OLHOS", P.olhos, "corOlhos"); }
  else if (aba === "cabelo") { estilos("ESTILO", AVATAR.ESTILOS.cabelo, "cabelo", { chapeu: "" }); cores("COR", P.cabelo, "corCabelo"); }
  else if (aba === "roupa") { estilos("MODELO", AVATAR.ESTILOS.roupa, "roupa"); cores("COR PRINCIPAL", P.roupa, "corRoupa"); cores("COR DO DETALHE", P.roupa, "corRoupa2"); }
  else if (aba === "calca") { estilos("MODELO", AVATAR.ESTILOS.calca, "calca"); cores("COR", P.calca, "corCalca"); }
  else if (aba === "calcado") { estilos("MODELO", AVATAR.ESTILOS.calcado, "calcado"); cores("COR", P.calcado, "corCalcado"); }
  else if (aba === "fundo") { cores("COR DO FUNDO", P.fundo, "fundo"); }
  else if (aba === "itens") {
    const d = secao("GANHE ITENS JUNTANDO ESTRELAS NAS FASES");
    AVATAR.ITENS.forEach(it => {
      const lib = e >= it.estrelas, usando = AV[it.slot] === it.id;
      const b = document.createElement("button"); b.className = "it" + (usando ? " on" : "") + (lib ? "" : " lock");
      b.appendChild(mini(Object.assign({}, AV, { [it.slot]: it.id }))); b.append(it.nome);
      if (!lib) { const l = document.createElement("div"); l.className = "lk"; l.innerHTML = `${ICONE.cadeado(26)}<span>${it.estrelas} ${ICONE.estrela("#ffd23f", 11)}</span>`; b.appendChild(l); }
      b.onclick = () => { if (!lib) { SOM.erro(); return; } SOM.clique(); AV[it.slot] = usando ? "" : it.id; renderAv(); };
      d.appendChild(b);
    });
    cores("COR DOS ACESSÓRIOS", P.roupa, "corChapeu");
  }
}
$("#bAleatorio").onclick = () => { SOM.clique(); AV = Object.assign(AVATAR.aleatorio(AV.sexo), { chapeu: AV.chapeu, rosto2: AV.rosto2, pescoco: AV.pescoco, costas: AV.costas, corChapeu: AV.corChapeu }); renderAv(); };
$("#bSalvarAv").onclick = async () => {
  SOM.ok();
  const e = est();
  AVATAR.ITENS.forEach(it => { if (e < it.estrelas && AV[it.slot] === it.id) AV[it.slot] = ""; });
  J.aluno.avatar = AVATAR.normalizar(AV); atualizarHud();
  ir("quarto");
  try { await DADOS.salvarAvatar(J.token, J.aluno.avatar); } catch (err) {}
  sync();
};

/* =================================================================
   RANKING
   ================================================================= */
async function abrirRanking() {
  mostrar("tRanking");
  $("#rkTurma").textContent = J.aluno.turma || "";
  const box = $("#rkLista"); box.innerHTML = `<p class="center blink">CARREGANDO...</p>`;
  let lista;
  try { lista = await DADOS.ranking(J.aluno.turma_id); } catch (e) { box.innerHTML = `<p class="center" style="color:var(--gray)">Sem conexão agora. Tente mais tarde.</p>`; return; }
  box.innerHTML = lista.length ? "" : `<p class="center" style="color:var(--gray)">Ninguém jogou ainda.</p>`;
  lista.forEach((p, k) => {
    const eu = (p.nick || "").toLowerCase() === (J.aluno.nick || "").toLowerCase();
    const el = document.createElement("div"); el.className = "rk" + (eu ? " eu2" : "");
    el.innerHTML = `<div class="pos ${k < 3 ? "p" + (k + 1) : ""}">${k + 1}º</div>`;
    el.appendChild(canvasAv(p.avatar, 1, true, { retrato: true }));
    el.insertAdjacentHTML("beforeend", `<div class="info">${esc(p.nick)}${eu ? " (você)" : ""}<small>${p.fases} fases</small></div><div class="pts">${ICONE.estrela("#ffd23f", 12)} ${p.estrelas}<br><span>${p.xp} XP</span></div>`);
    if (!eu) { const b = document.createElement("button"); b.className = "btn sm cy"; b.textContent = "VISITAR"; b.onclick = () => { SOM.clique(); visitar(p.nick); }; el.appendChild(b); }
    box.appendChild(el);
  });
}

/* =================================================================
   CADERNO (resumos)
   ================================================================= */
function abrirCaderno() {
  mostrar("tCaderno");
  const box = $("#cadLista"); box.innerHTML = "";
  MUNDOS.filter(m => fasesDo(m.n).length).forEach(m => {
    box.insertAdjacentHTML("beforeend", `<div class="fhead"><h2 style="color:${m.cor}">MUNDO ${m.n} · ${esc(m.nome.toUpperCase())}</h2></div>`);
    fasesDo(m.n).forEach((f, k) => {
      box.insertAdjacentHTML("beforeend", feita(f.id)
        ? `<div class="cad-item"><h3 class="px">${f.chefe ? "CHEFÃO" : "FASE " + (k + 1)} · ${esc(f.titulo.toUpperCase())}</h3><p>${esc(f.resumo)}</p></div>`
        : `<div class="cad-item lock"><h3 class="px" style="color:var(--gray)">${f.chefe ? "CHEFÃO" : "FASE " + (k + 1)} · ${esc(f.titulo.toUpperCase())}</h3><p>${ICONE.cadeado(18)} Vença a fase para liberar este resumo.</p></div>`);
    });
  });
}

/* =================================================================
   TROFÉUS (certificado por mundo)
   ================================================================= */
function abrirTrofeus() {
  mostrar("tTrofeus");
  const w = $("#trofWrap");
  w.innerHTML = `<div class="fhead"><h2>TROFÉUS</h2><span class="tag" style="background:var(--yellow)">UM POR MUNDO</span></div>`;
  const prontos = MUNDOS.filter(m => fasesDo(m.n).length);
  prontos.forEach(m => {
    const fs = fasesDo(m.n), feitas = fs.filter(f => feita(f.id)).length;
    if (feitas < fs.length) { w.insertAdjacentHTML("beforeend", `<div class="cert"><h2>${ICONE.cadeado(26)} MUNDO ${m.n}</h2><p class="mt">Você completou <b>${feitas} de ${fs.length}</b> fases da ${esc(m.nome)}. Derrote o chefão para ganhar o troféu!</p></div>`); return; }
    const e = fs.reduce((s, f) => s + J.progresso[f.id].estrelas, 0), x = fs.reduce((s, f) => s + J.progresso[f.id].xp, 0);
    const cod = codigoVerif(J.aluno.turma, semAcento(J.aluno.nome).toLowerCase(), "m" + m.n, e, x);
    const id = "cert" + m.n;
    w.insertAdjacentHTML("beforeend", `<div class="cert"><p class="px">${esc((CFG.NOME_DO_JOGO || "CÓDIGO ARCADE").toUpperCase())} · MUNDO ${m.n}</p><h2 class="mt">${ICONE.trofeu(30)} ${esc(m.nome.toUpperCase())}</h2>
      <div id="${id}av" class="mt"></div><div class="nome">${esc(J.aluno.nome)}</div><p style="color:var(--gray)">${esc(J.aluno.turma || "")}</p>
      <p class="mt">completou todas as fases de <b>${esc(m.sub)}</b>.</p>
      <table><tr><td>Fases</td><td>${fs.length}/${fs.length}</td></tr><tr><td>Estrelas</td><td>${e}/${fs.length * 3}</td></tr><tr><td>XP</td><td>${x}</td></tr></table>
      <div class="cod">${cod}</div><p style="font-size:20px;color:var(--gray)">Código de verificação: copie e envie no AVA.</p>
      <button class="btn gr mt" id="${id}cp">COPIAR PARA O AVA</button><p id="${id}ok" style="color:var(--green)"></p></div>`);
    $("#" + id + "av").appendChild(moldura(canvasAv(J.aluno.avatar, 2)));
    $("#" + id + "cp").onclick = () => {
      const t = `${CFG.NOME_DO_JOGO || "CÓDIGO ARCADE"} – Mundo ${m.n}: ${m.nome}\nAluno(a): ${J.aluno.nome}\nTurma: ${J.aluno.turma}\nFases: ${fs.length}/${fs.length}\nEstrelas: ${e}/${fs.length * 3}\nXP: ${x}\nCódigo de verificação: ${cod}`;
      const ok = () => { $("#" + id + "ok").textContent = "✔ Copiado! Agora é só colar no AVA."; SOM.ok(); };
      const fb = () => { const ta = document.createElement("textarea"); ta.value = t; document.body.appendChild(ta); ta.select(); try { document.execCommand("copy"); } catch (e) {} ta.remove(); ok(); };
      if (navigator.clipboard) navigator.clipboard.writeText(t).then(ok).catch(fb); else fb();
    };
  });
}
window.ir = ir; window.fecharModal = fecharModal;
