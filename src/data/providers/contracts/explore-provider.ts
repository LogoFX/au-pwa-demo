import { HeatmapDto, FilterScopeDto, LineChartDto, PrismDefinitionDto } from "data";

export interface IHeatmapProvider {

  getPrismDefinitionList(): Promise<PrismDefinitionDto[]>;

  getHeatmap(prismId: string, filter: FilterScopeDto): Promise<HeatmapDto>;

  getLineChartData(prismId: string, filter: FilterScopeDto, theme?: string, column?: string): Promise<LineChartDto[]>;

  downloadHeatmap(prismId: string, filter: FilterScopeDto): Promise<string>;

  downloadLineChartData(prismId: string, indicatorValue: string, reservoir: string, topic?: string, symbol?: string): Promise<string>;
}
