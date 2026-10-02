/**
 * @tlps/generative-primitives
 * Package-owned view of the master primitive registry. Planned entries are
 * inventory only; this package does not claim those components are implemented.
 */
import { masterPrimitiveRegistry } from "@maataa/primitives/master-registry";
export type {
  PrimitiveRegistryCategory,
  PrimitiveRegistryItem,
  PrimitiveRegistryStatus,
} from "@maataa/primitives/master-registry";
export const GenerativePrimitivesCategories = masterPrimitiveRegistry.filter(
  (category) => category.canonicalPackage === "@tlps/generative-primitives",
);
export const GenerativePrimitivesCatalog = GenerativePrimitivesCategories.flatMap((category) =>
  category.items.map((item) => ({ ...item, category: category.title })),
);
export const implementedGenerativePrimitives = GenerativePrimitivesCatalog.filter(
  (item) => item.status === "implemented",
);
