const ns = {
  '+': (a, b) => a + b,
  '-': (a, b) => a - b,
  '*': (a, b) => a * b,
  '/': (a, b) => a / b,
  '<': (a, b) => a < b,
  '<=': (a, b) => a <= b,
  '>': (a, b) => a > b,
  '>=': (a, b) => a >= b,
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
  
};

exports.ns = ns;