// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import storybook from "eslint-plugin-storybook";

// Optional richer lint configuration. The zero-external-runtime-dependency certification lane uses scripts/lint.mjs.
export default [
  { files: ["**/*.{js,mjs,cjs}"], rules: { "no-eval": "error", "no-new-func": "error" } },
  ...storybook.configs["flat/recommended"]
];
