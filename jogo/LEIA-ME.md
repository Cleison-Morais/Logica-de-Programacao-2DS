# Ponto Certo Arcade – Semanas 21 e 22

Jogo em pixel art em que o aluno constrói o sistema da **Papelaria Ponto Certo** em Python, fase por fase.

- **Mundo 1 · O Menu** (Semana 21): etapas do menu, funções, opção inválida, `while`, validação do preço e busca.
- **Mundo 2 · A Memória** (Semana 22): listas em memória, índices, `append`/`insert`, `.lower()`, listagem com `for`, lista vazia e total.
- **Chefão:** impedir produto repetido.

São 13 fases e 67 desafios. Quem erra recebe uma dica, tenta de novo e só perde estrelas. As estrelas liberam itens para o avatar. Cada fase vencida libera uma função nova no terminal **Meu Sistema**. Também há ranking da turma e certificado com código de verificação para o AVA.

| Arquivo | Para que serve |
|---|---|
| `index.html` | O jogo |
| `professor.html` | Painel do professor (com senha) |
| `config.js` | Endereço da planilha e lista de turmas |
| `fases.js` | Conteúdo das fases (é aqui que entram fases novas) |
| `avatar.js` | Desenho do avatar e itens |
| `servidor/Code.gs` | Código para colar no Apps Script da planilha |

---

## Passo a passo: ligar a planilha (uma vez só, cerca de 10 minutos)

### 1. Criar a planilha
1. Entre em **sheets.new** com a sua conta Google pessoal.
2. Dê um nome, por exemplo **Ponto Certo Arcade – Notas**.

### 2. Colar o código
1. Na planilha, clique em **Extensões → Apps Script**.
2. Apague o que estiver escrito no editor.
3. Abra o arquivo [`servidor/Code.gs`](servidor/Code.gs) aqui no GitHub, copie **tudo** e cole no editor.
4. Na linha `const SENHA_PROFESSOR = 'troque-esta-senha';`, troque o texto entre aspas pela senha que você quiser usar no painel.
5. Clique no ícone de **disquete** (Salvar).

### 3. Autorizar
1. No alto do editor, escolha a função **configurar** e clique em **Executar**.
2. O Google pede autorização: clique em **Revisar permissões**, escolha sua conta, depois em **Avançado → Acessar (não seguro)** e **Permitir**. O aviso aparece porque o script é seu e não foi publicado pelo Google; isso é normal.
3. Volte para a planilha: vai aparecer a aba **Alunos**.

### 4. Publicar como App da Web
1. No Apps Script, clique em **Implantar → Nova implantação**.
2. Na engrenagem ⚙ ao lado de "Selecione o tipo", escolha **App da Web**.
3. Preencha:
   - **Executar como:** Eu
   - **Quem pode acessar:** Qualquer pessoa
4. Clique em **Implantar** e copie o **URL do app da Web**. Ele termina em `/exec`.

### 5. Colocar o endereço no jogo
Mande o endereço para o Claude, ou faça você mesmo:
1. Aqui no GitHub, abra `jogo/config.js` e clique no **lápis** (Edit).
2. Cole o endereço entre as aspas de `URL_SERVIDOR: ""`.
3. Clique em **Commit changes**.

Em um ou dois minutos o jogo passa a salvar na planilha. A tela inicial muda para **"● ONLINE"**.

> **Se mudar o Code.gs depois:** use **Implantar → Gerenciar implantações → editar (lápis) → Versão: Nova versão → Implantar**. Assim o endereço continua o mesmo.

---

## Links

- **Jogo:** `https://cleison-morais.github.io/Logica-de-Programacao-2DS/jogo/`
- **Painel do professor:** `https://cleison-morais.github.io/Logica-de-Programacao-2DS/jogo/professor.html`

(É preciso que o GitHub Pages esteja ligado no repositório: **Settings → Pages → Branch: main / (root) → Save**.)

## Como o aluno entra
Ele escolhe a turma e digita **nome e sobrenome** e um **PIN de 4 números** que ele mesmo cria. Para voltar outro dia, usa o mesmo nome e PIN. Se esquecer o PIN, você clica em **RESETAR PIN** no painel; o próximo PIN que ele digitar passa a valer.

Se a internet cair, o jogo continua e guarda no computador. Quando a conexão volta, envia para a planilha sozinho.

## O que fica na planilha
Uma linha por aluno: turma, nome, estrelas, XP, fases concluídas, código de verificação, último acesso e uma coluna por fase (`F01`, `F02`...) com as estrelas. Fases novas ganham coluna sozinhas.
