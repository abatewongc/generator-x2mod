const fs = require('fs');
const path = require('path');

module.exports = class {
    getDefaultInstallationPaths() {
        let allDrives = "CDEFGHIJKLMNOPQRSTUVWXYZAB".split("");
        let result;

        for (let i = 0; i < allDrives.length; i++) {
            result = this.checkDrive(allDrives[i]);
            if (result) {
                return this.composePaths(result);
            }
        }

        return this.composePaths("C:");
    }

    composePaths(steamDirectory) {
        return {
            gamePath: path.join(steamDirectory, 'XCOM 2'),
            sdkPath: path.join(steamDirectory, 'XCOM 2 War of the Chosen SDK')
        };
    }

    checkDrive(driveLetter) {
        var rootPath = path.join(`${driveLetter}:`, 'Steam', 'steamapps', 'common');

        if (fs.existsSync(rootPath)) {
            return rootPath;
        }
        else {
            var programFilesPath = path.join(`${driveLetter}:`, 'Program Files (x86)', 'Steam', 'steamapps', 'common');
            if (fs.existsSync(programFilesPath)) return programFilesPath;
        }

        return null;
    }
}