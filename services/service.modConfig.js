const getProperty = function (context, propertyName) {
    return context.modConfig[propertyName];
}

const setProperty = function (context, propertyName, propertyValue) {
    return context.modConfig[propertyName] = propertyValue;
}

module.exports = class {
    constructor(context) {
        this.context = context;
        this.context.modConfig = {};
    }

    getDescription() {
        return getProperty(this.context, 'description');
    }

    setDescription(description) {
        setProperty(this.context, 'description', description);
    }

    getFriendlyName() {
        return getProperty(this.context, 'friendlyName');
    }

    setFriendlyName(friendlyName) {
        setProperty(this.context, 'friendlyName', friendlyName);
    }

    getRequiresWotC() {
        return getProperty(this.context, 'requiresWotC');
    }

    setRequiresWotC(requiresWotC) {
        setProperty(this.context, 'requiresWotC', requiresWotC);
    }

    getSafeName() {
        return getProperty(this.context, 'name');
    }

    setSafeName(safeName) {
        setProperty(this.context, 'name', safeName);
    }
}