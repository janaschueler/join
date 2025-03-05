import globals from "globals";
import pluginJs from "@eslint/js";

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    languageOptions: { globals: { ...globals.browser, ...globals.node } },
  },
  pluginJs.configs.recommended,
  {
    rules: {
      "padding-line-between-statements": [
        "error",
        {
          blankLine: "always",
          prev: "function",
          next: "function",
        },
        {
          blankLine: "always",
          prev: "function",
          next: "block",
        },
        {
          blankLine: "always",
          prev: "block",
          next: "function",
        },
      ],
    },
  },
];
