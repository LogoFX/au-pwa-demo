import { IExploreProvider } from "../contracts";
import { PrismDefinitionDto, FilterScopeDto, HeatmapDto, LineChartDto } from "data/dto";

export class HeatmapProvider implements IExploreProvider {
  public async getPrismDefinitionList(): Promise<PrismDefinitionDto[]> {
    throw new Error("Method not implemented.");
  } 

  public async getHeatmap(prismId: string, filter: FilterScopeDto): Promise<HeatmapDto> {
    throw new Error("Method not implemented.");
  }
  
  public async getLineChartData(prismId: string, filter: FilterScopeDto, theme?: string, column?: string): Promise<LineChartDto[]> {
    throw new Error("Method not implemented.");
  }
  
  public async downloadHeatmap(prismId: string, filter: FilterScopeDto): Promise<string> {
    throw new Error("Method not implemented.");
  }
  
  public async downloadLineChartData(prismId: string, indicatorValue: string, reservoir: string, topic?: string, symbol?: string): Promise<string> {
    throw new Error("Method not implemented.");
  }

}
