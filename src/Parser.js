const tokenizer = require("./Tokenizer.js");
const lexer = require("./Lexer.js");
const pipe = (...fns) => (arg) => fns.reduce((arg, fn) => fn(arg), arg);

const setOfopenType = {
  "[": "array",
  "{": "object",
};
const string =
  "['1a3',[null,false,['11',[112233],{'easy' : ['hello', {'a':'a', 'b' : 'b'}, 'world']},112],55, '99'],{'a':'str', 'b':[912,[5656,33],{'key' : 'inner value', 'newkeys': [1,2,3,4,5]}]}, true, 'a']";

const parser = (list) => {
  const opener = list.shift().value;
  const openType = setOfopenType[opener];
  if (!openType) throw new Error("not array");

  const parentNode = { type: openType, child: [] };
  let objSet = setObjectProperty();
  let prev = [];
  while (list.length > 0) {
    const { type, value, subType } = list[0];
    console.log(list[0]);
    if (isOpen(subType)) parentNode.child.push(parser(list));
    else if (isClose(subType)) {
      list.shift();
      return parentNode;
    } else {
      if (isObject(openType)) {
        if (prev.length === 0) {
          prev.push(list.shift());
        } else if (isProps(subType)) {
          const key = prev.pop();
          objSet.value.propKey = { type: key.type, value: key.value };
          list.shift();

          const { nextType, nextValue, nextSubType } = list[0];

          if (nextSubType) {
            objSet.value.propValue = parser(list);
          } else {
            objSet.value.propValue = { type: nextType, value: nextValue };
            list.shift();
          }
          parentNode.child.push(objSet);
        }
      } else if (isArray(openType)) {
        parentNode.child.push({ type, value });
        list.shift();
      }
    }
  }
};
const isEmptyObjSet = (objSet) => {
  return !Object.keys(objSet.value.propKey).length;
};
const isOpen = (subType) => {
  return subType === "open";
};
const isClose = (subType) => {
  return subType === "close";
};
const isProps = (subType) => {
  return subType === "prop";
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

const result = pipe(tokenizer, lexer, parser);
const re = JSON.stringify(result(string), null, 2);
console.log(re);
