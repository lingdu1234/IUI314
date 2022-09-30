/* eslint-env node */
require("@rushstack/eslint-patch/modern-module-resolution");

module.exports = {
  root: true,
  extends: [
    "plugin:vue/vue3-essential",
    "eslint:recommended",
    "@vue/eslint-config-typescript",
    "@vue/eslint-config-prettier",
  ],
  parserOptions: {
    sourceType: "module",
    ecmaVersion: 2020,
  },
  plugins: ["simple-import-sort"],
  rules: {
    "no-undef": "off",
    "no-unused-vars": [
      "error",
      {
        vars: "all",
        args: "after-used",
        ignoreRestSiblings: true,
        argsIgnorePattern: "^_",
        destructuredArrayIgnorePattern: "^_",
      },
    ],
    quotes: ["error", "double"],
    "simple-import-sort/imports": "error",
    "simple-import-sort/exports": "error",
    "vue/multi-word-component-names": "off", // 多单词组件名称
    "vue/v-on-event-hyphenation": "off", // 事件名称强制 - 分割
    "vue/prop-name-casing": "off", //强制大小写
    "vue/require-default-prop": "off", //prop 必须有默认值.
    "vue/no-mutating-props": "off", //
    "vue/max-attributes-per-line": [
      "error",
      {
        // 设置断行
        singleline: {
          max: 10,
        },
        multiline: {
          max: 3,
        },
      },
    ],
    "vue/first-attribute-linebreak": [
      "error",
      {
        // "singleline": "beside",
        multiline: "below",
      },
    ],
  },
};
