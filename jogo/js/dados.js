// ============================================================
//  CAMADA DE DADOS
//  O jogo só conversa com o banco por aqui.
//  • Modo ONLINE: Supabase (funções do arquivo supabase/schema.sql)
//  • Modo OFFLINE: localStorage do navegador (mesmas funções)
// ============================================================
(function () {
  const CFG = window.CONFIG || {};
  const URL = (CFG.SUPABASE_URL || "").replace(/\/$/, "");
  const KEY = CFG.SUPABASE_ANON_KEY || "";
  const ONLINE = !!(URL && KEY);

  const LS = "codigo_arcade_v2";
  const lerLS = () => { try { return JSON.parse(localStorage.getItem(LS)) || {}; } catch (e) { return {}; } };
  const gravarLS = d => { try { localStorage.setItem(LS, JSON.stringify(d)); } catch (e) {} };
  const normNome = s => s.trim().replace(/\s+/g, " ").split(" ").map(w => w ? w[0].toUpperCase() + w.slice(1).toLowerCase() : "").join(" ");
  async function hash(txt) {
    try { const b = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(txt)); return [...new Uint8Array(b)].map(x => x.toString(16).padStart(2, "0")).join(""); }
    catch (e) { let h = 0; for (const c of txt) h = (h * 31 + c.charCodeAt(0)) | 0; return "h" + h; }
  }
  const QUARTO_VAZIO = () => ({ piso: 0, parede: 0, itens: [] });

  async function rpc(fn, args, jwt) {
    const ctrl = new AbortController(); const to = setTimeout(() => ctrl.abort(), 15000);
    try {
      const r = await fetch(`${URL}/rest/v1/rpc/${fn}`, {
        method: "POST", signal: ctrl.signal,
        headers: { "apikey": KEY, "Authorization": "Bearer " + (jwt || KEY), "Content-Type": "application/json" },
        body: JSON.stringify(args || {})
      });
      const corpo = await r.json().catch(() => null);
      if (!r.ok) { const e = new Error((corpo && (corpo.message || corpo.error)) || ("HTTP " + r.status)); e.servidor = true; throw e; }
      return corpo;
    } finally { clearTimeout(to); }
  }

  // fila de envios quando a internet cai (só fases e avatar)
  const FILA = "codigo_arcade_fila";
  const fila = () => { try { return JSON.parse(localStorage.getItem(FILA)) || []; } catch (e) { return []; } };
  const setFila = f => { try { localStorage.setItem(FILA, JSON.stringify(f)); } catch (e) {} };
  async function comFila(item, fn) {
    try { return await fn(); }
    catch (e) { if (e.servidor) throw e; const f = fila().filter(x => !(item.t === "avatar" && x.t === "avatar") && !(item.t === "quarto" && x.t === "quarto")); f.push(item); setFila(f); return { ok: false, pendente: true }; }
  }

  // ================= MODO ONLINE =================
  const online = {
    modo: "online",
    turmas: () => rpc("listar_turmas"),
    cadastrar: (turma, nome, nick, email, senha) => rpc("cadastrar", { p_turma: Number(turma), p_nome: nome, p_nick: nick, p_email: email, p_senha: senha }),
    entrar: (login, senha) => rpc("entrar", { p_login: login, p_senha: senha }),
    trocarSenha: (token, atual, nova) => rpc("trocar_senha", { p_token: token, p_atual: atual, p_nova: nova }),
    salvarFase: (token, faseId, estrelas, xp) => comFila({ t: "fase", token, faseId, estrelas, xp }, () => rpc("salvar_fase", { p_token: token, p_fase: faseId, p_estrelas: estrelas, p_xp: xp })),
    salvarAvatar: (token, avatar) => comFila({ t: "avatar", token, avatar }, () => rpc("salvar_avatar", { p_token: token, p_avatar: avatar })),
    salvarQuarto: (token, quarto) => comFila({ t: "quarto", token, quarto }, () => rpc("salvar_quarto", { p_token: token, p_quarto: quarto })),
    moveis: () => rpc("listar_moveis"),
    comprar: (token, movel) => rpc("comprar_movel", { p_token: token, p_movel: movel }),
    verQuarto: nick => rpc("ver_quarto", { p_nick: nick }),
    ranking: turma => rpc("ranking", { p_turma: Number(turma) }),
    pendentes: () => fila().length,
    async enviarPendentes() {
      const f = fila(); if (!f.length) return 0;
      const resto = [];
      for (const it of f) {
        try {
          if (it.t === "fase") await rpc("salvar_fase", { p_token: it.token, p_fase: it.faseId, p_estrelas: it.estrelas, p_xp: it.xp });
          else if (it.t === "avatar") await rpc("salvar_avatar", { p_token: it.token, p_avatar: it.avatar });
          else if (it.t === "quarto") await rpc("salvar_quarto", { p_token: it.token, p_quarto: it.quarto });
        } catch (e) { if (!e.servidor) resto.push(it); }
      }
      setFila(resto); return resto.length;
    }
  };

  // ================= MODO OFFLINE =================
  const precoLocal = id => ((window.MOVEIS || []).find(m => m.id === id) || {}).preco;
  function perfilLocal(a, turmas) {
    return { id: a.id, nome: a.nome, nick: a.nick, email: a.email, turma_id: a.turma_id, turma: (turmas.find(t => t.id === a.turma_id) || {}).nome,
      avatar: a.avatar, moedas: a.moedas, inventario: a.inventario, quarto: a.quarto, progresso: a.progresso };
  }
  const offline = {
    modo: "offline",
    async turmas() { return (CFG.TURMAS_OFFLINE || ["Minha turma"]).map((nome, i) => ({ id: i + 1, nome })); },
    async cadastrar(turma, nomeBruto, nick, email, senha) {
      const nome = normNome(nomeBruto || ""); email = (email || "").trim().toLowerCase(); nick = (nick || "").trim();
      if (!nome.includes(" ")) return { ok: false, erro: "nome" };
      if (!/^[A-Za-z0-9_.]{3,16}$/.test(nick)) return { ok: false, erro: "nick" };
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return { ok: false, erro: "email" };
      if ((senha || "").length < 6) return { ok: false, erro: "senha" };
      const db = lerLS(); db.alunos = db.alunos || {};
      const lista = Object.values(db.alunos);
      if (lista.some(a => a.nick.toLowerCase() === nick.toLowerCase())) return { ok: false, erro: "nick_existe" };
      if (lista.some(a => a.email === email)) return { ok: false, erro: "email_existe" };
      const id = "local-" + nick.toLowerCase();
      db.alunos[id] = { id, nome, nick, email, turma_id: Number(turma), senha: await hash(id + "#" + senha), avatar: {}, moedas: 100, inventario: {}, quarto: QUARTO_VAZIO(), progresso: {} };
      gravarLS(db);
      return { ok: true, novo: true, token: id, aluno: perfilLocal(db.alunos[id], await this.turmas()) };
    },
    async entrar(login, senha) {
      const db = lerLS(), v = (login || "").trim().toLowerCase();
      const a = Object.values(db.alunos || {}).find(x => x.nick.toLowerCase() === v || x.email === v);
      if (!a || a.senha !== await hash(a.id + "#" + senha)) return { ok: false, erro: "login" };
      return { ok: true, novo: false, token: a.id, aluno: perfilLocal(a, await this.turmas()) };
    },
    async trocarSenha(token, atual, nova) {
      const db = lerLS(), a = db.alunos[token];
      if (a.senha !== await hash(a.id + "#" + atual)) return { ok: false, erro: "senha_atual" };
      if ((nova || "").length < 6) return { ok: false, erro: "senha" };
      a.senha = await hash(a.id + "#" + nova); gravarLS(db); return { ok: true };
    },
    async salvarFase(token, faseId, estrelas, xp) {
      const db = lerLS(), a = db.alunos[token]; if (!a) return { ok: false };
      const p = a.progresso[faseId];
      const ganhou = Math.max(estrelas - (p ? p.estrelas : 0), 0) * 10 + (p ? 0 : 20);
      a.progresso[faseId] = { estrelas: Math.max(estrelas, p ? p.estrelas : 0), xp: Math.max(xp, p ? p.xp : 0) };
      a.moedas += ganhou; gravarLS(db);
      return { ok: true, ganhou, moedas: a.moedas, progresso: a.progresso };
    },
    async salvarAvatar(token, avatar) { const db = lerLS(); if (db.alunos[token]) { db.alunos[token].avatar = avatar; gravarLS(db); } return { ok: true }; },
    async salvarQuarto(token, quarto) { const db = lerLS(); if (db.alunos[token]) { db.alunos[token].quarto = quarto; gravarLS(db); } return { ok: true }; },
    async moveis() { return (window.MOVEIS || []).map(m => ({ id: m.id, nome: m.nome, preco: m.preco })); },
    async comprar(token, movel) {
      const db = lerLS(), a = db.alunos[token], preco = precoLocal(movel);
      if (preco == null) return { ok: false, erro: "movel" };
      if (a.moedas < preco) return { ok: false, erro: "moedas" };
      a.moedas -= preco; a.inventario[movel] = (a.inventario[movel] || 0) + 1; gravarLS(db);
      return { ok: true, moedas: a.moedas, inventario: a.inventario };
    },
    async verQuarto(nick) { const a = Object.values(lerLS().alunos || {}).find(x => x.nick.toLowerCase() === (nick || "").toLowerCase()); return a ? { ok: true, nick: a.nick, avatar: a.avatar, quarto: a.quarto } : { ok: false }; },
    async ranking(turma) {
      return Object.values(lerLS().alunos || {}).filter(a => a.turma_id === Number(turma)).map(a => {
        const v = Object.values(a.progresso);
        return { nick: a.nick, avatar: a.avatar, estrelas: v.reduce((s, x) => s + x.estrelas, 0), xp: v.reduce((s, x) => s + x.xp, 0), fases: v.filter(x => x.estrelas > 0).length };
      }).sort((x, y) => y.estrelas - x.estrelas || y.xp - x.xp);
    },
    pendentes: () => 0,
    enviarPendentes: async () => 0
  };

  window.DADOS = ONLINE ? online : offline;
  window.DADOS.normNome = normNome;
  window.DADOS.professor = {
    async login(email, senha) {
      const r = await fetch(`${URL}/auth/v1/token?grant_type=password`, { method: "POST", headers: { "apikey": KEY, "Content-Type": "application/json" }, body: JSON.stringify({ email, password: senha }) });
      const j = await r.json().catch(() => ({}));
      if (!r.ok || !j.access_token) throw new Error(j.error_description || j.msg || "Login inválido");
      return j.access_token;
    },
    rpc: (fn, args, jwt) => rpc(fn, args, jwt),
    online: ONLINE
  };
})();
