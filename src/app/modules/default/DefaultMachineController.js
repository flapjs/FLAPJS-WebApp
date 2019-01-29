import AbstractMachineController from 'modules/abstract/AbstractMachineController.js';

import DefaultMachineBuilder from './DefaultMachineBuilder.js';

class DefaultMachineController extends AbstractMachineController
{
  constructor(module)
  {
    super(module, new DefaultMachineBuilder());

    this._machineName = "";
  }

  setMachineName(name) { this._machineName = name; }
  getMachineName() { return this._machineName; }
}
export default DefaultMachineController;
