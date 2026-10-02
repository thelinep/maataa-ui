/**
 * @tlps/evidence-primitives
 * Package-owned view of the master primitive registry. Planned entries are
 * inventory only; this package does not claim those components are implemented.
 */
import { masterPrimitiveRegistry } from "@maataa/primitives/master-registry";
export type {
  PrimitiveRegistryCategory,
  PrimitiveRegistryItem,
  PrimitiveRegistryStatus,
} from "@maataa/primitives/master-registry";
export const EvidencePrimitivesCategories = masterPrimitiveRegistry.filter(
  (category) => category.canonicalPackage === "@tlps/evidence-primitives",
);
export const EvidencePrimitivesCatalog = EvidencePrimitivesCategories.flatMap((category) =>
  category.items.map((item) => ({ ...item, category: category.title })),
);
export const implementedEvidencePrimitives = EvidencePrimitivesCatalog.filter(
  (item) => item.status === "implemented",
);
