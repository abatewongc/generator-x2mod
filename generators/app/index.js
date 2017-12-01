var Generator = require('yeoman-generator');
var yosay = require('yosay');
const chalk = require('chalk');
const ModNameRegex = /^[A-Z][\w+]*$/i;

module.exports = class extends Generator {
    constructor(args, opts) {
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
        if (ModNameRegex.test(input)) {
            return input;
        }

        return false;
    }

    prompting() {
        if (this.options.welcome) {
            this.log(yosay(`${chalk.bold('Hello, commander')}.\n\nWelcome to the community X2 mod generator!`))
        }

        // init
        this.modConfig = {};

        let namePrompt = {
            type: 'input',
            name: 'friendlyName',
            message: 'What\'s your mod\'s friendly name? (This is what players will see on Steam.)',
            default: this.options.modName
        };

        return this.prompt(namePrompt).then(answer => {
            this.modConfig.friendlyName = answer.friendlyName;
            this.modConfig.name = this.modConfig.name || this._createLegalModName(this.modConfig.friendlyName);

            const prompts = [{
                type: 'input',
                name: 'description',
                message: 'Enter a description for your mod. (This is for Steam, too. You can leave it blank if you want.)'
            }, {
                type: 'confirm',
                name: 'requireWotC',
                message: 'Will your mod require the War of the Chosen expansion?',
                default: true
            },
            {
                type: 'input',
                name: 'name',
                message: 'What\'s your mod\'s "safe" name? (should start with a capital letter and have only letters, numbers, and underscores)',
                default: this.modConfig.name,
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
                this.modConfig.name = this.options.modName || this.modConfig.name;
                this.modConfig.description = answers.description;
                this.modConfig.requireWotC = answers.requireWotC;
                this.modConfig.editor = answers.editor;
            });
        });
    }

    _createLegalModName(friendlyName) {
        let result = friendlyName.replace(/[^a-zA-Z0-9_]/ig, '');

        if (!this._isLegalModName(result)) {
            return 'MySweetMod';
        }

        return result;
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
                    this.templatePath('editorConfig/.vscode/tasks.json'),
                    this.destinationPath('.vscode/tasks.json'),
                    { modName: this.modConfig.name }
                );
            }
            else if (this.modConfig.editor === 'atom') {
                this.fs.copyTpl(
                    this.templatePath('editorConfig/.atom-build.yml'),
                    this.destinationPath('.atom-build.yml'),
                    { modName: this.modConfig.name }
                )
            }
        }

        this._copyConfigTemplate('XComEditor.ini');
        this._copyConfigTemplate('XComEngine.ini');
        this._copyConfigTemplate('XComGame.ini');
        this._copyScriptTemplate('X2DownloadableContentInfo.uc');
        this._createModMetadata(this.modConfig.friendlyName, this.modConfig.description, this.modConfig.requireWotC);
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

    _createModMetadata(title, description, requireWotC) {
        this.fs.copyTpl(
            this.templatePath('Mod.XComMod'),
            this.destinationPath(`${this.modConfig.name}.XComMod`),
            {
                modTitle: title,
                modDescription: description,
                requireWotC: requireWotC
            }
        )
    }
};