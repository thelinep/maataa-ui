# Application Registry (M2 preview)

This package directory contains reproducible application records built from a pinned domain-registry snapshot. The resolver is deterministic and side-effect free: application-local overrides are copied into the Application IR and never written back to Domain Registry assets.

`registry.json` is a local versioned registry asset, not a connected service. It records each app ID, intent, registry version/hash, resolver version, IR versions, context pins, selected flows, overrides, plans, artifact references, and environment assignments. Compilation plans and environment assignments remain empty until a governed service supplies them.

The canonical proof app is the casting pipeline. Its schema preview is a logical projection only. The current source catalog does not define columns, keys, or relations, so the Prisma preview deliberately marks itself non-compilable and does not invent fields.
