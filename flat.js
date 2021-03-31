// const list = [1, 2, [3, [6, [7]]], 4];
function flat(list, acc = []) {
  list.forEach((el) => {
    if (!Array.isArray(el)) {
      return acc.push(el);
    } else {
      return [...acc, ...flat(el, acc)];
    }
  });
  return acc;
}
// console.log(flat(list));
const list = [
  "myfile.txt",
  "dirstart",
  "오늘숙제.doc",
  "dirstart",
  "책리스트.txt",
  "dirend",
  "요리법.hwp",
  "dirend",
  "fe멤버들.md",
];

function parse(list, parentNode = { type: "Directory", child: [] }) {
  for (let i = 0; i < list.length; i++) {
    const el = list[i];
    if (el === "dirstart") {
      const [dir, j] = parse(list.slice(i + 1));
      parentNode.child.push(dir);
      i += j + 1;
    } else if (el === "dirend") {
      return [parentNode, i];
    } else {
      parentNode.child.push({ type: "file", value: el });
    }
  }
  return parentNode;
}

console.log(JSON.stringify(parse(list), null, 2));
