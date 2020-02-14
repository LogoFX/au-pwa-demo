import { WrappingCollection, ViewModelCreatorService, WindowManager } from 'logofx';
import { Contact as ContactViewModel } from './contact';
import { Contact, DataService } from 'model';
import { autoinject, transient, View } from "aurelia-framework";
import { MDCCheckbox } from '@material/checkbox';
import { MDCDrawer } from "@material/drawer";

/**
 * Contacts view model.
 */
@autoinject
@transient(Contacts)
export class Contacts {

  private _wcContacts: WrappingCollection;
  private _drawer: MDCDrawer;
  private site: any;

  // tslint:disable: no-parameter-properties
  constructor(private dataService: DataService,
              private windowManager: WindowManager,
              private viewModelCreatorService: ViewModelCreatorService) {  }

  public created(owningView: View, myView: View): void {
    this.dataService.getContacts()
      .then(contacts => {
      this._wcContacts = new WrappingCollection(
        item => this.viewModelCreatorService.create<ContactViewModel>(ContactViewModel, item),
        this.dataService.contacts);
      })
      .catch(alert);
  }

  public attached(): void {
    this._drawer = MDCDrawer.attachTo(document.querySelector('#right-drawer'));
  }

  public get contacts(): WrappingCollection {
    if (this._wcContacts !== undefined) {
      return this._wcContacts.sort((leftSide: ContactViewModel, rightSide: ContactViewModel): number => {
                if (leftSide.model.firstName > rightSide.model.firstName) return 1;
                if (leftSide.model.firstName < rightSide.model.firstName) return -1;
                return 0;
              });
    }

    return this._wcContacts;
  }

  public openRightSideDrawer(id?: string): void {
    this.site = this.contacts.find((c: ContactViewModel) => c.model.id === id);
    this._drawer.open = true;
  }

  public async editContact(id?: string): Promise<any> {

    const contact = await this.dataService.getContact(id);

    const contactViewModel = this.viewModelCreatorService.create<ContactViewModel>(ContactViewModel, contact);
    contactViewModel.beginEdit();
    await this.windowManager.show(contactViewModel)
    // .then(a => {
    //   // Do something, if need
    // })
    .catch(alert)
    .finally(() => {
      // Do it anyway!;
    });
  }

  public async deleteContact(id?: string): Promise<any> {
    const contact = this.contacts.find((c: ContactViewModel) => c.model.id === id).model;

    await this.dataService.deleteContact(contact);
  }

  public get canSelectAll(): boolean {
    return this.contacts.canSelectAll();
  }

  public selectAll(): void {
    this.contacts.selectAll();
  }

  public get selectionState(): any {
    if (this.contacts === undefined)
      return false;
    const checkbox = new MDCCheckbox(document.querySelector('#selectionStateCheckbox'));

    if ((this.contacts.length > this.contacts.getSelectedItems().length)
          && (this.contacts.getSelectedItems().length > 0)) {
            checkbox.indeterminate = true;
            return undefined;
          }
    if (this.contacts.length === this.contacts.getSelectedItems().length) {
      checkbox.indeterminate = false;
      return true;
    }

    if (this.contacts.getSelectedItems().length === 0) {
      checkbox.indeterminate = false;
      return false;
    }
  }

  public set selectionState (value: any) {
    if (value) {
      this.contacts.selectAll();
    } else {
      this.contacts.unselectAll();
    }
  }
  /**
   * Opens the dialog for editing new contact item.
   */
  public async createNewContact(): Promise<any> {

    const contact: Contact = await this.dataService.createContact() as Contact;
    const contactViewModel = this.viewModelCreatorService.create<ContactViewModel>(ContactViewModel, contact);
    contactViewModel.beginEdit();

    await this.windowManager.show(contactViewModel)
                            .then(a => {
                              // Do something miningfull here
                              //alert(`Was Cancelled? The answer is ${a.wasCancelled}`);
                            })
                            .catch(err => {
                              //alert(err);
                            })
                            .finally(() => {
                              // alert('Do it anyway!');
                            });
  }
}
