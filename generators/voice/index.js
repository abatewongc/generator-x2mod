const Generator = require('yeoman-generator');
const WelcomeService = require('../../services/service.welcome');
require('../../lib/extensions.generator');

module.exports = class extends Generator {
    constructor(args, opts) {
        super(args, opts);
    }

    initializing() {
        this.createModConfigContext();
        this.composeWith('x2mod:emptyMod', this.options);
        this.composeWith('x2mod:editorTaskConfig', this.options);
        this.composeWith('x2mod:voiceCore', this.options);
    }

    prompting() {
        let welcomeService = new WelcomeService(this);
        welcomeService.welcome('Let\'s make a voice pack!');
    }
}