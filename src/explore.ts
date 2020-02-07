import { transient } from 'aurelia-framework';
import { autoinject } from 'aurelia-framework';
import { DataService } from 'model';

@autoinject
@transient(Explore)
export class Explore {
  constructor (private _dataService: DataService) {
    
  }
}
