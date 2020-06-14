import { PLATFORM } from 'aurelia-pal';
import { FrameworkConfiguration } from 'aurelia-framework';

export * from './mdc-validation-renderer';

export function configure(config: FrameworkConfiguration): void {
    config.globalResources([PLATFORM.moduleName('./mdc-hook'), PLATFORM.moduleName('./mdc-validation-renderer')]);
  }
