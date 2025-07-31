module.exports = {
  parser: "@typescript-eslint/parser",
  extends: [
    "plugin:@typescript-eslint/recommended",
    "plugin:prettier/recommended",
  ],
  plugins: ["@typescript-eslint", "prettier"],
  rules: {
    "prettier/prettier": "error",
    // Add any project-specific ESLint rules here
  },
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: "module",
  },
};
