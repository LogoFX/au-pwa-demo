import { EditableModel } from 'logofx/model';
import { IContact } from "../contracts/contact";
import { ValidationRules } from 'aurelia-validation';

/**
 * The Contact
 */
export class Contact extends EditableModel<string> implements IContact {

  private _firstName: string = String.empty;
  public get firstName(): string {
    return this._firstName;
  }
  public set firstName(value: string) {
    this._firstName = value;
    this.makeDirty();
  }

  private _lastName: string = String.empty;
  public get lastName(): string {
    return this._lastName;
  }
  public set lastName(value: string) {
    this._lastName = value;
    this.makeDirty();
  }

  private _email: string = String.empty;
  public get email(): string {
    return this._email;
  }
  public set email(value: string) {
    this._email = value;
    this.makeDirty();
  }

  private _gender: string = String.empty;
  public get gender(): string {
    return this._gender;
  }
  public set gender(value: string) {
    this._gender = value;
    this.makeDirty();
  }

  constructor () {
    super();

    this.rules = ValidationRules
        .ensure((c: Contact) => c.firstName).displayName('First Name').required().withMessage('The value is mandatory')
        .ensure((c: Contact) => c.lastName).displayName('Last Name').required().withMessage('The value is mandatory').minLength(3).withMessage('The value < 3')
        .rules;
  }
}
