// ============================================================
//  MUNDO 3 · DESERTO DOS CÁLCULOS – operadores, int() e float()
//  Guia: Dona Conta, a guia das caravanas do deserto.
//  Aqui o aluno faz contas em Python e aprende a transformar o
//  texto do input em número.
// ============================================================
FASES.push(
{
  id: "m3f1", mundo: 3, titulo: "A calculadora do deserto",
  historia: "Seja bem-vindo ao Deserto dos Cálculos! Eu sou a Dona Conta e guio as caravanas por aqui. No deserto, quem não sabe fazer conta fica sem água. Vamos começar pelas quatro operações.",
  aprenda: {
    texto: "O Python faz contas como uma calculadora. Os sinais são: <b>+</b> somar, <b>-</b> subtrair, <b>*</b> multiplicar (é o asterisco, não o x) e <b>/</b> dividir. Para mostrar o resultado, coloque a conta dentro do <b>print</b>, <b>sem aspas</b>. Atenção: a divisão com <b>/</b> sempre dá um número com vírgula (que no Python é um <b>ponto</b>): 10 / 2 dá <b>5.0</b>.",
    codigo: 'print(8 + 2)    # 10\nprint(8 - 2)    # 6\nprint(8 * 2)    # 16\nprint(8 / 2)    # 4.0'
  },
  resumo: "O Python realiza operações matemáticas usando operadores. O sinal de mais soma, o de menos subtrai, o asterisco multiplica e a barra divide. Para ver o resultado, escrevemos a conta dentro do print sem aspas; com aspas, o Python mostraria a conta como texto, sem calcular. A divisão com a barra sempre devolve um número decimal, e no Python a parte decimal é separada por ponto, e não por vírgula: por isso 10 / 2 resulta em 5.0.",
  desafios: [
    { tipo: "saida", pergunta: "O que aparece no terminal?", codigo: "print(7 + 5)", opcoes: ["12", "7 + 5", "75", "\"12\""], certa: 0, dica: "Sem aspas, o Python faz a conta e mostra o resultado." },
    { tipo: "quiz", pergunta: "Qual sinal faz MULTIPLICAÇÃO no Python?", opcoes: ["*", "x", "×", "."], certa: 0, dica: "No teclado do computador, a multiplicação é o asterisco." },
    { tipo: "saida", pergunta: "O que aparece no terminal?", codigo: "print(20 / 4)", opcoes: ["5.0", "5", "20 / 4", "4"], certa: 0, dica: "A divisão com / sempre dá um número com ponto decimal." },
    { tipo: "saida", pergunta: "Cuidado com as aspas! O que aparece?", codigo: 'print("3 + 4")', opcoes: ["3 + 4", "7", "34", "Erro"], certa: 0, dica: "Entre aspas é texto: o Python mostra exatamente o que está escrito, sem calcular." },
    { tipo: "escolha", pergunta: "A caravana tem 6 camelos e cada um carrega 4 baldes. Complete a conta.", codigo: "print(6 @@ 4)", opcoes: ["*", "+", "x", "/"], certa: 0, dicas: ["", "Somar daria 10. São 6 camelos com 4 baldes CADA.", "O x não é sinal de conta no Python.", "Dividir daria 1.5. Precisamos de 6 vezes 4."] },
    { tipo: "digite", pergunta: "Digite o print que mostra o resultado de 15 menos 9.", respostas: ["print(15 - 9)", "print(15-9)"], dica: "Coloque a conta dentro do print, sem aspas: print(15 - 9)" }
  ]
},
{
  id: "m3f2", mundo: 3, titulo: "Quem vem primeiro?",
  historia: "Um viajante calculou a água da caravana e errou feio! Ele esqueceu que, numa conta com vários sinais, alguns são feitos antes dos outros. Vamos descobrir a ordem certa.",
  aprenda: {
    texto: "Igual na matemática da escola: <b>multiplicação e divisão vêm antes</b> da soma e da subtração. Se você quiser que uma parte seja feita primeiro, coloque ela entre <b>parênteses</b>. O que está entre parênteses é sempre calculado antes.",
    codigo: 'print(2 + 3 * 4)     # 14 (primeiro 3 * 4)\nprint((2 + 3) * 4)   # 20 (primeiro 2 + 3)'
  },
  resumo: "Quando uma expressão tem várias operações, o Python segue a mesma ordem da matemática: primeiro resolve o que está entre parênteses, depois as multiplicações e divisões, e por último as somas e subtrações. Operações do mesmo tipo são feitas da esquerda para a direita. Os parênteses são a forma de mudar essa ordem e deixar claro o que deve ser calculado antes, como em (2 + 3) * 4, que dá 20, enquanto 2 + 3 * 4 dá 14.",
  desafios: [
    { tipo: "saida", pergunta: "O que aparece no terminal?", codigo: "print(10 + 2 * 3)", opcoes: ["16", "36", "15", "10 + 6"], certa: 0, dica: "A multiplicação vem antes: 2 * 3 = 6, e depois 10 + 6." },
    { tipo: "saida", pergunta: "E com parênteses?", codigo: "print((10 + 2) * 3)", opcoes: ["36", "16", "15", "33"], certa: 0, dica: "Os parênteses são calculados primeiro: 10 + 2 = 12, depois 12 * 3." },
    { tipo: "quiz", pergunta: "Na conta 8 - 4 / 2, o que o Python calcula primeiro?", opcoes: ["4 / 2", "8 - 4", "Tanto faz", "Dá erro"], certa: 0, dica: "Divisão vem antes da subtração." },
    { tipo: "escolha", pergunta: "Queremos a média de 6 e 8 (somar e depois dividir por 2). Complete.", codigo: "media = @@ / 2\nprint(media)", opcoes: ["(6 + 8)", "6 + 8", "[6 + 8]", "{6 + 8}"], certa: 0, dicas: ["", "Sem parênteses, o Python faria 8 / 2 primeiro e daria 10.0.", "Para agrupar uma conta usamos parênteses, não colchetes.", "Para agrupar uma conta usamos parênteses, não chaves."] },
    { tipo: "bug", pergunta: "Esta linha deveria dar o total de 2 pacotes de 5 garrafas mais 3 garrafas soltas (13), mas dá outro valor. Clique nela.", linhas: ["pacotes = 2", "total = pacotes * (5 + 3)", "print(total)"], certa: 1, dica: "Os parênteses estão juntando o 5 com o 3. O certo é pacotes * 5 + 3." },
    { tipo: "saida", pergunta: "O que aparece no terminal?", codigo: "print(20 - 5 - 5)", opcoes: ["10", "20", "0", "15"], certa: 0, dica: "Contas do mesmo tipo vão da esquerda para a direita: 20 - 5 = 15, depois 15 - 5." }
  ]
},
{
  id: "m3f3", mundo: 3, titulo: "Dividindo a água",
  historia: "Chegamos ao oásis com 17 litros de água para dividir entre 5 camelos. Cada um recebe quantos litros inteiros? E quanto sobra no balde? O Python tem operadores especiais para isso.",
  aprenda: {
    texto: "Além da divisão normal, o Python tem: <b>//</b> (divisão inteira) que mostra só a parte inteira, sem a vírgula; <b>%</b> (resto) que mostra quanto sobrou da divisão; e <b>**</b> (potência) que multiplica o número por ele mesmo várias vezes.",
    codigo: 'print(17 // 5)   # 3  (cada camelo ganha 3)\nprint(17 % 5)    # 2  (sobram 2)\nprint(2 ** 3)    # 8  (2 x 2 x 2)'
  },
  resumo: "O Python possui operadores além das quatro operações básicas. A divisão inteira, com duas barras, devolve apenas a parte inteira do resultado, descartando o que vem depois da vírgula. O operador de resto, o sinal de porcentagem, mostra quanto sobra de uma divisão, o que é útil para saber, por exemplo, se um número é par: se o resto da divisão por 2 for zero, o número é par. Já a potência, com dois asteriscos, multiplica um número por ele mesmo quantas vezes indicar o expoente.",
  desafios: [
    { tipo: "saida", pergunta: "20 tâmaras divididas entre 6 viajantes. Quantas cada um ganha inteiras?", codigo: "print(20 // 6)", opcoes: ["3", "3.33", "2", "4"], certa: 0, dica: "// mostra só a parte inteira: 6 cabe 3 vezes em 20." },
    { tipo: "saida", pergunta: "E quantas tâmaras sobram?", codigo: "print(20 % 6)", opcoes: ["2", "3", "0", "14"], certa: 0, dica: "6 x 3 = 18. De 20 para 18 sobram..." },
    { tipo: "saida", pergunta: "O que aparece no terminal?", codigo: "print(3 ** 2)", opcoes: ["9", "6", "5", "32"], certa: 0, dica: "** é potência: 3 elevado a 2 é 3 x 3." },
    { tipo: "quiz", pergunta: "Para descobrir se um número é PAR, qual conta ajuda?", opcoes: ["numero % 2", "numero // 2", "numero ** 2", "numero + 2"], certa: 0, dica: "Número par dividido por 2 não deixa resto (o resto é 0)." },
    { tipo: "escolha", pergunta: "Complete para saber quantas horas inteiras cabem em 150 minutos.", codigo: "horas = 150 @@ 60\nprint(horas)", opcoes: ["//", "/", "%", "**"], certa: 0, dicas: ["", "A barra simples daria 2.5. Queremos só as horas inteiras.", "O % mostraria os minutos que sobram (30), não as horas.", "Potência daria um número gigante!"] },
    { tipo: "saida", pergunta: "O que aparece no terminal?", codigo: "print(10 % 2)", opcoes: ["0", "5", "2", "10"], certa: 0, dica: "10 dividido por 2 dá exato, então não sobra nada." }
  ]
},
{
  id: "m3f4", mundo: 3, titulo: "Texto ou número?",
  historia: "Uma placa no deserto diz \"5\" + \"5\" = 55. Parece errado, mas para o Python está certo! Isso acontece porque ali não são números: são textos. Vamos entender os tipos de dados.",
  aprenda: {
    texto: "Todo valor no Python tem um <b>tipo</b>. Os principais são: <b>int</b> (número inteiro, como 7), <b>float</b> (número com ponto, como 2.5) e <b>str</b> (texto, sempre entre aspas, como \"7\"). Com números, o <b>+</b> soma. Com textos, o <b>+</b> cola um no outro. O comando <b>type()</b> mostra qual é o tipo.",
    codigo: 'print(5 + 5)       # 10\nprint("5" + "5")   # 55\nprint(type(7))     # <class \'int\'>\nprint(type(2.5))   # <class \'float\'>'
  },
  resumo: "No Python, cada valor tem um tipo de dado. O tipo int representa números inteiros, o float representa números decimais, escritos com ponto, e o str, abreviação de string, representa textos, sempre entre aspas. O tipo muda o comportamento das operações: o sinal de mais soma dois números, mas junta dois textos, por isso \"5\" + \"5\" resulta em \"55\". Tentar somar um texto com um número causa erro. A função type() mostra o tipo de qualquer valor.",
  desafios: [
    { tipo: "saida", pergunta: "O que aparece no terminal?", codigo: 'print("4" + "2")', opcoes: ["42", "6", "4 + 2", "Erro"], certa: 0, dica: "Entre aspas são textos. O + cola um texto no outro." },
    { tipo: "quiz", pergunta: "Qual é o tipo do valor 3.5?", opcoes: ["float", "int", "str", "texto"], certa: 0, dica: "Número com ponto decimal é float." },
    { tipo: "quiz", pergunta: "Qual é o tipo do valor \"20\"?", opcoes: ["str (texto)", "int", "float", "número"], certa: 0, dica: "Está entre aspas! Então é texto, mesmo parecendo número." },
    { tipo: "saida", pergunta: "O que aparece no terminal?", codigo: 'print("ha" * 3)', opcoes: ["hahaha", "ha3", "Erro", "9"], certa: 0, dica: "Texto vezes número repete o texto." },
    { tipo: "bug", pergunta: "Uma linha vai dar ERRO porque tenta somar texto com número. Clique nela.", linhas: ['print(10 + 5)', 'print("10" + 5)', 'print("10" + "5")'], certa: 1, dica: "O Python não sabe somar uma palavra com um número." },
    { tipo: "escolha", pergunta: "Complete para ver o tipo da variável.", codigo: "agua = 12\nprint(@@(agua))", opcoes: ["type", "tipo", "int", "print"], certa: 0, dicas: ["", "O Python é em inglês: tipo é type.", "int transforma em inteiro, não mostra o tipo.", "O print já está fora. Falta o comando que descobre o tipo."] }
  ]
},
{
  id: "m3f5", mundo: 3, titulo: "int() e float(): o conversor",
  historia: "O mercador do oásis fez um programa para somar os pedidos, mas ele mostra 22 em vez de 4! Lembra do Mundo 2? Tudo que vem do input é texto. Hoje você aprende a transformar texto em número.",
  aprenda: {
    texto: "Para fazer conta com o que a pessoa digita, precisamos <b>converter</b> o texto em número. <b>int()</b> transforma em número inteiro e <b>float()</b> transforma em número com ponto. O jeito mais comum é colocar o input <b>dentro</b> do int: <b>idade = int(input(\"Idade: \"))</b>. Cuidado: <b>int(\"2.5\")</b> dá erro. Para números com ponto, use float.",
    codigo: 'a = input("Número: ")        # digitou 2 → "2" (texto)\nprint(a + a)                 # 22\nb = int(input("Número: "))   # digitou 2 → 2 (número)\nprint(b + b)                 # 4'
  },
  resumo: "Como o input() sempre devolve texto, é preciso converter a resposta antes de fazer contas. A função int() transforma um texto em número inteiro, e a função float() transforma em número decimal. O mais comum é colocar o input dentro da conversão, como em idade = int(input(\"Idade: \")). Se o texto não representar um número válido para aquela conversão, por exemplo int(\"2.5\") ou int(\"abc\"), o programa para com um erro. A função int() também pode ser usada em um número decimal: nesse caso ela corta a parte depois do ponto.",
  desafios: [
    { tipo: "saida", pergunta: "A pessoa digitou 3. O que aparece?", codigo: 'n = input("Número: ")\nprint(n + n)', opcoes: ["33", "6", "3", "Erro"], certa: 0, dica: "Sem conversão, o 3 é texto. Texto + texto cola." },
    { tipo: "saida", pergunta: "Agora com int. A pessoa digitou 3. O que aparece?", codigo: 'n = int(input("Número: "))\nprint(n + n)', opcoes: ["6", "33", "3", "Erro"], certa: 0, dica: "O int transformou o texto \"3\" no número 3." },
    { tipo: "escolha", pergunta: "O preço pode ter centavos (ex.: 4.50). Complete com a conversão certa.", codigo: 'preco = @@(input("Preço: "))', opcoes: ["float", "int", "str", "type"], certa: 0, dicas: ["", "int não aceita número com ponto: int(\"4.50\") dá erro.", "str deixaria como texto, e o input já é texto.", "type só mostra o tipo, não converte."] },
    { tipo: "saida", pergunta: "O que aparece no terminal?", codigo: "print(int(7.9))", opcoes: ["7", "8", "7.9", "Erro"], certa: 0, dica: "O int não arredonda: ele corta tudo depois do ponto." },
    { tipo: "bug", pergunta: "A pessoa digitou 15 e 20, mas o programa dá ERRO na hora de somar. Qual linha esqueceu a conversão?", linhas: ['idade1 = int(input("Idade 1: "))', 'idade2 = input("Idade 2: ")', 'print(idade1 + idade2)'], certa: 1, dica: "Uma idade virou número e a outra continuou texto. O Python não soma número com texto." },
    { tipo: "digite", pergunta: "Digite a linha que pergunta \"Quantos camelos? \" e guarda o NÚMERO inteiro na variável camelos.", respostas: ['camelos = int(input("Quantos camelos? "))', 'camelos = int(input("Quantos camelos?"))'], dica: "Coloque o input dentro do int: camelos = int(input(\"...\"))" }
  ]
},
{
  id: "m3f6", mundo: 3, titulo: "Contas com variáveis",
  historia: "A caravana anda e a água vai acabando. Precisamos de um placar que se atualiza: começou com 50 litros, bebemos 8, achamos um poço com mais 20... As variáveis guardam e atualizam essas contas.",
  aprenda: {
    texto: "Dá para fazer contas com variáveis e guardar o resultado em outra variável. Também dá para <b>atualizar</b> a própria variável: <b>agua = agua - 8</b> pega o valor atual, tira 8 e guarda de novo. Existe um atalho: <b>agua -= 8</b> faz a mesma coisa (vale também <b>+=</b>, <b>*=</b> e <b>/=</b>). Para arredondar, use <b>round(valor, casas)</b>.",
    codigo: 'agua = 50\nagua = agua - 8    # 42\nagua += 20         # 62\nprint(agua)\nprint(round(10 / 3, 2))   # 3.33'
  },
  resumo: "Variáveis podem ser usadas em contas, e o resultado pode ser guardado em outra variável, como em total = preco * quantidade. Também é possível atualizar uma variável usando o próprio valor dela: em agua = agua - 8, o Python primeiro calcula o lado direito com o valor atual e depois guarda o resultado na mesma variável. Os atalhos +=, -=, *= e /= fazem essa atualização de forma mais curta. Para mostrar um número decimal com menos casas, usamos round(valor, casas), que arredonda o resultado.",
  desafios: [
    { tipo: "saida", pergunta: "O que aparece no terminal?", codigo: "preco = 4\nqtd = 3\ntotal = preco * qtd\nprint(total)", opcoes: ["12", "7", "43", "preco * qtd"], certa: 0, dica: "total recebe 4 vezes 3." },
    { tipo: "saida", pergunta: "O que aparece no terminal?", codigo: "agua = 30\nagua = agua - 5\nprint(agua)", opcoes: ["25", "30", "-5", "Erro"], certa: 0, dica: "Pega o valor atual (30), tira 5 e guarda de novo." },
    { tipo: "saida", pergunta: "O que aparece no terminal?", codigo: "pontos = 10\npontos += 5\npontos += 5\nprint(pontos)", opcoes: ["20", "15", "10", "105"], certa: 0, dica: "+= 5 soma 5 ao valor atual. Aconteceu duas vezes." },
    { tipo: "escolha", pergunta: "Complete o atalho para tirar 3 litros da variável agua.", codigo: "agua = 20\nagua @@ 3\nprint(agua)", opcoes: ["-=", "=-", "--", "-"], certa: 0, dicas: ["", "A ordem importa: o sinal de menos vem ANTES do igual.", "No Python, -- não existe como atalho.", "Só o sinal de menos não guarda o resultado na variável."] },
    { tipo: "saida", pergunta: "O que aparece no terminal?", codigo: "print(round(7.456, 1))", opcoes: ["7.5", "7.4", "7", "7.46"], certa: 0, dica: "Arredonda para 1 casa depois do ponto: 7.456 fica 7.5." },
    { tipo: "ordem", pergunta: "Monte o placar da água: começar com 40, gastar 10 e mostrar.", linhas: ["agua = 40", "agua -= 10", "print(agua)"], dica: "Primeiro a variável precisa existir, depois atualizamos e só no fim mostramos." }
  ]
},
{
  id: "m3f7", mundo: 3, titulo: "Chefão: o mercado do oásis", chefe: true,
  historia: "Último desafio do deserto! O mercado do oásis precisa de um caixa: perguntar o produto, o preço e a quantidade, calcular o total e mostrar a nota. Use tudo o que aprendeu e a caravana segue viagem!",
  aprenda: {
    texto: "Um programa de caixa junta tudo: <b>input</b> para perguntar, <b>int()</b> e <b>float()</b> para converter, <b>operadores</b> para calcular e <b>f-string</b> para mostrar o resultado. Dica: dentro da f-string dá para arredondar com <b>{total:.2f}</b>, que mostra sempre 2 casas, como em dinheiro.",
    codigo: 'produto = input("Produto: ")\npreco = float(input("Preço: "))\nqtd = int(input("Quantidade: "))\ntotal = preco * qtd\nprint(f"{qtd} x {produto} = R$ {total:.2f}")'
  },
  resumo: "Um programa que faz cálculos com dados digitados segue o esquema de entrada, processamento e saída. Na entrada, usamos input() e convertemos as respostas com int() ou float() conforme o tipo de número esperado. No processamento, usamos os operadores matemáticos e guardamos os resultados em variáveis. Na saída, mostramos os resultados com print, e a f-string permite formatar valores em dinheiro com {valor:.2f}, que exibe sempre duas casas decimais.",
  desafios: [
    { tipo: "ordem", pergunta: "Cada garrafa de água custa R$ 4.50. Monte o caixa do oásis na ordem certa.", linhas: ['qtd = int(input("Quantas garrafas? "))', 'total = 4.50 * qtd', 'print(f"Total: R$ {total:.2f}")'], dica: "Primeiro pergunte a quantidade, depois calcule e só no final mostre." },
    { tipo: "saida", pergunta: "O cliente digitou 2.5 no preço e 4 na quantidade. O que aparece?", codigo: 'preco = float(input("Preço: "))\nqtd = int(input("Quantidade: "))\nprint(f"Total: {preco * qtd}")', opcoes: ["Total: 10.0", "Total: 2.54", "Total: 10", "Total: preco * qtd"], certa: 0, dica: "2.5 x 4 = 10, e como o preço é float, o resultado aparece com .0" },
    { tipo: "bug", pergunta: "O caixa dá ERRO quando o cliente digita 3.50 no preço. Qual linha?", linhas: ['produto = input("Produto: ")', 'preco = int(input("Preço: "))', 'qtd = int(input("Quantidade: "))', 'print(preco * qtd)'], certa: 1, dica: "Preço tem centavos. Qual conversão aceita número com ponto?" },
    { tipo: "escolha", pergunta: "Complete para mostrar o total com 2 casas decimais.", codigo: 'total = 7.5\nprint(f"Total: R$ {total@@}")', opcoes: [":.2f", ".2", ",2", "(2)"], certa: 0, dicas: ["", "Falta o dois-pontos e o f: o formato é :.2f", "Vírgula não é o formato do Python.", "Parênteses não formatam números na f-string."] },
    { tipo: "saida", pergunta: "O que aparece no terminal?", codigo: 'total = 12\nprint(f"Total: R$ {total:.2f}")', opcoes: ["Total: R$ 12.00", "Total: R$ 12", "Total: R$ 12.2f", "Total: R$ {total:.2f}"], certa: 0, dica: ":.2f sempre mostra 2 casas depois do ponto." },
    { tipo: "digite", pergunta: "As variáveis preco e qtd já existem. Digite a linha que guarda na variável total o preço vezes a quantidade.", respostas: ["total = preco * qtd", "total = qtd * preco"], dica: "Variável à esquerda, igual, e a conta com o asterisco." }
  ]
}
);
