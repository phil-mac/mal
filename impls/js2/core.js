const reader = require('./reader');
const fs = require('fs');

const ns = {
  '+': (a, b) => a + b,
  '-': (a, b) => a - b,
  '*': (a, b) => a * b,
  '/': (a, b) => a / b,
  '<': (a, b) => a < b,
  '<=': (a, b) => a <= b,
  '>': (a, b) => a > b,
  '>=': (a, b) => a >= b,
  'str': (...params) => params.join(''),
  'list': (...params) => params,
  'list?': (list) => list instanceof Array,
  'empty?': (list) => list.length === 0,
  'count': (list) => list instanceof Array ? list.length : 0,
  '=': (a, b) => {
    if ((typeof(a) === typeof(b)) && (a === b)){
      return true;
    }
    if (a instanceof Array &&
        b instanceof Array && 
        a.length === b.length){
      let isEqual = true; 
      for (i = 0; i < a.length; i++) {
        if (a[i] !== b[i]) {
          isEqual = false;
        }
      }
      return isEqual;
    }
    return false;
  },
  'prn': (x) => {
    console.log(x);
    // PMTODO: something with `print_readably`? 
    return null;
  },
  'read-string': (input) => {

    // console.log("raw input: ", {input})
    input = input.slice(1, -1)
    // .replace(/[\r\n]/gm, 'n')
    // input = input
      // .replace(/\\"/g, '"')
      // .replace(/\\n/g, 'n')
      // .replace(/\\\\/g, '\\')

    // console.log("processed input: ", {input})
    
  // input2 = input.replace(/\\\\"/g, '\\"')
  // input2 = input2.replace(/\\"/g, '"')

    // console.log("refined input: ", {input})
    return reader.read_str(input);
  },
  // 'read-string': (input) => reader.read_str(input.replace(/\\\\/g, '\\')),
  'slurp': (filename) =>  fs.readFileSync(filename, 'utf8'),
  'atom': (val) => ({val}),
  'atom?': (input) => typeof input === 'object' ? "val" in input : false,
  'deref': (atom) => atom.val,
  'reset!': (atom, newVal) => atom.val = newVal,
  'swap!': (atom, fnObj, ...args) => {
    const fn = typeof fnObj === 'function' ? fnObj : fnObj.fn;
    atom.val = fn.apply(undefined, [atom.val, ...args]);
    return atom.val;
  },
  'cons': (item, list) => [item, ...list],
  'concat': (first, ...rest) => !!first && 
    first instanceof Array && 
    first.concat(...rest)
};

exports.ns = ns;