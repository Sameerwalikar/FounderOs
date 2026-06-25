const path = require("path");

/** @type {import("eslint").Linter.Config} */
module.exports = {
  root: true,
  extends: [
    path.resolve(__dirname, "../../packages/config/eslint-next-preset.js"),
  ],
  parserOptions: {
    project: path.resolve(__dirname, "./tsconfig.json"),
  },
};
