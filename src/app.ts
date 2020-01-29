import {
  MiddlewarePlacement,
  Store,
  dispatchify,
  localStorageMiddleware,
} from 'aurelia-store';
import runtime from 'serviceworker-webpack-plugin/lib/runtime';
import * as LogManager from 'aurelia-logging';
import {State} from './store/state';
import { isOffline, isOnline } from 'store/actions';

export class App {
  private logger = LogManager.getLogger('au-pwa-demo:app');
  private readonly onOffline: () => void;
  private readonly onOnline: () => void;

  public message: string = 'Hello World!';

  constructor (private store: Store<State>) {
    this.onOffline = () => this.store.dispatch(isOffline.name);
    this.onOnline = () => this.store.dispatch(isOnline.name);
  }
 
  public attached() {
    this.setUpOfflineNotification();
    this.setUpServiceWorker();
  }

  public detached() {
    window.removeEventListener('offline', this.onOffline);
    window.removeEventListener('online', this.onOnline);
  }  

  private setUpOfflineNotification() {
    if (!navigator.onLine) {
        this.store.dispatch(isOffline.name);
    } else {
        this.store.dispatch(isOnline.name);
    }

    window.addEventListener('offline', this.onOffline);
    window.addEventListener('online', this.onOnline);
  }

  private setUpServiceWorker() {
    if ('serviceWorker' in navigator) {
        runtime.register()
            .then((registration) => this.logger.info('Service worker is registered', registration))
            .catch((registrationError) => this.logger.error(
                'Service worker failed to register', registrationError,
            ));
    } else {
        this.logger.info('Service worker is not available in this browser.');
    }
  }  
}
