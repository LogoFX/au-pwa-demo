import { IContactProvider, ContactDto, DB_CONTACTS } from 'data';
import { Guid } from 'logofx';

// tslint:disable: variable-name
// tslint:disable: no-var-requires
// tslint:disable-next-line: no-require-imports
const PouchDB = require('pouchdb-browser').default;
const ServerAddress = 'https://localhost:5001/Contacts'

/**
 * ContactProvider
 */
export class ContactProvider implements IContactProvider {

  private _db: any;

  constructor () {
    this._db = new PouchDB(DB_CONTACTS);
    this._db.changes({
      since: 'now',
      live: true
    }).on('change', (data: {id: Guid, deleted: boolean | undefined}) => {
      this.sync(data.id, data.deleted);
    });
  }

  private dataToDto(doc: any): ContactDto {
    const contactDto: ContactDto = new ContactDto();
    contactDto.id = doc.id;
    contactDto.firstName = doc.firstName;
    contactDto.lastName = doc.lastName;
    contactDto.email = doc.email;
    contactDto._rev = doc._rev;
    contactDto.sync = doc.sync;
    contactDto.isNew = doc.isNew;    
    return contactDto;
  }

  private dtoToData(dto: ContactDto, update: boolean): any {
    return update?
      {
        _id: dto.id,
        _rev: dto._rev,
        id: dto.id,
        firstName: dto.firstName,
        lastName: dto.lastName,
        email: dto.email,
        sync: dto.sync,
        isNew: false
      } :
      {
        _id: dto.id,
        id: dto.id,
        firstName: dto.firstName,
        lastName: dto.lastName,
        email: dto.email,
        sync: dto.sync,
        isNew: true
      };
  }

  private async syncContact(contact: ContactDto): Promise<void> {
    var response: Response;
    const bodyJson = JSON.stringify(contact);

    if (contact.isNew) {
      response = await fetch(ServerAddress, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: bodyJson
      });
    } else {

    }
  }

  private async sync(id: Guid, deleted: boolean | undefined): Promise<void> {
    if (!navigator.onLine) {
      return;
    }

    const contacts = await this.getFromDatabase();
    contacts.forEach(contact => {
      if (!contact.sync) {
        this.syncContact(contact);
        contact.sync = true;
        this.putAsync(contact);
      }
    });
  }

private async getFromDatabase(id?: string) : Promise<ContactDto[]> {
  const contacts: ContactDto[] = [];

  const db = this._db;

  if (id) {
    await db.get(id)
    .then((doc: any) => {
      contacts.push(this.dataToDto(doc));
    });
  } else {
      await db.allDocs({
                      include_docs: true,
                      attachments: true})
              .then((result: { rows: any[] }) => {

                result.rows.forEach(row => {
                  contacts.push(this.dataToDto(row.doc));
                });
              })
              .catch(error => {
                throw error;
              });
  }

  return contacts;
}

public async getAsync(id?: string): Promise<ContactDto[]> {
    const contacts = this.getFromDatabase(id);
    return contacts;
  }

  public async postAsync(contactDto: ContactDto): Promise<void> {
    const db = this._db;
    await db
    .put(this.dtoToData(contactDto, false))
    .catch (error => {
      throw error;
    });
  }

  public async putAsync(contactDto: ContactDto): Promise<void> {
    const db = this._db;

    await db.get(contactDto.id).then(doc => {
      db.put(this.dtoToData(contactDto, true));
    })
    .catch(error => {
      throw error;
    });
  }

  public async deleteAsync(id : string): Promise<void> {
    const db = this._db;
    await db.get(id).then(doc => {
      db.remove(doc);
    });
  }
}
