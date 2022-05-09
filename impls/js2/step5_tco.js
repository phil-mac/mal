const reader = require('./reader');
const printer = require('./printer');
const { Env } = require('./env');
const core = require('./core');

const repl_env = new Env();
for (let [key, value] of Object.entries(core.ns)) {
  repl_env.set(key, value);
}  

const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout,
});

function READ (input) {
  return reader.read_str(input);
}

function EVAL (ast, env) {
  while (true) {
    if (! (ast instanceof Array)) {
      return eval_ast(ast, env);
    }
    if (ast.length === 0) {
      return ast;
    } 
    switch (ast[0]) {
      case 'def!':
        const val = EVAL(ast[2], env);
        env.set(ast[1], val);
        return val;
      case 'let*':
        const newEnv = new Env(env);
        const bindings = ast[1];
        for (i = 0; i < bindings.length; i += 2) {
          const val = EVAL(bindings[i + 1], newEnv);
          newEnv.set(bindings[i], val);
        }
        ast = ast[2];
        env = newEnv;
        continue;
      case 'do':
        const doEvaledList = eval_ast(ast.slice(1, -1), env);
        ast = ast.pop();
        continue;
      case 'if':
        const conditional = EVAL(ast[1], env);
        if (conditional === null || conditional === false) {
          ast = ast[3];
          continue;
        } else {
          ast = ast[2];
          continue;
        }
      case 'fn*':
        return {
          ast: ast[2],
          params: ast[1],
          env: env,
          fn: function() {
            const newFnEnv = new Env(env, ast[1], arguments);
            return EVAL(ast[2], newFnEnv);
          }
        } 
      default:
        const [f, ...args] = eval_ast(ast, env);
        if (typeof f === 'function'){
          return f.apply(undefined, args);
        } else {
          ast = f.ast;
          env = new Env(f.env, f.params, args);
          continue;
        }
    }
  }
}

function eval_ast (ast, env) {
  if (typeof ast === 'string') {
    if (/^".*"$/g.test(ast)) {
      return ast;
    } else {
      return env.get(ast);
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