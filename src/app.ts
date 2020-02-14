import { MDCTopAppBar } from '@material/top-app-bar';
import { RouterConfiguration, Router } from 'aurelia-router';
import { PLATFORM, autoinject } from 'aurelia-framework';
import { MDCDrawer } from '@material/drawer';
import { I18N } from 'aurelia-i18n';

// tslint:disable-next-line: completed-docs
@autoinject
export class App {
  public message: string = 'Hello Fucking World!';

  public router: Router;

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

    this.initMDC();

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
