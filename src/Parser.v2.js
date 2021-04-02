const tokenizer = require("./Tokenizer.js");
const lexer = require("./Lexer.js");
const pipe = (...fns) => (arg) => fns.reduce((arg, fn) => fn(arg), arg);

const setOfopenType = {
  "[": "array",
  "{": "object",
};

const parser = (list) => {
  const opener = list.shift().value;
  const openType = setOfopenType[opener];
  if (!openType) throw new Error("not array");

  const parentNode = { type: openType, child: [] };
  let prev = [];
  while (list.length > 0) {
    const token = list.shift();
    const { subType } = token;

    if (isOpen(subType)) {
      list.unshift(token);
      parentNode.child.push(parser(list));
      continue;
    }
    if (isClose(subType)) {
      return parentNode;
    }
    if (isArray(openType)) {
      parentNode.child.push(getElementSet(token));
      continue;
    }
    if (isObject(openType)) {
      let objSet = setObjectProperty();
      if (prev.length === 0) {
        prev.push(token);
        continue;
      }
      if (isColon(subType)) {
        objSet.value.propKey = createPropKey(prev);

        const token = list.shift();
        const { subType } = token;
        objSet.value.propValue = createPropValue(subType, list, token);

        parentNode.child.push(objSet);
      }
    }
  }
};
const getElementSet = ({ type, value }) => {
  return { type, value };
};
const createPropKey = (prev) => {
  const key = prev.pop();
  return getElementSet(key);
};
const createPropValue = (subType, list, token) => {
  if (subType) {
    list.unshift(token);
    return parser(list);
  } else {
    return getElementSet(token);
  }
};
const isOpen = (subType) => {
  return subType === "open";
};
const isClose = (subType) => {
  return subType === "close";
};
const isColon = (subType) => {
  return subType === "colon";
};
const isObject = (openType) => {
  return openType === "object";
};
const isArray = (openType) => {
  return openType === "array";
};
const setObjectProperty = () => {
  return {
    type: "objectProperty",
    value: {
      propKey: {},
      propValue: {},
    },
  };
};

const string =
  "['1a3',[null,false,['11',[112233],{'easy' : ['hello', {'a':'a', 'b' :'b'}, 'world']},112],55, '99'],{'a':'str', 'b':[912,[5656,33],{'key' : 'inner value', 'newkeys': [1,2,3,4,5]}]}, true, 'a']";


const result = pipe(tokenizer, lexer, parser);
const re = JSON.stringify(result(string), null, 2);
console.log(re);
