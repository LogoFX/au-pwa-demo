import { IRelatedDataItem } from "./related-data-item";
import { HeatmapSliceType } from "data";

export interface IRelatedData {
  items: IRelatedDataItem[];
  slice: HeatmapSliceType;
}
