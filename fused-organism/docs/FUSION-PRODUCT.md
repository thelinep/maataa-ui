# Using the fused product surface

The fused React workspace exposes the older visual components and an integrated factory called `createMaataaProduct`. The factory uses the kernel's React adapter for common primitives and wraps the visual `Button` with kernel governance.

```tsx
import React from "react";
import { createMaataaProduct } from "@maataa/ui";

const Product = createMaataaProduct(React);

<Product.Button
  policyDecision={{ id: "policy-42", outcome: "allow", reasonCodes: ["SERVER_APPROVED"] }}
  onAction={() => submitActionToServer()}
>
  Continue
</Product.Button>;
```

The button is disabled unless the decision is a complete `allow` or all named approvals are present for `allow_with_approval`. Missing, malformed, denied, unknown, and `allow_with_constraints` decisions are blocked. Constraint-based decisions stay blocked because this product does not yet have a constraint evaluator.

This is a front-end guard and user experience. The server must independently authenticate the user, evaluate current policy and approvals, and authorize every consequential operation. UI props can be stale or manipulated and are never proof of authorization.

`@maataa/ui` exposes visual trust panels, but does not implement authentication, MFA enrollment, or compliance certification. Those panels display caller-provided data and label missing data as “Not connected.”
