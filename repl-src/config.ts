export const LEFT_MENU_CONFIG = [
  {
    category: "Source Type",
    items: [{ title: "Module", value: "module", selected: true }]
  },
  {
    category: "Parsing Modes",
    items: [
      { title: "Directives", value: "directives", selected: false },
      { title: "Index-based range", value: "ranges", selected: false },
      { title: "Implied strict", value: "impliedStrict", selected: false },
      { title: "JSX", value: "jsx", selected: false, disabled: true }, // grayed out
      { title: "Line and column-based", value: "loc", selected: false },
      { title: "Lexical", value: "lexial", selected: false },
      { title: "Next", value: "next", selected: false },
      { title: "Raw", value: "raw", selected: false },
      { title: "Web compat", value: "webcompat", selected: false }
    ]
  },
  {
    category: "Parsers",
    items: [
      { title: "EcmaScript (js)", value: "js", selected: false },
      { title: "TypeScript (ts)", value: "ts", selected: false, disabled: true } // grayed out
    ]
  }
];
