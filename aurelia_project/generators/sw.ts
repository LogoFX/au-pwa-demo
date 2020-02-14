import {inject} from 'aurelia-dependency-injection';
import {Project, ProjectItem, CLIOptions, UI} from 'aurelia-cli';
import * as Mustache from 'mustache';
var fs = require('fs');


@inject(Project, CLIOptions, UI)
export default class SwGenerator {
  
  private _data = {
    staticCachePrefix: ''
  };

  constructor(private project: Project, 
              private options: CLIOptions, 
              private ui: UI) { }

  execute() {
    return this.ui
      .ensureAnswer(this.options.args[0], 'What would you like to call\n the static cache prefix?')
      .then(staticCachePrefix => {
        
        this._data.staticCachePrefix = staticCachePrefix;

        this.project.root.add(
          ProjectItem.text(`__sw.js`, this.generateSource(staticCachePrefix))
        );

        return this.project.commitChanges()
          .then(() => this.ui.log(`Created __sw.js.`));
      });
  }

  generateSource(data: any) {
    let template = fs.readFileSync('./sw.js.mustache');
    return Mustache.render(template, data);
  }
}
