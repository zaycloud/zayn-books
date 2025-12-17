const globals = require("globals");
const js = require("@eslint/js");

module.exports = [
  js.configs.recommended,
  {
    files: ["**/*.js"],
    ignores: ["vitest.config.js"],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "commonjs",
      globals: {
        ...globals.node,
        ...globals.jest,  // För test-filer
      },
    },
    rules: {
      // Fel som alltid ska fångas
      "no-unused-vars": "warn",        // Oanvända variabler = varning
      "no-undef": "error",             // Odefinierade variabler = fel
      "no-console": "off",             // console.log är OK i backend
      "semi": ["warn", "always"],      // Semicolon i slutet
      "eqeqeq": "warn",                // Använd === istället för ==
    },
  },
  {
    ignores: ["node_modules/**", "vitest.config.js"],
  },
];
