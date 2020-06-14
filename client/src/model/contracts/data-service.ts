import { ICompany } from './company';
import { IContact } from "./contact";

export interface IDataService {

  contacts: IContact[];
  companies: ICompany[];

  createContact(): Promise<IContact>;
  getContact(id: string): Promise<IContact>;
  getContacts(): Promise<IContact[]>;
  updateContact(model: IContact): Promise<IContact>;
  deleteContact(model: IContact): Promise<void>;

  createCompany(): Promise<ICompany>;
  getCompany(id: string): Promise<ICompany>;
  getCompanies(): Promise<ICompany[]>;
  updateCompany(model: ICompany): Promise<ICompany>;
  deleteCompany(model: ICompany): Promise<void>;
}
