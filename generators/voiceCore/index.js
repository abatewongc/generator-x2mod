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
        return this.prompt({
            type: 'input',
            name: 'voiceFriendlyName',
            message: 'What\'s the friendly name of the voice you\'re adding? This\'ll appear in-game, so make it awesome!',
            default: 'Donald Duck'
        }).then(answers => {
            this.voiceConfig = answers;

            let safeNameService = new SafeNameService();
            this.voiceConfig.voiceSafeName = safeNameService.createSafeNameFrom(this.voiceConfig.voiceFriendlyName);
        });
    }

    writing() {
        let modFilesService = new ModFilesService(this, this.modConfigService);

        modFilesService.copyConfigTemplate('XComContent.ini', {
            modSafeName: this.modConfigService.getSafeName(),
            voiceSafeName: this.voiceConfig.voiceSafeName
        });

        modFilesService.copyLocalizationFile({
            modSafeName: this.modConfigService.getSafeName(),
            voiceFriendlyName: this.voiceConfig.voiceFriendlyName,
            voiceSafeName: this.voiceConfig.voiceSafeName
        });

        modFilesService.copyContentFile(
            'ModSafeName_VoiceSafeName.upk',
            `${this.modConfigService.getSafeName()}_${this.voiceConfig.voiceSafeName}`
        );
    }
}