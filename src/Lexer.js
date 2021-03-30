const tokenizer = require("./Tokenizer.js");
const { SEPERATOR, OPERATOR, LITERAL } = require("./type.js");

const lexer = (str) => {
  const tokens = tokenizer(str);
  const result = tokens.map(classifyToken);
  console.log(result);
};
const classifyToken = (token) => {
  const type = getTokenType(token);
  return { [token]: type };
};

const getTokenType = (token) => {
  if (SEPERATOR.includes(token)) {
    return "seperator";
  }
  if (OPERATOR.includes(token)) {
    return "operator";
  }
  if (LITERAL.includes(token) || /^'.+'$/g.test(token)) {
    return "literal";
  }
  if (/[0-9]/.test(token)) {
    return "number";
  }
  if (/[a-zA-Z]/.test(token)) {
    return "identifer";
  }
};
lexer(
  "[value, '1a3',[12+'a',null,false,['11',[112233],{'easy' : ['hello', {'a':'a'}, 'world']},112],55, '99'],{'a':'str', 'b':[912,[5656,33],{'key' : 'inner value', 'newkeys': [1,2,3,4,5]}]}, true, 'a']"
);
