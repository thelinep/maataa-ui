/**
 * @tlps/templates
 * Package-owned view of the master primitive registry. Planned entries are
 * inventory only; this package does not claim those components are implemented.
 */
import { masterPrimitiveRegistry } from "@maataa/primitives/master-registry";
export type {
  PrimitiveRegistryCategory,
  PrimitiveRegistryItem,
  PrimitiveRegistryStatus,
} from "@maataa/primitives/master-registry";
export const TemplatesCategories = masterPrimitiveRegistry.filter(
  (category) => category.canonicalPackage === "@tlps/templates",
);
export const TemplatesCatalog = TemplatesCategories.flatMap((category) =>
  category.items.map((item) => ({ ...item, category: category.title })),
);
export const implementedTemplates = TemplatesCatalog.filter((item) => item.status === "implemented");
