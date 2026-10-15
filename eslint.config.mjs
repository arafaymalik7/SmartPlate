import nextVitals from "eslint-config-next/core-web-vitals";
import globals from "globals";
const config = [
  {
    ignores: [
      ".next/**",
      "node_modules/**",
      "legacy/**",
      "playwright-report/**",
      "test-results/**",
    ],
  },
  ...nextVitals,
  {
    languageOptions: { globals: { ...globals.browser, ...globals.node } },
  },
];

export default config;
