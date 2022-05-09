function pr_str(data) {
  // console.log('pr_str data: ', data);
  // console.log('pr_str data: ', {data});
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
    // pmtodo: change this to better handle symbols? 
    // console.log("pr_str string: ", {data})
    if (/^".*"$/g.test(data)){
      data = data.slice(1, -1);
    
      data = data
        .replace(/\\/g, '\\\\')
        .replace(/[\r\n]/gm, '\\n')
        .replace(/"/g, '\\"'); 
      // return data;
      return `"${data}"`;
    }
    return data;
  } else if (data instanceof Array){
    const parts = data.map(part => pr_str(part));
    return `(${parts.join(' ')})`;
  } else if (typeof data === 'object' && 'val' in data) {
    return `(atom ${data.val})`;
  }
}

exports.pr_str = pr_str;

// console.log(pr_str(['inc', ['first', [2, 3, 4]]]));
// console.log("---");
// console.log(pr_str([ 'let*', [ 'c', false ], 'c' ]));