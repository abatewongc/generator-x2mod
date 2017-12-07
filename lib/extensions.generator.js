const Generator = require('yeoman-generator');

Generator.prototype.createModConfigContext = function () {
    if (!this.options.modConfigContext) {
        this.options.modConfigContext = {};
    }

    return this.options.modConfigContext;
}