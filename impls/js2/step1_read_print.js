const reader = require('./reader');
const printer = require('./printer');

const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout,
});

function READ (input) {
  return reader.read_str(input);
}

function EVAL (input) {
  if (typeof input === 'string') {
    if (/^".*"$/g.test(input)) {
      return input.slice(1, -1);
    } else {
      return input;
    } 
  } 
  return input;
}

function PRINT (input) {
  return printer.pr_str(input);
}

function rep (input) {
  return PRINT(EVAL(READ(input)));
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

// console.log(printer.pr_str(['inc', ['first', [2, 3, 4]]]));

// const result = reader.read_str("(inc (first (5 10 15)))");
// console.log(result);