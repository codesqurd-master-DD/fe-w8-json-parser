const tokenizer = require("./Tokenizer.js");
const lexer = require("./Lexer.js");

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
        propValue = { type: type2, value: value2 };
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
        value: { propKey: { value: value1, type: type1 }, propValue },
      });
    } else if (subType === "open") {
      const [dir, j] = parse(
        list.slice(i + 1),
        value === "{" ? "object" : "array"
      );
      parentNode.child.push(dir);
      i += j + 1;
    } else if (subType === "close") {
      return [parentNode, i];
    }
  }
  return parentNode;
}

const string =
  "['1a3',[null,false,['11',[112233],{'easy' : ['hello', {'a':'a'}, 'world']},112],55, '99'],{'a':'str', 'b':[912,[5656,33],{'key' : 'inner value', 'newkeys': [1,2,3,4,5]}]}, true, 'a']";

const list = lexer(tokenizer(string));
console.log(JSON.stringify(JSON.parse(string)));
