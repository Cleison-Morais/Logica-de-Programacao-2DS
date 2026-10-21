# Código Arcade

Jogo em pixel art para aprender lógica de programação e Python, fase por fase.
O aluno cria uma conta, monta um avatar no estilo dos hotéis de pixel, decora o próprio quarto com móveis comprados com moedas, vence fases com desafios e acompanha o ranking da turma.
O progresso fica salvo num banco de dados na nuvem (Supabase), então o aluno pode jogar de qualquer lugar.

**Técnico em Desenvolvimento de Sistemas · Prof. Cleison de Morais Mello**

## O que já tem

| Parte | Situação |
|---|---|
| Mundo 1 · Vila da Lógica (algoritmos e fluxogramas) | ✅ 7 fases, 39 desafios |
| Mundo 2 · Praia do Print (print, input, variáveis e f-string) | ✅ 7 fases, 40 desafios |
| Mundos 3 a 8 (cálculos, decisões, repetição, listas, funções, projeto final) | 🔜 aparecem como EM BREVE |
| Conta com e-mail da escola, senha e nickname (entra com o nick ou o e-mail) | ✅ |
| Avatar isométrico em alta definição (masculino e feminino), 4 direções e animação de andar: 13 cabelos, 7 expressões (com cara de mal), 9 roupas, 5 calças/saias, 5 calçados | ✅ |
| 12 chapéus, laço e óculos liberados com estrelas (boné, gorro, fone, cartola, cowboy, mago, coroa...) | ✅ |
| Quarto isométrico: anda com as setas, tocando no chão ou com o controle na tela; a porta leva aos mundos | ✅ |
| Moedas (10 por estrela nova + 20 por fase vencida) e loja com 14 móveis | ✅ |
| Modo DECORAR (colocar, girar, mover, guardar; trocar piso e parede) e visita ao quarto dos colegas | ✅ |
| Caderno com o resumo de cada fase vencida | ✅ |
| Ranking da turma | ✅ |
| Troféu por mundo com código de verificação para o AVA | ✅ |
| Painel do professor (alunos, estrelas por fase, resetar senha, dar moedas, turmas, CSV) | ✅ |
| Banco de dados Supabase com segurança (senha embaralhada, bloqueio após 5 erros, moedas e preços controlados pelo banco) | ✅ |
| Funciona no celular (tela adaptável e controle por toque) | ✅ |
| Modo offline (sem banco, salva no navegador) | ✅ |

## Estrutura

```
index.html            → o jogo
professor.html        → painel do professor
css/estilo.css        → visual (pixel art)
js/config.js          → endereço e chave do Supabase  ← você edita aqui
js/dados.js           → conversa com o banco (online) ou com o navegador (offline)
js/avatar.js          → avatar isométrico (4 direções, andar) e chapéus/óculos
js/moveis.js          → móveis isométricos (desenho e preço)
js/quarto.js          → quarto: andar, porta, decorar
js/cenarios.js        → cenários dos mapas, ícones e fluxogramas
js/motor.js           → telas, fases, desafios, ranking, caderno, troféus
mundos/mundos.js      → lista dos 8 mundos
mundos/mundo1.js      → fases do Mundo 1
mundos/mundo2.js      → fases do Mundo 2
supabase/schema.sql   → tabelas, segurança e funções do banco
fontes/               → fontes pixel (licença OFL)
```

Não tem etapa de build: são arquivos HTML, CSS e JavaScript puros.

## Rodar no computador

- **Jeito mais fácil:** dê dois cliques no `index.html`.
- **Com servidor local** (recomendado no Antigravity): no terminal da pasta, rode `python -m http.server 8000` e abra `http://localhost:8000`.

Com o `js/config.js` vazio, o jogo funciona no **modo offline**.

## Ligar o banco de dados (Supabase) – uma vez só

1. Crie uma conta grátis em **supabase.com** e clique em **New project**. Escolha a região **South America (São Paulo)** e anote a senha do banco.
2. No menu do projeto, abra **SQL Editor → New query**. Cole todo o conteúdo de `supabase/schema.sql` e clique em **Run**. Isso cria as tabelas, as regras de segurança e as turmas iniciais.
3. Vá em **Project Settings → API** (ou **Data API**) e copie:
   - **Project URL** → coloque em `SUPABASE_URL` no `js/config.js`
   - **anon public key** → coloque em `SUPABASE_ANON_KEY`

   ⚠️ Nunca use a chave **service_role** no jogo.
4. Crie o seu login de professor: **Authentication → Users → Add user → Create new user**. Informe e-mail e senha e marque **Auto Confirm User**.
5. Volte ao **SQL Editor** e rode, trocando o e-mail:
   ```sql
   insert into public.professores (user_id, nome)
   select id, 'Prof. Cleison' from auth.users where email = 'SEU_EMAIL_AQUI'
   on conflict do nothing;
   ```
6. Abra o `professor.html`, entre com esse e-mail e senha e confira as turmas na aba **TURMAS**.

> No plano grátis, o Supabase pausa o projeto depois de 7 dias sem uso. Se isso acontecer, entre no painel do Supabase e clique em **Restore project**.

## Publicar na internet

**GitHub Pages:**
1. Crie um repositório público, por exemplo `codigo-arcade`, e envie todos os arquivos da pasta.
2. Vá em **Settings → Pages → Branch: main / (root) → Save**.
3. Em um ou dois minutos, o jogo fica em `https://SEU_USUARIO.github.io/codigo-arcade/` e o painel em `.../professor.html`.

**Netlify (alternativa):** entre em **app.netlify.com/drop** e arraste a pasta inteira.

## Como o aluno entra

Na primeira vez, o aluno clica em **CRIAR CONTA** e informa nome e sobrenome, um **nickname** (o nome que aparece no jogo), o **e-mail da escola**, uma **senha** (mínimo 6) e a turma. Depois disso, ele entra com o **nickname ou o e-mail** e a senha.

- O domínio aceito está em `DOMINIO_EMAIL` no `js/config.js` (hoje `al.educacao.sp.gov.br`). Deixe `""` para aceitar qualquer e-mail.
- Não há e-mail de confirmação por enquanto.
- Se o aluno errar a senha 5 vezes, a conta fica bloqueada por 10 minutos.
- **Esqueceu a senha?** O professor clica em **RESETAR SENHA** no painel. No próximo acesso, a senha que o aluno digitar passa a valer. O aluno também pode trocar a senha clicando no próprio nome, no topo da tela.

> **Atualizando de uma versão anterior:** se você já tinha rodado o `schema.sql` antigo (com PIN), rode o novo de novo. Os alunos antigos precisarão criar conta nova.

## Criar fases e mundos novos

Veja o arquivo `AGENTS.md`. Ele explica o formato das fases e pode ser usado pelo agente do Antigravity.
