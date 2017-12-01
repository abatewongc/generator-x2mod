var Generator = require('yeoman-generator');
var yosay = require('yosay');

module.exports = class extends Generator {
    constructor(args, opts) {
        // Calling the super constructor is important so our generator is correctly set up
        super(args, opts);

        this.option('modName', {
            desc: 'The safe name of your mod - letters, numbers, and underscores only, please!',
            type: this._isLegalModName,
            required: true,
            alias: 'name'
        });

        this.option('welcome', {
            desc: 'Skips the welcome message',
            type: Boolean,
            default: true
        });
    }

    _isLegalModName(input) {
        if (/^[a-zA-Z][\w+]*$/i.test(input)) {
            return input;
        }

        return false;
    }

    prompting() {
        if (this.options.welcome) {
            this.log(yosay('Hello, commander. Welcome to the community X2 mod generator!'))
        }

        const prompts = [{
            type: 'input',
            name: 'name',
            message: 'What\'s your mod\'s "safe" name? (should start with a letter and have only letters, numbers, and underscores)',
            default: 'MyCoolMod',
            when: (things) => !this.options.modName
        }, {
            type: 'list',
            name: 'editor',
            message: 'Do you want us to configure tasks for a specific text editor?',
            choices: [{
                name: 'Nah, I\'m good',
                value: false
            }, {
                name: 'Visual Studio Code',
                value: 'vscode'
            }, {
                name: 'Atom',
                value: 'atom'
            }]
        }];

        return this.prompt(prompts).then(answers => {
            this.modConfig = answers;
            this.modConfig.name = this.options.modName || this.modConfig.name;
        });
    }

    writing() {
        if (this.modConfig.editor) {
            this.fs.copy(
                this.templatePath('scripts'),
                this.destinationPath('scripts')
            );

            // TODO: some kind of injectable service?
            if (this.modConfig.editor === 'vscode') {
                this.fs.copyTpl(
                    this.templatePath('.vscode/tasks.json'),
                    this.destinationPath('.vscode/tasks.json'),
                    { modName: this.modConfig.name }
                );
            }
        }

        this._copyConfigTemplate('XComEditor.ini');
        this._copyConfigTemplate('XComEngine.ini');
        this._copyConfigTemplate('XComGame.ini');
        this._copyScriptTemplate('X2DownloadableContentInfo.uc');
    }

    _copyConfigTemplate(configFileName) {
        let modName = this.modConfig.name;
        this.fs.copyTpl(
            this.templatePath(`src/MODNAME/config/${configFileName}`),
            this.destinationPath(`src/${modName}/Config/${configFileName}`),
            { modName: modName }
        );
    }

    _copyScriptTemplate(templateFileName) {
        let modName = this.modConfig.name;
        this.fs.copyTpl(
            this.templatePath(`src/MODNAME/Src/MODNAME/Classes/${templateFileName}`),
            this.destinationPath(`src/${modName}/Src/${modName}/Classes/X2DownloadableContentInfo_${modName}.uc`),
            { modName: modName }
        );
    }
};