const reader = require('./reader');
const printer = require('./printer');
const { Env } = require('./env');

const repl_env = new Env();
repl_env.set('+', (a, b) => a + b);
repl_env.set('-', (a, b) => a - b);
repl_env.set('*', (a, b) => a * b);
repl_env.set('/', (a, b) => a / b);

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
    if (ast[0] === 'def!'){
       const val = EVAL(ast[2], env);
       env.set(ast[1], val);
       return val;
    } else if (ast[0] === 'let*') {
      const newEnv = new Env(env);
      const bindings = ast[1];
      for (i = 0; i < bindings.length; i += 2) {
        const val = EVAL(bindings[i + 1], newEnv);
        newEnv.set(bindings[i], val);
      }
      return EVAL(ast[2], newEnv);
    } else {
      const evaledList = eval_ast(ast, env);
      const result = evaledList[0].apply(undefined, evaledList.slice(1));
      return result; 
    }
  }
}

function eval_ast (ast, env) {
  if (typeof ast === 'string') {
    if (env.find(ast)) {
      return env.get(ast);
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
    console.log(rep(input));
    repl();
  })
}

repl();