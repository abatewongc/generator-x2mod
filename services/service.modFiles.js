const Generator = require('yeoman-generator');

module.exports = class {
    constructor(generator, modConfigService) {
        this.generator = generator;
        this.modConfigService = modConfigService;
    }

    copyConfigTemplate(templateFileName, templateArgs) {
        let modName = this.modConfigService.getSafeName();
        this.generator.fs.copyTpl(
            this.generator.templatePath(`src/MODNAME/Config/${templateFileName}`),
            this.generator.destinationPath(`src/${modName}/Config/${templateFileName}`),
            templateArgs
        );
    }

    copyContentFile(contentFileName, destinationFileName = null) {
        if (!destinationFileName) destinationFileName = contentFileName;

        this.generator.fs.copy(
            this.generator.templatePath(`src/MODNAME/Content/${contentFileName}`),
            this.generator.destinationPath(`src/${this.modConfigService.getSafeName()}/Content/${destinationFileName}`)
        );
    }

    copyScriptTemplate(templateFileName) {
        let modName = this.modConfigService.getSafeName();
        this.generator.fs.copyTpl(
            this.generator.templatePath(`src/MODNAME/Src/MODNAME/Classes/${templateFileName}`),
            this.generator.destinationPath(`src/${modName}/Src/${modName}/Classes/X2DownloadableContentInfo_${modName}.uc`),
            { modName: modName }
        );
    }

    // for now we're just dealing with XComGame.int - no multilanguage support, no additional files support
    // (for now)
    copyLocalizationFile(templateArgs) {
        let modName = this.modConfigService.getSafeName();
        this.generator.fs.copyTpl(
            this.generator.templatePath('src/MODNAME/Localization/INT/XComGame.int'),
            this.generator.destinationPath(`src/${modName}/Localization/INT/XComGame.int`),
            templateArgs
        );
    }

    copyModMetadata() {
        this.generator.fs.copyTpl(
            this.generator.templatePath('src/Mod.XComMod'),
            this.generator.destinationPath(`src/${this.modConfigService.getSafeName()}.XComMod`),
            {
                modTitle: this.modConfigService.getFriendlyName(),
                modDescription: this.modConfigService.getDescription(),
                requireWotC: this.modConfigService.getRequiresWotC()
            }
        )
    }
}