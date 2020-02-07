import { IRelatedData } from "./related-data";

export interface IHeatmapDefinition {
  dataSourceUri: string;
  relatedData: IRelatedData[];
}
