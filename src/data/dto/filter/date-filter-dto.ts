import { FilterBaseDto } from './filter-base-dto';
import { Moment } from 'moment';

/**
 *
 * DateFilterDto
 */
export class DateFilterDto extends FilterBaseDto {
  public selectedDate: Moment;

  constructor (id: string, name: string, selectedDate: Moment) {
    super(id, name, "DateFilterDto");
    this.selectedDate = selectedDate;
  }
}
