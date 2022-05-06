const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout,
});

function READ (input) {
  return input;
}

function EVAL (input) {
  return input;
}

function PRINT (input) {
  return input;
}

function rep (input) {
  return READ(EVAL(PRINT(input)));
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