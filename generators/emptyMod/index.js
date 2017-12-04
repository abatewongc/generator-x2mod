const Generator = require('yeoman-generator');
const ModNameService = require('../../services/service.modName');
const ModConfigService = require('../../services/service.modConfig');

module.exports = class extends Generator {
    constructor(args, opts) {
        super(args, opts);

        this.modConfigService = new ModConfigService(opts.modConfigContext);
        this.modNameService = new ModNameService();
    }

    prompting() {
        const prompts = [{
            type: 'input',
            name: 'friendlyName',
            message: 'What\'s your mod\'s friendly name? (This is what players will see on Steam.)',
            default: 'My Sweet Mod!'
        }, {
            type: 'input',
            name: 'description',
            message: 'Enter a description for your mod. (This is for Steam, too. You can leave it blank if you want.)'
        }, {
            type: 'confirm',
            name: 'requireWotC',
            message: 'Will your mod require the War of the Chosen expansion?',
            default: true
        }, {
            type: 'input',
            name: 'name',
            message: 'What\'s your mod\'s "safe" name? (should start with a capital letter and have only letters, numbers, and underscores)',
            default: (answers) => {
                return this.modNameService.createLegalModNameFrom(answers.friendlyName);
            }
        }];

        return this.prompt(prompts).then(answers => {
            this.modConfigService.setSafeName(answers.name);
            this.modConfigService.setFriendlyName(answers.friendlyName);
            this.modConfigService.setRequiresWotC(answers.requireWotC);
            this.modConfigService.setDescription(answers.description);
        });
    }


    writing() {
        this._copyConfigTemplate('XComEditor.ini');
        this._copyConfigTemplate('XComEngine.ini');
        this._copyConfigTemplate('XComGame.ini');
        this._copyScriptTemplate('X2DownloadableContentInfo.uc');
        this._createModMetadata(this.modConfigService.getFriendlyName(), this.modConfigService.getDescription(), this.modConfigService.getRequiresWotC());
    }

    _copyConfigTemplate(configFileName) {
        let modName = this.modConfigService.getSafeName();
        this.fs.copyTpl(
            this.templatePath(`src/MODNAME/config/${configFileName}`),
            this.destinationPath(`src/${modName}/Config/${configFileName}`),
            { modName: modName }
        );
    }

    _copyScriptTemplate(templateFileName) {
        let modName = this.modConfigService.getSafeName();
        this.fs.copyTpl(
            this.templatePath(`src/MODNAME/Src/MODNAME/Classes/${templateFileName}`),
            this.destinationPath(`src/${modName}/Src/${modName}/Classes/X2DownloadableContentInfo_${modName}.uc`),
            { modName: modName }
        );
    }

    _createModMetadata(title, description, requireWotC) {
        this.fs.copyTpl(
            this.templatePath('src/Mod.XComMod'),
            this.destinationPath(`src/${this.modConfigService.getSafeName()}.XComMod`),
            {
                modTitle: title,
                modDescription: description,
                requireWotC: requireWotC
            }
        )
    }
}