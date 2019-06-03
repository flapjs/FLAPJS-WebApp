const MODULE_NAME = 'empty';
const MODULE_VERSION = '1.0.0';
const MODULE_LOCALIZED_NAME = 'Empty';

class EmptyModule
{
    constructor(app)
    {
        this._app = app;
    }

    /** @override */
    initialize(app)
    {
    }

    /** @override */
    update(app)
    {
    }

    /** @override */
    destroy(app)
    {
    }

    /** @override */
    clear(app)
    {
    }

    /** @override */
    getModuleVersion() { return MODULE_VERSION; }
    /** @override */
    getModuleName() { return MODULE_NAME; }
    /** @override */
    getLocalizedModuleName() { return MODULE_LOCALIZED_NAME; }
    /** @override */
    getApp() { return this._app; }
}

export default EmptyModule;
