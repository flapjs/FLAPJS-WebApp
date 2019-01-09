import AbstractModuleMachineController from 'modules/abstract/AbstractModuleMachineController.js';

class DefaultMachineController extends AbstractModuleMachineController
{
  constructor(module)
  {
    super(module);

    this._machineName = "";
  }

  setMachineName(name) { this._machineName = name; }
  getMachineName() { return this._machineName; }
}
export default DefaultMachineController;
