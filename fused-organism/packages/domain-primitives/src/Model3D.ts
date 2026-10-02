import type { Material3D } from "./Material";
import { Material } from "./Material";

export type Vector3 = readonly [number, number, number];
export type Geometry3D = "box" | "sphere" | "plane";

export interface Model3D {
  id: string;
  name: string;
  geometry: Geometry3D;
  position: Vector3;
  rotation: Vector3;
  scale: Vector3;
  material: Material3D;
}

export interface Model3DOptions extends Partial<Omit<Model3D, "material">> {
  id: string;
  material?: Partial<Material3D>;
}

export function createModel3D(options: Model3DOptions): Model3D {
  return {
    id: options.id,
    name: options.name ?? "Model",
    geometry: options.geometry ?? "box",
    position: options.position ?? [0, 0, 0],
    rotation: options.rotation ?? [0, 0, 0],
    scale: options.scale ?? [1, 1, 1],
    material: Material(options.material),
  };
}
