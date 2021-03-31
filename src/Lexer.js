

const tokenizer = require("./Tokenizer.js");
const { SEPERATOR, OPERATOR, BOOLEAN } = require("./type.js");
const getSubType = {
  "[": "open",
  "{": "open",
  "]": "close",
  "}": "close",
  ":": "prop",
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

  if (BOOLEAN.includes(token)) {
    return "boolean";
  }
  if (/^'.+'$/g.test(token)) {
    return "string";
  }
  if (/[a-zA-Z]/.test(token)) {
    return "identifier";

  }
  if (/[0-9]/.test(token)) {
    return "number";
  }
  if (token === "null") {
    return "object";
  }
  if (token === "undefined") {
    return "undefined";
  }
};

const list = lexer(
  "['1a3',['a',null,false,['11',[112233],{'easy' : ['hello', {'a':'a'}, 'world']},112],55, '99'],{'a':'str', 'b':[912,[5656,33],{'key' : 'inner value', 'newkeys': [1,2,3,4,5]}]}, true, 'a']"
);
// const list = lexer("[{'a': 'str'}, {'b': [1,2,3]}]");
function parse(list, openType = "array") {
  const parentNode = { type: openType, child: [] };
  for (let i = 0; i < list.length; i++) {
    const { type, value, subType } = list[i];
    if (!subType && openType === "array") {
      parentNode.child.push({ type, value });
    } else if (subType === "prop") {
      const { type: type1, value: value1 } = list[i - 1];
      const { type: type2, value: value2, subType } = list[i + 1];

      let propValue;
      if (!subType) {
        propValue = {
          type: type2,
          value: value2,
        };
      } else {
        const [dir, j] = parse(
          list.slice(i + 2),
          value2 === "{" ? "object" : "array"
        );
        i += j + 1;
        propValue = dir;
      }
      parentNode.child.push({
        type: "objectProperty",
        value: {
          propKey: {
            value: value1,
            type: type1,
          },
          propValue,
        },
      });
    } else if (subType === "open") {
      const [dir, j] = parse(
        list.slice(i + 1),
        value === "{" ? "object" : "array"
      );
      parentNode.child.push(dir);
      i += j + 1;
    } else if (subType === "close") {
      console.log(i, list.length);
      return [parentNode, i];
    }
  }
  console.log("실행 안 됨");
  return parentNode;
}
console.log(parse(list));

