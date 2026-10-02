/**
 * @tlps/domain-primitives
 * Package-owned view of the master primitive registry. Planned entries are
 * inventory only; this package does not claim those components are implemented.
 */
import { masterPrimitiveRegistry } from "@maataa/primitives/master-registry";
export type {
  PrimitiveRegistryCategory,
  PrimitiveRegistryItem,
  PrimitiveRegistryStatus,
} from "@maataa/primitives/master-registry";
export const DomainPrimitivesCategories = masterPrimitiveRegistry.filter(
  (category) => category.canonicalPackage === "@tlps/domain-primitives",
);
export const DomainPrimitivesCatalog = DomainPrimitivesCategories.flatMap((category) =>
  category.items.map((item) => ({ ...item, category: category.title })),
);
export const implementedDomainPrimitives = DomainPrimitivesCatalog.filter(
  (item) => item.status === "implemented",
);

export { Canvas, CanvasSurface, SpatialCanvas } from "./CanvasSurface";
export type { CanvasObject, CanvasObjectKind, CanvasPoint, CanvasSurfaceProps } from "./CanvasSurface";
export { Scene3D } from "./Scene3D";
export type { Scene3DProps } from "./Scene3D";
export { createModel3D } from "./Model3D";
export type { Geometry3D, Model3D, Model3DOptions, Vector3 } from "./Model3D";
export { defaultCamera3D } from "./Camera3D";
export type { Camera3D } from "./Camera3D";
export { OrbitControl } from "./OrbitControl";
export type { OrbitControlProps } from "./OrbitControl";
export { TransformControl } from "./TransformControl";
export type { TransformControlProps } from "./TransformControl";
export { Rotate, Scale, Translate } from "./transforms3d";
export { Material } from "./Material";
export type { Material3D } from "./Material";
export { Lighting } from "./Lighting";
export type { Lighting3D } from "./Lighting";
export { Environment } from "./Environment";
export type { Environment3D } from "./Environment";
export { Viewport } from "./Viewport";
export type { ViewportProps } from "./Viewport";
export { Snapshot } from "./Snapshot";
export type { SnapshotProps } from "./Snapshot";
export { createGeometry3D } from "./geometry3d";
export type { GeometryBuffers } from "./geometry3d";
export { modelMatrix, multiply4, perspective4, viewMatrix } from "./math3d";
export type { Matrix4 } from "./math3d";
