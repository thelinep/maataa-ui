import type { Geometry3D } from "./Model3D";

export interface GeometryBuffers {
  positions: Float32Array;
  normals: Float32Array;
  vertexCount: number;
}

function pushVertex(out: number[], point: readonly number[], normal: readonly number[]) {
  out.push(point[0], point[1], point[2], normal[0], normal[1], normal[2]);
}

function boxGeometry(): GeometryBuffers {
  const vertices: number[] = [];
  const faces: Array<{ n: [number, number, number]; p: number[][] }> = [
    {
      n: [0, 0, 1],
      p: [
        [-0.5, -0.5, 0.5],
        [0.5, -0.5, 0.5],
        [0.5, 0.5, 0.5],
        [-0.5, 0.5, 0.5],
      ],
    },
    {
      n: [0, 0, -1],
      p: [
        [0.5, -0.5, -0.5],
        [-0.5, -0.5, -0.5],
        [-0.5, 0.5, -0.5],
        [0.5, 0.5, -0.5],
      ],
    },
    {
      n: [1, 0, 0],
      p: [
        [0.5, -0.5, 0.5],
        [0.5, -0.5, -0.5],
        [0.5, 0.5, -0.5],
        [0.5, 0.5, 0.5],
      ],
    },
    {
      n: [-1, 0, 0],
      p: [
        [-0.5, -0.5, -0.5],
        [-0.5, -0.5, 0.5],
        [-0.5, 0.5, 0.5],
        [-0.5, 0.5, -0.5],
      ],
    },
    {
      n: [0, 1, 0],
      p: [
        [-0.5, 0.5, 0.5],
        [0.5, 0.5, 0.5],
        [0.5, 0.5, -0.5],
        [-0.5, 0.5, -0.5],
      ],
    },
    {
      n: [0, -1, 0],
      p: [
        [-0.5, -0.5, -0.5],
        [0.5, -0.5, -0.5],
        [0.5, -0.5, 0.5],
        [-0.5, -0.5, 0.5],
      ],
    },
  ];
  faces.forEach(({ n, p }) => {
    [0, 1, 2, 0, 2, 3].forEach((i) => pushVertex(vertices, p[i], n));
  });
  return split(vertices);
}

function sphereGeometry(): GeometryBuffers {
  const vertices: number[] = [];
  const latitudes = 20;
  const longitudes = 32;
  for (let lat = 0; lat < latitudes; lat += 1) {
    const phi1 = (lat / latitudes) * Math.PI;
    const phi2 = ((lat + 1) / latitudes) * Math.PI;
    for (let lon = 0; lon < longitudes; lon += 1) {
      const theta1 = (lon / longitudes) * Math.PI * 2;
      const theta2 = ((lon + 1) / longitudes) * Math.PI * 2;
      const point = (phi: number, theta: number): [number, number, number] => [
        -Math.cos(theta) * Math.sin(phi),
        Math.cos(phi),
        Math.sin(theta) * Math.sin(phi),
      ];
      const a = point(phi1, theta1);
      const b = point(phi2, theta1);
      const c = point(phi2, theta2);
      const d = point(phi1, theta2);
      [a, b, d, b, c, d].forEach((p) => pushVertex(vertices, p, p));
    }
  }
  return split(vertices);
}

function planeGeometry(): GeometryBuffers {
  const vertices: number[] = [];
  const p = [
    [-0.5, 0, -0.5],
    [0.5, 0, -0.5],
    [0.5, 0, 0.5],
    [-0.5, 0, 0.5],
  ];
  [0, 2, 1, 0, 3, 2].forEach((i) => pushVertex(vertices, p[i], [0, 1, 0]));
  return split(vertices);
}

function split(vertices: number[]): GeometryBuffers {
  const interleaved = new Float32Array(vertices);
  const positions = new Float32Array((interleaved.length / 6) * 3);
  const normals = new Float32Array(positions.length);
  for (let source = 0, target = 0; source < interleaved.length; source += 6, target += 3) {
    positions.set(interleaved.subarray(source, source + 3), target);
    normals.set(interleaved.subarray(source + 3, source + 6), target);
  }
  return { positions, normals, vertexCount: positions.length / 3 };
}

export function createGeometry3D(type: Geometry3D): GeometryBuffers {
  if (type === "sphere") return sphereGeometry();
  if (type === "plane") return planeGeometry();
  return boxGeometry();
}
