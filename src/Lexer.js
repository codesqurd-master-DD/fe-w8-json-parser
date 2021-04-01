const SEPERATOR = ['{', '}', '[', ']', ':'];
const OPERATOR = ['+', '-', '*', '/', '**'];
const BOOLEAN = ['true', 'false'];

const subTypeSet = {
  '[': 'open',
  '{': 'open',
  ']': 'close',
  '}': 'close',
  ':': 'prop',
};

const lexer = (tokens) => {
  return tokens.map(classifyToken);
};
const classifyToken = (token) => {
  const type = getTokenType(token);
  return {
    type,
    value: token,
    subType: type === 'seperator' ? subTypeSet[token] : null,
  };
};

const getTokenType = (token) => {
  if (SEPERATOR.includes(token)) {
    return 'seperator';
  }
  if (OPERATOR.includes(token)) {
    return 'operator';
  }
  if (BOOLEAN.includes(token)) {
    return 'boolean';
  }
  if (/^'.+'$/g.test(token)) {
    return 'string';
  }
  if (/[a-zA-Z]/.test(token)) {
    return 'identifier';
  }
  if (/[0-9]/.test(token)) {
    return 'number';
  }
  if (token === 'null') {
    return 'object';
  }
  if (token === 'undefined') {
    return 'undefined';
  }
};

module.exports = lexer;
