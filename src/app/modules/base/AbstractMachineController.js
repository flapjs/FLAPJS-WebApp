class AbstractMachineController
{
  constructor(module, machine)
  {
    this._module = module;
    this._machine = machine;

    //throw new Error("Missing implementation for graph controller \'" + this.getModule().getModuleName() + "\'");
  }

  initialize(app) {}
  destroy(app) {}
  update(app) {}

  getMachine()
  {
    return this._machine;
  }

  getModule()
  {
    return this._module;
  }
}

export default AbstractMachineController;
