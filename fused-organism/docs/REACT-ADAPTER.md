# React Adapter

`@maataa/react` is one of the 11 active packages. React is an optional host-provided peer (`>=18.2.0 <20`), not an entry in package `dependencies`.

The adapter remains explicit and injection-based:

```js
createMaataaReact(React, services)
```

M2 / 0.4.1 freezes adapter host-contract version `1.0.0`, exports the peer range, validates host capabilities, and certifies the resulting semantics in a real Chromium browser. This preserves tree-only kernel reproducibility while keeping the application responsible for supplying its chosen supported React implementation.
