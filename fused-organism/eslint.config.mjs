// Optional richer lint configuration. The zero-external-runtime-dependency certification lane uses scripts/lint.mjs.
export default [{ files: ["**/*.{js,mjs,cjs}"], rules: { "no-eval": "error", "no-new-func": "error" } }];
