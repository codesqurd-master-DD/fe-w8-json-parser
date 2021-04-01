const DIVIDER = ["{", "}", "[", "]", ":", ",", "+", "-"];

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
const isDivider = (char) => {};

module.exports = tokenizer;
