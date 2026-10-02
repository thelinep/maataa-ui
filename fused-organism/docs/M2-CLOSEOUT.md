# M2 Closeout — 0.4.1

M2 is considered closed only after the ten pre-M3 evidence gaps are resolved:

1. exact Chromium version pinned;
2. INV-001…INV-022 mapping published;
3. shipped vs deferred React hooks published;
4. direct-CDP decision recorded against the earlier Playwright/axe expectation;
5. browser-required vs tree-only gates published;
6. visual threshold/font/DPR/update mechanics published and enforced;
7. certified component/state surfaces published;
8. explicit not-certified list published;
9. M0R findings published;
10. every remaining M0 item marked resolved, partially resolved, or explicitly deferred.

`npm run gate:m2-closeout` checks the presence and core consistency of this evidence. M3 must not be declared complete from M2 evidence; it begins as an experimental camera package milestone.
