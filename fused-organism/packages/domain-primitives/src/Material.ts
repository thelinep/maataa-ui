export interface Material3D {
  color: string;
  opacity: number;
  unlit: boolean;
}

export function Material(options: Partial<Material3D> = {}): Material3D {
  return { color: "#C88A5A", opacity: 1, unlit: false, ...options };
}
