import globals from "globals";
import js from "@eslint/js";

export default [
  js.configs.recommended,
  {
    files: ["src/**/*.js", "src/**/*.jsx"],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      globals: {
        ...globals.browser,
      },
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    rules: {
      // Fel som alltid ska fångas
      "no-unused-vars": "warn",        // Oanvända variabler = varning
      "no-undef": "error",             // Odefinierade variabler = fel
      "no-console": "off",             // console.log är OK
      "semi": ["warn", "always"],      // Semicolon i slutet
      "eqeqeq": "warn",                // Använd === istället för ==
    },
  },
  {
    ignores: ["dist/**", "node_modules/**", "playwright-report/**"],
  },
];
