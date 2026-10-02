# Adapter SDK

Every adapter exposes descriptor + connect/disconnect/readState/dispatch. Capabilities are explicit. Commands are bounded by capability and carry idempotency keys. Simulator adapters are first-class test fixtures.
