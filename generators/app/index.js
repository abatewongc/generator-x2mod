const Generator = require('yeoman-generator');
const WelcomeService = require('../../services/service.welcome');

module.exports = class extends Generator {
    constructor(args, opts) {
        super(args, opts);
    }

    initializing() {
        this.composeWith('x2mod:emptyMod', this.options);
        this.composeWith('x2mod:editorTaskConfig', this.options);
    }

    prompting() {
        let welcomeService = new WelcomeService(this);
        welcomeService.welcome('Let\'s make a mod!');
    }

    end() {
        this.log('Thanks for using yo x2mod! Go forth and make sweet mods!');
    }
}