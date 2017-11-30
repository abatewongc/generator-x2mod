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

        if (!this.options.modName) {
            this.env.error('That name doesn\'t look right. Mod names should start with a letter and contain nothing but letters, numbers, and underscores.');
        }

        const prompts = [{
            type: 'list',
            name: 'editorConfig',
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
            this.log('editor', answers.editorConfig);
            this.editorConfig = answers.editorConfig;
        });
    }

    writing() {
        if (this.editorConfig) {
            this._copyConfigTemplate('XComEditor.ini');
            this._copyConfigTemplate('XComEngine.ini');
            this._copyConfigTemplate('XComGame.ini');
            this._copyScriptTemplate('X2DownloadableContentInfo.uc');
        }
    }

    _copyConfigTemplate(configFileName) {
        let modName = this.options.modName;
        this.fs.copyTpl(
            this.templatePath(`src/MODNAME/config/${configFileName}`),
            this.destinationPath(`src/${modName}/Config/${configFileName}`),
            { modName: modName }
        );
    }

    _copyScriptTemplate(templateFileName) {
        let modName = this.options.modName;
        this.fs.copyTpl(
            this.templatePath(`src/MODNAME/Src/MODNAME/Classes/${templateFileName}`),
            this.destinationPath(`src/${modName}/Src/${modName}/Classes/X2DownloadableContentInfo_${modName}.uc`),
            { modName: modName }
        );
    }
};