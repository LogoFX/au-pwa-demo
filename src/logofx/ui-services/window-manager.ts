import { DialogService, DialogCloseResult, DialogOpenPromise } from 'aurelia-dialog';
import { IObjectViewModel } from 'logofx';
import { Dialog } from './dialog';
import { autoinject } from 'aurelia-framework';

export interface IWindowManager {
  show(viewModel: IObjectViewModel<any>): void;
}

/**
 * Represents default Window Manager.
 */
@autoinject
export class WindowManager implements IWindowManager {

  // tslint:disable: no-parameter-properties
  constructor(private dialogService: DialogService) {}

  public async show(viewModel: IObjectViewModel<any>): Promise<DialogCloseResult> {
    // tslint:disable: no-floating-promises

    return new Promise(resolve => {
        this.dialogService.open({
                viewModel: Dialog,
                model: viewModel
              }).whenClosed(response => {
                resolve(response);
            });
    });
  }
}
