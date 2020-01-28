import runtime from 'serviceworker-webpack-plugin/lib/runtime';
import * as LogManager from 'aurelia-logging';

export class App {
  private logger = LogManager.getLogger('au-pwa-demo:app');

  public message: string = 'Hello World!';

  public attached() {
    this.setUpServiceWorker();
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
