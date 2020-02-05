import { IExploreProvider } from "../contracts";
import { PrismDefinitionDto, HeatmapDto } from "data/dto";

export class HeatmapProvider implements IExploreProvider {
  public async getPrismDefinitionList(): Promise<PrismDefinitionDto[]> {
    throw new Error("Method not implemented.");
  } 

  public async getHeatmap(prismId: string): Promise<HeatmapDto> {
    throw new Error("Method not implemented.");
  }
  
  public async downloadHeatmap(prismId: string): Promise<string> {
    throw new Error("Method not implemented.");
  }
}
