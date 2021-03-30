const tokenizer = require("./Tokenizer.js");
const { seperator } = require("./type.js");

const lexer = (str) => {
  const tokens = tokenizer(str);
  const result = tokens.map(classifyToken);
};

const classifyToken = (token) => {
  if (seperator.includes(token)) {
    return { [token]: "separator" };
  }
};

lexer(
  "['1a3',[12+'a',null,false,['11',[112233],{'easy' : ['hello', {'a':'a'}, 'world']},112],55, '99'],{'a':'str', 'b':[912,[5656,33],{'key' : 'inner value', 'newkeys': [1,2,3,4,5]}]}, true, 'a']"
);

["[", "'1a3'", ","];
[{ "[": "separator" }, { "1a3": "string" }, { ",": "쉼표" }];
