# Guia do projeto para agentes (Antigravity, Claude, Copilot...)

Jogo educacional **Código Arcade**: ensina lógica e Python para alunos do 2º ano do Técnico em Desenvolvimento de Sistemas (SEDUC-SP). Público iniciante e pouco engajado: textos curtos, linguagem simples, muito feedback visual.

## Regras do projeto
- **Sem build e sem framework.** HTML, CSS e JavaScript puros, carregados com `<script>` (não usar `import`/módulos ES, para funcionar também abrindo o arquivo direto).
- **Tudo em português do Brasil**: textos, nomes de variáveis e comentários.
- **Visual pixel art / fliperama**: fontes `Press Start 2P` (títulos e botões) e `VT323` (texto e código), painéis `.box` com rebites, botões `.btn` (`cy`, `gr`, `yl`, `dk`). Não usar imagens externas: avatar, cenários e ícones são desenhados por código.
- **Banco:** o jogo só fala com o banco por `js/dados.js`. Qualquer função nova no banco entra em `supabase/schema.sql` (sempre com `create or replace` e `security definer`, conferindo o token da sessão) e ganha `grant execute` no final do arquivo. Nunca liberar acesso direto às tabelas para `anon`. Nunca colocar a chave `service_role` no front-end.
- O `schema.sql` precisa poder rodar de novo sem erro (idempotente).

## Arquitetura
| Arquivo | Papel |
|---|---|
| `js/config.js` | URL e chave anon do Supabase; turmas do modo offline |
| `js/dados.js` | `DADOS.turmas / cadastrar / entrar / trocarSenha / salvarFase / salvarAvatar / moveis / comprar / salvarQuarto / verQuarto / ranking` (online via RPC ou offline via localStorage) + fila de envios quando cai a internet + login do professor |
| `js/avatar.js` | Avatar isométrico 56×106 (campo `sexo`: "m" ou "f"): cada parte é desenhada numa camada com contorno próprio. `AVATAR.sprite(av, dir, quadro, piscar)` (canvas com cache), `AVATAR.desenhar(canvas, av, escala, comFundo, {dir, quadro, piscar, retrato})`, `AVATAR.animar(...)`, `ESTILOS`, `PALETA`, `ITENS` (chapéus/óculos liberados por estrelas). dir: 0 frente-dir, 1 frente-esq, 2 costas-esq, 3 costas-dir. Use escalas inteiras (1, 2, 3) |
| `js/quarto.js` (desenho) | O quarto é desenhado com resolução dobrada (`setTransform(2…)`) e o avatar entra em tamanho real, por isso fica nítido |
| `js/moveis.js` | `MOVEIS` (id, nome, preco, w, d, andavel, partes, extra) montados com caixas isométricas; `ISO.desenhar`, `ISO.miniatura`. **O id e o preço precisam ser iguais aos da tabela `moveis` no schema.sql** |
| `js/quarto.js` | Classe `Quarto` (piso 8×8): andar com setas/toque/D-pad, porta em (0,2) chama `aoSair`, modo decorar (`pegarDoInventario`, `girar`, `moverSelecionado`, `guardar`), modo visita |
| `js/cenarios.js` | `CENARIO.pintarCenario(canvas, tema, W, H, pontos)` (temas: floresta, praia, deserto, neve, caverna, cidade, circuito), ícones SVG em pixel, `fluxogramaSvg(nos)`, `legendaSvg()` |
| `js/motor.js` | Telas (início, mundos, mapa, fase, resultado, avatar, ranking, caderno, troféus), regras de estrelas e XP |
| `mundos/mundos.js` | `MUNDOS` (n, nome, sub, tema, cor, pronto, guia opcional `{nome, avatar}`) e a lista global `FASES` |
| `mundos/mundoN.js` | `FASES.push({...}, {...})` com as fases do mundo N |
| `professor.html` | Painel do professor (login Supabase Auth + funções `admin_*`) |

## Economia
- Toda conta começa com 100 moedas.
- `salvar_fase` dá 10 moedas por estrela **nova** e +20 na primeira vez que vence a fase (repetir fase não gera moedas infinitas).
- Compras só pelo banco (`comprar_movel`), que confere o preço na tabela `moveis`. O quarto salvo é validado contra o inventário.

## Regras do jogo
- Estrelas da fase: 0 erros = 3★, 1 a 2 erros = 2★, 3 ou mais = 1★. O banco guarda sempre o melhor resultado.
- XP: 10 por desafio acertado de primeira, 5 depois de errar, +50 ao terminar a fase.
- Fase N só libera depois da N-1. Mundo N só libera depois de completar o mundo anterior que esteja pronto.
- Errar nunca bloqueia: mostra uma dica e o aluno tenta de novo.

## Como criar um mundo novo
1. Em `mundos/mundos.js`, mude o mundo para `pronto: true`.
2. Crie `mundos/mundoN.js` (copie a estrutura do `mundo1.js`).
3. Adicione `<script src="mundos/mundoN.js?v=4"></script>` no `index.html` **e** no `professor.html`, depois do último mundo.
4. Sempre que mudar um arquivo `.js`, aumente o número do `?v=` nos dois HTML, para o navegador dos alunos baixar a versão nova.

## Formato de uma fase
```js
{
  id: "m2f1",               // m<mundo>f<fase>: nunca mude o id depois de publicado (é a chave no banco)
  mundo: 2, titulo: "Meu primeiro print",
  chefe: false,             // true na última fase do mundo
  historia: "Fala do personagem guia (2 a 3 frases).",
  aprenda: {                // tela de explicação antes dos desafios
    texto: "HTML simples com <b>destaques</b>.",
    passos: ["..."],        // opcional: lista numerada
    codigo: 'print("Olá")', // opcional: bloco de código Python
    fluxo: [ {f:"terminal", t:"Início"}, ... ], // opcional: fluxograma
    legenda: true           // opcional: legenda das formas
  },
  resumo: "Parágrafo estilo livro que vai para o CADERNO do aluno.",
  desafios: [ ... ]         // de 5 a 6 desafios
}
```

## Tipos de desafio
```js
{ tipo: "quiz", pergunta, opcoes: [..4], certa: 0, dica }
{ tipo: "saida", pergunta, codigo, opcoes, certa, dica }            // o que aparece no terminal
{ tipo: "escolha", pergunta, codigo: "x = @@(...)", opcoes, certa, dicas: ["", "dica p/ opção 1", ...] } // @@ = lacuna
{ tipo: "bug", pergunta, linhas: [...], certa: índice, dica, texto: true|false }  // clicar na linha errada
{ tipo: "ordem", pergunta, linhas: [na ordem certa], dica, texto: true|false }   // o jogo embaralha
{ tipo: "digite", pergunta, codigo, respostas: ["produtos[0]"], dica }          // ignora espaços
{ tipo: "forma", pergunta, texto: "Ler o nome", certa: "dados", dica }         // terminal | dados | processo | decisao
{ tipo: "fluxo", pergunta, nos: [...], opcoes, certa, dica }                    // um nó com t:"?"
{ tipo: "fluxo", formas: true, pergunta, nos: [... {f:"?", t:"Somar"} ...], certa: "processo", dica }
```
Nó de decisão no fluxograma: `{ f: "decisao", t: "Nota >= 6?", sim: "Mostrar Aprovado", nao: "Mostrar Reprovado" }`.

As alternativas de `quiz`, `saida`, `escolha` e `fluxo` aparecem **embaralhadas** na tela (o índice `certa` continua apontando a posição no arquivo). Em `saida`, use `\n` para uma resposta com várias linhas. Em `digite`, a conferência ignora espaços e maiúsculas e aceita aspas simples ou duplas.

Escreva sempre `dica` (ou `dicas` por alternativa): o aluno lê a dica quando erra. Deixe a alternativa certa em qualquer posição (o `certa` aponta o índice).

## Próximas etapas combinadas
- Mapa isométrico andável (sair pela porta do quarto e andar com as setas até as fases), com loja e fase bônus no mapa.
- Fase bônus de plataforma (pular e derrubar bonequinhos), liberada com X de XP.
- Roupas novas no estilo pixel a partir de referências do professor (cada peça precisa ser desenhada para as 4 direções e os quadros de andar).
- E-mail de confirmação e recuperação de senha por e-mail (precisa de SMTP próprio no Supabase).

## Plano dos mundos
1. Vila da Lógica: algoritmos e fluxogramas ✅
2. Praia do Print: `print`, `input`, variáveis, f-string ✅
3. Deserto dos Cálculos: operadores, `int()`, `float()`
4. Montanha das Decisões: `if`, `elif`, `else`
5. Caverna do Loop: `while`, `for`
6. Cidade das Listas: listas e índices
7. Fábrica de Funções: `def`, parâmetros, `return`
8. Papelaria Ponto Certo: projeto final (menu, cadastro, consulta e listagem)

## Testar
- Abrir o `index.html` no navegador (modo offline) e jogar a fase nova até o fim.
- Conferir no console do navegador que não há erros.
- Com Supabase ligado: entrar, vencer uma fase e conferir no `professor.html`.
