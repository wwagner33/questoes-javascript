// questoes.js
const exercicios = [
  {
    id: 1,
    pergunta: "Qual será o resultado exibido no console após a execução do código a seguir?",
    codigo: "let x = 10;\nconst y = 20;\nx = y;\nconsole.log(x);",
    resposta: "20",
    justificativa: "A variável `x`, declarada com `let`, pode ter seu valor reatribuído. Ela recebe o valor da constante `y` (20), e esse novo valor é impresso no console.",
    opcoes: ["10", "20", "30", "undefined", "null"],
    categoria: "Variáveis",
    dificuldade: "iniciante"
  },
  {
    id: 2,
    pergunta: "Analise o trecho de código abaixo. O que será impresso no console?",
    codigo: "console.log(typeof null);",
    resposta: '"object"',
    justificativa: 'Este é um comportamento conhecido e uma peculiaridade histórica do JavaScript. O `typeof null` retorna "object", embora `null` seja um tipo primitivo. É um bug que foi mantido por razões de compatibilidade.',
    opcoes: ['"null"', '"undefined"', '"object"', '"boolean"', '"number"'],
    categoria: "Tipos",
    dificuldade: "intermediario"
  },
  {
    id: 3,
    pergunta: "Qual é a saída do seguinte código?",
    codigo: "let a;\nconsole.log(a);",
    resposta: "undefined",
    justificativa: "Uma variável que foi declarada com `let` (ou `var`), mas à qual nenhum valor foi atribuído, tem o valor `undefined` por padrão em JavaScript.",
    opcoes: ["null", "undefined", "0", "NaN", "''"],
    categoria: "Variáveis",
    dificuldade: "iniciante"
  },
  {
    id: 4,
    pergunta: "Qual valor a função `verificarNumero` retornará ao ser chamada com o argumento 5?",
    codigo: 'function verificarNumero(num) {\n  if (num > 10) {\n    return "Maior que 10";\n  } else {\n    return "Menor ou igual a 10";\n  }\n}\n// console.log(verificarNumero(5));',
    resposta: '"Menor ou igual a 10"',
    justificativa: 'A condição `5 > 10` é falsa. Portanto, o fluxo de execução entra no bloco `else` e a função retorna a string "Menor ou igual a 10".',
    opcoes: ['"Maior que 10"', '"Menor ou igual a 10"', '"5"', '"undefined"', 'null'],
    categoria: "Funções",
    dificuldade: "iniciante"
  },
  {
    id: 5,
    pergunta: "Qual o resultado da expressão `Number('10') + 5` no console?",
    codigo: null,
    resposta: "15",
    justificativa: "A função `Number('10')` primeiro converte a string '10' para o número 10. Em seguida, a operação aritmética `10 + 5` é realizada, resultando no número 15.",
    opcoes: ["10", "15", "105", "NaN", "undefined"],
    categoria: "Conversão de Tipos",
    dificuldade: "iniciante"
  },
  {
    id: 6,
    pergunta: "O que será exibido no console após a execução do laço `while` abaixo?",
    codigo: "let i = 0;\nlet resultado = '';\nwhile (i < 3) {\n  resultado += i;\n  i++;\n}\nconsole.log(resultado);",
    resposta: '"012"',
    justificativa: "O laço executa 3 vezes. A cada iteração, o valor de `i` (0, depois 1, depois 2) é concatenado à string `resultado`. Quando `i` se torna 3, a condição `i < 3` é falsa e o laço termina.",
    opcoes: ['"012"', '"123"', '"0123"', '"001"', '"12"'],
    categoria: "Loops",
    dificuldade: "iniciante"
  },
  {
    id: 7,
    pergunta: "Qual é a saída do código que utiliza um laço `for...of`?",
    codigo: "const cores = ['vermelho', 'verde', 'azul'];\nfor (const cor of cores) {\n  console.log(cor);\n}",
    resposta: "'vermelho', 'verde', 'azul' (em linhas separadas)",
    justificativa: "O laço `for...of` é projetado para iterar diretamente sobre os valores de um objeto iterável, como um array. A cada iteração, a variável `cor` recebe um dos elementos do array, que é então impresso.",
    opcoes: [
      "'vermelho', 'verde', 'azul' (em linhas separadas)",
      "'vermelho, verde, azul'",
      "'azul', 'verde', 'vermelho' (em linhas separadas)",
      "'vermelho'",
      "'azul'"
    ],
    categoria: "Loops",
    dificuldade: "intermediario"
  },
  {
    id: 8,
    pergunta: "Considere o objeto `carro` e o laço `for...in`. O que será impresso no console?",
    codigo: "const carro = { marca: 'Ford', modelo: 'Mustang', ano: 1969 };\nlet texto = '';\nfor (let x in carro) {\n  texto += carro[x] + ' ';\n}\nconsole.log(texto);",
    resposta: "'Ford Mustang 1969 '",
    justificativa: "O laço `for...in` itera sobre as chaves (propriedades) de um objeto ('marca', 'modelo', 'ano'). A expressão `carro[x]` acessa o valor de cada propriedade, que é então concatenado à variável `texto`.",
    opcoes: [
      "'Ford Mustang 1969 '",
      "'Ford Mustang 1969'",
      "'Mustang Ford 1969'",
      "'1969 Ford Mustang'",
      "'Ford 1969 Mustang'"
    ],
    categoria: "Objetos",
    dificuldade: "intermediario"
  },
  {
    id: 9,
    pergunta: "Qual será o valor final da variável `soma` após a execução do método `forEach`?",
    codigo: "const numeros = [10, 20, 30];\nlet soma = 0;\nnumeros.forEach(function(valor) {\n  soma += valor;\n});\nconsole.log(soma);",
    resposta: "60",
    justificativa: "O método `forEach` executa a função de callback para cada elemento do array. A variável `soma` é acumulada a cada chamada: 0 + 10 = 10, depois 10 + 20 = 30, e finalmente 30 + 30 = 60.",
    opcoes: ["60", "50", "70", "30", "90"],
    categoria: "Arrays",
    dificuldade: "iniciante"
  },
  {
    id: 10,
    pergunta: "O que a instrução `switch` exibirá no console? (Assuma que o código foi executado em uma terça-feira, onde `new Date().getDay()` retorna 2)",
    codigo: 'let dia = 2; // Simulação para terça-feira\nlet texto;\nswitch (dia) {\n  case 6:\n    texto = "Hoje é Sábado";\n    break;\n  case 0:\n    texto = "Hoje é Domingo";\n    break;\n  default:\n    texto = "Ansioso pelo fim de semana!";\n}\nconsole.log(texto);',
    resposta: '"Ansioso pelo fim de semana!"',
    justificativa: "A instrução `switch` compara o valor de `dia` (2) com cada `case`. Como não há um `case 2`, o bloco `default` é executado, atribuindo a string correspondente à variável `texto`.",
    opcoes: [
      '"Ansioso pelo fim de semana!"',
      '"Hoje é Sábado"',
      '"Hoje é Domingo"',
      '"Hoje é Segunda"',
      '"Hoje é Terça"'
    ],
    categoria: "Estruturas de Controle",
    dificuldade: "iniciante"
  },
  {
    id: 11,
    pergunta: "Qual é a saída do seguinte laço `do...while`?",
    codigo: 'let i = 5;\nlet texto = "";\ndo {\n  texto += i;\n  i++;\n} while (i < 5);\nconsole.log(texto);',
    resposta: '"5"',
    justificativa: "A principal característica do laço `do...while` é que o bloco de código é executado *pelo menos uma vez*, antes da condição ser verificada. O `5` é concatenado, `i` se torna 6, e a condição `6 < 5` se torna falsa, terminando o laço.",
    opcoes: ['"5"', '"6"', '"0"', '""', '"undefined"'],
    categoria: "Loops",
    dificuldade: "intermediario"
  },
  {
    id: 12,
    pergunta: "O que o `console.log` exibirá após a execução deste código?",
    codigo: "function calcular() {\n  let x = 10;\n  return;\n  const y = 20; \n}\nconsole.log(calcular());",
    resposta: "undefined",
    justificativa: "Quando a instrução `return` é usada sem um valor, a função termina sua execução imediatamente e retorna `undefined`. O código após a linha do `return` nunca é alcançado.",
    opcoes: ["undefined", "null", "10", "20", "0"],
    categoria: "Funções",
    dificuldade: "iniciante"
  },
  {
    id: 13,
    pergunta: "Analise o trecho de código. Qual será o valor de `resultado`?",
    codigo: "const obj = { a: 1 };\nconst arr = [1];\n\nconst resultado = (typeof obj === typeof arr);\nconsole.log(resultado);",
    resposta: "true",
    justificativa: 'Em JavaScript, o operador `typeof` aplicado a um array retorna a string "object". Como o `typeof` de um objeto literal também é "object", a comparação `"object" === "object"` resulta em `true`.',
    opcoes: ["true", "false", "undefined", "null", "0"],
    categoria: "Tipos",
    dificuldade: "intermediario"
  },
  {
    id: 14,
    pergunta: "Qual será a saída no console do código abaixo?",
    codigo: "console.log(1 / 0);",
    resposta: "Infinity",
    justificativa: "JavaScript segue o padrão de ponto flutuante IEEE 754. Neste padrão, a divisão de um número (exceto zero) por zero não gera um erro, mas resulta no valor especial `Infinity`.",
    opcoes: ["Infinity", "0", "1", "NaN", "undefined"],
    categoria: "Números",
    dificuldade: "iniciante"
  },
  {
    id: 15,
    pergunta: "O que será impresso no console por este trecho de código?",
    codigo: "const pessoa = new Object();\npessoa.nome = 'Ana';\n\nconst novaPessoa = pessoa;\nnovaPessoa.nome = 'Bia';\n\nconsole.log(pessoa.nome);",
    resposta: "'Bia'",
    justificativa: "Objetos em JavaScript são tipos de referência. A linha `const novaPessoa = pessoa` não cria uma cópia; ambas as variáveis passam a apontar para o *mesmo* objeto na memória. Modificar o objeto através de uma variável reflete na outra.",
    opcoes: ["'Bia'", "'Ana'", "'Bia e Ana'", "'undefined'", "'null'"],
    categoria: "Objetos",
    dificuldade: "intermediario"
  }
];