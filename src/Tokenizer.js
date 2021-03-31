const { DIVIDER } = require("./type.js");
const tokenizer = (str) => {
  const result = [];
  let stack = "";
  let isString = false;

  for (let i = 0; i < str.length; i++) {
    const char = str[i];
    if (DIVIDER.includes(char)) {
      if (isString) {
        stack += char;
      } else {
        stack.length > 0 ? result.push(stack) : "";
        char !== "," ? result.push(char) : "";
        stack = "";
      }
    } else {
      if (char === "'") {
        isString = !isString;
      } else if (char === " " && !isString) {
        continue;
      }
      stack += char;
    }
  }
  return result;
};

module.exports = tokenizer;

// tokenizer(
//   "['1a3',[12+'a',null,false,['11',[112233],{'easy' : ['hello', {'a':'a'}, 'world']},112],55, '99'],{'a':'str', 'b':[912,[5656,33],{'key' : 'inner value', 'newkeys': [1,2,3,4,5]}]}, true, 'a']"
// );
