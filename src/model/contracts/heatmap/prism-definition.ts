import { IHeatmapDefinition } from "./heatmap-definition";
import { IModel } from "logofx";

export interface IPrismDefinition extends IModel<string> {
  name: string;
  heatmap: IHeatmapDefinition;
}
