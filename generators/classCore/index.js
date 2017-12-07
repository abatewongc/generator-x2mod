const Generator = require('yeoman-generator');
const ModConfigService = require('../../services/service.modConfig');
const ModFilesService = require('../../services/service.modFiles');
const SafeNameService = require('../../services/service.safeName');
require('../../lib/extensions.generator');

module.exports = class extends Generator {
    constructor(args, opts) {
        super(args, opts);
    }

    initializing() {
        this.modConfigService = new ModConfigService(this.createModConfigContext());
    }

    prompting() {
        return this.prompt([{
            type: 'input',
            name: 'classFriendlyName',
            message: 'What\'s the friendly name of your class? This\'ll appear in-game, so make it awesome!',
            default: 'Shooter Boom Guy'
        }, {
            type: 'input',
            name: 'classSafeName',
            message: 'What\'s the SAFE name of your class? (Standard safe name rules apply - no nutty characters, no leading numbers. You know the deal.',
            default: (answers) => {
                let safeNameService = new SafeNameService('MySweetClass');
                return safeNameService.createSafeNameFrom(answers.classFriendlyName);
            }
        }]).then(answers => {
            this.classConfig = answers;
        });
    }

    writing() {
        let modFilesService = new ModFilesService(this, this.modConfigService);
        let loadoutName = `$Loadout_Squaddie_{this.classConfig.classSafeName}`;

        modFilesService.copyConfigTemplate('XComClassData.ini', {
            classSafeName: this.classConfig.classSafeName,
            defaultLoadoutName: loadoutName
        });

        modFilesService.copyConfigTemplate('XComGameData.ini', {
            defaultLoadoutName: loadoutName
        });

        modFilesService.copyLocalizationFile({
            classFriendlyName: this.classConfig.classFriendlyName,
            classSafeName: this.classConfig.classSafeName
        });
    }
}