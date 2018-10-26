const Generator = require('yeoman-generator');
const SafeNameService = require('../../services/service.safeName');
const ModConfigService = require('../../services/service.modConfig');
const mkdir = require('mkdirp');
require('../../lib/extensions.generator');

module.exports = class extends Generator {
    constructor(args, opts) {
        super(args, opts);

        this.modConfigService = new ModConfigService(this.createModConfigContext());
        this.safeNameService = new SafeNameService();
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
            message: 'Will your mod require the War of the Chosen expansion? Defaults to true.',
            default: true
        }, {
            type: 'input',
            name: 'name',
            message: 'What\'s your mod\'s "safe" name? (should start with a capital letter and have only letters, numbers, and underscores)',
            default: (answers) => {
                return this.safeNameService.createSafeNameFrom(answers.friendlyName);
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
        this._copyDLCInfoTemplate('X2DownloadableContentInfo.uc');
        this._createModMetadata(this.modConfigService.getFriendlyName(), this.modConfigService.getDescription(), this.modConfigService.getRequiresWotC());
        this._copyProjectFileTemplates(this.modConfigService.getSafeName(), this.modConfigService.getDescription());
        this._copyExtraGlobals();
        this._copyContentFolder();
        this._copyLocalization();
    }

    _copyLocalization() {
        let modName = this.modConfigService.getSafeName();
        this.fs.copy(
            this.templatePath(`src/MODNAME/Localization/INT/Mod.int`),
            this.destinationPath(`src/${modName}/Localization/INT/${modName}.int`)
        );

        this.fs.copy(
            this.templatePath(`src/MODNAME/Localization/INT/XComGame.int`),
            this.destinationPath(`src/${modName}/Localization/INT/XComGame.int`)
        );
    }

    _copyContentFolder() {
        let modName = this.modConfigService.getSafeName();
        mkdir(this.destinationPath(`src/${modName}/Content/`))
    }

    _copyConfigTemplate(configFileName) {
        let modName = this.modConfigService.getSafeName();
        this.fs.copyTpl(
            this.templatePath(`src/MODNAME/config/${configFileName}`),
            this.destinationPath(`src/${modName}/Config/${configFileName}`),
            { modName: modName }
        );
    }

    _copyDLCInfoTemplate(templateFileName) {
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

    _copyProjectFileTemplates(title, description) {
        let modName = this.modConfigService.getSafeName();
        this.fs.copyTpl(
            this.templatePath('src/MODNAME/Mod.x2proj'),
            this.destinationPath(`src/${modName}/${modName}.x2proj`),
            {
                modName: title,
                modDescription: description
            }
        )

        this.fs.copyTpl(
            this.templatePath('src/MODNAME/Readme.txt'),
            this.destinationPath(`src/${modName}/Readme.txt`),
            {
                modDescription: description
            }
        )

        this.fs.copy(
            this.templatePath('src/MODNAME/ModPreview.jpg'),
            this.destinationPath(`src/${modName}/ModPreview.jpg`)
        )

        this.fs.copyTpl(
            this.templatePath('Readme.md'),
            this.destinationPath('Readme.md'),
            {
                modDescription: description
            }
        )
    }

    _copyExtraGlobals() {
        let modName = this.modConfigService.getSafeName();
        this.fs.copyTpl(
            this.templatePath('src/MODNAME/Src/MODNAME/Classes/extra_globals.uci'),
            this.destinationPath(`src/${modName}/Src/${modName}/Classes/extra_globals.uci`)
        )
    }
}