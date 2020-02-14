import { IContactProvider, ContactDto, DB_NAME } from 'data';

// tslint:disable: variable-name
// tslint:disable: no-var-requires
// tslint:disable-next-line: no-require-imports
const PouchDB = require('pouchdb-browser').default;

/**
 * ContactProvider
 */
export class ContactProvider implements IContactProvider {

public async getAsync(id?: string): Promise<ContactDto[]> {

    const contacts: ContactDto[] = [];

    const db = new PouchDB(DB_NAME);

    if (id) {
      await db.get(id)
      .then((doc: any) => {
        const contactDto: ContactDto = new ContactDto();
        contactDto.id = doc.id;
        contactDto.firstName = doc.firstName;
        contactDto.lastName = doc.lastName;
        contactDto.email = doc.email;
        contactDto._rev = doc._rev;
        contacts.push(contactDto);
      });
    } else {
        await db.allDocs({
                        include_docs: true,
                        attachments: true})
                .then((result: { rows: any[] }) => {

                  result.rows.forEach(row => {
                    const contactDto: ContactDto = new ContactDto();
                    contactDto.id = row.doc.id;
                    contactDto.firstName = row.doc.firstName;
                    contactDto.lastName = row.doc.lastName;
                    contactDto.email = row.doc.email;
                    contactDto._rev = row.doc._rev;
                    contacts.push(contactDto);
                  });
                })
                .catch(error => {
                  throw error;
                });
    }

    return contacts;
  }

  public async postAsync(contactDto: ContactDto): Promise<void> {
    const db = new PouchDB(DB_NAME);
    await db.put({
      _id: contactDto.id,
      id: contactDto.id,
      firstName: contactDto.firstName,
      lastName: contactDto.lastName,
      email: contactDto.email
    })
    .catch (error => {
      throw error;
    });
  }

  public async putAsync(contactDto: ContactDto): Promise<void> {
    const db = new PouchDB(DB_NAME);

    await db.get(contactDto.id).then(doc => {
      db.put({
        _id: contactDto.id,
        _rev: contactDto._rev,
        id: contactDto.id,
        firstName: contactDto.firstName,
        lastName: contactDto.lastName,
        email: contactDto.email
      });
    })
    .catch(error => {
      throw error;
    });
  }

  public async deleteAsync(id : string): Promise<void> {
    const db = new PouchDB(DB_NAME);
    await db.get(id).then(doc => {
      db.remove(doc);
    });
  }
}
