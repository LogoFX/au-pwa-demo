import { IExploreProvider } from "../contracts";
import { PrismDefinitionDto, HeatmapDto, HeatmapDefinitionDto, RelatedDataItemDto, RelatedDataDto } from "data/dto";

//const BASE_PATH = 'https://api.mktmediastats.com:443/api/v1'.replace(/\/+$/, '');

export class HeatmapProvider implements IExploreProvider {

  constructor () {
  }

  public async getPrismDefinitionList(): Promise<PrismDefinitionDto[]> {
    const url = `/prism-definitions.json`;
    const data = await fetch(url);
    const json = await data.json();

    const result: PrismDefinitionDto[] = [];

    json.forEach(prismDef => {
      const prismDefDto = new PrismDefinitionDto();
      prismDefDto.id = prismDef.id;
      prismDefDto.name = prismDef.name;
      prismDefDto.heatmap = new HeatmapDefinitionDto();
      prismDefDto.heatmap.dataSourceUri = prismDef.heatmap["data-source-uri"];
      prismDefDto.heatmap.relatedData = prismDef.heatmap["related-data"].map(rd => {
        const rdDto = new RelatedDataDto()
        rdDto.slice = rd["heatmap-slice"];
        rdDto.items = rd.items.map(rdi => {
          const rdiDto = new RelatedDataItemDto();
          rdiDto.title = rdi.title;
          rdiDto.indicatorValue = rdi["indicator-value"];
          return rdiDto;
        });
        return rdDto;
      });

      result.push(prismDefDto);
    });

    return result;
  } 

  public async getHeatmap(prismId: string): Promise<HeatmapDto> {
    throw new Error("Method not implemented.");
  }
  
  public async downloadHeatmap(prismId: string): Promise<string> {
    throw new Error("Method not implemented.");
  }
}
