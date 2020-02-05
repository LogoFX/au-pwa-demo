import { HeatmapDto, PrismDefinitionDto } from "data";

export interface IExploreProvider {

  getPrismDefinitionList(): Promise<PrismDefinitionDto[]>;

  getHeatmap(prismId: string): Promise<HeatmapDto>;

  downloadHeatmap(prismId: string): Promise<string>;
}
