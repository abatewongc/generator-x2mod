const Generator = require('yeoman-generator');
const yosay = require('yosay');
const chalk = require('chalk');
const WelcomeService = require('../../services/service.welcome');

module.exports = class extends Generator {
    constructor(args, opts) {
        super(args, opts);

        this.composeWith('x2mod:app', { welcomeMessage: 'Let\'s make a class mod!' });
    }

    prompting() {
        return this.prompt({
            type: 'input',
            name: 'classFriendlyName',
            message: 'What\'s your class called?',
            default: 'Shooter Boom Guy'
        }).then(answer => {
            this.log(answer);
        });
    }

}