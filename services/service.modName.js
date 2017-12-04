module.exports = class {
    construtor(defaultSafeName = 'MySweetMod') {
        this.defaultSafeName = defaultSafeName;
    }

    createLegalModNameFrom(friendlyName) {
        let result = friendlyName.replace(/[^a-zA-Z0-9_]/ig, '');

        if (!this.isLegalModName(result)) {
            return this.defaultSafeName;
        }

        return result;
    }

    isLegalModName(input) {
        if (/^[A-Z][\w+]*$/i.test(input)) {
            return input;
        }

        return false;
    }
}