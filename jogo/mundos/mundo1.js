// ============================================================
//  MUNDO 1 · VILA DA LÓGICA – Algoritmos e fluxogramas
//
//  Tipos de desafio:
//   quiz    – pergunta com alternativas
//   ordem   – colocar passos na ordem certa (texto: true = passos em português)
//   bug     – clicar no passo/linha errada (texto: true = passos em português)
//   forma   – escolher a forma do fluxograma para um passo
//   fluxo   – fluxograma com um "?" para completar (texto ou forma)
//   escolha, saida, digite – desafios com código Python (mundos seguintes)
//
//  Formas do fluxograma: terminal (oval), dados (paralelogramo),
//  processo (retângulo), decisao (losango)
// ============================================================
FASES.push(
{
  id: "m1f1", mundo: 1, titulo: "O que é um algoritmo?",
  historia: "Bem-vindo à Vila da Lógica! Eu sou o Mestre Algo. Aqui ninguém programa sem antes aprender a pensar passo a passo. Todo programa de computador começa com uma ideia simples: o algoritmo.",
  aprenda: {
    texto: "<b>Algoritmo</b> é uma sequência de passos, em ordem, para resolver um problema. Uma receita de bolo é um algoritmo. O caminho que o GPS mostra também. Para o computador, cada passo precisa ser <b>claro</b> e estar na <b>ordem certa</b>, porque ele faz exatamente o que mandamos: nem mais, nem menos.",
    passos: ["Pegar a escova", "Colocar a pasta", "Escovar os dentes", "Enxaguar a boca"]
  },
  resumo: "Um algoritmo é uma sequência de passos, organizados em ordem, que leva à solução de um problema. Usamos algoritmos o tempo todo sem perceber: ao seguir uma receita, ao escovar os dentes ou ao seguir as instruções do GPS. Na programação, o algoritmo é o plano que vem antes do código. Como o computador não adivinha nada, cada passo precisa ser claro e estar na ordem certa; se a ordem muda, o resultado também muda.",
  desafios: [
    { tipo: "quiz", pergunta: "O que é um algoritmo?", opcoes: ["Uma sequência de passos em ordem para resolver um problema", "Um tipo de computador", "Uma linguagem de programação", "Um vírus de computador"], certa: 0, dica: "Lembre da receita de bolo: são passos, um depois do outro." },
    { tipo: "quiz", pergunta: "Qual destes é um exemplo de algoritmo do dia a dia?", opcoes: ["Uma receita de bolo", "Uma cadeira", "A cor azul", "Um número de telefone"], certa: 0, dica: "Procure algo que tenha PASSOS para seguir." },
    { tipo: "ordem", texto: true, pergunta: "Coloque em ordem: escovar os dentes.", linhas: ["Pegar a escova", "Colocar a pasta na escova", "Escovar os dentes", "Enxaguar a boca"], dica: "Não dá para escovar sem antes colocar a pasta!" },
    { tipo: "quiz", pergunta: "Por que a ORDEM dos passos é importante?", opcoes: ["Porque o resultado muda se a ordem mudar", "Não é importante", "Porque o computador gosta de números", "Para o algoritmo ficar maior"], certa: 0, dica: "Imagine colocar o bolo no forno antes de misturar a massa." },
    { tipo: "quiz", pergunta: "Você manda o computador: \"faz um lanche aí\". O que acontece?", opcoes: ["Ele não entende: a instrução não é clara", "Ele faz um sanduíche", "Ele pede uma pizza", "Ele escolhe o melhor lanche"], certa: 0, dica: "O computador só entende passos claros e exatos." }
  ]
},
{
  id: "m1f2", mundo: 1, titulo: "Passo a passo",
  historia: "O padeiro da vila escreveu a receita do pão fora de ordem e saiu um desastre: farinha no teto! Vamos aprender a organizar os passos.",
  aprenda: {
    texto: "Uma <b>sequência lógica</b> é quando cada passo depende do anterior. Não dá para fritar o ovo antes de quebrar a casca! Para montar um algoritmo, pergunte sempre: <b>o que precisa acontecer primeiro? E depois?</b>",
    passos: ["Ferver a água", "Colocar o macarrão", "Esperar 3 minutos", "Misturar o tempero", "Servir"]
  },
  resumo: "Sequência lógica é a organização dos passos de forma que cada um dependa do que veio antes. Para montar uma sequência, pensamos no que precisa acontecer primeiro e no que só pode acontecer depois. Um passo fora do lugar ou um passo esquecido estraga todo o resultado, por isso conferimos o algoritmo do começo ao fim antes de transformá-lo em programa.",
  desafios: [
    { tipo: "ordem", texto: true, pergunta: "Monte o algoritmo do miojo.", linhas: ["Ferver a água", "Colocar o macarrão na água", "Esperar 3 minutos", "Misturar o tempero", "Servir no prato"], dica: "A água precisa ferver antes de tudo." },
    { tipo: "bug", texto: true, pergunta: "No algoritmo do caixa eletrônico, um passo está FORA DO LUGAR. Clique nele.", linhas: ["Inserir o cartão", "Digitar a senha", "Pegar o dinheiro", "Escolher o valor do saque", "Retirar o cartão"], certa: 2, dica: "Dá para pegar o dinheiro antes de dizer quanto quer sacar?" },
    { tipo: "ordem", texto: true, pergunta: "Atravessar a rua com segurança.", linhas: ["Parar na calçada", "Olhar para os dois lados", "Esperar o sinal verde para pedestres", "Atravessar na faixa"], dica: "Primeiro você para. Por último, atravessa." },
    { tipo: "quiz", pergunta: "Qual passo está FALTANDO?\n1. Pegar o copo\n2. ______\n3. Beber a água", opcoes: ["Encher o copo de água", "Lavar o copo", "Guardar o copo", "Comprar um copo"], certa: 0, dica: "Sem esse passo, não tem o que beber." },
    { tipo: "bug", texto: true, pergunta: "Algoritmo de mandar mensagem no celular. Qual passo está fora do lugar?", linhas: ["Desbloquear o celular", "Abrir o aplicativo", "Enviar a mensagem", "Escolher o contato", "Digitar a mensagem"], certa: 2, dica: "Dá para enviar antes de escrever?" }
  ]
},
{
  id: "m1f3", mundo: 1, titulo: "Entrada, processamento e saída",
  historia: "Na praça da vila tem uma máquina de suco. Você coloca a fruta, ela bate tudo e o suco sai pelo bico. Sabia que todo programa funciona igual a essa máquina?",
  aprenda: {
    texto: "Quase todo programa tem 3 partes. <b>ENTRADA</b>: os dados que chegam (a fruta, o que o usuário digita). <b>PROCESSAMENTO</b>: o trabalho feito com esses dados (bater a fruta, fazer uma conta). <b>SAÍDA</b>: o resultado mostrado (o suco, a resposta na tela).",
    passos: ["ENTRADA: digitar duas notas", "PROCESSAMENTO: calcular a média", "SAÍDA: mostrar a média na tela"]
  },
  resumo: "Todo programa pode ser dividido em três partes. A entrada é formada pelos dados que chegam ao programa, como o que o usuário digita. O processamento é o trabalho feito com esses dados, como uma conta ou uma comparação. A saída é o resultado que o programa mostra, como uma mensagem na tela. Pensar em entrada, processamento e saída ajuda a planejar qualquer programa.",
  desafios: [
    { tipo: "quiz", pergunta: "No caixa eletrônico, DIGITAR A SENHA é:", opcoes: ["Entrada", "Processamento", "Saída", "Nenhuma delas"], certa: 0, dica: "É uma informação que ENTRA no programa." },
    { tipo: "quiz", pergunta: "CALCULAR o total da compra é:", opcoes: ["Processamento", "Entrada", "Saída", "Nenhuma delas"], certa: 0, dica: "É o trabalho feito com os dados." },
    { tipo: "quiz", pergunta: "MOSTRAR \"Aprovado!\" na tela é:", opcoes: ["Saída", "Entrada", "Processamento", "Nenhuma delas"], certa: 0, dica: "É o resultado que SAI para o usuário ver." },
    { tipo: "quiz", pergunta: "Na calculadora do celular, qual é a ENTRADA?", opcoes: ["Os números e a conta que você digita", "O resultado na tela", "A bateria", "A cor dos botões"], certa: 0, dica: "O que VOCÊ coloca na calculadora?" },
    { tipo: "ordem", texto: true, pergunta: "Coloque na ordem ENTRADA → PROCESSAMENTO → SAÍDA: programa que descobre a idade.", linhas: ["Ler o ano de nascimento", "Calcular 2026 menos o ano de nascimento", "Mostrar a idade na tela"], dica: "Primeiro o dado entra, depois a conta, por último o resultado." },
    { tipo: "quiz", pergunta: "O app de previsão do tempo mostra \"28 °C\". Isso é:", opcoes: ["Saída", "Entrada", "Processamento", "Nenhuma delas"], certa: 0, dica: "É o que aparece para você ver." }
  ]
},
{
  id: "m1f4", mundo: 1, titulo: "Os símbolos do fluxograma",
  historia: "Escrever o algoritmo em texto funciona, mas um desenho é mais fácil de entender! O fluxograma usa uma forma diferente para cada tipo de passo. Vamos conhecer?",
  aprenda: {
    texto: "O <b>fluxograma</b> é o algoritmo desenhado. Cada forma tem um significado, e as <b>setas</b> mostram o caminho:",
    legenda: true
  },
  resumo: "O fluxograma é a representação de um algoritmo em forma de desenho. Cada tipo de passo tem uma forma própria: o oval marca o início e o fim; o paralelogramo representa a entrada e a saída de dados, como ler ou mostrar uma informação; o retângulo representa o processamento, como uma conta; e o losango representa uma decisão, uma pergunta que só pode ser respondida com sim ou não. As setas ligam as formas e mostram a ordem do caminho.",
  desafios: [
    { tipo: "forma", pergunta: "Qual forma usar para este passo?", texto: "Início", certa: "terminal", dica: "Início e Fim usam a forma arredondada (oval)." },
    { tipo: "forma", pergunta: "Qual forma usar para este passo?", texto: "Ler o nome do aluno", certa: "dados", dica: "Ler é ENTRADA de dados. Use a forma inclinada." },
    { tipo: "forma", pergunta: "Qual forma usar para este passo?", texto: "Somar as duas notas", certa: "processo", dica: "Uma conta é PROCESSAMENTO: retângulo." },
    { tipo: "forma", pergunta: "Qual forma usar para este passo?", texto: "A nota é maior que 6?", certa: "decisao", dica: "É uma pergunta de sim ou não: losango." },
    { tipo: "forma", pergunta: "Qual forma usar para este passo?", texto: "Mostrar \"Bom dia!\" na tela", certa: "dados", dica: "Mostrar é SAÍDA de dados: mesma forma de ler." },
    { tipo: "quiz", pergunta: "Para que servem as SETAS no fluxograma?", opcoes: ["Mostram o caminho, a ordem dos passos", "Só enfeitam o desenho", "Mostram onde termina", "Fazem as contas"], certa: 0, dica: "Siga as setas e você percorre o algoritmo." }
  ]
},
{
  id: "m1f5", mundo: 1, titulo: "Montando o fluxograma",
  historia: "Agora você vai completar fluxogramas de verdade! O primeiro é de um programa que soma dois números. Siga as setas e descubra o que está faltando.",
  aprenda: {
    texto: "Para ler um fluxograma, comece no <b>Início</b> e siga as setas até o <b>Fim</b>. Veja o programa que soma dois números:",
    fluxo: [{ f: "terminal", t: "Início" }, { f: "dados", t: "Ler A e B" }, { f: "processo", t: "Soma = A + B" }, { f: "dados", t: "Mostrar Soma" }, { f: "terminal", t: "Fim" }]
  },
  resumo: "Para montar um fluxograma, escrevemos cada passo do algoritmo dentro da forma certa e ligamos tudo com setas, do início ao fim. Para ler um fluxograma, começamos no oval de início e seguimos as setas. Um fluxograma simples costuma ter a entrada dos dados, o processamento e a saída do resultado, nessa ordem.",
  desafios: [
    { tipo: "fluxo", pergunta: "O que falta neste fluxograma?", nos: [{ f: "terminal", t: "Início" }, { f: "dados", t: "Ler dois números" }, { f: "processo", t: "?" }, { f: "dados", t: "Mostrar a soma" }, { f: "terminal", t: "Fim" }], opcoes: ["Somar os dois números", "Ler mais um número", "Desligar o computador", "Fim"], certa: 0, dica: "Para mostrar a soma, ela precisa ser calculada antes." },
    { tipo: "fluxo", formas: true, pergunta: "Qual é a FORMA do passo com \"?\"", nos: [{ f: "terminal", t: "Início" }, { f: "dados", t: "Ler o preço" }, { f: "?", t: "Calcular o desconto" }, { f: "dados", t: "Mostrar o preço final" }, { f: "terminal", t: "Fim" }], certa: "processo", dica: "Calcular é processamento." },
    { tipo: "ordem", texto: true, pergunta: "Monte o fluxograma da média, do início ao fim.", linhas: ["Início", "Ler as duas notas", "Calcular a média", "Mostrar a média", "Fim"], dica: "Início → entrada → conta → saída → Fim." },
    { tipo: "fluxo", pergunta: "O que falta neste fluxograma?", nos: [{ f: "terminal", t: "Início" }, { f: "dados", t: "?" }, { f: "processo", t: "Calcular a idade" }, { f: "dados", t: "Mostrar a idade" }, { f: "terminal", t: "Fim" }], opcoes: ["Ler o ano de nascimento", "Mostrar a idade", "Fim", "Calcular a média"], certa: 0, dica: "Para calcular a idade, que dado precisa ENTRAR?" },
    { tipo: "quiz", pergunta: "Todo fluxograma começa e termina com qual forma?", opcoes: ["Oval", "Retângulo", "Losango", "Paralelogramo"], certa: 0, dica: "É a forma arredondada." }
  ]
},
{
  id: "m1f6", mundo: 1, titulo: "Decisões no fluxograma",
  historia: "Nem todo caminho é reto! Às vezes o programa precisa fazer uma pergunta e escolher para onde ir. É aí que entra o losango.",
  aprenda: {
    texto: "O <b>losango</b> faz uma pergunta que só tem duas respostas: <b>SIM</b> ou <b>NÃO</b>. Cada resposta leva para um caminho diferente. Exemplo: a nota é maior ou igual a 6?",
    fluxo: [{ f: "terminal", t: "Início" }, { f: "dados", t: "Ler a nota" }, { f: "decisao", t: "Nota >= 6?", sim: "Mostrar Aprovado", nao: "Mostrar Reprovado" }, { f: "terminal", t: "Fim" }]
  },
  resumo: "Quando o algoritmo precisa escolher entre dois caminhos, usamos uma decisão, representada pelo losango. Dentro dele escrevemos uma pergunta que só pode ser respondida com sim ou não. Cada resposta leva a um caminho diferente, e depois os caminhos podem se juntar de novo. É assim que um programa decide, por exemplo, se um aluno está aprovado ou reprovado.",
  desafios: [
    { tipo: "quiz", pergunta: "Quantas saídas tem um losango de decisão?", opcoes: ["Duas: sim e não", "Uma", "Três", "Nenhuma"], certa: 0, dica: "A pergunta só tem duas respostas possíveis." },
    { tipo: "fluxo", pergunta: "A nota do aluno é 4. Qual mensagem aparece?", nos: [{ f: "terminal", t: "Início" }, { f: "dados", t: "Ler a nota" }, { f: "decisao", t: "Nota >= 6?", sim: "Mostrar Aprovado", nao: "Mostrar Reprovado" }, { f: "terminal", t: "Fim" }], opcoes: ["Reprovado", "Aprovado", "As duas", "Nenhuma"], certa: 0, dica: "4 é maior ou igual a 6? Siga a seta do NÃO." },
    { tipo: "fluxo", pergunta: "O que falta no caminho do SIM?", nos: [{ f: "terminal", t: "Início" }, { f: "dados", t: "Ler a idade" }, { f: "decisao", t: "Idade >= 18?", sim: "?", nao: "Não pode dirigir" }, { f: "terminal", t: "Fim" }], opcoes: ["Pode tirar a carteira", "Não pode dirigir", "Fim", "Ler a idade"], certa: 0, dica: "Quem tem 18 anos ou mais pode o quê?" },
    { tipo: "fluxo", pergunta: "Qual é a PERGUNTA do losango?", nos: [{ f: "terminal", t: "Início" }, { f: "decisao", t: "?", sim: "Levar guarda-chuva", nao: "Sair sem guarda-chuva" }, { f: "terminal", t: "Fim" }], opcoes: ["Está chovendo?", "Que horas são?", "Ler o nome", "Fim"], certa: 0, dica: "Precisa ser uma pergunta de SIM ou NÃO que combine com os dois caminhos." },
    { tipo: "fluxo", pergunta: "O sinal está VERMELHO. O que a pessoa faz?", nos: [{ f: "terminal", t: "Início" }, { f: "decisao", t: "Sinal verde?", sim: "Atravessar", nao: "Esperar" }, { f: "terminal", t: "Fim" }], opcoes: ["Esperar", "Atravessar", "As duas coisas", "Nada"], certa: 0, dica: "Vermelho não é verde: siga o NÃO." },
    { tipo: "forma", pergunta: "Qual forma usar para este passo?", texto: "A senha está correta?", certa: "decisao", dica: "É uma pergunta de sim ou não." }
  ]
},
{
  id: "m1f7", mundo: 1, titulo: "CHEFÃO: o caixa eletrônico", chefe: true,
  historia: "Socorro! O caixa eletrônico da vila quebrou e o fluxograma dele sumiu! Só você pode reconstruir. Use tudo o que aprendeu na Vila da Lógica!",
  aprenda: {
    texto: "Revise antes da batalha: <b>oval</b> = início e fim, <b>paralelogramo</b> = ler e mostrar, <b>retângulo</b> = contas e ações, <b>losango</b> = pergunta de sim ou não. Siga as setas!",
    legenda: true
  },
  resumo: "Um sistema real, como o caixa eletrônico, junta tudo o que vimos: começa e termina com o oval, lê dados como o cartão, a senha e o valor do saque, faz processamentos e toma decisões, como conferir se a senha está correta e se há saldo suficiente. Planejar o sistema com um fluxograma antes de programar ajuda a não esquecer nenhum caminho.",
  desafios: [
    { tipo: "ordem", texto: true, pergunta: "Monte a sequência do caixa eletrônico.", linhas: ["Início", "Ler o cartão", "Ler a senha", "Senha correta?", "Liberar o saque", "Fim"], dica: "Primeiro o cartão, depois a senha, depois a pergunta." },
    { tipo: "forma", pergunta: "Qual forma usar para este passo?", texto: "Ler a senha digitada", certa: "dados", dica: "Ler é entrada de dados." },
    { tipo: "fluxo", pergunta: "O que acontece quando a senha está CORRETA?", nos: [{ f: "terminal", t: "Início" }, { f: "dados", t: "Ler a senha" }, { f: "decisao", t: "Senha correta?", sim: "?", nao: "Mostrar Senha errada" }, { f: "terminal", t: "Fim" }], opcoes: ["Mostrar o menu do caixa", "Mostrar Senha errada", "Ler a senha", "Desligar o caixa"], certa: 0, dica: "Senha certa: o cliente pode usar o caixa." },
    { tipo: "fluxo", formas: true, pergunta: "Qual é a FORMA do passo com \"?\"", nos: [{ f: "terminal", t: "Início" }, { f: "dados", t: "Ler o valor do saque" }, { f: "?", t: "Tem saldo suficiente?" }, { f: "terminal", t: "Fim" }], certa: "decisao", dica: "É uma pergunta de sim ou não." },
    { tipo: "fluxo", pergunta: "O saldo é R$ 50 e o cliente pediu R$ 100. O que acontece?", nos: [{ f: "terminal", t: "Início" }, { f: "dados", t: "Ler o valor do saque" }, { f: "decisao", t: "Saque <= Saldo?", sim: "Entregar o dinheiro", nao: "Saldo insuficiente" }, { f: "terminal", t: "Fim" }], opcoes: ["Mostra Saldo insuficiente", "Entrega o dinheiro", "Entrega R$ 50", "Nada acontece"], certa: 0, dica: "100 é menor ou igual a 50? Siga o NÃO." },
    { tipo: "quiz", pergunta: "Qual é a ENTRADA do caixa eletrônico?", opcoes: ["Cartão, senha e valor do saque", "O dinheiro que sai", "O comprovante impresso", "A tela"], certa: 0, dica: "O que o CLIENTE fornece para o caixa?" }
  ]
}
);
