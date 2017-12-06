module.exports = class {
    constructor(defaultSafeName = 'SweetSafeName') {
        this.defaultSafeName = defaultSafeName;
    }

    createSafeNameFrom(friendlyName) {
        let result = friendlyName.replace(/[^a-zA-Z0-9_]/ig, '');

        if (!this.isSafeName(result)) {
            return this.defaultSafeName;
        }

        return result;
    }

    isSafeName(input) {
        if (/^[A-Z][\w+]*$/i.test(input)) {
            return input;
        }

        return false;
    }
}