// tslint:disable: no-floating-promises
// tslint:disable: no-parameter-properties

import { Validator, validateTrigger, ValidationRules, ValidationControllerFactory, ValidationController } from 'aurelia-validation';
import { DialogService } from 'aurelia-dialog';
import { EditableObjectViewModel } from 'logofx';
import { Contact as ContactModel, DataService } from 'model';
import { autoinject, transient, Container } from 'aurelia-framework';
import { MdcValidationRenderer } from 'resources/mdc-components';

/**
 * Represents Contact view model.
 */
@autoinject
@transient(Contact)
export class Contact extends EditableObjectViewModel<ContactModel> {

  constructor(model: ContactModel, private dataService: DataService,  private dialogService: DialogService) {
    super(model);

    this.validationController.addRenderer(new MdcValidationRenderer());
  }

  public get title(): string {
    return this.model.isNew ? "New Contact" : `${this.model.firstName} ${this.model.lastName}`;
  }

  public get canExecuteOk(): boolean {
    return this.validationController.errors.length === 0 && this.model.isDirty;
  }

  public ok(): void {
    this.endEdit();
  }

  public cancel(): void {
    this.model.cancelEdit();
    this.dialogService.controllers[0].cancel();
  }

  protected async save(model: ContactModel): Promise<any> {
    //throw new Error('HUJNYA');

    await this.dataService.updateContact(model);
    //alert('saved! ' + this.model.toString());
  }
  protected async afterSave(model: ContactModel): Promise<any> {
    return this.dialogService.controllers[0].ok(this.model);
  }
  protected async discard(model: ContactModel): Promise<any> {
    throw new Error("Method not implemented.");
  }
  protected async showError(error: any): Promise<any> {
    alert(error.message);
  }
}
