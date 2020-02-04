import { Container } from 'aurelia-framework';

export interface IViewModelCreatorService {
  // tslint:disable-next-line: typedef
  create<T>(type);
}

/**
 * The default implementation
 */
export class ViewModelCreatorService implements IViewModelCreatorService {
    public create<T>(type: any, ...rest: any[]): T {
        const instance: T = <T>Container.instance.get(type);

        if (rest.length > 0) {
          instance["model"] = rest[0];
          if (rest.length > 1) {
            instance["navigationService"] = rest[1];
          }
        }
        // console.log(rest);
        return instance;
    }
}
