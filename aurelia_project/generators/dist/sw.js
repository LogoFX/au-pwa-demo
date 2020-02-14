"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
var aurelia_dependency_injection_1 = require("aurelia-dependency-injection");
var aurelia_cli_1 = require("aurelia-cli");
var Mustache = require("mustache");
var fs = require('fs');
var SwGenerator = /** @class */ (function () {
    function SwGenerator(project, options, ui) {
        this.project = project;
        this.options = options;
        this.ui = ui;
        this._data = {
            staticCachePrefix: ''
        };
    }
    SwGenerator.prototype.execute = function () {
        var _this = this;
        return this.ui
            .ensureAnswer(this.options.args[0], 'What would you like to call\n the static cache prefix?')
            .then(function (staticCachePrefix) {
            _this._data.staticCachePrefix = staticCachePrefix;
            _this.project.root.add(aurelia_cli_1.ProjectItem.text("__sw.js", _this.generateSource(staticCachePrefix)));
            return _this.project.commitChanges()
                .then(function () { return _this.ui.log("Created __sw.js."); });
        });
    };
    SwGenerator.prototype.generateSource = function (data) {
        var template = fs.readFileSync('./sw.js.mustache');
        return Mustache.render(template, data);
    };
    SwGenerator = __decorate([
        aurelia_dependency_injection_1.inject(aurelia_cli_1.Project, aurelia_cli_1.CLIOptions, aurelia_cli_1.UI)
    ], SwGenerator);
    return SwGenerator;
}());
exports["default"] = SwGenerator;
