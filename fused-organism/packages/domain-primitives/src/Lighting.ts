import type { Vector3 } from "./Model3D";

export interface Lighting3D {
  direction: Vector3;
  color: string;
  ambient: number;
}

export function Lighting(options: Partial<Lighting3D> = {}): Lighting3D {
  return { direction: [-0.45, 0.8, 0.55], color: "#FFF8ED", ambient: 0.36, ...options };
}
