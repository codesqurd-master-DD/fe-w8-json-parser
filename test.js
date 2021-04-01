const tokenizer = require('./src/Tokenizer.js');
const lexer = require('./src/Lexer.js');

const pipe = (...fns) => (arg) => fns.reduce((arg, fn) => fn(arg), arg);

const shift = (list) => list.shift();

const pushValueToTemp = (temp, list) => temp.push(list.shift());

const manipulateObject = (syntaxManager) => {
  const {
    openType,
    temp,
    list,
    setObjProp,
    subType,
    parentNode,
  } = syntaxManager;
  if (openType !== 'object') return;
  if (temp.length === 0) pushValueToTemp(temp, list);
  if (subType === 'prop') {
    const key = temp.pop();
    setObjProp.value.propKey = { type: key.type, value: key.value };
    shift(list);
    const { type, value, subType } = list[0];

    if (subType) {
      setObjProp.value.propValue = parser(list);
    }

    if (subType === null) {
      setObjProp.value.propValue = { type, value };
      shift(list);
    }
    parentNode.child.push(setObjProp);
  }
};

const manipulateArray = ({ openType, list, parentNode }, type, value) => {
  if (openType !== 'array') return;
  parentNode.child.push({ type, value });
  shift(list);
};
const setOfopenType = {
  '[': 'array',
  '{': 'object',
};
const string =
  "['1a3',[null,false,['11',[112233],{'easy' : ['hello', {'a':'a', 'b' :'b'}, 'world']},112],55, '99'],{'a':'str', 'b':[912,[5656,33],{'key' : 'inner value', 'newkeys': [1,2,3,4,5]}]}, true, 'a']";

const parser = (list) => {
  const opener = list.shift().value;
  const openType = setOfopenType[opener];
  if (!openType) throw new Error('not array');

  const parentNode = { type: openType, child: [] };
  let temp = [];
  while (list.length > 0) {
    const syntax = list[0];
    const { type, value, subType } = syntax;
    switch (subType) {
      case 'open':
        parentNode.child.push(parser(list));
        break;
      case 'close':
        shift(list);
        return parentNode;
      default:
        const syntaxManager = {
          openType,
          temp,
          list,
          setObjProp: setObjectProperty(),
          subType,
          parentNode,
        };
        manipulateObject(syntaxManager);
        manipulateArray(syntaxManager, type, value);
        break;
    }
  }
};

const setObjectProperty = () => {
  return {
    type: 'objectProperty',
    value: {
      propKey: {},
      propValue: {},
    },
  };
};

const result = pipe(tokenizer, lexer, parser);
const re = JSON.stringify(result(string), null, 2);
console.log(re);
