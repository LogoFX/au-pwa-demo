import { IHeatmap } from "model/contracts";

/**
 * The Heatmap
 */
export class Heatmap implements IHeatmap {

  public matrix: number[][];

  private _axisXLabels: string[];
  public get axisXLabels(): string[] {
    return this._axisXLabels;
  }
  public set axisXLabels(value: string[]) {
    this._axisXLabels = value;
  }

  private _axisYLabels: string[];
  public get axisYLabels(): string[] {
    return this._axisYLabels;
  }
  public set axisYLabels(value: string[]) {
    this._axisYLabels = value;
  }

  private _values: { XLabel: string; YLabel: string; Value: number }[];
  public get values(): { XLabel: string; YLabel: string; Value: number }[] {
    return this._values;
  }
  public set values(value: { XLabel: string; YLabel: string; Value: number }[]) {
    this._values = value;
  }
}
