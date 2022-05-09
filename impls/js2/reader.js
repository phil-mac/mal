const Reader = function (tokens) {
  this.tokens = tokens;
  this.position = 0;
  this.next = () => {
    const currentToken = this.tokens[this.position];
    this.position += 1;
    return currentToken;
  }
  this.peek = () => {
    return this.tokens[this.position];
  }
}

function read_str (input) {
  // console.log("read_srt input:", input)
  // console.log({input})
  
  // input2 = input.replace(/\\\\"/g, '\\"')
  // input2 = input2.replace(/\\"/g, '"')

  // console.log("read_srt input:", input2)
  // console.log({input2})
  const reader = new Reader(tokenize(input));
  return read_form(reader);
}

function tokenize (input) {
  // console.log('tokenize input: ', input)
  // console.log('tokenize input: ', {input})
      
  // console.log('tokenize input after: ', input)
  // console.log('tokenize input after: ', {input})
  
  const regex = /[\s,]*(~@|[\[\]{}()'`~^@]|"(?:\\.|[^\\"])*"?|;.*|[^\s\[\]{}('"`,;)]+)/g;

  const groups = [...input.matchAll(regex)].map(match => match[1]);

  // console.log({groups})
  return groups;
}

function read_form (reader) {
  if (reader.peek()[0] === '@') {
    return ['deref', read_form(reader)];
  } else if (reader.peek()[0] === '(') {
    reader.next();
    return read_list(reader);
  } else {
    return read_atom(reader);    
  }

  // return mal data type ??
}

function read_list (reader, results) {
  if (results === undefined){
    return read_list(reader, [])
  } else {
    const token = read_form(reader);
    if (token === ')') {
      return results; 
    } else {
      results.push(token);
      return read_list(reader, results);
    }
  }
}

function read_atom (reader) {
  const token = reader.next();
  // console.log("read_atom token: ", token)
  const float = parseFloat(token);
  if (!isNaN(float)){
    return float;
  } else if (token === 'nil'){
    return null;
  } else if (token === 'true') {
    return true;
  } else if (token === 'false') {
    return false;
  } else if (/^".*"$/g.test(token)) {
    // console.log('read_atom found string')
    // return token.slice(1, -1);
    return token
      .replace(/\\"/g, '"')
      .replace(/\\\\/g, '\\')
      .replace(/\\n/g, '\n');
    return token;
  } else {
    return token;
  }
}

exports.read_str = read_str;