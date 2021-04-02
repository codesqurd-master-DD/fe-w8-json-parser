import "./style.scss";
import parser from "./Parser.v3.js";
import tokenizer from "./Tokenizer.js";
import lexer from "./Lexer.js";

const btn = document.querySelector(".parseBtn");
const result = document.querySelector(".resultBox>pre");
btn.addEventListener("click", ({ target }) => {
  const inputBox = document.querySelector(".inputBox>textarea");
  const text = confirmQuotation(inputBox.value);
  result.textContent = JSON.stringify(DDQ_parser(text), null, 2);
});

const confirmQuotation = (input) => {
  if (input[0] === '"' && input[input.length - 1] === '"') {
    return input.slice(1, input.length - 1);
  } else {
    throw new Error("잘못된 입력!");
  }
};

const pipe = (...fns) => (arg) => fns.reduce((arg, fn) => fn(arg), arg);

const DDQ_parser = pipe(tokenizer, lexer, parser);

const sampleText =
  "['1a3',[null,false,['11',[112233],{'easy' : ['hello', {'a':'a', 'b' :'b'}, 'world']},112],55, '99'],{'a':'str', 'b':[912,[5656,33],{'key' : 'inner value', 'newkeys': [1,2,3,4,5]}]}, true, 'a']";
