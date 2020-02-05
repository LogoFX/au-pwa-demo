/**
 *
 * FilterNamedItemDto
 */
export class FilterNamedItemDto {
  public id: string;

  public name: string;

  public value: string;

  public constructor (id: string, name: string, value?: string) {
    this.id = id;
    this.name = name;
    if (!value) {
      this.value = name;
    } else {
      this.value = value;
    }
  }
}
