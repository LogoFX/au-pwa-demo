export interface IHeatmap {
  axisXLabels: string[];
  axisYLabels: string[];
  values: {XLabel: string; YLabel: string; Value: number}[];
  matrix: number[][];
}
