/**
 *
 * FilterBaseDto
 */
export abstract class FilterBaseDto {
  public id: string;
  public name: string;
  public type: string;

  constructor (id: string, name: string, type: string) {
    this.id = id;
    this.name = name;
    this.type = type;
  }
}
