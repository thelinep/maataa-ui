// Stops ESLint's legacy config lookup here, so the root app's .eslintrc.cjs never
// applies to the library. Library rules: packages/maataa-ui/.eslintrc.json (lint:ui)
// and eslint.config.mjs (lint).
module.exports = { root: true };
