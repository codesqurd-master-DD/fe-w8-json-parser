const DIVIDER = ["{", "}", "[", "]", ":", ",", "+", "-"];

const checkDivider = (char) => DIVIDER.includes(char);

const checkApostrophe = (char) => char === "'";

const changeStringStatus = (stringStatus) => {
  if (stringStatus) return false;
  return true;
};

const checkSpace = (char) => char === " ";

const resetValue = () => "";

const pushParameter = (result, args) => result.push(args);

const tokenizer = (strs) => {
  const result = [];
  let stack = "";
  let isString = false;

  for (let i = 0; i < strs.length; i++) {
    const char = strs[i];
    const isdivider = checkDivider(char);

    if (isdivider) {
      if (isString) stack += char;
      if (!isString) {
        stack.length > 0 ? pushParameter(result, stack) : resetValue();
        char !== "," ? pushParameter(result, char) : resetValue();
        stack = resetValue();
      }
    }

    if (isdivider === false) {
      const isApostrophe = checkApostrophe(char);
      const isSpace = checkSpace(char);
      if (isApostrophe) isString = changeStringStatus(isString);
      if (isSpace && !isString) continue;
      stack += char;
    }
  }
  return result;
};

export default tokenizer;
