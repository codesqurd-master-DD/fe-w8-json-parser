import "./style.scss";
import { user } from "./sample.ts";
console.log("successfully run!!");
console.log(user);

const body = document.querySelector("body");
body.addEventListener("click", ({ target }) => {
  target.style.backgroundColor = "yellow";
});
