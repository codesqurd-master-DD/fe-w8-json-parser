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
  while (list.length > 0) {
    const { type, value, subType } = list[0];

    if (isOpen(subType)) parentNode.child.push(parser(list));
    else if (isClose(subType)) {
      list.shift();
      return parentNode;
    } else {
      if (isObject(openType)) {
        if (isEmptyObjSet(objSet)) {
          objSet.value.propKey = { type, value };
          list.shift();
        } else {
          if (value === ":") {
            list.shift();
            continue;
          }
          objSet.value.propValue = subType ? parser(list) : { type, value };
          parentNode.child.push(objSet);
          objSet = setObjectProperty();
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
