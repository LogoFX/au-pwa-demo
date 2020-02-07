import { Model } from "logofx";
import { IPrismDefinition, IHeatmapDefinition } from "model/contracts";

/**
 * PrismDefinition
 */
export class PrismDefinition extends Model<string> implements IPrismDefinition {
  private _heatmap: IHeatmapDefinition;

  // tslint:disable-next-line: no-parameter-properties
  constructor (id: string, private _name: string) {
    super();
    this.id = id;
  }

  public get name(): string {
    return this._name;
  }

  public get heatmap(): IHeatmapDefinition {
    return this._heatmap;
  }
  public set heatmap(value: IHeatmapDefinition) {
    this._heatmap = value;
  }
}
