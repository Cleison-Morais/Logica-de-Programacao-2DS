// ============================================================
//  MUNDO 2 · PRAIA DO PRINT – print, input e variáveis
//  Guia: Capitã Print, salva-vidas da praia.
//  Aqui o aluno sai do fluxograma e escreve as primeiras linhas em Python.
// ============================================================
FASES.push(
{
  id: "m2f1", mundo: 2, titulo: "Meu primeiro print",
  historia: "Ahoy! Eu sou a Capitã Print, salva-vidas da Praia do Print. Aqui o computador finalmente vai FALAR com você. E a palavra mágica para isso é uma só: print.",
  aprenda: {
    texto: "O comando <b>print()</b> mostra uma mensagem na tela (no <b>terminal</b>). O que vai aparecer fica <b>dentro dos parênteses</b>. Quando é um texto, ele precisa estar <b>entre aspas</b>. As aspas não aparecem na tela: elas só avisam ao Python onde o texto começa e termina.",
    codigo: 'print("Olá, mundo!")\nprint("Bem-vindo à Praia do Print")'
  },
  resumo: "O comando print() serve para mostrar informações na tela do computador, no terminal. Tudo o que queremos mostrar fica dentro dos parênteses. Quando é um texto, ele precisa estar entre aspas, que podem ser duplas ou simples. As aspas não aparecem no resultado: elas apenas marcam onde o texto começa e onde termina. Cada print mostra a sua mensagem em uma linha nova, na mesma ordem em que os comandos foram escritos.",
  desafios: [
    { tipo: "quiz", pergunta: "Para que serve o comando print() em Python?", opcoes: ["Mostrar uma mensagem na tela", "Imprimir uma folha na impressora", "Apagar o programa", "Desligar o computador"], certa: 0, dica: "Pense no terminal: o print faz o programa \"falar\" na tela." },
    { tipo: "saida", pergunta: "O que aparece no terminal?", codigo: 'print("Bom dia!")', opcoes: ["Bom dia!", "\"Bom dia!\"", "print(\"Bom dia!\")", "Nada aparece"], certa: 0, dica: "As aspas e o print não aparecem: só o texto que está dentro das aspas." },
    { tipo: "escolha", pergunta: "Complete para mostrar Oi na tela.", codigo: '@@("Oi")', opcoes: ["print", "mostrar", "Print", "escrever"], certa: 0, dicas: ["", "O Python é em inglês: o comando é print.", "O Python diferencia maiúsculas de minúsculas. Print com P maiúsculo não existe.", "O Python é em inglês: o comando é print."] },
    { tipo: "saida", pergunta: "O que aparece no terminal?", codigo: 'print("Areia")\nprint("Mar")', opcoes: ["Areia\nMar", "Mar\nAreia", "AreiaMar", "Areia Mar"], certa: 0, dica: "Cada print escreve numa linha nova, na ordem em que aparece no código." },
    { tipo: "quiz", pergunta: "Por que o texto fica entre aspas no print(\"Olá\")?", opcoes: ["Para o Python saber onde o texto começa e termina", "Para o texto ficar em negrito", "Porque as aspas aparecem na tela", "Não precisa de aspas"], certa: 0, dica: "As aspas são como as bordas de uma caixa: marcam o começo e o fim do texto." }
  ]
},
{
  id: "m2f2", mundo: 2, titulo: "Caçando erros no print",
  historia: "Uma onda bagunçou os códigos da praia! Tem aspas faltando, parêntese sumido e letra trocada. Um salva-vidas de verdade encontra o problema rapidinho.",
  aprenda: {
    texto: "O Python é muito exigente. Os erros mais comuns no começo são: <b>esquecer uma das aspas</b>, <b>esquecer um parêntese</b> e escrever <b>Print</b> com letra maiúscula. Quando isso acontece, o programa para e mostra uma mensagem de erro (em vermelho no terminal). Calma: o erro só diz o que precisa ser arrumado.",
    codigo: 'print("Certo")\nprint("Errado)     # falta fechar as aspas\nprint "Errado"     # faltam os parênteses\nPrint("Errado")    # P maiúsculo'
  },
  resumo: "O Python segue regras rígidas de escrita, chamadas de sintaxe. No print, o texto precisa estar entre aspas que abrem e fecham, os parênteses também precisam abrir e fechar, e o nome do comando é escrito todo em letras minúsculas. Quando uma dessas regras é quebrada, o programa para e mostra uma mensagem de erro no terminal. Ler essa mensagem com calma ajuda a descobrir a linha com problema e corrigir o código.",
  desafios: [
    { tipo: "bug", pergunta: "Uma linha tem erro. Clique nela.", linhas: ['print("Protetor solar")', 'print("Guarda-sol)', 'print("Toalha")'], certa: 1, dica: "Confira se todas as aspas abrem E fecham." },
    { tipo: "bug", pergunta: "Qual linha vai dar erro?", linhas: ['print("Sorvete")', 'Print("Picolé")', 'print("Água de coco")'], certa: 1, dica: "O Python diferencia letras maiúsculas e minúsculas." },
    { tipo: "bug", pergunta: "Encontre a linha com problema.", linhas: ['print("Onda")', 'print("Prancha")', 'print("Surf"'], certa: 2, dica: "Todo parêntese que abre precisa fechar." },
    { tipo: "quiz", pergunta: "O que acontece quando o código tem um erro de escrita (sintaxe)?", opcoes: ["O programa para e mostra uma mensagem de erro", "O computador quebra", "O Python corrige sozinho", "O programa funciona normalmente"], certa: 0, dica: "O Python avisa o problema no terminal, geralmente em vermelho." },
    { tipo: "escolha", pergunta: "Complete o que está faltando no final da linha.", codigo: 'print("Bem-vindo à praia"@@', opcoes: [")", "\"", ";", "("], certa: 0, dicas: ["", "As aspas já fecharam. O que falta fechar agora?", "Em Python não precisa de ponto e vírgula.", "Esse parêntese abre. Precisamos de um que FECHA."] },
    { tipo: "digite", pergunta: "Digite o código completo para mostrar na tela: Oi, praia!", respostas: ['print("Oi, praia!")'], dica: "Use print, abra parênteses, coloque o texto entre aspas e feche: print(\"...\")" }
  ]
},
{
  id: "m2f3", mundo: 2, titulo: "Variáveis: as caixinhas",
  historia: "Na barraca da praia, cada coisa fica numa caixa com etiqueta: uma para as pranchas, outra para os baldes. No Python também é assim, e essas caixas se chamam variáveis.",
  aprenda: {
    texto: "Uma <b>variável</b> é uma caixinha com nome que guarda um valor. Usamos o sinal de <b>=</b> para colocar o valor na caixa: o nome fica à esquerda e o valor à direita. Depois, é só usar o nome para pegar o valor. Atenção: <b>print(nome)</b> mostra o que está guardado, mas <b>print(\"nome\")</b> mostra a palavra nome.",
    codigo: 'nome = "Ana"\nprint(nome)      # mostra: Ana\nprint("nome")    # mostra: nome'
  },
  resumo: "Variável é um espaço na memória do computador, com um nome, que guarda um valor para ser usado depois. Em Python, criamos uma variável com o sinal de igual: o nome fica à esquerda e o valor à direita, como em nome = \"Ana\". Para usar o valor guardado, escrevemos o nome da variável sem aspas. O nome da variável não pode ter espaços nem começar com número, e é bom que ele explique o que está guardado, como idade, nome ou preco.",
  desafios: [
    { tipo: "quiz", pergunta: "O que é uma variável?", opcoes: ["Uma caixinha com nome que guarda um valor", "Um erro no programa", "Um tipo de computador", "Um comando que mostra texto"], certa: 0, dica: "Lembre da barraca da praia: cada caixa tem uma etiqueta." },
    { tipo: "saida", pergunta: "O que aparece no terminal?", codigo: 'praia = "Copacabana"\nprint(praia)', opcoes: ["Copacabana", "praia", "\"Copacabana\"", "praia = Copacabana"], certa: 0, dica: "Sem aspas, o print mostra o que está DENTRO da variável." },
    { tipo: "saida", pergunta: "E agora, o que aparece?", codigo: 'praia = "Copacabana"\nprint("praia")', opcoes: ["praia", "Copacabana", "Erro", "\"praia\""], certa: 0, dica: "Com aspas, é só um texto. O Python mostra a palavra exatamente como está." },
    { tipo: "quiz", pergunta: "Qual destes é um nome de variável VÁLIDO em Python?", opcoes: ["nome_cliente", "nome cliente", "1nome", "nome-cliente"], certa: 0, dica: "Não pode ter espaço, não pode começar com número e o traço (-) não vale. O sublinhado (_) pode." },
    { tipo: "escolha", pergunta: "Complete para guardar a cidade na variável.", codigo: 'cidade @@ "Santos"\nprint(cidade)', opcoes: ["=", "==", ":", "->"], certa: 0, dicas: ["", "Dois iguais (==) servem para comparar. Para guardar, é um só.", "Os dois pontos não guardam valores em Python.", "Essa seta não guarda valores em Python."] },
    { tipo: "ordem", pergunta: "Monte o código: guardar o nome e depois mostrar na tela.", linhas: ['nome = "Leo"', 'print(nome)'], dica: "Primeiro a caixa precisa receber o valor. Só depois dá para mostrar o que tem dentro." }
  ]
},
{
  id: "m2f4", mundo: 2, titulo: "Trocando o valor",
  historia: "A maré subiu e mudou tudo de lugar! As caixinhas também podem trocar o que guardam. Mas cuidado: quando entra um valor novo, o antigo vai embora com a onda.",
  aprenda: {
    texto: "Uma variável guarda <b>um valor de cada vez</b>. Se você usar o <b>=</b> de novo com a mesma variável, o valor antigo é <b>substituído</b>. O Python lê o código <b>de cima para baixo</b>: o print mostra o valor que a variável tem <b>naquele momento</b>.",
    codigo: 'clima = "sol"\nprint(clima)     # sol\nclima = "chuva"\nprint(clima)     # chuva'
  },
  resumo: "Uma variável guarda apenas um valor por vez. Quando atribuímos um novo valor a uma variável que já existe, o valor anterior é apagado e substituído pelo novo. Como o Python executa o código de cima para baixo, uma linha por vez, o resultado de um print depende do valor que a variável tem no momento em que aquela linha é executada. Por isso, a ordem das linhas muda o que aparece na tela.",
  desafios: [
    { tipo: "saida", pergunta: "O que aparece no terminal?", codigo: 'sorvete = "morango"\nsorvete = "chocolate"\nprint(sorvete)', opcoes: ["chocolate", "morango", "morango\nchocolate", "sorvete"], certa: 0, dica: "O segundo = substituiu o primeiro valor." },
    { tipo: "saida", pergunta: "O que aparece no terminal?", codigo: 'mar = "calmo"\nprint(mar)\nmar = "agitado"\nprint(mar)', opcoes: ["calmo\nagitado", "agitado\nagitado", "calmo\ncalmo", "agitado\ncalmo"], certa: 0, dica: "Leia de cima para baixo: em cada print, qual valor a variável tinha NAQUELE momento?" },
    { tipo: "quiz", pergunta: "Quantos valores uma variável guarda ao mesmo tempo?", opcoes: ["Um só", "Dois", "Quantos quiser", "Nenhum"], certa: 0, dica: "Quando chega um valor novo, o antigo vai embora." },
    { tipo: "saida", pergunta: "O que aparece no terminal?", codigo: 'a = "praia"\nb = a\na = "piscina"\nprint(b)', opcoes: ["praia", "piscina", "a", "b"], certa: 0, dica: "Quando b = a foi executado, a ainda guardava \"praia\". Mudar a depois não muda b." },
    { tipo: "ordem", pergunta: "Monte o código para aparecer primeiro \"manhã\" e depois \"tarde\".", linhas: ['periodo = "manhã"', 'print(periodo)', 'periodo = "tarde"', 'print(periodo)'], dica: "Guarde, mostre, troque e mostre de novo." }
  ]
},
{
  id: "m2f5", mundo: 2, titulo: "input: o programa pergunta",
  historia: "O quiosque da praia quer anotar o nome de cada cliente. Até agora o programa só falava. Agora ele vai OUVIR: com o input, quem usa o programa digita a resposta.",
  aprenda: {
    texto: "O comando <b>input()</b> faz uma pergunta e <b>espera</b> a pessoa digitar e apertar ENTER. O texto entre aspas é a pergunta. A resposta precisa ser <b>guardada numa variável</b>, senão ela se perde. Importante: tudo o que vem do input é <b>texto</b>, mesmo que a pessoa digite um número.",
    codigo: 'nome = input("Qual é o seu nome? ")\nprint("Olá,", nome)'
  },
  resumo: "O comando input() permite que o programa receba informações digitadas pelo usuário. O texto entre aspas dentro do input é a pergunta que aparece na tela. O programa fica esperando até a pessoa digitar e apertar ENTER. A resposta deve ser guardada em uma variável, como em nome = input(\"Qual é o seu nome? \"), para ser usada depois. Tudo o que vem do input chega como texto, mesmo quando a pessoa digita números; no próximo mundo veremos como transformar esse texto em número para fazer contas.",
  desafios: [
    { tipo: "quiz", pergunta: "Para que serve o comando input()?", opcoes: ["Receber o que o usuário digita", "Mostrar uma mensagem", "Apagar uma variável", "Fechar o programa"], certa: 0, dica: "input = entrada. É a ENTRADA de dados que vimos no Mundo 1." },
    { tipo: "escolha", pergunta: "Complete para perguntar a idade e guardar a resposta.", codigo: 'idade = @@("Quantos anos você tem? ")', opcoes: ["input", "print", "pergunta", "ler"], certa: 0, dicas: ["", "O print só mostra. Para RECEBER o que a pessoa digita, usamos outro comando.", "Os comandos do Python são em inglês.", "Os comandos do Python são em inglês."] },
    { tipo: "quiz", pergunta: "O que acontece quando o programa chega numa linha com input()?", opcoes: ["Ele mostra a pergunta e espera a pessoa digitar e apertar ENTER", "Ele pula a linha", "Ele inventa uma resposta", "Ele termina o programa"], certa: 0, dica: "O programa fica parado, esperando a resposta." },
    { tipo: "saida", pergunta: "A pessoa digitou Bia e apertou ENTER. O que aparece por último?", codigo: 'nome = input("Nome: ")\nprint(nome)', opcoes: ["Bia", "nome", "Nome:", "input"], certa: 0, dica: "A variável nome guardou o que a pessoa digitou." },
    { tipo: "bug", pergunta: "Esta linha pergunta, mas a resposta se PERDE. Qual é?", linhas: ['nome = input("Seu nome: ")', 'input("Sua cidade: ")', 'print(nome)'], certa: 1, dica: "Qual input não guarda a resposta numa variável?" },
    { tipo: "quiz", pergunta: "A pessoa digitou 15 no input. Que tipo de dado o Python recebe?", opcoes: ["Texto (string)", "Número inteiro", "Número decimal", "Nada"], certa: 0, dica: "Tudo o que vem do input chega como texto." }
  ]
},
{
  id: "m2f6", mundo: 2, titulo: "Juntando textos",
  historia: "O quiosque quer imprimir uma mensagem caprichada: \"Olá, Bia! Seu pedido saiu.\" Para isso, precisamos juntar o texto fixo com o que está guardado nas variáveis.",
  aprenda: {
    texto: "Existem 3 jeitos de juntar texto e variável no print. Com <b>vírgula</b>, o Python coloca um espaço sozinho. Com <b>+</b>, ele cola tudo sem espaço (você coloca o espaço dentro das aspas). Com <b>f-string</b>, você escreve <b>f</b> antes das aspas e coloca a variável entre <b>{chaves}</b>.",
    codigo: 'nome = "Bia"\nprint("Olá,", nome)     # Olá, Bia\nprint("Olá, " + nome)   # Olá, Bia\nprint(f"Olá, {nome}!")  # Olá, Bia!'
  },
  resumo: "Para mostrar textos fixos junto com o valor de variáveis, o Python oferece algumas formas. Separando por vírgula dentro do print, os valores aparecem com um espaço entre eles. Com o sinal de mais, os textos são colados sem espaço, então o espaço precisa estar dentro das aspas. A forma mais prática é a f-string: colocamos a letra f antes das aspas e escrevemos o nome da variável entre chaves no lugar onde o valor deve aparecer, como em print(f\"Olá, {nome}!\").",
  desafios: [
    { tipo: "saida", pergunta: "O que aparece no terminal?", codigo: 'fruta = "manga"\nprint("Suco de", fruta)', opcoes: ["Suco de manga", "Suco demanga", "Suco de fruta", "\"Suco de\" manga"], certa: 0, dica: "A vírgula coloca um espaço entre as partes." },
    { tipo: "saida", pergunta: "O que aparece no terminal?", codigo: 'fruta = "manga"\nprint("Suco de" + fruta)', opcoes: ["Suco demanga", "Suco de manga", "Suco de + manga", "Erro"], certa: 0, dica: "O + cola os textos sem colocar espaço." },
    { tipo: "saida", pergunta: "O que aparece no terminal?", codigo: 'nome = "Leo"\nprint(f"Bom dia, {nome}!")', opcoes: ["Bom dia, Leo!", "Bom dia, {nome}!", "f\"Bom dia, Leo!\"", "Bom dia, nome!"], certa: 0, dica: "Na f-string, o que está entre chaves é trocado pelo valor da variável." },
    { tipo: "escolha", pergunta: "Complete a f-string para mostrar o nome guardado.", codigo: 'nome = "Ana"\nprint(f"Olá, @@!")', opcoes: ["{nome}", "nome", "(nome)", "[nome]"], certa: 0, dicas: ["", "Sem chaves, aparece a palavra nome, e não o valor.", "Na f-string usamos chaves { }, não parênteses.", "Na f-string usamos chaves { }, não colchetes."] },
    { tipo: "bug", pergunta: "Esta f-string esqueceu um detalhe e vai mostrar {cidade} na tela. Qual linha?", linhas: ['cidade = "Ubatuba"', 'print("Bem-vindo a {cidade}")', 'print(f"Volte sempre a {cidade}")'], certa: 1, dica: "Para as chaves funcionarem, precisa de uma letra antes das aspas." },
    { tipo: "digite", pergunta: "A variável produto guarda \"picolé\". Digite o print com f-string para mostrar: Vendido: picolé", codigo: 'produto = "picolé"', respostas: ['print(f"Vendido: {produto}")'], dica: "Comece com print(f\" e coloque a variável entre chaves: {produto}" }
  ]
},
{
  id: "m2f7", mundo: 2, titulo: "Chefão: o quiosque da Capitã", chefe: true,
  historia: "Último desafio da praia! O quiosque da Capitã Print vai abrir e precisa de um programa de pedidos: perguntar o nome do cliente, perguntar o pedido e mostrar a mensagem de confirmação. Mostre tudo o que você aprendeu!",
  aprenda: {
    texto: "Um programa completo junta tudo: <b>input</b> para perguntar (entrada), <b>variáveis</b> para guardar e <b>print</b> para mostrar a resposta (saída). Lembra do Mundo 1? É o mesmo esquema de <b>entrada, processamento e saída</b>, agora em Python de verdade.",
    codigo: 'print("=== QUIOSQUE DA CAPITÃ ===")\ncliente = input("Seu nome: ")\npedido = input("O que vai querer? ")\nprint(f"{cliente}, seu {pedido} já vai sair!")'
  },
  resumo: "Um programa simples em Python costuma seguir o caminho de entrada, processamento e saída. Com o input, o programa recebe os dados do usuário e guarda cada resposta em uma variável. Com o print, mostra mensagens e resultados, podendo juntar textos e variáveis com a f-string. A ordem das linhas é muito importante: uma variável só pode ser usada depois de receber um valor. Com esses três comandos já é possível criar programas que conversam com quem está usando.",
  desafios: [
    { tipo: "ordem", pergunta: "Monte o programa do quiosque na ordem certa.", linhas: ['print("=== QUIOSQUE ===")', 'cliente = input("Seu nome: ")', 'pedido = input("Pedido: ")', 'print(f"{cliente} pediu {pedido}")'], dica: "Primeiro o título, depois as perguntas e, por último, a mensagem com as respostas." },
    { tipo: "saida", pergunta: "O cliente digitou Rafa e depois açaí. O que aparece por último?", codigo: 'cliente = input("Nome: ")\npedido = input("Pedido: ")\nprint(f"{cliente} pediu {pedido}")', opcoes: ["Rafa pediu açaí", "cliente pediu pedido", "{cliente} pediu {pedido}", "açaí pediu Rafa"], certa: 0, dica: "Cada chave é trocada pelo que foi digitado." },
    { tipo: "bug", pergunta: "O programa dá erro porque usa uma variável ANTES de ela existir. Clique na linha errada.", linhas: ['print(f"Olá, {nome}!")', 'nome = input("Seu nome: ")', 'print("Bom apetite!")'], certa: 0, dica: "O Python lê de cima para baixo. Na primeira linha, a variável nome já existe?" },
    { tipo: "escolha", pergunta: "Complete para guardar a bebida que o cliente digitar.", codigo: 'bebida = @@("Qual bebida? ")\nprint(f"Saindo um {bebida}!")', opcoes: ["input", "print", "bebida", "f"], certa: 0, dicas: ["", "O print mostra, mas não recebe o que a pessoa digita.", "bebida é a variável. Falta o comando que pergunta.", "O f é usado na f-string, não para perguntar."] },
    { tipo: "quiz", pergunta: "No programa do quiosque, qual parte é a ENTRADA de dados?", opcoes: ["Os input() com o nome e o pedido", "O print() com a mensagem final", "O título === QUIOSQUE ===", "O sinal de ="], certa: 0, dica: "Entrada é o que chega de fora: o que o cliente digita." },
    { tipo: "digite", pergunta: "Digite a linha que pergunta \"Seu nome: \" e guarda a resposta na variável cliente.", respostas: ['cliente = input("Seu nome: ")', 'cliente = input("Seu nome:")'], dica: "Variável à esquerda, sinal de =, e o input com a pergunta entre aspas." }
  ]
}
);
