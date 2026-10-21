/* ============================================================
   PONTO CERTO ARCADE – SERVIDOR DA PLANILHA (Google Apps Script)
   Prof. Cleison de Morais Mello

   COMO USAR: veja o passo a passo no arquivo LEIA-ME.md
   ============================================================ */

// 1) TROQUE ESTA SENHA. Ela abre o Painel do Professor.
const SENHA_PROFESSOR = 'troque-esta-senha';

const ABA = 'Alunos';
const CABECALHO = ['turma', 'nome', 'estrelas', 'xp', 'fases_concluidas', 'codigo_verificacao', 'ultimo_acesso', 'criado_em', 'pin_hash', 'avatar', 'progresso'];

/* ---------------- entrada das requisições ---------------- */
function doPost(e) {
  let resp;
  try {
    const d = JSON.parse(e.postData.contents);
    const lock = LockService.getScriptLock();
    lock.waitLock(20000);
    try {
      switch (d.acao) {
        case 'entrar':        resp = entrar(d); break;
        case 'salvar':        resp = salvar(d); break;
        case 'ranking':       resp = ranking(d); break;
        case 'admin_listar':  resp = adminListar(d); break;
        case 'admin_resetar': resp = adminResetar(d); break;
        default: resp = { ok: false, erro: 'acao_desconhecida' };
      }
    } finally { lock.releaseLock(); }
  } catch (err) {
    resp = { ok: false, erro: String(err) };
  }
  return ContentService.createTextOutput(JSON.stringify(resp)).setMimeType(ContentService.MimeType.JSON);
}

function doGet() {
  return ContentService.createTextOutput('Servidor do Ponto Certo Arcade funcionando!');
}

/* ---------------- planilha ---------------- */
function aba() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(ABA);
  if (!sh) {
    sh = ss.insertSheet(ABA);
    sh.getRange(1, 1, 1, CABECALHO.length).setValues([CABECALHO]).setFontWeight('bold').setBackground('#1a1a1a').setFontColor('#ffffff');
    sh.setFrozenRows(1);
  }
  return sh;
}

function cabecalhos(sh) {
  return sh.getRange(1, 1, 1, sh.getLastColumn()).getValues()[0];
}

// Coluna de uma fase (F01, F02...). Cria a coluna se ainda não existir.
function colunaFase(sh, id) {
  const cab = cabecalhos(sh);
  let i = cab.indexOf(id);
  if (i === -1) {
    const c = sh.getLastColumn() + 1;
    sh.getRange(1, c).setValue(id).setFontWeight('bold').setBackground('#1a1a1a').setFontColor('#ffd23f');
    return c;
  }
  return i + 1;
}

function semAcento(s) { return String(s).normalize('NFD').replace(/[̀-ͯ]/g, ''); }
function chave(turma, nome) { return turma + '|' + semAcento(nome).toLowerCase(); }

function acharLinha(sh, turma, nome) {
  const n = sh.getLastRow();
  if (n < 2) return -1;
  const dados = sh.getRange(2, 1, n - 1, 2).getValues();
  const k = chave(turma, nome);
  for (let i = 0; i < dados.length; i++) if (chave(dados[i][0], dados[i][1]) === k) return i + 2;
  return -1;
}

function hashPin(turma, nome, pin) {
  const bytes = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, chave(turma, nome) + '#' + pin + '#pontocerto');
  return bytes.map(b => ('0' + (b & 255).toString(16)).slice(-2)).join('');
}

function lerLinha(sh, r) {
  const cab = cabecalhos(sh);
  const v = sh.getRange(r, 1, 1, cab.length).getValues()[0];
  const o = {};
  cab.forEach((c, i) => o[c] = v[i]);
  return o;
}

function json(s, padrao) { try { return s ? JSON.parse(s) : padrao; } catch (e) { return padrao; } }

/* ---------------- código de verificação (igual ao do jogo) ---------------- */
function fnv(str) {
  let h = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 0x01000193) >>> 0; }
  return h >>> 0;
}
function codigoVerif(turma, nome, estrelas, xp) {
  return 'PC-' + fnv([turma, semAcento(nome).toLowerCase(), estrelas, xp, 'pontocerto'].join('|')).toString(16).toUpperCase().padStart(8, '0').slice(0, 6);
}

/* ---------------- ações ---------------- */
function entrar(d) {
  const sh = aba();
  const r = acharLinha(sh, d.turma, d.nome);
  if (r === -1) {
    if (!d.criar) return { ok: false, erro: 'nao_existe' };
    const agora = new Date();
    const linha = {};
    CABECALHO.forEach(c => linha[c] = '');
    Object.assign(linha, { turma: d.turma, nome: d.nome, estrelas: 0, xp: 0, fases_concluidas: 0, ultimo_acesso: agora, criado_em: agora, pin_hash: hashPin(d.turma, d.nome, d.pin), avatar: '', progresso: '{}' });
    const cab = cabecalhos(sh);
    sh.appendRow(cab.map(c => linha[c] !== undefined ? linha[c] : ''));
    return { ok: true, novo: true, perfil: { nome: d.nome, avatar: null, progresso: {} } };
  }
  const o = lerLinha(sh, r);
  const cab = cabecalhos(sh);
  if (!o.pin_hash) {
    // PIN foi resetado pelo professor: o novo PIN digitado passa a valer
    sh.getRange(r, cab.indexOf('pin_hash') + 1).setValue(hashPin(d.turma, d.nome, d.pin));
  } else if (o.pin_hash !== hashPin(d.turma, d.nome, d.pin)) {
    return { ok: false, erro: 'pin' };
  }
  sh.getRange(r, cab.indexOf('ultimo_acesso') + 1).setValue(new Date());
  return { ok: true, novo: false, perfil: { nome: o.nome, avatar: json(o.avatar, null), progresso: json(o.progresso, {}) } };
}

function salvar(d) {
  const sh = aba();
  const r = acharLinha(sh, d.turma, d.nome);
  if (r === -1) return { ok: false, erro: 'nao_existe' };
  const o = lerLinha(sh, r);
  if (o.pin_hash && o.pin_hash !== hashPin(d.turma, d.nome, d.pin)) return { ok: false, erro: 'pin' };
  // junta com o que já está na planilha, guardando o melhor resultado de cada fase
  const prog = json(o.progresso, {});
  Object.keys(d.progresso || {}).forEach(k => {
    const v = d.progresso[k], a = prog[k];
    if (!a || (v.estrelas || 0) > (a.estrelas || 0) || ((v.estrelas || 0) === (a.estrelas || 0) && (v.xp || 0) > (a.xp || 0))) prog[k] = v;
  });
  let estrelas = 0, xp = 0, fases = 0;
  Object.keys(prog).forEach(k => { estrelas += prog[k].estrelas || 0; xp += prog[k].xp || 0; if ((prog[k].estrelas || 0) > 0) fases++; });
  const ids = Object.keys(prog).sort();
  ids.forEach(id => colunaFase(sh, id)); // garante as colunas antes de escrever
  const cab = cabecalhos(sh);
  const set = (c, v) => sh.getRange(r, cab.indexOf(c) + 1).setValue(v);
  set('estrelas', estrelas);
  set('xp', xp);
  set('fases_concluidas', fases);
  set('codigo_verificacao', codigoVerif(o.turma, o.nome, estrelas, xp));
  set('ultimo_acesso', new Date());
  if (!o.pin_hash) set('pin_hash', hashPin(d.turma, d.nome, d.pin));
  if (d.avatar) set('avatar', JSON.stringify(d.avatar));
  set('progresso', JSON.stringify(prog));
  ids.forEach(id => set(id, prog[id].estrelas || 0));
  return { ok: true, estrelas: estrelas, xp: xp };
}

function ranking(d) {
  const sh = aba();
  const n = sh.getLastRow();
  if (n < 2) return { ok: true, lista: [] };
  const cab = cabecalhos(sh);
  const v = sh.getRange(2, 1, n - 1, cab.length).getValues();
  const idx = c => cab.indexOf(c);
  const lista = v.filter(l => l[idx('turma')] === d.turma).map(l => ({
    nome: l[idx('nome')], estrelas: Number(l[idx('estrelas')]) || 0, xp: Number(l[idx('xp')]) || 0,
    fases: Number(l[idx('fases_concluidas')]) || 0, avatar: json(l[idx('avatar')], null)
  }));
  return { ok: true, lista: lista };
}

function adminListar(d) {
  if (d.senha !== SENHA_PROFESSOR) return { ok: false, erro: 'senha' };
  const sh = aba();
  const n = sh.getLastRow();
  if (n < 2) return { ok: true, lista: [] };
  const cab = cabecalhos(sh);
  const v = sh.getRange(2, 1, n - 1, cab.length).getValues();
  const idx = c => cab.indexOf(c);
  const lista = v.map((l, i) => ({
    linha: i + 2, turma: l[idx('turma')], nome: l[idx('nome')], estrelas: Number(l[idx('estrelas')]) || 0, xp: Number(l[idx('xp')]) || 0,
    fases: Number(l[idx('fases_concluidas')]) || 0, codigo: l[idx('codigo_verificacao')],
    ultimo: l[idx('ultimo_acesso')] ? Utilities.formatDate(new Date(l[idx('ultimo_acesso')]), 'America/Sao_Paulo', 'dd/MM HH:mm') : '',
    avatar: json(l[idx('avatar')], null), progresso: json(l[idx('progresso')], {}), semPin: !l[idx('pin_hash')]
  }));
  return { ok: true, lista: lista };
}

function adminResetar(d) {
  if (d.senha !== SENHA_PROFESSOR) return { ok: false, erro: 'senha' };
  const sh = aba();
  const r = acharLinha(sh, d.turma, d.nome);
  if (r === -1) return { ok: false, erro: 'nao_existe' };
  const cab = cabecalhos(sh);
  sh.getRange(r, cab.indexOf('pin_hash') + 1).setValue('');
  return { ok: true };
}

// Rode esta função UMA vez pelo editor para criar a aba e autorizar o script.
function configurar() {
  aba();
  Logger.log('Aba "' + ABA + '" pronta!');
}
