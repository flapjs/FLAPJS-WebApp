class NodalGraphInputController
{
    constructor(currentModule)
    {
        this._module = currentModule;
        this._disabled = false;
    }

    initialize(currentModule)
    {
    }

    update(currentModule)
    {
    }

    destroy(currentModule)
    {
    }

    setDisabled(disabled) { this._disabled = disabled; }
    isDisabled() { return this._disabled; }
    getModule() { return this._module; }
}

export default NodalGraphInputController;
