import type { Camera3D } from "./Camera3D";
import type { Model3D, Vector3 } from "./Model3D";

export type Matrix4 = Float32Array;

export function multiply4(a: Matrix4, b: Matrix4): Matrix4 {
  const out = new Float32Array(16);
  for (let column = 0; column < 4; column += 1) {
    for (let row = 0; row < 4; row += 1) {
      out[column * 4 + row] =
        a[row] * b[column * 4] +
        a[4 + row] * b[column * 4 + 1] +
        a[8 + row] * b[column * 4 + 2] +
        a[12 + row] * b[column * 4 + 3];
    }
  }
  return out;
}

export function translate4([x, y, z]: Vector3): Matrix4 {
  return new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, x, y, z, 1]);
}

export function rotateX4(angle: number): Matrix4 {
  const c = Math.cos(angle);
  const s = Math.sin(angle);
  return new Float32Array([1, 0, 0, 0, 0, c, s, 0, 0, -s, c, 0, 0, 0, 0, 1]);
}

export function rotateY4(angle: number): Matrix4 {
  const c = Math.cos(angle);
  const s = Math.sin(angle);
  return new Float32Array([c, 0, -s, 0, 0, 1, 0, 0, s, 0, c, 0, 0, 0, 0, 1]);
}

export function rotateZ4(angle: number): Matrix4 {
  const c = Math.cos(angle);
  const s = Math.sin(angle);
  return new Float32Array([c, s, 0, 0, -s, c, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);
}

export function scale4([x, y, z]: Vector3): Matrix4 {
  return new Float32Array([x, 0, 0, 0, 0, y, 0, 0, 0, 0, z, 0, 0, 0, 0, 1]);
}

export function modelMatrix(model: Model3D): Matrix4 {
  return [
    translate4(model.position),
    rotateZ4(model.rotation[2]),
    rotateY4(model.rotation[1]),
    rotateX4(model.rotation[0]),
    scale4(model.scale),
  ].reduce(multiply4);
}

function normalize(vector: Vector3): Vector3 {
  const length = Math.hypot(...vector) || 1;
  return [vector[0] / length, vector[1] / length, vector[2] / length];
}

function subtract(a: Vector3, b: Vector3): Vector3 {
  return [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
}

function cross(a: Vector3, b: Vector3): Vector3 {
  return [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
}

function dot(a: Vector3, b: Vector3): number {
  return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
}

export function viewMatrix(camera: Camera3D): Matrix4 {
  const [tx, ty, tz] = camera.target;
  const horizontal = Math.cos(camera.pitch) * camera.distance;
  const eye: Vector3 = [
    tx + Math.sin(camera.yaw) * horizontal,
    ty + Math.sin(camera.pitch) * camera.distance,
    tz + Math.cos(camera.yaw) * horizontal,
  ];
  const forward = normalize(subtract(camera.target, eye));
  const right = normalize(cross(forward, [0, 1, 0]));
  const up = cross(right, forward);
  return new Float32Array([
    right[0],
    up[0],
    -forward[0],
    0,
    right[1],
    up[1],
    -forward[1],
    0,
    right[2],
    up[2],
    -forward[2],
    0,
    -dot(right, eye),
    -dot(up, eye),
    dot(forward, eye),
    1,
  ]);
}

export function perspective4(fieldOfView: number, aspect: number, near = 0.1, far = 100): Matrix4 {
  const f = 1 / Math.tan(fieldOfView / 2);
  const range = 1 / (near - far);
  return new Float32Array([
    f / aspect,
    0,
    0,
    0,
    0,
    f,
    0,
    0,
    0,
    0,
    (near + far) * range,
    -1,
    0,
    0,
    near * far * range * 2,
    0,
  ]);
}
