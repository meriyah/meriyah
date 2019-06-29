export const LEFT_MENU_CONFIG = [
  {
    category: "Source Type",
    items: [{ title: "Module", value: "module", selected: true }]
  },
  {
    category: "Parsing Modes",
    items: [
      { title: "Directives", value: "directives", selected: false },
      { title: "ESNext features", value: "next", selected: false },
      { title: "Distinguish Identifier", value: "identifierPattern", selected: false },
      { title: "Index-based range", value: "ranges", selected: false },
      { title: "JSX", value: "jsx", selected: false, disabled: true },
      { title: "Line/column location", value: "loc", selected: false },
      { title: "Lexical scope tracking", value: "lexical", selected: false },
      { title: "Preserve parens", value: "preserveParens", selected: false },
      { title: "Raw property", value: "raw", selected: false },
      { title: "Strict mode", value: "impliedStrict", selected: false },
      { title: "Web compability", value: "webcompat", selected: false }
    ]
  },
  {
    category: "Parsers",
    items: [
      { title: "JavaScript", value: "js", selected: true, disabled: true },
      { title: "TypeScript", value: "ts", selected: false, disabled: true }
    ]
  }
];
