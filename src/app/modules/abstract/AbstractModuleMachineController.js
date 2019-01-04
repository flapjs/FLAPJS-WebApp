class AbstractModuleMachineController
{
  constructor(module)
  {
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
