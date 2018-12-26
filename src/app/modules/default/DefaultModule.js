import AbstractModule from 'modules/base/AbstractModule.js';

import DefaultInputController from './DefaultInputController.js';
import DefaultGraphController from './DefaultGraphController.js';
import DefaultMachineController from './DefaultMachineController.js';

class DefaultModule extends AbstractModule
{
  constructor(app)
  {
    super(app);

    this._inputController = new DefaultInputController(this, app.getInputAdapter());
    this._graphController = new DefaultGraphController(this);
    this._machineController = new DefaultMachineController(this);
  }

  //Override
  getInputController()
  {
    return this._inputController;
  }

  //Override
  getGraphController()
  {
    return this._graphController;
  }

  //Override
  getMachineController()
  {
    return this._machineController;
  }

  //Override
  getModuleName()
  {
    return "default";
  }
}

export default DefaultModule;
