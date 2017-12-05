const Generator = require('yeoman-generator');
const yosay = require('yosay');
const chalk = require('chalk');

module.exports = class extends Generator {
    constructor(args, opts) {
        super(args, opts);

        let options = {
            modConfigContext: {} // need a common context for generators that need to read/write the mod's info
        };
        this.composeWith('x2mod:emptyMod', options);
        this.composeWith('x2mod:editorTaskConfig', options);
    }

    prompting() {
        this.log(yosay(`${chalk.bold('Hello, commander')}.\n\nWelcome to the community X2 mod generator!`));
    }
}