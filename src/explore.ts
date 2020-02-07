import { transient } from 'aurelia-framework';
import { autoinject } from 'aurelia-framework';
import { DataService, IPrismDefinition } from 'model';
import { RouteConfig } from 'aurelia-router';

@autoinject
@transient(Explore)
export class Explore {

  _prismList: IPrismDefinition[];

  constructor (private _dataService: DataService) {
    
  }

  public activate(params: {id: string}, routeConfig: RouteConfig): void {
    this.startReceivePrismList();
  }

  private async startReceivePrismList(): Promise<void> {
    await this._dataService.getHeatmapPrismList();
    this._prismList = this._dataService.heatmapPrismList;
  }
}
