import type { Vector3 } from "./Model3D";

export interface Camera3D {
  yaw: number;
  pitch: number;
  distance: number;
  target: Vector3;
  fieldOfView: number;
}

export const defaultCamera3D: Camera3D = {
  yaw: Math.PI / 4,
  pitch: 0.42,
  distance: 5.5,
  target: [0, 0, 0],
  fieldOfView: Math.PI / 3,
};
