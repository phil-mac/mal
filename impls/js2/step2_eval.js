const reader = require('./reader');
const printer = require('./printer');

const repl_env = {
  '+': (a, b) => a + b,
  '-': (a, b) => a - b,
  '*': (a, b) => a * b,
  '/': (a, b) => a / b};

const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout,
});

function READ (input) {
  return reader.read_str(input);
}

function EVAL (ast, env) {
  const isList = ast instanceof Array;
  if (!isList) {
    return eval_ast(ast, env);
  } else if (ast.length === 0) {
    return ast;
  } else {
    const evaledList = eval_ast(ast, env);
    return evaledList[0].apply(undefined, evaledList.slice(1));
  }
}

function eval_ast (ast, env) {
  if (typeof ast === 'string') {
    if (ast in env) {
      return env[ast];
    } else {
      return x => x
    }
  } else if (ast instanceof Array) {
    return ast.map(node => EVAL(node, env));
  } else {
    return ast;
  }
}

function PRINT (input) {
  return printer.pr_str(input);
}

function rep (input) {
  return PRINT(EVAL(READ(input), repl_env));
}

function repl () {
  readline.question('user> ', input => {
    if (input === 'exit'){
      return;
    }
    try {
      console.log(rep(input));
    } catch (e) {
      console.log(e.message);
    }
    repl();
  })
}

repl();

// console.log(printer.pr_str(['inc', ['first', [2, 3, 4]]]));

// const result = reader.read_str("(inc (first (5 10 15)))");
// console.log(result);