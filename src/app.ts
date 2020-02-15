import { MDCTopAppBar } from '@material/top-app-bar';
import { RouterConfiguration, Router } from 'aurelia-router';
import { PLATFORM, autoinject } from 'aurelia-framework';
import { MDCDrawer } from '@material/drawer';
import { I18N } from 'aurelia-i18n';
import runtime from 'serviceworker-webpack-plugin/lib/runtime';
import * as LogManager from 'aurelia-logging';

// tslint:disable-next-line: completed-docs
@autoinject
export class App {
  public message: string = 'Hello Fucking World!';
  private logger = LogManager.getLogger('au-pwa-demo:app');
  public router: Router;

  private readonly onOffline: () => void;
  private readonly onOnline: () => void;
  public isOnline: boolean;

  // tslint:disable-next-line: no-parameter-properties
  constructor(private i18n: I18N) {  }

  public configureRouter(config: RouterConfiguration, router: Router): void {

    this.router = router;
    config.title = 'Aurelia MDC Demo';

    config.map([
      { route: ['', 'contacts'], name: 'contacts', moduleId: PLATFORM.moduleName('contacts'), nav: true, title: 'The Contacts', settings: { icon: 'people' } },
      { route: 'login', name: 'login', moduleId: PLATFORM.moduleName('login'), nav: true, title: 'Login', settings: { icon: 'lock' } }
    ]);
  }

  public attached(): void {
    console.log('App - attached');
    this.setUpOfflineNotification();
    this.setUpServiceWorker();

    this.initMDC();
  }

  public detached() {
    this.removeOfflineNotification();
  } 

  private removeOfflineNotification() {
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

  private initMDC(): void {
    const drawer = MDCDrawer.attachTo(document.querySelector('.mdc-drawer'));

    const topAppBar = MDCTopAppBar.attachTo(document.getElementById('app-bar'));
    topAppBar.setScrollTarget(document.getElementById('main-content'));
    topAppBar.listen('MDCTopAppBar:nav', () => {
      drawer.open = !drawer.open;
    });
  }
}
