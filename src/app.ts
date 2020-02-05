import { PLATFORM } from 'aurelia-pal';
import { autoinject } from 'aurelia-framework';
import runtime from 'serviceworker-webpack-plugin/lib/runtime';
import * as LogManager from 'aurelia-logging';
import {Router, RouterConfiguration} from 'aurelia-router';
import { HttpResponseMessage } from "aurelia-http-client";

@autoinject()
export class App {
 
  private logger = LogManager.getLogger('au-pwa-demo:app');
  private readonly onOffline: () => void;
  private readonly onOnline: () => void;

  public router: Router;

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

  public async configureRouter(config: RouterConfiguration, router: Router): Promise<void> {
    this.router = router;
    //config.title = "MKT Media Stats - Dashboard";

    //this.showSpiner = true;

    try {
      //await this.dataService.getHeatmapPrismList();
      //await this.dataService.getRiskPrismList();
    } catch (error) {
      if (error instanceof HttpResponseMessage) {
        alert(error.content);
      }
      //this.snackbarService.show(error);
    } finally {
      //this.showSpiner = false;
    }

    //this._prismSettings = { icon: "find_replace", subMenu:  this.prisms, isOpen: false };
    //this._riskPrismSettings = { icon: "find_replace", subMenu:  this.riskPrisms, isOpen: false };

    config.map([
      {
        route: "explore/:id?",
        name: "explore",
        moduleId: PLATFORM.moduleName("explore"),
        settings: { icon: "bubble_chart" }
      },
      {
        route: ["explore/0", "explore/:id?", ""],
        moduleId: PLATFORM.moduleName("explore"),
        nav: true,
        title: "Explore",
        //settings: this._prismSettings
      },
      {
        route: "build",
        name: "Build",
        moduleId: PLATFORM.moduleName("build"),
        nav: true,
        title: "Build",
        settings: { icon: "call_merge" }
      },
      {
        route: "invest",
        name: "Invest",
        moduleId: PLATFORM.moduleName("invest"),
        nav: true,
        title: "invest",
        settings: { icon: "input" }
      },
    ]);
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
