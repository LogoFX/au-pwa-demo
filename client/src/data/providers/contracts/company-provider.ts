import { CompanyDto } from 'data';

export interface ICompanyProvider {

  getAsync(id?: string): Promise<CompanyDto[]> | Promise<CompanyDto>;
  postAsync(contactDto: CompanyDto): Promise<void>;
  putAsync(contactDto: CompanyDto): Promise<void>;
  deleteAsync(id?: string): Promise<void>;
}
