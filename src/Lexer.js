const tokenizer = require("./Tokenizer.js");
const { SEPERATOR, OPERATOR, LITERAL } = require("./type.js");
const getSubType = {
  "[": "openArray",
  "]": "closeArray",
  "{": "openObject",
  "}": "closeObject",
  ":": ":이 나왔다?",
};

const lexer = (str) => {
  const tokens = tokenizer(str);
  return tokens.map(classifyToken);
};
const classifyToken = (token) => {
  const type = getTokenType(token);
  return {
    type,
    value: token,
    subType: type === "seperator" ? getSubType[token] : null,
  };
};

const getTokenType = (token) => {
  if (SEPERATOR.includes(token)) {
    return "seperator";
  }
  if (OPERATOR.includes(token)) {
    return "operator";
  }
  if (/[a-zA-Z]/.test(token)) {
    return "identifer";
  }
  if (LITERAL.includes(token) || /^'.+'$/g.test(token)) {
    return "literal";
  }
  if (/[0-9]/.test(token)) {
    return "number";
  }
};
const list = lexer(
  "[value, '1a3',[12+'a',null,false,['11',[112233],{'easy' : ['hello', {'a':'a'}, 'world']},112],55, '99'],{'a':'str', 'b':[912,[5656,33],{'key' : 'inner value', 'newkeys': [1,2,3,4,5]}]}, true, 'a']"
);

function parse(list, parentNode = { type: "Directory", child: [] }) {
  for (let i = 0; i < list.length; i++) {
    const el = list[i];
    if (el === "dirstart") {
      const [dir, j] = parse(list.slice(i + 1));
      parentNode.child.push(dir);
      i += j + 1;
    } else if (el === "dirend") {
      return [parentNode, i];
    } else {
      parentNode.child.push({ type: "file", value: el });
    }
  }
  return parentNode;
}

console.log(JSON.stringify(parse(list), null, 2));
