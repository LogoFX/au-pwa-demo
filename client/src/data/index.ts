import { FrameworkConfiguration } from 'aurelia-framework';
import { PLATFORM } from 'aurelia-pal';

export * from './dto';
export * from './providers';

export function configure(config: FrameworkConfiguration): void {
  config.aurelia.use
    .feature(PLATFORM.moduleName('data/dto/index'))
    .feature(PLATFORM.moduleName('data/providers/index'));
}
