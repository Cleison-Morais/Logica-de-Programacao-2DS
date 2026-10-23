// ============================================================
//  LISTA DE MUNDOS
//  Cada mundo tem um cenário (tema) e um arquivo próprio com as fases:
//  mundos/mundo1.js, mundos/mundo2.js ...
//  Mundo com "pronto: false" aparece no mapa como EM BREVE.
//  guia (opcional): personagem que conta a história das fases { nome, avatar }.
// ============================================================
window.MUNDOS = [
  { n: 1, nome: "Vila da Lógica",      sub: "Algoritmos e fluxogramas",          tema: "floresta", cor: "#ff2a4d", pronto: true },
  { n: 2, nome: "Praia do Print",      sub: "print, input e variáveis",          tema: "praia",    cor: "#ffb020", pronto: true,
    guia: { nome: "CAPITÃ PRINT · SALVA-VIDAS DA PRAIA", avatar: { sexo: "f", pele: 3, cabelo: "rabo", corCabelo: 4, rosto: "feliz", roupa: "regata", corRoupa: 0, calca: "shorts", corCalca: 0, calcado: "chinelo", corCalcado: 2, chapeu: "bone", corChapeu: 0, rosto2: "escuros", fundo: 5 } } },
  { n: 3, nome: "Deserto dos Cálculos",sub: "Operadores, int() e float()",       tema: "deserto",  cor: "#ff7a1a", pronto: true,
    guia: { nome: "DONA CONTA · GUIA DAS CARAVANAS", avatar: { sexo: "f", pele: 4, cabelo: "tranca", corCabelo: 0, rosto: "feliz", roupa: "jaqueta", corRoupa: 1, corRoupa2: 2, calca: "calca", corCalca: 7, calcado: "bota", corCalcado: 6, chapeu: "cowboy", corChapeu: 1, rosto2: "oculos", pescoco: "cachecol", fundo: 4 } } },
  { n: 4, nome: "Montanha das Decisões",sub: "if, elif e else",                  tema: "neve",     cor: "#3fa9ff", pronto: false },
  { n: 5, nome: "Caverna do Loop",     sub: "while e for",                       tema: "caverna",  cor: "#9b59ff", pronto: false },
  { n: 6, nome: "Cidade das Listas",   sub: "Listas e índices",                  tema: "cidade",   cor: "#ff5fa8", pronto: false },
  { n: 7, nome: "Fábrica de Funções",  sub: "def, parâmetros e retorno",         tema: "circuito", cor: "#00e5ff", pronto: false },
  { n: 8, nome: "Papelaria Ponto Certo",sub: "Projeto final: sistema completo",  tema: "floresta", cor: "#ffd23f", pronto: false }
];

// As fases de todos os mundos entram nesta lista (cada arquivo de mundo acrescenta as suas).
window.FASES = [];
