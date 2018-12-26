import AbstractMachineController from 'modules/base/AbstractMachineController.js';

class DefaultMachineController extends AbstractMachineController
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
