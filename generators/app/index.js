const Generator = require('yeoman-generator');
const WelcomeService = require('../../services/service.welcome');

module.exports = class extends Generator {
    constructor(args, opts) {
        super(args, opts);

        this.option('welcomeMessage', {
            description: 'The message that gets appended to the standard "Welcome to the community yo generator" thing',
            type: String,
            hide: true,
            default: 'Let\'s make a mod!'
        });

        if (!this.options.modConfigContext) {
            this.options.modConfigContext = modConfigContext;
        }

        this.composeWith('x2mod:emptyMod', this.options);
        this.composeWith('x2mod:editorTaskConfig', this.options);
    }

    prompting() {
        let welcomeService = new WelcomeService(this);
        welcomeService.welcome(this.options.welcomeMessage);
    }

    end() {
        this.log('Thanks for using yo x2mod! Go forth and make sweet mods!');
    }
}