# Contributing

1. Keep the certified kernel small.
2. Add or change a semantic contract before adding a domain-specific representation.
3. Run `npm run certify` before proposing a merge.
4. Every interactive component requires keyboard, focus and accessible-name behavior in metadata/tests.
5. Every control action requires authority class, failure states, cancellation/timeout semantics and evidence behavior.
6. Generated schemas and registry files must never be hand-edited.
7. Domain packs may not be imported by foundation packages.
