const setOfopenType = {
  "[": "array",
  "{": "object",
};

const parser = (list) => {
  const opener = list.shift().value;
  const openType = setOfopenType[opener];
  if (!openType) throw new Error("not array");

  const parentNode = { type: openType, child: [] };
  let prev = [];
  while (list.length > 0) {
    const token = list.shift();
    const { subType } = token;
    const props = {
      parentNode,
      token,
      subType,
      list,
      openType,
      prev,
    };
    if (isClose(subType)) {
      return parentNode;
    }
    isOpen(props) ?? isArray(props) ?? isObject(props);
  }
};
const getElementSet = ({ type, value }) => {
  return { type, value };
};
const createPropKey = (prev) => {
  const key = prev.pop();
  return getElementSet(key);
};
const createPropValue = (subType, list, token) => {
  if (subType) {
    list.unshift(token);
    return parser(list);
  } else {
    return getElementSet(token);
  }
};
const isOpen = ({ parentNode, token, subType, list }) => {
  if (subType !== "open") return null;
  list.unshift(token);
  parentNode.child.push(parser(list));
  return false;
};

const isClose = (subType) => {
  return subType === "close";
};

const isArray = ({ parentNode, token, openType }) => {
  if (openType !== "array") return null;
  parentNode.child.push(getElementSet(token));
  return true;
};

const isObject = ({ parentNode, token, openType, list, prev, subType }) => {
  if (openType !== "object") return null;

  let objSet = setObjectProperty();
  if (prev.length === 0) {
    prev.push(token);
    return true;
  }
  if (isColon(subType)) {
    objSet.value.propKey = createPropKey(prev);

    const token = list.shift();
    const { subType } = token;
    objSet.value.propValue = createPropValue(subType, list, token);

    parentNode.child.push(objSet);
    return true;
  }
};
const isColon = (subType) => {
  return subType === "colon";
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

export default parser;
