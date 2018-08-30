import { convertToDFA } from 'machine/util/convertNFA.js';
import DFA from 'machine/DFA.js';

class MachineController
{
  constructor(machineBuilder)
  {
    this.machineBuilder = machineBuilder;
    this.machineName = null;

    this.graphController = null;
  }

  initialize(app)
  {
    this.graphController = app.graphController;
  }

  destroy()
  {

  }

  getMachineBuilder()
  {
    return this.machineBuilder;
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
  }

  renameMachine(machineName)
  {
    this.setMachineName(machineName);

    //Emit a user rename machine event
  }

  changeMachineTo(machineType)
  {
    this.machineBuilder.setMachineType(machineType);
  }

  convertMachineTo(machineType)
  {
    const currentMachineType = this.machineBuilder.getMachineType();

    //Already converted machine...
    if (currentMachineType === machineType) return;

    if (machineType == "DFA" && currentMachineType == "NFA")
    {
      const result = convertToDFA(this.machineBuilder.getMachine(), new DFA());
      this.graphController.getGraph().copyMachine(result);
      this.machineBuilder.setMachineType(machineType);
    }
    else if (machineType == "NFA" && currentMachineType == "DFA")
    {
      this.changeMachineTo(machineType);
    }
  }

  createSymbol(symbol)
  {

  }

  deleteSymbol(symbol)
  {

  }

  renameSymbol(symbol)
  {

  }
}

export default MachineController;
