import { SortScopeDto } from '../sort/sort-scope-dto';
import { FilterScopeDto } from '../filter/filter-scope-dto';
import { HeatmapDefinitionDto } from './heatmap-definition-dto';

/**
 *
 * PrismDefinitionDto
 */
export class PrismDefinitionDto {
  public id: string;
  public name: string;
  public filterScope: FilterScopeDto;
  public sortScope: SortScopeDto;
  public heatmap: HeatmapDefinitionDto;
}
