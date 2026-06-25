const path = require("path");

module.exports = {
  root: true,
  extends: [
    path.resolve(__dirname, "../../packages/config/eslint-preset.js"),
    "next/core-web-vitals",
  ],
  rules: {
    "@next/next/no-html-link-for-pages": "error",
    "react/react-in-jsx-scope": "off",
  },
};
