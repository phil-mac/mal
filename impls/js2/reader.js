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
  input = input
      .replace(/\\\\/g, '\\')
  const reader = new Reader(tokenize(input));
  return read_form(reader);
}

function tokenize (input) {
  const regex = /[\s,]*(~@|[\[\]{}()'`~^@]|"(?:\\.|[^\\"])*"?|;.*|[^\s\[\]{}('"`,;)]+)/g;

  const groups = [...input.matchAll(regex)].map(match => match[1]);

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
  if (results === undefined) {
    return read_list(reader, [])
  } else {
    if (reader.peek() === undefined){
      throw new Error('Error: unbalanced parentheses')
    }
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
  let token = reader.next();
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
    token = token.slice(1, -1);
    token = token
      .replace(/\\"/g, '"')
      .replace(/\\n/g, '\n')
    token = `"${token}"`
    
    return token;
  } else {
    return token;
  }
}

exports.read_str = read_str;