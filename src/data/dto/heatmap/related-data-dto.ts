import { RelatedDataItemDto } from "./related-data-item-dto";
import { HeatmapSliceType } from "data";

/**
 * RelatedDataDto
 */
export class RelatedDataDto {
  public items: RelatedDataItemDto[];
  public slice: HeatmapSliceType;
}
