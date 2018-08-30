import Eventable from 'util/Eventable.js';

import { convertToDFA } from 'machine/util/convertNFA.js';
import DFA from 'machine/DFA.js';

class MachineController
{
  constructor(machineBuilder)
  {
    this.machineBuilder = machineBuilder;
    this.machineName = null;

    this.graphController = null;

    //userChangeMachine(machineBuilder, nextMachineType, prevMachineType) - when user changes machine type
    this.registerEvent("userChangeMachine");
    //userConvertMachine(machineBuilder, nextMachineType, prevMachineType) - when user converts machine type
    this.registerEvent("userConvertMachine");
    this.registerEvent("userPreConvertMachine");//Before changes
    this.registerEvent("userPostConvertMachine");//After all changes
    //userRenameMachine(machineBuilder, nextMachineName, prevMachineName) - when machine name is changed
    this.registerEvent("userRenameMachine");
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

  getMachineType()
  {
    return this.machineBuilder.getMachineType();
  }

  setMachineType(machineType)
  {
    this.machineBuilder.setMachineType(machineType);
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
      element.innerHTML = value + " - " + string.substring(separator + 1).trim();
    }
    else
    {
      element.innerHTML = value + " - " + string;
    }
  }

  renameMachine(machineName)
  {
    this.setMachineName(machineName);

    //Emit a user rename machine event
    this.emit("userRenameMachine");
  }

  changeMachineTo(machineType)
  {
    const prev = this.machineBuilder.getMachineType();
    if (prev != machineType)
    {
      this.setMachineType(machineType);

      //Emit event
      this.emit("userChangeMachine", this.machineBuilder, machineType, prev);
    }
  }

  convertMachineTo(machineType)
  {
    const currentMachineType = this.getMachineType();

    //Already converted machine...
    if (currentMachineType === machineType) return;

    if (machineType == "DFA" && currentMachineType == "NFA")
    {
      this.emit("userPrevConvertMachine", this.machineBuilder, machineType, currentMachineType);

      const result = convertToDFA(this.machineBuilder.getMachine(), new DFA());
      this.graphController.getGraph().copyMachine(result);
      this.setMachineType(machineType);

      this.emit("userConvertMachine", this.machineBuilder, currentMachineType);
      this.emit("userPostConvertMachine", this.machineBuilder, currentMachineType);
    }
    else if (machineType == "NFA" && currentMachineType == "DFA")
    {
      this.changeMachineTo(machineType);
    }
    else
    {
      throw new Error("Conversion scheme between \'" + currentMachineType + "\' to \'" + machineType + "\' is not supported");
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
Eventable.mixin(MachineController);

export default MachineController;
