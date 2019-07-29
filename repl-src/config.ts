export const LEFT_MENU_CONFIG = [
  {
    category: "Source Type",
    items: [{ title: "Module", value: "module", selected: true }]
  },
  {
    category: "Parsing Modes",
    items: [
      { title: "Directives", value: "directives", selected: false },
      { title: "Allow spec deviaton", value: "deFacto", selected: false },
      { title: "ESNext features", value: "next", selected: false },
      {
        title: "Distinguish Identifier",
        value: "identifierPattern",
        selected: false
      },
      { title: "Index-based range", value: "ranges", selected: false },
      { title: "JSX", value: "jsx", selected: false },
      { title: "Line/column location", value: "loc", selected: false },
      { title: "Lexical scope tracking", value: "lexical", selected: false },
      { title: "Preserve parens", value: "preserveParens", selected: false },
      { title: "Raw property", value: "raw", selected: false },
      { title: "Strict mode", value: "impliedStrict", selected: false },
      { title: "V8", value: "v8", selected: false },
      { title: "Web compability", value: "webcompat", selected: false }
    ]
  },
];

export const DEFAULT_CODE = `function dropRight(array, n, guard) {
  var length = array == null ? 0 : array.length;
  if (!length) {
    return [];
  }
  n = (guard || n === undefined) ? 1 : toInteger(n);
  n = length - n;
  return baseSlice(array, 0, n < 0 ? 0 : n);
}

export default dropRight;
`;
