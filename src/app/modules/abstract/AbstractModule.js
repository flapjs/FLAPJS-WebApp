class AbstractModule
{
    constructor(app)
    {
        if (!app) throw new Error('Missing app for module class');

        this._app = app;
    }
  
    getApp() { return this._app; }

    initialize(app)
    {
        if (!app) throw new Error('Missing app for module initialize');

        const inputController = this.getInputController();
        const graphController = this.getGraphController();
        const machineController = this.getMachineController();
        inputController.initialize(this);
        graphController.initialize(this);
        machineController.initialize(this);
    }

    destroy(app)
    {
        if (!app) throw new Error('Missing app for module destroy');

        const inputController = this.getInputController();
        const graphController = this.getGraphController();
        const machineController = this.getMachineController();
        machineController.destroy(this);
        graphController.destroy(this);
        inputController.destroy(this);
    }

    update(app)
    {
        if (!app) throw new Error('Missing app for module update');

        const inputController = this.getInputController();
        const graphController = this.getGraphController();
        const machineController = this.getMachineController();
        inputController.update(this);
        graphController.update(this);
        machineController.update(this);
    }

    getRenderer(renderLayer) { return null; }
    getInputController() { throw new Error('Missing input controller for module \'' + this.getModuleName() + '\''); }
    getGraphController() { throw new Error('Missing graph controller for module \'' + this.getModuleName() + '\''); }
    getMachineController() { throw new Error('Missing machine controller for module \'' + this.getModuleName() + '\''); }
    getModulePanels() { return []; }
    getModuleViews() { return []; }
    getModuleMenus() { return []; }
    getModuleVersion() { return '0.0.0'; }
    getModuleName() { throw new Error('Missing module name'); }
    getLocalizedModuleName() { return 'Module'; }
}

export default AbstractModule;
