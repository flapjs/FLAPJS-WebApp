import AbstractMachineController from 'modules/abstract/AbstractMachineController.js';

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
