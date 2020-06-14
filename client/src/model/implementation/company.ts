import { EditableModel } from 'logofx';
import { ICompany } from 'model/contracts';
import { ValidationRules } from 'aurelia-validation';

/**
 * The Company model
 */
export class Company extends EditableModel<string> implements ICompany {

  [x: string]: any;

  private _name: string = String.empty;

  constructor() {

    super();

    this.rules = ValidationRules
        .ensure((c: Company) => c.firstName).displayName('Company Name').required().withMessage('The value is mandatory')
        .rules;
  }

  public get name(): string {
    return this._firstName;
  }

  public set name(value: string) {
    this._name = value;
    this.makeDirty();
  }
}
