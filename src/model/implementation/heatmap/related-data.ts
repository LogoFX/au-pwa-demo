import { IRelatedData, IRelatedDataItem } from "model/contracts";
import { HeatmapSliceType } from "data";

/**
 * RelatedData
 */
export class RelatedData implements IRelatedData {
  public items: IRelatedDataItem[];
  public slice: HeatmapSliceType;
}
