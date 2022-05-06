function pr_str(data) {
  if (typeof data === 'number'){
    return data.toString();
  } else if (data === null) {
    return 'nil';
  } else if (Object.is(data, true)) {
    return 'true';
  } else if (Object.is(data, false)) {
    return 'false';
  } else if (typeof data === 'function') {
    return '#<function>';
  } else if (typeof data === 'string') {
    return data; // pmtodo: change this to handle symbols 
  } else if (data instanceof Array){
    const parts = data.map(part => pr_str(part));
    return `(${parts.join(' ')})`;
  }
}

exports.pr_str = pr_str;

// console.log(pr_str(['inc', ['first', [2, 3, 4]]]));
// console.log("---");
// console.log(pr_str([ 'let*', [ 'c', false ], 'c' ]));