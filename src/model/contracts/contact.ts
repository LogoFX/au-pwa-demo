import { IModel, IEditableModel } from 'logofx/Model';
import { EnumDeclaration } from 'typescript';

export interface IContact extends IEditableModel<string> {
  firstName: string;
  lastName: string;
  email: string;
  gender: string;
}
