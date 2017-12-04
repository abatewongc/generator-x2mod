const Generator = require('yeoman-generator');
const DefaultInstallationPathSniffer = require('../../services/service.defaultInstallationPathSniffer');
const ModConfigService = require('../../services/service.modConfig.js');

module.exports = class extends Generator {
    constructor(args, opts) {
        super(args, opts);

        this.installationPathSniffer = new DefaultInstallationPathSniffer();
        this.modConfigContext = opts.modConfigContext;
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
        }];

        return this.prompt(prompts).then(answers => {
            this.editorConfig = {};
            this.editorConfig.editor = answers.editor;
            this.editorConfig.gamePath = answers.gamePath;
            this.editorConfig.sdkPath = answers.sdkPath;
        });
    }

    writing() {
        if (this.editorConfig.editor) {
            this.fs.copy(
                this.templatePath('scripts'),
                this.destinationPath('scripts')
            );

            // path.join uses single backslashes which causes problems in json/yml/other config files
            let modConfigService = new ModConfigService(this.modConfigContext);
            let editorTemplateParams = {
                gamePath: this.editorConfig.gamePath.replace(/\\/g, '/'),
                sdkPath: this.editorConfig.sdkPath.replace(/\\/g, '/'),
                modName: modConfigService.getSafeName()
            };

            // TODO: some kind of injectable service? subgenerator?
            if (this.editorConfig.editor === 'vscode') {
                this.fs.copyTpl(
                    this.templatePath('editorConfig/.vscode/tasks.json'),
                    this.destinationPath('.vscode/tasks.json'),
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