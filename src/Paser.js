const tokenizer = require("./Tokenizer.js");
const lexer = require("./Lexer.js");

const pipe = (...fns) => (arg) => fns.reduce((arg, fn) => fn(arg), arg);

const string =
  "['1a3',[12+'a',null,false,['11',[112233],{'easy' : ['hello', {'a':'a'}, 'world']},112],55, '99'],{'a':'str', 'b':[912,[5656,33],{'key' : 'inner value', 'newkeys': [1,2,3,4,5]}]}, true, 'a']";
const setOfopenType = {
  "[": "array",
  "{": "object",
};
// { 부터 시작하는게 끊기는 문제 해결할 것!
const parser = (list) => {
  const opener = list.shift().value;
  const openType = setOfopenType[opener];
  if (!openType) throw new Error("not array");
  const parentNode = { type: openType, child: [] };
  let objSet = setObjectProperty();

  while (list.length > 0) {
    const { type, value, subType, flag } = list[0];
    if (!subType) {
      if (openType === "array") {
        parentNode.child.push({ type, value });
        list.shift();
        continue;
      } else {
        if (isEmptyObj(objSet.value.propKey)) {
          objSet.value.propKey = { type, value };
          list.shift();
        } else {
          objSet.value.propValue = subType ? parser(list) : { type, value };
          parentNode.child.push(objSet);
          objSet = setObjectProperty();
        }
      }
    } else {
      if (subType === "open") {
        parentNode.child.push(parser(list));
      } else if (subType === "close") {
        return parentNode;
      }
    }
  }
};
const isEmptyObj = (obj) => {
  return !Object.keys(obj).length;
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
const result = pipe(tokenizer, lexer, parser);
const re = JSON.stringify(result(string), null, 2);
console.log(re);
