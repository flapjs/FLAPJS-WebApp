class AbstractModuleMachineController
{
  constructor(module, machineBuilder)
  {
    if (!module) throw new Error("Missing module for machine controller");
    if (!machineBuilder) throw new Error("Missing machine builder for machine controller");

    this._module = module;
    this._machineBuilder = machineBuilder;
    this._machineUpdateTicks = 0;
    this._machineUpdateRate = 30;
  }

  initialize(module) {}
  destroy(module) {}

  update(module)
  {
    if (--this._machineUpdateTicks <= 0)
    {
      console.log("UPDATE");
      this._machineBuilder.update(module);
      this._machineUpdateTicks = this._machineUpdateRate;
    }
  }

  getMachineBuilder()
  {
    return this._machineBuilder;
  }

  getModule()
  {
    return this._module;
  }
}

export default AbstractModuleMachineController;
