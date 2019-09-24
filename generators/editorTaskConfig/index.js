const Generator = require('yeoman-generator');
const DefaultInstallationPathSniffer = require('../../services/service.defaultInstallationPathSniffer');
const ModConfigService = require('../../services/service.modConfig.js');
require('../../lib/extensions.generator');

module.exports = class extends Generator {
    constructor(args, opts) {
        super(args, opts);

        this.installationPathSniffer = new DefaultInstallationPathSniffer();
        this.modConfigService = new ModConfigService(this.createModConfigContext());
    }

    prompting() {
        let defaultInstallationPaths = this.installationPathSniffer.getDefaultInstallationPaths();

        const prompts = [{
            type: 'list',
            name: 'editor',
            message: 'Do you want to configure tasks for a specific text editor?',
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
        }, {
            type: 'input',
            name: 'gamePath',
            message: 'Where\'s XCOM 2 installed (ending in "\\XCOM 2")?',
            default: defaultInstallationPaths.gamePath,
            when: (answers) => answers.editor
        }, {
            type: 'input',
            name: 'sdkPath',
            message: 'Where\'s the SDK installed (ending in "\\XCOM 2 War of the Chosen SDK")?',
            default: defaultInstallationPaths.sdkPath,
            when: (answers) => answers.editor
        }, {
            type: 'input',
            name: 'amlPath',
            message: 'Where\'s the Alternate Mod Uploader installed (absolute path to the .exe)? Leave blank if you don\'t use the AML.'
        }];

        return this.prompt(prompts).then(answers => {
            this.editorConfig = {};
            this.editorConfig.editor = answers.editor;
            this.editorConfig.gamePath = answers.gamePath;
            this.editorConfig.sdkPath = answers.sdkPath;
            this.editorConfig.amlPath = answers.amlPath;
        });
    }

    writing() {
        if (this.editorConfig.editor) {
            this.fs.copy(
                this.templatePath('scripts'),
                this.destinationPath('scripts')
            );

            let editorTemplateParams = {
                // path.join uses single backslashes which causes problems in json/yml/other config files
                gamePath: this.editorConfig.gamePath.replace(/\\/g, '/'),
                sdkPath: this.editorConfig.sdkPath.replace(/\\/g, '/'),
                amlPath: this.editorConfig.amlPath.replace(/\\/g, '/'),
                modName: this.modConfigService.getSafeName()
            };

            this.fs.copyTpl(
                this.templatePath('editorConfig/template_gitignore'),
                this.destinationPath('.gitignore'),
                editorTemplateParams
            );

            // TODO: some kind of injectable service? subgenerator?
            if (this.editorConfig.editor === 'vscode') {
                this.fs.copyTpl(
                    this.templatePath('editorConfig/.vscode/tasks.json'),
                    this.destinationPath('.vscode/tasks.json'),
                    editorTemplateParams
                );
                this.fs.copyTpl(
                    this.templatePath('editorConfig/.vscode/settings.json'),
                    this.destinationPath('.vscode/settings.json'),
                    editorTemplateParams
                );
            }
            else if (this.editorConfig.editor === 'atom') {
                this.fs.copyTpl(
                    this.templatePath('editorConfig/.atom-build.yml'),
                    this.destinationPath('.atom-build.yml'),
                    editorTemplateParams
                )
            }
        }
    }
}