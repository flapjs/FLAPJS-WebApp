import AbstractModuleMachineController from 'modules/abstract/AbstractModuleMachineController.js';

import DefaultMachineBuilder from './DefaultMachineBuilder.js';

class DefaultMachineController extends AbstractModuleMachineController
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
