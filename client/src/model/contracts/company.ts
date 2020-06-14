import { IEditableModel } from 'logofx';

export interface ICompany extends IEditableModel<string> {
  name: string;
}
