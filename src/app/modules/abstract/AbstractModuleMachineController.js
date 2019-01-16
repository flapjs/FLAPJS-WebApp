class AbstractModuleMachineController
{
  constructor(module)
  {
    if (!module) throw new Error("Missing module for machine controller");

    this._module = module;

    //throw new Error("Missing implementation for graph controller \'" + this.getModule().getModuleName() + "\'");
  }

  initialize(module) {}
  destroy(module) {}
  update(module) {}

  getModule()
  {
    return this._module;
  }
}

export default AbstractModuleMachineController;
