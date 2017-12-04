const Generator = require('yeoman-generator');
const yosay = require('yosay');
const chalk = require('chalk');

module.exports = class extends Generator {
    constructor(args, opts) {
        super(args, opts);

        let modConfigContext = {};
        this.composeWith('x2mod:emptyMod', { modConfigContext: modConfigContext });
        this.composeWith('x2mod:editorTaskConfig', { modConfigContext: modConfigContext });
    }

    prompting() {
        this.log(yosay(`${chalk.bold('Hello, commander')}.\n\nWelcome to the community X2 mod generator!`));
    }
}