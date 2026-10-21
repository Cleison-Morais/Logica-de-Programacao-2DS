// ============================================================
//  FASES DO JOGO – Ponto Certo Arcade
//  Mundo 1 = Semana 21 (menu no terminal)
//  Mundo 2 = Semana 22 (cadastros em memória com listas)
//
//  Para criar uma fase nova, copie um bloco { ... } e mude o id
//  (F14, F15...). A planilha ganha a coluna nova sozinha.
//
//  Tipos de desafio:
//   quiz    – pergunta com alternativas
//   escolha – completar o código (@@ marca o espaço)
//   saida   – adivinhar o que aparece no terminal
//   bug     – clicar na linha com erro
//   ordem   – montar o código na ordem certa
//   digite  – escrever um pedacinho de código
// ============================================================

window.MUNDOS = [
  { n: 1, nome: "MUNDO 1 · O MENU", sub: "Semana 21 – Programando com menu no terminal", cor: "#ff2a4d" },
  { n: 2, nome: "MUNDO 2 · A MEMÓRIA", sub: "Semana 22 – Agenda e cadastros em memória", cor: "#00e5ff" }
];

window.FASES = [
// ------------------------------------------------------------ MUNDO 1
{
  id: "F01", mundo: 1, titulo: "Primeiro dia na papelaria",
  sistema: "O sistema agora mostra um MENU e recebe a sua escolha.",
  historia: "Bem-vindo à Papelaria Ponto Certo! Eu sou a Dona Célia. Preciso de um sistema no computador do balcão, igual ao menu de um caixa eletrônico. Vamos começar entendendo como um menu funciona?",
  aprenda: {
    texto: "Todo programa com menu segue 5 etapas: <b>ENTRADA</b> (o usuário digita, com <code>input()</code>), <b>PROCESSAMENTO</b> (o programa trabalha com o dado), <b>DECISÃO</b> (escolhe o caminho, com <code>if</code>), <b>SAÍDA</b> (mostra na tela, com <code>print()</code>) e <b>REPETIÇÃO</b> (o menu volta).",
    codigo: `print("1 - Cadastrar produto")
print("0 - Sair")
opcao = input("Escolha: ")     # ENTRADA
if opcao == "1":               # DECISÃO
    print("Cadastrando...")    # SAÍDA`
  },
  desafios: [
    { tipo: "quiz", pergunta: "O cliente digita 1 no teclado. Que etapa é essa?", opcoes: ["Entrada", "Saída", "Decisão", "Repetição"], certa: 0, dica: "É o momento em que a informação ENTRA no programa." },
    { tipo: "quiz", pergunta: "A tela mostra \"Produto cadastrado!\". Que etapa é essa?", opcoes: ["Entrada", "Saída", "Decisão", "Repetição"], certa: 1, dica: "É o resultado que SAI do programa e aparece na tela." },
    { tipo: "escolha", pergunta: "Qual comando RECEBE o que o usuário digita?", codigo: `opcao = @@("Escolha: ")`, opcoes: ["input", "print", "if", "while"], certa: 0, dicas: ["", "print só MOSTRA na tela. Ele não recebe nada.", "if serve para decidir, não para receber.", "while serve para repetir."] },
    { tipo: "escolha", pergunta: "Qual comando DECIDE o caminho do programa?", codigo: `@@ opcao == "1":
    print("Cadastrando...")`, opcoes: ["if", "print", "input", "def"], certa: 0, dicas: ["", "print mostra texto na tela.", "input recebe o que foi digitado.", "def cria uma função."] },
    { tipo: "ordem", pergunta: "Monte o programa na ordem certa: mostrar o menu, receber a opção, decidir e mostrar a resposta.", linhas: [`print("1 - Cadastrar produto")`, `opcao = input("Escolha: ")`, `if opcao == "1":`, `    print("Cadastrando...")`], dica: "Primeiro o menu aparece. Depois a pessoa digita. Só então o programa decide." }
  ]
},
{
  id: "F02", mundo: 1, titulo: "Organizando com funções",
  sistema: "O código do sistema agora está organizado em FUNÇÕES.",
  historia: "O código já está ficando bagunçado! Um programador organizado separa cada tarefa num bloco com nome. Esses blocos se chamam funções.",
  aprenda: {
    texto: "Uma <b>função</b> é um bloco de código com nome. Criamos com <code>def</code>, o nome, os parênteses e os dois-pontos. Os comandos de dentro ficam com recuo (afastados para a direita). A função só roda quando é <b>chamada</b> pelo nome.",
    codigo: `def mostrar_menu():
    print("1 - Cadastrar produto")
    print("0 - Sair")

mostrar_menu()    # chamando a função`
  },
  desafios: [
    { tipo: "escolha", pergunta: "Qual palavra cria uma função?", codigo: `@@ mostrar_menu():
    print("1 - Cadastrar produto")`, opcoes: ["def", "if", "print", "function"], certa: 0, dicas: ["", "if é para decidir.", "print é para mostrar texto.", "Em Python não é function. É uma palavra de 3 letras."] },
    { tipo: "quiz", pergunta: "Criei a função ver_total() com def, mas nunca escrevi ver_total() no programa. O que acontece?", opcoes: ["Ela não é executada", "Ela roda sozinha no início", "O Python apaga a função", "Ela roda no final"], certa: 0, dica: "Criar não basta. A função só roda quando é CHAMADA pelo nome." },
    { tipo: "bug", pergunta: "Este código dá erro. Clique na linha com problema.", linhas: [`def mostrar_menu()`, `    print("1 - Cadastrar produto")`, `    print("0 - Sair")`, ``, `mostrar_menu()`], certa: 0, dica: "Toda linha que começa com def termina com dois-pontos ( : )." },
    { tipo: "saida", pergunta: "O que aparece no terminal?", codigo: `def ola():
    print("Bem-vindo!")

ola()
ola()`, opcoes: ["Bem-vindo!\nBem-vindo!", "Bem-vindo!", "ola()\nola()", "Nada aparece"], certa: 0, dica: "A função foi chamada DUAS vezes." },
    { tipo: "digite", pergunta: "Escreva a linha que CHAMA a função mostrar_menu.", codigo: `def mostrar_menu():
    print("1 - Cadastrar produto")

# escreva aqui a chamada:`, respostas: ["mostrar_menu()"], dica: "Escreva o nome da função seguido de parênteses: nome()" }
  ]
},
{
  id: "F03", mundo: 1, titulo: "Opção inválida",
  sistema: "O sistema agora avisa \"Opção inválida.\" quando digitam algo errado.",
  historia: "Um cliente apertou 8 e o sistema ficou mudo! Ninguém entendeu nada. Um bom sistema confere a escolha antes de usar. Isso se chama validar.",
  aprenda: {
    texto: "<b>Validar</b> é conferir se a informação faz sentido antes de usar. Usamos <code>==</code> para \"igual\" e <code>!=</code> para \"diferente\". Com <code>if</code>, <code>elif</code> (senão, se) e <code>else</code> (senão), tudo que não for opção do menu cai no aviso.",
    codigo: `if opcao == "1":
    cadastrar_produto()
elif opcao == "0":
    print("Saindo...")
else:
    print("Opção inválida.")`
  },
  desafios: [
    { tipo: "quiz", pergunta: "O usuário digita 8, mas o menu só tem 1 e 0. O que o sistema deve fazer?", opcoes: ["Avisar \"Opção inválida.\"", "Fechar o programa", "Não fazer nada", "Escolher a opção 1"], certa: 0, dica: "O usuário precisa saber que errou." },
    { tipo: "escolha", pergunta: "Complete: \"se a opção for DIFERENTE de 1 e DIFERENTE de 0\".", codigo: `if opcao @@ "1" and opcao != "0":
    print("Opção inválida.")`, opcoes: ["!=", "==", "=", ">"], certa: 0, dicas: ["", "== quer dizer IGUAL. Queremos DIFERENTE.", "Um = sozinho guarda valor, não compara.", "> é \"maior que\"."] },
    { tipo: "saida", pergunta: "O que aparece no terminal?", codigo: `opcao = "5"
if opcao == "1":
    print("Cadastrando...")
elif opcao == "0":
    print("Saindo...")
else:
    print("Opção inválida.")`, opcoes: ["Opção inválida.", "Cadastrando...", "Saindo...", "5"], certa: 0, dica: "5 não é 1 nem 0. Então vai para o else." },
    { tipo: "escolha", pergunta: "Qual palavra pega TODO O RESTO que não foi 1 nem 0?", codigo: `if opcao == "1":
    cadastrar_produto()
elif opcao == "0":
    print("Saindo...")
@@
    print("Opção inválida.")`, opcoes: ["else:", "elif:", "if:", "while:"], certa: 0, dicas: ["", "elif sempre precisa de uma condição.", "if começaria uma nova pergunta.", "while repete. Não é isso."] },
    { tipo: "bug", pergunta: "Este código dá erro. Clique na linha com problema.", linhas: [`opcao = input("Escolha: ")`, `if opcao = "1":`, `    print("Cadastrando...")`, `else:`, `    print("Opção inválida.")`], certa: 1, dica: "Para COMPARAR usamos dois iguais (==). Um = sozinho só guarda valor." }
  ]
},
{
  id: "F04", mundo: 1, titulo: "O menu que não desliga",
  sistema: "O menu agora REPETE até o usuário escolher 0 - Sair.",
  historia: "Toda vez que alguém cadastra um produto o sistema fecha e precisa abrir de novo! Imagina um caixa eletrônico que expulsa você depois do saldo. Vamos fazer o menu continuar ligado.",
  aprenda: {
    texto: "O <code>while</code> quer dizer <b>enquanto</b>. Ele repete o bloco enquanto a condição for verdadeira. Usamos uma variável <code>continuar</code> que começa <code>True</code> (ligada). Quando o usuário escolhe 0, ela vira <code>False</code> e o menu para.",
    codigo: `continuar = True
while continuar:
    mostrar_menu()
    opcao = input("Escolha: ")
    if opcao == "0":
        continuar = False`
  },
  desafios: [
    { tipo: "escolha", pergunta: "Qual palavra faz o menu repetir?", codigo: `continuar = True
@@ continuar:
    mostrar_menu()`, opcoes: ["while", "if", "def", "print"], certa: 0, dicas: ["", "if decide uma vez só. Não repete.", "def cria função.", "print só mostra."] },
    { tipo: "quiz", pergunta: "Quando o menu PARA de aparecer?", opcoes: ["Quando continuar vira False", "Depois de 3 voltas", "Nunca", "Quando digita 1"], certa: 0, dica: "while continuar: só repete enquanto continuar for True." },
    { tipo: "escolha", pergunta: "O usuário escolheu 0. Complete para DESLIGAR o menu.", codigo: `elif opcao == "0":
    continuar = @@`, opcoes: ["False", "True", "0", "\"Sair\""], certa: 0, dicas: ["", "True deixaria o menu ligado para sempre!", "Use o valor de desligado do Python.", "Isso é um texto. Precisamos de verdadeiro ou falso."] },
    { tipo: "bug", pergunta: "O menu repete sem parar e nunca deixa digitar. Qual linha está no lugar errado?", linhas: [`continuar = True`, `opcao = input("Escolha: ")`, `while continuar:`, `    mostrar_menu()`, `    if opcao == "0":`, `        continuar = False`], certa: 1, dica: "Para o usuário escolher de novo a cada volta, o input precisa ficar DENTRO do while." },
    { tipo: "ordem", pergunta: "Monte o menu que repete.", linhas: [`continuar = True`, `while continuar:`, `    opcao = input("Escolha: ")`, `    if opcao == "0":`, `        continuar = False`], dica: "Primeiro a variável é criada. Depois vem o while, e lá dentro o input e a decisão." }
  ]
},
{
  id: "F05", mundo: 1, titulo: "Preço não pode ser negativo",
  sistema: "Opção 1 liberada: CADASTRAR PRODUTO, sem aceitar preço errado.",
  historia: "Alguém cadastrou uma caneta por R$ -3,00! Assim eu vou à falência! O sistema precisa recusar preço zero ou negativo e pedir de novo.",
  aprenda: {
    texto: "Usamos um <b>interruptor</b>: a variável <code>preco_valido</code> começa <code>False</code>. O <code>while not preco_valido</code> quer dizer \"<b>enquanto o preço NÃO for válido</b>, pergunte de novo\". Quando o preço é maior que zero, o interruptor liga e o while para.",
    codigo: `preco_valido = False
while not preco_valido:
    preco = float(input("Preço: "))
    if preco > 0:
        preco_valido = True
    else:
        print("Preço inválido.")`
  },
  desafios: [
    { tipo: "quiz", pergunta: "Qual destes preços o sistema deve RECUSAR?", opcoes: ["-3.50", "2.50", "18.90", "0.99"], certa: 0, dica: "Preço precisa ser MAIOR que zero." },
    { tipo: "escolha", pergunta: "Repetir ENQUANTO o preço NÃO for válido.", codigo: `preco_valido = False
while @@:
    preco = float(input("Preço: "))`, opcoes: ["not preco_valido", "preco_valido", "True", "preco > 0"], certa: 0, dicas: ["", "preco_valido começa False, então o while nem começaria. Falta inverter.", "Com True repete para sempre.", "A variável preco ainda nem existe antes do while!"] },
    { tipo: "escolha", pergunta: "Quando o preço é válido?", codigo: `if preco @@ 0:
    preco_valido = True`, opcoes: [">", "<", "==", "<="], certa: 0, dicas: ["", "< aceitaria só preços negativos!", "== aceitaria só o preço zero.", "<= aceitaria zero e negativos."] },
    { tipo: "saida", pergunta: "O usuário digita -2 e depois 5. O que aparece no terminal?", codigo: `preco_valido = False
while not preco_valido:
    preco = float(input("Preço: "))
    if preco > 0:
        preco_valido = True
    else:
        print("Preço inválido.")
print("Produto cadastrado!")`, opcoes: ["Preço inválido.\nProduto cadastrado!", "Produto cadastrado!", "Preço inválido.\nPreço inválido.", "Nada aparece"], certa: 0, dica: "O -2 é recusado. O 5 é aceito e o while termina." },
    { tipo: "quiz", pergunta: "Em Python, como se digita o preço dois reais e cinquenta?", opcoes: ["2.50", "2,50", "R$2,50", "dois e cinquenta"], certa: 0, dica: "No Python os centavos são separados por PONTO." }
  ]
},
{
  id: "F06", mundo: 1, titulo: "Encontrar o produto",
  sistema: "Opção 2 liberada: CONSULTAR PRODUTO pelo nome.",
  historia: "Um cliente perguntou o preço do caderno e eu fiquei procurando no papel! Vamos ensinar o sistema a procurar o produto, caixa por caixa.",
  aprenda: {
    texto: "A busca usa um contador <code>i</code> que começa em 0 e um interruptor <code>encontrado</code>. O while continua <b>enquanto ainda tem produto na lista E ainda não achou</b>. A cada volta, o <code>i += 1</code> passa para o próximo.",
    codigo: `encontrado = False
i = 0
while i < len(produtos) and not encontrado:
    if produtos[i][0] == nome_busca:
        encontrado = True
    i += 1`
  },
  desafios: [
    { tipo: "escolha", pergunta: "A busca começa na PRIMEIRA posição da lista.", codigo: `i = @@`, opcoes: ["0", "1", "-1", "len"], certa: 0, dicas: ["", "Em Python a primeira posição é a 0.", "-1 seria a última posição.", "len é o tamanho da lista, não uma posição."] },
    { tipo: "escolha", pergunta: "Continuar enquanto tem produto na lista E ainda não achou.", codigo: `while i < len(produtos) @@ not encontrado:`, opcoes: ["and", "or", "not", "=="], certa: 0, dicas: ["", "Com or basta UMA ser verdadeira. As DUAS precisam ser.", "not inverte, não junta duas condições.", "== compara, não junta."] },
    { tipo: "escolha", pergunta: "Passar para o próximo produto.", codigo: `i @@ 1`, opcoes: ["+=", "=", "-=", "=="], certa: 0, dicas: ["", "i = 1 deixaria o i sempre em 1.", "-= voltaria para trás.", "== só compara."] },
    { tipo: "quiz", pergunta: "A busca chegou ao fim da lista e não achou. O programa deve:", opcoes: ["Avisar \"Produto não encontrado.\"", "Criar o produto sozinho", "Repetir desde o início", "Fechar sem mensagem"], certa: 0, dica: "O usuário precisa de uma resposta." },
    { tipo: "bug", pergunta: "A busca nunca encontra o PRIMEIRO produto da lista. Qual linha tem o erro?", linhas: [`nome_busca = input("Produto: ")`, `encontrado = False`, `i = 1`, `while i < len(produtos) and not encontrado:`, `    if produtos[i][0] == nome_busca:`, `        encontrado = True`, `    i += 1`], certa: 2, dica: "Em que posição está o primeiro produto da lista?" }
  ]
},
// ------------------------------------------------------------ MUNDO 2
{
  id: "F07", mundo: 2, titulo: "Onde ficam os dados?",
  sistema: "Ao sair, o sistema avisa que os produtos foram apagados da memória.",
  historia: "Ontem cadastrei 20 produtos, fechei o sistema e hoje... sumiu tudo! Por quê?! Vamos entender a memória do computador.",
  aprenda: {
    texto: "Enquanto o programa está aberto, os dados ficam na <b>memória</b>, como numa aba anônima do navegador. Quando o programa fecha, <b>tudo é apagado</b>. Para guardar vários produtos usamos uma <b>lista</b>: <code>produtos = []</code>. O <code>append()</code> coloca um item no final.",
    codigo: `produtos = []
produtos.append("Caderno")
produtos.append("Caneta")
print(produtos)`
  },
  desafios: [
    { tipo: "quiz", pergunta: "O que acontece com uma lista criada só na memória quando o programa é encerrado?", opcoes: ["É apagada", "É salva", "É copiada", "É compartilhada"], certa: 0, dica: "Pense na aba anônima: fechou, sumiu." },
    { tipo: "quiz", pergunta: "Por que usar uma lista em vez de uma variável para cada produto?", opcoes: ["Guarda vários valores com um só nome", "Fica mais colorido", "O Python obriga", "Salva num arquivo"], certa: 0, dica: "Imagine criar 100 variáveis para 100 produtos..." },
    { tipo: "escolha", pergunta: "Crie uma LISTA vazia.", codigo: `produtos = @@`, opcoes: ["[]", "()", "\"\"", "0"], certa: 0, dicas: ["", "Parênteses não criam uma lista.", "Isso é um texto vazio.", "Isso é um número."] },
    { tipo: "saida", pergunta: "O que aparece no terminal?", codigo: `produtos = []
produtos.append("Caderno")
produtos.append("Caneta")
print(produtos)`, opcoes: ["['Caderno', 'Caneta']", "['Caneta', 'Caderno']", "Caderno Caneta", "[]"], certa: 0, dica: "O append coloca no FINAL, na ordem em que foi chamado." },
    { tipo: "quiz", pergunta: "Você cadastrou 10 produtos e o computador desligou antes de salvar. O que aconteceu?", opcoes: ["Os 10 sumiram", "Ficaram salvos", "Só 5 ficaram", "Foram para a nuvem"], certa: 0, dica: "Estavam só na memória." }
  ]
},
{
  id: "F08", mundo: 2, titulo: "Cada coisa no seu lugar",
  sistema: "O sistema agora guarda NOME e PREÇO juntos em cada produto.",
  historia: "Na minha prateleira cada produto tem seu lugar. Na lista do Python também! Cada lugar tem um número chamado índice.",
  aprenda: {
    texto: "Cada item da lista tem uma posição chamada <b>índice</b>, e o primeiro é o <b>0</b>. Na papelaria, cada produto é um par <code>(nome, preço)</code>. Então <code>produtos[0]</code> é o primeiro par, <code>produtos[0][0]</code> é o nome dele e <code>produtos[0][1]</code> é o preço.",
    codigo: `produtos = [("Caneta", 2.5), ("Caderno", 18.9)]
print(produtos[0])      # ('Caneta', 2.5)
print(produtos[0][0])   # Caneta
print(produtos[0][1])   # 2.5`
  },
  desafios: [
    { tipo: "quiz", pergunta: "Na lista [\"Ana\", \"Bruno\", \"Carla\"], qual é o índice de Ana?", opcoes: ["0", "1", "2", "3"], certa: 0, dica: "O primeiro índice é sempre 0." },
    { tipo: "saida", pergunta: "O que aparece no terminal?", codigo: `produtos = ["Caderno", "Caneta", "Borracha"]
print(produtos[2])`, opcoes: ["Borracha", "Caneta", "Caderno", "Erro"], certa: 0, dica: "Conte: 0 = Caderno, 1 = Caneta, 2 = ?" },
    { tipo: "digite", pergunta: "Escreva o código que pega o NOME do Caderno.", codigo: `produtos = [("Caneta", 2.5), ("Caderno", 18.9)]`, respostas: ["produtos[1][0]"], dica: "O Caderno está na posição 1. O nome é a parte 0 do par: produtos[?][?]" },
    { tipo: "saida", pergunta: "O que aparece no terminal?", codigo: `produtos = [("Caneta", 2.5), ("Caderno", 18.9)]
print(produtos[0][1])`, opcoes: ["2.5", "Caneta", "18.9", "Caderno"], certa: 0, dica: "[0] é a Caneta. [1] é a segunda parte do par: o preço." },
    { tipo: "quiz", pergunta: "Uma lista tem 4 produtos. Qual é o índice do ÚLTIMO?", opcoes: ["3", "4", "0", "5"], certa: 0, dica: "Se começa no 0: 0, 1, 2, ..." },
    { tipo: "digite", pergunta: "Escreva o código que pega o PREÇO da Caneta.", codigo: `produtos = [("Caneta", 2.5), ("Caderno", 18.9)]`, respostas: ["produtos[0][1]"], dica: "A Caneta está na posição 0. O preço é a parte 1 do par." }
  ]
},
{
  id: "F09", mundo: 2, titulo: "Na prateleira: append e insert",
  sistema: "Depois de cadastrar, o sistema mostra o TOTAL de produtos.",
  historia: "Chegou mercadoria nova! Preciso colocar produtos no final da prateleira e, às vezes, um em destaque bem no começo.",
  aprenda: {
    texto: "<code>append(x)</code> coloca no <b>final</b> da lista. <code>insert(0, x)</code> coloca na <b>posição 0</b>, ou seja, no começo, e empurra os outros. <code>len(lista)</code> conta quantos itens existem.",
    codigo: `produtos = ["Caneta", "Caderno"]
produtos.append("Régua")      # final
produtos.insert(0, "Lápis")   # começo
print(len(produtos))          # 4`
  },
  desafios: [
    { tipo: "escolha", pergunta: "Adicionar a Régua no FINAL da lista.", codigo: `produtos.@@("Régua")`, opcoes: ["append", "insert", "print", "len"], certa: 0, dicas: ["", "insert precisa da posição e coloca onde você mandar.", "print só mostra.", "len só conta."] },
    { tipo: "saida", pergunta: "O que aparece no terminal?", codigo: `produtos = ["Caneta", "Caderno"]
produtos.insert(0, "Régua")
print(produtos)`, opcoes: ["['Régua', 'Caneta', 'Caderno']", "['Caneta', 'Caderno', 'Régua']", "['Caneta', 'Régua', 'Caderno']", "['Régua']"], certa: 0, dica: "insert(0, ...) coloca na posição 0, o começo." },
    { tipo: "escolha", pergunta: "Mostrar QUANTOS produtos existem.", codigo: `print("Total de produtos:", @@(produtos))`, opcoes: ["len", "count", "sum", "print"], certa: 0, dicas: ["", "count conta um valor específico, não o total.", "sum soma números.", "print dentro de print não conta nada."] },
    { tipo: "saida", pergunta: "O que aparece no terminal?", codigo: `produtos = ["A", "B", "C"]
produtos.append("D")
print(len(produtos))`, opcoes: ["4", "3", "D", "5"], certa: 0, dica: "Eram 3 e entrou mais 1." },
    { tipo: "ordem", pergunta: "Monte a função de cadastro que mostra o total no final.", linhas: [`def cadastrar_produto(produtos):`, `    nome = input("Nome: ")`, `    preco = float(input("Preço: "))`, `    produtos.append((nome, preco))`, `    print("Total de produtos:", len(produtos))`], dica: "Primeiro o def. Depois pede nome, pede preço, guarda na lista e mostra o total." }
  ]
},
{
  id: "F10", mundo: 2, titulo: "Maiúscula ou minúscula?",
  sistema: "A consulta agora acha o produto com letra MAIÚSCULA ou minúscula.",
  historia: "O cliente procurou \"CANETA\" e o sistema disse que não existe. Mas tem caneta na loja! O Python acha que \"Caneta\" e \"CANETA\" são coisas diferentes.",
  aprenda: {
    texto: "Para o Python, <code>\"Caneta\" == \"caneta\"</code> é <b>False</b>. O <code>.lower()</code> transforma o texto todo em minúsculas. Usando nos <b>dois lados</b> da comparação, não importa como o usuário digitou.",
    codigo: `print("CaNeTa".lower())   # caneta

if produtos[i][0].lower() == nome_busca.lower():
    encontrado = True`
  },
  desafios: [
    { tipo: "quiz", pergunta: "Quanto dá \"Caneta\" == \"caneta\" em Python?", opcoes: ["False", "True", "Erro", "caneta"], certa: 0, dica: "C maiúsculo e c minúsculo são letras diferentes para o Python." },
    { tipo: "saida", pergunta: "O que aparece no terminal?", codigo: `print("CaNeTa".lower())`, opcoes: ["caneta", "CANETA", "CaNeTa", "Caneta"], certa: 0, dica: "lower = baixo. Tudo fica minúsculo." },
    { tipo: "escolha", pergunta: "Deixe os DOIS lados em minúsculas.", codigo: `if produtos[i][0].lower() == nome_busca.@@():`, opcoes: ["lower", "upper", "append", "len"], certa: 0, dicas: ["", "upper deixaria MAIÚSCULO, e o outro lado está minúsculo.", "append é de lista.", "len conta letras."] },
    { tipo: "quiz", pergunta: "Por que usar .lower() nos DOIS lados?", opcoes: ["Para não importar como foi digitado", "Para o texto ficar bonito", "Para apagar o produto", "Porque o Python exige"], certa: 0, dica: "Os dois lados precisam estar no mesmo formato para comparar." },
    { tipo: "bug", pergunta: "A busca acha \"caneta\", mas NÃO acha \"CANETA\". Qual linha está errada?", linhas: [`nome_busca = input("Produto: ")`, `encontrado = False`, `i = 0`, `while i < len(produtos) and not encontrado:`, `    if produtos[i][0].lower() == nome_busca:`, `        encontrado = True`, `    i += 1`], certa: 4, dica: "Um lado tem .lower(). E o outro lado?" }
  ]
},
{
  id: "F11", mundo: 2, titulo: "Listando tudo",
  sistema: "Opção 3 liberada: LISTAR PRODUTOS.",
  historia: "No fim do dia eu quero ver TODOS os produtos de uma vez, um embaixo do outro. Para isso existe o for!",
  aprenda: {
    texto: "O <code>for</code> passa por <b>cada item</b> da lista, um de cada vez. Em <code>for produto in produtos:</code>, a variável <code>produto</code> vira o 1º item, depois o 2º, e assim por diante. No menu, a opção 3 chama a função.",
    codigo: `def listar_produtos(produtos):
    for produto in produtos:
        print(produto[0], "- R$", produto[1])

elif opcao == "3":
    listar_produtos(produtos)`
  },
  desafios: [
    { tipo: "escolha", pergunta: "Passar por CADA produto da lista.", codigo: `@@ produto in produtos:
    print(produto)`, opcoes: ["for", "while", "if", "def"], certa: 0, dicas: ["", "O while precisaria de contador. Aqui usamos o comando que já percorre a lista.", "if decide, não percorre.", "def cria função."] },
    { tipo: "saida", pergunta: "O que aparece no terminal?", codigo: `for produto in ["Caneta", "Lápis"]:
    print(produto)`, opcoes: ["Caneta\nLápis", "['Caneta', 'Lápis']", "Caneta", "produto\nproduto"], certa: 0, dica: "Cada volta do for mostra UM produto." },
    { tipo: "escolha", pergunta: "Ligue a opção 3 do menu à função de listar.", codigo: `elif opcao == "3":
    @@`, opcoes: ["listar_produtos(produtos)", "cadastrar_produto(produtos)", "continuar = False", "print(\"3\")"], certa: 0, dicas: ["", "Essa é a opção 1!", "Isso desliga o menu. É a opção 0.", "Isso só escreve 3 na tela."] },
    { tipo: "saida", pergunta: "O que aparece no terminal?", codigo: `produtos = [("Caneta", 2.5)]
for produto in produtos:
    print(f"{produto[0]} - R$ {produto[1]:.2f}")`, opcoes: ["Caneta - R$ 2.50", "Caneta - R$ 2.5", "('Caneta', 2.5)", "produto[0] - R$ produto[1]"], certa: 0, dica: "O :.2f mostra sempre 2 casas depois do ponto." },
    { tipo: "ordem", pergunta: "Monte a função de listagem.", linhas: [`def listar_produtos(produtos):`, `    print("=== Produtos cadastrados ===")`, `    for produto in produtos:`, `        print(produto[0], "- R$", produto[1])`], dica: "def → título → for → print de cada produto." }
  ]
},
{
  id: "F12", mundo: 2, titulo: "Lista vazia e resumo",
  sistema: "A listagem avisa quando está vazia e mostra o TOTAL no final.",
  historia: "Abri o sistema de manhã, pedi para listar e apareceu... nada! Fiquei sem saber se travou. Vamos deixar isso claro, e mostrar o total no final.",
  aprenda: {
    texto: "Antes de listar, conferimos se a lista está vazia com <code>len(produtos) == 0</code>. Se estiver, avisamos <b>\"Nenhum produto cadastrado.\"</b>. Senão, listamos e, <b>depois do for</b> (sem recuo dentro dele), mostramos o total.",
    codigo: `def listar_produtos(produtos):
    if len(produtos) == 0:
        print("Nenhum produto cadastrado.")
    else:
        for produto in produtos:
            print(produto[0], "- R$", produto[1])
        print(f"Total de produtos: {len(produtos)}")`
  },
  desafios: [
    { tipo: "escolha", pergunta: "A lista está VAZIA?", codigo: `if len(produtos) @@ 0:
    print("Nenhum produto cadastrado.")`, opcoes: ["==", "!=", ">", "="], certa: 0, dicas: ["", "!= quer dizer diferente: seria \"tem produto\".", "> 0 quer dizer que TEM produto.", "Um = só guarda valor. Para comparar são dois."] },
    { tipo: "saida", pergunta: "O que aparece no terminal?", codigo: `produtos = []
if len(produtos) == 0:
    print("Nenhum produto cadastrado.")
else:
    print("Tem produto!")`, opcoes: ["Nenhum produto cadastrado.", "Tem produto!", "[]", "0"], certa: 0, dica: "A lista não tem nada. len dá 0." },
    { tipo: "escolha", pergunta: "Mostre o total de produtos.", codigo: `print(f"Total de produtos: {@@}")`, opcoes: ["len(produtos)", "produtos", "produtos[0]", "i"], certa: 0, dicas: ["", "Isso mostraria a lista inteira, não o total.", "Isso é só o primeiro produto.", "i não existe aqui."] },
    { tipo: "bug", pergunta: "O \"Total de produtos\" aparece repetido depois de CADA produto. Qual linha está no lugar errado?", linhas: [`def listar_produtos(produtos):`, `    for produto in produtos:`, `        print(produto[0], "- R$", produto[1])`, `        print("Total de produtos:", len(produtos))`], certa: 3, dica: "Tudo o que tem recuo dentro do for repete a cada volta." },
    { tipo: "quiz", pergunta: "Por que conferir se a lista está vazia antes de listar?", opcoes: ["Para avisar o usuário em vez de não mostrar nada", "Para apagar a lista", "Para cadastrar sozinho", "Não precisa conferir"], certa: 0, dica: "Lembra da Dona Célia sem saber se o sistema travou?" }
  ]
},
{
  id: "F13", mundo: 2, titulo: "CHEFÃO: produto repetido", chefe: true,
  sistema: "O sistema agora IMPEDE cadastrar dois produtos com o mesmo nome. Versão 1.0 completa!",
  historia: "O último desafio! Cadastraram \"Caneta\" e depois \"CANETA\", e agora tenho duas canetas com preços diferentes. Um sistema de verdade não deixa isso acontecer. Derrote esse bug!",
  aprenda: {
    texto: "Antes de cadastrar, o sistema percorre a lista com <code>for</code> e compara os nomes com <code>.lower()</code>. Se achar um igual, liga o interruptor <code>repetido</code>. No fim: se repetido, avisa. Senão, cadastra.",
    codigo: `repetido = False
for produto in produtos:
    if produto[0].lower() == nome.lower():
        repetido = True
if repetido:
    print("Esse produto já existe!")
else:
    produtos.append((nome, preco))`
  },
  desafios: [
    { tipo: "escolha", pergunta: "No começo, ainda não sabemos se é repetido.", codigo: `repetido = @@`, opcoes: ["False", "True", "0", "[]"], certa: 0, dicas: ["", "Começando True, todo produto seria recusado!", "Use verdadeiro ou falso.", "Isso é uma lista."] },
    { tipo: "escolha", pergunta: "Percorrer cada produto.", codigo: `for produto @@ produtos:`, opcoes: ["in", "of", "=", "=="], certa: 0, dicas: ["", "Em Python é uma palavra de 2 letras.", "No for não se usa =.", "== compara."] },
    { tipo: "escolha", pergunta: "Comparar ignorando maiúsculas.", codigo: `if produto[0].lower() == nome.@@():
    repetido = True`, opcoes: ["lower", "upper", "append", "insert"], certa: 0, dicas: ["", "O outro lado está em minúsculo.", "append é de lista.", "insert é de lista."] },
    { tipo: "escolha", pergunta: "Quando avisar que já existe?", codigo: `if @@:
    print("Esse produto já existe!")`, opcoes: ["repetido", "not repetido", "produtos", "nome"], certa: 0, dicas: ["", "not repetido seria quando NÃO existe.", "Isso só confere se a lista tem algo.", "nome sempre tem texto."] },
    { tipo: "ordem", pergunta: "Monte o detector de produto repetido.", linhas: [`repetido = False`, `for produto in produtos:`, `    if produto[0].lower() == nome.lower():`, `        repetido = True`, `if repetido:`, `    print("Esse produto já existe!")`], dica: "Interruptor → for → compara → liga → depois do for, decide." },
    { tipo: "saida", pergunta: "O que aparece no terminal?", codigo: `produtos = [("Caneta", 2.5)]
nome = "CANETA"
repetido = False
for produto in produtos:
    if produto[0].lower() == nome.lower():
        repetido = True
if repetido:
    print("Esse produto já existe!")
else:
    print("Cadastrado!")`, opcoes: ["Esse produto já existe!", "Cadastrado!", "CANETA", "Nada aparece"], certa: 0, dica: "\"caneta\" == \"caneta\" depois do lower()." }
  ]
}
];
