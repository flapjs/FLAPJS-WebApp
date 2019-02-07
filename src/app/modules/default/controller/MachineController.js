import AbstractMachineController from 'modules/abstract/AbstractMachineController.js';

import EmptyMachineBuilder from 'modules/default/controller/EmptyMachineBuilder.js';

class MachineController extends AbstractMachineController
{
  constructor(module)
  {
    super(module, new EmptyMachineBuilder());
    
    this.graphController = null;
  }

  //Override
  initialize(module)
  {
    super.initialize(module);

    this.graphController = module.getGraphController();
  }

  //Override
  destroy(module)
  {
    super.destroy(module);
  }

  //Override
  update(module)
  {
    super.update(module);
  }

  getMachineName()
  {
    return this.getModule().getApp().getSession().getProjectName();
  }

  setMachineName(machineName)
  {
    this.getModule().getApp().getSession().setProjectName(machineName);
  }

  renameMachine(machineName)
  {
    this.setMachineName(machineName);
  }
}

export default MachineController;
