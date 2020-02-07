import { autoinject } from 'aurelia-framework';
import { IDataService, IPrismDefinition, IHeatmap } from 'model/contracts';
import { HeatmapProvider, PrismDefinitionDto, RelatedDataDto, RelatedDataItemDto } from 'data';
import { PrismDefinition, HeatmapDefinition, RelatedData, RelatedDataItem } from './heatmap';

/**
 * DataService
 */
@autoinject
export class DataService implements IDataService {
  
  public heatmapPrismList: IPrismDefinition[];  riskPrismList: IPrismDefinition[];

  // tslint:disable: no-parameter-properties
  constructor(private heatmapProvider: HeatmapProvider) {
  }

  public async getHeatmapPrismList(): Promise<void> {
    const prismList = await this.heatmapProvider.getPrismDefinitionList();
    this.heatmapPrismList = prismList.map(x => this.mapPrismDefinition(x));
  }

  public async getHeatmap(prismId: string): Promise<IHeatmap> {
    throw new Error("Method not implemented.");
  }

  public async downloadHeatmap(prismId: string): Promise<string> {
    throw new Error("Method not implemented.");
  }

  private mapPrismDefinition(prismDto: PrismDefinitionDto): PrismDefinition {
    const prism = new PrismDefinition(prismDto.id, prismDto.name);
    prism.heatmap = new HeatmapDefinition();
    prism.heatmap.dataSourceUri = prismDto.heatmap.dataSourceUri;
    prism.heatmap.relatedData = prismDto.heatmap.relatedData.map(x => this.mapRelatedData(x));
    return prism;
  }

  private mapRelatedData(dto: RelatedDataDto): RelatedData {
    return { slice: dto.slice, items: dto.items.map(x => this.mapRelatedDataItem(x)) };
  }

  private mapRelatedDataItem(dto: RelatedDataItemDto): RelatedDataItem {
    return { title: dto.title, indicatorValue: dto.indicatorValue };
  }
}
