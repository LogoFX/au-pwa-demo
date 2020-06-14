import { ContactDto, ContactProvider, CompanyDto, CompanyProvider } from 'data';
import { IDataService, ICompany, Company, IContact, Contact } from 'model';
import { Guid } from 'logofx';
import { autoinject } from 'aurelia-framework';

/**
 * DataService
 */
@autoinject
export class DataService implements IDataService {

  public companies: ICompany[] = [];
  public contacts: IContact[] = [];

  // tslint:disable-next-line: no-parameter-properties
  constructor(private companyProvider: CompanyProvider, private contactProvider: ContactProvider) {
  }

  public async createCompany(): Promise<ICompany> {
    // tslint:disable-next-line: completed-docs
    class NewCompany extends Company {
      constructor (id: string) {
        super();

        this.id = id;
        this.makeNew();
      }
    }

    return new Promise<ICompany>(resolve => {
      const company = new NewCompany(Guid.create().toString());
      resolve(company);
    });
  }

  public async getCompany(id: string): Promise<ICompany> {
    return new Promise<ICompany>(async resolve => {
      const companyDtos: ContactDto[] = await this.contactProvider.getAsync(id);
      const company: ICompany = new Company();
      company.id = companyDtos[0].id;
      company.name = companyDtos[0].name;
      company._rev = companyDtos[0]._rev;
      resolve(company);
    });
  }

  public async getCompanies(): Promise<ICompany[]> {
    await this.updateLocalCompanies();
    return new Promise(resolve => {
      resolve(this.companies);
    });
  }

  public async updateCompany(model: ICompany): Promise<ICompany> {
    const dto: CompanyDto = new CompanyDto();
    dto.id = model.id;
    dto.name = model.name;
    if (!model.isNew) {
      dto._rev = model._rev;
      await this.companyProvider.putAsync(dto)
              .then(() => this.updateLocalCompanies())
              .catch(error => {
                throw error;
              });
    } else {
      await this.companyProvider.postAsync(dto)
              .then(() => this.updateLocalCompanies())
              .catch(error => {
                throw error;
              });
    }

    return this.companies.find(c => c.id === model.id);
  }

  public async deleteCompany(model: ICompany): Promise<void> {
      await this.companyProvider
        .deleteAsync(model.id)
        .then(async () => {
          await this.updateLocalCompanies();
        })
        .catch(err => {
            throw err;
        });
  }

  public async createContact(): Promise<IContact> {
    // tslint:disable-next-line: completed-docs
    class NewContact extends Contact {
      constructor (id: string) {
        super();

        this.id = id;
        this.makeNew();
      }
    }

    return new Promise<IContact>(resolve => {
      const contact = new NewContact(Guid.create().toString());
      resolve(contact);
    });
  }

  public async getContact(id: string): Promise<IContact> {
    return new Promise<IContact>(async resolve => {
      const contactDtos: ContactDto[] = await this.contactProvider.getAsync(id);
      const contact: IContact = new Contact();
      contact.id = contactDtos[0].id;
      contact.firstName = contactDtos[0].firstName;
      contact.lastName = contactDtos[0].lastName;
      contact.email = contactDtos[0].email;
      contact._rev = contactDtos[0]._rev;
      resolve(contact);
    });
  }

  public async getContacts(): Promise<IContact[]> {
    await this.updateLocalContacts();
    return new Promise(resolve => {
      resolve(this.contacts);
    });
  }

  public async updateContact(model: IContact): Promise<IContact> {
    const dto: ContactDto = new ContactDto();
    dto.id = model.id;
    dto.firstName = model.firstName;
    dto.lastName = model.lastName;
    dto.email = model.email;
    if (!model.isNew) {
      dto._rev = model._rev;
      await this.contactProvider.putAsync(dto)
              .then(() => this.updateLocalContacts())
              .catch(error => {
                throw error;
              });
    } else {
      await this.contactProvider.postAsync(dto)
              .then(() => this.updateLocalContacts())
              .catch(error => {
                throw error;
              });
    }

    return this.contacts.find(c => c.id === model.id);
  }

  public async deleteContact(model: IContact): Promise<void> {
      await this.contactProvider
        .deleteAsync(model.id)
        .then(async () => {
          await this.updateLocalContacts();
        })
        .catch(err => {
            throw err;
        });
  }

  private async updateLocalContacts(): Promise<void> {
    this.contacts.splice(0, this.contacts.length);

    (await this.contactProvider.getAsync()).forEach(dto => {
      const model: IContact = new Contact();
      model.id = dto.id;
      model.firstName = dto.firstName;
      model.lastName = dto.lastName;
      model.email = dto.email;
      model._rev = dto._rev;
      this.contacts.push(model);
    });

  }

  private async updateLocalCompanies(): Promise<void> {
    this.companies.splice(0, this.companies.length);

    (await this.contactProvider.getAsync()).forEach(dto => {
      const model: ICompany = new Company();
      model.id = dto.id;
      model.name = dto.name;
      model._rev = dto._rev;
      this.companies.push(model);
    });

  }

}
