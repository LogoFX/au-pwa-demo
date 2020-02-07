import { IPrismDefinition, IHeatmap } from "./heatmap";

export interface IDataService {
  heatmapPrismList: IPrismDefinition[];
  riskPrismList: IPrismDefinition[];

  getHeatmapPrismList(): Promise<void>;
  getHeatmap(prismId: string): Promise<IHeatmap>;
  downloadHeatmap(prismId: string): Promise<string>;  
}
