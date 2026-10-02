/**
 * @tlps/workflow-primitives
 * Package-owned view of the master primitive registry. Planned entries are
 * inventory only; this package does not claim those components are implemented.
 */
import { masterPrimitiveRegistry } from "@maataa/primitives/master-registry";
export type {
  PrimitiveRegistryCategory,
  PrimitiveRegistryItem,
  PrimitiveRegistryStatus,
} from "@maataa/primitives/master-registry";
export const WorkflowPrimitivesCategories = masterPrimitiveRegistry.filter(
  (category) => category.canonicalPackage === "@tlps/workflow-primitives",
);
export const WorkflowPrimitivesCatalog = WorkflowPrimitivesCategories.flatMap((category) =>
  category.items.map((item) => ({ ...item, category: category.title })),
);
export const implementedWorkflowPrimitives = WorkflowPrimitivesCatalog.filter(
  (item) => item.status === "implemented",
);
