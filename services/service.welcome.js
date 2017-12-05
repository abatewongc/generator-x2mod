const yosay = require('yosay');
const chalk = require('chalk');

module.exports = class {
    constructor(logHost) {
        this.logHost = logHost;
    }
    welcome(message) {
        this.logHost.log(yosay(`${chalk.bold('Hello, commander')}.\n\nWelcome to the community X2 mod generator!\n\n${message}`));
    }
}