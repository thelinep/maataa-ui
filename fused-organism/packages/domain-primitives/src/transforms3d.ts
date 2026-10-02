import type { Model3D, Vector3 } from "./Model3D";

export function Translate(model: Model3D, position: Vector3): Model3D {
  return { ...model, position };
}

export function Rotate(model: Model3D, rotation: Vector3): Model3D {
  return { ...model, rotation };
}

export function Scale(model: Model3D, scale: Vector3): Model3D {
  return { ...model, scale: scale.map((value) => Math.max(0.05, value)) as unknown as Vector3 };
}
