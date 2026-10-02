export interface Environment3D {
  background: string;
  grid: boolean;
  axes: boolean;
  gridColor: string;
  axesColor: string;
}

export function Environment(options: Partial<Environment3D> = {}): Environment3D {
  return {
    background: "#FAF6F1",
    grid: true,
    axes: true,
    gridColor: "#92877A",
    axesColor: "#BC5D4D",
    ...options,
  };
}
