import { FrameworkConfiguration, PLATFORM } from 'aurelia-framework';

export * from './contracts';
export * from './implementation';

export function configure(config: FrameworkConfiguration): void {
  config.aurelia.use
    .feature(PLATFORM.moduleName('model/contracts/index'))
    .feature(PLATFORM.moduleName('model/implementation/index'));
}
