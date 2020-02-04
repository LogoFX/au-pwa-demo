import { Rule } from 'aurelia-validation';
import { makeString } from 'logofx';

export interface IModel<T> {
    id: T;

    rules: Rule<{}, any>[][];

    [x: string]: any;
}

export interface ICanBeDirty {

    isDirty: boolean;

    makeDirty(): void;

    cleanDirty(): void;

}

export interface IEditableModel<T> extends IModel<T>, ICanBeDirty {

  isNew: boolean;

  beginEdit(): void;

  cancelEdit(): void;

  commitEdit(): void;

}

/**
 * Model
 */
export class Model<T> implements IModel<T> {

    public id: T;

    private _rules: Rule<{}, any>[][];

    public get rules(): Rule<{}, any>[][] {
        return this._rules;
    }

    public set rules(value: Rule<{}, any>[][]) {
        if (value === this._rules) {
            return;
        }

        this._rules = value;
    }

    public toString(): string {
        return makeString(this);
    }
}

/**
 * EditableModel
 */
export class EditableModel<T> extends Model<T> implements IEditableModel<T> {

  private _newGuard: boolean;
  private _isDirty: boolean = false;
  private _isNew: boolean = false;
  private _isEditing: boolean = false;
  private _originalState: IEditableModel<T>;

  constructor() {
    super();
  }

  public get isNew(): boolean {
    return this._isNew;
  }

  public get isDirty(): boolean {
    return this._isDirty;
  }

  public makeDirty(): void {
    this._isDirty = (true && this._isEditing);
  }

  public cleanDirty(): void {
    this._isDirty = false;
  }

  public beginEdit(): void {
    this.cleanDirty();
    this._isEditing = true;
}

  public cancelEdit(): void {
    this.cleanDirty();
    this._isEditing = false;
  }

  public commitEdit(): void {
    this.cleanDirty();
    this._isEditing = false;
  }

  protected makeNew(): void {
    if (!this._newGuard) {
      this._newGuard = this._isNew = true;
    }
  }
}
