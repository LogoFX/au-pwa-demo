// tslint:disable: member-ordering
import { IEditableModel } from 'logofx/model';
import { ObjectViewModel } from './object-view-model';

/**
 * EditableObjectViewModel
 */
export abstract class EditableObjectViewModel<T extends IEditableModel<any>> extends ObjectViewModel<T> {

    // tslint:disable: no-parameter-properties
    constructor(model: T) {
      super(model);
    }

    public canCancelChanges: boolean;

    public beginEdit(): void {
      this.model.beginEdit();
    }

    public cancelEdit(): void {
        //this.copyModel(this.originalModel);
        //this.discard(this.model);
    }

    public endEdit(): void {
      this.validationController.validate().then(async validation => {
        if (!validation.valid) {
          throw new Error(validation.results.toString());
        } else {
          await this.save(this.model)
          .then(() => {
            this.model.commitEdit();
          })
          .then(async () => this.afterSave(this.model));
        }
      }).catch(async error => {
        await this.showError(error);
      });
    }

    protected async abstract save(model: T): Promise<any>;

    protected async abstract afterSave(model: T): Promise<any>;

    protected async abstract discard(model: T): Promise<any>;

    protected async abstract showError(error: any): Promise<any>;
}
