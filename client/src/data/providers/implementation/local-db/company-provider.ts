import { CompanyDto, DB_COMPANIES } from "data";
import { ICompanyProvider } from "data/providers/contracts";

// tslint:disable: variable-name
// tslint:disable: no-var-requires
// tslint:disable-next-line: no-require-imports
const PouchDB = require('pouchdb-browser').default;

/**
 * CompanyProvider
 */
export class CompanyProvider implements ICompanyProvider {

  public async getAsync(id: string): Promise<CompanyDto[]> {
    const companies: CompanyDto[] = [];

    const db = new PouchDB(DB_COMPANIES);

    if (id) {
      await db.get(id)
        .then((doc: any) => {
          const companyDto: CompanyDto = new CompanyDto();
          companyDto.id = doc.id;
          companyDto.name = doc.name;
          companyDto._rev = doc._rev;
          companies.push(companyDto);
        });
      } else {
      await db.allDocs({
                      include_docs: true,
                      attachments: true})
              .then((result: { rows: any[] }) => {
                result.rows.forEach(row => {
                  const companyDto: CompanyDto = new CompanyDto();
                  companyDto.id = row.doc.id;
                  companyDto.name = row.doc.name;
                  companyDto._rev = row.doc._rev;
                  companies.push(companyDto);
                });
              })
              .catch(alert);
    }

    return companies;
  }

  public async postAsync(companyDto: CompanyDto): Promise<void> {
    const db = new PouchDB(DB_COMPANIES);
    await db.put({
      _id: companyDto.id,
      id: companyDto.id,
      name: companyDto.name,
    })
    .catch (error => {
      throw error;
    });
  }

  public async putAsync(companyDto: CompanyDto): Promise<void> {
    const db = new PouchDB(DB_COMPANIES);

    await db.get(companyDto.id).then(doc => {
      db.put({
        _id: companyDto.id,
        _rev: companyDto._rev,
        id: companyDto.id,
        name: companyDto.name
      });
    })
    .catch(error => {
      throw error;
    });
  }

  public async deleteAsync(id : string): Promise<void> {
    const db = new PouchDB(DB_COMPANIES);
    await db.get(id).then(doc => {
      db.remove(doc);
    });
  }

}
