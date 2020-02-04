import { IViewModelCreatorService } from './../view-model/view-model-creator-service';
import { IObjectViewModel } from 'logofx';
import { DialogController } from 'aurelia-dialog';
/**
 * Represents the Dialog View
 */
export class Dialog {

  private viewModel: IObjectViewModel<any>;

  // tslint:disable-next-line: no-empty
  constructor (dialogController: DialogController) {}

  protected activate(viewModel: IObjectViewModel<any>): void {
    this.viewModel = viewModel;
  }
}
