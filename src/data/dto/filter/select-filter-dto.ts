import { FilterBaseDto } from "./filter-base-dto";
import { FilterNamedItemDto } from "./filter-named-item-dto";

/**
 *
 * SelectFilterDto
 */
export class SelectFilterDto extends FilterBaseDto {

  public options: FilterNamedItemDto[];
  public selectedOptionValue: string;

  constructor (id: string, name: string, options: FilterNamedItemDto[]) {
    super(id, name, "SelectFilterDto");
    this.options = options;
    this.selectedOptionValue = this.options.length > 0 ? this.options[0].value : "";
  }
}
