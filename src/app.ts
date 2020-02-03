import { autoinject } from 'aurelia-framework';
import runtime from 'serviceworker-webpack-plugin/lib/runtime';
import * as LogManager from 'aurelia-logging';

@autoinject()
export class App {
  private logger = LogManager.getLogger('au-pwa-demo:app');
  private readonly onOffline: () => void;
  private readonly onOnline: () => void;

  public message: string = 'Hello World!';

  public isOnline: boolean;

  constructor () {

    this.onOffline = () => {
      this.isOnline = false;
    };

    this.onOnline = () => {
      this.isOnline = true;
    }
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
    this.isOnline = navigator.onLine;

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
