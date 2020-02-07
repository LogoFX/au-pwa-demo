import { IExploreProvider } from "../contracts";
import { PrismDefinitionDto, HeatmapDto } from "data/dto";

//const BASE_PATH = 'https://api.mktmediastats.com:443/api/v1'.replace(/\/+$/, '');

export class HeatmapProvider implements IExploreProvider {

  constructor () {
  }

  public async getPrismDefinitionList(): Promise<PrismDefinitionDto[]> {
    const url = `/prism-definitiions.json`;
    const data = await fetch(url);
    const json = await data.json();

    return null;
  } 

  public async getHeatmap(prismId: string): Promise<HeatmapDto> {
    throw new Error("Method not implemented.");
  }
  
  public async downloadHeatmap(prismId: string): Promise<string> {
    throw new Error("Method not implemented.");
  }
}
