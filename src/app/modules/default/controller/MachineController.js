import AbstractMachineController from 'modules/abstract/AbstractMachineController.js';

import EmptyMachineBuilder from 'modules/default/controller/EmptyMachineBuilder.js';

class MachineController extends AbstractMachineController
{
  constructor(module)
  {
    super(module, new EmptyMachineBuilder());

    this.machineName = null;

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
    return this.machineName || I18N.toString("file.untitled");
  }

  setMachineName(machineName)
  {
    if (!machineName || machineName.length <= 0)
    {
      this.machineName = null;
    }
    else
    {
      this.machineName = machineName;
    }

    const value = this.getMachineName();
    const element = document.getElementById('window-title');
    const string = element.innerHTML;
    const separator = string.indexOf('-');
    if (separator !== -1)
    {
      element.innerHTML = string.substring(0, separator).trim() + " - " + value;
    }
    else
    {
      element.innerHTML = string + " - " + value;
    }
  }

  renameMachine(machineName)
  {
    const prev = this.machineName;
    this.setMachineName(machineName);
  }
}

export default MachineController;
