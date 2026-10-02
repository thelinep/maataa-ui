/**
 * @tlps/composites
 * Package-owned view of the master primitive registry. Planned entries are
 * inventory only; this package does not claim those components are implemented.
 */
import { masterPrimitiveRegistry } from "@maataa/primitives/master-registry";
export type {
  PrimitiveRegistryCategory,
  PrimitiveRegistryItem,
  PrimitiveRegistryStatus,
} from "@maataa/primitives/master-registry";
export const CompositesCategories = masterPrimitiveRegistry.filter(
  (category) => category.canonicalPackage === "@tlps/composites",
);
export const CompositesCatalog = CompositesCategories.flatMap((category) =>
  category.items.map((item) => ({ ...item, category: category.title })),
);
export const implementedComposites = CompositesCatalog.filter((item) => item.status === "implemented");
