import { Aurelia, Controller } from 'aurelia-framework';
import { Backend, TCustomAttribute } from 'aurelia-i18n';
import { PLATFORM } from 'aurelia-pal';
import { MDCHook } from 'resources/mdc-components/mdc-hook';
import environment from './environment';
//import { resBundle } from 'i18next-resource-store-loader!./assets/i18n/index';

const hook: MDCHook = new MDCHook();

// tslint:disable: no-invalid-this
Controller.prototype.attached = function(): void {
      console.log('before attached');
      if (this.isAttached) {
        return;
      }

      this.isAttached = true;

      if (this.behavior.handlesAttached) {
        this.viewModel.attached();
      }

      if (this.view !== null) {
        this.view.attached();
        hook.beforeBind(this.view);
      }
      console.log('after attached');
    };
    // tslint:enable: no-invalid-this

export function configure(aurelia: Aurelia): void {
  aurelia.use
    .standardConfiguration()
    .plugin(PLATFORM.moduleName('aurelia-validation'))
    .plugin(PLATFORM.moduleName('aurelia-dialog'), (configuration) => {
      // use only attach-focus
      configuration.useResource('attach-focus');
      configuration.useDefaults();
      configuration.settings.lock = true;
      configuration.settings.centerHorizontalOnly = false;
      configuration.settings.startingZIndex = 10;
      configuration.settings.keyboard = true;
    })
    // .plugin(PLATFORM.moduleName('resources/aurelia-router-metadata'), (settings: RouterMetadataSettings) => {
    //   settings.routerConfiguration.title = "Foo";
    //   settings.enableStaticAnalysis = true;
    //   settings.enableEagerLoading = true;
    // })
    .feature(PLATFORM.moduleName('logofx/index'))
    .feature(PLATFORM.moduleName('model/index'))
    .feature(PLATFORM.moduleName('data/index'))
    .feature(PLATFORM.moduleName('resources/index'));

  aurelia.use.plugin(PLATFORM.moduleName('aurelia-i18n'), (instance) => {
      const aliases = ['t', 'i18n'];
      TCustomAttribute.configureAliases(aliases);
      instance.i18next.use(Backend.with(aurelia.loader));
      // adapt options to your needs (see http://i18next.com/docs/options/)
      // make sure to return the promise of the setup method, in order to guarantee proper loading
      return instance.setup({
        backend: {                                  // <-- configure backend settings
          loadPath: 'locales/{{lng}}/{{ns}}.json', // <-- XHR settings for where to get the files from
        },
        attributes: aliases,
        parseMissingKeyHandler : (key: string): string => `The key \"${key}\" is missing.`,
        lng : 'ru',
        fallbackLng : 'en',
        load : "currentOnly",
        debug : true
      });
   });

  aurelia.use.developmentLogging(environment.debug ? 'debug' : 'warn');

  if (environment.testing) {
    aurelia.use.plugin(PLATFORM.moduleName('aurelia-testing'));
  }

  // tslint:disable-next-line: no-floating-promises
  aurelia.start().then(() => aurelia.setRoot(PLATFORM.moduleName('app')));
}
