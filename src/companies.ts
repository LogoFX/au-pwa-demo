import { ViewModelCreatorService } from 'logofx';
import { DataService } from 'model';
import { transient, autoinject } from 'aurelia-framework';

/**
 * Class Companies
 */
@autoinject()
@transient(Companies)
export class Companies  {

  // tslint:disable: no-parameter-properties
  constructor(private dataService: DataService,
              private viewModelCreatorService: ViewModelCreatorService) {}

  public async createNewCompany(): Promise<any> {
    throw new Error('Not implemented.');
  }
}
